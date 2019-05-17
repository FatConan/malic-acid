import $ from "jquery";

export default class ElementHelper{
    guid(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    getData(element, dataLabel){
        if(element !== null){
            return $(element).data(dataLabel);
        }
        return null;
    }

    findParentTag(element, tagName){
        while(element && element.tagName !== tagName && element.tagName !== null){
            element = element.parentNode;
        }
        return element;
    }

    parentMatches(element, matchObj){
        while(element && element.tagName !== null){
            if(element.matches){
                for(let m in matchObj){
                    if(matchObj.hasOwnProperty(m) && element.matches(m)){
                        return [element, m, matchObj[m]];
                    }
                }
            }
            element = element.parentNode;
        }
        return [null, null, []];
    }

    match(element, matchStr){
        if(element && element.matches){
            return element.matches(matchStr);
        }
        return false;
    }
}