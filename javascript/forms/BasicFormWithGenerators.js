define(["common/forms/FormHandlerWithGenerators"], function(FormHandlerWithGenerators){
    return class BasicFormWithGenerators extends FormHandlerWithGenerators{
        constructor(options){
            super(options);
        }

        formInteractivityInit(){
            console.log("BasicForm version")
        }

        generatorRowOtherHandler(augmentedGenerator, target){

        }

        dataIn(data){
            return data;
        }

        dataOut(rawData){
            return rawData;
        }
    }
});
