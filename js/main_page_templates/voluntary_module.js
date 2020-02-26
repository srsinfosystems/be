var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
if(tabfunc!=undefined){
	delete tabfunc;
}
var global_translationsData;
var global_voluntary_module_data;
var tabfunc = {
	start: function(){
		tabfunc.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','General','Settings','Duration','Scheduling','Absence','Actions','Add schedule','Name','Start time','Duration','Active','Inactive','Status','No data found','Edit','Delete','Are you sure you would like to delete this template','Confirmation','Cancel','success','Success','Schedule deleted successfully','Templates','Mass actions','Add hours to hour bank','Reset hour bank','The number of hours added will depend on the customer type','Yes','No','This action cannot be undone','Would you like to proceed','This resets the hour bank balance and number of hours of completed work for every customer in the system','Customers will get a new balance depending on their customer type','hours','Save','Manager','Manager Validation settings updated successfully','No of hours','Number of hours cannot be empty','alert message','error','Added hours to customer bank successfully','Voluntary work templates','Other settings','No templates created','Hour bank','Add the default number of hours to the hour bank','Add a fixed number of hours to the hour bank','Select','Please select at least one option','This adds the number of hours set as default for each customer group to every customer in that group','Default hours added to hour bank successfully','Hour bank resetted successfully','Go','This adds','number of hours to the hour bank of every customer','Exempt','Voluntary work manager','Controls whether a voluntary work manager should be set for voluntary work tasks','Reset hour bank when switching customer group','This adds count number of hours to the hour bank of every customer1period1 This action cannot be undone 1period1 Would you like to proceed 1que1','$timebankmsg'],

		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/voluntary_module.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				
				$.each(complet_data.response.response.translationsData, function (key, val) {
			        var str = val.replace(/1period1/g, ".");
			       	str = str.replace(/1comma1/g, ",");
			       	str = str.replace(/1que1/g, "?");
			        complet_data.response.response.translationsData[key] = str;
			    });
				global_translationsData = complet_data.response.response.translationsData;

				global_voluntary_module_data = complet_data.response.response;
				tabfunc.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(jsondata){
		jsondata.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('voluntary_module_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		tabfunc.bindEvents(jsondata);
	},
	bindEvents:function(trans){
		$('input[type=checkbox]').uniform();
		$('#voluntary_allocations_manager').select2({
			placeholder: global_translationsData.Select,
			allowClear: true,
			minimumResultsForSearch:-1,
		});
		$('#reset_customer_group_hours').select2({
			minimumResultsForSearch:-1,
		});
		
		$('#voluntary_allocations_manager_save').click(function(){
			tabfunc.saveManager();
		});
		$('#all_hours_voluntary').acceptOnlyNumber();	
		$('#mass_actions').select2({
			placeholder: global_translationsData.Select,
			allowClear: true,
			minimumResultsForSearch:-1,
		}).change(function(){
			var fname = $('#mass_actions').val();
			if(fname=='add_fixed_hours'){
				$('#all_hours_voluntary_wrapper').show();
			}
			else{
				$('#all_hours_voluntary_wrapper').hide();
			}
		});

		// var msgs = global_translationsData.Everycustomerhasanhourbankholdingthenumberofhoursofvoluntaryworkthatthiscustomershouldcarryout+'.<br/>';
		// msgs += global_translationsData.Hereyoucanaddorresetthehoursinthehourbank+'.<br/>';
		// msgs += global_translationsData.Changesmadeherewillaffectallorgroupsofcustomersinthesystem+'.<br/>';


		var msgs =  global_translationsData.$timebankmsg;
		
		$("#info_hour_bank").hover(function () {
			$(this).popover({
				title: '',        
				content: msgs,
				html: true
			}).popover('show');
		}, function () {
			$(this).popover('hide');
		});	

		var msga = global_translationsData.Controlswhetheravoluntaryworkmanagershouldbesetforvoluntaryworktasks;

		$("#info_work_manager").hover(function () {
			$(this).popover({
				title: '',        
				content: msga,
				html: true
			}).popover('show');
		}, function () {
			$(this).popover('hide');
		});	
	},
	listenForData:function(){
		socket.off('partnerScheduleTemplatesNew');
		socket.on('partnerScheduleTemplatesNew',voluntaryPartnerScheduleTemplatesNew);
		function voluntaryPartnerScheduleTemplatesNew(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					var html = tabfunc.generate_rows(res.name,res.start_time,res.hours,res.status,res.id);
					$('#voluntary_module_empty_tr').hide();
					$('#voluntary_module_tbody').append(html).fadeIn(999);

				}
			}
			socket.off('partnerScheduleTemplatesNew', voluntaryPartnerScheduleTemplatesNew);
			socket.on('partnerScheduleTemplatesNew',voluntaryPartnerScheduleTemplatesNew);
		}

		socket.off('partnerScheduleTemplatesEdit');
		socket.on('partnerScheduleTemplatesEdit',voluntaryPartnerScheduleTemplatesEdit);
		function voluntaryPartnerScheduleTemplatesEdit(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					var html = tabfunc.generate_rows(res.name,res.start_time,res.hours,res.status,res.id);
					$('#voluntary_module_empty_tr').hide();
					
					
						$('#voluntary_module_tbody #voluntary_module_empty_tr_'+res.id).after(html);
						$('#voluntary_module_tbody #voluntary_module_empty_tr_'+res.id)[0].remove();
					
					
					
					
				}
			}
			socket.off('partnerScheduleTemplatesEdit',voluntaryPartnerScheduleTemplatesEdit);
			socket.on('partnerScheduleTemplatesEdit',voluntaryPartnerScheduleTemplatesEdit);
		}

		socket.off('partnerScheduleTemplatesDelete');
		socket.on('partnerScheduleTemplatesDelete',voluntaryPartnerScheduleTemplatesDelete);
		function voluntaryPartnerScheduleTemplatesDelete(data){
			if(data.err==null){
				if(data.success!=null && data.success!='' && data.success!=undefined){
					var res = data.success;
					$('#voluntary_module_empty_tr').hide();
					$('#voluntary_module_tbody #voluntary_module_empty_tr_'+res.id).remove();
					if($('#voluntary_module_tbody tr').length==1){
						$('#voluntary_module_empty_tr').show();
					}
				}
			}
			socket.off('partnerScheduleTemplatesDelete',voluntaryPartnerScheduleTemplatesDelete);
			socket.on('partnerScheduleTemplatesDelete',voluntaryPartnerScheduleTemplatesDelete);
		}
	},
	editTemplate:function(id){
		var data = { id:id };
		new_custom_popup(600,'popups','edit_new_schedule_template',data);
	},
	deleteTemplate:function(id){
		var yes = function(){
			var params = {
				id:id,
				partner_id:partner_id,
			};
			var total_params = {
				data:params,
				model:'partnerScheduleTemplates',
				action:'delete',
				emitevent:'partnerScheduleTemplatesDelete'
			};

			socket.emit('crud', total_params);

			socket.on('partnerScheduleTemplatesDelete',voluntaryPartnerScheduleTemplatesDelete2);
			function voluntaryPartnerScheduleTemplatesDelete2(data){
				if(data.err==null){
					if(data.success!=null && data.success!='' && data.success!=undefined){
						var res = data.success;
						call_toastr(global_translationsData.success,global_translationsData.Success, global_translationsData.Scheduledeletedsuccessfully);
						
					}
				}
				socket.off('partnerScheduleTemplatesDelete',voluntaryPartnerScheduleTemplatesDelete2);
			}
		}
		var no = function(){
		}
		showDeleteMessage(global_translationsData.Areyousureyouwouldliketodeletethistemplate+'?',global_translationsData.Confirmation,yes,no,'ui-dialog-blue',global_translationsData.Delete,global_translationsData.Cancel);
	},
	generate_rows:function(name='',start_time=0,hours=0,status=0,id){
		var ret = '<tr id="voluntary_module_empty_tr_'+id+'">';
			ret += '<td>'+name+'</td>';
			ret += '<td>'+start_time+'</td>';
			ret += '<td>'+hours+'</td>';
			if(status==0){
				ret += '<td>'+global_translationsData.Inactive+'</td>';
			}
			else{
				ret += '<td>'+global_translationsData.Active+'</td>';
			}
			ret += '<td>';
				ret+= '<a class="btn mini blue-stripe" onclick="tabfunc.editTemplate('+id+')"><i class="icon-edit" ></i>&nbsp;'+global_translationsData.Edit+'</a>&nbsp;';
				ret+= '<a class="btn mini red-stripe" onclick="tabfunc.deleteTemplate('+id+')"><i class="icon-edit"></i>&nbsp;'+global_translationsData.Delete+'</a>';
			ret +='</td>';	
		ret += '</tr>';
	
		return ret;
	},
	generate_validation_options:function(id,name){
		var ret = '';
		var defaultv = global_voluntary_module_data.getPartnerCustomSettings.PartnerSetting.voluntary_allocations_manager;

		if(id==defaultv){
			ret += '<option value="'+id+'" selected="selected">';
		}
		else{
			ret += '<option value="'+id+'" >';
		}
		
			ret += name;
		ret += '</option>';
		return ret;
	},
	saveManager:function(){
		var voluntary_allocations_manager = $('#voluntary_allocations_manager').val();
		var reset_hours = $('#reset_customer_group_hours').val();
		var params = {
			voluntary_allocations_manager:voluntary_allocations_manager,
			reset_hours:reset_hours,
		};
		var upsert = {
			partner_id:partner_id,
		}
		var total_params = {
			data:params,
			upsert:upsert,
			model:'partnerSettings',
			action:'upsertWithWhere',
			emitevent:'partnerSettingsManagerUpdate'
		};
		showProcessingImage('undefined');
		socket.emit('crud',total_params);
		socket.off('partnerSettingsManagerUpdate');
		socket.on('partnerSettingsManagerUpdate',partnerSettingsManagerUpdateFun);
		function partnerSettingsManagerUpdateFun(data){
			hideProcessingImage();
			if(data.error==null || data.error==undefined || data.error==''){
				call_toastr(global_translationsData.success,global_translationsData.Success, global_translationsData.ManagerValidationsettingsupdatedsuccessfully+'.');
			}
			socket.off('partnerSettingsManagerUpdate',partnerSettingsManagerUpdateFun);
			socket.on('partnerSettingsManagerUpdate',partnerSettingsManagerUpdateFun);
			
		}
	},
	add_default_hours:function(){
		
		var message = global_translationsData.Thisaddsthenumberofhourssetasdefaultforeachcustomergrouptoeverycustomerinthatgroup +'.';

		message += '<br/>' + global_translationsData.Thisactioncannotbeundone+'.';

		message += '<br/>' + global_translationsData.Wouldyouliketoproceed + '?';
	
		var yes = function(){
			
			showProcessingImage('undefined');
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Voluntries/addDefaultHours.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
		
				if(complet_data.response.status == 'success'){
					call_toastr(global_translationsData.success,global_translationsData.Success, global_translationsData.Defaulthoursaddedtohourbanksuccessfully);		
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',global_translationsData.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',global_translationsData.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;			
			
		};

		var no = function(){
		};
		showDeleteMessage(message,global_translationsData.Confirmation,yes,no,'ui-dialog-blue',global_translationsData.Yes,global_translationsData.No);
	},
	reset_hours:function(){
		var message = global_translationsData.Thisresetsthehourbankbalanceandnumberofhoursofcompletedworkforeverycustomerinthesystem +'.';
		message += ' ' + global_translationsData.Customerswillgetanewbalancedependingontheircustomertype + '.';

		message += '<br/>' + global_translationsData.Thisactioncannotbeundone+'.';

		message += '<br/>' + global_translationsData.Wouldyouliketoproceed + '?';
	
		var yes = function(){
			showProcessingImage('undefined');
			var total_params = {
				APISERVER:APISERVER,
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Voluntries/resetHours.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
		
				if(complet_data.response.status == 'success'){
					call_toastr(global_translationsData.success,global_translationsData.Success, global_translationsData.Hourbankresettedsuccessfully);		
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',global_translationsData.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',global_translationsData.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;			
		};

		var no = function(){
		};
		showDeleteMessage(message,global_translationsData.Confirmation,yes,no,'ui-dialog-blue',global_translationsData.Yes,global_translationsData.No);
		return false;
	},
	add_fixed_hours:function(){
		var all_hours_voluntary =  $('#all_hours_voluntary').val();
		if(all_hours_voluntary=='' || all_hours_voluntary==null || all_hours_voluntary==undefined){
			showAlertMessage(global_translationsData.Numberofhourscannotbeempty+'.',global_translationsData.error,global_translationsData.alertmessage);
			return;
		}
		var message = global_translationsData.Thisaddscountnumberofhourstothehourbankofeverycustomer1period1Thisactioncannotbeundone1period1Wouldyouliketoproceed1que1;

		message = message.replace('count',all_hours_voluntary);

	
		var yes = function(){
			var all_hours_voluntary = $('#all_hours_voluntary').val();
			if(all_hours_voluntary=='' || all_hours_voluntary==undefined || all_hours_voluntary==null || all_hours_voluntary==0){
				showAlertMessage(global_translationsData.Numberofhourscannotbeempty+'.',global_translationsData.error,global_translationsData.alertmessage);
			}
			else{
				showProcessingImage('undefined');
				var total_params = {
					APISERVER:APISERVER,
					token:token,
					language:language,
					lang:lang,
					partner_id:partner_id,
					admin_id:admin_id,
					hours:all_hours_voluntary
				};

				var params = $.extend({}, doAjax_params_default);
				params['url'] = APISERVER+'/api/Voluntries/addMoreHours.json';
				params['data'] = total_params;
				params['completeCallbackFunction'] = function (){
					hideProcessingImage();
				}
				
				params['successCallbackFunction'] = function (complet_data){
			
					if(complet_data.response.status == 'success'){
							call_toastr(global_translationsData.success,global_translationsData.Success, global_translationsData.Addedhourstocustomerbanksuccessfully);
								
					}
					else if(complet_data.response.status == 'error'){
						if(complet_data.response.response.error == 'validationErrors'){
							var mt_arr = complet_data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error',global_translationsData.alertmessage);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',global_translationsData.alertmessage);
							return;
						}	
					}
				}
				doAjax(params);
				return;			
			}
		};

		var no = function(){
		};
		showDeleteMessage(message,global_translationsData.Confirmation,yes,no,'ui-dialog-blue',global_translationsData.Yes,global_translationsData.No);
	},
	mass_actions:function(){
		var fname = $('#mass_actions').val();
		if(fname=='' || fname==null || fname==undefined){
			showAlertMessage(global_translationsData.Pleaseselectatleastoneoption,'error',global_translationsData.alertmessage);
			return;
		}
		tabfunc[fname]();
	}

};

Template7.registerHelper('VoluntaryModuleHelper', function (name='',start_time=0,hours=0,status=0,id){
	return tabfunc.generate_rows(name,start_time,hours,status,id);
});

Template7.registerHelper('voluntaryMangerValidationsHelper', function (id,name){
	return tabfunc.generate_validation_options(id,name);
});




