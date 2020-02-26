var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var type = $('#type').val();
var cs_meta;
var cs_dt;
var cs_popupid = 'popups';
var cs_td;
var order_statuss = {};

var cust_srch_data = '';

cust_srch_data = localStorage.getItem('customers_search_data');
if(checkNull(cust_srch_data) != ''){
	cust_srch_data = JSON.parse(cust_srch_data);
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
	
	cust_srch_data = JSON.stringify({fields:fields,sort:[ 0, 'DESC' ]});
	localStorage.setItem('customers_search_data',cust_srch_data);
	cust_srch_data = JSON.parse(cust_srch_data);
}

var customers_search = {
	start:function(popupid,metadata={}){
		cs_popupid = popupid;
		cs_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Filter','Cancel','Invoice number','$ser_fil','$cust_name_no','$our_ref','Sales date','Created date','Customer','Select','Status','$our_ref','Unpaid','Paid','Loss','Scheduled','All','Customer name','Customer number','Customer type','Customer group','All','Phone Number','$email','Active','Inactive'],
		};
		if(cs_meta.id!=null && cs_meta.id!=undefined && cs_meta!=''){
			total_params.id = cs_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerSearch.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				cs_dt = complet_data.response.response;
				cs_td = complet_data.response.response.translationsData;
				customers_search.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cs_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cs_td.Alertmessage);
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

		cs_dt.date_format_f = date_format_f;
		cs_dt.type = type;
		invoice_statuss = {
			unpaid:cs_td.Unpaid,
			paid:cs_td.Paid,
			loss:cs_td.Loss,
			scheduled:cs_td.Scheduled,
			all:cs_td.All
		};
		
		cs_dt.invoice_statuss = invoice_statuss;

		var template = document.getElementById('customers_search_template').innerHTML;
		var compiledRendered = Template7(template, cs_dt);
		document.getElementById(cs_popupid).innerHTML = compiledRendered;
		resizemodal(cs_popupid);
		customers_search.bindEvents();
	},
	bindEvents:function(){

		$('#searchCustomername').change(function(){
			cust_srch_data.fields.customer_name = $(this).val();
			customers_search.updateStorage();
		});

		if(checkNull(cust_srch_data.fields.customer_name) != ''){
			$('#searchCustomername').val(cust_srch_data.fields.customer_name);
		}

		$('#searchCustomernumber').change(function(){
			cust_srch_data.fields.customer_number = $(this).val();
			customers_search.updateStorage();
		});
		if(checkNull(cust_srch_data.fields.customer_number) != ''){
			$('#searchCustomernumber').val(cust_srch_data.fields.customer_number);
		}

		$('#searchCustomergroup').select2();
		if(checkNull(cust_srch_data.fields.customer_groups) != ''){
			var selectedValues = JSON.parse(cust_srch_data.fields.customer_groups);
			 $("#searchCustomergroup").select2('val', selectedValues);
		}
		else{
			$('#searchCustomergroup').select2("val",0).trigger('cha');
		}
		$('#searchCustomergroup').change(function(){
			if($(this).val() == '0'){
				$(this).val('');
				$('#searchCustomergroup option:first').prop('disabled',true).addClass('hidden_class');
				$('#searchCustomergroup option:first').attr('hidden', 'hidden');
				$('#searchCustomergroup option').prop('disabled',true);		
			}else{
				$('#searchCustomergroup option').prop('disabled',false);
				var arrValues = $(this).val();
				if(arrValues !== null){
					if(arrValues.indexOf('0') == -1){
						$('#searchCustomergroup option:first').prop('disabled',true).addClass('hidden_class');
						$('#searchCustomergroup option:first').attr('hidden', 'hidden');
					}
				}else{
					$('#searchCustomergroup option:first').prop('disabled',false).removeClass('hidden_class');
					$('#searchCustomergroup option:first').attr('hidden', '');
				}		
			}	

			var v = $(this).val();
			if(checkNull(v) != ''){
				v = JSON.stringify(v);
			}
			else{
				v = '';
			}
			cust_srch_data.fields.customer_groups = v;
			customers_search.updateStorage();
		});
		


		$('#searchPhonenumber').change(function(){
			cust_srch_data.fields.customer_phone_number = $(this).val();
			customers_search.updateStorage();
		});
		if(checkNull(cust_srch_data.fields.customer_phone_number) != ''){
			$('#searchPhonenumber').val(cust_srch_data.fields.customer_phone_number);
		}


		$('#searchCustomeremail').change(function(){
			cust_srch_data.fields.email = $(this).val();
			customers_search.updateStorage();
		});
		if(checkNull(cust_srch_data.fields.email) != ''){
			$('#searchCustomeremail').val(cust_srch_data.fields.email);
		}

		

		$('#searchCustomertype').select2({
			allowClear:true,
			placeholder:cs_td.Select,
		}).change(function(){
			var v =  $(this).val();
			cust_srch_data.fields.user_group_id = parseInt(v);
			customers_search.updateStorage();
		});
		if(checkNull(cust_srch_data.fields.user_group_id) != ''){
			$('#searchCustomertype').val(cust_srch_data.fields.user_group_id).trigger('change');
		}

		$('#searchCustomerstatus').select2({
			allowClear:true,
			placeholder:cs_td.Select,
		}).change(function(){
			cust_srch_data.fields.status = $(this).val();
			customers_search.updateStorage();
		});
		if(checkNull(cust_srch_data.fields.status) != ''){
			$('#searchCustomerstatus').val(cust_srch_data.fields.status).trigger('change');
		}
   		
		$('#customers_search_save').click(function(){
			customers_search.getInvoiceList();
		});

		
		$('.customers_search').keypress(function(e){
			if(e.keyCode == 13){
				$('input,select').trigger('change');
				$('#customers_search_save').trigger('click');
			}
		});
	},
	updateStorage:function(){
		localStorage.setItem('customers_search_data',JSON.stringify(cust_srch_data));
	},
	getInvoiceList:function(){
		$('#'+cs_popupid).modal('hide');
		if("all_customers" in window && typeof all_customers.start === 'function'){
			all_customers.start({from:'search'});
		}
		else{
			new_custom_main_page2('/'+type+'/customers/all_customers','all_customers','all_customers','all_customers');
			return false;
		}
	},

}