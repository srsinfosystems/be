<?php 
$actionButtons = $this->element('Bkengine.communication_inbox_list_breadcrum_button', array('cache' => false));?>
<?php echo $this->element('Bkengine.custom_page_header', array('cache' => false,'actionButtons' => $actionButtons,));?>

<?php   echo $this->Session->flash(); ?>
<script>

$('body,html,.page-container').attr('style','height:'+screen.height+'px !important');
function show_chk_opt(mid){
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
}

function hide_chk_opt(mid){
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
}

function show_right_menu(cl){
		$('.msg_menu_right'+cl).show();
		$('.msg_menu_right_date'+cl).hide();
		$('#right-btn-ellipsis-'+cl).removeClass('dropup');
}	
	
function hide_right_menu(cl){
		$('.msg_menu_right'+cl).hide();
		$('.msg_menu_right_date'+cl).show();
		//close dropdown menu
		$('#right-btn-ellipsis-'+cl).removeClass('open');
}

function bind_upload_inbox(id){	
	var id = parseInt(id);
	var APISERVER = $('#APISERVER').val();
	var admin_id = $('#admin_id').val();
	var partner_id = $('#partner_id').val();
	var attached_array = [];
	$("#frm_msg"+id).fileupload({
	    // Uncomment the following to send cross-domain cookies:
	    //xhrFields: {withCredentials: true},
	    //url: '/plugins/jquery-file-upload/server/php/',
		//formData: {script: true},
	    acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|txt|doc|docx|xlsx|xls|pdf|zip)$/i,
	    url: APISERVER+'/api/search/uploadCustomMailLogoComm.json?admin_id='+admin_id+'&partner_id='+partner_id,
	    //url: '<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'settings','action' => 'upload', 'mass'),true);?>',  // #044 10-feb-2016 0033935: BE > customer card > email attachment 
	    //dataType: 'json',
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
}
</script>
<style type="text/css">
div.msg_body{
 	height:20px;
	overflow-y:hidden;
 }
div.msg_sub{
 	height:20px;
	overflow-y:hidden;
 }
 
.border_radius{
	background-color: gray;
	width: 35px;
	height: 35px;
	color: #fff;
	line-height: 2.5;
	display:inline-block;
	text-align:center;
}
.wname{
	height: 20px;
	float: left;
	width:50%;
	overflow-y:hidden;
}
.top-action-grp button{
	padding: 6px 8px !important;
}
.top-search-btn:hover{
	background-color: #fff !important;
	color:#35aa47;
}
.top-search-btn{
	border-color: #35aa47 !important;
	color:#35aa47 !important;
}
@media screen and (min-width: 1000px ) and (max-width: 6000px ) {
.wname{width:auto;}
}
</style>

<div class="row-fluid">
	<div class="span12">	
		<div class="row-fluid" >
			<div class="span12">
				<div class="row-fluid portfolio-block" style="background:#fff;">
					<div class="span12" style="overflow:visible;">
						<table id="sorting_product_list" class="table" style="width:100%;">
							<thead>
								<tr class="border_box_line">
									<td class="border_box_bottom span1"></td>
									<td class="border_box_top span8"></td>
									<td></td>				
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					
					</div>
				</div>
			</div>
			<!---notification/warning fields start -->
				<div class="portlet-body form">
					<div id="delete_email" title="Alert message" class="hide">
						<?php  echo __('Are you sure you would like to delete this Email?') ?> <br><br>		
					</div>
					<div id="delete_mass_email" title="Alert message" class="hide">
						<?php  echo __('Are you sure you would like to delete this selected Emails?') ?> <br><br>		
					</div>
					<div id="delete_mass_email_one" title="Alert message" class="hide">
						<?php  echo __('Are you sure you would like to delete this selected Email?') ?> <br><br>		
					</div>
				</div>
				<input type="hidden" name="json_data" id="json_data" value="">
				<input id="attachments" type="hidden" value="" name="attachments">
			<!---notification/warning fields end- -->	
			
			</div><!--span12 ends here-->
		
		</div>	
	</div><!--1st span12 end---- -->
</div><!---1st row fluid end- -->
<!-- LOAD MORE -->
<input type="hidden" id="next_page" value="<?php echo $next_page ?>">
<input type="hidden" id="start" value="<?php echo $start ?>">
<input type="hidden" id="end" value="<?php echo $end ?>">
<input type="hidden" id="total_records" value="">
<style>

h5{
    font-size: 16px;
    font-weight:bold;
}
.nw-msg {
	font-weight:bold;
}
.unread td{
	font-weight:bold;
}
.unread  div.msg_body{
	font-weight: normal;
	color:#6b6b6b;
}
.frm-grp.frm-line-in.frm-floating-label .form-control:focus:not([readonly]) ~ label, .frm-grp.frm-line-in.frm-floating-label .form-control.edited ~ label{
	top:10px !important;
}

.thumb_url:hover{
	opacity:0.6;
}
</style>	
<script>	

function ss_show_modal(){
	show_modal('','','',"<?php echo Router::url(array('plugin'=>'bkengine','controller' => 'communications','action' => 'show_email_settings'),true); ?>");
}
$('.msg_menu_right').hide();
$('.ms_chk_opt').hide();
$('.action_extra_opt').hide();
$('.ms_u').hide();	
$('.ms_m').hide();	
$('.ms_l').hide();

$('.test_class').click(function(){
	$('.test_class').removeClass('current');
	$(this).addClass('current');
});

$(document).ready(function(){
	$('[data-toggle="popover"]').popover();   
	$('input[type=checkbox]').uniform();
	
	
	$('.checkall_opt').on('click', function () {
			var boxes = $('.myCheckBox');
		    boxes.prop('checked', true); 
			$.uniform.update();	
			$('.uncheckall_opt').show();	
			$('.checkall_opt').hide();	
			
	});
	$('.uncheckall_opt').on('click', function () {
			var boxes = $('.myCheckBox');
		    boxes.prop('checked', false); 
			$.uniform.update();	
			$('.uncheckall_opt').hide();	
			$('.checkall_opt').show();	
			hide_chk_opt();
	});
	
	$('#partner_number').keyup(function(event){
		if(event.keyCode == 13){
		   var value = $('#partner_number').val(); //alert(value);
		   if(value.length >= 2)
		   {
			   $('.test_class').removeClass('current');
			   $('.writer_name:contains('+value+')').parent().parent().parent().parent().parent().parent().addClass('current');	
		   }		
		}
	});	
	
	/////new API file upload code
		//  var APISERVER = $('#APISERVER').val();
		//  var admin_id = $('#admin_id').val();
		//  var attached_array = [];
		//  $("form[id^='frm_msg']").fileupload({
  //           // Uncomment the following to send cross-domain cookies:
  //           //xhrFields: {withCredentials: true},
  //           //url: '/plugins/jquery-file-upload/server/php/',
		// 	//formData: {script: true},
  //           acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|txt|doc|docx|xlsx|xls|pdf|zip)$/i,
  //           url: APISERVER+'/api/search/uploadCustomMailLogoComm.json?admin_id='+admin_id,
  //           //url: '<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'settings','action' => 'upload', 'mass'),true);?>',  // #044 10-feb-2016 0033935: BE > customer card > email attachment 
  //           //dataType: 'json',
  //           autoUpload: true,
		// 	//sequentialUploads: true,
		// 	add: function (e, data) {
		// 		var addHtml = '';
		// 		var jqXHR = data.submit()
		// 	    .success(function (result, textStatus, jqXHR) {  
		// 			var str = this.form[0].id; 
		// 			var row_id = str.replace("frm_msg", "");
					
		// 			$.each(result.response.response.files, function (index, file) {	
		// 				attached_array.push(file);
		// 				addHtml += '<tr class="template-download fade in"><td width="10%" class="preview">';
		// 				if(file.thumbnail_url != undefined){
		// 					addHtml += '<a title="'+file.orig_name+'" href="'+file.url+'" data-rel="" class=""><img src="'+file.thumbnail_url+'"></a>';
		// 				}
		// 				addHtml += '</td><td width="30%" class="name">';
		// 				addHtml += '<a download="'+file.orig_name+'" data-gallery="gallery" title="'+file.orig_name+'" href="'+file.url+'">'+file.orig_name+'</a></td>';
		// 				addHtml += '<td width="40%" class="size"><span>'+formatFileSize(file.size)+'</span></td><td colspan="2"></td>';
		// 				addHtml += '<td width="10%" class="delete">'; 
		// 				addHtml += '<button data-url="'+file.delete_url+'" data-type="DELETE" class="btn  mini"><i class="icon-remove"></i></button></td></tr>';     						
		// 			});
		// 			$('.table-striped#table-striped_'+row_id+' .files').append(addHtml);
					
		// 			$('#attachments').val(JSON.stringify(attached_array));
				
		// 		 })
		// 		.error(function (jqXHR, textStatus, errorThrown) {})
		// 		.complete(function (result, textStatus, jqXHR) {					
		// 			$('#progress').hide();
		// 		});
		// 	},
		// 	progressstart: function (e, data) {
		// 		$('#progress').show();
		// 	},
		// 	progressall: function (e, data) {
		// 		$('#progress').show();
		// 		var progress = parseInt(data.loaded / data.total * 100, 10);
		// 		$('#progress .bar').css(
		// 			'width',
		// 			progress + '%'
		// 		);
		// 	},
  // });
        
		// $("form[id^='frm_msg']").bind('fileuploaddestroy', function (e, data) {
		// 	json_arr = $('#attachments').val();
		// 	delete_url = data.url;
		// 	arr = JSON.parse(json_arr);
		// 	var j_arr = removeItem(arr, 'delete_url', delete_url);
		// 	attached_array = j_arr;
		// 	$('#attachments').val(JSON.stringify(attached_array));
			
		// });
     
		function removeItem(obj, prop, val){
			var c, found=false;
			if(obj.length > 0) {
				for(c in obj) {
					if((obj.length >0) && (obj[c][prop] == val)) {
						found=true;
						break;
					}
				}
				if(found){
					obj.splice(c,1);
				}
			}
			return obj;
		}   
	/////file upload en
		
}); //document.ready ending here
//#174: Bengine(ERP) Updates 15-11-2016: part-3

function show_msg_body(id,msg_id,sd='',unreadmsgid='',sender=''){
		//for reseting other messages
			for (i = 0; i < 10; i++){
			  if($('.ms_m'+i).css('display') !== 'none'){
				$('#frm_msg'+i+' #table-striped_'+i+' .files').children().children('.delete').children('.btn').click();	
					var data_len = $('#attachments').val();
					if(data_len.length == 2){
						$('#table-striped_'+i+' .files').html('');
					}
			  }
			}
		//end
			var crouter_url = $('#crouter_url').val();
			$('.getmsgthread').remove();
		$('.ms_line'+id+' .writer_name:first').after('<div class="getmsgthread" class="row-fluid text-center"><img src="'+crouter_url+'/img/loading.gif"></div>');
		//get message threads start
		
				var token = '<?php echo CakeSession::read('MEMBER.token'); ?>';
				var language = '<?php echo CakeSession::read('Config.language'); ?>';
				var lang = '<?php echo CakeSession::read('Config.lang'); ?>';
				var partner_id = '<?php echo CakeSession::read('MEMBER.PartnerId'); ?>';
				var APISERVER = $('#APISERVER').val();
				var staffer_id = $('#staffer_id').val();
				if(sender!='customer'){
					var total_params = 'token='+token+'&language='+language+'&partner_id='+partner_id+'&message_id='+msg_id+'&folder=i,o,t&from=trash&staffer_id='+staffer_id;
				}
				else{
						var total_params = 'token='+token+'&language='+language+'&partner_id='+partner_id+'&message_id='+msg_id+'&folder=i,o,t&from=trash&staffer_id='+staffer_id;
				}
				var data = passProdRequest(APISERVER+'/api/PartnerMessages/getMsgThread.json',total_params,'undefined','undefined');
				if(data == undefined){
					var json_data = $('#json_data').val();
					var data = JSON.parse(json_data);;
					data.response.status = is_undefined(data.response.status);
					if(data.response.status == 'success'){
						var stafer_id = $('#staffer_id').val();
						getInboxCountApi2(stafer_id);
						//draft changes
							if(data.response.response.draftdetails!=undefined && data.response.response.draftdetails!=null){
								var draft_message_id = data.response.response.draftdetails.draft_message_id;
								var draft_message_text_id = data.response.response.draftdetails.draft_message_text_id;
								var messages =  data.response.response.draftdetails.draft_message;
								var pmsgid = data.response.response.draftdetails.parent_message_id;
								var obj= {partner_message_id:draft_message_id,partner_message_text_id:draft_message_text_id};
								var attachments_draft = data.response.response.draftdetails.attachments;
								if(attachments_draft!=''){
																
									
								}
								localStorage.setItem('draftids',JSON.stringify(obj));
								
								
								setTimeout(function(){
									reply_body_msg_show_tpl(pmsgid,pmsgid,'no',messages,attachments_draft);
									
								},1000);
								
								
							}
						//draft changes
						if(data.response.response){
							
							data.response.response = data.response.response.threaddetails;
							var jstext = '';
							for (index = 0; index < data.response.response.length; ++index){
								var text_id =  data.response.response[index].PartnerMessageText.id;
								var msg_id =  data.response.response[index].PartnerMessage.id;
									
									if(data.response.response.length > 3){
										if( index == '0'){
											jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" onmouseover="show_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
										}
										else if( index == (data.response.response.length - 1)){
											jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" style="border-top:none;" onmouseover="show_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
										}
										else{
											jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" style="display:none;" onmouseover="show_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
										}
									}
									else{
										jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" onmouseover="show_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';	
									}	
										//#626: Fwd: Feedback, communications module + a few minor corrections elsewhere > Avatar 
										var initial1='';
										var initial2 ='';
										var initial3 ='';
										var a ='';
										var b ='';
										
										var source_from = data.response.response[index].PartnerMessage.source_from;
										//Kunal Dhakate <kunal@srs-infosystems.com>
										if(source_from == null){
											if(data.response.response[index].Customer.name!='' && data.response.response[index].Customer.name!=undefined){
												var initial1 = '<?php echo $partner_name; ?>';
												var initial1 = initial1.substr(0,1);
												var initial2 = data.response.response[index].Customer.name;
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
										
										//#626: Fwd: Feedback, communications module + a few minor corrections elsewhere > Avatar 
										
										jstext += '<td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="border_radius">'+initial1+initial2+initial3+'</div></td>';
										jstext += '<td class="border_box_last"  style="border:none;">';
										
										if(data.response.response.length > 1){
											var source = '<?php echo $partner_name;?>';
											if(source_from != null){
												source = source_from;
											}
											
											var customer_email = '<b>'+data.response.response[index].Customer.name+'</b> &lt; '+data.response.response[index].Customer.email+' &gt;';
											var source_email = data.response.response[index].PartnerMessage.email;
											if(source_email != null){
												customer_email = source_email;
											}
											var inbox = 'inbox';
											var message = data.response.response[index].PartnerMessageText.message;
											// if(isHTML(message) == false)
											// 	var text_message = message.replace(/\n/g,'<br/>');
											// else
											message = decodeEntities(message);
											message = message.split('sarthak@123+_*&^%~');	
											text_message = message[0];
											var text_message = text_message.replace(/<\/?[^>]+(>|$)/g, "");
											var folder_name = data.response.response[index].PartnerMessageFolder.folder;
											
											if(folder_name!='d'){
												jstext += '<div class="bd_h_'+id+'_'+msg_id+'" onclick="show_hide_msg_thread('+id+','+msg_id+')"  style="cursor:pointer;"><div style="float:left;">';
										
												jstext += '<div class="slr_snd_'+id+'_'+msg_id+'" style="cursor:pointer;" ><b class="writer_name">'+source+'</b></div>';
												jstext += '<div class="slr_rcv_'+id+'_'+msg_id+'" style=" display:none; cursor:pointer;" ><?php echo __('to');?> &nbsp;'+customer_email+'</div>';
												
												}
												else if(folder_name=='d'){
													jstext += '<div class="bd_h_'+id+'_'+msg_id+'"   style="cursor:pointer;"><div onclick="ss_show_draft_dkmodal('+id+','+text_id+','+msg_id+')" style="float:left;">';
													jstext += '<div style="color:#d23f31"><?php echo __("Draft"); ?></div>';
												}

											
												jstext += '<div class="slr_txt_'+id+'_'+msg_id+'" style=" color:#757575; cursor:pointer;">'+$('<div class="testClass">'+text_message+'</div>').text().substr(0,100)+'</div></div>';
											jstext += '<div style="height: 30px; line-height: 30px; float: right;"><span>'+data.response.response[index].PartnerMessageText.time_text+'</span>&nbsp;&nbsp;';
											if(folder_name!='d'){	
												jstext += '<div class="btn-group pull-right thread-btn-ellipsis" id="thread-btn-ellipsis-'+id+''+msg_id+''+msg_id+'" onclick=" sub_thread_dropdown(event,'+id+','+msg_id+','+msg_id+');" style="display: none;">';	
												jstext += '<span data-close-others="true" data-delay="100" data-hover="dropdown-toggle" data-toggle="dropdown" class="dropdown-toggle">';
												jstext += '<a style="margin: 0px 2px;" class="round_btn_icon btn icn-only"><i class="icon-ellipsis-vertical right-thread-btn-icon-'+msg_id+'" ></i></a> ';
												jstext += '</span>';
												jstext += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
												jstext += '<li>	';
												jstext += '<a class="" onclick="show_dkmodal_for_reply('+id+','+text_id+','+msg_id+');"><i class="icon-reply" style="color:#000000"></i>&nbsp;<?php echo __("Reply"); ?></a>';
												jstext += '</li>';
												jstext += '<li>';
												jstext += '<a class="" onclick="show_dkmodal_for_forward('+id+','+text_id+','+msg_id+');"><i class="icon-arrow-right" style="color:#000000"></i>&nbsp;<?php echo __("Forward#"); ?></a>';
												jstext += '</li>';
												jstext += '<li>';
												jstext += '<a class="" onclick="print_mail_pdf('+text_id+','+msg_id+');"><i class="icon-print" style="color:#000000"></i>&nbsp;<?php echo __("Print"); ?></a>';
												jstext += '</li>';
												jstext += '<li>';
												jstext += '<a class="" onclick="show_mail_source('+text_id+','+msg_id+');"><i class="icon-file" style="color:#000000"></i>&nbsp;<?php echo __("Show source"); ?></a>';
												jstext += '</li>';
												jstext += '</ul>';
												jstext += '</div>';	
												jstext += '</div>';
												
												jstext += '<div style="clear:both;"></div>';
											

											
											}
											else if(folder_name=='d'){
												jstext += '<div class="pull-right" style="z-index:1000;cursor:pointer"><a class="round_btn_icon btn icn-only" onclick="ss_delete_trash('+id+','+msg_id+');" data-toggle="tooltip" data-placement="top" title="<?php __("Delete"); ?>"><i class="icon-trash" style=""></i></a></div>';
													jstext += '<div style="clear:both;"></div>';
											}
												jstext += '</div>';	
													jstext += '</div>';
												
													jstext += '<div class="bd_resp_'+id+'_'+msg_id+'" style="padding: 20px 0px; display:none;">';
											

										}
										else{
											var source = '<?php echo $partner_name;?>';
											if(source_from != null){
												source = source_from;
											}
											
											var customer_email = '<b>'+data.response.response[index].Customer.name+'</b> &lt; '+data.response.response[index].Customer.email+' &gt;';
											var source_email = data.response.response[index].PartnerMessage.email;
											if(source_email != null){
												customer_email = source_email;
											}
											var inbox = 'inbox';
											jstext += '<div class="bd_h_'+id+'_'+msg_id+'" style=""><div style="float:left;">';
											jstext += '<div class="slr_snd_'+id+'_'+msg_id+'" style="" ><b class="writer_name">'+source+'</b></div>';
											jstext += '<div class="slr_rcv_'+id+'_'+msg_id+'" style="" ><?php echo __('to');?> &nbsp;'+customer_email+'</div>';
											jstext += '</div>';
											jstext += '<div  style="height: 30px; line-height: 30px; float: right;"><span>'+data.response.response[index].PartnerMessageText.time_text+'</span>&nbsp;&nbsp;';
											
											jstext += '<div class="btn-group pull-right thread-btn-ellipsis" id="thread-btn-ellipsis-'+id+''+msg_id+''+msg_id+'" onclick="">';	
											jstext += '<span data-close-others="true" data-delay="100" data-toggle="dropdown" class="dropdown-toggle">';
											jstext += '<a style="margin: 0px 2px;" class="round_btn_icon btn icn-only"><i class="icon-ellipsis-vertical right-thread-btn-icon-'+msg_id+'" ></i></a> ';
											jstext += '</span>';
											jstext += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
											jstext += '<li>	';
											jstext += '<a class="" onclick="show_dkmodal_for_reply('+id+','+text_id+','+msg_id+');"><i class="icon-reply" style="color:#000000"></i>&nbsp;<?php echo __("Reply"); ?></a>';
											jstext += '</li>';
											jstext += '<li>';
											jstext += '<a class="" onclick="show_dkmodal_for_forward('+id+','+text_id+','+msg_id+');"><i class="icon-arrow-right" style="color:#000000"></i>&nbsp;<?php echo __("Forward#"); ?></a>';
											jstext += '</li>';
											jstext += '<li>';
											jstext += '<a class="" onclick="print_mail_pdf('+text_id+','+msg_id+');"><i class="icon-print" style="color:#000000"></i>&nbsp;<?php echo __("Print"); ?></a>';
											jstext += '</li>';
											jstext += '<li>';
											jstext += '<a class="" onclick="show_mail_source('+text_id+','+msg_id+');"><i class="icon-file" style="color:#000000"></i>&nbsp;<?php echo __("Show source"); ?></a>';
											jstext += '</li>';
											jstext += '</ul>';
											jstext += '</div>';	
											jstext += '</div>';
											
											jstext += '<div style="clear:both;"></div>';
											jstext += '</div>'; //float right div ends here
											
											jstext += '</div>';
											jstext += '<div class="bd_resp_'+id+'_'+msg_id+'" style="padding: 20px 0px;">';
										}
										var message = data.response.response[index].PartnerMessageText.message;
										
										
										// if(isHTML(message) == false)
										// 	var text_message = message.replace(/\n/g,'<br/>');
										// else
										message = decodeEntities(message);
										message = message.split('sarthak@123+_*&^%~');
										text_message =  message[0];
										jstext += '<div class="testClass">'+text_message+'</div>';
											
											if(data.response.response[index].PartnerMessageAttachment){
												jstext += '<hr><div class="inbox-attached" style="line-height:unset !important;">';
												if(data.response.response[index].PartnerMessageAttachment.length > 1) { 
													var arr = '';
													for(i = 0; i < data.response.response[index].PartnerMessageAttachment.length; ++i) {
														if(i==0){
															arr += decodeURIComponent(data.response.response[index].PartnerMessageAttachment[i].file_name);
														}else{
															arr += ','+decodeURIComponent(data.response.response[index].PartnerMessageAttachment[i].file_name);
														}

													}
													arr  = encodeURIComponent(arr);
													var cr = $('#crouter_url').val();
													var pid = parseInt($('#partner_id').val().trim());
													pid =  btoa(pid);
													var url = cr+'app/webroot/view_file.php?partner_id='+pid+'&from=zip&all='+arr;
													//console.log(arr);
													jstext += '<div class="margin-bottom-15">';
													jstext += '<span>'+data.response.response[index].PartnerMessageAttachment.length+' <?php __("Attachments"); ?></span>';
													jstext += '<a style="cursor:pointer" target="_blank" href="'+url+'">Download all attachments</a>';
													jstext += '</div>';
												} 
												for(i = 0; i < data.response.response[index].PartnerMessageAttachment.length; ++i) { 
													
													var viewpath =data.response.response[index].PartnerMessageAttachment[i].file_path;					
												var path = '<?php echo Router::url('/',true); ?>'+'app/webroot/view_file.php?url='+data.response.response[index].PartnerMessageAttachment[i].urlencode+'&size='+data.response.response[index].PartnerMessageAttachment[i].size+'&partner_id=<?php echo base64_encode(CakeSession::read("MEMBER.PartnerId")) ?>';
												var thurl  = data.response.response[index].PartnerMessageAttachment[i].thumbnail_url;
													if(thurl==undefined || thurl==null || thurl==''){
														var thurl  = data.response.response[index].PartnerMessageAttachment[i].file_path;
													}

													var extension =  data.response.response[index].PartnerMessageAttachment[i].extension;
													var ext = extension.toUpperCase();
													var orig_name = data.response.response[index].PartnerMessageAttachment[i].orig_name_wt_ext;
													var size = formatFileSize(data.response.response[index].PartnerMessageAttachment[i].size);
													var file_path = data.response.response[index].PartnerMessageAttachment[i].file_path;
													if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
														jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
															jstext += '<div class="files">';
																jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
																//	jstext += '<table><tbody>';
																		//jstext += '<tr class="template-download fade in">';
																			//jstext += '<td>';
																				jstext += '<a id="aSH_'+i+'" data-fancybox title="'+data.response.response[index].PartnerMessageAttachment[i].orig_name+'" href="'+file_path+'" data-rel="" class=" kY">';
																						jstext += '<img src="'+thurl+'" style="width:70%; height:40%;margin-left: 15%;margin-top: 13%;" class="hoverimage">';
																							jstext += '<div style="padding-left: 10px; color: #B18575;">';
																								
																							jstext += '<span style="padding-left: 25px;">'+size+'</span>';
																						jstext += '</div>';
																				jstext += '</a>';
																			//jstext += '</td>';
																		//jstext += '</tr>';
																	//jstext += '</tbody></table>';
																	jstext += '<div class="showthiss">';
																    jstext += '<div class="text">';
																    	jstext += '<a href="javascript:;" onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');return false;"><i class="icon-download" ></i></a>';
																    	jstext += '</div>';
																  jstext += '</div>';
															  jstext += '</div>';
															jstext += '</div>';
														jstext += '</div>';
														
													}else if(extension == 'pdf'){
														jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
															jstext += '<div class="files">';
																jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
																	//jstext += '<table><tbody>';
																		//jstext += '<tr class="template-download fade in"><td>';
																			jstext += '<a  data-fancybox id="aSH_'+i+'" title="'+orig_name+'" href="/a/" data-rel="" class=" kY">';
																				jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden">';
																					jstext += '<span>'+orig_name+'</span>';
																				jstext += '</div>';
																				jstext += '<div style="padding-left: 10px; color: #B18575;">';
																					jstext += '<img src="<?php echo Router::url('/',true); ?>app/webroot/img/file-icon/icon_pdf.png" alt="icon">';
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
																		//jstext += '</td></tr>';
																	//jstext += '</tbody></table>';
																jstext += '</div>';
															jstext += '</div>';
														jstext += '</div>';	
													}else if((extension == 'csv') || (extension == 'txt')){
														jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
															jstext += '<div class="files">';
																jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
																	//jstext += '<table><tbody>';
																		//jstext += '<tr class="template-download fade in"><td>';
																			jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="'+viewpath+'" data-rel="" class=" kY">';
																				jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
																				jstext += '<div style="padding-left: 10px; color: #B18575;">';
																					jstext += '<img src="<?php echo Router::url('/',true); ?>app/webroot/img/file-icon/icon_text.png" alt="icon">';
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
																		//jstext += '</td></tr>';
																	//jstext += '</tbody></table>';
																jstext += '</div>';
															jstext += '</div>';
														jstext += '</div>';
													}else if((extension == 'docx') || (extension == 'doc')){
														jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';jstext += '<div class="files">';
																jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
																	//jstext += '<table><tbody>';
																		//jstext += '<tr class="template-download fade in"><td>';
																			jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="#" data-rel="" class=" kY">';
																				jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
																				jstext += '<div style="padding-left: 10px; color: #B18575;">';
																					jstext += '<img src="<?php echo Router::url('/',true); ?>app/webroot/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
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
																		//jstext += '</td></tr>';
																	//jstext += '</tbody></table>';
																jstext += '</div>';
															jstext += '</div>';
														jstext += '</div>';
													}else if((extension == 'xlsx') || (extension == 'xls')){
														jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';jstext += '<div class="files">';
																jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
																	//jstext += '<table><tbody>';
																		//jstext += '<tr class="template-download fade in"><td>';
																			jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="#" data-rel="" class=" kY">';
																				jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
																				jstext += '<div style="padding-left: 10px; color: #B18575;">';
																					jstext += '<img src="<?php echo Router::url('/',true); ?>app/webroot/img/file-icon/icon_spreadsheet.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
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
																		//jstext += '</td></tr>';
																	//jstext += '</tbody></table>';
																jstext += '</div>';
															jstext += '</div>';
														jstext += '</div>';
												}else if(extension == 'zip'){
													jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';jstext += '<div class="files">';
																jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
																	//jstext += '<table><tbody>';
																		//jstext += '<tr class="template-download fade in"><td>';
																			jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="#" data-rel="" class=" kY">';
																				jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
																				jstext += '<div style="padding-left: 10px; color: #B18575;">';
																					jstext += '<img src="<?php echo Router::url('/',true); ?>app/webroot/img/file-icon/icon_zip.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
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
																		//jstext += '</td></tr>';
																	//jstext += '</tbody></table>';
																jstext += '</div>';
															jstext += '</div>';
														jstext += '</div>';
													}

												else if(extension == 'msword'){
														jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';jstext += '<div class="files">';
																jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
																	//jstext += '<table><tbody>';
																		//jstext += '<tr class="template-download fade in"><td>';
																			jstext += '<a id="aSH_'+i+'" data-fancybox title="'+orig_name+'" href="#" data-rel="" class=" kY">';
																				jstext += '<div style="padding: 5px; word-wrap: break-word; height:38%;overflow:hidden"><span>'+orig_name+'</span></div>';
																				jstext += '<div style="padding-left: 10px; color: #B18575;">';
																					jstext += '<img src="<?php echo Router::url('/',true); ?>app/webroot/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
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
																		//jstext += '</td></tr>';
																	//jstext += '</tbody></table>';
																jstext += '</div>';
															jstext += '</div>';
														jstext += '</div>';
													}
												}
												jstext += '</div>';
											}
										jstext +='</div>';			
										jstext += '</div></td></tr></tbody></table></div></div>';
																			
										if(data.response.response.length > 3){
											if( index == '0'){
												var clen =  parseInt(data.response.response.length) - parseInt(2);
												//jstext += '<div class=""><div class="c_count"><div class="c_count_main">2</div></div></div>';
												jstext += '<div class="c_count mgs_sub_list" onclick="show_sub_list_thread('+id+','+msg_id+','+msg_id+');" style="border:none;"><div class="" style="border-top:none;"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr><td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="c_count_main">'+clen+'</div></td><td class="border_box_last" style="border:none;"></td></tr></tbody></table></div></div></div>';
											}
										}
								}
							$('#msg_bd_'+id).html(jstext);
							$('#last_msg_text_id_'+id+'_'+msg_id).val(text_id);
							if(sd!=''){
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
							//624: Fwd: Feedback, communications module + a few minor corrections elsewhere > Unread message 
							$('tr.ms'+id).removeClass('unread');
							//624: Fwd: Feedback, communications module + a few minor corrections elsewhere > Unread message 
						}
						$('.getmsgthread').remove();
							$('.ms_m'+id+' .reply-msg').css('background',"#efefef");
							$('.main_msg_box').css('padding',"2% 0 0");
							$('.imgm'+id).show();
						if(unreadmsgid==''){
							if(folder_name!='d')
							show_hide_msg_thread(id,msg_id);
						}
						else{
							show_hide_msg_thread(id,unreadmsgid,'yes');
						}
						fancyAdjust();
						UpdatePartnerMessageHtmlHeader();
						///////
					}else if(data.response.status == 'error'){
						if(data.response.response.error == 'validationErrors'){
							var mt_arr = data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error','<?php echo __('Alert message')?>');
							return;
						}else{
							showAlertMessage(data.response.response.msg,'error','<?php echo __('Alert message')?>');
							return;
						}	
					}
				}
				
				//setDocDetail();	
	//end
	//do further processing	
	
	$('.ms_u').hide();	
	$('.ms_m').hide();	
	$('.ms_l').hide();
	$('.ms').show();

		$('.ms_u'+id).show();	
		$('.ms_m'+id).show();	
		$('.ms_l'+id).show();
		$('.ms'+id).hide();	
		
	//reply_body_msg_hide_tpl(id);	
	
}



function hide_msg_body(id){
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

}

function reply_body_msg_show_tpl(id,parent_message_id,removelocal='yes',message='',attachments=''){
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
		removePlugins: 'elementspath,magicline',
		startupFocus : true,
		language:ss_ck_lang,
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
				addHtml += '<button data-url="'+delete_url+'" onClick="set_reply_msg('+id+',"draft",'+parent_message_id+');"  data-type="DELETE" class="btn  mini"><i class="icon-remove"></i></button></td></tr>';     						
			}
				
			
			
			$('#table-striped_'+id+'>tbody').html(addHtml);
		}
		if(message!=''){
			//CKEDITOR.instances['TemplateContent'+id].setData('');
			CKEDITOR.instances['TemplateContent'+id].setData(message);
		}
		var timeouts = [];
		bind_upload_inbox(id);
		CKEDITOR.instances['TemplateContent'+id].on('key', function(evt) {
			console.log('charCode');
			var charCode  = '';
			if(evt.data!=undefined && evt.data!=null){
				if(evt.data.keyCode!=undefined && evt.data.keyCode!=null){
					charCode = evt.data.keyCode;
				}
			}
      		if(charCode==27){
      			reply_body_msg_hide_tpl(id);
      		}

      	});
      	set_reply_msg(id,'draft',parent_message_id);
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
						set_reply_msg(id,'draft',parent_message_id); 
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
						set_reply_msg(id,'draft',parent_message_id); 
					}, 500)
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
						set_reply_msg(id,'draft',parent_message_id); 
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

	

}

