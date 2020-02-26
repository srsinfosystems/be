var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();

var global_vwrk_rprt_data;
var global_vwrk_rprt_translations_data;
var w=1;

var vwr_pagelength = 10;
var vwr_current_page = 1;
var vwr_per_page = 10;
var vwr_last_page = 0;
var vwr_trn_sort = 'DESC';

var voluntary_work_report = {
	start:function(){
		w = 1;
		voluntary_work_report.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			sort :'report_date_time',
			direction :vwr_trn_sort,	
			report_type:'voluntary_participant',
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Voluntary participants report','Reports','Generated Reports','Actions','Delete All','Generate Report','$sr_no','Report criteria','Report created','Action','View','Prev','Next','records','Found total','of','Email','Delete','$delete_report','$delete_reports','Confirmation','Cancel','success','Success','No record found','Page'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/reports/getReportList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_vwrk_rprt_data = complet_data.response.response;
				global_vwrk_rprt_translations_data = complet_data.response.response.translationsData;
				voluntary_work_report.createHtml(complet_data.response.response);
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_vwrk_rprt_translations_data.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_vwrk_rprt_translations_data.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		global_vwrk_rprt_translations_data.dashboardurl = base_url+'dashboard/index';
		global_vwrk_rprt_translations_data.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('voluntary_work_report_template').innerHTML;
		var compiledRendered = Template7(template, global_vwrk_rprt_data);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		voluntary_work_report.bindEvents();
	},
	bindEvents:function(){
		
		voluntary_work_report.generateArchiveReport(global_vwrk_rprt_data.reportList,global_vwrk_rprt_data.pagination	);
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
			voluntary_work_report.delete_report('','y');
		});
	},
	listenForData:function(){
	
	},
	generateArchiveReport:function(datas,pagination){
		var ret = '';
		var w = pagination.start_from+1;
		for(var j in datas){
			var data = datas[j].ArchiveReport;
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
					ret += '<a class="btn mini blue-stripe" style="cursor:pointer" href="javascript:;" onclick="voluntary_work_report.download('+data.id+')"><i class="icon-eye-open"></i> '+global_vwrk_rprt_translations_data.View+'</a> ';

					ret += '<a style="cursor:pointer;" class="btn mini blue-stripe" onclick="event.stopPropagation(); show_modal(this,\'popups1\');" data-width="750px" data-url="'+base_url+'reports/send_email_report/'+data.id+'/voluntary_participant"><i class="icon-envelope"></i>&nbsp;'+global_vwrk_rprt_translations_data.Email+'</a> ';

					ret += '<button data-dismiss="modal" class="btn mini red-stripe" onclick="voluntary_work_report.delete_report('+data.id+')" type="button"><i class="icon-remove"></i> '+global_vwrk_rprt_translations_data.Delete+'</button> ';
				ret += '</td>';		
										
			ret += '</tr>';
		}


			
		var html = '<div class="row-fluid form-inline dt_rem">';
			html += '<div class="span12 dataTables_extended_wrapper">';
			   	html += '<div class="dataTables_paginate paging_input" id="partner_inv_list_paginate">';
			   	 	html += '<span class="paginate_page">'+global_vwrk_rprt_translations_data.Page+' </span>';
	   	 		 	html += '<span class="previous prev btn btn-sm default paginate_button" id="partner_inv_list_previous prev btn btn-sm default"><i class="icon-angle-left"></i></span>';
	   	 			html += '<input class="paginate_input form-control input-mini input-inline input-sm" type="text">';
	   	 			html += '<span class="next next btn btn-sm default paginate_button" id="partner_inv_list_next next btn btn-sm default"><i class="icon-angle-right"></i></span>';
	   	 			html += '<span class="paginate_of"> '+global_vwrk_rprt_translations_data.of+' '+pagination.total_pages+' |</span>';
		   	 	html += '</div>';
			  	html += ' <div id="partner_inv_list_length" class="dataTables_length">';
			      	html += '<label style="margin-bottom:0">';
			        	html += global_vwrk_rprt_translations_data.View;
			        	html += ' <select id="partner_inv_list_sel" style="margin-right:2px">';
				            html += '<option value="10" selected="selected">10</option>';
				            html += '<option value="20">20</option>';
				            html += '<option value="30">30</option>';
				           	html += '<option value="40">40</option>';
				            html += '<option value="50">50</option>';
				            html += '<option value="-1">All</option>';
				         	html += '</select>';
			       		html += global_vwrk_rprt_translations_data.records;
			      	html += ' | </label>';
			   	html += '</div>';
			   	html += '<div class="dataTables_info" id="partner_inv_list_info" style="line-height:18px">'+global_vwrk_rprt_translations_data.Foundtotal+' '+pagination.total_records+' '+global_vwrk_rprt_translations_data.records+'</div>';
			html += '</div>';
		html += '</div>';

		vwr_last_page = pagination.total_pages;

		$('#vltry_prtcpnt_table tbody').html(ret);

		$('.checksingle').uniform();
		$('.checksingle').change(function(){
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
		$('.dt_rem').remove();
		$('#vltry_prtcpnt_table').after(html);
		if(data.length == 0){
			$('.inv_list_err').show();
			$('#vltry_prtcpnt_table').hide();
			$('.dt_rem').hide();
		}
		else{
			$('.inv_list_err').hide();
			$('#vltry_prtcpnt_table').show();
			$('.dt_rem').show();

		}

		$('#partner_inv_list_paginate .paginate_input').val(vwr_current_page)
		vwr_per_page = pagination.per_page;
		$('#partner_inv_list_sel').val(pagination.per_page);

		if(pagination.total_records < pagination.per_page){
			$("#partner_inv_list_length.dataTables_length label,#partner_inv_list_paginate").hide();

		}

		$('#partner_inv_list_paginate .prev').click(function(){
			if(vwr_current_page!=1){
				voluntary_work_report.getReports('prev',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .next').click(function(){
			if(vwr_current_page < vwr_last_page){
				voluntary_work_report.getReports('next',pagination.per_page);
			}
		});

		$('#partner_inv_list_paginate .paginate_input').change(function(){
			var v = $(this).val();

			if(checkNull(v) != '' && v != 0 && v != vwr_current_page && v <= vwr_last_page){
				voluntary_work_report.getReports('input',pagination.per_page,v);
			}
		});

		$("#partner_inv_list_length select").change(function(){
			var v = $(this).val();
			if(v==-1){
				v = 10000;
			}
			voluntary_work_report.getReports('dropdown',v);
		});
		
	},
	getReports:function(from='next',limit,v){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			limit:limit,
			page:vwr_current_page,
			sort :'report_date_time',	
			direction :vwr_trn_sort,	
			report_type:'voluntary_participant',
		}
		if(from=='next'){
			vwr_current_page++;
		}
		else if(from=='prev'){
			vwr_current_page--;
		}
		else if(from=='input'){
			vwr_current_page = v;
		}
		else if(from=='dropdown'){
			vwr_current_page = 1;
			total_params.limit = limit;
		}
		total_params.page = vwr_current_page;

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/reports/getReportList.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var dt = complet_data.response.response;
				voluntary_work_report.generateArchiveReport(dt.reportList,dt.pagination);
				
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
	sort:function(){
		if(vwr_trn_sort == 'DESC'){
			vwr_trn_sort = 'ASC';
		}
		else{
			vwr_trn_sort = 'DESC';
		}
		voluntary_work_report.getReports('input',10,1);
	},
	download:function(id){
		console.log(id);
		
		console.log(global_vwrk_rprt_data);
		for(var j in global_vwrk_rprt_data.reportList){
			var d = global_vwrk_rprt_data.reportList[j].ArchiveReport;
			if(id==d.id){
				var dir = 'voluntary/'+partner_id+'/'+d.report_file_name;
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
				call_toastr(global_vwrk_rprt_translations_data.success, global_vwrk_rprt_translations_data.Success,msg);
				voluntary_work_report.start();
			}
			doAjax(params);
			return;
		}
		var no = function(){

		};
		var msg = '';
		if(multi=='y'){
			msg = global_vwrk_rprt_translations_data.$delete_reports;
		}
		else{
			msg = global_vwrk_rprt_translations_data.$delete_report;
		}
		showDeleteMessage(msg,global_vwrk_rprt_translations_data.Confirmation,yes,no,'ui-dialog-blue',global_vwrk_rprt_translations_data.Delete,global_vwrk_rprt_translations_data.Cancel);
		
	}
	
}


Template7.registerHelper('archiveReportTableHelper', function (data){
	return voluntary_work_report.generateArchiveReport(data);
});
