import BaseHighLevelEventHandler from "./BaseHighLevelEventHandler.js";
import HighLevelEventHandler from "./HighLevelEventHandler.js";
import HighLevelKeyPressEventHandler from "./HighLevelKeyPressEventHandler.js";


const DEFAULT_OPTIONS = {target: "html"};

 const hookupOfType = (handlerClazz, options) => {
    if(!window.eventHandler){
        window.eventHandler = new handlerClazz(options);
    }
}

const hookup = () => {
     hookupOfType(HighLevelEventHandler, DEFAULT_OPTIONS);
}

const grabHandler = () => {
    if(window.eventHandler){
        return window.eventHandler.defaultListenerCollection;
    }
    throw "BaseHighLevelEventHandler has not been instantiated, or is not present at the expected location. Instantiate the " +
    " handler by calling BaseHighLevelEventHandler.hookup({options})";
}

const grabGlobalHandler = () => {
    if(window.eventHandler){
        return window.eventHandler;
    }
    throw "BaseHighLevelEventHandler has not been instantiated, or is not present at the expected location. Instantiate the " +
    " handler by calling BaseHighLevelEventHandler.hookup({options})";
}

const handlerOfType = (handlerClazz, options, groupName) => {
    hookupOfType(handlerClazz, options);
    if(groupName){
        return grabGlobalHandler().addListenerGroup(groupName);
    }
    return grabHandler();
}

const handler = (groupName) => {
    return handlerOfType(HighLevelEventHandler, DEFAULT_OPTIONS, groupName);
}

const dropHandler = (groupName) => {
     if(groupName) {
         grabGlobalHandler().removeListenerGroup(groupName);
     }else{
         window.eventHandler = null;
     }
}


export {
    BaseHighLevelEventHandler,
    HighLevelEventHandler,
    HighLevelKeyPressEventHandler,
    handler,
    dropHandler,
    handlerOfType,
    grabGlobalHandler,
    grabHandler,
    hookupOfType,
    hookup
};