function reply_body_msg_hide_tpl(id){
	$('.ms_m'+id+' .reply-msg').css('background',"#efefef");
	$('.main_msg_box').css('padding',"2% 0 0");
	var draftids = localStorage.getItem('draftids');
	if(draftids!=null || draftids!=undefined){
		draftids = JSON.parse(draftids);
		partner_message_id = draftids.partner_message_id;
		ss_delete_trash1(id,partner_message_id);
		
	}
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
	
}
	
function delete_letter_email(id){
	 var title = '<?php echo __("Warning"); ?>';			
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
				"text" : "<?php echo __('Delete'); ?>",
				click: function() {
					$(this).dialog( "close" ); 
					 
					var APISERVER = $('#APISERVER').val();
					var token = '<?php echo CakeSession::read('MEMBER.token'); ?>';
					var language = '<?php echo CakeSession::read('Config.language'); ?>';
					var lang = '<?php echo CakeSession::read('Config.lang'); ?>';
					var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&id='+id+'&folder=i';
					
					var data = passProdRequest(APISERVER+'/api/PartnerMessages/deleteLetterMailPermanently.json',total_params);
					if(data == undefined){
						var json_data = $('#json_data').val();
						var data = JSON.parse(json_data);
						if(data.response){
								call_toastr('<?php echo __('success'); ?>', '<?php echo __('Success'); ?>','<?php echo __('Email Deleted successfully'); ?>');
								//passRequest('<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'communications','action' => 'inbox',),true);?>','','undefined');
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
								showAlertMessage(array,'error','<?php echo __('Alert message')?>');
								return;
							}else{
								showAlertMessage(data.response.response.msg,'error','<?php echo __('Alert message')?>');
								return;
							}	
						}
					}
				}
			},
			{
				'class' : 'btn',
				'id' : 'cancelbtntext',	
				"text" : "<?php echo __('Cancel'); ?>",
				click: function() {
					$(this).dialog( "close" );
				}
			}
		  ]
	});
	$( "#cancelbtntext" ).prepend( "<i class='icon-remove'></i> " );
}

