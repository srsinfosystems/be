var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var popupid = 'popups';
var global_add_translationsData;
var global_metadata ;
var add_new_notification_template = {
	start: function(popups,metadata){
		popupid = popups;
		global_metadata = metadata;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Add notification','Save','Cancel','Name','When','at','Action','SMS','Email','Placeholders','Add','Custom','Default','Template','Day','Please check following fields','Alert Message','Notification added successfully','success','Success','Email subject','Notification type already exists','Hours','Days'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getAddScheduleNotification.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_add_translationsData = complet_data.response.response.translationsData;
				add_new_notification_template.createHtml(complet_data.response.response);
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
		var template = document.getElementById('add_new_notification_template_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById(popupid).innerHTML = compiledRendered;
		resizemodal(popupid);
		add_new_notification_template.bindEvents(jsondata);
	},
	bindEvents:function(jsondata){
		$('#'+popupid).resize();
		$('#when_time').timepicker({
      		format: 'HH:mm',
			showMeridian:false,
			minuteStep:1,
			showInputs: false,
   		});
   		
		$('#action_sms,#action_email').uniform();
		$('#when_event').change(function(){
			var when_event_val = $('#when_event').val();
			if(when_event_val==1 || when_event_val==2 || when_event_val==3 || when_event_val==6){
				$('#when_event').parent().removeClass('span10').addClass('adjust_when span12');
				$('#when_day').parent().hide();	
			}
			else{
				$('#when_event').parent().removeClass('adjust_when span12').addClass('span10');
				$('#when_day').parent().show();
				if(when_event_val==4){
					$('#when_day').attr('placeholder',global_add_translationsData.Days);
				}
				else if(when_event_val==5){		
					$('#when_day').attr('placeholder',global_add_translationsData.Hours);			
				}
			}
			
			$("#when_day").inputmask({ 
				regex: "[0-9][0-9]" 
			});
			
			
		});
		$('#action_sms').change(function(){
			if($('#action_sms:checked').length==0){
				$('#action_sms_template_div').hide();
				$('#action_sms_content').hide();
			}
			else{
				$('#action_sms_template_div').show();
				$('#action_sms_template').trigger('change');
			}
			
		});
		$('#action_sms_template').change(function(){
			if($('#action_sms_template').val()!=1){
				$('#action_sms_content').hide();
			}
			else{
				if($('#action_sms:checked').length!=0){
					$('#action_sms_content').show();
				}
				else{
					$('#action_sms_content').hide();
				}
			}
		});

		$('#action_email').change(function(){
			if($('#action_email:checked').length==0){
				$('#action_email_template_div').hide();
				$('#action_email_content').hide();
			}
			else{
				$('#action_email_template_div').show();
				$('#action_email_template').trigger('change');
			}
			
		});

		$('#action_email_template').change(function(){
			if($('#action_email_template').val()!=1){
				$('#action_email_content').hide();
			}
			else{
				if($('#action_email:checked').length!=0){
					$('#action_email_content').show();
				}
				else{
					$('#action_email_content').hide();
				}
			}
		});
		$('#when_event,#action_email,#action_sms').trigger('change');
		$("#when_event,#action_sms_placeholder,#action_sms_template,#action_email_template").select2();

		$('#action_sms').trigger('change');
		$('#notification_btn_placeholder_add').click(function(){
			var val = $('#action_sms_placeholder').val();
			if(val!='' && val!=undefined && val!=null){
				$('#sms_body').append(val); 
			}			
		});

		$('#email_body').wysihtml5();
		var i =0;
		$('.wysihtml5-toolbar>li').each(function(){
			i++;
			if(i>3){
				$(this).find('a').append('&nbsp;')
			}
		});

		$('#btn_save_notification').click(function(){
			add_new_notification_template.saveData(jsondata);
		});
		
		$('.dropdown-toggle').dropdown();

	},
	generateList:function(id,name){
		var ret = '<option value="'+id+'">'+name+'</option>';
		return ret;
	},
	generatePlaceholdersList:function(category,name){
		var ret = '<optgroup label="'+category+'">';
			for(var j in name){
				ret += '<option value="'+name[j].placeholder+'">'+name[j].value+'</option>';
			}
		ret += '</optgroup>';
		return ret;
	},
	generatePlaceholdersEmailList:function(category,name){
		var ret = '<li><a class="cat-header">'+category+'</a></li>';
		for(var j in name){
				ret += '<li><a data-wysihtml5-command="insertHTML" data-wysihtml5-command-value="'+name[j].placeholder+'" tabindex="-1">'+name[j].value+'</a></li>';
			}
		return ret;
	},
	saveData:function(){
		var notification_subject = $('#notification_subject').val();
		if($('#when_day').val()==''){
			var when_day = "";
		}
		else{
			var when_day = parseInt($('#when_day').val());
		}
		var when_event = $('#when_event').val();
		

		var sms =  $('#action_sms:checked').length;
		var action_sms_template =  $('#action_sms_template').val();
		var sms_body =  $('#sms_body').val();

		var email =  $('#action_email:checked').length;
		var action_email_template =  $('#action_email_template').val();
		var email_body =  $('#email_body').val();

		var errmsg = '';
		if(email==1 && action_email_template==1){
			if(notification_subject==''){
				errmsg += global_add_translationsData.Emailsubject+'<br/>';
			}
		}
		if((when_event!=1 && when_event!=2 && when_event!=3 && when_event!=6) && when_day==''){
			errmsg += global_add_translationsData.Day+'<br/>';
		}
		if(errmsg!=''){ 
			var finalerrmsg = global_add_translationsData.Pleasecheckfollowingfields+ '<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_add_translationsData.AlertMessage);
			return;
		}
		var params = {
			id:0,
			admin_id:admin_id,
			partner_id:partner_id,
			partner_schedule_template_id:global_metadata.id,
			email_subject:notification_subject,
			when_day:when_day,
			when_event:when_event,
			sms:sms,
			sms_template:action_sms_template,
			sms_template_body:sms_body,
			email:email,
			email_template:action_email_template,
			email_template_body:email_body,

		};
		var total_params = {
			data:params,
			model:'partnerScheduleNotifications',
			action:'vcreate',
			emitevent:'partnerScheduleNotificationsNew'
		};
		showProcessingImage('undefined');
		socket.emit('crud', total_params);

		socket.on('partnerScheduleNotificationsNew',partnerScheduleNotificationsNew);
		function partnerScheduleNotificationsNew(data){
			hideProcessingImage();
			if(data.error==null || data.error==undefined || data.error==''){
				$('#'+popupid).modal('hide');
				
				call_toastr(global_add_translationsData.success,global_add_translationsData.Success, global_add_translationsData.Notificationaddedsuccessfully);
			}
			else{
				showAlertMessage(global_add_translationsData[data.error.message],'error',global_add_translationsData.AlertMessage);				
			}
			socket.off('partnerScheduleNotificationsNew',partnerScheduleNotificationsNew);
			
		}
	},
	generateTemplateList:function(id,name){

		var ret = '';
		
		ret += '<option value='+id+'>';
		
		ret += name;
		ret += '</option>';
		return ret;
	}
};
Template7.registerHelper('ListHelper', function (id=0,name=''){
	return add_new_notification_template.generateList(id,name);
});
Template7.registerHelper('placeholdersListHelper', function (category,name){
	return add_new_notification_template.generatePlaceholdersList(category,name);
});

Template7.registerHelper('placeholdersEmailListHelper', function (category,name){
	return add_new_notification_template.generatePlaceholdersEmailList(category,name);
});


Template7.registerHelper('templateListSmsHelper', function (id,name){

	return add_new_notification_template.generateTemplateList(id,name);
});

Template7.registerHelper('templateListEmailHelper', function (id,name){

	return add_new_notification_template.generateTemplateList(id,name);
});

