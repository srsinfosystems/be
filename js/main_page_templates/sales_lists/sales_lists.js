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

var searchParams = new URLSearchParams(window.location.search)
var sfrom = searchParams.get('from');
sfrom = checkNull(sfrom);

var from_scheduled = searchParams.get('scheduled_invoice');
from_scheduled = checkNull(from_scheduled);

var table ;
var sl_dt;
var sl_td;
var selected_data = [];
var pagelength = 10;

var sorts = 'DESC';
var sortf = 'sales_date';

var cust_current_page = 1;
var per_page = 10;
var cust_last_page = 0;
var sales_lists = {
	start:function(){
		if(sfrom == 'inv'){
			showMenu('sales_list1','sales_list1');
		}
		else if(from_scheduled == 'y'){
			showMenu('scheduled_invoice','scheduled_invoice');
			sfrom = 'sched';

		}
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			scheduled_invoice:'',
			direction:sorts,
			sort:sortf,
			getTranslationsDataArray:['Dashboard','alert message','Success','Sales document','Sales','Customer name','Sales date','Amount','Created date','Action','View','records','of','Found total','records','Customer','Delete','Success','No record found','$del_sales','Cancel','Warning','$del_sales_multi','Sales document','Actions','New sales document','Search','Page','Clear search','Scheduled Invoice','Draft','record'],
		};

		if(checkNull(from_scheduled) != ''){
			total_params['scheduled_invoice'] = from_scheduled;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Sales/getSaleList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				sl_dt = complet_data.response.response;
				sl_dt['CUR_SYM'] = CUR_SYM;
				sl_td = complet_data.response.response.translationsData;
				sales_lists.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',sl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',sl_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		if(checkNull(sl_dt.settings[0][0].sales_list ) != ''){
			pagelength = parseInt(sl_dt.settings[0][0].sales_list);
		}
		sl_dt.sfrom = sfrom;
	
		sl_td.dashboardurl = base_url+'dashboard/index';
		sl_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('sales_lists_template').innerHTML;
		var compiledRendered = Template7(template, sl_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		sales_lists.bindEvents();
	},
	bindEvents:function(){
		$('.clear_search').hide();
		$('.clear_search').click(function(){
			showProcessingImage('undefined');
			sales_lists.start();
		});
		sales_lists.generateRows(sl_dt.sales_list,'',sl_dt.pagination);
	},
	generateRows:function(data,frm,pagination){
		if(frm == 'search'){
			$('.clear_search').show();
		}
		else{
			$('.clear_search').hide();
		}
		var tablejson = [];
		var k = -1;
		var html = '';
		for(var j in data){
			k++;
			tablejson[k] = [];
			var c = data[j].Customer;
			var d = data[j][0];
			var s = data[j].Sale;

			var act = '<a id="view_invoice_'+s.id+'" class="btn mini blue-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+sl_td.View+'" onClick="sales_lists.openDetails('+s.id+',1);"><i class="icon-eye-open"></i> '+sl_td.View+'</a>&nbsp;';


			act += '<a class="btn mini blue-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+sl_td.Customer+'" onClick="sales_lists.openDetails('+c.id+',2);"><i class="icon-user"></i> '+sl_td.Customer+'</a>&nbsp;';

			act += '<a class="btn mini red-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+sl_td.Delete+'" onClick="sales_lists.deleteSales('+s.id+');"><i class="icon-remove"></i> '+sl_td.Delete+'</a>&nbsp;';

			act += '<p class="del_row hide" data-id="'+s.id+'" onClick="sales_lists.removeItem('+s.id+')">test</p>';

			var check = '<input type="checkbox" class="uni single_check single_check_'+s.id+'" data-id="'+s.id+'">';



			//tablejson[k].push(check);
			html += '<tr data-id="'+s.id+'">';

			

			// tablejson[k].push(convertDateIntoSiteFormat(checkNull(s.sales_date)));
			// html += '<td>'+convertDateIntoSiteFormat(checkNull(s.sales_date))+'</td>';

			

			tablejson[k].push(convertDateIntoSiteFormat(checkNull(s.creation_date)));
			html += '<td>'+checkNull(convertDateIntoSiteFormat(checkNull(s.creation_date)))+'</td>';

			tablejson[k].push(checkNull(c.customer_name));
			html += '<td>'+checkNull(c.customer_name)+'</td>';

			tablejson[k].push(CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.gross_amount,0)));
			html += '<td style="text-align:right">'+checkNull(CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.gross_amount,0)))+'</td>';

			tablejson[k].push(act);
			html += '<td>'+checkNull(act)+'</td>';
			html += '</tr>';
			// selected_data.push({
			// 	id:s.id,
			// 	check:0
			// });
			
		
		}
		//$('#partner_bilq_list').dataTable().fnDestroy();
		if(tablejson.length!=0){
			// table = $('#partner_bilq_list').dataTable({ 
			// 	"aaData": tablejson,
			// 	"aaSorting": [[ 1, "desc" ]],
			// 	"iDisplayLength": pagelength,
				// "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
				// 	$(nRow).find('input.single_check').uniform();
				// 	var data_id = $(nRow).find('input.single_check').attr('data-id');
				// 	var o = sales_lists.updateSelData(data_id,'search');
				// 	if(selected_data[o].check==1){
				// 		$(nRow).find('input.single_check').prop('checked','checked');
				// 	}
				// 	else{
				// 		$(nRow).find('input.single_check').removeAttr('checked');
				// 	}
				// 	$.uniform.update();
				// 	return nRow;
				// },
			// 	"aoColumns": [
			// 		//{ "bSortable": false },
			// 		{ "bSortable": true },
			// 		{ "bSortable": true },
			// 		{ "bSortable": true },
			// 		{ "bSortable": true },
			// 		{ "bSortable": true },
			// 	],
			// 	"aLengthMenu": [ 10, 25, 50, 100 ], 
			// 	"sDom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			// 	"sPaginationType": "input",
			// 	"oLanguage": {
			// 		"sLengthMenu": 
			//            sl_td.View+ ' <select>'+
			//              '<option value="10">10</option>'+
			//              '<option value="20">20</option>'+
			//             '<option value="30">30</option>'+
			//              '<option value="40">40</option>'+
			//              '<option value="50">50</option>'+
			//              '<option value="-1">All</option>'+
			//              '</select> '+ sl_td.records+ ' |  '
			//          ,
			// 		"oPaginate": {
			// 			"sPrevious": '<i class="icon-angle-left"></i>',
			// 			"sNext": '<i class="icon-angle-right"></i>',
			// 			'of':sl_td.of,
			// 			'Page':sl_td.Page,
			// 		},
					
			// 		"sInfo": sl_td.Foundtotal+" _TOTAL_ "+sl_td.records
			// 	}
			// });

			var classs = '';

			
			if(parseInt(checkNull(pagination.total_records,0)) <  parseInt(checkNull(pagination.per_page,0)) ){
				classs = 'display:none';
			}

			var phtml = '<div class="row-fluid form-inline dt_rem">';
				phtml += '<div class="span12 dataTables_extended_wrapper">';
				   	phtml += '<div class="dataTables_paginate paging_input" id="partner_inv_list_paginate" style="'+classs+'">';
				   	 	phtml += '<span class="paginate_page">'+sl_td.Page+' </span>';
		   	 		 	phtml += '<span class="previous prev btn btn-sm default paginate_button" id="partner_inv_list_previous prev btn btn-sm default"><i class="icon-angle-left"></i></span>';
		   	 			phtml += '<input class="paginate_input form-control input-mini input-inline input-sm" type="text">';
		   	 			phtml += '<span class="next next btn btn-sm default paginate_button" id="partner_inv_list_next next btn btn-sm default"><i class="icon-angle-right"></i></span>';
		   	 			phtml += '<span class="paginate_of"> '+sl_td.of+' '+pagination.total_pages+' |</span>';
			   	 	phtml += '</div>';
				  	phtml += ' <div id="partner_inv_list_length" class="dataTables_length"  style="'+classs+'">';
				      	phtml += '<label style="margin-bottom:0">';
				        	phtml += sl_td.View;
				        	phtml += ' <select id="partner_inv_list_sel" style="margin-right:2px">';
					            phtml += '<option value="10" selected="selected">10</option>';
					            phtml += '<option value="20">20</option>';
					            phtml += '<option value="30">30</option>';
					           	phtml += '<option value="40">40</option>';
					            phtml += '<option value="50">50</option>';
					            phtml += '<option value="-1">All</option>';
					         	phtml += '</select>';
				       		phtml += sl_td.records;
				      	phtml += ' | </label>';
				   	phtml += '</div>';
				   	if(pagination.total_records > 1){
				   			phtml += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+sl_td.Foundtotal+' '+pagination.total_records+' '+sl_td.records+'</div>';
				   	}
				   	else{
				   			phtml += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+sl_td.Foundtotal+' '+pagination.total_records+' '+sl_td.record+'</div>';
				   	}
				   
				phtml += '</div>';
			phtml += '</div>';

			$('.dt_rem').remove();
			$('#partner_bilq_list tbody').html(html);
			$('#partner_bilq_list').after(phtml);

			cust_last_page = pagination.total_pages;
			sales_lists.bindTable(pagination);
		}
		else{
			$('.alert').removeClass('hide');
			$('#partner_bilq_list').addClass('hide');
		}
		

	},
	removeItem:function(id){
		$('.del_row[data-id="'+id+'"]').parent().parent().remove();
		sales_lists.start();
	},
	bindTable:function(pagination){
		$('.uni').off();
		$('.uni').uniform();
		$('.checkall').change(function(){
			var l  = $('.checkall:checked').length;
			if(l==1){
				sales_lists.updateSelData(0,'check');
			}
			else{
				sales_lists.updateSelData(0,'uncheck');
			}
			sales_lists.showHideBtn();
		});

		$('#partner_bilq_list').on('change','.single_check',function(){
			var data_id = $(this).attr('data-id');
			var l = $('.single_check_'+data_id+':checked').length;
			var o =sales_lists.updateSelData(data_id,'search');
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
			sales_lists.showHideBtn();
		});

		$('#partner_inv_list_paginate .paginate_input').val(pagination.page_num);
		$('#partner_inv_list_paginate .prev').click(function(){
			if(cust_current_page!=1){
				sales_lists.getAndGenerateCust('prev',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .next').click(function(){
			if(cust_current_page < cust_last_page){
				sales_lists.getAndGenerateCust('next',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .paginate_input').change(function(){
			var v = $(this).val();

			if(checkNull(v) != '' && v != 0 && v != cust_current_page && v <= cust_last_page){
				sales_lists.getAndGenerateCust('input',pagination.per_page,v);
			}
		});

		$("#partner_inv_list_length select").change(function(){
			var v = $(this).val();
			if(v==-1){
				v = 100000;
			}
			sales_lists.getAndGenerateCust('dropdown',v);
		});
	},
	getAndGenerateCust:function(from,limit,v){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			direction:sorts,
			sort:sortf,
		};

		if(checkNull(from_scheduled) != ''){
			total_params['scheduled_invoice'] = from_scheduled;
		}

		if(from=='next'){
			cust_current_page++;
		}
		else if(from=='prev'){
			cust_current_page--;
		}
		else if(from=='input'){
			cust_current_page = v;
		}
		else if(from=='dropdown'){
			cust_current_page = 1;
			total_params.limit = limit;
		}
		total_params.page = cust_current_page;

	
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Sales/getSaleList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var ssl_dt = complet_data.response.response;
				sales_lists.generateRows(ssl_dt.sales_list,'',ssl_dt.pagination);	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',sl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',sl_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	sort:function(frm){

		if(sorts == 'ASC'){
			sorts = 'DESC';
		}
		else{
			sorts = 'ASC';
		}
		sortf = frm;
	
		inv_current_page = 1;
		sales_lists.getAndGenerateCust('',per_page);
	},
	showHideBtn:function(){
		var r = sales_lists.updateSelData(0,'length');
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
			new_custom_main_page2('/'+type+'/sales/details/'+id+'?from='+sfrom,'sales_lists','sales_lists','sales_details',{sales_id:id});
			
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
					call_toastr('success',sl_td.Success,complet_data.response.response.msg);
					sales_lists.showHideBtn();
					// if(total_params.sales_ids.length == 0){
					// 	$('#partner_bilq_list').dataTable().fnDestroy();
					// 	$('.alert').removeClass('hide');
					// 	$('#partner_bilq_list').addClass('hide');
					// }
			
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',sl_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',sl_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		};

		var no =function(){};
		if(frm=='single'){
			showDeleteMessage(sl_td.$del_sales,sl_td.Warning,yes,no,'ui-dialog-blue',sl_td.Delete,sl_td.Cancel);
		}
		else{
			showDeleteMessage(sl_td.$del_sales_multi,sl_td.Warning,yes,no,'ui-dialog-blue',sl_td.Delete,sl_td.Cancel);
		}		
	},

}