function delete_mass_email(){
	 var title = '<?php echo __("Warning"); ?>';
	 var idArray = [];
	 var count=0;
		$("input:checkbox:checked").each(function(){
			idArray.push($(this).val());
			count++;
		});	
		if(idArray == []){
			showAlertMessage('<?php echo __('Alert message')?>','error','<?php echo __('No message selected')?>');
			return;	
		}	
	var delete_msg = 'delete_mass_email';
	if(count==1){
		delete_msg = 'delete_mass_email_one';
	}
	$("#"+delete_msg ).dialog({
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
				"text" : "<?php echo __('Delete'); ?>",
				click: function() {
					$(this).dialog( "close" ); 
					 
					var APISERVER = $('#APISERVER').val();
					var token = '<?php echo CakeSession::read('MEMBER.token'); ?>';
					var language = '<?php echo CakeSession::read('Config.language'); ?>';
					var lang = '<?php echo CakeSession::read('Config.lang'); ?>';
					var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&idArray='+idArray+'&folder=i';
					
					var data = passProdRequest(APISERVER+'/api/PartnerMessages/deleteLetterMassMailPermanently.json',total_params);
					if(data == undefined){
						var json_data = $('#json_data').val();
						var data = JSON.parse(json_data);
						if(data.response ){
								call_toastr('<?php echo __('success'); ?>', '<?php echo __('Success'); ?>','<?php echo __('Email Deleted successfully'); ?>');
								//passRequest('<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'communications','action' => 'inbox',),true);?>','','undefined');
								var stafer_id = $('#staffer_id').val();
								getInboxCountApi2(stafer_id);
								for(var k in idArray){
									var a = parseInt(idArray[k]);
									$('.ms'+a).remove();
									$('.ms_u'+a).remove();
									$('.ms_m'+a).remove();
									$('.ms_l'+a).remove();
								}
								
						}else if(data.response.status == 'error'){
							if(data.response.response.error == 'validationErrors'){
								var mt_arr = data.response.response.list;
								var array = $.map(mt_arr, function(value, index) {
									return value+'<br />';
								});
								showAlertMessage(array,'error','<?php echo __('Alert message')?>');
								return;
							}else{
								showAlertMessage(data.response.response.msg,'error','<?php echo __('Alert message')?>');
								return;
							}	
						}
					}
				}
			},
			{
				'class' : 'btn',
				'id' : 'cancelbtntext',	
				"text" : "<?php echo __('Cancel'); ?>",
				click: function() {
					$(this).dialog( "close" );
				}
			}
		  ]
	});
	$( "#cancelbtntext" ).prepend( "<i class='icon-remove'></i> " );
}

