var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var type =  $('#type').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var partner_dir = $('#partner_dir').val();
var searchParams = new URLSearchParams(window.location.search)
var sfrom = searchParams.get('from');
sfrom = checkNull(sfrom);
var table ;
var cb_dt;
var cb_td;
var selected_data = [];
var quoteStatus = {};
var pagelength = 10;
var inv_current_page = 1;
var per_page = 10;
var inv_last_page = 0;
var cb_meta = {};
var allData = [];
var session_customer_id = $('#session_customer_id').val();
var customer_boats = {
	start:function(meta={}){
		cb_meta = meta;
		cb_meta['customer_id'] = session_customer_id;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			limit:10000,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','Payment status','Action','Page','View','records','of','Found total','records','Customer','Delete','Success','No record found','Assign meter','Meter','Dock','Slip','Assigned since','Boat type','Last read','Action','Boat','Registration number','Edit slip','Delete slip','Switch slip','Meter reading','New meter reading','Apply for boat storage','Boat status','On water','On land','Boat status','Select','Boat storage status','Storage application received','Cancel boat storage','$canc_storage','Confirmation','Cancel','Storage scheduled for date','$dateoclock','Boats','Haul out of water','Place on water']

		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getAllCustomerSlipsboat.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				cb_dt = complet_data.response.response;
				cb_td = complet_data.response.response.translationsData;
				
				customer_boats.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cb_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cb_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createHtml:function(){
		cb_dt.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		cb_dt.base_url = base_url;
		cb_dt.customer_id = cb_meta.customer_id;
		var template = document.getElementById('customer_boats_template').innerHTML;
		var compiledRendered = Template7(template, cb_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		customer_boats.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		task_status = {
			yet:cb_td.Notstarted,
			run:cb_td.Ongoing,
			comp:cb_td.Completed,
			open:cb_td.Open,
		};
		allData = cb_dt.slipDetails;
		customer_boats.generateSlipList(allData);	
	},
	generateSlipList:function(data){
		var html = '';

		for(var j in data){
			var cs = data[j].CustomerSlip;
			var ps = data[j].PartnerSlip;
			var pm = data[j].PartnerMeter;
			var pd = data[j].PartnerDock;
			var allo = data[j].Allocation;

			html += '<tr>';

				html += '<td>';
					html += checkNull(pd.dock_name);
				html += '</td>';

				html += '<td>';
					html += checkNull(ps.slip_name);
				html += '</td>';

				html += '<td>';
					html += checkNull(pm.meter_name);
				html += '</td>';


				html += '<td>';
					html += convertDateIntoSiteFormat(checkNull(cs.assign_date));
				html += '</td>';

				html += '<td>';
					html += checkNull(cs.boat_type);
				html += '</td>';

				html += '<td>';
					html += checkNull(cs.registration_number);
				html += '</td>';

			

				html += '<td>';
					// html += '<select customer-slip-id="'+cs.id+'" data-value="'+cs.boat_status+'" name="boat_status" class="boat_status">';
					// html += `<option></option>
					// 		<option value="up">`+cb_td.Onwater+`</option>
					// 		<option value="out">`+cb_td.Onland+`</options>`; 
					if(cs.boat_status == 'up'){
						html += cb_td.Onwater;
					}
					else if(cs.boat_status == 'out'){
						html += cb_td.Onland;
					}

				html += '</td>';
				
				if(cb_dt.partnerSetting.enable_boat_storage == 'y'){
					html += '<td>';

						var applied = 0;
						var applied_dates = [];
						for(var j in allo){
							var pba = allo[j].pba;
							var pbe = allo[j].pbe;

							if(checkNull(pba.id) == '' && ( pbe.status != 'can' || pbe.status != 'comp') ){
								applied = 1;
								break;
							}
							else if(checkNull(pba.id) != '' && ( pbe.status != 'can' || pbe.status != 'comp') ){
								applied_dates.push(pbe.start_datetime);
							}			
						}
					
						if(applied == 1){
							html += cb_td.Storageapplicationreceived;
						}
						else if(applied_dates.length > 0){
							applied = 2;
							html += cb_td.Storagescheduledfordate+'<br/>'


							for(var j in applied_dates){

								var start_date = convertDateIntoSiteFormat(applied_dates[j]);
								var start_time = moment(applied_dates[j]).format('hh:mm');
								var startstr = cb_td.$dateoclock;
								startstr = startstr.replace('%date%',start_date).replace('%time%',start_time);
								applied_dates[j] = startstr;
							}
							var str = applied_dates.join('<br/>');
							html += str;
						}
						
					html += '</td>';
				}

				html += '<td>';
					// var edit_url = base_url + 'customers/edit_slip/'+cs.id+'/'+cb_meta.customer_id+'/'+cs.id+'/customer_card';
					// html += '<a class="btn mini blue-stripe" onclick="show_modal(this,\'popups\');" data-width="900" data-url="'+edit_url+'" style="cursor:pointer;"><i class="icon-edit"></i> '+cb_td.Editslip+'</a>';

					// var switch_url = base_url + 'customers/move_slip_to_another_customer/'+ps.id+'/'+cb_meta.customer_id+'/yes/customer_card';
					// html += '<a class="btn mini blue-stripe" data-width="800" onclick="show_modal(this,\'popups\');" data-url="'+switch_url+'" style="cursor:pointer;"><i class="icon-move"></i> '+cb_td.Switchslip+'</a>';
					// if(checkNull(pm.meter_name)==''){
					// 	var delete_url = base_url + 'customers/remove_slip_from_customer/'+ps.id+'/'+cb_meta.customer_id;
					// 		html += '<a data-dismiss="modal" onclick="deleteRecord(\''+delete_url+'\',\'\')" class="btn mini red-stripe" style="cursor:pointer;"><i class="icon-remove"></i> '+cb_td.Deleteslip+'</a>';
					// }
					// else{
					// 	var delete_url = base_url + 'customers/delete_slip_from_customer/'+cs.id+'/'+cb_meta.customer_id;
					
					// 	html += '<a data-dismiss="modal" data-width="900" onclick="show_modal(this,\'popups\');" data-url="'+delete_url+'" class="btn mini red-stripe" style="cursor:pointer;"><i class="icon-remove"></i> '+cb_td.Deleteslip+'</a>';
					// }
				
					if(cb_dt.partnerSetting.enable_boat_storage == 'y' && cs.enable_boat == 'y'){
						if(applied == 1){
							html += `<button class="btn mini red-stripe" onclick="customer_boats.cancelstorage(`+cs.id+`,`+cs.customer_id+`);" ><i class="icon-remove"></i>&nbsp;`+cb_td.Cancelboatstorage+`</button></br>`;
						}
						else if(applied == 2){

						}
						else{
							if(cs.boat_status == 'up'){
								html += `<button class="btn mini green-stripe" onclick="new_custom_popup2('600','popups','apply_boatstorage',{customer_slip_id:`+cs.id+`,customer_id:`+cs.customer_id+`});" ><i class="icon-plus"></i>&nbsp;`+cb_td.Hauloutofwater+`</button></br>`;
							}
							else if(cs.boat_status == 'out'){
								html += `<button class="btn mini green-stripe" onclick="new_custom_popup2('600','popups','apply_boatstorage',{customer_slip_id:`+cs.id+`,customer_id:`+cs.customer_id+`});" ><i class="icon-plus"></i>&nbsp;`+cb_td.Placeonwater+`</button></br>`;
							}
							
						}
					}

					var meterreading = base_url+'customers/save_meter_reading/'+pm.id+'/'+pm.meter_value+'?from=boat';

					html += `<button class="btn mini purple-stripe " onclick="show_modal(this,'popups1');" data-url="`+meterreading+`"><i class="icon-plus"></i>&nbsp;`+cb_td.Newmeterreading+`</button>`;


				html += '</td>';
				
			html += '</tr>';
		}
		if(data.length != 0){
			$('.customer_boats_table_empty').remove();
			$("#customer_boats_table").show();
			$("#customer_boats_table").dataTable().fnDestroy();
			$("#customer_boats_table tbody").html(html);

			// $('.boat_status').each(function(){
			// 	var v = $(this).attr('data-value');
			// 	$(this).val(v);
			// 	$(this).select2({
			// 		allowClear:false,
			// 		placeholder:cb_td.Select,
			// 		minimumResultsForSearch:-1
			// 	});
			// });

			$('select.boat_status').change(function(){
				var v = $(this).val();
				var customer_slip_id = $(this).attr('customer-slip-id');
				customer_boats.updateBoatStatus(v,customer_slip_id);
			});

			$('#customer_boats_table').dataTable({ 
				"iDisplayLength": 10,
				"aoColumns": [
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": false },
				],
				"aLengthMenu": [ 10, 25, 50, 100 ],
				//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
				"sDom": "<'row-fluid't><'row-fluid'<'span12'pli>>",
				"sPaginationType": "input",

				"oLanguage": {
					"sLengthMenu": 
			           cb_td.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ cb_td.records
			         ,
					"oPaginate": {
						"sPrevious": '<i class="icon-angle-left"></i>',
						"sNext": '<i class="icon-angle-right"></i>',
						'of':cb_td.of,
					},
					
					"sInfo": cb_td.Foundtotal+" _TOTAL_ "+cb_td.records
				}
			});
		}
		else{
			$("#customer_boats_table").dataTable().fnDestroy();
			$("#customer_boats_table").hide();
			var html = '<br/><div class="alert alert-error customer_boats_table_empty" style="text-align:center;">'+cb_td.Norecordfound+'</div>';
			$('.customer_boats_table_wrapper').append(html);
		}
	},
	append:function(data,from){
		var c = 0;
		if(from=='edit'){
			for(var j in allData){
				var cs = allData[j].CustomerSlip;
				for(var k in data){
					var dcss = data[k].CustomerSlip;
					var found = 0;
					c++;
					if(cs.id == dcss.id){
						allData[j] = data[k];
						found = 1;
						break;
					}
				}
				if(found==1){
					break;
				}
			}
		}
		else if(from=='add'){
			for(var j in data){
				allData.push(data[0]);
			}
			
		}
		else if(from=='delete'){

			var customer_slip_id = data.customer_slip_id;
			for(var j in allData){
				var cs = allData[j].CustomerSlip;
				c++;
				if(cs.id == customer_slip_id){
					allData.splice(j, 1);
					break;
				}
			}
		}
		c++;
		customer_boats.generateSlipList(allData);
	},
	cancelstorage:function(customer_slip_id,customer_id){
		

		var yes = function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,	
				customer_slip_id:customer_slip_id,
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/MarinaBillingBatches/cancelstorage.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
				if(complet_data.response.status == 'success'){	
					customer_boats.start(cb_meta);
					call_toastr('success',cb_td.Success,complet_data.response.response.message.msg);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',cb_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',cb_td.alertmessage);
						return;
					}	
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;
		};
		var no = function(){};
		showDeleteMessage(cb_td.$canc_storage,cb_td.Confirmation,yes,no,'ui-dialog-blue',cb_td.Delete,cb_td.Cancel);

	},
	updateBoatStatus:function(v,customer_slip_id){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,	
			customer_slip_id:customer_slip_id,
			boat_status:v
		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/updateBoatStatus.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cb_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cb_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	}
}
