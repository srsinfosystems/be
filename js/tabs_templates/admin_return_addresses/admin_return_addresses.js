var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();

var global_adminra_tab_id;
var global_adminra_data;
var global_adminra_td;
var admin_return_addresses = {
	start:function(tab_id){
		global_adminra_tab_id = tab_id;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		
			getTranslationsData:'yes',
			getTranslationsDataArray:['General','Dashboard','Return addresses','Add address','No return address found','Name','Address1','Address2','Zip','City','Actions','Edit','Delete','Are you sure you would like to delete this address','Warning','Cancel'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getAdminReturnAddresses.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				global_adminra_data = complet_data.response.response;
				global_adminra_td = complet_data.response.response.translationsData;
				admin_return_addresses.createHtml(complet_data.response.response);
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
		global_adminra_data.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('admin_return_addresses_template').innerHTML;
		var compiledRendered = Template7(template, global_adminra_data);
		document.getElementById(global_adminra_tab_id).innerHTML = compiledRendered;
		admin_return_addresses.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
			
	},
	edit:function(id){
		new_custom_popup2(600,'popups','add_return_address',{id:id});
	},
	delete:function(id){
		var yes = function(){
			showProcessingImage('undefined');
			var total_params = {
				APISERVER:APISERVER,
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				id:id
			};
			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Commons/deleteAdminReturnAddresses.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					if(complet_data.response.response){
						$('#ret_addr_tr_'+id).remove();
						if($('#ret_addr_tbody').length==1){
							$('#ret_addr_empty_tr').show();
						}
					}
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
						showAlertMessage(complet_data.response.response.msg,'error',global_adminra_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		}
		var no = function(){
			
		}
		showDeleteMessage(global_adminra_td.Areyousureyouwouldliketodeletethisaddress+'?',global_adminra_td.Warning,yes,no,'ui-dialog-blue',global_adminra_td.Delete,global_adminra_td.Cancel);

		
	},
	generateAddrList:function(data,from=''){
		
		var ret = '';
		ret += '<tr id="ret_addr_tr_'+data.id+'">';
			ret += '<td>';
				ret += data.name;
			ret += '</td>';

			ret += '<td>';
				ret += data.address1;
			ret += '</td>';

			ret += '<td>';
				ret += data.address2;
			ret += '</td>';

			ret += '<td>';
				ret += data.zip;
			ret += '</td>';

			ret += '<td>';
				ret += data.city;
			ret += '</td>';



			ret += '<td>';
				ret+= '<a class="btn mini blue-stripe" onclick="admin_return_addresses.edit('+data.id+')"><i class="icon-edit" ></i>&nbsp;'+global_adminra_td.Edit+'</a>&nbsp;';
				ret+= '<a class="btn mini red-stripe" onclick="admin_return_addresses.delete('+data.id+')"><i class="icon-edit"></i>&nbsp;'+global_adminra_td.Delete+'</a>';
			ret +='</td>';

		ret += '</tr>';
		if(from=='append'){
			if($('#ret_addr_tbody #ret_addr_tr_'+data.id).length!=0){
				$('#ret_addr_tbody #ret_addr_tr_'+data.id).after(ret);
				$('#ret_addr_tbody #ret_addr_tr_'+data.id)[0].remove();
				$('#ret_addr_empty_tr').hide();
			}
			else{
				$('#ret_addr_tbody').append(ret);
				$('#ret_addr_empty_tr').hide();
			}			
		}
		return ret;
	}
}



Template7.registerHelper('partnerRetAddrTableHelper', function (data){
	return admin_return_addresses.generateAddrList(data);
});
