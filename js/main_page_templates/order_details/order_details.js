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
var od_dt;
var od_td;
var od_meta ={};
var orderStatus = {};
var searchParams = new URLSearchParams(window.location.search)
var sfrom = searchParams.get('from');
var order_details = {
	start:function(meta={}){

		od_meta = meta;
		if(checkNull(od_meta.order_id) == ''){
			new_custom_main_page2('/'+type+'/order/index','orders_list','orders_list','orders_lists');
		}
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			order_id:od_meta.order_id,
			getTranslationsDataArray:['Description','Dashboard','alert message','Success','Quotes','Actions','Customer','Delivery method','None','Select','Delivery address','Delivery phone','Zip','City','Delivery name','Delivery note','$quoteh','Sent to customer','Accepted','Declined','Open','Delivered','Processing','Cancelled','Status','Quote date','Valid through','Enter valid date','$quot_foll','$followup_date','$n_fllu','$do_nt_f','Our reference','Your reference','Phone number','Order Lines','$prodh','Quantity','Unit','Unit Price','MVA','Discount','Total Price','Checklist','Product name','View','Net amount','Total discount','Total MVA','Round off','Total amount','History','Note','$fll_p','Referrer','Tasks','Mark as accepted','Mark as cancelled','Reopen','$sns_sms_foll','$not_fllw','When accepted','$order_msg','Edit more task properties','Resend','Customer details','Print PDF','Transfer','Duplicate','Quote number','$orderh','Order date','$ord_fllu','$tracking','Order','Order number','Create task','View task','Change status','Change order status','New status','Cancel','Change','Please check the following fields','Status','Resend','Packing slip','Add note','Back','Deliver and invoice','$order_confm','Confirmation','Yes','No','$change_edit','$not_fllw','Total to pay','Total','$tota_inc_vat','Tax rate','Outgoing vat','$vat_spec','Rate','Base amount']
			
		};
		if(checkNull(od_meta.customer_id) != ''){
			total_params.customer_id = od_meta.customer_id;
			customer_id = od_meta.customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Orders/getOrderDetail.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				od_dt = complet_data.response.response;
				od_dt['CUR_SYM'] = CUR_SYM;
				od_td = complet_data.response.response.translationsData;
				order_details.createHtml();
				$('.boxless li.active>a').trigger('click');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',od_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',od_td.alertmessage);
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

		od_dt.date_format_f = date_format_f;
		od_dt.type = type;

		if(checkNull(od_dt.getAllOrderStatusList) != ''){
			order_statuses = od_dt.getAllOrderStatusList;
			delete order_statuses[1];
		}
		else{
			order_statuses = {
				2:od_td.Senttocustomer,
				3:od_td.Accepted,
				4:od_td.Declined,
				5:od_td.Open,
				6:od_td.Processing,
				7:od_td.Delivered,
				8:od_td.Cancelled
			};		
		}

		od_dt.order_statuses = order_statuses;
		var order_status = checkNull(od_dt.getOrderDetails.Order.status);
		od_dt.orderStatusStr = order_statuses[order_status];
		od_dt.orderStatusInvMsg = '';
		if(checkNull(od_dt.inv_message) != ''){
			var inv_id = od_dt.inv_id;
			if(checkNull(inv_id) != ''){
				var pd = '';
				if(type == 'customer'){
					pd = '/'+partner_dir + '/';
				}
				else{
					pd = '/';
				}

				od_dt.orderStatusInvMsg = ` <a style="text-decoration:none"    onclick="new_custom_main_page2('`+pd + type+`/invoice/invoice_details/`+inv_id+`','invoices_list','invoices_list','invoice_details',{invoice_id:`+inv_id+`});" >` + od_dt.inv_message + `</a>`;
			}
			else{
				od_dt.orderStatusInvMsg =' <a style="text-decoration:none">' + od_dt.inv_message + '</a>';
		
			}
		}
		od_dt.orderDate = convertDateIntoSiteFormat(checkNull(od_dt.getOrderDetails.Order.created));
		od_dt.order_number = checkNull(od_dt.getOrderDetails.Order.order_number);

		od_dt.phones = '';
		if( checkNull(od_dt.getOrderDetails.Order.your_ref_phone_format).trim() != '' && checkNull(od_dt.getOrderDetails.Order.your_ref_cellphone_format).trim() != ''){
			od_dt.phones = od_dt.getOrderDetails.Order.your_ref_phone_format.trim() + ', '+od_dt.getOrderDetails.Order.your_ref_cellphone_format.trim();
		}
		else if(checkNull(od_dt.getOrderDetails.Order.your_ref_phone_format).trim() != ''){
			od_dt.phones = od_dt.getOrderDetails.Order.your_ref_phone_format.trim();
		}
		else if(checkNull(od_dt.getOrderDetails.Order.your_ref_cellphone_format).trim() != ''){
			od_dt.phones = od_dt.getOrderDetails.Order.your_ref_cellphone_format.trim();
		}

		try{
			od_dt.getOrderDetails.Order.sales_fields = JSON.parse(od_dt.getOrderDetails.Order.sales_fields);
		}
		catch(e){
			od_dt.getOrderDetails.Order.sales_fields = {};
		}

		od_td.dashboardurl = base_url+'dashboard/index';
		od_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		od_dt.type = type;
		var template = document.getElementById('order_details_template').innerHTML;
		var compiledRendered = Template7(template, od_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		order_details.bindEvents();
	},
	bindEvents:function(){
	
		var html = '';
		for(var j in od_dt.getOrderDetails.Order.sales_fields){
			var d = od_dt.getOrderDetails.Order.sales_fields[j];
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

		var reminder_value = '';
		var followuptext = '';

		var opts = [];
		if(checkNull(od_dt.getAllOrderStatusList) != ''){
			var order_statuses = od_dt.getAllOrderStatusList;
			delete order_statuses[1];

			for(var p in order_statuses){
				opts.push({
					text:order_statuses[p],
					value:p,
				});
			}
		}
		else{
			opts = [
				{text:od_td.Senttocustomer,value:2},
				{text:od_td.Accepted,value:3},
				{text:od_td.Declined,value:4},
				{text:od_td.Open,value:5},
				{text:od_td.Processing,value:6},
				{text:od_td.Delivered,value:7},
				{text:od_td.Cancelled,value:8},
			];		
		}
		$('#btn_change_status').editable({
			value: checkNull(od_dt.getOrderDetails.Order.status),  
	       	mode:'inline',  
	       	type: 'select2',
	       	source:opts,
	       	showbuttons:'bottom',
	       	emptytext:'',
	       	success:function(data, status){
	       		if(checkNull(status) == ''){
	      			var finalerrmsg = od_td.Pleasecheckthefollowingfields+ ':<br/>' + od_td.Status;
					showAlertMessage(finalerrmsg,'error',od_td.alertmessage);
					return;
	      		}
	      		order_details.updateOrderStatus('',status);
	       	},
		});
		if(checkNull(od_dt.orderNoteCount)){
			$('#show_order_note_counter').html(od_dt.orderNoteCount	).show();
		}
		else{
			$('#show_order_note_counter').hide();
		}

		if(checkNull(od_dt.getOrderDetails.Order.reminder_flag) == 0){
			reminder_value = '0';
		}
		else if(checkNull(od_dt.getOrderDetails.Order.reminder_flag) == 1 && checkNull(od_dt.getOrderDetails.Order.reminder_followup_status) != ''){
			reminder_value = 1;
			var followuptext = od_td.$followup_date;
			followuptext = followuptext.replace('%name%',checkNull(od_dt.getOrderDetails.OrderReminderSetting.name));
			followuptext = followuptext.replace('%date%',convertDateIntoSiteFormat(checkNull(od_dt.getOrderDetails.Order.reminder_followup_date)));
		}

		if(reminder_value == 1 && checkNull(followuptext) != ''){
			var opts = [
				{value:1,text:followuptext},
				{value:0,text:do_nt_f}
			];
		}
		else{
			var opts = [
				{value:'',text:od_td.$n_fllu},
				{value:0,text:od_td.None}
			];
		}
		$('#followup_methods').editable({
			value:reminder_value,
			type: 'select',
			mode:'inline', 
			send:'never',
			source:opts,
			inputclass: 'm-wrap followup_methods',
			validate:function(){
				return '';
			},
			success: function(response, newValue) {
				order_details.updateOrder(newValue,'followup_methods');
			}
		});


		//change note counter
		if(checkNull(od_dt.quoteCount) != '' && checkNull(od_dt.quoteCount) != 0){
			$('#show_quote_note_counter').html(od_dt.quoteCount).show();
		}
		else{
			$('#show_quote_note_counter').hide();
		}
		//change note counter
		order_details.bindEditable();

		var delivery_methods = [{text:'',value:''}];
		var default_str = '';
		for(var j in od_dt.deliveryMethods){
			var d = od_dt.deliveryMethods[j];
			var id = j+'##'+d.value;
			var name = d.value;
			delivery_methods.push({
				text:name,
				value:id
			});
			
			if(od_dt.getOrderDetails.Order.delivery_method == j){
				default_str = id;
			}
		}

		if(od_dt.getPartnerCustomSettings.PartnerSetting.enable_delivery_method == 'n'){
			default_str = '';
			$('#delivery_methods').parent().parent().parent().parent().hide();
		}

		$('#tracking_num_a').editable({
			emptytext:od_td.Empty,
	       	value: checkNull(od_dt.getOrderDetails.Order.tracking_num),  
	       	mode:'inline',  
	       	send: 'never',
	       	type: 'text',
	       	inputclass: 'm-wrap',
	       	showbuttons:'right',
	        success: function(data, newValue) {
	        	order_details.updateOrder(newValue,'tracking_no');
	   		},
		});

		if(checkNull(default_str) != '') {
			var arr = default_str.split('##');
			var v = arr[0];
			var delMethod = od_dt.deliveryMethods[v];
			var internal_name = delMethod.internal_name;
			if(internal_name.toLowerCase() == 'email') {
				$('.deliv_addr,.deliv_note').hide();
			}else {
				$('.deliv_addr,.deliv_note').show();
			}
			if(od_dt.getPartnerCustomSettings.PartnerSetting.enable_delivery_note == 'n'){
				$('.deliv_note').hide();
			}

			if(delMethod.is_tracking){
				$('.tracking_no').show();
			}else{
				$('.tracking_no').hide();	
			}
		}
		else{
			$('.tracking_no').hide();
			//deliv_note	
			$('.deliv_addr').hide();
		}

		$("#delivery_methods").editable({
	       	value: default_str,  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:false,
	        send: 'never',
	        emptytext: od_td.None,
	        source:delivery_methods,
	        select2: {
	        	placeholder:od_td.Select,
				minimumResultsForSearch: -1,
				allowClear:true
			},
	        success: function(data, newValue) {
	        	order_details.updateOrder(newValue,'delivery_methods');
	        }
	    });

	     $('#location').editable({
			mode:'inline',  
			send:'never',
			value: {
				delivery_name: checkNull(od_dt.getOrderDetails.Order.delivery_name),
				delivery_address1: checkNull(od_dt.getOrderDetails.Order.delivery_address1),
				delivery_address2: checkNull(od_dt.getOrderDetails.Order.delivery_address2),
				delivery_zip: checkNull(od_dt.getOrderDetails.Order.delivery_zip),
				delivery_city: checkNull(od_dt.getOrderDetails.Order.delivery_city),
				delivery_country: checkNull(od_dt.getOrderDetails.Order.delivery_country),
				delivery_phone_code: checkNull(od_dt.getOrderDetails.Order.delivery_phone_code),
				delivery_phone: checkNull(od_dt.getOrderDetails.Order.delivery_phone), 		
			},
			sourceCountry:country_list,
			success:function(data,config){
				order_details.updateOrder(config,'location');
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
		if(od_dt.getPartnerCustomSettings.PartnerSetting.enable_delivery_note == 'n'){
				od_dt.getOrderDetails.Order.delivery_note = '';
				$('.deliv_note').hide();
			}
			

		$('#custom_delivery_note').editable({
	       	value: checkNull(od_dt.getOrderDetails.Order.delivery_note),  
	       	emptytext:od_td.Deliverynote,
	       	mode:'inline',  
	       	send: 'never',
	       	type: 'textarea',
	       	inputclass: '',
	       	showbuttons:'right',
	        success: function(data, config) {
	        	order_details.updateOrder(config,'custom_delivery_note');
	   		},

		});


	 
		var tr = '';
		var ischeck = 0;
		var tax_details = {};
		var anyonecheck = 0;
		var isanyonei = 0;
		var isanyoned = 0;

		for(var j in od_dt.getOrderDetails.OrderLine){
			var d = od_dt.getOrderDetails.OrderLine[j];

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
				var qty_er = '';
				if(od_dt.getPartnerCustomSettings.PartnerSetting.enable_inventory == 'y' && d.inventory_product == 'y' && (od_dt.getOrderDetails.Order.status == 5 || od_dt.getOrderDetails.Order.status == 6) && (parseInt(d.actual_inventory)	< parseInt(d.qty))){
					qty_er = 'qty_err';
				}
				tr += '<td class="'+qty_er+'">'+convertIntoLocalFormat(checkNull(d.qty))+'</td>';
				tr += '<td>'+checkNull(d.unit)+'</td>';
				tr += '<td style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.unit_price))+'</td>';
				tr += '<td style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.unit_price,0) * checkNull(d.qty,0))+'</td>';
				tr += '<td style="text-align:right" class="tax_hide"> '+checkNull(d.percentage,0)+' %</td>';
				tr += '<td style="text-align:right" class="tax_hide">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.tax))+'</td>';
				tr += '<td style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.discount))+'</td>';
				if(checkNull(d.discount) != 0 && checkNull(d.discount) != '' && isanyoned != 1){
					isanyoned = 1;
				}
				tr += '<td style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.gross_amount))+'</td>';

				if(checkNull(d.answers) != '' && d.answers.ignore != 1){
					ischeck == 1;
					tr += '<td><a class="btn mini blue-stripe" href="javascript:;" onclick="order_details.showCheck('+d.partner_list_id+','+d.id+')"><i class="icon-eye-open"></i> '+od_td.View+'</a></td>';
				}
				else{
					tr += '<td class="checklist_hide"></td>';
				}
			tr += '</tr>';

		}

			
		$('.net_amount').html(convertIntoLocalFormat(checkNull(od_dt.getOrderDetails.OrderSummary.net_amount)));
		$('.total_discount').html(convertIntoLocalFormat(checkNull(od_dt.getOrderDetails.OrderSummary.total_discount)));
		if(checkNull(od_dt.getOrderDetails.OrderSummary.total_discount) == '' || checkNull(od_dt.getOrderDetails.OrderSummary.total_discount) == 0){
			$('.total_discount').parent().hide();
		}

		$('.total_vat').html(convertIntoLocalFormat(checkNull(od_dt.getOrderDetails.OrderSummary.total_vat)));
		

		$('.total_roundoff').html(convertIntoLocalFormat(checkNull(od_dt.getOrderDetails.OrderSummary.round_off)));
		if(checkNull(od_dt.getOrderDetails.OrderSummary.round_off) == '' || checkNull(od_dt.getOrderDetails.OrderSummary.round_off) == 0){
			$('.total_roundoff').parent().hide();
		}

		$('.total_amount').html(convertIntoLocalFormat(checkNull(od_dt.getOrderDetails.OrderSummary.gross_amount)));
		
		$('.total').html(convertIntoLocalFormat(checkNull(od_dt.getOrderDetails.OrderSummary.net_amount,0) - checkNull(od_dt.getOrderDetails.OrderSummary.discount,0) ));

		$('#product_lines').html(tr);

		var taxhtml = `
			<table class="table table-striped table-hover" style="margin:0;">
				<thead>
					<th class="text-left">`+od_td.$vat_spec+`</th>
					<th class="text-right">`+od_td.Rate+`</th>
					<th class="text-right">`+od_td.Baseamount+`</th>
					<th class="text-right">`+od_td.MVA+`</th>
				</thead>
			`;
		for(var j in tax_details){
			taxhtml += '<tr>';
				taxhtml += '<td class="text-left">'+od_td.Outgoingvat+'</td>';
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

		if(ischeck == 0){
			$('.checklist_hide').hide();
		}

		if(isanyoned == 0){
			$('#sorting_product_line th:nth-child(9),#product_lines td:nth-child(9)').hide()
		}

		if(od_dt.getPartnerCustomSettings.PartnerSetting.vat_required != 'y'){
			$('.tax_hide').hide();
		}
		else{
			$('.tax_hide').show();
		}

		if(checkNull(od_dt.getOrderDetails.OrderSummary.total_vat) == '' || checkNull(od_dt.getOrderDetails.OrderSummary.total_vat) == 0){
			$('.total_vat').parent().hide();
		}

		$('.btn_quote_accepted').click(function(){
			order_details.updateOrderStatus('accpt')
		});

		$('.btn_quote_accepted').click(function(){
			order_details.updateOrderStatus('accpt')
		});

		$('.btn_quote_cancelled').click(function(){
			order_details.updateOrderStatus('cncl')
		});

		$('.btn_quote_cancelled').click(function(){
			order_details.updateOrderStatus('cncl')
		});
		$('#send_sms_followup').click(function(){
			order_details.sendSmsFollowUp();
		});

		$('#add_followup').click(function(){
			new_custom_popup2('600','popups','quote_notes',{from:'manual',status:od_dt.getOrderDetails.Order.status,quote_id:od_dt.getOrderDetails.Order.id});
		});
		
		$('.mark_as_accepted').click(function(){
			order_details.update_order_status();
		});

		order_details.handleActionLink(1);
	},
	bindEditable:function(){
		var getAllCountryList = od_dt.getAllCountryList;
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
					if(od_dt.getPartnerCustomSettings.PartnerSetting.show_customer_country == 'y'){

		            }
		            else{
		            	if(value.delivery_country == od_dt.partner_country){
		            		countryText = '';
		            	}
		            }
						if((value.delivery_country == od_dt.partner_country) && (od_dt.getPartnerCustomSettings.PartnerSetting.show_customer_country == 'n')){
							if(value.delivery_name == '' && value.delivery_zip == '' && value.delivery_city == ''){
								var html = od_td.Deliveryaddress;
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
								
									var html = od_td.Deliveryaddress;
								
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
				'<label class="e_delivery_address_label text-bold" style="margin-left: -136px;">'+od_td.Deliveryname+'</label>'+
				'<div class="editable-location"  style="margin-top: -23px;">'+
		        '<input type="text" class="input-inline delivery_name " autocomplete="off" name="delivery_name">' +
		        '</div>' +
		        '<label class="e_delivery_address_label text-bold" style="margin-left: -136px;">'+od_td.Deliveryaddress+'</label>'+
		        '<div class="editable-location" style="margin-top: -23px;">' +
		        '<label class="inline_delivery_address_label hide">'+od_td.Deliveryaddress+'</label>'+
		        '<label><input  type="text" class="input-inline delivery_address1 " autocomplete="off" name="delivery_address1"></label>' +
		        '</div>' +
		        '<div class="editable-location">' +
		        '<label><input  type="text" class="input-inline delivery_address2 " autocomplete="off" name="delivery_address2"></label>' +
		        '</div>';

				if(lang == 'nb'){
					tpl += '<label class="e_delivery_zip_label" style="margin-left: -138px;margin-top: 4px;">'+od_td.Zip+', '+od_td.City+'</label>';
				}
				else{ 
					tpl += '<label class="e_delivery_zip_label" style="margin-left: -84px;margin-top: 4px;">'+od_td.Zip+', '+od_td.City+'</label>';
				}
		        tpl += '<div class="editable-location" style="margin-top: -26px;">' +
		        '<label class="inline_delivery_zip_label hide">'+od_td.Zip+', '+od_td.City+'</label>'+
		        '<label><input type="text" class="input-inline delivery_zip" id="delivery_zip" autocomplete="off" name="delivery_zip" style="width:40px;"></label><label><input style="width:93px;"  type="text" class="input-inline delivery_city "  name="delivery_city" autocomplete="off" id="delivery_city"></label>' +
		        '</div>' +
		        '<div class="editable-location">' +
		        '<label><select name="delivery_country" id="customer_delivery_country" autocomplete="off" class="input-inline-maxi delivery_country"></select></label>' +
		        '</div>'+
		        '<label class="e_delivery_address_label" style="margin-left: -123px;">'+od_td.Deliveryphone+'</label>'+
		        '<div class="editable-location" style="margin-top: -23px;">' +
		        '<label class="inline_delivery_address_label hide">'+od_td.Deliveryphone+'</label>'+
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
		       		this.$input.inputmask(date_format_mask ,{autoUnmask: false});	
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
	showCustomer:function(customer_id=''){
		if(checkNull(customer_id) == ''){
			customer_id = od_dt.getOrderDetails.Order.customer_id;
		}
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
	updateOrder:function(data,frm){
		
		showProcessingImage('undefined');
		var tparams = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			order_id:od_dt.getOrderDetails.Order.id
		};
		if(frm == 'followup_methods'){
			var obj = {followupstatus:data};
			var total_params = Object.assign(tparams,obj);
		}
		else if(frm == 'delivery_methods'){
			var a = data.split('##');
			var obj = {delivery_method_id:a[0]};
			var total_params = Object.assign(tparams,obj);
		}
		else if(frm == 'custom_delivery_note'){
			var obj = {delivery_note:data};
			var total_params = Object.assign(tparams,obj);
		}
		else if(frm == 'tracking_no'){
			var obj = {tracking_num:data,doc_id:od_dt.getOrderDetails.Order.id,doc:'order'};
			var total_params = Object.assign(tparams,obj);
		}
		else if(frm == 'location'){
			var obj = data;
			var total_params = Object.assign(tparams,obj);
		}

		
		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		if(frm == 'followup_methods'){
			params['url'] = APISERVER+'/api/Orders/updateFollowupStatus.json';
		}
		else if(frm == 'delivery_methods'){
			params['url'] = APISERVER+'/api/Orders/updateOrderDeliveryMethod.json';
		}
		else if(frm == 'custom_delivery_note'){
			params['url'] = APISERVER+'/api/Orders/updateOrderDeliveryNote.json';
		}
		else if(frm == 'location'){
			params['url'] = APISERVER+'/api/Orders/updateOrderDeliveryAddress.json';
		}
		else if(frm == 'tracking_no'){
			params['url'] = APISERVER+'/api/Commons/updateTrackingNum.json';
		}

		
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){

				if(frm == 'followup_methods'){
					call_toastr('success',od_td.Success,complet_data.response.response.message.msg);
				}
				else if(frm == 'delivery_methods'){
					var default_str = data;
					if(checkNull(default_str) != '') {
						var arr = default_str.split('##');
						var v = arr[0];
						var delMethod = od_dt.deliveryMethods[v];
						var internal_name = delMethod.internal_name;
						if(internal_name.toLowerCase() == 'email') {
							$('.deliv_addr,.deliv_note').hide();
						}else {
							//deliv_note
							$('.deliv_addr').show();
						}
						if(od_dt.getOrderDetails.Order.delivery_note == 'n'){
							$('.deliv_note').hide();
						}
						if(delMethod.is_tracking){
							$('.tracking_no').show();
						}else{
							$('.tracking_no').hide();	
						}
					}
					else{
						$('.tracking_no').hide();
						$('.deliv_addr,.deliv_note').hide();
					}
					call_toastr('success',od_td.Success,complet_data.response.response.message);
				}
				else if(frm == 'tracking_no'){
					call_toastr('success',od_td.Success,complet_data.response.response.message.msg);
				}
				else{
					call_toastr('success',od_td.Success,complet_data.response.response.message);
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',od_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',od_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	updateOrderStatus:function(frm,status){
		showProcessingImage('undefined');

		getUserIP(function(ip){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				order_id:od_dt.getOrderDetails.Order.id,
				status:od_dt.getOrderDetails.Order.status,
				ip_address:ip,
			};
			if(frm == 'accpt'){
				total_params.status = 3;
			}
			else if(frm == 'cncl'){
				total_params.status = 7;
			}
			else{
				total_params.status = status;
			}
			var params = $.extend({}, doAjax_params_default);
			params['requestType'] = 'POST';
			params['url'] = APISERVER+'/api/Orders/updateOrderStatus.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					$('#order_status_modal').modal('hide');
					call_toastr('success',od_td.Success,complet_data.response.response.message.msg);
					od_dt.getOrderDetails.Order.status = complet_data.response.response.order_status;
					order_details.handleActionLink(2);				
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',od_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',od_td.alertmessage);
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
			passRequest(base_url+'order/history_list/'+od_dt.getOrderDetails.Order.id,'','undefined');
		}
		else if(frm == 'history_listn'){
			new_custom_tabs2('order_history','order_history_tab_content',{order_id:od_dt.getOrderDetails.Order.id,});
		}
		else if(frm == 'followup_entries'){
			new_custom_tabs2('order_followupentries','order_history_tab_content',{order_id:od_dt.getOrderDetails.Order.id,status:od_dt.getOrderDetails.Order.status});
			//passRequest(base_url+'quotes/followup_entries/'+od_dt.getOrderDetails.Order.id+'/'+od_dt.getOrderDetails.Order.status,'','undefined');
		}
		else if(frm == 'note'){
			new_custom_tabs2('order_note','order_history_tab_content',{order_id:od_dt.getOrderDetails.Order.id,});
		}
		else if(frm == 'tasks'){
			passRequest(base_url+'task/orders_task_list/'+od_dt.getOrderDetails.Order.id,'','undefined');
		}
		else if(frm == 'tasksn'){
			new_custom_tabs2('order_tasks','order_history_tab_content',{order_id:od_dt.getOrderDetails.Order.id,order_number:od_dt.getOrderDetails.Order.order_number});
		}
	},
	printPdf:function(order_id=''){
		if(checkNull(order_id) == ''){
			order_id = od_dt.getOrderDetails.Order.id;
		}
		if(checkNull(partner_dir) != ''){
			partner_dir = partner_dir + '/';
		}
		var link = base_url + partner_dir +'customer/order/ov';

		
		var print_method = '';

		var total_params = {
			token :token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			order_id:order_id,
			link:link,
			print_method:print_method
		};


		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Orders/generateCustomerOrderPdf.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var d = complet_data.response.response;


				if(checkNull(d.pdf) != ''){
					if(checkNull(d.pdf.pdf_file_name) != ''){
						//var di = 'orders/' + d.pdf.pdf_file_name;
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
					showAlertMessage(array,'error',od_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',od_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	generatePackingSlip:function(order_id=''){
		if(checkNull(order_id) == ''){
			order_id = od_dt.getOrderDetails.Order.id;
		}
		if(checkNull(partner_dir) != ''){
			partner_dir = partner_dir + '/';
		}
		var link = base_url + partner_dir +'customer/order/ov';

		
		var print_method = '';

		var total_params = {
			token :token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			order_id:order_id,
		};


		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Orders/generateCustomerOrderPackingSlip.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var d = complet_data.response.response;


				if(checkNull(d.pdf) != ''){
					if(checkNull(d.pdf.pdf_file_name) != ''){
						//var di = 'orders/' + d.pdf.pdf_file_name;
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
					showAlertMessage(array,'error',od_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',od_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	showTransferPopup:function(quote_id){
		var url = base_url + 'quotes/transfer?quote_id='+quote_id+'&request_from=order_details&from=new_quotes';
		var a = document.createElement('div');
		$(a).attr('data-url',url);
		$(a).attr('data-width','650px');
		show_modal(a,'popups1');
	},
	resend:function(){
		var quote_id = od_dt.getOrderDetails.Order.id;
		var quote_status =  od_dt.getOrderDetails.Order.status;
		var url = base_url + 'quotes/send_quote_to_customer/'+quote_id+'/'+quote_status+'?from=new_quotes';

		var a = document.createElement('div');
		$(a).attr('data-url',url);
		$(a).attr('data-width','650px');
		show_modal(a,'popups');
	},
	duplicate:function(order_id=''){
		if(checkNull(order_id) == '' ){
			order_id = od_dt.getOrderDetails.Order.id;
		}
		passRequest(base_url + 'order/duplicate_order?from=new_order&order_id='+order_id,'undefined');
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
				quote_id:od_dt.getOrderDetails.Order.id,
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
						new_custom_tabs2('quote_history','quote_history_tab_content',{quote_id:od_dt.getOrderDetails.Order.id});
					}
					call_toastr('success',od_td.Success,complet_data.response.response.message.msg);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',od_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',od_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		});
	},
	update_order_status:function(){
		showProcessingImage('undefined');
		if(od_dt.getOrderDetails.Order.status == 2){
			getUserIP(function(ip){
				var total_params = {
					token:token,
					language:language,
					lang:lang,
					partner_id:partner_id,
					admin_id:admin_id,
					getTranslationsData:'yes',
					order_id:od_meta.order_id,	
					ip_address:ip,
					status:3,
				};
				var params = $.extend({}, doAjax_params_default);
				params['requestType'] = 'POST';
				params['url'] = APISERVER+'/api/Orders/updateOrderStatus.json';
				params['data'] = total_params;
				params['completeCallbackFunction'] = function (){
					hideProcessingImage();
				}

				params['successCallbackFunction'] = function (complet_data){
					if(complet_data.response.status == 'success'){
						call_toastr('success',od_td.Success,complet_data.response.response.message.msg);
						od_dt.getOrderDetails.Order.status = complet_data.response.response.order_status;
						order_details.handleActionLink();
					}
					else if(complet_data.response.status == 'error'){
						if(complet_data.response.response.error == 'validationErrors'){
							var mt_arr = complet_data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error',od_td.alertmessage);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',od_td.alertmessage);
							return;
						}	
					}
				}
				doAjax(params);
				return;
			});
		}
	},
	updateStatus:function(inv_message='',status = 7){
		od_dt.inv_message = inv_message;
		od_dt.getOrderDetails.Order.status = 7;
		order_details.handleActionLink();
	},
	handleActionLink:function(frm='2'){
		if(od_dt.getOrderDetails.Order.status == 2){
			$('.mark_as_accepted,.mark_as_accepted_divider').show();
		}
		else{
			$('.mark_as_accepted,.mark_as_accepted_divider').hide();
		}

		if(od_dt.getOrderDetails.Order.status == 2 || od_dt.getOrderDetails.Order.status == 5){
			$('.note').show();
			$('.note_followup').hide();
		}
		else{
			$('.note').hide();
			$('.note_followup').show();
		}

		if(od_dt.task_count == 1){
			$('.view_task').show();
			$('.view_task a').attr('data-id',od_dt.task_id);
		}
		else{
			$('.view_task').hide();
			$('.view_task a').attr('data-id');
		}

		var order_status = od_dt.getOrderDetails.Order.status;
		od_dt.orderStatusStr = order_statuses[order_status];

		od_dt.orderStatusInvMsg = '';
		if(checkNull(od_dt.inv_message) != ''){
			var inv_id = od_dt.inv_id;
			if(checkNull(inv_id) != ''){
				var pd = '';
				if(type == 'customer'){
					pd = '/'+partner_dir + '/';
				}
				else{
					pd = '/';
				}

				od_dt.orderStatusInvMsg = `. <a style="text-decoration:none"   onclick="new_custom_main_page2('`+pd + type+`/invoice/invoice_details/`+inv_id+`','invoices_list','invoices_list','invoice_details',{invoice_id:`+inv_id+`});" >` + od_dt.inv_message + `</a>`;
			}
			else{
				od_dt.orderStatusInvMsg ='. <a style="text-decoration:none">' + od_dt.inv_message + '</a>';
		
			}

			$('.create_task,.view_task,.order_status_l,.task_status_divider').hide();
		}
		else{
			$('.create_task,.view_task,.order_status_l,.task_status_divider').show();
		}

		if(frm == 1 || frm == 'task'){
			$('#btn_change_status').editable('setValue',order_status);
			$('#inv_msg').html(od_dt.orderStatusInvMsg);
			//$('li.order_status').html(od_dt.orderStatusStr);
		}
		else{
			$('#btn_change_status').editable('setValue',order_status);
			$('#inv_msg').html(od_dt.orderStatusInvMsg);
			//$('li.order_status').html(od_dt.orderStatusStr).hide().toggle( "highlight" );
		}

		

		if(od_dt.task_count == 0 && frm == 'task'){
			$('#tab_quote_1').hide();
			$('#tab_quote_11 a').trigger('click');
		}

		if(checkNull(order_status) != '' && checkNull(order_status) != ''){
			$('.print_pdf,.packing_slip').show();
		}
		else{
			$('.print_pdf,.packing_slip').hide();
		}

		if(checkNull(order_status) == '5' || checkNull(order_status) == '6'){
			$('#btn_change_order_status').show();
		}
		else{
			$('#btn_change_order_status').hide();
		}	

		if(checkNull(order_status) == '2' || checkNull(order_status) == '5'){
			$('.note_and_fllwp').show();
		}
		else{
			$('.note_and_fllwp').hide();
		}	

		if(checkNull(order_status) != 7){
			$('#btn_change_order').show();
		}
		else{
			$('#btn_change_order').hide();
		}	
	},
	showPopup:function(which){
		if(which == 'task'){
			var url = base_url + 'task/new_task/'+od_dt.getOrderDetails.Order.id+'/'+od_dt.getOrderDetails.Order.order_number+'?request_from=order_details';
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','700px');
			show_modal(a,'popups');
		}
		else if(which == 'viewtask'){
			var url = base_url + 'task/new_task/'+od_dt.task_id+'?request_from=order_details&from=new_order';
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','700px');
			show_modal(a,'popups');
		}
		else if(which == 'status'){
			order_details.showStatusPopup();
		}
		else if(which == 'resend'){
			new_custom_popup2('600','popups','resend_order',{order_id:od_dt.getOrderDetails.Order.id});
		
			// var url = base_url + 'order/send_order_to_customer/'+od_dt.getOrderDetails.Order.id+'/'+od_dt.getOrderDetails.Order.status+'/1/'+checkNull(od_dt.getOrderDetails.Order.customer_id)+'?from=new_order';
			// var a = document.createElement('div');
			// $(a).attr('data-url',url);
			// $(a).attr('data-width','700px');
			// show_modal(a,'popups');
		}
		else if(which == 'addnote'){
			new_custom_popup2('600','popups','order_addnote',{order_id:od_dt.getOrderDetails.Order.id,from:'add'});
		}
		else if(which == 'notefollowup'){
			new_custom_popup2('600','popups','order_notes',{order_id:od_dt.getOrderDetails.Order.id,from:'add'});
		}
	},
	showStatusPopup:function(){
		var modalhtml = '';
		modalhtml += '<div class="modal hide fade" id="order_status_modal" style="display:none;">';
			modalhtml += '<div class="modal-header">';
			    modalhtml += '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>';
			    modalhtml += '<h3>'+od_td.Changeorderstatus+'</h3>';
		 	modalhtml += '</div>';

		 	modalhtml += '<div class="modal-body">';
		    	modalhtml += '<div class="row-fluid">';
		       		modalhtml += '<div class="span12 form-horizontal form-view">';
		          		modalhtml += '<div class="portlet-body form">';
		             		modalhtml += '<form action="/" class="form-horizontal form-view" style="margin-bottom:0px;" id="news_message_form" method="post" accept-charset="utf-8">';
		                		modalhtml += '<div class="control-group">';
		                   			modalhtml += '<label class="control-label">'+od_td.Newstatus+'</label>';
			                      	modalhtml += '<div class="controls">';
			                        	modalhtml += '<select class="m-wrap span9" id="change_order_status">'
			                        		modalhtml += '<option></option>';
			                        		for(var j in od_dt.order_statuses){
			                        			modalhtml += '<option value="'+j+'">'+od_dt.order_statuses[j]+'</option>';
			                        		}
			                        	modalhtml += ';</select>';
			                      	modalhtml += '</div>';
			                	modalhtml += '</div>';
			             	modalhtml += '</form>';
			          	modalhtml += '</div>';
			       	modalhtml += '</div>';
			    modalhtml += '</div>';
			modalhtml += '</div>';

			modalhtml += '<div class="modal-footer">';
	    		modalhtml += '<div class="btn-group">';
	    			modalhtml += '<button class="btn green" id="btn_change" type="button">'+od_td.Change+' <i class="fal fa-arrow-circle-right" style="color:#fff"></i> </button>';
	    			modalhtml += '<button data-dismiss="modal" class="btn btn_clear" type="button"><i class="icon-remove"></i>';
	       				modalhtml += od_td.Cancel;
	    			modalhtml += '</button>';
	    		modalhtml += '</div>';
	 		modalhtml += '</div>';
		modalhtml += '</div>'; 
      	
      	$('#order_status_modal').remove();
      	$('body').append(modalhtml);
      	$('#change_order_status').select2({
      		placeholder:od_td.Select,
      		allowClear:true,
      	});
      	$('#order_status_modal').modal('show');
      	
      	$('#order_status_modal #btn_change').click(function(){
      		var status = $('#order_status_modal #change_order_status').val();
      		if(checkNull(status) == ''){
      			var finalerrmsg = od_td.Pleasecheckthefollowingfields+ ':<br/>' + od_td.Status;
				showAlertMessage(finalerrmsg,'error',od_td.alertmessage);
				return;
      		}
      		order_details.updateOrderStatus('',status);
      	});
	},
	delivandinv:function(){
		var delivinv = function(){
			getUserIP(function(ip){
				showProcessingImage('undefined');

				var total_params = {
					token:token,
					language:language,
					lang:lang,
					partner_id:partner_id,
					admin_id:admin_id,
					order_id:od_meta.order_id,
					requested_from:'delivered_invoice',
					status:7,
					ip:ip,
				};
				
				var params = $.extend({}, doAjax_params_default);
				params['requestType'] = 'POST';
				params['url'] = APISERVER+'/api/Orders/deliveredInvoice.json';
				params['data'] = total_params;
				params['completeCallbackFunction'] = function (){
					hideProcessingImage();
				}

				params['successCallbackFunction'] = function(complet_data){
					if(complet_data.response.status == 'success'){
						if(checkNull(complet_data.response.response.sales_id.stock_error) != ''){
							var sales_id = complet_data.response.response.sales_id.sales_id;
							call_toastr('success',od_td.Success,complet_data.response.response.sales_id.stock_error);
							new_custom_main_page2('/'+type+'/sales/details/'+id,'sales_lists','sales_lists','sales_details',{sales_id:sales_id});
						}
						else{
							var a = document.createElement('div');
							var sales_id = complet_data.response.response.sales_id.sales_id;
							var order_id = complet_data.response.response.order_id;
							// $(a).attr('data-url',base_url + 'sales/create_invoice/'+sales_id+'?from=neworderdetails&requested_from=delivered_invoice&orderId='+complet_data.response.response.order_id);
							// $(a).attr('data-width','800px');
							// show_modal(a,'popups');
							new_custom_popup2('800','popups','create_invoice',{sales_id:sales_id,from:'neworderdetails',requested_from:'delivered_invoice',order_id:order_id});
						}
					}
					else if(complet_data.response.status == 'error'){
						if(complet_data.response.response.error == 'validationErrors'){
							var mt_arr = complet_data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error',od_td.alertmessage);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',od_td.alertmessage);
							return;
						}	
					}
				}

				doAjax(params);
				return;
			});

		};
		if(od_dt.getOrderDetails.Order.total_tasks > 0){
			var yes = function(){
				delivinv();
			};
			var no = function(){};
			showDeleteMessage(od_td.$order_confm,od_td.Confirmation,yes,no,'ui-dialog-purple',od_td.Yes,od_td.No,'green');

		}
		else{
			delivinv();
		}
	},
	gotToModify:function(){
		new_custom_main_page2('/'+type+'/order/modify/'+od_meta.order_id,'orders_list','orders_list','order_modify',{order_id:od_meta.order_id});

	},

}