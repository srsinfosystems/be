var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();

var it_meta;
var it_dt;
var it_ppid = 'popups';
var it_td;
var table;
var invoice_transactions = {
	start:function(popupid,metadata={}){
		it_ppid = popupid;
		it_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			quote_id:metadata.quote_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:[''],		
		};
		if(it_meta.id!=null && it_meta.id!=undefined && it_meta!=''){
			total_params.id = it_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Invoices/getInvoiceTransaction.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				it_dt = complet_data.response.response;
				it_td = complet_data.response.response.translationsData;
				invoice_transactions.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',it_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',it_td.Alertmessage);
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

		it_dt.date_format_f = date_format_f;

		var template = document.getElementById('invoice_transactions_template').innerHTML;
		var compiledRendered = Template7(template, it_dt);
		document.getElementById(it_ppid).innerHTML = compiledRendered;
		invoice_transactions.bindEvents();
		$('#'+it_ppid).resize();
	},
	bindEvents:function(){	
		invoice_transactions.generateRows(it_dt);
	},
	generateRows:function(data){


	},

}