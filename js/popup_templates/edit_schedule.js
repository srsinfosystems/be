var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var global_edit_schedule_popupid = 'popups';
var global_edit_schedule_translationsData;
var global_edit_schedule_data;
var global_edit_schedule_emitdata = {};
var edit_schedule = {
	start: function(popups,metadata){
		console.log(metadata);
		global_edit_schedule_popupid = global_edit_schedule_popupid;
		global_edit_schedule_emitdata.event_id = metadata.event_id;
		global_edit_schedule_emitdata.date = metadata.date;
		global_edit_schedule_emitdata.className = metadata.className;
		
		edit_schedule.listenForData();
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:metadata.id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Name','Start time','Edit schedule','Duration','Active','Inactive','Status','Save','Cancel','Please check the following fields','Alert Message','Name already exists','General','Notifications','Add notification','Schedule','Action','Actions','No data found','Edit','Delete','Are you sure you would like to delete this template','Confirmation','Schedule edited successfully','success','Success','Notification deleted successfully','hours','Deleting this schedule will also remove all the participants','Are you sure you would like to proceed','Schedule deleted successfully','Planned work','Delete and send notifications to participants','but do not send notifications to participants','Close','Schedule cancelled successfully','Please select among the following options','Warning','day prior','hour prior','Distribution','Action cannot be carried out','Notification sent to count participants','Notification sent to count participant','Notification not sent','When','Participant list','Distribution','$send_to_voluntary_managers','Off','$upon_sched_resched','$the_day_before','$the_same_day','Select'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/editVoluntaryScheduleTemplate.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_edit_schedule_data= complet_data.response.response;
				global_edit_schedule_translationsData = complet_data.response.response.translationsData;

				edit_schedule.createHtml(complet_data.response.response);
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

		var template = document.getElementById('edit_schedule_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById(global_edit_schedule_popupid).innerHTML = compiledRendered;
		resizemodal(global_edit_schedule_popupid);
		edit_schedule.bindEvents(jsondata);
	},
	bindEvents:function(jsondata){
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		  var target = $(e.target).attr("href") // activated tab

		  if(target=='#tab_2_notification'){
		  		$('.modal-footer div').addClass('hide');
		  }
		  else if(target=='#tab_1_general'){
		  		$('.modal-footer div').removeClass('hide');
		  }
		});
		$('#'+global_edit_schedule_popupid).resize();

   		//$('#schedule_start_time').inputmask("(09|19|20|21|22|23):(09|19|29|39|49|59)",{ autoUnmask:true }); 
   		$("#schedule_start_time").inputmask("99:99", {autoUnmask: true});
   		$("#schedule_hours").inputmask("numeric", {
			  min: 1,
			  max: 99
			}).css('text-align','left');



		$('#edit_schedule_btn_save').click(function(){
			edit_schedule.saveData(jsondata);
		});

		global_edit_schedule_data.deletebtn = true;
		var today_date = moment(global_edit_schedule_data.todaydate);
		var ps_date = moment(global_edit_schedule_data.PartnerVoluntarySchedule.date);

		if(global_edit_schedule_data.PartnerVoluntarySchedule.status==1 || global_edit_schedule_data.PartnerVoluntarySchedule.status==2 || (  today_date.unix() > ps_date.unix() && global_edit_schedule_data.PartnerVoluntarySchedule.customer_count != 0)) {
			$('#add_new_schedule_template_form input,#edit_schedule_btn_save,#planned_work,#schedule_distribution').attr('disabled','disabled');
			
			$('.edit_schedule_dis').hide();
			$('.edit_schedule_diss').hide();
			global_edit_schedule_data.deletebtn = false;
		}
		if(global_edit_schedule_data.PartnerVoluntarySchedule.status==2){
			$('.edit_schedule_diss').show();
			global_edit_schedule_data.deletebtn = true;
		}

		$('#edit_schedule_btn_delete').click(function(){
			edit_schedule.deleteSchedule();
		});
		$(document).off('keyup');
		if(global_edit_schedule_data.deletebtn){
			$(document).keyup(function(e) { 
			    if(e.which==46){
			    	if(edit_schedule!=undefined && edit_schedule!=null && edit_schedule!=''){
			    		edit_schedule.deleteSchedule();
			    	}
			    }   
			})
		}
		edit_schedule.bindPopover();
		
		$('#schedule_distribution').select2({
			minimumResultsForSearch:-1
		}).change(function(){
			if($(this).val()=='1'){
				$('.when_event_wrapper').removeClass('hide');
			}
			else{
				$('.when_event_wrapper').addClass('hide');
				$('#add_new_schedule_template_form_2 #_schedule_when_event').val('').trigger('change');
			}
		}).trigger('change');

		$('#add_new_schedule_template_form_2 #_schedule_when_event').select2({
			placeholder:global_edit_schedule_translationsData.Select,
			allowClear:true,
			minimumResultsForSearch:-1
		});
	},
	deleteSchedule:function(){
		var twocallback = function(a){
			$(a).dialog( "close" );
			showProcessingImage('undefined');
			var params = {
				admin_id:admin_id,
				partner_id:partner_id,
				id:global_edit_schedule_data.PartnerVoluntarySchedule.id
			};
			var total_params = {
				data:params,
				model:'partnerVoluntarySchedules',
				action:'delete',
				emitevent:'partnerVoluntarySchedulesDeletePopup',
			};
			socket.once('partnerVoluntarySchedulesDeletePopup',partnerVoluntarySchedulesDeletePopup);
			function partnerVoluntarySchedulesDeletePopup(data){
				if(data.err==null){
					if(data.success!=null && data.success!='' && data.success!=undefined){
						$('#'+global_edit_schedule_popupid).modal('hide');
						call_toastr(global_edit_schedule_translationsData.success,global_edit_schedule_translationsData.Success, global_edit_schedule_translationsData.Scheduledeletedsuccessfully);
					}
				}
				hideProcessingImage();
			}
			socket.emit('crud', total_params);
		};

		var no = function(a){
			$(a).dialog( "close" );
		};

		var onecallback = function(a){
			$(a).dialog( "close" );
			showProcessingImage('undefined');
			var params = {
				admin_id:admin_id,
				partner_id:partner_id,
				id:global_edit_schedule_data.PartnerVoluntarySchedule.id
			};
			console.log('findparams');
			console.log(params);
			var total_params = {
				data:params,
				model:'partnerVoluntarySchedules',
				action:'findOne',
				emitevent:'partnerVoluntarySchedulesDeletePopup',
			};
			socket.once('partnerVoluntarySchedulesDeletePopup',partnerVoluntarySchedulesDeletePopup);
			function partnerVoluntarySchedulesDeletePopup(data){
				
				if(data.err==null){
					if(data.success!=null && data.success!='' && data.success!=undefined){
						var qparmas = '?partner_id='+partner_id;
						qparmas += '&admin_id='+admin_id;
						qparmas += '&schedule_id='+global_edit_schedule_data.PartnerVoluntarySchedule.id;
						qparmas += '&when_event=2';
						qparmas += '&del=y';

						var params = $.extend({}, doAjax_params_default);
						params['url'] = APISERVER+'/api/Voluntries/startProcessNotif.json'+qparmas;
						params['data'] = total_params;
						params['completeCallbackFunction'] = function (){
							
						};
						
						params['successCallbackFunction'] = function (complet_data){
						};

						doAjax(params);
						$('#'+global_edit_schedule_popupid).modal('hide');
						call_toastr(global_edit_schedule_translationsData.success,global_edit_schedule_translationsData.Success, global_edit_schedule_translationsData.Scheduledeletedsuccessfully);
					}
				}
				hideProcessingImage();
				socket.off('partnerVoluntarySchedulesDeletePopup',partnerVoluntarySchedulesDeletePopup);
			}
			socket.emit('crud', total_params);
		}

		var threecallback = function(a){
			$(a).dialog( "close" );
			showProcessingImage('undefined');
			var params = {
				schedule_id:global_edit_schedule_data.PartnerVoluntarySchedule.id,
				partner_id:partner_id,
				admin_id:admin_id,
				status:2,
				skiphooks:true,
			}
			var total_params = {
				data:params,
				partner_id:partner_id,
				model:'partnerVoluntaryAllocations',
				action:'updateschedulestatus',
				emitevent:'partnerVoluntarySchedulesCancel'
			};

			socket.once('partnerVoluntarySchedulesCancel',partnerVoluntarySchedulesCancel);
			function partnerVoluntarySchedulesCancel(data){
				if(data.err==null){
					if(data.success!=null && data.success!='' && data.success!=undefined){
						$('#'+global_edit_schedule_popupid).modal('hide');
						call_toastr(global_edit_schedule_translationsData.success,global_edit_schedule_translationsData.Success, global_edit_schedule_translationsData.Schedulecancelledsuccessfully);
					}
				}
				hideProcessingImage();
				socket.off('partnerVoluntarySchedulesCancel',partnerVoluntarySchedulesCancel);
			}
			socket.emit('crud', total_params);
		}

		var all = function(that,frm){
			if($(frm.target).hasClass('four')){
				no(that);
			}
			else if($(frm.target).hasClass('one')){
				onecallback(that);
			}
			else if($(frm.target).hasClass('two')){
				twocallback(that);
			}
			else if($(frm.target).hasClass('three')){
				threecallback(that);
			}
	
		}
		if(global_edit_schedule_data.PartnerVoluntarySchedule.customer_count > 0){
			var one = global_edit_schedule_translationsData.Deleteandsendnotificationstoparticipants;
			var two =  global_edit_schedule_translationsData.Delete+', '+global_edit_schedule_translationsData.butdonotsendnotificationstoparticipants;
			var three = global_edit_schedule_translationsData.Cancel;
			var def = global_edit_schedule_translationsData.Close;
			
			if(global_edit_schedule_data.PartnerVoluntarySchedule.status!=2){
				//{callback:threecallback,text:three,cssc:'blue three btnclr'},
				var opts = [
					{callback:onecallback,text:one,cssc:'red one btnclr'},
					{callback:twocallback,text:two,cssc:'red two btnclr'},
					
					{callback:no,text:def,cssc:'four btnclr',},
				];
			}
			else{
				var opts = [
					{callback:onecallback,text:one,cssc:'red one'},
					{callback:twocallback,text:two,cssc:'red two'},
					{callback:no,text:def,cssc:'four',},
			];
			}
			var msg = global_edit_schedule_translationsData.Deletingthisschedulewillalsoremovealltheparticipants+'. ';
			console.log(global_edit_schedule_translationsData);
			msg += global_edit_schedule_translationsData.Pleaseselectamongthefollowingoptions+':';
			
			showDeleteMessageDrop(msg,global_edit_schedule_translationsData.Warning,'ui-dialog-red',global_edit_schedule_translationsData.Delete,global_edit_schedule_translationsData.Cancel,opts,all);
		}
		else{
			twocallback();
		}

		
	},
	saveData:function(jsondata){
		var translationsData =  jsondata.translationsData;
		var name = $('#schedule_name').val();
		var planned_work = $('#planned_work').val();
		var start_time = $('#schedule_start_time').val();
		var distribution = $('#schedule_distribution').val();
		var when_event = $('#add_new_schedule_template_form_2 #_schedule_when_event').val();
		if(start_time!='' && start_time!=undefined && start_time!=null){
			var start_time_valid = moment(start_time, "HHmm", true).isValid();
		}
		var hours = $('#schedule_hours').val();

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
		if(distribution==1 && checkNull(when_event)==''){
				errmsg += translationsData.When+'<br/>';
		}
		if(errmsg!=''){
			var finalerrmsg = translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',translationsData.AlertMessage);
			return;
		}
	
		var dd = global_edit_schedule_emitdata.date.split(' ');
		var a = start_time.toString().match(/.{1,2}/g);
		var d = dd[0] + ' '+a[0]+':'+a[1]+':00';
		
		var when_day = 0;
		if(when_event==6){
			when_day = 0;
		}
		else if(when_event==7){
			when_day = 1;
		}
		else if(when_event==8){
			when_day = 2;
		}
		
		var params = {
			id:jsondata.PartnerVoluntarySchedule.id,
			admin_id:admin_id,
			partner_id:partner_id,
			name:name,
			start_time:start_time,
			date:d,
			emithis:global_edit_schedule_emitdata,
			hours:hours,
			planned_work:planned_work,
			distribution:distribution,
			when_event:when_event,
			when_day:when_day
		};
		
		var total_params = {
			data:params,
			model:'partnerVoluntarySchedules',
			action:'update',
			emitevent:'partnerVoluntarySchedulesEditMeta'
		};

		socket.emit('crud', total_params);

		socket.on('partnerVoluntarySchedulesEditMeta',partnerVoluntarySchedulesEditMeta);
		function partnerVoluntarySchedulesEditMeta(data){
			socket.off('partnerVoluntarySchedulesEditMeta', partnerVoluntarySchedulesEditMeta);
			if(data.error==null || data.error==undefined || data.error==''){
				console.log(global_edit_schedule_popupid);
				$('#'+global_edit_schedule_popupid).modal('hide');
				call_toastr(global_edit_schedule_translationsData.success,global_edit_schedule_translationsData.Success, global_edit_schedule_translationsData.Scheduleeditedsuccessfully);
			}
			else{
				showAlertMessage(global_edit_schedule_translationsData[data.error.message],'error',global_edit_schedule_translationsData.AlertMessage);
				return;
			}
			
		}
	},
	generateNotificationTable:function(data){
		var schedule='';
		if(data.when_event!=1 && data.when_event!=2 && data.when_event!=3 && data.when_event!=6){
			var schedule = data.when_day+' '+edit_schedule.getNotificationName(data.when_event,data.when_day);
		}
		else{
			var schedule = edit_schedule.getNotificationName(data.when_event,data.when_day);
		}
		var ret = '<tr id="notification_template_tr_'+data.id+'">';
			
			ret += '<td>'+schedule+'</td>';
			ret += '<td>';
				console.log(data);
				var msg = '';
				if(data.email==0){
					ret += '<span class="popover_custom" data-content="'+global_edit_schedule_translationsData.Actioncannotbecarriedout+'"><i class="icon-envelope icon_sp icon_sp_gray"></i></span>';
				}
				else{
					if(data.email_count==0){
						msg = global_edit_schedule_translationsData.Notificationnotsent;
						ret += '<span class="popover_custom" data-content="'+msg+'"><i class="icon-envelope icon_sp"></i></span>';
					}
					else if(data.email_count==1){
						msg = global_edit_schedule_translationsData.Notificationsenttocountparticipant;
						msg = msg.replace('count',data.email_count);
						ret += '<span class="popover_custom" data-content="'+msg+'"><i class="icon-envelope icon_sp icon_sp_green"></i></span>';
					}
					else{
						msg = global_edit_schedule_translationsData.Notificationsenttocountparticipants;
						msg = msg.replace('count',data.email_count);
						ret += '<span class="popover_custom" data-content="'+msg+'"><i class="icon-envelope icon_sp icon_sp_green"></i></span>';
					}

					
				}
				var msg = '';
				if(data.sms==0){
					ret += '<span class="popover_custom" data-content="'+global_edit_schedule_translationsData.Actioncannotbecarriedout+'"><i class="icon-comment icon_sp icon_sp_gray"></i></span>';
				}
				else{
					if(data.sms_count==0){
						msg = global_edit_schedule_translationsData.Notificationnotsent;
						ret += '<span class="popover_custom" data-content="'+msg+'"><i class="icon-comment icon_sp"></i></span>';
					}
					else if(data.sms_count==1){
						msg = global_edit_schedule_translationsData.Notificationsenttocountparticipant;
						msg = msg.replace('count',data.sms_count);
						ret += '<span class="popover_custom" data-content="'+msg+'"><i class="icon-comment icon_sp icon_sp_green"></i></span>';
					}
					else{
						msg = global_edit_schedule_translationsData.Notificationsenttocountparticipants;
						msg = msg.replace('count',data.sms_count);
						ret += '<span class="popover_custom" data-content="'+msg+'"><i class="icon-comment icon_sp icon_sp_green"></i></span>';
					}

					
				}
				


			ret +='</td>';
			ret += '<td>';
				ret +='<a class="btn mini blue-stripe edit_schedule_dis" onclick="edit_schedule.edit_popup('+data.id+')"><i class="icon-edit"></i>&nbsp;'+global_edit_schedule_translationsData.Edit+'</a>&nbsp;';
				ret +='<a class="btn mini red-stripe edit_schedule_dis" onclick="edit_schedule.delete('+data.id+')"><i class="icon-edit"></i>&nbsp;'+global_edit_schedule_translationsData.Delete+'</a>';
			ret +='</td>';
		ret += '</tr>';
		return ret;
	},
	show_popup:function(name){
		var metadata  = {id:global_edit_schedule_data.PartnerVoluntarySchedule.id};
		new_custom_popup(800,'popups1','add_notification',metadata);
	},
	edit_popup:function(id){
		var metadata  = {id:global_edit_schedule_data.PartnerVoluntarySchedule.id,notification_id:id};
		new_custom_popup(800,'popups1','edit_notification',metadata);
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
				model:'partnerVoluntaryNotifications',
				action:'delete',
				emitevent:'partnerVoluntaryNotificationsDelete'
			};

			socket.emit('crud', total_params);
			socket.on('partnerVoluntaryNotificationsDelete',partnerVoluntaryNotificationsDelete2);
			function partnerVoluntaryNotificationsDelete2(data){
				console.log(data);
				if(data.err==null){
					console.log(data);
					if(data.success!=null && data.success!='' && data.success!=undefined){
						var res = data.success;
						call_toastr(global_edit_schedule_translationsData.success,global_edit_schedule_translationsData.Success, global_edit_schedule_translationsData.Notificationdeletedsuccessfully);
						
					}
				}
				socket.off('partnerVoluntaryNotificationsDelete',partnerVoluntaryNotificationsDelete2);
			}
		}
		var no = function(){
			console.log('no');
		}
		showDeleteMessage(global_edit_schedule_translationsData.Areyousureyouwouldliketodeletethistemplate+'?',global_edit_schedule_translationsData.Confirmation,yes,no,'ui-dialog-blue',global_edit_schedule_translationsData.Delete,global_edit_schedule_translationsData.Cancel);
	},
	listenForData:function(){


		socket.off('partnerVoluntaryNotificationsNew');
		socket.on('partnerVoluntaryNotificationsNew',partnerVoluntaryNotificationsNew);
		function partnerVoluntaryNotificationsNew(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					console.log(res);
					var html = '';
					for(var k in res){
						html += edit_schedule.generateNotificationTable(res[k]);
					}
				
					$('#notification_tbody #notification_template_empty_tr').hide();
					$('#notification_tbody').html(html);
					edit_schedule.bindPopover();
				
				}
			}
			socket.off('partnerVoluntaryNotificationsNew',partnerVoluntaryNotificationsNew);
			socket.on('partnerVoluntaryNotificationsNew',partnerVoluntaryNotificationsNew);
		}

		socket.off('PartnerVoluntaryNotificationsEdit');
		socket.on('PartnerVoluntaryNotificationsEdit',PartnerVoluntaryNotificationsEdit);
		function PartnerVoluntaryNotificationsEdit(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
				
					var html = '';
					for(var k in res){
						html += edit_schedule.generateNotificationTable(res[k]);
					}
				
					$('#notification_tbody #notification_template_empty_tr').hide();
					
					$('#notification_tbody').html(html);
					edit_schedule.bindPopover();
				}
			}
		}
		
		socket.off('partnerVoluntaryNotificationsDelete');
		socket.on('partnerVoluntaryNotificationsDelete',partnerVoluntaryNotificationsDelete);
		function partnerVoluntaryNotificationsDelete(data){
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
			socket.off('partnerVoluntaryNotificationsDelete',partnerVoluntaryNotificationsDelete);
			socket.on('partnerVoluntaryNotificationsDelete',partnerVoluntaryNotificationsDelete);
		}


	},
	bindPopover:function(that){
		$('.popover_custom').mouseover(function(){
			$('.popovermy').remove();
			var a = $(this).position();
			var l = a.left - 92;
			var t = a.top ;
			var c = $(this).attr('data-content');

			var html = '<div class="popovermy popover fade top in" style="width:200px;top: '+t+'px; left: '+l+'px; display: block;position:absolute"><div class="arrow"></div><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content">'+c+'</div></div>';
			$(this).append(html);
			var a= $('.popovermy').height();
			$('.popovermy').css('top',(parseInt(t)-parseInt(a))+'px');
		});
		$('.popover_custom').mouseout(function(){
			$('.popovermy').remove();
		});
	},
	getNotificationName:function(id,when_day){
		for(var j in global_edit_schedule_data.notificationList){
			if(global_edit_schedule_data.notificationList[j].id==id){
				if(id==4 && when_day == 1){
					return global_edit_schedule_translationsData.dayprior;
				}
				else if(id==5 && when_day == 1){
					return global_edit_schedule_translationsData.hourprior;
				}
				else{
					return global_edit_schedule_data.notificationList[j].name;
				}
			}
		}
	}
	

};
Template7.registerHelper('notificationTableHelper', function (data){
	return edit_schedule.generateNotificationTable(data);
});
