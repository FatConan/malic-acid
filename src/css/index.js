import _ from "underscore";
import "jquery";


const template = _.template("<style><%- css %></style>");
export const Styler = function(css_url){
    if(window && document){
        fetch(css_url).then(response => {
            response.text().then(css_text => {
                let data = {css: css_text};
                let tag = template(data);
                $("head").append(tag);
            });
        });
    }
}

export const relative_path = function(css_url){
    let path = new URL(import.meta.url);
    return path.pathname.replace("index.js", css_url);
}

export const formsCSS = function(){
    Styler(relative_path("./forms/forms.css"));
}

