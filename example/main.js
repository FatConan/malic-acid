require(["MalicAcid"], function(malicAcid){
    console.log(malicAcid);
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



