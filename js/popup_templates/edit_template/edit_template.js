var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var staffer_id = $('#staffer_id').val();
var type = $('#type').val();

var et_meta;
var et_dt;
var et_popid = 'popups';
var et_td;
var glkey=0;
var settimeoutarr = [];
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var edit_template = {
	start:function(popupid,metadata={}){
		et_popid = popupid;
		et_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			sales_id:et_meta.sales_id,
			type:type,
			mail:et_meta.from,
			getTranslationsDataArray:['Save','Cancel','Email template','Custom from address','Send','Please check the following fields','Success','Back','Norwegian Subject','HTML Text','Placeholders','Partner','Name'],
		};
		if( checkNull(et_meta.sales_id) !=''){
			total_params.sales_id = et_meta.sales_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Invoices/getInvoiceEmailTemplate.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){

				et_dt = complet_data.response.response;
				et_td = complet_data.response.response.translationsData;
				edit_template.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',et_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',et_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('edit_template_template').innerHTML;
		et_dt['meta'] = {lang:lang};
		et_dt['et_meta'] = et_meta;

		et_dt['partner_mail'] = et_dt[0];
		console.log(et_dt['partner_mail']);
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		et_dt.date_format_f = date_format_f;

		var compiledRendered = Template7(template, et_dt);
		document.getElementById(et_popid).innerHTML = compiledRendered;
		resizemodal(et_popid);
		edit_template.bindEvents();
	},
	bindEvents:function(){
		$('#nb_body').wysihtml5();
		$('.uni').uniform();
		$('#isCustomEmail').change(function(){
			var chckd = $('#isCustomEmail:checked').length;
			if(chckd){
				$('#show_from_address').show();
			}
			else{
				$('#show_from_address').hide();
			}
		});
	},
	generatePlaceholdersEmailList:function(category,name){
		var ret = '<li><a class="cat-header">'+category+'</a></li>';
		for(var j in name){
			ret += '<li><a data-wysihtml5-command="insertHTML" data-wysihtml5-command-value="'+name[j].placeholder+'" tabindex="-1">'+name[j].value+'</a></li>';
		}
		return ret;
	},
	send:function(){
		var save_params = {
			is_custom_email:$('#isCustomEmail:checked').length,
			distribution:'email',
			mail_from:$('#mail_from').val(),
			nb_subject:$('#nb_subject').val(),
			nb_body:$('iframe.wysihtml5-sandbox').contents().find('.wysihtml5-editor').html(),
			en_subject:et_dt['partner_mail'].PartnerMail.en_subject,
			nb_body_text:et_dt['partner_mail'].PartnerMail.nb_body_text,
			en_body:et_dt['partner_mail'].PartnerMail.en_body
		};

		if(et_meta.from == 'INVOICE'){
			create_invoice.save(save_params);
		}
		else if(et_meta.from == 'QUOTE_VERIFICATION'){
			create_quote.saveData(save_params);
		}
		else if(et_meta.from == 'ORDER_CONFIRMATION' || et_meta.from == 'ORDER_ACCEPTANCE'){
			create_order.saveData(save_params);
		}
		
	}
	
}


Template7.registerHelper('placeholdersEmailListHelper', function (category,name){
	return edit_template.generatePlaceholdersEmailList(category,name);
});