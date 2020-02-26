var FormWizard = function () {


    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().bootstrapWizard) {
                return;
            }

            function format(state) {
                if (!state.id) return state.text; // optgroup
                return "<img class='flag' src='assets/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
            }
           
            

            var form = $('#frmAddNewTrigger');
            var error = $('.alert-error', form);
            var success = $('.alert-success', form);

            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'validate-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    //account
                    /*username: {
                        minlength: 5,
                        required: true
                    },                    
                    //profile                   
                    email: {
                        required: true,
                        email: true
                    }, 
                    */
                    'data[Trigger][triggeredaction]': {
                        required: true
                    },
                    'data[Trigger][recipients]': {
                        required: true
                    },
                    card_name: {
                        required: true,
                    },
                    'data[Trigger][custom_subject]': {
                        required: true,
                    },
                    'data[Trigger][custom_text]': {
                        required: true,
                    },
                    'data[Trigger][test_email]': {
                        required: true,
                    },
                    'data[Trigger][custom_text_sms]': {
                        required: true,
                    },
                    'data[Trigger][test_sms]': {
                        required: true,
                    },
                    test_email: {
                        required: true,
                    },
                    editor1: {
                        required: true
                    },                   
                    //payment                   
                    /*card_number: {
                        minlength: 16,
                        maxlength: 16,
                        required: true
                    },
                    card_cvc: {
                        digits: true,
                        required: true,
                        minlength: 3,
                        maxlength: 4
                    },
                    card_expiry_mm: {
                        digits: true,
                        required: true
                    },
                    card_expiry_yyyy: {
                        digits: true,
                        required: true
                    },
                    'payment[]': {
                        required: true,
                        minlength: 1
                    },*/                    
                    'group_ids[]': {
                        required: true,
                        minlength: 1
                    }
                },

                messages: { // custom messages for radio buttons and checkboxes
                    'payment[]': {
                        required: $('#select_an_option').val(),
                        minlength: jQuery.format($('#select_an_option').val())
                    },
                    'group_ids[]': {
                        required: $('#select_an_group').val(),
                        minlength: jQuery.format($('#select_an_group').val())
                    }
                },

                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_gender_error");
                    } else if (element.attr("name") == "payment[]") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_payment_error");
                    } else if (element.attr("name") == "group_ids[]") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_payment_error");
                    } else if (element.attr("name") == "editor1" || element.attr("name") == "data[Trigger][custom_text]") { // for wysiwyg editors
                       // error.insertAfter($(element.attr('data-error-container'))); 
                        error.addClass("no-left-padding").insertAfter("#form_editorr_error").html($('#show_required_field').val());
                       // $("#custom_text").addClass('custom_text_remove_gap');
                     } else if (element.attr("name") == "data[Trigger][custom_subject]" ) {   
						  error.addClass("no-left-padding").insertAfter("#form_subject_error").html($('#show_required_field').val());                        
                    } else {
                        error.insertAfter(element).html($('#show_required_field').val()); // for other inputs, just perform default behavior
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit   
                    success.hide();
                    error.show();
                    App.scrollTo(error, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radio buttons, no need to show OK icon
                        label
                            .closest('.control-group').removeClass('error').addClass('success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid ok') // mark the current input as valid and display OK icon
                        .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                    }
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }

            });

            var displayConfirm = function() {
                $('.display-value', form).each(function(){
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.attr("data-title"));
                    } else if ($(this).attr("data-display") == 'card_expiry') {
                        $(this).html($('[name="card_expiry_mm"]', form).val() + '/' + $('[name="card_expiry_yyyy"]', form).val());
                    } else if ($(this).attr("data-display") == 'payment') {
                        var payment = [];
                        $('[name="payment[]"]').each(function(){
                            payment.push($(this).attr('data-title'));
                        });
                        $(this).html(payment.join("<br>"));
                    }
                });
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index) {
                    //alert('on tab click disabled');
                    return false;
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    if (form.valid() == false) {
                        return false;
                    }

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    
                    var steps_name 	= $('#steps_name').val();
                    var of_name 	= $('#of_name').val();
                    
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text(steps_name+' ' + (index + 1) +' '+of_name+' ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }
                    
                    
                    $(".send_test_msg").hide();
                    $(".send_orig_msg").hide();
                    $(".send_cancel").hide();
                    $("#btn_continue").show();
                    //$(".send_another_orig_msg").hide();

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } 
                    else {
						
						var total_recipients_count = 0;
						var tot_val = '';
						$(".selectgroups").each(function(){			
							var id = $(this).attr('id');		
							var prop2 = $(this).prop('checked');	
							
							if(prop2 == true){
								var recipients_count_id = $("#recipients_count_id_"+id).html();
								
								var total_recipients_count_id_spl = 0;
								if(recipients_count_id != ''){
									var n4 = recipients_count_id.indexOf("&nbsp; "); 			
									if(n4 == '-1'){
										var total_recipients_count_id_spl = 1;
									}
									else{								
										var recipients_count_id_spl = recipients_count_id.split("&nbsp; ");
										var total_recipients_count_id_spl = recipients_count_id_spl[1];
									}
								}
								var recipients_count_id_int = parseInt(total_recipients_count_id_spl);
								total_recipients_count = parseInt(total_recipients_count) + parseInt(recipients_count_id_int);	
								
								
								var total_customer_ids = $("#total_customer_ids_"+id).val();
								var total_unselected_customer_ids = $("#final_total_unselected_customer_ids_"+id).val();
								
								var total_customer_cnt = 0;
								var total_un_customer_cnt = 0;
								
								if(total_customer_ids != ''){
									var n7 = total_customer_ids.indexOf(","); 			
									if(n7 == '-1'){
										var total_customer_ids_spl = total_customer_ids.split(",");
										var total_customer_cnt = 1;
									}
									else{								
										var total_customer_ids_spl = total_customer_ids.split(",");
										var total_customer_cnt = total_customer_ids_spl.length;
									}
									
									if(total_unselected_customer_ids != ''){
										var n8 = total_unselected_customer_ids.indexOf(","); 			
										if(n8 == '-1'){											
											var total_unselected_customer_ids_spl = total_unselected_customer_ids.split(",");
											var total_un_customer_cnt = 1;
										}
										else{								
											var total_unselected_customer_ids_spl = total_unselected_customer_ids.split(",");
											var total_un_customer_cnt = total_unselected_customer_ids_spl.length;
										}
									}
									
									if(total_customer_cnt != 0){
										if(total_customer_cnt == total_un_customer_cnt){
											
										}
										else{
											if(total_un_customer_cnt == 0){
												if(tot_val == '')
													tot_val = total_customer_ids;
												else
													tot_val = tot_val+","+total_customer_ids;
											}
											else{		
												var all_val = '';											
												for(j = 0; j < total_un_customer_cnt; j++){
													var find_val = total_unselected_customer_ids_spl[j];
													
													var find_arr = jQuery.inArray(find_val, total_customer_ids_spl);
													
													if(find_arr != -1){																										
														total_customer_ids_spl.splice(find_arr, 1);		
													}													
												}	
												if(tot_val == '')
													tot_val = total_customer_ids_spl;
												else
													tot_val = tot_val+","+total_customer_ids_spl;												
											}
										}
									}	
								}
							}				
						});
						
						if(total_recipients_count <= 0){
							showAlertMessage("Recipients count is not exist for groups",'error');
							return false;
						}						
						$("#TriggerAllCustomersValue").val(tot_val);
						
						var TriggerAllCustomersValue = $("#TriggerAllCustomersValue").val();
						if(TriggerAllCustomersValue <= 0){
							showAlertMessage("Recipients count is not exist for groups",'error');
							return false;
						}	
											
						
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                        $("#hidden_id_send_orig_message").hide();
                       
                        $(".send_cancel").show();
                        displayConfirm();
                    } else {						
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                       
                    }
                    if (current == 3) {
						 $(".send_test_msg").show();
						 $(".send_orig_msg").show();
						 $("#btn_continue").hide();
					}
					if(current == 4){
						$("#btn_continue").hide();
						$("#btn_back").hide();
						//$(".send_another_orig_msg").show();
					}
					if(current == 5){
						$("#btn_back").hide();
					}
                   
                    App.scrollTo($('.page-title'));
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    // set wizard title
                    
                    var steps_name 	= $('#steps_name').val();
                    var of_name 	= $('#of_name').val();
                    
                    $('.step-title', $('#form_wizard_1')).text(steps_name+' ' + (index + 1) + ' '+of_name+' ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }
                     $(".send_test_msg").hide();
                     $(".send_orig_msg").hide();
                     $(".send_cancel").hide();
                     $("#btn_continue").show();
                    //$(".send_another_orig_msg").hide();

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                        $("#hidden_id_send_orig_message").hide();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }
                    
                     if (current == 3) {
                         $(".send_test_msg").show();
                         $(".send_orig_msg").show();
                         $("#btn_continue").hide();
                    } 
                    
                    if(current == 4){
						$("#btn_continue").hide();
						$("#btn_back").hide();
						//$(".send_another_orig_msg").show();
					}
					if(current == 5){
						$("#btn_back").hide();
					}
                    App.scrollTo($('.page-title'));
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.bar_wizard').css({
                        width: $percent + '%'
                    });
                }
            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').click(function () {
				
				if (form.valid() == false) {
					return false;
				}			
					
				
				$("#btn_save").click();                    
              
            }).hide();
        }

    };

}();
