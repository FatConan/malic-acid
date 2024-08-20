import "jquery";
import "jquery-ui";
import malicacid from "malicacid";
import {handler, dropHandler, BasicForm, BasicFormWithGenerators, ConfirmationModal} from "malicacid";
import {css} from "malicacid";

css.formsCSS(); //Add form CSS
const handlerOpts = {target: "html"};
const eventHandler = handler(handlerOpts);

class BaseFormOverride extends BasicForm{
    constructor(options){
        super(options);
    }
}

class DeviceStatusForm extends BasicFormWithGenerators{
    constructor(options){
        super(options);

    }

    dataIn(data){
        let transpose = data;
        let metaDataGenerator = this.generators[0];

        this.populateGenerator(metaDataGenerator, transpose && transpose.metadata ? transpose.metadata : []);
        this.booleanToYesOrNo(data, transpose, "device_lock_state");

        return transpose;
    }

    dataOut(rawData){
        let transpose = rawData;

        this.yesOrNoToBoolean(rawData, transpose, "device_lock_state");
        let metaDataGenerator = this.generators[0];
        transpose.metadata = this.collateGenerator(metaDataGenerator);

        return transpose;
    }
}

class InteractiveForm extends BasicForm{
    constructor(options){
        super(options);
    }

    evaluate(string){
        return eval(string);
    }

    submitInteractive(){
        const showError = (error) => {
            const errorData = {
                errors: {
                    interactive_text: error
                }
            };
            this.addErrors(errorData);
        };

        let demoEventHandler = handler("demo");
        const output = this.formElement.find(".interactive-output");
        this.emptyErrors();
        let data = this.getFormData();

        try{
            let response = this.evaluate.call({"$": $, "malicacid": malicacid, "eventHandler": demoEventHandler}, data.interactive_text);
            if(response != null){
                output.val(response);
            }else{
                output.val("NO DIRECT OUTPUT - please check the console.");
            }
        }catch(error){
            showError(error);
        }
        dropHandler("demo");

        //Allow resubmissions by unlocking the forms
        this.unlock();
    }

    formInteractivityInit(){
        this.eventHandler.addListener(".interactive-test", (e, args) => {
            this.submitInteractive();
        });

        this.on("form:submitted", (e) => {
            this.submitInteractive();
        });
    }
}

const basicForm = new BaseFormOverride({form: $("#basic-form")});
const interactiveForm = new InteractiveForm({form: "#interactive_form"});
const interactiveModalTarget = $("#modal-interactive");
const interactiveModal = {
    target: interactiveModalTarget,
    form: new InteractiveForm({form: interactiveModalTarget.find("form")}),
    dialog: interactiveModalTarget.dialog({title: "Interactive Form", width: 500, autoOpen: false})
};
const form = new DeviceStatusForm({form: $("#form_device")});

const submitFunc = (e, args) => {
    alert("Submitted form JSON will be written to the console.");
    console.log(form.getFormData());
    //Allow resubmissions by unlocking the forms
    form.unlock();
};

const populateForm = (e) => {
    let content = $("#load-entry").text();
    let data = JSON.parse(content);
    form.reset();
    form.setFormData(data);
};

const loadConfirm = new ConfirmationModal({
        title: "Are you sure?",
        content: "Are you sure you want to populate this form with the data in the green text area?"
    },
    {
        yes: populateForm
    }
);

const aboutDialog = new ConfirmationModal({
        title: "About this demonstration",
        content: "This demonstration shows how Malic Acid can be used to harness an HTML form for use with a JSON rest API by allowing " +
            " the submission of form data as JSON and the population of HTML elements from a JSON API response. Malic Acid supports the processing and display of " +
            " error messages as well as adding interactivity to form components, allowing for more versatile and dynamic forms to be built. \n\n" +
            " Would you like to learn more about Malic Acid?"
    },
    {
        yes: () => {
            window.location.href = "https://github.com/FatConan/malic-acid";
        }
    }
);

//Simple demonstration of the high level event handler
eventHandler.addListener("#submit-this", submitFunc);
eventHandler.addListener("#populate-form", (e, args) => {
    loadConfirm.open();
});
eventHandler.addListener("a.about", (e, args) => {
    e.preventDefault();
    aboutDialog.open();
});

form.on("form:submitted", (e) => {
    alert("Form submission captured");
    submitFunc();
});


eventHandler.addListener("code.language-javascript", (e, args) => {
    interactiveModal.form.reset();
    const data = {interactive_text: args.$matchedEl.text()};
    interactiveModal.form.setFormData(data);
    interactiveModal.dialog.dialog("open");
    interactiveModal.form.submitInteractive();
});

//Enable the page tabs
$("body").tabs();

