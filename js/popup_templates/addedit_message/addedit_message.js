var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var aem_dt;
var aem_meta;
var aem_ppid = 'popups';
var aem_td;
var addedit_message = {
	start:function(popupid,metadata={}){
		aem_ppid = popupid;
		aem_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Please check the following fields','Alert message','Success','Add message','Edit message','Title','Content','Category','News','Operational message','Valid from','Valid through','Show on dashboard','Sticky','Yes','No','Valid from should be less than of valid through','To date is passed','From date is passed'],
		};
		if(aem_meta.id!=null && aem_meta.id!=undefined && aem_meta!=''){
			total_params.id = aem_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/editMessages.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				aem_dt = complet_data.response.response;
				aem_td = complet_data.response.response.translationsData;
				addedit_message.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',aem_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',aem_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		aem_dt.aem_meta = aem_meta;
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		aem_dt.date_format_f = date_format_f;

		var template = document.getElementById('addedit_message_template').innerHTML;
		var compiledRendered = Template7(template, aem_dt);
		document.getElementById(aem_ppid).innerHTML = compiledRendered;
		resizemodal(aem_ppid);
		addedit_message.bindEvents();
	},
	bindEvents:function(){
		$('#addedit_message_form #from_date,#addedit_message_form #to_date').datepicker({
   			format:aem_dt.date_format_f,
   			startDate:moment().add(-1, 'days')._d,
   		}).change(function(){
   			$('.datepicker').remove();
   		});

   		$('#addedit_message_form #category').select2();

   		$('#addedit_message_form #show_on_dashboard').bootstrapSwitch();
   		$('#addedit_message_form #sticky').bootstrapSwitch();

   		$('#addedit_message_form #show_on_dashboard').on('switch-change', function (e, data) {
   			var value = data.value;
   			$('#addedit_message_form #sticky').bootstrapSwitch('setState', false);
			if(value){
				$('.sticky_wrapper').removeClass('hide');
			}
			else{
				$('.sticky_wrapper').addClass('hide');
			}
   		});

   		if(aem_meta.from == 'edit'){
   			var d = aem_dt.partnerMessageNews.PartnerMessageNews;
   			$('#addedit_message_form #title').val(checkNull(d.title));
   			$('#addedit_message_form #content').val(checkNull(d.content));
   			$('#addedit_message_form #category').val(checkNull(d.category)).trigger('change');
   			$('#addedit_message_form #from_date').val(convertDateIntoSiteFormat(checkNull(d.from_date))).datepicker('update').trigger('change');
   			$('#addedit_message_form #to_date').val(convertDateIntoSiteFormat(checkNull(d.to_date))).datepicker('update').trigger('change');
   			if(d.show_on_dashboard == 1){
   				$('#addedit_message_form #show_on_dashboard').bootstrapSwitch('setState',true);
   			}
   			else{
   				$('#addedit_message_form #show_on_dashboard').bootstrapSwitch('setState',false);
   			}

   			if(d.sticky == 1){
   				$('#addedit_message_form #sticky').bootstrapSwitch('setState',true);
   			}
   			else{
   				$('#addedit_message_form #sticky').bootstrapSwitch('setState',false);
   			}
   			$('#addedit_message_form #from_date').attr('disabled','disabled');
   			//$('#addedit_message_form #to_date').attr('disabled','disabled');
   		}

   		$('#addedit_message_save').click(function(){
   			addedit_message.saveData();
   		});
	},
	saveData:function(){
		var title = $('#addedit_message_form #title').val();
		var content = $('#addedit_message_form #content').val();
		var category = $('#addedit_message_form #category').val();
		var from_date = $('#addedit_message_form #from_date').datepicker('getDate');
		var to_date = $('#addedit_message_form #to_date').datepicker('getDate');
		var show_on_dashboard = $('#addedit_message_form #show_on_dashboard').bootstrapSwitch('status');
		if(show_on_dashboard){
			show_on_dashboard = 1;
		}
		else{
			show_on_dashboard = 0;
		}

		var sticky = $('#addedit_message_form #sticky').bootstrapSwitch('status');
		if(sticky){
			sticky = 1;
		}
		else{
			sticky = 0;
		}


		var errmsg = '';
		if(checkNull(title) == ''){
			errmsg += aem_td.Title+'<br/>';
		}
		if(checkNull(content) == ''){
			errmsg += aem_td.Content+'<br/>';
		}
		if(checkNull(category) == ''){
			errmsg += aem_td.Category+'<br/>';
		}

		var dateerr = '';
		if(checkNull(from_date) == ''){
			dateerr = 1;
			errmsg += aem_td.Validfrom+'<br/>';
		}
		if(checkNull(to_date) == ''){
			dateerr = 1;
			errmsg += aem_td.Validthrough+'<br/>';
		}
		if(dateerr == ''){
			var f_date = moment(moment(from_date).format('YYYY-M-D')).unix();
			var t_date = moment(moment(to_date).format('YYYY-M-D')).unix();
			var today_date = moment(moment().format('YYYY-M-D')).unix();

			if(f_date > t_date){
				errmsg += aem_td.Validfromshouldbelessthanofvalidthrough+'<br/>';
			}
			if(aem_meta.from != 'edit'){
				if(f_date < today_date){
					errmsg += aem_td.Fromdateispassed+'<br/>';
				}
			}
			if(t_date < today_date){
				errmsg += aem_td.Todateispassed+'<br/>';
			}
		}

		if(errmsg != ''){
			errmsg = aem_td.Pleasecheckthefollowingfields+'<br/>' + errmsg;
			showAlertMessage(errmsg,'error',aem_td.Alertmessage);
			return;
		}

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			title:title,
			content:content,
			category:category,
			from_date:moment(from_date).format('YYYY-MM-DD'),
			to_date:moment(to_date).format('YYYY-MM-DD'),
			show_on_dashboard:show_on_dashboard,
			sticky:sticky
		};

		if(aem_meta.from == 'edit'){
   			var d = aem_dt.partnerMessageNews.PartnerMessageNews;
   			total_params['id'] = d.id;
   		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/addMessages.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var d = complet_data.response.response.getAdminMessages	;
				admin_messages.generateRows(d);
				call_toastr('success',aem_td.Success,complet_data.response.response.message.msg);
				$('#'+aem_ppid).modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',aem_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',aem_td.Alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;



	},
}