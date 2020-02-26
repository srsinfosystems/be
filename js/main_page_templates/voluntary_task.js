if(voluntary_task!=undefined){
	delete voluntary_task;
}
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var session_customer_id = $('#session_customer_id').val();
var global_voluntary_task_data;
var global_voluntary_translations_data;
var voluntary_task = {
	start:function(){
		voluntary_task.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:session_customer_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Tasks','Voluntary work','Date','Type','Start time','Duration','Status','Action','No upcoming task','No past task','hour','hours','Past voluntary work tasks','Your upcoming voluntary work tasks','Completed','Cancelled','Present','Your voluntary work tasks','Date and time','oaclock','Scheduled','Not present'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getPastUpcomingVoluntaryTask.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_voluntary_task_data = complet_data.response.response;
				global_voluntary_translations_data = complet_data.response.response.translationsData;
				voluntary_task.createHtml(complet_data.response.response);
		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_voluntary_translations_data.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_voluntary_translations_data.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		
		return;
	},
	listenForData:function(){

	},
	createHtml:function(){
		global_voluntary_translations_data.dashboardurl = base_url+'dashboard/index';
		global_voluntary_translations_data.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('voluntary_task_template').innerHTML;
		var compiledRendered = Template7(template, global_voluntary_task_data);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		voluntary_task.bindEvents();
	},
	bindEvents:function(){

	},
	generate_task:function(PartnerVoluntaryAllocation,PartnerVoluntarySchedule){
		var ret = '';
		if(PartnerVoluntarySchedule.status==0){
			ret += '<tr class="schedule_task" id="all_task_tr_'+PartnerVoluntarySchedule.id+'">';
		}
		else{
			ret += '<tr class="completed_task" id="all_task_tr_'+PartnerVoluntarySchedule.id+'">';
		}
		

			var st = PartnerVoluntarySchedule.start_time;
			st = st.toString().match(/.{1,2}/g);
			ret += '<td>';
				if(lang=='en'){
					ret += convertDateIntoSiteFormat(PartnerVoluntarySchedule.date)+' '+st[0]+':'+st[1]+' '+global_voluntary_translations_data.oaclock;
				}
				else{
					ret += convertDateIntoSiteFormat(PartnerVoluntarySchedule.date)+' '+global_voluntary_translations_data.oaclock+' '+ st[0]+':'+st[1];
				}
			ret += '</td>';

			ret += '<td>';
				ret += PartnerVoluntarySchedule.name;
			ret += '</td>';



			ret += '<td>';
				if(PartnerVoluntarySchedule.hours==1){
					ret += PartnerVoluntarySchedule.hours+' '+global_voluntary_translations_data.hour;
				}
				else{
					ret += PartnerVoluntarySchedule.hours+' '+global_voluntary_translations_data.hours;
				}
				
			ret += '</td>';
			
			
			ret += '<td>';
			
				if(PartnerVoluntarySchedule.status==0){
					ret += global_voluntary_translations_data.Scheduled;
				}
				else{
					if(PartnerVoluntaryAllocation.status==1){
					ret += global_voluntary_translations_data.Present;
				}
				else if(PartnerVoluntaryAllocation.status==2){
					if(PartnerVoluntaryAllocation.hours == 1){
							ret += global_voluntary_translations_data.Present+' '+ PartnerVoluntaryAllocation.hours+' '+global_voluntary_translations_data.hour;
						}
						else{
							ret += global_voluntary_translations_data.Present+' '+ PartnerVoluntaryAllocation.hours+' '+global_voluntary_translations_data.hours;
						}
					}
					else if(PartnerVoluntaryAllocation.status==3){
						var found = 0;
						for(var j in global_voluntary_task_data.PartnerAbsenceReason){
							var abr = global_voluntary_task_data.PartnerAbsenceReason[j].PartnerAbsenceReason;
							
							if(abr.id == PartnerVoluntaryAllocation.reason){
								ret += abr.name;
								found = 1;
								break;
							}
						}
						if(found==0){
							ret += global_voluntary_translations_data.Notpresent;
						}
					}
				}
				
			ret += '</td>';

			// ret += '<td>';
			// 	ret += 'Action';
			// ret += '</td>';


		ret += '</tr>';
		return ret;
	}
}


Template7.registerHelper('VoluntaryTaskHelper', function (PartnerVoluntaryAllocation,PartnerVoluntarySchedule){
	return voluntary_task.generate_task(PartnerVoluntaryAllocation,PartnerVoluntarySchedule);
});


