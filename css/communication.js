var sslang = $('#lang').val();
var caction = $('#caction').val();
var IsAdmin = $('#IsAdmin').val();
var PartnerName = $('#PartnerName').val();
var crouter_url = $('#crouter_url').val();
var UserFirstName = $('#UserFirstName').val();
var login_id = $('#login_id').val();
var notificationmsgone = $('#notificationmsgone').val();
var notificationmsgmany = $('#notificationmsgmany').val();
var textone = $('#textone').val();
var textmany = $('#textmany').val();

if(sslang == 'en'){
  var rep = 'Reply';
  var sen = 'Send';
  var dis = 'Discard';
  var fwd = 'Forward';
  var draf = 'Draft';
  var vie = 'view all';
  var mee = 'me';
  var del = 'Delete';
  var mtf = 'Move To Folder';
  var fol = 'folder1';
  var cls = 'Close';
  var too = 'To';
  var to = 'to';
  var er = 'Edit recipients';
  var es = 'Edit subject';
  var prn = 'Print';
  var shs = 'Show Source';
  var sps = 'Spreadsheet';
  var suc = 'Success';
  var am  = 'Alert Message';
  var nrf ='No Record Found';
}
else if(sslang == 'nb'){
  var rep = 'Svar';
  var sen = 'Send';
  var dis = 'Forkast';
  var draf = 'Kladd';
  var fwd = 'Forward';
  var vie = 'view all';
  var mee = 'me';
  var del = 'Slett';
  var mtf = 'Move To Folder';
  var fol = 'folder1';
  var cls = 'Lukk';
  var to = 'til';
  var too = 'Til';
  var er = 'Edit recipients';
  var es = 'Edit subject';
  var prn = 'Print';
  var shs = 'Show Source';
  var sps = 'Spreadsheet';
  var suc = 'Utført';
  var am  = 'Advarsel';
  var nrf ='Ingen oppføringer';
}

function ss_delete_trash_head(parent_message_id,message_id){
	if(message_id!=''){
    message_id = parseInt(message_id);
  }
  if(parent_message_id!=''){
    parent_message_id = parseInt(parent_message_id);
  }
  else{
  	parent_message_id = message_id;
  }
 
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var partner_id = $('#partner_id').val();

  var total_params = 'token='+token+'&partner_id='+partner_id+'&parent_message_id='+parent_message_id+'&message_id='+message_id;

  var data = passProdRequest(APISERVER+'/api/PartnerMessages/ssDeleteDraft.json',total_params);

  if(data == undefined){
    var json_data = $('#json_data').val();
    var data = JSON.parse(json_data);
    data.response.status = is_undefined(data.response.status);
    if(data.response.status == 'success'){
      var string ='';
      var pmid;
      var getThreadDetails = data.response.response.getThreadDetails;
      if(action=='draft'){
      	$('.ms'+message_id).remove();
       	$('.ms_u'+message_id).remove();
        $('.ms_m'+message_id).remove();
        $('.ms_l'+message_id).remove();
        return;
      }
      if(getThreadDetails.PartnerMessage!=undefined && getThreadDetails.PartnerMessage!=null && getThreadDetails.PartnerMessage!=''){
        var action = $('#caction').val();
        if(action!='inbox'){
          return;
        }
        var sFrom =  getThreadDetails.PartnerMessage.source_from;
        sFrom = sFrom.replace("<","&nbsp;");
        sFrom = sFrom.replace(">","&nbsp;");
        sFrom = sFrom.split("&nbsp;");
        sFrom = sFrom[0];
        sFrom = sFrom.split(" ");
        sFrom = sFrom[0];
        
        var IsAdmin1 = $('#IsAdmin').val();
        var one = sFrom;
        if(IsAdmin1!='Y' && sslang=='en'){  
          var one = 'me, ';
        }
        else if(IsAdmin1!='Y' && sslang=='nb'){

        }

        var two =  getThreadDetails.PartnerMessage.email;
        two = two.replace("<","&nbsp;");
        two = two.replace(">","&nbsp;");
        two = two.split("&nbsp;");
        two = two[0];
        two = two.split(" ");
        two = two[0];
        var three ='';
        var three = ', <span style="color:#d23f31">'+draf+'</span>';
        var four = ' ('+getThreadDetails.getTotalCount+')';
        
        string = one+two+three+four;
        pmid = getThreadDetails.PartnerMessage.parent_message_id;
        pmid = parseInt(pmid);
      }
      else{
        string = getThreadDetails.onethread;
        pmid = parseInt(getThreadDetails.pmid);
        var msg_body = getThreadDetails.message;
        msg_body = StripTags(msg_body);
        $('.ms_line'+pmid+ ' div.msg_body').html(msg_body);
      }
      var action = $('#caction').val();
      if(action=='draft' && parent_message_id!=0){
        $('.ms'+message_id).remove();
        $('.ms_u'+message_id).remove();
        $('.ms_m'+message_id).remove();
        $('.ms_l'+message_id).remove();
      }
      //console.log('checkthis#mgs_sub_list_row'+parent_message_id+message_id+message_id);
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
        if(sslang=='en'){
        	showAlertMessage(array,'error','Alert message');
        }
        else if(sslang=='nb'){
        	showAlertMessage(array,'error','Advarsel');
        }
        return;
      }
      else{
      	if(sslang=='en'){
        	showAlertMessage(data.response.response.msg,'error','Alert message');
      	}
      	else if(sslang=='nb'){
        		showAlertMessage(data.response.response.msg,'error','Advarsel');
        }
        return;
      } 
    }
  }
}

function set_reply_msg_reply(lineID,draft='',parent_message_id='',sendmail='no',deletes='no'){
  var body = CKEDITOR.instances['cst_textarea'+lineID].getData();
  $('#reply_msg_body'+lineID).val(body);
  $('.field_id').val(lineID);
  if(draft==''){
    ss_send_reply_mail_reply(lineID,'',parent_message_id,sendmail,deletes);
  }
  else if(draft=='draft'){
    ss_send_reply_mail_reply(lineID,'draft',parent_message_id,sendmail,deletes);
  }
}

function ss_send_reply_mail_reply(lineID,draft='',parent_message_id='',sendmail,deletes){
  var no = lineID;
  //console.log('ss_send_reply_mail_replyn'+no);
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var partner_id = $('#partner_id').val();
  var frm_name = '#frm_modal_msg'+no;
  var customer_email = $(frm_name+'  [name=customer_email]').val();
  var cc = $(frm_name+' [name=cc]').val();
  var bcc  = $(frm_name+' [name=bcc]').val();
  var mail_subject = $(frm_name+' [name=subject]').val();

  $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
  var mail_body = $(frm_name+' [name=message_body]').val();
  var attachments = $(frm_name+' [name=msg_attachments]').val();
  var attachments = escape(attachments);
  //console.log(attachments);
  var a = $(frm_name).serializeArray();
  for(var kk in a){
    if(kk==1){
      var customerData = a[kk].value;
    }
  }
  if(customerData!=undefined && customerData!=null && customerData!=''){
    var customerData2  = JSON.parse(customerData);
    var cust_name  = customerData2.name;
    var msg_id ='';
    if(customerData2.msg_id!=undefined){
      msg_id = customerData2.msg_id;
    }
    var reply_from ='';
    if(customerData2.reply_from!=undefined){
   	 reply_from = customerData2.reply_from;
    }
    var from_inbox ='';
    if(customerData2.from_inbox!=undefined){
      from_inbox = customerData2.from_inbox;
    }
  }
  var sender = $('#type').val();
  if(customer_email!='' && customer_email!=null && customer_email!=undefined) {
      customer_email = customer_email.split(',');
      customer_email = JSON.stringify(customer_email);
  }
  if(cc!='' && cc!=null && cc!=undefined) {
    cc = cc.split(',');
  }
  if(bcc!='' && bcc!=null && bcc!=undefined) {
    bcc = bcc.split(',');
  }

  var params  = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,msg_id:'',email_adr:customer_email,customer_name:cust_name,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,cc:cc,bcc:bcc};
  var whereto = '';
  if(draft==''){
    whereto = 'sendCommunicationCustomEmail';
    
  }
  else if(draft=='draft'){
    whereto = 'saveToDraftonChange';
    if(localStorage.getItem('dkmod'+no)!=null && jQuery.isEmptyObject(localStorage.getItem('dkmod'+no))!=true){
      var id = localStorage.getItem('dkmod'+no);
      var getdraftids = JSON.parse(localStorage.getItem('editdraftids'+id));
      var partner_message_text_id = getdraftids.partner_message_text_id;
      var partner_message_id = getdraftids.partner_message_id;
      
      if(partner_message_text_id!=null && partner_message_text_id!=undefined && partner_message_text_id!=''){
        whereto ='updateDraftOnChange';
        if(sendmail=='no'){
        
          var params = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,msg_id:'',email_adr:customer_email,customer_name:cust_name,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail,cc:cc,bcc:bcc};

      
        }
        else if(sendmail=='yes'){
           var params  = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,msg_id:'',email_adr:customer_email,customer_name:cust_name,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,cc:cc,bcc:bcc,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail};
        }
      }
    }
  }
  
  $.ajax({
    type: 'POST',
    url: APISERVER+'/api/PartnerMessages/'+whereto+'.json',
    data: params,
    async: false,
    dataType : "json",
    success: function(data,status,xhr){
      data.response.status = is_undefined(data.response.status);
      if(data.response.status == 'success'){
        $('.draft_progress_reply').hide();
        $('.draft_complete_reply').show();
        if(whereto == 'saveToDraftonChange'){
        var editdraftids = {};
        var pmid = data.response.response.partner_message_text_id;
        var pmi = data.response.response.partner_message_id;
        var editdraftids = {partner_message_text_id:pmid,partner_message_id:pmi,issent:'y'};
        editdraftids = JSON.stringify(editdraftids);
        localStorage.setItem('editdraftids'+pmi,editdraftids);

        localStorage.setItem('dkmod'+no,pmi);
        
        
        }
        if(deletes=='yes'){
          //console.log('deletes'+no);
          var id = localStorage.getItem('dkmod'+no);
          var ss_msg_id= localStorage.getItem('dkmod'+no);
          localStorage.removeItem('editdraftids'+id);
        
        }
        if(whereto=='saveToDraftonChange' ){

          $('#dkmod'+no).parent().prev('div').children('.action-close').click(function(){
              var obj = getdkmodalStorage('dkmod'+no);
            //obj =  JSON.parse(getdkmodalStorage('draftids'+obj));
            
            var editdraftids = localStorage.getItem('editdraftids');
            localStorage.removeItem('dkmod'+no);
          
          
            localStorage.removeItem('editdraftids'+obj);
          });
        }
        if(sendmail=='yes'){
          var obj = getdkmodalStorage('dkmod'+no);
          //obj =  JSON.parse(getdkmodalStorage('draftids'+obj));
          
          localStorage.removeItem('dkmod'+no);
        
          localStorage.removeItem('editdraftids'+obj);
          $('#dkmod'+no).dockmodal('destroy');
						call_toastr('success', suc,data.response.response.message);
        }
      }
      else if(data.response.response.error == 'validationErrors'){
        var mt_arr = data.response.response.list;
        var arraay = $.map(mt_arr, function(value, index) {
          return value+'<br />';
        });
        showAlertMessage(arraay,'error',am);
       
        return;
      }else{
            showAlertMessage(data.response.response.msg,'error',am);
        return;
      }
    },
    error: function(xhr, status, error){
      if(data.response.response.error == 'validationErrors'){
        var mt_arr = data.response.response.list;
        var arraay = $.map(mt_arr, function(value, index) {
          return value+'<br />';
        });
        showAlertMessage(arraay,'error',am);
       
        return;
      }else{
        	  showAlertMessage(data.response.response.msg,'error',am);
        return;
      }
      return ;
    }
  });
}
        

function bindFunctions(ind,from='',ss_msg_id=''){
  //write functions here, for dynamically generated html
  //save form data to storage
  $('.fileupload_form_class'+ind).focusout( function(){
    setFormdataStorage(ind);
  });
    
    //file upload code 
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var lang   = $('#lang').val();
  var partner_id = $('#partner_id').val();
  var admin_id = $('#admin_id').val();
  var crouter_url = $('#crouter_url').val();
  var modal_attached_array = [];
  var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&admin_id='+admin_id+'';
  $('.fileupload_form_class'+ind).fileupload({
    acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|txt|doc|docx|xlsx|xls|pdf|zip)$/i,
    url: APISERVER+'/api/search/uploadCustomMailLogo.json?admin_id='+admin_id,
    autoUpload: true,
    add: function (e, data) {
    	var addHtml = '';
      var jqXHR = data.submit()
      .success(function (result, textStatus, jqXHR) {
        if(result.response.status == 'success'){  
          if($('.attachments_cst'+ind).val()){
            modal_attached_array = JSON.parse($('.attachments_cst'+ind).val());
          }
          else{
            modal_attached_array = [];
          }
          
          $.each(result.response.response.files, function (index, file) { 
            if(file.error != undefined || file.error != null){
              showAlertMessage(file.error,'error');
              }
            else{ 
              var delete_url = file.delete_url+'&admin_id='+admin_id;
              file.delete_url = delete_url; 
              modal_attached_array.push(file);
              var file_type_name = getFileDetailsParam(file.orig_name);
                file_type_name = file_type_name ? file_type_name : 'text';
              if(file.orig_name.length > 35){
                show_name = file.orig_name.substr(0,35)+'...';
              }
              else{
                show_name = file.orig_name;
              }
              addHtml += '<div class="at_block"><table><tr class="template-download fade in">';
              if(file.thumbnail_url != undefined){
                addHtml += '<td><a title="'+file.orig_name+'" target="_blank" href="'+file.url+'" data-rel="fancybox-button" class="fancybox-button kY"><img src="'+file.thumbnail_url+'" style="width:100%; height:100%;"></a>';
                addHtml += '<span class="delete"><button data-url="'+delete_url+'" data-type="DELETE" class="btn mini remv-at"><i class="icon-remove"></i></button></span></td>';
              }
              else{
                addHtml += '<td><a title="'+file.orig_name+'" target="_blank"  href="'+file.url+'" data-rel="fancybox-button" class="fancybox-button kY">';
                addHtml += '<div style="padding: 5px; word-wrap: break-word; height:75%;"><span>'+show_name+'</span></div>';
                addHtml += '<div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_'+file_type_name.toLowerCase()+'.png" alt="icon"><span style="padding-left: 10px;">'+file_type_name+'</span></div></a>';
                addHtml += '<span class="delete"><button data-url="'+delete_url+'" data-type="DELETE" class="btn mini remv-at"><i class="icon-remove"></i></button></span></td>';
              }
              addHtml += '</tr></table></div>'; 
            }               
          }); //foreach end here
	        $('.cst_files'+ind+' > .files').append(addHtml);
	        $('.attachments_cst'+ind).val(JSON.stringify(modal_attached_array));
	        //set formdata
	        setFormdataStorage(ind);
          if(from=='new'){
             //console.log('fileuploadnew');
             OnChangeNew(ind);
          }
          else if(from=='reply'){
             //console.log('fileuploadreply');
             OnChangeReply(ind);
          }
          else if(from=='reload'){
             //console.log('fileuploadreload');
             OnchangeDock(ind,ss_msg_id);
          }
        }
      })
      .error(function (jqXHR, textStatus, errorThrown) {
        $('#at_progress'+ind).hide();
        $('.template-upload').hide();
        $('.template-upload .error span').remove();
          showAlertMessage($('.template-upload .error').html(),'error','error');
        })
      	.complete(function (result, textStatus, jqXHR) {  
        $('#at_status'+ind).hide();
        $('#at_progress'+ind).hide();
      });
    },
    progressstart: function (e, data) {
      $('#at_status'+ind).show();
      $('#at_progress'+ind).show();
    },
    progressall: function (e, data) {
      $('#at_status'+ind).show();
      $('#at_progress'+ind).show();
      var progress = parseInt(data.loaded / data.total * 100, 10);
      $('#at_progress'+ind+' .bar').css(
        'width',
        progress + '%'
      );
      $('#at_percent'+ind).html(progress + '%');
    },
  });
  $('.fileupload_form_class'+ind).bind('fileuploaddestroy', function (e, data) {
    json_arr = $('.attachments_cst'+ind).val();
    delete_url = data.url;
    arr = JSON.parse(json_arr);
    var j_arr = removeItem(arr, 'delete_url', delete_url);
    modal_attached_array = j_arr;
    $('.attachments_cst'+ind).val(JSON.stringify(modal_attached_array));
    //update form data
    setFormdataStorage(ind);
    if(from=='new'){
       //console.log('fileudestroynew');
       OnChangeNew(ind);
    }
    else if(from=='reply'){
       //console.log('filedestroyreply');
       OnChangeReply(ind);
    }
    else if(from=='reload'){
      //console.log('filedestroyreload');
      OnchangeDock(ind,ss_msg_id);
    }
  });
      
  $('.fileupload_form_class'+ind).bind('fileuploaddestroyed', function (e, data) {
    //remove HTMl element
    var len = $('.cst_files'+ind+' >.files > div').length;
    for(i=1; i<=len; i++){
      var html = $(".cst_files"+ind+" > .files div.at_block:nth-of-type("+i+")").children().children().html();
      if(!html){
      $(".cst_files"+ind+" > .files div.at_block:nth-of-type("+i+")").remove();
      }
    }
    setFormdataStorage(ind);
  });
    //file upload code end
    
    //token input code start  
    var APISERVER = $('#APISERVER').val();
    var token = $('#token').val();
    var language = $('#language').val();
    var lang = $('#lang').val();
    var partner_id = $('#partner_id').val();
    var admin_id = $('#admin_id').val();
    var total_params = 'admin_id='+admin_id+'&token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&status=1';
    var data = APISERVER+'/api/customers/getCustomerAndContactListForCommunication.json?'+total_params; 
    var customerList = data;
    //console.log(customerList);
    var tkn = $(".cstkn_to"+ind).find("ul").length;
    var mesg = nrf;
    if(tkn == '0'){
      $(".customer_email_input"+ind+", .cc_input"+ind+", .input_bcc"+ind+"").customtokenInput(customerList,
      {
          minChars:1,
          hintText: "",
          noResultsText: mesg,
          searchingText: "",
          propertyToSearch: 'text',
          preventDuplicates: true,
          resultsFormatter: function(item){ 
          										 if(item){
                                var cword = item.name+ ' - '+item.email;
                                var name = item.cname ? item.cname : item.name;
                                if(name.length > 25){
                                  name = name.substr(0,25)+'...';
                                }
                                if((cword + item.name).length > '70' ){
                                  return  "<li style='display: block;'><div>"+cword.substr(0,30)+"&nbsp;<span class='btn mini blue pull-right' style='margin: 0px ! important; ' >" +name+ "</span></div><div style='display: inline-block;'>"+cword.substr(30)+"</div></li>";       
                                }
                                else{
                                  return  "<li style='display: block;'>"+ item.name + " - "+ item.email  + "&nbsp;<span class='btn mini blue pull-right' style='margin: 0px ! important;' >" +name+ "</span></li><hr style='margin: 0px;'>"; 
                                }
                            } 
                            else{
                              return;
                            } 
                          },
          tokenFormatter: function(item) { 
                            if(item){
                              return  "<li>"+ item.name+"</span></li>" ; 
                            }
                            else{
                              return;
                            }
                          },
          resizeInput: false, 
          onAdd : function(){ 
            show_hide_cc_bcc(ind); 
            setFormdataStorage(ind); 
             //console.log('onaddbefore');
            if(from=='new'){
              //console.log('onaddnew');
              OnChangeNew(ind); 
            }
            else if(from=='reply'){
              //console.log('onaddreply');
              OnChangeReply(ind); 
            }
            else if(from=='reload'){
              //console.log('onaddreload');
              OnchangeDock(ind,ss_msg_id);
            }
          },
          onDelete : function(){
            show_hide_cc_bcc(ind); 
            setFormdataStorage(ind); 
            if(from=='new'){
                //console.log('ondeletenew');
              OnChangeNew(ind); 
            }
            else if(from=='reply'){
              //console.log('onddeletereply');
              OnChangeReply(ind); 
            }
            else if(from=='reload'){
              //console.log('onddeletereload');
              OnchangeDock(ind,ss_msg_id);
            }
         },
    
        
      });
    }
      //token input code end\
    $('.show_cc_bcc'+ind).click(function() {
      if($('#btn_cc_bcc'+ind).hasClass("icon-chevron-down")) {
        $('.input-cc'+ind).show();
        $('.bcc-input'+ind).show();
        $('#btn_cc_bcc'+ind).removeClass("icon-chevron-down");
        $('#btn_cc_bcc'+ind).addClass("icon-chevron-up");
      } else {
        $('.input-cc'+ind).hide();
        $('.bcc-input'+ind).hide();
        $('#btn_cc_bcc'+ind).removeClass("icon-chevron-up");
        $('#btn_cc_bcc'+ind).addClass("icon-chevron-down");
      }
    }); 
}//bindfunction close here 

