var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var popupid = 'popups';

var global_add_absence_meta_data;
var global_add_absence_data;
var global_add_absence_popupid = 'popups';

var add_new_absence = {
	start:function(popupid,metadata={}){
		global_add_absence_popupid = popupid;
		global_add_absence_meta_data = metadata;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Absence','Save','Cancel','Add absence reason','Name','Penalty','Deduct hours','Please check the following fields','Alert Message','Absence reason added successfully','Success','success','AlertMessage','Name already exists'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getScheduleTranslations.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_add_absence_data= complet_data.response.response;
				add_new_absence.createHtml(complet_data.response.response);
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
		var template = document.getElementById('add_new_absence_template').innerHTML;
		var compiledRendered = Template7(template, global_add_absence_data);
		document.getElementById(global_add_absence_popupid).innerHTML = compiledRendered;
		resizemodal(global_add_absence_popupid);
		add_new_absence.bindEvents();
	},
	bindEvents:function(){
		$('#add_new_absence_form input[type=checkbox]').uniform();
		$('#add_new_absence_save').click(function(){
			add_new_absence.saveData();
		});
	},
	saveData:function(){
		var name = $('#add_new_absence_form #name').val();
		var errmsg = '';
		if(name=='' || name==undefined || name==null){
			errmsg += global_add_absence_data.translationsData.Name+'<br/>';
		}

		if(errmsg!=''){
			var finalerrmsg = global_add_absence_data.translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_add_absence_data.translationsData.AlertMessage);
			return;
		}
		var params = {
			id:0,
			admin_id:admin_id,
			partner_id:partner_id,
			name:name
		};
		
		var total_params = {
			data:params,
			model:'partnerAbsenceReasons',
			action:'create',
			emitevent:'partnerAbsenceReasonsNew'
		};
		showProcessingImage('undefined');
		socket.emit('crud', total_params);
		socket.on('partnerAbsenceReasonsNew',partnerAbsenceReasonsNew);
		function partnerAbsenceReasonsNew(data){
			hideProcessingImage();
			socket.off('partnerAbsenceReasonsNew', partnerAbsenceReasonsNew);
			if(data.error==null || data.error==undefined || data.error==''){
				call_toastr(global_add_absence_data.translationsData.success,global_add_absence_data.translationsData.Success, global_add_absence_data.translationsData.Absencereasonaddedsuccessfully);
				$('#'+global_add_absence_popupid).modal('hide');
			}
			else{
				showAlertMessage(global_add_absence_data.translationsData[data.error.message],'error',global_add_absence_data.translationsData.AlertMessage);
				return;
			}
		}
	}
}