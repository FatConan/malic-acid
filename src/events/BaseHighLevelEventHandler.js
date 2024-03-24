import "jquery";
import _ from "underscore";
import ElementHelper from "../dom/ElementHelper.js";
import ListenerCollection from "./ListenerCollection.js";
import NamespacedListenerCollection from "./NamespacedListenerCollection.js";

export default class BaseHighLevelEventHandler{
    /** The HighLevelEventHandler is a touch/click event tracker that registers once at document level as a single listener
     * for intercepting click events. It also resolved events against their intended target so that an event firing on a child
     * element but listened for at an ancestor can provide the listener with that intended ancestor to work with automatically.
     * @param options An object of configuration options:
     *  {
     *      touchscreen: true/false, //Determines whether we listen for click events or touch events
     *      loadingWarning: function //Which function to trigger in the event it appears that an unhandled anchor is being clicked.
     *  }
     */

    constructor(options){
        this.defaultEvent = options.defaultEvent;
        this.elementHelper = ElementHelper;
        this.defaultListenerCollection = new ListenerCollection(this);
        this.namedListenerCollections = {};

        this.debug = options.debug;

        //We can specify in the options a loadWarning to function to fire on the event that we hit a link that looks
        //like it should have a javascript action associated with it (a link with <a href="#">) to indicator to the
        //developer that it looks like we have an unregistered event.

        //Should we actually want to a link to link to # (such as a top of page link) we can specify a null listener on that
        //element.
        if(options.loadingWarning){
            this.loadingWarning = options.loadingWarning;
        }else{
            this.loadingWarning = function(){
                alert("Not quite ready! The page is currently loading and this function isn't quite read yet, please try again.");
            };
        }

        this.target = $(options.target);
        this.eventProcessors = {};
    }

    static hookup(options){
        if(!window.eventHandler){
            window.eventHandler = new this(options);
        }
    }

    static grabHandler(){
        if(window.eventHandler){
            return window.eventHandler.defaultListenerCollection;
        }
        throw "BaseHighLevelEventHandler has not been instantiated, or is not present at the expected location. Instantiate the " +
        " handler by calling BaseHighLevelEventHandler.hookup({options})";
    }

    static grabGlobalHandler(){
        if(window.eventHandler){
            return window.eventHandler;
        }
        throw "BaseHighLevelEventHandler has not been instantiated, or is not present at the expected location. Instantiate the " +
        " handler by calling BaseHighLevelEventHandler.hookup({options})";
    }

    addListenerGroup(groupName){
        if(this.namedListenerCollections.hasOwnProperty(groupName)){
            console.warn(`Named Listener Collection ${groupName} already exists`);
            return this.namedListenerCollections[groupName];
        }
        const groupCollection =  new NamespacedListenerCollection(this, groupName);
        this.namedListenerCollections[groupName] = groupCollection;
        return groupCollection;
    }

    removeListenerGroup(groupName){
        delete this.namedListenerCollections[groupName];
    }

    //Show debug messaging about registered events when they fire
    enableDebug(){
        this.debug = true;
    }

    //List all the currently registered events for debug purposes
    list(){
        console.log("Base Listeners:");
        this.defaultListenerCollection.list();
        for(let g in this.namedListenerCollections){
            if(this.namedListenerCollections.hasOwnProperty(g)){
                console.log(`Plugin Listeners [${g}]:`);
                this.namedListenerCollections[g].list();
            }
        }
    }


    //Listens for events and the top level and performs any DOM traversal required to accommodate the the listener's intended
    //target.
    listen(event){
        /* We sometimes hit the scenario where not all of the events for a page have been registered. This means any
        javascript trigger links that have been marked up like <a href="#">Thing</a> cause the page to jump to the top.
        We can remove the href, but then they'd just do nothing instead. This listener, if triggered on such a link,
         prevents the default action of the event, then goes through its even list looking for a match.
         If it fails to find one to match said link then it pops up a "Sorry this isn't loaded yet" message prompting the user
         to try again (but it's really more of a guide to the dev that they've missed something).
         */

        const processor = (e) => {
            if(this.debug){
                console.log("HIGH LEVEL EVENT HANDLER firing on ", e);
            }

            const el = e.target;
            const $el = $(el);

            /*
                Check to see if we're looking at a link with a "#" href, in which case we know we're dealing with a
                link that's supposed to trigger a javascript event; Stop them making the page jump if nothing is loaded.
             */
            let simpleTopLink = false;
            if($el.attr("href") === "#"){
                if(this.debug){
                    console.log("HIGH LEVEL EVENT HANDLER suppressing default for empty link ", e);
                }
                e.preventDefault();
                simpleTopLink = true;
            }

            let activeListeners = _.extend({}, this.defaultListenerCollection.listeners[event]);
            for(let group in this.namedListenerCollections){
                if(this.namedListenerCollections.hasOwnProperty(group)){
                    activeListeners = _.extend(activeListeners, this.namedListenerCollections[group].listeners[event]);
                }
            }

            //From the trigger element work up through the dom until we find an matching event handler, if we find a match return it
            // as well as the list of actions associated with it.
            let match = this.elementHelper.parentMatches(el, activeListeners);
            if(match !== null && match[0] !== null){
                /*
                  Check to see if we have a match in the listener list for the object being clicked by tracking up through the
                  DOM until we find a match. Harvest the details of those matching elements and pass them alongside the original event to
                  the registered action function.
               */
                $(match[2]).each((i, action) => {
                    if(this.debug){
                        console.log("HIGH LEVEL EVENT HANDLER performing actions for ", match, e);
                    }
                    //execute the action. Listeners registered with this system should expect two arguments (a, args)
                    //the first being the original event, the second being a collection of pre-prepared elements containing
                    //the original e.target element and its jquery extended version as well as the matched element and
                    //its jquery extended version and the string user to match the element.
                    action(e, {el: el, $el: $el, matchedEl: match[0], $matchedEl: $(match[0]), trigger: match[1]});
                });
            }else if(simpleTopLink){
                /*
                    If we don't find a match, but the clicked element is a link with an href of "#" assume something else is supposed to be catching it that
                    hasn't been loaded yet (this highLevelHandler should load first, so check if there are events registered on the element) in which case just inform people that the page is still loading.
                 */
                if(this.debug){
                    console.log("HIGH LEVEL EVENT HANDLER showing not loaded message on simple link ", e);
                }
                const ev = $._data(el, 'events');
                if(!ev || !ev.click){
                    this.loadingWarning();
                }
            }else if(this.debug){
                /* Otherwise do nothing (or log we're doing nothing) */
                console.log("HIGH LEVEL EVENT HANDLER taking no further action ", e);
            }
        }

        if(!this.eventProcessors.hasOwnProperty(event)){
            console.log(`Establish the listener for ${event}`, this.target[0]);
            this.target[0].addEventListener(event, (e) => {
                processor(e);
            });
            this.eventProcessors[event] = processor;
        }
    }
}