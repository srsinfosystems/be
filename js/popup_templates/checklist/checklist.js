var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var login_id = $('#login_id').val();
var brand_name = $('#brand_name').val();

var active_tab = 'tab_info';
var c_meta;
var c_dt;
var c_popid = 'popups';
var c_td;
var br_lu=[];
var line_key = 0;
var save_data = {};
var checklist = {
	start:function(popupid,metadata={}){
		c_popid = popupid;
		c_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			login_id:login_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Startup wizard','Company','Accounting','Invoicing','Accounting scheme','Next','Cancel','ein','is not valid','Company name','Address','Zip','City','Country','General ledger bank account','Select','Yes','No','Vat registered','Vat period','Monthly','$twomonth','Yearly','$bankacchash','Edit accounting scheme','Enable KID','Supported invoice distribution methods','Email','EHF','postal invoices'   ,'Distribution priority','Active','code','name','MVA','Remove','Add','EIN','Please check the following fields','Alert message','Previous','Save','Please correct the errors','Success','Requires a separate agreement with the bank','Company email','Company phone','Company cellphone','Password','$repass','Password do not match','Start','Welcome','$welcome_content'],
		};
		if(c_meta.id!=null && c_meta.id!=undefined && c_meta!=''){
			total_params.id = c_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getPartnerDefaultData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				c_dt = complet_data.response.response;
				c_td = complet_data.response.response.translationsData;
				checklist.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error','error');
					$('#'+c_popid).modal('hide');
					localStorage.removeItem('showwizard');
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error','error');
					$('#'+c_popid).modal('hide');
					localStorage.removeItem('showwizard');
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		c_dt['brand_name'] = brand_name;
		c_td.$welcome_content = c_td.$welcome_content.replace('%brandname%',brand_name);

		var template = document.getElementById('checklist_template').innerHTML;
		var compiledRendered = Template7(template, c_dt);
		document.getElementById(c_popid).innerHTML = compiledRendered;
		resizemodal(c_popid);
		checklist.bindjs();
		checklist.bindEvents();
		//$('#'+c_popid).resize();
	},
	bindEvents:function(){
		try{
			$('#company_cellphone').val(checkNull(c_dt.partnerData.splitPhoneArr.number));
			$('#company_email').val(checkNull(c_dt.partnerData.partner_email));
			if(checkNull(c_dt.partnerData.partner_email) != ''){
				$('#company_email').attr('disabled','disabled');
			}
		}
		catch(e){}

		$('.popover_custom').mouseover(function(){
		$('.popovermy').remove();
			var a = $(this).position();
			var l = a.left - 92;
			var t = a.top ;
			var c = $(this).attr('data-content');

			var html = '<div class="popovermy popover fade top in" style="width:200px;top: '+t+'px; left: '+l+'px; display: block;position:absolute"><div class="arrow"></div><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content">'+c+'</div></div>';
			$(this).append(html);
			var a= $('.popovermy').height();
			$('.popovermy').css('top',(parseInt(t)-parseInt(a))+'px');
			});
		$('.popover_custom').mouseout(function(){
			$('.popovermy').remove();
		});
		
		$('.navbar').css('filter','blur(3px)');
		$('.page-container').css('filter','blur(3px)');
		$('.popups').css('filter','blur(3px)');

		$('#popupslogin').css({
			'filter':'blur(0)',
			'border': 'none',
			'box-shadow': 'none',
		});

		// $('#ein').keyup(function(){
		// 	var ein = $('#ein').val();
		// 	if(ein.length < 9){
		// 		$('.ein.error_msg').show();
		// 		return;
		// 	}
		// 	$('.ein.error_msg').hide();
			
		// 	checklist.checkEIN(ein);
		
		// });

		$('#ein').blur(function(){
			var ein = $('#ein').val();
			if(ein.length < 9){
				$('.ein.error_msg').show();
				return;
			}
			$('.ein.error_msg').hide();
			checklist.checkEIN(ein);
		
		});
		
		$('#bank_account').blur(function(){
			var bank_account = $('#bank_account').val();

			if(!validateAccount(bank_account)){
				$('#bank_account').parent().parent().addClass('error');
			}
			else{
				$('#bank_account').parent().parent().removeClass('error');
			}
		});

		$("input#company_cellphone").intlTelInput({
			initialCountry: "NO",
		  	geoIpLookup: function(callback) {
		  		callback('NO');		
		 	},
		  	preferredCountries:['NO']
	 	});
	 	$('.selected-flag').off();
		$('.iti-arrow').hide();

			// $(".step1 #PartnerPhone").on("countrychange", function(e, countryData) {
			// 	console.log(countryData.iso2);
			// 	  if(countryData.iso2 == 'no'){
			// 	  		var id=".step1 #PartnerPhone";
			// 	  		limitNumbers(id,8);
	  //               	$( "#PartnerPhone" ).rules( "remove", "minlength maxlength" );
	  //               	$( "#PartnerPhone" ).rules( "add", {
			// 				  minlength: 8,
			// 				  maxlength: 8,
			// 				});
		 //            }
		 //            else{
		 //            	var id=".step1 #PartnerPhone";
			// 	  		limitNumbers(id,10);
	  //               	/*$( "#PartnerPhone" ).rules( "remove", "minlength maxlength" );
	  //               	$( "#PartnerPhone" ).rules( "add", {
			// 				  minlength: 10,
			// 				  maxlength: 10,
			// 				});*/
		 //            }
		            
			// });

		$('#country').select2({
			placeholder:c_td.Country,
			allowClear:true
		});
		
		$('#vat_period').select2({
			placeholder:c_td.Select,
			allowClear:true
		});

			

		$('#company_name').change(function(){ $('#scompany_name').html($(this).val()); });
		$('#address').change(function(){ $('#saddress').html($(this).val()); });
		$('#zip').change(function(){ $('#szip').html($(this).val()); });
		$('#city').change(function(){ $('#scity').html($(this).val()) });
		$('#country').change(function(){ $('#postal_country').html($('#country option:selected').text()); });


		$('#vat_registered,#edit_scheme,#enable_kid').bootstrapSwitch();

		$('#vat_registered').on('switch-change', function (e, data) {
			var value = data.value;
			if(value){
				$('#vat_period').parent().parent().show();
			}
			else{
				$('#vat_period').parent().parent().hide();
			}
		});
		$('#vat_period').parent().parent().hide();
		$('#edit_scheme').on('switch-change', function (e, data) {
		    var value = data.value;
		    if(value){
		    	$('.wizard a[data-tab="tab_accountingscheme"]').parent().show().removeClass('deact').addClass('act');
		    }
		    else{
		    	$('.wizard a[data-tab="tab_accountingscheme"]').parent().hide().addClass('deact').removeClass('act');
		    }
		    checklist.setStatus();
		});

		$( "#distrib_order" ).sortable({
			handle: ".dd-handle",
			items: 'li:not(.dd_disabled)',
			connectWith: ".dd-list",
			stop: function( event, ui ) {
			},
			start : function ( event,ui) {
			}
		});
		
		$('.distrib_method').change(function(){
			var checked = $(this).is(':checked');

			var v = $(this).val();
			if(checked){
				$('#distrib_order li[data-id="'+v+'"]').removeClass('dd_disabled');
			}
			else{
				$('#distrib_order li[data-id="'+v+'"]').addClass('dd_disabled');
			}
			
			$( "#distrib_order" ).sortable('destroy');
			$( "#distrib_order" ).sortable({
				handle: ".dd-handle",
				items: 'li:not(.dd_disabled)',
				connectWith: ".dd-list",
				stop: function( event, ui ) {
				},
				start : function ( event,ui) {
				}
			});
			

			// $('.distrib_method').each(function(){
			// 	var name = $(this).attr('name');
			// 	var ischecked = $('input[name="'+name+'"]:checked').length;
			// 	var v = $(this).val();
			// 	if(ischecked){
			// 		$('#distrib_order li[data-id="'+v+'"]').show();
			// 	}
			// 	else{
			// 		$('#distrib_order li[data-id="'+v+'"]').hide();
			// 	}
			// });
		});

		limitBankAccount('bank_account',11);
		

		$('.wizard a[data-tab]').click(function(){
			$('.uni').uniform();
			var tab_name = $(this).attr('data-tab');
			if(checkNull(tab_name) == ''){return;}

			$('.wizard .nav a').parent().removeClass('active');
			$(this).parent().addClass('active');
			active_tab = tab_name;

			$('.wizard .tab-content div').removeClass('active');
			$('.wizard .tab-content div#'+tab_name).addClass('active');

			if($('.wizard li.active.act').index() == $('.wizard li.act').length - 1){
				$('#wizard_next').hide();
				$('#wizard_save').show();
			}
			else{
				$('#wizard_next').show();
				$('#wizard_save').hide();
			}

			if($('.wizard li.active.act').index() != 0){
				$('#wizard_prev').show();
			}
			else{
				$('#wizard_prev').hide();
			}
			checklist.setStatus();	
		});

		$('.uni').uniform();

		var opts = '';
		for(var j in c_dt.PartnerTaxLevelAccounts){
			var d = c_dt.PartnerTaxLevelAccounts[j].PartnerTaxLevelAccount;
			if(d.account_number == '1920'){
				opts += '<option value="'+d.id+'" selected="selected">';
			}
			else{
				opts += '<option value="'+d.is+'">';
			}
			
			opts += d.account_number + ' - ' + checkNull(d.account_name);
			opts += '</option>';
		}
		$('#tax_account').append(opts);
		$('#tax_account').select2({
			placeholder:c_td.Select,
			allowClear:true
		});

		var tax_levels = c_dt.taxProfiles[0].PartnerTaxLevel;
		if(tax_levels.length != 0){
			for(var j in tax_levels){
				var d = tax_levels[j];
				var lkey = checklist.addAccountRow();
				$('.account_code[data-id="'+lkey+'"]').val();
				$('.account_name[data-id="'+lkey+'"]').val(checkNull(d.name));
				$('.account_mva[data-id="'+lkey+'"]').val(checkNull(d.percentage));
				$('.account_code[data-id="'+lkey+'"]').parent().attr('data-primary-key',d.id);
			}
		}
		else{
			checklist.addAccountRow();
		}

		
	},
	prevTab:function(){
		$('.uni').uniform();
		var that = $('.wizard li.active a');
		var tab_name = $(that).attr('data-tab');

		if(checkNull(tab_name) == ''){return;}
		if(!checklist.getTabStatus()){return;}
		$('.wizard .nav a').parent().removeClass('active');
		$(that).parent().prev().addClass('active');
		var tab_name = $(that).parent().prev().find('a').attr('data-tab');
		active_tab = tab_name;
		$('.wizard .tab-content div').removeClass('active');
		$('.wizard .tab-content div#'+tab_name).addClass('active');

		if($('.wizard li.active.act').index() == $('.wizard li.act').length - 1 ){
			$('#wizard_next').hide();
			$('#wizard_save').show();
		}
		else{
			$('#wizard_next').show();
			$('#wizard_save').hide();
		}

		if($('.wizard li.active.act').index() != 0){
			$('#wizard_prev').show();
		}
		else{
			$('#wizard_prev').hide();
		}
		checklist.setStatus();
	},
	nextTab:function(){
		$('.uni').uniform();
		var that = $('.wizard li.active a');
		var tab_name = $(that).attr('data-tab');

		if(checkNull(tab_name) == ''){return;}
		if(!checklist.getTabStatus()){return;}
		
		$('.wizard .nav a').parent().removeClass('active');
		$(that).parent().next().addClass('active');
		var tab_name = $(that).parent().next().find('a').attr('data-tab');
		active_tab = tab_name;
		$('.wizard .tab-content div').removeClass('active');
		$('.wizard .tab-content div#'+tab_name).addClass('active');

		if($('.wizard li.active.act').index() == $('.wizard li.act').length - 1){
			$('#wizard_next').hide();
			$('#wizard_save').show();
		}
		else{
			$('#wizard_next').show();
			$('#wizard_save').hide();
		}

		if($('.wizard li.active.act').index() != 0){
			$('#wizard_prev').show();
		}
		else{
			$('#wizard_prev').hide();
		}

		checklist.setStatus();
	},
	getTabStatus:function(tab,frm=''){

		if(frm != 'status'){
			tab = active_tab;
		}
		try{
			
			var errmsg = '';
			if(tab == 'tab_password'){
				if(c_dt.login.ask_change_pass == 0){
					save_data['tab_password'] = {
						pass:'',
						re_pass:'',
						ask_change_pass:0,
					};
				}
				else{
					var pass = $('#pass').val();
					var re_pass = $('#re_pass').val();
					if(checkNull(pass) == ''){
						errmsg += c_td.Password;
					}
					else if(checkNull(pass) != checkNull(re_pass)){
						errmsg += c_td.Passworddonotmatch;
					}
					save_data['tab_password'] = {
						pass:pass,
						re_pass:re_pass,
						ask_change_pass:1,
					};	
				}
			}
			else if(tab == 'tab_company'){

				var ein = $('#ein').val();
				var company_name = $('#company_name').val();
				var address = $('#address').val();
				var zip = $('#zip').val();
				var city = $('#city').val();
				var country = $('#country').val();
				var company_email = $('#company_email').val();
				var company_cellphone = $('#company_cellphone').val();

				save_data['tab_company'] = {
					ein:ein,
					company_name:company_name,
					address:address,
					zip:zip,
					city:city,
					country:country,
					company_email:company_email,
					company_cellphone:company_cellphone
				};
				if(checkNull(ein) == '' || ein.length != 9){
					errmsg += c_td.EIN + '<br/>';
					throw errmsg;
				}
				else{
					if(checkNull(company_name) == ''){
						errmsg += c_td.Companyname + '<br/>';
					}
					if(checkNull(address) == ''){
						errmsg += c_td.Address + '<br/>';
					}
					if(checkNull(zip) == ''){
						errmsg += c_td.Zip + '<br/>';
					}
					if(checkNull(city) == ''){
						errmsg += c_td.City + '<br/>';
					}
					if(checkNull(country) == ''){
						errmsg += c_td.Country + '<br/>';
					}
					if(checkNull(company_email) != ''){
						if(!validateEmail(company_email)){
							errmsg += c_td.Companyemail + '<br/>';
						}
					}

					if(checkNull(company_cellphone) != ''){
						if(company_cellphone.length != 8){
							errmsg += c_td.Companycellphone + '<br/>';
						}
					}

					if(errmsg != ''){
						checklist.editFields(1);
					}
				}
			}
			else if(tab == 'tab_accounting'){
				var bank_account = $('#bank_account').val();
				var tax_account = $('#tax_account').val();
				var vat_registered = $('#vat_registered').bootstrapSwitch('status');
				var vat_period = $('#vat_period').val();

				if(!validateAccount(bank_account)){
					errmsg += c_td.$bankacchash + '<br/>';
				}
				if(checkNull(tax_account) == ''){
					errmsg += c_td.Generalledgerbankaccount + '<br/>';
				}
				if(vat_registered && checkNull(vat_period) == ''){
					errmsg += c_td.Vatperiod + '<br/>';
				}	
				save_data['tab_accounting'] = {
					bank_account:bank_account,
					tax_account:tax_account,
					vat_registered:(vat_registered)?'y':'n',
					vat_period:vat_period,
				};			
			}
			else if(tab == 'tab_invoicing'){
				var enable_kid = $('#enable_kid').bootstrapSwitch('status');
				
				var distrib_order = [];
				var distrib_method = [];
				$('.distrib_method').each(function(){
					var name = $(this).attr('name');
					if($('input[name="'+name+'"]:checked').length == 1){
						distrib_method.push($(this).val());
					}
				});

				$('#distrib_order li').each(function(){
					if($(this).css('display') != 'none'){
						distrib_order.push($(this).attr('data-id'));
					}
				});

				if($('.distrib_method:checked').length == 0){
					errmsg += c_td.Supportedinvoicedistributionmethods + '<br/>';
				}

				save_data['tab_invoicing'] = {
					enable_kid:(enable_kid)?'y':'n',
					distrib_method:distrib_method,
					distrib_order:distrib_order
				};
			}
			else if(tab == 'tab_accountingscheme'){
				if($('#edit_scheme').bootstrapSwitch('status')){
					$('#accounts_list .account_code').each(function(){

					});
					var acccount_scheme = [];
					var error = 0;
					$('#accounts_list .account_code').each(function(){
						var data_id = $(this).attr('data-id');
						var obj = {
							status:$('.account_status[data-id="'+data_id+'"]:checked').length,
							account_code:$('.account_code[data-id="'+data_id+'"]').val(),
							account_name:$('.account_name[data-id="'+data_id+'"]').val(),
							mva:$('.account_mva[data-id="'+data_id+'"]').val()
						};
						if(checkNull(obj.account_code) == '' || checkNull(obj.account_name) == '' ){
							error = 1
						}
						acccount_scheme.push(obj);
					});
					if(acccount_scheme.length == 0){
						error = 1;
					}
					if(error == 1){
						errmsg += c_td.Accountingscheme + '<br/>';
					}
					save_data['tab_accountingscheme'] = {};
					save_data['tab_accountingscheme']['schemes'] = acccount_scheme;
					save_data['tab_accountingscheme']['status'] = 1;

				}
				else{
					save_data['tab_accountingscheme'] = {};
					save_data['tab_accountingscheme']['schemes'] = [];
					save_data['tab_accountingscheme']['status'] = 0;
				}
			}
			else if(tab == 'tab_info'){

			}


			if(checkNull(errmsg) != ''){
				throw errmsg;
			}

			return true;
		}
		catch(e){
			if(frm != 'status'){
				showAlertMessage(c_td.Pleasecheckthefollowingfields+'<br/>'+e,'error',c_td.Alertmessage);
			}
			return false;
		}

		return true;
	},
	validateEmail:function(value) {
  		var input = document.createElement('input');
		input.type = 'email';
		input.value = value;
		input.required = 'required';

		return typeof input.checkValidity == 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(value);
	},
	checkEIN: function(ein=''){
		var ein = $('#ein').val();
		var total_params = {
			language:language,
			lang:lang,
			ein:ein,
			admin_id:admin_id,
			partner_id:partner_id,
			token:token
    	};
    
    	var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Logins/getBrregLookup.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			br_lu = [];
			hideProcessingImage();
		}
    	params['successCallbackFunction'] = function (complet_data){
    		if(complet_data.response.status == 'success'){
    			if("result" in complet_data.response.response){
	    			$('#company_name').val(checkNull(complet_data.response.response.result.name)).trigger('change');
	    			if(checkNull(complet_data.response.response.result.postal_address) != ''){
	    				$('#address').val(checkNull(complet_data.response.response.result.postal_address)).trigger('change');
	    			}
	    			else{
	    				$('#address').val(checkNull(complet_data.response.response.result.office_address)).trigger('change');
	    			}

	    			if(checkNull(complet_data.response.response.result.postal_zip) != ''){
						$('#zip').val(checkNull(complet_data.response.response.result.postal_zip)).trigger('change');
					}
					else{
						$('#zip').val(checkNull(complet_data.response.response.result.office_zip)).trigger('change');
					}

					if(checkNull(complet_data.response.response.result.postal_city) != ''){
						$('#city').val(checkNull(complet_data.response.response.result.postal_city)).trigger('change');
					}
					else{
						$('#city').val(checkNull(complet_data.response.response.result.office_city)).trigger('change');
					}

					if(checkNull(complet_data.response.response.result.postal_country) != ''){
						$('#country').val($('#country option[data-name="'+complet_data.response.response.result.postal_country+'"]').val()).trigger('change');
					}
					else{
						$('#country').val($('#country option[data-name="'+complet_data.response.response.result.office_country+'"]').val()).trigger('change');
					}

					if(checkNull(complet_data.response.response.result.regimva) == 'J'){
						$('#vat_registered').bootstrapSwitch('setState',true);
					}
					else{
						$('#vat_registered').bootstrapSwitch('setState',false);
					}

					if(checkNull(complet_data.response.response.result.regifr) == 'J'){
						$('#regifr').val('y');
					}
					else{
						$('#regifr').val('n');
					}

					//$('.ein_data_s').show();
				}

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',c_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',c_td.Alertmessage);
					return;
				}	
			}
    	}
    	showProcessingImage('undefined');
    	doAjax(params);
    	return;          
	},
	editFields:function(frm){
		if(frm == 1){
			$('.ein_data_s').hide();
			$('.ein_data').show();
		}
		else{
			$('.ein_data_s').show();
			$('.ein_data').hide();
		}
	},
	addAccountRow:function(){
		line_key++;
		var html = '<tr>';
			html += '<td>';
				html += '<input type="checkbox" checked="checked" class="uni account_status" data-id="'+line_key+'">'
			html += '</td>';
			html += '<td>';
				html += '<input type="text" class="m-wrap span12 account_code" data-id="'+line_key+'" id="account_code_'+line_key+'">'
			html += '</td>';
			html += '<td>';
				html += '<input type="text" class="m-wrap span12 account_name" data-id="'+line_key+'">'
			html += '</td>';
			html += '<td>';
				html += '<input type="text" class="m-wrap span12 account_mva" data-id="'+line_key+'" id="account_mva_'+line_key+'">'
			html += '</td>';
			html += '<td>';
				html += '<button type="button" class="btn mini red-stripe" onclick="checklist.remove(this)"><i class="icon-remove"></i></button>';
			html += '</td>';
		html += '</tr>';
	
		$('tbody#accounts_list').append(html);
		$('tbody#accounts_list .uni').uniform();
		limitBankAccount('account_mva_'+line_key,2);
		limitBankAccount('account_code_'+line_key,20);
		return line_key;
	},
	remove:function(that){
		$(that).parent().parent().remove();
		if($('tbody#accounts_list tr').length == 0){
			checklist.addAccountRow();
		}
	},
	setStatus:function(){
		var ret = 0;
		$('li.act').each(function(){
			var data_tab = $(this).find('a').attr('data-tab');
			if(data_tab == 'tab_info'){
				return true;
			}
			var s = checklist.getTabStatus(data_tab,'status');
			$(this).find('a').find('.status_icon').remove();

			if(s){
				$(this).find('a').append('<i class="status_icon fa fa-check" style="color:green"></i>');
			}
			else{
				ret++;
				$(this).find('a').append('<i class="status_icon icon-remove" style="color:red"></i>');
			}
		});
		if(ret != 0){
			return false;
		}
		return true;
	},
	saveData:function(){
		
		if(!checklist.setStatus()){
			showAlertMessage(c_td.Pleasecorrecttheerrors,'error',c_td.Alertmessage);
			return;
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			login_id:login_id,
		};
		//save_data['tab_company'] = $('#regifr').val();
		total_params = Object.assign(total_params,save_data);
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/savePartnerData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				$('#'+c_popid).modal('hide');
				localStorage.removeItem('showwizard');
				call_toastr('success',c_td.Success,complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',c_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',c_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	bindjs:function(){
		/*
		* International Telephone Input v12.1.8
		* https://github.com/jackocnr/intl-tel-input.git
		* Licensed under the MIT license
		*/

		!function(a){"function"==typeof define&&define.amd?define(["jquery"],function(b){a(b,window,document)}):"object"==typeof module&&module.exports?module.exports=a(require("jquery"),window,document):a(jQuery,window,document)}(function(a,b,c,d){"use strict";function e(b,c){this.a=a(b),this.b=a.extend({},h,c),this.ns="."+f+g++,this.d=Boolean(b.setSelectionRange),this.e=Boolean(a(b).attr("placeholder"))}var f="intlTelInput",g=1,h={allowDropdown:!0,autoHideDialCode:!0,autoPlaceholder:"polite",customPlaceholder:null,dropdownContainer:"",excludeCountries:[],formatOnDisplay:!0,geoIpLookup:null,hiddenInput:"",initialCountry:"",nationalMode:!0,onlyCountries:[],placeholderNumberType:"MOBILE",preferredCountries:["us","gb"],separateDialCode:!1,utilsScript:""},i={b:38,c:40,d:13,e:27,f:43,A:65,Z:90,j:32,k:9},j=["800","822","833","844","855","866","877","880","881","882","883","884","885","886","887","888","889"];a(b).on("load",function(){a.fn[f].windowLoaded=!0}),e.prototype={_a:function(){return this.b.nationalMode&&(this.b.autoHideDialCode=!1),this.b.separateDialCode&&(this.b.autoHideDialCode=this.b.nationalMode=!1),this.g=/Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.g&&(a("body").addClass("iti-mobile"),this.b.dropdownContainer||(this.b.dropdownContainer="body")),this.h=new a.Deferred,this.i=new a.Deferred,this.s={},this._b(),this._f(),this._h(),this._i(),this._i2(),[this.h,this.i]},_b:function(){this._d(),this._d2(),this._e()},_c:function(a,b,c){b in this.q||(this.q[b]=[]);var d=c||0;this.q[b][d]=a},_d:function(){if(this.b.onlyCountries.length){var a=this.b.onlyCountries.map(function(a){return a.toLowerCase()});this.p=k.filter(function(b){return a.indexOf(b.iso2)>-1})}else if(this.b.excludeCountries.length){var b=this.b.excludeCountries.map(function(a){return a.toLowerCase()});this.p=k.filter(function(a){return-1===b.indexOf(a.iso2)})}else this.p=k},_d2:function(){this.q={};for(var a=0;a<this.p.length;a++){var b=this.p[a];if(this._c(b.iso2,b.dialCode,b.priority),b.areaCodes)for(var c=0;c<b.areaCodes.length;c++)this._c(b.iso2,b.dialCode+b.areaCodes[c])}},_e:function(){this.preferredCountries=[];for(var a=0;a<this.b.preferredCountries.length;a++){var b=this.b.preferredCountries[a].toLowerCase(),c=this._y(b,!1,!0);c&&this.preferredCountries.push(c)}},_f:function(){this.a.attr("autocomplete","off");var b="intl-tel-input";this.b.allowDropdown&&(b+=" allow-dropdown"),this.b.separateDialCode&&(b+=" separate-dial-code"),this.a.wrap(a("<div>",{"class":b})),this.k=a("<div>",{"class":"flag-container"}).insertBefore(this.a);var c=a("<div>",{"class":"selected-flag"});c.appendTo(this.k),this.l=a("<div>",{"class":"iti-flag"}).appendTo(c),this.b.separateDialCode&&(this.t=a("<div>",{"class":"selected-dial-code"}).appendTo(c)),this.b.allowDropdown?(c.attr("tabindex","0"),a("<div>",{"class":"iti-arrow"}).appendTo(c),this.m=a("<ul>",{"class":"country-list hide"}),this.preferredCountries.length&&(this._g(this.preferredCountries,"preferred"),a("<li>",{"class":"divider"}).appendTo(this.m)),this._g(this.p,""),this.o=this.m.children(".country"),this.b.dropdownContainer?this.dropdown=a("<div>",{"class":"intl-tel-input iti-container"}).append(this.m):this.m.appendTo(this.k)):this.o=a(),this.b.hiddenInput&&(this.hiddenInput=a("<input>",{type:"hidden",name:this.b.hiddenInput}).insertBefore(this.a))},_g:function(a,b){for(var c="",d=0;d<a.length;d++){var e=a[d];c+="<li class='country "+b+"' data-dial-code='"+e.dialCode+"' data-country-code='"+e.iso2+"'>",c+="<div class='flag-box'><div class='iti-flag "+e.iso2+"'></div></div>",c+="<span class='country-name'>"+e.name+"</span>",c+="<span class='dial-code'>+"+e.dialCode+"</span>",c+="</li>"}this.m.append(c)},_h:function(){var a=this.a.val();this._af(a)&&(!this._isRegionlessNanp(a)||this.b.nationalMode&&!this.b.initialCountry)?this._v(a):"auto"!==this.b.initialCountry&&(this.b.initialCountry?this._z(this.b.initialCountry.toLowerCase()):(this.j=this.preferredCountries.length?this.preferredCountries[0].iso2:this.p[0].iso2,a||this._z(this.j)),a||this.b.nationalMode||this.b.autoHideDialCode||this.b.separateDialCode||this.a.val("+"+this.s.dialCode)),a&&this._u(a)},_i:function(){this._j(),this.b.autoHideDialCode&&this._l(),this.b.allowDropdown&&this._i1(),this.hiddenInput&&this._initHiddenInputListener()},_initHiddenInputListener:function(){var a=this,b=this.a.closest("form");b.length&&b.submit(function(){a.hiddenInput.val(a.getNumber())})},_i1:function(){var a=this,b=this.a.closest("label");b.length&&b.on("click"+this.ns,function(b){a.m.hasClass("hide")?a.a.focus():b.preventDefault()}),this.l.parent().on("click"+this.ns,function(b){!a.m.hasClass("hide")||a.a.prop("disabled")||a.a.prop("readonly")||a._n()}),this.k.on("keydown"+a.ns,function(b){!a.m.hasClass("hide")||b.which!=i.b&&b.which!=i.c&&b.which!=i.j&&b.which!=i.d||(b.preventDefault(),b.stopPropagation(),a._n()),b.which==i.k&&a._ac()})},_i2:function(){var c=this;this.b.utilsScript?a.fn[f].windowLoaded?a.fn[f].loadUtils(this.b.utilsScript,this.i):a(b).on("load",function(){a.fn[f].loadUtils(c.b.utilsScript,c.i)}):this.i.resolve(),"auto"===this.b.initialCountry?this._i3():this.h.resolve()},_i3:function(){a.fn[f].autoCountry?this.handleAutoCountry():a.fn[f].startedLoadingAutoCountry||(a.fn[f].startedLoadingAutoCountry=!0,"function"==typeof this.b.geoIpLookup&&this.b.geoIpLookup(function(b){a.fn[f].autoCountry=b.toLowerCase(),setTimeout(function(){a(".intl-tel-input input").intlTelInput("handleAutoCountry")})}))},_j:function(){var a=this;this.a.on("keyup"+this.ns,function(){a._v(a.a.val())&&a._triggerCountryChange()}),this.a.on("cut"+this.ns+" paste"+this.ns,function(){setTimeout(function(){a._v(a.a.val())&&a._triggerCountryChange()})})},_j2:function(a){var b=this.a.attr("maxlength");return b&&a.length>b?a.substr(0,b):a},_l:function(){var b=this;this.a.on("mousedown"+this.ns,function(a){b.a.is(":focus")||b.a.val()||(a.preventDefault(),b.a.focus())}),this.a.on("focus"+this.ns,function(a){b.a.val()||b.a.prop("readonly")||!b.s.dialCode||(b.a.val("+"+b.s.dialCode),b.a.one("keypress.plus"+b.ns,function(a){a.which==i.f&&b.a.val("")}),setTimeout(function(){var a=b.a[0];if(b.d){var c=b.a.val().length;a.setSelectionRange(c,c)}}))});var c=this.a.prop("form");c&&a(c).on("submit"+this.ns,function(){b._removeEmptyDialCode()}),this.a.on("blur"+this.ns,function(){b._removeEmptyDialCode()})},_removeEmptyDialCode:function(){var a=this.a.val();if("+"==a.charAt(0)){var b=this._m(a);b&&this.s.dialCode!=b||this.a.val("")}this.a.off("keypress.plus"+this.ns)},_m:function(a){return a.replace(/\D/g,"")},_n:function(){this._o();var a=this.m.children(".active");a.length&&(this._x(a),this._ad(a)),this._p(),this.l.children(".iti-arrow").addClass("up"),this.a.trigger("open:countrydropdown")},_o:function(){var c=this;if(this.b.dropdownContainer&&this.dropdown.appendTo(this.b.dropdownContainer),this.n=this.m.removeClass("hide").outerHeight(),!this.g){var d=this.a.offset(),e=d.top,f=a(b).scrollTop(),g=e+this.a.outerHeight()+this.n<f+a(b).height(),h=e-this.n>f;if(this.m.toggleClass("dropup",!g&&h),this.b.dropdownContainer){var i=!g&&h?0:this.a.innerHeight();this.dropdown.css({top:e+i,left:d.left}),a(b).on("scroll"+this.ns,function(){c._ac()})}}},_p:function(){var b=this;this.m.on("mouseover"+this.ns,".country",function(c){b._x(a(this))}),this.m.on("click"+this.ns,".country",function(c){b._ab(a(this))});var d=!0;a("html").on("click"+this.ns,function(a){d||b._ac(),d=!1});var e="",f=null;a(c).on("keydown"+this.ns,function(a){a.preventDefault(),a.which==i.b||a.which==i.c?b._q(a.which):a.which==i.d?b._r():a.which==i.e?b._ac():(a.which>=i.A&&a.which<=i.Z||a.which==i.j)&&(f&&clearTimeout(f),e+=String.fromCharCode(a.which),b._s(e),f=setTimeout(function(){e=""},1e3))})},_q:function(a){var b=this.m.children(".highlight").first(),c=a==i.b?b.prev():b.next();c.length&&(c.hasClass("divider")&&(c=a==i.b?c.prev():c.next()),this._x(c),this._ad(c))},_r:function(){var a=this.m.children(".highlight").first();a.length&&this._ab(a)},_s:function(a){for(var b=0;b<this.p.length;b++)if(this._t(this.p[b].name,a)){var c=this.m.children("[data-country-code="+this.p[b].iso2+"]").not(".preferred");this._x(c),this._ad(c,!0);break}},_t:function(a,b){return a.substr(0,b.length).toUpperCase()==b},_u:function(a){if(this.b.formatOnDisplay&&b.intlTelInputUtils&&this.s){var c=this.b.separateDialCode||!this.b.nationalMode&&"+"==a.charAt(0)?intlTelInputUtils.numberFormat.INTERNATIONAL:intlTelInputUtils.numberFormat.NATIONAL;a=intlTelInputUtils.formatNumber(a,this.s.iso2,c)}a=this._ah(a),this.a.val(a)},_v:function(b){b&&this.b.nationalMode&&"1"==this.s.dialCode&&"+"!=b.charAt(0)&&("1"!=b.charAt(0)&&(b="1"+b),b="+"+b);var c=this._af(b),d=null,e=this._m(b);if(c){var f=this.q[this._m(c)],g=a.inArray(this.s.iso2,f)>-1,h="+1"==c&&e.length>=4;if((!("1"==this.s.dialCode)||!this._isRegionlessNanp(e))&&(!g||h))for(var i=0;i<f.length;i++)if(f[i]){d=f[i];break}}else"+"==b.charAt(0)&&e.length?d="":b&&"+"!=b||(d=this.j);return null!==d&&this._z(d)},_isRegionlessNanp:function(b){var c=this._m(b);if("1"==c.charAt(0)){var d=c.substr(1,3);return a.inArray(d,j)>-1}return!1},_x:function(a){this.o.removeClass("highlight"),a.addClass("highlight")},_y:function(a,b,c){for(var d=b?k:this.p,e=0;e<d.length;e++)if(d[e].iso2==a)return d[e];if(c)return null;throw new Error("No country data for '"+a+"'")},_z:function(a){var b=this.s.iso2?this.s:{};this.s=a?this._y(a,!1,!1):{},this.s.iso2&&(this.j=this.s.iso2),this.l.attr("class","iti-flag "+a);var c=a?this.s.name+": +"+this.s.dialCode:"Unknown";if(this.l.parent().attr("title",c),this.b.separateDialCode){var d=this.s.dialCode?"+"+this.s.dialCode:"",e=this.a.parent();b.dialCode&&e.removeClass("iti-sdc-"+(b.dialCode.length+1)),d&&e.addClass("iti-sdc-"+d.length),this.t.text(d)}return this._aa(),this.o.removeClass("active"),a&&this.o.find(".iti-flag."+a).first().closest(".country").addClass("active"),b.iso2!==a},_aa:function(){var a="aggressive"===this.b.autoPlaceholder||!this.e&&(!0===this.b.autoPlaceholder||"polite"===this.b.autoPlaceholder);if(b.intlTelInputUtils&&a){var c=intlTelInputUtils.numberType[this.b.placeholderNumberType],d=this.s.iso2?intlTelInputUtils.getExampleNumber(this.s.iso2,this.b.nationalMode,c):"";d=this._ah(d),"function"==typeof this.b.customPlaceholder&&(d=this.b.customPlaceholder(d,this.s)),this.a.attr("placeholder",d)}},_ab:function(a){var b=this._z(a.attr("data-country-code"));if(this._ac(),this._ae(a.attr("data-dial-code"),!0),this.a.focus(),this.d){var c=this.a.val().length;this.a[0].setSelectionRange(c,c)}b&&this._triggerCountryChange()},_ac:function(){this.m.addClass("hide"),this.l.children(".iti-arrow").removeClass("up"),a(c).off(this.ns),a("html").off(this.ns),this.m.off(this.ns),this.b.dropdownContainer&&(this.g||a(b).off("scroll"+this.ns),this.dropdown.detach()),this.a.trigger("close:countrydropdown")},_ad:function(a,b){var c=this.m,d=c.height(),e=c.offset().top,f=e+d,g=a.outerHeight(),h=a.offset().top,i=h+g,j=h-e+c.scrollTop(),k=d/2-g/2;if(h<e)b&&(j-=k),c.scrollTop(j);else if(i>f){b&&(j+=k);var l=d-g;c.scrollTop(j-l)}},_ae:function(a,b){var c,d=this.a.val();if(a="+"+a,"+"==d.charAt(0)){var e=this._af(d);c=e?d.replace(e,a):a}else{if(this.b.nationalMode||this.b.separateDialCode)return;if(d)c=a+d;else{if(!b&&this.b.autoHideDialCode)return;c=a}}this.a.val(c)},_af:function(b){var c="";if("+"==b.charAt(0))for(var d="",e=0;e<b.length;e++){var f=b.charAt(e);if(a.isNumeric(f)&&(d+=f,this.q[d]&&(c=b.substr(0,e+1)),4==d.length))break}return c},_ag:function(){var b=a.trim(this.a.val()),c=this.s.dialCode,d=this._m(b),e="1"==d.charAt(0)?d:"1"+d;return(this.b.separateDialCode?"+"+c:"+"!=b.charAt(0)&&"1"!=b.charAt(0)&&c&&"1"==c.charAt(0)&&4==c.length&&c!=e.substr(0,4)?c.substr(1):"")+b},_ah:function(a){if(this.b.separateDialCode){var b=this._af(a);if(b){null!==this.s.areaCodes&&(b="+"+this.s.dialCode);var c=" "===a[b.length]||"-"===a[b.length]?b.length+1:b.length;a=a.substr(c)}}return this._j2(a)},_triggerCountryChange:function(){this.a.trigger("countrychange",this.s)},handleAutoCountry:function(){"auto"===this.b.initialCountry&&(this.j=a.fn[f].autoCountry,this.a.val()||this.setCountry(this.j),this.h.resolve())},handleUtils:function(){b.intlTelInputUtils&&(this.a.val()&&this._u(this.a.val()),this._aa()),this.i.resolve()},destroy:function(){if(this.allowDropdown&&(this._ac(),this.l.parent().off(this.ns),this.a.closest("label").off(this.ns)),this.b.autoHideDialCode){var b=this.a.prop("form");b&&a(b).off(this.ns)}this.a.off(this.ns),this.a.parent().before(this.a).remove()},getExtension:function(){return b.intlTelInputUtils?intlTelInputUtils.getExtension(this._ag(),this.s.iso2):""},getNumber:function(a){return b.intlTelInputUtils?intlTelInputUtils.formatNumber(this._ag(),this.s.iso2,a):""},getNumberType:function(){return b.intlTelInputUtils?intlTelInputUtils.getNumberType(this._ag(),this.s.iso2):-99},getSelectedCountryData:function(){return this.s},getValidationError:function(){return b.intlTelInputUtils?intlTelInputUtils.getValidationError(this._ag(),this.s.iso2):-99},isValidNumber:function(){var c=a.trim(this._ag()),d=this.b.nationalMode?this.s.iso2:"";return b.intlTelInputUtils?intlTelInputUtils.isValidNumber(c,d):null},setCountry:function(a){a=a.toLowerCase(),this.l.hasClass(a)||(this._z(a),this._ae(this.s.dialCode,!1),this._triggerCountryChange())},setNumber:function(a){var b=this._v(a);this._u(a),b&&this._triggerCountryChange()},setPlaceholderNumberType:function(a){this.b.placeholderNumberType=a,this._aa()}},a.fn[f]=function(b){var c=arguments;if(b===d||"object"==typeof b){var g=[];return this.each(function(){if(!a.data(this,"plugin_"+f)){var c=new e(this,b),d=c._a();g.push(d[0]),g.push(d[1]),a.data(this,"plugin_"+f,c)}}),a.when.apply(null,g)}if("string"==typeof b&&"_"!==b[0]){var h;return this.each(function(){var d=a.data(this,"plugin_"+f);d instanceof e&&"function"==typeof d[b]&&(h=d[b].apply(d,Array.prototype.slice.call(c,1))),"destroy"===b&&a.data(this,"plugin_"+f,null)}),h!==d?h:this}},a.fn[f].getCountryData=function(){return k},a.fn[f].loadUtils=function(b,c){a.fn[f].loadedUtilsScript?c&&c.resolve():(a.fn[f].loadedUtilsScript=!0,a.ajax({type:"GET",url:b,complete:function(){a(".intl-tel-input input").intlTelInput("handleUtils")},dataType:"script",cache:!0}))},a.fn[f].defaults=h,a.fn[f].version="12.1.8";for(var k=[["Afghanistan (‫افغانستان‬‎)","af","93"],["Albania (Shqipëri)","al","355"],["Algeria (‫الجزائر‬‎)","dz","213"],["American Samoa","as","1684"],["Andorra","ad","376"],["Angola","ao","244"],["Anguilla","ai","1264"],["Antigua and Barbuda","ag","1268"],["Argentina","ar","54"],["Armenia (Հայաստան)","am","374"],["Aruba","aw","297"],["Australia","au","61",0],["Austria (Österreich)","at","43"],["Azerbaijan (Azərbaycan)","az","994"],["Bahamas","bs","1242"],["Bahrain (‫البحرين‬‎)","bh","973"],["Bangladesh (বাংলাদেশ)","bd","880"],["Barbados","bb","1246"],["Belarus (Беларусь)","by","375"],["Belgium (België)","be","32"],["Belize","bz","501"],["Benin (Bénin)","bj","229"],["Bermuda","bm","1441"],["Bhutan (འབྲུག)","bt","975"],["Bolivia","bo","591"],["Bosnia and Herzegovina (Босна и Херцеговина)","ba","387"],["Botswana","bw","267"],["Brazil (Brasil)","br","55"],["British Indian Ocean Territory","io","246"],["British Virgin Islands","vg","1284"],["Brunei","bn","673"],["Bulgaria (България)","bg","359"],["Burkina Faso","bf","226"],["Burundi (Uburundi)","bi","257"],["Cambodia (កម្ពុជា)","kh","855"],["Cameroon (Cameroun)","cm","237"],["Canada","ca","1",1,["204","226","236","249","250","289","306","343","365","387","403","416","418","431","437","438","450","506","514","519","548","579","581","587","604","613","639","647","672","705","709","742","778","780","782","807","819","825","867","873","902","905"]],["Cape Verde (Kabu Verdi)","cv","238"],["Caribbean Netherlands","bq","599",1],["Cayman Islands","ky","1345"],["Central African Republic (République centrafricaine)","cf","236"],["Chad (Tchad)","td","235"],["Chile","cl","56"],["China (中国)","cn","86"],["Christmas Island","cx","61",2],["Cocos (Keeling) Islands","cc","61",1],["Colombia","co","57"],["Comoros (‫جزر القمر‬‎)","km","269"],["Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)","cd","243"],["Congo (Republic) (Congo-Brazzaville)","cg","242"],["Cook Islands","ck","682"],["Costa Rica","cr","506"],["Côte d’Ivoire","ci","225"],["Croatia (Hrvatska)","hr","385"],["Cuba","cu","53"],["Curaçao","cw","599",0],["Cyprus (Κύπρος)","cy","357"],["Czech Republic (Česká republika)","cz","420"],["Denmark (Danmark)","dk","45"],["Djibouti","dj","253"],["Dominica","dm","1767"],["Dominican Republic (República Dominicana)","do","1",2,["809","829","849"]],["Ecuador","ec","593"],["Egypt (‫مصر‬‎)","eg","20"],["El Salvador","sv","503"],["Equatorial Guinea (Guinea Ecuatorial)","gq","240"],["Eritrea","er","291"],["Estonia (Eesti)","ee","372"],["Ethiopia","et","251"],["Falkland Islands (Islas Malvinas)","fk","500"],["Faroe Islands (Føroyar)","fo","298"],["Fiji","fj","679"],["Finland (Suomi)","fi","358",0],["France","fr","33"],["French Guiana (Guyane française)","gf","594"],["French Polynesia (Polynésie française)","pf","689"],["Gabon","ga","241"],["Gambia","gm","220"],["Georgia (საქართველო)","ge","995"],["Germany (Deutschland)","de","49"],["Ghana (Gaana)","gh","233"],["Gibraltar","gi","350"],["Greece (Ελλάδα)","gr","30"],["Greenland (Kalaallit Nunaat)","gl","299"],["Grenada","gd","1473"],["Guadeloupe","gp","590",0],["Guam","gu","1671"],["Guatemala","gt","502"],["Guernsey","gg","44",1],["Guinea (Guinée)","gn","224"],["Guinea-Bissau (Guiné Bissau)","gw","245"],["Guyana","gy","592"],["Haiti","ht","509"],["Honduras","hn","504"],["Hong Kong (香港)","hk","852"],["Hungary (Magyarország)","hu","36"],["Iceland (Ísland)","is","354"],["India (भारत)","in","91"],["Indonesia","id","62"],["Iran (‫ایران‬‎)","ir","98"],["Iraq (‫العراق‬‎)","iq","964"],["Ireland","ie","353"],["Isle of Man","im","44",2],["Israel (‫ישראל‬‎)","il","972"],["Italy (Italia)","it","39",0],["Jamaica","jm","1876"],["Japan (日本)","jp","81"],["Jersey","je","44",3],["Jordan (‫الأردن‬‎)","jo","962"],["Kazakhstan (Казахстан)","kz","7",1],["Kenya","ke","254"],["Kiribati","ki","686"],["Kosovo","xk","383"],["Kuwait (‫الكويت‬‎)","kw","965"],["Kyrgyzstan (Кыргызстан)","kg","996"],["Laos (ລາວ)","la","856"],["Latvia (Latvija)","lv","371"],["Lebanon (‫لبنان‬‎)","lb","961"],["Lesotho","ls","266"],["Liberia","lr","231"],["Libya (‫ليبيا‬‎)","ly","218"],["Liechtenstein","li","423"],["Lithuania (Lietuva)","lt","370"],["Luxembourg","lu","352"],["Macau (澳門)","mo","853"],["Macedonia (FYROM) (Македонија)","mk","389"],["Madagascar (Madagasikara)","mg","261"],["Malawi","mw","265"],["Malaysia","my","60"],["Maldives","mv","960"],["Mali","ml","223"],["Malta","mt","356"],["Marshall Islands","mh","692"],["Martinique","mq","596"],["Mauritania (‫موريتانيا‬‎)","mr","222"],["Mauritius (Moris)","mu","230"],["Mayotte","yt","262",1],["Mexico (México)","mx","52"],["Micronesia","fm","691"],["Moldova (Republica Moldova)","md","373"],["Monaco","mc","377"],["Mongolia (Монгол)","mn","976"],["Montenegro (Crna Gora)","me","382"],["Montserrat","ms","1664"],["Morocco (‫المغرب‬‎)","ma","212",0],["Mozambique (Moçambique)","mz","258"],["Myanmar (Burma) (မြန်မာ)","mm","95"],["Namibia (Namibië)","na","264"],["Nauru","nr","674"],["Nepal (नेपाल)","np","977"],["Netherlands (Nederland)","nl","31"],["New Caledonia (Nouvelle-Calédonie)","nc","687"],["New Zealand","nz","64"],["Nicaragua","ni","505"],["Niger (Nijar)","ne","227"],["Nigeria","ng","234"],["Niue","nu","683"],["Norfolk Island","nf","672"],["North Korea (조선 민주주의 인민 공화국)","kp","850"],["Northern Mariana Islands","mp","1670"],["Norway (Norge)","no","47",0],["Oman (‫عُمان‬‎)","om","968"],["Pakistan (‫پاکستان‬‎)","pk","92"],["Palau","pw","680"],["Palestine (‫فلسطين‬‎)","ps","970"],["Panama (Panamá)","pa","507"],["Papua New Guinea","pg","675"],["Paraguay","py","595"],["Peru (Perú)","pe","51"],["Philippines","ph","63"],["Poland (Polska)","pl","48"],["Portugal","pt","351"],["Puerto Rico","pr","1",3,["787","939"]],["Qatar (‫قطر‬‎)","qa","974"],["Réunion (La Réunion)","re","262",0],["Romania (România)","ro","40"],["Russia (Россия)","ru","7",0],["Rwanda","rw","250"],["Saint Barthélemy","bl","590",1],["Saint Helena","sh","290"],["Saint Kitts and Nevis","kn","1869"],["Saint Lucia","lc","1758"],["Saint Martin (Saint-Martin (partie française))","mf","590",2],["Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)","pm","508"],["Saint Vincent and the Grenadines","vc","1784"],["Samoa","ws","685"],["San Marino","sm","378"],["São Tomé and Príncipe (São Tomé e Príncipe)","st","239"],["Saudi Arabia (‫المملكة العربية السعودية‬‎)","sa","966"],["Senegal (Sénégal)","sn","221"],["Serbia (Србија)","rs","381"],["Seychelles","sc","248"],["Sierra Leone","sl","232"],["Singapore","sg","65"],["Sint Maarten","sx","1721"],["Slovakia (Slovensko)","sk","421"],["Slovenia (Slovenija)","si","386"],["Solomon Islands","sb","677"],["Somalia (Soomaaliya)","so","252"],["South Africa","za","27"],["South Korea (대한민국)","kr","82"],["South Sudan (‫جنوب السودان‬‎)","ss","211"],["Spain (España)","es","34"],["Sri Lanka (ශ්‍රී ලංකාව)","lk","94"],["Sudan (‫السودان‬‎)","sd","249"],["Suriname","sr","597"],["Svalbard and Jan Mayen","sj","47",1],["Swaziland","sz","268"],["Sweden (Sverige)","se","46"],["Switzerland (Schweiz)","ch","41"],["Syria (‫سوريا‬‎)","sy","963"],["Taiwan (台灣)","tw","886"],["Tajikistan","tj","992"],["Tanzania","tz","255"],["Thailand (ไทย)","th","66"],["Timor-Leste","tl","670"],["Togo","tg","228"],["Tokelau","tk","690"],["Tonga","to","676"],["Trinidad and Tobago","tt","1868"],["Tunisia (‫تونس‬‎)","tn","216"],["Turkey (Türkiye)","tr","90"],["Turkmenistan","tm","993"],["Turks and Caicos Islands","tc","1649"],["Tuvalu","tv","688"],["U.S. Virgin Islands","vi","1340"],["Uganda","ug","256"],["Ukraine (Україна)","ua","380"],["United Arab Emirates (‫الإمارات العربية المتحدة‬‎)","ae","971"],["United Kingdom","gb","44",0],["United States","us","1",0],["Uruguay","uy","598"],["Uzbekistan (Oʻzbekiston)","uz","998"],["Vanuatu","vu","678"],["Vatican City (Città del Vaticano)","va","39",1],["Venezuela","ve","58"],["Vietnam (Việt Nam)","vn","84"],["Wallis and Futuna (Wallis-et-Futuna)","wf","681"],["Western Sahara (‫الصحراء الغربية‬‎)","eh","212",1],["Yemen (‫اليمن‬‎)","ye","967"],["Zambia","zm","260"],["Zimbabwe","zw","263"],["Åland Islands","ax","358",1]],l=0;l<k.length;l++){var m=k[l];k[l]={name:m[0],iso2:m[1],dialCode:m[2],priority:m[3]||0,areaCodes:m[4]||null}}});
	}

}