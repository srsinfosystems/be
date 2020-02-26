var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var global_edit_billing_profile_popupid = 'popups';
var global_edit_billing_profile_count = 0;

var global_edit_billing_profile_metadata;
var global_edit_billing_profile_data;
var global_edit_billing_translationsData;
var edit_billing_profile = {
	start: function(popups,metadata){
		global_edit_billing_profile_metadata=metadata;
		global_edit_billing_profile_popupid = popups;
	
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:global_edit_billing_profile_metadata.id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Edit billing profile','Save','Cancel','Name','Status','Active','Inactive','Select','Please check the following fields','Alert Message','error','Product','Type','Basis','Criteria','Slip','Boat','Length','Width','Static','Invoice','units per','units','Units','Per','edit product','Actions','Delete product','Confirmation','Are you sure you would like to delete this productline','length','width','for line','Billing profile updated successfully','success','Success','Edit','Delete','Edit product','alert message','Bill1','Add product','per'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getBillingProfile.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_edit_billing_profile_data= complet_data.response.response;
				global_edit_billing_translationsData = complet_data.response.response.translationsData;
				edit_billing_profile.createHtml();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_edit_billing_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_edit_billing_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('edit_billing_profile_template').innerHTML;
		var compiledRendered = Template7(template, global_edit_billing_profile_data);
		document.getElementById(global_edit_billing_profile_popupid).innerHTML = compiledRendered;
		resizemodal(global_edit_billing_profile_popupid);
		edit_billing_profile.generateLine();
		edit_billing_profile.bindEvents();
	},
	bindEvents:function(){
		$('#'+global_edit_billing_profile_popupid).resize();

   		$('input[type=radio]').uniform();
   		$("#edit_billing_profile_template_form #status").select2({
   			placeholder: global_edit_billing_translationsData.Select,
			allowClear: true
   		}).change(function(){
   			
   		});

   		$('#edit_billing_profile_btn_new').click(function(){
   			edit_billing_profile.generateEmptyLine();
   		});

   		$('#edit_billing_profile_btn_save').click(function(){
   			edit_billing_profile.saveData();
   		});

   		$('#edit_billing_profile_btn_delete').click(function(){
   			edit_billing_profile.deleteProductLine();
   		});

   		$('.delete_check_all').change(function(){
   			var a = $('.delete_check_all:checked').length;
   			if(a==0){
   				$('#edit_billing_profile_btn_delete').hide();
   				$('#edit_billing_profile_btn_new').show();
   				$('.delete_check').removeAttr('checked');
   			}
   			else{
   				$('.delete_check').prop('checked','checked');
   				$('#edit_billing_profile_btn_delete').show();
   				$('#edit_billing_profile_btn_new').hide();
   			}
   			$.uniform.update();
   		});	
	},
	autoCompleteProductLines:function(){
		var TABKEY = 9;
		var availableTags =  global_edit_billing_profile_data.productData;

		$('#edit_billing_profile_template_form #product_'+global_edit_billing_profile_count).autocomplete({
			minLength: 1,
			source: availableTags,
			select: function( event, data ) {
				
				var line_id = $(this).attr('data-line-id');
				$('#product_id_'+line_id).val(data.item.id);
				$('#product_unit_'+line_id).val(data.item.unit_name);
			}
		});
	},
	saveData:function(){
		var name = $("#edit_billing_profile_template_form #name").val();
		var errmsg = '';
		if(name=='' || name==undefined || name==null){
			errmsg += global_edit_billing_translationsData.Name+'<br/>';
		}

   		var status = $("#edit_billing_profile_template_form #status").val();
   		if(status=='' || status==undefined || status==null){
			errmsg += global_edit_billing_translationsData.Status+'<br/>';
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
					errmsg += global_edit_billing_translationsData.Type+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
				}
				else{
					product_arr[countl].type = type;
					var basis = $('#product_basis_'+line_id).val();
					if(basis==''){
						errmsg += global_edit_billing_translationsData.Basis+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
					}
					else{
						product_arr[countl].basis = basis;
						if(basis=='static'){

							var units = $('#units_'+line_id).val().replace(',','.');
							if(units==''){
								errmsg += global_edit_billing_translationsData.Units+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
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
								errmsg += global_edit_billing_translationsData.Units+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
							}
							else{
								product_arr[countl].units = units;
							}
							if(per==''){
								errmsg += global_edit_billing_translationsData.Per+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
							}
							else{
								product_arr[countl].per = per;
							}
						}
					}
				}
			}
			else{
				errmsg += global_edit_billing_translationsData.Product+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
			}
		});
	
		if(product_arr.length==0){
			errmsg += global_edit_billing_translationsData.Product+'<br/>';
		}

		if(errmsg!=''){
			var finalerrmsg = global_edit_billing_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,global_edit_billing_translationsData.error,global_edit_billing_translationsData.AlertMessage);
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
			id:global_edit_billing_profile_metadata.id,
			product_arr:product_arr
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/saveBillingProfile.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				$('#'+global_edit_billing_profile_popupid).modal('hide');

				edit_billing_profile.addProfileLine(complet_data.response.response,product_arr.length);
				call_toastr(global_edit_billing_translationsData.success, global_edit_billing_translationsData.Success,global_edit_billing_translationsData.Billingprofileupdatedsuccessfully);

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_edit_billing_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_edit_billing_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	deleteProductLine:function(){
		var yes = function(){
			$('.delete_check:checked').each(function(){
				var a = $(this).attr('data-id');
				$('#tr_'+a).remove();
				$('.delete_check_all').trigger('change');
			});
			if($('#edit_billing_profile_product_tbody tr').length==0){
				$('.delete_check_all').removeAttr('checked');
				$.uniform.update();
				edit_billing_profile.generateEmptyLine();

			}
		};
		var no = function(){
		}
		showDeleteMessage(global_edit_billing_translationsData.Areyousureyouwouldliketodeletethisproductline+'?',global_edit_billing_translationsData.Confirmation,yes,no,'ui-dialog-blue',global_edit_billing_translationsData.Delete,global_edit_billing_translationsData.Cancel);
	},
	generateTemplateList:function(data){
		var ret = '';
		ret += '<option value="'+data.id+'">';
			ret += data.name;
		ret += '</option>';
		return ret;
	},
	generateEmptyLine:function(res){
		var line_length = $('#edit_billing_profile_product_tbody tr').length;

		if(line_length==0){
			edit_billing_profile.generateEmptyLineHtml();
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
						errmsg += global_edit_billing_translationsData.Type+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
					}
					else{
						product_arr[countl].type = type;
						var basis = $('#product_basis_'+line_id).val();
						if(basis==''){
							errmsg += global_edit_billing_translationsData.Basis+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
						}
						else{
							product_arr[countl].basis = basis;
							if(basis=='static'){

								var units = $('#units_'+line_id).val().replace(',','.');
								if(units==''){
									errmsg += global_edit_billing_translationsData.Units+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
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
									errmsg += global_edit_billing_translationsData.Units+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
								}
								else{
									product_arr[countl].units = units;
								}
								if(per==''){
									errmsg += global_edit_billing_translationsData.Per+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
								}
								else{
									product_arr[countl].per = per;
								}
							}
						}
					}
				}
				else{
					errmsg += global_edit_billing_translationsData.Product+'&nbsp;'+global_edit_billing_translationsData.forline+'&nbsp;'+count+'<br/>';
				}
			});

			if(errmsg!=''){
				var finalerrmsg = global_edit_billing_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
				showAlertMessage(finalerrmsg,global_edit_billing_translationsData.error,global_edit_billing_translationsData.AlertMessage);
				return;
			}
			else{
				edit_billing_profile.generateEmptyLineHtml();
			}
		}
	},
	generateEmptyLineHtml:function(){
		global_edit_billing_profile_count++;
			var id = global_edit_billing_profile_count;
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
						ret += '<option value="slip">'+global_edit_billing_translationsData.Slip+'</option>';
						ret += '<option value="boat">'+global_edit_billing_translationsData.Boat+'</option>';
					ret += '</select>';
				ret += '</td>';

				ret += '<td>';
					ret += '<select data-line-id="'+id+'" name="product_basis_'+id+'" id="product_basis_'+id+'"  class="product_basis m-wrap span12">';
						ret += '<option value=""></option>';
						ret += '<option value="length">'+global_edit_billing_translationsData.Length+'</option>';
						ret += '<option value="width">'+global_edit_billing_translationsData.Width+'</option>';
						ret += '<option value="static">'+global_edit_billing_translationsData.Static+'</option>';
					ret += '</select>';
				ret += '</td>';

				ret += '<td>';
					ret += '<ul class="criteria_ul criteria_ul_'+id+'" style="display:none">';
						ret += '<li class="criteria_p">'+global_edit_billing_translationsData.Bill1 + '</li>';

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

			
			$("#edit_billing_profile_product_tbody").append(ret);
			$("#product_"+id).focus();
			edit_billing_profile.autoCompleteProductLines();
			edit_billing_profile.bindNew();
	},
	generateLine:function(){
		for(var j in global_edit_billing_profile_data.Billingprofile.PartnerBillingprofilesProduct){
			var a = global_edit_billing_profile_data.Billingprofile.PartnerBillingprofilesProduct[j];
	
			global_edit_billing_profile_count++;
			var id = global_edit_billing_profile_count;
			var ret = '';
			ret += '<tr data-line-id="'+id+'" id="tr_'+id+'">';
				ret += '<td>';
					ret += '<input type="checkbox" class="delete_check" name="delete_check_'+id+'" data-id="'+id+'" >';
				ret += '</td>';

				ret += '<td>';
					var pname = edit_billing_profile.getProductName(a.product_id);
					ret += '<input type="text" data-line-id="'+id+'" name="product_'+id+'" id="product_'+id+'"  class="product_id m-wrap span12" value="'+pname+'">';
					ret += '<input type="hidden" data-line-id="'+id+'" name="product_id_'+id+'" id="product_id_'+id+'" class="product_id_hidden" value="'+a.product_id+'">';
					var pdata = global_edit_billing_profile_data.productData;
					var uname =  global_edit_billing_translationsData.Units;
					for(var j in pdata){
						if(pdata[j].id==a.product_id){
							uname = pdata[j].unit_name;
							break;
						}
					}
					ret += '<input type="hidden" data-line-id="'+id+'" name="product_unit_'+id+'" id="product_unit_'+id+'" value="'+uname+'" class="product_unit_hidden">';
				ret += '</td>';

				ret += '<td>';
					ret += '<select data-line-id="'+id+'" name="product_type_'+id+'" id="product_type_'+id+'"  class="product_type m-wrap span12">';
						ret += '<option value=""></option>';
						if(a.type=='slip'){
							ret += '<option value="slip" selected>'+global_edit_billing_translationsData.Slip+'</option>';
						}
						else{
							ret += '<option value="slip">'+global_edit_billing_translationsData.Slip+'</option>';
						}

						if(a.type=='boat'){
							ret += '<option value="boat" selected>'+global_edit_billing_translationsData.Boat+'</option>';
						}
						else{
							ret += '<option value="boat">'+global_edit_billing_translationsData.Boat+'</option>';
						}
						
					ret += '</select>';
				ret += '</td>';

				ret += '<td>';
					ret += '<select data-line-id="'+id+'" name="product_basis_'+id+'" id="product_basis_'+id+'"  class="product_basis m-wrap span12">';
						ret += '<option value=""></option>';
						if(a.basis=='length'){
							ret += '<option value="length" selected>'+global_edit_billing_translationsData.Length+'</option>';
						}
						else{
							ret += '<option value="length">'+global_edit_billing_translationsData.Length+'</option>';
						}

						if(a.basis=='width'){
							ret += '<option value="width" selected>'+global_edit_billing_translationsData.Width+'</option>';
						}
						else{
							ret += '<option value="width">'+global_edit_billing_translationsData.Width+'</option>';
						}

						if(a.basis=='static'){
							ret += '<option value="static" selected>'+global_edit_billing_translationsData.Static+'</option>';
						}
						else{
							ret += '<option value="static">'+global_edit_billing_translationsData.Static+'</option>';
						}
						
					ret += '</select>';
				ret += '</td>';

				ret += '<td>';

					
					var criteria = JSON.parse(a.criteria);
				
					if(criteria.units==null || criteria.units==undefined){
						criteria.units = 0;
					}
					else{
						if(criteria.units!=''){
							var a = criteria.units.replace('.',',');
						}
						else{
							var a = criteria.units;
						}
						criteria.units = a;
					}

					if(criteria.per==null || criteria.per==undefined){
						criteria.per = 0;
					}
					else{
						if(criteria.per!=''){
							var b = criteria.per.replace('.',',');
						}
						else{
							var b = criteria.per;
						}
						
						criteria.per = b;
					}
					
					ret += '<ul class="criteria_ul criteria_ul_'+id+'"';
						ret += '<li class="criteria_p">'+global_edit_billing_translationsData.Bill1 + '</li>';

						ret += '<li class="criteria_p">';
							ret += '<input type="text" name="" id="units_'+id+'" class="product_lint_text inp" onkeypress="return edit_billing_profile.floatValidationUnit(event,'+id+')" value="'+criteria.units+'">';
						ret += '</li>';

						ret += '<li class="criteria_p unitsper_'+id+'" style=""></li>';

						ret += '<li class="criteria_p unitsperinp_'+id+'" style="">';
							ret += '<input type="text" name="" id="per_'+id+'" class="product_lint_text inp" onkeypress="return edit_billing_profile.floatValidationPer(event,'+id+')" value="'+criteria.per+'">';
						ret += '</li>';

						ret += '<li class="criteria_p unitsperdefaultunit_'+id+'" style=""></li>';
						ret += '<li class="criteria_p unitsperbasis_'+id+'" style=""></li>';
					ret += '</ul>';


				ret += '</td>';
			ret += '</tr>';
			$("#edit_billing_profile_product_tbody").append(ret);
			$("#product_"+id).focus();
			edit_billing_profile.autoCompleteProductLines();
			edit_billing_profile.bindNew();
		}	
	},
	bindNew:function(){
		$('#units_'+global_edit_billing_profile_count+',#per_'+global_edit_billing_profile_count).acceptOnlyFloat();
		$('.delete_check').off();
		$('input[type=checkbox]').uniform();
		$('.delete_check').change(function(){
   			var a = $('.delete_check:checked').length;
   			if(a==0){
   				$('#edit_billing_profile_btn_delete').hide();
   				$('#edit_billing_profile_btn_new').show();
   				$('.delete_check_all').prop('checked',false);
   				$.uniform.update();
   			}
   			else{
   				$('#edit_billing_profile_btn_delete').show();
   				$('#edit_billing_profile_btn_new').hide();
   				$.uniform.update();
   			
   			}
   		});


		$("#product_type_"+global_edit_billing_profile_count).select2({
   			placeholder: global_edit_billing_translationsData.Select,
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

   		$("#product_basis_"+global_edit_billing_profile_count).select2({
   			placeholder: global_edit_billing_translationsData.Select,
			allowClear: true,
			minimumResultsForSearch:-1,
   		}).change(function(){
   			var val = $(this).val();
   			var id = $(this).attr('data-line-id');
   			var type_val = $("#product_type_"+id).val();
   			$('.criteria_ul_'+id).show();
   			if(val=='length'){
   				var unit_name = $('#product_unit_'+id).val();
   				
   				if(unit_name=='' || unit_name==null || unit_name==undefined){
   					unit_name = global_add_billing_translationsData.Units;
   				}
   			
   				$('.unitsper_'+id).html(unit_name+' '+global_edit_billing_translationsData.per+'&nbsp;').show();

   				$('.unitsperinp_'+id).show();
   				if(type_val=='boat'){
   					$('.unitsperdefaultunit_'+id).html(global_edit_billing_profile_data.PartnerSetting.default_dimension_unit+'&nbsp;').show();
   				}
   				else if(type_val=='slip'){
   					$('.unitsperdefaultunit_'+id).html(global_edit_billing_profile_data.PartnerSetting.boat_dimension_unit+'&nbsp;').show();
   				}
   				$('.unitsperbasis_'+id).html(global_edit_billing_translationsData.length+'&nbsp;').show();
   			}
   			else if(val=='width'){
   				var unit_name = $('#product_unit_'+id).val();
   				
   				if(unit_name=='' || unit_name==null || unit_name==undefined){
   					unit_name = global_add_billing_translationsData.Units;
   				}
   			

   				$('.unitsper_'+id).html(unit_name+' '+global_edit_billing_translationsData.per+'&nbsp;').show();

   				$('.unitsperinp_'+id).show();
   				if(type_val=='boat'){
   					$('.unitsperdefaultunit_'+id).html(global_edit_billing_profile_data.PartnerSetting.default_dimension_unit+'&nbsp;').show();
   				}
   				else if(type_val=='slip'){
   					$('.unitsperdefaultunit_'+id).html(global_edit_billing_profile_data.PartnerSetting.boat_dimension_unit+'&nbsp;').show();
   				}
   				$('.unitsperbasis_'+id).html(global_edit_billing_translationsData.width+'&nbsp;').show();
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
	
		if($("#product_type_"+global_edit_billing_profile_count).val()==''){
   			$("#product_basis_"+global_edit_billing_profile_count).select2('enable',false);
   		}
   		$('.delete_check_all').trigger('change');
   		$("#product_type_"+global_edit_billing_profile_count).trigger('change');

   		//global_edit_billing_profile_count
	},
	floatValidationUnit:function(event,id){
		var charCode = (event.which) ? event.which : event.keyCode;
		if (charCode != 44 && charCode > 31 && (charCode < 48 || charCode > 57)) {
		    return false;
		}
		else {
		    //if dot sign entered more than once then don't allow to enter dot sign again. 46 is the code for dot sign
		    var parts = $('#units_'+id).val().split('.');
		    if (parts.length > 1 && charCode == 44)
		      {
		        return false;
		      }
		    return true;

		}
	},
	floatValidationPer:function(event,id){
		var charCode = (event.which) ? event.which : event.keyCode;
		if (charCode != 44 && charCode > 31 && (charCode < 48 || charCode > 57)) {
		    return false;
		}
		else {
		    //if dot sign entered more than once then don't allow to enter dot sign again. 46 is the code for dot sign
		    var parts = $('#per_'+id).val().split('.');
		    if (parts.length > 1 && charCode == 44)
		      {
		        return false;
		      }
		    return true;
		}
	},
	getProductName:function(product_id){
		var pname = ''
		for(var j in global_edit_billing_profile_data.productData){
			var a = global_edit_billing_profile_data.productData[j];
			if(a.id==product_id){
				pname = a.value;
				break; 
			}
		}
		return pname;
	},
	addProfileLine:function(data,product_number){

		var html = '';
		html += '<tr id="billing_profile_'+data.id+'">';
			html += '<td>';
				html += data.name;
			html += '</td>';

			html += '<td>';
				if(data.status==1){
					html += global_edit_billing_translationsData.Active;
				}
				else{
					html += global_edit_billing_translationsData.Inactive;
				}
				
			html += '</td>';

			html += '<td>';
				html += product_number;
			html += '</td>';

			html += '<td>';

				html += '<a class="btn mini blue-stripe" onclick="new_custom_popup(\'800\',\'popups\',\'edit_billing_profile\',{id:'+data.id+'});"><i class="icon-edit"></i>&nbsp;'+global_edit_billing_translationsData.Edit+'</a>&nbsp;';
				html += '<a class="btn mini red-stripe" onclick="deleteBillingProfile('+data.id+');"><i class="icon-remove"></i>&nbsp;'+global_edit_billing_translationsData.Delete+'</a>';
			html += '</td>';
		html += '</tr>';
		$('#billing_profile_tbody #billing_profile_'+data.id).after(html);
		$('#billing_profile_'+data.id)[0].remove();
	}

};