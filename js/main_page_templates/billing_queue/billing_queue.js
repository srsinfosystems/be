var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var type =  $('#type').val();
var table ;
var bq_dt;
var bq_td;
var selected_data = [];

var billing_queue = {
	start:function(){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Billing queue','Success','Sales document','Sales','Customer name','Sales date','Amount','Created date','Action','View','records','of','Found total','records','Customer','Delete','Success','No record found','$del_sales','Cancel','Warning','$del_sales_multi','Send','Send all now','Confirmation','$send_sales','$send_sales_multi','Yes'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Sales/getBillingQueue.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				bq_dt = complet_data.response.response;
				if(bq_dt.settings[0].PartnerSetting.enable_billing_queue == 'n'){
					window.location.href = base_url + 'accessDenied';
					return;
				}
				bq_td = complet_data.response.response.translationsData;
				billing_queue.createHtml(complet_data.response.response);
		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bq_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bq_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		bq_td.dashboardurl = base_url+'dashboard/index';
		bq_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('billing_queue_template').innerHTML;
		var compiledRendered = Template7(template, bq_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		billing_queue.bindEvents();
	},
	bindEvents:function(){
		billing_queue.generateRows(bq_dt.sales_list);

	},
	generateRows:function(data){

		var tablejson = [];
		var k = -1;
		for(var j in data){
			k++;
			tablejson[k] = [];
			var c = data[j].Customer;
			var d = data[j][0];
			var s = data[j].Sale;

			var act = '<a id="view_invoice_'+s.id+'" class="btn mini blue-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+bq_td.View+'" onClick="billing_queue.openDetails('+s.id+',1);"><i class="icon-eye-open"></i> '+bq_td.View+'</a>&nbsp;';


			act += '<a class="btn mini blue-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+bq_td.Customer+'" onClick="billing_queue.openDetails('+c.id+',2);"><i class="icon-user"></i> '+bq_td.Customer+'</a>&nbsp;';

			act += '<a class="btn mini red-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+bq_td.Delete+'" onClick="billing_queue.deleteSales('+s.id+');"><i class="icon-remove"></i> '+bq_td.Delete+'</a>&nbsp;';

			act += '<a class="btn mini green-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+bq_td.Send+'" onClick="billing_queue.sendSales('+s.id+');"><i class="icon-ok"></i> '+bq_td.Send+'</a>&nbsp;';

			act += '<p class="del_row hide" data-id="'+s.id+'" onClick="billing_queue.removeItem('+s.id+')">test</p>';

			var check = '<input type="checkbox" class="uni single_check single_check_'+s.id+'" data-id="'+s.id+'">';



			tablejson[k].push(check);
			tablejson[k].push(checkNull(c.customer_name));
			tablejson[k].push(convertDateIntoSiteFormat(checkNull(s.sales_date)));
			tablejson[k].push(CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.gross_amount,0)));
			tablejson[k].push(convertDateIntoSiteFormat(checkNull(s.creation_date)));
			tablejson[k].push(act);

			selected_data.push({
				id:s.id,
				check:0
			});
			
		
		}
		$('#partner_bilq_list').dataTable().fnDestroy();
		if(tablejson.length!=0){
			$('.badge-billing').show();
				if(tablejson.length==0){
					$('.badge-billing').hide();
				}
				else{
					$('.badge-billing').html(tablejson.length);
				}

			$('.alert').addClass('hide');
			$('#partner_bilq_list').removeClass('hide');
			table = $('#partner_bilq_list').dataTable({ 
				"aaData": tablejson,
				"iDisplayLength": 10,
				"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
					console.log(nRow);
					$(nRow).find('input.single_check').uniform();
					var data_id = $(nRow).find('input.single_check').attr('data-id');
					var o = billing_queue.updateSelData(data_id,'search');
					if(selected_data[o].check==1){
						$(nRow).find('input.single_check').prop('checked','checked');
					}
					else{
						$(nRow).find('input.single_check').removeAttr('checked');
					}
					$.uniform.update();
					return nRow;
				},
				"aoColumns": [
					{ "bSortable": false },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
				],
				"aLengthMenu": [ 10, 25, 50, 100 ], 
				"sDom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
				"sPaginationType": "input",
				"oLanguage": {
					"sLengthMenu": 
			           bq_td.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ bq_td.records+ ' |  '
			         ,
					"oPaginate": {
						"sPrevious": '<i class="icon-angle-left"></i>',
						"sNext": '<i class="icon-angle-right"></i>',
						'of':bq_td.of,
					},
					
					"sInfo": bq_td.Foundtotal+" _TOTAL_ "+bq_td.records
				}
			});
			billing_queue.bindTable();
		}
		else{
			$('.badge-billing').html(0).hide();

			$('.alert').removeClass('hide');
			$('#partner_bilq_list').addClass('hide');
		}
	},
	removeItem:function(id){
		table.$('tr').each(function(i){
   			if($(this).find('p.del_row').attr('data-id') == id){
   				var o = billing_queue.updateSelData(id,'search');
   				selected_data.splice(o,1);
   				$('.badge-billing').show();
   				if(selected_data.length==0){
   					$('.badge-billing').hide();
   				}
   				else{
   					$('.badge-billing').html(selected_data.length);
   				}
   				table.fnDeleteRow( i);
   				return false;
   			}
		});
	},
	bindTable:function(){
		$('.uni').off();
		$('.uni').uniform();
		$('.checkall').change(function(){
			var l  = $('.checkall:checked').length;
			if(l==1){
				billing_queue.updateSelData(0,'check');
			}
			else{
				billing_queue.updateSelData(0,'uncheck');
			}
			billing_queue.showHideBtn();
		});

		$('#partner_bilq_list').on('change','.single_check',function(){
			var data_id = $(this).attr('data-id');
			var l = $('.single_check_'+data_id+':checked').length;
			var o =billing_queue.updateSelData(data_id,'search');
			if(l==1){
				selected_data[o].check = 1;
			}
			else{
				selected_data[o].check = 0;
			}
			var f = 0;
			for(var j in selected_data){
				if(selected_data[j].check == 0){
					f = 1;
					$('.checkall').removeAttr('checked');
				}
			}
			if(f==0){
				$('.checkall').prop('checked','checked');
			}
			$.uniform.update();
			billing_queue.showHideBtn();
		});
	},
	showHideBtn:function(){
		var r = billing_queue.updateSelData(0,'length');
		if(r.check_len == 0){
			$('.btn_del').hide();
		}
		else if(r.check_len > 0 ){
			$('.btn_del').show();
		}
	},
	updateSelData:function(id=0,from='check'){
		if(from=='check'){
			for(var j in selected_data){
				selected_data[j].check = 1;
				$('.single_check_'+selected_data[j].id).prop('checked','checked');
			}	
			$.uniform.update();
		}
		else if(from=='uncheck'){
			for(var j in selected_data){
				selected_data[j].check = 0;
				$('.single_check_'+selected_data[j].id).removeAttr('checked');
			}
			$.uniform.update();
		}
		else if(from=='length'){
			var check_len = 0;
			var uncheck_len = 0;
			for(var j in selected_data){
				if(selected_data[j].check == 0){
					uncheck_len++;
				}
				else if(selected_data[j].check == 1){
					check_len++;
				}

			}
			return {check_len:check_len,uncheck_len:uncheck_len};
		}
		else if(from=='search'){
			for(var j in selected_data){
				if(selected_data[j].id == id){
					return j;
				}
			}
		}	
	},
	openDetails:function(id,from){
		if(from==1){
			new_custom_main_page2('/'+type+'/sales/details/'+id+'?from=bilq','billing_queue','billing_queue','sales_details',{sales_id:id});
			
		}
		else if(from==2){
			new_custom_main_page2('/'+type+'/customers/details/'+id,'all_customers','all_customers','customer_details',{customer_id:id});
		}
	},
	deleteSales:function(id,frm='single'){
		var yes =function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
			}
			if(frm=='single'){
				total_params.sales_ids = [id];
			}
			else{
				var ids = []
				for(var j in selected_data){
					if(selected_data[j].check == 1){
						ids.push(selected_data[j].id);
					}
				}
				total_params.sales_ids = ids;
			}

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Sales/deleteSales.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					for(var j in total_params.sales_ids){
						var a = total_params.sales_ids[j];
						$('.del_row[data-id="'+a+'"]').trigger('click');
					}
					call_toastr('success',bq_td.Success,complet_data.response.response.msg);
					billing_queue.showHideBtn();
					if(selected_data.length == 0){
						$('#partner_bilq_list').dataTable().fnDestroy();
						$('.alert').removeClass('hide');
						$('#partner_bilq_list').addClass('hide');
					}
			
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',bq_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',bq_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		};

		var no =function(){};
		if(frm=='single'){
			showDeleteMessage(bq_td.$del_sales,bq_td.Warning,yes,no,'ui-dialog-blue',bq_td.Delete,bq_td.Cancel);
		}
		else{
			showDeleteMessage(bq_td.$del_sales_multi,bq_td.Warning,yes,no,'ui-dialog-blue',bq_td.Delete,bq_td.Cancel);
		}	
	},
	sendSales:function(id,frm='single'){
		var yes =function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
			}
			if(frm=='single'){
				total_params.sales_ids = [id];
			}
			else{
				var ids = []
				for(var j in selected_data){
					if(selected_data[j].check == 1){
						ids.push(selected_data[j].id);
					}
				}
				total_params.sales_ids = ids;
			}

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Sales/updateSales.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					for(var j in total_params.sales_ids){
						var a = total_params.sales_ids[j];
						$('.del_row[data-id="'+a+'"]').trigger('click');
					}
					call_toastr('success',bq_td.Success,complet_data.response.response.msg);
					billing_queue.showHideBtn();
					if(selected_data.length == 0){
						$('#partner_bilq_list').dataTable().fnDestroy();
						$('.alert').removeClass('hide');
						$('#partner_bilq_list').addClass('hide');
					}
			
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',bq_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',bq_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		};

		var no =function(){};
		if(frm=='single'){
			showDeleteMessage(bq_td.$send_sales,bq_td.Confirmation,yes,no,'ui-dialog-blue',bq_td.Yes,bq_td.Cancel,'green');
		}
		else{
			showDeleteMessage(bq_td.$send_sales_multi,bq_td.Confirmation,yes,no,'ui-dialog-blue',bq_td.Yes,bq_td.Cancel,'green');
		}	
	}
}