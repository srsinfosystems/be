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

var opera_table;
var news_table;
var nm_dt;
var nm_td;

var news_message = {
	start:function(){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','News and Operational messages','News','Operational messages','Title','Content','Logged','Action','View','records','Found total','of','Page','No record found','Read more','Close','Read more','Read less','Date'],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getPartnerNewsMessage.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				nm_dt = complet_data.response.response;
				nm_td = complet_data.response.response.translationsData;
				news_message.createHtml(complet_data.response.response);		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',nm_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',nm_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		nm_td.dashboardurl = base_url+'dashboard/index';
		nm_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('news_message_template').innerHTML;
		var compiledRendered = Template7(template, nm_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		news_message.bindEvents();
	},
	bindEvents:function(){
		news_message.generateRows(nm_dt.partnerMessageNews);
	},
	generateRows:function(data,frm){

		var news_data = [];
		var opera_data = [];

		var l = 0;
		var m = 0;
		for(var j in data){
			var d = data[j].PartnerMessageNews;

		
			var obj = [];
			obj.push('<p class="title_content">'+ checkNull(d.title) + '</p>');
			obj.push('<p class="msg_content"  data-id="'+d.id+'">'+checkNull(d.contentwbr)+'</p><p style="display:none">'+checkNull(d.content)+'</p>');
			obj.push(checkNull(convertDateIntoSiteFormat(d.from_date)));
			
			var act = '<button class="btn mini blue-stripe" onclick="news_message.readMore('+d.id+')" type="button"><i class="icon-plus"></i>&nbsp;'+nm_td.Readmore+'</button>';
			act = '';
			obj.push(act);

			if(d.category == 'news'){
				news_data[l] = obj;
				l++;
			}
			else if(d.category == 'op_msg'){
				opera_data[m] = obj;
				m++;
			}
		}
		news_message.bindTable(opera_data,news_data);
	},
	bindTable:function(opera_data,news_data){
		$('#partner_operational_list').DataTable().destroy();
		$('#partner_news_list').DataTable().destroy();

		$('#partner_operational_list').show();
		opera_table = $('#partner_operational_list').DataTable({
			"data":opera_data,
			"pageLength":5,
			"pagingType": "input",
			"drawCallback":function(){
				var w = [];
				$('#partner_operational_list .title_content').each(function(){
					var wd = $(this).height();
					w.push(wd);
				});
				w = w.sort().reverse();
				var max_height = w[0];

				$('#partner_operational_list .msg_content').css({
					height:max_height+'px',
					overflow:'hidden',
				});

				var char_width = $('.char_w_h').width();
				var width_avail = $('#partner_operational_list .msg_content').width();

				var no_of_lines = parseInt(max_height/20);
				var no_char = parseInt(width_avail/char_width) * no_of_lines;
				
				var i = 0;
				$('#partner_operational_list .msg_content').each(function(){
					var without_br = $(this).html();
					var with_br = $(this).next('p').html();

					var orig_m = without_br;
					var m = without_br;
					if(m.length > no_char){
						i++;
						m = m.slice(0,no_char)
						m = m + '...';
						
						$(this).html(m);
						$(this).parent().parent().find('td:last').html('<button class="btn mini blue-stripe show_more_'+i+'" ><i class="icon-plus"></i>&nbsp;'+nm_td.Readmore+'</button>');

						$('#partner_operational_list').on('click','.show_more_'+i,function(){
							var msg = with_br;
							$(this).parent().parent().find('.msg_content').html(msg);
							$(this).parent().parent().find('td:last').html('<button class="btn mini blue-stripe show_less_'+i+'" ><i class="icon-minus"></i>&nbsp;'+nm_td.Readless+'</button>');
							$('#partner_operational_list').on('click','.show_less_'+i,function(){
								$(this).parent().parent().find('.msg_content').html(m);
								$(this).parent().parent().find('td:last').html('<button class="btn mini blue-stripe show_more_'+i+'" ><i class="icon-plus"></i>&nbsp;'+nm_td.Readmore+'</button>');

							});

						});
					}
				});

				$('#partner_operational_list .msg_content').css({
					height:'auto',
					overflow:'unset',
				});
			},
			"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			"language": {
			"lengthMenu": 
		           nm_td.View+ ' <select>'+
		            '<option value="5">5</option>'+
	             	'<option value="10">10</option>'+
		            '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		            '<option value="40">40</option>'+
		            '<option value="50">50</option>'+
		            '<option value="-1">All</option>'+
		            '</select> '+ nm_td.records + ' |  '
		         ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':nm_td.of,
					'Page':nm_td.Page,
				},
				
				"info": nm_td.Foundtotal+" _TOTAL_ "+nm_td.records
			},
		});

		news_table = $('#partner_news_list').DataTable({
			"data":news_data,
			"pageLength":5,
			"pagingType": "input",
			"drawCallback":function(){
				var w = [];
				$('#partner_news_list .title_content').each(function(){
					var wd = $(this).height();
					w.push(wd);
				});
				w = w.sort().reverse();
				var max_height = w[0];

				$('#partner_news_list .msg_content').css({
					height:max_height+'px',
					overflow:'hidden',
				});

				var char_width = $('.char_w_h').width();
				var width_avail = $('#partner_news_list .msg_content').width();

				var no_of_lines = parseInt(max_height/20);
				var no_char = parseInt(width_avail/char_width) * no_of_lines;
				
				var i = 0;
				$('#partner_news_list .msg_content').each(function(){
					var without_br = $(this).html();
					var with_br = $(this).next('p').html();

					var orig_m = without_br;
					var m = without_br;
					if(m.length > no_char){
						i++;
						m = m.slice(0,no_char)
						m = m + '...';
						
						$(this).html(m);
						$(this).parent().parent().find('td:last').html('<button class="btn mini blue-stripe show_more_'+i+'" ><i class="icon-plus"></i>&nbsp;'+nm_td.Readmore+'</button>');

						$('#partner_news_list').on('click','.show_more_'+i,function(){
							var msg = with_br;
							$(this).parent().parent().find('.msg_content').html(msg);
							$(this).parent().parent().find('td:last').html('<button class="btn mini blue-stripe show_less_'+i+'" ><i class="icon-minus"></i>&nbsp;'+nm_td.Readless+'</button>');
							$('#partner_news_list').on('click','.show_less_'+i,function(){
								$(this).parent().parent().find('.msg_content').html(m);
								$(this).parent().parent().find('td:last').html('<button class="btn mini blue-stripe show_more_'+i+'" ><i class="icon-plus"></i>&nbsp;'+nm_td.Readmore+'</button>');
							});
						});
					}
				});

				$('#partner_news_list .msg_content').css({
					height:'auto',
					overflow:'unset',
				});
			},
			"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
			"language": {
			"lengthMenu": 
		           nm_td.View+ ' <select>'+
		           	'<option value="5">5</option>'+
		            '<option value="10">10</option>'+
		            '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		            '<option value="40">40</option>'+
		            '<option value="50">50</option>'+
		            '<option value="-1">All</option>'+
		            '</select> '+ nm_td.records + ' |  '
		         ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':nm_td.of,
					'Page':nm_td.Page,
				},
				
				"info": nm_td.Foundtotal+" _TOTAL_ "+nm_td.records
			},
		});
		news_message.checkEmpty();
	},
	checkEmpty:function(){
		$('#partner_news_list_info').parent().hide();
		$('#partner_operational_list_info').parent().hide();

		var pold = $('#partner_operational_list .dataTables_empty').length;
		if(pold == 1){
			$('.opt_msg_wrap').hide();
		}
		else{
			$('.opt_msg_wrap').show();
		}
		var pnld = $('#partner_news_list .dataTables_empty').length;
		if(pnld == 1){
			$('.news_msg_wrap').hide();
		}
		else{
			$('.news_msg_wrap').show();
		}

		if(pold == 1 && pnld == 1){
			$('#opt_news_alert').show();
		}
		// if(pold == 1 && pnld == 1){
		// 	$('.opt_msg_wrap,.news_msg_wrap').hide();
		// 	$('#opt_news_alert').show();
		// }
		// else{
		// 	$('.opt_news_alert').hide();
		// 	if(pold== 0){
		// 		$('.opt_msg_wrap').show();
		// 		$('.news_msg_wrap').hide();
		// 	}
		// 	else if(pnld == 0){
		// 		$('.news_msg_wrap').show();
		// 		$('.opt_msg_wrap').hide();
		// 	}
		// }
	},
	readMore:function(id){
		var d = {};
		for(var j in nm_dt.partnerMessageNews){
			var dt = nm_dt.partnerMessageNews[j];
			if(dt.PartnerMessageNews.id == id){
				d = dt;
				break;
			}
		}

		var modalhtml = '';
			modalhtml += '<div class="modal hide fade" id="news_message_modal" style="display:none;">';
			modalhtml += '<div class="modal-header">';
				modalhtml += '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>';
				modalhtml += '<h3>'+d.PartnerMessageNews.title+'</h3>';
			modalhtml += '</div>';

			modalhtml += '<div class="modal-body">';
				modalhtml += '<div class="row-fluid">';
					modalhtml += '<div class="span12 form-horizontal form-view">';
						modalhtml += '<div class="portlet-body form">';
							modalhtml += '<form action="/" class="form-horizontal form-view" style="margin-bottom:0px;" id="news_message_form" method="post" accept-charset="utf-8">';
								modalhtml += '<div class="control-group">';
									modalhtml += '<label class="control-label">'+nm_td.Content+'</label>';
										modalhtml += '<div class="controls">';
											modalhtml += '<span class="text bold">';
												modalhtml += checkNull(d.PartnerMessageNews.content);
											modalhtml += '</span>';
										modalhtml += '</div>';
								modalhtml += '</div>';
							modalhtml += '</form>';
						modalhtml += '</div>';
					modalhtml += '</div>';
				modalhtml += '</div>';
			modalhtml += '</div>';

			modalhtml += '<div class="modal-footer">';
				modalhtml += '<div class="btn-group">';
				modalhtml += '<button data-dismiss="modal" class="btn btn_clear" type="button"><i class="icon-remove"></i>';
					modalhtml += nm_td.Close;
				modalhtml += '</button>';
				modalhtml += '</div>';
			modalhtml += '</div>';
		modalhtml += '</div>';

		//show_partner_dashboard_data

		$('#news_message_modal').remove();
		$('body').append(modalhtml)
		$('#news_message_modal').modal('show');
		console
		if(checkNull(d[0].read,0) != 1){
			news_message.markRead(id);
		}
	},
	markRead:function(id){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			id:id,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/markMessageRead.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			
			if(complet_data.response.status == 'success'){
				getNewsMessage.createHtml(complet_data.response.response.partnerMessageNews1);
				for(var j in nm_dt.partnerMessageNews){
					var dt = nm_dt.partnerMessageNews[j];
					if(dt.PartnerMessageNews.id == id){
						nm_dt.partnerMessageNews[j][0].read = 1;
						break;
					}
				}
			}
			else if(complet_data.response.status == 'error'){
					
			}
		}
		doAjax(params);
		return;
	},

}
