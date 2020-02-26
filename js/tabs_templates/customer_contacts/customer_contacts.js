var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();
var type = $('#type').val();
var cc_tab_id;
var cc_data;
var cc_td;
var cc_meta;
var customer_contacts = {
	start:function(tab_id,meta){
		cc_tab_id = tab_id;
		cc_meta = meta;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:cc_meta.customer_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['alert message','Success','$email','$srno','Last name','First name','Cellphone','Status','Default contact','Action','Active','Inactive','Yes','No','Edit','Delete','Send SMS','$sure_del_cntt','Warning','records','of','Found total','View','Add contact'],


		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerContacts.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				cc_data = complet_data.response.response;
				cc_td = complet_data.response.response.translationsData;
				customer_contacts.createHtml(complet_data.response.response);
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
		cc_data.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		cc_data.base_url = base_url;
		cc_data.customer_status = cc_meta.customer_status;
		cc_data.customer_id = cc_meta.customer_id;
		var template = document.getElementById('customer_contacts_template').innerHTML;
		var compiledRendered = Template7(template, cc_data);
		document.getElementById(cc_tab_id).innerHTML = compiledRendered;
		customer_contacts.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		if(checkNull(cc_data.contactList)!=''){
			customer_contacts.generateContactList(JSON.stringify(cc_data.contactList));
		}
		else{
			customer_contacts.generateContactList(JSON.stringify([]));
		}
	},
	generateContactList:function(data){
		
		data = JSON.parse(data);
		var i = 0;
		var html = '';
		for(var j in data){
			var d = data[j];
			html += '<tr>';
				html += '<td>';
					html += ++i;
				html += '</td>';

				html += '<td>';
					html += checkNull(d.User.last_name);
				html += '</td>';

				html += '<td>';
					html += checkNull(d.User.first_name);
				html += '</td>';

				html += '<td>';
					html += checkNull(d.User.email);
				html += '</td>';

				html += '<td>';
					html += checkNull(d.Login.format_cellphone);
				html += '</td>';

				html += '<td>';
					if(checkNull(d.Login.status)==false){
					 	html += cc_td.Inactive;
					}
					else{
					 	html += cc_td.Active;
					}
				html += '</td>';

				html += '<td>';
					if(d.Customer.default_contact == d.CustomerContact.id){
						html += '<i class="icon-link"></i>&nbsp;&nbsp;'+cc_td.Yes;
					}
					else{
						html += '&nbsp;&nbsp;'+cc_td.No;
					}
				html += '</td>';

				if(d.Customer.status){
					var status = 1;
				}
				else{
					var status = 0;
				}
			
				html += '<td>';
					if(type != 'customer'){
						var edit_url = base_url + 'customers/edit_contact/'+d.Customer.id+'/'+d.CustomerContact.id+'?status='+status;
						html += '<button class="btn mini edit blue-stripe" onclick="event.stopPropagation(); show_modal(this,\'popups\');" data-width="750px" data-url="'+edit_url+'" >';
							html += '<i class="icon-edit"></i>&nbsp;'+cc_td.Edit;
						html += '</button>';

						var contact_country = d.User.country;

						if(checkNull(d.Login.cellphone_country_code)!=''){
							contact_country = d.Login.cellphone_country_code;
						}
					  
					  	var contact_name = d.User.first_name +' ' +d.User.last_name;

					  	if(checkNull(d.Login.sms_cellphone)!=''){
							html += '<a class="btn mini yellow-stripe" onclick="event.stopPropagation(); show_dkmodal_for_customer_sms(\''+d.Customer.id+'\',\''+d.Customer.customer_name+'\',\''+d.Login.cust_number+'\',\''+contact_country+'\',\''+d.Login.cp_code+'\',\''+d.Login.sms_cellphone+'\',\''+d.Customer.customer_number+'\',\''+d.CustomerContact.id+'\',\''+contact_name+'\',\''+checkNull(d.Login.cellphone)+'\')">';
								html += '<i class="icon-comment"></i>&nbsp;&nbsp;' + cc_td.SendSMS;
							html += '</a>';
						}

						var delete_url = base_url + 'customers/delete_contact/'+d.Customer.id+'/'+d.CustomerContact.id+'?customer_status'+status;
						html += '<button  class="btn mini red-stripe" data-width="750px" data-url="'+delete_url+'" onclick="event.stopPropagation(); deleteRecord(\''+delete_url+'\',\'\');">';
							html += '<i class="icon-remove"></i>&nbsp;'+cc_td.Delete;
						html += '</button>';
					}
				html += '</td>';
			html += '</tr>';
		}
		$('#customer_contact_list').dataTable().fnDestroy();
		$('#customer_contact_list tbody').html(html);
		
		var len = checkNull(cc_data.customer_contact_list_limit);
		if(len=='' || len==0){
			len = 10;
		}
		len = parseInt(len);
		
		$('#customer_contact_list').dataTable({ 
			"iDisplayLength": len,
			"aoColumns": [
				{ "bSortable": false },
				{ "bSortable": true },
				{ "bSortable": true },
				{ "bSortable": true },
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
		           cc_td.View+ ' <select>'+
		             '<option value="10">10</option>'+
		             '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		             '<option value="40">40</option>'+
		             '<option value="50">50</option>'+
		             '<option value="-1">All</option>'+
		             '</select> '+ cc_td.records
		         ,
				"oPaginate": {
					"sPrevious": '<i class="icon-angle-left"></i>',
					"sNext": '<i class="icon-angle-right"></i>',
					'of':cc_td.of,
				},
				
				"sInfo": cc_td.Foundtotal+" _TOTAL_ "+cc_td.records
			}
		});

		if(data.length<11){
			$('#customer_contact_list_length.dataTables_length').hide()
		}
	}

}


