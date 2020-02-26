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
 var aSelected = [];
var bd_dt;
var bd_td;
var count_ajax = {};
var all_ajax_comp = 0;
var allAjaxt;
var table;
var ptla=[];
var ptlao='';
var balance_deprecation = {
	start:function(){
	
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','Balance deprecation','Search','$customer','Customer name','Date','Amount','Current balance','Offset account','Journal date','Actions','$customer','Document','From amount','To amount','To date','From date','Search','Clear','View','records','of','Found total','No record found','Remove','Remove selected','Journalb','Journal selected','$row_sel','$rows_sel','Invoice','Credit memo','Register','Please check the following fields','Select','Page','No record available','$bal_journal','$bal_register','TAX L1','TAX L2','TAX L3','Tax L1','Tax L2','Tax L3','Sales L0','Sales L1','Sales L2','Sales L3','Round off','Loss','Recover loss','Reminder','Interest','Credit','Bank']
			
				
		};
		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Accounts/getBalanceDeprecation.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				bd_dt = complet_data.response.response;
				bd_td = complet_data.response.response.translationsData;
				balance_deprecation.createHtml(complet_data.response.response);
		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bd_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bd_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		//balance_deprecation.getAllInvoices();
		return;
	},
	createHtml:function(){
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}

		bd_dt.date_format_f = date_format_f;

		bd_td.dashboardurl = base_url+'dashboard/index';
		bd_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('balance_deprecation_template').innerHTML;
		var compiledRendered = Template7(template, bd_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		balance_deprecation.bindEvents();
	},
	bindEvents:function(){
		//$('#to_amount,#from_amount').acceptOnlyFloat();
		$('#from_date,#to_date').datepicker({
   			format:bd_dt.date_format_f
   		}).change(function(){
   			$('.datepicker').remove();
   		});
   		$('#from_date,#to_date').datepicker( "setDate" , moment(bd_dt.todays_date)._d);
   		$('.uni').uniform();

   		$('#btn_search').click(function(){
   			var datas = balance_deprecation.validateForm();
   			if(datas){
   				balance_deprecation.getAllInvoices(datas,'');
   			}
   		});

   		$("#btn_clear").click(function(){
   			balance_deprecation.clear('btn');
   		});

   		for(var j in bd_dt.PartnerTaxLevelAccounts){
   			var ptl =  bd_dt.PartnerTaxLevelAccounts[j].PartnerTaxLevelAccount;


   			var label = ptl.account_number;

   			if(checkNull(ptl.bank_account_number)!=''){
   				label += ' - '+ptl.bank_account_number;
   			}

   			if(checkNull(ptl.account_name)!=''){
   				
   				var a = ptl.account_name;
   				a = a.replace(/ /g, '');
   				
   				if(checkNull(bd_td[a]) == ''){
   					label += ' - '+ptl.account_name;
   				}
   				else{
   					label += ' - '+bd_td[a];
   				}
   				
   			}

   			ptla.push({
   				id:ptl.id,
   				label:label,
   				value:label,
   				val:ptl.account_number,
   				account_name:checkNull(ptl.account_name),
   				bank_account_number:checkNull(ptl.bank_account_number),
   			});

   			ptlao += '<option value="'+ptl.id+'">'+label+'</option>';
   		}
	},
	validateForm:function(){
		var from_amount = $('#from_amount').val();
		var to_amount = $('#to_amount').val();
		var from_date = $("#from_date").val();
		var to_date = $('#to_date').val();

		if(from_date!=''){
			from_date = moment($('#from_date').datepicker('getDate')).format('YYYY-MM-DD')
		}
		if(to_date!=''){
			to_date = moment($('#to_date').datepicker('getDate')).format('YYYY-MM-DD')
		}
		var datas = {
			from_amount:from_amount,
			to_amount:to_amount,
			from_date:from_date,
			to_date:to_date
		}
		return datas;
		
	},
	getAllInvoices:function(datas={},count_ajax=''){
		var totaarams = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,	
			resenddata:1,	
		};

		var total_params = Object.assign(totaarams,datas);
	
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Accounts/getInvoiceForDeprecation.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				balance_deprecation.generateList(complet_data.response.response);
			
			}
			else if(complet_data.response.status == 'error'){
				hideProcessingImage();
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bd_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bd_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	allajaxComplete:function(){
		console.log('allajaxComplete')
	},
	generateList:function(data){		
		$('#table_depre').DataTable().destroy();
		$('#table_depre tbody').html('');
		var inv = data.invoices;
		var frm_amt = $('#from_amount').val();
		var to_amt = $('#to_amount').val();
		var k = -1;
		$('.all_check').removeAttr('checked');
		$('.no_sel').hide();
		$.uniform.update();
		aSelected = [];
		var tabledata = [];

		for(var j in inv){
	
			var c = inv[j].Customer;
			var v = inv[j].Invoice;
			
			var bal = inv[j].bal;
			k++;
			aSelected.push({
				data_id:k,
				selected:'n',
        		journal:'disabled',
        		journal_date:'',
        		offset_account:'',
        		offset_account_val:'',
        		out_standing_balance:bal.out_standing_balance,
        		invoice_id:v.id,
        		currency_id:v.currency_id,
        		receiver_id:v.receiver_id,
			})
			
			tabledata[k] = [];
			var html = '<tr data-id="'+k+'" id="row_'+k+'">';

				html += '<td >';
					var a = '<input type="checkbox" value=""  data-id="'+k+'" class="single_check uni" id="single_check_'+k+'">';
					html += a;
					tabledata[k].push(a);
				html += '</td>';

				html += '<td>';
					var b = checkNull(c.customer_number);
					html += b;
					tabledata[k].push(b);
				html += '</td>';

				html += '<td>';
					var c = checkNull(c.customer_name);
					html += c;
					tabledata[k].push(c);
				html += '</td>';

				html += '<td>';
					var inv_str = '';
					if(checkNull(v.invoice_number)!=''){
						var url = base_url + 'invoice/invoice_details/' + v.id;
						inv_str = '<a href="'+url+'" target="_blank" style="color:#0d638f;text-decoration:none;">' + v.invoice_number + '</a>';
					}
					
					var credit_str = '';
					// if(checkNull(bal.credit_ref_ids)!=''){
					// 	if(bal.credit_ref_ids.length != 0 ){
					// 		var credit_ref_ids_str = '';
					// 		var m = 0;
					// 		for(var o in bal.credit_ref_ids){
					// 			m++;
					// 			var url = base_url + 'invoice/credit_memo_details/'+ bal.credit_ref_ids[o].id;
					// 			if(m==1){
					// 				credit_ref_ids_str += '<a href="'+url+'" target="_blank" style="color:#0d638f;text-decoration:none;">' + bal.credit_ref_ids[o].credit_number+ '</a>';
					// 			}
					// 			else{
					// 				credit_ref_ids_str += ', <a href="'+url+'" target="_blank" style="color:#0d638f;text-decoration:none;">'+ bal.credit_ref_ids[o].credit_number+ '</a>';
					// 			}
								
					// 		}
					// 		if(credit_ref_ids_str!=''){
					// 			credit_str = '<br/>'+bd_td.Creditmemo+ ' ' + credit_ref_ids_str
					// 		}

					// 	}
					// }
					var c = bd_td.Invoice+' '+ inv_str + credit_str;
					html += c;
					tabledata[k].push(c);
				html += '</td>';

				html += '<td>';
					var d = convertDateIntoSiteFormat(checkNull(v.invoice_date));
					html += d;
					tabledata[k].push(d);
				html += '</td>';

				html += '<td>';
					var e = checkNull(v.gross_amount);
					html += e;
					tabledata[k].push(e);
				html += '</td>';

				html += '<td>';
					var f = checkNull(bal.out_standing_balance);
					html += f;
					tabledata[k].push(f);
				html += '</td>';

				html += '<td>';
					
					var g = '<div style="display:inline-block; position:relative;" class="journal_acc_no_wr journal_acc_no_wr_'+k+'" data-id="'+k+'" >';
							g += '<input data-id="'+k+'"  style="" class="span12 date m-wrap journal_acc_no journal_acc_no_'+k+'"  type="text">';
							g += '<input data-id="'+k+'" class="journal_acc_no_hidden journal_acc_no_hidden_'+k+'"  type="hidden">';
					//g += '<div style="position:absolute; left:0; right:0; top:0; bottom:0;" class="white_bg"></div></div>';
					
					html += g;
					tabledata[k].push(g);
				html += '</td>';

				html += '<td>';
					var i = '<input data-id="'+k+'" style="" class="span12 date m-wrap journal_date journal_date_'+k+'" date-format="'+bd_dt.date_format_f+'" type="text">';
					html += i;
					tabledata[k].push(i);
				html += '</td>';

				html += '<td class="action">';
					var j = '<button data-id="'+k+'" class="btn mini red-stripe del_row"><i class="icon-remove"></i> '+bd_td.Remove+'</button>';
					j += '<button data-id="'+k+'" class="btn mini blue-stripe journal_row" onclick="balance_deprecation.save(2,this);"><i class="icon-plus"></i> '+bd_td.$bal_journal+'</button>';
					html += j;
					tabledata[k].push(j);
				html += '</td>';
			html += '</tr>';

		}


		hideProcessingImage();
		//setTimeout(function(){
			balance_deprecation.bindList('',tabledata);
		//},340);
		
	},
	bindList:function(page='',tabledata){
		$('#table_depre tbody').off();
		$('.uni').uniform.restore();
		$('.all_check').off();
		$('.uni').uniform();

		if(tabledata.length!=0){
			$('#table_depre').show();
			$('.no_rec').hide();

			$('.journal_date_all').datepicker({
	   			format:bd_dt.date_format_f,
	
	   		}).change(function(){
	   			$('.datepicker').remove();
	   		});

		 	table = $('#table_depre').DataTable({
		 		 	"pagingType": "input",
					"data":tabledata,
			       	"rowCallback": function( nRow, adata ) {
			       		var id = $(nRow).find('input').attr('data-id');
						var o = balance_deprecation.updateObj(id,'search');
						var c = balance_deprecation.getSelectedCount();

						if(aSelected[o]!=undefined && checkNull(aSelected[o])!=''){
							if(c.selected == 0){
								$(nRow).removeClass('row_selected').removeClass('row_not_selected');
							}
							else{
								if(aSelected[o].selected == 'y'){
									$(nRow).removeClass('row_not_selected').addClass('row_selected');
								}
								else{
									$(nRow).removeClass('row_selected').addClass('row_not_selected');
								}
							}
							$(nRow).find('.uni').uniform();
							$(nRow).find('.journal_acc_no_'+id).autocomplete({
								source: ptla,
								minLength: 1,
					      		select: function( event, data ) {
					      			var id = $(event.target).attr('data-id');
					      			$('.journal_acc_no_hidden_'+id).val(JSON.stringify(data)).trigger('change');
					      		},
							});
							$(nRow).find('.journal_date_'+id).datepicker({
						   		format:bd_dt.date_format_f,
						   	}).change(function(){
					   			$('.datepicker').remove();
					   			if($(this).val() == ''){

					   			}
					   		});

						
							if(aSelected[o].journal==''){
								//$(nRow).find('.journal_acc_no_'+id+',.journal_date_'+id).removeAttr('disabled');
								//$(nRow).find('.journal_date_'+id).datepicker('setDate', aSelected[o].journal_date);
							}
							else{
								//$(nRow).find('.journal_acc_no_'+id+',.journal_date_'+id).attr('disabled','disabled');
								//$(nRow).find('.journal_date_'+id).val('').datepicker('update');
							}

							if(aSelected[o].offset_account == ''){
								$(nRow).find('.journal_acc_no_'+id+',.journal_acc_no_hidden_'+id).val('');
							}
							else{
								$(nRow).find('.journal_acc_no_'+id).val(aSelected[o].offset_account);
								$(nRow).find('.journal_acc_no_hidden_'+id).val(JSON.stringify(aSelected[o].offset_account_val));
							}	

							if(aSelected[o].selected == 'y'){
								$(nRow).find('td:nth-child(10)').find('button').css('visibility','hidden');
	           					$(nRow).find('td:nth-child(9)').find('input.journal_date').css('visibility','hidden');
           						$(nRow).find('td:nth-child(8)').find('input.journal_acc_no').css('visibility','hidden');
							}
							else{
								$(nRow).find('td:nth-child(10)').find('button').css('visibility','visible');
	           					$(nRow).find('td:nth-child(9)').find('input.journal_date').css('visibility','visible');
           						$(nRow).find('td:nth-child(8)').find('input.journal_acc_no').css('visibility','visible');
							}
							return ;
						}
			       	},
		 		 	"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
		 		 	"columns": [
					    null,
					    null,
					    null,
					    null,
					    null,
					    null,
					    null,
					    { className: "offset_account_td" },
					    { className: "journal_date_td" },
					    { className: "actions_td" },
					],
		 		 	"language": {
					"lengthMenu": 
				           bd_td.View+ ' <select>'+
				             '<option value="10">10</option>'+
				             '<option value="20">20</option>'+
				            '<option value="30">30</option>'+
				             '<option value="40">40</option>'+
				             '<option value="50">50</option>'+
				             '<option value="-1">All</option>'+
				             '</select> '+ bd_td.records + ' |  '
				         ,
						"paginate": {
							"previous": '<i class="icon-angle-left"></i>',
							"next": '<i class="icon-angle-right"></i>',
							'of':bd_td.of,
							'Page':bd_td.Page,
						},
						
						"info": bd_td.Foundtotal+" _TOTAL_ "+bd_td.records
					},

		 	});

			$('#table_depre tbody').on('change','.single_check', function () {
				
		        var id = $(this).attr('id');
		        var cno = $(this).attr('data-id');
		        
		        if($(this).closest('tr').find('input[type="checkbox"]:checked').length == 1){
		        	var o = balance_deprecation.updateObj(cno,'search');
		        	aSelected[o].selected = 'y';
		        	aSelected[o].offset_account = ''
		        	aSelected[o].offset_account_val = '';
		        	aSelected[o].journal_date = '';

		           	$(this).closest('tr').find('input[type="checkbox"]').prop('checked','checked');
		           // $(this).closest('tr').find('input.journal_date,input.journal_acc_no').prop('disabled','disabled');
		           	
		           	$(this).closest('tr').removeClass('row_not_selected').addClass('row_selected');
           			$(this).closest('tr').find('td:nth-child(10)').find('button').css('visibility','hidden');
	           		$(this).closest('tr').find('td:nth-child(9)').find('input.journal_date').css('visibility','hidden');
           			$(this).closest('tr').find('td:nth-child(8)').find('input.journal_acc_no').css('visibility','hidden');

		        }
		        else{
		        	var o = balance_deprecation.updateObj(cno,'search');
		        	aSelected[o].selected = 'n';
		        	$(this).closest('tr').find('input[type="checkbox"]').removeAttr('checked');
		        	//$(this).closest('tr').find('input.journal_date,input.journal_date').removeAttr('disabled');
		        	$(this).closest('tr').removeClass('row_selected').addClass('row_not_selected');
           			$(this).closest('tr').find('td:nth-child(10)').find('button').css('visibility','visible');
	           		$(this).closest('tr').find('td:nth-child(9)').find('input.journal_date').css('visibility','visible');
           			$(this).closest('tr').find('td:nth-child(8)').find('input.journal_acc_no').css('visibility','visible');
           			aSelected[o].offset_account = ''
		        	aSelected[o].offset_account_val = '';
		        	aSelected[o].journal_date = '';
	        	}

		        if($('.dataTables_empty').length == 1 ){
					aSelected = [];
					balance_deprecation.clear();
					return;
				}

		       	var c = balance_deprecation.getSelectedCount();
		       	balance_deprecation.updateClass(c);
		        if(c.selected == 0){
		        	$('.no_sel').hide();
		        	$('.no_sel_d').hide();
		        	$('.all_check').removeAttr('checked');
		        	$('tr').removeClass('row_not_selected').removeClass('row_selected');
		        }
		        else{
		        	$('.no_sel').show();
		        	if(c.journal == 0){
						$('.no_sel_d').hide();
					}
					else{
						$('.no_sel_d').show();
					}
		        	if(c.selected > 1){
		        		var m = bd_td.$rows_sel;
		        	}
		        	else{
		        		var m = bd_td.$row_sel;
		        	}
		        	m = m.replace('%count%',c.selected);
		        	$('.sel_rows').html(m);

		        	if(c.selected == c.all){
		        		$('.all_check').prop('checked','checked');
		        	}
		        	else{
		        		$('.all_check').removeAttr('checked');	
		        	}
		        }
		        if(c.all <= 0){
					$('.bal_dep_reg').hide();
				}
				else{
					$('.bal_dep_reg').show();
				}
				if(c.selected <= 0){
		        	//$('.bal_dep_reg').hide();
		        	$('.no_sel_d').hide(); 
		        }
		        else{
		        	//$('.bal_dep_reg').show();
		        	$('.no_sel_d').show();
		        }
		        $.uniform.update();
		    });

			$('#table_depre').on( 'click', '.del_row', function () {
			   	var c = $(this).attr('data-id');
		   		table.$('tr').each(function(i){
		   			if($(this).find('.del_row').attr('data-id') == c){
		   				balance_deprecation.updateObj(c);
		   				table.row(this).remove().draw();
		   				return false;
		   			}
				});

				var c = balance_deprecation.getSelectedCount();
		        if(c.selected == 0){
		        	$('.no_sel').hide();
		        	$('.no_sel_d').hide();
		        	$('.all_check').removeAttr('checked');
		        }
		        else{
		        	$('.no_sel').show();
		        	if(c.journal == 0){
						$('.no_sel_d').hide();
					}
					else{
						$('.no_sel_d').show();
					}
		        	if(c.selected > 1){
		        		var m = bd_td.$rows_sel;
		        	}
		        	else{
		        		var m = bd_td.$row_sel;
		        	}
		        	m = m.replace('%count%',c.selected);
		        	$('.sel_rows').html(m);
		        	
		        	if(c.selected == c.all){
		        		$('.all_check').prop('checked','checked');
		        	}
		        	else{
		        		$('.all_check').removeAttr('checked');	
		        	}
		        }

		        if(c.all <= 0){
					$('.bal_dep_reg').hide();
				}
				else{
					$('.bal_dep_reg').show();
				}
				if(c.selected <= 0){
		        	//$('.bal_dep_reg').hide();
		        	$('.no_sel_d').hide(); 
		        }
		        else{
		        	//$('.bal_dep_reg').show();
		        	$('.no_sel_d').show();
		        }
		        $.uniform.update();
			});
			
			/*$('#table_depre').on( 'click', '.journal_row', function () {
	   			var id = $(this).attr('data-id');
	   			var o = balance_deprecation.updateObj(id,'search');
	   			if(aSelected[o].journal=='disabled'){
	   				setTimeout(function(){
	   					$('.journal_date_'+id).datepicker('setDate', new Date());
		   				$('.journal_acc_no_'+id+',.journal_date_'+id).removeAttr('disabled');
		   				aSelected[o].journal = '';
		   				aSelected[o].journal_date = new Date();
	   				},1);
	   				
	   			}
	   			else{
	   				setTimeout(function(){
	   					$('.journal_acc_no_wr_'+id+' div').css('position','absolute');
		   				$('.journal_acc_no_'+id+',journal_acc_no_hidden_'+id).val('').trigger('change');
		   				$('.journal_date_'+id).val('').datepicker('update');
		   				$('.journal_acc_no_'+id+',.journal_date_'+id).attr('disabled','disabled');
		   				aSelected[o].journal = 'disabled';
		   				aSelected[o].journal_date = '';
		   			},1);
	   			}

	   			setTimeout(function(){
		   			var c = balance_deprecation.getSelectedCount();
			        if(c.selected == 0){
			        	$('.no_sel').hide();
			        	$('.no_sel_d').hide();
			        	$('.all_check').removeAttr('checked');
			        }
			        else{
			        	$('.no_sel').show();
			        	if(c.journal == 0){
							$('.no_sel_d').hide();
						}
						else{
							$('.no_sel_d').show();
						}
			        	if(c.selected > 1){
			        		var m = bd_td.$rows_sel;
			        	}
			        	else{
			        		var m = bd_td.$row_sel;
			        	}
			        	m = m.replace('%count%',c.selected);
			        	$('.sel_rows').html(m);

			        	if(c.selected == c.all){
			        		$('.all_check').prop('checked','checked');
			        	}
			        	else{
			        		$('.all_check').removeAttr('checked');	
			        	}
			        }
			        if(c.all <= 0){
					$('.bal_dep_reg').hide();
				}
				else{
					$('.bal_dep_reg').show();
				}
				if(c.selected <= 0){
			        	//$('.bal_dep_reg').hide();
			        	$('.no_sel_d').hide(); 
			        }
			        else{
			        	//$('.bal_dep_reg').show();
			        	$('.no_sel_d').show();
			        }
			    },1);
	   		});*/

			$('#table_depre').on( 'click', '.journal_acc_no_wr', function () {

	   			var id = $(this).attr('data-id');
	   			$('.journal_acc_no_wr_'+id+' div').css('position','');

	   			var o = balance_deprecation.updateObj(id,'search');
	   			if(aSelected[o].journal=='disabled'){
	   				setTimeout(function(){
	   					$('.journal_date_'+id).datepicker('setDate', new Date());
		   				$('.journal_acc_no_'+id+',.journal_date_'+id).removeAttr('disabled');
		   				aSelected[o].journal = '';
		   				aSelected[o].journal_date = new Date();
	   				},1);
	   				
	   			}

	   			setTimeout(function(){
	   				$('.journal_acc_no_'+id).focus();
		   			var c = balance_deprecation.getSelectedCount();
			        if(c.selected == 0){
			        	$('.no_sel').hide();
			        	$('.no_sel_d').hide();
			        	$('.all_check').removeAttr('checked');
			        }
			        else{
			        	if(c.journal == 0){
							$('.no_sel_d').hide();
						}
						else{
							$('.no_sel_d').show();
						}
			        	$('.no_sel').show();
			        	if(c.selected > 1){
			        		var m = bd_td.$rows_sel;
			        	}
			        	else{
			        		var m = bd_td.$row_sel;
			        	}
			        	m = m.replace('%count%',c.selected);
			        	$('.sel_rows').html(m);

			        	if(c.selected == c.all){
			        		$('.all_check').prop('checked','checked');
			        	}
			        	else{
			        		$('.all_check').removeAttr('checked');	
			        	}
			        }
			        if(c.all <= 0){
					$('.bal_dep_reg').hide();
				}
				else{
					$('.bal_dep_reg').show();
				}
				if(c.selected <= 0){
			        	//$('.bal_dep_reg').hide();
			        	$('.no_sel_d').hide(); 
			        }
			        else{
			        	//$('.bal_dep_reg').show();
			        	$('.no_sel_d').show();
			        }
			    },1);
	   		});
	   		
	   		$('#table_depre').on( 'change', '.journal_date', function () {
	   			var data_id = $(this).attr('data-id');
	   			var o = balance_deprecation.updateObj(data_id,'search');

	   			if($(this).val() == ''){
	   				aSelected[o].journal_date = '';
	   			}
	   			else{
	   				var d = $(this).datepicker('getDate');
	   				aSelected[o].journal_date = d;
	   			}	   			
	   		});

	   		
	   		$('#table_depre').on( 'change', '.journal_acc_no', function () {
	   			if($(this).val() == ''){
	   				var a = $(this).attr('data-id');
	   				$('.journal_acc_no_hidden_'+a).val('').trigger('change');
	   			}
	   		});

	   		$('#table_depre').on( 'change', '.journal_acc_no_hidden', function () {
	   			var v = $(this).val();

	   			var data_id = $(this).attr('data-id');
	   			var o = balance_deprecation.updateObj(data_id,'search');
	   			if(checkNull(v)!=''){
	   				v = JSON.parse(v);
	   				aSelected[o].offset_account = v.item.val;
	   				aSelected[o].offset_account_val = v;
	   			}
	   			else{
	   				aSelected[o].offset_account = '';
	   				aSelected[o].offset_account_val = '';
	   			}
	   		});


	   		$('.all_check').change(function(){
	   			var a = $(this).attr('id');
	   			var chckd = $('#'+a+':checked').length;
	   			if(chckd==1){
	   				$('#foot_all_check,#head_all_check').prop('checked','checked');
	   			}
	   			else{
	   				$('#foot_all_check,#head_all_check').removeAttr('checked');
	   			}

		      
		        table.$('input[type="checkbox"]').each(function(){
		        	var aa = $(this).attr('id');
		        	var cno = $(this).attr('data-id');
	   				if(chckd){
	   					$(this).prop('checked','checked');
	   					$(this).closest('tr').addClass('row_selected');
	   					var o = balance_deprecation.updateObj(cno,'search');
	   					aSelected[o].selected = 'y';	
	   					aSelected[o].offset_account = ''
		        		aSelected[o].offset_account_val = '';
		        		aSelected[o].journal_date = '';
   					 	$(this).closest('tr').find('td:nth-child(10)').find('button').css('visibility','hidden');
		           		$(this).closest('tr').find('td:nth-child(9)').find('input.journal_date').css('visibility','hidden');
	           			$(this).closest('tr').find('td:nth-child(8)').find('input.journal_acc_no').css('visibility','hidden');			
	   				}
	   				else{
	   					var o = balance_deprecation.updateObj(cno,'search');
	   					aSelected[o].selected = 'n';	
	   					aSelected[o].offset_account = ''
		        		aSelected[o].offset_account_val = '';
		        		aSelected[o].journal_date = '';
	   					$(this).removeAttr('checked');
	   					$(this).closest('tr').removeClass('row_selected');
	           			$(this).closest('tr').find('td:nth-child(10)').find('button').css('visibility','visible');
		           		$(this).closest('tr').find('td:nth-child(9)').find('input.journal_date').css('visibility','visible');
	           			$(this).closest('tr').find('td:nth-child(8)').find('input.journal_acc_no').css('visibility','visible');
	   				}	   				
		        });
	   			
	   			var c = balance_deprecation.getSelectedCount();
		        if(c.selected == 0){
		        	$('.no_sel').hide();
		        	$('.no_sel_d').hide();
		        	$('.all_check').removeAttr('checked');
		        }
		        else{
		        	$('.no_sel').show();
		        	if(c.journal == 0){
						$('.no_sel_d').hide();
					}
					else{
						$('.no_sel_d').show();
					}
		        	if(c.selected > 1){
		        		var m = bd_td.$rows_sel;
		        	}
		        	else{
		        		var m = bd_td.$row_sel;
		        	}
		        	m = m.replace('%count%',c.selected);
		        	$('.sel_rows').html(m);

		        	if(c.selected == c.all){
		        		$('.all_check').prop('checked','checked');
		        	}
		        	else{
		        		$('.all_check').removeAttr('checked');	
		        	}
		        }
		        if(c.all <= 0){
					$('.bal_dep_reg').hide();
				}
				else{
					$('.bal_dep_reg').show();
				}
				if(c.selected <= 0){
		        	//$('.bal_dep_reg').hide();
		        	$('.no_sel_d').hide(); 
		        }
		        else{
		        	//$('.bal_dep_reg').show();
		        	$('.no_sel_d').show();
		        }
		        $.uniform.update();
	   		});


			//table.rows.add(tabledata).draw();
			if(page!=''){
				//table.fnPageChange(page);
			}
   		}
   		else{
   			$('#table_depre').hide();
   			$('.no_rec').show();
   		}
   		$('#table_depre').css('width','100%');

   		var htm = '<div class="span6 action_all" style="">';

   			htm += '<button class="btn btn-outline green bal_dep_reg" id="" style="display:none"  onclick="balance_deprecation.save(1)" >';
				htm += '<i class="icon-ok"></i>&nbsp;';
				htm += bd_td.$bal_register;
			htm += '</button>';

			// htm += '<button class="btn btn-outline green no_sel" id="" onclick="balance_deprecation.removeSelected()" style="display:none">';
			// 	htm += '<i class="icon-remove"></i>&nbsp;';
			// 	htm += bd_td.Removeselected;
			// htm += '</button>';	

			// htm += '<button class="btn btn-outline green no_sel" id="" onclick="balance_deprecation.journalRow()" style="display:none">';
			// 	htm += '<i class="icon-plus"></i>&nbsp;';
			// 	htm += bd_td.Journalselected;
			// htm += '</button>';

   			htm += '<input style="margin:0;width:100px;display:none" placeholder="'+bd_td.Journaldate+'" class="span12 date m-wrap journal_date_all no_sel_d" onchange="balance_deprecation.updateSelectedDate()" date-format="'+bd_dt.date_format_f+'" type="text">';

   			htm += '<select style="margin:0;display:none" class="span12 date m-wrap journal_acc_no_all no_sel_d" onchange="" type="text"><option value=""></option>'+ptlao+'</select><input type="hidden" class="journal_acc_no_all_hidden">';

		htm += '</div>';
		
		$('.action_all').remove();
		$('.dataTables_extended_wrapper').append(htm);
		$('select.journal_acc_no_all').select2({
			placeholder:bd_td.Offsetaccount,
			allowClear:true,
			dropdownAutoWidth:true,
			width: 'auto'
		});
		$('.journal_date_all').datepicker({
   			format:bd_dt.date_format_f,

   		}).change(function(){
   			$('.datepicker').remove();
   		});
		$('.select2-container.journal_acc_no_all').hide();
		$('.journal_acc_no_all').change(function(){
			var v = $(this).val();
			if(checkNull(v) != ''){
				for(var j in ptla){
					if(ptla[j].id == v){
						var d = {item:ptla[j]};
						$('.journal_acc_no_all_hidden').val(JSON.stringify(d)).trigger('change');
						balance_deprecation.updateSelJournalAcc();
					}
				}	
			}
			else{
				$('.journal_acc_no_all_hidden').val('').trigger('change');
				balance_deprecation.updateSelJournalAcc();
			}
		});

		var c = balance_deprecation.getSelectedCount();
		if(c.all <= 0){
			$('.bal_dep_reg').hide();
		}
		else{
			$('.bal_dep_reg').show();
		}
		 	
   		
  
	},
	updateObj:function(data_id,from=''){
		var found = 'notfound';
		var l = '';
		for(var j in aSelected){
			if(aSelected[j].data_id == data_id){
				found = j;
				l = j;
				if(from!='search'){
					aSelected.splice(j,1);
				}
				break;
				
			}
		}
		
		return found;
	},
	getSelectedCount:function(){
		var s = 0;
		var a = aSelected.length;
		var jc = 0;
		for(var j in aSelected){
			if(aSelected[j].selected=='y'){
				s++;
			}
			if(aSelected[j].journal==''){
				jc++;
			}
		}
		return {selected:s,all:a,journal:jc};
	},
	getData:function(){
		table.$('input[type="text"]').each(function(){
			var date_val = $(this).val();
			
		});

	},
	removeSelected:function(){
		showProcessingImage('undefined');
		var d = 0;
		var remove_ids = [];
		var dSel = aSelected;
		for(var j in dSel){
			if( dSel[j].selected=='y'){
				table.$('tr').each(function(i){
		   			if( ($(this).find('input').attr('data-id') == dSel[j].data_id)){
		   				remove_ids.push(dSel[j].data_id);
		   				return false;
		   			}
				});
			}
		}
		
		for(var j in remove_ids){
			$('.del_row[data-id="'+remove_ids[j]+'"]').trigger('click');
		}

		if($('.dataTables_empty').length == 1 ){
			aSelected = [];
			balance_deprecation.clear();
			hideProcessingImage();
			return;
		}

		var c = balance_deprecation.getSelectedCount();
        if(c.selected == 0){
        	$('.no_sel').hide();
        	$('.no_sel_d').hide();
        	$('.all_check').removeAttr('checked');
        }
        else{
        	$('.no_sel').show();

        	if(c.selected > 1){
        		var m = bd_td.$rows_sel;
        	}
        	else{
        		var m = bd_td.$row_sel;
        	}
        	m = m.replace('%count%',c.selected);
        	$('.sel_rows').html(m);
        	
        	if(c.selected == c.all){
        		$('.all_check').prop('checked','checked');
        	}
        	else{
        		$('.all_check').removeAttr('checked');	
        	}
        }
        if(c.all <= 0){
					$('.bal_dep_reg').hide();
				}
				else{
					$('.bal_dep_reg').show();
				}
				if(c.selected <= 0){
        	//$('.bal_dep_reg').hide();
        	$('.no_sel_d').hide(); 
        }
        else{
        	//$('.bal_dep_reg').show();
        	$('.no_sel_d').show();
        }
	    $.uniform.update();
	    hideProcessingImage();
	},
	journalSelected:function(){
		showProcessingImage('undefined');
		for(var j in aSelected){

			if(aSelected[j].selected == 'y'){
				var id = aSelected[j].data_id;
				if(aSelected[j].journal=='disabled'){
					$('.journal_date_'+id).datepicker('setDate', new Date());
	   				$('.journal_acc_no_'+id+',.journal_date_'+id).removeAttr('disabled');
	   				aSelected[j].journal = '';
	   				aSelected[j].journal_date = new Date();
				}
				else{
					$('.journal_acc_no_'+id+',journal_acc_no_hidden_'+id).val('').trigger('change');
	   				$('.journal_date_'+id).val('').datepicker('update');
	   				$('.journal_acc_no_'+id+',.journal_date_'+id).attr('disabled','disabled');
	   				aSelected[j].journal = 'disabled';
	   				aSelected[j].journal_date = '';
				}
			}
		}
		var c = balance_deprecation.getSelectedCount();
        if(c.selected == 0){
        	$('.no_sel').hide();
        	$('.all_check').removeAttr('checked');
        	$('.no_sel_d').hide();

		}
        else{
        	$('.no_sel').show();
        	if(c.journal == 0){
				$('.no_sel_d').hide();
			}
			else{
				$('.no_sel_d').show();
			}
        	if(c.selected > 1){
        		var m = bd_td.$rows_sel;
        	}
        	else{
        		var m = bd_td.$row_sel;
        	}
        	m = m.replace('%count%',c.selected);
        	$('.sel_rows').html(m);

        	if(c.selected == c.all){
        		$('.all_check').prop('checked','checked');
        	}
        	else{
        		$('.all_check').removeAttr('checked');	
        	}
        }
        if(c.all <= 0){
					$('.bal_dep_reg').hide();
				}
				else{
					$('.bal_dep_reg').show();
				}
				if(c.selected <= 0){
        	//$('.bal_dep_reg').hide(); 
        }
        else{
        	//$('.bal_dep_reg').show();
        }
        hideProcessingImage();
	},
	updateSelectedDate:function(){
		// showProcessingImage('undefined');
		// var d = $('.journal_date_all').datepicker('getDate');
		// for(var j in aSelected){
		// 	//aSelected[j].journal=='' &&
		// 	if(aSelected[j].selected=='y'){
		// 		table.$('tr').each(function(){
		// 			if( ($(this).find('input').attr('data-id') == aSelected[j].data_id)) {
		// 				$('.journal_date_'+aSelected[j].data_id).datepicker('setDate', d);
		// 				aSelected[j].journal_date = d;

		// 				return false;
		// 			}
		// 		});
		// 	}
		// }
		// $('.journal_date_all').val('').datepicker('update');
		// hideProcessingImage();
	},
	updateSelJournalAcc:function(){
		// showProcessingImage('undefined');hideProcessingImage();
		// var v = $('.journal_acc_no_all_hidden').val();
		// if(checkNull(v)==''){
		// 	hideProcessingImage();
		// 	return;
		// }
		// var vj = JSON.parse(v);
		// for(var j in aSelected){
		// 	table.$('tr').each(function(){
		// 		// &&  aSelected[j].journal==''
		// 		if( $(this).find('input').attr('data-id') == aSelected[j].data_id && aSelected[j].selected=='y') {
		// 			aSelected[j].offset_account = vj.item.val
		// 			aSelected[j].offset_account_val = vj;
		// 			$('.journal_acc_no_'+aSelected[j].data_id).val(vj.item.value);
		// 			$('.journal_acc_no_hidden_'+aSelected[j].data_id).val(v);
		// 			return false;
		// 		}
		// 	});
		// }
		// setTimeout(function(){
		// 	$('.journal_acc_no_all_hidden,.journal_acc_no_all').val('').trigger('change');
		// },1);
		// hideProcessingImage();
	},
	save:function(frm=1,that=''){
		var msg1 = '';
		var msg2 = '';

		var obj = {
			chk_invoice:[],
			interest_fee:[],
			late_fee:[],
			invoice_balance:[],
			invoice_id:[],
			currency:[],
			bank_account:[],
			paid_date:[],
			receiver:[],		
		};

		//frm == 1 selected else single line
		var msg3 = '';
		var msg4 = '';
		var c = balance_deprecation.getSelectedCount();
		if(frm == 1){
			
			if(c.selected != 0){
				var journal_date = $('.journal_date_all').val();
				var offset_account_val = $('.journal_acc_no_all_hidden').val();
				var offset_account = '';
				if(checkNull(offset_account_val) != ''){
					offset_account_val = JSON.parse(offset_account_val);
					if(checkNull(offset_account_val.item) != ''){
						offset_account = offset_account_val.item.val;
					}
				}
				if(checkNull(offset_account) == '' ){
					msg3 = bd_td.Offsetaccount + '<br/>';
				}
				if(checkNull(journal_date) == '' ){
					msg4 = bd_td.Journaldate+ '<br/>';
				}
				var journal_date = $('.journal_date_all').datepicker('getDate');
			}
		}
		else if(frm == 2){
			var data_id = [];
			var data_ids = $(that).attr('data-id');
			var o = balance_deprecation.updateObj(data_ids,'search');
		
			if(checkNull(aSelected[o].offset_account) == '' ){
					msg1 = bd_td.Offsetaccount + '<br/>';
			}
			if(checkNull(aSelected[o].journal_date) == '' ){
				msg2 = bd_td.Journaldate+ '<br/>';
			}

			var j = o;
			obj.chk_invoice.push(aSelected[j].invoice_id);
			obj.interest_fee.push(0);
			obj.late_fee.push(0);
			obj.invoice_balance.push(aSelected[j].out_standing_balance);
			obj.invoice_id.push(aSelected[j].invoice_id);
			obj.currency.push(aSelected[j].currency_id);
			obj.bank_account.push(aSelected[j].offset_account);
			var paid_date = '';
			if(checkNull(aSelected[j].journal_date,'') != ''){
				paid_date = moment(aSelected[j].journal_date).format('YYYY-MM-DD');
			}
			obj.paid_date.push(paid_date);
			obj.receiver.push(aSelected[j].receiver_id);

			data_id.push(aSelected[j].data_id);

		}
		if(msg1!='' || msg2!=''){
			var msg = bd_td.Pleasecheckthefollowingfields+'<br/>';
			msg += msg1 + msg2;
			showAlertMessage(msg,'error',bd_td.alertmessage);
			return;
		}

		if(frm == 1){
			var insert_count_bulk = 0;
			var insert_count = 0;
			var data_id = [];
			for(var j in aSelected){
				if(aSelected[j].selected == 'y' && msg3 == '' && msg4 == ''){
					insert_count_bulk++;
					obj.chk_invoice.push(aSelected[j].invoice_id);
					obj.interest_fee.push(0);
					obj.late_fee.push(0);
					obj.invoice_balance.push(aSelected[j].out_standing_balance);
					obj.invoice_id.push(aSelected[j].invoice_id);
					obj.currency.push(aSelected[j].currency_id);
					obj.bank_account.push(offset_account);
					var paid_date = '';
					if(checkNull(journal_date,'') != ''){
						paid_date = moment(journal_date).format('YYYY-MM-DD');
					}
					obj.paid_date.push(paid_date);
					obj.receiver.push(aSelected[j].receiver_id);
					data_id.push(aSelected[j].data_id);
				}
				else if(checkNull(aSelected[j].offset_account) != '' && checkNull(aSelected[j].journal_date) != ''){
					insert_count ++;
					obj.chk_invoice.push(aSelected[j].invoice_id);
					obj.interest_fee.push(0);
					obj.late_fee.push(0);
					obj.invoice_balance.push(aSelected[j].out_standing_balance);
					obj.invoice_id.push(aSelected[j].invoice_id);
					obj.currency.push(aSelected[j].currency_id);
					obj.bank_account.push(aSelected[j].offset_account);
					var paid_date = '';
					if(checkNull(aSelected[j].journal_date,'') != ''){
						paid_date = moment(aSelected[j].journal_date).format('YYYY-MM-DD');
					}
					obj.paid_date.push(paid_date);
					obj.receiver.push(aSelected[j].receiver_id);
					data_id.push(aSelected[j].data_id);
				}
			}	
			var total_count = insert_count + insert_count_bulk;
			if(total_count == 0){
				if(insert_count_bulk == 0 && c.selected > 0){
					var msg = bd_td.Pleasecheckthefollowingfields+'<br/>';
					msg += msg3 + msg4;
					showAlertMessage(msg,'error',bd_td.alertmessage);
					return;
				}
				else if(insert_count == 0 && insert_count_bulk==0){
					showAlertMessage(bd_td.Norecordavailable,'error',bd_td.alertmessage);
					return;
				}		
				else if(insert_count == 0){
					showAlertMessage(bd_td.Norecordavailable,'error',bd_td.alertmessage);
					return;
				}
			}
		}


		var p = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		};
		
		var total_params = Object.assign(p,obj);

		var params = $.extend({}, doAjax_params_default);
		params['requestType'] = 'POST';
		params['url'] = APISERVER+'/api/Invoices/registerBulkPayment.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				var msg = complet_data.response.response.successMessage;
				call_toastr('success',bd_td.Success,msg);
				//$('.bal_dep_reg').hide();
				for(var j in data_id){
					table.$('tr').each(function(i){
			   			if($(this).find('.del_row').attr('data-id') == data_id[j]){
			   				balance_deprecation.updateObj(c);
			   				table.row(this).remove().draw();
			   				//return false;
			   			}
					});
					for(var k in aSelected){
						if(aSelected[k].data_id == data_id[j]){
							delete aSelected[k];
						}
					}
				}

				
				if($('.dataTables_empty').length == 1 ){
					aSelected = [];
					balance_deprecation.clear();
					return;
				}
				var c = balance_deprecation.getSelectedCount();
				if(c.selected == 0){
		        	$('.no_sel').hide();
		        	$('.no_sel_d').hide();
		        	$('.all_check').removeAttr('checked');
		        }
		        else{
		        	$('.no_sel').show();
		        	if(c.journal == 0){
						$('.no_sel_d').hide();
					}
					else{
						$('.no_sel_d').show();
					}
		        	if(c.selected > 1){
		        		var m = bd_td.$rows_sel;
		        	}
		        	else{
		        		var m = bd_td.$row_sel;
		        	}
		        	m = m.replace('%count%',c.selected);
		        	$('.sel_rows').html(m);
		        	
		        	if(c.selected == c.all){
		        		$('.all_check').prop('checked','checked');
		        	}
		        	else{
		        		$('.all_check').removeAttr('checked');	
		        	}
		        }
		        if(c.all <= 0){
					$('.bal_dep_reg').hide();
				}
				else{
					$('.bal_dep_reg').show();
				}
				if(c.selected <= 0){
		        	//$('.bal_dep_reg').hide(); 
		        }
		        else{
		        	//$('.bal_dep_reg').show();
		        }

			    $.uniform.update();
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bd_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bd_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
	},
	clear:function(from='fun'){
		$('#table_depre').DataTable().destroy();
		if(from=='btn'){
			$('#from_amount,#to_amount,#from_date,#to_date').val('');
		}
		
		$('#table_depre').hide();
		$('.no_rec').hide();
	},
	updateClass:function(c){
		if(c.selected == 0){
			$('tr').removeClass('row_selected').removeClass('row_not_selected');
		}
		else{
			for(var j in aSelected){
				var d = aSelected[j];
				
				if(d.selected == 'y'){
					$('.journal_date[data-id="'+d.data_id+'"]').parent().parent().removeClass('row_not_selected').addClass('row_selected');
				}
				else{
					$('.journal_date[data-id="'+d.data_id+'"]').parent().parent().removeClass('row_selected').addClass('row_not_selected');
				
				}
			}
		}
	},
	
}

