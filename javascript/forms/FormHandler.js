define(["jquery", "underscore", "backbone", "common/dom/ElementHelper"], function ($, _, Backbone, ElementHelper) {
    return class FormHandler{
        constructor(options){
            this.formElement = options.form;
            this.formDefaults = options.formDefaults ? options.formDefaults : {};
            this.autoHiddenReset = options.autoHiddenReset != null ? options.autoHiddenReset : true;
            this.formSubmitRepression = options.formSubmitRepression != null ? options.formSubmitRepression : true;

            this.inputRows = null;
            this.errorReference = null;
            this.inputReference = null;
            this.formLocked = false;
            this.isDirty = false;

            this.backbone = _.extend({}, Backbone);
            this.elementHelper = new ElementHelper();

            this.formInitialPrepare(options);
        }

        formInitialPrepare(options){
            this.configureFormAutocomplete(options);
            this.setupFormDataAndErrorHandling(options);
            this.formInteractivityInit(options);
        }

        trigger(event){
            this.backbone.trigger(event);
        }

        buildInputReference(formElement){
            let inputReference = {};
            formElement.find("input,select,textarea").each(function (i, e){
                if($(e).attr("type") !== "submit") {
                    inputReference[$(e).attr("name")] = {tag: e.tagName, type: $(e).attr("type"), id: $(e).id};
                }
            }.bind(this));

            formElement.find("input[type=hidden]").each(function (i, e){
                inputReference[$(e).attr("name")] = {tag: e.tagName, type: $(e).attr("type"), id: $(e).attr("id")};
            }.bind(this));

            return inputReference;
        }

        buildErrorReference(formElement){
            let errorReference = {};
            errorReference.globalErrors = formElement.find(".global-errors");
            let inputRows = formElement.find(".input-row");
            inputRows.each(function (i, e) {
                let $el = $(e);
                let name = $el.data("errorname");
                errorReference[name] = $el;
            }.bind(this));

            return {inputRows: inputRows, errorReference: errorReference};
        }

        configureFormAutocomplete(options){
            if(!options || !options.enableAutoComplete){
                this.formElement.prop("autocomplete", "off");
            }
        }
        setupFormDataAndErrorHandling(options){
            //Instantiate these here to avoid having them shared between instances
            const references = this.buildErrorReference(this.formElement);
            this.errorReference = references.errorReference;
            this.inputRows = references.inputRows;

            this.inputReference = this.buildInputReference(this.formElement);

            if(this.formSubmitRepression) {
                this.formElement.off("submit");
                this.formElement.on("submit", function(e){
                    e.preventDefault();
                    if(!this.isLocked()) {
                        this.lock();
                        this.trigger("form:submitted");
                    }
                }.bind(this));
            }

            if(!this.formElement.hasClass("formErrors")) {
                this.reset();
            }

            this.formElement.on("click", function(e){
                let target = e.target;
                if(this.elementHelper.match(target, "input") || this.elementHelper.match(target, "textarea") ||
                    this.elementHelper.match(target, "select") || this.elementHelper.match(target, "option")){
                    this.isDirty = true;
                }
            }.bind(this));
        }

        dirty(){
            return this.isDirty;
        }

        makeClean(){
            this.isDirty = false;
            this.extraTidyUp();
        }

        extraTidyUp(){
            //Override this in subclasses
        }

        formInteractivityInit(options){
            //Override this in subclasses
        }

        flashForm(){
            this.formElement.fadeTo(100, 0.3, function(){ $(this).fadeTo(500, 1.0); });
            this.trigger("form:flashed");
        }

        emptyErrorsFromElement(formElement, inputRows){
            inputRows.find("div.error").empty();
            formElement.find(".global-errors").empty();
            inputRows.removeClass("hasError");
            formElement.removeClass("form-error");
        }

        emptyErrors(){
            this.emptyErrorsFromElement(this.formElement, this.inputRows);
        }

        resetExtensions(){
            //Override this to perform addition actions on reset
        }

        reset(){
            this.formElement[0].reset();
            //Arg reset doesn't clear hidden fields, so make sure our implementation does.
            if(this.autoHiddenReset){
                this.formElement.find("input[type=hidden]").each(function(i, e){
                    $(e).val("");
                });
            }
            this.isDirty = false;
            this.emptyErrors();
            this.resetExtensions();
            this.setFormData(this.formDefaults);
            this.unlock();
            this.trigger("form:reset");
        }

        errorExtensions(errorData){
            //Override this to perform additional actions on error
        }

        addErrorsFromElement(errorData, formElement, inputRows, errorReference){
            this.emptyErrorsFromElement(formElement, inputRows);

            if(errorData) {
                formElement.addClass("formErrors");

                if(errorData.global_errors) {
                    let errors = errorData.global_errors.join("<br />");
                    errorReference.globalErrors.addClass("hasError");
                    errorReference.globalErrors.html(errors);
                }

                if(errorData.errors){
                    for(let fieldName in errorData.errors) {
                        if (errorData.errors.hasOwnProperty(fieldName)) {
                            this.addError(formElement, errorReference, fieldName, errorData.errors[fieldName]);
                        }
                    }
                }

            }else{
                //An unspecified error occurred
                errorReference.globalErrors.addClass("hasError");
                errorReference.globalErrors.append("<p>An unexpected error has occurred</p>");
            }
        }

        addErrors(errorData){
            this.addErrorsFromElement(errorData, this.formElement, this.inputRows, this.errorReference);

            if(errorData) {
                this.errorExtensions(errorData);
            }else{
                //An unspecified error occurred
                this.errorReference.globalErrors.addClass("hasError");
                this.errorReference.globalErrors.append("<p>An unexpected error has occurred</p>");
            }

            this.flashForm();
            this.trigger("form:formErrors", errorData);
            this.unlock();
        }

        addError(formElement, errorReference, fieldName, errorText){
            formElement.addClass("formErrors");
            let t = errorReference[fieldName];
            if(t){
                t.addClass("hasError");
                t.find("div.error").empty().append(errorText);
            }
            this.trigger("form:addError", fieldName, errorText);
        }

        removeError(errorReference, fieldName){
            let t = errorReference[fieldName];
            if(t){
                t.removeClass("hasError");
                t.find("div.error").empty();
            }
        }

        setFormData(data, silent) {
            this.setFormDataFromElement(this.inputReference, this.formElement, this.formDefaults, this.dataIn(data), silent);
        }

        setFormDataFromElement(inputReference, formElement, formDefaults, data, silent){
            let formData = {};

            if(formDefaults !== null && formDefaults !== undefined){
                formData = _.extend({}, formDefaults);
            }

            formData = _.extend(formData, data);

            for(let fieldName in formData){
                if(formData.hasOwnProperty(fieldName)){
                    this.setFieldDataFromElement(fieldName, inputReference, formElement, formData[fieldName], silent);
                }
            }

            if(!silent) {
                this.trigger("form:setFormData", formData);
            }
        }

        setFieldData(fieldData, value, silent){
            this.setFieldDataFromElement(fieldData, this.inputReference, this.formElement, value, silent);
        }

        setFieldDataFromElement(fieldName, inputReference, formElement, value, silent){
            let meta = inputReference[fieldName];
            //console.log("SET FIELD DATA", fieldName, meta);
            if(meta){
                let target = formElement.find(meta.tag + "[name=" + fieldName + "]");
                switch (meta.tag) {
                    case "INPUT":
                        switch (meta.type) {
                            case "checkbox":
                                if(Array.isArray(value)){
                                    target.each(function(i, e) {
                                        let $e = $(e);
                                        if (_.contains(value, "" + $e.val())) {
                                            $e.prop("checked", true);
                                        }else{
                                            $e.prop("checked", false);
                                        }
                                    });
                                }else if(value){
                                    target.prop("checked", true);
                                }else{
                                    target.prop("checked", false);
                                }
                                break;

                            case "text":
                                target.val(value);
                                break;
                            case "radio":
                                target.each(function(i, e){
                                    //console.log("IN RADIO CHECK", value);
                                    let $e = $(e);
                                    if (_.contains(value, "" + $e.val()) || value === "" + $e.val()){
                                        $e.prop("checked", true);
                                    }else{
                                        $e.prop("checked", false);
                                    }
                                });
                                break;
                            default:
                                target.val(value);
                                break;
                        }
                        break;

                    case "SELECT":
                        target.val(value);
                        break;
                    case "TEXTAREA":
                        target.val(value);
                        break;
                    default:
                        target.val(value);
                        break;
                }
            }
            if(!silent) {
                this.trigger("form:setFieldData", fieldName, value);
            }
        }

        getFieldDataFromElement(fieldName, inputReference, formElement){
            let meta = inputReference[fieldName];
            if(meta){
                let target = formElement.find(meta.tag + "[name=" + fieldName + "]");
                switch(meta.tag){
                    case "INPUT":
                        switch (meta.type) {
                            case "checkbox":
                                let checkVal;
                                if(target.attr("data-disposition") === "singular"){
                                    if(target.attr("value")){
                                        checkVal = target.val();
                                    }else{
                                        checkVal = target[0].checked ? true : false;
                                    }
                                }else{
                                    checkVal = [];
                                    target.each(function(i, e){
                                        if(e.checked){
                                            checkVal.push($(e).val());
                                        }
                                    });
                                }
                                return checkVal;
                            case "text":
                                return target.val();
                            case "radio":
                                let val = null;
                                target.each(function(i, e){
                                    if(e.checked){
                                        val = $(e).val();
                                    }
                                });
                                return val;
                            default:
                                return target.val();
                        }
                        break;

                    case "SELECT":
                        return target.val();
                    case "TEXTAREA":
                        return target.val();
                    default:
                        return target.val();
                }
            }
        }

        getFieldData(fieldName){
            return this.getFieldDataFromElement(fieldName, this.inputReference, this.formElement);
        }

        getFormData() {
            let rawData = {};
            for(let fieldName in this.inputReference){
                rawData[fieldName] = this.getFieldData(fieldName);
            }
            return this.dataOut(rawData);
        }

        dataIn(data) {
            return data;
        }

        dataOut(rawData) {
            return rawData;
        }

        isLocked(){
            return this.formLocked;
        }

        lock(){
            this.formLocked = true;
            this.trigger("form:locked");
        }

        unlock(){
            this.formLocked = false;
            this.trigger("form:unlocked");
        }

        disableFields(fields){
            $(fields).each(function(i, e){
                $(e).prop("disabled", true);
            });
        }

        enableFields(fields){
            $(fields).each(function(i, e){
                $(e).prop("disabled", false);
            });
        }

        yesOrNoToBoolean(dataIn, dataOut, fieldName){
            if(dataIn[fieldName] && dataIn[fieldName] === 'yes'){
                dataOut[fieldName] = true;
            }else{
                dataOut[fieldName] = false;
            }
        }

        booleanToYesOrNo(dataIn, dataOut, fieldName){
            if(dataIn[fieldName]){
                dataOut[fieldName] = ["yes"];
            }else{
                dataOut[fieldName] = ["no"];
            }
        }

        onOrOffToBoolean(dataIn, dataOut, fieldName){
            if(dataIn[fieldName] && dataIn[fieldName][0] === 'on'){
                dataOut[fieldName] = true;
            }else{
                dataOut[fieldName] = false;
            }
        }
    }
});
