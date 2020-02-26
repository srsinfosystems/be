var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var iba_popid = 'popups';
var iba_meta;
var iba_dt;
var iba_td;
var inv_status_arr = {};
var customer_id = '';
var invoice_bulk_add = {
	start: function(popups,metadata=''){
		iba_meta=metadata;

		iba_popid = popups;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Generate participant list','Cancel','Alert Message','Please check the following fields','alert message','Success','From date','To date','Date','$customerh','Invoice','Credit memo','Both','Document type','Select','Draft','Not paid','Partially paid','Paid','Partially credited','Credited','Lost','$loss_pp','Loss paid','$loss_pc','Loss credited','Recovered from loss','Scheduled','Status','Print status on invoice','Generate report','Bulk invoice report','All','Customer','Invoice and credit memo'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/invoices/invoicebulk.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				iba_dt= complet_data.response.response;
				iba_td = complet_data.response.response.translationsData;
				invoice_bulk_add.createHtml();
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',iba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',iba_td.alertmessage);
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
		iba_dt.date_format_f = date_format_f;
		iba_dt['inv_status_arr'] = invoice_bulk_add.getInvStatusList();

		var template = document.getElementById('invoice_bulk_add_template').innerHTML;
		var compiledRendered = Template7(template, iba_dt);
		document.getElementById(iba_popid).innerHTML = compiledRendered;
		resizemodal(iba_popid);
		invoice_bulk_add.bindEvents();
	},
	getInvStatusList:function(){
		return inv_status_arr = {
			draft_invoice:iba_td.Draft,
			not_paid:iba_td.Notpaid,
			partially_paid:iba_td.Partiallypaid,
			fully_paid:iba_td.Paid,
			partially_credited:iba_td.Partiallycredited,
			fully_credited:iba_td.Credited,
			loss:iba_td.Lost,
			loss_partially_paid:iba_td.$loss_pp,
			loss_fully_paid:iba_td.Losspaid,
			loss_partially_credited:iba_td.$loss_pc,
			loss_fully_credited:iba_td.Losscredited,
			recovered_from_loss:iba_td.Recoveredfromloss,
			//scheduled:iba_td.Scheduled,
		};

	},
	bindEvents:function(){
		$('.uni').uniform();

		invoice_bulk_add.bindCustomer();

		$('#invoice_bulk_add_template_form #from_date,#invoice_bulk_add_template_form #to_date').datepicker({
   			format:iba_dt.date_format_f,
   			
   		}).change(function(){
   			$('.datepicker').remove();
   		});

   		$('#document_type').select2({
   			placeholder:iba_td.Select,
   			allowclear:true
   		}).change(function(){
   			var v = $('#document_type').val();
   			if(v == 'both' || v == 'invoice'){

   				$('.invoice_only').show();
   			}
   			else{
   				$('#inv_status').val('').trigger('change');
   				$('.invoice_only').hide();
   			}
   		}).trigger('change');

   		$('#inv_status').val('all').trigger('change');
   		$('#inv_status').select2({
   			placeholder:iba_td.Select,
   			
   		});
	},
	bindCustomer:function(){
		var cache = {};
		$('#customer_h').autocomplete({
			autoFocus: true,	
			source: function( request, response ) {
        		var term = request.term;
        		if( term in cache ) {
          			response( cache[ term ] );
          			return;
        		}
        		var results = $.ui.autocomplete.filter(iba_dt.customer_list, request.term);
        	
        		cache[ term ] = results;
                response(results.slice(0, 100));
  			},
			minLength: 1,
			select: function( event, data ) {
				customer_id = data.item.id;
			},
		});
		$('ul.ui-autocomplete').css('z-index','100000');

		$('#invoice_bulk_add_btn_save').click(function(){
			invoice_bulk_add.saveData();
		});
	},
	saveData:function(){
		var from_date =  $("#invoice_bulk_add_template_form #from_date").val();
		var to_date =  $("#invoice_bulk_add_template_form #to_date").val();

		var document_type = $("#invoice_bulk_add_template_form select#document_type").val();
		var inv_status = $("#invoice_bulk_add_template_form select#inv_status").val();
		var print_status = $("#invoice_bulk_add_template_form #print_status:checked").length;

		var errmsg = '';
		if(checkNull(customer_id) == ''){
			errmsg += iba_td.$customerh+'<br/>';
		}

		if(checkNull(from_date)==''){
			errmsg += iba_td.Fromdate+'<br/>';
		}

		if(checkNull(to_date)==''){
			errmsg += iba_td.Todate+'<br/>';
		}

		if(checkNull(document_type)==''){
			errmsg += iba_td.Documenttype+'<br/>';
		}

		if((checkNull(document_type) =='invoice' || checkNull(document_type) == 'both') && checkNull(inv_status) == '') {
			errmsg += iba_td.Status+'<br/>';
		}

		if(errmsg!=''){
			var finalerrmsg = iba_td.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',iba_td.AlertMessage);
			return;
		}

		var from_date =  $("#invoice_bulk_add_template_form #from_date").datepicker('getDate');
		from_date = moment(from_date).format('YYYY-MM-DD');

		var to_date =  $("#invoice_bulk_add_template_form #to_date").datepicker('getDate');
		to_date = moment(to_date).format('YYYY-MM-DD');
		
		
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,

			customer_id:customer_id,
			document_type:document_type,
			inv_status:inv_status,
			print_status:print_status,

			from_date:from_date,
			to_date:to_date,
			
		};
	
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/invoices/generateBulkInvoiceReport.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				invoice_bulk.start();
				var pdf_info = complet_data.response.response.pdf_info;
				var pdf_file_name = checkNull(pdf_info.pdf_file_name);
				if(pdf_file_name != ''){
					var dir = 'invoices/'+ pdf_file_name;
					var path = APISERVER+'/api/downloads/report/'+btoa(dir)+'.json';
					openPdf(path); 
				}
				call_toastr('success',iba_td.Success,checkNull(complet_data.response.response.message.msg));
				
				$('#'+iba_popid).modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(iba_td.Pleasecheckthefollowingfields+ ':<br/>' +array,'error',iba_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',iba_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;

	},
};
