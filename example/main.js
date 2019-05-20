require.config({
    baseUrl: './dist',
    paths: {
        'malicacid': ['malicacid.bundle'],
        'malicacidcss': ['malicacidcss.bundle'],
        'jquery': ['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min'],
        'jquery-ui': ['https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min'],
        'underscore': ['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min'],
        'backbone': ['https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.0/backbone-min'],
        'text': ['https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min'],
        'domReady': ['./domReady']
    },
    shim: {
        'jquery-ui': ['jquery'],
        'underscore': {
            exports: '_'
        }
    }
});

require(["malicacid"], function(malicAcid){
    class DeviceStatusForm extends malicAcid.BasicFormWithGenerators{
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

    const form = new DeviceStatusForm({form: document.getElementsByTagName("form")[0]});
    document.getElementById("submit-this").addEventListener("click", function(e){
        console.log(form.getFormData());
    }.bind(this));
    document.getElementById("populate-form").addEventListener("click", function(e){
        let content = document.getElementById("load-entry").innerHTML;
        console.log(content);
        let data = JSON.parse(content);
        form.reset();
        form.setFormData(data);
    }.bind(this));
});



