if(voluntary_date_scheduling!=undefined){
	delete tabfunc;
}

var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var global_voluntary_date_scheduling_data;

var voluntary_date_scheduling = {
	start:function(){
		voluntary_date_scheduling.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','Voluntary work','Date scheduling','Duration','hours','Start time','Notifications','Schedules','alert message','If you navigate away from this page','items in the scratchpad will be returned to the calendar on their original dates','Proceed','Cancel','Today','Scratchpad','You have items in the scratchpad','By navigating away from this page','those items will be returned to the calendar on their original dates','Warning'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getVoluntaryDateScheduling.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_voluntary_date_scheduling_data = complet_data.response.response;
				voluntary_date_scheduling.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_voluntary_date_scheduling_data.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_voluntary_date_scheduling_data.translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		global_voluntary_date_scheduling_data.translationsData.dashboardurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('voluntary_date_scheduling_template').innerHTML;
		var compiledRendered = Template7(template, global_voluntary_date_scheduling_data);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		voluntary_date_scheduling.bindEvents();
	},
	bindEvents:function(){
		$('#external-events .fc-event').each(function() {
			
			var st =  $.trim($(this).attr('data-start-time'));
			st = st.toString().match(/.{1,2}/g);
			$(this).data('event', {
				title: $.trim($(this).attr('data-name')), 
				partner_schedule_template_id: $.trim($(this).attr('data-partner-schedule-template-id')), 
				start_time: $.trim($(this).attr('data-start-time')),
				start: st[0]+':'+st[1],	
				hours: $.trim($(this).attr('data-hours')), 
				stick: true 
			});
			$(this).draggable({
				zIndex: 999,
				revert: true,     
				revertDuration: 0,
				scroll: false,
        		helper: 'clone',
        		start: function(event, ui) { 
        		 	$('.ui-draggable-dragging').css("width",$('#external-events .fc-event').width()+'px'); 
        		}
			});
		});

		if(global_voluntary_date_scheduling_data.getPartnerScheduleTemplates!=undefined && global_voluntary_date_scheduling_data.getPartnerScheduleTemplates!=null && global_voluntary_date_scheduling_data.getPartnerScheduleTemplates!=''){
			var templateData = global_voluntary_date_scheduling_data.getPartnerScheduleTemplates;
			var scheduleTemplateList = [];
			for(var j in templateData){
				var id = templateData[j].PartnerScheduleTemplate.id;
				var name = templateData[j].PartnerScheduleTemplate.name;
				scheduleTemplateList[id] = name;
			}
			
		}

		if(global_voluntary_date_scheduling_data.PartnerVoluntarySchedule!=undefined && global_voluntary_date_scheduling_data.PartnerVoluntarySchedule!=null && global_voluntary_date_scheduling_data.PartnerVoluntarySchedule!=''){
			var scheduleData = global_voluntary_date_scheduling_data.PartnerVoluntarySchedule;

			var dbevents = [];
			for(var j in scheduleData){
				var partner_schedule_template_id= scheduleData[j].PartnerVoluntarySchedule.partner_schedule_template_id;
				var st =   scheduleData[j].PartnerVoluntarySchedule.start_time;
				st = st.toString().match(/.{1,2}/g);
				var change_time = scheduleData[j].PartnerVoluntarySchedule.date.split(' ');
				change_time = change_time[0]+' '+st[0]+':'+st[1];
				var renderData = {
					partner_voluntary_schedule_id:scheduleData[j].PartnerVoluntarySchedule.id,
					title: scheduleData[j].PartnerVoluntarySchedule.name, 
					partner_schedule_template_id: partner_schedule_template_id, 
					start_time:st[0]+':'+st[1] , 
					start: change_time, 
					hours: scheduleData[j].PartnerVoluntarySchedule.hours, 
					stick: true,
					status:scheduleData[j].PartnerVoluntarySchedule.status,

				};

				var today_date = moment(global_voluntary_date_scheduling_data.todaydate);
				var ps_date = moment(scheduleData[j].PartnerVoluntarySchedule.date);

				if(scheduleData[j].PartnerVoluntarySchedule.status==1 || scheduleData[j].PartnerVoluntarySchedule.status==2 || ( ( today_date.unix() > ps_date.unix() && scheduleData[j].PartnerVoluntaryAllocation.length!=0)) ){
					renderData.className = 'completed_event';
					renderData.editable = false;
				}
				else if(scheduleData[j].PartnerVoluntaryAllocation.length==0){
					renderData.className = 'noalloc_event';
				}
				else if(scheduleData[j].PartnerVoluntaryAllocation.length!=0){
					renderData.className = 'alloc_event';
				}


				
				dbevents.push(renderData);
			}
		
		}
		var isEventOverDiv = function(x, y) {

            var external_events = $( '#calendar-box1' );
            var offset = external_events.offset();
            offset.right = external_events.width() + offset.left;
            offset.bottom = external_events.height() + offset.top;

            // Compare
            if (x >= offset.left
                && y >= offset.top
                && x <= offset.right
                && y <= offset .bottom) { return true; }
            return false;

        }
		$('#date_scheduling_calendar').fullCalendar({
			buttonText:{
				today: global_voluntary_date_scheduling_data.translationsData.Today ,
			},	
			header:{
               right: 'prev,next,today',
               center: 'title',
               left: ''
            },
            events:dbevents,
			lang:lang,
			editable: true,
     		droppable: true, 
     		dragRevertDuration: 0,
     		timeFormat: 'H(:mm)',
			drop: function(date, jsEvent, ui, resourceId) {	

			},
			eventConstraint:{
            	start: moment().format('YYYY-MM-DD'),
            	end: '2100-01-01'
        	},
			eventReceive: function(event) {
				if(event.partner_voluntary_schedule_id){
					$("#eventsol_scratchpad [data-partner-voluntary-schedule-id="+event.partner_voluntary_schedule_id+"]").remove();
				}
				if(event.start.isBefore(moment())) {
					return false;
				}
				else 
					if(event.partner_schedule_template_id!='' && event.partner_schedule_template_id!=null && event.partner_schedule_template_id!=undefined){
					voluntary_date_scheduling.saveSchedule(event,'dropped');
				}				
			},
			eventDrop: function(event) {	
				if(event.start.isBefore(moment())) {
					return false;
				}		
				else
				 if(event.partner_schedule_template_id!='' && event.partner_schedule_template_id!=null && event.partner_schedule_template_id!=undefined){
					voluntary_date_scheduling.saveSchedule(event,'moved');
				}
			},
			eventDragStop:function( events, jsEvent, ui, view){
				if(isEventOverDiv(jsEvent.clientX, jsEvent.clientY)) {
					//
				
					//$("#eventsol_scratchpad [data-partner-schedule-template-id="events.partner_voluntary_schedule_id"]").remove();

					var sttime = events.start_time.replace(':','');
					var event_line = '<li class="fc-event fc-event-custom" data-name="'+events.title+'" data-start-time="'+sttime+'" data-hours="'+events.hours+'" data-partner-schedule-template-id="'+events.partner_schedule_template_id+'" data-partner-voluntary-schedule-id="'+events.partner_voluntary_schedule_id+'">'+events.title+'</li>';

					$('#eventsol_scratchpad').append(event_line);
					$('#date_scheduling_calendar').fullCalendar('removeEvents', events._id);   
					$('#eventsol_scratchpad .fc-event').each(function() {

						var st =  $.trim($(this).attr('data-start-time'));
						st = st.toString().match(/.{1,2}/g);
						$(this).data('event', {
							title: $.trim($(this).attr('data-name')), 
							partner_schedule_template_id: $.trim($(this).attr('data-partner-schedule-template-id')), 
							partner_voluntary_schedule_id: $.trim($(this).attr('data-partner-voluntary-schedule-id')), 
							start_time: $.trim($(this).attr('data-start-time')),
							start: st[0]+':'+st[1],	
							hours: $.trim($(this).attr('data-hours')), 
							stick: true 
						});
						$(this).draggable({
							zIndex: 999,
							revert: true,     
							revertDuration: 0,
							scroll: false,
			        		helper: 'clone',
			        		appendTo: "body",
			        		start: function(event, ui) { 
			        		 	$('.ui-draggable-dragging').css("width",$('#external-events .fc-event').width()+'px'); 
			        		}
						});
					});
				 	//voluntary_date_scheduling.deleteSchedule(events);           
                }
			},
			eventRender: function(event, element) {		
			
				if(event.className.length==0){
					$(element).addClass('noalloc_event');
				}
				if(event.start.isBefore(moment())) {
					//return false;
				}
		    },
		    eventClick: function(calEvent, jsEvent, view) {
		    	voluntary_date_scheduling.showEventDetailPopup(calEvent);
		    },
		});
		
		var baseTop = $("#scheduling_widget").offset().top - header_height ;	
		var header_height = $(".header").height();
		$(window).scroll(function (){
			var top = $(window).scrollTop();
			baseTop = $('#date_scheduling_calendar').offset().top - header_height;
			if (top >= baseTop) {
				$('#scheduling_widget').css({
					"position": "fixed",
					"width":$('#scheduling_widget').width()+'px',
					"top": header_height
				});
			}
			else if (top < baseTop) {
				$('#scheduling_widget').css({
					"position": "",
					"width":"",
					"top": ""
				});
			}
			var w =  parseInt($(window).height()) - parseInt($('.portlet-title').height())  - parseInt($('.header').height())  - parseInt($('.footer').height());
				var a = w - parseInt($('.portlet-title').height()) -  parseInt($('.footer').height());
			$("#external-events").slimScroll({
				height:a/2
			});	

			$("#eventsol_scratchpad").slimScroll({
				height:a/2 - 80
			});		
		});


		var w =  parseInt($(window).height()) - parseInt($('.portlet-title').height())  - parseInt($('.header').height())  - parseInt($('.footer').height())
		$("#scheduling_widget").css('height',w+'px');
		var a = w - parseInt($('.portlet-title').height()) -  parseInt($('.footer').height());
		$("#external-events").slimScroll({
			height:a/2
		});	

		$("#eventsol_scratchpad").slimScroll({
			height:a/2 - 80
		});		
		$('#be_sidebar li').each(function(){
			var a = $(this).attr('onclick');
			if(a!=undefined){
				if(a.indexOf("new_custom_main_page")!=-1){
					$(this).removeAttr('onclick');
				}
			}
		});
		$('#be_sidebar a').each(function(){
			var a = $(this).attr('onclick');
			if(a!=undefined){
				if(a.indexOf("new_custom_main_page")!=-1){
					$(this).removeAttr('onclick');
				}
			}
		});
		$('#be_sidebar a').click(function(){
			if($('#eventsol_scratchpad li').length!=0){
				if (! $(this).parent().is( "li" ) || $(this).parent().parent().hasClass('sub-menu') ) {
					voluntary_date_scheduling.getCnfMsg(this);
					return false;
				}
				else{
					if($(this).parent().hasClass( "arrow" ) || $(this).find('span').hasClass( "arrow" )){

					}
					else{
						console.log('singlelink');
						voluntary_date_scheduling.getCnfMsg(this);
						return false;
					}
				}
			}
			else{
				if($(this).attr('href')!=undefined){
					window.location.href = $(that).attr('href');
				}
			}
			
		});
	},
	getCnfMsg:function(that){
		var msg = global_voluntary_date_scheduling_data.translationsData.Youhaveitemsinthescratchpad+'. ';
		msg += global_voluntary_date_scheduling_data.translationsData.Bynavigatingawayfromthispage+', ';
		msg += global_voluntary_date_scheduling_data.translationsData.thoseitemswillbereturnedtothecalendarontheiroriginaldates+'.';

		var yes = function(){
			if($(that).attr('href')!=undefined){
				window.location.href = $(that).attr('href');
			}
		};

		var no = function(){
			$('#popups').modal('hide');
		};

		showDeleteMessage(msg,global_voluntary_date_scheduling_data.translationsData.Warning,yes,no,'ui-dialog-red',global_voluntary_date_scheduling_data.translationsData.Proceed,global_voluntary_date_scheduling_data.translationsData.Cancel);
		return;
	
	},
	listenForData:function(){
		socket.off('partnerVoluntarySchedulesAdd');
		socket.on('partnerVoluntarySchedulesAdd',partnerVoluntarySchedulesAddFun);	
		function partnerVoluntarySchedulesAddFun(data){
			if(data.error==null || data.error==undefined || data.error==''){
				data = data.success;
		
				var st =  data.start_time;
				st = st.toString().match(/.{1,2}/g);
				var change_time = moment(data.date).format("YYYY-MM-DD HH:mm:ss").split(' ');
				change_time = change_time[0]+' '+st[0]+':'+st[1];
				
				var renderData = {
					id:data.partner_schedule_template_id, 
					partner_voluntary_schedule_id:data.event_data.partner_voluntary_schedule_id,
					title: data.event_data.title, 
					partner_schedule_template_id: data.partner_schedule_template_id, 
					start_time:  st[0]+':'+st[1], 
					start:  change_time, 
					hours: data.hours, 
					stick: true,
					className :'noalloc_event'
				};
		
				function removeCallback(events){
					if(events.partner_voluntary_schedule_id==null || events.partner_voluntary_schedule_id==undefined || events.partner_voluntary_schedule_id=='' ){
						return events;
					}
				}
				$('#date_scheduling_calendar').fullCalendar('removeEvents',removeCallback);
				$('#date_scheduling_calendar').fullCalendar('renderEvent', renderData,true);
			}
			else{
			}	
				
		}

		socket.off('partnerVoluntarySchedulesEdit');	
		socket.on('partnerVoluntarySchedulesEdit',partnerVoluntarySchedulesEditFun);
		function partnerVoluntarySchedulesEditFun(data){
			
			if(data.error==null|| data.error==undefined || data.error==''){
				data = data.success;

				var st =  data.start_time;
				st = st.toString().match(/.{1,2}/g);
				var change_time = moment(data.date).format('YYYY-MM-DD');
				
				change_time = change_time+' '+st[0]+':'+st[1];

				var renderData = {
					partner_voluntary_schedule_id:data.event_data.partner_voluntary_schedule_id,
					title: data.event_data.title, 
					partner_schedule_template_id: data.partner_schedule_template_id, 
					start_time:  st[0]+':'+st[1], 
					start:  change_time, 
					hours: data.hours, 
					stick: true
				};
				
				if(data.customer_count>0){
					renderData.className = 'alloc_event';
				}
				else{
					renderData.className = 'noalloc_event';
				}
				
				$('#date_scheduling_calendar').fullCalendar('removeEvents', data.partner_schedule_template_id);
				function removeCallback(events){
					if(events.partner_voluntary_schedule_id == data.event_data.partner_voluntary_schedule_id){
						return events;
					}
				}	
				$('#date_scheduling_calendar').fullCalendar('removeEvents',removeCallback);
				$('#date_scheduling_calendar').fullCalendar('renderEvent', renderData,true);
			}
			else{
			}			
		}
		

		socket.off('partnerVoluntarySchedulesDelete');
		socket.on('partnerVoluntarySchedulesDelete',partnerVoluntarySchedulesDeleteFun);
		function partnerVoluntarySchedulesDeleteFun(data){
			
			if(data.error==null || data.error==undefined || data.error==''){
				data = data.success;
				function removeCallback(events){
					if(events.partner_voluntary_schedule_id == data.id){
						return events;
					}
				}	
				$('#date_scheduling_calendar').fullCalendar('removeEvents',removeCallback);
			}
			else{

			}
		}
			

		socket.off('partnerVoluntarySchedulesEditMeta');
		socket.on('partnerVoluntarySchedulesEditMeta',partnerVoluntarySchedulesEditMetaData);
		function partnerVoluntarySchedulesEditMetaData(data){
			
			if(data.error==null){
				data =data.success;
				
				var evn_id = data.emithis.event_id;
				var st =  data.start_time;
		
				st = st.toString().match(/.{1,2}/g);
				var change_time = data.emithis.date.split(' ');
				change_time = change_time[0]+' '+st[0]+':'+st[1];

				var renderData = {
					partner_voluntary_schedule_id:data.id,
					title: data.name, 
					partner_schedule_template_id:0 , 
					start_time:  st[0]+':'+st[1], 
					start:  change_time, 
					hours: data.hours, 
					stick: true,
					className:data.emithis.className

				};
			
				function removeCallback(events){
					if(events.partner_voluntary_schedule_id == data.id){
						return events;
					}
				}	
				$('#date_scheduling_calendar').fullCalendar('removeEvents',removeCallback);
				$('#date_scheduling_calendar').fullCalendar('renderEvent', renderData,true);
			}
		}
		
		socket.off('partnerVoluntarySchedulesDeletePopup');
		socket.on('partnerVoluntarySchedulesDeletePopup',partnerVoluntarySchedulesDeletePopup);
		function partnerVoluntarySchedulesDeletePopup(data){	
			if(data.error==null){
				data =data.success;
				console.log('partnerVoluntarySchedulesDeletePopup');
				console.log(data);
				var removeCallback = function(events){
					console.log(events);
					if(events.partner_voluntary_schedule_id==data.id){
						return events;
					}
				}
				$('#date_scheduling_calendar').fullCalendar('removeEvents',removeCallback);
			}			
		}
		socket.off('partnerVoluntarySchedulesCancel');
		socket.on('partnerVoluntarySchedulesCancel',partnerVoluntarySchedulesCancel);
		function partnerVoluntarySchedulesCancel(data){	
			if(data.error==null){
				data =data.success;
				console.log(data);
				var st =  data.start_time;
				st = st.toString().match(/.{1,2}/g);
				var change_time = moment(data.date).format('YYYY-MM-DD');
				
				change_time = change_time+' '+st[0]+':'+st[1];

				var renderData = {
					partner_voluntary_schedule_id:data.id,
					title: data.name, 
					partner_schedule_template_id: data.partner_schedule_template_id, 
					start_time:  st[0]+':'+st[1], 
					start:  change_time, 
					hours: data.hours, 
					stick: true
				};
				
				
				renderData.className = 'completed_event';
				
				
				$('#date_scheduling_calendar').fullCalendar('removeEvents', data.id);
				function removeCallback(events){
					if(events.partner_voluntary_schedule_id == data.id){
						return events;
					}
				}	
				$('#date_scheduling_calendar').fullCalendar('removeEvents',removeCallback);
				$('#date_scheduling_calendar').fullCalendar('renderEvent', renderData,true);
			}			
		}


	},
	generateScheduleList:function(data){
		var ret = '<div class="fc-event" data-name="'+data.name+'" data-start-time="'+data.start_time+'"  data-hours="'+data.hours+'"   data-partner-schedule-template-id="'+data.id+'">';
			ret += data.name;
		ret += '</div>';
		return ret;
	},
	saveSchedule:function(events,how){	
	
		var start_time = events.start_time.replace(':','');
		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			partner_schedule_template_id:events.partner_schedule_template_id,
			name:events.title,
			date:events.start.format("YYYY-MM-DD HH:mm:ss"),
			hours:events.hours,				
			start_time:start_time,
			status:0,
		};
		
		var total_params = {
			data:params,
			model:'partnerVoluntarySchedules',
			action:'scheduling',
			emitevent:'partnerVoluntarySchedulesAdd',

		};
		
		if(events.partner_voluntary_schedule_id=='' || events.partner_voluntary_schedule_id==undefined || events.partner_voluntary_schedule_id==null){		
			total_params.emitthis = {title:events.title,eventid:events._id,partner_voluntary_schedule_id:''};
			socket.emit('crud', total_params);
			return;
		}
		else{
			total_params.data.id = events.partner_voluntary_schedule_id;
			total_params.emitevent = 'partnerVoluntarySchedulesEdit';
			total_params.emitthis = {title:events.title,eventid:events._id,partner_voluntary_schedule_id:events.partner_voluntary_schedule_id};
			socket.emit('crud', total_params);
			return;
		}
	},
	deleteSchedule:function(events){
		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			id:events.partner_voluntary_schedule_id
		};
		var total_params = {
			data:params,
			model:'partnerVoluntarySchedules',
			action:'delete',
			emitevent:'partnerVoluntarySchedulesDelete',
		};
		socket.emit('crud', total_params);
		$('#date_scheduling_calendar').fullCalendar('removeEvents', events._id);   
	},
	showEventDetailPopup:function(data){
		
		var className = '';
		if(data.className!=undefined && data.className!=null){
			if(data.className[0]!=undefined && data.className[0]!=null){
				className = data.className[0];
			}
		}
		var metadata = { id: data.partner_voluntary_schedule_id,event_id:data._id,date:data.start.format("YYYY-MM-DD HH:mm:ss"),className:className };
		new_custom_popup(600,'popups','edit_schedule',metadata);
	},
	generatePopupHtml:function(data,notification_data){
		var html = '';
		html = '<div class="modal-header">';
			html += '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>';
			html += '<h3>'+data.title+'</h3>';
		html += '</div>';
		html += '<div class="portlet-body">';
			html += '<div class="modal-body">';
				html += '<form class="form-horizontal">';

					html += '<div class="control-group">';
						html += '<label class="control-label">'+global_voluntary_date_scheduling_data.translationsData.Starttime+':</label> ';
						html += '<div class="controls">	';
							html += '<span class="text bold">'+data.start_time+'</span>';
						html += '</div>';
					html += '</div>';

					html += '<div class="control-group">';
						html += '<label class="control-label">'+global_voluntary_date_scheduling_data.translationsData.Duration+' ('+global_voluntary_date_scheduling_data.translationsData.hours+'):</label> ';
						html += '<div class="controls">	';
							html += '<span class="text bold">'+data.hours+'</span>';
						html += '</div>';
					html += '</div>';
					
					if(notification_data!='' && notification_data!=null && notification_data!=undefined){
						html += '<div class="control-group">';
							html += '<label class="control-label">'+global_voluntary_date_scheduling_data.translationsData.Notifications+':</label> ';
							for(var j in notification_data){
								html += '<div class="controls">	';
									html += '<span class="text bold">'+notification_data[j].PartnerScheduleNotification.when_event_text+'</span>';
								html += '</div>';
							}
							
						html += '</div>';
					}
				html += '</form>';					
			html += '</div>';
			// html += '<div class="modal-footer">';
			// 	html += '<div class="btn-group">';
			// 		html += '<button class="btn blue update" id="edit_staff_details" type="button"><i class="icon-ok"></i> Save</button>';
			// 		html += '<button data-dismiss="modal" class="btn btn_clear" type="button"><i class="icon-remove"></i> Cancel</button>';
			// 	html += '</div>';
			// html += '</div>';
		html += '</div>';
		return html;
	},
};


Template7.registerHelper('ScheduleListHelper', function (data){
	return voluntary_date_scheduling.generateScheduleList(data);
});

