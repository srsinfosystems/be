var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var partner_name = $('#PartnerName').val();
var host_url = $('#HOST_URL').val();
var anc_meta;
var anc_dt;
var anc_popid = 'popups';
var anc_td;
var glkey=0;
var getcitypost = [];
var getcitydelivery = [];

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();
if(checkNull(date_format_partner)!=''){
	date_format = date_format_partner;
}
var custom_fields = [];
var add_new_customer = {
	start:function(popupid,metadata={}){
		anc_popid = popupid;
		anc_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Close','Add new customer','Manual registration','EIN or phone number','Please enter valid ein or phone number','Alert message','No record found','EIN','Customer cellphone','Customer landline','Go to customer','Name','View grouped data','Potential matches already in our system','Organisation name','View ungrouped data','Address','Select','Property','Value','Customer name','Customer information','Customer country','Customer type','EIN','Company name','First name','Last name','Date of birth','Contact information','Customer email','Customer landline','Sales and communication','Preferred distribution','Alternate distribution','Invoice contact','Custom invoice email','Customer group','Price group','Other information','Newsletters and updates','This field is required','Save and create new sales document','Save and create new task','Back','Postal address 1','Postal address 2','Postal zip','Postal city','Click here to set postal address','Click here to set delivery address','Delivery address 1','Delivery address 2','Delivery zip','Delivery city','Postal address','Delivery address','Birth date','Please check the following fields','Phone','Cellphone','Empty','Cellphone','Enter a phone number of EIN to perform lookup','Enter a valid EIN to perform lookup','Enter a valid phone number to perform lookup'],			
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getNewCustomerData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				anc_dt = complet_data.response.response;
				anc_dt['anc_meta'] = anc_meta;
				anc_td = complet_data.response.response.translationsData;
				add_new_customer.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',anc_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',anc_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;


	},
	createHtml:function(){
		var template = document.getElementById('add_new_customer_template').innerHTML;
		anc_dt['meta'] = {lang:lang};
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		anc_dt.date_format_f = date_format_f;

		var default_fields = anc_dt.getPartnerCustomSettings.PartnerSetting.mandatory_fields;
		anc_dt['default_fields'] = '';
		if(checkNull(default_fields) != ''){
			anc_dt['default_fields'] = JSON.parse(default_fields);
		}

		var customer_registration_form = '';
		var showCustomFields = [];
		$.each( anc_dt.allCustomFields, function( key, value ) {
			if(value.CustomerCustomField.customer_registration_form == 'n'){
				customer_registration_form = '';
			}else{
				customer_registration_form = 'y';
			}
			showCustomFields.push({custom_field_name : value.CustomerCustomField.custom_field, custom_field_value : value.CustomerCustomField.custom_value, show_on_registration : customer_registration_form, custom_field_type : value.CustomerCustomField.type, mandatory : value.CustomerCustomField.mandatory});
		});

		anc_dt['showCustomFields'] = showCustomFields;
		anc_dt['show_on_registration'] = customer_registration_form;

		anc_dt['host_url'] = host_url;

		if(anc_dt.getPartnerCustomSettings.PartnerSetting.fetch_customer_information == 1 && anc_dt.getPartnerCustomSettings.PartnerSetting.fetch_customer_information_phone == 1){
			anc_dt['einplace'] = anc_td.EnteraphonenumberofEINtoperformlookup;
		}
		else if(anc_dt.getPartnerCustomSettings.PartnerSetting.fetch_customer_information == 1){
			anc_dt['einplace'] = anc_td.EnteravalidEINtoperformlookup;
		}
		else if(anc_dt.getPartnerCustomSettings.PartnerSetting.fetch_customer_information_phone == 1){
			anc_dt['einplace'] = anc_td.Enteravalidphonenumbertoperformlookup;
		}
		
		var compiledRendered = Template7(template, anc_dt);
		document.getElementById(anc_popid).innerHTML = compiledRendered;
		resizemodal(anc_popid);
		add_new_customer.bindEvents();


		if(anc_dt.getPartnerCustomSettings.PartnerSetting.enable_automatic_lookups == 0){
			add_new_customer.showform();
		}

	},
	bindEvents:function(){
		$.fn.editable.defaults.onblur = "";

		$('#EINEin').keypress(function( event ) {
			if (event.which == 13 ) {
				add_new_customer.getEinPhone();
			}
		});

		$('#EINEin').on('change',function(){
			var v = $(this).val();
			var word_Without_Numbers = v.replace(/\D/g, '');
			$(this).val(word_Without_Numbers);
		});
		$('#EINEin').on('paste',function(e){
			var pastedData = e.originalEvent.clipboardData.getData('text');
    		var word_Without_Numbers = pastedData.replace(/\D/g, '');
			setTimeout(function(){
				$('#EINEin').val(word_Without_Numbers);
			});
			//.val(word_Without_Numbers);
		});
			

		var sscountryList = anc_dt.getAllCountryList;
		var ssoptss = '';
		$.each(sscountryList, function (index, val) {
			ssoptss += '<option value="'+index+'">'+val+'</option>';
		});

		var country_list_opts = '';
		var country_list = [];
		for(var j in anc_dt.getCountryWithPhoneCodeList){
			var d = anc_dt.getCountryWithPhoneCodeList[j];
			
			var splt = d.split('###');
		
			country_list.push({
				text:splt[0],
				value:splt[1]
			});

			country_list_opts += '<option value="'+splt[1]+'">'+splt[0]+'</option>';
		}
		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Address5 = function (options) {
		        this.init('address5', options, Address5.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Address5, $.fn.editabletypes.abstractinput);

		    $.extend(Address5.prototype, {
		     
		        render: function() {
		           this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		             this.$select.select2({
		             	allowClear:true,
		            	placeholder:anc_td.Select
		             });
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		        
		           var html = '';

		            if(checkNull(value.CCustAddress1)!=''){
		            	html += '<p>'+$('<div>').text(value.CCustAddress1).html()+ '</p>';
		            }
		            
		            if(checkNull(value.CCustAddress2)!=''){
		            	html += '<p>'+$('<div>').text(value.CCustAddress2).html()+ '</p>';
		            }

		            if(checkNull(value.CCustZip)!='' || checkNull(value.CCustCity)!=''){
		            	var CCustZip = checkNull(value.CCustZip);
		            	var CCustCity =  checkNull(value.CCustCity);

		            	html += '<p>';
		            	html += CCustZip;
		            	if(CCustZip!=''){
		            		html += '&nbsp;';
		            	}
		            	html += CCustCity;
		            	
		            	html += '</p>';
		            }

		          

		            if(checkNull(value.CCustCountry)!='' && html!=''){
		            	if(anc_dt.partner_country!=value.CCustCountry){
		            		html += '<p>'+$('<div>').text(value.CCustCountry).html() + '</p>';
		            	}
		            	
		            }
		            if(html==''){
			           	html += '<p class="addr_empty" style="margin:0">(+)</p>';
			        }

		            $(element).html(html); 
		        },
		        html2value: function(html) {        

		          return null;  
		        },
		      
		       value2str: function(value) {
		           var str = '';
		           if(value) {
		               for(var k in value) {
		                   str = str + k + ':' + value[k] + ';';  
		               }
		           }
		           return str;
		       }, 
		       
		       str2value: function(str) {
		           return str;
		       },                
		             
		       value2input: function(value) {
					if(!value) {
						return;
					}
					this.$input.filter('[name="CCustAddress1"]').val(checkNull(value.CCustAddress1));
					this.$input.filter('[name="CCustAddress2"]').val(checkNull(value.CCustAddress2));
					this.$input.filter('[name="CCustZip"]').val(checkNull(value.CCustZip));
					this.$input.filter('[name="CCustCity"]').val(checkNull(value.CCustCity));
					this.$select.filter('[name="CCustCountry"]').val(checkNull(value.CCustCountry)).trigger('change');
					$('#s2id_CCustCountry').css('width','220px');

		 
		       },           
		       input2value: function() { 
		           return {
		              CCustAddress1: this.$input.filter('[name="CCustAddress1"]').val(), 
		              CCustAddress2: this.$input.filter('[name="CCustAddress2"]').val(), 
		              CCustZip: this.$input.filter('[name="CCustZip"]').val(), 
		              CCustCity: this.$input.filter('[name="CCustCity"]').val(), 
		              CCustCountry: this.$select.filter('[name="CCustCountry"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$input.filter('[name="CCustAddress1"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 15) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Address5.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><input type="text" id="CCustAddress1" name="CCustAddress1" class="" placeholder="'+anc_td.Postaladdress1+'"></label></div>'+
		       	 '<div class="editable-address"><label><input type="text" id="CCustAddress2" name="CCustAddress2" class="" placeholder="'+anc_td.Postaladdress2+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CCustZip" name="CCustZip" class="" placeholder="'+anc_td.Postalzip+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CCustCity" name="CCustCity" class="" placeholder="'+anc_td.Postalcity+'"></label></div>'+
		             '<div class="editable-address "><label><select id="CCustCountry" name="CCustCountry" class="m-wrap wraps">'+ssoptss+'</select></label></div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.address5 = Address5;
		}(window.jQuery));

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Address6 = function (options) {
		        this.init('address6', options, Address6.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Address6, $.fn.editabletypes.abstractinput);

		    $.extend(Address6.prototype, {
		     
		        render: function() {
		           	this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		            this.$select.select2({
		            	allowClear:true,
		            	placeholder:anc_td.Select
		            });
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		            var html = '';
		           
		            if(checkNull(value.CCustDlvryAddress1)!=''){
		            	html +='<p>' + $('<div>').text(value.CCustDlvryAddress1).html()+ '</p>';
		            }
		            
		            if(checkNull(value.CCustDlvryAddress2)!=''){
		            	html +='<p>' + $('<div>').text(value.CCustDlvryAddress2).html()+ '</p>';
		            }

		            if(checkNull(value.CCustDlvryZip)!='' || checkNull(value.CCustDlvryCity)!=''){
		            	var CCustDlvryZip = checkNull(value.CCustDlvryZip);
		            	var CCustDlvryCity =  checkNull(value.CCustDlvryCity);

		            	html += '<p>';
		            	html += CCustDlvryZip;
		            	if(CCustDlvryZip!=''){
		            		html += '&nbsp;';
		            	}
		            	html += CCustDlvryCity;
		            	
		            	html += '</p>';
		            }



		            if(checkNull(value.CCustDlvryCountry)!='' && html!=''){
		            	if(anc_dt.partner_country!=value.CCustDlvryCountry){
		            		html += '<p>' + $('<div>').text(value.CCustDlvryCountry).html() + '</p>';
		            	}
		            }
		            if(html==''){
			           	html += '<p class="addr_empty" style="margin:0">(+)</p>';
			        }

		            $(element).html(html); 
		        },
		        html2value: function(html) {        

		          return null;  
		        },
		      
		       value2str: function(value) {
		           var str = '';
		           if(value) {
		               for(var k in value) {
		                   str = str + k + ':' + value[k] + ';';  
		               }
		           }
		           return str;
		       }, 
		       
		       str2value: function(str) {
		           return str;
		       },                
		             
		       value2input: function(value) {
					if(!value) {
						return;
					}
					this.$input.filter('[name="CCustDlvryAddress1"]').val(checkNull(value.CCustDlvryAddress1));
					this.$input.filter('[name="CCustDlvryAddress2"]').val(checkNull(value.CCustDlvryAddress2));
					this.$input.filter('[name="CCustDlvryZip"]').val(checkNull(value.CCustDlvryZip));
					this.$input.filter('[name="CCustDlvryCity"]').val(checkNull(value.CCustDlvryCity));
					this.$select.filter('[name="CCustDlvryCountry"]').val(checkNull(value.CCustDlvryCountry)).trigger('change');
		 
		       },           
		       input2value: function() { 
		           return {
		              CCustDlvryAddress1: this.$input.filter('[name="CCustDlvryAddress1"]').val(), 
		              CCustDlvryAddress2: this.$input.filter('[name="CCustDlvryAddress2"]').val(), 
		              CCustDlvryZip: this.$input.filter('[name="CCustDlvryZip"]').val(), 
		              CCustDlvryCity: this.$input.filter('[name="CCustDlvryCity"]').val(), 
		              CCustDlvryCountry: this.$select.filter('[name="CCustDlvryCountry"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$input.filter('[name="CCustDlvryAddress1"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Address6.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><input type="text" id="CCustDlvryAddress1" name="CCustDlvryAddress1" class="" placeholder="'+anc_td.Deliveryaddress1+'"></label></div>'+
		       	 '<div class="editable-address"><label><input type="text" id="CCustDlvryAddress2" name="CCustDlvryAddress2" class="" placeholder="'+anc_td.Deliveryaddress2+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CCustDlvryZip" name="CCustDlvryZip" class="" placeholder="'+anc_td.Deliveryzip+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CCustDlvryCity" name="CCustDlvryCity" class="" placeholder="'+anc_td.Deliverycity+'"></label></div>'+
		             '<div class="editable-address"><label><select id="CCustDlvryCountry" name="CCustDlvryCountry" class="m-wrap wraps">'+ssoptss+'</select></label></div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.address6 = Address6;
		}(window.jQuery));

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Dobb = function (options) {
		        this.init('dobb', options, Dobb.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Dobb, $.fn.editabletypes.abstractinput);

		    $.extend(Dobb.prototype, {
		     
		        render: function() {
		           this.$input = this.$tpl.find('input');
		        },
		        value2html: function(value, element) {
		            if(!value) {
		               $(element).empty();
		               return; 
		            }
		        
		           	var html = '';

		            if(checkNull(value)!=''){
		            	html += '<p style="margin-bottom:0">'+$('<div>').text(value).html()+ '</p>';
		            }
		            $(element).html(html); 
		        },
		        html2value: function(html) {        

		          return null;  
		        },
		       	value2str: function(value) {
		           	var str = '';
		           	if(value) {
		               for(var k in value) {
		                   str = str + k + ':' + value[k] + ';';  
		               }
		           	}
		           return str;
		       	}, 
		       	str2value: function(str) {
		           return str;
		       	},                
		       	value2input: function(value) {
					if(!value) {
						return;
					}
					this.$input.filter('[name="dobb"]').val(checkNull(value));
		 
		       	},           
		       	input2value: function() { 
		           return this.$input.filter('[name="dobb"]').val();
		       	},         
		       	activate: function() {
		       		this.$input.inputmask(date_format_mask ,{autoUnmask: false});	
		       		this.$input.filter('[name="dobb"]').focus();
		       	},       
		       	autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       	}   
		    });

	       	Dobb.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><input type="text" id="dobb" name="dobb" class="m-wrap" placeholder="'+anc_td.Birthdate+'"></label></div>'+
		       	 '</div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.dobb = Dobb;
		}(window.jQuery)); 

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Cellcode1 = function (options) {
		        this.init('cellcode1', options, Cellcode1.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Cellcode1, $.fn.editabletypes.abstractinput);

		    $.extend(Cellcode1.prototype, {
		     
		        render: function() {
		           	this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		            this.$select.select2();
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		            var html = '';

		           	var cellphone_country_code = $(element).attr('data-country-code');

		           	var cust_cell_code = '';
		            if(checkNull(value.custCellcode)!=''){
		            	if(anc_dt.partner_country != cellphone_country_code){
		            		cust_cell_code += $('<div>').text('( '+value.custCellcode+' )').html()+ ' ';
		            	}
		            }
		            
		            if(checkNull(value.custCellphone)!=''){
		            	var v = $(element).attr('data-val');
		            	v = checkNull(v);
		            	if(v==''){
		            		v = value.custCellphone;
		            	}
		            	html += cust_cell_code + $('<div>').text(v).html()+ '';
		            }
		            else{
		            	html += '(+)';
		            }

		            if(html==''){
		            	html += '(+)';
		            }

		            $(element).html(html); 
		        },
		        html2value: function(html) {        

		          return null;  
		        },
		      
		       value2str: function(value) {
		           var str = '';
		           if(value) {
		               for(var k in value) {
		                   str = str + k + ':' + value[k] + ';';  
		               }
		           }
		           return str;
		       }, 
		       
		       str2value: function(str) {
		           return str;
		       },                
		             
		       value2input: function(value) {
					if(!value) {
						return;
					}
					this.$input.filter('[name="custCellphone"]').val(checkNull(value.custCellphone));
					this.$select.filter('[name="custCellcode"]').val(checkNull(value.custCellcode)).trigger('change');
		 
		       },           
		       input2value: function() { 
		           return {
		              custCellphone: this.$input.filter('[name="custCellphone"]').val(), 
		              custCellcode: this.$select.filter('[name="custCellcode"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$input.filter('[name="custCellphone"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });

		    Cellcode1.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><select id="custCellcode" name="custCellcode" class="wraps">'+country_list_opts+'</select></label></div><div class="editable-address"><label><input type="text" id="custCellphone" name="custCellphone" class="m-wrap" placeholder="'+anc_td.Cellphone+'"></label></div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.cellcode1 = Cellcode1;
		}(window.jQuery)); 

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Cellcode2 = function (options) {
		        this.init('cellcode2', options, Cellcode2.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Cellcode2, $.fn.editabletypes.abstractinput);

		    $.extend(Cellcode2.prototype, {
		     
		        render: function() {
		           	this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		            this.$select.select2();
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		            var html = '';

		           	var phone_country_code = $(element).attr('data-country-code');

		           	var cust_phone_code = '';
		            if(checkNull(value.custPhonecode)!=''){
		            	if(anc_dt.partner_country != phone_country_code){
		            		cust_phone_code += $('<div>').text('( '+value.custPhonecode+' )').html()+ ' ';
		            	}
		            }
		            
		            if(checkNull(value.custPhone)!=''){
		            	var v = $(element).attr('data-val');
		            	v = checkNull(v);
		            	if(v==''){
		            		v = value.custPhone;
		            	}
		            	html += cust_phone_code + $('<div>').text(v).html()+ '';
		            }
		            else{
		            	html += '(+)';
		            }
		            if(html==''){
		            	html += '(+)';
		            }

		            $(element).html(html); 
		        },
		        html2value: function(html) {        

		          return null;  
		        },
		      
		       value2str: function(value) {
		           var str = '';
		           if(value) {
		               for(var k in value) {
		                   str = str + k + ':' + value[k] + ';';  
		               }
		           }
		           return str;
		       }, 
		       
		       str2value: function(str) {
		           return str;
		       },                
		             
		       value2input: function(value) {
					if(!value) {
						return;
					}
					this.$input.filter('[name="custPhone"]').val(checkNull(value.custPhone));
					this.$select.filter('[name="custPhonecode"]').val(checkNull(value.custPhonecode)).trigger('change');
		 
		       },           
		       input2value: function() { 
		           return {
		              custPhone: this.$input.filter('[name="custPhone"]').val(), 
		              custPhonecode: this.$select.filter('[name="custPhonecode"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$input.filter('[name="custPhone"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });

		    Cellcode2.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><select id="custPhonecode" name="custPhonecode" class="wraps">'+country_list_opts+'</select></label></div><div class="editable-address"><label><input type="text" id="custPhone" name="custPhone" class="m-wrap" placeholder="'+anc_td.Phone+'"></label></div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.cellcode2 = Cellcode2;
		}(window.jQuery)); 
	    
	
		$('#add_new_task_submit').click(function(){
			$('input[type=text]').removeAttr('readonly');
			$('input[type=text]').val('');
		});

		$('#show_customer_details #cust_postal_address').editable({
	        url: '',
	        showbuttons:false,
	       	emptytext:'(+)',
	        value: {
	            CCustAddress1: '',
	            CCustAddress2: '',
	            CCustZip:'',
	            CCustCity:'',
	           	CCustCountry:checkNull(anc_dt.partner_country,'NO'),
	        },
	        validate:function(){
	       
	        },
	        success: function(data, config) {
	        }
	    });

	    $('#show_customer_details #cust_delivery_address').editable({
	        url: '',
	        showbuttons:false,
	       	emptytext:'(+)',
	        value: {
	            CCustDlvryAddress1: '',
	            CCustDlvryAddress2: '',
	            CCustDlvryZip:'',
	            CCustDlvryCity:'',
	           	CCustDlvryCountry:checkNull(anc_dt.partner_country,'NO'),
	        },
	        validate:function(){
	       
	        },
	        success: function(data, config) {
	        }
	    });
		$('#show_customer_details #cust_delivery_address').attr('tabindex',"-1");
		var user_types = [];
		$.each( anc_dt.getUserGroupListForRegistration, function( key, value ) {
			user_types.push({value:key,text:value});
		});
		//icon-user-md
		$('#CustomerUserGroupId').editable({
			value: '1####',  
	       	mode:'inline',  
	       	type: 'select2',
	        source:user_types,
	        showbuttons:false,
	        select2: {
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	add_new_customer.getAvailDistTypesByCoun(config);
	   		},
		});
		$('tr.consumer').show();
		$('tr.business').hide();

		var getCountryListData = [];
		$.each( anc_dt.getAllCountryList, function( key, value ) {
			getCountryListData.push({value:key,text:value});
		});
		//icon-user-md
		$('#CustomerHomeCountry').editable({
			value: checkNull(anc_dt.partner_country,'NO'),  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:false,
	        source:getCountryListData,
	        select2: {
				
			},
	        success: function(data, config) {
	        	
	   		},
		});

		$('#customer_ein').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',
	       	showbuttons:false,
	       	emptytext:'(+)',
	        success: function(data, config) {
	   		},
		});

		$('#CustomerCustomerName').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',
	       	showbuttons:false,
	       	emptytext:'(+)',
	        success: function(data, config) {
	   		},
		});
		
		$('#CustomerConsumerFirstName').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',

	       	placeholder:anc_td.Firstname,
	       	showbuttons:false,
	       	emptytext:'(+)',
	        success: function(data, config) {
	   		},
		});
		
		$('#CustomerConsumerLastName').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',
	       	placeholder:anc_td.Lastname,
	       	showbuttons:false,
	       	emptytext:'(+)',
	        success: function(data, config) {
	   		},
		});
		
	

		$("#CustomerConsumerDateOfBirth").editable({
			value:'',
	       	mode:'inline', 
	       	showbuttons:false, 
	       	emptytext:'(+)',
	       	validate:function(value){

	       	},
	        success: function(data, config) {
	        	
	   		},
		});	 
		
		$('#CustomerFirstName').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',
	       	placeholder:anc_td.Firstname,
	       	showbuttons:false,
	       	emptytext:'(+)',
	        success: function(data, config) {
	   		},
		});

		$('#CustomerLastName').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',
	       		placeholder:anc_td.Lastname,
	       	showbuttons:false,
	       	emptytext:'(+)',
	        success: function(data, config) {
	   		},
		});

		var getCountryPhoneCodeList = [];

		$.each( anc_dt.getCountryWithPhoneCodeList, function( key, value ) {
			var explode_v = value.split('###');
			var phone_val = explode_v[0].split('(');
			var phone_orig_val = phone_val[1].split(')');

			getCountryPhoneCodeList.push({value:key,text:explode_v[0]});
		});

		// $('#CustomerPhCode').editable({
		// 	value: checkNull(anc_dt.partner_country,'NO'),  
	 //       	mode:'inline',  
	 //       	type: 'select2',
	 //       	showbuttons:false,
	 //        source:getCountryPhoneCodeList,
	 //        select2: {
		// 		minimumResultsForSearch: -1,
		// 	},
	 //        success: function(data, config) {
	        	
	 //   		},
		// });

		// $('#CustomerCcCode').editable({
		// 	value: checkNull(anc_dt.partner_country,'NO'),  
	 //       	mode:'inline',  
	 //       	type: 'select2',
	 //       	showbuttons:false,
	 //        source:getCountryPhoneCodeList,
	 //        select2: {
		// 		minimumResultsForSearch: -1,
		// 	},
	 //        success: function(data, config) {
	        	
	 //   		},
		// });
		
		var custP =['',''];
		try{
			var custPhoneCodea = anc_dt.getCountryWithPhoneCodeList[checkNull(anc_dt.partner_country,'NO')];
			console.log('custPhoneCodea',custPhoneCodea);
			custP = custPhoneCodea.split('###');
			console.log('custPhoneCodea',custP);
		}
		catch(e){custP[1] = '+47';}
		var custPh = custP[1];
		$('#CustomerPhone').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',
	       	showbuttons:false,
	       	value: {
	            custPhonecode: custPh,
	            custPhone: '',
	        },
	        success: function(data, config) {
	   		},
		});

		$('#CustomerCellphone').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',
	       	showbuttons:false,
	   		value: {
	            custCellcode: custPh,
	            custCellphone: '',
	        },
	        success: function(data, config) {
	   		},
		});

		$('#CustomerEmail').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',
	       	showbuttons:false,
	       	emptytext:'(+)',
	        success: function(data, config) {
	   		},
		});

		
		

		var invContactDetails = [];
		$.each( anc_dt.invoiceContactDetails, function( key, value ) {
			invContactDetails.push({value:key,text:value});
		});
			
		$('#CustomerDefaultContact').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:false,
	        source:invContactDetails,
	        emptytext:'(+)',
	        select2: {
	        	placeholder:anc_td.Select,
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	if(config == 'custom_invoice_contact'){
	        		$('tr.custom_inv').show();
	        	}
	        	else{
	        		$('tr.custom_inv').hide();
	        	}
	   		},
		});

		$('#CustomerConsumerCustomEmail').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'text',
	       	showbuttons:false,
       		placeholder:anc_td.Email,
       		emptytext:'(+)',
	        success: function(data, config) {
	   		},
		});


		var allCustomerGroups = [];
		$.each( anc_dt.getActiveCustomerGroups, function( key, value ) {
			$.each( value, function( k, v ) {
				allCustomerGroups.push({value:v.PartnerCustomerGroup.id,text:v.PartnerCustomerGroup.group_name});
				//allCustomerGroups.push({id:v.PartnerCustomerGroup.id,name:v.PartnerCustomerGroup.group_name,default_price_group:v.PartnerCustomerGroup.price_group_id});
			});
		});



		$('#customer_group').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'select2',
	        source:allCustomerGroups,
	        showbuttons:false,
	        emptytext:'(+)',
	        select2: {
	        	placeholder:anc_td.Select,
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	var found = 0;
	        	$.each( anc_dt.getActiveCustomerGroups, function( key, value ) {
	        		
	        		if(value[0].PartnerCustomerGroup.id == config && value[0].PartnerCustomerGroup.price_group_id){
	        			found = 1;
	        			$('#price_group').editable('setValue',value[0].PartnerCustomerGroup.price_group_id);
	        			$('#price_group').editable('disable',0);
	        			return false;
	        		}
	        	});

	        	if(found == 0){
	        		$('#price_group').editable('enable',1);
	        	}
	   		},
		});

		if(allCustomerGroups.length == 0){
			$('#show_customer_details #customer_group').parent().parent().hide();
		}
		var price_groups = [];
		$.each( anc_dt.getAllPriceGroups, function( key, value ) {
			price_groups.push({value:key,text:value});
		});

		if(price_groups.length == 0){
			$('tr.price_group').hide();
		}
		else{
			$('tr.price_group').show();
		}

		$('#price_group').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:false,
	        source:price_groups,
	        emptytext:'(+)',
	        select2: {
	        	placeholder:anc_td.Select,
				minimumResultsForSearch: -1,
			},
			
	        success: function(data, config) {
	   		},
		});
		
		var newslett = [];
		$.each( anc_dt.newsletterUpdates, function( key, value ) {
			newslett.push({value:key,text:value});
		});

		$('#newsletter_and_updates').editable({
			value: '',  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:false,
	        source:newslett,
	        emptytext:'(+)',
	        select2: {
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	   		},
		});

		var default_mass_value = '0';
		var enable_mass_communication_emails = '';
		var fetch_customer_information = '';
		$.each( anc_dt.getPartnerCustomSettings, function( key, value ) {
		
			enable_mass_communication_emails = value.enable_mass_communication_emails;
			enable_mass_communication_sms = value.enable_mass_communication_sms;
			fetch_customer_information = value.fetch_customer_information;
			if(enable_mass_communication_emails == 1 && enable_mass_communication_sms == 1){
				default_mass_value = 3;
			}
			else if(enable_mass_communication_sms == 1){
				default_mass_value = 2;
			} 
			else if(enable_mass_communication_emails == 1){
				default_mass_value = 1;
			}
		});

		if(anc_dt.show_mass_communication == 1){
			$('tr.mass_comm').show();
			$('#newsletter_and_updates').editable('setValue',default_mass_value);
		}
		else{
			$('tr.mass_comm').hide();
		}
		
		
		add_new_customer.generateCustomFields();
		add_new_customer.getAvailDistTypesByCoun();

		$('#EINEin').focus();
		setTimeout(function(){
			$('#EINEin').focus();
		});
		setTimeout(function(){
			$('#EINEin').focus();
		},100);


		function findnext(n){
			if(n.css('display') == 'none'){
				n = n.next();
				return findnext(n);
			}
			return n;
		}
		var j = 1;
		

		// $('#show_customer_details').on('keydown',function(e){
		
		//    if(e.keyCode == 9){
		//   		//if(e.shiftKey) {
		//   			setTimeout(function(){
		  				
		  			
		//   				if($(document.activeElement).hasClass('editable')){
		//   					$(document.activeElement).click();
		//   				}
		//   			},100);
		//   		//}
		//   	}
		// });

		$("#show_customer_details").on("keydown", ".editable-input .m-wrap:not(.select2-offscreen)", function(e) {
			if(e.keyCode == 9 || e.keyCode == 13){
				// var edit_field = $(this).closest('td').find('a');
				// console.log('edit_field1',edit_field);
				$(this).closest('form').submit();
				// console.log('edit_field2',edit_field);
				// edit_field.keydown();
			}
		});

		$("#show_customer_details").on("keydown", ".select2-result", function(e) {
			if(e.keyCode == 9 || e.keyCode == 13){
				$(this).closest('form').submit();
			}
		});

		$('#show_customer_details').on('focus', 'a.editable',  function(e){
	    $('#'+e.target.id).editable('show');
		});

		$('#show_customer_details input').on('blur',function(){
			$('.editableform').submit();
		});

		
		

		$('#show_customer_details .editable').on('shown', function(e, reason){
			var that = this;
			$('.editable-open').each(function(i, el){
				var $el = $(el),
                ec = $el.data('editableContainer');

                if(!ec || (this == that)) {
                    return;  
                }
				$el.data('editableContainer').tip().find('form').submit();
			});
			// setTimeout(function(){
			// 	if($('.select2-container:not(.wraps)').length != 0){
			// 		var od = $('#show_customer_details .select2-container:not(.wraps)').attr('id');
				
			// 		$('#'+od).select2('focus');
			// 	}
			// 	else{
			// 		$('.editable-input input:not(.select2-focusser):not(.select2-input):first').focus();
					
			// 	}			
			// },);				
		});

		$('#show_customer_details').on('keyup','input#CCustZip',function(){
			add_new_customer.getCityFromZip($(this).val(),$('#CCustCountry').val(),'CCustCity','postal');
		});

		$('#show_customer_details').on('keyup','input#CCustDlvryZip',function(){
			add_new_customer.getCityFromZip($(this).val(),$('#CCustDlvryCountry').val(),'CCustDlvryCity','delivery');
		});

		setTimeout(function(){
			resizemodal();
		});
	},
 	findn:function(i,j){
		
		$next = $($('#show_customer_details tr')[i+j]);
		if($next.css('display') == 'none' || $next.hasClass('skip') || $next.find('.editable').length == 0){
			return add_new_customer.findn(i,j+1);
		}
		return $next;
	},
	onHidden:function(that){
		var i = 0;

		var $thistr = $(that).parent().parent();
		var $next = '';
        $('#show_customer_details tr').each(function(i){
        	
        	if($thistr.html() == $(this).html() && $('#show_customer_details tr').length - 1 != i){
        		j = 1;
        		$next = add_new_customer.findn(i,j);
        		return false;
        	}
        }); 
        if($next != ''){ 
     	$a = $next.find('.editable');   
		 	setTimeout(function() {
		        $a.editable('show');
		    }, 300);
     	}
	},
	getEinPhone:function(){
		$('#show_ein_details_duplicate').html('');
		$('#show_ein_details_data').html('');
		
		//var ein_error = anc_td.Pleaseentervalideinorphonenumber;
		

		var ein_error = anc_td.Enteravalidphonenumbertoperformlookup;
		var from = 'both';
		if(anc_dt.getPartnerCustomSettings.PartnerSetting.fetch_customer_information == 1 && anc_dt.getPartnerCustomSettings.PartnerSetting.fetch_customer_information_phone == 1){
			ein_error = anc_td.EnteraphonenumberofEINtoperformlookup;
			from = 'both';
		}
		else if(anc_dt.getPartnerCustomSettings.PartnerSetting.fetch_customer_information == 1){
			ein_error = anc_td.EnteravalidEINtoperformlookup;
			from = 'ein';
		}
		else if(anc_dt.getPartnerCustomSettings.PartnerSetting.fetch_customer_information_phone == 1){
			ein_error = anc_td.Enteravalidphonenumbertoperformlookup;
			from = 'phone';
		}

		var ein = $('#EINEin').val();
		if(checkNull(ein) == ''){
			showAlertMessage(ein_error,'error',anc_td.Alertmessage);
			return;
		}
		var check_ein = !isNaN(ein);
		if(check_ein === false){
			showAlertMessage(ein_error,'error',anc_td.Alertmessage);
			return;
		}
		var ein_len = ein.length;
		if(ein_len < 8){
			showAlertMessage(ein_error,'error',anc_td.Alertmessage);
			return;
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			phone_no:ein,
			from:from
		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/search/getEinInformation.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function(){
			$('#hiddenNewCustomerImg').hide();
		};
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				if(complet_data.response.response.from == 'getPhoneNumber'){
					add_new_customer.generatePhoneData(complet_data.response.response);
				}
				else{
					add_new_customer.generateEinData(complet_data.response.response);
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',anc_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',anc_td.Alertmessage);
					return;
				}	
			}
		}
		$('#hiddenNewCustomerImg').show();
		doAjax(params);
		return;
	},
	generateEinData:function(resz){
		var gotoh = '';
		var all_name = [];
		var all_postal_address = [];
		var all_postal_cellphone = [];
		var all_postal_phone = [];
		var all_ein = [];
		var res = resz.einData;
		var html = '';

		if(res!='' && res!=undefined && res!=null){
			if(checkNull(res.name) != ''){
				html += '<div class="span12 box">';
					html += '<ul class="unstyled span9">';

						if(res.name!=undefined && res.name!=null && res.name!=''){
							html += '<li><b>'+res.name+'</b></li>';
							all_name.push(res.name);
						}
						var address = '';
						var zip = '';
						var city = '';

						if(checkNull(res.postal_address) != ''){
							html += '<li>'+res.postal_address;
							address = res.postal_address					
						}
						if(checkNull(res.postal_zip) != ''){
							zip = res.postal_zip;
						}
						if(checkNull(res.postal_city) != ''){
							city = res.postal_city ;
						}

						if(zip!='' && city!=''){
							html += ', '+zip+' '+city+'</li>';
						}
						all_postal_address.push(address+'_'+zip+'_'+city);
						var phone_nos = '';
						if(checkNull(res.postal_cellphone) != ''){
							phone_nos += anc_td.Customercellphone+': '+res.postal_cellphone+'. ';
							all_postal_cellphone.push(res.postal_cellphone.replace(/ /g, ""));
						}
						
						if(checkNull(res.postal_phone) != ''){
							phone_nos += anc_td.Customerlandline+': '+res.postal_phone;
							all_postal_phone.push(res.postal_phone.replace(/ /g, ""));
						}
						if(phone_nos!=''){
							html += '<li>'+phone_nos+'</li>';
						}
						var eins = '';
						if(checkNull(res.ein) != ''){
							eins +=  anc_td.EIN+': '+res.ein;
							all_ein.push(res.ein);
						}
						if(eins!=''){
							html += '<li>'+eins+'</li>';
						}
					html+= '</ul>';
					var value = JSON.stringify(res);
					var find = '"';
					var re = new RegExp(find, 'g');

					value = value.replace(re, "&quot;");
					html+= '<ul class="unstyled span3">';
						html +='<li><a onclick="add_new_customer.showrows('+value+')" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;"><i class="fa fa-check"></i> '+anc_td.Select+'</a></li>';
					html+='</ul>';
				html += '</div>';
			}
			else{
				$('#show_ein_details_data').html('');
				$('#show_ein_details_data_duplicate').html('');
				showAlertMessage(anc_td.Norecordfound,'error',anc_td.AlertMessage);
			}
		}

		if(checkNull(html) != ''){
			var htmls = '';
			var all_name_html = '';
			if (typeof all_name[0] !== 'undefined') {
				var all_name = all_name.filter( onlyUnique );
				
				for(var j in all_name){
					if(j==0 && all_name.length==1){
						all_name_html += '<li><div><b>'+anc_td.Customername+'</b></div><div>'+all_name[j]+'</div><div><input class="radio_all_name" onclick="add_new_customer.adjust_radio(this,\'radio_all_name\');" checked="checked" type="checkbox" value="'+all_name[j]+'"></div></li>';
					}
					else if(j==0){
						all_name_html += '<li><div>'+anc_td.Customername+'</div><div>'+all_name[j]+'</div><div><input class="radio_all_name" onclick="add_new_customer.adjust_radio(this,\'radio_all_name\');" type="checkbox" value="'+all_name[j]+'"></div></li>';
					}
					else{
						all_name_html += '<li><div>&nbsp;</div><div>'+all_name[j]+'</div><div><input type="checkbox" value="'+all_name[j]+'" class="radio_all_name"  onclick="add_new_customer.adjust_radio(this,\'radio_all_name\');" ></div></li>';
					}
				}
			}

			var all_postal_address_html = '';
			if (typeof all_postal_address[0] !== 'undefined') {
				var all_postal_address = all_postal_address.filter( onlyUnique );
				for(var j in all_postal_address){
					var all_postal_address_array = all_postal_address[j].split('_');
					var all_postal_address_string = '';
					if(all_postal_address_array[0]!=undefined && all_postal_address_array[0]!=null && all_postal_address_array[0]!=''){
						all_postal_address_string += all_postal_address_array[0];
					}
					if(all_postal_address_array[1]!=undefined && all_postal_address_array[1]!=null && all_postal_address_array[1]!=''){
						all_postal_address_string += ', '+all_postal_address_array[1];
					}
					if(all_postal_address_array[2]!=undefined && all_postal_address_array[2]!=null && all_postal_address[2]!=''){
						all_postal_address_string += ' '+all_postal_address_array[2];
					}
					if(j==0 && all_postal_address.length==1){
						all_postal_address_html += '<li><div><b>'+anc_td.Address+'</b></div><div>'+all_postal_address_string+'</div><div><input type="checkbox" value="'+all_postal_address[j]+'" checked="checked" class="radio_all_postal_address"  onclick="add_new_customer.adjust_radio(this,\'radio_all_postal_address\');" ></div></li>';
					}
					else if(j==0 ){
						all_postal_address_html += '<li><div><b>'+anc_td.Addres+'</b></div><div>'+all_postal_address_string+'</div><div><input type="checkbox" value="'+all_postal_address[j]+'" class="radio_all_postal_address"  onclick="add_new_customer.adjust_radio(this,\'radio_all_postal_address\');" ></div></li>';
					}
					else{
						all_postal_address_html += '<li><div>&nbsp;</div><div>'+all_postal_address_string+'</div><div><input type="checkbox" value="'+all_postal_address[j]+'" class="radio_all_postal_address"  onclick="add_new_customer.adjust_radio(this,\'radio_all_postal_address\');" ></div></li>';
					}
				}
			}

			var all_postal_phone_html = '';
			var all_postal_phone = all_postal_phone.filter( onlyUnique );
			if (typeof all_postal_phone[0] !== 'undefined') {
				for(var j in all_postal_phone){

					if(j==0 && all_postal_phone.length==1){
						all_postal_phone_html += '<li><div><b>'+anc_td.Customerlandline+'</b></div><div>'+all_postal_phone[j]+'</div><div><input type="checkbox" value="'+all_postal_phone[j]+'" checked="checked" class="radio_postal_phone"  onclick="add_new_customer.adjust_radio(this,\'radio_postal_phone\');"></div></li>';
					}
					else if(j==0){
						all_postal_phone_html += '<li><div>'+anc_td.Customerlandline+'</div><div>'+all_postal_phone[j]+'</div><div><input type="checkbox" value="'+all_postal_phone[j]+'" class="radio_postal_phone"  onclick="add_new_customer.adjust_radio(this,\'radio_postal_phone\');"></div></li>';
					}
					else{
						all_postal_phone_html += '<li><div>&nbsp;</div><div><b>'+complet_data.response.response.cust_cellphone+'</b></div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_postal_phone"  onclick="add_new_customer.adjust_radio(this,\'radio_postal_phone\');"></div></li>';
					}
					
				}
			}

			var all_postal_cellphone_html = '';
			var all_postal_cellphone = all_postal_cellphone.filter( onlyUnique );
			if (typeof all_postal_cellphone[0] !== 'undefined') {
				for(var j in all_postal_cellphone){

					if(j==0 && all_postal_cellphone.length==1){
						all_postal_cellphone_html += '<li><div><b>'+anc_td.Customercellphone+'</b></div><div>'+all_postal_cellphone[j]+'</div><div><input type="checkbox" checked="checked" value="'+all_postal_cellphone[j]+'" class="radio_postal_cellphone"  onclick="add_new_customer.adjust_radio(this,\'radio_postal_cellphone\');"></div></li>';
					}
					else if(j==0){
						all_postal_cellphone_html += '<li><div><b>'+anc_td.Customercellphone+'</b></div><div>'+all_postal_cellphone[j]+'</div><div><input type="checkbox" value="'+all_postal_cellphone[j]+'" class="radio_postal_cellphone"  onclick="add_new_customer.adjust_radio(this,\'radio_postal_cellphone\');"></div></li>';
					}
					else{
						all_postal_cellphone_html += '<li><div>&nbsp;</div><div><b>'+complet_data.response.response.cust_cellphone+'</b></div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_postal_cellphone"  onclick="add_new_customer.adjust_radio(this,\'radio_postal_cellphone\');"></div></li>';
					}
					
				}
			}


			var all_ein_html = '';
			var all_ein = all_ein.filter( onlyUnique );
			if (typeof all_ein[0] !== 'undefined') {
				for(var j in all_ein){
					if(j==0 && all_ein.length==1){
						all_ein_html += '<li><div><b>'+anc_td.EIN+'</b></div><div>'+all_ein[j]+'</div><div><input type="checkbox" value="'+all_ein[j]+'" class="radio_ein" checked="checked"  onclick="add_new_customer.adjust_radio(this,\'add_new_customer.adjust_radio\');"></div></li>';
					}
					else if(j==0){
						all_ein_html += '<li><div><b>'+anc_td.EIN+'</b></div><div>'+all_ein[j]+'</div><div><input type="checkbox" value="'+all_ein[j]+'" class="radio_ein"  onclick="add_new_customer.adjust_radio(this,\'add_new_customer.adjust_radio\');"></div></li>';
					}
					else{
						all_ein_html += '<li><div>&nbsp;</div><div>'+all_postal_cellphone[j]+'</div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_ein"  onclick="add_new_customer.adjust_radio(this,\'radio_ein\');"></div></li>';
					}
					
					var htmls = '<li style="list-style-type:none"><button class="btn mini edit blue-stripe" onclick="add_new_customer.switch_mode(1)">'+anc_td.Viewgroupeddata+'</button></li>';
						htmls += '<div class="span12 box">';
							htmls += '<ul class="unstyled span9 ungrouped">';
						htmls += all_name_html + all_postal_address_html + all_postal_phone_html + all_postal_cellphone_html+all_ein_html;

						htmls += '</ul>';
						htmls += '<ul class="span3 unstyled">';
							
						
							var datas = 'ungrouped_data';
							htmls += '<li><a onclick="event.preventDefault();add_new_customer.showrows(0,11)" class="btn mini edit xx blue-stripe" style="float:right;margin-right:5%;"><i class="fa fa-check"></i> '+anc_td.Select+'</a></li>';
						htmls += '</ul>';
						htmls += '</div>';


						$('#ungrouped_data').html(htmls);
						var html_html = '<li style="list-style-type:none"><button class="btn mini edit blue-stripe" onclick="add_new_customer.switch_mode(2)">'+anc_td.Viewungroupeddata+'</button></li>'+html;
						$('#grouped_data').html(html_html);
						if(gotoh!=''){
							var duplicate_html = '<ul class="span12" style="margin:0;font-size:20px;text-align:center;list-style-type:none"><li >'+anc_td.Potentialmatchesalreadyinoursystem+'</li></ul>'+gotoh;
							
							$('#show_ein_details_duplicate').html(duplicate_html);
						}
						$('#show_ein_details_data').html(htmls);
				}
			}
		}
		else{
			showAlertMessage(anc_td.Norecordfound,'error',anc_td.Alertmessage);
		}

		$('#'+anc_popid).resize();
		$(window).trigger('resize.modal');
		$('input[type=checkbox]').uniform();
	},
	generatePhoneData:function(resz){
		var all_company_name = [];
		var all_address= [];
		var all_name = [];
		var all_phone_number = [];
		var all_alternate_number = [];
		var all_landline_number = [];
		var gotoh = '';
		var data = resz.data;
		var html = '';
		if(checkNull(data) != ''){
			var res = data;
			var j = 0;
			var k = 0;
			$.each(res, function(i,v){
				var decodedata = JSON.parse(v.LookupsCache.data);
				$.each(decodedata, function(index,val){
					j++;
					k++;
					html += '<div class="span12 box">';
						//html += '<ul class="unstyled span2"><li>'+j+'</li></ul>';
						html += '<ul class="unstyled span9">';
							var fname = '';
							if(val.first_name!=undefined && val.first_name!=null && val.first_name!=''){
								fname = val.first_name;
								
							}
							var lname = '';
							if(val.last_name!=undefined && val.last_name!=null && val.last_name!=''){
								lname = val.last_name;
								
							}
							
							if(fname!='' || lname!=''){
									all_name.push(fname+'_'+lname);
									html += '<li><b>'+fname+' '+lname+'</b></li>';
							}
							if(val.company_name!=undefined && val.company_name!=null && val.company_name!=''){
								html += '<li><b>'+val.company_name+'</b></li>';
								
								all_company_name.push(val.company_name);

							}
							var address = '';
							if(val.address1!=undefined && val.address1!=null && val.address1!=''){
								html += '<li class="add_z">'+val.address1;
								address += val.address1;
							}
							if(val.address2!=undefined && val.address2!=null && val.address2!=''){
								//html += '<li>'+val.address2+'</li>';
								html += ', '+val.address2;
								address +=' '+val.address2;
							}

							var zip = '';
							var city = '';
							if(val.zip!=undefined && val.zip!=null && val.zip!=''){
								zip = val.zip;
							}
							if(val.city!=undefined && val.city!=null && val.city!=''){
								city = val.city ;
							}
							if(zip!='' || city!=''){
								if(address != ''){
									html += ', ';
								}
								html += zip+' '+city+'</li>';
							}
							
							
							if(address!='' || zip!='' || city!=''){
								all_address.push(address+'_'+zip+'_'+city);

								//all_address +='<p>'+address+', '+zip+' '+city+'</p><input type="checkbox" name="company_name[]" value="'+address+'_'+zip+'_'+city+'">';
							}

							var phone_nos = [];
							if(val.phone_number!=undefined && val.phone_number!=null && val.phone_number!=''){
								phone_nos.push(v.LookupsCache.cust_cellphone+': '+val.phone_number);
								all_phone_number.push(val.phone_number.replace(/ /g, ""));

							}
							if(val.alternate_number!=undefined && val.alternate_number!=null && val.alternate_number!=''){
								phone_nos.push(anc_td.Customercellphone+': '+val.alternate_number);
								all_alternate_number.push(val.alternate_number.replace(/ /g, ""));

							}
							if(val.landline_number!=undefined && val.landline_number!=null && val.landline_number!=''){
								phone_nos.push(anc_td.Customerlandline+': '+val.landline_number);
								all_landline_number.push(val.landline_number.replace(/ /g, ""));

							}
							if(phone_nos.length != 0){
								var str = phone_nos.join(',&nbsp;');
								//phone_nos = phone_nos.slice(1, -1);
								html += '<li>'+str+'</li>';
							}
						html+= '</ul>';
						var value = JSON.stringify(val);
						var find = '"';
						var re = new RegExp(find, 'g');
						
						value = value.replace(re, "&quot;");
						html+= '<ul class="unstyled span3">'; 
							html+='<li><a onclick="event.preventDefault(); add_new_customer.showrows('+value+')" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;"><i class="fa fa-check"></i> '+anc_td.Select+'</a></li>';
								
							if(val.is_duplicate!=undefined && val.is_duplicate!=null && val.is_duplicate!=''){
								
								var res = val;
								for(var j in res.is_duplicate){
									if(res.is_duplicate[j]!='' && res.is_duplicate[j]!=null && res.is_duplicate[j]!=undefined){
										var curl = $('#BASE_URL').val()+'customers/details/'+res.is_duplicate[j];
										//gotoh +='<li style="float:right"><a target="_blank" href="'+curl+'" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;">'+val.go_to_customer+'&nbsp;<i class="m-icon-swapright" style="margin-top:0;color:#000"></i></a></li>';
										gotoh += '<div class="span12 box">';
										gotoh += '<ul class="unstyled span9" style="margin: 0;">';
											if(res.is_duplicate[j].customer_name!=undefined && res.is_duplicate[j].customer_name!=null && res.is_duplicate[j].customer_name!=''){
												gotoh += '<li><b>'+res.is_duplicate[j].customer_name+'</b></li>';
											}
											if(res.is_duplicate[j].customer_address1!=undefined && res.is_duplicate[j].customer_address1!=null && res.is_duplicate[j].customer_address1!=''){
												gotoh += '<li>'+res.is_duplicate[j].customer_address1;
											}
											var zip = '';
											var city = '';
											if(res.is_duplicate[j].customer_zip!=undefined && res.is_duplicate[j].customer_zip!=null && res.is_duplicate[j].customer_zip!=''){
												zip = res.is_duplicate[j].customer_zip;
											}
											if(res.is_duplicate[j].customer_city!=undefined && res.is_duplicate[j].customer_city!=null && res.is_duplicate[j].customer_city!=''){
												city = res.is_duplicate[j].customer_city ;
											}
											if(zip!='' && city!=''){
												if(checkNull(res.is_duplicate[j].customer_address1) != ''){
													gotoh += ', ';
												}
												gotoh += zip+' '+city+'</li>';
											}
											var phone_nos = '';

											if(res.is_duplicate[j].customer_cellphone!=undefined && res.is_duplicate[j].customer_cellphone!=null && res.is_duplicate[j].customer_cellphone!=''){
												phone_nos += anc_td.Customercellphone+': '+res.is_duplicate[j].customer_cellphone+'. ';
											}
											
											if(res.is_duplicate[j].customer_phone!=undefined && res.is_duplicate[j].customer_phone!=null && res.is_duplicate[j].customer_phone!=''){
												phone_nos += anc_td.Customerlandline+': '+res.is_duplicate[j].customer_phone;
											}
											if(phone_nos!=''){
												//phone_nos = phone_nos.slice(1, -1);
												gotoh += '<li>'+phone_nos+'</li>';
											}
											var eins = '';

											if(res.is_duplicate[j].customer_ein!=undefined && res.is_duplicate[j].customer_ein!=null && res.is_duplicate[j].customer_ein!=''){
												eins += anc_td.EIN+': '+res.is_duplicate[j].customer_ein;
											}
											if(eins!=''){
												gotoh += '<li>'+eins+'</li>';
											}
										gotoh+= '</ul>';
									
										gotoh+= '<ul class="unstyled span3">';


												gotoh +=`<li style="float:right"><a target="_blank" onclick="$('#popups').modal('hide');goToCustomer(`+res.is_duplicate[j].id+`);" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;"><i class="m-icon-swapright" style="margin-top:0;color:#000"></i>&nbsp;`+anc_td.Gotocustomer+`</a></li>`;
										
											
										gotoh +='</ul>';
										gotoh +='</div>';
									}
									
								}
							}
							

						html+='</ul>';

					
					html += '</div>';	
				});
			});
		}



		var all_name_html = '';
		if (typeof all_name[0] !== 'undefined') {
			var all_name = all_name.filter( onlyUnique );
			
			for(var j in all_name){
				var all_name_arr = all_name[j].split('_');
				
				if(j==0 && all_name.length==1){
					all_name_html += '<li><div><b>'+anc_td.Name+'</b></div><div>'+all_name_arr[0]+' '+all_name_arr[1]+'</div><div><input class="radio_name" onclick="add_new_customer.adjust_radio(this,\'radio_name\');" checked="checked" type="checkbox" value="'+all_name[j]+'"></div></li>';
				}
				else if(j==0){
					all_name_html += '<li><div><b>'+anc_td.Name+'</b></div><div>'+all_name_arr[0]+' '+all_name_arr[1]+'</div><div><input class="radio_name" onclick="add_new_customer.adjust_radio(this,\'radio_name\');" type="checkbox" value="'+all_name[j]+'"></div></li>';
				}
				else{
					all_name_html += '<li><div>&nbsp;</div><div>'+all_name_arr[0]+' '+all_name_arr[1]+'</div><div><input type="checkbox" value="'+all_name[j]+'" class="radio_name"  onclick="add_new_customer.adjust_radio(this,\'radio_name\');" ></div></li>';
				}
			}
		}

		var all_company_name_html = '';
		if (typeof all_company_name[0] !== 'undefined') {
			var all_company_name = all_company_name.filter( onlyUnique );
			
			for(var j in all_company_name){
				if(j==0 && all_company_name.length==1){
					all_company_name_html += '<li><div><b>'+anc_td.Organisationname+'</b></div><div>'+all_company_name[j]+'</div><div><input class="radio_company_name" onclick="add_new_customer.adjust_radio(this,\'radio_company_name\');" checked="checked" type="checkbox" value="'+all_company_name[j]+'"></div></li>';
				}
				else if(j==0){
					all_company_name_html += '<li><div><b>'+anc_td.Organisationname+'</b></div><div>'+all_company_name[j]+'</div><div><input class="radio_company_name" onclick="add_new_customer.adjust_radio(this,\'radio_company_name\');" type="checkbox" value="'+all_company_name[j]+'"></div></li>';
				}
				else{
					all_company_name_html += '<li><div>&nbsp;</div><div>'+all_company_name[j]+'</div><div><input type="checkbox" value="'+all_company_name[j]+'" class="radio_company_name"  onclick="add_new_customer.adjust_radio(this,\'radio_company_name\');" ></div></li>';
				}
			}
		}

		var all_address_html = '';
		if (typeof all_address[0] !== 'undefined') {
			var all_address = all_address.filter( onlyUnique );

			for(var j in all_address){
				var all_address_array = all_address[j].split('_');
				var all_address_string = '';
				if(all_address_array[0]!=undefined && all_address_array[0]!=null && all_address_array[0]!=''){
					all_address_string += all_address_array[0];
				}
				if(all_address_array[1]!=undefined && all_address_array[1]!=null && all_address_array[1]!=''){
					if(checkNull(all_address_array[0]) != ''){
						all_address_string += ', ';
					}
					all_address_string += all_address_array[1];
				}
				if(all_address_array[2]!=undefined && all_address_array[2]!=null && all_address_array[2]!=''){
					all_address_string += ' '+all_address_array[2];
				}
				if(j==0 && all_address.length==1){
					
					all_address_html += '<li><div><b>'+anc_td.Address+'</b></div><div>'+all_address_string+'</div><div><input type="checkbox" value="'+all_address[j]+'" class="radio_all_address" checked="checked" onclick="add_new_customer.adjust_radio(this,\'radio_all_address\');" ></div></li>';
				}
				else if(j==0){
					all_address_html += '<li><div><b>'+anc_td.Address+'</b></div><div>'+all_address_string+'</div><div><input type="checkbox" value="'+all_address[j]+'" class="radio_all_address"  onclick="add_new_customer.adjust_radio(this,\'radio_all_address\');" ></div></li>';
				}
				else{
					all_address_html += '<li><div>&nbsp;</div><div>'+all_address_string+'</div><div><input type="checkbox" value="'+all_address[j]+'" class="radio_all_address"  onclick="add_new_customer.adjust_radio(this,\'radio_all_address\');" ></div></li>';
				}
			}
		}

		var all_phone_alternate_number = all_phone_number.concat(all_alternate_number);
		var all_phone_alternate_number = all_phone_alternate_number.filter( onlyUnique );
		var all_phone_alternate_number_html = '';
		if (typeof all_phone_alternate_number[0] !== 'undefined') {
			for(var j in all_phone_alternate_number){
				if(j==0 && all_phone_alternate_number.length==1){
					all_phone_alternate_number_html +=  '<li><div><b>'+anc_td.Customercellphone+'</b></div><div>'+all_phone_alternate_number[j]+'</div><div><input type="checkbox" checked="checked" value="'+all_phone_alternate_number[j]+'" class="radio_cust_cellphone"  onclick="add_new_customer.adjust_radio(this,\'radio_cust_cellphone\');"></div></li>';
				}
				else if(j==0){
					all_phone_alternate_number_html +=  '<li><div><b>'+anc_td.Customercellphone+'</b></div><div>'+all_phone_alternate_number[j]+'</div><div><input type="checkbox" value="'+all_phone_alternate_number[j]+'" class="radio_cust_cellphone"  onclick="add_new_customer.adjust_radio(this,\'radio_cust_cellphone\');"></div></li>';
				}
				else{
					all_phone_alternate_number_html +=  '<li><div>&nbsp;</div><div>'+all_phone_alternate_number[j]+'</div><div><input type="checkbox" value="'+all_phone_alternate_number[j]+'" class="radio_cust_cellphone"  onclick="add_new_customer.adjust_radio(this,\'radio_cust_cellphone\');"></div></li>';
				}
				
			}
		}

		var all_landline_number_html = '';
		var all_landline_number = all_landline_number.filter( onlyUnique );
		if (typeof all_landline_number[0] !== 'undefined') {
			for(var j in all_landline_number){
				if(j==0 && all_landline_number.length==1){
					all_landline_number_html += '<li><div><b>'+anc_td.Customerlandline+'</b></div><div>'+all_landline_number[j]+'</div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_cust_phone" checked="checked" onclick="add_new_customer.adjust_radio(this,\'radio_cust_phone\');"></div></li>';
				}
				else if(j==0){
					all_landline_number_html += '<li><div><b>'+anc_td.Customerlandline+'</b></div><div>'+all_landline_number[j]+'</div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_cust_phone"  onclick="add_new_customer.adjust_radio(this,\'radio_cust_phone\');"></div></li>';
				}
				else{
					all_landline_number_html += '<li><div>&nbsp;</div><div>'+all_landline_number[j]+'</div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_cust_phone"  onclick="add_new_customer.adjust_radio(this,\'radio_cust_phone\');"></div></li>';
				}
				
			}
		}


		if(checkNull(html) != ''){
			var htmls = '<li style="list-style-type:none"><button class="btn mini edit blue-stripe" onclick="add_new_customer.switch_mode(1)">'+anc_td.Viewgroupeddata+'</button></li>';
				htmls += '<div class="span12 box">';
					htmls += '<ul class="unstyled span9 ungrouped">';
				htmls += all_name_html+all_company_name_html + all_address_html + all_landline_number_html + all_phone_alternate_number_html;

				htmls += '</ul>';
				htmls += '<ul class="span3 unstyled">';
					
					
					var datas = 'ungrouped_data';
					htmls += '<li><a onclick="event.preventDefault();add_new_customer.showrows(0,12)" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;"><i class="fa fa-check"></i> '+anc_td.Select+'</a></li>';
				htmls += '</ul>';
				htmls += '</div>';

				$('#ungrouped_data').html(htmls);
				
				var html_html = '<li style="list-style-type:none"><button class="btn mini edit blue-stripe" onclick="add_new_customer.switch_mode(2)">'+anc_td.Viewungroupeddata+'</button></li>'+html;
				$('#grouped_data').html(html_html);
				if(gotoh!=''){
					var duplicate_html = '<ul class="span12" style="margin:0;font-size:20px;text-align:center;list-style-type:none"><li >'+anc_td.Potentialmatchesalreadyinoursystem+'</li></ul>'+gotoh;
					
					$('#show_ein_details_duplicate').html(duplicate_html);
				}
				$('#show_ein_details_data').html(htmls);
		}
		else{
			showAlertMessage(anc_td.Norecordfound,'error',anc_td.Alertmessage);
		}	
		$('#'+anc_popid).resize();
		$(window).trigger('resize.modal');
		$('input[type=checkbox]').uniform();
	
	},
	switch_mode:function(from){
		if(from==1){
			$('#show_ein_details_data').html($('#grouped_data').html());
		}
		else if(from==2){
			$('#show_ein_details_data').html($('#ungrouped_data').html());
		}
		$('input[type=checkbox]').uniform();
	},
	getAvailDistTypesByCoun:function(user_type = ''){
		if(user_type == ''){
			var user_type= $('#CustomerUserGroupId').editable('getValue').CustomerUserGroupId;
		}
		
		var group_arr = user_type.split('##');

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			country_code:$('#CustomerHomeCountry').editable('getValue').CustomerHomeCountry,
			user_type_id:group_arr[0],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getAvailDistTypesByCoun.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){

				if(group_arr[0] == '1'){
	        		$('tr.consumer').show();
	        		$('tr.business').hide();
	        	}
	        	else{
	        		$('tr.business').show();
	        		$('tr.consumer').hide();
	        	}

	        	var methods = complet_data.response.response.methods;
	        	var methodsz = [];
	        	var alternate_dist = [];
	        	var sel_val = '';
	        	console.log('methodsmethods',methods);
				$.each( methods, function( key, value ) {
					methodsz.push({value:value['id'],text:value['name']});
					if(value['type'] == 'classic'){
						alternate_dist.push({value:value['id'],text:value['name']});
					}
					if(value['default']){
						sel_val = value['id'];
					}
				});
				
				
				
				
				$('.prefer_dist td:last').html('<a href="javscript:;" id="preferred_distribution"></a>');
				$('.alter_dist td:last').html('<a href="javscript:;" id="alternate_distribution"></a>');
				
				$('#alternate_distribution').editable({
					value: '',  
			       	mode:'inline',  
			       	type: 'select2',
			       	showbuttons:false,
			        source:alternate_dist,
			        select2: {
			        	placeholder:anc_td.Select,
						minimumResultsForSearch: -1,
					},
			        success: function(data, config) {
			        	
			   		},
				});

				$('#preferred_distribution').editable({
					value: sel_val,  
			       	mode:'inline',  
			       	type: 'select2',
			       	showbuttons:false,
			        source:methodsz,
			        select2: {
						minimumResultsForSearch: -1,
					},
			        success: function(data, config) {
			        	var foundehf = 0;
			        	var showcon = 0;
			        	$.each( methods, function( key, value ) {
			        		if(value['id'] == config){
			        			if(value['internal_name'] == 'ehf'){
			        				foundehf = 1;
			        			}
			        			if(value['internal_name'] == 'email' || value['internal_name'] =='both'){
			        				showcon = 1;
			        			}
			        		}
			        	});

			        	if(foundehf == 1){
			        		$('tr.alter_dist').show();
			        	}
			        	else{
			        		$('tr.alter_dist').hide();
			        	}

			        	if(showcon == 1){
			        		$('.custom_inv_con').show();
			        	}
			        	else{
			        		$('#CustomerDefaultContact').editable('setValue','');
			        		$('#CustomerConsumerCustomEmail').editable('setValue','');
			        		$('.custom_inv_con,.custom_inv').hide();
			        	}
			   		},
				});

				$('#alternate_distribution ,#preferred_distribution').on('hidden', function(e, reason){
					if(reason === 'save' || reason === 'nochange') {
						//add_new_customer.onHidden(this);	
					}
 				});

 				$('#alternate_distribution ,#preferred_distribution').on('shown', function(e, reason){
					setTimeout(function(){
						if($('.select2-container:not(.wraps)').length != 0){
							var od = $('#show_customer_details .select2-container:not(.wraps)').attr('id');
						
							$('#'+od).select2('focus');
						}

						
					},);
				});
				
			}
		};

		doAjax(params);
		return;
	},
	generateCustomFields:function(data=''){
		if(data==''){
			var data = anc_dt.getCustomFieldsListForotherInformation;
		}

		var ans = {};

		for(var j in data){
			var d = data[j];
			if(d.customer_registration_form == 'n'){
				continue;
			}
			//Getting answer
			var th_ans = '';
			if(checkNull(ans[d.type])!=''){
				for(var k in ans[d.type]){
					var ansd = ans[d.type][k];
					if(k==checkNull(j)){
						th_ans = ansd;
						break;
					}
				}
			}

			var nomod_field_id = j;
			var field_id = j.trim();
			field_id = field_id.replace(/\s/g,'');
			//field_id = field_id.replace('/','');
			var tr = '<tr>';
				tr += '<td style="width:30%">';
					tr += checkNull(j);
				tr += '</td>';
				tr += '<td style="width:70%">';
					tr += '<a href="javscript:;" id="'+field_id+'" name="'+field_id+'" data-name="'+j+'"></a>';
				tr += '</td>';
				
			tr += '</tr>';

			
			custom_fields.push({field_id:field_id,nomod_field_id:nomod_field_id,ans:'',required:d.mandatory,type:d.type});
			// if(!d.type in custom_fields){
			// 	custom_fields[d.type] = {};
			// }

			// custom_fields
			$('#custom_field_tb').append(tr);
			if(d.type=='text'){
				if(d.mandatory=='y'){
						
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						showbuttons:false,
						type: d.type,
						emptytext:'(+)',
						success: function(data, config) {
							add_new_customer.saveData(config,this,'text','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return anc_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						showbuttons:false,
						type: d.type,
						emptytext:'(+)',
						success: function(data, config) {
							add_new_customer.saveData(config,this,'text','n');
						},
					});
				}	

			}
			else if(d.type=='textarea'){
				if(d.mandatory=='y'){
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						showbuttons:false,
						type: d.type,
						emptytext:'(+)',
						success: function(data, config) {
							add_new_customer.saveData(config,this,'textarea','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return anc_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						showbuttons:false,
						type: d.type,
						emptytext:'(+)',
						success: function(data, config) {

							add_new_customer.saveData(config,this,'textarea','n');
						},
					});
				}
			} 
			else if(d.type=='dropdown'){
				var opts = checkNull(d.custom_value);
				if(opts!=''){
					opts = JSON.parse(opts);
				}
				else{
					opts = [];
				}
			
				var options = [];
				var sel_plce = '';
				for(var l in opts){
					var ds = opts[l];
					options.push({
						text:ds.value,
						value:ds.value
					});
					if(checkNull(ds.is_default)!=''){
						if(ds.is_default==1){
							sel_plce = ds.value;
						}
					}
				}
				if(d.mandatory=='y'){
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						showbuttons:false,
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:'(+)',
		       			},
						source:options,
						emptytext:'(+)',
						success: function(data, config) {
							add_new_customer.saveData(config,this,'dropdown','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return anc_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						showbuttons:false,
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:'(+)',
		       			},
						source:options,
						emptytext:'(+)',
						success: function(data, config) {
							add_new_customer.saveData(config,this,'dropdown','n');
						}
					});
				}
			}
			else if(d.type=='radio'){
				var opts = checkNull(d.custom_value);
				if(opts!=''){
					opts = JSON.parse(opts);
				}
				else{
					opts = [];
				}
			
				var options = [];
				var sel_plce = '';
				for(var l in opts){
					var ds = opts[l];
					options.push({
						text:ds.value,
						value:ds.value
					});
					if(checkNull(ds.is_default)!=''){
						if(ds.is_default==1){
							sel_plce = ds.value;
						}
					}
				}
				if(d.mandatory=='y'){
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						showbuttons:false,
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:'(+)'
		       			},
						source:options,
						emptytext:'(+)',
						success: function(data, config) {
							add_new_customer.saveData(config,this,'radio','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return anc_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						showbuttons:false,
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:'(+)'
		       			},
						source:options,
						emptytext:'(+)',
						success: function(data, config) {
							add_new_customer.saveData(config,field_id,'radio','n');
						}
					});
				}
			}
			else if(d.type=='checkbox'){
				var opts = checkNull(d.custom_value);
				var options = {};
				options[opts] = opts;
		
				if(d.mandatory=='y'){
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						showbuttons:false,
						source:options,
						type: 'checklist',
						emptytext:'(+)',
						success: function(data, config) {
							add_new_customer.saveData(config[0],this,'checkbox','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return anc_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#add_new_customer #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						showbuttons:false,
						source:options,
						type: 'checklist',
						emptytext:'(+)',
						success: function(data, config) {
							add_new_customer.saveData(config[0],this,'checkbox','n');
						}
					});
				}
			}
		}
	},
	saveData:function(data,that,type,required){
		
		var field_id = $(that).attr('id');

		$.each(custom_fields,function(k,v){
			if(v.field_id == field_id){
				custom_fields[k].ans = data;
				return false;
			}
		});
	},
	proceedCustomer:function(from_doc = '',chk_dup_customers='n'){
		$('.editable-open').each(function(i, el){
			var $el = $(el),
            ec = $el.data('editableContainer');

            if(!ec) {
                return;  
            }
			$el.data('editableContainer').tip().find('form').submit();
		});

		setTimeout(function(){
			var errormsg = '';
			for(var j in custom_fields){
				if(custom_fields[j].required == 'y' && checkNull(custom_fields[j].ans) == ''){
					
					errormsg += custom_fields[j].field_id + '<br/>';
				}
			}

			if(errormsg != ''){
				var msg = anc_td.Pleasecheckthefollowingfields + '<br/>' + errormsg;
				showAlertMessage(msg,'error',anc_td.Alertmessage);
				return;
			}

			var user_group_id = $('#CustomerUserGroupId').editable('getValue').CustomerUserGroupId;
			var customerTypeArr = user_group_id.split("##");
			var userGroupId = customerTypeArr[0];

			
			var email = $('#CustomerEmail').editable('getValue').CustomerEmail;

			var cell_code = '';
			try{
				cell_code = $('#CustomerCellphone').editable('getValue').CustomerCellphone.custCellcode;
			}
			catch(e){

			}

			var cellphone = '';
			try{
				cellphone = $('#CustomerCellphone').editable('getValue').CustomerCellphone.custCellphone;
			}
			catch(e){
				
			}
			

			var phone_code = '';
			try{
				phone_code = $('#CustomerPhone').editable('getValue').CustomerPhone.custPhonecode;
			}
			catch(e){
				
			}
			var phone = '';
			try{
				phone = $('#CustomerPhone').editable('getValue').CustomerPhone.custPhone;
			}
			catch(e){
				
			}

			$.each( anc_dt.getCountryWithPhoneCodeList, function( key, value ) {
				if(key == cell_code){
					var a = value.split('###');
					cell_code = a[1];
					return false;
				}
			});

			$.each( anc_dt.getCountryWithPhoneCodeList, function( key, value ) {
				if(key == phone_code){
					var a = value.split('###');
					phone_code = a[1];
					return false;
				}
			});
			var customer_group_id = $('#customer_group').editable('getValue').customer_group;
			var price_group_id = $('#price_group').editable('getValue').price_group;

			var default_distribution = $('#preferred_distribution').editable('getValue').preferred_distribution;
			var alternate_distribution = $('#alternate_distribution').editable('getValue').alternate_distribution;
			var business_default_contact = $('#CustomerDefaultContact').editable('getValue').CustomerDefaultContact;

			var default_distribution_address = $('#CustomerConsumerCustomEmail').editable('getValue').CustomerConsumerCustomEmail;

			var receive_mass_sms_emails = $('#newsletter_and_updates').editable('getValue').newsletter_and_updates;
			var receive_mass_emails = 0;
			var receive_mass_sms = 0;
			if(receive_mass_sms_emails!=undefined && receive_mass_sms_emails!=null && receive_mass_sms_emails!=''){
				if(receive_mass_sms_emails == 1){
					receive_mass_emails = 1;
				}else if(receive_mass_sms_emails == 2){
					receive_mass_sms = 1;
				}else if(receive_mass_sms_emails == 3){
					receive_mass_emails = 1;
					receive_mass_sms = 1;
				}
			}

			var cust_postal_address = $('#show_customer_details #cust_postal_address').editable('getValue').cust_postal_address;
			var address1 = '';
			var address2 = '';
			var city = '';
			var zip = '';
			var country = cust_postal_address.CCustCountry;

			if($('#show_customer_details #cust_postal_address .addr_empty').length == 0 ){
				address1 = cust_postal_address.CCustAddress1;
				address2 = cust_postal_address.CCustAddress2;
				city = cust_postal_address.CCustCity;
				zip = cust_postal_address.CCustZip;
			}
			var cust_delivery_address = {
				CCustDlvryAddress1:'',
				CCustDlvryAddress2:'',
				CCustDlvryCity:'',
				CCustDlvryZip:'',
				CCustDlvryCountry:''
			};

			try{
				 cust_delivery_address = $('#show_customer_details #cust_delivery_address').editable('getValue').cust_delivery_address;
				 if($.isEmptyObject(cust_delivery_address)){
				 	cust_delivery_address = {
						CCustDlvryAddress1:'',
						CCustDlvryAddress2:'',
						CCustDlvryCity:'',
						CCustDlvryZip:'',
						CCustDlvryCountry:''
					};
				 }
			}
			catch(e){
				cust_delivery_address = {
					CCustDlvryAddress1:'',
					CCustDlvryAddress2:'',
					CCustDlvryCity:'',
					CCustDlvryZip:'',
					CCustDlvryCountry:''
				};
			}

			var delivery_address1 = '';
			var delivery_address2 = '';
			var delivery_city = '';
			var delivery_zip = '';
			var delivery_country = cust_delivery_address.CCustDlvryCountry;
			
			var same_postal_address = 'n';
			if($('#show_customer_details #cust_delivery_address .addr_empty').length == 0 ){
				delivery_address1 = cust_delivery_address.CCustDlvryAddress1;
				delivery_address2 = cust_delivery_address.CCustDlvryAddress2;
				delivery_city = cust_delivery_address.CCustDlvryCity;
				delivery_zip = cust_delivery_address.CCustDlvryZip;
			}
			else{
				same_postal_address = 'y';
				delivery_address1 = address1;
				delivery_address2 = address2;
				delivery_city = city;
				delivery_zip = zip;
				delivery_country = country;
				
			}

			if(userGroupId == 1){
				var first_name = $('#CustomerConsumerFirstName').editable('getValue').CustomerConsumerFirstName;
				var last_name =  $('#CustomerConsumerLastName').editable('getValue').CustomerConsumerLastName;
				var customer_name = first_name + ' ' + last_name;

				var date_of_birth = '';
				try{
					date_of_birth = convertIntoSystemDate($('#CustomerConsumerDateOfBirth').editable('getValue').CustomerConsumerDateOfBirth);
				}
				catch(e){
				
				}
				
				



				var params1 = {
					first_name:first_name,
					last_name:last_name,
					dob:date_of_birth,
					customer_name:customer_name,


				}
				var from = 'consumer';
			}
			else{
				var first_name = $('#CustomerFirstName').editable('getValue').CustomerFirstName;
				var last_name =  $('#CustomerLastName').editable('getValue').CustomerLastName;
				var customer_ein = $('#customer_ein').editable('getValue').customer_ein;
				var customer_name = $('#CustomerCustomerName').editable('getValue').CustomerCustomerName;

				var params1 = {
					first_name:first_name,
					last_name:last_name,
					ein:customer_ein,
					customer_name:customer_name
				}
				var from = 'business';
			}
			var customer_country = $('#CustomerHomeCountry').editable('getValue').CustomerHomeCountry;
			var params2 = {
				user_group_id:userGroupId,

				cell_code:cell_code,
				cellphone:cellphone,

				phone_code:phone_code,
				phone:phone,

				email:email,


				login_group_id:3,
				customer_group_id:customer_group_id,
				price_group_id:price_group_id,

				default_distribution:default_distribution,
				alternate_distribution:alternate_distribution,

				business_default_contact:business_default_contact,
				default_distribution_address:default_distribution_address,
				
				receive_mass_emails : receive_mass_emails,
				receive_mass_sms : receive_mass_sms,


				address1:address1,
				address2:address2,
				zip:zip,
				city:city,
				country:customer_country,

				same_postal_address:same_postal_address,

				delivery_address1:delivery_address1,
				delivery_address2:delivery_address2,
				delivery_city:delivery_city,
				delivery_zip:delivery_zip,
				delivery_country:delivery_country,

				from_name : partner_name,
				chk_dup_customers:chk_dup_customers
			};
			
			var params = Object.assign(params1,params2);
			
			var customFieldsAns	 = {};
			for(var j in custom_fields){
				if(checkNull(customFieldsAns[custom_fields[j].type]) == ''){
					customFieldsAns[custom_fields[j].type] = {};
				}
				customFieldsAns[custom_fields[j].type][custom_fields[j].nomod_field_id] = custom_fields[j].ans;
			}
			params['customFieldsAns'] = [];
			params['customFieldsAns'].push(customFieldsAns);
			params['customFieldsAns'] = JSON.stringify(params['customFieldsAns']);
			
		
			add_new_customer.saveCustomer(params,from,from_doc);
		},100);
	},
	saveCustomer:function(params,from,fromDoc){
		var p = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		}

		var total_params = Object.assign(p,params);
		var params = $.extend({}, doAjax_params_default);
		if(from == 'consumer'){
			params['url'] = APISERVER+'/api/Customers/addConsumer.json';
		}
		else{
			params['url'] = APISERVER+'/api/Customers/addBusiness.json';
		}
		
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				
				
				var duplicate_exist = is_undefined(complet_data.response.response.duplicate_exist);

				
				if(duplicate_exist == 'y'){

					
					var phone_number = checkNull(total_params['phone_code'],'') +  checkNull(total_params['phone'],'');
					var cellphone_number = checkNull(total_params['cell_code'],'') +  checkNull(total_params['cellphone'],'');
					var email = checkNull(total_params['email']);
					var zip = checkNull(total_params['delivery_zip']);
					var ein = '';
					if(total_params['userGroupId'] == '1'){
						var customer_name = checkNull(total_params['first_name'],'') +' ' +total_params(params['last_name'],'');	
						var customer_type= 'business';
					}else{
						var customer_name = checkNull(total_params['customer_name'],'');	
						var customer_type= 'consumer';
						var ein = '';
					}
					var query_str = host_url+type+'/customers/searchDuplicateCustomers?customer_name='+customer_name+'&email='+email+'&ein='+ein+'&phone_number='+phone_number+'&cellphone_number='+cellphone_number+'&zip='+zip+'&customer_type='+customer_type+'&request_from='+fromDoc;
					var a = document.createElement('div');	
					$(a).attr('data-url',query_str);
					$(a).attr('data-width','800px');
					show_modal(a,'popups2');
					return;
				}
				$('#popups').modal('hide');
				$('#'+anc_popid).modal('hide');
				var customerId = complet_data.response.response.customer_id;
				var customer_name =  complet_data.response.response.customer_name;
				var types = $('#type').val();
				call_toastr('success', 'Success', checkNull(complet_data.response.response.message.msg));
				if(fromDoc == 'salesDocument'){

					new_custom_main_page2('/'+types+'/sales/save','sales_sel','sales_sel','sales_save',{customer_id:customerId,submenu:''});
					closeModal(anc_popid);
				}else if(fromDoc == 'openTasks'){
					var cp = $('#partner_dir').val();
					var query_string = host_url+types+'/customers/details_new/'+customerId+'?cp='+cp+'&openTaskModel=customer_popup&tab=popups1';

					var customer_task_name = anc_dt.customer_task_name;	
					new_custom_main_page2('/'+type+'/customers/details/'+customerId,'all_customers','all_customers','customer_details',{customer_id:customerId});

					closeModal(anc_popid);

					var a = document.createElement('div');
					$(a).attr('data-url',query_string);
					$(a).attr('data-width','900px');
					show_modal(a,'popups1');
					
					// setTimeout(function(){ passRequest(host_url+type+'/inspections/edit_inspection?request_to=customer&customerID='+customerId+'&customer_task_name='+customer_task_name,'','undefined'); }, 3000);
					// return;
				}
				else if(fromDoc == 'transfer'){
					$('#transfer_div #customer_id').val(customerId); 
					$('#select_customer').val(customer_name);
					closeModal(anc_popid);
				}
				else{					
					new_custom_main_page2('/'+types+'/customers/details/'+customerId,'all_customers','all_customers','customer_details',{customer_id:customerId});

				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',anc_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',anc_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	showform:function(from=''){
		$('#show_ein_information,#einphoneresult,.no_cust').hide();
		$('#show_customer_details,.add_cust').show();
		$('#'+anc_popid).data().modal.options.width = "1000px";
	
		$('#'+anc_popid).css('width',1000+'px');
		$('#'+anc_popid).attr('data-width',1000);
		
		resizemodal();

		//$('#CustomerUserGroupId').focus();
		var breaks = 0; 
		$('#show_customer_details tr').each(function(i){
			var $next = $(this);
			if($next.css('display') != 'none' && !$next.hasClass('skip') && $next.find('.editable').length != 0){
				var a = $next.find('.editable').editable('getValue');
				
				for(var j in a){
					if(checkNull(a[j]) == '' ){
						setTimeout(function(){
							$next.find('.editable').click();
						});
						breaks = 1;
						break;
						
					}
				}
				if(breaks == 1){
					return false;
				}
			}
		});

		if(breaks == 0 || from == 'manual'){
			setTimeout(function(){
				$('#CustomerUserGroupId').trigger('click');
			});
		}
	},
	hideform:function(){
		$('#show_ein_information,#einphoneresult,.no_cust').show();
		$('#show_customer_details,.add_cust').hide();
		$('#'+anc_popid).data().modal.options.width = "700px";
		$('#'+anc_popid).resize();
		$('#'+anc_popid).css('width',700+'px');
		$('#'+anc_popid).attr('data-width',700);
		resizemodal();
		$('#EINEin').focus();
	},
	showrows:function(rows,fromd){
		if(fromd==12){
			var from = 	'getPhoneNumber';
		}
		else if(fromd==11){
			var from = 	'ein';
		}
		else{
			var from = rows.from;
		}
	
		if(from == 'ein'){
			$('#CustomerUserGroupId').editable('setValue','2##1##1');
			$('tr.business').show();
			$('tr.consumer').hide();

			if(fromd==11){
				if($('input[class=radio_all_name]:checked').val()!='' && $('input[class=radio_all_name]:checked').val()!=undefined && $('input[class=radio_all_name]:checked').val()!=null){
					$('#CustomerCustomerName').editable('setValue',$('input[class=radio_all_name]:checked').val());
				}
				else{
					$('#CustomerCustomerName').editable('setValue','');
				}

				if($('input[class=radio_ein]:checked').val()!='' && $('input[class=radio_ein]:checked').val()!=undefined && $('input[class=radio_ein]:checked').val()!=null){
					$('#customer_ein').editable('setValue',$('input[class=radio_ein]:checked').val());
					
				}
				else{
					$('#customer_ein').editable('setValue','');
				}

				if($('input[class=radio_postal_phone]:checked').val()!='' && $('input[class=radio_postal_phone]:checked').val()!=undefined && $('input[class=radio_postal_phone]:checked').val()!=null){
					var val = {
						custPhonecode:'+47',
						custPhone:parseInt($('input[class=radio_postal_phone]:checked').val())
					};
					$('#CustomerPhone').editable('setValue',val);
				}
				else{
					var val = {
						custPhonecode:'+47',
						custPhone:''
					};
					$('#CustomerPhone').editable('setValue',val);
				}

				if($('input[class=radio_postal_cellphone]:checked').val()!='' && $('input[class=radio_postal_cellphone]:checked').val()!=undefined && $('input[class=radio_postal_cellphone]:checked').val()!=null){

					var val = {
						custCellcode:'+47',
						custCellphone:parseInt($('input[class=radio_postal_cellphone]:checked').val())
					};
					$('#CustomerCellphone').editable('setValue',val);
				}
				else{
					var val = {
						custCellcode:'+47',
						custCellphone:''
					};
					$('#CustomerCellphone').editable('setValue',val);
				}

				var addrs  = {
					CCustAddress1: '',
		            CCustAddress2: '',
		            CCustZip: '',
		            CCustCity: '',
		           	CCustCountry:checkNull(anc_dt.partner_country,'NO'),
				};

				if($('input[class=radio_all_postal_address]:checked').val()!='' && $('input[class=radio_all_postal_address]:checked').val()!=undefined && $('input[class=radio_all_postal_address]:checked').val()!=null){
					var radio_all_postal_address = $('input[class=radio_all_postal_address]:checked').val();
					var radio_all_postal_address_arr  = radio_all_postal_address.split('_');
					if(radio_all_postal_address_arr[0]!=undefined && radio_all_postal_address_arr[0]!=null && radio_all_postal_address_arr[0]!=''){
							addrs.CCustAddress1 = radio_all_postal_address_arr[0];
					}
					else{
						addrs.CCustAddress1 = '';
					}
					if(radio_all_postal_address_arr[1]!=undefined && radio_all_postal_address_arr[1]!=null && radio_all_postal_address_arr[1]!=''){
							addrs.CCustZip = radio_all_postal_address_arr[1];
					}
					else{
						addrs.CCustZip = '';
					}
					if(radio_all_postal_address_arr[2]!=undefined && radio_all_postal_address_arr[2]!=null && radio_all_postal_address_arr[2]!=''){
						addrs.CCustCity = radio_all_postal_address_arr[2];
					}
					else{
						addrs.CCustCity = '';
					}
				}
				else{
					var addrs  = {
						CCustAddress1: '',
			            CCustAddress2: '',
			            CCustZip: '',
			            CCustCity: '',
			           	CCustCountry:checkNull(anc_dt.partner_country,'NO'),
					};
				}

				$('#show_customer_details #cust_postal_address').editable('setValue',addrs);
			}
			else{
				
				$('#CustomerCustomerName').editable('setValue',checkNull(rows.name));
				$('#customer_ein').editable('setValue',checkNull(rows.ein));

				var postal_phone = rows.show_postal_phone;
				postal_phone = postal_phone.replace(' ','');
				if(postal_phone == undefined || postal_phone ==''){	
					postal_phone = '';
				}
				
				var val = {
					custPhonecode:'+47',
					custPhone:checkNull(postal_phone)
				};
				$('#CustomerPhone').editable('setValue',val);	
				var postal_cellphone = rows.show_postal_cellphone;
				postal_cellphone = postal_cellphone.replace(' ','');
				if(postal_cellphone == undefined || postal_cellphone ==''){	
					postal_cellphone = '';
				}

				var val = {
					custCellcode:'+47',
					custCellphone:checkNull(postal_cellphone)
				};
				$('#CustomerCellphone').editable('setValue',val);
				
				var addrs  = {
					CCustAddress1: checkNull(rows.postal_address),
		            CCustAddress2: '',
		            CCustZip: checkNull(rows.postal_zip),
		            CCustCity: checkNull(rows.postal_city),
		           	CCustCountry:checkNull(anc_dt.partner_country,'NO'),
				};
				$('#show_customer_details #cust_postal_address').editable('setValue',addrs);
				
				
			}

		}else{
			if(fromd!=12){
				if(checkNull(rows.company_name) != ''){
					$('#CustomerCustomerName').editable('setValue',rows.company_name);
					if(checkNull(rows.first_name) != ''){
						$('#CustomerFirstName').editable('setValue',rows.first_name);
					}
					if(checkNull(rows.last_name) != ''){
						$('#CustomerLastName').editable('setValue',rows.last_name);
					}
					$('#CustomerUserGroupId').editable('setValue','2##1##1');
					$('tr.business').show();
					$('tr.consumer').hide();
				}
				else{
					if(checkNull(rows.first_name) != ''){
						$('#CustomerConsumerFirstName').editable('setValue',rows.first_name);
					}
					if(checkNull(rows.last_name) != ''){
						$('#CustomerConsumerLastName').editable('setValue',rows.last_name);
					}

					$('#CustomerUserGroupId').editable('setValue','1####');
					$('tr.business').hide();
					$('tr.consumer').show();
				}

				var addrs  = {
					CCustAddress1: checkNull(rows.address1),
		            CCustAddress2: checkNull(rows.address2),
		            CCustZip: checkNull(rows.zip),
		            CCustCity:checkNull(rows.city),
		           	CCustCountry:checkNull(anc_dt.partner_country,'NO'),
				};

				$('#show_customer_details #cust_postal_address').editable('setValue',addrs);

				if(rows.show_phone_number!=undefined && rows.show_phone_number!=null && rows.show_phone_number!=''){
					var phone_number = rows.show_phone_number;
					if(phone_number == undefined || phone_number ==''){	
						phone_number = rows.show_alternate_number;
					}
					phone_number = phone_number.replace(' ','');
					var val = {
						custCellcode:'+47',
						custCellphone:checkNull(phone_number)
					};
					$('#CustomerCellphone').editable('setValue',val);

				}

				if(rows.show_alertnate_number!=undefined && rows.show_alertnate_number!=null && rows.show_alertnate_number!=''){
					var phone_number = rows.show_alertnate_number;
					phone_number = phone_number.replace(' ','');

					var val = {
						custCellcode:'+47',
						custCellphone:checkNull(phone_number)
					};
					$('#CustomerCellphone').editable('setValue',val);
				}

				if(rows.show_landline_number!=undefined && rows.show_landline_number!=null && rows.show_landline_number!=''){
					var phone_number = rows.show_landline_number;
					var val = {
						custPhonecode:'+47',
						custPhone:checkNull(phone_number)
					};
					$('#CustomerPhone').editable('setValue',val);
				}
				$('#CustomerEmail').editable('setValue',checkNull(rows.email));	
			}
			else{
				if($('input[class=radio_company_name]:checked').val()!=undefined && $('input[class=radio_company_name]:checked').val()!=null && $('input[class=radio_company_name]:checked').val()!=''){
					
					$('#CustomerCustomerName').editable('setValue',$('input[class=radio_company_name]:checked').val());
					$('#CustomerUserGroupId').editable('setValue','2##1##1');
					$('tr.business').show();
					$('tr.consumer').hide();
				}
				else{
					
					if($('input[class=radio_name]:checked').val()!=undefined && $('input[class=radio_name]:checked').val()!=null && $('input[class=radio_name]:checked').val()!=''){
				
						var name = $('input[class=radio_name]:checked').val().split('_');
						$('#CustomerConsumerFirstName').editable('setValue',name[0]);
						$('#CustomerConsumerLastName').editable('setValue',name[1]);
						
						
					}
					$('#CustomerUserGroupId').editable('setValue','1####');

					$('tr.business').hide();
					$('tr.consumer').show();
				}

				var radio_cust_phone = $('input[class=radio_cust_phone]:checked').val();
				if(radio_cust_phone!='' && radio_cust_phone!=undefined && radio_cust_phone!=null){
					var val = {
						custPhonecode:'+47',
						custPhone:checkNull(phone_number)
					};
					$('#CustomerPhone').editable('setValue',val);
				}
				else{
					var val = {
						custPhonecode:'+47',
						custPhone:''
					};
					$('#CustomerPhone').editable('setValue',val);
				}

				var radio_cust_cellphone = $('input[class=radio_cust_cellphone]:checked').val();

				if(radio_cust_cellphone!='' && radio_cust_cellphone!=undefined && radio_cust_cellphone!=null){
					var val = {
						custCellcode:'+47',
						custCellphone:checkNull(radio_cust_cellphone)
					};
					$('#CustomerCellphone').editable('setValue',val);
				}
				else{
					var val = {
						custCellcode:'+47',
						custCellphone:''
					};
					$('#CustomerCellphone').editable('setValue',val);
				}

				var radio_all_address = $('input[class=radio_all_address]:checked').val();
				var addrs  = {
					CCustAddress1: '',
		            CCustAddress2: '',
		            CCustZip: '',
		            CCustCity: '',
		           	CCustCountry:checkNull(anc_dt.partner_country,'NO'),
				};
				if(radio_all_address!=undefined && radio_all_address!=null){
					var radio_all_address_split = radio_all_address.split('_');
					if(radio_all_address_split[0]!=undefined && radio_all_address_split[0]!=null){
						addrs.CCustAddress1 = radio_all_address_split[0];
					}
					else{
						addrs.CCustAddress1 = '';
					}

					if(radio_all_address_split[1]!=undefined && radio_all_address_split[1]!=null){
						addrs.CCustZip = radio_all_address_split[1];
					}
					else{
						addrs.CCustZip = '';
					}

					if(radio_all_address_split[2]!=undefined && radio_all_address_split[2]!=null){
						addrs.CCustCity = radio_all_address_split[2];
						$('#CustomerConsumerCity').val(radio_all_address_split[2]);
					}
					else{
						addrs.CCustCity = '';
					}
				}
				else{
					addrs  = {
						CCustAddress1: '',
			            CCustAddress2: '',
			            CCustZip: '',
			            CCustCity: '',
			           	CCustCountry:checkNull(anc_dt.partner_country,'NO'),
					};
				}
				$('#show_customer_details #cust_postal_address').editable('setValue',addrs);
			}
		}

		add_new_customer.showform();
	},
	adjust_radio:function(that,id){
		$('input[class='+id+']').each(function(){
			if(this!=that){
				$(this).prop('checked',false);
				$.uniform.update();
			}	
		});
	},
	getCityFromZip:function(zip='',ccode='',target='',frm=''){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			zip:zip,
			ccode:ccode,
		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/logins/getCityFromZip';

		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
			$('#'+target).val(complet_data.response.response.city);
		};
		if(frm == 'postal'){
			for(var j in getcitypost){
				clearInterval(getcitypost[j]);
			}
			getcitypost = [];
			getcitypost.push(setTimeout(function(){
				doAjax(params);
			},200));
		}
		else if(frm == 'delivery'){
			for(var j in getcitydelivery){
				clearInterval(getcitydelivery[j]);
			}
			getcitydelivery = [];
			getcitydelivery.push(setTimeout(function(){
				doAjax(params);
			},200));
		}
		
		
		
		
	}


}
