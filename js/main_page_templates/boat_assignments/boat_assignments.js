var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
	var date_format_f = date_format_partner.toLowerCase();
}
else{
	var date_format_f = date_format.toLowerCase();
}
var calendar_mode = 'calendar';
var ba_td = {};
var ba_dt;
var ba_custs;
var ba_all_custs;
var ba_all_custs_byid = {};
var ba_sort_custs;
var schedules_customers = {};
var scratchpad_customers = [];
var switch_save = [];
var current_events;
var thism = [];
var available_events = [];
var boat_assignments_x = {
  aInternal: 0,
  aListener: function(val) {},
  set a(val) {
    this.aInternal = val;
    this.aListener(val);
  },
  get a() {
    return this.aInternal;
  },
  registerListener: function(listener) {
    this.aListener = listener;
  }
}

var boat_assignments = {
	start:function(){
		boat_assignments.listenForData();
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
			from:'calendar',
			getTranslationsDataArray:['Dashboard','Boat storage','Assignments','Allocation','alert message','Search','Customers','Customer already exists in the event','This month','No events found','Start date and time','End date and time','Type','$dateoclock','$Up','$Out','Name','No customers available','Customer already exists in the event','$customer_exists_in_event','$cust_add_event_success','Success','$cust_move_event_success','SMS notification sent','Email notification sent','Action pending','Action cannot be carried out','$boat_event_not_applicable','Delete','Cancel','$del_boat_alloc','$remove_participant_success','Send notifications','Add boat storage event','Actions','Add boat','View all scheduled','View month by month','$no_boat_event','No other boat event found','No boat','Cancelled','Completed','Allocated','Unallocated','Status','Edit'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getboateventAlloc.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ba_dt = complet_data.response.response;
				ba_td = complet_data.response.response.translationsData;
				boat_assignments_x.a++;
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		boat_assignments_x.registerListener(function(val) {
		  if(boat_assignments_x.a == 2){
		  	boat_assignments_x.a = 0;
		  	boat_assignments.createHtml(ba_dt);
		  }	
		});
		$.ajaxSetup({ cache: true });

		var scripts = [
			host_url+'app/webroot/plugins/fuse/fuse.js',
		];
		var queue = scripts.map(function(script) {
		    return $.getScript(script);
		});

		$.when.apply(null, queue).done(function() {
			boat_assignments_x.a++;
		});

		doAjax(params);
		return;
	},
	getCustomers:function(id){
		var loader = `<li class="dd-custom-item loader_ig" style="text-align:center">
										<img src="`+ba_dt.translationsData.loaderurl+`">
									</li>`;
		$('#customersol').append(loader);
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			partner_boatstore_event_id:id
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getCustomers.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			$('.loader_ig').remove();
		}
		params['successCallbackFunction'] = function (complet_data){
	
			if(complet_data.response.status == 'success'){
				var ba_custsz = complet_data.response.response.customers;

				ba_custs = [];
				for(var j in ba_custsz){
					var obj = ba_custsz[j].Customer;
					obj['cba'] = ba_custsz[j].cba;
					obj['ps'] = ba_custsz[j].ps;

					ba_custs.push(obj);
				}
				ba_all_custs = ba_custs;
				ba_sort_custs = ba_custs;
				if(ba_custs.length != 0){
					//$('#calendat').attr('class','').addClass('span9');
					//$('#customer_widget').show();
					$('.customersort').remove();
					boat_assignments.customersHtml();
				}
				else{
					//$('#customer_widget').hide();
					//$('#calendat').attr('class','');
					$('.customersort').remove();
					//showAlertMessage(ba_td.Nocustomersavailable,'error',ba_td.alertmessage);
					
				}
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){

		ba_td.$no_boat_event = ba_td.$no_boat_event.replace('%link_start%',`<a onclick="new_custom_popup2('600','popups','add_boat_event',{from_page:'allocation'});">`).replace('%link_end%','</a>');
		ba_dt.translationsData.$no_boat_event = ba_td.$no_boat_event;

		ba_dt.translationsData.dashboardurl = base_url+'dashboard/index';
		ba_dt.translationsData.loaderurl = host_url+'app/webroot/img/loading.gif';

		var template = document.getElementById('boat_assignments_template').innerHTML;
		var compiledRendered = Template7(template, ba_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		hideProcessingImage();
		boat_assignments.bindEvents(ba_dt.boatstore_schedule);
		after_main_page();
	},
	bindEvents:function(){
		available_events = ba_dt.avail_events;


		if(ba_dt.pending_notifications > 0){
			$('#boat_assignments_save').show();
		}
		else{
			$('#boat_assignments_save').hide();
		}
		boat_assignments.bindCalendar();
		if(available_events.length == 0){
			$('#no_events').show();
			$('#schedule_calendar').hide();
		}
		else{
			boat_assignments.renderEvents(ba_dt.boatstore_schedule);
		}

		$('#customers_search').keyup(function(){
			var search = $('#customers_search').val();
			
			if(search!='' && search!=null && search!=undefined){
				boat_assignments.doCustomerSearch(search,ba_sort_custs);
			}
			else{
				boat_assignments.customersHtml();
			}
		});	

		var w = parseInt($(window).outerHeight()) - parseInt($('.header').outerHeight()) - parseInt($('.footer').outerHeight()) - parseInt($('#customer_lists ol:first').outerHeight()) - parseInt($('.portlet-title').outerHeight()) -40;

		$("#customersol_scroll").slimScroll({
			height: w
		});	

		$('#customersol').css('height',w+'px');

		$('#customersol').droppable({
			accept: '.allocatedcust',
			out:function( event, ui ){

			},
			over:function( event, ui ){

			},
			drop: function( events, ui ) {
				var applic_id = $(ui.draggable).attr('data-applic-id');
				var id = $(ui.draggable).attr('data-primary-key');
				var drop_id = $(ui.draggable).attr('data-drop-id');
				var slip_id = $(ui.draggable).attr('data-slip-id');
				var customer_id = $(ui.draggable).attr('data-customer-id');
				boat_assignments.removeAlloc(id,applic_id,drop_id,slip_id,customer_id);

				$(ui.draggable).draggable({ revert: false });
			},
		});
	},
	renderEvents:function(data){
		current_events = data;
		var html ='';
		if(data.length!=0){
			html += '<div id="droppable_schedules">';
				html += '<div class="span12 schedules_label">';

					html += '<table class="table">';
						html +='<tr>';
							html += '<th style="margin:0">';
								html += ba_td.Startdateandtime;
							html += '</th>';

							// html += '<th style="margin:0">';
							// 	html += ba_td.Enddateandtime;
							// html += '</th>';

							html += '<th style="margin:0">';
								html += ba_td.Name;
							html += '</th>';

							html += '<th style="margin:0">';
								html += ba_td.Type;
							html += '</th>';

							html += '<th>';
								html += ba_td.Customers;
							html += '</th>';

							html += '<th>';
								html += ba_td.Status;
							html += '</th>';

							html += '<th style="width:90px;">&nbsp;</th>';
							
						html +='</tr>';
					html += '</table>';

					for(var j in data){
							var pbe = data[j].PartnerBoatstoreEvent;
							var pba = data[j].PartnerBoatstoreAllocation;
							var disabled = 0;
							var today_date = moment(ba_dt.todaydate);
							var end_datetime = moment(pbe.end_datetime);
							var status = ba_td.Noboat;
							//today_date.unix() > end_datetime.unix()
							if( pbe.status == 'can' || pbe.status == 'comp' ){
								disabled = 1;
								if( pbe.status == 'can'){
									status = ba_td.Cancelled;
								}
								else if(pbe.status == 'comp'){
									status = ba_td.Completed;
								}
							}
							schedules_customers[pbe.id] = [];



							if(disabled == 0){
								html += '<div class="schedules schedulesdrop span12 schedulesp_'+pbe.id+'" data-id="'+pbe.id+'">';
						
								if(pba.length!=0){
									status = ba_td.Allocated;
									html += '<table class="header_schedules table alloc_event">';
								}
								else{
									status = ba_td.Unallocated;
									html += '<table class="header_schedules table unalloc_event">';
								}					
							}
							else{							
								html += '<div class="schedules span12 schedulesp_'+pbe.id+'" data-id="'+pbe.id+'" >';
								html += '<table class="header_schedules table completed_event">';		
							}
									html += '<tbody>';
										html +='<tr  onclick="boat_assignments.minmax('+pbe.id+')">';
										
											var start_date = convertDateIntoSiteFormat(pbe.start_datetime);
											var start_time = moment(pbe.start_datetime).format('HH:mm');
											var startstr = ba_td.$dateoclock;
											startstr = startstr.replace('%date%',start_date).replace('%time%',start_time);

											html += '<td>';
												html += startstr;
											html += '</td>';

											// var end_date = convertDateIntoSiteFormat(pbe.end_datetime);
											// var end_time = moment(pbe.end_datetime).format('HH:mm');
											// var endstr = ba_td.$dateoclock;
											// endstr = endstr.replace('%date%',end_date).replace('%time%',end_time);
										
											// html += '<td>';
											// 	html += endstr;
											// html += '</td>';

											html += '<td>';
												html += pbe.name;
											html += '</td>';

											html += '<td>';
												html += (pbe.type == 'up')?ba_td.$Up:ba_td.$Out;
											html += '</td>';

											html += '<td style="margin:0" id="no_of_cust_'+pbe.id+'">';
												html += pba.length;
											html += '</td>';

											html += '<td>';
												html += status;
											html += '</td>';

											html += '<td class="p" style="width:90px;">';
												
												html += `<button class="btn mini edit_boat_event" onclick="new_custom_popup2('600','popups','add_boat_event',{from_page:'allocation',from:'edit',data:{id:`+pbe.id+`}});"><i class="icon-edit " ></i>&nbsp;`+ba_td.Edit+`</button>`;
												html += '&nbsp;';
												html += `<i class="icon-angle-down" ></i>`;
												
											html += '</td>';

										html += '</tr>';
									html += '</tbody>';
								html += '</table>';

								if(disabled == 1 ){ 
									if(pba.length!=0){
										html += '<div class="shide schedulesd alloc_event schedulesd_'+pbe.id+'">';
									}
									else{
										html += '<div class="shide schedulesd unalloc_event schedulesd_'+pbe.id+'">';
									}
								}
								else{
									html += '<div class="shide schedulesd completed_event schedulesd_'+pbe.id+'">';		
								}

								html += '<ul class="schedulesul scheduleul'+pbe.id+'">';
									if(pba.length==0){
										html += '<li class="schedulesnoc_'+pbe.id+'">'+ba_td.Nocustomersavailable+'</li>';
									}
									else{
										html += '<li class="schedulesnoc_'+pbe.id+'" style="display:none">'+ba_td.Nocustomersavailable+'</li>';
										for(var k in pba){
											var r = pba[k];
											
											schedules_customers[pbe.id].push({customer_id:r.customer_id,customer_slip_id:r.customer_slip_id});
											if(disabled == 0){
												html += '<li class="allocatedcust allocatedcustdrag allocatedcust_'+r.customer_id+'" data-customer-id="'+r.customer_id+'" data-drop-id="'+r.partner_boatstore_event_id+'" data-primary-key="'+r.id+'" data-slip-id="'+r.customer_slip_id+'" data-applic-id="'+r.customer_boatstore_application_id+'">';
											}
											else{
												html += '<li class="allocatedcust  allocatedcust_'+r.customer_id+'" data-customer-id="'+r.customer_id+'" data-drop-id="'+r.partner_boatstore_event_id+'" data-primary-key="'+r.id+'" data-slip-id="'+r.customer_slip_id+'" data-applic-id="'+r.customer_boatstore_application_id+'">';
											}

												html += '<p style="text-align:left;float:left;margin:0;width:100%">';
													html += r['Customer']['customer_name']+' '+'('+r.PartnerSlip.slip_name+')';

														var sns = ba_td.SMSnotificationsent;
														var ens = ba_td.Emailnotificationsent;
														var ap = ba_td.Actionpending;
														var acbco = ba_td.Actioncannotbecarriedout;

														html += '<span style="float: right;">';
														
														if("pbl" in r && r.pbl.sms == 1){
															html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+sns+'" >';
																html += '<i class="icon-comment icon_sp icon_sp_green"></i>';
															html += '</span>';
														}
														else if("pbl" in r && r.pbl.sms == 0){
															html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
																html += '<i class="icon-comment icon_sp icon_sp_gray"></i>';
															html += '</span>';
														}
														else{
															html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ap+'" >';
																html += '<i class="icon-comment icon_sp"></i>';
															html += '</span>';
														}

														if("pbl" in r && r.pbl.email == 1){
															html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ens+'" >';
																html += '<i class="icon-envelope icon_sp icon_sp_green"></i>';
															html += '</span>';
														}
														else if("pbl" in r && r.pbl.email == 0){
															html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
																html += '<i class="icon-envelope icon_sp icon_sp_gray"></i>';
															html += '</span>';
														}
														else{
															html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ap+'" >';
																html += '<i class="icon-envelope icon_sp act_pend"></i>';
															html += '</span>';
														}

														html += '<span class="remove" onclick="boat_assignments.removeAlloc('+r.id+','
														+r.customer_boatstore_application_id+','+r.partner_boatstore_event_id+','+r.customer_slip_id+','+r.customer_id+')">';
															html += '<i class="icon-remove" style="color:#d64635"></i>';
														html += '</span>';

														html += '</span>';
												html += '</p>';
											html += '</li>';
											
										}
									}
								html += '</ul>';

								html += '</div>';
							html += '</div>';
					}

				html += '</div>';
			html += '</div>';

			$('#droppable_schedules').remove();
			$('#no_events').hide();
			$('#schedule_calendar').show().append(html);

			boat_assignments.makedragdrop();
		}
		else{
			 html += '<div id="droppable_schedules">';
				html += '<div class="alert inboxend alert-info" style="text-align:center;">';
					html += ba_td.Noeventsfound;
				html += '</div>';
			html += '<div>';
			setTimeout(function(){
				$('#droppable_schedules').remove();
				$('#schedule_calendar').append(html);
			});							
			return;
		}
	},
	makedragdrop:function(){


		$('.popovers').popover();
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

		$('.schedulesdrop').each(function(){
			var d = $(this).attr('data-id');

			$(this).droppable({
				accept: '.allocatedcust,.customersorte_'+d,
				out:function( event, ui ){

					$('.header_schedules,.schedules').removeClass('schedules_hover');
				},
				over:function( event, ui ){
					var countDown = function(th){
						$(th).addClass('schedules_hover');
						$(th).find('table.header_schedules').addClass('schedules_hover')
					}
					setTimeout(countDown,100,this);			
				},
				drop: function( events, ui ) {
					$('.header_schedules,.schedules').removeClass('schedules_hover');

					var drop_id = $(events.target).attr('data-id');
					var customer_id = $(ui.draggable).attr('data-customer-id');
					var customer_slip_id = $(ui.draggable).attr('data-slip-id');
					var applic_id = $(ui.draggable).attr('data-applic-id');

					if($(ui.draggable).hasClass('allocatedcust')){
						var ddi = $(ui.draggable).attr('data-drop-id');
						if(drop_id==ddi){
							return;
						}
					}
					
					for(var j in schedules_customers[drop_id]){
						var k = schedules_customers[drop_id][j];
						if(
							schedules_customers[drop_id][j]['customer_id'] == customer_id
							&& schedules_customers[drop_id][j]['customer_slip_id'] == customer_slip_id
						){
							showAlertMessage(ba_td.Customeralreadyexistsintheevent+'.','error',ba_td.alertmessage);
							return;
						}
					}

					if($(ui.draggable).hasClass('allocatedcust')){
						var from_event = $(ui.draggable).attr('data-drop-id');
						var from_slip = $(ui.draggable).attr('data-slip-id');

						var primary_key = $(ui.draggable).attr('data-primary-key');
						

						$('.allocatedcust_'+customer_id+'[data-slip-id="'+from_slip+'"]').draggable({ revert: false });
						//$('.allocatedcust_'+customer_id+'[data-slip-id="'+from_slip+'"]').remove();
						var res = {customer_id:customer_id,customer_slip_id:customer_slip_id};
						res.partner_boatstore_event_id = drop_id;
						res.id = primary_key;
						res.applic_id = applic_id;
						var red = 0;
						if(1 != 1){ ///show some error
							red = 1;
						}
						boat_assignments.updateOnDrop(res,from_event,from_slip);
					}
					else{
						var from_slip = $(ui.draggable).attr('data-slip-id');
						var res = {customer_id:customer_id,customer_slip_id:customer_slip_id};
						res.partner_boatstore_event_id = drop_id;
						res.applic_id = applic_id;
						var red = 0;

						if(1 != 1){ ///show some error
							red=1;
						}
						boat_assignments.saveOnDrop(res,from_slip);
						
						
						$('.customersort_'+customer_id+'[data-slip-id="'+from_slip+'"]').draggable({ revert: false });
						// $('.customersort_'+customer_id+'[data-slip-id="'+from_slip+'"]').remove();
					}


				}
			});
		});
		
	},
	saveOnDrop:function(res,from_slip){
		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			partner_boatstore_event_id:res.partner_boatstore_event_id,
			customer_slip_id:res.customer_slip_id,
			customer_id:res.customer_id,
			customer_boatstore_application_id:res.applic_id,
			emithis:{from_slip:from_slip}		
		};
		
		console.log('params',params);
		var total_params = {
			data:params,
			model:'partnerBoatstoreAllocations',
			action:'addedit',
			emitevent:'partnerBoatstoreAllocationaddedit',
		};
		
		socket.once('partnerBoatstoreAllocationaddedit',function(data){
			console.log('data',data);
			if(data.error==null || data.error==undefined || data.error==''){
				call_toastr('success',ba_td.Success, ba_td[data.success.msg]);
			}
			else{
				showAlertMessage(ba_td[data.error.msg],'error',ba_td.AlertMessage);
				return;
			}
		});
		socket.emit('crud', total_params);	
	},
	updateOnDrop:function(res,from_event,from_slip){
		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			partner_boatstore_event_id:res.partner_boatstore_event_id,
			customer_id:res.customer_id,	
			customer_slip_id:res.customer_slip_id,
			id:res.id,
			customer_boatstore_application_id:res.applic_id,
			emithis:{from_event:from_event,from_slip:from_slip}
		};

	
		

		var total_params = {
			data:params,
			model:'partnerBoatstoreAllocations',
			action:'addedit',
			emitevent:'partnerBoatstoreAllocationEdit',
		};
	
		socket.once('partnerBoatstoreAllocationEdit',function(data){
			console.log('success',data.success);
			if(data.error==null || data.error==undefined || data.error==''){
				call_toastr('success',ba_td.Success, ba_td[data.success.msg]);

				if(data.error==null){
					data = data.success;

					var drop_id = data.data.partner_boatstore_event_id;
					var old_id = '';
					// if("emithis" in data.data){
					// 	old_id = data.data.emithis.from_event;
					// 	boat_assignments.minmax(old_id);
					// }
					// else{
					// 	boat_assignments.minmax(drop_id);
					// }			
				}
			}
			else{
				showAlertMessage(ba_td[data.error.msg],'error',ba_td.AlertMessage);
				return;
			}
		});
		socket.emit('crud', total_params);
	},
	getCustomerData:function(customer_id){
		var retobj = {};
		if(customer_id==null || customer_id=='' || customer_id==undefined){
			return retobj;
		}

		if($.isEmptyObject(ba_all_custs_byid)==false){
			return ba_all_custs_byid[customer_id];
		}
		else{
			var all_customers =  ba_all_custs;
			for(var j in all_customers){
				var cust = all_customers[j];
				ba_all_custs_byid[cust.id] = {
					customer_name:cust.customer_name,
					customer_id:cust.id,
					customer_number:cust.customer_number,
				};
			}
			return ba_all_custs_byid[customer_id];
		}
	},
	minmax:function(id,from=''){
		$('.schedulesd:not(.schedulesd_'+id+')').addClass('shide');
		$('.customersort').remove();
		if($('.schedulesd_'+id).hasClass('shide') || from == 'show'){
			$('.schedulesd_'+id).removeClass('shide');
			boat_assignments.getCustomers(id);
		}
		else{
			$('.schedulesd_'+id).addClass('shide');
			//$('#calendat').attr('class','');
			//$('#customer_widget').hide();
			
		}
		
		boat_assignments.adjustEvents();
	},
	adjustEvents:function(){

	},
	bindCalendar:function(){
		$('#schedule_calendar').fullCalendar({
			contentHeight:0,
			locale:lang,
			lang:lang,
			buttonText:{
				today: ba_td.Thismonth ,
			},			 
			header:{
               right: 'prev,next',
               center: '',
               left: 'title',
            },
            showNonCurrentDates:false
		});
		$('.change_mode').remove();
		var toggle = `<button type="button" onclick="boat_assignments.change_mode('all');" class="btn purple change_mode" style="height:36px;min-width: 141px;">`+ba_td.Viewallscheduled+`</button>`;
		$('button.fc-next-button').after(toggle);

		$('button.fc-prev-button').off();
		$('#schedule_calendar').on('click', 'button.fc-prev-button', function() {
			var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
			var year = moment(date).format('YYYY').toString();
			var month = moment(date).format('MM').toString();

			var yearmonth = year+month;
			yearmonth = parseInt(yearmonth);
			
			var rev = available_events.concat([]);
			rev = rev.reverse();

			var found = 0;
			for(var j in rev){

				if(parseInt(rev[j]['ids']) < yearmonth){
					var dates = moment(rev[j]['year']+'-'+rev[j]['month']);
					found = 1;
					$('#schedule_calendar').fullCalendar( 'gotoDate' ,dates);
					boat_assignments.getevents(dates,'calendar');
					break;
				}
			}

			if(found == 0){
				showAlertMessage(ba_td.Nootherboateventfound,'error',ba_td.alertmessage);
				return;
			}
			
			// $('#schedule_calendar button.fc-today-button').click(function(){
			// 	var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
			// 	boat_assignments.getevents(date,'today');
			// });
		});

		$('button.fc-next-button').off();
		$('#schedule_calendar').on('click', 'button.fc-next-button', function() {
			var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
			var year = moment(date).format('YYYY').toString();
			var month = moment(date).format('MM').toString();

			var yearmonth = year+month;
			yearmonth = parseInt(yearmonth);
			
			var rev = available_events;

			var found = 0;
			for(var j in rev){

				if(parseInt(rev[j]['ids']) > yearmonth){
					var dates = moment(rev[j]['year']+'-'+rev[j]['month']);
					found = 1;
					$('#schedule_calendar').fullCalendar( 'gotoDate' ,dates);
					boat_assignments.getevents(dates,'calendar');
					break;
				}
			}

			if(found == 0){
				showAlertMessage(ba_td.Nootherboateventfound,'error',ba_td.alertmessage);
				return;
			}
			
			// else{
			// 	try{
			// 		var rev = available_events;
			// 		for(var j in rev){

			// 		}
			// 	}
			// 	catch(e){}

			// }
			//boat_assignments.getevents(date,'next');

			// $('#schedule_calendar button.fc-today-button').click(function(){
			// 	var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
			// 	boat_assignments.getevents(date,'today');
			// });
		});
	},
	change_mode:function(from){
		$('.change_mode').remove();
		if(from == 'calendar'){
			calendar_mode = 'calendar';
			$('button.fc-prev-button,button.fc-next-button,.fc-left').show();
			var toggle = `<button type="button" onclick="boat_assignments.change_mode('all');" class="btn purple change_mode" style="height:36px;min-width: 141px;">`+ba_td.Viewallscheduled+`</button>`;
			$('button.fc-next-button').after(toggle);
			var date = moment().format('YYYY-MM-DD');
			boat_assignments.getevents(date,'calendar');
		}
		else {
			calendar_mode = 'all';
			$('button.fc-prev-button,button.fc-next-button,.fc-left').hide();
			var toggle = `<button type="button" onclick="boat_assignments.change_mode('calendar');" class="btn purple change_mode" style="height:36px;min-width: 141px;">`+ba_td.Viewmonthbymonth+`</button>`;
			$('button.fc-next-button').after(toggle);
			boat_assignments.getevents('','all');    
		}
	},
	getevents:function(date,from){
		
		
		$('.customersort').remove();
		//$('#customer_widget').hide();
		//$('#calendat').attr('class','');
		if(from == 'calendar'){
			var month = moment(date).month();
			month = month + 1;
			var year = moment(date).year();
		}
		else{
			var month = '';
			var year = '';
		}
		for (var i = 0; i < thism.length; i++) {
		  clearTimeout(thism[i]);
		}
		thism = [];	
		thism.push(
	        setTimeout(function(){
	        	boat_assignments.getEventsByDate(month,year,from)	
        }, 10));
	},
	getEventsByDate:function(month,year,from){
		var m = month;
		if(m.toString().length == 1){
			m = '0'+m.toString();
		}


		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			month:month,
			year:year,
			from:from,
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getboateventAlloc.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				if(complet_data.response.response.pending_notifications > 0){
					$('#boat_assignments_save').show();
				}
				else{
					$('#boat_assignments_save').hide();
				}

				available_events = complet_data.response.response.avail_events;

				if(from == 'all'){
					$('button.fc-prev-button,button.fc-next-button,.fc-left').hide();
				}
				else{
					$('button.fc-prev-button,button.fc-next-button,.fc-left').show();
					$('#schedule_calendar').fullCalendar( 'gotoDate' ,moment(year+'-'+m));
				}

				if(available_events.length == 0){
					$('#no_events').show();
					$('#schedule_calendar').hide();
				}
				else{
					boat_assignments.renderEvents(complet_data.response.response.boatstore_schedule,complet_data.response.response.from);
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_dt.translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_dt.translationsData.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	listenForData:function(){
		socket.off('partnerBoatstoreAllocationaddedit');
		socket.on('partnerBoatstoreAllocationaddedit',boat_assignments.partnerBoatstoreAllocationaddedit);

		socket.off('partnerBoatstoreAllocationEdit');
		socket.on('partnerBoatstoreAllocationEdit',boat_assignments.partnerBoatstoreAllocationaddedit);

		socket.off('partnerBoatstoreAllocationdelete');
		socket.on('partnerBoatstoreAllocationdelete',boat_assignments.partnerBoatstoreAllocationdelete);

		socket.off('PartnerBoatstoreEventsDelete');
		socket.on('PartnerBoatstoreEventsDelete',boat_assignments.refreshData);

	},
	refreshData:function(data){
		if("available_events" in data.success && checkNull(data.success.available_events) != ''){
			avail_events = data.success.available_events;
		}
		else{
			avail_events = [];
		}
		
		
		if(calendar_mode == 'all'){
    		boat_assignments.getevents('','all');
    	}
    	else{
    		var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
			var year = moment(date).format('YYYY').toString();
			var month = moment(date).format('MM').toString();

			var yearmonth = year+month;
			yearmonth = parseInt(yearmonth);
			
			var rev = available_events.concat([]);

			var found = 0;
			for(var j in rev){

				if(parseInt(rev[j]['ids']) == yearmonth){
					var dates = moment(rev[j]['year']+'-'+rev[j]['month']);
					found = 1;
					$('#schedule_calendar').fullCalendar( 'gotoDate' ,dates);
					boat_assignments.getevents(dates,'calendar');
					break;
				}
			}

			if(found == 0 && avail_events.length != 0){
				var dates = moment(rev[0]['year']+'-'+rev[0]['month']);
				$('#schedule_calendar').fullCalendar( 'gotoDate' ,dates);
				boat_assignments.getevents(dates,'calendar');
			}
			else if(available_events.length == 0){
				$('#no_events').show();
				$('#schedule_calendar').hide();
			}
    	}
	},
	partnerBoatstoreAllocationaddedit:function(data){
		if(data.error==null){
			data = data.success;
			if(data.data.pending_notifications > 0){
				$('#boat_assignments_save').show();
			}
			else{
				$('#boat_assignments_save').hide();
			}


			var drop_id = data.data.partner_boatstore_event_id;
			var old_id = '';
			if("emithis" in data.data){
				old_id = data.data.emithis.from_event;
			}

			schedules_customers[drop_id].push({customer_id:data.data.customer_id,customer_slip_id:data.data.customer_slip_id});
			$('#no_of_cust_'+drop_id).text(schedules_customers[drop_id].length);
			

			if(schedules_customers[drop_id].length > 0){
				$('#schedulesnoc_'+drop_id).hide();
				$('.schedulesp_'+drop_id+' .header_schedules').removeClass('unalloc_event').addClass('alloc_event');
			}
			else{
				$('#schedulesnoc_'+drop_id).show();
				$('.schedulesp_'+drop_id+' .header_schedules').removeClass('alloc_event').addClass('unalloc_event');
			}

			if(checkNull(old_id) != '' && old_id in schedules_customers){
				for(var j in schedules_customers[old_id]){
					if(schedules_customers[old_id][j]['customer_id'] ==data.data.customer_id){
						schedules_customers[old_id].splice(j,1);
						break;
					}
				}
			
				if(schedules_customers[old_id].length > 0){
					$('#schedulesnoc_'+old_id).hide();
					$('.schedulesp_'+old_id+' .header_schedules').removeClass('unalloc_event').addClass('alloc_event');
				}
				else{
					$('#schedulesnoc_'+drop_id).show();
					$('.schedulesp_'+old_id+' .header_schedules').removeClass('alloc_event').addClass('unalloc_event');
				}
				$('#no_of_cust_'+old_id).text(schedules_customers[old_id].length);
			}

			boat_assignments.updateCustomerAllocations(data);
			// if($('.schedulesd_'+drop_id).hasClass('shide')){
			// 	boat_assignments.minmax(old_id);
			// }
			var id = $('.schedulesd:not(.shide)').parent().attr('data-id');
			if(checkNull(id) != ''){
				boat_assignments.minmax(id,'show');
			}
		}
	},
	updateCustomerAllocations:function(data){

		var r = data.data;
		
		var old_id = '';
		var old_slip_id = '';
		if("emithis" in data.data){
			old_id = data.data.emithis.from_event;
			old_slip_id = data.data.emithis.from_slip;
		}

		var sns = ba_td.SMSnotificationsent;
		var ens = ba_td.Emailnotificationsent;
		var ap = ba_td.Actionpending;
		var acbco = ba_td.Actioncannotbecarriedout;
		
		var html = '';
		html += '<li class="allocatedcust  allocatedcust_'+r.customer_id+'" data-customer-id="'+r.customer_id+'" data-drop-id="'+r.partner_boatstore_event_id+'" data-primary-key="'+r.id+'" data-slip-id="'+r.customer_slip_id+'" data-applic-id="'+r.customer_boatstore_application_id+'">';
			html += '<p style="text-align:left;float:left;margin:0;width:100%">';
				html += r['Customer']['customer_name']+' '+'('+r['PartnerSlip']['slip_name']+')';

					html += '<span style="float: right;">';
						if("pbl" in r && r.pbl.sms == 1){
							html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+sns+'" >';
								html += '<i class="icon-comment icon_sp icon_sp_green"></i>';
							html += '</span>';
						}
						else if("pbl" in r && r.pbl.sms == 0){
							html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
								html += '<i class="icon-comment icon_sp icon_sp_gray"></i>';
							html += '</span>';
						}
						else{
							html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ap+'" >';
								html += '<i class="icon-comment icon_sp"></i>';
							html += '</span>';
						}

						if("pbl" in r && r.pbl.email == 1){
							html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+sns+'" >';
								html += '<i class="icon-envelope icon_sp icon_sp_green"></i>';
							html += '</span>';
						}
						else if("pbl" in r && r.pbl.email == 0){
							html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+acbco+'" >';
								html += '<i class="icon-envelope icon_sp_gray"></i>';
							html += '</span>';
						}
						else{
							html += '<span class="popovers" data-trigger="hover" data-container="body" data-placement="bottom" data-content="'+ap+'" >';
								html += '<i class="icon-envelope icon_sp act_pend"></i>';
							html += '</span>';
						}

						html += '<span class="zz remove" onclick="boat_assignments.removeAlloc('+r.id+','+r.customer_boatstore_application_id+','+r.partner_boatstore_event_id+','+r.customer_slip_id+','+r.customer_id+')">';
							html += '<i class="icon-remove" style="color:#d64635"></i>';
						html += '</span>';
					html += '</span>';

			html += '</p>';
		html += '</li>';



		//check empty condition
		if(checkNull(old_id) != '' || checkNull(old_slip_id) != ''){
			if(checkNull(old_id) != '' && checkNull(old_slip_id) != ''){
				$('li.allocatedcust_'+r.customer_id+'[data-drop-id="'+old_id+'"][data-slip-id="'+old_slip_id+'"]').remove();
				$('li.customersort_'+r.customer_id+'[data-drop-id="'+old_id+'"][data-slip-id="'+old_slip_id+'"]').remove();
			}
			else if(checkNull(old_slip_id) != ''){
				$('.schedulesp_'+r.partner_boatstore_event_id+' li.allocatedcust_'+r.customer_id+'[data-slip-id="'+old_slip_id+'"]').remove();
				$('.schedulesp_'+r.partner_boatstore_event_id+' li.customersort_'+r.customer_id+'[data-slip-id="'+old_slip_id+'"]').remove();
			}
			else if(checkNull(old_id) != ''){
				$('li.allocatedcust_'+r.customer_id+'[data-drop-id="'+old_id+'"]').remove();
				$('li.customersort_'+r.customer_id+'[data-drop-id="'+old_id+'"]').remove();
			}
		}
		

		$('.schedulesnoc_'+r.partner_boatstore_event_id).hide();
		$('.scheduleul'+r.partner_boatstore_event_id).append(html);

		$('.allocatedcust_'+r.customer_id).draggable({
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

		$('.popovers').popover();

	},
	customersHtml:function(customers='',manualsearch=''){
		
		$('#customersol').html('');
		$('.allocatedcust').removeClass('border_orange');
		$('.schedules').removeClass('border_orange_solid');
		$('.schedulesd').removeClass('border_none');
		var customersHtmlLi = '';
		if(customers==''){
			for(var j in ba_sort_custs){
				var cust = ba_sort_custs[j];
				
				if(cust.cba.preferred == 1){
					customersHtmlLi += '<li class="dd-custom-item green customersort customersorte_'+cust.cba.partner_boatstore_event_id+'  customersort_'+cust.id+'" data-customer-id="'+cust.id+'" data-slip-id="'+cust.cba.customer_slip_id+'" data-applic-id="'+cust.cba.id+'">';
				}
				else{
					customersHtmlLi += '<li class="dd-custom-item customersort customersorte_'+cust.cba.partner_boatstore_event_id+'  customersort_'+cust.id+'" data-customer-id="'+cust.id+'"  data-slip-id="'+cust.cba.customer_slip_id+'" data-applic-id="'+cust.cba.id+'">';
				}				

					customersHtmlLi += '<div class="dd-custom-handle">';
						
						customersHtmlLi += '<p style="text-align:left;float:left;margin:0">';
							customersHtmlLi += cust.customer_name +' ('+cust.ps.slip_name + ')' ;
						customersHtmlLi += '</p>';

					customersHtmlLi += '</div>';

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

			var w = parseInt($(window).outerHeight()) - parseInt($('.header').outerHeight()) - parseInt($('.footer').outerHeight()) - parseInt($('#customer_lists ol:first').outerHeight()) - parseInt($('.portlet-title').outerHeight()) -40;

			$("#customersol_scroll").slimScroll({
				height: w
			});	

			$('#customersol').css('height',w+'px');
			
			$(window).resize(function(){
				if(document.getElementById('customersol')!=null){
					var w = parseInt($(window).outerHeight()) - parseInt($('.header').outerHeight()) - parseInt($('.footer').outerHeight()) - parseInt($('#customer_lists ol:first').outerHeight()) - parseInt($('.portlet-outerHeight').height())-10;
				
					$("#customersol_scroll,#customersol_scratchpad_scroll").slimScroll({
						'destroy':true
					});

					$("#customersol_scroll").slimScroll({
						height:  w
					});	
					$('#customersol').css('height',w+'px');
				}
				boat_assignments.adjustEvents();
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
				customersHtmlLi += '<li class="dd-custom-item customersort  customersort_'+cust.id+'" data-customer-id="'+cust.id+'" >';
					customersHtmlLi += '<div class="dd-custom-handle">';
						
						customersHtmlLi += '<p style="text-align:left;float:left;margin:0">';
							customersHtmlLi += cust.customer_name +' ('+cust.ps.slip_name + ')' ;
						customersHtmlLi += '</p>';

					customersHtmlLi += '</div>';

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
				"ps.slip_name"
			]
		};
		
		var fuse = new Fuse(ba_sort_custs, options);
		var result = fuse.search(search);
		var search_cust  = result;
		boat_assignments.customersHtml(search_cust,'manualsearch');
	},
	adjustEvents:function(){
	},
	sendnotifications:function(){

		var event_ids = [];
		for(var j in current_events){
			event_ids.push(current_events[j].PartnerBoatstoreEvent.id);
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			//event_ids:JSON.stringify(event_ids)
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/processonschedule.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var val = $('#view_change').toggleButtons('status');
				if(val){
		    		boat_assignments.getevents('','all');
		    	}
		    	else{
					var date = $('#schedule_calendar').fullCalendar( 'getDate' ).format();
					boat_assignments.getevents(date,'calendar');
				}
				call_toastr('success',ba_td.Success, complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	removeAlloc:function(id,customer_boatstore_application_id,drop_id,slip_id,cust_id){
		var yes = function(){
			var params = {
				admin_id:admin_id,
				partner_id:partner_id,
				id:id,
				
			};
			
			var total_params = {
				data:params,
				model:'partnerBoatstoreAllocations',
				action:'deletec',
				emitevent:'partnerBoatstoreAllocationdelete',
				emithis:{
					id:id,
					customer_boatstore_application_id:customer_boatstore_application_id,
					drop_id:drop_id,
					slip_id:slip_id,
					cust_id:cust_id
				},
			};
			
			socket.once('partnerBoatstoreAllocationdelete',function(data){
				if(data.error==null || data.error==undefined || data.error==''){
					call_toastr('success',ba_td.Success, ba_td[data.success.msg]);
				}
				else{
					showAlertMessage(ba_td[data.error.msg],'error',ba_td.AlertMessage);
					return;
				}
			});
			socket.emit('crud', total_params);
		};
		
		var no = function(){

		};

		
		showDeleteMessage(ba_td.$del_boat_alloc,ba_td.Confirmation,yes,no,'ui-dialog-blue',ba_td.Delete,ba_td.Cancel);

	},
	partnerBoatstoreAllocationdelete:function(data){
		if(data.error==null || data.error==undefined || data.error==''){
			data = data.success;
			if(data.pending_notifications > 0){
				$('#boat_assignments_save').show();
			}
			else{
				$('#boat_assignments_save').hide();
			}
			console.log('data.em',data);
			try{
				for(var j in schedules_customers[data.emithis.drop_id]){
					var ds = schedules_customers[data.emithis.drop_id][j];
					if((ds['customer_id'] == data.emithis.cust_id) && (ds['customer_slip_id'] == data.emithis.slip_id)){
						schedules_customers[data.emithis.drop_id].splice(j,1);
						break;
					}
				}

				$('#no_of_cust_'+data.emithis.drop_id).text(schedules_customers[data.emithis.drop_id].length);
			

				if(schedules_customers[data.emithis.drop_id].length > 0){
					$('#schedulesnoc_'+data.emithis.drop_id).hide();
					$('.schedulesp_'+data.emithis.drop_id+' .header_schedules').removeClass('unalloc_event').addClass('alloc_event');
				}
				else{
					$('#schedulesnoc_'+data.emithis.drop_id).show();
					$('.schedulesp_'+data.emithis.drop_id+' .header_schedules').removeClass('alloc_event').addClass('unalloc_event');
				}
			}
			catch(e){

			}
			
			$('.allocatedcust[data-applic-id="'+data.emithis.customer_boatstore_application_id+'"]').remove();
			var id = $('.schedulesd:not(.shide)').parent().attr('data-id');
			if(checkNull(id) != ''){
				boat_assignments.minmax(id,'show');
			}
		}
		else{
			showAlertMessage(ba_td[data.error.msg],'error',ba_td.AlertMessage);
			return;
		}
	},

};



