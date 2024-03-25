import ElementHelper from "../dom/ElementHelper.js";

export const NULL_ACTION = (e) => {};

export default class ListenerCollection{
    constructor(globalEventHandler){
        this.eventHandler = globalEventHandler;
        this.defaultEvent = this.eventHandler.defaultEvent;
        this.listeners = {};
    }

    //Add a listener for a specific element and a corresponding action to take
    addListener(targetMatch, action){
        this.addListenerOnEvent(this.defaultEvent, targetMatch, action);
    }

    addNullListenerOnEvent(event, targetMatch){
        /* Add a null listener, used to allow elements within elements to invoke default behaviour when their parent has a listener present */
        this.addListenerOnEvent(event, targetMatch, NULL_ACTION);
    }

    //Add a null listener. This will suppress any load warnings while not altering behavior.
    addNullListener(targetMatch){
        /* Add a null listener, used to allow elements within elements to invoke default behaviour when their parent has a listener present */
        this.addListener(targetMatch, NULL_ACTION);
    }

    addListenerOnEvent(event, targetMatch, action){
        if(targetMatch instanceof HTMLElement){
            let meId = targetMatch.getAttribute("data-maliceventid");
            if(meId == null){
                meId = `meid-${ElementHelper.guid()}`;
                targetMatch.setAttribute("data-maliceventid", meId);
            }
            targetMatch = `${targetMatch.tagName}[data-maliceventid=${meId}]`;
        }

        if(this.listeners.hasOwnProperty(event)){
            if(this.listeners[event].hasOwnProperty(targetMatch)){
                this.listeners[event][targetMatch].push(action);
            }else{
                this.listeners[event][targetMatch] = [action];
            }
        }else{
            this.listeners[event] = {};
            this.listeners[event][targetMatch] = [action];
        }

        this.eventHandler.listen(event);
    }

    clearListeners(listenerTarget){
        this.clearListenersOnEvent(this.defaultEvent, listenerTarget);
    }

    clearListenersOnEvent(event, listenerTarget){
        if(this.listeners.hasOwnProperty(event) && this.listeners[event].hasOwnProperty(listenerTarget)){
            delete this.listeners[event][listenerTarget];
        }
    }

    trigger(eventName, data){
        this.triggerWithTarget(this.eventHandler.target[0], eventName, data);
    }

    triggerWithTarget(target, eventName, data){
        let event = new CustomEvent(eventName, {bubbles: true, detail: data});
        target.dispatchEvent(event);
        console.log(`TRIGGERED event ${eventName}`);
    }

    list(){
        for(let event in this.listeners){
            if(this.listeners.hasOwnProperty(event)){
                console.log(`Event: ${event}`);
                for(let target in this.listeners[event]){
                    if(this.listeners[event].hasOwnProperty(target)){
                        console.log(target, this.listeners[event][target]);
                    }
                }
            }
        }
    }
}