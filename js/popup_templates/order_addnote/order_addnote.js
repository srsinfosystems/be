var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();

var ona_meta;
var ona_dt;
var ona_ppid = 'popups';
var ona_td;

var order_addnote = {
	start:function(popupid,metadata={}){
		ona_ppid = popupid;
		ona_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			order_id:metadata.order_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Please check the following fields','Alert message','alert message','Success','$nw_nt_or_fllu','Note','Add note','Edit note'],		
		};
		if(ona_meta.from == 'edit'){
			total_params.note_id = ona_meta.note_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Orders/getOrderNotesEdit.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ona_dt = complet_data.response.response;
				ona_td = complet_data.response.response.translationsData;
				order_addnote.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ona_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ona_td.Alertmessage);
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

		ona_dt.date_format_f = date_format_f;

		ona_dt.ona_meta = ona_meta;
		ona_dt.orderNote.description = checkNull(ona_dt.orderNote.description);

		var template = document.getElementById('order_addnote_template').innerHTML;
		var compiledRendered = Template7(template, ona_dt);
		document.getElementById(ona_ppid).innerHTML = compiledRendered;
		resizemodal(ona_ppid);
		order_addnote.bindEvents();
	},
	bindEvents:function(){	
		$('#order_addnote_save').click(function(){
			order_addnote.saveData();
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
			order_id:ona_meta.order_id,
			description:description,
			from:'new_order'
		};


		if(ona_meta.from == 'edit'){
			total_params.note_id = ona_meta.note_id;
		}
		var params = $.extend({}, doAjax_params_default);
		if(ona_meta.from == 'edit'){
			params['url'] = APISERVER+'/api/Orders/editOrderNote.json';
		}
		else{
			params['url'] = APISERVER+'/api/Orders/addOrderNote.json';
		}
		
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				$('#'+ona_ppid).modal('hide');
				if("order_note" in window && $('#tab_quote_2').hasClass('active')){
					order_note.generateRows(complet_data.response.response.notes);
				}
				else{
					$('#tab_quote_2 a').trigger('click');
				}
				call_toastr('success',ona_td.Success,complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ona_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ona_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	}

}