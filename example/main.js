require.config({
    baseUrl: './dist',
    paths: {
        'malicacid': ['malicacid.bundle'],
        'malicacidcss': ['malicacidcss.bundle'],
        'jquery': ['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min'],
    }
});

require(["jquery", "malicacid", "malicacidcss"], function($, malicAcid){
    malicAcid.helpers.events.HighLevelEventHandler.hookup({target: "html"});

    class BaseFormOverride extends malicAcid.forms.BasicForm{
        constructor(options){
            super(options);
        }

        formInteractivityInit(options){
            console.log("BasicForm Overridden form interactivity init");
        }
    }

    class DeviceStatusForm extends malicAcid.forms.BasicFormWithGenerators{
        constructor(options){
            super(options);

        }

        formInteractivityInit(oprions){
            console.log("Overridden form interactivity init");
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

    const basicForm = new BaseFormOverride({form: $("#basic-form")});
    const form = new DeviceStatusForm({form: $("#form_device")});
    const submitFunc =  function(e, args){
        alert("Submitted form JSON will be written to the console.");
        console.log(this.getFormData());
        //Allow resubmissions by unlocking the forms
        this.unlock();
    }.bind(form);

    const populateForm = function(e){
        let content = $("#load-entry").text();
        let data = JSON.parse(content);
        this.reset();
        this.setFormData(data);
    }.bind(form);

    const loadConfirm = new malicAcid.ConfirmationModal({
            title: "Are you sure?",
            content: "Are you sure you want to populate this form with the data in the green text area?"
        },
        {
            yes: populateForm
        }
    );

    const aboutDialog = new malicAcid.ConfirmationModal({
        title: "About this demonstration",
        content: "This demonstration shows how Malic Acid can be used to harness an HTML form for use with a JSON rest API by allowing " +
            " the submission of form data as JSON and the population of HTML elements from a JSON API response. Malic Acid supports the processing and display of " +
            " error messages as well as adding interactivity to form components, allowing for more versatile and dynamic forms to be built. \n\n" +
            " Would you like to learn more about Malic Acid?"
        },
        {
            yes: function(){
                window.location.href = "https://github.com/FatConan/malic-acid";
            }
        }
    );

    //Simple demonstration of the high level event handler
    window.eventHandler.addListener("#submit-this", submitFunc);
    window.eventHandler.addListener("#populate-form", function(e, args){
        loadConfirm.open();
    });
    window.eventHandler.addListener("a.about", function(e, args){
        e.preventDefault();
        aboutDialog.open();
    });

    form.on("form:submitted", function(e){
        alert("Form submission captured");
        submitFunc();
    });
});



