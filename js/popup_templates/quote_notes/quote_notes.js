var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();

var qn_meta;
var qn_dt;
var qn_ppid = 'popups';
var qn_td;
var followedUpList = {};
var followedupStaff = {};
var taskTypes = {};
var quote_notes = {
	start:function(popupid,metadata={}){
		qn_ppid = popupid;
		qn_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			quote_id:metadata.quote_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Please check the following fields','Alert message','alert message','Success','$nw_nt_or_fllu','Note','$do_a_fllu','Follow up','None','$app_seller','$app_staffer','Create task','Send to Televakt','Date','Start','Staff','Please check the following fields'],		
		};
		if(qn_meta.id!=null && qn_meta.id!=undefined && qn_meta!=''){
			total_params.id = qn_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/getQuoteNotesAndFollowUp.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				qn_dt = complet_data.response.response;
				qn_td = complet_data.response.response.translationsData;
				quote_notes.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',qn_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qn_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		followedUpList = {
			sellers_followup_list:qn_td.$app_seller,
			staffers_followup_list:qn_td.$app_staffer,
			create_task:qn_td.Createtask,
		};
		if(qn_dt.getPartnerCustomSettings.PartnerSetting.televakt_subscription_enabled == 1){
			followedUpList.send_televakt = qn_td.SendtoTelevakt;
		}
		qn_dt.followedUpList = followedUpList;

		followedupStaff = qn_dt.getAllContactsEmail;
		for(var j in followedupStaff){
			followedupStaff[j] = followedupStaff[j].replace('<','&lt');
			followedupStaff[j] = followedupStaff[j].replace('>','&gt');
		}
		qn_dt.followedupStaff = followedupStaff;
		taskTypes = qn_dt.task_types;
		qn_dt.taskTypes = taskTypes;

		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}

		qd_dt.date_format_f = date_format_f;

		var template = document.getElementById('quote_notes_template').innerHTML;
		var compiledRendered = Template7(template, qn_dt);
		document.getElementById(qn_ppid).innerHTML = compiledRendered;
		resizemodal(qn_ppid);
		quote_notes.bindEvents();
	},
	bindEvents:function(){	
		$('#zip').change(function(){
			quote_notes.getCityFromZip('#zip','#city');
		});	
		$('#quote_notes_save').click(function(){
			quote_notes.saveData();
		});

		$('#followup_date').datepicker({
   			format:qd_dt.date_format_f
   		}).change(function(){
   			$('.datepicker').remove();
   		}).attr('readonly','readonly');

   		$('#followedup_quote').change(function(){
   			var v = $(this).val();

   			$('.followedup_task_type_w,.followedup_staff_w').hide();
   			if(v == 'staffers_followup_list'){
   				$('.followedup_staff_w').show();

   			}
   			else if(v == 'create_task'){
   				$('.followedup_staff_w').show();
   				$('.followedup_task_type_w').show();
   				
   			}		
   		}).select2({

   		});

   		$('#cancel_followup').change(function(){
   			var v = $(this).val();
   			if(v == 'y'){
   				$('.followedup_quote_w,.followup_date_w').show();
   			}
   			else{
   				$('.followedup_quote_w,.followup_date_w').hide();
   			}
   			$('#followedup_quote').val('sellers_followup_list').trigger('change');
   		}).select2({
   			
   		}).trigger('change');
   		$('#followedup_quote').select2({});
   		$('#followedup_staff').select2({});
   		$('#followedup_task_type').select2({});
   		


	},
	saveData:function(){
		getUserIP(function(ip){
			var errmsg = '';
			var cancel_followup = $('#quote_notes_form #cancel_followup').val();
			var description = $('#quote_notes_form #description').val();
			var followedup_quote = $('#quote_notes_form #followedup_quote').val();
			var followedup_task_type = $('#quote_notes_form #followedup_task_type').val();
			var followedup_staff = $('#quote_notes_form #followedup_staff').val();
			var followup_date = $('#quote_notes_form #followup_date').val();

			var tot_params = {
				cancel_followup:cancel_followup,
				description:description,
				followup_date:'',
				followedup_quote:'',
				followedup_staff:'',
				status:qn_meta.status,
				followedup_task_staff:'',
				followedup_task_type:'',
				quote_id:qn_meta.quote_id,
				module:'quote',
				ip_address:ip,
				reopen_reason:'',
				is_reopen:'',
				cancellation_reason:'',
			};

			if(cancel_followup == 'n'){	
			}
			else if(cancel_followup == 'y'){
				tot_params.followup_date = followup_date;
				tot_params.followedup_quote = followedup_quote;
				if(followedup_quote  == 'sellers_followup_list'){

				}
				else if(followedup_quote  == 'staffers_followup_list'){
					if(followedup_staff == ''){
						errmsg += qn_td.Staff+'<br/>';
					}
					tot_params.followedup_staff = followedup_staff;
				}
				else if(followedup_quote  == 'create_task'){
					if(followedup_staff == ''){
						errmsg += qn_td.Staff+'<br/>';
					}
					tot_params.followedup_task_staff = followedup_staff;
					tot_params.followedup_task_type = followedup_task_type;
				}
				if(checkNull(followup_date) == ''){
					errmsg += qn_td.Date+'<br/>';
				}
			}
	
			if(errmsg!=''){
				var finalerrmsg = qn_td.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
				showAlertMessage(finalerrmsg,'error',qn_td.AlertMessage);
				return;
			}
			
			var t_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id
			};

			var total_params = Object.assign(tot_params,t_params);
				
			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Quotes/addQuoteNoteWithFollowup.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			};
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					$('#'+qn_ppid).modal('hide');
					call_toastr('success',qd_td.Success,complet_data.response.response.message.msg);

					if("quote_followupentries" in window){
						quote_followupentries.generateRows(complet_data.response.response.getFollowupEntries);
					}
					else{
						$('#tab_quotes_followup a').click();
					}
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',qn_td.Alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',qn_td.Alertmessage);
						return;
					}	
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;
		});
	},
}