import { FormHandlerWithGenerators } from "./FormHandlerWithGenerators";

export default class BasicFormWithGenerators extends FormHandlerWithGenerators{
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
};

