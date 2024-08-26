import "jquery";

export default class ElementHelper{
    static guid(){
        const s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    static namespacedGuid(ns){
        return `${ns}-${ElementHelper.guid()}`;
    }

    static getData(element, dataLabel){
        if(element !== null){
            return $(element).data(dataLabel);
        }
        return null;
    }

    /**
     * Legacy alias for findParentByTag
     * @param element
     * @param tagName
     */
    static findParentTag(element, tagName){
        return ElementHelper.findParentByTag(element, tagName);
    }

    /**
     * Find the first element tracking up the provided element's branch that matches the provided tag string
     * @param element
     * @param tagName
     * @returns {*}
     */
    static findParentByTag(element, tagName){
        while(element && element.tagName !== tagName.toUpperCase() && element.tagName !== null){
            element = element.parentNode;
        }
        return element;
    }

    /**
     * Find the first element tracking up the provided element's branch that matches the provided string
     * @param element
     * @param match
     * @returns {null|{matches}|*}
     */
    static findParentByMatch(element, match){
        while(element && element.tagName !== null){
            if(element.matches && element.matches(match)){
                return element;
            }
            element = element.parentNode;
        }
        return null;
    }

    /**
     * Find all the elements tracking up the provided element's branch that match the provided string
     * @param element The starting element
     * @param match The string to match
     * @param reversed boolean - determine of the matched array should return reversed
     * @returns {*[]}
     */
    static finaAllParentsByMatch(element, match, reversed){
        let parents = [];
        while(element && element.tagName !== null){
            if(element.matches && element.matches(match)){
                parents.push(element);
            }
            element = element.parentNode;
        }
        if(reversed){
            parents.reverse();
        }
        return parents;
    }

    /**
     * This method is used when registering events and is used internally to track up from the target element to
     * see if we catch an match and element in its branch. We wil then return that element and any registered event actions
     * associated with it
     * @param element - A DOM element
     * @param matchObj - An event handler object
     * @returns {*[][]|({matches}|*|string)[]}
     */
    static parentMatches(element, matchObj){
        while(element && (element.tagName !== null || element === window)){
            for(const [triggerElMatch, action] of matchObj.entries()){
                if(element === triggerElMatch){
                    return [element, triggerElMatch, action];
                }
                if(element.matches && element.matches(triggerElMatch)){
                    return [element, triggerElMatch, action];
                }
            }

            element = element.parentNode;
        }
        return [null, null, []];
    }

    static match(element, matchStr){
        if(element && element.matches){
            return element.matches(matchStr);
        }
        return false;
    }

    static matches(element, matchObj){
        if(element && element.matches){
            for(let m in matchObj){
                if(matchObj.hasOwnProperty(m) && element.matches(m)){
                    return [element, m, matchObj[m]];
                }
            }
        }
        return [null, null, []];
    }

    //Methods for performing quick sort on objects, allows sorting on various items based on a given key
    static swap(items, firstIndex, secondIndex){
        let temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    static partition(items, itemKey, left, right){
        let pivot = items[Math.floor((right + left) / 2)][itemKey];
        let i = left;
        let j = right;

        while(i <= j){
            while(items[i][itemKey] < pivot){
                i++;
            }

            while(items[j][itemKey] > pivot){
                j--;
            }

            if(i <= j){
                ElementHelper.swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }

    static quickSort(items, itemKey, left, right){
        let index;
        if(items.length > 1){
            left = typeof left !== "number" ? 0 : left;
            right = typeof right !== "number" ? items.length-1 : right;
            index = this.partition(items, itemKey, left, right);
            if(left < index-1){
                ElementHelper.quickSort(items, itemKey, left, index-1);
            }
            if(index < right){
                ElementHelper.quickSort(items, itemKey, index, right);
            }
        }
        return items;
    }
}