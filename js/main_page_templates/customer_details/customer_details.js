var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id = $('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var type  =  $('#type').val();
var partner_dir = $('#partner_dir').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();
if(checkNull(date_format_partner)!=''){
	date_format = date_format_partner;
}
var gbl_cellphn_err = '';
var gbl_phn_err = '';
var gbl_ein_err = '';
var cust_det_dt;
var cust_det_trans_dt;
var cust_det_cstm_dt;
var ssopts = '';
var country_list = [];
var country_list_opts = '';
var partner_customer_groups = [];
var partner_customer_groups_opts = '';

var partner_price_groups = [];
var partner_price_groups_opts = '';
var sel_val = '';
var gbl_pst_addr_err = '';
var quote_current_page = 0;
var quote_last_page = 0;
var quote_limit = 0;

var order_current_page = 0;
var order_last_page = 0;
var order_limit = 0;

var inline_loader = host_url + 'app/webroot/img/loading.gif';
var sales_inter = '';

var getcitypostde = [];
var getcitydeliveryde = [];

var default_cell_code = '';
var customer_details = {
	start:function(custom_data={}){
		if($.isEmptyObject(custom_data)){
			return;
		}
		cust_det_cstm_dt = custom_data;
		
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cust_det_cstm_dt.customer_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','Customers','Customer number','Postal address','Customer EIN','Add delivery address','Delivery address','Phone','Cellphone','$email','None','Standard','Price group','Customer group','Sales Summary','TOTAL SALES','BALANCE','NOT YET DUE','OVERDUE','Birth date','Contacts','Communications','Quotes','Orders','Invoices','Tasks','Notes','Slips','Meters','Other information','Recent activities','Voluntary work','Actions','Send email','Send SMS','New sales document','Add new task','Edit customer','Transactions','Add new customer','Add contact','Reactivate','Search','Back','Yes','No','Confirmation','$no_email','Success','Alert message','alert message','Customer detail updated successfully','Enter valid email address','Enter valid EIN','Address updated successfully','Postal address1','Postal address2','Postal zip','Postal city','Delivery address1','Delivery address2','Delivery zip','Delivery city','Select','Click to set a delivery address','Other information new','Invoices distribution','Payment reminders','Send reminders','Do not send reminders','Mass communication SMS','Mass communication email','Payment terms','Enter valid number','Credit days','Sales properties updated successfully','Newsletters and updates updated successfully','$email','$srno','Last name','First name','Cellphone','Status','Default contact','Action','Active','Inactive','Yes','Edit','Delete','Send SMS','$sure_del_cntt','Warning','records','of','Found total','View','Quote number','Amount','Date','Sent to customer','Accepted','Declined','Expired','Retract','Cancelled','Order number','Draft','Processing','Delivered','Credit memo','Invoice','Open','Closed','Scheduled','Invoice number','Invoice date','Due date','Balance','Payment status','Not paid','Partially paid','Paid','Partially credited','Credited','Lost','Loss paid','Loss credited','Recovered from loss','$loss_pp','$loss_pc','Payment','Refund','$real_del','Credit number','Credit date','No record found','Newsletters and updates','Unsubscribed','Via email','Via SMS','Via email and sms','Page','Private individual','$bui_org','$org','$born','Enter valid birth date','Enter valid customer name','$comp_reg','EIN','$bir_date','Empty','Default','Dock','Slip','Meter','Assigned since','Boat type','Registration number','Edit slip','Delete slip','Switch slip','$del_slip','Last read','Value','kWh','Edit meter','Delete meter','View log','Assign slip','Assign meter','Date and time','$no_more_email','me','Draft','Reply','$fwd_hash','Mark as read','Mark as unread','Close','Edit recipients','Edit subject','Send','Discard','to','Print','Show source','Attachments','Download all attachments','To','Your Sent item listing is empty','$more_email_to','$more_emails_to','Attachments','Download all attachments','Email Deleted successfully','Cancel','$del_this_email','$del_this_emails','$del_this_sel_email','No newsletters and updates','$no_news','$via_email','$via_sms','$via_sms_and_email','Page','Conflict','Return to sender','Preferred distribution','On water','On land','Remove slip','Place on water','Haul out of water','Cancel boat storage','$canc_storage','Cancel','Confirmation','Sales this year','$use_inb','click here','to do so','Set to inactive','Set to active','$meterh'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerData.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				cust_det_dt = complet_data.response.response;
				cust_det_trans_dt = complet_data.response.response.translationsData;
				if(checkNull(cust_det_dt.customerData.customer_group_id)==''){
					cust_det_dt.customerData.customer_group_id = 'none';
				}
				customer_details.createHtml(complet_data.response.response);
				$('#customer_tab_content').empty();
				customer_details.showTabs('contacts','tab_1_1')
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cust_det_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_dt.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		customer_details.getSummary(); 
		return;
	},
	createHtml:function(){
		cust_det_dt.dashboardurl = base_url+'dashboard/index';
		cust_det_dt.loaderurl = host_url+'app/webroot/img/loading.gif';
		cust_det_dt.custom_data = cust_det_cstm_dt;
		cust_det_dt.date_format = date_format;
		cust_det_dt.type = type;
		cust_det_dt.base_url = base_url;
		cust_det_dt.customer_status = 0;
		if(cust_det_dt.customerData.status){
			cust_det_dt.customer_status = 1;
		}

		cust_det_dt.protocol = window.location.protocol


		var template = document.getElementById('manual_digipost_template').innerHTML;
		var compiledRendered = Template7(template, cust_det_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		if(checkNull(cust_det_dt.contactList)!=''){
			customer_details.generateContactList(JSON.stringify(cust_det_dt.contactList));
		}
		else{
			customer_details.generateContactList(JSON.stringify([]));
		}
		$(window).scrollTop(0);
		hideProcessingImage();
		try{
			var dat = cust_det_dt.getCountryWithPhoneCodeList[cust_det_dt.partner_country];
			dat = dat.split('###');
			if(checkNull(dat[1]) != ''){
				default_cell_code = dat[1];
			}
		}
		catch(e){

		}
		customer_details.bindJs();
		
		// if(Object.values(cust_det_dt.getPartnerSubscribedPlanModules).indexOf('marina') > -1){
		// 	new_custom_tabs2('customer_slips');
		// 	new_custom_tabs2('customer_meters');
		// }
		// if(Object.values(cust_det_dt.getPartnerSubscribedPlanModules).indexOf('tasks') > -1){
		// 	new_custom_tabs2('customer_tasks');
		// }
		// new_custom_tabs2('comm_sent');
		// new_custom_tabs2('customer_custom_fields');
		if(cust_det_dt.getPartnerCustomSettings.enable_social_images == 'y'){
			customer_details.getGravatar();
		}
		else{
			$('.gravatar_img').hide();
    		$('.gravatar_initial').hide();
		}
		
		

	},
	getGravatar:function(frm=''){
		var h = cust_det_dt.customerData.hashemail;
		
		var img_url = cust_det_dt.protocol +'//www.gravatar.com/avatar/'+h+'?s=70&d=404';
		var img_url1 = cust_det_dt.protocol +'//www.gravatar.com/avatar/'+h+'?s=400&d=404';
		$('.gravatar_initial').html(cust_det_dt.customerData.initials);
		$.get(img_url)
    	.done(function() { 
    		if(frm=='update'){
    			$('.gravatar_img').attr('src',img_url);
    			$('.gravatar_img_pre').attr('href',img_url1)
    		}
    		$('.gravatar_img').show();
    		$('.gravatar_initial').hide();
    		
    	}).fail(function() { 
    		$('.gravatar_img').hide();
    		$('.gravatar_initial').show();
    		
    	});
		
	},
	bindJs:function(){
		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Ein = function (options) {
		        this.init('ein', options, Ein.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Ein, $.fn.editabletypes.abstractinput);

		    $.extend(Ein.prototype, {
		     
		        render: function() {
		           this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		             this.$select.select2({
		             	allowClear:true,
		            	placeholder:cust_det_trans_dt.Select
		             });
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		        
		           	var html = '';

		            if(checkNull(value)!=''){
		            	var a  = cust_det_trans_dt.$org;
		    
		            	a = a.replace('INSERT_EIN_HERE',value);
		         
		            	html += '<p>'+$('<div>').text(value).html()+ '</p>';
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
					this.$input.filter('[name="ein"]').val(checkNull(value));
		 
		       },           
		       input2value: function() { 
		           return this.$input.filter('[name="ein"]').val();
		           
		       },         
		       activate: function() {

		            this.$input.filter('[name="ein"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Ein.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><input type="text" id="ein" name="ein" class="" placeholder="'+cust_det_trans_dt.EIN+'"></label></div>'+
		       	 '</div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.ein = Ein;
		}(window.jQuery));

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Dob = function (options) {
		        this.init('dob', options, Dob.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Dob, $.fn.editabletypes.abstractinput);

		    $.extend(Dob.prototype, {
		     
		        render: function() {
		           this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		             this.$select.select2({
		             	allowClear:true,
		            	placeholder:cust_det_trans_dt.Select
		             });
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
					this.$input.filter('[name="dob"]').val(checkNull(value));
		 
		       },           
		       input2value: function() { 
		           return this.$input.filter('[name="dob"]').val();
		       },         
		       activate: function() {
		       		this.$input.inputmask(date_format_mask ,{autoUnmask: false});	
		       		this.$input.filter('[name="dob"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Dob.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><input type="text" id="dob" name="dob" class="" placeholder="'+cust_det_trans_dt.Birthdate+'"></label></div>'+
		       	 '</div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.dob = Dob;
		}(window.jQuery));

		var sscountryList = cust_det_dt.getAllCountryList;
		ssopts = '<option></option>';
		$.each(sscountryList, function (index, val) {
			ssopts += '<option value="'+index+'">'+val+'</option>';
		});

		country_list = [];
		country_list_opts = '<option></option>';
		for(var j in cust_det_dt.getCountryWithPhoneCodeList){
			var d = cust_det_dt.getCountryWithPhoneCodeList[j];
			
			var splt = d.split('###');
		
			country_list.push({
				text:splt[0],
				value:splt[1]
			});

			country_list_opts += '<option value="'+splt[1]+'">'+splt[0]+'</option>';
		}

		var non = cust_det_trans_dt.None;
		partner_customer_groups = [{text:non,value:'none'}];
		partner_customer_groups_opts = '';
		partner_customer_groups_opts += '<option value="none">'+non+'</option>';

		for(var j in cust_det_dt.PartnerCustomerGroup){
			var pcg = cust_det_dt.PartnerCustomerGroup[j].PartnerCustomerGroup;
			partner_customer_groups.push({
				text:pcg.group_name,
				value:pcg.id
			});
			partner_customer_groups_opts += '<option value="'+pcg.id+'">'+pcg.group_name+'</option>';
		}


		partner_price_groups = [];
		partner_price_groups_opts = '';

		sel_val = '';
		var is_present = '';
		for(var j in cust_det_dt.pricegroupData){
			var ppg = cust_det_dt.pricegroupData[j].ProductPriceGroup;
			partner_price_groups.push({
				text:ppg.en_price_group,
				value:ppg.group_id
			});	
		
			if(ppg.en_price_group.trim()=='Standard'){
				sel_val = ppg.group_id;
			}
			partner_price_groups_opts+= '<option value="'+ppg.group_id+'">'+ppg.en_price_group+'</option>';
		}


		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Address3 = function (options) {
		        this.init('address3', options, Address3.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Address3, $.fn.editabletypes.abstractinput);

		    $.extend(Address3.prototype, {
		     
		        render: function() {
		           this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		             this.$select.select2({
		             	allowClear:true,
		            	placeholder:cust_det_trans_dt.Select
		             });
		        },
		        value2html: function(value, element) {

		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		        
		           var html = '';

		            if(checkNull(value.CustAddress1)!=''){
		            	html += '<p>'+$('<div>').text(value.CustAddress1).html()+ '</p>';
		            }
		            
		            if(checkNull(value.CustAddress2)!=''){
		            	html += '<p>'+$('<div>').text(value.CustAddress2).html()+ '</p>';
		            }

		            if(checkNull(value.CustZip)!='' || checkNull(value.CustCity)!=''){
		            	var CustZip = checkNull(value.CustZip);
		            	var CustCity =  checkNull(value.CustCity);

		            	html += '<p>';
		            	html += CustZip;
		            	if(CustZip!=''){
		            		html += '&nbsp;';
		            	}
		            	html += CustCity;
		            	
		            	html += '</p>';
		            }

		          

		            if(checkNull(value.CustCountry)!='' && html!=''){
		            	if(cust_det_dt.getPartnerCustomSettings.show_customer_country == 'y' || (cust_det_dt.partner_country!=value.CustCountry)){
		            		html += '<p>'+$('<div>').text(checkNull(cust_det_dt.getAllCountryList[value.CustCountry])).html() + '</p>';
		            	}
		            	
		            }
		            if(html==''){
			           	html += '<p>'+$('<div>').text(cust_det_trans_dt.Empty).html()+'</p>';
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
					this.$input.filter('[name="CustAddress1"]').val(checkNull(value.CustAddress1));
					this.$input.filter('[name="CustAddress2"]').val(checkNull(value.CustAddress2));
					this.$input.filter('[name="CustZip"]').val(checkNull(value.CustZip));
					this.$input.filter('[name="CustCity"]').val(checkNull(value.CustCity));
					this.$select.filter('[name="CustCountry"]').val(checkNull(value.CustCountry)).trigger('change');
		 
		       },           
		       input2value: function() { 
		           return {
		              CustAddress1: this.$input.filter('[name="CustAddress1"]').val(), 
		              CustAddress2: this.$input.filter('[name="CustAddress2"]').val(), 
		              CustZip: this.$input.filter('[name="CustZip"]').val(), 
		              CustCity: this.$input.filter('[name="CustCity"]').val(), 
		              CustCountry: this.$select.filter('[name="CustCountry"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$input.filter('[name="CustAddress1"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Address3.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><input type="text" id="CustAddress1" name="CustAddress1" class="" placeholder="'+cust_det_trans_dt.Postaladdress1+'"></label></div>'+
		       	 '<div class="editable-address"><label><input type="text" id="CustAddress2" name="CustAddress2" class="" placeholder="'+cust_det_trans_dt.Postaladdress2+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CustZip" name="CustZip" class="" placeholder="'+cust_det_trans_dt.Postalzip+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CustCity" name="CustCity" class="" placeholder="'+cust_det_trans_dt.Postalcity+'"></label></div>'+
		             '<div class="editable-address"><label><select id="CustCountry" name="CustCountry" class="">'+ssopts+'</select></label></div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.address3 = Address3;
		}(window.jQuery));

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Address4 = function (options) {
		        this.init('address4', options, Address4.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Address4, $.fn.editabletypes.abstractinput);

		    $.extend(Address4.prototype, {
		     
		        render: function() {
		           	this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		            this.$select.select2({
		            	allowClear:true,
		            	placeholder:cust_det_trans_dt.Select
		            });
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		            var html = '';
		           
		            if(checkNull(value.CustDlvryAddress1)!=''){
		            	html +='<p>' + $('<div>').text(value.CustDlvryAddress1).html()+ '</p>';
		            }
		            
		            if(checkNull(value.CustDlvryAddress2)!=''){
		            	html +='<p>' + $('<div>').text(value.CustDlvryAddress2).html()+ '</p>';
		            }

		            if(checkNull(value.CustDlvryZip)!='' || checkNull(value.CustDlvryCity)!=''){
		            	var CustDlvryZip = checkNull(value.CustDlvryZip);
		            	var CustDlvryCity =  checkNull(value.CustDlvryCity);

		            	html += '<p>';
		            	html += CustDlvryZip;
		            	if(CustDlvryZip!=''){
		            		html += '&nbsp;';
		            	}
		            	html += CustDlvryCity;
		            	
		            	html += '</p>';
		            }



		            if(checkNull(value.CustDlvryCountry)!='' && html!=''){
		            	if(cust_det_dt.getPartnerCustomSettings.show_customer_country == 'y' || (cust_det_dt.partner_country!=value.CustDlvryCountry)){
		            		html += '<p>'+$('<div>').text(checkNull(cust_det_dt.getAllCountryList[value.CustDlvryCountry])).html() + '</p>';
		            	}
		            }
		            if(html==''){
			           	html += '<p>' + $('<div>').text(cust_det_trans_dt.Clicktosetadeliveryaddress).html() + '</p>';
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
					this.$input.filter('[name="CustDlvryAddress1"]').val(checkNull(value.CustDlvryAddress1));
					this.$input.filter('[name="CustDlvryAddress2"]').val(checkNull(value.CustDlvryAddress2));
					this.$input.filter('[name="CustDlvryZip"]').val(checkNull(value.CustDlvryZip));
					this.$input.filter('[name="CustDlvryCity"]').val(checkNull(value.CustDlvryCity));
					this.$select.filter('[name="CustDlvryCountry"]').val(checkNull(value.CustDlvryCountry)).trigger('change');
		 
		       },           
		       input2value: function() { 
		           return {
		              CustDlvryAddress1: this.$input.filter('[name="CustDlvryAddress1"]').val(), 
		              CustDlvryAddress2: this.$input.filter('[name="CustDlvryAddress2"]').val(), 
		              CustDlvryZip: this.$input.filter('[name="CustDlvryZip"]').val(), 
		              CustDlvryCity: this.$input.filter('[name="CustDlvryCity"]').val(), 
		              CustDlvryCountry: this.$select.filter('[name="CustDlvryCountry"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$input.filter('[name="CustDlvryAddress1"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Address4.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><input type="text" id="CustDlvryAddress1" name="CustDlvryAddress1" class="" placeholder="'+cust_det_trans_dt.Deliveryaddress1+'"></label></div>'+
		       	 '<div class="editable-address"><label><input type="text" id="CustDlvryAddress2" name="CustDlvryAddress2" class="" placeholder="'+cust_det_trans_dt.Deliveryaddress2+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CustDlvryZip" name="CustDlvryZip" class="" placeholder="'+cust_det_trans_dt.Deliveryzip+'"></label></div>'+
		       	  '<div class="editable-address"><label><input type="text" id="CustDlvryCity" name="CustDlvryCity" class="" placeholder="'+cust_det_trans_dt.Deliverycity+'"></label></div>'+
		             '<div class="editable-address"><label><select id="CustDlvryCountry" name="CustDlvryCountry" class="">'+ssopts+'</select></label></div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.address4 = Address4;
		}(window.jQuery));

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Cellcode = function (options) {
		        this.init('cellcode', options, Cellcode.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Cellcode, $.fn.editabletypes.abstractinput);

		    $.extend(Cellcode.prototype, {
		     
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

		            if(checkNull(value.custCellcode)!=''){
		            	if(cust_det_dt.partner_country != cellphone_country_code){
		            		html += $('<div>').text('( '+value.custCellcode+' )').html()+ ' ';
		            	}
		            }
		            
		            if(checkNull(value.custCellphone)!=''){
		            	var v = $(element).attr('data-val');
		            	v = checkNull(v);
		            	if(v==''){
		            		v = value.custCellphone;
		            	}
		            	html += $('<div>').text(v).html()+ '';
		            }
		            if(html==''){
		            	html += $('<div>').text(cust_det_trans_dt.Empty).html();
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
					this.$select.filter('[name="custCellcode"]').val((checkNull(value.custCellcode) != '')?value.custCellcode:default_cell_code).trigger('change');
		 
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

		    Cellcode.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><select id="custCellcode" name="custCellcode" class="">'+country_list_opts+'</select></label></div><div class="editable-address"><label><input type="text" id="custCellphone" name="custCellphone" class="" placeholder="'+cust_det_trans_dt.Phone+'"></label></div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.cellcode = Cellcode;
		}(window.jQuery));

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Phonecode = function (options) {
		        this.init('phonecode', options, Phonecode.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Phonecode, $.fn.editabletypes.abstractinput);

		    $.extend(Phonecode.prototype, {
		     
		        render: function() {
		           	this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		             this.$select.select2({
		             	allowClear:true,
		            	placeholder:cust_det_trans_dt.Select
		             });
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		            var html = '';
		           	
		           		var phone_country_code = $(element).attr('data-country-code');

		            if(checkNull(value.custPhonecode)!=''){

		            	if(cust_det_dt.partner_country != phone_country_code){
		            		html += $('<div>').text('( '+value.custPhonecode+' )').html()+ ' ';
		            	}
		            }
		            
		            if(checkNull(value.custPhone)!=''){
		            	
		            	var v = $(element).attr('data-val');
		            	v = checkNull(v);
		            	if(v==''){
		            		v = value.custPhone;
		            	}
		            	html += $('<div>').text(v).html()+ '';
		            }
		            if(html==''){
		            	html += $('<div>').text(cust_det_trans_dt.Empty).html();
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
					this.$select.filter('[name="custPhonecode"]').val((checkNull(value.custPhonecode) != '')?value.custPhonecode:default_cell_code).trigger('change');

		 
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

		    Phonecode.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: '<div class="editable-address"><label><select id="custPhonecode" name="custPhonecode" class="">'+country_list_opts+'</select></label></div><div class="editable-address"><label><input type="text" id="custPhone" name="custPhone" class="" placeholder="'+cust_det_trans_dt.Cellphone+'"></label></div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.phonecode = Phonecode;
		}(window.jQuery));

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Group = function (options) {
		        this.init('group', options, Group.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Group, $.fn.editabletypes.abstractinput);

		    $.extend(Group.prototype, {
		     
		        render: function() {
		           	this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		             this.$select.select2({
		             	allowClear:true,
		            	placeholder:cust_det_trans_dt.Select
		             });
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		            var html = '';
		            console.log('value',value);
		            if(checkNull(value.custGroup)!=''){
		            	var custGroupText = '';
		            	for(var j in partner_customer_groups){
		            		var pcg = partner_customer_groups[j];
		            		if(pcg.value==value.custGroup){
		            			custGroupText = pcg.text;
		            		}
		            	}
		            	//var httml = '<p class="hh"><i class="icon-user tooltips hh_i" data-original-title="'+cust_det_trans_dt.Customergroup+'" data-placement="bottom"></i>&nbsp;<span style="color:#6b6b6b">'+cust_det_trans_dt.Customergroup+':</span>';
		            	if(cust_det_dt.PartnerCustomerGroup.length != 0){
		            		var httml = '<p class="hh"><span style="color:#6b6b6b">'+cust_det_trans_dt.Customergroup+': </span>';
		            		httml += custGroupText+'</p>';
		            	}
		            	else{
		            		var httml = '';
		            	}

		            	html += $('<div>').html(httml).html();
		            }
		            else{
		            	//var httml = '<p class="hh"><i class="icon-user tooltips hh_i" data-original-title="'+cust_det_trans_dt.Customergroup+'" data-placement="bottom"></i>&nbsp;<span style="color:#6b6b6b">'+cust_det_trans_dt.Customergroup+':</span>';
		            	if(cust_det_dt.PartnerCustomerGroup.length != 0){
			            	var httml = '<p class="hh"><span style="color:#6b6b6b">'+cust_det_trans_dt.Customergroup+': </span>';
			            	httml += cust_det_trans_dt.None+'</p>';
		            	}
		            	else{
		            		var httml = '';
		            	}
		            	html += $('<div>').html(httml).html();

		            }
		            
		            if(checkNull(value.custPriceGroup)!=''){
		            	var custPriceGroupText = '';

		            	for(var j in partner_price_groups){
		            		var ppg = partner_price_groups[j];
		            		if(ppg.value==value.custPriceGroup){
		            			custPriceGroupText = ppg.text;
		            		}
		            	}


		            	if(custPriceGroupText==''){
		            		custPriceGroupText = cust_det_trans_dt.Standard;
		            	}
		            	//var httml = '<p class="hh"><i class="icon-sitemap tooltips hh_i" data-original-title="'+cust_det_trans_dt.Pricegroup+'" data-placement="bottom"></i>&nbsp;<span style="color:#6b6b6b">'+cust_det_trans_dt.Pricegroup+':</span>';
		            	var httml = '<p class="hh"><span style="color:#6b6b6b">'+cust_det_trans_dt.Pricegroup+': </span>';
		            	httml += custPriceGroupText+'</p>';

		            	html += $('<div>').html(httml).html()+ '';
		            }
		            else{
		            	var httml = '<p class="hh"><span style="color:#6b6b6b">'+cust_det_trans_dt.Pricegroup+': </span>';
		            	httml += cust_det_trans_dt.Empty+'</p>';

		            	html += $('<div>').html(httml).html()+ '';
		            }


		            if(html==''){
		            	html += $('<div>').text(cust_det_trans_dt.Empty).html();
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
					this.$select.filter('[name="custGroup"]').val(checkNull(value.custGroup)).trigger('change');
					this.$select.filter('[name="custPriceGroup"]').val(checkNull(value.custPriceGroup)).trigger('change');
		 
		       },           
		       input2value: function() { 
		           return {
		              custGroup: this.$select.filter('[name="custGroup"]').val(), 
		              custPriceGroup: this.$select.filter('[name="custPriceGroup"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$select.filter('[name="custGroup"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });
				
			
			if(cust_det_dt.PartnerCustomerGroup.length != 0){
				var tpl = '<div class="editable-address"><p style="margin:0">'+cust_det_trans_dt.Customergroup+'</p><label><select id="custGroup" name="custGroup" class="">'+partner_customer_groups_opts+'</select></label></div><div class="editable-address"><p style="margin:0">'+cust_det_trans_dt.Pricegroup+'</p><label><select id="custPriceGroup" name="custPriceGroup" class="">'+partner_price_groups_opts+'</select></label></div>';
			}
			else{
				var tpl = '<div class="editable-address"><p style="margin:0;display:none">'+cust_det_trans_dt.Customergroup+'</p><label style=";display:none"><select id="custGroup" name="custGroup" class="">'+partner_customer_groups_opts+'</select></label></div><div class="editable-address"><p style="margin:0">'+cust_det_trans_dt.Pricegroup+'</p><label><select id="custPriceGroup" name="custPriceGroup" class="">'+partner_price_groups_opts+'</select></label></div>';	
			}
			

		    Group.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: tpl,
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.group = Group;
		}(window.jQuery));

		customer_details.bindEvents();
	},
	bindEvents:function(){
		if(checkNull(cust_det_dt.customerData.status) == 0){
			$('.badge-inactive').show();
			$('.if_cust_active').hide();
			$('.if_cust_active').hide();
		}
		else{
			$('.if_cust_inactive').hide();
			$('.if_cust_active').show();
		}
		customer_details.generateCustomFields();
		$('#cust_postal_address').editable({
	        url: 'asas',
	        showbuttons:'bottom',
	        title: 'Postal Address',
	       	emptytext:cust_det_dt.Adddeliveryaddress,
	        value: {
	            CustAddress1: checkNull(cust_det_dt.customerData.customer_address1),
	            CustAddress2: checkNull(cust_det_dt.customerData.customer_address2),
	            CustZip:checkNull(cust_det_dt.customerData.customer_zip),
	            CustCity:checkNull(cust_det_dt.customerData.customer_city),
	           	CustCountry:checkNull(cust_det_dt.customerData.customer_country),
	        },
	        validate:function(){
	        	if(checkNull(gbl_pst_addr_err)!=''){
        			return gbl_pst_addr_err;
        		}
	        },
	        success: function(data, config) {
	        	customer_details.saveAddressData(config,'');
	        	$('#cust_postal_address').addClass('editable_touched');
	        }
	    });

	    $('#cust_delivery_address').editable({
	        url: '',
	        showbuttons:'bottom',
	        title: 'Delivery Address',
	        value: {
	            CustDlvryAddress1: checkNull(cust_det_dt.customerData.delivery_address1),
	            CustDlvryAddress2:checkNull(cust_det_dt.customerData.delivery_address2),
	            CustDlvryZip:checkNull(cust_det_dt.customerData.delivery_zip),
	            CustDlvryCity:checkNull(cust_det_dt.customerData.delivery_city),
	           	CustDlvryCountry:checkNull(cust_det_dt.customerData.delivery_country),
	        },
	        success: function(data, config) {
	        	customer_details.saveAddressData('',config);
	        	$('#cust_delivery_address').addClass('editable_touched');
	        }
	    });

		$('#cust_cellcodephone').editable({
	        url: 'asas',
	        showbuttons:'bottom',
	        title: 'Postal Address',
	       	emptytext:cust_det_dt.Phone,
	        value: {
	            custCellcode: checkNull(cust_det_dt.customerData.cp_code),
	            custCellphone: checkNull(cust_det_dt.customerData.customer_cellphone),
	        },
	        success: function(data, config) {
	        	customer_details.saveSingleField(config,'cellphone');
	        	$('#cust_phcodephone').addClass('editable_touched');
	        },
	        validate:function(){
        		if(checkNull(gbl_cellphn_err)!=''){
        			return gbl_cellphn_err;
        		}
	        }
	    });

	    $('#cust_phcodephone').editable({
	        url: 'asas',
	        showbuttons:'bottom',
	        title: 'Postal Address',
	       	emptytext:cust_det_dt.Cellphone,
	        value: {
	            custPhonecode: checkNull(cust_det_dt.customerData.ph_code),
	            custPhone: checkNull(cust_det_dt.customerData.customer_phone),
	        },
	        success: function(data, config) {
	        	customer_details.saveSingleField(config,'phone');
	        	$('#cust_phcodephone').addClass('editable_touched');
	        },
	        validate:function(){
        		if(checkNull(gbl_phn_err)!=''){
        			return gbl_phn_err;
        		}
	        }
	    });

	    $("#cust_email_edit").editable({
	       	value: checkNull(cust_det_dt.customerData.customer_email),  
	       	mode:'inline',  
	       	type: 'text',
	       	showbuttons:'bottom',
	       	emptytext:cust_det_dt.$email,
	       	validate:function(value){
	       		if(cust_det_dt.getPartnerCustomSettings.customer_email_required == 'y' && value==''){
	       			return cust_det_trans_dt.Entervalidemailaddress;  
	       		}
	       		if(cust_det_dt.getPartnerCustomSettings.customer_email_required != 'y' && value==''){
	       			return '';
	       		}
	       		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
				if (!regexEmail.test(value)) {
					return cust_det_trans_dt.Entervalidemailaddress;  
				}
	       	},
	        success: function(data, config){
	        	customer_details.saveSingleField(config,'customer_email');
	        	$("#cust_email_edit").addClass('editable_touched');
	   		}
		});
	
	    var v = '';
	    if(checkNull(cust_det_dt.customerData.price_group_id) != ''){
	    	v = cust_det_dt.customerData.price_group_id;
	    }
	    else{
	    	v = sel_val;
	    }
	    var cgi = checkNull(cust_det_dt.customerData.customer_group_id);
	  
	    if(cgi!= '' && cgi!=0){
	    	var vg = cust_det_dt.customerData.customer_group_id;
	    }
	    else{
	    	var vg = 'none';
	    }
	

		$('#customer_and_price_groups_card').editable({
	        url: '',
	        showbuttons:'bottom',
	        title: 'Delivery Address',
	        value: {
	            custGroup: vg,
	            custPriceGroup:v,
	        },
	        success: function(data, config) {
 				customer_details.saveSingleField(config,'groups');
	        	$('#customer_and_price_groups_card').addClass('editable_touched');
	        }
	    }).click(function(){
	    	$('#custGroup').change(function(){
	    		
	    		var v = $('#custGroup').val();
		    	if(v=='none'){
		    		$('#custPriceGroup').select2('enable');
		    	}
		    	else{
		    		$('#custPriceGroup').select2('enable',false);
		    	}

		   	 for(var j in cust_det_dt.PartnerCustomerGroup){
				var pcg = cust_det_dt.PartnerCustomerGroup[j].PartnerCustomerGroup;
		    	
		    		if(pcg.id==v){
		    			$('#custPriceGroup').select2('enable');
		    			$('#custPriceGroup').val(pcg.price_group_id).trigger('change');
		    			$('#custPriceGroup').select2('enable',false);
		    			
		    		}
		    	}
	    	}).trigger('change');
	    });

	    if(cust_det_dt.customerData.user_group_id == 2){
			$("#cust_ein").editable({
		       	value: checkNull(cust_det_dt.customerData.customer_ein),  
		       	mode:'inline',  
		       	type: 'text',
		
		       	emptytext:'',
		       	placeholder:cust_det_trans_dt.EIN,
		       	validate:function(value){
		       		if(checkNull(gbl_ein_err) != ''){
		       			return gbl_ein_err;
		       		}
		       		return '';
		       		// if(checkNull(value)!=''){
		       		// 	if(value.length != 9){
		       		// 		return cust_det_trans_dt.EntervalidEIN;  
		       		// 	}
		       		// }
		       		// else if(cust_det_dt.userGroup.ein_required){
		       		// 	if(value.length != 9){
		       		// 		return cust_det_trans_dt.EntervalidEIN;  
		       		// 	}
		       		// }
		       	},
		        success: function(data, config) {
		        	customer_details.saveSingleField(config,'customer_ein');
		        	$("#cust_ein").addClass('editable_touched');
		   		},
			});
			$('.eeinn').css('cursor','pointer');
			$('.eeinn').click(function(e){
				e.stopPropagation();
				$('#cust_ein').trigger('click');
			});
			if(checkNull(cust_det_dt.customerData.customer_ein)==''){
				$('.c_name').addClass('align_div');
				$('.ein_birth').addClass('hide');
			}
			else{
				$('.ein_birth').removeClass('hide');
				$('.c_name').removeClass('align_div');
			}		
		}
		else{
			var dob = '';
			if(checkNull(cust_det_dt.customerData.customer_dob)!=''){
				dob = convertDateIntoSiteFormat(cust_det_dt.customerData.customer_dob);
			}

			$("#cust_date_of_birth").editable({
				value:dob,
				type:'text',
		       	mode:'inline',  

		       	emptytext:'',
		       	validate:function(value){

		       		var res = convertIntoSystemDate(value);
		       		if(!res){
		       			return cust_det_trans_dt.Entervalidbirthdate;
		       		}
		       	},
		        success: function(data, config) {
		        	var res = convertIntoSystemDate(config);
		        	customer_details.saveSingleField(res,'customer_dob');
		        	$("#cust_date_of_birth").addClass('editable_touched');
		   		},
			});	    
			$('.dob').css('cursor','pointer');
			$('.dob').click(function(e){
				e.stopPropagation();
				$('#cust_date_of_birth').trigger('click');
			});
			if(dob==''){
				$('.c_name').addClass('align_div');
				$('.ein_birth').addClass('hide');
				// $('.dob_empty').show();
				// $('.dob_notempty').hide();
			}
			else{
				$('.ein_birth').removeClass('hide');
				$('.c_name').removeClass('align_div');
				// $('.dob_empty').hide();
				// $('.dob_notempty').show();
			}
		}

		if(checkNull(cust_det_dt.customerData.customer_email)==''){
			$('.customer_send_email').hide();
			$('.customer_save_email').show();
		}
		else{
			$('.customer_send_email').show();
			$('.customer_save_email').hide();
		}

		if(checkNull(cust_det_dt.customerData.customer_cellphone)==''){
			$('.customer_send_sms').hide();
		}
		else{
			$('.customer_send_sms').show();
		}

		var default_distribution = cust_det_dt.default_distribution;

		if(checkNull(cust_det_dt.customerData.default_distribution)!=''){
			default_distribution = cust_det_dt.customerData.default_distribution;
		}

		var doc_methods = JSON.parse(cust_det_dt.documentMethod);
		var opts = [];


		var print_data = cust_det_dt.print_data;
		for(var j in doc_methods){
			var d = doc_methods[j];

			for(var k in print_data){
				var pd = print_data[k]['PrintQueueDistribution'];
				var pdm = print_data[k]['PartnerDocumentMethod'];

				var customer_types = [];
				if(checkNull(pd.customer_types) != ''){
					customer_types = pd['customer_types'].split(',');
				}
				//&& $.inArray( gbl_data.customerData.Customer.user_group_id, customer_types ) 
				if(pd.document_method_id == d.value && pdm.status == 1 && $.inArray(  cust_det_dt.customerData.user_group_id, customer_types ) !== -1){
					opts.push(d);
					print_data.slice(k,1);
					break;
				}
			}
		}
		if(checkNull(opts)==''){
			opts = [];
		}




		$("#default_distribution_card").editable({
	       	value: default_distribution,  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:'bottom',
	        source:opts,
	        select2: {
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	var params = {
	        		'from':'default_distribution',
	    			'default_distribution':config
	    		};
	        	customer_details.saveSalesProperties(params);
	   		},
		});

		var ele = document.createElement('div');
		$(ele).html(cust_det_trans_dt.Sendreminders);
		var a = $(ele).html();
		$(ele).html(cust_det_trans_dt.Donotsendreminders);
		var b = $(ele).html();

		var optss = [
			{value:0,text:a},
			{value:1,text:b},
		];

		
		$("#do_not_send_reminders_card").editable({
	       	value: '0',  
	       	mode:'inline',  
	       	showbuttons:'bottom',
	       	type: 'select2',
	        source:optss,
	        select2: {
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	var params = {
	        		'from':'do_not_send_reminders',
	    			'do_not_send_reminders':config
	    		};
	        	customer_details.saveSalesProperties(params);
	   		},
		});

		$('#do_not_send_reminders_card').editable('setValue',checkNull(cust_det_dt.customerData.do_not_send_reminders,0))


		customer_details.makePaymentEditable();

		var ps = cust_det_dt.getPartnerCustomSettings.customer_card_settings;
	
		if(checkNull(ps)!=''){
			ps =ps.split(',');
			for(var j in ps){
				$('li[data-name="'+ps[j]+'"]').removeClass('hide');
				
			}
		}

		var opts = [
			{text:cust_det_trans_dt.$no_news,value:0},
			{text:cust_det_trans_dt.$via_email,value:1},
			{text:cust_det_trans_dt.$via_sms,value:2},
			{text:cust_det_trans_dt.$via_sms_and_email,value:3}
		];

		var receive_mass_sms = cust_det_dt.customerData.receive_mass_sms;
		var receive_mass_emails = cust_det_dt.customerData.receive_mass_emails;
		var val = 0;
		if(receive_mass_sms==1 && receive_mass_emails==1){
			val = 3;
		}
		else if(receive_mass_sms==1){
			val = 2;
		}
		else if(receive_mass_emails==1){
			val = 1;
		}
		else{
			val = 0;
		}

		$("#newsletter_updates_card").editable({
	       	value: val,  
	       	mode:'inline',  
	       	type: 'select2',
	        source:opts,
	        showbuttons:'bottom',
	        select2: {
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	var params = {
	        		'from':'receive_mass_sms_emails',
	    			'receive_mass_sms_emails':config
	    		};
	        	customer_details.saveNewsLetter(params);
	   		},
		});

		var c_name = cust_det_dt.customerData.customer_name;
		c_name = checkNull(c_name);
		$('#customer_name').editable({
	       	value: c_name,  
	       	mode:'inline',  
	       	type: 'text',
	       	validate:function(value){
	       		if(!value){
	       			return cust_det_trans_dt.Entervalidcustomername;
	       		}
	       	},
	        success: function(data, config) {
	        	customer_details.saveSingleField(config,'customer_name');
	        	$("#cust_date_of_birth").addClass('editable_touched');
	   		},
		}).click(function(){
			$('.ein_birth').show();
			$('.c_name').removeClass('align_div');
			
		});

		$('.tooltips').tooltip();

		fancyAdjust1();

		$('.profile-info').on('keyup','input#CustZip',function(){
			customer_details.getCityFromZip($(this).val(),$('.profile-info #CustCountry').val(),'CustCity','postal');
		});

		$('.profile-info').on('keyup','input#CustDlvryZip',function(){
			customer_details.getCityFromZip($(this).val(),$('.profile-info #CustDlvryCountry').val(),'CustDlvryCity','delivery');
		});
	},
	makePaymentEditable:function(){
		var getCreditDayList = cust_det_dt.getCreditDayList;
		var opts = [];
		var sel_val = '';
		var sel = '';
		if(checkNull(cust_det_dt.getCreditDayList)!=''){
			for(var j in cust_det_dt.getCreditDayList){
				var d = cust_det_dt.getCreditDayList[j];
				opts.push({
					text:d,
					value:j
				});
				if(j==cust_det_dt.customerData.payment_terms){
					sel_val = j;
				}
			}
		}
		opts.push({'text':cust_det_trans_dt.Default,value:'default'});
		
		var custom_credit_days = 0;
		if(checkNull(sel_val)!=''){
			sel = sel_val;
		}
		else if(checkNull(cust_det_dt.customerData.payment_terms)==''){
			sel = 'default';
		}
		else if(checkNull(cust_det_dt.customerData.payment_terms)!=''){
			sel = 'custom';
			custom_credit_days =  cust_det_dt.customerData.payment_terms;
		}
		try{
			$("#credit_days_card").editable({
		       	value: sel,  
		       	mode:'inline',  
		       	type: 'select2',
		        source:opts,
		        emptytext:0,
		        select2: {
					minimumResultsForSearch: -1,
		    		placeholder: cust_det_trans_dt.Select,
					
					},
		        success: function(data, config) {
		        	if(config=='custom'){
		        		$('.custom_credit_days_wrapper_card').removeClass('hide');
		        	}
		        	else{
		        		$('.custom_credit_days_wrapper_card').addClass('hide');
		        		var params = {
		        			'from':'credit_days',
		        			'credit_days':config
		        		};
		        		customer_details.saveSalesProperties(params);
		        	}
		   		},
			});

			
			$("#custom_credit_days_card").editable({
		       	value: custom_credit_days,  
		       	mode:'inline',  
		       	type: 'text',
		       	emptytext:0,
		       	validate:function(value){
		       		if ($.isNumeric(value) == '') {
			        // alert('This Number is required');
			           return cust_det_trans_dt.Entervalidnumber;
		        	}
		       	},
		        success: function(data, config) {
		        	var params = {
		    			'from':'custom_credit_days',
		    			'credit_days':config
		    		};
		        	customer_details.saveSalesProperties(params);

		   		},
			});
		}
		catch(e){
			
		}

		if(checkNull(custom_credit_days)!=''){
			$('.custom_credit_days_wrapper_card').removeClass('hide');
		}
		else{
			$('.custom_credit_days_wrapper_card').addClass('hide');
		}

	},
	showTabs:function(from='',from_tab){
		var cdt = cust_det_dt.customerData;
		var status = 0;
		if(cdt.status){
			status = 1;
		}

		if(from=='contacts'){
			new_custom_tabs2('customer_contacts','customer_tab_content',{customer_id:cdt.id,customer_status:status});
			return;
		}
		
		else if(from=='communications'){
			new_custom_tabs2('comm_sent','customer_tab_content',{customer_id:cdt.id,customer_status:status});
			return;
		}
		else if(from=='quotes'){
			quote_current_page = 0;
			customer_details.getAndGenerateQuotes();
			return;
		}
		else if(from=='orders'){
			// var url = base_url + 'order/index/'+ cdt.id;
			// if(checkNull(from_tab)!=''){
			// 	url += '?from_tab='+from_tab; 
			// }
			order_current_page = 0;
			customer_details.getAndGenerateOrders();
			return;
		}
		else if(from=='invoices'){
			
			customer_details.getAndGenerateInvoices();
			return;
		}
		else if(from=='tasks'){
			new_custom_tabs2('customer_tasks','customer_tab_content',{customer_id:cdt.id});
			return;
		}
		else if(from=='notes'){
			var url = base_url + 'customers/customer_notes/'+cdt.id;
			if(checkNull(from_tab)!=''){
				url += '?from_tab='+from_tab;
			}
		}
		else if(from=='slips'){
			new_custom_tabs2('customer_slips','customer_tab_content',{customer_id:cdt.id,customer_status:status});
			return;
		}
		else if(from=='meters'){
			new_custom_tabs2('customer_meters','customer_tab_content',{customer_id:cdt.id,customer_status:status});
			return;
		}
		else if(from=='other_info'){
			new_custom_tabs2('customer_custom_fields','customer_tab_content',{customer_id:cdt.id});
			return;
		}
		else if(from=='recent_activity'){
			customer_details.getCustomerRecentActivities();
			return;
		}
		else if(from=='voluntary_work'){
			new_custom_tabs('customer_voluntary_bank','customer_tab_content',{customer_id:cdt.id});
			return;
		}
		else if(from=='new_sales'){
			// var url = base_url + 'sales/search_customers?request_from=customer_select&customerID='+cdt.id;
			// if(checkNull(partner_dir)!=''){
			// 	url += '&cp='+partner_dir;
			// }
			new_custom_main_page2('/'+type+'/sales/save','sales_sel','sales_sel','sales_save',{customer_id:cdt.id});
			return;
		}
		else if(from=='add_new_task'){
			var url = base_url + 'customers/details_new/'+cdt.id;
			if(checkNull(partner_dir)!=''){
				url += '?cp='+partner_dir+'&openTaskModel=customer_popup';
			}
			else{
				url += '?openTaskModel=customer_popup';
			}
	
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','700px');
			show_modal(a,'popups1');
			return;
			
		}
		else if(from=='edit_customer'){
			var url = base_url + 'customers/edit_customer_details/'+cdt.id;
			if(checkNull(partner_dir)!=''){
				url += '&cp='+partner_dir;
			}
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','700px');
			show_modal(a,'popups1');
			return;

		}
		else if(from=='transactions'){
			var url = base_url + 'customers/transactions/'+cdt.id+'/'+cdt.customer_name;
			if(checkNull(partner_dir)!=''){
				url += '&cp='+partner_dir;
			}
			

			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','900px');
			show_modal(a,'popups1');

			return;
		}
		else if(from=='add_new_customer'){
			new_custom_popup2('700','popups','add_new_customer');
			return;
		}
		else if(from=='add_contact'){
			var url = base_url + 'customers/add_contact/'+cdt.id;
			if(checkNull(partner_dir)!=''){
				url += '?cp='+partner_dir+'&customer_status='+status;
			}
			else{
				url += '?customer_status='+status;
			}
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','700px');
			show_modal(a,'popups1');
			
			return;
		}
		else if(from=='reactivate'){
			var url = base_url + 'customers/activate_user/'+cdt.id;
			if(checkNull(partner_dir)!=''){
				url += '?cp='+partner_dir;
			}
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','700px');
			show_modal(a,'popups1');
			return;
		}
		else if(from=='search'){
			new_custom_popup2('900','popups','customers_search');
			return;
		}
		
		passRequest(url,'','undefined');
	},
	send_email:function(){
		var cdt = cust_det_dt.customerData;
		show_dkmodal_for_customer_email(cdt.id,cdt.customer_name,cdt.customer_email,cdt.customer_number);
	},
	send_sms:function(){
		var cdt = cust_det_dt.customerData;

		//show_dkmodal_for_customer_sms(cdt.id,cdt.customer_name,cdt.customer_number,cdt.customer_country,cdt.cellphone_country_code,cdt.sms_cellphone,cdt.customer_number);

		var phccode = '';
		for(var j in cust_det_dt.getCountryWithPhoneCodeList){
			var d = cust_det_dt.getCountryWithPhoneCodeList[j];
			var splt = d.split('###');
	

			if(j==cdt.cellphone_country_code){
				phccode = splt[1]; 
			}
		}
		show_dkmodal_for_customer_sms(cdt.id,cdt.customer_name,cdt.sms_cellphone,cdt.customer_country,cdt.cellphone_country_code,cdt.sms_cellphone,cdt.customer_number);

	},
	save_send_email:function(){
		var msg = cust_det_trans_dt.$no_email;
		var yes = function(){
			var cdt = cust_det_dt.customerData;
			var url = base_url + 'customers/edit_customer_email/'+cdt.id;
			if(checkNull(partner_dir)!=''){
				url += '&cp='+partner_dir;
			}
			show_modal('','popups1','',url);
			return;
			

		};
		var no =function(){

		};

		showDeleteMessage(msg,cust_det_trans_dt.Confirmation,yes,no,'ui-dialog-purple',cust_det_trans_dt.Yes,cust_det_trans_dt.No);
		$('.ui-dialog-buttonset>.btn:first').removeClass('red').addClass('green')
	},
	back:function(){
		window.history.back();
		window.location.href = '';
	},
	activate:function(status){
		var APISERVER = $('#APISERVER').val();
		var token = $('#token').val();
		var language = $('#language').val();
		var lang = $('#lang').val();
		var partner_id =$('#partner_id').val();
		var admin_id = $('#admin_id').val();


		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cust_det_dt.customerData.id,
			from:'status',
			status:status,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/updateSalesProperties.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status=='success'){
				if(status == 1){
					$('.badge-inactive').hide();
					$('.if_cust_active').show();
					$('.if_cust_inactive').hide();
				}
				else if(status == 0){
					$('.badge-inactive').show();
					$('.if_cust_active').hide();
					$('.if_cust_inactive').show();
				}			
			
				if($('#tab_contact').hasClass('active')){
					customer_details.showTabs('contacts','tab_1_1')
				}
				
				call_toastr('success',cust_det_trans_dt.Success,cust_det_trans_dt.Customerdetailupdatedsuccessfully);
			}
			else{
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					
					showAlertMessage(array,'error',cust_det_trans_dt.Alertmessage);
					
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_trans_dt.Alertmessage);
					return;
				}	
			}
		}

		showProcessingImage('undefined');
		doAjax(params);
	},
	saveSingleField:function(data,from){
		var APISERVER = $('#APISERVER').val();
		var token = $('#token').val();
		var language = $('#language').val();
		var lang = $('#lang').val();
		var partner_id =$('#partner_id').val();
		var admin_id = $('#admin_id').val();


		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cust_det_dt.customerData.id,
			from:from,
		};

		total_params[from] = data;
		if(from=='cellphone'){
			for(var j in cust_det_dt.getCountryWithPhoneCodeList){
				var d = cust_det_dt.getCountryWithPhoneCodeList[j];
				var splt = d.split('###');
				if(splt[1]==data.custCellcode){
					data.custCountry = j;
					break;
				}
			}
		}
		else if(from=='phone'){
			for(var j in cust_det_dt.getCountryWithPhoneCodeList){
				var d = cust_det_dt.getCountryWithPhoneCodeList[j];
				var splt = d.split('###');
				if(splt[1]==data.custPhonecode){
					data.phoneCountry = j;
				}
			}
		}
		else if(from=='groups'){
			if(cust_det_dt.customerData.customer_group_id == 'none'){
				total_params.groups.old_customer_group_id =  '';
			}
			else{
				total_params.groups.old_customer_group_id = cust_det_dt.customerData.customer_group_id ;
			}			
			
		}


	
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/updateSalesProperties.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status=='success'){

				var d = complet_data.response.response;
				if(from=='cellphone'){
					cust_det_dt.customerData.cellphone_country_code = d.saveSalesProperties.Customer.cellphone_country_code	;
					cust_det_dt.customerData.customer_cellphone = d.saveSalesProperties.Customer.cellphone;
					cust_det_dt.customerData.cp_code = d.saveSalesProperties.Customer.cell_code;
					if(d.saveSalesProperties.Customer.cellphone!=''){
						$('.customer_send_sms').show();
					}
					else{
						$('.customer_send_sms').hide();
					}
					
					$('#cust_cellcodephone').editable('destroy').html('');
					$('#cust_cellcodephone').attr('data-country-code',data.custCountry);
					if(checkNull(d.saveSalesProperties.format_cellphone)!=''){
						$('#cust_cellcodephone').attr('data-val',d.saveSalesProperties.format_cellphone);
					}
					else{
						$('#cust_cellcodephone').attr('data-val',data.custCellphone);
					}
					

					$('#cust_cellcodephone').editable({
				        url: 'asas',
				        showbuttons:'bottom',
				        title: 'Postal Address',
				       	emptytext:cust_det_dt.Cellphone,
				        value: {
				            custCellcode: checkNull(data.custCellcode),
				            custCellphone: checkNull(data.custCellphone),
				        },
				        success: function(data, config) {
				        	customer_details.saveSingleField(config,'cellphone');
				        	$('#cust_phcodephone').addClass('editable_touched');
				        },
				        validate:function(){
			        		if(checkNull(gbl_cellphn_err)!=''){
			        			return gbl_cellphn_err;
			        		}
				        }
				    });
					
				}
				else if(from=='phone'){
					cust_det_dt.customerData.phone_country_code = data.phoneCountry;
					
					cust_det_dt.customerData.phone_country_code = d.saveSalesProperties.Customer.phone_country_code	;
					cust_det_dt.customerData.customer_phone = d.saveSalesProperties.Customer.phone;
					cust_det_dt.customerData.ph_code = d.saveSalesProperties.Customer.phone_code;

					$('#cust_phcodephone').editable('destroy').html('');
					$('#cust_phcodephone').attr('data-country-code',data.phoneCountry);
					if(checkNull(d.saveSalesProperties.format_phone)!=''){
						$('#cust_phcodephone').attr('data-val',d.saveSalesProperties.format_phone);
					}
					else{
						$('#cust_phcodephone').attr('data-val',data.custPhone);
					}
					
				
					$('#cust_phcodephone').editable({
				        url: 'asas',
				        showbuttons:'bottom',
				        title: 'Postal Address',
				       	emptytext:cust_det_dt.Phone,
				        value: {
				            custPhonecode:  checkNull(data.custPhonecode),
				            custPhone:  checkNull(data.custPhone),
				        },
				        success: function(data, config) {
				        	customer_details.saveSingleField(config,'phone');
				        	$('#cust_phcodephone').addClass('editable_touched');
				        },
				        validate:function(){
			        		if(checkNull(gbl_phn_err)!=''){
			        			return gbl_phn_err;
			        		}
				        }
				    });

				}
				else if(from=='customer_ein'){

					cust_det_dt.customerData.customer_ein = total_params.customer_ein;
					if(checkNull(cust_det_dt.customerData.customer_ein)==''){
						$('.eeinn_empty').show();
						$('.eeinn_notempty').hide();
					}
					else{
						$('.eeinn_empty').hide();
						$('.eeinn_notempty').show();
					}
				}
				else if(from=='customer_dob'){

					cust_det_dt.customerData.customer_dob = total_params.customer_dob;
					var dob = '';
					if(checkNull(cust_det_dt.customerData.customer_dob)!=''){
						dob = convertDateIntoSiteFormat(cust_det_dt.customerData.customer_dob);
					}
					if(dob==''){
						$('.dob_empty').show();
						$('.dob_notempty').hide();
					}
					else{
						$('.dob_empty').hide();
						$('.dob_notempty').show();
					}
				}
				else if(from=='groups'){
					$('a#customer_and_price_groups,a#customer_and_price_groups_card').editable('setValue',{custGroup: total_params.groups.custGroup, custPriceGroup:total_params.groups.custPriceGroup});

					if("status" in complet_data.response.response.saveSalesProperties.Customer ){
						if(complet_data.response.response.saveSalesProperties.Customer.status == 1){
							$('.badge-inactive').hide();
							$('.if_cust_active').show();
							$('.if_cust_inactive').hide();
						}
						else if(complet_data.response.response.saveSalesProperties.Customer.status == 0){
							$('.badge-inactive').show();
							$('.if_cust_active').hide();
							$('.if_cust_inactive').show();
						}
					}
					if($('#tab_contact').hasClass('active')){
						customer_details.showTabs('contacts','tab_1_1')
					}
				}
				else if(from=='customer_email'){
					cust_det_dt.customerData.hashemail = d.saveSalesProperties.hash_email;
					customer_details.getGravatar('update');
				}
				else if(from=='customer_name'){
					cust_det_dt.customerData.customer_name = d.saveSalesProperties.Customer.customer_name;
					cust_det_dt.customerData.initials = d.saveSalesProperties.initials;
					customer_details.getGravatar('update');
				}

				
				
				call_toastr('success',cust_det_trans_dt.Success,cust_det_trans_dt.Customerdetailupdatedsuccessfully);
			}
			else{
				
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					if(from=='customer_ein'){
						var array = $.map(mt_arr, function(value, index) {
							return value+' ';
						});
						gbl_ein_err  = array[0];
						$('#cust_ein').click();
						$('#cust_ein').next().find('.editable-submit').click();
						gbl_ein_err = '';
					}
					else if(from=='cellphone'){
						var array = $.map(mt_arr, function(value, index) {
							return value+' ';
						});
						gbl_cellphn_err  = array[0];
						$('#cust_cellcodephone').click();
						$('#cust_cellcodephone').next().find('.editable-submit').click();
						gbl_cellphn_err = '';
					}
					else if(from=='phone'){
						var array = $.map(mt_arr, function(value, index) {
							return value+' ';
						});
						gbl_phn_err  = array[0];
						$('#cust_phcodephone').click();
						$('#cust_phcodephone').next().find('.editable-submit').click();
						gbl_phn_err = '';
						return;
					}
					else{
						showAlertMessage(array,'error',cust_det_trans_dt.Alertmessage);
					}
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_trans_dt.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		//return;
	},
	saveAddressData:function(postal_address='',delivery_address=''){
		var postal_address_val = $('#cust_postal_address').editable('getValue');
		
		if(postal_address==''){
			var postal_address = postal_address_val.cust_postal_address;
		}

		var delivery_address_val = $('#cust_delivery_address').editable('getValue');
		if(delivery_address==''){
			var delivery_address = delivery_address_val.cust_delivery_address;
		}

	
		var CustomerAddress1 = postal_address.CustAddress1;
		var CustomerAddress2 = postal_address.CustAddress2;
		var CustomerZip = postal_address.CustZip;
		var CustomerCity = postal_address.CustCity;
		var CustomerCountry = postal_address.CustCountry;

		var DeliveryAddress1 = delivery_address.CustDlvryAddress1;
		var DeliveryAddress2 = delivery_address.CustDlvryAddress2;
		var DeliveryZip = delivery_address.CustDlvryZip;
		var DeliveryCity = delivery_address.CustDlvryCity;
		var DeliveryCountry = delivery_address.CustDlvryCountry;

		
		// var status = $('#Dsame_postal_address').bootstrapSwitch('status');
		// if(status){
		// 	var same_postal_address = 'y';
		// }
		// else{
		// 	var same_postal_address = 'n';
		// }
		// if(same_postal_address=='y'){
		// 	var DeliveryAddress1 = CustomerAddress1;
		// 	var DeliveryAddress2 = CustomerAddress2;
		// 	var DeliveryZip = CustomerZip;
		// 	var DeliveryCity = CustomerCity;
		// 	var DeliveryCountry = CustomerCountry;
		// }

		var APISERVER = $('#APISERVER').val();
		var token = $('#token').val();
		var language = $('#language').val();
		var lang = $('#lang').val();
		var partner_id =$('#partner_id').val();
		var admin_id = $('#admin_id').val();


		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			CustomerAddress1:CustomerAddress1,
			CustomerAddress2:CustomerAddress2,
			CustomerZip:CustomerZip,
			CustomerCity:CustomerCity,
			CustomerCountry:CustomerCountry,
			DeliveryAddress1:DeliveryAddress1,
			DeliveryAddress2:DeliveryAddress2,
			DeliveryZip:DeliveryZip,
			DeliveryCity:DeliveryCity,
			DeliveryCountry:DeliveryCountry,
			customer_id:cust_det_cstm_dt.customer_id,
			from:'details'
		};
	
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/saveCustomerAddress.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status=='success'){
				call_toastr('success',cust_det_trans_dt.Success,cust_det_trans_dt.Addressupdatedsuccessfully);
			}
			else{
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});

					var array = $.map(mt_arr, function(value, index) {
						return value+' ';
					});
					gbl_pst_addr_err  = array[0];
					$('#cust_postal_address').click();
					$('#cust_postal_address').next().find('.editable-submit').click();
					gbl_pst_addr_err = '';
					return;

					showAlertMessage(array,'error',cust_det_trans_dt.Alertmessage);
					return;
				}else{
					gbl_pst_addr_err  = array[0];
					$('#cust_postal_address').click();
					$('#cust_postal_address').next().find('.editable-submit').click();
					gbl_pst_addr_err = '';
					return;
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_trans_dt.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	saveSalesProperties:function(data){
		var datas = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cust_det_cstm_dt.customer_id,
		};
		var total_params = Object.assign(datas, data);

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/updateSalesProperties.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				call_toastr('success', cust_det_trans_dt.Success, cust_det_trans_dt.Salespropertiesupdatedsuccessfully);
				$('#'+data.from).editable('setValue',data[data.from]);
				
				if ("gbl_data" in window) {
					if(data.from=='custom_credit_days' || data.from=='credit_days'){
						gbl_data.customerData.Customer.payment_terms = data.credit_days;
						cust_det_dt.customerData.payment_terms = data.credit_days;
						
						try {
							if($('#credit_days').find('input').length < 1){
								$('#credit_days').click().editable('destroy');
							}
							else{
								$('#credit_days').editable('destroy');
							}

							if($('#custom_credit_days').find('input').length < 1){
								$('#custom_credit_days').click().editable('destroy');
							}
							else{
								$('#custom_credit_days').editable('destroy');
							}
						}
						catch(err) {
						    
						}
						customer_custom_fields.makePaymentEditable();
					}
					else if(data.from=='do_not_send_reminders'){
						gbl_data.customerData.Customer.do_not_send_reminders = data[data.from];
						cust_det_dt.customerData.do_not_send_reminders = data[data.from];
					}
					else if(data.from == 'default_distribution'){
						var optss = JSON.parse(cust_det_dt.documentMethod);
						var found = 0;						
						for(var j in optss){
							if(optss[j]['value'] == data[data.from]){
								if(optss[j]['type'] == 'new'){
									$('.alter_dist').show();
								}
								found = 1;
								break;
							}
						}
						if(found == 0){
							$('.alter_dist').hide();
						}
					}
				}
				else{
					if(data.from=='custom_credit_days' || data.from=='credit_days'){
						cust_det_dt.customerData.payment_terms = data[data.from];
					}
					else if(data.from=='do_not_send_reminders'){
						cust_det_dt.customerData.do_not_send_reminders = data[data.from];
					}
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cust_det_trans_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_trans_dt.alertmessage);
					return;
				}	
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
	},
	saveNewsLetter:function(data){
		var datas = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cust_det_cstm_dt.customer_id,
		};

		var save_params = {};
		if(data.from=='receive_mass_sms_emails'){
			save_params = {
				from:'receive_mass_sms_emails',
				receive_mass_sms:0,
				receive_mass_emails:0
			};
			if(data.receive_mass_sms_emails==1){
				save_params.receive_mass_sms = 0;
				save_params.receive_mass_emails = 1;
			}
			else if(data.receive_mass_sms_emails==2){
				save_params.receive_mass_sms = 1;
				save_params.receive_mass_emails = 0;
			}
			else if(data.receive_mass_sms_emails==3){
				save_params.receive_mass_sms = 1;
				save_params.receive_mass_emails = 1;
			}
		}
		var total_params = Object.assign(datas, save_params);

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/updateNewsletter.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				call_toastr('success', cust_det_trans_dt.Success, cust_det_trans_dt.Newslettersandupdatesupdatedsuccessfully);
				$('#newsletter_updates').editable('setValue',data.receive_mass_sms_emails);
				if ("gbl_data" in window) {
					if(data.from=='receive_mass_sms_emails'){
						gbl_data.customerData.Customer.receive_mass_sms = save_params.receive_mass_sms;
						cust_det_dt.customerData.receive_mass_sms = save_params.receive_mass_sms;

						gbl_data.customerData.Customer.receive_mass_emails = save_params.receive_mass_emails;
						cust_det_dt.customerData.receive_mass_emails = save_params.receive_mass_emails;
					}
				}
				else{
					if(data.from=='receive_mass_sms_emails'){
						cust_det_dt.customerData.receive_mass_sms = save_params.receive_mass_sms;
						cust_det_dt.customerData.receive_mass_emails = save_params.receive_mass_emails;
					}
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cust_det_trans_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_trans_dt.alertmessage);
					return;
				}	
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
	},
	getSummary:function(){
		$('span.total_sales,span.customer_balance,span.current_balance,span.overdue_balance').html('&nbsp;<img src="'+inline_loader+'">');
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cust_det_cstm_dt.customer_id,
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerSalesSummary.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
					var d = complet_data.response.response;
					var total_sales = convertIntoLocalFormat(parseFloat(checkNull(d.total_sales,0)));
					var customer_balance = convertIntoLocalFormat(parseFloat(checkNull(d.customer_balance,0)));
					var current_balance = convertIntoLocalFormat(parseFloat(checkNull(d.current_balance,0)));
					var overdue_balance = convertIntoLocalFormat(parseFloat(checkNull(d.overdue_balance,0)));
						
					if($('span.total_sales').length==0){
						
					}

					var appendSales = function(){
						$('span.total_sales').html(total_sales);
						$('span.customer_balance').html(customer_balance);
						$('span.current_balance').html(current_balance);
						$('span.overdue_balance').html(overdue_balance);
						clearInterval(sales_inter);
					};

					 sales_inter = setInterval(function(){
						if($('span.total_sales').length!=0){
							appendSales();
						}
					},10);

				


					

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cust_det_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_dt.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
	},
	generateContactList:function(data){
		data = JSON.parse(data);
		var i = 0;
		var html = '';
		for(var j in data){
			var d = data[j];
			html += '<tr>';
				html += '<td>';
					html += ++i;
				html += '</td>';

				html += '<td>';
					html += checkNull(d.User.last_name);
				html += '</td>';

				html += '<td>';
					html += checkNull(d.User.first_name);
				html += '</td>';

				html += '<td>';
					html += checkNull(d.User.email);
				html += '</td>';

				html += '<td>';
					html += checkNull(d.Login.format_cellphone);
				html += '</td>';

				html += '<td>';
					if(checkNull(d.Login.status)==false){
					 	html += cust_det_trans_dt.Inactive;
					}
					else{
					 	html += cust_det_trans_dt.Active;
					}
				html += '</td>';

				html += '<td>';
					if(d.Customer.default_contact == d.CustomerContact.id){
						html += '<i class="icon-link"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Yes;
					}
					else{
						html += '&nbsp;&nbsp;'+cust_det_trans_dt.No;
					}
				html += '</td>';

				if(d.Customer.status){
					var status = 1;
				}
				else{
					var status = 0;
				}
			
				html += '<td>';
					if(type != 'customer'){
						var edit_url = base_url + 'customers/edit_contact/'+d.Customer.id+'/'+d.CustomerContact.id+'?status='+status;
						html += '<button class="btn mini edit blue-stripe" onclick="event.stopPropagation(); show_modal(this,\'popups\');" data-width="750px" data-url="'+edit_url+'" >';
							html += '<i class="icon-eye-open"></i>&nbsp;'+cust_det_trans_dt.Edit;
						html += '</button>';

						var contact_country = d.User.country;

						if(checkNull(d.Login.cellphone_country_code)!=''){
							contact_country = d.Login.cellphone_country_code;
						}
					  
					  	var contact_name = d.User.first_name +' ' +d.User.last_name;
					  	if(checkNull(d.Login.sms_cellphone)!=''){
							html += '<a class="btn mini yellow-stripe" onclick="event.stopPropagation(); show_dkmodal_for_customer_sms(\''+d.Customer.id+'\',\''+d.Customer.customer_name+'\',\''+d.Login.cust_number+'\',\''+contact_country+'\',\''+d.Login.cp_code+'\',\''+d.Login.sms_cellphone+'\',\''+d.Customer.customer_number+'\',\''+d.CustomerContact.id+'\',\''+contact_name+'\',\'\')">';
								html += '<i class="icon-comment"></i>&nbsp;&nbsp;' + cust_det_trans_dt.SendSMS;
							html += '</a>';
						}

						var delete_url = base_url + 'customers/delete_contact/'+d.Customer.id+'/'+d.CustomerContact.id+'?customer_status'+status;
						html += '<button  class="btn mini red-stripe" data-width="750px" data-url="'+delete_url+'">';
							html += '<i class="icon-remove"></i>&nbsp;'+cust_det_trans_dt.Delete;
						html += '</button>';
					}
				html += '</td>';
			html += '</tr>';
		}
		$('#customer_contact_list').dataTable().fnDestroy();
		$('#customer_contact_list tbody').html(html);
		
		var len = checkNull(cust_det_dt.customer_contact_list_limit);
		if(len=='' || len==0){
			len = 10;
		}
		len = parseInt(len);
		
		$('#customer_contact_list').dataTable({ 
			"iDisplayLength": len,
			"aoColumns": [
				{ "bSortable": false },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": false },
			],
			"aLengthMenu": [ 10, 25, 50, 100 ],
			//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
			"sDom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			"sPaginationType": "input",

			"oLanguage": {
				"sLengthMenu": 
		           cust_det_trans_dt.View+ ' <select>'+
		             '<option value="10">10</option>'+
		             '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		             '<option value="40">40</option>'+
		             '<option value="50">50</option>'+
		             '<option value="-1">All</option>'+
		             '</select> '+ cust_det_trans_dt.records+ ' |  '
		         ,
				"oPaginate": {
					"sPrevious": '<i class="icon-angle-left"></i>',
					"sNext": '<i class="icon-angle-right"></i>',
					'of':cust_det_trans_dt.of,
				},
				
				"sInfo": cust_det_trans_dt.Foundtotal+" _TOTAL_ "+cust_det_trans_dt.records
			}
		});

		if(data.length<11){
			$('#customer_contact_list_length.dataTables_length').hide()
		}
	},
	getAndGenerateQuotes:function(from='next',v){
		showProcessingImage('undefined');
		var fields = ['Quote.id','Quote.quote_number','Quote.created','Quote.status'];
		

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			limit:quote_limit,
			page:quote_current_page,
			customer_id:cust_det_cstm_dt.customer_id,
			fields:JSON.stringify(fields),
		}
		if(from=='next'){
			quote_current_page++;

		}
		else if(from=='prev'){
			quote_current_page--;
		}
		else if(from=='input'){
			quote_current_page = v;
		}
		else if(from=='dropdown'){
			quote_current_page = 1;
			total_params.limit = v;
		}
		total_params.page = quote_current_page;


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/quotes/index.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				customer_details.generateQuoteList(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cust_det_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_dt.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
	},
	generateQuoteList:function(data){

		var quotesList = data.quotesList;
		
		quote_last_page = data.pagination.total_pages;
		var quoteStatus = {
			2:cust_det_trans_dt.Senttocustomer,
			3:cust_det_trans_dt.Accepted,
			4:cust_det_trans_dt.Declined,
			5:cust_det_trans_dt.Expired,
			6:cust_det_trans_dt.Retract,
			7:cust_det_trans_dt.Cancelled
		};

		var html = '<div class="portlet-body profile">';
			html += '<div class="row-fluid">';
				html += '<div class="table-responsive">';
					if(quotesList.length!=0){
						html += '<table id="customer_quote_list" class="table table-striped table-hover table-bordered">';
							html += '<thead>';
								html += '<tr>';
									html += '<th>';
										html += '<i class="icon-list"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Quotenumber;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-money"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Amount;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-time"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Date;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-cog"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Status;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-ok"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Action;
									html += '</th>';
								html += '</tr>';
							html += '</thead>';
							html += '<tbody>';

							html += '</tbody>';
						html += '</table>';
					}
					else{
						html += '<div style="text-align:center;" class="alert alert-error">'+cust_det_trans_dt.Norecordfound+'</div>';
					}
				html += '</div>';
			html += '</div>';

			if(quotesList.length!=0){
				html += '<div class="row-fluid form-inline">';
					html += '<div class="span12 dataTables_extended_wrapper">';
					   	html += '<div class="dataTables_paginate paging_input" id="customer_quote_list_paginate">';
					   	 	html += '<span class="paginate_page">'+cust_det_trans_dt.Page+' </span>';
				   	 		 	html += '<span class="previous prev btn btn-sm default paginate_button" id="customer_quote_list_previous prev btn btn-sm default"><i class="icon-angle-left"></i></span>';
				   	 			html += '<input class="paginate_input form-control input-mini input-inline input-sm" type="text">';
				   	 			html += '<span class="next next btn btn-sm default paginate_button" id="customer_quote_list_next next btn btn-sm default"><i class="icon-angle-right"></i></span>';
				   	 			html += '<span class="paginate_of"> '+cust_det_trans_dt.of+' '+data.pagination.total_pages+' |</span>';
					   	 	 html += '</div>';
					  html += ' <div id="customer_quote_list_length" class="dataTables_length">';
					      html += '<label style="margin-bottom:0">';
					        html += cust_det_trans_dt.View;
					        html += ' <select aria-controls="customer_order_list" style="margin-right:2px">';
					            html += '<option value="10" selected="selected">10</option>';
					            html += '<option value="20">20</option>';
					            html += '<option value="30">30</option>';
					           	html += '<option value="40">40</option>';
					            html += '<option value="50">50</option>';
					            html += '<option value="-1">All</option>';
					         	html += '</select>';
					        html += cust_det_trans_dt.records;
					      	html += ' | </label>';
					   	html += '</div>';
					   html += '<div class="dataTables_info" id="customer_quote_list_info" style="line-height:18px">'+cust_det_trans_dt.Foundtotal+' '+data.pagination.total_records+' '+cust_det_trans_dt.records+'</div>';
					html += '</div>';
				html += '</div>';
			html += '</div>';
		}
		$('#customer_tab_content').html(html);
		$('#customer_quote_list_paginate .paginate_input').val(quote_current_page);
		
		for(var j in quotesList){
			var ql = quotesList[j].Quote;
			var tr = '';
			tr += '<tr>';
				tr += '<td>';
					tr += ql.quote_number;
				tr += '</td>';

				tr += '<td>';
					tr += CUR_SYM+' '+ convertIntoLocalFormat(checkNull(ql.total_price));
				tr += '</td>';

				tr += '<td>';
					tr += convertDateIntoSiteFormat(checkNull(ql.created));
				tr += '</td>';

				tr += '<td>';
					tr += checkNull(quoteStatus[ql.status]);
				tr += '</td>';

				tr += '<td>';
					var prefix = '';
					if(checkNull(type) == 'customer'){
						prefix = '/' + partner_dir +'/';
					}
					else{
						prefix = '/';
					}

	
					tr += `<button class="btn mini blue-stripe" onclick="new_custom_main_page2('`+prefix+type+`/quotes/quote_details/`+ql.id+`','quotes_list','quotes_list','quote_details',{quote_id:`+ql.id+`})"><i class="icon-eye-open"></i>&nbsp;`+cust_det_trans_dt.View+`</button>`;
				tr += '</td>';										 
			tr += '</tr>';
			$('#customer_quote_list tbody').append(tr);
		}
		
		if(data.pagination.total_records < 11){
			$("#customer_quote_list_length.dataTables_length label,#customer_quote_list_paginate").hide();

		}
		$('#customer_quote_list_paginate .prev').click(function(){
			if(quote_current_page!=1){
				customer_details.getAndGenerateQuotes('prev');
			}
		});
		$('#customer_quote_list_paginate .next').click(function(){
			if(quote_current_page < quote_last_page){
				customer_details.getAndGenerateQuotes();
			}
		});

		$('#customer_quote_list_paginate .paginate_input').change(function(){
			var v = $(this).val();
			if(checkNull(v)!='' && v!=0 && v!=quote_current_page && v<=quote_last_page){
				customer_details.getAndGenerateQuotes('input',v);
			}
		});

		$("#customer_quote_list_length select").change(function(){
			var v = $(this).val();
			if(v==-1){
				v = 5000;
			}
			quote_limit = v;

			customer_details.getAndGenerateQuotes('dropdown',v);
		});	
	},
	getAndGenerateOrders:function(from='next',v){
		showProcessingImage('undefined');
		var fields = ['Order.id','Order.order_number','Quote.quote_number','Order.created','Order.status','Order.customer_id'];
		

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			limit:order_limit,
			page:order_current_page,
			customer_id:cust_det_cstm_dt.customer_id,
			fields:JSON.stringify(fields),
		}
		if(from=='next'){
			order_current_page++;

		}
		else if(from=='prev'){
			order_current_page--;
		}
		else if(from=='input'){
			order_current_page = v;
		}
		else if(from=='dropdown'){
			order_current_page = 1;
			total_params.limit = v;
		}
		total_params.page = order_current_page;


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/orders/index.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				customer_details.generateOrderList(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cust_det_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_dt.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
	},
	generateOrderList:function(data){
		var ordersList = data.ordersList;
		order_last_page = data.pagination.total_pages;
		var orderStatus = data.getAllOrderStatusList;

		var html = '<div class="portlet-body profile">';
			html += '<div class="row-fluid">';
				html += '<div class="table-responsive">';
					if(ordersList.length!=0){
						html += '<table id="customer_order_list" class="table table-striped table-hover table-bordered">';
							html += '<thead>';
								html += '<tr>';
									html += '<th>';
										html += '<i class="icon-list"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Ordernumber;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-list"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Quotenumber;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-money"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Amount;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-time"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Date;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-cog"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Status;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-ok"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Action;
									html += '</th>';
								html += '</tr>';
							html += '</thead>';
							html += '<tbody>';

							html += '</tbody>';
						html += '</table>';
					}
					else{
						html += '<div style="text-align:center;" class="alert alert-error">'+cust_det_trans_dt.Norecordfound+'</div>';
				
					}
				html += '</div>';
			html += '</div>';

			if(ordersList.length!=0){
				html += '<div class="row-fluid form-inline">';
					html += '<div class="span12">';
					   	html += '<div class="dataTables_paginate paging_input" id="customer_order_list_paginate">';
					   	 	html += '<span class="paginate_page">'+cust_det_trans_dt.Page+' </span>';
				   	 		 	html += '<span class="previous prev btn btn-sm default paginate_button" id="customer_order_list_previous prev btn btn-sm default"><i class="icon-angle-left"></i></span>';
				   	 			html += '<input class="paginate_input form-control input-mini input-inline input-sm" type="text" value="'+checkNull(data.pagination.page_num)+'">';
				   	 			html += '<span class="next next btn btn-sm default paginate_button" id="customer_order_list_next next btn btn-sm default"><i class="icon-angle-right"></i></span>';
				   	 			html += '<span class="paginate_of"> '+cust_det_trans_dt.of+' '+data.pagination.total_pages+' |</span>';
					   	 	 html += '</div>';
					  html += ' <div id="customer_order_list_length" class="dataTables_length">';
					       html += '<label style="margin-bottom:0">';
					        html += cust_det_trans_dt.View;
					        html += ' <select aria-controls="customer_order_list" style="margin-right:2px">';
					            html += '<option value="10" selected="selected">10</option>';
					            html += '<option value="20">20</option>';
					            html += '<option value="30">30</option>';
					           	html += '<option value="40">40</option>';
					            html += '<option value="50">50</option>';
					            html += '<option value="-1">All</option>';
					         	html += '</select>';
					        html += cust_det_trans_dt.records;
					      	html += ' | </label>';
					   	html += '</div>';
					   html += '<div class="dataTables_info" id="customer_order_list_info" style="line-height:18px">'+cust_det_trans_dt.Foundtotal+' '+data.pagination.total_records+' '+cust_det_trans_dt.records+'</div>';
					html += '</div>';
				html += '</div>';
			html += '</div>';
		}

		$('#customer_tab_content').html(html);
		$('#customer_order_list_paginate .paginate_input').val(order_current_page);

		for(var j in ordersList){
			var ol = ordersList[j].Order;
			var q = ordersList[j].Quote;
			var os = ordersList[j].OrderSummary;
			var tr = '';
			tr += '<tr>';
				tr += '<td>';
					tr += ol.order_number;
				tr += '</td>';

				tr += '<td>';
					if(checkNull(q.quote_number)==''){
						tr += '-';
					}
					else{
						tr += q.quote_number;
					}
					
				tr += '</td>';

				tr += '<td>';
					tr += CUR_SYM+' '+ convertIntoLocalFormat(checkNull(os.gross_amount));
				tr += '</td>';

				tr += '<td>';
					tr += convertDateIntoSiteFormat(checkNull(ol.created));
				tr += '</td>';

				tr += '<td>';
					tr += checkNull(orderStatus[ol.status]);
				tr += '</td>';

				tr += '<td>';
					var url = base_url + 'order/order_details/'+ol.id+'/'+cust_det_cstm_dt.customer_id;
					var prefix = '';
					if(checkNull(type) == 'customer'){
						prefix = '/' + partner_dir +'/';
					}
					else{
						prefix = '/';
					}

					tr += `<button class="btn mini blue-stripe" onclick="new_custom_main_page2('`+prefix+type+`/order/order_details/`+ol.id+`','orders_list','orders_list','order_details',{order_id:`+ol.id+`});"><i class="icon-eye-open"></i>&nbsp;`+cust_det_trans_dt.View+`</button>`;
				tr += '</td>';	


			tr += '</tr>';

			$('#customer_order_list tbody').append(tr);
		}

		if(ordersList.length < 11){
			$("#customer_order_list_length.dataTables_length label,#customer_order_list_paginate").hide();

		}
		$('#customer_order_list_paginate .prev').click(function(){
			if(order_current_page!=1){
				customer_details.getAndGenerateOrders('prev');
			}
		});
		$('#customer_order_list_paginate .next').click(function(){
			if(order_current_page < order_last_page){
				customer_details.getAndGenerateOrders();
			}
		});

		$('#customer_order_list_paginate .paginate_input').change(function(){
			var v = $(this).val();
			if(checkNull(v)!='' && v!=0 && v!=order_current_page && v<=order_last_page){
				customer_details.getAndGenerateOrders('input',v);
			}
		});

		$("#customer_order_list_length select").change(function(){
			var v = $(this).val();
			if(v==-1){
				v = 5000;
			}
			order_limit = v;

			customer_details.getAndGenerateOrders('dropdown',v);
		});
	},
	getAndGenerateInvoices:function(from=''){
		
		var fields = ['Invoice.id','Invoice.internal_status','Invoice.invoice_number','Invoice.invoice_date','Invoice.due_date','Invoice.draft_scheduled','Invoice.receiver_id','Invoice.gross_amount'];

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cust_det_cstm_dt.customer_id,
			fields:JSON.stringify(fields),
			status:from,
			show_draft:'N'
		}
		if(from==''){
			total_params.status = 'unpaid';
			showProcessingImage('undefined');
		}
		else{
			if(from=='scheduled'){
				total_params.show_draft = 'Y';
			}
			$('.inv_tab_content').html('<img src="'+inline_loader+'">');
		}


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/invoices/customer_card_invoices.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				if(from==''){
					customer_details.generateInvBlock(complet_data.response.response);
				}
				else if(from=='unpaid'){
					customer_details.generateOpenInv(complet_data.response.response);
				}
				else if(from=='scheduled' || from=='draft'){

					customer_details.generateSchdInv(complet_data.response.response,from);
				}
				else{
					customer_details.generateOpenInv(complet_data.response.response);
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cust_det_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_dt.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
	},
	generateInvBlock:function(data){
		invoice_last_page = data.pagination.total_pages;
		var html = '<div class="row-fluid">';
			html += '<div class="span3">';
				html += '<div class="control-group">';
					html += '<div class="controls">';
						html += '<select name="data[invoice][option]" class="m-wrap span8" style="margin-bottom:0px" id="invoiceOption">';
							html += '<option value="invoice" selected="selected">'+cust_det_trans_dt.Invoice+'</option>';
							html += '<option value="credit_memo">'+cust_det_trans_dt.Creditmemo+'</option>';
						html += '</select>';
					html += '</div>';
				html += '</div>';
			html += '</div>';
		html += '</div>';

		html += '<div class="row-fluid">';
			html += '<div class="tabbable tabbable-custom" id="customer_invoices_tab">';
				html += '<ul class="nav nav-tabs">';
					html += '<li id="customer_unpaid_invoice" class="active">';
						html += '<a href="#tab_2_1" data-toggle="tab" onclick="customer_details.getAndGenerateInvoices(\'unpaid\')">'+cust_det_trans_dt.Open+'</a>';
					html += '</li>';

					html += '<li id="customer_paid_invoice" >';
						html += '<a href="#tab_3_2" data-toggle="tab" onclick="customer_details.getAndGenerateInvoices(\'paid\')">'+cust_det_trans_dt.Closed+'</a>';
					html += '</li>';

					html += '<li id="customer_draft_invoice" >';
						html += '<a href="#tab_3_3" data-toggle="tab"  onclick="customer_details.getAndGenerateInvoices(\'draft\')">'+cust_det_trans_dt.Draft+'</a>';
					html += '</li>';

					html += '<li id="customer_schedule_invoice">';
						html += '<a href="#tab_3_4" data-toggle="tab"  onclick="customer_details.getAndGenerateInvoices(\'scheduled\')">'+cust_det_trans_dt.Scheduled+'</a>';
					html += '</li>';
				html += '</ul>';

				html += '<div class="tab-content inv_tab_content" >';
				html += '</div>';
			html += '</div>';
		html += '</div>';


		$('#customer_tab_content').html(html);
		customer_details.generateOpenInv(data);	
	},
	getStatus:function(inv_status={},other_params={}){
		var draft_scheduled = other_params.draft_scheduled;
		var returned_to_sender = other_params.returned_to_sender;
		var conflict = other_params.conflict;
		var invoice_gross = other_params.invoice_gross;
		var credit_sum = other_params.credit_sum;
		

		if(returned_to_sender == '1' && conflict == 'n'){
			return  '<font color=red >'+cust_det_trans_dt.Returntosender+'<br /></font>';
		}
		else if(returned_to_sender == '1' && conflict == 'y'){
			return '<font color=red >'+cust_det_trans_dt.Conflict+'<br /></font>';
		}
		//console.log('check',inv_status)
		var inv_status_arr = {
			draft_invoice:cust_det_trans_dt.Draft,
			not_paid:'<font color=red >'+cust_det_trans_dt.Notpaid + '</font>',
			partially_paid:'<font color=green >'+cust_det_trans_dt.Partiallypaid + '</font>',
			fully_paid:'<font color=green >'+cust_det_trans_dt.Paid + '</font>',
			partially_credited:cust_det_trans_dt.Partiallycredited,
			fully_credited:cust_det_trans_dt.Credited,
			loss:cust_det_trans_dt.Lost,
			loss_partially_paid:cust_det_trans_dt.$loss_pp,
			loss_fully_paid:cust_det_trans_dt.Losspaid,
			loss_partially_credited:cust_det_trans_dt.$loss_pc,
			loss_fully_credited:cust_det_trans_dt.Losscredited,
			recovered_from_loss:cust_det_trans_dt.Recoveredfromloss,
			scheduled:cust_det_trans_dt.Scheduled,
			return_to_sender:'<font color=red >'+cust_det_trans_dt.Returntosender+'<br /></font>',
		};

		var i_status = checkNull(inv_status.invoice_status);
		var c_status = checkNull(inv_status.credit_status);

		var inv_status = checkNull(inv_status_arr[i_status]);
		var credit_status =  checkNull(inv_status_arr[credit_status]);
		if(c_status == 'partially_credited') {
			if(checkNull(inv_status_arr[c_status])!=''){
				credit_status = '&nbsp;<small>'+ inv_status_arr[c_status] + '</small>';
			}
			else{
				credit_status = '';
			}
			
		}
		return inv_status + credit_status;
	},
	generateOpenInv:function(data){
		
		var il = data.invoiceList;

		var html = '<div class="portlet-body profile">';
			html += '<div class="row-fluid">';
				html += '<div class="table-responsive">';
					if(il.length!=0){
						html += '<table id="customer_open_inv_list" class="table table-striped table-hover table-bordered">';
							html += '<thead>';
								html += '<tr>';
									html += '<th>';
										html += '<i class="icon-list"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Invoicenumber;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-time"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Invoicedate;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-time"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Duedate;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-money"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Balance;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-cog"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Paymentstatus;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-ok"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Action;
									html += '</th>';
								html += '</tr>';
							html += '</thead>';
							html += '<tbody>';

							html += '</tbody>';
						html += '</table>';
					}
					else{
						html += '<div style="text-align:center;" class="alert alert-error">'+cust_det_trans_dt.Norecordfound+'</div>';
					}
				html += '</div>';
			html += '</div>';

			

		$('.inv_tab_content').html(html);
		
		
		if(il.length!=0){
			for(var j in il){
				var i = il[j].Invoice;
				var tr = '<tr>';
					tr += '<td>';
						tr += (checkNull(i.invoice_number)=='')?'-':i.invoice_number;
					tr += '</td>';

					tr += '<td>';
						tr +=convertDateIntoSiteFormat(checkNull(i.invoice_date));
					tr += '</td>';

					tr += '<td>';
						tr += convertDateIntoSiteFormat(checkNull(i.due_date));
					tr += '</td>';

					tr += '<td>';
						tr += CUR_SYM+' '+ convertIntoLocalFormat(checkNull(i.out_standing_balance));
					tr += '</td>';

					tr += '<td>';
						var otherParams = {
							'draft_scheduled' : checkNull(i.draft_scheduled),
							'returned_to_sender':checkNull(i.returned_to_sender),
							'conflict':checkNull(i.conflict),
							'invoice_gross':checkNull(i.gross_amount,0),
							'credit_sum':checkNull(i.credit_sum,0),
						};
						tr += customer_details.getStatus(i.inv_status,otherParams);
					tr += '</td>';

					tr += '<td>';
						var url = base_url + 'invoice/invoice_details/' + i.id + '/'+cust_det_cstm_dt.customer_id;
					

						var prefix = '';
						if(type == 'customer'){
							prefix = '/'+partner_dir + '/';
						}
						else{
							prefix = '/';
						}

						tr += `<button id="view_invoice_`+i.id+`" class="btn mini blue-stripe"  onclick="new_custom_main_page2('`+prefix+type+`/invoice/invoice_details/`+i.id+`','invoices_list','invoices_list','invoice_details',{invoice_id:`+i.id+`});">`;
						tr += '<i class="icon-eye-open"></i>&nbsp;' +cust_det_trans_dt.View+'</button>&nbsp;';


						if(i.refund_flag==1){

							var url = base_url + 'invoice/refund_payments?ad_inv=N&from_card=y&invoice_id='+i.id+'&receiver_id='+i.receiver_id+'&journal_id='+i.journal_id;
							tr += '<a class="btn mini green-stripe" data-width="1000px" data-url="'+url+'" onclick="show_modal(this,\'popups\')">';
							tr += '<i class="icon-ok"></i>&nbsp;' +cust_det_trans_dt.Refund+'</a>';
						}
						else{
							
							if(i.invoice_status!=0){
								//$qString = array('selectedinvoice[]' => $invoice['Invoice']['id'].'::'.$invoice['Invoice']['receiver_id'], 'single_sel'=> 'y','from_card' => 'y');
								var qString = {
									'selectedinvoice[]': i.id+'::'+i.receiver_id,
									'single_sel':'y',
									'from_card':'y'
								};

								var qkey = '';
								var qvalue= '';
									if(checkNull(i.add_string)!='' && checkNull(i.add_string)!=0){
										$add_str_arr = explode('=>',$invoice['Invoice']['add_string']);
										var add_str_arr = i.add_string.split('=>');
										var qkey = checkNull(add_str_arr[0]);
										var qvalue = checkNull(add_str_arr[1]);
										qString[qkey] = qvalue;
									}
							}
							var qstr = '';
							var i = 0;
							for(var j in qString){
								i++;
								if(i==1){
									qstr += j+'='+qString[j];
								}
								else{
									qstr += '&'+j+'='+qString[j];
								}
								
							}
							var url = base_url + 'invoice/register_payment?'+qstr;
							tr += '<a class="btn mini green-stripe" data-width="1000px" data-url="'+url+'" onclick="show_modal(this,\'popups\')">';
							tr += '<i class="icon-ok"></i>&nbsp;' +cust_det_trans_dt.Payment+'</a>';
						}
						


					tr += '</td>';

					
				tr += '</tr>'
				$('#customer_open_inv_list tbody').append(tr);
			}
			
			$('#customer_open_inv_list').dataTable().fnDestroy();
			$('#customer_open_inv_list').dataTable({ 
				"iDisplayLength": 10,
				"aoColumns": [
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": false },
				],
				"aLengthMenu": [ 10, 25, 50, 100 ],
				//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
				"sDom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
				"sPaginationType": "input",

				"oLanguage": {
					"sLengthMenu": 
			           cust_det_trans_dt.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ cust_det_trans_dt.records+ ' |  '
			         ,
					"oPaginate": {
						"sPrevious": '<i class="icon-angle-left"></i>',
						"sNext": '<i class="icon-angle-right"></i>',
						'of':cust_det_trans_dt.of,
					},
					
					"sInfo": cust_det_trans_dt.Foundtotal+" _TOTAL_ "+cust_det_trans_dt.records
				}
			});
		}

		if(data.pagination.total_records < 11){
			$("#customer_open_inv_list_length.dataTables_length label,#customer_order_list_paginate").hide();
		}

		$("#invoiceOption").change(function(){
			var v= $(this).val();
			if(v=='invoice'){
				$('#customer_tab_content').empty();
				customer_details.showTabs('invoices','tab_1_4')
			}
			else{
				customer_details.getCreditMemo();
			}
		});
	},
	generateSchdInv:function(data,from){
		var il = data.invoiceList;
		var html = '<div class="portlet-body profile">';
			html += '<div class="row-fluid">';
				html += '<div class="table-responsive">';
					if(il.length!=0){
						html += '<table id="customer_sched_inv_list" class="table table-striped table-hover table-bordered">';
							html += '<thead>';
								html += '<tr>';
									html += '<th>';
										html += '<i class="icon-time"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Invoicedate;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-time"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Duedate;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-money"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Balance;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-cog"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Paymentstatus;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-ok"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Action;
									html += '</th>';
								html += '</tr>';
							html += '</thead>';
							html += '<tbody>';

							html += '</tbody>';
						html += '</table>';
					}
					else{
						html += '<div style="text-align:center;" class="alert alert-error">'+cust_det_trans_dt.Norecordfound+'</div>';
					}
				html += '</div>';
			html += '</div>';
		html += '</div>';
		$('.inv_tab_content').html(html);
		if(il.length!=0){
			for(var j in il){
				var i = il[j].Invoice;
				var tr = '<tr>';

					tr += '<td>';
						tr +=convertDateIntoSiteFormat(checkNull(i.invoice_date));
					tr += '</td>';

					tr += '<td>';
						tr += convertDateIntoSiteFormat(checkNull(i.due_date));
					tr += '</td>';

					tr += '<td>';
						tr += CUR_SYM+' '+ convertIntoLocalFormat(checkNull(i.gross_amount));
					tr += '</td>';

					tr += '<td>';
						if(from=='scheduled'){
							tr += cust_det_trans_dt.Scheduled;
						}
						else if(from=='draft'){
							tr += cust_det_trans_dt.Draft;
						}
					tr += '</td>';

					tr += '<td>';
						var url = base_url + 'invoice/draft_invoice_view/' + i.id + '/'+cust_det_cstm_dt.customer_id;
						tr += '<a id="view_invoice_'+i.id+'" class="btn mini blue-stripe" href="'+url+'">';
						tr += '<i class="icon-eye-open"></i>&nbsp;' +cust_det_trans_dt.View+'</a>&nbsp;';

						var url = base_url + 'invoice/delete_invoices?from='+from;
						tr += '<a id="view_invoice_'+i.id+'" class="btn mini red-stripe" onclick="event.stopPropagation();deleteRecord(\''+url+'\',\'invoice_ids='+i.id+'\',\''+cust_det_trans_dt.$real_del+'\')">';
						tr += '<i class="icon-remove"></i>&nbsp;' +cust_det_trans_dt.Delete+'</a>&nbsp;';

					tr += '</td>';

					
				tr += '</tr>'
				$('#customer_sched_inv_list tbody').append(tr);
			}
			$('#customer_sched_inv_list').dataTable({ 
					"iDisplayLength": 10,
					"aoColumns": [
						{ "bSortable": true },
						{ "bSortable": true },
						{ "bSortable": true },
						{ "bSortable": true },
						{ "bSortable": false },
					],
					"aLengthMenu": [ 10, 25, 50, 100 ],
					//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
					"sDom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
					"sPaginationType": "input",

					"oLanguage": {
						"sLengthMenu": 
				           cust_det_trans_dt.View+ ' <select>'+
				             '<option value="10">10</option>'+
				             '<option value="20">20</option>'+
				            '<option value="30">30</option>'+
				             '<option value="40">40</option>'+
				             '<option value="50">50</option>'+
				             '<option value="-1">All</option>'+
				             '</select> '+ cust_det_trans_dt.records+ ' |  '
				         ,
						"oPaginate": {
							"sPrevious": '<i class="icon-angle-left"></i>',
							"sNext": '<i class="icon-angle-right"></i>',
							'of':cust_det_trans_dt.of,
						},
						
						"sInfo": cust_det_trans_dt.Foundtotal+" _TOTAL_ "+cust_det_trans_dt.records
					}
			});
		}


		if(il.length < 11){
			$("#customer_open_inv_list_length.dataTables_length label,#customer_order_list_paginate").hide();
		}
		$("#invoiceOption").change(function(){
			var v= $(this).val();
			if(v=='invoice'){
				$('#customer_tab_content').empty();
				customer_details.showTabs('invoices','tab_1_4')
			}
			else{
				customer_details.getCreditMemo();
			}
		});
	},
	getCreditMemo:function(){
		$('#customer_invoices_tab ul.nav').remove();
		$('#customer_invoices_tab').removeClass('tabbable tabbable-custom');
		
		$('.inv_tab_content').html('<img src="'+inline_loader+'">');
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cust_det_cstm_dt.customer_id,
			//fields:JSON.stringify(fields),
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/invoices/listCreditMemo.json';
		params['data'] = total_params;

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
					customer_details.generateCreditMemo(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cust_det_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_dt.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
	},
	generateCreditMemo:function(data){
	
		var cl = data.creditList;
		var html = '<div class="portlet-body profile">';
			html += '<div class="row-fluid">';
				html += '<div class="table-responsive">';
					if(cl.length!=0){
						html += '<table id="customer_memo_list" class="table table-striped table-hover table-bordered">';
							html += '<thead>';
								html += '<tr>';
									html += '<th>';
										html += '<i class="icon-list"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Creditnumber;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-list"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Invoicenumber;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-time"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Creditdate;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-money"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Amount;
									html += '</th>';

									html += '<th>';
										html += '<i class="icon-ok"></i>&nbsp;&nbsp;'+cust_det_trans_dt.Action;
									html += '</th>';
								html += '</tr>';
							html += '</thead>';
							html += '<tbody>';

							html += '</tbody>';
						html += '</table>';
					}
					else{
						html += '<div style="text-align:center;" class="alert alert-error">'+cust_det_trans_dt.Norecordfound+'</div>';
					}
				html += '</div>';
			html += '</div>';
		html += '</div>';

		$('.inv_tab_content').html(html);
		if(cl.length!=0){
			for(var j in cl){
				var cn = cl[j].CreditNote;
				var tr = '<tr>';
					tr += '<td>';
						tr += (checkNull(cn.credit_number)=='')?'-':cn.credit_number;
					tr += '</td>';

					tr += '<td>';
						tr += (checkNull(cn.invoice_number)=='')?'-':cn.invoice_number;
					tr += '</td>';

					tr += '<td>';
						tr += convertDateIntoSiteFormat(checkNull(cn.credit_date));
					tr += '</td>';

					tr += '<td>';
						tr += CUR_SYM+' '+ convertIntoLocalFormat(checkNull(cn.gross_amount));
					tr += '</td>';
					
					tr += '<td>';
						var url = base_url + 'invoice/credit_memo_details/' + cn.id ;
						tr += '<a class="btn mini blue-stripe" href="'+url+'">';
						tr += '<i class="icon-eye-open"></i>&nbsp;' +cust_det_trans_dt.View+'</a>&nbsp;';
					tr += '</td>';

				 tr += '</tr>';
				 $('#customer_memo_list tbody').append(tr);
			}
			$('#customer_memo_list').dataTable({ 
				"iDisplayLength": 10,
				"aoColumns": [
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": false },
				],
				"aLengthMenu": [ 10, 25, 50, 100 ],
				//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
				"sDom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
				"sPaginationType": "input",

				"oLanguage": {
					"sLengthMenu": 
			           cust_det_trans_dt.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ cust_det_trans_dt.records+ ' |  '
			         ,
					"oPaginate": {
						"sPrevious": '<i class="icon-angle-left"></i>',
						"sNext": '<i class="icon-angle-right"></i>',
						'of':cust_det_trans_dt.of,
					},
					
					"sInfo": cust_det_trans_dt.Foundtotal+" _TOTAL_ "+cust_det_trans_dt.records
				}
			});
		}
		if(cl.length < 11){
			$("#customer_memo_list_length.dataTables_length label,#customer_order_list_paginate").hide();
		}
	},
	generateCustomFields:function(data=''){
		if(data==''){
			var data = cust_det_dt.getCustomFieldsListForotherInformation;
		}
		
		var ans = '';
		if(checkNull(cust_det_dt.getAllCustomFieldsData)!=''){
			ans = checkNull(cust_det_dt.getAllCustomFieldsData.CustomerCustomfield.answers);
		}
		if(ans!=''){
			ans = JSON.parse(ans);
		}
		else{
			ans = {};
		}
		for(var j in data){
			var d = data[j];
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

			
			var field_id = j.trim();
			field_id = field_id.replace(/\s/g,'');
			//field_id = field_id.replace('/','');
	

			var li = '<li data-name="'+j+'" class="custom_fields_li hide">';
				li +=  checkNull(j)+':&nbsp;';
				li += '<a id="'+field_id+'" name="'+field_id+'" data-name="'+j+'"></a>';
			li += '</li>';
			$('.cust_sel_fields').append(li);
			

			//$('#custom_field_tbody').append(tr);
			if(d.type=='text'){
				if(d.mandatory=='y'){
						
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						success: function(data, config) {
							customer_details.saveData(config,this,'text','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return cust_det_trans_dt.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						success: function(data, config) {
							customer_details.saveData(config,this,'text','n');
						},
					});
				}	
			}
			else if(d.type=='textarea'){
				if(d.mandatory=='y'){
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						success: function(data, config) {
							customer_details.saveData(config,this,'textarea','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return cust_det_trans_dt.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						success: function(data, config) {

							customer_details.saveData(config,this,'textarea','n');
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
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:cust_det_trans_dt.Empty,
		       			},
						source:options,
						success: function(data, config) {
							customer_details.saveData(config,this,'dropdown','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return cust_det_trans_dt.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:cust_det_trans_dt.Empty,
		       			},
						source:options,
						success: function(data, config) {
							customer_details.saveData(config,this,'dropdown','n');
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
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:cust_det_trans_dt.Empty,
		       			},
						source:options,
						success: function(data, config) {
							customer_details.saveData(config,this,'radio','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return cust_det_trans_dt.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:cust_det_trans_dt.Empty,
		       			},
						source:options,
						success: function(data, config) {
							customer_details.saveData(config,this,'radio','n');
						}
					});
				}
			}
			else if(d.type=='checkbox'){
				var opts = checkNull(d.custom_value);
				var options = {};
				options[opts] = opts;
		
				if(d.mandatory=='y'){
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						source:options,
						type: 'checklist',
						success: function(data, config) {
							customer_details.saveData(config,this,'checkbox','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return cust_det_trans_dt.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						source:options,
						type: 'checklist',
						success: function(data, config) {
							customer_details.saveData(config,this,'checkbox','n');
						}
					});
				}
			}
		}
	},
	saveData:function(newvalue,that,type,validate){
		
		if(validate!='n' && (newvalue=='' || newvalue==null)){
			return;
		}
		var fieldname = $(that).attr('data-name');
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			newvalue:newvalue,
			fieldname:fieldname,
			type:type,
			customer_id:cust_det_cstm_dt.customer_id,
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/editCustomerCustomFields.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				$('#customer_tab_content a[data-name="'+fieldname+'"]').editable('setValue',newvalue);
				call_toastr('success', cust_det_trans_dt.Success, complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cust_det_trans_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cust_det_trans_dt.alertmessage);
					return;
				}	
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
	},
	getCustomerRecentActivities:function(){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cust_det_cstm_dt.customer_id,
			from:'customer_card'
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/recent_activities/getCustomerRecentActivities.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			customer_details.generateRecentActivity(complet_data.response.response);
		};
		showProcessingImage('undefined');
		doAjax(params);
	},
	generateRecentActivity:function(data=[]){ 
		var html = '<div class="row-fluid"><div class="span12"><div class="table-responsive">';
		
		if(data.length!=0){
			html += '<table class="table table-striped table-bordered table-hover" id="sorting_customer_recent_activity_list">';
				html += '<thead>';
					html += '<tr>';
						html += '<th><i class="icon-time"></i>&nbsp;'+cust_det_trans_dt.Dateandtime+'</th>';
						html += '<th><i class="icon-list"></i>&nbsp;'+cust_det_trans_dt.Action+'</th>';
					html += '</tr>';
				html += '</thead>';
				html += '<tbody>';
					for(var j in data){
						var ra = data[j];
						html += '<tr>';
							html += '<td>'+ra.time_txt+'</td>';
							html += '<td>';
								html += '<div class="label '+checkNull(ra.css[1])+'">';
									html += '<i class="'+checkNull(ra.css[0])+'"></i>';
								html += '</div>&nbsp;&nbsp;';
								html += ra.activity;
							html += '</td>';
						html += '</tr>';
					}
				html += '</tbody>';
			html += '</table>';
		}
		else{
			html += '<div style="text-align:center;" class="alert alert-error">'+cust_det_trans_dt.Norecordfound+'</div>';				
		}
		html += '</div></div></div>';
		$('#customer_tab_content').html(html);
		$("#sorting_customer_recent_activity_list a").attr('href','javascript:;');
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
			$('.profile-info #'+target).val(complet_data.response.response.city);
		};
		if(frm == 'postal'){
			for(var j in getcitypostde){
				clearInterval(getcitypostde[j]);
			}
			getcitypostde = [];
			getcitypostde.push(setTimeout(function(){
				doAjax(params);
			},200));
		}
		else if(frm == 'delivery'){
			for(var j in getcitydeliveryde){
				clearInterval(getcitydeliveryde[j]);
			}
			getcitydeliveryde = [];
			getcitydeliveryde.push(setTimeout(function(){
				doAjax(params);
			},200));
		}		
	}

}