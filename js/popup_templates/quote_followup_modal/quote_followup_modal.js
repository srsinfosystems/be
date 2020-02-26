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

var qfm_meta;
var qfm_dt;
var qfm_ppid = 'popups';
var qfm_td;
var followup_status = {};
var followup_statush = {};

var quote_followup_modal = {
	start:function(popupid,metadata={}){
		qfm_ppid = popupid;
		qfm_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			followup_id:qfm_meta.followup_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Quote Details','Close','$quoteh','Customer name','Customer cellphone','Customer email','$fllu_date','$fllu_act','Log Date','Status','Note','Createtask','Sendtelevakt','Staffersfollowuplist','Sellersfollowuplist','New','Open','Completed','Cancelled','Deleted','Change status','$email','SMS','Send','Customer','Quote','Go to','$update_status','Warning','Yes','No','Sales followup status updated successfully','Success'],		
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/quoteFllwupDetails.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				qfm_dt = complet_data.response.response;
				qfm_td = complet_data.response.response.translationsData;
				quote_followup_modal.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',qfm_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qfm_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		followup_status = {
			'new':qfm_td.New,
			'open':qfm_td.Open,
			'completed':qfm_td.Completed,
			'cancelled':qfm_td.Cancelled,
			'deleted' : qfm_td.Deleted,
		};

		followup_statush = {
			'new':'<i class="icon-plus"></i>&nbsp;' + qfm_td.New,
			'open':'<i class="icon-folder-open"></i>&nbsp;' + qfm_td.Open,
			'completed':'<i class="icon-ok"></i>&nbsp;' + qfm_td.Completed,
			'cancelled':'<i class="icon-remove"></i>&nbsp;' + qfm_td.Cancelled,
			'deleted' : '<i class="icon-remove"></i>&nbsp;' + qfm_td.Deleted,
		};

		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}

		qfm_dt.date_format_f = date_format_f;

		qfm_dt.qfm_meta = qfm_meta;

		var addrs = '';
		if(type == 'partner'){
			addrs += '<li><a style="color:#08c;text-decoration:none;" onclick="quote_followup_modal.showCust('+checkNull(qfm_dt.quoteFollowupDetails.Customer.id)+')">'+checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_name)+'</a></li>';

			if(checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_address2) != '' ){
				addrs += '<li>'+checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_address1)+', '+checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_address2)+'</li>';
			}
			else{
				addrs += '<li>'+checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_address1)+'</li>';
			}

			addrs += '<li>'+checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_zip)+' '+checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_city)+'</li>';

			addrs += '<li>'+checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_country)+'</li>';

		}
		else{
			addrs += '<li>'+checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_name)+'</li>';
		}

		var cust_cell = checkNull(qfm_dt.quoteFollowupDetails.Customer.format_cellphone,'-');
		var cust_email = checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_email,'-');

		qfm_dt.qfm_fd = {
			quote_id:checkNull(qfm_dt.quoteFollowupDetails.Quote.id),
			addrs:addrs,
			cust_cell:cust_cell,
			cust_email:cust_email,
			fllu_act:checkNull(qfm_td[checkNull(qfm_dt.quoteFollowupDetails.Followup.followup_action,'-')]),
			fllu_date:convertDateIntoSiteFormat(checkNull(qfm_dt.quoteFollowupDetails.Followup.followup_date)),
			log_date:convertDateIntoSiteFormat(checkNull(qfm_dt.quoteFollowupDetails.Followup.log_date)),
			status:checkNull(followup_status[checkNull(qfm_dt.quoteFollowupDetails.Followup.followup_status,'-')]),
			note:checkNull(qfm_dt.quoteFollowupDetails.Followup.note),
			followup_status:checkNull(qfm_dt.quoteFollowupDetails.Followup.followup_status),
			followup_statush:followup_statush,
		};


		var template = document.getElementById('quote_followup_modal_template').innerHTML;
		var compiledRendered = Template7(template, qfm_dt);
		document.getElementById(qfm_ppid).innerHTML = compiledRendered;
		quote_followup_modal.bindEvents();
		resizemodal(qfm_ppid);
	},
	bindEvents:function(){	
		$('.dropdown_'+qfm_dt.quoteFollowupDetails.Followup.followup_status).parent().hide();

		if(checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_email) == ''){
			$('.dropdown_email').hide();
		}

		if(checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_cellphone) == ''){
			$('.dropdown_sms').hide();
		}

		if(checkNull(qfm_dt.quoteFollowupDetails.Followup.note) == ''){
			$('li.note_h').hide();
		}
	},
	showCust:function(customer_id=''){
		closeModal(qfm_ppid);
		if(checkNull(customer_id) == ''){
			customer_id = checkNull(qfm_dt.quoteFollowupDetails.Customer.id);
		}

		new_custom_main_page2('/'+type +'/'+'customers/details/'+customer_id,'all_customers','all_customers','customer_details',{customer_id:customer_id});
	},
	gotoquote:function(quote_id = ''){
		closeModal(qfm_ppid);
		if(checkNull(quote_id) == ''){
			quote_id = checkNull(qfm_dt.quoteFollowupDetails.Quote.id);
		}

		new_custom_main_page2('/'+type +'/'+'quotes/quote_details/'+quote_id,'quotes_list','quotes_list','quote_details',{quote_id:quote_id});
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
					followup_id:qfm_meta.followup_id,
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
						call_toastr('success',qfm_td.Success,qfm_td.Salesfollowupstatusupdatedsuccessfully);
						closeModal(qfm_ppid);
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
							showAlertMessage(array,'error',qfm_td.Alertmessage);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',qfm_td.Alertmessage);
							return;
						}	
					}
				};

				doAjax(params);
				return;
			});
		};
		showDeleteMessage(qfm_td.$update_status,qfm_td.Warning,yes,no,'ui-dialog-blue',qfm_td.Yes,qfm_td.No,'green');
	},
	sendEmail:function(){
		var cid = checkNull(qfm_dt.quoteFollowupDetails.Customer.id);
		var cust_name  = checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_name);
		var cust_email = checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_email);
		var cust_cellphone  = checkNull(qfm_dt.quoteFollowupDetails.Customer.cust_cellphone);
		var cust_country = checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_country);
		var cp_code = checkNull(qfm_dt.quoteFollowupDetails.Customer.cp_code);
		var customer_number = checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_number);
		var cust_number =  checkNull(qfm_dt.quoteFollowupDetails.Customer.format_cellphone);
		var to_number = cp_code+cust_cellphone;
		closeModal(qfm_ppid);
		show_dkmodal_for_customer_email(cid,cust_name,cust_email,customer_number);
					
	},
	sendSms:function(){
		var cid = checkNull(qfm_dt.quoteFollowupDetails.Customer.id);
		var cust_name  = checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_name);
		var cust_email = checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_email);
		var cust_cellphone  = checkNull(qfm_dt.quoteFollowupDetails.Customer.cust_cellphone);
		var cust_country = checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_country);
		var cp_code = checkNull(qfm_dt.quoteFollowupDetails.Customer.cp_code);
		var customer_number = checkNull(qfm_dt.quoteFollowupDetails.Customer.customer_number);
		var cust_number =  checkNull(qfm_dt.quoteFollowupDetails.Customer.format_cellphone);
		var to_number = cp_code+cust_cellphone;
		closeModal(qfm_ppid);

		show_dkmodal_for_customer_sms(cid,cust_name,cust_number,cust_country,cp_code,to_number,customer_number);
	},



}