require(["MalicAcid"], function(malicAcid){
    console.log(malicAcid);
    const form = new malicAcid.BasicFormWithGenerators({form: document.getElementsByTagName("form")[0]});
    /*$("#submit-this-garbage").on("click", function(){
        console.log(form.getFormData());
    });*/
});



