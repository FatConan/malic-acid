import ListenerCollection from "./ListenerCollection.js";

export default class NamespacedListenerCollection extends ListenerCollection {
    constructor(globalEventHandler, groupName){
        super(globalEventHandler);
        this.groupName = groupName;
    }
}