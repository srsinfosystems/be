var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();

var gbl_tab_id;
var gbl_data;
var gbl_td;
var gbl_meta;
var gbl_sls_err = '';
var isAjaxComp = 0;
var cust_notes_t;
var int_not;
var sales_contact_ids = [];
var seti;
var created = 0;
var customer_custom_fields = {
	start:function(tab_id,meta){
		if($.isEmptyObject(meta)){
			return;
		}
		gbl_tab_id = tab_id;
		gbl_meta = meta;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:gbl_meta.customer_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['alert message','General sales properties','Value','Name','Payment terms','Credit days','Reminders','Preferred distribution','Sales document recipients','Add more entries','Recipient','Quote','Order','Invoice','Action','Newsletters and updates','Email','SMS','Yes','No','Custom fields','Empty','This field is required','Success','Enter valid number','Send reminders','Do not send reminders','Sales properties updated successfully','Newsletters and updates updated successfully','$your_ref','Warning','Delete','Cancel','$your_ref_delete','Show on card','Save card fields','Card setting updated successfully','Select','Sales and communication','Newsletters and updates','Unsubscribed','Via email','Via SMS','Via email and sms','$cust_card_fields','$max_five','Enter valid email address','Customer and price group','Sales and properties','Property','Save','$check','$no_news','$via_email','$via_sms','$via_sms_and_email','Log date','Description','View','records','of','Found total','Add note','$note_empty','$del_note','Sales and communications','No record found','Notes','Price group','Alternate distribution','None','Default','Payment reminders'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerOtherInfo.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				gbl_data = complet_data.response.response;
				gbl_td = complet_data.response.response.translationsData;
				customer_custom_fields.getNotes();
				customer_custom_fields.getCustContLstWthotDfaltCont();
				customer_custom_fields.createHtml(complet_data.response.response);

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
					return;
				}	
			}
		}
		created = 0;
		doAjax(params);
		
		
		return;
	},
	createHtml:function(){
		gbl_data.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('customer_custom_fields_template').innerHTML;
		gbl_data.PartnerCustomerGroupLength = cust_det_dt.PartnerCustomerGroup.length;
		var compiledRendered = Template7(template, gbl_data);
		document.getElementById(gbl_tab_id).innerHTML = compiledRendered;
		created = 1;
		customer_custom_fields.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		customer_custom_fields.generateCustomFields();
		customer_custom_fields.generateSalesDocument();
		customer_custom_fields.makePaymentEditable();

		var ele = document.createElement('div');
		$(ele).html(gbl_td.Sendreminders);
		var a = $(ele).html();
		$(ele).html(gbl_td.Donotsendreminders);
		var b = $(ele).html();

		var opts = [
			{value:0,text:a},
			{value:1,text:b},
		];

		$("#do_not_send_reminders").editable({
	       	value: checkNull(gbl_data.customerData.Customer.do_not_send_reminders,0),  
	       	mode:'inline',  
	       	type: 'select2',
	        source:opts,
	        select2: {
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	var params = {
	        		'from':'do_not_send_reminders',
	    			'do_not_send_reminders':config
	    		};
	        	customer_custom_fields.saveSalesProperties(params);
	   		},
		});
		var default_distribution = gbl_data.default_distribution;

		if(checkNull(gbl_data.customerData.Customer.default_distribution)!=''){
			default_distribution = gbl_data.customerData.Customer.default_distribution;
		}
		
		var doc_methods = JSON.parse(gbl_data.documentMethod);
		var opts = [];
		var alternate_opts = [];
		var print_opts = [];
		var print_data = gbl_data.print_data;
		for(var j in doc_methods){
			var d = doc_methods[j];

			for(var k in print_data){
				var pd = print_data[k]['PrintQueueDistribution'];
				var pdm = print_data[k]['PartnerDocumentMethod'];

				var customer_types = [];
				if(checkNull(pd.customer_types) != ''){
					customer_types = pd['customer_types'].split(',');
				}

				//&& $.inArray( gbl_data.customerData.Customer.user_group_id, customer_types ) 
				if(pd.document_method_id == d.value && pdm.status == 1  && $.inArray( gbl_data.customerData.Customer.user_group_id, customer_types ) !== -1){
					opts.push(d);

					if(d.type == 'classic'){
						alternate_opts.push(d);
					}
					print_data.slice(k,1);
					break;
				}
			}
		}
		if(checkNull(opts)==''){
			opts = [];
		}


		
		$("#default_distribution").editable({
	       	value: default_distribution,  
	       	mode:'inline',  
	       	type: 'select2',
	        source:opts,
	        select2: {
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	var params = {
	        		'from':'default_distribution',
	    			'default_distribution':config
	    		};
	        	customer_custom_fields.saveSalesProperties(params);
	   		},
		});




		if(checkNull(alternate_opts)==''){
			alternate_opts = [];
		}
		$("#alternate_distribution").editable({
	       	value: checkNull(gbl_data.customerData.Customer.alternate_distribution),  
	       	mode:'inline',  
	       	type: 'select2',
	       	placeholder:gbl_td.Select,
	       	emptytext:gbl_td.None,
	        source:alternate_opts,
	        select2: {
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	var params = {
	        		'from':'alternate_distribution',
	    			'alternate_distribution':config
	    		};
	        	customer_custom_fields.saveSalesProperties(params);
	   		},
		});

		var optss = JSON.parse(gbl_data.documentMethod);
		
		for(var j in optss){
			if(optss[j]['value'] == default_distribution){
				if(optss[j]['type'] == 'new'){
					$('.alter_dist').show();
				}
				break;
			}
		}


		var opts = [
			{text:gbl_td.$no_news,value:0},
			{text:gbl_td.$via_email,value:1},
			{text:gbl_td.$via_sms,value:2},
			{text:gbl_td.$via_sms_and_email,value:3}
		];

		var receive_mass_sms = gbl_data.customerData.Customer.receive_mass_sms;
		var receive_mass_emails = gbl_data.customerData.Customer.receive_mass_emails;
		var val = 0;
		if(receive_mass_sms==1 && receive_mass_emails==1){
			val = 3;
		}
		else if(receive_mass_sms==1){
			val = 2;
		}
		else if(receive_mass_emails==1){
			val = 1;
		}
		else{
			val = 0;
		}

		$("#newsletter_updates").editable({
	       	value: val,  
	       	mode:'inline',  
	       	type: 'select2',
	        source:opts,
	        select2: {
				minimumResultsForSearch: -1,
			},
	        success: function(data, config) {
	        	var params = {
	        		'from':'receive_mass_sms_emails',
	    			'receive_mass_sms_emails':config
	    		};
	        	customer_custom_fields.saveNewsLetter(params);
	   		},
		});
		var customer_card_settings = gbl_data.getPartnerCustomSettings.customer_card_settings;
		if(checkNull(customer_card_settings)!=''){
			customer_card_settings = customer_card_settings.split(',');
		}
		else{
			customer_card_settings = [];
		}
		
		for(var j in customer_card_settings){
			var v = customer_card_settings[j];
			$('input[value="'+v+'"]').prop('checked','checked');
		}
		$('.customer_card_settings').uniform().change(function(){
			var l = $('.customer_card_settings:checked').length;
			if(l>5){
				$(this).removeAttr('checked');
				$.uniform.update();
				showAlertMessage(gbl_td.$max_five,'error',gbl_td.alertmessage);
			}
			else{
				customer_custom_fields.save_card_fields();
			}
		});

		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Grouptab = function (options) {
		        this.init('grouptab', options, Grouptab.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Grouptab, $.fn.editabletypes.abstractinput);

		    $.extend(Grouptab.prototype, {
		     
		        render: function() {
		           	this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		             this.$select.select2({
		             	allowClear:true,
		            	placeholder:cust_det_trans_dt.Select
		             });
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }
		            var html = '';
		            if(checkNull(value.custGroup)!=''){
		            	var custGroupText = '';
		            	for(var j in partner_customer_groups){
		            		var pcg = partner_customer_groups[j];
		            		if(pcg.value==value.custGroup){
		            			custGroupText = pcg.text;
		            		}
		            	}
		            	if(cust_det_dt.PartnerCustomerGroup.length != 0){
			            	var httml = '<p class="hh">&nbsp;<span style="color:#6b6b6b">'+cust_det_trans_dt.Customergroup+': </span>';
			            	httml += custGroupText+'</p>';
			            	
			            }
			            else{
			            	var httml = '';
			            }
			            html += $('<div>').html(httml).html();
		            }
		            else{
		            	if(cust_det_dt.PartnerCustomerGroup.length != 0){
		            		var httml = '<p class="hh">&nbsp;<span style="color:#6b6b6b">'+cust_det_trans_dt.Customergroup+': </span>';
		            		httml += cust_det_trans_dt.None+'</p>';
		            	}
		            	else{
		            		var httml = '';
		            	}
		            	html += $('<div>').html(httml).html();
		            }
		            
		            if(checkNull(value.custPriceGroup)!=''){
		            	var custPriceGroupText = '';

		            	for(var j in partner_price_groups){
		            		var ppg = partner_price_groups[j];
		            		if(ppg.value==value.custPriceGroup){
		            			custPriceGroupText = ppg.text;
		            		}
		            	}

		            	if(custPriceGroupText==''){
		            		custPriceGroupText = cust_det_trans_dt.Standard;
		            	}
		            	var httml = '<p class="hh">';
		            	if(cust_det_dt.PartnerCustomerGroup.length != 0){
		            		httml += '<span style="color:#6b6b6b">'+cust_det_trans_dt.Pricegroup+': </span>';
		            	}
		            	httml += custPriceGroupText+'</p>';

		            	html += $('<div>').html(httml).html()+ '';
		            }
		            if(html==''){
		            	html += $('<div>').text(cust_det_trans_dt.Empty).html();
		            }

		            $(element).html(html); 
		        },
		        html2value: function(html) {        

		          return null;  
		        },
		      
		       value2str: function(value) {
		           var str = '';
		           if(value) {
		               for(var k in value) {
		                   str = str + k + ':' + value[k] + ';';  
		               }
		           }
		           return str;
		       }, 
		       
		       str2value: function(str) {
		           return str;
		       },                
		             
		       value2input: function(value) {
					if(!value) {
						return;
					}
					this.$select.filter('[name="custGroupTab"]').val(checkNull(value.custGroup)).trigger('change');
					this.$select.filter('[name="custPriceGroupTab"]').val(checkNull(value.custPriceGroup)).trigger('change');
		 
		       },           
		       input2value: function() { 
		           return {
		              custGroup: this.$select.filter('[name="custGroupTab"]').val(), 
		              custPriceGroup: this.$select.filter('[name="custPriceGroupTab"]').val(), 
		           };
		       },         
		       activate: function() {

		            this.$select.filter('[name="custGroupTab"]').focus();
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });
			
			if(cust_det_dt.PartnerCustomerGroup.length != 0){
				var tpl = '<div class="editable-address"><p style="margin:0">'+cust_det_trans_dt.Customergroup+'</p><label><select id="custGroupTab" name="custGroupTab" class="">'+partner_customer_groups_opts+'</select></label></div><div class="editable-address"><p style="margin:0;">'+cust_det_trans_dt.Pricegroup+'</p><label><select id="custPriceGroupTab" name="custPriceGroupTab" class="">'+partner_price_groups_opts+'</select></label></div>';
			}
			else{
				var tpl = '<div class="editable-address"><p style="margin:0;display:none;">'+cust_det_trans_dt.Customergroup+'</p><label  style="display:none;"><select id="custGroupTab" name="custGroupTab" class="">'+partner_customer_groups_opts+'</select></label></div><div class="editable-address"><p style="margin:0;display:none;">'+cust_det_trans_dt.Pricegroup+'</p><label><select id="custPriceGroupTab" name="custPriceGroupTab" class="">'+partner_price_groups_opts+'</select></label></div>';
			}
		    Grouptab.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl:tpl ,
		             
		        inputclass: ''
		    });
		     $.fn.editabletypes.grouptab = Grouptab;
		}(window.jQuery));

		var v = '';
	    if(checkNull(cust_det_dt.customerData.price_group_id) != ''){
	    	v = cust_det_dt.customerData.price_group_id;
	    }
	    else{
	    	v = sel_val;
	    }
	    var cgi = checkNull(cust_det_dt.customerData.customer_group_id);
	  
	    if(cgi!= '' && cgi!=0){
	    	var vg = cust_det_dt.customerData.customer_group_id;
	    }
	    else{
	    	var vg = 'none';
	    }
	

		$('a#customer_and_price_groups').editable({
	        url: '',
	        showbuttons:'bottom',
	        title: 'Delivery Address',
	        value: {
	            custGroup: vg,
	            custPriceGroup:v,
	        },
	        success: function(data, config) {
 				customer_details.saveSingleField(config,'groups');
	        	$('a#customer_and_price_groups').addClass('editable_touched');
	        }
	    }).click(function(){
	    	$('#custGroupTab').change(function(){
	    		
	    		var v = $('#custGroupTab').val();
		    	if(v=='none'){
		    		$('#custPriceGroupTab').select2('enable');
		    	}
		    	else{
		    		$('#custPriceGroupTab').select2('enable',false);
		    	}

		   	 for(var j in cust_det_dt.PartnerCustomerGroup){
				var pcg = cust_det_dt.PartnerCustomerGroup[j].PartnerCustomerGroup;
		    	
		    		if(pcg.id==v){
		    			$('#custPriceGroupTab').select2('enable');
		    			$('#custPriceGroupTab').val(pcg.price_group_id).trigger('change');
		    			$('#custPriceGroupTab').select2('enable',false);
		    			
		    		}
		    	}
	    	}).trigger('change');
	    });



	
		$(".info_show_on_card").hover(function () {
			$(this).popover({
				title: '',        
				content: gbl_td.$cust_card_fields,
				html: true
			}).popover('show');
		}, function () {
			$(this).popover('hide');
		});	

		$('.add_note').editable({
			type:'wysihtml5',
			showbuttons:'bottom',
			emptytext:gbl_td.Addnote,
			placeholder:gbl_td.Description,
			validate:function(value){
				if(checkNull(value) == ''){
					return gbl_td.$note_empty;
				}
			},
			success: function(data, config) {
			 	customer_custom_fields.saveNote(config,'add');
			},
		});
	},
	makePaymentEditable:function(){
		var getCreditDayList = gbl_data.getCreditDayList;
		var opts = [];
		var sel_val = '';
		var sel = '';
		if(checkNull(gbl_data.getCreditDayList)!=''){
			for(var j in gbl_data.getCreditDayList){
				var d = gbl_data.getCreditDayList[j];
				opts.push({
					text:d,
					value:j
				});
				if(j==gbl_data.customerData.Customer.payment_terms){
					sel_val = j;
				}
			}
		}
		opts.push({'text':gbl_td.Default,value:'default'});

		var custom_credit_days = 0;
		if(checkNull(sel_val)!=''){
			sel = sel_val;
		}
		else if(checkNull(gbl_data.customerData.Customer.payment_terms)==''){
			sel = 'default';
		}
		else if(checkNull(gbl_data.customerData.Customer.payment_terms)!=''){
			sel = 'custom';
			custom_credit_days =  gbl_data.customerData.Customer.payment_terms;
		}
		

		$("#credit_days").editable({
	       	value: sel,  
	       	mode:'inline',  
	       	type: 'select2',
	        source:opts,
	        select2: {
	        	allowClear:true,
				minimumResultsForSearch: -1,
	    		placeholder: gbl_td.Select,
				
				},
	        success: function(data, config) {
	        	setTimeout(function(){
		        	if(config=='custom'){
		        		$('#custom_credit_days').editable('setValue',checkNull(gbl_data.getPartnerCustomSettings.credit_days,0))
		        		$('.custom_credit_days_wrapper').removeClass('hide');
		        		setTimeout(function(){
		        			$('#custom_credit_days').click();
		        		},100);
		        	}
		        	else{
		        		$('.custom_credit_days_wrapper').addClass('hide');
		        		var params = {
		        			'from':'credit_days',
		        			'credit_days':config
		        		};
		        		customer_custom_fields.saveSalesProperties(params);
		        	}
	        	});
	   		},
		});

		$("a#custom_credit_days").editable({
	       	value: custom_credit_days,  
	       	mode:'inline',  
	       	type: 'text',
	       	emptytext:gbl_td.Empty,

	       	validate:function(value){
	       		if ($.isNumeric(value) == '') {
		        // alert('This Number is required');
		           return gbl_td.Entervalidnumber;
	        	}
	       	},
	        success: function(data, config) {
	        	var params = {
	    			'from':'custom_credit_days',
	    			'credit_days':config
	    		};
	        	customer_custom_fields.saveSalesProperties(params);

	   		},
		});

		if(checkNull(custom_credit_days)!=''){
			$('.custom_credit_days_wrapper').removeClass('hide');
		}
		else{
			$('.custom_credit_days_wrapper').addClass('hide');
		}	
	},
	generateCustomFields:function(data=''){
		if(data==''){
			var data = gbl_data.getCustomFieldsListForotherInformation;
		}

		var ans = '';
		if(checkNull(gbl_data.getAllCustomFieldsData)!=''){
			ans = checkNull(gbl_data.getAllCustomFieldsData.CustomerCustomfield.answers);
		}
		if(ans!=''){
			ans = JSON.parse(ans);
		}
		else{
			ans = {};
		}
		for(var j in data){
			var d = data[j];
			//Getting answer
			var th_ans = '';
			if(checkNull(ans[d.type])!=''){
				for(var k in ans[d.type]){
					var ansd = ans[d.type][k];
					if(k==checkNull(j)){
						th_ans = ansd;
						break;
					}
				}
			}

			var nomod_field_id = j;
			var field_id = j.trim();
			field_id = field_id.replace(/\s/g,'');
			//field_id = field_id.replace('/','');
			var tr = '<tr>';
				tr += '<td>';
					tr += checkNull(j);
				tr += '</td>';
				tr += '<td>';
					tr += '<a id="'+field_id+'" name="'+field_id+'" data-name="'+j+'"></a>';
				tr += '</td>';
				tr += '<td>';
					tr += '<input type="checkbox" value="'+j+'" id="'+field_id+'_check" name="'+field_id+'_check" class="customer_card_settings">';
				tr += '</td>';
			tr += '</tr>';

			

			$('#custom_field_tbody').append(tr);
			if(d.type=='text'){
				
				if(d.mandatory=='y'){
						
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						success: function(data, config) {
							customer_custom_fields.saveData(config,this,'text','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return gbl_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						success: function(data, config) {
							customer_custom_fields.saveData(config,this,'text','n');
						},
					});
				}	
			}
			else if(d.type=='textarea'){
				if(d.mandatory=='y'){
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						success: function(data, config) {
							customer_custom_fields.saveData(config,this,'textarea','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return gbl_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						success: function(data, config) {

							customer_custom_fields.saveData(config,this,'textarea','n');
						},
					});
				}
			} 
			else if(d.type=='dropdown'){
				var opts = checkNull(d.custom_value);
				if(opts!=''){
					opts = JSON.parse(opts);
				}
				else{
					opts = [];
				}
			
				var options = [];
				var sel_plce = '';
				for(var l in opts){
					var ds = opts[l];
					options.push({
						text:ds.value,
						value:ds.value
					});
					if(checkNull(ds.is_default)!=''){
						if(ds.is_default==1){
							sel_plce = ds.value;
						}
					}
				}
				if(d.mandatory=='y'){
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:gbl_td.Empty,
		       			},
						source:options,
						success: function(data, config) {
							customer_custom_fields.saveData(config,this,'dropdown','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return gbl_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:gbl_td.Empty,
		       			},
						source:options,
						success: function(data, config) {
							customer_custom_fields.saveData(config,this,'dropdown','n');
						}
					});
				}
			}
			else if(d.type=='radio'){
				var opts = checkNull(d.custom_value);
				if(opts!=''){
					opts = JSON.parse(opts);
				}
				else{
					opts = [];
				}
			
				var options = [];
				var sel_plce = '';
				for(var l in opts){
					var ds = opts[l];
					options.push({
						text:ds.value,
						value:ds.value
					});
					if(checkNull(ds.is_default)!=''){
						if(ds.is_default==1){
							sel_plce = ds.value;
						}
					}
				}
				if(d.mandatory=='y'){
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:gbl_td.Empty,
		       			},
						source:options,
						success: function(data, config) {
							customer_custom_fields.saveData(config,this,'radio','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return gbl_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:gbl_td.Empty,
		       			},
						source:options,
						success: function(data, config) {
							customer_custom_fields.saveData(config,this,'radio','n');
						}
					});
				}
			}
			else if(d.type=='checkbox'){
				var opts = checkNull(d.custom_value);
				var options = {};
				options[opts] = opts;
		
				if(d.mandatory=='y'){
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						source:options,
						type: 'checklist',
						success: function(data, config) {
							customer_custom_fields.saveData(config[0],this,'checkbox','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return gbl_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						source:options,
						type: 'checklist',
						success: function(data, config) {
							customer_custom_fields.saveData(config[0],this,'checkbox','n');
						}
					});
				}
			}
		}
	},
	saveData:function(newvalue,that,type,validate){
		
		if(validate!='n' && (newvalue=='' || newvalue==null)){
			return;
		}
		var fieldname = $(that).attr('data-name');
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			newvalue:newvalue,
			fieldname:fieldname,
			type:type,
			customer_id:gbl_meta.customer_id,
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/editCustomerCustomFields.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				$('.cust_sel_fields a[data-name="'+fieldname+'"]').editable('setValue',newvalue);
				call_toastr('success', gbl_td.Success, complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
					return;
				}	
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
	},
	saveSalesProperties:function(data,showtoast='y'){
		var datas = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:gbl_meta.customer_id,
		};
		var total_params = Object.assign(datas, data);

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/updateSalesProperties.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){

			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				if(showtoast == 'y'){
					call_toastr('success', gbl_td.Success, gbl_td.Salespropertiesupdatedsuccessfully);
				}

				try{
					$('#'+data.from+'_card').editable('setValue',data[data.from]);
				}
				catch(e){

				}
				if ("cust_det_dt" in window) {
					if(data.from=='custom_credit_days' || data.from=='credit_days'){
						cust_det_dt.customerData.payment_terms = data.credit_days;
						gbl_data.customerData.Customer.payment_terms = data.credit_days;
						try{
							$('#credit_days_card,#custom_credit_days_card').editable('destroy');
						}
						catch(e){

						}
						customer_details.makePaymentEditable();
					}
					
					else if(data.from=='do_not_send_reminders'){
						cust_det_dt.customerData.do_not_send_reminders = data[data.from];
						gbl_data.customerData.Customer.do_not_send_reminders = data[data.from];
					}
				}
				else{
					if(data.from=='custom_credit_days' || data.from=='credit_days'){
						gbl_data.customerData.Customer.payment_terms = data[data.from];
					}
					
					else if(data.from=='do_not_send_reminders'){
						gbl_data.customerData.Customer.do_not_send_reminders = data[data.from];
					}
				}

				if(data.from == 'default_distribution'){
					// var found = 0;
					var optss = JSON.parse(gbl_data.documentMethod);
					gbl_data.customerData.Customer.default_distribution = data[data.from];
					for(var j in optss){
						if(optss[j]['value'] == data[data.from]){
							if(optss[j]['type'] == 'new'){
								$('.alter_dist').show();
								if(optss[j]['internal_name'] == 'ehf'){
									try{
									$('#alternate_distribution').editable('setValue',checkNull(complet_data.response.response.saveSalesProperties.alternate_distribution));
									}
									catch(e){

									}

									// var def_d = gbl_data.default_distribution;

									// if(checkNull(gbl_data.customerData.Customer.default_distribution)!=''){
									// 	def_d = gbl_data.customerData.Customer.default_distribution;
									// }
									// console.log('def_d2',def_d);
							
									// if( ( def_d == '1' || def_d == '2' || def_d == '3') && $('#alternate_distribution').editable('getValue').alternate_distribution == ''){
									// 	$('#alternate_distribution').editable('setValue',def_d);
									// 	var params = {
							  //       		'from':'alternate_distribution',
							  //   			'alternate_distribution':def_d
							  //   		};
							  //       	customer_custom_fields.saveSalesProperties(params,'no');
						   //      	}
								}
							}
							found = 1;
							break;
						}
					}
					// if(found == 0){
					// 	$('.alter_dist').hide();
					// }

				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
					return;
				}	
			}
		};
		if(showtoast == 'y'){
			showProcessingImage('undefined');
		}
		doAjax(params);
	},
	saveNewsLetter:function(data){
		var datas = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:gbl_meta.customer_id,
		};

		var save_params = {};
		if(data.from=='receive_mass_sms_emails'){
			save_params = {
				from:'receive_mass_sms_emails',
				receive_mass_sms:0,
				receive_mass_emails:0
			};
			if(data.receive_mass_sms_emails==1){
				save_params.receive_mass_sms = 0;
				save_params.receive_mass_emails = 1;
			}
			else if(data.receive_mass_sms_emails==2){
				save_params.receive_mass_sms = 1;
				save_params.receive_mass_emails = 0;
			}
			else if(data.receive_mass_sms_emails==3){
				save_params.receive_mass_sms = 1;
				save_params.receive_mass_emails = 1;
			}


		}
		var total_params = Object.assign(datas, save_params);

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/updateNewsletter.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				call_toastr('success', gbl_td.Success, gbl_td.Newslettersandupdatesupdatedsuccessfully);
				$('#newsletter_updates_card').editable('setValue',data.receive_mass_sms_emails);
				
				if ("cust_det_dt" in window) {
					if(data.from=='receive_mass_sms_emails'){
						gbl_data.customerData.Customer.receive_mass_sms =save_params.receive_mass_sms;
						cust_det_dt.customerData.receive_mass_sms = save_params.receive_mass_sms;

						gbl_data.customerData.Customer.receive_mass_emails = save_params.receive_mass_emails;
						cust_det_dt.customerData.receive_mass_emails = save_params.receive_mass_emails;
					}
				}
				else{
					if(data.from=='receive_mass_sms_emails'){
						gbl_data.customerData.Customer.receive_mass_emails = save_params.receive_mass_emails;
						gbl_data.customerData.Customer.receive_mass_sms = save_params.receive_mass_sms;
					}
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
					return;
				}	
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
	},
	generateSalesDocument:function(data=[]){

		if(data.length==0){
			var data = gbl_data.getPartnerSalesDocuments.salesDocuments;
		}
		sales_contact_ids = [];
		var recp_count = 0;
		var html = '';
		for(var j in data){
			var psd = data[j].PartnerSalesDocument;
			
			if(checkNull(psd.contact_id)!='' && checkNull(psd.contact_id)!=0){
				sales_contact_ids.push(psd.contact_id);
			}
			if(psd.recipient=='Yourref'){
				recp_count ++;
				html += '<tr>';
					html += '<td>';
						html += gbl_td.$your_ref;
					html += '</td>';

					html += '<td>';
						if(psd.quote_check=='y'){
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv quote_check_'+psd.id+'" checked="checked" >';
						}
						else{
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv quote_check_'+psd.id+'" >';
						}
					html += '</td>';

					html += '<td>';
						if(psd.order_check=='y'){
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'"  class="uni sales_inv order_check_'+psd.id+'" checked="checked" >';
						}
						else{
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv order_check_'+psd.id+'" >';
						}
					html += '</td>';

					html += '<td>';
						if(psd.invoice_check=='y'){
							html += '<input type="checkbox"  data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv invoice_check_'+psd.id+'"  checked="checked"  >';
						}
						else{
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv invoice_check_'+psd.id+'" >';
						}
					html += '</td>';

					html += '<td>';
						//html += '<button class="btn mini edit blue-stripe" onclick="customer_custom_fields.editSalesDocument('+checkNull(psd.id)+')"><i class="icon-eye-open"></button>';

					html += '</td>';
				html += '</tr>';
			}
			else{
				html += '<tr id="sales_document_'+psd.id+'">';
					html += '<td>';
						//html += psd.recipient;
						html += '<a name="" class="sales_recipient" data-contact-id="'+checkNull(psd.contact_id)+'" data-primary-key="'+psd.id+'" data-ans="'+checkNull(psd.recipient)+'"></a>';
					html += '</td>';

					html += '<td>';
						if(psd.quote_check=='y'){
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv quote_check_'+psd.id+'" checked="checked" >';
						}
						else{
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv quote_check_'+psd.id+'" >';
						}
					html += '</td>';

					html += '<td>';
						if(psd.order_check=='y'){
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'"  class="uni sales_inv order_check_'+psd.id+'" checked="checked" >';
						}
						else{
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv order_check_'+psd.id+'" >';
						}
					html += '</td>';

					html += '<td>';
						if(psd.invoice_check=='y'){
							html += '<input type="checkbox"  data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv invoice_check_'+psd.id+'"  checked="checked"  >';
						}
						else{
							html += '<input type="checkbox" data-primary-key="'+checkNull(psd.id)+'"  data-contact-id="'+checkNull(psd.contact_id)+'" class="uni sales_inv invoice_check_'+psd.id+'" >';
						}
					html += '</td>';

					html += '<td>';
						//html += '<button class="btn mini edit blue-stripe" onclick="customer_custom_fields.editSalesDocument('+checkNull(psd.id)+')"><i class="icon-eye-open"></i></button>';
						html += '<button class="btn mini red-stripe" onclick="customer_custom_fields.deleteSalesDocument('+checkNull(psd.id)+')"><i class="icon-remove"></i>&nbsp;'+gbl_td.Delete+'</button>';
					html += '</td>';
				html += '</tr>';
			}
		}
		if(recp_count==0){
			var htmla = '<tr>';
				htmla += '<td>';
					htmla += gbl_td.$your_ref;
				htmla += '</td>';

				htmla += '<td>';
					htmla += '<input type="checkbox" data-primary-key="0"  data-contact-id="0" class="uni sales_inv quote_check_0" checked="checked">';
				htmla += '</td>';

				htmla += '<td>';
					htmla += '<input type="checkbox" data-primary-key="0"  data-contact-id="0" class="uni sales_inv order_check_0" checked="checked">';
				htmla += '</td>';

				htmla += '<td>';
					htmla += '<input type="checkbox" data-primary-key="0"  data-contact-id="0" class="uni sales_inv invoice_check_0"  checked="checked" >';
				htmla += '</td>';

				htmla += '<td>';
					//html += '<button class="btn mini edit blue-stripe" onclick="customer_custom_fields.editSalesDocument()"><i class="icon-eye-open"></button>';
				htmla += '</td>';
			htmla += '</tr>';
		}

		html += '<tr>';
			html += '<td>';
				html += '<input type="text" class="customer_contact m-wrap span12" style="margin:0;background-color:#fff">';
				html += '<input type="hidden" value="" class="customer_contact_id">';
			html += '</td>';

			html += '<td>';
				html += '<input type="checkbox" data-primary-key="0"  data-contact-id="0" class="uni quote_check" checked="checked">';
			html += '</td>';
		

			html += '<td>';
				html += '<input type="checkbox" data-primary-key="0"  data-contact-id="0" class="uni order_check" checked="checked">';
			html += '</td>';

			html += '<td>';
				html += '<input type="checkbox" data-primary-key="0"  data-contact-id="0" class="uni invoice_check" checked="checked">';
			html += '</td>';

			html += '<td>';
				html += '<button class="btn mini blue-stripe" onclick="customer_custom_fields.saveSalesDocument()"><i class="icon-ok"></i>&nbsp;'+gbl_td.Save+'</button>';
			html += '</td>';
		html += '</tr>';


		html = htmla + html;
		$('#sales_document_tbody').html(html);
		$('.uni').uniform();


		$('.sales_recipient').each(function(){
			var ans= $(this).attr('data-ans');
			var ct = $(this).attr('data-contact-id');
			if(checkNull(ct)=='' || checkNull(ct)==0){
				$(this).editable({
			       	value: ans,  
			       	mode:'inline',  
			       	type: 'text',
			       	emptytext:gbl_td.Empty,
			       	showbuttons:'bottom',

			       	validate:function(value){

			       		if(checkNull(gbl_sls_err)!=''){
			       			return gbl_sls_err;
			       		}
			       		if (!customer_custom_fields.validateEmail(value)) {
				           return gbl_td.Entervalidemailaddress;
			        	}

			       	},
			        success: function(data, config) {
			     
			        	var id = $(this).attr('data-primary-key');
			        	var contact_id = $(this).attr('data-contact-id');
			        	var params = {
			    			'from':'email',
			    			'email':config,
			    			'id':id,
			    			'contact_id':contact_id,
			    		};
			        	customer_custom_fields.saveSalesRecipients(params,this);

			   		},
				});
			}
			else{
				$(this).html(ans).css({
					'color' : '#000',
					'font-style': 'normal'
				});
			}
		});

		$('.sales_inv ').change(function(){
			
			var that = $(this).parent().parent().parent().parent().find('a.sales_recipient');
			var id = '';
			var contact_id = '';
			var config = '';
			if(that.length!=0){
				
				id = $(that).attr('data-primary-key');
			    contact_id = $(that).attr('data-contact-id');
			    var z = $(that).editable('getValue');
			    for(var j in z){
			    	config = z[j];
			    }
			}
			else{

				id = $(this).attr('data-primary-key');
				config = 'Yourref';
				contact_id = '';
			}
			

			var params = {
				'from':'email',
    			'email':config,
    			'id':id,
    			'contact_id':contact_id,
			};
			
			customer_custom_fields.saveSalesRecipients(params,that,1);

		});

		if(isAjaxComp==1){
			customer_custom_fields.bindSaleAuto();
		}
		else{
			seti = setInterval(function(){
				
				if(isAjaxComp==1){
					clearInterval(seti);
					customer_custom_fields.bindSaleAuto();
				}
			},1);
		}
	},
	bindSaleAuto:function(){
		
		var cust_cnt_list = localStorage.getItem('cust_cnt_list');
		if(checkNull(cust_cnt_list)!=''){
			cust_cnt_list = JSON.parse(cust_cnt_list);
		}
		else{
			cust_cnt_list = [];
		}
		var a = cust_cnt_list;
		var b = sales_contact_ids;

		for(var j in a){
			for(var k in b){
				if(checkNull(a[j])!=''){
					if(a[j].contact_id==b[k]){
						delete a[j]
						continue;
					}
				}
			}
		}

		var c= [];
		for(var j in a){
			if(checkNull(a[j])!=''){
				c.push(a[j]);
			}
		}
	
		$('.customer_contact').autocomplete({
			source: c,
			minLength: 1,
      		select: function( event, data ) {
      			$('.customer_contact_id').val(data.item.contact_id);
      		},
		});

		$('.customer_contact').keyup(function(){
			if($(this).val()==''){
				$('.customer_contact_id').val('');
			}			
		});			
	},
	saveSalesDocument:function(){
		var customer_contact = $('.customer_contact').val();
		var customer_contact_id = $('.customer_contact_id').val();

		var err = '';
		if(customer_contact_id==''){
			var e = customer_custom_fields.validateEmail(customer_contact);
			if(!e){
				err += '<br/>'+gbl_td.Recipient;
			}
			var save_customer_contact_id = 0;
			var recipient = customer_contact;

		}
		else if(customer_contact_id!='' && customer_contact.indexOf('@')!=-1){
			var e = customer_custom_fields.validateEmail(customer_contact);
			if(!e){
				err += '<br/>'+gbl_td.Recipient;
			}
			var save_customer_contact_id = 0;
			var recipient = customer_contact;
		}
		else{
			var save_customer_contact_id = customer_contact_id;
			var recipient  = '';
			var cust_cnt_list = localStorage.getItem('cust_cnt_list');
			if(checkNull(cust_cnt_list)!=''){
				cust_cnt_list = JSON.parse(cust_cnt_list);
			}
			else{
				cust_cnt_list = [];
			}
			for(var j in cust_cnt_list){
				if(cust_cnt_list[j].contact_id==save_customer_contact_id){
					recipient = cust_cnt_list[j].value;
				}
			}
			
		}

		if(err){
			var msg = gbl_td.$check;
			msg += err;
			showAlertMessage(msg,'error',gbl_td.alertmessage);
			return;
		}

		var quote_check = $('.quote_check:checked').length;
		if(quote_check==1){
			quote_check = 'y';
		}
		else{
			quote_check = 'n';
		}
		var order_check = $('.order_check:checked').length;
		if(order_check==1){
			order_check = 'y';
		}
		else{
			order_check = 'n';
		}
		var invoice_check = $('.invoice_check:checked').length;
		if(invoice_check==1){
			invoice_check = 'y';
		}
		else{
			invoice_check = 'n';
		}

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:gbl_meta.customer_id,
			recipient:recipient,
			contact_id:save_customer_contact_id,
			quote_check:quote_check,
			order_check:order_check,
			invoice_check:invoice_check,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/addSalesRecipient.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
		}
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				customer_custom_fields.generateSalesDocument(complet_data.response.response.getPartnerSalesDocuments.salesDocuments);
				call_toastr('success', gbl_td.Success, complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	validateEmail:function(value) {
  		var input = document.createElement('input');
		input.type = 'email';
		input.value = value;
		input.required = 'required';

		return typeof input.checkValidity == 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(value);
	},
	editSalesDocument:function(id='',from='edit'){
		var default_distribution = $('#default_distribution').editable('getValue');
		var hidden_distribution = default_distribution.default_distribution;

		var credit_days = $('#credit_days').editable('getValue');
		var hidden_credit_days = credit_days.credit_days;


		var custom_credit_days = $('#custom_credit_days').editable('getValue');
		var hidden_custom_credit_days = custom_credit_days.custom_credit_days;

		var do_not_send_reminders = $('#do_not_send_reminders').editable('getValue');
		var hidden_reminders = do_not_send_reminders.do_not_send_reminders;
		
		var receive_mass_emails = $('#receive_mass_emails').bootstrapSwitch('status');
		var receive_mass_sms = $('#receive_mass_sms').bootstrapSwitch('status');
		var customerId = gbl_meta.customer_id; 
		if(from=='add'){
			var url = base_url + 'customers/add_sales_recipient/'+customerId;
			if(checkNull(id)!='' && checkNull(id)!=0){
				url += '/'+id;
			}
			url += '?hidden_credit_days='+hidden_credit_days+'&hidden_custom_credit_days='+hidden_custom_credit_days+'&hidden_reminders='+hidden_reminders+'&receive_mass_emails='+receive_mass_emails+'&receive_mass_sms='+receive_mass_sms+'&from=other_information';
		}
		else{
			var url = base_url + 'customers/edit_sales_recipient/'+customerId+'/'+id+'?hidden_credit_days='+hidden_credit_days+'&hidden_custom_credit_days='+hidden_custom_credit_days+'&hidden_reminders='+hidden_reminders+'&receive_mass_emails='+receive_mass_emails+'&receive_mass_sms='+receive_mass_sms+'&from=other_information';
		}
		show_modal('','popups1','',url,'750');
	},
	deleteSalesDocument:function(id){
		var default_distribution = $('#default_distribution').editable('getValue');
		var hidden_distribution = default_distribution.default_distribution;

		var credit_days = $('#credit_days').editable('getValue');
		var hidden_credit_days = credit_days.credit_days;


		var custom_credit_days = $('#custom_credit_days').editable('getValue');
		var hidden_custom_credit_days = custom_credit_days.custom_credit_days;

		var do_not_send_reminders = $('#do_not_send_reminders').editable('getValue');
		var hidden_reminders = do_not_send_reminders.do_not_send_reminders;
		
		var receive_mass_emails = $('#receive_mass_emails').bootstrapSwitch('status');
		var receive_mass_sms = $('#receive_mass_sms').bootstrapSwitch('status');
		var customerId = gbl_meta.customer_id; 


		var url = base_url + 'customers/delete_sales_recipient/'+customerId+'/'+id+'?hidden_credit_days='+hidden_credit_days+'&hidden_custom_credit_days='+hidden_custom_credit_days+'&hidden_reminders='+hidden_reminders+'&receive_mass_emails='+receive_mass_emails+'&receive_mass_sms='+receive_mass_sms+'&from=other_information';
		
		
		var msg = gbl_td.$your_ref_delete;
		var yes = function(){
			passRequest(url,'undefined');
		};
		var no = function(){};
		showDeleteMessage(msg,gbl_td.Warning,yes,no,'ui-dialog-blue',gbl_data.Delete,gbl_td.Cancel);
	},
	save_card_fields:function(){
		var show = [];
		var show1 = [];
		$('.customer_card_settings').each(function(){
			var id= $(this).attr('id');
			var chckd = $('#'+$.escapeSelector(id)+':checked').length;
			if(chckd == 1){
				show.push($(this).val());
			}
		});
		show1 = show;
		show = JSON.stringify(show);
		
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:gbl_meta.customer_id,
			field:'customer_card_settings',
			value:show
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/partners/savePartnerSettingSingle.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){

				$('.custom_fields_li').addClass('hide');
				for(var j in show1){
					$('li[data-name="'+show1[j]+'"]').removeClass('hide');
				}
				call_toastr('success', gbl_td.Success, gbl_td.Cardsettingupdatedsuccessfully);
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
					return;
				}	
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
	},
	saveSalesRecipients:function(datas,that='',your_ref=0){
		console.log('datas',datas);
		var id = datas.id;
		var contact_id = contact_id;
		var recipient = datas.email;

		var quote_check = 'n';
		if($('.quote_check_'+id+':checked').length==1){
			quote_check = 'y'
		}

		var order_check = 'n';
		if($('.order_check_'+id+':checked').length==1){
			order_check = 'y';
		}

		var invoice_check = 'n';
		if($('.invoice_check_'+id+':checked').length==1){
			invoice_check = 'y';
		}
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			recipient:recipient,
			quote_check:quote_check,
			order_check:order_check,
			invoice_check:invoice_check,
			your_ref:your_ref,
			partner_sales_id:id,
			customer_id:gbl_meta.customer_id,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/editPartnerSalesDocuments.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
			
				call_toastr('success', gbl_td.Success, complet_data.response.response.message.msg);
			}
			else{
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					gbl_sls_err = array[0];
					$(that).click();
					$(that).next().find('.editable-submit').click();
					gbl_sls_err = '';
				
					//showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					gbl_sls_err = complet_data.response.response.msg;
					$(that).click();
					$(that).next().find('.editable-submit').click();
					gbl_sls_err = '';
					//showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
					return;
				}	
			}
		}

		showProcessingImage('undefined');
		doAjax(params);
	},
	getCustContLstWthotDfaltCont:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:gbl_meta.customer_id,
			status:1,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomersContactListWithoutDefaultContact.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				var d = complet_data.response.response.contactsList;
				var cust_cnt_list = [];
				for(var j in d){
					var u = d[j].User;
					var label = checkNull(u.first_name)+' '+checkNull(u.last_name);
					var c = d[j].CustomerContact;

					cust_cnt_list.push({
						contact_id:c.id,
						label:label,
						value:label
					});
				}
				localStorage.setItem('cust_cnt_list',JSON.stringify(cust_cnt_list));
				isAjaxComp = 1;
			}
			else{
			}
		};
		doAjax(params);
		return;
	},
	getNotes:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:gbl_meta.customer_id,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerNote.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				customer_custom_fields.generateNoteList(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
	},
	generateNoteList:function(data){
		if(data.customersNoteList.length != 0){
			var trh = [];
			var k = -1;
			for(var j in data.customersNoteList){
				k++;
				var d = data.customersNoteList[j].CustomerNote;
				trh[k] = [];
				trh[k].push(d.id);
				if(checkNull(d.log_date) ==  ''){
					var log_date = '-';
				}
				else{
					var log_date = convertDateIntoSiteFormat(d.log_date);
				}

				var note = '';
				var snote = '';
				if(checkNull(d.title) != ''){
					var snote = '<span class="sub subject_'+d.id+'">'+d.title+'</span>,&nbsp';
				}
				note = '<a class="note" id="note" data-id="'+d.id+'">'+snote+d.description + '</a>';

				trh[k].push(log_date);
				trh[k].push(note);

				var act = '<button class="btn mini red-stripe del_row" data-id="'+d.id+'" onclick="customer_custom_fields.deleteNote('+d.id+')"><i class="icon-remove"></i>&nbsp;'+gbl_td.Delete+'</button>';
				trh[k].push(act);
			}
		}

		int_not = setInterval(function(){
			if(created==1){
				clearInterval(int_not);
				customer_custom_fields.createNoteHtml(trh);
			}
		},10);
		
	},
	createNoteHtml:function(data=[],from=''){
		var html = '';
		for(var j in data){
			var d = data[j];
			html += '<tr id="note_'+d[0]+'">';
				for(var k in d){
					if(k==0){
						continue;
					}
					else if(k==1){
						html += '<td style="vertical-align:top !important;">'+d[k]+'</td>';
					}
					else if(k==2){
						html += '<td style="word-break: break-all;vertical-align:top !important;">'+d[k]+'</td>';
					}					
					else{
						 html += '<td>'+d[k]+'</td>';
					}
					
				}
			html += '</tr>';
			if(from=='edit'){

				
				$('#note_'+d[0]).remove();
				//$('#note_'+d[0]).after(html);
				//html = '';
				$('#customer_notes tbody').prepend(html);

			}
		}
		if(from!='edit'){
			$('#customer_notes tbody').prepend(html);
		}
		$('.note').editable({
			type:'wysihtml5',
			showbuttons:'bottom',
			placeholder:gbl_td.Description,
			validate:function(value){
				if(checkNull(value) == ''){
					return gbl_td.$note_empty;
				}
				
			},
			success: function(data, config) {
			 	var id = $(this).attr('data-id');
			 	customer_custom_fields.saveNote(config,'edit',id);
			},
		});

		
	},
	deleteNote:function(id){
		
		var yes = function(){
			showProcessingImage('undefined');
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				customer_id:gbl_meta.customer_id,
				note_id:id,
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Customers/deleteCustomerNote.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (complet_data){
				hideProcessingImage();
			};

			params['successCallbackFunction'] = function (complet_data){
				if(complet_data.response.status == 'success'){
					$('#note_'+id).remove();
					
					call_toastr('success',gbl_td.Success,complet_data.response.response.message.msg)
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',gbl_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
		};

		var no = function(){

		};
		showDeleteMessage(gbl_td.$del_note+'?',gbl_td.Warning,yes,no,'ui-dialog-blue',gbl_td.Delete,gbl_td.Cancel);

	},
	saveNote:function(val,frm='add',id=''){
		showProcessingImage('undefined');
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:gbl_meta.customer_id,
			description:val,
			title:'',
		};

		if(frm=='edit'){
			total_params.note_id = id;
			//total_params.title = $('.subject_'+id).html();
		}
		var params = $.extend({}, doAjax_params_default);
		if(frm=='edit'){
			params['url'] = APISERVER+'/api/Customers/editCustomerNote.json';
		}
		else{
			params['url'] = APISERVER+'/api/Customers/addCustomerNote.json';
		}
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				$('.add_note').editable('setValue','');
				customer_custom_fields.appendRow(complet_data.response.response.res,frm);
				call_toastr('success',gbl_td.Success,complet_data.response.response.message.msg)
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',gbl_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
	},
	appendRow:function(data,frm){

		var d = data.CustomerNote;
		var k = 0;
		var trh = [];
		trh[k] = [];
		trh[k].push(d.id);
		if(checkNull(d.log_date) ==  ''){
			var log_date = '-';
		}
		else{
			var log_date = convertDateIntoSiteFormat(d.log_date);
		}

		var note = '';
		var snote = '';
		if(checkNull(d.title) != ''){
			var snote = '<span class="sub subject_'+d.id+'">'+d.title+'</span>,&nbsp';
		}
		note = '<a class="note" id="note" data-id="'+d.id+'">'+snote+d.description + '</a>';

		trh[k].push(log_date);
		trh[k].push(note);

		var act = '<button class="btn mini red-stripe del_row" data-id="'+d.id+'" onclick="customer_custom_fields.deleteNote('+d.id+')"><i class="icon-remove"></i>&nbsp;'+gbl_td.Delete+'</button>';
		trh[k].push(act);

		if(frm=='edit'){
			customer_custom_fields.createNoteHtml(trh,'edit');

		}
		else if(frm=='add'){
			var a = customer_custom_fields.createNoteHtml(trh);
		}
		
	},
}