function show_hide_cc_bcc(index){
  var cc_val =  $('.input-cc'+index+' > .controls-cc > ul > li').length;
  var bcc_val = $('.bcc-input'+index+' > .controls-bcc > ul > li').length;
  if((cc_val == 1) && (bcc_val == 1)){
    $('.show_cc_bcc'+index).show();
  }
  else{
    $('.show_cc_bcc'+index).hide();
    $('.input-cc'+ind).show();
    $('.bcc-input'+ind).show();
  }
} 
	
      
//set formdata storage function 
function setFormdataStorage(id,msg_id=''){
  var returnArray = {};
  var data = $('.fileupload_form_class'+id).serializeArray();
  var old_attachment = new Array();
    for (var i = 0; i < data.length; i++){
      if(data[i]['name'] == "old_msg_attachment[]"){
        old_attachment.push(data[i]['value']);
        returnArray[data[i]['name']] = data[i]['value'];
      }
      else if(data[i]['name'] == "cst_textarea"+id){
        if(CKEDITOR.instances['cst_textarea'+id]){
          var body = CKEDITOR.instances['cst_textarea'+id].getData();
          returnArray[data[i]['name']] = body;
        }
        else{
          returnArray[data[i]['name']] = data[i]['value'];
        } 
      }
      else{
        returnArray[data[i]['name']] = data[i]['value'];
      }
    }
    if(msg_id!=''){
      returnArray['msg_id'] = msg_id;
    }
  setdkmodalStorage('formdata'+id,JSON.stringify(returnArray));
  return;
}
      
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

function ss_letters_custom_mail_new(no,sendmail,deletes='no',isfrom){

  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var partner_id = $('#partner_id').val();
  var frm_name = '#frm_modal_msg'+no;
  var customer_email = $(frm_name+'  [name=customer_email]').val();
  var cc = $(frm_name+' [name=cc]').val();
  var bcc  = $(frm_name+' [name=bcc]').val();
  var mail_subject = $(frm_name+' [name=subject]').val();

  $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());

  var mail_body = $(frm_name+' [name=message_body]').val();
  
    
  var attachments = $(frm_name+' [name=msg_attachments]').val();
  var attachments = escape(attachments);
  //console.log(attachments);
  var a = $(frm_name).serializeArray();
  for(var kk in a){
    if(kk==1){
      var customerData = a[kk].value;
    }
  }
  if(customerData!=undefined && customerData2!=null){
    var customerData2  = JSON.parse(customerData);
  }
  else{
     var customerData2 = '';
  }
  var cust_name ='';
  if(customerData2.name!=undefined){
    var cust_name  = customerData2.name;
    }
    var msg_id ='';
    if(customerData2.msg_id!=undefined)
      msg_id = customerData2.msg_id;
    var reply_from ='';
    if(customerData2.reply_from!=undefined)
    reply_from = customerData2.reply_from;
    var from_inbox ='';
  if(customerData2.from_inbox!=undefined)
    from_inbox = customerData2.from_inbox;
  var newname = new Array();
  var toarray =$('#frm_modal_msg'+no).serializeArray();
  //console.log(toarray);
   //console.log(customer_email);
  var customer_email1 = customer_email.split(",");
  var cname = new Array();
  for(var j in customer_email1){
	  for(var k in toarray){
	  	if(toarray[k].name==customer_email1[j]){
	  		var b = JSON.parse(toarray[k].value);
	  		var em = customer_email1[j];       
        var a = em.lastIndexOf('#');
        if(a!=-1){        
          em =  em.substr(a+1,em.length);
        }
	  		var obj = {};
        var abcd = b.name.trim();
        if(abcd.indexOf('@')!=-1){
          abcd = abcd.split('@');
          abcd = abcd[0];
        }
				obj[em] = abcd;
				cname.push(obj);
	  		//console.log(b);
	  	}
	  }
	}
	//console.log(cname);
	if(cname!=[]){
		cname = JSON.stringify(cname);
	}
  var sender = $('#type').val();
  if(customer_email!='' && customer_email!=null && customer_email!=undefined) {
      customer_email = customer_email.split(',');
      customer_email = JSON.stringify(customer_email);
  }
  if(cc!='' && cc!=null && cc!=undefined) {
    cc = cc.split(',');
  }
  if(bcc!='' && bcc!=null && bcc!=undefined) {
    bcc = bcc.split(',');
  }
  var params = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,msg_id:msg_id,email_adr:customer_email,customer_name:cname,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,cc:cc,bcc:bcc};

  whereto = 'sendCommunicationCustomNewEmail';
  if(localStorage.getItem('dkmod'+no)!=null){
    var partner_message_id = localStorage.getItem('dkmod'+no);
    if(localStorage.getItem('editdraftids'+partner_message_id)!=null){
      whereto = 'updateDraftOnChange';
        var draftids = JSON.parse(localStorage.getItem('editdraftids'+partner_message_id));
        var partner_message_id = draftids.partner_message_id;
        var partner_message_text_id = draftids.partner_message_text_id;
        var params = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,email_adr:customer_email,customer_name:cname,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,cc:cc,bcc:bcc,sendmail:sendmail,partner_message_id:partner_message_id,partner_message_text_id:partner_message_text_id};

    }
  }
  $.ajax({
    type: 'POST',
    url: APISERVER+'/api/PartnerMessages/'+whereto+'.json',
    data: params,
    async: false,
    dataType : "json",
    success: function(data,status,xhr){
      $('.draft_progress_new').hide();
      $('.draft_complete_new').show();
      data.response.status = is_undefined(data.response.status);
      if(data.response.status == 'success'){
        if(whereto == 'sendCommunicationCustomNewEmail'){
          var partner_message_id = data.response.response.partner_message_id;
          var partner_message_text_id = data.response.response.partner_message_text_id;

          localStorage.setItem('dkmod'+no,partner_message_id);
          var newmail ='yes';
          var obj = {partner_message_id:partner_message_id,partner_message_text_id:partner_message_text_id,newmail:newmail};
          localStorage.setItem('editdraftids'+partner_message_id,JSON.stringify(obj));
        }
        if(whereto == 'updateDraftOnChange'){
          if(sendmail=='yes'){
            call_toastr('success',suc,data.response.response.message);
            $('#dkmod'+no).dockmodal('destroy');
            var page = $('#caction').val();

          }
          else if(sendmail=='no'){

          }
        }
        if(deletes=='yes'){
          var obj = getdkmodalStorage('dkmod'+no);
          localStorage.removeItem('dkmod'+no);
          localStorage.removeItem('editdraftids'+obj);
          var action = $('#caction').val();
			if(action=='draft' && sendmail=='yes'){
        //console.log('ss'+obj);
				$('.ms'+obj).remove();
				$('.ms_u'+obj).remove();
				$('.ms_m'+obj).remove();
				$('.ms_l'+obj).remove();
			}
			else if(isfrom=='draft' && action=='draft'){
				$('.ms'+obj).remove();
				$('.ms_u'+obj).remove();
				$('.ms_m'+obj).remove();
				$('.ms_l'+obj).remove();
				var htmldata = [];
				htmldata.push(data.response.response.getThreadDetails);
				appendMoreMailHtml(htmldata,action);
			}
			else if(action=='sent' && sendmail=='yes' && isfrom!='draft'){
				var htmldata = [];
				if(data.response.response.getThreadDetails[0]!=undefined && data.response.response.getThreadDetails[0]!=null){
					//console.log('a');
					appendMoreMailHtml(data.response.response.getThreadDetails,'sent');
				}
				else{
					//console.log('b');
					htmldata.push(data.response.response.getThreadDetails);
					appendMoreMailHtml(htmldata,'sent');
				}
			}
			else{
				var htmldata = [];
				htmldata.push(data.response.response.getThreadDetails);
				// appendMoreMailHtml(htmldata,'top');
			}

        }
      }
      if(data.response.status=='error'){
        if(data.response.response.error == 'validationErrors'){
          var mt_arr = data.response.response.list;
          var array = $.map(mt_arr, function(value, index) {
            return value+'<br />';
          });
          	showAlertMessage(array,'error',am);
          return;
        }
        else{
          	showAlertMessage(data.response.response.msg,'error',am);
          return;
        } 
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
      }
      else{
        showAlertMessage(data.response.response.msg,'error',am);
        return;
      } 
    }
  });
}

      
//080 16-03-2017 #283: Fwd: Feedback, communication module  part5 end   
function ss_letters_custom_mail(no,ssfrom,parent_message_id,sendmail,message_id='',deletes='no'){
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var partner_id = $('#partner_id').val();
  var frm_name = '#frm_modal_msg'+no;
  var customer_email = $(frm_name+'  [name=customer_email]').val();
  var cc = $(frm_name+' [name=cc]').val();
  var bcc  = $(frm_name+' [name=bcc]').val();
  var mail_subject = $(frm_name+' [name=subject]').val();
  var cust_id ='';
  var cust_con_id ='';
  if(message_id!=''){
    message_id = parseInt(message_id);
  }
  $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());

  var mail_body = $(frm_name+' [name=message_body]').val();
  var mailbody = mail_body;
    
  var attachments = $(frm_name+' [name=msg_attachments]').val();
  var attachments = escape(attachments);
  //console.log(attachments);
  var a = $(frm_name).serializeArray();
  for(var kk in a){
    if(kk==1){
      var customerData = a[kk].value;
    }
    
  }
  if(customerData!=undefined && customerData2!=null){
    var customerData2  = JSON.parse(customerData);
  }
  else{
     var customerData2 = '';
  }
  var cust_name ='';
  if(customerData2.name!=undefined){
    var cust_name  = customerData2.name;
    }
    var msg_id ='';
    if(customerData2.msg_id!=undefined)
      msg_id = customerData2.msg_id;
    var reply_from ='';
    if(customerData2.reply_from!=undefined)
    reply_from = customerData2.reply_from;
    var from_inbox ='';
  if(customerData2.from_inbox!=undefined)
    from_inbox = customerData2.from_inbox;
      var toarray =$('#frm_modal_msg'+no).serializeArray();
       var customer_email1 = customer_email.split(",");
    var cname = new Array();
  for(var j in customer_email1){
	  for(var k in toarray){
	  	if(toarray[k].name==customer_email1[j]){
	  		var b = JSON.parse(toarray[k].value);
	  		var em = customer_email1[j];
	  		var a = em.lastIndexOf('#');
        if(a!=-1){        
          em =  em.substr(a+1,em.length);
        }
	  		var obj = {};
        var abcd = b.name.trim();
        if(abcd.indexOf('@')!=-1){
          abcd = abcd.split('@');
          abcd = abcd[0];
        }
				obj[em] = abcd;
				cname.push(obj);
	  		
	  	}
	  }
	}
	//console.log(cname);
	if(cname!=[]){
		cname = JSON.stringify(cname);
	}

  var sender = $('#type').val();
  if(customer_email!='' && customer_email!=null && customer_email!=undefined) {
      customer_email = customer_email.split(',');
      customer_email = JSON.stringify(customer_email);
  }
  if(cc!='' && cc!=null && cc!=undefined) {
    cc = cc.split(',');
  }
  if(bcc!='' && bcc!=null && bcc!=undefined) {
    bcc = bcc.split(',');
  }
  if(ssfrom=='draft'){
    if(localStorage.getItem('editdraftids'+message_id)!=null){
      var getdraftids = JSON.parse(localStorage.getItem('editdraftids'+message_id));
      var partner_message_text_id = getdraftids.partner_message_text_id;
      var partner_message_id = getdraftids.partner_message_id;
      if(partner_message_text_id!=null && partner_message_text_id!=undefined && partner_message_text_id!=''){
        whereto ='updateDraftOnChange';
        if(sendmail=='no'){
          var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:customer_email,customer_name:cname,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail,cc:cc,bcc:bcc};
        }
        else if(sendmail=='yes'){
            var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:customer_email,customer_name:cname,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail,cc:cc,bcc:bcc};
        }
      }
    }
  }
  $.ajax({
    type: 'POST',
    url: APISERVER+'/api/PartnerMessages/'+whereto+'.json',
    data: params,
    async: false,
    dataType : "json",
    success: function(data,status,xhr){
      //console.log(data);
      //console.log('sendmail'+sendmail);
      $('.draft_progress').hide();
      $('.draft_complete').show();
      data.response.status = is_undefined(data.response.status);
      if(data.response.status=='error'){
        if(data.response.response.error == 'validationErrors'){
          var mt_arr = data.response.response.list;
          var array = $.map(mt_arr, function(value, index) {
            return value+'<br />';
          });
						showAlertMessage(array,'error',am);
          return;
        }
        else{
						showAlertMessage(data.response.response.msg,'error',am);
          return;
        }
      }
     
      if(sendmail=='no'){
        newhtml = data.response.response.PartnerMessageText.message;
        if(isHTML(newhtml)){
          newhtml = StripTags(newhtml);
        }
        $('.draft_progress_popup').hide();
        $('.draft_complete_popup').show();
        $('.slr_txt_'+parent_message_id+'_'+message_id).html(newhtml);
      }
      else if(sendmail=='yes'){
        var action1= $('#caction').val();
    
        call_toastr('success',suc,data.response.response.message);
        localStorage.removeItem('editdraftids'+message_id);
        localStorage.removeItem('dkmod'+no);
         $('#dkmod'+no).dockmodal('destroy');
        if(action1=='inbox'){
           localStorage.removeItem('draftids');
          ssAppendNewThreadinbox(data.response.response.getThreadDetails,'yes',no,data.response.response.success,'yes');
        }
        else if(action1=='sent'){
          htmldata = data.response.response.getThreadDetails;
          appendMoreMailHtml(htmldata,action1);
				}
        else if(action1=='draft'){
          $('.ms'+obj).remove();
          $('.ms_u'+obj).remove();
          $('.ms_m'+obj).remove();
          $('.ms_l'+obj).remove();
        }
      }
       var action1 = $('#caction').val();
      if(deletes=='yes'){
        var ss_msg_id = localStorage.getItem('dkmod'+no);
         localStorage.removeItem('dkmod'+no);
         localStorage.removeItem('editdraftids'+ss_msg_id);
        $('#mgs_sub_list_row'+parent_message_id+ss_msg_id+ss_msg_id).css('pointer-events','all');
        if(action1=='draft' && ssfrom=='draft'){ 
					var htmldata = [];
          $('.ms'+ss_msg_id).remove();
          $('.ms_u'+ss_msg_id).remove();
          $('.ms_m'+ss_msg_id).remove();
          $('.ms_l'+ss_msg_id).remove();
          htmldata.push(data.response.response.getThreadDetails);
          appendMoreMailHtml(htmldata,action1);
				}
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
      return ;
    }
  });
}

