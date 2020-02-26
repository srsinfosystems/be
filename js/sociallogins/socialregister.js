var APISERVER = $('#APISERVER').val();
var SESSION_DATA = $('#SESSION_DATA').val();
var base_url = $('#BASE_URL').val();
var partner_id = '';
var admin_id = '';
var type = '';
var cp = '';
var lang = '';
var language = '';
var current_user = {};
var logged_from = '';

if(SESSION_DATA != undefined && SESSION_DATA != null && SESSION_DATA != ''){
	SESSION_DATA = JSON.parse(SESSION_DATA);
	admin_id = checkEmpty(SESSION_DATA.SYSTEM.admin_id);
	type = checkEmpty(SESSION_DATA.type);
	lang = SESSION_DATA.Config.lang;
	language = SESSION_DATA.Config.language;
	if(type == 'customer'){
		partner_id = checkEmpty(SESSION_DATA.PARTNER_DATA.PartnerId);
	}
}

var trans =  $('#trans').val();
if(trans != undefined && trans != null && trans != ''){
	trans = trans.replace(/\'/g,'"');
	trans = JSON.parse(trans);
}
else{
	trans = {};
}

var social_logins = {
	facebook:function(){
		showProcessingImage();
		try{
			FB.login(function(response){
				hideProcessingImage();
				try{
					var socialdata = {
						'access_token' : response.authResponse.accessToken,
						'userId': response.authResponse.userID,
					};
					emailcheck.check('facebook',socialdata);	
				}
				catch(e){
					console.log('fbsocialdata',e);
					hideProcessingImage();
				}		
			});
		}
		catch(e){
			hideProcessingImage();
		}
	},
	linkedin:function(){
		try{
			if(!IN.User.authorize()){
				IN.Event.onOnce(IN, "auth", social_logins.getLinkedinData);
			}
			else{
				hideProcessingImage();
				social_logins.getLinkedinData();
			}			
		}
		catch(e){
			hideProcessingImage();
		}
		
	},
	getLinkedinData:function(){
		try{
			IN.API.Profile("me").fields([ "id","email-address","firstName","lastName"]).result(function(data) {
				hideProcessingImage();
		 		emailcheck.check('linkedin',data);
		 	});
		}
		catch(e){
			hideProcessingImage();
		}
	},
	google:function(){
		try{
			var auth2 = gapi.auth2.getAuthInstance();
			auth2.signIn().then(function(googleUser){

				var profile = googleUser.getBasicProfile();
				var id_token = googleUser.getAuthResponse().id_token;
				var image_url = profile.getImageUrl();
			
				var socialdata = {
					userId:profile.getId(),
					id_token:id_token,
					image_url:image_url,
					name:profile.getName(),
					email:profile.getEmail()
				};

				hideProcessingImage();
				emailcheck.check('google',socialdata);
			});
		}
		catch(e){
			hideProcessingImage();
		}
	},
};

var emailcheck = {
	check:function(frm='',data){
		var total_params = {
			admin_id:admin_id,
			type:type,
			from:frm,
			getTranslationsData:'yes',
			getTranslationsDataArray:['alert message']
		};

		if(frm == 'linkedin'){
			total_params['linkedin'] = checkNull(data.values[0].id);
		}
		else if(frm == 'facebook'){
			total_params['facebook'] = checkEmpty(data.userId)+'_'+checkNull(data.access_token);
		}
		else if(frm == 'google'){
			total_params['google'] = checkEmpty(data.userId)+'_'+checkEmpty(data.id_token);
		}

		emailcheck.checkEmailUser(total_params,frm,data);
	},
	checkEmailUser:function(total_params,frm,data){

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Logins/checkSocialLink.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complete_data){
				
			if(complete_data.response.status == 'success'){
					emailcheck.getData(frm,data);
			}
			else if(complete_data.response.status == 'error'){
				alert('here');
				if(complete_data.response.response.error == 'validationErrors'){
					var mt_arr = complete_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					if($('.response_message .alert-danger').length != 0){
						$('.response_message .alert-danger').html(array);
					}
				}else{
					if($('.response_message .alert-danger').length != 0){
						$('.response_message .alert-danger').html(complete_data.response.response.msg);
					}
				}
				$('.response_message,.alert-danger').removeClass('hide');
				setTimeout(function(){
					$('.alert-danger').fadeOut();
					$('.response_message,.alert-danger').addClass('hide');
				},2000);
				return;
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	getData:function(frm,data){
		if(frm == 'facebook'){
			try{
				FB.api('/me',{
					access_token:data['access_token'],
					locale: 'en_US', fields: 'name, email' 
				},
				function(res){
					if("email" in res && checkNull(res['email']) != ''){
						$('#PartnerEmail').val(res['email']).attr('disabled','disabled');
					}

					if("name" in res && checkNull(res['name']) != ''){
						var a = res['name'];
						a = a.split(' ');
						if(checkNull(a[0]) != ''){
							$('#PartnerFirstName').val(a[0]).attr('disabled','disabled');
						}

						if(checkNull(a[1]) != ''){
							$('#PartnerLastName').val(a[1]).attr('disabled','disabled');
						}
					}
					$('#from_w').val('facebook');
					$('#fromwdata').val(checkEmpty(data.userId)+'_'+checkNull(data.access_token));
				});
			}
			catch(e){
				$('#from_w').val('');
				$('#fromwdata').val('');
				console.log('fbgetpic',e);
			}
		}
		else  if(frm == 'linkedin'){
			console.log('linkedindata',data);
			if("values" in data && data.values.length > 0){
				if(checkNull(data['values'][0]['firstName']) != ''){
					$('#PartnerFirstName').val(data['values'][0]['firstName']).attr('disabled','disabled');
				}
				if(checkNull(data['values'][0]['lastName']) != ''){
					$('#PartnerLastName').val(data['values'][0]['lastName']).attr('disabled','disabled');
				}

				if(checkNull(data['values'][0]['emailAddress']) != ''){
					$('#PartnerEmail').val(data['values'][0]['emailAddress']).attr('disabled','disabled');
				}
				$('#from_w').val('linkedin');
				$('#fromwdata').val(checkNull(data.values[0].id));
			}
			else{
				$('#from_w').val('');
				$('#fromwdata').val('');
			}
		}
		else if(frm == 'google'){
			if("email" in data && checkNull(data['email']) != ''){
				$('#PartnerEmail').val(data['email']).attr('disabled','disabled');
			}

			if("name" in data && checkNull(data['name']) != ''){
				var a = data['name'];
				a = a.split(' ');
				if(checkNull(a[0]) != ''){
					$('#PartnerFirstName').val(a[0]).attr('disabled','disabled');
				}

				if(checkNull(a[1]) != ''){
					$('#PartnerLastName').val(a[1]).attr('disabled','disabled');
				}
			}
			$('#from_w').val('google');
			$('#fromwdata').val(checkEmpty(data.userId)+'_'+checkEmpty(data.id_token));

		}
	}
};

// window.fbAsyncInit = function() {
// 	FB.init({
// 		appId      : '363532030845600',
// 		cookie     : true,
// 		xfbml      : true,
// 		version    : 'v3.0'
// 	});

// 	FB.AppEvents.logPageView();
// };

// (function(d, s, id){
// 	var js, fjs = d.getElementsByTagName(s)[0];
// 	if (d.getElementById(id)) {return;}
// 	js = d.createElement(s); js.id = id;
// 	js.src = "https://connect.facebook.net/en_US/sdk.js";
// 	fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));