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

var popupid = 'popups';
var asf_td;
var asf_dt;
var asf_meta;
var start_datetime;
var end_datetime;
var notif_list = {};

var add_sales_field = {
	start: function(popups,meta = {}){
		asf_meta = meta;
		popupid = popups;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:checkNull(asf_meta.id),
			getTranslationsData:'yes',
			getTranslationsDataArray:['Name','Save','Cancel','Please check the following fields','Alert Message','Name','Add sales document field','Edit sales document field','Field type','Customer fields','Contact person','Text field','Select','Label','Default value','alert message','Success','On','Off','Visibility','Value','Name and email','Name and phone number','Read only','Yes','No','Date'],
		};
		if(meta.from == 'edit'){
			total_params['id'] = meta.data.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/sales/getSalesFieldData.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){

				asf_dt = complet_data.response.response;
				asf_dt['asf_meta'] = asf_meta;
				asf_td = complet_data.response.response.translationsData;
				add_sales_field.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',asf_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',asf_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createHtml:function(jsondata){
		var template = document.getElementById('add_sales_field_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById(popupid).innerHTML = compiledRendered;
		resizemodal(popupid);
		add_sales_field.bindEvents(jsondata);
	},
	bindEvents:function(jsondata){
		$('#add_sales_field_form #type').select2();
		$('#add_sales_field_form #customer_custom_field_id').select2({
			placeholder:asf_td.Select,
			allowClear:true
		});
		$('#add_sales_field_form #display_value').select2();
		$('#add_sales_field_form .readonly').bootstrapSwitch();


		if(checkNull(asf_meta.id) != ''){
			$('#add_sales_field_form .opt_div').hide();

			if(checkNull(asf_dt.sales_field.CustomSalesdocField.display_value) != ''){
				$('#add_sales_field_form #display_value').val(asf_dt.sales_field.CustomSalesdocField.display_value).trigger('change');
			}

			var readonly = asf_dt.sales_field.CustomSalesdocField.readonly;
			
			readonly = (readonly == 1)?true:false;
			$('#add_sales_field_form .readonly').bootstrapSwitch('setState',readonly);

			if(asf_dt.sales_field.CustomSalesdocField.type == 'text'){
				$('#add_sales_field_form #type').val('text').trigger('change');

				$('#add_sales_field_form #label').val(asf_dt.sales_field.CustomSalesdocField.label);
				$('#add_sales_field_form #default_value').val(asf_dt.sales_field.CustomSalesdocField.default_value);

				$('#add_sales_field_form .text_opt').show();

			}
			else if(asf_dt.sales_field.CustomSalesdocField.type == 'date'){
				$('#add_sales_field_form #type').val('date').trigger('change');

				$('#add_sales_field_form #label').val(asf_dt.sales_field.CustomSalesdocField.label);
				$('#add_sales_field_form #default_value').val(asf_dt.sales_field.CustomSalesdocField.default_value);

				$('#add_sales_field_form .date_opt').show();
			}
			else if(asf_dt.sales_field.CustomSalesdocField.type == 'contact_person'){
				$('#add_sales_field_form #type').val('contact_person').trigger('change');

				$('#add_sales_field_form #label').val(asf_dt.sales_field.CustomSalesdocField.label);

				$('#add_sales_field_form .contact_person_opt').show();
			}
			else if(asf_dt.sales_field.CustomSalesdocField.type == 'customer_customfields'){
				$('#add_sales_field_form #type').val('customer_customfields').trigger('change');


				$('#add_sales_field_form #customer_custom_field_id').val(asf_dt.sales_field.CustomerCustomField.id).trigger('change');
				$('#add_sales_field_form .customer_customfields_opt').show();
			}
		}
		

		$('#add_sales_field_form #type').change(function(){
			var v = $('#add_sales_field_form #type').val();
			$('#add_sales_field_form .opt_div').hide();
			if(v == 'customer_customfields'){
				$('#add_sales_field_form .customer_customfields_opt').show();
			}
			else if(v == 'contact_person'){
				$('#add_sales_field_form .contact_person_opt').show();
			}
			else if(v == 'text'){
				$('#add_sales_field_form .text_opt').show();
			}
			else if(v == 'date'){
				$('#add_sales_field_form .date_opt').show();
			}

			
			$('#add_sales_field_form #default_value').off().val('');
			$('#add_sales_field_form #default_value').on('keyup',function(){
				if(checkNull($(this).val()) != ''){
					$('.readonly_opt').show();
				}
				else{
					$('.readonly_opt').hide();
				}
			}).trigger('keyup');

			$('#add_sales_field_form #customer_custom_field_id').val('').trigger('change');
			$('#add_sales_field_form #label').val('');
			$('#add_sales_field_form #default_value').val('');
	
			
		});

		$('#add_sales_field_form #default_value').on('keyup',function(){
			if(checkNull($(this).val()) != ''){
				$('.readonly_opt').show();
			}
			else{
				$('.readonly_opt').hide();
			}
		}).trigger('keyup');
		if(checkNull(asf_meta.id) == ''){
			$('#add_sales_field_form #type').trigger('change')
		}
		$('.sales_field_statusz').bootstrapSwitch();
		

	},
	save:function(jsondata){
		var type = $('#add_sales_field_form #type').val();
		
		var customer_custom_field_id = $('#add_sales_field_form #customer_custom_field_id').val();
		var label = $('#add_sales_field_form #label').val();
		var default_value = $('#add_sales_field_form #default_value').val();
		var display_value = $('#add_sales_field_form #display_value').val();
		var field_type = '';
		var errorMsg = '';
		if(type == 'customer_customfields'){
			if(checkNull(customer_custom_field_id) == ''){
				errorMsg += asf_td.Customerfields;
			}
			field_type = 'custom';
		}
		else if(type == 'contact_person'){
			if(checkNull(label) == ''){
				errorMsg += asf_td.Label;
			}
			field_type = 'select';
		}
		else if(type == 'text'){
			if(checkNull(label) == ''){
				errorMsg += asf_td.Label;
			}
			field_type = 'text';
		}
		else if(type == 'date'){
			if(checkNull(label) == ''){
				errorMsg += asf_td.Label;
			}
			field_type = 'date';
		}

		if(checkNull(errorMsg) != ''){
			var msg = asf_td.Pleasecheckthefollowingfields+'<br/>'+errorMsg;
			showAlertMessage(msg,'error',asf_td.alertmessage);
			return;
		}

		var status = $('#add_sales_field_form .sales_field_statusz').bootstrapSwitch('status');
		if(status){
			status = 1;
		}
		else{
			status = 0;
		}

		var readonly = $('#add_sales_field_form .readonly').bootstrapSwitch('status');
		if(readonly){
			readonly = 1;
		}
		else{
			readonly = 0;
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			type:type,
			customer_custom_field_id:customer_custom_field_id,
			label:label,
			default_value:default_value,
			field_type:field_type,
			status:status,
			display_value:display_value,
			readonly:readonly,		
			id:asf_meta.id,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/sales/addSalesdocField.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				sales_fields.appendField(complet_data.response.response.sales_field);
				$('#'+popupid).modal('hide');
				call_toastr('success',asf_td.Success,complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',asf_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',asf_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	}
};