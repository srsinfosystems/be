var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var qs_meta;
var qs_dt;
var qs_popupid = 'popups';
var qs_td;

if(localStorage.getItem('quote_search_data') != null){
	var d = localStorage.getItem('quote_search_data');
	var a = {};
	if(checkNull(d) != ''){
		a = JSON.parse(d);
	}
	else{
		a = {
			fields:{
				customer_id:'',
				our_ref:'',
				quote_number:'',
				quote_status:'',
			},
			sort:['id','DESC']
		};

	}
}
else{
	a = {
		fields:{
			customer_id:'',
			our_ref:'',
			quote_number:'',
			quote_status:'',
		},
		sort:['id','DESC']
	};
}
var quote_search_data = a;
localStorage.setItem('quote_search_data',JSON.stringify(quote_search_data));

var quoteStatus = {};

var quotes_search = {
	start:function(popupid,metadata={}){
		qs_popupid = popupid;
		qs_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			from:'searchget',
			page:1,

			getTranslationsDataArray:['Filter','Cancel','$ser_fil','$cust_name_no','$our_ref','Sales date','Created date','Customer','Select','Quote number','Sent to customer','Accepted','Declined','Expired','Retract','Cancelled','Quote status'],
		};
		var quote_srch_data = localStorage.getItem('quote_search_data');
		if(checkNull(quote_srch_data) != ''){
			quote_srch_data = JSON.parse(quote_srch_data);
			
			var sort = quote_srch_data.sort;
			total_params['sort'] = sort[0];
			total_params['direction'] = sort[1];

		}
		if(qs_meta.id!=null && qs_meta.id!=undefined && qs_meta!=''){
			total_params.id = qs_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/getQuoteList.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				qs_dt = complet_data.response.response;
				qs_td = complet_data.response.response.translationsData;
				quotes_search.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',qs_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qs_td.Alertmessage);
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

		qs_dt.date_format_f = date_format_f;

		qs_dt.type = type;
		quoteStatus = {
			2:ql_td.Senttocustomer,
			3:ql_td.Accepted,
			4:ql_td.Declined,
			5:ql_td.Expired,
			6:ql_td.Retract,
			7:ql_td.Cancelled
		};
		qs_dt.quoteStatus = quoteStatus;

		var template = document.getElementById('quotes_search_template').innerHTML;
		var compiledRendered = Template7(template, qs_dt);
		document.getElementById(qs_popupid).innerHTML = compiledRendered;
		resizemodal(qs_popupid);
		quotes_search.bindEvents();
	},
	bindEvents:function(){

   		var customerList = qs_dt.customer_list;
   		var cache = {};
   		$('#searchCustomerNumber').change(function(){
   			if($(this).val() == ''){
   				quote_search_data.fields.customer_id = '';
   				quotes_search.updateStorage();
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
				quote_search_data.fields.customer_id = data.item.id;
				quotes_search.updateStorage();
			},	
		});
		$('ul.ui-autocomplete').css('z-index','100000');

		if(checkNull(quote_search_data.fields.customer_id) != ''){
			for(var j in customerList){
				if(customerList[j].id == quote_search_data.fields.customer_id){
					$('#searchCustomerNumber').val(customerList[j].value);
				}
			}
		}

		$('#searchOurRef').select2({
			placeholder:qs_td.Select,
			allowClear:true,
		}).change(function(){
			var d = '';
			if(checkNull($('#searchOurRef').val()) != ''){
				d = $('#searchOurRef').val();
			}
			quote_search_data.fields.our_ref = d;
			quotes_search.updateStorage();
		});

		if(checkNull(quote_search_data.fields.our_ref) != ''){
			$('#searchOurRef').val(quote_search_data.fields.our_ref).trigger('change');
		}


		$('#searchQuoteStatus').select2({
			placeholder:qs_td.Select,
			allowClear:true,
		}).change(function(){
			var d = '';
			if(checkNull($('#searchQuoteStatus').val()) != ''){
				d = $('#searchQuoteStatus').val();
			}
			quote_search_data.fields.quote_status = d;
			quotes_search.updateStorage();
		});
		if(checkNull(quote_search_data.fields.quote_status) != ''){
			$('#searchQuoteStatus').val(quote_search_data.fields.quote_status).trigger('change');
		}

		$('#searchQuoteNumber').change(function(){
			quote_search_data.fields.quote_number = $('#searchQuoteNumber').val();
			quotes_search.updateStorage();
		});

		if(checkNull(quote_search_data.fields.quote_number) != ''){
			$('#searchQuoteNumber').val(quote_search_data.fields.quote_number).trigger('change');
		}

		$('#quotes_search_save').click(function(){
			quotes_search.getSaleList();
		});

		$('.quote_search').keypress(function(e){
			if(e.keyCode == 13){
				$('input,select').trigger('change');
				$('#quotes_search_save').trigger('click');
			}
		});
	},
	updateStorage:function(){
		localStorage.setItem('quote_search_data',JSON.stringify(quote_search_data));
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
			page:1
		};
		var total_params = Object.assign(tparams,quote_search_data.fields);
		if(qs_meta.id!=null && qs_meta.id!=undefined && qs_meta!=''){
			total_params.id = qs_meta.id;
		}
		var quote_srch_data = localStorage.getItem('quote_search_data');
		if(checkNull(quote_srch_data) != ''){
			quote_srch_data = JSON.parse(quote_srch_data);
			
			var sort = quote_srch_data.sort;
			total_params['sort'] = sort[0];
			total_params['direction'] = sort[1];

		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/getQuoteList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage('undefined');
		}
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				if(complet_data.response.response.quotes_list.length == 1){
					var id = complet_data.response.response.quotes_list[0].Quote.id;
					showProcessingImage('undefined');
					
					new_custom_main_page2('/'+type+'/quotes/quote_details/'+id,'quotes_list','quotes_list','quote_details',{quote_id:id});
				}
				else{
					quote_lists.generateRows(complet_data.response.response.quotes_list,'search',complet_data.response.response.pagination);
				}
				
				$('#'+qs_popupid).modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',qs_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qs_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	}

}
Template7.registerHelper('OurRefHelper', function (id,data){
	return quotes_search.generateRef(id,data,'ourref');
});