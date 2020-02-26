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
var session_customer_id = $('#session_customer_id').val();
var searchParams = new URLSearchParams(window.location.search);
var partner_dir = $('#partner_dir').val();
var sfrom = searchParams.get('from');
sfrom = checkNull(sfrom);
var table ;
var ql_dt;
var ql_td;
var selected_data = [];
var quoteStatus = {};
var pagelength = 10;

var cust_current_page = 1;
var per_page = 10;
var cust_last_page = 0;
var quote_lists = {
	start:function(){
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
			getTranslationsDataArray:['Dashboard','alert message','Success','Quote list','Status','Customer name','Date','Amount','Created date','Action','View','records','of','Found total','records','Customer','Delete','Success','No record found','$del_quote','Cancel','Quote number','Actions','New sales document','Search','Page','Clear search','Sales','Sent to customer','Accepted','Declined','Expired','Retract','Cancelled','Warning'],
		};

		var qut_srch_dt = localStorage.getItem('quote_search_data');
		if(checkNull(qut_srch_dt) != ''){
			qut_srch_dt = JSON.parse(qut_srch_dt);
			total_params = Object.assign(total_params,qut_srch_dt.fields);
			var sort = qut_srch_dt['sort'];

			total_params['sort'] = sort[0];
			total_params['direction'] = sort[1];
		}
		else{
			var qut_srch_dt = {
				fields:{
					customer_id:'',
					our_ref:'',
					quote_number:'',
					quote_status:'',
				},
				sort:['quote_number','DESC']
			};
			localStorage.setItem('quote_search_data',JSON.stringify(qut_srch_dt));
			total_params['sort'] = 'quote_number';
			total_params['direction'] = 'DESC';

		}
		if(type == 'customer'){
			total_params.customer_id = session_customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/getQuoteList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ql_dt = complet_data.response.response;
				ql_td = complet_data.response.response.translationsData;
				quote_lists.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ql_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ql_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		if(checkNull(ql_dt.settings[0][0].quote_list ) != ''){
			pagelength = parseInt(ql_dt.settings[0][0].quote_list);
		}
		quoteStatus = {
			1:'',
			2:ql_td.Senttocustomer,
			3:ql_td.Accepted,
			4:ql_td.Declined,
			5:ql_td.Expired,
			6:ql_td.Retract,
			7:ql_td.Cancelled
		};

		ql_dt.type = type;
		ql_td.dashboardurl = base_url+'dashboard/index';
		ql_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('quote_lists_template').innerHTML;
		var compiledRendered = Template7(template, ql_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		quote_lists.bindEvents();
	},
	bindEvents:function(){
		var qut_srch_dt = localStorage.getItem('quote_search_data');
		if(checkNull(qut_srch_dt) != ''){
			qut_srch_dt = JSON.parse(qut_srch_dt);
			qut_srch_dt = qut_srch_dt.fields;
			if(checkNull(qut_srch_dt.customer_id) != '' || checkNull(qut_srch_dt.our_ref) != '' || checkNull(qut_srch_dt.quote_number) != '' || checkNull(qut_srch_dt.quote_status) != ''){
				$('.clear_search').show();
			}
			else{
				$('.clear_search').hide();
			}
		}

		$('.clear_search').click(function(){
			var quote_search_data = {
				fields:{
					customer_id:'',
					our_ref:'',
					quote_number:'',
					quote_status:'',
				},
				sort:['quote_number','DESC']
			};
			localStorage.setItem('quote_search_data',JSON.stringify(quote_search_data));

			showProcessingImage('undefined');
			quote_lists.start();
		});
		quote_lists.generateRows(ql_dt.quotes_list,'',ql_dt.pagination);
	},
	generateRows:function(data,frm,pagination){
		var tablejson = [];
		var k = -1;
		var html = '';
		for(var j in data){
			k++;
			tablejson[k] = [];

			var d = data[j][0];
			var q = data[j].Quote;

			var act = '<a id="view_invoice_'+q.id+'" class="btn mini blue-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+ql_td.View+'" onclick="quote_lists.openDetails('+q.id+',1);"><i class="icon-eye-open"></i> '+ql_td.View+'</a>&nbsp;';


			if(type != 'customer'){
				act += '<a class="btn mini blue-stripe tooltips view_btn" data-placement="bottom" data-original-title="'+ql_td.Customer+'" href="'+base_url+'customers/details/'+q.customer_id+'" onclick="quote_lists.openDetails('+q.customer_id+',2);return false;"><i class="icon-user"></i> '+ql_td.Customer+'</a>&nbsp;';

				if(q.status == 1){
					act += '<a class="btn mini red-stripe tooltips del_btn" data-placement="bottom" data-original-title="'+ql_td.Customer+'" onClick="quote_lists.deleteQuote('+q.id+');return false;"><i class="icon-remove"></i> '+ql_td.Delete+'</a>';
					act += '<p class="del_row hide" data-id="'+q.id+'" onClick="quote_lists.removeItem('+q.id+')"></p>';

				}
			}


			//tablejson[k].push(check);
			html += '<tr>';
			tablejson[k].push(checkNull(q.quote_number));
			html += '<td>'+checkNull(q.quote_number)+'</td>';

			tablejson[k].push(checkNull(q.customer_name));
			html += '<td>'+checkNull(q.customer_name)+'</td>';

			tablejson[k].push(CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.gross_amount,0)));
			html += '<td>'+CUR_SYM+' '+convertIntoLocalFormat(checkNull(d.gross_amount,0))+'</td>';

			tablejson[k].push(convertDateIntoSiteFormat(checkNull(q.created)));
			html += '<td>'+convertDateIntoSiteFormat(checkNull(q.created))+'</td>';

			tablejson[k].push(checkNull(quoteStatus[q.status],''));
			html += '<td>'+checkNull(quoteStatus[q.status],'')+'</td>';

			tablejson[k].push(act);
			html += '<td>'+checkNull(act)+'</td>';

			html += '</tr>';
		
		}
		var quote_search_data = localStorage.getItem('quote_search_data');
		quote_search_data = JSON.parse(quote_search_data);
		var sort = quote_search_data.sort;
		//$('#partner_quote_list').DataTable().destroy();
		
		if(tablejson.length!=0){
			var classs = '';

			
			if(parseInt(checkNull(pagination.total_records,0)) <  parseInt(checkNull(pagination.per_page,0)) ){
				classs = 'display:none';
			}

			var phtml = '<div class="row-fluid form-inline dt_rem">';
				phtml += '<div class="span12 dataTables_extended_wrapper">';
				   	phtml += '<div class="dataTables_paginate paging_input" id="partner_inv_list_paginate" style="'+classs+'">';
				   	 	phtml += '<span class="paginate_page">'+ql_td.Page+' </span>';
		   	 		 	phtml += '<span class="previous prev btn btn-sm default paginate_button" id="partner_inv_list_previous prev btn btn-sm default"><i class="icon-angle-left"></i></span>';
		   	 			phtml += '<input class="paginate_input form-control input-mini input-inline input-sm" type="text">';
		   	 			phtml += '<span class="next next btn btn-sm default paginate_button" id="partner_inv_list_next next btn btn-sm default"><i class="icon-angle-right"></i></span>';
		   	 			phtml += '<span class="paginate_of"> '+ql_td.of+' '+pagination.total_pages+' |</span>';
			   	 	phtml += '</div>';
				  	phtml += ' <div id="partner_inv_list_length" class="dataTables_length"  style="'+classs+'">';
				      	phtml += '<label style="margin-bottom:0">';
				        	phtml += ql_td.View;
				        	phtml += ' <select id="partner_inv_list_sel" style="margin-right:2px">';
					            phtml += '<option value="10" selected="selected">10</option>';
					            phtml += '<option value="20">20</option>';
					            phtml += '<option value="30">30</option>';
					           	phtml += '<option value="40">40</option>';
					            phtml += '<option value="50">50</option>';
					            phtml += '<option value="-1">All</option>';
					         	phtml += '</select>';
				       		phtml += ql_td.records;
				      	phtml += ' | </label>';
				   	phtml += '</div>';
				   	if(pagination.total_records > 1){
				   			phtml += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+ql_td.Foundtotal+' '+pagination.total_records+' '+ql_td.records+'</div>';
				   	}
				   	else{
				   			phtml += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+ql_td.Foundtotal+' '+pagination.total_records+' '+ql_td.record+'</div>';
				   	}
				   
				phtml += '</div>';
			phtml += '</div>';

			$('.dt_rem').remove();
			$('#partner_quote_list tbody').html(html);
			$('#partner_quote_list').after(phtml);

			// table = $('#partner_quote_list').DataTable({ 
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
			//            ql_td.View+ ' <select>'+
			//              '<option value="10">10</option>'+
			//              '<option value="20">20</option>'+
			//             '<option value="30">30</option>'+
			//              '<option value="40">40</option>'+
			//              '<option value="50">50</option>'+
			//              '<option value="-1">All</option>'+
			//              '</select> '+ ql_td.records+ ' |  '
			//          ,
			// 		"paginate": {
			// 			"previous": '<i class="icon-angle-left"></i>',
			// 			"next": '<i class="icon-angle-right"></i>',
			// 			'of':ql_td.of,
			// 			'Page':ql_td.Page,
			// 		},
					
			// 		"info": ql_td.Foundtotal+" _TOTAL_ "+ql_td.records
			// 	}
			// });
			cust_last_page = pagination.total_pages;
			quote_lists.bindTable(pagination);
		}
		else{
			$('.alert').removeClass('hide');
			$('#partner_quote_list').addClass('hide');
		}
		

	},
	sort:function(frm){
		var quote_srch_dt = localStorage.getItem('quote_search_data');
		quote_srch_dt = JSON.parse(quote_srch_dt);

		quote_srch_dt.sort[0] = frm ;
		if(quote_srch_dt.sort[1] == 'ASC'){
			quote_srch_dt.sort[1] = 'DESC';
		}
		else{
			quote_srch_dt.sort[1] = 'ASC';
		}
	
		localStorage.setItem('quote_search_data',JSON.stringify(quote_srch_dt));
		inv_current_page = 1;
		quote_lists.getAndGenerateCust('',per_page);
	},
	removeItem:function(id){
		table.$('tr').each(function(i){
   			if($(this).find('p.del_row').attr('data-id') == id){
   				table.row(this).remove().draw();
   				return false;
   			}
		});
	},
	deleteQuote:function(id,frm='single'){
		var yes =function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
			}
			if(frm=='single'){
				total_params.quote_id = id;
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
			params['url'] = APISERVER+'/api/Quotes/delete.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
	
					$('.del_row[data-id="'+id+'"]').trigger('click');
				
					call_toastr('success',ql_td.Success,complet_data.response.response.msg);

					// if(selected_data.length == 0){
					// 	$('#partner_quote_list').dataTable().fnDestroy();
					// 	$('.alert').removeClass('hide');
					// 	$('#partner_quote_list').addClass('hide');
					// }
			
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',ql_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',ql_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		};

		var no =function(){};
		

		showDeleteMessage(ql_td.$del_quote,ql_td.Warning,yes,no,'ui-dialog-blue',ql_td.Delete,ql_td.Cancel);
		
	},
	bindTable:function(pagination){
		$('.uni').off();
		$('.uni').uniform();
		$('.checkall').change(function(){
			var l  = $('.checkall:checked').length;
			if(l==1){
				quote_lists.updateSelData(0,'check');
			}
			else{
				quote_lists.updateSelData(0,'uncheck');
			}
			quote_lists.showHideBtn();
		});

		$('#partner_quote_list').on('change','.single_check',function(){
			var data_id = $(this).attr('data-id');
			var l = $('.single_check_'+data_id+':checked').length;
			var o =quote_lists.updateSelData(data_id,'search');
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
			quote_lists.showHideBtn();
		});
		
		$('#partner_inv_list_paginate .paginate_input').val(pagination.page_num);
		$('#partner_inv_list_paginate .prev').click(function(){
			if(cust_current_page!=1){
				quote_lists.getAndGenerateCust('prev',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .next').click(function(){
			if(cust_current_page < cust_last_page){
				quote_lists.getAndGenerateCust('next',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .paginate_input').change(function(){
			var v = $(this).val();

			if(checkNull(v) != '' && v != 0 && v != cust_current_page && v <= cust_last_page){
				quote_lists.getAndGenerateCust('input',pagination.per_page,v);
			}
		});

		$("#partner_inv_list_length select").change(function(){
			var v = $(this).val();
			if(v==-1){
				v = 100000;
			}
			quote_lists.getAndGenerateCust('dropdown',v);
		});
	},
	showHideBtn:function(){
		var r = quote_lists.updateSelData(0,'length');
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
			var prefix = '';
			if(checkNull(type) == 'customer'){
				prefix = '/' + partner_dir +'/';
			}
			else{
				prefix = '/';
			}

			new_custom_main_page2(prefix+type+'/quotes/quote_details/'+id,'quotes_list','quotes_list','quote_details',{quote_id:id});
			
		}
		else if(from==2){
			new_custom_main_page2('/'+type+'/customer/details/'+id,'all_customers','all_customers','customer_details',{customer_id:id});
		}
	},
	deleteSales:function(id,frm='single'){
		console.log(id);
		console.log(frm);

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
					call_toastr('success',ql_td.Success,complet_data.response.response.msg);
					quote_lists.showHideBtn();
					if(selected_data.length == 0){
						$('#partner_quote_list').DataTable().destroy();
						$('.alert').removeClass('hide');
						$('#partner_quote_list').addClass('hide');
					}
			
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',ql_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',ql_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		};

		var no =function(){};
		if(frm=='single'){
			showDeleteMessage(ql_td.$del_sales,ql_td.Warning,yes,no,'ui-dialog-blue',ql_td.Delete,ql_td.Cancel);
		}
		else{
			showDeleteMessage(ql_td.$del_sales_multi,ql_td.Warning,yes,no,'ui-dialog-blue',ql_td.Delete,ql_td.Cancel);
		}		
	},
	getAndGenerateCust:function(from,limit,v){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			limit:limit,
			page:cust_current_page,
			from:'all',
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

		var quote_srch_data = localStorage.getItem('quote_search_data');
		if(checkNull(quote_srch_data) != ''){
			quote_srch_data = JSON.parse(quote_srch_data);
			console.log('quote_srch_data',quote_srch_data);
			var sort = quote_srch_data.sort;
			total_params['sort'] = sort[0];
			total_params['direction'] = sort[1];

		}
		else{
			var fields = {
				customer_number:'',
				customer_name:'',
				user_group_id:'',
				customer_groups:'',
				email:'',
				customer_phone_number:'',
				status:'',
				sort:'id',
				direction:'DESC',
			};

			quote_srch_data = JSON.stringify({fields:fields,sort:[ 'id', 'DESC' ]});
			localStorage.setItem('quote_search_data',quote_srch_data);
			quote_srch_data = JSON.parse(quote_srch_data);
		}
		total_params = Object.assign(total_params,quote_srch_data.fields);

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/getQuoteList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var aal_dt = complet_data.response.response;
				quote_lists.generateRows(aal_dt.quotes_list,'',aal_dt.pagination);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ql_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ql_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},

}