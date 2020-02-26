var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
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

var table;
var ms_dt;
var ms_td;

var ms_meta = {};
var marina_slips = {
	start:function(meta={}){
		ms_meta = meta;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','  Dock','$sliph','Status','Meter','Meter value','Customer','Boat type','$regh','On land','Marina','Slips','Actions','records','of','Found total','View','Page','Available','Assigned','Yes','No','Assign to customer','Switch slip','meter_reading','Remove from customer','Select','filtered from','$remove_from_cust','Warning','Delete','Cancel','$meterh'],

		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Partners/getAllPartnerDocksNew.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ms_dt = complet_data.response.response;
				ms_td = complet_data.response.response.translationsData;
				if(checkNull(ms_meta.from) == 'search' && ms_dt.invoices.invoiceList.length == 1){
					marina_slips.goToInvoice(ms_dt.invoices.invoiceList[0].Invoice.id);
					return;
				}
				marina_slips.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ms_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ms_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createHtml:function(){
		ms_dt.type = type;
		ms_td.dashboardurl = base_url+'dashboard/index';
		ms_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('marina_slips_template').innerHTML;
		var compiledRendered = Template7(template, ms_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		marina_slips.bindEvents();
	},
	bindEvents:function(){
		marina_slips.generateRows(ms_dt.dock_slip);
	},
	processText(inputText){
		var output ;
	    var json = inputText.split(' ');
	    json.forEach(function (item) {
	        output = item.replace(/\'/g, '').split(/(\d+)/).filter(Boolean);
	    });
	    return output.join('<span style="display:none">-</span>');
	},
	generateRows:function(data){
	
		var trh = '';
		var dock_name = [];
		for(var j in data){
			var pd = data[j]['pd'];
			var cs = data[j]['cs'];
			var ps = data[j]['ps'];

			var pm = data[j]['pm'];
			var cm = data[j]['cm'];

			var cust = data[j]['cust'];

			if(dock_name.indexOf(pd.dock_name) === -1){
				dock_name.push(pd.dock_name);
			}
			
			trh += '<tr id="slip_name_'+ps.id+'">';
				trh += '<td>'+checkNull(pd.dock_name)+'</td>';
				trh += '<td>'+checkNull(ps.slip_name)+'</td>';
				
				if("id" in cust && checkNull(cust.id) != ''){
					trh += '<td>'+checkNull(ms_td.Assigned)+'</td>';
				}
				else{
					trh += '<td>'+checkNull(ms_td.Available)+'</td>';
				}
				
				trh += '<td  id="id_meter_'+ps.id+'_'+pm.id+'">'+checkNull(pm.meter_name)+'</td>';
				trh += '<td class="meter_value">'+checkNull(pm.meter_value)+'</td>';
				
				trh += '<td class="customer_name">'+checkNull(cust.customer_name)+'<span style="display:none">'+cust.customer_number+'</span></td>';
				
				trh += '<td class="report_type">'+checkNull(cs.boat_type,'-')+'</td>';
				trh += '<td class="registration_number">'+checkNull(cs.registration_number,'-')+'</td>';
				
				
				
				if(cs.boat_status == 'up'){
					trh += '<td>'+checkNull(cs.Yes)+'</td>';
				}
				else{
					trh += '<td>'+checkNull(ms_td.No)+'</td>';
				}

				
				var actions = '';

				var style = '';
				if(checkNull(cs.id) == ''){
					style = 'display:none;';
				}

				actions += `<a style="margin-right:5px;`+style+`" class='btn mini blue-stripe mini hidden-phone-margin  move_slip_to_another_customer' onclick='show_modal(this,"popups1");' data-width="900" data-url="/`+type+`/customers/move_slip_to_another_customer/`+checkNull(ps.id)+`/`+checkNull(cust.id)+`/main_menu"><i class='icon-move'></i>&nbsp;`+ms_td.Switchslip+`</a>`;
				
				style = '';
				if(checkNull(cust.id) == ''|| checkNull(pm.id) == ''){
					style = 'display:none;';
				}
				
				actions += `<a style="margin-right:5px;`+style+`" class="btn mini blue-stripe mini hidden-phone-margin  edit_customer_meter" onclick="new_custom_popup2('600','popups','meter_reading',{customer_slipmeter_id:`+checkNull(cs.id)+`,customer_id:`+checkNull(cust.id)+`,request_from:'marina_slips'});" data-width=
					"900"><i class='icon-book'></i>&nbsp;`+ms_td.meter_reading+`</a>`;
				
				style = '';
				if(checkNull(cust.id) == ''){
					style = 'display:none;';
				}

				actions += `<a style="margin-right:5px;`+style+`" class="btn mini red-stripe mini hidden-phone-margin  remove_from_customer" data-width="move_slip_to_customer" onclick="deleteSlip(`+ps.id+`,`+cust.id+`);"><i class="icon-remove"></i>&nbsp;`+ms_td.Removefromcustomer+`</a>`;

				var style = '';
				if(checkNull(cs.id) != ''){
					style = 'display:none;';
				}
				actions += `<a style="margin-right:5px;`+style+`" class="btn mini green-stripe mini hidden-phone-margin  assign_to_customer" onclick="show_modal(this,'popups');" data-width="900" data-url="/`+type+`/settings/assign_to_customer/`+checkNull(ps.id)+`/main_menu"><i class="icon-plus"></i>&nbsp; `+ms_td.Assigntocustomer+`</a>`;
				trh += '<td>' + actions + '</tr>';
				
			trh += '</tr>';		
		}
		$('#marina_slip_list tbody').html(trh);

		
		
		table = $('#marina_slip_list').DataTable({
	 		pagingType: "input",
			dom: "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			drawCallback: function( settings ) {
		        
		    },
			order: [],
		 	columnDefs: [
		 	 	{ type: 'natural', targets: 1 },	       
		    ],
 		 	language: {
				lengthMenu: 
		           ms_td.View+ ' <select>'+
		             '<option value="10">10</option>'+
		             '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		             '<option value="40">40</option>'+
		             '<option value="50">50</option>'+
		             '<option value="-1">All</option>'+
		             '</select> '+ ms_td.records + ' |  '
		         ,
				paginate: {
					previous: '<i class="icon-angle-left"></i>',
					next: '<i class="icon-angle-right"></i>',
					of:ms_td.of,
					Page:ms_td.Page,
				},
				infoFiltered:   "("+ms_td.filteredfrom+" _MAX_ "+ms_td.records+")",
				info: ms_td.Foundtotal+" _TOTAL_ "+ms_td.records
			},
		});

		$('#marina_slip_list thead tr').clone(true).appendTo( '#marina_slip_list thead' );
	    $('#marina_slip_list thead tr:eq(1) th').each( function (i) {
	        var title = $(this).text();
	        title = title.toString().trim();

	        var data_type = $(this).attr('data-type');
	        if(checkNull(data_type) != ''){
	        	var w = $(this).width();
	        	if(data_type == 'dock'){
	        		var html = '<select style="width: '+w+'px"><option value=""></option>';
	        			for(var j in dock_name){
	        				html += '<option value="'+dock_name[j]+'">'+dock_name[j]+'</option>';
	        			}
	        		html += '</select>';

	        		$(this).html( html );
	        		$( 'select', this ).select2({
	        			placeholder:ms_td.Select,
						allowClear:true,
						dropdownAutoWidth:true,
						width: 'auto'
	        		}).on( 'keyup change', function () {
	        			if(checkNull(this.value) == ''){
	        				table
			                .column(i)
		                    .search(this.value)
		                    .draw();
	        			}
			            else if( table.column(i).search() !== this.value ) {
			                table
			                .column(i)
		                    .search("^" + this.value + "$", true, false, true)
		                    .draw();
			            }
			            return false;
			        });
	        	}
	        	else if(data_type == 'onland'){
	        		var html = '<select style="width: '+w+'px"><option value=""></option>';
	        		html += '<option value="'+ms_td.Yes+'">'+ms_td.Onland+'</option>';	        			
	        		html += '</select>';

	        		$(this).html( html );
	        		$( 'select', this ).select2({
	        			placeholder:ms_td.Select,
						allowClear:true,
						dropdownAutoWidth:true,
						width: 'auto'
	        		}).on( 'keyup change', function () {
	        			if(checkNull(this.value) == ''){
	        				table
			                .column(i)
		                    .search(this.value)
		                    .draw();
	        			}
			            else if( table.column(i).search() !== this.value ) {
			                table
			                .column(i)
		                    .search("^" + this.value + "$", true, false, true)
		                    .draw();
			            }
			            return false;
			        });
	        	}
	        	else if(data_type == 'status'){
	        		var html = '<select style="width: '+w+'px"><option value=""></option>';
	        		html += '<option value="'+ms_td.Assigned+'">'+ms_td.Assigned+'</option>';	
	        		html += '<option value="'+ms_td.Available+'">'+ms_td.Available+'</option>';        			
	        		html += '</select>';

	        		$(this).html( html );
	        		$( 'select', this ).select2({
	        			placeholder:ms_td.Select,
						allowClear:true,
						dropdownAutoWidth:true,
						width: 'auto'
	        		}).on( 'keyup change', function () {
	        			if(checkNull(this.value) == ''){
	        				table
			                .column(i)
		                    .search(this.value)
		                    .draw();
	        			}
			            else if( table.column(i).search() !== this.value ) {
			                table
			                .column(i)
		                    .search("^" + this.value + "$", true, false, true)
		                    .draw();
			            }
			            return false;
			        });
	        	}	
	        	else if(data_type == 'text'){
	        		
	        		$(this).html( '<input style="width: '+w+'px" type="text" placeholder="Search '+title+'" />' );
	 		
			        $( 'input', this ).on( 'keyup change', function () {
			            if ( table.column(i).search() !== this.value ) {
			                table
			                    .column(i)
			                    .search( this.value )
			                    .draw();
			            }
			            return false;
			        });
	        	}	       
	   	 	}
	   	 	else{
	   	 		$(this).html('');
	   	 	}
	    });
	    $('#marina_slip_list thead tr:eq(1) th').off();
		console.log('tr',data);
	},
	sort:function(frm){
		var inv_srch_dt = localStorage.getItem('invoice_search_data');
		inv_srch_dt = JSON.parse(inv_srch_dt);

		inv_srch_dt.sort[0] = frm ;
		if(inv_srch_dt.sort[1] == 'ASC'){
			inv_srch_dt.sort[1] = 'DESC';
		}
		else{
			inv_srch_dt.sort[1] = 'ASC';
		}
		localStorage.setItem('invoice_search_data',JSON.stringify(inv_srch_dt));
		inv_current_page = 1;
		marina_slips.getAndGenerateInvoices('',per_page);
	},
	deleteSlip(slip_id, customer_id){
		var confiem_msg;
		confiem_msg = ms_td.$remove_from_cust;	
		title = ms_td.Warning;
		$("#bkengine_alert_box" ).html(confiem_msg);
		$("#bkengine_alert_box" ).dialog({
		  dialogClass: 'ui-dialog-blue',
		  modal: true,
		  title:title,
		  resizable: false,
		  height: 200,
		  //width: 380,
		  modal: true,
		  buttons: [
			{
				'class' : 'btn red',
				'id' : 'acceptbtntext',	
				"text" : ms_td.Delete,
				click: function() {
					$(this).dialog( "close" );
					$('#hidden_img').show();
					var APISERVER = $('#APISERVER').val();
					var token = $('#token').val();
					var language = $('#language').val();
					var lang = $('#lang').val();
					var partner_id = $('#partner_id').val();
					
					var total_params = {
						token:token,
						language:language,
						lang:lang,
						partner_id:partner_id,
						slip_id:slip_id,
						customer_id:customer_id,
					};
					  
					$.ajax({
						type: 'POST',
						url: APISERVER+'/api/customers/removeSlipFromCustomer.json',
						data: total_params,
						async: true,
						dataType : "json",
						beforeSend: function(){
					   
						},
						success: function(complet_data,status,xhr){
						  if(complet_data.response.status == 'success'){
								var sms_success = is_undefined(complet_data.response.response.message.msg);
								call_toastr('success',ms_td.Success, sms_success);
								var assign_to_customer = base_url+'settings/assign_to_customer/'+slip_id+'/main_menu';
								$('#slip_name_'+slip_id+' .customer_name').html('-'); 
								$('#slip_name_'+slip_id+' .report_type').html('-'); 
								$('#slip_name_'+slip_id+' .registration_number').html('-'); 
								$('#slip_name_'+slip_id+' .edit_slip').hide(); 
								$('#slip_name_'+slip_id+' .edit_slip_to_customer').hide(); 
								$('#slip_name_'+slip_id+' .assign_to_customer').show(); 
								$('#slip_name_'+slip_id+' .remove_customer').hide(); 
								$('#slip_name_'+slip_id+' .assign_customer').hide();
								$('#slip_name_'+slip_id+' .edit_meter_from_customer').hide();
								$('#slip_name_'+slip_id+' .move_slip_to_another_customer').hide();
								$('#slip_name_'+slip_id+' .edit_customer_meter').hide();
								$('#slip_name_'+slip_id+' .move_to_customer').hide();  
								$('#slip_name_'+slip_id+' .remove_from_customer').hide(); 
								$('#slip_name_'+slip_id+' .assign_to_customer').attr('data-url',assign_to_customer); 
								$('#slip_name_'+slip_id+' .delete_customer_slip').show();
						  }
						  else if(complet_data.response.status == 'error'){
							showAlertMessage(complet_data.response.response.msg,'error',alert_msg);
							return;
							if(complet_data.response.response.error == 'validationErrors'){
							  var mt_arr = complet_data.response.response.list;
							  var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							  });
							  showAlertMessage(array,'error',alert_msg);
							  return;
							}else if(complet_data.response.response.smsFailed != ''){
							  showAlertMessage(complet_data.response.response.smsFailed,'error',alert_msg);
							  return;
							}else{
							  showAlertMessage(alertMsg,'error',alert_msg);
							  return;
							} 
						  }
						},
						error: function(xhr, status, error){
						  if(xhr.status && xhr.status == 400){
							  var obj = jQuery.parseJSON(xhr.responseText);
							  showAlertMessage(obj.message,'error');
							}
							else{
							  showAlertMessage("There was a problem accessing the server: " + xhr.statusText +"<br>"+"*Please refresh the page and try again",'error');
							}  
						},
					});
				}
			},
			{
				'class' : 'btn',
				'id' : 'cancelbtntext',
				"text" : ms_td.Cancel,
				click: function() {
					$(this).dialog( "close" );
				}
			}
		  ]
		});
	}
}

function deleteSlip(slip_id,customer_id){
	marina_slips.deleteSlip(slip_id,customer_id);
}
