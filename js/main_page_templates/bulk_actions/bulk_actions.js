var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var type =  $('#type').val();

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
if(date_format_partner==''){
	date_format_partner = date_format;
}

var table;
var ba_dt;
var ba_td;

var customer_custom_groups = [];
var customer_groups = [];
var customer_docks = [];
var customer_queries = [];

var nor = {};
if(lang=='nb'){
	nor = {
	    "sEmptyTable": "Inga data tilgjengeleg i tabellen",
	    "sInfo": "Syner _START_ til _END_ av _TOTAL_ linjer",
	    "sInfoEmpty": "Syner 0 til 0 av 0 linjer",
	    "sInfoFiltered": "(filtrert frå _MAX_ totalt antal linjer)",
	    "sInfoPostFix": "",
	    "sInfoThousands": " ",
	    "sLoadingRecords": "Lastar...",
	    "sLengthMenu": "Syn _MENU_ linjer",
	    "sLoadingRecords": "Lastar...",
	    "sProcessing": "Lastar...",
	    "sSearch": "S&oslash;k:",
	    "sUrl": "",
	    "sZeroRecords": "Inga linjer treff p&aring; s&oslash;ket",
	    "oPaginate": {
	        "sFirst": "Fyrste",
	        "sPrevious": "Forrige",
	        "sNext": "Neste",
	        "sLast": "Siste"
	    },
	    "oAria": {
	        "sSortAscending": ": aktiver for å sortere kolonna stigande",
	        "sSortDescending": ": aktiver for å sortere kolonna synkande"
	    }
	};
}

var x = {
  aInternal: 0,
  aListener: function(val) {},
  set a(val) {
    this.aInternal = val;
    this.aListener(val);
  },
  get a() {
    return this.aInternal;
  },
  registerListener: function(listener) {
    this.aListener = listener;
  }
}

