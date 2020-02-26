var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();

var ap_meta;
var ap_dt;
var ap_popid = 'popups';
var ap_td;
var glkey=0;

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var add_percentage = {
	start:function(popupid,metadata={}){
		ap_popid = popupid;
		ap_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Add levels','Code','Description','Percentage','Valid from','Please correct the form','Alert message','Add','Actions','Remove'],
		};
		if(ap_meta.id!=null && ap_meta.id!=undefined && ap_meta!=''){
			total_params.id = ap_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getPartnerTaxPercentage.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ap_dt = complet_data.response.response;
				ap_td = complet_data.response.response.translationsData;
				add_percentage.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ap_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ap_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		var template = document.getElementById('add_percentage_template').innerHTML;
		ap_dt['meta'] = {lang:lang};
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		ap_dt.date_format_f = date_format_f;

		var compiledRendered = Template7(template, ap_dt);
		document.getElementById(ap_popid).innerHTML = compiledRendered;
		resizemodal(ap_popid);
		add_percentage.bindEvents();
	},
	bindEvents:function(){
		add_percentage.generatePercList();
		$('#add_percentage_save').click(function(){
			add_percentage.saveData();
		});
	},
	generatePercList:function(){
		var d = ap_dt.admin_tax_levels.AdminTaxLevelPercentage;
		if(d.length != 0){
			for(var j in d){

				var html = '<tr data-id="'+glkey+'">';
					html += '<td>';
						html += checkNull(d[j].percentage);
					html += '<td>';
						html += convertDateIntoSiteFormat(checkNull(d[j].valid_from));
					html += '<td></td>';
				html += '</tr>';
				$('#perc_tbody').append(html);
			}
		}
		else{
			
			add_percentage.generateRow();
			
		}
		
	},
	generateRow:function(){
		glkey++;
		var html = '<tr data-id="'+glkey+'" data-primary-key="0">';
			html += '<td>';
				html += '<input name="percentage" class="m-wrap span12 percentage" value="" placeholder="'+ap_td.Percentage+'" id="percentage" type="text">';
			html += '</td>';
			html += '<td>';
				html += '<input name="valid_from" class="m-wrap span12 valid_from" value="" placeholder="'+ap_td.Validfrom+'" id="valid_from" type="text">';
			html += '</td>';
			html += '<td><a class="btn mini red-stripe del_row"  href="javascript:;" onclick="$(this).parent().parent().remove();"><i class="icon-remove"></i> '+ap_td.Remove+'</a></td>';

		html += '</tr>';

		$('#perc_tbody').append(html);
		$('tr[data-id="'+glkey+'"] .valid_from').datepicker({
   			format:ap_dt.date_format_f,
   			//startDate:moment().format()
   		}).change(function(){
   			$('.datepicker').remove();
   		});
		return html;
	},
	saveData:function(){
		var params = [];
		var brk = 0;
		$('#perc_tbody tr[data-primary-key=0]').each(function(){
			var perc = $(this).find('.percentage').val();
			var valid_from = moment($(this).find('.valid_from').datepicker('getDate')).format('YYYY-MM-DD hh:mm:ss');
			if(checkNull(perc) == '' || checkNull(valid_from) == ''){
				showAlertMessage(ap_td.Pleasecorrecttheform,'error',ap_td.AlertMessage);
				brk = 1
				return false;
			}
			params.push({admin_tax_level_id:ap_dt.admin_tax_levels.AdminTaxLevel.id,percentage:perc,valid_from:valid_from,});
		});
		if(brk == 1){
			return;
		}

		if(params.length == 0){
			$('#'+ap_popid).modal('hide');
			return;
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			percentage:params
		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/addPartnerTaxPercentage.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				$('#'+ap_popid).modal('hide');
				$('#tax_table_tbody').html('')
				for(var j in complet_data.response.response.admin_tax_levels){
					var d =  complet_data.response.response.admin_tax_levels[j];
					admin_tax_levels.generateList(d,'append');
				}
				call_toastr('success', ap_td.Success,complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ap_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ap_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	}

}