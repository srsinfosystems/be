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
var ol_dt;
var ol_td;
var selected_data = [];
var quoteStatus = {};
var pagelength = 10;

var cust_current_page = 1;
var per_page = 10;
var cust_last_page = 0;
var order_lists = {
	start:function(){
		var fields = ['Order.id','Order.order_number','Quote.quote_number','Order.created','Order.status','Order.customer_id','Order.customer_name'];
		
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			from:'all',
			page:1,
			getTranslationsData:'yes',
			search_from_quote:0,
			direction:'DESC',
			sort:'id',
			fields:JSON.stringify(fields),
			getTranslationsDataArray:['Dashboard','alert message','Success','Orders list','Quote number','Order number','Status','Customer name','Date','Amount','Created date','Action','View','records','of','Found total','records','Customer','Delete','Success','No record found','$del_order','Cancel','Quote number','Actions','New sales document','Search','Page','Clear search','Sales','Sent to customer','Accepted','Declined','Open','Processing','Delivered','Cancelled','Warning','Order status'],

		};
		var ord_srch_dt = localStorage.getItem('order_search_data');
		if(checkNull(ord_srch_dt) != ''){
			ord_srch_dt = JSON.parse(ord_srch_dt);
			total_params = Object.assign(total_params,ord_srch_dt.fields);
			var sort = ord_srch_dt.sort;
			total_params['sort'] = sort[0];
			total_params['direction'] = sort[1];
		}
		else{
			var fields = {
				customer_id:'',
				order_number:'',
				our_ref:'',
				order_status:'',
				show_quote_number:'',
				quote_number:''
			};
			var ord_srch_dt = JSON.stringify({fields:fields,sort:[ 'id', "DESC" ]});
			localStorage.setItem('order_search_data',ord_srch_dt);
			ord_srch_dt = JSON.parse(ord_srch_dt);
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Orders/getOrderList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ol_dt = complet_data.response.response;
				ol_td = complet_data.response.response.translationsData;
				order_lists.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ol_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ol_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		if(checkNull(ol_dt.getOrdersList.order_limit ) != ''){
			pagelength = parseInt(ol_dt.getOrdersList.order_limit);
		}
		if(checkNull(ol_dt.getAllOrderStatusList) != ''){
			order_statuses = ol_dt.getAllOrderStatusList;
			delete order_statuses[1];
		}
		else{
			order_statuses = {
				1:'',
				2:ol_dt.Senttocustomer,
				3:ol_dt.Accepted,
				4:ol_dt.Declined,
				5:ol_dt.Open,
				6:ol_dt.Processing,
				7:ol_dt.Delivered,
				8:ol_dt.Cancelled
			};
		
		}
		ol_dt.type = type;
		ol_td.dashboardurl = base_url+'dashboard/index';
		ol_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('order_lists_template').innerHTML;
		var compiledRendered = Template7(template, ol_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		order_lists.bindEvents();
	},
	bindEvents:function(){
		var ord_srch_dt = localStorage.getItem('order_search_data');
		if(checkNull(ord_srch_dt) != ''){
			ord_srch_dt = JSON.parse(ord_srch_dt);

			if(checkNull(ord_srch_dt.fields.customer_id) != '' || checkNull(ord_srch_dt.fields.our_ref) != '' || checkNull(ord_srch_dt.fields.quote_number) != '' || checkNull(ord_srch_dt.fields.order_number) != ''){
				$('.clear_search').show();
			}
			else{
				$('.clear_search').hide();
			}
		}
		else{
			$('.clear_search').hide();
		}
		$('.clear_search').click(function(){

			var order_search_data = localStorage.getItem('order_search_data');
			order_search_data = JSON.parse(order_search_data);
			order_search_data.fields = {
				customer_id:'',
				order_number:'',
				our_ref:'',
				order_status:'',
				show_quote_number:'',
				quote_number:''
			}
			order_search_data['sort'] = [ 'order_number', "DESC" ];
			localStorage.setItem('order_search_data',JSON.stringify(order_search_data));
			showProcessingImage('undefined');
			order_lists.start();
		});
		order_lists.generateRows(ol_dt.getOrdersList.ordersList,'',ol_dt.getOrdersList.pagination);
	},
	generateRows:function(data,frm,pagination){
		var tablejson = [];
		var k = -1;
		var html = '';
		for(var j in data){
			k++;
			tablejson[k] = [];

			var o = data[j].Order;
			var q = data[j].Quote;

			var act = '';
			var act = '<a id="view_invoice_'+o.id+'" class="btn mini blue-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+ol_td.View+'" onclick="order_lists.openDetails('+o.id+',1);"><i class="icon-eye-open"></i> '+ol_td.View+'</a>&nbsp;';

			if(type != 'customer'){
				act += '<a class="btn mini blue-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+ol_td.Customer+'" href="'+base_url+'customers/details/'+q.customer_id+'" onclick="order_lists.openDetails('+o.customer_id+',2);return false;"><i class="icon-user"></i> '+ol_td.Customer+'</a>&nbsp;';
			}

			if(o.status == 1){
				act += '<a class="btn mini red-stripe tooltips del_btn" data-placement="bottom" data-original-title="'+ol_td.Customer+'" onClick="order_lists.deleteOrder('+o.id+');return false;"><i class="icon-remove"></i> '+ol_td.Delete+'</a>';
				act += '<p class="del_row hide" data-id="'+o.id+'" onClick="order_lists.removeItem('+o.id+')"></p>';
			}
			
			html += '<tr>';

			tablejson[k].push(checkNull(o.order_number));
			html += '<td>'+checkNull(o.order_number)+'</td>';

			tablejson[k].push(checkNull(q.quote_number,'-'));
			html += '<td>'+checkNull(q.quote_number)+'</td>';

			tablejson[k].push(checkNull(o.customer_name,''));
			html += '<td>'+checkNull(o.customer_name)+'</td>';

			var v = getRoundOff(checkNull(o.gross_amount,0),ol_dt.getPartnerCountryDetails.round_off);
			tablejson[k].push(CUR_SYM+' '+convertIntoLocalFormat(checkNull(v,0)));
			html += '<td>'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(v,0))+'</td>';


			tablejson[k].push(convertDateIntoSiteFormat(checkNull(o.created)));
			html += '<td>'+convertDateIntoSiteFormat(checkNull(o.created))+'</td>';

			tablejson[k].push(checkNull(order_statuses[o.status],''));
			html += '<td>'+checkNull(order_statuses[o.status],'')+'</td>';

			tablejson[k].push(act);
			html += '<td>'+act+'</td>';

			html += '</tr>';
		}

		try{
			//$('#partner_order_list').DataTable().destroy();
		}
		catch(e){
			console.log(e);
		}
		
		var ord_srch_dt = localStorage.getItem('order_search_data');
		ord_srch_dt = JSON.parse(ord_srch_dt);
		var sort = ord_srch_dt.sort;
	
		if(tablejson.length!=0){
			// table = $('#partner_order_list').DataTable({ 
			// 	"data": tablejson,
			// 	"pagelength":pagelength,
			// 	"sorting": [sort],
			// 	"displayLength": 10,
			// 	"columnDefs": [ {
			//           "targets": 'no-sort',
			//           "orderable": false,
			//     }],
			// 	"aLengthMenu": [ 10, 25, 50, 100 ], 
			// 	"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			// 	"pagingType": "input",
			// 	"language": {
			// 		"lengthMenu": 
			//            ol_td.View+ ' <select>'+
			//              '<option value="10">10</option>'+
			//              '<option value="20">20</option>'+
			//             '<option value="30">30</option>'+
			//              '<option value="40">40</option>'+
			//              '<option value="50">50</option>'+
			//              '<option value="-1">All</option>'+
			//              '</select> '+ ol_td.records+ ' |  '
			//          ,
			// 		"paginate": {
			// 			"previous": '<i class="icon-angle-left"></i>',
			// 			"next": '<i class="icon-angle-right"></i>',
			// 			'of':ol_td.of,
			// 			'Page':ol_td.Page,
			// 		},
					
			// 		"info": ol_td.Foundtotal+" _TOTAL_ "+ol_td.records
			// 	}
			// });
			var classs = '';

			
			if(parseInt(checkNull(pagination.total_records,0)) <  parseInt(checkNull(pagination.per_page,0)) ){
				classs = 'display:none';
			}

			var phtml = '<div class="row-fluid form-inline dt_rem">';
				phtml += '<div class="span12 dataTables_extended_wrapper">';
				   	phtml += '<div class="dataTables_paginate paging_input" id="partner_inv_list_paginate" style="'+classs+'">';
				   	 	phtml += '<span class="paginate_page">'+ol_td.Page+' </span>';
		   	 		 	phtml += '<span class="previous prev btn btn-sm default paginate_button" id="partner_inv_list_previous prev btn btn-sm default"><i class="icon-angle-left"></i></span>';
		   	 			phtml += '<input class="paginate_input form-control input-mini input-inline input-sm" type="text">';
		   	 			phtml += '<span class="next next btn btn-sm default paginate_button" id="partner_inv_list_next next btn btn-sm default"><i class="icon-angle-right"></i></span>';
		   	 			phtml += '<span class="paginate_of"> '+ol_td.of+' '+pagination.total_pages+' |</span>';
			   	 	phtml += '</div>';
				  	phtml += ' <div id="partner_inv_list_length" class="dataTables_length"  style="'+classs+'">';
				      	phtml += '<label style="margin-bottom:0">';
				        	phtml += ol_td.View;
				        	phtml += ' <select id="partner_inv_list_sel" style="margin-right:2px">';
					            phtml += '<option value="10" selected="selected">10</option>';
					            phtml += '<option value="20">20</option>';
					            phtml += '<option value="30">30</option>';
					           	phtml += '<option value="40">40</option>';
					            phtml += '<option value="50">50</option>';
					            phtml += '<option value="-1">All</option>';
					         	phtml += '</select>';
				       		phtml += ol_td.records;
				      	phtml += ' | </label>';
				   	phtml += '</div>';
				   	if(pagination.total_records > 1){
				   			phtml += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+ol_td.Foundtotal+' '+pagination.total_records+' '+ol_td.records+'</div>';
				   	}
				   	else{
				   			phtml += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+ol_td.Foundtotal+' '+pagination.total_records+' '+ol_td.record+'</div>';
				   	}
				   
				phtml += '</div>';
			phtml += '</div>';

			$('.dt_rem').remove();
			$('#partner_order_list tbody').html(html);
			$('#partner_order_list').after(phtml);

			$('.alert').addClass('hide');
			$('#partner_order_list').removeClass('hide');
			
			cust_last_page = pagination.total_pages;
			order_lists.bindTable(pagination);
		}
		else{
			$('.alert').removeClass('hide');
			$('#partner_order_list').addClass('hide');
		}
	},
	sort:function(frm){
		var order_srch_dt = localStorage.getItem('order_search_data');
		order_srch_dt = JSON.parse(order_srch_dt);

		order_srch_dt.sort[0] = frm ;
		if(order_srch_dt.sort[1] == 'ASC'){
			order_srch_dt.sort[1] = 'DESC';
		}
		else{
			order_srch_dt.sort[1] = 'ASC';
		}
	
		localStorage.setItem('order_search_data',JSON.stringify(order_srch_dt));
		inv_current_page = 1;
		order_lists.getAndGenerateCust('',per_page);
	},
	removeItem:function(id){
		table.$('tr').each(function(i){
   			if($(this).find('p.del_row').attr('data-id') == id){
   				table.row(this).remove().draw();
   				return false;
   			}
		});
	},
	deleteOrder:function(id,frm='single'){
		var yes =function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
			}
			if(frm=='single'){
				total_params.order_id = id;
			}
			else{
				var ids = []
				for(var j in selected_data){
					if(selected_data[j].check == 1){
						ids.push(selected_data[j].id);
					}
				}
				total_params.order_ids = ids;
			}

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Orders/delete.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
		
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
	
					$('.del_row[data-id="'+id+'"]').trigger('click');
				
					call_toastr('success',ol_td.Success,complet_data.response.response.msg);

					// if(selected_data.length == 0){
					// 	$('#partner_order_list').dataTable().fnDestroy();
					// 	$('.alert').removeClass('hide');
					// 	$('#partner_order_list').addClass('hide');
					// }
			
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',ol_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',ol_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		};

		var no =function(){};
		

		showDeleteMessage(ol_td.$del_order,ol_td.Warning,yes,no,'ui-dialog-blue',ol_td.Delete,ol_td.Cancel);	
	},
	bindTable:function(pagination){
		$('#partner_inv_list_paginate .paginate_input').val(pagination.page_num);
		$('#partner_inv_list_paginate .prev').click(function(){
			if(cust_current_page!=1){
				order_lists.getAndGenerateCust('prev',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .next').click(function(){
			if(cust_current_page < cust_last_page){
				order_lists.getAndGenerateCust('next',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .paginate_input').change(function(){
			var v = $(this).val();

			if(checkNull(v) != '' && v != 0 && v != cust_current_page && v <= cust_last_page){
				order_lists.getAndGenerateCust('input',pagination.per_page,v);
			}
		});

		$("#partner_inv_list_length select").change(function(){
			var v = $(this).val();
			if(v==-1){
				v = 100000;
			}
			order_lists.getAndGenerateCust('dropdown',v);
		});
	},
	getAndGenerateCust:function(from,limit,v){
		var fields = ['Order.id','Order.order_number','Quote.quote_number','Order.created','Order.status','Order.customer_id','Order.customer_name'];
		
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			from:'all',
			getTranslationsData:'yes',
			search_from_quote:0,
			fields:JSON.stringify(fields),

			limit:limit,
			page:cust_current_page,
		};
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

		var ord_srch_dt = localStorage.getItem('order_search_data');
		if(checkNull(ord_srch_dt) != ''){
			ord_srch_dt = JSON.parse(ord_srch_dt);
			total_params = Object.assign(total_params,ord_srch_dt.fields);
		
			var sort = ord_srch_dt.sort;
			total_params['sort'] = sort[0];
			total_params['direction'] = sort[1];
		}
	
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Orders/getOrderList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var dol_dt = complet_data.response.response;
				order_lists.generateRows(dol_dt.getOrdersList.ordersList,'',dol_dt.getOrdersList.pagination);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ol_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ol_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	openDetails:function(id,from){
		if(from==1){
			var prefix = '';
			if(checkNull(type) == 'customer'){
				prefix = '/' + partner_dir +'/';
			}
			else{
				prefix = '/';
			}
			new_custom_main_page2(prefix+type+'/order/order_details/'+id,'orders_list','orders_list','order_details',{order_id:id});
			
		}
		else if(from==2){
			new_custom_main_page2('/'+type+'/customers/details/'+id,'all_customers','all_customers','customer_details',{customer_id:id});
		}
	},
}
