
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var ssr_meta;
var ssr_dt;
var ssr_popupid = 'popups';
var ssr_td;
var search_data = {
	customer_id:'',
	our_ref:'',
	sales_date:'',
	created_date:'',

};
var sales_search = {
	start:function(popupid,metadata={}){
		ssr_popupid = popupid;
		ssr_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			from:'searchget',
			getTranslationsDataArray:['Filter','Cancel','$ser_fil','$cust_name_no','$our_ref','Sales date','Created date','Customer','Select'],
		};
		if(ssr_meta.id!=null && ssr_meta.id!=undefined && ssr_meta!=''){
			total_params.id = ssr_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Sales/getSaleList.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ssr_dt = complet_data.response.response;
				ssr_td = complet_data.response.response.translationsData;
				sales_search.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ssr_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ssr_td.Alertmessage);
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

		ssr_dt.date_format_f = date_format_f;

		ssr_dt.type = type;

		var template = document.getElementById('sales_search_template').innerHTML;
		var compiledRendered = Template7(template, ssr_dt);
		document.getElementById(ssr_popupid).innerHTML = compiledRendered;
		resizemodal(ssr_popupid);
		sales_search.bindEvents();
	},
	bindEvents:function(){
		$('#searchSalesDate').datepicker({
   			format:ssr_dt.date_format_f
   		}).change(function(){
   			$('.datepicker').remove();
   			var d = '';
   			if(checkNull($('#searchSalesDate').val()) != ''){
   				d = moment($('#searchSalesDate').datepicker('getDate')).format('YYYY-MM-DD');
   			}
   			search_data.sales_date = d;
   			
   		});

   		$('#searchCreateDate').datepicker({
   			format:ssr_dt.date_format_f
   		}).change(function(){
   			$('.datepicker').remove();
   			var d = '';
   			if(checkNull($('#searchCreateDate').val()) != ''){
   				d = moment($('#searchCreateDate').datepicker('getDate')).format('YYYY-MM-DD');
   			}
   			search_data.created_date = d;
   		});

   		var customerList = ssr_dt.customer_list;
   		var cache = {};
   		$('#searchCustomerNumber').change(function(){
   			if($(this).val() == ''){
   				search_data.customer_id = '';
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
				search_data.customer_id = data.item.id;
			},	
		});
		$('ul.ui-autocomplete').css('z-index','100000');

		$('#searchOurRef').select2({
			placeholder:ssr_td.Select,
			allowClear:true,
		}).change(function(){
			var d = '';
			if(checkNull($('#searchOurRef').val()) != ''){
				d = $('#searchOurRef').val();
			}
			search_data.our_ref = d;
		});

		$('#sales_search_save').click(function(){
			sales_search.getSaleList();
		});
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
		var tparams = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			from:'searchpost',
		};
		var total_params = Object.assign(tparams,search_data);
		if(ssr_meta.id!=null && ssr_meta.id!=undefined && ssr_meta!=''){
			total_params.id = ssr_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Sales/getSaleList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage('undefined');
		}
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				if(complet_data.response.response.sales_list.length == 1){
					var id = complet_data.response.response.sales_list[0].Sale.id;
					showProcessingImage('undefined');
					new_custom_main_page2('/'+type+'/sales/details/'+id,'sales_lists','sales_lists','sales_details',{sales_id:id});
				}
				else{
					sales_lists.generateRows(complet_data.response.response.sales_list,'search',complet_data.response.response.pagination);
				}
				
				$('#'+ssr_popupid).modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ssr_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ssr_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	}

}
Template7.registerHelper('OurRefHelper', function (id,data){
	return sales_search.generateRef(id,data,'ourref');
});