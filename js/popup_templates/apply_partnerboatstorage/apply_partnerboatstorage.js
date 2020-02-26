var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
	var date_format_f = date_format_partner.toLowerCase();
}
else{
	var date_format_f = date_format.toLowerCase();
}

var apb_popid  = 'popups';
var apb_td;
var apb_dt;
var apb_meta;

var apply_partnerboatstorage = {
	start: function(popups,meta = {}){
		apb_meta = meta;
		apb_popid  = popups;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_slip_id:apb_meta.customer_slip_id,
			customer_id:apb_meta.customer_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Name','Start time','Add boat event','Save','Cancel','Please check the following fields','Alert Message','Name','General','Notifications','End time','Yes','No','Type','Success','Boat events','Boat event','Start date and time','End date and time','Apply','Preferred','$dateoclock','$apply_event_success','No record found','Now','Out','Up','Is this action billable','Next','Haul out now','Place on water now','Alert message','alert message','Boat storage'],
		};
		if(meta.from == 'edit'){
			total_params['id'] = meta.data.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getCustomerBoatEvents.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				apb_dt = complet_data.response.response;
				apb_td = complet_data.response.response.translationsData;
				apply_partnerboatstorage.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',apb_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',apb_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('apply_partnerboatstorage_template').innerHTML;
		var compiledRendered = Template7(template, apb_dt);
		document.getElementById(apb_popid).innerHTML = compiledRendered;
		resizemodal(apb_popid );
		apply_partnerboatstorage.bindEvents();
	},
	bindEvents:function(){
		apply_partnerboatstorage.generateEventTable(apb_dt.schedule_events);
		$('#apply_partnerboatstorage_btn_save').click(function(){
			apply_partnerboatstorage.saveData();
		});

		$('#type_select').select2({

		}).change(function(){
			var v = $(this).val();
			if(v == 'up' || v == 'out'){
				$('.event_action').show();
				$('.now_action').hide();
				$('.now_action1').hide();

				if($('#apb_event_table tbody tr:not(.no_record_found)').length != 0){
					$('.hid-btn').show();
				}
				else{
					$('.hid-btn').hide();
				}
				
			}
			else{
				if(
					(apb_dt.slipDetails.CustomerSlip.boat_status == 'up' 
						&& 
						(
							checkNull(apb_dt.partnerSetting.boat_product_up,'') == '' ||
							checkNull(apb_dt.partnerSetting.boat_product_up,'') == 0
						)
					)
					||
					( apb_dt.slipDetails.CustomerSlip.boat_status == 'out' 
						&& 
						(
							checkNull(apb_dt.partnerSetting.boat_product_out,'') == '' ||
							checkNull(apb_dt.partnerSetting.boat_product_out,'') == 0
						))
					){
					$('#is_billable').bootstrapSwitch('setState',false);
					$('.event_action').hide();
				}
				else{
					$('#is_billable').bootstrapSwitch('setState',true);
					$('.event_action').hide();
					$('.now_action').show();
					$('.hid-btn').show();
				}
				
				// if(apb_dt.slipDetails.CustomerSlip.boat_status == 'up' && checkNull(apb_dt.partnerSetting.boat_product_out) != '' && checkNull(apb_dt.partnerSetting.boat_product_out) != 0){
				// 	$('.now_action').show();
				// 	$('.hid-btn').show();

				// }
				// else if(apb_dt.slipDetails.CustomerSlip.boat_status == 'out' && checkNull(apb_dt.partnerSetting.boat_product_down) != '' && checkNull(apb_dt.partnerSetting.boat_product_down) != 0){
				// 	$('.now_action').show();
				// 	$('.hid-btn').show();
				// }
				// else{
				// 	$('.hid-btn').hide();
				// }
				
			}
		});

		$('#is_billable').bootstrapSwitch();
		$('#is_billable').on('switch-change',function(e,d){

			if(d.value){
				$('#apply_partnerboatstorage_btn_create').show();
				$('#apply_partnerboatstorage_btn_savestatus').hide();
			}
			else{
				$('#apply_partnerboatstorage_btn_create').hide();
				$('#apply_partnerboatstorage_btn_savestatus').show();
			}
		});

		$('#apply_partnerboatstorage_btn_create').click(function(){
			var v = $('#type_select').val();
			var status = '';
			if(v == 'now_up'){
				status = 'up';
			}
			else if(v == 'now_out'){
				status = 'out';
			}
			apply_partnerboatstorage.createSales(status);
		});

		$('#apply_partnerboatstorage_btn_savestatus').click(function(){
			var v = $('#type_select').val();
			var status = '';
			if(v == 'now_up'){
				status = 'up';
			}
			else if(v == 'now_out'){
				status = 'out';
			}
			apply_partnerboatstorage.saveStatus(status);
		});
	},
	saveStatus:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,

			boat_status:checkNull(ci_meta.boat_status),

			customer_slip_id:apb_meta.customer_slip_id,
			customer_id:apb_meta.customer_id,
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
				$('#'+apb_popid).modal('hide');
				customer_details.showTabs('slips','tab_1_8');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ci_td.apb_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',apb_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	generateEventTable:function(data){

		var datas = [];
		var checkcount = 0;
		for(var j in data){

			var pbe = data[j].pbe;
			var cba	= data[j].cba;
			var trs = [];

			trs.push({v:pbe.name});

			var start_date = convertDateIntoSiteFormat(pbe.start_datetime);
			var start_time = moment(pbe.start_datetime).format('HH:mm');
			var startstr = apb_td.$dateoclock;
			startstr = startstr.replace('%date%',start_date).replace('%time%',start_time);
			trs.push({v:startstr});

			var end_date = convertDateIntoSiteFormat(pbe.end_datetime);
			var end_time = moment(pbe.end_datetime).format('HH:mm');
			var endstr = apb_td.$dateoclock;
			endstr = endstr.replace('%date%',end_date).replace('%time%',end_time);						
			trs.push({v:endstr});

			if(checkNull(cba.id) != ''){
				var event_checked = `<input checked="checked" class="uni event_checked" type="checkbox"  value="`+pbe.id+`"  data-primary-key="`+cba.id+`">`;
				checkcount++;
			}
			else{
				var event_checked = `<input type="checkbox" class="uni event_checked" value="`+pbe.id+`" data-primary-key="0">`;
			}
			
			trs.push({v:event_checked});
			if(checkNull(cba.preferred) != 0 && checkNull(cba.preferred) != ''){
				var event_radio = `<input name="preferred" class="event_preferred" type="radio" checked="checked" class="" value="`+pbe.id+`" >`;
			}
			else{
				var event_radio = `<input name="preferred" class="event_preferred" type="radio" class="" value="`+pbe.id+`" >`;
			}
			
			trs.push({v:event_radio,class:'preferred_td'});

			datas.push(trs);
		}

		
		var html = apply_partnerboatstorage.generateTr(datas);
		if(checkNull(html) == ''){
			html = '<tr class="no_record_found"><td colspan="4"><div style="text-align:center;" class="alert alert-error">'+apb_td.Norecordfound+'</div></td></tr>';
			
		}
		$('#apb_event_table tbody').append(html);
		if(checkcount > 1){
			$('.preferred_td').show();
		}
		$('.uni').uniform();
		$('.event_checked').change(function(){
			if($('.event_checked:checked').length > 1){
				$('.preferred_td').show();
			}
			else{
				$('.preferred_td').hide();
				$('.event_preferred').removeAttr('checked')
			}
		});
	},
	generateTr:function(data){
		var  html = '';
		for(var j in data){
			html += '<tr>';
			for(var k in data[j]){
				html += `<td class="`+checkNull(data[j][k]['class'])+`">`+data[j][k]['v']+`</td>`;
			}
			html += '</tr>';
			
		}
		return html;
	},
	saveData:function(){
	
		var event_checked = [];
		var ids = [];
		$('.event_checked:checked').each(function(){
			var v = $(this).val();
			var id = $(this).attr('data-primary-key');
			var preferred = 0;

			if(v == $('.event_preferred:checked').val()){
				preferred = 1;
			}

			ids.push(id);

			var obj = {
				id:id,
				admin_id:admin_id,
				partner_id:partner_id,
				partner_boatstore_event_id:v,
				customer_slip_id:apb_meta.customer_slip_id,
				preferred:preferred
			};
			event_checked.push(obj);
		});



		console.log(event_checked);

		var errormsg = '';

		if(errormsg != ''){
			var msg  = apb_td.Pleasecheckthefollowingfields +'<br/>' + errormsg;
			showAlertMessage(msg,'error',apb_td.AlertMessage);
			return;
		}

		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			event_checked:event_checked,
			customer_slip_id:apb_meta.customer_slip_id,
			ids:ids
		};		

		// if(apb_meta.from == 'edit'){
		// 	params['id'] = apb_meta.data.id;
		// }

		var total_params = {
			data:params,
			model:'CustomerBoatstoreApplications',
			action:'saveapplication',
			emitevent:'CustomerBoatstoreApplicationschange'
		};
		showProcessingImage('undefined');
		
		function CustomerBoatstoreApplicationschange(data){
			
			hideProcessingImage();
			if(data.error==null || data.error==undefined || data.error==''){
				
				customer_details.showTabs('slips','tab_1_8');
				call_toastr('success',apb_td.Success, apb_td[data.success.msg]);
				$('#'+apb_popid ).modal('hide');
			}
			else{
				showAlertMessage(apb_td[data.error.msg],'error',apb_td.AlertMessage);
				return;
			}
		}
		socket.once('CustomerBoatstoreApplicationschange',CustomerBoatstoreApplicationschange);
		socket.emit('crud', total_params);
	},
	createSales:function(status){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_slip_id:apb_meta.customer_slip_id,
			customer_id:apb_meta.customer_id,
			query_from:'custom'
		};
	
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Sales/saveBoatStorageSales.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				new_custom_popup2('800','popups2','create_invoice',{
						sales_id:complet_data.response.response.sales_id,
						'from':'boat_storage',
						customer_slip_id:checkNull(apb_meta.customer_slip_id),
						customer_id:checkNull(apb_meta.customer_id),
						pop_id:apb_popid,
						boat_status:status
					});
		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',apb_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',apb_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	}

};
