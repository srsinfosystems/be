var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var login_id = $('#login_id').val();
var SESSION_DATA = $('#SESSION_DATA').val();
if(checkNull(SESSION_DATA) != ''){
	SESSION_DATA = SESSION_DATA.replace(/\'/g,'"');
	SESSION_DATA = JSON.parse(SESSION_DATA);
}
else{
	SESSION_DATA = {MEMBER:{LoginEmail:''}};
}
var host_url = $('#HOST_URL').val();
var login_email = checkNull(SESSION_DATA.MEMBER.LoginEmail);
var at_meta;
var at_dt;
var at_popid = 'popups';
var at_td;
var ask_twofa = {
	start:function(popupid,metadata={}){
		at_popid = popupid;
		at_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			login_id:login_id,
			login_email:login_email,
			host_url:host_url,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Close','Authentication','Success','Enter this code','Save this code in google authenticator app','It will be required the next time you login','Scan this Qrcode','Or'],
		};
		if(at_meta.id!=null && at_meta.id!=undefined && at_meta!=''){
			total_params.id = at_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getUserTwoFa.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				at_dt = complet_data.response.response;
				at_td = complet_data.response.response.translationsData;
				ask_twofa.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',at_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',at_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		var template = document.getElementById('ask_twofa_template').innerHTML;
		var compiledRendered = Template7(template, at_dt);
		document.getElementById(at_popid).innerHTML = compiledRendered;
		resizemodal(at_popid);
		ask_twofa.bindEvents();
	},
	bindEvents:function(){

	},


}