function set_reply_msg(lineID,draft='',parent_message_id='',sendmail='no'){
	var body = CKEDITOR.instances['TemplateContent'+lineID].getData();
	$('#reply_msg_body'+lineID).val(body);
	$('.field_id').val(lineID);

	if(draft==''){
		ss_send_reply_mail(lineID,'',parent_message_id,sendmail);
	}
	else if(draft=='draft'){
		ss_send_reply_mail(lineID,'draft',parent_message_id,sendmail);
	}

}

function ss_send_reply_mail(lineID,draft='',parent_message_id='',sendmail){
	
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
	var sender = '<?php echo strtolower(CakeSession::read("type")); ?>';
	cust_name1 = cust_name;

	var cust_name = new Array();
	var cust_email1 = cust_email1.trim();
	var b = cust_email1;
	if(cust_email1.indexOf('<')!=-1){

	}

	var a = cust_email1.trim().lastIndexOf('#');
  if(a!=-1){        
    b =  cust_email1.substr(a+1,cust_email_1.length);
  }
	console.log(cust_email1);
	var a = {};
	a[b] = cust_name1.trim();
	cust_name.push(a);
	cust_name = JSON.stringify(cust_name);
	if(from_inbox != 'inbox'){
		if(cust_con_id!='' && cust_con_id!=null && cust_con_id!=undefined){
			cust_email.push(cust_id+'##'+cust_con_id+'##'+cust_email1);
		}
		else if(cust_id!='' && cust_id!=null && cust_id!=undefined){
			cust_email.push(cust_id+'##'+cust_email1);
		}
		else{
			showAlertMessage(array,'error','<?php echo __("exception_error")?>');
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
	console.log('--------');
	console.log(cust_email);
	console.log('--------');
	var from_inbox ='trash';
	cust_email = JSON.stringify(cust_email);

		var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:cust_email,customer_name:cust_name,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender};
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
							var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:cust_email,customer_name:cust_name,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail};

					
						}
						else if(sendmail=='yes'){
								var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:cust_email,customer_name:cust_name,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail};
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
						if(whereto=='saveToDraftonChange' ){
							var getThreadDetails = data.response.response.getThreadDetails;
									var sFrom =  getThreadDetails.PartnerMessage.source_from;
									sFrom = sFrom.replace("<","&nbsp;");
									sFrom = sFrom.replace(">","&nbsp;");
									sFrom = sFrom.split("&nbsp;");
									sFrom = sFrom[0];
									sFrom = sFrom.split(" ");
									sFrom = sFrom[0];
									
									var IsAdmin1 = '<?php echo CakeSession::read("IsAdmin"); ?>';
									var one = sFrom;
									if(IsAdmin1!='Y'){	
										var one =	'<?php echo __("me"); ?>, ';
									}

									var two = '' ;
									if(getThreadDetails.PartnerMessage.email!=undefined && getThreadDetails.PartnerMessage.email!=null && getThreadDetails.PartnerMessage.email!=''){
										var two = getThreadDetails.PartnerMessage.email;
										two = two.replace("<","&nbsp;");
										two = two.replace(">","&nbsp;");
										two = two.split("&nbsp;");
										two = two[0];
										two = two.split(" ");
										two = two[0];
									}

									if(getThreadDetails.hasdraft!=0){
										var three = ', <span style="color:#d23f31"><?php echo __("Draft"); ?> </span>';
									}
								
									var four = '('+getThreadDetails.getTotalCoun+')';
									
									var string = one+two+three+four;
									var pmid = getThreadDetails.PartnerMessage.parent_message_id;
									pmid = parseInt(pmid);
									$('.ms_line'+pmid+ ' p.writer_name:first').html(string);
								
						}
						if(draft!='draft'){
							call_toastr('<?php echo __('success'); ?>', '<?php echo __('Success'); ?>',data.response.response.success);
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
								call_toastr('<?php echo __('success'); ?>', '<?php echo __('Success'); ?>',msg);
								ssAppendNewThreadinbox(data.response.response.getThreadDetails,'','','');
						}
					}
					else if(data.response.status=='error'){ 
						if(data.response.response.error == 'validationErrors'){
							var mt_arr = data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error','<?php echo __('Alert message')?>');
							return;
						}else{
							showAlertMessage(data.response.response.msg,'error','<?php echo __('Alert message')?>');
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
						showAlertMessage(array,'error','<?php echo __('Alert message')?>');
						return;
					}else{
						showAlertMessage(data.response.response.msg,'error','<?php echo __('Alert message')?>');
						return;
					}
			    	return ;
			   	}
			});

}

function ss_send_msg_fromdraft(parent_message_id){

	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var partner_id = $('#partner_id').val();

	var getdraftids = JSON.parse(localStorage.getItem('draftids'));
	var partner_message_text_id = getdraftids.partner_message_text_id;
	var partner_message_id = getdraftids.partner_message_id;
	var total_params = 'token='+token+'&partner_id='+partner_id+'&partner_message_id='+partner_message_id+'&partner_message_text_id='+partner_message_text_id;


	var data = passProdRequest(APISERVER+'/api/PartnerMessages/sendCommunicationEmailFromDraft.json',total_params);
	if(data == undefined){
		var json_data = $('#json_data').val();
		var data = JSON.parse(json_data);
		data.response.status = is_undefined(data.response.status);
		if(data.response.status == 'success'){
	
		}
		else if(data.response.status == 'error'){
			if(data.response.response.error == 'validationErrors'){
				var mt_arr = data.response.response.list;
				var array = $.map(mt_arr, function(value, index) {
					return value+'<br />';
				});
				showAlertMessage(array,'error','<?php echo __('Alert message')?>');
				return;
			}
			else{
				showAlertMessage(data.response.response.msg,'error','<?php echo __('Alert message')?>');
				return;
			}	
		}
	}
}

