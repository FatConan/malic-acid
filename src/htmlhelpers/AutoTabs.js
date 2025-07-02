import "jquery";
import "jquery-ui";

export default class AutoTabs {
    static init() {
        const tabs = $(".auto-tabs");
        if (tabs.length) {
            tabs.tabs({});
            window.autoTabs = tabs;
        }
    }
}