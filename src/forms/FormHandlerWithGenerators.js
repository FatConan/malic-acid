import "jquery";
import _ from "underscore";
import FormHandler from "./FormHandler.js";
import ElementHelper from "../dom/ElementHelper.js";

export default class FormHandlerWithGenerators extends FormHandler{
    constructor(options){
        super(options);
    }

    formInitialPrepare(options){
        this.formBespokeSetup(options);
        this.configureFormAutocomplete(options);

        this.generators = [];
        this.generatorAdd();

        this.setupFormDataAndErrorHandling(options);
        this.on("form:reset", (e) => {
            $(this.generators).each(function(i, g){
                g.generatorRowStore.empty();
            });
        });

        this.formInteractivityInit(options);
    }

    unescapeTemplate(template){
        let e = document.createElement('textarea');
        e.innerHTML = template;
        let templateUnescaped = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
        $(e).remove();
        return templateUnescaped;
    }

    generatorAdd(){
        let generatorCollections = this.formElement.find(".generator");
        $(generatorCollections).each((i, generator) => {
            let $generator = $(generator);
            let template = this.unescapeTemplate($generator.data("template"));
            let generatorID = ElementHelper.guid();
            $generator.attr("data-generatedid", generatorID);

            let augmentedGenerator = {
                generator: $generator,
                generatorId: generatorID,
                generatorRowStore: $generator.find(".generator_rows"),
                generatorIndex: i,
                templateRow: _.template(template)
            };

            this.generators.push(augmentedGenerator);
            this.eventHandler.addListener(`.generator[data-generatedid="${generatorID}"] button`,  (e, args) => {
                    e.preventDefault();
                    this.generatorHandler(augmentedGenerator, args.matchedEl);
            });
        });
    }

    generatorHandler(augmentedGenerator, target){
        if(target.matches("button.add-row")){
            this.generatorAddRowButtonHandler(augmentedGenerator, target, this.elementHelper.guid());
        }else if(target.matches("button.delete-row")){
            this.generatorDeleteRowButtonHandler(augmentedGenerator, target);
        }else{
            this.generatorOtherButtonHandler(augmentedGenerator, target);
        }
    }

    generatorAddRowButtonHandler(augmentedGenerator, target, id){
        augmentedGenerator.generatorRowStore.append(augmentedGenerator.templateRow({id: id}));
    }

    generatorDeleteRowButtonHandler(augmentedGenerator, target){
         let div = this.elementHelper.findParentByMatch(target, "div.generator-input-row");
         if(div !== null){
             $(div).remove();
         }
    }

    generatorOtherButtonHandler(augmentedGenerator, target){

    }

    addErrors(errorData){
        this.addErrorsFromElement(errorData, this.formElement, this.inputRows, this.errorReference);

        $(this.generators).each(function(i, generator){
            let ref = this.buildErrorReference(generator.generator);
            this.addErrorsFromElement(errorData, generator.generator, ref.inputRows, ref.errorReference);
        }.bind(this));

        if(errorData) {
            this.errorExtensions(errorData);
        }else{
            //An unspecified error occurred
            this.errorReference.globalErrors.addClass("hasError");
            this.errorReference.globalErrors.append("<p>An unexpected error has occurred</p>");
        }

        this.flashForm();
        this.trigger("form:formErrors", errorData);
        this.unlock();
    }

    emptyErrors(){
        this.emptyErrorsFromElement(this.formElement, this.inputRows);
        $(this.generators).each(function(i, generator){
            let ref = this.buildErrorReference(generator.generator);
            this.emptyErrorsFromElement(generator.generator, ref.inputRows);
        }.bind(this));
    }

    findInCollation(collated, collatedObj, key, value, ident){
        let tuple = null;
        if(collatedObj.hasOwnProperty(ident)){
            tuple = collatedObj[ident];
        }else{
            collated.push(ident);
            tuple = {};
        }
        tuple.id = ident;
        tuple[key] = value;
        collatedObj[ident] = tuple;
    }

    collateGenerator(generator){
        let inputs = this.buildInputReference(generator.generator);
        let collated = [];
        let collatedObj = {};
        let preparedData = [];
        for(let fieldName in inputs){
            let keyLabel = fieldName.split("_");
            let ident = keyLabel[keyLabel.length-1];
            let field = keyLabel.slice(0, keyLabel.length-1).join("_");
            let val = this.getFieldDataFromElement(fieldName, inputs, generator.generator);
            this.findInCollation(collated, collatedObj, field, val, ident);
        }
        $(collated).each(function(i, ident){
            preparedData.push(collatedObj[ident]);
        });
        return preparedData;
    }

    populateGenerator(generator, data){
        let transpose = {};
        $(data).each(function(i, entry){
            this.generatorAddRowButtonHandler(generator, null, entry.id);
            for(let k in entry){
                if(entry.hasOwnProperty(k)){
                    transpose[k + "_" + entry.id] = entry[k];
                }
            }
        }.bind(this));

        let inputs = this.buildInputReference(generator.generator);
        this.setFormDataFromElement(inputs, generator.generatorRowStore, {}, transpose, true);
    }
};

