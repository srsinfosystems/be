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
           
            

            var form = $('#frmNewInvoice');
            var error = $('.alert-error', form);
            var success = $('.alert-success', form);

            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'validate-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {                    
                  /* 'data[sales][invoice_date]': {
                        required: true
                    },    */
                    'data[sales][due_date]': {
                        required: true,
                    },   
                     'data[sales][sales_date]': {
                        required: true,
                    },                                      
                    /*'data[sales][message_in_own_words]': {
                        required: true,
                    },  */          
                    'group_ids[]': {
                        required: true,
                        minlength: 1
                    } /*,
                   'salesProduct.product_number[]': {
                        required: true,
                        minlength: 1
                    }   */                
                },

                messages: { // custom messages for radio buttons and checkboxes
                    'payment[]': {
                        required: "Please select at least one option",
                        minlength: jQuery.format("Please select at least one option")
                    },
                    'group_ids[]': {
                        required: "Please select at least one gruoup",
                        minlength: jQuery.format("Please select at least one gruoup")
                    }/*,
                    'salesProduct.product_number[]': {
                        required: "Please select at least one product",
                        minlength: jQuery.format("Please select at least one product")
                    }*/
                },

                errorPlacement: function (error, element) { // render error placement for each input type
                   if (element.attr("name") == "group_ids[]") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_payment_error");
                    } /*else if (element.attr("name") == "data[sales][invoice_date]") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertBefore("#form_invoice_date_error");
                    }*/ else if (element.attr("name") == "data[sales][due_date]" ) {   
						  error.addClass("no-left-padding").insertBefore("#form_due_date_error");                        
                    } else if (element.attr("name") == "data[sales][sales_date]" ) {   
						  error.addClass("no-left-padding").insertBefore("#form_sales_date_error");                        
                    } /*else if (element.attr("name") == "salesProduct.product_number[]") { // for uniform radio buttons, insert the after the given container
                        $("#form_product_number_error").html(error);
                    } */
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
					var wizard_steps = $("#wizard_steps").val();					
					if(wizard_steps == 3)
						success.hide();
					else
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
                    var steps_name 	= $('#steps_name').val();
                    var of_name 	= $('#of_name').val();
                    var current = index + 1;
                    $("#wizard_steps").val(current);
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text(steps_name+' ' + (index + 1) +' '+of_name+' ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }
                    
                    $("#id_send_orig_message").hide();
                    $(".send_cancel").hide();
                    $("#btn_continue").show();

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } 
                    else {		
						var total_recipients_count = 0;
						var tot_val = '';
						var tot_group_val = '';
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
								
								var reci_val = $("#recipients_count_id_"+id).html();
								if(reci_val != ' &nbsp; 0'){
									if(tot_group_val == '')								
										tot_group_val = id;
									else
										tot_group_val = tot_group_val+","+id;
								}
								
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
						$("#salesAllCustomersValue").val(tot_val);
						$("#salesAllGroupsValue").val(tot_group_val);
						
						var salesAllCustomersValue = $("#salesAllCustomersValue").val();
						if(salesAllCustomersValue <= 0){
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
						 var manual_dafault_val = $("#manual_dafault_val").val();
						 apply_tax = $('#apply_tax').val();
						 if(manual_dafault_val == 'manual'){
							 $("#product_line_page_default").hide();
							 $(".product_line_page_default1").hide();
							 $("#product_line_page_manually").show();
							 $(".product_line_page_manually1").show();							 
							 
							 $(".td_unit_price").show();
							 $(".td_unit").show();
							 if(apply_tax == 'Y')
								$('.class_sale_product_tax').show();
							//$(".td_mva").show();
							 $(".td_discount_kr").show();
							 //$(".td_discount_per").show();							 
							 $(".td_total_price").show();
							 $("#div_summary").show();								 
						 }
						 else{
							 $("#product_line_page_default").show();
							 $(".product_line_page_default1").show();
							 $("#product_line_page_manually").hide();
							 $(".product_line_page_manually1").hide();
							 							 
							 $(".td_unit_price").hide();
							 $(".td_unit").hide();
							 $('.class_sale_product_tax').hide();
							// $(".td_mva").hide();
							 $(".td_discount_kr").hide();
							 $(".td_discount_per").hide();
							 $(".td_total_price").hide();
							 $("#div_summary").hide();				 
						 }
						
						
						

						var manual_dafault_val = $("#manual_dafault_val").val();	
						$(".product_description_column").each(function( index ) {				
							var tr_id = $(this).closest('tr').attr('id');
							var tr_id_split = tr_id.split("sales_product_line_");
							var current_id = tr_id_split[1];							
							
							var text_line = $("#text_line_"+current_id).val();
							
							if(text_line == 'y'){		
								$('.unit_price_'+current_id).hide();
									$('.discount_amount_'+current_id).hide();
									$('.gross_amount_'+current_id).hide();		
									$('.unit_name_'+current_id).hide();
									$('.vat_dropdown_'+current_id).hide();						
								if(manual_dafault_val == 'manual'){		
									$('.product_description_column').attr('colspan','7');						 
								}
								else{		
									$('.product_description_column').attr('colspan','2');
								}							
							}		
							else{
								if(manual_dafault_val == 'manual'){	
									$('.unit_price_'+current_id).show();
									$('.discount_amount_'+current_id).show();
									$('.gross_amount_'+current_id).show();		
									$('.unit_name_'+current_id).show();
									$('.vat_dropdown_'+current_id).show();	
								}
							}					
						});
						
 
						
						 $("#id_send_orig_message").show();
						 $("#btn_continue").hide();
					}
					if(current == 4){
						$("#btn_continue").hide();
						$("#btn_back").hide();
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
                    
                    var steps_name 	= $('#steps_name').val();
                    var of_name 	= $('#of_name').val();
                    
                    $("#wizard_steps").val(current);
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text(steps_name+' ' + (index + 1) + ' '+of_name+' ' + total);
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }
                     $("#id_send_orig_message").hide();
                     $(".send_cancel").hide();
                     $("#btn_continue").show();

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
                         $("#id_send_orig_message").show();
                        $("#btn_continue").hide();                         
                    } 
                    
                    if(current == 4){
						$("#btn_continue").hide();
						$("#btn_back").hide();
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
