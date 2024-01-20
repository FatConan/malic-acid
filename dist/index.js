import I from"underscore";import"jquery";var f=class u{static guid(){function e(){return Math.floor((1+Math.random())*65536).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}static getData(e,t){return e!==null?$(e).data(t):null}static findParentTag(e,t){return u.findParentByTag(e,t)}static findParentByTag(e,t){for(;e&&e.tagName!==t.toUpperCase()&&e.tagName!==null;)e=e.parentNode;return e}static findParentByMatch(e,t){for(;e&&e.tagName!==null;){if(e.matches&&e.matches(t))return e;e=e.parentNode}return null}static parentMatches(e,t){for(;e&&e.tagName!==null;){if(e.matches){for(let r in t)if(t.hasOwnProperty(r)&&e.matches(r))return[e,r,t[r]]}e=e.parentNode}return[null,null,[]]}static match(e,t){return e&&e.matches?e.matches(t):!1}static matches(e,t){if(e&&e.matches){for(let r in t)if(t.hasOwnProperty(r)&&e.matches(r))return[e,r,t[r]]}return[null,null,[]]}static swap(e,t,r){let i=e[t];e[t]=e[r],e[r]=i}static partition(e,t,r,i){let s=e[Math.floor((i+r)/2)][t],n=r,l=i;for(;n<=l;){for(;e[n][t]<s;)n++;for(;e[l][t]>s;)l--;n<=l&&(u.swap(e,n,l),n++,l--)}return n}static quickSort(e,t,r,i){let s;return e.length>1&&(r=typeof r!="number"?0:r,i=typeof i!="number"?e.length-1:i,s=this.partition(e,t,r,i),r<s-1&&u.quickSort(e,t,r,s-1),s<i&&u.quickSort(e,t,s,i)),e}};var g=class{static getQueryVariable(e,t){let i=window.location.search.substring(1).split("&"),s=[];for(let n=0;n<i.length;n++){let l=i[n].split("=");l[0]===e&&s.push(decodeURIComponent(l[1]))}return s.length===1&&!t?s[0]:s.length===0?"":s}};var p=class{constructor(e){this.configure(e),this.hookEventListener(),this.elementHelper=f,this.requestParameters=g}configure(e){this.assimilate(e)}assimilate(e){I.extend(this,e)}hookEventListener(){window.eventHandler?this.eventHandler=window.eventHandler:this.eventHandler=null}};var b=class extends p{constructor(e){super(e),this.configure(e)}trigger(e,t){let r=new CustomEvent(e,{detail:t});window.dispatchEvent(r)}on(e,t){window.addListener(e,t)}off(e){window.removeEventListener(e)}};import"jquery";import F from"underscore";var c=class u{constructor(e){this.elementHelper=f,this.listenerGroupName=e.groupName,this.touchscreen=e.touchscreen===!0,this.debug=!1,this.nullAction=function(t){},e.loadingWarning?this.loadingWarning=e.loadingWarning:this.loadingWarning=function(){alert("Not quite ready! The page is currently loading and this function isn't quite read yet, please try again.")},this.target=$(e.target),this.listeners={},this.listenerPluginGroups={},e.groupName||this.listen()}static hookup(e){window.eventHandler||(window.eventHandler=new this(e))}static grabHandler(){if(window.eventHandler)return window.eventHandler;throw"HighLevelEventHandler has not been instantiated, or is not present at the expected location. Instantiate the  handler by calling HighLevelEventHandler.hookup({options})"}addListenerGroup(e){let t=new u({groupName:e,touchscreen:this.touchscreen});return this.listenerPluginGroups[e]=t,t}removeListenerGroup(e){delete this.listenerPluginGroups[e]}addListener(e,t){this.listeners[e]?this.listeners[e].push(t):this.listeners[e]=[t]}addNullListener(e){this.addListener(e,this.nullAction)}enableDebug(){this.debug=!0}list(){let e=function(t){for(let r in t)t.hasOwnProperty(r)&&console.log(r,t[r])};console.log("Base Listeners:"),e(this.listeners);for(let t in this.listenerPluginGroups)this.listenerPluginGroups.hasOwnProperty(t)&&(console.log(`Plugin Listeners [${t}]:`),e(this.listenerPluginGroups[t].listeners))}report(e){this.listeners.hasOwnProperty(e)?console.log(e,this.listeners[e]):console.log(`No event listeners found for ${e}`)}clearListeners(e){this.listeners.hasOwnProperty(e)&&delete this.listeners[e]}listen(){this.clickEvent="click",this.touchscreen&&"ontouchstart"in document.documentElement&&(this.clickEvent="touchstart",$("html").css("cursor","none")),this.target.on(this.clickEvent,function(e){this.debug&&console.log("HIGH LEVEL EVENT HANDLER firing on ",e);let t=e.target,r=$(t),i=!1;r.attr("href")==="#"&&(this.debug&&console.log("HIGH LEVEL EVENT HANDLER suppressing default for empty link ",e),e.preventDefault(),i=!0);let s=F.extend({},this.listeners);for(let l in this.listenerPluginGroups)this.listenerPluginGroups.hasOwnProperty(l)&&(s=F.extend(s,this.listenerPluginGroups[l].listeners));let n=this.elementHelper.parentMatches(t,s);if(n!==null&&n[0]!==null)$(n[2]).each(function(l,h){this.debug&&console.log("HIGH LEVEL EVENT HANDLER performing actions for ",n,e),h(e,{el:t,$el:r,matchedEl:n[0],$matchedEl:$(n[0]),trigger:n[1]})}.bind(this));else if(i){this.debug&&console.log("HIGH LEVEL EVENT HANDLER showing not loaded message on simple link ",e);let l=$._data(t,"events");(!l||!l.click)&&this.loadingWarning()}else this.debug&&console.log("HIGH LEVEL EVENT HANDLER taking no further action ",e)}.bind(this))}};import"jquery";import C from"underscore";var v=class u{constructor(e){this.elementHelper=f,this.listenerGroupName=e.groupName,this.debug=!1,this.nullAction=function(t){},this.target=$(e.target),this.listeners={},this.listenerPluginGroups={},e.groupName||this.listen()}static hookup(e){window.keyEventHandler||(window.keyEventHandler=new this(e))}static grabHandler(){if(window.keyEventHandler)return window.keyEventHandler;throw"HighLevelKeyPressEventHandler has not been instantiated, or is not present at the expected location. Instantiate the  handler by calling HighLevelKeyPressEventHandler.hookup({options})"}addListenerGroup(e){let t=new u({groupName:e,touchscreen:this.touchscreen});return this.listenerPluginGroups[e]=t,t}removeListenerGroup(e){delete this.listenerPluginGroups[e]}addListener(e,t){this.listeners[e]?this.listeners[e].push(t):this.listeners[e]=[t]}addNullListener(e){this.addListener(e,this.nullAction)}enableDebug(){this.debug=!0}list(){let e=function(t){for(let r in t)t.hasOwnProperty(r)&&console.log(r,t[r])};console.log("Base Listeners:"),e(this.listeners);for(let t in this.listenerPluginGroups)this.listenerPluginGroups.hasOwnProperty(t)&&(console.log(`Plugin Listeners [${t}]:`),e(this.listenerPluginGroups[t].listeners))}report(e){this.listeners.hasOwnProperty(e)?console.log(e,this.listeners[e]):console.log(`No event listeners found for ${e}`)}clearListeners(e){this.listeners.hasOwnProperty(e)&&delete this.listeners[e]}listen(){this.target.on("keyup",function(e){this.debug&&console.log("HIGH LEVEL KEY PRESS EVENT HANDLER firing on ",e);let t=e.target,r=$(t),i=C.extend({},this.listeners);for(let n in this.listenerPluginGroups)this.listenerPluginGroups.hasOwnProperty(n)&&(i=C.extend(i,this.listenerPluginGroups[n].listeners));let s=this.elementHelper.matches(t,i);s!==null&&s[0]!==null?$(s[2]).each(function(n,l){this.debug&&console.log("HIGH LEVEL KEY PRESS EVENT HANDLER performing actions for ",s,e),l(e,{el:t,$el:r,matchedEl:s[0],$matchedEl:$(s[0]),trigger:s[1]})}.bind(this)):this.debug&&console.log("HIGH LEVEL EVENT HANDLER taking no further action ",e)}.bind(this))}};import"jquery";import"jquery-ui";import D from"underscore";var N='<section id="<%- modal.id %>" class="<%- modal.class %> form modal" title="<%- modal.title %>"><div class="content"><%= modal.content %></div></section>',T=N;var w=class{constructor(e,t){this.actions=t,this.dialog=null,this.modalOptions=e;let r=$(D.template(T)({modal:this.modalOptions}));$("body").append(r);let i={autoOpen:!1,modal:!0,buttons:{Yes:function(){this.actions.yes&&this.actions.yes(),this.close()}.bind(this),No:function(){this.actions.no&&this.actions.no(),this.close()}.bind(this)},close:function(){}.bind(this)};i=D.extend(i,this.modalOptions),this.dialog=r.dialog(i)}open(){this.dialog.dialog("open")}close(){this.dialog.dialog("close"),this.modalOptions&&this.modalOptions.transient&&this.dialog.remove()}};import"jquery";import A from"underscore";var k=class extends b{constructor(){super(),this.targetTableTimeouts={},this.targetTables=$("table.sortable"),this.paginationSelectorMatch="select.pagination-manager";let t=new URL(window.location.href).searchParams.get("page");t&&$(this.paginationSelectorMatch).val(t),this.addListeners()}addListeners(){this.targetTables.each(function(e,t){this.targetTableTimeouts[e]=null;let r=$("#"+$(t).data("filterinput"));r.on("keydown",function(){this.listenForFilter(r,t,e)}.bind(this)),this.sorter(t)}.bind(this))}sorter(e){let t=$(e),r=function(i,s){return function(n){let l=n.target,h=this.elementHelper.findParentTag(l,"TH");if(h){let a=$(h);if(!a.hasClass("no-sorting")){let d="down";a.hasClass("down")&&(d="up"),s.find("thead th").removeClass("up"),s.find("thead th").removeClass("down"),a.addClass(d);let H=-1,P=0;for(let x of s.find("thead th"))if(!$(x).hasClass("no-data")){if(x===l){H=P;break}P++}this.sortTable(s,d,H)}}}.bind(this)}.bind(this);t.find("thead th").on("click",r(e,t)),t.on("change",function(i){if(i.target.matches(this.paginationSelectorMatch)){let s=new URL(window.location.href);s.searchParams.set("page",$(i.target).val()),window.location.href=s.href}}.bind(this))}sortTable(e,t,r){let i=$(e.find("th")[r]),s=[],n=e.find("tr");n=n.filter(function(h,a){let d=this.elementHelper.findParentTag(a,"TBODY");return this.elementHelper.findParentTag(a,"TABLE")===e[0]&&d!==null}.bind(this));for(let h=0;h<n.length;h++){let a=n[h].getElementsByTagName("TD")[r],d=$(a);i.hasClass("date-sortable")?s.push([h,d.data("datesorting")]):i.hasClass("alt-text")?s.push([h,d.data("alttext")]):i.hasClass("numeric")?s.push([h,parseInt(a.innerHTML.toLowerCase(),10)]):s.push([h,a?a.innerHTML.toLowerCase():""])}this.elementHelper.quickSort(s,1),t==="down"&&s.reverse();let l=[];if(n.length>0){let h=$(n[0].parentNode);for(let a=0;a<s.length;a++)l.push($(n[s[a][0]]).clone(!0));$(n).remove();for(let a=0;a<l.length;a++)h.append(l[a])}}listenForFilter(e,t,r){this.targetTableTimeouts[r]!==null&&clearTimeout(this.targetTableTimeouts[r]),this.targetTableTimeouts[r]=setTimeout(function(){this.filter(t,e.val())}.bind(this),200)}filter(e,t){let i=$(e).find("tbody tr");t=t.toLowerCase(),i.removeClass("inline-data"),this.trigger("sortableTable.filter",{text:t}),A.each(i,function(s){let n=$(s),l=n.find(".searchable");if(t){let h=!1;for(let a of l)if($(a).hasClass("alt-text")){let H=$(a).data("alttext");H&&H.toLowerCase().indexOf(t)>=0&&(h=!0)}l.text().toLowerCase().indexOf(t)>=0&&(h=!0),h||n.addClass("inline-data")}})}};import"jquery";import R from"underscore";var m=class{constructor(e){this.formElement=$(e.form),this.formDefaults=e.formDefaults!=null?e.formDefaults:{},this.autoHiddenReset=e.autoHiddenReset!=null?e.autoHiddenReset:!0,this.formSubmitRepression=e.formSubmitRepression!=null?e.formSubmitRepression:!0,this.inputRows=null,this.errorReference=null,this.inputReference=null,this.formLocked=!1,this.isDirty=!1,this.elementHelper=f,this.eventHandler=c.grabHandler(),this.formInitialPrepare(e)}formInitialPrepare(e){this.formBespokeSetup(e),this.configureFormAutocomplete(e),this.setupFormDataAndErrorHandling(e),this.formInteractivityInit(e)}formBespokeSetup(e){}trigger(e,t){let r=new CustomEvent(e,{detail:t});this.formElement[0].dispatchEvent(r)}on(e,t){this.formElement[0].addEventListener(e,t)}off(e){this.formElement[o].removeEventListener(e)}buildInputReference(e){let t={};return e.find("input,select,textarea").each(function(r,i){$(i).attr("type")!=="submit"&&(t[$(i).attr("name")]={tag:i.tagName,type:$(i).attr("type"),id:$(i).id})}.bind(this)),e.find("input[type=hidden]").each(function(r,i){t[$(i).attr("name")]={tag:i.tagName,type:$(i).attr("type"),id:$(i).attr("id")}}.bind(this)),e.find("div[contenteditable]").each(function(r,i){t[$(i).data("name")]={tag:i.tagName,type:"contenteditable",id:$(i).attr("id")}}.bind(this)),t}buildErrorReference(e){let t={};t.globalErrors=e.find(".global-errors");let r=e.find(".input-row");return r.each(function(i,s){let n=$(s),l=n.data("errorname");t[l]=n}.bind(this)),{inputRows:r,errorReference:t}}configureFormAutocomplete(e){(!e||!e.enableAutoComplete)&&this.formElement.prop("autocomplete","off")}reconfigureInputs(){let e=this.buildErrorReference(this.formElement);this.errorReference=e.errorReference,this.inputRows=e.inputRows,this.inputReference=this.buildInputReference(this.formElement)}setupFormDataAndErrorHandling(e){this.reconfigureInputs(),this.formSubmitRepression&&(this.formElement.off("submit"),this.formElement.on("submit",function(t){t.preventDefault(),this.isLocked()||(this.lock(),this.trigger("form:submitted"))}.bind(this))),this.formElement.hasClass("formErrors")||this.reset(),this.formElement.on("click",function(t){let r=t.target;(this.elementHelper.match(r,"input")||this.elementHelper.match(r,"textarea")||this.elementHelper.match(r,"select")||this.elementHelper.match(r,"option"))&&(this.isDirty=!0)}.bind(this))}dirty(){return this.isDirty}makeClean(){this.isDirty=!1,this.extraTidyUp()}extraTidyUp(){}formInteractivityInit(e){}flashForm(){this.formElement.fadeTo(100,.3,function(){$(this).fadeTo(500,1)}),this.trigger("form:flashed")}emptyErrorsFromElement(e,t){t.find("div.error").empty(),e.find(".global-errors").empty(),t.removeClass("hasError"),e.removeClass("form-error")}emptyErrors(){this.emptyErrorsFromElement(this.formElement,this.inputRows)}resetExtensions(){}reset(){this.formElement[0].reset(),this.autoHiddenReset&&this.formElement.find("input[type=hidden]").each(function(e,t){$(t).val("")}),this.isDirty=!1,this.emptyErrors(),this.resetExtensions(),this.setFormData(this.formDefaults),this.unlock(),this.trigger("form:reset")}errorExtensions(e){}addErrorsFromElement(e,t,r,i){if(this.emptyErrorsFromElement(t,r),e){if(t.addClass("formErrors"),e.global_errors){let s=e.global_errors.join("<br />");i.globalErrors.addClass("hasError"),i.globalErrors.html(s)}if(e.errors)for(let s in e.errors)e.errors.hasOwnProperty(s)&&this.addError(t,i,s,e.errors[s])}else i.globalErrors.addClass("hasError"),i.globalErrors.append("<p>An unexpected error has occurred</p>")}addErrors(e){this.addErrorsFromElement(e,this.formElement,this.inputRows,this.errorReference),e?this.errorExtensions(e):(this.errorReference.globalErrors.addClass("hasError"),this.errorReference.globalErrors.append("<p>An unexpected error has occurred</p>")),this.flashForm(),this.trigger("form:formErrors",e),this.unlock()}addError(e,t,r,i){e.addClass("formErrors");let s=t[r];s&&(s.addClass("hasError"),s.find("div.error").empty().append(i)),this.trigger("form:addError",r,i)}removeError(e,t){let r=e[t];r&&(r.removeClass("hasError"),r.find("div.error").empty())}setFormData(e,t){this.setFormDataFromElement(this.inputReference,this.formElement,this.formDefaults,this.dataIn(e),t)}setFormDataFromElement(e,t,r,i,s){let n={};r!=null&&(n=R.extend({},r)),n=R.extend(n,i);for(let l in n)n.hasOwnProperty(l)&&this.setFieldDataFromElement(l,e,t,n[l],s);s||this.trigger("form:setFormData",n)}setFieldData(e,t,r){this.setFieldDataFromElement(e,this.inputReference,this.formElement,t,r)}setFieldDataFromElement(e,t,r,i,s){let n=t[e];if(n){let l=r.find(n.tag+"[name="+e+"]");switch(n.tag){case"INPUT":switch(n.type){case"checkbox":Array.isArray(i)?l.each(function(h,a){let d=$(a);R.contains(i,""+d.val())?d.prop("checked",!0):d.prop("checked",!1)}):i?l.prop("checked",!0):l.prop("checked",!1);break;case"text":l.val(i);break;case"radio":l.each(function(h,a){let d=$(a);R.contains(i,""+d.val())||i===""+d.val()?d.prop("checked",!0):d.prop("checked",!1)});break;default:l.val(i);break}break;case"SELECT":l.val(i);break;case"TEXTAREA":l.val(i);break;case"DIV":l.text(i);break;default:l.val(i);break}}s||this.trigger("form:setFieldData",{fieldName:e,value:i})}getFieldDataFromElement(e,t,r){let i=t[e];if(i){let s=r.find(i.tag+"[name="+e+"]");switch(i.tag){case"INPUT":switch(i.type){case"checkbox":let n;return s.attr("data-disposition")==="singular"?s.attr("value")?n=s.val():n=!!s[0].checked:(n=[],s.each(function(h,a){a.checked&&n.push($(a).val())})),n;case"text":return s.val();case"radio":let l=null;return s.each(function(h,a){a.checked&&(l=$(a).val())}),l;default:return s.val()}break;case"SELECT":return s.val();case"TEXTAREA":return s.val();case"DIV":return s.html();default:return s.val()}}}getFieldData(e){return this.getFieldDataFromElement(e,this.inputReference,this.formElement)}getFormData(){let e={};for(let t in this.inputReference)e[t]=this.getFieldData(t);return this.dataOut(e)}dataIn(e){return e}dataOut(e){return e}isLocked(){return this.formLocked}lock(){this.formLocked=!0,this.trigger("form:locked")}unlock(){this.formLocked=!1,this.trigger("form:unlocked")}disableFields(e){$(e).each(function(t,r){$(r).prop("disabled",!0)})}enableFields(e){$(e).each(function(t,r){$(r).prop("disabled",!1)})}yesOrNoToBoolean(e,t,r){e[r]&&e[r]==="yes"?t[r]=!0:t[r]=!1}booleanToYesOrNo(e,t,r){e[r]?t[r]=["yes"]:t[r]=["no"]}onOrOffToBoolean(e,t,r){e[r]&&e[r][0]==="on"?t[r]=!0:t[r]=!1}};var y=class extends m{constructor(e){super(e)}formInteractivityInit(){}dataIn(e){return e}dataOut(e){return e}};import"jquery";import S from"underscore";var E=class extends m{constructor(e){super(e)}formInitialPrepare(e){this.formBespokeSetup(e),this.configureFormAutocomplete(e),this.generators=[],this.generatorAdd(),this.setupFormDataAndErrorHandling(e),this.on("form:reset",function(t){$(this.generators).each(function(r,i){i.generatorRowStore.empty()})}.bind(this)),this.formInteractivityInit(e)}unescapeTemplate(e){let t=document.createElement("textarea");t.innerHTML=e;let r=t.childNodes.length===0?"":t.childNodes[0].nodeValue;return $(t).remove(),r}generatorAdd(){let e=this.formElement.find(".generator");$(e).each(function(t,r){let i=$(r),s=this.unescapeTemplate(i.data("template")),n=f.guid();i.attr("data-generatedid",n);let l={generator:i,generatorId:n,generatorRowStore:i.find(".generator_rows"),generatorIndex:t,templateRow:S.template(s)};this.generators.push(l),this.eventHandler.addListener(`.generator[data-generatedid="${n}"] button`,function(){let h=l;return function(a,d){a.preventDefault(),this.generatorHandler(h,d.matchedEl)}.bind(this)}.bind(this)())}.bind(this))}generatorHandler(e,t){t.matches("button.add-row")?this.generatorAddRowButtonHandler(e,t,this.elementHelper.guid()):t.matches("button.delete-row")?this.generatorDeleteRowButtonHandler(e,t):this.generatorOtherButtonHandler(e,t)}generatorAddRowButtonHandler(e,t,r){e.generatorRowStore.append(e.templateRow({id:r}))}generatorDeleteRowButtonHandler(e,t){let r=this.elementHelper.findParentByMatch(t,"div.generator-input-row");r!==null&&$(r).remove()}generatorOtherButtonHandler(e,t){}addErrors(e){this.addErrorsFromElement(e,this.formElement,this.inputRows,this.errorReference),$(this.generators).each(function(t,r){let i=this.buildErrorReference(r.generator);this.addErrorsFromElement(e,r.generator,i.inputRows,i.errorReference)}.bind(this)),e?this.errorExtensions(e):(this.errorReference.globalErrors.addClass("hasError"),this.errorReference.globalErrors.append("<p>An unexpected error has occurred</p>")),this.flashForm(),this.trigger("form:formErrors",e),this.unlock()}emptyErrors(){this.emptyErrorsFromElement(this.formElement,this.inputRows),$(this.generators).each(function(e,t){let r=this.buildErrorReference(t.generator);this.emptyErrorsFromElement(t.generator,r.inputRows)}.bind(this))}findInCollation(e,t,r,i,s){let n=null;t.hasOwnProperty(s)?n=t[s]:(e.push(s),n={}),n.id=s,n[r]=i,t[s]=n}collateGenerator(e){let t=this.buildInputReference(e.generator),r=[],i={},s=[];for(let n in t){let l=n.split("_"),h=l[l.length-1],a=l.slice(0,l.length-1).join("_"),d=this.getFieldDataFromElement(n,t,e.generator);this.findInCollation(r,i,a,d,h)}return $(r).each(function(n,l){s.push(i[l])}),s}populateGenerator(e,t){let r={};$(t).each(function(s,n){this.generatorAddRowButtonHandler(e,null,n.id);for(let l in n)n.hasOwnProperty(l)&&(r[l+"_"+n.id]=n[l])}.bind(this));let i=this.buildInputReference(e.generator);this.setFormDataFromElement(i,e.generatorRowStore,{},r,!0)}};var L=class extends E{constructor(e){super(e)}formInteractivityInit(){}generatorRowOtherHandler(e,t){}dataIn(e){return e}dataOut(e){return e}};var B={ElementHelper:f},O={HighLevelEventHandler:c},V={ConfirmationModal:w},q={RequestParameters:g},M={BaseClass:p},U={dom:B,events:O,modal:V,request:q,classes:M},_=U;import W from"underscore";import"jquery";var Y=W.template("<style><%- css %></style>"),X=function(u){window&&document&&fetch(u).then(e=>{e.text().then(t=>{let i=Y({css:t});$("head").append(i)})})},K=function(u){return new URL(import.meta.url).pathname.replace("index.js",u)},G=function(){X(K("./forms/forms.css"))};var Q={formsCSS:G},z=Q;export{p as BaseClass,y as BasicForm,L as BasicFormWithGenerators,w as ConfirmationModal,f as ElementHelper,m as FormHandler,E as FormHandlerWithGenerators,c as HighLevelEventHandler,v as HighLevelKeyPressEventHandler,b as ListeningClass,k as SortableTable,z as css,_ as helpers};
//# sourceMappingURL=index.js.map
