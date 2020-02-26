if(boat_completion!=undefined){
	delete boat_completion;
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
var bc_dt;
var bc_td;

var all_cust_sms_details = [];
var all_cust_email_details = [];
var attendance = {};
var act_date = '';

var boat_completion = {
	start:function(){
		boat_completion.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','Boat storage','Completion','$dateotime','No event found','No customer found','Contact participant','Send email','Send SMS','Show contact information','$Included','$Excluded','Select all','Presence','Select event','Select all','Deselect all','Please select atleast one checkbox','Contact information','Customer number','Customer name','Landline','Cellphone','Email','Close','No email address available','No cellphone available','Register and complete','Reset','Please select status for all customers','$complete_event_msg','$are_you_sure','Confirmation','Yes','No','Success','$event_status_success','Completed','Cancelled','Edit','Cancel','$cancel_event_msg','Status','Events','Customers','Confirmation','Create invoice','Yes','No'],
		};
		if(loginType=='customer'){
			total_params.customer_id = session_customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getBoatstorageCompletion.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){

				bc_dt = complet_data.response.response;
				bc_td = complet_data.response.response.translationsData;
				
				boat_completion.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bc_dt.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bc_dt.translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		bc_dt.translationsData.dashboardurl = base_url+'dashboard/index';
		bc_dt.translationsData.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('boat_completion_template').innerHTML;
		var compiledRendered = Template7(template, bc_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0)
		hideProcessingImage();		
		boat_completion.bindEvents();
		after_main_page();
	},
	bindEvents:function(){
		var w = $(window).outerHeight(true) - $('.header').outerHeight(true) - $('.btn_group').outerHeight(true);

		$(window).scroll(function (){
			if("boat_completion" in window && typeof boat_completion.handleresize == 'function'){
				boat_completion.handleresize();
			}			
		});

		$(window).resize(function (){
			if("boat_completion" in window && typeof boat_completion.handleresize == 'function'){
				boat_completion.handleresize();
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
		

		var a = boat_completion.generateAndRenderEvents(bc_dt.boatstore_events,'first');

		// $('#schedules_customers_calendar').fullCalendar({
		// 	lang:lang,
		// 	events:dbevents,
		//     dayClick: function(date, jsEvent, view) {
		//     	boat_completion.getScheduleCustomersByDate(date);
		//     },
		// 	dayRender: function (date, element, view){
		// 		var date = new Date(date);
  //               var day = date.getDate().toString();
  //               if (day.length == 1){
  //                   day = 0 + day;
  //               }
  //               var year = date.getFullYear();
  //               var month = (date.getMonth() + 1).toString();
  //               if (month.length == 1){
  //                   month = 0 + month;
  //               }
  //               var dateStr = year + "-" + month + "-" + day ;

  //               // YourDates is Json array of your default dates

  //               for (var i = 0; i < dbevents.length; i++){
  //                	//here you campare calender dates to your default dates
  //                  	if ( dateStr.toString() == dbevents[i].start.toString() ){
  //                   	$('td.fc-day-number[data-date='+dateStr+']').css("color", "#fff"); 
  //                   	$('td.fc-day-number[data-date='+dateStr+']').css("opacity", "1"); 
  //                       $(element).css("background", dbevents[i].backgroundColor);
  //                       $(element).css("cursor", "pointer");
  //                   }
  //               }
		// 	}
		// });
		
		boat_completion.handleresize();
	},
	generateAndRenderEvents:function(data,first=''){
		// dbevents = [];
		// for(var j in data){
		// 	var pbe = data[j].pbe;
		// 	var ps = data[j][0];
		
		// 	var events = {
		// 		start:moment(pbe.start_datetime).format('YYYY-MM-DD'),
		// 	};
			
		// 	if(ps.total_boats == 0){
		// 		events.backgroundColor = '#35aa47';
		// 	}
		// 	else if(ps.incomplete_count==0){
		// 		events.backgroundColor = '#9F9F9F';
		// 	}
		// 	else{
		// 		events.backgroundColor = '#297CBE';
		// 	}
			
		// 	dbevents.push(events);
		// }

		// if(first==''){
		// 	$('#schedules_customers_calendar').fullCalendar('destroy');
		// 	$('#schedules_customers_calendar').fullCalendar({
		// 		lang:lang,
		// 		events:dbevents,
		// 	    dayClick: function(date, jsEvent, view) {
		// 	    	boat_completion.getScheduleCustomersByDate(date);
		// 	    },
		// 		dayRender: function (date, element, view){
		
		// 			var date = new Date(date);
	 //                var day = date.getDate().toString();
	 //                if (day.length == 1){
	 //                    day = 0 + day;
	 //                }
	 //                var year = date.getFullYear();
	 //                var month = (date.getMonth() + 1).toString();
	 //                if (month.length == 1){
	 //                    month = 0 + month;
	 //                }
	 //                var dateStr = year + "-" + month + "-" + day ;

	 //                // YourDates is Json array of your default dates

	 //                for (var i = 0; i < dbevents.length; i++){
	 //                 	//here you campare calender dates to your default dates
	 //                   	if ( dateStr.toString() == dbevents[i].start.toString() ){
	 //                    	$('td.fc-day-number[data-date='+dateStr+']').css("color", "#fff"); 
	 //                        $(element).css("background", dbevents[i].backgroundColor);
	 //                        $(element).css("cursor", "pointer");
	 //                    }
	 //                }
		// 		}
		// 	});
		// }
		// return dbevents;
	
		
		boat_completion.generateScheduleList(data);

	},
	handleresize:function(){
		App.fixContentHeight();
	},
	getScheduleCustomersByDate:function(date){
		var found = 0;
		act_date = date;
		for(var j in bc_dt.boatstore_events){
			var pbe = bc_dt.boatstore_events[j].pbe;
			var sd = moment(pbe.start_datetime).format('YYYY-MM-DD');
			
			if( sd == moment(date).format('YYYY-MM-DD') ){
				found = 1;
			}
		}
	
		if(found==0){
			boat_completion.generateScheduleList();
			return;
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			date:moment(date).format("YYYY-MM-DD")
		};

		if(loginType=='customer'){
			total_params.customer_id = session_customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getScheduleEventsByDate.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				boat_completion.generateScheduleList(complet_data.response.response.boatstore_events);
			}
			else if(complet_data.response.status == 'error'){
			}
		}
		showProcessingImage();
		doAjax(params);
		return;
	},
	generateScheduleList:function(data=[]){

		var html ='';
		for(var j in data){
			var pbe = data[j].pbe;

			
			html += `<li class="dd-custom-item border_class border_class_`+pbe.id+`" data-id="`+pbe.id+`" data-invoice-created="`+pbe.invoice_created+`"  onclick="boat_completion.getCustomers(`+pbe.id+`,event)">`;

				html += '<div class="dd-custom-handle " >';
					html += '<p style="text-align:left;float:left;margin:0">';

						var start_date = convertDateIntoSiteFormat(pbe.start_datetime);
						var start_time = moment(pbe.start_datetime).format('HH:mm');
						

						// var end_date = convertDateIntoSiteFormat(pbe.end_datetime);
						// var end_time = moment(pbe.end_datetime).format('HH:mm');

						var allstr = bc_td.$dateotime;
						allstr = allstr.replace('%date%',start_date).replace('%start_time%',start_time);
						//replace('%end_time%',end_time);

						html += allstr+ ' '+ pbe.name;
					html += '</p>';
				html += '</div>';
					
				var menuhtml = '';
				var menuhtml1 = '';
				
				
				if(checkNull(pbe.status) == 'comp'){
					menuhtml1 += '<span class="span_status span_status_reg" style="margin-left:2px">'+bc_td.Completed+'</span>';
				}
				else if(checkNull(pbe.status) == 'can'){
					menuhtml1 += '<span class="span_status span_status_can" style="margin-left:2px">'+bc_td.Cancelled+'</span>';
				}
				if(menuhtml1 != ''){
					menuhtml += '<p style="text-align:right;float:right;margin:0" class="adj_right">';
					menuhtml += menuhtml1;
					menuhtml += '</p>';
				}
				
				if((checkNull(pbe.status) == 'comp' || checkNull(pbe.status) == 'can') && loginType!='customer'){
					
						menuhtml += '<p style="float:right;margin:0"  ><span class="span_status span_status_edit">'+bc_td.Edit+'</span></p>';
				}
				if(menuhtml != ''){
					html += '<div class="span_status_edit_p" style="float:right">';
					html += menuhtml;
					html += '</div>';
				}				

			html += '</li>';
		}

		if(html==''){		
			$('.rmdis').hide();
			var empty_text;
			empty_text = '<li>'+bc_td.Nocustomerfound+'</li>';
			$('#schedules_customers_ol').html(empty_text);
			$('#completed_work_schedules .desc').html('');
			html = '<li>'+bc_td.Noeventfound+'</li>';
		}

		$('#completed_work_schedules_ol').html(html);

		// $('.span_status_edit_p').each(function(){
		// 	var w = $(this).find('p').width() / $(this).parent().width() * 100;
  //  			w = parseInt(w) + 2;	
		// 	var a = 100 - w;
		// 	$(this).attr('style','width:'+w+'% !important');
		// 	$(this).prev('div').css({
		// 		'width':a+'%',
		// 		'float':'left',
		// 	});	
		// });
		$('.dd-custom-item').each(function(){
			if($(this).find('.span_status_edit_p').length==0){
				$(this).find('.dd-custom-handle ').css('width','100%')
			}
		});	

		if(data.length==1){
			var ress = data[0].pbe;
			boat_completion.getCustomers(ress.id);
		}
		else{
			var empty_text;
			empty_text = '<li>'+bc_td.Selectevent+'</li>';
			$('#schedules_customers_ol').html(empty_text);
			$('#work_description_wrapper').html(bc_td.Selectevent);
		}
		boat_completion.handleresize();
	},
	generateScheduleListLi:function(pbe){

		var html = '';
		
			//var pbe = data[j].pbe;

			html += `<li class="dd-custom-item border_class border_class_`+pbe.id+`" data-id="`+pbe.id+`" data-invoice-created="`+pbe.invoice_created+`"  onclick="boat_completion.getCustomers(`+pbe.id+`,event)">`;

				html += '<div class="dd-custom-handle ">';
					html += '<p style="text-align:left;float:left;margin:0">';

						var start_date = convertDateIntoSiteFormat(pbe.start_datetime);
						var start_time = moment(pbe.start_datetime).format('HH:mm');
						

						var end_date = convertDateIntoSiteFormat(pbe.end_datetime);
						var end_time = moment(pbe.end_datetime).format('HH:mm');

						var allstr = bc_td.$dateotime;
						allstr = allstr.replace('%date%',start_date).replace('%start_time%',start_time).replace('%end_time%',end_time);

						html += allstr + ' ' + pbe.name;
					html += '</p>';
				html += '</div>';
					
				var menuhtml = '';
				var menuhtml1 = '';
				
				
					
					if(checkNull(pbe.status) == 'comp'){
						menuhtml1 += '<span class="span_status span_status_reg" style="margin-left:2px">'+bc_td.Completed+'</span>';
					}
					else if(checkNull(pbe.status) == 'can'){
						menuhtml1 += '<span class="span_status span_status_can" style="margin-left:2px">'+bc_td.Cancelled+'</span>';
					}
					if(menuhtml1 != ''){
						menuhtml += '<p style="text-align:right;float:right;margin:0" class="adj_right">';
						menuhtml += menuhtml1;
						menuhtml += '</p>';
					}
					

					if((checkNull(pbe.status) == 'comp' || checkNull(pbe.status) == 'can') && loginType!='customer'){
						
						menuhtml += '<p style="float:right;margin:0"><span class="span_status span_status_edit">'+bc_td.Edit+'</span></p>';					
					}
					if(menuhtml != ''){
						html += '<div  class="span_status_edit_p" style="float:right">';
						html += menuhtml;
						html += '</div>';
					}
					
				

			html += '</li>';
		
		if($('.border_class_'+pbe.id)[0]!=undefined){
			$('.border_class_'+pbe.id).after(html);
			$('.border_class_'+pbe.id)[0].remove();
			// $('.span_status_edit_p').each(function(){
			// 	$(this).css('width','');
			// 	var w = $(this).width() / $(this).parent().width() * 100;
	  //  			w = parseInt(w) + 2;	
			// 	var a = 100 - w;
			// 	$(this).attr('style','width:'+w+'% !important');
			// 	$(this).prev('div').css({
			// 		'width':a+'%',
			// 		'float':'left',
			// 	});	
			// });
		}

		var a = false;
		if(attendance.partner_boatstore_event_id == pbe.id){
			boat_completion.getCustomers(pbe.id);
			a = true;
		}
		
		boat_completion.handleresize();
		return a;
	},
	getCustomers:function(id,$event){
		if(checkNull($event) != '' && $($event.target).hasClass('span_status_edit')){
			boat_completion.enableEdit(id);
			return;
		}
		$('.rmdis').attr('disabled','disabled');
		$('.rmdis').hide();
		attendance.partner_boatstore_event_id = id;
		$('.border_class').removeClass('selected_border');
		$('.border_class_'+id).addClass('selected_border');
		var loader = '<li class="dd-custom-item" style="text-align:center"><img src="'+bc_dt.translationsData.loaderurl+'"></li>';
		$('#schedules_customers_ol').html(loader);


		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			partner_boatstore_event_id:id,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getEventCustomers.json'
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				boat_completion.generateCustomersList(complet_data.response.response.customers,complet_data.response.response.boatstore_event);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bc_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bc_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	generateCustomersList:function(data,event){
		attendance.customers = [];
		var html ='';
		if(data.length!=0){
			setTimeout(function(){
				$('.rmdis').removeAttr('disabled');
			},1);
		}
		var event_id;
		var customer_email_cnt = 0;
		var customer_sms_cnt = 0;
		all_cust_sms_details = [];
		all_cust_email_details = [];

		var id = event.PartnerBoatstoreEvent.id;
		var status = event.PartnerBoatstoreEvent.status;

		for(var j in data){
			var pba = data[j].PartnerBoatstoreAllocation;
			var cust = data[j].Customer;
			var country = data[j].Country;
			var ps = data[j].PartnerSlip;

			event_id = pba.partner_boatstore_event_id;

			var obj = {
				customer_slip_id:pba.customer_slip_id,
				status:pba.status,
				id:pba.id,
			};
			if(checkNull(status) == '' && checkNull(obj.status) == ''){
				obj.status = 'i';
			}

			attendance.customers.push(obj);

			html += '<li class="dd-custom-item dd-custom-item-customer">';
				html += '<ul class="customer_li">';
				
						html += '<li class="customer_li_presencecheck">';
						if(status == ''){
							html += '<input type="checkbox" data-customer-id="'+cust.id+'" data-slip-id="'+pba.customer_slip_id+'" class="presence_check presence_check_'+pba.customer_slip_id+'">';
						}
					html += '</li>';


					html += '<li class="customer_li_name">';
						html += cust.customer_name + '('+ps.slip_name+')';
					html += '</li>';


					html += '<li class="customer_li_action">';
						

						
						html += '<div style="display:inline-block;float:right" class="dropdown">';
							if(status == ''){
								html += '<button id="customer_contact_'+cust.id+'" style="" type="button" class="btn mini blue-stripe dropdown-toggle" data-toggle="dropdown" >'; 
									html += bc_td.Contactparticipant;
									html += '<i class="icon-angle-down"></i>';
								html += '</button>';
							}

							html += '<ul class="dropdown-menu actions_c">';
								cust.cp_code = '+'+country.phone_initial;
								var custa = JSON.stringify(cust);
								
								custa = custa.replace(/"/g , "'");
								if(checkNull(cust.customer_email) !=''){
									customer_email_cnt++;
									cust['customer_slip_id'] = pba.customer_slip_id;
									all_cust_email_details.push(cust);
									html += '<li onclick="boat_completion.contactParticipant('+cust.id+',1,'+custa+')">';
										html += '<i class="icon-envelope"></i> '+bc_td.Sendemail;
									html +='</li>';
								}
								
								if( checkNull(cust.customer_cellphone) !=''){
									customer_sms_cnt++;
									cust['customer_slip_id'] = pba.customer_slip_id;
									all_cust_sms_details.push(cust);
									html += '<li onclick="boat_completion.contactParticipant('+cust.id+',2,'+custa+')">';
										html += '<i class="icon-comment"></i> '+bc_td.SendSMS;
									html +='</li>';
								}
								

								html += '<li onclick="boat_completion.contactParticipant('+cust.id+',3,'+custa+')">';
									html += '<i class="icon-info"></i> '+ bc_td.Showcontactinformation;
								html +='</li>';

							html += '</ul>';

						html += '</div>';

						html += '<div style="display:inline-block;float:right" class="dropdown">';
							
						var statusz = '';
						var classname = 'blue-stripe';
						if(obj.status=='i'){
							statusz += bc_td.$Included;
							classname = 'green-stripe';
						}
						else if(obj.status=='e'){
							statusz += bc_td.$Excluded;
							classname = 'red-stripe';
						}
						else{
							statusz += bc_td.Status;
							classname = 'blue-stripe';
						}

						html += '<button id="customer_present_'+pba.customer_slip_id+'" style="" type="button" class="btn mini '+classname+' dropdown-toggle customer_present" data-toggle="dropdown" >'+statusz;
							
							if(checkNull(status) == ''){
								html += '<i class="icon-angle-down"></i>';
							}
						html += '</button>';


						if(checkNull(status) == ''){

							html += '<ul class="dropdown-menu actions_c actions_menu">';
								html += `<li onclick="boat_completion.attendance(`+pba.customer_slip_id+`,'i',this)">`;
									html += '<i class="icon-ok"></i> '+bc_td.$Included;
								html +='</li>';

								html += `<li onclick="boat_completion.attendance(`+pba.customer_slip_id+`,'e',this)">`;
									html += '<i class="icon-remove"></i> '+bc_td.$Excluded;
								html +='</li>';
									
							html += '</ul>';
						}
						html += '</div>';
					html += '</li>';
				html += '</ul>';
			html += '</li>';
		}

		var empty_text;
		if(html==''){		
			empty_text = '<li>'+bc_td.Nocustomerfound+'</li>';
			$('#schedules_customers_ol').html(empty_text);
		}
		else{

			var all_sel = '<li class="dd-custom-item-customer" style="padding:3px">';
				all_sel += '<input style="display:none" type="checkbox" class="presence_check_all">';
				if(checkNull(status) == ''){
					all_sel += '<button class="btn blue btn-outline" id="select_all"><i class="icon-ok"></i>'+bc_td.Selectall+'</button>';
				}

				if(checkNull(status) == ''){	
					if(customer_sms_cnt!=0 && customer_email_cnt!=0){
						all_sel += '<div style="display:none;float:right" class="dropdown ssdropdown">';
							all_sel += '<button data-toggle="dropdown" style="" class="rmdis btn blue dropdown-toggle btn-outline" id="boat_completion_set" onclick="boat_completion.set()">'+bc_td.Contactparticipant+'<i class="icon-angle-down"></i></button>';
							all_sel += '<ul class="dropdown-menu actions_c">';

								if(customer_email_cnt!=0){
									all_sel += '<li onclick="boat_completion.contactParticipant(0,4,0)">';
										all_sel += '<i class="icon-envelope"></i> '+bc_td.Sendemail;
									all_sel +='</li>';
								}
								if(customer_sms_cnt!=0){
									all_sel += '<li onclick="boat_completion.contactParticipant(0,5,0)">';
										all_sel += '<i class="icon-comment"></i> '+bc_td.SendSMS;
									all_sel +='</li>';
								}

							all_sel += '</ul>';
						all_sel += '</div>';
					}
					
					all_sel += '<div style="display:none;float:right;margin-right:2px" class="dropdown ssdropdown">';
						all_sel += '<button data-toggle="dropdown" style="" class="rmdis btn blue dropdown-toggle btn-outline" id="boat_completion_set" onclick="boat_completion.set()">'+bc_td.Status+'<i class="icon-angle-down"></i></button>';
						all_sel += '<ul class="dropdown-menu actions_c">';

							all_sel += `<li class="ssrm" onclick="boat_completion.all_set('i')"><i class="icon-ok"></i> `+bc_td.$Included+`</li>`;

							all_sel += `<li class="ssrm" onclick="boat_completion.all_set('e')"><i class="icon-remove"></i> `+bc_td.$Excluded+`</li>`;
							
						
						all_sel += '</ul>';
					all_sel += '</div>';
				}

			all_sel += '</li>';

		
				html += all_sel;
	
			$('.ssrm').remove();
			$('#schedules_customers_ol').html(html);
		
			$('.presence_check,.presence_check_all').uniform();
			boat_completion.bindAllPresence();

			if(checkNull(status) == ''){
				$('#boat_completion_save,#boat_completion_reset,#boat_completion_cancel,.actions_btn').show();				
				$('#boat_completion_save,#boat_completion_reset').show();
				
			}
		}
	},
	bindAllPresence:function(){
		$('.dropdown-toggle').dropdown();

		$('#select_all').click(function(){
			if($('#select_all').hasClass('none')){
				$('#select_all').removeClass('none');
				$('#select_all').html('<i class="icon-ok"></i>'+bc_td.Selectall);
				$('.presence_check_all').removeAttr('checked').trigger('change');
			}
			else{
				$('#select_all').addClass('none');
				$('#select_all').html('<i class="icon-remove"></i>'+bc_td.Deselectall);
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
				$('#select_all').html('<i class="icon-ok"></i>'+bc_td.Selectall);
			}
			else{
				$('.presence_check_all').prop('checked',true);
				$('#select_all').addClass('none');
				$('.ssdropdown').show();
				$('#select_all').html('<i class="icon-remove"></i>'+bc_td.Deselectall);
			}
		
			if($('.presence_check:checked').length > 0){
				$('.ssdropdown').show();
			}
			else{
				$('.ssdropdown').hide();
			}
			$.uniform.update();
		});
	},
	set:function(){

	},
	all_set:function(from){
		if($('.presence_check:checked').length==0){
			var msg = bc_td.Pleaseselectatleastonecheckbox;
			showAlertMessage(msg,'error',bc_td.alertmessage);
			return;
		}

		$('.actions_menu').each(function(){
			var a = $(this).parent().parent().parent().find('.presence_check:checked').length
			if(a==1){
				if(from == 'i'){
					$(this).find('li:first').trigger('click');
				}
				else if(from == 'e'){
					$(this).find('li:nth-child(2)').trigger('click');
				}				
			}
		});		
	},
	attendance:function(cust_slip_id,status,that){
		if(status=='i'){
			$('#customer_present_'+cust_slip_id).html(bc_td.$Included+'<i class="icon-angle-down"></i>');
			$('#customer_present_'+cust_slip_id).removeClass('red-stripe').addClass('green-stripe');
		}
		else if(status == 'e'){
			$('#customer_present_'+cust_slip_id).html(bc_td.$Excluded+'<i class="icon-angle-down"></i>');
			$('#customer_present_'+cust_slip_id).removeClass('green-stripe').addClass('red-stripe');
		}
		boat_completion.saveTempData(cust_slip_id,status);
	},
	saveTempData:function(cust_slip_id,status){
		for(var j in attendance.customers){
			var d = attendance.customers[j];
			if(d.customer_slip_id == cust_slip_id){
				attendance.customers[j].status = status;
			}
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
			to_number = cust.cp_code+to_number;
		
			show_dkmodal_for_customer_sms(customer_id,cust.customer_name,to_number,cust.customer_country,null,cust.cp_code,cust.customer_number);
			//sms
		}
		else if(from==3){
			var html = '';
			html += '<div class="modal-header">';
				html += '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>';
				html += '<h3>'+bc_td.Contactinformation+'</h3>';
			html += '</div>';

			html += '<div class="modal-body">';
				html += '<form class="form-horizontal" id="contact_info_form">';
				
			
				html += '<div class="control-group " style="margin-bottom:0">';;
					 html += '<label class="control-label">'+bc_td.Customernumber+'</label>';
					html += '<div class="controls">';				
						if(checkNull(cust.customer_number) !=''){
							html += '<span class="text bold">'+cust.customer_number+'</span>';
						}
						else{
							html += '<span class="text bold">-</span>';
						}
							
					html += '</div>';
				html += '</div>';
			

				html += '<div class="control-group" style="margin-bottom:0">';
					 html += '<label class="control-label">'+bc_td.Customername+'</label>';
					html += '<div class="controls">';				
						if(checkNull(cust.customer_name) !='' ){
							html += '<span class="text bold">'+cust.customer_name+'</span>';
						}
						else{
							html += '<span class="text bold">-</span>';
						}
					html += '</div>';
				html += '</div>';

				html += '<div class="control-group" style="margin-bottom:0">';
					 html += '<label class="control-label">'+bc_td.Landline+'</label>';
					html += '<div class="controls">';				
						if(checkNull(cust.format_phone)!='' ){
							html += '<span class="text bold">'+cust.format_phone+'</span>';
						}
						else{
							html += '<span class="text bold">-</span>';
						}
					html += '</div>';
				html += '</div>';

				html += '<div class="control-group" style="margin-bottom:0">';
					 html += '<label class="control-label">'+bc_td.Cellphone+'</label>';
					html += '<div class="controls">';				
						if(checkNull(cust.format_cellphone) !=''){
							html += '<span class="text bold">'+cust.format_cellphone+'</span>';
						}
						else{
							html += '<span class="text bold">-</span>';
						}
					html += '</div>';
				html += '</div>';

				html += '<div class="control-group" style="margin-bottom:0">';
					 html += '<label class="control-label">'+bc_td.Email+'</label>';
					html += '<div class="controls">';	
						if(checkNull(cust.customer_email) != ''){
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
					html += '<button data-dismiss="modal" class="btn btn_clear" type="button"><i class="icon-remove"></i> '+bc_td.Close+'</button>';
				html += '</div>';
			html += '</div>';
			$('#popups4').html(html);
			$('#popups4').modal('show');
		}
		else if(from==4){
			if($('.presence_check:checked').length==0){
		      var msg = bc_td.Pleaseselectatleastonecheckbox;
		      showAlertMessage(msg,'error',bc_td.alertmessage);
		      return;
		    }
			var d = [];
			$('.presence_check:checked').each(function(){
				var cust_slip_id = $(this).attr('data-slip-id');
				for(var j in all_cust_email_details){
					if(all_cust_email_details[j].customer_slip_id == cust_slip_id){
						d.push(all_cust_email_details[j]);
						break;
					}
				}
			});
			if(d.length==0){
		      var msg = bc_td.Noemailaddressavailable;
		      showAlertMessage(msg,'error',bc_td.alertmessage);
		      return;
		    }
			show_dkmodal_for_customer_email(null,null,null,null,null,null,null,d);
		}
		else if(from==5){
			if($('.presence_check:checked').length==0){
		      var msg = bc_td.Pleaseselectatleastonecheckbox;
		      showAlertMessage(msg,'error',bc_td.alertmessage);
		      return;
		    }
			var d = [];
			$('.presence_check:checked').each(function(){
				var cust_slip_id = $(this).attr('data-slip-id');
				for(var j in all_cust_sms_details){
					if(all_cust_sms_details[j].customer_slip_id == cust_slip_id){
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
		      var msg = bc_td.Nocellphoneavailable;
		      showAlertMessage(msg,'error',bc_td.alertmessage);
		      return;
		    }
			show_dkmodal_for_customer_sms(null,null,null,null,null,null,null,null,null,null,d);
			
		}
	},
	reset:function(){
		for(var j in attendance.customers){
			attendance.customers[j].status = '';
		}
		$('.customer_present').html(bc_td.Status+'<i class="icon-angle-down"></i>');
	},
	enableEdit:function(partner_boatstore_event_id){
		showProcessingImage('undefined');
		var params = {
			partner_boatstore_event_id:partner_boatstore_event_id,
			partner_id:partner_id,
			admin_id:admin_id,
			status:'',
		}
		var total_params = {
			data:params,
			partner_id:partner_id,
			model:'partnerBoatstoreEvents',
			action:'updatestatus',
			emitevent:'partnerBoatstoreEventsEnableedit'
		};

		socket.once('partnerBoatstoreEventsEnableedit',function(data){
			hideProcessingImage();
			if(data.error == null){
				// boat_completion.generateScheduleListLi(data.success);
				// boat_completion.getCustomers(data.success.id);
			}
			
		});
		attendance = {};
		attendance.partner_boatstore_event_id = partner_boatstore_event_id;
		socket.emit('crud', total_params);
	},
	save:function(){
		for(var j in attendance.customers){
			var d = attendance.customers[j];
			if(checkNull(d.status)==''){
				showAlertMessage(bc_td.Pleaseselectstatusforallcustomers,'error',bc_td.alertmessage);
				return;
				break;
			}
			else{
				attendance.customers[j].status = checkNull(d.status);
			}
		}
		var no = function(){};

		var yes=function(create_invoice=0){
			var params = attendance;

			var total_params = {
				data:params,
				partner_id:partner_id,
				model:'partnerBoatstoreAllocations',
				action:'addupdatestatus',
				emitevent:'partnerBoatstoreAllocationsRegister',
				emithis:{create_invoice:create_invoice},
			};
			console.log('total_params',total_params);
			socket.once('partnerBoatstoreAllocationsRegister',function(data){
				if(data.error == null){
					//call_toastr('success',bc_td.Success,bc_td[data.success.msg]);
					boat_completion.processEndNotification(params.partner_boatstore_event_id,'on_complete',data.success.emithis);
				}
			});
			socket.emit('crud', total_params);
		};

		var msg = bc_td.$complete_event_msg+'<br/>';
		msg +=  bc_td.$are_you_sure;
		
		var current_event = {};
		for(var j in bc_dt.boatstore_events){
			if(bc_dt.boatstore_events[j]['pbe']['id'] == attendance.partner_boatstore_event_id){
				current_event = bc_dt.boatstore_events[j];
				break;
			}
		}

		var bill_prod = 'n';
		var invoice_created = $('#completed_work_schedules_ol li[data-id="'+attendance.partner_boatstore_event_id+'"]').attr('data-invoice-created');
		if(invoice_created == 'y'){
			bill_prod = 'n';
		}
		else if(current_event['pbe']['type'] == 'up' && checkNull(bc_dt.partnerSetting.boat_product_up) != '' && checkNull(bc_dt.partnerSetting.boat_product_up) != 0){
			bill_prod = 'y';
		}
		else if( current_event['pbe']['type'] == 'out' && checkNull(bc_dt.partnerSetting.boat_product_out) != '' && checkNull(bc_dt.partnerSetting.boat_product_out) != 0){
			bill_prod = 'y';
		}
		
		if(bill_prod == 'n'){
			showDeleteMessage(msg,bc_td.Confirmation,yes,no,'ui-dialog-blue',bc_td.Yes,bc_td.No,'green');
		}
		else{
			if(!$('#create_boat_invoice').hasClass('has-switch')){
				$('#create_boat_invoice').bootstrapSwitch();
			}

			$('#complete_boat_event').off().click(function(){
				var create_invoice = $('#create_boat_invoice').bootstrapSwitch('status');
				create_invoice = (create_invoice)?1:0;
				yes(create_invoice);
			});
			$('#create_boat_invoice').bootstrapSwitch('setState',true);
			$('#boat_completion_popup').modal('show');
		}
		
		return;
	},
	listenForData:function(){
		socket.off('partnerBoatstoreAllocationsRegister');
		socket.on('partnerBoatstoreAllocationsRegister',boat_completion.alloc_register);

		socket.off('partnerBoatstoreEventsCan');
		socket.on('partnerBoatstoreEventsCan',boat_completion.partnerBoatstoreEventsCan);

		socket.off('partnerBoatstoreEventsEnableedit');
		socket.on('partnerBoatstoreEventsEnableedit',boat_completion.partnerBoatstoreEventsEnableedit);
	},
	alloc_register:function(data){
		if(data.error == null){
			data = data.success;
			boat_completion.generateScheduleListLi(data.data);
			if(attendance.partner_boatstore_event_id == data.data.id){
				boat_completion.getCustomers(data.data.id);
			}
		}
	},
	clearScreen:function(){
		$('.border_class').removeClass('selected_border');
		$('.rmdis').hide();
		$('#schedules_customers_ol').html('<li>'+bc_td.Selectevent+'</li>');
	},
	cancel:function(){
		var yes = function(){
			showProcessingImage('undefined');
			var params = {
				partner_boatstore_event_id:attendance.partner_boatstore_event_id,
				partner_id:partner_id,
				admin_id:admin_id,
				status:'can',
			}
			var total_params = {
				data:params,
				partner_id:partner_id,
				model:'partnerBoatstoreEvents',
				action:'updatestatus',
				emitevent:'partnerBoatstoreEventsCan'
			};

			socket.once('partnerBoatstoreEventsCan',function(data){
				//hideProcessingImage();
				if(data.error == null){
					boat_completion.processEndNotification(params.partner_boatstore_event_id,'on_cancel');
					//call_toastr('success',bc_td.Success,bc_td.$event_status_success);
				}				
			});

			socket.emit('crud', total_params);
		};

		var no = function(){};

		var msg = bc_td.$cancel_event_msg+'<br/>';
		msg +=  bc_td.$are_you_sure;
		
		showDeleteMessage(msg,bc_td.Confirmation,yes,no,'ui-dialog-blue',bc_td.Yes,bc_td.No,'green');
		return;
	},
	processEndNotification:function(event_id,event_type,data){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			event_id:event_id,
			event_type:event_type,
			create_invoice:data.create_invoice
		};
		if(loginType=='customer'){
			total_params.customer_id = session_customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/processonend.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				try{
					for(var j in complet_data.response.response.res.event_ids){
						var event_id = complet_data.response.response.res.event_ids[j];
						$('#completed_work_schedules_ol li[data-id="'+event_id+'"]').attr('data-invoice-created','y');
					}
				}
				catch(e){

				}
				call_toastr('success',bc_td.Success,complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bc_dt.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bc_dt.translationsData.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	partnerBoatstoreEventsCan:function(data){
		if(data.error == null){
			var a = boat_completion.generateScheduleListLi(data.success);
			if(attendance.partner_boatstore_event_id == data.success.id){
				if(!a){
					boat_completion.getCustomers(data.success.id);
				}				
			}
		}
	},
	partnerBoatstoreEventsEnableedit:function(data){

		if(data.error == null){
			var a = boat_completion.generateScheduleListLi(data.success);
			if(attendance.partner_boatstore_event_id == data.success.id){
				if(!a){
					boat_completion.getCustomers(data.success.id);
				}
			}
		}
	}

	

};
