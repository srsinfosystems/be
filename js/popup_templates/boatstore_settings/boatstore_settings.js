var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var base_url = $('#BASE_URL').val();
if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
	var date_format_f = date_format_partner.toLowerCase();
}
else{
	var date_format_f = date_format.toLowerCase();
}

var popupid = 'popups';
var bts_td;
var bts_dt;
var bts_meta;
var start_datetime;
var end_datetime;
var notifc_list_arr = [];
var notifc_list = {};

var boatstore_settings = {
	start: function(popups,meta = {}){
		bts_meta = meta;
		popupid = popups;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Name','Date','Start time','Add boat event','Save','Cancel','Please check the following fields','Alert Message','Name','General','Notifications','End time','Yes','No','Type','Success','$boat_event_success','$boat_name_exists','Delete','$del_store_event','Confirmation','$del_store_success','Edit boat event','On event schedule','On event change','On event cancel','On boat moved','Before 24 hours','$end_date_more','Out of water','Back on water','Yes','No','Invoice hauling boats out of the water','Invoice putting boats back on water','Invoice putting boats back on water','Select product','Boat Storage','Notifications sent to owner','When scheduling','When changes are made','When scheduled event is cancelled','When completed','$before_24_hrs','Select product for hauling boats out of water','Select product for putting boats on water','Alert message','Boat storage enabled successfully','Success'],

		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getBoatstoreSettings.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				bts_dt = complet_data.response.response;
				bts_td = complet_data.response.response.translationsData;
				boatstore_settings.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bts_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bts_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(jsondata){
		bts_dt['base_url'] = base_url;
	
		notifc_list_arr = [
			{key:'on_schedule',value:bts_td.Whenscheduling},
			{key:'on_change',value:bts_td.Whenchangesaremade},
			{key:'on_cancel',value:bts_td.Whenscheduledeventiscancelled},
			{key:'on_complete',value:bts_td.Whencompleted},
			{key:'before_24_hrs',value:bts_td.$before_24_hrs},
		];
		bts_dt['notifc_list_arr'] = notifc_list_arr;


		var template = document.getElementById('boatstore_settings_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById(popupid).innerHTML = compiledRendered;
		resizemodal(popupid);
		boatstore_settings.bindEvents(jsondata);
	},
	bindEvents:function(){
		$('#enable_boat_storage_up').bootstrapSwitch();
		$('#enable_boat_storage_up').on('switch-change',function(d,v){
			if(v.value){
				$('.sel_up_prod').show();
			}
			else{
				$('#boat_product_up_sett_id').val('');
				$('#boat_product_up_sett').val('');
				$('.rem_boat_prod_up_sett').hide();
				$('.sel_up_prod').hide();
			}
		});

		$('#enable_boat_storage_out').on('switch-change',function(d,v){
			if(v.value){
				$('.sel_out_prod').show();
			}
			else{
				$('#boat_product_out_sett_id').val('');
				$('#boat_product_out_sett').val('');
				$('.rem_boat_prod_out_sett').hide();
				$('.sel_out_prod').hide();
			}
		});

		$('#enable_boat_storage_out').bootstrapSwitch();

		if(checkNull(bts_dt.partnerSetting.boat_product_out) != ''){
			$('#boat_product_out_sett_id').val(bts_dt.partnerSetting.boat_product_out);
			$('.rem_boat_prod_out_sett').show();
			$('#boat_product_out_sett').val(checkNull(bts_dt.boat_product_out_name));
			$('#enable_boat_storage_out').bootstrapSwitch('setState',true);
		}
		else{
			$('.rem_boat_prod_out_sett').hide();
		}

		if(checkNull(bts_dt.partnerSetting.boat_product_up) != ''){
			$('#boat_product_up_sett_id').val(bts_dt.partnerSetting.boat_product_up);
			$('.rem_boat_prod_up_sett').show();
			$('#boat_product_up_sett').val(checkNull(bts_dt.boat_product_up_name));
			$('#enable_boat_storage_up').bootstrapSwitch('setState',true);
		}
		else{
			$('.rem_boat_prod_up_sett').hide();
		}

		$('.boat_not').bootstrapSwitch();
	},
	removeProdUp:function(){
		$('#boat_product_up_sett_id').val('');
		$('#boat_product_up_sett').val('');
		$('.rem_boat_prod_up_sett').hide();
	},
	removeProdOut:function(){
		$('#boat_product_out_sett_id').val('');
		$('#boat_product_out_sett').val('');
		$('.rem_boat_prod_out_sett').hide();
	},
	generateList:function(d){
		
		var check = '';
		var a = checkNull(bts_dt.partnerSetting.boat_notification_types).split(',');
		if($.inArray(d.key,a) != -1){
			check = `checked="checked"`;
		}

		var h = `
		<tr>
			<td>`+d.value+`</td>
			<td>
				
				<div class="switch switch-small boat_not" id="" data-on-label="`+bts_td.Yes+`" data-off-label="`+bts_td.No+`" data-val="`+d.key+`">
					<input value="`+d.key+`"  name="boat_not" `+check+` class="m-wrap span11 no-uni"  type="checkbox">
				</div>
			</td>
		</tr>`;

		return h;
	},
	saveData:function(){
		var boat_up = $('#enable_boat_storage_up').bootstrapSwitch('status');
		var boat_product_up = $('#boat_product_up_sett_id').val();

		var errmsg = '';
		if(boat_up && checkNull(boat_product_up) == ''){
			errmsg += bts_td.Selectproductforhaulingboatsoutofwater+'<br/>';
		}

		var boat_out = $('#enable_boat_storage_out').bootstrapSwitch('status');
		var boat_product_out = $('#boat_product_out_sett_id').val();

		if(boat_out && checkNull(boat_product_out) == ''){
			errmsg += bts_td.Selectproductforputtingboatsonwater+'<br/>';
		}

		if(errmsg != ''){
			showAlertMessage(errmsg,'error',bts_td.Alertmessage);
			return;
		}

		var boat_notification_types_arr = [];
		$('input[name="boat_not"]:checked').each(function(){
			boat_notification_types_arr.push($(this).val());
		});

		var boat_notification_types = boat_notification_types_arr.join(',');
			
		var psetting = {
			boat_product_up : boat_product_up,
			boat_product_out: boat_product_out,
			boat_notification_types:boat_notification_types,
			enable_boat_storage:'y',
		};

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			psetting:JSON.stringify(psetting),
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Partners/savePartnerSettingMultiple.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				$('li#boat_storage_setting').hide();
				$('li#boat_storage').show();
				call_toastr('success',bts_td.Success,bts_td.Boatstorageenabledsuccessfully);
				$('#'+popupid).modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bts_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bts_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
};

Template7.registerHelper('ListHelperA', function (data){
	return boatstore_settings.generateList(data);
});