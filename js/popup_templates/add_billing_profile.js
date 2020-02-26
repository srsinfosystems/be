var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var global_add_billing_profile_popupid = 'popups';
var global_add_billing_profile_count = 0;

var global_add_billing_profile_metadata;
var global_add_billing_profile_data;
var global_add_billing_translationsData;
var add_billing_profile = {
	start: function(popups,metadata){
		global_add_billing_profile_metadata=metadata;
		global_add_billing_profile_popupid = popups;
	
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['New billing profile','Save','Cancel','Name','Status','Active','Inactive','Select','Please check the following fields','Alert Message','error','Product','Type','Basis','Criteria','Slip','Boat','Length','Width','Static','Invoice','units per','units','Units','Per','Add product','Actions','Delete product','Confirmation','Are you sure you would like to delete this productline','length','width','for line','Billing profile created successfully','success','Success','Edit','Delete','alert message','Bill1','per'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getBillingProfile.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_add_billing_profile_data= complet_data.response.response;
				global_add_billing_translationsData = complet_data.response.response.translationsData;
				add_billing_profile.createHtml();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_add_billing_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_add_billing_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('add_billing_profile_template').innerHTML;
		var compiledRendered = Template7(template, global_add_billing_profile_data);
		document.getElementById(global_add_billing_profile_popupid).innerHTML = compiledRendered;
		resizemodal(global_add_billing_profile_popupid);
		add_billing_profile.generateEmptyLine();
		add_billing_profile.bindEvents();
	},
	bindEvents:function(){
		$('#'+global_add_billing_profile_popupid).resize();

   		$('input[type=radio]').uniform();
   		$("#add_billing_profile_template_form #status").select2({
   			placeholder: global_add_billing_translationsData.Select,
			allowClear: true
   		}).change(function(){
   			
   		});

   		$('#add_billing_profile_btn_new').click(function(){
   			add_billing_profile.generateEmptyLine();
   		});

   		$('#add_billing_profile_btn_save').click(function(){
   			add_billing_profile.saveData();
   		});

   		$('#add_billing_profile_btn_delete').click(function(){
   			add_billing_profile.deleteProductLine();
   		});

   		$('.delete_check_all').change(function(){
   			var a = $('.delete_check_all:checked').length;
   			if(a==0){
   				$('#add_billing_profile_btn_delete').hide();
   				$('#add_billing_profile_btn_new').show();
   				$('.delete_check').removeAttr('checked');
   			}
   			else{
   				$('.delete_check').prop('checked','checked');
   				$('#add_billing_profile_btn_delete').show();
   				$('#add_billing_profile_btn_new').hide();
   			}
   			$.uniform.update();
   		});  		
	},
	autoCompleteProductLines:function(){
		var TABKEY = 9;
		var availableTags =  global_add_billing_profile_data.productData;

		$('#add_billing_profile_template_form #product_'+global_add_billing_profile_count).autocomplete({
			minLength: 1,
			source: availableTags,
			select: function( event, data ) {
				console.log(data);
				var line_id = $(this).attr('data-line-id');
				$('#product_id_'+line_id).val(data.item.id).trigger('change');
				$('#product_unit_'+line_id).val(data.item.unit_name);
			}
		});
	},
	saveData:function(){
		var name = $("#add_billing_profile_template_form #name").val();
		var errmsg = '';
		if(name=='' || name==undefined || name==null){
			errmsg += global_add_billing_translationsData.Name+'<br/>';
		}

   		var status = $("#add_billing_profile_template_form #status").val();
   		if(status=='' || status==undefined || status==null){
			errmsg += global_add_billing_translationsData.Status+'<br/>';
		}

		var product_arr = [];
		var count = 0;
		var countl = -1;
		$('.product_id_hidden').each(function(){
			count++;
			countl++;
			product_arr[countl] = {};
			
			var product_id = $(this).val();
			var line_id = $(this).attr('data-line-id');
			var type = $('#product_type_'+line_id).val();
			if(product_id!=''){
				product_arr[countl].product_id = product_id;
				if(type==''){
					errmsg += global_add_billing_translationsData.Type+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
				}
				else{
					product_arr[countl].type = type;
					var basis = $('#product_basis_'+line_id).val();
					if(basis==''){
						errmsg += global_add_billing_translationsData.Basis+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
					}
					else{
						product_arr[countl].basis = basis;
						if(basis=='static'){

							var units = $('#units_'+line_id).val().replace(',','.');
							if(units==''){
								errmsg += global_add_billing_translationsData.Units+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
							}
							else{
								product_arr[countl].units = units;
								product_arr[countl].per = per;
							}
						}
						else{
							var units = $('#units_'+line_id).val().replace(',','.');
							var per = $('#per_'+line_id).val().replace(',','.');
							if(units==''){
								errmsg += global_add_billing_translationsData.Units+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
							}
							else{
								product_arr[countl].units = units;
							}
							if(per==''){
								errmsg += global_add_billing_translationsData.Per+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
							}
							else{
								product_arr[countl].per = per;
							}
						}
					}
				}
			}
			else{
				errmsg += global_add_billing_translationsData.Product+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
			}
			console.log(product_arr);
			console.log(product_id); 
		});
	
		if(product_arr.length==0){
			errmsg += global_add_billing_translationsData.Product+'<br/>';
		}

		if(errmsg!=''){
			var finalerrmsg = global_add_billing_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,global_add_billing_translationsData.error,global_add_billing_translationsData.AlertMessage);
			return;
		}

		showProcessingImage('undefined');
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			name:name,
			status:status,
			product_arr:product_arr,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/saveBillingProfile.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				$('#'+global_add_billing_profile_popupid).modal('hide');
				add_billing_profile.addProfileLine(complet_data.response.response,product_arr.length);
				call_toastr(global_add_billing_translationsData.success, global_add_billing_translationsData.Success,global_add_billing_translationsData.Billingprofilecreatedsuccessfully);

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_add_billing_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_add_billing_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	deleteProductLine:function(){
		console.log('easas');
		var yes = function(){
			$('.delete_check:checked').each(function(){
				var a = $(this).attr('data-id');
				$('#tr_'+a).remove();
				$('.delete_check_all').trigger('change');
			});
			if($('#add_billing_profile_product_tbody tr').length==0){
				$('.delete_check_all').removeAttr('checked');
				$.uniform.update();
				add_billing_profile.generateEmptyLine();

			}
		};
		var no = function(){
		}
		showDeleteMessage(global_add_billing_translationsData.Areyousureyouwouldliketodeletethisproductline+'?',global_add_billing_translationsData.Confirmation,yes,no,'ui-dialog-blue',global_add_billing_translationsData.Delete,global_add_billing_translationsData.Cancel);
	},
	generateTemplateList:function(data){
		var ret = '';
		ret += '<option value="'+data.id+'">';
			ret += data.name;
		ret += '</option>';
		return ret;
	},
	generateEmptyLine:function(res){
		var line_length = $('#add_billing_profile_product_tbody tr').length;

		if(line_length==0){
			add_billing_profile.generateEmptyLineHtml();
		}
		else{
			var count = 0;
			var countl = -1;
			var product_arr = [];
			var errmsg = '';
			$('.product_id_hidden').each(function(){
				count++;
				countl++;
				product_arr[countl] = {};
				
				var product_id = $(this).val();
				var line_id = $(this).attr('data-line-id');
				var type = $('#product_type_'+line_id).val();
				if(product_id!=''){
					product_arr[countl].product_id = product_id;
					if(type==''){
						errmsg += global_add_billing_translationsData.Type+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
					}
					else{
						product_arr[countl].type = type;
						var basis = $('#product_basis_'+line_id).val();
						if(basis==''){
							errmsg += global_add_billing_translationsData.Basis+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
						}
						else{
							product_arr[countl].basis = basis;
							if(basis=='static'){

								var units = $('#units_'+line_id).val().replace(',','.');
								if(units==''){
									errmsg += global_add_billing_translationsData.Units+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
								}
								else{
									product_arr[countl].units = units;
									product_arr[countl].per = per;
								}
							}
							else{
								var units = $('#units_'+line_id).val().replace(',','.');
								var per = $('#per_'+line_id).val().replace(',','.');
								if(units==''){
									errmsg += global_add_billing_translationsData.Units+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
								}
								else{
									product_arr[countl].units = units;
								}
								if(per==''){
									errmsg += global_add_billing_translationsData.Per+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
								}
								else{
									product_arr[countl].per = per;
								}
							}
						}
					}
				}
				else{
					errmsg += global_add_billing_translationsData.Product+'&nbsp;'+global_add_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
				}
			});

			if(errmsg!=''){
				var finalerrmsg = global_add_billing_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
				showAlertMessage(finalerrmsg,global_add_billing_translationsData.error,global_add_billing_translationsData.AlertMessage);
				return;
			}
			else{
				add_billing_profile.generateEmptyLineHtml();
			}
		}
	},
	generateEmptyLineHtml:function(){
		global_add_billing_profile_count++;
			var id = global_add_billing_profile_count;
			var ret = '';
			ret += '<tr data-line-id="'+id+'" id="tr_'+id+'">';
				ret += '<td>';
					ret += '<input type="checkbox" class="delete_check" name="delete_check_'+id+'" data-id="'+id+'" >';
				ret += '</td>';

				ret += '<td>';
					ret += '<input type="text" data-line-id="'+id+'" name="product_'+id+'" id="product_'+id+'"  class="product_id m-wrap span12">';
					ret += '<input type="hidden" data-line-id="'+id+'" name="product_id_'+id+'" id="product_id_'+id+'" class="product_id_hidden">';
					ret += '<input type="hidden" data-line-id="'+id+'" name="product_unit_'+id+'" id="product_unit_'+id+'" class="product_unit_hidden">';
				ret += '</td>';
				

				ret += '<td>';
					ret += '<select data-line-id="'+id+'" name="product_type_'+id+'" id="product_type_'+id+'"  class="product_type m-wrap span12">';
						ret += '<option value=""></option>';
						ret += '<option value="slip">'+global_add_billing_translationsData.Slip+'</option>';
						ret += '<option value="boat">'+global_add_billing_translationsData.Boat+'</option>';
					ret += '</select>';
				ret += '</td>';

				ret += '<td>';
					ret += '<select data-line-id="'+id+'" name="product_basis_'+id+'" id="product_basis_'+id+'"  class="product_basis m-wrap span12">';
						ret += '<option value=""></option>';
						ret += '<option value="length">'+global_add_billing_translationsData.Length+'</option>';
						ret += '<option value="width">'+global_add_billing_translationsData.Width+'</option>';
						ret += '<option value="static">'+global_add_billing_translationsData.Static+'</option>';
					ret += '</select>';
				ret += '</td>';

				ret += '<td>';
					ret += '<ul class="criteria_ul criteria_ul_'+id+'" style="display:none">';
						ret += '<li class="criteria_p">'+global_add_billing_translationsData.Bill1 + '</li>';

						ret += '<li class="criteria_p">';
							ret += '<input type="text" name="" id="units_'+id+'" class="product_lint_text inp">';
						ret += '</li>';

						ret += '<li class="criteria_p unitsper_'+id+'" style="display:none"></li>';

						ret += '<li class="criteria_p unitsperinp_'+id+'" style="display:none">';
							ret += '<input type="text" name="" id="per_'+id+'" class="product_lint_text inp"  >'
						ret += '</li>';

						ret += '<li class="criteria_p unitsperdefaultunit_'+id+'" style="display:none"></li>';
						ret += '<li class="criteria_p unitsperbasis_'+id+'" style="display:none"></li>';
						ret += '</ul>';
				ret += '</td>';
			ret += '</tr>';

			
			$("#add_billing_profile_product_tbody").append(ret);
			$("#product_"+id).focus();
			add_billing_profile.autoCompleteProductLines();
			add_billing_profile.bindNew();
	},
	bindNew:function(){
		$('#units_'+global_add_billing_profile_count+',#per_'+global_add_billing_profile_count).acceptOnlyFloat();
		$('.delete_check').off();
		$('input[type=checkbox]').uniform();

		$('#product_id_'+global_add_billing_profile_count).change(function(){
			var val = $(this).val();
			var id = $(this).attr('data-line-id');
			if(val==''){
   				$("#product_type_"+id).val('').trigger('change').select2('enable',false);
   			}
   			else{
   				$("#product_type_"+id).trigger('change').select2('enable',true);
   			}
		});

		$('#product_'+global_add_billing_profile_count).keyup(function(){
			var val = $(this).val();
			console.log('val');
			console.log(val);
			var id = $(this).attr('data-line-id');
			if(val==''){
   				$("#product_id_"+id).val('').trigger('change');
   			}
		});

		
	
		$('.delete_check').change(function(){
   			var a = $('.delete_check:checked').length;
   			if(a==0){
   				$('#add_billing_profile_btn_delete').hide();
   				$('#add_billing_profile_btn_new').show();
   				$('.delete_check_all').prop('checked',false);
   				$.uniform.update();
   			}
   			else{
   				$('#add_billing_profile_btn_delete').show();
   				$('#add_billing_profile_btn_new').hide();
   				$.uniform.update();
   			
   			}
   		});


		$("#product_type_"+global_add_billing_profile_count).select2({
   			placeholder: global_add_billing_translationsData.Select,
			allowClear: true,
			minimumResultsForSearch:-1,
   		}).change(function(){
   			var val = $(this).val();
   			var id = $(this).attr('data-line-id');
   			if(val==''){
   				$("#product_basis_"+id).val('').trigger('change').select2('enable',false);
   			}
   			else{
   				$("#product_basis_"+id).trigger('change').select2('enable',true);
   			}
   		});

   		$("#product_basis_"+global_add_billing_profile_count).select2({
   			placeholder: global_add_billing_translationsData.Select,
			allowClear: true,
			minimumResultsForSearch:-1,
   		}).change(function(){
   			var val = $(this).val();
   			var id = $(this).attr('data-line-id');
   			var type_val = $("#product_type_"+id).val();
   			$('.criteria_ul_'+id).show();
   			if(val=='length'){
   				var unit_name = $('#product_unit_'+id).val();
   				console.log(unit_name+'unit_name');
   				if(unit_name=='' || unit_name==null || unit_name==undefined){
   					unit_name = global_add_billing_translationsData.Units;
   				}
   				console.log(unit_name+'unit_name');
   				$('.unitsper_'+id).html(unit_name+' '+global_add_billing_translationsData.per+'&nbsp;').show();
   				$('.unitsperinp_'+id).show();
   				if(type_val=='boat'){
   					$('.unitsperdefaultunit_'+id).html(global_add_billing_profile_data.PartnerSetting.default_dimension_unit+'&nbsp;').show();
   				}
   				else if(type_val=='slip'){
   					$('.unitsperdefaultunit_'+id).html(global_add_billing_profile_data.PartnerSetting.boat_dimension_unit+'&nbsp;').show();
   				}
   				$('.unitsperbasis_'+id).html(global_add_billing_translationsData.length+'&nbsp;').show();
   			}
   			else if(val=='width'){
   				var unit_name = $('#product_unit_'+id).val();
   				
   				if(unit_name=='' || unit_name==null || unit_name==undefined){
   					unit_name = global_add_billing_translationsData.Units;
   				}
   			

   				$('.unitsper_'+id).html(unit_name+' '+global_add_billing_translationsData.per+'&nbsp;').show();
   				$('.unitsperinp_'+id).show();
   				if(type_val=='boat'){
   					$('.unitsperdefaultunit_'+id).html(global_add_billing_profile_data.PartnerSetting.default_dimension_unit+'&nbsp;').show();
   				}
   				else if(type_val=='slip'){
   					$('.unitsperdefaultunit_'+id).html(global_add_billing_profile_data.PartnerSetting.boat_dimension_unit+'&nbsp;').show();
   				}
   				$('.unitsperbasis_'+id).html(global_add_billing_translationsData.width+'&nbsp;').show();
   			}
   			else if(val=='static'){
   				var unit_name = $('#product_unit_'+id).val();
   				
   				if(unit_name=='' || unit_name==null || unit_name==undefined){
   					unit_name = global_add_billing_translationsData.Units;
   				}
   				$('.unitsper_'+id).html(unit_name+'&nbsp;').show();
   				$('.unitsperinp_'+id).hide();
   				$('.unitsperdefaultunit_'+id).html('').hide();
   				$('.unitsperbasis_'+id).html('').hide();


   			}
   			else{
   				$('.criteria_ul_'+id).hide();
   			
   			}
   		});

		if($("#product_type_"+global_add_billing_profile_count).val()==''){
   			$("#product_basis_"+global_add_billing_profile_count).select2('enable',false);
   		}

   		if($("#product_id_"+global_add_billing_profile_count).val()==''){
   			$("#product_type_"+global_add_billing_profile_count).select2('enable',false);
   		}

   		$('.delete_check_all').trigger('change');

   		//global_add_billing_profile_count
	},
	addProfileLine:function(data,product_number){
		console.log(data);
		var html = '';
		html += '<tr id="billing_profile_'+data.id+'">';
			html += '<td>';
				html += data.name;
			html += '</td>';

			html += '<td>';
				if(data.status==1){
					html += global_add_billing_translationsData.Active;
				}
				else{
					html += global_add_billing_translationsData.Inactive;
				}
				
			html += '</td>';

			html += '<td>';
				html += product_number;
			html += '</td>';

			html += '<td>';
				html += '<a class="btn mini blue-stripe" onclick="new_custom_popup(\'800\',\'popups\',\'edit_billing_profile\',{id:'+data.id+'});"><i class="icon-edit"></i>&nbsp;'+global_add_billing_translationsData.Edit+'</a>&nbsp;';
				html += '<a class="btn mini red-stripe" onclick="deleteBillingProfile('+data.id+');"><i class="icon-remove"></i>&nbsp;'+global_add_billing_translationsData.Delete+'</a>';
			html += '</td>';
		html += '</tr>';
		$('#billing_profile_empty_tr').remove();
		$('#billing_profile_tbody').append(html);
	}


};
