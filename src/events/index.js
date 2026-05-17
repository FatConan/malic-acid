import BaseHighLevelEventHandler from "./BaseHighLevelEventHandler.js";
import HighLevelEventHandler from "./HighLevelEventHandler.js";
import HighLevelKeyPressEventHandler from "./HighLevelKeyPressEventHandler.js";

const DEFAULT_OPTIONS = {target: window};
const DEFAULT_NAMESPACE = "default";

//Create a new Map to keep track of event handling instances
class HandlersMap {
    static create() {
        if (!window.eventHandlersMap) {
            window.eventHandlersMap = new Map();
        }
        return window.eventHandlersMap;
    }

    static destroy() {
        delete window.eventHandlersMap;
    }

    /* Methods to add namespaced event handler instances */
    static addNamedHandlerOfType(namespace, handlerClazz, options) {
        const handlerMap = HandlersMap.create();
        if (!handlerMap.has(namespace)) {
            handlerMap.set(namespace, new handlerClazz(options));
        }
    }

    static addDefaultHandlerOfType(handlerClazz, options) {
        HandlersMap.addNamedHandlerOfType(DEFAULT_NAMESPACE, handlerClazz, options);
    }

    static addDefaultHandler() {
        HandlersMap.addDefaultHandlerOfType(HighLevelEventHandler, DEFAULT_OPTIONS);
    }

    static fetchHandler(namespace) {
        const handlerMap = HandlersMap.create();
        if (handlerMap.has(namespace)) {
            return handlerMap.get(namespace);
        }
        throw "Requested namespace does not exist";
    }

    static fetchDefaultHandler() {
        return HandlersMap.fetchHandler(DEFAULT_NAMESPACE);
    }

    static dropHandlerOrCollection(namespace, groupName) {
        if (groupName) {
            HandlersMap.fetchHandler(namespace).removeListenerGroup(groupName);
        } else {
            window.eventHandlersMap.delete(namespace);
        }
    }

    static dropCollection(groupName){
        HandlersMap.dropHandlerOrCollection(DEFAULT_NAMESPACE, groupName);
    }

    /* Methods to add listerCollections to event handlers */
    static fetchOrCreateListenerGroup(namespace, handlerClazz, options, groupName) {
        HandlersMap.addNamedHandlerOfType(namespace, handlerClazz, options);
        if(groupName){
           return HandlersMap.fetchHandler(namespace).addListenerGroup(groupName);
        }
        return HandlersMap.fetchListenerCollection(namespace, null);
    }

    static fetchListenerCollection(namespace, groupName){
        const namespacedHandler = HandlersMap.fetchHandler(namespace);
        if (namespacedHandler) {
            if (groupName !== null) {
                if (namespacedHandler.namedListenerCollections().has(groupName)) {
                    return namespacedHandler.namedListenerCollections.get(groupName);
                }
            } else {
                //Grab the default collection;
                return namespacedHandler.defaultListenerCollection;
            }
        }
        throw "Requested namespace or collection group does not exist";
    }

    static fetchDefaultListenerCollectionFor(namespace){
         return HandlersMap.fetchListenerCollection(namespace, null);
    }

    static fetchDefaultListenerCollection(){
        return HandlersMap.fetchDefaultListenerCollectionFor(DEFAULT_NAMESPACE0);
    }
}

const handler = (groupName) => {
    return HandlersMap.fetchOrCreateListenerGroup(DEFAULT_NAMESPACE, HighLevelEventHandler, DEFAULT_OPTIONS, groupName);
};

const isTouchDevice = () => {
    // With a nod to https://stackoverflow.com/questions/4817029
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

/**
 * Add a handler, checking to see if the device is a touch device and
 * setting the touchscreen parameter appropriately
 * @param groupName
 * @returns {*|ListenerCollection}
 */
const handlerAutoDetect = (groupName) => {
    let options = {DEFAULT_OPTIONS}
    options.touchscreen = isTouchDevice();
    return HandlersMap.fetchOrCreateListenerGroup(DEFAULT_NAMESPACE, HighLevelEventHandler, options, groupName);
}

const dropHandler = (groupName) => {
    HandlersMap.dropHandlerOrCollection(DEFAULT_NAMESPACE, groupName);
};

export {
    BaseHighLevelEventHandler,
    HighLevelEventHandler,
    HighLevelKeyPressEventHandler,
    HandlersMap,
    handler,
    handlerAutoDetect,
    isTouchDevice,
    dropHandler
};