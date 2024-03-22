import "jquery";
import "jquery-ui";
import malicacid from "malicacid";
import {HighLevelEventHandler, BasicForm, BasicFormWithGenerators, ConfirmationModal} from "malicacid";
import {css} from "malicacid";


css.formsCSS(); //Add form CSS
HighLevelEventHandler.hookup({target: "html"}); //Add a global event handler

class BaseFormOverride extends BasicForm {
    constructor(options) {
        super(options);
    }

    formInteractivityInit(options) {
        console.log("BasicForm Overridden form interactivity init");
    }
}

class DeviceStatusForm extends BasicFormWithGenerators {
    constructor(options) {
        super(options);

    }

    formInteractivityInit(options) {
        console.log("Overridden form interactivity init");
    }

    dataIn(data) {
        let transpose = data;
        let metaDataGenerator = this.generators[0];

        this.populateGenerator(metaDataGenerator, transpose && transpose.metadata ? transpose.metadata : []);
        this.booleanToYesOrNo(data, transpose, "device_lock_state");

        return transpose;
    }

    dataOut(rawData) {
        let transpose = rawData;

        this.yesOrNoToBoolean(rawData, transpose, "device_lock_state");
        let metaDataGenerator = this.generators[0];
        transpose.metadata = this.collateGenerator(metaDataGenerator);

        return transpose;
    }
}

class InteractiveForm extends BasicForm{
    constructor(options) {
        super(options);
    }
}

const basicForm = new BaseFormOverride({form: $("#basic-form")});
const interactiveForm = new InteractiveForm({form: "#interactive_form"});
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
        yes: function () {
            window.location.href = "https://github.com/FatConan/malic-acid";
        }
    }
);

//Simple demonstration of the high level event handler
window.eventHandler.addListener("#submit-this", submitFunc);
window.eventHandler.addListener("#populate-form",  (e, args) => {
    loadConfirm.open();
});
window.eventHandler.addListener("a.about", (e, args) => {
    e.preventDefault();
    aboutDialog.open();
});

form.on("form:submitted", (e) => {
    alert("Form submission captured");
    submitFunc();
});


const evaluate = (string) => {
          return eval(string);
    }
const submitInteractive = (e, args) => {
    let data = interactiveForm.getFormData()
    console.log(evaluate.call({"$": $, "malicacid": malicacid}, data.interactive_text));
    //Allow resubmissions by unlocking the forms
    interactiveForm.unlock();
};

window.eventHandler.addListener(".interactive-test", submitInteractive);

interactiveForm.on("form:submitted", (e) => {
    submitInteractive();
});

//Enable the page tabs
$("body").tabs();

