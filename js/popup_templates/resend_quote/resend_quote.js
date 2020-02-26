var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var partner_dir = $('#partner_dir').val();

var rq_meta;
var rq_dt;
var rq_popid = 'popups';
var rq_td;
var glkey=0;

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var defaultmethod = '';
var defaultmethodid = '';
var resend_quote = {
	start:function(popupid,metadata={}){
		rq_popid = popupid;
		rq_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			quote_id:rq_meta.quote_id,
			getTranslationsDataArray:['Save','Cancel','Send Quote to customer','Send','Distribution','Destination','$emailcopy','Add another destination','Email','Customer must verify order','Edit email before sending','Create task','Task type','Task name','Set order status to','Edit more task properties','Please check the following fields','All email addresses on the customer','Success','Quote valid through','Send sms notification','Create order from quote'],
		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/sales/getQuoteReSendData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				rq_dt = complet_data.response.response;
				rq_td = complet_data.response.response.translationsData;
				resend_quote.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',rq_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',rq_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('resend_quote_template').innerHTML;
		rq_dt['meta'] = {lang:lang};
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		rq_dt.date_format_f = date_format_f;

		var compiledRendered = Template7(template, rq_dt);
		document.getElementById(rq_popid).innerHTML = compiledRendered;
		resizemodal(rq_popid);
		resend_quote.bindEvents();
	},
	bindEvents:function(){
		$('.uni').uniform();
		resend_quote.generateDistMethods(rq_dt.methods);
		
		
   		$('#add_another_destination').click(function(){
			resend_quote.add_new_row();
		});

		
		$('#resend_quote_save').click(function(){
			resend_quote.saveData();
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
						var customer_contacts = rq_dt.customer_contact;
						
						htmls += '<select name="your_ref" class="your_ref m-wrap span12">';
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
							for(var j in rq_dt.postal_methods){
								var d = rq_dt.postal_methods[j];
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
		$('#quote_dist').html(html);

		if(defaultmethod != 'postal' && checkNull(rq_dt.your_ref) != ''){
			$('#customer_verification').show();
		}
		else{
			$('#customer_verification').hide();
		}

		for(var j in rq_dt.salesQuoteData){
			var d = rq_dt.salesQuoteData[j]['PartnerSalesDocument'];

			var recp_email = '';
			if(d.contact_id != 0){
				if(checkNull(rq_dt.customer_contact[d.contact_id]) != ''){
					recp_email = rq_dt.customer_contact[d.contact_id].email;
				}
			}
			else{
				recp_email = d.recipient;
			}
			var html = resend_quote.generateEmail('emailaddr',recp_email ,'y');
			$('#quote_dist').append(html);
		}

		var cust_def_dist = [];

		if( checkNull(rq_dt.customerData.Customer.default_distribution == 3)){
			cust_def_dist.push(1);
			cust_def_dist.push(2);
		}
		else if(checkNull(rq_dt.customerData.Customer.default_distribution) != ''){
			cust_def_dist.push(rq_dt.customerData.Customer.default_distribution);
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
					html += rq_td.$emailcopy;
				}
				else if(frm == 'email'){
					html += rq_td.Email;
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
		var html = resend_quote.generateEmail('email','','y');
		$('#quote_dist').append(html);
		$('.uni').uniform();	
	},
	saveData:function(){
		getUserIP(function(ip_address){
			var emailAddresses = [];
			$('input.email_addr[type="checkbox"]').each(function(){
				if($(this).is(':checked')){
					var v = $(this).closest('tr').find('input.email_addr_val[type="text"]').val();
					if(!validateEmail(v)){
						var msg = rq_td.Pleasecheckthefollowingfields+'<br/>';
						msg += rq_td.Email;
						showAlertMessage(msg,'error',rq_td.Alertmessage);
					}
					emailAddresses.push(v);
				}
			});

			$('input.custom_email[type="checkbox"]').each(function(){
				if($(this).is(':checked')){
					var v = $(this).closest('tr').find('input.custom_email[type="text"]').val();
					if(!validateEmail(v)){
						var msg = rq_td.Pleasecheckthefollowingfields+'<br/>';
						msg += rq_td.Email;
						showAlertMessage(msg,'error',rq_td.Alertmessage);
					}
					emailAddresses.push(v);
				}
			});

			var link = $('#crouter_url').val() + $('#partner_dir').val() + '/customer/quotes/qv';

			var your_ref = '';
			var reference_contact = '';
			if($('.email_sms').is(':checked')){
				var v = $('select.your_ref').val();
				v = v.split('##');
				your_ref = checkNull(v[0]);
				reference_contact = checkNull(v[1]);
			}

			var methods = [];
			$('.check_distribution').each(function(){
				if($(this).is(':checked')){
			 		methods.push($(this).attr('data-id'));
				}
			});

			var send_sms_notification = 'n';
			if($('#sendQuoteSendSmsNotification').is(':checked')){
				send_sms_notification = 'y';
			}

			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				quote_id:rq_dt.getQuoteDetails.Quote.id,
				method_id:methods,
				ip_address:ip_address,
				link:link,
    			print_option:$('select.postal.select_v').val(),
    			emailAddresses:emailAddresses,
    			your_ref:your_ref,
    			reference_contact:reference_contact,
    			send_flag_status:'',
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/quotes/sendQuoteToCustomerNew.json';
			params['data'] = total_params;
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					$('#'+rq_popid).modal('hide');
					call_toastr('success',rq_td.Success,checkNull(complet_data.response.response.message.msg));
					var prefix = '';
					if(checkNull(type) == 'customer'){
						prefix = '/' + partner_dir +'/';
					}
					else{
						prefix = '/';
					}

					new_custom_main_page2(prefix+type+'/quote/quote_details/'+rq_dt.getQuoteDetails.Quote.id,'quotes_list','quotes_list','quote_details',{quote_id:rq_dt.getQuoteDetails.Quote.id});		
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',rq_td.Alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',rq_td.Alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		});
	}
	
}
