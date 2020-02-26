var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();

var adl_tabid;
var adl_dt;
var adl_td;
var admin_tax_levels = {
	start:function(tab_id){
		adl_tabid = tab_id;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		
			getTranslationsData:'yes',
			getTranslationsDataArray:['General','Dashboard','Tax levels','Add tax','Name','Percentage','Valid from','Actions','Code','Description','Edit'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getAdminTaxLevels.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				adl_dt = complet_data.response.response;
				adl_td = complet_data.response.response.translationsData;
				admin_tax_levels.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		adl_dt.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('admin_tax_levels_template').innerHTML;
		var compiledRendered = Template7(template, adl_dt);
		document.getElementById(adl_tabid).innerHTML = compiledRendered;
		admin_tax_levels.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
			
	},
	edit:function(id){
		new_custom_popup2(600,'popups','add_percentage',{id:id});
	},
	generateList:function(data,from=''){
		var adt = data['AdminTaxLevel'];
		var perc = data[0];
		var ret = '';
		ret += '<tr id="tax_table_tr_'+adt.id+'">';
			ret += '<td>';
				ret += adt.code;
			ret += '</td>';

			ret += '<td>';
				if(lang == 'en'){
					ret += adt.en_description;
				}
				else{
					ret += adt.nb_description;
				}
			ret += '</td>';

			ret += '<td>';
				ret += convertDateIntoSiteFormat(perc.valid_from);
			ret += '</td>';

			ret += '<td>';
				ret += perc.percentage;
			ret += '</td>';

			ret += '<td>';
				ret+= '<a class="btn mini blue-stripe" onclick="admin_tax_levels.edit('+adt.id+')"><i class="icon-edit" ></i>&nbsp;'+adl_td.Edit+'</a>&nbsp;';
			ret +='</td>';

		ret += '</tr>';
		if(from=='append'){
			if($('#tax_table_tbody #tax_table_tr_'+adt.id).length!=0){
				$('#tax_table_tbody #tax_table_tr_'+adt.id).after(ret);
				$('#tax_table_tbody #tax_table_tr_'+adt.id)[0].remove();
				
			}
			else{
				$('#tax_table_tbody').append(ret);
			
			}			
		}
		return ret;
	}
}



Template7.registerHelper('adlTableHelper', function (data){
	return admin_tax_levels.generateList(data);
});
