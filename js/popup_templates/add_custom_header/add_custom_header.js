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
var ach_td;
var ach_dt;
var ach_meta;
var start_datetime;
var end_datetime;
var notif_list = {};

var add_custom_header = {
	start: function(popups,meta = {}){
		ach_meta = meta;
		popupid = popups;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Label','Value','Add header field','Save','Cancel','Please check the following fields','Alert Message','Edit header field','Success'],
		};
		if(meta.from == 'edit'){
			total_params['id'] = meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Sales/getSalesdocHeaderField.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ach_dt = complet_data.response.response;
				ach_td = complet_data.response.response.translationsData;
				add_custom_header.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(jsondata){
		jsondata['ach_meta'] = ach_meta;

		var template = document.getElementById('add_custom_header_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById(popupid).innerHTML = compiledRendered;
		resizemodal(popupid);
		add_custom_header.bindEvents(jsondata);
	},
	bindEvents:function(jsondata){
		$('#add_custom_header_btn_save').click(function(){
			add_custom_header.saveData();
		});

		if(ach_meta.from == 'edit'){
			$('#add_custom_header_form #label').val(checkNull(ach_dt.header_fields.CustomSalesdocHeader.label));
			$('#add_custom_header_form #value').val(checkNull(ach_dt.header_fields.CustomSalesdocHeader.value));
		}
	},
	saveData:function(jsondata){
		var label = $('#add_custom_header_form #label').val();
		var value = $('#add_custom_header_form #value').val();
		var id = '';
		if(ach_meta.from == 'edit'){
			id = ach_dt.header_fields.CustomSalesdocHeader.id;
		}


		var errormsg = '';
		if(checkNull(value) == ''){
			errormsg += ach_td.Value + '<br/>';
		}

		if(errormsg != ''){
			var msg  = ach_td.Pleasecheckthefollowingfields +'<br/>' + errormsg;
			showAlertMessage(msg,'error',ach_td.AlertMessage);
			return;
		}
		
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:id,
			label:label,
			value:value,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Sales/addSalesdocHeaderField.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				passRequest(base_url+'settings/communication_list/tab1');
				call_toastr('success', ach_td.Success,complet_data.response.response.message.msg);
				$('#'+popupid).modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
		
	},
};