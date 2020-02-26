if(marina_billing!=undefined){
	delete marina_billing;
}
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
if(date_format_partner==''){
	date_format_partner = date_format;
}
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id = parseInt($('#partner_id').val());
var admin_id = parseInt($('#admin_id').val());
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var loginType= $('#loginType').val();
var login_id = $('#login_id').val();

var global_marina_billing_data;
var global_marina_billing_translationsData;
var attendance = {};
var nor = {};
var customer_groups=[];
var customer_docks=[];
var how_to_price = 'manual';
var add_prod = 'yes';
var global_linKy=0;
var w;

var getGlblPartnerTaxLevelList;
var batch_id='';
var vat_required;
var getProductUnitList;

var type = $('#type').val();
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
var marina_billing = {
	start:function(){

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['alert message','Dashboard','Marina','Billing','Step','of','Cancel','alert message','error','Yes','No','Select recipients','Select invoice properties','Product lines','Summary','Back','Continue','Group name','Action','Customers','No data found','Edit','Email','Customer number','Customer name','Please select group with customer','alert message','Dock name','Initial','Search customer','Customer name','Customer number','Search slip','Slip N','Associated meter','Meter value','Assigned customer','Slip name','Docks','Customer group','Please select dock with slip','Invoice properties','Our ref','Message in own words','characters left','Sales date','Due date','Please enter sales date','Please enter due date','Insert product lines','Product','Description','Quantity','MVA','Unit','Unit Price','Total Price','Discount','Confirmation','Yes','No','Would you like to add other products to these invoices','How to enter price of these products','Manual','Default','Add product','Delete product','Are you sure you would like to delete selected product line','Please check the following fields','for line number','Create invoice','Save','Invoice summary generation is in progress','You will be notified on summary generation','success','Success','Show summary','Summary generation is in progress','we will notify once completed','Marina billing summary completed','Send invoice','Send invoices','Review and send invoice','Review and send invoices','Your invoice has now been distributed to the selected recipients','Customer groups','The number of invoice sent','Would you like to add other product lines1que1','Would you like to define prices manually1que1',' Bill only once per customer','If set to','then the products will only be billed once per customer','If you set this to','then the products will be billed once per slip','but minimum one time','so that customers who have more than one slip will be billed multiple times','default','Error','records','record','Error in','Processed','successfully','alert message','Alert message','Please remove all docks to select customer groups','Only one of customer groups or docks can be selected','Please remove all customer groups to select docks','These products are being billed once per customer','Next','Create another invoice','Invoice created',' Your invoice has now been distributed to the selected recipients','Below is a summary of your invoice','Number of invoice recipients','Selection based on','Product name','Total','Expand all','Collapse all','Total price','Discard Billing','Send Invoices','Marina billing deleted successfully','Marina billing sent successfully'],

		};
	
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getMarinaBilling.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				
				global_marina_billing_data = complet_data.response.response;
				global_marina_billing_data['CUR_SYM'] = CUR_SYM;
				if(global_marina_billing_data.rpending=='yes'){
					getGlblPartnerTaxLevelList = complet_data.response.response.getPartnerTaxLevelList;
					vat_required = complet_data.response.response.getPartnerCustomSettings.PartnerSetting.vat_required;
					getProductUnitList = complet_data.response.response.pending_data.getProductUnitList;
					batch_id = complet_data.response.response.batch_id;
				}	
				$.each(complet_data.response.response.translationsData, function (key, val) {
			        var str = val.replace(/1period1/g, ".");
			       	str = str.replace(/1comma1/g, ",");
			       	str = str.replace(/1que1/g, "?");
			        complet_data.response.response.translationsData[key] = str;
			    });
				gbl_trnsdata = complet_data.response.response.translationsData;
				global_marina_billing_translationsData= complet_data.response.response.translationsData;
				marina_billing.createHtml(complet_data.response.response);

			
				


			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		global_marina_billing_data.date_format_partner = date_format_partner;
		global_marina_billing_data.translationsData.dashboardurl = base_url+'dashboard/index';
		global_marina_billing_data.translationsData.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('marina_billing_template').innerHTML;
		var compiledRendered = Template7(template, global_marina_billing_data);
		document.getElementById('content').innerHTML = compiledRendered;
		hideProcessingImage();		
		marina_billing.bindEvents();
	},
	bindEvents:function(){
		$('.marina_review').hide();
		(function () {
		  jQuery('#shwprdline')['bootstrapSwitch']();
		  jQuery('#hwprcs')['bootstrapSwitch']();
		   //jQuery('#billoncew')['bootstrapSwitch']();
		})();

		var msg = global_marina_billing_translationsData.Ifsetto;
		msg += '&nbsp;'+global_marina_billing_translationsData.Yes +  '&nbsp;('+global_marina_billing_translationsData.default + '),';
		msg += '&nbsp;'+global_marina_billing_translationsData.thentheproductswillonlybebilledoncepercustomer+'.<br/>';
		msg += global_marina_billing_translationsData.Ifyousetthisto;
		msg += '&nbsp;'+global_marina_billing_translationsData.No+',<br/>';
		msg += global_marina_billing_translationsData.thentheproductswillbebilledonceperslip;
		msg += '&nbsp;('+global_marina_billing_translationsData.butminimumonetime+')';
		msg += '&nbsp;'+global_marina_billing_translationsData.sothatcustomerswhohavemorethanoneslipwillbebilledmultipletimes+'.';


		$("#info_bill_once").hover(function () {
			$(this).popover({
				title: '',        
				content: msg,
				html: true
			}).popover('show');
		}, function () {
			$(this).popover('hide');
		});		

		$('.product_checkbox,.group_check,.dock_check,.all_group,.all_docks,.all_products').uniform();
		$('#shwprdline').on('switch-change', function (e, data) {
		    var value = data.value;
			if(value){
				$('.hwprcs_wrapper').show();
				how_to_price = 'default';
				marina_billing.addProductLines();
				$('#product_lines_wrapper').show();
				add_prod = 'yes';
			}
			else{
				add_prod = 'no';
				$('.hwprcs_wrapper,#product_lines_wrapper').hide();
			}
			$('#hwprcs').bootstrapSwitch('setState', false);
		});

		$('#hwprcs').on('switch-change', function (e, data) {
		    var value = data.value;
		    $('#product_lines_wrapper').show();
		    var vat_enabled = global_marina_billing_data.getPartnerCustomSettings.PartnerSetting.vat_required;
		    if(vat_enabled=='n'){
				$('.tax_hide').hide();
				$('select[name="vat_level"]').val('');
			}
			else{
				$('.tax_hide').show();
			}

			if(value){
				how_to_price = 'manual';
				marina_billing.addProductLines();
			}
			else{
				how_to_price = 'default';
				marina_billing.addProductLines();
			}
		});


		$('#our_ref').select2();
		$('#marina_billing_btn_new').click(function(){
			add_prod = 'yes';
			marina_billing.addProductLines('frmbtn');
		});
		$('#marina_billing_btn_delete').click(function(){
			marina_billing.removeProductLines();
		});

		$('#btn_screate_invoice').click(function(){
			marina_billing.saveData(1);
		});
		$('#btn_rev_create_invoice').click(function(){
			marina_billing.saveData(0);
		});
	
		$('.all_products').change(function(){
			if($('.all_products:checked').length==1){
				$('.product_checkbox').prop('checked',true);
			}
			else{
				$('.product_checkbox').prop('checked',false);
			}
			var isone = 0;
			$('.product_checkbox').each(function(){
				var d = $(this).attr('data-line-key');
				var a = $('.product_checkbox_'+d+':checked').length;
				if(a==0){
					isone = 1;
					return false;
				}
			});
			if(isone==1){
				$('.all_products').prop('checked',false); 
			}

			$('.product_checkbox').trigger('change');
			$.uniform.update();
		});

		$('#sales_date').datepicker({
   			format:global_marina_billing_data.date_format_partner,
   	
   		}).change(function(){
   			var credit_days = global_marina_billing_data.getPartnerCustomSettings.PartnerSetting.credit_days;
   			var d = moment($('#sales_date').datepicker("getDate")).add('days',credit_days);
   			$( "#due_date" ).datepicker( "setDate",d._d);
   			$('.datepicker').remove();
   		});
   		$( "#sales_date" ).datepicker( "setDate", new Date());

   		$('#due_date').datepicker({
   			format:global_marina_billing_data.date_format_partner,
   		}).change(function(){

   			$('.datepicker').remove();
   		});
   		var credit_days = global_marina_billing_data.getPartnerCustomSettings.PartnerSetting.credit_days;
   		var d = moment().add('days',credit_days);
   		$( "#due_date" ).datepicker( "setDate",d._d);

		$('#dockcust').select2({
			minimumResultsForSearch:-1
		}).change(function(){
			customer_groups=[];
			customer_docks=[];
			if($(this).val()=='docks'){
				$('#docks_table').show();
				$('#customer_groups_table').hide();
			}
			else{
				$('#docks_table').hide();
				$('#customer_groups_table').show();
			}
		});
		
		w= $('#form_wizard_1').bootstrapWizard({
		 	'nextSelector': '.button-next',
            'previousSelector': '.button-previous',
            onTabClick: function (tab, navigation, index) {
                //alert('on tab click disabled');
                return false;
            },
            beforeNext: function (tab, navigation, index) {
            	$('#btn_create_invoice_frmsumm').hide();
            	var current = index + 1;
            	if(index==1){
        		 	if($('#dockcust').val()=='docks'){
	            		if(customer_docks.length==0){
		            		showAlertMessage(global_marina_billing_translationsData.Pleaseselectdockwithslip,'error',global_marina_billing_translationsData.alertmessage);
		            		return false;
		            	}
		            	else{
		            		var cust_exists = 0;
		            		
		            		for(var j in customer_docks){
		            			var dck_id = customer_docks[j].dock_id;
		            			var orig_cust = $('#orignoOfCustDock_'+dck_id).html();
		            			orig_cust = parseInt(orig_cust);
		            			if(customer_docks[j].slips.length==0 && customer_docks[j].slips.length!=orig_cust){
		            				cust_exists = 1;
		            				break;
		            			}
		            			if(customer_docks[j].slips.length!=0 && customer_docks[j].slips.length!=orig_cust){
		            				cust_exists = 1;
		            				break;
		            			}
		            		}
		            		if(cust_exists==0){
		            			showAlertMessage(global_marina_billing_translationsData.Pleaseselectdockwithslip,'error',global_marina_billing_translationsData.alertmessage);
		            			return false;
		            		}
		            	}
	            	}
	            	else{
		            	if(customer_groups.length==0){
		            		showAlertMessage(global_marina_billing_translationsData.Pleaseselectgroupwithcustomer,'error',global_marina_billing_translationsData.alertmessage);
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
		            			showAlertMessage(global_marina_billing_translationsData.Pleaseselectgroupwithcustomer,'error',global_marina_billing_translationsData.alertmessage);
		            			return false;
		            		}
		            	}
	            	}
		           
            	}
            	else if(index==2){
            		var sales_date =  $('#sales_date').val();
            		var due_date =  $('#due_date').val();
            		if(sales_date==''){
            			showAlertMessage(global_marina_billing_translationsData.Pleaseentersalesdate,'error',global_marina_billing_translationsData.alertmessage);
		            		return false;
            		}
            		if(due_date==''){
            			showAlertMessage(global_marina_billing_translationsData.Pleaseenterduedate,'error',global_marina_billing_translationsData.alertmessage);
		            		return false;
            		} 
            		var sales_date =  moment($('#sales_date').datepicker("getDate"));
            		var due_date =  moment($('#due_date').datepicker("getDate"));
            		// if(sales_date < due_date){
            		// 	showAlertMessage(global_marina_billing_translationsData.Pleaseentersalesdate,'error',global_marina_billing_translationsData.alertmessage);
		            // 		return false;
            		// }

            	}
            	else if(index==3){
            		if(add_prod == 'yes'){
            			var a = marina_billing.validateProductLines();
            			if(!a){
	            			return false;
	            		}
            		}
            	}

            	return true;
            },
            onNext: function (tab, navigation, index) {
            	$('#btn_rev_create_invoice,#btn_screate_invoice').hide();
            	var total = navigation.find('li').length;
                var current = index + 1;
                $("#wizard_steps").val(current);
                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }
              	$('#form_wizard_1').find('.button-next').show();
                $('#btn_create_invoice').hide();

                if (current == 1) {
                    $('#form_wizard_1').find('.button-previous').hide();
                }
                else{
                	if(current==2){
                		$('#form_wizard_1').find('.button-previous').show();
                	}
                	else if(current==3){
                		$('#form_wizard_1').find('.button-next').hide();
                		$('#btn_continue').hide();
                		var cust = marina_billing.calNoCust();
                		if(cust>1){
                			$('#btn_screate_invoice').html(global_marina_billing_translationsData.Sendinvoices+ ' <i class="m-icon-swapright m-icon-white"></i>');

                			$('#btn_rev_create_invoice').html(global_marina_billing_translationsData.Reviewandsendinvoices+ ' <i class="m-icon-swapright m-icon-white"></i>');
                		}
                		else{
                			$('#btn_screate_invoice').html(global_marina_billing_translationsData.Sendinvoice+ ' <i class="m-icon-swapright m-icon-white"></i>');

                			$('#btn_rev_create_invoice').html(global_marina_billing_translationsData.Reviewandsendinvoice+ ' <i class="m-icon-swapright m-icon-white"></i>');
                		}
            			$('#btn_rev_create_invoice,#btn_screate_invoice').show();
                	}
                	else{
                		$('#form_wizard_1').find('.button-previous').show();
                		if(current==4){
                			marina_billing.generateSummary();
                			$('#form_wizard_1').find('.button-next').hide();
                			
            				$('#btn_continue').hide();
            				$('#btn_rev_create_invoice').hide();
            				$('#btn_screate_invoice').show();
                		}
                	}                	
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
                $('#btn_continue').show();
                $('#btn_rev_create_invoice,#btn_screate_invoice').hide();
               
                if (current == 1) {
                    $('#form_wizard_1').find('.button-previous').hide();
                }
                else{
                	if(current==3){
                		 $('#btn_rev_create_invoice,#btn_screate_invoice').show();
                		 $('#btn_continue').hide();
              			  
                	}
                	$('#form_wizard_1').find('.button-previous').show();
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

		$('#all_docks').change(function(){
			if($('#all_docks:checked').length==1){
				$('.dock_check').prop('checked',true);
			}
			else{
				$('.dock_check').prop('checked',false);
			}
			$.uniform.update();
			$('.dock_check').trigger('change');
		});

		$('.dock_check').change(function(){
			$('.dock_check').each(function(){
				var data_id = $(this).attr('data-id');
				if($(this).attr('checked')){
					$('.dock_edit_'+data_id).show();
				}
				else{
					$('.dock_edit_'+data_id).hide();
					$('#orignoOfCustDock_'+data_id).show();
					$('#noOfCustDock_'+data_id).hide();
				}
			});

			var checked_data_ids = []
			if($('.dock_check:checked').length!=0){
				$('.dock_check:checked').each(function(){
					var data_id = $(this).attr('data-id');
					checked_data_ids.push(data_id);
					
				});
			}
			else{
				customer_docks = [];
			}

			for(var j in customer_docks){
				var cg = customer_docks[j];
				var notfound = 0;
				for(var k in customer_docks){
					cdi = checked_data_ids[k];
					if(cdi==cg.dock_id){
						notfound = 1;
						break;
					}
				}
				if(notfound==0){
					delete customer_docks[j]
				}
			}
			var newarr = [];
			for(var j in customer_docks){

				if(customer_docks[j].length!=0){
					newarr.push(customer_docks[j]);
				}
			}
			customer_docks = newarr;
	
			for(var j in checked_data_ids){
				if(customer_docks.length==0){
					customer_docks.push({dock_id:checked_data_ids[j],slips:[]});
				}
				else{
					var notfound = 0;
					for(var k in customer_docks){
						if(customer_docks[k].dock_id==checked_data_ids[j]){
							notfound = 1;
							break;
						}
					}
					if(notfound==0){
						customer_docks.push({dock_id:checked_data_ids[j],slips:[]});
					}
				}
			}

			
			if($('.dock_check:checked').length==0){
				$('#all_docks').prop('checked',false);
				$.uniform.update();
			}
		});

		if(global_marina_billing_data.rpending=='yes'){
			marina_billing.getSummary();
			
		}
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
				ret += '<a onclick="marina_billing.getGroupInCustomer('+partner_customer_groups.id+')" class="btn mini blue-stripe mass_edit mass_edit_'+partner_customer_groups.id+'" style="display:none" data-id="'+partner_customer_groups.id+'"><i class="icon-edit"></i>&nbsp;'+global_marina_billing_translationsData.Edit+'</a>';
			ret += '</td>';
		ret += '</tr>';
		return ret;
		//getGroupInCustomer
	},
	getGroupInCustomer:function(group_id){
		var total_params = {
			APISERVER:APISERVER,
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
			
				marina_billing.generateCustomerList(complet_data.response.response.customersList,group_id);
				//global_marina_billing_data = complet_data.response.response;
	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	generateCustomerList:function(data,group_id){
		var width = 800;
		$('#marina_billing_customer_popup').attr('data-width',width+'px');
		$('#marina_billing_customer_popup').width(width);
		$('#marina_billing_customer_popup').modal('show');
		$('#customer_list_table').dataTable().fnDestroy();
		$('#marina_billing_customer_table').html('');
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

				html += '<td data-title="'+global_marina_billing_translationsData.Customernumber+'">';
					html += cust.customer_number;
				html += '</td>';
				html += '<td data-title="'+global_marina_billing_translationsData.Customername+'">';
					html += cust.customer_name;
				html += '</td>';
				html += '<td data-title="Email">';
					html += cust.customer_email;
				html += '</td>';
			html += '</tr>';
			$('#marina_billing_customer_table').append(html);
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
	generateDockRows:function(data){
		var PartnerDock = data.PartnerDock;
		var nocuslip = data[0]['nocuslip'];
		var ret = '';
		ret += '<tr>';
			ret += '<td>';
				ret += '<input type="checkbox" value="'+PartnerDock.id+'" class="dock_check dock_check_'+PartnerDock.id+'" data-id="'+PartnerDock.id+'">';
			ret += '</td>';

			ret += '<td>';
				ret += PartnerDock.dock_name;
			ret += '</td>';

			ret += '<td>';
				ret += PartnerDock.initial;
			ret += '</td>';

			ret += '<td>';
				ret += '<span id="orignoOfCustDock_'+PartnerDock.id+'" class="origCustDock">'+nocuslip+'</span>';
				ret += '<span style="display:none" id="noOfCustDock_'+PartnerDock.id+'" class="noOfCustDock">'+nocuslip+'</span>';
			ret += '</td>';

			ret += '<td>';
				ret += '<a onclick="marina_billing.getSlipInDock('+PartnerDock.id+')" class="btn mini blue-stripe dock_edit dock_edit_'+PartnerDock.id+'" style="display:none" data-id="'+PartnerDock.id+'"><i class="icon-edit"></i>&nbsp;'+global_marina_billing_translationsData.Edit+'</a>';
			ret += '</td>';
		ret += '</tr>';
		return ret;
	},
	getSlipInDock:function(dock_id){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			dock_id:dock_id,
		
		};
		showProcessingImage('undefined');
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getCustmerAssignedSlipByDockId.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				marina_billing.generateDockSlipList(complet_data.response.response.getPartnerDocks,dock_id);
				//global_marina_billing_data = complet_data.response.response;
	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;	
	},
	generateDockSlipList:function(data,dock_id){
		var width = 800;
		$('#marina_billing_dockslip_popup').attr('data-width',width+'px');
		$('#marina_billing_dockslip_popup').width(width);
		$('#marina_billing_dockslip_popup').modal('show');
		$('#dock_slip_table').dataTable().fnDestroy();
		$('#marina_billing_slip_table').html('');
		$('#dock_slip_table #all_slip').val(dock_id);

		var indData = [];
		for(var j in customer_docks){
			if(customer_docks[j].dock_id==dock_id){
				indData = customer_docks[j].slips;
			}
		}
		for(var j in data){
			var CustomerSlip = data[j].CustomerSlip;
			var PartnerMeter = data[j].PartnerMeter;
			var PartnerSlip = data[j].PartnerSlip;
			var Customer = data[j].Customer;
			var html = '';
			html += '<tr style="cursor:pointer;">';
				html += '<td data-title="#">';
					var checkedHtml = '<input id="single_slip_'+CustomerSlip.id+'" data-dock-id="'+dock_id+'" class="single_slip" name="single_slip" data-id="'+CustomerSlip.id+'" value="'+CustomerSlip.id+'" checked="checked" type="checkbox">';

					var uncheckedHtml = '<input id="single_slip_'+CustomerSlip.id+'" data-dock-id="'+dock_id+'" class="single_slip" name="single_slip" data-id="'+CustomerSlip.id+'" value="'+CustomerSlip.id+'"  type="checkbox">';

					if(indData.length==0){
						html += checkedHtml;
					}
					else{
						var isuncheck = 0;
						for(var k in indData){
							if(CustomerSlip.id==indData[k]){
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

				html += '<td>';
					html += PartnerSlip.slip_name;
				html += '</td>';

				html += '<td>';
					html += marina_billing.normal(PartnerMeter.meter_name);
				html += '</td>';
				html += '<td>';
					html += marina_billing.normal(PartnerMeter.meter_value);
				html += '</td>';
				html += '<td>';
					html += Customer.customer_name;
				html += '</td>';
			html += '</tr>';
			$('#marina_billing_slip_table').append(html);
		}
		$('.product_checkbox,.group_check,.dock_check,.all_docks,.all_groups,.all_products').uniform();
		$('#dock_slip_table').css({
			"width":"100%"
		});

		var dock = $('#dock_slip_table').dataTable( {
            "oLanguage":nor,
            "sDom": 'rt<"bottom"ilp><"clear">',
            "aoColumnDefs": [{
					'bSortable': false,
					'aTargets': [0]
				}
			]
        });
        $('.dataTables_paginate').click(function(){
        	$('.all_slip,.single_slip').uniform();
        });
        $('#slip_name').off().keypress(function(){
        	 dock.fnFilter($(this).val());
        });

        $('.all_slip,.single_slip').uniform();
        $('#dock_slip_table #all_slip').change(function(){
        	if($('#dock_slip_table #all_slip:checked').length==1){
        		$('.single_slip').attr('checked','checked');
        		$.uniform.update();
        		$('.single_slip').trigger('change');
        	}
        	else{
        		$('.single_slip').removeAttr('checked');
        		$.uniform.update();
        		$('.single_slip').trigger('change');
        	}
        });

        //$('.single_slip').change(function(){
        $('.dock_save').click(function(){
        	$('.single_slip').each(function(){
        		var v = $(this).val();
	        	var dock_id = $(this).attr('data-dock-id');
	        	var data_id = $(this).attr('data-id');
	        	var checkThisArr = 'none';
	        	

	        	if($('#single_slip_'+data_id+':checked').length==1){
	        		for(var j in customer_docks){
		        		var cg = customer_docks[j];
		        		if(cg.dock_id==dock_id){
		        			if(customer_docks[j].slips.length!=0){
			        			for(var k in customer_docks[j].slips){
			        				if(customer_docks[j].slips[k]==data_id){
			        					delete customer_docks[j].slips[k];
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
		        	for(var j in customer_docks){
		        		var cg = customer_docks[j];
		        		if(cg.dock_id==dock_id){
		        			var is_present = 0;
		        			for(var k in customer_docks[j].slips){
		        				
		        				var cgc = customer_docks[j].slips[k];
		        				if(cgc==data_id){
		        					is_present = 1;
		        					break;
		        				}
		        			}
		        			if(is_present==0){
		        				customer_docks[j].slips.push(data_id);
		        			}
		        			break;
		        		}
		        	}
		        }
		        var newArr = [];
		        if(checkThisArr!='none'){
		        	for(var j in customer_docks[checkThisArr].slips){
		        		if(customer_docks[checkThisArr].slips[j]!=''){
		        			newArr.push(customer_docks[checkThisArr].slips[j]);
		        		}
		        	}
		        	customer_docks[checkThisArr].slips = newArr;
		        }

		        if(customer_docks.length!=0){
		        	for(var j in customer_docks){
		        		var cg = customer_docks[j];
		        		var grp_id = cg.dock_id;
		        		var unsel_cust = cg.slips.length;
		        		var origNoCustDock = parseInt($('#orignoOfCustDock_'+grp_id).html());
		        		var sel_cust = origNoCustDock - unsel_cust;
		        		$('#orignoOfCustDock_'+grp_id).hide();
		        		if(sel_cust<0){ 
		        			$('#orignoOfCustDock_'+grp_id).show();
		        		}
		        		else{
		        			$('#noOfCustDock_'+grp_id).text(sel_cust).show();
		        		}
		        	}
		        }
		        else{
		        	$('.noOfCustDock').hide();
		        	$('.origCustDock').show();
		        }
        	});       	
        });
	},
	normal:function(res){
		if(res==null || res==undefined){
			return '-';
		}
		return res;
	},
	generateRef:function(id,data){
		var ret = '';
		ret += '<option value="'+data.email+'##'+id+'">';
			ret += data.name +'&lt;'+data.email+'&gt;';
		ret += '</option>';
		return ret;
	},
	textCounter:function(maxlimit=165){		
		var field = $("#MessageInOwnWords").val();
		var cntfield = $("#remLen2").val();
		
		if (field.length > maxlimit) 
			$("#MessageInOwnWords").val(field.substring(0, maxlimit));
		else
			$("#remLen2").val(maxlimit - field.length);
	},
	addProductLines:function(frm=''){
		if(frm==''){
			if($('#product_lines tbody tr').length==0){
				marina_billing.generateProductLinesHtml();
			}
		}
		else{
			var validate = marina_billing.validateProductLines();
			if(validate){
				marina_billing.generateProductLinesHtml();
			}
		}
		var vat_enabled = global_marina_billing_data.getPartnerCustomSettings.PartnerSetting.vat_required;
			
		if(how_to_price=='manual'){
			$('.default_hide').show();
			if(vat_enabled=='n'){
				$('.tax_hide').hide();
				$('select[name="vat_level"]').val('');
			}
			else{
				$('.tax_hide').show();
			}
		}
		else{
			$('.default_hide').hide();
		}
	},
	generateProductLinesHtml:function(){
		global_linKy++;
		var html = '';
		
		html += '<tr id="product_line_'+global_linKy+'" data-line-key="'+global_linKy+'">';	
			html += '<td>';
				html += '<input type="checkbox" name="product_checkbox" class="product_checkbox product_checkbox_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input type="text" id="product_number_'+global_linKy+'" class="input_color m-wrap span12 product_number product_number_'+global_linKy+'" data-line-key="'+global_linKy+'">';
				html += '<input type="hidden" id="product_id_'+global_linKy+'" class="product_id product_id_'+global_linKy+'" data-line-key="'+global_linKy+'">';
				html += '<input type="hidden" id="product_numberhidden_'+global_linKy+'" class="product_numberhidden product_numberhidden_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input type="text" id="product_name_'+global_linKy+'" class="input_color m-wrap span12 product_name product_name_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input type="text" id="qty_'+global_linKy+'" class="input_color m-wrap span12 qty qty_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td class="default_hide" >';
				html += '<input type="text" id="unit_price_'+global_linKy+'" class="input_color m-wrap text-right span12 unit_price unit_price_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td class="default_hide">';
				html += '<span class="text" id="unit_name_'+global_linKy+'" readonly="readonly">Unit name</span>'
				html += '<input type="hidden" id="unit_'+global_linKy+'" class="input_color m-wrap span12 unit unit_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			var vat_enabled = global_marina_billing_data.getPartnerCustomSettings.PartnerSetting.vat_required;
			var sty = '';
			
			if(vat_enabled=='n'){
				sty='display:none;';
				$('.tax_hide').hide();

			}
			else{
				$('.tax_hide').show();
				if(how_to_price=='default'){
					sty='display:block;';
				}
				else{
					sty='display:none;';
				}
			}

			html += '<td class="default_hide tax_hide">';
				
				html += '<select  name="vat_level" id="vat_level_'+global_linKy+'" class="input_color m-wrap span12" id="vat_level_'+global_linKy+'">';
					html += '<option value="">';
						html += '-';
					html += '</option>';
					for(var j in global_marina_billing_data.getPartnerTaxLevelList){
						var tl = global_marina_billing_data.getPartnerTaxLevelList[j];
						html += '<option value="'+j+'">';
							html += tl;
						html += '</option>';
					}
				html += '</select>';
			html += '</td>';

			html += '<td class="default_hide">';
				html += '<input type="text" id="discount_amount_'+global_linKy+'" class="input_color m-wrap span12 discount_amount discount_amount_'+global_linKy+'" data-line-key="'+global_linKy+'">';
				html += '<input type="hidden" id="discount_'+global_linKy+'" class="input_color m-wrap span12 discount_amount discount_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td class="default_hide" >';
				html += '<input readonly="readonly" type="text" id="gross_amount_'+global_linKy+'" class="m-wrap span12 gross_amount gross_amount_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';
		html += '</tr>';
		$('#product_lines tbody').append(html);
		if(how_to_price=='manual'){
			$('.default_hide').hide();

			if(vat_enabled=='n'){
				$('.tax_hide').hide();
				$('select[name="vat_level"]').val('');
			}
			else{
				$('.tax_hide').show();
			}
		}
		else{
			$('.default_hide').show();
		}
		
		marina_billing.bindProductLines();
	},
	removeProductLines:function(){
		var yes = function(){
			$('.product_checkbox:checked').each(function(){
				var a = $(this).attr('data-line-key');
				$('#product_line_'+a).remove();
				
			});
			if($('#product_lines tbody tr').length==0){
				marina_billing.addProductLines();
			}
			$('.all_products').prop('checked',false); 
			$.uniform.update();
			$('.all_products').trigger('change');
		};
		var no = function(){
		}
		showDeleteMessage(global_marina_billing_translationsData.Areyousureyouwouldliketodeleteselectedproductline+'?',global_marina_billing_translationsData.Confirmation,yes,no,'ui-dialog-blue',global_marina_billing_translationsData.Delete,global_marina_billing_translationsData.Cancel);	
	},
	bindProductLines:function(){
		marina_billing.autoCompleteProductLines();
		$('.product_checkbox,.group_check,.dock_check,.all_docks,.all_groups,.all_products').uniform();
		$('.product_checkbox').change(function(){
			var l = $('.product_checkbox:checked').length;
			if(l>0){
				$('#marina_billing_btn_delete').show();
				$('#marina_billing_btn_new').hide();
			}
			else{
				$('#marina_billing_btn_delete').hide();
				$('#marina_billing_btn_new').show();
			}
		});
	},
	autoCompleteProductLines:function(){
		var TABKEY = 9;
		var availableTags =  global_marina_billing_data.productData;

		$('#product_lines #product_number_'+global_linKy).autocomplete({
			minLength: 1,
			source: availableTags,
			select: function( event, data ) {
				var line_id = $(this).attr('data-line-key');
			
				$('#product_id_'+line_id).val(data.item.id);
				
				marina_billing.getAutoFillProductLines(data.item.id,line_id);
			}
		});
	},
	getAutoFillProductLines:function(id,line_id){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			product_id:id,
		}
		showProcessingImage('undefined');
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/products/getProductLines.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				marina_billing.autoFillProductLines(complet_data.response.response,line_id);

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	autoFillProductLines:function(product_data,line_id){
	
		var  product = product_data.ProductData.Product;
		var  productUnit = product_data.ProductData.ProductUnit;
		var  productPrice = product_data.ProductData.ProductPrice;

	
		$('#product_numberhidden_'+line_id).val(product.product_number);
		$('#product_number_'+line_id).val(product.product_number);
		$('#product_name_'+line_id).val(product.product_name);

		if(how_to_price=='default'){
			$('#qty_'+line_id).val(changeSiteNumberFormat(parseInt(product.quantity)));			
			$('#unit_price_'+line_id).val(productPrice.price).limitAmountPrice(8);
			$('#discount_amount_'+line_id).val(changeSiteNumberFormat(parseInt(product.discount))).limitAmountPrice(8);
			$('#gross_amount_'+line_id).val(changeSiteNumberFormat(parseInt(product.total_amount)));
		}
		else{
			$('#qty_'+line_id).val(changeSiteNumberFormat(0));			
			$('#unit_price_'+line_id).val(0).limitAmountPrice(changeSiteNumberFormat(0));
			$('#discount_amount_'+line_id).val(changeSiteNumberFormat(0)).limitAmountPrice(8);
			$('#gross_amount_'+line_id).val(changeSiteNumberFormat(0));
		}
		$('#discount_amount_'+line_id).calculateDiscount(line_id);

		$('#unit_'+line_id).val(product.product_unit_id);
		$('#unit_name_'+line_id).html(productUnit.unit_name);

		$('#qty_'+line_id+',#unit_price_'+line_id+',#discount_amount_'+line_id+',#vat_level_'+line_id).change(function(){
			marina_billing.calLineTotal(line_id);
		});
		if(how_to_price=='default'){
			if(product.line_vat!=0){
				$('#vat_level_'+line_id).val(productPrice.vat_level	);
			}
		}

		limitBundlePrice('#qty_'+line_id,6);	

		limitPrice('#unit_price_'+line_id,9);
	},
	calLineTotal:function(lk=''){
		var arr= [];
		if(lk==''){
			$('#product_lines tbody tr').each(function(){
				var lkk = $(this).attr('data-line-key');
				arr.push(lkk);
			});
		}
		else{
			arr.push(lk);
		}
		for(j in arr){
			var line_key = arr[j];
			var unit_price_val = $('#unit_price_'+line_key).val();
			unit_price_val = convertIntoStandardFormat(unit_price_val.trim());

			var discount_amount_val = $('#discount_amount_'+line_key).val();
			discount_amount_val = parseFloat(convertIntoStandardFormat(discount_amount_val.trim()));

			var qty = $('#qty_'+line_key).val();
			qty = parseFloat(qty);

			var percentage = $("#vat_level_"+line_key+" option:selected").text();
			percentage = percentage.trim();
			if(!IsNumeric(percentage) || percentage == '-'){
				percentage = '0';
			}
			percentage = parseFloat(percentage);
			total_amount = roundNumber((parseFloat(unit_price_val) * parseFloat(qty)));

			var tax = 0;
			var dis_total = total_amount - discount_amount_val;
			var vat_enabled = global_marina_billing_data.getPartnerCustomSettings.PartnerSetting.vat_required;
			if(vat_enabled=='y'){
				 tax = roundNumber((parseFloat(dis_total) * parseInt(percentage))/ 100);
			}


			if(discount_amount_val > total_amount){
				alert('nomorediscount');
			}
			else{
				total_amount = roundNumber(parseFloat(total_amount) - parseFloat(discount_amount_val) + parseFloat(tax));
				$('#gross_amount_'+line_key).val(convertIntoLocalFormat(roundNumber(total_amount)));
			}
		}
		if(lk!=''){
			var res = {
				total_amount:total_amount,
				gross_amount:dis_total,
				tax:tax
			}
			return res;
		}	
	},
	validateProductLines:function(){
		var arr= [];
		$('#product_lines tbody tr').each(function(){
			var lkk = $(this).attr('data-line-key');
			arr.push(lkk);
		});
		var c = 1;
		var errmsg = '';
		var product_lines = [];
		var frl = global_marina_billing_translationsData.forlinenumber;
		for(var j in arr){
			var line_id = arr[j];
			var obj = {};
			var pr_id = $('#product_id_'+line_id).val();
			var pr_no =  $('#product_numberhidden_'+line_id).val();


			if(pr_id=='' || pr_id==undefined || pr_id==null){
				errmsg += global_marina_billing_translationsData.Product+' '+frl+' '+c+'<br/>';
			}
			else{
				var qty = convertIntoStandardFormat($('#qty_'+line_id).val());
				if(qty=='' || qty==undefined || qty==null || qty==0){
					errmsg += global_marina_billing_translationsData.Quantity+' '+frl+' '+c+'<br/>';
				}
				
				var unit_price = convertIntoStandardFormat($('#unit_price_'+line_id).val());
				if(how_to_price=='manual'){
					if(unit_price=='' || unit_price==undefined || unit_price==null || unit_price==0){
						errmsg += global_marina_billing_translationsData.UnitPrice+' '+frl+' '+c+'<br/>';
					}
				}
			}
			var pr_name = $('#product_name_'+line_id).val().trim();
			
			var unit_id = $('#unit_'+line_id).val().trim();
			var unit_price = $('#unit_price_'+line_id).val().trim();
			
			if(unit_price!='' && unit_price!=undefined && unit_price!=null){
				unit_price = convertIntoStandardFormat(unit_price);
			}
			else{
				unit_price = 0;
			}

			var discount =  $('#discount_amount_'+line_id).val().trim();
			if(discount!='' && discount!=undefined && discount!=null){
				discount = convertIntoStandardFormat(discount);
			}
			else{
				discount = 0;
			}

			var qty = $('#qty_'+line_id).val();
			if(qty!='' && qty!=undefined && qty!=null){
				qty = convertIntoStandardFormat(qty);
			}
			else{
				qty = 0;
			}
			var vat_level = $('#vat_level_'+line_id).val();

			var a = marina_billing.calLineTotal(line_id);

			var vat = a.tax;

			var gross_amount =  $('#gross_amount_'+line_id).val();

			if(gross_amount!='' && gross_amount!=undefined && gross_amount!=null){
				gross_amount = convertIntoStandardFormat(gross_amount);
			}
			else{
				gross_amount = 0;
			}

			obj = {
				product_id:pr_id,
				product_number:pr_no,
				product_name:pr_name,
				unit_id:unit_id,
				unit_price:unit_price,
				discount: discount,
				partner_tax_level_id: vat_level,
				qty: qty,
				vat:vat ,
				gross_amount: gross_amount,
			}
			product_lines.push(obj);
			c++;
		}
		
		if(errmsg!=''){
			var finalerrmsg = global_marina_billing_translationsData.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,global_marina_billing_translationsData.error,global_marina_billing_translationsData.AlertMessage);
			return false;
		}
		return product_lines;
	},
	calNoCust:function(){
		var dockcust= $('#dockcust').val();
		var total_customers = 0;
		if(dockcust=='groups'){

			for(var j in customer_groups){
				var cg = customer_groups[j];
				if(cg.customers.length==0){
					var c = parseInt($('#orignoOfCust_'+cg.group_id).html());
					total_customers = total_customers + c;

				}
				else{
					var c = parseInt($('#noOfCust_'+cg.group_id).html());
					total_customers = total_customers + c;
				}
			}
			
		}
		else{
			for(var j in customer_docks){
				var cd = customer_docks[j];
				if(cd.slips.length==0){
					var c = parseInt($('#orignoOfCustDock_'+cd.dock_id).html());
					total_customers = total_customers + c;

				}
				else{
					var c = parseInt($('#noOfCustDock_'+cd.dock_id).html());
					total_customers = total_customers + c;
				}
			}
			
		}
		return total_customers;
	},
	saveData:function(document_status){

		var plines =[];
		var product_lines = [];
		if(add_prod=='yes'){
			plines = marina_billing.validateProductLines();
			if(!plines){
				return false;
			}
			
			//plines = JSON.stringify(plines);
			product_lines =  JSON.stringify({product_lines:plines});
		}
		if(document_status==1 && $('#form_wizard_1').bootstrapWizard('currentIndex')==2){
			w.bootstrapWizard('next');
			return false;
		}
		if(product_lines.length==0){
			product_lines = '';
		}
		var dockcust= $('#dockcust').val();
		var our_ref= $('#our_ref').val();
		var our_ref_val=''
		if(our_ref!='' && our_ref!=undefined && our_ref!=null){
			our_ref = our_ref.split('##');
			our_ref_val = our_ref[1]
		}
		var partner_directory = global_marina_billing_data.getPartnerCustomSettings.PartnerSetting.directory;
		if(partner_directory==undefined || partner_directory==null){
			partner_directory = '';
		}

		var bill_once = 'yes';
		if($('#billonce:checked').length==0){
			bill_once = 'yes';
		}
		else{
			bill_once = 'no';
		}
		var total_params = {
			token:token,
			admin_id:admin_id,
			partner_id:partner_id,
			login_id:login_id,
			description:$('#MessageInOwnWords').val(),
			our_ref:our_ref_val,
			sales_date:moment($('#sales_date').datepicker("getDate")).format('YYYY-MM-DD'),
			due_date:moment($('#due_date').datepicker("getDate")).format('YYYY-MM-DD'),
			products:product_lines,
			partner_directory:partner_directory,
			document_status:document_status,
			bill_once:bill_once,
			lang:lang,
			language:language,
			how_to_price:how_to_price
		}

		if(dockcust=='groups'){
			var group_id_arr = '';
			var customer_id_arr = '';
			for(var j in customer_groups){
				group_id_arr = group_id_arr + customer_groups[j].group_id+',';
				for(var k in customer_groups[j].customers){
					customer_id_arr = customer_id_arr + customer_groups[j].customers[k] +',';
				}
			}
			group_id_arr = group_id_arr.substring(0, group_id_arr.length -1);
			if(customer_id_arr!=''){
				customer_id_arr = customer_id_arr.substring(0, customer_id_arr.length -1);
			}

			total_params.customer_groups = group_id_arr;
			total_params.customer_ids = customer_id_arr;
			total_params.dock_groups = '';
			total_params.slip_ids = '';
				
		}
		else{
	
			var dock_id_arr = '';
			var slip_id_arr = '';
			for(var j in customer_docks){
				dock_id_arr = dock_id_arr + customer_docks[j].dock_id+',';
				for(var k in customer_docks[j].slips){
					slip_id_arr = slip_id_arr + customer_docks[j].slips[k] +',';
				}
			}
			dock_id_arr = dock_id_arr.substring(0, dock_id_arr.length -1);
			if(slip_id_arr!=''){
				slip_id_arr = slip_id_arr.substring(0, slip_id_arr.length -1);
			}
		
			total_params.customer_groups = '';
			total_params.customer_ids ='';
			total_params.dock_groups = dock_id_arr;
			total_params.slip_ids = slip_id_arr;
		}
		showProcessingImage('undefined');

		var params = $.extend({}, doAjax_params_default);
		//params['url'] = APISERVER+'/api/partners/saveMarinaBillingBatch.json';
		params['url'] = APISERVER+'/api/MarinaBillingBatches/add.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			//hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				
				var batch_id = complet_data.response.response.inserted_id;
				var suc = global_marina_billing_translationsData.success;
					var succ = global_marina_billing_translationsData.Success;
					var erro = global_marina_billing_translationsData.Error;
					var er = complet_data.response.response.res;
					if(er.error!=0){
						if(er.error>0){
							call_toastr('error',erro,global_marina_billing_translationsData.Errorin+'&nbsp;'+er.error+'&nbsp;'+global_marina_billing_translationsData.record);
						}
						else{
							call_toastr('error',erro,global_marina_billing_translationsData.Errorin+'&nbsp;'+1+'&nbsp;'+global_marina_billing_translationsData.records);
						}
						
					}
				if(document_status==0){			
					if(er.inserted>0){
						call_toastr(global_marina_billing_translationsData.success, global_marina_billing_translationsData.Success,global_marina_billing_translationsData.Processed+' ('+er.inserted+') '+global_marina_billing_translationsData.record);
					}
					else{
						call_toastr(global_marina_billing_translationsData.success, global_marina_billing_translationsData.Success,global_marina_billing_translationsData.Processed+' ('+er.inserted+') '+global_marina_billing_translationsData.records);
					}
					
					new_custom_main_page('/'+type+'/marina/billing','marina_menu_full','marina_billing','marina_billing');
					return;
					
				}
				else{
					call_toastr(global_marina_billing_translationsData.success, global_marina_billing_translationsData.Success,global_marina_billing_translationsData.Yourinvoicehasnowbeendistributedtotheselectedrecipients+' ('+er.inserted+')');
						hideProcessingImage();
						$('#btn_back,#btn_screate_invoice,#btn_rev_create_invoice').hide();
						$('#start-again').show().click(function(){
							new_custom_main_page('/'+type+'/marina/marina_billing','marina_menu_full','marina_billing','marina_billing',{batch_id:batch_id});
						});

						$('.div_msg_sent').show()
											return;
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_marina_billing_translationsData.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;		
	},
	getSummary:function(){
		$('.dis_billing').click(function(){
		
			marina_billing.discardBilling();
		});
		$('.send_billing').click(function(){
			
			marina_billing.approveBilling();
		});

		$('#customer_group_reached,#btn_continue').hide();
		
		$('.send_billing,.dis_billing,.marina_review,#expcol').show();
		w.bootstrapWizard('last');
		$('.step-title', $('#form_wizard_1')).text('Step ' + (4) + ' of ' + 4);
		marina_billing.generateReviewData(global_marina_billing_data.pending_data.invoice_data);
		
	},
	generateReviewData:function(invoice_data){
		$('#tbl_marina_billing tbody').html('');
		if(invoice_data.length==0){
			new_custom_main_page('/'+type+'/marina/billing','marina_menu_full','marina_billing','marina_billing');
			return;
		}
		else{
			$('.loader').hide();
			$('.reviewdata').show();		
		}
		for(var j in invoice_data){
			var cust_data = invoice_data[j][0];
			var inv_data = JSON.parse(invoice_data[j]['m'].invoice_data);
			
			var html = '';
			html += '<tr>';

				html +='<td>';
					html +='<div class="iconplus plusminus" onclick="marina_billing.open_dock('+j+');" id="open_dock_'+j+'">&nbsp;</div>';
				html +='</td>';


				html += '<td>';
					html += cust_data.customer_name;
				html += '</td>';

				html += '<td>';
					html += cust_data.customer_number;
				html += '</td>';

				html += '<td>';
					html += cust_data.customer_group;
				html += '</td>';

				html += '<td id="total_'+j+'">';
					html += '0,00';
				html += '</td>';

			html += '</td>';

			html += '<tr style="display: none" id="open_slip_'+j+'" class="open_slip">';
				html += '<td colspan="5">';
					html += '<div class="innerrows">';
						html +='<table class="table table-striped table-bordered table-hover" style="border:solid 1px #DDDDDD">';
							html +='<thead><tr>';

								html +='<th style="padding:2px !important">';
									html += gbl_trnsdata.Productname;
								html +='</th>';

								// html +='<th style="padding:2px !important">';
								// 	html += gbl_trnsdata.Description;
								// html +='</th>';

								html +='<th style="padding:2px !important">';
									html += gbl_trnsdata.Quantity;
								html +='</th>';

								html +='<th style="padding:2px !important">';
									html += gbl_trnsdata.Unit;
								html +='</th>';

								html +='<th style="padding:2px !important">';
									html += gbl_trnsdata.UnitPrice+'&nbsp;('+CUR_SYM+')';
								html +='</th>';
								if(vat_required=='y'){
									html +='<th style="padding:2px !important">';
										html += gbl_trnsdata.MVA+'&nbsp;(%)';
									html +='</th>';
								}

								// html +='<th style="padding:2px !important">';
								// 	html += gbl_trnsdata.Discount+'&nbsp;('+CUR_SYM+')';
								// html +='</th>';

								html +='<th style="padding:2px !important">';
									html += gbl_trnsdata.Totalprice+'&nbsp;';
								html +='</th>';


							html +='</tr>';


							var ttlprice = 0;
							for(var k in inv_data){
								if(k=='product_lines'){
									var inv_prlines = inv_data[k];
									for(var l in inv_prlines){
										var ld = inv_prlines[l];
										html +='<tr>';

											html +='<td>';
												html += ld.product_name;
											html +='</td>';

											// html +='<td>';
											// 	html +=ld.product_name;
											// html +='</td>';

											html +='<td>';
												html += convertIntoLocalFormat(checkNull(ld.qty,0));
											html +='</td>';

											html +='<td>';
												html += getProductUnitList[ld.unit_id];
											html +='</td>';

											html +='<td>';
												html += convertIntoLocalFormat(checkNull(ld.unit_price,0));
											html +='</td>';

											if(vat_required=='y'){
												html +='<td>'; 
													html += checkNull(getGlblPartnerTaxLevelList[ld.partner_tax_level_id]);
												html +='</td>';
											}

											// html +='<td>';
											// 	html +=convertIntoLocalFormat(checkNull(ld.discount,0));
											// html +='</td>';
											ttlprice = parseFloat(ttlprice) + parseFloat(ld.gross_amount);
											html +='<td>';
												html +=convertIntoLocalFormat(checkNull(ld.gross_amount,0));
											html +='</td>';
										html +='</tr>';
									}
								}
							}
							var tprice = convertIntoLocalFormat(checkNull(ttlprice,0));
						
							
						html +='</thead></table>';
					html += '</div>';
				html += '</td>';
			html += '</tr>';


			$('#tbl_marina_billing tbody').append(html);
			$('#total_'+j).html(tprice);
		}
	},
	generateSummary:function(){
		var total_customers = marina_billing.calNoCust();
		var html = '';
		html += '<tr>';
			html += '<td data-title="'+global_marina_billing_translationsData.Description+'">';
				html += '<span id="info_customer_reached" data-placement="top" data-original-title="" title="">&nbsp;';
					html += global_marina_billing_translationsData.Numberofinvoicerecipients;
				html += '&nbsp;<i class="icon-question-sign"></i>';
				html += '</span>';
			html += '</td>';

			html += '<td data-title="'+global_marina_billing_translationsData.Quantity+'">';
				html += total_customers;
			html += '</td>';
		html += '</tr>';

		html += '<tr>';
			html += '<td>';
				html += global_marina_billing_translationsData.Selectionbasedon;
			html += '</td>';

			html += '<td>';
				if($('#dockcust').val()=='docks'){
					html += global_marina_billing_translationsData.Docks;
				}
				else{
					html += global_marina_billing_translationsData.Customergroups;
				}
				
			html += '</td>';
		html += '</tr>';

		$('#customer_group_reached tbody').html(html);
		$("#info_customer_reached").hover(function () {
			$(this).popover({
				title: global_marina_billing_translationsData.Numberofinvoicerecipients,        
				content: global_marina_billing_translationsData.Thenumberofinvoicesent,
				html: true
			}).popover('show');
		}, function () {
			$(this).popover('hide');
		});		
	},
	showTab:function(which){

		if(which=='tab_2_customers'){
			if(customer_docks.length!=0){
				var msg = global_marina_billing_translationsData.Onlyoneofcustomergroupsordockscanbeselected+'.';
				msg += ' '+global_marina_billing_translationsData.Pleaseremovealldockstoselectcustomergroups+'.';
				
				showAlertMessage(msg,'error',global_marina_billing_translationsData.alertmessage);
				return;
			}
			$('#tab_1_docks,.showtab_docks').removeClass('active');
			$('.showtab_customers,#tab_2_customers').addClass('active');
			$('#dockcust').val('groups').trigger('change');
		}
		else{
			if(customer_groups.length!=0){
				
				var msg = global_marina_billing_translationsData.Onlyoneofcustomergroupsordockscanbeselected+'.';
				 msg += ' '+global_marina_billing_translationsData.Pleaseremoveallcustomergroupstoselectdocks+'.';
				showAlertMessage(msg,'error',global_marina_billing_translationsData.alertmessage);
				return;
			}
			$('#tab_2_customers,.showtab_customers').removeClass('active');
			$('.showtab_docks,#tab_1_docks').addClass('active');
			$('#dockcust').val('docks').trigger('change');
		}		
	},
	expcol:function(){
		if($('#expcol i').hasClass('icon-plus')){
			$('.plusminus').removeClass('iconplus').addClass('iconminus');
			$('.open_slip').show();
		}
		else{
			$('.plusminus').removeClass('iconminus').addClass('iconplus');
			$('.open_slip').hide();
		}
		if($('.iconminus').length!=0){
			$('#expcol span').html(gbl_trnsdata.Collapseall);
			$('#expcol i').removeClass('icon-plus').addClass('icon-minus');
		}
		if($('.iconplus').length!=0){
			$('#expcol span').html(gbl_trnsdata.Expandall);
			$('#expcol i').removeClass('icon-minus').addClass('icon-plus');
		}
		
	},
	open_dock:function(dock_id){
		if($("#open_dock_"+dock_id).attr('class').indexOf('iconplus') !== -1){		
			$("#open_dock_"+dock_id).removeClass('iconplus').addClass('iconminus');
			$("#open_slip_"+dock_id).show();			
		}
		else{
			$("#open_dock_"+dock_id).removeClass('iconminus').addClass('iconplus');
			$("#open_slip_"+dock_id).hide();
		}
		if($('.iconminus').length!=0){
			$('#expcol span').html(gbl_trnsdata.Collapseall);
			$('#expcol i').removeClass('icon-plus').addClass('icon-minus');
		}
		if($('.iconplus').length!=0){
			$('#expcol span').html(gbl_trnsdata.Expandall);
			$('#expcol i').removeClass('icon-minus').addClass('icon-plus');
		}

	},
	discardBilling:function(){
		showProcessingImage('undefined');
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};
		if(batch_id!=''  && batch_id!=null && batch_id!=undefined){
			total_params.batch_id = batch_id;
		}
		var params = $.extend({}, doAjax_params_default);

		params['url'] = APISERVER+'/api/MarinaBillingBatches/discardBilling.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr(gbl_trnsdata.success, gbl_trnsdata.Success,gbl_trnsdata.Marinabillingdeletedsuccessfully);
				
				new_custom_main_page('/'+type+'/marina/billing','marina_menu_full','marina_billing','marina_billing');
					return;
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
	approveBilling:function(){
		showProcessingImage('undefined');
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};
	
		if(batch_id!=''  && batch_id!=null && batch_id!=undefined){
			total_params.batch_id = batch_id;
		}

		var params = $.extend({}, doAjax_params_default);

		params['url'] = APISERVER+'/api/MarinaBillingBatches/approveBilling.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				call_toastr(gbl_trnsdata.success, gbl_trnsdata.Success,gbl_trnsdata.Marinabillingsentsuccessfully);
		
				new_custom_main_page('/'+type+'/marina/billing','marina_menu_full','marina_billing','marina_billing');
					return;
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
	getPaginateData:function(frm){
		var page = parseInt($('#page').val());
		
		if(frm=='next'){
			var pg = page + 1;
			$('#page').val(pg);
		
			marina_billing.getInvoiceData(pg);
		}
		else if(frm=='prev'){
			if(page!=1){
				var pg = page - 1;
				$('#page').val(pg);
				marina_billing.getInvoiceData(pg);
				
			}
			
		}
	},
	getInvoiceData:function(page){
		showProcessingImage('undefined');
		var month = moment().month();
		month = month + 1;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			page:page
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getReviewPendingMarinaBill.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var inv_data = complet_data.response.response.invoice_data;	
				if(inv_data.length==0){
					$('#tbl_marina_billing tbody').html('<tr><td colspan="3">'+gbl_trnsdata.Nodatafound+'</td></tr>');
				}
				else{
					marina_billing.generateReviewData(inv_data);
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
		doAjax(params);
		
		return;
	},
};

Template7.registerHelper('CustomerGroupListHelper', function (data){
	return marina_billing.generateCustomerGroupRows(data);
});

Template7.registerHelper('DockListHelper', function (data){
	return marina_billing.generateDockRows(data);
});

Template7.registerHelper('OurRefHelper', function (id,data){
	return marina_billing.generateRef(id,data);
});


(function( $ ){
   	$.fn.calculateDiscount= function(line_key) {
	    $(this).blur(function (event) {
	    	var unit_price = $('#unit_price_'+line_key).val();
	    	unit_price = convertIntoStandardFormat(unit_price.trim());
	    	if(!IsNumeric(unit_price)){
				unit_price = '0';
			}

			unit_price = parseFloat(unit_price);
			var qty = $('#qty_'+line_key).val();
			qty = parseFloat(qty);
			qty = Math.abs(qty);
			

			total_amount = parseInt(qty)*parseFloat(unit_price);

			var discount_amount = $('#discount_amount_'+line_key).val();
			discount_amount = convertIntoStandardFormat(discount_amount.trim());
			if(!IsNumeric(discount_amount)){
				discount_amount = '0';
			}
			discount_amount = parseFloat(discount_amount); 
			$('#discount_amount_'+line_key).val(convertIntoLocalFormat(roundNumber(discount_amount)));

			discount_percentage =  (parseFloat(discount_amount)/parseFloat(total_amount))*parseFloat(100);
			$('#discount_'+line_key).val(convertIntoLocalFormat(roundNumber(discount_percentage)));

		});
   }; 
})( jQuery );


(function($) {
	var bootstrapWizardCreate = function(element, options) {
		var element = $(element);
		var obj = this;

		// Merge options with defaults
		//var $settings = $.extend($.fn.bootstrapWizard.defaults, options || {});
		var $settings = $.extend({}, $.fn.bootstrapWizard.defaults, options);
		var $activeTab = null;
		var $navigation = null;

		this.fixNavigationButtons = function() {
			// Get the current active tab
			if(!$activeTab.length) {
				// Select first one
				$navigation.find('a:first').tab('show');
				$activeTab = $navigation.find('li:first');
			}

			// See if we're currently in the first/last then disable the previous and last buttons
			if(obj.firstIndex() >= obj.currentIndex()) {
				$('li.previous', element).addClass('disabled');
			} else{
				$('li.previous', element).removeClass('disabled');
			}

			if(obj.currentIndex() >= obj.navigationLength()) {
				$('li.next', element).addClass('disabled');
			} else {
				$('li.next', element).removeClass('disabled');
			}

			if($settings.onTabShow && typeof $settings.onTabShow === 'function' && $settings.onTabShow($activeTab, $navigation, obj.currentIndex())===false){
				return false;
			}
		};

		this.next = function(e) {

			// If we clicked the last then dont activate this
			if(element.hasClass('last')) {
				return false;
			}


			if($settings.beforeNext && typeof $settings.beforeNext === 'function' && $settings.beforeNext($activeTab, $navigation, obj.nextIndex())===false){
				return false;
			}
			if($settings.onNext && typeof $settings.onNext === 'function' && $settings.onNext($activeTab, $navigation, obj.nextIndex())===false){
				return false;
			}
			

			// Did we click the last button
			$index = obj.nextIndex();
			if($index > obj.navigationLength()) {
			} else {
				$navigation.find('li:eq('+$index+') a').tab('show');
			}
		};

		this.previous = function(e) {

			// If we clicked the first then dont activate this
			if(element.hasClass('first')) {
				return false;
			}

			if($settings.beforePrevious && typeof $settings.beforePrevious === 'function' && $settings.beforePrevious($activeTab, $navigation, obj.previousIndex())===false){
				return false;
			}

			if($settings.onPrevious && typeof $settings.onPrevious === 'function' && $settings.onPrevious($activeTab, $navigation, obj.previousIndex())===false){
				return false;
			}

			$index = obj.previousIndex();
			if($index < 0) {
			} else {
				$navigation.find('li:eq('+$index+') a').tab('show');
			}
		};

		this.first = function(e) {
			if($settings.onFirst && typeof $settings.onFirst === 'function' && $settings.onFirst($activeTab, $navigation, obj.firstIndex())===false){
				return false;
			}

			// If the element is disabled then we won't do anything
			if(element.hasClass('disabled')) {
				return false;
			}
			$navigation.find('li:eq(0) a').tab('show');

		};
		this.last = function(e) {
			if($settings.onLast && typeof $settings.onLast === 'function' && $settings.onLast($activeTab, $navigation, obj.lastIndex())===false){
				return false;
			}

			// If the element is disabled then we won't do anything
			if(element.hasClass('disabled')) {
				return false;
			}
			$navigation.find('li:eq('+obj.navigationLength()+') a').tab('show');
		};
		this.currentIndex = function() {
			return $navigation.find('li').index($activeTab);
		};
		this.firstIndex = function() {
			return 0;
		};
		this.lastIndex = function() {
			return obj.navigationLength();
		};
		this.getIndex = function(e) {
			return $navigation.find('li').index(e);
		};
		this.nextIndex = function() {
			return $navigation.find('li').index($activeTab) + 1;
		};
		this.previousIndex = function() {
			return $navigation.find('li').index($activeTab) - 1;
		};
		this.navigationLength = function() {
			return $navigation.find('li').length - 1;
		};
		this.activeTab = function() {
			return $activeTab;
		};
		this.nextTab = function() {
			return $navigation.find('li:eq('+(obj.currentIndex()+1)+')').length ? $navigation.find('li:eq('+(obj.currentIndex()+1)+')') : null;
		};
		this.previousTab = function() {
			if(obj.currentIndex() <= 0) {
				return null;
			}
			return $navigation.find('li:eq('+parseInt(obj.currentIndex()-1)+')');
		};
		this.show = function(index) {
			return element.find('li:eq(' + index + ') a').tab('show');
		};

		$navigation = element.find('ul:first', element);
		$activeTab = $navigation.find('li.active', element);

		if(!$navigation.hasClass($settings.tabClass)) {
			$navigation.addClass($settings.tabClass);
		}

		// Load onInit
		if($settings.onInit && typeof $settings.onInit === 'function'){
			$settings.onInit($activeTab, $navigation, 0);
		}

		// Next/Previous events
		$($settings.nextSelector, element).bind('click', obj.next);
		$($settings.previousSelector, element).bind('click', obj.previous);
		$($settings.lastSelector, element).bind('click', obj.last);
		$($settings.firstSelector, element).bind('click', obj.first);

		// Load onShow
		if($settings.onShow && typeof $settings.onShow === 'function'){
			$settings.onShow($activeTab, $navigation, obj.nextIndex());
		}

		// Work the next/previous buttons
		obj.fixNavigationButtons();

		$('a[data-toggle="tab"]', element).on('click', function (e) {
			if($settings.onTabClick && typeof $settings.onTabClick === 'function' && $settings.onTabClick($activeTab, $navigation, obj.currentIndex())===false){
				return false;
			}
		});

		$('a[data-toggle="tab"]', element).on('show', function (e) {
			$element = $(e.target).parent();
			// If it's disabled then do not change
			if($element.hasClass('disabled')) {
				return false;
			}

			$activeTab = $element; // activated tab
			obj.fixNavigationButtons();

		});
	};
	$.fn.bootstrapWizard = function(options) {
		//expose methods
		if (typeof options == 'string') {
			var args = Array.prototype.slice.call(arguments, 1).toString();
			return this.data('bootstrapWizard')[options](args);
		}
		return this.each(function(index){
			var element = $(this);
			// Return early if this element already has a plugin instance
			if (element.data('bootstrapWizard')) return;
			// pass options to plugin constructor
			var wizard = new bootstrapWizardCreate(element, options);
			// Store plugin object in this element's data
			element.data('bootstrapWizard', wizard);
		});
	};

	// expose options
	$.fn.bootstrapWizard.defaults = {
		'tabClass':         'nav nav-pills',
		'nextSelector':     '.wizard li.next',
		'previousSelector': '.wizard li.previous',
		'firstSelector':    '.wizard li.first',
		'lastSelector':     '.wizard li.last',
		'onShow':           null,
		'onInit':           null,
		'onNext':           null,
		'onPrevious':       null,
		'onLast':           null,
		'onFirst':          null,
		'onTabClick':       null,
		'onTabShow':        null
	};
})(jQuery);



