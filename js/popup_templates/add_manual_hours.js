var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var global_manual_schedule_popupid = 'popups';
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var global_add_manual_hours_metadata;
var global_add_manual_hours_data;
var global_manual_translationsData;
var add_manual_hours = {
	start: function(popups,metadata){
		global_add_manual_hours_metadata=metadata;
		global_manual_schedule_popupid = popups;
		add_manual_hours.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['New voluntary work entry','Other','Hour adjustment','Save','Cancel','Type','Name','Start time','Duration','hours','Date','Select','Please check the following fields','error','Alert message','Manual entry added successfully','success','Success','Please choose among the following options','Add hours to the bank','customer must work more','Deduct hours from the bank','customer must work less','Action','Register carried out work','Adjust hours in the bank','Time'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getAllScheduleTemplates.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_add_manual_hours_data= complet_data.response.response;
				global_manual_translationsData = complet_data.response.response.translationsData;
				add_manual_hours.createHtml();
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
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		global_add_manual_hours_data.date_format_f = date_format_f;
		var template = document.getElementById('add_manual_hours_template').innerHTML;
		var compiledRendered = Template7(template, global_add_manual_hours_data);
		document.getElementById(global_manual_schedule_popupid).innerHTML = compiledRendered;
		resizemodal(global_manual_schedule_popupid);
		add_manual_hours.bindEvents();
	},
	bindEvents:function(){
		$('#'+global_manual_schedule_popupid).resize();
		$("#add_manual_hours_template_form #start_time").inputmask("99:99", {autoUnmask: true});
   		$("#add_manual_hours_template_form #hours").inputmask("numeric", {
			  min: 1,
			  max: 99
			}).css('text-align','left');

   		$('#add_manual_hours_template_form #date').datepicker({
   			format:global_add_manual_hours_data.date_format_f,
   			 startDate:moment().format()
   		}).change(function(){
   			$('.datepicker').remove();
   		});

   		$("#add_manual_hours_template_form #time").inputmask("99:99", {autoUnmask: true});

   		$('input[type=radio]').uniform();

   		$('#add_manual_hours_template_form #action').select2({
   			placeholder: global_manual_translationsData.Select,
			allowClear: true,
   			minimumResultsForSearch:-1
   		});
   		$('#manual_action').select2({
   			placeholder: global_manual_translationsData.Select,
			allowClear: true
   		}).change(function(){
   			var v = $('#add_manual_hours_template_form #manual_action').val();
   			if(v=='reg'){
   				$('.adj').hide();
   				$('.adjl').hide();
   				$('.reg').show();
   				$('.regl').show();
   				$("#add_manual_hours_template_form #partner_schedule_template_id").trigger('change');
   			
   			}
   			else if(v=='adj'){
   				$('.reg').hide();
   				$('.regl').hide();
   				$('.adjl').hide();
   				$('.adj').show();
   			}	
   			else{
   				$('.adjl').hide();
   				$('.reg').hide();
   				$('.adj').hide();
   				$('.regl').hide();
   			}

   		});
   		$("#add_manual_hours_template_form #partner_schedule_template_id").select2({
   			placeholder: global_manual_translationsData.Select,
			allowClear: true
   		}).change(function(){
   			var v = $('#add_manual_hours_template_form #partner_schedule_template_id').val();
   			add_manual_hours.populateFields(v);
   		});

   		$('#add_manual_hours_btn_save').click(function(){
   			add_manual_hours.saveData();
   		});
	},
	saveData:function(){

		var manual_action = $("#add_manual_hours_template_form #manual_action").val();
		var errmsg = '';
		if(manual_action=='' || manual_action==undefined || manual_action==null){
			errmsg += global_manual_translationsData.Action+'<br/>';
		}
		else{
			if(manual_action=='reg'){
				var partner_schedule_template_id = $("#add_manual_hours_template_form #partner_schedule_template_id").val();
				
				if(partner_schedule_template_id=='' || partner_schedule_template_id==undefined || partner_schedule_template_id==null){
					errmsg += global_manual_translationsData.Type+'<br/>';
				}
				var custom_type = partner_schedule_template_id;
			}
			else if(manual_action=='adj'){
				var action = $("#add_manual_hours_template_form #action").val();
				
				if(action=='' || action==undefined || action==null){
					errmsg += global_manual_translationsData.Pleasechooseamongthefollowingoptions+'<br/>';
				}
				var hours = $("#add_manual_hours_template_form #hours").val();
		   		if(hours=='' || hours==undefined || hours==null){
					errmsg += global_manual_translationsData.hours+'<br/>';
				}
				var custom_type = 'adj';
			}
		}

		if(errmsg!=''){
			var finalerrmsg = global_manual_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,global_manual_translationsData.error,global_manual_translationsData.AlertMessage);
			return;
		}


		if(manual_action=='reg'){
			var hours = $("#add_manual_hours_template_form #hours").val();
	   		if(hours=='' || hours==undefined || hours==null){
				errmsg += global_manual_translationsData.hours+'<br/>';
			}

	   		var date =  $("#add_manual_hours_template_form #date").data('datepicker').viewDate;
	   		var date1 =  $("#add_manual_hours_template_form #date").val();
	   		if(date1=='' || date1==undefined || date1==null){
				errmsg += global_manual_translationsData.Date+'<br/>';
			}
			date = moment(date).format("YYYY-MM-DD HH:mm:ss");

			var time = $("#add_manual_hours_template_form #time").val();
	   		if(time=='' || time==undefined || time==null){
				errmsg += global_manual_translationsData.Time+'<br/>';
			}
		}
	
		if(errmsg!=''){
			var finalerrmsg = global_manual_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,global_manual_translationsData.error,global_manual_translationsData.AlertMessage);
			return;
		}

		var plus_minus = $("#add_manual_hours_template_form #action").val();
		if(plus_minus=='minus'){
			var hours = 0 - hours;
		}
		if(manual_action=='reg'){
			var hours = 0 - hours;
			var name = '';
			if(partner_schedule_template_id!='other'){
				for(var j in global_add_manual_hours_data.PartnerScheduleTemplate){
					var a = global_add_manual_hours_data.PartnerScheduleTemplate[j];
					if(a.PartnerScheduleTemplate.id==partner_schedule_template_id){
						name = a.PartnerScheduleTemplate.name;
					}
				}
			}
			else{
				name = 'other';
			}
		}
		var params = {
			admin_id:admin_id,
			partner_id:partner_id,		
			hours:hours,
			customer_id:global_add_manual_hours_metadata.customer_id,
			type:custom_type,
			custom_date:date,
		};

		

		var total_params = {
			data:params,
			model:'customerVoluntaryBanks',
			action:'create',
			emitevent:'customerVoluntaryBanksAd',
			emithis:{name:name},
		};
		console.log(total_params);
		showProcessingImage('undefined');
		socket.on('customerVoluntaryBanksAd',function(data){
			if(data.error==null){
				hideProcessingImage();
				$('#'+global_manual_schedule_popupid).modal('hide');
				call_toastr(global_manual_translationsData.success, global_manual_translationsData.Success,global_manual_translationsData.Manualentryaddedsuccessfully);
			}
		});
		socket.emit('crud',total_params);
	},
	populateFields:function(res){
		if(res==''){
			$('.regl').hide();
			return;
		}
		else if(res=='other'){
			$('#add_manual_hours_template_form #time').val('');
			$('#add_manual_hours_template_form #hours').val('');
			$('.regl').show();
		}
		else{
			for(var j in global_add_manual_hours_data.PartnerScheduleTemplate){
				var a = global_add_manual_hours_data.PartnerScheduleTemplate[j].PartnerScheduleTemplate;
				console.log(a);
				if(res==a.id){
					$('#add_manual_hours_template_form #time').val(a.start_time);
					$('#add_manual_hours_template_form #hours').val(a.hours);
					$('.regl').show();
					break;
				}
			}
		}
		$('#'+global_manual_schedule_popupid).resize();
	},
	listenForData:function(){
	},
	generateTemplateList:function(data){
		var ret = '';
		ret += '<option value="'+data.id+'">';
			ret += data.name;
		ret += '</option>';
		return ret;
	},
};
Template7.registerHelper('createScheduleListHelper', function (data){
	return add_manual_hours.generateTemplateList(data);
});