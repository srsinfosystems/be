if(voluntary_allocation!=undefined){
	delete voluntary_allocation;
}
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var global_voluntary_allocation_data;
var global_voluntary_allocation_customers;
var global_all_voluntary_allocation_customers;
var global_all_customers_by_customer_id = {};
var global_sorted_voluntary_allocation_customers;
var schedules_customers = {};
var scratchpad_customers = [];
var switch_save = [];
var current_schedules;
var thism = [];
var voluntary_allocation = {
	start:function(){
		voluntary_allocation.listenForData();
		var month = moment().month();
		month = month + 1;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			month:month,
			year:moment().year(),
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','Voluntary work','Allocation','alert message','Search','Customers','Customer already exists in the schedule','Name','Start time','Duration','hours','Date','Number of customers','No customers available','Save','No schedules found','success','Success','Allocations saved successfully','Scratchpad','Actions','Add new schedule','Create work schedule','Send notifications','At least one manager required','Only one manager required','Type','alert message','Responsible','Participant','Date and time','oaclock','hour','This month','Notification sent successfully','Participant saved','Action cannot be carried out','Email notification sent','SMS notification sent','Action pending','If you navigate away from this page','items in the scratch pad will be removed','Proceed','Cancel','Confirmation'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getVoluntaryAllocation.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_voluntary_allocation_data = complet_data.response.response;
				voluntary_allocation.createHtml(complet_data.response.response);
				voluntary_allocation.getCustomers();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_voluntary_allocation_data.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_voluntary_allocation_data.translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		
		return;
	},
	getCustomers:function(){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','Voluntary work','Allocation','alert message'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getVoluntaryCustomers.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
		}
		params['successCallbackFunction'] = function (complet_data){
	
			if(complet_data.response.status == 'success'){
				global_voluntary_allocation_customers = complet_data.response.response;
				global_all_voluntary_allocation_customers = global_voluntary_allocation_customers.customers;
				global_sorted_voluntary_allocation_customers = global_voluntary_allocation_customers.customers;
				voluntary_allocation.customersHtml();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_voluntary_allocation_data.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_voluntary_allocation_data.translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		global_voluntary_allocation_data.translationsData.dashboardurl = base_url+'dashboard/index';
		global_voluntary_allocation_data.translationsData.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('voluntary_allocation_template').innerHTML;
		var compiledRendered = Template7(template, global_voluntary_allocation_data);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		voluntary_allocation.bindEvents();
	},
	bindEvents:function(){
			$('.dropdown-toggle').dropdown();
		 $('.send_notifications').uniform();
		$('#customers_search').keyup(function(){
			var search = $('#customers_search').val();
			
			if(search!='' && search!=null && search!=undefined){
				voluntary_allocation.doCustomerSearch(search,global_sorted_voluntary_allocation_customers);
			}
			else{
				voluntary_allocation.customersHtml();
			}
			
		});
		$('#schedule_calendar').fullCalendar({
			contentHeight:0,
			locale:lang,
			lang:lang,
			buttonText:{
				today: global_voluntary_allocation_data.translationsData.Thismonth ,
			},			 
			header:{
               right: 'prev,next,today',
               center: 'title',
               left: '',
            },
		});
		
		$('.nw-page-toolbar').prepend('<li class="btn-group"><button id="voluntary_allocation_save" onclick="voluntary_allocation.save()" style="display:none" class="dropdown-toggle btn blue"><i class="fa fa-check" style="font-size: 1em;"></i> '+global_voluntary_allocation_data.translationsData.Sendnotifications+'</button></li>');
		
		$('#schedule_calendar').on('click', 'button.fc-prev-button', function() {
			var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
			var month = moment(date).month();
			month = month + 1;
			var year = moment(date).year();
			voluntary_allocation.getSchedulesByDate(month,year);
			
			$('#schedule_calendar button.fc-today-button').click(function(){
				for (var i = 0; i < thism.length; i++) {
				  clearTimeout(thism[i]);
				}
				thism = [];	
				thism.push(
			        setTimeout(function(){
		         		var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
						var month = moment(date).month();
						month = month + 1;
						var year = moment(date).year();
		         		voluntary_allocation.getSchedulesByDate(month,year);	
		        }, 10));
			});

		});

		$('#schedule_calendar').on('click', 'button.fc-next-button', function() {
			var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
			var month = moment(date).month();
			month = month + 1;
			var year = moment(date).year();
			voluntary_allocation.getSchedulesByDate(month,year);

			$('#schedule_calendar button.fc-today-button').click(function(){
				
				for (var i = 0; i < thism.length; i++) {
				  clearTimeout(thism[i]);
				}
				thism = [];	
				thism.push(
			        setTimeout(function(){
			        	var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
						var month = moment(date).month();
						month = month + 1;
						var year = moment(date).year();
		         		voluntary_allocation.getSchedulesByDate(month,year);	
		        }, 10));
			});
		});


		

		voluntary_allocation.renderSchedules();

		var header_height=$(".header").height();
		var baseTop = $("#customer_widget").offset().top - header_height ;
		var baseTop1 = $("#schedule_calendar").offset().top - header_height ;
		 $(window).scroll(function (){
		 });
		// $(window).scroll(function (){
		// 	console.log('a');
		// 	var top = $(window).scrollTop();
		// 	baseTop = $('#customer_widget').offset().top - header_height ;
		// 	baseTop1 = $("#schedule_calendar").offset().top - header_height;
			
		// 	if($('body').width()>767){
		// 		if(top==0 && baseTop==0){
		// 			var a = $('.dash_header').height() + $('.header').height();
		// 			$('#customer_widget').css({
		// 				"position": "fixed",
		// 				"width":$('#customer_widget').width()+'px',
		// 				"top": a
		// 			});
		// 			setTimeout(function(){
		// 				$('#customer_widget').css({"position":""});
		// 			},200);
		// 		}
		// 		else if(top==0){
		// 			$('#customer_widget').css({
		// 				"position": "",
		// 				"width":"",
		// 				"top": ""
		// 			});	
		// 		}
		// 		else if (top >= baseTop) {
		// 			$('#customer_widget').css({
		// 				"position": "fixed",
		// 				"width":$('#customer_widget').width()+'px',
		// 				"top": header_height
		// 			});
		// 		}
		// 		else if (top < baseTop) {
		// 			$('#customer_widget').css({
		// 				"position": "",
		// 				"width":"",
		// 				"top": ""
		// 			});				
		// 		}

		// 		$('#schedule_calendar').css({
		// 			"height": ""
		// 		});	

		// 		if(top==0 && baseTop1==0){
		// 			var a = $('.dash_header').height() + $('.header').height();
		// 			$('#schedule_calendar').css({
		// 				"position": "fixed",
		// 				"width":$('#schedule_calendar').width()+'px',
		// 				"top": a,
		// 				"padding-top":"5px"
		// 			});
		// 			setTimeout(function(){
		// 				$('#customer_widget').css({"position":""});
		// 			},200);
		// 		}
		// 		else if(top==0){
		// 			$('#schedule_calendar').css({
		// 				"position": "",
		// 				"width":"",
		// 				"top": "",
		// 				"padding-top":""
		// 			});	
		// 		}
		// 		else if (top >= baseTop1) {
		// 			$('#schedule_calendar').css({
		// 				"position": "fixed",
		// 				"width":$('#schedule_calendar').width()+'px',
		// 				"top": header_height,
		// 				"padding-top":"5px"
		// 			});
		// 		}
		// 		else if (top < baseTop1) {
		// 			$('#schedule_calendar').css({
		// 				"position": "",
		// 				"width":"",
		// 				"top": "",
		// 				"padding-top":""
		// 			});				
		// 		}
		// 		voluntary_allocation.adjustSchedules();
		// 	}
		// });
		
		voluntary_allocation.adjustSchedules();

		$('#customersol').droppable({
			accept:'.allocatedcust',
			drop: function( events, ui ) {
				var customer_id = $(ui.draggable).attr('data-customer-id');
				var primary_key = $(ui.draggable).attr('data-primary-key');
				var drop_id = $(ui.draggable).attr('data-drop-id');
				
				
				if($.isEmptyObject(global_all_customers_by_customer_id)==false){
					var thiscust = global_all_customers_by_customer_id[customer_id];
				}
				else{
					var all_customers =  global_voluntary_allocation_customers.customers;
					for(var j in all_customers){
						var cust = all_customers[j];
						global_all_customers_by_customer_id[cust.id] = {
							customer_name:cust.customer_name,
							id:cust.id,
							unallocated_hours:cust.unallocated_hours,
							customer_number:cust.customer_number,
						};
					}
					var thiscust = global_all_customers_by_customer_id[customer_id];
				}
				$('.schedulesp_'+drop_id+' .allocatedcust_'+customer_id).draggable({revert:false});
				$('.schedulesp_'+drop_id+' .allocatedcust_'+customer_id).remove();
				voluntary_allocation.removeCustomerFrmSchedule(customer_id,drop_id,primary_key);
			}
		});

		$('#customersol_scratchpad_scroll').droppable({
			accept:'.allocatedcust',
			drop: function( events, ui ) {
				var customer_id = $(ui.draggable).attr('data-customer-id');
				var primary_key = $(ui.draggable).attr('data-primary-key');
				var drop_id = $(ui.draggable).attr('data-drop-id');
				$('.allocatedcust_'+customer_id).draggable({ revert: false });
				voluntary_allocation.addCustomerToScratchPad(customer_id,drop_id,primary_key);
			}
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
				if(a.indexOf("new_custom_main_page")!==-1){
					
					//$(this).removeAttr('onclick');
				}
			}
		});
		// $('#be_sidebar a').click(function(){
		// 	if($('#customersol_scratchpad li').length!=0){
		// 		if (! $(this).parent().is( "li" ) || $(this).parent().parent().hasClass('sub-menu') ) {
		// 			voluntary_allocation.getCnfMsg(this);
		// 			return false;
		// 		}
		// 		else{
		// 			if($(this).parent().hasClass( "arrow" ) || $(this).find('span').hasClass( "arrow" )){
					
		// 			}
		// 			else{
		// 				voluntary_allocation.getCnfMsg(this);
		// 				return false;
		// 			}
		// 		}
		// 	}
		// 	else{
		// 		if($(this).attr('href')!=undefined){
		// 			window.location.href = $(this).attr('href');
		// 		}
		// 	}
			
		// });		
	},
	getCnfMsg:function(that){
		//var msg = global_voluntary_allocation_data.translationsData.Youhaveitemsinthescratchpad;
		var msg = global_voluntary_allocation_data.translationsData.Ifyounavigateawayfromthispage+', ';
		msg += global_voluntary_allocation_data.translationsData.itemsinthescratchpadwillberemoved;

		var yes = function(){
			if($(that).attr('href')!=undefined){
				window.location.href = $(that).attr('href');
			}
		};

		var no = function(){
			$('#popups').modal('hide');
		};

		showDeleteMessage(msg,global_voluntary_allocation_data.translationsData.Warning,yes,no,'ui-dialog-red',global_voluntary_allocation_data.translationsData.Proceed,global_voluntary_allocation_data.translationsData.Cancel);
		return;
	},
	customersHtml:function(customers='',manualsearch=''){
		
		$('#customersol').html('');
		$('.allocatedcust').removeClass('border_orange');
		$('.schedules').removeClass('border_orange_solid');
		$('.schedulesd').removeClass('border_none');
		var customersHtmlLi = '';
		if(customers==''){
			for(var j in global_sorted_voluntary_allocation_customers){
				var cust = global_sorted_voluntary_allocation_customers[j];
				customersHtmlLi += '<li class="dd-custom-item customersort  customersort_'+cust.id+'" data-customer-id="'+cust.id+'" data-voluntary-hours="'+cust.unallocated_hours+'">';
					customersHtmlLi += '<div class="dd-custom-handle">';
						
						customersHtmlLi += '<p style="text-align:left;float:left;margin:0">';
							customersHtmlLi += cust.customer_name;
						customersHtmlLi += '</p>';

						customersHtmlLi += '<p style="text-align:right;float:right;margin:0">';
							customersHtmlLi += cust.unallocated_hours;
						customersHtmlLi += '</p>';

					customersHtmlLi += '<div style="clear: both;"></div></div>';

				customersHtmlLi += '</li>';
				
			}
			$('#customersol').append(customersHtmlLi);
			$('.customersort').draggable({
				revert: true,     
				revertDuration: 500,
				scroll: false,
        		helper: 'clone',
        		appendTo: "body",
				start: function(event, ui) {
					$('.ui-draggable-dragging').css('width',$('.customersort').width()+'px');						
				},
				stop:function(event,ui){
					$('.header_schedules,.schedules').removeClass('schedules_hover');
				}
			});
			
		}
		else{
			var customersHtmlLi = '';

			for(var j in customers){
				var cust = customers[j];
			
				if(manualsearch=='manualsearch'){
					if($('.allocatedcust_'+cust.id).length!=0){
						$('.allocatedcust_'+cust.id).addClass('border_orange');
						$('.allocatedcust_'+cust.id).parent().parent().parent().addClass('border_orange_solid');
						$('.allocatedcust_'+cust.id).parent().parent().addClass('border_none');
						
					}
				}
				customersHtmlLi += '<li class="dd-custom-item customersort  customersort_'+cust.id+'" data-customer-id="'+cust.id+'" data-voluntary-hours="'+cust.unallocated_hours+'">';
					customersHtmlLi += '<div class="dd-custom-handle">';
						
						customersHtmlLi += '<p style="text-align:left;float:left;margin:0">';
							customersHtmlLi += cust.customer_name;
						customersHtmlLi += '</p>';

						customersHtmlLi += '<p style="text-align:right;float:right;margin:0">';
							customersHtmlLi += cust.unallocated_hours;
						customersHtmlLi += '</p>';

					customersHtmlLi += '<div style="clear: both;"></div></div>';

				customersHtmlLi += '</li>';
				
			}
			$('#customersol').append(customersHtmlLi);
				
			$('.customersort').draggable({
				revert: true,     
				revertDuration: 500,
				scroll: false,
				helper:"clone",
				appendTo: "body",
				start: function(event, ui) { 
					$('.ui-draggable-dragging').css('width',$('.customersort').width()+'px');
				},
				stop:function(event,ui){
					$('.header_schedules,.schedules').removeClass('schedules_hover');
				}
			});
		}	
		var w = parseInt($(window).height()) - parseInt($('.header').height()) - parseInt($('.footer').height()) - parseInt($('#customer_lists ol:first').height()) - parseInt($('.portlet-title').height()) -48;	 
		var t = parseInt(w/2);
		var u = w/2 - parseInt($('#calendar-box1 .portlet-title').height()) - parseInt($('.footer').height()) - 12;
		u = parseInt(u);

		$("#customersol_scroll").slimScroll({
			height: t
		});	

		$('#customersol').css('height',t+'px');

		$("#customersol_scratchpad_scroll").slimScroll({
			height:  u
		});	

		$("#customersol_scratchpad").css('height',u+'px');
		
		$(window).resize(function(){
			if(document.getElementById('customersol')!=null){
				var w = parseInt($(window).height()) - parseInt($('.header').height()) - parseInt($('.footer').height()) - parseInt($('#customer_lists ol:first').height()) - parseInt($('.portlet-title').height())-48;

				var u = w/2 - parseInt($('#calendar-box1 .portlet-title').height()) - parseInt($('.footer').height()) -15 ;
				u = parseInt(u);
				$("#customersol_scroll,#customersol_scratchpad_scroll").slimScroll({
					'destroy':true
				});

				var t = parseInt(w/2);
				$("#customersol_scroll").slimScroll({
					height:  t
				});	
				$('#customersol').css('height',t+'px');

				$("#customersol_scratchpad_scroll").slimScroll({
					height:  u
				});	

				$("#customersol_scratchpad").css('height',u+'px');

			}
			voluntary_allocation.adjustSchedules();
			
		});
	},
	adjustSchedules:function(){
			
  		
	
		if(document.getElementById('droppable_schedules')!=null){
				
				// var w = parseInt($(window).height()) - parseInt($('.header').height()) - parseInt($('.footer').height())-parseInt($('.fc-header-toolbar').height()) - 18;
			
				// $("#droppable_schedules").slimScroll({
				// 	'destroy':true
				// });
				// if($('#schedule_calendar').css('position')=='fixed'){
				// 	var w = w -20;
				// }
				// $("#droppable_schedules").slimScroll({
				// 	height:  w
				// });	
			}
	},
	doCustomerSearch:function(search){
		var options = {
			shouldSort: true,
			threshold: 0.2,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			tokenize:true,
			minMatchCharLength: 1,
			keys: [
				"customer_name",
				"customer_number",
				"unallocated_hours"
			]
		};
		
		var fuse = new Fuse(global_sorted_voluntary_allocation_customers, options);
		var result = fuse.search(search);
		var global_search_voluntary_allocation_customers = result;
		voluntary_allocation.customersHtml(global_search_voluntary_allocation_customers,'manualsearch');
	},
	getSchedulesByDate:function(month,year){
		schedules_customers = [];
		showProcessingImage('undefined');
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			month:month,
			year:year,
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getVoluntaryAllocation.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var res = complet_data.response.response;
				if(res.PartnerVoluntarySchedules=='' || res.PartnerVoluntarySchedules==undefined || res.PartnerVoluntarySchedules==null || res.PartnerVoluntarySchedules.length==0){
						var html = '<div id="droppable_schedules">';
							html += '<div class="alert inboxend alert-info" style="text-align:center;">';
								html += global_voluntary_allocation_data.translationsData.Noschedulesfound;
							html += '</div>';
						html += '<div>';
						setTimeout(function(){
							$('#schedule_calendar .slimScrollDiv').remove();
							$('#droppable_schedules').remove();
							$('#schedule_calendar').append(html);
						},10);				
						$('#voluntary_allocation_save').hide();
						$('.remove_c').hide();
						$('.send_notifications').removeAttr('checked');
						
					return;
				}
				else{
					$('#voluntary_allocation_save').show(); $('.remove_c').show();
					voluntary_allocation.renderSchedules(res.PartnerVoluntarySchedules);	
					return;
				}				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_voluntary_allocation_data.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_voluntary_allocation_data.translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		
		return;
	},
	renderSchedules:function(data=''){
		if(data==''){
			data = global_voluntary_allocation_data.PartnerVoluntarySchedules;
		}
		current_schedules = data;
		var html ='';
		if(data.length!=0){
			html += '<div id="droppable_schedules">';
				html += '<div class="span12 schedules_label">';

				html += '<table class="table">';
					html +='<tr>';
						

						html += '<th style="margin:0">';
							html += global_voluntary_allocation_data.translationsData.Dateandtime;
						html += '</th>';

						html += '<th style="margin:0">';
							html += global_voluntary_allocation_data.translationsData.Type;
						html += '</th>';

						// html += '<th style="margin:0">';
						// 	html += global_voluntary_allocation_data.translationsData.Starttime;
						// html += '</th>';

						html += '<th>';
							html += global_voluntary_allocation_data.translationsData.Duration;
						html += '</th>';

						html += '<th>';
							html += global_voluntary_allocation_data.translationsData.Customers;
						html += '</th>';

						html += '<th style="width:25px">&nbsp;</th>';
						
					html +='</tr>';
				html += '</table>';
					html += '</div>';
				
				for(var j in data){
					var ps = data[j].PartnerVoluntarySchedule;
					var pva = data[j].PartnerVoluntaryAllocation;
					var pvn = data[j].PartnerVoluntaryNotification;
					schedules_customers[ps.id] = [];
						
						
						var today_date = moment(global_voluntary_allocation_data.todaydate);
						var ps_date = moment(ps.date);
						var disabled = 0;
					
						if(ps.status== 1 || today_date.unix() > ps_date.unix() ){
							disabled = 1;
						}
						
						if(disabled == 0){

							html += '<div class="schedules schedulesdrop span12 schedulesp_'+ps.id+'" data-id="'+ps.id+'" data-voluntary-hours="'+ps.hours+'">';
					
							if(pva.length!=0){
								html += '<table class="header_schedules table alloc_event">';

							}
							else{
								html += '<table class="header_schedules table unalloc_event">';
							}					
						}
						else{							
							html += '<div class="schedules span12 schedulesp_'+ps.id+'" data-id="'+ps.id+'" data-voluntary-hours="'+ps.hours+'">';
							html += '<table class="header_schedules table completed_event">';		
						}
							html +='<tr  onclick="voluntary_allocation.minmax('+ps.id+')">';
								
								var st = ps.start_time;
								st = st.toString().match(/.{1,2}/g);
								html += '<td style="margin:0">';
								if(lang=='en'){
									html += convertDateIntoSiteFormat(ps.date)+' '+st[0]+':'+st[1]+' '+global_voluntary_allocation_data.translationsData.oaclock;
								}
								else{
									html += convertDateIntoSiteFormat(ps.date)+' '+global_voluntary_allocation_data.translationsData.oaclock+' '+ st[0]+':'+st[1];
								}
								html += '</td>';

								html += '<td style="margin:0">';
									html += ps.name;
								html += '</td>';


								// html += '<td style="margin:0">';
								// 	html += ps.start_time;
								// html += '</td>';

								html += '<td style="margin:0">';
									html += ps.hours;
									if(ps.hours==1){
										html += ' '+ global_voluntary_allocation_data.translationsData.hour;
									}
									else{
										html += ' '+ global_voluntary_allocation_data.translationsData.hours;
									}
								html += '</td>';

								html += '<td style="margin:0" id="no_of_cust_'+ps.id+'">';
									html += data[j].PartnerVoluntaryAllocation.length;

								html += '</td>';

								html += '<td style="width:25px" class="p">';
									html += '<i class="icon-angle-down"></i>';
								html += '</td>';
							html +='</tr>';

						html += '</table>';

						if(disabled == 1 ){ 
							if(pva.length!=0){
								html += '<div class="shide schedulesd alloc_event schedulesd_'+ps.id+'">';
							}
							else{
								html += '<div class="shide schedulesd unalloc_event schedulesd_'+ps.id+'">';
							}
						}
						else{
							html += '<div class="shide schedulesd completed_event schedulesd_'+ps.id+'">';							
						}

						
							html += '<ul class="schedulesul scheduleul'+ps.id+'">';
								
								
								if(pva.length==0){
									html += '<li class="schedulesnoc_'+ps.id+'">'+global_voluntary_allocation_data.translationsData.Nocustomersavailable+'</li>';
								}
								else{
									html += '<li class="schedulesnoc_'+ps.id+'" style="display:none">'+global_voluntary_allocation_data.translationsData.Nocustomersavailable+'</li>';
									for(var k in pva){
										var r = pva[k];
										schedules_customers[ps.id].push(r.customer_id);
										if(disabled == 0){
											html += '<li class="allocatedcust allocatedcustdrag allocatedcust_'+r.customer_id+'" data-customer-id="'+r.customer_id+'" data-drop-id="'+r.partner_voluntary_schedule_id+'" data-primary-key="'+r.id+'" data-voluntary-hours="'+r.unallocated_hours+'">';
										}
										else{
											html += '<li class="allocatedcust allocatedcust_'+r.customer_id+'" data-customer-id="'+r.customer_id+'" data-drop-id="'+r.partner_voluntary_schedule_id+'" data-primary-key="'+r.id+'" data-voluntary-hours="'+r.unallocated_hours+'">';
										}
										
											

											html += '<p style="text-align:left;float:left;margin:0">';
												html += r.customer_name;
											html += '</p>';
										

											html += '<div class="switch switch-small manager_switch manager_switch_'+r.partner_voluntary_schedule_id+'_'+r.customer_id+'"  data-on-label="'+global_voluntary_allocation_data.translationsData.Responsible+'" data-off-label="'+global_voluntary_allocation_data.translationsData.Participant+'">';
												
												var manager_required = global_voluntary_allocation_data.getPartnerCustomSettings.PartnerSetting.voluntary_allocations_manager;
												if(disabled == 0){
													if(manager_required!=1 && manager_required!=2 && manager_required!=3){
														html += '<input disabled type="checkbox" data-customer-id="'+r.customer_id+'"  data-schedule-id="'+r.partner_voluntary_schedule_id+'" class="is_manager is_managerc_'+r.customer_id+' is_manager_'+r.partner_voluntary_schedule_id+'" >';
													}
													else{
														if(r.is_manager==1){
															html += '<input  type="checkbox" data-customer-id="'+r.customer_id+'"  data-schedule-id="'+r.partner_voluntary_schedule_id+'" class="is_manager is_managerc_'+r.customer_id+' is_manager_'+r.partner_voluntary_schedule_id+'" checked>';
														}
														else{
															html += '<input type="checkbox" data-customer-id="'+r.customer_id+'"  data-schedule-id="'+r.partner_voluntary_schedule_id+'" class="is_manager is_managerc_'+r.customer_id+' is_manager_'+r.partner_voluntary_schedule_id+'">';
														}
													}													
												}
												else{													
													if(r.is_manager==1){
														html += '<input disabled type="checkbox" data-customer-id="'+r.customer_id+'"  data-schedule-id="'+r.partner_voluntary_schedule_id+'" class="is_manager is_managerc_'+r.customer_id+' is_manager_'+r.partner_voluntary_schedule_id+'" checked>';
													}
													else{
														html += '<input disabled type="checkbox" data-customer-id="'+r.customer_id+'"  data-schedule-id="'+r.partner_voluntary_schedule_id+'" class="is_manager is_managerc_'+r.customer_id+' is_manager_'+r.partner_voluntary_schedule_id+'">';
													}
												}
												

											html += '</div>';

											html += '<div style="" class="icon_space">';
												var psmsg = global_voluntary_allocation_data.translationsData.Participantsaved;

												var acbco = global_voluntary_allocation_data.translationsData.Actioncannotbecarriedout;

												var ens = global_voluntary_allocation_data.translationsData.Emailnotificationsent;

												var sns = global_voluntary_allocation_data.translationsData.SMSnotificationsent;

												var ap = global_voluntary_allocation_data.translationsData.Actionpending;
												
												var st = ps.start_time;
												st = st.toString().match(/.{1,2}/g);
												var st_date = moment(ps.date).format('YYYY-MM-DD')+ ' '+st[0]+':'+st[1]+':00';
												if(pvn.length==0){

													html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+psmsg+'" >';
														html += '<i class="icon-ok icon_sp icon_sp_green"></i>';
													html += '</span>';

													html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
														html += '<i class="icon-envelope icon_sp icon_sp_gray"></i>';
													html += '</span>';
													
													html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
														html += '<i class="icon-comment icon_sp icon_sp_gray"></i>';
													html += '</span>';
												}
												else{
													html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+psmsg+'" >';
														html += '<i class="icon-ok icon_sp icon_sp_green" ></i>';
													html += '</span>';

													if(r.when_scheduling.email==1){
														html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ens+'" >';
															html += '<i class="icon-envelope icon_sp icon_sp_green"></i>';
														html += '</span>';
													}
													else if(r.when_scheduling.email==null){
														html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ap+'" >';
															if(moment().unix() < moment(st_date).unix()){
																html += '<i class="icon-envelope icon_sp act_pend"></i>';
															}
															else{
																html += '<i class="icon-envelope icon_sp "></i>';
															}
														html += '</span>';
													}
													else{
														html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
															html += '<i class="icon-envelope icon_sp icon_sp_gray"></i>';
														html += '</span>';
													}

													if(r.when_scheduling.sms==1){
														html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+sns+'" >';
															html += '<i class="icon-comment icon_sp icon_sp_green"></i>';
														html += '</span>';
													}
													else if(r.when_scheduling.sms==null){
														html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ap+'" >';
														
															
														
															if(moment().unix() < moment(st_date).unix()){
																html += '<i class="icon-comment icon_sp act_pend"></i>';
															}
															else{
																html += '<i class="icon-comment icon_sp "></i>';
															}
															
														html += '</span>';
													}
													else{
														html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
															html += '<i class="icon-comment icon_sp icon_sp_gray"></i>';
														html += '</span>';
													}
													
													
												}


											html += '</div>';
										html += '</li>';
									}	
								}
							html += '</ul>';
						html += '</div >';
					html += '</div>';

				}
			html += '</div>';
			setTimeout(function(){
				//$('#schedule_calendar .slimScrollDiv').remove();
				$('#droppable_schedules').remove();
				if(html!=''){

					$('#schedule_calendar').append(html);
					if($('.act_pend').length!=0){
						$('#voluntary_allocation_save').show();
					}
					else{
						$('#voluntary_allocation_save').hide();
					}
					$('.popovers').popover();
					for(var j in data){
						var ps = data[j].PartnerVoluntarySchedule;
						var pva = data[j].PartnerVoluntaryAllocation;	
						if(pva.length==0){
							}
						else{
							for(var k in pva){
								var r = pva[k];
								$('.manager_switch_'+r.partner_voluntary_schedule_id+'_'+r.customer_id).bootstrapSwitch();
								voluntary_allocation.manageManagers(r.partner_voluntary_schedule_id,r.customer_id);
							}
						}
					}
			
					//$('input[type=checkbox]').uniform();
					$('.allocatedcustdrag').draggable({
						revert: true,     
						revertDuration: 500,
						scroll: false,
						helper:"clone",
						appendTo: "body",
						zIndex:10105,
						stop:function(event,ui){
							$('.header_schedules,.schedules').removeClass('schedules_hover');
						}
					});

					$('.schedulesdrop').droppable({
						accept: '.customersort,.allocatedcust',
						out:function( event, ui ){

							$('.header_schedules,.schedules').removeClass('schedules_hover');
						},
						over:function( event, ui ){
							var countDown = function(th){
								$(th).addClass('schedules_hover');
								$(th).find('table.header_schedules').addClass('schedules_hover')
							}
							setTimeout(countDown,100,this);
							// setTimeout(function(th){
								
							// },100).bind(this);
							
						
						},
						drop: function( events, ui ) {
							$('.header_schedules,.schedules').removeClass('schedules_hover');
							var keepcheck = 0;
							var drop_id = $(events.target).attr('data-id');
							var schedule_voluntary_hours = $(events.target).attr('data-voluntary-hours');

							var customer_id = $(ui.draggable).attr('data-customer-id');
							var customer_voluntary_hours = $(ui.draggable).attr('data-voluntary-hours');

							if($(ui.draggable).hasClass('allocatedcust')){
								var ddi = $(ui.draggable).attr('data-drop-id');
								if(drop_id==ddi){
									return;
								}
							}
							for(var j in schedules_customers[drop_id]){
								var k = schedules_customers[drop_id][j];
								if(k==customer_id){
									showAlertMessage(global_voluntary_allocation_data.translationsData.Customeralreadyexistsintheschedule+'.','error',global_voluntary_allocation_data.translationsData.alertmessage);
									return;
								}
							}

							if($(ui.draggable).hasClass('allocatedcust')){
								var from_schedule = $(ui.draggable).attr('data-drop-id');
								var primary_key = $(ui.draggable).attr('data-primary-key');

							
								keepcheck = $('.scheduleul'+from_schedule+' .is_managerc_'+customer_id+':checked').length;
								$('.allocatedcust_'+customer_id).draggable({ revert: false });
								$('.allocatedcust_'+customer_id).remove();
								var res = voluntary_allocation.getCustomerData(customer_id);
								res.schedule_id = drop_id;
								var red = 0;
								if(parseFloat(customer_voluntary_hours) < parseFloat(schedule_voluntary_hours)){
									red=1;
								}
								voluntary_allocation.updateOnDrop(customer_id,drop_id,'update',red,keepcheck,primary_key,from_schedule,schedule_voluntary_hours);
							}
							else{
								var res = voluntary_allocation.getCustomerData(customer_id);
								res.schedule_id = drop_id;
								var red = 0;
								if(parseFloat(customer_voluntary_hours) < parseFloat(schedule_voluntary_hours)){
									red=1;
								}
								voluntary_allocation.saveOnDrop(customer_id,drop_id,'save',red,1,schedule_voluntary_hours);
								
								$('.customersort_'+customer_id).draggable({ revert: false });
								$('.customersort_'+customer_id).remove();
							}


						}
					});
				}
				voluntary_allocation.adjustSchedules();
			},10);	
		}
		else{
			 html += '<div id="droppable_schedules">';
				html += '<div class="alert inboxend alert-info" style="text-align:center;">';
					html += global_voluntary_allocation_data.translationsData.Noschedulesfound;
				html += '</div>';
			html += '<div>';
			setTimeout(function(){
				//$('#schedule_calendar .slimScrollDiv').remove();
				$('#droppable_schedules').remove();
				$('#schedule_calendar').append(html);
			},10);				
			$('#voluntary_allocation_save').hide();
			$('.remove_c').hide();
						$('.send_notifications').removeAttr('checked');
						
		return;
		}
	},
	updateCustomerAllocations:function(res,drop_id,red,keepcheck){
		for(var j in global_sorted_voluntary_allocation_customers){
			if(global_sorted_voluntary_allocation_customers[j].id==res.id){
				//Update hours for customers
				global_sorted_voluntary_allocation_customers[j].unallocated_hours = res.unallocated_hours;
				break;
			}
		}
		var manger_required = global_voluntary_allocation_data.getPartnerCustomSettings.PartnerSetting.voluntary_allocations_manager;

		var html = '';

		if(red==1){
			html += '<li class="allocatedcust redborder allocatedcust_'+res.id+'" data-customer-id="'+res.id+'" data-drop-id="'+drop_id+'" data-primary-key="'+res.primary_key+'" data-voluntary-hours="'+res.unallocated_hours+'">';
		}
		else{
			html += '<li class="allocatedcust allocatedcust_'+res.id+'" data-customer-id="'+res.id+'" data-drop-id="'+drop_id+'" data-primary-key="'+res.primary_key+'" data-voluntary-hours="'+res.unallocated_hours+'">';
		}
			html += '<p style="text-align:left;float:left;margin:0">';
				html += res.customer_name;
			html += '</p>';
			var manager_required = global_voluntary_allocation_data.getPartnerCustomSettings.PartnerSetting.voluntary_allocations_manager;
			if(manager_required!=1 && manager_required!=2 && manager_required!=3){
				var uncheck = check = '<input disabled type="checkbox" data-customer-id="'+res.id+'"  data-schedule-id="'+drop_id+'" class="is_manager is_managerc_'+res.id+' is_manager_'+drop_id+'" >';
			}
			else{
				var check = '<input type="checkbox" data-customer-id="'+res.id+'"  data-schedule-id="'+drop_id+'" class="is_manager is_managerc_'+res.id+' is_manager_'+drop_id+'" checked>';

				var uncheck = '<input type="checkbox" data-customer-id="'+res.id+'"  data-schedule-id="'+drop_id+'" class="is_manager is_managerc_'+res.id+' is_manager_'+drop_id+'" >';
			}
			

			html += '<div class="switch switch-small manager_switch manager_switch_'+drop_id+'_'+res.id+'"  data-on-label="'+global_voluntary_allocation_data.translationsData.Responsible+'" data-off-label="'+global_voluntary_allocation_data.translationsData.Participant+'">';
				html += uncheck;
			html += '</div>';

			html += '<div style="" class="icon_space">';
			console.log(res);
				var psmsg = global_voluntary_allocation_data.translationsData.Participantsaved;

				var acbco = global_voluntary_allocation_data.translationsData.Actioncannotbecarriedout;

				var ens = global_voluntary_allocation_data.translationsData.Emailnotificationsent;

				var sns = global_voluntary_allocation_data.translationsData.SMSnotificationsent;

				var ap = global_voluntary_allocation_data.translationsData.Actionpending;
												
				if(res.when_scheduling.count==0){
					html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+psmsg+'" >';
						html += '<i class="icon-ok icon_sp icon_sp_green" ></i>';
					html += '</span>';	

					html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
						html += '<i class="icon-envelope icon_sp icon_sp_gray"></i>';
					html += '</span>';

					html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
						html += '<i class="icon-comment icon_sp icon_sp_gray"></i>';
					html += '</span>';
				}
				else{
					html += '<i class="icon-ok icon_sp icon_sp_green" ></i>';
					if(res.when_scheduling.email==1){
						html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ens+'" >';
							html += '<i class="icon-envelope icon_sp icon_sp_green"></i>';
						html += '</span>';
					}
					else if(res.when_scheduling.email==null){
						html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ap+'" >';
							html += '<i class="icon-envelope icon_sp act_pend"></i>';
						html += '</span>';
					}
					else{
						html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
							html += '<i class="icon-envelope icon_sp icon_sp_gray"></i>';
						html += '</span>';
					}

					if(res.when_scheduling.sms==1){
						html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+sns+'" >';
							html += '<i class="icon-comment icon_sp icon_sp_green"></i>';
						html += '</span>';
					}
					else if(res.when_scheduling.sms==null){
						html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ap+'" >';
							html += '<i class="icon-comment icon_sp act_pend"></i>';
						html += '</span>';
					}
					else{
						html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
							html += '<i class="icon-comment icon_sp icon_sp_gray"></i>';
						html += '</span>';
					}
				}
			html += '</div>';

		html += '</li>';
		
		$('.schedulesnoc_'+res.schedule_id).hide();
		$('.scheduleul'+res.schedule_id).append(html);
		$('.popovers').popover();
		$('.manager_switch_'+drop_id+'_'+res.id).bootstrapSwitch();

		voluntary_allocation.manageManagers(drop_id,res.id);
		$('.allocatedcust_'+res.id).draggable({
			revert: true,     
			revertDuration: 500,
			scroll: false,
			helper:"clone",
			appendTo: "body",
			zIndex:10105,
			stop:function(event,ui){
				$('.header_schedules,.schedules').removeClass('schedules_hover');
			}
		});
	},
	getCustomerData:function(customer_id){
		var retobj = {};
		if(customer_id==null || customer_id=='' || customer_id==undefined){
			return retobj;
		}

		if($.isEmptyObject(global_all_customers_by_customer_id)==false){
				return global_all_customers_by_customer_id[customer_id];
		}
		else{
			var all_customers =  global_voluntary_allocation_customers.customers;
			for(var j in all_customers){
				var cust = all_customers[j];
				global_all_customers_by_customer_id[cust.id] = {
					customer_name:cust.customer_name,
					id:cust.id,
					unallocated_hours:cust.unallocated_hours,
					customer_number:cust.customer_number,
				};
			}
			return global_all_customers_by_customer_id[customer_id];
		}
	},
	minmax:function(id){
		if($('.schedulesd_'+id).hasClass('shide')){
			$('.schedulesd_'+id).removeClass('shide');
		}
		else{
			$('.schedulesd_'+id).addClass('shide');
		}
		voluntary_allocation.adjustSchedules();
	},
	save:function(){
		var manger_required = global_voluntary_allocation_data.getPartnerCustomSettings.PartnerSetting.voluntary_allocations_manager;


		showProcessingImage('undefined');
		var saveparams = [];
		var schedule_ids = [];
		var err = '';
		for(var j in schedules_customers){
			var a = schedules_customers[j];
			for(var m in current_schedules){
				var today_date = moment(global_voluntary_allocation_data.todaydate);
				var ps_date = moment(current_schedules[m].PartnerVoluntarySchedule.date);

				if( 
					(current_schedules[m].PartnerVoluntarySchedule.status!=0 
						||
					today_date.unix() > ps_date.unix() 
					)
					&& (current_schedules[m].PartnerVoluntarySchedule.id==j)
				){
					a = 1;
					continue;
				}
			}
			if(a==1){
				continue;
			}

			if(a.length!=0){
				
				
				schedule_ids.push(j);
				var hw_mny_checked = 0;
				for(var k in a){
					var b = a[k];
				
					var l = $('.is_manager_'+j+'.is_managerc_'+b+':checked').length;
					if(l==1){
						hw_mny_checked++;
					}


					var is_manager = $('.scheduleul'+j+' .is_managerc_'+b+':checked').length;
					var primary_key = $('.scheduleul'+j+' .allocatedcust_'+b).attr('data-primary-key');
					saveparams.push({id:primary_key,is_manager:is_manager});
					
				}
				if(manger_required==1 || manger_required==3){
					if(hw_mny_checked!=1){
							err += j+'_';
					}
				}
				else if(manger_required==2){
					if(hw_mny_checked==0){
						err += j+'_';
					}
				}
				
			}
		}
		
		if(err!=''){ 
			var msg = '';
			if(manger_required==2){
				msg = global_voluntary_allocation_data.translationsData.Atleastonemanagerrequired;
			}
			if(manger_required==1 || manger_required==3){
				msg = global_voluntary_allocation_data.translationsData.Onlyonemanagerrequired;
			}
			hideProcessingImage();
			showAlertMessage(msg,'error',global_voluntary_allocation_data.translationsData.alertmessage);
			return;
		}
	
	
	
		if(saveparams.length!=0){
			var total_params = {
				APISERVER:APISERVER,
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				saveparams:saveparams,
				schedule_ids:schedule_ids,
				send_notifications:1
			};
			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Voluntries/saveVoluntaryCompletion.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					$('.send_notifications').prop('checked',false);
					var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
					var month = moment(date).month();
					month = month + 1;
					var year = moment(date).year();
					voluntary_allocation.getSchedulesByDate(month,year);
			
					call_toastr( global_voluntary_allocation_data.translationsData.success, global_voluntary_allocation_data.translationsData.Success,  global_voluntary_allocation_data.translationsData.Notificationsentsuccessfully);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',global_voluntary_allocation_data.translationsData.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',global_voluntary_allocation_data.translationsData.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
		}
		else{
			if($('.allocatedcust').length!=0){
				call_toastr( global_voluntary_allocation_data.translationsData.success, global_voluntary_allocation_data.translationsData.Success,  global_voluntary_allocation_data.translationsData.Allocationssavedsuccessfully);
			}
			
			hideProcessingImage();
		}
		return;
	},
	checkEmptySchedules:function(){
		if($('#customers_search').val()==''){
			voluntary_allocation.customersHtml();
		}
		else{
			$('#customers_search').trigger('keyup');
		}
		
		for(var j in schedules_customers){
			if(schedules_customers[j].length==0){
				$('.schedulesnoc_'+j).show();
				if(!$('.schedulesp_'+j+' table').hasClass('completed_event')){
					$('.schedulesp_'+j+' table').removeClass('alloc_event').removeClass('unalloc_event').addClass('unalloc_event');
				}
				if(!$('.schedulesd_'+j).hasClass('completed_event')){
					$('.schedulesd_'+j).removeClass('alloc_event').removeClass('unalloc_event').addClass('unalloc_event');
				}
				
			}
			else{
				if(!$('.schedulesp_'+j+' table').hasClass('completed_event')){
					$('.schedulesp_'+j+' table').removeClass('alloc_event').removeClass('unalloc_event').addClass('alloc_event');
				}
				if(!$('.schedulesd_'+j).hasClass('completed_event')){
					$('.schedulesd_'+j).removeClass('alloc_event').removeClass('unalloc_event').addClass('alloc_event');
				}
			}
			var is_checked = 1;
			$('.scheduleul'+j+' .is_manager_'+j).each(function(){
				var check_id = $(this).attr('data-customer-id');
				if($('is_managerc_'+check_id+':checked').length==1){
					is_checked = 1;
					return false;
				}
				else{
					is_checked = 0;
				}
			});
			var manger_required = global_voluntary_allocation_data.getPartnerCustomSettings.PartnerSetting.voluntary_allocations_manager;

			if(manger_required!=1 && manger_required!=2 && manger_required!=3){
				is_checked = 1;
			}
			if(is_checked==0){
				$('input').trigger('change');
			}
			if($('.act_pend').length!=0){
				$('#voluntary_allocation_save').show();
			}
			else{
				$('#voluntary_allocation_save').hide();
			}
		}
	},
	manageManagers:function(schd_id,cust_id){
		var manager_required = global_voluntary_allocation_data.getPartnerCustomSettings.PartnerSetting.voluntary_allocations_manager;

		$('.manager_switch_'+schd_id+'_'+cust_id).find('input').change(function(){
			var that = this;
			var schedule_id = $(that).attr('data-schedule-id');
			if(manager_required==1){
				if($('.scheduleul'+schedule_id+' .is_manager_'+schedule_id+':checked').length == 0){

				}
				else if($('.scheduleul'+schedule_id+' .is_manager_'+schedule_id+':checked').length != 1){
					$('.scheduleul'+schedule_id+' .is_manager_'+schedule_id).removeAttr('checked').trigger('change2');
					$(that).prop('checked','checked').trigger('change2');
				}
			}
			if(manager_required==3){
				if($('.scheduleul'+schedule_id+' .is_manager_'+schedule_id+':checked').length != 1){
					$('.scheduleul'+schedule_id+' .is_manager_'+schedule_id).removeAttr('checked').trigger('change2');
					$(that).prop('checked','checked').trigger('change2');
				}
			}
			else if(manager_required==2){
				if($('.scheduleul'+schedule_id+' .is_manager_'+schedule_id+':checked').length == 0){
					$(that).prop('checked','checked').trigger('change2');
				}
			}	
			for (var i = 0; i < switch_save.length; i++) {
			  clearTimeout(switch_save[i]);
			}
			switch_save = [];	
			switch_save.push(
		        setTimeout(function(){
	         	voluntary_allocation.saveMangerAllocations();	
	        }, 500)
	      );
						
		});
		
	},
	saveMangerAllocations:function(){
		var manger_required = global_voluntary_allocation_data.getPartnerCustomSettings.PartnerSetting.voluntary_allocations_manager;
		var saveparams = [];
		var schedule_ids = [];
		var err = '';
		
		for(var j in schedules_customers){
			var a = 0;
			for(var m in current_schedules){
				var today_date = moment(global_voluntary_allocation_data.todaydate);
				var ps_date = moment(current_schedules[m].PartnerVoluntarySchedule.date);
				if( 
					(current_schedules[m].PartnerVoluntarySchedule.status!=0 
						||
					today_date.unix() > ps_date.unix() 
					)
					&& (current_schedules[m].PartnerVoluntarySchedule.id==j)
				){
					a = 1;
					continue;
				}
			}
			if(a==1){
				continue;
			}
			var a = schedules_customers[j];
	
			if(a.length!=0){
				
				schedule_ids.push(j);
				var hw_mny_checked = 0;
				for(var k in a){
					var b = a[k];
				
					var l = $('.is_manager_'+j+'.is_managerc_'+b+':checked').length;
					if(l==1){
						hw_mny_checked++;
					}


					var is_manager = $('.scheduleul'+j+' .is_managerc_'+b+':checked').length;
					var primary_key = $('.scheduleul'+j+' .allocatedcust_'+b).attr('data-primary-key');
					var customer_id = b;
					var schedule_id = j;
					saveparams.push({id:primary_key,is_manager:is_manager,schedule_id:schedule_id,customer_id:customer_id});
					
				}
				if(manger_required==1 || manger_required==3){
					if(hw_mny_checked!=1){
							err += j+'_';
					}
				}
				else if(manger_required==2){
					if(hw_mny_checked==0){
						err += j+'_';
					}
				}
				
			}
		}
		
		if(err!=''){ 
			console.log(err);
			return;
		}
		
		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			saveparams:saveparams
		};
		
		
		var total_params = {
			data:params,
			model:'partnerVoluntaryAllocations',
			action:'updatemanagers',
			emitevent:'partnerVoluntaryUpdateManagers',
			emithis:{}
		};
		if(saveparams.length!=0){
			socket.emit('crud', total_params);		
		}
		
	},
	partnerVoluntaryUpdateManagers:function(data){
		if(data.error==null){
			data = data.success;
			for(var j in data){
				var inp_id = '.is_managerc_'+data[j].customer_id+'.is_manager_'+data[j].schedule_id;
			
				if(data[j].is_manager==1){
					$(inp_id).prop('checked','checked').trigger('change2');
				}
				else{
					$(inp_id).removeAttr('checked').trigger('change2');
				}
			}
		}
	},
	saveOnDrop:function(customer_id,schedule_id,from,red,keepcheck,schedule_voluntary_hours){
		var is_manager = 0;
		if(keepcheck==0){
			is_manager = 1;
		}

		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			partner_voluntary_schedule_id:schedule_id,
			customer_id:customer_id,
			is_manager:is_manager,
			hours:schedule_voluntary_hours
		};
	
		var total_params = {
			data:params,
			model:'partnerVoluntaryAllocations',
			action:'create',
			emitevent:'partnerVoluntaryAllocationAdd',
			emithis:{red:red,keepcheck:keepcheck}
		};
		socket.emit('crud', total_params);		
	},
	updateOnDrop:function(customer_id,schedule_id,from,red,keepcheck,primary_key,from_schedule,schedule_voluntary_hours){
		
		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			partner_voluntary_schedule_id:schedule_id,
			customer_id:customer_id,
			id:primary_key,
			is_manager:keepcheck,
			hours:schedule_voluntary_hours
		};
		var total_params = {
			data:params,
			model:'partnerVoluntaryAllocations',
			action:'update',
			emitevent:'partnerVoluntaryAllocationUpdate',
			emithis:{red:red,keepcheck:keepcheck,primary_key:primary_key,from_schedule:from_schedule}
		};
		socket.emit('crud', total_params);		
	},
	partnerVoluntaryAllocationAdd:function(data){

		if(data.error==null){
			data = data.success;
			var res = voluntary_allocation.getCustomerData(data.customer_id);
			var drop_id = data.partner_voluntary_schedule_id;
			res.unallocated_hours = data.customer_data.unallocated_hours;
			res.schedule_id = data.partner_voluntary_schedule_id;
			res.primary_key = data.id;
			res.when_scheduling = data.customer_data.when_scheduling;

			schedules_customers[drop_id].push(data.customer_id);
			
			$('#no_of_cust_'+drop_id).text(schedules_customers[drop_id].length);
			voluntary_allocation.updateCustomerAllocations(res,drop_id,data.emithis.red,data.emithis.keepcheck);
			if($('.schedulesd_'+drop_id).hasClass('shide')){
				$('.schedulesd_'+drop_id).removeClass('shide');
			}
			for(var j in scratchpad_customers){
				var cust = scratchpad_customers[j];
				if(cust.id==data.customer_id){
					scratchpad_customers.splice(j,1);
					voluntary_allocation.addScratchPadCustomers();
					break;
				}
			}
			voluntary_allocation.checkEmptySchedules();
		}
	},
	partnerVoluntaryAllocationUpdate:function(data){
		
		if(data.error==null){
			data = data.success;
			var customer_id = data.customer_id;
			var res = voluntary_allocation.getCustomerData(customer_id);
			var drop_id = data.partner_voluntary_schedule_id;
			var from_schedule = data.emithis.from_schedule;
			var red = data.emithis.red;
			var keepcheck = data.emithis.keepcheck;

			res.unallocated_hours = data.customer_data.unallocated_hours;
			res.schedule_id = data.partner_voluntary_schedule_id;
			res.primary_key = data.id;
			res.when_scheduling = data.customer_data.when_scheduling;

			$('.allocatedcust_'+customer_id).remove();
			for(var j in schedules_customers[from_schedule]){
				var k = schedules_customers[from_schedule][j];
				if(k==customer_id){
					schedules_customers[from_schedule].splice(j,1);
				}
			}
			schedules_customers[drop_id].push(data.customer_id);
			$('#no_of_cust_'+drop_id).text(schedules_customers[drop_id].length);
			$('#no_of_cust_'+from_schedule).text(schedules_customers[from_schedule].length);
		
			voluntary_allocation.updateCustomerAllocations(res,drop_id,red,keepcheck);
			if($('.schedulesd_'+drop_id).hasClass('shide')){
				$('.schedulesd_'+drop_id).removeClass('shide');
			}
			voluntary_allocation.checkEmptySchedules();
		}
	},
	removeCustomerFrmSchedule:function(customer_id,drop_id,primary_key){
		var params = {
			where:{
				id:primary_key,
				customer_id:customer_id,
				partner_voluntary_schedule_id:drop_id,
				admin_id:admin_id,
				partner_id:partner_id
			}
		};
		var total_params = {
			data:params,
			model:'partnerVoluntaryAllocations',
			action:'deletewhere',
			emitevent:'partnerVoluntaryAllocationDelete',
			emithis:{customer_id:customer_id,drop_id:drop_id}
		};
		socket.emit('crud', total_params);	
	},
	addCustomerToScratchPad:function(customer_id,drop_id,primary_key){
		var params = {
			where:{
				id:primary_key,
				customer_id:customer_id,
				partner_voluntary_schedule_id:drop_id,
				admin_id:admin_id,
				partner_id:partner_id
			}
		};
		var total_params = {
			data:params,
			model:'partnerVoluntaryAllocations',
			action:'deletewhere',
			emitevent:'addCustomerToScratchPad',
			emithis:{customer_id:customer_id,drop_id:drop_id}
		};
		socket.emit('crud', total_params);	
	},
	partnerVoluntaryAllocationDelete:function(data){
		if(data.error==null){
			data = data.success;
			var drop_id = data.drop_id;
			var customer_id = data.customer_id;

			for(var j in schedules_customers[drop_id]){
				var k = schedules_customers[drop_id][j];
				if(k==customer_id){
					schedules_customers[drop_id].splice(j,1);
					break;
				}
			}

			for(var j in global_sorted_voluntary_allocation_customers){
				if(global_sorted_voluntary_allocation_customers[j].id==data.customer_id){
				
					global_sorted_voluntary_allocation_customers[j].unallocated_hours = data.unallocated_hours;
					break;
				}
			}
			$('.schedulesp_'+drop_id+' .allocatedcust_'+customer_id).draggable({revert:false});
			$('.schedulesp_'+drop_id+' .allocatedcust_'+customer_id).remove();
			$('#no_of_cust_'+drop_id).text(schedules_customers[drop_id].length);
			voluntary_allocation.checkEmptySchedules();
		}
	},
	addCustomerToScratchPadFun:function(data){
		console.log(data);
		if(data.error==null){
			data = data.success;
			var drop_id = data.drop_id;
			var customer_id = data.customer_id;

			for(var j in schedules_customers[drop_id]){
				var k = schedules_customers[drop_id][j];
				if(k==customer_id){
					schedules_customers[drop_id].splice(j,1);
					break;
				}
			}
			var c_data;
			for(var j in global_sorted_voluntary_allocation_customers){
				if(global_sorted_voluntary_allocation_customers[j].id==data.customer_id){
					global_sorted_voluntary_allocation_customers[j].unallocated_hours = data.unallocated_hours;
					c_data = global_sorted_voluntary_allocation_customers[j];
					
					break;
				}
			}
			var match_found =0;
			for(var k in scratchpad_customers){
				if(scratchpad_customers[k].id==c_data.id){
					scratchpad_customers[k].unallocated_hours = c_data.unallocated_hours;
					match_found = 1;
					break;
				}
				
			}
			if(match_found==0){
				scratchpad_customers.push(c_data);
			}
			$('.schedulesp_'+drop_id+' .allocatedcust_'+customer_id).draggable({revert:false});
			$('.schedulesp_'+drop_id+' .allocatedcust_'+customer_id).remove();
			$('#no_of_cust_'+drop_id).text(schedules_customers[drop_id].length);
			voluntary_allocation.addScratchPadCustomers();
			voluntary_allocation.checkEmptySchedules();
		}
	},
	addScratchPadCustomers:function(){
		var customersHtmlLi = '';
		for(var j in scratchpad_customers){
			var cust = scratchpad_customers[j];
			customersHtmlLi += '<li class="dd-custom-item customersort  customersort_'+cust.id+'" data-customer-id="'+cust.id+'" data-voluntary-hours="'+cust.unallocated_hours+'">';
				customersHtmlLi += '<div class="dd-custom-handle">';
					
					customersHtmlLi += '<p style="text-align:left;float:left;margin:0">';
						customersHtmlLi += cust.customer_name;
					customersHtmlLi += '</p>';

					customersHtmlLi += '<p style="text-align:right;float:right;margin:0">';
						customersHtmlLi += cust.unallocated_hours;
					customersHtmlLi += '</p>';

				customersHtmlLi += '<div style="clear: both;"></div></div>';

			customersHtmlLi += '</li>';
		}
		$('#customersol_scratchpad').html(customersHtmlLi);
	},
	partnerVoluntarySchedulesCreates:function(data){
			
			if(data.error==null){
				data = data.success;
				if(localStorage.getItem('createschedule')==null || localStorage.getItem('createschedule')== undefined || localStorage.getItem('createschedule')==''){
					var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format('YYYY-MM');
					if(moment(data.date).format('YYYY-MM') == date){
						console.log('generate');
					}
				}
				else{
					var month = moment(data.date).month();
					month = month + 1;
					var year = moment(data.date).year();
					$('#schedule_calendar').fullCalendar( 'gotoDate',moment(data.date).format() ) ;
					voluntary_allocation.getSchedulesByDate(month,year);
				}
				localStorage.removeItem('createschedule');
			}
	},
	listenForData:function(){
		socket.off('partnerVoluntaryAllocationAdd');
		socket.on('partnerVoluntaryAllocationAdd',voluntary_allocation.partnerVoluntaryAllocationAdd);

		socket.off('partnerVoluntaryAllocationDelete');
		socket.on('partnerVoluntaryAllocationDelete',voluntary_allocation.partnerVoluntaryAllocationDelete);
		

		socket.off('partnerVoluntaryAllocationUpdate');
		socket.on('partnerVoluntaryAllocationUpdate',voluntary_allocation.partnerVoluntaryAllocationUpdate);

		socket.off('addCustomerToScratchPad');
		socket.on('addCustomerToScratchPad',voluntary_allocation.addCustomerToScratchPadFun);

		socket.off('partnerVoluntaryUpdateManagers');
		socket.on('partnerVoluntaryUpdateManagers',voluntary_allocation.partnerVoluntaryUpdateManagers);

		socket.off('partnerVoluntarySchedulesCreates');
		socket.on('partnerVoluntarySchedulesCreates',voluntary_allocation.partnerVoluntarySchedulesCreates);
	}
};


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Fuse",[],t):"object"==typeof exports?exports.Fuse=t():e.Fuse=t()}(this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=8)}([function(e,t,r){"use strict";e.exports=function(e){return"[object Array]"===Object.prototype.toString.call(e)}},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(5),a=r(7),s=r(4),c=function(){function e(t,r){var o=r.location,i=void 0===o?0:o,a=r.distance,c=void 0===a?100:a,h=r.threshold,l=void 0===h?.6:h,u=r.maxPatternLength,f=void 0===u?32:u,v=r.isCaseSensitive,d=void 0!==v&&v,p=r.tokenSeparator,g=void 0===p?/ +/g:p,y=r.findAllMatches,m=void 0!==y&&y,k=r.minMatchCharLength,x=void 0===k?1:k;n(this,e),this.options={location:i,distance:c,threshold:l,maxPatternLength:f,isCaseSensitive:d,tokenSeparator:g,findAllMatches:m,minMatchCharLength:x},this.pattern=this.options.isCaseSensitive?t:t.toLowerCase(),this.pattern.length<=f&&(this.patternAlphabet=s(this.pattern))}return o(e,[{key:"search",value:function(e){if(this.options.isCaseSensitive||(e=e.toLowerCase()),this.pattern===e)return{isMatch:!0,score:0,matchedIndices:[[0,e.length-1]]};var t=this.options,r=t.maxPatternLength,n=t.tokenSeparator;if(this.pattern.length>r)return i(e,this.pattern,n);var o=this.options,s=o.location,c=o.distance,h=o.threshold,l=o.findAllMatches,u=o.minMatchCharLength;return a(e,this.pattern,this.patternAlphabet,{location:s,distance:c,threshold:h,findAllMatches:l,minMatchCharLength:u})}}]),e}();e.exports=c},function(e,t,r){"use strict";var n=r(0),o=function e(t,r,o){if(r){var i=r.indexOf("."),a=r,s=null;-1!==i&&(a=r.slice(0,i),s=r.slice(i+1));var c=t[a];if(null!==c&&void 0!==c)if(s||"string"!=typeof c&&"number"!=typeof c)if(n(c))for(var h=0,l=c.length;h<l;h+=1)e(c[h],s,o);else s&&e(c,s,o);else o.push(c.toString())}else o.push(t);return o};e.exports=function(e,t){return o(e,t,[])}},function(e,t,r){"use strict";e.exports=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=[],n=-1,o=-1,i=0,a=e.length;i<a;i+=1){var s=e[i];s&&-1===n?n=i:s||-1===n||(o=i-1,o-n+1>=t&&r.push([n,o]),n=-1)}return e[i-1]&&i-n>=t&&r.push([n,i-1]),r}},function(e,t,r){"use strict";e.exports=function(e){for(var t={},r=e.length,n=0;n<r;n+=1)t[e.charAt(n)]=0;for(var o=0;o<r;o+=1)t[e.charAt(o)]|=1<<r-o-1;return t}},function(e,t,r){"use strict";var n=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;e.exports=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:/ +/g,o=new RegExp(t.replace(n,"\\$&").replace(r,"|")),i=e.match(o),a=!!i,s=[];if(a)for(var c=0,h=i.length;c<h;c+=1){var l=i[c];s.push([e.indexOf(l),l.length-1])}return{score:a?.5:1,isMatch:a,matchedIndices:s}}},function(e,t,r){"use strict";e.exports=function(e,t){var r=t.errors,n=void 0===r?0:r,o=t.currentLocation,i=void 0===o?0:o,a=t.expectedLocation,s=void 0===a?0:a,c=t.distance,h=void 0===c?100:c,l=n/e.length,u=Math.abs(s-i);return h?l+u/h:u?1:l}},function(e,t,r){"use strict";var n=r(6),o=r(3);e.exports=function(e,t,r,i){for(var a=i.location,s=void 0===a?0:a,c=i.distance,h=void 0===c?100:c,l=i.threshold,u=void 0===l?.6:l,f=i.findAllMatches,v=void 0!==f&&f,d=i.minMatchCharLength,p=void 0===d?1:d,g=s,y=e.length,m=u,k=e.indexOf(t,g),x=t.length,S=[],M=0;M<y;M+=1)S[M]=0;if(-1!==k){var b=n(t,{errors:0,currentLocation:k,expectedLocation:g,distance:h});if(m=Math.min(b,m),-1!==(k=e.lastIndexOf(t,g+x))){var _=n(t,{errors:0,currentLocation:k,expectedLocation:g,distance:h});m=Math.min(_,m)}}k=-1;for(var L=[],w=1,C=x+y,A=1<<x-1,I=0;I<x;I+=1){for(var O=0,F=C;O<F;){n(t,{errors:I,currentLocation:g+F,expectedLocation:g,distance:h})<=m?O=F:C=F,F=Math.floor((C-O)/2+O)}C=F;var P=Math.max(1,g-F+1),j=v?y:Math.min(g+F,y)+x,z=Array(j+2);z[j+1]=(1<<I)-1;for(var T=j;T>=P;T-=1){var E=T-1,K=r[e.charAt(E)];if(K&&(S[E]=1),z[T]=(z[T+1]<<1|1)&K,0!==I&&(z[T]|=(L[T+1]|L[T])<<1|1|L[T+1]),z[T]&A&&(w=n(t,{errors:I,currentLocation:E,expectedLocation:g,distance:h}))<=m){if(m=w,(k=E)<=g)break;P=Math.max(1,2*g-k)}}if(n(t,{errors:I+1,currentLocation:g,expectedLocation:g,distance:h})>m)break;L=z}return{isMatch:k>=0,score:0===w?.001:w,matchedIndices:o(S,p)}}},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(1),a=r(2),s=r(0),c=function(){function e(t,r){var o=r.location,i=void 0===o?0:o,s=r.distance,c=void 0===s?100:s,h=r.threshold,l=void 0===h?.6:h,u=r.maxPatternLength,f=void 0===u?32:u,v=r.caseSensitive,d=void 0!==v&&v,p=r.tokenSeparator,g=void 0===p?/ +/g:p,y=r.findAllMatches,m=void 0!==y&&y,k=r.minMatchCharLength,x=void 0===k?1:k,S=r.id,M=void 0===S?null:S,b=r.keys,_=void 0===b?[]:b,L=r.shouldSort,w=void 0===L||L,C=r.getFn,A=void 0===C?a:C,I=r.sortFn,O=void 0===I?function(e,t){return e.score-t.score}:I,F=r.tokenize,P=void 0!==F&&F,j=r.matchAllTokens,z=void 0!==j&&j,T=r.includeMatches,E=void 0!==T&&T,K=r.includeScore,$=void 0!==K&&K,J=r.verbose,N=void 0!==J&&J;n(this,e),this.options={location:i,distance:c,threshold:l,maxPatternLength:f,isCaseSensitive:d,tokenSeparator:g,findAllMatches:m,minMatchCharLength:x,id:M,keys:_,includeMatches:E,includeScore:$,shouldSort:w,getFn:A,sortFn:O,verbose:N,tokenize:P,matchAllTokens:z},this.setCollection(t)}return o(e,[{key:"setCollection",value:function(e){return this.list=e,e}},{key:"search",value:function(e){this._log('---------\nSearch pattern: "'+e+'"');var t=this._prepareSearchers(e),r=t.tokenSearchers,n=t.fullSearcher,o=this._search(r,n),i=o.weights,a=o.results;return this._computeScore(i,a),this.options.shouldSort&&this._sort(a),this._format(a)}},{key:"_prepareSearchers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];if(this.options.tokenize)for(var r=e.split(this.options.tokenSeparator),n=0,o=r.length;n<o;n+=1)t.push(new i(r[n],this.options));return{tokenSearchers:t,fullSearcher:new i(e,this.options)}}},{key:"_search",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1],r=this.list,n={},o=[];if("string"==typeof r[0]){for(var i=0,a=r.length;i<a;i+=1)this._analyze({key:"",value:r[i],record:i,index:i},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t});return{weights:null,results:o}}for(var s={},c=0,h=r.length;c<h;c+=1)for(var l=r[c],u=0,f=this.options.keys.length;u<f;u+=1){var v=this.options.keys[u];if("string"!=typeof v){if(s[v.name]={weight:1-v.weight||1},v.weight<=0||v.weight>1)throw new Error("Key weight has to be > 0 and <= 1");v=v.name}else s[v]={weight:1};this._analyze({key:v,value:this.options.getFn(l,v),record:l,index:c},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t})}return{weights:s,results:o}}},{key:"_analyze",value:function(e,t){var r=e.key,n=e.arrayIndex,o=void 0===n?-1:n,i=e.value,a=e.record,c=e.index,h=t.tokenSearchers,l=void 0===h?[]:h,u=t.fullSearcher,f=void 0===u?[]:u,v=t.resultMap,d=void 0===v?{}:v,p=t.results,g=void 0===p?[]:p;if(void 0!==i&&null!==i){var y=!1,m=-1,k=0;if("string"==typeof i){this._log("\nKey: "+(""===r?"-":r));var x=f.search(i);if(this._log('Full text: "'+i+'", score: '+x.score),this.options.tokenize){for(var S=i.split(this.options.tokenSeparator),M=[],b=0;b<l.length;b+=1){var _=l[b];this._log('\nPattern: "'+_.pattern+'"');for(var L=!1,w=0;w<S.length;w+=1){var C=S[w],A=_.search(C),I={};A.isMatch?(I[C]=A.score,y=!0,L=!0,M.push(A.score)):(I[C]=1,this.options.matchAllTokens||M.push(1)),this._log('Token: "'+C+'", score: '+I[C])}L&&(k+=1)}m=M[0];for(var O=M.length,F=1;F<O;F+=1)m+=M[F];m/=O,this._log("Token score average:",m)}var P=x.score;m>-1&&(P=(P+m)/2),this._log("Score average:",P);var j=!this.options.tokenize||!this.options.matchAllTokens||k>=l.length;if(this._log("\nCheck Matches: "+j),(y||x.isMatch)&&j){var z=d[c];z?z.output.push({key:r,arrayIndex:o,value:i,score:P,matchedIndices:x.matchedIndices}):(d[c]={item:a,output:[{key:r,arrayIndex:o,value:i,score:P,matchedIndices:x.matchedIndices}]},g.push(d[c]))}}else if(s(i))for(var T=0,E=i.length;T<E;T+=1)this._analyze({key:r,arrayIndex:T,value:i[T],record:a,index:c},{resultMap:d,results:g,tokenSearchers:l,fullSearcher:f})}}},{key:"_computeScore",value:function(e,t){this._log("\n\nComputing score:\n");for(var r=0,n=t.length;r<n;r+=1){for(var o=t[r].output,i=o.length,a=0,s=1,c=0;c<i;c+=1){var h=e?e[o[c].key].weight:1,l=1===h?o[c].score:o[c].score||.001,u=l*h;1!==h?s=Math.min(s,u):(o[c].nScore=u,a+=u)}t[r].score=1===s?a/i:s,this._log(t[r])}}},{key:"_sort",value:function(e){this._log("\n\nSorting...."),e.sort(this.options.sortFn)}},{key:"_format",value:function(e){var t=[];this.options.verbose&&this._log("\n\nOutput:\n\n",JSON.stringify(e));var r=[];this.options.includeMatches&&r.push(function(e,t){var r=e.output;t.matches=[];for(var n=0,o=r.length;n<o;n+=1){var i=r[n];if(0!==i.matchedIndices.length){var a={indices:i.matchedIndices,value:i.value};i.key&&(a.key=i.key),i.hasOwnProperty("arrayIndex")&&i.arrayIndex>-1&&(a.arrayIndex=i.arrayIndex),t.matches.push(a)}}}),this.options.includeScore&&r.push(function(e,t){t.score=e.score});for(var n=0,o=e.length;n<o;n+=1){var i=e[n];if(this.options.id&&(i.item=this.options.getFn(i.item,this.options.id)[0]),r.length){for(var a={item:i.item},s=0,c=r.length;s<c;s+=1)r[s](i,a);t.push(a)}else t.push(i.item)}return t}},{key:"_log",value:function(){if(this.options.verbose){var e;(e=console).log.apply(e,arguments)}}}]),e}();e.exports=c}])});
