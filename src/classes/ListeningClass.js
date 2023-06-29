import BaseClass from "./BaseClass.js";
import ElementHelper from "../dom/ElementHelper";
import RequestParameters from "../request/RequestParameters";

export default class ListeningClass extends BaseClass{
    constructor(options){
        super(options);
        this.configure(options);
    }

    trigger(eventName, data){
        let event = new CustomEvent(eventName, {detail: data});
        window.dispatchEvent(event);
    }

    on(event, handler){
        window.addListener(event, handler);
    }

    off(event){
        window.removeEventListener(event);
    }
}