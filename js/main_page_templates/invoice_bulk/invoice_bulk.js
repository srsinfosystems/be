var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();

var ib_dt;
var ib_td;
var w=1;

var invoice_bulk = {
	start:function(){
		w = 1;

		invoice_bulk.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Bulk Invoice report','Reports','Generated Reports','Actions','Delete All','Generate Report','$sr_no','Report criteria','Report created','Action','View','Prev','Next','records','Found total','of','Email','Delete','$delete_report','$delete_reports','Confirmation','Cancel','success','Success','No record found','$conflict_note'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/invoices/getInvoiceBulkData.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ib_dt = complet_data.response.response;
				ib_td = complet_data.response.response.translationsData;
				invoice_bulk.createHtml(complet_data.response.response);
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ib_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ib_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		ib_td.dashboardurl = base_url+'dashboard/index';
		ib_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('invoice_bulk_template').innerHTML;
		var compiledRendered = Template7(template, ib_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		invoice_bulk.bindEvents();
	},
	bindEvents:function(){
		$('#vltry_prtcpnt_table').dataTable({ 
			
			"aoColumns": [
			  { "bSortable": false },
			  { "bSortable": true },
			  { "bSortable": true },
			  { "bSortable": true },
			  { "bSortable": false },
			],
			"aLengthMenu": [ 10, 25, 50, 100 ],
			//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
			"sDom": "<'row-fluid't><'row-fluid'<'span12'pli>>",
			"sPaginationType": "input",

			"oLanguage": {
				"sLengthMenu": 
		           ib_td.View+ ' <select>'+
		             '<option value="10">10</option>'+
		             '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		             '<option value="40">40</option>'+
		             '<option value="50">50</option>'+
		             '<option value="-1">All</option>'+
		             '</select> '+ ib_td.records
		         ,
				"oPaginate": {
					"sPrevious": '<i class="icon-angle-left"></i>',
					"sNext": '<i class="icon-angle-right"></i>',
					'of':ib_td.of,
				},
				
				"sInfo": ib_td.Foundtotal+" _TOTAL_ "+ib_td.records
			}
		});

		$('#checkall').uniform().change(function(){
			var chckd = $('#checkall:checked').length;
			if(chckd==1){
				$('.checksingle').prop('checked','checked');
			}
			else{
				$('.checksingle').removeAttr('checked');
			}
			$('.checksingle').trigger('change');
			$.uniform.update();
		});

		$('.checksingle').uniform().change(function(){
			var a = $('.checksingle').length;
			var b = $('.checksingle:checked').length;
			if(a==b){
				$('#checkall').prop('checked','checked');
			}
			else{
				$('#checkall').removeAttr('checked');
			}
			if(b!=0){
				$('#delete-multiple').show();
			}
			else{
				$('#delete-multiple').hide();
			}
			$.uniform.update();
		});

		$('#delete-multiple').click(function(){
			invoice_bulk.delete_report('','y');
		});
	},
	listenForData:function(){
	
	},
	generateArchiveReport:function(data){
		var ret = '';
		ret += '<tr>';
			ret += '<td>';
				ret += '<input id="checkall_'+data.id+'" name="checksingle" data-primary-id="'+data.id+'" class="checksingle"  type="checkbox">';
			ret += '</td>';

			ret += '<td>';
				ret += w++;
			ret += '</td>';

			ret += '<td>';
				ret += convertDateIntoSiteFormat(data.report_date_time);
			ret += '</td>';

			ret += '<td>';
				var crit = data.criteria.trim();
				ret += crit.charAt(0).toUpperCase() + crit.slice(1);
			ret += '</td>';

			ret += '<td>';
				ret += '<a class="btn mini blue-stripe" style="cursor:pointer" href="javascript:;" onclick="invoice_bulk.download('+data.id+')"><i class="icon-eye-open"></i> '+ib_td.View+'</a> ';

				ret += '<a style="cursor:pointer;" class="btn mini blue-stripe" onclick="event.stopPropagation(); show_modal(this,\'popups1\');" data-width="750px" data-url="http://minbefaring.nor/partner/reports/send_email_report/'+data.id+'/invoice_bulk"><i class="icon-envelope"></i>&nbsp;'+ib_td.Email+'</a> ';

				ret += '<button data-dismiss="modal" class="btn mini red-stripe" onclick="invoice_bulk.delete_report('+data.id+')" type="button"><i class="icon-remove"></i> '+ib_td.Delete+'</button> ';
			ret += '</td>';		
									
		ret += '</tr>';
		return ret;
	},
	download:function(id){
		for(var j in ib_dt.reportList){
			var d = ib_dt.reportList[j].ArchiveReport;
			if(id==d.id){
				var dir = 'invoices/'+d.report_file_name;
				var path = APISERVER+'/api/downloads/report/'+btoa(dir)+'.json';
				openPdf(path); 
			}
		}
	},
	delete_report:function(id,multi='n'){
		var yes = function(){
			console.log(id);
			var ids = [id];

			showProcessingImage('undefined');
			var folder_name = 'voluntary/'+partner_id;
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				folder_name:folder_name,
				selectedreport:ids
			};
			ids = [];
			if(multi=='y'){
				$('.checksingle').each(function(){
					console.log($(this));
					var id = $(this).attr('id');
					
					if($('#'+id+':checked').length==1){
						var primary_id = $(this).attr('data-primary-id');
						ids.push(parseInt(primary_id));
					}
				});
				
				total_params.selectedreport = ids;
				total_params.multiple = 'y';
				
			}
			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Reports/deleteReports.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();

			}
			
			params['successCallbackFunction'] = function (complet_data){
				var msg = complet_data.response.response.message;
				call_toastr(ib_td.success, ib_td.Success,msg);
				invoice_bulk.start();
			}
			doAjax(params);
			return;
		}
		var no = function(){

		};
		var msg = '';
		if(multi=='y'){
			msg = ib_td.$delete_reports;
		}
		else{
			msg = ib_td.$delete_report;
		}
		showDeleteMessage(msg,ib_td.Confirmation,yes,no,'ui-dialog-blue',ib_td.Delete,ib_td.Cancel);
		
	}
	
}


Template7.registerHelper('archiveReportTableHelper', function (data){
	return invoice_bulk.generateArchiveReport(data);
});
