var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var partner_dir = $('#partner_dir').val();

var ro_meta;
var ro_dt;
var ro_popid = 'popups';
var ro_td;
var glkey=0;

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var defaultmethod = '';
var defaultmethodid = '';
var resend_order = {
	start:function(popupid,metadata={}){
		ro_popid = popupid;
		ro_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			order_id:ro_meta.order_id,
			getTranslationsDataArray:['Save','Cancel','Send Order to customer','Send','Distribution','Destination','$emailcopy','Add another destination','Email','Customer must verify order','Edit email before sending','Create task','Task type','Task name','Set order status to','Edit more task properties','Please check the following fields','All email addresses on the customer','Success'],
		};
		if(ro_meta.id!=null && ro_meta.id!=undefined && ro_meta!=''){
			total_params.id = ro_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/sales/getReSendOrderData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ro_dt = complet_data.response.response;
				ro_td = complet_data.response.response.translationsData;
				resend_order.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ro_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ro_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('resend_order_template').innerHTML;
		ro_dt['meta'] = {lang:lang};
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		ro_dt.date_format_f = date_format_f;

		var compiledRendered = Template7(template, ro_dt);
		document.getElementById(ro_popid).innerHTML = compiledRendered;
		resizemodal(ro_popid);
		resend_order.bindEvents();
	},
	bindEvents:function(){
		$('.uni').uniform();
		resend_order.generateDistMethods(ro_dt.methods);
		$('#add_another_destination').click(function(){
			resend_order.add_new_row();
		});

		$('#resend_order_save').click(function(){
			resend_order.saveData();
		});
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
						var customer_contacts = ro_dt.customer_contact;
						
						htmls += '<select name="your_ref" class="your_ref m-wrap span12">';
							htmls += '<option value="all##sall">'+ro_td.Allemailaddressesonthecustomer+'</option>';
							for(var j in customer_contacts){
								if(checkNull(customer_contacts[j].email) != ''){
									var str = checkNull(customer_contacts[j].name) + ' &lt;'+customer_contacts[j].email+'&gt;';
									var v = customer_contacts[j].email + '##' + j;
									if(customer_contacts[j].is_default){
										htmls += '<option selected="selected" value="'+v+'">';
									}
									else{
										htmls += '<option value="'+v+'">';
									}
									
										htmls += str;
									htmls += '</option>';
								}
							}
						htmls += '</select>';
					}
					else if(dd.internal_name == 'postal'){
						htmls += '<select class="m-wrap span12 postal select_v">';
							for(var j in ro_dt.postal_methods){
								var d = ro_dt.postal_methods[j];
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

		if(defaultmethod != 'postal' && checkNull(ro_dt.your_ref) != ''){
			$('#customer_verification').show();
		}
		else{
			$('#customer_verification').hide();
		}

		for(var j in ro_dt.salesOrderData){
			var d = ro_dt.salesOrderData[j]['PartnerSalesDocument'];

			var recp_email = '';
			if(d.contact_id != 0){
				if(checkNull(ro_dt.customer_contact[d.contact_id]) != ''){
					recp_email = ro_dt.customer_contact[d.contact_id].email;
				}
			}
			else{
				recp_email = d.recipient;
			}
			var html = resend_order.generateEmail('emailaddr',recp_email ,'y');
			$('#order_dist').append(html);
		}

		var cust_def_dist = [];

		if( checkNull(ro_dt.customerData.Customer.default_distribution == 3)){
			cust_def_dist.push(1);
			cust_def_dist.push(2);
		}
		else if(checkNull(ro_dt.customerData.Customer.default_distribution) != ''){
			cust_def_dist.push(ro_dt.customerData.Customer.default_distribution);
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
					html += ro_td.$emailcopy;
				}
				else if(frm == 'email'){
					html += ro_td.Email;
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
		var html = resend_order.generateEmail('email','','y');
		$('#order_dist').append(html);
		$('.uni').uniform();	
	},
	saveData:function(){
		getUserIP(function(ip_address){

			var emailAddresses = [];

			$('input.email_addr[type="checkbox"]').each(function(){
				if($(this).is(':checked')){
					var v = $(this).closest('tr').find('input.email_addr_val[type="text"]').val();
					if(!validateEmail(v)){
						var msg = ro_td.Pleasecheckthefollowingfields+'<br/>';
						msg += ro_td.Email;
						showAlertMessage(msg,'error',ro_td.Alertmessage);
					}
					emailAddresses.push(v);
				}
			});

			$('input.custom_email[type="checkbox"]').each(function(){
				if($(this).is(':checked')){
					var v = $(this).closest('tr').find('input.custom_email[type="text"]').val();
					if(!validateEmail(v)){
						var msg = ro_td.Pleasecheckthefollowingfields+'<br/>';
						msg += ro_td.Email;
						showAlertMessage(msg,'error',ro_td.Alertmessage);
					}
					emailAddresses.push(v);
				}
			});

			var link = $('#crouter_url').val() + $('#partner_dir').val() + '/customer/order/ov';
			var siteLink = $('#crouter_url').val() + $('#partner_dir').val() + '/customer';

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
				order_id:ro_dt.getOrderDetails.Order.id,
				method_id:methods,
				ip_address:ip_address,
    			link:link,
    			siteLink:siteLink,
    			print_option:$('select.postal.select_v').val(),
    			send_flag_status:0,//check no use
    			emailAddresses:emailAddresses,
    			order_request_from:'',//check no use
    			your_ref:your_ref,
    			reference_contact_id:reference_contact_id,
			};
			
			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/orders/sendOrderToCustomerNew.json';
			params['data'] = total_params;
			params['successCallbackFunction'] = function (complet_data){
				if(complet_data.response.status == 'success'){
					$('#'+ro_popid).modal('hide');
					call_toastr('success',ro_td.Success,checkNull(complet_data.response.response.message.msg));
					var prefix = '';
					if(checkNull(type) == 'customer'){
						prefix = '/' + partner_dir +'/';
					}
					else{
						prefix = '/';
					}
					new_custom_main_page2(prefix+type+'/order/order_details/'+ro_dt.getOrderDetails.Order.id,'orders_list','orders_list','order_details',{order_id:ro_dt.getOrderDetails.Order.id});
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',ro_td.Alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',ro_td.Alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		});
	},
}
