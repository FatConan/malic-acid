import "jquery";
import BaseHighLevelEventHandler from "./BaseHighLevelEventHandler.js";
export default class HighLevelEventHandler extends BaseHighLevelEventHandler {
    /** The HighLevelEventHandler is a touch/click event tracker that registers once at document level as a single listener
     * for intercepting click events. It also resolved events against their intended target so that an event firing on a child
     * element but listened for at an ancestor can provide the listener with that intended ancestor to work with automatically.
     * @param options An object of configuration options:
     *  {
     *      touchscreen: true/false, //Determines whether we listen for click events or touch events by default
     *      loadingWarning: function //Which function to trigger in the event it appears that an unhandled anchor is being clicked.
     *  }
     */

    constructor(options){
        options.defaultEvent = options.touchscreen ? "touchstart" : "click";
        super(options);
        this.touchscreen = options.touchscreen === true;
    }
}