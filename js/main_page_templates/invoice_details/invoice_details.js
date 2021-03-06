var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var type = $('#type').val();
var storage_timeouts = [];
var id_dt;
var id_td;
var id_meta ={};
var global_linKy = 0;
var inv_table;
var returnselopts = '';
var is_inv_conflict = 'n';
var is_inv_return = 'n';
var reminderopts = '';
var inv_i_d = {};
var install_data = [];
var old_exists = 0;
var show_input = 0;
var notifications_v = {sms:'sms',email:'email',email_sms:'email_sms'};
var invoice_details = {
	start:function(meta={}){
		id_meta = meta;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			invoice_id:id_meta.invoice_id,
			getTranslationsDataArray:['Dashboard','alert message','Success','Invoice','Invoice details','Customer','Delivery method','None','Select','Delivery name','$trackh','Empty','$invoiceh','Invoice status','Conflict','Return to sender','Draft','Not paid','Partially paid','Paid','Partially credited','Credited','Lost','$loss_pp','Loss paid','$loss_pc','Loss paid','$loss_pc','Loss credited','Recovered from loss','Scheduled','Invoice number','Invoice date','Due date','Do not send reminders','KID','Bank account','Invoice method','Order date','$orderh','Our reference','Your reference','Referrer','Phone number','Product','Description','Location','Quantity','Unit Price','Unit','$mva','Discount','Total Price','Checklist','$prodh','View','Net amount','Round off','Total','MVA','Invoices transactions','Invoices notes','$srno','Date','Type','Amount','Manual Entry','B','INV','RF','CF','LO','CR','Paid by','Paid from','Link to a different invoice','Note by','Note','Action','Found total','records','View','of','Page','Delete','$del_note','Cancel','$del_note','Confirmation','No record found','Payment details','Reminder status','Outstanding balance','View PDF','Actions','Properties and history','Payment','Credit memo','Refund','Customer details','Duplicate','Add note','Register loss','Credit memo','Back','Resend','Current Reminder level','Reminder date','Reminder Due date','KID','Invoice balance','Address','Reason','Last updated','$reminderh','Reminder date','Edit','Reminders','History','Staffer','Copy','Other','No record found','Distribution','Journal entries','Status is required','$conflict_note','Customer request','Sent for convenience','Payment reminder','Collection warning','Reminder level','Due date is required','Reason is required','Send reminders','More info','Final notice','Email','SMS','Clear status','Reminder due date','Applies to','Applies to is required','MVA','Total','Total to pay','$tota_inc_vat','$sales_location','Installments','Number of installments','Installment frequency','Due date of first installment','Monthly','Days','Number of days','Installment notification','Calculate installments','Please check the following fields','$installmenth','Due date','Amount','Notification','None','SMS','Email','Email and SMS','Actions','Add','Save','for','$installment_total_err','Please enter installments','Days before','Recalculate installments','Due date of next installment','Due date of last installment','$del_all_installment','Active','Tax rate','Tax amount','Save installment agreement','Delete installment agreement','Reset','Outgoing vat','$vat_spec','Rate','Base amount','Transfer']
			    
		};

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Invoices/getInvoiceDetail.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				id_dt = complet_data.response.response;
				id_dt['CUR_SYM'] = CUR_SYM;
				id_td = complet_data.response.response.translationsData;
				invoice_details.createHtml(id_dt);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createHtml:function(){
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}

		
		id_dt.date_format_f = date_format_f;
		id_dt.type = type;
		id_td.dashboardurl = base_url+'dashboard/index';
		id_td.loaderurl = host_url+'app/webroot/img/loading.gif';

		id_dt.inv_cd = {};

		if(type == 'customer'){
			id_dt.inv_cd['customer1'] = id_dt.getInvoicePageDetails.InvoiceDetail.customer_number;
			id_dt.inv_cd['customer2'] = '';
		}
		else{
			id_dt.inv_cd['customer1'] = id_dt.getInvoicePageDetails.InvoiceDetail.customer_number;
			id_dt.inv_cd['customer2'] = id_dt.getInvoicePageDetails.InvoiceDetail.company_name;
		}

		id_dt.inv_cd['invoice_date']  = convertDateIntoSiteFormat(checkNull(id_dt.getInvoicePageDetails.Invoice.invoice_date));
		id_dt.inv_cd['due_date'] = convertDateIntoSiteFormat(checkNull(id_dt.getInvoicePageDetails.Invoice.due_date));

		if(checkNull(id_dt.getInvoicePageDetails.Invoice.order_id) != '' && type != 'customer'){
			id_dt.inv_cd['order_date'] = convertDateIntoSiteFormat(checkNull(id_dt.getInvoicePageDetails.Invoice.order_date));
		}

		if(checkNull(id_dt.getInvoicePageDetails.Invoice.order_id) != '' && checkNull(id_dt.getInvoicePageDetails.Order.order_number) != ''){
			id_dt.inv_cd['order_number'] = checkNull(id_dt.getInvoicePageDetails.Order.order_number);
		}

		id_dt.inv_cd['our_ref'] = '';
		if(checkNull(id_dt.getInvoicePageDetails.Invoice.our_ref).trim() != ''){
			id_dt.inv_cd['our_ref'] = id_dt.getInvoicePageDetails.Invoice.our_ref;
		}

		id_dt.inv_cd['bp_referrer'] = '';
		if(checkNull(id_dt.getInvoicePageDetails.Invoice.bp_referrer).trim() != ''){
			id_dt.inv_cd['bp_referrer'] = id_dt.getInvoicePageDetails.Invoice.bp_referrer;
		}
		

		id_dt.inv_cd['your_ref'] = '';
		if(checkNull(id_dt.getInvoicePageDetails.Invoice.your_ref_name).trim() != ''){
			if(checkNull(id_dt.getInvoicePageDetails.Invoice.your_ref).trim() != ''){
				if(type != 'customer'){
					id_dt.inv_cd['your_ref'] = id_dt.getInvoicePageDetails.Invoice.your_ref_name +' &lt;'+id_dt.getInvoicePageDetails.Invoice.your_ref + '&gt';
				}
				else{
					id_dt.inv_cd['your_ref'] = id_dt.getInvoicePageDetails.Invoice.your_ref_name;
				}
			}
			else{
				id_dt.inv_cd['your_ref'] = id_dt.getInvoicePageDetails.Invoice.your_ref_name;
			}
		}


		id_dt.inv_cd['invoiceMethod'] = '';
		if(!$.isEmptyObject(id_dt.getInvoicePageDetails.DocumentMethod) && checkNull(id_dt.getInvoicePageDetails.DocumentMethod.method_name) != ''){
			id_dt.inv_cd['invoiceMethod'] = id_dt.getInvoicePageDetails.DocumentMethod.method_name;
		}

		id_dt.inv_cd['phone'] = '';

		if(checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_phone) != '' || checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_cellphone) != ''){

			if(checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_phone) != '' && checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_cellphone) != ''){
				id_dt.inv_cd['phone'] = id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_phone+', '+id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_cellphone;
			}
			else if(checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_phone) != ''){
				id_dt.inv_cd['phone'] = id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_phone;
			}
			else if(checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_cellphone) != ''){
				id_dt.inv_cd['phone'] = id_dt.getInvoicePageDetails.InvoiceDetail.your_ref_format_cellphone;
			}

		}

		var otherParams = {
			'draft_scheduled' : checkNull(id_dt.getInvoicePageDetails.Invoice.draft_scheduled),
			'returned_to_sender':checkNull(id_dt.getInvoicePageDetails.Invoice.returned_to_sender),
			'conflict':checkNull(id_dt.getInvoicePageDetails.Invoice.conflict),
			'invoice_gross':checkNull(id_dt.getInvoicePageDetails.Invoice.gross_amount,0),
			'credit_sum':checkNull(id_dt.getInvoicePageDetails.Invoice.credit_sum,0),
		};

		if(checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.system_do_not_send_reminders) == '' || checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.system_do_not_send_reminders) == "0"){
		 	var a = checkNull(invoice_details.getStatus(id_dt.getInvoicePageDetails.Invoice.internal_status,otherParams));
		 	if(checkNull(id_dt.last_reminder_level).trim() != ''){
		 		if(checkNull(id_dt.rmndr_lvl_str[id_dt.last_reminder_level]) != ''){
		 			a += '&nbsp;(' + id_dt.rmndr_lvl_str[id_dt.last_reminder_level] +')';
		 		}
		 		
		 	}
		 	

		 	id_dt.inv_cd['inv_status'] = a;

		}
		else{
			id_dt.inv_cd['inv_status'] = checkNull(invoice_details.getStatus(id_dt.getInvoicePageDetails.Invoice.internal_status,otherParams))+'&nbsp;('+id_td.Donotsendreminders+')';
		}
		id_dt.inv_cd['credit_memo'] = '';
		var test_status = checkNull(invoice_details.getStatus(id_dt.getInvoicePageDetails.Invoice.internal_status,otherParams));
		if(test_status == id_td.Partiallycredited || test_status == id_td.Credited){
			if("credit_number" in id_dt.getInvoicePageDetails.Invoice && checkNull(id_dt.getInvoicePageDetails.Invoice.credit_number) != '' ){
				var html = '';
				var d = [];
				if(Array.isArray(id_dt.getInvoicePageDetails.Invoice.credit_id)){
					
					for(var j in id_dt.getInvoicePageDetails.Invoice.credit_id){
						var da = id_dt.getInvoicePageDetails.Invoice.credit_id[j];
						d.push('<a style="color:#0d638f;text-decoration:none;" href="javascript:;" onclick="invoice_details.showcreditmemo('+da+')">'+id_dt.getInvoicePageDetails.Invoice.credit_number[j]+'</a>');
					}
				}
				else{
					d.push('<a style="color:#0d638f;text-decoration:none;" href="javascript:;" onclick="invoice_details.showcreditmemo('+id_dt.getInvoicePageDetails.Invoice.credit_id+')">'+id_dt.getInvoicePageDetails.Invoice.credit_number+'</a>');
				}
				var html = d.join();
				if(checkNull(html) != '' ){
					id_dt.inv_cd['credit_memo'] = html;
				}
			}
		}

		id_dt.inv_cd['registerloss'] = '';
		var int_status = id_dt.getInvoicePageDetails.Invoice.internal_status;
		if(checkNull(int_status) != '' && ( checkNull(int_status) == 1 || checkNull(int_status) == 2 || checkNull(int_status) == 4 || id_dt.getInvoicePageDetails.Invoice.returned_to_sender == 1 ) ){
			id_dt.inv_cd['registerloss'] = 'y';
		}


		id_dt.showresend = '';
		var test_ret = '';
		if(id_dt.getInvoicePageDetails.Invoice.returned_to_sender == true || id_dt.getInvoicePageDetails.Invoice.returned_to_sender == false){
			test_ret = '1';
		}
		if(type != 'customer' && test_ret === ' 1' && id_dt.getInvoicePageDetails.Invoice.conflict == 'n'){				
		}
		else{
			id_dt.showresend = 'y';
		}

		reminderopts = '';
		if("reminder_actions" in id_dt.getInvoiceResends && checkNull(id_dt.getInvoiceResends.reminder_actions) != ''){
			for(var j in id_dt.getInvoiceResends.reminder_actions){
				var vl = id_dt.getInvoiceResends.reminder_actions[j];

				if(vl == 'letter'){
					reminderopts += '<option value="Letter">'+id_td.Paymentreminder+'</option>';
				}
				else if(vl == 'collection warning'){
					reminderopts += '<option value="Collection Warning">' + id_td.Collectionwarning + '</option>';
				}
			}
		}

		id_dt.getInvoicePageDetails.Invoice['total'] = checkNull(id_dt.getInvoicePageDetails.Invoice.net_amount) -checkNull(id_dt.getInvoicePageDetails.Invoice.total_discount);

		try{
			id_dt.getInvoicePageDetails.Invoice.sales_fields = JSON.parse(id_dt.getInvoicePageDetails.Invoice.sales_fields);
		}
		catch(e){
			id_dt.getInvoicePageDetails.Invoice.sales_fields = {};
		}

		var template = document.getElementById('invoice_details_template').innerHTML;
		var compiledRendered = Template7(template, id_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		invoice_details.bindJs();
		invoice_details.bindEvents();
	},
	bindJs:function(){
		if(checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.system_do_not_send_reminders) == '' || checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.system_do_not_send_reminders) == "0"){
			var returnselopts = '<option value=""></option><option value="n">'+id_td.Returntosender+'</option><option value="y">'+id_td.Conflict+'</option><option value="do_not_send">'+id_td.Donotsendreminders+'</option>';
		}
		else{
			var returnselopts = '<option value=""></option><option value="n">'+id_td.Returntosender+'</option><option value="y">'+id_td.Conflict+'</option><option value="send">'+id_td.Sendreminders+'</option>';
		}
		

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Statusedit = function (options) {
		        this.init('statusedit', options, Statusedit.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Statusedit, $.fn.editabletypes.abstractinput);

		    $.extend(Statusedit.prototype, {
		     
		        render: function() {
		           	this.$textarea = this.$tpl.find('textarea');
		            this.$select = this.$tpl.find('select');
		            this.$select.change(function(){
		            	var v = $('#propertiesReturnStatus').val();
		            	if(v == 'y'){
		            		$('.conflict_note_area').show();
		            	}
		            	else{
		            		$('.conflict_note_area').hide();
		            	}
		            });
		            this.$select.select2({
		             	allowClear:true,
		            	placeholder:id_td.Select
		            });

		        },
		        value2html: function(value, element) {
		            // if(!value) {
		            //    $(element).empty();
		            //    return; 
		            // }
		        
		           	// var html = '';

		            // if(checkNull(value)!=''){
		            // 	html += '<p style="margin-bottom:0">'+$('<div>').text(value).html()+ '</p>';
		            // }
		            //$(element).html(html); 
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
					
		 
		       },           
		       input2value: function() { 
		           //return this.$input.filter('[name="dob"]').val();
		           return {
		              propertiesReturnStatus: this.$select.filter('[name="propertiesReturnStatus"]').val(), 
		              propertiesConflictNote: this.$textarea.filter('[name="propertiesConflictNote"]').val(),
		           };
		       },         
		       activate: function() {
		       		this.$input.filter('[name="propertiesReturnStatus"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Statusedit.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: `
		        	<div class="editable-address">
	        			<label>
	        				<select id="propertiesReturnStatus" name="propertiesReturnStatus" >`+returnselopts+`
	        				</select>
	        			</label>
        			</div>
        			<div class="editable-address conflict_note_area" style="display:none">
        				<label>
        					<textarea placeholder="`+id_td.Note+`" name="propertiesConflictNote" id="propertiesConflictNote"></textarea>
        				</label>
		       		</div>`,
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.statusedit = Statusedit;
		}(window.jQuery));
		
		var reminderopts = '';
		if("reminder_actions" in id_dt.getInvoiceResends && checkNull(id_dt.getInvoiceResends.reminder_actions) != ''){
			for(var j in id_dt.getInvoiceResends.reminder_actions){
				var vl = id_dt.getInvoiceResends.reminder_actions[j];

				if(vl == 'letter'){
					reminderopts += '<option value="Letter">'+id_td.Paymentreminder+'</option>';
				}
				else if(vl == 'collection warning'){
					reminderopts += '<option value="Collection Warning">' + id_td.Collectionwarning + '</option>';
				}
			}
		}
		
		var returnoptions = '<option value=""></option><option value="CR">'+id_td.Customerrequest+'</option><option value="RS">'+id_td.Returntosender+'</option><option value="SC">'+id_td.Sentforconvenience+'</option>';
		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Duedate = function (options) {
		        this.init('duedate', options, Duedate.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Duedate, $.fn.editabletypes.abstractinput);

		    $.extend(Duedate.prototype, {
		     
		        render: function() {
		        	this.$input = this.$tpl.find('input');
		           	this.$textarea = this.$tpl.find('textarea');
		            this.$select = this.$tpl.find('select');
		           	this.$tpl.find('select#reminder_level').select2({
		             	allowClear:true,
		            	placeholder:id_td.Reminderlevel
		            });

	            	this.$tpl.find('select#invoiceReason').select2({
		             	allowClear:true,
		            	placeholder:id_td.Reason
		            });
		        },
		        value2html: function(value, element) {
		            // if(!value) {
		            //    $(element).empty();
		            //    return; 
		            // }
		        
		           	// var html = '';

		            // if(checkNull(value)!=''){
		            // 	html += '<p style="margin-bottom:0">'+$('<div>').text(value).html()+ '</p>';
		            // }
		            //$(element).html(html); 
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
		       },           
		       input2value: function() { 
		           return {
		              due_date: this.$input.filter('[name="due_date"]').datepicker('getDate'), 
		              reminder_level: this.$select.filter('[name="reminder_level"]').val(),
		              invoiceReason: this.$select.filter('[name="invoiceReason"]').val(),
		           };
		       },         
		       activate: function() {
		       		this.$input.filter('[name="due_date"]').datepicker({
		       			format:id_dt.date_format_f,
		       		}).change(function(){
   						$('.datepicker').remove();
   					});
   					var d = moment(id_dt.getInvoicePageDetails.Invoice.due_date)._d;
   					this.$input.filter('[name="due_date"]').datepicker('setDate',d).datepicker('update')
   					
		       		//this.$input.filter('[name="due_date"]').focus();
		       		if(checkNull(reminderopts) == ''){
		       			$('.reminder_level_wrap').hide();
		       		}
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Duedate.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: `
		        	<div class="editable-address">
	        			<label>
	        				<input type="text" id="due_date" name="due_date" >
	        			</label>
        			</div>
        			`,
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.duedate = Duedate;
		}(window.jQuery));
		// <div class="editable-address reminder_level_wrap" >
		// 	<label>
		// 		<select id="reminder_level" name="reminder_level"><option value=""></option>`+reminderopts+`</select>
		// 	</label>
		// </div>
		// <div class="editable-address">
		// 	<label>
		// 		<select id="invoiceReason" name="invoiceReason">`+returnoptions+`</select>
		// 	</label>
  		//</div>
  		var returnoptions = '<option value=""></option><option value="CR">'+id_td.Customerrequest+'</option><option value="RS">'+id_td.Returntosender+'</option><option value="SC">'+id_td.Sentforconvenience+'</option>';
		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Reminderduedate = function (options) {
		        this.init('reminderduedate', options, Reminderduedate.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Reminderduedate, $.fn.editabletypes.abstractinput);

		    $.extend(Reminderduedate.prototype, {
		     
		        render: function() {
		        	this.$input = this.$tpl.find('input');
		           	this.$textarea = this.$tpl.find('textarea');
		            this.$select = this.$tpl.find('select');
		           	this.$tpl.find('select#reminder_level').select2({
		             	allowClear:true,
		            	placeholder:id_td.Appliesto
		            });

	            	this.$tpl.find('select#invoiceReason').select2({
		             	allowClear:true,
		            	placeholder:id_td.Reason
		            });
		        },
		        value2html: function(value, element) {
		            // if(!value) {
		            //    $(element).empty();
		            //    return; 
		            // }
		        
		           	// var html = '';

		            // if(checkNull(value)!=''){
		            // 	html += '<p style="margin-bottom:0">'+$('<div>').text(value).html()+ '</p>';
		            // }
		            //$(element).html(html); 
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
		       },           
		       input2value: function() { 
		           return {
		              due_date: this.$input.filter('[name="due_date"]').datepicker('getDate'), 
		              reminder_level: this.$select.filter('[name="reminder_level"]').val(),
		              invoiceReason: this.$select.filter('[name="invoiceReason"]').val(),
		           };
		       },         
		       activate: function() {
		       		this.$input.filter('[name="due_date"]').datepicker({
		       			format:id_dt.date_format_f,
		       		}).change(function(){
   						$('.datepicker').remove();
   					});
   					var d = moment(id_dt.last_reminder_due_date)._d;
   					this.$input.filter('[name="due_date"]').datepicker('setDate',d).datepicker('update')
   					
		       		//this.$input.filter('[name="due_date"]').focus();
		       		if(checkNull(reminderopts) == ''){
		       			$('.reminder_level_wrap').hide();
		       		}
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });


		    Reminderduedate.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: `
		        	<div class="editable-address">
	        			<label>
	        				<input type="text" id="due_date" name="due_date" >
	        			</label>
        			</div>
        			<div class="editable-address reminder_level_wrap" >
						<label>
							<select id="reminder_level" name="reminder_level"><option value=""></option><option value="inv">`+id_td.Invoice+`</option>`+reminderopts+`</select>
						</label>
					</div>
        			`,

		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.reminderduedate = Reminderduedate;
		}(window.jQuery));
	},
	bindEvents:function(){
		var html = '';

		for(var j in id_dt.getInvoicePageDetails.Invoice.sales_fields){
			var d = id_dt.getInvoicePageDetails.Invoice.sales_fields[j];
			d = d.toString();
			if(checkNull(d.trim()) == ''){
				continue;
			}
			d = d.replace('<','&lt');
			d = d.replace('>','&gt');

			html += `<ul class="unstyled lis"><li class="text-bold li_two_one">
						`+j+`: 
						</li>
						<li class="li_two_two">
							`+d+`
						</li></ul>`;
		}
		
		$('#custom_fields').html(html);

		notifications_v = {sms:id_td.SMS,email:id_td.Email,email_sms:id_td.EmailandSMS};
		if(id_dt.getNotesList.length <= 0){
			$('#invoice_note_counter').hide();
		}
		else{
			$('#invoice_note_counter').html(id_dt.getNotesList.length).show();
		}

		if(type != 'customer'){
			if("tab" in id_meta && checkNull(id_meta.tab) != ''){
				invoice_details.showTab(id_meta.tab);

			}
			else{
				invoice_details.showTab('transactions');
			}
			
		}
		else{
			if(checkNull(id_dt.reminder_invoice_balance,'') != ''){
				$('#tab_quote_2').removeClass('active');
				$('#tab_quote_1').show().addClass('active');
				invoice_details.showTab('payments');
			}
			else{
				invoice_details.showTab('transactions');
			}
		}
		var html = '';
		var anyonecheck = 0;
		var isanyonei = 0;
		var isanyoned = 0;
		var tax_details = {};
		for(var j in id_dt.getInvoicePageDetails.InvoiceProduct){
			var d = id_dt.getInvoicePageDetails.InvoiceProduct[j];
			
			if(checkNull(d.vat_percentage) != '' && checkNull(d.vat_percentage) != 0){
				if(d.vat_percentage in tax_details && checkNull(tax_details[d.vat_percentage]) != ''){
					tax_details[d.vat_percentage] = {
						vat :parseFloat(tax_details[d.vat_percentage]['vat']) + parseFloat(d.vat),
						amt :parseFloat(tax_details[d.vat_percentage]['amt']) + (parseFloat(d.gross_amount) - parseFloat(d.vat))
					}; 
					
				}
				else{
					tax_details[d.vat_percentage] = {
						vat:d.vat,
						amt:parseFloat(d.gross_amount) - parseFloat(d.vat)
					};
				}
				
			}

			html += '<tr>';
				html += '<td>';
					html += checkNull(d.product_number);
				html += '</td>';

				html += '<td>';
					html += checkNull(d.product_name);
				html += '</td>';

				if(id_dt.partnerSetting.enable_inventory == 'y'){
					html += '<td>';
						if( checkNull(d.location_name) != '' && isanyonei != 1){
							isanyonei = 1;
						}
						html += checkNull(d.location_name);
					html += '</td>';
				}
				else{
					html += '<td></td>';
					isanyonei == 1;
				}
				

				html += '<td>';
					html += convertIntoLocalFormat(checkNull(d.qty));
				html += '</td>';

				html += '<td>';
					html += checkNull(d.unit);
				html += '</td>';

				html += '<td style="text-align:right">';
					html += convertIntoLocalFormat(checkNull(d.unit_price));
				html += '</td>';

				html += '<td style="text-align:right">';
					html += convertIntoLocalFormat(checkNull(d.unit_price,0) * checkNull(d.qty,0) );
				html += '</td>';

				if(id_dt.partnerSetting.vat_required == 'y'){
					html += '<td >';
						html += checkNull(d.vat_percentage,0)+ '%';
					html += '</td>';

					html += '<td style="text-align:right">';
						html += convertIntoLocalFormat(checkNull(d.vat,0));
					html += '</td>';
				}
				else{
					html += '<td style="display:none"></td><td style="display:none"></td>';
				}

				html += '<td style="text-align:right">';
					if(checkNull(d.discount) != 0 && checkNull(d.discount) != '' && isanyoned != 1){
						isanyoned = 1;
					}
					html += convertIntoLocalFormat(checkNull(d.discount));
				html += '</td>';				

				html += '<td style="text-align:right" class="az">';
					html += convertIntoLocalFormat(checkNull(d.total_amount));
				html += '</td>';
				
				html += '<td class="checklist_hide">';
					if("answers" in d && checkNull(d.answers) != '' && checkNull(d.answers.ignore) == ''){
						anyonecheck++;
						html += '<a class="btn mini blue-stripe" href="javascript:;" onclick="invoice_details.showCheck('+d.partner_list_id+','+d.id+')"><i class="icon-eye-open"></i> '+id_td.View+'</a>';
					}
				html += '</td>';	
			html += '</tr>';
		}

		console.log('tax_details',tax_details);
		console.log('isanyoned',isanyoned);
		console.log('isanyonei',isanyonei);

		$('#product_lines tbody').html(html);
		
		if(id_dt.partnerSetting.vat_required != 'y'){
			$('.tax_hide').hide();
		}

		if(id_dt.partnerSetting.enable_inventory != 'y'){
			$('.loc_hide').hide();
		}

		if(isanyoned == 0){
			$('#product_lines th:nth-child(10),#product_lines td:nth-child(10)').hide()
		}
		if(isanyonei == 0){
			$('#product_lines th:nth-child(3),#product_lines td:nth-child(3)').hide()
		}

		if(id_dt.checkListCount == 0 || anyonecheck == 0){
			$('.checklist_hide').hide();
		}

		//tax details
		var taxhtml = `
			<table class="table table-striped table-hover" style="margin:0;">
				<thead>
					<th class="text-left">`+id_td.$vat_spec+`</th>
					<th class="text-right">`+id_td.Rate+`</th>
					<th class="text-right">`+id_td.Baseamount+`</th>
					<th class="text-right">`+id_td.MVA+`</th>
				</thead>
			`;
		for(var j in tax_details){
			taxhtml += '<tr>';
				taxhtml += '<td class="text-left">'+id_td.Outgoingvat+'</td>';
				taxhtml += '<td class="text-right">'+j+'%</td>';
				taxhtml += '<td class="text-right">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(tax_details[j]['amt']))+'</td>';
				taxhtml += '<td class="text-right">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(tax_details[j]['vat']))+'</td>';
			taxhtml += '</tr>';
		}
		taxhtml += '</table>';
		if(!$.isEmptyObject(tax_details)){
			$('.tax_summary').prepend(taxhtml);
		}
		else{
			$('.tax_summary').hide();
			$('.summary_block div:first').css('display','block');
			$('.summary_block').removeClass('well');
			$('table.calculations').parent().addClass('well');
		}
		
		//tax details


		var delivery_methods = [{text:'',value:''}];
		var default_str = '';
		for(var j in id_dt.deliveryMethods){
			var d = id_dt.deliveryMethods[j];
			var id = j+'##'+d.value;
			var name = d.value;
			delivery_methods.push({
				text:name,
				value:id
			});
			
			if(id_dt.getInvoicePageDetails.InvoiceDetail.delivery_method == j){
				default_str = id;
			}
		}
		if(id_dt.partnerSetting.enable_delivery_method == 'n'){
			default_str = '';
			$('#delivery_methods').parent().parent().parent().parent().hide();
		}

		$("#delivery_methods").editable({
	       	value: default_str,  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:false,
        	send: 'never',
	        emptytext: id_td.None,
	        source:delivery_methods,
	        select2: {
	        	placeholder:id_td.Select,
				minimumResultsForSearch: -1,
				allowClear:true
			},
	        success: function(data, newValue) {
	        	invoice_details.update(newValue);
	        }
	    });

	    if(checkNull(default_str) != '') {
			var arr = default_str.split('##');
			var v = arr[0];
			var delMethod = id_dt.deliveryMethods[v];
			var internal_name = delMethod.internal_name;
			if(internal_name.toLowerCase() == 'email') {
				$('.delivery_name,.tracking_num').hide();
			}else {
				$('.delivery_name,.tracking_num').show();
			}
			if(delMethod.is_tracking){
				$('.tracking_num').show();
			}else{
				$('.tracking_num').hide();	
			}
		}
		else{
			$('.delivery_name,.tracking_num').hide();
		}

	    $('#tracking_num_a').editable({
			emptytext:id_td.Empty,
	       	value: checkNull(id_dt.getInvoicePageDetails.Invoice.tracking_num),  
	       	mode:'inline',  
	       	send: 'never',
	       	type: 'text',
	       	inputclass: '',
	       	showbuttons:'right',
	        success: function(data, config) {
	        	invoice_details.updateTrackingNo(config);
	   		},
		});

	    if(type != 'customer'){
			if(checkNull(reminderopts) != ''){
				$('.reminder_due_date').show();
				$('.inv_due_date').html(id_dt.inv_cd.due_date);
				var last_reminder_due_date = convertDateIntoSiteFormat(checkNull(id_dt.last_reminder_due_date));
				$('.inv_reminder_due_date_str').html(last_reminder_due_date);
			}
			else{
				$('.reminder_due_date').hide();
			}
		}
	},
	showCustomer:function(customer_id){
		if(checkNull(customer_id) == ''){
			customer_id = id_dt.getInvoicePageDetails.Invoice.receiver_id;
		}
		new_custom_main_page2('/'+type +'/'+'customers/details/'+customer_id,'all_customers','all_customers','customer_details',{customer_id:customer_id});
	},
	getStatus:function(inv_status='',other_params = {}){
		
		if(checkNull(inv_status) == ''){
			//
			
		}
		var draft_scheduled = checkNull(other_params.draft_scheduled);
		var returned_to_sender = checkNull(other_params.returned_to_sender);
		var conflict = checkNull(other_params.conflict);
		var invoice_gross = checkNull(other_params.invoice_gross);
		var credit_sum = checkNull(other_params.credit_sum);
		

		if(returned_to_sender == '1' && conflict == 'n'){
			is_inv_return = 'y';
			return  '<font color=red >'+id_td.Returntosender+'<br /></font>';
		}
		else if(returned_to_sender == '1' && conflict == 'y'){
			is_inv_conflict = 'y';
			return '<font color=red >'+id_td.Conflict+'<br /></font>';
		}
		
		if(type != 'customer'){
			var inv_status_arr = {
				0:id_td.Draft,
				1:'<font color=red >'+id_td.Notpaid + '</font>',
				2:'<font color=green >'+id_td.Partiallypaid + '</font>',
				3:'<font color=green >'+id_td.Paid + '</font>',
				4:id_td.Partiallycredited,
				5:id_td.Credited,
				6:id_td.Lost,
				7:id_td.$loss_pp,
				8:id_td.Losspaid,
				9:id_td.$loss_pc,
				10:id_td.Losscredited,
				11:id_td.Recoveredfromloss,
				12:id_td.Scheduled,
			};
		}
		else{
			var inv_status_arr = {
				0:id_td.Draft,
				1:'<font color=red >'+id_td.Notpaid + '</font>',
				4:'<font color=red >'+id_td.Notpaid + '</font>',
				6:'<font color=red >'+id_td.Notpaid + '</font>',
				2:'<font color=green >'+id_td.Partiallypaid + '</font>',
				7:'<font color=green >'+id_td.Partiallypaid + '</font>',
				5:'<font color=green >'+id_td.Paid + '</font>',
				3:'<font color=green >'+id_td.Paid + '</font>',
				8:'<font color=green >'+id_td.Paid + '</font>',
			};
		}
		

		return checkNull(inv_status_arr[inv_status]);
		
		var inv_status_arr = {
			draft_invoice:id_td.Draft,
			not_paid:'<font color=red >'+id_td.Notpaid + '</font>',
			partially_paid:'<font color=green >'+id_td.Partiallypaid + '</font>',
			fully_paid:'<font color=green >'+id_td.Paid + '</font>',
			partially_credited:id_td.Partiallycredited,
			fully_credited:id_td.Credited,
			loss:id_td.Lost,
			loss_partially_paid:id_td.$loss_pp,
			loss_fully_paid:id_td.Losspaid,
			loss_partially_credited:id_td.$loss_pc,
			loss_fully_credited:id_td.Losscredited,
			recovered_from_loss:id_td.Recoveredfromloss,
			scheduled:id_td.Scheduled,
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
	showCheck:function(list_id,line_key){
		var url = base_url + 'quotes/showChecklists/'+list_id+'?line_key='+line_key;
		var a = document.createElement('div');
		$(a).attr('data-url',url);
		$(a).attr('data-width','700px');
		show_modal(a,'popups');
	},
	showTab:function(frm=''){
		$('.custom_tabs').removeClass('active');
		if(frm == 'transactions'){
			$('.transactions_tab').addClass('active');
			invoice_details.generateTransactions(id_dt.getTransactionList);
		}
		else if(frm == 'notes'){
			$('.notes_tab').addClass('active');
			invoice_details.generateNoteList(id_dt.getNotesList);
		}
		else if(frm == 'payments'){
			$('.payments_tab').addClass('active');
			invoice_details.generatepayments();
		}
		else if(frm == 'reminders'){
			// $('.reminders_tab').addClass('active');
			// var pr = [];
			// if(checkNull(id_dt.invoiceHistoryList) != '' && id_dt.invoiceHistoryList.length != 0){
			// 	pr = id_dt.invoiceHistoryList;
			// }
			// invoice_details.generateReminders(pr);
			invoice_details.getHistory('reminders');
		}
		else if(frm == 'history'){
			// $('.history_tab').addClass('active');
			// var pr = [];
			
			// if(checkNull(id_dt.getResendHistoryList) != '' && id_dt.getResendHistoryList.length != 0){
			// 	pr = id_dt.getResendHistoryList;
			// }
			// invoice_details.generateHistoryList(pr);
			invoice_details.getHistory('history');
		}
		else if(frm == 'installments'){
			invoice_details.getInstallments();
			if("tab" in id_meta && checkNull(id_meta.tab) != ''){
				$([document.documentElement, document.body]).animate({
				    scrollTop: $('li[data-name="installments"]').offset().top
				});
			}
		}
	},
	getHistory:function(from){
		var total_params = {
			invoice_id:id_dt.getInvoicePageDetails.Invoice.id,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			from:from
		};

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/invoices/invoiceHistory.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				
				if(from == 'reminders'){
					$('.reminders_tab').addClass('active');
					var pr = [];
					if(checkNull(complet_data.response.response.invoiceHistoryList) != '' && complet_data.response.response.invoiceHistoryList.length != 0){
						pr = complet_data.response.response.invoiceHistoryList;
					}
					invoice_details.generateReminders(pr);
				}
				else if(from == 'history'){
					$('.history_tab').addClass('active');
					var pr = [];
					if(checkNull(complet_data.response.response.getResendHistoryList) != '' && complet_data.response.response.getResendHistoryList.length != 0){
						pr = complet_data.response.response.getResendHistoryList;
					}
					invoice_details.generateHistoryList(pr);	
				}
						
							
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	generateHistoryList:function(data=[]){

		var html = '<div class="portlet">';
			html += '<div class="portlet-body profile" id="order_new_temp_line">';
				
				if(data.length != 0){
					html += '<div class="table-responsive">';
						html += '<table class="table table-striped table-bordered table-hover no-more-tables" id="reminders_table">';
							html += '<thead>';
								html += '<tr>';
									html += '<th>'+id_td.Date+'</th>';
									html += '<th>'+id_td.Action+'</th>';
									html += '<th>'+id_td.Staffer+'</th>';
									html += '<th>'+id_td.Reason+'</th>';
								html += '</tr>';
							html += '</thead>';
							html += '<tbody>';
							for(var j in data){
								var ir = data[j].InvoiceResend;
								html += '<tr>';
									html += '<td>'+convertDateIntoSiteFormat(checkNull(ir.log_date))+'</td>';
									html += '<td>'+checkNull(ir.distribution_method,'-')+'</td>';

									var name = '';
									for(var g in id_dt.getPartnerContactList){
										if(id_dt.getPartnerContactList[g].login_id == checkNull(ir.source)){
											name = id_dt.getPartnerContactList[g].name;
											name = name.trim();
										}
									}
									html += '<td>'+checkNull(name,'-')+'</td>';
									if(checkNull(ir.conflict_text).trim() != ''){
										html += '<td  style="max-width:30px"><a class="btn mini blue-stripe" href="javascript:;" onclick="invoice_details.generatePop(\''+ir.conflict_text+'\')"><i class="icon-eye-open"></i>&nbsp;'+id_td.Moreinfo+'</a></td>';
									}
									else if(checkNull(ir.reason) != 'show'){
										html += '<td>-</td>';
									}
									else{
										html += '<td>-</td>';
									}
								html += '</tr>';
							}
							html += '</tbody>';
						html += '</table>';
					html += '</div>';
				}
				else{
					html += '<div class="alert alert-error" style="text-align:center;">'+id_td.Norecordfound+'</div>';
				}
			html += '</div>';
		html += '</div>';
		$('#invoice_tab_content').html(html);
	},
	generatePop:function(str){
		var popup = 'popups';

		var html = '<div class="modal-header">';
			html += '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>';
			html += '<h3>'+ id_td.Note +'</h3>';
		html += '</div>';

		html += '<div class="modal-body">';
			html += '<div class="row-fluid">';
				html += '<div class="span12">';
					html += '<div class="portlet-body form">';
						html += '<form action="/" class="form-horizontal form-view" style="margin-bottom:0px;" id="pernote_add_form" method="post" accept-charset="utf-8">';

							html += '<div class="control-group">';
								//html += '<label class="control-label">'+id_td.Note+'</label>';	
								html += '<div class="controls" style="padding-top:5px;text-align: justify;margin-top: 2px;">';
									html += str;
								html += '</div>';
							html += '</div>';

						html += '</form>';
					html += '</div>';
				html += '</div>';
			html += '</div>';
		html += '</div>';

		$('#'+popup).html(html);

		$('#'+popup).modal().on("hidden", function() {
			$('#'+popup).empty();
		});
	},
	generateReminders:function(data=[]){
		
		var html = '<div class="portlet">';
			html += '<div class="portlet-body profile" id="order_new_temp_line">';

				if(data.length != 0){
					html += '<div class="table-responsive">';
						html += '<table class="table table-striped table-bordered table-hover no-more-tables" id="reminders_table">';
							html += '<thead>';
								html += '<tr>';
									html += '<th><i class="icon-time"></i> '+id_td.Date+'</th>';
									html += '<th>'+id_td.Type+'</th>';
									html += '<th>'+id_td.Copy+'</th>';
									html += '<th>'+id_td.Address+'</th>';
									html += '<th><i class="icon-money"></i> '+id_td.Invoicebalance+'</th>';
									html += '<th>'+id_td.KID+'</th>';
									html += '<th><i class="icon-time"></i> '+id_td.Duedate+'</th>';		
									html += '<th> '+id_td.Other+'</th>';
									html += '<th>'+id_td.View+'</th>';


								html += '</tr>';
							html += '</thead>';
							html += '<tbody>';
								for(var j in data){
									var ih = data[j].InvoiceHistorie;

									var z = data[j][0];
									html += '<tr>';
										html += '<td>'+convertDateIntoSiteFormat(checkNull(ih.log_date))+'</td>';
										html += '<td>';
											//if(checkNull(cr.type) == 'invoice'){
												//
												//html += checkNull(ih.distribution_method);
												if(checkNull(id_dt.rmndr_lvl_str[ih.reminder_level_id]) != ''){
													html += checkNull(id_dt.rmndr_lvl_str[ih.reminder_level_id]);
												}
												else{
													html += checkNull(ih.distribution_method);
												}
												
											//}
										html += '</td>';

										html += '<td>';
											if(ih.type_doc == 'copy'){
												html += '<i class="check-new"></i>';
											}
										html += '</td>';

										html += '<td>';
											if(checkNull(ih.reminder_address) != ''){
												html += checkNull(ih.reminder_address);
											}
											else{
												if(checkNull(ih.address1) != '' || checkNull(ih.address2) != ''){
													html += checkNull(ih.address1)+' ' + checkNull(ih.address2);
												}
												if(checkNull(ih.zip) != '' || checkNull(ih.city) != ''){
													html += '<br/>' + checkNull(ih.zip) + ' ' + checkNull(ih.city);
												}
												if(checkNull(ih.company_email) != ''){
													html += checkNull(ih.company_email);
												}
											}
										html += '</td>';
											html += '<td>'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(ih.invoice_balance))+'</td>';

											html += '<td>' + checkNull(ih.kid,'-') + '</td>';

											html += '<td>'+convertDateIntoSiteFormat(checkNull(ih.due_date))+'</td>';

											html += '<td>' + checkNull(ih.reason,'-') + '</td>';
										
											html += '<td>';
									
											if(checkNull(z.edit_mail) != ''){
												html += '<a onclick="show_modal(this,\'popups\');" data-width="760" data-url="/partner/settings/editemailcontent/'+z.edit_mail+'?from=invoice" class="purple-stripe btn mini"><i class="icon-edit"></i>&nbsp;'+ id_td.Edit+'</a>';
											}
											else if(checkNull(ih.pdf_info) != ''){
												var pdf_info = JSON.parse(ih.pdf_info);
												if(!$.isEmptyObject(pdf_info)){
													
													var dd = ih.pdf_info;
													dd = dd.replace(/\"/g,"'");
													html += '<a class="btn mini" onclick="invoice_details.showReminderPdf('+dd+')"><i class="icon-user"></i> '+id_td.View+'</a>';
												}
												else{
													html += '-';
												}
												
											}
											else{
												if(checkNull(ih.reminder_id) != ''){
													html += '<a class="btn mini" onclick="invoice_details.generateReminderPdf('+ih.reminder_id+')"><i class="icon-user"></i> '+id_td.View+'</a>';
												}
												else{
													html += '-';
												}
											}
												
											html += '</td>';
										

									html += '</tr>';
								}
							html += '</tbody>';
						html += '</table>';
					html += '</div>';
				}
				else{
					html += '<div class="alert alert-error" style="text-align:center;">'+id_td.Norecordfound+'</div>';
				}
			html += '</div>';
		html += '</div>';
		$('#invoice_tab_content').html(html);
	},
	showReminderPdf:function(d){
		if(checkNull(d.pdf) != ''){
			if(checkNull(d.pdf.pdf_file_name) != ''){
				var di = d.pdf.pdf_dir;
				di = btoa(di);
				openPdf(APISERVER+'/api/downloads/report/'+di+'.json');
			}					
		}
	},
	editEmail:function(edit_mail){
	
		var a = document.createElement('div');
		var url = base_url + 'settings/editemailcontent/'+edit_mail+'?from=invoice';
		$(a).attr('data-url',url);
		$(a).attr('data-width','700px');
		show_modal(a,'popups');
	},
	generateReminderPdf:function(reminder_id=''){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			reminder_id:reminder_id,

		}

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Invoices/generate_reminder_pdf.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
	
			if(complet_data.response.status == 'success'){
				var d = complet_data.response.response;


				if(checkNull(d.pdf) != ''){
					if(checkNull(d.pdf.pdf_file_name) != ''){
						var di = d.pdf.pdf_dir;
						di = btoa(di);
						openPdf(APISERVER+'/api/downloads/report/'+di+'.json');
					}					
				}
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	generatepayments:function(){
		var html = '<div class="row-fluid">';
			html += '<div class="span6">';
				html += '<ul class="unstyled">';
					html += '<li>';
						html += '<table>';
							if("reminder_action" in id_dt.getInvoicePageDetails.InvoiceDetail && checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.reminder_action) != ''){
								html += '<tr>';
									html += '<td><strong>'+id_td.Reminderstatus+':</strong></td>';
									html += '<td></td>';
									html += '<td>'+id_dt.getInvoicePageDetails.InvoiceDetail.reminder_action+'</td>';
								html += '</tr>';
							}

							html += '<tr>';
								html += '<td><strong>'+id_td.Outstandingbalance+':</strong></td>';
								html += '<td></td>';
								html += '<td>'+convertIntoLocalFormat(checkNull(id_dt.reminder_invoice_balance))+'</td>';
							html += '</tr>';

							html += '<tr>';
								html += '<td><strong>'+id_td.Paytoaccount+':</strong></td>';
								html += '<td></td>';
								html += '<td>'+checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.partner_bank_account)+'</td>';
							html += '</tr>';

							html += '<tr>';
								html += '<td><strong>'+id_td.KID+':</strong></td>';
								html += '<td></td>';
								html += '<td>'+checkNull(id_dt.reminder_kid	)+'</td>';
							html += '</tr>';

							html += '<tr>';
								html += '<td><strong>'+id_td.Duedate+':</strong></td>';
								html += '<td></td>';
								html += '<td>'+convertDateIntoSiteFormat(checkNull(id_dt.getInvoicePageDetails.Invoice.due_date))+'</td>';
							html += '</tr>';

						html += '</table>';
					html += '</li>';
				html += '</ul>';
			html += '</div>';
		html += '</div>';
		$('#invoice_tab_content').html(html);
	},
	generateTransactions:function(data){
		var html = '<div class="portlet">';
			html += '<div class="portlet-body " id="order_new_temp_line">';
				html += '<table class="table table-striped table-hover" style="margin-top:10px;">';
					html += '<thead class="">';
						html += '<tr>';
							html += '<th style="text-align:left !important;width:10%">'+id_td.$srno+'</th>';
							html += '<th style="text-align:left !important;">'+id_td.Date+'</th>';
							html += '<th style="text-align:left !important;width:20%">'+id_td.Type+'</th>';
							html += '<th style="text-align:left !important;width:30%">'+id_td.Description+'</th>';
							html += '<th style="text-align:right !important;">'+id_td.Amount+'</th>';
							html += '<th class="hidden-phone">&nbsp;</th>';
						html += '</tr>'; 
					html += '</thead>';
					html += '<tbody>';
						var cc = 0;
						for(var k in data){
						
							var j = data[k].j;
							var v = data[k][0];
							if(j.transaction_type_text == 'LO' && type == 'customer'){
								continue;
							}
							html += '<tr class="gradeX">';
								html += '<td>'+ ++cc +'</td>';
								html += '<td>'+ convertDateIntoSiteFormat(checkNull(j.DATE)) +'</td>';
								html += '<td>';
									if(j.transaction_type_text == 'RF'){
										html += checkNull(id_td[j.transaction_type_text] == '')?j.transaction_type_text:id_td[j.transaction_type_text];
									}
									else if(j.transaction_type == 'M'){
										html += id_td.ManualEntry;
									}
									else{
										html += checkNull(id_td[j.transaction_type] == '')?j.transaction_type:id_td[j.transaction_type];
									}
								html += '</td>';

								html += '<td>';
									if(checkNull(v.customer_account_number) != ''){
										var acc_no = v.customer_account_number.split(':');
										if(v.customer_account_number.indexOf(':') !== false && v.customer_account_number.indexOf(':') != -1){
											
											html += id_td.Paidby + ' ' + checkNull(acc_no[1]) + ', '+formatBankAccount(checkNull(acc_no[0]),checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.partner_country));
										}
										else{
											html += id_td.Paidfrom + ' ' + formatBankAccount(checkNull(acc_no[0]),checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.partner_country));
										}
									}
									else{
										if("jl" in data[k] && checkNull(data[k].jl.description) != ''){
											html += data[k].jl.description;
										}
										else{
											if(j.transaction_type_text == 'RF'){
												html += checkNull(id_td[j.transaction_type_text] == '')?j.transaction_type_text:id_td[j.transaction_type_text];
											}
											else if(j.transaction_type == 'M'){
												html += id_td.ManualEntry;
											}
											else{
												html += checkNull(id_td[j.transaction_type] == '')?j.transaction_type:id_td[j.transaction_type];
											}
										}
									}
								html += '</td>';
								html += '<td style="text-align:right;">'+CUR_SYM+' '+ convertIntoLocalFormat(checkNull(j.amount)) +'</td>';

								html += '<td>';
									if(j.transaction_type == 'B' || j.transaction_type == 'M'){
										html += '<a class="btn mini blue-stripe" style="cursor:pointer" onclick="invoice_details.showPopup('+checkNull(id_dt.getInvoicePageDetails.Invoice.id,0)+','+checkNull(id_dt.getInvoicePageDetails.Invoice.receiver_id,0)+','+checkNull(j.id,0)+','+checkNull(j.amount,0)+')">';
											html += '<i class="icon-pencil"></i>&nbsp;';
											html += id_td.Linktoadifferentinvoice;
										html += '</a>';
									}
									var url  = base_url + 'customers/show_journal_line/'+checkNull(j.id) + '/' + checkNull(id_dt.getInvoicePageDetails.Invoice.receiver_id) + '/' + checkNull(j.transaction_number) + '/' +  checkNull(j.transaction_type) + '/' + id_td.Invoice+ ' ' + checkNull(id_dt.getInvoicePageDetails.Invoice.invoice_number)+'?from=newinvoice';


									html += '<a class="btn mini blue-stripe" onclick=";show_modal(this,&quot;popups&quot;);" data-width="1000" data-url="'+url+'"><i class="icon-eye-open"></i>'+id_td.View+'</a>';

								html += '</td>';

							html += '</tr>';
						}
					html += '</tbody>';
				html += '</table>';
			html += '</div>';
		html += '</div>';

		$('#invoice_tab_content').html(html);
	},
	generateNoteList:function(data){
		var html = '<div class="portlet">';					
			html += '<div class="portlet-body " id="order_new_temp_line">';
				html += '<div class="row-fluid"><div class="span12 text-right">';
					html += '<button class="btn purple" onclick="invoice_details.addnote();"><i class="icon-plus"></i> '+id_td.Addnote+'</button>';
				html += '</div></div>';
				html += '<div class="alert alert-error text-center invoice_note_empty" style="display:none">'+id_td.Norecordfound+'</div>';
				html += '<table id="invoice_notes" class="table table-striped table-hover" style="margin-top:10px;">';
					html += '<thead class="">';
						html += '<tr>';
							html += '<th class="span2" style="text-align:left !important;width:10%">'+id_td.Noteby+'</th>';
							html += '<th class="span10" style="text-align:left !important;">'+id_td.Note+'</th>';
							html += '<th class="span2" style="text-align:left !important;width:20%">'+id_td.Action+'</th>';
						html += '</tr>'; 
					html += '</thead>';
					html += '<tbody>';
						for(var j in data){
							var n = data[j].Note;
							html += '<tr data-id="'+n.id+'">';
								html += '<td class="span2">';
									html += '<p>';
										html += '<b>'+n.added_by+'</b><br/>';
										html += '<i>('+convertDateIntoSiteFormat(checkNull(n.updated_at));
											html += '&nbsp'+moment(checkNull(n.updated_at)).format('hh:mm')+')</i>';
									html += '</p>';
								html += '</td>';

								html += '<td class="span10">';
									html += checkNull(n.note_text);
								html += '</td>';

								html += '<td class="span2">';
									var nn = JSON.stringify(n).replace(/\"/g, "'");
									html += '<a class="btn mini red-stripe" onclick="invoice_details.deleteNote('+nn+')"><i class="icon-remove"></i> '+id_td.Delete+'</a>';
								html += '</td>';
							html += '</tr>';
						}
					html += '</tbody>';
				html += '</table>';
			html += '</div>';
		html += '</div>';
		$('#invoice_tab_content').html(html);
		inv_table = $('#invoice_notes').DataTable({
 		 	"pagingType": "input",
 		 	"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",

 		 	"language": {
			"lengthMenu": 
		           id_td.View+ ' <select>'+
		             '<option value="10">10</option>'+
		             '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		             '<option value="40">40</option>'+
		             '<option value="50">50</option>'+
		             '<option value="-1">All</option>'+
		             '</select> '+ id_td.records + ' |  '
		         ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':id_td.of,
					'Page':id_td.Page,
				},
				
				"info": id_td.Foundtotal+" _TOTAL_ "+id_td.records
			},
	 	});
	 	invoice_details.bindNotesTable();	
	},
	bindNotesTable:function(){
		if($('#invoice_notes .dataTables_empty').length == 1){
			$('.invoice_note_empty').show();
			$('#invoice_notes').hide();
			$('#invoice_notes_info').hide();
		}
		else{
			$('.invoice_note_empty').hide();
			$('#invoice_notes').show();
			$('#invoice_notes_info').show();
		}
		if(id_dt.getNotesList.length <= 0){
			$('#invoice_note_counter').hide();
		}
		else{
			$('#invoice_note_counter').html(id_dt.getNotesList.length).show();
		}
	},
	showPopup:function(invoice_id,customer_id,journal_id,amount){
		var url = base_url + 'invoice/pay_to_other_invoice?invoice_id='+invoice_id + '&customer_id='+customer_id+'&journal_id='+journal_id+'&amount='+amount+'&request_from=invoice_details&from=newinvoice';
		var a = document.createElement('div');
		$(a).attr('data-url',url);
		$(a).attr('data-width','800px');
		show_modal(a,'popups1');
	},
	deleteNote:function(d){
		var yes = function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				note_id:d.id,
				note_type:d.note_type,
				note_base_id:d.note_base_id,
			}

			var params = $.extend({}, doAjax_params_default);
			params['requestType'] = 'POST';
			params['url'] = APISERVER+'/api/Notes/deleteNote.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',id_td.Success,complet_data.response.response.msg);
				inv_table.$('tr').each(function(i){
		   			var data_id = $(this).attr('data-id');
		   			if(data_id == d.id){
		   				inv_table.row(this).remove().draw();
		   				return false;
		   			}
				});

				for(var j in id_dt.getNotesList){
					if(id_dt.getNotesList[j].Note.id == d.id){
						id_dt.getNotesList.splice(j,1);
						break;
					}
				}
				invoice_details.bindNotesTable();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;

		};
		var no = function(){};
			showDeleteMessage(id_td.$del_note,id_td.Confirmation,yes,no,'ui-dialog-blue',id_td.Delete,id_td.Cancel);	
	},
	print_pdf:function(invoice_id = ''){
		if(checkNull(invoice_id) == ''){
			invoice_id = id_dt.getInvoicePageDetails.Invoice.id;
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			invoice_id:invoice_id,
			sender_id:partner_id,
		}

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Invoices/generateInvoicePdf.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
	
			if(complet_data.response.status == 'success'){
				var d = complet_data.response.response;


				if(checkNull(d.pdf) != ''){
					if(checkNull(d.pdf.pdf_file_name) != ''){
						var di = d.pdf.pdf_dir;
						di = btoa(di);
						openPdf(APISERVER+'/api/downloads/report/'+di+'.json');
					}					
				}
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	genPopup:function(frm){
		var a = document.createElement('div');
		if(frm == 'propertyandhistory'){
			var url = base_url + 'invoice/properties_history/'+id_dt.getInvoicePageDetails.Invoice.id+'?from=newinvoice';
			$(a).attr('data-url',url);
			$(a).attr('data-width','700px');
			show_modal(a,'popups1');
		}
		else if(frm == 'payment'){

			var sel_inv = id_dt.getInvoicePageDetails.Invoice.id + '::'+id_dt.getInvoicePageDetails.Invoice.receiver_id;
			var url = base_url + 'invoice/register_payment/'+id_dt.getInvoicePageDetails.Invoice.id+'?from=newinvoice&single_sel=y&from_invoice_details=y&selectedinvoice[]='+sel_inv;
			$(a).attr('data-url',url);
			$(a).attr('data-width','600px');
			show_modal(a,'popups');
		}
		else if(frm == 'duplicate'){
			var url = base_url + 'invoice/transfer?invoice_id='+id_dt.getInvoicePageDetails.Invoice.id+'&request_from=invoice_details&tab=popups1';
			$(a).attr('data-url',url);
			$(a).attr('data-width','600px');
			show_modal(a,'popups1');
		}
		else if(frm == 'refund'){
			var journal_id = id_dt.getInvoicePageDetails.Invoice.journal_id;
			var receiver_id = id_dt.getInvoicePageDetails.Invoice.receiver_id;
			var inv_id = id_dt.getInvoicePageDetails.Invoice.id;

			var url = base_url + 'invoice/refund_payments/'+id_dt.getInvoicePageDetails.Invoice.id+'?from=newinvoice&invoice_id='+inv_id+'&from_invoice_details=y&journal_id='+journal_id+'&receiver_id='+receiver_id;
			$(a).attr('data-url',url);
			$(a).attr('data-width','700px');
			show_modal(a,'popups');
		}
		else if(frm == 'resend'){
			var url = base_url + 'invoice/resend_invoice?invoice_id='+id_dt.getInvoicePageDetails.Invoice.id+'&from_invoice_details=y';
			$(a).attr('data-url',url);
			$(a).attr('data-width','730px');
			show_modal(a,'popups');

		}
	},
	showcreditmemo:function(id){
		window.location.href = base_url + 'invoice/credit_memo_details/'+id;
	},
	duplicate:function(){
		var save_params = {
			sales_id:'',
			partner_id:partner_id,
			customer_id:id_dt.getInvoicePageDetails.Invoice.receiver_id,
			your_ref:id_dt.getInvoicePageDetails.Invoice.your_ref,
			reference_contact_id:id_dt.getInvoicePageDetails.Invoice.reference_contact_id,
			description:'',
			sales_date:moment().format('YYYY-MM-DD'),
			customer_name:id_dt.getInvoicePageDetails.InvoiceDetail.company_name,
			customer_number:id_dt.getInvoicePageDetails.InvoiceDetail.customer_number,
			delivery_name:id_dt.getInvoicePageDetails.InvoiceDetail.delivery_name,
			delivery_address1:id_dt.getInvoicePageDetails.InvoiceDetail.delivery_address1,
			delivery_address2:id_dt.getInvoicePageDetails.InvoiceDetail.delivery_address2,
			delivery_zip:id_dt.getInvoicePageDetails.InvoiceDetail.delivery_zip,
			delivery_city:id_dt.getInvoicePageDetails.InvoiceDetail.delivery_city,
			delivery_country:id_dt.getInvoicePageDetails.InvoiceDetail.company_country,
			delivery_phone:id_dt.getInvoicePageDetails.InvoiceDetail.delivery_phone,
			delivery_phone_code:id_dt.getInvoicePageDetails.InvoiceDetail.delivery_phone_code,
			company_email:id_dt.getInvoicePageDetails.InvoiceDetail.company_email,
			customer_ein:'',
			due_date:'',
			currency_id:id_dt.getInvoicePageDetails.Invoice.currency_id,
			apply_tax:checkNull(id_dt.getInvoicePageDetails.InvoiceDetail.apply_tax) == true?'y':'n',
			from_button:'',
			delivery_method:id_dt.getInvoicePageDetails.InvoiceDetail.delivery_method,
			sales_payment_terms:'',
			tracking_num:id_dt.getInvoicePageDetails.Invoice.tracking_num,
			warehouse_id:id_dt.getInvoicePageDetails.Invoice.warehouse_id,
			delivery_note:'',
			our_ref:id_dt.getInvoicePageDetails.Invoice.our_ref_id,
			bp_referrer_id:id_dt.getInvoicePageDetails.Invoice.bp_referrer_id,
			all_products:[],
			product_lines:id_dt.getInvoicePageDetails.InvoiceProduct,
			is_scheduled_invoice:'n',
			mod:'n',
			sales_date1:convertDateIntoSiteFormat(moment().format('YYYY-MM-DD')),
			sales_fields:checkNull(id_dt.getInvoicePageDetails.Invoice.sales_fields)
		};

		var product_number = [];
		for(var j in id_dt.getInvoicePageDetails.InvoiceProduct){
			if(id_dt.getInvoicePageDetails.InvoiceProduct[j].is_text_line == 'y'){
				continue;
			}
			product_number.push(id_dt.getInvoicePageDetails.InvoiceProduct[j].product_number);
		}


		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			product_number:product_number,
			warehouse_id:checkNull(id_dt.getInvoicePageDetails.Invoice.warehouse_id),
		}

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/products/getAllProducts.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				save_params.all_products = complet_data.response.response;
				var ij = 0;
				for(var j in save_params.product_lines){

					save_params.product_lines[j].fillChecklistsdata = JSON.stringify(save_params.product_lines[j].answers);
					save_params.product_lines[j].line_key = ij++;
				}
				localStorage.setItem('newsales',JSON.stringify(save_params));
				new_custom_main_page2('/'+type+'/sales/save','sales_sel','sales_sel','sales_save',{customer_id:id_dt.getInvoicePageDetails.Invoice.receiver_id,duplicate:'y'});
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	addnote:function(){
		new_custom_popup2('600','popups','invoice_addnote',{invoice_id:id_dt.getInvoicePageDetails.Invoice.id});
	},
	registerLoss:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			invoice_id:id_dt.getInvoicePageDetails.Invoice.id,
		}

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Invoices/registerLoss.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',id_td.Success,complet_data.response.response.success);
				invoice_details.start(id_meta);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createCreditMemo:function(){
		window.location.href = base_url + 'invoice/show_credit_memo?cr='+id_dt.getInvoicePageDetails.Invoice.id;
	},
	update:function(data){
		var d = data.split('##');	
		var val = checkNull(d[0]);
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			delivery_method_id:val,
			invoice_id:id_dt.getInvoicePageDetails.Invoice.id,
		}

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Invoices/updateInvoiceDeliveryMethod.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',id_td.Success,complet_data.response.response.message);
				var default_str = data;
			 	if(checkNull(default_str) != '') {
					var arr = default_str.split('##');
					var v = arr[0];
					var delMethod = id_dt.deliveryMethods[v];
					var internal_name = delMethod.internal_name;
					if(internal_name.toLowerCase() == 'email') {
						$('.delivery_name,.tracking_num').hide();
					}else {
						$('.delivery_name,.tracking_num').show();
					}
					if(delMethod.is_tracking){
						$('.tracking_num').show();
					}else{
						$('.tracking_num').hide();	
					}
				}
				else{
					$('.delivery_name,.tracking_num').hide();
				}
				//invoice_details.start(id_meta);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	updateTrackingNo:function(data){
		
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			tracking_num:data,
			doc:'invoice',
			doc_id:id_dt.getInvoicePageDetails.Invoice.id,
		}

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/commons/updateTrackingNum.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',id_td.Success,complet_data.response.response.message.msg);
				//invoice_details.start(id_meta);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	makeStatusEditable:function(){
		
		var html = '<a href="javascript:;" data-type="statusedit" class="status_update"></a>';
		$('.inv_status_str').hide();
		$('.inv_status').append(html);


		$('.status_update').editable({
			showbuttons:'bottom',
			validate:function(val){
				if(checkNull(val.propertiesReturnStatus) == ''){
					//return id_td.Statusisrequired;
				}
			},
			success:function(data, config){
	       		invoice_details.saveReturnStatus(config);
	       	},
		});

		$('.status_update').on('shown',function(){
			if(is_inv_return == 'y' || is_inv_conflict == 'y'){
				if(is_inv_return == 'y'){
					$('#propertiesReturnStatus').val('n').trigger('change');
				}
				else if(is_inv_conflict == 'y'){
					$('#propertiesReturnStatus').val('y').trigger('change');
				}

				var html = '<button type="button" style="margin-left:5px;" class="btn clear_status"><i class="icon-remove"></i> '+id_td.Clearstatus+'</button>';
				$('.inv_status .editable-buttons').append(html);
				$('.clear_status').click(function(){
					$('#propertiesReturnStatus').val('').trigger('change');
					$('.editable-submit').trigger('click')
				});
			}
		});



		// $('.status_update').editable({
		// 	value: '',  
	 //       	mode:'inline',  
	 //       	type: 'select2',
	 //       	source:opts,
	 //       	showbuttons:'bottom',
	 //       	emptytext:id_td.Empty,
	 //       	placeholder:id_td.Select,
	 //       	success:function(data, config){
	 //       		console.log('config',config);
	 //       	},
		// });
		setTimeout(function(){
			$('.status_update').editable('show');
		},1);

		// $('.status_update').on('shown',function(){

		// });

		$('.status_update').on('hidden',function(){
			$('.status_update').remove();
			$('.inv_status_str').show();
		});
	},
	saveReturnStatus:function(data){


		if(checkNull(data.propertiesReturnStatus) == 'y' ){
			data.propertiesConflictNote = id_td.$conflict_note + data.propertiesConflictNote;
		}
			
		var total_params = {
			invoice_id:id_dt.getInvoicePageDetails.Invoice.id,
			invoice_detail_id:id_dt.getInvoicePageDetails.InvoiceDetail.id,
			due_date:id_dt.getInvoicePageDetails.Invoice.due_date,
			old_due_date:id_dt.getInvoicePageDetails.Invoice.due_date,
			has_applicable_level:'n',
			applicable_level:'',
			return_status:data.propertiesReturnStatus,
			conflict_note:data.propertiesConflictNote,

			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/invoices/editProperties.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',id_td.Success,complet_data.response.response.message.msg);
				new_custom_main_page2('/'+type +'/'+'invoice/invoice_details/'+id_dt.getInvoicePageDetails.Invoice.id,'invoices_list','invoices_list','invoice_details',{invoice_id:id_dt.getInvoicePageDetails.Invoice.id});

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	makeDueDateEditable:function(){
		var html = '<a href="javascript:;" data-type="duedate" class="due_date_update"></a>';
		$('.inv_due_date_str').hide();
		$('.inv_due_date').append(html);

		$('.due_date_update').editable({
			showbuttons:'bottom',
			validate:function(val){
				if(checkNull(val.due_date) == ''){
					return id_td.Duedateisrequired;
				}
				if(checkNull(val.invoiceReason) == ''){
					//return id_td.Reasonisrequired;
				}
			},
			success:function(data, config){
				console.log('configconfig',config);
				config['reminder_level'] = 'due_date';
	       		invoice_details.invoiceResend(config,'inv');
	       	},
		});
		setTimeout(function(){
			$('.due_date_update').editable('show');
		},1);

		$('.due_date_update').on('hidden',function(){
			$('.due_date_update').remove();
			$('.inv_due_date_str').show();
		});
	},
	makeReminderDueDateEditable:function(){
		
		var html = '<a href="javascript:;" data-type="reminderduedate" class="reminder_due_date_update"></a>';
		$('.inv_reminder_due_date_str').hide();
		$('.inv_reminder_due_date').append(html);

		$('.reminder_due_date_update').editable({
			showbuttons:'bottom',
			validate:function(val){
				if(checkNull(val.due_date) == ''){
					return id_td.Duedateisrequired;
				}
				if(checkNull(val.reminder_level) == ''){
					return id_td.Appliestoisrequired;
				}
			},
			success:function(data, config){
			
				if(config.reminder_level == 'inv'){
					invoice_details.invoiceResend(config,'inv');
				}
				else{
					invoice_details.invoiceResend(config,'inv');
				}
	       		
	       	},
		});
		setTimeout(function(){
			$('.reminder_due_date_update').editable('show');
		},1);

		$('.reminder_due_date_update').on('hidden',function(){
			$('.reminder_due_date_update').remove();
			$('.inv_reminder_due_date_str').show();
		});
	},
	invoiceResend:function(data,from=''){
		var due_date = data.due_date;
		due_date = moment(data.due_date).format('YYYY-MM-DD');

		var total_params = {
			invoice_id:id_dt.getInvoicePageDetails.Invoice.id,
			due_date:due_date,
			distribution_by_cust:'y',
			document_type:'',
			reason:checkNull(data.invoiceReason),
			document_type:checkNull(data.reminder_level),
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			from:from,
		};

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/invoices/resendInvoiceNew.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',id_td.Success,complet_data.response.response.msg);
				new_custom_main_page2('/'+type +'/'+'invoice/invoice_details/'+id_dt.getInvoicePageDetails.Invoice.id,'invoices_list','invoices_list','invoice_details',{invoice_id:id_dt.getInvoicePageDetails.Invoice.id});

			}
			else if(complet_data.response.status == 'error'){
				new_custom_main_page2('/'+type +'/'+'invoice/invoice_details/'+id_dt.getInvoicePageDetails.Invoice.id,'invoices_list','invoices_list','invoice_details',{invoice_id:id_dt.getInvoicePageDetails.Invoice.id});
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	genXml:function(){

		var total_params = {
			invoice_id:id_dt.getInvoicePageDetails.Invoice.id,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/ehf/getEhfInvoice.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				var di = complet_data.response.response.path;
				di = btoa(di);
				openPdf(APISERVER+'/api/downloads/report/'+di+'.json');
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}

		doAjax(params);
		return;
	},
	getInstallments:function(){
		var total_params = {
			invoice_id:id_dt.getInvoicePageDetails.Invoice.id,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/invoices/invoice_installments.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				if(complet_data.response.response.inv_installment.length == 0){
					old_exists = 0;
				}
				else{
					old_exists = 1;
				}
				
				
				invoice_details.generateInstallments(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	generateInstallments:function(data){
		inv_i_d = data;

		$('.installments_tab').addClass('active');
		$('#reset_install,#save_install').hide();
		var html = $('#installment_form').html();
		var form = `<div method="POST" name="" id="create_installment">` + html + `</div>`;
		

		$('#invoice_tab_content').html(form);

		var  c = $('.flexs').outerWidth();
		if(old_exists== 0){
			$('.due_date_of').html(id_td.Duedateoffirstinstallment);
			$('.cal_ins').html(id_td.Calculateinstallments);
		}
		else{
			
			$('.due_date_of').html(id_td.Duedateofnextinstallment);
			$('.cal_ins').html(id_td.Recalculateinstallments);
		}
		var w = (c-180)/3;
		$('.flexx1').css('width','180px');
		$('.flexx').css('width',w+'px');
		var a = 180 - $('.input-prepend .add-on').outerWidth() - $('.input-prepend .add-on').outerWidth() - 10;
		$('#no_of_install,#no_of_days').css('width',a+'px');

		$('.add-plus').click(function(){
			var v = $(this).prev().val();
			if(checkNull(v) == '' || checkNull(v) == 0){
				v = 1;
			}
			else{
				v = parseInt(v) + 1;
			}
			$(this).prev().val(v).trigger('change');
		});

		$('.add-minus').click(function(){
			var v = $(this).next().val();
			
			v = parseInt(v) - 1;
			if(checkNull(v) == '' || checkNull(v) <= 0){
				v = 1;
			}
			
			
			$(this).next().val(v).trigger('change');
		});

		var options = '<option selected="selected" value=""></option>';
		var issms = 0;
		var isemail = 0;

		if(checkNull(inv_i_d.invoiceData.Customer.customer_cellphone) != ''){
			issms = 1;
			options += '<option value="sms">'+id_td.SMS+'</option>';
		}

		if(checkNull(inv_i_d.invoiceData.Customer.customer_email) != '' || ("User" in inv_i_d.default_contact && checkNull(inv_i_d.default_contact.User.email) != '' )){
			isemail = 1;
			options += '<option value="email">'+id_td.Email+'</option>';
		}

		if(issms == 1 && isemail == 1){
			options += '<option value="email_sms">'+id_td.EmailandSMS+'</option>';
		}
		inv_i_d['options'] = options;
		$('#create_installment #install_notification').html(options);
		$('#create_installment #install_notification').val(inv_i_d.partnerSetting.default_installment_notification);

		$('#create_installment #install_notification').select2({
			placeholder:id_td.None,
			allowClear:true
		});

		$('#create_installment #install_freq').select2();

		$('#create_installment #first_due_date').datepicker({
			format:id_dt.date_format_f,
   		}).change(function(){
			$('.datepicker').remove();
		});
		//$('#create_installment #no_of_install').inputmask("99", {autoUnmask: true});
		//$('#create_installment #no_of_days').inputmask("99", {autoUnmask: true});
			
		
		var d = [];
		for(var j in inv_i_d.inv_installment){
			var v =  inv_i_d.inv_installment[j].InvoiceInstallment;
			d.push(v);
		}
		if(d.length != 0){
			invoice_details.generateInstallTbl(d);
		}
		
		$('#create_installment input,#create_installment select').change(function(){
			
			var first_due_d = $('#create_installment #first_due_date').datepicker('getDate');
			var first_due_date = $('#create_installment #first_due_date').val();
			if(checkNull(first_due_date) != ''){
				invoice_details.calculateInstall();
			}
		});
	},
	changeDays:function(d){


		var  c = $('.flexs').outerWidth();
		if(d == 'days'){
			var w = (c-180)/4;
			$('#create_installment #no_of_days').parent().parent().parent().show();
			$('.flexx2').css('width','180px');
		}
		else{
			var w = (c-180)/3;
			$('#create_installment #no_of_days').parent().parent().parent().hide();
		}	
		$('.flexx').css('width',w+'px');	
		$('.flexx1').css('width','180px');
		var a = 180 - $('.input-prepend .add-on').outerWidth() - $('.input-prepend .add-on').outerWidth() - 10;
		$('#no_of_install,#no_of_days').css('width',a+'px');
	},
	generateInstallTbl:function(data,frm='',datas_id = ''){

		install_data = data;
		var html = '';
		var k = 0;
		var tabl = `<div class="row-fluid install_lines_w"><div class="table-responsive"><table class="table table-striped table-bordered table-hover">
			<thead>
				<tr>
					<th>`+id_td.$installmenth+`</th>
					<th>`+id_td.Duedate+`</th>
					<th>`+id_td.Amount+`</th>
					<th>`+id_td.Notification+`</th>
					
				</tr>
			</thead>
			<tbody id="install_lines"></tbody>
		</table></div></div>`;
		tabl += `<div class="row-fluid text-right install_lines_w">
							<div class="btn-group">`;
		if(	old_exists == 1){
			tabl += `<button style="float: right; margin-right: 5px;" class="rmdis btn red btn_del" onclick="invoice_details.deleteAll('','selected')">
							<i class="icon-trash"></i>
							`+id_td.Deleteinstallmentagreement+`
						</button>
						`;
		}
		
		if(old_exists == 0){
			tabl += `
			<div class="btn-group" style="float:right;margin-bottom: 5px;">
				<button type="button" style="" class="btn btn_clear" onclick="invoice_details.showTab('installments')" id="reset_install"><i class="icon-remove"></i>&nbsp;`+id_td.Reset+`</button>
				
				<button type="button" style="margin-left:10px;" class="btn blue save_btn" onclick="invoice_details.saveRow();" id="save_install"><i class="icon-ok"></i>&nbsp;`+id_td.Saveinstallmentagreement+`</button>	


			</div>
		</div>`;
		}

		tabl += `</div>
						</div>`;
		

		$('.install_lines_w').remove();

		$('#invoice_tab_content').append(tabl);
		var v = $('#create_installment #install_notification').val();
	

		for(var j in data){
			var d = data[j];
			if(show_input == 0){
				var html = `<tr data-id="`+j+`">
					<td>`+ ( parseInt(j) + 1 ) +`</td>
					<td><input type="text" style="display:none" class="m-wrap span12 install_date" value=""></td>
					<td><input style="display:none" type="text" class="m-wrap span12 install_amount" value="`+convertIntoLocalFormat(d.amount)+`">`+convertIntoLocalFormat(d.amount)+`</td>
					<td><select style="display:none" class="m-wrap span12 notification_type">`+inv_i_d['options']+`</select></td>
					`;
						
				html += `</tr>`;
				$('#install_lines').append(html);
				$('tr[data-id="'+j+'"] .install_date').val(moment(d.due_date).format('YYYY-MM-DD'))
				$('tr[data-id="'+j+'"] .install_date').parent().append(convertDateIntoSiteFormat(d.due_date));
				if(frm == ''){
					$('tr[data-id="'+j+'"] .notification_type').val(d.notification_type);
					$('tr[data-id="'+j+'"] .notification_type').parent().append(notifications_v[d.notification_type]);
				}
				else{
					$('tr[data-id="'+j+'"] .notification_type').val(install_data[j]['notification_type']);
					$('tr[data-id="'+j+'"] .notification_type').parent().append(notifications_v[install_data[j]['notification_type']]);
				}
					

			}
			else{
				var html = `<tr data-id="`+j+`">
					<td>`+ ( parseInt(j) + 1 ) +`</td>
					<td><input type="text" style="" class="m-wrap span12 install_date" value=""></td>
					<td><input style="" type="text" class="m-wrap span12 install_amount" value="`+convertIntoLocalFormat(d.amount)+`"></td>
					<td><select style="" class="m-wrap span12 notification_type">`+inv_i_d['options']+`</select></td>
					`;
						
				html += `</tr>`;
				$('#install_lines').append(html);

				$('tr[data-id="'+j+'"] .install_date').datepicker({
					format:id_dt.date_format_f,

					}).change(function(){

		   				var due_date = moment($(this).datepicker('getDate')).format('YYYY-MM-DD');
		   				var data_id =	$(this).closest('tr').attr('data-id');
		   				if($(this).val() == ''){
		   					install_data[data_id]['due_date'] = '';
		   				}
		   				else{
		   					install_data[data_id]['due_date'] = due_date;
		   				}
					$('.datepicker').remove();
				});

				$('tr[data-id="'+j+'"] .install_date').datepicker('setDate',moment(d.due_date)._d).datepicker('update');


				if(frm == ''){
					$('tr[data-id="'+j+'"] .notification_type').val(d.notification_type);
					$('tr[data-id="'+j+'"] .notification_type').select2({
						placeholder:id_td.None,
						allowClear:true,
					});
					install_data[j]['notification_type'] = $('tr[data-id="'+j+'"] select.notification_type').val();

				}
				else{
					$('tr[data-id="'+j+'"] .notification_type').val(install_data[j]['notification_type']);
					$('tr[data-id="'+j+'"] .notification_type').select2({
						placeholder:id_td.None,
						allowClear:true,
					});
				}			
				
				$('tr[data-id="'+j+'"] select.notification_type').on('change', function (e) {
				 	var data_id = $(this).closest('tr').attr('data-id');
					install_data[data_id]['notification_type'] = $(this).val();
					
				});
				

			}
			
			
		}

		$('tr .install_amount').acceptOnlyFloat();
		$('tr .install_amount').on('blur',function(){
			var data_id = $(this).closest('tr').attr('data-id');
   				var val = convertIntoStandardFormat($(this).val());   			
   				install_data[data_id]['amount'] =  parseFloat(val);
   				$(this).val(convertIntoLocalFormat(val));
		});

	
		if(frm == 'append'){
			$('tr[data-id="'+datas_id+'"] input:first').focus();
		}

		// if(inv_i_d.invoiceData.Invoice.agreement_cancel == 1){
		// 	$('#invoice_tab_content input').prop('disabled','disabled');
		// 	$('#invoice_tab_content select').each(function(){
		// 		$(this).select2('destroy').prop('disabled',true).select2();
		// 	});
		// 	$('#invoice_tab_content button').prop('disabled','disabled');
		// 	$('.install_lines_w tr th:last').hide();
		// 	$('.install_lines_w tr td:last').hide();
		// }

	},
	calculateInstall:function(){
		var no_of_install = $('#create_installment #no_of_install').val();
		var install_freq = $('#create_installment #install_freq').val();
		var no_of_days = $('#create_installment #no_of_days').val();
		var first_due_d = $('#create_installment #first_due_date').datepicker('getDate');
		var first_due_date = $('#create_installment #first_due_date').val();
		
		var install_notification = $('#create_installment #install_notification').val();

		var errorMsg = '';

		if(checkNull(no_of_install) == ''){
			errorMsg += id_td.Numberofinstallments + '<br/>';
		}
		if(checkNull(install_freq) == 'days'){
			if(checkNull(no_of_days) == ''){
				errorMsg += id_td.Numberofdays + '<br/>';
			}
		}

		if(checkNull(first_due_date) == ''){
			if(old_exists == 1){
				errorMsg += id_td.Duedateofnextinstallment + '<br/>';
			}
			else{
				errorMsg += id_td.Duedateoffirstinstallment + '<br/>';
			}
		}	

		if(errorMsg != ''){
			var msg =  id_td.Pleasecheckthefollowingfields+ '<br/>' + errorMsg;
			showAlertMessage(msg,'error',id_td.alertmessage);
			return;
		}

		$('#save_install,#reset_install').show();

		var installments_lines = [];
		var paid_amt = 0;
		// if(install_data.length != 0){
		// 	for(var j in install_data){
		// 		if(install_data[j]['status'] == 'paid'){
		// 			installments_lines.push(install_data[j]);
		// 			paid_amt = parseFloat(paid_amt) + parseFloat(install_data[j].amount);
		// 		}
		// 	}
		// }
		var balance = inv_i_d.invoiceData.Invoice.gross_amount;
		var installment_amt = (balance/no_of_install).toFixed(2);

		var round_off = (balance - (installment_amt * no_of_install)).toFixed(2);
		;
		var new_arr = [];
		for(i=0;i<no_of_install;i++){
			var amt = parseFloat(installment_amt);
			var round_v = parseInt(amt);
			round_off = parseFloat(round_off) + parseFloat(amt - round_v);
			new_arr.push(round_v);
		}
		round_off = parseFloat(round_off.toFixed(2));
		
		if(round_off < 1){
			new_arr[0] = new_arr[0] + round_off;
		}
		else{
			if(Number.isInteger(round_off)){
				new_arr[0] = new_arr[0] + round_off;
			}
			else{
				if(round_off > 1){
					var c = round_off;
					var a = 0;
					var b = 0;

					if((c/2 % 1) == 0 ){
						a = c/2;
						b = c/2;
					}
					else{
						var a = Math.round(c/2);
						var b = c - a;
						if(a < b){
							var temp = a;
							var a = b
							var b = temp;
						}
					}
					new_arr[0] = new_arr[0] + a;
					new_arr[1] = new_arr[1] + b;
					
				}
				else{
					if(round_off - 1 > 1){
						new_arr[0] = new_arr[0] + round_off - 1;
						new_arr[1] = new_arr[1] + 1;
					}
					else{
						new_arr[0] = new_arr[0] + 1;
						new_arr[1] = new_arr[1] + round_off - 1;
					}
				}
				
			}
			// new_arr[0] = new_arr[0] + Math.round(round_off);
			// new_arr[1] = new_arr[1] + (round_off % 1);
			
		}



		for(i=0;i<new_arr.length;i++){
			var amt = parseFloat(new_arr[i]);
			var no_of_days = parseInt(no_of_days);
			if(i == 0){
				//var amt = parseFloat(installment_amt) + parseFloat(round_off);
				//amt = parseFloat(amt.toFixed(2));
				var due_date = moment($('#create_installment #first_due_date').datepicker('getDate')).format('YYYY-MM-DD');
				if(checkNull(install_freq) == 'days'){
					//var due_date = moment(due_date).add(no_of_days, 'days').format('YYYY-MM-DD');
				}
				else{
					//var due_date = moment(due_date).add(i+1, 'M').format('YYYY-MM-DD');
				}
			}
			else{
				if(checkNull(install_freq) == 'days'){
					var due_date = moment(installments_lines[i-1].due_date).add(no_of_days, 'days').format('YYYY-MM-DD');
				}
				else{
					var due_date = moment(installments_lines[0].due_date).add(i, 'M').format('YYYY-MM-DD');
				}
			}

			var obj = {
				amount:amt,
				due_date:due_date,
				notification_type:install_notification,
			};

			installments_lines.push(obj);
		}
		old_exists = 0;
		show_input = 1;
		invoice_details.generateInstallTbl(installments_lines);
	},
	addRow:function(that){
		var data_id = $(that).parent().parent().attr('data-id');
		var obj = {
			amount:install_data[data_id].amount,
			due_date:install_data[data_id].due_date,
			notification_type:install_data[data_id].notification_type
		}
		if( (install_data.length - 1) == data_id){
			install_data.splice(parseInt(data_id)+1,0,obj);
		}
		else{
			install_data.push(obj);
		}		

		invoice_details.generateInstallTbl(install_data,'append',parseInt(data_id)+1);
	},
	deleteRow:function(that){
		var data_id = $(that).parent().parent().attr('data-id');
		install_data.splice(data_id,1);
		invoice_details.generateInstallTbl(install_data,'append',install_data.length - 1);
		
	},
	saveRow:function(){
		var sum = 0;
		var errorMsg = '';
		if(install_data.length == 0){
			var msg =  id_td.Pleaseenterinstallments+ '<br/>' + errorMsg;
			showAlertMessage(msg,'error',id_td.alertmessage);
			return;
		}
		else{
			for(var j in install_data){
			
				if(checkNull(install_data[j]['due_date']) == ''){
					errorMsg += id_td.Duedate + ' '+ id_td.for + ' ' + id_td.$installmenth + ' ' + (parseInt(j) + 1) + '<br/>';
				}

				if(checkNull(install_data[j]['amount']) == ''){
					errorMsg += id_td.Amount + ' '+ id_td.for + ' ' + id_td.$installmenth + ' ' + (parseInt(j) + 1) + '<br/>';
				}

			

				// if(checkNull(install_data[j]['notification_type']) == ''){
				// 	errorMsg += id_td.Notification + ' '+ id_td.for + ' ' + id_td.$installmenth + ' ' + j + '<br/>';
				// }
				sum += parseFloat(install_data[j].amount);
			}	
		}
		

		if(errorMsg != ''){
			var msg =  id_td.Pleasecheckthefollowingfields+ '<br/>' + errorMsg;
			showAlertMessage(msg,'error',id_td.alertmessage);
			return;
		}
		//out_standing_balance
		var balance = inv_i_d.invoiceData.Invoice.gross_amount;
		
		if(parseFloat(balance) != parseFloat(sum)){
			var msg =  id_td.$installment_total_err;_
			showAlertMessage(msg,'error',id_td.alertmessage);
			return;
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			invoice_id:id_meta.invoice_id,
			install_data:JSON.stringify(install_data),
		};
		
		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Invoices/save_installments.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				if(complet_data.response.response.is_due_date_change == 1){
					new_custom_main_page2('/'+type +'/'+'invoice/invoice_details/'+id_dt.getInvoicePageDetails.Invoice.id,'invoices_list','invoices_list','invoice_details',{invoice_id:id_dt.getInvoicePageDetails.Invoice.id,tab:'installments'});
				}
				call_toastr('success',id_td.Success,complet_data.response.response.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',id_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	deleteAll:function(){
		var no = function(){};
		var yes = function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				invoice_id:id_meta.invoice_id,
			}

			var params = $.extend({}, doAjax_params_default);
			params['requestType'] = 'POST';
			params['url'] = APISERVER+'/api/Invoices/delete_installments.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					//if(complet_data.response.response.is_due_date_change == 1){
						new_custom_main_page2('/'+type +'/'+'invoice/invoice_details/'+id_dt.getInvoicePageDetails.Invoice.id,'invoices_list','invoices_list','invoice_details',{invoice_id:id_dt.getInvoicePageDetails.Invoice.id,tab:'installments'});
					//}
					call_toastr('success',id_td.Success,complet_data.response.response.msg);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',id_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',id_td.alertmessage);
						return;
					}	
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;
		};

		showDeleteMessage(id_td.$del_all_installment,id_td.Warning,yes,no,'ui-dialog-blue',id_td.Delete,id_td.Cancel);
	},
	goToOrder(order_id=''){
		if(checkNull(order_id) == ''){
			order_id = id_dt.getInvoicePageDetails.Invoice.order_id;
		}
		var prefix = '';
			if(checkNull(type) == 'customer'){
				prefix = '/' + partner_dir +'/';
			}
			else{
				prefix = '/';
			}
			new_custom_main_page2(prefix+type+'/order/order_details/'+order_id,'orders_list','orders_list','order_details',{order_id:order_id});
		
	}
	
		


}