function ssAppendNewThreadinbox(htmldata,frompopup,no,sucessmsg='',drafttoemail=''){
    //console.log(htmldata);
		if(htmldata[0]!=undefined && htmldata[0]!=null && htmldata[0]!=''){
			htmldata = htmldata[0];
		}
    var id = htmldata.PartnerMessage.parent_message_id;
    var text_id = htmldata.PartnerMessageText.id;
    var msg_id = htmldata.PartnerMessage.id;
    
    var old_thread_count = parseInt($('#msg_bd_'+id).find('div.mgs_sub_list:not(.c_count)').length);
    jstext ='';
    if(old_thread_count>3){
      jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" style="border-top:none;" onmouseover="show_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
    }
    else{
      jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" onmouseover="show_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>'; 
    }

    //#626: Fwd: Feedback, communications module + a few minor corrections elsewhere > Avatar 
    var initial1='';
    var initial2 ='';
    var initial3 ='';
    var a ='';
    var b ='';
    
    var source_from = htmldata.PartnerMessage.source_from;
    //Kunal Dhakate <kunal@srs-infosystems.com>
    if(source_from == null){
      if(htmldata.Customer.name!='' && htmldata.Customer.name!=undefined){
        var initial1 = PartnerName;
        var initial1 = initial1.substr(0,1);
        var initial2 = htmldata.Customer.name;
        var initial2 = initial2.split(" ");
        var a  = initial2[0];
        var b = initial2[1];
        var initial2 = a.substr(0,1).toUpperCase();
        var initial3 = b.substr(0,1).toUpperCase();
       
        
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
      
      var initial3 = '';            
    }
    if(initial1=='<' || initial1=='>'){
      initial1='';
    }
    if(initial2=='>' || initial2=='<'){
      initial2='';
    }
    //#626: Fwd: Feedback, communications module + a few minor corrections elsewhere > Avatar 
    jstext += '<td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="border_radius">'+initial1+initial2+initial3+'</div></td>';
    jstext += '<td class="border_box_last"  style="border:none;">';

    var source = PartnerName;
    if(source_from != null){
      source = source_from;
    }
    
    var customer_email = '<b>'+htmldata.Customer.name+'</b> &lt; '+htmldata.Customer.email+' &gt;';
    var source_email = htmldata.PartnerMessage.email;
    if(source_email != null){
      customer_email = source_email;
    }
    var inbox = 'inbox';
    var message = htmldata.PartnerMessageText.message;
    message = decodeEntities(message);
    message = message.split('sarthak@123+_*&^%~');
    text_message = message[0];

    var text_message = text_message.replace(/<\/?[^>]+(>|$)/g, "");
    jstext += '<div class="bd_h_'+id+'_'+msg_id+'" onclick="show_hide_msg_thread_head('+id+','+msg_id+')"  style="cursor:pointer;"><div style="float:left;">';
    jstext += '<div class="slr_snd_'+id+'_'+msg_id+'" style="cursor:pointer;" ><b class="writer_name">'+source+'</b></div>';
    	jstext += '<div class="slr_rcv_'+id+'_'+msg_id+'" style=" display:none; cursor:pointer;" >'+to+'&nbsp;'+customer_email+'</div>';

    jstext += '<div class="slr_txt_'+id+'_'+msg_id+'" style=" color:#757575; cursor:pointer;">'+$('<div class="testClass">'+text_message+'</div>').text().substr(0,100)+'</div></div>';
    jstext += '<div style="height: 30px; line-height: 30px; float: right;"><span>'+htmldata.PartnerMessageText.time_text+'</span>&nbsp;&nbsp;';
    
    jstext += '<div class="btn-group pull-right thread-btn-ellipsis" id="thread-btn-ellipsis-'+id+''+msg_id+''+msg_id+'" onclick=" sub_thread_dropdown(event,'+id+','+msg_id+','+msg_id+');" style="display: none;">';  
    jstext += '<span data-close-others="true" data-delay="100" data-hover="dropdown-toggle" data-toggle="dropdown" class="dropdown-toggle">';
    jstext += '<a style="margin: 0px 2px;" class="round_btn_icon btn icn-only"><i class="icon-ellipsis-vertical right-thread-btn-icon-'+msg_id+'" ></i></a> ';
    jstext += '</span>';
    jstext += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
    jstext += '<li> ';

   	jstext += '<a class="" onclick="show_dkmodal_for_reply('+id+','+text_id+','+msg_id+');"><i class="icon-reply" style="color:#000000"></i>&nbsp;'+rep+'</a>';
   

    jstext += '</li>';
    jstext += '<li>';

   	jstext += '<a class="" onclick="show_dkmodal_for_forward('+id+','+text_id+','+msg_id+');"><i class="icon-arrow-right" style="color:#000000"></i>&nbsp;'+fwd+'</a>';
 
    jstext += '</li>';
    jstext += '<li>';

    jstext += '<a class="" onclick="print_mail_pdf('+text_id+','+msg_id+');"><i class="icon-print" style="color:#000000"></i>&nbsp;'+prn+'</a>';
   
    jstext += '</li>';
    jstext += '<li>';
    jstext += '<a class="" onclick="show_mail_source('+text_id+','+msg_id+');"><i class="icon-file" style="color:#000000"></i>&nbsp;'+shs+'</a>';
    jstext += '</li>';
    jstext += '</ul>';
    jstext += '</div>'; 
    jstext += '</div>';
    
    jstext += '<div style="clear:both;"></div>';
    jstext += '</div>'; 
    jstext += '</div>';
    jstext += '<div class="bd_resp_'+id+'_'+msg_id+'" style="padding: 20px 0px; display:none;">';

    var message = htmldata.PartnerMessageText.message;
    message = decodeEntities(message);
    message = message.split('sarthak@123+_*&^%~');
    text_message = message[0];

    jstext += '<div class="testClass">'+text_message+'</div>';

    if(htmldata.PartnerMessageAttachment){
    
      jstext += '<hr><div class="inbox-attached" style="line-height:unset !important;">';
      if(htmldata.PartnerMessageAttachment.length > 1) { 
        jstext += '<div class="margin-bottom-15">';
        jstext += '<span>'+htmldata.PartnerMessageAttachment.length+' attachments</span>';
        jstext += '<a style="cursor:pointer" onclick="">Download all attachments</a>';
        jstext += '</div>';
       } 
      for(i = 0; i < htmldata.PartnerMessageAttachment.length; ++i) { 
        
        var path = crouter_url+'view_file.php?url='+htmldata.PartnerMessageAttachment[i].urlencode+'&size='+htmldata.PartnerMessageAttachment[i].size;
        var extension =  htmldata.PartnerMessageAttachment[i].extension;
        var ext = extension.toUpperCase();
        var orig_name = htmldata.PartnerMessageAttachment[i].orig_name_wt_ext;
        var size = formatFileSize(htmldata.PartnerMessageAttachment[i].size);
        if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
          jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+htmldata.PartnerMessageAttachment[i].orig_name+'" href="'+htmldata.PartnerMessageAttachment[i].thumbnail_url+'" data-rel="fancybox-button" class="fancybox-button kY"><img src="'+htmldata.PartnerMessageAttachment[i].thumbnail_url+'" style="width:70%; height:40%;margin-left: 15%;margin-top: 13%;"><div style="padding-left: 10px; color: #B18575;padding-top:40%;"><i class="icon-download" onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
        }else if(extension == 'pdf'){
          jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_pdf.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%;"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';  
        }else if((extension == 'csv') || (extension == 'txt')){
          jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'img/file-icon/icon_text.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
        }else if((extension == 'docx') || (extension == 'doc')){
          jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
        }else if((extension == 'xlsx') || (extension == 'xls')){
          jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_spreadsheet.png" alt="icon"><span style="padding-left: 10px;">Spreadsheet</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
        }
      }
      jstext += '</div>';
    }
    
    jstext +='</div>';      
    jstext += '</div></td></tr></tbody></table></div></div>';
    //console.log(jstext); 
    var htmlformcount ='';
    //var len = htmldata.previouse_message_id.length;
    var len = parseInt($('#msg_bd_'+id).find('div.mgs_sub_list:not(.c_count)').length);
    //console.log(len);
    if(id==0){
      id=msg_id;
    }
   // if(frompopup!='popup'){
      $('#mgs_sub_list_row'+id+msg_id+msg_id).after(jstext);
      $('#mgs_sub_list_row'+id+msg_id+msg_id).remove();
       

    //}
   // else{

        $('#messageclick div.reply-msg').before(jstext);
        $('#messageclick  .imgm'+id).hide(); 
        $('#messageclick  .rpl'+id).hide(); 
        $('#messageclick  .reply-body #TemplateContent'+id).show();
        $('#messageclick  .reply-body #TemplateContent'+id).css('visibility','visible'); 
        $('#messageclick  .reply-body #TemplateContent'+id).val(''); 
        var editor = CKEDITOR.instances['TemplateContent'+id]; 
        if(editor){ 
          editor.destroy(true);
        } 
        $('#messageclick .reply-msg').hide();
        $('#messageclick  .reply-body-btn-'+id).hide(); 
        $('#messageclick  #cke_TemplateContent'+id).hide();
        $('#msg_bd_'+id).append(jstext);
        
   // }
    if(len>3){
      c_count_main = htmldata.getTotalCount;
      var disp = $('#msg_bd_'+id+' .c_count').css('display');
      var sty ='';
       if(disp =="none"){
        var sty = "style=display:none";
       }
      
      htmlformcount = '<div '+sty+' class="c_count mgs_sub_list" onclick="show_sub_list_thread('+id+','+id+','+id+');" style="border:none;">';
        htmlformcount += '<div class="" style="border-top:none;">';
          htmlformcount += '<div style="padding:10px 0px;">';
            htmlformcount += '<table style="width:100%;">';
              htmlformcount += '<tbody>';
                htmlformcount += '<tr>';
                  htmlformcount  +='<td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="c_count_main">'+c_count_main+'</div></td><td class="border_box_last" style="border:none;">';
                  htmlformcount +='</td>';
                htmlformcount += '</tr>';
              htmlformcount += '</tbody>';
            htmlformcount += '</table>';
          htmlformcount += '</div>';
        htmlformcount += '</div>';
      htmlformcount += '</div>';
      $('#msg_bd_'+id+' .c_count').remove();

      
      $('#mgs_sub_list_row'+id+id+id).next('div.c_count').remove();
      
      
      $('#mgs_sub_list_row'+id+id+id).after(htmlformcount);
      //console.log('#mgs_sub_list_rowididid'); //console.log(id);
      //var newlen = htmldata.previouse_message_id.length;
    
      if(disp != "none"){
        for(var kk in htmldata.previouse_message_id){
          var pmi = htmldata.previouse_message_id[kk].PartnerMessage.id;
          $( '#mgs_sub_list_row'+id+pmi+pmi).hide();
        }
        $('#msg_bd_'+id).find('#mgs_sub_list_row'+id+msg_id+msg_id).prev('div.mgs_sub_list').hide();

      }
      else{
        $( '#mgs_sub_list_row'+id+msg_id+msg_id).css('border-top','1px solid rgb(224, 224, 224)');
      }     
    }
    else{
        //$('#mgs_sub_list_row'+id+id+id).after(htmlformcount);
    }
    //$('.ms_m'+id+' .c_count_main').text(c_count_main);
    if(frompopup!='yes'){
      //console.log('ifdestroy');
      $('.imgm'+id).hide(); 
      $('.rpl'+id).hide(); 
      $('.reply-body #TemplateContent'+id).show();
      $('.reply-body #TemplateContent'+id).css('visibility','visible'); 
      $(' .reply-body #TemplateContent'+id).val(''); 
      var editor = CKEDITOR.instances['TemplateContent'+id]; 
      if(editor){ 
        editor.destroy(true);
      } 
      $('#dkmod'+no).dockmodal('destroy');
      $('.reply-body-btn-'+id).hide(); 
      $('#cke_TemplateContent'+id).hide();
    }
    else{
      if(htmlformcount != undefined && htmlformcount != null && htmlformcount !=0 && htmlformcount !=''){
        //$('#mgs_sub_list_row'+id+id+id).after(htmlformcount);
      }
      $('#dkmod'+no).dockmodal('destroy');
    
      //console.log('reply-msg');
      call_toastr('success',suc,sucessmsg);
    }
    var new_length = parseInt($('#msg_bd_'+id).find('div.mgs_sub_list:not(.c_count)').length);

    //console.log('emailafterreply'+new_length);
    var ndname = htmldata.PartnerMessage.email;
     //console.log('ndname'+ndname);
     if(ndname.indexOf("<")==0){
      ndname = ndname.replace("<","");
      ndname = ndname.replace(">","");
      ndname = ndname.split("@"); 
      ndname = ndname[0].trim();   
    }
    else{
      ndname = ndname.replace("<","&nbsp;");
      ndname = ndname.replace(">","&nbsp;");
      ndname = ndname.split("&nbsp;");
      ndname = ndname[0];
    }
    ndname = ndname.split(" ");
     //console.log('ndname'+ndname);
    newhtml = '';
    var IsAdmin1 = $('#IsAdmin').val();
    if(IsAdmin1!='Y'){    
      var me = 'me';
    }
    else{
      var me = $('#UserFirstName').val();
      var me = me.split(" ");
      var me = me[0];
    }
    
    var neew_length = htmldata.count;
    isdraft = htmldata.hasdraft;
    isdrafttext ='';
    if(isdraft!=0){
    	isdrafttext = ',<span style="color:#d23f31">&nbsp;'+draf+'</span>';
    }
    newhtml += '<p style="width:100%;height:20px;overflow-y: hidden;" class="writer_name">'+me+', '+ndname[0]+' '+isdrafttext;
    newhtml += '<span style="color:#757575">('+neew_length+')</span>';
    newhtml += '</p>';
    $('.ms_line'+id+' div.span3:first p').remove();
    $('.ms_line'+id+' div.span3:first').html(newhtml);
      var res = htmldata.PartnerMessageText.message;
      res = StripTags(res);

      $('.ms_line'+id+' .msg_body:first').html(res);

      if($('#messageclick').parent()[0].scrollHeight!=undefined){
        var scrollofmsg =   $('#messageclick').parent()[0].scrollHeight;
        if(scrollofmsg>$('#messageclick').parent().height()){
          $('#messageclick').parent().animate({
            scrollTop: scrollofmsg
          }, 400);
        }
      }
    //console.log('newhtml');
    //console.log(newhtml);
}

function UpdatePartnerMessageHtmlHeader(){
  //console.log('UpdatePartnerMessageHtmlHeader');
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
      	var view_all = '<a class="view_all" style="border: none !important;border: none !important;float: right;padding: 0 !important;color:#5b9bd1;line-height: 1;" href="'+base_url+'/communication/inbox">'+vie+'</a>';

      var partnername = PartnerName;
      textone  = $('#textone').val();
      textmany =  $('#textmany').val();
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
      html += '<li><ul id="header_message_bar_dd" class="dropdown-menu-list">';
      
      var htmlinn ='';
      for(var key in htmldata){     
        if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
          var n = htmldata[key].PartnerMessage.source_from.trim();
          if(n.indexOf('<')==0){
            n = n.replace('<','');
            n = n.replace('>','');
            n = n.split('@');
            var s = n;
            var n = new Array(); 
            n[0] = s[0].trim(); 
            n[1] ='';
           
          }
          else{
		        n = n.split(" ");
          }
          var a = n[0];
          var b = checkEmpty(n[1]);
          if(a=='<'){
            a='';
          }
          if(b=='<'){
            b='';
          }
          var namestr = a+' '+b;
        }
        else if(htmldata[key].Customer.name!=undefined && htmldata[key].Customer.name!=null && htmldata[key].Customer.name!=''){
          var n = htmldata[key].Customer.name.trim().split(" ");
          var a = n[0];
          var b = checkEmpty(n[1]);
          if(a=='<'){
            a='';
          }
          if(b=='<'){
            b='';
          }
          var namestr = partnername+','+a+' '+b;
        }
        else{
          var namestr = partnername.substring(0,13);
        }
        var initial1 = ''; var initial2 = '';
        if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
          var n = htmldata[key].PartnerMessage.source_from.trim().split(" ");
          initial1 = n[0].substring(0,1).toUpperCase();
          initial2 = n[1].substring(0,1).toUpperCase();
        
        }
        else{
          var n = partnername.trim().split(" ");

          initial1 = n[0].substring(0,1).toUpperCase();
          initial2 = n[1].substring(0,1).toUpperCase();
         
        }
        if(initial1=='<' || initial1=='>'){
          initial1='';
        }
        if(initial2=='>' || initial2=='<'){
          initial2='';
        }
        var id = htmldata[key].PartnerMessage.id;
        var parent_message_id = htmldata[key].PartnerMessage.parent_message_id;
        htmlinn += '<li><a href="javascript:;" onclick="ss_message_click('+parent_message_id+','+id+')">';
          htmlinn += '<span class="photo"><span class="border_radius_message">'+initial1+initial2+'</span></span>';
          htmlinn += '<span class="subject">';
            htmlinn += '<span class="from">'+namestr+'</span>';
            htmlinn += '<span class="time">'+htmldata[key].PartnerMessageText.time_text+'</span>';
          htmlinn += '</span>';
          htmlinn += '<span class="message">'+htmldata[key].PartnerMessageText.subject.trim().substr(0,70)+'</span>';
        htmlinn += '</a></li>';
        
        
      }
      html += htmlinn+'</ul></li></ul></li>';
        //console.log('htmlhtmlhtmlhtml');
      //console.log(html);
      //console.log('htmlhtmlhtmlhtml');
      $("#header_message_bar").remove();  
      //console.log(count);
      if(count!=0){
          //$("#header_notification_bar").after(html);
          //console.log('sss');
          $('div.header ul.pull-right li.user').before(html);
          setTimeout(function(){
          $("#header_notification_bar").off();
          $("#header_message_bar.dropdown").off();
          $("#header_message_bar .dropdown-toggle").off();
          $("#header_message_bar_dd").slimScroll();
        },100);
      } 
    }
    else if(data.response.status == 'error'){
      return;
    }
  }
}

