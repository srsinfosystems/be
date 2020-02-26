/*! X-editable - v1.5.3 
* In-place editing with Twitter Bootstrap, jQuery UI or pure jQuery
* http://github.com/vitalets/x-editable
* Copyright (c) 2015 Vitaliy Potapov; Licensed MIT */
!function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.editableform.defaults,c),this.$div=a(b),this.options.scope||(this.options.scope=this)};b.prototype={constructor:b,initInput:function(){this.input=this.options.input,this.value=this.input.str2value(this.options.value),this.input.prerender()},initTemplate:function(){this.$form=a(a.fn.editableform.template)},initButtons:function(){var b=this.$form.find(".editable-buttons");b.append(a.fn.editableform.buttons),"bottom"===this.options.showbuttons&&b.addClass("editable-buttons-bottom")},render:function(){this.$loading=a(a.fn.editableform.loading),this.$div.empty().append(this.$loading),this.initTemplate(),this.options.showbuttons?this.initButtons():this.$form.find(".editable-buttons").remove(),this.showLoading(),this.isSaving=!1,this.$div.triggerHandler("rendering"),this.initInput(),this.$form.find("div.editable-input").append(this.input.$tpl),this.$div.append(this.$form),a.when(this.input.render()).then(a.proxy(function(){if(this.options.showbuttons||this.input.autosubmit(),this.$form.find(".editable-cancel").click(a.proxy(this.cancel,this)),this.input.error)this.error(this.input.error),this.$form.find(".editable-submit").attr("disabled",!0),this.input.$input.attr("disabled",!0),this.$form.submit(function(a){a.preventDefault()});else{this.error(!1),this.input.$input.removeAttr("disabled"),this.$form.find(".editable-submit").removeAttr("disabled");var b=null===this.value||void 0===this.value||""===this.value?this.options.defaultValue:this.value;this.input.value2input(b),this.$form.submit(a.proxy(this.submit,this))}this.$div.triggerHandler("rendered"),this.showForm(),this.input.postrender&&this.input.postrender()},this))},cancel:function(){this.$div.triggerHandler("cancel")},showLoading:function(){var a,b;this.$form?(a=this.$form.outerWidth(),b=this.$form.outerHeight(),a&&this.$loading.width(a),b&&this.$loading.height(b),this.$form.hide()):(a=this.$loading.parent().width(),a&&this.$loading.width(a)),this.$loading.show()},showForm:function(a){this.$loading.hide(),this.$form.show(),a!==!1&&this.input.activate(),this.$div.triggerHandler("show")},error:function(b){var c,d=this.$form.find(".control-group"),e=this.$form.find(".editable-error-block");if(b===!1)d.removeClass(a.fn.editableform.errorGroupClass),e.removeClass(a.fn.editableform.errorBlockClass).empty().hide();else{if(b){c=(""+b).split("\n");for(var f=0;f<c.length;f++)c[f]=a("<div>").text(c[f]).html();b=c.join("<br>")}d.addClass(a.fn.editableform.errorGroupClass),e.addClass(a.fn.editableform.errorBlockClass).html(b).show()}},submit:function(b){b.stopPropagation(),b.preventDefault();var c=this.input.input2value(),d=this.validate(c);if("object"===a.type(d)&&void 0!==d.newValue){if(c=d.newValue,this.input.value2input(c),"string"==typeof d.msg)return this.error(d.msg),void this.showForm()}else if(d)return this.error(d),void this.showForm();if(!this.options.savenochange&&this.input.value2str(c)===this.input.value2str(this.value))return void this.$div.triggerHandler("nochange");var e=this.input.value2submit(c);this.isSaving=!0,a.when(this.save(e)).done(a.proxy(function(a){this.isSaving=!1;var b="function"==typeof this.options.success?this.options.success.call(this.options.scope,a,c):null;return b===!1?(this.error(!1),void this.showForm(!1)):"string"==typeof b?(this.error(b),void this.showForm()):(b&&"object"==typeof b&&b.hasOwnProperty("newValue")&&(c=b.newValue),this.error(!1),this.value=c,void this.$div.triggerHandler("save",{newValue:c,submitValue:e,response:a}))},this)).fail(a.proxy(function(a){this.isSaving=!1;var b;b="function"==typeof this.options.error?this.options.error.call(this.options.scope,a,c):"string"==typeof a?a:a.responseText||a.statusText||"Unknown error!",this.error(b),this.showForm()},this))},save:function(b){this.options.pk=a.fn.editableutils.tryParseJson(this.options.pk,!0);var c,d="function"==typeof this.options.pk?this.options.pk.call(this.options.scope):this.options.pk,e=!!("function"==typeof this.options.url||this.options.url&&("always"===this.options.send||"auto"===this.options.send&&null!==d&&void 0!==d));return e?(this.showLoading(),c={name:this.options.name||"",value:b,pk:d},"function"==typeof this.options.params?c=this.options.params.call(this.options.scope,c):(this.options.params=a.fn.editableutils.tryParseJson(this.options.params,!0),a.extend(c,this.options.params)),"function"==typeof this.options.url?this.options.url.call(this.options.scope,c):a.ajax(a.extend({url:this.options.url,data:c,type:"POST"},this.options.ajaxOptions))):void 0},validate:function(a){return void 0===a&&(a=this.value),"function"==typeof this.options.validate?this.options.validate.call(this.options.scope,a):void 0},option:function(a,b){a in this.options&&(this.options[a]=b),"value"===a&&this.setValue(b)},setValue:function(a,b){b?this.value=this.input.str2value(a):this.value=a,this.$form&&this.$form.is(":visible")&&this.input.value2input(this.value)}},a.fn.editableform=function(c){var d=arguments;return this.each(function(){var e=a(this),f=e.data("editableform"),g="object"==typeof c&&c;f||e.data("editableform",f=new b(this,g)),"string"==typeof c&&f[c].apply(f,Array.prototype.slice.call(d,1))})},a.fn.editableform.Constructor=b,a.fn.editableform.defaults={type:"text",url:null,params:null,name:null,pk:null,value:null,defaultValue:null,send:"auto",validate:null,success:null,error:null,ajaxOptions:null,showbuttons:!0,scope:null,savenochange:!1},a.fn.editableform.template='<form class="form-inline editableform"><div class="control-group"><div><div class="editable-input"></div><div class="editable-buttons"></div></div><div class="editable-error-block"></div></div></form>',a.fn.editableform.loading='<div class="editableform-loading"></div>',a.fn.editableform.buttons='<button type="submit" class="editable-submit">ok</button><button type="button" class="editable-cancel">cancel</button>',a.fn.editableform.errorGroupClass=null,a.fn.editableform.errorBlockClass="editable-error",a.fn.editableform.engine="jquery"}(window.jQuery),function(a){"use strict";a.fn.editableutils={inherit:function(a,b){var c=function(){};c.prototype=b.prototype,a.prototype=new c,a.prototype.constructor=a,a.superclass=b.prototype},setCursorPosition:function(a,b){if(a.setSelectionRange)a.setSelectionRange(b,b);else if(a.createTextRange){var c=a.createTextRange();c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",b),c.select()}},tryParseJson:function(a,b){if("string"==typeof a&&a.length&&a.match(/^[\{\[].*[\}\]]$/))if(b)try{a=new Function("return "+a)()}catch(c){}finally{return a}else a=new Function("return "+a)();return a},sliceObj:function(b,c,d){var e,f,g={};if(!a.isArray(c)||!c.length)return g;for(var h=0;h<c.length;h++)e=c[h],b.hasOwnProperty(e)&&(g[e]=b[e]),d!==!0&&(f=e.toLowerCase(),b.hasOwnProperty(f)&&(g[e]=b[f]));return g},getConfigData:function(b){var c={};return a.each(b.data(),function(a,b){("object"!=typeof b||b&&"object"==typeof b&&(b.constructor===Object||b.constructor===Array))&&(c[a]=b)}),c},objectKeys:function(a){if(Object.keys)return Object.keys(a);if(a!==Object(a))throw new TypeError("Object.keys called on a non-object");var b,c=[];for(b in a)Object.prototype.hasOwnProperty.call(a,b)&&c.push(b);return c},escape:function(b){return a("<div>").text(b).html()},itemsByValue:function(b,c,d){if(!c||null===b)return[];if("function"!=typeof d){var e=d||"value";d=function(a){return a[e]}}var f=a.isArray(b),g=[],h=this;return a.each(c,function(c,e){if(e.children)g=g.concat(h.itemsByValue(b,e.children,d));else if(f)a.grep(b,function(a){return a==(e&&"object"==typeof e?d(e):e)}).length&&g.push(e);else{var i=e&&"object"==typeof e?d(e):e;b==i&&g.push(e)}}),g},createInput:function(b){var c,d,e,f=b.type;return"date"===f&&("inline"===b.mode?a.fn.editabletypes.datefield?f="datefield":a.fn.editabletypes.dateuifield&&(f="dateuifield"):a.fn.editabletypes.date?f="date":a.fn.editabletypes.dateui&&(f="dateui"),"date"!==f||a.fn.editabletypes.date||(f="combodate")),"datetime"===f&&"inline"===b.mode&&(f="datetimefield"),"wysihtml5"!==f||a.fn.editabletypes[f]||(f="textarea"),"function"==typeof a.fn.editabletypes[f]?(c=a.fn.editabletypes[f],d=this.sliceObj(b,this.objectKeys(c.defaults)),e=new c(d)):(a.error("Unknown type: "+f),!1)},supportsTransitions:function(){var a=document.body||document.documentElement,b=a.style,c="transition",d=["Moz","Webkit","Khtml","O","ms"];if("string"==typeof b[c])return!0;c=c.charAt(0).toUpperCase()+c.substr(1);for(var e=0;e<d.length;e++)if("string"==typeof b[d[e]+c])return!0;return!1}}}(window.jQuery),function(a){"use strict";var b=function(a,b){this.init(a,b)},c=function(a,b){this.init(a,b)};b.prototype={containerName:null,containerDataName:null,innerCss:null,containerClass:"editable-container editable-popup",defaults:{},init:function(c,d){this.$element=a(c),this.options=a.extend({},a.fn.editableContainer.defaults,d),this.splitOptions(),this.formOptions.scope=this.$element[0],this.initContainer(),this.delayedHide=!1,this.$element.on("destroyed",a.proxy(function(){this.destroy()},this)),a(document).data("editable-handlers-attached")||(a(document).on("keyup.editable",function(b){27===b.which&&a(".editable-open").editableContainer("hide")}),a(document).on("click.editable",function(c){var d,e=a(c.target),f=[".editable-container",".ui-datepicker-header",".datepicker",".modal-backdrop",".bootstrap-wysihtml5-insert-image-modal",".bootstrap-wysihtml5-insert-link-modal"];if(!a(".select2-drop-mask").is(":visible")&&a.contains(document.documentElement,c.target)&&!e.is(document)){for(d=0;d<f.length;d++)if(e.is(f[d])||e.parents(f[d]).length)return;b.prototype.closeOthers(c.target)}}),a(document).data("editable-handlers-attached",!0))},splitOptions:function(){if(this.containerOptions={},this.formOptions={},!a.fn[this.containerName])throw new Error(this.containerName+" not found. Have you included corresponding js file?");for(var b in this.options)b in this.defaults?this.containerOptions[b]=this.options[b]:this.formOptions[b]=this.options[b]},tip:function(){return this.container()?this.container().$tip:null},container:function(){var a;return this.containerDataName&&(a=this.$element.data(this.containerDataName))?a:a=this.$element.data(this.containerName)},call:function(){this.$element[this.containerName].apply(this.$element,arguments)},initContainer:function(){this.call(this.containerOptions)},renderForm:function(){this.$form.editableform(this.formOptions).on({save:a.proxy(this.save,this),nochange:a.proxy(function(){this.hide("nochange")},this),cancel:a.proxy(function(){this.hide("cancel")},this),show:a.proxy(function(){this.delayedHide?(this.hide(this.delayedHide.reason),this.delayedHide=!1):this.setPosition()},this),rendering:a.proxy(this.setPosition,this),resize:a.proxy(this.setPosition,this),rendered:a.proxy(function(){this.$element.triggerHandler("shown",a(this.options.scope).data("editable"))},this)}).editableform("render")},show:function(b){this.$element.addClass("editable-open"),b!==!1&&this.closeOthers(this.$element[0]),this.innerShow(),this.tip().addClass(this.containerClass),this.$form,this.$form=a("<div>"),this.tip().is(this.innerCss)?this.tip().append(this.$form):this.tip().find(this.innerCss).append(this.$form),this.renderForm()},hide:function(a){if(this.tip()&&this.tip().is(":visible")&&this.$element.hasClass("editable-open")){if(this.$form.data("editableform").isSaving)return void(this.delayedHide={reason:a});this.delayedHide=!1,this.$element.removeClass("editable-open"),this.innerHide(),this.$element.triggerHandler("hidden",a||"manual")}},innerShow:function(){},innerHide:function(){},toggle:function(a){this.container()&&this.tip()&&this.tip().is(":visible")?this.hide():this.show(a)},setPosition:function(){},save:function(a,b){this.$element.triggerHandler("save",b),this.hide("save")},option:function(a,b){this.options[a]=b,a in this.containerOptions?(this.containerOptions[a]=b,this.setContainerOption(a,b)):(this.formOptions[a]=b,this.$form&&this.$form.editableform("option",a,b))},setContainerOption:function(a,b){this.call("option",a,b)},destroy:function(){this.hide(),this.innerDestroy(),this.$element.off("destroyed"),this.$element.removeData("editableContainer")},innerDestroy:function(){},closeOthers:function(b){a(".editable-open").each(function(c,d){if(d!==b&&!a(d).find(b).length){var e=a(d),f=e.data("editableContainer");f&&("cancel"===f.options.onblur?e.data("editableContainer").hide("onblur"):"submit"===f.options.onblur&&e.data("editableContainer").tip().find("form").submit())}})},activate:function(){this.tip&&this.tip().is(":visible")&&this.$form&&this.$form.data("editableform").input.activate()}},a.fn.editableContainer=function(d){var e=arguments;return this.each(function(){var f=a(this),g="editableContainer",h=f.data(g),i="object"==typeof d&&d,j="inline"===i.mode?c:b;h||f.data(g,h=new j(this,i)),"string"==typeof d&&h[d].apply(h,Array.prototype.slice.call(e,1))})},a.fn.editableContainer.Popup=b,a.fn.editableContainer.Inline=c,a.fn.editableContainer.defaults={value:null,placement:"top",autohide:!0,onblur:"cancel",anim:!1,mode:"popup"},jQuery.event.special.destroyed={remove:function(a){a.handler&&a.handler()}}}(window.jQuery),function(a){"use strict";a.extend(a.fn.editableContainer.Inline.prototype,a.fn.editableContainer.Popup.prototype,{containerName:"editableform",innerCss:".editable-inline",containerClass:"editable-container editable-inline",initContainer:function(){this.$tip=a("<span></span>"),this.options.anim||(this.options.anim=0)},splitOptions:function(){this.containerOptions={},this.formOptions=this.options},tip:function(){return this.$tip},innerShow:function(){this.$element.hide(),this.tip().insertAfter(this.$element).show()},innerHide:function(){this.$tip.hide(this.options.anim,a.proxy(function(){this.$element.show(),this.innerDestroy()},this))},innerDestroy:function(){this.tip()&&this.tip().empty().remove()}})}(window.jQuery),function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.editable.defaults,c,a.fn.editableutils.getConfigData(this.$element)),this.options.selector?this.initLive():this.init(),this.options.highlight&&!a.fn.editableutils.supportsTransitions()&&(this.options.highlight=!1)};b.prototype={constructor:b,init:function(){var b,c=!1;if(this.options.name=this.options.name||this.$element.attr("id"),this.options.scope=this.$element[0],this.input=a.fn.editableutils.createInput(this.options),this.input){switch(void 0===this.options.value||null===this.options.value?(this.value=this.input.html2value(a.trim(this.$element.html())),c=!0):(this.options.value=a.fn.editableutils.tryParseJson(this.options.value,!0),"string"==typeof this.options.value?this.value=this.input.str2value(this.options.value):this.value=this.options.value),this.$element.addClass("editable"),"textarea"===this.input.type&&this.$element.addClass("editable-pre-wrapped"),"manual"!==this.options.toggle?(this.$element.addClass("editable-click"),this.$element.on(this.options.toggle+".editable",a.proxy(function(a){if(this.options.disabled||a.preventDefault(),"mouseenter"===this.options.toggle)this.show();else{var b="click"!==this.options.toggle;this.toggle(b)}},this))):this.$element.attr("tabindex",-1),"function"==typeof this.options.display&&(this.options.autotext="always"),this.options.autotext){case"always":b=!0;break;case"auto":b=!a.trim(this.$element.text()).length&&null!==this.value&&void 0!==this.value&&!c;break;default:b=!1}a.when(b?this.render():!0).then(a.proxy(function(){this.options.disabled?this.disable():this.enable(),this.$element.triggerHandler("init",this)},this))}},initLive:function(){var b=this.options.selector;this.options.selector=!1,this.options.autotext="never",this.$element.on(this.options.toggle+".editable",b,a.proxy(function(b){var c=a(b.target);c.data("editable")||(c.hasClass(this.options.emptyclass)&&c.empty(),c.editable(this.options).trigger(b))},this))},render:function(a){return this.options.display!==!1?this.input.value2htmlFinal?this.input.value2html(this.value,this.$element[0],this.options.display,a):"function"==typeof this.options.display?this.options.display.call(this.$element[0],this.value,a):this.input.value2html(this.value,this.$element[0]):void 0},enable:function(){this.options.disabled=!1,this.$element.removeClass("editable-disabled"),this.handleEmpty(this.isEmpty),"manual"!==this.options.toggle&&"-1"===this.$element.attr("tabindex")&&this.$element.removeAttr("tabindex")},disable:function(){this.options.disabled=!0,this.hide(),this.$element.addClass("editable-disabled"),this.handleEmpty(this.isEmpty),this.$element.attr("tabindex",-1)},toggleDisabled:function(){this.options.disabled?this.enable():this.disable()},option:function(b,c){return b&&"object"==typeof b?void a.each(b,a.proxy(function(b,c){this.option(a.trim(b),c)},this)):(this.options[b]=c,"disabled"===b?c?this.disable():this.enable():("value"===b&&this.setValue(c),this.container&&this.container.option(b,c),void(this.input.option&&this.input.option(b,c))))},handleEmpty:function(b){this.options.display!==!1&&(void 0!==b?this.isEmpty=b:"function"==typeof this.input.isEmpty?this.isEmpty=this.input.isEmpty(this.$element):this.isEmpty=""===a.trim(this.$element.html()),this.options.disabled?this.isEmpty&&(this.$element.empty(),this.options.emptyclass&&this.$element.removeClass(this.options.emptyclass)):this.isEmpty?(this.$element.html(this.options.emptytext),this.options.emptyclass&&this.$element.addClass(this.options.emptyclass)):this.options.emptyclass&&this.$element.removeClass(this.options.emptyclass))},show:function(b){if(!this.options.disabled){if(this.container){if(this.container.tip().is(":visible"))return}else{var c=a.extend({},this.options,{value:this.value,input:this.input});this.$element.editableContainer(c),this.$element.on("save.internal",a.proxy(this.save,this)),this.container=this.$element.data("editableContainer")}this.container.show(b)}},hide:function(){this.container&&this.container.hide()},toggle:function(a){this.container&&this.container.tip().is(":visible")?this.hide():this.show(a)},save:function(a,b){if(this.options.unsavedclass){var c=!1;c=c||"function"==typeof this.options.url,c=c||this.options.display===!1,c=c||void 0!==b.response,c=c||this.options.savenochange&&this.input.value2str(this.value)!==this.input.value2str(b.newValue),c?this.$element.removeClass(this.options.unsavedclass):this.$element.addClass(this.options.unsavedclass)}if(this.options.highlight){var d=this.$element,e=d.css("background-color");d.css("background-color",this.options.highlight),setTimeout(function(){"transparent"===e&&(e=""),d.css("background-color",e),d.addClass("editable-bg-transition"),setTimeout(function(){d.removeClass("editable-bg-transition")},1700)},10)}this.setValue(b.newValue,!1,b.response)},validate:function(){return"function"==typeof this.options.validate?this.options.validate.call(this,this.value):void 0},setValue:function(b,c,d){c?this.value=this.input.str2value(b):this.value=b,this.container&&this.container.option("value",this.value),a.when(this.render(d)).then(a.proxy(function(){this.handleEmpty()},this))},activate:function(){this.container&&this.container.activate()},destroy:function(){this.disable(),this.container&&this.container.destroy(),this.input.destroy(),"manual"!==this.options.toggle&&(this.$element.removeClass("editable-click"),this.$element.off(this.options.toggle+".editable")),this.$element.off("save.internal"),this.$element.removeClass("editable editable-open editable-disabled"),this.$element.removeData("editable")}},a.fn.editable=function(c){var d={},e=arguments,f="editable";switch(c){case"validate":return this.each(function(){var b,c=a(this),e=c.data(f);e&&(b=e.validate())&&(d[e.options.name]=b)}),d;case"getValue":return 2===arguments.length&&arguments[1]===!0?d=this.eq(0).data(f).value:this.each(function(){var b=a(this),c=b.data(f);c&&void 0!==c.value&&null!==c.value&&(d[c.options.name]=c.input.value2submit(c.value))}),d;case"submit":var g=arguments[1]||{},h=this,i=this.editable("validate");if(a.isEmptyObject(i)){var j={};if(1===h.length){var k=h.data("editable"),l={name:k.options.name||"",value:k.input.value2submit(k.value),pk:"function"==typeof k.options.pk?k.options.pk.call(k.options.scope):k.options.pk};"function"==typeof k.options.params?l=k.options.params.call(k.options.scope,l):(k.options.params=a.fn.editableutils.tryParseJson(k.options.params,!0),a.extend(l,k.options.params)),j={url:k.options.url,data:l,type:"POST"},g.success=g.success||k.options.success,g.error=g.error||k.options.error}else{var m=this.editable("getValue");j={url:g.url,data:m,type:"POST"}}j.success="function"==typeof g.success?function(a){g.success.call(h,a,g)}:a.noop,j.error="function"==typeof g.error?function(){g.error.apply(h,arguments)}:a.noop,g.ajaxOptions&&a.extend(j,g.ajaxOptions),g.data&&a.extend(j.data,g.data),a.ajax(j)}else"function"==typeof g.error&&g.error.call(h,i);return this}return this.each(function(){var d=a(this),g=d.data(f),h="object"==typeof c&&c;return h&&h.selector?void(g=new b(this,h)):(g||d.data(f,g=new b(this,h)),void("string"==typeof c&&g[c].apply(g,Array.prototype.slice.call(e,1))))})},a.fn.editable.defaults={type:"text",disabled:!1,toggle:"click",emptytext:"Empty",autotext:"auto",value:null,display:null,emptyclass:"editable-empty",unsavedclass:"editable-unsaved",selector:null,highlight:"#FFFF80"}}(window.jQuery),function(a){"use strict";a.fn.editabletypes={};var b=function(){};b.prototype={init:function(b,c,d){this.type=b,this.options=a.extend({},d,c)},prerender:function(){this.$tpl=a(this.options.tpl),this.$input=this.$tpl,this.$clear=null,this.error=null},render:function(){},value2html:function(b,c){a(c)[this.options.escape?"text":"html"](a.trim(b))},html2value:function(b){return a("<div>").html(b).text()},value2str:function(a){return a},str2value:function(a){return a},value2submit:function(a){return a},value2input:function(a){this.$input.val(a)},input2value:function(){return this.$input.val()},activate:function(){this.$input.is(":visible")&&this.$input.focus()},clear:function(){this.$input.val(null)},escape:function(b){return a("<div>").text(b).html()},autosubmit:function(){},destroy:function(){},setClass:function(){this.options.inputclass&&this.$input.addClass(this.options.inputclass)},setAttr:function(a){void 0!==this.options[a]&&null!==this.options[a]&&this.$input.attr(a,this.options[a])},option:function(a,b){this.options[a]=b}},b.defaults={tpl:"",inputclass:null,escape:!0,scope:null,showbuttons:!0},a.extend(a.fn.editabletypes,{abstractinput:b})}(window.jQuery),function(a){"use strict";var b=function(a){};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){var b=a.Deferred();return this.error=null,this.onSourceReady(function(){this.renderList(),b.resolve()},function(){this.error=this.options.sourceError,b.resolve()}),b.promise()},html2value:function(a){return null},value2html:function(b,c,d,e){var f=a.Deferred(),g=function(){"function"==typeof d?d.call(c,b,this.sourceData,e):this.value2htmlFinal(b,c),f.resolve()};return null===b?g.call(this):this.onSourceReady(g,function(){f.resolve()}),f.promise()},onSourceReady:function(b,c){var d;if(a.isFunction(this.options.source)?(d=this.options.source.call(this.options.scope),this.sourceData=null):d=this.options.source,this.options.sourceCache&&a.isArray(this.sourceData))return void b.call(this);try{d=a.fn.editableutils.tryParseJson(d,!1)}catch(e){return void c.call(this)}if("string"==typeof d){if(this.options.sourceCache){var f,g=d;if(a(document).data(g)||a(document).data(g,{}),f=a(document).data(g),f.loading===!1&&f.sourceData)return this.sourceData=f.sourceData,this.doPrepend(),void b.call(this);if(f.loading===!0)return f.callbacks.push(a.proxy(function(){this.sourceData=f.sourceData,this.doPrepend(),b.call(this)},this)),void f.err_callbacks.push(a.proxy(c,this));f.loading=!0,f.callbacks=[],f.err_callbacks=[]}var h=a.extend({url:d,type:"get",cache:!1,dataType:"json",success:a.proxy(function(d){f&&(f.loading=!1),this.sourceData=this.makeArray(d),a.isArray(this.sourceData)?(f&&(f.sourceData=this.sourceData,a.each(f.callbacks,function(){this.call()})),this.doPrepend(),b.call(this)):(c.call(this),f&&a.each(f.err_callbacks,function(){this.call()}))},this),error:a.proxy(function(){c.call(this),f&&(f.loading=!1,a.each(f.err_callbacks,function(){this.call()}))},this)},this.options.sourceOptions);a.ajax(h)}else this.sourceData=this.makeArray(d),a.isArray(this.sourceData)?(this.doPrepend(),b.call(this)):c.call(this)},doPrepend:function(){null!==this.options.prepend&&void 0!==this.options.prepend&&(a.isArray(this.prependData)||(a.isFunction(this.options.prepend)&&(this.options.prepend=this.options.prepend.call(this.options.scope)),this.options.prepend=a.fn.editableutils.tryParseJson(this.options.prepend,!0),"string"==typeof this.options.prepend&&(this.options.prepend={"":this.options.prepend}),this.prependData=this.makeArray(this.options.prepend)),a.isArray(this.prependData)&&a.isArray(this.sourceData)&&(this.sourceData=this.prependData.concat(this.sourceData)))},renderList:function(){},value2htmlFinal:function(a,b){},makeArray:function(b){var c,d,e,f,g=[];if(!b||"string"==typeof b)return null;if(a.isArray(b)){f=function(a,b){return d={value:a,text:b},c++>=2?!1:void 0};for(var h=0;h<b.length;h++)e=b[h],"object"==typeof e?(c=0,a.each(e,f),1===c?g.push(d):c>1&&(e.children&&(e.children=this.makeArray(e.children)),g.push(e))):g.push({value:e,text:e})}else a.each(b,function(a,b){g.push({value:a,text:b})});return g},option:function(a,b){this.options[a]=b,"source"===a&&(this.sourceData=null),"prepend"===a&&(this.prependData=null)}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{source:null,prepend:!1,sourceError:"Error when loading list",sourceCache:!0,sourceOptions:null}),a.fn.editabletypes.list=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("text",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.renderClear(),this.setClass(),this.setAttr("placeholder")},activate:function(){this.$input.is(":visible")&&(this.$input.focus(),this.$input.is("input,textarea")&&!this.$input.is('[type="checkbox"],[type="range"]')&&a.fn.editableutils.setCursorPosition(this.$input.get(0),this.$input.val().length),this.toggleClear&&this.toggleClear())},renderClear:function(){this.options.clear&&(this.$clear=a('<span class="editable-clear-x"></span>'),this.$input.after(this.$clear).css("padding-right",24).keyup(a.proxy(function(b){if(!~a.inArray(b.keyCode,[40,38,9,13,27])){clearTimeout(this.t);var c=this;this.t=setTimeout(function(){c.toggleClear(b)},100)}},this)).parent().css("position","relative"),this.$clear.click(a.proxy(this.clear,this)))},postrender:function(){},toggleClear:function(a){if(this.$clear){var b=this.$input.val().length,c=this.$clear.is(":visible");b&&!c&&this.$clear.show(),!b&&c&&this.$clear.hide()}},clear:function(){this.$clear.hide(),this.$input.val("").focus()}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<input type="text">',placeholder:null,clear:!0}),a.fn.editabletypes.text=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("textarea",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.setClass(),this.setAttr("placeholder"),this.setAttr("rows"),this.$input.keydown(function(b){b.ctrlKey&&13===b.which&&a(this).closest("form").submit()})},activate:function(){a.fn.editabletypes.text.prototype.activate.call(this)}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:"<textarea></textarea>",inputclass:"input-large",placeholder:null,rows:7}),a.fn.editabletypes.textarea=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("select",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.list),a.extend(b.prototype,{renderList:function(){this.$input.empty();var b=this.options.escape,c=function(d,e){var f;if(a.isArray(e))for(var g=0;g<e.length;g++)if(f={},e[g].children)f.label=e[g].text,d.append(c(a("<optgroup>",f),e[g].children));else{f.value=e[g].value,e[g].disabled&&(f.disabled=!0);var h=a("<option>",f);h[b?"text":"html"](e[g].text),d.append(h)}return d};c(this.$input,this.sourceData),this.setClass(),this.$input.on("keydown.editable",function(b){13===b.which&&a(this).closest("form").submit()})},value2htmlFinal:function(b,c){var d="",e=a.fn.editableutils.itemsByValue(b,this.sourceData);e.length&&(d=e[0].text),a.fn.editabletypes.abstractinput.prototype.value2html.call(this,d,c)},autosubmit:function(){this.$input.off("keydown.editable").on("change.editable",function(){a(this).closest("form").submit()})}}),b.defaults=a.extend({},a.fn.editabletypes.list.defaults,{tpl:"<select></select>"}),a.fn.editabletypes.select=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("checklist",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.list),a.extend(b.prototype,{renderList:function(){var b;if(this.$tpl.empty(),a.isArray(this.sourceData)){for(var c=0;c<this.sourceData.length;c++){b=a("<label>").append(a("<input>",{type:"checkbox",value:this.sourceData[c].value}));var d=a("<span>");d[this.options.escape?"text":"html"](" "+this.sourceData[c].text),b.append(d),a("<div>").append(b).appendTo(this.$tpl)}this.$input=this.$tpl.find('input[type="checkbox"]'),this.setClass()}},value2str:function(b){return a.isArray(b)?b.sort().join(a.trim(this.options.separator)):""},str2value:function(b){var c,d=null;return"string"==typeof b&&b.length?(c=new RegExp("\\s*"+a.trim(this.options.separator)+"\\s*"),d=b.split(c)):d=a.isArray(b)?b:[b],d},value2input:function(b){this.$input.prop("checked",!1),a.isArray(b)&&b.length&&this.$input.each(function(c,d){var e=a(d);a.each(b,function(a,b){e.val()==b&&e.prop("checked",!0)})})},input2value:function(){var b=[];return this.$input.filter(":checked").each(function(c,d){b.push(a(d).val())}),b},value2htmlFinal:function(b,c){var d=[],e=a.fn.editableutils.itemsByValue(b,this.sourceData),f=this.options.escape;e.length?(a.each(e,function(b,c){var e=f?a.fn.editableutils.escape(c.text):c.text;d.push(e)}),a(c).html(d.join("<br>"))):a(c).empty()},activate:function(){this.$input.first().focus()},autosubmit:function(){this.$input.on("keydown",function(b){13===b.which&&a(this).closest("form").submit()})}}),b.defaults=a.extend({},a.fn.editabletypes.list.defaults,{tpl:'<div class="editable-checklist"></div>',inputclass:null,separator:","}),a.fn.editabletypes.checklist=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("password",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),a.extend(b.prototype,{value2html:function(b,c){b?a(c).text("[hidden]"):a(c).empty()},html2value:function(a){return null}}),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="password">'}),a.fn.editabletypes.password=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("email",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="email">'}),a.fn.editabletypes.email=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("url",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="url">'}),a.fn.editabletypes.url=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("tel",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="tel">'}),a.fn.editabletypes.tel=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("number",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.text),a.extend(b.prototype,{render:function(){b.superclass.render.call(this),this.setAttr("min"),this.setAttr("max"),this.setAttr("step");
},postrender:function(){this.$clear&&this.$clear.css({right:24})}}),b.defaults=a.extend({},a.fn.editabletypes.text.defaults,{tpl:'<input type="number">',inputclass:"input-mini",min:null,max:null,step:null}),a.fn.editabletypes.number=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("range",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.number),a.extend(b.prototype,{render:function(){this.$input=this.$tpl.filter("input"),this.setClass(),this.setAttr("min"),this.setAttr("max"),this.setAttr("step"),this.$input.on("input",function(){a(this).siblings("output").text(a(this).val())})},activate:function(){this.$input.focus()}}),b.defaults=a.extend({},a.fn.editabletypes.number.defaults,{tpl:'<input type="range"><output style="width: 30px; display: inline-block"></output>',inputclass:"input-medium"}),a.fn.editabletypes.range=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("time",a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.setClass()}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<input type="time">'}),a.fn.editabletypes.time=b}(window.jQuery),function(a){"use strict";var b=function(c){if(this.init("select2",c,b.defaults),c.select2=c.select2||{},this.sourceData=null,c.placeholder&&(c.select2.placeholder=c.placeholder),!c.select2.tags&&c.source){var d=c.source;a.isFunction(c.source)&&(d=c.source.call(c.scope)),"string"==typeof d?(c.select2.ajax=c.select2.ajax||{},c.select2.ajax.data||(c.select2.ajax.data=function(a){return{query:a}}),c.select2.ajax.results||(c.select2.ajax.results=function(a){return{results:a}}),c.select2.ajax.url=d):(this.sourceData=this.convertSource(d),c.select2.data=this.sourceData)}if(this.options.select2=a.extend({},b.defaults.select2,c.select2),this.isMultiple=this.options.select2.tags||this.options.select2.multiple,this.isRemote="ajax"in this.options.select2,this.idFunc=this.options.select2.id,"function"!=typeof this.idFunc){var e=this.idFunc||"id";this.idFunc=function(a){return a[e]}}this.formatSelection=this.options.select2.formatSelection,"function"!=typeof this.formatSelection&&(this.formatSelection=function(a){return a.text})};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.setClass(),this.isRemote&&this.$input.on("select2-loaded",a.proxy(function(a){this.sourceData=a.items.results},this)),this.isMultiple&&this.$input.on("change",function(){a(this).closest("form").parent().triggerHandler("resize")})},value2html:function(c,d){var e,f="",g=this;this.options.select2.tags?e=c:this.sourceData&&(e=a.fn.editableutils.itemsByValue(c,this.sourceData,this.idFunc)),a.isArray(e)?(f=[],a.each(e,function(a,b){f.push(b&&"object"==typeof b?g.formatSelection(b):b)})):e&&(f=g.formatSelection(e)),f=a.isArray(f)?f.join(this.options.viewseparator):f,b.superclass.value2html.call(this,f,d)},html2value:function(a){return this.options.select2.tags?this.str2value(a,this.options.viewseparator):null},value2input:function(b){if(a.isArray(b)&&(b=b.join(this.getSeparator())),this.$input.data("select2")?this.$input.val(b).trigger("change",!0):(this.$input.val(b),this.$input.select2(this.options.select2)),this.isRemote&&!this.isMultiple&&!this.options.select2.initSelection){var c=this.options.select2.id,d=this.options.select2.formatSelection;if(!c&&!d){var e=a(this.options.scope);if(!e.data("editable").isEmpty){var f={id:b,text:e.text()};this.$input.select2("data",f)}}}},input2value:function(){return this.$input.select2("val")},str2value:function(b,c){if("string"!=typeof b||!this.isMultiple)return b;c=c||this.getSeparator();var d,e,f;if(null===b||b.length<1)return null;for(d=b.split(c),e=0,f=d.length;f>e;e+=1)d[e]=a.trim(d[e]);return d},autosubmit:function(){this.$input.on("change",function(b,c){c||a(this).closest("form").submit()})},getSeparator:function(){return this.options.select2.separator||a.fn.select2.defaults.separator},convertSource:function(b){if(a.isArray(b)&&b.length&&void 0!==b[0].value)for(var c=0;c<b.length;c++)void 0!==b[c].value&&(b[c].id=b[c].value,delete b[c].value);return b},destroy:function(){this.$input.data("select2")&&this.$input.select2("destroy")}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<input type="hidden">',select2:null,placeholder:null,source:null,viewseparator:", "}),a.fn.editabletypes.select2=b}(window.jQuery),function(a){var b=function(b,c){return this.$element=a(b),this.$element.is("input")?(this.options=a.extend({},a.fn.combodate.defaults,c,this.$element.data()),void this.init()):void a.error("Combodate should be applied to INPUT element")};b.prototype={constructor:b,init:function(){this.map={day:["D","date"],month:["M","month"],year:["Y","year"],hour:["[Hh]","hours"],minute:["m","minutes"],second:["s","seconds"],ampm:["[Aa]",""]},this.$widget=a('<span class="combodate"></span>').html(this.getTemplate()),this.initCombos(),this.$widget.on("change","select",a.proxy(function(b){this.$element.val(this.getValue()).change(),this.options.smartDays&&(a(b.target).is(".month")||a(b.target).is(".year"))&&this.fillCombo("day")},this)),this.$widget.find("select").css("width","auto"),this.$element.hide().after(this.$widget),this.setValue(this.$element.val()||this.options.value)},getTemplate:function(){var b=this.options.template;return a.each(this.map,function(a,c){c=c[0];var d=new RegExp(c+"+"),e=c.length>1?c.substring(1,2):c;b=b.replace(d,"{"+e+"}")}),b=b.replace(/ /g,"&nbsp;"),a.each(this.map,function(a,c){c=c[0];var d=c.length>1?c.substring(1,2):c;b=b.replace("{"+d+"}",'<select class="'+a+'"></select>')}),b},initCombos:function(){for(var a in this.map){var b=this.$widget.find("."+a);this["$"+a]=b.length?b:null,this.fillCombo(a)}},fillCombo:function(a){var b=this["$"+a];if(b){var c="fill"+a.charAt(0).toUpperCase()+a.slice(1),d=this[c](),e=b.val();b.empty();for(var f=0;f<d.length;f++)b.append('<option value="'+d[f][0]+'">'+d[f][1]+"</option>");b.val(e)}},fillCommon:function(a){var b,c=[];if("name"===this.options.firstItem){b=moment.relativeTime||moment.langData()._relativeTime;var d="function"==typeof b[a]?b[a](1,!0,a,!1):b[a];d=d.split(" ").reverse()[0],c.push(["",d])}else"empty"===this.options.firstItem&&c.push(["",""]);return c},fillDay:function(){var a,b,c=this.fillCommon("d"),d=-1!==this.options.template.indexOf("DD"),e=31;if(this.options.smartDays&&this.$month&&this.$year){var f=parseInt(this.$month.val(),10),g=parseInt(this.$year.val(),10);isNaN(f)||isNaN(g)||(e=moment([g,f]).daysInMonth())}for(b=1;e>=b;b++)a=d?this.leadZero(b):b,c.push([b,a]);return c},fillMonth:function(){var a,b,c=this.fillCommon("M"),d=-1!==this.options.template.indexOf("MMMM"),e=-1!==this.options.template.indexOf("MMM"),f=-1!==this.options.template.indexOf("MM");for(b=0;11>=b;b++)a=d?moment().date(1).month(b).format("MMMM"):e?moment().date(1).month(b).format("MMM"):f?this.leadZero(b+1):b+1,c.push([b,a]);return c},fillYear:function(){var a,b,c=[],d=-1!==this.options.template.indexOf("YYYY");for(b=this.options.maxYear;b>=this.options.minYear;b--)a=d?b:(b+"").substring(2),c[this.options.yearDescending?"push":"unshift"]([b,a]);return c=this.fillCommon("y").concat(c)},fillHour:function(){var a,b,c=this.fillCommon("h"),d=-1!==this.options.template.indexOf("h"),e=(-1!==this.options.template.indexOf("H"),-1!==this.options.template.toLowerCase().indexOf("hh")),f=d?1:0,g=d?12:23;for(b=f;g>=b;b++)a=e?this.leadZero(b):b,c.push([b,a]);return c},fillMinute:function(){var a,b,c=this.fillCommon("m"),d=-1!==this.options.template.indexOf("mm");for(b=0;59>=b;b+=this.options.minuteStep)a=d?this.leadZero(b):b,c.push([b,a]);return c},fillSecond:function(){var a,b,c=this.fillCommon("s"),d=-1!==this.options.template.indexOf("ss");for(b=0;59>=b;b+=this.options.secondStep)a=d?this.leadZero(b):b,c.push([b,a]);return c},fillAmpm:function(){var a=-1!==this.options.template.indexOf("a"),b=(-1!==this.options.template.indexOf("A"),[["am",a?"am":"AM"],["pm",a?"pm":"PM"]]);return b},getValue:function(b){var c,d={},e=this,f=!1;return a.each(this.map,function(a,b){if("ampm"!==a){var c="day"===a?1:0;return d[a]=e["$"+a]?parseInt(e["$"+a].val(),10):c,isNaN(d[a])?(f=!0,!1):void 0}}),f?"":(this.$ampm&&(12===d.hour?d.hour="am"===this.$ampm.val()?0:12:d.hour="am"===this.$ampm.val()?d.hour:d.hour+12),c=moment([d.year,d.month,d.day,d.hour,d.minute,d.second]),this.highlight(c),b=void 0===b?this.options.format:b,null===b?c.isValid()?c:null:c.isValid()?c.format(b):"")},setValue:function(b){function c(b,c){var d={};return b.children("option").each(function(b,e){var f,g=a(e).attr("value");""!==g&&(f=Math.abs(g-c),("undefined"==typeof d.distance||f<d.distance)&&(d={value:g,distance:f}))}),d.value}if(b){var d="string"==typeof b?moment(b,this.options.format):moment(b),e=this,f={};d.isValid()&&(a.each(this.map,function(a,b){"ampm"!==a&&(f[a]=d[b[1]]())}),this.$ampm&&(f.hour>=12?(f.ampm="pm",f.hour>12&&(f.hour-=12)):(f.ampm="am",0===f.hour&&(f.hour=12))),a.each(f,function(a,b){e["$"+a]&&("minute"===a&&e.options.minuteStep>1&&e.options.roundTime&&(b=c(e["$"+a],b)),"second"===a&&e.options.secondStep>1&&e.options.roundTime&&(b=c(e["$"+a],b)),e["$"+a].val(b))}),this.options.smartDays&&this.fillCombo("day"),this.$element.val(d.format(this.options.format)).change())}},highlight:function(a){a.isValid()?this.options.errorClass?this.$widget.removeClass(this.options.errorClass):this.$widget.find("select").css("border-color",this.borderColor):this.options.errorClass?this.$widget.addClass(this.options.errorClass):(this.borderColor||(this.borderColor=this.$widget.find("select").css("border-color")),this.$widget.find("select").css("border-color","red"))},leadZero:function(a){return 9>=a?"0"+a:a},destroy:function(){this.$widget.remove(),this.$element.removeData("combodate").show()}},a.fn.combodate=function(c){var d,e=Array.apply(null,arguments);return e.shift(),"getValue"===c&&this.length&&(d=this.eq(0).data("combodate"))?d.getValue.apply(d,e):this.each(function(){var d=a(this),f=d.data("combodate"),g="object"==typeof c&&c;f||d.data("combodate",f=new b(this,g)),"string"==typeof c&&"function"==typeof f[c]&&f[c].apply(f,e)})},a.fn.combodate.defaults={format:"DD-MM-YYYY HH:mm",template:"D / MMM / YYYY   H : mm",value:null,minYear:1970,maxYear:2015,yearDescending:!0,minuteStep:5,secondStep:1,firstItem:"empty",errorClass:null,roundTime:!0,smartDays:!1}}(window.jQuery),function(a){"use strict";var b=function(c){this.init("combodate",c,b.defaults),this.options.viewformat||(this.options.viewformat=this.options.format),c.combodate=a.fn.editableutils.tryParseJson(c.combodate,!0),this.options.combodate=a.extend({},b.defaults.combodate,c.combodate,{format:this.options.format,template:this.options.template})};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{render:function(){this.$input.combodate(this.options.combodate),"bs3"===a.fn.editableform.engine&&this.$input.siblings().find("select").addClass("form-control"),this.options.inputclass&&this.$input.siblings().find("select").addClass(this.options.inputclass)},value2html:function(a,c){var d=a?a.format(this.options.viewformat):"";b.superclass.value2html.call(this,d,c)},html2value:function(a){return a?moment(a,this.options.viewformat):null},value2str:function(a){return a?a.format(this.options.format):""},str2value:function(a){return a?moment(a,this.options.format):null},value2submit:function(a){return this.value2str(a)},value2input:function(a){this.$input.combodate("setValue",a)},input2value:function(){return this.$input.combodate("getValue",null)},activate:function(){this.$input.siblings(".combodate").find("select").eq(0).focus()},autosubmit:function(){}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<input type="text">',inputclass:null,format:"YYYY-MM-DD",viewformat:null,template:"D / MMM / YYYY",combodate:null}),a.fn.editabletypes.combodate=b}(window.jQuery),function(a){"use strict";var b=a.fn.editableform.Constructor.prototype.initInput;a.extend(a.fn.editableform.Constructor.prototype,{initTemplate:function(){this.$form=a(a.fn.editableform.template),this.$form.find(".editable-error-block").addClass("help-block")},initInput:function(){b.apply(this);var c=null===this.input.options.inputclass||this.input.options.inputclass===!1,d="input-medium",e="text,select,textarea,password,email,url,tel,number,range,time".split(",");~a.inArray(this.input.type,e)&&c&&(this.input.options.inputclass=d,this.input.$input.addClass(d))}}),a.fn.editableform.buttons='<button type="submit" class="btn btn-primary editable-submit"><i class="icon-ok icon-white"></i></button><button type="button" class="btn editable-cancel"><i class="icon-remove"></i></button>',a.fn.editableform.errorGroupClass="error",a.fn.editableform.errorBlockClass=null,a.fn.editableform.engine="bs2"}(window.jQuery),function(a){"use strict";a.extend(a.fn.editableContainer.Popup.prototype,{containerName:"popover",innerCss:a.fn.popover&&a(a.fn.popover.defaults.template).find("p").length?".popover-content p":".popover-content",defaults:a.fn.popover.defaults,initContainer:function(){a.extend(this.containerOptions,{trigger:"manual",selector:!1,content:" ",template:this.defaults.template});var b;this.$element.data("template")&&(b=this.$element.data("template"),this.$element.removeData("template")),this.call(this.containerOptions),b&&this.$element.data("template",b)},innerShow:function(){this.call("show")},innerHide:function(){this.call("hide")},innerDestroy:function(){this.call("destroy")},setContainerOption:function(a,b){this.container().options[a]=b},setPosition:function(){(function(){var b,c,d,e,f,g,h,i,j,k,l=this.tip();switch(f="function"==typeof this.options.placement?this.options.placement.call(this,l[0],this.$element[0]):this.options.placement,b=/in/.test(f),l.removeClass("top right bottom left").css({top:0,left:0,display:"block"}),c=this.getPosition(b),d=l[0].offsetWidth,e=l[0].offsetHeight,f=b?f.split(" ")[1]:f,i={top:c.top+c.height,left:c.left+c.width/2-d/2},h={top:c.top-e,left:c.left+c.width/2-d/2},j={top:c.top+c.height/2-e/2,left:c.left-d},k={top:c.top+c.height/2-e/2,left:c.left+c.width},f){case"bottom":i.top+e>a(window).scrollTop()+a(window).height()&&(f=h.top>a(window).scrollTop()?"top":k.left+d<a(window).scrollLeft()+a(window).width()?"right":j.left>a(window).scrollLeft()?"left":"right");break;case"top":h.top<a(window).scrollTop()&&(f=i.top+e<a(window).scrollTop()+a(window).height()?"bottom":k.left+d<a(window).scrollLeft()+a(window).width()?"right":j.left>a(window).scrollLeft()?"left":"right");break;case"left":j.left<a(window).scrollLeft()&&(f=k.left+d<a(window).scrollLeft()+a(window).width()?"right":h.top>a(window).scrollTop()?"top":h.top>a(window).scrollTop()?"bottom":"right");break;case"right":k.left+d>a(window).scrollLeft()+a(window).width()&&(j.left>a(window).scrollLeft()?f="left":h.top>a(window).scrollTop()?f="top":h.top>a(window).scrollTop()&&(f="bottom"))}switch(f){case"bottom":g=i;break;case"top":g=h;break;case"left":g=j;break;case"right":g=k}l.offset(g).addClass(f).addClass("in")}).call(this.container())}})}(window.jQuery),function(a){function b(){return new Date(Date.UTC.apply(Date,arguments))}function c(b,c){var d,e=a(b).data(),f={},g=new RegExp("^"+c.toLowerCase()+"([A-Z])"),c=new RegExp("^"+c.toLowerCase());for(var h in e)c.test(h)&&(d=h.replace(g,function(a,b){return b.toLowerCase()}),f[d]=e[h]);return f}function d(b){var c={};if(k[b]||(b=b.split("-")[0],k[b])){var d=k[b];return a.each(j,function(a,b){b in d&&(c[b]=d[b])}),c}}var e=function(b,c){this._process_options(c),this.element=a(b),this.isInline=!1,this.isInput=this.element.is("input"),this.component=this.element.is(".date")?this.element.find(".add-on, .btn"):!1,this.hasInput=this.component&&this.element.find("input").length,this.component&&0===this.component.length&&(this.component=!1),this.picker=a(l.template),this._buildEvents(),this._attachEvents(),this.isInline?this.picker.addClass("datepicker-inline").appendTo(this.element):this.picker.addClass("datepicker-dropdown dropdown-menu"),this.o.rtl&&(this.picker.addClass("datepicker-rtl"),this.picker.find(".prev i, .next i").toggleClass("icon-arrow-left icon-arrow-right")),this.viewMode=this.o.startView,this.o.calendarWeeks&&this.picker.find("tfoot th.today").attr("colspan",function(a,b){return parseInt(b)+1}),this._allow_update=!1,this.setStartDate(this.o.startDate),this.setEndDate(this.o.endDate),this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled),this.fillDow(),this.fillMonths(),this._allow_update=!0,this.update(),this.showMode(),this.isInline&&this.show()};e.prototype={constructor:e,_process_options:function(b){this._o=a.extend({},this._o,b);var c=this.o=a.extend({},this._o),d=c.language;switch(k[d]||(d=d.split("-")[0],k[d]||(d=i.language)),c.language=d,c.startView){case 2:case"decade":c.startView=2;break;case 1:case"year":c.startView=1;break;default:c.startView=0}switch(c.minViewMode){case 1:case"months":c.minViewMode=1;break;case 2:case"years":c.minViewMode=2;break;default:c.minViewMode=0}c.startView=Math.max(c.startView,c.minViewMode),c.weekStart%=7,c.weekEnd=(c.weekStart+6)%7;var e=l.parseFormat(c.format);c.startDate!==-(1/0)&&(c.startDate=l.parseDate(c.startDate,e,c.language)),c.endDate!==1/0&&(c.endDate=l.parseDate(c.endDate,e,c.language)),c.daysOfWeekDisabled=c.daysOfWeekDisabled||[],a.isArray(c.daysOfWeekDisabled)||(c.daysOfWeekDisabled=c.daysOfWeekDisabled.split(/[,\s]*/)),c.daysOfWeekDisabled=a.map(c.daysOfWeekDisabled,function(a){return parseInt(a,10)})},_events:[],_secondaryEvents:[],_applyEvents:function(a){for(var b,c,d=0;d<a.length;d++)b=a[d][0],c=a[d][1],b.on(c)},_unapplyEvents:function(a){for(var b,c,d=0;d<a.length;d++)b=a[d][0],c=a[d][1],b.off(c)},_buildEvents:function(){this.isInput?this._events=[[this.element,{focus:a.proxy(this.show,this),keyup:a.proxy(this.update,this),keydown:a.proxy(this.keydown,this)}]]:this.component&&this.hasInput?this._events=[[this.element.find("input"),{focus:a.proxy(this.show,this),keyup:a.proxy(this.update,this),keydown:a.proxy(this.keydown,this)}],[this.component,{click:a.proxy(this.show,this)}]]:this.element.is("div")?this.isInline=!0:this._events=[[this.element,{click:a.proxy(this.show,this)}]],this._secondaryEvents=[[this.picker,{click:a.proxy(this.click,this)}],[a(window),{resize:a.proxy(this.place,this)}],[a(document),{mousedown:a.proxy(function(a){this.element.is(a.target)||this.element.find(a.target).size()||this.picker.is(a.target)||this.picker.find(a.target).size()||this.hide()},this)}]]},_attachEvents:function(){this._detachEvents(),this._applyEvents(this._events)},_detachEvents:function(){this._unapplyEvents(this._events)},_attachSecondaryEvents:function(){this._detachSecondaryEvents(),this._applyEvents(this._secondaryEvents)},_detachSecondaryEvents:function(){this._unapplyEvents(this._secondaryEvents)},_trigger:function(b,c){var d=c||this.date,e=new Date(d.getTime()+6e4*d.getTimezoneOffset());this.element.trigger({type:b,date:e,format:a.proxy(function(a){var b=a||this.o.format;return l.formatDate(d,b,this.o.language)},this)})},show:function(a){this.isInline||this.picker.appendTo("body"),this.picker.show(),this.height=this.component?this.component.outerHeight():this.element.outerHeight(),this.place(),this._attachSecondaryEvents(),a&&a.preventDefault(),this._trigger("show")},hide:function(a){this.isInline||this.picker.is(":visible")&&(this.picker.hide().detach(),this._detachSecondaryEvents(),this.viewMode=this.o.startView,this.showMode(),this.o.forceParse&&(this.isInput&&this.element.val()||this.hasInput&&this.element.find("input").val())&&this.setValue(),this._trigger("hide"))},remove:function(){this.hide(),this._detachEvents(),this._detachSecondaryEvents(),this.picker.remove(),delete this.element.data().datepicker,this.isInput||delete this.element.data().date},getDate:function(){var a=this.getUTCDate();return new Date(a.getTime()+6e4*a.getTimezoneOffset())},getUTCDate:function(){return this.date},setDate:function(a){this.setUTCDate(new Date(a.getTime()-6e4*a.getTimezoneOffset()))},setUTCDate:function(a){this.date=a,this.setValue()},setValue:function(){var a=this.getFormattedDate();this.isInput?this.element.val(a):this.component&&this.element.find("input").val(a)},getFormattedDate:function(a){return void 0===a&&(a=this.o.format),l.formatDate(this.date,a,this.o.language)},setStartDate:function(a){this._process_options({startDate:a}),this.update(),this.updateNavArrows()},setEndDate:function(a){this._process_options({endDate:a}),this.update(),this.updateNavArrows()},setDaysOfWeekDisabled:function(a){this._process_options({daysOfWeekDisabled:a}),this.update(),this.updateNavArrows()},place:function(){if(!this.isInline){var b=parseInt(this.element.parents().filter(function(){return"auto"!=a(this).css("z-index")}).first().css("z-index"))+10,c=this.component?this.component.parent().offset():this.element.offset(),d=this.component?this.component.outerHeight(!0):this.element.outerHeight(!0);this.picker.css({top:c.top+d,left:c.left,zIndex:b})}},_allow_update:!0,update:function(){if(this._allow_update){var a,b=!1;arguments&&arguments.length&&("string"==typeof arguments[0]||arguments[0]instanceof Date)?(a=arguments[0],b=!0):(a=this.isInput?this.element.val():this.element.data("date")||this.element.find("input").val(),delete this.element.data().date),this.date=l.parseDate(a,this.o.format,this.o.language),b&&this.setValue(),this.date<this.o.startDate?this.viewDate=new Date(this.o.startDate):this.date>this.o.endDate?this.viewDate=new Date(this.o.endDate):this.viewDate=new Date(this.date),this.fill()}},fillDow:function(){var a=this.o.weekStart,b="<tr>";if(this.o.calendarWeeks){var c='<th class="cw">&nbsp;</th>';b+=c,this.picker.find(".datepicker-days thead tr:first-child").prepend(c)}for(;a<this.o.weekStart+7;)b+='<th class="dow">'+k[this.o.language].daysMin[a++%7]+"</th>";b+="</tr>",this.picker.find(".datepicker-days thead").append(b)},fillMonths:function(){for(var a="",b=0;12>b;)a+='<span class="month">'+k[this.o.language].monthsShort[b++]+"</span>";this.picker.find(".datepicker-months td").html(a)},setRange:function(b){b&&b.length?this.range=a.map(b,function(a){return a.valueOf()}):delete this.range,this.fill()},getClassNames:function(b){var c=[],d=this.viewDate.getUTCFullYear(),e=this.viewDate.getUTCMonth(),f=this.date.valueOf(),g=new Date;return b.getUTCFullYear()<d||b.getUTCFullYear()==d&&b.getUTCMonth()<e?c.push("old"):(b.getUTCFullYear()>d||b.getUTCFullYear()==d&&b.getUTCMonth()>e)&&c.push("new"),this.o.todayHighlight&&b.getUTCFullYear()==g.getFullYear()&&b.getUTCMonth()==g.getMonth()&&b.getUTCDate()==g.getDate()&&c.push("today"),f&&b.valueOf()==f&&c.push("active"),(b.valueOf()<this.o.startDate||b.valueOf()>this.o.endDate||-1!==a.inArray(b.getUTCDay(),this.o.daysOfWeekDisabled))&&c.push("disabled"),this.range&&(b>this.range[0]&&b<this.range[this.range.length-1]&&c.push("range"),-1!=a.inArray(b.valueOf(),this.range)&&c.push("selected")),c},fill:function(){var c,d=new Date(this.viewDate),e=d.getUTCFullYear(),f=d.getUTCMonth(),g=this.o.startDate!==-(1/0)?this.o.startDate.getUTCFullYear():-(1/0),h=this.o.startDate!==-(1/0)?this.o.startDate.getUTCMonth():-(1/0),i=this.o.endDate!==1/0?this.o.endDate.getUTCFullYear():1/0,j=this.o.endDate!==1/0?this.o.endDate.getUTCMonth():1/0;this.date&&this.date.valueOf();this.picker.find(".datepicker-days thead th.datepicker-switch").text(k[this.o.language].months[f]+" "+e),this.picker.find("tfoot th.today").text(k[this.o.language].today).toggle(this.o.todayBtn!==!1),this.picker.find("tfoot th.clear").text(k[this.o.language].clear).toggle(this.o.clearBtn!==!1),this.updateNavArrows(),this.fillMonths();var m=b(e,f-1,28,0,0,0,0),n=l.getDaysInMonth(m.getUTCFullYear(),m.getUTCMonth());m.setUTCDate(n),m.setUTCDate(n-(m.getUTCDay()-this.o.weekStart+7)%7);var o=new Date(m);o.setUTCDate(o.getUTCDate()+42),o=o.valueOf();for(var p,q=[];m.valueOf()<o;){if(m.getUTCDay()==this.o.weekStart&&(q.push("<tr>"),this.o.calendarWeeks)){var r=new Date(+m+(this.o.weekStart-m.getUTCDay()-7)%7*864e5),s=new Date(+r+(11-r.getUTCDay())%7*864e5),t=new Date(+(t=b(s.getUTCFullYear(),0,1))+(11-t.getUTCDay())%7*864e5),u=(s-t)/864e5/7+1;q.push('<td class="cw">'+u+"</td>")}p=this.getClassNames(m),p.push("day");var v=this.o.beforeShowDay(m);void 0===v?v={}:"boolean"==typeof v?v={enabled:v}:"string"==typeof v&&(v={classes:v}),v.enabled===!1&&p.push("disabled"),v.classes&&(p=p.concat(v.classes.split(/\s+/))),v.tooltip&&(c=v.tooltip),p=a.unique(p),q.push('<td class="'+p.join(" ")+'"'+(c?' title="'+c+'"':"")+">"+m.getUTCDate()+"</td>"),m.getUTCDay()==this.o.weekEnd&&q.push("</tr>"),m.setUTCDate(m.getUTCDate()+1)}this.picker.find(".datepicker-days tbody").empty().append(q.join(""));var w=this.date&&this.date.getUTCFullYear(),x=this.picker.find(".datepicker-months").find("th:eq(1)").text(e).end().find("span").removeClass("active");w&&w==e&&x.eq(this.date.getUTCMonth()).addClass("active"),(g>e||e>i)&&x.addClass("disabled"),e==g&&x.slice(0,h).addClass("disabled"),e==i&&x.slice(j+1).addClass("disabled"),q="",e=10*parseInt(e/10,10);var y=this.picker.find(".datepicker-years").find("th:eq(1)").text(e+"-"+(e+9)).end().find("td");e-=1;for(var z=-1;11>z;z++)q+='<span class="year'+(-1==z?" old":10==z?" new":"")+(w==e?" active":"")+(g>e||e>i?" disabled":"")+'">'+e+"</span>",e+=1;y.html(q)},updateNavArrows:function(){if(this._allow_update){var a=new Date(this.viewDate),b=a.getUTCFullYear(),c=a.getUTCMonth();switch(this.viewMode){case 0:this.o.startDate!==-(1/0)&&b<=this.o.startDate.getUTCFullYear()&&c<=this.o.startDate.getUTCMonth()?this.picker.find(".prev").css({visibility:"hidden"}):this.picker.find(".prev").css({visibility:"visible"}),this.o.endDate!==1/0&&b>=this.o.endDate.getUTCFullYear()&&c>=this.o.endDate.getUTCMonth()?this.picker.find(".next").css({visibility:"hidden"}):this.picker.find(".next").css({visibility:"visible"});break;case 1:case 2:this.o.startDate!==-(1/0)&&b<=this.o.startDate.getUTCFullYear()?this.picker.find(".prev").css({visibility:"hidden"}):this.picker.find(".prev").css({visibility:"visible"}),this.o.endDate!==1/0&&b>=this.o.endDate.getUTCFullYear()?this.picker.find(".next").css({visibility:"hidden"}):this.picker.find(".next").css({visibility:"visible"})}}},click:function(c){c.preventDefault();var d=a(c.target).closest("span, td, th");if(1==d.length)switch(d[0].nodeName.toLowerCase()){case"th":switch(d[0].className){case"datepicker-switch":this.showMode(1);break;case"prev":case"next":var e=l.modes[this.viewMode].navStep*("prev"==d[0].className?-1:1);switch(this.viewMode){case 0:this.viewDate=this.moveMonth(this.viewDate,e);break;case 1:case 2:this.viewDate=this.moveYear(this.viewDate,e)}this.fill();break;case"today":var f=new Date;f=b(f.getFullYear(),f.getMonth(),f.getDate(),0,0,0),this.showMode(-2);var g="linked"==this.o.todayBtn?null:"view";this._setDate(f,g);break;case"clear":var h;this.isInput?h=this.element:this.component&&(h=this.element.find("input")),h&&h.val("").change(),this._trigger("changeDate"),this.update(),this.o.autoclose&&this.hide()}break;case"span":if(!d.is(".disabled")){if(this.viewDate.setUTCDate(1),d.is(".month")){var i=1,j=d.parent().find("span").index(d),k=this.viewDate.getUTCFullYear();this.viewDate.setUTCMonth(j),this._trigger("changeMonth",this.viewDate),1===this.o.minViewMode&&this._setDate(b(k,j,i,0,0,0,0))}else{var k=parseInt(d.text(),10)||0,i=1,j=0;this.viewDate.setUTCFullYear(k),this._trigger("changeYear",this.viewDate),2===this.o.minViewMode&&this._setDate(b(k,j,i,0,0,0,0))}this.showMode(-1),this.fill()}break;case"td":if(d.is(".day")&&!d.is(".disabled")){var i=parseInt(d.text(),10)||1,k=this.viewDate.getUTCFullYear(),j=this.viewDate.getUTCMonth();d.is(".old")?0===j?(j=11,k-=1):j-=1:d.is(".new")&&(11==j?(j=0,k+=1):j+=1),this._setDate(b(k,j,i,0,0,0,0))}}},_setDate:function(a,b){b&&"date"!=b||(this.date=new Date(a)),b&&"view"!=b||(this.viewDate=new Date(a)),this.fill(),this.setValue(),this._trigger("changeDate");var c;this.isInput?c=this.element:this.component&&(c=this.element.find("input")),c&&(c.change(),!this.o.autoclose||b&&"date"!=b||this.hide())},moveMonth:function(a,b){if(!b)return a;var c,d,e=new Date(a.valueOf()),f=e.getUTCDate(),g=e.getUTCMonth(),h=Math.abs(b);if(b=b>0?1:-1,1==h)d=-1==b?function(){return e.getUTCMonth()==g}:function(){return e.getUTCMonth()!=c},c=g+b,e.setUTCMonth(c),(0>c||c>11)&&(c=(c+12)%12);else{for(var i=0;h>i;i++)e=this.moveMonth(e,b);c=e.getUTCMonth(),e.setUTCDate(f),d=function(){return c!=e.getUTCMonth()}}for(;d();)e.setUTCDate(--f),e.setUTCMonth(c);return e},moveYear:function(a,b){return this.moveMonth(a,12*b)},dateWithinRange:function(a){return a>=this.o.startDate&&a<=this.o.endDate},keydown:function(a){if(this.picker.is(":not(:visible)"))return void(27==a.keyCode&&this.show());var b,c,d,e=!1;switch(a.keyCode){case 27:this.hide(),a.preventDefault();break;case 37:case 39:if(!this.o.keyboardNavigation)break;b=37==a.keyCode?-1:1,a.ctrlKey?(c=this.moveYear(this.date,b),d=this.moveYear(this.viewDate,b)):a.shiftKey?(c=this.moveMonth(this.date,b),d=this.moveMonth(this.viewDate,b)):(c=new Date(this.date),c.setUTCDate(this.date.getUTCDate()+b),d=new Date(this.viewDate),d.setUTCDate(this.viewDate.getUTCDate()+b)),this.dateWithinRange(c)&&(this.date=c,this.viewDate=d,this.setValue(),this.update(),a.preventDefault(),e=!0);break;case 38:case 40:if(!this.o.keyboardNavigation)break;b=38==a.keyCode?-1:1,a.ctrlKey?(c=this.moveYear(this.date,b),d=this.moveYear(this.viewDate,b)):a.shiftKey?(c=this.moveMonth(this.date,b),d=this.moveMonth(this.viewDate,b)):(c=new Date(this.date),c.setUTCDate(this.date.getUTCDate()+7*b),d=new Date(this.viewDate),d.setUTCDate(this.viewDate.getUTCDate()+7*b)),this.dateWithinRange(c)&&(this.date=c,this.viewDate=d,this.setValue(),this.update(),a.preventDefault(),e=!0);break;case 13:this.hide(),a.preventDefault();break;case 9:this.hide()}if(e){this._trigger("changeDate");var f;this.isInput?f=this.element:this.component&&(f=this.element.find("input")),f&&f.change()}},showMode:function(a){a&&(this.viewMode=Math.max(this.o.minViewMode,Math.min(2,this.viewMode+a))),this.picker.find(">div").hide().filter(".datepicker-"+l.modes[this.viewMode].clsName).css("display","block"),this.updateNavArrows()}};var f=function(b,c){this.element=a(b),this.inputs=a.map(c.inputs,function(a){return a.jquery?a[0]:a}),delete c.inputs,a(this.inputs).datepicker(c).bind("changeDate",a.proxy(this.dateUpdated,this)),this.pickers=a.map(this.inputs,function(b){return a(b).data("datepicker")}),this.updateDates()};f.prototype={updateDates:function(){this.dates=a.map(this.pickers,function(a){return a.date}),this.updateRanges()},updateRanges:function(){var b=a.map(this.dates,function(a){return a.valueOf()});a.each(this.pickers,function(a,c){c.setRange(b)})},dateUpdated:function(b){var c=a(b.target).data("datepicker"),d=c.getUTCDate(),e=a.inArray(b.target,this.inputs),f=this.inputs.length;if(-1!=e){if(d<this.dates[e])for(;e>=0&&d<this.dates[e];)this.pickers[e--].setUTCDate(d);else if(d>this.dates[e])for(;f>e&&d>this.dates[e];)this.pickers[e++].setUTCDate(d);this.updateDates()}},remove:function(){a.map(this.pickers,function(a){a.remove()}),delete this.element.data().datepicker}};var g=a.fn.datepicker,h=a.fn.datepicker=function(b){var g=Array.apply(null,arguments);g.shift();var h;return this.each(function(){var j=a(this),k=j.data("datepicker"),l="object"==typeof b&&b;if(!k){var m=c(this,"date"),n=a.extend({},i,m,l),o=d(n.language),p=a.extend({},i,o,m,l);if(j.is(".input-daterange")||p.inputs){var q={inputs:p.inputs||j.find("input").toArray()};j.data("datepicker",k=new f(this,a.extend(p,q)))}else j.data("datepicker",k=new e(this,p))}return"string"==typeof b&&"function"==typeof k[b]&&(h=k[b].apply(k,g),void 0!==h)?!1:void 0}),void 0!==h?h:this},i=a.fn.datepicker.defaults={autoclose:!1,beforeShowDay:a.noop,calendarWeeks:!1,clearBtn:!1,daysOfWeekDisabled:[],endDate:1/0,forceParse:!0,format:"mm/dd/yyyy",keyboardNavigation:!0,language:"en",minViewMode:0,rtl:!1,
startDate:-(1/0),startView:0,todayBtn:!1,todayHighlight:!1,weekStart:0},j=a.fn.datepicker.locale_opts=["format","rtl","weekStart"];a.fn.datepicker.Constructor=e;var k=a.fn.datepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa","Su"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today",clear:"Clear"}},l={modes:[{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],isLeapYear:function(a){return a%4===0&&a%100!==0||a%400===0},getDaysInMonth:function(a,b){return[31,l.isLeapYear(a)?29:28,31,30,31,30,31,31,30,31,30,31][b]},validParts:/dd?|DD?|mm?|MM?|yy(?:yy)?/g,nonpunctuation:/[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,parseFormat:function(a){var b=a.replace(this.validParts,"\x00").split("\x00"),c=a.match(this.validParts);if(!b||!b.length||!c||0===c.length)throw new Error("Invalid date format.");return{separators:b,parts:c}},parseDate:function(c,d,f){if(c instanceof Date)return c;if("string"==typeof d&&(d=l.parseFormat(d)),/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(c)){var g,h,i=/([\-+]\d+)([dmwy])/,j=c.match(/([\-+]\d+)([dmwy])/g);c=new Date;for(var m=0;m<j.length;m++)switch(g=i.exec(j[m]),h=parseInt(g[1]),g[2]){case"d":c.setUTCDate(c.getUTCDate()+h);break;case"m":c=e.prototype.moveMonth.call(e.prototype,c,h);break;case"w":c.setUTCDate(c.getUTCDate()+7*h);break;case"y":c=e.prototype.moveYear.call(e.prototype,c,h)}return b(c.getUTCFullYear(),c.getUTCMonth(),c.getUTCDate(),0,0,0)}var n,o,g,j=c&&c.match(this.nonpunctuation)||[],c=new Date,p={},q=["yyyy","yy","M","MM","m","mm","d","dd"],r={yyyy:function(a,b){return a.setUTCFullYear(b)},yy:function(a,b){return a.setUTCFullYear(2e3+b)},m:function(a,b){for(b-=1;0>b;)b+=12;for(b%=12,a.setUTCMonth(b);a.getUTCMonth()!=b;)a.setUTCDate(a.getUTCDate()-1);return a},d:function(a,b){return a.setUTCDate(b)}};r.M=r.MM=r.mm=r.m,r.dd=r.d,c=b(c.getFullYear(),c.getMonth(),c.getDate(),0,0,0);var s=d.parts.slice();if(j.length!=s.length&&(s=a(s).filter(function(b,c){return-1!==a.inArray(c,q)}).toArray()),j.length==s.length){for(var m=0,t=s.length;t>m;m++){if(n=parseInt(j[m],10),g=s[m],isNaN(n))switch(g){case"MM":o=a(k[f].months).filter(function(){var a=this.slice(0,j[m].length),b=j[m].slice(0,a.length);return a==b}),n=a.inArray(o[0],k[f].months)+1;break;case"M":o=a(k[f].monthsShort).filter(function(){var a=this.slice(0,j[m].length),b=j[m].slice(0,a.length);return a==b}),n=a.inArray(o[0],k[f].monthsShort)+1}p[g]=n}for(var u,m=0;m<q.length;m++)u=q[m],u in p&&!isNaN(p[u])&&r[u](c,p[u])}return c},formatDate:function(b,c,d){"string"==typeof c&&(c=l.parseFormat(c));var e={d:b.getUTCDate(),D:k[d].daysShort[b.getUTCDay()],DD:k[d].days[b.getUTCDay()],m:b.getUTCMonth()+1,M:k[d].monthsShort[b.getUTCMonth()],MM:k[d].months[b.getUTCMonth()],yy:b.getUTCFullYear().toString().substring(2),yyyy:b.getUTCFullYear()};e.dd=(e.d<10?"0":"")+e.d,e.mm=(e.m<10?"0":"")+e.m;for(var b=[],f=a.extend([],c.separators),g=0,h=c.parts.length;h>=g;g++)f.length&&b.push(f.shift()),b.push(e[c.parts[g]]);return b.join("")},headTemplate:'<thead><tr><th class="prev"><i class="icon-arrow-left"/></th><th colspan="5" class="datepicker-switch"></th><th class="next"><i class="icon-arrow-right"/></th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'};l.template='<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">'+l.headTemplate+"<tbody></tbody>"+l.footTemplate+'</table></div><div class="datepicker-months"><table class="table-condensed">'+l.headTemplate+l.contTemplate+l.footTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+l.headTemplate+l.contTemplate+l.footTemplate+"</table></div></div>",a.fn.datepicker.DPGlobal=l,a.fn.datepicker.noConflict=function(){return a.fn.datepicker=g,this},a(document).on("focus.datepicker.data-api click.datepicker.data-api",'[data-provide="datepicker"]',function(b){var c=a(this);c.data("datepicker")||(b.preventDefault(),h.call(c,"show"))}),a(function(){h.call(a('[data-provide="datepicker-inline"]'))})}(window.jQuery),function(a){"use strict";a.fn.bdatepicker=a.fn.datepicker.noConflict(),a.fn.datepicker||(a.fn.datepicker=a.fn.bdatepicker);var b=function(a){this.init("date",a,b.defaults),this.initPicker(a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{initPicker:function(b,c){this.options.viewformat||(this.options.viewformat=this.options.format),b.datepicker=a.fn.editableutils.tryParseJson(b.datepicker,!0),this.options.datepicker=a.extend({},c.datepicker,b.datepicker,{format:this.options.viewformat}),this.options.datepicker.language=this.options.datepicker.language||"en",this.dpg=a.fn.bdatepicker.DPGlobal,this.parsedFormat=this.dpg.parseFormat(this.options.format),this.parsedViewFormat=this.dpg.parseFormat(this.options.viewformat)},render:function(){this.$input.bdatepicker(this.options.datepicker),this.options.clear&&(this.$clear=a('<a href="#"></a>').html(this.options.clear).click(a.proxy(function(a){a.preventDefault(),a.stopPropagation(),this.clear()},this)),this.$tpl.parent().append(a('<div class="editable-clear">').append(this.$clear)))},value2html:function(a,c){var d=a?this.dpg.formatDate(a,this.parsedViewFormat,this.options.datepicker.language):"";b.superclass.value2html.call(this,d,c)},html2value:function(a){return this.parseDate(a,this.parsedViewFormat)},value2str:function(a){return a?this.dpg.formatDate(a,this.parsedFormat,this.options.datepicker.language):""},str2value:function(a){return this.parseDate(a,this.parsedFormat)},value2submit:function(a){return this.value2str(a)},value2input:function(a){this.$input.bdatepicker("update",a)},input2value:function(){return this.$input.data("datepicker").date},activate:function(){},clear:function(){this.$input.data("datepicker").date=null,this.$input.find(".active").removeClass("active"),this.options.showbuttons||this.$input.closest("form").submit()},autosubmit:function(){this.$input.on("mouseup",".day",function(b){if(!a(b.currentTarget).is(".old")&&!a(b.currentTarget).is(".new")){var c=a(this).closest("form");setTimeout(function(){c.submit()},200)}})},parseDate:function(a,b){var c,d=null;return a&&(d=this.dpg.parseDate(a,b,this.options.datepicker.language),"string"==typeof a&&(c=this.dpg.formatDate(d,b,this.options.datepicker.language),a!==c&&(d=null))),d}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<div class="editable-date well"></div>',inputclass:null,format:"yyyy-mm-dd",viewformat:null,datepicker:{weekStart:0,startView:0,minViewMode:0,autoclose:!1},clear:"&times; clear"}),a.fn.editabletypes.date=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("datefield",a,b.defaults),this.initPicker(a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.date),a.extend(b.prototype,{render:function(){this.$input=this.$tpl.find("input"),this.setClass(),this.setAttr("placeholder"),this.$tpl.bdatepicker(this.options.datepicker),this.$input.off("focus keydown"),this.$input.keyup(a.proxy(function(){this.$tpl.removeData("date"),this.$tpl.bdatepicker("update")},this))},value2input:function(a){this.$input.val(a?this.dpg.formatDate(a,this.parsedViewFormat,this.options.datepicker.language):""),this.$tpl.bdatepicker("update")},input2value:function(){return this.html2value(this.$input.val())},activate:function(){a.fn.editabletypes.text.prototype.activate.call(this)},autosubmit:function(){}}),b.defaults=a.extend({},a.fn.editabletypes.date.defaults,{tpl:'<div class="input-append date"><input type="text"/><span class="add-on"><i class="icon-th"></i></span></div>',inputclass:"input-small",datepicker:{weekStart:0,startView:0,minViewMode:0,autoclose:!0}}),a.fn.editabletypes.datefield=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("datetime",a,b.defaults),this.initPicker(a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.abstractinput),a.extend(b.prototype,{initPicker:function(b,c){this.options.viewformat||(this.options.viewformat=this.options.format),b.datetimepicker=a.fn.editableutils.tryParseJson(b.datetimepicker,!0),this.options.datetimepicker=a.extend({},c.datetimepicker,b.datetimepicker,{format:this.options.viewformat}),this.options.datetimepicker.language=this.options.datetimepicker.language||"en",this.dpg=a.fn.datetimepicker.DPGlobal,this.parsedFormat=this.dpg.parseFormat(this.options.format,this.options.formatType),this.parsedViewFormat=this.dpg.parseFormat(this.options.viewformat,this.options.formatType)},render:function(){this.$input.datetimepicker(this.options.datetimepicker),this.$input.on("changeMode",function(b){var c=a(this).closest("form").parent();setTimeout(function(){c.triggerHandler("resize")},0)}),this.options.clear&&(this.$clear=a('<a href="#"></a>').html(this.options.clear).click(a.proxy(function(a){a.preventDefault(),a.stopPropagation(),this.clear()},this)),this.$tpl.parent().append(a('<div class="editable-clear">').append(this.$clear)))},value2html:function(a,c){var d=a?this.dpg.formatDate(this.toUTC(a),this.parsedViewFormat,this.options.datetimepicker.language,this.options.formatType):"";return c?void b.superclass.value2html.call(this,d,c):d},html2value:function(a){var b=this.parseDate(a,this.parsedViewFormat);return b?this.fromUTC(b):null},value2str:function(a){return a?this.dpg.formatDate(this.toUTC(a),this.parsedFormat,this.options.datetimepicker.language,this.options.formatType):""},str2value:function(a){var b=this.parseDate(a,this.parsedFormat);return b?this.fromUTC(b):null},value2submit:function(a){return this.value2str(a)},value2input:function(a){a&&this.$input.data("datetimepicker").setDate(a)},input2value:function(){var a=this.$input.data("datetimepicker");return a.date?a.getDate():null},activate:function(){},clear:function(){this.$input.data("datetimepicker").date=null,this.$input.find(".active").removeClass("active"),this.options.showbuttons||this.$input.closest("form").submit()},autosubmit:function(){this.$input.on("mouseup",".minute",function(b){var c=a(this).closest("form");setTimeout(function(){c.submit()},200)})},toUTC:function(a){return a?new Date(a.valueOf()-6e4*a.getTimezoneOffset()):a},fromUTC:function(a){return a?new Date(a.valueOf()+6e4*a.getTimezoneOffset()):a},parseDate:function(a,b){var c,d=null;return a&&(d=this.dpg.parseDate(a,b,this.options.datetimepicker.language,this.options.formatType),"string"==typeof a&&(c=this.dpg.formatDate(d,b,this.options.datetimepicker.language,this.options.formatType),a!==c&&(d=null))),d}}),b.defaults=a.extend({},a.fn.editabletypes.abstractinput.defaults,{tpl:'<div class="editable-date well"></div>',inputclass:null,format:"yyyy-mm-dd hh:ii",formatType:"standard",viewformat:null,datetimepicker:{todayHighlight:!1,autoclose:!1},clear:"&times; clear"}),a.fn.editabletypes.datetime=b}(window.jQuery),function(a){"use strict";var b=function(a){this.init("datetimefield",a,b.defaults),this.initPicker(a,b.defaults)};a.fn.editableutils.inherit(b,a.fn.editabletypes.datetime),a.extend(b.prototype,{render:function(){this.$input=this.$tpl.find("input"),this.setClass(),this.setAttr("placeholder"),this.$tpl.datetimepicker(this.options.datetimepicker),this.$input.off("focus keydown"),this.$input.keyup(a.proxy(function(){this.$tpl.removeData("date"),this.$tpl.datetimepicker("update")},this))},value2input:function(a){this.$input.val(this.value2html(a)),this.$tpl.datetimepicker("update")},input2value:function(){return this.html2value(this.$input.val())},activate:function(){a.fn.editabletypes.text.prototype.activate.call(this)},autosubmit:function(){}}),b.defaults=a.extend({},a.fn.editabletypes.datetime.defaults,{tpl:'<div class="input-append date"><input type="text"/><span class="add-on"><i class="icon-th"></i></span></div>',inputclass:"input-medium",datetimepicker:{todayHighlight:!1,autoclose:!0}}),a.fn.editabletypes.datetimefield=b}(window.jQuery),function(a){"use strict";var b=function(c){this.init("typeahead",c,b.defaults),this.options.typeahead=a.extend({},b.defaults.typeahead,{matcher:this.matcher,sorter:this.sorter,highlighter:this.highlighter,updater:this.updater},c.typeahead)};a.fn.editableutils.inherit(b,a.fn.editabletypes.list),a.extend(b.prototype,{renderList:function(){this.$input=this.$tpl.is("input")?this.$tpl:this.$tpl.find('input[type="text"]'),this.options.typeahead.source=this.sourceData,this.$input.typeahead(this.options.typeahead);var b=this.$input.data("typeahead");b.render=a.proxy(this.typeaheadRender,b),b.select=a.proxy(this.typeaheadSelect,b),b.move=a.proxy(this.typeaheadMove,b),this.renderClear(),this.setClass(),this.setAttr("placeholder")},value2htmlFinal:function(b,c){if(this.getIsObjects()){var d=a.fn.editableutils.itemsByValue(b,this.sourceData);b=d.length?d[0].text:""}a.fn.editabletypes.abstractinput.prototype.value2html.call(this,b,c)},html2value:function(a){return a?a:null},value2input:function(b){if(this.getIsObjects()){var c=a.fn.editableutils.itemsByValue(b,this.sourceData);this.$input.data("value",b).val(c.length?c[0].text:"")}else this.$input.val(b)},input2value:function(){if(this.getIsObjects()){var b=this.$input.data("value"),c=a.fn.editableutils.itemsByValue(b,this.sourceData);return c.length&&c[0].text.toLowerCase()===this.$input.val().toLowerCase()?b:null}return this.$input.val()},getIsObjects:function(){if(void 0===this.isObjects){this.isObjects=!1;for(var a=0;a<this.sourceData.length;a++)if(this.sourceData[a].value!==this.sourceData[a].text){this.isObjects=!0;break}}return this.isObjects},activate:a.fn.editabletypes.text.prototype.activate,renderClear:a.fn.editabletypes.text.prototype.renderClear,postrender:a.fn.editabletypes.text.prototype.postrender,toggleClear:a.fn.editabletypes.text.prototype.toggleClear,clear:function(){a.fn.editabletypes.text.prototype.clear.call(this),this.$input.data("value","")},matcher:function(b){return a.fn.typeahead.Constructor.prototype.matcher.call(this,b.text)},sorter:function(a){for(var b,c,d=[],e=[],f=[];b=a.shift();)c=b.text,c.toLowerCase().indexOf(this.query.toLowerCase())?~c.indexOf(this.query)?e.push(b):f.push(b):d.push(b);return d.concat(e,f)},highlighter:function(b){return a.fn.typeahead.Constructor.prototype.highlighter.call(this,b.text)},updater:function(a){return this.$element.data("value",a.value),a.text},typeaheadRender:function(b){var c=this;return b=a(b).map(function(b,d){return b=a(c.options.item).data("item",d),b.find("a").html(c.highlighter(d)),b[0]}),this.options.autoSelect&&b.first().addClass("active"),this.$menu.html(b),this},typeaheadSelect:function(){var a=this.$menu.find(".active").data("item");return(this.options.autoSelect||a)&&this.$element.val(this.updater(a)).change(),this.hide()},typeaheadMove:function(a){if(this.shown){switch(a.keyCode){case 9:case 13:case 27:if(!this.$menu.find(".active").length)return;a.preventDefault();break;case 38:a.preventDefault(),this.prev();break;case 40:a.preventDefault(),this.next()}a.stopPropagation()}}}),b.defaults=a.extend({},a.fn.editabletypes.list.defaults,{tpl:'<input type="text">',typeahead:null,clear:!0}),a.fn.editabletypes.typeahead=b}(window.jQuery);

/**
Address editable input.
Internally value stored as {city: "Moscow", street: "Lenina", building: "15"}

@class address
@extends abstractinput
@final
@example
<a href="#" id="address" data-type="address" data-pk="1">awesome</a>
<script>
$(function(){
    $('#address').editable({
        url: '/post',
        title: 'Enter city, street and building #',
        value: {
            city: "Moscow", 
            street: "Lenina", 
            building: "15"
        }
    });
});
</script>
**/
!function(t){"use strict";var i=function(t){this.init("address",t,i.defaults)};t.fn.editableutils.inherit(i,t.fn.editabletypes.abstractinput),t.extend(i.prototype,{render:function(){this.$input=this.$tpl.find("input")},value2html:function(i,e){if(i){var n=t("<div>").text(i.city).html()+", "+t("<div>").text(i.street).html()+" st., bld. "+t("<div>").text(i.building).html();t(e).html(n)}else t(e).empty()},html2value:function(t){return null},value2str:function(t){var i="";if(t)for(var e in t)i=i+e+":"+t[e]+";";return i},str2value:function(t){return t},value2input:function(t){t&&(this.$input.filter('[name="street"]').val(t.street),this.$input.filter('[name="zip"]').val(t.zip),this.$input.filter('[name="city"]').val(t.city))},input2value:function(){return{street:this.$input.filter('[name="street"]').val(),zip:this.$input.filter('[name="zip"]').val(),city:this.$input.filter('[name="city"]').val()}},activate:function(){this.$input.filter('[name="city"]').focus()},autosubmit:function(){this.$input.keydown(function(i){13===i.which&&t(this).closest("form").submit()})}}),i.defaults=t.extend({},t.fn.editabletypes.abstractinput.defaults,{tpl:'<div class="editable-address"><label><span style="margin-top:4px;">Street: </span><input type="text" name="street" class="m-wrap input-big" style="height:18px;"></label></div><div class="editable-address"><label><span style="margin-top:4px;">Zip: </span><input type="text" name="zip" class="m-wrap input-big" style="height:18px;"></label></div><div class="editable-address"><label><span style="margin-top:4px;">City: </span><input type="text" name="city" class="m-wrap input-big" style="height:18px;"></label></div>',inputclass:""}),t.fn.editabletypes.address=i}(window.jQuery);

/**
Bootstrap wysihtml5 editor. Based on [bootstrap-wysihtml5](https://github.com/jhollingworth/bootstrap-wysihtml5).  
You should include this input **manually** with dependent js and css files from `inputs-ext` directory.

    <link href="js/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2.css" rel="stylesheet" type="text/css"></link>  
    <script src="js/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/wysihtml5-0.3.0.min.js"></script>  
    <script src="js/inputs-ext/wysihtml5/bootstrap-wysihtml5-0.0.2/bootstrap-wysihtml5-0.0.2.min.js"></script>  
    <script src="js/inputs-ext/wysihtml5/wysihtml5.js"></script>  

**Note:** It's better to use fresh bootstrap-wysihtml5 from it's [master branch](https://github.com/jhollingworth/bootstrap-wysihtml5/tree/master/src) as there is update for correct image insertion.    
    
@class wysihtml5
@extends abstractinput
@final
@since 1.4.0
@example
<div id="comments" data-type="wysihtml5" data-pk="1"><h2>awesome</h2> comment!</div>
<script>
$(function(){
    $('#comments').editable({
        url: '/post',
        title: 'Enter comments'
    });
});
</script>
**/
!function(t){"use strict";var e=function(i){this.init("wysihtml5",i,e.defaults),this.options.wysihtml5=t.extend({},e.defaults.wysihtml5,i.wysihtml5)};t.fn.editableutils.inherit(e,t.fn.editabletypes.abstractinput),t.extend(e.prototype,{render:function(){var e=t.Deferred();return this.$input.attr("id","textarea_"+(new Date).getTime()),this.setClass(),this.setAttr("placeholder"),t.extend(this.options.wysihtml5,{events:{load:function(){e.resolve()}}}),this.$input.wysihtml5(this.options.wysihtml5),/msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase())&&this.$input.before("<br><br>"),e.promise()},value2html:function(e,i){t(i).html(e)},html2value:function(t){return t},value2input:function(t){this.$input.data("wysihtml5").editor.setValue(t,!0)},activate:function(){this.$input.data("wysihtml5").editor.focus()}}),e.defaults=t.extend({},t.fn.editabletypes.abstractinput.defaults,{tpl:'<textarea class="m-wrap span12" style="margin:0px !important;"></textarea>',inputclass:"editable-wysihtml5",placeholder:null,wysihtml5:{stylesheets:!1}}),t.fn.editabletypes.wysihtml5=e}(window.jQuery);

/*!
 DataTables 1.10.16
 ©2008-2017 SpryMedia Ltd - datatables.net/license
*/
(function(h){"function"===typeof define&&define.amd?define(["jquery"],function(E){return h(E,window,document)}):"object"===typeof exports?module.exports=function(E,G){E||(E=window);G||(G="undefined"!==typeof window?require("jquery"):require("jquery")(E));return h(G,E,E.document)}:h(jQuery,window,document)})(function(h,E,G,k){function X(a){var b,c,d={};h.each(a,function(e){if((b=e.match(/^([^A-Z]+?)([A-Z])/))&&-1!=="a aa ai ao as b fn i m o s ".indexOf(b[1]+" "))c=e.replace(b[0],b[2].toLowerCase()),
d[c]=e,"o"===b[1]&&X(a[e])});a._hungarianMap=d}function I(a,b,c){a._hungarianMap||X(a);var d;h.each(b,function(e){d=a._hungarianMap[e];if(d!==k&&(c||b[d]===k))"o"===d.charAt(0)?(b[d]||(b[d]={}),h.extend(!0,b[d],b[e]),I(a[d],b[d],c)):b[d]=b[e]})}function Ca(a){var b=m.defaults.oLanguage,c=a.sZeroRecords;!a.sEmptyTable&&(c&&"No data available in table"===b.sEmptyTable)&&F(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&(c&&"Loading..."===b.sLoadingRecords)&&F(a,a,"sZeroRecords","sLoadingRecords");
a.sInfoThousands&&(a.sThousands=a.sInfoThousands);(a=a.sDecimal)&&cb(a)}function db(a){A(a,"ordering","bSort");A(a,"orderMulti","bSortMulti");A(a,"orderClasses","bSortClasses");A(a,"orderCellsTop","bSortCellsTop");A(a,"order","aaSorting");A(a,"orderFixed","aaSortingFixed");A(a,"paging","bPaginate");A(a,"pagingType","sPaginationType");A(a,"pageLength","iDisplayLength");A(a,"searching","bFilter");"boolean"===typeof a.sScrollX&&(a.sScrollX=a.sScrollX?"100%":"");"boolean"===typeof a.scrollX&&(a.scrollX=
a.scrollX?"100%":"");if(a=a.aoSearchCols)for(var b=0,c=a.length;b<c;b++)a[b]&&I(m.models.oSearch,a[b])}function eb(a){A(a,"orderable","bSortable");A(a,"orderData","aDataSort");A(a,"orderSequence","asSorting");A(a,"orderDataType","sortDataType");var b=a.aDataSort;"number"===typeof b&&!h.isArray(b)&&(a.aDataSort=[b])}function fb(a){if(!m.__browser){var b={};m.__browser=b;var c=h("<div/>").css({position:"fixed",top:0,left:-1*h(E).scrollLeft(),height:1,width:1,overflow:"hidden"}).append(h("<div/>").css({position:"absolute",
top:1,left:1,width:100,overflow:"scroll"}).append(h("<div/>").css({width:"100%",height:10}))).appendTo("body"),d=c.children(),e=d.children();b.barWidth=d[0].offsetWidth-d[0].clientWidth;b.bScrollOversize=100===e[0].offsetWidth&&100!==d[0].clientWidth;b.bScrollbarLeft=1!==Math.round(e.offset().left);b.bBounding=c[0].getBoundingClientRect().width?!0:!1;c.remove()}h.extend(a.oBrowser,m.__browser);a.oScroll.iBarWidth=m.__browser.barWidth}function gb(a,b,c,d,e,f){var g,j=!1;c!==k&&(g=c,j=!0);for(;d!==
e;)a.hasOwnProperty(d)&&(g=j?b(g,a[d],d,a):a[d],j=!0,d+=f);return g}function Da(a,b){var c=m.defaults.column,d=a.aoColumns.length,c=h.extend({},m.models.oColumn,c,{nTh:b?b:G.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:"",aDataSort:c.aDataSort?c.aDataSort:[d],mData:c.mData?c.mData:d,idx:d});a.aoColumns.push(c);c=a.aoPreSearchCols;c[d]=h.extend({},m.models.oSearch,c[d]);ja(a,d,h(b).data())}function ja(a,b,c){var b=a.aoColumns[b],d=a.oClasses,e=h(b.nTh);if(!b.sWidthOrig){b.sWidthOrig=
e.attr("width")||null;var f=(e.attr("style")||"").match(/width:\s*(\d+[pxem%]+)/);f&&(b.sWidthOrig=f[1])}c!==k&&null!==c&&(eb(c),I(m.defaults.column,c),c.mDataProp!==k&&!c.mData&&(c.mData=c.mDataProp),c.sType&&(b._sManualType=c.sType),c.className&&!c.sClass&&(c.sClass=c.className),c.sClass&&e.addClass(c.sClass),h.extend(b,c),F(b,c,"sWidth","sWidthOrig"),c.iDataSort!==k&&(b.aDataSort=[c.iDataSort]),F(b,c,"aDataSort"));var g=b.mData,j=Q(g),i=b.mRender?Q(b.mRender):null,c=function(a){return"string"===
typeof a&&-1!==a.indexOf("@")};b._bAttrSrc=h.isPlainObject(g)&&(c(g.sort)||c(g.type)||c(g.filter));b._setter=null;b.fnGetData=function(a,b,c){var d=j(a,b,k,c);return i&&b?i(d,b,a,c):d};b.fnSetData=function(a,b,c){return R(g)(a,b,c)};"number"!==typeof g&&(a._rowReadObject=!0);a.oFeatures.bSort||(b.bSortable=!1,e.addClass(d.sSortableNone));a=-1!==h.inArray("asc",b.asSorting);c=-1!==h.inArray("desc",b.asSorting);!b.bSortable||!a&&!c?(b.sSortingClass=d.sSortableNone,b.sSortingClassJUI=""):a&&!c?(b.sSortingClass=
d.sSortableAsc,b.sSortingClassJUI=d.sSortJUIAscAllowed):!a&&c?(b.sSortingClass=d.sSortableDesc,b.sSortingClassJUI=d.sSortJUIDescAllowed):(b.sSortingClass=d.sSortable,b.sSortingClassJUI=d.sSortJUI)}function Y(a){if(!1!==a.oFeatures.bAutoWidth){var b=a.aoColumns;Ea(a);for(var c=0,d=b.length;c<d;c++)b[c].nTh.style.width=b[c].sWidth}b=a.oScroll;(""!==b.sY||""!==b.sX)&&ka(a);r(a,null,"column-sizing",[a])}function Z(a,b){var c=la(a,"bVisible");return"number"===typeof c[b]?c[b]:null}function $(a,b){var c=
la(a,"bVisible"),c=h.inArray(b,c);return-1!==c?c:null}function aa(a){var b=0;h.each(a.aoColumns,function(a,d){d.bVisible&&"none"!==h(d.nTh).css("display")&&b++});return b}function la(a,b){var c=[];h.map(a.aoColumns,function(a,e){a[b]&&c.push(e)});return c}function Fa(a){var b=a.aoColumns,c=a.aoData,d=m.ext.type.detect,e,f,g,j,i,h,l,q,t;e=0;for(f=b.length;e<f;e++)if(l=b[e],t=[],!l.sType&&l._sManualType)l.sType=l._sManualType;else if(!l.sType){g=0;for(j=d.length;g<j;g++){i=0;for(h=c.length;i<h;i++){t[i]===
k&&(t[i]=B(a,i,e,"type"));q=d[g](t[i],a);if(!q&&g!==d.length-1)break;if("html"===q)break}if(q){l.sType=q;break}}l.sType||(l.sType="string")}}function hb(a,b,c,d){var e,f,g,j,i,n,l=a.aoColumns;if(b)for(e=b.length-1;0<=e;e--){n=b[e];var q=n.targets!==k?n.targets:n.aTargets;h.isArray(q)||(q=[q]);f=0;for(g=q.length;f<g;f++)if("number"===typeof q[f]&&0<=q[f]){for(;l.length<=q[f];)Da(a);d(q[f],n)}else if("number"===typeof q[f]&&0>q[f])d(l.length+q[f],n);else if("string"===typeof q[f]){j=0;for(i=l.length;j<
i;j++)("_all"==q[f]||h(l[j].nTh).hasClass(q[f]))&&d(j,n)}}if(c){e=0;for(a=c.length;e<a;e++)d(e,c[e])}}function M(a,b,c,d){var e=a.aoData.length,f=h.extend(!0,{},m.models.oRow,{src:c?"dom":"data",idx:e});f._aData=b;a.aoData.push(f);for(var g=a.aoColumns,j=0,i=g.length;j<i;j++)g[j].sType=null;a.aiDisplayMaster.push(e);b=a.rowIdFn(b);b!==k&&(a.aIds[b]=f);(c||!a.oFeatures.bDeferRender)&&Ga(a,e,c,d);return e}function ma(a,b){var c;b instanceof h||(b=h(b));return b.map(function(b,e){c=Ha(a,e);return M(a,
c.data,e,c.cells)})}function B(a,b,c,d){var e=a.iDraw,f=a.aoColumns[c],g=a.aoData[b]._aData,j=f.sDefaultContent,i=f.fnGetData(g,d,{settings:a,row:b,col:c});if(i===k)return a.iDrawError!=e&&null===j&&(J(a,0,"Requested unknown parameter "+("function"==typeof f.mData?"{function}":"'"+f.mData+"'")+" for row "+b+", column "+c,4),a.iDrawError=e),j;if((i===g||null===i)&&null!==j&&d!==k)i=j;else if("function"===typeof i)return i.call(g);return null===i&&"display"==d?"":i}function ib(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,
d,{settings:a,row:b,col:c})}function Ia(a){return h.map(a.match(/(\\.|[^\.])+/g)||[""],function(a){return a.replace(/\\\./g,".")})}function Q(a){if(h.isPlainObject(a)){var b={};h.each(a,function(a,c){c&&(b[a]=Q(c))});return function(a,c,f,g){var j=b[c]||b._;return j!==k?j(a,c,f,g):a}}if(null===a)return function(a){return a};if("function"===typeof a)return function(b,c,f,g){return a(b,c,f,g)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var c=function(a,
b,f){var g,j;if(""!==f){j=Ia(f);for(var i=0,n=j.length;i<n;i++){f=j[i].match(ba);g=j[i].match(U);if(f){j[i]=j[i].replace(ba,"");""!==j[i]&&(a=a[j[i]]);g=[];j.splice(0,i+1);j=j.join(".");if(h.isArray(a)){i=0;for(n=a.length;i<n;i++)g.push(c(a[i],b,j))}a=f[0].substring(1,f[0].length-1);a=""===a?g:g.join(a);break}else if(g){j[i]=j[i].replace(U,"");a=a[j[i]]();continue}if(null===a||a[j[i]]===k)return k;a=a[j[i]]}}return a};return function(b,e){return c(b,e,a)}}return function(b){return b[a]}}function R(a){if(h.isPlainObject(a))return R(a._);
if(null===a)return function(){};if("function"===typeof a)return function(b,d,e){a(b,"set",d,e)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var b=function(a,d,e){var e=Ia(e),f;f=e[e.length-1];for(var g,j,i=0,n=e.length-1;i<n;i++){g=e[i].match(ba);j=e[i].match(U);if(g){e[i]=e[i].replace(ba,"");a[e[i]]=[];f=e.slice();f.splice(0,i+1);g=f.join(".");if(h.isArray(d)){j=0;for(n=d.length;j<n;j++)f={},b(f,d[j],g),a[e[i]].push(f)}else a[e[i]]=d;return}j&&(e[i]=e[i].replace(U,
""),a=a[e[i]](d));if(null===a[e[i]]||a[e[i]]===k)a[e[i]]={};a=a[e[i]]}if(f.match(U))a[f.replace(U,"")](d);else a[f.replace(ba,"")]=d};return function(c,d){return b(c,d,a)}}return function(b,d){b[a]=d}}function Ja(a){return D(a.aoData,"_aData")}function na(a){a.aoData.length=0;a.aiDisplayMaster.length=0;a.aiDisplay.length=0;a.aIds={}}function oa(a,b,c){for(var d=-1,e=0,f=a.length;e<f;e++)a[e]==b?d=e:a[e]>b&&a[e]--; -1!=d&&c===k&&a.splice(d,1)}function ca(a,b,c,d){var e=a.aoData[b],f,g=function(c,d){for(;c.childNodes.length;)c.removeChild(c.firstChild);
c.innerHTML=B(a,b,d,"display")};if("dom"===c||(!c||"auto"===c)&&"dom"===e.src)e._aData=Ha(a,e,d,d===k?k:e._aData).data;else{var j=e.anCells;if(j)if(d!==k)g(j[d],d);else{c=0;for(f=j.length;c<f;c++)g(j[c],c)}}e._aSortData=null;e._aFilterData=null;g=a.aoColumns;if(d!==k)g[d].sType=null;else{c=0;for(f=g.length;c<f;c++)g[c].sType=null;Ka(a,e)}}function Ha(a,b,c,d){var e=[],f=b.firstChild,g,j,i=0,n,l=a.aoColumns,q=a._rowReadObject,d=d!==k?d:q?{}:[],t=function(a,b){if("string"===typeof a){var c=a.indexOf("@");
-1!==c&&(c=a.substring(c+1),R(a)(d,b.getAttribute(c)))}},m=function(a){if(c===k||c===i)j=l[i],n=h.trim(a.innerHTML),j&&j._bAttrSrc?(R(j.mData._)(d,n),t(j.mData.sort,a),t(j.mData.type,a),t(j.mData.filter,a)):q?(j._setter||(j._setter=R(j.mData)),j._setter(d,n)):d[i]=n;i++};if(f)for(;f;){g=f.nodeName.toUpperCase();if("TD"==g||"TH"==g)m(f),e.push(f);f=f.nextSibling}else{e=b.anCells;f=0;for(g=e.length;f<g;f++)m(e[f])}if(b=b.firstChild?b:b.nTr)(b=b.getAttribute("id"))&&R(a.rowId)(d,b);return{data:d,cells:e}}
function Ga(a,b,c,d){var e=a.aoData[b],f=e._aData,g=[],j,i,n,l,q;if(null===e.nTr){j=c||G.createElement("tr");e.nTr=j;e.anCells=g;j._DT_RowIndex=b;Ka(a,e);l=0;for(q=a.aoColumns.length;l<q;l++){n=a.aoColumns[l];i=c?d[l]:G.createElement(n.sCellType);i._DT_CellIndex={row:b,column:l};g.push(i);if((!c||n.mRender||n.mData!==l)&&(!h.isPlainObject(n.mData)||n.mData._!==l+".display"))i.innerHTML=B(a,b,l,"display");n.sClass&&(i.className+=" "+n.sClass);n.bVisible&&!c?j.appendChild(i):!n.bVisible&&c&&i.parentNode.removeChild(i);
n.fnCreatedCell&&n.fnCreatedCell.call(a.oInstance,i,B(a,b,l),f,b,l)}r(a,"aoRowCreatedCallback",null,[j,f,b])}e.nTr.setAttribute("role","row")}function Ka(a,b){var c=b.nTr,d=b._aData;if(c){var e=a.rowIdFn(d);e&&(c.id=e);d.DT_RowClass&&(e=d.DT_RowClass.split(" "),b.__rowc=b.__rowc?qa(b.__rowc.concat(e)):e,h(c).removeClass(b.__rowc.join(" ")).addClass(d.DT_RowClass));d.DT_RowAttr&&h(c).attr(d.DT_RowAttr);d.DT_RowData&&h(c).data(d.DT_RowData)}}function jb(a){var b,c,d,e,f,g=a.nTHead,j=a.nTFoot,i=0===
h("th, td",g).length,n=a.oClasses,l=a.aoColumns;i&&(e=h("<tr/>").appendTo(g));b=0;for(c=l.length;b<c;b++)f=l[b],d=h(f.nTh).addClass(f.sClass),i&&d.appendTo(e),a.oFeatures.bSort&&(d.addClass(f.sSortingClass),!1!==f.bSortable&&(d.attr("tabindex",a.iTabIndex).attr("aria-controls",a.sTableId),La(a,f.nTh,b))),f.sTitle!=d[0].innerHTML&&d.html(f.sTitle),Ma(a,"header")(a,d,f,n);i&&da(a.aoHeader,g);h(g).find(">tr").attr("role","row");h(g).find(">tr>th, >tr>td").addClass(n.sHeaderTH);h(j).find(">tr>th, >tr>td").addClass(n.sFooterTH);
if(null!==j){a=a.aoFooter[0];b=0;for(c=a.length;b<c;b++)f=l[b],f.nTf=a[b].cell,f.sClass&&h(f.nTf).addClass(f.sClass)}}function ea(a,b,c){var d,e,f,g=[],j=[],i=a.aoColumns.length,n;if(b){c===k&&(c=!1);d=0;for(e=b.length;d<e;d++){g[d]=b[d].slice();g[d].nTr=b[d].nTr;for(f=i-1;0<=f;f--)!a.aoColumns[f].bVisible&&!c&&g[d].splice(f,1);j.push([])}d=0;for(e=g.length;d<e;d++){if(a=g[d].nTr)for(;f=a.firstChild;)a.removeChild(f);f=0;for(b=g[d].length;f<b;f++)if(n=i=1,j[d][f]===k){a.appendChild(g[d][f].cell);
for(j[d][f]=1;g[d+i]!==k&&g[d][f].cell==g[d+i][f].cell;)j[d+i][f]=1,i++;for(;g[d][f+n]!==k&&g[d][f].cell==g[d][f+n].cell;){for(c=0;c<i;c++)j[d+c][f+n]=1;n++}h(g[d][f].cell).attr("rowspan",i).attr("colspan",n)}}}}function N(a){var b=r(a,"aoPreDrawCallback","preDraw",[a]);if(-1!==h.inArray(!1,b))C(a,!1);else{var b=[],c=0,d=a.asStripeClasses,e=d.length,f=a.oLanguage,g=a.iInitDisplayStart,j="ssp"==y(a),i=a.aiDisplay;a.bDrawing=!0;g!==k&&-1!==g&&(a._iDisplayStart=j?g:g>=a.fnRecordsDisplay()?0:g,a.iInitDisplayStart=
-1);var g=a._iDisplayStart,n=a.fnDisplayEnd();if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++,C(a,!1);else if(j){if(!a.bDestroying&&!kb(a))return}else a.iDraw++;if(0!==i.length){f=j?a.aoData.length:n;for(j=j?0:g;j<f;j++){var l=i[j],q=a.aoData[l];null===q.nTr&&Ga(a,l);l=q.nTr;if(0!==e){var t=d[c%e];q._sRowStripe!=t&&(h(l).removeClass(q._sRowStripe).addClass(t),q._sRowStripe=t)}r(a,"aoRowCallback",null,[l,q._aData,c,j]);b.push(l);c++}}else c=f.sZeroRecords,1==a.iDraw&&"ajax"==y(a)?c=f.sLoadingRecords:
f.sEmptyTable&&0===a.fnRecordsTotal()&&(c=f.sEmptyTable),b[0]=h("<tr/>",{"class":e?d[0]:""}).append(h("<td />",{valign:"top",colSpan:aa(a),"class":a.oClasses.sRowEmpty}).html(c))[0];r(a,"aoHeaderCallback","header",[h(a.nTHead).children("tr")[0],Ja(a),g,n,i]);r(a,"aoFooterCallback","footer",[h(a.nTFoot).children("tr")[0],Ja(a),g,n,i]);d=h(a.nTBody);d.children().detach();d.append(h(b));r(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1}}function S(a,b){var c=a.oFeatures,d=c.bFilter;
c.bSort&&lb(a);d?fa(a,a.oPreviousSearch):a.aiDisplay=a.aiDisplayMaster.slice();!0!==b&&(a._iDisplayStart=0);a._drawHold=b;N(a);a._drawHold=!1}function mb(a){var b=a.oClasses,c=h(a.nTable),c=h("<div/>").insertBefore(c),d=a.oFeatures,e=h("<div/>",{id:a.sTableId+"_wrapper","class":b.sWrapper+(a.nTFoot?"":" "+b.sNoFooter)});a.nHolding=c[0];a.nTableWrapper=e[0];a.nTableReinsertBefore=a.nTable.nextSibling;for(var f=a.sDom.split(""),g,j,i,n,l,q,k=0;k<f.length;k++){g=null;j=f[k];if("<"==j){i=h("<div/>")[0];
n=f[k+1];if("'"==n||'"'==n){l="";for(q=2;f[k+q]!=n;)l+=f[k+q],q++;"H"==l?l=b.sJUIHeader:"F"==l&&(l=b.sJUIFooter);-1!=l.indexOf(".")?(n=l.split("."),i.id=n[0].substr(1,n[0].length-1),i.className=n[1]):"#"==l.charAt(0)?i.id=l.substr(1,l.length-1):i.className=l;k+=q}e.append(i);e=h(i)}else if(">"==j)e=e.parent();else if("l"==j&&d.bPaginate&&d.bLengthChange)g=nb(a);else if("f"==j&&d.bFilter)g=ob(a);else if("r"==j&&d.bProcessing)g=pb(a);else if("t"==j)g=qb(a);else if("i"==j&&d.bInfo)g=rb(a);else if("p"==
j&&d.bPaginate)g=sb(a);else if(0!==m.ext.feature.length){i=m.ext.feature;q=0;for(n=i.length;q<n;q++)if(j==i[q].cFeature){g=i[q].fnInit(a);break}}g&&(i=a.aanFeatures,i[j]||(i[j]=[]),i[j].push(g),e.append(g))}c.replaceWith(e);a.nHolding=null}function da(a,b){var c=h(b).children("tr"),d,e,f,g,j,i,n,l,q,k;a.splice(0,a.length);f=0;for(i=c.length;f<i;f++)a.push([]);f=0;for(i=c.length;f<i;f++){d=c[f];for(e=d.firstChild;e;){if("TD"==e.nodeName.toUpperCase()||"TH"==e.nodeName.toUpperCase()){l=1*e.getAttribute("colspan");
q=1*e.getAttribute("rowspan");l=!l||0===l||1===l?1:l;q=!q||0===q||1===q?1:q;g=0;for(j=a[f];j[g];)g++;n=g;k=1===l?!0:!1;for(j=0;j<l;j++)for(g=0;g<q;g++)a[f+g][n+j]={cell:e,unique:k},a[f+g].nTr=d}e=e.nextSibling}}}function ra(a,b,c){var d=[];c||(c=a.aoHeader,b&&(c=[],da(c,b)));for(var b=0,e=c.length;b<e;b++)for(var f=0,g=c[b].length;f<g;f++)if(c[b][f].unique&&(!d[f]||!a.bSortCellsTop))d[f]=c[b][f].cell;return d}function sa(a,b,c){r(a,"aoServerParams","serverParams",[b]);if(b&&h.isArray(b)){var d={},
e=/(.*?)\[\]$/;h.each(b,function(a,b){var c=b.name.match(e);c?(c=c[0],d[c]||(d[c]=[]),d[c].push(b.value)):d[b.name]=b.value});b=d}var f,g=a.ajax,j=a.oInstance,i=function(b){r(a,null,"xhr",[a,b,a.jqXHR]);c(b)};if(h.isPlainObject(g)&&g.data){f=g.data;var n=h.isFunction(f)?f(b,a):f,b=h.isFunction(f)&&n?n:h.extend(!0,b,n);delete g.data}n={data:b,success:function(b){var c=b.error||b.sError;c&&J(a,0,c);a.json=b;i(b)},dataType:"json",cache:!1,type:a.sServerMethod,error:function(b,c){var d=r(a,null,"xhr",
[a,null,a.jqXHR]);-1===h.inArray(!0,d)&&("parsererror"==c?J(a,0,"Invalid JSON response",1):4===b.readyState&&J(a,0,"Ajax error",7));C(a,!1)}};a.oAjaxData=b;r(a,null,"preXhr",[a,b]);a.fnServerData?a.fnServerData.call(j,a.sAjaxSource,h.map(b,function(a,b){return{name:b,value:a}}),i,a):a.sAjaxSource||"string"===typeof g?a.jqXHR=h.ajax(h.extend(n,{url:g||a.sAjaxSource})):h.isFunction(g)?a.jqXHR=g.call(j,b,i,a):(a.jqXHR=h.ajax(h.extend(n,g)),g.data=f)}function kb(a){return a.bAjaxDataGet?(a.iDraw++,C(a,
!0),sa(a,tb(a),function(b){ub(a,b)}),!1):!0}function tb(a){var b=a.aoColumns,c=b.length,d=a.oFeatures,e=a.oPreviousSearch,f=a.aoPreSearchCols,g,j=[],i,n,l,k=V(a);g=a._iDisplayStart;i=!1!==d.bPaginate?a._iDisplayLength:-1;var t=function(a,b){j.push({name:a,value:b})};t("sEcho",a.iDraw);t("iColumns",c);t("sColumns",D(b,"sName").join(","));t("iDisplayStart",g);t("iDisplayLength",i);var pa={draw:a.iDraw,columns:[],order:[],start:g,length:i,search:{value:e.sSearch,regex:e.bRegex}};for(g=0;g<c;g++)n=b[g],
l=f[g],i="function"==typeof n.mData?"function":n.mData,pa.columns.push({data:i,name:n.sName,searchable:n.bSearchable,orderable:n.bSortable,search:{value:l.sSearch,regex:l.bRegex}}),t("mDataProp_"+g,i),d.bFilter&&(t("sSearch_"+g,l.sSearch),t("bRegex_"+g,l.bRegex),t("bSearchable_"+g,n.bSearchable)),d.bSort&&t("bSortable_"+g,n.bSortable);d.bFilter&&(t("sSearch",e.sSearch),t("bRegex",e.bRegex));d.bSort&&(h.each(k,function(a,b){pa.order.push({column:b.col,dir:b.dir});t("iSortCol_"+a,b.col);t("sSortDir_"+
a,b.dir)}),t("iSortingCols",k.length));b=m.ext.legacy.ajax;return null===b?a.sAjaxSource?j:pa:b?j:pa}function ub(a,b){var c=ta(a,b),d=b.sEcho!==k?b.sEcho:b.draw,e=b.iTotalRecords!==k?b.iTotalRecords:b.recordsTotal,f=b.iTotalDisplayRecords!==k?b.iTotalDisplayRecords:b.recordsFiltered;if(d){if(1*d<a.iDraw)return;a.iDraw=1*d}na(a);a._iRecordsTotal=parseInt(e,10);a._iRecordsDisplay=parseInt(f,10);d=0;for(e=c.length;d<e;d++)M(a,c[d]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;N(a);a._bInitComplete||
ua(a,b);a.bAjaxDataGet=!0;C(a,!1)}function ta(a,b){var c=h.isPlainObject(a.ajax)&&a.ajax.dataSrc!==k?a.ajax.dataSrc:a.sAjaxDataProp;return"data"===c?b.aaData||b[c]:""!==c?Q(c)(b):b}function ob(a){var b=a.oClasses,c=a.sTableId,d=a.oLanguage,e=a.oPreviousSearch,f=a.aanFeatures,g='<input type="search" class="'+b.sFilterInput+'"/>',j=d.sSearch,j=j.match(/_INPUT_/)?j.replace("_INPUT_",g):j+g,b=h("<div/>",{id:!f.f?c+"_filter":null,"class":b.sFilter}).append(h("<label/>").append(j)),f=function(){var b=!this.value?
"":this.value;b!=e.sSearch&&(fa(a,{sSearch:b,bRegex:e.bRegex,bSmart:e.bSmart,bCaseInsensitive:e.bCaseInsensitive}),a._iDisplayStart=0,N(a))},g=null!==a.searchDelay?a.searchDelay:"ssp"===y(a)?400:0,i=h("input",b).val(e.sSearch).attr("placeholder",d.sSearchPlaceholder).on("keyup.DT search.DT input.DT paste.DT cut.DT",g?Na(f,g):f).on("keypress.DT",function(a){if(13==a.keyCode)return!1}).attr("aria-controls",c);h(a.nTable).on("search.dt.DT",function(b,c){if(a===c)try{i[0]!==G.activeElement&&i.val(e.sSearch)}catch(d){}});
return b[0]}function fa(a,b,c){var d=a.oPreviousSearch,e=a.aoPreSearchCols,f=function(a){d.sSearch=a.sSearch;d.bRegex=a.bRegex;d.bSmart=a.bSmart;d.bCaseInsensitive=a.bCaseInsensitive};Fa(a);if("ssp"!=y(a)){vb(a,b.sSearch,c,b.bEscapeRegex!==k?!b.bEscapeRegex:b.bRegex,b.bSmart,b.bCaseInsensitive);f(b);for(b=0;b<e.length;b++)wb(a,e[b].sSearch,b,e[b].bEscapeRegex!==k?!e[b].bEscapeRegex:e[b].bRegex,e[b].bSmart,e[b].bCaseInsensitive);xb(a)}else f(b);a.bFiltered=!0;r(a,null,"search",[a])}function xb(a){for(var b=
m.ext.search,c=a.aiDisplay,d,e,f=0,g=b.length;f<g;f++){for(var j=[],i=0,n=c.length;i<n;i++)e=c[i],d=a.aoData[e],b[f](a,d._aFilterData,e,d._aData,i)&&j.push(e);c.length=0;h.merge(c,j)}}function wb(a,b,c,d,e,f){if(""!==b){for(var g=[],j=a.aiDisplay,d=Oa(b,d,e,f),e=0;e<j.length;e++)b=a.aoData[j[e]]._aFilterData[c],d.test(b)&&g.push(j[e]);a.aiDisplay=g}}function vb(a,b,c,d,e,f){var d=Oa(b,d,e,f),f=a.oPreviousSearch.sSearch,g=a.aiDisplayMaster,j,e=[];0!==m.ext.search.length&&(c=!0);j=yb(a);if(0>=b.length)a.aiDisplay=
g.slice();else{if(j||c||f.length>b.length||0!==b.indexOf(f)||a.bSorted)a.aiDisplay=g.slice();b=a.aiDisplay;for(c=0;c<b.length;c++)d.test(a.aoData[b[c]]._sFilterRow)&&e.push(b[c]);a.aiDisplay=e}}function Oa(a,b,c,d){a=b?a:Pa(a);c&&(a="^(?=.*?"+h.map(a.match(/"[^"]+"|[^ ]+/g)||[""],function(a){if('"'===a.charAt(0))var b=a.match(/^"(.*)"$/),a=b?b[1]:a;return a.replace('"',"")}).join(")(?=.*?")+").*$");return RegExp(a,d?"i":"")}function yb(a){var b=a.aoColumns,c,d,e,f,g,j,i,h,l=m.ext.type.search;c=!1;
d=0;for(f=a.aoData.length;d<f;d++)if(h=a.aoData[d],!h._aFilterData){j=[];e=0;for(g=b.length;e<g;e++)c=b[e],c.bSearchable?(i=B(a,d,e,"filter"),l[c.sType]&&(i=l[c.sType](i)),null===i&&(i=""),"string"!==typeof i&&i.toString&&(i=i.toString())):i="",i.indexOf&&-1!==i.indexOf("&")&&(va.innerHTML=i,i=Wb?va.textContent:va.innerText),i.replace&&(i=i.replace(/[\r\n]/g,"")),j.push(i);h._aFilterData=j;h._sFilterRow=j.join("  ");c=!0}return c}function zb(a){return{search:a.sSearch,smart:a.bSmart,regex:a.bRegex,
caseInsensitive:a.bCaseInsensitive}}function Ab(a){return{sSearch:a.search,bSmart:a.smart,bRegex:a.regex,bCaseInsensitive:a.caseInsensitive}}function rb(a){var b=a.sTableId,c=a.aanFeatures.i,d=h("<div/>",{"class":a.oClasses.sInfo,id:!c?b+"_info":null});c||(a.aoDrawCallback.push({fn:Bb,sName:"information"}),d.attr("role","status").attr("aria-live","polite"),h(a.nTable).attr("aria-describedby",b+"_info"));return d[0]}function Bb(a){var b=a.aanFeatures.i;if(0!==b.length){var c=a.oLanguage,d=a._iDisplayStart+
1,e=a.fnDisplayEnd(),f=a.fnRecordsTotal(),g=a.fnRecordsDisplay(),j=g?c.sInfo:c.sInfoEmpty;g!==f&&(j+=" "+c.sInfoFiltered);j+=c.sInfoPostFix;j=Cb(a,j);c=c.fnInfoCallback;null!==c&&(j=c.call(a.oInstance,a,d,e,f,g,j));h(b).html(j)}}function Cb(a,b){var c=a.fnFormatNumber,d=a._iDisplayStart+1,e=a._iDisplayLength,f=a.fnRecordsDisplay(),g=-1===e;return b.replace(/_START_/g,c.call(a,d)).replace(/_END_/g,c.call(a,a.fnDisplayEnd())).replace(/_MAX_/g,c.call(a,a.fnRecordsTotal())).replace(/_TOTAL_/g,c.call(a,
f)).replace(/_PAGE_/g,c.call(a,g?1:Math.ceil(d/e))).replace(/_PAGES_/g,c.call(a,g?1:Math.ceil(f/e)))}function ga(a){var b,c,d=a.iInitDisplayStart,e=a.aoColumns,f;c=a.oFeatures;var g=a.bDeferLoading;if(a.bInitialised){mb(a);jb(a);ea(a,a.aoHeader);ea(a,a.aoFooter);C(a,!0);c.bAutoWidth&&Ea(a);b=0;for(c=e.length;b<c;b++)f=e[b],f.sWidth&&(f.nTh.style.width=v(f.sWidth));r(a,null,"preInit",[a]);S(a);e=y(a);if("ssp"!=e||g)"ajax"==e?sa(a,[],function(c){var f=ta(a,c);for(b=0;b<f.length;b++)M(a,f[b]);a.iInitDisplayStart=
d;S(a);C(a,!1);ua(a,c)},a):(C(a,!1),ua(a))}else setTimeout(function(){ga(a)},200)}function ua(a,b){a._bInitComplete=!0;(b||a.oInit.aaData)&&Y(a);r(a,null,"plugin-init",[a,b]);r(a,"aoInitComplete","init",[a,b])}function Qa(a,b){var c=parseInt(b,10);a._iDisplayLength=c;Ra(a);r(a,null,"length",[a,c])}function nb(a){for(var b=a.oClasses,c=a.sTableId,d=a.aLengthMenu,e=h.isArray(d[0]),f=e?d[0]:d,d=e?d[1]:d,e=h("<select/>",{name:c+"_length","aria-controls":c,"class":b.sLengthSelect}),g=0,j=f.length;g<j;g++)e[0][g]=
new Option("number"===typeof d[g]?a.fnFormatNumber(d[g]):d[g],f[g]);var i=h("<div><label/></div>").addClass(b.sLength);a.aanFeatures.l||(i[0].id=c+"_length");i.children().append(a.oLanguage.sLengthMenu.replace("_MENU_",e[0].outerHTML));h("select",i).val(a._iDisplayLength).on("change.DT",function(){Qa(a,h(this).val());N(a)});h(a.nTable).on("length.dt.DT",function(b,c,d){a===c&&h("select",i).val(d)});return i[0]}function sb(a){var b=a.sPaginationType,c=m.ext.pager[b],d="function"===typeof c,e=function(a){N(a)},
b=h("<div/>").addClass(a.oClasses.sPaging+b)[0],f=a.aanFeatures;d||c.fnInit(a,b,e);f.p||(b.id=a.sTableId+"_paginate",a.aoDrawCallback.push({fn:function(a){if(d){var b=a._iDisplayStart,i=a._iDisplayLength,h=a.fnRecordsDisplay(),l=-1===i,b=l?0:Math.ceil(b/i),i=l?1:Math.ceil(h/i),h=c(b,i),k,l=0;for(k=f.p.length;l<k;l++)Ma(a,"pageButton")(a,f.p[l],l,h,b,i)}else c.fnUpdate(a,e)},sName:"pagination"}));return b}function Sa(a,b,c){var d=a._iDisplayStart,e=a._iDisplayLength,f=a.fnRecordsDisplay();0===f||-1===
e?d=0:"number"===typeof b?(d=b*e,d>f&&(d=0)):"first"==b?d=0:"previous"==b?(d=0<=e?d-e:0,0>d&&(d=0)):"next"==b?d+e<f&&(d+=e):"last"==b?d=Math.floor((f-1)/e)*e:J(a,0,"Unknown paging action: "+b,5);b=a._iDisplayStart!==d;a._iDisplayStart=d;b&&(r(a,null,"page",[a]),c&&N(a));return b}function pb(a){return h("<div/>",{id:!a.aanFeatures.r?a.sTableId+"_processing":null,"class":a.oClasses.sProcessing}).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]}function C(a,b){a.oFeatures.bProcessing&&h(a.aanFeatures.r).css("display",
b?"block":"none");r(a,null,"processing",[a,b])}function qb(a){var b=h(a.nTable);b.attr("role","grid");var c=a.oScroll;if(""===c.sX&&""===c.sY)return a.nTable;var d=c.sX,e=c.sY,f=a.oClasses,g=b.children("caption"),j=g.length?g[0]._captionSide:null,i=h(b[0].cloneNode(!1)),n=h(b[0].cloneNode(!1)),l=b.children("tfoot");l.length||(l=null);i=h("<div/>",{"class":f.sScrollWrapper}).append(h("<div/>",{"class":f.sScrollHead}).css({overflow:"hidden",position:"relative",border:0,width:d?!d?null:v(d):"100%"}).append(h("<div/>",
{"class":f.sScrollHeadInner}).css({"box-sizing":"content-box",width:c.sXInner||"100%"}).append(i.removeAttr("id").css("margin-left",0).append("top"===j?g:null).append(b.children("thead"))))).append(h("<div/>",{"class":f.sScrollBody}).css({position:"relative",overflow:"auto",width:!d?null:v(d)}).append(b));l&&i.append(h("<div/>",{"class":f.sScrollFoot}).css({overflow:"hidden",border:0,width:d?!d?null:v(d):"100%"}).append(h("<div/>",{"class":f.sScrollFootInner}).append(n.removeAttr("id").css("margin-left",
0).append("bottom"===j?g:null).append(b.children("tfoot")))));var b=i.children(),k=b[0],f=b[1],t=l?b[2]:null;if(d)h(f).on("scroll.DT",function(){var a=this.scrollLeft;k.scrollLeft=a;l&&(t.scrollLeft=a)});h(f).css(e&&c.bCollapse?"max-height":"height",e);a.nScrollHead=k;a.nScrollBody=f;a.nScrollFoot=t;a.aoDrawCallback.push({fn:ka,sName:"scrolling"});return i[0]}function ka(a){var b=a.oScroll,c=b.sX,d=b.sXInner,e=b.sY,b=b.iBarWidth,f=h(a.nScrollHead),g=f[0].style,j=f.children("div"),i=j[0].style,n=j.children("table"),
j=a.nScrollBody,l=h(j),q=j.style,t=h(a.nScrollFoot).children("div"),m=t.children("table"),o=h(a.nTHead),p=h(a.nTable),s=p[0],r=s.style,u=a.nTFoot?h(a.nTFoot):null,x=a.oBrowser,T=x.bScrollOversize,Xb=D(a.aoColumns,"nTh"),O,K,P,w,Ta=[],y=[],z=[],A=[],B,C=function(a){a=a.style;a.paddingTop="0";a.paddingBottom="0";a.borderTopWidth="0";a.borderBottomWidth="0";a.height=0};K=j.scrollHeight>j.clientHeight;if(a.scrollBarVis!==K&&a.scrollBarVis!==k)a.scrollBarVis=K,Y(a);else{a.scrollBarVis=K;p.children("thead, tfoot").remove();
u&&(P=u.clone().prependTo(p),O=u.find("tr"),P=P.find("tr"));w=o.clone().prependTo(p);o=o.find("tr");K=w.find("tr");w.find("th, td").removeAttr("tabindex");c||(q.width="100%",f[0].style.width="100%");h.each(ra(a,w),function(b,c){B=Z(a,b);c.style.width=a.aoColumns[B].sWidth});u&&H(function(a){a.style.width=""},P);f=p.outerWidth();if(""===c){r.width="100%";if(T&&(p.find("tbody").height()>j.offsetHeight||"scroll"==l.css("overflow-y")))r.width=v(p.outerWidth()-b);f=p.outerWidth()}else""!==d&&(r.width=
v(d),f=p.outerWidth());H(C,K);H(function(a){z.push(a.innerHTML);Ta.push(v(h(a).css("width")))},K);H(function(a,b){if(h.inArray(a,Xb)!==-1)a.style.width=Ta[b]},o);h(K).height(0);u&&(H(C,P),H(function(a){A.push(a.innerHTML);y.push(v(h(a).css("width")))},P),H(function(a,b){a.style.width=y[b]},O),h(P).height(0));H(function(a,b){a.innerHTML='<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+z[b]+"</div>";a.style.width=Ta[b]},K);u&&H(function(a,b){a.innerHTML='<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+
A[b]+"</div>";a.style.width=y[b]},P);if(p.outerWidth()<f){O=j.scrollHeight>j.offsetHeight||"scroll"==l.css("overflow-y")?f+b:f;if(T&&(j.scrollHeight>j.offsetHeight||"scroll"==l.css("overflow-y")))r.width=v(O-b);(""===c||""!==d)&&J(a,1,"Possible column misalignment",6)}else O="100%";q.width=v(O);g.width=v(O);u&&(a.nScrollFoot.style.width=v(O));!e&&T&&(q.height=v(s.offsetHeight+b));c=p.outerWidth();n[0].style.width=v(c);i.width=v(c);d=p.height()>j.clientHeight||"scroll"==l.css("overflow-y");e="padding"+
(x.bScrollbarLeft?"Left":"Right");i[e]=d?b+"px":"0px";u&&(m[0].style.width=v(c),t[0].style.width=v(c),t[0].style[e]=d?b+"px":"0px");p.children("colgroup").insertBefore(p.children("thead"));l.scroll();if((a.bSorted||a.bFiltered)&&!a._drawHold)j.scrollTop=0}}function H(a,b,c){for(var d=0,e=0,f=b.length,g,j;e<f;){g=b[e].firstChild;for(j=c?c[e].firstChild:null;g;)1===g.nodeType&&(c?a(g,j,d):a(g,d),d++),g=g.nextSibling,j=c?j.nextSibling:null;e++}}function Ea(a){var b=a.nTable,c=a.aoColumns,d=a.oScroll,
e=d.sY,f=d.sX,g=d.sXInner,j=c.length,i=la(a,"bVisible"),n=h("th",a.nTHead),l=b.getAttribute("width"),k=b.parentNode,t=!1,m,o,p=a.oBrowser,d=p.bScrollOversize;(m=b.style.width)&&-1!==m.indexOf("%")&&(l=m);for(m=0;m<i.length;m++)o=c[i[m]],null!==o.sWidth&&(o.sWidth=Db(o.sWidthOrig,k),t=!0);if(d||!t&&!f&&!e&&j==aa(a)&&j==n.length)for(m=0;m<j;m++)i=Z(a,m),null!==i&&(c[i].sWidth=v(n.eq(m).width()));else{j=h(b).clone().css("visibility","hidden").removeAttr("id");j.find("tbody tr").remove();var s=h("<tr/>").appendTo(j.find("tbody"));
j.find("thead, tfoot").remove();j.append(h(a.nTHead).clone()).append(h(a.nTFoot).clone());j.find("tfoot th, tfoot td").css("width","");n=ra(a,j.find("thead")[0]);for(m=0;m<i.length;m++)o=c[i[m]],n[m].style.width=null!==o.sWidthOrig&&""!==o.sWidthOrig?v(o.sWidthOrig):"",o.sWidthOrig&&f&&h(n[m]).append(h("<div/>").css({width:o.sWidthOrig,margin:0,padding:0,border:0,height:1}));if(a.aoData.length)for(m=0;m<i.length;m++)t=i[m],o=c[t],h(Eb(a,t)).clone(!1).append(o.sContentPadding).appendTo(s);h("[name]",
j).removeAttr("name");o=h("<div/>").css(f||e?{position:"absolute",top:0,left:0,height:1,right:0,overflow:"hidden"}:{}).append(j).appendTo(k);f&&g?j.width(g):f?(j.css("width","auto"),j.removeAttr("width"),j.width()<k.clientWidth&&l&&j.width(k.clientWidth)):e?j.width(k.clientWidth):l&&j.width(l);for(m=e=0;m<i.length;m++)k=h(n[m]),g=k.outerWidth()-k.width(),k=p.bBounding?Math.ceil(n[m].getBoundingClientRect().width):k.outerWidth(),e+=k,c[i[m]].sWidth=v(k-g);b.style.width=v(e);o.remove()}l&&(b.style.width=
v(l));if((l||f)&&!a._reszEvt)b=function(){h(E).on("resize.DT-"+a.sInstance,Na(function(){Y(a)}))},d?setTimeout(b,1E3):b(),a._reszEvt=!0}function Db(a,b){if(!a)return 0;var c=h("<div/>").css("width",v(a)).appendTo(b||G.body),d=c[0].offsetWidth;c.remove();return d}function Eb(a,b){var c=Fb(a,b);if(0>c)return null;var d=a.aoData[c];return!d.nTr?h("<td/>").html(B(a,c,b,"display"))[0]:d.anCells[b]}function Fb(a,b){for(var c,d=-1,e=-1,f=0,g=a.aoData.length;f<g;f++)c=B(a,f,b,"display")+"",c=c.replace(Yb,
""),c=c.replace(/&nbsp;/g," "),c.length>d&&(d=c.length,e=f);return e}function v(a){return null===a?"0px":"number"==typeof a?0>a?"0px":a+"px":a.match(/\d$/)?a+"px":a}function V(a){var b,c,d=[],e=a.aoColumns,f,g,j,i;b=a.aaSortingFixed;c=h.isPlainObject(b);var n=[];f=function(a){a.length&&!h.isArray(a[0])?n.push(a):h.merge(n,a)};h.isArray(b)&&f(b);c&&b.pre&&f(b.pre);f(a.aaSorting);c&&b.post&&f(b.post);for(a=0;a<n.length;a++){i=n[a][0];f=e[i].aDataSort;b=0;for(c=f.length;b<c;b++)g=f[b],j=e[g].sType||
"string",n[a]._idx===k&&(n[a]._idx=h.inArray(n[a][1],e[g].asSorting)),d.push({src:i,col:g,dir:n[a][1],index:n[a]._idx,type:j,formatter:m.ext.type.order[j+"-pre"]})}return d}function lb(a){var b,c,d=[],e=m.ext.type.order,f=a.aoData,g=0,j,i=a.aiDisplayMaster,h;Fa(a);h=V(a);b=0;for(c=h.length;b<c;b++)j=h[b],j.formatter&&g++,Gb(a,j.col);if("ssp"!=y(a)&&0!==h.length){b=0;for(c=i.length;b<c;b++)d[i[b]]=b;g===h.length?i.sort(function(a,b){var c,e,g,j,i=h.length,k=f[a]._aSortData,m=f[b]._aSortData;for(g=
0;g<i;g++)if(j=h[g],c=k[j.col],e=m[j.col],c=c<e?-1:c>e?1:0,0!==c)return"asc"===j.dir?c:-c;c=d[a];e=d[b];return c<e?-1:c>e?1:0}):i.sort(function(a,b){var c,g,j,i,k=h.length,m=f[a]._aSortData,o=f[b]._aSortData;for(j=0;j<k;j++)if(i=h[j],c=m[i.col],g=o[i.col],i=e[i.type+"-"+i.dir]||e["string-"+i.dir],c=i(c,g),0!==c)return c;c=d[a];g=d[b];return c<g?-1:c>g?1:0})}a.bSorted=!0}function Hb(a){for(var b,c,d=a.aoColumns,e=V(a),a=a.oLanguage.oAria,f=0,g=d.length;f<g;f++){c=d[f];var j=c.asSorting;b=c.sTitle.replace(/<.*?>/g,
"");var i=c.nTh;i.removeAttribute("aria-sort");c.bSortable&&(0<e.length&&e[0].col==f?(i.setAttribute("aria-sort","asc"==e[0].dir?"ascending":"descending"),c=j[e[0].index+1]||j[0]):c=j[0],b+="asc"===c?a.sSortAscending:a.sSortDescending);i.setAttribute("aria-label",b)}}function Ua(a,b,c,d){var e=a.aaSorting,f=a.aoColumns[b].asSorting,g=function(a,b){var c=a._idx;c===k&&(c=h.inArray(a[1],f));return c+1<f.length?c+1:b?null:0};"number"===typeof e[0]&&(e=a.aaSorting=[e]);c&&a.oFeatures.bSortMulti?(c=h.inArray(b,
D(e,"0")),-1!==c?(b=g(e[c],!0),null===b&&1===e.length&&(b=0),null===b?e.splice(c,1):(e[c][1]=f[b],e[c]._idx=b)):(e.push([b,f[0],0]),e[e.length-1]._idx=0)):e.length&&e[0][0]==b?(b=g(e[0]),e.length=1,e[0][1]=f[b],e[0]._idx=b):(e.length=0,e.push([b,f[0]]),e[0]._idx=0);S(a);"function"==typeof d&&d(a)}function La(a,b,c,d){var e=a.aoColumns[c];Va(b,{},function(b){!1!==e.bSortable&&(a.oFeatures.bProcessing?(C(a,!0),setTimeout(function(){Ua(a,c,b.shiftKey,d);"ssp"!==y(a)&&C(a,!1)},0)):Ua(a,c,b.shiftKey,d))})}
function wa(a){var b=a.aLastSort,c=a.oClasses.sSortColumn,d=V(a),e=a.oFeatures,f,g;if(e.bSort&&e.bSortClasses){e=0;for(f=b.length;e<f;e++)g=b[e].src,h(D(a.aoData,"anCells",g)).removeClass(c+(2>e?e+1:3));e=0;for(f=d.length;e<f;e++)g=d[e].src,h(D(a.aoData,"anCells",g)).addClass(c+(2>e?e+1:3))}a.aLastSort=d}function Gb(a,b){var c=a.aoColumns[b],d=m.ext.order[c.sSortDataType],e;d&&(e=d.call(a.oInstance,a,b,$(a,b)));for(var f,g=m.ext.type.order[c.sType+"-pre"],j=0,i=a.aoData.length;j<i;j++)if(c=a.aoData[j],
c._aSortData||(c._aSortData=[]),!c._aSortData[b]||d)f=d?e[j]:B(a,j,b,"sort"),c._aSortData[b]=g?g(f):f}function xa(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b={time:+new Date,start:a._iDisplayStart,length:a._iDisplayLength,order:h.extend(!0,[],a.aaSorting),search:zb(a.oPreviousSearch),columns:h.map(a.aoColumns,function(b,d){return{visible:b.bVisible,search:zb(a.aoPreSearchCols[d])}})};r(a,"aoStateSaveParams","stateSaveParams",[a,b]);a.oSavedState=b;a.fnStateSaveCallback.call(a.oInstance,a,
b)}}function Ib(a,b,c){var d,e,f=a.aoColumns,b=function(b){if(b&&b.time){var g=r(a,"aoStateLoadParams","stateLoadParams",[a,b]);if(-1===h.inArray(!1,g)&&(g=a.iStateDuration,!(0<g&&b.time<+new Date-1E3*g)&&!(b.columns&&f.length!==b.columns.length))){a.oLoadedState=h.extend(!0,{},b);b.start!==k&&(a._iDisplayStart=b.start,a.iInitDisplayStart=b.start);b.length!==k&&(a._iDisplayLength=b.length);b.order!==k&&(a.aaSorting=[],h.each(b.order,function(b,c){a.aaSorting.push(c[0]>=f.length?[0,c[1]]:c)}));b.search!==
k&&h.extend(a.oPreviousSearch,Ab(b.search));if(b.columns){d=0;for(e=b.columns.length;d<e;d++)g=b.columns[d],g.visible!==k&&(f[d].bVisible=g.visible),g.search!==k&&h.extend(a.aoPreSearchCols[d],Ab(g.search))}r(a,"aoStateLoaded","stateLoaded",[a,b])}}c()};if(a.oFeatures.bStateSave){var g=a.fnStateLoadCallback.call(a.oInstance,a,b);g!==k&&b(g)}else c()}function ya(a){var b=m.settings,a=h.inArray(a,D(b,"nTable"));return-1!==a?b[a]:null}function J(a,b,c,d){c="DataTables warning: "+(a?"table id="+a.sTableId+
" - ":"")+c;d&&(c+=". For more information about this error, please see http://datatables.net/tn/"+d);if(b)E.console&&console.log&&console.log(c);else if(b=m.ext,b=b.sErrMode||b.errMode,a&&r(a,null,"error",[a,d,c]),"alert"==b)alert(c);else{if("throw"==b)throw Error(c);"function"==typeof b&&b(a,d,c)}}function F(a,b,c,d){h.isArray(c)?h.each(c,function(c,d){h.isArray(d)?F(a,b,d[0],d[1]):F(a,b,d)}):(d===k&&(d=c),b[c]!==k&&(a[d]=b[c]))}function Jb(a,b,c){var d,e;for(e in b)b.hasOwnProperty(e)&&(d=b[e],
h.isPlainObject(d)?(h.isPlainObject(a[e])||(a[e]={}),h.extend(!0,a[e],d)):a[e]=c&&"data"!==e&&"aaData"!==e&&h.isArray(d)?d.slice():d);return a}function Va(a,b,c){h(a).on("click.DT",b,function(b){a.blur();c(b)}).on("keypress.DT",b,function(a){13===a.which&&(a.preventDefault(),c(a))}).on("selectstart.DT",function(){return!1})}function z(a,b,c,d){c&&a[b].push({fn:c,sName:d})}function r(a,b,c,d){var e=[];b&&(e=h.map(a[b].slice().reverse(),function(b){return b.fn.apply(a.oInstance,d)}));null!==c&&(b=h.Event(c+
".dt"),h(a.nTable).trigger(b,d),e.push(b.result));return e}function Ra(a){var b=a._iDisplayStart,c=a.fnDisplayEnd(),d=a._iDisplayLength;b>=c&&(b=c-d);b-=b%d;if(-1===d||0>b)b=0;a._iDisplayStart=b}function Ma(a,b){var c=a.renderer,d=m.ext.renderer[b];return h.isPlainObject(c)&&c[b]?d[c[b]]||d._:"string"===typeof c?d[c]||d._:d._}function y(a){return a.oFeatures.bServerSide?"ssp":a.ajax||a.sAjaxSource?"ajax":"dom"}function ha(a,b){var c=[],c=Kb.numbers_length,d=Math.floor(c/2);b<=c?c=W(0,b):a<=d?(c=W(0,
c-2),c.push("ellipsis"),c.push(b-1)):(a>=b-1-d?c=W(b-(c-2),b):(c=W(a-d+2,a+d-1),c.push("ellipsis"),c.push(b-1)),c.splice(0,0,"ellipsis"),c.splice(0,0,0));c.DT_el="span";return c}function cb(a){h.each({num:function(b){return za(b,a)},"num-fmt":function(b){return za(b,a,Wa)},"html-num":function(b){return za(b,a,Aa)},"html-num-fmt":function(b){return za(b,a,Aa,Wa)}},function(b,c){x.type.order[b+a+"-pre"]=c;b.match(/^html\-/)&&(x.type.search[b+a]=x.type.search.html)})}function Lb(a){return function(){var b=
[ya(this[m.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return m.ext.internal[a].apply(this,b)}}var m=function(a){this.$=function(a,b){return this.api(!0).$(a,b)};this._=function(a,b){return this.api(!0).rows(a,b).data()};this.api=function(a){return a?new s(ya(this[x.iApiIndex])):new s(this)};this.fnAddData=function(a,b){var c=this.api(!0),d=h.isArray(a)&&(h.isArray(a[0])||h.isPlainObject(a[0]))?c.rows.add(a):c.row.add(a);(b===k||b)&&c.draw();return d.flatten().toArray()};this.fnAdjustColumnSizing=
function(a){var b=this.api(!0).columns.adjust(),c=b.settings()[0],d=c.oScroll;a===k||a?b.draw(!1):(""!==d.sX||""!==d.sY)&&ka(c)};this.fnClearTable=function(a){var b=this.api(!0).clear();(a===k||a)&&b.draw()};this.fnClose=function(a){this.api(!0).row(a).child.hide()};this.fnDeleteRow=function(a,b,c){var d=this.api(!0),a=d.rows(a),e=a.settings()[0],h=e.aoData[a[0][0]];a.remove();b&&b.call(this,e,h);(c===k||c)&&d.draw();return h};this.fnDestroy=function(a){this.api(!0).destroy(a)};this.fnDraw=function(a){this.api(!0).draw(a)};
this.fnFilter=function(a,b,c,d,e,h){e=this.api(!0);null===b||b===k?e.search(a,c,d,h):e.column(b).search(a,c,d,h);e.draw()};this.fnGetData=function(a,b){var c=this.api(!0);if(a!==k){var d=a.nodeName?a.nodeName.toLowerCase():"";return b!==k||"td"==d||"th"==d?c.cell(a,b).data():c.row(a).data()||null}return c.data().toArray()};this.fnGetNodes=function(a){var b=this.api(!0);return a!==k?b.row(a).node():b.rows().nodes().flatten().toArray()};this.fnGetPosition=function(a){var b=this.api(!0),c=a.nodeName.toUpperCase();
return"TR"==c?b.row(a).index():"TD"==c||"TH"==c?(a=b.cell(a).index(),[a.row,a.columnVisible,a.column]):null};this.fnIsOpen=function(a){return this.api(!0).row(a).child.isShown()};this.fnOpen=function(a,b,c){return this.api(!0).row(a).child(b,c).show().child()[0]};this.fnPageChange=function(a,b){var c=this.api(!0).page(a);(b===k||b)&&c.draw(!1)};this.fnSetColumnVis=function(a,b,c){a=this.api(!0).column(a).visible(b);(c===k||c)&&a.columns.adjust().draw()};this.fnSettings=function(){return ya(this[x.iApiIndex])};
this.fnSort=function(a){this.api(!0).order(a).draw()};this.fnSortListener=function(a,b,c){this.api(!0).order.listener(a,b,c)};this.fnUpdate=function(a,b,c,d,e){var h=this.api(!0);c===k||null===c?h.row(b).data(a):h.cell(b,c).data(a);(e===k||e)&&h.columns.adjust();(d===k||d)&&h.draw();return 0};this.fnVersionCheck=x.fnVersionCheck;var b=this,c=a===k,d=this.length;c&&(a={});this.oApi=this.internal=x.internal;for(var e in m.ext.internal)e&&(this[e]=Lb(e));this.each(function(){var e={},g=1<d?Jb(e,a,!0):
a,j=0,i,e=this.getAttribute("id"),n=!1,l=m.defaults,q=h(this);if("table"!=this.nodeName.toLowerCase())J(null,0,"Non-table node initialisation ("+this.nodeName+")",2);else{db(l);eb(l.column);I(l,l,!0);I(l.column,l.column,!0);I(l,h.extend(g,q.data()));var t=m.settings,j=0;for(i=t.length;j<i;j++){var o=t[j];if(o.nTable==this||o.nTHead.parentNode==this||o.nTFoot&&o.nTFoot.parentNode==this){var s=g.bRetrieve!==k?g.bRetrieve:l.bRetrieve;if(c||s)return o.oInstance;if(g.bDestroy!==k?g.bDestroy:l.bDestroy){o.oInstance.fnDestroy();
break}else{J(o,0,"Cannot reinitialise DataTable",3);return}}if(o.sTableId==this.id){t.splice(j,1);break}}if(null===e||""===e)this.id=e="DataTables_Table_"+m.ext._unique++;var p=h.extend(!0,{},m.models.oSettings,{sDestroyWidth:q[0].style.width,sInstance:e,sTableId:e});p.nTable=this;p.oApi=b.internal;p.oInit=g;t.push(p);p.oInstance=1===b.length?b:q.dataTable();db(g);g.oLanguage&&Ca(g.oLanguage);g.aLengthMenu&&!g.iDisplayLength&&(g.iDisplayLength=h.isArray(g.aLengthMenu[0])?g.aLengthMenu[0][0]:g.aLengthMenu[0]);
g=Jb(h.extend(!0,{},l),g);F(p.oFeatures,g,"bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" "));F(p,g,["asStripeClasses","ajax","fnServerData","fnFormatNumber","sServerMethod","aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","sAjaxSource","sAjaxDataProp","iStateDuration","sDom","bSortCellsTop","iTabIndex","fnStateLoadCallback","fnStateSaveCallback","renderer","searchDelay","rowId",["iCookieDuration","iStateDuration"],
["oSearch","oPreviousSearch"],["aoSearchCols","aoPreSearchCols"],["iDisplayLength","_iDisplayLength"]]);F(p.oScroll,g,[["sScrollX","sX"],["sScrollXInner","sXInner"],["sScrollY","sY"],["bScrollCollapse","bCollapse"]]);F(p.oLanguage,g,"fnInfoCallback");z(p,"aoDrawCallback",g.fnDrawCallback,"user");z(p,"aoServerParams",g.fnServerParams,"user");z(p,"aoStateSaveParams",g.fnStateSaveParams,"user");z(p,"aoStateLoadParams",g.fnStateLoadParams,"user");z(p,"aoStateLoaded",g.fnStateLoaded,"user");z(p,"aoRowCallback",
g.fnRowCallback,"user");z(p,"aoRowCreatedCallback",g.fnCreatedRow,"user");z(p,"aoHeaderCallback",g.fnHeaderCallback,"user");z(p,"aoFooterCallback",g.fnFooterCallback,"user");z(p,"aoInitComplete",g.fnInitComplete,"user");z(p,"aoPreDrawCallback",g.fnPreDrawCallback,"user");p.rowIdFn=Q(g.rowId);fb(p);var u=p.oClasses;h.extend(u,m.ext.classes,g.oClasses);q.addClass(u.sTable);p.iInitDisplayStart===k&&(p.iInitDisplayStart=g.iDisplayStart,p._iDisplayStart=g.iDisplayStart);null!==g.iDeferLoading&&(p.bDeferLoading=
!0,e=h.isArray(g.iDeferLoading),p._iRecordsDisplay=e?g.iDeferLoading[0]:g.iDeferLoading,p._iRecordsTotal=e?g.iDeferLoading[1]:g.iDeferLoading);var v=p.oLanguage;h.extend(!0,v,g.oLanguage);v.sUrl&&(h.ajax({dataType:"json",url:v.sUrl,success:function(a){Ca(a);I(l.oLanguage,a);h.extend(true,v,a);ga(p)},error:function(){ga(p)}}),n=!0);null===g.asStripeClasses&&(p.asStripeClasses=[u.sStripeOdd,u.sStripeEven]);var e=p.asStripeClasses,x=q.children("tbody").find("tr").eq(0);-1!==h.inArray(!0,h.map(e,function(a){return x.hasClass(a)}))&&
(h("tbody tr",this).removeClass(e.join(" ")),p.asDestroyStripes=e.slice());e=[];t=this.getElementsByTagName("thead");0!==t.length&&(da(p.aoHeader,t[0]),e=ra(p));if(null===g.aoColumns){t=[];j=0;for(i=e.length;j<i;j++)t.push(null)}else t=g.aoColumns;j=0;for(i=t.length;j<i;j++)Da(p,e?e[j]:null);hb(p,g.aoColumnDefs,t,function(a,b){ja(p,a,b)});if(x.length){var w=function(a,b){return a.getAttribute("data-"+b)!==null?b:null};h(x[0]).children("th, td").each(function(a,b){var c=p.aoColumns[a];if(c.mData===
a){var d=w(b,"sort")||w(b,"order"),e=w(b,"filter")||w(b,"search");if(d!==null||e!==null){c.mData={_:a+".display",sort:d!==null?a+".@data-"+d:k,type:d!==null?a+".@data-"+d:k,filter:e!==null?a+".@data-"+e:k};ja(p,a)}}})}var T=p.oFeatures,e=function(){if(g.aaSorting===k){var a=p.aaSorting;j=0;for(i=a.length;j<i;j++)a[j][1]=p.aoColumns[j].asSorting[0]}wa(p);T.bSort&&z(p,"aoDrawCallback",function(){if(p.bSorted){var a=V(p),b={};h.each(a,function(a,c){b[c.src]=c.dir});r(p,null,"order",[p,a,b]);Hb(p)}});
z(p,"aoDrawCallback",function(){(p.bSorted||y(p)==="ssp"||T.bDeferRender)&&wa(p)},"sc");var a=q.children("caption").each(function(){this._captionSide=h(this).css("caption-side")}),b=q.children("thead");b.length===0&&(b=h("<thead/>").appendTo(q));p.nTHead=b[0];b=q.children("tbody");b.length===0&&(b=h("<tbody/>").appendTo(q));p.nTBody=b[0];b=q.children("tfoot");if(b.length===0&&a.length>0&&(p.oScroll.sX!==""||p.oScroll.sY!==""))b=h("<tfoot/>").appendTo(q);if(b.length===0||b.children().length===0)q.addClass(u.sNoFooter);
else if(b.length>0){p.nTFoot=b[0];da(p.aoFooter,p.nTFoot)}if(g.aaData)for(j=0;j<g.aaData.length;j++)M(p,g.aaData[j]);else(p.bDeferLoading||y(p)=="dom")&&ma(p,h(p.nTBody).children("tr"));p.aiDisplay=p.aiDisplayMaster.slice();p.bInitialised=true;n===false&&ga(p)};g.bStateSave?(T.bStateSave=!0,z(p,"aoDrawCallback",xa,"state_save"),Ib(p,g,e)):e()}});b=null;return this},x,s,o,u,Xa={},Mb=/[\r\n]/g,Aa=/<.*?>/g,Zb=/^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/,$b=RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)",
"g"),Wa=/[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi,L=function(a){return!a||!0===a||"-"===a?!0:!1},Nb=function(a){var b=parseInt(a,10);return!isNaN(b)&&isFinite(a)?b:null},Ob=function(a,b){Xa[b]||(Xa[b]=RegExp(Pa(b),"g"));return"string"===typeof a&&"."!==b?a.replace(/\./g,"").replace(Xa[b],"."):a},Ya=function(a,b,c){var d="string"===typeof a;if(L(a))return!0;b&&d&&(a=Ob(a,b));c&&d&&(a=a.replace(Wa,""));return!isNaN(parseFloat(a))&&isFinite(a)},Pb=function(a,b,c){return L(a)?!0:!(L(a)||"string"===
typeof a)?null:Ya(a.replace(Aa,""),b,c)?!0:null},D=function(a,b,c){var d=[],e=0,f=a.length;if(c!==k)for(;e<f;e++)a[e]&&a[e][b]&&d.push(a[e][b][c]);else for(;e<f;e++)a[e]&&d.push(a[e][b]);return d},ia=function(a,b,c,d){var e=[],f=0,g=b.length;if(d!==k)for(;f<g;f++)a[b[f]][c]&&e.push(a[b[f]][c][d]);else for(;f<g;f++)e.push(a[b[f]][c]);return e},W=function(a,b){var c=[],d;b===k?(b=0,d=a):(d=b,b=a);for(var e=b;e<d;e++)c.push(e);return c},Qb=function(a){for(var b=[],c=0,d=a.length;c<d;c++)a[c]&&b.push(a[c]);
return b},qa=function(a){var b;a:{if(!(2>a.length)){b=a.slice().sort();for(var c=b[0],d=1,e=b.length;d<e;d++){if(b[d]===c){b=!1;break a}c=b[d]}}b=!0}if(b)return a.slice();b=[];var e=a.length,f,g=0,d=0;a:for(;d<e;d++){c=a[d];for(f=0;f<g;f++)if(b[f]===c)continue a;b.push(c);g++}return b};m.util={throttle:function(a,b){var c=b!==k?b:200,d,e;return function(){var b=this,g=+new Date,j=arguments;d&&g<d+c?(clearTimeout(e),e=setTimeout(function(){d=k;a.apply(b,j)},c)):(d=g,a.apply(b,j))}},escapeRegex:function(a){return a.replace($b,
"\\$1")}};var A=function(a,b,c){a[b]!==k&&(a[c]=a[b])},ba=/\[.*?\]$/,U=/\(\)$/,Pa=m.util.escapeRegex,va=h("<div>")[0],Wb=va.textContent!==k,Yb=/<.*?>/g,Na=m.util.throttle,Rb=[],w=Array.prototype,ac=function(a){var b,c,d=m.settings,e=h.map(d,function(a){return a.nTable});if(a){if(a.nTable&&a.oApi)return[a];if(a.nodeName&&"table"===a.nodeName.toLowerCase())return b=h.inArray(a,e),-1!==b?[d[b]]:null;if(a&&"function"===typeof a.settings)return a.settings().toArray();"string"===typeof a?c=h(a):a instanceof
h&&(c=a)}else return[];if(c)return c.map(function(){b=h.inArray(this,e);return-1!==b?d[b]:null}).toArray()};s=function(a,b){if(!(this instanceof s))return new s(a,b);var c=[],d=function(a){(a=ac(a))&&(c=c.concat(a))};if(h.isArray(a))for(var e=0,f=a.length;e<f;e++)d(a[e]);else d(a);this.context=qa(c);b&&h.merge(this,b);this.selector={rows:null,cols:null,opts:null};s.extend(this,this,Rb)};m.Api=s;h.extend(s.prototype,{any:function(){return 0!==this.count()},concat:w.concat,context:[],count:function(){return this.flatten().length},
each:function(a){for(var b=0,c=this.length;b<c;b++)a.call(this,this[b],b,this);return this},eq:function(a){var b=this.context;return b.length>a?new s(b[a],this[a]):null},filter:function(a){var b=[];if(w.filter)b=w.filter.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)a.call(this,this[c],c,this)&&b.push(this[c]);return new s(this.context,b)},flatten:function(){var a=[];return new s(this.context,a.concat.apply(a,this.toArray()))},join:w.join,indexOf:w.indexOf||function(a,b){for(var c=b||0,
d=this.length;c<d;c++)if(this[c]===a)return c;return-1},iterator:function(a,b,c,d){var e=[],f,g,j,h,n,l=this.context,m,o,u=this.selector;"string"===typeof a&&(d=c,c=b,b=a,a=!1);g=0;for(j=l.length;g<j;g++){var r=new s(l[g]);if("table"===b)f=c.call(r,l[g],g),f!==k&&e.push(f);else if("columns"===b||"rows"===b)f=c.call(r,l[g],this[g],g),f!==k&&e.push(f);else if("column"===b||"column-rows"===b||"row"===b||"cell"===b){o=this[g];"column-rows"===b&&(m=Ba(l[g],u.opts));h=0;for(n=o.length;h<n;h++)f=o[h],f=
"cell"===b?c.call(r,l[g],f.row,f.column,g,h):c.call(r,l[g],f,g,h,m),f!==k&&e.push(f)}}return e.length||d?(a=new s(l,a?e.concat.apply([],e):e),b=a.selector,b.rows=u.rows,b.cols=u.cols,b.opts=u.opts,a):this},lastIndexOf:w.lastIndexOf||function(a,b){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,map:function(a){var b=[];if(w.map)b=w.map.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)b.push(a.call(this,this[c],c));return new s(this.context,b)},pluck:function(a){return this.map(function(b){return b[a]})},
pop:w.pop,push:w.push,reduce:w.reduce||function(a,b){return gb(this,a,b,0,this.length,1)},reduceRight:w.reduceRight||function(a,b){return gb(this,a,b,this.length-1,-1,-1)},reverse:w.reverse,selector:null,shift:w.shift,slice:function(){return new s(this.context,this)},sort:w.sort,splice:w.splice,toArray:function(){return w.slice.call(this)},to$:function(){return h(this)},toJQuery:function(){return h(this)},unique:function(){return new s(this.context,qa(this))},unshift:w.unshift});s.extend=function(a,
b,c){if(c.length&&b&&(b instanceof s||b.__dt_wrapper)){var d,e,f,g=function(a,b,c){return function(){var d=b.apply(a,arguments);s.extend(d,d,c.methodExt);return d}};d=0;for(e=c.length;d<e;d++)f=c[d],b[f.name]="function"===typeof f.val?g(a,f.val,f):h.isPlainObject(f.val)?{}:f.val,b[f.name].__dt_wrapper=!0,s.extend(a,b[f.name],f.propExt)}};s.register=o=function(a,b){if(h.isArray(a))for(var c=0,d=a.length;c<d;c++)s.register(a[c],b);else for(var e=a.split("."),f=Rb,g,j,c=0,d=e.length;c<d;c++){g=(j=-1!==
e[c].indexOf("()"))?e[c].replace("()",""):e[c];var i;a:{i=0;for(var n=f.length;i<n;i++)if(f[i].name===g){i=f[i];break a}i=null}i||(i={name:g,val:{},methodExt:[],propExt:[]},f.push(i));c===d-1?i.val=b:f=j?i.methodExt:i.propExt}};s.registerPlural=u=function(a,b,c){s.register(a,c);s.register(b,function(){var a=c.apply(this,arguments);return a===this?this:a instanceof s?a.length?h.isArray(a[0])?new s(a.context,a[0]):a[0]:k:a})};o("tables()",function(a){var b;if(a){b=s;var c=this.context;if("number"===
typeof a)a=[c[a]];else var d=h.map(c,function(a){return a.nTable}),a=h(d).filter(a).map(function(){var a=h.inArray(this,d);return c[a]}).toArray();b=new b(a)}else b=this;return b});o("table()",function(a){var a=this.tables(a),b=a.context;return b.length?new s(b[0]):a});u("tables().nodes()","table().node()",function(){return this.iterator("table",function(a){return a.nTable},1)});u("tables().body()","table().body()",function(){return this.iterator("table",function(a){return a.nTBody},1)});u("tables().header()",
"table().header()",function(){return this.iterator("table",function(a){return a.nTHead},1)});u("tables().footer()","table().footer()",function(){return this.iterator("table",function(a){return a.nTFoot},1)});u("tables().containers()","table().container()",function(){return this.iterator("table",function(a){return a.nTableWrapper},1)});o("draw()",function(a){return this.iterator("table",function(b){"page"===a?N(b):("string"===typeof a&&(a="full-hold"===a?!1:!0),S(b,!1===a))})});o("page()",function(a){return a===
k?this.page.info().page:this.iterator("table",function(b){Sa(b,a)})});o("page.info()",function(){if(0===this.context.length)return k;var a=this.context[0],b=a._iDisplayStart,c=a.oFeatures.bPaginate?a._iDisplayLength:-1,d=a.fnRecordsDisplay(),e=-1===c;return{page:e?0:Math.floor(b/c),pages:e?1:Math.ceil(d/c),start:b,end:a.fnDisplayEnd(),length:c,recordsTotal:a.fnRecordsTotal(),recordsDisplay:d,serverSide:"ssp"===y(a)}});o("page.len()",function(a){return a===k?0!==this.context.length?this.context[0]._iDisplayLength:
k:this.iterator("table",function(b){Qa(b,a)})});var Sb=function(a,b,c){if(c){var d=new s(a);d.one("draw",function(){c(d.ajax.json())})}if("ssp"==y(a))S(a,b);else{C(a,!0);var e=a.jqXHR;e&&4!==e.readyState&&e.abort();sa(a,[],function(c){na(a);for(var c=ta(a,c),d=0,e=c.length;d<e;d++)M(a,c[d]);S(a,b);C(a,!1)})}};o("ajax.json()",function(){var a=this.context;if(0<a.length)return a[0].json});o("ajax.params()",function(){var a=this.context;if(0<a.length)return a[0].oAjaxData});o("ajax.reload()",function(a,
b){return this.iterator("table",function(c){Sb(c,!1===b,a)})});o("ajax.url()",function(a){var b=this.context;if(a===k){if(0===b.length)return k;b=b[0];return b.ajax?h.isPlainObject(b.ajax)?b.ajax.url:b.ajax:b.sAjaxSource}return this.iterator("table",function(b){h.isPlainObject(b.ajax)?b.ajax.url=a:b.ajax=a})});o("ajax.url().load()",function(a,b){return this.iterator("table",function(c){Sb(c,!1===b,a)})});var Za=function(a,b,c,d,e){var f=[],g,j,i,n,l,m;i=typeof b;if(!b||"string"===i||"function"===
i||b.length===k)b=[b];i=0;for(n=b.length;i<n;i++){j=b[i]&&b[i].split&&!b[i].match(/[\[\(:]/)?b[i].split(","):[b[i]];l=0;for(m=j.length;l<m;l++)(g=c("string"===typeof j[l]?h.trim(j[l]):j[l]))&&g.length&&(f=f.concat(g))}a=x.selector[a];if(a.length){i=0;for(n=a.length;i<n;i++)f=a[i](d,e,f)}return qa(f)},$a=function(a){a||(a={});a.filter&&a.search===k&&(a.search=a.filter);return h.extend({search:"none",order:"current",page:"all"},a)},ab=function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].length)return a[0]=
a[b],a[0].length=1,a.length=1,a.context=[a.context[b]],a;a.length=0;return a},Ba=function(a,b){var c,d,e,f=[],g=a.aiDisplay;c=a.aiDisplayMaster;var j=b.search;d=b.order;e=b.page;if("ssp"==y(a))return"removed"===j?[]:W(0,c.length);if("current"==e){c=a._iDisplayStart;for(d=a.fnDisplayEnd();c<d;c++)f.push(g[c])}else if("current"==d||"applied"==d)f="none"==j?c.slice():"applied"==j?g.slice():h.map(c,function(a){return-1===h.inArray(a,g)?a:null});else if("index"==d||"original"==d){c=0;for(d=a.aoData.length;c<
d;c++)"none"==j?f.push(c):(e=h.inArray(c,g),(-1===e&&"removed"==j||0<=e&&"applied"==j)&&f.push(c))}return f};o("rows()",function(a,b){a===k?a="":h.isPlainObject(a)&&(b=a,a="");var b=$a(b),c=this.iterator("table",function(c){var e=b,f;return Za("row",a,function(a){var b=Nb(a);if(b!==null&&!e)return[b];f||(f=Ba(c,e));if(b!==null&&h.inArray(b,f)!==-1)return[b];if(a===null||a===k||a==="")return f;if(typeof a==="function")return h.map(f,function(b){var e=c.aoData[b];return a(b,e._aData,e.nTr)?b:null});
b=Qb(ia(c.aoData,f,"nTr"));if(a.nodeName){if(a._DT_RowIndex!==k)return[a._DT_RowIndex];if(a._DT_CellIndex)return[a._DT_CellIndex.row];b=h(a).closest("*[data-dt-row]");return b.length?[b.data("dt-row")]:[]}if(typeof a==="string"&&a.charAt(0)==="#"){var i=c.aIds[a.replace(/^#/,"")];if(i!==k)return[i.idx]}return h(b).filter(a).map(function(){return this._DT_RowIndex}).toArray()},c,e)},1);c.selector.rows=a;c.selector.opts=b;return c});o("rows().nodes()",function(){return this.iterator("row",function(a,
b){return a.aoData[b].nTr||k},1)});o("rows().data()",function(){return this.iterator(!0,"rows",function(a,b){return ia(a.aoData,b,"_aData")},1)});u("rows().cache()","row().cache()",function(a){return this.iterator("row",function(b,c){var d=b.aoData[c];return"search"===a?d._aFilterData:d._aSortData},1)});u("rows().invalidate()","row().invalidate()",function(a){return this.iterator("row",function(b,c){ca(b,c,a)})});u("rows().indexes()","row().index()",function(){return this.iterator("row",function(a,
b){return b},1)});u("rows().ids()","row().id()",function(a){for(var b=[],c=this.context,d=0,e=c.length;d<e;d++)for(var f=0,g=this[d].length;f<g;f++){var h=c[d].rowIdFn(c[d].aoData[this[d][f]]._aData);b.push((!0===a?"#":"")+h)}return new s(c,b)});u("rows().remove()","row().remove()",function(){var a=this;this.iterator("row",function(b,c,d){var e=b.aoData,f=e[c],g,h,i,n,l;e.splice(c,1);g=0;for(h=e.length;g<h;g++)if(i=e[g],l=i.anCells,null!==i.nTr&&(i.nTr._DT_RowIndex=g),null!==l){i=0;for(n=l.length;i<
n;i++)l[i]._DT_CellIndex.row=g}oa(b.aiDisplayMaster,c);oa(b.aiDisplay,c);oa(a[d],c,!1);0<b._iRecordsDisplay&&b._iRecordsDisplay--;Ra(b);c=b.rowIdFn(f._aData);c!==k&&delete b.aIds[c]});this.iterator("table",function(a){for(var c=0,d=a.aoData.length;c<d;c++)a.aoData[c].idx=c});return this});o("rows.add()",function(a){var b=this.iterator("table",function(b){var c,f,g,h=[];f=0;for(g=a.length;f<g;f++)c=a[f],c.nodeName&&"TR"===c.nodeName.toUpperCase()?h.push(ma(b,c)[0]):h.push(M(b,c));return h},1),c=this.rows(-1);
c.pop();h.merge(c,b);return c});o("row()",function(a,b){return ab(this.rows(a,b))});o("row().data()",function(a){var b=this.context;if(a===k)return b.length&&this.length?b[0].aoData[this[0]]._aData:k;b[0].aoData[this[0]]._aData=a;ca(b[0],this[0],"data");return this});o("row().node()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]].nTr||null:null});o("row.add()",function(a){a instanceof h&&a.length&&(a=a[0]);var b=this.iterator("table",function(b){return a.nodeName&&
"TR"===a.nodeName.toUpperCase()?ma(b,a)[0]:M(b,a)});return this.row(b[0])});var bb=function(a,b){var c=a.context;if(c.length&&(c=c[0].aoData[b!==k?b:a[0]])&&c._details)c._details.remove(),c._detailsShow=k,c._details=k},Tb=function(a,b){var c=a.context;if(c.length&&a.length){var d=c[0].aoData[a[0]];if(d._details){(d._detailsShow=b)?d._details.insertAfter(d.nTr):d._details.detach();var e=c[0],f=new s(e),g=e.aoData;f.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details");0<D(g,
"_details").length&&(f.on("draw.dt.DT_details",function(a,b){e===b&&f.rows({page:"current"}).eq(0).each(function(a){a=g[a];a._detailsShow&&a._details.insertAfter(a.nTr)})}),f.on("column-visibility.dt.DT_details",function(a,b){if(e===b)for(var c,d=aa(b),f=0,h=g.length;f<h;f++)c=g[f],c._details&&c._details.children("td[colspan]").attr("colspan",d)}),f.on("destroy.dt.DT_details",function(a,b){if(e===b)for(var c=0,d=g.length;c<d;c++)g[c]._details&&bb(f,c)}))}}};o("row().child()",function(a,b){var c=this.context;
if(a===k)return c.length&&this.length?c[0].aoData[this[0]]._details:k;if(!0===a)this.child.show();else if(!1===a)bb(this);else if(c.length&&this.length){var d=c[0],c=c[0].aoData[this[0]],e=[],f=function(a,b){if(h.isArray(a)||a instanceof h)for(var c=0,k=a.length;c<k;c++)f(a[c],b);else a.nodeName&&"tr"===a.nodeName.toLowerCase()?e.push(a):(c=h("<tr><td/></tr>").addClass(b),h("td",c).addClass(b).html(a)[0].colSpan=aa(d),e.push(c[0]))};f(a,b);c._details&&c._details.detach();c._details=h(e);c._detailsShow&&
c._details.insertAfter(c.nTr)}return this});o(["row().child.show()","row().child().show()"],function(){Tb(this,!0);return this});o(["row().child.hide()","row().child().hide()"],function(){Tb(this,!1);return this});o(["row().child.remove()","row().child().remove()"],function(){bb(this);return this});o("row().child.isShown()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]]._detailsShow||!1:!1});var bc=/^([^:]+):(name|visIdx|visible)$/,Ub=function(a,b,c,d,e){for(var c=
[],d=0,f=e.length;d<f;d++)c.push(B(a,e[d],b));return c};o("columns()",function(a,b){a===k?a="":h.isPlainObject(a)&&(b=a,a="");var b=$a(b),c=this.iterator("table",function(c){var e=a,f=b,g=c.aoColumns,j=D(g,"sName"),i=D(g,"nTh");return Za("column",e,function(a){var b=Nb(a);if(a==="")return W(g.length);if(b!==null)return[b>=0?b:g.length+b];if(typeof a==="function"){var e=Ba(c,f);return h.map(g,function(b,f){return a(f,Ub(c,f,0,0,e),i[f])?f:null})}var k=typeof a==="string"?a.match(bc):"";if(k)switch(k[2]){case "visIdx":case "visible":b=
parseInt(k[1],10);if(b<0){var m=h.map(g,function(a,b){return a.bVisible?b:null});return[m[m.length+b]]}return[Z(c,b)];case "name":return h.map(j,function(a,b){return a===k[1]?b:null});default:return[]}if(a.nodeName&&a._DT_CellIndex)return[a._DT_CellIndex.column];b=h(i).filter(a).map(function(){return h.inArray(this,i)}).toArray();if(b.length||!a.nodeName)return b;b=h(a).closest("*[data-dt-column]");return b.length?[b.data("dt-column")]:[]},c,f)},1);c.selector.cols=a;c.selector.opts=b;return c});u("columns().header()",
"column().header()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTh},1)});u("columns().footer()","column().footer()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTf},1)});u("columns().data()","column().data()",function(){return this.iterator("column-rows",Ub,1)});u("columns().dataSrc()","column().dataSrc()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].mData},1)});u("columns().cache()","column().cache()",
function(a){return this.iterator("column-rows",function(b,c,d,e,f){return ia(b.aoData,f,"search"===a?"_aFilterData":"_aSortData",c)},1)});u("columns().nodes()","column().nodes()",function(){return this.iterator("column-rows",function(a,b,c,d,e){return ia(a.aoData,e,"anCells",b)},1)});u("columns().visible()","column().visible()",function(a,b){var c=this.iterator("column",function(b,c){if(a===k)return b.aoColumns[c].bVisible;var f=b.aoColumns,g=f[c],j=b.aoData,i,n,l;if(a!==k&&g.bVisible!==a){if(a){var m=
h.inArray(!0,D(f,"bVisible"),c+1);i=0;for(n=j.length;i<n;i++)l=j[i].nTr,f=j[i].anCells,l&&l.insertBefore(f[c],f[m]||null)}else h(D(b.aoData,"anCells",c)).detach();g.bVisible=a;ea(b,b.aoHeader);ea(b,b.aoFooter);xa(b)}});a!==k&&(this.iterator("column",function(c,e){r(c,null,"column-visibility",[c,e,a,b])}),(b===k||b)&&this.columns.adjust());return c});u("columns().indexes()","column().index()",function(a){return this.iterator("column",function(b,c){return"visible"===a?$(b,c):c},1)});o("columns.adjust()",
function(){return this.iterator("table",function(a){Y(a)},1)});o("column.index()",function(a,b){if(0!==this.context.length){var c=this.context[0];if("fromVisible"===a||"toData"===a)return Z(c,b);if("fromData"===a||"toVisible"===a)return $(c,b)}});o("column()",function(a,b){return ab(this.columns(a,b))});o("cells()",function(a,b,c){h.isPlainObject(a)&&(a.row===k?(c=a,a=null):(c=b,b=null));h.isPlainObject(b)&&(c=b,b=null);if(null===b||b===k)return this.iterator("table",function(b){var d=a,e=$a(c),f=
b.aoData,g=Ba(b,e),j=Qb(ia(f,g,"anCells")),i=h([].concat.apply([],j)),l,n=b.aoColumns.length,m,o,u,s,r,v;return Za("cell",d,function(a){var c=typeof a==="function";if(a===null||a===k||c){m=[];o=0;for(u=g.length;o<u;o++){l=g[o];for(s=0;s<n;s++){r={row:l,column:s};if(c){v=f[l];a(r,B(b,l,s),v.anCells?v.anCells[s]:null)&&m.push(r)}else m.push(r)}}return m}if(h.isPlainObject(a))return[a];c=i.filter(a).map(function(a,b){return{row:b._DT_CellIndex.row,column:b._DT_CellIndex.column}}).toArray();if(c.length||
!a.nodeName)return c;v=h(a).closest("*[data-dt-row]");return v.length?[{row:v.data("dt-row"),column:v.data("dt-column")}]:[]},b,e)});var d=this.columns(b,c),e=this.rows(a,c),f,g,j,i,n,l=this.iterator("table",function(a,b){f=[];g=0;for(j=e[b].length;g<j;g++){i=0;for(n=d[b].length;i<n;i++)f.push({row:e[b][g],column:d[b][i]})}return f},1);h.extend(l.selector,{cols:b,rows:a,opts:c});return l});u("cells().nodes()","cell().node()",function(){return this.iterator("cell",function(a,b,c){return(a=a.aoData[b])&&
a.anCells?a.anCells[c]:k},1)});o("cells().data()",function(){return this.iterator("cell",function(a,b,c){return B(a,b,c)},1)});u("cells().cache()","cell().cache()",function(a){a="search"===a?"_aFilterData":"_aSortData";return this.iterator("cell",function(b,c,d){return b.aoData[c][a][d]},1)});u("cells().render()","cell().render()",function(a){return this.iterator("cell",function(b,c,d){return B(b,c,d,a)},1)});u("cells().indexes()","cell().index()",function(){return this.iterator("cell",function(a,
b,c){return{row:b,column:c,columnVisible:$(a,c)}},1)});u("cells().invalidate()","cell().invalidate()",function(a){return this.iterator("cell",function(b,c,d){ca(b,c,a,d)})});o("cell()",function(a,b,c){return ab(this.cells(a,b,c))});o("cell().data()",function(a){var b=this.context,c=this[0];if(a===k)return b.length&&c.length?B(b[0],c[0].row,c[0].column):k;ib(b[0],c[0].row,c[0].column,a);ca(b[0],c[0].row,"data",c[0].column);return this});o("order()",function(a,b){var c=this.context;if(a===k)return 0!==
c.length?c[0].aaSorting:k;"number"===typeof a?a=[[a,b]]:a.length&&!h.isArray(a[0])&&(a=Array.prototype.slice.call(arguments));return this.iterator("table",function(b){b.aaSorting=a.slice()})});o("order.listener()",function(a,b,c){return this.iterator("table",function(d){La(d,a,b,c)})});o("order.fixed()",function(a){if(!a){var b=this.context,b=b.length?b[0].aaSortingFixed:k;return h.isArray(b)?{pre:b}:b}return this.iterator("table",function(b){b.aaSortingFixed=h.extend(!0,{},a)})});o(["columns().order()",
"column().order()"],function(a){var b=this;return this.iterator("table",function(c,d){var e=[];h.each(b[d],function(b,c){e.push([c,a])});c.aaSorting=e})});o("search()",function(a,b,c,d){var e=this.context;return a===k?0!==e.length?e[0].oPreviousSearch.sSearch:k:this.iterator("table",function(e){e.oFeatures.bFilter&&fa(e,h.extend({},e.oPreviousSearch,{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),1)})});u("columns().search()","column().search()",function(a,
b,c,d){return this.iterator("column",function(e,f){var g=e.aoPreSearchCols;if(a===k)return g[f].sSearch;e.oFeatures.bFilter&&(h.extend(g[f],{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),fa(e,e.oPreviousSearch,1))})});o("state()",function(){return this.context.length?this.context[0].oSavedState:null});o("state.clear()",function(){return this.iterator("table",function(a){a.fnStateSaveCallback.call(a.oInstance,a,{})})});o("state.loaded()",function(){return this.context.length?
this.context[0].oLoadedState:null});o("state.save()",function(){return this.iterator("table",function(a){xa(a)})});m.versionCheck=m.fnVersionCheck=function(a){for(var b=m.version.split("."),a=a.split("."),c,d,e=0,f=a.length;e<f;e++)if(c=parseInt(b[e],10)||0,d=parseInt(a[e],10)||0,c!==d)return c>d;return!0};m.isDataTable=m.fnIsDataTable=function(a){var b=h(a).get(0),c=!1;if(a instanceof m.Api)return!0;h.each(m.settings,function(a,e){var f=e.nScrollHead?h("table",e.nScrollHead)[0]:null,g=e.nScrollFoot?
h("table",e.nScrollFoot)[0]:null;if(e.nTable===b||f===b||g===b)c=!0});return c};m.tables=m.fnTables=function(a){var b=!1;h.isPlainObject(a)&&(b=a.api,a=a.visible);var c=h.map(m.settings,function(b){if(!a||a&&h(b.nTable).is(":visible"))return b.nTable});return b?new s(c):c};m.camelToHungarian=I;o("$()",function(a,b){var c=this.rows(b).nodes(),c=h(c);return h([].concat(c.filter(a).toArray(),c.find(a).toArray()))});h.each(["on","one","off"],function(a,b){o(b+"()",function(){var a=Array.prototype.slice.call(arguments);
a[0]=h.map(a[0].split(/\s/),function(a){return!a.match(/\.dt\b/)?a+".dt":a}).join(" ");var d=h(this.tables().nodes());d[b].apply(d,a);return this})});o("clear()",function(){return this.iterator("table",function(a){na(a)})});o("settings()",function(){return new s(this.context,this.context)});o("init()",function(){var a=this.context;return a.length?a[0].oInit:null});o("data()",function(){return this.iterator("table",function(a){return D(a.aoData,"_aData")}).flatten()});o("destroy()",function(a){a=a||
!1;return this.iterator("table",function(b){var c=b.nTableWrapper.parentNode,d=b.oClasses,e=b.nTable,f=b.nTBody,g=b.nTHead,j=b.nTFoot,i=h(e),f=h(f),k=h(b.nTableWrapper),l=h.map(b.aoData,function(a){return a.nTr}),o;b.bDestroying=!0;r(b,"aoDestroyCallback","destroy",[b]);a||(new s(b)).columns().visible(!0);k.off(".DT").find(":not(tbody *)").off(".DT");h(E).off(".DT-"+b.sInstance);e!=g.parentNode&&(i.children("thead").detach(),i.append(g));j&&e!=j.parentNode&&(i.children("tfoot").detach(),i.append(j));
b.aaSorting=[];b.aaSortingFixed=[];wa(b);h(l).removeClass(b.asStripeClasses.join(" "));h("th, td",g).removeClass(d.sSortable+" "+d.sSortableAsc+" "+d.sSortableDesc+" "+d.sSortableNone);f.children().detach();f.append(l);g=a?"remove":"detach";i[g]();k[g]();!a&&c&&(c.insertBefore(e,b.nTableReinsertBefore),i.css("width",b.sDestroyWidth).removeClass(d.sTable),(o=b.asDestroyStripes.length)&&f.children().each(function(a){h(this).addClass(b.asDestroyStripes[a%o])}));c=h.inArray(b,m.settings);-1!==c&&m.settings.splice(c,
1)})});h.each(["column","row","cell"],function(a,b){o(b+"s().every()",function(a){var d=this.selector.opts,e=this;return this.iterator(b,function(f,g,h,i,n){a.call(e[b](g,"cell"===b?h:d,"cell"===b?d:k),g,h,i,n)})})});o("i18n()",function(a,b,c){var d=this.context[0],a=Q(a)(d.oLanguage);a===k&&(a=b);c!==k&&h.isPlainObject(a)&&(a=a[c]!==k?a[c]:a._);return a.replace("%d",c)});m.version="1.10.16";m.settings=[];m.models={};m.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0};m.models.oRow=
{nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,_sRowStripe:"",src:null,idx:-1};m.models.oColumn={idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,
sWidthOrig:null};m.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,bSort:!0,bSortMulti:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:null,fnServerParams:null,fnStateLoadCallback:function(a){try{return JSON.parse((-1===a.iStateDuration?sessionStorage:localStorage).getItem("DataTables_"+a.sInstance+"_"+location.pathname))}catch(b){}},fnStateLoadParams:null,fnStateLoaded:null,fnStateSaveCallback:function(a,b){try{(-1===a.iStateDuration?sessionStorage:localStorage).setItem("DataTables_"+a.sInstance+
"_"+location.pathname,JSON.stringify(b))}catch(c){}},fnStateSaveParams:null,iStateDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",
sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sDecimal:"",sThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sSearchPlaceholder:"",sUrl:"",sZeroRecords:"No matching records found"},oSearch:h.extend({},m.models.oSearch),sAjaxDataProp:"data",sAjaxSource:null,sDom:"lfrtip",searchDelay:null,sPaginationType:"simple_numbers",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET",renderer:null,rowId:"DT_RowId"};
X(m.defaults);m.defaults.column={aDataSort:null,iDataSort:-1,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bVisible:!0,fnCreatedCell:null,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};X(m.defaults.column);m.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortMulti:null,
bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1,bScrollbarLeft:!1,bBounding:!1,barWidth:0},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aIds:{},aoColumns:[],aoHeader:[],aoFooter:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],
aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,searchDelay:null,sPaginationType:"two_button",iStateDuration:0,aoStateSave:[],aoStateLoad:[],oSavedState:null,oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,json:k,oAjaxData:k,fnServerData:null,
aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iRecordsTotal:0,_iRecordsDisplay:0,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return"ssp"==y(this)?1*this._iRecordsTotal:this.aiDisplayMaster.length},fnRecordsDisplay:function(){return"ssp"==y(this)?1*this._iRecordsDisplay:this.aiDisplay.length},fnDisplayEnd:function(){var a=this._iDisplayLength,
b=this._iDisplayStart,c=b+a,d=this.aiDisplay.length,e=this.oFeatures,f=e.bPaginate;return e.bServerSide?!1===f||-1===a?b+d:Math.min(b+a,this._iRecordsDisplay):!f||c>d||-1===a?d:c},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null,aLastSort:[],oPlugins:{},rowIdFn:null,rowId:null};m.ext=x={buttons:{},classes:{},builder:"-source-",errMode:"alert",feature:[],search:[],selector:{cell:[],column:[],row:[]},internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},
order:{},type:{detect:[],search:{},order:{}},_unique:0,fnVersionCheck:m.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:m.version};h.extend(x,{afnFiltering:x.search,aTypes:x.type.detect,ofnSearch:x.type.search,oSort:x.type.order,afnSortData:x.order,aoFeatures:x.feature,oApi:x.internal,oStdClasses:x.classes,oPagination:x.pager});h.extend(m.ext.classes,{sTable:"dataTable",sNoFooter:"no-footer",sPageButton:"paginate_button",sPageButtonActive:"current",sPageButtonDisabled:"disabled",sStripeOdd:"odd",
sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sFilterInput:"",sLengthSelect:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",
sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sHeaderTH:"",sFooterTH:"",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sJUIHeader:"",sJUIFooter:""});var Kb=m.ext.pager;h.extend(Kb,{simple:function(){return["previous","next"]},full:function(){return["first","previous","next","last"]},numbers:function(a,b){return[ha(a,
b)]},simple_numbers:function(a,b){return["previous",ha(a,b),"next"]},full_numbers:function(a,b){return["first","previous",ha(a,b),"next","last"]},first_last_numbers:function(a,b){return["first",ha(a,b),"last"]},_numbers:ha,numbers_length:7});h.extend(!0,m.ext.renderer,{pageButton:{_:function(a,b,c,d,e,f){var g=a.oClasses,j=a.oLanguage.oPaginate,i=a.oLanguage.oAria.paginate||{},n,l,m=0,o=function(b,d){var k,s,u,r,v=function(b){Sa(a,b.data.action,true)};k=0;for(s=d.length;k<s;k++){r=d[k];if(h.isArray(r)){u=
h("<"+(r.DT_el||"div")+"/>").appendTo(b);o(u,r)}else{n=null;l="";switch(r){case "ellipsis":b.append('<span class="ellipsis">&#x2026;</span>');break;case "first":n=j.sFirst;l=r+(e>0?"":" "+g.sPageButtonDisabled);break;case "previous":n=j.sPrevious;l=r+(e>0?"":" "+g.sPageButtonDisabled);break;case "next":n=j.sNext;l=r+(e<f-1?"":" "+g.sPageButtonDisabled);break;case "last":n=j.sLast;l=r+(e<f-1?"":" "+g.sPageButtonDisabled);break;default:n=r+1;l=e===r?g.sPageButtonActive:""}if(n!==null){u=h("<a>",{"class":g.sPageButton+
" "+l,"aria-controls":a.sTableId,"aria-label":i[r],"data-dt-idx":m,tabindex:a.iTabIndex,id:c===0&&typeof r==="string"?a.sTableId+"_"+r:null}).html(n).appendTo(b);Va(u,{action:r},v);m++}}}},s;try{s=h(b).find(G.activeElement).data("dt-idx")}catch(u){}o(h(b).empty(),d);s!==k&&h(b).find("[data-dt-idx="+s+"]").focus()}}});h.extend(m.ext.type.detect,[function(a,b){var c=b.oLanguage.sDecimal;return Ya(a,c)?"num"+c:null},function(a){if(a&&!(a instanceof Date)&&!Zb.test(a))return null;var b=Date.parse(a);
return null!==b&&!isNaN(b)||L(a)?"date":null},function(a,b){var c=b.oLanguage.sDecimal;return Ya(a,c,!0)?"num-fmt"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Pb(a,c)?"html-num"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Pb(a,c,!0)?"html-num-fmt"+c:null},function(a){return L(a)||"string"===typeof a&&-1!==a.indexOf("<")?"html":null}]);h.extend(m.ext.type.search,{html:function(a){return L(a)?a:"string"===typeof a?a.replace(Mb," ").replace(Aa,""):""},string:function(a){return L(a)?
a:"string"===typeof a?a.replace(Mb," "):a}});var za=function(a,b,c,d){if(0!==a&&(!a||"-"===a))return-Infinity;b&&(a=Ob(a,b));a.replace&&(c&&(a=a.replace(c,"")),d&&(a=a.replace(d,"")));return 1*a};h.extend(x.type.order,{"date-pre":function(a){return Date.parse(a)||-Infinity},"html-pre":function(a){return L(a)?"":a.replace?a.replace(/<.*?>/g,"").toLowerCase():a+""},"string-pre":function(a){return L(a)?"":"string"===typeof a?a.toLowerCase():!a.toString?"":a.toString()},"string-asc":function(a,b){return a<
b?-1:a>b?1:0},"string-desc":function(a,b){return a<b?1:a>b?-1:0}});cb("");h.extend(!0,m.ext.renderer,{header:{_:function(a,b,c,d){h(a.nTable).on("order.dt.DT",function(e,f,g,h){if(a===f){e=c.idx;b.removeClass(c.sSortingClass+" "+d.sSortAsc+" "+d.sSortDesc).addClass(h[e]=="asc"?d.sSortAsc:h[e]=="desc"?d.sSortDesc:c.sSortingClass)}})},jqueryui:function(a,b,c,d){h("<div/>").addClass(d.sSortJUIWrapper).append(b.contents()).append(h("<span/>").addClass(d.sSortIcon+" "+c.sSortingClassJUI)).appendTo(b);
h(a.nTable).on("order.dt.DT",function(e,f,g,h){if(a===f){e=c.idx;b.removeClass(d.sSortAsc+" "+d.sSortDesc).addClass(h[e]=="asc"?d.sSortAsc:h[e]=="desc"?d.sSortDesc:c.sSortingClass);b.find("span."+d.sSortIcon).removeClass(d.sSortJUIAsc+" "+d.sSortJUIDesc+" "+d.sSortJUI+" "+d.sSortJUIAscAllowed+" "+d.sSortJUIDescAllowed).addClass(h[e]=="asc"?d.sSortJUIAsc:h[e]=="desc"?d.sSortJUIDesc:c.sSortingClassJUI)}})}}});var Vb=function(a){return"string"===typeof a?a.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,
"&quot;"):a};m.render={number:function(a,b,c,d,e){return{display:function(f){if("number"!==typeof f&&"string"!==typeof f)return f;var g=0>f?"-":"",h=parseFloat(f);if(isNaN(h))return Vb(f);h=h.toFixed(c);f=Math.abs(h);h=parseInt(f,10);f=c?b+(f-h).toFixed(c).substring(2):"";return g+(d||"")+h.toString().replace(/\B(?=(\d{3})+(?!\d))/g,a)+f+(e||"")}}},text:function(){return{display:Vb}}};h.extend(m.ext.internal,{_fnExternApiFunc:Lb,_fnBuildAjax:sa,_fnAjaxUpdate:kb,_fnAjaxParameters:tb,_fnAjaxUpdateDraw:ub,
_fnAjaxDataSrc:ta,_fnAddColumn:Da,_fnColumnOptions:ja,_fnAdjustColumnSizing:Y,_fnVisibleToColumnIndex:Z,_fnColumnIndexToVisible:$,_fnVisbleColumns:aa,_fnGetColumns:la,_fnColumnTypes:Fa,_fnApplyColumnDefs:hb,_fnHungarianMap:X,_fnCamelToHungarian:I,_fnLanguageCompat:Ca,_fnBrowserDetect:fb,_fnAddData:M,_fnAddTr:ma,_fnNodeToDataIndex:function(a,b){return b._DT_RowIndex!==k?b._DT_RowIndex:null},_fnNodeToColumnIndex:function(a,b,c){return h.inArray(c,a.aoData[b].anCells)},_fnGetCellData:B,_fnSetCellData:ib,
_fnSplitObjNotation:Ia,_fnGetObjectDataFn:Q,_fnSetObjectDataFn:R,_fnGetDataMaster:Ja,_fnClearTable:na,_fnDeleteIndex:oa,_fnInvalidate:ca,_fnGetRowElements:Ha,_fnCreateTr:Ga,_fnBuildHead:jb,_fnDrawHead:ea,_fnDraw:N,_fnReDraw:S,_fnAddOptionsHtml:mb,_fnDetectHeader:da,_fnGetUniqueThs:ra,_fnFeatureHtmlFilter:ob,_fnFilterComplete:fa,_fnFilterCustom:xb,_fnFilterColumn:wb,_fnFilter:vb,_fnFilterCreateSearch:Oa,_fnEscapeRegex:Pa,_fnFilterData:yb,_fnFeatureHtmlInfo:rb,_fnUpdateInfo:Bb,_fnInfoMacros:Cb,_fnInitialise:ga,
_fnInitComplete:ua,_fnLengthChange:Qa,_fnFeatureHtmlLength:nb,_fnFeatureHtmlPaginate:sb,_fnPageChange:Sa,_fnFeatureHtmlProcessing:pb,_fnProcessingDisplay:C,_fnFeatureHtmlTable:qb,_fnScrollDraw:ka,_fnApplyToChildren:H,_fnCalculateColumnWidths:Ea,_fnThrottle:Na,_fnConvertToWidth:Db,_fnGetWidestNode:Eb,_fnGetMaxLenString:Fb,_fnStringToCss:v,_fnSortFlatten:V,_fnSort:lb,_fnSortAria:Hb,_fnSortListener:Ua,_fnSortAttachListener:La,_fnSortingClasses:wa,_fnSortData:Gb,_fnSaveState:xa,_fnLoadState:Ib,_fnSettingsFromNode:ya,
_fnLog:J,_fnMap:F,_fnBindAction:Va,_fnCallbackReg:z,_fnCallbackFire:r,_fnLengthOverflow:Ra,_fnRenderer:Ma,_fnDataSource:y,_fnRowAttributes:Ka,_fnCalculateEnd:function(){}});h.fn.dataTable=m;m.$=h;h.fn.dataTableSettings=m.settings;h.fn.dataTableExt=m.ext;h.fn.DataTable=function(a){return h(this).dataTable(a).api()};h.each(m,function(a,b){h.fn.DataTable[a]=b});return h.fn.dataTable});
!function(e){function t(e){return Math.ceil(e._iDisplayStart/e._iDisplayLength)+1}function a(e){return Math.ceil(e.fnRecordsDisplay()/e._iDisplayLength)}var n="first",s="previous prev btn btn-sm default",i="next next btn btn-sm default",l="last",u="paginate_of",r="Page";e.fn.dataTableExt.oPagination.input={fnInit:function(c,p,d){var o=document.createElement("span"),h=document.createElement("span"),g=document.createElement("span"),m=document.createElement("span"),f=document.createElement("input"),b=document.createElement("span"),v=document.createElement("span"),_=c.oLanguage.oPaginate,D=c.oClasses;o.innerHTML=_.sFirst,h.innerHTML=_.sPrevious,g.innerHTML=_.sNext,m.innerHTML=_.sLast,r=_.Page,o.className=n+" "+D.sPageButton,h.className=s+" "+D.sPageButton,g.className=i+" "+D.sPageButton,m.className=l+" "+D.sPageButton,v.className=u,b.className="paginate_page",f.className="paginate_input form-control input-mini input-inline input-sm",""!==c.sTableId&&(p.setAttribute("id",c.sTableId+"_paginate"),o.setAttribute("id",c.sTableId+"_"+n),h.setAttribute("id",c.sTableId+"_"+s),g.setAttribute("id",c.sTableId+"_"+i),m.setAttribute("id",c.sTableId+"_"+l)),f.type="text",b.innerHTML=r+" ",p.appendChild(b),p.appendChild(h),p.appendChild(f),p.appendChild(g),p.appendChild(v),e(h).click(function(){1!==t(c)&&(c.oApi._fnPageChange(c,"previous"),d(c))}),e(g).click(function(){t(c)!==a(c)&&(c.oApi._fnPageChange(c,"next"),d(c))}),e(f).keyup(function(e){if(38===e.which||39===e.which?this.value++:(37===e.which||40===e.which)&&this.value>1&&this.value--,""===this.value||this.value.match(/[^0-9]/))this.value=this.value.replace(/[^\d]/g,"");else{var t=c._iDisplayLength*(this.value-1);t<0&&(t=0),t>=c.fnRecordsDisplay()&&(t=(Math.ceil(c.fnRecordsDisplay()/c._iDisplayLength)-1)*c._iDisplayLength),c._iDisplayStart=t,d(c)}}),e("span",p).bind("mousedown",function(){return!1}),e("span",p).bind("selectstart",function(){return!1}),a(c)<=1&&e(p).hide()},fnUpdate:function(n){if(n.aanFeatures.p){var l=a(n),r=t(n),c=n.aanFeatures.p;if(l<=1)e(c).hide();else{var p,d,o,h,g,m,f,b,v,_=(d=(p=n)._iDisplayStart,o=p._iDisplayLength,h=p.fnRecordsDisplay(),m=(g=-1===o)?0:Math.ceil(d/o),f=g?1:Math.ceil(h/o),b=m>0?"":p.oClasses.sPageButtonDisabled,v=m<f-1?"":p.oClasses.sPageButtonDisabled,{first:b,previous:b,next:v,last:v});e(c).show(),e(c).children("."+s).removeClass(n.oClasses.sPageButtonDisabled).addClass(_[s]),e(c).children("."+i).removeClass(n.oClasses.sPageButtonDisabled).addClass(_[i]),e(c).children("."+u).html("  "+l+" |"),e(c).children(".paginate_input").val(r)}}}}}(jQuery);

/**
 * @summary     DataTables
 * @description Paginate, search and sort HTML tables
 * @version     1.9.4
 * @file        jquery.dataTables.js
 * @author      Allan Jardine (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 *
 * @copyright Copyright 2008-2012 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 * 
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $, jQuery,define,_fnExternApiFunc,_fnInitialise,_fnInitComplete,_fnLanguageCompat,_fnAddColumn,_fnColumnOptions,_fnAddData,_fnCreateTr,_fnGatherData,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnServerParams,_fnAddOptionsHtml,_fnFeatureHtmlTable,_fnScrollDraw,_fnAdjustColumnSizing,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnBuildSearchArray,_fnBuildSearchRow,_fnFilterCreateSearch,_fnDataToSearch,_fnSort,_fnSortAttachListener,_fnSortingClasses,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnFeatureHtmlLength,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnNodeToDataIndex,_fnVisbleColumns,_fnCalculateEnd,_fnConvertToWidth,_fnCalculateColumnWidths,_fnScrollingWidthAdjust,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnDetectType,_fnSettingsFromNode,_fnGetDataMaster,_fnGetTrNodes,_fnGetTdNodes,_fnEscapeRegex,_fnDeleteIndex,_fnReOrderIndex,_fnColumnOrdering,_fnLog,_fnClearTable,_fnSaveState,_fnLoadState,_fnCreateCookie,_fnReadCookie,_fnDetectHeader,_fnGetUniqueThs,_fnScrollBarWidth,_fnApplyToChildren,_fnMap,_fnGetRowData,_fnGetCellData,_fnSetCellData,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnApplyColumnDefs,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnJsonString,_fnRender,_fnNodeToColumnIndex,_fnInfoMacros,_fnBrowserDetect,_fnGetColumns*/

!function(window,document,undefined){!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):jQuery&&!jQuery.fn.dataTable&&e(jQuery)}(function($){"use strict";var DataTable=function(oInit){function _fnAddColumn(e,a){var n=DataTable.defaults.columns,t=e.aoColumns.length,o=$.extend({},DataTable.models.oColumn,n,{sSortingClass:e.oClasses.sSortable,sSortingClassJUI:e.oClasses.sSortJUI,nTh:a||document.createElement("th"),sTitle:n.sTitle?n.sTitle:a?a.innerHTML:"",aDataSort:n.aDataSort?n.aDataSort:[t],mData:n.mData?n.oDefaults:t});if(e.aoColumns.push(o),e.aoPreSearchCols[t]===undefined||null===e.aoPreSearchCols[t])e.aoPreSearchCols[t]=$.extend({},DataTable.models.oSearch);else{var l=e.aoPreSearchCols[t];l.bRegex===undefined&&(l.bRegex=!0),l.bSmart===undefined&&(l.bSmart=!0),l.bCaseInsensitive===undefined&&(l.bCaseInsensitive=!0)}_fnColumnOptions(e,t,null)}function _fnColumnOptions(e,a,n){var t=e.aoColumns[a];n!==undefined&&null!==n&&(n.mDataProp&&!n.mData&&(n.mData=n.mDataProp),n.sType!==undefined&&(t.sType=n.sType,t._bAutoType=!1),$.extend(t,n),_fnMap(t,n,"sWidth","sWidthOrig"),n.iDataSort!==undefined&&(t.aDataSort=[n.iDataSort]),_fnMap(t,n,"aDataSort"));var o=t.mRender?_fnGetObjectDataFn(t.mRender):null,l=_fnGetObjectDataFn(t.mData);t.fnGetData=function(e,a){var n=l(e,a);return t.mRender&&a&&""!==a?o(n,a,e):n},t.fnSetData=_fnSetObjectDataFn(t.mData),e.oFeatures.bSort||(t.bSortable=!1),!t.bSortable||-1==$.inArray("asc",t.asSorting)&&-1==$.inArray("desc",t.asSorting)?(t.sSortingClass=e.oClasses.sSortableNone,t.sSortingClassJUI=""):-1==$.inArray("asc",t.asSorting)&&-1==$.inArray("desc",t.asSorting)?(t.sSortingClass=e.oClasses.sSortable,t.sSortingClassJUI=e.oClasses.sSortJUI):-1!=$.inArray("asc",t.asSorting)&&-1==$.inArray("desc",t.asSorting)?(t.sSortingClass=e.oClasses.sSortableAsc,t.sSortingClassJUI=e.oClasses.sSortJUIAscAllowed):-1==$.inArray("asc",t.asSorting)&&-1!=$.inArray("desc",t.asSorting)&&(t.sSortingClass=e.oClasses.sSortableDesc,t.sSortingClassJUI=e.oClasses.sSortJUIDescAllowed)}function _fnAdjustColumnSizing(e){if(!1===e.oFeatures.bAutoWidth)return!1;_fnCalculateColumnWidths(e);for(var a=0,n=e.aoColumns.length;a<n;a++)e.aoColumns[a].nTh.style.width=e.aoColumns[a].sWidth}function _fnVisibleToColumnIndex(e,a){var n=_fnGetColumns(e,"bVisible");return"number"==typeof n[a]?n[a]:null}function _fnColumnIndexToVisible(e,a){var n=_fnGetColumns(e,"bVisible"),t=$.inArray(a,n);return-1!==t?t:null}function _fnVisbleColumns(e){return _fnGetColumns(e,"bVisible").length}function _fnGetColumns(e,a){var n=[];return $.map(e.aoColumns,function(e,t){e[a]&&n.push(t)}),n}function _fnDetectType(e){for(var a=DataTable.ext.aTypes,n=a.length,t=0;t<n;t++){var o=a[t](e);if(null!==o)return o}return"string"}function _fnReOrderIndex(e,a){for(var n=a.split(","),t=[],o=0,l=e.aoColumns.length;o<l;o++)for(var r=0;r<l;r++)if(e.aoColumns[o].sName==n[r]){t.push(r);break}return t}function _fnColumnOrdering(e){for(var a="",n=0,t=e.aoColumns.length;n<t;n++)a+=e.aoColumns[n].sName+",";return a.length==t?"":a.slice(0,-1)}function _fnApplyColumnDefs(e,a,n,t){var o,l,r,i,s,f;if(a)for(o=a.length-1;o>=0;o--){var d=a[o].aTargets;for($.isArray(d)||_fnLog(e,1,"aTargets must be an array of targets, not a "+typeof d),r=0,i=d.length;r<i;r++)if("number"==typeof d[r]&&d[r]>=0){for(;e.aoColumns.length<=d[r];)_fnAddColumn(e);t(d[r],a[o])}else if("number"==typeof d[r]&&d[r]<0)t(e.aoColumns.length+d[r],a[o]);else if("string"==typeof d[r])for(s=0,f=e.aoColumns.length;s<f;s++)("_all"==d[r]||$(e.aoColumns[s].nTh).hasClass(d[r]))&&t(s,a[o])}if(n)for(o=0,l=n.length;o<l;o++)t(o,n[o])}function _fnAddData(e,a){var n,t,o=$.isArray(a)?a.slice():$.extend(!0,{},a),l=e.aoData.length,r=$.extend(!0,{},DataTable.models.oRow);r._aData=o,e.aoData.push(r);for(var i=0,s=e.aoColumns.length;i<s;i++)if("function"==typeof(n=e.aoColumns[i]).fnRender&&n.bUseRendered&&null!==n.mData?_fnSetCellData(e,l,i,_fnRender(e,l,i)):_fnSetCellData(e,l,i,_fnGetCellData(e,l,i)),n._bAutoType&&"string"!=n.sType){var f=_fnGetCellData(e,l,i,"type");null!==f&&""!==f&&(t=_fnDetectType(f),null===n.sType?n.sType=t:n.sType!=t&&"html"!=n.sType&&(n.sType="string"))}return e.aiDisplayMaster.push(l),e.oFeatures.bDeferRender||_fnCreateTr(e,l),l}function _fnGatherData(e){var a,n,t,o,l,r,i,s,f,d,u,c,p,h,g;if(e.bDeferLoading||null===e.sAjaxSource)for(i=e.nTBody.firstChild;i;){if("TR"==i.nodeName.toUpperCase())for(s=e.aoData.length,i._DT_RowIndex=s,e.aoData.push($.extend(!0,{},DataTable.models.oRow,{nTr:i})),e.aiDisplayMaster.push(s),r=i.firstChild,t=0;r;)"TD"!=(p=r.nodeName.toUpperCase())&&"TH"!=p||(_fnSetCellData(e,s,t,$.trim(r.innerHTML)),t++),r=r.nextSibling;i=i.nextSibling}for(o=[],a=0,n=(l=_fnGetTrNodes(e)).length;a<n;a++)for(r=l[a].firstChild;r;)"TD"!=(p=r.nodeName.toUpperCase())&&"TH"!=p||o.push(r),r=r.nextSibling;for(u=0,c=e.aoColumns.length;u<c;u++){null===(h=e.aoColumns[u]).sTitle&&(h.sTitle=h.nTh.innerHTML);var _,b,S,C,D=h._bAutoType,m="function"==typeof h.fnRender,T=null!==h.sClass,y=h.bVisible;if(D||m||T||!y)for(f=0,d=e.aoData.length;f<d;f++)g=e.aoData[f],_=o[f*c+u],D&&"string"!=h.sType&&""!==(C=_fnGetCellData(e,f,u,"type"))&&(b=_fnDetectType(C),null===h.sType?h.sType=b:h.sType!=b&&"html"!=h.sType&&(h.sType="string")),h.mRender?_.innerHTML=_fnGetCellData(e,f,u,"display"):h.mData!==u&&(_.innerHTML=_fnGetCellData(e,f,u,"display")),m&&(S=_fnRender(e,f,u),_.innerHTML=S,h.bUseRendered&&_fnSetCellData(e,f,u,S)),T&&(_.className+=" "+h.sClass),y?g._anHidden[u]=null:(g._anHidden[u]=_,_.parentNode.removeChild(_)),h.fnCreatedCell&&h.fnCreatedCell.call(e.oInstance,_,_fnGetCellData(e,f,u,"display"),g._aData,f,u)}if(0!==e.aoRowCreatedCallback.length)for(a=0,n=e.aoData.length;a<n;a++)_fnCallbackFire(e,"aoRowCreatedCallback",null,[(g=e.aoData[a]).nTr,g._aData,a])}function _fnNodeToDataIndex(e,a){return a._DT_RowIndex!==undefined?a._DT_RowIndex:null}function _fnNodeToColumnIndex(e,a,n){for(var t=_fnGetTdNodes(e,a),o=0,l=e.aoColumns.length;o<l;o++)if(t[o]===n)return o;return-1}function _fnGetRowData(e,a,n,t){for(var o=[],l=0,r=t.length;l<r;l++)o.push(_fnGetCellData(e,a,t[l],n));return o}function _fnGetCellData(e,a,n,t){var o,l=e.aoColumns[n],r=e.aoData[a]._aData;if((o=l.fnGetData(r,t))===undefined)return e.iDrawError!=e.iDraw&&null===l.sDefaultContent&&(_fnLog(e,0,"Requested unknown parameter "+("function"==typeof l.mData?"{mData function}":"'"+l.mData+"'")+" from the data source for row "+a),e.iDrawError=e.iDraw),l.sDefaultContent;if(null===o&&null!==l.sDefaultContent)o=l.sDefaultContent;else if("function"==typeof o)return o();return"display"==t&&null===o?"":o}function _fnSetCellData(e,a,n,t){var o=e.aoColumns[n],l=e.aoData[a]._aData;o.fnSetData(l,t)}var __reArray=/\[.*?\]$/;function _fnGetObjectDataFn(e){if(null===e)return function(e,a){return null};if("function"==typeof e)return function(a,n,t){return e(a,n,t)};if("string"!=typeof e||-1===e.indexOf(".")&&-1===e.indexOf("["))return function(a,n){return a[e]};var a=function(e,n,t){var o,l,r,i=t.split(".");if(""!==t)for(var s=0,f=i.length;s<f;s++){if(o=i[s].match(__reArray)){i[s]=i[s].replace(__reArray,""),""!==i[s]&&(e=e[i[s]]),l=[],i.splice(0,s+1),r=i.join(".");for(var d=0,u=e.length;d<u;d++)l.push(a(e[d],n,r));var c=o[0].substring(1,o[0].length-1);e=""===c?l:l.join(c);break}if(null===e||e[i[s]]===undefined)return undefined;e=e[i[s]]}return e};return function(n,t){return a(n,t,e)}}function _fnSetObjectDataFn(e){if(null===e)return function(e,a){};if("function"==typeof e)return function(a,n){e(a,"set",n)};if("string"!=typeof e||-1===e.indexOf(".")&&-1===e.indexOf("["))return function(a,n){a[e]=n};var a=function(e,n,t){for(var o,l,r,i=t.split("."),s=0,f=i.length-1;s<f;s++){if(i[s].match(__reArray)){i[s]=i[s].replace(__reArray,""),e[i[s]]=[],(o=i.slice()).splice(0,s+1),r=o.join(".");for(var d=0,u=n.length;d<u;d++)a(l={},n[d],r),e[i[s]].push(l);return}null!==e[i[s]]&&e[i[s]]!==undefined||(e[i[s]]={}),e=e[i[s]]}e[i[i.length-1].replace(__reArray,"")]=n};return function(n,t){return a(n,t,e)}}function _fnGetDataMaster(e){for(var a=[],n=e.aoData.length,t=0;t<n;t++)a.push(e.aoData[t]._aData);return a}function _fnClearTable(e){e.aoData.splice(0,e.aoData.length),e.aiDisplayMaster.splice(0,e.aiDisplayMaster.length),e.aiDisplay.splice(0,e.aiDisplay.length),_fnCalculateEnd(e)}function _fnDeleteIndex(e,a){for(var n=-1,t=0,o=e.length;t<o;t++)e[t]==a?n=t:e[t]>a&&e[t]--;-1!=n&&e.splice(n,1)}function _fnRender(e,a,n){var t=e.aoColumns[n];return t.fnRender({iDataRow:a,iDataColumn:n,oSettings:e,aData:e.aoData[a]._aData,mDataProp:t.mData},_fnGetCellData(e,a,n,"display"))}function _fnCreateTr(e,a){var n,t=e.aoData[a];if(null===t.nTr){t.nTr=document.createElement("tr"),t.nTr._DT_RowIndex=a,t._aData.DT_RowId&&(t.nTr.id=t._aData.DT_RowId),t._aData.DT_RowClass&&(t.nTr.className=t._aData.DT_RowClass);for(var o=0,l=e.aoColumns.length;o<l;o++){var r=e.aoColumns[o];(n=document.createElement(r.sCellType)).innerHTML="function"!=typeof r.fnRender||r.bUseRendered&&null!==r.mData?_fnGetCellData(e,a,o,"display"):_fnRender(e,a,o),null!==r.sClass&&(n.className=r.sClass),r.bVisible?(t.nTr.appendChild(n),t._anHidden[o]=null):t._anHidden[o]=n,r.fnCreatedCell&&r.fnCreatedCell.call(e.oInstance,n,_fnGetCellData(e,a,o,"display"),t._aData,a,o)}_fnCallbackFire(e,"aoRowCreatedCallback",null,[t.nTr,t._aData,a])}}function _fnBuildHead(e){var a,n,t;if(0!==$("th, td",e.nTHead).length)for(a=0,t=e.aoColumns.length;a<t;a++)(n=e.aoColumns[a].nTh).setAttribute("role","columnheader"),e.aoColumns[a].bSortable&&(n.setAttribute("tabindex",e.iTabIndex),n.setAttribute("aria-controls",e.sTableId)),null!==e.aoColumns[a].sClass&&$(n).addClass(e.aoColumns[a].sClass),e.aoColumns[a].sTitle!=n.innerHTML&&(n.innerHTML=e.aoColumns[a].sTitle);else{var o=document.createElement("tr");for(a=0,t=e.aoColumns.length;a<t;a++)(n=e.aoColumns[a].nTh).innerHTML=e.aoColumns[a].sTitle,n.setAttribute("tabindex","0"),null!==e.aoColumns[a].sClass&&$(n).addClass(e.aoColumns[a].sClass),o.appendChild(n);$(e.nTHead).html("")[0].appendChild(o),_fnDetectHeader(e.aoHeader,e.nTHead)}if($(e.nTHead).children("tr").attr("role","row"),e.bJUI)for(a=0,t=e.aoColumns.length;a<t;a++){n=e.aoColumns[a].nTh;var l=document.createElement("div");l.className=e.oClasses.sSortJUIWrapper,$(n).contents().appendTo(l);var r=document.createElement("span");r.className=e.oClasses.sSortIcon,l.appendChild(r),n.appendChild(l)}if(e.oFeatures.bSort)for(a=0;a<e.aoColumns.length;a++)!1!==e.aoColumns[a].bSortable?_fnSortAttachListener(e,e.aoColumns[a].nTh,a):$(e.aoColumns[a].nTh).addClass(e.oClasses.sSortableNone);if(""!==e.oClasses.sFooterTH&&$(e.nTFoot).children("tr").children("th").addClass(e.oClasses.sFooterTH),null!==e.nTFoot){var i=_fnGetUniqueThs(e,null,e.aoFooter);for(a=0,t=e.aoColumns.length;a<t;a++)i[a]&&(e.aoColumns[a].nTf=i[a],e.aoColumns[a].sClass&&$(i[a]).addClass(e.aoColumns[a].sClass))}}function _fnDrawHead(e,a,n){var t,o,l,r,i,s,f,d,u,c=[],p=[],h=e.aoColumns.length;for(n===undefined&&(n=!1),t=0,o=a.length;t<o;t++){for(c[t]=a[t].slice(),c[t].nTr=a[t].nTr,l=h-1;l>=0;l--)e.aoColumns[l].bVisible||n||c[t].splice(l,1);p.push([])}for(t=0,o=c.length;t<o;t++){if(f=c[t].nTr)for(;s=f.firstChild;)f.removeChild(s);for(l=0,r=c[t].length;l<r;l++)if(d=1,u=1,p[t][l]===undefined){for(f.appendChild(c[t][l].cell),p[t][l]=1;c[t+d]!==undefined&&c[t][l].cell==c[t+d][l].cell;)p[t+d][l]=1,d++;for(;c[t][l+u]!==undefined&&c[t][l].cell==c[t][l+u].cell;){for(i=0;i<d;i++)p[t+i][l+u]=1;u++}c[t][l].cell.rowSpan=d,c[t][l].cell.colSpan=u}}}function _fnDraw(e){var a=_fnCallbackFire(e,"aoPreDrawCallback","preDraw",[e]);if(-1===$.inArray(!1,a)){var n,t,o,l=[],r=0,i=e.asStripeClasses.length,s=e.aoOpenRows.length;if(e.bDrawing=!0,e.iInitDisplayStart!==undefined&&-1!=e.iInitDisplayStart&&(e.oFeatures.bServerSide?e._iDisplayStart=e.iInitDisplayStart:e._iDisplayStart=e.iInitDisplayStart>=e.fnRecordsDisplay()?0:e.iInitDisplayStart,e.iInitDisplayStart=-1,_fnCalculateEnd(e)),e.bDeferLoading)e.bDeferLoading=!1,e.iDraw++;else if(e.oFeatures.bServerSide){if(!e.bDestroying&&!_fnAjaxUpdate(e))return}else e.iDraw++;if(0!==e.aiDisplay.length){var f=e._iDisplayStart,d=e._iDisplayEnd;e.oFeatures.bServerSide&&(f=0,d=e.aoData.length);for(var u=f;u<d;u++){var c=e.aoData[e.aiDisplay[u]];null===c.nTr&&_fnCreateTr(e,e.aiDisplay[u]);var p=c.nTr;if(0!==i){var h=e.asStripeClasses[r%i];c._sRowStripe!=h&&($(p).removeClass(c._sRowStripe).addClass(h),c._sRowStripe=h)}if(_fnCallbackFire(e,"aoRowCallback",null,[p,e.aoData[e.aiDisplay[u]]._aData,r,u]),l.push(p),r++,0!==s)for(var g=0;g<s;g++)if(p==e.aoOpenRows[g].nParent){l.push(e.aoOpenRows[g].nTr);break}}}else{l[0]=document.createElement("tr"),e.asStripeClasses[0]&&(l[0].className=e.asStripeClasses[0]);var _=e.oLanguage,b=_.sZeroRecords;1!=e.iDraw||null===e.sAjaxSource||e.oFeatures.bServerSide?_.sEmptyTable&&0===e.fnRecordsTotal()&&(b=_.sEmptyTable):b=_.sLoadingRecords;var S=document.createElement("td");S.setAttribute("valign","top"),S.colSpan=_fnVisbleColumns(e),S.className=e.oClasses.sRowEmpty,S.innerHTML=_fnInfoMacros(e,b),l[r].appendChild(S)}_fnCallbackFire(e,"aoHeaderCallback","header",[$(e.nTHead).children("tr")[0],_fnGetDataMaster(e),e._iDisplayStart,e.fnDisplayEnd(),e.aiDisplay]),_fnCallbackFire(e,"aoFooterCallback","footer",[$(e.nTFoot).children("tr")[0],_fnGetDataMaster(e),e._iDisplayStart,e.fnDisplayEnd(),e.aiDisplay]);var C,D=document.createDocumentFragment(),m=document.createDocumentFragment();if(e.nTBody){if(C=e.nTBody.parentNode,m.appendChild(e.nTBody),!e.oScroll.bInfinite||!e._bInitComplete||e.bSorted||e.bFiltered)for(;o=e.nTBody.firstChild;)e.nTBody.removeChild(o);for(n=0,t=l.length;n<t;n++)D.appendChild(l[n]);e.nTBody.appendChild(D),null!==C&&C.appendChild(e.nTBody)}_fnCallbackFire(e,"aoDrawCallback","draw",[e]),e.bSorted=!1,e.bFiltered=!1,e.bDrawing=!1,e.oFeatures.bServerSide&&(_fnProcessingDisplay(e,!1),e._bInitComplete||_fnInitComplete(e))}else _fnProcessingDisplay(e,!1)}function _fnReDraw(e){e.oFeatures.bSort?_fnSort(e,e.oPreviousSearch):e.oFeatures.bFilter?_fnFilterComplete(e,e.oPreviousSearch):(_fnCalculateEnd(e),_fnDraw(e))}function _fnAddOptionsHtml(e){var a=$("<div></div>")[0];e.nTable.parentNode.insertBefore(a,e.nTable),e.nTableWrapper=$('<div id="'+e.sTableId+'_wrapper" class="'+e.oClasses.sWrapper+'" role="grid"></div>')[0],e.nTableReinsertBefore=e.nTable.nextSibling;for(var n,t,o,l,r,i,s,f=e.nTableWrapper,d=e.sDom.split(""),u=0;u<d.length;u++){if(t=0,"<"==(o=d[u])){if(l=$("<div></div>")[0],"'"==(r=d[u+1])||'"'==r){for(i="",s=2;d[u+s]!=r;)i+=d[u+s],s++;if("H"==i?i=e.oClasses.sJUIHeader:"F"==i&&(i=e.oClasses.sJUIFooter),-1!=i.indexOf(".")){var c=i.split(".");l.id=c[0].substr(1,c[0].length-1),l.className=c[1]}else"#"==i.charAt(0)?l.id=i.substr(1,i.length-1):l.className=i;u+=s}f.appendChild(l),f=l}else if(">"==o)f=f.parentNode;else if("l"==o&&e.oFeatures.bPaginate&&e.oFeatures.bLengthChange)n=_fnFeatureHtmlLength(e),t=1;else if("f"==o&&e.oFeatures.bFilter)n=_fnFeatureHtmlFilter(e),t=1;else if("r"==o&&e.oFeatures.bProcessing)n=_fnFeatureHtmlProcessing(e),t=1;else if("t"==o)n=_fnFeatureHtmlTable(e),t=1;else if("i"==o&&e.oFeatures.bInfo)n=_fnFeatureHtmlInfo(e),t=1;else if("p"==o&&e.oFeatures.bPaginate)n=_fnFeatureHtmlPaginate(e),t=1;else if(0!==DataTable.ext.aoFeatures.length)for(var p=DataTable.ext.aoFeatures,h=0,g=p.length;h<g;h++)if(o==p[h].cFeature){(n=p[h].fnInit(e))&&(t=1);break}1==t&&null!==n&&("object"!=typeof e.aanFeatures[o]&&(e.aanFeatures[o]=[]),e.aanFeatures[o].push(n),f.appendChild(n))}a.parentNode.replaceChild(e.nTableWrapper,a)}function _fnDetectHeader(e,a){var n,t,o,l,r,i,s,f,d,u,c,p=$(a).children("tr"),h=function(e,a,n){for(var t=e[a];t[n];)n++;return n};for(e.splice(0,e.length),o=0,i=p.length;o<i;o++)e.push([]);for(o=0,i=p.length;o<i;o++)for(f=0,t=(n=p[o]).firstChild;t;){if("TD"==t.nodeName.toUpperCase()||"TH"==t.nodeName.toUpperCase())for(d=1*t.getAttribute("colspan"),u=1*t.getAttribute("rowspan"),d=d&&0!==d&&1!==d?d:1,u=u&&0!==u&&1!==u?u:1,s=h(e,o,f),c=1===d,r=0;r<d;r++)for(l=0;l<u;l++)e[o+l][s+r]={cell:t,unique:c},e[o+l].nTr=n;t=t.nextSibling}}function _fnGetUniqueThs(e,a,n){var t=[];n||(n=e.aoHeader,a&&_fnDetectHeader(n=[],a));for(var o=0,l=n.length;o<l;o++)for(var r=0,i=n[o].length;r<i;r++)!n[o][r].unique||t[r]&&e.bSortCellsTop||(t[r]=n[o][r].cell);return t}function _fnAjaxUpdate(e){if(e.bAjaxDataGet){e.iDraw++,_fnProcessingDisplay(e,!0);e.aoColumns.length;var a=_fnAjaxParameters(e);return _fnServerParams(e,a),e.fnServerData.call(e.oInstance,e.sAjaxSource,a,function(a){_fnAjaxUpdateDraw(e,a)},e),!1}return!0}function _fnAjaxParameters(e){var a,n,t,o,l,r=e.aoColumns.length,i=[];for(i.push({name:"sEcho",value:e.iDraw}),i.push({name:"iColumns",value:r}),i.push({name:"sColumns",value:_fnColumnOrdering(e)}),i.push({name:"iDisplayStart",value:e._iDisplayStart}),i.push({name:"iDisplayLength",value:!1!==e.oFeatures.bPaginate?e._iDisplayLength:-1}),o=0;o<r;o++)a=e.aoColumns[o].mData,i.push({name:"mDataProp_"+o,value:"function"==typeof a?"function":a});if(!1!==e.oFeatures.bFilter)for(i.push({name:"sSearch",value:e.oPreviousSearch.sSearch}),i.push({name:"bRegex",value:e.oPreviousSearch.bRegex}),o=0;o<r;o++)i.push({name:"sSearch_"+o,value:e.aoPreSearchCols[o].sSearch}),i.push({name:"bRegex_"+o,value:e.aoPreSearchCols[o].bRegex}),i.push({name:"bSearchable_"+o,value:e.aoColumns[o].bSearchable});if(!1!==e.oFeatures.bSort){var s=0;for(n=null!==e.aaSortingFixed?e.aaSortingFixed.concat(e.aaSorting):e.aaSorting.slice(),o=0;o<n.length;o++)for(t=e.aoColumns[n[o][0]].aDataSort,l=0;l<t.length;l++)i.push({name:"iSortCol_"+s,value:t[l]}),i.push({name:"sSortDir_"+s,value:n[o][1]}),s++;for(i.push({name:"iSortingCols",value:s}),o=0;o<r;o++)i.push({name:"bSortable_"+o,value:e.aoColumns[o].bSortable})}return i}function _fnServerParams(e,a){_fnCallbackFire(e,"aoServerParams","serverParams",[a])}function _fnAjaxUpdateDraw(e,a){if(a.sEcho!==undefined){if(1*a.sEcho<e.iDraw)return;e.iDraw=1*a.sEcho}(!e.oScroll.bInfinite||e.oScroll.bInfinite&&(e.bSorted||e.bFiltered))&&_fnClearTable(e),e._iRecordsTotal=parseInt(a.iTotalRecords,10),e._iRecordsDisplay=parseInt(a.iTotalDisplayRecords,10);var n,t=_fnColumnOrdering(e),o=a.sColumns!==undefined&&""!==t&&a.sColumns!=t;o&&(n=_fnReOrderIndex(e,a.sColumns));for(var l=_fnGetObjectDataFn(e.sAjaxDataProp)(a),r=0,i=l.length;r<i;r++)if(o){for(var s=[],f=0,d=e.aoColumns.length;f<d;f++)s.push(l[r][n[f]]);_fnAddData(e,s)}else _fnAddData(e,l[r]);e.aiDisplay=e.aiDisplayMaster.slice(),e.bAjaxDataGet=!1,_fnDraw(e),e.bAjaxDataGet=!0,_fnProcessingDisplay(e,!1)}function _fnFeatureHtmlFilter(e){var a=e.oPreviousSearch,n=e.oLanguage.sSearch;n=-1!==n.indexOf("_INPUT_")?n.replace("_INPUT_",'<input type="text" />'):""===n?'<input type="text" />':n+' <input type="text" />';var t=document.createElement("div");t.className=e.oClasses.sFilter,t.innerHTML="<label>"+n+"</label>",e.aanFeatures.f||(t.id=e.sTableId+"_filter");var o=$('input[type="text"]',t);return t._DT_Input=o[0],o.val(a.sSearch.replace('"',"&quot;")),o.bind("keyup.DT",function(n){for(var t=e.aanFeatures.f,o=""===this.value?"":this.value,l=0,r=t.length;l<r;l++)t[l]!=$(this).parents("div.dataTables_filter")[0]&&$(t[l]._DT_Input).val(o);o!=a.sSearch&&_fnFilterComplete(e,{sSearch:o,bRegex:a.bRegex,bSmart:a.bSmart,bCaseInsensitive:a.bCaseInsensitive})}),o.attr("aria-controls",e.sTableId).bind("keypress.DT",function(e){if(13==e.keyCode)return!1}),t}function _fnFilterComplete(e,a,n){var t=e.oPreviousSearch,o=e.aoPreSearchCols,l=function(e){t.sSearch=e.sSearch,t.bRegex=e.bRegex,t.bSmart=e.bSmart,t.bCaseInsensitive=e.bCaseInsensitive};if(e.oFeatures.bServerSide)l(a);else{_fnFilter(e,a.sSearch,n,a.bRegex,a.bSmart,a.bCaseInsensitive),l(a);for(var r=0;r<e.aoPreSearchCols.length;r++)_fnFilterColumn(e,o[r].sSearch,r,o[r].bRegex,o[r].bSmart,o[r].bCaseInsensitive);_fnFilterCustom(e)}e.bFiltered=!0,$(e.oInstance).trigger("filter",e),e._iDisplayStart=0,_fnCalculateEnd(e),_fnDraw(e),_fnBuildSearchArray(e,0)}function _fnFilterCustom(e){for(var a=DataTable.ext.afnFiltering,n=_fnGetColumns(e,"bSearchable"),t=0,o=a.length;t<o;t++)for(var l=0,r=0,i=e.aiDisplay.length;r<i;r++){var s=e.aiDisplay[r-l];a[t](e,_fnGetRowData(e,s,"filter",n),s)||(e.aiDisplay.splice(r-l,1),l++)}}function _fnFilterColumn(e,a,n,t,o,l){if(""!==a)for(var r=_fnFilterCreateSearch(a,t,o,l),i=e.aiDisplay.length-1;i>=0;i--){var s=_fnDataToSearch(_fnGetCellData(e,e.aiDisplay[i],n,"filter"),e.aoColumns[n].sType);r.test(s)||(e.aiDisplay.splice(i,1),0)}}function _fnFilter(e,a,n,t,o,l){var r,i=_fnFilterCreateSearch(a,t,o,l),s=e.oPreviousSearch;if(n||(n=0),0!==DataTable.ext.afnFiltering.length&&(n=1),a.length<=0)e.aiDisplay.splice(0,e.aiDisplay.length),e.aiDisplay=e.aiDisplayMaster.slice();else if(e.aiDisplay.length==e.aiDisplayMaster.length||s.sSearch.length>a.length||1==n||0!==a.indexOf(s.sSearch))for(e.aiDisplay.splice(0,e.aiDisplay.length),_fnBuildSearchArray(e,1),r=0;r<e.aiDisplayMaster.length;r++)i.test(e.asDataSearch[r])&&e.aiDisplay.push(e.aiDisplayMaster[r]);else{var f=0;for(r=0;r<e.asDataSearch.length;r++)i.test(e.asDataSearch[r])||(e.aiDisplay.splice(r-f,1),f++)}}function _fnBuildSearchArray(e,a){if(!e.oFeatures.bServerSide){e.asDataSearch=[];for(var n=_fnGetColumns(e,"bSearchable"),t=1===a?e.aiDisplayMaster:e.aiDisplay,o=0,l=t.length;o<l;o++)e.asDataSearch[o]=_fnBuildSearchRow(e,_fnGetRowData(e,t[o],"filter",n))}}function _fnBuildSearchRow(e,a){var n=a.join("  ");return-1!==n.indexOf("&")&&(n=$("<div>").html(n).text()),n.replace(/[\n\r]/g," ")}function _fnFilterCreateSearch(e,a,n,t){var o;return n?(o="^(?=.*?"+(a?e.split(" "):_fnEscapeRegex(e).split(" ")).join(")(?=.*?")+").*$",new RegExp(o,t?"i":"")):(e=a?e:_fnEscapeRegex(e),new RegExp(e,t?"i":""))}function _fnDataToSearch(e,a){return"function"==typeof DataTable.ext.ofnSearch[a]?DataTable.ext.ofnSearch[a](e):null===e?"":"html"==a?e.replace(/[\r\n]/g," ").replace(/<.*?>/g,""):"string"==typeof e?e.replace(/[\r\n]/g," "):e}function _fnEscapeRegex(e){var a=new RegExp("(\\"+["/",".","*","+","?","|","(",")","[","]","{","}","\\","$","^","-"].join("|\\")+")","g");return e.replace(a,"\\$1")}function _fnFeatureHtmlInfo(e){var a=document.createElement("div");return a.className=e.oClasses.sInfo,e.aanFeatures.i||(e.aoDrawCallback.push({fn:_fnUpdateInfo,sName:"information"}),a.id=e.sTableId+"_info"),e.nTable.setAttribute("aria-describedby",e.sTableId+"_info"),a}function _fnUpdateInfo(e){if(e.oFeatures.bInfo&&0!==e.aanFeatures.i.length){var a,n=e.oLanguage,t=e._iDisplayStart+1,o=e.fnDisplayEnd(),l=e.fnRecordsTotal(),r=e.fnRecordsDisplay();a=0===r?n.sInfoEmpty:n.sInfo,r!=l&&(a+=" "+n.sInfoFiltered),a=_fnInfoMacros(e,a+=n.sInfoPostFix),null!==n.fnInfoCallback&&(a=n.fnInfoCallback.call(e.oInstance,e,t,o,l,r,a));for(var i=e.aanFeatures.i,s=0,f=i.length;s<f;s++)$(i[s]).html(a)}}function _fnInfoMacros(e,a){var n=e._iDisplayStart+1,t=e.fnFormatNumber(n),o=e.fnDisplayEnd(),l=e.fnFormatNumber(o),r=e.fnRecordsDisplay(),i=e.fnFormatNumber(r),s=e.fnRecordsTotal(),f=e.fnFormatNumber(s);return e.oScroll.bInfinite&&(t=e.fnFormatNumber(1)),a.replace(/_START_/g,t).replace(/_END_/g,l).replace(/_TOTAL_/g,i).replace(/_MAX_/g,f)}function _fnInitialise(e){var a,n,t=e.iInitDisplayStart;if(!1!==e.bInitialised){for(_fnAddOptionsHtml(e),_fnBuildHead(e),_fnDrawHead(e,e.aoHeader),e.nTFoot&&_fnDrawHead(e,e.aoFooter),_fnProcessingDisplay(e,!0),e.oFeatures.bAutoWidth&&_fnCalculateColumnWidths(e),a=0,n=e.aoColumns.length;a<n;a++)null!==e.aoColumns[a].sWidth&&(e.aoColumns[a].nTh.style.width=_fnStringToCss(e.aoColumns[a].sWidth));if(e.oFeatures.bSort?_fnSort(e):e.oFeatures.bFilter?_fnFilterComplete(e,e.oPreviousSearch):(e.aiDisplay=e.aiDisplayMaster.slice(),_fnCalculateEnd(e),_fnDraw(e)),null!==e.sAjaxSource&&!e.oFeatures.bServerSide){var o=[];return _fnServerParams(e,o),void e.fnServerData.call(e.oInstance,e.sAjaxSource,o,function(n){var o=""!==e.sAjaxDataProp?_fnGetObjectDataFn(e.sAjaxDataProp)(n):n;for(a=0;a<o.length;a++)_fnAddData(e,o[a]);e.iInitDisplayStart=t,e.oFeatures.bSort?_fnSort(e):(e.aiDisplay=e.aiDisplayMaster.slice(),_fnCalculateEnd(e),_fnDraw(e)),_fnProcessingDisplay(e,!1),_fnInitComplete(e,n)},e)}e.oFeatures.bServerSide||(_fnProcessingDisplay(e,!1),_fnInitComplete(e))}else setTimeout(function(){_fnInitialise(e)},200)}function _fnInitComplete(e,a){e._bInitComplete=!0,_fnCallbackFire(e,"aoInitComplete","init",[e,a])}function _fnLanguageCompat(e){var a=DataTable.defaults.oLanguage;!e.sEmptyTable&&e.sZeroRecords&&"No data available in table"===a.sEmptyTable&&_fnMap(e,e,"sZeroRecords","sEmptyTable"),!e.sLoadingRecords&&e.sZeroRecords&&"Loading..."===a.sLoadingRecords&&_fnMap(e,e,"sZeroRecords","sLoadingRecords")}function _fnFeatureHtmlLength(e){if(e.oScroll.bInfinite)return null;var a,n,t='<select size="1" '+('name="'+e.sTableId+'_length"')+">",o=e.aLengthMenu;if(2==o.length&&"object"==typeof o[0]&&"object"==typeof o[1])for(a=0,n=o[0].length;a<n;a++)t+='<option value="'+o[0][a]+'">'+o[1][a]+"</option>";else for(a=0,n=o.length;a<n;a++)t+='<option value="'+o[a]+'">'+o[a]+"</option>";t+="</select>";var l=document.createElement("div");return e.aanFeatures.l||(l.id=e.sTableId+"_length"),l.className=e.oClasses.sLength,l.innerHTML="<label>"+e.oLanguage.sLengthMenu.replace("_MENU_",t)+"</label>",$('select option[value="'+e._iDisplayLength+'"]',l).attr("selected",!0),$("select",l).bind("change.DT",function(t){var o=$(this).val(),l=e.aanFeatures.l;for(a=0,n=l.length;a<n;a++)l[a]!=this.parentNode&&$("select",l[a]).val(o);e._iDisplayLength=parseInt(o,10),_fnCalculateEnd(e),e.fnDisplayEnd()==e.fnRecordsDisplay()&&(e._iDisplayStart=e.fnDisplayEnd()-e._iDisplayLength,e._iDisplayStart<0&&(e._iDisplayStart=0)),-1==e._iDisplayLength&&(e._iDisplayStart=0),_fnDraw(e)}),$("select",l).attr("aria-controls",e.sTableId),l}function _fnCalculateEnd(e){!1===e.oFeatures.bPaginate?e._iDisplayEnd=e.aiDisplay.length:e._iDisplayStart+e._iDisplayLength>e.aiDisplay.length||-1==e._iDisplayLength?e._iDisplayEnd=e.aiDisplay.length:e._iDisplayEnd=e._iDisplayStart+e._iDisplayLength}function _fnFeatureHtmlPaginate(e){if(e.oScroll.bInfinite)return null;var a=document.createElement("div");return a.className=e.oClasses.sPaging+e.sPaginationType,DataTable.ext.oPagination[e.sPaginationType].fnInit(e,a,function(e){_fnCalculateEnd(e),_fnDraw(e)}),e.aanFeatures.p||e.aoDrawCallback.push({fn:function(e){DataTable.ext.oPagination[e.sPaginationType].fnUpdate(e,function(e){_fnCalculateEnd(e),_fnDraw(e)})},sName:"pagination"}),a}function _fnPageChange(e,a){var n=e._iDisplayStart;if("number"==typeof a)e._iDisplayStart=a*e._iDisplayLength,e._iDisplayStart>e.fnRecordsDisplay()&&(e._iDisplayStart=0);else if("first"==a)e._iDisplayStart=0;else if("previous"==a)e._iDisplayStart=e._iDisplayLength>=0?e._iDisplayStart-e._iDisplayLength:0,e._iDisplayStart<0&&(e._iDisplayStart=0);else if("next"==a)e._iDisplayLength>=0?e._iDisplayStart+e._iDisplayLength<e.fnRecordsDisplay()&&(e._iDisplayStart+=e._iDisplayLength):e._iDisplayStart=0;else if("last"==a)if(e._iDisplayLength>=0){var t=parseInt((e.fnRecordsDisplay()-1)/e._iDisplayLength,10)+1;e._iDisplayStart=(t-1)*e._iDisplayLength}else e._iDisplayStart=0;else _fnLog(e,0,"Unknown paging action: "+a);return $(e.oInstance).trigger("page",e),n!=e._iDisplayStart}function _fnFeatureHtmlProcessing(e){var a=document.createElement("div");return e.aanFeatures.r||(a.id=e.sTableId+"_processing"),a.innerHTML=e.oLanguage.sProcessing,a.className=e.oClasses.sProcessing,e.nTable.parentNode.insertBefore(a,e.nTable),a}function _fnProcessingDisplay(e,a){if(e.oFeatures.bProcessing)for(var n=e.aanFeatures.r,t=0,o=n.length;t<o;t++)n[t].style.visibility=a?"visible":"hidden";$(e.oInstance).trigger("processing",[e,a])}function _fnFeatureHtmlTable(e){if(""===e.oScroll.sX&&""===e.oScroll.sY)return e.nTable;var a=document.createElement("div"),n=document.createElement("div"),t=document.createElement("div"),o=document.createElement("div"),l=document.createElement("div"),r=document.createElement("div"),i=e.nTable.cloneNode(!1),s=e.nTable.cloneNode(!1),f=e.nTable.getElementsByTagName("thead")[0],d=0===e.nTable.getElementsByTagName("tfoot").length?null:e.nTable.getElementsByTagName("tfoot")[0],u=e.oClasses;n.appendChild(t),l.appendChild(r),o.appendChild(e.nTable),a.appendChild(n),a.appendChild(o),t.appendChild(i),i.appendChild(f),null!==d&&(a.appendChild(l),r.appendChild(s),s.appendChild(d)),a.className=u.sScrollWrapper,n.className=u.sScrollHead,t.className=u.sScrollHeadInner,o.className=u.sScrollBody,l.className=u.sScrollFoot,r.className=u.sScrollFootInner,e.oScroll.bAutoCss&&(n.style.overflow="hidden",n.style.position="relative",l.style.overflow="hidden",o.style.overflow="auto"),n.style.border="0",n.style.width="100%",l.style.border="0",t.style.width=""!==e.oScroll.sXInner?e.oScroll.sXInner:"100%",i.removeAttribute("id"),i.style.marginLeft="0",e.nTable.style.marginLeft="0",null!==d&&(s.removeAttribute("id"),s.style.marginLeft="0");var c=$(e.nTable).children("caption");return c.length>0&&("top"===(c=c[0])._captionSide?i.appendChild(c):"bottom"===c._captionSide&&d&&s.appendChild(c)),""!==e.oScroll.sX&&(n.style.width=_fnStringToCss(e.oScroll.sX),o.style.width=_fnStringToCss(e.oScroll.sX),null!==d&&(l.style.width=_fnStringToCss(e.oScroll.sX)),$(o).scroll(function(e){n.scrollLeft=this.scrollLeft,null!==d&&(l.scrollLeft=this.scrollLeft)})),""!==e.oScroll.sY&&(o.style.height=_fnStringToCss(e.oScroll.sY)),e.aoDrawCallback.push({fn:_fnScrollDraw,sName:"scrolling"}),e.oScroll.bInfinite&&$(o).scroll(function(){e.bDrawing||0===$(this).scrollTop()||$(this).scrollTop()+$(this).height()>$(e.nTable).height()-e.oScroll.iLoadGap&&e.fnDisplayEnd()<e.fnRecordsDisplay()&&(_fnPageChange(e,"next"),_fnCalculateEnd(e),_fnDraw(e))}),e.nScrollHead=n,e.nScrollFoot=l,a}function _fnScrollDraw(e){var a,n,t,o,l,r,i,s,f,d,u,c=e.nScrollHead.getElementsByTagName("div")[0],p=c.getElementsByTagName("table")[0],h=e.nTable.parentNode,g=[],_=[],b=null!==e.nTFoot?e.nScrollFoot.getElementsByTagName("div")[0]:null,S=null!==e.nTFoot?b.getElementsByTagName("table")[0]:null,C=e.oBrowser.bScrollOversize,D=function(e){(i=e.style).paddingTop="0",i.paddingBottom="0",i.borderTopWidth="0",i.borderBottomWidth="0",i.height=0};$(e.nTable).children("thead, tfoot").remove(),f=$(e.nTHead).clone()[0],e.nTable.insertBefore(f,e.nTable.childNodes[0]),t=e.nTHead.getElementsByTagName("tr"),o=f.getElementsByTagName("tr"),null!==e.nTFoot&&(d=$(e.nTFoot).clone()[0],e.nTable.insertBefore(d,e.nTable.childNodes[1]),r=e.nTFoot.getElementsByTagName("tr"),l=d.getElementsByTagName("tr")),""===e.oScroll.sX&&(h.style.width="100%",c.parentNode.style.width="100%");var m=_fnGetUniqueThs(e,f);for(a=0,n=m.length;a<n;a++)s=_fnVisibleToColumnIndex(e,a),m[a].style.width=e.aoColumns[s].sWidth;if(null!==e.nTFoot&&_fnApplyToChildren(function(e){e.style.width=""},l),e.oScroll.bCollapse&&""!==e.oScroll.sY&&(h.style.height=h.offsetHeight+e.nTHead.offsetHeight+"px"),u=$(e.nTable).outerWidth(),""===e.oScroll.sX?(e.nTable.style.width="100%",C&&($("tbody",h).height()>h.offsetHeight||"scroll"==$(h).css("overflow-y"))&&(e.nTable.style.width=_fnStringToCss($(e.nTable).outerWidth()-e.oScroll.iBarWidth))):""!==e.oScroll.sXInner?e.nTable.style.width=_fnStringToCss(e.oScroll.sXInner):u==$(h).width()&&$(h).height()<$(e.nTable).height()?(e.nTable.style.width=_fnStringToCss(u-e.oScroll.iBarWidth),$(e.nTable).outerWidth()>u-e.oScroll.iBarWidth&&(e.nTable.style.width=_fnStringToCss(u))):e.nTable.style.width=_fnStringToCss(u),u=$(e.nTable).outerWidth(),_fnApplyToChildren(D,o),_fnApplyToChildren(function(e){g.push(_fnStringToCss($(e).width()))},o),_fnApplyToChildren(function(e,a){e.style.width=g[a]},t),$(o).height(0),null!==e.nTFoot&&(_fnApplyToChildren(D,l),_fnApplyToChildren(function(e){_.push(_fnStringToCss($(e).width()))},l),_fnApplyToChildren(function(e,a){e.style.width=_[a]},r),$(l).height(0)),_fnApplyToChildren(function(e,a){e.innerHTML="",e.style.width=g[a]},o),null!==e.nTFoot&&_fnApplyToChildren(function(e,a){e.innerHTML="",e.style.width=_[a]},l),$(e.nTable).outerWidth()<u){var T=h.scrollHeight>h.offsetHeight||"scroll"==$(h).css("overflow-y")?u+e.oScroll.iBarWidth:u;C&&(h.scrollHeight>h.offsetHeight||"scroll"==$(h).css("overflow-y"))&&(e.nTable.style.width=_fnStringToCss(T-e.oScroll.iBarWidth)),h.style.width=_fnStringToCss(T),e.nScrollHead.style.width=_fnStringToCss(T),null!==e.nTFoot&&(e.nScrollFoot.style.width=_fnStringToCss(T)),""===e.oScroll.sX?_fnLog(e,1,"The table cannot fit into the current element which will cause column misalignment. The table has been drawn at its minimum possible width."):""!==e.oScroll.sXInner&&_fnLog(e,1,"The table cannot fit into the current element which will cause column misalignment. Increase the sScrollXInner value or remove it to allow automatic calculation")}else h.style.width=_fnStringToCss("100%"),e.nScrollHead.style.width=_fnStringToCss("100%"),null!==e.nTFoot&&(e.nScrollFoot.style.width=_fnStringToCss("100%"));if(""===e.oScroll.sY&&C&&(h.style.height=_fnStringToCss(e.nTable.offsetHeight+e.oScroll.iBarWidth)),""!==e.oScroll.sY&&e.oScroll.bCollapse){h.style.height=_fnStringToCss(e.oScroll.sY);var y=""!==e.oScroll.sX&&e.nTable.offsetWidth>h.offsetWidth?e.oScroll.iBarWidth:0;e.nTable.offsetHeight<h.offsetHeight&&(h.style.height=_fnStringToCss(e.nTable.offsetHeight+y))}var v=$(e.nTable).outerWidth();p.style.width=_fnStringToCss(v),c.style.width=_fnStringToCss(v);var I=$(e.nTable).height()>h.clientHeight||"scroll"==$(h).css("overflow-y");c.style.paddingRight=I?e.oScroll.iBarWidth+"px":"0px",null!==e.nTFoot&&(S.style.width=_fnStringToCss(v),b.style.width=_fnStringToCss(v),b.style.paddingRight=I?e.oScroll.iBarWidth+"px":"0px"),$(h).scroll(),(e.bSorted||e.bFiltered)&&(h.scrollTop=0)}function _fnApplyToChildren(e,a,n){for(var t,o,l=0,r=0,i=a.length;r<i;){for(t=a[r].firstChild,o=n?n[r].firstChild:null;t;)1===t.nodeType&&(n?e(t,o,l):e(t,l),l++),t=t.nextSibling,o=n?o.nextSibling:null;r++}}function _fnConvertToWidth(e,a){if(!e||null===e||""===e)return 0;var n;a||(a=document.body);var t=document.createElement("div");return t.style.width=_fnStringToCss(e),a.appendChild(t),n=t.offsetWidth,a.removeChild(t),n}function _fnCalculateColumnWidths(e){e.nTable.offsetWidth;var a,n,t,o,l=0,r=0,i=e.aoColumns.length,s=$("th",e.nTHead),f=e.nTable.getAttribute("width"),d=e.nTable.parentNode;for(n=0;n<i;n++)e.aoColumns[n].bVisible&&(r++,null!==e.aoColumns[n].sWidth&&(null!==(a=_fnConvertToWidth(e.aoColumns[n].sWidthOrig,d))&&(e.aoColumns[n].sWidth=_fnStringToCss(a)),l++));if(i==s.length&&0===l&&r==i&&""===e.oScroll.sX&&""===e.oScroll.sY)for(n=0;n<e.aoColumns.length;n++)null!==(a=$(s[n]).width())&&(e.aoColumns[n].sWidth=_fnStringToCss(a));else{var u=e.nTable.cloneNode(!1),c=e.nTHead.cloneNode(!0),p=document.createElement("tbody"),h=document.createElement("tr");u.removeAttribute("id"),u.appendChild(c),null!==e.nTFoot&&(u.appendChild(e.nTFoot.cloneNode(!0)),_fnApplyToChildren(function(e){e.style.width=""},u.getElementsByTagName("tr"))),u.appendChild(p),p.appendChild(h);var g=$("thead th",u);0===g.length&&(g=$("tbody tr:eq(0)>td",u));var _=_fnGetUniqueThs(e,c);for(t=0,n=0;n<i;n++){var b=e.aoColumns[n];b.bVisible&&null!==b.sWidthOrig&&""!==b.sWidthOrig?_[n-t].style.width=_fnStringToCss(b.sWidthOrig):b.bVisible?_[n-t].style.width="":t++}for(n=0;n<i;n++)if(e.aoColumns[n].bVisible){var S=_fnGetWidestNode(e,n);null!==S&&(S=S.cloneNode(!0),""!==e.aoColumns[n].sContentPadding&&(S.innerHTML+=e.aoColumns[n].sContentPadding),h.appendChild(S))}d.appendChild(u),""!==e.oScroll.sX&&""!==e.oScroll.sXInner?u.style.width=_fnStringToCss(e.oScroll.sXInner):""!==e.oScroll.sX?(u.style.width="",$(u).width()<d.offsetWidth&&(u.style.width=_fnStringToCss(d.offsetWidth))):""!==e.oScroll.sY?u.style.width=_fnStringToCss(d.offsetWidth):f&&(u.style.width=_fnStringToCss(f)),u.style.visibility="hidden",_fnScrollingWidthAdjust(e,u);var C=$("tbody tr:eq(0)",u).children();if(0===C.length&&(C=_fnGetUniqueThs(e,$("thead",u)[0])),""!==e.oScroll.sX){var D=0;for(t=0,n=0;n<e.aoColumns.length;n++)e.aoColumns[n].bVisible&&(null===e.aoColumns[n].sWidthOrig?D+=$(C[t]).outerWidth():D+=parseInt(e.aoColumns[n].sWidth.replace("px",""),10)+($(C[t]).outerWidth()-$(C[t]).width()),t++);u.style.width=_fnStringToCss(D),e.nTable.style.width=_fnStringToCss(D)}for(t=0,n=0;n<e.aoColumns.length;n++)e.aoColumns[n].bVisible&&(null!==(o=$(C[t]).width())&&o>0&&(e.aoColumns[n].sWidth=_fnStringToCss(o)),t++);var m=$(u).css("width");e.nTable.style.width=-1!==m.indexOf("%")?m:_fnStringToCss($(u).outerWidth()),u.parentNode.removeChild(u)}f&&(e.nTable.style.width=_fnStringToCss(f))}function _fnScrollingWidthAdjust(e,a){if(""===e.oScroll.sX&&""!==e.oScroll.sY){$(a).width();a.style.width=_fnStringToCss($(a).outerWidth()-e.oScroll.iBarWidth)}else""!==e.oScroll.sX&&(a.style.width=_fnStringToCss($(a).outerWidth()))}function _fnGetWidestNode(e,a){var n=_fnGetMaxLenString(e,a);if(n<0)return null;if(null===e.aoData[n].nTr){var t=document.createElement("td");return t.innerHTML=_fnGetCellData(e,n,a,""),t}return _fnGetTdNodes(e,n)[a]}function _fnGetMaxLenString(e,a){for(var n=-1,t=-1,o=0;o<e.aoData.length;o++){var l=_fnGetCellData(e,o,a,"display")+"";(l=l.replace(/<.*?>/g,"")).length>n&&(n=l.length,t=o)}return t}function _fnStringToCss(e){if(null===e)return"0px";if("number"==typeof e)return e<0?"0px":e+"px";var a=e.charCodeAt(e.length-1);return a<48||a>57?e:e+"px"}function _fnScrollBarWidth(){var e=document.createElement("p"),a=e.style;a.width="100%",a.height="200px",a.padding="0px";var n=document.createElement("div");(a=n.style).position="absolute",a.top="0px",a.left="0px",a.visibility="hidden",a.width="200px",a.height="150px",a.padding="0px",a.overflow="hidden",n.appendChild(e),document.body.appendChild(n);var t=e.offsetWidth;n.style.overflow="scroll";var o=e.offsetWidth;return t==o&&(o=n.clientWidth),document.body.removeChild(n),t-o}function _fnSort(e,a){var n,t,o,l,r,i,s,f,d=[],u=[],c=DataTable.ext.oSort,p=e.aoData,h=e.aoColumns,g=e.oLanguage.oAria;if(!e.oFeatures.bServerSide&&(0!==e.aaSorting.length||null!==e.aaSortingFixed)){for(d=null!==e.aaSortingFixed?e.aaSortingFixed.concat(e.aaSorting):e.aaSorting.slice(),n=0;n<d.length;n++){var _=d[n][0],b=_fnColumnIndexToVisible(e,_);if(s=e.aoColumns[_].sSortDataType,DataTable.ext.afnSortData[s]){var S=DataTable.ext.afnSortData[s].call(e.oInstance,e,_,b);if(S.length===p.length)for(o=0,l=p.length;o<l;o++)_fnSetCellData(e,o,_,S[o]);else _fnLog(e,0,"Returned data sort array (col "+_+") is the wrong length")}}for(n=0,t=e.aiDisplayMaster.length;n<t;n++)u[e.aiDisplayMaster[n]]=n;var C,D,m=d.length;for(n=0,t=p.length;n<t;n++)for(o=0;o<m;o++)for(r=0,i=(D=h[d[o][0]].aDataSort).length;r<i;r++)s=h[D[r]].sType,C=c[(s||"string")+"-pre"],p[n]._aSortData[D[r]]=C?C(_fnGetCellData(e,n,D[r],"sort")):_fnGetCellData(e,n,D[r],"sort");e.aiDisplayMaster.sort(function(e,a){var n,t,o,l,r,i;for(n=0;n<m;n++)for(t=0,o=(r=h[d[n][0]].aDataSort).length;t<o;t++)if(i=h[r[t]].sType,0!==(l=c[(i||"string")+"-"+d[n][1]](p[e]._aSortData[r[t]],p[a]._aSortData[r[t]])))return l;return c["numeric-asc"](u[e],u[a])})}for(a!==undefined&&!a||e.oFeatures.bDeferRender||_fnSortingClasses(e),n=0,t=e.aoColumns.length;n<t;n++){var T=h[n].sTitle.replace(/<.*?>/g,"");if((f=h[n].nTh).removeAttribute("aria-sort"),f.removeAttribute("aria-label"),h[n].bSortable)if(d.length>0&&d[0][0]==n){f.setAttribute("aria-sort","asc"==d[0][1]?"ascending":"descending");var y=h[n].asSorting[d[0][2]+1]?h[n].asSorting[d[0][2]+1]:h[n].asSorting[0];f.setAttribute("aria-label",T+("asc"==y?g.sSortAscending:g.sSortDescending))}else f.setAttribute("aria-label",T+("asc"==h[n].asSorting[0]?g.sSortAscending:g.sSortDescending));else f.setAttribute("aria-label",T)}e.bSorted=!0,$(e.oInstance).trigger("sort",e),e.oFeatures.bFilter?_fnFilterComplete(e,e.oPreviousSearch,1):(e.aiDisplay=e.aiDisplayMaster.slice(),e._iDisplayStart=0,_fnCalculateEnd(e),_fnDraw(e))}function _fnSortAttachListener(e,a,n,t){_fnBindAction(a,{},function(a){if(!1!==e.aoColumns[n].bSortable){var o=function(){var t,o;if(a.shiftKey){for(var l=!1,r=0;r<e.aaSorting.length;r++)if(e.aaSorting[r][0]==n){l=!0,t=e.aaSorting[r][0],o=e.aaSorting[r][2]+1,e.aoColumns[t].asSorting[o]?(e.aaSorting[r][1]=e.aoColumns[t].asSorting[o],e.aaSorting[r][2]=o):e.aaSorting.splice(r,1);break}!1===l&&e.aaSorting.push([n,e.aoColumns[n].asSorting[0],0])}else 1==e.aaSorting.length&&e.aaSorting[0][0]==n?(t=e.aaSorting[0][0],o=e.aaSorting[0][2]+1,e.aoColumns[t].asSorting[o]||(o=0),e.aaSorting[0][1]=e.aoColumns[t].asSorting[o],e.aaSorting[0][2]=o):(e.aaSorting.splice(0,e.aaSorting.length),e.aaSorting.push([n,e.aoColumns[n].asSorting[0],0]));_fnSort(e)};e.oFeatures.bProcessing?(_fnProcessingDisplay(e,!0),setTimeout(function(){o(),e.oFeatures.bServerSide||_fnProcessingDisplay(e,!1)},0)):o(),"function"==typeof t&&t(e)}})}function _fnSortingClasses(e){var a,n,t,o,l,r,i=e.aoColumns.length,s=e.oClasses;for(a=0;a<i;a++)e.aoColumns[a].bSortable&&$(e.aoColumns[a].nTh).removeClass(s.sSortAsc+" "+s.sSortDesc+" "+e.aoColumns[a].sSortingClass);for(l=null!==e.aaSortingFixed?e.aaSortingFixed.concat(e.aaSorting):e.aaSorting.slice(),a=0;a<e.aoColumns.length;a++)if(e.aoColumns[a].bSortable){for(r=e.aoColumns[a].sSortingClass,o=-1,t=0;t<l.length;t++)if(l[t][0]==a){r="asc"==l[t][1]?s.sSortAsc:s.sSortDesc,o=t;break}if($(e.aoColumns[a].nTh).addClass(r),e.bJUI){var f,d=$("span."+s.sSortIcon,e.aoColumns[a].nTh);d.removeClass(s.sSortJUIAsc+" "+s.sSortJUIDesc+" "+s.sSortJUI+" "+s.sSortJUIAscAllowed+" "+s.sSortJUIDescAllowed),f=-1==o?e.aoColumns[a].sSortingClassJUI:"asc"==l[o][1]?s.sSortJUIAsc:s.sSortJUIDesc,d.addClass(f)}}else $(e.aoColumns[a].nTh).addClass(e.aoColumns[a].sSortingClass);if(r=s.sSortColumn,e.oFeatures.bSort&&e.oFeatures.bSortClasses){var u,c,p=_fnGetTdNodes(e),h=[];for(a=0;a<i;a++)h.push("");for(a=0,u=1;a<l.length;a++)h[c=parseInt(l[a][0],10)]=r+u,u<3&&u++;var g,_,b,S=new RegExp(r+"[123]");for(a=0,n=p.length;a<n;a++)c=a%i,_=p[a].className,b=h[c],(g=_.replace(S,b))!=_?p[a].className=$.trim(g):b.length>0&&-1==_.indexOf(b)&&(p[a].className=_+" "+b)}}function _fnSaveState(e){if(e.oFeatures.bStateSave&&!e.bDestroying){var a,n,t=e.oScroll.bInfinite,o={iCreate:(new Date).getTime(),iStart:t?0:e._iDisplayStart,iEnd:t?e._iDisplayLength:e._iDisplayEnd,iLength:e._iDisplayLength,aaSorting:$.extend(!0,[],e.aaSorting),oSearch:$.extend(!0,{},e.oPreviousSearch),aoSearchCols:$.extend(!0,[],e.aoPreSearchCols),abVisCols:[]};for(a=0,n=e.aoColumns.length;a<n;a++)o.abVisCols.push(e.aoColumns[a].bVisible);_fnCallbackFire(e,"aoStateSaveParams","stateSaveParams",[e,o]),e.fnStateSave.call(e.oInstance,e,o)}}function _fnLoadState(e,a){if(e.oFeatures.bStateSave){var n=e.fnStateLoad.call(e.oInstance,e);if(n){var t=_fnCallbackFire(e,"aoStateLoadParams","stateLoadParams",[e,n]);if(-1===$.inArray(!1,t)){e.oLoadedState=$.extend(!0,{},n),e._iDisplayStart=n.iStart,e.iInitDisplayStart=n.iStart,e._iDisplayEnd=n.iEnd,e._iDisplayLength=n.iLength,e.aaSorting=n.aaSorting.slice(),e.saved_aaSorting=n.aaSorting.slice(),$.extend(e.oPreviousSearch,n.oSearch),$.extend(!0,e.aoPreSearchCols,n.aoSearchCols),a.saved_aoColumns=[];for(var o=0;o<n.abVisCols.length;o++)a.saved_aoColumns[o]={},a.saved_aoColumns[o].bVisible=n.abVisCols[o];_fnCallbackFire(e,"aoStateLoaded","stateLoaded",[e,n])}}}}function _fnCreateCookie(sName,sValue,iSecs,sBaseName,fnCallback){var date=new Date;date.setTime(date.getTime()+1e3*iSecs);var aParts=window.location.pathname.split("/"),sNameFile=sName+"_"+aParts.pop().replace(/[\/:]/g,"").toLowerCase(),sFullCookie,oData;null!==fnCallback?(oData="function"==typeof $.parseJSON?$.parseJSON(sValue):eval("("+sValue+")"),sFullCookie=fnCallback(sNameFile,oData,date.toGMTString(),aParts.join("/")+"/")):sFullCookie=sNameFile+"="+encodeURIComponent(sValue)+"; expires="+date.toGMTString()+"; path="+aParts.join("/")+"/";var aCookies=document.cookie.split(";"),iNewCookieLen=sFullCookie.split(";")[0].length,aOldCookies=[];if(iNewCookieLen+document.cookie.length+10>4096){for(var i=0,iLen=aCookies.length;i<iLen;i++)if(-1!=aCookies[i].indexOf(sBaseName)){var aSplitCookie=aCookies[i].split("=");try{oData=eval("("+decodeURIComponent(aSplitCookie[1])+")"),oData&&oData.iCreate&&aOldCookies.push({name:aSplitCookie[0],time:oData.iCreate})}catch(e){}}for(aOldCookies.sort(function(e,a){return a.time-e.time});iNewCookieLen+document.cookie.length+10>4096;){if(0===aOldCookies.length)return;var old=aOldCookies.pop();document.cookie=old.name+"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+aParts.join("/")+"/"}}document.cookie=sFullCookie}function _fnReadCookie(e){for(var a=window.location.pathname.split("/"),n=e+"_"+a[a.length-1].replace(/[\/:]/g,"").toLowerCase()+"=",t=document.cookie.split(";"),o=0;o<t.length;o++){for(var l=t[o];" "==l.charAt(0);)l=l.substring(1,l.length);if(0===l.indexOf(n))return decodeURIComponent(l.substring(n.length,l.length))}return null}function _fnSettingsFromNode(e){for(var a=0;a<DataTable.settings.length;a++)if(DataTable.settings[a].nTable===e)return DataTable.settings[a];return null}function _fnGetTrNodes(e){for(var a=[],n=e.aoData,t=0,o=n.length;t<o;t++)null!==n[t].nTr&&a.push(n[t].nTr);return a}function _fnGetTdNodes(e,a){var n,t,o,l,r,i,s,f,d=[],u=0,c=e.aoData.length;for(a!==undefined&&(u=a,c=a+1),l=u;l<c;l++)if(null!==(s=e.aoData[l]).nTr){for(t=[],o=s.nTr.firstChild;o;)"td"!=(f=o.nodeName.toLowerCase())&&"th"!=f||t.push(o),o=o.nextSibling;for(n=0,r=0,i=e.aoColumns.length;r<i;r++)e.aoColumns[r].bVisible?d.push(t[r-n]):(d.push(s._anHidden[r]),n++)}return d}function _fnLog(e,a,n){var t=null===e?"DataTables warning: "+n:"DataTables warning (table id = '"+e.sTableId+"'): "+n;if(0!==a)window.console&&console.log&&console.log(t);else{if("alert"!=DataTable.ext.sErrMode)throw new Error(t);alert(t)}}function _fnMap(e,a,n,t){t===undefined&&(t=n),a[n]!==undefined&&(e[t]=a[n])}function _fnExtend(e,a){var n;for(var t in a)a.hasOwnProperty(t)&&(n=a[t],"object"==typeof oInit[t]&&null!==n&&!1===$.isArray(n)?$.extend(!0,e[t],n):e[t]=n);return e}function _fnBindAction(e,a,n){$(e).bind("click.DT",a,function(a){e.blur(),n(a)}).bind("keypress.DT",a,function(e){13===e.which&&n(e)}).bind("selectstart.DT",function(){return!1})}function _fnCallbackReg(e,a,n,t){n&&e[a].push({fn:n,sName:t})}function _fnCallbackFire(e,a,n,t){for(var o=e[a],l=[],r=o.length-1;r>=0;r--)l.push(o[r].fn.apply(e.oInstance,t));return null!==n&&$(e.oInstance).trigger(n,t),l}var _fnJsonString=window.JSON?JSON.stringify:function(e){var a=typeof e;if("object"!==a||null===e)return"string"===a&&(e='"'+e+'"'),e+"";var n,t,o=[],l=$.isArray(e);for(n in e)"string"===(a=typeof(t=e[n]))?t='"'+t+'"':"object"===a&&null!==t&&(t=_fnJsonString(t)),o.push((l?"":'"'+n+'":')+t);return(l?"[":"{")+o+(l?"]":"}")};function _fnBrowserDetect(e){var a=$('<div style="position:absolute; top:0; left:0; height:1px; width:1px; overflow:hidden"><div style="position:absolute; top:1px; left:1px; width:100px; overflow:scroll;"><div id="DT_BrowserTest" style="width:100%; height:10px;"></div></div></div>')[0];document.body.appendChild(a),e.oBrowser.bScrollOversize=100===$("#DT_BrowserTest",a)[0].offsetWidth,document.body.removeChild(a)}function _fnExternApiFunc(e){return function(){var a=[_fnSettingsFromNode(this[DataTable.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return DataTable.ext.oApi[e].apply(this,a)}}this.$=function(e,a){var n,t,o,l=[],r=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),i=r.aoData,s=r.aiDisplay,f=r.aiDisplayMaster;if(a||(a={}),"current"==(a=$.extend({},{filter:"none",order:"current",page:"all"},a)).page)for(n=r._iDisplayStart,t=r.fnDisplayEnd();n<t;n++)(o=i[s[n]].nTr)&&l.push(o);else if("current"==a.order&&"none"==a.filter)for(n=0,t=f.length;n<t;n++)(o=i[f[n]].nTr)&&l.push(o);else if("current"==a.order&&"applied"==a.filter)for(n=0,t=s.length;n<t;n++)(o=i[s[n]].nTr)&&l.push(o);else if("original"==a.order&&"none"==a.filter)for(n=0,t=i.length;n<t;n++)(o=i[n].nTr)&&l.push(o);else if("original"==a.order&&"applied"==a.filter)for(n=0,t=i.length;n<t;n++)o=i[n].nTr,-1!==$.inArray(n,s)&&o&&l.push(o);else _fnLog(r,1,"Unknown selection options");var d=$(l),u=d.filter(e),c=d.find(e);return $([].concat($.makeArray(u),$.makeArray(c)))},this._=function(e,a){var n,t,o=[],l=this.$(e,a);for(n=0,t=l.length;n<t;n++)o.push(this.fnGetData(l[n]));return o},this.fnAddData=function(e,a){if(0===e.length)return[];var n,t=[],o=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);if("object"==typeof e[0]&&null!==e[0])for(var l=0;l<e.length;l++){if(-1==(n=_fnAddData(o,e[l])))return t;t.push(n)}else{if(-1==(n=_fnAddData(o,e)))return t;t.push(n)}return o.aiDisplay=o.aiDisplayMaster.slice(),(a===undefined||a)&&_fnReDraw(o),t},this.fnAdjustColumnSizing=function(e){var a=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);_fnAdjustColumnSizing(a),e===undefined||e?this.fnDraw(!1):""===a.oScroll.sX&&""===a.oScroll.sY||this.oApi._fnScrollDraw(a)},this.fnClearTable=function(e){var a=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);_fnClearTable(a),(e===undefined||e)&&_fnDraw(a)},this.fnClose=function(e){for(var a=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),n=0;n<a.aoOpenRows.length;n++)if(a.aoOpenRows[n].nParent==e){var t=a.aoOpenRows[n].nTr.parentNode;return t&&t.removeChild(a.aoOpenRows[n].nTr),a.aoOpenRows.splice(n,1),0}return 1},this.fnDeleteRow=function(e,a,n){var t,o,l,r=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);l="object"==typeof e?_fnNodeToDataIndex(r,e):e;var i=r.aoData.splice(l,1);for(t=0,o=r.aoData.length;t<o;t++)null!==r.aoData[t].nTr&&(r.aoData[t].nTr._DT_RowIndex=t);var s=$.inArray(l,r.aiDisplay);return r.asDataSearch.splice(s,1),_fnDeleteIndex(r.aiDisplayMaster,l),_fnDeleteIndex(r.aiDisplay,l),"function"==typeof a&&a.call(this,r,i),r._iDisplayStart>=r.fnRecordsDisplay()&&(r._iDisplayStart-=r._iDisplayLength,r._iDisplayStart<0&&(r._iDisplayStart=0)),(n===undefined||n)&&(_fnCalculateEnd(r),_fnDraw(r)),i},this.fnDestroy=function(e){var a,n,t=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),o=t.nTableWrapper.parentNode,l=t.nTBody;if(e=e!==undefined&&e,t.bDestroying=!0,_fnCallbackFire(t,"aoDestroyCallback","destroy",[t]),!e)for(a=0,n=t.aoColumns.length;a<n;a++)!1===t.aoColumns[a].bVisible&&this.fnSetColumnVis(a,!0);for($(t.nTableWrapper).find("*").andSelf().unbind(".DT"),$("tbody>tr>td."+t.oClasses.sRowEmpty,t.nTable).parent().remove(),t.nTable!=t.nTHead.parentNode&&($(t.nTable).children("thead").remove(),t.nTable.appendChild(t.nTHead)),t.nTFoot&&t.nTable!=t.nTFoot.parentNode&&($(t.nTable).children("tfoot").remove(),t.nTable.appendChild(t.nTFoot)),t.nTable.parentNode.removeChild(t.nTable),$(t.nTableWrapper).remove(),t.aaSorting=[],t.aaSortingFixed=[],_fnSortingClasses(t),$(_fnGetTrNodes(t)).removeClass(t.asStripeClasses.join(" ")),$("th, td",t.nTHead).removeClass([t.oClasses.sSortable,t.oClasses.sSortableAsc,t.oClasses.sSortableDesc,t.oClasses.sSortableNone].join(" ")),t.bJUI&&($("th span."+t.oClasses.sSortIcon+", td span."+t.oClasses.sSortIcon,t.nTHead).remove(),$("th, td",t.nTHead).each(function(){var e=$("div."+t.oClasses.sSortJUIWrapper,this),a=e.contents();$(this).append(a),e.remove()})),!e&&t.nTableReinsertBefore?o.insertBefore(t.nTable,t.nTableReinsertBefore):e||o.appendChild(t.nTable),a=0,n=t.aoData.length;a<n;a++)null!==t.aoData[a].nTr&&l.appendChild(t.aoData[a].nTr);if(!0===t.oFeatures.bAutoWidth&&(t.nTable.style.width=_fnStringToCss(t.sDestroyWidth)),n=t.asDestroyStripes.length){var r=$(l).children("tr");for(a=0;a<n;a++)r.filter(":nth-child("+n+"n + "+a+")").addClass(t.asDestroyStripes[a])}for(a=0,n=DataTable.settings.length;a<n;a++)DataTable.settings[a]==t&&DataTable.settings.splice(a,1);t=null,oInit=null},this.fnDraw=function(e){var a=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);!1===e?(_fnCalculateEnd(a),_fnDraw(a)):_fnReDraw(a)},this.fnFilter=function(e,a,n,t,o,l){var r=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);if(r.oFeatures.bFilter)if(n!==undefined&&null!==n||(n=!1),t!==undefined&&null!==t||(t=!0),o!==undefined&&null!==o||(o=!0),l!==undefined&&null!==l||(l=!0),a===undefined||null===a){if(_fnFilterComplete(r,{sSearch:e+"",bRegex:n,bSmart:t,bCaseInsensitive:l},1),o&&r.aanFeatures.f)for(var i=r.aanFeatures.f,s=0,f=i.length;s<f;s++)try{i[s]._DT_Input!=document.activeElement&&$(i[s]._DT_Input).val(e)}catch(a){$(i[s]._DT_Input).val(e)}}else $.extend(r.aoPreSearchCols[a],{sSearch:e+"",bRegex:n,bSmart:t,bCaseInsensitive:l}),_fnFilterComplete(r,r.oPreviousSearch,1)},this.fnGetData=function(e,a){var n=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);if(e!==undefined){var t=e;if("object"==typeof e){var o=e.nodeName.toLowerCase();"tr"===o?t=_fnNodeToDataIndex(n,e):"td"===o&&(a=_fnNodeToColumnIndex(n,t=_fnNodeToDataIndex(n,e.parentNode),e))}return a!==undefined?_fnGetCellData(n,t,a,""):n.aoData[t]!==undefined?n.aoData[t]._aData:null}return _fnGetDataMaster(n)},this.fnGetNodes=function(e){var a=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);return e!==undefined?a.aoData[e]!==undefined?a.aoData[e].nTr:null:_fnGetTrNodes(a)},this.fnGetPosition=function(e){var a=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),n=e.nodeName.toUpperCase();if("TR"==n)return _fnNodeToDataIndex(a,e);if("TD"==n||"TH"==n){var t=_fnNodeToDataIndex(a,e.parentNode),o=_fnNodeToColumnIndex(a,t,e);return[t,_fnColumnIndexToVisible(a,o),o]}return null},this.fnIsOpen=function(e){for(var a=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),n=(a.aoOpenRows,0);n<a.aoOpenRows.length;n++)if(a.aoOpenRows[n].nParent==e)return!0;return!1},this.fnOpen=function(e,a,n){var t=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),o=_fnGetTrNodes(t);if(-1!==$.inArray(e,o)){this.fnClose(e);var l=document.createElement("tr"),r=document.createElement("td");l.appendChild(r),r.className=n,r.colSpan=_fnVisbleColumns(t),"string"==typeof a?r.innerHTML=a:$(r).html(a);var i=$("tr",t.nTBody);return-1!=$.inArray(e,i)&&$(l).insertAfter(e),t.aoOpenRows.push({nTr:l,nParent:e}),l}},this.fnPageChange=function(e,a){var n=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);_fnPageChange(n,e),_fnCalculateEnd(n),(a===undefined||a)&&_fnDraw(n)},this.fnSetColumnVis=function(e,a,n){var t,o,l,r,i,s=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),f=s.aoColumns,d=s.aoData;if(f[e].bVisible!=a){if(a){var u=0;for(t=0;t<e;t++)f[t].bVisible&&u++;if(!(r=u>=_fnVisbleColumns(s)))for(t=e;t<f.length;t++)if(f[t].bVisible){i=t;break}for(t=0,o=d.length;t<o;t++)null!==d[t].nTr&&(r?d[t].nTr.appendChild(d[t]._anHidden[e]):d[t].nTr.insertBefore(d[t]._anHidden[e],_fnGetTdNodes(s,t)[i]))}else for(t=0,o=d.length;t<o;t++)null!==d[t].nTr&&(l=_fnGetTdNodes(s,t)[e],d[t]._anHidden[e]=l,l.parentNode.removeChild(l));for(f[e].bVisible=a,_fnDrawHead(s,s.aoHeader),s.nTFoot&&_fnDrawHead(s,s.aoFooter),t=0,o=s.aoOpenRows.length;t<o;t++)s.aoOpenRows[t].nTr.colSpan=_fnVisbleColumns(s);(n===undefined||n)&&(_fnAdjustColumnSizing(s),_fnDraw(s)),_fnSaveState(s)}},this.fnSettings=function(){return _fnSettingsFromNode(this[DataTable.ext.iApiIndex])},this.fnSort=function(e){var a=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]);a.aaSorting=e,_fnSort(a)},this.fnSortListener=function(e,a,n){_fnSortAttachListener(_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),e,a,n)},this.fnUpdate=function(e,a,n,t,o){var l,r,i=_fnSettingsFromNode(this[DataTable.ext.iApiIndex]),s="object"==typeof a?_fnNodeToDataIndex(i,a):a;if($.isArray(e)&&n===undefined)for(i.aoData[s]._aData=e.slice(),l=0;l<i.aoColumns.length;l++)this.fnUpdate(_fnGetCellData(i,s,l),s,l,!1,!1);else if($.isPlainObject(e)&&n===undefined)for(i.aoData[s]._aData=$.extend(!0,{},e),l=0;l<i.aoColumns.length;l++)this.fnUpdate(_fnGetCellData(i,s,l),s,l,!1,!1);else{_fnSetCellData(i,s,n,e),r=_fnGetCellData(i,s,n,"display");var f=i.aoColumns[n];null!==f.fnRender&&(r=_fnRender(i,s,n),f.bUseRendered&&_fnSetCellData(i,s,n,r)),null!==i.aoData[s].nTr&&(_fnGetTdNodes(i,s)[n].innerHTML=r)}var d=$.inArray(s,i.aiDisplay);return i.asDataSearch[d]=_fnBuildSearchRow(i,_fnGetRowData(i,s,"filter",_fnGetColumns(i,"bSearchable"))),(o===undefined||o)&&_fnAdjustColumnSizing(i),(t===undefined||t)&&_fnReDraw(i),0},this.fnVersionCheck=DataTable.ext.fnVersionCheck,this.oApi={_fnExternApiFunc:_fnExternApiFunc,_fnInitialise:_fnInitialise,_fnInitComplete:_fnInitComplete,_fnLanguageCompat:_fnLanguageCompat,_fnAddColumn:_fnAddColumn,_fnColumnOptions:_fnColumnOptions,_fnAddData:_fnAddData,_fnCreateTr:_fnCreateTr,_fnGatherData:_fnGatherData,_fnBuildHead:_fnBuildHead,_fnDrawHead:_fnDrawHead,_fnDraw:_fnDraw,_fnReDraw:_fnReDraw,_fnAjaxUpdate:_fnAjaxUpdate,_fnAjaxParameters:_fnAjaxParameters,_fnAjaxUpdateDraw:_fnAjaxUpdateDraw,_fnServerParams:_fnServerParams,_fnAddOptionsHtml:_fnAddOptionsHtml,_fnFeatureHtmlTable:_fnFeatureHtmlTable,_fnScrollDraw:_fnScrollDraw,_fnAdjustColumnSizing:_fnAdjustColumnSizing,_fnFeatureHtmlFilter:_fnFeatureHtmlFilter,_fnFilterComplete:_fnFilterComplete,_fnFilterCustom:_fnFilterCustom,_fnFilterColumn:_fnFilterColumn,_fnFilter:_fnFilter,_fnBuildSearchArray:_fnBuildSearchArray,_fnBuildSearchRow:_fnBuildSearchRow,_fnFilterCreateSearch:_fnFilterCreateSearch,_fnDataToSearch:_fnDataToSearch,_fnSort:_fnSort,_fnSortAttachListener:_fnSortAttachListener,_fnSortingClasses:_fnSortingClasses,_fnFeatureHtmlPaginate:_fnFeatureHtmlPaginate,_fnPageChange:_fnPageChange,_fnFeatureHtmlInfo:_fnFeatureHtmlInfo,_fnUpdateInfo:_fnUpdateInfo,_fnFeatureHtmlLength:_fnFeatureHtmlLength,_fnFeatureHtmlProcessing:_fnFeatureHtmlProcessing,_fnProcessingDisplay:_fnProcessingDisplay,_fnVisibleToColumnIndex:_fnVisibleToColumnIndex,_fnColumnIndexToVisible:_fnColumnIndexToVisible,_fnNodeToDataIndex:_fnNodeToDataIndex,_fnVisbleColumns:_fnVisbleColumns,_fnCalculateEnd:_fnCalculateEnd,_fnConvertToWidth:_fnConvertToWidth,_fnCalculateColumnWidths:_fnCalculateColumnWidths,_fnScrollingWidthAdjust:_fnScrollingWidthAdjust,_fnGetWidestNode:_fnGetWidestNode,_fnGetMaxLenString:_fnGetMaxLenString,_fnStringToCss:_fnStringToCss,_fnDetectType:_fnDetectType,_fnSettingsFromNode:_fnSettingsFromNode,_fnGetDataMaster:_fnGetDataMaster,_fnGetTrNodes:_fnGetTrNodes,_fnGetTdNodes:_fnGetTdNodes,_fnEscapeRegex:_fnEscapeRegex,_fnDeleteIndex:_fnDeleteIndex,_fnReOrderIndex:_fnReOrderIndex,_fnColumnOrdering:_fnColumnOrdering,_fnLog:_fnLog,_fnClearTable:_fnClearTable,_fnSaveState:_fnSaveState,_fnLoadState:_fnLoadState,_fnCreateCookie:_fnCreateCookie,_fnReadCookie:_fnReadCookie,_fnDetectHeader:_fnDetectHeader,_fnGetUniqueThs:_fnGetUniqueThs,_fnScrollBarWidth:_fnScrollBarWidth,_fnApplyToChildren:_fnApplyToChildren,_fnMap:_fnMap,_fnGetRowData:_fnGetRowData,_fnGetCellData:_fnGetCellData,_fnSetCellData:_fnSetCellData,_fnGetObjectDataFn:_fnGetObjectDataFn,_fnSetObjectDataFn:_fnSetObjectDataFn,_fnApplyColumnDefs:_fnApplyColumnDefs,_fnBindAction:_fnBindAction,_fnExtend:_fnExtend,_fnCallbackReg:_fnCallbackReg,_fnCallbackFire:_fnCallbackFire,_fnJsonString:_fnJsonString,_fnRender:_fnRender,_fnNodeToColumnIndex:_fnNodeToColumnIndex,_fnInfoMacros:_fnInfoMacros,_fnBrowserDetect:_fnBrowserDetect,_fnGetColumns:_fnGetColumns},$.extend(DataTable.ext.oApi,this.oApi);for(var sFunc in DataTable.ext.oApi)sFunc&&(this[sFunc]=_fnExternApiFunc(sFunc));var _that=this;return this.each(function(){var e,a,n,t=0,o=this.getAttribute("id"),l=!1,r=!1;if("table"==this.nodeName.toLowerCase()){for(t=0,e=DataTable.settings.length;t<e;t++){if(DataTable.settings[t].nTable==this){if(oInit===undefined||oInit.bRetrieve)return DataTable.settings[t].oInstance;if(oInit.bDestroy){DataTable.settings[t].oInstance.fnDestroy();break}return void _fnLog(DataTable.settings[t],0,"Cannot reinitialise DataTable.\n\nTo retrieve the DataTables object for this table, pass no arguments or see the docs for bRetrieve and bDestroy")}if(DataTable.settings[t].sTableId==this.id){DataTable.settings.splice(t,1);break}}null!==o&&""!==o||(o="DataTables_Table_"+DataTable.ext._oExternConfig.iNextUnique++,this.id=o);var i=$.extend(!0,{},DataTable.models.oSettings,{nTable:this,oApi:_that.oApi,oInit:oInit,sDestroyWidth:$(this).width(),sInstance:o,sTableId:o});if(DataTable.settings.push(i),i.oInstance=1===_that.length?_that:$(this).dataTable(),oInit||(oInit={}),oInit.oLanguage&&_fnLanguageCompat(oInit.oLanguage),oInit=_fnExtend($.extend(!0,{},DataTable.defaults),oInit),_fnMap(i.oFeatures,oInit,"bPaginate"),_fnMap(i.oFeatures,oInit,"bLengthChange"),_fnMap(i.oFeatures,oInit,"bFilter"),_fnMap(i.oFeatures,oInit,"bSort"),_fnMap(i.oFeatures,oInit,"bInfo"),_fnMap(i.oFeatures,oInit,"bProcessing"),_fnMap(i.oFeatures,oInit,"bAutoWidth"),_fnMap(i.oFeatures,oInit,"bSortClasses"),_fnMap(i.oFeatures,oInit,"bServerSide"),_fnMap(i.oFeatures,oInit,"bDeferRender"),_fnMap(i.oScroll,oInit,"sScrollX","sX"),_fnMap(i.oScroll,oInit,"sScrollXInner","sXInner"),_fnMap(i.oScroll,oInit,"sScrollY","sY"),_fnMap(i.oScroll,oInit,"bScrollCollapse","bCollapse"),_fnMap(i.oScroll,oInit,"bScrollInfinite","bInfinite"),_fnMap(i.oScroll,oInit,"iScrollLoadGap","iLoadGap"),_fnMap(i.oScroll,oInit,"bScrollAutoCss","bAutoCss"),_fnMap(i,oInit,"asStripeClasses"),_fnMap(i,oInit,"asStripClasses","asStripeClasses"),_fnMap(i,oInit,"fnServerData"),_fnMap(i,oInit,"fnFormatNumber"),_fnMap(i,oInit,"sServerMethod"),_fnMap(i,oInit,"aaSorting"),_fnMap(i,oInit,"aaSortingFixed"),_fnMap(i,oInit,"aLengthMenu"),_fnMap(i,oInit,"sPaginationType"),_fnMap(i,oInit,"sAjaxSource"),_fnMap(i,oInit,"sAjaxDataProp"),_fnMap(i,oInit,"iCookieDuration"),_fnMap(i,oInit,"sCookiePrefix"),_fnMap(i,oInit,"sDom"),_fnMap(i,oInit,"bSortCellsTop"),_fnMap(i,oInit,"iTabIndex"),_fnMap(i,oInit,"oSearch","oPreviousSearch"),_fnMap(i,oInit,"aoSearchCols","aoPreSearchCols"),_fnMap(i,oInit,"iDisplayLength","_iDisplayLength"),_fnMap(i,oInit,"bJQueryUI","bJUI"),_fnMap(i,oInit,"fnCookieCallback"),_fnMap(i,oInit,"fnStateLoad"),_fnMap(i,oInit,"fnStateSave"),_fnMap(i.oLanguage,oInit,"fnInfoCallback"),_fnCallbackReg(i,"aoDrawCallback",oInit.fnDrawCallback,"user"),_fnCallbackReg(i,"aoServerParams",oInit.fnServerParams,"user"),_fnCallbackReg(i,"aoStateSaveParams",oInit.fnStateSaveParams,"user"),_fnCallbackReg(i,"aoStateLoadParams",oInit.fnStateLoadParams,"user"),_fnCallbackReg(i,"aoStateLoaded",oInit.fnStateLoaded,"user"),_fnCallbackReg(i,"aoRowCallback",oInit.fnRowCallback,"user"),_fnCallbackReg(i,"aoRowCreatedCallback",oInit.fnCreatedRow,"user"),_fnCallbackReg(i,"aoHeaderCallback",oInit.fnHeaderCallback,"user"),_fnCallbackReg(i,"aoFooterCallback",oInit.fnFooterCallback,"user"),_fnCallbackReg(i,"aoInitComplete",oInit.fnInitComplete,"user"),_fnCallbackReg(i,"aoPreDrawCallback",oInit.fnPreDrawCallback,"user"),i.oFeatures.bServerSide&&i.oFeatures.bSort&&i.oFeatures.bSortClasses?_fnCallbackReg(i,"aoDrawCallback",_fnSortingClasses,"server_side_sort_classes"):i.oFeatures.bDeferRender&&_fnCallbackReg(i,"aoDrawCallback",_fnSortingClasses,"defer_sort_classes"),oInit.bJQueryUI?($.extend(i.oClasses,DataTable.ext.oJUIClasses),oInit.sDom===DataTable.defaults.sDom&&"lfrtip"===DataTable.defaults.sDom&&(i.sDom='<"H"lfr>t<"F"ip>')):$.extend(i.oClasses,DataTable.ext.oStdClasses),$(this).addClass(i.oClasses.sTable),""===i.oScroll.sX&&""===i.oScroll.sY||(i.oScroll.iBarWidth=_fnScrollBarWidth()),i.iInitDisplayStart===undefined&&(i.iInitDisplayStart=oInit.iDisplayStart,i._iDisplayStart=oInit.iDisplayStart),oInit.bStateSave&&(i.oFeatures.bStateSave=!0,_fnLoadState(i,oInit),_fnCallbackReg(i,"aoDrawCallback",_fnSaveState,"state_save")),null!==oInit.iDeferLoading){i.bDeferLoading=!0;var s=$.isArray(oInit.iDeferLoading);i._iRecordsDisplay=s?oInit.iDeferLoading[0]:oInit.iDeferLoading,i._iRecordsTotal=s?oInit.iDeferLoading[1]:oInit.iDeferLoading}if(null!==oInit.aaData&&(r=!0),""!==oInit.oLanguage.sUrl?(i.oLanguage.sUrl=oInit.oLanguage.sUrl,$.getJSON(i.oLanguage.sUrl,null,function(e){_fnLanguageCompat(e),$.extend(!0,i.oLanguage,oInit.oLanguage,e),_fnInitialise(i)}),l=!0):$.extend(!0,i.oLanguage,oInit.oLanguage),null===oInit.asStripeClasses&&(i.asStripeClasses=[i.oClasses.sStripeOdd,i.oClasses.sStripeEven]),e=i.asStripeClasses.length,i.asDestroyStripes=[],e){var f=!1,d=$(this).children("tbody").children("tr:lt("+e+")");for(t=0;t<e;t++)d.hasClass(i.asStripeClasses[t])&&(f=!0,i.asDestroyStripes.push(i.asStripeClasses[t]));f&&d.removeClass(i.asStripeClasses.join(" "))}var u,c=[],p=this.getElementsByTagName("thead");if(0!==p.length&&(_fnDetectHeader(i.aoHeader,p[0]),c=_fnGetUniqueThs(i)),null===oInit.aoColumns)for(u=[],t=0,e=c.length;t<e;t++)u.push(null);else u=oInit.aoColumns;for(t=0,e=u.length;t<e;t++)oInit.saved_aoColumns!==undefined&&oInit.saved_aoColumns.length==e&&(null===u[t]&&(u[t]={}),u[t].bVisible=oInit.saved_aoColumns[t].bVisible),_fnAddColumn(i,c?c[t]:null);for(_fnApplyColumnDefs(i,oInit.aoColumnDefs,u,function(e,a){_fnColumnOptions(i,e,a)}),t=0,e=i.aaSorting.length;t<e;t++){i.aaSorting[t][0]>=i.aoColumns.length&&(i.aaSorting[t][0]=0);var h=i.aoColumns[i.aaSorting[t][0]];for(i.aaSorting[t][2]===undefined&&(i.aaSorting[t][2]=0),oInit.aaSorting===undefined&&i.saved_aaSorting===undefined&&(i.aaSorting[t][1]=h.asSorting[0]),a=0,n=h.asSorting.length;a<n;a++)if(i.aaSorting[t][1]==h.asSorting[a]){i.aaSorting[t][2]=a;break}}_fnSortingClasses(i),_fnBrowserDetect(i);var g=$(this).children("caption").each(function(){this._captionSide=$(this).css("caption-side")}),_=$(this).children("thead");0===_.length&&(_=[document.createElement("thead")],this.appendChild(_[0])),i.nTHead=_[0];var b=$(this).children("tbody");0===b.length&&(b=[document.createElement("tbody")],this.appendChild(b[0])),i.nTBody=b[0],i.nTBody.setAttribute("role","alert"),i.nTBody.setAttribute("aria-live","polite"),i.nTBody.setAttribute("aria-relevant","all");var S=$(this).children("tfoot");if(0===S.length&&g.length>0&&(""!==i.oScroll.sX||""!==i.oScroll.sY)&&(S=[document.createElement("tfoot")],this.appendChild(S[0])),S.length>0&&(i.nTFoot=S[0],_fnDetectHeader(i.aoFooter,i.nTFoot)),r)for(t=0;t<oInit.aaData.length;t++)_fnAddData(i,oInit.aaData[t]);else _fnGatherData(i);i.aiDisplay=i.aiDisplayMaster.slice(),i.bInitialised=!0,!1===l&&_fnInitialise(i)}else _fnLog(null,0,"Attempted to initialise DataTables on a node which is not a table: "+this.nodeName)}),_that=null,this};DataTable.fnVersionCheck=function(e){for(var a=function(e,a){for(;e.length<a;)e+="0";return e},n=DataTable.ext.sVersion.split("."),t=e.split("."),o="",l="",r=0,i=t.length;r<i;r++)o+=a(n[r],3),l+=a(t[r],3);return parseInt(o,10)>=parseInt(l,10)},DataTable.fnIsDataTable=function(e){for(var a=DataTable.settings,n=0;n<a.length;n++)if(a[n].nTable===e||a[n].nScrollHead===e||a[n].nScrollFoot===e)return!0;return!1},DataTable.fnTables=function(e){var a=[];return jQuery.each(DataTable.settings,function(n,t){(!e||!0===e&&$(t.nTable).is(":visible"))&&a.push(t.nTable)}),a},DataTable.version="1.9.4",DataTable.settings=[],DataTable.models={},DataTable.models.ext={afnFiltering:[],afnSortData:[],aoFeatures:[],aTypes:[],fnVersionCheck:DataTable.fnVersionCheck,iApiIndex:0,ofnSearch:{},oApi:{},oStdClasses:{},oJUIClasses:{},oPagination:{},oSort:{},sVersion:DataTable.version,sErrMode:"alert",_oExternConfig:{iNextUnique:0}},DataTable.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0},DataTable.models.oRow={nTr:null,_aData:[],_aSortData:[],_anHidden:[],_sRowStripe:""},DataTable.models.oColumn={aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bUseRendered:null,bVisible:null,_bAutoType:!0,fnCreatedCell:null,fnGetData:null,fnRender:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null},DataTable.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bJQueryUI:!1,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollAutoCss:!0,bScrollCollapse:!1,bScrollInfinite:!1,bServerSide:!1,bSort:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCookieCallback:null,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(e){if(e<1e3)return e;for(var a=e+"",n=a.split(""),t="",o=a.length,l=0;l<o;l++)l%3==0&&0!==l&&(t=this.oLanguage.sInfoThousands+t),t=n[o-l-1]+t;return t},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:function(e,a,n,t){t.jqXHR=$.ajax({url:e,data:a,success:function(e){e.sError&&t.oApi._fnLog(t,0,e.sError),$(t.oInstance).trigger("xhr",[t,e]),n(e)},dataType:"json",cache:!1,type:t.sServerMethod,error:function(e,a,n){"parsererror"==a&&t.oApi._fnLog(t,0,"DataTables warning: JSON data from server could not be parsed. This is caused by a JSON formatting error.")}})},fnServerParams:null,fnStateLoad:function(oSettings){var sData=this.oApi._fnReadCookie(oSettings.sCookiePrefix+oSettings.sInstance),oData;try{oData="function"==typeof $.parseJSON?$.parseJSON(sData):eval("("+sData+")")}catch(e){oData=null}return oData},fnStateLoadParams:null,fnStateLoaded:null,fnStateSave:function(e,a){this.oApi._fnCreateCookie(e.sCookiePrefix+e.sInstance,this.oApi._fnJsonString(a),e.iCookieDuration,e.sCookiePrefix,e.fnCookieCallback)},fnStateSaveParams:null,iCookieDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iScrollLoadGap:100,iTabIndex:0,oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sInfoThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sUrl:"",sZeroRecords:"No matching records found"},oSearch:$.extend({},DataTable.models.oSearch),sAjaxDataProp:"aaData",sAjaxSource:null,sCookiePrefix:"SpryMedia_DataTables_",sDom:"lfrtip",sPaginationType:"two_button",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET"},DataTable.defaults.columns={aDataSort:null,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bUseRendered:!0,bVisible:!0,fnCreatedCell:null,fnRender:null,iDataSort:-1,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null},DataTable.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortClasses:null,bStateSave:null},oScroll:{bAutoCss:null,bCollapse:null,bInfinite:null,iBarWidth:0,iLoadGap:null,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1},aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aoColumns:[],aoHeader:[],aoFooter:[],asDataSearch:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:null,asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,sPaginationType:"two_button",iCookieDuration:0,sCookiePrefix:"",fnCookieCallback:null,aoStateSave:[],aoStateLoad:[],oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iDisplayEnd:10,_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsTotal,10):this.aiDisplayMaster.length},fnRecordsDisplay:function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsDisplay,10):this.aiDisplay.length},fnDisplayEnd:function(){return this.oFeatures.bServerSide?!1===this.oFeatures.bPaginate||-1==this._iDisplayLength?this._iDisplayStart+this.aiDisplay.length:Math.min(this._iDisplayStart+this._iDisplayLength,this._iRecordsDisplay):this._iDisplayEnd},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null},DataTable.ext=$.extend(!0,{},DataTable.models.ext),$.extend(DataTable.ext.oStdClasses,{sTable:"dataTable",sPagePrevEnabled:"paginate_enabled_previous",sPagePrevDisabled:"paginate_disabled_previous",sPageNextEnabled:"paginate_enabled_next",sPageNextDisabled:"paginate_disabled_next",sPageJUINext:"",sPageJUIPrev:"",sPageButton:"paginate_button",sPageButtonActive:"paginate_active",sPageButtonStaticDisabled:"paginate_button paginate_button_disabled",sPageFirst:"first",sPagePrevious:"previous",sPageNext:"next",sPageLast:"last",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sFooterTH:"",sJUIHeader:"",sJUIFooter:""}),$.extend(DataTable.ext.oJUIClasses,DataTable.ext.oStdClasses,{sPagePrevEnabled:"fg-button ui-button ui-state-default ui-corner-left",sPagePrevDisabled:"fg-button ui-button ui-state-default ui-corner-left ui-state-disabled",sPageNextEnabled:"fg-button ui-button ui-state-default ui-corner-right",sPageNextDisabled:"fg-button ui-button ui-state-default ui-corner-right ui-state-disabled",sPageJUINext:"ui-icon ui-icon-circle-arrow-e",sPageJUIPrev:"ui-icon ui-icon-circle-arrow-w",sPageButton:"fg-button ui-button ui-state-default",sPageButtonActive:"fg-button ui-button ui-state-default ui-state-disabled",sPageButtonStaticDisabled:"fg-button ui-button ui-state-default ui-state-disabled",sPageFirst:"first ui-corner-tl ui-corner-bl",sPageLast:"last ui-corner-tr ui-corner-br",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",sSortAsc:"ui-state-default",sSortDesc:"ui-state-default",sSortable:"ui-state-default",sSortableAsc:"ui-state-default",sSortableDesc:"ui-state-default",sSortableNone:"ui-state-default",sSortJUIAsc:"css_right ui-icon ui-icon-triangle-1-n",sSortJUIDesc:"css_right ui-icon ui-icon-triangle-1-s",sSortJUI:"css_right ui-icon ui-icon-carat-2-n-s",sSortJUIAscAllowed:"css_right ui-icon ui-icon-carat-1-n",sSortJUIDescAllowed:"css_right ui-icon ui-icon-carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",sScrollHead:"dataTables_scrollHead ui-state-default",sScrollFoot:"dataTables_scrollFoot ui-state-default",sFooterTH:"ui-state-default",sJUIHeader:"fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix",sJUIFooter:"fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix"}),$.extend(DataTable.ext.oPagination,{two_button:{fnInit:function(e,a,n){var t=e.oLanguage.oPaginate,o=(e.oClasses,function(a){e.oApi._fnPageChange(e,a.data.action)&&n(e)}),l=e.bJUI?'<a class="'+e.oClasses.sPagePrevDisabled+'" tabindex="'+e.iTabIndex+'" role="button"><span class="'+e.oClasses.sPageJUIPrev+'"></span></a><a class="'+e.oClasses.sPageNextDisabled+'" tabindex="'+e.iTabIndex+'" role="button"><span class="'+e.oClasses.sPageJUINext+'"></span></a>':'<a class="'+e.oClasses.sPagePrevDisabled+'" tabindex="'+e.iTabIndex+'" role="button">'+t.sPrevious+'</a><a class="'+e.oClasses.sPageNextDisabled+'" tabindex="'+e.iTabIndex+'" role="button">'+t.sNext+"</a>";$(a).append(l);var r=$("a",a),i=r[0],s=r[1];e.oApi._fnBindAction(i,{action:"previous"},o),e.oApi._fnBindAction(s,{action:"next"},o),e.aanFeatures.p||(a.id=e.sTableId+"_paginate",i.id=e.sTableId+"_previous",s.id=e.sTableId+"_next",i.setAttribute("aria-controls",e.sTableId),s.setAttribute("aria-controls",e.sTableId))},fnUpdate:function(e,a){if(e.aanFeatures.p)for(var n,t=e.oClasses,o=e.aanFeatures.p,l=0,r=o.length;l<r;l++)(n=o[l].firstChild)&&(n.className=0===e._iDisplayStart?t.sPagePrevDisabled:t.sPagePrevEnabled,(n=n.nextSibling).className=e.fnDisplayEnd()==e.fnRecordsDisplay()?t.sPageNextDisabled:t.sPageNextEnabled)}},iFullNumbersShowPages:5,full_numbers:{fnInit:function(e,a,n){var t=e.oLanguage.oPaginate,o=e.oClasses,l=function(a){e.oApi._fnPageChange(e,a.data.action)&&n(e)};$(a).append('<a  tabindex="'+e.iTabIndex+'" class="'+o.sPageButton+" "+o.sPageFirst+'">'+t.sFirst+'</a><a  tabindex="'+e.iTabIndex+'" class="'+o.sPageButton+" "+o.sPagePrevious+'">'+t.sPrevious+'</a><span></span><a tabindex="'+e.iTabIndex+'" class="'+o.sPageButton+" "+o.sPageNext+'">'+t.sNext+'</a><a tabindex="'+e.iTabIndex+'" class="'+o.sPageButton+" "+o.sPageLast+'">'+t.sLast+"</a>");var r=$("a",a),i=r[0],s=r[1],f=r[2],d=r[3];e.oApi._fnBindAction(i,{action:"first"},l),e.oApi._fnBindAction(s,{action:"previous"},l),e.oApi._fnBindAction(f,{action:"next"},l),e.oApi._fnBindAction(d,{action:"last"},l),e.aanFeatures.p||(a.id=e.sTableId+"_paginate",i.id=e.sTableId+"_first",s.id=e.sTableId+"_previous",f.id=e.sTableId+"_next",d.id=e.sTableId+"_last")},fnUpdate:function(e,a){if(e.aanFeatures.p){var n,t,o,l,r,i,s,f=DataTable.ext.oPagination.iFullNumbersShowPages,d=Math.floor(f/2),u=Math.ceil(e.fnRecordsDisplay()/e._iDisplayLength),c=Math.ceil(e._iDisplayStart/e._iDisplayLength)+1,p="",h=e.oClasses,g=e.aanFeatures.p,_=function(t){e.oApi._fnBindAction(this,{page:t+n-1},function(n){e.oApi._fnPageChange(e,n.data.page),a(e),n.preventDefault()})};for(-1===e._iDisplayLength?(n=1,t=1,c=1):u<f?(n=1,t=u):c<=d?(n=1,t=f):c>=u-d?(n=u-f+1,t=u):t=(n=c-Math.ceil(f/2)+1)+f-1,o=n;o<=t;o++)p+=c!==o?'<a tabindex="'+e.iTabIndex+'" class="'+h.sPageButton+'">'+e.fnFormatNumber(o)+"</a>":'<a tabindex="'+e.iTabIndex+'" class="'+h.sPageButtonActive+'">'+e.fnFormatNumber(o)+"</a>";for(o=0,l=g.length;o<l;o++)(s=g[o]).hasChildNodes()&&($("span:eq(0)",s).html(p).children("a").each(_),i=[(r=s.getElementsByTagName("a"))[0],r[1],r[r.length-2],r[r.length-1]],$(i).removeClass(h.sPageButton+" "+h.sPageButtonActive+" "+h.sPageButtonStaticDisabled),$([i[0],i[1]]).addClass(1==c?h.sPageButtonStaticDisabled:h.sPageButton),$([i[2],i[3]]).addClass(0===u||c===u||-1===e._iDisplayLength?h.sPageButtonStaticDisabled:h.sPageButton))}}}}),$.extend(DataTable.ext.oSort,{"string-pre":function(e){return"string"!=typeof e&&(e=null!==e&&e.toString?e.toString():""),e.toLowerCase()},"string-asc":function(e,a){return e<a?-1:e>a?1:0},"string-desc":function(e,a){return e<a?1:e>a?-1:0},"html-pre":function(e){return e.replace(/<.*?>/g,"").toLowerCase()},"html-asc":function(e,a){return e<a?-1:e>a?1:0},"html-desc":function(e,a){return e<a?1:e>a?-1:0},"date-pre":function(e){var a=Date.parse(e);return(isNaN(a)||""===a)&&(a=Date.parse("01/01/1970 00:00:00")),a},"date-asc":function(e,a){return e-a},"date-desc":function(e,a){return a-e},"numeric-pre":function(e){return"-"==e||""===e?0:1*e},"numeric-asc":function(e,a){return e-a},"numeric-desc":function(e,a){return a-e}}),$.extend(DataTable.ext.aTypes,[function(e){if("number"==typeof e)return"numeric";if("string"!=typeof e)return null;var a,n=!1;if(a=e.charAt(0),-1=="0123456789-".indexOf(a))return null;for(var t=1;t<e.length;t++){if(a=e.charAt(t),-1=="0123456789.".indexOf(a))return null;if("."==a){if(n)return null;n=!0}}return"numeric"},function(e){var a=Date.parse(e);return null!==a&&!isNaN(a)||"string"==typeof e&&0===e.length?"date":null},function(e){return"string"==typeof e&&-1!=e.indexOf("<")&&-1!=e.indexOf(">")?"html":null}]),$.fn.DataTable=DataTable,$.fn.dataTable=DataTable,$.fn.dataTableSettings=DataTable.settings,$.fn.dataTableExt=DataTable.ext})}(window,document);

!function(e){function a(e){return Math.ceil(e._iDisplayStart/e._iDisplayLength)+1}function t(e){return Math.ceil(e.fnRecordsDisplay()/e._iDisplayLength)}var n="first",i="previous prev btn btn-sm default",s="next next btn btn-sm default",l="last",u="paginate_of",o="";e.fn.dataTableExt.oPagination.input={fnInit:function(r,p,c){var d=document.createElement("span"),g=document.createElement("span"),h=document.createElement("span"),f=document.createElement("span"),m=document.createElement("input"),v=document.createElement("span"),b=document.createElement("span"),_=r.oLanguage.oPaginate,P=r.oClasses;if(d.innerHTML=_.sFirst,g.innerHTML=_.sPrevious,h.innerHTML=_.sNext,f.innerHTML=_.sLast,o=r.oLanguage.oPaginate.of,void 0!=r.oLanguage.oPaginate.page&&null!=r.oLanguage.oPaginate.page&&""!=r.oLanguage.oPaginate.page)var C=r.oLanguage.oPaginate.page;else C="Page";if(d.className=n+" "+P.sPageButton,g.className=i+" "+P.sPageButton,h.className=s+" "+P.sPageButton,f.className=l+" "+P.sPageButton,b.className=u,v.className="paginate_page",m.className="paginate_input form-control input-mini input-inline input-sm",""!==r.sTableId&&(p.setAttribute("id",r.sTableId+"_paginate"),d.setAttribute("id",r.sTableId+"_"+n),g.setAttribute("id",r.sTableId+"_"+i),h.setAttribute("id",r.sTableId+"_"+s),f.setAttribute("id",r.sTableId+"_"+l)),m.type="text",v.innerHTML=C+" ",p.appendChild(v),p.appendChild(g),p.appendChild(m),p.appendChild(h),p.appendChild(b),e(p).find("input").val(1),e(d).click(function(){var t=a(r);e(p).find("input").val(t),1!==t&&(r.oApi._fnPageChange(r,"first"),c(r))}),e(g).click(function(){1!==a(r)&&(r.oApi._fnPageChange(r,"previous"),c(r))}),e(h).click(function(){a(r)!==t(r)&&(r.oApi._fnPageChange(r,"next"),c(r))}),e(f).click(function(){a(r)!==t(r)&&(r.oApi._fnPageChange(r,"last"),c(r))}),e(m).keyup(function(e){if(38===e.which||39===e.which?this.value++:(37===e.which||40===e.which)&&this.value>1&&this.value--,""===this.value||this.value.match(/[^0-9]/))this.value=this.value.replace(/[^\d]/g,"");else{var a=r._iDisplayLength*(this.value-1);a<0&&(a=0),a>=r.fnRecordsDisplay()&&(a=(Math.ceil(r.fnRecordsDisplay()/r._iDisplayLength)-1)*r._iDisplayLength),r._iDisplayStart=a,c(r)}}),e("span",p).bind("mousedown",function(){return!1}),e("span",p).bind("selectstart",function(){return!1}),t(r)<=1){e(p).hide();var L=e(p).attr("id");e("#"+L).next().hide()}},fnUpdate:function(n){if(n.aanFeatures.p){var l=t(n),r=a(n),p=n.aanFeatures.p;if(l<=1)return e(p).hide(),void e(p).next().hide();var c,d,g,h,f,m,v,b,_,P=(d=(c=n)._iDisplayStart,g=c._iDisplayLength,h=c.fnRecordsDisplay(),m=(f=-1===g)?0:Math.ceil(d/g),v=f?1:Math.ceil(h/g),b=m>0?"":c.oClasses.sPageButtonDisabled,_=m<v-1?"":c.oClasses.sPageButtonDisabled,{first:b,previous:b,next:_,last:_});e(p).show(),e(p).children("."+i).removeClass(n.oClasses.sPageButtonDisabled).addClass(P[i]),e(p).children("."+s).removeClass(n.oClasses.sPageButtonDisabled).addClass(P[s]),e(p).children("."+u).html(" "+o+" "+l+" |"),e(p).children(".paginate_input").val(r)}}}}(jQuery);

$.extend(!0,$.fn.dataTable.defaults,{sDom:"<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",sPaginationType:"bootstrap",oLanguage:{sLengthMenu:"_MENU_ records per page"}}),$.extend($.fn.dataTableExt.oStdClasses,{sWrapper:"dataTables_wrapper form-inline"}),$.fn.dataTableExt.oApi.fnPagingInfo=function(a){return{iStart:a._iDisplayStart,iEnd:a.fnDisplayEnd(),iLength:a._iDisplayLength,iTotal:a.fnRecordsTotal(),iFilteredTotal:a.fnRecordsDisplay(),iPage:Math.ceil(a._iDisplayStart/a._iDisplayLength),iTotalPages:Math.ceil(a.fnRecordsDisplay()/a._iDisplayLength)}},$.extend($.fn.dataTableExt.oPagination,{bootstrap:{fnInit:function(a,e,i){var n=a.oLanguage.oPaginate,t=function(e){e.preventDefault(),a.oApi._fnPageChange(a,e.data.action)&&i(a)};$(e).addClass("pagination").append('<ul><li class="prev disabled"><a href="#">&larr; <span class="hidden-480">'+n.sPrevious+'</span></a></li><li class="next disabled"><a href="#"><span class="hidden-480">'+n.sNext+"</span> &rarr; </a></li></ul>");var l=$("a",e);$(l[0]).bind("click.DT",{action:"previous"},t),$(l[1]).bind("click.DT",{action:"next"},t)},fnUpdate:function(a,e){var i,n,t,l,s,o=a.oInstance.fnPagingInfo(),r=a.aanFeatures.p,d=Math.floor(2.5);for(o.iTotalPages<5?(l=1,s=o.iTotalPages):o.iPage<=d?(l=1,s=5):o.iPage>=o.iTotalPages-d?(l=o.iTotalPages-5+1,s=o.iTotalPages):s=(l=o.iPage-d+1)+5-1,i=0,iLen=r.length;i<iLen;i++){for($("li:gt(0)",r[i]).filter(":not(:last)").remove(),n=l;n<=s;n++)t=n==o.iPage+1?'class="active"':"",$("<li "+t+'><a href="#">'+n+"</a></li>").insertBefore($("li:last",r[i])[0]).bind("click",function(i){i.preventDefault(),a._iDisplayStart=(parseInt($("a",this).text(),10)-1)*o.iLength,e(a)});0===o.iPage?$("li:first",r[i]).addClass("disabled"):$("li:first",r[i]).removeClass("disabled"),o.iPage===o.iTotalPages-1||0===o.iTotalPages?$("li:last",r[i]).addClass("disabled"):$("li:last",r[i]).removeClass("disabled")}}}}),$.fn.DataTable.TableTools&&($.extend(!0,$.fn.DataTable.TableTools.classes,{container:"DTTT btn-group",buttons:{normal:"btn",disabled:"disabled"},collection:{container:"DTTT_dropdown dropdown-menu",buttons:{normal:"",disabled:"disabled"}},print:{info:"DTTT_print_info modal"},select:{row:"active"}}),$.extend(!0,$.fn.DataTable.TableTools.DEFAULTS.oTags,{collection:{container:"ul",button:"li",liner:"a"}}));

if($("ASSET_URL").length)
var ASSET_URL = document.getElementById("ASSET_URL").value;
if(ASSET_URL == '' || ASSET_URL == undefined || ASSET_URL == ''){
    ASSET_URL = '/app/webroot/';
}

var App = function () {

    // IE mode
    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;

    var sidebarWidth = 225;
    var sidebarCollapsedWidth = 35;

    var responsiveHandlers = [];

    // theme layout color set
    var layoutColorCodes = {
        'blue': '#4b8df8',
        'red': '#e02222',
        'green': '#35aa47',
        'purple': '#852b99',
        'grey': '#555555',
        'light-grey': '#fafafa',
        'yellow': '#ffb848'
    };

    // last popep popover
    var lastPopedPopover;

    var handleInit = function() {

        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !! navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !! navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !! navigator.userAgent.match(/MSIE 10.0/);
        
        if (isIE10) {
            jQuery('html').addClass('ie10'); // detect IE10 version
        }

      }

    var handleDesktopTabletContents = function () {
        // loops all page elements with "responsive" class and applies classes for tablet mode
        // For Metronic  1280px or less set as tablet mode to display the content properly
        if ($(window).width() <= 1280 || $('body').hasClass('page-boxed')) {
            $(".responsive").each(function () {
                var forTablet = $(this).attr('data-tablet');
                var forDesktop = $(this).attr('data-desktop');
                if (forTablet) {
                    $(this).removeClass(forDesktop);
                    $(this).addClass(forTablet);
                }
            });
        }

        // loops all page elements with "responsive" class and applied classes for desktop mode
        // For Metronic  higher 1280px set as desktop mode to display the content properly
        if ($(window).width() > 1280 && $('body').hasClass('page-boxed') === false) {
            $(".responsive").each(function () {
                var forTablet = $(this).attr('data-tablet');
                var forDesktop = $(this).attr('data-desktop');
                if (forTablet) {
                    $(this).removeClass(forTablet);
                    $(this).addClass(forDesktop);
                }
            });
        }
    }

    var handleSidebarState = function () {
        // remove sidebar toggler if window width smaller than 900(for table and phone mode)
        if ($(window).width() < 980) {
            $('body').removeClass("page-sidebar-closed");
        }
    }

    var runResponsiveHandlers = function () {
        // reinitialize other subscribed elements
        for (var i in responsiveHandlers) {
            var each = responsiveHandlers[i];
            each.call();
        }
    }

    var handleResponsive = function () {
        handleTooltips();
        handleSidebarState();
        handleDesktopTabletContents();
        handleSidebarAndContentHeight();
        handleChoosenSelect();
        handleFixedSidebar();
        runResponsiveHandlers();
    }

    var handleResponsiveOnInit = function () {
        handleSidebarState();
        handleDesktopTabletContents();
        handleSidebarAndContentHeight();
    }

    var handleResponsiveOnResize = function () {
        var resize;
        if (isIE8) {
            var currheight;
            $(window).resize(function() {
                if(currheight == document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }                
                if (resize) {
                    clearTimeout(resize);
                }   
                resize = setTimeout(function() {
                    handleResponsive();    
                }, 50); // wait 50ms until window resize finishes.                
                currheight = document.documentElement.clientHeight; // store last body client height
            });
        } else {
            $(window).resize(function() {
                if (resize) {
                    clearTimeout(resize);
                }   
                resize = setTimeout(function() {
                    handleResponsive();    
                }, 50); // wait 50ms until window resize finishes.
            });
        }   
    }

    //* BEGIN:CORE HANDLERS *//
    // this function handles responsive layout on screen size resize or mobile device rotate.
  
    var handleSidebarAndContentHeight = function () {
        var content = $('.page-content');
        var sidebar = $('.page-sidebar');
        var body = $('body');
        var height;

        if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
            var available_height = $(window).height() - $('.footer').height();
            if (content.height() <  available_height) {
                content.attr('style', 'min-height:' + available_height + 'px !important');
            }
        } else {
            if (body.hasClass('page-sidebar-fixed')) {
                height = _calculateFixedSidebarViewportHeight();
            } else {
                height = sidebar.height() + 20;
            }
            if (height >= content.height()) {
                content.attr('style', 'min-height:' + height + 'px !important');
            } 
        }          
    }
    $('.ss_sidebar_toggler').on('click', function (e) {         
        var body = $('body');
        var sidebar = $('.page-sidebar');
        
        setTimeout("reArrangeCalendarWidth();",10);
            
        if($('div.nav-collapse').css('height')=='0px'){
            console.log('insasas');
            $('div.nav-collapse').addClass('in');
            $('div.nav-collapse').css('height','auto');
            $('div.nav-collapse ul').css('height','auto');
            $('div.nav-collapse ul').css('display','block');
            setTimeout(function(){
                $('div.nav-collapse ul.sub-menu').css('display','none');
            $('div.nav-collapse li.active').css('display','block');
            $('div.nav-collapse li.active').addClass('open');
            $('div.nav-collapse li.active ul').show();
               $('.ss-page-logo').show();
           
            },10);
            
            
          
             return;
        }
        if($('div.nav-collapse').hasClass('in')){
            $('div.nav-collapse').removeClass('in');
            $('div.nav-collapse').css('height','0');
            $('div.nav-collapse ul').css('height','0');
            $('div.nav-collapse ul.sub-menu').css('display','none');
            return;
        }


        if ((body.hasClass("page-sidebar-hover-on") && body.hasClass('page-sidebar-fixed')) || sidebar.hasClass('page-sidebar-hovering')) {
            body.removeClass('page-sidebar-hover-on');
            sidebar.css('width', '').hide().show();
            e.stopPropagation();
            runResponsiveHandlers();
            return;
        }

        $(".sidebar-search", sidebar).removeClass("open");

        if (body.hasClass("page-sidebar-closed")) {
            body.removeClass("page-sidebar-closed");
            if (body.hasClass('page-sidebar-fixed')) {
                sidebar.css('width', '');
            }


           
        } else {
            body.addClass("page-sidebar-closed");
        }
        if (body.hasClass("page-sidebar-closed")) {
            $('.ss-page-logo').hide();
           
            $('div.ss_sidebar_toggler').css('margin','18px 0px 0px -7px');
            $('div.ss_sidebar_toggler').css('padding-right','7px');
           // $('.ss-page-logo').css('width','15px');
        }
        else{
             $('.ss-page-logo').show();
             $('div.ss_sidebar_toggler').css('margin','18px 0 0 13px');
             $('div.ss_sidebar_toggler').css('padding-right','14px');
            //$('.ss-page-logo').css('width','204px');
        }
        runResponsiveHandlers();
    });

    var handleSidebarMenu = function () {
        jQuery('.page-sidebar').on('click', 'li > a', function (e) {
        		
        	


                if ($(this).next().hasClass('sub-menu') == false) {
                    if ($('.btn-navbar').hasClass('collapsed') == false) {
                       //$('.btn-navbar').click();
                    }
                   return;
                }
                
                

                var parent = $(this).parent().parent();
                var the = $(this);

                parent.children('li.open').children('a').children('.arrow').removeClass('open');
                parent.children('li.open').children('.sub-menu').slideUp(200);
                parent.children('li.open').removeClass('open');

                var sub = jQuery(this).next();
                var slideOffeset = -200;
                var slideSpeed = 200;

                if (sub.is(":visible")) {
                    jQuery('.arrow', jQuery(this)).removeClass("open");
                    jQuery(this).parent().removeClass("open");
                    sub.slideUp(slideSpeed, function () {
                        if ($('body').hasClass('page-sidebar-fixed') == false && $('body').hasClass('page-sidebar-closed') == false) {
                            App.scrollTo(the, slideOffeset);
                        }                       
                        handleSidebarAndContentHeight();
                    });
                } else {
                    jQuery('.arrow', jQuery(this)).addClass("open");
                    jQuery(this).parent().addClass("open");
                    sub.slideDown(slideSpeed, function () {
                        if ($('body').hasClass('page-sidebar-fixed') == false && $('body').hasClass('page-sidebar-closed') == false) {
                            App.scrollTo(the, slideOffeset);
                        }
                        handleSidebarAndContentHeight();
                    });

	        		if($(this).parent().attr('id') == 'boat_storage'){
	                	if(!$(this).next().find('a:first').parent().hasClass('open')){
	                		$(this).next().find('a:first').click();	
	                		$(this).next().find('a:first').next().find('li#boat_scheduling').find('a').click();	
	                	}
	                }
                }


                e.preventDefault();
            });

        // handle ajax links
        jQuery('.page-sidebar').on('click', ' li > a.ajaxify', function (e) {
                e.preventDefault();
                App.scrollTop();

                var url = $(this).attr("href");
                var menuContainer = jQuery('.page-sidebar ul');
                var pageContent = $('.page-content');
                var pageContentBody = $('.page-content .page-content-body');

                menuContainer.children('li.active').removeClass('active');
                menuContainer.children('arrow.open').removeClass('open');

                $(this).parents('li').each(function () {
                        $(this).addClass('active');
                        $(this).children('a > span.arrow').addClass('open');
                    });
                $(this).parents('li').addClass('active');

                App.blockUI(pageContent, false);

                $.ajax({
                    type: "GET",
                    cache: false,
                    url: url,
                    dataType: "html",
                    success: function(res) 
                    {
                        App.unblockUI(pageContent);
                        pageContentBody.html(res);
                        App.fixContentHeight(); // fix content height
                        App.initUniform(); // initialize uniform elements
                    },
                    error: function(xhr, ajaxOptions, thrownError)
                    {
                        pageContentBody.html('<h4>Could not load the requested content.</h4>');
                        App.unblockUI(pageContent);
                    },
                    async: false
                });
        });
    }

    var _calculateFixedSidebarViewportHeight = function () {
        var sidebarHeight = $(window).height() - $('.header').height() + 1;
        if ($('body').hasClass("page-footer-fixed")) {
            sidebarHeight = sidebarHeight - $('.footer').height();
        }

        return sidebarHeight; 
    }

    var handleFixedSidebar = function () {
        var menu = $('.page-sidebar-menu');

        if (menu.parent('.slimScrollDiv').size() === 1) { // destroy existing instance before updating the height
            menu.slimScroll({
                destroy: true
            });
            menu.removeAttr('style');
            $('.page-sidebar').removeAttr('style');            
        }

        if ($('.page-sidebar-fixed').size() === 0) {
            handleSidebarAndContentHeight();
            return;
        }

        if ($(window).width() >= 980) {
            var sidebarHeight = _calculateFixedSidebarViewportHeight();

            menu.slimScroll({
                size: '7px',
                color: '#a1b2bd',
                opacity: .3,
                position: isRTL ? 'left' : ($('.page-sidebar-on-right').size() === 1 ? 'left' : 'right'),
                height: sidebarHeight,
                allowPageScroll: false,
                disableFadeOut: false
            });
            handleSidebarAndContentHeight();
        }
    }

    var handleFixedSidebarHoverable = function () {
        if ($('body').hasClass('page-sidebar-fixed') === false) {
            return;
        }

        $('.page-sidebar').off('mouseenter').on('mouseenter', function () {
            var body = $('body');

            if ((body.hasClass('page-sidebar-closed') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
                return;
            }

            body.removeClass('page-sidebar-closed').addClass('page-sidebar-hover-on');
            $(this).addClass('page-sidebar-hovering');                
            $(this).animate({
                width: sidebarWidth
            }, 400, '', function () {
                $(this).removeClass('page-sidebar-hovering');
            });
        });

        $('.page-sidebar').off('mouseleave').on('mouseleave', function () {
            var body = $('body');

            if ((body.hasClass('page-sidebar-hover-on') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
                return;
            }

            $(this).addClass('page-sidebar-hovering');
            $(this).animate({
                width: sidebarCollapsedWidth
            }, 400, '', function () {
                $('body').addClass('page-sidebar-closed').removeClass('page-sidebar-hover-on');
                $(this).removeClass('page-sidebar-hovering');
            });
        });
    }

    var handleSidebarToggler = function () {
        // handle sidebar show/hide
        $('.page-sidebar').on('click', '.sidebar-toggler', function (e) {         
            var body = $('body');
            var sidebar = $('.page-sidebar');
            
            setTimeout("reArrangeCalendarWidth();",10);
            
            if ((body.hasClass("page-sidebar-hover-on") && body.hasClass('page-sidebar-fixed')) || sidebar.hasClass('page-sidebar-hovering')) {
                body.removeClass('page-sidebar-hover-on');
                sidebar.css('width', '').hide().show();
                e.stopPropagation();
                runResponsiveHandlers();
                return;
            }

            $(".sidebar-search", sidebar).removeClass("open");

            if (body.hasClass("page-sidebar-closed")) {
                body.removeClass("page-sidebar-closed");
                if (body.hasClass('page-sidebar-fixed')) {
                    sidebar.css('width', '');
                }
            } else {
                body.addClass("page-sidebar-closed");
            }
            runResponsiveHandlers();
        });

        // handle the search bar close
        $('.page-sidebar').on('click', '.sidebar-search .remove', function (e) {
            e.preventDefault();
            $('.sidebar-search').removeClass("open");
        });

        // handle the search query submit on enter press
        $('.page-sidebar').on('keypress', '.sidebar-search input', function (e) {
            if (e.which == 13) {
               // window.location.href = "extra_search.html";
                //return false; //<---- Add this line
            }
        });

        // handle the search submit
        $('.sidebar-search .submit').on('click', function (e) {
            e.preventDefault();
          
                if ($('body').hasClass("page-sidebar-closed")) {
                    if ($('.sidebar-search').hasClass('open') == false) {
                        if ($('.page-sidebar-fixed').size() === 1) {
                            $('.page-sidebar .sidebar-toggler').click(); //trigger sidebar toggle button
                        }
                        $('.sidebar-search').addClass("open");
                    } else {
                        //window.location.href = "extra_search.html";
                    }
                } else {
                    //window.location.href = "extra_search.html";
            }
        });
    }

    var handleHorizontalMenu = function () {
        //handle hor menu search form toggler click
        $('.header').on('click', '.hor-menu .hor-menu-search-form-toggler', function (e) {
                if ($(this).hasClass('hide')) {
                    $(this).removeClass('hide');
                    $('.header .hor-menu .search-form').hide();
                } else {
                    $(this).addClass('hide');
                    $('.header .hor-menu .search-form').show();
                }
                e.preventDefault();
            });

        //handle hor menu search button click
        $('.header').on('click', '.hor-menu .search-form .btn', function (e) {
                window.location.href = "extra_search.html";
                e.preventDefault();
            });

        //handle hor menu search form on enter press
        $('.header').on('keypress', '.hor-menu .search-form input', function (e) {
                if (e.which == 13) {
                    //window.location.href = "extra_search.html";
                   // return false;
                }
            });
    }

    var handleGoTop = function () {
        /* set variables locally for increased performance */
        jQuery('.footer').on('click', '.go-top', function (e) {
            App.scrollTo();
            e.preventDefault();
        });
    }

    var handlePortletTools = function () {
        jQuery('body').on('click', '.portlet > .portlet-title > .tools > a.remove', function (e) {
            e.preventDefault();
            jQuery(this).closest(".portlet").remove();
        });

        jQuery('body').on('click', '.portlet > .portlet-title > .tools > a.reload', function (e) {
            e.preventDefault();
            var el = jQuery(this).closest(".portlet").children(".portlet-body");
            App.blockUI(el);
            window.setTimeout(function () {
                App.unblockUI(el);
            }, 1000);
        });

        jQuery('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function (e) {
            e.preventDefault();
            var el = jQuery(this).closest(".portlet").children(".portlet-body");
            if (jQuery(this).hasClass("collapse")) {
                jQuery(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
            } else {
                jQuery(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
            }
        });
    }

    var handleUniform = function () {
        if (!jQuery().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
        if (test.size() > 0) {
            test.each(function () {
                if ($(this).parents(".checker").size() == 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    }

    var handleAccordions = function () {
        $(".accordion").collapse().height('auto');
        var lastClicked;
        //add scrollable class name if you need scrollable panes
        jQuery('body').on('click', '.accordion.scrollable .accordion-toggle', function () {
            lastClicked = jQuery(this);
        }); //move to faq section

        jQuery('body').on('shown', '.accordion.scrollable', function () {
            jQuery('html,body').animate({
                scrollTop: lastClicked.offset().top - 150
            }, 'slow');
        });
    }

    var handleTabs = function () {

        // function to fix left/right tab contents
        var fixTabHeight = function(tab) {
            $(tab).each(function() {
                var content = $($($(this).attr("href")));
                var tab = $(this).parent().parent();
                if (tab.height() > content.height()) {
                    content.css('min-height', tab.height());    
                } 
            });            
        }

        // fix tab content on tab shown
        $('body').on('shown', '.nav.nav-tabs.tabs-left a[data-toggle="tab"], .nav.nav-tabs.tabs-right a[data-toggle="tab"]', function(){
            fixTabHeight($(this)); 
        });

        $('body').on('shown', '.nav.nav-tabs', function(){
            handleSidebarAndContentHeight();
        });

        //fix tab contents for left/right tabs
        fixTabHeight('.nav.nav-tabs.tabs-left > li.active > a[data-toggle="tab"], .nav.nav-tabs.tabs-right > li.active > a[data-toggle="tab"]');

        //activate tab if tab id provided in the URL
        if(location.hash) {
            var tabid = location.hash.substr(1);
            $('a[href="#'+tabid+'"]').click();
        }
    }

    var handleScrollers = function () {
        $('.scroller').each(function () {
                var height;
                if ($(this).attr("data-height")) {
                    height = $(this).attr("data-height");
                } else {
                    height = $(this).css('height');
                }
                $(this).slimScroll({
                        size: '7px',
                        color: '#a1b2bd',
                        position: isRTL ? 'left' : 'right',
                        height:  height,
                        alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                        railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                        disableFadeOut: true
                    });
            });
    }

    var handleTooltips = function () {
        if (App.isTouchDevice()) { // if touch device, some tooltips can be skipped in order to not conflict with click events
            jQuery('.tooltips:not(.no-tooltip-on-touch-device)').tooltip();
        } else {
            jQuery('.tooltips').tooltip();
        }
    }

    var handleDropdowns = function () {
        $('body').on('click', '.dropdown-menu.hold-on-click', function(e){
            e.stopPropagation();
        })
    }

    var handleModal = function () {
        // this function adds .modal-open class to body element for select2 and chosen dropdown hacks
        if (jQuery().modalmanager) {
            return; // skip if Extended Modal plugin is used
        }

        $('body').on('shown', '.modal', function(e){
            $('body').addClass('modal-open');
        });

        $('body').on('hidden', '.modal', function(e){
            if ($('.modal').size() === 0) {
                $('body').removeClass('modal-open');
            }
        });
    }

    var handlePopovers = function () {
        jQuery('.popovers').popover();

        // close last poped popover

        $(document).on('click.popover.data-api',function(e) {
            if(lastPopedPopover){
                lastPopedPopover.popover('hide');
            } 
        });
    }

    var handleChoosenSelect = function () {
        if (!jQuery().chosen) {
            return;
        }

        $(".chosen").each(function () {
            $(this).chosen({
                allow_single_deselect: $(this).attr("data-with-deselect") == "1" ? true : false
            });
        });
    }

    var handleFancybox = function () {
        if (!jQuery.fancybox) {
            return;
        }

        if (jQuery(".fancybox-button").size() > 0) {
            jQuery(".fancybox-button").fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
    }

    var handleTheme = function () {

        var panel = $('.color-panel');

        if ($('body').hasClass('page-boxed') == false) {
            $('.layout-option', panel).val("fluid");
        }
        
        $('.sidebar-option', panel).val("default");
        $('.header-option', panel).val("fixed");
        $('.footer-option', panel).val("default"); 

        //handle theme layout
        var resetLayout = function () {
            $("body").
                removeClass("page-boxed").
                removeClass("page-footer-fixed").
                removeClass("page-sidebar-fixed").
                removeClass("page-header-fixed");

            $('.header > .navbar-inner > .container').removeClass("container").addClass("container-fluid");

            if ($('.page-container').parent(".container").size() === 1) {
                $('.page-container').insertAfter('.header');
            } 

            if ($('.footer > .container').size() === 1) {                        
                $('.footer').html($('.footer > .container').html());                        
            } else if ($('.footer').parent(".container").size() === 1) {                        
                $('.footer').insertAfter('.page-container');
            }

            $('body > .container').remove(); 
        }

        var lastSelectedLayout = '';

        var setLayout = function () {

            var layoutOption = $('.layout-option', panel).val();
            var sidebarOption = $('.sidebar-option', panel).val();
            var headerOption = $('.header-option', panel).val();
            var footerOption = $('.footer-option', panel).val(); 

            if (sidebarOption == "fixed" && headerOption == "default") {
                alert('Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.');
                $('.sidebar-option', panel).val("default");
                sidebarOption = 'default';
            }

            resetLayout(); // reset layout to default state

            if (layoutOption === "boxed") {
                $("body").addClass("page-boxed");

                // set header
                $('.header > .navbar-inner > .container-fluid').removeClass("container-fluid").addClass("container");
                var cont = $('.header').after('<div class="container"></div>');

                // set content
                $('.page-container').appendTo('body > .container');

                // set footer
                if (footerOption === 'fixed' || sidebarOption === 'default') {
                    $('.footer').html('<div class="container">'+$('.footer').html()+'</div>');
                } else {
                    $('.footer').appendTo('body > .container');
                }            
            }

            if (lastSelectedLayout != layoutOption) {
                //layout changed, run responsive handler:
                runResponsiveHandlers();
            }
            lastSelectedLayout = layoutOption;

            //header
            if (headerOption === 'fixed') {
                $("body").addClass("page-header-fixed");
                $(".header").removeClass("navbar-static-top").addClass("navbar-fixed-top");
            } else {
                $("body").removeClass("page-header-fixed");
                $(".header").removeClass("navbar-fixed-top").addClass("navbar-static-top");
            }

            //sidebar
            if (sidebarOption === 'fixed') {
                $("body").addClass("page-sidebar-fixed");
            } else {
                $("body").removeClass("page-sidebar-fixed");
            }

            //footer 
            if (footerOption === 'fixed') {
                $("body").addClass("page-footer-fixed");
            } else {
                $("body").removeClass("page-footer-fixed");
            }

            handleSidebarAndContentHeight(); // fix content height            
            handleFixedSidebar(); // reinitialize fixed sidebar
            handleFixedSidebarHoverable(); // reinitialize fixed sidebar hover effect
        }

        // handle theme colors
        var setColor = function (color) {
            $('#style_color').attr("href", "assets/css/themes/" + color + ".css");
            $.cookie('style_color', color);                
        }

        $('.icon-color', panel).click(function () {
            $('.color-mode').show();
            $('.icon-color-close').show();
        });

        $('.icon-color-close', panel).click(function () {
            $('.color-mode').hide();
            $('.icon-color-close').hide();
        });

        $('li', panel).click(function () {
            var color = $(this).attr("data-style");
            setColor(color);
            $('.inline li', panel).removeClass("current");
            $(this).addClass("current");
        });

        $('.layout-option, .header-option, .sidebar-option, .footer-option', panel).change(setLayout);
    }

    var handleFixInputPlaceholderForIE = function () {
        //fix html5 placeholder attribute for ie7 & ie8
        if (isIE8 || isIE9) { // ie7&ie8
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            jQuery('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {

                var input = jQuery(this);

                if(input.val()=='' && input.attr("placeholder") != '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function () {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function () {                         
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    }

    var handleFullScreenMode = function() {
        // mozfullscreenerror event handler
       
        // toggle full screen
        function toggleFullScreen() {
          if (!document.fullscreenElement &&    // alternative standard method
              !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
              document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
          } else {
            if (document.cancelFullScreen) {
              document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            }
          }
        }

        $('#trigger_fullscreen').click(function() {
            toggleFullScreen();
        });
    }

    //* END:CORE HANDLERS *//

    return {

        //main function to initiate template pages
        init: function () {

            //IMPORTANT!!!: Do not modify the core handlers call order.

            //core handlers
            handleInit();
            handleResponsiveOnResize(); // set and handle responsive    
            handleUniform();        
            handleScrollers(); // handles slim scrolling contents 
            handleResponsiveOnInit(); // handler responsive elements on page load

            //layout handlers
            handleFixedSidebar(); // handles fixed sidebar menu
            handleFixedSidebarHoverable(); // handles fixed sidebar on hover effect 
            handleSidebarMenu(); // handles main menu
            handleHorizontalMenu(); // handles horizontal menu
            handleSidebarToggler(); // handles sidebar hide/show            
            handleFixInputPlaceholderForIE(); // fixes/enables html5 placeholder attribute for IE9, IE8
            handleGoTop(); //handles scroll to top functionality in the footer
            handleTheme(); // handles style customer tool

            //ui component handlers
            handlePortletTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
            handleDropdowns(); // handle dropdowns
            handleTabs(); // handle tabs
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleAccordions(); //handles accordions
            handleChoosenSelect(); // handles bootstrap chosen dropdowns     
            handleModal();

            App.addResponsiveHandler(handleChoosenSelect); // reinitiate chosen dropdown on main content resize. disable this line if you don't really use chosen dropdowns.
            handleFullScreenMode() // handles full screen
        },

        fixContentHeight: function () {
            handleSidebarAndContentHeight();
        },

        setLastPopedPopover: function (el) {
            lastPopedPopover = el;
        },

        addResponsiveHandler: function (func) {
            responsiveHandlers.push(func);
        },

        // useful function to make equal height for contacts stand side by side
        setEqualHeight: function (els) {
            var tallestEl = 0;
            els = jQuery(els);
            els.each(function () {
                    var currentHeight = $(this).height();
                    if (currentHeight > tallestEl) {
                        tallestColumn = currentHeight;
                    }
                });
            els.height(tallestEl);
        },

        // wrapper function to scroll to an element
        scrollTo: function (el, offeset) {
            pos = el ? el.offset().top : 0;
            jQuery('html,body').animate({
                    scrollTop: pos + (offeset ? offeset : 0)
                }, 'slow');
        },

        scrollTop: function () {
            App.scrollTo();
        },
     
        // wrapper function to  block element(indicate loading)
        blockUI: function (el, centerY) {
            var el = jQuery(el);
            el.block({
                    message: '<img src="'+ASSET_URL+'img/ajax-loading.gif" align="">',
                    centerY: centerY == undefined ? centerY : true,         
                            
                    css: {
                        top: '10%',
                        border: 'none',
                        padding: '2px',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: '#000',
                        opacity: 0,
                        cursor: 'wait'
                    },
                    baseZ: 99999,
            
                   /* css: {
                        top: "50%",
                        left: "50%",
                        border: 'none',
                        padding: '2px',
                        backgroundColor: 'none',
                        position : 'fixed',
                        width: '40%',
                        height: '50%',
                        textAlign : 'center',
                        scrollTop : true
                    },
                    overlayCSS: {
                        backgroundColor: '#000',
                        opacity: 0.05,
                        cursor: 'wait',
                        position : 'fixed',
                        width: '40%',
                        height: '50%',
                        textAlign : 'center',
                        verticalAlign : 'middle'
                    } */
                                
                });
        },

        // wrapper function to  un-block element(finish loading)
        unblockUI: function (el) {
            jQuery(el).unblock({
                    onUnblock: function () {
                        jQuery(el).removeAttr("style");
                    }
                });
        },

        // initializes uniform elements
        initUniform: function (els) {

            if (els) {
                jQuery(els).each(function () {
                        if ($(this).parents(".checker").size() == 0) {
                            $(this).show();
                            $(this).uniform();
                        }
                    });
            } else {
                handleUniform();
            }

        },

        updateUniform : function(els) {
            $.uniform.update(els);
        },

        // initializes choosen dropdowns
        initChosenSelect: function (els) {
            $(els).chosen({
                    allow_single_deselect: true
                });
        },

        initFancybox: function () {
            handleFancybox();
        },

        getActualVal: function (el) {
            var el = jQuery(el);
            if (el.val() === el.attr("placeholder")) {
                return "";
            }

            return el.val();
        },

        getURLParameter: function (paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },

        // check for device touch support
        isTouchDevice: function () {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        },

        isIE8: function () {
            return isIE8;
        },

        isRTL: function () {
            return isRTL;
        },

        getLayoutColorCode: function (name) {
            if (layoutColorCodes[name]) {
                return layoutColorCodes[name];
            } else {
                return '';
            }
        }

    };
}();

var BASE_URL=document.getElementById("BASE_URL").value;
var FormComponents = function () {

    var handleWysihtml5 = function () {
        if (!jQuery().wysihtml5) {
            return;
        }

		
        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5({
                "stylesheets": [BASE_URL+"plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
            });
        }
    }

    var handleToggleButtons = function () {
        if (!jQuery().toggleButtons) {
            return;
        }
        $('.basic-toggle-button').toggleButtons();
        $('.text-toggle-button').toggleButtons({
            width: 200,
            label: {
                enabled: "Lorem Ipsum",
                disabled: "Dolor Sit"
            }
        });
        $('.danger-toggle-button').toggleButtons({
            style: {
                // Accepted values ["primary", "danger", "info", "success", "warning"] or nothing
                enabled: "danger",
                disabled: "info"
            }
        });
        $('.info-toggle-button').toggleButtons({
            style: {
                enabled: "info",
                disabled: ""
            }
        });
        $('.success-toggle-button').toggleButtons({
            style: {
                enabled: "success",
                disabled: "info"
            }
        });
        $('.warning-toggle-button').toggleButtons({
            style: {
                enabled: "warning",
                disabled: "info"
            }
        });

        $('.height-toggle-button').toggleButtons({
            height: 100,
            font: {
                'line-height': '100px',
                'font-size': '20px',
                'font-style': 'italic'
            }
        });
    }

    var handleTagsInput = function () {
        if (!jQuery().tagsInput) {
            return;
        }
        $('#tags_1').tagsInput({
            width: 'auto',
            'onAddTag': function () {
                //alert(1);
            },
        });
        $('#tags_2').tagsInput({
            width: 240
        });
    }

    var handleDatePickers = function () {

        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl : App.isRTL()
            });
        }
    }

    var handleTimePickers = function () {
        
        if (jQuery().timepicker) {
            $('.timepicker-default').timepicker();
            $('.timepicker-24').timepicker({
                minuteStep: 1,
                showSeconds: true,
                showMeridian: false
            });
        }
    }

    var handleDateRangePickers = function () {
        if (!jQuery().daterangepicker) {
            return;
        }

        $('.date-range').daterangepicker(
            {
                opens: (App.isRTL() ? 'left' : 'right'),
                format: 'MM/dd/yyyy',
                separator: ' to ',
                startDate: Date.today().add({
                    days: -29
                }),
                endDate: Date.today(),
                minDate: '01/01/2012',
                maxDate: '12/31/2014',
            }
        );

        $('#form-date-range').daterangepicker({
            ranges: {
                'Today': ['today', 'today'],
                'Yesterday': ['yesterday', 'yesterday'],
                'Last 7 Days': [Date.today().add({
                        days: -6
                    }), 'today'],
                'Last 29 Days': [Date.today().add({
                        days: -29
                    }), 'today'],
                'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
                'Last Month': [Date.today().moveToFirstDayOfMonth().add({
                        months: -1
                    }), Date.today().moveToFirstDayOfMonth().add({
                        days: -1
                    })]
            },
            opens: (App.isRTL() ? 'left' : 'right'),
            format: 'MM/dd/yyyy',
            separator: ' to ',
            startDate: Date.today().add({
                days: -29
            }),
            endDate: Date.today(),
            minDate: '01/01/2012',
            maxDate: '12/31/2014',
            locale: {
                applyLabel: 'Submit',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom Range',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            },
            showWeekNumbers: true,
            buttonClasses: ['btn-danger']
        },

        function (start, end) {
            $('#form-date-range span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
        });

        $('#form-date-range span').html(Date.today().add({
            days: -29
        }).toString('MMMM d, yyyy') + ' - ' + Date.today().toString('MMMM d, yyyy'));


        //modal version:

        $('#form-date-range-modal').daterangepicker({
            ranges: {
                'Today': ['today', 'today'],
                'Yesterday': ['yesterday', 'yesterday'],
                'Last 7 Days': [Date.today().add({
                        days: -6
                    }), 'today'],
                'Last 29 Days': [Date.today().add({
                        days: -29
                    }), 'today'],
                'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
                'Last Month': [Date.today().moveToFirstDayOfMonth().add({
                        months: -1
                    }), Date.today().moveToFirstDayOfMonth().add({
                        days: -1
                    })]
            },
            opens: (App.isRTL() ? 'left' : 'right'),
            format: 'MM/dd/yyyy',
            separator: ' to ',
            startDate: Date.today().add({
                days: -29
            }),
            endDate: Date.today(),
            minDate: '01/01/2012',
            maxDate: '12/31/2014',
            locale: {
                applyLabel: 'Submit',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom Range',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            },
            showWeekNumbers: true,
            buttonClasses: ['btn-danger']
        },

        function (start, end) {
            $('#form-date-range-modal span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
        });

        $('#form-date-range-modal span').html(Date.today().add({
            days: -29
        }).toString('MMMM d, yyyy') + ' - ' + Date.today().toString('MMMM d, yyyy'));

    }

    var handleDatetimePicker = function () {        

        $(".form_datetime").datetimepicker({
            isRTL: App.isRTL(),
            format: "dd MM yyyy - hh:ii",
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
        });

         $(".form_advance_datetime").datetimepicker({
            isRTL: App.isRTL(),
            format: "dd MM yyyy - hh:ii",
            autoclose: true,
            todayBtn: true,
            startDate: "2013-02-14 10:00",
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
            minuteStep: 10
        });

         $(".form_meridian_datetime").datetimepicker({
            isRTL: App.isRTL(),
            format: "dd MM yyyy - HH:ii P",
            showMeridian: true,
            autoclose: true,
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
            todayBtn: true
        });
    }

    var handleClockfaceTimePickers = function () {

        if (!jQuery().clockface) {
            return;
        }

        $('.clockface_1').clockface();

        $('#clockface_2').clockface({
            format: 'HH:mm',
            trigger: 'manual'
        });

        $('#clockface_2_toggle').click(function (e) {
            e.stopPropagation();
            $('#clockface_2').clockface('toggle');
        });

        $('#clockface_2_modal').clockface({
            format: 'HH:mm',
            trigger: 'manual'
        });

        $('#clockface_2_modal_toggle').click(function (e) {
            e.stopPropagation();
            $('#clockface_2_modal').clockface('toggle');
        });

        $('.clockface_3').clockface({
            format: 'H:mm'
        }).clockface('show', '14:30');
    }

    var handleColorPicker = function () {
        if (!jQuery().colorpicker) {
            return;
        }
        $('.colorpicker-default').colorpicker({
            format: 'hex'
        });
        $('.colorpicker-rgba').colorpicker();
    }

    var handleSelect2 = function () {

        $('#select2_sample1').select2({
            placeholder: "Select an option",
            allowClear: true
        });

        $('#select2_sample2').select2({
            placeholder: "Select a State",
            allowClear: true
        });

        $("#select2_sample3").select2({
            allowClear: true,
            minimumInputLength: 1,
            query: function (query) {
                var data = {
                    results: []
                }, i, j, s;
                for (i = 1; i < 5; i++) {
                    s = "";
                    for (j = 0; j < i; j++) {
                        s = s + query.term;
                    }
                    data.results.push({
                        id: query.term + i,
                        text: s
                    });
                }
                query.callback(data);
            }
        });

        function format(state) {
            if (!state.id) return state.text; // optgroup
            return "<img class='flag' src='assets/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
        }
        $("#select2_sample4").select2({
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });

        $("#select2_sample5").select2({
            tags: ["red", "green", "blue", "yellow", "pink"]
        });


        function movieFormatResult(movie) {
            var markup = "<table class='movie-result'><tr>";
            if (movie.posters !== undefined && movie.posters.thumbnail !== undefined) {
                markup += "<td valign='top'><img src='" + movie.posters.thumbnail + "'/></td>";
            }
            markup += "<td valign='top'><h5>" + movie.title + "</h5>";
            if (movie.critics_consensus !== undefined) {
                markup += "<div class='movie-synopsis'>" + movie.critics_consensus + "</div>";
            } else if (movie.synopsis !== undefined) {
                markup += "<div class='movie-synopsis'>" + movie.synopsis + "</div>";
            }
            markup += "</td></tr></table>"
            return markup;
        }

        function movieFormatSelection(movie) {
            return movie.title;
        }

        $("#select2_sample6").select2({
            placeholder: "Search for a movie",
            minimumInputLength: 1,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
                dataType: 'jsonp',
                data: function (term, page) {
                    return {
                        q: term, // search term
                        page_limit: 10,
                        apikey: "ju6z9mjyajq2djue3gbvv26t" // please do not use so this example keeps working
                    };
                },
                results: function (data, page) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter remote JSON data
                    return {
                        results: data.movies
                    };
                }
            },
            initSelection: function (element, callback) {
                // the input tag has a value attribute preloaded that points to a preselected movie's id
                // this function resolves that id attribute to an object that select2 can render
                // using its formatResult renderer - that way the movie name is shown preselected
                var id = $(element).val();
                if (id !== "") {
                    $.ajax("http://api.rottentomatoes.com/api/public/v1.0/movies/" + id + ".json", {
                        data: {
                            apikey: "ju6z9mjyajq2djue3gbvv26t"
                        },
                        dataType: "jsonp"
                    }).done(function (data) {
                        callback(data);
                    });
                }
            },
            formatResult: movieFormatResult, // omitted for brevity, see the source of this page
            formatSelection: movieFormatSelection, // omitted for brevity, see the source of this page
            dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
            escapeMarkup: function (m) {
                return m;
            } // we do not want to escape markup since we are displaying html in results
        });
    }

    var handleSelect2Modal = function () {

        $('#select2_sample_modal_1').select2({
            placeholder: "Select an option",
            allowClear: true
        });

        $('#select2_sample_modal_2').select2({
            placeholder: "Select a State",
            allowClear: true
        });

        $("#select2_sample_modal_3").select2({
            allowClear: true,
            minimumInputLength: 1,
            query: function (query) {
                var data = {
                    results: []
                }, i, j, s;
                for (i = 1; i < 5; i++) {
                    s = "";
                    for (j = 0; j < i; j++) {
                        s = s + query.term;
                    }
                    data.results.push({
                        id: query.term + i,
                        text: s
                    });
                }
                query.callback(data);
            }
        });

        function format(state) {
            if (!state.id) return state.text; // optgroup
            return "<img class='flag' src='assets/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
        }
        $("#select2_sample_modal_4").select2({
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });

        $("#select2_sample_modal_5").select2({
            tags: ["red", "green", "blue", "yellow", "pink"]
        });


        function movieFormatResult(movie) {
            var markup = "<table class='movie-result'><tr>";
            if (movie.posters !== undefined && movie.posters.thumbnail !== undefined) {
                markup += "<td valign='top'><img src='" + movie.posters.thumbnail + "'/></td>";
            }
            markup += "<td valign='top'><h5>" + movie.title + "</h5>";
            if (movie.critics_consensus !== undefined) {
                markup += "<div class='movie-synopsis'>" + movie.critics_consensus + "</div>";
            } else if (movie.synopsis !== undefined) {
                markup += "<div class='movie-synopsis'>" + movie.synopsis + "</div>";
            }
            markup += "</td></tr></table>"
            return markup;
        }

        function movieFormatSelection(movie) {
            return movie.title;
        }

        $("#select2_sample_modal_6").select2({
            placeholder: "Search for a movie",
            minimumInputLength: 1,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
                dataType: 'jsonp',
                data: function (term, page) {
                    return {
                        q: term, // search term
                        page_limit: 10,
                        apikey: "ju6z9mjyajq2djue3gbvv26t" // please do not use so this example keeps working
                    };
                },
                results: function (data, page) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter remote JSON data
                    return {
                        results: data.movies
                    };
                }
            },
            initSelection: function (element, callback) {
                // the input tag has a value attribute preloaded that points to a preselected movie's id
                // this function resolves that id attribute to an object that select2 can render
                // using its formatResult renderer - that way the movie name is shown preselected
                var id = $(element).val();
                if (id !== "") {
                    $.ajax("http://api.rottentomatoes.com/api/public/v1.0/movies/" + id + ".json", {
                        data: {
                            apikey: "ju6z9mjyajq2djue3gbvv26t"
                        },
                        dataType: "jsonp"
                    }).done(function (data) {
                        callback(data);
                    });
                }
            },
            formatResult: movieFormatResult, // omitted for brevity, see the source of this page
            formatSelection: movieFormatSelection, // omitted for brevity, see the source of this page
            dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
            escapeMarkup: function (m) {
                return m;
            } // we do not want to escape markup since we are displaying html in results
        });
    }

   
    var handlePasswordStrengthChecker = function () {
        var initialized = false;
        var input = $("#password_strength");

        input.keydown(function(){
            if (initialized === false) {
                // set base options
                input.pwstrength({
                    raisePower: 1.4,
                    minChar: 8,
                    verdicts: ["Weak", "Normal", "Medium", "Strong", "Very Strong"],
                    scores: [17, 26, 40, 50, 60]
                });

                // add your own rule to calculate the password strength
                input.pwstrength("addRule", "demoRule", function (options, word, score) {
                    return word.match(/[a-z].[0-9]/) && score;
                }, 10, true);

                // set progress bar's width according to the input width
                $('.progress', input.parents('.password-strength')).css('width', input.outerWidth() - 2); 

                // set as initialized 
                initialized = true;
            }
        });        
    }

    var handleUsernameAvailabilityChecker1 = function () {
        var input = $("#username1_input");

        $("#username1_checker").click(function(e){

            if (input.val() === "") {
                input.popover('destroy');    
                input.popover({
                    'placement' : App.isRTL() ? 'left' : 'right',
                    'html': true,
                    'title': 'Username Availability',
                    'content': 'Please enter a username to check its availability.',
                });                
                // add error class to the popover
                input.data('popover').tip().addClass('error');
                // set last poped popover to be closed on click(see App.js => handlePopovers function)     
                App.setLastPopedPopover(input);
                input.popover('show');
                e.stopPropagation(); // prevent closing the popover

                return;
            }

            var btn = $(this);

            btn.attr('disabled', true);

            input.attr("readonly", true).
                attr("disabled", true).
                addClass("spinner");

            $.post('demo/username_checker.php', {username: input.val()}, function(res) {
                btn.attr('disabled', false);

                input.attr("readonly", false).
                    attr("disabled", false).
                    removeClass("spinner");

                input.popover('destroy');    
                input.popover({
                    'placement' : App.isRTL() ? 'left' : 'right',
                    'html': true,
                    'title': 'Username Availability',
                    'content': res.message,
                });

                // change popover font color based on the result
                if (res.status == 'OK') {
                    input.data('popover').tip().addClass('success');
                } else {
                    input.data('popover').tip().addClass('error');
                }

                // set last poped popover to be closed on click(see App.js => handlePopovers function)     
                App.setLastPopedPopover(input);

                input.popover('show');

            }, 'json');

        });        
    }

    var handleUsernameAvailabilityChecker2 = function () {
        $("#username2_input").change(function(){
            var input = $(this);

            if (input.val() === "") {
                return;
            }

            input.attr("readonly", true).
                attr("disabled", true).
                addClass("spinner");

            $.post('demo/username_checker.php', {username: input.val()}, function(res) {
                input.attr("readonly", false).
                    attr("disabled", false).
                    removeClass("spinner");

                input.popover('destroy');    
                input.popover({
                    'html': true,
                    'placement' : App.isRTL() ? 'left' : 'right',
                    'title': 'Username Availability',
                    'content': res.message,
                });

                // change popover font color based on the result
                if (res.status == 'OK') {
                    input.data('popover').tip().addClass('success');
                } else {
                    input.data('popover').tip().addClass('error');
                }

                // set last poped popover to be closed on click(see App.js => handlePopovers function)     
                App.setLastPopedPopover(input);

                input.popover('show');

            }, 'json');

        });        
    }

    var handleUsernameAvailabilityChecker3 = function () {
        $("#username3_input").change(function(){
            var input = $(this);

            if (input.val() === "") {
                return;
            }

            input.attr("readonly", true).
                attr("disabled", true).
                addClass("spinner");

            $.post('demo/username_checker.php', {username: input.val()}, function(res) {
                input.attr("readonly", false).
                    attr("disabled", false).
                    removeClass("spinner");

                input.popover('destroy');    
                input.popover({
                    'html': true,
                    'placement' : App.isRTL() ? 'left' : 'right',
                    'title': 'Username Availability',
                    'content': res.message,
                });

                // change popover font color based on the result
                if (res.status == 'OK') {
                    input.closest('.control-group').removeClass('error').addClass('success');
                    input.after('<span class="help-inline ok"></span>');                    
                } else {
                    input.closest('.control-group').removeClass('success').addClass('error');
                    $('.help-inline.ok', input.closest('.control-group')).remove();
                }

                // set last poped popover to be closed on click(see App.js => handlePopovers function)     
                App.setLastPopedPopover(input);

                input.popover('show');

            }, 'json');

        });        
    }

    return {
        //main function to initiate the module
        init: function () {
            handleWysihtml5();
            handleToggleButtons();
            handleTagsInput();
            handleDatePickers();
            handleTimePickers();
            handleDatetimePicker();
            handleDateRangePickers();
            //handleClockfaceTimePickers();
            handleColorPicker();
            handleSelect2();
            handleSelect2Modal();
            handlePasswordStrengthChecker();
            handleUsernameAvailabilityChecker1();
            handleUsernameAvailabilityChecker2();
            handleUsernameAvailabilityChecker3();
        }

    };

}();

$.fn.editable.defaults.inputclass = 'm-wrap';

$.fn.editableform.buttons = '<button type="submit" class="btn blue editable-submit"><i class="icon-ok"></i></button>';
$.fn.editableform.buttons += '<button type="button" class="btn red editable-cancel"><i class="icon-remove"></i></button>';

if($('#lang').val() == 'nb'){
	$.fn.editable.defaults.emptytext = 'Tom';
}
else{
	$.fn.editable.defaults.emptytext = 'Empty';
}

/* ============================================================
 * bootstrapSwitch v1.5 by Larentis Mattia @SpiritualGuru
 * http://www.larentis.eu/
 * 
 * Enhanced for radiobuttons by Stein, Peter @BdMdesigN
 * http://www.bdmdesign.org/
 *
 * Project site:
 * http://www.larentis.eu/switch/
 * ============================================================
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * ============================================================ */

!function ($) {
  "use strict";

  $.fn['bootstrapSwitch'] = function (method) {
    var methods = {
      init: function () {
        return this.each(function () {
            var $element = $(this)
              , $div
              , $switchLeft
              , $switchRight
              , $label
              , $form = $element.closest('form')
              , myClasses = ""
              , classes = $element.attr('class')
              , color
              , moving
              , onLabel = "ON"
              , offLabel = "OFF"
              , icon = false;

            $.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
              if (classes.indexOf(el) >= 0)
                myClasses = el;
            });

            $element.addClass('has-switch');

            if ($element.data('on') !== undefined)
              color = "switch-" + $element.data('on');

            if ($element.data('on-label') !== undefined)
              onLabel = $element.data('on-label');

            if ($element.data('off-label') !== undefined)
              offLabel = $element.data('off-label');

            if ($element.data('icon') !== undefined)
              icon = $element.data('icon');

            $switchLeft = $('<span>')
              .addClass("switch-left")
              .addClass(myClasses)
              .addClass(color)
              .html(onLabel);

            color = '';
            if ($element.data('off') !== undefined)
              color = "switch-" + $element.data('off');

            $switchRight = $('<span>')
              .addClass("switch-right")
              .addClass(myClasses)
              .addClass(color)
              .html(offLabel);

            $label = $('<label>')
              .html("&nbsp;")
              .addClass(myClasses)
              .attr('for', $element.find('input').attr('id'));

            if (icon) {
              $label.html('<i class="icon icon-' + icon + '"></i>');
            }

            $div = $element.find('input').wrap($('<div>')).parent().data('animated', false);

            if ($element.data('animated') !== false)
              $div.addClass('switch-animate').data('animated', true);

            $div
              .append($switchLeft)
              .append($label)
              .append($switchRight);

            $element.find('>div').addClass(
              $element.find('input').is(':checked') ? 'switch-on' : 'switch-off'
            );

            if ($element.find('input').is(':disabled'))
              $(this).addClass('deactivate');

            var changeStatus = function ($this) {
              $this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');
            };

            $element.on('keydown', function (e) {
              if (e.keyCode === 32) {
                e.stopImmediatePropagation();
                e.preventDefault();
                changeStatus($(e.target).find('span:first'));
              }
            });

            $switchLeft.on('click', function (e) {
              changeStatus($(this));
            });

            $switchRight.on('click', function (e) {
              changeStatus($(this));
            });

            $element.find('input').on('change', function (e, skipOnChange) {
              var $this = $(this)
                , $element = $this.parent()
                , thisState = $this.is(':checked')
                , state = $element.is('.switch-off');

              e.preventDefault();

              $element.css('left', '');

              if (state === thisState) {

                if (thisState)
                  $element.removeClass('switch-off').addClass('switch-on');
                else $element.removeClass('switch-on').addClass('switch-off');

                if ($element.data('animated') !== false)
                  $element.addClass("switch-animate");

                if (typeof skipOnChange === 'boolean' && skipOnChange)
                  return;

                $element.parent().trigger('switch-change', {'el': $this, 'value': thisState})
              }
            });

             $element.find('input').on('change2', function (e, skipOnChange) {
              var $this = $(this)
                , $element = $this.parent()
                , thisState = $this.is(':checked')
                , state = $element.is('.switch-off');

              e.preventDefault();

              $element.css('left', '');

              if (state === thisState) {

                if (thisState)
                  $element.removeClass('switch-off').addClass('switch-on');
                else $element.removeClass('switch-on').addClass('switch-off');

                if ($element.data('animated') !== false)
                  $element.addClass("switch-animate");

                if (typeof skipOnChange === 'boolean' && skipOnChange)
                  return;

                $element.parent().trigger('switch-change', {'el': $this, 'value': thisState})
              }
            });

            $element.find('label').on('mousedown touchstart', function (e) {
              var $this = $(this);
              moving = false;

              e.preventDefault();
              e.stopImmediatePropagation();

              $this.closest('div').removeClass('switch-animate');

              if ($this.closest('.has-switch').is('.deactivate'))
                $this.unbind('click');
              else {
                $this.on('mousemove touchmove', function (e) {
                  var $element = $(this).closest('.switch')
                    , relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left
                    , percent = (relativeX / $element.width()) * 100
                    , left = 25
                    , right = 75;

                  moving = true;

                  if (percent < left)
                    percent = left;
                  else if (percent > right)
                    percent = right;

                  $element.find('>div').css('left', (percent - right) + "%")
                });

                $this.on('click touchend', function (e) {
                  var $this = $(this)
                    , $target = $(e.target)
                    , $myRadioCheckBox = $target.siblings('input');

                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $this.unbind('mouseleave');

                  if (moving)
                    $myRadioCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));
                  else
                    $myRadioCheckBox.prop("checked", !$myRadioCheckBox.is(":checked"));

                  moving = false;
                  $myRadioCheckBox.trigger('change');
                });

                $this.on('mouseleave', function (e) {
                  var $this = $(this)
                    , $myInputBox = $this.siblings('input');

                  e.preventDefault();
                  e.stopImmediatePropagation();

                  $this.unbind('mouseleave');
                  $this.trigger('mouseup');

                  $myInputBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
                });

                $this.on('mouseup', function (e) {
                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $(this).unbind('mousemove');
                });
              }
            });

            if ($form.data('bootstrapSwitch') !== 'injected') {
              $form.bind('reset', function () {
                setTimeout(function () {
                  $form.find('.switch').each(function () {
                    var $input = $(this).find('input');
                    
                    $input.prop('checked', $input.is(':checked')).trigger('change');
                  });
                }, 1);
              });
              $form.data('bootstrapSwitch', 'injected');
            }
          }
        );
      },
      toggleActivation: function () {
        var $this = $(this);

        $this.toggleClass('deactivate');
        $this.find('input:checkbox').attr('disabled', $this.is('.deactivate'));
      },
      isActive: function () {
        return !$(this).hasClass('deactivate');
      },
      setActive: function (active) {
        var $this = $(this);

        if (active) {
          $this.removeClass('deactivate');
          $this.find('input:checkbox').attr('disabled', false);
        }
        else {
          $this.addClass('deactivate');
          $this.find('input:checkbox').attr('disabled', true);
        }
      },
      toggleState: function (skipOnChange) {
        var $input = $(this).find('input[type=checkbox]');
        $input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
      },
      toggleRadioState: function (skipOnChange) {
        $(this).find('input[type=radio]').not(':checked').trigger('change', skipOnChange);
      },
      setState: function (value, skipOnChange) {
        $(this).find('input').prop('checked', value).trigger('change', skipOnChange);
      },
      status: function () {
        return $(this).find('input').is(':checked');
      },
      destroy: function () {
        var $element = $(this)
          , $div = $element.find('div')
          , $form = $element.closest('form')
          , $inputbox;

        $div.find(':not(input)').remove();

        $inputbox = $div.children();
        $inputbox.unwrap().unwrap();

        $inputbox.unbind('change');

        if ($form) {
          $form.unbind('reset');
          $form.removeData('bootstrapSwitch');
        }

        return $inputbox;
      }
    };

    if (methods[method])
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    else if (typeof method === 'object' || !method)
      return methods.init.apply(this, arguments);
    else
      $.error('Method ' + method + ' does not exist!');
  };
}(jQuery);

(function () {
  jQuery('.switch')['bootstrapSwitch']();
})();

//BOOTSTRAP COLORPICKER
!function(t){var e=function(t){this.value={h:1,s:1,b:1,a:1},this.setColor(t)};e.prototype={constructor:e,setColor:function(e){e=e.toLowerCase();var o=this;t.each(s.stringParsers,function(t,i){var r=i.re.exec(e),n=r&&i.parse(r),a=i.space||"rgba";return n?("hsla"===a?o.value=s.RGBtoHSB.apply(null,s.HSLtoRGB.apply(null,n)):o.value=s.RGBtoHSB.apply(null,n),!1):void 0})},setHue:function(t){this.value.h=1-t},setSaturation:function(t){this.value.s=t},setLightness:function(t){this.value.b=1-t},setAlpha:function(t){this.value.a=parseInt(100*(1-t),10)/100},toRGB:function(t,e,o,s){t||(t=this.value.h,e=this.value.s,o=this.value.b),t*=360;var i,r,n,a,l;return t=t%360/60,l=o*e,a=l*(1-Math.abs(t%2-1)),i=r=n=o-l,t=~~t,i+=[l,a,0,0,a,l][t],r+=[a,l,l,a,0,0][t],n+=[0,0,a,l,l,a][t],{r:Math.round(255*i),g:Math.round(255*r),b:Math.round(255*n),a:s||this.value.a}},toHex:function(t,e,o,s){var i=this.toRGB(t,e,o,s);return"#"+(1<<24|parseInt(i.r)<<16|parseInt(i.g)<<8|parseInt(i.b)).toString(16).substr(1)},toHSL:function(t,e,o,s){t||(t=this.value.h,e=this.value.s,o=this.value.b);var i=t,r=(2-e)*o,n=e*o;return n/=r>0&&1>=r?r:2-r,r/=2,n>1&&(n=1),{h:i,s:n,l:r,a:s||this.value.a}}};var o=function(e,o){this.element=t(e);var i=o.format||this.element.data("color-format")||"hex";this.format=s.translateFormats[i],this.isInput=this.element.is("input"),this.component=this.element.is(".color")?this.element.find(".add-on"):!1,this.picker=t(s.template).appendTo("body").on("mousedown",t.proxy(this.mousedown,this)),this.isInput?this.element.on({focus:t.proxy(this.show,this),keyup:t.proxy(this.update,this)}):this.component?this.component.on({click:t.proxy(this.show,this)}):this.element.on({click:t.proxy(this.show,this)}),("rgba"===i||"hsla"===i)&&(this.picker.addClass("alpha"),this.alpha=this.picker.find(".colorpicker-alpha")[0].style),this.component?(this.picker.find(".colorpicker-color").hide(),this.preview=this.element.find("i")[0].style):this.preview=this.picker.find("div:last")[0].style,this.base=this.picker.find("div:first")[0].style,this.update()};o.prototype={constructor:o,show:function(e){this.picker.show(),this.height=this.component?this.component.outerHeight():this.element.outerHeight(),this.place(),t(window).on("resize",t.proxy(this.place,this)),this.isInput||e&&(e.stopPropagation(),e.preventDefault()),t(document).on({mousedown:t.proxy(this.hide,this)}),this.element.trigger({type:"show",color:this.color})},update:function(){this.color=new e(this.isInput?this.element.prop("value"):this.element.data("color")),this.picker.find("i").eq(0).css({left:100*this.color.value.s,top:100-100*this.color.value.b}).end().eq(1).css("top",100*(1-this.color.value.h)).end().eq(2).css("top",100*(1-this.color.value.a)),this.previewColor()},setValue:function(t){this.color=new e(t),this.picker.find("i").eq(0).css({left:100*this.color.value.s,top:100-100*this.color.value.b}).end().eq(1).css("top",100*(1-this.color.value.h)).end().eq(2).css("top",100*(1-this.color.value.a)),this.previewColor(),this.element.trigger({type:"changeColor",color:this.color})},hide:function(){this.picker.hide(),t(window).off("resize",this.place),this.isInput?this.element.prop("value",this.format.call(this)):(t(document).off({mousedown:this.hide}),this.component&&this.element.find("input").prop("value",this.format.call(this)),this.element.data("color",this.format.call(this))),this.element.trigger({type:"hide",color:this.color})},place:function(){var t=this.component?this.component.offset():this.element.offset();this.picker.css({top:t.top+this.height,left:t.left})},previewColor:function(){try{this.preview.backgroundColor=this.format.call(this)}catch(t){this.preview.backgroundColor=this.color.toHex()}this.base.backgroundColor=this.color.toHex(this.color.value.h,1,1,1),this.alpha&&(this.alpha.backgroundColor=this.color.toHex())},pointer:null,slider:null,mousedown:function(e){e.stopPropagation(),e.preventDefault();var o=t(e.target),i=o.closest("div");if(!i.is(".colorpicker")){if(i.is(".colorpicker-saturation"))this.slider=t.extend({},s.sliders.saturation);else if(i.is(".colorpicker-hue"))this.slider=t.extend({},s.sliders.hue);else{if(!i.is(".colorpicker-alpha"))return!1;this.slider=t.extend({},s.sliders.alpha)}var r=i.offset();this.slider.knob=i.find("i")[0].style,this.slider.left=e.pageX-r.left,this.slider.top=e.pageY-r.top,this.pointer={left:e.pageX,top:e.pageY},t(document).on({mousemove:t.proxy(this.mousemove,this),mouseup:t.proxy(this.mouseup,this)}).trigger("mousemove")}return!1},mousemove:function(t){t.stopPropagation(),t.preventDefault();var e=Math.max(0,Math.min(this.slider.maxLeft,this.slider.left+((t.pageX||this.pointer.left)-this.pointer.left))),o=Math.max(0,Math.min(this.slider.maxTop,this.slider.top+((t.pageY||this.pointer.top)-this.pointer.top)));return this.slider.knob.left=e+"px",this.slider.knob.top=o+"px",this.slider.callLeft&&this.color[this.slider.callLeft].call(this.color,e/100),this.slider.callTop&&this.color[this.slider.callTop].call(this.color,o/100),this.previewColor(),this.element.trigger({type:"changeColor",color:this.color}),!1},mouseup:function(e){return e.stopPropagation(),e.preventDefault(),t(document).off({mousemove:this.mousemove,mouseup:this.mouseup}),!1}},t.fn.colorpicker=function(e){return this.each(function(){var s=t(this),i=s.data("colorpicker"),r="object"==typeof e&&e;i||s.data("colorpicker",i=new o(this,t.extend({},t.fn.colorpicker.defaults,r))),"string"==typeof e&&i[e]()})},t.fn.colorpicker.defaults={},t.fn.colorpicker.Constructor=o;var s={translateFormats:{rgb:function(){var t=this.color.toRGB();return"rgb("+t.r+","+t.g+","+t.b+")"},rgba:function(){var t=this.color.toRGB();return"rgba("+t.r+","+t.g+","+t.b+","+t.a+")"},hsl:function(){var t=this.color.toHSL();return"hsl("+Math.round(360*t.h)+","+Math.round(100*t.s)+"%,"+Math.round(100*t.l)+"%)"},hsla:function(){var t=this.color.toHSL();return"hsla("+Math.round(360*t.h)+","+Math.round(100*t.s)+"%,"+Math.round(100*t.l)+"%,"+t.a+")"},hex:function(){return this.color.toHex()}},sliders:{saturation:{maxLeft:100,maxTop:100,callLeft:"setSaturation",callTop:"setLightness"},hue:{maxLeft:0,maxTop:100,callLeft:!1,callTop:"setHue"},alpha:{maxLeft:0,maxTop:100,callLeft:!1,callTop:"setAlpha"}},RGBtoHSB:function(t,e,o,s){t/=255,e/=255,o/=255;var i,r,n,a;return n=Math.max(t,e,o),a=n-Math.min(t,e,o),i=0===a?null:n==t?(e-o)/a:n==e?(o-t)/a+2:(t-e)/a+4,i=(i+360)%6*60/360,r=0===a?0:a/n,{h:i||1,s:r,b:n,a:s||1}},HueToRGB:function(t,e,o){return 0>o?o+=1:o>1&&(o-=1),1>6*o?t+(e-t)*o*6:1>2*o?e:2>3*o?t+(e-t)*(2/3-o)*6:t},HSLtoRGB:function(t,e,o,i){0>e&&(e=0);var r;r=.5>=o?o*(1+e):o+e-o*e;var n=2*o-r,a=t+1/3,l=t,h=t-1/3,c=Math.round(255*s.HueToRGB(n,r,a)),p=Math.round(255*s.HueToRGB(n,r,l)),u=Math.round(255*s.HueToRGB(n,r,h));return[c,p,u,i||1]},stringParsers:[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1]/360,t[2]/100,t[3]/100,t[4]]}}],template:'<div class="colorpicker dropdown-menu"><div class="colorpicker-saturation"><i><b></b></i></div><div class="colorpicker-hue"><i></i></div><div class="colorpicker-alpha"><i></i></div><div class="colorpicker-color"><div /></div></div>'}}(window.jQuery);
//BOOTSTRAP COLORPICKER

//FINGERPRINT
!function(e,t,r){"use strict";"function"==typeof window.define&&window.define.amd?window.define(r):"undefined"!=typeof module&&module.exports?module.exports=r():t.exports?t.exports=r():t.Fingerprint2=r()}(0,this,function(){"use strict";var e=function(t){if(!(this instanceof e))return new e(t);this.options=this.extend(t,{swfContainerId:"fingerprintjs2",swfPath:"flash/compiled/FontList.swf",detectScreenOrientation:!0,sortPluginsFor:[/palemoon/i],userDefinedFonts:[],excludeDoNotTrack:!0,excludePixelRatio:!0}),this.nativeForEach=Array.prototype.forEach,this.nativeMap=Array.prototype.map};return e.prototype={extend:function(e,t){if(null==e)return t;for(var r in e)null!=e[r]&&t[r]!==e[r]&&(t[r]=e[r]);return t},get:function(e){var t=this,r={data:[],addPreprocessedComponent:function(e){var n=e.value;"function"==typeof t.options.preprocessor&&(n=t.options.preprocessor(e.key,n)),r.data.push({key:e.key,value:n})}};r=this.userAgentKey(r),r=this.languageKey(r),r=this.colorDepthKey(r),r=this.deviceMemoryKey(r),r=this.pixelRatioKey(r),r=this.hardwareConcurrencyKey(r),r=this.screenResolutionKey(r),r=this.availableScreenResolutionKey(r),r=this.timezoneOffsetKey(r),r=this.sessionStorageKey(r),r=this.localStorageKey(r),r=this.indexedDbKey(r),r=this.addBehaviorKey(r),r=this.openDatabaseKey(r),r=this.cpuClassKey(r),r=this.platformKey(r),r=this.doNotTrackKey(r),r=this.pluginsKey(r),r=this.canvasKey(r),r=this.webglKey(r),r=this.webglVendorAndRendererKey(r),r=this.adBlockKey(r),r=this.hasLiedLanguagesKey(r),r=this.hasLiedResolutionKey(r),r=this.hasLiedOsKey(r),r=this.hasLiedBrowserKey(r),r=this.touchSupportKey(r),r=this.customEntropyFunction(r),this.fontsKey(r,function(r){var n=[];t.each(r.data,function(e){var t=e.value;t&&"function"==typeof t.join&&(t=t.join(";")),n.push(t)});var i=t.x64hash128(n.join("~~~"),31);return e(i,r.data)})},customEntropyFunction:function(e){return"function"==typeof this.options.customFunction&&e.addPreprocessedComponent({key:"custom",value:this.options.customFunction()}),e},userAgentKey:function(e){return this.options.excludeUserAgent||e.addPreprocessedComponent({key:"user_agent",value:this.getUserAgent()}),e},getUserAgent:function(){return navigator.userAgent},languageKey:function(e){return this.options.excludeLanguage||e.addPreprocessedComponent({key:"language",value:navigator.language||navigator.userLanguage||navigator.browserLanguage||navigator.systemLanguage||""}),e},colorDepthKey:function(e){return this.options.excludeColorDepth||e.addPreprocessedComponent({key:"color_depth",value:window.screen.colorDepth||-1}),e},deviceMemoryKey:function(e){return this.options.excludeDeviceMemory||e.addPreprocessedComponent({key:"device_memory",value:this.getDeviceMemory()}),e},getDeviceMemory:function(){return navigator.deviceMemory||-1},pixelRatioKey:function(e){return this.options.excludePixelRatio||e.addPreprocessedComponent({key:"pixel_ratio",value:this.getPixelRatio()}),e},getPixelRatio:function(){return window.devicePixelRatio||""},screenResolutionKey:function(e){return this.options.excludeScreenResolution?e:this.getScreenResolution(e)},getScreenResolution:function(e){var t;return t=this.options.detectScreenOrientation&&window.screen.height>window.screen.width?[window.screen.height,window.screen.width]:[window.screen.width,window.screen.height],e.addPreprocessedComponent({key:"resolution",value:t}),e},availableScreenResolutionKey:function(e){return this.options.excludeAvailableScreenResolution?e:this.getAvailableScreenResolution(e)},getAvailableScreenResolution:function(e){var t;return window.screen.availWidth&&window.screen.availHeight&&(t=this.options.detectScreenOrientation?window.screen.availHeight>window.screen.availWidth?[window.screen.availHeight,window.screen.availWidth]:[window.screen.availWidth,window.screen.availHeight]:[window.screen.availHeight,window.screen.availWidth]),void 0!==t&&e.addPreprocessedComponent({key:"available_resolution",value:t}),e},timezoneOffsetKey:function(e){return this.options.excludeTimezoneOffset||e.addPreprocessedComponent({key:"timezone_offset",value:(new Date).getTimezoneOffset()}),e},sessionStorageKey:function(e){return!this.options.excludeSessionStorage&&this.hasSessionStorage()&&e.addPreprocessedComponent({key:"session_storage",value:1}),e},localStorageKey:function(e){return!this.options.excludeSessionStorage&&this.hasLocalStorage()&&e.addPreprocessedComponent({key:"local_storage",value:1}),e},indexedDbKey:function(e){return!this.options.excludeIndexedDB&&this.hasIndexedDB()&&e.addPreprocessedComponent({key:"indexed_db",value:1}),e},addBehaviorKey:function(e){return!this.options.excludeAddBehavior&&document.body&&document.body.addBehavior&&e.addPreprocessedComponent({key:"add_behavior",value:1}),e},openDatabaseKey:function(e){return!this.options.excludeOpenDatabase&&window.openDatabase&&e.addPreprocessedComponent({key:"open_database",value:1}),e},cpuClassKey:function(e){return this.options.excludeCpuClass||e.addPreprocessedComponent({key:"cpu_class",value:this.getNavigatorCpuClass()}),e},platformKey:function(e){return this.options.excludePlatform||e.addPreprocessedComponent({key:"navigator_platform",value:this.getNavigatorPlatform()}),e},doNotTrackKey:function(e){return this.options.excludeDoNotTrack||e.addPreprocessedComponent({key:"do_not_track",value:this.getDoNotTrack()}),e},canvasKey:function(e){return!this.options.excludeCanvas&&this.isCanvasSupported()&&e.addPreprocessedComponent({key:"canvas",value:this.getCanvasFp()}),e},webglKey:function(e){return!this.options.excludeWebGL&&this.isWebGlSupported()&&e.addPreprocessedComponent({key:"webgl",value:this.getWebglFp()}),e},webglVendorAndRendererKey:function(e){return!this.options.excludeWebGLVendorAndRenderer&&this.isWebGlSupported()&&e.addPreprocessedComponent({key:"webgl_vendor",value:this.getWebglVendorAndRenderer()}),e},adBlockKey:function(e){return this.options.excludeAdBlock||e.addPreprocessedComponent({key:"adblock",value:this.getAdBlock()}),e},hasLiedLanguagesKey:function(e){return this.options.excludeHasLiedLanguages||e.addPreprocessedComponent({key:"has_lied_languages",value:this.getHasLiedLanguages()}),e},hasLiedResolutionKey:function(e){return this.options.excludeHasLiedResolution||e.addPreprocessedComponent({key:"has_lied_resolution",value:this.getHasLiedResolution()}),e},hasLiedOsKey:function(e){return this.options.excludeHasLiedOs||e.addPreprocessedComponent({key:"has_lied_os",value:this.getHasLiedOs()}),e},hasLiedBrowserKey:function(e){return this.options.excludeHasLiedBrowser||e.addPreprocessedComponent({key:"has_lied_browser",value:this.getHasLiedBrowser()}),e},fontsKey:function(e,t){return this.options.excludeJsFonts?this.flashFontsKey(e,t):this.jsFontsKey(e,t)},flashFontsKey:function(e,t){return this.options.excludeFlashFonts?t(e):this.hasSwfObjectLoaded()&&this.hasMinFlashInstalled()?void 0===this.options.swfPath?t(e):void this.loadSwfAndDetectFonts(function(r){e.addPreprocessedComponent({key:"swf_fonts",value:r.join(";")}),t(e)}):t(e)},jsFontsKey:function(e,t){var r=this;return setTimeout(function(){var n=["monospace","sans-serif","serif"],i=["Andale Mono","Arial","Arial Black","Arial Hebrew","Arial MT","Arial Narrow","Arial Rounded MT Bold","Arial Unicode MS","Bitstream Vera Sans Mono","Book Antiqua","Bookman Old Style","Calibri","Cambria","Cambria Math","Century","Century Gothic","Century Schoolbook","Comic Sans","Comic Sans MS","Consolas","Courier","Courier New","Geneva","Georgia","Helvetica","Helvetica Neue","Impact","Lucida Bright","Lucida Calligraphy","Lucida Console","Lucida Fax","LUCIDA GRANDE","Lucida Handwriting","Lucida Sans","Lucida Sans Typewriter","Lucida Sans Unicode","Microsoft Sans Serif","Monaco","Monotype Corsiva","MS Gothic","MS Outlook","MS PGothic","MS Reference Sans Serif","MS Sans Serif","MS Serif","MYRIAD","MYRIAD PRO","Palatino","Palatino Linotype","Segoe Print","Segoe Script","Segoe UI","Segoe UI Light","Segoe UI Semibold","Segoe UI Symbol","Tahoma","Times","Times New Roman","Times New Roman PS","Trebuchet MS","Verdana","Wingdings","Wingdings 2","Wingdings 3"];r.options.extendedJsFonts&&(i=i.concat(["Abadi MT Condensed Light","Academy Engraved LET","ADOBE CASLON PRO","Adobe Garamond","ADOBE GARAMOND PRO","Agency FB","Aharoni","Albertus Extra Bold","Albertus Medium","Algerian","Amazone BT","American Typewriter","American Typewriter Condensed","AmerType Md BT","Andalus","Angsana New","AngsanaUPC","Antique Olive","Aparajita","Apple Chancery","Apple Color Emoji","Apple SD Gothic Neo","Arabic Typesetting","ARCHER","ARNO PRO","Arrus BT","Aurora Cn BT","AvantGarde Bk BT","AvantGarde Md BT","AVENIR","Ayuthaya","Bandy","Bangla Sangam MN","Bank Gothic","BankGothic Md BT","Baskerville","Baskerville Old Face","Batang","BatangChe","Bauer Bodoni","Bauhaus 93","Bazooka","Bell MT","Bembo","Benguiat Bk BT","Berlin Sans FB","Berlin Sans FB Demi","Bernard MT Condensed","BernhardFashion BT","BernhardMod BT","Big Caslon","BinnerD","Blackadder ITC","BlairMdITC TT","Bodoni 72","Bodoni 72 Oldstyle","Bodoni 72 Smallcaps","Bodoni MT","Bodoni MT Black","Bodoni MT Condensed","Bodoni MT Poster Compressed","Bookshelf Symbol 7","Boulder","Bradley Hand","Bradley Hand ITC","Bremen Bd BT","Britannic Bold","Broadway","Browallia New","BrowalliaUPC","Brush Script MT","Californian FB","Calisto MT","Calligrapher","Candara","CaslonOpnface BT","Castellar","Centaur","Cezanne","CG Omega","CG Times","Chalkboard","Chalkboard SE","Chalkduster","Charlesworth","Charter Bd BT","Charter BT","Chaucer","ChelthmITC Bk BT","Chiller","Clarendon","Clarendon Condensed","CloisterBlack BT","Cochin","Colonna MT","Constantia","Cooper Black","Copperplate","Copperplate Gothic","Copperplate Gothic Bold","Copperplate Gothic Light","CopperplGoth Bd BT","Corbel","Cordia New","CordiaUPC","Cornerstone","Coronet","Cuckoo","Curlz MT","DaunPenh","Dauphin","David","DB LCD Temp","DELICIOUS","Denmark","DFKai-SB","Didot","DilleniaUPC","DIN","DokChampa","Dotum","DotumChe","Ebrima","Edwardian Script ITC","Elephant","English 111 Vivace BT","Engravers MT","EngraversGothic BT","Eras Bold ITC","Eras Demi ITC","Eras Light ITC","Eras Medium ITC","EucrosiaUPC","Euphemia","Euphemia UCAS","EUROSTILE","Exotc350 Bd BT","FangSong","Felix Titling","Fixedsys","FONTIN","Footlight MT Light","Forte","FrankRuehl","Fransiscan","Freefrm721 Blk BT","FreesiaUPC","Freestyle Script","French Script MT","FrnkGothITC Bk BT","Fruitger","FRUTIGER","Futura","Futura Bk BT","Futura Lt BT","Futura Md BT","Futura ZBlk BT","FuturaBlack BT","Gabriola","Galliard BT","Gautami","Geeza Pro","Geometr231 BT","Geometr231 Hv BT","Geometr231 Lt BT","GeoSlab 703 Lt BT","GeoSlab 703 XBd BT","Gigi","Gill Sans","Gill Sans MT","Gill Sans MT Condensed","Gill Sans MT Ext Condensed Bold","Gill Sans Ultra Bold","Gill Sans Ultra Bold Condensed","Gisha","Gloucester MT Extra Condensed","GOTHAM","GOTHAM BOLD","Goudy Old Style","Goudy Stout","GoudyHandtooled BT","GoudyOLSt BT","Gujarati Sangam MN","Gulim","GulimChe","Gungsuh","GungsuhChe","Gurmukhi MN","Haettenschweiler","Harlow Solid Italic","Harrington","Heather","Heiti SC","Heiti TC","HELV","Herald","High Tower Text","Hiragino Kaku Gothic ProN","Hiragino Mincho ProN","Hoefler Text","Humanst 521 Cn BT","Humanst521 BT","Humanst521 Lt BT","Imprint MT Shadow","Incised901 Bd BT","Incised901 BT","Incised901 Lt BT","INCONSOLATA","Informal Roman","Informal011 BT","INTERSTATE","IrisUPC","Iskoola Pota","JasmineUPC","Jazz LET","Jenson","Jester","Jokerman","Juice ITC","Kabel Bk BT","Kabel Ult BT","Kailasa","KaiTi","Kalinga","Kannada Sangam MN","Kartika","Kaufmann Bd BT","Kaufmann BT","Khmer UI","KodchiangUPC","Kokila","Korinna BT","Kristen ITC","Krungthep","Kunstler Script","Lao UI","Latha","Leelawadee","Letter Gothic","Levenim MT","LilyUPC","Lithograph","Lithograph Light","Long Island","Lydian BT","Magneto","Maiandra GD","Malayalam Sangam MN","Malgun Gothic","Mangal","Marigold","Marion","Marker Felt","Market","Marlett","Matisse ITC","Matura MT Script Capitals","Meiryo","Meiryo UI","Microsoft Himalaya","Microsoft JhengHei","Microsoft New Tai Lue","Microsoft PhagsPa","Microsoft Tai Le","Microsoft Uighur","Microsoft YaHei","Microsoft Yi Baiti","MingLiU","MingLiU_HKSCS","MingLiU_HKSCS-ExtB","MingLiU-ExtB","Minion","Minion Pro","Miriam","Miriam Fixed","Mistral","Modern","Modern No. 20","Mona Lisa Solid ITC TT","Mongolian Baiti","MONO","MoolBoran","Mrs Eaves","MS LineDraw","MS Mincho","MS PMincho","MS Reference Specialty","MS UI Gothic","MT Extra","MUSEO","MV Boli","Nadeem","Narkisim","NEVIS","News Gothic","News GothicMT","NewsGoth BT","Niagara Engraved","Niagara Solid","Noteworthy","NSimSun","Nyala","OCR A Extended","Old Century","Old English Text MT","Onyx","Onyx BT","OPTIMA","Oriya Sangam MN","OSAKA","OzHandicraft BT","Palace Script MT","Papyrus","Parchment","Party LET","Pegasus","Perpetua","Perpetua Titling MT","PetitaBold","Pickwick","Plantagenet Cherokee","Playbill","PMingLiU","PMingLiU-ExtB","Poor Richard","Poster","PosterBodoni BT","PRINCETOWN LET","Pristina","PTBarnum BT","Pythagoras","Raavi","Rage Italic","Ravie","Ribbon131 Bd BT","Rockwell","Rockwell Condensed","Rockwell Extra Bold","Rod","Roman","Sakkal Majalla","Santa Fe LET","Savoye LET","Sceptre","Script","Script MT Bold","SCRIPTINA","Serifa","Serifa BT","Serifa Th BT","ShelleyVolante BT","Sherwood","Shonar Bangla","Showcard Gothic","Shruti","Signboard","SILKSCREEN","SimHei","Simplified Arabic","Simplified Arabic Fixed","SimSun","SimSun-ExtB","Sinhala Sangam MN","Sketch Rockwell","Skia","Small Fonts","Snap ITC","Snell Roundhand","Socket","Souvenir Lt BT","Staccato222 BT","Steamer","Stencil","Storybook","Styllo","Subway","Swis721 BlkEx BT","Swiss911 XCm BT","Sylfaen","Synchro LET","System","Tamil Sangam MN","Technical","Teletype","Telugu Sangam MN","Tempus Sans ITC","Terminal","Thonburi","Traditional Arabic","Trajan","TRAJAN PRO","Tristan","Tubular","Tunga","Tw Cen MT","Tw Cen MT Condensed","Tw Cen MT Condensed Extra Bold","TypoUpright BT","Unicorn","Univers","Univers CE 55 Medium","Univers Condensed","Utsaah","Vagabond","Vani","Vijaya","Viner Hand ITC","VisualUI","Vivaldi","Vladimir Script","Vrinda","Westminster","WHITNEY","Wide Latin","ZapfEllipt BT","ZapfHumnst BT","ZapfHumnst Dm BT","Zapfino","Zurich BlkEx BT","Zurich Ex BT","ZWAdobeF"])),i=(i=i.concat(r.options.userDefinedFonts)).filter(function(e,t){return i.indexOf(e)===t});var a=document.getElementsByTagName("body")[0],o=document.createElement("div"),s=document.createElement("div"),l={},d={},h=function(){var e=document.createElement("span");return e.style.position="absolute",e.style.left="-9999px",e.style.fontSize="72px",e.style.fontStyle="normal",e.style.fontWeight="normal",e.style.letterSpacing="normal",e.style.lineBreak="auto",e.style.lineHeight="normal",e.style.textTransform="none",e.style.textAlign="left",e.style.textDecoration="none",e.style.textShadow="none",e.style.whiteSpace="normal",e.style.wordBreak="normal",e.style.wordSpacing="normal",e.innerHTML="mmmmmmmmmmlli",e},c=function(e){for(var t=!1,r=0;r<n.length;r++)if(t=e[r].offsetWidth!==l[n[r]]||e[r].offsetHeight!==d[n[r]])return t;return t},u=function(){for(var e=[],t=0,r=n.length;t<r;t++){var i=h();i.style.fontFamily=n[t],o.appendChild(i),e.push(i)}return e}();a.appendChild(o);for(var g=0,p=n.length;g<p;g++)l[n[g]]=u[g].offsetWidth,d[n[g]]=u[g].offsetHeight;var m=function(){for(var e,t,r,a={},o=0,l=i.length;o<l;o++){for(var d=[],c=0,u=n.length;c<u;c++){var g=(e=i[o],t=n[c],r=void 0,(r=h()).style.fontFamily="'"+e+"',"+t,r);s.appendChild(g),d.push(g)}a[i[o]]=d}return a}();a.appendChild(s);for(var f=[],S=0,T=i.length;S<T;S++)c(m[i[S]])&&f.push(i[S]);a.removeChild(s),a.removeChild(o),e.addPreprocessedComponent({key:"js_fonts",value:f}),t(e)},1)},pluginsKey:function(e){return this.options.excludePlugins||(this.isIE()?this.options.excludeIEPlugins||e.addPreprocessedComponent({key:"ie_plugins",value:this.getIEPlugins()}):e.addPreprocessedComponent({key:"regular_plugins",value:this.getRegularPlugins()})),e},getRegularPlugins:function(){var e=[];if(navigator.plugins)for(var t=0,r=navigator.plugins.length;t<r;t++)navigator.plugins[t]&&e.push(navigator.plugins[t]);return this.pluginsShouldBeSorted()&&(e=e.sort(function(e,t){return e.name>t.name?1:e.name<t.name?-1:0})),this.map(e,function(e){var t=this.map(e,function(e){return[e.type,e.suffixes].join("~")}).join(",");return[e.name,e.description,t].join("::")},this)},getIEPlugins:function(){var e=[];if(Object.getOwnPropertyDescriptor&&Object.getOwnPropertyDescriptor(window,"ActiveXObject")||"ActiveXObject"in window){e=this.map(["AcroPDF.PDF","Adodb.Stream","AgControl.AgControl","DevalVRXCtrl.DevalVRXCtrl.1","MacromediaFlashPaper.MacromediaFlashPaper","Msxml2.DOMDocument","Msxml2.XMLHTTP","PDF.PdfCtrl","QuickTime.QuickTime","QuickTimeCheckObject.QuickTimeCheck.1","RealPlayer","RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)","RealVideo.RealVideo(tm) ActiveX Control (32-bit)","Scripting.Dictionary","SWCtl.SWCtl","Shell.UIHelper","ShockwaveFlash.ShockwaveFlash","Skype.Detection","TDCCtl.TDCCtl","WMPlayer.OCX","rmocx.RealPlayer G2 Control","rmocx.RealPlayer G2 Control.1"],function(e){try{return new window.ActiveXObject(e),e}catch(e){return null}})}return navigator.plugins&&(e=e.concat(this.getRegularPlugins())),e},pluginsShouldBeSorted:function(){for(var e=!1,t=0,r=this.options.sortPluginsFor.length;t<r;t++){var n=this.options.sortPluginsFor[t];if(navigator.userAgent.match(n)){e=!0;break}}return e},touchSupportKey:function(e){return this.options.excludeTouchSupport||e.addPreprocessedComponent({key:"touch_support",value:this.getTouchSupport()}),e},hardwareConcurrencyKey:function(e){return this.options.excludeHardwareConcurrency||e.addPreprocessedComponent({key:"hardware_concurrency",value:this.getHardwareConcurrency()}),e},hasSessionStorage:function(){try{return!!window.sessionStorage}catch(e){return!0}},hasLocalStorage:function(){try{return!!window.localStorage}catch(e){return!0}},hasIndexedDB:function(){try{return!!window.indexedDB}catch(e){return!0}},getHardwareConcurrency:function(){return navigator.hardwareConcurrency?navigator.hardwareConcurrency:"unknown"},getNavigatorCpuClass:function(){return navigator.cpuClass?navigator.cpuClass:"unknown"},getNavigatorPlatform:function(){return navigator.platform?navigator.platform:"unknown"},getDoNotTrack:function(){return navigator.doNotTrack?navigator.doNotTrack:navigator.msDoNotTrack?navigator.msDoNotTrack:window.doNotTrack?window.doNotTrack:"unknown"},getTouchSupport:function(){var e=0,t=!1;void 0!==navigator.maxTouchPoints?e=navigator.maxTouchPoints:void 0!==navigator.msMaxTouchPoints&&(e=navigator.msMaxTouchPoints);try{document.createEvent("TouchEvent"),t=!0}catch(e){}return[e,t,"ontouchstart"in window]},getCanvasFp:function(){var e=[],t=document.createElement("canvas");t.width=2e3,t.height=200,t.style.display="inline";var r=t.getContext("2d");return r.rect(0,0,10,10),r.rect(2,2,6,6),e.push("canvas winding:"+(!1===r.isPointInPath(5,5,"evenodd")?"yes":"no")),r.textBaseline="alphabetic",r.fillStyle="#f60",r.fillRect(125,1,62,20),r.fillStyle="#069",this.options.dontUseFakeFontInCanvas?r.font="11pt Arial":r.font="11pt no-real-font-123",r.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03",2,15),r.fillStyle="rgba(102, 204, 0, 0.2)",r.font="18pt Arial",r.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03",4,45),r.globalCompositeOperation="multiply",r.fillStyle="rgb(255,0,255)",r.beginPath(),r.arc(50,50,50,0,2*Math.PI,!0),r.closePath(),r.fill(),r.fillStyle="rgb(0,255,255)",r.beginPath(),r.arc(100,50,50,0,2*Math.PI,!0),r.closePath(),r.fill(),r.fillStyle="rgb(255,255,0)",r.beginPath(),r.arc(75,100,50,0,2*Math.PI,!0),r.closePath(),r.fill(),r.fillStyle="rgb(255,0,255)",r.arc(75,75,75,0,2*Math.PI,!0),r.arc(75,75,25,0,2*Math.PI,!0),r.fill("evenodd"),t.toDataURL&&e.push("canvas fp:"+t.toDataURL()),e.join("~")},getWebglFp:function(){var e,t=function(t){return e.clearColor(0,0,0,1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),"["+t[0]+", "+t[1]+"]"};if(!(e=this.getWebglCanvas()))return null;var r=[],n=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,n);var i=new Float32Array([-.2,-.9,0,.4,-.26,0,0,.732134444,0]);e.bufferData(e.ARRAY_BUFFER,i,e.STATIC_DRAW),n.itemSize=3,n.numItems=3;var a=e.createProgram(),o=e.createShader(e.VERTEX_SHADER);e.shaderSource(o,"attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"),e.compileShader(o);var s=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(s,"precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"),e.compileShader(s),e.attachShader(a,o),e.attachShader(a,s),e.linkProgram(a),e.useProgram(a),a.vertexPosAttrib=e.getAttribLocation(a,"attrVertex"),a.offsetUniform=e.getUniformLocation(a,"uniformOffset"),e.enableVertexAttribArray(a.vertexPosArray),e.vertexAttribPointer(a.vertexPosAttrib,n.itemSize,e.FLOAT,!1,0,0),e.uniform2f(a.offsetUniform,1,1),e.drawArrays(e.TRIANGLE_STRIP,0,n.numItems);try{r.push(e.canvas.toDataURL())}catch(e){}r.push("extensions:"+(e.getSupportedExtensions()||[]).join(";")),r.push("webgl aliased line width range:"+t(e.getParameter(e.ALIASED_LINE_WIDTH_RANGE))),r.push("webgl aliased point size range:"+t(e.getParameter(e.ALIASED_POINT_SIZE_RANGE))),r.push("webgl alpha bits:"+e.getParameter(e.ALPHA_BITS)),r.push("webgl antialiasing:"+(e.getContextAttributes().antialias?"yes":"no")),r.push("webgl blue bits:"+e.getParameter(e.BLUE_BITS)),r.push("webgl depth bits:"+e.getParameter(e.DEPTH_BITS)),r.push("webgl green bits:"+e.getParameter(e.GREEN_BITS)),r.push("webgl max anisotropy:"+function(e){var t=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic");if(t){var r=e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT);return 0===r&&(r=2),r}return null}(e)),r.push("webgl max combined texture image units:"+e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),r.push("webgl max cube map texture size:"+e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE)),r.push("webgl max fragment uniform vectors:"+e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS)),r.push("webgl max render buffer size:"+e.getParameter(e.MAX_RENDERBUFFER_SIZE)),r.push("webgl max texture image units:"+e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)),r.push("webgl max texture size:"+e.getParameter(e.MAX_TEXTURE_SIZE)),r.push("webgl max varying vectors:"+e.getParameter(e.MAX_VARYING_VECTORS)),r.push("webgl max vertex attribs:"+e.getParameter(e.MAX_VERTEX_ATTRIBS)),r.push("webgl max vertex texture image units:"+e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)),r.push("webgl max vertex uniform vectors:"+e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS)),r.push("webgl max viewport dims:"+t(e.getParameter(e.MAX_VIEWPORT_DIMS))),r.push("webgl red bits:"+e.getParameter(e.RED_BITS)),r.push("webgl renderer:"+e.getParameter(e.RENDERER)),r.push("webgl shading language version:"+e.getParameter(e.SHADING_LANGUAGE_VERSION)),r.push("webgl stencil bits:"+e.getParameter(e.STENCIL_BITS)),r.push("webgl vendor:"+e.getParameter(e.VENDOR)),r.push("webgl version:"+e.getParameter(e.VERSION));try{var l=e.getExtension("WEBGL_debug_renderer_info");l&&(r.push("webgl unmasked vendor:"+e.getParameter(l.UNMASKED_VENDOR_WEBGL)),r.push("webgl unmasked renderer:"+e.getParameter(l.UNMASKED_RENDERER_WEBGL)))}catch(e){}return e.getShaderPrecisionFormat?(r.push("webgl vertex shader high float precision:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision),r.push("webgl vertex shader high float precision rangeMin:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).rangeMin),r.push("webgl vertex shader high float precision rangeMax:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).rangeMax),r.push("webgl vertex shader medium float precision:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision),r.push("webgl vertex shader medium float precision rangeMin:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).rangeMin),r.push("webgl vertex shader medium float precision rangeMax:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).rangeMax),r.push("webgl vertex shader low float precision:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.LOW_FLOAT).precision),r.push("webgl vertex shader low float precision rangeMin:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.LOW_FLOAT).rangeMin),r.push("webgl vertex shader low float precision rangeMax:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.LOW_FLOAT).rangeMax),r.push("webgl fragment shader high float precision:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision),r.push("webgl fragment shader high float precision rangeMin:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).rangeMin),r.push("webgl fragment shader high float precision rangeMax:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).rangeMax),r.push("webgl fragment shader medium float precision:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision),r.push("webgl fragment shader medium float precision rangeMin:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).rangeMin),r.push("webgl fragment shader medium float precision rangeMax:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).rangeMax),r.push("webgl fragment shader low float precision:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.LOW_FLOAT).precision),r.push("webgl fragment shader low float precision rangeMin:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.LOW_FLOAT).rangeMin),r.push("webgl fragment shader low float precision rangeMax:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.LOW_FLOAT).rangeMax),r.push("webgl vertex shader high int precision:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_INT).precision),r.push("webgl vertex shader high int precision rangeMin:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_INT).rangeMin),r.push("webgl vertex shader high int precision rangeMax:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_INT).rangeMax),r.push("webgl vertex shader medium int precision:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_INT).precision),r.push("webgl vertex shader medium int precision rangeMin:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_INT).rangeMin),r.push("webgl vertex shader medium int precision rangeMax:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_INT).rangeMax),r.push("webgl vertex shader low int precision:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.LOW_INT).precision),r.push("webgl vertex shader low int precision rangeMin:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.LOW_INT).rangeMin),r.push("webgl vertex shader low int precision rangeMax:"+e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.LOW_INT).rangeMax),r.push("webgl fragment shader high int precision:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_INT).precision),r.push("webgl fragment shader high int precision rangeMin:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_INT).rangeMin),r.push("webgl fragment shader high int precision rangeMax:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_INT).rangeMax),r.push("webgl fragment shader medium int precision:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_INT).precision),r.push("webgl fragment shader medium int precision rangeMin:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_INT).rangeMin),r.push("webgl fragment shader medium int precision rangeMax:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_INT).rangeMax),r.push("webgl fragment shader low int precision:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.LOW_INT).precision),r.push("webgl fragment shader low int precision rangeMin:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.LOW_INT).rangeMin),r.push("webgl fragment shader low int precision rangeMax:"+e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.LOW_INT).rangeMax),r.join("~")):r.join("~")},getWebglVendorAndRenderer:function(){try{var e=this.getWebglCanvas(),t=e.getExtension("WEBGL_debug_renderer_info");return e.getParameter(t.UNMASKED_VENDOR_WEBGL)+"~"+e.getParameter(t.UNMASKED_RENDERER_WEBGL)}catch(e){return null}},getAdBlock:function(){var e=document.createElement("div");e.innerHTML="&nbsp;",e.className="adsbox";var t=!1;try{document.body.appendChild(e),t=0===document.getElementsByClassName("adsbox")[0].offsetHeight,document.body.removeChild(e)}catch(e){t=!1}return t},getHasLiedLanguages:function(){if(void 0!==navigator.languages)try{if(navigator.languages[0].substr(0,2)!==navigator.language.substr(0,2))return!0}catch(e){return!0}return!1},getHasLiedResolution:function(){return window.screen.width<window.screen.availWidth||window.screen.height<window.screen.availHeight},getHasLiedOs:function(){var e,t=navigator.userAgent.toLowerCase(),r=navigator.oscpu,n=navigator.platform.toLowerCase();if(e=t.indexOf("windows phone")>=0?"Windows Phone":t.indexOf("win")>=0?"Windows":t.indexOf("android")>=0?"Android":t.indexOf("linux")>=0?"Linux":t.indexOf("iphone")>=0||t.indexOf("ipad")>=0?"iOS":t.indexOf("mac")>=0?"Mac":"Other",("ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0)&&"Windows Phone"!==e&&"Android"!==e&&"iOS"!==e&&"Other"!==e)return!0;if(void 0!==r){if((r=r.toLowerCase()).indexOf("win")>=0&&"Windows"!==e&&"Windows Phone"!==e)return!0;if(r.indexOf("linux")>=0&&"Linux"!==e&&"Android"!==e)return!0;if(r.indexOf("mac")>=0&&"Mac"!==e&&"iOS"!==e)return!0;if((-1===r.indexOf("win")&&-1===r.indexOf("linux")&&-1===r.indexOf("mac"))!=("Other"===e))return!0}return n.indexOf("win")>=0&&"Windows"!==e&&"Windows Phone"!==e||((n.indexOf("linux")>=0||n.indexOf("android")>=0||n.indexOf("pike")>=0)&&"Linux"!==e&&"Android"!==e||((n.indexOf("mac")>=0||n.indexOf("ipad")>=0||n.indexOf("ipod")>=0||n.indexOf("iphone")>=0)&&"Mac"!==e&&"iOS"!==e||((-1===n.indexOf("win")&&-1===n.indexOf("linux")&&-1===n.indexOf("mac"))!=("Other"===e)||void 0===navigator.plugins&&"Windows"!==e&&"Windows Phone"!==e)))},getHasLiedBrowser:function(){var e,t=navigator.userAgent.toLowerCase(),r=navigator.productSub;if(("Chrome"===(e=t.indexOf("firefox")>=0?"Firefox":t.indexOf("opera")>=0||t.indexOf("opr")>=0?"Opera":t.indexOf("chrome")>=0?"Chrome":t.indexOf("safari")>=0?"Safari":t.indexOf("trident")>=0?"Internet Explorer":"Other")||"Safari"===e||"Opera"===e)&&"20030107"!==r)return!0;var n,i=eval.toString().length;if(37===i&&"Safari"!==e&&"Firefox"!==e&&"Other"!==e)return!0;if(39===i&&"Internet Explorer"!==e&&"Other"!==e)return!0;if(33===i&&"Chrome"!==e&&"Opera"!==e&&"Other"!==e)return!0;try{throw"a"}catch(e){try{e.toSource(),n=!0}catch(e){n=!1}}return!(!n||"Firefox"===e||"Other"===e)},isCanvasSupported:function(){var e=document.createElement("canvas");return!(!e.getContext||!e.getContext("2d"))},isWebGlSupported:function(){if(!this.isCanvasSupported())return!1;var e=this.getWebglCanvas();return!!window.WebGLRenderingContext&&!!e},isIE:function(){return"Microsoft Internet Explorer"===navigator.appName||!("Netscape"!==navigator.appName||!/Trident/.test(navigator.userAgent))},hasSwfObjectLoaded:function(){return void 0!==window.swfobject},hasMinFlashInstalled:function(){return window.swfobject.hasFlashPlayerVersion("9.0.0")},addFlashDivNode:function(){var e=document.createElement("div");e.setAttribute("id",this.options.swfContainerId),document.body.appendChild(e)},loadSwfAndDetectFonts:function(e){var t="___fp_swf_loaded";window[t]=function(t){e(t)};var r=this.options.swfContainerId;this.addFlashDivNode();var n={onReady:t};window.swfobject.embedSWF(this.options.swfPath,r,"1","1","9.0.0",!1,n,{allowScriptAccess:"always",menu:"false"},{})},getWebglCanvas:function(){var e=document.createElement("canvas"),t=null;try{t=e.getContext("webgl")||e.getContext("experimental-webgl")}catch(e){}return t||(t=null),t},each:function(e,t,r){if(null!==e)if(this.nativeForEach&&e.forEach===this.nativeForEach)e.forEach(t,r);else if(e.length===+e.length){for(var n=0,i=e.length;n<i;n++)if(t.call(r,e[n],n,e)==={})return}else for(var a in e)if(e.hasOwnProperty(a)&&t.call(r,e[a],a,e)==={})return},map:function(e,t,r){var n=[];return null==e?n:this.nativeMap&&e.map===this.nativeMap?e.map(t,r):(this.each(e,function(e,i,a){n[n.length]=t.call(r,e,i,a)}),n)},x64Add:function(e,t){e=[e[0]>>>16,65535&e[0],e[1]>>>16,65535&e[1]],t=[t[0]>>>16,65535&t[0],t[1]>>>16,65535&t[1]];var r=[0,0,0,0];return r[3]+=e[3]+t[3],r[2]+=r[3]>>>16,r[3]&=65535,r[2]+=e[2]+t[2],r[1]+=r[2]>>>16,r[2]&=65535,r[1]+=e[1]+t[1],r[0]+=r[1]>>>16,r[1]&=65535,r[0]+=e[0]+t[0],r[0]&=65535,[r[0]<<16|r[1],r[2]<<16|r[3]]},x64Multiply:function(e,t){e=[e[0]>>>16,65535&e[0],e[1]>>>16,65535&e[1]],t=[t[0]>>>16,65535&t[0],t[1]>>>16,65535&t[1]];var r=[0,0,0,0];return r[3]+=e[3]*t[3],r[2]+=r[3]>>>16,r[3]&=65535,r[2]+=e[2]*t[3],r[1]+=r[2]>>>16,r[2]&=65535,r[2]+=e[3]*t[2],r[1]+=r[2]>>>16,r[2]&=65535,r[1]+=e[1]*t[3],r[0]+=r[1]>>>16,r[1]&=65535,r[1]+=e[2]*t[2],r[0]+=r[1]>>>16,r[1]&=65535,r[1]+=e[3]*t[1],r[0]+=r[1]>>>16,r[1]&=65535,r[0]+=e[0]*t[3]+e[1]*t[2]+e[2]*t[1]+e[3]*t[0],r[0]&=65535,[r[0]<<16|r[1],r[2]<<16|r[3]]},x64Rotl:function(e,t){return 32===(t%=64)?[e[1],e[0]]:t<32?[e[0]<<t|e[1]>>>32-t,e[1]<<t|e[0]>>>32-t]:(t-=32,[e[1]<<t|e[0]>>>32-t,e[0]<<t|e[1]>>>32-t])},x64LeftShift:function(e,t){return 0===(t%=64)?e:t<32?[e[0]<<t|e[1]>>>32-t,e[1]<<t]:[e[1]<<t-32,0]},x64Xor:function(e,t){return[e[0]^t[0],e[1]^t[1]]},x64Fmix:function(e){return e=this.x64Xor(e,[0,e[0]>>>1]),e=this.x64Multiply(e,[4283543511,3981806797]),e=this.x64Xor(e,[0,e[0]>>>1]),e=this.x64Multiply(e,[3301882366,444984403]),e=this.x64Xor(e,[0,e[0]>>>1])},x64hash128:function(e,t){e=e||"",t=t||0;for(var r=e.length%16,n=e.length-r,i=[0,t],a=[0,t],o=[0,0],s=[0,0],l=[2277735313,289559509],d=[1291169091,658871167],h=0;h<n;h+=16)o=[255&e.charCodeAt(h+4)|(255&e.charCodeAt(h+5))<<8|(255&e.charCodeAt(h+6))<<16|(255&e.charCodeAt(h+7))<<24,255&e.charCodeAt(h)|(255&e.charCodeAt(h+1))<<8|(255&e.charCodeAt(h+2))<<16|(255&e.charCodeAt(h+3))<<24],s=[255&e.charCodeAt(h+12)|(255&e.charCodeAt(h+13))<<8|(255&e.charCodeAt(h+14))<<16|(255&e.charCodeAt(h+15))<<24,255&e.charCodeAt(h+8)|(255&e.charCodeAt(h+9))<<8|(255&e.charCodeAt(h+10))<<16|(255&e.charCodeAt(h+11))<<24],o=this.x64Multiply(o,l),o=this.x64Rotl(o,31),o=this.x64Multiply(o,d),i=this.x64Xor(i,o),i=this.x64Rotl(i,27),i=this.x64Add(i,a),i=this.x64Add(this.x64Multiply(i,[0,5]),[0,1390208809]),s=this.x64Multiply(s,d),s=this.x64Rotl(s,33),s=this.x64Multiply(s,l),a=this.x64Xor(a,s),a=this.x64Rotl(a,31),a=this.x64Add(a,i),a=this.x64Add(this.x64Multiply(a,[0,5]),[0,944331445]);switch(o=[0,0],s=[0,0],r){case 15:s=this.x64Xor(s,this.x64LeftShift([0,e.charCodeAt(h+14)],48));case 14:s=this.x64Xor(s,this.x64LeftShift([0,e.charCodeAt(h+13)],40));case 13:s=this.x64Xor(s,this.x64LeftShift([0,e.charCodeAt(h+12)],32));case 12:s=this.x64Xor(s,this.x64LeftShift([0,e.charCodeAt(h+11)],24));case 11:s=this.x64Xor(s,this.x64LeftShift([0,e.charCodeAt(h+10)],16));case 10:s=this.x64Xor(s,this.x64LeftShift([0,e.charCodeAt(h+9)],8));case 9:s=this.x64Xor(s,[0,e.charCodeAt(h+8)]),s=this.x64Multiply(s,d),s=this.x64Rotl(s,33),s=this.x64Multiply(s,l),a=this.x64Xor(a,s);case 8:o=this.x64Xor(o,this.x64LeftShift([0,e.charCodeAt(h+7)],56));case 7:o=this.x64Xor(o,this.x64LeftShift([0,e.charCodeAt(h+6)],48));case 6:o=this.x64Xor(o,this.x64LeftShift([0,e.charCodeAt(h+5)],40));case 5:o=this.x64Xor(o,this.x64LeftShift([0,e.charCodeAt(h+4)],32));case 4:o=this.x64Xor(o,this.x64LeftShift([0,e.charCodeAt(h+3)],24));case 3:o=this.x64Xor(o,this.x64LeftShift([0,e.charCodeAt(h+2)],16));case 2:o=this.x64Xor(o,this.x64LeftShift([0,e.charCodeAt(h+1)],8));case 1:o=this.x64Xor(o,[0,e.charCodeAt(h)]),o=this.x64Multiply(o,l),o=this.x64Rotl(o,31),o=this.x64Multiply(o,d),i=this.x64Xor(i,o)}return i=this.x64Xor(i,[0,e.length]),a=this.x64Xor(a,[0,e.length]),i=this.x64Add(i,a),a=this.x64Add(a,i),i=this.x64Fmix(i),a=this.x64Fmix(a),i=this.x64Add(i,a),a=this.x64Add(a,i),("00000000"+(i[0]>>>0).toString(16)).slice(-8)+("00000000"+(i[1]>>>0).toString(16)).slice(-8)+("00000000"+(a[0]>>>0).toString(16)).slice(-8)+("00000000"+(a[1]>>>0).toString(16)).slice(-8)}},e.VERSION="1.8.0",e});
//FINGERPRINT


(function( $ ){
   	$.fn.clockface = function() {
   }; 
})( jQuery );


/**
 * Data can often be a complicated mix of numbers and letters (file names
 * are a common example) and sorting them in a natural manner is quite a
 * difficult problem.
 * 
 * Fortunately a deal of work has already been done in this area by other
 * authors - the following plug-in uses the [naturalSort() function by Jim
 * Palmer](http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support) to provide natural sorting in DataTables.
 *
 *  @name Natural sorting
 *  @summary Sort data with a mix of numbers and letters _naturally_.
 *  @author [Jim Palmer](http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support)
 *  @author [Michael Buehler] (https://github.com/AnimusMachina)
 *
 *  @example
 *    $('#example').dataTable( {
 *       columnDefs: [
 *         { type: 'natural', targets: 0 }
 *       ]
 *    } );
 *
 *    Html can be stripped from sorting by using 'natural-nohtml' such as
 *
 *    $('#example').dataTable( {
 *       columnDefs: [
 *    	   { type: 'natural-nohtml', targets: 0 }
 *       ]
 *    } );
 *
 */

(function() {

/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 * Contributors: Mike Grier (mgrier.com), Clint Priest, Kyle Adams, guillermo
 * See: http://js-naturalsort.googlecode.com/svn/trunk/naturalSort.js
 */
function naturalSort (a, b, html) {
	var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?%?$|^0x[0-9a-f]+$|[0-9]+)/gi,
		sre = /(^[ ]*|[ ]*$)/g,
		dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
		hre = /^0x[0-9a-f]+$/i,
		ore = /^0/,
		htmre = /(<([^>]+)>)/ig,
		// convert all to strings and trim()
		x = a.toString().replace(sre, '') || '',
		y = b.toString().replace(sre, '') || '';
		// remove html from strings if desired
		if (!html) {
			x = x.replace(htmre, '');
			y = y.replace(htmre, '');
		}
		// chunk/tokenize
	var	xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
		yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
		// numeric, hex or date detection
		xD = parseInt(x.match(hre), 10) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
		yD = parseInt(y.match(hre), 10) || xD && y.match(dre) && Date.parse(y) || null;

	// first try and sort Hex codes or Dates
	if (yD) {
		if ( xD < yD ) {
			return -1;
		}
		else if ( xD > yD )	{
			return 1;
		}
	}

	// natural sorting through split numeric strings and default strings
	for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
		// find floats not starting with '0', string or 0 if not defined (Clint Priest)
		var oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc], 10) || xN[cLoc] || 0;
		var oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc], 10) || yN[cLoc] || 0;
		// handle numeric vs string comparison - number < string - (Kyle Adams)
		if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
			return (isNaN(oFxNcL)) ? 1 : -1;
		}
		// rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
		else if (typeof oFxNcL !== typeof oFyNcL) {
			oFxNcL += '';
			oFyNcL += '';
		}
		if (oFxNcL < oFyNcL) {
			return -1;
		}
		if (oFxNcL > oFyNcL) {
			return 1;
		}
	}
	return 0;
}

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
	"natural-asc": function ( a, b ) {
		return naturalSort(a,b,true);
	},

	"natural-desc": function ( a, b ) {
		return naturalSort(a,b,true) * -1;
	},

	"natural-nohtml-asc": function( a, b ) {
		return naturalSort(a,b,false);
	},

	"natural-nohtml-desc": function( a, b ) {
		return naturalSort(a,b,false) * -1;
	},

	"natural-ci-asc": function( a, b ) {
		a = a.toString().toLowerCase();
		b = b.toString().toLowerCase();

		return naturalSort(a,b,true);
	},

	"natural-ci-desc": function( a, b ) {
		a = a.toString().toLowerCase();
		b = b.toString().toLowerCase();

		return naturalSort(a,b,true) * -1;
	}
} );

}());


!function ($) {
  "use strict";
  // version: 2.8
  // by Mattia Larentis - follow me on twitter! @SpiritualGuru

  var addToAttribute = function (obj, array, value) {
    var i = 0
      , length = array.length;

    for (; i < length; i++) {
      obj = obj[array[i]] = obj[array[i]] || i == ( length - 1) ? value : {}
    }
  };

  $.fn.toggleButtons = function (method) {
    var $element
      , $div
      , transitionSpeed = 0.05
      , methods = {
        init: function (opt) {
          this.each(function () {
              var $spanLeft
                , $spanRight
                , options
                , moving
                , dataAttribute = {};

              $element = $(this);
              $element.addClass('toggle-button');

              $.each($element.data(), function (i, el) {
                var key
                  , tmp = {};

                if (i.indexOf("togglebutton") === 0) {
                  key = i.match(/[A-Z][a-z]+/g);
                  key = $.map(key, function (n) {
                    return (n.toLowerCase());
                  });

                  addToAttribute(tmp, key, el);
                  dataAttribute = $.extend(true, dataAttribute, tmp);
                }
              });

              options = $.extend(true, {}, $.fn.toggleButtons.defaults, opt, dataAttribute);

              $(this).data('options', options);

              $spanLeft = $('<span></span>').addClass("labelLeft").text(options.label.enabled === undefined ? "ON" : options.label.enabled);
              $spanRight = $('<span></span>').addClass("labelRight").text(options.label.disabled === undefined ? "OFF " : options.label.disabled);

              // html layout
              $div = $element.find('input:checkbox').wrap($('<div></div>')).parent();
              $div.append($spanLeft);
              $div.append($('<label></label>').attr('for', $element.find('input').attr('id')));
              $div.append($spanRight);

              if ($element.find('input').is(':checked'))
                $element.find('>div').css('left', "0");
              else $element.find('>div').css('left', "-50%");

              if (options.animated) {
                if (options.transitionspeed !== undefined)
                  if (/^(\d*%$)/.test(options.transitionspeed))  // is a percent value?
                    transitionSpeed = 0.05 * parseInt(options.transitionspeed) / 100;
                  else
                    transitionSpeed = options.transitionspeed;
              }
              else transitionSpeed = 0;

              $(this).data('transitionSpeed', transitionSpeed * 1000);


              options["width"] /= 2;

              // width of the bootstrap-toggle-button
              $element
                .css('width', options.width * 2)
                .find('>div').css('width', options.width * 3)
                .find('>span, >label').css('width', options.width);

              // height of the bootstrap-toggle-button
              $element
                .css('height', options.height)
                .find('span, label')
                .css('height', options.height)
                .filter('span')
                .css('line-height', options.height + "px");

              if ($element.find('input').is(':disabled'))
                $(this).addClass('deactivate');

              $element.find('span').css(options.font);


              // enabled custom color
              if (options.style.enabled === undefined) {
                if (options.style.custom !== undefined && options.style.custom.enabled !== undefined && options.style.custom.enabled.background !== undefined) {
                  $spanLeft.css('color', options.style.custom.enabled.color);
                  if (options.style.custom.enabled.gradient === undefined)
                    $spanLeft.css('background', options.style.custom.enabled.background);
                  else $.each(["-webkit-", "-moz-", "-o-", ""], function (i, el) {
                    $spanLeft.css('background-image', el + 'linear-gradient(top, ' + options.style.custom.enabled.background + ',' + options.style.custom.enabled.gradient + ')');
                  });
                }
              }
              else $spanLeft.addClass(options.style.enabled);

              // disabled custom color
              if (options.style.disabled === undefined) {
                if (options.style.custom !== undefined && options.style.custom.disabled !== undefined && options.style.custom.disabled.background !== undefined) {
                  $spanRight.css('color', options.style.custom.disabled.color);
                  if (options.style.custom.disabled.gradient === undefined)
                    $spanRight.css('background', options.style.custom.disabled.background);
                  else $.each(["-webkit-", "-moz-", "-o-", ""], function (i, el) {
                    $spanRight.css('background-image', el + 'linear-gradient(top, ' + options.style.custom.disabled.background + ',' + options.style.custom.disabled.gradient + ')');
                  });
                }
              }
              else $spanRight.addClass(options.style.disabled);

              var changeStatus = function ($this) {
                $this.siblings('label')
                  .trigger('mousedown')
                  .trigger('mouseup')
                  .trigger('click');
              };

              $spanLeft.on('click', function (e) {
                changeStatus($(this));
              });
              $spanRight.on('click', function (e) {
                changeStatus($(this));
              });

              $element.find('input').on('change', function (e, skipOnChange) {
                var $element = $(this).parent()
                  , active = $(this).is(':checked')
                  , $toggleButton = $(this).closest('.toggle-button');

                $element.stop().animate({'left': active ? '0' : '-50%'}, $toggleButton.data('transitionSpeed'));

                options = $toggleButton.data('options');

                if (!skipOnChange)
                  options.onChange($element, active, e);
              });

              $element.find('label').on('mousedown touchstart', function (e) {
                moving = false;
                e.preventDefault();
                e.stopImmediatePropagation();

                if ($(this).closest('.toggle-button').is('.deactivate'))
                  $(this).off('click');
                else {
                  $(this).on('mousemove touchmove', function (e) {
                    var $element = $(this).closest('.toggle-button')
                      , relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left
                      , percent = ((relativeX / (options.width * 2)) * 100);
                    moving = true;

                    e.stopImmediatePropagation();
                    e.preventDefault();

                    if (percent < 25)
                      percent = 25;
                    else if (percent > 75)
                      percent = 75;

                    $element.find('>div').css('left', (percent - 75) + "%");
                  });

                  $(this).on('click touchend', function (e) {
                    var $target = $(e.target)
                      , $myCheckBox = $target.siblings('input');

                    e.stopImmediatePropagation();
                    e.preventDefault();
                    $(this).off('mouseleave');

                    if (moving)
                      if (parseInt($(this).parent().css('left')) < -25)
                        $myCheckBox.attr('checked', false);
                      else $myCheckBox.attr('checked', true);
                    else $myCheckBox.attr("checked", !$myCheckBox.is(":checked"));

                    $myCheckBox.trigger('change');
                  });

                  $(this).on('mouseleave', function (e) {
                    var $myCheckBox = $(this).siblings('input');

                    e.preventDefault();
                    e.stopImmediatePropagation();

                    $(this).off('mouseleave');
                    $(this).trigger('mouseup');

                    if (parseInt($(this).parent().css('left')) < -25)
                      $myCheckBox.attr('checked', false);
                    else $myCheckBox.attr('checked', true);

                    $myCheckBox.trigger('change');
                  });

                  $(this).on('mouseup', function (e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    $(this).off('mousemove');
                  });
                }
              });
            }
          );
          return this;
        },
        toggleActivation: function () {
          $(this).toggleClass('deactivate');
        },
        toggleState: function (skipOnChange) {
          var $input = $(this).find('input');
          $input.attr('checked', !$input.is(':checked')).trigger('change', skipOnChange);
        },
        setState: function(value, skipOnChange) {
          $(this).find('input').attr('checked', value).trigger('change', skipOnChange);
        },
        status: function () {
          return $(this).find('input:checkbox').is(':checked');
        },
        destroy: function () {
          var $div = $(this).find('div')
            , $checkbox;

          $div.find(':not(input:checkbox)').remove();

          $checkbox = $div.children();
          $checkbox.unwrap().unwrap();

          $checkbox.unbind('change');

          return $checkbox;
        }
      };

    if (methods[method])
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    else if (typeof method === 'object' || !method)
      return methods.init.apply(this, arguments);
    else
      $.error('Method ' + method + ' does not exist!');
  };

  $.fn.toggleButtons.defaults = {
    onChange: function () {
    },
    width: 100,
    height: 25,
    font: {},
    animated: true,
    transitionspeed: 0.2,
    label: {
      enabled: undefined,
      disabled: undefined
    },
    style: {
      enabled: undefined,
      disabled: undefined,
      custom: {
        enabled: {
          background: undefined,
          gradient: undefined,
          color: "#FFFFFF"
        },
        disabled: {
          background: undefined,
          gradient: undefined,
          color: "#FFFFFF"
        }
      }
    }
  };
}($);
