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
var table;
var am_dt;
var am_td;

var admin_messages = {
	start:function(){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','Settings','News and Operational messages','Actions','$sr_no','Title','Content','Category','From date','To date','Show on dashboard','Sticky','View','records','of','Page','Found total','records','Edit','Delete','Warning','Cancel','$del_msg','No record found','Add','Yes','No','News','Operational message','Read more','Read less'],

		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getAdminMessages.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				am_dt = complet_data.response.response;
				am_td = complet_data.response.response.translationsData;
				admin_messages.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',am_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',am_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		am_td.dashboardurl = base_url+'dashboard/index';
		am_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('admin_messages_template').innerHTML;
		var compiledRendered = Template7(template, am_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		admin_messages.bindEvents();
	},
	bindEvents:function(){
		admin_messages.generateRows(am_dt.partnerMessageNews);
	},
	generateRows:function(data){
		
		var tableData = [];
		var i = 0;
		var k = 0;
		for(var j in data){
			var d = data[j].PartnerMessageNews;
			tableData[i] = [];
			tableData[i].push(++k);
			tableData[i].push('<p class="title_content" data-id="'+d.id+'">'+checkNull(d.title)+'</p>');
			tableData[i].push('<p class="msg_content"  data-id="'+d.id+'">'+checkNull(d.contentwbr)+'</p><p style="display:none">'+checkNull(d.content)+'</p>');

			if(checkNull(d.category) == 'news'){
				tableData[i].push(am_td.News);
			}
			else{
				tableData[i].push(am_td.Operationalmessage);
			}


			tableData[i].push(convertDateIntoSiteFormat(checkNull(d.from_date)));
			tableData[i].push(convertDateIntoSiteFormat(checkNull(d.to_date)));
			if(checkNull(d.show_on_dashboard) == 1){
				tableData[i].push(am_td.Yes);
			}
			else{
				tableData[i].push(am_td.No);
			}
			
			if(checkNull(d.sticky) == 1){
				tableData[i].push(am_td.Yes);
			}
			else{
				tableData[i].push(am_td.No);
			}


			var act = '<button data-id="'+d.id+'" class="btn mini blue-stripe journal_row" onclick="admin_messages.edit('+d.id+');"><i class="icon-edit"></i> '+am_td.Edit+'</button>';

			act += '<button data-id="'+d.id+'" class="btn mini red-stripe del_row" onclick="admin_messages.delete('+d.id+');"><i class="icon-remove"></i> '+am_td.Delete+'</button>';
				
				
			tableData[i].push(act);
			i++;
		}
		admin_messages.bindTable(tableData);
	},
	bindTable:function(tableData=[]){

		$('#admin_message_list').DataTable().destroy();
		$('#admin_message_list').show();
		table = $('#admin_message_list').DataTable({
			"data":tableData,
			"pagingType": "input",
			"rowCallback": function( nRow, adata ) {

			},
			"drawCallback":function(){
				var w = [];
				$('.title_content').each(function(){
					var wd = $(this).height();
					w.push(wd);
				});
				w = w.sort().reverse();
				var max_height = w[0];
				console.log(max_height);

				$('.msg_content').css({
					height:max_height+'px',
					overflow:'hidden',
				});

				var char_width = $('.char_w_h').width();
				var width_avail = $('.msg_content').width();

				var no_of_lines = parseInt(max_height/20);
				var no_char = parseInt(width_avail/char_width) * no_of_lines;
				
				var show_more = function(m){

				}
				var i = 0;
				$('.msg_content').each(function(){
					var without_br = $(this).html();
					var with_br = $(this).next('p').html();

					var orig_m = without_br;
					var m = without_br;
					if(m.length > no_char){
						i++;
						m = m.slice(0,no_char)
						m = m + '... <button class="btn mini blue-stripe show_more_'+i+'" ><i class="icon-plus"></i>&nbsp;'+am_td.Readmore+'</button>';

						$(this).html(m);

						$('.msg_content').on('click','.show_more_'+i,function(){
							var msg = with_br + '&nbsp;<button class="btn mini blue-stripe show_less_'+i+'" ><i class="icon-minus"></i>&nbsp;'+am_td.Readless+'</button>';
							$(this).parent().html(msg);
							$('.msg_content').on('click','.show_less_'+i,function(){
								$(this).parent().html(m);
							});

						});
					}
				});

				$('.msg_content').css({
					height:'auto',
					overflow:'unset',
				});
			},
			"columns": [
			    { "width": "5%" },
			    { "width": "14%" },
			    { "width": "24%" },
			  	{ "width": "14%" },
			    { "width": "8%" },
		     	{ "width": "8%" },
			    { "width": "9%" },
			   	{ "width": "8%" },
			   	{ "width": "10%" },
			],
			"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			"language": {
			"lengthMenu": 
		           am_td.View+ ' <select>'+
		             '<option value="10">10</option>'+
		             '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		             '<option value="40">40</option>'+
		             '<option value="50">50</option>'+
		             '<option value="-1">All</option>'+
		             '</select> '+ am_td.records + ' |  '
		         ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':am_td.of,
					'Page':am_td.Page,
				},
				
				"info": am_td.Foundtotal+" _TOTAL_ "+am_td.records
			},
		});

		
		admin_messages.checkEmpty();

		//
		// w = w - 10;
		// $('.msg_content').css({
		// 	'width':w+'px'
		// });

	},
	checkEmpty:function(){
		if($('.dataTables_empty').length == 1){
			$('#admin_message_list').hide();
			$('#empty_message').show();
			$('.dataTables_info').hide();
		}
		else{
			$('#admin_message_list').show();
			$('#empty_message').hide();
			$('.dataTables_info').show();
		}
	},
	edit:function(id){
		new_custom_popup2('700','popups','addedit_message',{from:'edit',id:id});
	},
	delete:function(id){
		var yes = function(){
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				id:id,
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Commons/deleteMessages.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					table.$('tr').each(function(i){
			   			if($(this).find('.del_row').attr('data-id') == id){
			   				table.row(this).remove().draw();
			   				return false;
			   			}
					});

		   			table.column(0).nodes().each( function (cell, i) {
        				cell.innerHTML = i+1;
    				});
					table.draw();
					admin_messages.checkEmpty();
					call_toastr('success',am_td.Success,complet_data.response.response.message.msg);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',am_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',am_td.alertmessage);
						return;
					}	
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;
		};

		var no = function(){};
		showDeleteMessage(am_td.$del_msg,am_td.Warning,yes,no,'ui-dialog-blue',am_td.Delete,am_td.Cancel);	
	},
	showPopup:function(frm=1,id=''){
		if(frm == 1){
			new_custom_popup2('700','popups','addedit_message',{from:'add'});
		}
	}

}
