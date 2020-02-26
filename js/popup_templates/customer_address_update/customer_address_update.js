
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var global_cust_addr_updt_meta_data;
var global_cust_addr_updt_data;
var global_cust_addr_updt_popupid = 'popups';
var global_ret_translations;
var customer_address_update = {
	start:function(popupid,metadata={}){
		global_cust_addr_updt_popupid = popupid;
		global_cust_addr_updt_meta_data = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:global_cust_addr_updt_meta_data.customer_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Update customer address','Postal address','Delivery address','Please check the following fields','Alert message','Success','success','Address1','Address2','Zip','City','success','Success','Address1','Address2','Postal address1','Postal address2','City','Zip','Country','Activate','Postal zip','Postal city','Postal country','Delivery zip','Delivery city','Delivery country','Customer address has been updated successfully','Resend document'],
		};
		if(global_cust_addr_updt_meta_data.id!=null && global_cust_addr_updt_meta_data.id!=undefined && global_cust_addr_updt_meta_data!=''){
			total_params.id = global_cust_addr_updt_meta_data.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerAddress.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_cust_addr_updt_data = complet_data.response.response;
				
				if(checkNull(global_cust_addr_updt_data.customerAddresses.Customer.customer_country)==''){
					global_cust_addr_updt_data.customerAddresses.Customer.customer_country = global_cust_addr_updt_data.partner_country;
				}
				if(checkNull(global_cust_addr_updt_data.customerAddresses.Customer.delivery_country)==''){
					global_cust_addr_updt_data.customerAddresses.Customer.delivery_country = global_cust_addr_updt_data.partner_country;
				}

				global_ret_translations = complet_data.response.response.translationsData;
				customer_address_update.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_ret_translations.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_ret_translations.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		var template = document.getElementById('customer_address_update_template').innerHTML;
		var compiledRendered = Template7(template, global_cust_addr_updt_data);
		document.getElementById(global_cust_addr_updt_popupid).innerHTML = compiledRendered;
		customer_address_update.bindEvents();
		resizemodal(global_cust_addr_updt_popupid);
	},
	bindEvents:function(){
		$('.same_postal_address').uniform().change(function(){
			if($('.same_postal_address:checked').length==1){
				$('.delivery_block').removeClass('hide');
			}
			else{
				$('.delivery_block').addClass('hide');
			}
		});

	
		$('#DeliveryCountry').change(function(){
			var v = $('#DeliveryCountry').val();
			$('#DeliveryZip').inputmask('remove');
			if(v=='NO'){
				limitDigits('DeliveryZip',4);
			}
			else{
				limitAlphadigitValue('DeliveryZip',15);
			}
		}).select2().trigger('change');


		$('#CustomerCountry').change(function(){
			var v = $('#CustomerCountry').val();
			$('#CustomerZip').inputmask('remove');
			if(v=='NO'){
				limitDigits('CustomerZip',4);
			}
			else{
				limitAlphadigitValue('CustomerZip',15);
			}
		}).select2().trigger('change');

		$('#save_cutomer_address').click(function(){
			customer_address_update.saveData();
		});
	},
	getCityFromZip:function(target,target1){
		var zip = $(target).val();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			ccode:"NO",
			zip:zip
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/logins/getCityFromZip.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				if(complet_data.response.response.city!=undefined || complet_data.response.response.city!=null){
					$(target1).val(complet_data.response.response.city);
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					//showAlertMessage(array,'error',global_ret_translations.Alertmessage);
					return;
				}else{
					//showAlertMessage(complet_data.response.response.msg,'error',global_ret_translations.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	saveData:function(){
		var errmsg = '';

		var CustomerZip = $('#customer_address_update_form #CustomerZip').val();
		if(checkNull(CustomerZip)==''){
			errmsg += global_cust_addr_updt_data.translationsData.Postalzip+'<br/>';
		}

		var CustomerCity = $('#customer_address_update_form #CustomerCity').val();
		if(checkNull(CustomerCity)==''){
			errmsg += global_cust_addr_updt_data.translationsData.Postalcity+'<br/>';
		}

		var CustomerCountry = $('#customer_address_update_form #CustomerCountry').val();
		if(checkNull(CustomerCountry)==''){
			errmsg += global_cust_addr_updt_data.translationsData.Postalcountry+'<br/>';
		}

		var same_postal_address  = $('.same_postal_address:checked').length;
		var CustomerAddress1 = $('#customer_address_update_form #CustomerAddress1').val();
		var CustomerAddress2 = $('#customer_address_update_form #CustomerAddress2').val();


		if(same_postal_address==1){
			var DeliveryZip = $('#customer_address_update_form #DeliveryZip').val();
			if(checkNull(DeliveryZip)==''){
				errmsg += global_cust_addr_updt_data.translationsData.Deliveryzip+'<br/>';
			}

			var DeliveryCity = $('#customer_address_update_form #DeliveryCity').val();
			if(checkNull(DeliveryCity)==''){
				errmsg += global_cust_addr_updt_data.translationsData.Deliverycity+'<br/>';
			}

			var DeliveryCountry = $('#customer_address_update_form #DeliveryCountry').val();
			if(checkNull(DeliveryCountry)==''){
				errmsg += global_cust_addr_updt_data.translationsData.Deliverycountry+'<br/>';
			}
			var DeliveryAddress1 = $('#customer_address_update_form #DeliveryAddress1').val();
			var DeliveryAddress2 = $('#customer_address_update_form #DeliveryAddress2').val();
			var DeliveryCountry = $('#customer_address_update_form #DeliveryCountry').val();
		}
		else{
			var DeliveryZip = CustomerZip;
			var DeliveryCity = CustomerCity;
			var DeliveryAddress1 = CustomerAddress1;
			var DeliveryAddress2 =  CustomerAddress2;
			var DeliveryCountry =  CustomerCountry;
		}

	

		

		if(errmsg!=''){
			var finalerrmsg = global_ret_translations.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_ret_translations.AlertMessage);
			return;
		}


		if(same_postal_address==1){
			same_postal_address = 'y';
		}
		else{
			same_postal_address = 'n';
		}
		var vrfy = {
			customer_address1: CustomerAddress1,
			customer_address2: CustomerAddress2,
			customer_city: CustomerCity,
			customer_country: CustomerCountry,
			customer_zip: CustomerZip,
			delivery_address1: DeliveryAddress1,
			delivery_address2: DeliveryAddress2,
			delivery_city: DeliveryCity,
			delivery_country: DeliveryCountry,
			delivery_zip: DeliveryZip,
			same_postal_address:same_postal_address,
		};
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,

			CustomerAddress1:CustomerAddress1,
			CustomerAddress2:CustomerAddress2,
			CustomerZip:CustomerZip,
			CustomerCity:CustomerCity,
			CustomerCountry:CustomerCountry,

			DeliveryAddress1:DeliveryAddress1,
			DeliveryAddress2:DeliveryAddress2,
			DeliveryZip:DeliveryZip,
			DeliveryCity:DeliveryCity,
			DeliveryCountry:DeliveryCountry,

			same_postal_address:same_postal_address,

			customer_id:global_cust_addr_updt_meta_data.customer_id
		};

		//console.log(global_cust_addr_updt_data.customerAddresses.Customer);
		var modified = 'n';
		for(var j in global_cust_addr_updt_data.customerAddresses.Customer){
			var cust = global_cust_addr_updt_data.customerAddresses.Customer[j];
			
			
			if(j!='customer_country' || j!='delivery_country'){
				if(vrfy[j].trim()!=cust.trim()){
					modified = 'y';
					break;
				}
			}

		}
		total_params.modified = modified;

		if(global_cust_addr_updt_meta_data.id!=null && global_cust_addr_updt_meta_data.id!=undefined && global_cust_addr_updt_meta_data!=''){
			total_params.id = global_cust_addr_updt_meta_data.id;
		}
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/saveCustomerAddress.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				customer_address_update.generateNotification(complet_data.response.response.getPartnerNotifications);
				call_toastr(global_ret_translations.success, global_ret_translations.Success,global_ret_translations.Customeraddresshasbeenupdatedsuccessfully);						
				$('#'+global_cust_addr_updt_popupid).modal('hide');

				var html = '<li class="dropdown" id="header_notification_bar"><img src="'+host_url+'app/webroot/img/ajax-modal-loading.gif" style="width: 20px;position: absolute;"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" style="margin-top: 0px;"><i class=" icon-bell"></i></a></li>';
				$('#header_notification_bar').remove();
				$('div.header ul.pull-right li.user').parent().prepend(html);


				var redirect_url = base_url+ 'customers/get_all_customer_rs_docs/'+global_cust_addr_updt_meta_data.customer_id+'/?tab=popups1&from=popup';
				if(complet_data.response.response.RS_flag){
					console.log(redirect_url);
					show_modal('','popups1','',redirect_url);
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					var finalerrmsg = global_ret_translations.Pleasecheckthefollowingfields+ ':<br/>' + array;
					showAlertMessage(finalerrmsg,'error',global_ret_translations.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_ret_translations.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	
	},
	generateNotification:function(data){
	
		var total_params = {getPartnerNotifications:data};
		var url =  base_url+'dashboard/partner_notifications';
	
		$.ajax({
		    type: "POST",
		    url: url,
		    data: total_params,
		    async:true,
		    beforeSend: function (xhr) 
	        {
		    	
	        },
		    success: function(data,status,xhr){
		    	$('#header_notification_bar').remove();
		    	$('div.header ul.pull-right li.user').parent().prepend(data);
		    },
		    error: function(xhr, status, error){
		    	
		       
		    }
		});
	},
	generate_cust_country:function(id,data){
		var ret = '';
		if(global_cust_addr_updt_data.customerAddresses.Customer.customer_country==id){
			ret += '<option value="'+id+'" selected="selected">';
		}
		else{
			ret += '<option value="'+id+'">';
		}	
			ret += data;
		ret += '</option>';
		return ret;
	},
	generate_deli_country:function(id,data){
		var ret = '';
		if(global_cust_addr_updt_data.customerAddresses.Customer.delivery_country==id){
			ret += '<option value="'+id+'" selected="selected">';
		}
		else{
			ret += '<option value="'+id+'">';
		}	
			ret += data;
		ret += '</option>';
		return ret;
	},

}


Template7.registerHelper('CustomerCountryHelper', function (id,data){
	return customer_address_update.generate_cust_country(id,data);
});

Template7.registerHelper('DeliveryCountryHelper', function (id,data){
	return customer_address_update.generate_deli_country(id,data);
});

