var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();

var qnd_meta;
var qnd_dt;
var qnd_ppid = 'popups';
var qnd_td;
var table;
var quote_note = {
	start:function(popupid,metadata={}){
		qnd_ppid = popupid;
		qnd_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			quote_id:metadata.quote_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Cancellation reason','Note','Created by','Log date','Action','$sr_no','$qt_nt_del','Warning','Delete','Cancel','View','records','of','Page','Found total','records','Success','No record found','Add note'],		
		};
		if(qnd_meta.id!=null && qnd_meta.id!=undefined && qnd_meta!=''){
			total_params.id = qnd_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/getQuoteNotes.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				qnd_dt = complet_data.response.response;
				qnd_td = complet_data.response.response.translationsData;
				quote_note.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',qnd_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',qnd_td.Alertmessage);
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

		qd_dt.date_format_f = date_format_f;

		var template = document.getElementById('quote_note_template').innerHTML;
		var compiledRendered = Template7(template, qnd_dt);
		document.getElementById(qnd_ppid).innerHTML = compiledRendered;
		quote_note.bindEvents();
		$('#'+qnd_ppid).resize();
	},
	bindEvents:function(){	
		quote_note.generateRows(qnd_dt.getQuoteNote);
	},
	generateRows:function(data){
		var html = '';
		var i = 0;
		for(var j in data){
			var d = data[j].QuoteNote;

			html += '<tr data-id="'+d.id+'">';
				html += '<td>'+ ++i + '</td>';
				html += '<td>'+ convertDateIntoSiteFormat(checkNull(d.log_date)) +' - ' +moment(checkNull(d.log_date)).format('HH:mm')+ '</td>';
				html += '<td>'+ checkNull(d.description) + '</td>';
				html += '<td>'+ checkNull(d.cancellation_reason,'-') + '</td>';
				html += '<td>'+ checkNull(d.created_by,'-') + '</td>';
				
				html += '<td>';
					html += '<button class="btn mini edit blue-stripe" onclick="quote_note.edit('+d.id+')"  ><i class="icon-eye-open"></i>&nbsp;'+qnd_td.View+'</button>';
					html += '<button data-dismiss="modal" class="btn mini red-stripe" onclick="quote_note.deleten('+d.id+')"><i class="icon-remove"></i>&nbsp;'+qnd_td.Delete+'</button>';
				html += '</td>';
			html += '</tr>';
		}

			$('#quote_note_list').DataTable().destroy();
			$('#quote_note_list tbody').html(html);
			table = $('#quote_note_list').DataTable({
		 		"pagingType": "input",
		 		"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
		 		"language": {
					"lengthMenu": 
			           qnd_td.View+ ' <select>'+
						'<option value="10">10</option>'+
						'<option value="20">20</option>'+
						'<option value="30">30</option>'+
						'<option value="40">40</option>'+
						'<option value="50">50</option>'+
						'<option value="-1">All</option>'+
						'</select> '+ qnd_td.records + ' |  ',
					"paginate": {
						"previous": '<i class="icon-angle-left"></i>',
						"next": '<i class="icon-angle-right"></i>',
						'of':qnd_td.of,
						'Page':qnd_td.Page,
					},
					"info": qnd_td.Foundtotal+" _TOTAL_ "+qnd_td.records
				},
		 	});

		 	if($('.dataTables_empty').length != 0){
		 		$('#quote_note_list').hide();
		 		$('.empty_msg').show();
		 		$('.dataTables_info').hide();
		 	}
		 	else{
		 		$('#quote_note_list').show();
		 		$('.empty_msg').hide();
		 		$('.dataTables_info').show();
		 	}
		 	if(checkNull(i) != '' && checkNull(i) != 0){
				$('#show_quote_note_counter').html(i).show();
			}
			else{
				$('#show_quote_note_counter').hide();
			}

	},
	edit:function(note_id){
		new_custom_popup2('600','popups','quote_addnote',{quote_id:qnd_meta.quote_id,from:'edit',note_id:note_id});
	},
	deleten:function(id){
		var yes = function(){
			
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				quote_id:qnd_meta.quote_id,
				note_id:id,
			}

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Quotes/deleteQuoteNote.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}

			params['successCallbackFunction'] = function (complet_data){
		
				if(complet_data.response.status == 'success'){
					call_toastr('success',qnd_td.Success,complet_data.response.response.message.msg);
					table.$('tr').each(function(i){
			   			if($(this).attr('data-id') == id){
			   				table.row(this).remove().draw();
			   				return false;
			   			}
					});

					var j = 0;
					table.column(0).nodes().each(function(cell,i){
						j++
						 cell.innerHTML = i+1;
					}).draw();
					if(checkNull(j) != '' && checkNull(j) != 0){
						$('#show_quote_note_counter').html(j).show();
					}
					else{
						$('#show_quote_note_counter').hide();
					}
					if($('.dataTables_empty').length != 0){
				 		$('#quote_note_list').hide();
				 		$('.empty_msg').show();
				 	}
				 	else{
				 		$('#quote_note_list').show();
				 		$('.empty_msg').hide();
				 	}
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',qnd_td.Alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',qnd_td.Alertmessage);
						return;
					}	
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;			
		}
		var no = function(){

		}

		showDeleteMessage(qnd_td.$qt_nt_del,qnd_td.Warning,yes,no,'ui-dialog-blue',qnd_td.Delete,qnd_td.Cancel);

	},
	showPopup:function(frm='add'){
		new_custom_popup2('600','popups','quote_addnote',{quote_id:qnd_meta.quote_id,from:'add'});
	}

}