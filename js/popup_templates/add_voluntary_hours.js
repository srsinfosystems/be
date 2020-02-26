var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var global_add_voluntary_hours_popupid = 'popups';
var global_add_voluntary_hours_translationsData;
var global_add_voluntary_hours_Data;
var global_add_voluntary_hours_metadata;

var add_voluntary_hours = {
	start: function(popups,metadata){
		global_add_voluntary_hours_popupid = popups;
		global_add_voluntary_hours_metadata = metadata;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Please check the following fields','Alert Message','success','Success','Hours added successfully','hours','Hours','Add hours'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getScheduleTranslations.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_add_voluntary_hours_translationsData = complet_data.response.response.translationsData;
				global_add_voluntary_hours_Data = complet_data.response.response;
				add_voluntary_hours.createHtml();
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
		var template = document.getElementById('add_voluntary_hours_template').innerHTML;
		var compiledRendered = Template7(template, global_add_voluntary_hours_Data);
		document.getElementById(global_add_voluntary_hours_popupid).innerHTML = compiledRendered;
		resizemodal(global_add_voluntary_hours_popupid);
		add_voluntary_hours.bindEvents(global_add_voluntary_hours_Data);
	},
	bindEvents:function(){
		$('#hours').acceptOnlyNumber();
		$('#'+global_add_voluntary_hours_popupid).resize();
		//$('#schedule_start_time').inputmask("(09|19|20|21|22|23):(09|19|29|39|49|59)",{ autoUnmask:true });
	
		$('#add_voluntary_hours_btn_save').click(function(){
			add_voluntary_hours.saveData();
		});
	},
	saveData:function(){
		var hours = $('#add_voluntary_hours_form #hours').val();
		var errmsg = '';
		if(hours=='' || hours==undefined || hours==null){
			errmsg += global_add_voluntary_hours_translationsData.hours+'<br/>';
		}
		if(errmsg!=''){
			var finalerrmsg = global_add_voluntary_hours_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_add_voluntary_hours_translationsData.AlertMessage);
			return;
		}
	
		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			customer_id:global_add_voluntary_hours_metadata.customer_id,
			hours:hours

		};
		var total_params = {
			data:params,
			model:'customerVoluntaryBanks',
			action:'create',
			emitevent:'customerVoluntaryBankNew'
		};
		$('#add_voluntary_hours_btn_save').attr('disabled','disabled');
		socket.emit('crud', total_params);
		socket.off('customerVoluntaryBankNew');
		socket.on('customerVoluntaryBankNew',customerVoluntaryBankNewFun);
		function customerVoluntaryBankNewFun(data){
			socket.off('customerVoluntaryBankNew');
			$('#add_voluntary_hours_btn_save').removeAttr('disabled','disabled');
			if(data.error==null || data.error==undefined || data.error==''){
				$('#tab_1_11 a').click();
				call_toastr(global_add_voluntary_hours_translationsData.success,global_add_voluntary_hours_translationsData.Success, global_add_voluntary_hours_translationsData.Hoursaddedsuccessfully);
				$('#'+global_add_voluntary_hours_popupid).modal('hide');
			}
			else{
				showAlertMessage(global_add_voluntary_hours_translationsData[data.error.message],'error',global_add_voluntary_hours_translationsData.AlertMessage);
				return;
			}
			
			
		}
		
	},

};
