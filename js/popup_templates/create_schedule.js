var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var global_create_schedule_popupid = 'popups';
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();


var global_create_schedule_data;
var global_create_schedule_translationsData;
var create_schedule = {
	start: function(popups,metadata){
		global_create_schedule_popupid = popups;
		create_schedule.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:metadata.id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Create schedule','Save','Cancel','Schedules','Name','Start time','Duration','hours','Date','Select','Please check the following fields','error','Alert message','Schedule created successfully','success','Success'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getAllScheduleTemplates.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_create_schedule_data= complet_data.response.response;
				global_create_schedule_translationsData = complet_data.response.response.translationsData;
				create_schedule.createHtml();
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
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		global_create_schedule_data.date_format_f = date_format_f;
		var template = document.getElementById('create_schedule_template').innerHTML;
		var compiledRendered = Template7(template, global_create_schedule_data);
		document.getElementById(global_create_schedule_popupid).innerHTML = compiledRendered;
		resizemodal(global_create_schedule_popupid);
		create_schedule.bindEvents();
	},
	bindEvents:function(){
		$('#'+global_create_schedule_popupid).resize();
		$("#create_schedule_template_form #start_time").inputmask("99:99", {autoUnmask: true});
   		$("#create_schedule_template_form #hours").inputmask("numeric", {
			  min: 1,
			  max: 99
			}).css('text-align','left');

   		$('#create_schedule_template_form #date').datepicker({
   			format:global_create_schedule_data.date_format_f,
   			 startDate:moment().format()
   		}).change(function(){
   			$('.datepicker').remove();
   		});
   		
   		$("#create_schedule_template_form #partner_schedule_template_id").select2({
   			placeholder: global_create_schedule_translationsData.Select,
			allowClear: true
   		}).change(function(){

   			create_schedule.populateFields($('#partner_schedule_template_id').val());
   		});

   		$('#create_schedule_btn_save').click(function(){
   			create_schedule.saveData();
   		});

   		



	},
	saveData:function(){
		var partner_schedule_template_id = $("#create_schedule_template_form #partner_schedule_template_id").val();
		var errmsg = '';
		if(partner_schedule_template_id=='' || partner_schedule_template_id==undefined || partner_schedule_template_id==null){
			errmsg += global_create_schedule_translationsData.Schedules+'<br/>';
		}

		if(errmsg!=''){
			var finalerrmsg = global_create_schedule_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,global_create_schedule_translationsData.error,global_create_schedule_translationsData.AlertMessage);
			return;
		}
		var name = $("#create_schedule_template_form #name").val();
		if(name=='' || name==undefined || name==null){
			errmsg += global_create_schedule_translationsData.Name+'<br/>';
		}

   		var start_time = $("#create_schedule_template_form #start_time").val();
   		if(start_time=='' || start_time==undefined || start_time==null){
			errmsg += global_create_schedule_translationsData.Starttime+'<br/>';
		}


   		var hours = $("#create_schedule_template_form #hours").val();
   		if(hours=='' || hours==undefined || hours==null){
			errmsg += global_create_schedule_translationsData.hours+'<br/>';
		}

   		var date =  $("#create_schedule_template_form #date").data('datepicker').viewDate;
   		var da = $("#create_schedule_template_form #date").val();
   		if(da=='' || da==undefined || da==null){
			errmsg += global_create_schedule_translationsData.Date+'<br/>';
		}
		var st = start_time;
		st = st.toString().match(/.{1,2}/g);
		date = moment(date).format("YYYY-MM-DD")+' '+st[0]+':'+st[1]+':00';
		if(errmsg!=''){
			var finalerrmsg = global_create_schedule_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,global_create_schedule_translationsData.error,global_create_schedule_translationsData.AlertMessage);
			return;
		}

		var params = {
			admin_id:admin_id,
			partner_schedule_template_id:partner_schedule_template_id,
			partner_id:partner_id,
			name:name,
			start_time:start_time,
			hours:hours,
			date:date,

		};
		var total_params = {
			data:params,
			model:'partnerVoluntarySchedules',
			action:'scheduling',
			emitevent:'partnerVoluntarySchedulesCreates',
			emitthis:{partner_voluntary_schedule_id:0},
		};
		showProcessingImage('undefined');
		localStorage.setItem('createschedule','createschedule');
		socket.once('partnerVoluntarySchedulesCreates',function(data){
			
			if(data.error==null){
				hideProcessingImage();
				$('#'+global_create_schedule_popupid).modal('hide');
				call_toastr(global_create_schedule_translationsData.success, global_create_schedule_translationsData.Success,global_create_schedule_translationsData.Schedulecreatedsuccessfully);
			}
		});
		socket.emit('crud',total_params);
	},
	populateFields:function(res){
		if(res==''){
			$('.name_wrapper,.start_time_wrapper,.hours_wrapper,.date_wrapper').hide();
			return;
		}
		for(var j in global_create_schedule_data.PartnerScheduleTemplate){
			var a = global_create_schedule_data.PartnerScheduleTemplate[j].PartnerScheduleTemplate;
			
			if(res==a.id){
				$('#create_schedule_template_form #name').val(a.name);
				$('#create_schedule_template_form #start_time').val(a.start_time);
				$('#create_schedule_template_form #hours').val(a.hours);

				$('.name_wrapper,.start_time_wrapper,.hours_wrapper,.date_wrapper').show();
				break;
			}
		}
		console.log(global_create_schedule_popupid);
		$('#'+global_create_schedule_popupid).resize();
	},
	listenForData:function(){
	
	},
	generateTemplateList:function(data){
		console.log(data);
		var ret = '';
		ret += '<option value="'+data.id+'">';
			ret += data.name;
		ret += '</option>';
		return ret;
	},
	

};
Template7.registerHelper('createScheduleListHelper', function (data){
	return create_schedule.generateTemplateList(data);
});
