import _ from "underscore";
import ElementHelper from "../dom/ElementHelper";
import RequestParameters from "../request/RequestParameters";

export default class BaseClass{
    //A base class that can be extended that comes fitted with some helper methods for manipulating the dom and
    //working with common features we find ourselves exploring.
    constructor(options){
        this.assimilate(options);
        this.elementHelper = new ElementHelper();
        this.hookEventListener();
        this.requestParameters = RequestParameters;
    }

    //Add options entries directly on to instance
    assimilate(options){
        _.extend(this, options);
    }

    //Add the eventHandler from window to the object so we can use it addListeners
    hookEventListener(){
        if(window.eventHandler) {
            this.eventHandler = window.eventHandler;
        }else{
            this.eventHandler = null;
        }
    }
}