var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partnerCountry = $('#partnerCountry').val();
var brand_id = $('#brand_id').val();
var use_member_centric = $('#use_member_centric').val();

if(use_member_centric == '1' && lang == 'nb'){
	language = 'nor/member';
}
else if(use_member_centric == '1' && lang == 'en'){
	language = 'eng/member';
}

if(tabfunc!=undefined){
	delete tabfunc;

}
var row_count = 1;
var global_translationsData = {};
var tabfunc = {
	start: function(){
		var total_params = {
			APISERVER:APISERVER,
			language:language,
			lang:lang,
			getTranslationsData:'yes',
			getTranslationsDataArray:['step2_title','Next','product_name','units','VAT','standard','Discount','Friend','no_product','add_product'],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getTranslations.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complet_data){

			if(complet_data.response.status == 'success'){
				global_translationsData = complet_data.response.response;

				tabfunc.createHtml();
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
		var template = document.getElementById('checklist_step2_template').innerHTML;
		var compiledRendered = Template7(template,global_translationsData);
		document.getElementById('checklist_content').innerHTML = compiledRendered;
		tabfunc.bindEvents();	
		$('#check_step_1').removeClass('error');
		$('#check_step_1').addClass('done');
		if($('#check_step_2').hasClass('done')){
			$('#check_sidebar #check_step_1,#check_sidebar #check_step_2').removeClass('error');
		}
		else{
			$('#check_step_2').addClass('error');		
		}
		tabfunc.getUnits();
		tabfunc.getProductVat();
		tabfunc.productTable();
	},
	bindEvents:function(){
		//$('input[type=checkbox]').uniform();				
	},
	nextStep: function(){
		
		var product_array = [];
		$('#product_table tbody tr').each(function(){
			var id = $(this).attr('id');
			var product = [];
			$(this).find('td').each (function() {
					var tdvalue = $(this).children().first().val();
					product.push(tdvalue);									
				});
			product_array.push(product);
		});
		console.log(product_array);
		new_main_page('/partner/checklist/step3','','','checklist_step3');
	},
	getUnits : function(){
		var APISERVER = $('#APISERVER').val();
		var partner_id = $('#partner_id').val();
		var admin_id = $('#admin_id').val();
		var total_params = {
			partner_id:partner_id,
			admin_id:admin_id
		};

		$.ajax({
	    type: 'POST',
	    url: APISERVER+'/api/products/getProductUnitList',
	    data: total_params,
	    async: true,
	    dataType : "json",
	    success: function(complet_data,status,xhr){
				if(complet_data.response.status == 'success'){
					 	$.each(complet_data.response.response, function (key, val) {
					        window.select_box += '<option value="'+key+'">'+val+'</option>';
					    });
					    document.getElementById('product_unit_row_0').innerHTML =window.select_box;
					    //$('select').select2();
					    
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error');
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error');
						return;
					}	
				}
	    },
	    error: function(xhr, status, error){
	    	if(xhr.status && xhr.status == 400){
					var obj = jQuery.parseJSON(xhr.responseText);
					showAlertMessage(obj.message,'error');
				}
		  	else{
			  	showAlertMessage("There was a problem accessing the server: " + xhr.statusText +"<br>"+"*Please refresh the page and try again",'error');
		  	}	 
	    },
		});
	},
	getProductVat : function(){
		var APISERVER = $('#APISERVER').val();
		var partner_id = $('#partner_id').val();
		var admin_id = $('#admin_id').val();		
		var total_params = {
			partner_id:partner_id,
			admin_id:admin_id,
			country:partnerCountry,
		};

		$.ajax({
	    type: 'POST',
	    url: APISERVER+'/api/products/getProductPriceGroupVatLevel',
	    data: total_params,
	    async: true,
	    dataType : "json",
	    success: function(complet_data,status,xhr){
				if(complet_data.response.status == 'success'){
					//console.log(complet_data.response.response.vatlevels.tax_levels);
					 	$.each(complet_data.response.response.vatlevels.tax_levels, function (key, val) {
					        window.select_box_vat += '<option value="'+val.value+'">'+val.value+'</option>';
					    });
					    document.getElementById('product_vat_row_0').innerHTML =window.select_box_vat;
					    //$('select').select2();
					    
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error');
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error');
						return;
					}	
				}
	    },
	    error: function(xhr, status, error){
	    	if(xhr.status && xhr.status == 400){
					var obj = jQuery.parseJSON(xhr.responseText);
					showAlertMessage(obj.message,'error');
				}
		  	else{
			  	showAlertMessage("There was a problem accessing the server: " + xhr.statusText +"<br>"+"*Please refresh the page and try again",'error');
		  	}	 
	    },
		});
	},
	productTable : function(){
		$('#product_table').dataTable({
	                "aLengthMenu": [
	                    [5, 15, 20, -1],
	                    [5, 15, 20, "All"] // change per page values here
	                ],
	                // set the initial value
	                "iDisplayLength": 10,
	                "sDom": "",
	                "sPaginationType": "bootstrap",
	                "oLanguage": {
	                    "sLengthMenu": "_MENU_ per page",
	                    "sEmptyTable": '<div class="alert alert-danger">'+global_translationsData.translationsData.no_product+'</div>',
	                    "oPaginate": {
	                        "sPrevious": "",
	                        "sNext": ""
	                    }
	                },
	            });

	            jQuery('#product_table_wrapper .dataTables_filter').hide(); // modify table search input
	            jQuery('#product_table_wrapper .dataTables_length').hide(); // modify table per page dropdown


	            $('#add_product_btn').click(function (e) {
	                e.preventDefault();
	                var select_box_product = '<select name="product_unit[]" class="form-control" id="product_unit_row_'+row_count+'" style="width:105px">';
	                select_box_product += window.select_box;
	                select_box_product += '</select>';
	                var select_box_product_vat = '<select name="product_vat[]" class="form-control" id="product_vat_row_'+row_count+'" style="width:55px">';
	                select_box_product_vat += window.select_box_vat;
	                select_box_product_vat += '</select>';
	               
	                var new_row = '<tr id="row_'+row_count+'">';	
						new_row += '<td style="text-align:center"><input type="text" class="form-control" name="product_name[]" id="product_name_row_'+row_count+'" style="width: 90%;" value=""/></td>';
						new_row += '<td style="text-align:center">'+select_box_product+'</td>';
						new_row += '<td style="text-align:center">'+select_box_product_vat+'</td>';
						new_row += '<td style="text-align:center"><input type="text" class="form-control" name="product_standard_price[]" id="product_standard_price_row_'+row_count+'" style="width: 90%;" value=""/></td>';
						new_row += '<td style="text-align:center"><input type="text" class="form-control" name="product_discount_price[]" id="product_discount_price_row_'+row_count+'" style="width: 90%;" value=""/></td>';
						new_row += '<td style="text-align:center"><input type="text" class="form-control" name="product_friend_price[]" id="product_friend_price_row_'+row_count+'" style="width: 90%;" value=""/></td>';
						new_row += '<td style="text-align:center"><a style="cursor: pointer;" class="btn mini red-stripe" onclick="$(\'#row_'+row_count+'\').remove();"><i class="icon-remove"></i></a></td>';
						new_row += '</tr>';
					//$('#product_table tbody tr.odd').remove();
					$('#product_table tbody').append(new_row);
					//$('select').select2();
					row_count++;
	            });
	},

};



