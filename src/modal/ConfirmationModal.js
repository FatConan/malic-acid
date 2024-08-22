import "jquery";
import "jquery-ui";
import _ from "underscore";
import ConfirmationTemplate from "./templates/ConfirmationModalHTML.js";

export default class ConfirmationModal{
    constructor(modalOptions, actions){
        this.actions = actions;
        this.dialog = null;
        this.modalOptions = modalOptions;

        let evaluatedTemplate = $(_.template(ConfirmationTemplate)({modal: this.modalOptions}));
        $("body").append(evaluatedTemplate);

        let options = {
            autoOpen: false,
            modal: true,
            buttons: {
                "Yes": function() {
                    if(this.actions.yes){
                        this.actions.yes();
                    }
                    this.close();
                }.bind(this),
                "No": function() {
                    if(this.actions.no){
                        this.actions.no();
                    }
                    this.close();
                }.bind(this)
            },
            close: function(){
            }.bind(this)
        };

        options = _.extend(options, this.modalOptions);
        this.dialog = evaluatedTemplate.dialog(options);
    }

    open(){
        this.dialog.dialog("open");
    }

    close(){
        this.dialog.dialog("close");
        if(this.modalOptions && this.modalOptions.transient){
            this.dialog.remove();
        }
    }
};
