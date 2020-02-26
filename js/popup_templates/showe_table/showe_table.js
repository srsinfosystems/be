var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var HOST_URL = $('#HOST_URL').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
	var date_format_f = date_format_partner.toLowerCase();
}
else{
	var date_format_f = date_format.toLowerCase();
}

var set_popid = 'popups';
var set_td;
var set_dt = {};
var set_meta;
var start_datetime;
var end_datetime;
var notif_list = {};
var table;
var showe_table = {
	start: function(popups,meta = {}){
		set_meta = meta;
		set_popid = popups;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Report','Save','Cancel','View','records','of','Page','Found total','records','Excel','PDF'],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Reports/showReport.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				set_dt = complet_data.response.response;
				set_td = complet_data.response.response.translationsData;

				
				var scripts = [
					HOST_URL+'app/webroot/js/datatables.min.js',
				];

			

				var queue = scripts.map(function(script) {
				    return $.getScript(script);
				});

				$.when.apply(null, queue).done(function() {
				    // Wait until done, then finish function
				    showe_table.createHtml(set_dt);
				});
				
				// showe_table.createHtml(set_dt);
				
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
	createHtml:function(){
		var template = document.getElementById('showe_table_template').innerHTML;
		var compiledRendered = Template7(template, set_dt);
		document.getElementById(set_popid).innerHTML = compiledRendered;
		resizemodal(set_popid);
		showe_table.bindEvents();
	},
	loadScript(script_url, $element){
	    // Unrelated stuff here!!!

	    return $.getScript(script_url).done(function(){
	        //  Unrelated stuff here
	        // do something with $element after the script loaded.
	    });
	},
	bindEvents:function(){
		showe_table.generateTable(set_meta.excel_info.sheetData);
	},
	generateTable:function(data){
		var k = 0;
		var tableData = [];
		var cols = [];
		for(var j in data){
			k++;

			if(k == 1){
				var html = `<table id="showe_tb" class="table table-striped table-bordered table-hover" style="width:100%"><thead><tr>`;
					for(var l in data[j]){
						html += '<th>'+data[j][l]+'</th>';
						cols.push({name:data[j][l]});
					}
				html += `</tr></thead></table>`;
				
				$('.add_table').html(html);
			}
			else{
				var arr = [];
				for(var l in data[j]){
					arr.push(checkNull(data[j][l]));
				}
				tableData.push(arr);
			}
		}
		console.log(cols);
		$('#showe_tb thead tr').clone(true).appendTo( '#showe_tb thead' );
	    $('#showe_tb thead tr:eq(1) th').each( function (i) {
	        var title = $(this).text();
	        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
	 
	        $( 'input', this ).on( 'keyup change', function () {
	            if ( table.column(i).search() !== this.value ) {
	                table
	                    .column(i)
	                    .search( this.value )
	                    .draw();
	            }
	        } );
	    } );

		table = $('#showe_tb').DataTable({
			orderCellsTop: true,
        	fixedHeader: true,
		 	"pagingType": "input",
		 	responsive: {
	            details: {
	                display: $.fn.dataTable.Responsive.display.childRowImmediate,
	                type: ''
	            }
	        },
			"data":tableData,
			"dom": "<'row-fluid'<'span6'B><'span6'fr>><'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			columns:cols,
			buttons: [
	     
	            {
	            	extend: 'excel',
					text: set_td.Excel,
					filename: set_meta.excel_info.filename
	            },

	            {
	            	extend: 'pdf',
					text: set_td.PDF,
					filename: set_meta.excel_info.filename
	            }
	        ],
			"language": {
			"lengthMenu": 
		           set_td.View+ ' <select>'+
		             '<option value="10">10</option>'+
		             '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		             '<option value="40">40</option>'+
		             '<option value="50">50</option>'+
		             '<option value="-1">All</option>'+
		             '</select> '+ set_td.records + ' |  '
		         ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':set_td.of,
					'Page':set_td.Page,
				},
				
				"info": set_td.Foundtotal+" _TOTAL_ "+set_td.records
			},
		});

		setTimeout(function(){
			$('.dt-button').addClass('btn blue');
		});
	},
};