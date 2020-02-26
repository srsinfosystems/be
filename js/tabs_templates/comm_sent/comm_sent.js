var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();
var staffer_id = $('#staffer_id').val();
var PartnerName = $('#PartnerName').val();
var UserFirstName = $('#UserFirstName').val();
var IsAdmin = $('#IsAdmin').val();
var crouter_url = $('#crouter_url').val();
var loginType = $('#loginType').val();
var csn_tab_id;
var csn_data={};
var csn_td={};
var csn_meta;
var comm_sent = {
	start:function(tab_id,meta_data={}){
		if($.isEmptyObject(meta_data)){
			return;
		}
		$('#customer_tab_content').html('');
		
		csn_tab_id = tab_id;
		csn_meta = meta_data;
		csn_data.translationsData =  cust_det_trans_dt;
		csn_td = cust_det_trans_dt;
		comm_sent.createHtml(csn_data);
		comm_sent.getInbox();
	},
	getInbox:function(){
		localStorage.setItem('ajaxstart',true);
		var next_page = parseInt($('#next_page').val());
		var start = parseInt($('#end').val()) + 1;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:csn_meta.customer_id,
			staffer_id:staffer_id,
			direction:'DESC',
			limit:10,
			page:next_page,
			start:start
		};
		if(screen.height > 1200){
			total_params.limit = 28
		}
		else{
			total_params.limit = 15;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/PartnerMessages/getPartnerLetterOutBox.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){		
				localStorage.setItem('ajaxstart',false);

				if(complet_data.response.response.showpartneremailsetting=='showpartneremailsetting'){
					
						
						var one = csn_td.$use_inb;
						var two = csn_td.clickhere;
						var three =csn_td.todoso+'.';
						
				

					var htm = `<br><div class='confg alert alert-info' style='text-align:center;'>`+one+` <a onclick="comm_sent.ss_show_modal()">`+two+`</a> `+three+`</div>`;
					$('#sorting_product_sent').after(htm);
					$('#next_page').val(0);
					//configured = 'no';
					$('.searchloader').remove();
					return;
				}

				comm_sent.generateHtml(complet_data.response.response.list,complet_data.response.response.pagination);	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',csn_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',csn_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	createHtml:function(){
		csn_data.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		csn_data.base_url = base_url;
		csn_data.customer_status = csn_meta.customer_status;
		csn_data.customer_id = csn_meta.customer_id;
		var template = document.getElementById('comm_sent_template').innerHTML;
		var compiledRendered = Template7(template, csn_data);
		document.getElementById(csn_tab_id).innerHTML = compiledRendered;
		comm_sent.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		localStorage.setItem('ajaxstart',false);
		var bth = 0;
		$(window).on('scroll', function() {
			if(localStorage.getItem('ajaxstart')=='false' && $('#sorting_product_sent').length!=0){
				if (document.body.scrollHeight - bth -  $(this).scrollTop()  <= $(this).height()){
					$('#loadmoreemail').remove();
			   		var next_page =  $('#next_page').val();
					if(localStorage.getItem('ajaxstart')=='false' &&  parseInt(next_page)!=0){
						$('.portfolio-block').after('<div id="loadmoreemail" class="row-fluid text-center"><img src="'+crouter_url+'/img/loading.gif"></div>');
						localStorage.setItem('ajaxstart','true');
							setTimeout(function(){
								$('body,html,.page-container,.page-content').attr('style','height:auto');
								comm_sent.getInbox();
							},1000);
					}else{
						$('#loadmoreemail').remove();
						localStorage.setItem('ajaxstart','false');
						$('.portfolio-block').after('<div id="loadmoreemail"><div class="row-fluid text-center">'+csn_td.$no_more_email+'</div>');
						
					}
					if(parseInt(next_page)==0){
						if($('body').find('#inboxend').length!=1){
							//$('.portfolio-block').after('<br><div id="inboxend" class="alert alert-info" style="text-align:center;"><?php echo __("Your inbox has no other email"); ?></div>');
						}

					}

				} 
				else{
				    
				}
			}
		});
	},
	ss_show_modal:function(){

		show_modal('','','',base_url + 'communication/show_email_settings?from=customer');
	},
	generateHtml:function(data,pagination){
		
		

		if(checkNull(pagination.total_records)!='' && checkNull(pagination.total_records)!=0){
			$('#total_records').val(pagination.total_records);
		}
		else{
			$('#total_records').val(0);
		}

		if(checkNull(pagination.next_page)!='' && checkNull(pagination.total_records)!=0){
			$('#next_page').val(pagination.next_page);
		}
		else{
			$('#next_page').val(0);
		}

		var np = $('#next_page').val();
		if(np==0){
			$('#loadmoreemail').remove();
			$('.portfolio-block').after('<div id="loadmoreemail"><div class="row-fluid text-center">'+csn_td.$no_more_email+'</div>');		
		}
		comm_sent.generateList(data);
	},
	show_right_menu:function (cl){
		$('.msg_menu_right'+cl).show();
		$('.msg_menu_right_date'+cl).hide();
		$('#right-btn-ellipsis-'+cl).removeClass('dropup');
	},
 	hide_right_menu:function(cl){
		$('.msg_menu_right'+cl).hide();
		$('.msg_menu_right_date'+cl).show();
		$('#right-btn-ellipsis-'+cl).removeClass('open');
	},
	show_chk_opt:function(mid){
		$('.ms_chk'+mid).show();
		$('.ms_img'+mid).hide();
		var numberOfChecked = $('input:checkbox:checked').length;
		if(numberOfChecked > 0){
			$('.ms_chk_opt').show();
			$('.dp_img').hide();
			$('.action_extra_opt').show();
		}
		else{
			$('.ms_chk_opt').hide();
			$('.dp_img').show();
			$('.ms_chk'+mid).show();
			$('.ms_img'+mid).hide();
			$('.action_extra_opt').hide();
		}
	},
 	hide_chk_opt:function(mid){
		$('.ms_chk'+mid).hide();
		$('.ms_img'+mid).show(); 
		var numberOfChecked = $('input:checkbox:checked').length;
		if(numberOfChecked > 0){
			$('.ms_chk_opt').show();
			$('.dp_img').hide();
			$('.action_extra_opt').show();
		}
		else{
			$('.ms_chk_opt').hide();
			$('.dp_img').show();
			$('.ms_chk'+mid).hide();
			$('.ms_img'+mid).show();
			$('.action_extra_opt').hide();
		}
	},
	set_dropdown:function(event,id){
		var ph = $(document).height();
		var ch = event.pageY;
		var diff = ph - ch ;
		if(diff < 230){
			$('#right-btn-ellipsis-'+id).addClass('dropup');
		}
	},
	set_custom_reply:function(id,msg_id,a){
		$(a).parent().parent().prev().click();
	},
	delete_letter_email:function(id){
		 var title = csn_td.Warning;			
		 $("#delete_email" ).dialog({
			  dialogClass: 'ui-dialog-blue',
			  modal: true,
			  title:title,
			  resizable: false,
			  height: 190,
			  //width: 380,
			  modal: true,
			  buttons: [
				{
					'class' : 'btn red',
					'id' : 'cancelbtntext',	
					"text" : csn_td.Delete,
					click: function() {
						$(this).dialog( "close" ); 
		
						var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&id='+id+'&folder=o';
						
						var data = passProdRequest(APISERVER+'/api/PartnerMessages/deleteLetterMail.json',total_params);
						if(data == undefined){
							var json_data = $('#json_data').val();
							var data = JSON.parse(json_data);
							if(data.response){
									call_toastr('success', csn_td.Success,csn_td.EmailDeletedsuccessfully);
									var stafer_id = $('#staffer_id').val();
									getInboxCountApi2(stafer_id);
									
									$('.ms'+id).remove();
									$('.ms_u'+id).remove();
									$('.ms_m'+id).remove();
									$('.ms_l'+id).remove();
									
							}else if(data.response.status == 'error'){
								if(data.response.response.error == 'validationErrors'){
									var mt_arr = data.response.response.list;
									var array = $.map(mt_arr, function(value, index) {
										return value+'<br />';
									});
									showAlertMessage(array,'error',csn_td.alertmessage);
									return;
								}else{
									showAlertMessage(data.response.response.msg,'error',csn_td.alertmessage);
									return;
								}	
							}
						}
					}
				},
				{
					'class' : 'btn',
					'id' : 'cancelbtntext',	
					"text" : csn_td.Cancel,
					click: function() {
						$(this).dialog( "close" );
					}
				}
			  ]
		});
		$( "#cancelbtntext" ).prepend( "<i class='icon-remove'></i> " );
	},
	show_msg_body:function(id,msg_id,sd='',unreadmsgid=''){
		for (i = 0; i < 10; i++){
			if($('.ms_m'+i).css('display') !== 'none'){
				$('#frm_msg'+i+' #table-striped_'+i+' .files').children().children('.delete').children('.btn').click();	
				var data_len = $('#attachments').val();
				if(data_len.length == 2){
					$('#table-striped_'+i+' .files').html('');
				}
			}
		}

		$('.getmsgthread').remove();
		$('.ms_line'+id+' .writer_name:first').after('<div class="getmsgthread" class="row-fluid text-center"><img src="'+crouter_url+'/img/loading.gif"></div>');
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:csn_meta.customer_id,
			staffer_id:staffer_id,
			folder:'i,c',
			from:'inbox',
			message_id:msg_id,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/PartnerMessages/getMsgThread.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (data){
		
			if(data.response.status == 'success'){			
				comm_sent.generateMsgThread(data.response.response,id,msg_id,sd='',unreadmsgid='');
			}
			else if(data.response.status == 'error'){
				if(data.response.response.error == 'validationErrors'){
					var mt_arr = data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',csn_td.alertmessage);
					return;
				}else{
					showAlertMessage(data.response.response.msg,'error',csn_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	generateMsgThread:function(data,id,pmsg_id,psd='',punreadmsgid=''){
		var isdraft = false;
		if(checkNull(data.draftdetails!=undefined)!=''){
			var draft_message_id = data.draftdetails.draft_message_id;
			var draft_message_text_id = data.draftdetails.draft_message_text_id;
			var messages =  data.draftdetails.draft_message;
			var pmsgid = data.draftdetails.parent_message_id;

			var obj= {partner_message_id:draft_message_id,partner_message_text_id:draft_message_text_id};
			var attachments_draft = data.draftdetails.attachments;
			isdraft = true;
			if(attachments_draft!=''){
											
				
			}
			localStorage.setItem('draftids',JSON.stringify(obj));
			
		}
		var jstext = '';
		var ccounter = 0;
		for(var j in data.threaddetails){
			ccounter++;
			var index = j;
			var text_id =  data.threaddetails[j].PartnerMessageText.id;
			var msg_id =  data.threaddetails[j].PartnerMessage.id;
			var pm = data.threaddetails[j].PartnerMessage;
			var pmt = data.threaddetails[j].PartnerMessageText;
			var pmf = data.threaddetails[j].PartnerMessageFolder;
			var pma = data.threaddetails[j].PartnerMessageAttachment;
			
			var cust = data.threaddetails[j].Customer;
			if(data.threaddetails.length > 3){
				if( index == '0'){
					jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" onmouseover="show_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
				}
				else if( index == (data.threaddetails.length - 1)){
					jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" style="border-top:none;" onmouseover="show_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
				}
				else{
					jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" style="display:none;" onmouseover="show_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
				}
			}
			else{
				jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" onmouseover="show_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';	
			}

			var initial1=''; var initial2 =''; var initial3 =''; var a =''; var b ='';
			var source_from = checkNull(pm.source_from);

			if(source_from == null){
				if(cust.name!='' && cust.name!=undefined){
					var initial1 = PartnerName;
					var initial1 = initial1.substr(0,1);
					var initial2 = cust.name;
					var initial2 = initial2.split(" ");
					var a  = initial2[0];
					var b = initial2[1];
					if(a!=undefined){
						var initial2 = a.substr(0,1).toUpperCase();
					}
					if(b!=undefined){
						var initial3 = b.substr(0,1).	toUpperCase();
					}
					if(initial1=='<'){
						var initial1 ='';
					}
					if(initial2=='<'){
						var initial2 ='';
					}					
				}
			}else{ 
				var initial1 = source_from;
				var initial1 = initial1.split(" ");
				var a  = initial1[0];
				var b = initial1[1];
				if(a != undefined){
					var a = a.replace('"', "<")
					var initial1 = a.substr(0,1).toUpperCase();
					if(initial1 == '<'){
						initial1 = a.substr(1,1).toUpperCase();
					}
				}else{
					var initial1 = '';
				}	
				
				if(b != undefined){
					var b = b.replace('"', "<")
					var initial2 = b.substr(0,1).toUpperCase();
					if(initial2 == '<'){
						initial2 = b.substr(1,1).toUpperCase();
					}
				}else{
					var initial2 = '';
				}	
					
				if(initial1=='<'){
					var initial1 ='';
				}
				if(initial2=='<'){
					var initial2 ='';
				}
				var initial3 = '';			
			}

			jstext += '<td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="border_radius">'+initial1+initial2+initial3+'</div></td>';
			
			jstext += '<td class="border_box_last"  style="border:none;">';

			if(data.threaddetails.length > 1){
				var source = PartnerName;
				if(source_from != null){
					source = source_from;
				}
				
				var customer_email = '<b>'+cust.name+'</b> &lt; '+cust.email+' &gt;';
				var source_email = pm.email;
				if(source_email != null){
					customer_email = source_email;
				}
				var inbox = 'inbox';
				var message = pmt.message;
				message = decodeEntities(message);
				message = message.split('sarthak@123+_*&^%~');	
				text_message = message[0];
				
				var text_message = text_message.replace(/<\/?[^>]+(>|$)/g, "");
				var folder_name = pmf.folder;
				
				if(folder_name!='d'){
					jstext += '<div class="bd_h_'+id+'_'+msg_id+'" onclick="comm_sent.show_hide_msg_thread('+id+','+msg_id+')"  style="cursor:pointer;"><div style="float:left;">';
			
					jstext += '<div class="slr_snd_'+id+'_'+msg_id+'" style="cursor:pointer;" ><b class="writer_name">'+source+'</b></div>';
					jstext += '<div class="slr_rcv_'+id+'_'+msg_id+'" style=" display:none; cursor:pointer;" >'+csn_td.to+' &nbsp;'+customer_email+'</div>';	
				}
				else if(folder_name=='d'){
					jstext += '<div class="bd_h_'+id+'_'+msg_id+'"   style="cursor:pointer;"><div onclick="ss_show_draft_dkmodal('+id+','+text_id+','+msg_id+')" style="float:left;">';
					jstext += '<div style="color:#d23f31">'+csn_td.Draft+'</div>';
				}

				jstext += '<div class="slr_txt_'+id+'_'+msg_id+'" style=" color:#757575; cursor:pointer;">'+$('<div class="testClass">'+text_message+'</div>').text().substr(0,100)+'</div></div>';
				jstext += '<div style="height: 30px; line-height: 30px; float: right;"><span>'+pmt.time_text+'</span>&nbsp;&nbsp;';
						
				if(folder_name!='d'){	
					jstext += '<div class="btn-group pull-right thread-btn-ellipsis" id="thread-btn-ellipsis-'+id+''+msg_id+''+msg_id+'" onclick=" sub_thread_dropdown(event,'+id+','+msg_id+','+msg_id+');" style="display: none;">';	
					jstext += '<span data-close-others="true" data-delay="100" data-hover="dropdown-toggle" data-toggle="dropdown" class="dropdown-toggle">';
					jstext += '<a style="margin: 0px 2px;" class="round_btn_icon btn icn-only"><i class="icon-ellipsis-vertical right-thread-btn-icon-'+msg_id+'" ></i></a> ';
					jstext += '</span>';
					jstext += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
					jstext += '<li>	';
					jstext += '<a class="" onclick="show_dkmodal_for_reply('+id+','+text_id+','+msg_id+');"><i class="icon-reply" style="color:#000000"></i>&nbsp;'+csn_td.Reply+'</a>';
					jstext += '</li>';
					jstext += '<li>';
					jstext += '<a class="" onclick="show_dkmodal_for_forward('+id+','+text_id+','+msg_id+');"><i class="icon-arrow-right" style="color:#000000"></i>&nbsp;'+csn_td.$fwd_hash+'</a>';
					jstext += '</li>';
					jstext += '<li>';
					jstext += '<a class="" onclick="print_mail_pdf('+text_id+','+msg_id+');"><i class="icon-print" style="color:#000000"></i>&nbsp;'+csn_td.Print+'</a>';
					jstext += '</li>';
					jstext += '<li>';
					jstext += '<a class="" onclick="show_mail_source('+text_id+','+msg_id+');"><i class="icon-file" style="color:#000000"></i>&nbsp;'+csn_td.Showsource+'</a>';
					jstext += '</li>';
					jstext += '</ul>';
					jstext += '</div>';	
					jstext += '</div>';
					
					jstext += '<div style="clear:both;"></div>';
				}
				else if(folder_name=='d'){
					jstext += '<div class="pull-right" style="z-index:1000;cursor:pointer"><a class="round_btn_icon btn icn-only" onclick="ss_delete_trash('+id+','+msg_id+');" data-toggle="tooltip" data-placement="top" title="'+csn_td.Delete+'"><i class="icon-trash" style=""></i></a></div>';
						jstext += '<div style="clear:both;"></div>';
				}
				jstext += '</div>';	
				jstext += '</div>';
				
				jstext += '<div class="bd_resp_'+id+'_'+msg_id+'" style="padding: 20px 0px; display:none;">';
			}
			else{
				var source = PartnerName;
				if(source_from != null){
					source = source_from;
				}
				
				var customer_email = '<b>'+cust.name+'</b> &lt; '+cust.email+' &gt;';
				var source_email = pm.email;
				if(source_email != null){
					customer_email = source_email;
				}
				var inbox = 'inbox';
				jstext += '<div class="bd_h_'+id+'_'+msg_id+'" style=""><div style="float:left;">';
				jstext += '<div class="slr_snd_'+id+'_'+msg_id+'" style="" ><b class="writer_name">'+source+'</b></div>';
				jstext += '<div class="slr_rcv_'+id+'_'+msg_id+'" style="" >'+csn_td.to+' &nbsp;'+customer_email+'</div>';
				jstext += '</div>';
				jstext += '<div  style="height: 30px; line-height: 30px; float: right;"><span>'+pmt.time_text+'</span>&nbsp;&nbsp;';
				
				jstext += '<div class="btn-group pull-right thread-btn-ellipsis" id="thread-btn-ellipsis-'+id+''+msg_id+''+msg_id+'" onclick="">';	
				jstext += '<span data-close-others="true" data-delay="100" data-toggle="dropdown" class="dropdown-toggle">';
				jstext += '<a style="margin: 0px 2px;" class="round_btn_icon btn icn-only"><i class="icon-ellipsis-vertical right-thread-btn-icon-'+msg_id+'" ></i></a> ';
				jstext += '</span>';
				jstext += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
				jstext += '<li>	';
				jstext += '<a class="" onclick="show_dkmodal_for_reply('+id+','+text_id+','+msg_id+');"><i class="icon-reply" style="color:#000000"></i>&nbsp;'+csn_td.Reply+'</a>';
				jstext += '</li>';
				jstext += '<li>';
				jstext += '<a class="" onclick="show_dkmodal_for_forward('+id+','+text_id+','+msg_id+');"><i class="icon-arrow-right" style="color:#000000"></i>&nbsp;'+csn_td.$fwd_hash+'</a>';
				jstext += '</li>';
				jstext += '<li>';
				jstext += '<a class="" onclick="print_mail_pdf('+text_id+','+msg_id+');"><i class="icon-print" style="color:#000000"></i>&nbsp;'+csn_td.Print+'</a>';
				jstext += '</li>';
				jstext += '<li>';
				jstext += '<a class="" onclick="show_mail_source('+text_id+','+msg_id+');"><i class="icon-file" style="color:#000000"></i>&nbsp;'+csn_td.Showsource+'</a>';
				jstext += '</li>';
				jstext += '</ul>';
				jstext += '</div>';	
				jstext += '</div>';
				
				jstext += '<div style="clear:both;"></div>';
				jstext += '</div>'; //float right div ends here
				
				jstext += '</div>';
				jstext += '<div class="bd_resp_'+id+'_'+msg_id+'" style="padding: 20px 0px;">';
			}

			var message =pmt.message;
			message = decodeEntities(message);
			message = message.split('sarthak@123+_*&^%~');	
			text_message = message[0];
			jstext += '<div class="testClass">'+message+'</div>';
				if(pma){
					jstext += '<hr><div class="inbox-attached" style="line-height:unset !important;">';
					if(pma.length > 1) { 
						var cc=0;
						var arr = '';
						for(var k in pma){
							if(cc==0){
								arr += decodeURIComponent(pma[k].file_name);
							}
							else{
								arr += ','+decodeURIComponent(pma[k].file_name);
							}
							cc++;
						}
						arr  = encodeURIComponent(arr);
						var pid =  btoa(partner_id);
						var cr = crouter_url;
						var url = cr+'app/webroot/view_file.php?partner_id='+pid+'&from=zip&all='+arr;
						jstext += '<div class="margin-bottom-15">';
							jstext += '<span>'+pma.length+' '+csn_td.Attachments+'</span>';
							jstext += '<a style="cursor:pointer" target="_blank" href="'+url+'">'+csn_td.Downloadallattachments+'</a>';
						jstext += '</div>';
					}
					var pid =  btoa(partner_id);
					for(var k in pma){
						var viewpath = pma[k].file_path;	
						var path = base_url + 'app/webroot/view_file.php?url='+ pma[k].urlencode + '&size='+pma[k].size+'&partner_id='+pid;
						var extension =  pma[k].extension;
						var ext = extension.toUpperCase();
						var orig_name = pma[k].orig_name_wt_ext;
						var size = formatFileSize(pma[k].size);
						var thurl  = pma[k].thumbnail_url;
						if(checkNull(thurl)==''){
							var thurl  = pma[k].file_path;
						}
						var file_path = pma[k].file_path;
						if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
							jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
								jstext += '<div class="files">';
									jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
										jstext += '<a id="aSH_'+i+'" data-fancybox title="'+pma[k].orig_name+'" href="'+file_path+'" data-rel="" class=" kY">';
												jstext += '<img src="'+thurl+'" style="width:70%; height:40%;margin-left: 15%;margin-top: 13%;" class="hoverimage">';
													jstext += '<div style="padding-left: 10px; color: #B18575;">';
														
													jstext += '<span style="padding-left: 25px;">'+size+'</span>';
												jstext += '</div>';
										jstext += '</a>';
											
										jstext += '<div class="showthiss">';
										    jstext += '<div class="text">';
										    	jstext += '<a href="javascript:;" onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');return false;"><i class="icon-download" ></i></a>';
										    jstext += '</div>';
									 	 jstext += '</div>';
								  	jstext += '</div>';
								jstext += '</div>';
							jstext += '</div>';							
						}
						else if(extension == 'pdf'){
							jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
								jstext += '<div class="files">';
									jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
										jstext += '<a  data-fancybox id="aSH_'+i+'" title="'+orig_name+'" href="/a/" data-rel="" class=" kY">';
											jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden">';
												jstext += '<span>'+orig_name+'</span>';
											jstext += '</div>';
											jstext += '<div style="padding-left: 10px; color: #B18575;">';
												jstext += '<img src="'+crouter_url+'app/webroot/img/file-icon/icon_pdf.png" alt="icon">';
												jstext += '<span style="padding-left: 10px;">'+ext+'</span>';
											jstext += '</div>';
											jstext += '<div style="padding-left: 10px; color: #B18575;margin-top:5%;">';
												jstext += '<span style="padding-left: 25px;">'+size+'</span>';
											jstext += '</div>';
										jstext += '</a>';
										jstext += '<div class="showthiss">';
								    		jstext += '<div class="text">';
								    			jstext += '<a href="javascript:;" onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');return false;"><i class="icon-download" ></i></a>';
								    		jstext += '</div>';
								 		jstext += '</div>';
									jstext += '</div>';
								jstext += '</div>';
							jstext += '</div>';	
						}
						else if((extension == 'csv') || (extension == 'txt')){
							jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
								jstext += '<div class="files">';
									jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
												jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="'+viewpath+'" data-rel="" class=" kY">';
													jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
													jstext += '<div style="padding-left: 10px; color: #B18575;">';
														jstext += '<img src="'+crouter_url+'app/webroot/img/file-icon/icon_text.png" alt="icon">';
															jstext += '<span style="padding-left: 10px;">'+ext+'</span>';
													jstext += '</div>';
													jstext += '<div style="padding-left: 10px; color: #B18575;margin-top:5%">';
														jstext += '<span style="padding-left: 25px;">'+size+'</span>';
													jstext += '</div>';
												jstext += '</a>';
												jstext += '<div class="showthiss">';
										    		jstext += '<div class="text">';
										    			jstext += '<a href="javascript:;" ><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');return false;" class="icon-download"></i></a>';
										    		jstext += '</div>';
										 		jstext += '</div>';
									jstext += '</div>';
								jstext += '</div>';
							jstext += '</div>';
						}
						else if((extension == 'docx') || (extension == 'doc')){
							jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';jstext += '<div class="files">';
									jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
										jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="#" data-rel="" class=" kY">';
											jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
											jstext += '<div style="padding-left: 10px; color: #B18575;">';
												jstext += '<img src="'+crouter_url+'app/webroot/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
												jstext += '<div style="padding-left: 10px; color: #B18575;margin-top:5%">';
													jstext += '<span style="padding-left: 25px;">'+size+'</span>';
												jstext += '</div>';
											jstext += '</div>';
										jstext += '</a>';
										jstext += '<div class="showthiss">';
								    		jstext += '<div class="text">';
								    			jstext += '<a href="javascript:;" ><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');return false;" class="icon-download"></i></a>';
								    		jstext += '</div>';
								 		jstext += '</div>';
									jstext += '</div>';
								jstext += '</div>';
							jstext += '</div>';
						}
						else if((extension == 'xlsx') || (extension == 'xls')){
							jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';jstext += '<div class="files">';
									jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
											jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="#" data-rel="" class=" kY">';
												jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
												jstext += '<div style="padding-left: 10px; color: #B18575;">';
													jstext += '<img src="'+crouter_url+'app/webroot/img/file-icon/icon_spreadsheet.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
													jstext += '<div style="padding-left: 10px; color: #B18575;margin-top:5%">';
														jstext += '<span style="padding-left: 25px;">'+size+'</span>';
													jstext += '</div>';
												jstext += '</div>';
											jstext += '</a>';
											jstext += '<div class="showthiss">';
									    		jstext += '<div class="text">';
									    			jstext += '<a href="javascript:;" ><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');return false;" class="icon-download"></i></a>';
									    		jstext += '</div>';
									 		jstext += '</div>';
									jstext += '</div>';
								jstext += '</div>';
							jstext += '</div>';
						}
						else if(extension == 'zip'){
							jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';jstext += '<div class="files">';
								jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
									jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="#" data-rel="" class=" kY">';
										jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
										jstext += '<div style="padding-left: 10px; color: #B18575;">';
											jstext += '<img src="'+crouter_url+'app/webroot/img/file-icon/icon_zip.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
											jstext += '<div style="padding-left: 10px; color: #B18575;margin-top:5%">';
												jstext += '<span style="padding-left: 25px;">'+size+'</span>';
											jstext += '</div>';
										jstext += '</div>';
									jstext += '</a>';
									jstext += '<div class="showthiss">';
							    		jstext += '<div class="text">';
							    			jstext += '<a href="javascript:;" ><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');return false;" class="icon-download"></i></a>';
							    		jstext += '</div>';
							 		jstext += '</div>';
								jstext += '</div>';
							jstext += '</div>';
						}
						else if(extension == 'msword'){
							jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';jstext += '<div class="files">';
								jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
									jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="#" data-rel="" class=" kY">';
										jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
										jstext += '<div style="padding-left: 10px; color: #B18575;">';
											jstext += '<img src="'+crouter_url+'app/webroot/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
											jstext += '<div style="padding-left: 10px; color: #B18575;margin-top:5%">';
												jstext += '<span style="padding-left: 25px;">'+size+'</span>';
											jstext += '</div>';
										jstext += '</div>';
									jstext += '</a>';
									jstext += '<div class="showthiss">';
							    		jstext += '<div class="text">';
							    			jstext += '<a href="javascript:;" ><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');return false;" class="icon-download"></i></a>';
							    		jstext += '</div>';
							 		jstext += '</div>';
								jstext += '</div>';
							jstext += '</div>';
						}
					}
				}
			jstext +='</div>';	
			jstext += '</div></td></tr></tbody></table></div></div>';

			if(data.threaddetails.length > 3){
				if(ccounter==1){
					var clen =  parseInt(data.threaddetails.length) - parseInt(2);
					jstext += '<div class="c_count mgs_sub_list" onclick="comm_sent.show_sub_list_thread('+id+','+msg_id+','+msg_id+');" style="border:none;"><div class="" style="border-top:none;"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr><td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="c_count_main">'+clen+'</div></td><td class="border_box_last" style="border:none;"></td></tr></tbody></table></div></div></div>';
				}
			}
		}
		
		$('#msg_bd_'+id).hide();
		$('#msg_bd_'+id).html(jstext);
		$('#msg_bd_'+id).show();

		$('#last_msg_text_id_'+id+'_'+msg_id).val(text_id);
		if(psd!=''){
			var ms_m = '.ms_m'+sd;
			if(unreadmsgid==''){
				// setTimeout(function(){
				// 	var ms_moffset = $(ms_m).offset().top;
				// 	console.log('ms_moffset'+ms_moffset);
				// 	if($(ms_m).offset().top > 200){
				// 		ms_moffset = ms_moffset -350;
				// 	}
				// 	$('html, body').animate({
				//     scrollTop: ms_moffset
				// }, 400);
				// },500);
			}
		}
		$('tr.ms'+id).removeClass('unread');
		$('.getmsgthread').remove();
		$('.ms_m'+id+' .reply-msg').css('background',"#efefef");
		$('.main_msg_box').css('padding',"2% 0 0");
		$('.imgm'+id).show();
		if(punreadmsgid==''){
			if(folder_name!='d')
			comm_sent.show_hide_msg_thread(id,msg_id);
		}
		else{
			comm_sent.show_hide_msg_thread(id,punreadmsgid,'yes');
		}
		$('.ms_u').hide();	
		$('.ms_m').hide();	
		$('.ms_l').hide();
		$('.ms').show();

		$('.ms_u'+id).show();	
		$('.ms_m'+id).show();	
		$('.ms_l'+id).show();
		$('.ms'+id).hide();	

		if(isdraft){
			comm_sent.reply_body_msg_show_tpl(pmsgid,pmsgid,'no',messages,attachments_draft);
		}

		fancyAdjust();
		UpdatePartnerMessageHtmlHeader();
	},
	generateList:function(htmldata){
		partnername = PartnerName;
		var html ='';
		var sh = 0 ;

		for(var key in htmldata){
			var pm = htmldata[key].PartnerMessage;
			var pmt = htmldata[key].PartnerMessageText;
			var cust = htmldata[key].Customer;
			var alld = htmldata[key];
			var PartnerMessageid = pm.id;

			var cls ='';
			sh = sh + 71;
			if(pm.read == 0 || pm=='0'){
				cls = ' unread';
			}

			var sub = pmt.subject;

			var a =''; var b =''; var initial1 = ''; var initial2 = '';
			if(checkNull(alld.first) != ''){
				var n = htmldata[key].first.trim().split(" ");
				if(n[0]!=undefined){
					initial1 = n[0].substring(0,1).toUpperCase();
				}
				if(n[1]!=undefined){
					initial2 = n[1].substring(0,1).toUpperCase();
				}
			}
			else{
				var n = partnername.trim().split(" ");
				if(n[0]!=undefined){
					initial1 = n[0].substring(0,1).toUpperCase();
				}
				if(n[1]!=undefined){
					initial2 = n[1].substring(0,1).toUpperCase();
				}
			}

			if(initial1=='<'){
				initial1='';
			}
			if(initial2=='<'){
				initial2 ='';
			}

			html += '<tr class="ms ms'+PartnerMessageid+cls+' border_box_line test_class" onmouseenter="comm_sent.show_right_menu('+PartnerMessageid+');" onmouseleave="comm_sent.hide_right_menu('+PartnerMessageid+');">';

				html += '<td class="border_box_bottom span1 ms_uid1" onmouseover="comm_sent.show_chk_opt('+PartnerMessageid+');" onmouseout="comm_sent.hide_chk_opt('+PartnerMessageid+');">';
					html += '<div style="text-align:center;">'
							+'<div class="border_radius dp_img ms_img'+PartnerMessageid+'">'+initial1+initial2+'</div>'
							+'<div class="ms_chk_opt ms_chk'+PartnerMessageid+'" style="display: none;">'
							+'<input type="checkbox" class="myCheckBox" value="'+PartnerMessageid+'"/>'
							+'</div>';
						+'</div>';
				html += '</td>';

				html += '<td class="border_box_top span10 ms_line'+PartnerMessageid+'" onclick="comm_sent.show_msg_body('+PartnerMessageid+','+PartnerMessageid+');">';
					html += '<table><tr class="" style=""><td class="border_box_last" style="border:none;" ><div class="span12">';
					
						html += '<div class="span3" style="">';

							var onearr  = ''; var first = ''; var second = ''; var secondarr  = '';
							if(alld.first!=undefined && alld.first!=null){
								onearr = alld.first;
							}
							if(onearr.indexOf('<')==0){
								onearr = onearr.replace("<","");
					      		onearr = onearr.replace(">","");
					     		onearr = onearr.split("@");		
							} 
							else{
								onearr= onearr.split(" ");
							}

							if(alld.second!=undefined && alld.second!=null){
								secondarr =alld.second;
							}
							if(secondarr.indexOf('<')==0){
								secondarr = secondarr.replace("<","");
					      		secondarr = secondarr.replace(">","");
					     		secondarr = secondarr.split("@");		
							} 
							else{
								secondarr= secondarr.split(" ");
							}

							var first = onearr[0];
							var second = secondarr[0];
							
							var pname = UserFirstName;
							pname = pname.split(" ");
							pname = pname[0];
							
							if(first==pname){
								if(IsAdmin!='Y'){
									first = csn_td.me + ' ';
								}	
							
							}
							if(second==pname){
								if(IsAdmin!='Y'){
									second =  csn_td.me + ' ';
								}	
							
							}

							var hasdraft ='';
							var pmid1 = pmt.parent_message_id;
							if(alld.hasdraft!=0){
								var hasdraft = ',<span id="hasdraft'+pmid1+'" style="color:#d23f31"> '+csn_td.Draft+' </span>';
							}

							if(alld.getTotalCount !=-1 && alld.getTotalCount > 1){
								var namestr = first+', '+second+hasdraft;
									html += '<p id="a" style="width:100%;height:20px;overflow-y: hidden;" class="writer_name">'
									 +namestr;
								var a = parseInt(alld.getTotalCount);
								html += '<span style="color:#757575">('+a+')</span>';
							}
							else{
								var namestr = second+hasdraft;
								html += '<p id="a" style="width:100%;height:20px;overflow-y: hidden;" class="writer_name">'
									 +namestr;
							}
							html += '</p>';
						html += '</div>';

						html += '<div class="span9 msg_main">';
							html += '<span class="msg_sub">';
								html += StripTags(pmt.subject);
							html += '</span>';
							
							html += '&nbsp;-&nbsp;';

							html += '<span class="msg_body">';
								html += StripTags(decodeEntities(pmt.message));
							html += '</span>';
						html += '</div>';

					html += '</div></td></tr></table>';
				html += '</td>';

				html += '<td class="border_box span3" style="cursor: default;">';
					html += '<div class="msg_menu_right msg_menu_right'+PartnerMessageid+'" style="text-align: right; margin-right: 20px; display: none; ">';
						html += '<a class="round_btn_icon btn icn-only" href="javascript:;"  onclick="comm_sent.set_custom_reply('+PartnerMessageid+','+PartnerMessageid+',this);" data-title="Compose mail" data-toggle="tooltip" data-placement="top" title="Reply"><i class="icon-reply" style=""></i></a>';
					
						html += '<a class="round_btn_icon btn icn-only" onclick="comm_sent.delete_letter_email('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="Delete" ><i class="icon-trash" style=""></i></a>';

						html += '<div class="btn-group btn-ell pull-right" id="right-btn-ellipsis-'+PartnerMessageid+'" style="">';
							html += '<span data-close-others="true" data-delay="100" data-toggle="dropdown"><a style="margin: 0px 2px;" class="round_btn_icon btn icn-only" onclick="comm_sent.set_dropdown(event,'+PartnerMessageid+');"><i class="icon-ellipsis-vertical right-btn-icon-'+PartnerMessageid+'"></i></a></span>';
							html += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
							
								html += '<li><a class="" href="javascript:;" style="text-decoration:none;" onclick="comm_sent.set_custom_reply('+PartnerMessageid+','+PartnerMessageid+',this);"><i class="icon-reply" style="color:#000000"></i>&nbsp;'+csn_td.Reply+'</a></li>';
								html += '<li><a class="" onclick="ss_show_dkmodal_for_forward_last('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="'+csn_td.$fwd_hash+'" ><i class="icon-arrow-right" style=""></i>&nbsp;'+csn_td.$fwd_hash+'</a></li>';
								
								html += '<li><a class="" onclick="comm_sent.delete_letter_email('+PartnerMessageid+');"><i class="icon-trash" style="color:#000000"></i>&nbsp;'+csn_td.Delete+'</a></li>';
								
								if(htmldata[key].PartnerMessage.read == 0){
									html += '<li id="toggle_read_'+PartnerMessageid+'"><a class="" onclick="mark_as_unread('+PartnerMessageid+',\'makeread\');"><i class="icon-envelope-open-o" style="color:#000000"></i>&nbsp;'+csn_td.Markasread+'</a></li>';
								}
								else{
									html += '<li id="toggle_read_'+PartnerMessageid+'"><a class="" onclick="mark_as_unread('+PartnerMessageid+',\'makeunread\');"><i class="icon-envelope-o" style="color:#000000"></i>&nbsp;'+csn_td.Markasunread+'</a></li>';
								}

							html += '</ul>';
						html += '</div>';
					html += '</div>';
					var last_modified = moment(pm.last_modified).format('DD.MM.YY');
					html += '<div class="msg_menu_right_date'+PartnerMessageid+'" style="text-align: right; margin-right: 17px;">'+last_modified+'</div>';
				html += '</td>';

				html += '<tr class="ms_u ms_u'+PartnerMessageid+'"  style="display:none;" onclick="comm_sent.hide_msg_body('+PartnerMessageid+');">';
					html += '<td colspan="3" style="border:none;">';
				html += '</tr>';

				html += '<tr class="ms_m ms_m'+PartnerMessageid+'"  style="display:none;"><td colspan="3" style="border:none;">';
					html += '<div class="main_msg_box allSides" id="show_data">';
						html += '<div class="main_msg_sub">';
							html += '<span class="span9" onclick="comm_sent.hide_msg_body('+PartnerMessageid+');" >';
								html += '<h5>'+StripTags(pmt.subject)+'</h5>';
							html += '</span>';
							html += '<span class="span3" style="margin:10px 0px;text-align: right; float:right;">';
								var stext_id = pmt.id;
								var smsg_id = pm.id;
								html += '<a class="round_btn_icon btn icn-only" onclick="ss_show_dkmodal_for_forward_last('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="'+csn_td.$fwd_hash+'" ><i class="icon-reply" style=""></i></a>';

								html += '<a class="round_btn_icon btn icn-only" onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="'+csn_td.Reply+'" ><i class="icon-arrow-right" style=""></i></a>';
								
								html += '<a class="round_btn_icon btn icn-only" onclick="comm_sent.delete_letter_email('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="'+csn_td.Delete+'"><i class="icon-trash" style=""></i></a>';
								
								html += '<a class="round_btn_icon btn icn-only" onclick ="comm_sent.hide_msg_body('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="'+csn_td.Close+'"> <i class="icon-remove"></i></a>';
							html += '</span>';
							
							html += '<div style = "clear:both;"></div>';
						html += '</div>';
						html += '<div class="main_msg_body" id="msg_bd_'+PartnerMessageid+'"></div>';

						html += '<div style="" class="reply-msg"><table style="width:100%;"><tbody><tr>';
							html += '<td class="border_box_first" style="border:none; vertical-align: top !important;">';
								var email = '';
								if(pm.sender !='customer'){
									if(checkNull(pm.source_from)!=''){
									var email = pm.source_from.trim().split(" ");
									}
								}
								else{
									var email = pm.email.trim().split(" ");
								}
								if(email!=''){
									initial1 =''; initial2 ='';
									if(email[0]!=undefined){
										initial1 = email[0].substring(0,1).toUpperCase();
									}
									if(email[1]!=undefined){
										initial2 = email[1].substring(0,1).toUpperCase();
									}
									if(initial1=='<'){
										initial1 ='';
									}
									if(initial2=='<'){
										initial2 ='';
									}
								}
								html += '<div class="border_radius dp_img imgm'+PartnerMessageid+'">'+initial1+initial2+'</div>';
							html += '</td>';

							html += '<td class="border_box_last"  style="border:none;padding:0">';
								html += '<div class="reply-main">';
									html += '<div class="reply-header rpl'+PartnerMessageid+'" style="display: none;">';
										if(pm.sender !='customer'){
											if(checkNull(pm.source_from)!=''){
												html += '<div><b class="writer_name">'+pm.source_from+'</b></div>';
											}
										}
										else{
											if(checkNull(pm.email)!=''){
												html += '<div><b class="writer_name">'+pm.email+'</b></div>';
											}
										}
										html += '<div class="btn-group">';
											var custname ='';
											if(cust.name!= undefined && cust.name!=null){
												var custname = cust.name;
											}
											var sourceFromEmail = cust.name+'</b> < '+custname+' >';
											if(pm.sender !='customer'){
												//console.log('there');
												if(checkNull(pm.source_from)!=''){
													var sourceFrom = pm.email;
												}
											}
											else{
												if(checkNull(pm.email)!=''){
													var sourceFrom = pm.source_from;
												}
											}

											if(checkNull(sourceFrom)!=''){
												sourceFrom =sourceFrom.trim();
												if(sourceFrom.indexOf('<')==0){
													sourceFrom = sourceFrom.replace("<","");
													sourceFrom = sourceFrom.replace(">","").trim();
													sourceEmail = sourceFrom;
													sourceFrom = sourceFrom.trim().split("@"); 
													sourceName = sourceFrom[0];
													sourceFromEmail=' < '+sourceEmail+' >';
												}
												else{
													sourceFrom = sourceFrom.replace("<","&nbsp;");
													sourceFrom = sourceFrom.replace(">","&nbsp;");
													sourceFrom = sourceFrom.split("&nbsp;");
													sourceFrom2 = '';
													if(sourceFrom[1]!=null || sourceFrom[1]!=undefined){
														sourceFrom2 = sourceFrom[1];
													}
													sourceFromEmail = sourceFrom[0]+'</b> < '+sourceFrom2+' >';
													sourceName = sourceFrom[0];
													sourceEmail = sourceFrom2;
												}
											}
											
											
											html += '<div class="btn mini" onmouseover="event.stopPropagation();" style="background-color: #fff !important; padding-left: 0px;" data-toggle="dropdown">'+csn_td.To+'&nbsp;<b class="writer_name">'+sourceFromEmail+'</b>&nbsp;&nbsp;<i class="icon-caret-down"></i></div>';
												html += '<ul class="dropdown-menu pull-right" style="width:200px;">';
													html += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-reply reply-btn"></i>&nbsp;'+csn_td.Reply+'</a></li>';
													html += '<li><a onclick="show_dkmodal_for_forward_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-arrow-right reply-btn"></i>&nbsp;'+csn_td.$fwd_hash+'</a></li>';
													html += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+csn_td.Editrecipients+'</a></li>';
													html += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+csn_td.Editsubject+'</a></li>';
												html += '</ul><div style="clear:both;"></div>';
											html += '</div>'
										html += '</div>';

										html += '<form action="/bookingengine/bkengine/frm_msg'+PartnerMessageid+'s/inbox2" class="form-vertical login-form frm'+PartnerMessageid+'" id="frm_msg'+PartnerMessageid+'" rowno="'+PartnerMessageid+'" name="frm_activity_list'+PartnerMessageid+'" style="margin: 0px;" onsubmit="event.returnValue = false; return false;" method="post" accept-charset="utf-8"><div style="display:none;"><input name="_method" value="POST" type="hidden"></div>';
											html += '<div class="reply-body" style="margin-top:10px;">';
												var pmid = pm.parent_message_id;
												html += '<textarea name="textarea[]" style="height:50px; border:none;" placeholder="'+csn_td.Reply+'..." id="TemplateContent'+PartnerMessageid+'" class="m-wrap span12" onclick="comm_sent.reply_body_msg_show_tpl('+PartnerMessageid+','+pmid+');"></textarea></br>';
												html += '<div class="reply-body-btn-'+PartnerMessageid+'" style="display:none;">';
													html += '<div class="inbox-compose-attachment" style="padding-left: 0px;" >';
													html += '<table role="presentation" class="table table-striped" id="table-striped_'+PartnerMessageid+'" ><tbody class="files"></tbody></table>';
												html += '</div>';

												html += '<script id="template-upload" type="text/x-tmpl">';
													html += '{% for (var i=0, file; file=o.files[i]; i++) { %}';
													html += '<tr class="template-upload fade">';
														html += '<td class="preview" width="10%"><span class="fade"></span></td>';
														html += '<td class="name" width="30%"><span>{%=file.name%}</span></td>';
														html += '<td class="size" width="40%"><span>{%=o.formatFileSize(file.size)%}</span></td>';
														html += '{% if (file.error) { %}';
															html += '<td class="error" width="20%" colspan="2"><span class="label label-important">Error</span> {%=file.error%}</td>';
														html += '{% } else if (o.files.valid && !i) { %}';
														html += '<td><div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div></td>';
														html += '{% } else { %}<td colspan="2"></td>{% } %}';
														html += '<td class="cancel" width="10%">{% if (!i) { %}{% } %}</td>';
													html += '</tr> {% } %}';
												html += '<\/script>';
												
												html += '<script id="template-download" type="text/x-tmpl">';
													html += '{% for (var i=0, file; file=o.files[i]; i++) { %}';
														html += '<tr class="template-download fade">';
															html += '{% if (file.error) { %}';
																html += '<td width="10%"></td>';
																html += '<td class="name" width="30%"><span>{%=file.name%}</span></td>';
																html += '<td class="size" width="40%"><span>{%=o.formatFileSize(file.size)%}</span></td>';
																html += '<td class="error" width="30%" colspan="2"><span class="label label-important">Error</span>'; 
																html += '{%=file.error%}';
																html += '</td>';
															html += '{% } else { %}';
																html += '<td class="preview" width="10%">';
																html += '{% if (file.thumbnail_url) { %}';
																	html += '<a class="" data-rel="" href="{%=file.url%}" title="{%=file.name%}">';
																	html += '<img src="{%=file.thumbnail_url%}">';
																	html += '</a>';
																html += '{% } %}</td>';
																html += '<td class="name" width="30%">';
																	html += '<a href="{%=file.url%}" title="{%=file.name%}" data-gallery="{%=file.thumbnail_url&&\'gallery\'%}" download="{%=file.name%}">{%=file.name%}</a>';
																html += '</td>';
																html += '<td class="size" width="40%"><span>{%=o.formatFileSize(file.size)%}</span></td>';
																html += '<td colspan="2"></td>';
															html += '{% } %}';
															html += '<td class="delete" width="10%">';
																html += '<button class="btn mini" data-type="{%=file.delete_type%}" data-url="{%=file.delete_url%}"{% if (file.delete_with_credentials) { %} data-xhr-fields=\'{"withCredentials":true}\'{% } %}><i class="icon-remove"></i></button>';
															html += '</td>';
														html += '</tr>';
													html += '{% } %}';
												html += '<\/script>';

												html += '<div>';
													var formurl = base_url+'communication/send_reply_mail';
													var mpmid = pm.id;

													html += '<button class="btn blue sssend" style="float:left; margin-right:5px;" onclick=\'comm_sent.ss_send_reply_mail('+PartnerMessageid+',\"draft\",\"\",\"yes\");\'><i class="icon-check"></i>&nbsp;'+csn_td.Send+'</button>';

													html += '<button class="btn red ssdiscard" style="float:left; margin-right:5px;" onclick="comm_sent.reply_body_msg_hide_tpl('+PartnerMessageid+');">'+csn_td.Discard+'</button>';

													html += '<span style="font-size: 20px; background-color: white; height: 20px; width: 15px;"  class="btn fileinput-button"><span style="transform: rotate(45deg); display: block;"><i class="icon-paper-clip"></i></span><input type="file" name="files[]" id="files" class="files'+PartnerMessageid+'" ></span>';

													html += '<div id="editorPlace'+PartnerMessageid+'" style="float:left; width:70%;"><i class="icon-circle draft_progress" style="float:right;color:#d23f31;margin-top: 12px;"></i><i class="icon-ok draft_complete" style="display:none;float:right;color:green;margin-top: 12px;"></i></div>';
													html += '<div style="clear:both;"></div>';
													html += '<input type="hidden" name="reply_msg_body'+PartnerMessageid+'" id="reply_msg_body'+PartnerMessageid+'" value="">';
													html += '<input type="hidden" name="field_id[]" class="field_id" value="">';
													html += '<input type="hidden" name="request_from'+PartnerMessageid+'" id="request_from'+PartnerMessageid+'" value="inbox">';
													var sub =  pmt.subject;
													html += '<input type="hidden" id="msg_sub_'+PartnerMessageid+'" name="msg_sub_'+PartnerMessageid+'" value="'+sub+'" >';
													html += '<input type="hidden" id="msg_id_'+PartnerMessageid+'" name="msg_id_'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
													var cust_email = '';
												
													if("sourceEmail" in window && checkNull(sourceEmail) != ''){
														cust_email = sourceEmail;
													}
													else{
														cust_email = cust.email;
													}
													var cust_name = '';
												
													if("sourceName" in window && checkNull(sourceName) != ''){
														cust_name = sourceName;
													}
													else{
														cust_name = cust.name;
													}

													html += '<input type="hidden" id="cust_email_'+PartnerMessageid+'" name="cust_email_'+PartnerMessageid+'" value="'+cust_email+'" >';
												
													html += '<input type="hidden" id="cust_name_'+PartnerMessageid+'" name="cust_name_'+PartnerMessageid+'" value="'+cust_name+'" >';
													html += '<input type="hidden" id="cust_id_'+PartnerMessageid+'" name="cust_id_'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
													html += '<input type="hidden" id="cust_con_id_'+PartnerMessageid+'" name="cust_con_id_'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
													html += '<input type="hidden" id="last_msg_text_id_'+PartnerMessageid+'_'+PartnerMessageid+'" >';
													html += '<input id="final_attachments'+PartnerMessageid+'" type="hidden" value="" name="final_attachments'+PartnerMessageid+'">';
													html += '<input id="from_inbox'+PartnerMessageid+'" type="hidden" value="inbox" name="from_inbox'+PartnerMessageid+'">';

													if(htmldata[0].PartnerMessage.sender!='customer'){
														html += '<input id="reply_from_'+PartnerMessageid+'" type="hidden" value="'+pm.source_from+'" name="reply_from_'+PartnerMessageid+'">';
													}
													else{
														html += '<input id="reply_from_'+PartnerMessageid+'" type="hidden" value="'+pm.email+'" name="reply_from_'+PartnerMessageid+'">';
													}
													html += '<input id="group_'+PartnerMessageid+'" type="hidden" value="'+pm.group_id+'" name="group_'+PartnerMessageid+'">';
												html += '</div>';
											html += '</div>';
										html += '</form>';
									html += '</div>';
								html += '</div>';
							html += '</td>';
						html += '</tr></tbody></table></div>';
					html += '</div>';
				html += '</td>';
			html += '</tr>';
		}
		if(html==''){
			$('#sorting_product_sent').after('<div class="alert inboxend alert-info" style="text-align:center;">'+csn_td.YourSentitemlistingisempty+'</div>');
			$("#loadmoreemail").remove();
		}
		else{
			$('#sorting_product_sent').append(html);
			var next_page = parseInt($('#next_page').val());
			var total_records = parseInt($('#total_records').val());
			if(total_records!=0 && next_page!=0){
				next_page = next_page - 1;
				if(screen.height > 1200){
					var rem = total_records - (next_page * 28);
				}
				else{
					var rem = total_records - (next_page * 15);
				}
				if(rem > 1){
					var c = csn_td.$more_emails_to;
					c  = c.replace('%count%',rem);
				}
				else{
					var c = csn_td.$more_email_to;
					c  = c.replace('%count%',rem);
				}
				$('#loadmoreemail').remove();
				var html = '<div id="loadmoreemail"><div class="row-fluid text-center">'+c+'</div>';
				$('.portfolio-block').after(html);
			}
			else{
				$('#loadmoreemail').remove();
				$('.portfolio-block').after('<div id="loadmoreemail"><div class="row-fluid text-center">'+csn_td.$no_more_email+'</div>');
			}
		}
	},
	show_hide_msg_thread:function(row_id,thread_id,yes=''){
		if($('.bd_resp_'+row_id+'_'+thread_id).is(":hidden")){
			$('.slr_rcv_'+row_id+'_'+thread_id).show();
			$('.slr_txt_'+row_id+'_'+thread_id).hide();
			$('.bd_resp_'+row_id+'_'+thread_id).show();
		}
		else{
			$('.slr_rcv_'+row_id+'_'+thread_id).hide();
			$('.slr_txt_'+row_id+'_'+thread_id).show();
			$('.bd_resp_'+row_id+'_'+thread_id).hide();
		}	
		if(yes=='yes'){
			$('#msg_bd_'+row_id+' div.mgs_sub_list').show();
			$('#msg_bd_'+row_id+' div.c_count').hide();
			setTimeout(function(){
				var offsetdiv = $('#mgs_sub_list_row'+row_id+thread_id+thread_id);
				if(offsetdiv==undefined){
					offsetdiv = 0;
				}
				if(parseInt(offsetdiv)==0){
					var a = $('#mgs_sub_list_row'+row_id+row_id+row_id).offset().top;
					if(a==undefined){
						a=0;
					}
					$('body,html').animate({ scrollTop:a },'slow');
				}
				else{ 
				var b = $('#mgs_sub_list_row'+row_id+thread_id+thread_id).offset().top;
				if(b==undefined){
						b=0;
					}
					$('body,html').animate({ scrollTop:b }, 'slow');
				}
			},200);			
		}
	},
	hide_msg_body:function(id){
		$('.ms_u').hide();	
		$('.ms_m').hide();	
		$('.ms_l').hide();
		$('.ms').show();
		
		$('.ms_u'+id).hide();	
		$('.ms_m'+id).hide();	
		$('.ms_l'+id).hide();	
		$('.ms'+id).show();
		//for reset reply input		
		var editor = CKEDITOR.instances['TemplateContent'+id];
			if(editor){	
				editor.destroy(true);
				}
		$('#TemplateContent'+id).val('');		
		$('.reply-body-btn-'+id).hide();
		$('.rpl'+id).hide();
		$('.imgm'+id).hide();		
		
		$('#frm_msg'+id+' #table-striped_'+id+' .files').children().children('.delete').children('.btn').click();	
		var data_len = $('#attachments').val();
		if(data_len.length == 2){
			$('#table-striped_'+id+' .files').html('');
		}
	},
	reply_body_msg_show_tpl:function(id,parent_message_id,removelocal='yes',message='',attachments=''){
		$('.ms_m'+id+' .reply-msg').css('background',"none");
		$('.main_msg_box').css('padding',"2% 0");
		$('#frm_msg'+id+' #table-striped_'+id+' .files').children().children('.delete').children('.btn').click();
		var data_len = $('#attachments').val();
		if(data_len.length == 2){
			$('#table-striped_'+id+' .files').html('');
		}
		var ss_lang = $('#lang').val();
	  	if(ss_lang=='nb'){
	    	var ss_ck_lang = 'no';
	  	}
	  	else{
	    	var ss_ck_lang = 'en';
	  	}
		CKEDITOR.replace('TemplateContent'+id,{
			uiColor: 'FFFFFF', 
			height:['100px'],
			enterMode: CKEDITOR.ENTER_BR,
			language:ss_ck_lang,
			removePlugins: 'elementspath,magicline',
			startupFocus : true,
			sharedSpaces: {
							top: 'editorPlace'+id,
						},
			toolbar: [
					{ name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
					{ name: 'colors', items : [ 'TextColor','BGColor' ] },
					{ name: 'basicstyles', items : [ 'Bold','Italic','Underline' ] },
					{ name: 'paragraph', items : [ 'NumberedList','BulletedList' ] },
					{ name: 'links', items : [ 'Link','Unlink','Anchor','RemoveFormat' ] },
				],
			removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar,About'			
		});
		
		//CKEDITOR.config.extraPlugins = 'sharedspace,panel,floatpanel,button,colorbutton,listblock,richcombo,font,dialog,dialogui,clipboard,autolink';	
		CKEDITOR.config.coreStyles_bold = { element: 'b', overrides: 'strong' };
		CKEDITOR.config.coreStyles_italic = { element : 'i', overrides : 'em' };
		CKEDITOR.config.sharedSpaces = { top: 'editorPlace'+id };
		CKEDITOR.instances['TemplateContent'+id].on('instanceReady', function(){ 
			var ckeditor = CKEDITOR.instances['TemplateContent'+id];
	      ckeditor.dataProcessor.writer.lineBreakChars = '\r\n';
			if(removelocal=='yes'){
				localStorage.removeItem('draftids');
			}
			$('#table-striped_'+id+'>tbody').html('');
			if(attachments!=''){
				//var file = attachments;
				var attachmentss = JSON.stringify(attachments);
				$('#final_attachments'+id).val(attachmentss);
				var addHtml= '';
				
				for(var file in attachments){
					addHtml += '<tr class="template-download fade in"><td width="10%" class="preview">';
					if(attachments[file].thumbnail_url != undefined){
						addHtml += '<a title="'+attachments[file].orig_name+'" href="'+attachments[file].url+'" data-rel="" class=""><img src="'+attachments[file].thumbnail_url+'"></a>';
					}
					else{
					
					}
					var delete_url = $('#APISERVER').val()+'api/search/uploadCustomMailLogoComm.json?file='+encodeURI(attachments[file].file_name);
					addHtml += '</td><td width="30%" class="name">';
					addHtml += '<a download="'+attachments[file].orig_name+'" data-gallery="gallery" title="'+attachments[file].orig_name+'" href="'+attachments[file].url+'">'+attachments[file].orig_name+'</a></td>';
					addHtml += '<td width="40%" class="size"><span>'+formatFileSize(attachments[file].size)+'</span></td><td colspan="2"></td>';
					addHtml += '<td width="10%" class="delete">'; 
					addHtml += '<button data-url="'+delete_url+'" onClick="comm_sent.set_reply_msg('+id+',"draft",'+parent_message_id+');"  data-type="DELETE" class="btn  mini"><i class="icon-remove"></i></button></td></tr>';     						
				}
					
				
				
				$('#table-striped_'+id+'>tbody').html(addHtml);
			}
			if(message!=''){
				//CKEDITOR.instances['TemplateContent'+id].setData('');
				CKEDITOR.instances['TemplateContent'+id].setData(message);
			}
			else{
				if(staff_signature!=''){
					CKEDITOR.instances['TemplateContent'+id].setData('<div><br><br></div>'+staff_signature);
				}
			}
			var timeouts = [];
			comm_sent.bind_upload_inbox(id);
			CKEDITOR.instances['TemplateContent'+id].on('key', function(evt) {
				var charCode  = '';
				if(evt.data!=undefined && evt.data!=null){
					if(evt.data.keyCode!=undefined && evt.data.keyCode!=null){
						charCode = evt.data.keyCode;
					}
				}
	      		if(charCode==27){
	      			comm_sent.reply_body_msg_hide_tpl(id);
	      		}

	      	});
	      	comm_sent.set_reply_msg(id,'draft',parent_message_id);
			CKEDITOR.instances['TemplateContent'+id].on('change', function(e) {
				$('.draft_progress').show();
				$('.draft_complete').hide();
				$('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
				for (var i = 0; i < timeouts.length; i++) {
	    		clearTimeout(timeouts[i]);
				}
				timeouts = [];
				if(localStorage.getItem('draftids')!=null){
					timeouts.push(
						setTimeout(function(){
							comm_sent.set_reply_msg(id,'draft',parent_message_id); 
						}, 500)
					);
				}
				else{
					//set_reply_msg(id,'draft',parent_message_id);
				}
				
			});
			
			$('.files'+id).on('change', function(e) {
				$('.draft_progress').show();
				$('.draft_complete').hide();
				$('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
				for (var i = 0; i < timeouts.length; i++) {
	    		clearTimeout(timeouts[i]);
				}
				timeouts = [];
				if(localStorage.getItem('draftids')!=null){
					timeouts.push(
						setTimeout(function(){
							comm_sent.set_reply_msg(id,'draft',parent_message_id); 
						}, 5000)
					);
				}
				else{
					//set_reply_msg(id,'draft',parent_message_id);
				}
			});
			
			$('#table-striped_'+id).bind('DOMNodeInserted DOMNodeRemoved',function(){
				$('.draft_progress').show();
				$('.draft_complete').hide();
				$('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
				for (var i = 0; i < timeouts.length; i++) {
	    		clearTimeout(timeouts[i]);
				}
				timeouts = [];
				if(localStorage.getItem('draftids')!=null){
					timeouts.push(
						setTimeout(function(){
							comm_sent.set_reply_msg(id,'draft',parent_message_id); 
						}, 500)
					);
				}
				else{
					//set_reply_msg(id,'draft',parent_message_id);
				}
			});
		});

		$('.reply-body-btn-'+id).show();
		$('.rpl'+id).show();
		$('.imgm'+id).show();

	},
	bind_upload_inbox:function(id){	
		var id = parseInt(id);

		var attached_array = [];
		$("#frm_msg"+id).fileupload({
		    // Uncomment the following to send cross-domain cookies:
		    //xhrFields: {withCredentials: true},
		    //url: '/plugins/jquery-file-upload/server/php/',
			//formData: {script: true},
		    acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|txt|doc|docx|xlsx|xls|pdf|zip)$/i,
		    url: APISERVER+'/api/search/uploadCustomMailLogoComm.json?admin_id='+admin_id+'&partner_id='+partner_id,
		  
		    autoUpload: true,
		    maxFileSize:7000000,
			//sequentialUploads: true,
			add: function (e, data) {
				var ret = 0;
	            for(var j in data.files){
	                if(data.files[j].error!=''){
	                    ret = 1;
	                    break;
	                }
	                else{
	                    ret = 0;
	                }
	            }
	            if(ret==1){
	                showAlertMessage($('#ftobg').val(),'error');
	                return;
	            }
				$('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
				var addHtml = '';
				var jqXHR = data.submit()
			    .success(function (result, textStatus, jqXHR) {  
					var str = this.form[0].id; 
					var row_id = str.replace("frm_msg", "");
					
					$.each(result.response.response.files, function (index, file) {	
						attached_array.push(file);
						addHtml += '<tr class="template-download fade in"><td width="10%" class="preview">';
						if(file.thumbnail_url != undefined){
							addHtml += '<a title="'+file.orig_name+'" href="'+file.url+'" data-rel="" class=""><img src="'+file.thumbnail_url+'"></a>';
						}
						addHtml += '</td><td width="30%" class="name">';
						addHtml += '<a download="'+file.orig_name+'" data-gallery="gallery" title="'+file.orig_name+'" href="'+file.url+'">'+file.orig_name+'</a></td>';
						addHtml += '<td width="40%" class="size"><span>'+formatFileSize(file.size)+'</span></td><td colspan="2"></td>';
						addHtml += '<td width="10%" class="delete">'; 
						addHtml += '<button data-url="'+file.delete_url+'" data-type="DELETE" class="btn  mini"><i class="icon-remove"></i></button></td></tr>';     						
					});
					$('.table-striped#table-striped_'+row_id+' .files').append(addHtml);
					
					$('#final_attachments'+id).val(JSON.stringify(attached_array));
				
				 })
				.error(function (jqXHR, textStatus, errorThrown) {})
				.complete(function (result, textStatus, jqXHR) {					
					$('#progress').hide();
					$('.draft_progress').hide();
					$('.draft_complete').show();
					$('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
				});
			},
			progressstart: function (e, data) {
				$('#progress').show();
			},
			progressall: function (e, data) {
				$('#progress').show();
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#progress .bar').css(
					'width',
					progress + '%'
				);
			},
		});

		$("#frm_msg"+id).bind('fileuploaddestroy', function (e, data) {
			json_arr = $('#attachments'+id).val();
			delete_url = data.url;
			if(json_arr!=undefined){
				arr = JSON.parse(json_arr);
			}
			else{
				arr = [];
			}
			var j_arr = removeItemhead(arr, 'delete_url', delete_url);
			attached_array = j_arr;
			$('#final_attachments'+id).val(JSON.stringify(attached_array));
			
		});
	},
	set_reply_msg:function(lineID,draft='',parent_message_id='',sendmail='no'){
		var body = CKEDITOR.instances['TemplateContent'+lineID].getData();
		$('#reply_msg_body'+lineID).val(body);
		$('.field_id').val(lineID);

		if(draft==''){
			comm_sent.ss_send_reply_mail(lineID,'',parent_message_id,sendmail);
		}
		else if(draft=='draft'){
			comm_sent.ss_send_reply_mail(lineID,'draft',parent_message_id,sendmail);
		}

	},
	ss_send_reply_mail:function (lineID,draft='',parent_message_id='',sendmail){
	
		var APISERVER = $('#APISERVER').val();
		var token = $('#token').val();
		var language = $('#language').val();
		if(parent_message_id!=''){
			parent_message_id = parseInt(parent_message_id);
		}
		var partner_id = $('#partner_id').val();
		var mailbody = $('#reply_msg_body'+lineID).val();
		if(mailbody==undefined || mailbody==null){
			mailbody ='';

		}
		var mailbody1 ='';
		if(mailbody!=''){
			mailbody1 = StripTags(mailbody);
		}

		$('.ms_line'+lineID+' .msg_body').html(mailbody1);

		var mail_subject = $('#msg_sub_'+lineID).val(); 

		var msg_id = $('#msg_id_'+lineID).val();

		var cust_email1 = $('#cust_email_'+lineID).val();
		var cust_name =  $('#cust_name_'+lineID).val();

		var reply_from = $('#reply_from_'+lineID).val();
		var cust_id = $('#cust_id_'+lineID).val();
		var cust_con_id = $('#cust_con_id_'+lineID).val();
		 
		var request_from = $('#request_from'+lineID).val();
		if(request_from==undefined || request_from==null){
			request_from ='';
		}
		var request_from_cust = $('#request_from_cust'+lineID).val(); 
		var from_inbox = $('#from_inbox'+lineID).val();
		var attachments = $('#final_attachments'+lineID).val(); 
		attachments = escape(attachments);
		var cust_email = new Array(); 
		var sender = loginType;
		if(from_inbox != 'inbox'){
			if(cust_con_id!='' && cust_con_id!=null && cust_con_id!=undefined){
				cust_email.push(cust_id+'##'+cust_con_id+'##'+cust_email1);
			}
			else if(cust_id!='' && cust_id!=null && cust_id!=undefined){
				cust_email.push(cust_id+'##'+cust_email1);
			}
			else{
				showAlertMessage(array,'error',csn_td.alertmessage);
				return;
			}
		}else{
			if(cust_con_id!='' && cust_con_id!=null && cust_con_id!=undefined){
				cust_email.push(cust_id+'##'+cust_con_id+'##'+cust_email1);
			}
			else if(cust_id!='' && cust_id!=null && cust_id!=undefined){
				cust_email.push(cust_id+'##'+cust_email1);
			}
		}
		
		var cname = new Array();
		var cust_email_1 = $('#cust_email_'+lineID).val();

		var ss_group_id = $('#group_'+lineID).val(); 

		var a = cust_email_1.lastIndexOf('#');
	  if(a!=-1){        
	    cust_email_1 =  cust_email_1.substr(a+1,cust_email_1.length);
	  }
		var obj = {};
		obj[cust_email_1] = cust_name.trim();
	  cname.push(obj);
	  cname = JSON.stringify(cname);

		cust_email = JSON.stringify(cust_email);

			var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:cust_email,customer_name:cname,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,group_id:ss_group_id};
			var whereto = '';

			if(draft==''){
				whereto = 'sendCommunicationCustomEmail';
				
			}
			else if(draft=='draft'){
					whereto = 'saveToDraftonChange';
					if(localStorage.getItem('draftids')!=null){
						var getdraftids = JSON.parse(localStorage.getItem('draftids'));
						var partner_message_text_id = getdraftids.partner_message_text_id;
						var partner_message_id = getdraftids.partner_message_id;
						
						if(partner_message_text_id!=null && partner_message_text_id!=undefined && partner_message_text_id!=''){
							whereto ='updateDraftOnChange';
							if(sendmail=='no'){
								var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:cust_email,customer_name:cname,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail,group_id:ss_group_id};

						
							}
							else if(sendmail=='yes'){
									var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:cust_email,customer_name:cname,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail,group_id:ss_group_id};
							}
						}
					}
					

			}
			var stf_id = $('#staffer_id').val();
			params.staffer_id = stf_id;
		
		
				$.ajax({
				    type: 'POST',
				    url: APISERVER+'/api/PartnerMessages/'+whereto+'.json',
				    data: params,
				    async: true,
				    dataType : "json",
				    success: function(data,status,xhr){
				    	$('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
				    	 data.response.status = is_undefined(data.response.status);
							if(data.response.status == 'success'){
								if(whereto=='saveToDraftonChange'){
									var getThreadDetails = data.response.response.getThreadDetails;
									var one = '';
										var sFrom =  checkNull(getThreadDetails.PartnerMessage.source_from);
										if(sFrom.indexOf("<")==0){
											sFrom = sFrom.replace("<","");
											sFrom = sFrom.replace(">","");
											sFrom = sFrom.trim().split("@");
											sFrom = sFrom[1];
										}
										else{
											sFrom = sFrom.replace("<","&nbsp;");
											sFrom = sFrom.replace(">","&nbsp;");
											sFrom = sFrom.split("&nbsp;");
											sFrom = sFrom[0];
											sFrom = sFrom.split(" ");
											sFrom = sFrom[0];
										}
										var IsAdmin1 = IsAdmin;
										one = sFrom+', ';
										if(IsAdmin1!='Y'){	
											one =	csn_td.me+', ';
										}

										var two =  getThreadDetails.PartnerMessage.email;
										if(two.indexOf("<")==0){
											two = two.replace("<","");
											two = two.replace(">","");
											two = two.trim().split("@");
											two = two[0];
										}
										else{
											two = two.replace("<","&nbsp;");
											two = two.replace(">","&nbsp;");
											two = two.split("&nbsp;");
											two = two[0];
											two = two.split(" ");
											two = two[0];
										}
										var three ='';
										if(getThreadDetails.hasdraft!=0){
											var three = ', <span style="color:#d23f31">'+csn_td.Draft+' </span>';
										}
										var four = '('+getThreadDetails.getTotalCount+')';
										
										var string = one+two+three+four;
										var pmid = getThreadDetails.PartnerMessage.parent_message_id;
										pmid = parseInt(pmid);
										$('.ms_line'+pmid+ ' p.writer_name:first').html(string);
										
								}
								if(draft!='draft'){
									call_toastr('success', csn_td.Success,data.response.response.success);
									ssAppendNewThreadinbox(data.response.response.getThreadDetails,'','','');
								}
								else if(draft=='draft' && sendmail=='no'){
									var check = localStorage.getItem('draftids');
									$('.draft_progress').hide();
									$('.draft_complete').show();
									if(data.response.response.partner_message_text_id && data.response.response.partner_message_id && check==null){
											var pmid = data.response.response.partner_message_text_id;
											var pmi = data.response.response.partner_message_id;
											var draftids = {partner_message_text_id:pmid,partner_message_id:pmi};
											draftids = JSON.stringify(draftids);
											localStorage.setItem('draftids',draftids);
									}							
								}
								else if(draft=='draft' && sendmail=='yes'){
										$('.draft_progress').hide();
										$('.draft_complete').hide();
										$('.ms_m'+lineID+' .reply-msg').css('background',"#efefef");
										$('.main_msg_box').css('padding',"2% 0 0");
										$(document.activeElement).blur(); 
										if(data.response.response.message!=undefined && data.response.response.message!=null ){
											var msg  = data.response.response.message;
										}
										else{
											var msg  = data.response.response.success;
										}
										call_toastr('success',csn_td.Success,msg);
										ssAppendNewThreadinbox(data.response.response.getThreadDetails,'','','');
								}
							}
							else if(data.response.status=='error'){
								if(data.response.response.error == 'validationErrors'){
									var mt_arr = data.response.response.list;
									var array = $.map(mt_arr, function(value, index) {
										return value+'<br />';
									});
									showAlertMessage(array,'error',csn_td.alertmessage);
									return;
								}else{
									showAlertMessage(data.response.response.msg,'error',csn_td.alertmessage);
									return;
								}
							}
				    },
				    error: function(xhr, status, error){
				    	$('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
				    	if(data.response.response.error == 'validationErrors'){
							var mt_arr = data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error',csn_td.alertmessage);
							return;
						}else{
							showAlertMessage(data.response.response.msg,'error',csn_td.alertmessage);
							return;
						}
				    	return ;
				   	}
				});
	},
	show_sub_list_thread:function(mid,lid,msg_id){
		$('#msg_bd_'+mid+' div.mgs_sub_list:last').attr('style','border-top: 1px solid #e0e0e0;');
		$('.mgs_sub_list').show();
		$('.c_count').hide();
	},
 	reply_body_msg_hide_tpl:function(id){
		var draftids = localStorage.getItem('draftids');
		if(draftids!=null || draftids!=undefined){
			draftids = JSON.parse(draftids);
			partner_message_id = draftids.partner_message_id;
			comm_sent.ss_delete_trash1(id,partner_message_id);
			
		}
		$('.ms_m'+id+' .reply-msg').css('background',"#efefef");
		$('.main_msg_box').css('padding',"2% 0 0");
		$('#frm_msg'+id+' #table-striped_'+id+' .files').children().children('.delete').children('.btn').click();
		var data_len = $('#attachments').val();
		if(data_len.length == 2){
			$('#table-striped_'+id+' .files').html('');
		}
		var editor = CKEDITOR.instances['TemplateContent'+id];
			if(editor){	
					editor.destroy(true);
			}
		$('#TemplateContent'+id).val('');
		$('.reply-body-btn-'+id).hide();
		$('.rpl'+id).hide();
		//$('.imgm'+id).hide();
		$(document.activeElement).blur(); 
	},
	ss_delete_trash1:function(parent_message_id,message_id){
		if(parent_message_id!=''){
			parent_message_id = parseInt(parent_message_id);
		}
		if(message_id!=''){
			message_id = parseInt(message_id);
		}

		var APISERVER = $('#APISERVER').val();
		var token = $('#token').val();
		var language = $('#language').val();
		var partner_id = $('#partner_id').val();
		var staffer_id = $('#staffer_id').val();

		var total_params = 'token='+token+'&partner_id='+partner_id+'&parent_message_id='+parent_message_id+'&message_id='+message_id+'&staffer_id='+staffer_id;

		var data = passProdRequest(APISERVER+'/api/PartnerMessages/ssDeleteDraft.json',total_params);

		if(data == undefined){
			var json_data = $('#json_data').val();
			var data = JSON.parse(json_data);
			data.response.status = is_undefined(data.response.status);
			if(data.response.status == 'success'){
				var string ='';
				var pmid;
				var getThreadDetails = data.response.response.getThreadDetails;
				string = getThreadDetails.onethread;
				pmid = parseInt(getThreadDetails.pmid);
				var msg_body = getThreadDetails.message;
				msg_body = StripTags(msg_body);
				$('.ms_line'+pmid+ ' div.msg_body').html(msg_body);
				if(getThreadDetails.PartnerMessage!=undefined && getThreadDetails.PartnerMessage!=null && getThreadDetails.PartnerMessage!=''){
					var sFrom =  checkNull(getThreadDetails.PartnerMessage.source_from);
					if(sFrom.indexOf("<")==0){
						sFrom = sFrom.replace("<","");
						sFrom = sFrom.replace(">","");
						sFrom = sFrom.split("@");
						sFrom = sFrom[0].trim();
					}
					else{
						sFrom = sFrom.replace("<","&nbsp;");
						sFrom = sFrom.replace(">","&nbsp;");
						sFrom = sFrom.split("&nbsp;");
						sFrom = sFrom[0];
						sFrom = sFrom.split(" ");
						sFrom = sFrom[0];
					}
					
				
				
				
					
					var two =  getThreadDetails.PartnerMessage.email;
					if(two.indexOf("<")==0){
						two = two.replace("<","&nbsp;");
						two = two.replace(">","&nbsp;");
						two = two.split("&nbsp;");
						two = two[1];
						two = two.trim().split("@");
						var two = two[0];
					}
					else{
						two = two.replace("<","&nbsp;");
						two = two.replace(">","&nbsp;");
						two = two.split("&nbsp;");
						two = two[0];
						two = two.split(" ");
						var two = two[0];
					}
					var pname = UserFirstName;
					pname = pname.split(" ");
					pname = pname[0];
			
					if(one==pname){
						if(IsAdmin!='Y'){
							one = csn_td.me +' ';
						}	
					
					}
					if(two==pname){
						if(IsAdmin!='Y'){
							two = csn_td.me +' ';
						}	
					
					}
					var one = sFrom+ ', ';
					var three ='';
					if(getThreadDetails.hasdraft!=0){
						var three = ', <span style="color:#d23f31">'+csn_td.Draft+' </span>';
					}
					var four = '<span style="color:#757575"> ('+getThreadDetails.getTotalCount+')</span>';
					
					string = one+two+three+four;
					pmid = getThreadDetails.PartnerMessage.parent_message_id;
					if(pmid==0){
						pmid = getThreadDetails.PartnerMessage.id;	
					}
					pmid = parseInt(pmid);
					
				}
				else{
					string = getThreadDetails.onethread;
					pmid = parseInt(getThreadDetails.pmid);
					var msg_body = getThreadDetails.message;
					msg_body = StripTags(msg_body);
					$('.ms_line'+pmid+ ' div.msg_body').html(msg_body);
				}
				localStorage.removeItem('draftids');

				$('#mgs_sub_list_row'+parent_message_id+message_id+message_id).remove();
				$('#msg_bd_'+pmid+' .mgs_sub_list').show();
				$('#msg_bd_'+pmid+' .c_count').hide();
				$('.ms_line'+pmid+ ' p.writer_name:first').html(string);
		
			}
			else if(data.response.status == 'error'){
				if(data.response.response.error == 'validationErrors'){
					var mt_arr = data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',csn_td.alertmessage);
					return;
				}
				else{
					showAlertMessage(data.response.response.msg,'error',csn_td.alertmessage);
					return;
				}	
			}
		}
	}


}


