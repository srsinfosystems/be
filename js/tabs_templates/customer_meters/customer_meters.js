var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();
var allDataM ;
var cm_tab_id;
var cm_meta;
var cm_data;
var cm_td;
var task_status = {};

var customer_meters = {
	start:function(tab_id,meta_data={}){
		cm_tab_id = tab_id;
		cm_meta = meta_data;
		if($.isEmptyObject(meta_data)){
			return;
		}

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cm_meta.customer_id,		
			limit:10000,
			
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getAllCustomerMeters.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				cm_data = complet_data.response.response;
				var translationsData = cust_det_trans_dt;
				cm_data = Object.assign(cm_data,{translationsData:cust_det_trans_dt});
				cm_td = cust_det_trans_dt;
				customer_meters.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cm_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cm_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;

	},
	createHtml:function(){
		cm_data.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		cm_data.base_url = base_url;
		cm_data.customer_id = cm_meta.customer_id;
		var template = document.getElementById('customer_meters_template').innerHTML;
		var compiledRendered = Template7(template, cm_data);
		document.getElementById(cm_tab_id).innerHTML = compiledRendered;
		customer_meters.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		task_status = {
			yet:cm_td.Notstarted,
			run:cm_td.Ongoing,
			comp:cm_td.Completed,
			open:cm_td.Open,
		};
		allDataM = cm_data.meterDetails;
		customer_meters.generateMeterList(allDataM);	
	},
	generateMeterList:function(data){
		var html = '';

		for(var j in data){
			var pm = data[j].PartnerMeter;
			var cm = data[j].CustomerMeter;
			var cs = data[j].CustomerSlip;
			var ps = data[j].PartnerSlip;
			var pd = data[j].PartnerDock;

			if(checkNull(cm.id)=='' || checkNull(cm.id)==0){
				var customer_slipmeter_id = cs.id;
				var type = 'slip';	
				var ids = 'slip_'+customer_slipmeter_id;					
			}
			else{
				var customer_slipmeter_id = cm.id;
				var type = 'meter';
				var ids = 'meter_'+customer_slipmeter_id;
			}


			html += '<tr id="'+ids+'">';

				html += '<td>';
					html += checkNull(pm.meter_name);
				html += '</td>';

				html += '<td>';
					html += checkNull(pd.dock_name);
				html += '</td>';

				html += '<td>';
					html += checkNull(ps.slip_name);
				html += '</td>';


				html += '<td>';
					if(checkNull(cm.id)!='' && checkNull(cm.id)!=0){
						html += convertDateIntoSiteFormat(checkNull(cm.assign_date));
					}
					else{
						html += convertDateIntoSiteFormat(checkNull(cs.assign_date));
					}
					
					
					
				html += '</td>';

				html += '<td>';
					html += convertIntoLocalFormat(checkNull(pm.meter_value))+' '+cm_td.kWh;
				html += '</td>';

				html += '<td>';
					html += convertDateIntoSiteFormat(checkNull(pm.last_read));
				html += '</td>';

				html += '<td>';
					

					var edit_url = base_url + 'customers/edit_meter_from_customer/'+type+'/'+customer_slipmeter_id+'/'+cm_meta.customer_id+'/'+cs.id+'/customer_card';
					//html += '<a class="btn mini blue-stripe" onclick="show_modal(this,\'popups\');" data-width="900" data-url="'+edit_url+'" style="cursor:pointer;"><i class="icon-edit"></i> '+cm_td.Editmeter+'</a>';
					html += '<a class="btn mini blue-stripe" onclick="customer_meters.edit('+customer_slipmeter_id+','+cm_meta.customer_id+')"  style="cursor:pointer;"><i class="icon-edit"></i> '+cm_td.Editmeter+'</a>';

		
					var delete_url = base_url + 'customers/delete_meter_from_customer/'+type+'/'+customer_slipmeter_id+'/'+cm_meta.customer_id+'/yes';
					html += '<a class="btn mini red-stripe" onclick="show_modal(this,\'popups\');" data-width="900" data-url="'+delete_url+'" style="cursor:pointer;"><i class="icon-remove"></i> '+cm_td.Deletemeter+'</a>';


					var log_url = base_url + 'settings/view_meter_transaction/'+pm.id+'/'+cm_meta.customer_id;
					html += '<a class="btn mini green-stripe" id="view_transaction" data-width="1100px" onclick="show_modal(this,\'popups1\');" data-url="'+log_url+'" style="cursor:pointer;"><i class="icon-eye-open"></i> '+cm_td.Viewlog+'</a>';
					
			

				


				html += '</td>';
				
			html += '</tr>';
		}
		if(data.length != 0){
			$('.customer_meters_table_empty').remove();
			$("#customer_meters_table").show();
			$("#customer_meters_table").dataTable().fnDestroy();
			$("#customer_meters_table tbody").html(html);
			$('#customer_meters_table').dataTable({ 
				"iDisplayLength": 10,
				"aoColumns": [
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
			           cm_td.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ cm_td.records
			         ,
					"oPaginate": {
						"sPrevious": '<i class="icon-angle-left"></i>',
						"sNext": '<i class="icon-angle-right"></i>',
						'of':cm_td.of,
					},
					
					"sInfo": cm_td.Foundtotal+" _TOTAL_ "+cm_td.records
				}
			});
		}
		else{
			$("#customer_meters_table").dataTable().fnDestroy();
			$("#customer_meters_table").hide();
			var html = '<br/><div class="alert alert-error customer_meters_table_empty" style="text-align:center;">'+cm_td.Norecordfound+'</div>';
			$('.customer_meters_table_wrapper').append(html);
		}
	},
	append:function(data,from){
		var c = 0;
		if(from=='all'){
			allDataM = data;
		}
		else if(from=='edit'){
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
			if(data.type=='slip'){
				for(var j in allDataM){
					var cs = allDataM[j].CustomerSlip;
					c++;
					if(cs.id == data.customer_slipmeter_id){
						allDataM.splice(j, 1);
						break;
					}
				}
			}
			else{
				for(var j in allDataM){
					var cm = allDataM[j].CustomerMeter;
					c++;
					if(cm.id == data.customer_slipmeter_id){
						allDataM.splice(j, 1);
						break;
					}
				}
			}
			
			
		}
		c++;
		customer_meters.generateMeterList(allDataM);

	},
	edit:function(customer_slipmeter_id,cust_id){
		new_custom_popup2('600','popups','meter_reading',{customer_slipmeter_id:customer_slipmeter_id,customer_id:cust_id,request_from:'customer'});
	}
}

