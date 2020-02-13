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

    //Methods for performing quick sort on objects, allows sorting on various items based on a given key
    swap(items, firstIndex, secondIndex){
        let temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    partition(items, itemKey, left, right){
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
                this.swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }

    quickSort(items, itemKey, left, right){
        let index;
        if(items.length > 1){
            left = typeof left !== "number" ? 0 : left;
            right = typeof right !== "number" ? items.length-1 : right;
            index = this.partition(items, itemKey, left, right);
            if(left < index-1){
                this.quickSort(items, itemKey, left, index-1);
            }
            if(index < right){
                this.quickSort(items, itemKey, index, right);
            }
        }
        return items;
    }
}