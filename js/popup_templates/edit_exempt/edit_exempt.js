var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var popupid = 'popups';

var ee_meta;
var ee_dt;
var ee_popid = 'popups';
var ee_td;
var cache = [];
var edit_exempt = {
	start:function(popupid,metadata={}){
		ee_popid = popupid;
		ee_meta = metadata;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			customer_id:ee_meta.customer_id,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Absence','Save','Cancel','Edit customer','Name','Please check the following fields','Alert Message','Success','success','AlertMessage','Participant','Exempt','Specialty work','Status','Exempt reason','Specialty work regarding','Select','$customerh','$cust_name_num'],
		};

		if(checkNull(ee_meta.customer_id) != ''){
			total_params['from'] = 'edit';
		}
		else{
			total_params['from'] = 'add';
		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getEditCustExempt.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ee_dt = complet_data.response.response;
				ee_td = complet_data.response.response.translationsData;

				edit_exempt.createHtml(complet_data.response.response);
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
		if(checkNull(ee_meta.customer_id) != ''){
			ee_dt['from'] = 'edit';
		}
		else{
			ee_dt['from'] = 'add';
		}

		var template = document.getElementById('edit_exempt_template').innerHTML;
		var compiledRendered = Template7(template, ee_dt);
		document.getElementById(ee_popid).innerHTML = compiledRendered;
		resizemodal(ee_popid);
		edit_exempt.bindEvents();
	},
	bindEvents:function(){

		$('#edit_exempt_save').click(function(){
			edit_exempt.saveData();
		});

		$('#CustomerVolunteerType').select2();
		$('#CustomerVolunteerType').change(function(){
			var v = $('#CustomerVolunteerType').val();
			if(v == 'exempt'){
				$('.specialty_work').hide();
				$('.exempt_reason').show();
				$('#CustomerVoluntaryNote').val('');
			}
			else if(v == 'specialty_work'){
				$('.specialty_work').show();
				$('.exempt_reason').hide();
				$('#CustomerVoluntaryExempt').val('').trigger('change');
			}
			else{
				$('.exempt_reason,.specialty_work').hide();
				$('#CustomerVoluntaryNote').val('');
				$('#CustomerVoluntaryExempt').val('').trigger('change');
			}
		});

		$('#CustomerVoluntaryExempt').select2({
			placeholder:ee_td.Select,
			allowClear:true
		});

		$('#CustomerVoluntaryNote').val(checkNull(ee_dt.customer_data.Customer.voluntary_note));
		$('#CustomerVoluntaryExempt').val(checkNull(ee_dt.customer_data.Customer.voluntary_note)).trigger('change');
		
		if(checkNull(ee_dt.customer_data.Customer.volunteer_type) != ''){
			$('#CustomerVolunteerType').val(ee_dt.customer_data.Customer.volunteer_type).trigger('change');
		}
		else{
			$('#CustomerVolunteerType').val('participant').trigger('change');
		}	

		if(ee_dt['from'] == 'add'){
			$('.participant_data').hide();
			$('.participant_cust_show').show();

			$('#customer_h').autocomplete({
				autoFocus: true,	
				source: function( request, response ) {
	        		var term = request.term;
	        		if( term in cache ) {
	          			response( cache[ term ] );
	          			return;
	        		}
	        		var results = $.ui.autocomplete.filter(ee_dt.customer_list, request.term);
	        	
	        		cache[ term ] = results;
	                response(results.slice(0, 100));
	  			},
				minLength: 1,
				select: function( event, data ) {
					edit_exempt.getCustomerDetails(data.item.id);
				},
			});
			$('ul.ui-autocomplete').css('z-index','100000');
		}
		else{
			$('.participant_cust_show').hide();
		}
	},
	getCustomerDetails:function(customer_id){
		$('.participant_data').hide();
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:customer_id,
			from:'details',
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getEditCustExempt.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ee_meta.customer_id = customer_id;
				$('.participant_data').show();
				var customer_data = complet_data.response.response.customer_data;
				$('#CustomerVoluntaryNote').val(checkNull(customer_data.Customer.voluntary_note));
				$('#CustomerVoluntaryExempt').val(checkNull(ee_dt.customer_data.Customer.voluntary_note)).trigger('change');
				if(checkNull(customer_data.Customer.volunteer_type) != ''){
					$('#CustomerVolunteerType').val(customer_data.Customer.volunteer_type).trigger('change');
				}
				else{
					$('#CustomerVolunteerType').val('participant').trigger('change');
				}
				
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
	},
	saveData:function(){

		var volunteer_type = $('select#CustomerVolunteerType').val();
		var voluntary_note = '';

		if(volunteer_type == 'exempt'){
			voluntary_note = $('select#CustomerVoluntaryExempt').val();
		}
		else if(volunteer_type == 'specialty_work'){
			voluntary_note = $('#CustomerVoluntaryNote').val();
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			customer_id:ee_meta.customer_id,
			partner_id:partner_id,
			admin_id:admin_id,
			voluntary_note:voluntary_note,
			volunteer_type:volunteer_type,
			from:'voluntary'
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/updateSalesProperties.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				exempt.start();
				$('#'+ee_popid).modal('hide');
				call_toastr('success',ee_td.Success,checkNull(complet_data.response.response.message.msg));
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
}