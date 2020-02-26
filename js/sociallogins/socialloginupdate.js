var d = localStorage.getItem('loggedin');
if(checkNull(d) != ''){
	d = JSON.parse(d);
	if("userData" in d && checkNull(d.userData.pic) != ''){
		$('li.dropdown.user img').attr('src',d.userData.pic);
	}
}

var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id = parseInt($('#partner_id').val());
var admin_id = parseInt($('#admin_id').val());
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var loginType= $('#loginType').val();
var login_id = $('#login_id').val();
var staffer_id = $('#staffer_id').val();

var llink_facebook = $('#link_linkedin').val();
var mlink_facebook = $('#link_facebook').val();
var mlink_google = $('#link_google').val();

var mYes = $('#mYes').val();
var mNo = $('#mNo').val();
var mConfirmation = $('#mConfirmation').val();
var mLogintoLink = $('#mLogintoLink').val();
var mSuccess = $('#mSuccess').val();
var mAlert = $('#mAlert').val();

var socialloginupdate = {
	checkLinkedin:function(){
		IN.Event.on(IN, "auth", socialloginupdate.save);
	},
	save:function(){
		if(( localStorage.getItem('socialdata') != null || checkNull(localStorage.getItem('socialdata') != '') ) && checkNull(localStorage.getItem('showwizard')) == '' ){
			var socialdata = JSON.parse(localStorage.getItem('socialdata'));
			if(socialdata == null || checkNull(socialdata) == ''){
				return;
			}
			var no = function(){
				//remove from storage
				localStorage.removeItem('socialdata');
			};
			var yes = function(){
				if(socialdata.from == 'linkedin'){
					if ( typeof IN === 'object' && typeof IN.User === 'object' ) {
						showProcessingImage('undefined');
						IN.API.Profile("me").fields([ "id","email-address"]).result(function(data) {
				 				
				 			if(checkNull(socialdata.login_id) == ''){
				 				socialdata.login_id = login_id;
				 			}
				 			var total_params = {
								token:token,
								language:language,
								lang:lang,
								partner_id:partner_id,
								admin_id:admin_id,
								login_id:socialdata.login_id,
								from:'linkedin',
								linkedinid:data.values[0].id,
							};

							var params = $.extend({}, doAjax_params_default);
							params['url'] = APISERVER+'/api/Commons/updateSocialId.json';
							params['data'] = total_params;
							params['completeCallbackFunction'] = function (){
								hideProcessingImage('undefined');
							}

							params['successCallbackFunction'] = function (complet_data){
								localStorage.removeItem('socialdata');
								if ( typeof IN === 'object' && typeof IN.User === 'object' ){
					               	try {
					                	IN.User.logout();
					              	}catch (err) {
					              		console.log(err);
					              	}                
				            	}
								if(complet_data.response.status == 'success'){
									$('#tab_login').click();
									call_toastr('success',mSuccess,complet_data.response.response.message.msg);
									
								}
								else if(complet_data.response.status == 'error'){
									if(complet_data.response.response.error == 'validationErrors'){
										var mt_arr = complet_data.response.response.list;
										var array = $.map(mt_arr, function(value, index) {
											return value+'<br />';
										});
										showAlertMessage(array,'error',mAlert);
										return;
									}else{
										showAlertMessage(complet_data.response.response.msg,'error',mAlert);
										return;
									}	
								}
							}

							doAjax(params);
							return;
				 		});
					}
				}
				else if(socialdata.from == 'facebook'){
					showProcessingImage('undefined');
					FB.api('/me?fields=email', {
					  	access_token: socialdata.access_token
					}, function(response) {
					  		if(checkNull(socialdata.login_id) == ''){
				 				socialdata.login_id = login_id;
				 			}
				 			var total_params = {
								token:token,
								language:language,
								lang:lang,
								partner_id:partner_id,
								admin_id:admin_id,
								login_id:socialdata.login_id,
								from:'facebook',
								facebookid:response.id+'_'+socialdata.access_token,
							};

							var params = $.extend({}, doAjax_params_default);
							params['url'] = APISERVER+'/api/Commons/updateSocialId.json';
							params['data'] = total_params;
							params['completeCallbackFunction'] = function (){
								hideProcessingImage('undefined');
							}

							params['successCallbackFunction'] = function (complet_data){
								localStorage.removeItem('socialdata');
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
            		
								if(complet_data.response.status == 'success'){
									$('#tab_login').click();
									call_toastr('success',mSuccess,complet_data.response.response.message.msg);
									
								}
								else if(complet_data.response.status == 'error'){
									if(complet_data.response.response.error == 'validationErrors'){
										var mt_arr = complet_data.response.response.list;
										var array = $.map(mt_arr, function(value, index) {
											return value+'<br />';
										});
										showAlertMessage(array,'error',mAlert);
										return;
									}else{
										showAlertMessage(complet_data.response.response.msg,'error',mAlert);
										return;
									}	
								}
							}

							doAjax(params);
							return;
					});
				}
				else if(socialdata.from == 'google'){
					if(checkNull(socialdata.login_id) == ''){
		 				socialdata.login_id = login_id;
		 			}
		 			var total_params = {
						token:token,
						language:language,
						lang:lang,
						partner_id:partner_id,
						admin_id:admin_id,
						login_id:socialdata.login_id,
						from:'google',
						googleid:socialdata.userId+'_'+socialdata.access_token,
					};

					var params = $.extend({}, doAjax_params_default);
					params['url'] = APISERVER+'/api/Commons/updateSocialId.json';
					params['data'] = total_params;
					params['completeCallbackFunction'] = function (){
						hideProcessingImage('undefined');
					}

					params['successCallbackFunction'] = function (complet_data){
						localStorage.removeItem('socialdata');
						try {
			                var auth2 = gapi.auth2.getAuthInstance();
			                auth2.signOut().then(function () {
			                  console.log('User signed out.');
			                });
		              	} catch(err){
		              	}
						if(complet_data.response.status == 'success'){
							$('#tab_login').click();
							call_toastr('success',mSuccess,complet_data.response.response.message.msg);
						}
						else if(complet_data.response.status == 'error'){
							
							if(complet_data.response.response.error == 'validationErrors'){
								var mt_arr = complet_data.response.response.list;
								var array = $.map(mt_arr, function(value, index) {
									return value+'<br />';
								});
								showAlertMessage(array,'error',mAlert);
								return;
							}else{
								showAlertMessage(complet_data.response.response.msg,'error',mAlert);
								return;
							}	
						}
					}
					doAjax(params);
					return;
				}
			};



			if(socialdata.ask == 'y' && socialdata.from=='linkedin'){
				showDeleteMessage(llink_facebook,mConfirmation,yes,no,'ui-dialog-blue',mYes,mNo,'green');	
			}
			else if(socialdata.ask == 'y' && socialdata.from=='facebook'){
				showDeleteMessage(mlink_facebook,mConfirmation,yes,no,'ui-dialog-blue',mYes,mNo,'green');
			}
			else if(socialdata.ask == 'y' && socialdata.from=='google'){
				showDeleteMessage(mlink_google,mConfirmation,yes,no,'ui-dialog-blue',mYes,mNo,'green');
			}
			else{
				yes();
			}			
		}
	},
	getData:function(){
		var d = localStorage.getItem('loggedin');
		if(checkNull(d) != ''){
			d = JSON.parse(d);
			if("userData" in d && checkNull(d.userData.pic) != ''){

			}
			else if(d.frm == 'facebook'){
				var dt = checkNull(d.data).split('_');
				if(checkNull(dt[0]) != ''){
					try{
						FB.api(
						  	'/'+dt[0]+'/picture?redirect=false',
						  	'GET',
						  	{},
						  	function(response) {
						    	if("data" in response && "url" in response.data && checkNull(response.data.url) != ''){
						    		d['userData'] = {
						    			pic:response.data.url
						    		};
						    		localStorage.setItem('loggedin',JSON.stringify(d));
						    		$('li.dropdown.user img').attr('src',response.data.url);
						    	}
						  	}
						);
					}
					catch(e){
						console.log('fbgetpic',e);
					}
				}
			}
			else if(d.frm == 'google'){
				var dt = checkNull(d.data).split('_');
				if(checkNull(dt[0]) != ''){
					setTimeout(function(){
						try{
							var auth2 = gapi.auth2.getAuthInstance();
							
							if(auth2.isSignedIn.get()){
								var profile = auth2.currentUser.get().getBasicProfile();
								var pic = profile.getImageUrl();

								if(checkNull(pic) != ''){
									var d = localStorage.getItem('loggedin');
									if(checkNull(d) != ''){
										d = JSON.parse(d);
										d['userData'] = {
						    				pic:pic
						    			};
						    			localStorage.setItem('loggedin',JSON.stringify(d));
						    			$('li.dropdown.user img').attr('src',pic);
					    			}
								}						    		
							}
						}
						catch(e){
							console.log('googlepetpic',e);
						}
					},2000);
				}
			}
			else if(d.frm == 'linkedin'){
				if(checkNull(d.data) != ''){
					setTimeout(function(){
						try{
							if(IN.User.authorize()){
								IN.API.Profile("me").fields().result(function(data) {
									console.log('linkedindata',data);
									if("values" in data && checkNull(data.values[0].pictureUrl) != ''){
										var d = localStorage.getItem('loggedin');
										if(checkNull(d) != ''){
											d = JSON.parse(d);
											d['userData'] = {
							    				pic:data.values[0].pictureUrl
							    			};
							    			localStorage.setItem('loggedin',JSON.stringify(d));
							    			$('li.dropdown.user img').attr('src',data.values[0].pictureUrl);
										}
									}
				 				});
							}
						}
						catch(e){
							console.log(e);
						}
					},2000);
				}
			}
			else{
				$('li.dropdown.user img').attr('src',host_url+'img/avatar.png');
			}
		}
	}
};

