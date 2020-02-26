var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var partner_dir = $('#partner_dir').val();

var co_meta;
var co_dt;
var co_popid = 'popups';
var co_td;
var glkey=0;

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var defaultmethod = '';
var defaultmethodid = '';
var create_order = {
	start:function(popupid,metadata={}){
		co_popid = popupid;
		co_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			sales_id:co_meta.sales_id,
			getTranslationsDataArray:['Save','Cancel','Send Order to customer','Send','Distribution','Destination','$emailcopy','Add another destination','Email','Customer must verify order','Edit email before sending','Create task','Task type','Task name','Set order status to','Edit more task properties','Please check the following fields','All email addresses on the customer','Success','Next'],
		};
		if(co_meta.id!=null && co_meta.id!=undefined && co_meta!=''){
			total_params.id = co_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/sales/getSendOrderData.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				co_dt = complet_data.response.response;
				co_td = complet_data.response.response.translationsData;
				create_order.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',co_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',co_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('create_order_template').innerHTML;
		co_dt['meta'] = {lang:lang};
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		co_dt.date_format_f = date_format_f;

		var compiledRendered = Template7(template, co_dt);
		document.getElementById(co_popid).innerHTML = compiledRendered;
		resizemodal(co_popid);
		create_order.bindEvents();
	},
	bindEvents:function(){
		$('.uni').uniform();
		create_order.generateDistMethods(co_dt.methods);
		$('#add_another_destination').click(function(){
			create_order.add_new_row();
		});

		$('#sendQuotePartnerTaskTaskType').select2();

		$('#sendQuotePartnerTaskTaskType').change(function(){
			create_order.tasktypechange();
		}).trigger('change');

		$('#sendQuotePartnerTaskOrderStatus').select2();

		$('#sendOrderCreateTask').change(function(){
			var checkd = $('#sendOrderCreateTask').is(':checked');
			if(checkd){
				$('.task_fields').show();
			}
			else{
				$('.task_fields').hide();
			}
		});

		$('#create_order_save').click(function(){
			create_order.saveData();
		});

		$('#sendOrderEditEmail').change(function(){
   			var chck = $('#sendOrderEditEmail:checked').length;
   			if(chck){
   				$('#create_order_save').hide();
   				$('#create_order_edit').show();
   			}
   			else{
   				$('#create_order_edit').hide();
   				$('#create_order_save').show();
   			}
   		});

		
   		$('#create_order_edit').click(function(){
   			var template = 'ORDER_CONFIRMATION';
   			if($('#sendOrderAcceptance').is(':checked')){
   				template = 'ORDER_ACCEPTANCE';
   			}
   			new_custom_popup2('600','popups1','edit_template',{sales_id:co_meta.sales_id,from:template});
   		});
	},
	tasktypechange:function(){
		var customer_task_name = $("#sendQuotePartnerTaskTaskType option:selected").text();
		var customer_name = checkNull(co_dt.customerData.Customer.customer_name);
		var task_name = '';
		task_name += customer_task_name;
		if(checkNull(customer_name) != ''){
			task_name += ', '+customer_name;
		}
		$("#sendQuotePartnerTaskTaskName").val(task_name);

		var task_val = $("#sendQuotePartnerTaskTaskType").val();

		for(var j in co_dt.gettasksorder){
			var task = checkNull(co_dt.gettasksorder[j].PartnerTaskType.internal_name);
			if(task_val == task){
				var order_status = checkNull(co_dt.gettasksorder[j].OrderStatusTask.order_status);
				if(order_status != ''){
					$('#sendQuotePartnerTaskOrderStatus').select2('val',order_status);
					$('#sendQuotePartnerTaskOrderStatus').val(order_status);

				}else{
					$('#sendQuotePartnerTaskOrderStatus').select2('val',6);
					$('#sendQuotePartnerTaskOrderStatus').val(6);	
				}
				break;
			}
		}
	},
	generateDistMethods:function(data){
		var html = '';
		defaultmethod = '';
		for(var j in data){
			var dd = data[j];
			if(dd.default == 1){
				defaultmethodid = dd.id;
				defaultmethod = dd.internal_name;
			}
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
						var customer_contacts = co_dt.customer_contact;
						
						htmls += '<select name="your_ref" class="your_ref m-wrap span12">';
							htmls += '<option value="all##sall">'+co_td.Allemailaddressesonthecustomer+'</option>';
							for(var j in customer_contacts){
								if(checkNull(customer_contacts[j].email) != ''){
									var str = checkNull(customer_contacts[j].name) + ' &lt;'+customer_contacts[j].email+'&gt;';
									var v = customer_contacts[j].email + '##' + j;
									var is_default = customer_contacts[j].is_default;
									
									if(checkNull(co_dt.contact_id) != '' && checkNull(co_dt.your_ref_email) != ''){
										if(v == co_dt.your_ref_email+'##'+co_dt.contact_id){
											htmls += '<option selected="selected" value="'+v+'">';
										}
										else{
											htmls += '<option value="'+v+'">';
										}

									}
									else{
										if(customer_contacts[j].is_default){
											htmls += '<option selected="selected" value="'+v+'">';
										}
										else{
											htmls += '<option value="'+v+'">';
										}
									}
									
									
										htmls += str;
									htmls += '</option>';
								}
							}
						htmls += '</select>';
					}
					else if(dd.internal_name == 'postal'){
						htmls += '<select class="m-wrap span12 postal select_v">';
							for(var j in co_dt.postal_methods){
								var d = co_dt.postal_methods[j];
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
		$('#order_dist').html(html);

		if(defaultmethod != 'postal' && checkNull(co_dt.your_ref) != ''){
			$('#customer_verification').show();
		}
		else{
			$('#customer_verification').hide();
		}

		for(var j in co_dt.salesOrderData){
			var d = co_dt.salesOrderData[j]['PartnerSalesDocument'];
			
			var recp_email = '';
			if(d.contact_id != 0 && checkNull(d.contact_id) != ''){
				if(d.contact_id in co_dt.customer_contact && checkNull(co_dt.customer_contact[d.contact_id]) != ''){
					recp_email = co_dt.customer_contact[d.contact_id].email;
				}
			}
			else{
				recp_email = d.recipient;
			}
			if(checkNull(recp_email) != ''){

				var html = create_order.generateEmail('emailaddr',recp_email ,'y');
				$('#order_dist').append(html);
			}
		}

		var cust_def_dist = [];

		if( checkNull(co_dt.customerData.Customer.default_distribution == 3)){
			cust_def_dist.push(1);
			cust_def_dist.push(2);
		}
		else if(checkNull(co_dt.customerData.Customer.default_distribution) != ''){
			cust_def_dist.push(co_dt.customerData.Customer.default_distribution);
		}

		for(var j in cust_def_dist){
			var elemt = $('.check_distribution_'+cust_def_dist[j]);
			if(elemt.length != 0){
				elemt.prop('checked','checked');
			}
		}
		$('.uni').uniform();
		$('.your_ref').select2();
		$('.select_v').select2();
	},
	generateEmail:function(frm='',val='',checked=''){
		var html = '<tr>';
			html += '<td>';
				if(checked == 'y'){
					if(frm == 'emailaddr'){
						html += '<input checked="checked" class="uni email_addr" type="checkbox">'
					}
					else if(frm == 'email'){
						html += '<input disabled checked="checked" class="check_distribution v uni custom_email" type="checkbox">';
					}
				}
				else{
					if(frm == 'emailaddr'){
						html += '<input class="uni email_addr" type="checkbox">'
					}
					else{
						html += '<input class="check_distribution uni auto_comp custom_email" type="checkbox">';
					}
				}

			html += '</td>';
			html += '<td>';
				if(frm == 'emailaddr'){
					html += co_td.$emailcopy;
				}
				else if(frm == 'email'){
					html += co_td.Email;
				}
			html += '</td>';
			html += '<td>';
				if(frm == 'emailaddr'){
					html += '<input disabled type="text" value="'+val+'" class="m-wrap span12 email_addr_val">';
				}
				else if(frm == 'email'){

					html += '<input type="text" value="'+val+'" class="m-wrap span10 custom_email">';
					html += '<button style="float:right" class="btn mini red span2" onclick="$(this).parent().parent().remove();" type="button"><i class="icon-remove"></i></button>';
				}

			html += '</td>';
		return	html += '</tr>';
	},
	add_new_row:function(){
		var html = create_order.generateEmail('email','','y');
		$('#order_dist').append(html);
		$('.uni').uniform();	
	},
	open_edit_task:function(){
		var newtask = $('#sendQuotePartnerTaskTaskType').val();
		var newtaskname = $('#sendQuotePartnerTaskTaskName').val();
		var dataurl = $('#BASE_URL').val() +'sales/edit_task_for_order?customerID='+co_dt.getSalesPageDetails.Sale.customer_id+'&sales_id='+co_dt.getSalesPageDetails.Sale.id;
		var str = 'newtask='+newtask+'&newtaskname='+newtaskname+'&from=neworder';
		sendpostData(dataurl,str,'popups3'); 
	},
	saveData:function(partnerMail={}){
		getUserIP(function(ip_address){

			var emailAddresses = [];

			$('input.email_addr[type="checkbox"]').each(function(){
				if($(this).is(':checked')){
					var v = $(this).closest('tr').find('input.email_addr_val[type="text"]').val();
					if(!validateEmail(v)){
						var msg = co_td.Pleasecheckthefollowingfields+'<br/>';
						msg += co_td.Email;
						showAlertMessage(msg,'error',co_td.Alertmessage);
					}
					emailAddresses.push(v);
				}
			});

			$('input.custom_email[type="checkbox"]').each(function(){
				if($(this).is(':checked')){
					var v = $(this).closest('tr').find('input.custom_email[type="text"]').val();
					if(!validateEmail(v)){
						var msg = co_td.Pleasecheckthefollowingfields+'<br/>';
						msg += co_td.Email;
						showAlertMessage(msg,'error',co_td.Alertmessage);
					}
					emailAddresses.push(v);
				}
			});

			var link = $('#crouter_url').val() + $('#partner_dir').val() + '/customer/order/ov';
			var siteLink = $('#crouter_url').val() + $('#partner_dir').val() + '/customer';
			
			var acceptance = '';

			if($('#sendOrderAcceptance').is(':checked')){
				acceptance = 'y';
			}
			else{
				acceptance = 'n';
			}
			if(defaultmethod == 'postal' && $('.email_addr_val').length != 0){
				acceptance = 'n';
			}

			var your_ref = '';
			var reference_contact_id = '';
			if($('.email_sms').is(':checked')){
				var v = $('select.your_ref').val();
				v = v.split('##');
				your_ref = checkNull(v[0]);
				reference_contact_id = checkNull(v[1]);
			}

			var methods = [];
			$('.check_distribution').each(function(){
				if($(this).is(':checked')){
			 		methods.push($(this).attr('data-id'));
				}
			});
			

			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				sales_id:co_dt.getSalesPageDetails.Sale.id,
				method_id:methods,
				ip_address:ip_address,
				delivery_name : checkNull(co_dt.getSalesPageDetails.Sale.delivery_name),
    			delivery_address1 : checkNull(co_dt.getSalesPageDetails.Sale.delivery_address1),
    			delivery_address2 : checkNull(co_dt.getSalesPageDetails.Sale.delivery_address2),
    			delivery_city : checkNull(co_dt.getSalesPageDetails.Sale.delivery_city),
    			delivery_zip : checkNull(co_dt.getSalesPageDetails.Sale.delivery_zip),
    			delivery_country : checkNull(co_dt.getSalesPageDetails.Sale.delivery_country),
    			order_delivery_method : checkNull(co_dt.getSalesPageDetails.Sale.delivery_method),
    			link:link,
    			siteLink:siteLink,
    			print_option:$('select.postal.select_v').val(),
    			acceptance:acceptance,
    			send_flag_status:0,//check no use
    			emailAddresses:emailAddresses,
    			order_request_from:'',//check no use
    			your_ref:your_ref,
    			reference_contact_id:reference_contact_id,
			};
			var PartnerTask = {};
			if($('#sendOrderCreateTask').is(':checked')){

				var partner_task_val = $('#partner_task_val').val();

				var task_type = $('#sendQuotePartnerTaskTaskType').val();
				var task_name = $('#sendQuotePartnerTaskTaskName').val();
				var order_status = $('#sendQuotePartnerTaskOrderStatus').val();

				if(checkNull(partner_task_val) != ''){
					partner_task_val = JSON.parse(partner_task_val.replace(/\'/g,'"'));
					PartnerTask = partner_task_val;
					PartnerTask['task_type'] = task_type;
					PartnerTask['task_name'] = task_name;
					PartnerTask['order_status'] = order_status;
				}
				else{
					var customer_id = co_dt.getSalesPageDetails.Sale.customer_id;
					PartnerTask = {
						task_type:task_type,
						task_name:task_name,
						order_status:order_status,
						customer_id:customer_id
					};
				}
				var p_country  = co_dt.partner_country;
				var customer_name = checkNull(co_dt.customerData.Customer.customer_name);
				var location = '';
				
				if(checkNull(co_dt.customerData.Customer.delivery_address1) != '' && checkNull(co_dt.customerData.Customer.delivery_address2) != ''){
					var delivery_conty = checkNull(co_dt.customerData.Customer.delivery_country);
					var cust_add1  = checkNull(co_dt.customerData.Customer.delivery_address1);
					var cust_add2  = checkNull(co_dt.customerData.Customer.delivery_address2);
					var cust_country = checkNull(co_dt.customerData.Customer.delivery_country);
					var zip = checkNull(co_dt.customerData.Customer.delivery_zip);
					var city = checkNull(co_dt.customerData.Customer.delivery_city);
				}
				else{
					var delivery_conty = checkNull(co_dt.customerData.Customer.delivery_country);
					var cust_add1  = checkNull(co_dt.customerData.Customer.customer_address1);
					var cust_add2  = checkNull(co_dt.customerData.Customer.customer_address2);
					var cust_country = checkNull(co_dt.customerData.Customer.customer_country);
					var zip = checkNull(co_dt.customerData.Customer.customer_zip);
					var city = checkNull(co_dt.customerData.Customer.customer_city);
				}

				if(checkNull(cust_add2) != ''){
					location = cust_add1 + ', '+cust_add2;
				}
				else{
					location = cust_add1;
				}

				var task_d = {};

				//check quote condition
				if(1!=1 && checkNull(co_dt.customer_contact[reference_contact_id]) != ''){
					task_d = {
						'task_customer_name':customer_name,
						'location' : location,
						'is_address' : '1',
						'zip' : zip,
						'city' : city,
						'country' : cust_country,
						'customer_contact' : reference_contact_id,
						'ph_code' : checkNull(co_dt.customer_contact[reference_contact_id]['ph_code']),
						'phone' : checkNull(co_dt.customer_contact[reference_contact_id]['phone']),
						'cc_code' : checkNull(co_dt.customer_contact[reference_contact_id]['cp_code']),
						'cellphone' : checkNull(co_dt.customer_contact[reference_contact_id]['cellphone']),
						'is_edited' : 0,
					};
				}
				else{
					task_d = {
						'task_customer_name':customer_name,
						'location' : location,
						'is_address' : '1',
						'zip' : zip,
						'city' : city,
						'country' : cust_country,
						'customer_contact' : '',
						'ph_code' : '',
						'phone' : '',
						'cc_code' : '',
						'cellphone' : '',
						'is_edited' : 0,
					};
				}

				PartnerTask = Object.assign(PartnerTask,task_d);
				total_params['PartnerTask'] = PartnerTask;
			}
			if(!$.isEmptyObject(partnerMail) && checkNull(partnerMail) != ''){
				total_params['PartnerMail'] = JSON.stringify(partnerMail);
			}
			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/orders/createAndSendOrderToCustomerNew.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					localStorage.removeItem('newsales');
					if(total_params['print_option'] == 'immediate'){
						try{
							var res = complet_data.response.response.sendOrderResponse;
							if(checkNull(res.attachFile.pdf.pdf_file_name) != ''){
								var di = res.attachFile.pdf.pdf_dir;
								di = btoa(di);
								openPdf(APISERVER+'/api/downloads/report/'+di+'.json');
							}
						}
						catch(e){

						}
					}
					$('#'+co_popid).modal('hide');
					call_toastr('success',co_td.Success,checkNull(complet_data.response.response.message.msg));
					var prefix = '';
					if(checkNull(type) == 'customer'){
						prefix = '/' + partner_dir +'/';
					}
					else{
						prefix = '/';
					}
					$('#popups1').modal('hide');
					new_custom_main_page2(prefix+type+'/order/order_details/'+complet_data.response.response.create_order.order_id,'orders_list','orders_list','order_details',{order_id:complet_data.response.response.create_order.order_id});
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',co_td.Alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',co_td.Alertmessage);
						return;
					}	
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;
		});
	},
}
