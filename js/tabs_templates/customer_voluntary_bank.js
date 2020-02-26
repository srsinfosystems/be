var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var popupid = 'popups';
var global_customer_voluntary_bank_tab_id;
var global_customer_voluntary_bank_meta_data;
var global_customer_voluntary_bank_data;
var gbl_cvbtr;
var man_change = 'n';
var customer_voluntary_bank = {
	start:function(tab_id,metadata){
		customer_voluntary_bank.listenForData();
		global_customer_voluntary_bank_tab_id = tab_id;
		global_customer_voluntary_bank_meta_data = metadata;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:metadata.customer_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Current balance','Completed hours','Planned hours','Date','Status','No data found','Add hours','Type','Hours','Action','Other','Hour adjustment','Delete','Are you sure you would like to delete this entry','Cancel','success','Success','Manual entry deleted successfully','Manual entries','Confirmation','Allocated','Present','Partially present','Not present','Summary','Default','Note','Grounds','Participant','Exempt','Specialty work','Select','Save','Customer status updated successfully','Specialty work regarding','Exempt reason'],
		};


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getCustomerVoluntaryBankHours.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_customer_voluntary_bank_data= complet_data.response.response;
				gbl_cvbtr= complet_data.response.response.translationsData;
				customer_voluntary_bank.createHtml(complet_data.response.response);
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
		var template = document.getElementById('customer_voluntary_bank_template').innerHTML;
		global_customer_voluntary_bank_data.partnerVoluntaryDetails.currentBalance = 
			parseInt(global_customer_voluntary_bank_data.partnerVoluntaryDetails.total_hours) - 
			(
			parseInt(global_customer_voluntary_bank_data.partnerVoluntaryDetails.completed_hours) 
			+ parseInt(global_customer_voluntary_bank_data.partnerVoluntaryDetails.planned_hours));
		var compiledRendered = Template7(template, global_customer_voluntary_bank_data);
		document.getElementById(global_customer_voluntary_bank_tab_id).innerHTML = compiledRendered;
		customer_voluntary_bank.bindEvents();
	},
	bindEvents:function(){
		
		var cust = global_customer_voluntary_bank_data.volun.Customer;
		if(cust.volunteer_type == 'specialty_work'){
			$('#CustomerVoluntaryNote').html(cust.voluntary_note);
		}
		else if(cust.volunteer_type == 'exempt'){
			//setTimeout(function(){
				$('#CustomerVoluntaryExempt').val(cust.voluntary_note);
			//},1);
			
		}
		if(checkNull(cust.volunteer_type) != ''){
			$('#CustomerVolunteerType').val(cust.volunteer_type);
		}
		

		//$('select#CustomerVolunteerType option[value="'+cust.volunteer_type+'"]').prop('selected','selected');
		var i = 0;
		$('#CustomerVolunteerType').select2().change(function(){
			var v = $(this).val();
			$('.opts_d').hide();
			$('#save_v').hide();

			if(v=='exempt'){

				$('.exempt_w').show();
						
				if(i!=0){
					$('#CustomerVoluntaryExempt').val('').trigger('change');
					if(global_customer_voluntary_bank_data.partnerExemptReasons.length == 0){
						customer_voluntary_bank.saveVo();
					}
				}
			}
			else if(v=='specialty_work'){
				$('#save_v').show();
				$('.specialty_work_w').show();
			}
			else{
				if(i!=0){
					customer_voluntary_bank.saveVo();
				}				
			}
			i++;

		}).trigger('change');

		$('#CustomerVoluntaryExempt').select2({
			placeholder: global_customer_voluntary_bank_data.translationsData.Select,
			allowClear:true
		}).change(function(){

			//if(man_change!='y'){
				customer_voluntary_bank.saveVo();
			//}
			//man_change = 'n';
			
		});




	},
	listenForData:function(){
		socket.off('customerVoluntaryBanksAd');
		socket.on('customerVoluntaryBanksAd',function(data){
			if(data.error==null){
				data = data.success;
				$('#customer_tab_content').empty();
				new_custom_tabs('customer_voluntary_bank','customer_tab_content',global_customer_voluntary_bank_meta_data);

				//var res = customer_voluntary_bank.generate_manual_rows(data,data.emithis);
				//$('#customer_voluntary_bank_manual_empty_tr').hide();
				//$('#customer_voluntary_bank_manual_tbody').append(res);
			}
		});
	},
	generate_rows:function(PartnerVoluntaryAllocation,PartnerVoluntarySchedule){
	
		var ret = '<tr id="customer_voluntary_bank_tr_'+PartnerVoluntaryAllocation.id+'">';
			ret += '<td>'+moment(PartnerVoluntaryAllocation.created_date).format('DD.MM.YY')+'</td>';

			var st = '';
			var ch = 0;

			if(PartnerVoluntaryAllocation.status==0){
				st = gbl_cvbtr.Allocated;
				ch = 0;
			}
			else if(PartnerVoluntaryAllocation.status==1){
				st = gbl_cvbtr.Present;
				ch = PartnerVoluntarySchedule.hours;
			}
			else if(PartnerVoluntaryAllocation.status==2){
				st = gbl_cvbtr.Partiallypresent;
				ch = PartnerVoluntaryAllocation.hours;
			}
			else if(PartnerVoluntaryAllocation.status==3){
				st = gbl_cvbtr.Notpresent;
				ch = PartnerVoluntaryAllocation.hours;
			}

			ret += '<td>'+st+'</td>';
			ret += '<td>'+PartnerVoluntarySchedule.hours+'</td>';
			ret += '<td>'+ch+'</td>';
			//ret += '<td>inprogress</td>';
		ret += '</tr>';
		return ret;
	},
	generate_manual_rows:function(data,d){
		
		var ct = data.type;
		if(ct==null ||ct==undefined){
			ct='-';
		}
		else if(ct=='other'){
			ct = global_customer_voluntary_bank_data.translationsData.Other;
		}
		else if(ct=='adj'){
			ct = global_customer_voluntary_bank_data.translationsData.Houradjustment;
		}
		else if(ct=='default'){
			ct = global_customer_voluntary_bank_data.translationsData.Default;
		}
		else{
			ct = d.name;
		}
		var ret = '<tr id="customer_voluntary_manual_bank_tr_'+data.id+'">';
			if(data.custom_date!=null && data.custom_date!=undefined && data.custom_date!=''){
				ret += '<td>'+moment(data.custom_date).format('DD.MM.YY')+'</td>';
			}
			else{
				ret += '<td>-</td>';
			}
			ret += '<td>'+ct+'</td>';
			ret += '<td>'+data.hours+'</td>';
			ret += '<td><a class="btn mini red-stripe phone-min-btn" style="cursor:pointer;" onclick="customer_voluntary_bank.delete('+data.id+')"><i class="icon-remove"></i>&nbsp;'+ global_customer_voluntary_bank_data.translationsData.Delete+'</a></td>';
		ret += '</tr>';
		return ret;
	},
	add_hours:function(){
		new_custom_popup(600,'popups','add_voluntary_hours',global_customer_voluntary_bank_meta_data);
	},
	delete:function(id){
		
		var yes = function(){
			showProcessingImage('undefined');
			var params = {
				id:id,
				partner_id:partner_id,
				admin_id:admin_id
			}
			var total_params = {
				data:params,
				model:'customerVoluntaryBanks',
				action:'delete',
				emitevent:'customerVoluntaryBanksManualDelete'
			};
			socket.once('customerVoluntaryBanksManualDelete',function(res){
				hideProcessingImage();
				if(res.error==null){
					$('#customer_tab_content').empty();
					new_custom_tabs('customer_voluntary_bank','customer_tab_content',{customer_id:global_customer_voluntary_bank_meta_data.customer_id,})
					// if($('#customer_voluntary_bank_manual_tbody tr').length==1){
					// 	$('#customer_voluntary_bank_manual_empty_tr').show();
					// }
					call_toastr(global_customer_voluntary_bank_data.translationsData.success, global_customer_voluntary_bank_data.translationsData.Success,global_customer_voluntary_bank_data.translationsData.Manualentrydeletedsuccessfully);
				}
			});
			socket.emit('crud',total_params);
		};

		var no = function(){

		};
		showDeleteMessage(global_customer_voluntary_bank_data.translationsData.Areyousureyouwouldliketodeletethisentry+'?',global_customer_voluntary_bank_data.translationsData.Confirmation,yes,no,'ui-dialog-blue',global_customer_voluntary_bank_data.translationsData.Delete,global_customer_voluntary_bank_data.translationsData.Cancel);
	},
	saveVo:function(){

		var volunteer_type = $('#CustomerVolunteerType').val();
		var voluntary_note = '';
		if(volunteer_type=='exempt'){
			voluntary_note = $('#CustomerVoluntaryExempt').val();
		}
		else if(volunteer_type=='specialty_work'){
			voluntary_note = $('#CustomerVoluntaryNote').val();
		}
		
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:global_customer_voluntary_bank_meta_data.customer_id,
			volunteer_type:volunteer_type,
			voluntary_note:voluntary_note,
			from:'voluntary'
		}
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/updateSalesProperties.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',global_customer_voluntary_bank_data.translationsData.Success,global_customer_voluntary_bank_data.translationsData.Customerstatusupdatedsuccessfully);
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
		showProcessingImage('undefined');
		doAjax(params);
		return;

	}
};
Template7.registerHelper('VoluntaryBankTableHelper', function (PartnerVoluntaryAllocation,PartnerVoluntarySchedule){
	return customer_voluntary_bank.generate_rows(PartnerVoluntaryAllocation,PartnerVoluntarySchedule);
});

Template7.registerHelper('VoluntaryBankManualTableHelper', function (res,d){
	return customer_voluntary_bank.generate_manual_rows(res,d);
});