function ss_message_click(parent_id,message_id){
  $('#header_message_bar').removeClass('open');
  var action = $('#caction').val();
  parent_id = parseInt(parent_id);
  message_id = parseInt(message_id);
  if(action=='inbox'){
    myid = parent_id;
    if(myid==0){
      myid = message_id;
    }
    var check = parseInt($('.ms_line'+myid).length);        
  }

  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var lang = $('#lang').val();
  var partner_id = $('#partner_id').val();
  parent_id = parseInt(parent_id);
  msg_id = parseInt(msg_id);
  if(parent_id!=0){
    var msg_id = parent_id;
  }
  else{
    var msg_id = message_id;
  }
  
  if(parent_id!=0){
    var id = parent_id;
  }
  var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&message_id='+msg_id+'&folder=i&from=inbox';
  
  var data = passProdRequest(APISERVER+'/api/PartnerMessages/getMsgThread.json',total_params,'undefined','undefined');
  if(data == undefined){
    var json_data = $('#json_data').val();
    var data = JSON.parse(json_data);
    data.response.status = is_undefined(data.response.status);
    if(data.response.status == 'success'){
      //var stafer_id = $('#staffer_id').val();
      //getInboxCountApi3(stafer_id);
      UpdatePartnerMessageHtmlHeader();
    
      if(data.response.response){

        //draft changes
        if(data.response.response.draftdetails!=undefined && data.response.response.draftdetails!=null){
          var draft_message_id = data.response.response.draftdetails.draft_message_id;
          var draft_message_text_id = data.response.response.draftdetails.draft_message_text_id;
          var messages =  data.response.response.draftdetails.draft_message;
          var pmsgid = data.response.response.draftdetails.parent_message_id;
          var obj= {partner_message_id:draft_message_id,partner_message_text_id:draft_message_text_id};
          var attachments_draft = data.response.response.draftdetails.attachments;
          localStorage.setItem('draftidspopup',JSON.stringify(obj));
          setTimeout(function(){
            reply_body_msg_show_tpl_head(message_id,parent_id,'no',messages,attachments_draft);

          },1000);   
        }
       //draft changes


        htmldata = data.response.response.threaddetails[0];
        data.response.response = data.response.response.threaddetails;
        var jstext = '';
        for (index = 0; index < data.response.response.length; ++index){
          var text_id =  data.response.response[index].PartnerMessageText.id;
          var msg_id =  data.response.response[index].PartnerMessage.id;
          var subject_msg =   data.response.response[0].PartnerMessageText.subject;
          var id = data.response.response[index].PartnerMessage.parent_message_id;
          if(data.response.response.length > 3){
            if( index == '0'){
              jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" onmouseover="show_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" style="border-top:none"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
            }
            else if( index == (data.response.response.length - 1)){
              jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" onmouseover="show_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
            }
            else{
              jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list"  onmouseover="show_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
            }
          }
          else{
            if(index==0){
              jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" onmouseover="show_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" style="border-top:none"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>'; 
            }
            else{
              jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" onmouseover="show_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis_head('+id+','+msg_id+','+msg_id+');" ><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';  
            }
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
              var initial1 = PartnerName;
              var initial1 = initial1.substr(0,1);
              var initial2 = data.response.response[index].Customer.name;
              var initial2 = initial2.split(" ");
              var a  = initial2[0];
              var b = initial2[1];
              var initial2 = a.substr(0,1).toUpperCase();
              var initial3 = b.substr(0,1).toUpperCase();
             
              
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
            var initial3 = '';
          }
          if(initial1=='<' || initial1=='>'){
            initial1='';
          }
          if(initial2=='>' || initial2=='<'){
            initial2='';
          }
          //#626: Fwd: Feedback, communications module + a few minor corrections elsewhere > Avatar 
          
          jstext += '<td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="border_radius">'+initial1+initial2+initial3+'</div></td>';
          jstext += '<td class="border_box_last"  style="border:none;">';
          
          if(data.response.response.length > 1){
            var source = PartnerName;
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
            message = decodeEntities(message);
            message = message.split('sarthak@123+_*&^%~');
            text_message = message[0];
           // var text_message = text_message.replace(/<\/?[^>]+(>|$)/g, "");
            jstext += '<div class="bd_h_'+id+'_'+msg_id+'" onclick="show_hide_msg_thread_head('+id+','+msg_id+')"  style="cursor:pointer;"><div style="float:left;">';
            jstext += '<div class="slr_snd_'+id+'_'+msg_id+'" style="cursor:pointer;" ><b class="writer_name">'+source+'</b></div>';
            	 jstext += '<div class="slr_rcv_'+id+'_'+msg_id+'" style=" display:none; cursor:pointer;" >'+to+'&nbsp;'+customer_email+'</div>';
						
            jstext += '<div class="slr_txt_'+id+'_'+msg_id+'" style=" color:#757575; cursor:pointer;">'+$('<div class="testClass xx">'+text_message+'</div>').text().substr(0,100)+'</div></div>';
            jstext += '<div style="height: 30px; line-height: 30px; float: right;"><span>'+data.response.response[index].PartnerMessageText.time_text+'</span>&nbsp;&nbsp;';
            
            jstext += '<div class="btn-group pull-right thread-btn-ellipsis" id="thread-btn-ellipsis-'+id+''+msg_id+''+msg_id+'" onclick=" sub_thread_dropdown(event,'+id+','+msg_id+','+msg_id+');" style="display: none;">';  
            jstext += '<span data-close-others="true" data-delay="100" data-hover="dropdown-toggle" data-toggle="dropdown" class="dropdown-toggle">';
            jstext += '<a style="margin: 0px 2px;" class="round_btn_icon btn icn-only"><i class="icon-ellipsis-vertical right-thread-btn-icon-'+msg_id+'" ></i></a> ';
            jstext += '</span>';
            jstext += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
            jstext += '<li> ';
            
		        jstext += '<a class="" onclick="show_dkmodal_for_reply('+id+','+text_id+','+msg_id+');"><i class="icon-reply" style="color:#000000"></i>&nbsp;'+rep+'</a>';
		  
            jstext += '</li>';
            jstext += '<li>';
		        jstext += '<a class="" onclick="show_dkmodal_for_forward('+id+','+text_id+','+msg_id+');"><i class="icon-arrow-right" style="color:#000000"></i>&nbsp;'+fwd+'</a>';
            jstext += '</li>';
            jstext += '<li>';
            
            jstext += '<a class="" onclick="print_mail_pdf('+text_id+','+msg_id+');"><i class="icon-print" style="color:#000000"></i>&nbsp;'+prn+'</a>';
           
            jstext += '</li>';
            jstext += '<li>';
            jstext += '<a class="" onclick="show_mail_source('+text_id+','+msg_id+');"><i class="icon-file" style="color:#000000"></i>&nbsp;'+shs+'</a>';
            
            
            jstext += '</li>';
            jstext += '</ul>';
            jstext += '</div>'; 
            jstext += '</div>';
            
            jstext += '<div style="clear:both;"></div>';
            jstext += '</div>'; 
            jstext += '</div>';
            jstext += '<div class="bd_resp_'+id+'_'+msg_id+'" style="padding: 20px 0px; display:none;">';
          }
          else{
            var source = PartnerName;
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
            	jstext += '<div class="slr_rcv_'+id+'_'+msg_id+'" style="" >'+to+'&nbsp;'+customer_email+'</div>';
						
            jstext += '</div>';
            jstext += '<div  style="height: 30px; line-height: 30px; float: right;"><span>'+data.response.response[index].PartnerMessageText.time_text+'</span>&nbsp;&nbsp;';
            
            jstext += '<div class="btn-group pull-right thread-btn-ellipsis" id="thread-btn-ellipsis-'+id+''+msg_id+''+msg_id+'" onclick="">';  
            jstext += '<span data-close-others="true" data-delay="100" data-toggle="dropdown" class="dropdown-toggle">';
            jstext += '<a style="margin: 0px 2px;" class="round_btn_icon btn icn-only"><i class="icon-ellipsis-vertical right-thread-btn-icon-'+msg_id+'" ></i></a> ';
            jstext += '</span>';
            jstext += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
            jstext += '<li> ';
            jstext += '<a class="" onclick="show_dkmodal_for_reply('+id+','+text_id+','+msg_id+');"><i class="icon-reply" style="color:#000000"></i>&nbsp;'+rep+'</a>';
			
            jstext += '</li>';
            jstext += '<li>';
            jstext += '<a class="" onclick="show_dkmodal_for_forward('+id+','+text_id+','+msg_id+');"><i class="icon-arrow-right" style="color:#000000"></i>&nbsp;'+fwd+'</a>';
            
            jstext += '</li>';
            jstext += '<li>';
            	jstext += '<a class="" onclick="print_mail_pdf('+text_id+','+msg_id+');"><i class="icon-print" style="color:#000000"></i>&nbsp;'+prn+'</a>';
            jstext += '</li>';
            jstext += '<li>';
            jstext += '<a class="" onclick="show_mail_source('+text_id+','+msg_id+');"><i class="icon-file" style="color:#000000"></i>&nbsp;'+shs+'</a>';
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
          message = decodeEntities(message);
          message = message.split('sarthak@123+_*&^%~');
          text_message = message[0];
            
          jstext += '<div class="testClass zz">'+text_message+'</div>';
            
          if(data.response.response[index].PartnerMessageAttachment){
          
            ////console.log(data.response.response[index].PartnerMessageAttachment);
            jstext += '<hr><div class="inbox-attached" style="line-height:unset !important;">';
            if(data.response.response[index].PartnerMessageAttachment.length > 1) { 
              jstext += '<div class="margin-bottom-15">';
              jstext += '<span>'+data.response.response[index].PartnerMessageAttachment.length+' attachments</span>';
              jstext += '<a style="cursor:pointer" onclick="">Download all attachments</a>';
              jstext += '</div>';
             } 
            for(i = 0; i < data.response.response[index].PartnerMessageAttachment.length; ++i) { 
              
              
              var path = crouter_url+'view_file.php?url='+data.response.response[index].PartnerMessageAttachment[i].urlencode+'&size='+data.response.response[index].PartnerMessageAttachment[i].size;
              var extension =  data.response.response[index].PartnerMessageAttachment[i].extension;
              var ext = extension.toUpperCase();
              var orig_name = data.response.response[index].PartnerMessageAttachment[i].orig_name_wt_ext;
              var size = formatFileSize(data.response.response[index].PartnerMessageAttachment[i].size);
              if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
                jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+data.response.response[index].PartnerMessageAttachment[i].orig_name+'" href="'+data.response.response[index].PartnerMessageAttachment[i].thumbnail_url+'" data-rel="fancybox-button" class="fancybox-button kY"><img src="'+data.response.response[index].PartnerMessageAttachment[i].thumbnail_url+'" style="width:70%; height:40%;margin-left: 15%;margin-top: 13%;"><div style="padding-left: 10px; color: #B18575;padding-top:40%;"><i class="icon-download" onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
              }else if(extension == 'pdf'){
                jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_pdf.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%;"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';  
              }else if((extension == 'csv') || (extension == 'txt')){
                jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_text.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
              }else if((extension == 'docx') || (extension == 'doc')){
                jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
              }else if((extension == 'xlsx') || (extension == 'xls')){
                jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_spreadsheet.png" alt="icon"><span style="padding-left: 10px;">Spreadsheet</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
              }
            }
            jstext += '</div>';
          }
          jstext +='</div>';      
          jstext += '</div></td></tr></tbody></table></div></div>';
          
          if(data.response.response.length > 3){
            if( index == '0'){
              var clen =  parseInt(data.response.response.length) - parseInt(2);
            
              jstext += '<div style="display:none" class="c_count mgs_sub_list" onclick="show_sub_list_thread_head('+id+','+msg_id+','+msg_id+');" style="border:none;"><div class="" style="border-top:none;"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr><td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="c_count_main">'+clen+'</div></td><td class="border_box_last" style="border:none;"></td></tr></tbody></table></div></div></div>';
            }
          }
        }
        //Reply field for message popup
        var PartnerMessageid = htmldata.PartnerMessage.id;
        jstext += '<div style="display:none" class="reply-msg"><table style="width:100%;"><tbody><tr>';
          jstext += '<td class="border_box_first" style="border:none; vertical-align: top !important;">';
            if(htmldata.PartnerMessage.email !=''){
              var email = htmldata.PartnerMessage.email.trim();
              var initial1 =''; var initial2 ='';
              if(email.indexOf('<')==0){
                email=  email.replace('<','');
                email =email.replace('>','');
                email = email.split('@');
              }
              else{
                email =email.replace('<','&nbsp;');
                email =email.replace('>','&nbsp;');
                email =email.split('&nbsp;');
              }
              if(email[0]!=undefined){
                initial1 = email[0].substring(0,1).toUpperCase();
              }
              if(email[1]!=undefined){
                initial2 = email[1].substring(0,1).toUpperCase();
              }
              if(initial1=='<' || initial1=='>'){
                initial1='';
              }
              if(initial2=='>' || initial2=='<'){
                initial2='';
              }
            }
            jstext += '<div class="border_radius dp_img imgm'+PartnerMessageid+'">'+initial1+initial2+'</div>';
          jstext += '</td>';
          jstext += '<td class="border_box_last"  style="border:none;">';
            jstext += '<div class="reply-main">';
              jstext += '<div class="reply-header rpl'+PartnerMessageid+'" style="display: none;">';
                if(htmldata.PartnerMessage.email !=''){
                  jstext += '<div><b class="writer_name">'+htmldata.PartnerMessage.email+'</b></div>';
                }
                else{
                  jstext += '<div><b class="writer_name">'+partnername+'</b></div>';
                }
                jstext += '<div class="btn-group">';
                  var custname ='';
                  if(htmldata.Customer.name!= undefined && htmldata.Customer.name!=null){
                    var custname = htmldata.Customer.name;
                  }
                  var sourceFromEmail = htmldata.Customer.name+'</b> < '+custname+' >';
                  if(htmldata.PartnerMessage.source_from!= undefined && htmldata.PartnerMessage.source_from!=null){
                    var sourceFrom = htmldata.PartnerMessage.source_from.trim();
                    if(sourceFrom.indexOf('<')==0){
                      sourceFrom = sourceFrom.replace("<","");
                      sourceFrom = sourceFrom.replace(">","");
                      sourceEmail = sourceFrom;
                      sourceFrom = sourceFrom.split('@');
                      sourceName = sourceFrom[0];
                      sourceFromEmail = sourceName+'</b> < '+sourceEmail+' >';
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
                 
                	jstext += '<div class="btn mini" onmouseover="event.stopPropagation();" style="background-color: #fff !important; padding-left: 0px;" data-toggle="dropdown">To&nbsp;<b class="writer_name">'+sourceFromEmail+'</b>&nbsp;&nbsp;<i class="icon-caret-down"></i></div>';
                	jstext += '<ul class="dropdown-menu pull-right" style="width:200px;">';
                    jstext += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-reply reply-btn"></i>&nbsp;'+rep+'</a></li>';

                 	jstext += '<li><a onclick="show_dkmodal_for_forward_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-arrow-right reply-btn"></i>&nbsp;'+fwd+'</a></li>';
                  jstext += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+er+'</a></li>';
                  jstext += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+es+'</a></li>';
              	 
                    jstext += '</ul><div style="clear:both;"></div>';
                  jstext += '</div>'
                jstext += '</div>';
                
                jstext += '<form action="/bookingengine/bkengine/frm_msg'+PartnerMessageid+'s/inbox2" class="form-vertical login-form frm'+PartnerMessageid+'" id="frm_msg'+PartnerMessageid+'" rowno="'+PartnerMessageid+'" name="frm_activity_list'+PartnerMessageid+'" style="margin: 0px;" onsubmit="event.returnValue = false; return false;" method="post" accept-charset="utf-8"><div style="display:none;"><input name="_method" value="POST" type="hidden"></div>';
                  jstext += '<div class="reply-body" >';
                  	
                    jstext += '<textarea name="textarea[]" style="height:50px; border:none;" placeholder="'+rep+'..." id="TemplateContent_popup'+PartnerMessageid+'" class="m-wrap span12" onclick="reply_body_msg_show_tpl_head('+message_id+','+parent_id+');"></textarea></br>';
                  	

                    jstext += '<div class="reply-body-btn-'+PartnerMessageid+'" style="display:none;">';
                      jstext += '<div class="inbox-compose-attachment" style="padding-left: 0px;" >';
                        jstext += '<table role="presentation" class="table table-striped" id="table-striped_'+PartnerMessageid+'" ><tbody class="files"></tbody></table>';
                      jstext += '</div>';
                      jstext += '<script id="template-upload" type="text/x-tmpl">';
                        jstext += '{% for (var i=0, file; file=o.files[i]; i++) { %}';
                        jstext += '<tr class="template-upload fade">';
                          jstext += '<td class="preview" width="10%"><span class="fade"></span></td>';
                          jstext += '<td class="name" width="30%"><span>{%=file.name%}</span></td>';
                          jstext += '<td class="size" width="40%"><span>{%=o.formatFileSize(file.size)%}</span></td>';
                          jstext += '{% if (file.error) { %}';
                            jstext += '<td class="error" width="20%" colspan="2"><span class="label label-important">Error</span> {%=file.error%}</td>';
                          jstext += '{% } else if (o.files.valid && !i) { %}';
                          jstext += '<td><div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div></td>';
                          jstext += '{% } else { %}<td colspan="2"></td>{% } %}';
                          jstext += '<td class="cancel" width="10%">{% if (!i) { %}{% } %}</td>';
                        jstext += '</tr> {% } %}';
                      jstext += '<\/script>';
                      jstext += '<script id="template-download" type="text/x-tmpl">';
                        jstext += '{% for (var i=0, file; file=o.files[i]; i++) { %}';
                          jstext += '<tr class="template-download fade">';
                            jstext += '{% if (file.error) { %}';
                              jstext += '<td width="10%"></td>';
                              jstext += '<td class="name" width="30%"><span>{%=file.name%}</span></td>';
                              jstext += '<td class="size" width="40%"><span>{%=o.formatFileSize(file.size)%}</span></td>';
                              jstext += '<td class="error" width="30%" colspan="2"><span class="label label-important">Error</span>'; 
                              jstext += '{%=file.error%}';
                              jstext += '</td>';
                            jstext += '{% } else { %}';
                              jstext += '<td class="preview" width="10%">';
                              jstext += '{% if (file.thumbnail_url) { %}';
                                jstext += '<a class="fancybox-button" data-rel="fancybox-button" href="{%=file.url%}" title="{%=file.name%}">';
                                jstext += '<img src="{%=file.thumbnail_url%}">';
                                jstext += '</a>';
                              jstext += '{% } %}</td>';
                              jstext += '<td class="name" width="30%">';
                                jstext += '<a href="{%=file.url%}" title="{%=file.name%}" data-gallery="{%=file.thumbnail_url&&\'gallery\'%}" download="{%=file.name%}">{%=file.name%}</a>';
                              jstext += '</td>';
                              jstext += '<td class="size" width="40%"><span>{%=o.formatFileSize(file.size)%}</span></td>';
                              jstext += '<td colspan="2"></td>';
                            jstext += '{% } %}';
                            jstext += '<td class="delete" width="10%">';
                              jstext += '<button class="btn mini" data-type="{%=file.delete_type%}" data-url="{%=file.delete_url%}"{% if (file.delete_with_credentials) { %} data-xhr-fields=\'{"withCredentials":true}\'{% } %}><i class="icon-remove"></i></button>';
                            jstext += '</td>';
                          jstext += '</tr>';
                        jstext += '{% } %}';
                      jstext += '<\/script>';
                      jstext += '<div>';
                        var base_url = $('#BASE_URL').val();
                        var formurl = base_url+'communication/send_reply_mail';
                        var crouter_form_url = $('#crouter_url').val()+'bkengine/settings/upload';
                        jstext += '<span style="font-size: 20px; background-color: white; height: 34px; width: 15px;"  class="btn  fileinput-button"><span style="transform: rotate(45deg); display: none;margin-top: -5px;margin-left: -5px;"><i class="icon-paper-clip"></i></span><input type="file" name="files[]" id="files" class="files'+PartnerMessageid+'" multiple data-url="'+crouter_form_url+'" ></span>';
                        jstext += '<div style="clear:both;"></div>';
                        jstext += '<input type="hidden" name="reply_msg_body_popup'+PartnerMessageid+'" id="reply_msg_body_popup'+PartnerMessageid+'" value="">';
                        jstext += '<input type="hidden" name="field_id[]" class="field_id" value="">';
                        jstext += '<input type="hidden" name="request_from_popup'+PartnerMessageid+'" id="request_from_popup'+PartnerMessageid+'" value="inbox">';
                        jstext += '<input type="hidden" id="msg_sub_popup'+PartnerMessageid+'" name="msg_sub_popup'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
                        jstext += '<input type="hidden" id="msg_id_popup'+PartnerMessageid+'" name="msg_id_popup'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
                        var cust_email = '';
                        if(sourceEmail != ''){
                          cust_email = sourceEmail;
                        }
                        else{
                          cust_email = htmldata.Customer.email;
                        }
                        jstext += '<input type="hidden" id="cust_email_popup'+PartnerMessageid+'" name="cust_email_popup'+PartnerMessageid+'" value="'+cust_email+'" >';
                        var cust_name = '';
                        if(sourceName != ''){
                          cust_name = sourceName;
                        }
                        else{
                          cust_name = htmldata.Customer.name;
                        }
                        jstext += '<input type="hidden" id="cust_name_popup'+PartnerMessageid+'" name="cust_name_popup'+PartnerMessageid+'" value="'+cust_name+'" >';
                        jstext += '<input type="hidden" id="cust_id_popup'+PartnerMessageid+'" name="cust_id_popup'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
                        jstext += '<input type="hidden" id="cust_con_id_popup'+PartnerMessageid+'" name="cust_con_id_popup'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
                        jstext += '<input type="hidden" id="last_msg_text_id_popup'+PartnerMessageid+'_'+PartnerMessageid+'" >';
                        jstext += '<input id="final_attachments_popup'+PartnerMessageid+'" type="hidden" value="" name="final_attachments_popup'+PartnerMessageid+'">';
                        jstext += '<input id="from_inbox_popup'+PartnerMessageid+'" type="hidden" value="inbox" name="from_inbox_popup'+PartnerMessageid+'">';
                        jstext += '<input id="reply_from_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.email+'" name="reply_from_'+PartnerMessageid+'">';
                        jstext += '<input id="to_email_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.source_from+'" name="to_email_popup_'+PartnerMessageid+'">';
                      
                      jstext += '</div>';
                    jstext += '</div>';
                  jstext += '</div>';
                jstext += '</form>';
              jstext += '</div>';
          jstext += '</td>';
        jstext += '</tr></tbody></table></div>';
        //Reply field end
        $('#messageclick #msg_bd_'+id).html(jstext);
        $('#last_msg_text_id_'+id+'_'+msg_id).val(text_id);
       
        //624: Fwd: Feedback, communications module + a few minor corrections elsewhere > Unread message 
        $('tr.ms'+id).removeClass('unread');
        //624: Fwd: Feedback, communications module + a few minor corrections elsewhere > Unread message 
      }
    }
    else if(data.response.status == 'error'){
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
    }
  }

  var upload_pin = '<span id="upload_pin" style="font-size: 20px; background-color: white; height: 34px; width: 15px;"  class="btn fileinput-button"><span style="transform: rotate(45deg); display: block;margin-top: -5px;margin-left: -5px;"><i class="icon-paper-clip"></i></span></span>';

 // $("#messageclick").dockmodal('destroy');
  $('#messageclick').html('');
 
  var a='';
  if(parent_id!=0){
    a = parent_id;
  }
  else{
    a = message_id;
  }
  $("#messageclick").dockmodal({
    initialState: "docked",
    title: subject_msg,
    width: 610,
    beforeClose: function( event, dialog ) { $('#messageclick').html(''); },
    create: function( event, dialog ) { 
              
    },
    buttons: [
      {
        html: rep,
        buttonClass: "btn btn-primary replymsgclick",
        click: function (e, dialog) {
            // do something when the button is clicked
          
          }
      },
      {
        html: "<i class='icon-check'></i>&nbsp;"+sen,
        buttonClass: "btn blue ssreply sspopuphide ",
        click: function (e, dialog) {
            // do something when the button is clicked
            //set_reply_msg_head(PartnerMessageid);
            
            ss_send_reply_mail_head(a,'draft','','yes');
            reply_body_msg_hide_tpl_head(PartnerMessageid);
        },
      },
      {
        html: dis,
        buttonClass: "btn btn-primary ssdiscard sspopuphide",
        click: function (e, dialog) {
            // do something when the button is clicked
            if(localStorage.getItem('draftidspopup')!=null && localStorage.getItem('draftidspopup')!=undefined && localStorage.getItem('draftidspopup')!=''){
                var draftidspopup = JSON.parse(localStorage.getItem('draftidspopup'));
                ss_delete_trash_head_popup(parent_id,draftidspopup.partner_message_id);

               reply_body_msg_hide_tpl_head(PartnerMessageid);
            }else{

            reply_body_msg_hide_tpl_head(PartnerMessageid);
            }
        },
      },
    ]
  });
  $('.replymsgclick').click(function(){  
    //console.log('replymsgclicked'); 
    if(parent_id!=0){
      a = parent_id;
    } 
    else{
      a = message_id;
    }   
    //$("#messageclick #TemplateContent_popup"+id ).click();

    //console.log(parent_id+'reply_body_msg_show_tpl_head'+message_id);
    
    reply_body_msg_show_tpl_head(message_id,parent_id,'','','','ss_message_click'); 
     
   
  });
  $('#messageclick').parent().next('div').find('.dock-fileinput-btn').click(function(){
    if(id==0){
      $('.files'+msg_id).click();
    }
    else{
      $('.files'+id).click();
    }
     //console.log(id+'---filesid'+msg_id);
  });
 
   
  $('#messageclick .replymsgclick').parent().next('span').hide();
  $('#messageclick').html(jstext);
  $('#messageclick #msg_sub_popup'+message_id).val(subject_msg);
  $('#messageclick #msg_sub_popup'+parent_id).val(subject_msg);

    

  if(parent_id!=message_id){
    //console.log('parent_idmessage_id');
    //console.log("#mgs_sub_list_row"+parent_id+message_id+message_id);
    var toop = $('#messageclick #mgs_sub_list_row'+parent_id+message_id+message_id).position().top

    if(toop==undefined || toop==null){
      toop = 0;
    }
    
    $('#messageclick').parent('div').animate({
      scrollTop:toop },
      'slow',function(){
        $('#messageclick .slr_rcv_'+id+'_'+message_id).show();
        $('#messageclick .slr_txt_'+id+'_'+message_id).hide();
        $('#messageclick .bd_resp_'+id+'_'+message_id).show();
    });
  }
}

function ss_delete_trash_head_popup(parent_message_id,message_id){
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

  var total_params = 'token='+token+'&partner_id='+partner_id+'&parent_message_id='+parent_message_id+'&message_id='+message_id;

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
        var sFrom =  getThreadDetails.PartnerMessage.source_from;
        sFrom = sFrom.replace("<","&nbsp;");
        sFrom = sFrom.replace(">","&nbsp;");
        sFrom = sFrom.split("&nbsp;");
        sFrom = sFrom[0];
        sFrom = sFrom.split(" ");
        sFrom = sFrom[0];
        
        var IsAdmin1 = $('#IsAdmin').val();
        var one = sFrom;
        if(IsAdmin1!='Y'){  
          var one = 'me, ';
        }

        var two =  getThreadDetails.PartnerMessage.email;
        two = two.replace("<","&nbsp;");
        two = two.replace(">","&nbsp;");
        two = two.split("&nbsp;");
        two = two[0];
        two = two.split(" ");
        two = two[0];
        var three ='';
        if(getThreadDetails.hasdraft!=0){
        	var three = ', <span style="color:#d23f31">'+draf+'</span>';
        }
        var four = ' ('+getThreadDetails.getTotalCount+')';
        
        string = one+two+three+four;
        pmid = getThreadDetails.PartnerMessage.parent_message_id;
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
      $('#messageclick').parent().next('div').find('span.dock-fileinput-btn').addClass('sspopuphide');
      $('.ms_line'+pmid+ ' p.writer_name:first').html(string);
  
    }
    else if(data.response.status == 'error'){
      if(data.response.response.error == 'validationErrors'){
        var mt_arr = data.response.response.list;
        var array = $.map(mt_arr, function(value, index) {
          return value+'<br />';
        });
        showAlertMessage(array,'error',am);
        return;
      }
      else{
				showAlertMessage(data.response.response.msg,'error',am);
        return;
      } 
    }
  }
}

function show_sub_list_thread_head(mid,lid,msg_id){
  $('#msg_bd_'+mid+' div.mgs_sub_list:last').attr('style','border-top: 1px solid #e0e0e0;');
  $('.mgs_sub_list').show();
  $('.c_count').hide(); 
}

function show_hide_msg_thread_head(row_id,thread_id){
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
}

function show_thread_msg_ellipsis_head(id,index,msg_id){
	$('.thread-btn-ellipsis').hide();
	$('#thread-btn-ellipsis-'+id+''+index+''+msg_id).show();
}

function hide_thread_msg_ellipsis_head(id,index,msg_id){
  $('.thread-btn-ellipsis').hide();
  $('#thread-btn-ellipsis-'+id+''+index+''+msg_id).removeClass('open');
}

