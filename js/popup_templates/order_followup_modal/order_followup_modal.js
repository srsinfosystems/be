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

var ofm_meta;
var ofm_dt;
var ofm_ppid = 'popups';
var ofm_td;
var followup_status = {};
var followup_statush = {};

var order_followup_modal = {
	start:function(popupid,metadata={}){
		ofm_ppid = popupid;
		ofm_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			followup_id:ofm_meta.followup_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Order Details','Close','$orderh','Customer name','Customer cellphone','Customer email','$fllu_date','$fllu_act','Log Date','Status','Note','Createtask','Sendtelevakt','Staffersfollowuplist','Sellersfollowuplist','New','Open','Completed','Cancelled','Deleted','Change status','$email','SMS','Send','Customer','Quote','Go to','$update_status','Warning','Yes','No','Sales followup status updated successfully','Success','Order'],		
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Orders/orderFllwupDetails.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ofm_dt = complet_data.response.response;
				ofm_td = complet_data.response.response.translationsData;
				order_followup_modal.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ofm_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ofm_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		followup_status = {
			'new':ofm_td.New,
			'open':ofm_td.Open,
			'completed':ofm_td.Completed,
			'cancelled':ofm_td.Cancelled,
			'deleted' : ofm_td.Deleted,
		};

		followup_statush = {
			'new':'<i class="icon-plus"></i>&nbsp;' + ofm_td.New,
			'open':'<i class="icon-folder-open"></i>&nbsp;' + ofm_td.Open,
			'completed':'<i class="icon-ok"></i>&nbsp;' + ofm_td.Completed,
			'cancelled':'<i class="icon-remove"></i>&nbsp;' + ofm_td.Cancelled,
			'deleted' : '<i class="icon-remove"></i>&nbsp;' + ofm_td.Deleted,
		};

		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}

		ofm_dt.date_format_f = date_format_f;

		ofm_dt.ofm_meta = ofm_meta;

		var addrs = '';
		if(type == 'partner'){
			addrs += '<li><a style="color:#08c;text-decoration:none;" onclick="order_followup_modal.showCust('+checkNull(ofm_dt.orderFollowupDetails.Customer.id)+')">'+checkNull(ofm_dt.orderFollowupDetails.Customer.customer_name)+'</a></li>';

			if(checkNull(ofm_dt.orderFollowupDetails.Customer.customer_address2) != '' ){
				addrs += '<li>'+checkNull(ofm_dt.orderFollowupDetails.Customer.customer_address1)+', '+checkNull(ofm_dt.orderFollowupDetails.Customer.customer_address2)+'</li>';
			}
			else{
				addrs += '<li>'+checkNull(ofm_dt.orderFollowupDetails.Customer.customer_address1)+'</li>';
			}

			addrs += '<li>'+checkNull(ofm_dt.orderFollowupDetails.Customer.customer_zip)+' '+checkNull(ofm_dt.orderFollowupDetails.Customer.customer_city)+'</li>';

			addrs += '<li>'+checkNull(ofm_dt.orderFollowupDetails.Customer.customer_country)+'</li>';

		}
		else{
			addrs += '<li>'+checkNull(ofm_dt.orderFollowupDetails.Customer.customer_name)+'</li>';
		}

		var cust_cell = checkNull(ofm_dt.orderFollowupDetails.Customer.format_cellphone,'-');
		var cust_email = checkNull(ofm_dt.orderFollowupDetails.Customer.customer_email,'-');

		ofm_dt.ofm_fd = {
			order_id:checkNull(ofm_dt.orderFollowupDetails.Forder.id),
			addrs:addrs,
			cust_cell:cust_cell,
			cust_email:cust_email,
			fllu_act:checkNull(ofm_td[checkNull(ofm_dt.orderFollowupDetails.Followup.followup_action,'-')]),
			fllu_date:convertDateIntoSiteFormat(checkNull(ofm_dt.orderFollowupDetails.Followup.followup_date)),
			log_date:convertDateIntoSiteFormat(checkNull(ofm_dt.orderFollowupDetails.Followup.log_date)),
			status:checkNull(followup_status[checkNull(ofm_dt.orderFollowupDetails.Followup.followup_status,'-')]),
			note:checkNull(ofm_dt.orderFollowupDetails.Followup.note),
			followup_status:checkNull(ofm_dt.orderFollowupDetails.Followup.followup_status),
			followup_statush:followup_statush,
		};


		var template = document.getElementById('order_followup_modal_template').innerHTML;
		var compiledRendered = Template7(template, ofm_dt);
		document.getElementById(ofm_ppid).innerHTML = compiledRendered;
		order_followup_modal.bindEvents();
		resizemodal(ofm_ppid);
	},
	bindEvents:function(){	
		$('.dropdown_'+ofm_dt.orderFollowupDetails.Followup.followup_status).parent().hide();

		if(checkNull(ofm_dt.orderFollowupDetails.Customer.customer_email) == ''){
			$('.dropdown_email').hide();
		}

		if(checkNull(ofm_dt.orderFollowupDetails.Customer.customer_cellphone) == ''){
			$('.dropdown_sms').hide();
		}

		if(checkNull(ofm_dt.orderFollowupDetails.Followup.note) == ''){
			$('li.note_h').hide();
		}
	},
	showCust:function(customer_id=''){
		closeModal(ofm_ppid);
		if(checkNull(customer_id) == ''){
			customer_id = checkNull(ofm_dt.orderFollowupDetails.Customer.id);
		}

		new_custom_main_page2('/'+type +'/'+'customers/details/'+customer_id,'all_customers','all_customers','customer_details',{customer_id:customer_id});
	},
	gotoorder:function(order_id = ''){
		closeModal(ofm_ppid);
		if(checkNull(order_id) == ''){
			order_id = checkNull(ofm_dt.orderFollowupDetails.Forder.id);
		}

		new_custom_main_page2('/'+type +'/'+'order/order_details/'+order_id,'orders_list','orders_list','order_details',{order_id:order_id});
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
					followup_id:ofm_meta.followup_id,
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
						call_toastr('success',ofm_td.Success,ofm_td.Salesfollowupstatusupdatedsuccessfully);
						closeModal(ofm_ppid);
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
							showAlertMessage(array,'error',ofm_td.Alertmessage);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',ofm_td.Alertmessage);
							return;
						}	
					}
				};

				doAjax(params);
				return;
			});
		};
		showDeleteMessage(ofm_td.$update_status,ofm_td.Warning,yes,no,'ui-dialog-blue',ofm_td.Yes,ofm_td.No,'green');
	},
	sendEmail:function(){
		var cid = checkNull(ofm_dt.orderFollowupDetails.Customer.id);
		var cust_name  = checkNull(ofm_dt.orderFollowupDetails.Customer.customer_name);
		var cust_email = checkNull(ofm_dt.orderFollowupDetails.Customer.customer_email);
		var cust_cellphone  = checkNull(ofm_dt.orderFollowupDetails.Customer.cust_cellphone);
		var cust_country = checkNull(ofm_dt.orderFollowupDetails.Customer.customer_country);
		var cp_code = checkNull(ofm_dt.orderFollowupDetails.Customer.cp_code);
		var customer_number = checkNull(ofm_dt.orderFollowupDetails.Customer.customer_number);
		var cust_number =  checkNull(ofm_dt.orderFollowupDetails.Customer.format_cellphone);
		var to_number = cp_code+cust_cellphone;
		closeModal(ofm_ppid);
		show_dkmodal_for_customer_email(cid,cust_name,cust_email,customer_number);
					
	},
	sendSms:function(){
		var cid = checkNull(ofm_dt.orderFollowupDetails.Customer.id);
		var cust_name  = checkNull(ofm_dt.orderFollowupDetails.Customer.customer_name);
		var cust_email = checkNull(ofm_dt.orderFollowupDetails.Customer.customer_email);
		var cust_cellphone  = checkNull(ofm_dt.orderFollowupDetails.Customer.cust_cellphone);
		var cust_country = checkNull(ofm_dt.orderFollowupDetails.Customer.customer_country);
		var cp_code = checkNull(ofm_dt.orderFollowupDetails.Customer.cp_code);
		var customer_number = checkNull(ofm_dt.orderFollowupDetails.Customer.customer_number);
		var cust_number =  checkNull(ofm_dt.orderFollowupDetails.Customer.format_cellphone);
		var to_number = cp_code+cust_cellphone;
		closeModal(ofm_ppid);

		show_dkmodal_for_customer_sms(cid,cust_name,cust_number,cust_country,cp_code,to_number,customer_number);
	},



}