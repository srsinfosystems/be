if(boat_scheduling!=undefined){
	delete tabfunc;
}

var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var dbevents = [];
var bs_dt;
var bs_td;

var boat_scheduling = {
	start:function(){
		boat_scheduling.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','Boat storage','Scheduling','alert message','Cancel','Warning','Today'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/boat_scheduling.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				bs_dt = complet_data.response.response;
				bs_td = complet_data.response.response.translationsData;
				boat_scheduling.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bs_dt.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bs_dt.translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		bs_dt.translationsData.dashboardurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('boat_scheduling_template').innerHTML;
		var compiledRendered = Template7(template, bs_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		boat_scheduling.bindEvents();
		after_main_page();
	},
	bindEvents:function(){
		moment().utcOffset(0);
		boat_scheduling.bindCalendar();
		
	},
	bindCalendar:function(){
		dbevents = [];
		var today_date = moment(bs_dt.todaydate);
		for(var j in bs_dt.boatstore_event){
			var pbe = bs_dt.boatstore_event[j].PartnerBoatstoreEvent;
			var pba = bs_dt.boatstore_event[j].PartnerBoatstoreAllocation;

			pbe.title = pbe.name;
			pbe.start = pbe.start_datetime;
			pbe.end = pbe.end_datetime;
			pbe.fullday = false;
			pbe.allday = false;

			var endtime = moment(pbe.end_datetime);

			if(( today_date.unix() > endtime.unix() ) || pbe.status == 'can' || pbe.status == 'comp'){
				pbe.className = 'completed_event';
				pbe.editable = false;
			}
			else if(pba.length == 0){
				pbe.className = 'noalloc_event';
			}
			else{
				pbe.className = 'alloc_event';
			}
			dbevents.push(pbe);
		}

		
		var h = $(window).height() - $('.header').outerHeight() - $('.dash_header').outerHeight();
		
		$('#boat_sched_calendar').fullCalendar({
			
			buttonText:{
				today: bs_td.Today ,
			},	
			header:{
               right: 'prev,next,today',
               center: 'title',
               left: 'month,agendaWeek,agendaDay,listWeek'
            },
            events:dbevents,
			lang:lang,
			editable: true,
     		droppable: false, 
     		eventStartEditable:false,
     		dragRevertDuration: 0,
     		timeFormat: 'HH:mm',
     		selectable: false,
     		displayEventEnd:true,
     		nextDayThreshold:'00:00:01',
			drop: function(date, jsEvent, ui, resourceId) {	

			},
			eventConstraint:{
            	start: moment().format('YYYY-MM-DD'),
            	end: '2100-01-01'
        	},
			eventReceive: function(event) {
							
			},
			eventDrop: function(event) {	
				
			},
			eventDragStop:function( events, jsEvent, ui, view){
				
			},
			eventRender: function(event, element) {		
		    },
		    dayClick: function(calEvent, jsEvent, view) {
		    	if(calEvent.isBefore(moment())) {
		    		$('#boat_sched_calendar').fullCalendar('unselect');
       				//return false;
		    	}
		    	else{
		    		boat_scheduling.showEventDetailPopup(calEvent,'','add');
		    	}		    	
		    },
		   
		    eventClick: function(calEvent, jsEvent, view) {
		    	boat_scheduling.showEventDetailPopup('','','edit',calEvent);
		    },
		});	

		// select: function(start, end) {
	 //    	console.log('range');
	 //    	if(start.isBefore(moment())) {
	 //    		$('#boat_sched_calendar').fullCalendar('unselect');
  //  				//return false;
	 //    	}
	 //    	else{
		//     	if (end.hasTime()) {
		    		
		// 		}
		// 		else {
		// 		    end.subtract(1, 'days');
		// 		}
		//     	boat_scheduling.showEventDetailPopup(start,end,'add');
	 //    	}
	 //    },		
	},
	listenForData:function(){
		socket.off('PartnerBoatstoreEventsSave');
		socket.on('PartnerBoatstoreEventsSave',boat_scheduling.updateevents);

		socket.off('PartnerBoatstoreEventsDelete');
		socket.on('PartnerBoatstoreEventsDelete',boat_scheduling.deleteevents);
	},
	deleteevents:function(data){
		boat_scheduling.removeevent(data.success);
	},
	updateevents:function(data){

		if(data.error == null){
			boat_scheduling.removeevent(data.success.data);
			boat_scheduling.renderEvent(data.success.data);
		}
	},
	removeevent:function(data){
		var removeCallback = function(events){
			if(events.id == data.id){
				return events;
			}
		}
		$('#boat_sched_calendar').fullCalendar('removeEvents',removeCallback);		
	},
	renderEvent:function(data){
		data.title = data.name;
		data.start = data.start_datetime;
		data.end = data.end_datetime;

		var endtime = moment(data.end_datetime);
		var today_date = moment(bs_dt.todaydate);
		if(( today_date.unix() > endtime.unix() ) || data.status == 'can' || data.status == 'comp'){
			data.className = 'completed_event';
			data.editable = false;
		}
		else if(data.count == 0){
			data.className = 'noalloc_event';
		}
		else{
			data.className = 'alloc_event';
		}

		$('#boat_sched_calendar').fullCalendar('renderEvent', data,true);
	},
	showEventDetailPopup:function(start,end,from,data){
		new_custom_popup2('600','popups','add_boat_event',{start:start,end:end,from:from,data:data});
	}
}