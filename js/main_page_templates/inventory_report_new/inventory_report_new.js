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
var irn_dt;
var irn_td;
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
var inventory_report_new = {
	start:function(meta={}){

		irn_meta = meta;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			getTranslationsData:'yes',
			warehouse_id:0,
			location_id:0,
			no_stock_products:'n',
			getTranslationsDataArray:['Dashboard','alert message','Success','Reports','Inventory list report','Excel','PDF','View','records','of','Page','Found total','Columns','Customer list report','Email report','Type','Save','Cancel','Send','Excel','To myself','To other staffer','Custom email address','Distribution','Select staff','All','Select','Email','Email sent successfully','Success','Report generated successfully','Inventory groups','Price groups','Warehouse','Include product not in stock','All','Email report','Location']

		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Reports/getInventoryListReports.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				irn_dt = complet_data.response.response;
				irn_td = complet_data.response.response.translationsData;
				x.a++;
				//inventory_report_new.createHtml(irn_dt);
					
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',irn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',irn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		x.registerListener(function(val) {
		  if(x.a == 2){
		  	x.a = 0;
		  	App.scrollTop();
		  	inventory_report_new.createHtml(irn_dt);
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
		irn_dt.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		irn_dt.base_url = base_url;
		irn_dt.customer_id = irn_meta.customer_id;
		var template = document.getElementById('inventory_report_new_template').innerHTML;
		var compiledRendered = Template7(template, irn_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		inventory_report_new.bindEvents();
		
		after_main_page();
		
	},
	bindEvents:function(){
		$('#warehouse_id').change(function(){
			var v = $('#warehouse_id').val();
			if(checkNull(v) == '' || checkNull(v) == 0){
				$('#location_id').html('').trigger('change');
				$('.location_wrap').hide();
				inventory_report_new.filterRecords();
			}
			else{
				inventory_report_new.getLocation(v);
			}
		}).select2();

		$('#location_id').change(function(){
			inventory_report_new.filterRecords();
		}).select2();

		$('#no_stock_products').change(function(){
			inventory_report_new.filterRecords();
		}).uniform();

		var opts = '';
   		for(var j in irn_dt.getAllContactsEmail){
   			opts += '<option value="'+irn_dt.getAllContactsEmail[j]+'">'+irn_dt.getAllContactsEmail[j]+'</option>';
   		}
   		$('#to_staffers').append(opts).select2({
   			placeholder: irn_dt.Select,
			allowClear: true,
   		});

   		$('#report_type').select2();

   		$('#distribution').select2({
   			placeholder: irn_dt.Select,
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

		document.title = irn_td.Inventorylistreport;
		inventory_report_new.generateTable(irn_dt.body,irn_dt.headerss,irn_dt.footer);
		hideProcessingImage();
	},
	generateTable:function(tabled,headerss,footer){
		if(headerss.length == 0){
			return;
		}
		var k = 0;
		var tableData = [];
		var cols = [];
			$('.irn_tab_wrap').html('');

	
			var html = `<table id="irn_tb" style="font-size:12px" class="table table-striped table-bordered table-hover" style="width:100%"><thead>`;
				var ths = '';
				var filters = '';
				var visible_col = [];
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


			$('.irn_tab_wrap').html(html);
			
		tableData =tabled;

		$('#irn_tb thead tr').clone(true).appendTo( '#irn_tb thead' );
	    $('#irn_tb thead tr:eq(1) th').each( function (i) {
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

		table = $('#irn_tb').DataTable({
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
		          	irn_td.View+ ' <select>'+
		            '<option value="10">10</option>'+
		            '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		            '<option value="40">40</option>'+
		            '<option value="50">50</option>'+
		            '<option value="-1">All</option>'+
		            '</select> '+ irn_td.records + ' |  '
		        ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':irn_td.of,
					'Page':irn_td.Page,
				},
				"info": irn_td.Foundtotal+" _TOTAL_ "+irn_td.records
			},
			"footerCallback":function( tfoot, data, start, end, display ){
				var api = this.api();
			    $(api.column(7).footer()).html(
			        api.column(7,{ filter: 'applied' }).data().reduce(function(a,b){
			        	var c = parseFloat(convertIntoStandardFormat(a));
			        	var d = parseFloat(convertIntoStandardFormat(b));
			            return convertIntoLocalFormat(c + d);
			        },0)
			    );			  	
			}
		});
		
		table.on( 'draw.dt', function () {
		    ds.doubleScroll('refresh');
		});

		var html = `<div class="btn-group" style="display:inline-block;float:right"><a class="btn" href="#" data-toggle="dropdown">
									`+irn_td.Columns+`
									<i class="icon-angle-down"></i>
									</a>`;
		html += `<div id="sample_2_column_toggler" class="dropdown-menu hold-on-click dropdown-checkboxes pull-right">`;
		html += filters;
		html += `</div></div>`;

		html += `<button class="btn blue" onclick="inventory_report_new.generateReport('pdf');">`+irn_td.PDF+`</button>`;
		html += `&nbsp;<button class="btn blue" onclick="inventory_report_new.generateReport('excel');">`+irn_td.Excel+`</button>`;

		html += `&nbsp;<button class="btn blue" onclick="inventory_report_new.send();">`+irn_td.Emailreport+`</btn>`;

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
			ds = $('#irn_tb_wrapper div.row-fluid:nth-child(2)').doubleScroll();
			if (!$('body').hasClass("page-sidebar-closed")) {
				//$('.menu-toggler').click()
			}
		});
	},
	getLocation:function(v=''){
		if(checkNull(v) == ''){
			v = $('#warehouse_id').val();
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			getTranslationsData:'yes',
			warehouse_id:v

		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/products/getLocationListForReport.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var opts = complet_data.response.response.locationList;
				
				if(opts.length != 0){
					$('#location_id').html('');
					for(var j in opts){
						var d = opts[j];
						var newOption = new Option(d.location_name, j, false, false);
						$('#location_id').append(newOption);
					}
					$('#location_id').trigger('change');
					$('.location_wrap').show();
				}
				else{
					$('.location_wrap').hide();
					$('#location_id').html('').trigger('change');
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',irn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',irn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		
	},
	generateReport:function(type='',d){
		var data = table.buttons.exportData({ 
            columns: ':visible'
        });

		if(checkNull(d) == ''){
			d = {delivery:'download'};
		}

		var dt = Object.assign(data,d);
		inventory_report_new.getReport(dt,type);
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
			all_staffers:irn_dt.getAllContactsEmail,

		};

		inventory_report_new.generateReport(type,d);
	},
	getReport:function(data,type){
		var p = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			type:type,

			file_name: irn_td.Inventorylistreport,
		};

		var total_params = Object.assign(p,data);
		
		var heade = [];

		$('#irn_tb tr:eq(0) th').each(function(){
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
					call_toastr('success',irn_td.Success,irn_td.Emailsentsuccessfully);
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
					call_toastr('success',irn_td.Success,irn_td.Reportgeneratedsuccessfully);
				}
				$('#saveandcpop').modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',irn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',irn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	filterRecords:function(){
		var warehouse_id = $('#warehouse_id').val();
		var location_id = $('#location_id').val();
		if(checkNull(location_id) == ''){
			location_id = 0;
		}
		var no_stock_products = ($('#no_stock_products').is(':checked'))?'y':'n';

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,		
			getTranslationsData:'no',
			warehouse_id:warehouse_id,
			location_id:location_id,
			no_stock_products:no_stock_products,

		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Reports/getInventoryListReports.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				inventory_report_new.generateTable(complet_data.response.response.body,complet_data.response.response.headerss);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',irn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',irn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
	},
}
