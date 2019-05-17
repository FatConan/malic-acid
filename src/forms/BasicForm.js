import FormHandler from "./FormHandler";

export default class BasicForm extends FormHandler{
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
};
