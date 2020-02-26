var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var global_manual_schedule_popupid = 'popups';
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var global_vr_metadata;
var global_vr_data;
var global_vr_transData;
var voluntary_report = {
	start: function(popups,metadata=''){
		global_vr_metadata=metadata;

		global_manual_schedule_popupid = popups;
		voluntary_report.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Generate participant list','Download','Delivery','Email','Select','Distribution','To custom email address','To myself','To manager','Generate report','Cancel','Alert Message','Please check the following fields','alert message','Report generated successfully1period1','Report distributed successfully1period1','success','Success','From date','To date','Date','Custom email address','To myself','To other staffer','Select staff','All','Staff'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/voluntary_report.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				$.each(complet_data.response.response.translationsData, function (key, val) {
			        var str = val.replace(/1period1/g, ".");
			       	str = str.replace(/1comma1/g, ",");
			       	str = str.replace(/1que1/g, "?");
			        complet_data.response.response.translationsData[key] = str;
			    });
				global_vr_data= complet_data.response.response;
				global_vr_transData = complet_data.response.response.translationsData;
				voluntary_report.createHtml();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_vr_transData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_vr_transData.alertmessage);
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
		global_vr_data.date_format_f = date_format_f;
		var template = document.getElementById('voluntary_report_template').innerHTML;
		var compiledRendered = Template7(template, global_vr_data);
		document.getElementById(global_manual_schedule_popupid).innerHTML = compiledRendered;
		resizemodal(global_manual_schedule_popupid);
		voluntary_report.bindEvents();
	},
	bindEvents:function(){
		$('#'+global_manual_schedule_popupid).resize();
   		$('input[type=radio]').uniform();

   		$('#voluntary_report_template_form #from_date,#voluntary_report_template_form #to_date').datepicker({
   			format:global_vr_data.date_format_f,
   			
   		}).change(function(){
   			$('.datepicker').remove();
   		});

   		var opts = '';
   		for(var j in global_vr_data.getAllContactsEmail){
   			opts += '<option value="'+global_vr_data.getAllContactsEmail[j]+'">'+global_vr_data.getAllContactsEmail[j]+'</option>';
   		}
   		$('#to_staffers').append(opts).select2({
   			placeholder: global_vr_transData.Select,
			allowClear: true,
   		});

   		$('#voluntary_report_template_form #distribution').select2({
   			placeholder: global_vr_transData.Select,
			allowClear: true,
			minimumResultsForSearch:-1
   		}).change(function(){
   			var v = $('#voluntary_report_template_form #distribution').val();
   			if(v=='to_custom'){
   				 $('.staffer_email_wrapper').addClass('hide');
   				 $('.customer_email_wrapper').removeClass('hide');
   			}
   			else if(v=='to_staffers'){
   				 $('.staffer_email_wrapper').removeClass('hide');
   				 $('.customer_email_wrapper').addClass('hide');
   			}
   			else{
   				 $('.customer_email_wrapper,.staffer_email_wrapper').addClass('hide');
   			}
   		});

   		$('#voluntary_report_template_form #delivery').select2({
   			placeholder: global_vr_transData.Select,
			allowClear: true,
			minimumResultsForSearch:-1
   		}).change(function(){
   			var v = $('#voluntary_report_template_form #delivery').val();
   			if(v=='email'){
   				$('.distribution_wrapper').removeClass('hide');
   			}
   			else{
   				$('.distribution_wrapper').addClass('hide');
   			}
   			$('#voluntary_report_template_form #distribution').val('').trigger('change');
   		});


   		$('#voluntary_report_btn_save').click(function(){
   			voluntary_report.saveData();
   		});
	},
	saveData:function(){
		var from_date =  $("#voluntary_report_template_form #from_date").val();
		var to_date =  $("#voluntary_report_template_form #to_date").val();

		var delivery = $("#voluntary_report_template_form #delivery").val();
		var distribution = $("#voluntary_report_template_form #distribution").val();
		var custom_email = $("#voluntary_report_template_form #custom_email").val();
		var to_staffers =  $("#voluntary_report_template_form #to_staffers").val();

		var errmsg = '';
		if(checkNull(delivery)==''){
			errmsg += global_vr_transData.Delivery+'<br/>';
		}

		if(checkNull(from_date)==''){
			errmsg += global_vr_transData.Fromdate+'<br/>';
		}

		if(checkNull(to_date)==''){
			errmsg += global_vr_transData.Todate+'<br/>';
		}

		if(errmsg!=''){
			var finalerrmsg = global_vr_transData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_vr_transData.AlertMessage);
			return;
		}
		
		if(checkNull(delivery)=='email'){
			if(checkNull(distribution)==''){
				errmsg += global_vr_transData.Distribution+'<br/>';
			}
			else if(checkNull(distribution)=='to_custom'){

				var input = document.createElement('input');
			  	input.type = 'email';
			  	input.value = custom_email;
			 	var valid =  typeof input.checkValidity == 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(value);

				if(!valid || custom_email==''){
					errmsg += global_vr_transData.Email+'<br/>';
				}
			}
			else if(checkNull(distribution)=='to_staffers'){
				if(to_staffers==''){
					errmsg += global_vr_transData.Staff+'<br/>';
				}
			}
		}
		
		

		if(errmsg!=''){
			var finalerrmsg = global_vr_transData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_vr_transData.AlertMessage);
			return;
		}
		var from_date =  $("#voluntary_report_template_form #from_date").datepicker('getDate');
		from_date = moment(from_date).format('YYYY-MM-DD');

		var to_date =  $("#voluntary_report_template_form #to_date").datepicker('getDate');
		to_date = moment(to_date).format('YYYY-MM-DD');
		
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
			to_staffers:to_staffers,
			from_date:from_date,
			to_date:to_date,
			from:'reports',
			all_staffers:'',
			
		};
		if(to_staffers=='all'){
			total_params.all_staffers = JSON.stringify(global_vr_data.getAllContactsEmail);
		}
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/generateParticipantReport.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				console.log('testasaszzz');
				if(delivery=='download'){
					// var pdf_info = complet_data.response.response.pdf_info;

					// var filename = checkNull(pdf_info.pdf_file);
					

					// if(filename!=''){
					// 	var dir = 'voluntary/'+partner_id+'/'+filename;
					
					// 	var path = APISERVER+'/api/downloads/report/'+btoa(dir)+'.json';
					// 	openPdf(path); 
					// }

					var excel_info = complet_data.response.response.excel_info;
					var excel_file_name = checkNull(excel_info.excel_file_name);
					if(excel_file_name != ''){
						var dir = 'voluntary/'+partner_id+'/'+excel_file_name;
						var path = APISERVER+'/api/downloads/report/'+btoa(dir)+'.json';
						openPdf(path); 
					}

					call_toastr(global_vr_transData.success, global_vr_transData.Success,global_vr_transData.Reportgeneratedsuccessfully1period1);
					
		
				}
				else{
					call_toastr(global_vr_transData.success, global_vr_transData.Success,global_vr_transData.Reportdistributedsuccessfully1period1);
				}
				voluntary_work_report.start();
				$('#'+global_manual_schedule_popupid).modal('hide');
				 
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(global_vr_transData.Pleasecheckthefollowingfields+ ':<br/>' +array,'error',global_vr_transData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_vr_transData.alertmessage);
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
