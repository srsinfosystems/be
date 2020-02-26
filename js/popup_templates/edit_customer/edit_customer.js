var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();

var global_edit_cust_meta_data;
var global_edit_cust_data;
var global_edit_cust_popupid = 'popups';
var global_ret_translations;
var country_list;
var partner_customer_groups;
var partner_price_groups;
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();
if(checkNull(date_format_partner)!=''){
	date_format = date_format_partner;
}
var edit_customer = {
	start:function(popupid,metadata={}){
		global_edit_cust_popupid = popupid;
		global_edit_cust_meta_data = metadata;
	
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['$edit_customer','General','Address','Voluntary work','Customer type','Consumer','Business','EIN','Customer name','Land line','Cellphone','$email','Customer group','Price group','Status','Inactive','Active','Referrer','Yes','No','Select','Postal address','Delivery address','Postal address1','Postal address2','Postal Zip','Postal City','Delivery address1','Delivery address2','Delivery Zip','Delivery City','Empty','Participant','Exempt','Specialty work','Grounds','Note','Activate','Alert message','Please enter valid EIN','Save','Cancel','Date of Birth','None','Success'],

		};
		if(global_edit_cust_meta_data.customer_id!=null && global_edit_cust_meta_data.customer_id!=undefined && global_edit_cust_meta_data!=''){
			total_params.customer_id = global_edit_cust_meta_data.customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/editCustomer.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_edit_cust_data = complet_data.response.response;
				global_edit_cust_data.global_edit_cust_meta_data = global_edit_cust_meta_data;
				global_ret_translations = complet_data.response.response.translationsData;
				edit_customer.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_ret_translations.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_ret_translations.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		var template = document.getElementById('edit_customer_template').innerHTML;
		global_edit_cust_data.date_format = date_format;
		var compiledRendered = Template7(template, global_edit_cust_data);
		document.getElementById(global_edit_cust_popupid).innerHTML = compiledRendered;
		resizemodal(global_edit_cust_popupid);
		edit_customer.bindEvents();
	},
	bindEvents:function(){
		var c_name = '';
		if(checkNull(global_edit_cust_data.customerData.customer_name)!=''){
			c_name = global_edit_cust_data.customerData.customer_name;
		}

		$("#customer_name").editable({
	       	value: c_name,  
	       	mode:'inline',  
	       	type: 'text',
	       	emptytext:global_ret_translations.Empty,
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#customer_name").addClass('editable_touched');
	   		},
		});
		var c_phone = '';
		if(checkNull(global_edit_cust_data.customerData.customer_phone)!=''){
			c_phone = global_edit_cust_data.customerData.customer_phone;
		}
		$("#customer_phone").editable({
	       	value:c_phone ,  
	       	mode:'inline',  
	       	type: 'text',
	       	emptytext:global_ret_translations.Empty,
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#customer_phone").addClass('editable_touched');
	   		},
		});
		var c_cellphone = '';
		if(checkNull(global_edit_cust_data.customerData.customer_cellphone)!=''){
			c_cellphone = global_edit_cust_data.customerData.customer_cellphone;
		}

		$("#customer_cellphone").editable({
	       	value: c_cellphone,  
	       	mode:'inline',  
	       	type: 'text',
	       	emptytext:global_ret_translations.Empty,
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#customer_cellphone").addClass('editable_touched');
	   		},
		});
		country_list = [];
		for(var j in global_edit_cust_data.getCountryWithPhoneCodeList){
			var d = global_edit_cust_data.getCountryWithPhoneCodeList[j];
			
			var splt = d.split('###');
		
			country_list.push({
				text:splt[0],
				value:splt[1]
			});
		}

		$("#customer_cellcode").editable({
	       	value: global_edit_cust_data.customerData.cp_code,  
	       	mode:'inline',  
	       	type: 'select2',
	       	source:country_list,
	       	emptytext:'',
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#customer_cellcode").addClass('editable_touched');
	   		},
		});


		$("#customer_phcode").editable({
	       	value: global_edit_cust_data.customerData.ph_code,  
	       	mode:'inline',  
	       	type: 'select2',
	       	source:country_list,
	       	emptytext:'',
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#customer_phcode").addClass('editable_touched');
	   		},
		});

		var c_email = '';
		if(checkNull(global_edit_cust_data.customerData.customer_email)!=''){
			c_email = global_edit_cust_data.customerData.customer_email;
		}

		$("#customer_email").editable({
	       	value: c_email,  
	       	mode:'inline',  
	       	type: 'text',
	       	emptytext:global_ret_translations.Empty,
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#customer_email").addClass('editable_touched');
	   		},
		});

		
		var non = '--'+global_ret_translations.None+'--';
		partner_customer_groups = [{text:non,value:'none'}];

		for(var j in global_edit_cust_data.PartnerCustomerGroup){
			var pcg = global_edit_cust_data.PartnerCustomerGroup[j].PartnerCustomerGroup;
			partner_customer_groups.push({
				text:pcg.group_name,
				value:pcg.id
			});
		}


		partner_price_groups = [];
		var sel_val = '';
		for(var j in global_edit_cust_data.pricegroupData){
			var ppg = global_edit_cust_data.pricegroupData[j].ProductPriceGroup;
			partner_price_groups.push({
				text:ppg.en_price_group,
				value:ppg.group_id
			});	
		
			if(ppg.en_price_group.trim()=='Standard'){
				sel_val = ppg.group_id;
			}
		}
		
		if(checkNull(global_edit_cust_data.customerData.price_group_id)!='' && global_edit_cust_data.customerData.price_group_id!=0){
			sel_val = global_edit_cust_data.customerData.price_group_id;
		}

		$("#price_group_inp").editable({
	       	value: sel_val,  
	       	mode:'inline',  
	       	type: 'select2',
	       	source:partner_price_groups,
       		emptytext:global_ret_translations.Select,
	       	select2:{
	   		   placeholder:global_ret_translations.Select,
	       	},
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#price_group").addClass('editable_touched');
	   		},
		});

		
		if(partner_customer_groups.length!=0){
			var cust_grp = 'none';
			if(checkNull(global_edit_cust_data.customerData.customer_group_id,'')!='' && global_edit_cust_data.customerData.customer_group_id!=0){
				cust_grp = global_edit_cust_data.customerData.customer_group_id;
			}
		
			$("#customer_group").editable({
		       	value: cust_grp,  
		       	mode:'inline',  
		       	type: 'select2',
		       	source:partner_customer_groups,
		       	emptytext:global_ret_translations.Select,
		       	select2:{
		   		   placeholder:global_ret_translations.Select,
		       	},
		       	validate:function(value){
		       		
		       	},

		        success: function(data, config) {
		        	console.log(config);
		        	console.log('config');
	        		for(var j in global_edit_cust_data.PartnerCustomerGroup){
	        			var pcg = global_edit_cust_data.PartnerCustomerGroup[j].PartnerCustomerGroup;

	        			if(pcg.id == config){
	        				$("#price_group_inp").editable('enable').editable('setValue',pcg.price_group_id).editable('disable');
	        				break;
	        			}
	        		}
	        		if(config=='none'){
	        			$("#price_group_inp").editable('enable');
	        		}

		        	$("#customer_group").addClass('editable_touched');
		   		},
			});
			$("#price_group_inp").editable('disable');
		}
		else{
			$('.customer_group_wrapper').addClass('hide');
		}

		if(cust_grp=='none'){
			$("#price_group_inp").editable('enable');
		}


		
		if(global_edit_cust_data.customerData.status){
			var status = 1;
		}
		else{
			var status = 0;
		}
		$("#customer_status").editable({
	       	value:  status,
	       	mode:'inline',  
	       	type: 'select2',
	       	source:[{text:global_ret_translations.Inactive,value:0},{text:global_ret_translations.Active,value:1}],
	       	emptytext:'',
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#customer_status").addClass('editable_touched');
	   		},
		});
		var c = 0;
		if(global_edit_cust_data.partnerReferrer.id != '' && global_edit_cust_data.partnerReferrer.id  !=undefined && global_edit_cust_data.partnerReferrer.id  !=null ){
			c = 1;
		}
		var opts = [{text:global_ret_translations.Yes,value:1},{text:global_ret_translations.No,value:0}];

		$('#partner_referrer').editable({
			value:  c,
	       	mode:'inline',  
	       	type: 'select2',
	       	source:opts,
	       	emptytext:'',
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#partner_referrer").addClass('editable_touched');
	   		},
		});

		var sscountryList = global_edit_cust_data.getAllCountryList;
	
		var ssopts = '';
		$.each(sscountryList, function (index, val) {
			ssopts += '<option value="'+index+'">'+val+'</option>';
		});

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Address1 = function (options) {
		        this.init('address1', options, Address1.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Address1, $.fn.editabletypes.abstractinput);

		    $.extend(Address1.prototype, {
		     
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
		           
		            if(checkNull(value.CustomerAddress1)!=''){
		            	html += $('<div>').text(value.CustomerAddress1).html()+ ',<br/>';
		            }
		            
		            if(checkNull(value.CustomerAddress2)!=''){
		            	html += $('<div>').text(value.CustomerAddress2).html()+ ',<br/>';
		            }

		            if(checkNull(value.CustomerZip)!=''){
		            	html += $('<div>').text(value.CustomerZip).html()+ ',<br/>';
		            }

		            if(checkNull(value.CustomerCity)!=''){
		            	html += $('<div>').text(value.CustomerCity).html()+ ',<br/>';
		            }

		            if(checkNull(value.CustomerCountry)!=''){
		            	html += $('<div>').text(value.CustomerCountry).html();
		            }
		             if(html==''){
			            	html += $('<div>').text(global_ret_translations.Empty).html();
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
					this.$input.filter('[name="CustomerAddress1"]').val(value.CustomerAddress1);
					this.$input.filter('[name="CustomerAddress2"]').val(value.CustomerAddress2);
					this.$input.filter('[name="CustomerZip"]').val(value.CustomerZip);
					this.$input.filter('[name="CustomerCity"]').val(value.CustomerCity);
					this.$select.filter('[name="CustomerCountry"]').val(value.CustomerCountry).trigger('change');
		 
		       },           
		       input2value: function() { 
		           return {
		              CustomerAddress1: this.$input.filter('[name="CustomerAddress1"]').val(), 
		              CustomerAddress2: this.$input.filter('[name="CustomerAddress2"]').val(), 
		              CustomerZip: this.$input.filter('[name="CustomerZip"]').val(), 
		              CustomerCity: this.$input.filter('[name="CustomerCity"]').val(), 
		              CustomerCountry: this.$select.filter('[name="CustomerCountry"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$input.filter('[name="CustomerAddress1"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Address1.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><input type="text" id="CustomerAddress1" name="CustomerAddress1" class="" placeholder="'+global_ret_translations.Postaladdress1+'"></label></div>'+
		       	 '<div class="editable-address"><label><input type="text" id="CustomerAddress2" name="CustomerAddress2" class="" placeholder="'+global_ret_translations.Postaladdress2+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CustomerZip" name="CustomerZip" class="" placeholder="'+global_ret_translations.PostalZip+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CustomerCity" name="CustomerCity" class="" placeholder="'+global_ret_translations.PostalCity+'"></label></div>'+
		             '<div class="editable-address"><label><select id="CustomerCountry" name="CustomerCountry" class="">'+ssopts+'</select></label></div>',
		             
		        inputclass: ''
		    });
		    $.fn.editabletypes.address1 = Address1;

		}(window.jQuery));


 		$('#address1').editable({
	        url: 'asas',
	        showbuttons:'bottom',
	        title: 'Postal Address',
	        value: {
	            CustomerAddress1: checkNull(global_edit_cust_data.customerData.customer_address1),
	            CustomerAddress2: checkNull(global_edit_cust_data.customerData.customer_address2),
	            CustomerZip:checkNull(global_edit_cust_data.customerData.customer_zip),
	            CustomerCity:checkNull(global_edit_cust_data.customerData.customer_city),
	           	CustomerCountry:checkNull(global_edit_cust_data.customerData.customer_country),
	        },
	        success: function(data, config) {
	        	$('#address1').addClass('editable_touched');
	        }
	    });

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Address2 = function (options) {
		        this.init('address2', options, Address2.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Address2, $.fn.editabletypes.abstractinput);

		    $.extend(Address2.prototype, {
		     
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
	           
		            if(checkNull(value.CustomerDeliveryAddress1)!=''){
		            	html += $('<div>').text(value.CustomerDeliveryAddress1).html()+ ',<br/>';
		            }
		            
		            if(checkNull(value.CustomerDeliveryAddress2)!=''){
		            	html += $('<div>').text(value.CustomerDeliveryAddress2).html()+ ',<br/>';
		            }

		            if(checkNull(value.CustomerDeliveryZip)!=''){
		            	html += $('<div>').text(value.CustomerDeliveryZip).html()+ ',<br/>';
		            }

		            if(checkNull(value.CustomerDeliveryCity)!=''){
		            	html += $('<div>').text(value.CustomerDeliveryCity).html()+ ',<br/>';
		            }

		            if(checkNull(value.CustomerDeliveryCountry)!=''){
		            	html += $('<div>').text(value.CustomerDeliveryCountry).html();
		            }

		            if(html==''){
		            	html += $('<div>').text(global_ret_translations.Empty).html();
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
					this.$input.filter('[name="CustomerDeliveryAddress1"]').val(value.CustomerDeliveryAddress1);
					this.$input.filter('[name="CustomerDeliveryAddress2"]').val(value.CustomerDeliveryAddress2);
					this.$input.filter('[name="CustomerDeliveryZip"]').val(value.CustomerDeliveryZip);
					this.$input.filter('[name="CustomerDeliveryCity"]').val(value.CustomerDeliveryCity);
					this.$select.filter('[name="CustomerDeliveryCountry"]').val(value.CustomerDeliveryCountry).trigger('change');
		 
		       },           
		       input2value: function() { 
		           return {
		              CustomerDeliveryAddress1: this.$input.filter('[name="CustomerDeliveryAddress1"]').val(), 
		              CustomerDeliveryAddress2: this.$input.filter('[name="CustomerDeliveryAddress2"]').val(), 
		              CustomerDeliveryZip: this.$input.filter('[name="CustomerDeliveryZip"]').val(), 
		              CustomerDeliveryCity: this.$input.filter('[name="CustomerDeliveryCity"]').val(), 
		              CustomerDeliveryCountry: this.$select.filter('[name="CustomerDeliveryCountry"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$input.filter('[name="CustomerDeliveryAddress1"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Address2.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><input type="text" id="CustomerDeliveryAddress1" name="CustomerDeliveryAddress1" class="" placeholder="'+global_ret_translations.Deliveryaddress1+'"></label></div>'+
		       	 '<div class="editable-address"><label><input type="text" id="CustomerDeliveryAddress2" name="CustomerDeliveryAddress2" class="" placeholder="'+global_ret_translations.Deliveryaddress2+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CustomerDeliveryZip" name="CustomerDeliveryZip" class="" placeholder="'+global_ret_translations.DeliveryZip+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CustomerDeliveryCity" name="CustomerDeliveryCity" class="" placeholder="'+global_ret_translations.DeliveryCity+'"></label></div>'+
		             '<div class="editable-address"><label><select id="CustomerDeliveryCountry" name="CustomerDeliveryCountry" class="">'+ssopts+'</select></label></div>',
		             
		        inputclass: ''
		    });
		    $.fn.editabletypes.address2 = Address2;

		}(window.jQuery));

		$('#address2').editable({
	        url: '',
	        showbuttons:'bottom',
	        title: 'Delivery Address',
	        value: {
	            CustomerDeliveryAddress1: checkNull(global_edit_cust_data.customerData.delivery_address1),
	            CustomerDeliveryAddress2:checkNull(global_edit_cust_data.customerData.delivery_address2),
	            CustomerDeliveryZip:checkNull(global_edit_cust_data.customerData.delivery_zip),
	            CustomerDeliveryCity:checkNull(global_edit_cust_data.customerData.delivery_city),
	           	CustomerDeliveryCountry:checkNull(global_edit_cust_data.customerData.delivery_country),
	        },
	        success: function(data, config) {
	        	$('#address2').addClass('editable_touched');
	        }
	    });
		var op = [
			{text:global_ret_translations.Participant,value:'participant'},
			{text:global_ret_translations.Exempt,value:'exempt'},
			{text:global_ret_translations.Specialtywork,value:'specialty_work'}
		];
		var v_type = 'participant';
		if(checkNull(global_edit_cust_data.customerData.volunteer_type)!=''){
			v_type = global_edit_cust_data.customerData.volunteer_type;
		}
	    $("#voluntary_type").editable({
	       	value:  v_type,
	       	mode:'inline',  
	       	type: 'select2',
	       	source:op,
	       	emptytext:global_ret_translations.Select,
	       
       	 	select2:{
	   		   placeholder:global_ret_translations.Select,
	       	},
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#voluntary_type").addClass('editable_touched');
	        	if(config=='exempt'){
	        		$('.voluntary_note_wrapper').addClass('hide');
	        		$('.voluntary_ground_wrapper').removeClass('hide');
	        	}
	        	else if(config=='specialty_work'){
	        		$('.voluntary_note_wrapper').removeClass('hide');
	        		$('.voluntary_ground_wrapper').addClass('hide');
	        	}
	        	else{
	        		$('.voluntary_note_wrapper').addClass('hide');
	        		$('.voluntary_ground_wrapper').addClass('hide')
	        	}
	   		},
		});

		var opts = [];
		for(var j in global_edit_cust_data.getexemptData.PartnerExemptReasons){
			var per = global_edit_cust_data.getexemptData.PartnerExemptReasons[j].PartnerExemptReason;
			opts.push({
				text:per.name,
				value:per.id
			})
		}
		var v_ground = '';
		if(v_type=='exempt'){
			var v_ground = global_edit_cust_data.customerData.voluntary_note;
			$('.voluntary_ground_wrapper').removeClass('hide');
		}
		$("#voluntary_ground").editable({
	       	value:  v_ground,
	       	mode:'inline',  
	       	type: 'select2',
	       	source:opts,
	       	emptytext:global_ret_translations.Select,
	       
       	 	select2:{
	   		   placeholder:global_ret_translations.Select,
	       	},
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#voluntary_ground").addClass('editable_touched');
	   		},
		});

		var v_note = '';
		if(v_type=='specialty_work'){
			var v_note = global_edit_cust_data.customerData.voluntary_note;
			$('.voluntary_note_wrapper').removeClass('hide');
		}
		$("#voluntary_note").editable({
	       	value:  v_note,
	       	mode:'inline',  
	       	type: 'textarea',

	       	emptytext:global_ret_translations.Empty,
	
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#voluntary_note").addClass('editable_touched');
	   		},
		});


		var dob = '';
		if(checkNull(global_edit_cust_data.customerData.customer_dob)!=''){
			dob = convertDateIntoSiteFormat(global_edit_cust_data.customerData.customer_dob);
		}
		$("#date_of_birth").editable({
			value:dob,
			type:'text',
	       	mode:'inline',  
	       	emptytext:global_ret_translations.Empty,
	       	validate:function(value){
	       		
	       	},
	        success: function(data, config) {
	        	console.log(config);
	        	$("#date_of_birth").addClass('editable_touched');
	   		},
		}).click(function(){
			$('#date_of_birth').next('span').find('input').inputmask(date_format_mask ,{autoUnmask: false});		
		});


		$('#same_postal_address').bootstrapSwitch();
		$('#same_postal_address input').change(function(){
			var status = $('#same_postal_address').bootstrapSwitch('status');
			if(status){
				$('.delivery_address_wrapper').removeClass('hide');
			}
			else{
				$('.delivery_address_wrapper').addClass('hide');
			}
		}).trigger('change');

		$('#btnEin').click(function(){
			var ein = $('#CustomerEin').val();
			var ein_len = ein.length;
			if(ein_len < 8 || checkNull(ein,'')==''){
				showAlertMessage(global_ret_translations.PleaseentervalidEIN,'error',global_ret_translations.Alertmessage);
				return;
			}
			edit_customer.getCustomerByEin(ein);
		});

		$('#save_customer').click(function(){
			edit_customer.saveData();
		});

	},
	getCustomerByEin:function(ein){
		showProcessingImage('undefined');
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			phone_no:ein,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/search/getEinInformation.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status=='success'){
				var eindata = complet_data.response.response.einData;
				console.log(eindata);
				$('#customer_name').editable('setValue',checkNull(eindata.name));
			}
		}
		doAjax(params);
		return;
	},
	saveData:function(){
		console.log('here');
		var ein = $('#CustomerEin').val();
		var user_group_id = $('#CustomerUserGroupId').val();

		var customer_name_val = $('#customer_name').editable('getValue');
		var customer_name = customer_name_val.customer_name;

		var customer_phcode_val = $('#customer_phcode').editable('getValue');
		var customer_phcode = customer_phcode_val.customer_phcode;

		var customer_phone_val = $('#customer_phone').editable('getValue');
		var customer_phone = customer_phone_val.customer_phone;

		var customer_cellcode_val = $('#customer_cellcode').editable('getValue');
		var customer_cellcode = customer_cellcode_val.customer_cellcode;

		var customer_cellphone_val = $('#customer_cellphone').editable('getValue');
		var customer_cellphone = customer_cellphone_val.customer_cellphone;

		var customer_email_val = $('#customer_email').editable('getValue');
		var customer_email = customer_email_val.customer_email;

		var customer_group_val = $('#customer_group').editable('getValue');
		var customer_group_id = customer_group_val.customer_group;


		var price_group_inp_val = $('#price_group_inp').editable('getValue');
		var price_group = price_group_inp_val.price_group_inp;

		var customer_status_val = $('#customer_status').editable('getValue');
		var status = customer_status_val.customer_status;

		var partner_referrer_val = $('#partner_referrer').editable('getValue');
		var is_referrer = partner_referrer_val.partner_referrer;

		var address1val = $('#address1').editable('getValue');

		var address1 = address1val.address1.CustomerAddress1;
		var address2 = address1val.address1.CustomerAddress2;
		var zip = address1val.address1.CustomerZip;
		var city = address1val.address1.CustomerCity;
		var country = address1val.address1.CustomerCountry;

		var address2val = $('#address2').editable('getValue');

		var delivery_address1 = address2val.address2.CustomerDeliveryAddress1;
		var delivery_address2 = address2val.address2.CustomerDeliveryAddress2;
		var delivery_country = address2val.address2.CustomerDeliveryCountry;
		var delivery_city = address2val.address2.CustomerDeliveryCity;
		var delivery_zip = address2val.address2.CustomerDeliveryZip;


		var date_of_birth = $('#date_of_birth').editable('getValue');
		date_of_birth = date_of_birth.date_of_birth;

		var same_postal_address = $('#same_postal_address').bootstrapSwitch('status');
		if(same_postal_address){
			same_postal_address = 'n';
		}
		else{
			same_postal_address = 'y';
			var delivery_address1 = address1;
			var delivery_address2 = address2;
			var delivery_country = country;
			var delivery_city = city;
			var delivery_zip = zip;

		}
		if(checkNull(ein)==''){
			ein = '';
		}

		var voluntary_type_val = $('#voluntary_type').editable('getValue');
		var voluntary_type = voluntary_type_val.voluntary_type;

		var voluntary_note = '';
		if(voluntary_type=='exempt'){
			var voluntary_ground = $('#voluntary_ground').editable('getValue');
			voluntary_note = voluntary_ground.voluntary_ground;
		}
		else if(voluntary_type=='specialty_work'){
			var voluntary_note_val = $("#voluntary_note").editable('getValue');
			voluntary_note = voluntary_note_val.voluntary_note;
		}
		var phone_country_code = '';
		var cellphone_country_code = '';
		for(var j in global_edit_cust_data.getCountryWithPhoneCodeList){
			var pcl = global_edit_cust_data.getCountryWithPhoneCodeList[j];
			var splt = pcl.split('###');
			
			if(customer_phcode==splt[1]){
				console.log('yay');

				var phone_country_code = j;
			}
			if(customer_cellcode==splt[1]){
				console.log('yay');
				
				var cellphone_country_code = j;
			}
			if(phone_country_code!='' && cellphone_country_code!=''){
				break;
			}
		}	
		

		var  f_params = {
			customer_ein:ein,
			user_group_id:user_group_id,
			customer_name:customer_name,
			phone_country_code:phone_country_code,
			cellphone_country_code:cellphone_country_code,
			phone_code:customer_phcode,
			cell_code:customer_cellcode,
			phone:customer_phone,
			cellphone:customer_cellphone,
			email:customer_email,
			price_group:price_group,
			customer_group_id:customer_group_id,
			address1:address1,
			address2:address2,
			zip:zip,
			city:city,
			country:country,
			delivery_address1:delivery_address1,
			delivery_address2:delivery_address2,
			delivery_zip:delivery_zip,
			delivery_city:delivery_city,
			delivery_country:delivery_country,
			dob:date_of_birth,
			volunteer_type:voluntary_type,
			voluntary_note:voluntary_note,
			old_customer_group_id:global_edit_cust_data.customerData.customer_group_id,
			referral:is_referrer,
			referrer_id:0,
			referrer_number:0,
			customer_id:global_edit_cust_meta_data.customer_id,
			same_postal_address:same_postal_address,
			status:status
		};

		if(checkNull(global_edit_cust_data.partnerReferrer.id)!=''){
	
			f_params.referrer_id = global_edit_cust_data.partnerReferrer.id;
			f_params.referrer_number = global_edit_cust_data.partnerReferrer.referrer_number;
		}
		console.log(f_params);

		var total_params = Object.assign({
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id
		},f_params);

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/editCustomerDetailsOnly.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',global_ret_translations.Success,complet_data.response.response.message.msg);
				$('#'+global_edit_cust_popupid).modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_ret_translations.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_ret_translations.Alertmessage);
					return;
				}	
			}
		}

		showProcessingImage('undefined');
		doAjax(params);
		return;

	},
}