function saveUserData(){
	var useragent_data = localStorage.getItem('useragent_data');
	if(checkNull(useragent_data) != ''){
		useragent_data = JSON.parse(useragent_data);
		if(!$.isEmptyObject(useragent_data)){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				login_id:login_id
			}
			total_params = Object.assign(total_params,useragent_data);
			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Commons/saveLoginHistory.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				//hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					localStorage.removeItem('useragent_data');
				}
				else if(complet_data.response.status == 'error'){
					saveUserData();
				}
			}
			//showProcessingImage('undefined');
			doAjax(params);
			return;
		}
	}
}

$(document).ready(function(){
	if($('#IsAdmin').val() != 'y'){
		saveUserData();
	}
	
});

window.fbAsyncInit = function() {
	FB.init({
		appId      : '363532030845600',
		cookie     : true,
		xfbml      : true,
		version    : 'v3.0'
	});

	FB.AppEvents.logPageView();
	if(localStorage.getItem('socialdata') != null || checkNull(localStorage.getItem('socialdata') != '')){
		var socialdata = JSON.parse(localStorage.getItem('socialdata'));
		if(socialdata != null && checkNull(socialdata) != ''){
			if($('#IsAdmin').val() != 'y'){
				socialloginupdate.save();
			}
		}
	}
	$(document).ready(function(){
		if($('#IsAdmin').val() != 'y'){
			socialloginupdate.getData();
		}
	});
};


// (function(d, s, id){
// 	var js, fjs = d.getElementsByTagName(s)[0];
// 	if (d.getElementById(id)) {return;}
// 	js = d.createElement(s); js.id = id;
// 	js.src = "https://connect.facebook.net/en_US/sdk.js";
// 	fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));