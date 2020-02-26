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

var table ;
var cml_dt;
var cml_td;
var cml_meta;
var selected_data = [];
var quoteStatus = {};
var pagelength = 10;
var credit_memo_list = {
	start:function(meta={}){
		cml_meta = meta;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			fields:JSON.stringify(fields),
			getTranslationsDataArray:['Dashboard','alert message','Success','Credit memo list','Credit number','Invoice number','Customer number','Customer name','Credit date','Amount','Action','Actions','Search','Clear search','Page','of','Found total','records','View','Customer','No record found','Credit memo','Invoice'],

		};
		var cm_srch_dt = localStorage.getItem('creditmemo_search_data');
		if(checkNull(cm_srch_dt) != ''){
			cm_srch_dt = JSON.parse(cm_srch_dt);
			total_params = Object.assign(total_params,cm_srch_dt.fields);
		}
		else{
			var fields = {
				credit_number:'',
				customer_id:'',
				customer_name:'',
			};
			var cm_srch_dt = JSON.stringify({fields:fields,sort:[ 0, "desc" ]});
			localStorage.setItem('creditmemo_search_data',cm_srch_dt);
			cm_srch_dt = JSON.parse(cm_srch_dt);
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Invoices/getCreditMemoList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				cml_dt = complet_data.response.response;
				cml_td = complet_data.response.response.translationsData;
				credit_memo_list.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cml_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cml_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		cml_td.dashboardurl = base_url+'dashboard/index';
		cml_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('credit_memo_list_template').innerHTML;
		var compiledRendered = Template7(template, cml_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		credit_memo_list.bindEvents();
	},
	bindEvents:function(){
		$('#invoiceOption').select2();
		$('#invoiceOption').change(function(){
			var value = $(this).val();
			if(value == 'invoice'){
				new_custom_main_page2('/' +type + '/invoice/invoice_list','invoices_list','invoices_list','invoice_lists');
			}

		})

		var cm_srch_dt = localStorage.getItem('creditmemo_search_data');
		if(checkNull(cm_srch_dt) != ''){
			cm_srch_dt = JSON.parse(cm_srch_dt);

			if(checkNull(cm_srch_dt.fields.customer_id) != '' || checkNull(cm_srch_dt.fields.customer_name) != '' || checkNull(cm_srch_dt.fields.credit_number) != '' ){
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

			var cm_search_data = localStorage.getItem('creditmemo_search_data');
			cm_search_data = JSON.parse(cm_search_data);
			cm_search_data.fields = {
				credit_number:'',
				customer_id:'',
				customer_name:'',
			}
			localStorage.setItem('creditmemo_search_data',JSON.stringify(cm_search_data));
			showProcessingImage('undefined');
			credit_memo_list.start();
		});
		credit_memo_list.generateRows(cml_dt.creditList);
	},
	generateRows:function(data,frm){
		if(data.length == 1 && cml_meta.from == 'search'){
			credit_memo_list.goToMemo(data[0].CreditNote.id);
			return;
		}
		var tablejson = [];
		var k = -1;
		for(var j in data){
			k++;
			tablejson[k] = [];
			var cn = data[j].CreditNote;

			tablejson[k].push(checkNull(cn.credit_number,'-'));
			tablejson[k].push(checkNull(cn.invoice_number,'-'));
			tablejson[k].push(checkNull(cn.customer_number,'-'));
			tablejson[k].push(checkNull(cn.company_name,'-'));

			tablejson[k].push(convertDateIntoSiteFormat(checkNull(cn.credit_date,'')));
			tablejson[k].push(CUR_SYM+' '+convertIntoLocalFormat(checkNull(cn.gross_amount,'')));
			
			var act = '<button class="btn mini blue-stripe" onclick="event.stopPropagation();credit_memo_list.goToMemo('+cn.id+')" style="button"><i class="icon-eye-open"></i> '+cml_td.View+'</button>&nbsp;';

			act += '<button class="btn mini blue-stripe" onclick="event.stopPropagation();credit_memo_list.goToCustomer('+cn.customer_id+')" style="button"><i class="icon-user"></i> '+cml_td.Customer+'</button>&nbsp;';

			tablejson[k].push(act);
		}
		var cm_srch_dt = localStorage.getItem('creditmemo_search_data');
		cm_srch_dt = JSON.parse(cm_srch_dt);
		var sort = cm_srch_dt.sort;
	
		$('#credit_memo_list').DataTable().destroy();

		if(tablejson.length!=0){
			table = $('#credit_memo_list').DataTable({ 
				"data": tablejson,
				"pagelength":pagelength,
				"sorting": [sort],
				"displayLength": 10,
				"columnDefs": [ {
			          "targets": 'no-sort',
			          "orderable": false,
			    }],
				"aLengthMenu": [ 10, 25, 50, 100 ], 
				"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
				"pagingType": "input",
				"language": {
					"lengthMenu": 
			           cml_td.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ cml_td.records+ ' |  '
			         ,
					"paginate": {
						"previous": '<i class="icon-angle-left"></i>',
						"next": '<i class="icon-angle-right"></i>',
						'of':cml_td.of,
						'Page':cml_td.Page,
					},
					
					"info": cml_td.Foundtotal+" _TOTAL_ "+cml_td.records
				}
			});
			credit_memo_list.bindTable();
			$('.alert').hide();
			$('#credit_memo_list').show();
		}
		else{
			$('.alert').show();
			$('#credit_memo_list').hide();
		}
	},
	goToMemo:function(id){
		window.location.href = base_url + 'invoice/credit_memo_details/'+id;		
	},
	goToCustomer:function(customer_id){
		new_custom_main_page2('/'+type +'/'+'customers/details/'+customer_id,'all_customers','all_customers','customer_details',{customer_id:customer_id});
	},
	bindTable:function(){
		table.on( 'order.dt', function () {
		    var orderss = table.order();
		    var cm_srch_dt = localStorage.getItem('creditmemo_search_data');
		    cm_srch_dt = JSON.parse(cm_srch_dt);
		    if(checkNull(orderss[0]) != ''){
		    	cm_srch_dt['sort'] = orderss[0];
		    }
		    else{
		    	cm_srch_dt['sort'] = [ 0, "desc" ];
		    }
		    cm_srch_dt = JSON.stringify(cm_srch_dt);
			localStorage.setItem('creditmemo_search_data',cm_srch_dt);
		});
	},
	openDetails:function(id,from){
		if(from==1){
			new_custom_main_page2('/'+type+'/order/order_details/'+id,'orders_list','orders_list','order_details',{order_id:id});
			
		}
		else if(from==2){
			new_custom_main_page2('/'+type+'/customer/details/'+id,'all_customers','all_customers','customer_details',{customer_id:id});
		}
	},
}
