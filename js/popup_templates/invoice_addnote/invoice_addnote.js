var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();

var ina_meta;
var ina_dt;
var ina_ppid = 'popups';
var ina_td;

var invoice_addnote = {
	start:function(popupid,metadata={}){
		ina_ppid = popupid;
		ina_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			invoice_id:metadata.invoice_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Please check the following fields','Alert message','alert message','Success','Note','Add note','Description'],		
		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Invoices/getInvoiceNote.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ina_dt = complet_data.response.response;
				ina_td = complet_data.response.response.translationsData;
				invoice_addnote.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ina_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ina_td.Alertmessage);
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

		ina_dt.date_format_f = date_format_f;

		ina_dt.ina_meta = ina_meta;


		var template = document.getElementById('invoice_addnote_template').innerHTML;
		var compiledRendered = Template7(template, ina_dt);
		document.getElementById(ina_ppid).innerHTML = compiledRendered;
		resizemodal(ina_ppid);
		invoice_addnote.bindEvents();
	},
	bindEvents:function(){	
		$('#invoice_addnote_save').click(function(){
			invoice_addnote.saveData();
		});
	},
	saveData:function(){
		var description = $('#description').val();
		if(checkNull(description) == ''){
			var msg = ina_td.Pleasecheckthefollowingfields + '<br/>' + ina_td.Note;
			showAlertMessage(msg,'error',ina_td.Alertmessage);
			return;
		}
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			note_base_id:ina_meta.invoice_id,
			note_type:'invoice',
			note_text:description,
			from:'newinvoice'
		};


		if(ina_meta.from == 'edit'){
			total_params.note_id = ina_meta.note_id;
		}
		var params = $.extend({}, doAjax_params_default);
		
		params['url'] = APISERVER+'/api/Notes/addNote.json';
		
		
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				$('#'+ina_ppid).modal('hide');
				call_toastr('success',ina_td.Success,complet_data.response.response.message.msg);
				id_dt.getNotesList = complet_data.response.response.getNotesList;
				invoice_details.showTab('notes');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ina_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ina_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	}
}