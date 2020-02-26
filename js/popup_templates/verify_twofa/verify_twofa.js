var language = $('#language').val();
var lang = $('#lang').val();

var APISERVER = $('#APISERVER').val();
var SESSION_DATA = $('#SESSION_DATA').val();
if(checkNull(SESSION_DATA) != ''){
	SESSION_DATA = SESSION_DATA.replace(/\'/g,'"');
	SESSION_DATA = JSON.parse(SESSION_DATA);
}
else{
	SESSION_DATA = {MEMBER:{LoginEmail:''}};
}

var vt_meta;
var vt_dt;
var vt_popid = 'popups';
var vt_td;
var verify_twofa = {
	start:function(popupid,metadata={}){
		vt_popid = popupid;
		vt_meta = metadata;

		var total_params = {
			language:language,
			lang:lang,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Close','Authentication','Success','Verification code','Verify','Please check the following fields','Alert message'],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Logins/login.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				vt_dt = complet_data.response.response;
				vt_td = complet_data.response.response.translationsData;
				verify_twofa.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',vt_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',vt_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		var template = document.getElementById('verify_twofa_template').innerHTML;
		var compiledRendered = Template7(template, vt_dt);
		document.getElementById(vt_popid).innerHTML = compiledRendered;
		resizemodal(vt_popid);
		verify_twofa.bindEvents();
	},
	bindEvents:function(){
		$('.verify_code').click(function(){
			verify_twofa.verifyCode();
		});
	},
	verifyCode:function(){
		var verification_code = $('#verification_code').val();
		if(checkNull(verification_code) == ''){
			var msg = vt_td.Pleasecheckthefollowingfields;
			msg += '<br/>' + vt_td.Verificationcode;
			showAlertMessage(msg,'error',vt_td.Alertmessage);
			return;
		}
		var total_params = {
			language:language,
			lang:lang,
			login_id:vt_meta.login_data[0].Login.id,
			verification_code:verification_code,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Logins/verifyTwoFa.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				verify_twofa.setSession(vt_meta.login_data,vt_meta.from);				
			}
			else if(complet_data.response.status == 'error'){
				$('#verification_code').val();
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',vt_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',vt_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	onModalClose:function(){
		if(vt_meta.from == 'linkedin'){
			if ( typeof IN === 'object' && typeof IN.User === 'object' ){
               	try {
                	IN.User.logout();
              	}catch (err) {
              		console.log(err);
              	}                
        	}
    	}
    	else if(vt_meta.from == 'facebook'){
    		if ( typeof FB === 'object'){
    			try {
				 FB.getLoginStatus(function(response) {
				 	if(response.status == 'connected'){
				 		FB.logout();
				 	}
				 });
    				
    			}catch (err){
    				console.log(err);
    			}
    		}
    		
    	}
    	else if(vt_meta.from == 'google'){
    		try {
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                  console.log('User signed out.');
                });
          	} catch(err){
          	}
    	}
	},
	setSession:function(data,frm){
		localStorage.setItem('loggedin',frm);
		localStorage.removeItem('socialdata');
		var total_params = {
			availableUser:JSON.stringify(data[0]),
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
		showProcessingImage();
		doAjax(params);
		return;
	},

}