if(voluntary_completion!=undefined){
	delete voluntary_completion;
}

var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id = parseInt($('#partner_id').val());
var admin_id = parseInt($('#admin_id').val());
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var loginType= $('#loginType').val();
var dbevents = [];
if(loginType=='customer'){
	var session_customer_id = $('#session_customer_id').val();
}
var global_voluntary_completion_data;
var all_cust_sms_details = [];
var all_cust_email_details = [];
var attendance = {};
var voluntary_completion = {
	start:function(){
		voluntary_completion.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','Voluntary work','Completion','No schedule found','Schedules','Customers','No customer found','Select schedule','Open','Select','Present','Partially present','Not present','Register and complete','Reset','Cancel','alert message','error','Please select status for all customers','Work details','Registered','Confirmation','Yes','No','Are you sure you want to cancel the schedule','Cancelled','Edit','The information is about to be permanently stored and cannot be changed later on','Are you sure you would like to proceed','Planned work','Work completed','Presence','hour','hours','Show contact information','Send email','Send SMS','Contact participant','Contact information','Land line','Cellphone','Email','Customer name','Customer number','Show','Work description','Comments on the work that was carried out on this date and task','Set','Please select at least one checkbox','Completed','No email address available','No cellphone available','Select all','Deselect all','Close','Actions','Generate participants list'],
		};
		if(loginType=='customer'){
			total_params.customer_id = session_customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getVoluntaryCompletion.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){

				global_voluntary_completion_data = complet_data.response.response;

				
				voluntary_completion.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_voluntary_completion_data.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_voluntary_completion_data.translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		global_voluntary_completion_data.translationsData.dashboardurl = base_url+'dashboard/index';
		global_voluntary_completion_data.translationsData.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('voluntary_completion_template').innerHTML;
		var compiledRendered = Template7(template, global_voluntary_completion_data);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0)
		hideProcessingImage();		
		voluntary_completion.bindEvents();
	},
	bindEvents:function(){
		var w = $(window).outerHeight(true) - $('.header').outerHeight(true) - $('.btn_group').outerHeight(true);

		$(window).scroll(function (){
			if(voluntary_completion!=undefined && voluntary_completion!='' && voluntary_completion!=null){
				voluntary_completion.handleresize();
			}
			
		});

		$(window).resize(function (){
			if(voluntary_completion!=undefined && voluntary_completion!='' && voluntary_completion!=null){
				voluntary_completion.handleresize();
			}
		});
		setTimeout(function(){
			$('#completion_wrapper').css({
				"height":w+'px'
			});
			var a = $('#completion_wrapper').outerHeight(true) - $('.portlet-title').outerHeight(true);
		
			$('.port1').css('min-height',a+'px');
			$('.port3').css('min-height',a+'px');

			var c = $('.port1').outerHeight(true);
			var d = $('.port1').outerHeight(true);
			var e = $('.header').outerHeight(true) + $('#content').outerHeight(true);

			if(c>d){
				var oh = parseInt(c) + parseInt(e);
				$('.page-content').css('min-height',oh+'px');
			}
			else if(d>c){
				var oh = parseInt(d) + parseInt(e);
				$('.page-content').css('min-height',oh+'px');
			}
			else{
				var oh = parseInt(c) + parseInt(e);
				$('.page-content').css('min-height',oh+'px');
			}

			

		},10);
		

		var a = voluntary_completion.generateAndRenderEvents(global_voluntary_completion_data.PartnerVoluntarySchedulesDates,'first');
		$('#schedules_customers_calendar').fullCalendar({
			lang:lang,
			events:dbevents,
		    dayClick: function(date, jsEvent, view) {
		    	voluntary_completion.getScheduleCustomersByDate(date);
		    },
			dayRender: function (date, element, view){
		
				var date = new Date(date);
                var day = date.getDate().toString();
                if (day.length == 1)
                    day = 0 + day;
                var year = date.getFullYear();
                var month = (date.getMonth() + 1).toString();
                if (month.length == 1)
                    month = 0 + month;
                var dateStr = year + "-" + month + "-" + day ;

                // YourDates is Json array of your default dates

                for (var i = 0; i < dbevents.length; i++) 
               {
                 //here you campare calender dates to your default dates
                   if ( dateStr.toString() == dbevents[i].start.toString() ) 
                    {
                    	$('td.fc-day-number[data-date='+dateStr+']').css("color", "#fff"); 
                        $(element).css("background", dbevents[i].backgroundColor);
                        $(element).css("cursor", "pointer");
                         

                    }

                }
			}
		});
		
		voluntary_completion.handleresize();
	},
	handleresize:function(i=0){
		// var w = $(window).outerHeight(true) - $('.header').outerHeight(true) - $('.btn_group').outerHeight(true);
		// $('#completion_wrapper').css({
		// 	"height":w+'px'
		// });
		// var c = $('.port1').outerHeight(true);
		// var d = $('.port1').outerHeight(true);
		// var e = $('.header').outerHeight(true) + $('#content').outerHeight(true);

		// if(c>d){
		// 	var oh = parseInt(c) + parseInt(e);
		// 	$('.page-content').css('min-height',oh+'px');
		// }
		// else if(d>c){
		// 	var oh = parseInt(d) + parseInt(e);
		// 	$('.page-content').css('min-height',oh+'px');
		// }
		// else{
		// 	var oh = parseInt(c) + parseInt(e);
		// 	$('.page-content').css('min-height',oh+'px');
		// }
		// var a = $('.page-content').outerHeight(true) - $('.portlet-title').outerHeight(true) - $('#content').outerHeight(true) - $('.portlet-title').height()
		// var a

		// $('.port1').css('min-height',a+'px');
		// $('.port3').css('min-height',a+'px');
	},
	listenForData:function(){
		socket.off('partnerVoluntaryAllocationsCancel');
		socket.on('partnerVoluntaryAllocationsCancel',voluntary_completion.partnerVoluntaryAllocationsCancel);
		
		socket.off('partnerVoluntaryAllocationsEnabledit');
		socket.on('partnerVoluntaryAllocationsEnabledit',voluntary_completion.partnerVoluntaryAllocationsEnabledit);

		socket.off('partnerVoluntaryAllocationsRegister');
		socket.on('partnerVoluntaryAllocationsRegister',voluntary_completion.partnerVoluntaryAllocationsRegisterFun);
		
	},
	generateAndRenderEvents:function(data,first=''){
		dbevents = [];
		for(var j in data){
			var ps = data[j][0];
			var events = {
				start:ps.schedule_date,
			};
			
			if(ps.total_customers==0){
				events.backgroundColor = '#35aa47';
			}
			else if(ps.incomplete_count==0){
				events.backgroundColor = '#9F9F9F';
			}
			else{
				events.backgroundColor = '#297CBE';
			}
			
			dbevents.push(events);
		}
		if(first==''){
			$('#schedules_customers_calendar').fullCalendar('destroy');
			$('#schedules_customers_calendar').fullCalendar({
				lang:lang,
				events:dbevents,
			    dayClick: function(date, jsEvent, view) {
			    	voluntary_completion.getScheduleCustomersByDate(date);
			    },
				dayRender: function (date, element, view){
					console.log('zzzz');
					var date = new Date(date);
	                var day = date.getDate().toString();
	                if (day.length == 1)
	                    day = 0 + day;
	                var year = date.getFullYear();
	                var month = (date.getMonth() + 1).toString();
	                if (month.length == 1)
	                    month = 0 + month;
	                var dateStr = year + "-" + month + "-" + day ;

	                // YourDates is Json array of your default dates

	                for (var i = 0; i < dbevents.length; i++) 
	               {
	                 //here you campare calender dates to your default dates
	                   if ( dateStr.toString() == dbevents[i].start.toString() ) 
	                    {
	                    	$('td.fc-day-number[data-date='+dateStr+']').css("color", "#fff"); 
	                        $(element).css("background", dbevents[i].backgroundColor);
	                        $(element).css("cursor", "pointer");
	                         

	                    }

	                }
				}
			});
		}
		return dbevents;
	},
	getSchedules:function(){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			from:'dates'
		};
		if(loginType=='customer'){
			total_params.customer_id = session_customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getVoluntaryCompletion.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
		
				voluntary_completion.generateAndRenderEvents(complet_data.response.response.PartnerVoluntarySchedulesDates);

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_voluntary_completion_data.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_voluntary_completion_data.translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	getScheduleCustomersByDate:function(date){

		var found = 0;
		for(var j in global_voluntary_completion_data.PartnerVoluntarySchedulesDates){

			var sd = global_voluntary_completion_data.PartnerVoluntarySchedulesDates[j][0].schedule_date;
	
			if(sd == date.format("YYYY-MM-DD")){
				found = 1;
			}
		}
		if(found==0){
			voluntary_completion.generateScheduleList();
			return;
		}
		showProcessingImage();
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			date:date.format("YYYY-MM-DD")
		};
		if(loginType=='customer'){
			total_params.customer_id = session_customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getScheduleCustomersByDate.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){

				voluntary_completion.generateScheduleList(complet_data.response.response.PartnerVoluntarySchedules);
			
			}
			else if(complet_data.response.status == 'error'){
			}
		}
		doAjax(params);
		return;
	},
	generateScheduleList:function(data=[]){

		var html ='';
		for(var j in data){
			var res = data[j].PartnerVoluntarySchedule;
			if(res.work_description==null || res.work_description==undefined){
				res.work_description = '';
			}
			if(res.planned_work==null || res.planned_work==undefined){
				res.planned_work = '';
			}
			html += '<li class="dd-custom-item border_class border_class_'+res.id+'" data-id="'+res.id+'">';

				html += '<div class="dd-custom-handle " onclick="voluntary_completion.getCustomers('+res.id+','+res.hours+','+res.status+',\''+res.work_description+'\',\''+res.planned_work+'\')">';
					html += '<p style="text-align:left;float:left;margin:0">';
						html += convertDateIntoSiteFormat(res.date)+' '+res.name;
					html += '</p>';

					

					html += '<p style="text-align:right;float:right;margin:0" class="adj_right">';
						if(res.status==0){
							html += '<span class="span_status span_status_open span_status_open_'+res.id+'" >'+global_voluntary_completion_data.translationsData.Show+'</span>';
						}
						else if(res.status==1){
							html += '<span class="span_status span_status_reg" >'+global_voluntary_completion_data.translationsData.Completed+'</span>';
						}
						else if(res.status==2){
							html += '<span class="span_status span_status_can" >'+global_voluntary_completion_data.translationsData.Cancelled+'</span>';
						}
					html += '</p>';

				html += '</div>';

				if((res.status==2 || res.status==1) && loginType!='customer'){
					html += '<div onclick="voluntary_completion.enableEdit('+res.id+')" class="span_status_edit_p">';
						html += '<p style="float:right;margin:0" ><span class="span_status span_status_edit">'+global_voluntary_completion_data.translationsData.Edit+'</span></p>';
					html += '</div>';
				}

			html += '</li>';

		}
		if(html==''){		
			$('.rmdis').hide();
			var empty_text;
			empty_text = '<li>'+global_voluntary_completion_data.translationsData.Nocustomerfound+'</li>';
			$('#schedules_customers_ol').html(empty_text);
			$('#completed_work_schedules .desc').html('');

			html = '<li>'+global_voluntary_completion_data.translationsData.Noschedulefound+'</li>';
		}

		$('#completed_work_schedules_ol').html(html);
		if(data.length==1){
			var ress = data[0].PartnerVoluntarySchedule;
			voluntary_completion.getCustomers(ress.id,ress.hours,ress.status,res.work_description,res.planned_work);
		}
		else{
			var empty_text;
			empty_text = '<li>'+global_voluntary_completion_data.translationsData.Selectschedule+'</li>';
			$('#schedules_customers_ol').html(empty_text);
			$('#work_description_wrapper').html(global_voluntary_completion_data.translationsData.Selectschedule);
		}
		$('.span_status_edit_p').each(function(){
			var w = $(this).find('p').width() / $(this).parent().width() * 100;
   			w = parseInt(w) + 2;	
			var a = 100 - w;
			$(this).attr('style','width:'+w+'% !important');
			$(this).prev('div').css({
				'width':a+'%',
				'float':'left',
			});	
		});
		$('.dd-custom-item').each(function(){
			if($(this).find('.span_status_edit_p').length==0){
				$(this).find('.dd-custom-handle ').css('width','100%')
			}
		});	
	},
	getCustomers:function(id,hours,status,work_description='',planned_work=''){


		$('.rmdis').attr('disabled','disabled');
		$('.rmdis').hide();
		attendance.schedule_id = id;
		$('.border_class').removeClass('selected_border');
		$('.border_class_'+id).addClass('selected_border');
		var loader = '<li class="dd-custom-item" style="text-align:center"><img src="'+global_voluntary_completion_data.translationsData.loaderurl+'"></li>';
		$('#schedules_customers_ol').html(loader);
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			partner_voluntary_schedule_id:id,
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getScheduleCustomers.json'
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				voluntary_completion.generateCustomersList(complet_data.response.response,hours,status,work_description,planned_work,id);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_voluntary_completion_data.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_voluntary_completion_data.translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	generateCustomersList:function(data,hours,status,work_description='',planned_work='',id){
		
		attendance.customers = [];
		var html ='';
		if(data.length!=0){
			setTimeout(function(){
				$('.rmdis').removeAttr('disabled');
			},1);
		}
		var schedule_id;
		var customer_email_cnt = 0;
		var customer_sms_cnt = 0;
		all_cust_sms_details = [];
		all_cust_email_details = [];
		var manager_count = 0;
		for(var j in data){
			var res = data[j].PartnerVoluntaryAllocation;
		
			if(res.is_manager==1){
				manager_count++;
			}
			var cust = data[j].Customer;
			var country = data[j].Country;
			schedule_id = res.partner_voluntary_schedule_id;
			if(res.reason==null){
				res.reason = '';
			}
			var obj = {
				customer_id:res.customer_id,
				status:res.status,
				reason:res.reason,
				id:res.id,
				hours:res.hours
			};
			attendance.customers.push(obj);
			html += '<li class="dd-custom-item dd-custom-item-customer">';
				html += '<ul class="customer_li">';
				
						html += '<li class="customer_li_presencecheck">';
					
						html += '<input type="checkbox" data-customer-id="'+res.customer_id+'" class="presence_check presence_check_'+res.customer_id+'">';
					html += '</li>';


					html += '<li class="customer_li_name">';
						html += cust.customer_name;
					html += '</li>';

					html += '<li class="customer_li_action">';
						
		
						
						html += '<div style="display:none;float:right" class="absence_hours_wrapper" 	id="absence_hours_wrapper_'+res.customer_id+'">';
							html += '<select data- id="absence_hours_'+res.customer_id+'" class="absence_hours" data-customer-id="'+res.customer_id+'" onchange="voluntary_completion.saveTempData('+res.customer_id+',2)">';
						
							
								for (i = 1; i <= hours; i++) { 
									html += '<option value="'+i+'">';
										html += i;
									html += '</option>';
									}
								html += '</select>';
							html += '</div>';

						
							html += '<div style="display:none;float:right" class="absence_reason_wrapper" id="absence_reason_wrapper_'+res.customer_id+'">';
							html += '<select id="absence_reasons_'+res.customer_id+'" class="absence_reasons" data-customer-id="'+res.customer_id+'" onchange="voluntary_completion.saveTempData('+res.customer_id+',3)">';
						
								for (var j in global_voluntary_completion_data.PartnerAbsenceReason) { 
									var r = global_voluntary_completion_data.PartnerAbsenceReason[j].PartnerAbsenceReason;
									if(res.status==3 && res.reason==r.id){
										html += '<option value="'+r.id+'" selected>';
									}
									else{
										html += '<option value="'+r.id+'">';
									}
										html += r.name;
									html += '</option>';
								}
							html += '</select>';
						html += '</div>';

						if(status!=2){
							html += '<div style="display:inline-block;float:right" class="dropdown">';
								html += '<button id="customer_contact_'+res.customer_id+'" style="" type="button" class="btn mini green-stripe dropdown-toggle" data-toggle="dropdown" >'; 
									html += global_voluntary_completion_data.translationsData.Contactparticipant;
									html += '<i class="icon-angle-down"></i>';
								html += '</button>';

								html += '<ul class="dropdown-menu actions_c">';
									cust.cp_code = '+'+country.phone_initial;
									var custa = JSON.stringify(cust);
									
									custa = custa.replace(/"/g , "'");
									if(cust.customer_email!='' && cust.customer_email!=null && cust.customer_email!=undefined){
										customer_email_cnt++;
										all_cust_email_details.push(cust);
										html += '<li onclick="voluntary_completion.contactParticipant('+res.customer_id+',1,'+custa+')">';
											html += '<i class="icon-envelope"></i> '+global_voluntary_completion_data.translationsData.Sendemail;
										html +='</li>';
									}
									
									if(cust.customer_cellphone!='' && cust.customer_cellphone!=null && cust.customer_cellphone!=undefined){
										customer_sms_cnt++;
										all_cust_sms_details.push(cust);
										html += '<li onclick="voluntary_completion.contactParticipant('+res.customer_id+',2,'+custa+')">';
											html += '<i class="icon-comment"></i> '+global_voluntary_completion_data.translationsData.SendSMS;
										html +='</li>';
									}
									

									html += '<li onclick="voluntary_completion.contactParticipant('+res.customer_id+',3,'+custa+')">';
										html += '<i class="icon-info"></i> '+ global_voluntary_completion_data.translationsData.Showcontactinformation;
									html +='</li>';

								html += '</ul>';

							html += '</div>';

							html += '<div style="display:inline-block;float:right" class="dropdown">';
						
							html += '<button id="customer_present_'+res.customer_id+'" style="" type="button" class="btn mini green-stripe dropdown-toggle customer_present" data-toggle="dropdown" >';
								if(res.status==1){
									html += global_voluntary_completion_data.translationsData.Present;
								}
								else if(res.status==2){
									if(res.hours == 1){
										html += global_voluntary_completion_data.translationsData.Present+' '+ res.hours+' '+global_voluntary_completion_data.translationsData.hour;
									}
									else{
										html += global_voluntary_completion_data.translationsData.Present+' '+ res.hours+' '+global_voluntary_completion_data.translationsData.hours;
									}
									
									//html += global_voluntary_completion_data.translationsData.Partiallypresent;
								}
								else if(res.status==3){
									var find = 0 ;
									for(var j in global_voluntary_completion_data.PartnerAbsenceReason){
										var abr = global_voluntary_completion_data.PartnerAbsenceReason[j].PartnerAbsenceReason;
										
										if(abr.id == res.reason){
											html += abr.name;
											find = 1;
											break;
										}
									}
									if(find==0){
										html += global_voluntary_completion_data.translationsData.Notpresent;
									}
									
								}
								else{
									html += global_voluntary_completion_data.translationsData.Presence;
								}
								html += '<i class="icon-angle-down"></i>';
							html += '</button>';

							if(status==0){

								html += '<ul class="dropdown-menu actions_c actions_menu">';
									html += '<li onclick="voluntary_completion.attendance('+res.customer_id+',1,this)">';
										html += '<i class="icon-ok"></i> '+global_voluntary_completion_data.translationsData.Present;
									html +='</li>';

									// onclick="voluntary_completion.attendance('+res.customer_id+',2,this);return false;"
									html += '<li class="dropdown-submenu" >';
									 

									 	html += '<a class="test" tabindex="-1" href="javascript:;">';
											html += '<i class="icon-minus"></i> '+global_voluntary_completion_data.translationsData.Partiallypresent;
										html += '</a>';
										html += '<ul class="dropdown-menu actions_d" style="margin-top:0;margin-left:0">';
											for (i = 1; i <= hours; i++) { 
												html += '<li data-hours="'+i+'" onclick="voluntary_completion.attendance('+res.customer_id+',2,this,'+i+');">';
													if(i==1){
														html +=  global_voluntary_completion_data.translationsData.Present+' '+i+' '+global_voluntary_completion_data.translationsData.hour;
													}
													else{
														html +=  global_voluntary_completion_data.translationsData.Present+' '+i+' '+global_voluntary_completion_data.translationsData.hours;
													}
													
												html +='</li>';
											}
										html += '</ul>';
									html +='</li>';

									html += '<li class="dropdown-submenu"   >';

									

										if(global_voluntary_completion_data.PartnerAbsenceReason.length==0){
											html += '<a class="test" tabindex="-1" href="javascript:;"  onclick="voluntary_completion.attendance('+res.customer_id+',3,this,0);">';
										}
										else{
											html += '<a class="test" tabindex="-1" href="javascript:;" >';
										}
											html += '<i class="icon-remove"></i> '+ global_voluntary_completion_data.translationsData.Notpresent;
										html += '</a>';

										if(global_voluntary_completion_data.PartnerAbsenceReason.length!=0){
											html += '<ul class="dropdown-menu actions_d" style="margin-top:0;margin-left:0">';
											if(global_voluntary_completion_data.PartnerAbsenceReason.length!=0){
												
												for (var j in global_voluntary_completion_data.PartnerAbsenceReason) { 
													var r = global_voluntary_completion_data.PartnerAbsenceReason[j].PartnerAbsenceReason;
													html += '<li data-absence="'+r.id+'" onclick="voluntary_completion.attendance('+res.customer_id+',3,this,'+r.id+');">';
														html += r.name;
													html +='</li>';
												}
												
											}
											html += '</ul>';
										}

									html +='</li>';
									
								html += '</ul>';
							}
							html += '</div>';
						
						}
						else{
							cust.cp_code = '+'+country.phone_initial;
							var custa = JSON.stringify(cust);
								
							custa = custa.replace(/"/g , "'");
							if(cust.customer_email!='' && cust.customer_email!=null && cust.customer_email!=undefined){
								customer_email_cnt++;
								all_cust_email_details.push(cust);
							}

								
							if(cust.customer_cellphone!='' && cust.customer_cellphone!=null && cust.customer_cellphone!=undefined){
								customer_sms_cnt++;
								all_cust_sms_details.push(cust);
							}
						}
					html += '</li>';

				html += '</ul>';
			html += '</li>';
		}

		var empty_text;
		if(html==''){		
			empty_text = '<li>'+global_voluntary_completion_data.translationsData.Nocustomerfound+'</li>';
			$('#schedules_customers_ol').html(empty_text);
		}
		else{

			var all_sel = '<li class="dd-custom-item-customer" style="padding:3px">';
				all_sel += '<input style="display:none" type="checkbox" class="presence_check_all">';
				all_sel += '<button class="btn blue btn-outline" id="select_all"><i class="icon-ok"></i>'+global_voluntary_completion_data.translationsData.Selectall+'</button>';
				
				

				if(customer_sms_cnt!=0 && customer_email_cnt!=0){
					all_sel += '<div style="display:none;float:right" class="dropdown ssdropdown">';
						all_sel += '<button data-toggle="dropdown" style="" class="rmdis btn blue dropdown-toggle btn-outline" id="voluntary_completion_set" onclick="voluntary_completion.set()">'+global_voluntary_completion_data.translationsData.Contactparticipant+'<i class="icon-angle-down"></i></button>';
						all_sel += '<ul class="dropdown-menu actions_c">';

							if(customer_email_cnt!=0){
								all_sel += '<li onclick="voluntary_completion.contactParticipant(0,4,0)">';
									all_sel += '<i class="icon-envelope"></i> '+global_voluntary_completion_data.translationsData.Sendemail;
								all_sel +='</li>';
							}
							if(customer_sms_cnt!=0){
								all_sel += '<li onclick="voluntary_completion.contactParticipant(0,5,0)">';
									all_sel += '<i class="icon-comment"></i> '+global_voluntary_completion_data.translationsData.SendSMS;
								all_sel +='</li>';
							}

						all_sel += '</ul>';
					all_sel += '</div>';
				}
				if(status==0){		
					all_sel += '<div style="display:none;float:right;margin-right:2px" class="dropdown ssdropdown">';
						all_sel += '<button data-toggle="dropdown" style="" class="rmdis btn blue dropdown-toggle btn-outline" id="voluntary_completion_set" onclick="voluntary_completion.set()">'+global_voluntary_completion_data.translationsData.Presence+'<i class="icon-angle-down"></i></button>';
						all_sel += '<ul class="dropdown-menu actions_c">';

							all_sel += '<li class="ssrm" onclick="voluntary_completion.all_set(1)"><i class="icon-ok"></i> '+global_voluntary_completion_data.translationsData.Present+'</li>';
							
							all_sel += '<li class="dropdown-submenu ssrm">';
								all_sel += '<a class="test" tabindex="-1" href="javascript:;"><i class="icon-minus"></i>  '+global_voluntary_completion_data.translationsData.Partiallypresent+'</a>';
								all_sel += '<ul class="dropdown-menu actions_d" style="margin-top:0;margin-left:0">';
								for (i = 1; i <= hours; i++) { 
									all_sel += '<li  onclick="voluntary_completion.all_set(2,'+i+')">';
										if(i==1){
											all_sel +=  global_voluntary_completion_data.translationsData.Present+' '+i+' '+global_voluntary_completion_data.translationsData.hour;
										}
										else{
											all_sel +=  global_voluntary_completion_data.translationsData.Present+' '+i+' '+global_voluntary_completion_data.translationsData.hours;
										}
										
									html +='</li>';
								}
								all_sel += '</ul>';
							all_sel += '</li>';

							all_sel += '<li class="dropdown-submenu ssrm"   >';
								if(global_voluntary_completion_data.PartnerAbsenceReason==0){
									all_sel += '<a class="test" tabindex="-1" href="javascript:;" onclick="voluntary_completion.all_set(3,0)">';
								}
								else{
									all_sel += '<a class="test" tabindex="-1" href="javascript:;">';
								}
								
									all_sel += '<i class="icon-remove"></i> '+ global_voluntary_completion_data.translationsData.Notpresent;
								all_sel += '</a>';
								if(global_voluntary_completion_data.PartnerAbsenceReason!=0){
									all_sel += '<ul class="dropdown-menu actions_d" style="margin-top:0;margin-left:0">';

										for (var j in global_voluntary_completion_data.PartnerAbsenceReason) { 
											var r = global_voluntary_completion_data.PartnerAbsenceReason[j].PartnerAbsenceReason;
											all_sel += '<li  onclick="voluntary_completion.all_set(3,'+r.id+')">';
												all_sel += r.name;
											all_sel +='</li>';
										}
									all_sel += '</ul>';
								}
							all_sel +='</li>';
						all_sel += '</ul>';
					all_sel += '</div>';
				}

			all_sel += '</li>';


				
				
	

			//if(status!=2){
				html += all_sel;
			//}
			
			$('.ssrm').remove();
			//$('.ssdropdown').append(all_sel);
		
			$('.border_class_'+id).attr('data-manager-count',manager_count);
			$('#schedules_customers_ol').html(html);
			//if(status!=2){
				$('.presence_check,.presence_check_all').uniform();
				voluntary_completion.bindAllPresence();
			//}
		}
		$('.span_status_open').show();
		$('.span_status_open_'+id).hide();
		
		$('.absence_hours').select2();
		$('.absence_reasons').select2({
			dropdownAutoWidth:true,
		});
		var textareahtml = '';
		if(html!=''){
			if(planned_work=='' || planned_work==null || planned_work==undefined){
				planned_work = '-';
			}
			if(work_description=='' || work_description==null || work_description==undefined){
				work_description = '';
			}
			if(status!=0){

				textareahtml+= '<div class="span12">';
					textareahtml += '<div class="text-center"><h3>'+global_voluntary_completion_data.translationsData.Workdescription+'</h3></div>';
					textareahtml+= '<form class="form-horizontal">';
						textareahtml+= '<div class="control-group">';
							textareahtml+= '<label class="span4">'+global_voluntary_completion_data.translationsData.Plannedwork+'</label>';
								textareahtml+= '<label class="span8 controls">';
									textareahtml+= planned_work;
								textareahtml+= '</label>';
						textareahtml+= '</div>';
						textareahtml+= '<div class="control-group">';
							textareahtml+= '<label class="span4">'+ global_voluntary_completion_data.translationsData.Workcompleted+'</label>';
								textareahtml+= '<div class="span8 controls">';
									textareahtml+= '<textarea  onkeyup="voluntary_completion.textAreaAdjust(this)"  disabled class="work_description m-wrap span12 adj-inp" id="work_description_'+schedule_id+'" placeholder="'+global_voluntary_completion_data.translationsData.Commentsontheworkthatwascarriedoutonthisdateandtask+'">'+work_description+'</textarea>';
								textareahtml+= '</div>';
						textareahtml+= '</div>';
					textareahtml+= '</form>';
				textareahtml+= '</div>';
			
			}
			else{
				
				textareahtml+= '<div class="span12">';
					textareahtml += '<div class="text-center"><h3>'+global_voluntary_completion_data.translationsData.Workdescription+'</h3></div>';
					textareahtml+= '<form class="form-horizontal">';
						textareahtml+= '<div class="control-group">';
							textareahtml+= '<label class="span4">'+global_voluntary_completion_data.translationsData.Plannedwork+'</label>';
								textareahtml+= '<div class="span8 controls" style=" word-wrap: break-word;word-break: break-all;">';
									textareahtml+= planned_work;
								textareahtml+= '</div>';
						textareahtml+= '</div>';
						textareahtml+= '<div class="control-group">';
							textareahtml+= '<label class="span4">'+ global_voluntary_completion_data.translationsData.Workcompleted+'</label>';
								textareahtml+= '<div class="span8 controls">';
									textareahtml+= '<textarea onkeyup="voluntary_completion.textAreaAdjust(this)" class="work_description m-wrap span12 adj-inp" id="work_description_'+schedule_id+'"  placeholder="'+global_voluntary_completion_data.translationsData.Commentsontheworkthatwascarriedoutonthisdateandtask+'">'+work_description+'</textarea>';
								textareahtml+= '</div>';
						textareahtml+= '</div>';
					textareahtml+= '</form>';
				textareahtml+= '</div>';
			}

			$('#completed_work_schedules .desc').html(textareahtml);
		}
		else{
			$('#completed_work_schedules .desc').html('');
		}
		if(status==0){
			if(loginType!='customer'){
				$('#voluntary_completion_save,#voluntary_completion_reset,#voluntary_completion_cancel,.actions_btn').show();
			}
			else{
				$('#voluntary_completion_save,#voluntary_completion_reset').show();
			}
		}
		else if(status==1){
			if(loginType!='customer'){
				$('.actions_btn').show();
				//$('#voluntary_completion_cancel').show();
			}
		}
		$('.dropdown-toggle').dropdown();
		$('.dropdown-submenu a.test').on("click", function(e){
		    $(this).next('ul').toggle();
		    e.stopPropagation();
		    e.preventDefault();
		});
		voluntary_completion.handleresize();		
	},
	bindAllPresence:function(){
		$('#select_all').click(function(){
				if($('#select_all').hasClass('none')){
					$('#select_all').removeClass('none');
					$('#select_all').html('<i class="icon-ok"></i>'+global_voluntary_completion_data.translationsData.Selectall);
					$('.presence_check_all').removeAttr('checked').trigger('change');
				}
				else{
					$('#select_all').addClass('none');
					$('#select_all').html('<i class="icon-remove"></i>'+global_voluntary_completion_data.translationsData.Deselectall);
					$('.presence_check_all').prop('checked',true).trigger('change');
				}


		});
		$('.presence_check_all').change(function(){
			if($('.presence_check_all:checked').length==1){
				$('.presence_check').prop('checked',true);
				$('.ssdropdown').show();
			}
			else{
				$('.presence_check').removeAttr('checked');
				$('.ssdropdown').hide();				
			}
			
			$.uniform.update();
		});
		$('.presence_check').change(function(){
			if($('.presence_check').length > $('.presence_check:checked').length){
				$('.presence_check_all').removeAttr('checked');
				$('#select_all').removeClass('none');
				$('.ssdropdown').hide();
				$('#select_all').html('<i class="icon-ok"></i>'+global_voluntary_completion_data.translationsData.Selectall);
			}
			else{
				$('.presence_check_all').prop('checked',true);
				$('#select_all').addClass('none');
				$('.ssdropdown').show();
				$('#select_all').html('<i class="icon-remove"></i>'+global_voluntary_completion_data.translationsData.Deselectall);
			}
		
			if($('.presence_check:checked').length > 0){
				
				$('.ssdropdown').show();
			}
			else{
				$('.ssdropdown').hide();
			}
				$.uniform.update();
			
		})
	},
	all_set:function(from,hours=0){
		if($('.presence_check:checked').length==0){
			var msg = global_voluntary_completion_data.translationsData.Pleaseselectatleastonecheckbox;
			showAlertMessage(msg,'error',global_voluntary_completion_data.translationsData.alertmessage);
			return;
		}

		if(from==1){
			$('.actions_menu').each(function(){
				var a = $(this).parent().parent().parent().find('.presence_check:checked').length
				if(a==1){
					$(this).find('li:first').trigger('click');
				}
				
			
			});
		}
		else if(from==2){
			$('.actions_menu').each(function(){
				var a = $(this).parent().parent().parent().find('.presence_check:checked').length
				if(a==1){
					 $(this).find('li:nth-child(2)').find('li[data-hours='+hours+']').trigger('click');
				}
				
				
			});
		}
		else if(from==3){
			$('.actions_menu').each(function(){
				
				var a = $(this).parent().parent().parent().find('.presence_check:checked').length;

				if(a==1){
					var as = $(this).find('li:nth-child(3)').find('li[data-absence='+hours+']').length;
					
					if(as!=0){
						$(this).find('li:nth-child(3)').find('li[data-absence='+hours+']').trigger('click');
					}
					else{
						$(this).find('li:nth-child(3)').find('a').trigger('click');
					}
					
				}
				
			});
		}
	},
	textAreaAdjust:function(that){
		that.style.height = "1px";
  		that.style.height = (25+that.scrollHeight)+"px";
  		var c = $('.port1').outerHeight(true);
		var d = $('.port3').outerHeight(true);
		var e = $('.header').outerHeight(true) + $('#content').outerHeight(true);

		if(c>d){
			var oh = parseInt(c) + parseInt(e);
			$('.page-content').css('min-height',oh+'px');
		
		}
		else if(d>c){
			var oh = parseInt(d) + parseInt(e);
			$('.page-content').css('min-height',oh+'px');
		}
		else{
			var oh = parseInt(c) + parseInt(e);
			$('.page-content').css('min-height',oh+'px');
		}
	},
	contactParticipant:function(customer_id,from,cust){
		
		if(from==1){
			show_dkmodal_for_customer_email(customer_id,cust.customer_name,cust.customer_email,cust.customer_number);
		}
		else if(from==2){
			///var to_number = cust.cp_code+cust.customer_cellphone;
			var to_number = cust.customer_cellphone;	
			//to_number = to_number.replace(cust.cp_code, '');
			
		
			show_dkmodal_for_customer_sms(customer_id,cust.customer_name,to_number,cust.customer_country,cust.cp_code,cust.cp_code,cust.customer_number);
			//sms
		}
		else if(from==3){
			var html = '';
			html += '<div class="modal-header">';
				html += '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>';
				html += '<h3>'+global_voluntary_completion_data.translationsData.Contactinformation+'</h3>';
			html += '</div>';

			html += '<div class="modal-body">';
				html += '<form class="form-horizontal" id="contact_info_form">';
				
			
				html += '<div class="control-group " style="margin-bottom:0">';;
					 html += '<label class="control-label">'+global_voluntary_completion_data.translationsData.Customernumber+'</label>';
					html += '<div class="controls">';				
						if(cust.customer_number!='' && cust.customer_number!=null && cust.customer_number!=undefined){
							html += '<span class="text bold">'+cust.customer_number+'</span>';
						}
						else{
							html += '<span class="text bold">-</span>';
						}
							
					html += '</div>';
				html += '</div>';
			

				html += '<div class="control-group" style="margin-bottom:0">';
					 html += '<label class="control-label">'+global_voluntary_completion_data.translationsData.Customername+'</label>';
					html += '<div class="controls">';				
						if(cust.customer_name!='' && cust.customer_name!=null && cust.customer_name!=undefined){
							html += '<span class="text bold">'+cust.customer_name+'</span>';
						}
						else{
							html += '<span class="text bold">-</span>';
						}
					html += '</div>';
				html += '</div>';

				html += '<div class="control-group" style="margin-bottom:0">';
					 html += '<label class="control-label">'+global_voluntary_completion_data.translationsData.Landline+'</label>';
					html += '<div class="controls">';				
						if(cust.format_phone!='' && cust.format_phone!=null && cust.format_phone!=undefined){
							html += '<span class="text bold">'+cust.format_phone+'</span>';
						}
						else{
							html += '<span class="text bold">-</span>';
						}
					html += '</div>';
				html += '</div>';

				html += '<div class="control-group" style="margin-bottom:0">';
					 html += '<label class="control-label">'+global_voluntary_completion_data.translationsData.Cellphone+'</label>';
					html += '<div class="controls">';				
						if(cust.format_cellphone!='' && cust.format_cellphone!=null && cust.format_cellphone!=undefined){
							html += '<span class="text bold">'+cust.format_cellphone+'</span>';
						}
						else{
							html += '<span class="text bold">-</span>';
						}
					html += '</div>';
				html += '</div>';

				html += '<div class="control-group" style="margin-bottom:0">';
					 html += '<label class="control-label">'+global_voluntary_completion_data.translationsData.Email+'</label>';
					html += '<div class="controls">';	
						if(cust.customer_cellphone!='' && cust.customer_email!=null && cust.customer_email!=undefined){
							html += '<span class="text bold">'+cust.customer_email+'</span>';
						}
						else{
							html += '<span class="text bold">-</span>';
						}
					html += '</div>';
				html += '</div>';


			html += '</form>';
			html += '</div>';
			html += '<div class="modal-footer">';
				html += '<div class="btn-group">';
					html += '<button data-dismiss="modal" class="btn btn_clear" type="button"><i class="icon-remove"></i> '+global_voluntary_completion_data.translationsData.Close+'</button>';
				html += '</div>';
			html += '</div>';
			$('#popups4').html(html);
			$('#popups4').modal('show');
		}
		else if(from==4){
			if($('.presence_check:checked').length==0){
		      var msg = global_voluntary_completion_data.translationsData.Pleaseselectatleastonecheckbox;
		      showAlertMessage(msg,'error',global_voluntary_completion_data.translationsData.alertmessage);
		      return;
		    }
			var d = [];
			$('.presence_check:checked').each(function(){
				var c_id = $(this).attr('data-customer-id');
				for(var j in all_cust_email_details){
					if(all_cust_email_details[j].id == c_id){
						d.push(all_cust_email_details[j]);
						break;
					}
				}
			});
			if(d.length==0){
		      var msg = global_voluntary_completion_data.translationsData.Noemailaddressavailable;
		      showAlertMessage(msg,'error',global_voluntary_completion_data.translationsData.alertmessage);
		      return;
		    }
			show_dkmodal_for_customer_email(null,null,null,null,null,null,null,d);
		}
		else if(from==5){
			if($('.presence_check:checked').length==0){
		      var msg = global_voluntary_completion_data.translationsData.Pleaseselectatleastonecheckbox;
		      showAlertMessage(msg,'error',global_voluntary_completion_data.translationsData.alertmessage);
		      return;
		    }
			var d = [];
			$('.presence_check:checked').each(function(){
				var c_id = $(this).attr('data-customer-id');
				for(var j in all_cust_sms_details){
					if(all_cust_sms_details[j].id == c_id){
						d.push({
							customer_id:all_cust_sms_details[j].id,
							customer_name:all_cust_sms_details[j].customer_name,
							customer_cellphone:all_cust_sms_details[j].cp_code+all_cust_sms_details[j].customer_cellphone,
							customer_country:all_cust_sms_details[j].customer_country,
							customer_number:all_cust_sms_details[j].customer_number,
							cp_code:all_cust_sms_details[j].cp_code,
						});
						break;
					}
				}
			});
			if(d.length==0){
		      var msg = global_voluntary_completion_data.translationsData.Nocellphoneavailable;
		      showAlertMessage(msg,'error',global_voluntary_completion_data.translationsData.alertmessage);
		      return;
		    }
			show_dkmodal_for_customer_sms(null,null,null,null,null,null,null,null,null,null,d);
			
		}
	},
	attendance:function(customer_id,status,that,v){
		
		if(status==1){
			$('#customer_present_'+customer_id).html(global_voluntary_completion_data.translationsData.Present+'<i class="icon-angle-down"></i>');
		}
		else if(status==2){
			var a = $(that).text();
			//$('#customer_present_'+customer_id).html(global_voluntary_completion_data.translationsData.Partiallypresent+'<i class="icon-angle-down"></i>');

			$('#absence_hours_'+customer_id).val(v).trigger('change');
			$('#customer_present_'+customer_id).html(a+'<i class="icon-angle-down"></i>');
			$('.dropdown').removeClass('open');
			voluntary_completion.saveTempData(customer_id,status);

		}
		else if(status==3){
			var a = $(that).text();
			//$('#customer_present_'+customer_id).html(global_voluntary_completion_data.translationsData.Notpresent+'<i class="icon-angle-down"></i>');
			$('#absence_reasons_'+customer_id).val(v).trigger('change');
			
			$('#customer_present_'+customer_id).html(a+'<i class="icon-angle-down"></i>');
			$('.dropdown').removeClass('open');
		}

		$('.dropdown').removeClass('open');
		voluntary_completion.saveTempData(customer_id,status);

		
	},
	saveTempData:function(customer_id,status){
		for(var j in attendance.customers){
			var d = attendance.customers[j];
			if(d.customer_id==customer_id){
				
				
				if(status==1){
					attendance.customers[j].status= 1;
					attendance.customers[j].hours = 0;
					attendance.customers[j].reason = 0;
				}
				else if(status==2){
					var sel_hours = $('#absence_hours_'+customer_id).val();
					attendance.customers[j].status= 2;
					attendance.customers[j].hours =sel_hours;
					attendance.customers[j].reason = 0;
				}
				else if(status==3){
					var orig_hours = 0;
					for(var k in global_voluntary_completion_data.PartnerVoluntarySchedules){
						var e =global_voluntary_completion_data.PartnerVoluntarySchedules[k].PartnerVoluntarySchedule;
						if(e.id==attendance.schedule_id){
							orig_hours = e.hours;
							break;
						}
					}
					var abs_res = $('#absence_reasons_'+customer_id).val();
					attendance.customers[j].status= 3;
					attendance.customers[j].hours =orig_hours;
					attendance.customers[j].reason = abs_res;

					
				}
				break;
			}
		}
	},
	save:function(){
		console.log(attendance.customers);
		for(var j in attendance.customers){
			var d = attendance.customers[j];
			if(d.status==0){
				showAlertMessage(global_voluntary_completion_data.translationsData.Pleaseselectstatusforallcustomers,global_voluntary_completion_data.translationsData.error,global_voluntary_completion_data.translationsData.alertmessage);
				return;
				break;
			}
			else{
				attendance.customers[j].skiphooks = true;
			}
		}

		var yes=function(){
			attendance.work_description = $('#work_description_'+attendance.schedule_id).val();
			//attendance.planned_work = $('#planned_work_'+attendance.schedule_id).val();
			var params = attendance;
			params.skiphooks = true;
			var total_params = {
				data:params,
				partner_id:partner_id,
				model:'partnerVoluntaryAllocations',
				action:'updateallocstatus',
				emitevent:'partnerVoluntaryAllocationsRegister'
			};

		socket.emit('crud', total_params);
		};
		var no = function(){

		};
		if(loginType!='customer'){
			yes();
		}
		else{
			var msg = global_voluntary_completion_data.translationsData.Theinformationisabouttobepermanentlystoredandcannotbechangedlateron+'.<br/>';
			msg +=  global_voluntary_completion_data.translationsData.Areyousureyouwouldliketoproceed+'?';
			showDeleteMessage(msg,global_voluntary_completion_data.translationsData.Confirmation,yes,no,'ui-dialog-blue',global_voluntary_completion_data.translationsData.Yes,global_voluntary_completion_data.translationsData.N);
			return;
		}
		
	},
	partnerVoluntaryAllocationsRegisterFun:function(data){
		if(data.error==null){
			console.log(data);
			data = data.success;
			voluntary_completion.generateScheduleListLi(data);
			voluntary_completion.getSchedules();
		}
	},
	partnerVoluntaryAllocationsEnabledit:function(data){
		hideProcessingImage();
		if(data.error==null){
			data = data.success;
			voluntary_completion.generateScheduleListLi(data);
			voluntary_completion.getSchedules();
		}
	},
	set:function(){

	},
	reset:function(){
		var orig_hours = 0;
		for(var k in global_voluntary_completion_data.PartnerVoluntarySchedules){
			var e =global_voluntary_completion_data.PartnerVoluntarySchedules[k].PartnerVoluntarySchedule;
			if(e.id==attendance.schedule_id){
				orig_hours = e.hours;
				break;
			}
		}
		for(var j in attendance.customers){
			attendance.customers[j].status = 0;
			attendance.customers[j].hours =orig_hours;
			attendance.customers[j].reason = 0;
		}
		
		$('.customer_present').html(global_voluntary_completion_data.translationsData.Presence+'<i class="icon-angle-down"></i>');
		$('.absence_hours_wrapper').hide();
		$('.absence_reason_wrapper').hide();
	},
	cancel:function(){
		var yes = function(){
			showProcessingImage('undefined');
			var params = {
				schedule_id:attendance.schedule_id,
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
				emitevent:'partnerVoluntaryAllocationsCancel'
			};
			var n_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				schedule_id:attendance.schedule_id
			}
			// var params = $.extend({}, doAjax_params_default);
			// params['url'] = APISERVER+'/api/Voluntries/processCancelScheduleNotifications.json';
			// params['data'] = n_params;
			// params['completeCallbackFunction'] = function (){
			// 	hideProcessingImage();
			// }
			// params['successCallbackFunction'] = function (complet_data){
			// }
			// doAjax(params);
		

			socket.emit('crud', total_params);
			// return;
		}
		var no = function(){
			hideProcessingImage();
		}
		var message = global_voluntary_completion_data.translationsData.Areyousureyouwanttocanceltheschedule+'?';
		showDeleteMessage(message,global_voluntary_completion_data.translationsData.Confirmation,yes,no,'ui-dialog-blue',global_voluntary_completion_data.translationsData.Yes,global_voluntary_completion_data.translationsData.No);
	},
	adjustz:function(that){


		if($(that).parent().hasClass('open')){
			$(that).parent().removeClass('open');
		}
		else{
			$(that).parent().addClass('open');
		}
		
	},
	partnerVoluntaryAllocationsCancel:function(data){
		hideProcessingImage();
		if(data.error==null){
			voluntary_completion.getSchedules();
			data = data.success;
		
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				
			}
			var qparmas = '?partner_id='+partner_id;
			qparmas += '&admin_id='+admin_id;
			qparmas += '&schedule_id='+data.id;
			qparmas += '&when_event=2';

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Voluntries/startProcessNotif.json'+qparmas;
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				
			};
			
			params['successCallbackFunction'] = function (complet_data){
			};

			doAjax(params);
			
			voluntary_completion.generateScheduleListLi(data);
		}
	},
	enableEdit:function(schedule_id){
		showProcessingImage('undefined');
		var params = {
			schedule_id:schedule_id,
			partner_id:partner_id,
			admin_id:admin_id,
			status:0,
			skiphooks:true,
		}
		var total_params = {
			data:params,
			partner_id:partner_id,
			model:'partnerVoluntaryAllocations',
			action:'updateschedulestatus',
			emitevent:'partnerVoluntaryAllocationsEnabledit'
		};
		attendance.schedule_id = schedule_id;
		socket.emit('crud', total_params);
	},
	generateScheduleListLi:function(res){
		var html = '';
		html += '<li class="dd-custom-item border_class border_class_'+res.id+'" data-id="'+res.id+'">';
			if(res.work_description==null || res.work_description==undefined){
				res.work_description = '';
			}
			if(res.planned_work==null || res.planned_work==undefined){
				res.planned_work = '';
			}
			html += '<div class="dd-custom-handle " onclick="voluntary_completion.getCustomers('+res.id+','+res.hours+','+res.status+',\''+res.work_description+'\',\''+res.planned_work+'\')">';
				html += '<p style="text-align:left;float:left;margin:0">';
					res.date = res.date.replace(/T.*Z/, '');
					html += convertDateIntoSiteFormat(res.date)+' '+res.name;
				html += '</p>';

				

				html += '<p style="text-align:right;float:right;margin:0" class="adj_right">';
					if(res.status==0){
						html += '<span class="span_status span_status_open span_status_open_'+res.id+'" style="display:none">'+global_voluntary_completion_data.translationsData.Show+'</span>';
					}
					else if(res.status==1){
						html += '<span class="span_status span_status_reg" >'+global_voluntary_completion_data.translationsData.Completed+'</span>';
					}
					else if(res.status==2){
						html += '<span class="span_status span_status_can" >'+global_voluntary_completion_data.translationsData.Cancelled+'</span>';
					}
				html += '</p>';

			html += '</div>';

			if((res.status==2 || res.status==1) && loginType!='customer'){
				html += '<div onclick="voluntary_completion.enableEdit('+res.id+')" class="span_status_edit_p">';
					html += '<p style="float:right;margin:0" ><span class="span_status span_status_edit">'+global_voluntary_completion_data.translationsData.Edit+'</span></p>';
				html += '</div>';
			}

		html += '</li>';
		if($('.border_class_'+res.id)[0]!=undefined){
			$('.border_class_'+res.id).after(html);
			$('.border_class_'+res.id)[0].remove();
			$('.span_status_edit_p').each(function(){
				$(this).css('width','');
				var w = $(this).width() / $(this).parent().width() * 100;
	   			w = parseInt(w) + 2;	
				var a = 100 - w;
				$(this).attr('style','width:'+w+'% !important');
				$(this).prev('div').css({
					'width':a+'%',
					'float':'left',
				});	
			});
		}
		if(attendance.schedule_id==res.id){
			voluntary_completion.getCustomers(res.id,res.hours,res.status,res.work_description,res.planned_work);
		}
	},
	show_report_modal:function(){
		var id = $('.selected_border').attr('data-id');
		var manager_count = $('.selected_border').attr('data-manager-count');
		if(checkNull(id)==''){
			alert('select schedule');return;
		}
		new_custom_popup('800','popups','generate_participant_listreport',{id:id,manager_count:manager_count});
	}
};
+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);
