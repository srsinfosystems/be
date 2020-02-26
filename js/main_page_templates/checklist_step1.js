var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var partner_id = $('#partner_id').val();
var admin_id = $('#admin_id').val();
var lang = $('#lang').val();
var brand_id = $('#brand_id').val();
var use_member_centric = $('#use_member_centric').val();
var host_url = $('#HOST_URL').val();
if(use_member_centric == '1' && lang == 'nb'){
	language = 'nor/member';
}
else if(use_member_centric == '1' && lang == 'en'){
	language = 'eng/member';
}
var err = true;
var global_data;
var step = {
  aInternal: 10,
  aListener: function(val) {},
  set which(val) {
    this.aInternal = val;
    this.aListener(val);
  },
  get which() {
    return this.aInternal;
  },
  registerListener: function(listener) {
    this.aListener = listener;
  }
}


if(tabfunc!=undefined){
	delete tabfunc;

}
var global_answers;
var global_translationsData;
var tabfunc = {
	start: function(){
		tabfunc.listenForData();
		step.which = 1;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			admin_id:admin_id,
			partner_id:partner_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['step1_title','select','HTML','TEXT','Next','previous','opening_hour','days','from','eg1','to','eg2','Monday','Friday','Saturday','Sunday','fetch_customer_information','bank_ac','confirm_password','new_password','password_setting','Yes','No','vat_required','kid_required','reset_password','Please check the form','Error','Products','Product name','Select','Product unit','VAT','Price group','Price','Customers','Type','Consumer','Business','Date of birth','EIN','First name','Last name','Customer name','Email','Cellphone','Standard','Save and add more'],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Checklists/getProductData.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complet_data){

			if(complet_data.response.status == 'success'){
				global_data = complet_data.response.response;
				global_translationsData = complet_data.response.response.translationsData;
				//console.log(global_data);
				tabfunc.createHtml();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',alertmessage);
					return;
				}
			}
		}
		doAjax(params);		
		return;

	},
	createHtml:function(){
		var template = document.getElementById('checklist_step1_template').innerHTML;
		var compiledRendered = Template7(template,global_data);
		document.getElementById('content').innerHTML = compiledRendered;
		console.log('geee');
		tabfunc.bindEvents();
		$('#product_unit,#product_vat').select2({
			minimumResultsForSearch:-1,
			allowClear:true,
			placeholder:global_translationsData.Select,
		});

		$('#customer_type').select2({
			minimumResultsForSearch:-1,
		});
		
		$("#partnerCellphone").intlTelInput({
		initialCountry: "auto",
		  geoIpLookup: function(callback) {
		    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
		      var countryCode = (resp && resp.country) ? resp.country : "";
		      callback(countryCode);
		    });
		  },
		 });
		if($('#check_step_1').hasClass('done')){
			$('#check_sidebar #check_step_1').removeClass('error');
		}		

	},
	bindEvents:function(){
		 toastr.options = { 
		 	"closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
       
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "tapToDismiss": "true",
            "toaster-id":"features-toaster-container"   
          };

		$('#customer_vat_required,#customer_kid_required,#reset_pass').bootstrapSwitch();	

		

		$('#reset_pass').on('switchChange.bootstrapSwitch', function (event, state) {
			    if(state) {
			  //   	$( "#partnerNewPassword" ).rules( "add", {
					// 	required: true,
					// });
			  //       $( "#partnerConfirmPassword" ).rules( "add", {
					// 	required: true,
					// 	equalTo : "#partnerNewPassword"
					// });
			    	$('.reset_password').show();
			    }
			    else{
			    	$('.reset_password').hide();
			       // $( "#partnerNewPassword" ).rules( "remove");
			       // $( "#partnerConfirmPassword" ).rules( "remove" );
			    }
			   // tabfunc.checkForm();
			});

		$('#customer_type').change(function(){
			var v = $('#customer_type').val();
			if(v==1){
				$('.consumer').show();
				$('.business').hide();
			}
			else if(v==2){
				$('.consumer').hide();
				$('.business').show();
			}
		});
	},
	nextStep:function(){
			tabfunc.checkForm();
			if(step.which==1){
				$( "#partnerBankAC" ).rules( "add", {
					required: true,
					minlength: 12,
					digits: true,
				});
				if($('#reset_pass:checked').length==1){
					$( "#partnerNewPassword" ).rules( "add", {
						required: true,
					});
			        $( "#partnerConfirmPassword" ).rules( "add", {
						required: true,
						equalTo : "#partnerNewPassword"
					});
				}
				else{
					$( "#partnerNewPassword" ).rules( "remove");
				   	$( "#partnerConfirmPassword" ).rules( "remove" );
				}
			}
	},
	prevStep:function(){
		step.which = step.which - 1;
	},
	listenForData:function(){
		step.registerListener(function(val) {
			console.log(val);
			if(step.which!=1 && step.which!=2 && step.which!=3){
				step.which = 1;
				return;
			}
			$('.btn-circle').removeClass('active-step');
			$('#checklist_content').addClass('adj');
			if(val==1){
				$('.steps_check li:nth-child(1)').addClass('active');
				$('.one').addClass('active-step');
				$('.addmore').hide();
				//$('.login-bg').css('background-image','url('+host_url+'app/webroot/new_design/img/login/firststep.png)');
			}
			else if(val==2){
				$('.two').addClass('active-step');
				$('.addmore').show();
				//$('.login-bg').css('background-image','url('+host_url+'app/webroot/new_design/img/login/productbg.png)');
			}
			else if(val==3){
				$('.three').addClass('active-step');
				$('.addmore').show();
				//$('.login-bg').css('background-image','url('+host_url+'app/webroot/new_design/img/login/customerbg.png)');
				
			}
			if(val!=1){
				$('#previous_btn').show();
			}
			else{
				$('#previous_btn').hide();
			}
		 	$('.div_step').hide();
			$('.div_step_'+val).show();
		});
	},
	checkForm: function(){                       
			var form1 = $('#partner_general_setting');
            var error1 = $('.alert-error', form1);
            var success1 = $('.alert-success', form1);

            form1.validate({
                errorElement: 'label', //default input error message container
				errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                   

                },
                invalidHandler: function(event, validator) { //display error alert on form submit   
                	
					toastr.error(global_data.translationsData.Pleasechecktheform,global_data.translationsData.Error,);             
				},
				unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                     
                },
                highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
				},

                success: function (label) {
                   
                },

                submitHandler: function (form,e){
                	step.which = step.which + 1;
               		e.preventDefault();
                  	return false; 
                }
            });
	},
	generate_vat_list:function(data){
		var ret = '';
		for(var j in data){
			ret += '<option value="'+j+'">';
				ret += data[j].value;
			ret += '</option>';
		}
		
		return ret;
	},
	generate_unit_list:function(id,name){
		var ret = '<option value="'+id+'">';
			ret += name;
		ret += '</option>';
		return ret;
	},
	generate_price_group_list:function(id,name){
		
		var ret = '';
	
			ret += '<tr>';
				ret += '<td>'+name+'</td>';
				ret += '<td><input   style="margin-bottom:0" type="text" class="form-control form-control-solid placeholder-no-fix form-group"></td>';
			ret += '</tr>';
		
		
		return ret;
	}
	
};


Template7.registerHelper('ChecklistsVatHelper', function (data){
	return tabfunc.generate_vat_list(data);
});

Template7.registerHelper('ChecklistsUnitHelper', function (id,name){
	return tabfunc.generate_unit_list(id,name);
});


Template7.registerHelper('ChecklistsPriceGroupHelper', function (id,name){
	return tabfunc.generate_price_group_list(id,name);
});
