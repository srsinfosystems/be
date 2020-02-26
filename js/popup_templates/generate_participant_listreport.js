var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var global_manual_schedule_popupid = 'popups';
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var global_gplr_metadata;
var global_gplr_data;
var global_gplr_transData;
var generate_participant_listreport = {
	start: function(popups,metadata){
		global_gplr_metadata=metadata;

		global_manual_schedule_popupid = popups;
		generate_participant_listreport.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Generate participant list','Download','Delivery','Email','Select','Distribution','To custom email address','To myself','To manager','Generate report','Cancel','Alert Message','Please check the following fields','alert message','Report generated successfully1period1','Report distributed successfully1period1','success','Success'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getAllScheduleTemplates.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				$.each(complet_data.response.response.translationsData, function (key, val) {
			        var str = val.replace(/1period1/g, ".");
			       	str = str.replace(/1comma1/g, ",");
			       	str = str.replace(/1que1/g, "?");
			        complet_data.response.response.translationsData[key] = str;
			    });
				global_gplr_data= complet_data.response.response;
				global_gplr_transData = complet_data.response.response.translationsData;
				generate_participant_listreport.createHtml();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_gplr_transData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_gplr_transData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		global_gplr_data.date_format_f = date_format_f;
		var template = document.getElementById('generate_participant_listreport_template').innerHTML;
		var compiledRendered = Template7(template, global_gplr_data);
		document.getElementById(global_manual_schedule_popupid).innerHTML = compiledRendered;
		resizemodal(global_manual_schedule_popupid);
		generate_participant_listreport.bindEvents();
	},
	bindEvents:function(){
		$('#'+global_manual_schedule_popupid).resize();
   		$('input[type=radio]').uniform();
   		//var html = ''
   		

   		var emailopts = '<option value="to_staffer">'+global_gplr_transData.Tomyself+'</option>';
   		if(global_gplr_metadata.manager_count>0){
   			emailopts += '<option value="to_managers">'+global_gplr_transData.Tomanager+'</option>';
   		}
   		emailopts += '<option value="to_custom">'+global_gplr_transData.Tocustomemailaddress+'</option>';

   		$('#generate_participant_listreport_template_form #distribution').append(emailopts).select2({
   			placeholder: global_gplr_transData.Select,
			allowClear: true,
			minimumResultsForSearch:-1
   		}).change(function(){
   			var v = $('#generate_participant_listreport_template_form #distribution').val();
   			if(v=='to_custom'){
   				$('.customer_email_wrapper').removeClass('hide');
   			}
   			else{
   				$('.customer_email_wrapper').addClass('hide');
   			}
   		});

   		$('#generate_participant_listreport_template_form #delivery').select2({
   			placeholder: global_gplr_transData.Select,
			allowClear: true,
			minimumResultsForSearch:-1
   		}).change(function(){
   			var v = $('#generate_participant_listreport_template_form #delivery').val();
   			if(v=='email'){
   				$('.distribution_wrapper').removeClass('hide');
   			}
   			else{
   				$('.distribution_wrapper').addClass('hide');
   			}
   			$('#generate_participant_listreport_template_form #distribution').val('').trigger('change');
   		});


   		$('#generate_participant_listreport_btn_save').click(function(){
   			generate_participant_listreport.saveData();
   		});
	},
	saveData:function(){

		var delivery = $("#generate_participant_listreport_template_form #delivery").val();
		var distribution = $("#generate_participant_listreport_template_form #distribution").val();
		var custom_email = $("#generate_participant_listreport_template_form #custom_email").val();
		var errmsg = '';
		if(checkNull(delivery)==''){
			errmsg += global_gplr_transData.Delivery+'<br/>';
		}
		else{
			if(checkNull(delivery)=='email'){
				if(checkNull(distribution)==''){
					errmsg += global_gplr_transData.Distribution+'<br/>';
				}
				else if(checkNull(distribution)=='to_custom'){

					var input = document.createElement('input');
				  	input.type = 'email';
				  	input.value = custom_email;
				 	var valid =  typeof input.checkValidity == 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(value);

					if(!valid || custom_email==''){
						errmsg += global_gplr_transData.Email+'<br/>';
					}
				}
			}
		}
		

		if(errmsg!=''){
			var finalerrmsg = global_gplr_transData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_gplr_transData.AlertMessage);
			return;
		}
		showProcessingImage('undefined');
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			delivery:delivery,
			distribution:distribution,
			custom_email:custom_email,
			schedule_id:global_gplr_metadata.id
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/generateParticipantReport.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				
				if(delivery=='download'){
					var pdf_info = complet_data.response.response.pdf_info;

					var filename = checkNull(pdf_info.pdf_file);
					

					if(filename!=''){
						var dir = 'voluntary/'+partner_id+'/'+filename;
					
						var path = APISERVER+'/api/downloads/report/'+btoa(dir)+'.json';
						openPdf(path); 
					}
					call_toastr(global_gplr_transData.success, global_gplr_transData.Success,global_gplr_transData.Reportgeneratedsuccessfully1period1);

		
				}
				else{
					call_toastr(global_gplr_transData.success, global_gplr_transData.Success,global_gplr_transData.Reportdistributedsuccessfully1period1);
				}
				$('#'+global_manual_schedule_popupid).modal('hide');
				 
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(global_gplr_transData.Pleasecheckthefollowingfields+ ':<br/>' +array,'error',global_gplr_transData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_gplr_transData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	listenForData:function(){
	},
};
