var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();

var dat_tabid;
var dat_dt;
var dat_td;
var distribution_admin_types = {
	start:function(tab_id){
		dat_tabid = tab_id;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		
			getTranslationsData:'yes',
			getTranslationsDataArray:['Distribution','Name','Common name','Description','Status','Actions','Edit','Inactive','Active','Add'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/search/getDistributionTypeAdmin.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				dat_dt = complet_data.response.response;
				dat_td = complet_data.response.response.translationsData;
				distribution_admin_types.createHtml(complet_data.response.response);
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
		dat_dt.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('distribution_admin_types_template').innerHTML;
		var compiledRendered = Template7(template, dat_dt);
		document.getElementById(dat_tabid).innerHTML = compiledRendered;
		distribution_admin_types.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
			
	},
	edit:function(id){
		new_custom_popup2(600,'popups','edit_distribution_type_admin',{id:id,from:'edit'});
	},
	add:function(){
		new_custom_popup2(600,'popups','edit_distribution_type_admin',{id:id,from:'add'});
	},
	generateList:function(data,from=''){
		console.log('data',data);
		var ret = '';
		ret += '<tr id="tax_table_tr_'+data.id+'">';
			ret += '<td>';
				ret += data.internal_name;
			ret += '</td>';

			ret += '<td>';
				ret += data.method_name;
			ret += '</td>';

			ret += '<td>';
				ret += data.description;
			ret += '</td>';

			ret += '<td class="status">';
				ret += (data.status == 0)?dat_td.Inactive:dat_td.Active;
			ret += '</td>';

			ret += '<td>';
				ret+= '<a class="btn mini blue-stripe" onclick="distribution_admin_types.edit('+data.id+')"><i class="icon-edit" ></i>&nbsp;'+dat_td.Edit+'</a>&nbsp;';
			ret +='</td>';

		ret += '</tr>';
		if(from=='append'){
			if($('#tax_table_tbody #tax_table_tr_'+data.id).length!=0){
				$('#tax_table_tbody #tax_table_tr_'+data.id).after(ret);
				$('#tax_table_tbody #tax_table_tr_'+data.id)[0].remove();
			}
			else{
				$('#tax_table_tbody').append(ret);
			}			
		}
		return ret;
	}
}



Template7.registerHelper('dtAdminTableHelper', function (data){
	return distribution_admin_types.generateList(data);
});
