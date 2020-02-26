var login_email = $('#LoginsEmail').val() ;
if(login_email != '' && login_email!= null && login_email!= 'undefined'){
	$('#LoginsPassword').focus();
}else{
	$('#LoginsEmail').focus();
}
localStorage.removeItem('twofaattempt');
localStorage.removeItem('socialdata');
var isBlocked;

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
	SESSION_DATA = SESSION_DATA.replace(/'/g,'"');
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

var Login = function() {

    var handleLogin = function() {
        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                email: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                email: {
                    required: "Email is required."
                },
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                //$('.alert-danger').show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element);
            },

            submitHandler: function(form) {
            	//if(type != 'partner' || type != 'customer'){
        		if(type == 'admin'){
                	form.submit(); // form validation success, call ajax form submit
                }
            }
        });
    } 
  

    return {
        //main function to initiate the module
        init: function() {

            handleLogin();           
            $('.forget-form').hide();

        }

    };

}();

jQuery(document).ready(function() {
    Login.init();
});


$('.login-form').on('submit', function(e){
	if(type != 'admin'){
		e.preventDefault();
		if($(".login-form").validate().form()){
			var LoginsEmail = $('#LoginsEmail').val();
			var LoginsPassword = $('#LoginsPassword').val();
			if($('.btn_login').css('display') == "none"){
				emailcheck.verifyTwoFa();
				return false;
			}
			else{
				
				emailcheck.check('',LoginsEmail,LoginsPassword);
				return false;
			}
		}
		return false;
	}
});

$(".login-form input").keypress(function(r){
	if(type != 'admin'){
		if(13==r.which){
			if($(".login-form").validate().form()){
				var LoginsEmail = $('#LoginsEmail').val();
				var LoginsPassword = $('#LoginsPassword').val();
				if($('.btn_login').css('display') == "none"){
					emailcheck.verifyTwoFa();
					return false;
				}
				else{
					emailcheck.check('',LoginsEmail,LoginsPassword);
					return false;
				}
			}
		}
	}
	else{
		if(13==r.which){
			$('.login-form').submit();
		}
	}
});



