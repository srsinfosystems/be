
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var popupid = 'popups';

var global_edit_exempt_meta_data;
var global_edit_exempt_data;
var global_edit_exempt_popupid = 'popups';

var edit_new_exempt = {
	start:function(popupid,metadata={}){
		global_edit_exempt_popupid = popupid;
		global_edit_exempt_meta_data = metadata;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			id:global_edit_exempt_meta_data.id,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Absence','Save','Cancel','Edit exempt reason','Name','Please check the following fields','Alert Message','Success','success','AlertMessage','Name already exists','Exempt reason edited successfully'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getEditExemptData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_edit_exempt_data= complet_data.response.response;
				edit_new_exempt.createHtml(complet_data.response.response);
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
		var template = document.getElementById('edit_new_exempt_template').innerHTML;
		var compiledRendered = Template7(template, global_edit_exempt_data);
		document.getElementById(global_edit_exempt_popupid).innerHTML = compiledRendered;
		resizemodal(global_edit_exempt_popupid);
		edit_new_exempt.bindEvents();
	},
	bindEvents:function(){

		$('#edit_new_exempt_save').click(function(){
			edit_new_exempt.saveData();
		});
	},
	saveData:function(){
		var name = $('#edit_new_exempt_form #name').val();
		var errmsg = '';
		if(name=='' || name==undefined || name==null){
			errmsg += global_edit_exempt_data.translationsData.Name+'<br/>';
		}

		if(errmsg!=''){
			var finalerrmsg = global_edit_exempt_data.translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_edit_exempt_data.translationsData.AlertMessage);
			return;
		}
		var params = {
			id:global_edit_exempt_meta_data.id,
			admin_id:admin_id,
			partner_id:partner_id,
			name:name
		};
		
		var total_params = {
			data:params,
			model:'partnerExemptReasons',
			action:'update',
			emitevent:'partnerExemptReasonsEdit'
		};
		showProcessingImage('undefined');
		socket.emit('crud', total_params);
		socket.on('partnerExemptReasonsEdit',partnerExemptReasonsEditFun);
		function partnerExemptReasonsEditFun(data){
			hideProcessingImage();
			socket.off('partnerExemptReasonsEdit', partnerExemptReasonsEditFun);
			if(data.error==null || data.error==undefined || data.error==''){
				call_toastr(global_edit_exempt_data.translationsData.success,global_edit_exempt_data.translationsData.Success, global_edit_exempt_data.translationsData.Exemptreasoneditedsuccessfully);
				$('#'+global_edit_exempt_popupid).modal('hide');
			}
			else{
				showAlertMessage(global_edit_exempt_data.translationsData[data.error.message],'error',global_edit_exempt_data.translationsData.AlertMessage);
				return;
			}
		}
	}
}