if(marina_review!=undefined){
	delete marina_review;
}
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var global_marina_review_data;
var gbl_trnsdata;
var type = $('#type').val();
var invoice_data;
var getGlblPartnerTaxLevelList;
var batch_id='';
var vat_required = 'y';
var getProductUnitList;
var marina_review = {
	start:function(custom_data){
		batch_id = custom_data.batch_id;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getPartnerTaxLevels:'yes',
			getTranslationsDataArray:['Dashboard','Marina','Review','Customer name','Customer number','Customer group','Product Number','Description','Quantity','Unit Price','MVA','Discount','Total price','Discard Billing','Send Invoices','Page','No data found','Marina billing deleted successfully','Marina billing sent successfully','Success','success','Marina billing summary completed','alert message','Product name','Total','Expand all','Collapse all','Unit'],
		};
		if(batch_id!=''  && batch_id!=null && batch_id!=undefined){
			total_params.batch_id = batch_id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getReviewPendingMarinaBill.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_marina_review_data = complet_data.response.response;
				
				if(global_marina_review_data.rpending=='no'){
					new_custom_main_page('/'+type+'/marina/billing','marina_menu_full','marina_billing','marina_billing');					
					return;
				}
				gbl_trnsdata = complet_data.response.response.translationsData;
				getGlblPartnerTaxLevelList = complet_data.response.response.getPartnerTaxLevelList;
				invoice_data = complet_data.response.response.invoice_data;
				vat_required = complet_data.response.response.getPartnerCustomSettings.vat_required;
				getProductUnitList = complet_data.response.response.getProductUnitList;
				marina_review.createHtml(complet_data.response.response.invoice_data);

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_trnsdata.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',gbl_trnsdata.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		
		return;
	},
	createHtml:function(invoice_data){
		global_marina_review_data.translationsData.dashboardurl = base_url+'dashboard/index';
		global_marina_review_data.translationsData.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('marina_review_template').innerHTML;
		var compiledRendered = Template7(template, global_marina_review_data);
		document.getElementById('content').innerHTML = compiledRendered;
		$('#tbl_marina_billing tbody').html('<tr><td colspan="4"><img src="'+global_marina_review_data.translationsData.loaderurl+'"></td></tr>');
		hideProcessingImage();
		marina_review.bindEvents(invoice_data);
	},
	bindEvents:function(invoice_data){
		$('.dis_billing').click(function(){
		
			marina_review.discardBilling();
		});
		$('.send_billing').click(function(){
			
			marina_review.approveBilling();
		});
		marina_review.generateRows(invoice_data);		
	},
	generateRows:function(invoice_data){
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
					html +='<div class="iconplus plusminus" onclick="marina_review.open_dock('+j+');" id="open_dock_'+j+'">&nbsp;</div>';
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
	getPaginateData:function(frm){
		var page = parseInt($('#page').val());
		
		if(frm=='next'){
			var pg = page + 1;
			$('#page').val(pg);
		
			marina_review.getInvoiceData(pg);
		}
		else if(frm=='prev'){
			if(page!=1){
				var pg = page - 1;
				$('#page').val(pg);
				marina_review.getInvoiceData(pg);
				
			}
			
		}

	},
	getInvoiceData:function(page){
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
					marina_review.generateRows(inv_data);
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
	getSummary:function(){
		call_toastr(gbl_trnsdata.success, gbl_trnsdata.Success,gbl_trnsdata.Marinabillingsummarycompleted);
		new_custom_main_page('/'+type+'/marina/review','marina_menu_full','marina_billing','marina_review');
		return;
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
		
	}
};
