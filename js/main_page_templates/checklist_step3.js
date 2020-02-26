var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();

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
			getTranslationsDataArray:['step3_title','first_name','last_name','date_of_birth','cust_cellphone','customer_email','select','cust_cellphone','customer_name','type','Consumer','Business','add_new_customer','Finish','no_customer','EIN'],
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
		var template = document.getElementById('checklist_step3_template').innerHTML;
		var compiledRendered = Template7(template,global_translationsData);
		document.getElementById('checklist_content').innerHTML = compiledRendered;
		tabfunc.bindEvents();	
		$('#check_step_1,#check_step_2').removeClass('error');
		$('#check_step_1,#check_step_2').addClass('done');
		if($('#check_step_3').hasClass('done')){
			$('#check_sidebar #check_step_1,#check_sidebar #check_step_2,#check_sidebar #check_step_3').removeClass('error');
		}
		else{
			$('#check_step_3').addClass('error');		
		}	
		tabfunc.customerTable();
		$(".cust_dob").inputmask("99.99.99", {autoUnmask: false});
		/*$(".cellphone").intlTelInput({
		initialCountry: "auto",
		  geoIpLookup: function(callback) {
		    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
		      var countryCode = (resp && resp.country) ? resp.country : "";
		      callback(countryCode);		      
		    });
		  },
		 });*/
		 var id=".cellphone";
		limitNumbers(id,8);

		
	},
	bindEvents:function(){
		//$('input[type=checkbox]').uniform();		
	},
	nextStep: function(step){
		var cust_array = [];
		$('#customer_table tbody tr').each(function(){
			var id = $(this).attr('id');
			var customer = [];
			$(this).find('td').each (function() {
					var tdvalue = $(this).children().first().val();
					customer.push(tdvalue);									
				});
			cust_array.push(customer);
		});
		console.log(cust_array);
	},
	customerTable : function(){
		$('#customer_table').dataTable({
	                /*"aLengthMenu": [
	                    [5, 15, 20, -1],
	                    [5, 15, 20, "All"] // change per page values here
	                ],*/
	                // set the initial value
	                "iDisplayLength": 10,
	                "sDom": "",
	                "sPaginationType": "bootstrap",
	                "oLanguage": {
	                    "sLengthMenu": "_MENU_ per page",
	                    "sEmptyTable": '<div class="alert alert-danger">'+global_translationsData.translationsData.no_customer+'</div>',
	                    "oPaginate": {
	                        "sPrevious": "",
	                        "sNext": ""
	                    }
	                },
	            });

	            jQuery('#customer_table_wrapper .dataTables_filter').hide(); // modify table search input
	            jQuery('#customer_table_wrapper .dataTables_length').hide(); // modify table per page dropdown


	            $('#add_customer_btn').click(function (e) {
	                e.preventDefault();
	                var onchangeval ="type_change(this,'cust_dob_row_"+row_count+"','cust_ein_row_"+row_count+"');";
	                var select_box_cust_type = '<select name="cust_type[]" onchange="'+onchangeval+'" class="form-control" id="cust_type_row_'+row_count+'" style="width:125px">';
	                select_box_cust_type += '<option value="consumer">'+global_translationsData.translationsData.Consumer+'</option>';
	                select_box_cust_type += '<option value="business">'+global_translationsData.translationsData.Business+'</option>';
	                select_box_cust_type += '</select>';	                
	               
	                var new_row = '<tr id="row_'+row_count+'">';
	                	new_row += '<td style="text-align:center">'+select_box_cust_type+'</td>';	
	                	new_row +='<td style="text-align:center" class="cust_dob_td"><input type="text" class="form-control cust_dob" name="cust_dob[]" id="cust_dob_row_'+row_count+'" style="width: 90%;" value="" placeholder="(dd.mm.yy)" required="" /><input type="text" class="form-control hide" name="cust_ein[]" id="cust_ein_row_'+row_count+'" style="width: 90%;" value="" required="" /></td>';
						new_row += '<td style="text-align:center"><input type="text" class="form-control" name="cust_first_name[]" id="cust_first_name_row_'+row_count+'" style="width: 90%;" value=""/></td>';						
						new_row += '<td style="text-align:center"><input type="text" class="form-control" name="cust_last_name[]" id="cust_last_name_row_'+row_count+'" style="width: 90%;" value=""/></td>';
						new_row += '<td style="text-align:center"><input type="text" class="form-control" name="cust_name[]" id="cust_name_row_'+row_count+'" style="width: 90%;" value=""/></td>';
						new_row += '<td style="text-align:center"><input type="text" class="form-control cellphone" name="cust_cellphone[]" id="cust_cellphone_row_'+row_count+'" style="width: 90%;" value=""/></td>';
						new_row += '<td style="text-align:center"><input type="text" class="form-control" name="cust_email[]" id="cust_email_row_'+row_count+'" style="width: 90%;" value=""/></td>';
						new_row += '<td style="text-align:center"><a style="cursor: pointer;" class="btn mini red-stripe" onclick="$(\'#row_'+row_count+'\').remove();"><i class="icon-remove"></i></a></td>';
						new_row += '</tr>';
					//$('#product_table tbody tr.odd').remove();
					$('#customer_table tbody').append(new_row);
					//$('select').select2();
					$(".cust_dob").inputmask("99.99.99", {autoUnmask: false});
					row_count++;
	            });
	},
	
};

function limitNumbers(id,limit) {
	
	$(id).inputmask({ "mask": "9", "repeat": limit,"greedy": false});

}

function type_change(obj,dobid,einid)
{
	var selected_val = obj.value;
			if(selected_val == 'business'){
				$('#'+einid).removeClass('hide');
				$('#'+einid).show();
				$('#'+dobid).addClass('hide');
				$('#'+dobid).hide();
			}
			else{
				$('#'+einid).addClass('hide');
				$('#'+einid).hide();
				$('#'+dobid).removeClass('hide');
				$('#'+dobid).show();
			}
}