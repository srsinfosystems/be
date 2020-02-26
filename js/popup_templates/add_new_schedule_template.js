var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var popupid = 'popups';
var global_add_translationsData;

var add_new_schedule_template = {
	start: function(popups){
		popupid = popups;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Name','Start time','Add schedule template','Duration','Active','Inactive','Status','Save','Cancel','Please check the following fields','Alert Message','Name already exists','General','Notifications','Add new notification','success','Success','Schedule added successfully','hours'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getScheduleTranslations.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_add_translationsData = complet_data.response.response.translationsData;
				add_new_schedule_template.createHtml(complet_data.response.response);
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
		var template = document.getElementById('add_new_schedule_template_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById(popupid).innerHTML = compiledRendered;
		resizemodal(popupid);
		add_new_schedule_template.bindEvents(jsondata);
	},
	bindEvents:function(jsondata){
		$('#'+popupid).resize();
		//$('#schedule_start_time').inputmask("(09|19|20|21|22|23):(09|19|29|39|49|59)",{ autoUnmask:true });
		$("#schedule_start_time").inputmask("99:99", {autoUnmask: true});
   		$("#schedule_hours").inputmask("numeric", {
			min: 1,
			max: 99
		}).css('text-align','left');
		$("#schedule_active").select2({
			minimumResultsForSearch:-1
		});
		$('#add_new_schedule_template_btn_save').click(function(){
			add_new_schedule_template.saveData(jsondata);
		});
	},
	saveData:function(jsondata){
		var translationsData =  jsondata.translationsData;
		var name = $('#schedule_name').val();
		var start_time = $('#schedule_start_time').val();
		if(start_time!='' && start_time!=undefined && start_time!=null){
			var start_time_valid = moment(start_time, "HHmm", true).isValid();
		}
		var hours = $('#schedule_hours').val();
		var status = $('#schedule_active').val();
		var errmsg = '';
		if(name=='' || name==undefined || name==null){
			errmsg += translationsData.Name+'<br/>';
		}
		if(start_time=='' || start_time==undefined || start_time==null || !start_time_valid){
			errmsg += translationsData.Starttime+'<br/>';
		}
		if(hours=='' || hours==undefined || hours==null){
			errmsg += translationsData.Duration+'<br/>';
		}
		if(status!=0 && status!=1){
			errmsg += translationsData.Status+'<br/>';
		}
		if(errmsg!=''){
			var finalerrmsg = translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',translationsData.AlertMessage);
			return;
		}
		
		var params = {
			id:0,
			admin_id:admin_id,
			partner_id:partner_id,
			name:name,
			start_time:start_time,
			hours:hours,
			status:status,

		};
		var total_params = {
			data:params,
			model:'partnerScheduleTemplates',
			action:'customSave',
			emitevent:'partnerScheduleTemplatesNew'
		};
		showProcessingImage('undefined');
		
		
		function partnerScheduleTemplatesNew(data){
			hideProcessingImage();
			socket.off('partnerScheduleTemplatesNew', partnerScheduleTemplatesNew);
			if(data.error==null || data.error==undefined || data.error==''){
				call_toastr(global_add_translationsData.success,global_add_translationsData.Success, global_add_translationsData.Scheduleaddedsuccessfully);
				$('#'+popupid).modal('hide');
			}
			else{
				showAlertMessage(global_add_translationsData[data.error.message],'error',global_add_translationsData.AlertMessage);
				return;
			}
		}
		socket.on('partnerScheduleTemplatesNew',partnerScheduleTemplatesNew);
		socket.emit('crud', total_params);
	},

};
