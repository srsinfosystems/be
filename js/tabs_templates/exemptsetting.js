var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();

var global_exemptsetting_tab_id;
var global_exemptsetting_data;

var exemptsetting = {
	start:function(tab_id){
		global_exemptsetting_tab_id = tab_id;
		exemptsetting.listenForData();

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		
			getTranslationsData:'yes',
			getTranslationsDataArray:['General','Dashboard','Reasons for exempt','Add reason','Edit','Delete','Exempt reason deleted successfully','Are you sure you would like to delete this reason','success','Success','No reason found','Exempts','Customer 1','Status','Note','Actions','Specialty work','Participant','Exempt','Go to customer','Customer name'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getexemptData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				global_exemptsetting_data= complet_data.response.response;
				exemptsetting.createHtml(complet_data.response.response);
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
		socket.off('partnerExemptReasonsNew');
		socket.on('partnerExemptReasonsNew',partnerExemptReasonsNew);
		function partnerExemptReasonsNew(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					var html = exemptsetting.generate_rows(res);
					$('#exempt_empty_tr').hide();
					$('#exempt_tbody').append(html);
				}
			}
			socket.off('partnerExemptReasonsNew', partnerExemptReasonsNew);
			socket.on('partnerExemptReasonsNew',partnerExemptReasonsNew);
		}

		socket.off('partnerExemptReasonsEdit');
		socket.on('partnerExemptReasonsEdit',partnerExemptReasonsEditFun1);
		function partnerExemptReasonsEditFun1(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					var html = exemptsetting.generate_rows(res);
					$('#exempt_empty_tr').hide();
					$('#exempt_tbody #exempt_tr_'+res.id).after(html);
					$('#exempt_tbody #exempt_tr_'+res.id)[0].remove();
				}
			}
			socket.off('partnerexemptReasonsEdit', partnerExemptReasonsEditFun1);
			socket.on('partnerexemptReasonsEdit',partnerExemptReasonsEditFun1);
		}

		socket.removeListener('partnerexemptReasonsDelete');
		socket.on('partnerexemptReasonsDelete',partnerexemptReasonsDelete1);
		function partnerexemptReasonsDelete1(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					
					$('#exempt_empty_tr').hide();
					$('#exempt_tbody #exempt_tr_'+res.id).remove();
					if($('#exempt_tbody tr').length==1){
						$('#exempt_empty_tr').show();
					}
				}
			}
			socket.removeListener('partnerexemptReasonsDelete',partnerexemptReasonsDelete1);
			socket.on('partnerexemptReasonsDelete',partnerexemptReasonsDelete1);
		}
	},
	createHtml:function(){
		global_exemptsetting_data.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('exemptsetting_template').innerHTML;

		var compiledRendered = Template7(template, global_exemptsetting_data);
		document.getElementById(global_exemptsetting_tab_id).innerHTML = compiledRendered;
		exemptsetting.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		$('#exempt_penalties input[type=checkbox]').uniform();

		$('#exempt_penalties #bill_for_exempt').change(function(){
			exemptsetting.checkpenalty();
		});
		exemptsetting.checkpenalty();
		exemptsetting.autoCompleteProductLines();

		$('#exempt_penalties_save').click(function(){
			exemptsetting.saveexemptPenalties();
		});
		$('#billing_policy').select2({
			minimumResultsForSearch:-1
		});
		
	},
	autoCompleteProductLines:function(){
		var TABKEY = 9;
		var availableTags =  global_exemptsetting_data.productData;
		$('#exempt_penalties #billable_product').autocomplete({
			minLength: 1,
			source: availableTags,
			select: function( event, data ) {
				$('#billable_product_id').val(data.item.id);
			}
		});

	},
	checkpenalty:function(){
		var bill_for_exempt = $('#exempt_penalties #bill_for_exempt:checked').length;

		if(bill_for_exempt==1){
			$('.billing_policy_details').show();
		}
		else{
			$('.billing_policy_details').hide();
		}
	},
	generate_rows:function(data){

		var ret = '<tr id="exempt_tr_'+data.id+'">';
			ret += '<td>'+data.name+'</td>';

			
			ret += '<td>';
				ret+= '<a class="btn mini blue-stripe" onclick="exemptsetting.edit('+data.id+')"><i class="icon-edit" ></i>&nbsp;'+global_exemptsetting_data.translationsData.Edit+'</a>&nbsp;';
				ret+= '<a class="btn mini red-stripe" onclick="exemptsetting.delete('+data.id+')"><i class="icon-edit"></i>&nbsp;'+global_exemptsetting_data.translationsData.Delete+'</a>';
			ret +='</td>';
			
		ret += '</tr>';
	
		return ret;
	},
	generate_customer:function(res){
		var ret = '';
		console.log(res);

		var data = global_exemptsetting_data.customers[res].Customer;
		ret += '<tr id="customer_tr_'+data.id+'">';
			ret += '<td>';
				ret += data.customer_number;
			ret +='</td>';

			ret += '<td>';
				ret += data.customer_name;
			ret +='</td>';

			ret += '<td>';
				if(data.volunteer_type=='specialty_work'){
						ret += global_exemptsetting_data.translationsData.Specialtywork;
				}
				else if(data.volunteer_type=='exempt'){
					ret += global_exemptsetting_data.translationsData.Exempt;
				}
				
			ret +='</td>';

			ret += '<td>';
				if(data.volunteer_type=='specialty_work'){
						ret += data.voluntary_note;
				}
				else if(data.volunteer_type=='exempt'){
					console.log(global_exemptsetting_data);
					var a = 0;
					for(var j in global_exemptsetting_data.PartnerExemptReasons){
						var d = global_exemptsetting_data.PartnerExemptReasons[j].PartnerExemptReason;
						if(data.voluntary_note==d.id){
							ret += d.name;
							var a = 1;
							break;
						}
					}
					if(a==0){
						ret += '-';
					}
				}
			ret +='</td>';

			ret += '<td>';
			
				var urrl = base_url + 'customers/details/'+data.id;
				ret+= '<a class="btn mini blue-stripe" href="'+urrl+'" ><i class="icon-user" ></i>&nbsp;'+global_exemptsetting_data.translationsData.Gotocustomer+'</a>&nbsp;';
			
			ret +='</td>';
		ret += '</tr>';
		return ret;
	},
	edit:function(id){
		new_custom_popup(600,'popups','edit_new_exempt',{id:id});
	},
	delete:function(id){
		var yes = function(){
			var params = {
				id:id,
				partner_id:partner_id,
			};
			var total_params = {
				data:params,
				model:'partnerExemptReasons',
				action:'delete',
				emitevent:'partnerexemptReasonsDelete'
			};

			socket.emit('crud', total_params);

			socket.on('partnerexemptReasonsDelete',partnerexemptReasonsDelete2);
			function partnerexemptReasonsDelete2(data){
				if(data.err==null){
					if(data.success!=null && data.success!='' && data.success!=undefined){
						var res = data.success;
						call_toastr(global_exemptsetting_data.translationsData.success,global_exemptsetting_data.translationsData.Success,global_exemptsetting_data.translationsData.Exemptreasondeletedsuccessfully);
					}
				}
				socket.off('partnerexemptReasonsDelete',partnerexemptReasonsDelete2);
			}
			
		}
		var no = function(){
		}
		showDeleteMessage(global_exemptsetting_data.translationsData.Areyousureyouwouldliketodeletethisreason+'?',global_exemptsetting_data.translationsData.Confirmation,yes,no,'ui-dialog-blue',global_translationsData.Delete,global_translationsData.Cancel);
	},
	saveexemptPenalties:function(){
		var bill_for_exempt = $('#exempt_penalties #bill_for_exempt:checked').length;
		var errmsg = '';
		if(bill_for_exempt==0){
			var billing_policy = 0;
			var billable_product = 0;
		}
		else{
			var billing_policy = $('#exempt_penalties #billing_policy').val();
			var billable_product =  $('#exempt_penalties #billable_product_id').val();
			
			if(billing_policy=='' || billing_policy==undefined || billing_policy==null){
				errmsg += global_exemptsetting_data.translationsData.Billingpolicy+'<br/>';
			}
			if(billable_product=='' || billable_product==0 || billable_product==undefined || billable_product==null){
				errmsg += global_exemptsetting_data.translationsData.Billableproduct+'<br/>';
			}
		}
		if(errmsg!=''){ 
			var finalerrmsg = global_exemptsetting_data.translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_exemptsetting_data.translationsData.AlertMessage);
			return;
		}

		var params = {
			bill_for_exempt:bill_for_exempt,
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
				call_toastr(global_exemptsetting_data.translationsData.success,global_exemptsetting_data.translationsData.Success, global_exemptsetting_data.translationsData.exemptpenaltysettingsupdatedsuccessfully);
			}
			socket.off('partnerSettingsBillingUpdate',partnerSettingsBillingUpdate);
			socket.on('partnerSettingsBillingUpdate',partnerSettingsBillingUpdate);
			
		}
	}
}

Template7.registerHelper('exemptReasonTableHelper', function (data){
	return exemptsetting.generate_rows(data);
});

Template7.registerHelper('exemptCustomerTableHelper', function (data){
	return exemptsetting.generate_customer(data);
});
