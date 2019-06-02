import FormHandler from "./FormHandler";

export default class BasicForm extends FormHandler{
    constructor(options){
        super(options);
    }

    formInteractivityInit(){
        //Override this in subclasses to add any form-specific reactive behaviour
    }

    dataIn(data){
        return data;
    }

    dataOut(rawData){
        return rawData;
    }
};