var bulk_actions = {
	start:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:[
				'Dashboard','alert message','Success','Bulk actions','Step','of','Custom lists','Queries','Customer','Docks','Customer groups','Select','Add group','Select recipients','Select distribution properties','Compose message','Summary','Customer groups','Custom groups','Edit','Group name','Customers','Action','Save','Search customer','Customer name','Customer number','Next','Previous','Add group','No group found','$customer_group_err','$custom_group_err','Continue','Next','Please select custom group','Please select group with customer','Back','Delete','Name','Type','Action','De select','Create query','Select options','Run query','Continue','Continue1','Please select query','Save Query',
				'Save as','A query','A custom list','Empty query','Type','Select','$qry_del','Warning','Delete','Success','No record found','De select','Create query','Cancel',

				'Haul boats out of water now','Place boats back on water now','Apply for boat storage','Apply for being placed on water','Save and continue','$customerh','$more_than_boat','Is this action billable','Yes','No','Update','$up_msg','$out_msg','$up_msg_s','$out_msg_s','$omit_msg','Boat already on land','Boat already on water','$customerhandname','Reason','Start again','Start date and time','End date and time','Apply','Preferred','Boat events',
				'Select at least one event',

				'$add_rule','$delete_rule','$AND','$OR','$equal','$not_equal','$in','$not_in','$less','$less_or_equal','$greater','$greater_or_equal','$begins_with','$not_begins_with','$contains','$not_contains','$ends_with','$not_ends_with','$is_empty','$is_not_empty',
				'$dateoclock',
				'$up_msg_a','$up_msg_as','$out_msg_a','$out_msg_as'

			],

		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/bulk_actions.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ba_dt = complet_data.response.response;
				ba_td = complet_data.response.response.translationsData;
				x.a++;		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		x.registerListener(function(val) {
		  if(x.a == 2){
		  	x.a = 0;
		  	bulk_actions.createHtml(ba_dt);
		  }	
		});
		doAjax(params);

		var scripts = [
			host_url+'app/webroot/js/bulk_actions.js',
		];
		var queue = scripts.map(function(script) {
		    return $.getScript(script);
		});

		$.when.apply(null, queue).done(function() {
			x.a++;
		});
		return;
	},
	createHtml:function(){
		ba_td.dashboardurl = base_url+'dashboard/index';
		ba_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('bulk_actions_template').innerHTML;
		var compiledRendered = Template7(template, ba_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		bulk_actions.bindEvents();
	},
	bindEvents:function(){
		
		$('#button-again').click(function(){
			bulk_actions.start();
		});
		bulk_actions.bindQuery();

		w = $('#form_wizard_1').bootstrapWizard({
		 	'nextSelector': '.button-next',
            'previousSelector': '.button-previous',
            onTabClick: function (tab, navigation, index) {
                //alert('on tab click disabled');
                return false;
            },
            beforeNext: function (tab, navigation, index) {
            	var current = index + 1;

            	if(index==1){
        		 	if($('#masscust').val()=='custom_groups'){
	            		if(customer_custom_groups.length==0){
		            		showAlertMessage(ba_td.Pleaseselectcustomgroup,'error',ba_td.alertmessage);
		            		return false;
		            	}
	            	}
	            	else if($('#masscust').val()=='customer_groups'){
		            	if(customer_groups.length==0){
		            		showAlertMessage(ba_td.Pleaseselectgroupwithcustomer,'error',ba_td.alertmessage);
		            		return false;
		            	}
		            	else{
		            		var cust_exists = 0;
		            		
		            		for(var j in customer_groups){
		            			var grp_id = customer_groups[j].group_id;
		            			var orig_cust = $('#orignoOfCust_'+grp_id).html();
		            			orig_cust = parseInt(orig_cust);
		            			if(customer_groups[j].customers.length==0 && customer_groups[j].customers.length!=orig_cust){
		            				cust_exists = 1;
		            				break;
		            			}
		            			if(customer_groups[j].customers.length!=0 && customer_groups[j].customers.length!=orig_cust){
		            				cust_exists = 1;
		            				break;
		            			}
		            		}
		            		if(cust_exists==0){
		            			showAlertMessage(ba_td.Pleaseselectgroupwithcustomer,'error',ba_td.alertmessage);
		            			return false;
		            		}
		            	}
	            	}
	            	else if($('#masscust').val()=='queries'){
	            		if(customer_queries.length==0){
		            		showAlertMessage(ba_td.Pleaseselectquery,'error',ba_td.alertmessage);
		            		return false;
		            	}
	            	}

	            	bulk_actions.getBoatsCount();
	            	
                	
            	}
            	else if(index==3){
	            	
                	
	            }

            	return true;
            },
            onNext: function (tab, navigation, index) {

            	var total = navigation.find('li').length;
                var current = index + 1;
                $("#wizard_steps").val(current);
                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }
               

              	if(current == 1){
              		$('#form_wizard_1').find('.button-next').show();
              		$('#form_wizard_1').find('.button-previous').hide();
              		$('#form_wizard_1').find('.button-send').hide();
              	}
              	else if(current == 2){
              		$('#form_wizard_1').find('.button-next').hide();
              		$('#form_wizard_1').find('.button-previous').show();
              		$('#form_wizard_1').find('.button-send').show();
              	}
              	else if(current == 3){
              		$('#form_wizard_1').find('.button-next').hide();
              		$('#form_wizard_1').find('.button-previous').hide();
              		$('#form_wizard_1').find('.button-send').hide();
              		
              	}
             	
         	 	if(current == 1 ){
                	bulk_actions.checkNextButton();
                }
                else{
                	$('.save_and_continue').hide();
                }
            },
            onPrevious: function (tab, navigation, index) {
            	var total = navigation.find('li').length;
                var current = index + 1;
                $("#wizard_steps").val(current);
                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }

                
              	if(current == 1){
              		$('#form_wizard_1').find('.button-next').show();
              		$('#form_wizard_1').find('.button-previous').hide();
              		$('#form_wizard_1').find('.button-send').hide();
              	}
              	else if(current == 2){
              		$('#form_wizard_1').find('.button-next').show();
              		$('#form_wizard_1').find('.button-previous').show();
              		$('#form_wizard_1').find('.button-send').hide();
              	}
              	else if(current == 3){
              		$('#form_wizard_1').find('.button-next').hide();
              		$('#form_wizard_1').find('.button-previous').show();
              		$('#form_wizard_1').find('.button-send').show();
              	}
              	else if(current == 4){
              		$('#form_wizard_1').find('.button-next').hide();
              		$('#form_wizard_1').find('.button-previous').hide();
              		$('#form_wizard_1').find('.button-send').hide();
              	}
              	if(current == 1 ){
                	bulk_actions.checkNextButton();
                }
                else{
                	$('.save_and_continue').hide();
                	
                }
                 
            },
            onTabShow: function (tab, navigation, index) {
                var total = navigation.find('li').length;
                var current = index + 1;
                var $percent = (current / total) * 100;
                $('#form_wizard_1').find('.bar_wizard').css({
                    width: $percent + '%'
                });
            }
		});

		$('.product_checkbox,.group_check,.dock_check,.all_group,.all_products').uniform();

		$('#all_group').change(function(){
			if($('#all_group:checked').length==1){
				$('.group_check').prop('checked',true);
			}
			else{
				$('.group_check').prop('checked',false);
			}
			$.uniform.update();
			$('.group_check').trigger('change');	
		});
		
		$('.group_check').change(function(){
			$('.group_check').each(function(){
				var data_id = $(this).attr('data-id');
				if($(this).attr('checked')){
					$('.mass_edit_'+data_id).show();
				}
				else{
					$('.mass_edit_'+data_id).hide();
					$('#orignoOfCust_'+data_id).show();
					$('#noOfCust_'+data_id).hide();
				}
			});

			var checked_data_ids = []
			if($('.group_check:checked').length!=0){
				$('.group_check:checked').each(function(){
					var data_id = $(this).attr('data-id');
					checked_data_ids.push(data_id);
					
				});
			}
			else{
				customer_groups = [];
			}

			for(var j in customer_groups){
				var cg = customer_groups[j];
				var notfound = 0;
				for(var k in checked_data_ids){
					cdi = checked_data_ids[k];
					if(cdi==cg.group_id){
						notfound = 1;
						break;
					}
				}
				if(notfound==0){
					delete customer_groups[j]
				}
			}
			var newarr = [];
			for(var j in customer_groups){

				if(customer_groups[j].length!=0){
					newarr.push(customer_groups[j]);
				}
			}
			customer_groups = newarr;
	
			for(var j in checked_data_ids){
				if(customer_groups.length==0){
					customer_groups.push({group_id:checked_data_ids[j],customers:[]});
				}
				else{
					var notfound = 0;
					for(var k in customer_groups){
						if(customer_groups[k].group_id==checked_data_ids[j]){
							notfound = 1;
							break;
						}
					}
					if(notfound==0){
						customer_groups.push({group_id:checked_data_ids[j],customers:[]});
					}
				}
			}
			
			if($('.group_check:checked').length==0){
				$('#all_group').prop('checked',false);
				$.uniform.update();
			}
		});

		bulk_actions.bindCustomGroups();

		$('.all_custom_group').change(function(){
			if($('.all_custom_group:checked').length==1){
				$('.group_custom_check').prop('checked',true);
			}
			else{
				$('.group_custom_check').prop('checked',false);
			}
			$.uniform.update();
			$('.group_custom_check').trigger('change');
		});

		$('#include_all').bootstrapSwitch();

		$('#is_billable').bootstrapSwitch();

		$('#TriggerAction').select2().change(function(){
			var v = $(this).val();

			if(v == 'up'){
				$('.boat_action_up').addClass('hide');
				$('.boat_action_out').addClass('hide');

				if(checkNull(ba_dt.getPartnerCustomSettings['boat_product_up']) != ''){
					$('.billable_action').removeClass('hide');
				}
				else{
					$('#is_billable').bootstrapSwitch('setState',false);
					$('.billable_action').addClass('hide');
				}
			}
			else if(v == 'out'){
				$('.boat_action_up').addClass('hide');
				$('.boat_action_out').addClass('hide');

				if(checkNull(ba_dt.getPartnerCustomSettings['boat_product_out']) != ''){
					$('.billable_action').removeClass('hide');
				}
				else{
					$('#is_billable').bootstrapSwitch('setState',false);
					$('.billable_action').addClass('hide');
				}
			}
			else if(v == 'apply_up'){
				$('.boat_action_out').addClass('hide');

				$('.billable_action').addClass('hide');
				$('#is_billable').bootstrapSwitch('setState',false);
				$('.boat_action_up').removeClass('hide');
			}
			else if(v == 'apply_out'){
				$('.boat_action_up').addClass('hide');

				$('.billable_action').addClass('hide');
				$('#is_billable').bootstrapSwitch('setState',false);
				$('.boat_action_out').removeClass('hide');
			}

		}).trigger('change');

		$('.applyc').uniform();

		$('.apply_out').change(function(){
			if($('.apply_out:checked').length > 1){
				$('.preferred_td_out').show();
			}
			else{
				$('.preferred_td_out').hide();
			}
		}).trigger('change');

		$('.apply_up').change(function(){
			if($('.apply_up:checked').length > 1){
				$('.preferred_td_up').show();
			}
			else{
				$('.preferred_td_up').hide();
			}
		}).trigger('change');

	},
	getBoatsCount:function(){
		

    	var total_params = {
    		token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};

		var from = $('#masscust').val();
		total_params['from'] = from;
		if(from=='customer_groups'){
    		total_params['customer_groups'] = JSON.stringify(customer_groups);
    	}
		else if(from=='custom_groups'){
    		total_params['customer_custom_groups'] = JSON.stringify(customer_custom_groups);
    	}
    	else if(from=='queries'){
    		total_params['queries'] = JSON.stringify(customer_queries);
    	}

    	var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getnoboats.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				var dd = complet_data.response.response;
				if(checkNull(dd.more_boat,0) > 0){
					$('.more_than_boat').removeClass('hide');
					$('#include_all').bootstrapSwitch('setState',true);
				}
				else{
					$('.more_than_boat').addClass('hide');
					$('#include_all').bootstrapSwitch('setState',false);
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	bindCustomGroups:function(){
		for(var j in customer_custom_groups){
			var id = customer_custom_groups[j].group_id;
			$('.group_custom_check_'+id).prop('checked','checked');
		}
		

		$('.all_custom_group,.group_custom_check').uniform();
		$.uniform.update();

		$('.group_custom_check').change(function(){
			var data_id = $(this).attr('data-id');
			var chckd = $('.group_custom_check_'+data_id+':checked').length;
			
			for(var j in timeouts){
				clearTimeout(timeouts[j]);
			}
			timeouts.push(
    			setTimeout(function(){
      				bulk_actions.getCustomGroupData();
    			}, 100)
    		);			
		}).trigger('change');		
	},
	getCustomGroupData:function(){
		customer_custom_groups = [];
		$('.group_custom_check:checked').each(function(){
			var grp_id = $(this).attr('data-id');
			customer_custom_groups.push({group_id:grp_id});
		});
	},
	bindQuery:function(){
		bulk_actions.renderQuery('');

		$('#qry_type').select2();
		$('#qry_save').click(function(){
			bulk_actions.saveQuery();
		});

		var filters = [];
		for(var j in ba_dt.fields){
			var d = ba_dt.fields[j].customer_custom_fields;
			
			var input = 'text';
			var obj = {
				id:d.custom_field,
				field:d.custom_field,
				label:d.custom_field,
				optgroup:ba_td.Customer,
				size: 30,
				description: function(rule) {
		          	if (rule.operator && ['in', 'not_in'].indexOf(rule.operator.type) !== -1) {

		            	return 'Use a pipe (|) to separate multiple values with "in" and "not in" operators';
		          	}	
		        }
			};

			if(d.type == 'text'){
				input = 'text';
				type = 'string';
			}
			else if(d.type == 'textarea'){
				input = 'textarea';
				type = 'string';
			}
			else if(d.type == 'radio'){
				input = 'radio';
				type = 'integer';	

				var values = JSON.parse(d.custom_value);
				var show_val = {};
				for(var m in values){
					var key = values[m].value;
					show_val[key] = key;
				}
				obj['values'] = show_val;
				obj['operators'] =  ['equal'];
			}
			else if(d.type == 'dropdown'){
				input = 'select';
				type = 'string';

				var values = JSON.parse(d.custom_value);
				var show_val = [];
				for(var m in values){
					var key = values[m].value;
					show_val.push({
						label:key,
						value:key,
					});
				}
				obj['values'] = show_val;
				obj['operators'] = ['equal', 'not_equal', 'is_null', 'is_not_null']
			}
			else if(d.type == 'checkbox'){
				input = 'checkbox';
				type = 'string';
				//console.log('fields',d);
				//var values = JSON.parse(d.custom_value);
				var show_val = [];
				show_val.push(d.custom_value);
				
				obj['values'] = show_val;
				obj['operators'] = ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null'];
	           	obj['default_operator'] =  'in';
			}

			obj['type'] = type;
			obj['input'] = input;
			obj['my_type'] = 'custom_fields';
			obj['table_name'] = 'customer_fields_answers';
			
			filters.push(obj);
		}
		
		var other_fields = [];
		var customer_country = [];
		for(var j in ba_dt.getAllCountryList){
			customer_country.push({
				value:j,
				label:ba_dt.getAllCountryList[j]
			});
		}
		var customer_fields_a = [
			{
				custom_field:'customer_number',
				label:ba_td.$customerh,
				custom_value:'',
				type:'text',
				custom_type:'integer',
				custom_value:[],
				operators:['equal', 'not_equal','less','greater'],
				optgroup:ba_td.Customer,
				my_type:'customers',
				table_name:'customers',
			},
			{
				custom_field:'outstanding_balance',
				label:ba_td.Balance,
				custom_value:'',
				type:'text',
				custom_type:'integer',
				custom_value:[],
				operators:['equal', 'not_equal','less','greater'],
				optgroup:ba_td.Customer,
				my_type:'customers',
				table_name:'customers',
			},
			{
				custom_field:'created_date',
				label:ba_td.Registrationdate,
				custom_value:'',
				type:'text',
				custom_type:'date',
				custom_value:[],
				operators:['equal', 'not_equal','less','greater'],
				optgroup:ba_td.Customer,
				my_type:'customers',
				table_name:'customers',
			},
			{
				custom_field:'customer_zip',
				label:ba_td.Zip,
				custom_value:'',
				type:'text',
				custom_type:'date',
				custom_value:[],
				operators:['equal', 'not_equal'],
				optgroup:ba_td.Customer,
				my_type:'customers',
				table_name:'customers',
			},
			{
				custom_field:'customer_city',
				label:ba_td.City,
				custom_value:'',
				type:'text',
				custom_type:'date',
				custom_value:[],
				operators:['equal', 'not_equal'],
				optgroup:ba_td.Customer,
				my_type:'customers',
				table_name:'customers',
			}
			,
			{
				custom_field:'customer_country',
				label:ba_td.Country,
				type:'select',
				custom_type:'string',
				default_value:'NO',
				custom_value:customer_country,
				operators:['equal', 'not_equal'],
				optgroup:ba_td.Customer,
				my_type:'customers',
				table_name:'customers',
			}
		];
		var other_fields = other_fields.concat(customer_fields_a);

		
		if(ba_dt.plan_modules.indexOf('voluntary') != -1){
			var voluntary_fields = [
				{
					custom_field:'volunteer_type',
					label:ba_td.Status,
					custom_value:'',
					type:'select',
					custom_type:'string',
					custom_value:[
						{value:'participant',label:ba_td.Participant},
						{value:'exempt',label:ba_td.Exempt},
						{value:'specialty_work',label:ba_td.Specialtywork},
					],
					operators:['equal', 'not_equal'],
					optgroup:ba_td.Voluntarywork,
					my_type:'voluntary',
					table_name:'customers',
				},
				{
					custom_field:'schedule_date',
					label:ba_td.ScheduleDate,
					custom_value:'',
					type:'text',
					custom_type:'date',
					date_format:'dd.mm.yy',
					custom_value:'',
					operators:['equal', 'not_equal','less','greater'],
	    			optgroup:ba_td.Voluntarywork,
	    			my_type:'voluntary',
	    			table_name:'partner_voluntary_schedules',
	    
				},
				{
					custom_field:'schedule_status',
					label:ba_td.Schedulestatus,
					custom_value:'',
					type:'select',
					custom_type:'string',
					custom_value:[
						{value:'1',label:ba_td.Completed},
						{value:'0',label:ba_td.Inprogress},
					],
					operators:['equal', 'not_equal'],
					optgroup:ba_td.Voluntarywork,
					my_type:'voluntary',
					table_name:'partner_voluntary_schedules',
				},
				{
					custom_field:'customer_voluntary_hours',
					label:ba_td.Balance,
					custom_value:'',
					type:'number',
					custom_type:'integer',
					custom_value:[
						{value:'1',label:ba_td.Completed},
						{value:'0',label:ba_td.Inprogress},
					],
					operators:['equal', 'not_equal','less','greater'],
					optgroup:ba_td.Voluntarywork,
					my_type:'voluntary',
					table_name:'customer_voluntary_banks',
				},
			];
			var other_fields = other_fields.concat(voluntary_fields);
			
		}


		if(ba_dt.plan_modules.indexOf('marina') != -1){
			if(ba_dt.partner_docks.length != 0){
				var obj = {
					custom_field:'partner_dock_id',
					label:ba_td.Dock,
					custom_value:'',
					type:'select',
					custom_type:'string',
					custom_value:[],
					operators:['equal', 'not_equal'],
					optgroup:ba_td.Marina,
					my_type:'partner_docks',
					table_name:'partner_docks',
				}
				for(var k in ba_dt.partner_docks){
					var d = ba_dt.partner_docks[k].partner_docks;
					obj.custom_value.push({
						value:d.id,
						label:d.dock_name
					});
				}
				other_fields.push(obj);
			}

			if(ba_dt.partner_slips.length != 0){
				var obj = {
					custom_field:'slip_number',
					label:ba_td.Slip,
					custom_value:'',
					type:'select',
					custom_type:'string',
					custom_value:[],
					operators:['equal', 'not_equal','less','greater'],
					optgroup:ba_td.Marina,
					my_type:'partner_slips',
					table_name:'customer_slips',
				}
				for(var k in ba_dt.partner_slips){
					var d = ba_dt.partner_slips[k].partner_slips;
					obj.custom_value.push({
						value:d.slip_number,
						label:d.slip_name
					});
				}
				other_fields.push(obj);
			}

			if(ba_dt.partner_meters.length != 0){
				var obj = {
					custom_field:'partner_meter_id',
					label:ba_td.Meter,
					custom_value:'',
					type:'select',
					custom_type:'string',
					custom_value:[],
					operators:['equal', 'not_equal','less','greater'],
					optgroup:ba_td.Marina,
					my_type:'partner_meters',
					table_name:'customer_meters',
				}
				for(var k in ba_dt.partner_meters){
					var d = ba_dt.partner_meters[k].partner_meters;
					obj.custom_value.push({
						value:d.id,
						label:d.meter_name
					});
				}
				other_fields.push(obj);
			}

		}

		for(var j in other_fields){
			var d = other_fields[j];
			var input = 'text';
			var obj = {
				id:d.custom_field,
				field:d.custom_field,
				label:d.label,
				optgroup:d.optgroup,
				size: 30,
				input:d.type,
				type:d.custom_type,
				operators:d.operators,
				my_type:d.my_type,
				default_value:checkNull(d.default_value,''),
				table_name:d.table_name,
				description: function(rule) {
		          	
		        }
			};
			if(d.custom_value.length != 0){
				obj['values'] = d.custom_value;
				
			}
			if(d.type == 'select'){
				//obj['multiple'] = true;
			}
			if(d.type == 'date'){
				obj['format'] = obj.date_format;
			}
			filters.push(obj);
		}
	
		bulk_actions.bindFilter(filters);
	},
	bindFilter:function(filters){
		var options = {
			allow_empty: true,
	        sort_filters: true,
	        optgroups: {
	            core: {
	                en: 'Core',
	                fr: 'Coeur'
	            }
	        },
	        plugins: {
	            'sortable': null,
	            'invert': null,
	            'not-group': null,
	            'filter-description': { mode:'inline'},
	        },
	        operators: [
	            { type: 'equal'},
	            { type: 'not_equal' },
	            { type: 'in'},
	            { type: 'not_in' },
	            { type: 'less' },
	            { type: 'less_or_equal'},
	            { type: 'greater' },
	            { type: 'greater_or_equal' },
	            { type: 'between' },
	            { type: 'not_between' },
	            // { type: 'begins_with', optgroup: 'strings' },
	            // { type: 'not_begins_with', optgroup: 'strings' },
	           	{ type: 'contains' },
	           	{ type: 'not_contains'},
	            // { type: 'ends_with', optgroup: 'strings' },
	            // { type: 'not_ends_with', optgroup: 'strings' },
	            { type: 'is_empty' },
	            { type: 'is_not_empty' },
	        ],
	        filters:filters,
		};

	   	$('#builder').queryBuilder(options);
		
		var QueryBuilder = $.fn.queryBuilder;

		QueryBuilder.regional['en'] = {
			"__locale": "English (en)",
			"__author": "Damien \"Mistic\" Sorel, http://www.strangeplanet.fr",
			"add_rule": ba_td.$add_rule,
			"add_group": "Legg til gruppe",
			"delete_rule": ba_td.$delete_rule,
			"delete_group": "Slett gruppe",
			"conditions": {
		    	"AND": ba_td.$AND,
		    	"OR": ba_td.$OR
		  	},
		  	"operators": {
			  	"equal": ba_td.$equal,
				"not_equal": ba_td.$not_equal,
				"in": ba_td.$in,
				"not_in": ba_td.$not_in,
				"less": ba_td.$less,
				"less_or_equal": ba_td.$less_or_equal,
				"greater": ba_td.$greater,
				"greater_or_equal": ba_td.$greater_or_equal,
				"begins_with": ba_td.$begins_with,
				"not_begins_with": ba_td.$not_begins_with,
				"contains": ba_td.$contains,
				"not_contains": ba_td.$not_contains,
				"ends_with": ba_td.$ends_with,
				"not_ends_with": ba_td.$not_ends_with,
				"is_empty": ba_td.$is_empty,
				"is_not_empty": ba_td.$is_not_empty,
				"is_null": "er null",
				"is_not_null": "er ikke null"
		  	},
		  	"errors": {
				"no_filter": "No filter selected",
				"empty_group": "The group is empty",
				"radio_empty": "No value selected",
				"checkbox_empty": "No value selected",
				"select_empty": "No value selected",
				"string_empty": "Empty value",
				"string_exceed_min_length": "Must contain at least {0} characters",
				"string_exceed_max_length": "Must not contain more than {0} characters",
				"string_invalid_format": "Invalid format ({0})",
				"number_nan": "Not a number",
				"number_not_integer": "Not an integer",
				"number_not_double": "Not a real number",
				"number_exceed_min": "Must be greater than {0}",
				"number_exceed_max": "Must be lower than {0}",
				"number_wrong_step": "Must be a multiple of {0}",
				"number_between_invalid": "Invalid values, {0} is greater than {1}",
				"datetime_empty": "Empty value",
				"datetime_invalid": "Invalid date format ({0})",
				"datetime_exceed_min": "Must be after {0}",
				"datetime_exceed_max": "Must be before {0}",
				"datetime_between_invalid": "Invalid values, {0} is greater than {1}",
				"boolean_not_valid": "Not a boolean",
				"operator_not_multiple": "Operator \"{1}\" cannot accept multiple values"
		  	},
		  	"invert": "Invert",
		 	"NOT": "NOT"
		};
		
		QueryBuilder.defaults({ lang_code: 'en' });
		$('#builder').queryBuilder('destroy');
	 	$('#builder').queryBuilder(options).on('change.rulesChanged', function(e, rule) {
			bulk_actions.changeBuilder();

		});
		
		bulk_actions.changeBuilder();

		$('#builder').on('click','button[data-add="rule"]',function(){
			bulk_actions.changeBuilder();
		})	
	},
	renderQuery:function(data=''){
		if(data == ''){
			var data = ba_dt.mass_comm_query;
		}

		var html = `<table id="query_list" style="margin-top:5px" class="table table-striped table-hover table-bordered">
			<thead>
				<tr>
					<th style="display:none"></th>
					<th>`+ba_td.Name+`</th>
					<th>`+ba_td.Type+`</th>
					<th>`+ba_td.Action+`</th>
				</tr>
			</thead><tbody>
			`;
		if(data.length == 0){
			html += '</tbody></table>';
			$('.query_list_w').html(html);
			bulk_actions.checkEmpty();
		}
		else{
			for(var j in data){
				var c = data[j].MassCommQuery;
				html += '<tr data-id="'+c.id+'">';
					html += '<td  style="display:none"><input class="uni saveqry" type="checkbox" data-id="'+j+'" onchange="bulk_actions.setQuery('+j+',4)"></td>';
					html += '<td>'+c.name+'</td>';
					html += '<td>'+c.type+'</td>';
					html += '<td>';
						html += '<button class="sel_qry sel btn mini blue-stripe" href="javascript:;" onclick="bulk_actions.setQuery('+j+',0)" data-id="'+j+'"><i class="icon-plus"></i> '+ba_td.Select+'</button>';
						html += '<button style="display:none" class="sel_qry desel btn mini blue-stripe" href="javascript:;" onclick="bulk_actions.setQuery('+j+',-1)" data-id="'+j+'"><i class="icon-plus"></i> '+ba_td.Deselect+'</button>';
						html += '&nbsp;<button class="btn mini blue-stripe" href="javascript:;" onclick="bulk_actions.setQuery('+j+',1)"><i class="icon-eye-open"></i> '+ba_td.Edit+'</button>&nbsp;';
						html += '<button class="btn mini red-stripe" href="javascript:;" onclick="bulk_actions.setQuery('+j+',2)"><i class="icon-remove"></i> '+ba_td.Delete+'</button>';
					html += '</td>';
				html += '</tr>';
			}
			html += '</tbody></table>';
			$('.query_list_w').html(html);
			$('.uni').uniform();
		}

		$('#builder').on('change','select',function(){
			var v = $(this).val();
			if(v == 'schedule_date' || v == 'created_date'){
				var that = this;
				setTimeout(function(){
					$p = $(that).parent().parent().find('.rule-value-container');
					$p = $($p).find('input');
					
					$p.datepicker({
			   			format:date_format_partner
			   		}).change(function(){
			   			$('.datepicker').remove();
			   		});
		   		});
			}
		})
	},
	changeBuilder:function(){
		
			//$('#builder .rules-group-body .icon-plus').parent().remove();
			var html = '<button type="button" class="btn btn-xs btn-success" data-add="rule"><i class="icon-plus"></i> '+ba_td.$add_rule+' </button>';
			$('#builder .rules-group-body .append_here').parent().parent().prepend(html);
			$('#builder .rules-group-body .append_here').removeClass('append_here');

			$('#builder .rules-group-body select').each(function(){
				var w = $(this).width();
				$(this).css('width',w+'px');
				$(this).select2();
			});	
	},
	saveQuery:function(){

		var qry_name = $('#qry_name').val();
		var qry_type = $('#qry_type').val();
		var id = checkNull($('#qry_id').val());

		var filter = $('#builder').queryBuilder('getRules', {
       		get_flags: true,
        	skip_empty: true
      	});
      	var errormsg = '';
	  	if(filter.rules.length == 0){
	  		errormsg += ba_td.Emptyquery+'<br/>';
	  	}
	  	if(checkNull(qry_name) == ''){
	  		errormsg += ba_td.Name + '<br/>';
	  	}
	  	if(checkNull(qry_type) == ''){
	  		errormsg += ba_td.Type + '<br/>';
	  	}

	  	if(errormsg != ''){
	  		var msg = ba_td.Pleasecheckthefollowingfields+'<br/>' + errormsg;
	  		showAlertMessage(msg,'error',ba_td.alertmessage);
			return;
	  	}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,

			id:id,
			qry_name:qry_name,
			qry_type:qry_type,
			filter:JSON.stringify(filter),
			customer_ids:JSON.stringify(customer_queries),
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/saveQuery.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr('success',ba_td.Success, complet_data.response.response.message.msg);
				$('#saveandcpop').modal('hide');
				bulk_actions.cont();
				mcl_dt.mass_comm_query =  complet_data.response.response.mass_comm_query;
				bulk_actions.renderQuery();
				var id = complet_data.response.response.data.MassCommQuery.id;
				for(var j in mcl_dt.mass_comm_query){
					if(mcl_dt.mass_comm_query[j].MassCommQuery.id == id){
						bulk_actions.setQuery(j,0);
						break;
					}
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	create_query:function(){
		
	
		bulk_actions.setQuery(0,-1);
		$('#builder').queryBuilder('reset');
		$('#qry_id').val('');
		$('.query_customer_t').html('');
		customer_queries = [];
		$('#btn_continue').show();
		$('.save_and_continue').hide();
		bulk_actions.checkEmpty();
		bulk_actions.changeBuilder();
		$('.buid').show();
	},
	get_query:function(){
		var filter = $('#builder').queryBuilder('getRules', {
       		get_flags: true,
        	skip_empty: true
      	});
      	if(filter.rules.length == 0){
	  		showAlertMessage(ba_td.Pleaseselectquery,'error',ba_td.alertmessage);
    		return false;
	  	}
	  	var qry = $('#builder').queryBuilder('getSQL',false, false).sql;

     	bulk_actions.getCustomers(qry);      	
	},
	getCustomers:function(qry){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			query:JSON.stringify(qry)
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getCustomersQry.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				bulk_actions.generateCustList(complet_data.response.response.customers);
				bulk_actions.bindCustList();
			}
			else if(complet_data.response.status == 'error'){
				customer_queries = [];
				bulk_actions.bindCustList();
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	generateCustList:function(cust_list){
		customer_queries = [];
		//<th><input checked="checked"  class="uni query_all" type="checkbox"></th>
		var html = `<table style="margin-top:5px" class="table table-striped table-hover table-bordered">
			<thead>
				<tr>
					
					<th>`+ba_td.$customerh+`</th>
					<th>`+ba_td.Customername+`</th>
				</tr>
			</thead>
			`;
		if(cust_list.length != 0){
			for(var j in cust_list){
				var c = cust_list[j].Customer;
				customer_queries.push(c.id);
				html += '<tr>';
					//html += '<td><input checked="checked" data-value="'+c.id+'" value="'+c.id+'" type="checkbox" class="cust_q_c uni"></td>';
					html += '<td>'+c.customer_number+'</td>';
					html += '<td>'+c.customer_name+'</td>';
				html += '</tr>';
			}
			html += '</table>';
			$('div.query_customer_t').html(html);
		}
		else{
			$('div.query_customer_t').html('');
		}	
	},
	bindCustList:function(){
		$('.uni').uniform();
		$('.query_all').change(function(){
			if($('.query_all').is(':checked')){
				customer_queries = [];
				$('.cust_q_c').prop('checked','checked');
				$('.cust_q_c').each(function(){
					customer_queries.push($(this).val());
				});
			}
			else{
				$('.cust_q_c').removeAttr('checked');
				customer_queries = [];
			}
			$.uniform.update('.cust_q_c');
			bulk_actions.checkNextButton();
		});

		$('.cust_q_c').change(function(){
			
			if($(this).is(':checked')){
				customer_queries.push($(this).val());

			}
			else{
				customer_queries.splice(customer_queries.indexOf($(this).val()),1);

			}

			if(customer_queries.length == $('.cust_q_c').length){
				$('.query_all').prop('checked','checked');
			}
			else{
				$('.query_all').removeAttr('checked');
			}
			$.uniform.update('.query_all');
			bulk_actions.checkNextButton();

		});
		bulk_actions.checkNextButton();
	},
	generateCustomerGroupRows:function(data){
		var partner_customer_groups = data.partner_customer_groups;
		var nocustomers = data[0]['nocust'];
		var ret = '';
		ret += '<tr>';
			ret += '<td>';
				ret += '<input type="checkbox" value="'+partner_customer_groups.id+'" class="group_check group_check_'+partner_customer_groups.id+'" data-id="'+partner_customer_groups.id+'">';
			ret += '</td>';

			ret += '<td>';
				ret += partner_customer_groups.group_name;
			ret += '</td>';

			ret += '<td>';
				ret += '<span id="orignoOfCust_'+partner_customer_groups.id+'" class="origCust">'+nocustomers+'</span>';
				ret += '<span style="display:none" id="noOfCust_'+partner_customer_groups.id+'" class="noOfCust">'+nocustomers+'</span>';
			ret += '</td>';

			ret += '<td>';
				ret += '<a onclick="bulk_actions.getGroupInCustomer('+partner_customer_groups.id+')" class="btn mini blue-stripe mass_edit mass_edit_'+partner_customer_groups.id+'" style="display:none" data-id="'+partner_customer_groups.id+'"><i class="icon-edit"></i>&nbsp;'+ba_td.Edit+'</a>';
			ret += '</td>';
		ret += '</tr>';
		return ret;
		//getGroupInCustomer
	},
	getGroupInCustomer:function(group_id){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			group_id:group_id,
			limit:2000,
			recursive:-1,
			status:1,
			fields:['Customer.id','Customer.customer_name','Customer.customer_number','Customer.customer_email'],
		};
		showProcessingImage('undefined');
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/partners/getGroupInCustomer.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				bulk_actions.generateCustomerList(complet_data.response.response.customersList,group_id);
				//mcl_dt = complet_data.response.response;
	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	generateCustomerList:function(data,group_id){
		var width = 800;
		$('#mss_comm_lst_customer_popup').attr('data-width',width+'px');
		$('#mss_comm_lst_customer_popup').width(width);
		$('#mss_comm_lst_customer_popup').modal('show');
		$('#customer_list_table').dataTable().fnDestroy();
		$('#mss_comm_lst_customer_table').html('');
		$('#customer_list_table #all_customers').val(group_id);
		var indData = [];
		for(var j in customer_groups){
			if(customer_groups[j].group_id==group_id){
				indData = customer_groups[j].customers;
			}
		}
		for(var j in data){
			var cust = data[j].Customer;
			var html = '';
			html += '<tr style="cursor:pointer;">';

				html += '<td data-title="#">';

					var checkedHtml = '<input id="single_customers_'+cust.id+'" data-group-id="'+group_id+'" class="selectcustomers" name="single_customers" data-id="'+cust.id+'" value="'+cust.id+'" checked="checked" type="checkbox">';

					var uncheckedHtml = '<input id="single_customers_'+cust.id+'" data-group-id="'+group_id+'" class="selectcustomers" name="single_customers" data-id="'+cust.id+'" value="'+cust.id+'"  type="checkbox">';

					if(indData.length==0){
						html += checkedHtml;
					}
					else{
						var isuncheck = 0;
						for(var k in indData){
							if(cust.id==indData[k]){
								isuncheck = 1;
								html += uncheckedHtml;
								break;
							}
						}
						if(isuncheck==0){
							html += checkedHtml;
						}

					}
													
				html += '</td>';

				html += '<td data-title="'+ba_td.Customernumber+'">';
					html += cust.customer_number;
				html += '</td>';
				html += '<td data-title="'+ba_td.Customername+'">';
					html += cust.customer_name;
				html += '</td>';
				html += '<td data-title="Email">';
					html += cust.customer_email;
				html += '</td>';
			html += '</tr>';
			$('#mss_comm_lst_customer_table').append(html);
		}
		$('.product_checkbox,.group_check,.dock_check,.all_docks,.all_groups,.all_products').uniform();

		$('#customer_list_table').dataTable().fnDestroy();
		$('#customer_list_table').css({
			"width":"100%"
		});

		var d = $('#customer_list_table').dataTable( {
            "oLanguage":nor,
            "sDom": 'rt<"bottom"ilp><"clear">',
            "aoColumnDefs": [{
					'bSortable': false,
					'aTargets': [0]
				}
			]
        });
        $('.dataTables_paginate').click(function(){
        	 $('.all_customer,.selectcustomers').uniform();
        });
        $('#customer_name').off().keypress(function(){
        	 d.fnFilter($(this).val());
        });
        $('.all_customer,.selectcustomers').uniform();
        $('#customer_list_table #all_customers').change(function(){
        	if($('#customer_list_table #all_customers:checked').length==1){
        		$('.selectcustomers').attr('checked','checked');
        		$.uniform.update();
        		$('.selectcustomers').trigger('change');
        	}
        	else{
        		$('.selectcustomers').removeAttr('checked');
        		$.uniform.update();
        		$('.selectcustomers').trigger('change');
        	}
        });

        //$('.selectcustomers').change(function(){
        $('.customer_save').click(function(){
        	$('.selectcustomers').each(function(){
	        	var v = $(this).val();
	        	var group_id = $(this).attr('data-group-id');
	        	var data_id = $(this).attr('data-id');
	        	var checkThisArr = 'none';

	        	if($('#single_customers_'+data_id+':checked').length==1){
	        		for(var j in customer_groups){
		        		var cg = customer_groups[j];
		        		if(cg.group_id==group_id){
		        			if(customer_groups[j].customers.length!=0){
			        			for(var k in customer_groups[j].customers){
			        				if(customer_groups[j].customers[k]==data_id){
			        					delete customer_groups[j].customers[k];
			        					checkThisArr = j;
			        					break;
			        				}
			        			}
		        			}
		        			break;
		        		}
		        	}
		        	
		        }
		        else{
		        	for(var j in customer_groups){
		        		var cg = customer_groups[j];
		        		if(cg.group_id==group_id){
		        			var is_present = 0;
		        			for(var k in customer_groups[j].customers){
		        				
		        				var cgc = customer_groups[j].customers[k];
		        				if(cgc==data_id){
		        					is_present = 1;
		        					break;
		        				}
		        			}
		        			if(is_present==0){
		        				customer_groups[j].customers.push(data_id);
		        			}
		        			break;
		        		}
		        	}
		        }
		        var newArr = [];
		        if(checkThisArr!='none'){
		        	for(var j in customer_groups[checkThisArr].customers){
		        		if(customer_groups[checkThisArr].customers[j]!=''){
		        			newArr.push(customer_groups[checkThisArr].customers[j]);
		        		}
		        	}
		        	customer_groups[checkThisArr].customers = newArr;
		        }

		        if(customer_groups.length!=0){
		        	for(var j in customer_groups){
		        		var cg = customer_groups[j];
		        		var grp_id = cg.group_id;
		        		var unsel_cust = cg.customers.length;
		        		var origNoCust = parseInt($('#orignoOfCust_'+grp_id).html());
		        		var sel_cust = origNoCust - unsel_cust;
		        		$('#orignoOfCust_'+grp_id).hide();
		        		if(sel_cust<0){
		        			$('#orignoOfCust_'+grp_id).show();
		        		}
		        		else{
		        			$('#noOfCust_'+grp_id).text(sel_cust).show();
		        		}
		        	}
		        }
		        else{
		        	$('.noOfCust').hide();
		        	$('.origCust').show();
		        }
		    });
        	
        });
	},
	generateCustomerCustomGroupRows:function(data){
		var PartnerCommunicationGroup = data.PartnerCommunicationGroup;
		var nocustomers = data[0]['nocust'];
		var ret = '';
		ret += '<tr class="data-row" data-primary-key = "'+PartnerCommunicationGroup.id+'">';
			ret += '<td>';
				ret += '<input type="checkbox" value="'+PartnerCommunicationGroup.id+'" class="group_custom_check group_custom_check_'+PartnerCommunicationGroup.id+'" data-id="'+PartnerCommunicationGroup.id+'">';
			ret += '</td>';

			ret += '<td>';
				ret += PartnerCommunicationGroup.name;
			ret += '</td>';

			ret += '<td>';
				ret += '<span id="orignoOfCustC_'+PartnerCommunicationGroup.id+'" class="origCustC">'+nocustomers+'</span>';
				ret += '<span style="display:none" id="noOfCustC_'+PartnerCommunicationGroup.id+'" class="noOfCustC">'+nocustomers+'</span>';
			ret += '</td>';

			ret += '<td>';
				ret += '<a onclick="bulk_actions.editCustomGroup('+PartnerCommunicationGroup.id+')" class="btn mini blue-stripe mass_custom_edit mass_custom_edit_'+PartnerCommunicationGroup.id+'" data-id="'+PartnerCommunicationGroup.id+'"><i class="icon-edit"></i>&nbsp;'+ba_td.Edit+'</a>';

				ret += '<a onclick="bulk_actions.deleteCustomGroup('+PartnerCommunicationGroup.id+')" class="btn mini red-stripe mass_custom_del mass_custom_del_'+PartnerCommunicationGroup.id+'" data-id="'+PartnerCommunicationGroup.id+'"><i class="icon-remove"></i>&nbsp;'+ba_td.Delete+'</a>';


			ret += '</td>';
		ret += '</tr>';
		return ret;
	},
	showTab:function(which){
		if(which=='tab_1_customers'){
			if(customer_custom_groups.length!=0){
				var msg = ba_td.$custom_group_err;
				showAlertMessage(msg,'error',ba_td.alertmessage);
				return;
			}
			$('#tab_2_groups,.showtab_groups,#tab_3_queries,.showtab_queries').removeClass('active');
			$('.showtab_customers,#tab_1_customers').addClass('active');
			$('#masscust').val('customer_groups').trigger('change');
		}
		else if(which == 'tab_2_groups'){
			if(customer_groups.length!=0){
				var msg = ba_td.$customer_group_err;
				showAlertMessage(msg,'error',ba_td.alertmessage);
				return;
			}
			$('#tab_1_customers,.showtab_customers,#tab_3_queries,.showtab_queries').removeClass('active').removeClass('active');

			$('.showtab_groups,#tab_2_groups').addClass('active');
			$('#masscust').val('custom_groups').trigger('change');
		}
		else if(which == 'tab_3_queries'){
			if(customer_custom_groups.length!=0){
				var msg = ba_td.$custom_group_err;
				showAlertMessage(msg,'error',ba_td.alertmessage);
				return;
			}
			if(customer_groups.length!=0){
				var msg = ba_td.$customer_group_err;
				showAlertMessage(msg,'error',ba_td.alertmessage);
				return;
			}
			$('.showtab_customers,#tab_1_customers,.showtab_groups,#tab_2_groups').removeClass('active');

			$('.showtab_queries,#tab_3_queries').addClass('active');
			$('#masscust').val('queries').trigger('change');
		}	
		bulk_actions.checkNextButton();
	},
	checkNextButton:function(){
		if($('#masscust').val() != 'queries'){
			$('.save_and_continue').hide();
			$('#btn_continue').show();
		}
		else{
			if(customer_queries.length == 0){
				$('.save_and_continue').hide();
				$('#btn_continue').show();
			}
			else{
				$('.save_and_continue').show();
				$('#btn_continue').hide();
			}			
		}
	},
	checkEmpty:function(){
		if($('#query_list tbody tr:not(tr[data-id="0"])').length == 0){

			var html = '<tr><td colspan="3"><div style="margin-bottom: 0;text-align:center;" class="alert alert-error">'+ba_td.Norecordfound+'</div></td></tr>';
			$('#query_list tbody').html(html);
		}
		else{

		}
	},
	setQuery:function(j,from){
		var data = ba_dt.mass_comm_query;
		
		
		if(from == -1){
			$('input.saveqry').removeAttr('checked');
			$.uniform.update();
			$('#builder').queryBuilder('reset');
			$('.desel').hide();
			$('.sel').show();
			$('.query_customer_t').html('');
			customer_queries = [];
			$('#btn_continue').show();
			$('.save_and_continue').hide();
			$('.buid').hide();
			bulk_actions.checkEmpty();
		}
		else if(from == 0){//set query
			var c = data[j].MassCommQuery;
			
			$('input.saveqry').removeAttr('checked');
			$('input.saveqry[data-id="'+j+'"]').prop('checked','checked');

			$.uniform.update();
			c = JSON.parse(c.filter);
			$('#builder').queryBuilder('setRules', c);
			bulk_actions.get_query();
			$('.desel').hide();
			$('.sel').show();
			$('.sel[data-id="'+j+'"]').hide();
			$('.desel[data-id="'+j+'"]').show();
			$('#qry_id').val('');
			$('.buid').show();
			$('#btn_continue').hide();
			$('#save_and_continue').show();

				
		}
		else if(from == 1){//edit query
			bulk_actions.setQuery(j,0);
			bulk_actions.saveandc();
		}
		else if(from == 2){//delete query
			var yes = function(){
				bulk_actions.deleteQuery(c.id);
			}
			var no = function(){};
			showDeleteMessage(ba_td.$qry_del,ba_td.Warning,yes,no,'ui-dialog-blue',ba_td.Delete,ba_td.Cancel);
	
		}
		else if(from == 4){

		}
	},
	deleteQuery:function(id){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:id
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/deleteQuery.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				$('#query_list tr[data-id="'+id+'"]').remove();
				$('#builder').queryBuilder('reset');
				$('#qry_id').val('');
				$('.query_customer_t').html('');
				customer_queries = [];
				$('#btn_continue').show();
				$('.save_and_continue').hide();
				bulk_actions.checkEmpty();
				$('.buid').hide();
				call_toastr('success',ba_td.Success, complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	saveandc:function(){
		var width = 700;
		$('#qry_name').val('');
		$('#qry_type').val('query').trigger('change')

		$('#saveandcpop').attr('data-width',width+'px');
		$('#saveandcpop').modal('show');
		$('#saveandcpop').width(width);
		resizemodal();
		$('#qry_name').val('');
		$('#qry_type').val('query').trigger('change');
		$('#qry_id').val('');

		
		var c = $('input.saveqry:checked').attr('data-id');
		ba_dt.mass_comm_query
		if(checkNull(c) != '' && checkNull(ba_dt.mass_comm_query[c] != '')){
			var d = ba_dt.mass_comm_query[c].MassCommQuery;
			$('#qry_name').val(checkNull(d.name));
			$('#qry_type').val(checkNull(d.type)).trigger('change');
			$('#qry_id').val(checkNull(d.id));
		}
		$('#saveandcpop').resize();
	},
	cont:function(){
		$('#btn_continue').trigger('click');
	},
	editCustomGroup:function(id){
		new_custom_popup2(800,'popups','add_custom_group',{from:'edit',id:id,cfrom:'bulk_actions'});
	},
	deleteCustomGroup:function(id){
		var yes = function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				id:id,
			}
		

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Commons/deleteCustomGroup.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
				if(complet_data.response.status == 'success'){
					var d = complet_data.response.response;
				

					
					var id = d.id;
					$('#custom_groups_table tr[data-primary-key="'+id+'"]').remove();
					if($('#custom_groups_table tbody tr').length==1){
						$('#mss_comm_lst_cust_custom_empty_tr').show();
					}
					bulk_actions.getCustomGroupData();
					call_toastr('success',ba_td.Success, ba_td.$del_cust_grp_suc);
							
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',ba_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
		}

		var no = function(){

		}
		showDeleteMessage(ba_td.$del_cust_grp,ba_td.Confirmation,yes,no,'ui-dialog-blue',ba_td.Delete,ba_td.Cancel);
	},
	save:function(){
    	var total_params = {
    		token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};

		var from = $('#masscust').val();
		total_params['from'] = from;
		if(from=='customer_groups'){
    		total_params['customer_groups'] = JSON.stringify(customer_groups);
    	}
		else if(from=='custom_groups'){
    		total_params['customer_custom_groups'] = JSON.stringify(customer_custom_groups);
    	}
    	else if(from=='queries'){
    		total_params['queries'] = JSON.stringify(customer_queries);
    	}


    	var trigger_action = $('#TriggerAction').val();
    	total_params['trigger_action'] = trigger_action;

    	var errorMsg = '';
    	if(trigger_action == 'apply_up'){
    		if($('.apply_up:checked').length == 0){
    			errorMsg += ba_td.Selectatleastoneevent;
    		}
    		var appl_eve = [];

    		$('.apply_up:checked').each(function(){
    			var v = $(this).val();
    			appl_eve.push(v);
    		});

    		total_params['events'] = JSON.stringify(appl_eve);
    		total_params['preferred_event'] = $('.preferred_up:checked').val();

    	}
    	else if(trigger_action == 'apply_out'){
    		if($('.apply_out:checked').length == 0){
    			errorMsg += ba_td.Selectatleastoneevent;
    		}
    		var appl_eve = [];

    		$('.apply_out:checked').each(function(){
    			var v = $(this).val();
    			appl_eve.push(v);
    		});

    		total_params['events'] = JSON.stringify(appl_eve);
    		total_params['preferred_event'] = $('.preferred_out:checked').val();
    	}

    	if(errorMsg != ''){
    		showAlertMessage(errorMsg,'error',ba_td.alertmessage);
    		return;
    	}

    	var include_all = $('#include_all').bootstrapSwitch('status');
    	total_params['include_all'] = (include_all)?'y':'n';

    	var is_billable = $('#is_billable').bootstrapSwitch('status');
    	total_params['is_billable'] = (is_billable)?'y':'n';

    	var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/updateBoats.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				var d = complet_data.response.response;
				bulk_actions.generateSummary(d,total_params);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ba_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	generateSummary:function(data,total_params){
		$('#form_wizard_1').find('.button-next').hide();
  		$('#form_wizard_1').find('.button-previous').hide();
  		$('#form_wizard_1').find('.button-send').hide();
  		$('#form_wizard_1').find('.button-again').show();


  		
  		w.bootstrapWizard('last');
  		var html = '';

  		if(total_params.trigger_action == 'up'){
  			var c = checkNull(data.suc,0);
  			if(c > 1){
  				var msg = ba_td.$up_msg_s;
  			}
  			else{
  				var msg = ba_td.$up_msg;
  			}
  			msg = msg.replace('X',c );
  		}
  		else if(total_params.trigger_action == 'out'){
  			var c = checkNull(data.suc,0);
  			if(c > 1){
  				var msg = ba_td.$out_msg_s;
  			}
  			else{
  				var msg = ba_td.$out_msg;
  			}
  			msg = msg.replace('X',c);
  		}
  		else if(total_params.trigger_action == 'apply_up'){
  			var c = checkNull(data.suc,0);
  			if(c > 1){
  				var msg = ba_td.$up_msg_as;
  			}
  			else{
  				var msg = ba_td.$up_msg_a;
  			}
  			msg = msg.replace('X',c );
  		}
  		else if(total_params.trigger_action == 'apply_out'){
  			var c = checkNull(data.suc,0);
  			if(c > 1){
  				var msg = ba_td.$out_msg_as;
  			}
  			else{
  				var msg = ba_td.$out_msg_a;
  			}
  			msg = msg.replace('X',c);
  		}

  		if(total_params.trigger_action == 'up' || total_params.trigger_action == 'out' ){
  			html += `<span>`+msg+`<span>`;
  			var obj = {};
  			for(var j in data.error){
  				var d = data.error[j];

  				var name = checkNull(d.cust.customer_number)+` `+checkNull(d.cust.customer_name);

  				var reason = '';
  				if(total_params.include_all	== 'n' && checkNull(d[0].boat_count) > 1){
					reason = ba_td.$omit_msg +' ('+checkNull(d.ps.slip_name)+')';
				}
				else{
					if(total_params.trigger_action == 'up'){
						reason = ba_td.Boatalreadyonland +' ('+checkNull(d.ps.slip_name)+')';
					}
					else if(total_params.trigger_action == 'out'){
						reason = ba_td.Boatalreadyonwater +' ('+checkNull(d.ps.slip_name)+')';
					}
				}

  				if(checkNull(obj[d.cust.customer_number]) == ''){
  					obj[d.cust.customer_number] = {
  						name:name,
  						reason:reason
  					};
  				}
  				else{
  					obj[d.cust.customer_number]['reason'] = obj[d.cust.customer_number]['reason']+', '+reason;
  				}
  				
  			}
  			
  			html += `<div class="row-fluid"><div class="table-responsive">`;
  			html += `<table class="table table-striped table-hover table-bordered">`;
  				var tablep = `<thead>
  						<tr>
  							<th>`+ba_td.$customerhandname+`</th>
  							<th>`+ba_td.Reason+`</th>
  						</tr>
  					</thead><tbody>`;
  				var table = '';
  				for(var j in obj){
  					var d = obj[j];

  					table += `<tr>`;
  						table += `<td>`+d.name+`</td>`;
  						table += `<td>`+d.reason+`</td>`;
  					table += `</tr>`;
  				}
  			tablep += table+`</tbody></table></div></div>`;
  			if(table != ''){
  				html += tablep;
  			}
  		}
  		else if(total_params.trigger_action == 'appply_up' || total_params.trigger_action == 'apply_out' ){
  			html += `<span>`+msg+`<span>`;


  			html += `<div class="row-fluid"><div class="table-responsive">`;
  			html += `<table class="table table-striped table-hover table-bordered">`;
  				var tablep = `<thead>
  						<tr>
  							<th>`+ba_td.$customerhandname+`</th>
  							<th>`+ba_td.Reason+`</th>
  						</tr>
  					</thead><tbody>`;
  				var  table = '';
  				for(var j in data.error){
  					var d = data.error[j];

  					table += `<tr>`;
  						table += `<td>`+checkNull(d.name)+`</td>`;
  						table += `<td>`+checkNull(d.reason)+`</td>`;
  					table += `</tr>`;
  				}
  			tablep += table+`</tbody></table></div></div>`;
  			if(table != ''){
  				html += tablep;
  			}
  		}
  		$('div.generate_summary_h').html(html);
  		$('.generate_summary').removeClass('hide');

	},
  	generateEvent:function(data,type){
  		
  		var tr = '';
  		var pbe = data['pbe'];


  		if( ( type == 'up' && pbe.type == 'up') || ( type == 'out' && pbe.type == 'out')){

  			tr += '<tr>';
  				tr += '<td>'+pbe.name+'</td>';

	  			var start_date = convertDateIntoSiteFormat(pbe.start_datetime);
				var start_time = moment(pbe.start_datetime).format('hh:mm');
				var startstr = ba_td.$dateoclock;
				startstr = startstr.replace('%date%',start_date).replace('%time%',start_time);
				tr += '<td>'+startstr+'</td>';
				
				var end_date = convertDateIntoSiteFormat(pbe.end_datetime);
				var end_time = moment(pbe.end_datetime).format('hh:mm');
				var endstr = ba_td.$dateoclock;
				endstr = endstr.replace('%date%',end_date).replace('%time%',end_time);
				tr += '<td>'+endstr+'</td>';				
				
				tr += '<td><input type="checkbox" value="'+pbe.id+'" class="applyc apply_'+pbe.type+'" name="apply_'+pbe.type+'"></td>';
				tr += '<td class="preferred_td_'+pbe.type+'"><input type="radio" value="'+pbe.id+'"  class="preferredc preferred_'+pbe.type+'" name="preferred_'+pbe.type+'"></td>';

			tr += '</tr>';

  		}

  		return tr;
  	},
}
Template7.registerHelper('CustomerGroupListHelper', function (data){
	return bulk_actions.generateCustomerGroupRows(data);
});

Template7.registerHelper('CustomerCustomGroupListHelper', function (data){
	return bulk_actions.generateCustomerCustomGroupRows(data);
});

Template7.registerHelper('UpEventHelper', function (data){
	return bulk_actions.generateEvent(data,'up');
});

Template7.registerHelper('OutEventHelper', function (data){
	return bulk_actions.generateEvent(data,'out');
});