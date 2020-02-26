var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var date_format =  $('#date_format').val();
var staffer_id = $('#staffer_id').val();
var date_format_partner =  $('#date_format_partner').val();
var type = $('#type').val();
var session_customer_id = $('#session_customer_id').val();
var storage_timeouts = [];
var sls_dt;
var sls_td;
var sls_meta ={};
var cal_d = {};
var global_linKy = 0;
var customerList = [];
var crt_ht_to = [];
var customer_id;
var customerData='';
var all_products=[];
var delivery_addresses = {};
var from_storage = 'n';
var storage_data={};
var is = 0;
var LastFocusId = '';
var field_id_name = {};
var sales_save = {
	start:function(meta={}){
		sales_save.getCustomers();
		sls_meta = meta;
		
		if(sls_meta.submenu == 'inv'){
			showMenu('sales_sel_inv','sales_sel_inv');
		}
		else{
			showMenu('sales_sel_qutord','sales_sel_qutord');
		}
		if(checkNull(sls_meta.customer_id) == '' || checkNull(sls_meta.duplicate) == 'y'){
			var d = localStorage.getItem('newsales');
			if(checkNull(d) != ''){
				from_storage = 'y';
				d = JSON.parse(d);
				storage_data = d;
				if(checkNull(d.customer_id) != ''){
					sls_meta['customer_id'] = d.customer_id;
				}				
			}			
		}
		else{

		}
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','New sales document','Draft','Create quote','Create order','Create invoice','Sales Details','Customer','Clear search','Edit Customer','Sales date','Payment terms','Credit days','Our ref','Your ref','Referrer','Product','Description','Location','Units available','Quantity','Unit Price','Unit','$mva','Discount','Total Price','Checklist','Delete product','Add product','Fill out','Ignore','Select','Confirmation','Delete','Cancel','$del_sel_line','Product bundle','Postal address','Zip City','Company email','Delivery method','Delivery address','Delivery note','Zip','Country','Company email','Delivery phone','Same as postal address','City','$custom_text','Empty','None','Outgoing vat','$tracking','Draft','Create Quote','Create Order','Schedule Invoice','Create Invoice','$vat_spec','Rate','Base amount','MVA','Product lines','Please check the following fields','for line number','Checklist option','$create_another_sales','$yes_no','Warning','Yes','No','$create_inv_on','Net amount','Discount','Round off','Total','Add new product','Total to pay','$tota_inc_vat','Tax rate','Tax amount','The discount should not be greater than net amount','Invalid product','$sales_location','This field is required',
				]
		};
		if(checkNull(sls_meta.customer_id) != ''){
			total_params.customer_id = sls_meta.customer_id;
			customer_id = sls_meta.customer_id;
		}
		if(checkNull(sls_meta.task_id) != ''){
			total_params.task_id = sls_meta.task_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Sales/getSales.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				sls_dt = complet_data.response.response;
				sls_td = complet_data.response.response.translationsData;
				sls_dt['CUR_SYM'] = CUR_SYM;
				if(sls_dt.customerData!=undefined && checkNull(sls_dt.customerData.credit_days) != ''){
					cal_d.credit_days = checkNull(sls_dt.customerData.credit_days,'')
				}
				else{
					cal_d.credit_days = checkNull(sls_dt.partnerSetting.credit_days,'')
				}
				sls_dt.cal_d = cal_d;


				var ids = new Array();
				for(var j in sls_dt.getLocationList){
					var d = sls_dt.getLocationList[j];
					if(j==0){
						continue;
					}
					ids.push(j);
				}
				
				sls_dt.loc_ids = '';
				if(ids.length != 0){
					sls_dt.loc_ids = ids.join('_');
				}
				customerData = sls_dt.customerData;


				if(sls_dt.customerData!=undefined && checkNull(sls_meta.customer_id) != ''){
					
				}

				sales_save.createHtml(sls_dt);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',sls_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',sls_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	getCustomers:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/selectCustomer.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				customerList = complet_data.response.response.customer_list;
				
				var cache = {};

				crt_ht_to = setInterval(function(){
					if($('#salesSalesCustomerName').length != 0){

						clearInterval(crt_ht_to);
						$('#salesSalesCustomerName').autocomplete({
							autoFocus: true,	
							source: function( request, response ) {
				        		var term = request.term;
				        		if( term in cache ) {
				          			response( cache[ term ] );
				          			return;
				        		}
				        		var results = $.ui.autocomplete.filter(customerList, request.term);
				        		cache[ term ] = results;
				                response(results.slice(0, 100));
				  			},
							minLength: 1,
							select: function( event, data ) {
								customer_id = data.item.id;
								sales_save.getAndSaveCustomer();
							},
						    //position: { my : "right top", at: "right bottom", collision : "flip"  },
						});
						if(type == 'customer' && checkNull(customer_id) == ''){
							customer_id = session_customer_id;
							sales_save.getAndSaveCustomer();

						}
					}

				},1);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',sls_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',sls_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}

		sls_dt.date_format_f = date_format_f;

		sls_dt.type = type;
		sls_td.dashboardurl = base_url+'dashboard/index';
		sls_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('sales_save_template').innerHTML;
		var compiledRendered = Template7(template, sls_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		sales_save.bindEvents();
	},
	bindEvents:function(){
		sales_save.generateSalesField(sls_dt.sales_fields);
	
		$('#btn_edit_sale_customer').click(function(){
			var url = base_url + 'sales/edit_sales_customer/'+customer_id;
			show_modal('','popups','',url);
			return;
		});


		if(from_storage == 'y'){

			if(checkNull(storage_data.sales_id) != ''){
				$('#sales_id').val(storage_data.sales_id);
			}
			else{
				$('#sales_id').val('');
			}

			var delivery_phone_code = '';
			if(checkNull(customerData) != ''){
				if(checkNull(customerData.Customer.ph_code) != ''){
					delivery_phone_code = customerData.Customer.ph_code;
				}
				
			}
			delivery_addresses = {
				delivery_name:storage_data.delivery_name,
				delivery_address1:storage_data.delivery_address1,
				delivery_address2:storage_data.delivery_address2,
				delivery_zip:storage_data.delivery_zip,
				delivery_city:storage_data.delivery_city,
				delivery_country:storage_data.company_country,
				delivery_phone:'',
				delivery_phone_code:delivery_phone_code,
				mod:storage_data.mod,
			};
		}
		else if(checkNull(customerData) != '' && checkNull(customer_id) != ''){
			if(!$.isEmptyObject(sls_dt.task_address)){
				delivery_addresses = {
					delivery_name:customerData.Customer.customer_name,
					delivery_address1:checkNull(sls_dt.task_address.location),
					delivery_address2:'',
					delivery_zip:checkNull(sls_dt.task_address.zip),
					delivery_city:checkNull(sls_dt.task_address.city),
					delivery_country:checkNull(sls_dt.task_address.country_code),
					delivery_phone:'',
					delivery_phone_code:customerData.Customer.ph_code,
					mod:1
				};
			}
			else if(customerData.Customer.same_postal_address == 'n'){
				delivery_addresses = {
					delivery_name:customerData.Customer.customer_name,
					delivery_address1:customerData.Customer.delivery_address1,
					delivery_address2:customerData.Customer.delivery_address2,
					delivery_zip:customerData.Customer.delivery_zip,
					delivery_city:customerData.Customer.delivery_city,
					delivery_country:customerData.Customer.delivery_country,
					delivery_phone:'',
					delivery_phone_code:customerData.Customer.ph_code,
					mod:0
				};
			}
			else{
				delivery_addresses = {
					delivery_name:customerData.Customer.customer_name,
					delivery_address1:customerData.Customer.customer_address1,
					delivery_address2:customerData.Customer.customer_address2,
					delivery_zip:customerData.Customer.customer_zip,
					delivery_city:customerData.Customer.customer_city,
					delivery_country:customerData.Customer.customer_country,
					delivery_phone:'',
					delivery_phone_code:customerData.Customer.ph_code,
					mod:0
				};
			}
		}

		var enable_inventory = sls_dt.partnerSetting.enable_inventory;
		if(checkNull(customer_id) != '' && checkNull(sls_dt.customerData) != ''){
			sales_save.bindCustomer();
		}
		else{
			$('#salesSalesCustomerName').removeAttr('disabled').val('');
			$('#btn_remove_sale_customer,#btn_edit_sale_customer').hide();
			$('#html_sale_customer_details').hide();
			$('#btn_search_sale_customer').show();
		
		}

		if(checkNull(sls_meta.customer_id) != '' && from_storage != 'y'){
			var saved_ans = [];
			try{
				saved_ans = customerData.CustomerCustomField.answers;
				saved_ans = JSON.parse(saved_ans);
				for(var j in saved_ans){
					for(var k in saved_ans[j]){
						var d = saved_ans[j][k];
						var field_id = k.replace(/\s/g,'');
						try{
							$('#sales_fields #'+$.escapeSelector(field_id)).editable('setValue',d);
						}
						catch(e){}
					}
				}
			}
			catch(e){

			}
		}
		//sales_save.generateProductLinesHtml();
		$('#add_prod').click(function(){
			sales_save.generateProductLinesHtml();
		});
		$('#all_products').change(function(){
			var c = $('#all_products:checked').length;
			if(c == 1){
				$('.product_checkbox').prop('checked','checked');
			}
			else{
				$('.product_checkbox').removeAttr('checked');
			}
			$.uniform.update();
			$('.product_checkbox').trigger('change');
		}).uniform();

		$('#del_prod').click(function(){
			sales_save.removeProductLines();
		});

		$('#btn_remove_sale_customer').click(function(){
			$('#html_sale_customer_details').hide();
			$('#salesSalesCustomerName').removeAttr('disabled').val('');
			$('#btn_search_sale_customer').show();
			$('#btn_edit_sale_customer,#btn_remove_sale_customer').hide();
			customerData = '';
			customer_id = '';
			$('#salesSaleYourRef option').remove();
			$('#salesSaleYourRef').append('<options value=""></option>');
			$('#salesSaleYourRef').change();

			sls_dt.customer_contact = [];
			sales_save.generateSalesField(sls_dt.sales_fields,'y');
			
			sales_save.saveData();
		
		});

		$('.tooltips').tooltip();

		$('#salesSalesDate').datepicker({
   			format:sls_dt.date_format_f
   		}).datepicker('update',moment().format()).change(function(){
   			$('.datepicker').remove();
   			var v = $('#salesSalesDate').datepicker('getDate');
   			if(checkNull(v) != ''){
	   			if(moment(v).unix() > moment().unix()){
	   				v = moment(v).format('DD.MM.YY');
	   				var str = sls_td.$create_inv_on;
	   				str = str.replace('%date%',v);
	   				var bstr = str +'&nbsp;<i class="m-icon-big-swapright m-icon-white"></i>';
	   				var tstr = str +'&nbsp;<i class="icon-swapright"></i>';
	   				$('.btn_schedule_invoice').html(str).show();
	   				$('.btn_schedule_invoice_h').html(tstr).show();

	   				$('.btn_create_invoice_f,.btn_create_invoice_h').hide();
   				}
   				else{
   					$('.btn_create_invoice_f,.btn_create_invoice_h').show();
   					$('.btn_schedule_invoice_f,.btn_schedule_invoice_h').hide();
   				}

   			}
   			else{
   				$('.btn_create_invoice_f,.btn_create_invoice_h').show();
   				$('.btn_schedule_invoice_f,.btn_schedule_invoice_h').hide();
   			}
   		}).trigger('change');


			//show schedule inv btn if date greater than today and in plan invoices

		
   		if(from_storage == 'y'){
   			var sales_date1 = checkNull(storage_data.sales_date1,'');
   			if(sales_date1 != ''){
   				$('#salesSalesDate').val(sales_date1).datepicker('update').trigger('change');
   			}
   		}
   		
   		$('#salesSalesPaymentTerms').change(function(){
   			var v = $(this).val();
   			if(v == 'custom'){
   				$('#custom_credit_days').show();
   			}
   			else{
   				$('#custom_credit_days').hide();
   				$('#custom_credit_days').val('');
   			}
   		}).trigger('change').select2({

   		});



   		var desc = '';
  		if(from_storage == 'y'){
  			desc = checkNull(storage_data.description);
  		}
   		$("#description").editable({
   			emptytext:sls_td.$custom_text,
	       	value: desc,  
	       	mode:'inline',  
	       	send: 'never',
	       	type: 'textarea',
	       	inputclass: 'mytextarea',
	       	showbuttons:'right',
	        success: function(data, config) {
	   		},
		});

		$('#salesSaleOurRef').select2({
			
		}).change(function(){

			var c = $(this).val();
			if(checkNull(c) != '' && enable_inventory == 'y'){
				c = c.split('##');
				var contact_id = c[1];
				var d = sls_dt.getPartnerContactList[contact_id];
				if(checkNull(d) != ''){
					if(checkNull(d.warehouse_id)!=''){
						sls_dt.warehouse_id = d.warehouse_id;
						sales_save.changeWarehouse();
					}
				}
				
			}

		});
		$('#salesSaleYourRef').select2({
		
		});

		$('#btn_product_bundle').click(function(){
			var warehouse_id = sls_dt.warehouse_id;

			var url = base_url + 'sales/select_bundle?key='+global_linKy+'&warehouse_id='+warehouse_id+'&from=newsales';
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','900px');
			show_modal(a,'popups1');

		});

		$('#btn_search_sale_customer').click(function(){
			var product_ids = []
			$('.product_number').each(function(){
				var line_id = $(this).attr('data-line-key');
				var prod_id = $('#product_id_'+line_id).val();
				product_ids.push(prod_id);
			});

			var url = base_url + 'sales/search_customers?request_from=newsales';
			if(product_ids.length != 0){
				url += '&product_ids='+product_ids;
			}
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','850px');
			show_modal(a,'popups1');
			
		});
		var cache1 = {};
		var customerReferrerList = sls_dt.getReferrerlist;
		

		$('#select_referrer').autocomplete({
			autoFocus: false,	
			source: function( request, response ) {
        		var term = request.term;
        		if( term in cache1 ) {
          			response( cache1[ term ] );
          			return;
        		}
        		var results = $.ui.autocomplete.filter(customerReferrerList, request.term);
        		cache1[ term ] = results;
                response(results.slice(0, 100));
  			},
			minLength: 1,
			select: function( event, data ) {
				if(data.item){
					if(data.item.id != '')
					{
						$('#referrer_id').val(data.item.id);
						
					}
					
		    	}
			},
		    //position: { my : "right top", at: "right bottom", collision : "flip"  },
		});
		if(from_storage == 'y'){
			var bp_referrer_id = storage_data.bp_referrer_id;
			if(checkNull(bp_referrer_id) != ''){
				$('#referrer_id').val(bp_referrer_id);
				for(var j in customerReferrerList){
					if(customerReferrerList[j].id == bp_referrer_id){
						$('#select_referrer').val(customerReferrerList[j].value);
						break;
					}
				}
			}
		}


		var delivery_methods = [{text:'',value:''}];
		var default_str = '';
		for(var j in sls_dt.deliveryMethods){
			var d = sls_dt.deliveryMethods[j];
			var id = j+'##'+d.value;
			var name = d.value;
			delivery_methods.push({
				text:name,
				value:id
			});
			
			if(from_storage == 'y'){
				if(storage_data.delivery_method == j){
					default_str = id;
				}
				
			}
			else{
				if(d.default){
					default_str = id;
				}
			}
		}

		if(sls_dt.partnerSetting.enable_delivery_method == 'n'){
			$('div.delivery_method').parent().hide();
			default_str = '';
		}

		if(sls_dt.partnerSetting.enable_delivery_note== 'n'){
			$('div#customer_delivery_note').hide();
		}

		$("#delivery_methods").editable({
	       	value: default_str,  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:false,
	        send: 'never',
	        emptytext: sls_td.None,
	        source:delivery_methods,
	        select2: {
	        	placeholder:sls_td.Select,
				minimumResultsForSearch: -1,
				allowClear:true,
			},
	        success: function(data, newValue) {
	        	var d = newValue.split('##');
	        	var v = d[0];
	        	var datas = sls_dt.deliveryMethods[v];

	        	if(newValue != '') {
					arr = newValue.split('##');
					var v = arr[0];
					var delMethod = sls_dt.deliveryMethods[v];
					var internal_name = delMethod.internal_name;

					if(checkNull(internal_name) == '' || internal_name.toLowerCase() == 'email') {
						$('#cust_delivery_address').hide();
						$('#customer_delivery_note').hide();
					}else {
						$('#cust_delivery_address').show();
						$('#customer_delivery_note').show();
						//$('.salesDeliveryAddress').click();
					}

					if(sls_dt.partnerSetting.enable_delivery_note== 'n'){
						$('div#customer_delivery_note').hide();
					}
					
					if(delMethod.is_tracking){
						$('#tracking_no_div').show();
					}else{
						$('#tracking_no_div').hide();	
					}
					
				}else if(newValue == ''){
					$('#tracking_no_div').hide();
					$('#cust_delivery_address').hide();
					$('#customer_delivery_note').hide();
				}
	   		},
		});

		var newValue = default_str;
		var d = newValue.split('##');
    	var v = d[0];
    	var datas = sls_dt.deliveryMethods[v];

    	if(newValue != '') {
			arr = newValue.split('##');
			var v = arr[0];
			var delMethod = sls_dt.deliveryMethods[v];
			var internal_name = delMethod.internal_name;

			if(checkNull(internal_name) == '' || internal_name.toLowerCase() == 'email') {
				$('#cust_delivery_address').hide();
				$('#customer_delivery_note').hide();
			}else {
				$('#cust_delivery_address').show();
				$('#customer_delivery_note').show();
				//$('.salesDeliveryAddress').click();
			}

			if(sls_dt.partnerSetting.enable_delivery_note== 'n'){
				$('div#customer_delivery_note').hide();
			}
			
			if(delMethod.is_tracking){
				$('#tracking_no_div').show();
			}else{
				$('#tracking_no_div').hide();	
			}
			
		}else if(newValue == ''){
			$('#tracking_no_div').hide();
			$('#cust_delivery_address').hide();
			$('#customer_delivery_note').hide();
		}

		$('#tracking_num_a').editable({
			emptytext:sls_td.Empty,
	       	value: '',  
	       	mode:'inline',  
	       	send: 'never',
	       	type: 'text',
	       	inputclass: '',
	       	showbuttons:'right',
	        success: function(data, config) {
	   		},
		});

	
		var delivery_note = '';
  		if(from_storage == 'y'){
  			delivery_note = checkNull(storage_data.delivery_note);
  		}

  		if(sls_dt.partnerSetting.enable_delivery_note== 'n'){
			delivery_note = '';
		}
  
		$('#custom_delivery_note').editable({
	       	value: delivery_note,  
	       	emptytext:sls_td.Deliverynote,
	       	mode:'inline',  
	       	send: 'never',
	       	type: 'textarea',
	       	inputclass: '',
	       	showbuttons:'right',
	        success: function(data, config) {
	   		},
		});

		if(from_storage == 'y'){
			if(storage_data.all_products.length != 0){
				var anyoneadded = 'n';
				for(var j in storage_data.all_products){
					if(checkNull(j) == '' || checkNull(storage_data.all_products[j]) == ''){

					}
					else{
						var d = storage_data.all_products[j];
						anyoneadded = 'y';
						sales_save.generateProductLinesHtml();
						sales_save.autoFillProductLines(d,global_linKy);
						for(var k in storage_data.product_lines){
							var d = storage_data.product_lines[k];
							if(d.line_key == j){
								sales_save.fillData(d,global_linKy);
								break;
							}
						}
					}
				}
				if(anyoneadded == 'n'){
					sales_save.generateProductLinesHtml();
				}
			}
			else{
				sales_save.generateProductLinesHtml();
			}
		}
		else{
			sales_save.generateProductLinesHtml();
		}

		$('.sales_save_temp').on('change','input,select',function(){
			for(var j in storage_timeouts){
				clearTimeout(storage_timeouts[j]);
			}
			storage_timeouts.push(setTimeout(function(){
				sales_save.saveData();
			},1));
		});
		$('.sales_save_temp').on('click','button',function(){
			for(var j in storage_timeouts){
				clearTimeout(storage_timeouts[j]);
			}
			storage_timeouts.push(setTimeout(function(){
				sales_save.saveData();
			},1));
		});

		$('#salesSaleOurRef').trigger('change');

		var vat_required = sls_dt.partnerSetting.vat_required;

		if(vat_required == 'y'){
			$('#product_lines').on('keydown','.vat_level',function(event){
				if(event.keyCode  == 9){
					sales_save.checkFocusTab(event.target.name,event.target.id);
				}				
			});
		}
		else{
			$('#product_lines').on('keydown','.vat_level',function(event){
				if(event.keyCode  == 9){
					sales_save.checkFocusTab(event.target.name,event.target.id);
				}
			});
		}
		
		$('#product_lines').on('focus','input',function(){
			if(this.type=='text'){
				LastFocusId= $(this).closest('tr').attr('data-line-key');
			}
		});

		$('#product_lines').on('click','input',function(){
			if(this.type=='text'){
				LastFocusId= $(this).closest('tr').attr('data-line-key');
			}
		});

		
		sales_save.calLineTotal(1);
	},
	checkFocusTab:function(name,id){
		if("sales_save" in window && typeof(sales_save.generateProductLinesHtml) == 'function'){
			sales_save.generateProductLinesHtml();
		}	
	},
	changeWarehouse:function(){
		var arr= [];
		$('#product_lines tbody tr').each(function(){
			var lkk = $(this).attr('data-line-key');
			arr.push(lkk);
		});
		var product_ids = [];
		for(j in arr){
			var line_key = arr[j];
			var product_id = $('#product_id_'+line_key).val();
			product_ids.push({id:product_id,line_key:line_key});
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			product_ids:product_ids,
			warehouse_id:sls_dt.warehouse_id
		}
		
		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Sales/getWarehouseData.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				var products = complet_data.response.response.products;
				for(var l in products){
					var html = '';
					var d = products[l];
					var line_key = d.line_key;
					var max_unit_id = 0;
					var actual_inventory = 0;

					for(var k in d.stockProductsData){
						var e = d.stockProductsData[k];

						if(e.actual_inventory != 0){
							if(e.actual_inventory > actual_inventory){
								actual_inventory = e.actual_inventory ;
								max_unit_id = k;
							}
						}
					}


					var inventory_product = $('#inventory_product_'+line_key).val();

					if(inventory_product == 'n'){
						html += '<select disabled type="text" id="loc_'+line_key+'" class="input_color m-wrap span12 loc loc_'+line_key+'" data-line-key="'+line_key+'">';
					}
					else{
						html += '<select type="text" id="loc_'+line_key+'" class="input_color m-wrap span12 loc loc_'+line_key+'" data-line-key="'+line_key+'">';
					}

					for(var j in d.stockProductsData){
						var e = d.stockProductsData[j];
						if(j != 0){
							if(max_unit_id == j ){
								html += '<option value="'+j+'"  selected="selected" inv_prod="'+inventory_product+'" data-actual-inv="'+e.actual_inventory+'">'+e.location_name+'('+convertIntoLocalFormat(checkNull(e.actual_inventory))+')</option>';
							}
							else{
								html += '<option value="'+j+'" inv_prod="'+inventory_product+'" data-actual-inv="'+e.actual_inventory+'"> '+e.location_name+'('+convertIntoLocalFormat(checkNull(e.actual_inventory))+')</option>';
							}
						}
						else{
							if(max_unit_id == j ){
								html += '<option value="'+j+'" inv_prod="'+inventory_product+'" selected="selected"  data-actual-inv="0">'+e.location_name+'</option>';
							}
							else{
								html += '<option value="'+j+'" inv_prod="'+inventory_product+'" data-actual-inv="0">'+e.location_name+'</option>';
							}
						}
					}
					html += '</select>';
					
					$('.loc_hide_'+line_key).html(html);
					$('#loc_'+line_key).change(function(){
						sales_save.calLineTotal(line_key);
					}).trigger('change').select2();
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',sls_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',sls_td.alertmessage);
					return;
				}	
			}
		};
		doAjax(params);
		return;
	},
	fillData:function(d,line_key){
		$('#product_name_'+line_key).val(checkNull(d.product_name));
		

		var location_id = '';
		if(checkNull(d.location_id) != ''){
			var ds = d.location_id.split('_');
			location_id = checkNull(ds[0]);
		}
		$('#product_id_'+line_key).val(checkNull(d.product_id));
		if(checkNull(location_id) != ''  && checkNull(location_id) != 0){
			$('#loc_'+line_key).val(checkNull(location_id)).trigger('change');
		}
		$('#qty_'+line_key).val(checkNull(convertIntoLocalFormat(d.qty))).trigger('change');
		$('#vat_level_'+line_key).val(checkNull(d.partner_tax_level_id)).trigger('change');
		$('#unit_price_'+line_key).val(convertIntoLocalFormat(checkNull(d.unit_price))).trigger('change');
		$('#discount_amount_'+line_key).val(convertIntoLocalFormat(checkNull(d.discount))).trigger('change');
		$('#fillChecklistsdata_'+line_key).val(d.fillChecklistsdata).trigger('change');	
		var ds = d.fillChecklistsdata;
		if(checkNull(ds) != ''){
			try{
				ds = JSON.parse(ds);
				if(checkNull(ds) == ''){
					ds = {};
				}
			}
			catch(e){
				ds = {};
			}
			if("saveclick" in ds && ds.saveclick){
				$('#ChecklistBtn_'+line_key).css('background-color','green');
			}
			else if("ignore" in ds && ds.ignore){
				$('#ChecklistBtn_'+line_key).css('background-color','gray');
			}
			else{
				$('#ChecklistBtn_'+line_key).css('background-color','rgb(77, 144, 254)');
			}
		}
	},
	changeCust:function(dtas){
		var d = dtas.customer;

		customerData = d;
		customer_id = d.Customer.id;

		if(customerData.Customer.same_postal_address == 'n'){
			delivery_addresses = {
				delivery_name:customerData.Customer.customer_name,
				delivery_address1:customerData.Customer.delivery_address1,
				delivery_address2:customerData.Customer.delivery_address2,
				delivery_zip:customerData.Customer.delivery_zip,
				delivery_city:customerData.Customer.delivery_city,
				delivery_country:customerData.Customer.delivery_country,
				delivery_phone:'',
				delivery_phone_code:customerData.Customer.ph_code,
				mod:0
			};
		}
		else{
			delivery_addresses = {
				delivery_name:customerData.Customer.customer_name,
				delivery_address1:customerData.Customer.customer_address1,
				delivery_address2:customerData.Customer.customer_address2,
				delivery_zip:customerData.Customer.customer_zip,
				delivery_city:customerData.Customer.customer_city,
				delivery_country:customerData.Customer.customer_country,
				delivery_phone:'',
				delivery_phone_code:customerData.Customer.ph_code,
				mod:0
			};
		}

		$('#salesSaleYourRef').select2('destroy');
		$('#salesSaleYourRef option').remove();


		$.each( dtas.customer_contact, function( key, value ) {

		  	var a = sales_save.generateRef(key,value,'yourref');
			$('#salesSaleYourRef').append(a);
		});
		
		$('#salesSaleYourRef').select2({
		
		});
		

		sales_save.bindCustomer(customerData);
		sales_save.changeProductPrices(d);
		sls_dt.customer_contact = dtas.customer_contact;
		var d = localStorage.getItem('newsales');
		if(checkNull(d) != ''){
			from_storage = 'y';
			d = JSON.parse(d);
			storage_data = d;
		}
		sales_save.generateSalesField(sls_dt.sales_fields,'y');
	},
	changeProductPrices:function(d){
		var prodData = sales_save.saveData();
		if(prodData.all_products.length != 0 && checkNull(d.Customer.price_group_id) != ''){
			for(var j in prodData.all_products){
				if(checkNull(j) == '' || checkNull(prodData.all_products[j]) == ''){

				}
				else{
					var ds = prodData.all_products[j];


					var price2 = '';
					var price1 = '';
					var price = '';

					var vat_level2 = '';
					var vat_level1 = '';
					var vat_level = '';

					
					var i = 0;
					var found = 'no';
					for(var k in ds.ProductData.ProductPrice){
						var datas = ds.ProductData.ProductPrice[k];
						if(i==1){
							price1 = d.price;
							vat_level1 = d.vat_level;
						}
						if(d.Customer.price_group_id ==  datas.price_group_id){
							found = 'yes'
							price2 = datas.price;
							vat_level2 = datas.vat_level;
							break;
						}
					}
					if(found == 'yes'){
						price = price2;
						vat_level = vat_level2;
					}
					else{
						price = price1;
						vat_level = vat_level1;
					}

					$('#unit_price_'+j).val(convertIntoLocalFormat(checkNull(price))).trigger('change');
					$('#vat_level_'+j).val(vat_level).trigger('change');
				}
			}
		}
	},
	bindCustomer:function(){
		$('#html_sale_customer_details').show();
		$('#btn_search_sale_customer').hide();
		$('#btn_edit_sale_customer,#btn_remove_sale_customer').show();

		
		var salesSalesAddress1 = checkNull(delivery_addresses.customer_address1);
		var salesSalesAddress2 = checkNull(delivery_addresses.customer_address2);
		var salesSaleZip = checkNull(customerData.Customer.customer_zip);
		var salesSaleCity = checkNull(customerData.Customer.customer_city);
		var salesSaleCountry = checkNull(customerData.Customer.customer_country);
		var label_salesSalesZipCity = '';
		if(salesSaleZip != ''){
			label_salesSalesZipCity += salesSaleZip+', ';
		}
		if(salesSaleCity != ''){
			label_salesSalesZipCity += salesSaleCity;
		}


		var salesSaleEmail = checkNull(customerData.Customer.customer_email);
		if(customerData.Customer.same_postal_address == 'y'){
			var salesDeliveryAddress1 = checkNull(delivery_addresses.delivery_address1);
			var salesDeliveryAddress2 = checkNull(delivery_addresses.delivery_address2);
			var salesDeliveryZip = checkNull(delivery_addresses.delivery_zip);
			var salesDeliveryCity = checkNull(delivery_addresses.delivery_city);
			var salesDeliveryCountry = checkNull(delivery_addresses.delivery_country);
			var salesDeliveryName= checkNull(delivery_addresses.delivery_name);
		}
		else{
			var salesDeliveryAddress1 = checkNull(delivery_addresses.delivery_address1);
			var salesDeliveryAddress2 = checkNull(delivery_addresses.delivery_address2);
			var salesDeliveryZip =  checkNull(delivery_addresses.delivery_zip);
			var salesDeliveryCity =  checkNull(delivery_addresses.delivery_city);
			var salesDeliveryCountry = checkNull(delivery_addresses.delivery_country);
			var salesDeliveryName= checkNull(delivery_addresses.delivery_name);
		}
		



		var salesDeliveryPhoneCode = checkNull(delivery_addresses.delivery_phone_code);
		var salesDeliveryPhone = checkNull(delivery_addresses.delivery_phone);

		$('#salesSalesAddress1').val(salesSalesAddress1);
		$('#label_salesSalesAddress1').html(salesSalesAddress1);
		if(salesSalesAddress1==''){
			$('#html_sales_address1').hide();
		}
		else{
			$('#html_sales_address1').show();
		}
		$('#label_salesSalesAddress2').html(salesSalesAddress2);
		if(salesSalesAddress2==''){
			$('#html_sales_address1').hide();
			$('#label_salesSalesAddress2').hide();
		}
		else{
			$('#label_salesSalesAddress2').show();
		}

		var getAllCountryList = sls_dt.getAllCountryList;
		var scoun = '';
		for(var j in getAllCountryList){
			if(j == salesSaleCountry)
				scoun = getAllCountryList[j];
		}

		$('#salesSaleCountry').val(salesSaleCountry);
		$('#label_salesSalesCountry').html(scoun);
		if(salesSaleCountry==''){
			$('#sale_country_row').hide();
		}
		else{
			$('#sale_country_row').show();
			if((sls_dt.partner_country ==  salesSaleCountry) && sls_dt.partnerSetting.show_customer_country == 'n'){
				$('#sale_country_row').hide();
			}
		}

		$('#salesSalesCustomerName').val(checkNull(customerData.Customer.customer_name)).attr('disabled','disabled');


		$('#salesSaleZip').val(salesSaleZip);
		$('#salesSaleCity').val(salesSaleCity);
		$('#label_salesSalesZipCity').html(label_salesSalesZipCity);

		$('#salesSaleEmail').val(salesSaleEmail);
		$('#label_salesSalesEmail').html(salesSaleEmail);


		(function ($) {
		    "use strict";

		    var Location = function (options) {
		        this.sourceCountryData = options.sourceCountry;
		        this.init('location', options, Location.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Location, $.fn.editabletypes.abstractinput);
		    $.extend(Location.prototype, {

		        render: function () {
		            this.$input = this.$tpl.find('input');
		            this.$textarea = this.$tpl.find('textarea');
		       
		            this.$list = this.$tpl.find('select');

		            this.$list.empty();

		            var fillItems = function ($el, data) {
		                if ($.isArray(data)) {
		                    for (var i = 0; i < data.length; i++) {
		                        if (data[i].children) {
		                            $el.append(fillItems($('<optgroup>', {
		                                label: data[i].text
		                            }), data[i].children));
		                        } else {
		                            $el.append($('<option>', {
		                                value: data[i].value
		                            }).text(data[i].text));
		                        }
		                    }
		                }
		                return $el;
		            };

		            fillItems(this.$list, this.sourceCountryData);
		            this.$list.select2();
		        },

		        value2html: function (value, element) {
		            if (!value) {
		                $(element).empty();
		                return;
		            }
		            var countryText = value.delivery_country;
			            $.each(this.sourceCountryData, function (i, v) {
			                if (v.value == countryText) {
			                    countryText = v.text.toUpperCase();
			                }
			            });
			            if(sls_dt.partnerSetting.show_customer_country == 'y'){

			            }
			            else{
			            	if(salesDeliveryCountry == sls_dt.partner_country){
			            		countryText = '';
			            	}
			            }
						
						if((salesDeliveryCountry == sls_dt.partner_country) && (sls_dt.partnerSetting.show_customer_country == 'n')){
							if(salesDeliveryName == '' && salesDeliveryZip == '' && salesDeliveryCity == ''){
								if(customerData.Customer.same_postal_address == 'y'  && delivery_addresses.mod == 0){
									var html = sls_td.Sameaspostaladdress;
								}
								else{
									var html = sls_td.Deliveryaddress;
								}
							}else if(salesDeliveryName == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								}else{
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(salesDeliveryAddress1 == ''){
								 if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									 var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }	
							}else if(salesDeliveryAddress2 == ''){
								 if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									 var html = $('<div>').text(value.delivery_name).html()+ '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else if(salesDeliveryZip == ''){
								 if(salesDeliveryPhone == ''){
									 if(salesDeliveryCity == ''){ 
										var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html();
									 }else{
										 var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html();
									 }	
								 }else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else if(salesDeliveryCity == ''){
								 if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html();
								 }else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else if(salesDeliveryCountry == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									 var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + ' ' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else{
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}
						}else{
							if(salesDeliveryName == '' && salesDeliveryZip == '' && salesDeliveryCity == '' && salesDeliveryCountry == ''){
								if(customerData.Customer.same_postal_address == 'y' && delivery_addresses.mod == 0){
									var html = sls_td.Sameaspostaladdress;
								}
								else{
									var html = sls_td.Deliveryaddress;
								}
							}else if(salesDeliveryName == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}	
							}else if(salesDeliveryAddress1 == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();	
								}
							}else if(salesDeliveryAddress2 == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(salesDeliveryZip == ''){
								if(salesDeliveryPhone == ''){
									if(salesDeliveryCity == ''){ 
										var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + ' ' + $('<div>').text(countryText).html();
									}else{
										var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
									}
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(salesDeliveryCity == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(salesDeliveryCountry == ''){
								 if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html(); 
								 }	
							}else{
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}
						}
	
			
		            	$(element).html(html);
		        },

		        html2value: function (html) {
		            return null;
		        },

		        value2str: function (value) {
		            var str = '';
		            if (value) {
		                for (var k in value) {
		                    str = str + k + ':' + value[k] + ';';
		                }
		            }
		            return str;
		        },

		        str2value: function (str) {
		            return str;
		        },

		        value2input: function(value) {
		            this.$input.filter('[name="delivery_name"]').val(value.delivery_name);
		            this.$input.filter('[name="delivery_address1"]').val(value.delivery_address1);
		            this.$input.filter('[name="delivery_address2"]').val(value.delivery_address2);
		            this.$input.filter('[name="delivery_zip"]').val(value.delivery_zip);
		            this.$input.filter('[name="delivery_city"]').val(value.delivery_city);
		            this.$list.val(value.delivery_country).trigger('change');
		            this.$input.filter('[name="delivery_phone_code"]').val(value.delivery_phone_code);
		            this.$input.filter('[name="delivery_phone"]').val(value.delivery_phone);
		        },
		              
		        input2value: function() {
		            return {
		               delivery_name: this.$input.filter('[name="delivery_name"]').val(),
		               delivery_address1: this.$input.filter('[name="delivery_address1"]').val(),
		               delivery_address2: this.$input.filter('[name="delivery_address2"]').val(),
		               delivery_zip: this.$input.filter('[name="delivery_zip"]').val(),
		               delivery_city: this.$input.filter('[name="delivery_city"]').val(),
		               delivery_country: this.$list.val(),
		               delivery_phone_code: this.$input.filter('[name="delivery_phone_code"]').val(),
		               delivery_phone: this.$input.filter('[name="delivery_phone"]').val(),
		            };
		        },
		        
		        activate: function () {
		            this.$input.filter('[name="delivery_name"]').focus();
		            $('#delivery_zip').change(function(){
		            	fetchCityFromZip($('#delivery_zip').val(),$('#customer_delivery_country').val(),'delivery_city')
		            });

		            $('#customer_delivery_country').change(function(){
		            	fetchPhoneInitials($('#customer_delivery_country').val(),'delivery_phone_code')
		            })


		            
		        },

		        autosubmit: function () {
		            this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		            });
		        }
		    });
			
			var tpl = '<div class="row-fluid"><div class="span7 delivery_address_left"><div class="editable-location" >' +
		        '<label><input type="text" class="input-inline delivery_name " autocomplete="off" name="delivery_name"></label>' +
		        '</div>' +
		        '<label class="e_delivery_address_label" style="margin-left: -136px;">'+sls_td.Deliveryaddress+'</label>'+
		        '<div class="editable-location" style="margin-top: -23px;">' +
		        '<label class="inline_delivery_address_label hide">'+sls_td.Deliveryaddress+'</label>'+
		        '<label><input  type="text" class="input-inline delivery_address1 " autocomplete="off" name="delivery_address1"></label>' +
		        '</div>' +
		        '<div class="editable-location">' +
		        '<label><input  type="text" class="input-inline delivery_address2 " autocomplete="off" name="delivery_address2"></label>' +
		        '</div></div><div class="span5 delivery_address_right">';

				if(lang == 'nb'){
					tpl += '<label class="e_delivery_zip_label" style="margin-left: -138px;margin-top: 4px;">'+sls_td.Zip+', '+sls_td.City+'</label>';
				}
				else{ 
					tpl += '<label class="e_delivery_zip_label" style="margin-left: -84px;margin-top: 4px;">'+sls_td.Zip+', '+sls_td.City+'</label>';
				}
		        tpl += '<div class="editable-location" style="margin-top: -26px;">' +
		        '<label class="inline_delivery_zip_label hide">'+sls_td.Zip+', '+sls_td.City+'</label>'+
		        '<label><input type="text" class="input-inline delivery_zip" id="delivery_zip" autocomplete="off" name="delivery_zip" style="width:40px;"></label><label><input style="width:93px;"  type="text" class="input-inline delivery_city "  name="delivery_city" autocomplete="off" id="delivery_city"></label>' +
		        '</div>' +
		        '<div class="editable-location">' +
		        '<label><select name="delivery_country" id="customer_delivery_country" autocomplete="off" class="input-inline-maxi delivery_country"></select></label>' +
		        '</div>'+
		        '<label class="e_delivery_address_label" style="margin-left: -123px;">'+sls_td.Deliveryphone+'</label>'+
		        '<div class="editable-location" style="margin-top: -23px;">' +
		        '<label class="inline_delivery_address_label hide">'+sls_td.Deliveryphone+'</label>'+
		        '<label><input type="text" class="input-inline delivery_phone_code" readonly id="delivery_phone_code" name="delivery_phone_code" style="width:40px;"></label><label><input style="width:93px;" type="text" class="input-inline delivery_phone " name="delivery_phone" id="delivery_phone"></label>' +
		        '</div></div></div>';

		    Location.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		       	tpl: tpl,
		        inputclass: '',
		        showbuttons: 'bottom',
		        sourceCountry: [],
		    });

		    $.fn.editabletypes.location = Location;
		}(window.jQuery));
	

		var getAllCountryList = sls_dt.getAllCountryList;
		var country_list = [];
		for(var j in getAllCountryList){
			country_list.push({
				text:getAllCountryList[j],
				value:j,
			});
		}
		$('#location').editable('destroy').html('');
		$('#location').editable({
			mode:'inline',  
			send:'never',
			value: {
				delivery_name: salesDeliveryName,
				delivery_address1: salesDeliveryAddress1,
				delivery_address2: salesDeliveryAddress2,
				delivery_zip: salesDeliveryZip,
				delivery_city: salesDeliveryCity,
				delivery_country: salesDeliveryCountry,
				delivery_phone_code: salesDeliveryPhoneCode,
				delivery_phone: salesDeliveryPhone,
			},
			sourceCountry:country_list,
			success:function(data,config){
				delivery_addresses = {
					delivery_name:config.delivery_name,
					delivery_address1:config.delivery_address1,
					delivery_address2:config.delivery_address2,
					delivery_zip:config.delivery_zip,
					delivery_city:config.delivery_city,
					delivery_country:config.delivery_country,
					delivery_phone:config.delivery_phone,
					delivery_phone_code:config.delivery_phone_code,
					mod:1
				};
			},
		});

		if(customerData.Customer.same_postal_address == 'y'  && delivery_addresses.mod == 0){
			$('#location').html(sls_td.Sameaspostaladdress);
		}
		
		
		if(checkNull(customerData.Customer.payment_terms) != ''){
			cal_d.credit_days = checkNull(customerData.Customer.payment_terms,'')
		}
		else{
			cal_d.credit_days = checkNull(sls_dt.partnerSetting.credit_days,'');
		}
		if($('#salesSalesPaymentTerms option[value="'+cal_d.credit_days+'"]').length != 0){
			$('#salesSalesPaymentTerms').val(cal_d.credit_days).trigger('change');
			$('#salesCustomCreditDays').val('');
		}
		else{
			$('#salesSalesPaymentTerms').val('custom').trigger('change');
			$('#salesCustomCreditDays').val(cal_d.credit_days);
		}

		if(from_storage == 'y' && is == 0){
   			var sales_payment_terms = checkNull(storage_data.sales_payment_terms,'');
   			if(sales_payment_terms != ''){
   				if($('#salesSalesPaymentTerms option[value="'+sales_payment_terms+'"]').length != 0){
						$('#salesSalesPaymentTerms').val(sales_payment_terms).trigger('change');
						$('#salesCustomCreditDays').val('');
					}
					else{
						$('#salesSalesPaymentTerms').val('custom').trigger('change');
						$('#salesCustomCreditDays').val(sales_payment_terms);
					}
   			}
   		}
   		is++;

   		

   		sales_save.saveData();
	},
	generateRef:function(id,data,frm){
		var ret = '';
		if(frm=='ourref'){
			var our_ref = staffer_id;

			if(from_storage == 'y' && checkNull(storage_data.our_ref) != ''){
				our_ref = storage_data.our_ref;
			}

			if(id == our_ref){
				ret += '<option value="'+data.email+'##'+id+'" selected="selected">';
			}
			else{
				ret += '<option value="'+data.email+'##'+id+'">';
			}
			
				ret += data.name +'&lt;'+data.email+'&gt;';
			ret += '</option>';
		}
		else if(frm == 'yourref'){
			if(checkNull(data.name) == ''){
				return '';
			}
			var our_ref = storage_data.your_ref;

			if(from_storage == 'y' && checkNull(storage_data.our_ref) != ''){
				var your_ref = storage_data.our_ref;
				if(your_ref == id){
					ret += '<option value="'+data.email+'##'+id+'" selected="selected">';
				}
				else{
					ret += '<option value="'+data.email+'##'+id+'">';
				}
			}
			else{
				if(data.is_default){
					ret += '<option value="'+data.email+'##'+id+'" selected="selected">';
				}
				else{
					ret += '<option value="'+data.email+'##'+id+'">';
				}
			}
			if(checkNull(data.email) != ''){
				ret += data.name +'&lt;'+data.email+'&gt;';
			}
			else{
				ret += data.name;
			}
			ret += '</option>';
		}
		return ret;
	},
	generateProductLinesHtml:function(){
		global_linKy++;
		var html = '';
		
		
		html += '<tr id="product_line_'+global_linKy+'" data-line-key="'+global_linKy+'">';	
			html += '<td>';
				html += '<input type="checkbox" name="product_checkbox" class="product_checkbox product_checkbox_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td class="checklist_hide">';
				html += '<div style="display:inline-block" class="dropdown">';
				html += '<button tabindex="-1" id="ChecklistBtn_'+global_linKy+'" style="display:none;background-color: rgb(77, 144, 254);" data-toggle="dropdown" type="button" class="btn-xs my-btn dropdown-toggle">'+sls_td.Select+'&nbsp;<i class="icon-angle-down"></i></button>';
				html += '<ul id="dropdown_menu_checklist" class="dropdown-menu" style="text-align:left;min-width:90px;">';
					html += '<li><a onclick="event.stopPropagation();sales_save.showCheck('+global_linKy+',1)" id="checkpopup_'+global_linKy+'" href="javascript:;" >'+sls_td.Fillout+'</a></li>';
					html += '<li><a onclick="event.stopPropagation();sales_save.showCheck('+global_linKy+',0)" data-id="'+global_linKy+'" id="checkignore_'+global_linKy+'">'+sls_td.Ignore+'</a></li>';
				html += '</ul>';
				html += '</div>';
				html += '<input type="hidden" id="fillChecklistsdata_'+global_linKy+'" class="fillChecklistsdata fillChecklistsdata_'+global_linKy+'" data-line-key="'+global_linKy+'" >';
			html += '</td>';

			html += '<td>';
				html += '<input type="text" id="product_number_'+global_linKy+'" class="input_color m-wrap span12 product_number product_number_'+global_linKy+'" data-line-key="'+global_linKy+'">';
				html += '<input type="hidden" id="product_id_'+global_linKy+'" class="product_id product_id_'+global_linKy+'" data-line-key="'+global_linKy+'">';
				html += '<input type="hidden" id="product_numberhidden_'+global_linKy+'" class="product_numberhidden product_numberhidden_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input type="text" id="product_name_'+global_linKy+'" class="input_color m-wrap span12 product_name product_name_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td class="loc_hide loc_hide_'+global_linKy+'">';
				html += '<select type="text" id="loc_'+global_linKy+'" class="input_color m-wrap span12 loc loc_'+global_linKy+'" data-line-key="'+global_linKy+'">';
				var opts = '';
					for(var j in sls_dt.getLocationList){
						var d = sls_dt.getLocationList[j];
						if(j != 0){
							opts += '<option value="'+j+'">'+d.location_name+'('+convertIntoLocalFormat(checkNull(d.actual_inventory))+')</option>';
						}
						else{
							opts += '<option value="'+j+'">'+d.location_name+'</option>';
						}
						
					}
					if(opts == ''){
						opts += '<option ></option>';
					}
					html += opts;
				html += '<select>';

				
			html += '</td>';
			html += '<input type="hidden" id="inventory_product_'+global_linKy+'" class="inventory_product inventory_product_'+global_linKy+'" data-line-key="'+global_linKy+'" >';

			html += '<input type="hidden" id="actual_inventory_'+global_linKy+'" class="actual_inventory actual_inventory_'+global_linKy+'" data-line-key="'+global_linKy+'" >';

			html += '<input type="hidden" id="all_location_id_'+global_linKy+'" class="all_location_id all_location_id_'+global_linKy+'" data-line-key="'+global_linKy+'" >';
			html += '<input type="hidden" id="partner_list_id_'+global_linKy+'" class="partner_list_id partner_list_id_'+global_linKy+'" data-line-key="'+global_linKy+'" >';


			

			html += '<td>';
				html += '<input type="text" id="qty_'+global_linKy+'" class="input_color m-wrap span12 qty qty_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<span class="text" id="unit_name_'+global_linKy+'" readonly="readonly"></span>'
				html += '<input type="hidden" id="unit_'+global_linKy+'" class="input_color m-wrap span12 unit unit_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input type="text" id="unit_price_'+global_linKy+'" class="input_color m-wrap text-right span12 unit_price unit_price_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input readonly="readonly" tabindex="-1" type="text" id="line_total_'+global_linKy+'" class="m-wrap span12 text-right line_total line_total_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';


		

			html += '<td>';
				html += '<input type="text" id="discount_amount_'+global_linKy+'" class="input_color  text-right m-wrap span12 discount_amount discount_amount_'+global_linKy+'" data-line-key="'+global_linKy+'">';
				html += '<input type="hidden" id="discount_'+global_linKy+'" class="input_color m-wrap span12 discount_amount discount_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td class="tax_hide tax_hide_'+global_linKy+'">';
				
				html += '<select  name="vat_level" id="vat_level_'+global_linKy+'" class="vat_level input_color m-wrap span12" id="vat_level_'+global_linKy+'">';
					html += '<option value="">';
						html += '';
					html += '</option>';
					for(var j in sls_dt.getPartnerTaxLevelList){
						var tl = sls_dt.getPartnerTaxLevelList[j];
						html += '<option value="'+j+'">';
							html += tl;
						html += '</option>';
					}
				html += '</select>';
			html += '</td>';

			html += '<td class="tax_hide tax_hide_'+global_linKy+'">';
				html += '<input readonly="readonly" tabindex="-1" type="text" id="mva_val_'+global_linKy+'" class="input_color m-wrap  text-right span12 mva_price mva_price_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input readonly="readonly" tabindex="-1" type="text" id="gross_amount_'+global_linKy+'" class="m-wrap span12 text-right gross_amount gross_amount_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';
			
			
			

		html += '</tr>';

		if(LastFocusId != '' && $('tr[data-line-key="'+LastFocusId+'"]').length != 0){
			$('tr[data-line-key="'+LastFocusId+'"]').after(html);
		}
		else{
			$('#product_lines tbody').append(html);
		}
		
		sales_save.bindProductLines();
	},
	showCheck:function(line_id,frm){
		if(frm == 1){
			//showcheckpopup
			// var prod_id = $('#product_id_'+line_id).val();
			// var d = all_products[line_id];
			// var partner_list_id = d.ProductData.Product.partner_list_id;
			// if(checkNull(partner_list_id) == ''){
			// 	partner_list_id = d.ProductData.ProductPrice.partner_list_id;
			// }
			var partner_list_id = $('#partner_list_id_'+line_id).val();
			var a = document.createElement('div');
			var ans = $('#fillChecklistsdata_'+line_id).val();
			$(a).attr('data-url', base_url + 'sales/fill_checklists/'+partner_list_id+'?line_key='+line_id+'&from=newsales&ans='+ans);
			$(a).attr('data-width','800px');
			show_modal(a,'popups');
		}
		else{
			//ignore
			$('#ChecklistBtn_'+line_id).parent().removeClass('open');
			$('#ChecklistBtn_'+line_id).css('background-color','grey');
			var obj = {ignore:1};
			$('#fillChecklistsdata_'+line_id).val(JSON.stringify(obj)).trigger('change');	
			

		}
	},
	updateChecklist:function(data,line_id){
		$('#fillChecklistsdata_'+line_id).val(JSON.stringify(data));
		sales_save.saveData();
	},
	bindProductLines:function(){
		var vat_required = sls_dt.partnerSetting.vat_required;
		var enable_inventory = sls_dt.partnerSetting.enable_inventory;
		var checklistcount = sls_dt.checklistcount;

		if(vat_required=='n'){
			$('.perform_vat_calculation').parent().parent().parent().hide();
			$('.tax_hide').hide();
			$('select[name="vat_level"]').val('');


		}
		else{
			$('.tax_hide').show();

		}

		if(enable_inventory=='n'){
			$('.loc_hide').hide();
			$('select.loc').val('');
		}
		else{
			$('.loc_hide').show();
		}

		if(checkNull(checklistcount) > 0){
			$('.checklist_hide').show();
		}
		else{
			$('.checklist_hide').hide();
		}
		$('.product_checkbox_'+global_linKy).change(function(){
			var a = $('.product_checkbox:checked').length;
			var b = $('.product_checkbox').length;
			if(a == b){
				$('.all_products').prop('checked','checked');
			}
			else{
				$('.all_products').removeAttr('checked');
			}
			if(a > 0){
				$('#del_prod').show();
				$('#add_prod,#btn_product_bundle').hide();
			}
			else{
				$('#del_prod').hide();
				$('#add_prod,#btn_product_bundle').show();
			}
			$.uniform.update();
		}).uniform();
		
		
		$('#loc_'+global_linKy).select2({

		});
		$('#vat_level_'+global_linKy).select2({
			placeholder:sls_td.Select,
			allowClear:true
		});
		sales_save.autoCompleteProductLines();
		setTimeout(function(){
			$('#product_number_'+global_linKy).focus();
		});
	},
	removeProductLines:function(){
		var yes = function(){
			$('.product_checkbox:checked').each(function(){
				var a = $(this).attr('data-line-key');
				delete all_products[a];
				$('#product_line_'+a).remove();
				
			});
			if($('#product_lines tbody tr').length==0){
				sales_save.generateProductLinesHtml();
			}
			$('.all_products').prop('checked',false); 

			var a = $('.product_checkbox:checked').length;
			var b = $('.product_checkbox').length;
			if(a == b){
				$('.all_products').prop('checked','checked');
			}
			else{
				$('.all_products').removeAttr('checked');
			}
			if(a > 0){
				$('#del_prod').show();
				$('#add_prod,#btn_product_bundle').hide();
			}
			else{
				$('#del_prod').hide();
				$('#add_prod,#btn_product_bundle').show();
			}
			$.uniform.update();	
			sales_save.calLineTotal();
		};
		var no = function(){
		}
		showDeleteMessage(sls_td.$del_sel_line,sls_td.Confirmation,yes,no,'ui-dialog-blue',sls_td.Delete,sls_td.Cancel);
	},
	autoCompleteProductLines:function(){
		var TABKEY = 9;
		var availableTags =  sls_dt.productData;

		$('#product_lines #product_number_'+global_linKy).autocomplete({
			autoFocus: true,
			minLength: 1,
			source: availableTags,
			change:function(event,data){
				var line_id = $(this).attr('data-line-key');
				var prod_no = $('#product_number_'+line_id).val();
				console.log('prod_no',prod_no);
			
				if(prod_no.length >= 4 && !isNaN(prod_no) ){
					console.log('prod_no_inside',prod_no);
					var found = 0;
					for(var k in  sls_dt.productData){
						if(sls_dt.productData[k]['prod_number'] == prod_no	){
							sales_save.getAutoFillProductLines(sls_dt.productData[k]['id'],line_id);
							found = 1;
							break;
						}
					}

					if(found == 0){
						showAlertMessage(sls_td.Invalidproduct,'error',sls_td.alertmessage);
						if(data.item == null || data.item.id == 'add_new_product'){
							$('#product_number_'+line_id).val($('#product_numberhidden_'+line_id).val());
						}
					}
				}
				else{
					$('#product_number_'+line_id).val($('#product_numberhidden_'+line_id).val());
				}

			},
			select: function( event, data ) {
				var line_id = $(this).attr('data-line-key');
				if(data.item.id == 'add_new_product'){
					var url = base_url + 'products/add?from=new_sales&line_id='+line_id;
					show_modal('','popups','',url);
					return;
				}
				else{
					$('#product_id_'+line_id).val(data.item.id);
					sales_save.getAutoFillProductLines(data.item.id,line_id);
				}
			},
			response: function(event, ui) {
		        if(!ui.content.length) {
		            var noResult = { id:"add_new_product",label:sls_td.Addnewproduct };
		            ui.content.push(noResult);
		        }
		    }
		});
	},
	getAutoFillProductLines:function(id,line_id,productData=''){
		if(checkNull(productData) != ''){
			sls_dt.productData = productData;
			var TABKEY = 9;
			var availableTags =  sls_dt.productData;
			$('.product_number').each(function(){
				var id = $(this).attr('id');
				$('#product_lines #'+id).autocomplete({
					minLength: 1,
					source: availableTags,
					change:function(event,data){
						var line_id = $(this).attr('data-line-key');
						var prod_no = $('#product_number_'+line_id).val();
						console.log('prod_no',prod_no);
					
						if(prod_no.length >= 4 && !isNaN(prod_no) ){
							console.log('prod_no_inside',prod_no);
							var found = 0;
							for(var k in  sls_dt.productData){
								if(sls_dt.productData[k]['prod_number'] == prod_no	){
									sales_save.getAutoFillProductLines(sls_dt.productData[k]['id'],line_id);
									found = 1;
									break;
								}
							}

							if(found == 0){
								showAlertMessage(sls_td.Invalidproduct,'error',sls_td.alertmessage);
								if(data.item == null || data.item.id == 'add_new_product'){
									$('#product_number_'+line_id).val($('#product_numberhidden_'+line_id).val());
								}
							}
						}
						else{
							$('#product_number_'+line_id).val($('#product_numberhidden_'+line_id).val());
						}

						
						
					},
					select: function( event, data ) {
						var line_id = $(this).attr('data-line-key');
						if(data.item.id == 'add_new_product'){
							var url = base_url + 'products/add?from=new_sales&line_id='+line_id;
							show_modal('','popups','',url);
							return;
						}
						else{
							$('#product_id_'+line_id).val(data.item.id);
							sales_save.getAutoFillProductLines(data.item.id,line_id);
						}
					},
					response: function(event, ui) {
				        if(!ui.content.length) {
				            var noResult = { id:"add_new_product",label:sls_td.Addnewproduct };
				            ui.content.push(noResult);
				        }
				    }
				});
			});

		}
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			product_id:id,
			warehouse_id:sls_dt.warehouse_id,
			location_id	:sls_dt.loc_ids,
			from:'newsales'
		}
		showProcessingImage('undefined');
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/products/getProductLines.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				sales_save.autoFillProductLines(complet_data.response.response,line_id);

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',sls_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',sls_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	autoFillProductLines:function(product_data,line_id,qty=''){

		all_products[line_id] = product_data;
		var product = product_data.ProductData.Product;
		var productUnit = product_data.ProductData.ProductUnit;
		if("id" in product_data.ProductData.ProductPrice && product_data.ProductData.ProductPrice.id != ''){
			var productPrice = [];
			productPrice.push(product_data.ProductData.ProductPrice);
		}
		else{
			var productPrice = product_data.ProductData.ProductPrice;
		}
		for(var j in productPrice){
			productPrice[j].price = convertIntoLocalFormat(productPrice[j].price);
		}
		console.log('productPrice',productPrice);
		
		var stockProductsData =  product_data.ProductData.stockProductsData;
		var productCategory = product_data.ProductData.ProductCategory;


		for(var j in stockProductsData){
			var tl = stockProductsData[j];
			html += '<option value="'+j+'">';
				html += tl;
			html += '</option>';
		}

		var html = '';
		if(product.inventory_product == 'n'){
			html += '<select disabled type="text" id="loc_'+line_id+'" class="input_color m-wrap span12 loc loc_'+line_id+'" data-line-key="'+line_id+'">';
		}
		else{
			html += '<select type="text" id="loc_'+line_id+'" class="input_color m-wrap span12 loc loc_'+line_id+'" data-line-key="'+line_id+'">';
		}
		var max_unit_id = 0;
		var actual_inventory = 0;
		
		for(var j in stockProductsData){
			var d = stockProductsData[j];

			if(d.actual_inventory != 0){
				if(d.actual_inventory > actual_inventory){
					actual_inventory = d.actual_inventory ;
					max_unit_id = j;
				}
			}
			else{
				max_unit_id = j;
			}
		}
		
		for(var j in stockProductsData){
			var d = stockProductsData[j];
			if(j != 0){
				if(max_unit_id == j ){
					html += '<option value="'+j+'"  selected="selected" inv_prod="'+product.inventory_product+'" data-actual-inv="'+d.actual_inventory+'">'+d.location_name+'('+convertIntoLocalFormat(checkNull(d.actual_inventory))+')</option>';
				}
				else{
					html += '<option value="'+j+'" inv_prod="'+product.inventory_product+'" data-actual-inv="'+d.actual_inventory+'"> '+d.location_name+'('+convertIntoLocalFormat(checkNull(d.actual_inventory))+')</option>';
				}
				
			}
			else{
				if(max_unit_id == j ){
					html += '<option value="'+j+'" inv_prod="'+product.inventory_product+'" selected="selected"  data-actual-inv="0">'+d.location_name+'</option>';
				}
				else{
					html += '<option value="'+j+'" inv_prod="'+product.inventory_product+'" data-actual-inv="0">'+d.location_name+'</option>';
				}
			}
		}
		
		
		html += '</select>';

		$('.loc_hide_'+line_id).html(html);
		$('#inventory_product_'+line_id).val(product.inventory_product);
		
		$('#actual_inventory_'+line_id).val(actual_inventory);
		$('#all_location_id_'+line_id).val(max_unit_id+'_'+actual_inventory);


		
		$('#product_numberhidden_'+line_id).val(product.product_number);
		$('#product_number_'+line_id).val(product.product_number);
		$('#product_name_'+line_id).val(product.product_name);
		$('#product_id_'+line_id).val(product.id);
		if(qty != ''){
			$('#qty_'+line_id).val(changeSiteNumberFormat(parseFloat(qty)));			
		}
		else{
			$('#qty_'+line_id).val(changeSiteNumberFormat(parseFloat(product.quantity)));			
		}
		
		var price2 = '';
		var price1 = '';
		var price = '';

		var vat_level2 = '';
		var vat_level1 = '';
		var vat_level = '';

		
		var i = 0;
		var found = 'no';
		for(var j in productPrice){
			i++;
			var d = productPrice[j];
			if(i==1){
				price1 = d.price;
				vat_level1 = d.vat_level;
			}

		
			if(checkNull(customerData) != ''){
				if(d.price_group_id ==  customerData.Customer.price_group_id){
					found = 'yes'
					price2 = d.price;
					vat_level2 = d.vat_level;
					break;
				}
			}
		}
		if(found == 'yes'){
			price = price2;
			vat_level = vat_level2;
		}
		else{
			price = price1;
			vat_level = vat_level1;
		}

		$('#unit_price_'+line_id).val(price).limitAmountPrice(8);
		
		$('#discount_amount_'+line_id).val(changeSiteNumberFormat(parseInt(product.discount))).limitAmountPrice(8);
		$('#gross_amount_'+line_id).val(changeSiteNumberFormat(parseInt(product.total_amount)));

		$('#discount_amount_'+line_id).calculateDiscount(line_id);

		$('#unit_'+line_id).val(product.product_unit_id);
		$('#unit_name_'+line_id).html(productUnit.unit_name);
		
		$('#qty_'+line_id).change(function(){
			sales_save.calLineTotal(line_id);
		});

		$('#discount_amount_'+line_id).change(function(){
			sales_save.calLineTotal(line_id);
		});
		$('.loc_'+line_id).change(function(){
			sales_save.calLineTotal(line_id);
		});
		
		$('#unit_price_'+line_id).change(function(){
			sales_save.calLineTotal(line_id);
		});
		$('#vat_level_'+line_id).change(function(){
			sales_save.calLineTotal(line_id);
		});


		$('.loc_'+line_id).select2().change(function(){
			var v  = $(this).val();
			for(var j in stockProductsData){
				if(j == v){
					var d = stockProductsData[j];

					$('#inventory_product_'+line_id).val(product.inventory_product);
					$('#actual_inventory_'+line_id).val(d.actual_inventory);
					$('#all_location_id_'+line_id).val(j+'_'+d.actual_inventory);
				}
				sales_save.calLineTotal(line_id);
			}

		});
		if(product.line_vat!=0){
			$('#vat_level_'+line_id).val(vat_level).trigger('change');
		}
	
		
		limitBundlePrice('#qty_'+line_id,6);	

		limitPrice('#unit_price_'+line_id,9);

		if(checkNull(product.partner_list_id) != '' || checkNull(productCategory.partner_list_id) != ''){
			$('#ChecklistBtn_'+line_id).show();
		}
		else{
			$('#ChecklistBtn_'+line_id).hide();
		}
		var partner_list_id = checkNull(product.partner_list_id);
		if(checkNull(partner_list_id) == ''){
			partner_list_id = checkNull(productCategory.partner_list_id);
		}
		$('#partner_list_id_'+line_id).val(partner_list_id);
		sales_save.calLineTotal(line_id);
		$('#product_name_'+line_id).focus();
		sales_save.saveData();
	},
	addProductBundle:function(data,qty){
		$('.product_checkbox').each(function(){
	  		var a = $(this).attr('data-line-key');
			if(checkNull($('#product_id_'+a).val() == '')){
				$('#product_line_'+a).remove();
			}
		});
		for(var j in data){
			sales_save.generateProductLinesHtml();
			var d = {ProductData:data[j]};
			var qqty = checkNull(data[j].Product.quantity,1) * qty;
			sales_save.autoFillProductLines(d,global_linKy,qqty);
		}
	},
	calLineTotal:function(lk=''){
		var enable_inventory = sls_dt.partnerSetting.enable_inventory;
		var arr= [];
		var arr2 = [];
		if(lk==''){
			$('#product_lines tbody tr').each(function(){
				var lkk = $(this).attr('data-line-key');
				arr.push(lkk);
			});
		}
		else{
			arr.push(lk);
		}
		
		for(j in arr){
			var line_key = arr[j];
			var unit_price_val = $('#unit_price_'+line_key).val();
			unit_price_val = convertIntoStandardFormat(unit_price_val.trim());

			var discount_amount_val = $('#discount_amount_'+line_key).val();
			discount_amount_val = parseFloat(convertIntoStandardFormat(discount_amount_val.trim()));

			var qty = $('#qty_'+line_key).val();
			qty = parseFloat(convertIntoStandardFormat(qty));

			var percentage = $("#vat_level_"+line_key+" option:selected").text();
			percentage = percentage.trim();
			if(!IsNumeric(percentage) || percentage == '-'){
				percentage = '0';
			}
			percentage = parseFloat(percentage);
			var total_amount = roundNumber((parseFloat(unit_price_val) * parseFloat(qty)));
			$('#line_total_'+line_key).val(convertIntoLocalFormat(roundNumber(total_amount)));
			var tax = 0;
			var dis_total = total_amount - discount_amount_val;
			var vat_enabled = sls_dt.partnerSetting.vat_required;
			if(vat_enabled=='y'){
				 tax = roundNumber((parseFloat(dis_total) * parseInt(percentage))/ 100);
				 $('#mva_val_'+line_key).val(convertIntoLocalFormat(checkNull(tax,0)));
			}


			if(discount_amount_val > total_amount){
				$('#discount_amount_'+line_key).val('0,00');
				discount_amount_val = 0;
				showAlertMessage(sls_td.Thediscountshouldnotbegreaterthannetamount,'error',sls_td.Alertmessage);
				
			}
			
			total_amount = roundNumber(parseFloat(total_amount) - parseFloat(discount_amount_val) + parseFloat(tax));
			$('#gross_amount_'+line_key).val(convertIntoLocalFormat(roundNumber(total_amount)));
			
		}

		if(lk!=''){
			var res = {
				total_amount:total_amount,
				gross_amount:dis_total,
				tax:tax
			}
			
		}

		var net_amount = 0;
		var total_tax = 0;
		var total_discount = 0;
		var invoice_gross_amount = 0;
		var total_w_d = 0;
		arr = [];
		$('#product_lines tbody tr').each(function(){
			var lkk = $(this).attr('data-line-key');
			arr.push(lkk);
		});
		var table = '';
		var tabledata = {};
		for(j in arr){
			
			var line_key = arr[j];
			var unit_price_val = $('#unit_price_'+line_key).val();
			unit_price_val = convertIntoStandardFormat(unit_price_val.trim());

			var discount_amount_val = $('#discount_amount_'+line_key).val();
			discount_amount_val = parseFloat(convertIntoStandardFormat(discount_amount_val.trim()));
			total_discount = parseFloat(total_discount) + parseFloat(discount_amount_val);
			var qty = $('#qty_'+line_key).val();
			qty = parseFloat(convertIntoStandardFormat(qty));

			var v = $("#vat_level_"+line_key).val();
			var percentage = $('#vat_level_'+line_key+' option[value="'+v+'"]').text();

			percentage = percentage.trim();

			if(!IsNumeric(percentage) || percentage == '-'){
				percentage = '0';
			}
			percentage = parseFloat(percentage);
		
			var total_amount = roundNumber((parseFloat(unit_price_val) * parseFloat(qty)));
			
			net_amount = parseFloat(total_amount) + parseFloat(net_amount);

			var tax = 0;
			var dis_total = total_amount - discount_amount_val;
			total_w_d = parseFloat(total_w_d) + parseFloat(dis_total);
			var vat_enabled = sls_dt.partnerSetting.vat_required;
			if(vat_enabled=='y' && checkNull(percentage) != ''){
				tax = roundNumber((parseFloat(dis_total) * parseInt(percentage))/ 100);
				total_tax = parseFloat(total_tax) + parseFloat(tax);

				if(percentage in tabledata && checkNull(tabledata[percentage]) != ''){
					var d = parseFloat(checkNull(tabledata[percentage].dis_total,0)) + parseFloat(checkNull(dis_total,0));
					var e = parseFloat(checkNull(tabledata[percentage].tax,0)) + parseFloat(checkNull(tax,0));

					tabledata[percentage] = {
						dis_total:d,
						tax:e
					};
				}
				else{
					tabledata[percentage] = {
						dis_total:dis_total,
						tax:tax
					};					
				}
			}

			if(enable_inventory == 'y'){
				$('#qty_'+line_key).removeClass('inv_err');
				var v = $("#loc_"+line_key).val();
				var actual_inv = $('#loc_'+line_key+' option[value="'+v+'"]').attr('data-actual-inv');
				var inv_prod = $('#loc_'+line_key+' option[value="'+v+'"]').attr('inv_prod');
				if(inv_prod == 'y'){
					if(parseFloat(actual_inv) < parseFloat(qty)){
						$('#qty_'+line_key).addClass('inv_err');
					}
				}
			}



			if(discount_amount_val > total_amount){
				$('#discount_amount_'+line_key).val('0,00');
				discount_amount_val = 0;
				showAlertMessage(sls_td.Thediscountshouldnotbegreaterthannetamount,'error',sls_td.Alertmessage);
			}
			
			total_amount = roundNumber(parseFloat(total_amount) - parseFloat(discount_amount_val) + parseFloat(tax));
			invoice_gross_amount = parseFloat(invoice_gross_amount) + parseFloat(total_amount);
			
		}

	
		var round_off_val = 0;
		if(sls_dt.partnerSetting.round_off == 'y'){
			if(checkNull(sls_dt.getPartnerCountryDetails.round_off) != ''){
				var v = getRoundOff(invoice_gross_amount,sls_dt.getPartnerCountryDetails.round_off);
			
				if(invoice_gross_amount != v){
					round_off_val = parseFloat(invoice_gross_amount) - parseFloat(v);
					if(round_off_val > 0){
						round_off_val = '-' + round_off_val; 
					}
				}
				
				else{
					v = parseFloat(v);
				}				
				invoice_gross_amount = v;
			}
		}
		//
	
		$('#invoice_net_amount').html(convertIntoLocalFormat(roundNumber(net_amount)));
		if(vat_enabled=='y'){
			if(checkNull(total_tax) != ''){
				$('#invoice_total_mva').html(convertIntoLocalFormat(roundNumber(total_tax)));
				$('#invoice_total_mva').parent().parent().show();
			}
			else{
				$('#invoice_total_mva').parent().parent().hide();
			}
		}
		else{
			$('#invoice_total_mva').parent().parent().hide();
		}
		
		if(checkNull(total_discount) != ''){
			$('#invoice_total_discount').html(convertIntoLocalFormat(-1 * roundNumber(total_discount)));
			$('#invoice_total_discount').parent().parent().show();
		}
		else{
			$('#invoice_total_discount').parent().parent().hide();
		}
		
		$('#invoice_gross_amount').html(convertIntoLocalFormat(roundNumber(total_w_d)));
		if(checkNull(round_off_val) != ''){
			$('#calculate_round_off').parent().parent().show();
		}
		else{
			$('#calculate_round_off').parent().parent().hide();
		}
		$('#calculate_round_off').html(convertIntoLocalFormat(roundNumber(round_off_val)));
		

	
		for(var j in tabledata){
			table += '<tr>';
				table += '<td>'+sls_td.Outgoingvat+'</td>';
				table += '<td>'+j+' %</td>';
				table += '<td  style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(roundNumber(tabledata[j].dis_total))+'</td>';
				table += '<td style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(roundNumber(tabledata[j].tax))+'</td>';
			table += '</tr>';
		}

		if($('#perform_vat_calculation tr').length == 0){
			$('.pvc_wrap').parent().css('display','block');
			$('.pvc_wrap').hide();
			
			$('.summary_block').removeClass('well');
			$('.summary_block div.row-fluid div:last').addClass('well')
		}
		else{
			$('.pvc_wrap').parent().css('display','flex');
			$('.pvc_wrap').show();

			$('.summary_block').addClass('well');
			$('.summary_block div.row-fluid div:last').removeClass('well')
		}

		$('#perform_vat_calculation').html(table);
		$('#invoice_total_to_pay').html(convertIntoLocalFormat(roundNumber(invoice_gross_amount)));
		if($('#perform_vat_calculation tr').length == 0){
			$('.pvc_wrap').parent().css('display','block');
			$('.pvc_wrap').hide();
			$('.summary_block').removeClass('well');
			$('.summary_block div.row-fluid div:last').addClass('well')
		}
		else{
			$('.pvc_wrap').parent().css('display','flex');
			$('.pvc_wrap').show();
			$('.summary_block').addClass('well');
			$('.summary_block div.row-fluid div:last').removeClass('well')
		}
		for(var j in storage_timeouts){
			clearTimeout(storage_timeouts[j]);
		}
		storage_timeouts.push(setTimeout(function(){
			sales_save.saveData();
		},1));

		if(lk!=''){
			return res;
		}	
	},
	getAndSaveCustomer:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:customer_id
		};


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerView.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var dt = complet_data.response.response;
				sales_save.changeCust(dt);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',sls_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',sls_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	saveData:function(){
		var your_ref_d =  $('#salesSaleYourRef').val();
		var your_ref = '';
		if(checkNull(your_ref_d) != ''){
			your_ref_d = your_ref_d.split('##');
			your_ref = checkNull(your_ref_d[1]);
		}

		
		var reference_contact_id = checkNull(your_ref);

		var our_ref_d = $('#salesSaleOurRef').val();
		var our_ref = '';
		if(checkNull(our_ref_d) != ''){
			our_ref_d = our_ref_d.split('##');
			our_ref = checkNull(our_ref_d[1]);
		}
		
		var bp_referrer_id = $('#referrer_id').val();
		var description = checkNull($('#description').editable('getValue').description,'');

		var sales_date = $('#salesSalesDate').val();
		var sales_date1 = '';
		if(checkNull(sales_date) != ''){

			sales_date = moment($('#salesSalesDate').datepicker('getDate')).format('YYYY-MM-DD');
			sales_date1 = moment($('#salesSalesDate').datepicker('getDate')).format('DD.MM.YY');
		}


		if(checkNull(customer_id) != '' && checkNull(customerData) != ''){
			var customer_name = customerData.Customer.customer_name;
			var customer_number = customerData.Customer.customer_number;

			var address1 = delivery_addresses.delivery_address1;
			var address2 = delivery_addresses.delivery_address2;
			var zip = delivery_addresses.delivery_zip;
			var city = delivery_addresses.delivery_city;
			var company_country = delivery_addresses.delivery_country;
			var company_email = customerData.Customer.customer_email;
			var customer_ein = checkNull(customerData.Customer.customer_ein,'');
			var mod = checkNull(delivery_addresses.mod);
			var delivery_name = checkNull(delivery_addresses.delivery_name);
			var delivery_phone = checkNull(delivery_addresses.delivery_phone);
			var delivery_phone_code = checkNull(delivery_addresses.delivery_phone_code);

			var sales_zip = checkNull(customerData.Customer.customer_zip);
			var sales_city = checkNull(customerData.Customer.customer_city);
			var sales_address1 = checkNull(customerData.Customer.customer_address1);
			var sales_address2 = checkNull(customerData.Customer.customer_address2);
			var customer_ein = checkNull(customerData.Customer.customer_ein);
		}
		else{
			var customer_name = '';
			var customer_number = '';
			var address1 = '';
			var address2 = '';
			var zip = '';
			var city = '';
			var company_country = '';
			var company_email = '';
			var customer_ein = '';
			var mod = 0;
			var delivery_name = '';
			var delivery_phone = '';
			var delivery_phone_code = '';

			var sales_zip = '';
			var sales_city = '';
			var sales_address1 = '';
			var sales_address2 = '';
			var customer_ein = '';
		}

		

		var currency_id = CUR_ID;
		var apply_tax = sls_dt.partnerSetting.vat_required;
		if(apply_tax == 'y'){
			apply_tax =true;
		}
		else{
			apply_tax = '';
		}
		var from_button = 'save_draft';

		var delivery_methods_val = $('#delivery_methods').editable('getValue').delivery_methods;
		var delivery_method = '';
		if(checkNull(delivery_methods_val) != ''){
			delivery_methods_val = delivery_methods_val.split('##');
			delivery_method = checkNull(delivery_methods_val[0]);
		}

		var delivery_note = $('#custom_delivery_note').editable('getValue').custom_delivery_note;

		var sales_payment_terms_val = $('#salesSalesPaymentTerms').val();
		if(sales_payment_terms_val == 'custom'){
			sales_payment_terms_val = $('#salesCustomCreditDays').val();
		}

		var sales_datee = moment($('#salesSalesDate').datepicker('getDate'));
		
		var due_date = sales_datee;

		if(checkNull(sales_payment_terms_val) != ''){
			sales_payment_terms_val = parseInt(sales_payment_terms_val);
			var crd_days = parseInt(sls_dt.partnerSetting.credit_days);
			var d = sales_datee.add('days',crd_days).format('YYYY-MM-DD');
			due_date = d;
		}

		var tracking_num = $('#tracking_num_a').editable('getValue').tracking_num_a;

		var arr= [];
		$('#product_lines tbody tr').each(function(){
			var lkk = $(this).attr('data-line-key');
			arr.push(lkk);
		});
		var prod_data = [];
		for(j in arr){
			var obj = {};
			var line_key = arr[j];
			var unit_price_val = $('#unit_price_'+line_key).val();
			unit_price_val = convertIntoStandardFormat(unit_price_val.trim());

			obj.product_id = $('#product_id_'+line_key).val();
			obj.product_number = $('#product_numberhidden_'+line_key).val();
			obj.product_name = $('#product_name_'+line_key).val();
			obj.unit_price = unit_price_val;
	

			var discount_amount_val = $('#discount_amount_'+line_key).val();
			discount_amount_val = parseFloat(convertIntoStandardFormat(discount_amount_val.trim()));

			obj.discount = discount_amount_val

			var qty = $('#qty_'+line_key).val();
			qty = parseFloat(convertIntoStandardFormat(qty));

			obj.qty = qty;

			var percentage = $("#vat_level_"+line_key+" option:selected").text();
			percentage = percentage.trim();
			if(!IsNumeric(percentage) || percentage == '-'){
				percentage = '0';
			}
			percentage = parseFloat(percentage);
			var total_amount = roundNumber((parseFloat(unit_price_val) * parseFloat(qty)));

			var tax = 0;
			var dis_total = total_amount - discount_amount_val;
			var vat_enabled = sls_dt.partnerSetting.vat_required;
			if(vat_enabled=='y'){
				 tax = roundNumber((parseFloat(dis_total) * parseInt(percentage))/ 100);
			}
			var partner_tax_level_id = $("#vat_level_"+line_key).val();

			var unit_id = $('#unit_'+line_key).val();


			obj.gross_amount = total_amount;
			obj.vat = tax;
			if(vat_enabled=='y'){
				obj.partner_tax_level_id = checkNull(partner_tax_level_id,0);
			}
			else{
				obj.partner_tax_level_id = 0;
			}

			if(checkNull(obj.partner_tax_level_id) == ''){
				obj.partner_tax_level_id = 0;
			}
			obj.text_line = 'n';
			obj.actual_inventory = $('#actual_inventory_'+line_key).val(); 
			if($('#inventory_product_'+line_key).val() == 'y'){
				obj.location_id = $('#all_location_id_'+line_key).val();
			}
			else{
				obj.location_id = null;
			}
			
			obj.fillChecklistsdata = $('#fillChecklistsdata_'+line_key).val();
			obj.partnerListId = $('#partner_list_id_'+line_key).val();
			obj.line_key = line_key;
			obj.unit_id = unit_id;
			prod_data.push(obj);
		}

		var sales_id = $('#sales_id').val();
		sales_id = checkNull(sales_id);

		var sales_fieldsz = {};
		var sales_fields = {};
		try{
			sales_fieldsz = $('#salesfield').editable('getValue').salesfield;
			for(var j in sales_fieldsz){
				sales_fields[field_id_name[j]] = sales_fieldsz[j];
			}
		}catch(e){}
		
		

		var save_params = {
			sales_id:sales_id,
			partner_id:partner_id,
			customer_id:customer_id,
			your_ref:your_ref,
			reference_contact_id:reference_contact_id,
			description:description,
			sales_date:sales_date,
			customer_name:customer_name,
			customer_number:customer_number,
			delivery_name:delivery_name,
			delivery_address1:address1,
			delivery_address2:address2,
			delivery_zip:zip,
			delivery_city:city,
			delivery_country:company_country,
			delivery_phone:delivery_phone,
			delivery_phone_code:delivery_phone_code,
			company_email:company_email,
			company_country:company_country,
			customer_ein:customer_ein,
			due_date:due_date,
			currency_id:currency_id,
			apply_tax:apply_tax,
			from_button:from_button,
			delivery_method:delivery_method,
			sales_payment_terms:sales_payment_terms_val,
			tracking_num:tracking_num,
			warehouse_id:sls_dt.warehouse_id,
			delivery_note:delivery_note,
			our_ref:our_ref,
			bp_referrer_id:bp_referrer_id,
			all_products:all_products,
			product_lines:prod_data,
			is_scheduled_invoice:'n',
			mod:mod,
			sales_date1:sales_date1,
			zip:sales_zip,
			city:sales_city,
			address1:sales_address1,
			address2:sales_address2,
			customer_ein:customer_ein,
			sales_fields:sales_fields
		};

		localStorage.setItem('newsales',JSON.stringify(save_params));

		return save_params;
	},
	sale_action:function(frm){
		if(frm == 'draft'){
			sales_save.save(frm);
		}
		else if(frm == 'quotes'){
			sales_save.save(frm);
		}
		else if(frm == 'orders'){
			sales_save.save(frm);
		}
		else if(frm == 'invoices'){
			sales_save.save(frm);
		}
		else if(frm == 'scheduleinvoices'){
			sales_save.save(frm);
		}
		else if(frm == 'invoicesnew'){
			sales_save.save(frm);
		}
		else if(frm == 'ordersnew'){
			sales_save.save(frm);
		}
		else if(frm == 'quotesnew'){
			sales_save.save(frm);
		}
	},
	save:function(frm){
		var prms = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id
		}

		var p = sales_save.saveData();
		delete p.all_products;
		p['sales_fields'] = JSON.stringify(p['sales_fields']);

		var errmsg = '';
		if(checkNull(p.customer_id) == ''){
			errmsg += sls_td.Customer + '<br/>';
		}

		if(checkNull(p.sales_date) == ''){
			errmsg += sls_td.Salesdate;
		}

		var sales_payment_terms_val = $('#salesSalesPaymentTerms').val();
		if(checkNull(p.sales_payment_terms) == ''){
			if(sales_payment_terms_val == 'custom'){
				errmsg += sls_td.Creditdays;
			}
			else{
				errmsg += sls_td.Paymentterms;
			}			
		}

		if(p.product_lines.length > 0){
			var arr= [];
			$('#product_lines tbody tr').each(function(){
				var lkk = $(this).attr('data-line-key');
				arr.push(lkk);
			});
			var frl = sls_td.forlinenumber;
			var c = 1;
			for(var j in arr){
				var line_id = arr[j];
				var obj = {};
				var pr_id = $('#product_id_'+line_id).val();
				var pr_no =  $('#product_numberhidden_'+line_id).val();


				if(pr_id=='' || pr_id==undefined || pr_id==null){
					errmsg += sls_td.Product+' '+frl+' '+c+'<br/>';
				}
				else{
					var qty = convertIntoStandardFormat($('#qty_'+line_id).val());
					if(qty=='' || qty==undefined || qty==null || qty==0){
						errmsg += sls_td.Quantity+' '+frl+' '+c+'<br/>';
					}
					
					var unit_price = convertIntoStandardFormat($('#unit_price_'+line_id).val());
					
					if(checkNull(unit_price) == ''){
						errmsg += sls_td.UnitPrice+' '+frl+' '+c+'<br/>';
					}
					
				}
				var pr_name = $('#product_name_'+line_id).val().trim();
				if(checkNull(pr_name) == ''){
						errmsg += sls_td.Description+' '+frl+' '+c+'<br/>';
				}
				var unit_id = $('#unit_'+line_id).val().trim();
				var unit_price = $('#unit_price_'+line_id).val().trim();
				
				if(checkNull(unit_price) != ''){
					unit_price = convertIntoStandardFormat(unit_price);
				}
				else{
					unit_price = 0;
				}

				var discount =  $('#discount_amount_'+line_id).val().trim();
				if(discount!='' && discount!=undefined && discount!=null){
					discount = convertIntoStandardFormat(discount);
				}
				else{
					discount = 0;
				}

				var qty = $('#qty_'+line_id).val();
				if(qty!='' && qty!=undefined && qty!=null){
					qty = convertIntoStandardFormat(qty);
				}
				else{
					qty = 0;
				}
				var vat_level = $('#vat_level_'+line_id).val();
				if(checkNull(vat_level) == ''){
					vat_level = 0;
				}
				var a = sales_save.calLineTotal(line_id);

				var vat = a.tax;

				var gross_amount =  $('#gross_amount_'+line_id).val();

				if(gross_amount!='' && gross_amount!=undefined && gross_amount!=null){
					gross_amount = convertIntoStandardFormat(gross_amount);
				}
				else{
					gross_amount = 0;
				}

				var chckdata =  $('#fillChecklistsdata_'+line_id).val();
				var partner_list_id =  $('#partner_list_id_'+line_id).val();
				
				if(checkNull(chckdata) == '' && checkNull(partner_list_id) != '' && checkNull(partner_list_id) != '0'){
					errmsg += sls_td.Checklistoption+' '+frl+' '+c+'<br/>';
				}
				c++;
			}
		}
		else{
			errmsg += sls_td.Productlines + '<br/>';
		}
		var total_params = Object.assign(prms,p);
		if(frm == 'scheduleinvoices'){
			total_params.is_scheduled_invoice = 'y';
		}

		if(checkNull(sls_meta.task_id) != ''){
			total_params['task_id'] = sls_meta.task_id;
		}

		if(checkNull(sls_meta.order_id) != ''){
			total_params['order_id'] = sls_meta.order_id;
		}

		if(errmsg != ''){
			errmsg = sls_td.Pleasecheckthefollowingfields + '<br/>' + errmsg;
			showAlertMessage(errmsg,'error',sls_td.alertmessage);
			return ;
		}

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Sales/saveSalesDocument.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				
				var response = complet_data.response.response;

				if(frm=='draft'){
					$('#sales_id').val('');
					localStorage.removeItem('newsales');
					sales_save.showDraftMsg();
				}
				else if(frm=='quotes'){
					$('#sales_id').val(response.sales_id);
					sales_save.saveData();
					sales_save.createQuote();
				}
				else if(frm=='orders'){
					$('#sales_id').val(response.sales_id);
					sales_save.saveData();
					sales_save.createOrder();
				}
				else if(frm=='invoices'){
					$('#sales_id').val(response.sales_id);
					sales_save.saveData();
					sales_save.createInvoice();
				}
				else if(frm=='invoicesnew'){
					$('#sales_id').val(response.sales_id);
					sales_save.saveData();
					new_custom_popup2('750','popups','create_invoice',{sales_id:response.sales_id});
					return;
				}
				else if(frm=='scheduleinvoices'){
					$('#sales_id').val('');
					localStorage.removeItem('newsales');
					sales_save.showSchedMsg();
					//sales_save.createInvoice();
				}
				else if(frm == 'ordersnew'){
					$('#sales_id').val(response.sales_id);
					sales_save.saveData();
					new_custom_popup2('750','popups','create_order',{sales_id:response.sales_id});
					return;
				}
				else if(frm == 'quotesnew'){
					$('#sales_id').val(response.sales_id);
					sales_save.saveData();
					new_custom_popup2('800','popups','create_quote',{sales_id:response.sales_id});
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',sls_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',sls_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	showDraftMsg:function(){
		var no = function(){
			//redirect
			new_custom_main_page2('/'+type+'/sales/lists','sales_list','sales_list','sales_lists',{});
		};

		var yes = function(){
			customer_id = '';
			customerData = '';
			$('#salesSalesCustomerName').removeAttr('id');
			new_custom_main_page2('/'+type+'/sales/save','sales_sel','sales_sel','sales_save',{});
			return;
		};

		var msg = sls_td.$create_another_sales + '<br/>' + sls_td.$yes_no;
		showDeleteMessage(msg,sls_td.Warning,yes,no,'ui-dialog-purple',sls_td.Yes,sls_td.No);
		$('.ui-dialog-buttonset>.btn:first').removeClass('red').addClass('green');
	},
	showSchedMsg:function(){
		var no = function(){
			//redirect
			new_custom_main_page2('/'+type+'/sales/lists?scheduled_invoice=y','sales_list','sales_list','sales_lists',{});
		};

		var yes = function(){
			customer_id = '';
			customerData = '';
			$('#salesSalesCustomerName').removeAttr('id');
			new_custom_main_page2('/'+type+'/sales/save','sales_sel','sales_sel','sales_save',{});
			return;
		};

		var msg = sls_td.$create_another_sales + '<br/>' + sls_td.$yes_no;
		showDeleteMessage(msg,sls_td.Warning,yes,no,'ui-dialog-purple',sls_td.Yes,sls_td.No);
		$('.ui-dialog-buttonset>.btn:first').removeClass('red').addClass('green');
	},
	createQuote:function(){
		var a = document.createElement('div');
		var sales_id = $('#sales_id').val();
		$(a).attr('data-url',base_url + 'sales/create_quote/'+sales_id+'?from=newsales');
		$(a).attr('data-width','800px');
		show_modal(a,'popups');
	},
	createOrder:function(){
		var a = document.createElement('div');
		var sales_id = $('#sales_id').val();
		$(a).attr('data-url',base_url + 'sales/create_order/'+sales_id+'?from=newsales');
		$(a).attr('data-width','800px');
		show_modal(a,'popups');
	},
	createInvoice:function(){
		var a = document.createElement('div');
		var sales_id = $('#sales_id').val();
		$(a).attr('data-url',base_url + 'sales/create_invoice/'+sales_id+'?from=newsales');
		$(a).attr('data-width','800px');
		show_modal(a,'popups');
	},
	generateSalesField:function(data,cust_change='n'){
		
		var htmls = '';
		var values = {};
		var valuesz = [];
		var count = 0;
		
		for(var j in data){
			var docField = data[j]['CustomSalesdocField'];
			var customField = data[j]['CustomerCustomField'];

			var th_ans = '';
			if(docField.type == 'customer_customfields'){
				count++;
				var field_id = customField.custom_field;
				field_id = field_id.replace(/\s/g,'');
				field_id_name[field_id] = customField.custom_field;
				var found = 0;

				if(cust_change == 'y' && customer_id != ''){
					var saved_ans = [];
					try{
						saved_ans = customerData.CustomerCustomField.answers;
						saved_ans = JSON.parse(saved_ans);
						for(var j in saved_ans){
							for(var k in saved_ans[j]){
								var d = saved_ans[j][k];
								var field_idz = k.replace(/\s/g,'');
								if(field_idz == customField.custom_field){
									if(checkNull(d).trim() != ''){
										th_ans = d;
										found = 1;
									}
									break;							
								}
							}
						}
					}
					catch(e){

					}
				}
				else if(from_storage == 'y' && checkNull(customer_id) != '' && "sales_fields" in storage_data){
					for(var j in storage_data.sales_fields){
						var d = storage_data.sales_fields[j];
						if(j == customField.custom_field){
							th_ans = d;
							found = 1;
							break;
						}
					}
				}

				if(found == 0){
					th_ans = checkNull(customField.custom_value);
					if(customField.type=='dropdown' || customField.type=='radio' ||  customField.type=='checkbox'){
						th_ans = '';
					}
				}
				values[field_id] = th_ans;
				

				if(customField.type=='text'){
					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label><input class="m-wrap" type="text" field_name="`+customField.custom_field+`" name="`+field_id+`" placeholder="`+checkNull(customField.custom_value)+`" ></label></div>`;
					valuesz.push({field_id:field_id,th_ans:th_ans,type:'text'});
				}
				else if(customField.type=='textarea'){
					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label><textarea class="m-wrap" type="text" field_name="`+customField.custom_field+`" name="`+field_id+`" placeholder="`+checkNull(customField.custom_value)+`" ></label></div>`;
					valuesz.push({field_id:field_id,th_ans:th_ans,type:'textarea'});
				}
				else if(customField.type=='dropdown'){
					var opts = checkNull(customField.custom_value);
					if(opts!=''){
						opts = JSON.parse(opts);
					}
					else{
						opts = [];
					}

					var sel_plce = '';
					var options_html = '<option value=""></option>';
					for(var l in opts){
						var ds = opts[l];
						options_html += '<option value="'+ds.value+'">'+ds.value+'</option>';
						if(checkNull(ds.is_default)!=''){
							if(ds.is_default==1){
								sel_plce = ds.value;
							}
						}
					}

					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label><select class="m-wrap" field_name="`+customField.custom_field+`" type="text" name="`+field_id+`" placeholder="`+checkNull(sel_plce)+`" >`+options_html+`</select></label></div>`;
					valuesz.push({field_id:field_id,th_ans:th_ans,type:'dropdown'});
				}
				else if(customField.type=='radio'){
					var opts = checkNull(customField.custom_value);
					if(opts!=''){
						opts = JSON.parse(opts);
					}
					else{
						opts = [];
					}
				
					var sel_plce = '';
					var options_html = '<option value=""></option>';
					for(var l in opts){
						var ds = opts[l];
						options_html += '<option value="'+ds.value+'">'+ds.value+'</option>';
						if(checkNull(ds.is_default)!=''){
							if(ds.is_default==1){
								sel_plce = ds.value;
							}
						}
					}
					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label><select class="m-wrap" field_name="`+customField.custom_field+`" type="text" name="`+field_id+`" placeholder="`+checkNull(sel_plce)+`" >`+options_html+`</select></label></div>`;
					valuesz.push({field_id:field_id,th_ans:th_ans,type:'dropdown'});
				}
				else if(customField.type=='checkbox'){
					var opts = checkNull(customField.custom_value);
					var options = {};
					options[opts] = opts;
					var options_html = '';
					var sel_plce = '';
					
					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label>`+opts+` <input class="m-wrap" field_name="`+customField.custom_field+`" type="checkbox" value="`+opts+`" name="`+field_id+`" placeholder="`+checkNull(sel_plce)+`"></label></div>`;

					valuesz.push({field_id:field_id,th_ans:th_ans,type:'checkbox'});
					
				}
			}
			else if(docField.type == 'text'){
				count++;
				var field_id = docField.label;
				field_id = field_id.replace(/\s/g,'');
				field_id_name[field_id] = docField.label;

				var found = 0;
				var th_ans = '';
				if(from_storage == 'y' && "sales_fields" in storage_data){
					for(var j in storage_data.sales_fields){
						var d = storage_data.sales_fields[j];
						if(j == docField.label){
							th_ans = d;
							found = 1;
							break;
						}
					}
				}

				if(found == 0){
					th_ans = checkNull(docField.default_value);
				}

				values[field_id] = th_ans;
				valuesz.push({field_id:field_id,th_ans:th_ans,type:'text'});
				if(docField.readonly == 1){
					htmls += `<div class="editable-address"><p style="margin:0">`+docField.label+`</p><label><input class="m-wrap" readonly="" field_name="`+docField.label+`" type="text" name="`+field_id+`" class="" ></label></div>`;
				}
				else{
					htmls += `<div class="editable-address"><p style="margin:0">`+docField.label+`</p><label><input class="m-wrap" type="text" field_name="`+docField.label+`" name="`+field_id+`" class="" ></label></div>`;
				}	
			}
			else if(docField.type == 'contact_person'){
				count++;
				var field_id = docField.label;
				field_id = field_id.replace(/\s/g,'');
				field_id_name[field_id] = docField.label;
				var found = 0;
				var th_ans = '';
				if(from_storage == 'y' && "sales_fields" in storage_data){
					for(var j in storage_data.sales_fields){
						var d = storage_data.sales_fields[j];
						if(j == docField.label){
							th_ans = d;
							found = 1;
							break;
						}
					}
				}

				if(found == 0){
					th_ans = checkNull();
				}
				var sel_plce = '';
				var options_html = '<option value=""></option>';
				var ans_found = 0;
				for(var j in sls_dt.customer_contact){
					if(checkNull(sls_dt.customer_contact[j].name).trim() == ''){
						continue;
					}

					var v = sls_dt.customer_contact[j].name;
					if(docField.display_value == 'name'){

					}
					else if(docField.display_value == 'name_phoneno'){
						if(checkNull(sls_dt.customer_contact[j]['cellphone']) != ''){
							v += ' - ' + sls_dt.customer_contact[j]['cellphone'];
						}
					}
					else{
						if(checkNull(sls_dt.customer_contact[j]['email']) != ''){
							v += ' - ' + sls_dt.customer_contact[j]['email'];
						}
					}
					options_html += '<option class="m-wrap" value="'+v+'">'+v+'</option>';
					if(v == th_ans){
						ans_found = 1;
					}
				}

				if(ans_found == 0){
					th_ans = '';
				}
				values[field_id] = th_ans;

				valuesz.push({field_id:field_id,th_ans:th_ans,type:'select'});
				htmls += `<div class="editable-address"><p style="margin:0">`+docField.label+`</p><label><select class="m-wrap" field_name="`+docField.label+`" name="`+field_id+`" placeholder="`+checkNull(docField.default_value)+`" >`+options_html+`</select></label></div>`;
			}
			else if(docField.type == 'date'){
				count++;
				var field_id = docField.label;
				field_id = field_id.replace(/\s/g,'');
				field_id_name[field_id] = docField.label;
				var found = 0;
				var th_ans = '';
				if(from_storage == 'y' && "sales_fields" in storage_data){
					for(var j in storage_data.sales_fields){
						var d = storage_data.sales_fields[j];
						if(j == docField.label){
							th_ans = d;
							found = 1;
							break;
						}
					}
				}

				if(found == 0){
					th_ans = checkNull(docField.default_value);
				}
				values[field_id] = th_ans;
				valuesz.push({field_id:field_id,th_ans:th_ans,type:'text'});
				htmls += `<div class="editable-address"><p style="margin:0">`+docField.label+`</p><label><input class="m-wrap" field_name="`+docField.label+`" type="text" data-type="date"  name="`+field_id+`" class="" ></label></div>`;
			}
		}

		if(count == 0){
			return;
		}

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Salefield = function (options) {
		        this.init('salefield', options, Salefield.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Salefield, $.fn.editabletypes.abstractinput);

		    $.extend(Salefield.prototype, {
		     
		        render: function() {
	           		this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		            this.$select.select2({
		             	allowClear:true,
		            	placeholder:sls_td.Select
		            });
		            this.$all  = this.$tpl.find('input,select');
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }		        
		           	var html = '';
		           	console.log('value',value);
		        	
		           	for(var j in value){
		           		var v = value[j];
			        	if(checkNull(v).trim() == ''){
			        		v = sls_td.Empty;
			        	}
		           		html += '<div class="control-group"><label class="control-label" style="color:#000;">'+field_id_name[j]+'</label><div class="controls">'+v+'</div></div>';
		           	}
		            
		            $(element).html(html); 
		        },
		        html2value: function(html) {        
		          return null;  
		        },		      
		       	value2str: function(value) {
		           var str = '';
		           	if(value) {
		               	for(var k in value) {
		                   str = str + k + ':' + value[k] + ';';  
		               	}
		           	}
		           return str;
		       	}, 		       
		       	str2value: function(str) {
		           return str;
		       	},                 
		       	value2input: function(value) {
					if(!value) {
						return;
					}

					for(var k in value){
						if(this.$all.filter('[name="'+k+'"]').attr('type') == 'checkbox'){
							if(this.$all.filter('[name="'+k+'"]').val() == checkNull(value[k])){
								this.$all.filter('[name="'+k+'"]').attr('checked','checked').trigger('change');
		    				}
		    				else{
		    					this.$all.filter('[name="'+k+'"]').removeAttr('checked').trigger('change');
		    				}				
						}
						else{
							this.$all.filter('[name="'+k+'"]').val(checkNull(value[k])).trigger('change');
						}
					}
		 
		       	},           
		       input2value: function() { 
		       		var values = {};
		       		this.$all.each(function(){
		       			if(checkNull($(this).attr('name')) != ''){
		       				values[$(this).attr('name')] = $(this).val()
		       			}
		       		});
		       		console.log('values',values);
		       		return values;
		       },         
		       activate: function() {
		           $('#sales_fields').find('input[data-type="date"]').datepicker({
			   			format:sls_dt.date_format_f
			   		}).change(function(){
			   			$('.datepicker').remove();
					});
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });

		    Salefield.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: htmls,		             
		        inputclass: ''
		    });
		    $.fn.editabletypes.salefield = Salefield;
		}(window.jQuery));

		var html = '<a data-type="salefield" id="salesfield" name="salesfield"></a>';
		$('#sales_fields').html(html);

		$('#salesfield').editable({
	        url: '',
	        showbuttons:'bottom',
	        title: 'Delivery Address',
	        value: values,
	        success: function(data, config) {
 				console.log('config',config)
	        }
	    });

		return '';
	},
}
Template7.registerHelper('OurRefHelper', function (id,data){
	return sales_save.generateRef(id,data,'ourref');
});
Template7.registerHelper('YourRefHelper', function (id,data){
	return sales_save.generateRef(id,data,'yourref');
});



(function( $ ){
   	$.fn.calculateDiscount= function(line_key) {
	    $(this).blur(function (event) {
	    	var unit_price = $('#unit_price_'+line_key).val();
	    	unit_price = convertIntoStandardFormat(unit_price.trim());
	    	if(!IsNumeric(unit_price)){
				unit_price = '0';
			}

			unit_price = parseFloat(unit_price);
			var qty = $('#qty_'+line_key).val();
			qty = convertIntoStandardFormat(qty);

			qty = parseFloat(qty);
			
			

			total_amount = parseInt(qty)*parseFloat(unit_price);

			var discount_amount = $('#discount_amount_'+line_key).val();
			discount_amount = convertIntoStandardFormat(discount_amount.trim());
			if(!IsNumeric(discount_amount)){
				discount_amount = '0';
			}
			discount_amount = parseFloat(discount_amount); 
			$('#discount_amount_'+line_key).val(convertIntoLocalFormat(roundNumber(discount_amount)));

			discount_percentage =  (parseFloat(discount_amount)/parseFloat(total_amount))*parseFloat(100);
			$('#discount_'+line_key).val(convertIntoLocalFormat(roundNumber(discount_percentage)));

		});
   }; 
})( jQuery );

