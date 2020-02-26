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
var al_dt;
var al_td;
var al_meta;
var pagelength = 10;
var cust_srch_data = '';

var pagelength = 10;
var cust_current_page = 1;
var per_page = 10;
var cust_last_page = 0;

var all_customers = {
	start:function(meta = {}){
		al_meta = meta;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			page:1,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','View','records','of','Found total','records','No record found','$del_sales','Actions','Search','Page','Clear search','Customer number','Customer name','Customer type','Cellphone','Country','Action','Managed Customers','Customers','Delete','Send email','Send SMS','$del_cust','Customer deleted successfully','Add new customer','record'],
			
		};
		if(checkNull(al_meta.page) != ''){
			total_params['page'] = page;
		}

		cust_srch_data = localStorage.getItem('customers_search_data');
		if(checkNull(cust_srch_data) != ''){
			cust_srch_data = JSON.parse(cust_srch_data);
			var sort = cust_srch_data.sort;
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
			};

			cust_srch_data = JSON.stringify({fields:fields,sort:[ 'customer_number', 'DESC' ]});
			localStorage.setItem('customers_search_data',cust_srch_data);
			cust_srch_data = JSON.parse(cust_srch_data);
		}
		total_params = Object.assign(total_params,cust_srch_data.fields);

		var sort = cust_srch_data.sort;

		total_params['sort'] = sort[0];
		total_params['direction'] = sort[1];

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getAllCustomers.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				al_dt = complet_data.response.response;
				al_td = complet_data.response.response.translationsData;
				if(al_meta.from == 'search' && al_dt.customer_list.length == 1){
					all_customers.showCustomer(al_dt.customer_list[0].customers.id);
					return;
				}
				all_customers.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',al_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',al_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createHtml:function(){
		if(checkNull(al_dt.customerListLimit ) != ''){
			pagelength = parseInt(al_dt.customerListLimit);
		}
		// al_dt.sfrom = sfrom;
	
		al_td.dashboardurl = base_url+'dashboard/index';
		al_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('all_customers_template').innerHTML;
		var compiledRendered = Template7(template, al_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		all_customers.bindEvents();
	},
	bindEvents:function(){
		var cust_srch_dt = localStorage.getItem('customers_search_data');
		if(checkNull(cust_srch_dt) != ''){
			cust_srch_dt = JSON.parse(cust_srch_dt);

			if(checkNull(cust_srch_dt.fields.customer_number) != '' || checkNull(cust_srch_dt.fields.customer_name) != '' || checkNull(cust_srch_dt.fields.user_group_id) != '' || checkNull(cust_srch_dt.fields.customer_groups) != '' || checkNull(cust_srch_dt.fields.email) != '' || checkNull(cust_srch_dt.fields.customer_phone_number) != ''  || checkNull(cust_srch_dt.fields.status) != ''){
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
			
			var cust_srch_data = localStorage.getItem('customers_search_data');
			cust_srch_data = JSON.parse(cust_srch_data);
			cust_srch_data.fields = {
				customer_number:'',
				customer_name:'',
				user_group_id:'',
				customer_groups:'',
				email:'',
				customer_phone_number:'',
				status:'',
			}

			cust_srch_data['sort'] = ['customer_number','DESC'];
			localStorage.setItem('customers_search_data',JSON.stringify(cust_srch_data));

			all_customers.start();
		});

		all_customers.generateRows(al_dt.customer_list,'',al_dt.pagination);
	},
	generateRows:function(data,frm,pagination){
		var tablejson = [];
		var k = -1;
		
		var html = '';
		for(var j in data){
			html += '<tr>';
			k++;
			tablejson[k] = [];
			var cust = data[j].customers;
			var dt = data[j][0];
			var cell_country = data[j].cell_country;
			var cust_country = data[j].cust_country;

			tablejson[k].push(checkNull(cust.customer_number,'-'));
			html += '<td>'+checkNull(cust.customer_number,'-')+'</td>';

			tablejson[k].push(checkNull(cust.customer_name,'-'));
			html += '<td>'+checkNull(cust.customer_name,'-')+'</td>';

			tablejson[k].push(checkNull(dt.customer_type,'-'));
			html += '<td>'+checkNull(dt.customer_type,'-')+'</td>';

			var split_arr = all_customers.formatCellphone(checkNull(cust.customer_cellphone),checkNull(al_dt.partner_country),checkNull(cust.customer_country),checkNull(cust.cellphone_country_code),checkNull(cell_country),checkNull(cust_country));
			
			cust = Object.assign(cust,split_arr);
	
			tablejson[k].push(checkNull(cust.phone_no,'-'));
			html += '<td>'+checkNull(cust.phone_no,'-')+'</td>';

			tablejson[k].push(checkNull(cust_country.country,'-'));
			html += '<td>'+checkNull(cust_country.country,'-')+'</td>';

			html += '<td>';
			var act = '<a class="btn mini blue-stripe" href="javascript:;" onclick="all_customers.showCustomer('+cust.id+')"><i class="icon-eye-open"></i> '+al_td.View+'</a>';
			var dd = JSON.stringify(cust);
			dd = dd.replace(/\"/g,"'");
			if(checkNull(cust.customer_email) != ''){
				
				act += '&nbsp;<a class="btn mini green-stripe" href="javascript:;" onclick="all_customers.send_email('+dd+')"><i class="icon-envelope-alt" style="margin-left:0px;"></i> '+al_td.Sendemail+'</a>';
			}

			if(checkNull(cust.phone_no) != ''){
				var dd = JSON.stringify(cust);
				dd = dd.replace(/\"/g,"'");
				act += '&nbsp;<a class="btn mini yellow-stripe" href="javascript:;" onclick="all_customers.send_sms('+dd+')"><i class="icon-comment"></i> '+al_td.SendSMS+'</a>';
			}

			


			if(dt.is_deletable == 0){
				act += '<a class="btn mini red-stripe del_row" data-id="'+cust.id+'" href="javascript:;" onclick="all_customers.delete('+dd+')"><i class="icon-remove"></i> '+al_td.Delete+'</a>';
			}
			html += act+'</td>';
			html += '</tr>';
			tablejson[k].push(act);
		}
		$('#partner_customer_list').removeClass('hide');
		$('.alert').addClass('hide')
		//$('#partner_customer_list').DataTable().destroy();
		if(tablejson.length!=0){
			var cust_srch_data = localStorage.getItem('customers_search_data');
			cust_srch_data = JSON.parse(cust_srch_data);
			var sort = cust_srch_data.sort;
			var classs = '';

			
			if(parseInt(checkNull(pagination.total_records,0)) <  parseInt(checkNull(pagination.per_page,0)) ){
				classs = 'display:none';
			}

			var phtml = '<div class="row-fluid form-inline dt_rem">';
				phtml += '<div class="span12 dataTables_extended_wrapper">';
				   	phtml += '<div class="dataTables_paginate paging_input" id="partner_inv_list_paginate" style="'+classs+'">';
				   	 	phtml += '<span class="paginate_page">'+al_td.Page+' </span>';
		   	 		 	phtml += '<span class="previous prev btn btn-sm default paginate_button" id="partner_inv_list_previous prev btn btn-sm default"><i class="icon-angle-left"></i></span>';
		   	 			phtml += '<input class="paginate_input form-control input-mini input-inline input-sm" type="text">';
		   	 			phtml += '<span class="next next btn btn-sm default paginate_button" id="partner_inv_list_next next btn btn-sm default"><i class="icon-angle-right"></i></span>';
		   	 			phtml += '<span class="paginate_of"> '+al_td.of+' '+pagination.total_pages+' |</span>';
			   	 	phtml += '</div>';
				  	phtml += ' <div id="partner_inv_list_length" class="dataTables_length"  style="'+classs+'">';
				      	phtml += '<label style="margin-bottom:0">';
				        	phtml += al_td.View;
				        	phtml += ' <select id="partner_inv_list_sel" style="margin-right:2px">';
					            phtml += '<option value="10" selected="selected">10</option>';
					            phtml += '<option value="20">20</option>';
					            phtml += '<option value="30">30</option>';
					           	phtml += '<option value="40">40</option>';
					            phtml += '<option value="50">50</option>';
					            phtml += '<option value="-1">All</option>';
					         	phtml += '</select>';
				       		phtml += al_td.records;
				      	phtml += ' | </label>';
				   	phtml += '</div>';
				   	if(pagination.total_records > 1){
				   			phtml += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+al_td.Foundtotal+' '+pagination.total_records+' '+al_td.records+'</div>';
				   	}
				   	else{
				   			phtml += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+al_td.Foundtotal+' '+pagination.total_records+' '+al_td.record+'</div>';
				   	}
				   
				phtml += '</div>';
			phtml += '</div>';

			$('.dt_rem').remove();
			$('#partner_customer_list tbody').html(html);
			$('#partner_customer_list').after(phtml);
			// table = $('#partner_customer_list').DataTable({
		 // 		 	"pagingType": "input",
		 // 		 	"pagelength":pagelength,
		 // 		 	"responsive": true,
		 // 		 	"sorting":[sort],
			// 		"data":tablejson,
			// 		"columnDefs": [ {
			// 	          "targets": 'no-sort',
			// 	          "orderable": false,
			//    		}],
			//        	"rowCallback": function( nRow, adata ) {
			//        	},
		 // 		 	"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
		 // 		 	"language": {
			// 		"lengthMenu": 
			// 	           al_td.View+ ' <select>'+
			// 	             '<option value="10">10</option>'+
			// 	             '<option value="20">20</option>'+
			// 	            '<option value="30">30</option>'+
			// 	             '<option value="40">40</option>'+
			// 	             '<option value="50">50</option>'+
			// 	             '<option value="-1">All</option>'+
			// 	             '</select> '+ al_td.records + ' |  '
			// 	         ,
			// 			"paginate": {
			// 				"previous": '<i class="icon-angle-left"></i>',
			// 				"next": '<i class="icon-angle-right"></i>',
			// 				'of':al_td.of,
			// 				'Page':al_td.Page,
			// 			},
						
			// 			"info": al_td.Foundtotal+" _TOTAL_ "+al_td.records
			// 		},

		 // 	});

		 	cust_last_page = pagination.total_pages;
			all_customers.bindTable(pagination);
		}
		else{
			$('.dt_rem').remove();
			$('.alert').removeClass('hide');
			$('#partner_customer_list').addClass('hide');
		}
		

	},
	sort:function(frm){
		var cust_srch_dt = localStorage.getItem('customers_search_data');
		cust_srch_dt = JSON.parse(cust_srch_dt);

		cust_srch_dt.sort[0] = frm ;
		if(cust_srch_dt.sort[1] == 'ASC'){
			cust_srch_dt.sort[1] = 'DESC';
		}
		else{
			cust_srch_dt.sort[1] = 'ASC';
		}
		
		localStorage.setItem('customers_search_data',JSON.stringify(cust_srch_dt));
		cust_current_page = 1;
		all_customers.getAndGenerateCust('',per_page);
	},
	showCustomer:function(cust_id){
		new_custom_main_page2('/'+type+'/customers/details/'+cust_id,'all_customers','all_customers','customer_details',{customer_id:cust_id});
	},
	bindTable:function(pagination){
		$('#partner_inv_list_paginate .paginate_input').val(pagination.page_num)

		// table.on( 'order.dt', function () {
		//     var orderss = table.order();
		//     var cust_srch_dt = localStorage.getItem('customers_search_data');
		//     cust_srch_dt = JSON.parse(cust_srch_dt);
		//     if(checkNull(orderss[0]) != ''){
		//     	cust_srch_dt['sort'] = orderss[0];
		//     }
		//     else{
		//     	cust_srch_dt['sort'] = [ 0, "desc" ];
		//     }
		//     cust_srch_dt = JSON.stringify(cust_srch_dt);
		// 	localStorage.setItem('customers_search_data',cust_srch_dt);
		// });

		$('#partner_inv_list_paginate .prev').click(function(){
			if(cust_current_page!=1){
				all_customers.getAndGenerateCust('prev',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .next').click(function(){
			if(cust_current_page < cust_last_page){
				all_customers.getAndGenerateCust('next',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .paginate_input').change(function(){
			var v = $(this).val();

			if(checkNull(v) != '' && v != 0 && v != cust_current_page && v <= cust_last_page){
				all_customers.getAndGenerateCust('input',pagination.per_page,v);
			}
		});

		$("#partner_inv_list_length select").change(function(){
			var v = $(this).val();
			if(v==-1){
				v = 100000;
			}
			all_customers.getAndGenerateCust('dropdown',v);
		});
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

		cust_srch_data = localStorage.getItem('customers_search_data');

		if(checkNull(cust_srch_data) != ''){
			cust_srch_data = JSON.parse(cust_srch_data);
			var sort = cust_srch_data.sort;

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
			};

			cust_srch_data = JSON.stringify({fields:fields,sort:[ 'customer_number', 'DESC' ]});
			localStorage.setItem('customers_search_data',cust_srch_data);
			cust_srch_data = JSON.parse(cust_srch_data);
		}
		total_params = Object.assign(total_params,cust_srch_data.fields);

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getAllCustomers.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var aal_dt = complet_data.response.response;
				
				if(al_meta.from == 'search' && aal_dt.customer_list.length == 1){
					all_customers.showCustomer(aal_dt.customer_list[0].customers.id);
					return;
				}
				all_customers.generateRows(aal_dt.customer_list,'',aal_dt.pagination);	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',al_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',al_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	formatCellphone:function(cellphone,partner_country,customer_country,cellphone_country_code,cell_country,cust_country){
		if(checkNull(cellphone) == ''){
			return '-';
		}
		var cp_code = '';
		var country_data = {};
		if(checkNull(cellphone_country_code) != ''){
			cp_code = cellphone_country_code;
			country_data = cell_country;
		}
		else{
			cp_code = customer_country;
			country_data = cust_country;
		}

		var split_arr = all_customers.splitPhoneNumbers(cp_code,cellphone,country_data);

		var number = all_customers.format_contact_number(split_arr);
		if(cp_code != partner_country){
			if(checkNull(split_arr.code) != ''){
				number = '('+split_arr.code+') ' + number;
			}
		}
		split_arr['phone_no'] = number;
		return split_arr;
	},
	splitPhoneNumbers:function(countryCode,cellphone,country_data){
		var returnArr = {
			code:'',
			number:'',
			country_code:'',
		};

		if(checkNull(cellphone) == '' || checkNull(countryCode) == ''){
			return returnArr;
		}
		if(!$.isEmptyObject(country_data)){
			if(cellphone.indexOf('+') === -1 || cellphone.indexOf('+') === false){
				cellphone = '+' + cellphone;
			}
			var total_number_length = cellphone.length;
			var code_length = checkNull(country_data.phone_initial).length + 1; 
			
			returnArr['code'] = '+' +  country_data.phone_initial;
			returnArr['number'] = cellphone.substr(code_length,total_number_length);
			returnArr['country_code'] = country_data.country_code;	
		}
		return returnArr;
	},
	format_contact_number:function(split_arr){
		//console.log('split_arr',split_arr);
		var number = '';
		if(checkNull(split_arr.country_code) == '' || checkNull(split_arr.country_code) == 'NO'){
			number = all_customers.get_norway_formated_number(checkNull(split_arr.code),checkNull(split_arr.number));
			
		}
		else if(checkNull(split_arr.country_code) == 'IN'){
			number = all_customers.get_india_formated_number(checkNull(split_arr.code),checkNull(split_arr.number));
		}
		else{
			number = all_customers.get_other_formated_number(checkNull(split_arr.code),checkNull(split_arr.number));
		}
		return number;
	},
	get_other_formated_number:function(phone_initial,contact_number){
		var len = contact_number.length;
		var f = contact_number.substr(0,len/2);
		var l = contact_number.substr(len/2,len);
		return f+' ' + l;
	},
	get_india_formated_number:function(phone_initial,contact_number){

		if(contact_number.length == 10){
			var p = contact_number.substr(0,3);
			var q = contact_number.substr(3,4);
			var r = contact_number.substr(7,3);

			number = p + ' ' + q + ' ' + r;
		}
		else{
			var p = contact_number.substr(0,3);
			var q = contact_number.substr(3,contact_number.length - 3 );
			number = p + ' ' + q;
		}
		return number;
	},
	get_norway_formated_number:function(phone_initial,contact_number){

		var number = '';

		var first_digit = contact_number.substr(0,1);
		var type = '';

		var landline_arr = ['2','3','5','6','7','8'];
		var cellphone_arr = ['4','9'];
	
		if(first_digit == 0){
			type = 'special_0';
			number = contact_number;
		}
		else if(first_digit == '8'){
			type = 'special_8';

			var p = contact_number.substr(0,3);
			var q = contact_number.substr(3,2);
			var r = contact_number.substr(5,3);

			
			number = p + ' ' + q + ' ' + r;
		}
		else if(landline_arr.indexOf(first_digit) !== false && landline_arr.indexOf(first_digit) !== -1){
			type = 'landline';

			var p = contact_number.substr(0,2);
			var q = contact_number.substr(2,2);
			var r = contact_number.substr(4,2);
			var s = contact_number.substr(6,2);
			number = p + ' ' + q + ' ' + r + ' ' + s;
		}
		else if(cellphone_arr.indexOf(first_digit) !== false && cellphone_arr.indexOf(first_digit) !== -1){
			type = 'cellphone';

			var p = contact_number.substr(0,3);
			var q = contact_number.substr(3,2);
			var r = contact_number.substr(5,3);
			number = p + ' ' + q + ' ' + r ;
		}
		return number;
	},
	send_email:function(dd){
		show_dkmodal_for_customer_email(dd.id,checkNull(dd.customer_name),checkNull(dd.customer_email),checkNull(dd.customer_number));
	},
	send_sms:function(dd){
		show_dkmodal_for_customer_sms(dd.id,dd.customer_name,dd.phone_no,dd.customer_country,dd.code,dd.phone_no,dd.customer_number);
	},
	delete:function(dd){
		var no = function(){};
		var yes = function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				customer_id:dd.id
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Customers/deleteCustomer.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					call_toastr('success',al_td.Success,al_td.Customerdeletedsuccessfully);
					var a = cust_current_page - 1;
					if(checkNull(a) == '' || checkNull(a) == 0){
						a  = 1;
					}
					al_meta['page'] = 1;
					all_customers.start(al_meta);
					
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',al_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',al_td.alertmessage);
						return;
					}	
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;
		};

		showDeleteMessage(al_td.$del_cust,al_td.Warning,yes,no,'ui-dialog-blue',al_td.Delete,al_td.Cancel);
	
	},

}