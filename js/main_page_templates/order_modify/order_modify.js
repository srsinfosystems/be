var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();
var type = $('#type').val();
var storage_timeouts = [];
var om_dt;
var om_td;
var om_meta ={};
var cal_d = {};
var global_linKy = 0;
var customerList = [];
var crt_ht_to = [];
var customer_id;
var customerData='';
var all_products=[];
var delivery_addresses = {};
var from_details = 'n';
var sales_data={};
var is = 0;
var searchParams = new URLSearchParams(window.location.search)
var sfrom = searchParams.get('from');
var LastFocusId = '';
var field_id_name = {};
var order_modify = {
	start:function(meta={}){
		order_modify.getCustomers();
		om_meta = meta;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			order_id:om_meta.order_id,
			getTranslationsDataArray:['Dashboard','alert message','Success','Order','Order number','Customer','Order Details','Postal address','Zip City','Country','Company email','Order date','Empty','Your Ref','Our Ref','None','Referrer','$custom_text','Delivery method','Delivery address','Delivery name','Zip','City','Delivery phone','Add product','Delete product','Product bundle','Checklist','Total Price','Discount','$mva','Unit','Unit Price','Quantity','Units available','Location','Description','Product','Fill out','Ignore','Outgoing vat','Select','$del_sel_line','$vat_spec','Rate','MVA','Base amount','Net amount','Discount','Round off','Total','Delivery note','Please check the following fields','for line number','Customer','Order date','Save changes','Checklist option','Total to pay','$tota_inc_vat','Tax rate','Tax amount','The discount should not be greater than net amount','Invalid product','$sales_location']			    
		};

		if(checkNull(om_meta.customer_id) != ''){
			total_params.customer_id = om_meta.customer_id;
			customer_id = om_meta.customer_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Orders/getOrderModifyDetail.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				om_dt = complet_data.response.response;
				om_dt['CUR_SYM'] = CUR_SYM;
				om_td = complet_data.response.response.translationsData;
				customerData = complet_data.response.response.customerData;
				order_modify.createHtml();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',om_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',om_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	getCustomers:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/selectCustomer.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				customerList = complet_data.response.response.customer_list;
				
				var cache = {};

				crt_ht_to = setInterval(function(){
					if($('#salesSalesCustomerName').length != 0){
						clearInterval(crt_ht_to);
						$('#salesSalesCustomerName').autocomplete({
							autoFocus: true,	
							source: function( request, response ) {
				        		var term = request.term;
				        		if( term in cache ) {
				          			response( cache[ term ] );
				          			return;
				        		}
				        		var results = $.ui.autocomplete.filter(customerList, request.term);
				        		cache[ term ] = results;
				                response(results.slice(0, 100));
				  			},
							minLength: 1,
							select: function( event, data ) {
								customer_id = data.item.id;
								order_modify.getAndSaveCustomer();
							},
						    //position: { my : "right top", at: "right bottom", collision : "flip"  },
						});
					}

				},1);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',om_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',om_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		if(checkNull(om_dt.getOrderDetails.Order.delivery_name) == ''){
			om_dt.getOrderDetails.Order.delivery_name = om_dt.getOrderDetails.Order.customer_name;
		}
		om_dt.date_format_f = date_format_f;

		om_dt.type = type;
		om_td.dashboardurl = base_url+'dashboard/index';
		om_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('order_modify_template').innerHTML;
		var compiledRendered = Template7(template, om_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		order_modify.bindEvents();
	},
	bindEvents:function(){
		order_modify.generateSalesField(om_dt.sales_fields);

		var salesDeliveryAddress1 = checkNull(om_dt.getOrderDetails.Order.delivery_address1);
		var salesDeliveryAddress2 = checkNull(om_dt.getOrderDetails.Order.delivery_address2);
		var salesDeliveryZip = checkNull(om_dt.getOrderDetails.Order.delivery_zip);
		var salesDeliveryCity = checkNull(om_dt.getOrderDetails.Order.delivery_city);
		var salesDeliveryCountry = checkNull(om_dt.getOrderDetails.Order.delivery_country);
		var salesDeliveryName = checkNull(om_dt.getOrderDetails.Order.delivery_name);
		var salesDeliveryPhone = checkNull(om_dt.getOrderDetails.Order.delivery_phone);

		(function ($) {
		    "use strict";

		    var Location = function (options) {
		        this.sourceCountryData = options.sourceCountry;
		        this.init('location', options, Location.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Location, $.fn.editabletypes.abstractinput);
		    $.extend(Location.prototype, {

		        render: function () {
		            this.$input = this.$tpl.find('input');
		            this.$textarea = this.$tpl.find('textarea');
		       
		            this.$list = this.$tpl.find('select');

		            this.$list.empty();

		            var fillItems = function ($el, data) {
		                if ($.isArray(data)) {
		                    for (var i = 0; i < data.length; i++) {
		                        if (data[i].children) {
		                            $el.append(fillItems($('<optgroup>', {
		                                label: data[i].text
		                            }), data[i].children));
		                        } else {
		                            $el.append($('<option>', {
		                                value: data[i].value
		                            }).text(data[i].text));
		                        }
		                    }
		                }
		                return $el;
		            };

		            fillItems(this.$list, this.sourceCountryData);
		            this.$list.select2();
		        },

		        value2html: function (value, element) {
		            if (!value) {
		                $(element).empty();
		                return;
		            }
		            var countryText = value.delivery_country;
			            $.each(this.sourceCountryData, function (i, v) {
			                if (v.value == countryText) {
			                    countryText = v.text.toUpperCase();
			                }
			            });
					if(om_dt.partnerSetting.show_customer_country == 'y'){

		            }
		            else{
		            	if(salesDeliveryCountry == om_dt.partner_country){
		            		countryText = '';
		            	}
		            }
						if((salesDeliveryCountry== om_dt.partner_country) && (om_dt.partnerSetting.show_customer_country == 'n')){
							if(salesDeliveryName == '' && salesDeliveryZip == '' && salesDeliveryCity == ''){
								// if(customerData.Customer.same_postal_address == 'y'  && delivery_addresses.mod == 0){
								// 	var html = om_td.Sameaspostaladdress;
								// }
								// else{
									var html = om_td.Deliveryaddress;
								// }
							}else if(salesDeliveryName == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								}else{
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(salesDeliveryAddress1 == ''){
								 if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									 var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }	
							}else if(salesDeliveryAddress2 == ''){
								 if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									 var html = $('<div>').text(value.delivery_name).html()+ '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else if(salesDeliveryZip == ''){
								 if(salesDeliveryPhone == ''){
									 if(salesDeliveryCity == ''){ 
										var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html();
									 }else{
										 var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html();
									 }	
								 }else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else if(salesDeliveryCity == ''){
								 if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html();
								 }else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else if(salesDeliveryCountry == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									 var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + ' ' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								 }
							}else{
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}
						}else{
							if(salesDeliveryName == '' && salesDeliveryZip == '' && salesDeliveryCity == '' && salesDeliveryCountry == ''){
								// if(customerData.Customer.same_postal_address == 'y' && delivery_addresses.mod == 0){
								// 	var html = om_td.Sameaspostaladdress;
								// }
								// else{
									var html = om_td.Deliveryaddress;
								// }
							}else if(salesDeliveryName == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}	
							}else if(salesDeliveryAddress1 == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();	
								}
							}else if(salesDeliveryAddress2 == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(salesDeliveryZip == ''){
								if(salesDeliveryPhone == ''){
									if(salesDeliveryCity == ''){ 
										var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + ' ' + $('<div>').text(countryText).html();
									}else{
										var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
									}
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(salesDeliveryCity == ''){
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}else if(salesDeliveryCountry == ''){
								 if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html();
								 }else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html(); 
								 }	
							}else{
								if(salesDeliveryPhone == ''){
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html();
								}else{
									var html = $('<div>').text(value.delivery_name).html() + '<br />' + $('<div>').text(value.delivery_address1).html() + '<br />' + $('<div>').text(value.delivery_address2).html() + '<br />' + $('<div>').text(value.delivery_zip).html() + ' ' + $('<div>').text(value.delivery_city).html() + ' ' + $('<div>').text(countryText).html()+ '<br />' + $('<div>').text(value.delivery_phone_code + ' ' + value.delivery_phone).html();
								}
							}
						}
	
			
		            	$(element).html(html);
		        },

		        html2value: function (html) {
		            return null;
		        },

		        value2str: function (value) {
		            var str = '';
		            if (value) {
		                for (var k in value) {
		                    str = str + k + ':' + value[k] + ';';
		                }
		            }
		            return str;
		        },

		        str2value: function (str) {
		            return str;
		        },

		        value2input: function(value) {
		            this.$input.filter('[name="delivery_name"]').val(value.delivery_name);
		            this.$input.filter('[name="delivery_address1"]').val(value.delivery_address1);
		            this.$input.filter('[name="delivery_address2"]').val(value.delivery_address2);
		            this.$input.filter('[name="delivery_zip"]').val(value.delivery_zip);
		            this.$input.filter('[name="delivery_city"]').val(value.delivery_city);
		            this.$list.val(value.delivery_country).trigger('change');
		            this.$input.filter('[name="delivery_phone_code"]').val(value.delivery_phone_code);
		            this.$input.filter('[name="delivery_phone"]').val(value.delivery_phone);
		        },
		              
		        input2value: function() {
		            return {
		               delivery_name: this.$input.filter('[name="delivery_name"]').val(),
		               delivery_address1: this.$input.filter('[name="delivery_address1"]').val(),
		               delivery_address2: this.$input.filter('[name="delivery_address2"]').val(),
		               delivery_zip: this.$input.filter('[name="delivery_zip"]').val(),
		               delivery_city: this.$input.filter('[name="delivery_city"]').val(),
		               delivery_country: this.$list.val(),
		               delivery_phone_code: this.$input.filter('[name="delivery_phone_code"]').val(),
		               delivery_phone: this.$input.filter('[name="delivery_phone"]').val(),
		            };
		        },
		        
		        activate: function () {
		            this.$input.filter('[name="delivery_name"]').focus();
		            $('#delivery_zip').change(function(){
		            	fetchCityFromZip($('#delivery_zip').val(),$('#customer_delivery_country').val(),'delivery_city')
		            });

		            $('#customer_delivery_country').change(function(){
		            	fetchPhoneInitials($('#customer_delivery_country').val(),'delivery_phone_code')
		            })
		        },

		        autosubmit: function () {
		            this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		            });
		        }
		    });
			
			var tpl = '<div class="row-fluid"><div class="span7 delivery_address_left"><div class="editable-location" >' +
		        '<label><input type="text" class="input-inline delivery_name " autocomplete="off" name="delivery_name"></label>' +
		        '</div>' +
		        '<label class="e_delivery_address_label" style="margin-left: -136px;">'+om_td.Deliveryaddress+'</label>'+
		        '<div class="editable-location" style="margin-top: -23px;">' +
		        '<label class="inline_delivery_address_label hide">'+om_td.Deliveryaddress+'</label>'+
		        '<label><input  type="text" class="input-inline delivery_address1 " autocomplete="off" name="delivery_address1"></label>' +
		        '</div>' +
		        '<div class="editable-location">' +
		        '<label><input  type="text" class="input-inline delivery_address2 " autocomplete="off" name="delivery_address2"></label>' +
		        '</div></div><div class="span5 delivery_address_right">';

				if(lang == 'nb'){
					tpl += '<label class="e_delivery_zip_label" style="margin-left: -138px;margin-top: 4px;">'+om_td.Zip+', '+om_td.City+'</label>';
				}
				else{ 
					tpl += '<label class="e_delivery_zip_label" style="margin-left: -84px;margin-top: 4px;">'+om_td.Zip+', '+om_td.City+'</label>';
				}
		        tpl += '<div class="editable-location" style="margin-top: -26px;">' +
		        '<label class="inline_delivery_zip_label hide">'+om_td.Zip+', '+om_td.City+'</label>'+
		        '<label><input type="text" class="input-inline delivery_zip" id="delivery_zip" autocomplete="off" name="delivery_zip" style="width:40px;"></label><label><input style="width:93px;"  type="text" class="input-inline delivery_city "  name="delivery_city" autocomplete="off" id="delivery_city"></label>' +
		        '</div>' +
		        '<div class="editable-location">' +
		        '<label><select name="delivery_country" id="customer_delivery_country" autocomplete="off" class="input-inline-maxi delivery_country"></select></label>' +
		        '</div>'+
		        '<label class="e_delivery_address_label" style="margin-left: -123px;">'+om_td.Deliveryphone+'</label>'+
		        '<div class="editable-location" style="margin-top: -23px;">' +
		        '<label class="inline_delivery_address_label hide">'+om_td.Deliveryphone+'</label>'+
		        '<label><input type="text" class="input-inline delivery_phone_code" readonly id="delivery_phone_code" name="delivery_phone_code" style="width:40px;"></label><label><input style="width:93px;" type="text" class="input-inline delivery_phone " name="delivery_phone" id="delivery_phone"></label>' +
		        '</div></div></div>';

		    Location.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		       	tpl: tpl,
		        inputclass: '',
		        showbuttons: 'bottom',
		        sourceCountry: [],
		    });

		    $.fn.editabletypes.location = Location;
		}(window.jQuery));

		(function($){
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
		}(window.jQuery));


		order_modify.bindCustomer();
		
		var partner_contact_list = {};		
		for(var j in om_dt.getPartnerContactList){
			var d = om_dt.getPartnerContactList[j];
		}
		var order_date = convertDateIntoSiteFormat(om_dt.getOrderDetails.Order.created);

		$("#order_date").editable({
   			emptytext:om_td.Empty,
	       	value: order_date,  
	       	mode:'inline',  
	       	send: 'never',
	       	type: 'text',
	       	inputclass: 'order_date',
	       	showbuttons:'right',
	        success: function(data, config) {
	   		},
		});

		$("#order_date").on('shown', function(e, editable) {
			if (editable) {
		  		$('.order_date').inputmask(date_format_mask, {autoUnmask: false,'clearMaskOnLostFocus': false});
		  		$('.order_date').datepicker({
   					format:om_dt.date_format_f
   				}).change(function(){
   					$('.datepicker').remove();
   				});
			}
		});

		var our_ref_val = '';
		var partner_contact_list = [];
		for(var j in om_dt.getPartnerContactList){
			var d = om_dt.getPartnerContactList[j];
			var txt = checkNull(d.name)+ '<' + checkNull(d.email) + '>';
			var val = checkNull(d.email) + '##' + j;
			partner_contact_list.push({
				text:txt,
				value:val
			});

			if(checkNull(om_dt.getOrderDetails.Order.our_reference_id).trim() == j){
				our_ref_val = val;
			}
		}

		$("#our_ref").editable({
	       	value: our_ref_val,  
	       	mode:'inline',  
	       	type: 'select',
	       	showbuttons:false,
	        send: 'never',
	        emptytext: om_td.None,
	        source:partner_contact_list,
	        select2: {
	        	placeholder:om_td.Select,
				minimumResultsForSearch: -1,
			},
		});

		var customer_contact_list = [];
		var your_ref_val = '';
		for(var j in om_dt.customer_contact){
			var d = om_dt.customer_contact[j];
			if(checkNull(d.email) != ''){
				var txt = checkNull(d.name)+ '<' + checkNull(d.email) + '>';
			}
			else{
				var txt = checkNull(d.name);
			}
			var val = checkNull(d.email) + '##' + j;
			customer_contact_list.push({
				text:txt,
				value:val
			});

			if(checkNull(om_dt.getOrderDetails.Order.reference_contact_id) == j){
				your_ref_val = val;
			}
		}

		
		$("#your_ref").editable({
	       	value: your_ref_val,  
	       	mode:'inline',  
	       	type: 'select',
	       	showbuttons:false,
	        send: 'never',
	        emptytext: om_td.None,
	        source:customer_contact_list	,
	        select2: {
	        	placeholder:om_td.Select,
				minimumResultsForSearch: -1,
			},
		});

		var cache1 = {};
		var customerReferrerList = om_dt.getReferrerlist;
		
		$('#select_referrer').autocomplete({
			autoFocus: false,	
			source: function( request, response ) {
        		var term = request.term;
        		if( term in cache1 ) {
          			response( cache1[ term ] );
          			return;
        		}
        		var results = $.ui.autocomplete.filter(customerReferrerList, request.term);
        		cache1[ term ] = results;
                response(results.slice(0, 100));
  			},
			minLength: 1,
			select: function( event, data ) {
				if(data.item){
					if(data.item.id != '')
					{
						$('#referrer_id').val(data.item.id);
					}					
		    	}
			},
		});

		$('#select_referrer').val(checkNull(om_dt.getOrderDetails.Order.bp_referrer));
		$('#referrer_id').val(checkNull(om_dt.getOrderDetails.Order.bp_referrer_id));

		$('#description').editable({
	       	value: checkNull(om_dt.getOrderDetails.Order.description),  
	       	mode:'inline',  
	       	type: 'textarea',
	       	showbuttons:'bottom',
	        send: 'never',
	        inputclass:'mytextarea',
	        emptytext: om_td.$custom_text,
		});

		var delivery_methods = [{text:'',value:''}];
		var default_str = '';
		for(var j in om_dt.deliveryMethods){
			var d = om_dt.deliveryMethods[j];
			var id = j+'##'+d.value;
			var name = d.value;
			delivery_methods.push({
				text:name,
				value:id
			});
			
	
			if(checkNull(om_dt.getOrderDetails.Order.delivery_method) == j){
				default_str = id;
			}
		}

		if(om_dt.partnerSetting.enable_delivery_method == 'n'){
			default_str = '';
			$("#delivery_methods").parent().parent().hide();
		}

		$("#delivery_methods").editable({
	       	value: default_str,  
	       	mode:'inline',  
	       	type: 'select2',
	       	showbuttons:false,
	        send: 'never',
	        emptytext: om_td.None,
	        source:delivery_methods,
	        select2: {
	        	placeholder:om_td.Select,
				minimumResultsForSearch: -1,
				allowClear:true
			},
	        success: function(data, newValue) {
	        },
	    });

		delivery_addresses = {
			delivery_name:checkNull(om_dt.getOrderDetails.Order.delivery_name),
			delivery_address1:checkNull(om_dt.getOrderDetails.Order.delivery_address1),
			delivery_address2:checkNull(om_dt.getOrderDetails.Order.delivery_address2),
			delivery_zip:checkNull(om_dt.getOrderDetails.Order.delivery_zip),
			delivery_city:checkNull(om_dt.getOrderDetails.Order.delivery_city),
			delivery_country:checkNull(om_dt.getOrderDetails.Order.delivery_country),
			delivery_phone:checkNull(om_dt.getOrderDetails.Order.delivery_phone),
			delivery_phone_code:checkNull(om_dt.getOrderDetails.Order.delivery_phone_code),
		};

		var getAllCountryList = om_dt.getAllCountryList;
		var country_list = [];
		for(var j in getAllCountryList){
			country_list.push({
				text:getAllCountryList[j],
				value:j,
			});
		}

		$('#location').editable('destroy').html('');
		$('#location').editable({
			mode:'inline',  
			send:'never',
			value: delivery_addresses,
			sourceCountry:country_list,
			success:function(data,config){
				delivery_addresses = {
					delivery_name:config.delivery_name,
					delivery_address1:config.delivery_address1,
					delivery_address2:config.delivery_address2,
					delivery_zip:config.delivery_zip,
					delivery_city:config.delivery_city,
					delivery_country:config.delivery_country,
					delivery_phone:config.delivery_phone,
					delivery_phone_code:config.delivery_phone_code,
				};
			},
		});

		var ids = new Array();
		for(var j in om_dt.getLocationList){
			var d = om_dt.getLocationList[j];
			if(j==0){
				continue;
			}
			ids.push(j);
		}
		
		om_dt.loc_ids = '';
		if(ids.length != 0){
			om_dt.loc_ids = ids.join('_');
		}
		$('.all_products').uniform();

		$('#add_prod').click(function(){
			order_modify.generateProductLinesHtml();
		});

		$('#all_products').change(function(){
			var c = $('#all_products:checked').length;
			if(c == 1){
				$('.product_checkbox').prop('checked','checked');
			}
			else{
				$('.product_checkbox').removeAttr('checked');
			}
			$.uniform.update();
			$('.product_checkbox').trigger('change');
		}).uniform();

		$('#del_prod').click(function(){
			order_modify.removeProductLines();
		});


		$('#btn_product_bundle').click(function(){
			var warehouse_id = om_dt.warehouse_id;
			var url = base_url + 'sales/select_bundle?key='+global_linKy+'&warehouse_id='+warehouse_id+'&from=neworders';
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','900px');
			show_modal(a,'popups1');
		});

		if(om_dt.partnerSetting.enable_delivery_note == 'n'){
			om_dt.getOrderDetails.Order.delivery_note = '';
			$("#custom_delivery_note").parent().parent().hide();
		}
		$('#custom_delivery_note').editable({
	       	value: checkNull(om_dt.getOrderDetails.Order.delivery_note),  
	       	emptytext:om_td.Deliverynote,
	       	mode:'inline',  
	       	send: 'never',
	       	type: 'textarea',
	       	inputclass: '',
	       	showbuttons:'right',
	        success: function(data, config) {
	   		},
		});

		if(om_dt.getOrderDetails.OrderLine.length != 0){
			for(var j in om_dt.getOrderDetails.all_products){
				var d = om_dt.getOrderDetails.all_products[j];
				order_modify.generateProductLinesHtml();
				order_modify.autoFillProductLines(d,global_linKy);

				var ds = om_dt.getOrderDetails.OrderLine[j];
				order_modify.fillData(ds,global_linKy);
			}
		}
		else{
			om_dt.generateProductLinesHtml();
		}

		$('#btn_remove_sale_customer').click(function(){
			$('#html_sale_customer_details').hide();
			$('#salesSalesCustomerName').removeAttr('disabled').val('');
			$('#btn_search_sale_customer').show();
			$('#btn_edit_sale_customer,#btn_remove_sale_customer').hide();
			customerData = '';
			//customer_id = '';
			om_dt.customer_contact = [];
			order_modify.generateSalesField(om_dt.sales_fields,'y');
			

			try{
				$('#your_ref').editable('setValue','');
				$('#your_ref').editable('destroy');
				
			}catch(e){}

			

			order_modify.saveData();
		});

		$('#btn_search_sale_customer').click(function(){
			var product_ids = []
			$('.product_number').each(function(){
				var line_id = $(this).attr('data-line-key');
				var prod_id = $('#product_id_'+line_id).val();
				product_ids.push(prod_id);
			});

			var url = base_url + 'sales/search_customers?request_from=neworders';
			if(product_ids.length != 0){
				url += '&product_ids='+product_ids;
			}
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','850px');
			show_modal(a,'popups1');
			
		});

		var vat_required = om_dt.partnerSetting.vat_required;
 		if(vat_required == 'y'){
			$('#product_lines').on('keydown','.vat_level',function(event){
				if(event.keyCode  == 9){
					order_modify.checkFocusTab(event.target.name,event.target.id);
				}
			});
		}
		else{
			$('#product_lines').on('keydown','.discount_amount',function(event){
				if(event.keyCode  == 9){
					order_modify.checkFocusTab(event.target.name,event.target.id);
				}
			});
		}


 		$('#product_lines').on('focus','input',function(){
			if(this.type=='text'){
				LastFocusId= $(this).closest('tr').attr('data-line-key');
			}
		});

		$('#product_lines').on('click','input',function(){
			if(this.type=='text'){
				LastFocusId= $(this).closest('tr').attr('data-line-key');
			}
		});


	},
	checkFocusTab:function(){
		if("order_modify" in window && typeof(order_modify.generateProductLinesHtml) == 'function'){
			order_modify.generateProductLinesHtml();
		}
	},
	bindCustomer:function(){
		var customer_id  = checkNull(customerData.Customer.id);	
		var customer_name = checkNull(om_dt.getOrderDetails.Order.customer_name);
		var salesSalesAddress1 = checkNull(om_dt.getOrderDetails.Order.address1);
		var salesSalesAddress2 = checkNull(om_dt.getOrderDetails.Order.address2);
		var salesSaleZip = checkNull(om_dt.getOrderDetails.Order.zip);
		var salesSaleCity = checkNull(om_dt.getOrderDetails.Order.city);
		var salesSaleCountry = checkNull(om_dt.getOrderDetails.Order.country_code);
		var salesSaleEmail = checkNull(customerData.Customer.customer_email);


		$('#salesSalesCustomerName').val(customer_name);
		$('#label_salesSalesAddress1').html(salesSalesAddress1);
		$('#label_salesSalesAddress2').html(salesSalesAddress2);

		var label_salesSalesZipCity = '';
		if(salesSaleZip != ''){
			label_salesSalesZipCity += salesSaleZip+', ';
		}
		if(salesSaleCity != ''){
			label_salesSalesZipCity += salesSaleCity;
		}
		$('#label_salesSalesZipCity').html(label_salesSalesZipCity);

		var getAllCountryList = om_dt.getAllCountryList;
		var scoun = '';
		for(var j in getAllCountryList){
			if(j == salesSaleCountry)
				scoun = getAllCountryList[j];
		}
		$('#label_salesSalesCountry').html(scoun);
		if(salesSaleCountry==''){
			$('#sale_country_row').hide();
		}
		else{
			$('#sale_country_row').show();
			if((om_dt.partner_country ==  salesSaleCountry) && om_dt.partnerSetting.show_customer_country == 'n'){
				$('#sale_country_row').hide();
			}
		}

		$('#label_salesSalesEmail').html(salesSaleEmail);
		$('#html_sale_customer_details').show();
		$('#btn_search_sale_customer').hide();
		$('#btn_edit_sale_customer,#btn_remove_sale_customer').show();

	},
	changeProductPrices:function(d){
		var prodData = order_modify.saveData();
		if(prodData.all_products.length != 0 && checkNull(d.Customer.price_group_id) != ''){
			for(var j in prodData.all_products){
				if(checkNull(j) == '' || checkNull(prodData.all_products[j]) == ''){

				}
				else{
					var ds = prodData.all_products[j];


					var price2 = '';
					var price1 = '';
					var price = '';

					var vat_level2 = '';
					var vat_level1 = '';
					var vat_level = '';

					
					var i = 0;
					var found = 'no';
					for(var k in ds.ProductData.ProductPrice){
						var datas = ds.ProductData.ProductPrice[k];
						if(i==1){
							price1 = d.price;
							vat_level1 = d.vat_level;
						}
						if(d.Customer.price_group_id ==  datas.price_group_id){
							found = 'yes'
							price2 = datas.price;
							vat_level2 = datas.vat_level;
							break;
						}
					}
					if(found == 'yes'){
						price = price2;
						vat_level = vat_level2;
					}
					else{
						price = price1;
						vat_level = vat_level1;
					}

					$('#unit_price_'+j).val(convertIntoLocalFormat(checkNull(price))).trigger('change');
					$('#vat_level_'+j).val(vat_level).trigger('change');
				}
			}
		}
	},
	getAndSaveCustomer:function(){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:customer_id
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerView.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var dt = complet_data.response.response;
				order_modify.changeCust(dt);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',sls_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',sls_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	changeCust:function(dtas){
		var d = dtas.customer;

		customerData = d;
		customer_id = d.Customer.id;

		om_dt.getOrderDetails.Order.customer_name = checkNull(customerData.Customer.customer_name);
		om_dt.getOrderDetails.Order.address1 = checkNull(customerData.Customer.customer_address1);
		om_dt.getOrderDetails.Order.address2 = checkNull(customerData.Customer.customer_address2);
		om_dt.getOrderDetails.Order.zip = checkNull(customerData.Customer.customer_zip);
		om_dt.getOrderDetails.Order.city = checkNull(customerData.Customer.customer_city);
		om_dt.getOrderDetails.Order.country = checkNull(customerData.Customer.customer_country);
		om_dt.getOrderDetails.Order.customer_id = customerData.Customer.id; 

		order_modify.bindCustomer(2);
		order_modify.changeProductPrices(d);

		om_dt.customer_contact = dtas.customer_contact;
		order_modify.generateSalesField(om_dt.sales_fields,'y');
		var customer_contact_list = [];
		for(var j in dtas.customer_contact){
			var dt = dtas.customer_contact[j];
			if(checkNull(dt.name).trim() == ''){
				continue;
			}
			if(checkNull(dt.email) != ''){
				var txt = checkNull(dt.name)+ '<' + checkNull(dt.email) + '>';
			}
			else{
				var txt = checkNull(dt.name);
			}
			
			var val = checkNull(dt.email) + '##' + j;
			customer_contact_list.push({
				text:txt,
				value:val
			});

		}

		
		$("#your_ref").editable({
	       	value: '',  
	       	mode:'inline',  
	       	type: 'select',
	       	showbuttons:false,
	        send: 'never',
	        emptytext: om_td.None,
	        source:customer_contact_list	,
	        select2: {
	        	placeholder:om_td.Select,
				minimumResultsForSearch: -1,
			},
		});
	},
	calLineTotal:function(lk=''){
		var enable_inventory = om_dt.partnerSetting.enable_inventory;
		var arr= [];
		var arr2 = [];
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
			qty = parseFloat(convertIntoStandardFormat(qty));

			var percentage = $("#vat_level_"+line_key+" option:selected").text();
			percentage = percentage.trim();
			if(!IsNumeric(percentage) || percentage == '-'){
				percentage = '0';
			}
			percentage = parseFloat(percentage);
			var total_amount = roundNumber((parseFloat(unit_price_val) * parseFloat(qty)));

			var tax = 0;
			var dis_total = total_amount - discount_amount_val;
			var vat_enabled = om_dt.partnerSetting.vat_required;
			if(vat_enabled=='y'){
				 tax = roundNumber((parseFloat(dis_total) * parseInt(percentage))/ 100);
			}


			if(discount_amount_val > total_amount){
				$('#discount_amount_'+line_key).val('0,00');
				discount_amount_val = 0;
				showAlertMessage(om_td.Thediscountshouldnotbegreaterthannetamount,'error',om_td.Alertmessage);
			}
			
			total_amount = roundNumber(parseFloat(total_amount) - parseFloat(discount_amount_val) + parseFloat(tax));
			$('#gross_amount_'+line_key).val(convertIntoLocalFormat(roundNumber(total_amount)));
			
		}

		if(lk!=''){
			var res = {
				total_amount:total_amount,
				gross_amount:dis_total,
				tax:tax
			}
			
		}

		var net_amount = 0;
		var total_tax = 0;
		var total_discount = 0;
		var invoice_gross_amount = 0;
		var total_w_d = 0;
		arr = [];
		$('#product_lines tbody tr').each(function(){
			var lkk = $(this).attr('data-line-key');
			arr.push(lkk);
		});
		var table = '';
		var tabledata  = {};
		for(j in arr){
			
			var line_key = arr[j];
			var unit_price_val = $('#unit_price_'+line_key).val();
			unit_price_val = convertIntoStandardFormat(unit_price_val.trim());

			var discount_amount_val = $('#discount_amount_'+line_key).val();
			discount_amount_val = parseFloat(convertIntoStandardFormat(discount_amount_val.trim()));
			total_discount = parseFloat(total_discount) + parseFloat(discount_amount_val);
			var qty = $('#qty_'+line_key).val();
			qty = parseFloat(qty);

			var v = $("#vat_level_"+line_key).val();
			var percentage = $('#vat_level_'+line_key+' option[value="'+v+'"]').text();

			percentage = percentage.trim();

			if(!IsNumeric(percentage) || percentage == '-'){
				percentage = '0';
			}
			percentage = parseFloat(percentage);
		
			var total_amount = roundNumber((parseFloat(unit_price_val) * parseFloat(qty)));
			
			net_amount = parseFloat(total_amount) + parseFloat(net_amount);

			var tax = 0;
			var dis_total = total_amount - discount_amount_val;
			total_w_d = parseFloat(total_w_d) + parseFloat(dis_total);
			var vat_enabled = om_dt.partnerSetting.vat_required;
			if(vat_enabled=='y' && checkNull(percentage) != ''){
				tax = roundNumber((parseFloat(dis_total) * parseInt(percentage))/ 100);
				total_tax = parseFloat(total_tax) + parseFloat(tax);

				if(percentage in tabledata && checkNull(tabledata[percentage]) != ''){
					var d = parseFloat(checkNull(tabledata[percentage].dis_total,0)) + parseFloat(checkNull(dis_total,0));
					var e = parseFloat(checkNull(tabledata[percentage].tax,0)) + parseFloat(checkNull(tax,0));

					tabledata[percentage] = {
						dis_total:d,
						tax:e
					};
				}
				else{
					tabledata[percentage] = {
						dis_total:dis_total,
						tax:tax
					};					
				}
			}

			if(enable_inventory == 'y'){
				$('#qty_'+line_key).removeClass('inv_err');
				var v = $("#loc_"+line_key).val();
				var actual_inv = $('#loc_'+line_key+' option[value="'+v+'"]').attr('data-actual-inv');
				var inv_prod = $('#loc_'+line_key+' option[value="'+v+'"]').attr('inv_prod');
				if(inv_prod == 'y'){
					if(parseFloat(actual_inv) < parseFloat(qty)){
						$('#qty_'+line_key).addClass('inv_err');
					}
				}
			}



			if(discount_amount_val > total_amount){
				$('#discount_amount_'+line_key).val('0,00');
				discount_amount_val = 0;
				showAlertMessage(om_td.Thediscountshouldnotbegreaterthannetamount,'error',om_td.Alertmessage);
			}
			
			total_amount = roundNumber(parseFloat(total_amount) - parseFloat(discount_amount_val) + parseFloat(tax));
			invoice_gross_amount = parseFloat(invoice_gross_amount) + parseFloat(total_amount);

		}

		var round_off_val = 0;
		if(om_dt.partnerSetting.round_off == 'y'){
			if(checkNull(om_dt.getPartnerCountryDetails.Country.round_off) != ''){
				var v = getRoundOff(invoice_gross_amount,om_dt.getPartnerCountryDetails.Country.round_off);
				if(invoice_gross_amount != v){
					round_off_val = parseFloat(invoice_gross_amount) - parseFloat(v);
					if(round_off_val > 0){
						round_off_val = '-' + round_off_val; 
					}
				}
				
				else{
					v = parseFloat(v);
				}				
				invoice_gross_amount = v;

			}
		}
		//
	
		$('#invoice_net_amount').html(convertIntoLocalFormat(roundNumber(net_amount)));
		if(vat_enabled=='y'){
			if(checkNull(total_tax) != ''){
				$('#invoice_total_mva').html(convertIntoLocalFormat(roundNumber(total_tax)));
				$('#invoice_total_mva').parent().parent().show();
			}
			else{
				$('#invoice_total_mva').parent().parent().hide();
			}
		}
		else{
			$('#invoice_total_mva').parent().parent().hide();
		}


		
		if(checkNull(total_discount) != ''){
			$('#invoice_total_discount').html(convertIntoLocalFormat(-1 * roundNumber(total_discount)));
			$('#invoice_total_discount').parent().parent().show();
		}
		else{
			$('#invoice_total_discount').parent().parent().hide();
		}

		$('#invoice_gross_amount').html(convertIntoLocalFormat(roundNumber(total_w_d)));
		$('#calculate_round_off').html(convertIntoLocalFormat(roundNumber(round_off_val)));
		if(checkNull(round_off_val) == '' || checkNull(round_off_val) == 0){
			$('#calculate_round_off').parent().parent().hide();
		}
		else{
			$('#calculate_round_off').parent().parent().show();
		}
		$('#invoice_total_to_pay').html(convertIntoLocalFormat(roundNumber(invoice_gross_amount)));
		
		for(var j in tabledata){
			table += '<tr>';
				table += '<td>'+om_td.Outgoingvat+'</td>';
				table += '<td>'+j+' %</td>';
				table += '<td  style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(roundNumber(tabledata[j].dis_total))+'</td>';
				table += '<td style="text-align:right">'+CUR_SYM+' '+convertIntoLocalFormat(roundNumber(tabledata[j].tax))+'</td>';
			table += '</tr>';
		}

		$('#perform_vat_calculation').html(table);
		if($('#perform_vat_calculation tr').length == 0){
			$('.pvc_wrap').parent().css('display','block');
			$('.pvc_wrap').hide();
			$('.summary_block').removeClass('well');
			$('.summary_block div.row-fluid div:last').addClass('well')
		}
		else{
			$('.pvc_wrap').parent().css('display','flex');
			$('.pvc_wrap').show();
			$('.summary_block').addClass('well');
			$('.summary_block div.row-fluid div:last').removeClass('well')
		}


		for(var j in storage_timeouts){
			clearTimeout(storage_timeouts[j]);
		}
		storage_timeouts.push(setTimeout(function(){
			order_modify.saveData();
		},1));

		if(lk!=''){
			return res;
		}	
	},
	generateProductLinesHtml:function(){
		global_linKy++;
		var html = '';
		
		
		html += '<tr id="product_line_'+global_linKy+'" data-line-key="'+global_linKy+'">';	
			html += '<td>';
				html += '<input type="checkbox" name="product_checkbox" class="product_checkbox product_checkbox_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td class="checklist_hide">';
				html += '<div style="display:inline-block" class="dropdown">';
				html += '<button tabindex="-1f" id="ChecklistBtn_'+global_linKy+'" style="display:none;background-color: rgb(77, 144, 254);" data-toggle="dropdown" type="button" class="btn-xs my-btn dropdown-toggle">'+om_td.Select+'&nbsp;<i class="icon-angle-down"></i></button>';
				html += '<ul id="dropdown_menu_checklist" class="dropdown-menu" style="text-align:left;min-width:90px;">';
					html += '<li><a onclick="event.stopPropagation();order_modify.showCheck('+global_linKy+',1)" id="checkpopup_'+global_linKy+'" href="javascript:;" >'+om_td.Fillout+'</a></li>';
					html += '<li><a onclick="event.stopPropagation();order_modify.showCheck('+global_linKy+',0)" data-id="'+global_linKy+'" id="checkignore_'+global_linKy+'">'+om_td.Ignore+'</a></li>';
				html += '</ul>';
				html += '</div>';
				html += '<input type="hidden" id="fillChecklistsdata_'+global_linKy+'" class="fillChecklistsdata fillChecklistsdata_'+global_linKy+'" data-line-key="'+global_linKy+'" >';
			html += '</td>';

			html += '<td>';
				html += '<input type="text" id="product_number_'+global_linKy+'" class="input_color m-wrap span12 product_number product_number_'+global_linKy+'" data-line-key="'+global_linKy+'">';
				html += '<input type="hidden" id="product_id_'+global_linKy+'" class="product_id product_id_'+global_linKy+'" data-line-key="'+global_linKy+'">';

				html += '<input type="hidden" id="product_lineid_'+global_linKy+'" class="product_lineid product_lineid_'+global_linKy+'" data-line-key="'+global_linKy+'">';


				html += '<input type="hidden" id="product_numberhidden_'+global_linKy+'" class="product_numberhidden product_numberhidden_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input type="text" id="product_name_'+global_linKy+'" class="input_color m-wrap span12 product_name product_name_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td class="loc_hide loc_hide_'+global_linKy+'">';
				html += '<select type="text" id="loc_'+global_linKy+'" class="input_color m-wrap span12 loc loc_'+global_linKy+'" data-line-key="'+global_linKy+'">';
					for(var j in om_dt.getLocationList){
						var d = om_dt.getLocationList[j];
						if(j != 0){
							html += '<option value="'+j+'">'+d.location_name+'('+convertIntoLocalFormat(checkNull(d.actual_inventory))+')</option>';
						}
						else{
							html += '<option value="'+j+'">'+d.location_name+'</option>';
						}
						
					}

				html += '<select>';

				
			html += '</td>';
			html += '<input type="hidden" id="inventory_product_'+global_linKy+'" class="inventory_product inventory_product_'+global_linKy+'" data-line-key="'+global_linKy+'" >';

			html += '<input type="hidden" id="actual_inventory_'+global_linKy+'" class="actual_inventory actual_inventory_'+global_linKy+'" data-line-key="'+global_linKy+'" >';

			html += '<input type="hidden" id="all_location_id_'+global_linKy+'" class="all_location_id all_location_id_'+global_linKy+'" data-line-key="'+global_linKy+'" >';
			html += '<input type="hidden" id="partner_list_id_'+global_linKy+'" class="partner_list_id partner_list_id_'+global_linKy+'" data-line-key="'+global_linKy+'" >';

			html += '<td>';
				html += '<input type="text" id="qty_'+global_linKy+'" class="input_color m-wrap span12 qty qty_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<span class="text" id="unit_name_'+global_linKy+'" readonly="readonly"></span>'
				html += '<input type="hidden" id="unit_'+global_linKy+'" class="input_color m-wrap span12 text-right unit unit_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input type="text" id="unit_price_'+global_linKy+'" class="input_color m-wrap text-right span12 unit_price unit_price_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';	

			html += '<td>';
				html += '<input readonly="readonly" type="text" id="line_total_'+global_linKy+'" class="m-wrap text-right span12 line_total line_total_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';		

			html += '<td>';
				html += '<input type="text" id="discount_amount_'+global_linKy+'" class="input_color text-right m-wrap span12 discount_amount discount_amount_'+global_linKy+'" data-line-key="'+global_linKy+'">';
				html += '<input type="hidden" id="discount_'+global_linKy+'" class="input_color m-wrap span12 discount_amount discount_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td class="tax_hide tax_hide_'+global_linKy+'">';
				
				html += '<select  name="vat_level" id="vat_level_'+global_linKy+'" class="input_color vat_level m-wrap span12" >';
					html += '<option value="">';
						html += '';
					html += '</option>';
					for(var j in om_dt.getPartnerTaxLevelList){
						var tl = om_dt.getPartnerTaxLevelList[j];
						html += '<option value="'+j+'">';
							html += tl;
						html += '</option>';
					}
				html += '</select>';
			html += '</td>';

			html += '<td class="tax_hide tax_hide_'+global_linKy+'">';
				html += '<input readonly="readonly" type="text" id="mva_val_'+global_linKy+'" class="m-wrap text-right span12 mva_val mva_val_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';

			html += '<td>';
				html += '<input readonly="readonly" type="text" id="gross_amount_'+global_linKy+'" class="m-wrap text-right span12 gross_amount gross_amount_'+global_linKy+'" data-line-key="'+global_linKy+'">';
			html += '</td>';
			


			



		html += '</tr>';
		if(LastFocusId != '' && $('tr[data-line-key="'+LastFocusId+'"]').length != 0){
			$('tr[data-line-key="'+LastFocusId+'"]').after(html);
		}
		else{
			$('#product_lines tbody').append(html);
		}
		order_modify.bindProductLines();
	},
	bindProductLines:function(){
		var vat_required = om_dt.partnerSetting.vat_required;
		var enable_inventory = om_dt.partnerSetting.enable_inventory;
		var checklistcount = om_dt.checklistcount;

		if(vat_required=='n'){
			$('.perform_vat_calculation').parent().parent().parent().hide();
			$('.tax_hide').hide();
			$('select[name="vat_level"]').val('');
		}
		else{
			$('.tax_hide').show();
		}

		if(enable_inventory=='n'){
			$('.loc_hide').hide();
			$('select.loc').val('');
		}
		else{
			$('.loc_hide').show();
		}

		if(checkNull(checklistcount) > 0){
			$('.checklist_hide').show();
		}
		else{
			$('.checklist_hide').hide();
		}
		$('.product_checkbox_'+global_linKy).change(function(){
			var a = $('.product_checkbox:checked').length;
			var b = $('.product_checkbox').length;
			if(a == b){
				$('.all_products').prop('checked','checked');
			}
			else{
				$('.all_products').removeAttr('checked');
			}
			if(a > 0){
				$('#del_prod').show();
				$('#add_prod,#btn_product_bundle').hide();
			}
			else{
				$('#del_prod').hide();
				$('#add_prod,#btn_product_bundle').show();
			}
			$.uniform.update();
		}).uniform();
		
		
		$('#loc_'+global_linKy).select2({

		});
		$('#vat_level_'+global_linKy).select2({
			placeholder:om_td.Select,
			allowClear:true
		});
		order_modify.autoCompleteProductLines();
		setTimeout(function(){
			$('#product_number_'+global_linKy).focus();
		});
	},
	autoCompleteProductLines:function(){
		var TABKEY = 9;
		var availableTags =  om_dt.productData;

		$('#product_lines #product_number_'+global_linKy).autocomplete({
			autoFocus: true,
			minLength: 1,
			source: availableTags,
			change:function(event,data){
				var line_id = $(this).attr('data-line-key');
				var prod_no = $('#product_number_'+line_id).val();


			

				if(prod_no.length >= 4 && !isNaN(prod_no) ){
					console.log('prod_no_inside',prod_no);
					var found = 0;
					for(var k in  om_dt.productData){
						if(om_dt.productData[k]['prod_number'] == prod_no	){
							order_modify.getAutoFillProductLines(om_dt.productData[k]['id'],line_id);
							found = 1;
							break;
						}
					}

					if(found == 0){
						showAlertMessage(om_td.Invalidproduct,'error',om_td.alertmessage);
						if(data.item == null || data.item.id == 'add_new_product'){
							$('#product_number_'+line_id).val($('#product_numberhidden_'+line_id).val());
						}
					}
				}
				else{
					$('#product_number_'+line_id).val($('#product_numberhidden_'+line_id).val());
				}
			},
			select: function( event, data ) {
				var line_id = $(this).attr('data-line-key');
			
				$('#product_id_'+line_id).val(data.item.id);
				
				order_modify.getAutoFillProductLines(data.item.id,line_id);
			}
		});
	},
	getAutoFillProductLines:function(id,line_id){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			product_id:id,
			warehouse_id:om_dt.warehouse_id,
			location_id	:om_dt.loc_ids,
			from:'newsales'
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
				order_modify.autoFillProductLines(complet_data.response.response,line_id);

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',om_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',om_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	autoFillProductLines:function(product_data,line_id,qty=''){
		all_products[line_id] = product_data;
		var product = product_data.ProductData.Product;
		var productUnit = product_data.ProductData.ProductUnit;
		if("id" in product_data.ProductData.ProductPrice && product_data.ProductData.ProductPrice.id != ''){
			var productPrice = [];
			productPrice.push(product_data.ProductData.ProductPrice);
		}
		else{
			var productPrice = product_data.ProductData.ProductPrice;
		}
		for(var j in productPrice){
			productPrice[j].price = convertIntoLocalFormat(productPrice[j].price);
		}
		var stockProductsData =  product_data.ProductData.stockProductsData;
		var productCategory = product_data.ProductData.ProductCategory;


		for(var j in stockProductsData){
			var tl = stockProductsData[j];
			html += '<option value="'+j+'">';
				html += tl;
			html += '</option>';
		}

		var html = '';
		if(product.inventory_product == 'n'){
			html += '<select disabled type="text" id="loc_'+line_id+'" class="input_color m-wrap span12 loc loc_'+line_id+'" data-line-key="'+line_id+'">';
		}
		else{
			html += '<select type="text" id="loc_'+line_id+'" class="input_color m-wrap span12 loc loc_'+line_id+'" data-line-key="'+line_id+'">';
		}
		var max_unit_id = 0;
		var actual_inventory = 0;
		for(var j in stockProductsData){
			var d = stockProductsData[j];

			if(d.actual_inventory != 0){
				if(d.actual_inventory > actual_inventory){
					actual_inventory = d.actual_inventory ;
					max_unit_id = j;
				}
			}
		}
	
		for(var j in stockProductsData){
			var d = stockProductsData[j];
			if(j != 0){
				if(max_unit_id == j ){
					html += '<option value="'+j+'"  selected="selected" inv_prod="'+product.inventory_product+'" data-actual-inv="'+d.actual_inventory+'">'+d.location_name+'('+convertIntoLocalFormat(checkNull(d.actual_inventory))+')</option>';
				}
				else{
					html += '<option value="'+j+'" inv_prod="'+product.inventory_product+'" data-actual-inv="'+d.actual_inventory+'"> '+d.location_name+'('+convertIntoLocalFormat(checkNull(d.actual_inventory))+')</option>';
				}
				
			}
			else{
				if(max_unit_id == j ){
					html += '<option value="'+j+'" inv_prod="'+product.inventory_product+'" selected="selected"  data-actual-inv="0">'+d.location_name+'</option>';
				}
				else{
					html += '<option value="'+j+'" inv_prod="'+product.inventory_product+'" data-actual-inv="0">'+d.location_name+'</option>';
				}
			}
		}
		
		html += '</select>';

		$('.loc_hide_'+line_id).html(html);
		$('#inventory_product_'+line_id).val(product.inventory_product);
		
		$('#actual_inventory_'+line_id).val(actual_inventory);
		$('#all_location_id_'+line_id).val(max_unit_id+'_'+actual_inventory);


		
		$('#product_numberhidden_'+line_id).val(product.product_number);
		$('#product_number_'+line_id).val(product.product_number);
		$('#product_name_'+line_id).val(product.product_name);

		if(qty != ''){
			$('#qty_'+line_id).val(changeSiteNumberFormat(parseFloat(qty)));			
		}
		else{
			$('#qty_'+line_id).val(changeSiteNumberFormat(parseFloat(product.quantity)));			
		}
		
		var price2 = '';
		var price1 = '';
		var price = '';

		var vat_level2 = '';
		var vat_level1 = '';
		var vat_level = '';

		
		var i = 0;
		var found = 'no';
		for(var j in productPrice){
			i++;
			var d = productPrice[j];
			if(i==1){
				price1 = d.price;
				vat_level1 = d.vat_level;
			}

		
			if(checkNull(customerData) != ''){
				if(d.price_group_id ==  customerData.Customer.price_group_id){
					found = 'yes'
					price2 = d.price;
					vat_level2 = d.vat_level;
					break;
				}
			}
		}
		if(found == 'yes'){
			price = price2;
			vat_level = vat_level2;
		}
		else{
			price = price1;
			vat_level = vat_level1;
		}

		$('#unit_price_'+line_id).val(price).limitAmountPrice(8);
		$('#discount_amount_'+line_id).val(changeSiteNumberFormat(parseInt(product.discount))).limitAmountPrice(8);
		$('#gross_amount_'+line_id).val(changeSiteNumberFormat(parseInt(product.total_amount)));

		$('#discount_amount_'+line_id).calculateDiscount(line_id);

		$('#unit_'+line_id).val(product.product_unit_id);
		$('#unit_name_'+line_id).html(productUnit.unit_name);
		
		$('#qty_'+line_id).change(function(){
			order_modify.calLineTotal(line_id);
		});

		$('#discount_amount_'+line_id).change(function(){
			order_modify.calLineTotal(line_id);
		});
		$('.loc_'+line_id).change(function(){
			order_modify.calLineTotal(line_id);
		});
		
		$('#unit_price_'+line_id).change(function(){
			order_modify.calLineTotal(line_id);
		});
		$('#vat_level_'+line_id).change(function(){
			order_modify.calLineTotal(line_id);
		});


		$('.loc_'+line_id).select2().change(function(){
			var v  = $(this).val();
			for(var j in stockProductsData){
				if(j == v){
					var d = stockProductsData[j];
					$('#inventory_product_'+line_id).val(product.inventory_product);
					$('#actual_inventory_'+line_id).val(d.actual_inventory);
					$('#all_location_id_'+line_id).val(j+'_'+d.actual_inventory);
				}
				order_modify.calLineTotal(line_id);
			}

		});
		if(product.line_vat!=0){
			$('#vat_level_'+line_id).val(vat_level).trigger('change');
		}
	
		
		limitBundlePrice('#qty_'+line_id,6);	

		limitPrice('#unit_price_'+line_id,9);

		if(checkNull(product.partner_list_id) != '' || checkNull(productCategory.partner_list_id) != ''){
			$('#ChecklistBtn_'+line_id).show();
		}
		else{
			$('#ChecklistBtn_'+line_id).hide();
		}
		var partner_list_id = checkNull(product.partner_list_id);
		if(checkNull(partner_list_id) == ''){
			partner_list_id = checkNull(productCategory.partner_list_id);
		}
		$('#partner_list_id_'+line_id).val(partner_list_id);
		order_modify.calLineTotal(line_id);
		$('#product_name_'+line_id).focus();
	},
	fillData:function(d,line_key){
		$('#product_name_'+line_key).val(checkNull(d.product_name));
		$('#product_lineid_'+line_key).val(checkNull(d.id));
		var location_id = '';
		if(checkNull(d.location_id) != ''){
			var dsd = d.location_id.split('_');
			location_id = checkNull(dsd[0]);
		}
		$('#product_id_'+line_key).val(checkNull(d.product_id));
		if(checkNull(location_id) != ''  && checkNull(location_id) != 0){
			$('#loc_'+line_key).val(checkNull(location_id)).trigger('change');
		}
		
		$('#qty_'+line_key).val(changeSiteNumberFormat(parseFloat(checkNull(d.qty,0)))).trigger('change');
		$('#vat_level_'+line_key).val(checkNull(d.partner_tax_level_id)).trigger('change');
		$('#unit_price_'+line_key).val(convertIntoLocalFormat(checkNull(d.unit_price))).trigger('change');
		$('#discount_amount_'+line_key).val(convertIntoLocalFormat(checkNull(d.discount))).trigger('change');
		if(checkNull(d.answers) == '' || d.answers == 'null'){
			d.answers = JSON.stringify({ignore:1});
		}
		else{
			d.answers = JSON.stringify(d.answers);
		}
		$('#fillChecklistsdata_'+line_key).val(d.answers).trigger('change');	
		
	
		if(checkNull(d.answers) != ''){
			var ds = d.answers;
			ds = JSON.parse(ds);

			if(ds.saveclick){
				$('#ChecklistBtn_'+line_key).css('background-color','green');
			}
			else if(ds.ignore){
				$('#ChecklistBtn_'+line_key).css('background-color','gray');
			}
			else{
				$('#ChecklistBtn_'+line_key).css('background-color','rgb(77, 144, 254)');
			}
		}
	},
	updateChecklist:function(data,line_id){
		$('#fillChecklistsdata_'+line_id).val(JSON.stringify(data));
		order_modify.saveData();
	},
	saveData:function(){
		var your_ref_d =  $('#your_ref').editable('getValue').your_ref;
		var your_ref = '';
		var your_ref_e = '';
		if(checkNull(your_ref_d) != ''){
			your_ref_d = your_ref_d.split('##');
			your_ref_e = checkNull(your_ref_d[0]);
			your_ref = checkNull(your_ref_d[1]);
		}
		var reference_contact_id = checkNull(your_ref);

		var our_ref_d = $('#our_ref').editable('getValue').our_ref;
		var our_ref = '';
		var our_ref_e = '';
		if(checkNull(our_ref_d) != ''){
			our_ref_d = our_ref_d.split('##');
			our_ref_e = checkNull(our_ref_d[0]);
			our_ref = checkNull(our_ref_d[1]);
		}
		
		var bp_referrer_id = $('#referrer_id').val();
		var description = checkNull($('#description').editable('getValue').description,'');

		var order_date = $('#order_date').editable('getValue').order_date;
		if(checkNull(order_date) != ''){
			var a = document.createElement('input');
			$(a).attr('type','text')
			$(a).datepicker({
				format:om_dt.date_format_f
			})
			$(a).val(order_date);
			var v = moment($(a).datepicker('getDate')).format('YYYY-MM-DD');
			order_date = v;
		}

		var currency_id = 1;
		var apply_tax = om_dt.partnerSetting.vat_required;
		if(apply_tax == 'y'){
			apply_tax = true;
		}
		else{
			apply_tax = '';
		}


		var login_id = $('#login_id').val();

		var location = $('#location').editable('getValue').location;

		var delivery_methods_val = $('#delivery_methods').editable('getValue').delivery_methods;
		var delivery_method = '';
		if(checkNull(delivery_methods_val) != ''){
			delivery_methods_val = delivery_methods_val.split('##');
			delivery_method = checkNull(delivery_methods_val[0]);
		}
		var delivery_note = $('#custom_delivery_note').editable('getValue').custom_delivery_note;

		var arr= [];
		$('#product_lines tbody tr').each(function(){
			var lkk = $(this).attr('data-line-key');
			arr.push(lkk);
		});
		var prod_data = [];
		for(j in arr){
			var obj = {};
			var line_key = arr[j];
			var unit_price_val = $('#unit_price_'+line_key).val();
			unit_price_val = convertIntoStandardFormat(unit_price_val.trim());

			obj.product_id = $('#product_id_'+line_key).val();
			obj.product_number = $('#product_numberhidden_'+line_key).val();
			obj.product_name = $('#product_name_'+line_key).val();
			obj.unit_price = unit_price_val;
	

			var discount_amount_val = $('#discount_amount_'+line_key).val();
			discount_amount_val = parseFloat(convertIntoStandardFormat(discount_amount_val.trim()));

			obj.discount = discount_amount_val

			var qty = $('#qty_'+line_key).val();
			qty = parseFloat(convertIntoStandardFormat(qty));

			obj.qty = qty;

			var percentage = $("#vat_level_"+line_key+" option:selected").text();
			percentage = percentage.trim();
			if(!IsNumeric(percentage) || percentage == '-'){
				percentage = '0';
			}
			percentage = parseFloat(percentage);
			var total_amount = roundNumber((parseFloat(unit_price_val) * parseFloat(qty)));
			$('#line_total_'+line_key).val(convertIntoLocalFormat(roundNumber(total_amount)));
			var tax = 0;
			var dis_total = total_amount - discount_amount_val;
			var vat_enabled = om_dt.partnerSetting.vat_required;
			if(vat_enabled=='y'){
				 tax = roundNumber((parseFloat(dis_total) * parseInt(percentage))/ 100);
				 $('#mva_val_'+line_key).val(convertIntoLocalFormat(checkNull(tax,0)));
			}
			var partner_tax_level_id = $("#vat_level_"+line_key).val();

			var unit_id = $('#unit_'+line_key).val();

			if(vat_enabled=='y'){
				obj.partner_tax_level_id = checkNull(partner_tax_level_id,0);
			}
			else{
				obj.partner_tax_level_id = 0;
			}
			obj.vat = tax;
			obj.gross_amount = total_amount;
			
			var product_lineid = $('#product_lineid_'+line_key).val();

			obj.line_id = product_lineid;
			obj.text_line = 'n';
			obj.actual_inventory = $('#actual_inventory_'+line_key).val(); 
			if($('#inventory_product_'+line_key).val() == 'y'){
				obj.location_id = $('#all_location_id_'+line_key).val();
			}
			else{
				obj.location_id = null;
			}
			obj.fillChecklistsdata = $('#fillChecklistsdata_'+line_key).val();
			obj.partnerListId = $('#partner_list_id_'+line_key).val();
			obj.line_key = line_key;
			obj.unit_id = unit_id;
			prod_data.push(obj);
		}

		var sales_fieldsz = {};
		var sales_fields = {};
		try{
			sales_fieldsz = $('#salesfield').editable('getValue').salesfield;
			for(var j in sales_fieldsz){
				sales_fields[field_id_name[j]] = sales_fieldsz[j];
			}
		}catch(e){}

		var ip = '';
		var save_params = {
			order_id:om_dt.getOrderDetails.Order.id,
			login_id:login_id,
			customer_id:om_dt.getOrderDetails.Order.customer_id,
			customer_name:om_dt.getOrderDetails.Order.customer_name,
			address1:om_dt.getOrderDetails.Order.address1,
			address2:om_dt.getOrderDetails.Order.address2,
			zip:om_dt.getOrderDetails.Order.zip,
			city:om_dt.getOrderDetails.Order.city,
			country_code:om_dt.getOrderDetails.Order.country_code,
			delivery_name:checkNull(location.delivery_name),
			delivery_address1:checkNull(location.delivery_address1),
			delivery_address2:checkNull(location.delivery_address2),
			delivery_zip:checkNull(location.delivery_zip),
			delivery_city:checkNull(location.delivery_city),
			delivery_phone_code:checkNull(location.delivery_phone_code),
			delivery_phone:checkNull(location.delivery_phone),
			delivery_country:checkNull(location.delivery_country),
			bp_referrer_id:bp_referrer_id,
			apply_tax:apply_tax,
			our_ref:our_ref_e,
			your_ref:your_ref_e,
			currency_id:currency_id,
			order_date:order_date,
			reference_contact_id:your_ref,
			description:description,
			delivery_method:delivery_method,
			delivery_note:delivery_note,
			ip_address:ip,
			all_products:all_products,
			product_lines:prod_data,
			sales_fields:sales_fields
		};

		return save_params;
	},
	showCheck:function(line_id,frm){
		if(frm == 1){
			var partner_list_id = $('#partner_list_id_'+line_id).val();
			var a = document.createElement('div');
			var ans = $('#fillChecklistsdata_'+line_id).val();
			$(a).attr('data-url', base_url + 'sales/fill_checklists/'+partner_list_id+'?line_key='+line_id+'&from=neworders&ans='+ans);
			$(a).attr('data-width','800px');
			show_modal(a,'popups');
		}
		else{
			//ignore
			$('#ChecklistBtn_'+line_id).parent().removeClass('open');
			$('#ChecklistBtn_'+line_id).css('background-color','grey');
			var obj = {ignore:1};
			$('#fillChecklistsdata_'+line_id).val(JSON.stringify(obj)).trigger('change');
		}
	},
	removeProductLines:function(){
		var yes = function(){
			$('.product_checkbox:checked').each(function(){
				var a = $(this).attr('data-line-key');
				delete all_products[a];
				$('#product_line_'+a).remove();
				
			});
			if($('#product_lines tbody tr').length==0){
				order_modify.generateProductLinesHtml();
			}
			$('.all_products').prop('checked',false); 

			var a = $('.product_checkbox:checked').length;
			var b = $('.product_checkbox').length;
			if(a == b){
				$('.all_products').prop('checked','checked');
			}
			else{
				$('.all_products').removeAttr('checked');
			}
			if(a > 0){
				$('#del_prod').show();
				$('#add_prod,#btn_product_bundle').hide();
			}
			else{
				$('#del_prod').hide();
				$('#add_prod,#btn_product_bundle').show();
			}
			$.uniform.update();	
			order_modify.calLineTotal();
		};
		var no = function(){
		}
		showDeleteMessage(om_td.$del_sel_line,om_td.Confirmation,yes,no,'ui-dialog-blue',om_td.Delete,om_td.Cancel);
	},
	addProductBundle:function(data,qty){
		$('.product_checkbox').each(function(){
	  		var a = $(this).attr('data-line-key');
			if(checkNull($('#product_id_'+a).val() == '')){
				$('#product_line_'+a).remove();
			}
		});
		for(var j in data){
			order_modify.generateProductLinesHtml();
			var d = {ProductData:data[j]};
			var qqty = checkNull(data[j].Product.quantity,1) * qty;
			order_modify.autoFillProductLines(d,global_linKy,qqty);
		}
	},
	modify:function(){
		var p = order_modify.saveData();
		p['sales_fields'] = JSON.stringify(p['sales_fields']);
		delete p.all_products;

		var errmsg = '';

		if(checkNull(p.customer_id) == ''){
			errmsg += om_td.Customer + '<br/>';
		}

		if(checkNull(p.order_date) == ''){
			errmsg += om_td.Orderdate + '<br/>';
		}

		if(p.product_lines.length > 0){
			var arr= [];
			$('#product_lines tbody tr').each(function(){
				var lkk = $(this).attr('data-line-key');
				arr.push(lkk);
			});
			var frl = om_td.forlinenumber;
			var c = 1;
			for(var j in arr){
				var line_id = arr[j];
				var obj = {};
				var pr_id = $('#product_id_'+line_id).val();
				var pr_no =  $('#product_numberhidden_'+line_id).val();


				if(pr_id=='' || pr_id==undefined || pr_id==null){
					errmsg += om_td.Product+' '+frl+' '+c+'<br/>';
				}
				else{
					var qty = convertIntoStandardFormat($('#qty_'+line_id).val());
					if(qty=='' || qty==undefined || qty==null || qty==0){
						errmsg += om_td.Quantity+' '+frl+' '+c+'<br/>';
					}
					
					var unit_price = convertIntoStandardFormat($('#unit_price_'+line_id).val());
					
					if(checkNull(unit_price) == ''){
						errmsg += om_td.UnitPrice+' '+frl+' '+c+'<br/>';
					}
					
				}
				var pr_name = $('#product_name_'+line_id).val().trim();
				if(checkNull(pr_name) == ''){
						errmsg += om_td.Description+' '+frl+' '+c+'<br/>';
				}
				var unit_id = $('#unit_'+line_id).val().trim();
				var unit_price = $('#unit_price_'+line_id).val().trim();
				
				if(checkNull(unit_price) != ''){
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

				var a = order_modify.calLineTotal(line_id);

				var vat = a.tax;

				var gross_amount =  $('#gross_amount_'+line_id).val();

				if(gross_amount!='' && gross_amount!=undefined && gross_amount!=null){
					gross_amount = convertIntoStandardFormat(gross_amount);
				}
				else{
					gross_amount = 0;
				}

				var chckdata =  $('#fillChecklistsdata_'+line_id).val();
				var partner_list_id =  $('#partner_list_id_'+line_id).val();
				
				if(checkNull(chckdata) == '' && checkNull(partner_list_id) != ''){
					errmsg += om_td.Checklistoption+' '+frl+' '+c+'<br/>';
				}
				c++;
			}
		}
		else{
			errmsg += om_td.Productlines + '<br/>';
		}

		if(errmsg != ''){
			errmsg = om_td.Pleasecheckthefollowingfields + '<br/>' + errmsg;
			showAlertMessage(errmsg,'error',om_td.alertmessage);
			return ;
		}

		var totalParams = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};

		var total_params = Object.assign(p,totalParams);

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Orders/editOrder.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				call_toastr('success',om_td.Success,complet_data.response.response.message.msg);
				
				new_custom_main_page2('/'+type+'/order/order_details/'+om_meta.order_id,'orders_list','orders_list','order_details',{order_id:om_meta.order_id});
						
			}
			else{
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						if($.isPlainObject(value) && !$.isEmptyObject(value)){
							var a = $.map(value, function(v, u) {
								return v+'<br />';
							});
							return a;
						}
						else{
							return value+'<br />';
						}
						
					});
					showAlertMessage(array,'error',om_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',om_td.alertmessage);
					return;
				}
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
		return;

		
	},
	generateSalesField:function(data,cust_change='n'){
		
		var sales_fields = om_dt.getOrderDetails.Order.sales_fields;
		try{
			sales_fields = JSON.parse(sales_fields);
		}catch(e){}

		var htmls = '';
		var values = {};
		var valuesz = [];
		var count = 0;
		for(var j in data){
			var docField = data[j]['CustomSalesdocField'];
			var customField = data[j]['CustomerCustomField'];

			var th_ans = '';
			if(docField.type == 'customer_customfields'){
				count++;
				var field_id = customField.custom_field;
				field_id = field_id.replace(/\s/g,'');
				field_id_name[field_id] = customField.custom_field;
				var found = 0;

				if(cust_change == 'y' && customer_id != ''){
					var saved_ans = [];
					try{
						saved_ans = customerData.CustomerCustomField.answers;
						saved_ans = JSON.parse(saved_ans);
						for(var j in saved_ans){
							for(var k in saved_ans[j]){
								var d = saved_ans[j][k];
								var field_idz = k.replace(/\s/g,'');
								if(field_idz == customField.custom_field){
									if(checkNull(d).trim() != ''){
										th_ans = d;
										found = 1;
									}
									break;							
								}
							}
						}
					}
					catch(e){

					}
				}
				else if(checkNull(sales_fields) != ''){
					for(var j in sales_fields){

						var d = sales_fields[j];

						if(j == customField.custom_field){
							th_ans = d;
							found = 1;
							break;
						}
					}
				}

				if(found == 0){
					th_ans = checkNull(customField.custom_value);
					if(customField.type=='dropdown' || customField.type=='radio' ||  customField.type=='checkbox'){
						th_ans = '';
					}
				}
				values[field_id] = th_ans;
				

				if(customField.type=='text'){
					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label><input class="m-wrap" field_name="`+customField.custom_field+`" type="text" name="`+field_id+`" placeholder="`+checkNull(customField.custom_value)+`" ></label></div>`;
					valuesz.push({field_id:field_id,th_ans:th_ans,type:'text'});
				}
				else if(customField.type=='textarea'){
					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label><textarea class="m-wrap" type="text" field_name="`+customField.custom_field+`"  name="`+field_id+`" placeholder="`+checkNull(customField.custom_value)+`" ></label></div>`;
					valuesz.push({field_id:field_id,th_ans:th_ans,type:'textarea'});
				}
				else if(customField.type=='dropdown'){
					var opts = checkNull(customField.custom_value);
					if(opts!=''){
						opts = JSON.parse(opts);
					}
					else{
						opts = [];
					}

					var sel_plce = '';
					var options_html = '<option value=""></option>';
					for(var l in opts){
						var ds = opts[l];
						options_html += '<option value="'+ds.value+'">'+ds.value+'</option>';
						if(checkNull(ds.is_default)!=''){
							if(ds.is_default==1){
								sel_plce = ds.value;
							}
						}
					}

					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label><select class="m-wrap" type="text" field_name="`+customField.custom_field+`"  name="`+field_id+`" placeholder="`+checkNull(sel_plce)+`" >`+options_html+`</select></label></div>`;
					valuesz.push({field_id:field_id,th_ans:th_ans,type:'dropdown'});
				}
				else if(customField.type=='radio'){
					var opts = checkNull(customField.custom_value);
					if(opts!=''){
						opts = JSON.parse(opts);
					}
					else{
						opts = [];
					}
				
					var sel_plce = '';
					var options_html = '<option value=""></option>';
					for(var l in opts){
						var ds = opts[l];
						options_html += '<option value="'+ds.value+'">'+ds.value+'</option>';
						if(checkNull(ds.is_default)!=''){
							if(ds.is_default==1){
								sel_plce = ds.value;
							}
						}
					}
					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label><select class="m-wrap" type="text" field_name="`+customField.custom_field+`"  name="`+field_id+`" placeholder="`+checkNull(sel_plce)+`" >`+options_html+`</select></label></div>`;
					valuesz.push({field_id:field_id,th_ans:th_ans,type:'dropdown'});
				}
				else if(customField.type=='checkbox'){
					var opts = checkNull(customField.custom_value);
					var options = {};
					options[opts] = opts;
					var options_html = '';
					
					htmls += `<div class="editable-address"><p style="margin:0">`+customField.custom_field+`</p><label>`+opts+` <input class="m-wrap" type="checkbox" field_name="`+customField.custom_field+`"  value="`+opts+`" name="`+field_id+`" placeholder="`+checkNull(sel_plce)+`"></label></div>`;

					valuesz.push({field_id:field_id,th_ans:th_ans,type:'checkbox'});
					
				}
			}
			else if(docField.type == 'text'){
				count++;
				var field_id = docField.label;
				field_id = field_id.replace(/\s/g,'');
				field_id_name[field_id] = docField.label;
				var found = 0;
				var th_ans = '';
				
				if(checkNull(sales_fields) != ''){
					for(var j in sales_fields){

						var d = sales_fields[j];

						if(j == customField.custom_field){
							th_ans = d;
							found = 1;
							break;
						}
					}
				}

				if(found == 0){
					th_ans = checkNull(docField.default_value);
				}

				values[field_id] = th_ans;
				valuesz.push({field_id:field_id,th_ans:th_ans,type:'text'});
				if(docField.readonly == 1){
					htmls += `<div class="editable-address"><p style="margin:0">`+docField.label+`</p><label><input class="m-wrap" readonly="" type="text" field_name="`+docField.label+`"  name="`+field_id+`" class="" ></label></div>`;
				}
				else{
					htmls += `<div class="editable-address"><p style="margin:0">`+docField.label+`</p><label><input class="m-wrap" type="text" field_name="`+docField.label+`"  name="`+field_id+`" class="" ></label></div>`;
				}	
			}
			else if(docField.type == 'contact_person'){
				count++;
				var field_id = docField.label;
				field_id = field_id.replace(/\s/g,'');
				field_id_name[field_id] = docField.label;
				var found = 0;
				var th_ans = '';
				
				if(checkNull(sales_fields) != ''){
					for(var j in sales_fields){

						var d = sales_fields[j];

						if(j == docField.label){
							th_ans = d;
							found = 1;
							break;
						}
					}
				}

				var sel_plce = '';
				var options_html = '<option value=""></option>';
				var ans_found = 0;
				for(var j in om_dt.customer_contact){
					if(checkNull(om_dt.customer_contact[j].name).trim() == ''){
						continue;
					}

					var v = om_dt.customer_contact[j].name;
					if(docField.display_value == 'name'){

					}
					else if(docField.display_value == 'name_phoneno'){
						if(checkNull(om_dt.customer_contact[j]['cellphone']) != ''){
							v += ' - ' + om_dt.customer_contact[j]['cellphone'];
						}
					}
					else{
						if(checkNull(om_dt.customer_contact[j]['email']) != ''){
							v += ' - ' + om_dt.customer_contact[j]['email'];
						}
					}
					options_html += '<option class="m-wrap" value="'+v+'">'+v+'</option>';
					if(v == th_ans){
						ans_found = 1;
					}
				}
				if(ans_found == 0){
					th_ans = '';
				}
				values[field_id] = th_ans;

				valuesz.push({field_id:field_id,th_ans:th_ans,type:'select'});
				htmls += `<div class="editable-address"><p style="margin:0">`+docField.label+`</p><label><select class="m-wrap" name="`+field_id+`" field_name="`+docField.label+`"  placeholder="`+checkNull(docField.default_value)+`" >`+options_html+`</select></label></div>`;
			}
			else if(docField.type == 'date'){
				count++;
				var field_id = docField.label;
				field_id = field_id.replace(/\s/g,'');
				field_id_name[field_id] = docField.label;
				var found = 0;
				var th_ans = '';


				if(checkNull(sales_fields) != ''){
					for(var j in sales_fields){

						var d = sales_fields[j];

						if(j == docField.label){
							th_ans = d;
							found = 1;
							break;
						}
					}
				}

				if(found == 0){
					th_ans = checkNull(docField.default_value);
				}
				values[field_id] = th_ans;
				valuesz.push({field_id:field_id,th_ans:th_ans,type:'text'});
				htmls += `<div class="editable-address"><p style="margin:0">`+docField.label+`</p><label><input class="m-wrap" data-type="date" field_name="`+docField.label+`"  type="text"  name="`+field_id+`" class="" ></label></div>`;
			}
		}

		if(count == 0){
			return;
		}
		$.fn.editable.defaults.mode = 'inline';
		(function ($) {
		    "use strict";
		    
		    var Salefield = function (options) {
		        this.init('salefield', options, Salefield.defaults);
		    };

		    //inherit from Abstract input
		    $.fn.editableutils.inherit(Salefield, $.fn.editabletypes.abstractinput);

		    $.extend(Salefield.prototype, {
		     
		        render: function() {
	           		this.$input = this.$tpl.find('input');
		            this.$select = this.$tpl.find('select');
		            this.$select.select2({
		             	allowClear:true,
		            	placeholder:om_td.Select
		            });
		            this.$all  = this.$tpl.find('input,select');
		        },
		        value2html: function(value, element) {
		            if(!value) {
		                $(element).empty();
		                return; 
		            }		        
		           	var html = '';
		           	console.log('value',value);
		        	
		           	for(var j in value){
		           		var v = value[j];
			        	if(checkNull(v).trim() == ''){
			        		v = om_td.Empty;
			        	}
		           		html += '<div class="control-group"><label class="control-label" style="color:#000;">'+field_id_name[j]+'</label><div class="controls">'+v+'</div></div>';
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

					for(var k in value){
						if(this.$all.filter('[name="'+k+'"]').attr('type') == 'checkbox'){
							if(this.$all.filter('[name="'+k+'"]').val() == checkNull(value[k])){
								this.$all.filter('[name="'+k+'"]').attr('checked','checked').trigger('change');
		    				}
		    				else{
		    					this.$all.filter('[name="'+k+'"]').removeAttr('checked').trigger('change');
		    				}				
						}
						else{
							this.$all.filter('[name="'+k+'"]').val(checkNull(value[k])).trigger('change');
						}
					}
		 
		       	},           
		       input2value: function() { 
		       		var values = {};
		       		this.$all.each(function(){
		       			if(checkNull($(this).attr('name')) != ''){
		       				values[$(this).attr('name')] = $(this).val()
		       			}
		       		});
		       		return values;
		       },         
		       activate: function() {
		           $('#sales_fields').find('input[data-type="date"]').datepicker({
			   			format:om_dt.date_format_f
			   		}).change(function(){
			   			$('.datepicker').remove();
					});
		       },       
		       autosubmit: function() {
		           this.$input.keydown(function (e) {
		                if (e.which === 13) {
		                    $(this).closest('form').submit();
		                }
		           });
		       }       
		    });

		    Salefield.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
		        tpl: htmls,		             
		        inputclass: ''
		    });
		    $.fn.editabletypes.salefield = Salefield;
		}(window.jQuery));

		var html = '<a data-type="salefield" id="salesfield" name="salesfield"></a>';
		$('#sales_fields').html(html);

		$('#salesfield').editable({
	        url: '',
	        showbuttons:'bottom',
	        title: 'Delivery Address',
	        value: values,
	        success: function(data, config) {
 				console.log('config',config)
	        }
	    });

		return '';
	},
}