function show_thread_msg_ellipsis_head(id,index,msg_id){
	$('.thread-btn-ellipsis').hide();
	$('#thread-btn-ellipsis-'+id+''+index+''+msg_id+'').show();
}

function hide_thread_msg_ellipsis_head(id,index,msg_id){
	$('.thread-btn-ellipsis').hide();
	$('#thread-btn-ellipsis-'+id+''+index+''+msg_id+'').removeClass('open');
}

function show_hide_msg_thread_head(row_id,thread_id){
		if($('.bd_resp_'+row_id+'_'+thread_id).is(":hidden")){
			$('.slr_rcv_'+row_id+'_'+thread_id).show();
			$('#messageclick .slr_txt_'+row_id+'_'+thread_id).hide();
			$('#messageclick .bd_resp_'+row_id+'_'+thread_id).show();
		}
		else{
				$(' .slr_rcv_'+row_id+'_'+thread_id).hide();
				$('.slr_txt_'+row_id+'_'+thread_id).show();
				$('.bd_resp_'+row_id+'_'+thread_id).hide();
			}
		}

function show_hide_msg_thread(row_id,thread_id,yes=''){
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
}

function set_custom_reply(id,msg_id,a){
	//show_msg_body(id,msg_id);
	//reply_body_msg_show_tpl(id);
	$(a).parent().parent().prev().click();

}

function show_sub_list_thread(mid,lid,msg_id){
	
	//lid--;
	//$('#mgs_sub_list_row'+mid+lid+msg_id).attr('style','border-top: 1px solid #e0e0e0;');
	$('#msg_bd_'+mid+' div.mgs_sub_list:last').attr('style','border-top: 1px solid #e0e0e0;');
	$('.mgs_sub_list').show();
	$('.c_count').hide();	
}


function show_thread_msg_ellipsis(id,index,msg_id){
	$('.thread-btn-ellipsis').hide();
	$('#thread-btn-ellipsis-'+id+''+index+''+msg_id+'').show();
}

function hide_thread_msg_ellipsis(id,index,msg_id){
	$('.thread-btn-ellipsis').hide();
	$('#thread-btn-ellipsis-'+id+''+index+''+msg_id+'').removeClass('open');
}

function sub_thread_dropdown(event,row,id,msg_id){
	$('#thread-btn-ellipsis-'+row+''+id+''+msg_id+' > .dropdown-toggle').dropdown('toggle');
	event.stopPropagation();
}

function set_dropdown(event,id){
	var ph = $(document).height();
	var ch = event.pageY;
	var diff = ph - ch ;
	if(diff < 230){
		$('#right-btn-ellipsis-'+id).addClass('dropup');
	}
}


function setDocDetail(){
	var json_data = $('#json_data').val();
	var data = JSON.parse(json_data);
	data.response.status = is_undefined(data.response.status);
	if(data.response.status == 'success'){
		if(data.response.response.length >= 1){
			for (index = 0; index < data.response.response.length; ++index){
				if(data.response.response[index].PartnerMessageAttachment.length >= 1){
					for(k= 0; k < data.response.response[index].PartnerMessageAttachment.length; ++k) {
						var extension =  data.response.response[index].PartnerMessageAttachment[k].extension;
						if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
							$("#cst_files_"+extension+"_"+k+" a").fancybox({
								'titlePosition'		: 'inside',
								'overlayColor'		: '#000',
								'overlayOpacity'	: 0.9
							});
						}else if(extension == 'pdf'){
							$("#cst_files_"+extension+"_"+k+" a").fancybox({
								'width'				: '100%',
								'height'			: '100%',
								'autoScale'			: false,
								'transitionIn'		: 'none',
								'transitionOut'		: 'none',
								'type'				: 'iframe',
								'closeClick'		: true,
							});
						}
					}
				}
			}
		}	
	}
}

function download_image(image_url, size){
	var path = '<?php echo Router::url('/',true); ?>'+'view_file.php?url='+image_url+'&size='+size;
	openPdf(path);
}


//LOAD MORE


localStorage.setItem('ajaxstart','false');

// function getStafferId(){
// 	var APISERVER = $('#APISERVER').val();
// 	var token = $('#token').val();
// 	var language = $('#language').val();
// 	var lang = $('#lang').val();
// 	var partner_id = $('#partner_id').val();
// 	var IsAdmin = '<?php echo CakeSession::read('IsAdmin'); ?>';

// 	if(IsAdmin != 'Y'){
// 		var login_id = '<?php echo CakeSession::read('MEMBER.LoginId'); ?>';
// 		var total_params = 'token='+token+'&partner_id='+partner_id+'&login_id='+login_id;
// 		ajaxstart = true;
// 		var data = passProdRequest(APISERVER+'/api/partners/getPartnerContactDetailsByLoginId.json',total_params);
// 		if(data == undefined){
// 			var json_data = $('#json_data').val();
// 			var data = JSON.parse(json_data);
// 			data.response.status = is_undefined(data.response.status);
			
