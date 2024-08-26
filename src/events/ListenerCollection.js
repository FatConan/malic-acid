import ElementHelper from "../dom/ElementHelper.js";

export const NULL_ACTION = (e) => {
};

export default class ListenerCollection{
    constructor(globalEventHandler){
        this.eventHandler = globalEventHandler;
        this.defaultEvent = this.eventHandler.defaultEvent;
        this.listeners = new Map();
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

    addWindowListener(event, action){
        this.addListenerOnEvent(event, window, action);
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

        if(this.listeners.has(event)){
            if(this.listeners.get(event).has(targetMatch)){
                this.listeners.get(event).get(targetMatch).push(action);
            }else{
                this.listeners.get(event).set(targetMatch, [action]);
            }
        }else{
            this.listeners.set(event, new Map());
            this.listeners.get(event).set(targetMatch, [action]);
        }

        this.eventHandler.listen(event);
    }

    clearListeners(listenerTarget){
        this.clearListenersOnEvent(this.defaultEvent, listenerTarget);
    }

    clearListenersOnEvent(event, listenerTarget){
        if(this.listeners.has(event) && this.listeners.get(event).has(listenerTarget)){
            this.listeners.get(event).delete(listenerTarget);
        }
    }

    trigger(eventName, data){
        this.triggerWithTarget(this.eventHandler.target[0], eventName, data);
    }

    triggerWithTarget(target, eventName, data){
        let event = new CustomEvent(eventName, {bubbles: true, detail: data});
        target.dispatchEvent(event);
    }

    list(){
        let repr = [];
        for(const [event, targets] of this.listeners.entries()){
            repr.push(`Event: ${event}`);
            for(let [target, actions] of targets.entries()){
                repr.push(target, actions);
            }
        }
        return repr;
    }

    logList(){
        console.log(this.list());
    }

    textList(){
        return this.list().join("\n");
    }
}