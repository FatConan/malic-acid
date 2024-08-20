import _ from "underscore";
import ElementHelper from "../dom/ElementHelper.js";
import RequestParameters from "../request/RequestParameters.js";
import {handler} from "../events/index.js";

/*
The BaseClass is designed as a starting point for writing classes that might require common MalicAcid features such as
access to an eventListener, an element helper and tools for dealing with request parameters. It also has some cheap and
cheerful methods for automatically pulling options into the class as attributes from the constructor.
 */

export default class BaseClass{
    //A base class that can be extended that comes fitted with some helper methods for manipulating the dom and
    //working with common features we find ourselves exploring.
    constructor(options){
        this.configure(options);
        this.hookEventListener();
        this.elementHelper = ElementHelper;
        this.requestParameters = RequestParameters;
    }

    //Handle option management, override this in extending classes if required to set defaults etc,
    //by default just do a straight assimilation
    configure(options){
        this.assimilate(options);
    }

    //Add options entries directly on to instance
    assimilate(options){
        _.extend(this, options);
    }

    //Add the eventHandler from window to the object so we can use it addListeners
    hookEventListener(){
        this.eventHandler = handler();
    }
}