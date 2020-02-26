var BASE_URL = $('#BASE_URL').val();
var Login = function () {

	var handleLogin = function() {
		$('.login-form').validate({
            errorElement: 'label', //default input error message container
            errorClass: 'help-inline', // default input error message class
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
                },
                rpassword: {
                    equalTo: "#LoginsPassword",
                    required: true,
                },
                login_id: {
                    required: true,
                },
            },
            messages: {
                email: {
                    required: $('#username_msg').val(),
                    email:$('#invalid_email_msg').val(),
                },
                password: {
                    required: $('#password_msg').val(),
                },
                rpassword: {
                	required: $('#retype_pwd_msg').val(),
                    equalTo: $('#mismatch_pwd_msg').val(),
                },
                login_id: {
                	required: $('#required_field_msg').val(),
                },
            },

            invalidHandler: function (event, validator) { //display error alert on form submit   
                //$('.alert-error', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.control-group').addClass('error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.control-group').removeClass('error');
                label.remove();
            },
            errorPlacement: function (error, element) {
                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit();
                }
                return false;
            }
        });
	}

	var handleForgetPassword = function () {
		$('.forget-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	                email: {
	                    required: true,
	                    email: true
	                }
	            },
	            messages: {
	                email: {
	                    required: "Email is required."
	                }
	            },
	            invalidHandler: function (event, validator) { //display error alert on form submit   

	            },
	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },
	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },
	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },
	            submitHandler: function (form) {
	                form.submit();
	            }
	        });

	        $('.forget-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.forget-form').validate().form()) {
	                    $('.forget-form').submit();
	                }
	                return false;
	            }
	        });

	        jQuery('#forget-password').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.forget-form').show();
	        });

	        jQuery('#back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.forget-form').hide();
	        });
	}

	var handleRegister = function () {
		function format(state) 
		{
            if (!state.id) return state.text; // optgroup
            var res = BASE_URL.match(/partner/g);
            if(res){
            	 return "<img class='flag' src='"+BASE_URL+"../img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }else{
            	 return "<img class='flag' src='"+BASE_URL+"../../img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }
           
        }


		$("#PartnerCountry").select2({
		  	placeholder: '<i class="icon-map-marker"></i>&nbsp;Select a Country',
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });
		
		$("#PartnerConsumerCountry").select2({
		  	placeholder: '<i class="icon-map-marker"></i>&nbsp;Select a Country',
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });
		
		$("#CustomerCountry").select2({
		  	placeholder: '<i class="icon-map-marker"></i>&nbsp;Select a Country',
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });
		
		$("#CustomerConsumerCountry").select2({
		  	placeholder: '<i class="icon-map-marker"></i>&nbsp;Select a Country',
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });

			/*$('#PartnerCountry').change(function () {
                $('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });

			$('#PartnerConsumerCountry').change(function () {
				$('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });*/

		
		function validationRequiredForCustomerType(validateFor)
		{	
			currentType = '';
			if($("#PartnerUserGroupId").length)
				currentType =  $("#PartnerUserGroupId").val();
			else if($("#CustomerUserGroupId").length)
				currentType = $("#CustomerUserGroupId").val();
			
			currentTypeArr = currentType.split("##");
			
			 if(currentTypeArr[1] == '1')
				 if(validateFor == 'business' )
					 return true;
				 else
					 return false;
			 else
				 if(validateFor == 'consumer')
					 return true;
				 else
					 return false;
		}
			
         $('#partner_register_form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	            	user_group_id:{
						required: true,
					},
					/* 024 29-11-2014 25203, Make EIN optional if country is not Norway */
						/* ein: {
							required: {
								 depends: function(element) {
									return  validationRequiredForCustomerType('business')
								 }
							},
						}, */
					/* 024 29-11-2014 25203, Make EIN optional if country is not Norway */	
	                directory: {
	                    required: {
	                    	 depends: function(element) {
	                    		return  validationRequiredForCustomerType('business')
	                    	 }
	                    },
	                },
	                customer_name: {
	                    required: {
	                    	 depends: function(element) {	
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
					first_name: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
					last_name: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                email: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                    email: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                /* BugId: #18499 #024 12-05-2014 Postal address changes starts */
	                /*address1: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                }, */
	                /* BugId: #18499 #024 12-05-2014 Postal address changes ends */
	                city: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
					zip: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                country: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                password: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                rpassword: {
	                    equalTo: "#PartnerPassword",
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                consumer_first_name: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_last_name: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                /* 024 29-11-2014 25203, Make EIN optional if country is not Norway */
						/* consumer_date_of_birth: {
							required: {
								 depends: function(element) {
										return  validationRequiredForCustomerType('consumer')
									 }
								},
						}, */
					/* 024 29-11-2014 25203, Make EIN optional if country is not Norway */	
	                /* BugId: #18499 #024 12-05-2014 Postal address changes starts */
	                /*consumer_address1: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                }, */
	                /* BugId: #18499 #024 12-05-2014 Postal address changes ends */
	                consumer_zip: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_city: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_country: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_email: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                    email: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_password: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_rpassword: {
	                	 equalTo: "#PartnerConsumerPassword",
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_directory: {
	                    required: {
	                    	 depends: function(element) {
	                    		return  validationRequiredForCustomerType('consumer')
	                    	 }
	                    },
	                },
	                tnc: {
	                    required: true
	                }
	            },
	            messages: { // custom messages for radio buttons and checkboxes
	            	user_group_id: {
	                    required: $('#required_field_msg').val(),
	                },
	                /* 024 29-11-2014 25203, Make EIN optional if country is not Norway */
						/*ein: {
							required: $('#required_field_msg').val(),
						}, */
					/* 024 29-11-2014 25203, Make EIN optional if country is not Norway */	
	            	directory: {
	                    required: $('#required_field_msg').val(),
	                },
	            	customer_name: {
	                    required: $('#required_field_msg').val(),
	                },
	            	first_name: {
	                    required: $('#required_field_msg').val(),
	                },
	            	last_name :{
	                    required: $('#required_field_msg').val(),
	                },
	            	email: {
	                    required: $('#required_field_msg').val(),
	                    email:$('#invalid_email_msg').val(),
	                },
	            	city: {
	                    required: $('#required_field_msg').val(),
	                },
	            	zip: {
	                    required: $('#required_field_msg').val(),
	                },
	            	country: {
	                    required: $('#required_field_msg').val(),
	                },
	            	password: {
	                    required: $('#required_field_msg').val(),
	                },
	            	rpassword: {
	                    required: $('#required_field_msg').val(),
	                    equalTo: $('#mismatch_pwd_msg').val(),
	                },


	            	consumer_first_name: {
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_last_name: {
	                    required: $('#required_field_msg').val(),
	                },
	            	/* consumer_date_of_birth: {
	                    required: $('#required_field_msg').val(),
	                }, */
	            	consumer_zip:{
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_city: {
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_country :{
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_email :{
	                    required: $('#required_field_msg').val(),
	                    email:$('#invalid_email_msg').val(),
	                },
	            	consumer_password :{
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_rpassword: {
	                    required: $('#required_field_msg').val(),
	                    equalTo: $('#mismatch_pwd_msg').val(),
	                },
	            	consumer_directory :{
	                    required: $('#required_field_msg').val(),
	                },
	                tnc: {
	                    required: $('#tnc_field_msg').val(),
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
	                    error.addClass('help-small no-left-padding').insertAfter($('#register_tnc_error'));
	                } else if (element.closest('.input-icon').size() === 1) {
	                    error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	                } else {
	                	error.addClass('help-small no-left-padding').insertAfter(element);
	                }
	            },

	            submitHandler: function (form) {
	                form.submit();
	            }
	        });
			
			$('#partner_register_form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.register-form').validate().form()) {
	                    $('.register-form').submit();
	                }
	                return false;
	            }
	        });


	        jQuery('#register-btn').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.register-form').show();
	        });

	        jQuery('#register-back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.register-form').hide();
	        });
	        
	        $('#customer_register_form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	            	user_group_id:{
						required: true
					},
					/* 024 29-11-2014 25203, Make EIN optional if country is not Norway */
						/*ein: {
							required: {
								 depends: function(element) {
									return  validationRequiredForCustomerType('business')
								 }
							},
						},*/
					/* 024 29-11-2014 25203, Make EIN optional if country is not Norway */	
	                customer_name: {
	                    required: {
	                    	 depends: function(element) {	
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
					first_name: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
					last_name: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                email: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                    email: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                /* BugId: #18499 #024 12-05-2014 Postal address changes starts */
	                /* address1: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                }, */
	                /* BugId: #18499 #024 12-05-2014 Postal address changes ends */
	                city: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
					zip: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                country: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                password: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                rpassword: {
	                    equalTo: "#CustomerPassword",
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('business')
		                    	 }
		                    },
	                },
	                consumer_first_name: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_last_name: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	               /* 024 29-11-2014 25203, Make EIN optional if country is not Norway */
						/*consumer_date_of_birth: {
							required: {
								 depends: function(element) {
										return  validationRequiredForCustomerType('consumer')
									 }
								},
						},*/
					 /* 024 29-11-2014 25203, Make EIN optional if country is not Norway */
	                /* BugId: #18499 #024 12-05-2014 Postal address changes starts */
	                /* consumer_address1: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                }, */
	                /* BugId: #18499 #024 12-05-2014 Postal address changes starts */
	                consumer_zip: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_city: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_country: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_email: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_password: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                consumer_rpassword: {
	                    required: {
	                    	 depends: function(element) {
		                    		return  validationRequiredForCustomerType('consumer')
		                    	 }
		                    },
	                },
	                tnc: {
	                    required: true
	                }
	            },
	            messages: { // custom messages for radio buttons and checkboxes
	            	user_group_id: {
	                    required: $('#required_field_msg').val(),
	                },
	                /* 024 29-11-2014 25203, Make EIN optional if country is not Norway */
						/*ein: {
							required: $('#required_field_msg').val(),
						}, */
	                /* 024 29-11-2014 25203, Make EIN optional if country is not Norway */
	            	directory: {
	                    required: $('#required_field_msg').val(),
	                },
	            	customer_name: {
	                    required: $('#required_field_msg').val(),
	                },
	            	first_name: {
	                    required: $('#required_field_msg').val(),
	                },
	            	last_name :{
	                    required: $('#required_field_msg').val(),
	                },
	            	email: {
	                    required: $('#required_field_msg').val(),
	                    email:$('#invalid_email_msg').val(),
	                },
	            	city: {
	                    required: $('#required_field_msg').val(),
	                },
	            	zip: {
	                    required: $('#required_field_msg').val(),
	                },
	            	country: {
	                    required: $('#required_field_msg').val(),
	                },
	            	password: {
	                    required: $('#required_field_msg').val(),
	                },
	            	rpassword: {
	                    required: $('#required_field_msg').val(),
	                    equalTo: $('#mismatch_pwd_msg').val(),
	                },


	            	consumer_first_name: {
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_last_name: {
	                    required: $('#required_field_msg').val(),
	                },
	            	/* consumer_date_of_birth: {
	                    required: $('#required_field_msg').val(),
	                }, */
	            	consumer_zip:{
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_city: {
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_country :{
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_email :{
	                    required: $('#required_field_msg').val(),
	                    email:$('#invalid_email_msg').val(),
	                },
	            	consumer_password :{
	                    required: $('#required_field_msg').val(),
	                },
	            	consumer_rpassword: {
	                    required: $('#required_field_msg').val(),
	                    equalTo: $('#mismatch_pwd_msg').val(),
	                },
	            	consumer_directory :{
	                    required: $('#required_field_msg').val(),
	                },
	                tnc: {
	                    required: $('#tnc_field_msg').val(),
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
	                    error.addClass('help-small no-left-padding').insertAfter($('#register_tnc_error'));
	                } else if (element.closest('.input-icon').size() === 1) {
	                    error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	                } else {
	                	error.addClass('help-small no-left-padding').insertAfter(element);
	                }
	            },

	            submitHandler: function (form) {
	                form.submit();
	            }
	        });
			
			$('#customer_register_form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.register-form').validate().form()) {
	                    $('.register-form').submit();
	                }
	                return false;
	            }
	        });


	        jQuery('#register-btn').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.register-form').show();
	        });

	        jQuery('#register-back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.register-form').hide();
	        });
	}
    
    return {
        //main function to initiate the module
        init: function () {
        	
           // handleLogin();
            handleForgetPassword();
            handleRegister();        
	       
        }

    };

}();
