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
var fl_dt;
var fl_td;
var fl_meta = {};
var pagelength = 10;
var followup_statush = {};


var followup_lists = {
	start:function(meta){
		fl_meta = meta;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			request_from:fl_meta.from,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','No record found','Sales','$fll_plist','Actions','Search','Clear search','Document type','$doch','$fllu_stts','$fllu_date','Action','Customer name','Quote','Order','Invoice','Found total','records','of','Page','View','New','Open','Completed','Cancelled','Deleted','Details','Customer','Go to','SMS','$email','Send','Change Status','$update_status','Warning','Yes','No','Sales followup status updated successfully','Success'],
		};
		var followup_srch_dt = localStorage.getItem('followup_search_data');
		if(checkNull(followup_srch_dt) != ''){
			followup_srch_dt = JSON.parse(followup_srch_dt);
			
			total_params = Object.assign(total_params,followup_srch_dt.fields);
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
			var followup_srch_dt = JSON.stringify({fields:fields,sort:[ 0, "desc" ]});
			localStorage.setItem('followup_search_data',followup_srch_dt);
			followup_srch_dt = JSON.parse(followup_srch_dt);
		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/getFollowuplists.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				fl_dt = complet_data.response.response;
				fl_td = complet_data.response.response.translationsData;
				followup_lists.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',fl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',fl_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createHtml:function(){
		fl_dt.followup_statuses = {
			'new' : fl_td.New,
			'open' : fl_td.Open,
			'completed' : fl_td.Completed,
			'cancelled' : fl_td.Cancelled,
			'deleted' : fl_td.Deleted
		};

		followup_statush = {
			'new':'<i class="icon-plus"></i>&nbsp;' + fl_td.New,
			'open':'<i class="icon-folder-open"></i>&nbsp;' + fl_td.Open,
			'completed':'<i class="icon-ok"></i>&nbsp;' + fl_td.Completed,
			'cancelled':'<i class="icon-remove"></i>&nbsp;' + fl_td.Cancelled,
			'deleted' : '<i class="icon-remove"></i>&nbsp;' + fl_td.Deleted,
		};
		fl_dt.followup_statush = followup_statush;

		fl_td.dashboardurl = base_url+'dashboard/index';
		fl_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('followup_lists_template').innerHTML;
		var compiledRendered = Template7(template, fl_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		followup_lists.bindEvents();
	},
	bindEvents:function(){
		var flu_srch_dt = localStorage.getItem('followup_search_data');
		if(checkNull(flu_srch_dt) != ''){
			flu_srch_dt = JSON.parse(flu_srch_dt);
			if(checkNull(flu_srch_dt.fields.customer_id) != '' || checkNull(flu_srch_dt.fields.customer_email) != '' || checkNull(flu_srch_dt.fields.customer_name) != '' || checkNull(flu_srch_dt.fields.followup_status) != '' || checkNull(flu_srch_dt.fields.quote_number) != '' || checkNull(flu_srch_dt.fields.contact_id) != '' || checkNull(flu_srch_dt.fields.followup_date) != ''){
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

			var flu_srch_dt = localStorage.getItem('followup_search_data');
			flu_srch_dt = JSON.parse(flu_srch_dt);
			flu_srch_dt.fields = {
				customer_id:'',
				customer_email:'',
				customer_name:'',
				followup_status:'',
				quote_number:'',
				contact_id:'',
				followup_date:'',
			};
			localStorage.setItem('followup_search_data',JSON.stringify(flu_srch_dt));
			showProcessingImage('undefined');
			followup_lists.start(fl_meta);
		});
		
		followup_lists.generateRows(fl_dt.followupList);
	},
	showSearch:function(){
		new_custom_popup2('900','popups','followup_search',fl_meta);
	},
	generateRows:function(data,frm){
		var tablejson = [];
		var k = -1;

		for(var j in data){
		

			var d = data[j];
			var doc_type = '';
			var doc_number = '';
			var log_date = convertDateIntoSiteFormat(checkNull(d.Followup.log_date));
			var followup_date = convertDateIntoSiteFormat(checkNull(d.Followup.followup_date));
			var log_time = moment(checkNull(d.Followup.log_date)).format('HH:MM');
			
			var act_btns = '';

			var followup_id = d.Followup.id;

			if("Quote" in d && d.Quote != null && d.Quote != undefined && checkNull(d.Quote) != '' && checkNull(d.Quote.id) != ''){

				act_btns += '<a class="btn mini blue-stripe" onclick="followup_lists.showDetails(1,'+followup_id+','+d.Quote.id+')" href="javascript:void(0);"><i class="icon-info-sign"></i>&nbsp;'+fl_td.Details+'</a>&nbsp;';

				act_btns += '<div class="btn-group mobile-btn-groups group2">';
					act_btns += '<button id="UpdateAndBtn" data-toggle="dropdown" class="btn mini blue-stripe dropdown-toggle">'+fl_td.Goto+'...<i class="icon-angle-down"></i></button>';
					act_btns += '<ul class="dropdown-menu bottom-down pull-left followup" style="text-align:left;">';
					act_btns += '<li>';
						act_btns += '<a class="" onclick="followup_lists.showCust('+checkNull(d.Customer.id)+')" type="button" >';
							act_btns += '<i class="icon-user" style="margin-left:0px;"></i> '+fl_td.Customer;
						act_btns += '</a>';
					act_btns += '</li>';

					act_btns += '<li>';
						act_btns += '<a class="" onclick="followup_lists.gotoquote('+checkNull(d.Quote.id)+')" type="button" >';
							act_btns += '<i class="icon-bar-chart" style="margin-left:0px;"></i> '+fl_td.Quote;
							act_btns += '</a>';
						act_btns += '</li>';
					act_btns += '</ul>';
				act_btns += '</div>';

				doc_type = fl_td.Quote;
				doc_number = d.Quote.quote_number;
			}
			else if("Order" in d && d.Order != null && d.Order != undefined && checkNull(d.Order) != '' && checkNull(d.Order.id) != ''){
				act_btns += '<a class="btn mini blue-stripe" onclick="followup_lists.showDetails(2,'+followup_id+','+d.Order.id+')" href="javascript:void(0);"><i class="icon-info-sign"></i>&nbsp;'+fl_td.Details+'</a>&nbsp;';


				act_btns += '<div class="btn-group mobile-btn-groups group2">';
					act_btns += '<button id="UpdateAndBtn" data-toggle="dropdown" class="btn mini blue-stripe dropdown-toggle">'+fl_td.Goto+'...<i class="icon-angle-down"></i></button>';
					act_btns += '<ul class="dropdown-menu bottom-down pull-left followup" style="text-align:left;">';
					act_btns += '<li>';
						act_btns += '<a class="" onclick="followup_lists.showCust('+checkNull(d.Customer.id)+')" type="button" >';
							act_btns += '<i class="icon-user" style="margin-left:0px;"></i> '+fl_td.Customer;
						act_btns += '</a>';
					act_btns += '</li>';

					act_btns += '<li>';
						act_btns += '<a class="" onclick="followup_lists.gotoorder('+checkNull(d.Order.id)+')" type="button" >';
							act_btns += '<i class="icon-bar-chart" style="margin-left:0px;"></i> '+fl_td.Order;
							act_btns += '</a>';
						act_btns += '</li>';
					act_btns += '</ul>';
				act_btns += '</div>';

				doc_type = fl_td.Order;
				doc_number = d.Order.order_number;
			}
			else if("Invoice" in d && d.Invoice!=null && d.Invoice != undefined && checkNull(d.Invoice) != '' && checkNull(d.Invoice.id) != ''){
				act_btns += '<a class="btn mini blue-stripe" onclick="followup_lists.showDetails(3,'+followup_id+','+d.Invoice.id+')" href="javascript:void(0);"><i class="icon-info-sign"></i>&nbsp;'+fl_td.Details+'</a>&nbsp;';

				act_btns += '<div class="btn-group mobile-btn-groups group2">';
					act_btns += '<button id="UpdateAndBtn" data-toggle="dropdown" class="btn mini blue-stripe dropdown-toggle">'+fl_td.Goto+'...<i class="icon-angle-down"></i></button>';
					act_btns += '<ul class="dropdown-menu bottom-down pull-left followup" style="text-align:left;">';
					act_btns += '<li>';
						act_btns += '<a class="" onclick="followup_lists.showCust('+checkNull(d.Customer.id)+')" type="button" >';
							act_btns += '<i class="icon-user" style="margin-left:0px;"></i> '+fl_td.Customer;
						act_btns += '</a>';
					act_btns += '</li>';

					act_btns += '<li>';
						act_btns += '<a class="" onclick="followup_lists.gotoinvoice('+checkNull(d.Invoice.id)+')" type="button" >';
							act_btns += '<i class="icon-bar-chart" style="margin-left:0px;"></i> '+fl_td.Invoice;
							act_btns += '</a>';
						act_btns += '</li>';
					act_btns += '</ul>';
				act_btns += '</div>';

				doc_type = fl_td.Invoice;
				doc_number = d.Invoice.invoice_number;
			}
			else{
				continue;
			}
			k++;
			tablejson[k] = [];

			tablejson[k].push(checkNull(doc_type));
			tablejson[k].push(checkNull(doc_number));
			tablejson[k].push(checkNull(d.Customer.customer_name));
			
			var flw_sts = checkNull(d.Followup.followup_status);
			tablejson[k].push(checkNull(fl_dt.followup_statuses[flw_sts]));

			tablejson[k].push(checkNull(followup_date));
			var dd = JSON.stringify(d);
		 	dd = dd.replace(/\"/g,"'");
			if(checkNull(d.Customer.customer_email) != '' || checkNull(d.Customer.format_cellphone) != ''){
				act_btns += '<div class="btn-group mobile-btn-groups group2">';
					act_btns += '<button id="UpdateAndBtn" data-toggle="dropdown" class="btn mini blue-stripe  dropdown-toggle">'+fl_td.Send+'...<i class="icon-angle-down"></i></button>';
					act_btns += '<ul class="dropdown-menu bottom-down pull-left followup" style="text-align:left;">';
						

						if(checkNull(d.Customer.customer_email) != ''){
							act_btns += '<li>';
								act_btns += '<a class="dropdown_email" onclick="followup_lists.sendEmail('+dd+')" type="button" >';
									act_btns += '<i class="icon-envelope-alt" style="margin-left:0px;"></i> '+fl_td.$email;
								act_btns += '</a>';
							act_btns += '</li>';
						}

						if(checkNull(d.Customer.format_cellphone) != ''){
							act_btns += '<li>';
								act_btns += '<a class="dropdown_sms" onclick="followup_lists.sendSms('+dd+')" type="button" >';
									act_btns += '<i class="icon-comment" style="margin-left:0px;"></i> '+fl_td.SMS;
								act_btns += '</a>';
							act_btns += '</li>';
						}
					act_btns += '</ul>';		
				act_btns += '</div>';
			}


			act_btns += '<div class="btn-group mobile-btn-groups group2">';
				act_btns += '<button id="UpdateAndBtn" data-toggle="dropdown" class="btn mini blue-stripe  dropdown-toggle">'+fl_td.ChangeStatus+'...<i class="icon-angle-down"></i></button>';
				act_btns += '<ul class="dropdown-menu bottom-down pull-left followup" style="text-align:left;">';
					for(var kl in followup_statush){
						var dts = followup_statush[kl];

						if(d.Followup.followup_status != kl){
							var asd = {status:kl};
							asd = JSON.stringify(asd);
							asd = asd.replace(/\"/g,"'");
							act_btns += '<li onclick="followup_lists.changeStatus('+dd+','+asd+')">';
								act_btns += '<a class="" type="button" >';
									act_btns += dts;
								act_btns += '</a>';
							act_btns += '</li>';
						}
					}
				act_btns += '</ul>';		
			act_btns += '</div>';
			tablejson[k].push(checkNull(act_btns));
		}

		try{
			$('#partner_fllup_list').DataTable().destroy();
		}
		catch(e){
			console.log(e);
		}

		//if(tablejson.length!=0){
			table = $('#partner_fllup_list').DataTable({ 
				"data": tablejson,
				"pagelength":pagelength,
				//"sorting": [sort],
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
			           fl_td.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ fl_td.records+ ' |  '
			         ,
					"paginate": {
						"previous": '<i class="icon-angle-left"></i>',
						"next": '<i class="icon-angle-right"></i>',
						'of':fl_td.of,
						'Page':fl_td.Page,
					},
					
					"info": fl_td.Foundtotal+" _TOTAL_ "+fl_td.records
				}
			});
			followup_lists.bindTable();
		//}

	},
	showDetails:function(frm,followup_id,doc_id){
		//frm == 1 Quote
		if(frm == 1){
			new_custom_popup2(600,'popups','quote_followup_modal',{followup_id:followup_id,quote_id:doc_id});
		}
		else if(frm == 2){
			new_custom_popup2(600,'popups','order_followup_modal',{followup_id:followup_id,order_id:doc_id});
		}
		else if(frm == 3){
			new_custom_popup2(600,'popups','invoice_followup_modal',{followup_id:followup_id,invoice_id:doc_id});
		}
	},
	bindTable:function(){
		if($('#partner_fllup_list .dataTables_empty').length != 0){
			$('#partner_fllup_list').hide();
			$('#partner_fllup_list_info').hide();
			$('.fllwup_list_err').show();
		}
		else{
			$('#partner_fllup_list_info').show();
			$('#partner_fllup_list').show();
			$('.fllwup_list_err').hide();
		}
	},
	showCust:function(customer_id=''){
		new_custom_main_page2('/'+type +'/'+'customers/details/'+customer_id,'all_customers','all_customers','customer_details',{customer_id:customer_id});
	},
	gotoquote:function(quote_id = ''){
		new_custom_main_page2('/'+type +'/'+'quotes/quote_details/'+quote_id,'quotes_list','quotes_list','quote_details',{quote_id:quote_id});
	},
	gotoorder:function(order_id = ''){
		new_custom_main_page2('/'+type +'/'+'order/order_details/'+order_id,'orders_list','orders_list','order_details',{order_id:order_id});
	},
	gotoinvoice:function(invoice_id = ''){
		window.location.href = base_url + 'invoice/invoice_details/'+invoice_id;
		//new_custom_main_page2('/'+type +'/'+'order/order_details/'+invoice_id,'orders_list','orders_list','order_details',{invoice_id:invoice_id});
	},
	sendSms:function(d){
		var cid = checkNull(d.Customer.id);
		var cust_name  = checkNull(d.Customer.customer_name);
		var cust_email = checkNull(d.Customer.customer_email);
		var cust_cellphone  = checkNull(d.Customer.cust_cellphone);
		var cust_country = checkNull(d.Customer.customer_country);
		var cp_code = checkNull(d.Customer.cp_code);
		var customer_number = checkNull(d.Customer.customer_number);
		var cust_number =  checkNull(d.Customer.format_cellphone);
		var to_number = cp_code+cust_cellphone;

		show_dkmodal_for_customer_sms(cid,cust_name,cust_number,cust_country,cp_code,to_number,customer_number);

	},
	sendEmail:function(d){
		var cid = checkNull(d.Customer.id);
		var cust_name  = checkNull(d.Customer.customer_name);
		var cust_email = checkNull(d.Customer.customer_email);
		var cust_cellphone  = checkNull(d.Customer.cust_cellphone);
		var cust_country = checkNull(d.Customer.customer_country);
		var cp_code = checkNull(d.Customer.cp_code);
		var customer_number = checkNull(d.Customer.customer_number);
		var cust_number =  checkNull(d.Customer.format_cellphone);
		var to_number = cp_code+cust_cellphone;
		show_dkmodal_for_customer_email(cid,cust_name,cust_email,customer_number);
	},
	changeStatus:function(d,status){

		var no = function(){};
		var yes = function(){

			showProcessingImage('undefined');
			getUserIP(function(ip){
				var search_fields = localStorage.getItem('followup_search_data');

				var total_params = {
					token:token,
					language:language,
					lang:lang,
					partner_id:partner_id,
					admin_id:admin_id,
					followup_id:checkNull(d.Followup.id),
					followup_status:status.status,
					ip_address:ip,
					from:'followup',
					search_fields:search_fields,
					request_from:fl_meta.from,
				};

				var params = $.extend({}, doAjax_params_default);
				params['url'] = APISERVER+'/api/Quotes/deleteFollowupEntry.json';
				params['data'] = total_params;

				params['completeCallbackFunction'] = function (){
					hideProcessingImage();
				};

				params['successCallbackFunction'] = function (complet_data){
					if(complet_data.response.status == 'success'){
						call_toastr('success',fl_td.Success,fl_td.Salesfollowupstatusupdatedsuccessfully);
						if("followup_lists" in window){
							followup_lists.generateRows(complet_data.response.response.followupList);
						}
					}
					else if(complet_data.response.status == 'error'){
						if(complet_data.response.response.error == 'validationErrors'){
							var mt_arr = complet_data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error',fl_td.Alertmessage);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',fl_td.Alertmessage);
							return;
						}	
					}
				};

				doAjax(params);
				return;
			});
		}
		showDeleteMessage(fl_td.$update_status,fl_td.Warning,yes,no,'ui-dialog-blue',fl_td.Yes,fl_td.No,'green');

	}
}
