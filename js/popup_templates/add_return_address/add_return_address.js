
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();


var global_ret_addr_meta_data;
var global_ret_addr_data;
var global_ret_addr_popupid = 'popups';
var global_ret_translations;
var add_return_address = {
	start:function(popupid,metadata={}){
		global_ret_addr_popupid = popupid;
		global_ret_addr_meta_data = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Add return address','Edit return address','Name','Please check the following fields','Alert message','Success','success','Address1','Address2','Zip','City','success','Success','Return address added successfully','Success','Return address edited successfully'],
		};
		if(global_ret_addr_meta_data.id!=null && global_ret_addr_meta_data.id!=undefined && global_ret_addr_meta_data!=''){
			total_params.id = global_ret_addr_meta_data.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getPartnerReturnAddress.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_ret_addr_data = complet_data.response.response;
				global_ret_translations = complet_data.response.response.translationsData;
				add_return_address.createHtml(complet_data.response.response);
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
		var template = document.getElementById('add_return_address_template').innerHTML;
		var compiledRendered = Template7(template, global_ret_addr_data);
		document.getElementById(global_ret_addr_popupid).innerHTML = compiledRendered;
		add_return_address.bindEvents();
		resizemodal(global_ret_addr_popupid);
	},
	bindEvents:function(){
		$('#zip').change(function(){
			add_return_address.getCityFromZip('#zip','#city');
		});	
		$('#add_return_address_save').click(function(){
			add_return_address.saveData();
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

		var name = $('#add_return_address_form #name').val();
		if(name=='' || name==undefined || name==null){
			errmsg += global_ret_addr_data.translationsData.Name+'<br/>';
		}

		var zip = $('#add_return_address_form #zip').val();
		if(zip=='' || zip==undefined || zip==null){
			errmsg += global_ret_addr_data.translationsData.Zip+'<br/>';
		}

		var city = $('#add_return_address_form #city').val();
		if(city=='' || city==undefined || city==null){
			errmsg += global_ret_addr_data.translationsData.City+'<br/>';
		}

		if(errmsg!=''){
			var finalerrmsg = global_ret_translations.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_ret_translations.AlertMessage);
			return;
		}
		var address1 = $('#add_return_address_form #address1').val();
		var address2 = $('#add_return_address_form #address2').val();

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			name:name,
			address1:address1,
			address2:address2,
			zip:zip,
			city:city,
		};
		if(global_ret_addr_meta_data.id!=null && global_ret_addr_meta_data.id!=undefined && global_ret_addr_meta_data!=''){
			total_params.id = global_ret_addr_meta_data.id;
		}
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/savePartnerReturnAddress.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
					
					if(global_ret_addr_meta_data.from!=undefined){
						if(global_ret_addr_meta_data.from=='man_digi'){
							if(manual_digipost!=undefined){
								if(manual_digipost!=null && manual_digipost!=''){
									if(manual_digipost.generateRetAddrList)
										 if (typeof manual_digipost.generateRetAddrList === "function") {
											manual_digipost.generateRetAddrList(complet_data.response.response.PartnerReturnAddress,'append');
										}
								}
							}
						}
						else{
							if(typeof admin_return_addresses!==undefined){
								if(admin_return_addresses!==null && admin_return_addresses!==''){
									 if (typeof admin_return_addresses.generateAddrList === "function") {
										admin_return_addresses.generateAddrList(complet_data.response.response.PartnerReturnAddress,'append');
									}
								}
							}
						}
					}
					else{
						if(typeof admin_return_addresses!==undefined){
							if(admin_return_addresses!==null && admin_return_addresses!==''){
								 if (typeof admin_return_addresses.generateAddrList === "function") {
									admin_return_addresses.generateAddrList(complet_data.response.response.PartnerReturnAddress,'append');
								}
							}
						}
					}
					
					
					if(global_ret_addr_meta_data.id!=null && global_ret_addr_meta_data.id!=undefined && global_ret_addr_meta_data!=''){
						call_toastr(global_ret_translations.success, global_ret_translations.Success,global_ret_translations.Returnaddresseditedsuccessfully);
					}
					else{
						call_toastr(global_ret_translations.success, global_ret_translations.Success,global_ret_translations.Returnaddressaddedsuccessfully);						
					}
					$('#'+global_ret_addr_popupid).modal('hide');
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
	
	}
}