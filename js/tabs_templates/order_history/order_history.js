var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();

var oh_tabid;
var oh_dt;
var oh_td;
var oh_meta;
var order_statusz = {};
var defaultFollowupStatus = {};
var cancellationReason = {};
var table_extra = {};
var product_units = {};
var task_types = {};
var task_statuses = {};
var order_statuses = {};

var order_history = {
	start:function(tab_id,meta){
		oh_tabid = tab_id;
		oh_meta = meta;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			order_id:oh_meta.order_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['General','Dashboard','alert message','Quote number','Action','User','Log date','Sent to customer','Accepted','Declined','Expired','Retract','Cancelled','New status','New','Open','Completed','Deleted','quote_followup_deleted','quote_followup_created','quote_followup_status_changed','order_followup_deleted','order_followup_created','order_followup_status_changed','quote_followup','order_followup','quote_sms_followup_sent','quote_distributed','quote_send','quote_accepted','quote_declined','quote_resend','order_send','order_resend','new_status','quote_created','quote_modified','quote_deleted','email_send','email_resend','line_deleted','your_reference','our_reference','order_accepted','order_declined','order_created','order_modified','delivery_method_modified','quote_date_modified','due_date_modified','order_date_modified','new_task','Old status','Accepted by','Declined by','Status changed by','Cancellation reason','Note','New status','Local Print Queue','Remote Print Queue','Direct printing','Postal','Quote has been distributed','Quote sent to','Quote resent to','Ip address','Distribution method','Quote SMS reminder sent to','Sent to','Quote','Customer name','Address','Quote date','Due date','Our ref','Your ref','Delivery method','Product name','Quantity','Unit','Unit price','MVA','Discount','Total price','Kilogram','Piece','Meter','Hours','Not started','Ongoing','Completed','Open','Processing','Delivered','Task type','Order status','Zip','Schedule date','Deadline date','Task name','Task status','Location','City','Due date','Description','Do not follow up','$fllu_stts','No follow up','$fllu_act','Old status','New status','$fllu_date','Old value','New value','Delivery name','Delivery address1','Delivery address2','Delivery zip','Delivery city','Delivery country','Delivery method','Quote date','Due date','Our ref','Your ref','Order','Order date','Our reference','Your reference','View','records','of','Page','Found total','records','line_modified','Order date','Order number','task_modified','Old task type','Old task name','Old task status','Old location','Old zip','Old city','Old country','Old schedule date','Old deadline date','Old description','Task Old status','New task type','New task name','New task status','New location','New zip','New city','New country','New schedule date','New deadline date','New description','Task New status','order_distributed','line_added'],						
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/orders/getOrderNewHistory.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				oh_dt = complet_data.response.response;
				oh_td = complet_data.response.response.translationsData;
				order_history.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',oh_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',oh_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		if(checkNull(oh_dt.getAllOrderStatusList) != ''){
			order_statuses = oh_dt.getAllOrderStatusList;
		}
		else{
			order_statuses = {
				1:'',
				2:oh_td.Senttocustomer,
				3:oh_td.Accepted,
				4:oh_td.Declined,
				5:oh_td.Open,
				6:oh_td.Processing,
				7:oh_td.Delivered,
				7:oh_td.Cancelled
			};
		
		}
		task_types = oh_dt.task_types;
		for(var j in oh_dt.getCancellationReasonList){
			var d = oh_dt.getCancellationReasonList[j].CancellationReason;
			cancellationReason[j] = d.reason;
		}

		oh_dt.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';

		if(checkNull(od_dt.getAllOrderStatusList) != ''){
			order_statusz = od_dt.getAllOrderStatusList;
			delete order_statusz[1];
		}
		else{
			order_statusz = {
				1:'',
				2:od_td.Senttocustomer,
				3:od_td.Accepted,
				4:od_td.Declined,
				5:od_td.Open,
				6:od_td.Processing,
				7:od_td.Delivered,
				8:od_td.Cancelled
			};
		}

		defaultFollowupStatus = {
			'new':oh_td.New,
			'open':oh_td.Open,
			'completed':oh_td.Completed,
			'cancelled':oh_td.Cancelled,
			'deleted':oh_td.Deleted,
		};

		product_units = {
			1:oh_td.Kilogram,
			2:oh_td.Piece,
			3:oh_td.Meter,
			4:oh_td.Hours,
		};
		
		task_statuses = {
			'yet':oh_td.Notstarted,
			'run':oh_td.Ongoing,
			'comp':oh_td.Completed,
			'open':oh_td.Open,
		};

		var template = document.getElementById('order_history_template').innerHTML;
		var compiledRendered = Template7(template, oh_dt);
		document.getElementById(oh_tabid).innerHTML = compiledRendered;
		order_history.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		order_history.generateTable(oh_dt.getOrderHistory.orderHistoryList	);
	},
	generateTable:function(data){
		var changedby = '';

		if(checkNull(oh_dt.userFirstName) != '' && checkNull(oh_dt.userLastName) != ''){
			changedby += oh_dt.userFirstName+', '+oh_dt.userLastName;
		}
		else if(checkNull(oh_dt.userFirstName) != ''){
			changedby += oh_dt.userFirstName;
		}
		else if(checkNull(oh_dt.userLastName) != ''){
			changedby += oh_dt.userLastName;
		}
		var ccount = 0;
		for(var j in data){
			var qh = data[j].OrderHistory;

			var q = data[j].Order;
			if("order_number" in q){
				$('#oh_ord_no').html(q.order_number);
			}
			
			var d = {};

			if(checkNull(qh.description) != ''){
				d = JSON.parse(qh.description);
			}

			var tr = '<tr class="row_'+j+'">';
				tr += '<td><span class="row-details row-details_'+j+' row-details-close" onclick="order_history.showHideRow('+j+')"></span></td>';
				tr += '<td>';
					if("log_date" in qh && checkNull(qh.log_date) != ''){
						tr += convertDateIntoSiteFormat(checkNull(qh.log_date));
						tr += '&nbsp;'+moment(checkNull(qh.log_date)).format('HH:mm'); 
					}
				tr += '</td>';
				
				tr += '<td>';
					var v = ''
					if("field" in d && "new_value" in d.field){
						var v = d.field.new_value;
					}
					
					if("flag" in qh && checkNull(qh.flag) == 'new_status'){

						var val = checkNull(order_statusz[v]) != ''?order_statusz[v]:'';
						tr += oh_td.Newstatus+': '+val;
					}
					else if("flag" in qh && checkNull(qh.flag) == 'quote_followup_status_changed'){
						//defaultFollowupStatus
						var val = checkNull(defaultFollowupStatus[v]) != ''?defaultFollowupStatus[v]:'';
						tr += checkNull(oh_td[qh.flag])+' #'+ d.followup_id+' : '+val ;
					}
					else if("flag" in qh && (checkNull(qh.flag) == 'quote_followup_created' || checkNull(qh.flag) == 'quote_followup_deleted')){
						tr += checkNull(oh_td[qh.flag]);
						if(checkNull(d.followup_id) != ''){
							tr += ' #'+ d.followup_id ;
						}
						
					}
					else{
						tr += checkNull(oh_td[qh.flag]);
					}
				tr += '</td>';

				tr += '<td>';
					if("changed_by" in d && checkNull(d.changed_by).trim() != ''){
						tr += d.changed_by.trim();
					}
					else{
						tr += changedby;
					}
				tr += '</td>';

				

			tr += '</tr>';


			var history_id =  checkNull(qh.id) != ''?qh.id:'';
			var flag = checkNull(qh.flag) != ''?qh.flag:'';
			var ip_address= checkNull(qh.ip_address) != ''?qh.ip_address:'';

			var quote_number = '';
			var customer_name = '';
			var desc = '';
			var address1 = '';
			var address2 = '';
			var zip = '';
			var city = '';
			var address = '';
			var location = '';
			var country = '';
			var created = '';
			var due_date = '';
			var your_ref = '';
			var our_ref = '';
			var delivery_method_name = '';

			if("Quote" in d && checkNull(d.Quote) != ''){
				quote_number = checkNull(d.Quote.quote_number) != ''?d.Quote.quote_number:oh_meta.quote_id;
				customer_name = checkNull(d.Quote.customer_name) != ''?d.Quote.customer_name:'';
				desc = checkNull(d.Quote.description) != ''?d.Quote.description:'';
				address1 = checkNull(d.Quote.address1) != ''?d.Quote.address1:'';
				address2 = checkNull(d.Quote.address2) != ''?d.Quote.address2:'';
				
				zip = checkNull(d.Quote.zip) != ''?d.Quote.zip:'';
				city = checkNull(d.Quote.city) != ''?d.Quote.city:'';
				if(address2 != ''){
					address = address1 +', '+address2;
				}
				else{
					address = address2;
				}
				location = zip + ', '+city;
				country_code = checkNull(d.Quote.country_code) != ''?d.Quote.country_code:'';
				created = checkNull(d.Quote.created) != ''? convertDateIntoSiteFormat(checkNull(d.Quote.created)):'';
				due_date = checkNull(d.Quote.due_date) != ''?convertDateIntoSiteFormat(checkNull(d.Quote.due_date)):'';

				your_ref = checkNull(d.Quote.your_ref) != ''?d.Quote.your_ref:'';
				our_ref = checkNull(d.Quote.our_ref) != ''?d.Quote.our_ref:'';
				delivery_method_name = checkNull(d.Quote.delivery_method_name) != ''?d.Quote.delivery_method_name:'';
			}

			var table = '';
			
			if(flag == 'status_changed'){
			}
			else if(flag == 'new_status'){
				var old_status  = '';
				if("field" in d && "old_value" in d.field){
					var v = checkNull(d.field.old_value);
					old_status = checkNull(order_statusz[v]) != ''?order_statusz[v]:'';
				}
				
				var new_status = '';
				if("field" in d && "new_value" in d.field){
					var v = checkNull(d.field.new_value);
					new_status = checkNull(order_statusz[v]) != ''?order_statusz[v]:'';
				}
				var cancellation_reason = '';
				if("cancellation_reason" in d){
					new_status = checkNull(order_statusz[v]) != ''?order_statusz[v]:'';
					var v = checkNull(d.cancellation_reason) != ''?d.cancellation_reason:'';
					cancellation_reason = checkNull(cancellationReason[v]) != ''?cancellationReason[v]:'';
				}
			
				var note = '';
				if("note" in d){
					note = checkNull(d.note) != ''?d.note:'';
				}
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				else{
					if("customer_name" in d && checkNull(d.customer_name) != ''){
						changed_by = d.customer_name;
					}
				}

				table += '<table class="span10 pull-left" id="change_status_'+history_id+'">';
					
					table += '<tr onmouseout="order_history.popup_close()">';
						table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Oldstatus+': </td>';
						table += '<td class="span9 resent">'+old_status+'</td>';
					table += '</tr>';

					table += '<tr onmouseout="order_history.popup_close()">';
						table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Newstatus+': </td>';
						table += '<td class="span9 resent">'+new_status+'</td>';
					table += '</tr>';

					if("field" in d && "new_value" in d.field && checkNull(d.field.new_value) != '' ){
						table += '<tr onmouseout="order_history.popup_close()">';
							if(d.field.new_value == '3'){
								table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Acceptedby+'</td>';
							}
							else if(d.field.new_value == '4'){
								table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Declinedby+'</td>';
							}
							else{
								table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Statuschangedby+'</td>';
							}
							table += '<td class="span9 resent">'+changed_by+'</td>';
						table += '</tr>';
					}

					if(cancellation_reason != ''){
						table += '<tr onmouseout="order_history.popup_close()">';
							table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Cancellationreason+': </td>';
							table += '<td class="span9 resent">'+cancellation_reason+'</td>';
						table += '</tr>';
					}
					if(note != ''){
						table += '<tr onmouseout="order_history.popup_close()">';
							table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Note+': </td>';
							table += '<td class="span9 resent">';
								table += '<span data-original-title="'+oh_td.Note+'" data-content="'+note+'" data-placement="right" data-trigger="popover" class="popovers"><i class="icon-book"></i></span>';
							table += '</td>';
						table += '</tr>';
					}
				table += '<table>';
			}
			else if(flag == 'quote_accepted'){
				var old_status  = '';
				if("field" in d && "old_value" in d.field){
					var v = checkNull(d.field.old_value);
					old_status = checkNull(order_statusz[v]) != ''?order_statusz[v]:'';
				}
				
				var new_status = '';
				if("field" in d && "new_value" in d.field){
					var v = checkNull(d.field.new_value);
					new_status = checkNull(order_statusz[v]) != ''?order_statusz[v]:'';
				}

				table += '<table class="span10 pull-left" id="change_status_'+history_id+'">';
						
						table += '<tr onmouseout="order_history.popup_close()">';
							table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Oldstatus+': </td>';
							table += '<td class="span9 resent">'+old_status+'</td>';
						table += '</tr>';

						table += '<tr onmouseout="order_history.popup_close()">';
							table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Newstatus+': </td>';
							table += '<td class="span9 resent">'+new_status+'</td>';
						table += '</tr>';

				table += '</table>';
			}
			else if(flag == 'quote_declined'){
				var old_status  = '';
				if("field" in d && "old_value" in d.field){
					var v = checkNull(d.field.old_value);
					old_status = checkNull(order_statusz[v]) != ''?order_statusz[v]:'';
				}
				
				var new_status = '';
				if("field" in d && "new_value" in d.field){
					var v = checkNull(d.field.new_value);
					new_status = checkNull(order_statusz[v]) != ''?order_statusz[v]:'';
				}
				var cancellation_reason = '';
				if("cancellation_reason" in d){
					new_status = checkNull(order_statusz[v]) != ''?order_statusz[v]:'';
					var v = checkNull(d.cancellation_reason) != ''?d.cancellation_reason:'';
					cancellation_reason = checkNull(cancellationReason[v]) != ''?cancellationReason[v]:'';
				}
			
				var note = '';
				if("note" in d){
					note = checkNull(d.note) != ''?d.note:'';
				}
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				else{
					if("customer_name" in d && checkNull(d.customer_name) != ''){
						changed_by = d.customer_name;
					}
				}

				table += '<table class="span10 pull-left" id="change_status_'+history_id+'">';
					
					table += '<tr onmouseout="order_history.popup_close()">';
						table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Oldstatus+': </td>';
						table += '<td class="span9 resent">'+old_status+'</td>';
					table += '</tr>';

					table += '<tr onmouseout="order_history.popup_close()">';
						table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Newstatus+': </td>';
						table += '<td class="span9 resent">'+new_status+'</td>';
					table += '</tr>';

					table += '<tr onmouseout="order_history.popup_close()">';
						table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Declinedby+': </td>';
						table += '<td class="span9 resent">'+changed_by+'</td>';
					table += '</tr>';
				table += '<table>';
			}
			else if(flag == 'quote_send'){
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				else{
					if("customer_name" in d && checkNull(d.customer_name) != ''){
						changed_by = d.customer_name;
					}
				}

				var send_to = '';
				if("send_to" in d && checkNull(d.send_to) != ''){
					send_to = d.send_to;
				}

				var method = '';
				if("method" in d && checkNull(d.method) != ''){
					method = d.method;
				}

				var sendTo = '';
				if("email_addresses" in d && checkNull(d.email_addresses) != ''){
					var emailAddress = d.email_addresses;
					if(checkNull(emailAddress) != '' && checkNull(send_to) != ''){
						sendTo = send_to+', '+emailAddress;
					}
					else if(checkNull(emailAddress) == '' && checkNull(send_to) != ''){
						sendTo = send_to;
					}
					else if(checkNull(emailAddress) != '' && checkNull(send_to) == ''){
						sendTo = emailAddress;
					}
					else{
						sendTo = send_to;
					}
				}
				else{
					sendTo = send_to;
				}

				var customer_address1 = '';
				if("customer_address1" in d && checkNull(d.customer_address1) != ''){
					customer_address1 = d.customer_address1;
				}

				var customer_address2 = '';
				if("customer_address2" in d && checkNull(d.customer_address2) != ''){
					customer_address2 = d.customer_address2;
				}

				var customer_zip = '';
				if("customer_zip" in d && checkNull(d.customer_zip) != ''){
					customer_zip = d.customer_zip;
				}

				var customer_city = '';
				if("customer_city" in d && checkNull(d.customer_city) != ''){
					customer_city = d.customer_city;
				}

				var customer_address = '';
				if(customer_address2 != ''){
					customer_address = customer_address1+', '+customer_address2;
				}
				else{
					customer_address = customer_address1;
				}

				var distribution_method = '';
				var distribution = '';

				if("distribution_method" in d && checkNull(d.distribution_method) != ''){
					distribution_method = d.distribution_method;
				}
				
				if(distribution_method == 'local'){
					distribution = oh_td.LocalPrintQueue;
				}else if(distribution_method == 'remote'){
					distribution = oh_td.RemotePrintQueue;
				}else if(distribution_method == 'immediate'){
					distribution = oh_td.Directprinting;
				}

				var full_address = oh_td.Postal;

				if(checkNull(customer_address) != '' && checkNull(customer_zip) != '' && checkNull(customer_city) != ''){
					full_address = customer_address+'<br />'+customer_zip+'&nbsp;&nbsp;'+customer_city+'<br />';
				}
				else if(checkNull(customer_address) == '' && checkNull(customer_zip) != '' && checkNull(customer_city) != ''){
					full_address = customer_zip+'&nbsp;&nbsp;'+customer_city+'<br />';
				}
				else if(checkNull(customer_address) != '' && checkNull(customer_zip) == '' && checkNull(customer_city) != ''){
					full_address = customer_address+'<br />'+customer_city+'<br />';
				}
				else{
					full_address = customer_address+'<br />'+customer_zip+'<br />';
				}

				table += '<table class="span12"><tr>';
					table += '<td class="span3 sent">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';
									
				if(distribution != ''){
					table += '<table class="span12"><tr>';
						table += '<td class="span3 sent">'+oh_td.Distributionmethod+':</td>';
						table += '<td class="span9 resent">'+distribution+'</td>';
					table += '</tr></table>';
				}	
									

				if(changed_by == 'EA'){
					var new_address = '-';
					if("new_address" in d && checkNull(d.new_address) != ''){
						new_address = d.new_address;
					}
					var message = '';
					if(new_address == 1){
						if("message" in d && checkNull(d.message) != ''){
							message = d.message;
						}
					}

					table += '<table class="span6 pull-left" style="margin-left:0px">';
						table += '<tr><td style="display: inline;" class="">'+message+'</td></tr>';
					table += '</table>';
				}
				else{
					table += '<table class="span12">';
					if(method == 3){
						table += '<tr>';
							table += '<td class="span3 sent">';
								table += oh_td.Quotehasbeendistributed;
							table += '</td>';
							table += '<td class="span9 sent">';
								table += full_address+sendTo;
							table += '</td>';
						table += '</tr>';
					}
					else{
						table += '<tr>';
							table += '<td class="span3 sent">';
								table += oh_td.Quotesentto;
							table += '</td>';
							table += '<td class="span9 sent">';
								table += sendTo;
							table += '</td>';
						table += '</tr>';
					}
				}
			}
			else if(flag == 'quote_resend'){
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				else{
					if("customer_name" in d && checkNull(d.customer_name) != ''){
						changed_by = d.customer_name;
					}
				}

				var send_to = '';
				if("send_to" in d && checkNull(d.send_to) != ''){
					send_to = d.send_to;
				}

				var method = '';
				if("method" in d && checkNull(d.method) != ''){
					method = d.method;
				}

				var sendTo = '';
				if("email_addresses" in d && checkNull(d.email_addresses) != ''){
					var emailAddress = d.email_addresses;
					if(checkNull(emailAddress) != '' && checkNull(send_to) != ''){
						sendTo = send_to+', '+emailAddress;
					}
					else if(checkNull(emailAddress) == '' && checkNull(send_to) != ''){
						sendTo = send_to;
					}
					else if(checkNull(emailAddress) != '' && checkNull(send_to) == ''){
						sendTo = emailAddress;
					}
					else{
						sendTo = send_to;
					}
				}
				else{
					sendTo = send_to;
				}

				var customer_address1 = '';
				if("customer_address1" in d && checkNull(d.customer_address1) != ''){
					customer_address1 = d.customer_address1;
				}

				var customer_address2 = '';
				if("customer_address2" in d && checkNull(d.customer_address2) != ''){
					customer_address2 = d.customer_address2;
				}

				var customer_zip = '';
				if("customer_zip" in d && checkNull(d.customer_zip) != ''){
					customer_zip = d.customer_zip;
				}

				var customer_city = '';
				if("customer_city" in d && checkNull(d.customer_city) != ''){
					customer_city = d.customer_city;
				}

				var customer_address = '';
				if(customer_address2 != ''){
					customer_address = customer_address1+', '+customer_address2;
				}
				else{
					customer_address = customer_address1;
				}

				var distribution_method = '';
				var distribution = '';

				if("distribution_method" in d && checkNull(d.distribution_method) != ''){
					distribution_method = d.distribution_method;
				}
				
				if(distribution_method == 'local'){
					distribution = oh_td.LocalPrintQueue;
				}else if(distribution_method == 'remote'){
					distribution = oh_td.RemotePrintQueue;
				}else if(distribution_method == 'immediate'){
					distribution = oh_td.Directprinting;
				}

				var full_address = oh_td.Postal;

				if(checkNull(customer_address) != '' && checkNull(customer_zip) != '' && checkNull(customer_city) != ''){
					full_address = customer_address+'<br />'+customer_zip+'&nbsp;&nbsp;'+customer_city+'<br />';
				}
				else if(checkNull(customer_address) == '' && checkNull(customer_zip) != '' && checkNull(customer_city) != ''){
					full_address = customer_zip+'&nbsp;&nbsp;'+customer_city+'<br />';
				}
				else if(checkNull(customer_address) != '' && checkNull(customer_zip) == '' && checkNull(customer_city) != ''){
					full_address = customer_address+'<br />'+customer_city+'<br />';
				}
				else{
					full_address = customer_address+'<br />'+customer_zip+'<br />';
				}

				table += '<table class="span12"><tr>';
					table += '<td class="span3 sent">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';
									
				if(distribution != ''){
					table += '<table class="span12"><tr>';
						table += '<td class="span3 sent">'+oh_td.Distributionmethod+':</td>';
						table += '<td class="span9 resent">'+distribution+'</td>';
					table += '</tr></table>';
				}	
									

				if(changed_by == 'EA'){
					var new_address = '-';
					if("new_address" in d && checkNull(d.new_address) != ''){
						new_address = d.new_address;
					}
					var message = '';
					if(new_address == 1){
						if("message" in d && checkNull(d.message) != ''){
							message = d.message;
						}
					}

					table += '<table class="span6 pull-left" style="margin-left:0px">';
						table += '<tr><td style="display: inline;" class="">'+message+'</td></tr>';
					table += '</table>';
				}
				else{
					table += '<table class="span12">';
					if(method == 3){
						table += '<tr>';
							table += '<td class="span3 sent">';
								table += oh_td.Quotehasbeendistributed;
							table += '</td>';
							table += '<td class="span9 sent">';
								table += full_address+sendTo;
							table += '</td>';
						table += '</tr>';
					}
					else{
						table += '<tr>';
							table += '<td class="span3 sent">';
								table += oh_td.Quoteresentto;
							table += '</td>';
							table += '<td class="span9 sent">';
								table += sendTo;
							table += '</td>';
						table += '</tr>';
					}
				}
			}
			else if(flag == 'quote_sms_followup_sent'){
				var country_1 = '';
				if("customer_country" in d && checkNull(d.customer_country) != ''){
					country_1 = d.customer_country;
				}
				var customer_name = '';
				if("customer_name" in d && checkNull(d.customer_name) != ''){
					customer_name = d.customer_name;
				}
				var customer_cellphone = '';
				if("customer_cellphone" in d && checkNull(d.customer_cellphone) != ''){
					customer_cellphone = d.customer_cellphone;
				}
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				var cp_code = '';
				if("cp_code" in d && checkNull(d.cp_code) != ''){
					cp_code = d.cp_code;
				}
				
				var numbr = customer_cellphone;
				
				//$	 = $this->Common->format_contact_number($cp_code.' '.$customer_cellphone,$country_1);
				
				var sendTo = '[ '+customer_name+' ]'+' '+'[ '+numbr+' ]';

				table += '<table class="span12"><tr>';
					table += '<td class="span3 sent">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';

				table += '<table class="span12"><tr>';
					table += '<td class="span4 sent_quote">'+oh_td.QuoteSMSremindersentto+':</td>';
					table += '<td class="span9 resent">'+sendTo+'</td>';
				table += '</tr></table>';
			}
			else if(flag == 'quote_distributed'){

				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				else{
					if("customer_name" in d && checkNull(d.customer_name) != ''){
						changed_by = d.customer_name;
					}
				}

				var resendTo = '';

				if("email_addresses" in d && checkNull(d.email_addresses) != ''){
					resendTo = d.email_addresses;
				}

				var customer_address1 = '';
				if("customer_address1" in d && checkNull(d.customer_address1) != ''){
					customer_address1 = d.customer_address1;
				}

				var customer_address2 = '';
				if("customer_address2" in d && checkNull(d.customer_address2) != ''){
					customer_address2 = d.customer_address2;
				}

				var customer_zip = '';
				if("customer_zip" in d && checkNull(d.customer_zip) != ''){
					customer_zip = d.customer_zip;
				}

				var customer_city = '';
				if("customer_city" in d && checkNull(d.customer_city) != ''){
					customer_city = d.customer_city;
				}

				var customer_address = '';
				if(customer_address2 != ''){
					customer_address = customer_address1+', '+customer_address2;
				}
				else{
					customer_address = customer_address1;
				}

				var distribution_method = '';
				var distribution = '';

				if("distribution_method" in d && checkNull(d.distribution_method) != ''){
					distribution_method = d.distribution_method;
				}
				
				if(distribution_method == 'local'){
					distribution = oh_td.LocalPrintQueue;
				}else if(distribution_method == 'remote'){
					distribution = oh_td.RemotePrintQueue;
				}else if(distribution_method == 'immediate'){
					distribution = oh_td.Directprinting;
				}

				var full_address = oh_td.Postal;

				if(checkNull(customer_address) != '' && checkNull(customer_zip) != '' && checkNull(customer_city) != ''){
					full_address = customer_address+'<br />'+customer_zip+'&nbsp;&nbsp;'+customer_city+'<br />';
				}
				else if(checkNull(customer_address) == '' && checkNull(customer_zip) != '' && checkNull(customer_city) != ''){
					full_address = customer_zip+'&nbsp;&nbsp;'+customer_city+'<br />';
				}
				else if(checkNull(customer_address) != '' && checkNull(customer_zip) == '' && checkNull(customer_city) != ''){
					full_address = customer_address+'<br />'+customer_city+'<br />';
				}
				else{
					full_address = customer_address+'<br />'+customer_zip+'<br />';
				}

				table += '<table class="span12"><tr>';
					table += '<td class="span3 sent">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';
									
				if(distribution != ''){
					table += '<table class="span12"><tr>';
						table += '<td class="span3 sent">'+oh_td.Distributionmethod+':</td>';
						table += '<td class="span9 resent">'+distribution+'</td>';
					table += '</tr></table>';
				}	
									
				table += '<table class="span12 pull-left"><tr>';
					table += '<td class="span3 sent">';
						table += oh_td.Sentto;
					table += '</td>';
					table += '<td class="span9 sent">';
						table += full_address+resendTo;
					table += '</td>';
				table += '</tr></table>';
			}
			else if(flag == 'quote_created'){
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				if("Quote" in d && checkNull(d.Quote) != ''){
					table += '<table class="span6 pull-left">';
						table += '<tr>';
							table += '<td style="width:38% !important;">'+oh_td.Ipaddress+':</td>';
							table += '<td style="width:200px !important;">'+ip_address+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td class="" style="">'+oh_td.Quote+':</td>';
							table += '<td style="">'+quote_number+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td class="" style="">'+oh_td.Customername+':</td>';
							table += '<td style="">'+customer_name+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td class="" style="" valign="top">'+oh_td.Address+':</td>';
							table += '<td class="span2">'+address+'<br/>'+location+'<br/>'+country+'</td>';
						table += '</tr>';
					table += '</table>';
					
					table += '<table class="span6 pull-right">';
						table += '<tr><td class="" style="width:38%  !important;"></td><td class="" style="width:200px !important;"></td></tr>';

						table += '<tr>';
							table += '<td class="" style="" valign="top">'+oh_td.Orderdate+':</td>';
							table += '<td class="span2">'+created+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td class="" style="" valign="top">'+oh_td.Duedate+':</td>';
							table += '<td class="span2">'+due_date+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td class="" style="" valign="top">'+oh_td.Ourref+':</td>';
							table += '<td class="span2">'+our_ref+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td class="" style="" valign="top">'+oh_td.Yourref+':</td>';
							table += '<td class="span2">'+your_ref+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td class="" style="" valign="top">'+oh_td.Deliverymethod+':</td>';
							table += '<td class="span2">'+delivery_method_name+'</td>';
						table += '</tr>';
					table += '</table><br /><br /><br />';

				}
				if("QuoteLine" in d && checkNull(d.QuoteLine) != ''){
					var lines = d.QuoteLine;

					table += '<table class="table table-striped table-hover table-bordered table_bordered pull-left no-more-tables table-full-width">';
					table += '<tr class="cf">';
					
						table += '<th class="product_lines" style="width:16%">'+oh_td.Productname+'</th>';
						table += '<th class="product_lines" style="width:13%">'+oh_td.Quantity+'</th>';
						table += '<th class="product_lines" style="width:13%">'+oh_td.Unit+'</th>';
						table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Unitprice+'</th>';
						table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.MVA+'</th>';
						table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Discount+'</th>';
						table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Totalprice+'</th>';
					table += '</tr>';
						for(var p in lines){

							var l = lines[p];

							var product_name = checkNull(l.product_name) != ''?l.product_name:'';
							var quantity = checkNull(l.qty) != ''?convertIntoLocalFormat(l.qty):'';
							var unit_price = checkNull(l.unit_price) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.unit_price):'';
							var u = checkNull(l.unit_id);
							var unit = checkNull(product_units[u]);
							var tax = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.tax));
							var discount = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.discount));
							var total_amount = checkNull(l.gross_amount) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.gross_amount):'';
						

							table += '<tr class="data-column">';
								table += '<td data-title="'+oh_td.Productname+'" class="product_lines">';
									table += product_name;
								table += '</td>';

								table += '<td data-title="'+oh_td.Quantity+'" class="product_lines">';
									table += quantity;
								table += '</td>';

								table += '<td data-title="'+oh_td.Unit+'" class="product_lines">';
									table += unit;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.Unitprice+'" class="product_lines">';
									table += unit_price;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.MVA+'" class="product_lines">';
									table += tax;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.Discount+'" class="product_lines">';
									table += discount;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.Totalprice+'" class="product_lines">';
									table += total_amount;
								table += '</td>';
							table += '</tr>';
						}
					table += '</table>';
				}				
			}
			else if(flag == 'new_task'){
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				if("created_by" in d && checkNull(d.created_by) != ''){
					changed_by = d.created_by;
				}

				
				var customer_name = '';
				if("customer_name" in d && checkNull(d.customer_name) != ''){
					customer_name = d.customer_name;
				}

				var task_type = '';
				if("task_type" in d && checkNull(d.task_type) != ''){
					var v = d.task_type;
					task_type = checkNull(task_types[d],'-');
				}
				var task_status = '';
				if("task_status" in d && checkNull(d.task_status) != ''){
					var v = d.task_status;
					task_status = checkNull(task_statuses[v]);
					if(task_status == ''){
						task_status = '-';
					}
				}
				else{
					task_status = '-';
				}

				var task_name = '';
				if("task_name" in d && checkNull(d.task_name) != ''){
					task_name = d.task_name;
				}
				var location = '';
				if("location" in d && checkNull(d.location) != ''){
					location = d.location;
				}
				var zip = '';
				if("zip" in d && checkNull(d.zip) != ''){
					zip = d.zip;
				}
				var city = '';
				if("city" in d && checkNull(d.city) != ''){
					city = d.city;
				}
				var schedule_date = '';
				if("schedule_date" in d && checkNull(d.schedule_date) != ''){
					schedule_date = d.schedule_date;
				}
				var due_date = '';
				if("due_date" in d && checkNull(d.due_date) != ''){
					due_date = d.due_date;
				}
				var deadline_date = '';
				if("deadline_date" in d && checkNull(d.deadline_date) != ''){
					deadline_date = d.deadline_date;
				}
				var task_description = '';
				if("task_description" in d && checkNull(d.task_description) != ''){
					task_description = d.task_description;
				}
				var order_status = '';
				if("order_status" in d && checkNull(d.order_status) != ''){
					var v = d.order_status;
					order_status = checkNull(order_statuses[v]);
					if(order_status == ''){
						order_status = '-';
					}
				}
				else{
					order_status = '-';
				}

				table += '<table class="span6 pull-left">';
					table += '<tr>';
						table += '<td class="span12" style="width:38% !important;">'+oh_td.Ipaddress+':</td>';
						table += '<td style="width:200px !important;">'+ip_address+'</td>';
					table += '</tr>';

					table += '<tr>';
						table += '<td >'+oh_td.Tasktype+':</td>';
						table += '<td >'+task_type+'</td>';
					table += '</tr>';

					table += '<tr>';
						table += '<td >'+oh_td.Orderstatus+':</td>';
						table += '<td >'+order_status+'</td>';
					table += '</tr>';

					if(checkNull(zip) != ''){
						table += '<tr>';
							table += '<td >'+oh_td.Zip+':</td>';
							table += '<td >'+zip+'</td>';
						table += '</tr>';
					}

					if(checkNull(schedule_date) != ''){
						table += '<tr>';
							table += '<td >'+oh_td.Scheduledate+':</td>';
							table += '<td >'+schedule_date+'</td>';
						table += '</tr>';
					}

					if(checkNull(schedule_date) != ''){
						table += '<tr>';
							table += '<td >'+oh_td.Deadlinedate+':</td>';
							table += '<td >'+deadline_date+'</td>';
						table += '</tr>';
					}

				table += '</table>';

				table += '<table class="span6 pull-left">';
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Taskname+':</td>';
							table += '<td style="width:200px !important;">'+task_name+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td >'+oh_td.Taskstatus+':</td>';
							table += '<td >'+task_status+'</td>';
						table += '</tr>';

						if(checkNull(location) != ''){
							table += '<tr>';
								table += '<td >'+oh_td.Location+':</td>';
								table += '<td >'+location+'</td>';
							table += '</tr>';
						}

						if(checkNull(city) != ''){
							table += '<tr>';
								table += '<td >'+oh_td.City+':</td>';
								table += '<td >'+city+'</td>';
							table += '</tr>';
						}

						if(checkNull(due_date) != ''){
							table += '<tr>';
								table += '<td >'+oh_td.Duedate+':</td>';
								table += '<td >'+due_date+'</td>';
							table += '</tr>';
						}

						if(checkNull(task_description) != ''){
							table += '<tr>';
								table += '<td >'+oh_td.Description+':</td>';
								table += '<td >'+task_description+'</td>';
							table += '</tr>';
						}
				table += '</table>';				
			}
			else if(flag == 'quote_followup'){
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				table += '<table class="span4"><tr>';
					table += '<td style="width:110px !important;">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';

				table += '<div class="row-fluid"><div class="span12">';
				table += '<table class="span6">';
				table += '<tr></tr>';
				if("reminder_flag" in d && checkNull(d.reminder_flag) == '0'){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+oh_td.Donotfollowup+':</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d && checkNull(d.reminder_followup_status) != ''){
					var followuptext = ''
					if("reminder_name" in d && checkNull(d.reminder_name) != ''){
						followuptext = d.reminder_name;
					}
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+followuptext+'</td>';
					table += '</tr>';

					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_date+':</td>';
						var reminder_followup_date = '';
						if("reminder_followup_date" in d && checkNull(d.reminder_followup_date) != ''){
							reminder_followup_date = d.reminder_followup_date;
						}
						table += '<td class="">'+convertDateIntoSiteFormat(reminder_followup_date)+'</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d ){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';

						table += '<td class="">'+oh_td.Nofollowup+'</td>';
					table += '</tr>';
				}
						
				table += '<tr></tr>';
				table += '</table>';
				table += '</div></div>';
			}
			else if(flag == 'quote_followup_created'){
				table += '<table class="span4"><tr>';
					table += '<td style="width:110px !important;">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';

				table += '<div class="row-fluid"><div class="span12">';
				table += '<table class="span7" id="change_status_'+history_id+'">';
				if("reminder_flag" in d && checkNull(d.reminder_flag) == '0'){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+oh_td.Donotfollowup+':</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d && checkNull(d.reminder_followup_status) != ''){
					var followuptext = ''
					if("reminder_name" in d && checkNull(d.reminder_name) != ''){
						followuptext = d.reminder_name;
					}
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+followuptext+'</td>';
					table += '</tr>';

					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_date+':</td>';
						var reminder_followup_date = '';
						if("reminder_followup_date" in d && checkNull(d.reminder_followup_date) != ''){
							reminder_followup_date = d.reminder_followup_date;
						}
						table += '<td class="">'+convertDateIntoSiteFormat(reminder_followup_date)+'</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d ){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';

						table += '<td class="">'+oh_td.Nofollowup+'</td>';
					table += '</tr>';
				}

				if("action" in d && d.action == 'followup_added'){
					var followup_entry = '';
					if("followup_entry" in d && checkNull(d.followup_entry) != '' ){
						followup_entry = d.followup_entry;
					}

					var followup_status = '';
					if("followup_status" in d && checkNull(d.followup_status) != '' ){
						followup_status = d.followup_status;
					}

					var note = '';
					if("note" in d && checkNull(d.note) != '' ){
						note = d.note;
					}

					if(checkNull(followup_entry) != ''){
						table += '<tr>';
							table += '<td class="span3 sent">'+oh_td.$fllu_act+':</td>';
							table += '<td class="span9 resent">'+followup_entry+'</td>';
						table += '</tr>';
					}

					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+followup_status+'</td>';
					table += '</tr>';

					if(note != ''){
						table += '<tr onmouseout="order_history.popup_close()">';
							table += '<td class="span3 sent" style="margin-left:0px">'+oh_td.Note+': </td>';
							table += '<td class="span9 resent">';
								table += '<span data-original-title="'+oh_td.Note+'" data-content="'+note+'" data-placement="right" data-trigger="popover" class="popovers"><i class="icon-book"></i></span>';
							table += '</td>';
						table += '</tr>';
					}


				}

				table += '<tr></tr>';
				table += '</table>';
				table += '</div></div>';
			}
			else if(flag == 'quote_followup_status_changed'){
				table += '<table class="span4"><tr>';
					table += '<td style="width:110px !important;">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';

				table += '<div class="row-fluid"><div class="span12">';
				table += '<table class="span7">';
				if("reminder_flag" in d && checkNull(d.reminder_flag) == '0'){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+oh_td.Donotfollowup+':</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d && checkNull(d.reminder_followup_status) != ''){
					var followuptext = ''
					if("reminder_name" in d && checkNull(d.reminder_name) != ''){
						followuptext = d.reminder_name;
					}
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+followuptext+'</td>';
					table += '</tr>';

					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_date+':</td>';
						var reminder_followup_date = '';
						if("reminder_followup_date" in d && checkNull(d.reminder_followup_date) != ''){
							reminder_followup_date = d.reminder_followup_date;
						}
						table += '<td class="">'+convertDateIntoSiteFormat(reminder_followup_date)+'</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d ){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';

						table += '<td class="">'+oh_td.Nofollowup+'</td>';
					table += '</tr>';
				}

				if("action" in d && d.action == 'quote_followup_status_changed'){
					var followup_entry = '';
					if("followup_entry" in d && checkNull(d.followup_entry) != '' ){
						followup_entry = d.followup_entry;
					}

					var current_followup_status = '';
					if("current_followup_status" in d && checkNull(d.current_followup_status) != '' ){
						current_followup_status = d.current_followup_status;
					}

					var new_followup_status = '';
					if("new_followup_status" in d && checkNull(d.new_followup_status) != '' ){
						new_followup_status = d.new_followup_status;
					}



		

					if(checkNull(followup_entry) != ''){
						table += '<tr>';
							table += '<td class="span3 sent">'+oh_td.$fllu_act+':</td>';
							table += '<td class="span9 resent">'+followup_entry+'</td>';
						table += '</tr>';
					}
					
					table += '<tr>';
						table += '<td class="">'+oh_td.Oldstatus+':</td>';
						table += '<td class="">'+current_followup_status+'</td>';
					table += '</tr>';

					table += '<tr>';
						table += '<td class="">'+oh_td.Newstatus+':</td>';
						table += '<td class="">'+new_followup_status+'</td>';
					table += '</tr>';

				}	
			}
			else if(flag == 'quote_modified'){
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				table += '<table class="span4"><tr>';
					table += '<td style="width:110px !important;">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span2 resent">'+ip_address+'</td>';
				table += '</tr></table>';

				

				if( 
					("customer_name" in d && checkNull(d.customer_name) != '' )
					||
					("delivery_name" in d && checkNull(d.delivery_name) != '' )
					||
					("delivery_address1" in d && checkNull(d.delivery_address1) != '' )
				) {
					table += '<div class="row-fluid" style="margin-top:10px;"><div class="span12">';

						if("customer_name" in d && checkNull(d.customer_name) != ''){
						var old_value = '';
						if("old_value" in d.customer_name && d.customer_name.old_value){
							old_value = d.customer_name.old_value;
						}

						var new_value = '';
						if("new_value" in d.customer_name && d.customer_name.new_value){
							new_value = d.customer_name.new_value;
						}

						table += '<table class="span4">';
							table += '<tr>';
								table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Customername+'</td>';
							table += '</tr>';

							table += '<tr>';
								table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
								table += '<td class="history_change">'+old_value+'</td>';
							table += '</tr>';

							table += '<tr>';
								table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
								table += '<td class="history_change">'+new_value+'</td>';
							table += '</tr>';
						table += '</table>';
						}

						if("delivery_name" in d && checkNull(d.delivery_name) != ''){
							var old_value = '';
							if("old_value" in d.delivery_name && d.delivery_name.old_value){
								old_value = d.delivery_name.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_name && d.delivery_name.new_value){
								new_value = d.delivery_name.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliveryname+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}

						if("delivery_address1" in d && checkNull(d.delivery_address1) != ''){
							var old_value = '';
							if("old_value" in d.delivery_address1 && d.delivery_address1.old_value){
								old_value = d.delivery_address1.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_address1 && d.delivery_address1.new_value){
								new_value = d.delivery_address1.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliveryaddress1+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
					table += '</div></div>';
				}	

				if( 
					("delivery_address2" in d && checkNull(d.delivery_address2) != '' )
					||
					("delivery_zip" in d && checkNull(d.delivery_zip) != '' )
					||
					("delivery_city" in d && checkNull(d.delivery_city) != '' )
				) {	
					table += '<div class="row-fluid"><div class="span12">';
						if("delivery_address2" in d && checkNull(d.delivery_address2) != ''){
							var old_value = '';
							if("old_value" in d.delivery_address2 && d.delivery_address2.old_value){
								old_value = d.delivery_address2.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_address2 && d.delivery_address2.new_value){
								new_value = d.delivery_address2.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliveryaddress2+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("delivery_zip" in d && checkNull(d.delivery_zip) != ''){
							var old_value = '';
							if("old_value" in d.delivery_zip && d.delivery_zip.old_value){
								old_value = d.delivery_zip.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_zip && d.delivery_zip.new_value){
								new_value = d.delivery_zip.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliveryzip+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("delivery_city" in d && checkNull(d.delivery_city) != ''){
							var old_value = '';
							if("old_value" in d.delivery_city && d.delivery_city.old_value){
								old_value = d.delivery_city.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_city && d.delivery_city.new_value){
								new_value = d.delivery_city.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliverycity+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
					table += '</div></div>';
				}

				if( 
					("delivery_country" in d && checkNull(d.delivery_country) != '' )
					||
					("delivery_method" in d && checkNull(d.delivery_method) != '' )
					||
					("created" in d && checkNull(d.created) != '' )
				) {	
					table += '<div class="row-fluid"><div class="span12">';
						if("delivery_country" in d && checkNull(d.delivery_country) != ''){
							var old_value = '';
							if("old_value" in d.delivery_country && d.delivery_country.old_value){
								old_value = d.delivery_country.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_country && d.delivery_country.new_value){
								new_value = d.delivery_country.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliverycountry+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("delivery_method" in d && checkNull(d.delivery_method) != ''){
							var old_value = '';
							if("old_value" in d.delivery_method && d.delivery_method.old_value){
								old_value = d.delivery_method.old_value.DeliveryMethod.method_name;
							}

							var new_value = '';
							if("new_value" in d.delivery_method && d.delivery_method.new_value){
								new_value = d.delivery_method.new_value.DeliveryMethod.method_name;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliverymethod+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("created" in d && checkNull(d.created) != ''){
							var old_value = '';
							if("old_value" in d.created && d.created.old_value){
								old_value = convertDateIntoSiteFormat(checkNull(d.created.old_value));
							}

							var new_value = '';
							if("new_value" in d.created && d.created.new_value){
								new_value = convertDateIntoSiteFormat(checkNull(d.created.new_value));
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Quotedate+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
					table += '</div></div>';
				}

				if( 
					("due_date" in d && checkNull(d.due_date) != '' )
					||
					("our_ref" in d && checkNull(d.our_ref) != '' )
					||
					("your_ref" in d && checkNull(d.your_ref) != '' )
				) {	
					table += '<div class="row-fluid"><div class="span12">';
						if("due_date" in d && checkNull(d.due_date) != ''){
							var old_value = '';
							if("old_value" in d.due_date && checkNull(d.due_date.old_value) != ''){
								old_value = convertDateIntoSiteFormat(d.due_date.old_value);
							}

							var new_value = '';
							if("new_value" in d.due_date && checkNull(d.due_date.new_value)!= ''){
								new_value = convertDateIntoSiteFormat(d.due_date.new_value);
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Duedate+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("our_ref" in d && checkNull(d.our_ref) != ''){
							var old_value = '';
							if("old_value" in d.our_ref && checkNull(d.our_ref.old_value) != ''){
								old_value = d.our_ref.old_value;
							}

							var new_value = '';
							if("new_value" in d.our_ref && checkNull(d.our_ref.new_value) != ''){
								new_value = d.our_ref.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Ourreference+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Ourref+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Ourref+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("your_ref" in d && checkNull(d.your_ref) != ''){
							var old_value = '';
							if("old_value" in d.your_ref && checkNull(d.your_ref.old_value).trim() != ''){
								old_value = d.your_ref.old_value;
							}

							var new_value = '';
							if("new_value" in d.your_ref && checkNull(d.your_ref.new_value).trim() != ''){
								new_value = d.your_ref.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Yourref+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
					table += '</div></div>';
				}
			}
			else if(flag == 'quote_followup_deleted'){
				table += '<table class="span4"><tr>';
					table += '<td style="width:110px !important;">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';

				table += '<div class="row-fluid"><div class="span12">';
				table += '<table class="span7" id="change_status_'+history_id+'">';
				if("reminder_flag" in d && checkNull(d.reminder_flag) == '0'){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+oh_td.Donotfollowup+':</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d && checkNull(d.reminder_followup_status) != ''){
					var followuptext = ''
					if("reminder_name" in d && checkNull(d.reminder_name) != ''){
						followuptext = d.reminder_name;
					}
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+followuptext+'</td>';
					table += '</tr>';

					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_date+':</td>';
						var reminder_followup_date = '';
						if("reminder_followup_date" in d && checkNull(d.reminder_followup_date) != ''){
							reminder_followup_date = d.reminder_followup_date;
						}
						table += '<td class="">'+convertDateIntoSiteFormat(reminder_followup_date)+'</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d ){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';

						table += '<td class="">'+oh_td.Nofollowup+'</td>';
					table += '</tr>';
				}

				if("action" in d && d.action == 'followup_deleted'){
					var followup_entry = '';
					if("followup_entry" in d && checkNull(d.followup_entry) != '' ){
						followup_entry = d.followup_entry;
					}
					if(checkNull(followup_entry) != ''){
						table += '<tr>';
							table += '<td class="">'+oh_td.$fllu_act+':</td>';
							table += '<td class="span12">'+followup_entry+'</td>';
						table += '</tr>';
					}
					var log_date = '';
					if("log_date" in d && checkNull(d.log_date) != ''){
						log_date = convertDateIntoSiteFormat(log_date);
					}
					var followup_msg = oh_td.$fllu_del;
					followup_msg = followup_msg.replace('%date%',log_date);
										
					table += '<tr><td class="span12">'+followup_msg+'</td></tr>';	

				}

				table += '<tr></tr>';
				table += '</table>';
				table += '</div></div>';
			}
			else if(flag == 'order_created'){
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				if("Order" in d && checkNull(d.Order) != ''){
					var order_number = '';
					if("order_number" in d.Order){
						order_number = d.Order.order_number;
					}

					var our_ref = '';
					if("our_ref" in d.Order){
						our_ref = d.Order.our_ref;
					}

					var customer_name = '';
					if("customer_name" in d.Order){
						customer_name = d.Order.customer_name;
					}

					var delivery_method_name = '';
					if("delivery_method_name" in d.Order){
						delivery_method_name = d.Order.delivery_method_name;
					}

					table += '<table class="span6 pull-left">';
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Ipaddress+':</td>';
							table += '<td style="width:200px !important;">'+ip_address+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td>'+oh_td.Order+':</td>';
							table += '<td>'+order_number+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td>'+oh_td.Customername+':</td>';
							table += '<td>'+customer_name+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td>'+oh_td.Address+':</td>';
							table += '<td class="span2">'+address+'<br/>'+location+'<br/>'+country+'</td>';
						table += '</tr>';
					table += '</table>';

					table += '<table class="span6 pull-right">';
						table += '<tr><td class="span12" style="width:38%  !important;"></td><td style="width:200px !important;"></td></tr>';

						table += '<tr>';
							table += '<td>'+oh_td.Orderdate+':</td>';
							table += '<td>'+created+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td>'+oh_td.Ourreference+':</td>';
							table += '<td>'+our_ref+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td>'+oh_td.Yourreference+':</td>';
							table += '<td>'+your_ref+'</td>';
						table += '</tr>';

						table += '<tr>';
							table += '<td>'+oh_td.Deliverymethod+':</td>';
							table += '<td>'+delivery_method_name+'</td>';
						table += '</tr>';

					table += '</table><br /><br /><br />';

					if("OrderLine" in d && checkNull(d.OrderLine) != ''){
						var lines = d.OrderLine;

						table += '<table class="table table-striped table-hover table-bordered table_bordered pull-left no-more-tables table-full-width">';
						table += '<tr class="cf">';
						
							table += '<th class="product_lines" style="width:16%">'+oh_td.Productname+'</th>';
							table += '<th class="product_lines" style="width:13%">'+oh_td.Quantity+'</th>';
							table += '<th class="product_lines" style="width:13%">'+oh_td.Unit+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Unitprice+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.MVA+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Discount+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Totalprice+'</th>';
						table += '</tr>';
							for(var p in lines){

								var l = lines[p];

								var product_name = checkNull(l.product_name) != ''?l.product_name:'';
								var quantity = checkNull(l.qty) != ''?convertIntoLocalFormat(l.qty):'';
								var unit_price = checkNull(l.unit_price) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.unit_price):'';
								var u = checkNull(l.unit_id);
								var unit = checkNull(product_units[u]);
								var tax = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.tax));
								var discount = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.discount));
								var total_amount = checkNull(l.gross_amount) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.gross_amount):'';
							

								table += '<tr class="data-column">';
									table += '<td data-title="'+oh_td.Productname+'" class="product_lines">';
										table += product_name;
									table += '</td>';

									table += '<td data-title="'+oh_td.Quantity+'" class="product_lines">';
										table += quantity;
									table += '</td>';

									table += '<td data-title="'+oh_td.Unit+'" class="product_lines">';
										table += unit;
									table += '</td>';

									table += '<td style="text-align:right;" data-title="'+oh_td.Unitprice+'" class="product_lines">';
										table += unit_price;
									table += '</td>';

									table += '<td style="text-align:right;" data-title="'+oh_td.MVA+'" class="product_lines">';
										table += tax;
									table += '</td>';

									table += '<td style="text-align:right;" data-title="'+oh_td.Discount+'" class="product_lines">';
										table += discount;
									table += '</td>';

									table += '<td style="text-align:right;" data-title="'+oh_td.Totalprice+'" class="product_lines">';
										table += total_amount;
									table += '</td>';
								table += '</tr>';
							}
						table += '</table>';
					}	
				}
			}
			else if(flag == 'order_followup'){
			
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				table += '<table class="span4"><tr>';
					table += '<td style="width:110px !important;">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';
				table += '<div class="row-fluid"><div class="span12">';
				table += '<table class="span6">';
				table += '<tr></tr>';

				if("reminder_flag" in d && checkNull(d.reminder_flag) == '0'){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+oh_td.Donotfollowup+'</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d && checkNull(d.reminder_followup_status) != ''){
					var followuptext = ''
					if("reminder_name" in d && checkNull(d.reminder_name) != ''){
						followuptext = d.reminder_name;
					}
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';
						table += '<td class="">'+followuptext+'</td>';
					table += '</tr>';

					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_date+':</td>';
						var reminder_followup_date = '';
						if("reminder_followup_date" in d && checkNull(d.reminder_followup_date) != ''){
							reminder_followup_date = d.reminder_followup_date;
						}
						table += '<td class="">'+convertDateIntoSiteFormat(reminder_followup_date)+'</td>';
					table += '</tr>';
				}
				else if("reminder_followup_status" in d ){
					table += '<tr>';
						table += '<td class="">'+oh_td.$fllu_stts+':</td>';

						table += '<td class="">'+oh_td.Nofollowup+'</td>';
					table += '</tr>';
				}

				table += '<tr></tr>';
				table += '</table>';
				table += '</div></div>';
			}
			else if(flag == 'line_modified'){
				var changed_by = '';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				table += '<table class="span12"><tr>';
					table += '<td style="width:110px !important;">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';

				if("old_value" in d && checkNull(d.old_value) != '' && d.old_value.length != 0){
					table += '<table class="span6 pull-left"><tr><td class="" style="width:28% !important;margin-top:10px;">'+ oh_td.Oldvalue+':</td></tr></table>';

					table += '<table class="table table-striped table-hover table-bordered table_bordered pull-left no-more-tables table-full-width">';
						table += '<tr class="cf">';
						
							table += '<th class="product_lines" style="width:16%">'+oh_td.Productname+'</th>';
							table += '<th class="product_lines" style="width:13%">'+oh_td.Quantity+'</th>';
							table += '<th class="product_lines" style="width:13%">'+oh_td.Unit+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Unitprice+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.MVA+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Discount+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Totalprice+'</th>';
						table += '</tr>';
						for(var p in d.old_value){

							var l = d.old_value[p];

							var product_name = checkNull(l.product_name) != ''?l.product_name:'';
							var quantity = checkNull(l.qty) != ''?convertIntoLocalFormat(l.qty):'';
							var unit_price = checkNull(l.unit_price) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.unit_price):'';
							var u = checkNull(l.unit_id);
							var unit = checkNull(product_units[u]);
							var tax = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.tax));
							var discount = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.discount));
							var total_amount = checkNull(l.gross_amount) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.gross_amount):'';
						

							table += '<tr class="data-column">';
								table += '<td data-title="'+oh_td.Productname+'" class="product_lines">';
									table += product_name;
								table += '</td>';

								table += '<td data-title="'+oh_td.Quantity+'" class="product_lines">';
									table += quantity;
								table += '</td>';

								table += '<td data-title="'+oh_td.Unit+'" class="product_lines">';
									table += unit;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.Unitprice+'" class="product_lines">';
									table += unit_price;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.MVA+'" class="product_lines">';
									table += tax;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.Discount+'" class="product_lines">';
									table += discount;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.Totalprice+'" class="product_lines">';
									table += total_amount;
								table += '</td>';
							table += '</tr>';
						}
					table += '</table>';
				}

				if("new_value" in d && checkNull(d.new_value) != '' && d.new_value.length != 0){
					table += '<table class="span6 pull-left"><tr><td class="" style="width:28% !important;margin-top:10px;">'+ oh_td.Oldvalue+':</td></tr></table>';

					table += '<table class="table table-striped table-hover table-bordered table_bordered pull-left no-more-tables table-full-width">';
						table += '<tr class="cf">';
						
							table += '<th class="product_lines" style="width:16%">'+oh_td.Productname+'</th>';
							table += '<th class="product_lines" style="width:13%">'+oh_td.Quantity+'</th>';
							table += '<th class="product_lines" style="width:13%">'+oh_td.Unit+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Unitprice+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.MVA+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Discount+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Totalprice+'</th>';
						table += '</tr>';
						for(var p in d.new_value){

							var l = d.new_value[p];

							var product_name = checkNull(l.product_name) != ''?l.product_name:'';
							var quantity = checkNull(l.qty) != ''?convertIntoLocalFormat(l.qty):'';
							var unit_price = checkNull(l.unit_price) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.unit_price):'';
							var u = checkNull(l.unit_id);
							var unit = checkNull(product_units[u]);
							var tax = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.tax));
							var discount = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.discount));
							var total_amount = checkNull(l.gross_amount) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.gross_amount):'';
						

							table += '<tr class="data-column">';
								table += '<td data-title="'+oh_td.Productname+'" class="product_lines">';
									table += product_name;
								table += '</td>';

								table += '<td data-title="'+oh_td.Quantity+'" class="product_lines">';
									table += quantity;
								table += '</td>';

								table += '<td data-title="'+oh_td.Unit+'" class="product_lines">';
									table += unit;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.Unitprice+'" class="product_lines">';
									table += unit_price;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.MVA+'" class="product_lines">';
									table += tax;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.Discount+'" class="product_lines">';
									table += discount;
								table += '</td>';

								table += '<td style="text-align:right;" data-title="'+oh_td.Totalprice+'" class="product_lines">';
									table += total_amount;
								table += '</td>';
							table += '</tr>';
						}
					table += '</table>';
				}
			}
			else if(flag == 'order_modified'){
				table += '<table class="span4"><tr>';
					table += '<td style="width:110px !important;">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span2 resent">'+ip_address+'</td>';
				table += '</tr></table>';

				if( 
					("customer_name" in d && checkNull(d.customer_name) != '' )
					||
					("delivery_name" in d && checkNull(d.delivery_name) != '' )
					||
					("delivery_address1" in d && checkNull(d.delivery_address1) != '' )
				) {
					table += '<div class="row-fluid" style="margin-top:10px;"><div class="span12">';

						if("customer_name" in d && checkNull(d.customer_name) != ''){
						var old_value = '';
						if("old_value" in d.customer_name && d.customer_name.old_value){
							old_value = d.customer_name.old_value;
						}

						var new_value = '';
						if("new_value" in d.customer_name && d.customer_name.new_value){
							new_value = d.customer_name.new_value;
						}

						table += '<table class="span4">';
							table += '<tr>';
								table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Customername+'</td>';
							table += '</tr>';

							table += '<tr>';
								table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
								table += '<td class="history_change">'+old_value+'</td>';
							table += '</tr>';

							table += '<tr>';
								table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
								table += '<td class="history_change">'+new_value+'</td>';
							table += '</tr>';
						table += '</table>';
						}

						if("delivery_name" in d && checkNull(d.delivery_name) != ''){
							var old_value = '';
							if("old_value" in d.delivery_name && d.delivery_name.old_value){
								old_value = d.delivery_name.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_name && d.delivery_name.new_value){
								new_value = d.delivery_name.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliveryname+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}

						if("delivery_address1" in d && checkNull(d.delivery_address1) != ''){
							var old_value = '';
							if("old_value" in d.delivery_address1 && d.delivery_address1.old_value){
								old_value = d.delivery_address1.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_address1 && d.delivery_address1.new_value){
								new_value = d.delivery_address1.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliveryaddress1+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
					table += '</div></div>';
				}	

				if( 
					("delivery_address2" in d && checkNull(d.delivery_address2) != '' )
					||
					("delivery_zip" in d && checkNull(d.delivery_zip) != '' )
					||
					("delivery_city" in d && checkNull(d.delivery_city) != '' )
				) {	
					table += '<div class="row-fluid"><div class="span12">';
						if("delivery_address2" in d && checkNull(d.delivery_address2) != ''){
							var old_value = '';
							if("old_value" in d.delivery_address2 && d.delivery_address2.old_value){
								old_value = d.delivery_address2.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_address2 && d.delivery_address2.new_value){
								new_value = d.delivery_address2.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliveryaddress2+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("delivery_zip" in d && checkNull(d.delivery_zip) != ''){
							var old_value = '';
							if("old_value" in d.delivery_zip && d.delivery_zip.old_value){
								old_value = d.delivery_zip.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_zip && d.delivery_zip.new_value){
								new_value = d.delivery_zip.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliveryzip+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("delivery_city" in d && checkNull(d.delivery_city) != ''){
							var old_value = '';
							if("old_value" in d.delivery_city && d.delivery_city.old_value){
								old_value = d.delivery_city.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_city && d.delivery_city.new_value){
								new_value = d.delivery_city.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliverycity+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
					table += '</div></div>';
				}

				if( 
					("delivery_country" in d && checkNull(d.delivery_country) != '' )
					||
					("delivery_method" in d && checkNull(d.delivery_method) != '' )
					||
					("created" in d && checkNull(d.created) != '' )
				) {	
					table += '<div class="row-fluid"><div class="span12">';
						if("delivery_country" in d && checkNull(d.delivery_country) != ''){
							var old_value = '';
							if("old_value" in d.delivery_country && d.delivery_country.old_value){
								old_value = d.delivery_country.old_value;
							}

							var new_value = '';
							if("new_value" in d.delivery_country && d.delivery_country.new_value){
								new_value = d.delivery_country.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliverycountry+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("delivery_method" in d && checkNull(d.delivery_method) != ''){
							var old_value = '';
							if("old_value" in d.delivery_method && d.delivery_method.old_value){
								if(checkNull(d.delivery_method.old_value.DeliveryMethod) != ''){
									old_value = checkNull(d.delivery_method.old_value.DeliveryMethod.method_name);
								}
							}

							var new_value = '';
							if("new_value" in d.delivery_method && d.delivery_method.new_value){
								if(checkNull(d.delivery_method.new_value.DeliveryMethod) != ''){
									new_value = checkNull(d.delivery_method.new_value.DeliveryMethod.method_name);
								}
								
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Deliverymethod+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("created" in d && checkNull(d.created) != ''){
							var old_value = '';
							if("old_value" in d.created && d.created.old_value){
								old_value = convertDateIntoSiteFormat(checkNull(d.created.old_value));
							}

							var new_value = '';
							if("new_value" in d.created && d.created.new_value){
								new_value = convertDateIntoSiteFormat(checkNull(d.created.new_value));
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Quotedate+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
					table += '</div></div>';
				}

				if( 
					("due_date" in d && checkNull(d.due_date) != '' )
					||
					("our_ref" in d && checkNull(d.our_ref) != '' )
					||
					("your_ref" in d && checkNull(d.your_ref) != '' )
				) {	
					table += '<div class="row-fluid"><div class="span12">';
						if("due_date" in d && checkNull(d.due_date) != ''){
							var old_value = '';
							if("old_value" in d.due_date && checkNull(d.due_date.old_value) != ''){
								old_value = convertDateIntoSiteFormat(d.due_date.old_value);
							}

							var new_value = '';
							if("new_value" in d.due_date && checkNull(d.due_date.new_value)!= ''){
								new_value = convertDateIntoSiteFormat(d.due_date.new_value);
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Duedate+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("our_ref" in d && checkNull(d.our_ref) != ''){
							var old_value = '';

							if("old_value" in d.our_ref && checkNull(d.our_ref.old_value).trim() != ''){
								old_value = d.our_ref.old_value;
							}

							var new_value = '';
							if("new_value" in d.our_ref && checkNull(d.our_ref.new_value).trim() != ''){
								new_value = d.our_ref.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Ourreference+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
						if("your_ref" in d && checkNull(d.your_ref) != ''){
							var old_value = '';
							if("old_value" in d.your_ref && d.your_ref.old_value){
								old_value = d.your_ref.old_value;
							}

							var new_value = '';
							if("new_value" in d.your_ref && d.your_ref.new_value){
								new_value = d.your_ref.new_value;
							}
							table += '<table class="span4">';
								table += '<tr>';
									table += '<td class="bold" style="min-width: 115px !important;">'+oh_td.Yourref+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Oldvalue+'</td>';
									table += '<td class="history_change">'+old_value+'</td>';
								table += '</tr>';

								table += '<tr>';
									table += '<td class="history_change">'+oh_td.Newvalue+'</td>';
									table += '<td class="history_change">'+new_value+'</td>';
								table += '</tr>';
							table += '</table>';
						}
					table += '</div></div>';
				}
			}
			else if(flag == 'task_modified'){
				if("created_by" in d && checkNull(d.created_by) != ''){
					changed_by = d.created_by;
				}

				var type = checkNull(d[0].old_value.task_type);
				
				var old_task_type = checkNull(task_types[type]);
				var old_task_name = checkNull(d[0].old_value.task_name);
				var old_task_status = checkNull(d[0].old_value.task_status);
				var old_location = checkNull(d[0].old_value.location);
				var old_zip = checkNull(d[0].old_value.zip,'-');
				var old_city = checkNull(d[0].old_value.city,'-');
				var old_country = checkNull(d[0].old_value.country_code,'-');
				var old_schedule_date = checkNull(d[0].old_value.schedule_date);
				var old_due_date = checkNull(d[0].old_value.due_date);
				var old_deadline_date = checkNull(d[0].old_value.deadline,'-');
				var old_task_description = checkNull(d[0].old_value.task_description,'-');
				var old_status = checkNull(d[0].old_value.status,'-');
				if(old_status == true){
					old_status = '-'
				}

				var p_status = checkNull(d[0].old_value.order_status,'');
				var old_order_status = checkNull(order_statuses[p_status],'-');

				var type = checkNull(d[0].new_value.task_type);
				
				var new_task_type = checkNull(task_types[type]);
				var new_task_name = checkNull(d[0].new_value.task_name);
				var new_task_status = checkNull(d[0].new_value.task_status);
				var new_location = checkNull(d[0].new_value.location);
				var new_zip = checkNull(d[0].new_value.zip,'-');
				var new_city = checkNull(d[0].new_value.city,'-');
				var new_country = checkNull(d[0].new_value.country_code,'-');
				var new_schedule_date = checkNull(d[0].new_value.schedule_date);
				var new_due_date = checkNull(d[0].new_value.due_date);
				var new_deadline_date = checkNull(d[0].new_value.deadline,'-');
				var new_task_description = checkNull(d[0].new_value.task_description,'-');
				var new_status = checkNull(d[0].new_value.status,'-');
				if(new_status == true){
					new_status = '-'
				}
				var n_status = checkNull(d[0].new_value.order_status,'');
				var new_order_status = checkNull(order_statuses[n_status],'-');

				

				table += '<table class="span6 pull-left">';
					table += '<tr>';
						table += '<td class="span12" style="width:38% !important;">'+oh_td.Ipaddress+':</td>';
						table += '<td style="width:200px !important;">'+ip_address+'</td>';
					table += '</tr>';

					if(old_task_type != new_task_type){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Oldtasktype+':</td>';
							table += '<td style="width:200px !important;">'+old_task_type+'</td>';
						table += '</tr>';
					}

					if(old_task_name != new_task_name){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Oldtaskname+':</td>';
							table += '<td style="width:200px !important;">'+old_task_name+'</td>';
						table += '</tr>';
					}

					if(old_task_status != new_task_status){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Oldtaskstatus+':</td>';
							table += '<td style="width:200px !important;">'+old_task_status+'</td>';
						table += '</tr>';
					}

					if(old_location != new_location){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Oldlocation+':</td>';
							table += '<td style="width:200px !important;">'+old_location+'</td>';
						table += '</tr>';
					}

					if(old_zip != new_zip){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Oldzip+':</td>';
							table += '<td style="width:200px !important;">'+old_zip+'</td>';
						table += '</tr>';
					}

					if(old_city != new_city){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Oldcity+':</td>';
							table += '<td style="width:200px !important;">'+old_city+'</td>';
						table += '</tr>';
					}

					if(old_country != new_country){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Oldcountry+':</td>';
							table += '<td style="width:200px !important;">'+old_country+'</td>';
						table += '</tr>';
					}

					if(old_schedule_date != new_schedule_date){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Oldscheduledate+':</td>';
							table += '<td style="width:200px !important;">'+old_schedule_date+'</td>';
						table += '</tr>';
					}

					if(old_due_date != new_due_date){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Oldduedate+':</td>';
							table += '<td style="width:200px !important;">'+old_due_date+'</td>';
						table += '</tr>';
					}

					if(old_deadline_date != new_deadline_date){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Olddeadlinedate+':</td>';
							table += '<td style="width:200px !important;">'+old_deadline_date+'</td>';
						table += '</tr>';
					}

					if(old_task_description != new_task_description){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Olddescription+':</td>';
							table += '<td style="width:200px !important;">'+old_task_description+'</td>';
						table += '</tr>';
					}

					if(old_order_status != new_order_status){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Orderoldstatus+':</td>';
							table += '<td style="width:200px !important;">'+old_order_status+'</td>';
						table += '</tr>';
					}

					if(old_status != new_status){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.TaskOldstatus+':</td>';
							table += '<td style="width:200px !important;">'+oh_td.Open+'</td>';
						table += '</tr>';
					}					
				table += '</table>';
				table += '<table class="span6 pull-left">';
					table += '<tr>';
						table += '<td class="span12" style="width:38% !important;">&nbsp;</td>';
						table += '<td style="width:200px !important;"></td>';
					table += '</tr>';

					if(old_task_type != new_task_type){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newtasktype+':</td>';
							table += '<td style="width:200px !important;">'+new_task_type+'</td>';
						table += '</tr>';
					}

					if(old_task_name != new_task_name){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newtaskname+':</td>';
							table += '<td style="width:200px !important;">'+new_task_name+'</td>';
						table += '</tr>';
					}

					if(old_task_status != new_task_status){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newtaskstatus+':</td>';
							table += '<td style="width:200px !important;">'+new_task_status+'</td>';
						table += '</tr>';
					}

					if(old_location != new_location){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newlocation+':</td>';
							table += '<td style="width:200px !important;">'+new_location+'</td>';
						table += '</tr>';
					}

					if(old_zip != new_zip){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newzip+':</td>';
							table += '<td style="width:200px !important;">'+new_zip+'</td>';
						table += '</tr>';
					}

					if(old_city != new_city){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newcity+':</td>';
							table += '<td style="width:200px !important;">'+new_city+'</td>';
						table += '</tr>';
					}

					if(old_country != new_country){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newcountry+':</td>';
							table += '<td style="width:200px !important;">'+new_country+'</td>';
						table += '</tr>';
					}

					if(old_schedule_date != new_schedule_date){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newscheduledate+':</td>';
							table += '<td style="width:200px !important;">'+new_schedule_date+'</td>';
						table += '</tr>';
					}

					if(old_due_date != new_due_date){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newduedate+':</td>';
							table += '<td style="width:200px !important;">'+new_due_date+'</td>';
						table += '</tr>';
					}

					if(old_deadline_date != new_deadline_date){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newdeadlinedate+':</td>';
							table += '<td style="width:200px !important;">'+new_deadline_date+'</td>';
						table += '</tr>';
					}

					if(old_task_description != new_task_description){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Newdescription+':</td>';
							table += '<td style="width:200px !important;">'+new_task_description+'</td>';
						table += '</tr>';
					}

					if(old_order_status != new_order_status){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.Orderoldstatus+':</td>';
							table += '<td style="width:200px !important;">'+new_order_status+'</td>';
						table += '</tr>';
					}

					if(old_status != new_status){
						table += '<tr>';
							table += '<td class="span12" style="width:38% !important;">'+oh_td.TaskOldstatus+':</td>';
							table += '<td style="width:200px !important;">'+oh_td.Cancelled+'</td>';
						table += '</tr>';
					}
				table += '</table>';
			}
			else if(flag == 'order_distributed'){
				var distributed_to = '';

				if("distributed_to" in d && checkNull(d.distributed_to) != ''){
					distributed_to = d.distributed_to;
				}

				var email_addresses = '';

				if("email_addresses" in d && checkNull(d.email_addresses) != ''){
					email_addresses = d.email_addresses;
					if(checkNull(email_addresses) != ''){
						email_addresses = email_addresses.split(',');
					}
				}

				var method = '';
				if("method" in d && checkNull(d.method) != ''){
					method = d.method;
				}

				if(checkNull(distributed_to) != ''){
					//distributed_to.push()
				}

				var distribution_method = '';
				var distribution = '';

				if("distribution_method" in d && checkNull(d.distribution_method) != ''){
					distribution_method = d.distribution_method;
				}
				
				if(distribution_method == 'local'){
					distribution = oh_td.LocalPrintQueue;
				}else if(distribution_method == 'remote'){
					distribution = oh_td.RemotePrintQueue;
				}else if(distribution_method == 'immediate'){
					distribution = oh_td.Directprinting;
				}

				var customer_address1 = '';
				if("customer_address1" in d && checkNull(d.customer_address1) != ''){
					customer_address1 = d.customer_address1;
				}

				var customer_address2 = '';
				if("customer_address2" in d && checkNull(d.customer_address2) != ''){
					customer_address2 = d.customer_address2;
				}

				var customer_zip = '';
				if("customer_zip" in d && checkNull(d.customer_zip) != ''){
					customer_zip = d.customer_zip;
				}

				var customer_city = '';
				if("customer_city" in d && checkNull(d.customer_city) != ''){
					customer_city = d.customer_city;
				}

				var customer_address = '';
				if(customer_address2 != ''){
					customer_address = customer_address1+', '+customer_address2;
				}
				else{
					customer_address = customer_address1;
				}

				var full_address = '';

				if(checkNull(customer_address) != '' && checkNull(customer_zip) != '' && checkNull(customer_city) != ''){
					full_address = customer_address+'<br />'+customer_zip+'&nbsp;&nbsp;'+customer_city+'<br />';
				}
				else if(checkNull(customer_address) == '' && checkNull(customer_zip) != '' && checkNull(customer_city) != ''){
					full_address = customer_zip+'&nbsp;&nbsp;'+customer_city+'<br />';
				}
				else if(checkNull(customer_address) != '' && checkNull(customer_zip) == '' && checkNull(customer_city) != ''){
					full_address = customer_address+'<br />'+customer_city+'<br />';
				}
				else{
					full_address = customer_address+'<br />'+customer_zip+'<br />';
				}

				table += '<table class="span12"><tr>';
					table += '<td class="span3 sent">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';
				
				if(distribution != ''){
					table += '<table class="span12"><tr>';
						table += '<td class="span3 sent">'+oh_td.Distributionmethod+':</td>';
						table += '<td class="span9 resent">'+distribution+'</td>';
					table += '</tr></table>';
				}	

			

				table += '<table class="span12 pull-left" style="margin-left:0px; width:100%;">';
					if(method == 2){
						table += '<tr>';
							table += '<td class="span3 sent">';
								table += oh_td.Sentto;
							table += '</td>';
							table += '<td class="span9 sent">';
								table += full_address;
							table += '</td>';
						table += '</tr>';
					}
					if(method == 3){
						table += '<tr>';
							table += '<td class="span3 sent">';
								table += oh_td.Sentto;
							table += '</td>';
							table += '<td class="span9 sent">';
								table += full_address;
							table += '</td>';
						table += '</tr>';

						for(var pst in email_addresses){
							table += '<tr>';
								table += '<td class="span3 sent">';
									table += oh_td.Sentto;
								table += '</td>';
								table += '<td class="span9 sent">';
									table += checkNull(email_addresses[pst]);
								table += '</td>';
							table += '</tr>';
						}

						
					}

				table += '<table>';		
			}
			else if(flag == 'line_added'){
				table += '<table class="span4"><tr>';
					table += '<td style="width:110px !important;">'+oh_td.Ipaddress+':</td>';
					table += '<td class="span9 resent">'+ip_address+'</td>';
				table += '</tr></table>';
				if("changed_by" in d && checkNull(d.changed_by) != ''){
					changed_by = d.changed_by;
				}
				if("OrderLine" in d && checkNull(d.OrderLine) != ''){
						var lines = d.OrderLine;

						table += '<table class="table table-striped table-hover table-bordered table_bordered pull-left no-more-tables table-full-width">';
						table += '<tr class="cf">';
						
							table += '<th class="product_lines" style="width:16%">'+oh_td.Productname+'</th>';
							table += '<th class="product_lines" style="width:13%">'+oh_td.Quantity+'</th>';
							table += '<th class="product_lines" style="width:13%">'+oh_td.Unit+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Unitprice+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.MVA+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Discount+'</th>';
							table += '<th class="product_lines" style="width:13%;text-align:right;">'+oh_td.Totalprice+'</th>';
						table += '</tr>';
							for(var p in lines){

								var l = lines[p];

								var product_name = checkNull(l.product_name) != ''?l.product_name:'';
								var quantity = checkNull(l.qty) != ''?convertIntoLocalFormat(l.qty):'';
								var unit_price = checkNull(l.unit_price) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.unit_price):'';
								var u = checkNull(l.unit_id);
								var unit = checkNull(product_units[u]);
								var tax = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.tax));
								var discount = CUR_SYM+' '+convertIntoLocalFormat(checkNull(l.discount));
								var total_amount = checkNull(l.gross_amount) != ''?CUR_SYM+' '+convertIntoLocalFormat(l.gross_amount):'';
							

								table += '<tr class="data-column">';
									table += '<td data-title="'+oh_td.Productname+'" class="product_lines">';
										table += product_name;
									table += '</td>';

									table += '<td data-title="'+oh_td.Quantity+'" class="product_lines">';
										table += quantity;
									table += '</td>';

									table += '<td data-title="'+oh_td.Unit+'" class="product_lines">';
										table += unit;
									table += '</td>';

									table += '<td style="text-align:right;" data-title="'+oh_td.Unitprice+'" class="product_lines">';
										table += unit_price;
									table += '</td>';

									table += '<td style="text-align:right;" data-title="'+oh_td.MVA+'" class="product_lines">';
										table += tax;
									table += '</td>';

									table += '<td style="text-align:right;" data-title="'+oh_td.Discount+'" class="product_lines">';
										table += discount;
									table += '</td>';

									table += '<td style="text-align:right;" data-title="'+oh_td.Totalprice+'" class="product_lines">';
										table += total_amount;
									table += '</td>';
								table += '</tr>';
							}
						table += '</table>';
				}	
			}


			table_extra[j] = table;		
			$('#tbl_hstry_tbdy').append(tr);
		}
		
		$('#tbl_hstry').DataTable({
		 	"pagingType": "input",
			"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
		 	"language": {
				"lengthMenu": 
				    oh_td.View+ ' <select>'+
					'<option value="10">10</option>'+
					'<option value="20">20</option>'+
					'<option value="30">30</option>'+
					'<option value="40">40</option>'+
					'<option value="50">50</option>'+
					'<option value="-1">All</option>'+
					'</select> '+ oh_td.records + ' |  '
				         ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':oh_td.of,
					'Page':oh_td.Page,
				},
						
				"info": oh_td.Foundtotal+" _TOTAL_ "+oh_td.records
			},
	 	});

	},
	showHideRow:function(j){

		if($('.row-details_'+j).hasClass('row-details-close')){
			$('.row-details').removeClass('row-details-open').addClass('row-details-close');
			$('.details_row').remove();
			$('.row-details_'+j).removeClass('row-details-close').addClass('row-details-open');
			var html = '<tr class="details details_row"><td class="details" colspan="4">'+table_extra[j]+'</td></tr>';
			$('.row_'+j).after(html);
		}
		else{
			$('.row-details').removeClass('row-details-open').addClass('row-details-close');
			$('.row-details_'+j).removeClass('row-details-open').addClass('row-details-close');
			$('.details_row').remove();
		}	
	},
	popup_close:function(){

	},
}
