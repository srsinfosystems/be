var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var popupid = 'popups';

var global_edit_absence_meta_data;
var global_edit_absence_data;
var global_edit_absence_popupid = 'popups';

var edit_new_absence = {
	start:function(popupid,metadata={}){
		global_edit_absence_popupid = popupid;
		global_edit_absence_meta_data = metadata;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:metadata.id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Absence','Save','Cancel','Edit absence reason','Name','Penalty','Deduct hours','Please check the following fields','Alert Message','Absence reason edited successfully','Success','success','AlertMessage','Name already exists'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getEditAbsenceData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_edit_absence_data= complet_data.response.response;
				edit_new_absence.createHtml(complet_data.response.response);
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
	createHtml:function(){
		var template = document.getElementById('edit_new_absence_template').innerHTML;
		var compiledRendered = Template7(template, global_edit_absence_data);
		document.getElementById(global_edit_absence_popupid).innerHTML = compiledRendered;
		resizemodal(global_edit_absence_popupid);
		edit_new_absence.bindEvents();
	},
	bindEvents:function(){
		$('#edit_new_absence_form input[type=checkbox]').uniform();
		$('#edit_new_absence_save').click(function(){
			edit_new_absence.saveData();
		});
	},
	saveData:function(){
		var name = $('#edit_new_absence_form #name').val();
		var errmsg = '';
		if(name=='' || name==undefined || name==null){
			errmsg += global_edit_absence_data.translationsData.Name+'<br/>';
		}

		if(errmsg!=''){
			var finalerrmsg = global_edit_absence_data.translationsData.Pleasecheckthefollowingfields+ '<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_edit_absence_data.translationsData.AlertMessage);
			return;
		}
		var penalty = $('#edit_new_absence_form #penalty:checked').length;
		var deduct_hours = $('#edit_new_absence_form #deduct_hours:checked').length;
		var params = {
			id:global_edit_absence_data.PartnerAbsenceReason.id,
			admin_id:admin_id,
			partner_id:partner_id,
			penalty:penalty,
			deduct_hours:deduct_hours,
			name:name
		};
		
		var total_params = {
			data:params,
			model:'partnerAbsenceReasons',
			action:'update',
			emitevent:'partnerAbsenceReasonsEdit'
		};
		showProcessingImage('undefined');
		socket.emit('crud', total_params);
		socket.on('partnerAbsenceReasonsEdit',partnerAbsenceReasonsEditPopup);
		function partnerAbsenceReasonsEditPopup(data){
			hideProcessingImage();
			socket.off('partnerAbsenceReasonsEdit', partnerAbsenceReasonsEditPopup);
			if(data.error==null || data.error==undefined || data.error==''){
				call_toastr(global_edit_absence_data.translationsData.success,global_edit_absence_data.translationsData.Success, global_edit_absence_data.translationsData.Absencereasoneditedsuccessfully);
				$('#'+global_edit_absence_popupid).modal('hide');
			}
			else{
				showAlertMessage(global_edit_absence_data.translationsData[data.error.message],'error',global_edit_absence_data.translationsData.AlertMessage);
				return;
			}
		}
	}
}