// 			if(data.response.status == 'success'){
// 				for(var k in data.response.response){
// 					staffer_id = k;
// 				}
// 				getMoreEmails(staffer_id);
// 			}
// 			else if(data.response.status == 'error'){
// 				return;
// 			}
// 		}
// 	}
// 	else{
// 		var staffer_id = 0;
// 		getInboxCountApi2(staffer_id);
// 	}	
// }
var configured = 'yes';
function getMoreEmails(text='',from='',config){
	if(config=='yes'){
		configured = 'yes';			
	}
	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var lang = $('#lang').val();
	var partner_id = $('#partner_id').val();
	var staffer_id = $('#staffer_id').val();
	var page = parseInt($('#next_page').val());
	var end = parseInt($('#end').val()) + 1;
	if(text=='' && from==''){
		if(screen.height > 1200){
			var total_params = {
				token:token,
				partner_id:partner_id,
				sort:'last_modified',
				direction:'DESC',
				start:end,
				page:page,
				slab_start:page,
				limit:28,
				staffer_id:staffer_id
			};
		}
		else{
			var total_params = {
				token:token,
				partner_id:partner_id,
				sort:'last_modified',
				direction:'DESC',
				start:end,
				page:page,
				slab_start:page,
				limit:15,
				staffer_id:staffer_id
			};
			
		}
	}
	else if(from=='clearsearch'){
		if(screen.height > 1200){
			var total_params = {
				token:token,
				partner_id:partner_id,
				sort:'last_modified',
				direction:'DESC',
				limit:28,
				staffer_id:staffer_id
			};
		}
		else{
			var total_params = {
				token:token,
				partner_id:partner_id,
				sort:'last_modified',
				direction:'DESC',
				limit:15,
				staffer_id:staffer_id
			};
		}
	
	}
	else{
		var total_params = {
			token:token,
			partner_id:partner_id,
			search:text,
			for:'search',
			staffer_id:staffer_id
		};
	}


	$.ajax({
	    type: 'POST',
	    url: APISERVER+'/api/PartnerMessages/getPartnerLetterTrash.json',
	    data: total_params,
	    async: false,
	    dataType : "json",
	    success: function(data,status,xhr){
			data.response.status = is_undefined(data.response.status);
			if($('.confg').length!=0){
				$('.confg').remove();
			}
			if(data.response.status == 'success'){
				if(data.response.response.showpartneremailsetting=='showpartneremailsetting'){
						<?php 
						
						$one = __("To use the Inbox, you must enable the shared inbox feature");
						$two = __("click here");
						$three = __("to do so");
						
						?>
					$('#sorting_product_list').after("<br><div class='confg alert alert-info' style='text-align:center;'><?php echo $one.'. <a onclick=\'ss_show_modal()\'>'.$two.'</a> '.$three ; ?></div>");
					$('#next_page').val(0);
					configured = 'no';
					$('.searchloader').remove();
					return;
				}
				if(data.response.response.pagination.next_page!=null && data.response.response.pagination.next_page!=undefined){
					if(from!='search'){
						if(data.response.response.pagination.total_records!='' && data.response.response.pagination.total_records!=undefined && data.response.response.pagination.total_records!=null){
							$('#total_records').val(data.response.response.pagination.total_records);
						}
						else{
							$('#total_records').val(0);
						}
						if(data.response.response.pagination.next_page!=''){
							$('#next_page').val(data.response.response.pagination.next_page);
						}
						else{
							$('#next_page').val(0);
						}
						if(data.response.response.pagination.start_from!=''){
							$('#start').val(data.response.response.pagination.start_from);
							if(data.response.response.pagination.per_page!=''){
								$('#end').val(parseInt(data.response.response.pagination.start_from) + parseInt(data.response.response.pagination.per_page));
							}
						}
						else{
							$('#start').val(0);
							$('#end').val(0);
						}
					}

					appendMoreMailHtml(data.response.response.list,from,'addno');
					var np = $('#next_page').val();
					if(np==0){
						$('#loadmoreemail').remove();
						$('.portfolio-block').after('<div id="loadmoreemail"><div class="row-fluid text-center"><?php echo __("No more emails to load.") ?></div>');
					
					}
				}
			}
			else if(data.response.status == 'error'){
				return;
			}
	
	    },
	    error: function(xhr, status, error){
    		if(data.response.response.error == 'validationErrors'){
		        var mt_arr = data.response.response.list;
		        var array = $.map(mt_arr, function(value, index) {
		          return value+'<br />';
		        });
				showAlertMessage(array,'error',am);
		        return;
		    }else{
				showAlertMessage(data.response.response.msg,'error',am);
		        return;
		    }
    	},
    });
	
}
function appendMoreMailHtml(htmldata,from=''){

	var html ='';
	var sh = 0 ;
	var partnername = '<?php echo CakeSession::read("MEMBER.PartnerName"); ?>';
	for(var key in htmldata){
		/* Unread Message Class */
		cls ='';
		sh = sh + 71;
		if(htmldata[key].PartnerMessage.read == 0 || htmldata[key].PartnerMessage.read=='0'){
			cls = ' unread';
		}
		var sub = htmldata[key].PartnerMessageText.subject;
		/* Unread Message Class */

		/* Initials*/
		var a =''; var b ='';
		
		var initial1 = ''; var initial2 = '';
		if(htmldata[key].first!=undefined && htmldata[key].first!=null && htmldata[key].first!=''){
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
		var PartnerMessageid = htmldata[key].PartnerMessage.id;
		/* Initials*/


		html += '<tr class="ms ms'+PartnerMessageid+cls+' border_box_line test_class" onmouseenter="show_right_menu('+PartnerMessageid+');" onmouseleave="hide_right_menu('+PartnerMessageid+');">';
			html += '<td class="border_box_bottom span1 ms_uid1" onmouseover="show_chk_opt('+PartnerMessageid+');" onmouseout="hide_chk_opt('+PartnerMessageid+');">';

				html += '<div style="text-align:center;">'
							+'<div class="border_radius dp_img ms_img'+PartnerMessageid+'">'+initial1+initial2+'</div>'
							+'<div class="ms_chk_opt ms_chk'+PartnerMessageid+'" style="display: none;">'
								+'<input type="checkbox" class="myCheckBox" value="'+PartnerMessageid+'"/>'
							+'</div>'
						+'</div>';
			html += '</td>';
			var sender = htmldata[0].PartnerMessage.sender;
			html += '<td class="border_box_top span8 ms_line'+PartnerMessageid+'" onclick="show_msg_body('+PartnerMessageid+','+PartnerMessageid+',\'\',\'\',\''+sender+'\');">';
				html += '<table><tr class="" style=""><td class="border_box_last" style="border:none;" ><div class="span12">';	

					
					html += '<div class="span3" style="">';
						var first = '';
						var second = '';
						if(htmldata[key].first!=undefined && htmldata[key].first!=null){
							onearr = htmldata[key].first;
						}
						if(onearr.indexOf('<')==0){
							onearr = onearr.replace("<","");
				      		onearr = onearr.replace(">","");
				     		onearr = onearr.split("@");		
						} 
						else{
							onearr= onearr.split(" ");
						}
						var secondarr  = '';

						if(htmldata[key].second!=undefined && htmldata[key].second!=null){
							secondarr = htmldata[key].second;
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
						var pname = '<?php echo  CakeSession::read('MEMBER.UserFirstName'); ?>';
						pname = pname.split(" ");
						pname = pname[0];
						var IsAdmin = "<?php echo CakeSession::read('IsAdmin'); ?>";
						if(first==pname){
							if(IsAdmin!='Y'){
								first = '<?php echo __("me"); ?> ';
							}	
						
						}
						if(second==pname){
							if(IsAdmin!='Y'){
								second = '<?php echo __("me"); ?> ';
							}	
						
						}
							
						var hasdraft ='';
						var pmid1 = htmldata[key].PartnerMessageText.parent_message_id;
						if(htmldata[key].hasdraft!=0){
							var hasdraft = ',<span id="hasdraft'+pmid1+'" style="color:#d23f31"><?php echo " ".__("Draft")." "; ?></span>';
						}
						
								
						
						if(htmldata[key].getTotalCount !=-1 && htmldata[key].getTotalCount > 1){
							var namestr = first+', '+second+hasdraft;
							html += '<p id="a" style="width:100%;height:20px;overflow-y: hidden;" class="writer_name">'+namestr;
							var a = parseInt(htmldata[key].getTotalCount) ;
							html += '<span style="color:#757575">('+a+')</span>';
						}
						else{
							var namestr = second+hasdraft;
							html += '<p id="a" style="width:100%;height:20px;overflow-y: hidden;" class="writer_name">'+namestr;
						}
						html += '</p>';
					html += '</div>';
					html += '<div class="span9 msg_main">';
						html += '<span class="msg_sub">';
							html += StripTags(htmldata[key].PartnerMessageText.subject);
						html += '</span>';
						
						html += '&nbsp;-&nbsp;';

						html += '<span class="msg_body">';
							html += StripTags(htmldata[key].PartnerMessageText.message);
						html += '</span>';
					html += '</div>';

				html += '</div></td></tr></table>';
			html += '</td>';

			html += '<td class="border_box span2" style="cursor: default;">';
				html += '<div class="msg_menu_right msg_menu_right'+PartnerMessageid+'" style="text-align: right; margin-right: 20px; display: none; ">';
					
					html += '<a class="round_btn_icon btn icn-only" href="javascript:;"  onclick="set_custom_reply('+PartnerMessageid+','+PartnerMessageid+',this);" data-title="Compose mail" data-toggle="tooltip" data-placement="top" title="Reply"><i class="icon-reply" style=""></i></a>';
					
					html += '<a class="round_btn_icon btn icn-only" onclick="delete_letter_email('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="Delete" ><i class="icon-trash" style=""></i></a>';
					html += '<div class="btn-group btn-ell pull-right" id="right-btn-ellipsis-'+PartnerMessageid+'" style="">';
						html += '<span data-close-others="true" data-delay="100" data-toggle="dropdown"><a style="margin: 0px 2px;" class="round_btn_icon btn icn-only" onclick="set_dropdown(event,'+PartnerMessageid+');"><i class="icon-ellipsis-vertical right-btn-icon-'+PartnerMessageid+'"></i></a></span>';
						html += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
						
							html += '<li><a class="" href="javascript:;" style="text-decoration:none;" onclick="set_custom_reply('+PartnerMessageid+','+PartnerMessageid+',this);"><i class="icon-reply" style="color:#000000"></i>&nbsp;<?php echo __("Reply"); ?></a></li>';
							html += '<li><a class="" onclick="ss_show_dkmodal_for_forward_last('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="<?php echo __("Forward#"); ?>" ><i class="icon-arrow-right" style=""></i>&nbsp;<?php echo __("Forward#"); ?></a></li>';
						
							
							html += '<li><a class="" onclick="delete_letter_email('+PartnerMessageid+');"><i class="icon-trash" style="color:#000000"></i>&nbsp;<?php echo __("Delete"); ?></a></li>';
							
							if(htmldata[key].PartnerMessage.read == 0){
								html += '<li id="toggle_read_'+PartnerMessageid+'"><a class="" onclick="mark_as_unread('+PartnerMessageid+',\'makeread\');"><i class="icon-envelope-open-o" style="color:#000000"></i>&nbsp;<?php echo __("Mark as read"); ?></a></li>';
							}
							else{
								html += '<li id="toggle_read_'+PartnerMessageid+'"><a class="" onclick="mark_as_unread('+PartnerMessageid+',\'makeunread\');"><i class="icon-envelope-o" style="color:#000000"></i>&nbsp;<?php echo __("Mark as unread"); ?></a></li>';
							}
							
							// html += '<li class="divider"></li>';

							// html += '<li><a><strong><?php echo __("Move To folder"); ?></strong></a></li>';

							// html += '<li><a ><i class="icon-folder-close" style="color:#000000"></i><?php echo __("folder 1"); ?></a></li>';

							// html += '<li><a ><i class="icon-folder-close" style="color:#000000"></i><?php echo __("folder 2"); ?></a></li>';

							// html += '<li><a ><i class="icon-folder-close" style="color:#000000"></i><?php echo __("folder 3"); ?></a></li>';

						html += '</ul>';
					html += '</div>';

					 
				html += '</div>';
				var last_modified = moment(htmldata[key].PartnerMessage.last_modified).format('DD.MM.YY');
				html += '<div class="msg_menu_right_date'+PartnerMessageid+'" style="text-align: right; margin-right: 17px;">'+last_modified+'</div>';
			html += '</td>';
			
		html += '</tr>';

		html += '<tr class="ms_u ms_u'+PartnerMessageid+'"  style="display:none;" onclick="hide_msg_body('+PartnerMessageid+');">';
			html += '<td colspan="3" style="border:none;">';
		html += '</tr>';

		html += '<tr class="ms_m ms_m'+PartnerMessageid+'"  style="display:none;"><td colspan="3" style="border:none;">';
			html += '<div class="main_msg_box allSides" id="show_data">';
				html += '<div class="main_msg_sub">';
					html += '<span class="span9" onclick="hide_msg_body('+PartnerMessageid+');" >';
						html += '<h5>'+StripTags(htmldata[key].PartnerMessageText.subject)+'</h5>';
					html += '</span>';

					html += '<span class="span3" style="margin:10px 0px;text-align: right; float:right;">';
						var stext_id = htmldata[key].PartnerMessageText.id;
						var smsg_id = htmldata[key].PartnerMessage.id;
						
						html += '<a class="round_btn_icon btn icn-only" onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+stext_id+','+smsg_id+',\'all\');" data-toggle="tooltip" data-placement="top" title="<?php echo __("Reply"); ?>" ><i class="icon-reply" style=""></i></a>';
						html += '<a class="round_btn_icon btn icn-only" onclick="ss_show_dkmodal_for_forward_last('+PartnerMessageid+','+stext_id+','+smsg_id+',\'all\');" data-toggle="tooltip" data-placement="top" title="<?php echo __("Forward#"); ?>" ><i class="icon-arrow-right" style=""></i></a>';

						html += '<a class="round_btn_icon btn icn-only" onclick="delete_letter_email('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="<?php echo __("Delete"); ?>"><i class="icon-trash" style=""></i></a>';
						html += '<a class="round_btn_icon btn icn-only" onclick ="hide_msg_body('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="<?php echo __("Close"); ?>"> <i class="icon-remove"></i></a>';
					html += '</span>';
					html += '<div style = "clear:both;"></div>';

				html += '</div>';
				html += '<div class="main_msg_body" id="msg_bd_'+PartnerMessageid+'"></div>';

				html += '<div style="" class="reply-msg"><table style="width:100%;"><tbody><tr>';
					html += '<td class="border_box_first" style="border:none; vertical-align: top !important;">';
						if(htmldata[0].PartnerMessage.sender !='customer'){
							var email = htmldata[key].PartnerMessage.source_from.trim().split(" ");
						}
						else{
								var email = htmldata[key].PartnerMessage.email.trim().split(" ");
						}
						if(email !=''){
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
								if(htmldata[0].PartnerMessage.sender !='customer'){
									if(htmldata[0].PartnerMessage.source_from!='' && htmldata[0].PartnerMessage.source_from!=undefined && htmldata[0].PartnerMessage.source_from!=null){
										html += '<div><b class="writer_name">'+htmldata[0].PartnerMessage.source_from+'</b></div>';
									}
								}
								else{
									if(htmldata[0].PartnerMessage.email!='' && htmldata[0].PartnerMessage.email!=undefined && htmldata[0].PartnerMessage.email!=null){
										html += '<div><b class="writer_name">'+htmldata[0].PartnerMessage.email+'</b></div>';
									}
								}
								html += '<div class="btn-group">';
									var custname ='';
									if(htmldata[key].Customer.name!= undefined && htmldata[key].Customer.name!=null){

										var custname = htmldata[key].Customer.name;
									}
									var sourceFromEmail = htmldata[key].Customer.name+'</b> < '+custname+' >';
									if(htmldata[0].PartnerMessage.sender !='customer'){
										console.log('there');
										if(htmldata[0].PartnerMessage.source_from!='' && htmldata[0].PartnerMessage.source_from!=undefined && htmldata[0].PartnerMessage.source_from!=null){
											var sourceFrom = htmldata[key].PartnerMessage.email;
										}
									}
									else{
										if(htmldata[0].PartnerMessage.email!='' && htmldata[0].PartnerMessage.email!=undefined && htmldata[0].PartnerMessage.email!=null){
											console.log('here');
											var sourceFrom = htmldata[key].PartnerMessage.source_from;
										}
									}

									if(sourceFrom!= undefined && sourceFrom!=null && sourceFrom!=''){
										if(sourceFrom.indexOf('<')==0){
											sourceFrom = sourceFrom.replace("<","");
											sourceFrom = sourceFrom.replace(">","").trim();
											sourceEmail = sourceFrom;
											sourceFrom = sourceFrom.trim().split("@"); 
											sourceName = sourceFrom[0];
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
											console.log('sourceName'+sourceName);
											console.log('sourceEmail'+sourceEmail);
										}
									}
									html += '<div class="btn mini" onmouseover="event.stopPropagation();" style="background-color: #fff !important; padding-left: 0px;" data-toggle="dropdown"><?php echo __("To"); ?>&nbsp;<b class="writer_name">'+sourceFromEmail+'</b>&nbsp;&nbsp;<i class="icon-caret-down"></i></div>';
										html += '<ul class="dropdown-menu pull-right" style="width:200px;">';
											html += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-reply reply-btn"></i>&nbsp;<?php echo __("Reply"); ?></a></li>';
											html += '<li><a onclick="show_dkmodal_for_forward_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-arrow-right reply-btn"></i>&nbsp;<?php echo __('Forward'); ?></a></li>';
											html += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;<?php echo __("Edit recipients"); ?></a></li>';
											html += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;<?php echo __('Edit subject'); ?></a></li>';
										html += '</ul><div style="clear:both;"></div>';
									html += '</div>'
								html += '</div>';
								
								html += '<form action="/bookingengine/bkengine/frm_msg'+PartnerMessageid+'s/inbox2" class="form-vertical login-form frm'+PartnerMessageid+'" id="frm_msg'+PartnerMessageid+'" rowno="'+PartnerMessageid+'" name="frm_activity_list'+PartnerMessageid+'" style="margin: 0px;" onsubmit="event.returnValue = false; return false;" method="post" accept-charset="utf-8"><div style="display:none;"><input name="_method" value="POST" type="hidden"></div>';
									html += '<div class="reply-body" style="margin-top:10px;">';
										var pmid = htmldata[key].PartnerMessage.parent_message_id;
										html += '<textarea name="textarea[]" style="height:50px; border:none;" placeholder="<?php echo __("Reply"); ?>..." id="TemplateContent'+PartnerMessageid+'" class="m-wrap span12" onclick="reply_body_msg_show_tpl('+PartnerMessageid+','+pmid+');"></textarea></br>';
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
												var base_url = $('#BASE_URL').val();
												var formurl = base_url+'communication/send_reply_mail';
												html += '<button class="btn blue sssend" style="float:left; margin-right:5px;" onclick=\'set_reply_msg('+PartnerMessageid+',\"draft\",\"\",\"yes\");\'><i class="icon-check"></i>&nbsp;<?php echo __("Send"); ?></button>';

												html += '<button class="btn red ssdiscard" style="float:left; margin-right:5px;" onclick="reply_body_msg_hide_tpl('+PartnerMessageid+');"><?php echo __("Discard"); ?></button>';
												html += '<span style="font-size: 20px; background-color: white; height: 20px; width: 15px;"  class="btn fileinput-button"><span style="transform: rotate(45deg); display: block;"><i class="icon-paper-clip"></i></span><input type="file" name="files[]" id="files" class="files'+PartnerMessageid+'" multiple data-url="<?php echo Router::url(array("plugin" => "bkengin","controller" => "settings","action" => "upload"),true);?>" ></span>';
												html += '<div id="editorPlace'+PartnerMessageid+'" style="float:left; width:70%;"><i class="icon-circle draft_progress" style="float:right;color:#d23f31;margin-top: 12px;"></i><i class="icon-ok draft_complete" style="display:none;float:right;color:green;margin-top: 12px;"></i></div>';
												html += '<div style="clear:both;""></div>';
												html += '<input type="hidden" name="reply_msg_body'+PartnerMessageid+'" id="reply_msg_body'+PartnerMessageid+'" value="">';
												html += '<input type="hidden" name="field_id[]" class="field_id" value="">';
												html += '<input type="hidden" name="request_from'+PartnerMessageid+'" id="request_from'+PartnerMessageid+'" value="inbox">';
												html += '<input type="hidden" id="msg_sub_'+PartnerMessageid+'" name="msg_sub_'+PartnerMessageid+'" value="'+sub+'" >';
												html += '<input type="hidden" id="msg_id_'+PartnerMessageid+'" name="msg_id_'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
												var cust_email = '';
												var cust_email = '';
												if(sourceEmail!=undefined &&sourceEmail != ''  && sourceEmail!=''){
													cust_email = sourceEmail;
												}
												else{
													cust_email = htmldata[key].Customer.email;
												}
												html += '<input type="hidden" id="cust_email_'+PartnerMessageid+'" name="cust_email_'+PartnerMessageid+'" value="'+cust_email+'" >';
												var cust_name = '';
												if(sourceName != ''){
													cust_name = sourceName;
												}
												else{
													cust_name = htmldata[key].Customer.name;
												}
												html += '<input type="hidden" id="cust_name_'+PartnerMessageid+'" name="cust_name_'+PartnerMessageid+'" value="'+cust_name+'" >';
												html += '<input type="hidden" id="cust_id_'+PartnerMessageid+'" name="cust_id_'+PartnerMessageid+'"  value="0" >';
												html += '<input type="hidden" id="cust_con_id_'+PartnerMessageid+'" name="cust_con_id_'+PartnerMessageid+'"  value="0">';
												html += '<input type="hidden" id="last_msg_text_id_'+PartnerMessageid+'_'+PartnerMessageid+'" >';
												html += '<input id="final_attachments'+PartnerMessageid+'" type="hidden" value="" name="final_attachments'+PartnerMessageid+'">';
												html += '<input id="from_inbox'+PartnerMessageid+'" type="hidden" value="inbox" name="from_inbox'+PartnerMessageid+'">';
												if(htmldata[0].PartnerMessage.sender!='customer'){
													html += '<input id="reply_from_'+PartnerMessageid+'" type="hidden" value="'+htmldata[key].PartnerMessage.source_from+'" name="reply_from_'+PartnerMessageid+'">';
												}
												else{
														html += '<input id="reply_from_'+PartnerMessageid+'" type="hidden" value="'+htmldata[key].PartnerMessage.email+'" name="reply_from_'+PartnerMessageid+'">';
												}
											html += '</div>';
										html += '</div>';
									html += '</div>';
								html += '</form>';
							html += '</div>';
					html += '</td>';
				html += '</tr></tbody></table></div>';
			html += '</div>';
		html += '</td></tr>';

	}
	if(from==''){
		$('.inboxend').remove();	
		$('.searchloader').remove();
		$('#loadmoreemail').remove();	
		if(html!=''){
			$('#sorting_product_list>tbody').append(html);
		}
		else{
			$('#sorting_product_list').after('<br/><div class="alert inboxend alert-info" style="text-align:center;"><?php echo __("Your Trash item listing is empty"); ?></div>');
		}
		var next_page =  $('#next_page').val();
		$('input[type=checkbox]').uniform();
		//$('body').css('overflow','');
		//$(window).scrollTop(sh-50);
		var browser_name = '<?php echo  env("HTTP_USER_AGENT"); ?>';
		 var n = browser_name.indexOf("Chromium");
		if(n!=-1){
			$(window).scrollTop(sh);
		}
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
			$('.portfolio-block').after('<div id="loadmoreemail"><div class="row-fluid text-center">'+rem+'&nbsp;<?php echo __("more emails to load.") ?></div>');
		}
		else{
			console.log('qq');
			$('#loadmoreemail').remove();
			$('.portfolio-block').after('<div id="loadmoreemail"><div class="row-fluid text-center"><?php echo __("No more emails to load.") ?></div>');
		}
		localStorage.setItem('ajaxstart','false');
		
	}
	else if(from=='clearsearch'){
		$('.inboxend').remove();	
		$('.searchloader').remove();
		$('#loadmoreemail').remove();	
		if(html!=''){
			$('#sorting_product_list>tbody').html(html);
		}
		else{
			$('#sorting_product_list').after('<br/><div class="alert inboxend alert-info" style="text-align:center;"><?php echo __("Your Trash item listing is empty"); ?></div>');
		}
		var next_page =  $('#next_page').val();
		$('input[type=checkbox]').uniform();
		//$('body').css('overflow','');
		//$(window).scrollTop(sh-50);
		var browser_name = '<?php echo  env("HTTP_USER_AGENT"); ?>';
		 var n = browser_name.indexOf("Chromium");
		if(n!=-1){
			$(window).scrollTop(sh);
		}
		localStorage.setItem('ajaxstart','false');
		
	}
	else if(from=='search'){
			$('.searchloader').remove();
			localStorage.setItem('ajaxstart','true');
			if(html!=''){
				$('#sorting_product_list>tbody').html(html);
			}
			else{
				$('#sorting_product_list').after('<br><div class="inboxend alert alert-info" style="text-align:center;"><?php echo __("No emails found."); ?></div>');
			
			}
	}
	$('input[type=checkbox]').uniform();
}

$(document).ready(function(){

   	$(document).scrollTop(0);
   	setTimeout(function(){$(document).scrollTop(0);},10);
   	var is_mobile = '<?php echo $this->request->isMobile(); ?>';
   	if(is_mobile=='1'){
   		 btn =20;//bth = 60; btn =20;
   	}
   	else{
   		
   		bth = 0; //bth = 34;
   	}
	
	$(window).on('scroll', function() {
		if(localStorage.getItem('ajaxstart')=='false'){

			if (document.body.scrollHeight - bth -  $(this).scrollTop()  <= $(this).height()){
				$('#loadmoreemail').remove();
				
			    
		   		var next_page =  $('#next_page').val();
				if(localStorage.getItem('ajaxstart')=='false' &&  parseInt(next_page)!=0){
					//$('body').css('overflow','hidden'); 
					var crouter_url = $('#crouter_url').val();

					$('.portfolio-block').after('<div id="loadmoreemail" class="row-fluid text-center"><img src="'+crouter_url+'/img/loading.gif"></div>');
					localStorage.setItem('ajaxstart','true');
						setTimeout(function(){
							$('body,html,.page-container,.page-content').attr('style','height:auto');
							getMoreEmails();
						},1000);
				}else{
					$('#loadmoreemail').remove();
					localStorage.setItem('ajaxstart','false');
					//$('body').css('overflow','');
					$('.portfolio-block').after('<div id="loadmoreemail"><div class="row-fluid text-center"><?php echo __("No more emails to load.") ?></div>');
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
});

function UpdatePartnerMessageHtmlInbox(){
	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var language = $('#language').val();
	var partner_id = $('#partner_id').val();
	var staffer_id = $('#staffer_id').val();
	var total_params = 'token='+token+'&partner_id='+partner_id+'&direction=DESC&limit=10&read=1&staffer_id='+staffer_id;

	var data = passProdRequest(APISERVER+'/api/PartnerMessages/getPartnerLetterInBox.json',total_params);
	if(data == undefined){
		var json_data = $('#json_data').val();
		var data = JSON.parse(json_data);
		data.response.status = is_undefined(data.response.status);
		if(data.response.status == 'success'){
			var htmldata = data.response.response.list;
			var html ='';
			var count = htmldata.length;
			$(".badge_inbox").remove();
			if(count!=0){
				$("#mass_inbox span.title").after("<span class=\'badge badge_inbox badge-custom\' style=\'float:none; margin-left:10px;\'>"+count+"</span>");
			}
			var base_url = $('#BASE_URL').val();
			var view_all = '<a class="view_all" style="border: none !important;border: none !important;float: right;padding: 0 !important;color:#5b9bd1;line-height: 1" href="'+base_url+'/communication/inbox"><?php echo __("view all"); ?></a>';
			var partnername = '<?php echo CakeSession::read("MEMBER.PartnerName"); ?>';
			textone  = '<?php echo __("You have %count% new message");  ?>';
			textmany = '<?php echo __("You have %count% new messages"); ?>';
			if(count==1){
				text = textone.replace("%count%",'<span class="bold">'+count+'</span>');
			}else{
				text = textmany.replace("%count%",'<span class="bold">'+count+'</span>');
			}
			text = text+view_all;
					  	
			html += '<li class="dropdown" id="header_message_bar"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="icon-envelope-open" style="margin:0"></i>';
			html += '<span class="badge">'+count+'</span>';
			html +='</a><ul style="width:280px !important" class="as dropdown-menu extended notification"><li style="padding: 7px 0;background-color:#eee">';
			html += '<p class="msg_notifi">'+text+'</p></li>';
			html += '<li><ul id="header_message_bar_dd" class="dropdown-menu-list scroller" style="height:250px">';
			
			var htmlinn ='';

			for(var key in htmldata){			
				if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
					var n = htmldata[key].PartnerMessage.source_from.trim().split(" ");
					var aa =''; var bb='';
					if(n[0]!=undefined){
						aa= n[0];
					}
					if(n[1]!=undefined){
						bb= n[1];
					}
					if(aa=='<'){
						aa='';
					}
					if(bb=='<'){
						bb='';
					}
					var namestr = aa+' '+bb;
				}
				else if(htmldata[key].Customer.name!=undefined && htmldata[key].Customer.name!=null && htmldata[key].Customer.name!=''){
					var n = htmldata[key].Customer.name.trim().split(" ");
					var aa =''; var bb='';
					if(n[0]!=undefined){
						aa= n[0];
					}
					if(n[1]!=undefined){
						bb= n[1];
					}
					if(aa=='<'){
						aa='';
					}
					if(bb=='<'){
						bb='';
					}
					var namestr = partnername+','+aa+' '+bb;
				}
				else{
					var namestr = partnername.substring(0,13);
				}
				var initial1 = ''; var initial2 = '';
				if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
					var n = htmldata[key].PartnerMessage.source_from.trim().split(" ");
					if(n[0]!=undefined){
						initial1 = n[0].substring(0,1).toUpperCase();
					}
					if(n[1]!=undefined){
						initial2 = n[1].substring(0,1).toUpperCase();
					}
					if(initial1=='<'){
						initial1='';
					}
					if(initial1=='<'){
						initial2='';
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
					if(initial1=='<'){
						initial1='';
					}
					if(initial1=='<'){
						initial2='';
					}
				}
				var id = htmldata[key].PartnerMessage.id;
				var parent_message_id = htmldata[key].PartnerMessage.parent_message_id;
				htmlinn += '<li><a href="javascript:;" onclick="ss_message_click('+parent_message_id+','+id+')">';
					htmlinn += '<span class="photo"><span class="border_radius_message">'+initial1+initial2+'</span></span>';
					htmlinn += '<span class="subject">';
						htmlinn += '<span class="from">'+namestr+'</span>';
						htmlinn += '<span class="time">'+htmldata[key].PartnerMessageText.time_text+'</span>';
					htmlinn += '</span>';
					var subj = '';
					if(htmldata[key].PartnerMessageText.subject!=undefined && htmldata[key].PartnerMessageText.subject!=null && htmldata[key].PartnerMessageText.subject!=''){
						var subj = htmldata[key].PartnerMessageText.subject.trim().substr(0,70);
					}
					htmlinn += '<span class="message">'+subj+'</span>';
				htmlinn += '</a></li>';
				
				
			}
			html += htmlinn+'</ul></li></ul></li>';
			$("#header_message_bar").remove();	
			if(count!=0){
			   	 $('div.header ul.pull-right li.user').before(html);
			   	setTimeout(function(){
					$("#header_notification_bar").off();
					$("#header_message_bar.dropdown").off();
					$("#header_message_bar .dropdown-toggle").off();
					$(".scroller").slimScroll({height:"250px"});
				},100);
			}	
		}
		else if(data.response.status == 'error'){
			return;
		}
	}
}



function ss_show_draft_dkmodal(parent_message_id,text_id,message_id){
	$('.mgs_sub_list').css('pointer-events','all');
	$('#mgs_sub_list_row'+parent_message_id+message_id+message_id).css('pointer-events','none');
	var modal = ss_show_dkmodal_for_editdraft(parent_message_id,text_id,message_id);

	setTimeout(function(){
		$('#dockeditordkmod'+modal).after('<i class="icon-circle draft_progress_popup" style="float:right;color:#d23f31;margin-top: 12px;display:none"></i><i class="icon-ok draft_complete_popup" style="display:block;float:right;color:green;margin-top: 12px;"></i>');
	},1500);

		
																					

	$('#dkmod'+modal).parent().prev('div').children('.action-close').click(function(){
		$('#mgs_sub_list_row'+parent_message_id+message_id+message_id).css('pointer-events','all');

		var obj = JSON.parse(getdkmodalStorage('dkmod'+modal));
		var ss_msg_id = obj.message_id;
		ss_letters_custom_mail(modal,'draft','','no',ss_msg_id);
		localStorage.removeItem('editdraftids'+ss_msg_id);
		localStorage.removeItem('dkmod'+modal);
		
	});

	//localStorage.removeItem('editdraftids');

	var editdraftids = {};
	var pmid = text_id;
	var pmi = message_id;
	var editdraftids = {partner_message_text_id:pmid,partner_message_id:pmi,isdraft:'y'};
	editdraftids = JSON.stringify(editdraftids);
	localStorage.setItem('editdraftids'+pmi,editdraftids);

	setTimeout(function(){
			var timeouts1 = [];
		CKEDITOR.instances['cst_textarea'+modal].on('change', function(e) {
			$('.draft_progress').show();
			$('.draft_complete').hide();
			$('.draft_progress_popup').show();
			$('.draft_complete_popup').hide();
		
			for (var i = 0; i < timeouts1.length; i++) {
				clearTimeout(timeouts1[i]);
			}
			timeouts1 = [];
			if(localStorage.getItem('editdraftids'+pmi)!=null){
				timeouts1.push(
					setTimeout(function(){
						ss_letters_custom_mail(modal,'draft',parent_message_id,'no',message_id); 

					}, 2000)
				);
			}
		});
	},1500);
}
function ss_delete_trash(parent_message_id,message_id){
	var confiem_msg = '<?php echo __("Are you sure you want to delete this?"); ?>';
	var confiem_msg_string='<?php echo __("Are you sure you want to delete this?"); ?>';
	
	
	title = $('#confirmation_btn_text').length >0 ?$('#confirmation_btn_text').val():'Alert message';
	
	$("#bkengine_alert_box" ).html(confiem_msg);
	$("#bkengine_alert_box" ).dialog({
		dialogClass: 'ui-dialog-blue',
		modal: true,
		title:title,
		resizable: false,
		height: 180,
		//width: 380,
		modal: true,
		buttons: [
			{
				'class' : 'btn red',	
				"text" : $('#delete_btn_text').val(),
				click: function() {
					$(this).dialog( "close" );
					ss_delete_trash1(parent_message_id,message_id);
					
				}
			},
			{
				'class' : 'btn',
				"text" : $('#cancel_btn_text').val(),
				click: function() {
				$(this).dialog( "close" );
				}
			}
		]
	});
}

function ss_delete_trash1(parent_message_id,message_id){
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

	var total_params = 'token='+token+'&partner_id='+partner_id+'&parent_message_id='+parent_message_id+'&message_id='+message_id+'&from_inbox=trash';

	var data = passProdRequest(APISERVER+'/api/PartnerMessages/ssDeleteDraft.json',total_params);

	if(data == undefined){
		var json_data = $('#json_data').val();
		var data = JSON.parse(json_data);
		data.response.status = is_undefined(data.response.status);
		var getThreadDetails = data.response.response.getThreadDetails;
		if(getThreadDetails.PartnerMessage!=undefined && getThreadDetails.PartnerMessage!=null && getThreadDetails.PartnerMessage!=''){
				var sFrom =  getThreadDetails.PartnerMessage.source_from;
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
				
				var IsAdmin1 = '<?php echo CakeSession::read("IsAdmin"); ?>';
			
			
				
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
				var pname = '<?php echo  CakeSession::read('MEMBER.UserFirstName'); ?>';
				pname = pname.split(" ");
				pname = pname[0];
				var IsAdmin = "<?php echo CakeSession::read('IsAdmin'); ?>";
				if(one==pname){
					if(IsAdmin!='Y'){
						one = '<?php echo __("me"); ?> ';
					}	
				
				}
				if(two==pname){
					if(IsAdmin!='Y'){
						two = '<?php echo __("me"); ?> ';
					}	
				
				}
				var one = sFrom+ ', ';
				var three ='';
				if(getThreadDetails.hasdraft!=0){
					var three = ', <span style="color:#d23f31"><?php echo __("Draft"); ?> </span>';
				}
				var four = '<span style="color:#757575"> ('+getThreadDetails.getTotalCount+')</span>';
				
				string = one+two+three+four;
				console.log('string'+string);
				pmid = getThreadDetails.PartnerMessage.parent_message_id;
				if(pmid==0){
					pmid = getThreadDetails.PartnerMessage.id;	
				}
				pmid = parseInt(pmid);
				localStorage.removeItem('draftids');
				$('.ms_line'+pmid+ ' p.writer_name:first').html(string);
				
			}
		else if(data.response.status == 'error'){
			if(data.response.response.error == 'validationErrors'){
				var mt_arr = data.response.response.list;
				var array = $.map(mt_arr, function(value, index) {
					return value+'<br />';
				});
				showAlertMessage(array,'error','<?php echo __('Alert message')?>');
				return;
			}
			else{
				showAlertMessage(data.response.response.msg,'error','<?php echo __('Alert message')?>');
				return;
			}	
		}
	}
}
$(document).ready(function(){
	getMoreEmails();
});
$('body,html,.page-container,.page-content').attr('style','height:auto');
</script>
<style>
@media (max-width: 480px) {
	div.token-input-dropdown {
		width: 270px !important;
	}
}
@media (max-width: 320px) {
	div.token-input-dropdown {
		width: 230px !important;
	}
}

.testClass{
	display: inline-block;
	overflow-wrap: break-word;
	word-wrap: break-word;
	word-break: normal;
	line-break: strict;
	hyphens: none;
	-webkit-hyphens: none;
	-moz-hyphens: none;
}
.testClass img{
	width: 100% ;
	height:0;
}

.icon-download{
	font-size: 18px;
	color : #bdbdbd;
}
.portfolio-block{
	margin-bottom: 50px !important;
}
</style>
