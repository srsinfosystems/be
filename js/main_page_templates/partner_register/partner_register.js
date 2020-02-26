var APISERVER = $('#APISERVER').val();

var language = '';
var lang = '';
var admin_id = '';
var brand_id = $('#brand_id').val();
var use_member_centric = $('#use_member_centric').val();
var SESSION_DATA = $('#SESSION_DATA').val();
var BASE_URL = $('#BASE_URL').val();
var from_w = '';
var fromwdata = '';

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

if(use_member_centric == '1' && lang == 'nb'){
	language = 'nor/member';
}
else if(use_member_centric == '1' && lang == 'en'){
	language = 'eng/member';
}

var global_translationsData = {};
var partner_register = {
	start: function(){
		var total_params = {
			APISERVER:APISERVER,
			language:language,
			lang:lang,
			getTranslationsData:'yes',
			getTranslationsDataArray:['org_name','step','continue','previous','first_name','last_name','cust_cellphone','customer_email','error_msg','Register','invalidemail_msg','EIN','accept','and','privacy_policy','terms_of_service','b_name','postal_address','postal_city','postal_country','postal_zip','invalidein_msg','resend_link',
				'Register','last name','first name','email','cellphone'
				],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Logins/login.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complet_data){

			if(complet_data.response.status == 'success'){
				global_translationsData = complet_data.response.response;
				partner_register.createHtml();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					if($('.response_message .alert-danger').length != 0){
						$('.reponse_message .alert-danger').html(array);
					}
				}else{
					if($('.reponse_message .alert-danger').length != 0){
						$('.reponse_message .alert-danger').html(array);
					}
				}
			}
		}
		doAjax(params);		
		return;
	},
	createHtml:function(){
		var template = document.getElementById('partner_register_template').innerHTML;
		var compiledRendered = Template7(template,global_translationsData);
		document.getElementById('content').innerHTML = compiledRendered;
		partner_register.bindEvents();
		partner_register.step1();	
		// init background slide images
		$('.login-bg').backstretch([
			"/new_design/img/login/bg1.jpg",
			"/new_design/img/login/bg2.jpg",
			"/new_design/img/login/bg3.jpg"
			], {
			  fade: 1000,
			  duration: 4000
			}
		);	
        localStorage['failed_attempt'] = 0;
	},
	step1: function(event){
		$('.step2').hide();
		$(".step1 #PartnerPhone").intlTelInput({

		initialCountry: "NO",
		  geoIpLookup: function(callback) {
		  	callback('NO');		
		    // $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
		    //   var countryCode = (resp && resp.country) ? resp.country : "";
		    //   callback(countryCode);		      
		    // });
		  },
		  preferredCountries:['NO']
		 });

		$('.selected-flag').off();
		$('.iti-arrow').hide();
		$(".step1 #PartnerPhone").on("countrychange", function(e, countryData) {
			console.log(countryData.iso2);
				  if(countryData.iso2 == 'no'){
				  		var id=".step1 #PartnerPhone";
				  		limitNumbers(id,8);
                    	/*$( "#PartnerPhone" ).rules( "remove", "minlength maxlength" );
                    	$( "#PartnerPhone" ).rules( "add", {
							  minlength: 8,
							  maxlength: 8,
							});*/
		            }
		            else{
		            	var id=".step1 #PartnerPhone";
				  		limitNumbers(id,10);
                    	/*$( "#PartnerPhone" ).rules( "remove", "minlength maxlength" );
                    	$( "#PartnerPhone" ).rules( "add", {
							  minlength: 10,
							  maxlength: 10,
							});*/
		            }
		            
			});
		$('.step2 #PartnerEIN').on('blur',function(){
			partner_register.checkEIN();
		});
	},
	checkStep: function(){
			var form1 = $('.step1');
            var error1 = $('.alert-error', form1);
            var success1 = $('.alert-success', form1);

            form1.validate({
                errorElement: 'label', //default input error message container
				errorClass: 'help-block help-block-error', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
                rules: {
                    partner_first_name: {
                    	minlength: 3,
                        required: true
                    }, 
                    partner_last_name: {
                    	minlength: 3,
                        required: true
                    },  
                    email: {
                        required: true,
                        email: true
                    },    
                    cellphone : {
                    	digits: true,
                    	minlength: 8,
                        required: true
                    },                            
                },
               /* messages: {
					partner_first_name: {
						required: "Username is required."
					},
					partner_last_name: {
						required: "Password is required."
					}
				},*/
				invalidHandler: function(event, validator) { //display error alert on form submit   
					success1.hide();
                    error1.show();
				},
                highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
				},

				success: function(label) {
					label.closest('.form-group').removeClass('has-error');
					label.remove();
					$('.step1 .email_section .help-inline.help-small').hide(); 
				},

				errorPlacement: function(error, element) {
					var cont = $(element).parent('.input-group');
                    if (cont.size() > 0) {
                        cont.after(error);
                    } else {
                        element.after(error);
                    }
				},               

                submitHandler: function (form) {
                    //success1.show();                    
                    error1.hide();                     
                    partner_register.checkEmailSMTP();                  
                }
            });
	},	
	showStep: function(step){
		$('.step'+step).show();
		next_step = step + 1;
		$('.step'+next_step).hide();
	},
	bindEvents:function(){
		//$('input[type=checkbox]').uniform();		
	},
	checkEmailSMTP: function(){
		//console.log(localStorage['failed_attempt']);
		if(localStorage['failed_attempt'] > 2){	
			//alert('cannot go further');		
			setTimeout(function(){localStorage['failed_attempt'] = 0;},10000);
			return false;
		}
		else{
			$('.step1 .help-inline, .step1 .help-inline.help-small').hide();
			var emailid = $('#PartnerEmail').val();
			var total_params = {
				language:language,
				lang:lang,
				email:emailid,
				admin_id:admin_id,
             };

            var params = $.extend({}, doAjax_params_default);
			params['requestType'] = 'POST';
			params['url'] = APISERVER+'/api/Logins/checkEmailSMTP.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}

			params['successCallbackFunction'] = function (complet_data){
				$('.step1 .email_section .load_img').addClass('hide');
				if(complet_data.response.status == 'success'){		
					if(complet_data.response.response === 'valid'){						
						partner_register.saveDetail(); return;				
						$('.step1 .email_section input').removeClass('has-error valid');
						$('.step1 .email_section input').attr('aria-invalid','false');
						$('.step1 .email_section .help-inline, .step1 .email_section .help-inline.help-small').addClass('hide');
						$('.step2').show();
						$('.step1').hide();
					}
					else if(complet_data.response.response === 'invalid')
					{
						$('.step1 .email_section input').removeClass('valid').addClass('has-error');
						$('.step1 .email_section .help-block').hide();
						$('.step1 .email_section .help-inline.help-small').show();
						$('.step1 .email_section input').attr('aria-invalid','true');
						$('.step1 .email_section .help-inline.help-small').removeClass('hide').addClass('help-block-error');
						$('.step1 .email_section .help-inline.help-small').html(global_translationsData.translationsData.invalidemail_msg);
						localStorage['failed_attempt'] = parseInt(localStorage['failed_attempt']) + 1;
						
					}
				}
				else if(complet_data.response.status == 'error'){
					//showAlertMessage(complet_data.response.response.msg,'error','Error');
					$('.step1 .email_section input').removeClass('valid').addClass('has-error');
					$('.step1 .email_section .help-block').hide();
					$('.step1 .email_section .help-inline.help-small').show();
					$('.step1 .email_section input').attr('aria-invalid','true');
					$('.step1 .email_section .help-inline.help-small').removeClass('hide').addClass('help-block-error');
					$('.step1 .email_section .help-inline.help-small').html(complet_data.response.response.msg);
					localStorage['failed_attempt'] = parseInt(localStorage['failed_attempt']) + 1;
					return;
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;			                    	
		}
	},
	checkEIN: function()
	{
		var ein = $('#PartnerEIN').val();
		var total_params = {
			language:language,
			lang:lang,
			ein:ein
    	};
    	$('.step2 .load_img').show();
		$('.step2 .load_img').removeClass('hide');

    	var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Logins/getBrregLookup.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
			$('.step2 .load_img').hide();
			$('.step2 .load_img').addClass('hide');
		}
    	params['successCallbackFunction'] = function (complet_data){
    		if(complet_data.response.status == 'success'){	
				$('.response_message').hide();
				$('.response_message').addClass('hide');
				$('.response_message .alert-danger').addClass('hide');
				var b_name = complet_data.response.response.result.name;
				var postal_address = complet_data.response.response.result.postal_address;
				var postal_zip = complet_data.response.response.result.postal_zip;
				var postal_city = complet_data.response.response.result.postal_city;
				var postal_country = complet_data.response.response.result.postal_country;
				$('#show_ein_data').removeClass('hide');
				$('#show_ein_data').show();
				$('.step2 #next_btn2').removeAttr('disabled');
				$('#b_name').html(b_name);
				$('#postal_address').html(postal_address);
				$('#postal_zip').html(postal_zip);
				$('#postal_city').html(postal_city);
				$('#postal_country').html(postal_country);
			    $('#EINb_name').val(b_name);
			    $('#EINpostal_address').val(postal_address);
			    $('#EINpostal_city').val(postal_city);
			    $('#EINpostal_country').val(postal_country);
			    $('#EINpostal_zip').val(postal_zip);
				
    		}
    		else if(complet_data.response.status == 'error'){
    			$('.response_message').show();
				$('.response_message').removeClass('hide');
				$('.response_message .alert-danger').html(complet_data.response.response.msg);
				$('.response_message .alert-danger').show();
				$('.response_message .alert-danger').removeClass('hide');
				$('#show_ein_data').hide();
				$('#show_ein_data').addClass('hide');
    		}
    	}

    	doAjax(params);
    	return;
                    
	},
	checkForm: function(){  
			var form1 = $('.step2');
            var error1 = $('.alert-error', form1);
            var success1 = $('.alert-success', form1);

            form1.validate({
                errorElement: 'label', //default input error message container
				errorClass: 'help-block help-block-error', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
                rules: {
                   	accept_terms: {
                        required: true
                    },                     
                },
               /* messages: {
					partner_first_name: {
						required: "Username is required."
					},
					partner_last_name: {
						required: "Password is required."
					}
				},*/
				invalidHandler: function(event, validator) { //display error alert on form submit   
					success1.hide();
                    error1.show();
				},
                highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
				},

				success: function(label) {
					label.closest('.form-group').removeClass('has-error');
					label.remove();
					$('.step1 .email_section .help-inline.help-small').hide(); 
				},

				errorPlacement: function(error, element) {
					var cont = $(element).parent('.input-group');
                    if (cont.size() > 0) {
                        cont.after(error);
                    } else {
                        element.after(error);
                    }
				},               

                submitHandler: function (form) {
                    //success1.show();                    
                    error1.hide(); 
                    var business_name = $('#EINb_name').val();
					var postal_address = $('#EINpostal_address').val();
					var postal_city = $('#EINpostal_city').val();
					var postal_country = $('#EINpostal_country').val();
					var postal_zip = $('#EINpostal_zip').val();     
				    if($.trim(business_name) == '' || $.trim(postal_address) == '' || $.trim(postal_city) == '' || $.trim(postal_country) == '' || $.trim(postal_country) == '' || $.trim(postal_zip) == ''){
						$('.response_message').show();
						$('.response_message').removeClass('hide');
						$('.response_message .alert-danger').show();
						$('.response_message .alert-danger').html(global_translationsData.translationsData.invalidein_msg);
						$('.response_message .alert-danger').removeClass('hide');
						}    
						else{
							$('.response_message').hide();
							$('.response_message').addClass('hide');
							$('.step2 #b_name').text(business_name);
						    $('.step2 #postal_address').text(postal_address);
						    $('.step2 #postal_city').text(postal_city);
						    $('.step2 #postal_country').text(postal_country);
						    $('.step2 #postal_zip').text(postal_zip);
							partner_register.saveDetail();							             
						}                  
                }
			
            });
	},
	editEINData: function(){
			$('#edit_ein_data').removeClass('hide');
		  $( "#show_ein_data" ).slideUp( 1000, function() {
			      $( "#edit_ein_data" ).slideDown( 1000, function() {
			      	var business_name = $('.step2 #b_name').text();
					var postal_address = $('.step2 #postal_address').text();
					var postal_city = $('.step2 #postal_city').text();
					var postal_country = $('.step2 #postal_country').text();
					var postal_zip = $('.step2 #postal_zip').text();
				    $('#EINb_name').val(business_name);
				    $('#EINpostal_address').val(postal_address);
				    $('#EINpostal_city').val(postal_city);
				    $('#EINpostal_country').val(postal_country);
				    $('#EINpostal_zip').val(postal_zip);            
					});
			  });
	},
	saveEINData: function(){
					var business_name = $('#EINb_name').val();
					var postal_address = $('#EINpostal_address').val();
					var postal_city = $('#EINpostal_city').val();
					var postal_country = $('#EINpostal_country').val();
					var postal_zip = $('#EINpostal_zip').val();	
					if($.trim(business_name) == '' || $.trim(postal_address) == '' || $.trim(postal_city) == '' || $.trim(postal_country) == '' || $.trim(postal_country) == '' || $.trim(postal_zip) == ''){
						$('.response_message').show();
						$('.response_message .alert-error-custom').show();
					}
					else{
					  $( "#edit_ein_data" ).slideUp( 1000, function() {		
					  	$('.response_message').hide();
						$('.response_message .alert-error-custom,.response_message .alert-danger').hide();  			
					      $( "#show_ein_data" ).slideDown( 1000, function() {					    					
							    $('.step2 #b_name').text(business_name);
							    $('.step2 #postal_address').text(postal_address);
							    $('.step2 #postal_city').text(postal_city);
							    $('.step2 #postal_country').text(postal_country);
							    $('.step2 #postal_zip').text(postal_zip);
							  });					  
						});
					}
	},
	saveDetail: function(){ 
		window.countryData = $(".step1 #PartnerPhone").intlTelInput("getSelectedCountryData");

		var from = $('#from_w').val();
		var social_data = $('#fromwdata').val();
		if(from == ''){
			social_data = '';
		}             
    	var total_params = {
			language:language,
			lang:lang,
			admin_id:admin_id,
			brand_id:brand_id,
			first_name:$('.step1 #PartnerFirstName').val(),
			last_name:$('.step1 #PartnerLastName').val(),
			cellphone:$('.step1 #PartnerPhone').val(),
			email:$('.step1 #PartnerEmail').val(),
			ein:$('.step2 #PartnerEIN').val(),
			business_name:$('.step2 #b_name').text(),
			postal_address:$('.step2 #postal_address').text(),
			postal_city:$('.step2 #postal_city').text(),
			postal_country:$('.step2 #postal_country').text(),
			postal_zip:$('.step2 #postal_zip').text(),
			country_data :window.countryData,	
			from:from,
			social_data:social_data		
    	};

    	var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Logins/partnerRegister.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				if("unique_key" in complet_data.response.response){
					window.location.href = BASE_URL + 'verify/'+complet_data.response.response.unique_key;
					return;
				}
				$('.step1').hide();
				$('.response_message').show();
				$('.response_message').removeClass('hide');
				$('.response_message .alert-success').html(complet_data.response.response.msg);
				$('.response_message .alert-success').show();
				$('.response_message .alert-success').removeClass('hide');
				$('.response_message .alert-danger,.response_message .alert-error-custom').hide();
				$('#last_req_id').val(complet_data.response.response.last_id);
				if(complet_data.response.response.req_user == 'no'){
					$('.resend_link').show();
					$('.resend_link').removeClass('hide');
				}
				else if(complet_data.response.response.req_user == 'yes'){
					$('.resend_link').hide();						
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					//showAlertMessage(array,'error','Error');
					$('.response_message').show();
					$('.response_message').removeClass('hide');
					$('.response_message .alert-danger').html(array);
					$('.response_message .alert-danger').show();
					$('.response_message .alert-danger').removeClass('hide');
					$('.response_message .alert-error-custom').hide();
					return;

				}else{
					$('.response_message').show();
					$('.response_message').removeClass('hide');
					$('.response_message .alert-danger').html(complet_data.response.response.msg);
					$('.response_message .alert-danger').show();
					$('.response_message .alert-danger').removeClass('hide');
					$('.response_message .alert-error-custom').hide();
					//showAlertMessage(complet_data.response.response.msg,'error','Error');
				}
			}
		}

		

    	$('.step2').hide();
		showProcessingImage();
		doAjax(params);
		return;
    						
	},
	resendLink : function(){
		var total_params = {
			language:language,
			lang:lang,
			admin_id:admin_id,
			brand_id:brand_id,
			email:$('.step1 #PartnerEmail').val(),
			req_id : $('#last_req_id').val(),		
    	};
    	var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Logins/partnerResendLink.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complet_data){

			if(complet_data.response.status == 'success'){
				$('.response_message').show();
				$('.response_message').removeClass('hide');
				$('.response_message .alert-success').html(complet_data.response.response.msg);
				$('.response_message .alert-success').show();
				$('.response_message .alert-success').removeClass('hide');
				$('.response_message .alert-danger,.response_message .alert-error-custom').hide();
				$('.resend_link').hide();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					//showAlertMessage(array,'error','Error');
					$('.response_message').show();
					$('.response_message').removeClass('hide');
					$('.response_message .alert-danger').html(array);
					$('.response_message .alert-danger').show();
					$('.response_message .alert-danger').removeClass('hide');
					$('.response_message .alert-error-custom').hide();
					return;

				}else{
					$('.response_message').show();
					$('.response_message').removeClass('hide');
					$('.response_message .alert-danger').html(complet_data.response.response.msg);
					$('.response_message .alert-danger').show();
					$('.response_message .alert-danger').removeClass('hide');
					$('.response_message .alert-error-custom').hide();
					//showAlertMessage(complet_data.response.response.msg,'error','Error');
					return;
				}	
			}
		}
		doAjax(params);		
		return;
	},
	
	
};

function limitNumbers(id,limit) {
	
	$(id).inputmask({ "mask": "9", "repeat": limit,"greedy": false});

}
 
