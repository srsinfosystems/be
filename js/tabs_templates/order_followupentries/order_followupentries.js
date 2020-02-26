var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();

var ofe_meta;
var ofe_dt;
var ofe_ppid = 'popups';
var ofe_td;
var table;
var order_followupentries = {
	start:function(popupid,metadata={}){
		ofe_ppid = popupid;
		ofe_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			order_id:metadata.order_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Cancellation reason','Note','Created by','Log date','Action','$sr_no','$qt_nt_del','Warning','Delete','Cancel','View','records','of','Page','Found total','records','Success','No record found','Add','Followup action','Status','$queued_for'],		
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Orders/getFollowupEntry.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ofe_dt = complet_data.response.response;
				ofe_td = complet_data.response.response.translationsData;
				order_followupentries.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ofe_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ofe_td.Alertmessage);
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

		ofe_dt.date_format_f = date_format_f;

		var template = document.getElementById('order_followupentries_template').innerHTML;
		var compiledRendered = Template7(template, ofe_dt);
		document.getElementById(ofe_ppid).innerHTML = compiledRendered;
		order_followupentries.bindEvents();
		$('#'+ofe_ppid).resize();
	},
	bindEvents:function(){	
		if(ofe_meta.status == 2 || ofe_meta.status == 5){
			$('.note').show();
			$('.note_followup').hide();
		}
		else{
			$('.note').hide();
			$('.note_followup').show();
		}
		order_followupentries.generateRows(ofe_dt.getFollowupEntries);
	},
	generateRows:function(data){
		var html = '';
		var i = 0;
		for(var j in data){
			var d = data[j].Followup;
			var fstatus = d.followup_status;
			var fStatus = fstatus;
			if(fstatus == 'deleted' || fstatus == 'completed' || fstatus == 'cancelled'){
				fStatus = 'completed';
			}
			var followup_date = d.followup_date;
			followup_date = moment(followup_date).format('YYYY-MM-DD');
			followup_date = moment(followup_date).unix();

			var today_date = moment(moment(new Date()).format('YYYY-MM-DD')).unix();
			var followup_status = '';
			if(followup_date > today_date && fStatus != 'completed'){
				followup_status = ofe_td.$queued_for;
				followup_status = followup_status.replace('%date%',convertDateIntoSiteFormat(checkNull(d.followup_date)));
			}
			else{
				followup_status = fStatus.charAt(0).toUpperCase() + fStatus.slice(1)
			}
			
			html += '<tr data-id="'+d.id+'">';
				html += '<td>'+ ++i + '</td>';
				html += '<td>'+ convertDateIntoSiteFormat(checkNull(d.log_date)) +' - ' +moment(checkNull(d.log_date)).format('HH:mm')+ '</td>';
				
				html += '<td>'+ checkNull(d.followup_action) + '</td>';
				
				html += '<td>'+ checkNull(followup_status	,'-') + '</td>';
				
				html += '<td>'+ checkNull(d.logged_in_user	,'-') + '</td>';
				html += '<td>';
					if((moment(d.followup_date).format('X')  > moment(moment().format('YYYY-MM-DD')).format('X') ) && fStatus != 'completed' ){
						html += '<button class="btn mini edit blue-stripe" onclick="order_followupentries.edit('+d.id+',\''+d.followup_status+'\')"  ><i class="icon-eye-open"></i>&nbsp;'+ofe_td.View+'</button>';
						html += '&nbsp;<button data-dismiss="modal" class="btn mini red-stripe" onclick="order_followupentries.deleten('+d.id+',\''+d.followup_status+'\')"><i class="icon-remove"></i>&nbsp;'+ofe_td.Delete+'</button>';
					}
					else{

					}
				html += '</td>';				
			html += '</tr>';
		}

			$('#order_followupentries_list').DataTable().destroy();
			$('#order_followupentries_list').show();
			$('#order_followupentries_list tbody').html(html);
			table = $('#order_followupentries_list').DataTable({
		 		"pagingType": "input",
		 		"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
		 		"language": {
					"lengthMenu": 
			           ofe_td.View+ ' <select>'+
						'<option value="10">10</option>'+
						'<option value="20">20</option>'+
						'<option value="30">30</option>'+
						'<option value="40">40</option>'+
						'<option value="50">50</option>'+
						'<option value="-1">All</option>'+
						'</select> '+ ofe_td.records + ' |  ',
					"paginate": {
						"previous": '<i class="icon-angle-left"></i>',
						"next": '<i class="icon-angle-right"></i>',
						'of':ofe_td.of,
						'Page':ofe_td.Page,
					},
					"info": ofe_td.Foundtotal+" _TOTAL_ "+ofe_td.records
				},
		 	});

		 	if($('.dataTables_empty').length != 0){
		 		$('#order_followupentries_list').hide();
		 		$('.empty_msg').show();
		 		$('.dataTables_info').hide();
		 	}
		 	else{
		 		$('#order_followupentries_list').show();
		 		$('.empty_msg').hide();
		 		$('.dataTables_info').show();
		 	}
		 	if(checkNull(i) != '' && checkNull(i) != 0){
				$('#show_order_followupentries_counter').html(i).show();
			}
			else{
				$('#show_order_followupentries_counter').hide();
			}

	},
	edit:function(followup_id,followup_status){
		var url = base_url + 'quotes/edit_follow_up/'+followup_id+'/'+followup_status+'?from=neworders';
		var a = document.createElement('div');
		$(a).attr('data-url',url);
		$(a).attr('data-width','500px');
		show_modal(a,'popups1');
		//new_custom_popup2('600','popups','quote_addnote',{quote_id:ofe_meta.quote_id,from:'edit',note_id:note_id});
	},
	deleten:function(followup_id,followup_status){
		var yes = function(){
			getUserIP(function(ip){
				var total_params = {
					token:token,
					language:language,
					lang:lang,
					partner_id:partner_id,
					admin_id:admin_id,
					followup_id:followup_id,
					followup_status:'deleted',
					ip:ip,
				}

				var params = $.extend({}, doAjax_params_default);
				params['url'] = APISERVER+'/api/Quotes/deleteFollowupEntry.json';
				params['data'] = total_params;
				params['completeCallbackFunction'] = function (){
					hideProcessingImage();
				}

				params['successCallbackFunction'] = function (complet_data){
			
					if(complet_data.response.status == 'success'){
						call_toastr('success',ofe_td.Success,complet_data.response.response.message.msg);
						order_followupentries.generateRows(complet_data.response.response.getFollowupEntries);
						// table.$('tr').each(function(i){
				  //  			if($(this).attr('data-id') == id){
				  //  				table.row(this).remove().draw();
				  //  				return false;
				  //  			}
						// });

						// var j = 0;
						// table.column(0).nodes().each(function(cell,i){
						// 	j++
						// 	 cell.innerHTML = i+1;
						// }).draw();
						// if(checkNull(j) != '' && checkNull(j) != 0){
						// 	$('#show_order_followupentries_counter').html(j).show();
						// }
						// else{
						// 	$('#show_order_followupentries_counter').hide();
						// }
						if($('.dataTables_empty').length != 0){
					 		$('#order_followupentries_list').hide();
					 		$('.empty_msg').show();
					 	}
					 	else{
					 		$('#order_followupentries_list').show();
					 		$('.empty_msg').hide();
					 	}
					}
					else if(complet_data.response.status == 'error'){
						if(complet_data.response.response.error == 'validationErrors'){
							var mt_arr = complet_data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error',ofe_td.Alertmessage);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',ofe_td.Alertmessage);
							return;
						}	
					}
				}
				showProcessingImage('undefined');
				doAjax(params);
				return;
			});	
		}
		var no = function(){

		}

		showDeleteMessage(ofe_td.$qt_nt_del,ofe_td.Warning,yes,no,'ui-dialog-blue',ofe_td.Delete,ofe_td.Cancel);

	},
	showPopup:function(frm='note'){
		if(frm == 'note'){
			new_custom_popup2('600','popups','order_addnote',{order_id:ofe_meta.order_id,from:'add'});
		}
		else{
			new_custom_popup2('600','popups','order_notes',{from:'manual',status:ofe_meta.status,order_id:ofe_meta.order_id});
		}
	}

}