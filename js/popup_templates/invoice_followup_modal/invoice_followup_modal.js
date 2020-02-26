var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var type = $('#type').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();

var ifm_meta;
var ifm_dt;
var ifm_ppid = 'popups';
var ifm_td;
var followup_status = {};
var followup_statush = {};

var invoice_followup_modal = {
	start:function(popupid,metadata={}){
		ifm_ppid = popupid;
		ifm_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			followup_id:ifm_meta.followup_id,
			invoice_id:ifm_meta.invoice_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Invoice Details','Close','$invoiceh','Customer name','Customer cellphone','Customer email','$fllu_date','$fllu_act','Log Date','Status','Note','Createtask','Sendtelevakt','Staffersfollowuplist','Sellersfollowuplist','New','Open','Completed','Cancelled','Deleted','Change status','$email','SMS','Send','Customer','Quote','Go to','$update_status','Warning','Yes','No','Sales followup status updated successfully','Success','Invoice'],		
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Invoices/invoiceFllwupDetails.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ifm_dt = complet_data.response.response;
				ifm_td = complet_data.response.response.translationsData;
				invoice_followup_modal.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ifm_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ifm_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		followup_status = {
			'new':ifm_td.New,
			'open':ifm_td.Open,
			'completed':ifm_td.Completed,
			'cancelled':ifm_td.Cancelled,
			'deleted' : ifm_td.Deleted,
		};

		followup_statush = {
			'new':'<i class="icon-plus"></i>&nbsp;' + ifm_td.New,
			'open':'<i class="icon-folder-open"></i>&nbsp;' + ifm_td.Open,
			'completed':'<i class="icon-ok"></i>&nbsp;' + ifm_td.Completed,
			'cancelled':'<i class="icon-remove"></i>&nbsp;' + ifm_td.Cancelled,
			'deleted' : '<i class="icon-remove"></i>&nbsp;' + ifm_td.Deleted,
		};

		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}

		ifm_dt.date_format_f = date_format_f;

		ifm_dt.ifm_meta = ifm_meta;

		var addrs = '';
		if(type == 'partner'){
			addrs += '<li><a style="color:#08c;text-decoration:none;" onclick="invoice_followup_modal.showCust('+checkNull(ifm_dt.invoiceFollowupDetails.Customer.id)+')">'+checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_name)+'</a></li>';

			if(checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_address2) != '' ){
				addrs += '<li>'+checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_address1)+', '+checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_address2)+'</li>';
			}
			else{
				addrs += '<li>'+checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_address1)+'</li>';
			}

			addrs += '<li>'+checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_zip)+' '+checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_city)+'</li>';

			addrs += '<li>'+checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_country)+'</li>';

		}
		else{
			addrs += '<li>'+checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_name)+'</li>';
		}

		var cust_cell = checkNull(ifm_dt.invoiceFollowupDetails.Customer.format_cellphone,'-');
		var cust_email = checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_email,'-');

		ifm_dt.ifm_fd = {
			invoice_id:checkNull(ifm_dt.invoiceFollowupDetails.Invoice.id),
			addrs:addrs,
			cust_cell:cust_cell,
			cust_email:cust_email,
			fllu_act:checkNull(ifm_td[checkNull(ifm_dt.invoiceFollowupDetails.Followup.followup_action,'-')]),
			fllu_date:convertDateIntoSiteFormat(checkNull(ifm_dt.invoiceFollowupDetails.Followup.followup_date)),
			log_date:convertDateIntoSiteFormat(checkNull(ifm_dt.invoiceFollowupDetails.Followup.log_date)),
			status:checkNull(followup_status[checkNull(ifm_dt.invoiceFollowupDetails.Followup.followup_status,'-')]),
			note:checkNull(ifm_dt.invoiceFollowupDetails.Followup.note),
			followup_status:checkNull(ifm_dt.invoiceFollowupDetails.Followup.followup_status),
			followup_statush:followup_statush,
		};


		var template = document.getElementById('invoice_followup_modal_template').innerHTML;
		var compiledRendered = Template7(template, ifm_dt);
		document.getElementById(ifm_ppid).innerHTML = compiledRendered;
		invoice_followup_modal.bindEvents();
		resizemodal(ifm_ppid);
	},
	bindEvents:function(){	
		$('.dropdown_'+ifm_dt.invoiceFollowupDetails.Followup.followup_status).parent().hide();

		if(checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_email) == ''){
			$('.dropdown_email').hide();
		}

		if(checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_cellphone) == ''){
			$('.dropdown_sms').hide();
		}

		if(checkNull(ifm_dt.invoiceFollowupDetails.Followup.note) == ''){
			$('li.note_h').hide();
		}
	},
	showCust:function(customer_id=''){
		closeModal(ifm_ppid);
		if(checkNull(customer_id) == ''){
			customer_id = checkNull(ifm_dt.invoiceFollowupDetails.Customer.id);
		}

		new_custom_main_page2('/'+type +'/'+'customers/details/'+customer_id,'all_customers','all_customers','customer_details',{customer_id:customer_id});
	},
	gotoinvoice:function(invoice_id = ''){
		closeModal(ifm_ppid);
		if(checkNull(invoice_id) == ''){
			invoice_id = checkNull(ifm_dt.invoiceFollowupDetails.Invoice.id);
		}
		window.location.href = base_url + 'invoice/invoice_details/'+invoice_id;
		//new_custom_main_page2('/'+type +'/'+'order/order_details/'+invoice_id,'orders_list','orders_list','order_details',{invoice_id:invoice_id});
	},
	changeStatus:function(frm){
		var no = function(){};
		var yes = function(){
			showProcessingImage('undefined');

			getUserIP(function(ip){
				var total_params = {
					token:token,
					language:language,
					lang:lang,
					partner_id:partner_id,
					admin_id:admin_id,
					followup_id:ifm_meta.followup_id,
					followup_status:frm,
					ip_address:ip,
					from:'followup',
				};
				var params = $.extend({}, doAjax_params_default);
				params['url'] = APISERVER+'/api/Quotes/deleteFollowupEntry.json';
				params['data'] = total_params;

				params['completeCallbackFunction'] = function (){
					hideProcessingImage();
				};

				params['successCallbackFunction'] = function (complet_data){
					if(complet_data.response.status == 'success'){
						call_toastr('success',ifm_td.Success,ifm_td.Salesfollowupstatusupdatedsuccessfully);
						closeModal(ifm_ppid);
						if("followup_lists" in window){
							followup_lists.generateRows(complet_data.response.response.followupList);
						}
					}
					else if(complet_data.response.status == 'error'){
						if(complet_data.response.response.error == 'validationErrors'){
							var mt_arr = complet_data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error',ifm_td.Alertmessage);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',ifm_td.Alertmessage);
							return;
						}	
					}
				};

				doAjax(params);
				return;
			});
		};
		showDeleteMessage(ifm_td.$update_status,ifm_td.Warning,yes,no,'ui-dialog-blue',ifm_td.Yes,ifm_td.No,'green');
	},
	sendEmail:function(){
		var cid = checkNull(ifm_dt.invoiceFollowupDetails.Customer.id);
		var cust_name  = checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_name);
		var cust_email = checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_email);
		var cust_cellphone  = checkNull(ifm_dt.invoiceFollowupDetails.Customer.cust_cellphone);
		var cust_country = checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_country);
		var cp_code = checkNull(ifm_dt.invoiceFollowupDetails.Customer.cp_code);
		var customer_number = checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_number);
		var cust_number =  checkNull(ifm_dt.invoiceFollowupDetails.Customer.format_cellphone);
		var to_number = cp_code+cust_cellphone;
		closeModal(ifm_ppid);
		show_dkmodal_for_customer_email(cid,cust_name,cust_email,customer_number);
					
	},
	sendSms:function(){
		var cid = checkNull(ifm_dt.invoiceFollowupDetails.Customer.id);
		var cust_name  = checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_name);
		var cust_email = checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_email);
		var cust_cellphone  = checkNull(ifm_dt.invoiceFollowupDetails.Customer.cust_cellphone);
		var cust_country = checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_country);
		var cp_code = checkNull(ifm_dt.invoiceFollowupDetails.Customer.cp_code);
		var customer_number = checkNull(ifm_dt.invoiceFollowupDetails.Customer.customer_number);
		var cust_number =  checkNull(ifm_dt.invoiceFollowupDetails.Customer.format_cellphone);
		var to_number = cp_code+cust_cellphone;
		closeModal(ifm_ppid);

		show_dkmodal_for_customer_sms(cid,cust_name,cust_number,cust_country,cp_code,to_number,customer_number);
	},



}