var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var timeouts = [];
var global_price_update_data;
var glbl_pcu_pdt_trns_dt;
var w;
var selprod = {};
var man_count = 0;
var price_update = {
	start:function(){
		price_update.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Price update','Step','of','letter','Back','Next','Select','alert message','Please check the following fields','Letter','Return address','Ignore rows','Found total','success','Success','Yes','No','row','rows','View','records','next','prev','Type','Complete','Product group','Manual','Product category','Products','Action','Edit','Search product','Product name','Product number','Save','Close','Please select type1period1','Please select product group1period1','Product group','Product','Description','Default purchase price','Discard','Success','success','Pricing deleted successfully','Add product','Delete product','Pricing updated successfully','Update prices','$orderh','$orderhh','$sel_type','$sel_prod_grp'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getPriceUpdate.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				$.each(complet_data.response.response.translationsData, function (key, val) {
			        var str = val.replace(/1period1/g, ".");
			       	str = str.replace(/1comma1/g, ",");
			       	str = str.replace(/1que1/g, "?");
			        complet_data.response.response.translationsData[key] = str;
			    });
			    global_price_update_data = complet_data.response.response;
				glbl_pcu_pdt_trns_dt = complet_data.response.response.translationsData;
				price_update.createHtml(complet_data.response.response);
		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		glbl_pcu_pdt_trns_dt.dashboardurl = base_url+'dashboard/index';
		glbl_pcu_pdt_trns_dt.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('price_update_template').innerHTML;
		var compiledRendered = Template7(template, global_price_update_data);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		price_update.bindEvents();
		if(global_price_update_data.olddata!=undefined && global_price_update_data.olddata!=null && global_price_update_data.olddata!='' && global_price_update_data.olddata.length!=0){
			price_update.gnrtProdTable(global_price_update_data.olddata,global_price_update_data.productCategory,global_price_update_data.ProductPriceGroups,global_price_update_data.from);

		}
		//if(global_price_update_data.)

	},
	bindEvents:function(){
		w = $('#price_update_template_from').bootstrapWizard({
                'nextSelector': '.button-next',
             	'previousSelector': '.button-previous',
				onTabClick: function (tab, navigation, index) {
					return false;
				},
             	beforeNext: function (tab, navigation, index) {
             		$('.btn_dis,.btn_app').addClass('hide');
					var current = index + 1;
					if(current==2){
						return price_update.validateOne();
					}

                	return true;
                },
                onNext: function (tab, navigation, index) {
                 	
                },
                onPrevious: function (tab, navigation, index) {
                 
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#price_update_template_from').find('.bar_wizard').css({
                        width: $percent + '%'
                    });
                }
        	});	
		
		$('.uni').uniform();
		$('.cat').change(function(){
			price_update.handleCatCheck(this);
		});
		$('.all_cat').change(function(){
			if($('.all_cat:checked').length==1){
				$('.cat').prop('checked','checked').trigger('change');
			}
			else{
				$('.cat').removeAttr('checked').trigger('change');
			}
			$.uniform.update();
		});

		$('.all_prod').change(function(){
			if($('.all_prod:checked').length==1){
				$('.prod').prop('checked','checked');
			}
			else{
				$('.prod').removeAttr('checked');
			}
			$.uniform.update();
			$('.prod').trigger('change');
		});
		$('#prod_name').keyup(function(){
			console.log('change');
			if($(this).val()==''){
				$('.prod_tr').show();
			}
		});
		//$('.search').click(function(){
		$('#prod_name').keyup(function(){
		    var v = $('#prod_name').val();
		    var a = $("#prod_list_table tr:contains("+v+")");
		 
		    if(a.length!=0 && v!=''){
		    	
		    	$('.prod_tr').hide();
		    	$(a).show();
		    	
		    }
		    else{
		    	$('.prod_tr').show();
		    }
		});

		$('input[name=prod_type]').change(function(){
			var frm  = $(this).val();

			if(frm=='product_group'){
				$('#prod_cat_wrap').removeClass('hide');
			}
			else if(frm=='manual'){
				$('#prod_cat_wrap').addClass('hide');
			}
			else{
				$('#prod_cat_wrap').addClass('hide');
			}
		});

		$('.btn_dis').click(function(){
			price_update.updateStatus(0);
		});

		$('.btn_app').click(function(){
			price_update.updateStatus(1);
		});
		
	},
	validateOne:function(){ 
		if($('input[name=prod_type]:checked').length==0){
			var msg = glbl_pcu_pdt_trns_dt.$sel_type;
			showAlertMessage(msg,'error',glbl_pcu_pdt_trns_dt.alertmessage);
			return false;
		}
		var v = $('input[name=prod_type]:checked').val();
		if(v=='product_group'){
			if($.isEmptyObject(selprod)){
				var msg = glbl_pcu_pdt_trns_dt.$sel_prod_grp;
				showAlertMessage(msg,'error',glbl_pcu_pdt_trns_dt.alertmessage);
				return false;
			}
		}
        $('.button-next').addClass('hide');
       	$('.button-previous').addClass('hide');
		price_update.getProdOnCond();
	},
	getProdOnCond:function(){
		var v = $('input[name=prod_type]:checked').val();
		var order = $('input[name=order]:checked').val();
		var params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			order:order
		};
		if(v=='product_group'){
			params.from = 'product_group';
			params.options = JSON.stringify(selprod);
			price_update.getProdData(params,v);
		}
		else if(v=='complete'){
			params.from = 'complete';
			price_update.getProdData(params,v);
		}
		else if(v=='manual'){
			params.from = 'manual';
			price_update.generateManTable(global_price_update_data.ProductPriceGroups);
		}
		
		console.log(params);
	},
	updateStatus:function(status){
		showProcessingImage('undefined');
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			status:status
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/updatePriceupdateStatus.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				if(status==1){
					call_toastr(glbl_pcu_pdt_trns_dt.success, glbl_pcu_pdt_trns_dt.Success,glbl_pcu_pdt_trns_dt.Pricingupdatedsuccessfully);
				}
				else{
					call_toastr(glbl_pcu_pdt_trns_dt.success, glbl_pcu_pdt_trns_dt.Success,glbl_pcu_pdt_trns_dt.Pricingdeletedsuccessfully);
				}
				$('#prod_table').html('');
				$('.tab-pane').removeClass('active');
		        $('#tab1').addClass('active');
		        $('.button-previous').addClass('hide');
		        $('.button-next').removeClass('hide');
		        $('.btn_app,.btn_dis').addClass('hide');
		         $('.step-title', $('#price_update_template_from')).text(glbl_pcu_pdt_trns_dt.Step+' ' + 1 + ' '+glbl_pcu_pdt_trns_dt.of+' ' + 2);
		        $('#price_update_template_from').find('.bar_wizard').css({
		            width: '50%'
		        });
		        $(window).scrollTop(0);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	getProdData:function(total_params,from){
		showProcessingImage('undefined');
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getProductData.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				price_update.gnrtProdTable(complet_data.response.response.olddata,global_price_update_data.productCategory,global_price_update_data.ProductPriceGroups);

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	gnrtProdTable:function(products,categories,pricegrp,from){
		
		// console.log(categories);
		// console.log(pricegrp);
		$('.tab-pane').removeClass('active');
        $('#tab2').addClass('active');
        $('.button-previous').addClass('hide');
        $('.button-next').addClass('hide');
        $('.btn_app,.btn_dis').removeClass('hide');
        $('#price_update_template_from').find('.bar_wizard').css({
            width: '100%'
        });
        $('.step-title', $('#price_update_template_from')).text(glbl_pcu_pdt_trns_dt.Step+' ' + 2 + ' '+glbl_pcu_pdt_trns_dt.of+' ' + 2);
        var html = '';
        man_count = 0;
        for(var j in products){
        	var cat_name = '';
			for(var k in categories){
				if(categories[k].ProductCategory.id == j){
					cat_name = categories[k].ProductCategory.category;
					html += '<div class="row-fluid><div class="span12>';
						html += glbl_pcu_pdt_trns_dt.Productgroup+': '+cat_name;
					html += '</div></div>';
					break;
				}
			}
			html += '<div class="row-fluid><div class="span12><div class="table-responsive">';
				html += '<table class="table table-striped table-bordered table-hover">';
					html += '<thead><tr>';
						if(from == 'manual'){
							html += '<th><input type="checkbox" name="all_man" id="all_man" class="all_man uni"></th>';
						}
						html += '<th>';
							html += glbl_pcu_pdt_trns_dt.Product;
						html += '</th>'

						html += '<th>';
							html += glbl_pcu_pdt_trns_dt.Description;
						html += '</th>'

						html += '<th>';
							html += glbl_pcu_pdt_trns_dt.Defaultpurchaseprice;
						html += '</th>'
						for(var l in pricegrp){
							var pg = pricegrp[l].ProductPriceGroup;
							
							html += '<th>';
								html += pg.en_price_group;
							html += '</th>'
						}
						html += '<th style="min-width:10px"></th>';
					html += '</tr></thead>';
					html += '<tbody id="man_line_tbdy">';
						var data = products[j];
						var line_id = 0;
						
						for(var m in data){
							var line_id = man_count
							var prod  = data[m].Product;
							var ppu = data[m].ProductPriceUpdate;
							
							html += '<tr class="man_tr" data-line-id="'+line_id+'" data-primary-key="'+ppu.id+'">';
								if(from == 'manual'){
									html += '<td>';
										html += '<input type="checkbox" class="m-wrap span12 sing_prod uni single_product" data-line-id="'+line_id+'" data-primary-key="'+ppu.id+'">';
										html += '<input class="m-wrap span12 sing_prod product_id" data-line-id="'+line_id+'"  data-primary-key="'+ppu.id+'" value="'+ppu.product_id+'" type="hidden">';
									html +='</td>';
								}
								html += '<td>';
									if(from == 'manual'){
										html += '<input type="text" class="m-wrap span12 sing_prod product_name" value="'+prod.product_number+'" data-line-id="'+line_id+'" data-primary-key="'+ppu.id+'">';
									}
									else{
										html += '<input type="text" class="m-wrap span12 sing_prod product_name" value="'+prod.product_number+'" data-line-id="'+line_id+'" readonly="" data-primary-key="'+ppu.id+'">';
									}
								html += '</td>';

								html += '<td>';
									html += '<span class="m-wrap span12 sing_prod product_desc" value="" data-line-id="'+line_id+'">'+prod.product_name+'</span>';
								html += '</td>';

								var v = 0;
								if(ppu.default_purchase_price !=undefined && ppu.default_purchase_price !=null && ppu.default_purchase_price != ''){
									v = ppu.default_purchase_price;
								}
								v = convertIntoLocalFormat(v);

								html += '<td>';
									//html += v;
									html += '<input type="text" class="m-wrap span12 sing_prod num product_purchase" data-line-id="'+line_id+'"  data-primary-key="'+ppu.id+'" value="'+v+'">';
								html += '</td>';
								
								for(var l in pricegrp){
									var pg = pricegrp[l].ProductPriceGroup;
								
									var v = 0;
									var pp = JSON.parse(ppu.prices);
									var price_group_id  = 0;
									var price_primary_id  = 0;
									for(var q in pp){
										if(pg.group_id==pp[q].id){
											var v = pp[q].price;

											if(pp[q].data_primary_id==undefined || pp[q].data_primary_id==null || pp[q].data_primary_id==''){
												var price_primary_id  = 0;
											}
											else{
												var price_primary_id  = pp[q].data_primary_id;
											}

											if(pp[q].id==undefined || pp[q].id==null || pp[q].id==''){
												var price_group_id  = 0;
											}
											else{
												var price_group_id  = pp[q].id;
											}
										}
									}
									v = convertIntoLocalFormat(v);
									html += '<td>';
									
									

									

										html += '<input data-line-id="'+line_id+'" data-primary-key="'+ppu.id+'" data-group-id="'+price_group_id+'"  data-group-primary="'+price_primary_id+'" type="text" class="m-wrap span12 sing_prod sing_prod_group num" value="'+v+'">';
									html += '</td>'
								}
								html += '<td>';
									html += '<i class="icon-ok save" data-line-id="'+line_id+'" data-primary-key="'+ppu.id+'" style="color:green;"></i>';
									html += '<i class="icon-circle notsave hide" data-line-id="'+line_id+'" data-primary-key="'+ppu.id+'"style="color:#d23f31;;"></i>';
								html += '</td>'

							html += '</tr>';
							man_count++;

						}
					html += '</tbody>';
				html += '</table>';
			html += '</div></div>';	
			if(from == 'manual'){
				html += '<div class="row-fluid" style="margin-bottom:10px;margin-top:10px"><div class="span12">';
					html += '<div class="btn-group" style="float:left">';
						html += '<button class="btn blue hide" type="button" id="price_update_btn_delete">';
							html += '<i class="icon-remove"></i> ';
								html += glbl_pcu_pdt_trns_dt.Deleteproduct;
						html += '</button>';

						html += '<button class="btn blue" type="button" id="price_update_btn_new">';
							html += '<i class="icon-plus"></i>';
							html += glbl_pcu_pdt_trns_dt.Addproduct;								
						html += '</button>';
				html += '</div></div></div>';
			}
        }

		$('#prod_table').html(html);
		$('#prod_table table').each(function(){
			var a = $(this);
			
			var width = a.width();
			var parent_width = a.parent().width();
			if(width > parent_width){
				a.parent().css('overflow-y','auto');
			}
		})
		
		for(i=0;i<=man_count;i++){
			price_update.bindManLine(i);
		}
		hideProcessingImage();
		$('.num').acceptOnlyFloat();
		$('.sing_prod').keyup(function(){
			
			var line_id = $(this).attr('data-line-id');
			var primary_key = $(this).attr('data-primary-key');

			if(primary_key==undefined|| primary_key==null){
				primary_key = 0;
			}
			$('.save[data-primary-key='+primary_key+']').addClass('hide');
			$('.notsave[data-primary-key='+primary_key+']').removeClass('hide');

			for (var i = 0; i < timeouts.length; i++) {
			    clearTimeout(timeouts[i]);
			}
			timeouts = [];
			timeouts.push(
		    	setTimeout(function(){
		      		price_update.updatePrices();
		    	}, 100)
		    );
			
			//price_update.updatePrices();
		});

		if(from == 'manual'){
			$('#price_update_btn_new').click(function(){
				price_update.generateManLine(pricegrp);
			});

			$('#price_update_btn_delete').click(function(){
				price_update.deleteManRow();
			});

			$('.all_man').change(function(){
				if($('.all_man:checked').length==1){
					$('.single_product').prop('checked','checked');
				}
				else{
					$('.single_product').removeAttr('checked');
				}
				$('.single_product').trigger('change');
				$.uniform.update();
			});
		}
	},
	generateManTable:function(pricegrp){

		var html = '';
		html += '<div class="row-fluid><div class="span12><div class="table-responsive">';
			html += '<table class="table table-striped table-bordered table-hover">';
				html += '<thead><tr>';
					html += '<th><input type="checkbox" name="all_man" id="all_man" class="all_man uni"></th>';
					
					html += '<th>';
						html += glbl_pcu_pdt_trns_dt.Product;
					html += '</th>'

					html += '<th>';
						html += glbl_pcu_pdt_trns_dt.Description;
					html += '</th>'

					html += '<th>';
						html += glbl_pcu_pdt_trns_dt.Defaultpurchaseprice;
					html += '</th>'
					for(var l in pricegrp){
						var pg = pricegrp[l].ProductPriceGroup;
						
						html += '<th>';
							html += pg.en_price_group;
						html += '</th>'
					}
					html += '<th style="min-width:10px"></th>';
				html += '</tr></thead>';
				html += '<tbody id="man_line_tbdy">';
			html += '</tbody>';
			html += '</table>';
		html += '</div></div>';

		html += '<div class="row-fluid" style="margin-bottom:10px;margin-top:10px"><div class="span12">';
			html += '<div class="btn-group" style="float:left">';
				html += '<button class="btn blue hide" type="button" id="price_update_btn_delete">';
					html += '<i class="icon-remove"></i> ';
						html += glbl_pcu_pdt_trns_dt.Deleteproduct;
				html += '</button>';

				html += '<button class="btn blue" type="button" id="price_update_btn_new">';
					html += '<i class="icon-plus"></i>';
					html += glbl_pcu_pdt_trns_dt.Addproduct;								
				html += '</button>';
		html += '</div></div></div>';

		$('#prod_table').html(html);

		$('#prod_table table').each(function(){
			var a = $(this);
			
			var width = a.width();
			var parent_width = a.parent().width();
			if(width > parent_width){
				a.parent().css('overflow-y','auto');
			}
		})
		man_count = 0;

		$('#price_update_btn_new').click(function(){
			price_update.generateManLine(pricegrp);
		});

		$('#price_update_btn_delete').click(function(){
			price_update.deleteManRow();
		});

		$('.all_man').change(function(){
			if($('.all_man:checked').length==1){
				$('.single_product').prop('checked','checked');
			}
			else{
				$('.single_product').removeAttr('checked');
			}
			$('.single_product').trigger('change');
			$.uniform.update();
		});
		
		price_update.generateManLine(pricegrp);
		$('.tab-pane').removeClass('active');
        $('#tab2').addClass('active');
        $('.button-previous').addClass('hide');
        $('.button-next').addClass('hide');
        $('.btn_app,.btn_dis').removeClass('hide');
        $('#price_update_template_from').find('.bar_wizard').css({
            width: '100%'
        });
	},
	generateManLine:function(pricegrp){
		man_count++;
		var v = convertIntoLocalFormat(0);
		var tr = '';
		tr += '<tr class="man_tr" data-line-id="'+man_count+'">';
			tr += '<td>';
				tr += '<input type="checkbox" class="m-wrap span12 sing_prod uni single_product" data-line-id="'+man_count+'">';
				tr += '<input type="hidden" class="m-wrap span12 sing_prod uni product_id" data-line-id="'+man_count+'">';
			tr +='</td>';
			tr += '<td>';
				tr += '<input type="text" class="m-wrap span12 sing_prod product_name" value="" data-line-id="'+man_count+'">';
			tr +='</td>';

			tr += '<td>';
				tr += '<span class="m-wrap span12 sing_prod product_desc" value="" data-line-id="'+man_count+'"></span>';
			tr += '</td>';

			tr += '<td>';
				tr += '<input type="text" class="m-wrap span12 sing_prod num product_purchase" value="'+v+'" data-line-id="'+man_count+'">';
			tr += '</td>';

			for(var l in pricegrp){
				var pg = pricegrp[l].ProductPriceGroup;
	
				tr += '<td>';
					tr += '<input type="text" class="m-wrap span12 sing_prod sing_prod_group num" value="'+v+'" data-group-id="'+pg.group_id+'" data-line-id="'+man_count+'">';
				tr += '</td>';
			}
			tr += '<td>';
				tr += '<i class="hide save icon-ok" data-line-id="'+man_count+'" style="color:green;"></i><i class="icon-circle notsave" data-line-id="'+man_count+'" style="color:#d23f31;"></i>';
			tr += '</td>';

		tr += '</tr>';
		$('#man_line_tbdy').append(tr);
		price_update.bindManLine(man_count);
	},
	bindManLine:function(i='a'){
		$('.uni').uniform();
		$('.single_product').change(function(){
			var a = $('.single_product').length;
			var b = $('.single_product:checked').length;
			if(a==b){
				$('.all_man').prop('checked','checked');
			}
			else{
				$('.all_man').removeAttr('checked');
			}
			if(b>0){
				$('#price_update_btn_new').addClass('hide');
				$('#price_update_btn_delete').removeClass('hide');
			}
			else{
				$('#price_update_btn_delete').addClass('hide');
				$('#price_update_btn_new').removeClass('hide');

			}
			$.uniform.update();
		});
		if(i=='a'){
			price_update.autoCompleteProductLines(man_count);
		}
		else{
			price_update.autoCompleteProductLines(i);
		}
		
		
		$('.sing_prod').keyup(function(){
			
			var line_id = $(this).attr('data-line-id');
			var primary_key = $(this).attr('data-primary-key');

			if(primary_key==undefined|| primary_key==null){
				primary_key = 0;
			}
			$('.save[data-primary-key='+primary_key+']').addClass('hide');
			$('.notsave[data-primary-key='+primary_key+']').removeClass('hide');
			$('.btn_app').attr('disabled','disabled');
			for (var i = 0; i < timeouts.length; i++) {
			    clearTimeout(timeouts[i]);
			}
			timeouts = [];
			timeouts.push(
		    	setTimeout(function(){
		      		price_update.updatePrices();
		    	}, 1000)
		    );
			//price_update.updatePrices();
		});
		if(i=='a'){
			man_count++;
		}
	},
	autoCompleteProductLines:function(man_count){
		var TABKEY = 9;
		var availableTags =  global_price_update_data.productData;

		$('input.product_name[data-line-id='+man_count+']').autocomplete({
			minLength: 1,
			source: availableTags,
			select: function( event, data ) {
			
				var line_id = $(this).attr('data-line-id');
				var primary_key = $(this).attr('data-primary-key');
				
				var p_num = data.item.label;
				p_num = p_num.replace('#','');
				p_num = p_num.split(',');
				p_num = p_num[0];
			
				price_update.getAndSaveProdLine(data.item.id,line_id,p_num,primary_key);
			}
		});
	},
	updatePrices:function(){
		
		var saveParams = [];
		$('.product_id').each(function(){
			var line_id = $(this).attr('data-line-id');
			var primary_key = $(this).attr('data-primary-key');
			if(primary_key==undefined || primary_key==null || primary_key=='' || primary_key==0){
				return false;
			}
			var fobj = [];
			$('.sing_prod_group[data-line-id='+line_id+'][data-primary-key='+primary_key+']').each(function(){
	
				var price_group_id = $(this).attr('data-group-id');
				var price_primary_id = $(this).attr('data-group-primary');
				var price = $(this).val();
				price = convertIntoStandardFormat(price);

				var obj = {
					id:price_group_id,
					data_primary_id:price_primary_id,
					price:price,
				};

				fobj.push(obj);
			});
			var product_id = 0;
			product_id = $('input.product_id[data-line-id='+line_id+'][data-primary-key='+primary_key+']').val();
			var default_purchase_price = 0;
			default_purchase_price = $('input.product_purchase[data-line-id='+line_id+'][data-primary-key='+
				primary_key+']').val();
			default_purchase_price = convertIntoStandardFormat(checkNull(default_purchase_price,0));
			saveParams.push({
				id:primary_key,
				product_id:product_id,
				default_purchase_price:default_purchase_price,
				prices:fobj,
			});
		});
		if(saveParams.length!=0){

			var saveParam = JSON.stringify(saveParams);
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				saveParams:saveParam
			}
			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Commons/updateProdRow.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			};
			
			params['successCallbackFunction'] = function (complet_data){
				if(complet_data.response.status == 'success'){
					$('.btn_app').removeAttr('disabled');
					$('.save[data-primary-key]').removeClass('hide');
					$('.notsave[data-primary-key]').addClass('hide');

					//price_update.updateManLines(product_id,line_id,p_num,complet_data.response.response);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',glbl_pcu_pdt_trns_dt.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',glbl_pcu_pdt_trns_dt.alertmessage);
						return;
					}	
				}
			};
		
			doAjax(params);
		}
		else{
			$('.btn_app').removeAttr('disabled');
		}
		return;

	},
	getAndSaveProdLine:function(product_id,line_id,p_num,primary_key){
		showProcessingImage('undefined');
		if(primary_key==undefined || primary_key===null || primary_key==0){
			primary_key = '';
		}
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			product_id:product_id,
			id:primary_key
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getPriceByProd.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				price_update.updateManLines(product_id,line_id,p_num,complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}	
			}
		};
		doAjax(params);
		return;
	},
	updateManLines:function(product_id,line_id,p_num,data){
	
		var ppu = data.ProductPriceUpdate;
		
		for(var j in global_price_update_data.ProductPriceGroups){
			var p = global_price_update_data.ProductPriceGroups[j].ProductPriceGroup;
	
			$('input.sing_prod_group[data-line-id='+line_id+']').removeAttr('data-group-primary').attr('data-group-primary',0);
		}

		if(ppu.prices!='' || ppu.prices !=undefined || ppu.prices!=''){
			var prices = JSON.parse(ppu.prices);
			for(var j in prices){
				var p = prices[j];
				$('input.sing_prod_group[data-group-id='+p.id+'][data-line-id='+line_id+']').val(convertIntoLocalFormat(checkNull(p.price,0)));
				$('input.sing_prod_group[data-group-id='+p.id+'][data-line-id='+line_id+']').removeAttr('data-group-primary').attr('data-group-primary',checkNull(p.data_primary_id,0));
			}
		}
		$('.product_desc[data-line-id='+line_id+']').html(checkNull(ppu.product_name));
		$('input.product_name[data-line-id='+line_id+']').val(checkNull(p_num));
		$('input.product_purchase[data-line-id='+line_id+']').val(convertIntoLocalFormat(checkNull(ppu.default_purchase_price,0)));
		$('input.product_id[data-line-id='+line_id+']').val(checkNull(ppu.product_id));
		$('[data-line-id='+line_id+']').removeAttr('data-primary-key').attr('data-primary-key',ppu.id);
		$('i[data-line-id='+line_id+']').removeAttr('data-primary-key').attr('data-primary-key',ppu.id);
		$('.save[data-line-id='+line_id+'][data-primary-key='+ppu.id+']').removeClass('hide');
		$('.notsave[data-line-id='+line_id+'][data-primary-key='+ppu.id+']').addClass('hide');
		
	},
	deleteManRow:function(){
		var server_delete = [];
		var client_delete = [];
		
		$('.single_product:checked').each(function(){
			var line_id = $(this).attr('data-line-id');
			var primary_key = $(this).attr('data-primary-key');

			if(primary_key!=undefined && primary_key!=null && primary_key!=''){
				server_delete.push(primary_key);
			}
			else{
				client_delete.push(line_id);
			}
		});
		if(server_delete.length!=0){
			showProcessingImage('undefined');
			var ids = JSON.stringify(server_delete);
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				ids:ids
			}
			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Commons/deleteProdRow.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
				if(complet_data.response.status == 'success'){
					var a = complet_data.response.response.ProductPriceUpdate;
					for(var j in a){
						$('tr[data-primary-key='+a[j]+']').remove();
					}
					for(var j in client_delete){
						$('tr[data-line-id='+client_delete[j]+']').remove();
					}
					price_update.checkEmptyLines();
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',glbl_pcu_pdt_trns_dt.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',glbl_pcu_pdt_trns_dt.alertmessage);
						return;
					}	
				}
			}
			doAjax(params);
			return;
		}
		else{
			for(var j in client_delete){
				$('tr[data-line-id='+client_delete[j]+']').remove();
			}
			price_update.checkEmptyLines();
		}

	},
	checkEmptyLines:function(){
		if($('#man_line_tbdy tr').length==0){
			price_update.generateManLine(global_price_update_data.ProductPriceGroups);
		}
		$('.single_product').trigger('change');
	},
	handleCatCheck:function(that){
		var id = $(that).attr('id');
		var data_id =  $(that).attr('data-id');
		var isChecked = $('#'+id+':checked').length;
		
		if(isChecked){
			if(selprod[data_id]==undefined){
				selprod[data_id] = [];
			}
			$('.cat_edit_'+data_id).removeClass('hide');
		}
		else{
			delete selprod[data_id];
			$('.cat_edit_'+data_id).addClass('hide');
			$('.origCount_'+data_id).removeClass('hide');
			$('.editCount_'+data_id).addClass('hide');
		}
		if($('.cat:checked').length == $('.cat').length){
			$('.all_cat').prop('checked','checked');
		}
		else{
			$('.all_cat').removeAttr('checked');
		}
		$.uniform.update();
	},
	editCat:function(id){
		showProcessingImage('undefined');
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			category_id:id,
			from:'noinventory'
		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/products/getCategoryInProduct.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				price_update.generateProdByCat(complet_data.response.response.productsList,id);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',glbl_pcu_pdt_trns_dt.alertmessage);
					return;
				}	
			}
		};
		doAjax(params);
		return;

	},
	generateProdByCat:function(data,id){
		var width = 700;
		$('#prc_upd_prod_ppp').attr('data-width',width+'px');
		$('#prc_upd_prod_ppp').width(width);
		$('#prc_upd_prod_ppp').modal('show');
		
		$('#prod_list_table').dataTable().fnDestroy();
		$('#prod_list_tbody').html('');
		$('#prod_name').val('');

		for(var j in data){
			var p = data[j].Product;
		
			var html ='';
			html += '<tr id="prod_'+p.id+'" class="prod_tr">';
				html += '<td>';
					var found = 0;
					for(var k in selprod[id]){
						var d = selprod[id][k];
						if(d == p.id){
							html += '<input type="checkbox" id="prod_'+p.id+'" class="uni prod prod_'+p.id+'" data-cat-id="'+id+'" data-id="'+p.id+'">';
							found = 1;
							break;
						}
					}
					if(found==0){
						html += '<input checked="checked" type="checkbox" id="prod_'+p.id+'" class="uni prod prod_'+p.id+'" data-cat-id="'+id+'" data-id="'+p.id+'">';
					}
					
				html += '</td>';

				html += '<td>';
					html += p.product_number;
				html += '</td>';
				html += '<td>';

					html += p.product_name;
				html += '</td>';
			html += '</tr>';
			$('#prod_list_tbody').append(html);
		}

		var table = $('#prod_list_table').dataTable({ 
				"iDisplayLength": -1,
				"aoColumns": [
				  { "bSortable": false },
				  { "bSortable": true },
				  { "bSortable": true },
				],
				"aLengthMenu": [ 10, 25, 50, 100 ],
				//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
				"sDom": "<'row-fluid't><'row-fluid'<'span6'li><'span6'>>",
				"sPaginationType": "bootstrap",
				"oLanguage": {
					"sLengthMenu": 
			           glbl_pcu_pdt_trns_dt.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ glbl_pcu_pdt_trns_dt.records
			         ,
					"oPaginate": {
						"sPrevious": glbl_pcu_pdt_trns_dt.prev,
						"sNext": glbl_pcu_pdt_trns_dt.next
					},
					"sInfo": glbl_pcu_pdt_trns_dt.Foundtotal+" _TOTAL_ "+glbl_pcu_pdt_trns_dt.records
				}
			});

		price_update.bindProdPopup();
		
		
	},
	bindProdPopup:function(){

		$('.prod').change(function(){
			if($('.prod:checked').length==$('.prod').length){
				$('.all_prod').prop('checked','checked');
			}
			else{
				$('.all_prod').removeAttr('checked');
			}
			$.uniform.update();
			price_update.getProdCheckData();
			
		}).uniform().trigger('change');
		setTimeout(function(){
			$('#prod_name').focus();
		},1000);
		

	},
	getProdCheckData:function(){
		var cat_id = 0;
		var count = 0;
		$('.prod').each(function(){
			var id = $(this).attr('id');
			var data_id =  $(this).attr('data-id');
			cat_id =  $(this).attr('data-cat-id');
			var isChecked = $('#'+id+':checked').length;
			
			if(isChecked){
				count++;
				for(var j in selprod[cat_id]){
					var d = selprod[cat_id][j];
					if(d==data_id){
						selprod[cat_id].splice(j, 1);
						break;
					}
				}
			}
			else{
				if(selprod[cat_id]==undefined){
					selprod[cat_id] = [];
				}
				selprod[cat_id].push(data_id);
				
			}
		});
		
		if(count!=0){
			$('.origCount_'+cat_id).addClass('hide');
			$('.editCount_'+cat_id).html(count).removeClass('hide');
			$('#cat_'+cat_id).prop('checked','checked').trigger('change');
		}
		else{
			$('#cat_'+cat_id).removeAttr('checked').trigger('change');
		}
		$.uniform.update();
	},
	generateProdCatList:function(data){
		var p = data[0];
		var pc = data.ProductCategory;
		var ret = '';
		ret += '<tr>';
			ret += '<td>';	
				ret += '<input type="checkbox" data-id="'+pc.id+'" class="uni cat" name="cat_'+pc.id+'" id="cat_'+pc.id+'">';
			ret += '</td>';

			ret += '<td>';	
				ret += pc.category;
			ret += '</td>';

			ret += '<td>';	
				ret += '<span class="origCount origCount_'+pc.id+'">';
					ret += p.product_count;
				ret += '</span>';
				ret += '<span class="editCount editCount_'+pc.id+' hide">';
					ret += p.product_count;
				ret += '<span>';
				
			ret += '</td>';

			ret += '<td>';	
				ret+= '<a class="btn mini blue-stripe  cat_edit cat_edit_'+pc.id+' hide" onclick="price_update.editCat('+pc.id+')"><i class="icon-edit" ></i>&nbsp;'+glbl_pcu_pdt_trns_dt.Edit+'</a>&nbsp;';
			
			ret += '</td>';
		ret += '</tr>';
		return ret;
	},
	listenForData:function(){
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

		Template7.registerHelper('prodCatHelper', function (data){
			return price_update.generateProdCatList(data);
		});
	}


}




