var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var type = $('#type').val();
var is_meta;
var is_dt;
var is_popupid = 'popups';
var is_td;
var order_statuss = {};

var inv_srch_data = '';

inv_srch_data = localStorage.getItem('invoice_search_data');
if(checkNull(inv_srch_data) != ''){
	inv_srch_data = JSON.parse(inv_srch_data);
}
else{
	var fields = {
		customer_id:'',
		customer_name:'',
		our_ref:'',
		status:'',
		invoice_number:''
	};

	inv_srch_data = JSON.stringify({fields:fields,sort:[ 'invoice_number', 'DESC' ]});
	localStorage.setItem('invoice_search_data',inv_srch_data);
	inv_srch_data = JSON.parse(inv_srch_data);
}

var invoice_search = {
	start:function(popupid,metadata={}){
		is_popupid = popupid;
		is_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Filter','Cancel','Invoice number','$ser_fil','$cust_name_no','$our_ref','Sales date','Created date','Customer','Select','Status','$our_ref','Unpaid','Paid','Loss','Scheduled','All','Search','KID',],
		};
		if(is_meta.id!=null && is_meta.id!=undefined && is_meta!=''){
			total_params.id = is_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Invoices/getinvoiceSearch.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				is_dt = complet_data.response.response;
				is_td = complet_data.response.response.translationsData;
				invoice_search.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',is_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',is_td.Alertmessage);
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

		is_dt.date_format_f = date_format_f;
		is_dt.type = type;
		invoice_statuss = {
			unpaid:is_td.Unpaid,
			paid:is_td.Paid,
			loss:is_td.Loss,
			scheduled:is_td.Scheduled,
			all:is_td.All
		};
		
		is_dt.invoice_statuss = invoice_statuss;

		var template = document.getElementById('invoice_search_template').innerHTML;
		var compiledRendered = Template7(template, is_dt);
		document.getElementById(is_popupid).innerHTML = compiledRendered;
		resizemodal(is_popupid);
		invoice_search.bindEvents();
	},
	bindEvents:function(){

   		var customerList = is_dt.customer_list;
   		var cache = {};
   		$('#searchCustomerNumber').change(function(){
   			if($(this).val() == ''){
   				inv_srch_data.fields.customer_id = '';
   				invoice_search.updateStorage();
   			}
   		}).autocomplete({
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
				inv_srch_data.fields.customer_id = data.item.id;
				inv_srch_data.fields.customer_name = data.item.value;
				invoice_search.updateStorage();
			},	
		});
		$('ul.ui-autocomplete').css('z-index','100000');

		if(checkNull(inv_srch_data.fields.customer_id) != ''){
			for(var j in customerList){
				if(customerList[j].id == inv_srch_data.fields.customer_id){
					$('#searchCustomerNumber').val(customerList[j].value);
				}
			}
		}

		$('#searchOurRef').select2({
			placeholder:is_td.Select,
			allowClear:true,
		}).change(function(){
			var d = '';
			if(checkNull($('#searchOurRef').val()) != ''){
				d = $('#searchOurRef').val();
			}
			inv_srch_data.fields.our_ref = d;
			invoice_search.updateStorage();
		});

		if(checkNull(inv_srch_data.fields.our_ref) != ''){
			$('#searchOurRef').val(inv_srch_data.fields.our_ref).trigger('change');
		}


		$('#searchInvoiceStatus').select2({
			placeholder:is_td.Select,
			allowClear:false,
		}).change(function(){
			var d = '';
			if(checkNull($('#searchInvoiceStatus').val()) != ''){
				d = $('#searchInvoiceStatus').val();
			}
			inv_srch_data.fields.status = d;
			invoice_search.updateStorage();
		});
		if(checkNull(inv_srch_data.fields.status) != ''){
			$('#searchInvoiceStatus').val(inv_srch_data.fields.status).trigger('change');
		}
		else{
			$('#searchInvoiceStatus').val('all').trigger('change');
		}

		$('#searchInvoiceNumber').change(function(){
			inv_srch_data.fields.invoice_number = $('#searchInvoiceNumber').val();
			invoice_search.updateStorage();
		});
		if(checkNull(inv_srch_data.fields.invoice_number) != ''){
			$('#searchInvoiceNumber').val(inv_srch_data.fields.invoice_number);
		}

		$('#invoice_search_save').click(function(){
			invoice_search.getInvoiceList();
		});

		$('#searchInvoiceKid').change(function(){
			inv_srch_data.fields.invoice_kid = $('#searchInvoiceKid').val();
			invoice_search.updateStorage();
		});
		if(checkNull(inv_srch_data.fields.invoice_kid) != ''){
			$('#searchInvoiceKid').val(inv_srch_data.fields.invoice_kid);
		}

		$('.invoice_search').keypress(function(e){
			if(e.keyCode == 13){
				$('input,select').trigger('change');
				$('#invoice_search_save').trigger('click');
			}
		});
	},
	updateStorage:function(){
		localStorage.setItem('invoice_search_data',JSON.stringify(inv_srch_data));
	},
	generateRef:function(id,data,frm){
		var ret = '';
		if(frm=='ourref'){			
			ret += '<option value="'+id+'">';
				ret += data.name +'&lt;'+data.email+'&gt;';
			ret += '</option>';
		}
		return ret;
	},
	getInvoiceList:function(){
		$('#'+is_popupid).modal('hide');
		if("invoice_lists" in window){
			invoice_lists.start({from:'search'});
		}
	},

}
Template7.registerHelper('OurRefHelper', function (id,data){
	return invoice_search.generateRef(id,data,'ourref');
});