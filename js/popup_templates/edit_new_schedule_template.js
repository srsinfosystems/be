var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var edit_new_schedule_template_popupid = 'popups';
var global_edit_translationsData;
var global_edit_data;
var edit_new_schedule_template = {
	start: function(popups,metadata){
		edit_new_schedule_template_popupid = edit_new_schedule_template_popupid;
		edit_new_schedule_template.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:metadata.id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Name','Start time','Edit schedule template','Duration','Active','Inactive','Status','Save','Cancel','Please check the following fields','Alert Message','Name already exists','General','Notifications','Add notification','Schedule','Action','Actions','No data found','Edit','Delete','Are you sure you would like to delete this template','Confirmation','Schedule edited successfully','success','Success','Notification deleted successfully','hours','day prior','hour prior'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/editScheduleTemplate.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_edit_data= complet_data.response.response;
				global_edit_translationsData = complet_data.response.response.translationsData;
				edit_new_schedule_template.createHtml(complet_data.response.response);
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

		var template = document.getElementById('edit_new_schedule_template_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById(edit_new_schedule_template_popupid).innerHTML = compiledRendered;
		resizemodal(edit_new_schedule_template_popupid);
		edit_new_schedule_template.bindEvents(jsondata);
	},
	bindEvents:function(jsondata){
		$('#'+edit_new_schedule_template_popupid).resize();
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		  var target = $(e.target).attr("href") // activated tab
		 
		  if(target=='#tab_2_notification'){
		  		$('.modal-footer div').addClass('hide');
		  }
		  else if(target=='#tab_1_general'){
		  		$('.modal-footer div').removeClass('hide');
		  }
		});

   		//$('#schedule_start_time').inputmask("(09|19|20|21|22|23):(09|19|29|39|49|59)",{ autoUnmask:true }); 
   		$("#schedule_start_time").inputmask("99:99", {autoUnmask: true});
   		$("#schedule_hours").inputmask("numeric", {
			  min: 1,
			  max: 99
			}).css('text-align','left');

		$("#schedule_active").select2({
			minimumResultsForSearch:-1
		});

		$('#edit_new_schedule_btn_save').click(function(){
			edit_new_schedule_template.saveData(jsondata);
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
			id:jsondata.PartnerScheduleTemplates.id,
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
			action:'update',
			emitevent:'partnerScheduleTemplatesEdit'
		};
		showProcessingImage('undefined');
		socket.emit('crud', total_params);
		socket.on('partnerScheduleTemplatesEdit',partnerScheduleTemplatesEdit);
		function partnerScheduleTemplatesEdit(data){
			hideProcessingImage();
			socket.off('partnerScheduleTemplatesEdit', partnerScheduleTemplatesEdit);
			if(data.error==null || data.error==undefined || data.error==''){
				$('#'+edit_new_schedule_template_popupid).modal('hide');
				call_toastr(global_edit_translationsData.success,global_edit_translationsData.Success, global_edit_translationsData.Scheduleeditedsuccessfully);
			}
			else{
				showAlertMessage(global_edit_translationsData[data.error.message],'error',global_edit_translationsData.AlertMessage);
				return;
			}
			
		}
	},
	generateNotificationTable:function(data){
		var schedule='';
		if(data.when_event!=1 && data.when_event!=2 && data.when_event!=3 && data.when_event!=6){
			var schedule = data.when_day+' '+edit_new_schedule_template.getNotificationName(data.when_event,data.when_day);
		}
		else{
			var schedule = edit_new_schedule_template.getNotificationName(data.when_event,data.when_day);
		}
		var ret = '<tr id="notification_template_tr_'+data.id+'">';
			
			ret += '<td>'+schedule+'</td>';
			ret += '<td>';
				ret +='<a class="btn mini blue-stripe" onclick="edit_new_schedule_template.edit_popup('+data.id+')"><i class="icon-edit"></i>&nbsp;'+global_edit_translationsData.Edit+'</a>&nbsp;';
				ret +='<a class="btn mini red-stripe" onclick="edit_new_schedule_template.delete('+data.id+')"><i class="icon-edit"></i>&nbsp;'+global_edit_translationsData.Delete+'</a>';
			ret +='</td>';
		ret += '</tr>';
		return ret;
	},
	show_popup:function(name){
		var metadata  = {id:global_edit_data.PartnerScheduleTemplates.id};
		new_custom_popup(800,'popups1','add_new_notification_template',metadata);
	},
	edit_popup:function(id){
		var metadata  = {id:global_edit_data.PartnerScheduleTemplates.id,notification_id:id};
		new_custom_popup(800,'popups1','edit_new_notification_template',metadata);
	},
	delete:function(id){
		console.log('delete'+id);
		var yes = function(){
			console.log('yes');
			var params = {
				id:id,
				partner_id:partner_id,
			};
			var total_params = {
				data:params,
				model:'partnerScheduleNotifications',
				action:'delete',
				emitevent:'partnerScheduleNotificationsDelete'
			};

			socket.emit('crud', total_params);
			socket.on('partnerScheduleNotificationsDelete',partnerScheduleNotificationsDelete2);
			function partnerScheduleNotificationsDelete2(data){
				console.log(data);
				if(data.err==null){
					console.log(data);
					if(data.success!=null && data.success!='' && data.success!=undefined){
						var res = data.success;
						call_toastr(global_edit_translationsData.success,global_edit_translationsData.Success, global_edit_translationsData.Notificationdeletedsuccessfully);
						
					}
				}
				socket.off('partnerScheduleNotificationsDelete',partnerScheduleNotificationsDelete2);
			}
		}
		var no = function(){
			console.log('no');
		}
		showDeleteMessage(global_translationsData.Areyousureyouwouldliketodeletethistemplate+'?',global_translationsData.Confirmation,yes,no,'ui-dialog-blue',global_translationsData.Delete,global_translationsData.Cancel);
	},
	listenForData:function(){
		socket.off('partnerScheduleNotificationsNew');
		socket.on('partnerScheduleNotificationsNew',partnerScheduleNotificationsNew);
		function partnerScheduleNotificationsNew(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					console.log(res);
					
					var html = '';
					for(var k in res){
						html += edit_new_schedule_template.generateNotificationTable(res[k]);
					}

					$('#notification_tbody #notification_template_empty_tr').hide();
					$('#notification_tbody').html(html);
				}
			}
			socket.off('partnerScheduleNotificationsNew',partnerScheduleNotificationsNew);
			socket.on('partnerScheduleNotificationsNew',partnerScheduleNotificationsNew);
		}

		socket.off('partnerScheduleNotificationsEdit');
		socket.on('partnerScheduleNotificationsEdit',partnerScheduleNotificationsEdit);
		function partnerScheduleNotificationsEdit(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					console.log(res);
					var html = '';
					for(var k in res){
						html += edit_new_schedule_template.generateNotificationTable(res[k]);
					}
					$('#notification_tbody #notification_template_empty_tr').hide();
					$('#notification_tbody').html(html);
				}
			}
			socket.off('partnerScheduleNotificationsEdit',partnerScheduleNotificationsEdit);
			socket.on('partnerScheduleNotificationsEdit',partnerScheduleNotificationsEdit);
		}
		
		socket.off('partnerScheduleNotificationsDelete');
		socket.on('partnerScheduleNotificationsDelete',partnerScheduleNotificationsDelete);
		function partnerScheduleNotificationsDelete(data){
			console.log(data);
			if(data.err==null){
				console.log(data);
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					$('#voluntary_module_empty_tr').hide();
					$('#notification_tbody #notification_template_tr_'+res.id).remove();
					if($('#notification_tbody tr').length==1){
						$('#notification_template_empty_tr').show();
					}
				}
			}
			socket.off('partnerScheduleNotificationsDelete',partnerScheduleNotificationsDelete);
			socket.on('partnerScheduleNotificationsDelete',partnerScheduleNotificationsDelete);
		}
	},
	getNotificationName:function(id,when_day){
		console.log(global_edit_data.notificationList);
		for(var j in global_edit_data.notificationList){
			if(global_edit_data.notificationList[j].id==id){
				if(id==4 && when_day == 1){
					return global_edit_translationsData.dayprior;
				}
				else if(id==5 && when_day == 1){
					return global_edit_translationsData.hourprior;
				}
				else{
					return global_edit_data.notificationList[j].name;
				}
			}
		}
	}
	

};
Template7.registerHelper('notificationTableHelper', function (data){
	return edit_new_schedule_template.generateNotificationTable(data);
});
