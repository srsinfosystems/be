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
var il_dt;
var il_td;
var selected_data = [];
var quoteStatus = {};
var pagelength = 10;
var inv_current_page = 1;
var per_page = 10;
var inv_last_page = 0;
var il_meta = {};
var invoice_lists = {
	start:function(meta={}){
		il_meta = meta;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','Invoice list','Invoice number','Invoice date','Due date','Balance','Payment status','Action','Page','View','records','of','Found total','records','Customer','Delete','Success','No record found','Customer name','Actions','Draft','Not paid','Partially paid','Paid','Partially credited','Credited','Lost','$loss_pp','Loss paid','$loss_pc','Loss credited','Recovered from loss','Scheduled','Refund','Payment','Return to sender','Conflict','Sales','New sales document','Search','Clear search','Invoice','Credit memo','Invoices'],

		};
		var inv_srch_data = localStorage.getItem('invoice_search_data');
		if(checkNull(inv_srch_data) != ''){
			inv_srch_data = JSON.parse(inv_srch_data);
			total_params = Object.assign(total_params,inv_srch_data.fields);
			var sort = inv_srch_data.sort;
			total_params['sort'] = sort[0];
			total_params['direction'] = sort[1];
		}
		else{
			var fields = {
				customer_id:'',
				customer_name:'',
				our_ref:'',
				status:'',
			};
			var inv_srch_data = JSON.stringify({fields:fields,sort:[ 'invoice_number', 'DESC' ]});
			localStorage.setItem('invoice_search_data',inv_srch_data);
			inv_srch_data = JSON.parse(inv_srch_data);
			var sort = inv_srch_data.sort;
			total_params['sort'] = sort[0];
			total_params['direction'] = sort[1];
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Invoices/invoiceLists.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				il_dt = complet_data.response.response;
				il_td = complet_data.response.response.translationsData;
				if(checkNull(il_meta.from) == 'search' && il_dt.invoices.invoiceList.length == 1){
					invoice_lists.goToInvoice(il_dt.invoices.invoiceList[0].Invoice.id);
					return;
				}
				invoice_lists.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',il_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',il_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createHtml:function(){
		il_dt.type = type;
		il_td.dashboardurl = base_url+'dashboard/index';
		il_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('invoice_lists_template').innerHTML;
		var compiledRendered = Template7(template, il_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		invoice_lists.bindEvents();
	},
	bindEvents:function(){
		$('#invoiceOption').select2();
		$('#invoiceOption').change(function(){
			var value = $(this).val();
			if(value == 'credit_memo'){
				new_custom_main_page2('/' +type + '/invoice/credit_memo_list','invoices_list','invoices_list','credit_memo_list');
			}

		});

		var inv_srch_dt = localStorage.getItem('invoice_search_data');
		if(checkNull(inv_srch_dt) != ''){
			inv_srch_dt = JSON.parse(inv_srch_dt);

			if(checkNull(inv_srch_dt.fields.customer_id) != '' || checkNull(inv_srch_dt.fields.customer_name) != '' || checkNull(inv_srch_dt.fields.our_ref) != '' || checkNull(inv_srch_dt.fields.status) != '' || checkNull(inv_srch_dt.fields.invoice_number) != ''){ 
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

			var inv_srch_dt = localStorage.getItem('invoice_search_data');
			inv_srch_dt = JSON.parse(inv_srch_dt);
			inv_srch_dt.fields = {
				customer_id:'',
				customer_name:'',
				our_ref:'',
				status:'',
				invoice_number:''
			}
			localStorage.setItem('invoice_search_data',JSON.stringify(inv_srch_dt));
			showProcessingImage('undefined');
			invoice_lists.start();
		});

		
		invoice_lists.generateRows(il_dt.invoices.invoiceList,il_dt.invoices.pagination);
	},
	getStatusold:function(inv_status={},other_params = {}){
		var draft_scheduled = other_params.draft_scheduled;
		var returned_to_sender = other_params.returned_to_sender;
		var conflict = other_params.conflict;
		var invoice_gross = other_params.invoice_gross;
		var credit_sum = other_params.credit_sum;
		

		if(returned_to_sender == '1' && conflict == 'n'){
			return  '<font color=red >'+il_td.Returntosender+'<br /></font>';
		}
		else if(returned_to_sender == '1' && conflict == 'y'){
			return '<font color=red >'+il_td.Conflict+'<br /></font>';
		}
		
		var inv_status_arr = {
			draft_invoice:il_td.Draft,
			not_paid:'<font color=red >'+il_td.Notpaid + '</font>',
			partially_paid:'<font color=green >'+il_td.Partiallypaid + '</font>',
			fully_paid:'<font color=green >'+il_td.Paid + '</font>',
			partially_credited:il_td.Partiallycredited,
			fully_credited:il_td.Credited,
			loss:il_td.Lost,
			loss_partially_paid:il_td.$loss_pp,
			loss_fully_paid:il_td.Losspaid,
			loss_partially_credited:il_td.$loss_pc,
			loss_fully_credited:il_td.Losscredited,
			recovered_from_loss:il_td.Recoveredfromloss,
			scheduled:il_td.Scheduled,
		};

		var i_status = checkNull(inv_status.invoice_status);
		var c_status = checkNull(inv_status.credit_status);

		var inv_status = checkNull(inv_status_arr[i_status]);
		var credit_status =  checkNull(inv_status_arr[credit_status]);
		if(c_status == 'partially_credited') {
			if(checkNull(inv_status_arr[c_status])!=''){
				credit_status = '&nbsp;<small>'+ inv_status_arr[c_status] + '</small>';
			}
			else{
				credit_status = '';
			}
			
		}
		return inv_status + credit_status;
	},
	getStatus:function(inv_status='',other_params = {}){
		
		if(checkNull(inv_status) == ''){
			//
			
		}
		var draft_scheduled = checkNull(other_params.draft_scheduled);
		var returned_to_sender = checkNull(other_params.returned_to_sender);
		var conflict = checkNull(other_params.conflict);
		var invoice_gross = checkNull(other_params.invoice_gross);
		var credit_sum = checkNull(other_params.credit_sum);
		

		if(returned_to_sender == '1' && conflict == 'n'){
			is_inv_return = 'y';
			return  '<font color=red >'+il_td.Returntosender+'<br /></font>';
		}
		else if(returned_to_sender == '1' && conflict == 'y'){
			is_inv_conflict = 'y';
			return '<font color=red >'+il_td.Conflict+'<br /></font>';
		}
		
		if(type != 'customer'){
			var inv_status_arr = {
				0:il_td.Draft,
				1:'<font color=red >'+il_td.Notpaid + '</font>',
				2:'<font color=green >'+il_td.Partiallypaid + '</font>',
				3:'<font color=green >'+il_td.Paid + '</font>',
				4:il_td.Partiallycredited,
				5:il_td.Credited,
				6:il_td.Lost,
				7:il_td.$loss_pp,
				8:il_td.Losspaid,
				9:il_td.$loss_pc,
				10:il_td.Losscredited,
				11:il_td.Recoveredfromloss,
				12:il_td.Scheduled,
			};
		}
		else{
			var inv_status_arr = {
				0:il_td.Draft,
				1:'<font color=red >'+il_td.Notpaid + '</font>',
				4:'<font color=red >'+il_td.Notpaid + '</font>',
				6:'<font color=red >'+il_td.Notpaid + '</font>',
				2:'<font color=green >'+il_td.Partiallypaid + '</font>',
				7:'<font color=green >'+il_td.Partiallypaid + '</font>',
				5:'<font color=green >'+il_td.Paid + '</font>',
				3:'<font color=green >'+il_td.Paid + '</font>',
				8:'<font color=green >'+il_td.Paid + '</font>',
			};
		}
		

		return checkNull(inv_status_arr[inv_status]);
		
		var inv_status_arr = {
			draft_invoice:il_td.Draft,
			not_paid:'<font color=red >'+il_td.Notpaid + '</font>',
			partially_paid:'<font color=green >'+il_td.Partiallypaid + '</font>',
			fully_paid:'<font color=green >'+il_td.Paid + '</font>',
			partially_credited:il_td.Partiallycredited,
			fully_credited:il_td.Credited,
			loss:il_td.Lost,
			loss_partially_paid:il_td.$loss_pp,
			loss_fully_paid:il_td.Losspaid,
			loss_partially_credited:il_td.$loss_pc,
			loss_fully_credited:il_td.Losscredited,
			recovered_from_loss:il_td.Recoveredfromloss,
			scheduled:il_td.Scheduled,
		};

		var i_status = checkNull(inv_status.invoice_status);
		var c_status = checkNull(inv_status.credit_status);

		var inv_status = checkNull(inv_status_arr[i_status]);
		var credit_status =  checkNull(inv_status_arr[credit_status]);
		if(c_status == 'partially_credited') {
			if(checkNull(inv_status_arr[c_status])!=''){
				credit_status = '&nbsp;<small>'+ inv_status_arr[c_status] + '</small>';
			}
			else{
				credit_status = '';
			}
			
		}
		return inv_status + credit_status;
	},
	generateRows:function(data,pagination){
		var tr = '';
		for(var j in data){
			var d = data[j];
			var i = data[j].Invoice;
			var idl = data[j].InvoiceDetail;

			tr += '<tr>';
				tr += '<td>';
					tr += (checkNull(i.invoice_number)=='')?'-':i.invoice_number;
				tr += '</td>';

				tr += '<td>';
					tr +=checkNull(idl.company_name);
				tr += '</td>';

				tr += '<td>';
					tr +=convertDateIntoSiteFormat(checkNull(i.invoice_date));
				tr += '</td>';

				tr += '<td>';
					tr += convertDateIntoSiteFormat(checkNull(i.due_date));
				tr += '</td>';

				tr += '<td style="text-align:right">';
					tr += CUR_SYM+' '+ convertIntoLocalFormat(checkNull(i.out_standing_balance));
				tr += '</td>';

				tr += '<td>';
					var otherParams = {
						'draft_scheduled' : checkNull(i.draft_scheduled),
						'returned_to_sender':checkNull(i.returned_to_sender),
						'conflict':checkNull(i.conflict),
						'invoice_gross':checkNull(i.gross_amount,0),
						'credit_sum':checkNull(i.credit_sum,0),
					};
					
					if(checkNull(idl.system_do_not_send_reminders) == '' || checkNull(idl.system_do_not_send_reminders) == "0"){
			 			var a = checkNull(invoice_lists.getStatus(i.internal_status,otherParams));
			 			tr += a;

					}
					else{
						tr += checkNull(invoice_lists.getStatus(i.internal_status,otherParams));
					}
				tr += '</td>';

				tr += '<td>';
					tr += '<a id="view_invoice_'+i.id+'" class="btn mini blue-stripe" href="javascript:;" onclick="invoice_lists.goToInvoice('+i.id+')">';
						tr += '<i class="icon-eye-open"></i>&nbsp;' +il_td.View+'</a>&nbsp;';
					
					if(type != 'customer'){
						
						tr += '<a id="view_invoice_'+i.id+'" class="btn mini blue-stripe" href="javascript:;" onclick="invoice_lists.goToCustomer('+i.receiver_id+')">';
						tr += '<i class="icon-user"></i>&nbsp;' +il_td.Customer+'</a>&nbsp;';

						if(i.refund_flag==1){
							var url = base_url + 'invoice/refund_payments?ad_inv=N&from_card=y&invoice_id='+i.id+'&receiver_id='+i.receiver_id+'&journal_id='+i.journal_id;
							tr += '<a class="btn mini green-stripe" data-width="1000px" data-url="'+url+'" onclick="show_modal(this,\'popups\')">';
							tr += '<i class="icon-ok"></i>&nbsp;' +il_td.Refund+'</a>';
						}
						else{
							if(i.invoice_status!=0){
								var qString = {
									'selectedinvoice[]': i.id+'::'+i.receiver_id,
									'single_sel':'y',
									'from_card':'y',
									'from':'newinvoicelist'
								};

								var qkey = '';
								var qvalue= '';
									if(checkNull(i.add_string)!='' && checkNull(i.add_string)!=0){
										$add_str_arr = checkNull(i['add_string']).split('=>');
										var add_str_arr = i.add_string.split('=>');
										var qkey = checkNull(add_str_arr[0]);
										var qvalue = checkNull(add_str_arr[1]);
										qString[qkey] = qvalue;
									}
							}
							var qstr = '';
							var i = 0;
							for(var j in qString){
								i++;
								if(i==1){
									qstr += j+'='+qString[j];
								}
								else{
									qstr += '&'+j+'='+qString[j];
								}
							}
							var url = base_url + 'invoice/register_payment?'+qstr;
							tr += '<a class="btn mini green-stripe" data-width="600px" data-url="'+url+'" onclick="show_modal(this,\'popups\')">';
							tr += '<i class="icon-ok"></i>&nbsp;' +il_td.Payment+'</a>';
						}
					}
					else{
						$('th.no-sort').css('width','65px').removeClass('action');
					}

				tr += '</td>';
			tr += '<tr>';
		}

		
		var html = '<div class="row-fluid form-inline dt_rem">';
			html += '<div class="span12 dataTables_extended_wrapper">';
			   	html += '<div class="dataTables_paginate paging_input" id="partner_inv_list_paginate">';
			   	 	html += '<span class="paginate_page">'+il_td.Page+' </span>';
	   	 		 	html += '<span class="previous prev btn btn-sm default paginate_button" id="partner_inv_list_previous prev btn btn-sm default"><i class="icon-angle-left"></i></span>';
	   	 			html += '<input class="paginate_input form-control input-mini input-inline input-sm" type="text">';
	   	 			html += '<span class="next next btn btn-sm default paginate_button" id="partner_inv_list_next next btn btn-sm default"><i class="icon-angle-right"></i></span>';
	   	 			html += '<span class="paginate_of"> '+il_td.of+' '+pagination.total_pages+' |</span>';
		   	 	html += '</div>';
			  	html += ' <div id="partner_inv_list_length" class="dataTables_length">';
			      	html += '<label style="margin-bottom:0">';
			        	html += il_td.View;
			        	html += ' <select id="partner_inv_list_sel" style="margin-right:2px">';
				            html += '<option value="10" selected="selected">10</option>';
				            html += '<option value="20">20</option>';
				            html += '<option value="30">30</option>';
				           	html += '<option value="40">40</option>';
				            html += '<option value="50">50</option>';
				            html += '<option value="-1">All</option>';
				         	html += '</select>';
			       		html += il_td.records;
			      	html += ' | </label>';
			   	html += '</div>';
			   	html += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+il_td.Foundtotal+' '+pagination.total_records+' '+il_td.records+'</div>';
			html += '</div>';
		html += '</div>';

		inv_last_page = pagination.total_pages;
		
		$('#partner_inv_list tbody').html(tr);
		$('.dt_rem').remove();
		$('#partner_inv_list').after(html);
		if(data.length == 0){
			$('.inv_list_err').show();
			$('#partner_inv_list').hide();
			$('.dt_rem').hide();
		}
		else{
			$('.inv_list_err').hide();
			$('#partner_inv_list').show();
			$('.dt_rem').show();

		}
		$('#partner_inv_list_paginate .paginate_input').val(inv_current_page)
		per_page = pagination.per_page;
		$('#partner_inv_list_sel').val(pagination.per_page);

		if(pagination.total_records < pagination.per_page){
			$("#partner_inv_list_length.dataTables_length label,#partner_inv_list_paginate").hide();

		}

		$('#partner_inv_list_paginate .prev').click(function(){
			if(inv_current_page!=1){
				invoice_lists.getAndGenerateInvoices('prev',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .next').click(function(){
			if(inv_current_page < inv_last_page){
				invoice_lists.getAndGenerateInvoices('next',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .paginate_input').change(function(){
			var v = $(this).val();

			if(checkNull(v) != '' && v != 0 && v != inv_current_page && v <= inv_last_page){
				invoice_lists.getAndGenerateInvoices('input',pagination.per_page,v);
			}
		});

		$("#partner_inv_list_length select").change(function(){
			var v = $(this).val();
			if(v==-1){
				v = 10000;
			}
			invoice_lists.getAndGenerateInvoices('dropdown',v);
		});
	},
	goToCustomer:function(cust_id){
		new_custom_main_page2('/'+type+'/customers/details/'+cust_id,'all_customers','all_customers','customer_details',{customer_id:cust_id});
	},
	goToInvoice:function(id,cust_id){
		var pd = '';
		if(type == 'customer'){
			pd = '/'+partner_dir + '/';
		}
		else{
			pd = '/';
		}
		new_custom_main_page2( pd + type + '/invoice/invoice_details/'+id,'invoices_list','invoices_list','invoice_details',{invoice_id:id});
		//window.location.href = base_url + 'invoice/invoice_details/' + id;
	},
	getAndGenerateInvoices:function(from='next',limit,v){

		var inv_srch_data = localStorage.getItem('invoice_search_data');
		if(checkNull(inv_srch_data) != ''){
			inv_srch_data = JSON.parse(inv_srch_data);
		}
		else{
			inv_srch_data = {};
		}
		var sort = checkNull(inv_srch_data.sort);

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			limit:limit,
			page:inv_current_page,
			direction:sort[1],
			sort:sort[0]
		}
		if(from=='next'){
			inv_current_page++;
		}
		else if(from=='prev'){
			inv_current_page--;
		}
		else if(from=='input'){
			inv_current_page = v;
		}
		else if(from=='dropdown'){
			inv_current_page = 1;
			total_params.limit = limit;
		}
		total_params.page = inv_current_page;

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Invoices/invoiceLists.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var dat = complet_data.response.response;
				invoice_lists.generateRows(dat.invoices.invoiceList,dat.invoices.pagination);	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',il_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',il_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;

	},
	sort:function(frm){
		var inv_srch_dt = localStorage.getItem('invoice_search_data');
		inv_srch_dt = JSON.parse(inv_srch_dt);

		inv_srch_dt.sort[0] = frm ;
		if(inv_srch_dt.sort[1] == 'ASC'){
			inv_srch_dt.sort[1] = 'DESC';
		}
		else{
			inv_srch_dt.sort[1] = 'ASC';
		}
		localStorage.setItem('invoice_search_data',JSON.stringify(inv_srch_dt));
		inv_current_page = 1;
		invoice_lists.getAndGenerateInvoices('',per_page);
	}
}
