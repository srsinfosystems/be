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
var date_format_mask = $('#date_format_mask').val();
var partner_dir = $('#partner_dir').val();
var type = $('#type').val();
var country_list = [];
var qd_dt;
var qd_td;
var qd_meta ={};
var quoteStatus = {};
var searchParams = new URLSearchParams(window.location.search);
var sfrom = searchParams.get('from');
var quote_details = {
	start:function(meta={}){

		qd_meta = meta;
		if(checkNull(qd_meta.quote_id) == ''){
			new_custom_main_page2('/'+type+'/quotes/index','quotes_list','quotes_list','quote_lists','Delivery address');
		}
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			quote_id:qd_meta.quote_id,
			getTranslationsDataArray:['Description','Dashboard','alert message','Success','Quotes','Actions','Customer','Delivery method','None','Select','Delivery address','Delivery phone','Zip','City','Delivery name','Delivery note','$quoteh','Sent to customer','Accepted','Declined','Expired','Retract','Cancelled','Status','Quote date','Valid through','Enter valid date','$quot_foll','$followup_date','$n_fllu','$do_nt_f','Our reference','Your reference','Phone number','Quote Lines','$prodh','Quantity','Unit','Unit Price','MVA','Discount','Total Price','Checklist','Product name','View','Net amount','Total discount','Total MVA','Round off','Total amount','History','Note','$fll_p','Referrer','Tasks','Mark as accepted','Mark as cancelled','Reopen','$sns_sms_foll','$not_fllw','When accepted','$order_msg','Edit more task properties','Resend','Customer details','Print PDF','Transfer','Duplicate','Quote number','Due date','Total to pay','Total','$tota_inc_vat','Outgoing vat','$vat_spec','Rate','Base amount']	
	
		
		};
		if(checkNull(qd_meta.customer_id) != ''){
			total_params.customer_id = qd_meta.customer_id;
			customer_id = qd_meta.customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Quotes/getQuoteDetail.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				qd_dt = complet_data.response.response;
				qd_dt['CUR_SYM'] = CUR_SYM;
				qd_td = complet_data.response.response.translationsData;
				quote_details.createHtml();
				$('.boxless li:nth-child(1)>a').trigger('click');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',qd_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qd_td.alertmessage);
					return;
				}	
			}
		}
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

		qd_dt.date_format_f = date_format_f;

		qd_dt.type = type;
		qd_td.dashboardurl = base_url+'dashboard/index';
		qd_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		quoteStatus = {
			1:'',
			2:qd_td.Senttocustomer,
			3:qd_td.Accepted,
			4:qd_td.Declined,
			5:qd_td.Expired,
			6:qd_td.Retract,
			7:qd_td.Cancelled
		};

		var quote_status = checkNull(qd_dt.getQuoteDetails.Quote.status);
		qd_dt.quoteStatus = quoteStatus[quote_status];

		qd_dt.quoteDate = convertDateIntoSiteFormat(checkNull(qd_dt.getQuoteDetails.Quote.created));

		qd_dt.quote_number = checkNull(qd_dt.getQuoteDetails.Quote.quote_number)
		qd_dt.due_date = convertDateIntoSiteFormat(checkNull(qd_dt.getQuoteDetails.Quote.due_date));
		if(checkNull(qd_dt.getQuoteDetails.Quote.bp_referrer) == ''){
			qd_dt.getQuoteDetails.Quote.bp_referrer = '';
		}
		var str = '';
		if(quote_status == 3){
			if("Order" in qd_dt.getQuoteDetails && checkNull(qd_dt.getQuoteDetails.Order) != '' && checkNull(qd_dt.getQuoteDetails.Order.id) != ''){
	
				str = qd_dt.getQuoteDetails.Order.message;
				str = str.replace('[','%');
				str = str.replace(']','%');

				for(var j in qd_dt.getQuoteDetails.Order.placeholder){
					var d = qd_dt.getQuoteDetails.Order.placeholder[j];
					var re = new RegExp('%%'+j+'%%', "\g\i");
					str = str.replace(re, d);
				}
				str = '<a style="color: #0d638f;text-decoration:none" href="'+base_url+'order/order_details/'+qd_dt.getQuoteDetails.Order.id+'">'+str+'</a>';
			}
		}
		qd_dt.orderstr = str;
		qd_dt.whnaccptd = '';
		if(checkNull(qd_dt.getQuoteDetails.Quote.task_on_order) != ''){
			var order_msg = qd_td.$order_msg;
			order_msg = order_msg.replace('%status%',checkNull(qd_dt.getQuoteDetails.Quote.order_status_val));
			order_msg = order_msg.replace('%task_type%',checkNull(qd_dt.getQuoteDetails.Quote.task_type_val));


			var url = base_url + 'sales/update_order_task/'+qd_dt.getQuoteDetails.Quote.id;
			order_msg += '&nbsp;&nbsp;<a class="btn blue-stripe mini hidden-phone-margin" href="javascript:;" onclick="show_modal(this,\'popups3\');" data-url="'+url+'"><i class="icon-edit"></i>&nbsp;'+qd_td.Editmoretaskproperties+'</a>';
			

			qd_dt.whnaccptd = order_msg;
			console.log(order_msg);
		}
		qd_dt.phones = '';
		if( checkNull(qd_dt.getQuoteDetails.Quote.your_ref_phone_format).trim() != '' && checkNull(qd_dt.getQuoteDetails.Quote.your_ref_cellphone_format).trim() != ''){
			qd_dt.phones = qd_dt.getQuoteDetails.Quote.your_ref_phone_format.trim() + ', '+qd_dt.getQuoteDetails.Quote.your_ref_cellphone_format.trim();
		}
		else if(checkNull(qd_dt.getQuoteDetails.Quote.your_ref_phone_format).trim() != ''){
			qd_dt.phones = qd_dt.getQuoteDetails.Quote.your_ref_phone_format.trim();
		}
		else if(checkNull(qd_dt.getQuoteDetails.Quote.your_ref_cellphone_format).trim() != ''){
			qd_dt.phones = qd_dt.getQuoteDetails.Quote.your_ref_cellphone_format.trim();
		}
		try{
			qd_dt.getQuoteDetails.Quote.sales_fields = JSON.parse(qd_dt.getQuoteDetails.Quote.sales_fields);
		}
		catch(e){
			qd_dt.getQuoteDetails.Quote.sales_fields = {};
		}

		if(!"your_ref_name" in qd_dt.getQuoteDetails.Quote || checkNull(qd_dt.getQuoteDetails.Quote.your_ref_name) == '' ){
			qd_dt.getQuoteDetails.Quote.your_ref_name = '';
		}
		qd_dt.type = type;
		var template = document.getElementById('quote_details_template').innerHTML;
		var compiledRendered = Template7(template, qd_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		quote_details.bindEvents();
	},
	bindEvents:function(){

		var html = '';
		for(var j in qd_dt.getQuoteDetails.Quote.sales_fields){
			var d = qd_dt.getQuoteDetails.Quote.sales_fields[j];
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
		if(checkNull(qd_dt.getQuoteDetails.Quote.status) == 2 && type != 'customer'){
			var opts = [
				{text:qd_td.Senttocustomer,value:2},
				{text:qd_td.Accepted + qd_dt.orderstr,value:3},
				{text:qd_td.Cancelled,value:7},
			];
			var html = '<a class="quote_edit"></a>';
			$('.quote_editable').html(html);
			
			$('.quote_edit').editable({
				value: checkNull(qd_dt.getQuoteDetails.Quote.status),  
		       	mode:'inline',  
		       	type: 'select2',
		       	source:opts,
		       	showbuttons:'bottom',
		       	emptytext:'',
		       	success:function(data, config){
		       		if(config == 3){
		       			quote_details.updateQuoteStatus('accpt');
		       		}
		       		else if(config == 7){
		       			quote_details.updateQuoteStatus('cncl');
		       		}
		       	},
			});
		}

		if(checkNull(qd_dt.quoteCount) != '' && checkNull(qd_dt.quoteCount) != 0){
			$('#show_quote_note_counter').html(qd_dt.quoteCount).show();
		}
		else{
			$('#show_quote_note_counter').hide();
		}
		quote_details.bindEditable();
		var tr = '';
		var tax_details = {};
		var anyonecheck = 0;
		var isanyonei = 0;
		var isanyoned = 0;
		
		for(var j in qd_dt.getQuoteDetails.QuoteLine){
			var d = qd_dt.getQuoteDetails.QuoteLine[j];


			if(checkNull(d.percentage) != '' && checkNull(d.percentage) != 0){
				if(d.percentage in tax_details && checkNull(tax_details[d.percentage]) != ''){
					tax_details[d.percentage] = {
						vat :parseFloat(tax_details[d.percentage]['vat']) + parseFloat(d.tax),
						amt :parseFloat(tax_details[d.percentage]['amt']) + (parseFloat(d.gross_amount) - parseFloat(d.tax))
					}; 
					
				}
				else{
					tax_details[d.percentage] = {
						vat:d.tax,
						amt:parseFloat(d.gross_amount) - parseFloat(d.tax)
					};
				}
				
			}

			tr += '<tr>';
				tr += '<td style="width:9%">'+checkNull(d.product_number)+'</td>';
				tr += '<td>'+checkNull(d.product_name)+'</td>';
				tr += '<td>'+convertIntoLocalFormat(checkNull(d.qty))+'</td>';
				tr += '<td>'+checkNull(d.unit)+'</td>';
				tr += '<td style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.unit_price))+'</td>';
				tr += '<td style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.unit_price) * checkNull(d.qty))+'</td>';
				tr += '<td style="text-align:right" class="tax_hide"> '+checkNull(d.percentage)+'</td>';
				tr += '<td style="text-align:right" class="tax_hide">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.tax))+'</td>';
				if(checkNull(d.discount) != 0 && checkNull(d.discount) != '' && isanyoned != 1){
					isanyoned = 1;
				}
				tr += '<td style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.discount))+'</td>';
				tr += '<td style="text-align:right" class="azq">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.gross_amount))+'</td>';
				html += '<td style="text-align:right" class="az">';
					html += convertIntoLocalFormat(checkNull(d.total_amount));
				html += '</td>';

				if(checkNull(d.answers) != '' && d.answers.ignore != 1){
					anyonecheck++;
					tr += '<td><a class="btn mini blue-stripe" href="javascript:;" onclick="quote_details.showCheck('+d.partner_list_id+','+d.id+')"><i class="icon-eye-open"></i> '+qd_td.View+'</a></td>';
				}
				else{
					tr += '<td class="checklist_hide"></td>';
				}
			tr += '</tr>';

		}

		//tax details
		var taxhtml = `
			<table class="table table-striped table-hover" style="margin:0;">
				<thead>
					<th class="text-left">`+qd_td.$vat_spec+`</th>
					<th class="text-right">`+qd_td.Rate+`</th>
					<th class="text-right">`+qd_td.Baseamount+`</th>
					<th class="text-right">`+qd_td.MVA+`</th>
				</thead>
			`;
		for(var j in tax_details){
			taxhtml += '<tr>';
				taxhtml += '<td class="text-left">'+qd_td.Outgoingvat+'</td>';
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
			
		$('.net_amount').html(convertIntoLocalFormat(checkNull(qd_dt.getQuoteDetails.QuoteSummary.net_amount)));

		if(checkNull(qd_dt.getQuoteDetails.QuoteSummary.total_discount) == '' || checkNull(qd_dt.getQuoteDetails.QuoteSummary.total_discount) == 0){
			$('.total_discount').parent().hide();
		}
		$('.total_discount').html(convertIntoLocalFormat(checkNull(qd_dt.getQuoteDetails.QuoteSummary.total_discount)));

		
		$('.total_vat').html(convertIntoLocalFormat(checkNull(qd_dt.getQuoteDetails.QuoteSummary.total_vat)));

		if(checkNull(qd_dt.getQuoteDetails.QuoteSummary.round_off) == '' || checkNull(qd_dt.getQuoteDetails.QuoteSummary.round_off) == 0){
			$('.total_roundoff').parent().hide();
		}
		$('.total_roundoff').html(convertIntoLocalFormat(checkNull(qd_dt.getQuoteDetails.QuoteSummary.round_off)));
		
		$('.total_to_pay').html(convertIntoLocalFormat(checkNull(qd_dt.getQuoteDetails.QuoteSummary.gross_amount)));
		$('.total').html(convertIntoLocalFormat(checkNull(qd_dt.getQuoteDetails.QuoteSummary.net_amount,0) - checkNull(qd_dt.getQuoteDetails.QuoteSummary.discount,0) ));


		$('#product_lines').html(tr);

		if(qd_dt.getPartnerCustomSettings.PartnerSetting.vat_required != 'y'){
			$('.tax_hide').hide();
		}
		else{
			$('.tax_hide').show();
		}
		if(checkNull(qd_dt.getQuoteDetails.QuoteSummary.total_vat) == '' || checkNull(qd_dt.getQuoteDetails.QuoteSummary.total_vat) == 0){
			$('.total_vat').parent().hide();
		}

		if(isanyoned == 0){
			$('#sorting_product_line th:nth-child(9),#product_lines td:nth-child(9)').hide()
		}

		if(anyonecheck == 0){
			$('.checklist_hide').hide();
		}


		var delivery_methods = [{text:'',value:''}];
		var default_str = '';
		for(var j in qd_dt.deliveryMethods){
			var d = qd_dt.deliveryMethods[j];
			var id = j+'##'+d.value;
			var name = d.value;
			delivery_methods.push({
				text:name,
				value:id
			});
			
			if(qd_dt.getQuoteDetails.Quote.delivery_method == j){
				default_str = id;
			}
		}

		if(qd_dt.getPartnerCustomSettings.PartnerSetting.enable_delivery_method == 'n'){
			default_str = '';
			$('#delivery_methods').parent().parent().parent().parent().hide();
		}
		if(checkNull(default_str) != '') {
			var arr = default_str.split('##');
			var v = arr[0];
			var delMethod = qd_dt.deliveryMethods[v];
			var internal_name = delMethod.internal_name;
			if(internal_name.toLowerCase() == 'email') {
				$('.deliv_addr,.deliv_note').hide();
			}else {
				$('.deliv_addr,.deliv_note').show();
			}

			if(qd_dt.getPartnerCustomSettings.PartnerSetting.enable_delivery_note == 'n'){
				$('.deliv_note').hide();
			}
		}
		else{
			//deliv_note
			$('.deliv_addr').hide();
		}

		$("#delivery_methods").editable({
	       	value: default_str,  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:false,
	        send: 'never',
	        emptytext: qd_td.None,
	        source:delivery_methods,
	        select2: {
	        	placeholder:qd_td.Select,
				minimumResultsForSearch: -1,
				allowClear:true
			},
	        success: function(data, newValue) {
	        	quote_details.updateQuote();
	        }
	    });



	    $('#location').editable({
			mode:'inline',  
			send:'never',
			value: {
				delivery_name: checkNull(qd_dt.getQuoteDetails.Quote.delivery_name),
				delivery_address1: checkNull(qd_dt.getQuoteDetails.Quote.delivery_address1),
				delivery_address2: checkNull(qd_dt.getQuoteDetails.Quote.delivery_address2),
				delivery_zip: checkNull(qd_dt.getQuoteDetails.Quote.delivery_zip),
				delivery_city: checkNull(qd_dt.getQuoteDetails.Quote.delivery_city),
				delivery_country: checkNull(qd_dt.getQuoteDetails.Quote.delivery_country),
				delivery_phone_code: checkNull(qd_dt.getQuoteDetails.Quote.delivery_phone_code),
				delivery_phone: checkNull(qd_dt.getQuoteDetails.Quote.delivery_phone), 		
			},
			sourceCountry:country_list,
			success:function(data,config){
				quote_details.updateQuote(config,'location');
			},
		});

		$('#location').on('hidden', function(e, reason) {
			$('.del_addr').show();
			$('.del_addra').hide();
		});
		$('#location').on('shown', function(e, editable) {
			 $('.del_addr').hide();
			 $('.del_addra').show();
		});

		if(qd_dt.getPartnerCustomSettings.PartnerSetting.enable_delivery_note == 'n'){
			qd_dt.getQuoteDetails.Quote.delivery_note = '';
			$('.deliv_note').hide();
		}

		$('#custom_delivery_note').editable({
	       	value: checkNull(qd_dt.getQuoteDetails.Quote.delivery_note),  
	       	emptytext:qd_td.Deliverynote,
	       	mode:'inline',  
	       	send: 'never',
	       	type: 'textarea',
	       	inputclass: '',
	       	showbuttons:'right',
	        success: function(data, config) {
	        	quote_details.updateQuote(config,'custom_delivery_note');
	   		},

		});


		//if(qd_dt.getQuoteDetails.Quote.status != 3 && type != 'customer'){
			$("#expireDate").editable({
				value:checkNull(qd_dt.due_date),
				type:'text',
		       	mode:'inline',  
		       	emptytext:'',
		       	validate:function(value){

		       		var res = convertIntoSystemDate(value);
		       		if(!res){
		       			return qd_td.Entervaliddate;
		       		}
		       	},
		        success: function(data, config) {
		        	quote_details.updateQuote(config,frm='date');
		   		},
			});
		//}


		var reminder_value = '';
		var followuptext = '';
		if(qd_dt.getQuoteDetails.Quote.status == 2){
			var reminder_value = '';
			if(checkNull(qd_dt.getQuoteDetails.Quote.reminder_flag) == 0){
				reminder_value = '0';
			}
			else if(checkNull(qd_dt.getQuoteDetails.Quote.reminder_flag) == 1 && checkNull(qd_dt.getQuoteDetails.Quote.reminder_followup_status) != ''){
				reminder_value = 1;
				var followuptext = qd_td.$followup_date;
				followuptext = followuptext.replace('%name%',checkNull(qd_dt.getQuoteDetails.QuoteReminderSetting.name));
				followuptext = followuptext.replace('%date%',convertDateIntoSiteFormat(checkNull(qd_dt.getQuoteDetails.Quote.reminder_followup_date)));
			}

			if(reminder_value == 1 && checkNull(followuptext) != ''){
				var opts = [
					{value:1,text:followuptext},
					{value:0,text:qd_td.$do_nt_f}
				];
			}
			else{
				var opts = [
					{value:'empty',text:qd_td.$n_fllu},
					{value:0,text:qd_td.None}
				];
			}
			if(checkNull(reminder_value) == ''){
				reminder_value = 'empty';
			}
			$('#followup_methods').editable({
				value:reminder_value,
				type: 'select2',
				select2: {
	        		placeholder:qd_td.Select,
					minimumResultsForSearch: -1,
				},
				mode:'inline', 
				send:'never',
				source:opts,
				inputclass: 'm-wrap followup_methods',
				success: function(response, newValue) {
					if(newValue == 'empty'){
						newValue = '';
					}
					quote_details.updateQuote(newValue,'followup_methods');
				}
			});
		}

		$('.btn_quote_accepted').click(function(){
			quote_details.updateQuoteStatus('accpt')
		});

		$('.btn_quote_cancelled').click(function(){
			quote_details.updateQuoteStatus('cncl')
		});

		$('.btn_quote_cancelled').click(function(){
			quote_details.updateQuoteStatus('cncl')
		});
		$('#send_sms_followup').click(function(){
			quote_details.sendSmsFollowUp();
		});

		$('#add_followup').click(function(){
			new_custom_popup2('600','popups','quote_notes',{from:'manual',status:qd_dt.getQuoteDetails.Quote.status,quote_id:qd_dt.getQuoteDetails.Quote.id});
		});
		

		
	},
	bindEditable:function(){
		var getAllCountryList = qd_dt.getAllCountryList;
		country_list = [{text:'',value:''}];
		for(var j in getAllCountryList){
			country_list.push({
				text:getAllCountryList[j],
				value:j,
			});
		}

		(function ($) {
		    "use strict";

		    var Location = function (options) {
		        this.sourceCountryData = options.sourceCountry;
		        this.init('location', options, Location.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Location, $.fn.editabletypes.abstractinput);
		    $.extend(Location.prototype, {

		        render: function () {
		            this.$input = this.$tpl.find('input');
		            this.$textarea = this.$tpl.find('textarea');
		       
		            this.$list = this.$tpl.find('select');

		            this.$list.empty();

		            var fillItems = function ($el, data) {
		                if ($.isArray(data)) {
		                    for (var i = 0; i < data.length; i++) {
		                        if (data[i].children) {
		                            $el.append(fillItems($('<optgroup>', {
		                                label: data[i].text
		                            }), data[i].children));
		                        } else {
		                            $el.append($('<option>', {
		                                value: data[i].value
		                            }).text(data[i].text));
		                        }
		                    }
		                }
		                return $el;
		            };

		            fillItems(this.$list, this.sourceCountryData);
		            this.$list.select2();
		        },

		        value2html: function (value, element) {
		            if (!value) {
		                $(element).empty();
		                return;
		            }
		            var countryText = value.delivery_country;
		            $.each(this.sourceCountryData, function (i, v) {
		                if (v.value == countryText) {
		                    countryText = v.text.toUpperCase();
		                }
		            });
					
					if(qd_dt.getPartnerCustomSettings.PartnerSetting.show_customer_country == 'y'){

		            }
		            else{
		            	if(value.delivery_country == qd_dt.partner_country){
		            		countryText = '';
		            	}
		            }
						if((value.delivery_country== qd_dt.partner_country) && (qd_dt.getPartnerCustomSettings.PartnerSetting.show_customer_country == 'n')){
							if(value.delivery_name == '' && value.delivery_zip == '' && value.delivery_city == ''){
								var html = qd_td.Deliveryaddress;
							}else if(value.delivery_name == ''){
								if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								}else{
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(value.delivery_address1 == ''){
								 if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									 var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }	
							}else if(value.delivery_address2 == ''){
								 if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									 var html = $('<div>').text(value.delivery_name).html()+ '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else if(value.delivery_zip == ''){
								 if(value.delivery_phone == ''){
									 if(value.delivery_city == ''){ 
										var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html();
									 }else{
										 var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html();
									 }	
								 }else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else if(value.delivery_city == ''){
								 if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html();
								 }else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else if(value.delivery_country == ''){
								if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									 var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + ' ' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else{
								if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}
						}else{
							if(value.delivery_name == '' && value.delivery_zip == '' && value.delivery_city == '' && value.delivery_country == ''){
								
									var html = qd_td.Deliveryaddress;
								
							}else if(value.delivery_name == ''){
								if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}	
							}else if(value.delivery_address1 == ''){
								if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();	
								}
							}else if(value.delivery_address2 == ''){
								if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(value.delivery_zip == ''){
								if(value.delivery_phone == ''){
									if(value.delivery_city == ''){ 
										var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + ' ' + $('<div>').text(countryText).html();
									}else{
										var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
									}
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(value.delivery_city == ''){
								if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(value.delivery_country == ''){
								 if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html(); 
								 }	
							}else{
								if(value.delivery_phone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}
						}
	
			
		            	$(element).html(html);
		        },

		        html2value: function (html) {
		            return null;
		        },

		        value2str: function (value) {
		            var str = '';
		            if (value) {
		                for (var k in value) {
		                    str = str + k + ':' + value[k] + ';';
		                }
		            }
		            return str;
		        },

		        str2value: function (str) {
		            return str;
		        },

		        value2input: function(value) {
		            this.$input.filter('[name="delivery_name"]').val(value.delivery_name);
		            this.$input.filter('[name="delivery_address1"]').val(value.delivery_address1);
		            this.$input.filter('[name="delivery_address2"]').val(value.delivery_address2);
		            this.$input.filter('[name="delivery_zip"]').val(value.delivery_zip);
		            this.$input.filter('[name="delivery_city"]').val(value.delivery_city);
		            this.$list.val(value.delivery_country).trigger('change');
		            this.$input.filter('[name="delivery_phone_code"]').val(value.delivery_phone_code);
		            this.$input.filter('[name="delivery_phone"]').val(value.delivery_phone);
		        },
		              
		        input2value: function() {
		            return {
		               delivery_name: this.$input.filter('[name="delivery_name"]').val(),
		               delivery_address1: this.$input.filter('[name="delivery_address1"]').val(),
		               delivery_address2: this.$input.filter('[name="delivery_address2"]').val(),
		               delivery_zip: this.$input.filter('[name="delivery_zip"]').val(),
		               delivery_city: this.$input.filter('[name="delivery_city"]').val(),
		               delivery_country: this.$list.val(),
		               delivery_phone_code: this.$input.filter('[name="delivery_phone_code"]').val(),
		               delivery_phone: this.$input.filter('[name="delivery_phone"]').val(),
		            };
		        },
		        
		        activate: function () {
		            this.$input.filter('[name="delivery_name"]').focus();
		            $('#delivery_zip').change(function(){
		            	fetchCityFromZip($('#delivery_zip').val(),$('#customer_delivery_country').val(),'delivery_city')
		            });

		            $('#customer_delivery_country').change(function(){
		            	fetchPhoneInitials($('#customer_delivery_country').val(),'delivery_phone_code')
		            }).trigger('change');


		            
		        },

		        autosubmit: function () {
		            this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		            });
		        }
		    });

			var tpl = '<div class="row-fluid">' +
				'<label class="e_delivery_address_label text-bold" style="margin-left: -136px;">'+qd_td.Deliveryname+'</label>'+
				'<div class="editable-location"  style="margin-top: -23px;">'+
		        '<input type="text" class="input-inline delivery_name " autocomplete="off" name="delivery_name">' +
		        '</div>' +
		        '<label class="e_delivery_address_label text-bold" style="margin-left: -136px;">'+qd_td.Deliveryaddress+'</label>'+
		        '<div class="editable-location" style="margin-top: -23px;">' +
		        '<label class="inline_delivery_address_label hide">'+qd_td.Deliveryaddress+'</label>'+
		        '<label><input  type="text" class="input-inline delivery_address1 " autocomplete="off" name="delivery_address1"></label>' +
		        '</div>' +
		        '<div class="editable-location">' +
		        '<label><input  type="text" class="input-inline delivery_address2 " autocomplete="off" name="delivery_address2"></label>' +
		        '</div>';

				if(lang == 'nb'){
					tpl += '<label class="e_delivery_zip_label" style="margin-left: -138px;margin-top: 4px;">'+qd_td.Zip+', '+qd_td.City+'</label>';
				}
				else{ 
					tpl += '<label class="e_delivery_zip_label" style="margin-left: -84px;margin-top: 4px;">'+qd_td.Zip+', '+qd_td.City+'</label>';
				}
		        tpl += '<div class="editable-location" style="margin-top: -26px;">' +
		        '<label class="inline_delivery_zip_label hide">'+qd_td.Zip+', '+qd_td.City+'</label>'+
		        '<label><input type="text" class="input-inline delivery_zip" id="delivery_zip" autocomplete="off" name="delivery_zip" style="width:40px;"></label><label><input style="width:93px;"  type="text" class="input-inline delivery_city "  name="delivery_city" autocomplete="off" id="delivery_city"></label>' +
		        '</div>' +
		        '<div class="editable-location">' +
		        '<label><select name="delivery_country" id="customer_delivery_country" autocomplete="off" class="input-inline-maxi delivery_country"></select></label>' +
		        '</div>'+
		        '<label class="e_delivery_address_label" style="margin-left: -123px;">'+qd_td.Deliveryphone+'</label>'+
		        '<div class="editable-location" style="margin-top: -23px;">' +
		        '<label class="inline_delivery_address_label hide">'+qd_td.Deliveryphone+'</label>'+
		        '<label><input type="text" class="input-inline delivery_phone_code" readonly id="delivery_phone_code" name="delivery_phone_code" style="width:40px;"></label><label><input style="width:93px;" type="text" class="input-inline delivery_phone " name="delivery_phone" id="delivery_phone"></label>' +
		        '</div></div>';

		    Location.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		       	tpl: tpl,
		        inputclass: '',
		        showbuttons: 'bottom',
		        sourceCountry: [],
		    });

		    $.fn.editabletypes.location = Location;
		}(window.jQuery));

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
		        },
		        value2html: function(value, element) { 
		            if(!value) {
		               $(element).empty();
		               return; 
		            }
		        	
		           	var html = '';

		            if(checkNull(value)!=''){
		            	html += $('<div>').text(value).html();
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
					this.$input.filter('[name="due_date"]').val(checkNull(value));
		 
		       },           
		       input2value: function() { 
		           return this.$input.filter('[name="due_date"]').val();
		       },         
		       activate: function() {
		       		//this.$input.inputmask(date_format_mask ,{autoUnmask: false});	
		    
		       		this.$input.datepicker({
		       			format:qd_dt.date_format_f
		       		}).change(function(){
   						$('.datepicker').remove();
   					});
   					
		       		this.$input.filter('[name="due_date"]').focus();
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
		        tpl: '<div class="editable-address"><label><input type="text" id="due_date" name="due_date"></label></div>'+
		       	 '</div>',
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.dob = Dob;
		}(window.jQuery));
	},
	showCustomer:function(customer_id){
		new_custom_main_page2('/'+type +'/'+'customers/details/'+customer_id,'all_customers','all_customers','customer_details',{customer_id:customer_id});
	},
	convertIntoLocalFormat:function(d){
		return convertIntoLocalFormat(d);
	},
	showCheck:function(list_id,line_id){
		var url = base_url + 'quotes/showChecklists/'+list_id+'?line_key='+line_id;
		var a = document.createElement('div');
		$(a).attr('data-url',url);
		$(a).attr('data-width','700px');
		show_modal(a,'popups');

	},
	updateQuote:function(data,frm){
		showProcessingImage('undefined');
		var tparams = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			quote_id:qd_dt.getQuoteDetails.Quote.id
		};

		if(frm == 'custom_delivery_note'){
			var obj = {delivery_note:data};
			var total_params = Object.assign(tparams,obj);
		}
		else{
			var delivery_methods = $('#delivery_methods').editable('getValue').delivery_methods;
			if(checkNull(delivery_methods) != '') {
				var arr = delivery_methods.split('##');
				var v = arr[0];
				var delMethod = qd_dt.deliveryMethods[v];
				var internal_name = delMethod.internal_name;
				delMethod = v;
				if(internal_name.toLowerCase() == 'email') {
					if(frm == 'custom_delivery_note'){
						var delivery_note = data;
					}
					else{
						var delivery_note = $('#custom_delivery_note').editable('getValue').custom_delivery_note;
					}
					
					if(frm == 'location'){
						var location = data;
					}
					else{
						var location = $('#location').editable('getValue').location;
					}
					
					

				}else {
					// var location = {
					// 	delivery_name: '',
					// 	delivery_address1: '',
					// 	delivery_address2: '',
					// 	delivery_zip: '',
					// 	delivery_city: '',
					// 	delivery_country: '',
					// 	delivery_phone_code: '',
					// 	delivery_phone: '',		
					// };
					// var delivery_note = '';
					if(frm == 'location'){
						var location = data;
					}
					else{
						var location = $('#location').editable('getValue').location;
					}
				}
			}
			else{
				var delMethod= '';
				if(frm == 'custom_delivery_note'){
					var delivery_note = data;
				}
				else{
					var delivery_note = $('#custom_delivery_note').editable('getValue').custom_delivery_note;
				}
				
				if(frm == 'location'){
					var location = data;
				}
				else{
					var location = $('#location').editable('getValue').location;
				}
			}

			if(frm == 'date'){
				var due_date = data;
			}
			else{
				var due_date = $('#expireDate').editable('getValue').expireDate;
			}

			if(frm == 'followup_methods'){
				var followup_status = data;
			}
			else{
				var followup_status = $('#followup_methods').editable('getValue').followup_methods;
			}
			
			var nparams = {
				due_date:due_date,
				followup_status:followup_status,
				delivery_method_id:delMethod,
				delivery_note:delivery_note,
			};
			nparams = Object.assign(nparams,location);
			var total_params = Object.assign(tparams,nparams);
		}

	
		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		if(frm == 'custom_delivery_note'){
			params['url'] = APISERVER+'/api/Quotes/updateQuoteDeliveryNote.json';
		}
		else{
			if(frm == 'date'){
				total_params['request_from'] = 'due_date';
			}
			
			total_params['due_date'] = convertIntoSystemDate(total_params['due_date'] );
			params['url'] = APISERVER+'/api/Quotes/updateQuoteDetails.json';
		}
		
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				if(frm == 'custom_delivery_note'){
					call_toastr('success',qd_td.Success,complet_data.response.response.message);
				}
				else{
					var default_str = total_params.delivery_method_id;
					if(checkNull(default_str) != '') {
						var v = default_str;
						var delMethod = qd_dt.deliveryMethods[v];
						var internal_name = delMethod.internal_name;
						if(internal_name.toLowerCase() == 'email') {
							$('.deliv_addr,.deliv_note').hide();
						}else {
							$('.deliv_addr,.deliv_note').show();
						}
					}
					else{
						$('.deliv_addr,.deliv_note').hide();
					}
					call_toastr('success',qd_td.Success,complet_data.response.response.message);
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',qd_td.alertmessage);
					//return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qd_td.alertmessage);
					//return;
				}	
				new_custom_main_page2('/' + type + '/quotes/quote_details/'+qd_meta.quote_id,'quotes_list','quotes_list','quote_details',{quote_id:qd_meta.quote_id})
			}
		}
		doAjax(params);
		return;
	},
	updateQuoteStatus:function(frm){
		showProcessingImage('undefined');
		if(checkNull(partner_dir) != ''){
			partner_dir = partner_dir + '/';
		}
		var sitelink = base_url + partner_dir +'customer';
		getUserIP(function(ip){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				quote_id:qd_dt.getQuoteDetails.Quote.id,
				status:qd_dt.getQuoteDetails.Quote.status,
				ip_address:ip,
				reopen_reason:'',
				is_reopen:'',
				sitelink:sitelink

			};
			if(frm == 'accpt'){
				total_params.status = 3;
			}
			else if(frm == 'cncl'){
				total_params.status = 7;
			}
			var params = $.extend({}, doAjax_params_default);
			params['requestType'] = 'POST';
			params['url'] = APISERVER+'/api/Quotes/updateQuoteStatus.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					new_custom_main_page2('/'+type+'/quotes/quote_details/'+qd_dt.getQuoteDetails.Quote.id,'quotes_list','quotes_list','quote_details',{quote_id:qd_dt.getQuoteDetails.Quote.id})
					call_toastr('success',qd_td.Success,complet_data.response.response.message.msg);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',qd_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',qd_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		});
	},
	showTab:function(frm){
		if(frm == 'history_list'){
			passRequest(base_url+'quotes/history_list/'+qd_dt.getQuoteDetails.Quote.id,'','undefined');
		}
		else if(frm == 'history_listn'){
			new_custom_tabs2('quote_history','quote_history_tab_content',{quote_id:qd_dt.getQuoteDetails.Quote.id,});
		}
		else if(frm == 'followup_entries'){
			new_custom_tabs2('quote_followupentries','quote_history_tab_content',{quote_id:qd_dt.getQuoteDetails.Quote.id,status:qd_dt.getQuoteDetails.Quote.status});
			//passRequest(base_url+'quotes/followup_entries/'+qd_dt.getQuoteDetails.Quote.id+'/'+qd_dt.getQuoteDetails.Quote.status,'','undefined');
		}
		else if(frm == 'note'){
			new_custom_tabs2('quote_note','quote_history_tab_content',{quote_id:qd_dt.getQuoteDetails.Quote.id,});
		}
		else if(frm == 'tasks'){
			passRequest(base_url+'task/quotes_task_list/'+qd_dt.getQuoteDetails.Quote.id,'','undefined');
		}
	},
	printPdf:function(quote_id){
		if(checkNull(partner_dir) != ''){
			partner_dir = partner_dir + '/';
		}
		var link = base_url + partner_dir +'customer/order/customer_order_acceptance';
		var print_method = 'immediate';

		var total_params = {
			token :token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			quote_id:qd_meta.quote_id,
			link:link,
			print_method:print_method
		};


		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Quotes/generateCustomerQuotePdf.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var d = complet_data.response.response;


				if(checkNull(d.pdf) != ''){
					if(checkNull(d.pdf.pdf_file_name) != ''){
						var di = 'quotes/' + d.pdf.pdf_file_name;
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
					showAlertMessage(array,'error',qd_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qd_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	showTransferPopup:function(quote_id){
		var url = base_url + 'quotes/transfer?quote_id='+quote_id+'&request_from=quote_details&from=new_quotes';
		var a = document.createElement('div');
		$(a).attr('data-url',url);
		$(a).attr('data-width','650px');
		show_modal(a,'popups1');

	},
	resend:function(){
		var quote_id = qd_dt.getQuoteDetails.Quote.id;
		var quote_status =  qd_dt.getQuoteDetails.Quote.status;
		// var url = base_url + 'quotes/send_quote_to_customer/'+quote_id+'/'+quote_status+'?from=new_quotes';

		// var a = document.createElement('div');
		// $(a).attr('data-url',url);
		// $(a).attr('data-width','650px');
		// show_modal(a,'popups');

		new_custom_popup2('650','popups','resend_quote',{from:'new_quotes',quote_id:quote_id,quote_status:quote_status});
	},
	duplicate:function(quote_id){
		passRequest(base_url + 'quotes/duplicate_quote?request_from=quote&quote_id='+quote_id,'undefined');
	},
	sendSmsFollowUp:function(){
		showProcessingImage('undefined');
		getUserIP(function(ip){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				quote_id:qd_dt.getQuoteDetails.Quote.id,
				ip_address:ip,
			};

			var params = $.extend({}, doAjax_params_default);
			params['requestType'] = 'POST';
			params['url'] = APISERVER+'/api/Quotes/sendSmsFollowUp.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					if($('#tab_quote_11').hasClass('active')){
						new_custom_tabs2('quote_history','quote_history_tab_content',{quote_id:qd_dt.getQuoteDetails.Quote.id});
					}
					call_toastr('success',qd_td.Success,complet_data.response.response.message.msg);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',qd_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',qd_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		});
	},
	getCountry:function(code){
		return 'zz';
	}

}