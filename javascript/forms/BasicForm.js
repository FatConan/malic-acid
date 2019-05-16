define(["common/forms/FormHandler"], function(FormHandler){
    return class BasicForm extends FormHandler{
        constructor(options){
            super(options);
        }

        formInteractivityInit(){
            console.log("BasicForm version")
        }

        dataIn(data){
            return data;
        }

        dataOut(rawData){
            return rawData;
        }
    }
});