var emailcheck = {
	check:function(frm='',email,data){

		var total_params = {
			admin_id:admin_id,
			type:type,
			email:email,
			from:frm,
		};
		if(type == 'customer'){
			total_params['partner_id'] = partner_id;
		}
		if(frm == 'linkedin'){
			total_params['linkedin'] = checkNull(data.values[0].id);
		}
		else if(frm == 'facebook'){
			total_params['facebook'] = checkEmpty(data.userId)+'_'+checkNull(data.access_token);
		}
		else if(frm == 'google'){
			total_params['google'] = checkEmpty(data.userId)+'_'+checkEmpty(data.id_token);
		}
		else{
			total_params.password = checkNull(data);
		}

		
		var useragent_data = {
			ip_address:checkNull($('#IPADDRESS').val()),
			public_ip_address:checkNull($('#PUBLIC_IPADDRESS').val()),
			platform:'',
			trusted:checkNull($('#remember:checked').length)>0?'y':'n',
			country_code:checkNull($('#COUNTRY_CODE').val()),
			ip_meta:checkNull($("#IP_META").val())
		};
		if("platform" in window && "description" in platform){
			useragent_data['platform'] = platform.description
			showProcessingImage('undefined');
			new Fingerprint2().get(function(be_device_id, components) {
				useragent_data['be_device_id'] = be_device_id;
				total_params['be_device_id'] = checkNull(useragent_data['be_device_id']);
				localStorage.setItem('useragent_data',JSON.stringify(useragent_data));
				hideProcessingImage();
				emailcheck.checkEmailUser(total_params,frm,data);
			});
		};	
	},
	checkEmailUser:function(total_params,frm,data){
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Logins/checkEmailUser.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complete_data){
				
			if(complete_data.response.status == 'success'){
				
				emailcheck.handleResponse(complete_data.response.response,frm,data);	
			}
			else if(complete_data.response.status == 'error'){
				if(complete_data.response.response.error == 'validationErrors'){
					var mt_arr = complete_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					if($('.error_block').length != 0){
						$('.error_block span').html(array);
					}

				}else{
					if($('.error_block').length != 0){
						$('.error_block span').html(complete_data.response.response.msg);
					}
				}
				$('.error_block').show();
				setTimeout(function(){
					$('.error_block').fadeOut();
				},2000);
				return;
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	setCookie:function(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+ d.toUTCString();
	    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	},
	getCookie:function(cname){
		var name = cname + "=";
	    var decodedCookie = decodeURIComponent(document.cookie);
	    var ca = decodedCookie.split(';');
	    for(var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	},
	selectPartner:function(data,frm,fbg){
		var d = [];
		d.push(data);
		$('.login_input').show();
		$('.fb_btn i').css('background-color','');
		$('.in_btn i').css('background-color','');
		$('.gl_btn i').css('background-color','');
		$('.login-social').css('pointer-events','all');
		$('.partner_select').html('').hide();
		emailcheck.handleResponse(d,frm,fbg);
	},
	handleResponse:function(data,frm,fbg){
		logged_from = frm;
		var login_data = {login_data:data,from:frm,backdrop:'static'};

		if(data.length == 1){
			current_user = data[0];
	 		if("PartnerSetting" in data[0] && (data[0].PartnerSetting.enable_two_factor == 'y' || data[0].Login.enable_two_factor == 'y' ) && checkNull(data[0].Login.google_auth_code) != ''){
	 			
	 			if("trusted_device" in data[0].Login && data[0].Login.trusted_device == 'y'){
	 				emailcheck.setSession(current_user,logged_from);
	 				return;
	 			}
	 			$('.btn_reset').show();
	 			$('.google_authenticator').show();
	 			$('#LoginsTwoFa').val('');
	 			$('#LoginsEmail,#LoginsPassword').attr('readonly','readonly');
	 			$('.btn_login').hide();
	 			$('.btn_2fa').show();
	 			
	 			$('.info_block span').html('Please enter 2fa code');
	 			$('.info_block').show();

	 			if(frm != ''){
	 				$('#LoginsEmail').parent().hide();
	 				$('#LoginsPassword').parent().hide();
	 				if(frm == 'facebook'){
	 					$('.in_btn i').css('background-color','gray');
	 					$('.gl_btn i').css('background-color','gray');
	 				}
	 				else if(frm == 'google'){
	 					$('.fb_btn i').css('background-color','gray');
	 					$('.in_btn i').css('background-color','gray');
	 				}
	 				else if(frm == 'linkedin'){
	 					$('.fb_btn i').css('background-color','gray');
	 					$('.gl_btn i').css('background-color','gray');
	 				}
	 			}
	 			else{
	 				$('.fb_btn i').css('background-color','gray');
	 				$('.in_btn i').css('background-color','gray');
 					$('.gl_btn i').css('background-color','gray');
	 			}
	 			$('.login-social').css('pointer-events','none');
	 			$('.forgot-password').hide();
				setTimeout(function(){
					$('.info_block').fadeOut();
				},2000);
	 			return;
	 		}
	 		else{
	 			
	 			emailcheck.setSession(current_user,logged_from);
	 		}
		}	
		else{
			var socialdata = '';
			if(frm == 'linkedin'){
				alert(checkNull(trans.mLogintoLink));
				var socialdata = {
					'ask' : 'y',
					'login_id':'',
					'from':'linkedin'
				};
				
			}
			else if(frm == 'facebook'){
				alert(checkNull(trans.mLogintoLink));
				var socialdata = {
					'ask':'y',
					'login_id':'',
					'from':'facebook',
					'access_token':fbg.access_token,
				};
			}
			else if(frm == 'google'){
				alert(checkNull(trans.mLogintoLink));
				var socialdata = {
					'ask':'y',
					'login_id':'',
					'from':'google',
					'userId':fbg.userId,
					'access_token':fbg.id_token,
				};
			}
			else{
				
				var html = '<table class="table table-striped table-bordered table-hover">';
				html += '<thead class="flip-content">';
					html += '<tr>';
						html += '<td>'+checkNull(trans.srno)+'</td>';
						html += '<td>'+checkNull(trans.PartnerName)+'</td>';
						html += '<td>'+checkNull(trans.EIN)+'</td>';
						html += '<td>'+checkNull(trans.Action)+'</td>';
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
								var dd = JSON.stringify(data[j])
								dd = dd.replace(/\"/g,"'");
								var fbgg = '';
								if(checkNull(fbg) != ''){
									fbgg = {};
								}
								fbgg = JSON.stringify(fbg);
								fbgg = fbgg.replace(/\"/g,"'"); 
								html += '<a class="btn mini blue" onClick="emailcheck.selectPartner('+checkEmpty(dd)+',\''+frm+'\','+fbgg+')"><i class="icon-ok"></i>&nbsp;'+checkNull(trans.Select)+'</a>';

							html += '</td>';
						html += '</tr>';
					}
				html += '</tbody>';
				html += '</table>';
				
				$('.login_input').hide();
				$('.fb_btn i').css('background-color','gray');
 				$('.in_btn i').css('background-color','gray');
				$('.gl_btn i').css('background-color','gray');
				$('.login-social').css('pointer-events','none');
				$('.partner_select').html(html).show();
			
				//localStorage.removeItem('socialdata');
				//window.location.href = base_url + data.url.controller + '/' + data.url.action;
				//return;
			}

			if(checkEmpty(socialdata) != ''){
				localStorage.setItem('socialdata',JSON.stringify(socialdata));
			}
			else{
				localStorage.removeItem('socialdata');
			}
			
		}
	},
	verifyTwoFa:function(){
		var twofaattempt = localStorage.getItem('twofaattempt');
		if(checkNull(twofaattempt) == ''){
			twofaattempt = 0;
		}
		else{
			if(twofaattempt >= 3){
				localStorage.removeItem('twofaattempt',0);
				return emailcheck.resetForm();
			}
		}
		var verification_code = $('#LoginsTwoFa').val();
		if(checkNull(verification_code) == ''){
			var code_req = 'Code is required';
			$('#LoginsTwoFa-error').remove();
			$('#LoginsTwoFa').after('<span id="LoginsTwoFa-error" class="help-block">'+code_req+'</span>');

			$('#LoginsTwoFa').off();
			$('#LoginsTwoFa').on('keyup',function(){
				var verification_code = $('#LoginsTwoFa').val();
				if(checkNull(verification_code) != ''){
					$('#LoginsTwoFa-error').remove();
				}
			});
			return;
		}

		var total_params = {
			language:language,
			lang:lang,
			login_id:current_user.Login.id,
			verification_code:verification_code,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Logins/verifyTwoFa.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			//hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complete_data){
			localStorage.setItem('twofaattempt',++twofaattempt);
			hideProcessingImage();
			if(complete_data.response.status == 'success'){
				
				emailcheck.setSession(current_user,logged_from);
			}
			else if(complete_data.response.status == 'error'){
				if(complete_data.response.response.error == 'validationErrors'){
					var mt_arr = complete_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					if($('.error_block').length != 0){
						$('.error_block span').html(array);
					}

				}else{
					if($('.error_block').length != 0){
						$('.error_block span').html(complete_data.response.response.msg);
					}
				}
				$('.error_block').show();
				setTimeout(function(){
					$('.error_block').fadeOut();
				},2000);
				return;
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	resetForm:function(frm){
		$('.btn_reset').hide();
		$('.google_authenticator').hide();
		$('#LoginsTwoFa').val('');
		$('#LoginsEmail,#LoginsPassword').val('').removeAttr('readonly');
		$('#LoginsEmail').parent().show();
	 	$('#LoginsPassword').parent().show();
		$('.btn_login').show();
		$('.btn_2fa').hide();
		$('.forgot-password').show();
		$('.fb_btn i').css('background-color','');
		$('.in_btn i').css('background-color','');
		$('.gl_btn i').css('background-color','');
		$('.login-social').css('pointer-events','all');

		if ( typeof IN === 'object' && typeof IN.User === 'object' ){
           	try {
            	IN.User.logout();
          	}catch (err) {          	
          	}                
    	}

    	if ( typeof FB === 'object'){
			try {
				FB.getLoginStatus(function(response) {
			 		if(response.status == 'connected'){
			 			FB.logout();
			 		}
			 	});
				
			}catch (err){			
			}
		}	
		try {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            });
      	} catch(err){
      	}



		if(frm != 1){
			var msg = checkNull(trans.limit_exceed );
			$('.error_block span').html(msg);
			$('.error_block').show();
			setTimeout(function(){
				$('.error_block').fadeOut();
			},2000);
			return;
		}
	},
	setSession:function(data,frm){
		if(data.Partner.wizard == 0){
			localStorage.setItem('showwizard',1);
		}
		var d = [];
		if(frm == 'facebook'){
			d = checkNull(data.Login.facebook);
		}
		else if(frm == 'google'){
			d = checkNull(data.Login.google);
		}
		else if(frm == 'linkedin'){
			d = checkNull(data.Login.linkedin);
		}
		localStorage.setItem('loggedin',JSON.stringify({frm:frm,data:d}));

		var total_params = {
			availableUser:JSON.stringify(data),
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = base_url +'writeAvailableUser';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			
		}
		
		params['successCallbackFunction'] = function (complet_data){
			hideProcessingImage();
			if(checkEmpty(complet_data.url) != ''){
				//window.location.href = complet_data.url;
				emailcheck.setSession2(complet_data.url);

			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	setSession2:function(url){
		var params = $.extend({}, doAjax_params_default);
		params['url'] = url;
		params['requestType'] = 'GET';
		var total_params = {from:type};
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			//hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
			window.location.href = complet_data.url;
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
};

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
					
					emailcheck.check('facebook','',socialdata);	
				}
				catch(e){
					hideProcessingImage();
				}		
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
					image_url:image_url
				};

				hideProcessingImage();
				emailcheck.check('google','',socialdata);
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
			IN.API.Profile("me").fields([ "id","email-address"]).result(function(data) {
				hideProcessingImage();
		 		emailcheck.check('linkedin','',data);
		 	});
		}
		catch(e){
		}
	},
}

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
