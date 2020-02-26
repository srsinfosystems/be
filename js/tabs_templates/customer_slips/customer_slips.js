var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();
var allData ;
var cs_tab_id;
var cs_meta;
var cs_data;
var cs_td;
var task_status = {};

var customer_slips = {
	start:function(tab_id,meta_data={}){
		cs_tab_id = tab_id;
		cs_meta = meta_data;
		if($.isEmptyObject(meta_data)){
			return;
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cs_meta.customer_id,		
			limit:10000,
			enable_boat:['y','n',null,'']
			
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getAllCustomerSlipsboat.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				cs_data = complet_data.response.response;
				var translationsData = cust_det_trans_dt;
				cs_data = Object.assign(cs_data,{translationsData:cust_det_trans_dt});
				cs_td = cust_det_trans_dt;
				customer_slips.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cs_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cs_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		cs_data.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		cs_data.base_url = base_url;
		cs_data.customer_id = cs_meta.customer_id;
		var template = document.getElementById('customer_slips_template').innerHTML;
		var compiledRendered = Template7(template, cs_data);
		document.getElementById(cs_tab_id).innerHTML = compiledRendered;
		customer_slips.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		task_status = {
			yet:cs_td.Notstarted,
			run:cs_td.Ongoing,
			comp:cs_td.Completed,
			open:cs_td.Open,
		};
		allData = cs_data.slipDetails;
		customer_slips.generateSlipList(allData);	
	},
	generateSlipList:function(data){
		var html = '';
		var theadd = [
			{ "bSortable": true },
			{ "bSortable": true },
			{ "bSortable": true },
			{ "bSortable": true },
			{ "bSortable": true },
			{ "bSortable": true },
			{ "bSortable": false },
		];
		if(cs_data.partnerSetting.enable_boat_storage == 'y'){
			theadd = [
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": false }
			];
		}


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

				if(cs_data.partnerSetting.enable_boat_storage == 'y'){
					html += '<td>';
						if(cs.enable_boat == 'y'){
							if(checkNull(cs.boat_status) == 'out'){
								html += cs_td.Onland;
							}
							else if(checkNull(cs.boat_status) == 'up'){
								html += cs_td.Onwater;
							}
						}
						
					html += '</td>';
				}

				html += '<td>';
					var edit_url = base_url + 'customers/edit_slip/'+cs.id+'/'+cs_meta.customer_id+'/'+cs.id+'/customer_card';
					html += '<a class="btn mini blue-stripe" onclick="show_modal(this,\'popups\');" data-width="600" data-url="'+edit_url+'" style="cursor:pointer;"><i class="icon-edit"></i> '+cs_td.Editslip+'</a>';

					var switch_url = base_url + 'customers/move_slip_to_another_customer/'+ps.id+'/'+cs_meta.customer_id+'/yes/customer_card';
					html += '<a class="btn mini blue-stripe" data-width="800" onclick="show_modal(this,\'popups\');" data-url="'+switch_url+'" style="cursor:pointer;"><i class="icon-move"></i> '+cs_td.Switchslip+'</a>';

					//
					
					if(cs.enable_boat == 'y' && cs_data.partnerSetting.enable_boat_storage == 'y'){

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
							html += `<button class="btn mini red-stripe" onclick="customer_slips.cancelstorage(`+cs.id+`,`+cs.customer_id+`);" ><i class="icon-remove"></i>&nbsp;`+cs_td.Cancelboatstorage+`</button></br>`;
			
						}
						else if(cs.boat_status == 'out'){
							html += `<a class="btn mini blue-stripe" onclick="new_custom_popup2('600','popups','apply_partnerboatstorage',{customer_slip_id:`+cs.id+`,customer_id:`+cs_meta.customer_id+`});" style="cursor:pointer;"><i class="icon-plus"></i> `+cs_td.Placeonwater+`</a>`;
						}
						else if(cs.boat_status == 'up'){
							html += `<a class="btn mini blue-stripe" onclick="new_custom_popup2('600','popups','apply_partnerboatstorage',{customer_slip_id:`+cs.id+`,customer_id:`+cs_meta.customer_id+`});" style="cursor:pointer;"><i class="icon-plus"></i> `+cs_td.Hauloutofwater+`</a>`;
						}
					}
					
					//

					if(checkNull(pm.meter_name)==''){
						var delete_url = base_url + 'customers/remove_slip_from_customer/'+ps.id+'/'+cs_meta.customer_id;
							html += '<a data-dismiss="modal" onclick="deleteRecord(\''+delete_url+'\',\'\')" class="btn mini red-stripe" style="cursor:pointer;"><i class="icon-remove"></i> '+cs_td.Removeslip+'</a>';
					}
					else{
						var delete_url = base_url + 'customers/delete_slip_from_customer/'+cs.id+'/'+cs_meta.customer_id;
					
						html += '<a data-dismiss="modal" data-width="900" onclick="show_modal(this,\'popups\');" data-url="'+delete_url+'" class="btn mini red-stripe" style="cursor:pointer;"><i class="icon-remove"></i> '+cs_td.Removeslip+'</a>';
					}
				


				html += '</td>';
				
			html += '</tr>';
		}
		
		try{
			$("#customer_slips_table").dataTable().fnDestroy();
		}
		catch(e){
			console.log('ee',e);
		}
		if(data.length != 0){
			$('.customer_slips_table_empty').remove();
			$("#customer_slips_table").show();
			
			$("#customer_slips_table tbody").html(html);

			$('#customer_slips_table').dataTable({ 
				"iDisplayLength": 10,
				"aoColumns": theadd,
				"aLengthMenu": [ 10, 25, 50, 100 ],
				//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
				"sDom": "<'row-fluid't><'row-fluid'<'span12'pli>>",
				"sPaginationType": "input",
				"oLanguage": {
					"sLengthMenu": 
			           cs_td.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ cs_td.records
			         ,
					"oPaginate": {
						"sPrevious": '<i class="icon-angle-left"></i>',
						"sNext": '<i class="icon-angle-right"></i>',
						'of':cs_td.of,
					},
					
					"sInfo": cs_td.Foundtotal+" _TOTAL_ "+cs_td.records
				}
			});
		}
		else{
			$("#customer_slips_table").hide();
			var html = '<br/><div class="alert alert-error customer_slips_table_empty" style="text-align:center;">'+cs_td.Norecordfound+'</div>';
			$('.customer_slips_table_wrapper').append(html);
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
		customer_slips.generateSlipList(allData);
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
					customer_slips.start(cs_tab_id,cs_meta);
					call_toastr('success',cs_td.Success,complet_data.response.response.message.msg);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',cs_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',cs_td.alertmessage);
						return;
					}	
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;
		};
		var no = function(){};
		showDeleteMessage(cs_td.$canc_storage,cs_td.Confirmation,yes,no,'ui-dialog-blue',cs_td.Delete,cs_td.Cancel);

	},
}

