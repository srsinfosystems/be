var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var cms_meta;
var cms_dt;
var cms_popupid = 'popups';
var cms_td;
var order_statuss = {};

var cm_srch_data = '';

cm_srch_data = localStorage.getItem('creditmemo_search_data');
if(checkNull(cm_srch_data) != ''){
	cm_srch_data = JSON.parse(cm_srch_data);
}
else{
	var fields = {
		credit_number:'',
		customer_id:'',
		customer_name:'',
	};

	cm_srch_data = JSON.stringify({fields:fields,sort:[ 0, "desc" ]});
	localStorage.setItem('creditmemo_search_data',cm_srch_data);
	cm_srch_data = JSON.parse(cm_srch_data);
}

var creditmemo_search = {
	start:function(popupid,metadata={}){
		cms_popupid = popupid;
		cms_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Filter','Cancel','$ser_fil','$cust_name_no','Credit number','Customer','Filter','Cancel'],
		};
		if(cms_meta.id!=null && cms_meta.id!=undefined && cms_meta!=''){
			total_params.id = cms_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Invoices/getCreditMemoSearch.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				cms_dt = complet_data.response.response;
				cms_td = complet_data.response.response.translationsData;
				creditmemo_search.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',cms_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',cms_td.Alertmessage);
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

		cms_dt.date_format_f = date_format_f;

		var template = document.getElementById('creditmemo_search_template').innerHTML;
		var compiledRendered = Template7(template, cms_dt);
		document.getElementById(cms_popupid).innerHTML = compiledRendered;
		creditmemo_search.bindEvents();
		resizemodal(cms_popupid);
	},
	bindEvents:function(){

   		var customerList = cms_dt.customer_list;
   		var cache = {};
   		$('#searchCustomerNumber').change(function(){
   			if($(this).val() == ''){
   				cm_srch_data.fields.customer_id = '';
   				creditmemo_search.updateStorage();
   			}
   			else{
   				cm_srch_data.fields.customer_name = $(this).val();
   				creditmemo_search.updateStorage();
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
				cm_srch_data.fields.customer_id = data.item.id;
				creditmemo_search.updateStorage();
			},	
		});
		$('ul.ui-autocomplete').css('z-index','100000');

		if(checkNull(cm_srch_data.fields.customer_id) != ''){
			for(var j in customerList){
				if(customerList[j].id == cm_srch_data.fields.customer_id){
					$('#searchCustomerNumber').val(customerList[j].value);
				}
			}
		}

		$('#searchCreditNumber').change(function(){
			cm_srch_data.fields.credit_number = $('#searchCreditNumber').val();
			creditmemo_search.updateStorage();
		});
		if(checkNull(cm_srch_data.fields.credit_number) != ''){
			$('#searchCreditNumber').val(cm_srch_data.fields.credit_number).trigger('change');
		}

		$('#creditmemo_search_save').click(function(){
			$('#'+cms_popupid).modal('hide');
			credit_memo_list.start({from:'search'});
			//creditmemo_search.getSaleList();
		});

		
		$('.creditmemo_search').keypress(function(e){
			if(e.keyCode == 13){
				$('input,select').trigger('change');
				$('#creditmemo_search_save').trigger('click');
			}
		});
	},
	updateStorage:function(){
		localStorage.setItem('creditmemo_search_data',JSON.stringify(cm_srch_data));
	},

}