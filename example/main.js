require.config({
    baseUrl: './dist',
    paths: {
        'malicacid': ['malicacid.bundle'],
        'malicacidcss': ['malicacidcss.bundle'],
        'jquery': ['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min'],
    }
});

require(["jquery", "malicacid", "malicacidcss"], function($, malicAcid){
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

    const form = new DeviceStatusForm({form: $("form")});
    $("#submit-this").on("click", function(e){
        console.log(form.getFormData());
    }.bind(this));
    $("#populate-form").on("click", function(e){
        let content = $("#load-entry").text();
        console.log(content);
        let data = JSON.parse(content);
        form.reset();
        form.setFormData(data);
    }.bind(this));
});



