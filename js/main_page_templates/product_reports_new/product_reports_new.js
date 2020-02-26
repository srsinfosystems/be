var APISERVER = $('#APISERVER').val(); var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var type =  $('#type').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var partner_dir = $('#partner_dir').val();

var table ;
var prn_dt;
var prn_td;
var ds;

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
var product_reports_new = {
	start:function(meta={}){

		prn_meta = meta;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			getTranslationsData:'yes',
			product_groups:0,
			price_groups:0,
			inactive_products:'n',
			getTranslationsDataArray:['Dashboard','alert message','Success','Reports','Product list report','Excel','PDF','View','records','of','Page','Found total','Columns','Customer list report','Email report','Type','Save','Cancel','Send','Excel','To myself','To other staffer','Custom email address','Distribution','Select staff','All','Select','Email','Email sent successfully','Success','Report generated successfully','Product groups','Price groups','Include inactive products','All','Email report']

		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Reports/getProductListReports.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				prn_dt = complet_data.response.response;
				prn_td = complet_data.response.response.translationsData;
				x.a++;
				//product_reports_new.createHtml(prn_dt);
					
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',prn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',prn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		x.registerListener(function(val) {
		  if(x.a == 2){
		  	x.a = 0;
		  	App.scrollTop();
		  	product_reports_new.createHtml(prn_dt);
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
		prn_dt.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		prn_dt.base_url = base_url;
		prn_dt.customer_id = prn_meta.customer_id;
		var template = document.getElementById('product_reports_new_template').innerHTML;
		var compiledRendered = Template7(template, prn_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		product_reports_new.bindEvents();
		
		after_main_page();
		
	},
	bindEvents:function(){
		$('#product_groups').change(function(){
			product_reports_new.filterRecords();
		}).select2();

		$('#price_groups').change(function(){
			product_reports_new.filterRecords();
		}).select2();

		$('#inactive_products').change(function(){
			product_reports_new.filterRecords();
		}).uniform();

		var opts = '';
   		for(var j in prn_dt.getAllContactsEmail){
   			opts += '<option value="'+prn_dt.getAllContactsEmail[j]+'">'+prn_dt.getAllContactsEmail[j]+'</option>';
   		}
   		$('#to_staffers').append(opts).select2({
   			placeholder: prn_dt.Select,
			allowClear: true,
   		});

   		$('#report_type').select2();

   		$('#distribution').select2({
   			placeholder: prn_dt.Select,
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

		document.title = prn_td.Productlistreport;
		product_reports_new.generateTable(prn_dt.body,prn_dt.headerss);
		hideProcessingImage();
	},
	generateTable:function(tabled,headerss){
		var k = 0;
		var tableData = [];
		var cols = [];
			$('.prn_tab_wrap').html('');

	
			var html = `<table id="prn_tb" style="font-size:12px" class="table table-striped table-bordered table-hover" style="width:100%"><thead>`;
				var ths = '';
				var filters = '';
				var visible_col = [0,1,2,3,4];
				//0,1,7,8,9,15,16,17
				for(var l in headerss){
					ths += '<th>'+headerss[l]+'</th>';
					
					
					if(visible_col.length != 0 && visible_col.indexOf(parseInt(l)) === -1){
						cols.push({name:headerss[l],"visible": false, "sortable": true});
						//filters += '<li class="fil_list"><input class="uni fil_list_uni"  type="checkbox" value="'+l+'"> '+headerss[l]+'</li>';
						filters += '<label><input class="uni fil_list_uni"  type="checkbox" value="'+l+'">'+headerss[l]+'</label>';
						
					}
					else{
						cols.push({name:headerss[l], "sortable": true});
						//filters += '<li class="fil_list"><input class="uni fil_list_uni" checked="checked" type="checkbox" value="'+l+'"> '+headerss[l]+'</li>';
						filters += '<label><input class="uni fil_list_uni" checked="checked" type="checkbox" value="'+l+'" checked="checked">'+headerss[l]+'</label>';
					}
					
				}
				
				
				html += '<tr>'+ths + '</tr>'; 
			html += `</thead><tbody></tbody></table>`;


			$('.prn_tab_wrap').html(html);
		
		tableData =tabled;

		$('#prn_tb thead tr').clone(true).appendTo( '#prn_tb thead' );
	    $('#prn_tb thead tr:eq(1) th').each( function (i) {
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

		table = $('#prn_tb').DataTable({
			orderCellsTop: true,
        	fixedHeader: true,
		 	pagingType: "input",
		 	columns:cols,
			data:tableData,
			dom: "<'row-fluid'<'span6'B><'span6'fr>><'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			buttons: [
	        ],
			language: {
				"decimal": ",",
           	 	"thousands": ".",
				lengthMenu: 
		          	prn_td.View+ ' <select>'+
		            '<option value="10">10</option>'+
		            '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		            '<option value="40">40</option>'+
		            '<option value="50">50</option>'+
		            '<option value="-1">All</option>'+
		            '</select> '+ prn_td.records + ' |  '
		        ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':prn_td.of,
					'Page':prn_td.Page,
				},
				"info": prn_td.Foundtotal+" _TOTAL_ "+prn_td.records
			}
		});
		
		table.on( 'draw.dt', function () {
		    ds.doubleScroll('refresh');
		});

		var html = `<div class="btn-group" style="display:inline-block;float:right"><a class="btn" href="#" data-toggle="dropdown">
									`+prn_td.Columns+`
									<i class="icon-angle-down"></i>
									</a>`;
		html += `<div id="sample_2_column_toggler" class="dropdown-menu hold-on-click dropdown-checkboxes pull-right">`;
		html += filters;
		html += `</div></div>`;

		html += `<button class="btn blue" onclick="product_reports_new.generateReport('pdf');">`+prn_td.PDF+`</button>`;
		html += `&nbsp;<button class="btn blue" onclick="product_reports_new.generateReport('excel');">`+prn_td.Excel+`</button>`;

		html += `&nbsp;<button class="btn blue" onclick="product_reports_new.send();">`+prn_td.Emailreport+`</btn>`;

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
			ds = $('#prn_tb_wrapper div.row-fluid:nth-child(2)').doubleScroll();
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
		product_reports_new.getReport(dt,type);
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
			all_staffers:prn_dt.getAllContactsEmail,

		};

		product_reports_new.generateReport(type,d);
	},
	getReport:function(data,type){
		var p = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			type:type,

			file_name: prn_td.Productlistreport,
		};

		var total_params = Object.assign(p,data);
		
		var heade = [];

		$('#prn_tb tr:eq(0) th').each(function(){
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
					call_toastr('success',prn_td.Success,prn_td.Emailsentsuccessfully);
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
					call_toastr('success',prn_td.Success,prn_td.Reportgeneratedsuccessfully);
				}
				$('#saveandcpop').modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',prn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',prn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	filterRecords:function(){
		var product_groups = $('#product_groups').val();
		var price_groups = $('#price_groups').val();

		var inactive_products = ($('#inactive_products').is(':checked'))?'y':'n';

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			getTranslationsData:'no',
			product_groups:product_groups,
			price_groups:price_groups,
			inactive_products:inactive_products,

		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Reports/getProductListReports.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				product_reports_new.generateTable(complet_data.response.response.body,complet_data.response.response.headerss);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',prn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',prn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
	},

	
}