function FileUpload(){
  var APISERVER = $('#APISERVER').val();
  var admin_id = $('#admin_id').val();
  var attached_array = [];
    $("form[id^='frm_msg']").fileupload({
          // Uncomment the following to send cross-domain cookies:
          //xhrFields: {withCredentials: true},
          //url: '/plugins/jquery-file-upload/server/php/',
    //formData: {script: true},
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|txt|doc|docx|xlsx|xls|pdf|zip)$/i,
          url: APISERVER+'/api/search/uploadCustomMailLogo.json?admin_id='+admin_id,
          //url: '<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'settings','action' => 'upload', 'mass'),true);?>',  // #044 10-feb-2016 0033935: BE > customer card > email attachment 
          //dataType: 'json',
          autoUpload: true,
    //sequentialUploads: true,
    add: function (e, data) {
      var addHtml = '';
      var jqXHR = data.submit()
        .success(function (result, textStatus, jqXHR) {  
        var str = this.form[0].id; 
        var row_id = str.replace("frm_msg", "");
        
        $.each(result.response.response.files, function (index, file) { 
          attached_array.push(file);
          addHtml += '<tr class="template-download fade in"><td width="10%" class="preview">';
          if(file.thumbnail_url != undefined){
            addHtml += '<a title="'+file.orig_name+'" href="'+file.url+'" data-rel="fancybox-button" class="fancybox-button"><img src="'+file.thumbnail_url+'"></a>';
          }
          addHtml += '</td><td width="30%" class="name">';
          addHtml += '<a download="'+file.orig_name+'" data-gallery="gallery" title="'+file.orig_name+'" href="'+file.url+'">'+file.orig_name+'</a></td>';
          addHtml += '<td width="40%" class="size"><span>'+formatFileSize(file.size)+'</span></td><td colspan="2"></td>';
          addHtml += '<td width="10%" class="delete">'; 
          addHtml += '<button data-url="'+file.delete_url+'" data-type="DELETE" class="btn  mini"><i class="icon-remove"></i></button></td></tr>';                
        });
        $('.table-striped#table-striped_'+row_id+' .files').append(addHtml);
        
        $('#attachments').val(JSON.stringify(attached_array));
      
       })
      .error(function (jqXHR, textStatus, errorThrown) {})
      .complete(function (result, textStatus, jqXHR) {          
        $('#progress').hide();
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

      
  $("form[id^='frm_msg']").bind('fileuploaddestroy', function (e, data) {
    json_arr = $('#attachments').val();
    delete_url = data.url;
    arr = JSON.parse(json_arr);
    var j_arr = removeItem(arr, 'delete_url', delete_url);
    attached_array = j_arr;
    $('#attachments').val(JSON.stringify(attached_array));
    
  });
}

function reply_body_msg_show_tpl_head(id,parent_message_id,removelocal='yes',message='',attachments='',from){
  if(removelocal=='yes'){
      localStorage.removeItem('draftidspopup');
    }
  //console.log(id+'reply_body_msg_show_tpl_head'+parent_message_id);
  var data_len = $('#attachments').val();
  if(data_len!=undefined){
    if(data_len.length == 2){
      $('#table-striped_'+id+' .files').html('');
    }
  }
  var editor = CKEDITOR.instances['TemplateContent_popup'+id]; 
  if(editor){ 
    editor.destroy(true);
  }
  if(1==1){ 
     CKEDITOR.replace('TemplateContent_popup'+id,{
        uiColor: 'FFFFFF', 
        height:['100px'],
        enterMode: CKEDITOR.ENTER_BR,
        removePlugins: 'elementspath,magicline',
        startupFocus : true,
        bodyClass:'test',
        extraPlugins: 'autogrow',
         removePlugins: 'elementspath,resize,magicline',
    
        toolbar: [
            { name: 'colors', items : [ 'TextColor','BGColor' ] },
            { name: 'basicstyles', items : [ 'Bold','Underline' ] },
            { name: 'paragraph', items : [ 'NumberedList','BulletedList' ] },
            { name: 'links', items : [ 'Blockquote' ] },
          ],
        removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar,About'     
      });
      CKEDITOR.config.autoGrow_onStartup = true; 

    }
    //    sharedSpaces: {top: 'editorPlace_popup'+id, },
    CKEDITOR.on('instanceReady', function(){ 
      CKEDITOR.config.autoGrow_onStartup = true;  
      //CKEDITOR.config.extraPlugins = 'sharedspace,panel,floatpanel,button,colorbutton,listblock,richcombo,font,dialog,dialogui,clipboard,autolink'; 
      CKEDITOR.config.coreStyles_bold = { element: 'b', overrides: 'strong' };
      CKEDITOR.config.coreStyles_italic = { element : 'i', overrides : 'em' };
      //CKEDITOR.config.sharedSpaces = { top: 'dockeditorfooter' };
      bind_upoad_head(id,'popup',id,parent_message_id);
      bind_upoad_head(parent_message_id,'popup',id,parent_message_id);
      //console.log(id+'bind_upoad_head'+parent_message_id);
      
      //console.log('instancesready');
      //localStorage.removeItem('draftidspopup');
      $('#table-striped_'+id+'>tbody').html('');
      if(attachments!=''){
        //var file = attachments;
        var attachmentss = JSON.stringify(attachments);
        $('#final_attachments'+id).val(attachmentss);
        var addHtml= '';
        
        for(var file in attachments){
          addHtml += '<tr class="template-download fade in"><td width="10%" class="preview">';
          if(attachments[file].thumbnail_url != undefined){
            addHtml += '<a title="'+attachments[file].orig_name+'" href="'+attachments[file].url+'" data-rel="fancybox-button" class="fancybox-button"><img src="'+attachments[file].thumbnail_url+'"></a>';
          }
          else{
          
          }
          var delete_url = 'http://core.comsoft.nor/api/search/uploadCustomMailLogo.json?file='+encodeURI(attachments[file].file_name);
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
        CKEDITOR.instances['TemplateContent_popup'+id].setData(message);
      }
      var timeouts = [];
      CKEDITOR.instances['TemplateContent_popup'+id].on('change', function(e) {
        $('.draft_progress').show();
        $('.draft_complete').hide();
        //console.log('changepopup');
        //console.log(id+'onchange'+parent_message_id);
        for (var i = 0; i < timeouts.length; i++) {
          clearTimeout(timeouts[i]);
        }
        timeouts = [];
        if(localStorage.getItem('draftidspopup')!=null){
          timeouts.push(
            setTimeout(function(){
              set_reply_msg_head(id,'draft',parent_message_id); 
            }, 1000)
          );
        }
        else{
          set_reply_msg_head(id,'draft',parent_message_id);
        }
      });

      CKEditor_loaded = true; 
      if($('.cke_editor_TemplateContent_popup'+id+' div.cke_inner span.cke_top').length!=0){
        var tlbrtbtm = $('.cke_editor_TemplateContent_popup'+id+' div.cke_inner span.cke_top').clone();
        $('#messageclick').parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').html('');
          $('#messageclick').parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').append(tlbrtbtm);
          $('.cke_editor_TemplateContent_popup'+id+' div.cke_inner span.cke_top').remove();
          $('.ssdiscard').removeClass('sspopuphide');
          $('.ssreply').removeClass('sspopuphide');
          var html ='<i class="icon-circle draft_progress_popup" style="float:right;color:#d23f31;margin-top: 12px;"></i><i class="icon-ok draft_complete_popup" style="display:none;float:right;color:green;margin-top: 12px;"></i>';
          if(from=='ss_message_click'){
            var a = id;
            if(parent_message_id!=0){
              var a = parent_message_id;
            }
            $('.replymsgclick').addClass('sspopuphide');
            $('#messageclick .reply-body-btn-'+a).show();
            $('#messageclick .rpl'+a).show();
            $('#messageclick .imgm'+a).show();
            $('.ssreply').removeClass('sspopuphide');
            $('.ssdiscard').removeClass('sspopuphide');
            $('#messageclick .reply-main').show();
            $('#messageclick .reply-msg').show();
            $("#messageclick #TemplateContent_popup"+a ).val('');
            $('#messageclick').parent().next('div').find('.dock-fileinput-btn').removeClass('sspopuphide');
            $('#messageclick').parent().next('div').find('.dock-fileinput-btn').show();
          }
          
          $('#messageclick').parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').prepend(html);
      }
      
      $('#messageclick').parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').removeClass('sspopuphide');
      $('#messageclick').parent('div').animate({
        scrollTop: $('#messageclick')[0].scrollHeight},'slow',function(){
      
         CKEDITOR.instances['TemplateContent_popup'+id].focus();
      }); 


    }); 
  $('#messageclick .reply-body-btn-'+id).show();
  $('#messageclick .rpl'+id).show();
  $('#messageclick .imgm'+id).show();
}
  
function reply_body_msg_hide_tpl_head(id){

	$('#messageclick #frm_msg'+id+' #table-striped_'+id+' .files').children().children('.delete').children('.btn').click();

	var data_len = $('#attachments').val();
	if(data_len!=undefined){
	  if(data_len.length == 2){
		$('#table-striped_'+id+' .files').html('');
	  }
	}
	var editor = CKEDITOR.instances['TemplateContent_popup'+id];
	  if(editor){ 
		  editor.destroy(true);
	  }
	$('#messageclick #TemplateContent_popup'+id).val(''); 
	$('.reply-body-btn-'+id).hide();
	$('.rpl'+id).hide();
	$('.imgm'+id).hide();
	$('#messageclick .reply-main').hide();
	$('#messageclick .reply-msg').hide();
	$('.ssdiscard').addClass('sspopuphide');
	$('.ssreply').addClass('sspopuphide');
  $('#messageclick').parent().next('div.dockmodal-footer').find('span.dock-fileinput-btn').addClass('sspopuphide');
	$('.replymsgclick').removeClass('sspopuphide');
	$('#messageclick').parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').addClass('sspopuphide');
  }

  function bind_upoad_head(id,from='',sid='',pmid=''){
  	var APISERVER = $('#APISERVER').val();
  	 var admin_id = $('#admin_id').val();
  	 var attached_array = [];
  	$("#frm_msg"+id).fileupload({
		// Uncomment the following to send cross-domain cookies:
		//xhrFields: {withCredentials: true},
		//url: '/plugins/jquery-file-upload/server/php/',
	  //formData: {script: true},
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|txt|doc|docx|xlsx|xls|pdf|zip)$/i,
		url: APISERVER+'/api/search/uploadCustomMailLogo.json?admin_id='+admin_id,
		//url: '<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'settings','action' => 'upload', 'mass'),true);?>',  // #044 10-feb-2016 0033935: BE > customer card > email attachment 
		//dataType: 'json',
		autoUpload: true,
	  //sequentialUploads: true,
	  add: function (e, data) {
		var addHtml = '';
		var jqXHR = data.submit()
		  .success(function (result, textStatus, jqXHR) {  
		  var str = this.form[0].id; 
		  var row_id = str.replace("frm_msg", "");
		  
		  $.each(result.response.response.files, function (index, file) { 
			attached_array.push(file);
			addHtml += '<tr class="template-download fade in"><td width="10%" class="preview">';
			if(file.thumbnail_url != undefined){
			  addHtml += '<a title="'+file.orig_name+'" href="'+file.url+'" data-rel="fancybox-button" class="fancybox-button"><img src="'+file.thumbnail_url+'"></a>';
			}
			addHtml += '</td><td width="30%" class="name">';
			addHtml += '<a download="'+file.orig_name+'" data-gallery="gallery" title="'+file.orig_name+'" href="'+file.url+'">'+file.orig_name+'</a></td>';
			addHtml += '<td width="40%" class="size"><span>'+formatFileSize(file.size)+'</span></td><td colspan="2"></td>';
			addHtml += '<td width="10%" class="delete">'; 
			addHtml += '<button data-url="'+file.delete_url+'" data-type="DELETE" class="btn  mini"><i class="icon-remove"></i></button></td></tr>';                
		  });
		  $('.table-striped#table-striped_'+row_id+' .files').append(addHtml);
		  
		  //$('#attachments').val(JSON.stringify(attached_array));
      if(from=='newmail'){
        $('#final_attachments'+id).val(JSON.stringify(attached_array));
      }
      else{
        $('#final_attachments_popup'+sid).val(JSON.stringify(attached_array));
        $('#final_attachments_popup'+pmid).val(JSON.stringify(attached_array));
		  }
		 })
		.error(function (jqXHR, textStatus, errorThrown) {})
		.complete(function (result, textStatus, jqXHR) {          
		  $('#progress').hide();

      if(from=='popup'){
        $('.draft_progress_popup').show();
        $('.draft_complete_popup').hide();
       //console.log('fileuploadpopupcomplete');
       set_reply_msg_head(sid,'draft',pmid);

      }
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

  	$("form[id^='frm_msg']").bind('fileuploaddestroy', function (e, data) {
      if(from=='newmail'){
        json_arr = $('#final_attachments'+id).val();
      }
      else{
         json_arr = $('#final_attachments_popup'+sid).val();
      }
  	  delete_url = data.url;
  	  arr = JSON.parse(json_arr);
  	  var j_arr = removeItemhead(arr, 'delete_url', delete_url);
  	  attached_array = j_arr;
  	  //$('#attachments').val(JSON.stringify(attached_array));
      if(from=='newmail'){
        $('#final_attachments'+id).val(JSON.stringify(attached_array));
      }
      else{
    	  $('#final_attachments_popup'+sid).val(JSON.stringify(attached_array));
        $('#final_attachments_popup'+pmid).val(JSON.stringify(attached_array));
      }
  	});
  }


function removeItemhead(obj, prop, val){
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


	function set_reply_msg_head(lineID,draft='',parent_message_id='',sendmail='no'){
  var body = CKEDITOR.instances['TemplateContent_popup'+lineID].getData();
  $('#reply_msg_body_popup'+lineID).val(body);
  $('.field_id').val(lineID);

  if(draft==''){
	ss_send_reply_mail_head(lineID,'',parent_message_id,sendmail);
  }
  else if(draft=='draft'){
	ss_send_reply_mail_head(lineID,'draft',parent_message_id,sendmail);
  }
}

function ss_send_reply_mail_head(lineID,draft='',parent_message_id='',sendmail){

  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  if(parent_message_id!=''){
	parent_message_id = parseInt(parent_message_id);
  }
  var partner_id = $('#partner_id').val();
  var mailbody = $('#reply_msg_body_popup'+lineID).val();
  if(mailbody==undefined || mailbody==null){
	mailbody ='';

  }
  var mailbody1 ='';
  //console.log(mailbody);
  if(mailbody!=''){
	//mailbody1 = StripTags(mailbody);
  }

  //$('.ms_line'+lineID+' .msg_body').html(mailbody1);

  var mail_subject = $('#msg_sub_popup'+lineID).val(); 

  var msg_id = $('#msg_id_popup'+lineID).val();
  

  var cemail= $('#cust_email_popup'+lineID).val().trim();
  var cust_email1 = new Array(); 
  var newname = new Array();
  cust_email1.push(cemail);
  var obj = {};
  obj[cemail] = $('#cust_name_popup'+lineID).val().trim();
   //console.log('obj');
   //console.log(obj);
  var cust_name = new Array();
  cust_name.push(obj);
  cust_name = JSON.stringify(cust_name);
  //console.log('cust_name'+cust_name);
  
  //console.log(newname);


  cust_email1 = JSON.stringify(cust_email1);
  
  var to_email_popup = $('#to_email_popup'+lineID).val();
  //var cust_name =  $('#cust_name_popup'+lineID).val();
  var reply_from = $('#reply_from_popup'+lineID).val();
  var cust_id = $('#cust_id_popup'+lineID).val();
  var cust_con_id = $('#cust_con_id_popup'+lineID).val();
   
  var request_from = $('#request_from'+lineID).val();
  if(request_from==undefined || request_from==null){
	request_from ='';
  }
  var request_from_cust = $('#request_from_cust'+lineID).val(); 
  var from_inbox = $('#from_inbox'+lineID).val();
  var attachments = $('#final_attachments_popup'+lineID).val(); 
  if(attachments==undefined || attachments==null){
	attachments='';
  }
  
  var cust_email = new Array(); 

  var sender = $('#type').val();
  var from_inbox = 'inbox';
  /*if(from_inbox != 'inbox'){
	if(cust_con_id!='' && cust_con_id!=null && cust_con_id!=undefined){
	  cust_email.push(cust_id+'##'+cust_con_id+'##'+$cust_email1);
	}
	else if(cust_id!='' && cust_id!=null && cust_id!=undefined){
	  cust_email.push(cust_id+'##'+cust_email1);
	}
	else{
	  //showAlertMessage(array,'error','<?php echo __("exception_error")?>');
	  //return;
	}
  }else{
	cust_email.push(cust_email1);
  }*/
  cust_email = JSON.stringify(cust_email);
	
	var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:cust_email1,customer_name:cust_name,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,sendmail:sendmail};
	var whereto = '';
	if(draft==''){
	  whereto = 'sendCommunicationCustomEmail';
	  
	}
	else if(draft=='draft'){
		whereto = 'saveToDraftonChange';
		if(localStorage.getItem('draftidspopup')!=undefined && localStorage.getItem('draftidspopup')!=null){
		  var getdraftids = JSON.parse(localStorage.getItem('draftidspopup'));
		  var partner_message_text_id = getdraftids.partner_message_text_id;
		  var partner_message_id = getdraftids.partner_message_id;
		  
		  if(partner_message_text_id!=null && partner_message_text_id!=undefined && partner_message_text_id!=''){
			whereto ='updateDraftOnChange';
			if(sendmail=='no'){
			  
			  var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:cust_email1,customer_name:cust_name,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail};
		  
			}
			else if(sendmail=='yes'){
				var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:cust_email1,customer_name:cust_name,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail};
			}
		  }
		}
	}
  
	  $.ajax({
		  type: 'POST',
		  url: APISERVER+'/api/PartnerMessages/'+whereto+'.json',
		  data: params,
		  async: false,
		  dataType : "json",
		  success: function(data,status,xhr){
          $('.draft_progress_popup').hide();
          $('.draft_complete_popup').show();
			 data.response.status = is_undefined(data.response.status);
			if(data.response.status == 'error'){
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
			}
			if(data.response.status == 'success'){
			  if(whereto=='saveToDraftonChange'){
				  var getThreadDetails = data.response.response.getThreadDetails;
				  var sFrom =  getThreadDetails.PartnerMessage.source_from;
				  sFrom = sFrom.replace("<","&nbsp;");
				  sFrom = sFrom.replace(">","&nbsp;");
				  sFrom = sFrom.split("&nbsp;");
				  sFrom = sFrom[0];
				  sFrom = sFrom.split(" ");
				  sFrom = sFrom[0];
				  
				  var IsAdmin1 = $('#IsAdmin').val();
				  var one = sFrom;
				  if(IsAdmin1!='Y'){  
					var one = 'me, ';
				  }

				  var two =  getThreadDetails.PartnerMessage.email;
				  two = two.replace("<","&nbsp;");
				  two = two.replace(">","&nbsp;");
				  two = two.split("&nbsp;");
				  two = two[0];
				  two = two.split(" ");
				  two = two[0];

				  if(getThreadDetails.hasdraft!=0){
						var three = ', <span style="color:#d23f31">'+draf+'</span>';
				  }
				  var four = '('+getThreadDetails.getTotalCount+')';
				  
				  var string = one+two+three+four;
				  var pmid = getThreadDetails.PartnerMessage.parent_message_id;
				  pmid = parseInt(pmid);
				  //console.log('saveToDraftonChangesuccess'+string);
				  $('.ms_line'+pmid+ ' p.writer_name:first').html(string);
				  
			  }
			  if(draft!='draft'){
					call_toastr('success', suc,data.response.response.success);
					ssAppendNewThreadinbox(data.response.response.getThreadDetails,'','','');
			  }
			  else if(draft=='draft' && sendmail=='no' && whereto=='saveToDraftonChange'){
				  var check = localStorage.getItem('draftidspopup');
				
  				if(data.response.response.partner_message_text_id && data.response.response.partner_message_id && check==null){
  					var pmid = data.response.response.partner_message_text_id;
  					var pmi = data.response.response.partner_message_id;
  					var draftids = {partner_message_text_id:pmid,partner_message_id:pmi};
  					draftids = JSON.stringify(draftids);
  					localStorage.setItem('draftidspopup',draftids);
  				}             
			  }
			  else if(draft=='draft' && sendmail=='yes'){
				  $('.draft_progress').hide();
				  $('.draft_complete').hide();
				  
				  if(data.response.response.message!=undefined && data.response.response.message!=null ){
					var msg  = data.response.response.message;
				  }
				  else{
					var msg  = data.response.response.success;
				  }
					call_toastr('success', suc,msg);
				  ssAppendNewThreadinbox(data.response.response.getThreadDetails,'','','');
			  }
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
					showAlertMessage(array,'error',am);
        return;
      }
      else{
					showAlertMessage(data.response.response.msg,'error',am);
        return;
      } 
    }
  }
}

function show_thread_msg_ellipsis(id,index,msg_id){
  $('.thread-btn-ellipsis').hide();
  $('#thread-btn-ellipsis-'+id+''+index+''+msg_id+'').show();
}

function hide_thread_msg_ellipsis(id,index,msg_id){
  $('.thread-btn-ellipsis').hide();
  $('#thread-btn-ellipsis-'+id+''+index+''+msg_id+'').removeClass('open');
}
		
function generateDockmodalForReply(title='n',msg_id,parent_message_id){
		if(title=='n'){
			title = 'New Message';
	  }
	  else{
	  	title = draf;
	  }
      ///check local storage
      function lsTest(){
        var test = 'test';
        try {
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch(e) {
          return false;
        }
      }
      if(lsTest() !== true){
        showAlertMessage('Local storage unavailable, Please upgrade to new browser.','error');
        return;
      }
        
      var count = getdkmodalStorage('counter');
      if(!count){
        count = 0;
        setdkmodalStorage('counter', 0);
      }
      
      var html = $('#parent_div').html();
      html = html.replace(/frm_modal_msg/g, 'frm_modal_msg'+count);
      html = html.replace(/attachments_cst/g, 'attachments_cst'+count);
      html = html.replace(/table-striped-modal/g, 'table-striped-modal'+count);
      html = html.replace(/fileupload_form_class/g, 'fileupload_form_class'+count);
      html = html.replace(/customer_email_input/g, 'customer_email_input'+count);
      html = html.replace(/input_bcc/g, 'input_bcc'+count);
      html = html.replace(/cc_input/g, 'cc_input'+count);       
      html = html.replace(/subject_input/g, 'subject_input'+count);
      html = html.replace(/cst_textarea/g, 'cst_textarea'+count);
      html = html.replace(/cst_message_body/g, 'cst_message_body'+count);
      html = html.replace(/cst_files/g, 'cst_files'+count);
      html = html.replace(/cstkn_to/g, 'cstkn_to'+count);
      html = html.replace(/bcc-input/g, 'bcc-input'+count);
      html = html.replace(/input-cc/g, 'input-cc'+count);
      html = html.replace(/btn_cc_bcc/g, 'btn_cc_bcc'+count);
      html = html.replace(/show_cc_bcc/g, 'show_cc_bcc'+count);
      html = html.replace(/dkfileupload_input/g, 'dkfileupload_input'+count);
      html = html.replace(/at_progress/g, 'at_progress'+count);
      html = html.replace(/at_status/g, 'at_status'+count);
      html = html.replace(/at_percent/g, 'at_percent'+count);
      
      var appendData = '<div id=dkmod'+count+' class="dkmodal">'+html+'</div>';
      $('#parent_main_div').append(appendData).each(function () { 
        setFormdataStorage(count);  
        bindFunctions(count,'reply');
        //update form data onmuseleave
        $("#dkmod"+count).parent().parent().mouseleave(function(){
          setFormdataStorage(count);
        }); 
      });

      $('#dkmod'+count).dockmodal({   
        dockID : 'dkmod'+count,
        open: function(){ add_dkmod_ids('dkmod'+count,count);},
        close: function(){ $('#parent_main_div > #dkmod'+count).remove(); remove_dkmod_ids('dkmod'+count,count); }, 
        title:title,
        buttons: [
          {
	          html: "<i class='icon-check'></i>&nbsp;"+sen,
	          buttonClass: "btn blue",
	          click: function () {
	            var no = count;
	            $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
	            OnChangeReply(count,'yes');
              set_reply_msg_reply(no,'draft','','yes',msg_id);
	          }
        	},
          {
            html: draf,
            buttonClass: "btn",
            click: function () {
              var no = count;
              $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
              OnChangeReply(count,'yes');
              set_reply_msg_reply(no,'draft','','no','yes');  
              $('#dkmod'+no).dockmodal('destroy');
            }
          },
          {
            html: dis,
            buttonClass: "btn",
            click: function () {
              var no = count;
              if(getdkmodalStorage('dkmod'+no)!=null && getdkmodalStorage('dkmod'+no)!=undefined && getdkmodalStorage('dkmod'+no)!=""){
              
                var num = JSON.parse(getdkmodalStorage('dkmod'+no));
                var obj = JSON.parse(getdkmodalStorage('editdraftids'+num));
                if(obj!=null && obj!=undefined){
                  var ss_msg_id = obj.partner_message_id;
                  localStorage.removeItem('dkmod'+no);                          
                  localStorage.removeItem('editdraftids'+num);
                  OnChangeReply(count,'yes');
                  ss_delete_trash_head(0,ss_msg_id);
                }
              }
              $('#dkmod'+no).dockmodal('destroy');
            }
          }
        ], 
      });     
      //editor start  count
                    
      var ckeditor = CKEDITOR.instances['cst_textarea'+count];
      if(!ckeditor){  
        CKEDITOR.replace('cst_textarea'+count,{
          uiColor: 'transparent', 
          height:['250px'],
          enterMode: CKEDITOR.ENTER_BR,
          extraPlugins: 'autogrow',
          removePlugins: 'elementspath,resize,magicline',
          startupFocus : true,
          toolbar:
                [
                  { name: 'colors', items : [ 'TextColor','BGColor' ] },
                  { name: 'basicstyles', items : [ 'Bold','Italic','Underline' ] },
                  { name: 'paragraph', items : [ 'NumberedList','BulletedList','Blockquote'] },
                   { name: 'insert', items : [ 'Image' ] },
                ],
                
          removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar,About' 
        });
        CKEDITOR.config.autoGrow_onStartup = true;  
        CKEDITOR.config.coreStyles_bold = { element: 'b', overrides: 'strong' };
        CKEDITOR.config.coreStyles_italic = { element : 'i', overrides : 'em' };
        CKEDITOR.config.sharedSpaces = { top: 'dockeditordkmod'+count };
        
          
        CKEDITOR.instances['cst_textarea'+count].on('instanceReady', function(){
          set_reply_msg_reply(count,'draft','');
          setTimeout(function(){
            $('#dockeditordkmod'+count).after('<i class="icon-circle draft_progress_reply" style="float:right;color:#d23f31;margin-top: 12px;display:none"></i><i class="icon-ok draft_complete_reply" style="display:block;float:right;color:green;margin-top: 12px;"></i>');
          },1500);

	        CKEDITOR.instances['cst_textarea'+count].on('change', function(e) {
	          setFormdataStorage(count);
	          OnChangeReply(count);
	        });
          $('.subject_input'+count).on('keyup',function(){
             OnChangeReply(count);
          });
     		}); 
	     
        //hide toolbar in mobile screen
        if($(window).width() < 480){
          $('#dockeditordkmod'+count).hide();
        } 
    	}
	    //editor end  
	    //save form data to storage after form generation             
	    setFormdataStorage(count);
	    //var obj = {message_id:msg_id,parent_message_id:parent_message_id};

	    //setdkmodalStorage('dkmod'+count,msg_id);  
	        
	    //call fileupload function on fileupload btn click | at last
	    $('.dock-fileinput-btndkmod'+count).click(function () {
	      $(".dkfileupload_input"+count).trigger("click");
	    });        
      return count;
} 

function generateDockmodal(title='n',msg_id,parent_message_id){
      if(title=='n'){
        title = 'New Message';
      }
      else{
        title = draf;
      }
      ///check local storage
      function lsTest(){
        var test = 'test';
        try {
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch(e) {
          return false;
        }
      }
      if(lsTest() !== true){
        showAlertMessage('Local storage unavailable, Please upgrade to new browser.','error');
        return;
      }
        
      var count = getdkmodalStorage('counter');
      if(!count){
        count = 0;
        setdkmodalStorage('counter', 0);
      }
      
      var html = $('#parent_div').html();
      html = html.replace(/frm_modal_msg/g, 'frm_modal_msg'+count);
      html = html.replace(/attachments_cst/g, 'attachments_cst'+count);
      html = html.replace(/table-striped-modal/g, 'table-striped-modal'+count);
      html = html.replace(/fileupload_form_class/g, 'fileupload_form_class'+count);
      html = html.replace(/customer_email_input/g, 'customer_email_input'+count);
      html = html.replace(/input_bcc/g, 'input_bcc'+count);
      html = html.replace(/cc_input/g, 'cc_input'+count);       
      html = html.replace(/subject_input/g, 'subject_input'+count);
      html = html.replace(/cst_textarea/g, 'cst_textarea'+count);
      html = html.replace(/cst_message_body/g, 'cst_message_body'+count);
      html = html.replace(/cst_files/g, 'cst_files'+count);
      html = html.replace(/cstkn_to/g, 'cstkn_to'+count);
      html = html.replace(/bcc-input/g, 'bcc-input'+count);
      html = html.replace(/input-cc/g, 'input-cc'+count);
      html = html.replace(/btn_cc_bcc/g, 'btn_cc_bcc'+count);
      html = html.replace(/show_cc_bcc/g, 'show_cc_bcc'+count);
      html = html.replace(/dkfileupload_input/g, 'dkfileupload_input'+count);
      html = html.replace(/at_progress/g, 'at_progress'+count);
      html = html.replace(/at_status/g, 'at_status'+count);
      html = html.replace(/at_percent/g, 'at_percent'+count);
      
      var appendData = '<div id=dkmod'+count+' class="dkmodal">'+html+'</div>';
      $('#parent_main_div').append(appendData).each(function () { 
      	setFormdataStorage(count);  
        bindFunctions(count);
        //update form data onmuseleave
        $("#dkmod"+count).parent().parent().mouseleave(function(){
          setFormdataStorage(count);
        }); 
      });

      $('#dkmod'+count).dockmodal({   
        dockID : 'dkmod'+count,
        open: function(){ add_dkmod_ids('dkmod'+count,count);},
        close: function(){ $('#parent_main_div > #dkmod'+count).remove(); remove_dkmod_ids('dkmod'+count,count); }, 
        title:title,
        buttons: [
          {
            html: "<i class='icon-check'></i>&nbsp;"+sen,
            buttonClass: "btn blue",
            click: function () {
            var no = count;
            $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
              ss_letters_custom_mail(no,'draft','','yes',msg_id);
            }
          },
          {
            html: draf,
            buttonClass: "btn",
            click: function () {
              var no = count;
              $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
              var obj = JSON.parse(getdkmodalStorage('dkmod'+no));
              var ss_msg_id = obj;
              ss_letters_custom_mail(no,'draft',parent_message_id,'no',ss_msg_id,'yes');
              $('#mgs_sub_list_row'+parent_message_id+ss_msg_id+ss_msg_id).css('pointer-events','all');
              $('#dkmod'+no).dockmodal('destroy');
            }
          },
          {
            html: dis,
            buttonClass: "btn",
            click: function () {
              var no = count;
              
              var obj = JSON.parse(getdkmodalStorage('dkmod'+no));
              var ss_msg_id = obj.message_id;
              var ss_parent_msg_id =  obj.parent_message_id;
              localStorage.removeItem('dkmod'+no);
              ss_delete_trash_head(parent_message_id,msg_id);
              $('#dkmod'+no).dockmodal('destroy');
            }
          }
        ], 
      }); 
          
      //editor start  count
                    
     	var ckeditor = CKEDITOR.instances['cst_textarea'+count];
	    if(!ckeditor){  
        CKEDITOR.replace('cst_textarea'+count,{
          uiColor: 'transparent', 
          height:['250px'],
          enterMode: CKEDITOR.ENTER_BR,
          extraPlugins: 'autogrow',
          removePlugins: 'elementspath,resize,magicline',
          startupFocus : true,
          toolbar:
                [
                  { name: 'colors', items : [ 'TextColor','BGColor' ] },
                  { name: 'basicstyles', items : [ 'Bold','Italic','Underline' ] },
                  { name: 'paragraph', items : [ 'NumberedList','BulletedList','Blockquote'] },
                  { name: 'insert', items : [ 'Image' ] },
                ],
          removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar,About' 
        });
        CKEDITOR.config.autoGrow_onStartup = true;  
        CKEDITOR.config.coreStyles_bold = { element: 'b', overrides: 'strong' };
        CKEDITOR.config.coreStyles_italic = { element : 'i', overrides : 'em' };
        CKEDITOR.config.sharedSpaces = { top: 'dockeditordkmod'+count };
        CKEDITOR.instances['cst_textarea'+count].on('change', function(e) {
          setFormdataStorage(count);
        }); 
        //hide toolbar in mobile screen
        if($(window).width() < 480){
          $('#dockeditordkmod'+count).hide();
        } 
	    }
      //editor end  
      //save form data to storage after form generation             
      setFormdataStorage(count);
      var obj = {message_id:msg_id,parent_message_id:parent_message_id};
      setdkmodalStorage('dkmod'+count,msg_id);        
      //call fileupload function on fileupload btn click | at last
      $('.dock-fileinput-btndkmod'+count).click(function () {
        $(".dkfileupload_input"+count).trigger("click");
      });
      return count;
} 

function generateDockmodalNew(from=''){
      function lsTest(){
        var test = 'test';
        try {
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch(e) {
          return false;
        }
      }
      if(lsTest() !== true){
        showAlertMessage('Local storage unavailable, Please upgrade to new browser.','error');
        return;
      }
      
      var count = getdkmodalStorage('counter');
      if(!count){
        count = 0;
        setdkmodalStorage('counter', 0);
      }
      var html = $('#parent_div').html();
      html = html.replace(/frm_modal_msg/g, 'frm_modal_msg'+count);
      html = html.replace(/attachments_cst/g, 'attachments_cst'+count);
      html = html.replace(/table-striped-modal/g, 'table-striped-modal'+count);
      html = html.replace(/fileupload_form_class/g, 'fileupload_form_class'+count);
      html = html.replace(/customer_email_input/g, 'customer_email_input'+count);
      html = html.replace(/input_bcc/g, 'input_bcc'+count);
      html = html.replace(/cc_input/g, 'cc_input'+count);       
      html = html.replace(/subject_input/g, 'subject_input'+count);
      html = html.replace(/cst_textarea/g, 'cst_textarea'+count);
      html = html.replace(/cst_message_body/g, 'cst_message_body'+count);
      html = html.replace(/cst_files/g, 'cst_files'+count);
      html = html.replace(/cstkn_to/g, 'cstkn_to'+count);
      html = html.replace(/bcc-input/g, 'bcc-input'+count);
      html = html.replace(/input-cc/g, 'input-cc'+count);
      html = html.replace(/btn_cc_bcc/g, 'btn_cc_bcc'+count);
      html = html.replace(/show_cc_bcc/g, 'show_cc_bcc'+count);
      html = html.replace(/dkfileupload_input/g, 'dkfileupload_input'+count);
      html = html.replace(/at_progress/g, 'at_progress'+count);
      html = html.replace(/at_status/g, 'at_status'+count);
      html = html.replace(/at_percent/g, 'at_percent'+count);
      var appendData = '<div id=dkmod'+count+' class="dkmodal">'+html+'</div>';
      $('#parent_main_div').append(appendData).each(function () { 
      	setFormdataStorage(count);  
	      bindFunctions(count,'new');
	      //update form data onmuseleave
	      $("#dkmod"+count).parent().parent().mouseleave(function(){
	        setFormdataStorage(count);
	      }); 
	    });
      $('#dkmod'+count).dockmodal({   
        dockID : 'dkmod'+count,
        open: function(){ add_dkmod_ids('dkmod'+count,count);},
        close: function(){ 
           //ss_letters_custom_mail_new(count,'no','yes');
          $('#parent_main_div > #dkmod'+count).remove(); 
          remove_dkmod_ids('dkmod'+count,count);   
        }, 
        buttons: [
          {
            html: "<i class='icon-check'></i>&nbsp;"+sen,
            buttonClass: "btn blue",
            click: function () {
              var no = count;
              $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
               OnChangeNew(count,'yes');
              ss_letters_custom_mail_new(no,'yes','yes','');
            }
          },
          {
            html: draf,
            buttonClass: "btn",
            click: function () {
              var no = count;
              $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
               OnChangeNew(count,'yes');
              ss_letters_custom_mail_new(no,'no','yes','draft');
                $('#dkmod'+no).dockmodal('destroy');
            }
          },
          {
            html: dis,
            buttonClass: "btn",
            click: function () {
              var no = count;
              var obj = getdkmodalStorage('dkmod'+count);
              ss_delete_trash_head(0,obj);
              localStorage.removeItem('dkmod'+count);
              localStorage.removeItem('editdraftids'+obj);
              OnChangeNew(count,'yes');
              $('#dkmod'+no).dockmodal('destroy');
            }
          }
        ], 
      }); 
        
      //editor start  count  
      var ckeditor = CKEDITOR.instances['cst_textarea'+count];
      if(!ckeditor){  
        CKEDITOR.replace('cst_textarea'+count,{
          uiColor: 'transparent', 
          height:['250px'],
          enterMode: CKEDITOR.ENTER_BR,
          extraPlugins: 'autogrow',
          removePlugins: 'elementspath,resize,magicline',
          startupFocus : true,
          toolbar:
                [
                  { name: 'colors', items : [ 'TextColor','BGColor' ] },
                  { name: 'basicstyles', items : [ 'Bold','Italic','Underline' ] },
                  { name: 'paragraph', items : [ 'NumberedList','BulletedList','Blockquote'] },
                    { name: 'insert', items : [ 'Image' ] },
                ],
                  
          removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar,About' 
        });
        CKEDITOR.config.autoGrow_onStartup = true;  
        CKEDITOR.config.coreStyles_bold = { element: 'b', overrides: 'strong' };
        CKEDITOR.config.coreStyles_italic = { element : 'i', overrides : 'em' };
        CKEDITOR.config.sharedSpaces = { top: 'dockeditordkmod'+count };
        CKEDITOR.instances['cst_textarea'+count].on('instanceReady', function(){ 
	        $('#dkmod'+count).parent().prev('div').children('.action-close').click(function(){
	          var obj = getdkmodalStorage('dkmod'+count);
	          localStorage.removeItem('dkmod'+count);
	          localStorage.removeItem('editdraftids'+obj);
	        });

	        setTimeout(function(){
	          $('#dockeditordkmod'+count).after('<i class="icon-circle draft_progress_new" style="float:right;color:#d23f31;margin-top: 12px;display:none"></i><i class="icon-ok draft_complete_new" style="display:block;float:right;color:green;margin-top: 12px;"></i>');
	        },1500);
	    		if(from!='draft'){
	        	ss_letters_custom_mail_new(count,'no','no');
	      	}
	        CKEDITOR.instances['cst_textarea'+count].on('change', function(e) {
	            OnChangeNew(count);      
	            setFormdataStorage(count);
	        });
           $('.subject_input'+count).on('keyup',function(){
             OnChangeNew(count);
          });
      	});
       
        //hide toolbar in mobile screen
        if($(window).width() < 480){
          $('#dockeditordkmod'+count).hide();
        } 
      }
      
      //editor end  
      //save form data to storage after form generation             
      setFormdataStorage(count);  
      
      //call fileupload function on fileupload btn click | at last
      $('.dock-fileinput-btndkmod'+count).click(function () {
        $(".dkfileupload_input"+count).trigger("click");
      });
      
      return count;
} //generatedockmodal() ends here

function getInboxCountApi(){
          var APISERVER = $('#APISERVER').val();
          var token = $('#token').val();
          var language = $('#language').val();
          var lang = $('#lang').val();
          var partner_id = $('#partner_id').val();
       
          var stafer_id = $('#staffer_id').val();
          var IsAdmin = $('#IsAdmin').val();
          if(stafer_id=='' || stafer_id==undefined || stafer_id==null){
            if(IsAdmin != 'Y'){
              var total_params = 'token='+token+'&partner_id='+partner_id+'&login_id='+login_id;
              var data = passProdRequest(APISERVER+'/api/partners/getPartnerContactDetailsByLoginId.json',total_params);
              if(data == undefined){
                var json_data = $('#json_data').val();
                var data = JSON.parse(json_data);
                data.response.status = is_undefined(data.response.status);
                if(data.response.status == 'success'){
                  for(var k in data.response.response){
                    staffer_id = k;
                  }
                  $('#staffer_id').val(staffer_id);
                  getInboxCountApi2(staffer_id);
                }
                else if(data.response.status == 'error'){
                  return;
                }
              }
            }
            else{
              var staffer_id = 0;
              $('#staffer_id').val(staffer_id);
              getInboxCountApi2(staffer_id);
            } 
          }
          else{
            getInboxCountApi2(stafer_id);
          }
}

function getInboxCountApi2(staffer_id,callagain){
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var lang = $('#lang').val();
  var partner_id = $('#partner_id').val();
  var staffer_id = $('#staffer_id').val();
  var total_params = 'token='+token+'&partner_id='+partner_id+'&direction=DESC&limit=10&read=notread&staffer_id='+staffer_id;

  $.ajax({
      type: 'POST',
      url: APISERVER+'/api/PartnerMessages/getInboxCount.json',
      data: total_params,
      async: true,
      dataType : "json",
      beforeSend: function (xhr) 
        {
        
        },
      success: function(data,status,xhr){
         data.response.status = is_undefined(data.response.status);
        if(data.response.status == 'success'){
          //setTimeout(function(){getInboxCountApi2(staffer_id);},10000);
          
          inboxcount = data.response.response.total_records;
          var finalmessage = localStorage.getItem('stickymessage'); 
           
          if(data.response.response.all_unread_records==0){
            $(".InboxToaster").remove();
            localStorage.removeItem('stickymessage');
             var finalmessage = localStorage.getItem('stickymessage'); 
          }
          if(finalmessage==null || finalmessage == '' || finalmessage==undefined){
            $(".InboxToaster").remove();
          }else{
            if($('body').find('.InboxToaster').length==1){
              var fm = localStorage.getItem('stickymessage'); 
              if(fm!=null || fm != '' || fm!=undefined){
                if(data.response.response.all_unread_records==1){
                  var fm = notificationmsgone;
                } 
                else if(data.response.response.all_unread_records!=1){
                  var fm  = notificationmsgmany.replace("%messagecount%",data.response.response.all_unread_records);
                }
              }
              $(".InboxToaster .toast-message").html(fm);

            }
            else{
              var a=call_toastr('info', 'Info', finalmessage,0);
              $(a).addClass("InboxToaster");
              $(".InboxToaster button.toast-close-button").click(function(){
                localStorage.removeItem("stickymessage");
              });
            } 
          }
          if(parseInt(localStorage.getItem("inboxcountstorage")) < inboxcount){
            showNotificationToastr(staffer_id,data.response.response.notificationData);
          }
          localStorage.setItem("inboxcountstorage",inboxcount); 
          if(callagain=='callagain'){
           setTimeout(function(){getInboxCountApi2();},500);
            
          }
        }
      },
      error: function(xhr, status, error){
        return '';                  
      }
  });
}
        
function showNotificationToastr(staffer_id,notificationData){
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var language = $('#language').val();
  var partner_id = $('#partner_id').val();
  var total_params = 'token='+token+'&partner_id='+partner_id+'&direction=DESC&limit=10&read=1&staffer_id='+staffer_id;

  var data = passProdRequest(APISERVER+'/api/PartnerMessages/getPartnerLetterInBox.json',total_params);
  if(data == undefined){
    var json_data = $('#json_data').val();
    var data = JSON.parse(json_data);
    data.response.status = is_undefined(data.response.status);
    if(data.response.status == 'success'){
    	var ccaction = $('#caction').val();
    	//if(ccaction=='inbox'){
      	UpdatePartnerMessageHtml(data.response.response.list);
     // }
      //else{
      //	UpdatePartnerMessageHtmlHeader(data.response.response.list);
      //}
      messagecount = data.response.response.list.length;
      if(messagecount==1){
        var finalmessage = notificationmsgone;
      } 
      else if(messagecount!=1){
        var finalmessage  = notificationmsgmany.replace("%messagecount%",messagecount);
      }
      if(notificationData.ContactNotification!=undefined ){
        if(notificationData.ContactNotification.on_screen_popup!='off'){
          if(notificationData.ContactNotification.on_screen_popup=='on'){
            $(".InboxToaster").remove();
            call_toastr('info', 'Info', finalmessage,5000);
          }
          else if(notificationData.ContactNotification.on_screen_popup=='on_sticky'){
            $(".InboxToaster").remove();
            var a=call_toastr('info', 'Info', finalmessage,0);
            $(a).addClass("InboxToaster");
            $(".InboxToaster button.toast-close-button").click(function(){
              localStorage.removeItem("stickymessage");
            });
            localStorage.setItem('stickymessage',finalmessage);
          }
        }
      }

      
      if(is_mobile!='1'){
          
          if(notificationData.ContactNotification==undefined){
            document.getElementById("ssAudio").play();
          }
          else if(notificationData.ContactNotification.sound=='y'){
                document.getElementById("ssAudio").play();
          }
      }
        
      
    }
    else if(data.response.status == 'error'){
      return;
    }
  }
}

function UpdatePartnerMessageHtml(htmldata){


  var html ='';
  var count = htmldata.length;


  //if(action=='inbox2' || action=='inbox'){
    $('div.alert').remove();
    
    AppendNewMail(htmldata);
  //}
  $(".badge_inbox").remove();
    if(count!=0){
      $("#mass_inbox span.title").after("<span class=\'badge badge_inbox badge-custom\' style=\'float:none; margin-left:10px;\'>"+count+"</span>");
    }
  var base_url = $('#BASE_URL').val();
  var view_all = '<a class="view_all" style="border: none !important;border: none !important;float: right;padding: 0 !important;color:#5b9bd1;line-height: 1" href="'+base_url+'/communication/inbox">'+vie+'</a>';
  var partnername = PartnerName;
  
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
  html += '<li><ul id="header_message_bar_dd" class="dropdown-menu-list">';
  
  var htmlinn ='';
  for(var key in htmldata){     
    if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
      var n = htmldata[key].PartnerMessage.source_from.trim();
      if(n.indexOf('<')==0){
        n = n.replace('<','');
        n = n.replace('>','');
        var s = n.trim().split('@');
        n = new Array();
        n[0] = s[0];
        n[1] = '';
        
      }
      else{
      	n = n.split(' ');
      }
      var namestr = n[0]+' '+checkEmpty(n[1]);
    }
    else if(htmldata[key].Customer.name!=undefined && htmldata[key].Customer.name!=null && htmldata[key].Customer.name!=''){
      var n = htmldata[key].Customer.name.trim().split(" ");
      var namestr = partnername+','+n[0]+' '+checkEmpty(n[1]);
    }
    else{
      var namestr = partnername.substring(0,13);
    }
    var initial1 = ''; var initial2 = '';
    if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
      var n = htmldata[key].PartnerMessage.source_from.trim();
      if(n.indexOf('<')==0){
        n = n.replace('<','');
        n = n.replace('>','');
        var s = n.trim().split('@');
        n = new Array();
        n[0] = s[0];
        n[1] ='';
      }
      else{
        n = htmldata[key].PartnerMessage.source_from.trim().split(' ');
      }
      initial1 = n[0].substring(0,1).toUpperCase();
      initial2 = n[1].substring(0,1).toUpperCase();

    }
    else{
      var n = partnername.trim().split(" ");
      initial1 = n[0].substring(0,1).toUpperCase();
      initial2 = n[1].substring(0,1).toUpperCase();
    }
    if(initial1=='<' || initial1=='>'){
      initial1='';
    }
    if(initial2=='>' || initial2=='<'){
      initial2='';
    }
    var id = htmldata[key].PartnerMessage.id;
    var parent_message_id = htmldata[key].PartnerMessage.parent_message_id;
    htmlinn += '<li><a href="javascript:;" onclick="ss_message_click('+parent_message_id+','+id+')">';
      htmlinn += '<span class="photo"><span class="border_radius_message">'+initial1+initial2+'</span></span>';
      htmlinn += '<span class="subject">';
        htmlinn += '<span class="from">'+namestr+'</span>';
        htmlinn += '<span class="time">'+htmldata[key].PartnerMessageText.time_text+'</span>';
      htmlinn += '</span>';
      htmlinn += '<span class="message">'+htmldata[key].PartnerMessageText.subject.trim().substr(0,70)+'</span>';
    htmlinn += '</a></li>';
    
    
  }
  html += htmlinn+'</ul></li></ul></li>';
  $("#header_message_bar").remove();  
   // $("#header_notification_bar").after(html);
    
      $('div.header ul.pull-right li.user').before(html);
    setTimeout(function(){
    $("#header_notification_bar").off();
    $("#header_message_bar.dropdown").off();
    $("#header_message_bar .dropdown-toggle").off();
    $("#header_message_bar_dd").slimScroll();
  },100);
}
        
function AppendNewMail(htmldata){
  
  var html ='';
  var partnername = PartnerName;
  var fname = UserFirstName;
  var IsAdmin = $('#IsAdmin').val();
  for(var key in htmldata){
    if(key==0){
      /* Unread Message Class */
      cls ='';
      if(htmldata[key].PartnerMessage.read){
        cls = ' unread';
      }
      /* Unread Message Class */
      var sub  = htmldata[key].PartnerMessageText.subject;
      /* Initials*/
      if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
        var n = htmldata[key].PartnerMessage.source_from.trim();
        if(n.indexOf('<')==0){
          n = n.replace('<','');
          n = n.replace('>','');
          var s = n.split('@');
          n = new Array();
          n[0]=s[0];
          n[1]='';
        }
        else{
          n =n.split(' ');
        }
        var namestr = n[0]+' '+checkEmpty(n[1]);
      }
      else if(htmldata[key].Customer.name!=undefined && htmldata[key].Customer.name!=null && htmldata[key].Customer.name!=''){
        var n = htmldata[key].Customer.name.trim().split(" ");
        var namestr = partnername+','+n[0]+' '+checkEmpty(n[1]);
      }
      else{
        var namestr = partnername.substring(0,13);
      }
      var initial1 = ''; var initial2 = '';
      if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
        var n = htmldata[key].PartnerMessage.source_from.trim().split(" ");
        initial1 = n[0].substring(0,1).toUpperCase();
        initial2 = n[1].substring(0,1).toUpperCase();
      }
      else{
        var n = partnername.trim().split(" ");
        initial1 = n[0].substring(0,1).toUpperCase();
        initial2 = n[1].substring(0,1).toUpperCase();
      }
      if(initial1=='<' || initial1=='>'){
        initial1='';
      }
      if(initial2=='>' || initial2=='<'){
        initial2='';
      }
      var PartnerMessageid = htmldata[key].PartnerMessage.id;
      var PartnerMessageparentid = htmldata[key].PartnerMessage.parent_message_id;
      if(PartnerMessageparentid!=0){
        PartnerMessageid = PartnerMessageparentid;
      }
      if(PartnerMessageparentid==0){
        PartnerMessageparentid = PartnerMessageid;
      }
      if(htmldata[key].PartnerMessage.source_from !='' && htmldata[key].PartnerMessage.source_from !=null && htmldata[key].PartnerMessage.source_from != undefined){
          var sFrom = htmldata[key].PartnerMessage.source_from.trim();
          if(sFrom.indexOf('<')==0){
            sFrom = sFrom.replace('<','');
            sFrom = sFrom.replace('>','');
            sFrom = sFrom.split("@");
            var s = sFrom;
            sFrom = new Array();
            sFrom[0] = s[0];
            sFrom[1] ='';
            
          }
          else{
            sFrom = sFrom.replace('<','&nbsp;');
            sFrom = sFrom.replace('>','&nbsp;');
            sFrom = sFrom.split("&nbsp;");
            sFrom = sFrom[0].trim().split(" ");
          }
         
          var namewth = sFrom[0]+' '+checkEmpty(sFrom[1]);
         
          sfrom = sFrom[0];
          two ='';
          flag = 0;
          if(htmldata[key].source_from_last!='' && htmldata[key].thread>1){
            var flag = 1;
           var onearr = htmldata[key].source_from_last.trim();
          if(onearr.indexOf('<')==0){
            onearr = onearr.replace("<","");
            onearr = onearr.replace(">","");
            onearr = onearr.split("@");  
            var s =  onearr;
            onearr = new Array();
            onearr[0] = s[0].trim().split(' ');
           
            onearr[1] ='';
            
          } 
          else{
            onearr= onearr.split(" ");
          }
          var one = onearr[0];
            if(one==fname){
              two = sfrom;
            }
            else{
              two = fname;
            }
            if(IsAdmin!='Y'){                                 
              if(fname==two){
                two = mee;
              }
              else if(fname==one){
                one = mee;
              }
            }
          }
          if(flag==1){
            sName =one+", "+two;
          }
          else{
            sName = namewth;
          }
      }
    
    
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

        html += '<td class="border_box_top span8 ms_line'+PartnerMessageid+'" onclick="show_msg_body('+PartnerMessageid+','+PartnerMessageid+');">'; 
          html += '<table><tr class="" style=""><td class="border_box_last" style="padding: 10px 0px; border:none;" ><div class="span12">'; 
            var isdrafttext ='';
            if(htmldata[key].hasdraft!=0){
              isdrafttext = '<span style="color:#d23f31">,'+draf+'</span>';
            }
            html += '<div class="span3" style="padding-top: 10px;">';
              if(htmldata[key].PartnerMessage.source_from !='' && htmldata[key].PartnerMessage.source_from !=null && htmldata[key].PartnerMessage.source_from != undefined){
                html += '<p id="aa" style="width:100%;height:20px;overflow-y: hidden;" class="writer_name">'
                     +sName;
                  html += isdrafttext;
                if(htmldata[key].thread != '' && htmldata[key].PartnerMessage.parent_message_id!=0){
                  html += '<span style="color:#757575"> ('+htmldata[key].thread+')</span>';
                }
                html += '</p>';
              }
              else if(htmldata[key].Customer.name !='' && htmldata[key].Customer.name != null && htmldata[key].Customer.name != undefined){
                var n = htmldata[key].Customer.name.trim().split(" ");
                var cname = n[0]+' '+n[1];

                html += '<p id="bb" class="wname writer_name">'+partnername;
                html += ' ,'+cname+isdrafttext;

                if(htmldata[key].thread != '' && htmldata[key].PartnerMessage.parent_message_id!=0){
                  html += '<span style="color:#757575">,('+htmldata[key].thread+')</span>';
                }
                html += '</p>';
              }
              else{
                html += '<p id="cc" class="wname writer_name">'+partnername;
                html +=isdrafttext;
                if(htmldata[key].thread != '' && htmldata[key].PartnerMessage.parent_message_id!=0){
                  html += '<span style="color:#757575">,('+htmldata[key].thread+')</span>';
                }
                html += '</p>';
              }
            html += '</div>';
            html += '<div class="span9" style="" class="msg_main">';
              html += '<div class="msg_sub">';
                html += StripTags(htmldata[key].PartnerMessageText.subject);
              html += '</div>'

              html += '<div class="msg_body">';
                html += StripTags(htmldata[key].PartnerMessageText.message);
              html += '</div>'

          html += '</div></td></tr></table>';
        html += '</td>';

        html += '<td class="border_box span3" style="cursor: default;">';
          html += '<div class="msg_menu_right msg_menu_right'+PartnerMessageid+'" style="text-align: right; margin-right: 20px; display: none; ">';
            
            html += '<a class="round_btn_icon btn icn-only" href="javascript:;"  onclick="set_custom_reply('+PartnerMessageid+','+PartnerMessageid+');" data-title="Compose mail" data-toggle="tooltip" data-placement="top" title="Reply"><i class="icon-reply" style=""></i></a>';
            html += '<a class="round_btn_icon btn icn-only" onclick="delete_letter_email('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="Delete" ><i class="icon-trash" style=""></i></a>';
            html += '<div class="btn-group btn-ell pull-right" id="right-btn-ellipsis-'+PartnerMessageid+'" style="">';
              html += '<span data-close-others="true" data-delay="100" data-toggle="dropdown"><a style="margin: 0px 2px;" class="round_btn_icon btn icn-only" onclick="set_dropdown(event,'+PartnerMessageid+');"><i class="icon-ellipsis-vertical right-btn-icon-'+PartnerMessageid+'"></i></a></span>';
              html += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
              
                html += '<li><a class="" href="javascript:;" style="text-decoration:none;" onclick="set_custom_reply('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-reply" style="color:#000000"></i>&nbsp;'+rep+'</a></li>';
                
                html += '<li><a class="" onclick="delete_letter_email('+PartnerMessageid+');"><i class="icon-trash" style="color:#000000"></i>&nbsp;'+del+'</a></li>';
                
                html += '<li class="divider"></li>';

                html += '<li><a><strong>'+mtf+'</strong></a></li>';

                html += '<li><a ><i class="icon-folder-close" style="color:#000000"></i>'+fol+'1</a></li>';

                html += '<li><a ><i class="icon-folder-close" style="color:#000000"></i>'+fol+'2</a></li>';

                html += '<li><a ><i class="icon-folder-close" style="color:#000000"></i>'+fol+'3</a></li>';

              html += '</ul>';
            html += '</div>';

             
          html += '</div>';
          var last_modified = moment(htmldata[key].PartnerMessage.last_modified).format('DD.MM.YY');
          html += '<div class="msg_menu_right_date'+PartnerMessageid+'" style="text-align: center; margin-right: 20px;">'+last_modified+'</div>';
        html += '</td>';
        
      html += '</tr>';

      html += '<tr class="ms_u ms_u'+PartnerMessageid+'"  style="display:none;" onclick="hide_msg_body('+PartnerMessageid+');">';
        html += '<td colspan="3" style="border:none;">';
      html += '</tr>';

      html += '<tr class="ms_m ms_m'+PartnerMessageid+'"  style="display:none;"><td colspan="3" style="border:none;">';
        html += '<div class="main_msg_box allSides" id="show_data">';
          html += '<div class="main_msg_sub">';
            html += '<span class="span10" onclick="hide_msg_body('+PartnerMessageid+');" >';
              html += '<h5>'+StripTags(htmldata[key].PartnerMessageText.subject)+'</h5>';
            html += '</span>';

            html += '<span class="span2" style="margin:10px 0px;text-align: right; float:right;">';
            
            var stext_id = htmldata[key].PartnerMessageText.id;
            var smsg_id = htmldata[key].PartnerMessage.id;
            html += '<a class="round_btn_icon btn icn-only" onclick="show_dkmodal_for_forward('+PartnerMessageid+','+stext_id+','+smsg_id+',\'all\');" data-toggle="tooltip" data-placement="top" title="'+fwd+'" ><i class="icon-arrow-right" style=""></i></a>';
              html += '<a class="round_btn_icon btn icn-only" onclick="delete_letter_email('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="'+del+'"><i class="icon-trash" style=""></i></a>';
              html += '<a class="round_btn_icon btn icn-only" onclick ="hide_msg_body('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="'+cls+'"> <i class="icon-remove"></i></a>';
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
              if(htmldata[key].PartnerMessage.email !=''){
                initial1 =''; initial2 ='';
                if(email[0]!=undefined){
                  initial1 = email[0].substring(0,1).toUpperCase();
                }
                if(email[1]!=undefined){
                  initial2 = email[1].substring(0,1).toUpperCase();
                }
                if(initial1=='<' || initial1=='>'){
                  initial1='';
                }
                if(initial2=='>' || initial2=='<'){
                  initial2='';
                }
              }
              html += '<div class="border_radius dp_img imgm'+PartnerMessageid+'">'+initial1+initial2+'</div>';
            html += '</td>';
            html += '<td class="border_box_last"  style="border:none;">';
              html += '<div class="reply-main">';
                html += '<div class="reply-header rpl'+PartnerMessageid+'" style="display: none;">';
                  if(htmldata[key].PartnerMessage.email !=''){
                    html += '<div><b class="writer_name">'+htmldata[key].PartnerMessage.email+'</b></div>';
                  }
                  else{
                    html += '<div><b class="writer_name">'+partnername+'</b></div>';
                  }
                  html += '<div class="btn-group">';
                    var custname ='';
                    if(htmldata[key].Customer.name!= undefined && htmldata[key].Customer.name!=null){
                      var custname = htmldata[key].Customer.name;
                    }
                    var sourceFromEmail = htmldata[key].Customer.name+'</b> < '+custname+' >';
                    if(htmldata[key].PartnerMessage.source_from!= undefined && htmldata[key].PartnerMessage.source_from!=null){
                      var sourceFrom = htmldata[key].PartnerMessage.source_from;
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
                    html += '<div class="btn mini" onmouseover="event.stopPropagation();" style="background-color: #fff !important; padding-left: 0px;" data-toggle="dropdown">'+too+'&nbsp;<b class="writer_name">'+sourceFromEmail+'</b>&nbsp;&nbsp;<i class="icon-caret-down"></i></div>';
                      html += '<ul class="dropdown-menu pull-right" style="width:200px;">';
                        html += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-reply reply-btn"></i>&nbsp;'+rep+'</a></li>';
                        html += '<li><a onclick="show_dkmodal_for_forward_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-arrow-right reply-btn"></i>&nbsp;'+fwd+'</a></li>';
                        html += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+er+'</a></li>';
                        html += '<li><a onclick="show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+es+'</a></li>';
                      html += '</ul><div style="clear:both;"></div>';
                    html += '</div>'
                  html += '</div>';
                  
                  html += '<form action="/bookingengine/bkengine/frm_msg'+PartnerMessageid+'s/inbox2" class="form-vertical login-form frm'+PartnerMessageid+'" id="frm_msg'+PartnerMessageid+'" rowno="'+PartnerMessageid+'" name="frm_activity_list'+PartnerMessageid+'" style="margin: 0px;" onsubmit="event.returnValue = false; return false;" method="post" accept-charset="utf-8"><div style="display:none;"><input name="_method" value="POST" type="hidden"></div>';
                    html += '<div class="reply-body" style="margin-top:10px;">';
                      html += '<textarea name="textarea[]" style="height:50px; border:none;" placeholder="'+rep+'..." id="TemplateContent'+PartnerMessageid+'" class="m-wrap span12" onclick=\'bind_upoad_head('+PartnerMessageid+',\"newmail\");reply_body_msg_show_tpl('+PartnerMessageid+');\'></textarea></br>';
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
                                  html += '<a class="fancybox-button" data-rel="fancybox-button" href="{%=file.url%}" title="{%=file.name%}">';
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
                          html += '<button class="btn blue" style="float:left; margin-right:5px;" onclick=\'set_reply_msg('+PartnerMessageid+',\"draft\",\"\",\"yes\");\'><i class="icon-check"></i>&nbsp;'+sen+'</button>';

                          html += '<button class="btn red" style="float:left; margin-right:5px;" onclick="reply_body_msg_hide_tpl('+PartnerMessageid+');">'+dis+'</button>';
                           var crouter_form_url = $('#crouter_url').val()+'bkengine/settings/upload';
                          html += '<span style="font-size: 20px; background-color: white; height: 20px; width: 15px;"  class="btn fileinput-button"><span style="transform: rotate(45deg); display: block;"><i class="icon-paper-clip"></i></span><input type="file" name="files[]" id="files" class="files'+PartnerMessageid+'" multiple data-url="'+crouter_form_url+'" ></span>';
                          html += '<div id="editorPlace'+PartnerMessageid+'" style="float:left; width:70%;"><i class="icon-circle draft_progress" style="float:right;color:#d23f31;margin-top: 12px;"></i><i class="icon-ok draft_complete" style="display:none;float:right;color:green;margin-top: 12px;"></i></div>';
                          html += '<div style="clear:both;""></div>';
                          html += '<input type="hidden" name="reply_msg_body'+PartnerMessageid+'" id="reply_msg_body'+PartnerMessageid+'" value="">';
                          html += '<input type="hidden" name="field_id[]" class="field_id" value="">';
                          html += '<input type="hidden" name="request_from'+PartnerMessageid+'" id="request_from'+PartnerMessageid+'" value="inbox">';

                          html += '<input type="hidden" id="msg_sub_'+PartnerMessageid+'" name="msg_sub_'+PartnerMessageid+'" value="'+sub+'" >';
                          html += '<input type="hidden" id="msg_id_'+PartnerMessageid+'" name="msg_id_'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
                          var cust_email = '';
                          if(sourceEmail != ''){
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
                          html += '<input type="hidden" id="cust_id_'+PartnerMessageid+'" name="cust_id_'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
                          html += '<input type="hidden" id="cust_con_id_'+PartnerMessageid+'" name="cust_con_id_'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
                          html += '<input type="hidden" id="last_msg_text_id_'+PartnerMessageid+'_'+PartnerMessageid+'" >';
                          html += '<input id="final_attachments'+PartnerMessageid+'" type="hidden" value="" name="final_attachments'+PartnerMessageid+'">';
                          html += '<input id="from_inbox'+PartnerMessageid+'" type="hidden" value="inbox" name="from_inbox'+PartnerMessageid+'">';
                          html += '<input id="reply_from_'+PartnerMessageid+'" type="hidden" value="'+htmldata[key].PartnerMessage.email+'" name="reply_from_'+PartnerMessageid+'">';
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

  }
  var action =   $('#caction').val();
  if(action!='inbox'){
    AppendNewThread(htmldata[0],'noinbox');
    return;
  }
  var test = $(".ms_m"+htmldata[0].PartnerMessage.parent_message_id).css("display");
  if(htmldata[0].PartnerMessage.parent_message_id==0){
    if($('ms'+htmldata[0].PartnerMessage.parent_message_id).length==0){
      $('#sorting_product_list>tbody').prepend(html);
    }
    
  }
  else if(test == "none" || test==undefined){

    a = ".ms"+htmldata[0].PartnerMessage.parent_message_id;
    b = ".ms_u"+htmldata[0].PartnerMessage.parent_message_id;
    c =  ".ms_m"+htmldata[0].PartnerMessage.parent_message_id;
    $(a).remove();
    $(b).remove();
    $(c).remove();
    $('#sorting_product_list>tbody').prepend(html);
  }
  else{
    AppendNewThread(htmldata[0]);
  }
  
  $('input[type=checkbox]').uniform();
}

function AppendNewThread(htmldata,isinbox=''){
  
  ////console.log('AppendNewThread');
  ////console.log(htmldata);
  var id = htmldata.PartnerMessage.parent_message_id;
  var text_id = htmldata.PartnerMessageText.id;
  var msg_id = htmldata.PartnerMessage.id;
  var parent_id = htmldata.PartnerMessage.parent_message_id;
  var old_thread_count = parseInt($('#msg_bd_'+id).find('div.mgs_sub_list:not(.c_count)').length);
  jstext ='';
  if(old_thread_count>3){
    jstext += '<div id="mgs_sub_list_row'+id+''+msg_id+''+msg_id+'" class="mgs_sub_list" style="border-top:none;" onmouseover="show_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');" onmouseleave="hide_thread_msg_ellipsis('+id+','+msg_id+','+msg_id+');"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr>';
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
  
  var source_from = htmldata.PartnerMessage.source_from;
  //Kunal Dhakate <kunal@srs-infosystems.com>
  if(source_from == null){
    if(htmldata.Customer.name!='' && htmldata.Customer.name!=undefined){
      var initial1 = PartnerName;
      var initial1 = initial1.substr(0,1);
      var initial2 = htmldata.Customer.name;
      var initial2 = initial2.split(" ");
      var a  = initial2[0];
      var b = initial2[1];
      var initial2 = a.substr(0,1).toUpperCase();
      var initial3 = b.substr(0,1).toUpperCase();
     

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
      
    
    var initial3 = '';            
  }
  if(initial1=='<' || initial1=='>'){
    initial1='';
  }
  if(initial2=='>' || initial2=='<'){
    initial2='';
  }
  //#626: Fwd: Feedback, communications module + a few minor corrections elsewhere > Avatar 
  jstext += '<td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="border_radius">'+initial1+initial2+initial3+'</div></td>';
  jstext += '<td class="border_box_last"  style="border:none;">';

  var source = PartnerName;
  if(source_from != null){
    source = source_from;
  }
  
  var customer_email = '<b>'+htmldata.Customer.name+'</b> &lt; '+htmldata.Customer.email+' &gt;';
  var source_email = htmldata.PartnerMessage.email;
  if(source_email != null){
    customer_email = source_email;
  }
  var inbox = 'inbox';
  var message = htmldata.PartnerMessageText.message;
  message = decodeEntities(message);
  message = message.split('sarthak@123+_*&^%~');
  text_message = message[0];

  var text_message = text_message.replace(/<\/?[^>]+(>|$)/g, "");
  jstext += '<div class="bd_h_'+id+'_'+msg_id+'" onclick="show_hide_msg_thread_head('+id+','+msg_id+')"  style="cursor:pointer;"><div style="float:left;">';
  jstext += '<div class="slr_snd_'+id+'_'+msg_id+'" style="cursor:pointer;" ><b class="writer_name">'+source+'</b></div>';
  jstext += '<div class="slr_rcv_'+id+'_'+msg_id+'" style=" display:none; cursor:pointer;" >'+to+'&nbsp;'+customer_email+'</div>';
  jstext += '<div class="slr_txt_'+id+'_'+msg_id+'" style=" color:#757575; cursor:pointer;">'+$('<div class="testClass">'+text_message+'</div>').text().substr(0,100)+'</div></div>';
  jstext += '<div style="height: 30px; line-height: 30px; float: right;"><span>'+htmldata.PartnerMessageText.time_text+'</span>&nbsp;&nbsp;';
  
  jstext += '<div class="btn-group pull-right thread-btn-ellipsis" id="thread-btn-ellipsis-'+id+''+msg_id+''+msg_id+'" onclick=" sub_thread_dropdown(event,'+id+','+msg_id+','+msg_id+');" style="display: none;">';  
  jstext += '<span data-close-others="true" data-delay="100" data-hover="dropdown-toggle" data-toggle="dropdown" class="dropdown-toggle">';
  jstext += '<a style="margin: 0px 2px;" class="round_btn_icon btn icn-only"><i class="icon-ellipsis-vertical right-thread-btn-icon-'+msg_id+'" ></i></a> ';
  jstext += '</span>';
  jstext += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
  jstext += '<li> ';
  jstext += '<a class="" onclick="show_dkmodal_for_reply('+id+','+text_id+','+msg_id+');"><i class="icon-reply" style="color:#000000"></i>&nbsp;'+rep+'</a>';
  jstext += '</li>';
  jstext += '<li>';
  jstext += '<a class="" onclick="show_dkmodal_for_forward('+id+','+text_id+','+msg_id+');"><i class="icon-arrow-right" style="color:#000000"></i>&nbsp;'+fwd+'</a>';
  jstext += '</li>';
  jstext += '<li>';
  jstext += '<a class="" onclick="print_mail_pdf('+text_id+','+msg_id+');"><i class="icon-print" style="color:#000000"></i>&nbsp;'+prn+'</a>';
  jstext += '</li>';
  jstext += '<li>';
  jstext += '<a class="" onclick="show_mail_source('+text_id+','+msg_id+');"><i class="icon-file" style="color:#000000"></i>&nbsp;'+shs+'</a>';
  jstext += '</li>';
  jstext += '</ul>';
  jstext += '</div>'; 
  jstext += '</div>';
  
  jstext += '<div style="clear:both;"></div>';
  jstext += '</div>'; 
  jstext += '</div>';
  jstext += '<div class="bd_resp_'+id+'_'+msg_id+'" style="padding: 20px 0px; display:none;">';

  var message = htmldata.PartnerMessageText.message;
  message = decodeEntities(message);
  message = message.split('@123+_*&^%~sarthak@123+_*&^%~');
  text_message = message[0];
    
  jstext += '<div class="testClass">'+text_message+'</div>';

  if(htmldata.PartnerMessageAttachment){
  
    jstext += '<hr><div class="inbox-attached" style="line-height:unset !important;">';
    if(htmldata.PartnerMessageAttachment.length > 1) { 
      jstext += '<div class="margin-bottom-15">';
      jstext += '<span>'+htmldata.PartnerMessageAttachment.length+' attachments</span>';
      jstext += '<a style="cursor:pointer" onclick="">Download all attachments</a>';
      jstext += '</div>';
     } 
    for(i = 0; i < htmldata.PartnerMessageAttachment.length; ++i) { 
      
      var path = crouter_url+'view_file.php?url='+htmldata.PartnerMessageAttachment[i].urlencode+'&size='+htmldata.PartnerMessageAttachment[i].size;
      var extension =  htmldata.PartnerMessageAttachment[i].extension;
      var ext = extension.toUpperCase();
      var orig_name = htmldata.PartnerMessageAttachment[i].orig_name_wt_ext;
      var size = formatFileSize(htmldata.PartnerMessageAttachment[i].size);
      if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
        jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+htmldata.PartnerMessageAttachment[i].orig_name+'" href="'+htmldata.PartnerMessageAttachment[i].thumbnail_url+'" data-rel="fancybox-button" class="fancybox-button kY"><img src="'+htmldata.PartnerMessageAttachment[i].thumbnail_url+'" style="width:70%; height:40%;margin-left: 15%;margin-top: 13%;"><div style="padding-left: 10px; color: #B18575;padding-top:40%;"><i class="icon-download" onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
      }else if(extension == 'pdf'){
        jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_pdf.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%;"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';  
      }else if((extension == 'csv') || (extension == 'txt')){
        jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_text.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
      }else if((extension == 'docx') || (extension == 'doc')){
        jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
      }else if((extension == 'xlsx') || (extension == 'xls')){
        jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;"><div class="files"><div class="at_block"><table><tbody><tr class="template-download fade in"><td><a id="aSH_'+i+'" title="'+orig_name+'" href="#" data-rel="fancybox-button" class="fancybox-button kY"><div style="padding: 5px; word-wrap: break-word; height:38%;"><span>'+orig_name+'</span></div><div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_spreadsheet.png" alt="icon"><span style="padding-left: 10px;">'+sps+'</span></div><div style="padding-left: 10px; color: #B18575;margin-top:5%"><i onclick="window.open(\''+path+'\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\')" class="icon-download"></i><span style="padding-left: 25px;">'+size+'</span></div></a></td></tr></tbody></table></div></div></div>';
      }
    }
    jstext += '</div>';
  }

  jstext +='</div>';      
  jstext += '</div></td></tr></tbody></table></div></div>';
  var parent_id_thread = htmldata.PartnerMessage.parent_message_id;
  if(isinbox=='noinbox'){
    if($('#messageclick #mgs_sub_list_row0'+parent_id_thread+parent_id_thread).length!=0){
      $('#messageclick .reply-msg').before(jstext);
      return;
    }
    else{
		return;
	}
  }
  if($('#messageclick #mgs_sub_list_row0'+parent_id_thread+parent_id_thread).length!=0){
    $('#messageclick .reply-msg').before(jstext);
    
  }
  $('#msg_bd_'+id).append(jstext); 
  

  if(old_thread_count>3){
    var len = $('tr.ms_m'+id+' .c_count').length;
    if(len!=0){
      if($('tr.ms_m'+id+' .c_count').css('display')=="none"){
        $('#msg_bd_'+id).find('div.mgs_sub_list:last').prev('div.mgs_sub_list').hide();

      }
      else{
        $('#msg_bd_'+id).find('div.mgs_sub_list:last').prev('div.mgs_sub_list').hide();
      }
    }
  }
  $('#last_msg_text_id_'+id+'_'+msg_id).val(text_id);
  c_count_main = parseInt($('.ms_m'+id+' .c_count_main').text());
  c_count_main = c_count_main + 1;
  $('.ms_m'+id+' .c_count_main').text(c_count_main);

  var new_length = parseInt($('#msg_bd_'+id).find('div.mgs_sub_list:not(.c_count)').length);

  var source_from_last = htmldata.source_from_last.split(" ");
  var source_from_last = source_from_last[0];

  var new_length = parseInt($('#msg_bd_'+id).find('div.mgs_sub_list:not(.c_count)').length);

    newhtml = '';
    var IsAdmin1 =  $('#IsAdmin').val();
    if(IsAdmin1!='Y'){    
      var me = mee;
    }
    else{
      var me = UserFirstName;
      me = me.split(" ");
      me = me[0];
    }
    if(parent_id!=null && parent_id!=undefined && parent_id!=''){
      $('.ms_line'+parent_id).parent().addClass('unread');
    }
    else{
      $('.ms_line'+id).parent().addClass('unread');
    }

    newhtml += '<p style="width:100%;height:20px;overflow-y: hidden;" class="writer_name">'+ndname[0]+','+me+' ';
    newhtml += '<span style="color:#757575">('+new_length+')</span>';
    newhtml += '</p>';
    $('.ms_line'+id+' div.span3:first p').remove();
      $('.ms_line'+id+' div.span3:first').html(newhtml);
}
var timeouts2 = [];
function OnChangeNew(count,remove=''){
  $('.draft_progress_new').show();
  $('.draft_complete_new').hide();
  for (var i = 0; i < timeouts2.length; i++) {
     clearTimeout(timeouts2[i]);
  }
  timeouts2 = [];
  if(remove=='yes'){
    return;
  }
  if(localStorage.getItem('dkmod'+count)!=null){
    var id = localStorage.getItem('dkmod'+count)
    if(localStorage.getItem('editdraftids'+id)!=null){
      timeouts2.push(
        setTimeout(function(){
          ss_letters_custom_mail_new(count,'no','no');
        }, 1000)
      );
    }

  }
  else{
    ss_letters_custom_mail_new(count,'no','no');
  }
}
var timeoutsreply = [];
function OnChangeReply(count='',remove=''){
  $('.draft_progress_reply').show();
  $('.draft_complete_reply').hide();
  for (var i = 0; i < timeoutsreply.length; i++) {
    clearTimeout(timeoutsreply[i]);
  }
  if(remove=='yes'){
    return;
  }
  timeoutsreply = [];
  if(localStorage.getItem('dkmod'+count)!=null && localStorage.getItem('dkmod'+count)!=undefined && localStorage.getItem('dkmod'+count)!=''){
    timeoutsreply.push(
      setTimeout(function(){
        set_reply_msg_reply(count,'draft',''); 
      }, 1000)
    );
  }
  else{
    set_reply_msg_reply(count,'draft','');
  }
}
var timeouts = [];
function OnchangeDock(no,ss_msg_id,remove=''){
  $('.draft_progress').show();
  $('.draft_complete').hide();
  setFormdataStorage(no);
  for (var i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
  timeouts = [];
  if(remove=='yes'){
    return;
  }
  if(localStorage.getItem('editdraftids'+ss_msg_id)!=null){
    timeouts.push(
    setTimeout(function(){
      ss_letters_custom_mail(no,'draft','','no',ss_msg_id);

    }, 2000)
    );
  }
}

function checkEmpty(a){
  if(a==undefined || a==null){
    return '';
  }
  return a;
}
const applicationServerKey = "BN2ciD/hRQRAyy82lt8+mtWvsw+TGNAb3FINVU43kUXCOF0KGYJu1GctvgvdXkeWq8V23VHIVk/SsUhrcm6+BMk=";
var isPushEnabled = false;

function push_subscribe1() {
  navigator.permissions.query({name:'notifications'}).then(function(result) {
      if (result.state === 'granted') {
      
      push_updateSubscription();
      } 
      else if (result.state === 'prompt') {
      Notification.requestPermission().then(function(result) {
        if (result === 'denied') {
        //console.log('Permission wasn\'t granted. Allow a retry.');
        return;
        }
        if (result === 'default') {
        //console.log('The permission request was dismissed.');
        return;
        }
        if (result === 'granted') {
          
        push_subscribe();
         //console.log('Permission was granted.');
        }
      });
      }
    });
       
}
  
  function push_subscribe() {
    //console.log('1');
        navigator.serviceWorker.ready
      .then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
      }))
        .then(subscription => {
          //console.log('2');
      //console.log(subscription);
      //console.log(applicationServerKey);
      var key = subscription.getKey('p256dh');
      var token = subscription.getKey('auth');
      key =  btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
      token =  btoa(String.fromCharCode.apply(null, new Uint8Array(token)));
      //console.log(key);
      //console.log(token);
      var ptoken = token;
      var staffer_id = $('#staffer_id').val();
      if(staffer_id==undefined || staffer_id==''){
        staffer_id = 0;
      }
      var APISERVER = $('#APISERVER').val();
      var token = $('#token').val();
    
      var partner_id = $('#partner_id').val();
      //console.log(subscription);
      var ep = subscription.endpoint;
      var params = { token:token, partner_id:partner_id,key:key,endpoint:ep,staffer_id:staffer_id,ptoken:ptoken };
      //console.log(params);
      $.ajax({
        type: 'POST',
        url: APISERVER+'/api/PartnerMessages/addpush.json',
        dataType: 'json',
        data:params ,
        async: false,       
        success: function( data, textStatus, jQxhr ){
          //console.log(JSON.stringify( data ));
        },
        error: function( jqXhr, textStatus, errorThrown ){
          //console.log( errorThrown );
        }
      });
    
      
        })
        .then(subscription => subscription) // update your UI
        .catch(e => {
            if (Notification.permission === 'denied') {
                console.warn('Notifications are denied by the user.');
              
            } else {
                console.error('Impossible to subscribe to push notifications', e);
            }
        });
    }
  
  function urlBase64ToUint8Array(base64String) {
    //console.log('---');
    //console.log(base64String);
    //console.log('---');
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

  function push_updateSubscription() {
        navigator.serviceWorker.ready.then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription())
        .then(subscription => {
      if (!subscription) {
                // We aren't subscribed to push, so set UI to allow the user to enable push
                return;
            }
      //console.log(subscription);
      var key = subscription.getKey('p256dh');
      var token = subscription.getKey('auth');
      key =  btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
      token =  btoa(String.fromCharCode.apply(null, new Uint8Array(token)));
      //console.log(key);
      //console.log(token);
      var ptoken = token;
      var staffer_id = $('#staffer_id').val();
      if(staffer_id==undefined || staffer_id==''){
        staffer_id = 0;
      }
      var APISERVER = $('#APISERVER').val();
      var token = $('#token').val();
    
      var partner_id = $('#partner_id').val();
      //console.log(subscription);
      var ep = subscription.endpoint;
      var params = { token:token, partner_id:partner_id,key:key,endpoint:ep,staffer_id:staffer_id,ptoken:ptoken };
      //console.log(params);
      $.ajax({
        type: 'POST',
        url: APISERVER+'/api/PartnerMessages/addpush.json',
        dataType: 'json',
        data:params ,
        async: false,       
        success: function( data, textStatus, jQxhr ){
          //console.log(JSON.stringify( data ));
        },
        error: function( jqXhr, textStatus, errorThrown ){
          //console.log( errorThrown );
        }
      });
            // Keep your server in sync with the latest endpoint
          
        })
        .then(subscription => subscription) // Set your UI to show they have subscribed for push messages
        .catch(e => {
            console.error('Error when updating the subscription', e);
        });
    }

var isad = $('#IsAdmin').val();
//console.log('WebSocket');
if(isad!='Y'){
  var partner_id = $('#partner_id').val();

  //setTimeout(function(){
    //getInboxCountApi2();
    var a = $('#staffer_id').val();
    if(a==0){
      var a = partner_id;
    }
    
    //var req_scheme = '<?php echo $_SERVER['REQUEST_SCHEME']; ?>';
    var req_scheme ='http';
    if(req_scheme == 'http'){
       req_scheme = 'ws://development.comsoft.no:8010';
    }
    else{
        req_scheme = 'wss://development.comsoft.no:8010';
    }
        
    // var conn = new ab.Session(req_scheme,
    //     function() {
    //         conn.subscribe(a, function(topic, data) {
    //             // This is where you would add the new article to the DOM (beyond the scope of this tutorial)
    //             //console.log('test');
    //             //console.log('New Emails avaialable');
    //             getInboxCountApi2('','callagain');
    //         });
    //     },
    //     function() {
    //         console.warn('WebSocket connection closed');
    //     },
    //     {'skipSubprotocolCheck': true}
    // );
 // });
}

var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();
