import "jquery";
import BaseHighLevelEventHandler from "./BaseHighLevelEventHandler.js";

export default class HighLevelKeyPressEventHandler extends BaseHighLevelEventHandler{
    /** The HighLevelKeyPressEventHandler is a keypress event tracker that registers once at document level as a single listener
     * for intercepting key press events.
     * @param options An object of configuration options:
     *  {
     *      target
     *  }
     */

    constructor(options){
        options.defaultEvent = "keyup";
        super(options);
    }




    //Listens for events and the top level and performs any DOM traversal required to accommodate the the listener's intended
    //target.
    /*listen(){

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
                console.log("HIGH LEVEL EVENT HANDLER taking no further action ", e);
            }
        }.bind(this));
    }*/
}