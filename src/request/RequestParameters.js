export default class RequestParameters{
    getQueryVariable(variable, preventCollapse) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        let returnArray = [];

        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] === variable) {
                returnArray.push(decodeURIComponent(pair[1]));
            }
        }

        if (returnArray.length === 1 && !preventCollapse) {
            return returnArray[0];
        } else if (returnArray.length === 0) {
            return "";
        } else {
            return returnArray;
        }
    }
}