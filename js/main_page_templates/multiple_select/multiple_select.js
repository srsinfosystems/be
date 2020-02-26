var APISERVER = $('#APISERVER').val();
var SESSION_DATA = $('#SESSION_DATA').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var language = '';
var lang = '';
var admin_id = '';
var type = '';
var login_type = $('#LOGIN_TYPE').val();

if(SESSION_DATA != undefined && SESSION_DATA != null && SESSION_DATA != ''){
	SESSION_DATA = SESSION_DATA.replace(/\'/g,'"');
	SESSION_DATA = JSON.parse(SESSION_DATA);

	admin_id = checkEmpty(SESSION_DATA.SYSTEM.admin_id);
	type = checkEmpty(SESSION_DATA.type);
	language = checkEmpty(SESSION_DATA.Config.language);
	lang = checkEmpty(SESSION_DATA.Config.lang);
}


var ms_dt;
var ms_td;
var ms_meta;
var selected_data = [];
var quoteStatus = {};
var pagelength = 10;
var multiple_select = {
	start:function(meta = {},from = ''){
		ms_meta = meta;
		ms_meta['from'] = checkNull(from);
		var total_params = {
			language:language,
			lang:lang,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['alert message','Success','$srno','Partner Name','EIN','Action','Select'],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Logins/getMultipleSelect.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ms_dt = complet_data.response.response;
				ms_td = complet_data.response.response.translationsData;
				multiple_select.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ms_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ms_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	capitalizeFirstLetter:function(string=''){
		return string.charAt(0).toUpperCase() + string.slice(1);	
	},
	createHtml:function(){
		ms_dt.login_type = checkEmpty(multiple_select.capitalizeFirstLetter(login_type),'');

		ms_td.dashboardurl = base_url+'dashboard/index';
		ms_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('multiple_select_template').innerHTML;
		var compiledRendered = Template7(template, ms_dt);
		document.getElementsByClassName('register-content')[0].innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		multiple_select.bindEvents();
	},
	bindEvents:function(){
		if(type == 'partner'){
			multiple_select.createPartnerList(ms_meta.login_data);
		}
		else{

		}
	},
	createPartnerList:function(data){
		console.log('createPartnerList',data);

		var html = '<thead class="flip-content">';
			html += '<tr>';
				html += '<td>'+ms_td.$srno+'</td>';
				html += '<td>'+ms_td.PartnerName+'</td>';
				html += '<td>'+ms_td.EIN+'</td>';
				html += '<td>'+ms_td.Action+'</td>';
			html += '</tr>';
		html += '</thead>';

		html += '<tbody>';
			var c = 0;
			for(var j in data){
				html += '<tr class="odd gradeX">';
					html += '<td>'+ ++c +'</td>';
					html += '<td>'+ checkEmpty(data[j].Partner.partner_name) +'</td>';
					html += '<td>'+ checkEmpty(data[j].Partner.partner_ein) +'</td>';
					html += '<td>';
						html += '<a class="btn mini blue" onClick="multiple_select.selectPartner('+checkEmpty(data[j].PartnerContact.login_id)+')"><i class="icon-ok"></i>&nbsp;'+ms_td.Select+'</a>';

					html += '</td>';
				html += '</tr>';
			}
		html += '</tbody>';

		$('#table_list').html(html);
	},
	createCustomerList:function(){

	},
	selectPartner:function(id){

		var availableUser = {};
		var login_ids = '';
		for(var j in ms_meta.login_data){
			if(ms_meta.login_data[j].PartnerContact.login_id == id){
				availableUser = ms_meta.login_data[j];
			}
		}
	
		if((availableUser.PartnerSetting.enable_two_factor == 'y' || availableUser.Login.enable_two_factor == 'y' ) && checkNull(availableUser.Login.google_auth_code) != ''){
			var d= [];
			d.push(availableUser);

			var login_data = {
				from:ms_meta.from,
				login_data:d,
				backdrop:'static'
			};
 			new_custom_popup2('560','popups','verify_twofa',login_data);
 			return;
 		}


		var total_params = {
			availableUser:JSON.stringify(availableUser),
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = base_url +'writeAvailableUser';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(checkEmpty(complet_data.url) != ''){
				window.location.href = complet_data.url;	
			}
		}
		doAjax(params);
		return;

		//var url = base_url + 'select/'+id;
		//window.location.href = url;
	},

}