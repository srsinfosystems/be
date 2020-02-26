var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var staffer_id = $('#staffer_id').val();
var type = $('#type').val();

var ci_meta;
var ci_dt;
var ci_popid = 'popups';
var ci_td;
var glkey=0;
var settimeoutarr = [];
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var create_invoice = {
	start:function(popupid,metadata={}){
		ci_popid = popupid;
		ci_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			sales_id:ci_meta.sales_id,
			getTranslationsDataArray:['Save','Cancel','Send Invoice to customer','$select_dist_opts','Billing queue','Send to billing queue','Invoice Properties','Due date','Select','Empty','Delivery method','$tracking','Invoice Distribution','Distribution','Destination','Email','$emailcopy','Add another invoice recipient','Send SMS notification to invoice contact','Edit email before sending','Checking this box will send a notification of this invoice to the recipient','SMS Notification','Send','Please check the following fields','Success','Back','Next'],
		};
		if(ci_meta.id!=null && ci_meta.id!=undefined && ci_meta!=''){
			total_params.id = ci_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/sales/getSendInvoiceData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ci_dt = complet_data.response.response;
				ci_td = complet_data.response.response.translationsData;
				create_invoice.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				hideProcessingImage();
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('create_invoice_template').innerHTML;
		ci_dt['meta'] = {lang:lang};
		ci_dt['ci_meta'] = ci_meta;
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		ci_dt.date_format_f = date_format_f;

		var compiledRendered = Template7(template, ci_dt);
		document.getElementById(ci_popid).innerHTML = compiledRendered;
		resizemodal(ci_popid);
		create_invoice.bindEvents();
	},
	bindEvents:function(){
		$('.uni').uniform();
		$('#create_invoice_form #due_date').datepicker({
   			format:ci_dt.date_format_f,
   		}).change(function(){
   			$('.datepicker').remove();
   		});
   		$('#create_invoice_form #due_date').datepicker('setDate',moment(checkNull(ci_dt.due_date))._d);

   		var options = [];
   		var selc = '';
   		for(var j in ci_dt.order_delivery_methods){
   			var d = ci_dt.order_delivery_methods[j];
   			var id = j+'##'+d.value;
   			var name = d.value;

   			if(j == ci_dt.getSalesPageDetails.Sale.delivery_method){
   				selc = id;
   			}
			
   			options.push({
   				text:name,
   				value:id
   			});
   		}

   		$('#delivery_group').editable({
   			type: 'select2',
   			value: selc,
			mode:'inline',
			select2: {
	        	placeholder: ci_td.Select,
       		 	allowClear: true,
				minimumResultsForSearch: -1,
				emptytext:ci_td.Empty,
   			},
   			showbuttons:false,
			source:options,
			success: function(data, config) {
				create_invoice.saveMeta(config,'delivery_method');
			}
   		});
   		var delMethod = ci_dt.order_delivery_methods[selc];
		
		if(checkNull(delMethod) != ''){		
			if(delMethod.is_tracking){
				$('.tracking_wrapper').show();
			}else{
				$('.tracking_wrapper').hide();
			}
		}
		else{
			$('.tracking_wrapper').hide();
		}

   		$('#tracking_num_group').editable({
   			type: 'text',
   			value: checkNull(ci_dt.getSalesPageDetails.Sale.tracking_num),
			mode:'inline',
   			showbuttons:true,
			success: function(data, config) {
				create_invoice.saveMeta(config,'tracking_no');
			}
   		});

   		create_invoice.generateDistMethods(ci_dt.methods);

   		$('#add_another_destination').click(function(){
   			create_invoice.add_new_row();
   		});

   		$('#send_invoice_sms_notification').change(function(){
   			create_invoice.checkSmsRow();
   		});

   		$('#create_invoice_save').click(function(){
   			create_invoice.save();
   		});

   		$('#send_invoice_edit_email').change(function(){
   			var chck = $('#send_invoice_edit_email:checked').length;
   			if(chck){
   				$('#create_invoice_save').hide();
   				$('#create_invoice_edit').show();
   			}
   			else{
   				$('#create_invoice_edit').hide();
   				$('#create_invoice_save').show();
   			}
   		});

   		$('#create_invoice_edit').click(function(){
   			new_custom_popup2('600','popups1','edit_template',{sales_id:ci_meta.sales_id,from:'INVOICE'});
   		});
	},
	saveMeta:function(data,from){
		
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			sales_id:ci_dt.getSalesPageDetails.Sale.id,
		}

		if(from == 'delivery_method'){
			var delivery_method_id_arr = data.split('##');
			var delivery_method_id = delivery_method_id_arr[0];
			total_params['delivery_method_id'] = delivery_method_id;
			total_params['sales_id'] = ci_dt.getSalesPageDetails.Sale.id;
		}
		else{
			total_params['tracking_num'] = data;
			total_params['doc_id'] = ci_dt.getSalesPageDetails.Sale.id;
			total_params['doc'] = 'sales';
		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/sales/updateSalesDeliveryMethod.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				
				if(from == 'delivery_method'){
					var delMethod = ci_dt.order_delivery_methods[delivery_method_id];
					
					if(delMethod.is_tracking){
						$('.tracking_wrapper').show();
					}else{
						$('#tracking_num_group').editable('setValue','');
						$('.tracking_wrapper').hide();
					}

				}
				else if(from == 'tracking_no'){
				
				}
	
				new_custom_main_page2('/'+type+'/sales/details/'+ci_dt.getSalesPageDetails.Sale.id,'sales_list','sales_list','sales_details',{sales_id:ci_dt.getSalesPageDetails.Sale.id},'n');
	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ci_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ci_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	generateDistMethods:function(data){
		var html = '';
		for(var j in data){
			var dd = data[j];
			if(dd.internal_name == 'both'){
				continue;
			}
			var htmls = '<tr>';
				htmls += '<td>';
					
					if(dd.internal_name == 'email'){
						htmls += '<input class="check_distribution email_sms check_distribution_'+dd.id+' uni" type="checkbox" data-id="'+dd.id+'">';
					}
					else{
						htmls += '<input class="check_distribution check_distribution_'+dd.id+' uni" type="checkbox" data-id="'+dd.id+'">';
					}
				htmls += '</td>';
				htmls += '<td>';
					htmls += checkNull(dd.name);
				htmls += '</td>';
				htmls += '<td>';
					if(dd.internal_name == 'email'){

						var customer_contact_email = '';
						if(checkNull(ci_dt.customerData.Customer.default_distribution_address) == ''){
							if(checkNull(ci_dt.getSalesPageDetails.Sale.your_ref) != ''){
								customer_contact_email = ci_dt.getSalesPageDetails.Sale.your_ref;
							}
							else{
								for(var j in ci_dt.customer_contact){
									var dts = ci_dt.customer_contact[j];
									if(dts.is_default){
										customer_contact_email = dts.email;
										break;
									}
								}
							}

						}
						else if(checkNull(ci_dt.customerData.Customer.default_distribution_address) != ''){
							customer_contact_email = ci_dt.customerData.Customer.default_distribution_address;
						}

						if(checkNull(customer_contact_email) == ''){
							continue;
						}

						htmls += '<input type="text" value="'+customer_contact_email+'" class="m-wrap span10 custom_invoice_email auto_comp email_i" disabled="disabled">';
					}
					else if(dd.internal_name == 'postal'){
						htmls += '<select class="m-wrap span10 select_v">';
							for(var j in ci_dt.postal_methods){
								var d = ci_dt.postal_methods[j];
								htmls += '<option ';
								if(d.is_default == 1){
									htmls += ' selected="selected" ';
								}
								htmls += 'value="'+j+'">'+d.value+'</option>';
							}
						htmls += '</select>';
					}
					else{
						htmls += '-';
					}
				htmls += '</td>';
			htmls += '</tr>';

			html += htmls;
		}
		$('#inv_dist').html(html);

		var cust_def_dist = [];

		if( checkNull(ci_dt.customerData.Customer.default_distribution == 3)){
			cust_def_dist.push(1);
			cust_def_dist.push(2);
		}
		else if(checkNull(ci_dt.customerData.Customer.default_distribution) != ''){
			cust_def_dist.push(ci_dt.customerData.Customer.default_distribution);
		}

		var part_def_dist = [];
		if( checkNull(ci_dt.partnerSetting.invoice_method == 3)){
			part_def_dist.push(1);
			part_def_dist.push(2);
		}
		else if(checkNull(ci_dt.partnerSetting.invoice_method) != ''){
			part_def_dist.push(ci_dt.partnerSetting.invoice_method);
		}

		var any_one = 0;
		for(var j in cust_def_dist){
			var elemt = $('.check_distribution_'+cust_def_dist[j]);
			
			if(elemt.length != 0){
				elemt.prop('checked','checked');
				any_one = 1;
			}
		}

		if(any_one == 0){
			for(var j in part_def_dist){
				var elemt = $('.check_distribution_'+part_def_dist[j]);
				if(elemt.length != 0){
					elemt.prop('checked','checked');
					any_one = 1;
				}
			}
		}
		try{
			if("viewContact" in ci_dt && "Login" in ci_dt.viewContact && "cellphone" in ci_dt.viewContact.Login && "cellphonearr" in ci_dt.viewContact && checkNull(ci_dt.viewContact.cellphonearr.number) != ''){
				var html = create_invoice.generateSms(ci_dt.viewContact.cellphonearr.str);
				$('#inv_dist').append(html);
			}
			else{
				$('#send_sms_notification,#send_sms_notification_hide').remove();
			}
		}
		catch(e){}
		for(var j in ci_dt.salesInvoiceData){
			var d = ci_dt.salesInvoiceData[j]['PartnerSalesDocument'];
			
			if(checkNull(d.contact_id) != 0 && checkNull(d.contact_id) != ''){
				var email = '';
				for(var j in ci_dt.customer_contact){
					if(j == d.contact_id){
						email = ci_dt.customer_contact[j]['email'];
						break;
					}
				}
				
				if(checkNull(email) != ''){
					var html  = create_invoice.generateEmail('emailaddr',email,'y');
					$('#inv_dist').append(html);
				}				

			}
			else{
				var html = create_invoice.generateEmail('emailaddr',d.recipient,'y');
				$('#inv_dist').append(html);
			}

			
			
		}

		if(checkNull(ci_dt.send_copy_email) != ''){
			var html = create_invoice.generateEmail('partnercopy',ci_dt.send_copy_email,'y');
			$('#inv_dist').append(html);
		}
		$('.uni').uniform();
		$('.select_v').select2();	
		create_invoice.autoComplete();

		$('.email_sms').change(function(){
			create_invoice.checkSms();
		}).trigger('change');
	},
	checkSms:function(){
		var c = $('.email_sms').is(':checked');
		if(c){
			$('.sms_checkbox,.sms_row').show();
		}
		else{
			$('.sms_checkbox,.sms_row').hide();
		}
	},
	checkSmsRow:function(){
		var c = $('#send_invoice_sms_notification').is(':checked');
		if(c){
			$('.sms_row').show();
		}
		else{
			$('.sms_row').hide();
		}
	},
	generateSms:function(val){
		var html = '<tr class="sms_row" style="display:none">';
			html += '<td>';
				html += '<input checked="checked" disabled class="check_sms uni" type="checkbox">';
			html += '</td>';
			html += '<td>';
				html += ci_td.SMSNotification;
			html += '</td>';
			html += '<td>';
				html += '<input disabled type="text" value="'+val+'" class="m-wrap span10 sms_notify_number auto_comp">';
			html += '</td>';
		return	html += '</tr>';
	},
	generateEmail:function(frm='',val='',checked=''){
		var html = '<tr>';
			html += '<td>';

				if(checked == 'y'){
					if(frm == 'partnercopy'){
						html += '<input checked="checked" class="check_distribution uni partner_copy" type="checkbox">';
					}
					else if(frm == 'emailaddr'){
						html += '<input checked="checked" class="uni email_addr" type="checkbox">'
					}
					else{
						html += '<input checked="checked" class="check_distribution uni auto_comp" type="checkbox">';
					}
				}
				else{
					if(frm == 'partnercopy'){
						html += '<input class="check_distribution uni partner_copy" type="checkbox">';
					}
					else if(frm == 'emailaddr'){
						html += '<input class="uni email_addr" type="checkbox">'
					}
					else{
						html += '<input class="check_distribution uni auto_comp" type="checkbox">';
					}
				}

			html += '</td>';
			html += '<td>';
				if(frm == ''){
					html += ci_td.Email;
				}
				else if(frm == 'copy'){
					html += ci_td.$emailcopy;
				}
				else if(frm == 'partnercopy'){
					html += ci_td.$emailcopy;
				}
				else if(frm == 'emailaddr'){
					html += ci_td.$emailcopy;
				}
			html += '</td>';
			html += '<td>';
				if(frm == ''){
					html += '<input type="text" value="'+val+'" class="m-wrap span10 custom_invoice_email auto_comp">';
					html += '<button style="float:right" class="btn mini red span2" onclick="$(this).parent().parent().remove();" type="button"><i class="icon-remove"></i></button>';
				}
				else if(frm == 'copy'){
					html += '<input disabled type="text" value="'+val+'" class="m-wrap span10 custom_invoice_email">';
				}
				else if(frm == 'partnercopy'){
					 html += '<input disabled type="text" value="'+val+'" class="m-wrap span10 partner_copy_email">';
				}
				else if(frm == 'emailaddr'){
					html += '<input disabled type="text" value="'+val+'" class="m-wrap span10 email_addr_val">';
				}

			html += '</td>';
		return	html += '</tr>';
	},
	autoComplete:function(){
		var list = [];
		for(var j in ci_dt.partner_contact_list){
			var dt = ci_dt.partner_contact_list[j];
			list.push({
				id:j,
				label:checkNull(dt.name) + ' <'+dt.email + '> ',
				value:checkNull(dt.name) + ' <'+dt.email + '> ',
			});
		}

		$('.auto_comp').not('.ui-autocomplete-input').autocomplete({
			autoFocus: true,	
			source: list,
			source: function (request, response) {
				var result = $.ui.autocomplete.filter(list, request.term);
				if (!result.length) {
					result = $list;
				}
				else{
					
				}
				response(result);
		  	},
			minLength: 1,
			select: function( event, data ) {
			},	
			position: { my : "right top", at: "right bottom", collision : "flip"  },
		});
		$('ul.ui-autocomplete').css('z-index','100000');	
	},
	add_new_row:function(){
		var html = create_invoice.generateEmail('emailaddr','','y');
		$('#inv_dist').append(html);

		create_invoice.autoComplete();
		$('.uni').uniform();	
	},
	save:function(partnerMail={}){

		var errmsg = '';
		var your_ref = $('.custom_invoice_email').val();
		var invoice_methods = [];
		var print_method = '';
		
		$('.check_distribution').each(function(){
			var data_id = $(this).attr('data-id');
			if(checkNull(data_id) != '' && $(this).is(':checked')){
				invoice_methods.push(data_id);
			}
		});
		

		if($('.check_distribution[data-id="2"]').is(':checked')){
			print_method = $('select.select_v').val();
		}
		

		var save_params = {
			sales_id:ci_dt.getSalesPageDetails.Sale.id,
			your_ref:your_ref,
			invoice_method:invoice_methods,
			print_method:print_method,
		};

		var send_copy = $('.partner_copy').is(':checked');
		var recipient_email  = $('.partner_copy_email').val();
		if(send_copy){
			save_params['send_copy'] = 'y';
			save_params['recipient_email'] = recipient_email;
		}
		else{
			save_params['send_copy'] = 'n';
			save_params['recipient_email'] = recipient_email;
		}

		var emailAddresses = [];
		$('.email_addr').each(function(){
			var checked = $(this).is(':checked');
			if(checked){
				var emailaddr = $(this).closest('tr').find('.email_addr_val').val();
				if(!validateEmail(emailaddr)){
					errmsg = ci_td.Email;
					return false;
				}
				emailAddresses.push(emailaddr);
			}
		});
		save_params['emailAddresses'] = emailAddresses;
		//email_addr_val


		save_params['invoice_request_from'] = ''; //check

		var your_ref = '';

		if($('.email_sms').is(':checked')){
			your_ref = $('.email_sms').closest('tr').find('input.email_i').val();
		}
		save_params['your_ref'] = your_ref;

		save_params['reference_contact'] = '';//no use
		save_params['requested_from'] = checkNull(ci_meta.requested_from);//check
		save_params['from'] = checkNull(ci_meta.from);//check

		var due_date = moment($('#due_date').datepicker('getDate')).format('YYYY-MM-DD');
		save_params['due_date'] = due_date;

		var tracking_num = $('#tracking_num_group').editable('getValue').tracking_num_group;

		var delivery_method_id_arr = $('#delivery_group').editable('getValue').delivery_group;;
		delivery_method_id_arr = delivery_method_id_arr.split('##');

		var delivery_method_id = delivery_method_id_arr[0];
		save_params['delivery_method'] = delivery_method_id;

		var send_sms_notification = $('#send_invoice_sms_notification').is(':checked');
		if(send_sms_notification){
			save_params['send_sms_notification'] = 1;
			save_params['cellphone'] = checkNull(ci_dt.viewContact.cellphonearr['number']);
			save_params['sms_cell_code'] = checkNull(ci_dt.viewContact.cellphonearr['code']);
			save_params['sms_sender_name'] = '';
		}
		else{
			save_params['send_sms_notification'] = 0;
			save_params['cellphone'] = '';
			save_params['sms_cell_code'] = '';
			save_params['sms_sender_name'] = '';
		}

		save_params['billing_queue'] =  $('#billing_queue:checked').length;

		if(checkNull(errmsg) != ''){
			var msg = ci_td.Pleasecheckthefollowingfields+'<br/>';
			msg += errmsg;
			showAlertMessage(msg,'error',ci_td.Alertmessage);
			return;
		}
		
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id
		}

		if("order_id" in ci_meta && checkNull(ci_meta.order_id) != ''){
			total_params['order_id'] = ci_meta.order_id;
		}

		total_params = Object.assign(total_params,save_params);

		if(!$.isEmptyObject(partnerMail) && checkNull(partnerMail) != ''){
			total_params['partnerMail'] = JSON.stringify(partnerMail);
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/invoices/sendAndCreateInvoiceNew.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				localStorage.removeItem('newsales');
				if(save_params['print_method'] == 'immediate'){
					try{
						var res = complet_data.response.response.send_invoice;
						if(checkNull(res.pdf.pdf_file_name) != ''){
							var di = res.pdf.pdf_dir;
							di = btoa(di);
							openPdf(APISERVER+'/api/downloads/report/'+di+'.json');
						}
					}
					catch(e){

					}
				}
				delete create_invoice.onModalClose;
				if(ci_meta.from == 'meter_reading_digits'){
					$('#meter_dig_btn_save').trigger('click');
				}
				else if(ci_meta.from == 'meter_reading'){
					create_invoice.updateMeter();
				}
				else if(ci_meta.from == 'boat_storage'){
						create_invoice.updateBoat();
				}
				else{
					if("billing_queue" in complet_data.response.response){
						var inv_id = complet_data.response.response.billing_queue;
						new_custom_main_page2( '/' + type + '/sales/details/'+inv_id,'invoices_list','invoices_list','invoice_details',{invoice_id:inv_id});
					}
					else{
						var inv_id = complet_data.response.response.create_invoice.invoice_id;
						new_custom_main_page2( '/' + type + '/invoice/invoice_details/'+inv_id,'invoices_list','invoices_list','invoice_details',{invoice_id:inv_id});
					}
					$('#'+ci_popid).modal('hide');
					$('#popups1').modal('hide');
					call_toastr('success',ci_td.Success,complet_data.response.response.message.msg);
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ci_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ci_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	onModalClose:function(){
		if(ci_meta.from == 'meter_reading' || ci_meta.from == 'meter_reading_digits' || ci_meta.from == 'boat_storage'){
			for(var j in settimeoutarr){
				clearTimeout(settimeoutarr[j]);
			}
			settimeoutarr.push(setTimeout(function(){
				create_invoice.deleteSales(ci_meta.sales_id	,'single')
			}));
		}
	},
	deleteSales:function(id,frm='single'){
		var yes =function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
			}
			if(frm=='single'){
				total_params.sales_ids = [id];
			}
			else{
				var ids = []
				for(var j in selected_data){
					if(selected_data[j].check == 1){
						ids.push(selected_data[j].id);
					}
				}
				total_params.sales_ids = ids;
			}

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Sales/deleteSales.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
				if(complet_data.response.status == 'success'){
					
			
				}
				// else if(complet_data.response.status == 'error'){
				// 	if(complet_data.response.response.error == 'validationErrors'){
				// 		var mt_arr = complet_data.response.response.list;
				// 		var array = $.map(mt_arr, function(value, index) {
				// 			return value+'<br />';
				// 		});
				// 		showAlertMessage(array,'error',sl_td.alertmessage);
				// 		return;
				// 	}else{
				// 		showAlertMessage(complet_data.response.response.msg,'error',sl_td.alertmessage);
				// 		return;
				// 	}	
				// }
			}
			doAjax(params);
			return;
		};

		yes();		
	},
	updateBoat:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,

			customer_id:checkNull(ci_meta.customer_id),
			customer_slip_id:checkNull(ci_meta.customer_slip_id),
			boat_status:checkNull(ci_meta.boat_status) == 'up'?'out':'up',
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/customers/updateBoatStatus.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',ci_td.Success,complet_data.response.response.message.msg);
				$('#'+ci_popid).modal('hide');
				$('#'+ci_meta.pop_id).modal('hide');
				customer_details.showTabs('slips','tab_1_8');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ci_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ci_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	updateMeter:function(){
	
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,

			customer_id:checkNull(ci_meta.customer_id),
			customer_slipmeter_id:checkNull(ci_meta.customer_slipmeter_id),
			current_meter_value:checkNull(ci_meta.current_meter_value),
			staffer_id:staffer_id,
			type:checkNull(ci_meta.type),
			meter_action:checkNull(ci_meta.meter_action),
			invoice_sent:1,
		}
		

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/customers/editMeterFromCustomer.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',ci_td.Success,complet_data.response.response.message.msg);
				$('#'+ci_popid).modal('hide');
				$('#'+ci_meta.pop_id).modal('hide');

				if(ci_meta.request_from == 'customer'){
					customer_meters.append(complet_data.response.response.meterDetails,'all');
				}
				else if(ci_meta.request_from == 'marina_slips'){
					for(var j in complet_data.response.response.meterDetails){
						var pm = complet_data.response.response.meterDetails[j].PartnerMeter;
						$('tr#slip_name_'+pm.partner_slip_id+' td.meter_value').html(pm.meter_value);
					}
				}

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ci_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ci_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;		
	}

}
