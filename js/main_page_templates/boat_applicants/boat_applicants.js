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
var ba_dt;
var ba_td;
var selected_data = [];
var quoteStatus = {};
var pagelength = 10;
var inv_current_page = 1;
var per_page = 10;
var inv_last_page = 0;
var ba_meta = {};
var allData = [];
var boat_applicants = {
	start:function(meta={}){
		ba_meta = meta;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			limit:10000,
			from:'boat_applicants',
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','Payment status','Action','Page','View','records','of','Found total','records','Customer','Delete','Success','No record found','Assign meter','Meter','Dock','Slip','Assigned since','Boat type','Last read','Action','Boat','Registration number','Edit slip','Delete slip','Switch slip','Meter reading','New meter reading','Apply for boat storage','Boat status','On water','On land','Boat status','Select','Boat storage status','Storage application received','Cancel boat storage','$canc_storage','Confirmation','Cancel','Storage scheduled for date','$dateoclock','Boat storage applications','Boat storage','$customerh','Customer name','Dimensions','Event type','$Up','$Out','View details','Event cancelled','Event completed','Included','Excluded','Actions','Add applicants']

		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getAllPartnerSlipsboat.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ba_dt = complet_data.response.response;
				ba_td = complet_data.response.response.translationsData;
				
				boat_applicants.createHtml(complet_data.response.response);		
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
		doAjax(params);
		return;
	},
	createHtml:function(){
		ba_dt.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		ba_dt.base_url = base_url;
		ba_dt.customer_id = ba_meta.customer_id;
		var template = document.getElementById('boat_applicants_template').innerHTML;
		var compiledRendered = Template7(template, ba_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		boat_applicants.bindEvents();
		hideProcessingImage();
		after_main_page();
	},
	bindEvents:function(){
		task_status = {
			yet:ba_td.Notstarted,
			run:ba_td.Ongoing,
			comp:ba_td.Completed,
			open:ba_td.Open,
		};
		allData = ba_dt.slipDetails;
		boat_applicants.generateSlipList(allData);	
	},
	generateSlipList:function(data){
		var html = '';

		for(var j in data){
			var cs = data[j].CustomerSlip;
			var ps = data[j].PartnerSlip;
			var pm = data[j].PartnerMeter;
			var pd = data[j].PartnerDock;
			var allo = data[j].Allocation;
			var cust = data[j].Customer;

			html += '<tr>';

				html += '<td>';
					//html += checkNull(pd.dock_name);
					html += checkNull(cust.customer_number);
				html += '</td>';

				html += '<td>';
				html += checkNull(cust.customer_name);
				html += '</td>';

				html += '<td>';
					html += checkNull(ps.slip_name);
				html += '</td>';

				// html += '<td>';
				// 	html += checkNull(pm.meter_name);
				// html += '</td>';


				// html += '<td>';
				// 	html += convertDateIntoSiteFormat(checkNull(cs.assign_date));
				// html += '</td>';

				html += '<td>';
					html += checkNull(cs.boat_type);
				html += '</td>';

				html += '<td>';
					if(cs.enable_boat == 'y'){
						if(checkNull(cs.boat_length) != '' && checkNull(cs.boat_width) != ''){
							html += checkNull(cs.boat_length) + ' x ' + checkNull(cs.boat_width) +' '+checkNull(cs.boat_unit) ;
						}
					}
					
				html += '</td>';

				html += '<td>';
					html += (checkNull(allo[0].pbe.type) == 'up')?ba_td.$Up:ba_td.$Out;
				html += '</td>';
			

				html += '<td>';
					// html += '<select customer-slip-id="'+cs.id+'" data-value="'+cs.boat_status+'" name="boat_status" class="boat_status">';
					// html += `<option></option>
					// 		<option value="up">`+ba_td.Onwater+`</option>
					// 		<option value="out">`+ba_td.Onland+`</options>`; 
					
					if(cs.boat_status == 'up'){
						html += ba_td.Onwater;
					}
					else if(cs.boat_status == 'out'){
						html += ba_td.Onland;
					}

				html += '</td>';
				
				//html += '<td>';

					var applied = 0;
					var applied_dates = [];
					var dts = {};
					var comp_can = '';
					for(var j in allo){
						var pba = allo[j].pba;
						var pbe = allo[j].pbe;

						if(checkNull(pba.id) == '' && ( pbe.status != 'can' || pbe.status != 'comp') ){

							applied = 1;
							//break;
						}
						else if(checkNull(pba.id) != '' && ( pbe.status != 'can' || pbe.status != 'comp') ){
							// if(pbe.status == 'can' || pbe.status == 'comp'){
							// 	comp_can = allo[j];
							// 	break;
							// }
							// else{
								
								applied_dates.push(pbe.start_datetime);
							// }
						}		
					}
					console.log(comp_can);
					if(applied == 1){
						//html += ba_td.Storageapplicationreceived;
					}
					else if(checkNull(comp_can) != ''){
						if(comp_can.pbe.status == 'can'){
							//html += ba_td.Eventcancelled;
						}
						else if(comp_can.pbe.status == 'comp'){
							//html += ba_td.Eventcompleted;
							if(comp_can.pba.status == 'i'){
								//html += '<br/>' + ba_td.Included;
							}
							else if(comp_can.pba.status == 'e'){
								//html += '<br/>' + ba_td.Excluded;
							}
						}
					}
					else if(applied_dates.length > 0){
						applied = 2;
						//html += ba_td.Storagescheduledfordate+'<br/>'


						for(var j in applied_dates){

							var start_date = convertDateIntoSiteFormat(applied_dates[j]);
							var start_time = moment(applied_dates[j]).format('hh:mm');
							var startstr = ba_td.$dateoclock;
							startstr = startstr.replace('%date%',start_date).replace('%time%',start_time);
							applied_dates[j] = startstr;
						}
						var str = applied_dates.join('<br/>');
						//html += str;
					}
					
				//html += '</td>';

				html += '<td class="action-block-3">';
					// var edit_url = base_url + 'customers/edit_slip/'+cs.id+'/'+ba_meta.customer_id+'/'+cs.id+'/customer_card';
					// html += '<a class="btn mini blue-stripe" onclick="show_modal(this,\'popups\');" data-width="900" data-url="'+edit_url+'" style="cursor:pointer;"><i class="icon-edit"></i> '+ba_td.Editslip+'</a>';

					// var switch_url = base_url + 'customers/move_slip_to_another_customer/'+ps.id+'/'+ba_meta.customer_id+'/yes/customer_card';
					// html += '<a class="btn mini blue-stripe" data-width="800" onclick="show_modal(this,\'popups\');" data-url="'+switch_url+'" style="cursor:pointer;"><i class="icon-move"></i> '+ba_td.Switchslip+'</a>';
					// if(checkNull(pm.meter_name)==''){
					// 	var delete_url = base_url + 'customers/remove_slip_from_customer/'+ps.id+'/'+ba_meta.customer_id;
					// 		html += '<a data-dismiss="modal" onclick="deleteRecord(\''+delete_url+'\',\'\')" class="btn mini red-stripe" style="cursor:pointer;"><i class="icon-remove"></i> '+ba_td.Deleteslip+'</a>';
					// }
					// else{
					// 	var delete_url = base_url + 'customers/delete_slip_from_customer/'+cs.id+'/'+ba_meta.customer_id;
					
					// 	html += '<a data-dismiss="modal" data-width="900" onclick="show_modal(this,\'popups\');" data-url="'+delete_url+'" class="btn mini red-stripe" style="cursor:pointer;"><i class="icon-remove"></i> '+ba_td.Deleteslip+'</a>';
					// }

					if(applied == 1){
						html += `<button class="btn mini red-stripe" onclick="boat_applicants.cancelstorage(`+cs.id+`,`+cs.customer_id+`);" ><i class="icon-remove"></i>&nbsp;`+ba_td.Cancelboatstorage+`</button>&nbsp;`;
					}
					// else if(applied == 2){

					// }
					else{
						html += `<button class="btn mini blue-stripe" onclick="new_custom_popup2('600','popups','apply_boatstorage',{customer_slip_id:`+cs.id+`,customer_id:`+cs.customer_id+`});" ><i class="icon-plus"></i>&nbsp;`+ba_td.Applyforboatstorage+`</button>&nbsp;`;
					}
					html += `<button class="btn mini green-stripe" onclick="new_custom_popup2('600','popups','apply_boatstorage',{customer_slip_id:`+cs.id+`,customer_id:`+cs.customer_id+`,from:'partnerdetails'});" ><i class="icon-eye-open"></i>&nbsp;`+ba_td.Viewdetails+`</button>`;
					

					//var meterreading = base_url+'customers/save_meter_reading/'+pm.id+'/'+pm.meter_value+'?from=boat';

					//html += `<button class="btn mini purple-stripe " onclick="show_modal(this,'popups1');" data-url="`+meterreading+`"><i class="icon-plus"></i>&nbsp;`+ba_td.Newmeterreading+`</button>`;


				html += '</td>';
				
			html += '</tr>';
		}
		if(data.length != 0){
			$('.boat_applicants_table_empty').remove();
			$("#boat_applicants_table").show();
			$("#boat_applicants_table").dataTable().fnDestroy();
			$("#boat_applicants_table tbody").html(html);

			$('.boat_status').each(function(){
				var v = $(this).attr('data-value');
				$(this).val(v);
				$(this).select2({
					allowClear:false,
					placeholder:ba_td.Select,
					minimumResultsForSearch:-1
				});
			});

			$('select.boat_status').change(function(){
				var v = $(this).val();
				var customer_slip_id = $(this).attr('customer-slip-id');
				boat_applicants.updateBoatStatus(v,customer_slip_id);
			});

			$('#boat_applicants_table').DataTable({ 
				"pagingType": "input",
	 		 	"pagelength":10,
	 		 	"responsive": true,
				"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
				"language": {
				"lengthMenu": 
			           ba_td.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ ba_td.records + ' |  '
			         ,
					"paginate": {
						"previous": '<i class="icon-angle-left"></i>',
						"next": '<i class="icon-angle-right"></i>',
						'of':ba_td.of,
						'Page':ba_td.Page,
					},
					
					"info": ba_td.Foundtotal+" _TOTAL_ "+ba_td.records
				},
			});
		}
		else{
			$("#boat_applicants_table").DataTable().destroy();
			$("#boat_applicants_table").hide();
			var html = '<br/><div class="alert alert-error boat_applicants_table_empty" style="text-align:center;">'+ba_td.Norecordfound+'</div>';
			$('.boat_applicants_table_wrapper').append(html);
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
		boat_applicants.generateSlipList(allData);
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
					boat_applicants.start(ba_meta);
					call_toastr('success',ba_td.Success,complet_data.response.response.message.msg);
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
			doAjax(params);
			return;
		};
		var no = function(){};
		showDeleteMessage(ba_td.$canc_storage,ba_td.Confirmation,yes,no,'ui-dialog-blue',ba_td.Delete,ba_td.Cancel);

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
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	}
}
