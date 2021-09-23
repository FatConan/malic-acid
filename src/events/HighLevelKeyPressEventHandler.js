import $ from "jquery";
import _ from "lodash";
import ElementHelper from "../dom/ElementHelper";

export default class HighLevelKeyPressEventHandler{
    /** The HighLevelKeyPressEventHandler is a keypress event tracker that registers once at document level as a single listener
     * for intercepting key press events.
     * @param options An object of configuration options:
     *  {
     *      target
     *  }
     */

    constructor(options){
        this.elementHelper = ElementHelper;
        this.listenerGroupName = options.groupName;
        this.debug = false;
        this.nullAction = function(e){
        };

        this.target = $(options.target);
        this.listeners = {};
        this.listenerPluginGroups = {};
        if(!options.groupName){
            this.listen();
        }
    }

    static hookup(options){
        if(!window.keyEventHandler){
            window.keyEventHandler = new this(options);
        }
    }

    static grabHandler(){
        if(window.keyEventHandler){
            return window.keyEventHandler;
        }
        throw "HighLevelKeyPressEventHandler has not been instantiated, or is not present at the expected location. Instantiate the " +
        " handler by calling HighLevelKeyPressEventHandler.hookup({options})";
    }

    addListenerGroup(groupName){
        let newGroupListener = new HighLevelKeyPressEventHandler({groupName: groupName, touchscreen: this.touchscreen});
        this.listenerPluginGroups[groupName] = newGroupListener;
        return newGroupListener;
    }

    removeListenerGroup(groupName){
        delete this.listenerPluginGroups[groupName];
    }

    //Add a listener for a specific element and a corresponding action to take
    addListener(targetMatch, action){
        if(this.listeners[targetMatch]){
            this.listeners[targetMatch].push(action);
        }else{
            this.listeners[targetMatch] = [action];
        }
    }

    //Add a null listener. This will suppress any load warnings while not altering behavior.
    addNullListener(targetMatch){
        /* Add a null listener, used to allow elements within elements to invoke default behaviour when their parent has a listener present */
        this.addListener(targetMatch, this.nullAction);
    }

    //Show debug messaging about registered events when they fire
    enableDebug(){
        this.debug = true;
    }

    //List all the currently registered events for debug purposes
    list(){
        const listListeners = function(listenerObj){
            for(let a in listenerObj){
                if(listenerObj.hasOwnProperty(a)){
                    console.log(a,listenerObj[a]);
                }
            }
        }

        console.log("Base Listeners:");
        listListeners(this.listeners);
        for(let g in this.listenerPluginGroups){
            if(this.listenerPluginGroups.hasOwnProperty(g)){
                console.log(`Plugin Listeners [${g}]:`);
                listListeners(this.listenerPluginGroups[g].listeners);
            }
        }
    }

    report(listenerTarget){
        if(this.listeners.hasOwnProperty(listenerTarget)){
            console.log(listenerTarget, this.listeners[listenerTarget])
        }else{
            console.log(`No event listeners found for ${listenerTarget}`);
        }
    }

    clearListeners(listenerTarget){
        if(this.listeners.hasOwnProperty(listenerTarget)){
            delete this.listeners[listenerTarget];
        }
    }

    //Listens for events and the top level and performs any DOM traversal required to accommodate the the listener's intended
    //target.
    listen(){

        // Register the event on out intended top level target (this may be at the top, or on some specific container section within the DOM)
        this.target.on("keyup", function(e){
            if(this.debug){
                console.log("HIGH LEVEL KEY PRESS EVENT HANDLER firing on ", e);
            }
            const el = e.target;
            const $el = $(el);

            let activeListeners = _.extend({}, this.listeners);
            for(let group in this.listenerPluginGroups){
                if(this.listenerPluginGroups.hasOwnProperty(group)){
                    activeListeners = _.extend(activeListeners, this.listenerPluginGroups[group].listeners);
                }
            }

            //From the trigger element work up through the dom until we find an matching event handler, if we find a match return it
            // as well as the list of actions associated with it.
            let match = this.elementHelper.matches(el, activeListeners);
            if(match !== null && match[0] !== null){
                /*
                  Check to see if we have a match in the listener list for the object being clicked by tracking up through the
                  DOM until we find a match. Harvest the details of those matching elements and pass them alongside the original event to
                  the registered action function.
               */
                $(match[2]).each(function(i, action){
                    if(this.debug){
                        console.log("HIGH LEVEL KEY PRESS EVENT HANDLER performing actions for ", match, e);
                    }
                    //execute the action. Listeners registered with this system should expect two arguments (a, args)
                    //the first being the original event, the second being a collection of pre-prepared elements containing
                    //the original e.target element and its jquery extended version as well as the matched element and
                    //its jquery extended version and the string user to match the element.
                    action(e, {el: el, $el: $el, matchedEl: match[0], $matchedEl: $(match[0]), trigger: match[1]});
                }.bind(this));
            }else if(this.debug){
                /* Otherwise do nothing (or log we're doing nothing) */
                console.log("HIGH LEVEL EVENT HANDLER taking no further action ", e);
            }
        }.bind(this));
    }
}