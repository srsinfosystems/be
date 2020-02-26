var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var popupid = 'popups';
var global_absence_tab_id;
var global_absence_meta_data;
var global_absence_data;

var absence = {
	start:function(tab_id,metadata){
		absence.listenForData();
		global_absence_tab_id = tab_id;
		global_absence_meta_data = metadata;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:metadata.id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Reasons for absence','Absence penalties','Name','Penalty','Deduct hours','No data found','Edit','Delete','Yes','No','Add reason','Are you sure you would like to delete this reason','Confirmation','Absence reason deleted successfully','Actions','Bill for absence from voluntary work','Billing policy','Billable product','Save','Please check the following fields','Alert Message','success','Success','Absence penalty settings updated successfully'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getAbsenceData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_absence_data= complet_data.response.response;
				absence.createHtml(complet_data.response.response);
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
	listenForData:function(){
		socket.off('partnerAbsenceReasonsNew');
		socket.on('partnerAbsenceReasonsNew',partnerAbsenceReasonsNew);
		function partnerAbsenceReasonsNew(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					var html = absence.generate_rows(res);
					$('#absence_empty_tr').hide();
					$('#absence_tbody').append(html);
					if($('#absence_tbody tr').length > 1){
						$('#absence_penalties').removeClass('hide');
					}
				}
			}
			socket.off('partnerAbsenceReasonsNew', partnerAbsenceReasonsNew);
			socket.on('partnerAbsenceReasonsNew',partnerAbsenceReasonsNew);
		}

		socket.off('partnerAbsenceReasonsEdit');
		socket.on('partnerAbsenceReasonsEdit',partnerAbsenceReasonsEdit);
		function partnerAbsenceReasonsEdit(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					var html = absence.generate_rows(res);
					$('#absence_empty_tr').hide();
					$('#absence_tbody #absence_tr_'+res.id).after(html);
					$('#absence_tbody #absence_tr_'+res.id)[0].remove();
					if($('#absence_tbody tr').length > 1){
						$('#absence_penalties').removeClass('hide');
					}
				}
			}
			socket.off('partnerAbsenceReasonsEdit', partnerAbsenceReasonsEdit);
			socket.on('partnerAbsenceReasonsEdit',partnerAbsenceReasonsEdit);
		}

		socket.removeListener('partnerAbsenceReasonsDelete');
		socket.on('partnerAbsenceReasonsDelete',partnerAbsenceReasonsDelete);
		function partnerAbsenceReasonsDelete(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					
					$('#absence_empty_tr').hide();
					$('#absence_tbody #absence_tr_'+res.id).remove();
					if($('#absence_tbody tr').length==1){
						$('#absence_empty_tr').show();
						$('#absence_penalties').addClass('hide');
					}
					else{
						$('#absence_penalties').removeClass('hide');
					}
				}
			}
			socket.removeListener('partnerAbsenceReasonsDelete',partnerAbsenceReasonsDelete);
			socket.on('partnerAbsenceReasonsDelete',partnerAbsenceReasonsDelete);
		}
	},
	createHtml:function(){
		var template = document.getElementById('absence_template').innerHTML;
		var compiledRendered = Template7(template, global_absence_data);
		document.getElementById(global_absence_tab_id).innerHTML = compiledRendered;
		absence.bindEvents();
	},
	bindEvents:function(){
		$('#absence_penalties input[type=checkbox]').uniform();

		$('#absence_penalties #bill_for_absence').change(function(){
			absence.checkpenalty();
		});
		absence.checkpenalty();
		absence.autoCompleteProductLines();

		$('#absence_penalties_save').click(function(){
			absence.saveAbsencePenalties();
		});
		$('#billing_policy').select2({
			minimumResultsForSearch:-1
		});
		
	},
	autoCompleteProductLines:function(){
		var TABKEY = 9;
		var availableTags =  global_absence_data.productData;
		$('#absence_penalties #billable_product').autocomplete({
			minLength: 1,
			source: availableTags,
			select: function( event, data ) {
				$('#billable_product_id').val(data.item.id);
			}
		});

	},
	checkpenalty:function(){
		var bill_for_absence = $('#absence_penalties #bill_for_absence:checked').length;

		if(bill_for_absence==1){
			$('.billing_policy_details').show();
		}
		else{
			$('.billing_policy_details').hide();
		}
	},
	generate_rows:function(data){
		var ret = '<tr id="absence_tr_'+data.id+'">';
			ret += '<td>'+data.name+'</td>';
			if(data.penalty==0){
				ret += '<td>'+global_absence_data.translationsData.No+'</td>';
			}
			else{
				ret += '<td>'+global_absence_data.translationsData.Yes+'</td>';
			}

			if(data.deduct_hours==0){
				ret += '<td>'+global_absence_data.translationsData.No+'</td>';
			}
			else{
				ret += '<td>'+global_absence_data.translationsData.Yes+'</td>';
			}
			
			ret += '<td>';
				ret+= '<a class="btn mini blue-stripe" onclick="absence.edit('+data.id+')"><i class="icon-edit" ></i>&nbsp;'+global_absence_data.translationsData.Edit+'</a>&nbsp;';
				ret+= '<a class="btn mini red-stripe" onclick="absence.delete('+data.id+')"><i class="icon-edit"></i>&nbsp;'+global_absence_data.translationsData.Delete+'</a>';
			ret +='</td>';
			
		ret += '</tr>';
	
		return ret;
	},
	generate_billing_policy_options:function(id,name){
		var ret = '';
		if(global_absence_data.partnerSettings.billing_policy==id){
			ret = '<option value="'+id+'" selected="selected">'+name+'</option>';
		}
		else{
			ret = '<option value="'+id+'">'+name+'</option>';
		}
		
		return ret;
	},
	edit:function(id){
		new_custom_popup(600,'popups','edit_new_absence',{id:id});
	},
	delete:function(id){
		var yes = function(){
			var params = {
				id:id,
				partner_id:partner_id,
			};
			var total_params = {
				data:params,
				model:'partnerAbsenceReasons',
				action:'delete',
				emitevent:'partnerAbsenceReasonsDelete'
			};

			socket.emit('crud', total_params);

			socket.on('partnerAbsenceReasonsDelete',partnerAbsenceReasonsDelete2);
			function partnerAbsenceReasonsDelete2(data){
				if(data.err==null){
					if(data.success!=null && data.success!='' && data.success!=undefined){
						var res = data.success;
						call_toastr(global_absence_data.translationsData.success,global_absence_data.translationsData.Success,global_absence_data.translationsData.Absencereasondeletedsuccessfully);
					}
				}
				socket.off('partnerAbsenceReasonsDelete',partnerAbsenceReasonsDelete2);
			}
			
		}
		var no = function(){
		}
		showDeleteMessage(global_absence_data.translationsData.Areyousureyouwouldliketodeletethisreason+'?',global_absence_data.translationsData.Confirmation,yes,no,'ui-dialog-blue',global_translationsData.Delete,global_translationsData.Cancel);
	},
	saveAbsencePenalties:function(){
		var bill_for_absence = $('#absence_penalties #bill_for_absence:checked').length;
		var errmsg = '';
		if(bill_for_absence==0){
			var billing_policy = 0;
			var billable_product = 0;
		}
		else{
			var billing_policy = $('#absence_penalties #billing_policy').val();
			var billable_product =  $('#absence_penalties #billable_product_id').val();
			
			if(billing_policy=='' || billing_policy==undefined || billing_policy==null){
				errmsg += global_absence_data.translationsData.Billingpolicy+'<br/>';
			}
			if(billable_product=='' || billable_product==0 || billable_product==undefined || billable_product==null){
				errmsg += global_absence_data.translationsData.Billableproduct+'<br/>';
			}
		}
		if(errmsg!=''){ 
			var finalerrmsg = global_absence_data.translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_absence_data.translationsData.AlertMessage);
			return;
		}

		var params = {
			bill_for_absence:bill_for_absence,
			billing_policy:billing_policy,
			billable_product:billable_product
		};
		var upsert = {
			partner_id:partner_id,
		}
		var total_params = {
			data:params,
			upsert:upsert,
			model:'partnerSettings',
			action:'upsertWithWhere',
			emitevent:'partnerSettingsBillingUpdate'
		};
		showProcessingImage('undefined');
		socket.emit('crud',total_params);
		socket.off('partnerSettingsBillingUpdate');
		socket.on('partnerSettingsBillingUpdate',partnerSettingsBillingUpdate);
		function partnerSettingsBillingUpdate(data){
			hideProcessingImage();
			if(data.error==null || data.error==undefined || data.error==''){
				$('#'+popupid).modal('hide');
				call_toastr(global_absence_data.translationsData.success,global_absence_data.translationsData.Success, global_absence_data.translationsData.Absencepenaltysettingsupdatedsuccessfully);
			}
			socket.off('partnerSettingsBillingUpdate',partnerSettingsBillingUpdate);
			socket.on('partnerSettingsBillingUpdate',partnerSettingsBillingUpdate);
			
		}
	}
}

Template7.registerHelper('AbsenceReasonTableHelper', function (data){
	return absence.generate_rows(data);
});

Template7.registerHelper('BillingPolicyListHelper', function (id,name){
	return absence.generate_billing_policy_options(id,name);
});
