var APISERVER = $('#APISERVER').val(); var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var type =  $('#type').val();
var partner_dir = $('#partner_dir').val();

var table ;
var srn_dt;
var srn_td;
var ds;

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
	var date_format_f = date_format_partner.toLowerCase();
}
else{
	var date_format_f = date_format.toLowerCase();
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
var sales_reports_new = {
	start:function(meta={}){

		srn_meta = meta;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			getTranslationsData:'yes',
			from_date:moment().add(-1, 'M').format('YYYY-MM-DD'),
			to_date:moment().format('YYYY-MM-DD'),
			user_type:0,
			prod_category_id:'',
			generate_report_as_whole:0,
			getTranslationsDataArray:['Dashboard','alert message','Success','Reports','Sales list report','Excel','PDF','View','records','of','Page','Found total','Columns','Sales list report','Email report','Type','Save','Cancel','Send','Excel','To myself','To other staffer','Custom email address','Distribution','Select staff','All','Select','Email','Email sent successfully','Success','Report generated successfully','Inventory groups','Price groups','Warehouse','Include product not in stock','All','Email report','From date','To date','Company','Staff','User type','Product category','All','$inv_exc_vat','Total before discount','Discount','Separate invoice and credit memos','Yes','No']
		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Reports/getSalesReports.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				srn_dt = complet_data.response.response;
				srn_td = complet_data.response.response.translationsData;
				x.a++;					
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',srn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',srn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		x.registerListener(function(val) {
		  if(x.a == 2){
		  	x.a = 0;
		  	App.scrollTop();
		  	sales_reports_new.createHtml(srn_dt);
		  }	
		});

		$.ajaxSetup({ cache: true });

		var scripts = [
			host_url+'app/webroot/plugins/data-tables/dataTables.buttons.js?v='+css_js_version,
			host_url+'app/webroot/plugins/data-tables/dataTables.columnvisibility.js?v='+css_js_version,
			host_url+'app/webroot/plugins/suwala.doublescroll/suwala.doublescroll.js?v='+css_js_version,
		];
		var queue = scripts.map(function(script) {
		    return $.getScript(script);
		});

		$.when.apply(null, queue).done(function() {
			x.a++;
		});
		
		doAjax(params);
		return;
	},
	createHtml:function(){
		srn_dt.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		srn_dt.base_url = base_url;
		srn_dt.customer_id = srn_meta.customer_id;
		srn_dt.date_format_f = date_format_f;

		var template = document.getElementById('sales_reports_new_template').innerHTML;
		var compiledRendered = Template7(template, srn_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		sales_reports_new.bindEvents();
		
		after_main_page();
	},
	bindEvents:function(){
		$('#from_date').datepicker({
   			format:srn_dt.date_format_f
   		}).datepicker('update',moment().add(-1, 'M')._d).change(function(){
   			$('.datepicker').remove();
   			var v = $('#from_date').datepicker('getDate');
   		});
   		

   		$('#to_date').datepicker({
   			format:srn_dt.date_format_f
   		}).datepicker('update',moment()._d).change(function(){
   			$('.datepicker').remove();
   			var v = $('#to_date').datepicker('getDate');
   		});

   		$('.uni').uniform();

   		$('#generate_report_as_whole').bootstrapSwitch();
   		$('#generate_report_as_whole').change(function(){
   			sales_reports_new.filterRecords();
   		});

		$('#user_type').change(function(){
			sales_reports_new.filterRecords();
		}).select2();

		$('#prod_category_id').change(function(){
			sales_reports_new.filterRecords();
		}).select2();

		var opts = '';
   		for(var j in srn_dt.getAllContactsEmail){
   			opts += '<option value="'+srn_dt.getAllContactsEmail[j]+'">'+srn_dt.getAllContactsEmail[j]+'</option>';
   		}
   		$('#to_staffers').append(opts).select2({
   			placeholder: srn_dt.Select,
			allowClear: true,
   		});

   		$('#report_type').select2();

   		$('#distribution').select2({
   			placeholder: srn_dt.Select,
			allowClear: true,
			minimumResultsForSearch:-1
   		}).change(function(){
   			var v = $('#distribution').val();
   			if(v=='to_custom'){
   				 $('.staffer_email_wrapper').addClass('hide');
   				 $('.customer_email_wrapper').removeClass('hide');
   			}
   			else if(v=='to_staffers'){
   				 $('.staffer_email_wrapper').removeClass('hide');
   				 $('.customer_email_wrapper').addClass('hide');
   			}
   			else{
   				 $('.customer_email_wrapper,.staffer_email_wrapper').addClass('hide');
   			}
   		});

		document.title = srn_td.Saleslistreport;
		sales_reports_new.generateTable(srn_dt.body,srn_dt.headerss,srn_dt.footer);
		hideProcessingImage();
	},
	generateTable:function(tabled,headerss,footer){
		if(headerss.length == 0){
			return;
		}
		var k = 0;
		var tableData = '';
		var colsz = [];
			$('.srn_tab_wrap').html('');

	
			var html = `<table id="srn_tb" style="font-size:12px" class="table table-striped table-bordered table-hover" style="width:100%"><thead>`;
				var ths = '';
				var filters = '';
				var visible_col = [];
				//0,1,7,8,9,15,16,17
				for(var l in headerss){
					ths += '<th>'+headerss[l]+'</th>';
					
					
					if(visible_col.length != 0 && visible_col.indexOf(parseInt(l)) === -1){
						colsz.push({name:headerss[l],"visible": false, "sortable": true});
						//filters += '<li class="fil_list"><input class="uni fil_list_uni"  type="checkbox" value="'+l+'"> '+headerss[l]+'</li>';
						filters += '<label><input class="uni fil_list_uni"  type="checkbox" value="'+l+'">'+headerss[l]+'</label>';
						
					}
					else{
						colsz.push({name:headerss[l], "sortable": true});
						//filters += '<li class="fil_list"><input class="uni fil_list_uni" checked="checked" type="checkbox" value="'+l+'"> '+headerss[l]+'</li>';
						filters += '<label><input class="uni fil_list_uni" checked="checked" type="checkbox" value="'+l+'" checked="checked">'+headerss[l]+'</label>';
					}
					
				}
			
				html += '<tr>'+ths + '</tr>'; 
			html += `</thead><tbody></tbody>`;


				if(checkNull(footer) != '' && footer.length != 0){
					var footer_html = '<tfoot><tr>';
					for(var j in footer){
						footer_html += '<th>'+footer[j]+'</th>';
					}
					footer_html += '</tr></tfoot>';
					html += footer_html;
				}
			html += `</table>`;


			$('.srn_tab_wrap').html(html);
			
		tableData = tabled;

				

		$('#srn_tb thead tr').clone(true).appendTo( '#srn_tb thead' );
	    $('#srn_tb thead tr:eq(1) th').each( function (i) {
	        var title = $(this).text();
	        $(this).html( '<input style="width: 75%;" type="text" placeholder="Search '+title+'" />' );
	 		

	        $( 'input', this ).on( 'keyup change', function () {
	            if ( table.column(i).search() !== this.value ) {
	                table
	                    .column(i)
	                    .search( this.value )
	                    .draw();
	            }
	            return false;
	        });
	    });

		table = $('#srn_tb').DataTable({
			orderCellsTop: true,
        	fixedHeader: true,
		 	pagingType: "input",
		 	columns:colsz,
			data:tableData,
			dom: "<'row-fluid'<'span6'B><'span6'fr>><'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			buttons: [
	        ],
			language: {
				"decimal": ",",
           	 	"thousands": ".",
				lengthMenu: 
		          	srn_td.View+ ' <select>'+
		            '<option value="10">10</option>'+
		            '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		            '<option value="40">40</option>'+
		            '<option value="50">50</option>'+
		            '<option value="-1">All</option>'+
		            '</select> '+ srn_td.records + ' |  '
		        ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':srn_td.of,
					'Page':srn_td.Page,
				},
				"info": srn_td.Foundtotal+" _TOTAL_ "+srn_td.records
			},
			"footerCallback":function( tfoot, data, start, end, display ){
				var api = this.api();
				if(api.columns()[0].length == 7){
				    $(api.column(4).footer()).html(
				       srn_td.Totalbeforediscount+'<br/>'+ api.column(4,{ filter: 'applied' }).data().reduce(function(a,b){
				        	var c = parseFloat(convertIntoStandardFormat(a));
				        	var d = parseFloat(convertIntoStandardFormat(b));
				            return convertIntoLocalFormat(c + d);
				        },0)
				    );

				    $(api.column(5).footer()).html(
				       srn_td.Discount+'<br/>'+ api.column(5,{ filter: 'applied' }).data().reduce(function(a,b){
				        	var c = parseFloat(convertIntoStandardFormat(a));
				        	var d = parseFloat(convertIntoStandardFormat(b));
				            return convertIntoLocalFormat(c + d);
				        },0)
				    );	

				    $(api.column(6).footer()).html(
				       srn_td.$inv_exc_vat+'<br/>'+ api.column(6,{ filter: 'applied' }).data().reduce(function(a,b){
				        	var c = parseFloat(convertIntoStandardFormat(a));
				        	var d = parseFloat(convertIntoStandardFormat(b));
				            return convertIntoLocalFormat(c + d);
				        },0)
				    );  
			    }else{
			    	$(api.column(5).footer()).html(
				       srn_td.Totalbeforediscount+'<br/>'+ api.column(5,{ filter: 'applied' }).data().reduce(function(a,b){
				        	var c = parseFloat(convertIntoStandardFormat(a));
				        	var d = parseFloat(convertIntoStandardFormat(b));
				            return convertIntoLocalFormat(c + d);
				        },0)
				    );

				    $(api.column(6).footer()).html(
				       srn_td.Discount+'<br/>'+ api.column(6,{ filter: 'applied' }).data().reduce(function(a,b){
				        	var c = parseFloat(convertIntoStandardFormat(a));
				        	var d = parseFloat(convertIntoStandardFormat(b));
				            return convertIntoLocalFormat(c + d);
				        },0)
				    );	

				    $(api.column(7).footer()).html(
				       srn_td.$inv_exc_vat+'<br/>'+ api.column(7,{ filter: 'applied' }).data().reduce(function(a,b){
				        	var c = parseFloat(convertIntoStandardFormat(a));
				        	var d = parseFloat(convertIntoStandardFormat(b));
				            return convertIntoLocalFormat(c + d);
				        },0)
				    ); 
			    }

			}
		});
		
		table.on( 'draw.dt', function () {
		    ds.doubleScroll('refresh');
		});

		var html = `<div class="btn-group" style="display:inline-block;float:right"><a class="btn" href="#" data-toggle="dropdown">
									`+srn_td.Columns+`
									<i class="icon-angle-down"></i>
									</a>`;
		html += `<div id="sample_2_column_toggler" class="dropdown-menu hold-on-click dropdown-checkboxes pull-right">`;
		html += filters;
		html += `</div></div>`;

		html += `<button class="btn blue" onclick="sales_reports_new.generateReport('pdf');">`+srn_td.PDF+`</button>`;
		html += `&nbsp;<button class="btn blue" onclick="sales_reports_new.generateReport('excel');">`+srn_td.Excel+`</button>`;

		html += `&nbsp;<button class="btn blue" onclick="sales_reports_new.send();">`+srn_td.Emailreport+`</btn>`;

		setTimeout(function(){
			$('.dt-button').addClass('btn blue');

			$('.dt-buttons').append(html);
			$('.fil_list_uni').change(function(){
				var v = $(this).val();
				if($(this).is(':checked')){
					table.columns( [v] ).visible( true );
				}
				else{
					table.columns( [v] ).visible( false );
				}
				ds.doubleScroll('refresh');
			});

			$('.uni').uniform();
			ds = $('#srn_tb_wrapper div.row-fluid:nth-child(2)').doubleScroll();
			if (!$('body').hasClass("page-sidebar-closed")) {
				//$('.menu-toggler').click()
			}
		});
	},

	generateReport:function(type='',d){
		var data = table.buttons.exportData({ 
            columns: ':visible'
        });

		if(checkNull(d) == ''){
			d = {delivery:'download'};
		}

		var dt = Object.assign(data,d);
		sales_reports_new.getReport(dt,type);
	},
	send:function(){
		$('#saveandcpop').modal('show');
	},
	send_report:function(){
		var type = $('#report_type').val();

		var distribution = $('#distribution').val();
		var to_staffers = $('#to_staffers').val();
		var custom_email = $('#custom_email').val();
		var delivery = 'email';
		

		var d = {
			distribution:distribution,
			to_staffers:to_staffers,
			custom_email:custom_email,
			delivery:delivery,
			all_staffers:srn_dt.getAllContactsEmail,

		};

		sales_reports_new.generateReport(type,d);
	},
	getReport:function(data,type){
		var p = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			type:type,

			file_name: srn_td.Saleslistreport,
		};

		var total_params = Object.assign(p,data);
		
		var heade = [];

		$('#srn_tb tr:eq(0) th').each(function(){
			var v = $(this).text();
			if(checkNull(v) != ''){
				heade.push(v);
			}
		});		

		total_params['header'] = heade;
		
		total_params['body'] = JSON.stringify(total_params.body);


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Reports/create_report.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){	

				if(total_params.delivery == 'email'){
					call_toastr('success',srn_td.Success,srn_td.Emailsentsuccessfully);
				}
				else if(total_params.delivery == 'download'){
					var reportres = complet_data.response.response.res;
					if(type	 == 'excel'){
						var dir = checkNull(reportres.excel_dir);
					}
					else if(type == 'pdf'){
						var dir = checkNull(reportres.pdf_dir	);
					}					
					
					if(checkNull(dir) != ''){
						var path = APISERVER+'/api/downloads/report/'+btoa(dir)+'.json';
						openPdf(path); 
					}
					call_toastr('success',srn_td.Success,srn_td.Reportgeneratedsuccessfully);
				}
				$('#saveandcpop').modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',srn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',srn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	filterRecords:function(){
		var user_type = $('#user_type').val();
		var prod_category_id = $('#prod_category_id').val();

		if(prod_category_id == 'all' ){
			prod_category_id = '';
		}
		var from_date = moment($('#from_date').datepicker('getDate')).format('YYYY-MM-DD');
		var to_date = moment($('#to_date').datepicker('getDate')).format('YYYY-MM-DD');

		var generate_report_as_whole = ($('#generate_report_as_whole').bootstrapSwitch('status'))?1:0;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			getTranslationsData:'no',

			user_type:user_type,
			prod_category_id:prod_category_id,
			from_date:from_date,
			to_date:to_date,
			generate_report_as_whole:generate_report_as_whole
		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Reports/getSalesReports.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				sales_reports_new.generateTable(complet_data.response.response.body,complet_data.response.response.headerss,complet_data.response.response.footer);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',srn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',srn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
	},
}
