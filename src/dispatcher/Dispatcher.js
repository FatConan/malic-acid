import ElementHelper from "../dom/ElementHelper.js";
import HighLevelEventHandler from "../events/HighLevelEventHandler.js";

export default class Dispatcher{
    static viewCheckerAndFormatter(availableViewReference, requestedViews, options){
        let requiredViews = [];
        for(let v of requestedViews){
            if(availableViewReference[v]){
                requiredViews.push({view: availableViewReference[v], label: v, options: options});
            }
        }
        return requiredViews;
    }

    constructor(config){
        if(!(config instanceof Object)){
            throw new Error("You must specify a configuration object when creating a Dispatcher");
        }
        if(config.viewPath === undefined){
            throw new Error("You must specify a viewPath in your Dispatcher constructor, these may be null");
        }

        this.eventGroupId = ElementHelper.namespacedGuid("dispatcher");

        const globalEventHandler = HighLevelEventHandler.grabGlobalHandler();
        this.eventHandler = globalEventHandler.addListenerGroup(this.eventGroupId);

        this.target = document.createElement("script", {id: this.eventGroupId});
        document.body.append(this.target);

        this.viewPath = config.viewPath;
        this.instantiatedViews = {};
        this.failedViews = {};
        this.viewList = [];
    }

    trigger(eventName, data){
        this.eventHandler.triggerWithTarget(this.target, eventName, data);
    }

    on(eventName, action){
        this.eventHandler.addListenerOnEvent(eventName, this.target, action);
    }

    requireAndInstantiate(basePath, viewName, viewLabel,  options){
        import(`${basePath}${viewName}`).then(ViewClass => {
            this.instantiatedViews[viewLabel] = new ViewClass.default(options);
            this.trigger("dispatcher:viewloaded", viewLabel);
        }).catch(err => {
            this.failedViews[viewLabel] = options;
            this.trigger("dispatcher:viewfailed", viewLabel);
            throw err;
        });
    }

    requireAndInstantiateView(viewName, viewLabel, options){
        this.requireAndInstantiate(this.viewPath, viewName, viewLabel, options);
    }

    requireAndInstantiateViews(viewList){
        this.viewList = viewList;
        let loaded = {};
        let loadedLabels = [];
        this.on("dispatcher:viewloaded", (e) => {
            let viewLabel = e.detail;
            loaded[viewLabel] = true;
            for(let v of loadedLabels){
                if(!loaded[v]){
                    return;
                }
            }
            this.trigger("dispatcher:allviewsloaded", viewList);
        });

        for(let view of this.viewList){
            loaded[view.label] = false;
            loadedLabels.push(view.label);
            this.requireAndInstantiateView(view.view, view.label, view.options);
        }
    }
}
