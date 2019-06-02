import FormHandlerWithGenerators from "./FormHandlerWithGenerators";

export default class BasicFormWithGenerators extends FormHandlerWithGenerators{
    constructor(options){
        super(options);
    }

    formInteractivityInit(){
        //Override this in subclasses to add form specific reactive behaviour
    }

    generatorRowOtherHandler(augmentedGenerator, target){
        //Override this in subclasses to handle additional row button clicks
    }

    dataIn(data){
        return data;
    }

    dataOut(rawData){
        return rawData;
    }
};

