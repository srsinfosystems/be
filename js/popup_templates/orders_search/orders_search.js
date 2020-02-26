var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var os_meta;
var os_dt;
var os_popupid = 'popups';
var os_td;
var order_statuss = {};

var ord_srch_data = '';

ord_srch_data = localStorage.getItem('order_search_data');
if(checkNull(ord_srch_data) != ''){
	ord_srch_data = JSON.parse(ord_srch_data);
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

	ord_srch_data = JSON.stringify({fields:fields,sort:[ 0, "desc" ]});
	localStorage.setItem('order_search_data',ord_srch_data);
	ord_srch_data = JSON.parse(ord_srch_data);
}



var orders_search = {
	start:function(popupid,metadata={}){
		os_popupid = popupid;
		os_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			from:'searchget',
			getTranslationsDataArray:['Filter','Cancel','Order number','$ser_fil','$cust_name_no','$our_ref','Sales date','Created date','Customer','Select','Quote number','Sent to customer','Accepted','Declined','Open','Processing','Delivered','Cancelled','Warning','Quote status','Order status','Search from Quote number'],
		};
		if(os_meta.id!=null && os_meta.id!=undefined && os_meta!=''){
			total_params.id = os_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Orders/getOrderSearch.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				os_dt = complet_data.response.response;
				os_td = complet_data.response.response.translationsData;
				orders_search.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',os_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',os_td.Alertmessage);
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

		os_dt.date_format_f = date_format_f;

		if(checkNull(os_dt.getAllOrderStatusList) != ''){
			order_statuss = os_dt.getAllOrderStatusList;
			delete order_statuss[1];
		}
		else{
			order_statuss = {
				1:'',
				2:os_dt.Senttocustomer,
				3:os_dt.Accepted,
				4:os_dt.Declined,
				5:os_dt.Open,
				6:os_dt.Processing,
				7:os_dt.Delivered,
				8:os_dt.Cancelled
			};
		}
		os_dt.order_statuss = order_statuss;
		os_dt.type = type;
		var template = document.getElementById('orders_search_template').innerHTML;
		var compiledRendered = Template7(template, os_dt);
		document.getElementById(os_popupid).innerHTML = compiledRendered;
		resizemodal(os_popupid);
		orders_search.bindEvents();
	},
	bindEvents:function(){

   		var customerList = os_dt.customer_list;
   		var cache = {};
   		$('#searchCustomerNumber').change(function(){
   			if($(this).val() == ''){
   				ord_srch_data.fields.customer_id = '';
   				orders_search.updateStorage();
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
				ord_srch_data.fields.customer_id = data.item.id;
				orders_search.updateStorage();
			},	
		});
		$('ul.ui-autocomplete').css('z-index','100000');

		if(checkNull(ord_srch_data.fields.customer_id) != ''){
			for(var j in customerList){
				if(customerList[j].id == ord_srch_data.fields.customer_id){
					$('#searchCustomerNumber').val(customerList[j].value);
				}
			}
		}

		$('#searchOurRef').select2({
			placeholder:os_td.Select,
			allowClear:true,
		}).change(function(){
			var d = '';
			if(checkNull($('#searchOurRef').val()) != ''){
				d = $('#searchOurRef').val();
			}
			ord_srch_data.fields.our_ref = d;
			orders_search.updateStorage();
		});

		if(checkNull(ord_srch_data.fields.our_ref) != ''){
			$('#searchOurRef').val(ord_srch_data.fields.our_ref).trigger('change');
		}


		$('#searchOrderStatus').select2({
			placeholder:os_td.Select,
			allowClear:true,
		}).change(function(){
			var d = '';
			if(checkNull($('#searchOrderStatus').val()) != ''){
				d = $('#searchOrderStatus').val();
			}
			ord_srch_data.fields.order_status = d;
			orders_search.updateStorage();
		});
		if(checkNull(ord_srch_data.fields.order_status) != ''){
			$('#searchOrderStatus').val(ord_srch_data.fields.order_status).trigger('change');
		}

		$('#searchOrderNumber').change(function(){
			ord_srch_data.fields.order_number = $('#searchOrderNumber').val();
			orders_search.updateStorage();
		});
		if(checkNull(ord_srch_data.fields.order_number) != ''){
			$('#searchOrderNumber').val(ord_srch_data.fields.order_number).trigger('change');
		}

		$('#orders_search_save').click(function(){
			orders_search.getSaleList();
		});

		$('#searchQuoteNumber').change(function(){
			ord_srch_data.fields.quote_number = $('#searchQuoteNumber').val();
			orders_search.updateStorage();
		});
		if(checkNull(ord_srch_data.fields.quote_number) != ''){
			$('#searchQuoteNumber').val(ord_srch_data.fields.quote_number).trigger('change');
		}

		if(checkNull(ord_srch_data.fields.show_quote_number) != ''){
			$('#orderSearchNumber').prop('checked','checked');
		}
		else{
			$('#orderSearchNumber').removeAttr('checked');
		}

		$('#orderSearchNumber').uniform().change(function(){
			var v = $('#orderSearchNumber:checked').length;
			if(v == 1){
				ord_srch_data.fields.show_quote_number = 1;
				orders_search.updateStorage();
				$('.qut_no_w').show();
			}
			else{
				ord_srch_data.fields.show_quote_number = '';
				orders_search.updateStorage();
				$('.qut_no_w').hide();
				$('#searchQuoteNumber').val('').trigger('change');
			}
		}).trigger('change');
		$('.order_search').keypress(function(e){
			if(e.keyCode == 13){
				$('input,select').trigger('change');
				$('#orders_search_save').trigger('click');
			}
		});
	},
	updateStorage:function(){
		localStorage.setItem('order_search_data',JSON.stringify(ord_srch_data));
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
	getSaleList:function(){
		showProcessingImage('undefined');
		var fields = ['Order.id','Order.order_number','Quote.quote_number','Order.created','Order.status','Order.customer_id','Order.customer_name'];
		var tparams = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			fields:JSON.stringify(fields),
		};
		var total_params = Object.assign(tparams,ord_srch_data.fields);
		if(os_meta.id!=null && os_meta.id!=undefined && os_meta!=''){
			total_params.id = os_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Orders/getOrderList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage('undefined');
		}
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				// if(complet_data.response.response.getOrdersList.ordersList.length == 1){
				// 	var id = complet_data.response.response.getOrdersList.ordersList.ordersList[0].order.id;
				// 	showProcessingImage('undefined');
				// 	window.location.href = base_url + 'quotes/quote_details/'+id;
				// 	//new_custom_main_page2('/'+type+'/sales/details/'+id,'sales_lists','sales_lists','sales_details',{sales_id:id});
				// }
				// else{
					order_lists.generateRows(complet_data.response.response.getOrdersList.ordersList,'search',complet_data.response.response.getOrdersList.pagination);
				// }
				
				$('#'+os_popupid).modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',os_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',os_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	}

}
Template7.registerHelper('OurRefHelper', function (id,data){
	return orders_search.generateRef(id,data,'ourref');
});