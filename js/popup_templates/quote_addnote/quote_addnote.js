var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();

var qna_meta;
var qna_dt;
var qna_ppid = 'popups';
var qna_td;

var quote_addnote = {
	start:function(popupid,metadata={}){
		qna_ppid = popupid;
		qna_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			quote_id:metadata.quote_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Please check the following fields','Alert message','alert message','Success','$nw_nt_or_fllu','Note','Add note','Edit note'],		
		};
		if(qna_meta.from == 'edit'){
			total_params.note_id = qna_meta.note_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/getQuoteNotesEdit.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				qna_dt = complet_data.response.response;
				qna_td = complet_data.response.response.translationsData;
				quote_addnote.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',qna_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qna_td.Alertmessage);
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

		qna_dt.date_format_f = date_format_f;

		qna_dt.qna_meta = qna_meta;
		qna_dt.quoteNote.description = checkNull(qna_dt.quoteNote.description);

		var template = document.getElementById('quote_addnote_template').innerHTML;
		var compiledRendered = Template7(template, qna_dt);
		document.getElementById(qna_ppid).innerHTML = compiledRendered;
		resizemodal(qna_ppid);
		quote_addnote.bindEvents();
	},
	bindEvents:function(){	
		$('#quote_addnote_save').click(function(){
			quote_addnote.saveData();
		});
	},
	saveData:function(){
		var description = $('#description').val();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			quote_id:qna_meta.quote_id,
			description:description,
			from:'new_quote'
		};


		if(qna_meta.from == 'edit'){
			total_params.note_id = qna_meta.note_id;
		}
		var params = $.extend({}, doAjax_params_default);
		if(qna_meta.from == 'edit'){
			params['url'] = APISERVER+'/api/Quotes/editQuoteNote.json';
		}
		else{
			params['url'] = APISERVER+'/api/Quotes/addQuoteNote.json';
		}
		
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				$('#'+qna_ppid).modal('hide');
				quote_note.generateRows(complet_data.response.response.notes);
				call_toastr('success',qnd_td.Success,complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',qna_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qna_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	}

}