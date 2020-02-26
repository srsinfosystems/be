
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var staffer_id = $('#staffer_id').val();

var mr_meta;
var mr_dt;
var mr_popid = 'popups';
var mr_td;
var meter_reading = {
	start:function(popupid,metadata={}){
		mr_popid = popupid;
		mr_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_slipmeter_id:checkNull(mr_meta.customer_slipmeter_id),
			customer_id:checkNull(mr_meta.customer_id),
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Success','Meter reading','Last read value','Current meter value','$bill_usage','Yes','No','value','Entered value is lower than the previously registered value','Alert message','Usage','Send SMS notification to invoice contact','Next','Register','Entered value is greater than meter digits'],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/customers/getPartnerMeterReading.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				mr_dt = complet_data.response.response;
				mr_td = complet_data.response.response.translationsData;
				meter_reading.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',mr_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',mr_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){

		var last_read_value = 0;
		if(checkNull(mr_dt.getMeterLastReadValue.last_read_value) != ''){
			last_read_value = mr_dt.getMeterLastReadValue.last_read_value;
		}
		mr_dt['last_read_value'] = last_read_value;


		var template = document.getElementById('meter_reading_template').innerHTML;
		var compiledRendered = Template7(template, mr_dt);
		document.getElementById(mr_popid).innerHTML = compiledRendered;
		resizemodal(mr_popid);
		meter_reading.bindEvents();
	},
	bindEvents:function(){
		$('#SlipsMeterAction').select2();
		$('.uni').uniform();

		$('#SlipsMeterAction').change(function(){
			var action = $('#SlipsMeterAction').val();
			if(action == 'Usage'){
				$('#show_send_sms_notification').show();
				$('#meter_reading_register').hide();
				$('#meter_reading_invoice').show();
			}
			else {
				$('#show_send_sms_notification').hide();
				$('#meter_reading_register').show();
				$('#meter_reading_invoice').hide();
			}
		});

		$('#meter_reading_register').click(function(){
			meter_reading.adjustMeterReading();
		});

		$('#meter_reading_invoice').click(function(){
			meter_reading.saveandcreateinvoice();
		});
	},
	checkValue:function(){
		var v = $('#SlipsCurrentMeterValue').val();
		v = parseInt(v);
		if(checkNull(mr_dt.getMeterLastReadValue.meter_digits) == ''){
			if(checkNull(v) < parseInt(mr_dt['last_read_value'])){
				var msg = mr_td.Enteredvalueislowerthanthepreviouslyregisteredvalue;
				$('#SlipsCurrentMeterValue').focus();
				showAlertMessage(msg,'error',mr_td.Alertmessage);
				$('.threash').parent().parent().hide();
				return;
			}
			var diff = v -  mr_dt['last_read_value'] ;
		}
		else{
			if(parseInt(checkNull(v)) > parseInt(checkNull(mr_dt.getMeterLastReadValue.meter_digits)) ){
				var msg = mr_td.Enteredvalueisgreaterthanmeterdigits;
				showAlertMessage(msg,'error',mr_td.Alertmessage);
				$('.threash').parent().parent().hide();
				return;
			}

			var diff = 0;
			if(v < mr_dt['last_read_value'] ){
				diff = parseInt(checkNull(mr_dt.getMeterLastReadValue.meter_digits)) - parseInt(mr_dt['last_read_value']) + v ;

			}
			else{
				diff =  v -  mr_dt['last_read_value'] ;
			}
		}		

		var threash = mr_dt.partnerSetting.kwh_threashold;

		if(diff >= threash){
			$('#SlipsMeterAction').val('Usage').trigger('change');
		}
		else{
			$('#SlipsMeterAction').val('Adjustment').trigger('change');
		}

		$('.threash').html(diff + ' kWh');
		$('.threash').parent().parent().show();

		return {
			diff:diff,
			threash:threash
		};
	},
	saveandcreateinvoice:function(){
		var data = meter_reading.checkValue();
		if(!data){
			return false;
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_slipmeter_id:checkNull(mr_meta.customer_slipmeter_id),
			customer_id:checkNull(mr_meta.customer_id),
			meter_change_val:checkNull(data.diff),
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/sales/saveMarinaSales.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				var current_meter_value = parseInt(checkNull(mr_dt['last_read_value'],0)) + parseInt(checkNull(data.diff,0));
				new_custom_popup2('800','popups2','create_invoice',{sales_id:complet_data.response.response.sales_id,'from':'meter_reading',customer_slipmeter_id:checkNull(mr_meta.customer_slipmeter_id),customer_id:checkNull(mr_meta.customer_id),current_meter_value:current_meter_value,meter_action:'Usage',type:'slip',pop_id:mr_popid,request_from:mr_meta.request_from});
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',mr_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',mr_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	adjustMeterReading:function(){
		var data = meter_reading.checkValue();
		if(!data){
			return false;
		}

		var current_meter_value = parseInt(checkNull(mr_dt['last_read_value'],0)) + parseInt(checkNull(data.diff,0));

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,

			customer_id:checkNull(mr_meta.customer_id),
			customer_slipmeter_id:checkNull(mr_meta.customer_slipmeter_id),
			current_meter_value:checkNull(current_meter_value),
			staffer_id:staffer_id,
			type:checkNull('slip'),
			meter_action:checkNull('Adjustment'),
			invoice_sent:0,
		}
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/customers/editMeterFromCustomer.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				call_toastr('success',mr_td.Success,complet_data.response.response.message.msg);
				$('#'+mr_popid).modal('hide');

				if(mr_meta.request_from == 'customer'){
					customer_meters.append(complet_data.response.response.meterDetails,'all');
				}
				else if(mr_meta.request_from == 'marina_slips'){
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
					showAlertMessage(array,'error',Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',Alertmessage);
					return;
				}	
			}
		}
	
		showProcessingImage('undefined');
		doAjax(params);
		return;		
	},

}
