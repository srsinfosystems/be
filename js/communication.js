var sslang = $('#lang').val();
var caction = $('#caction').val();
var IsAdmin = $('#IsAdmin').val();
var PartnerName = $('#PartnerName').val();
var ppname = $('#PartnerName').val();
var crouter_url = $('#crouter_url').val();
var UserFirstName = $('#UserFirstName').val();
var login_id = $('#login_id').val();
var notificationmsgone = $('#notificationmsgone').val();
var notificationmsgmany = $('#notificationmsgmany').val();
var textone = $('#textone').val();
var textmany = $('#textmany').val();
var ssattach = $('#ssattach').val();
var ssattachall = $('#ssattachall').val();
var sszip = $('#sszip').val();
var ssword= $('#ssword').val();
var ss_lang = $('#lang').val();
var mrksrd = $('#mrksrd').val();
var mrksurd = $('#mrksurd').val();
var mrkcmp = $('#mrkcmp').val();
var emac = $('#emac').val();
var emti = $('#emti').val();
var staff_signature = $('#staff_signature').val();
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
  var title_sms ='New SMS';
  var success_msg ='Success';
  var error_msg ='Error';
  var sms_success = 'SMS sent successfully';
  var alert_msg = 'Alert message';
  var ss_new_msg = 'New email';
  var ss_ck_lang_js = 'en';
  var alertMsg = 'An exception has occured. Please try again!';

}
else if(sslang == 'nb'){
  var rep = 'Svar';
  var sen = 'Send';
  var dis = 'Forkast';
  var draf = 'Kladd';
  var fwd = 'Videresend';
  var vie = 'vis alle';
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
  var title_sms ='Ny SMS';
  var success_msg ='Utført!';
  var error_msg ='Feil';
  var sms_success = 'SMS sendt';
  var alert_msg = 'Advarsel';
  var ss_new_msg = 'Ny e-post';
  var ss_ck_lang_js = 'no';
  var alertMsg = 'Et unntak har oppstått. Vær så snill, prøv på nytt!';
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
       $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
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
        msg_body = StripTags(decodeEntities(msg_body));
        $('.ms_line'+pmid+ ' div.msg_body').html(msg_body);
      }
      var action = $('#caction').val();
      if(action=='draft' && parent_message_id!=0){
        $('.ms'+message_id).remove();
        $('.ms_u'+message_id).remove();
        $('.ms_m'+message_id).remove();
        $('.ms_l'+message_id).remove();
      }
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
  var email_distribution = '';
  if($(frm_name+' select.controls-recipients-select')!=undefined){
    var email_distribution = $(frm_name+' select.controls-recipients-select').val();
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

  var params  = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,msg_id:'',email_adr:customer_email,customer_name:cust_name,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,cc:cc,bcc:bcc,email_distribution:email_distribution};
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
        
          var params = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,msg_id:'',email_adr:customer_email,customer_name:cust_name,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail,cc:cc,bcc:bcc,email_distribution:email_distribution};

      
        }
        else if(sendmail=='yes'){
           var params  = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,msg_id:'',email_adr:customer_email,customer_name:cust_name,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,cc:cc,bcc:bcc,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail,email_distribution:email_distribution};
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
      $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
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
     $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
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
    url: APISERVER+'/api/search/uploadCustomMailLogoComm.json?admin_id='+admin_id+'&partner_id='+partner_id,
    autoUpload: true,
    maxFileSize:7000000,
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
                addHtml += '<td><a title="'+file.orig_name+'" target="_blank" href="'+file.url+'" data-rel="" class=" kY"><img src="'+file.thumbnail_url+'" style="width:100%; height:100%;"></a>';
                addHtml += '<span class="delete"><button data-url="'+delete_url+'" data-type="DELETE" class="btn mini remv-at"><i class="icon-remove"></i></button></span></td>';
              }
              else{
                addHtml += '<td><a title="'+file.orig_name+'" target="_blank"  href="'+file.url+'" data-rel="" class=" kY">';
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
          min_s:3,
          hintText: "",
          noResultsText: mesg,
          searchingText: "",
          propertyToSearch: 'text',
          preventDuplicates: true,
          resultsFormatter: function(item){ 
                       if(item){
                        var name = item.cname ? item.cname : item.name;
                        var show_name = item.cname ? item.cname : item.name;
                        if(name.length > 25){
                          name = name.substr(0,25)+'...';
                        }
                        if(show_name.length > 20){
                      show_name = show_name.substr(0,20)+'..';
                    }
                    if(item.type=='customergroup' || item.type=='custom_groups'){
                      var cword = name;
                    }
                    else{
                      var cword = name+ ' - '+item.email;
                    }
                               if((cword + item.name).length > '70' ){      
                                 return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+cword.substr(0,30)+"</span>&nbsp;<span class='btn mini blue' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
                                }
                                else{
                             if(item.type=='customergroup' || item.type=='custom_groups'){
                               return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.name  + "</span>&nbsp;<span class='btn mini green' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>";  
                             }  

                          return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.name + " - "+ item.email  + "</span>&nbsp;<span class='btn mini blue' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>";  
                                }
                            } 
                            else{
                              return;
                            } 
                          },
          tokenFormatter: function(item) { 
                            if(item){
                              return  "<li><span style='color:#000;'>"+ item.name+"</span></span></li>" ; 
                            }
                            else{
                              return;
                            }
                          },
          resizeInput: false, 
          onAdd : function(item){ 
            if(item.type=='customergroup' || item.type=='custom_groups' ){
              $('div.controls-recipients-select-'+ind).show();
            }
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
          var to_emails = $('#frm_modal_msg'+ind+'  [name=customer_email]').val();
          if(to_emails==""){
             $('div.controls-recipients-select-'+ind).hide();
             to_emails = [];
          }
          else{
            var to_emails = to_emails.split(',');
          }
          
            for(var j in to_emails){
              if(to_emails[j].indexOf('@')!=-1){
                $('div.controls-recipients-select-'+ind).hide();
              }
              else{
                $('div.controls-recipients-select-'+ind).show();
                 break;      
              }
              

            }
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
    $('.input-cc'+index).show();
    $('.bcc-input'+index).show();
    //$('.input-cc'+ind).show();
    //$('.bcc-input'+ind).show();
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
  var email_distribution = '';
  if($(frm_name+' select.controls-recipients-select')!=undefined){
    var email_distribution = $(frm_name+' select.controls-recipients-select').val();
  }
  var customer_email1 = customer_email.split(",");
  var cname = new Array();
  var cnum = new Array();
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
        var obj1 = {};
        if(b.number!=undefined && b.number!=null && b.number!=''){
          obj1[em] = b.number;
          cnum.push(obj1);
        }
      }
    }
  }

  if(cname!=[]){
    cname = JSON.stringify(cname);
  }
  if(cnum!=[]){
    cnum = JSON.stringify(cnum);
  }
  var sender = $('#type').val();
  if(customer_email!='' && customer_email!=null && customer_email!=undefined) {
      customer_email = customer_email.split(',');
      customer_email = JSON.stringify(customer_email);
  }
  if(cc!='' && cc!=null && cc!=undefined) {
    cc = cc.split(',');
  }
  var ccname = [];
   var ccnum = [];
  for(var j in cc){
    for(var k in toarray){
      if(toarray[k].name==cc[j]){
        var b = JSON.parse(toarray[k].value);
        var em = cc[j];       
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
        ccname.push(obj);
        var obj1 = {};
        if(b.number!=undefined && b.number!=null && b.number!=''){
          obj1[em] = b.number;
          ccnum.push(obj1);
        }
      }
    }
  }
  if(ccname!=[]){
    ccname = JSON.stringify(ccname);
  }

  if(ccnum!=[]){
    ccnum = JSON.stringify(ccnum);
  }
  if(bcc!='' && bcc!=null && bcc!=undefined) {
    bcc = bcc.split(',');
  }
  var bccname = [];
   var bccnum = [];
  for(var j in bcc){
    for(var k in toarray){
      if(toarray[k].name==bcc[j]){
        var b = JSON.parse(toarray[k].value);
        var em = bcc[j];       
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
        bccname.push(obj);
        var obj1 = {};
        if(b.number!=undefined && b.number!=null && b.number!=''){
          obj1[em] = b.number;
          bccnum.push(obj1);
        }
      }
    }
  }
  if(bccname!=[]){
    bccname = JSON.stringify(bccname);
  }
  if(bccnum!=[]){
    bccnum = JSON.stringify(bccnum);
  }
  var params = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,msg_id:msg_id,email_adr:customer_email,customer_name:cname,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,cc:cc,bcc:bcc,ccname:ccname,bccname:bccname,ccnum:ccnum,bccnum:bccnum,cnum:cnum,email_distribution:email_distribution};

  whereto = 'sendCommunicationCustomNewEmail';
  if(localStorage.getItem('dkmod'+no)!=null){
    var partner_message_id = localStorage.getItem('dkmod'+no);
    if(localStorage.getItem('editdraftids'+partner_message_id)!=null){
      whereto = 'updateDraftOnChange';
        var draftids = JSON.parse(localStorage.getItem('editdraftids'+partner_message_id));
        var partner_message_id = draftids.partner_message_id;
        var partner_message_text_id = draftids.partner_message_text_id;
        var params = {token:token,partner_id:partner_id,mail_body:mail_body,mail_subject:mail_subject,email_adr:customer_email,customer_name:cname,reply_from:reply_from,attachments:attachments,from_inbox:from_inbox,sender:sender,cc:cc,bcc:bcc,sendmail:sendmail,partner_message_id:partner_message_id,partner_message_text_id:partner_message_text_id,ccname:ccname,bccname:bccname,cnum:cnum,ccnum:ccnum,bccnum:bccnum,email_distribution:email_distribution};

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
      $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
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
      $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
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
   var email_distribution = '';
  if($(frm_name+' select.controls-recipients-select')!=undefined){
    var email_distribution = $(frm_name+' select.controls-recipients-select').val();
  }
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
    var cnum = new Array();
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
        var obj1 = {};
        if(b.number!=undefined && b.number!=null && b.number!=''){
          obj1[em] = b.number;
          cnum.push(obj1);
        }
        
      }
    }
  }
  //console.log(cname);
  if(cname!=[]){
    cname = JSON.stringify(cname);
  }
  if(cnum!=[]){
    cnum = JSON.stringify(cnum);
  }

  var sender = $('#type').val();
  if(customer_email!='' && customer_email!=null && customer_email!=undefined) {
      customer_email = customer_email.split(',');
      customer_email = JSON.stringify(customer_email);
  }
  if(cc!='' && cc!=null && cc!=undefined) {
    cc = cc.split(',');
  }
  var ccname = [];
  var ccnum = [];
  for(var j in cc){
    for(var k in toarray){
      if(toarray[k].name==cc[j]){
        var b = JSON.parse(toarray[k].value);
        var em = cc[j];       
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
        ccname.push(obj);
        var obj1 = {};
        if(b.number!=undefined && b.number!=null && b.number!=''){
          obj1[em] = b.number;
          ccnum.push(obj1);
        }
      }
    }
  }
  if(ccname!=[]){
    ccname = JSON.stringify(ccname);
  }
  if(ccnum!=[]){
    ccnum = JSON.stringify(ccnum);
  }
  
  if(bcc!='' && bcc!=null && bcc!=undefined) {
    bcc = bcc.split(',');
  }
   var bccname = [];
   var bccnum = [];
  for(var j in bcc){
    for(var k in toarray){
      if(toarray[k].name==bcc[j]){
        var b = JSON.parse(toarray[k].value);
        var em = bcc[j];       
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
        bccname.push(obj);
        var obj1 = {};
        if(b.number!=undefined && b.number!=null && b.number!=''){
          obj1[em] = b.number;
          bccnum.push(obj1);
        }
      }
    }
  }
  if(bccname!=[]){
    bccname = JSON.stringify(bccname);
  }
  if(bccnum!=[]){
    bccnum = JSON.stringify(bccnum);
  }
  if(ssfrom=='draft'){
    if(localStorage.getItem('editdraftids'+message_id)!=null){
      var getdraftids = JSON.parse(localStorage.getItem('editdraftids'+message_id));
      var partner_message_text_id = getdraftids.partner_message_text_id;
      var partner_message_id = getdraftids.partner_message_id;
      if(partner_message_text_id!=null && partner_message_text_id!=undefined && partner_message_text_id!=''){
        whereto ='updateDraftOnChange';
        if(sendmail=='no'){
          var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:customer_email,customer_name:cname,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail,cc:cc,bcc:bcc,ccname:ccname,bccname:bccname,cnum:cnum,ccnum:ccnum,bccnum:bccnum,email_distribution:email_distribution};
        }
        else if(sendmail=='yes'){
            var params = {token:token,partner_id:partner_id,mail_body:mailbody,mail_subject:mail_subject,msg_id:msg_id,email_adr:customer_email,customer_name:cname,reply_from:reply_from,customer_id:cust_id,contact_id:cust_con_id,attachments:attachments,from_inbox:from_inbox,sender:sender,partner_message_text_id:partner_message_text_id,partner_message_id:partner_message_id,sendmail:sendmail,cc:cc,bcc:bcc,ccname:ccname,bccname:bccname,cnum:cnum,ccnum:ccnum,bccnum:bccnum,email_distribution:email_distribution};
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
      $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
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
          newhtml = StripTags(decodeEntities(newhtml));
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
      $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
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
       var arr = '';
        for(i = 0; i < htmldata.PartnerMessageAttachment.length; ++i) {
            if(i==0){
              arr += decodeURIComponent(htmldata.PartnerMessageAttachment[i].file_name);
            }else{
              arr += ','+decodeURIComponent(htmldata.PartnerMessageAttachment[i].file_name);
            }

          }
          arr  = encodeURIComponent(arr);
          var cr = $('#crouter_url').val();
          var pid = parseInt($('#partner_id').val().trim());
          pid =  btoa(pid);
          var url = cr+'app/webroot/view_file.php?partner_id='+pid+'&from=zip&all='+arr;
          //console.log(arr);
          jstext += '<div class="margin-bottom-15">';
          jstext += '<span>'+htmldata.PartnerMessageAttachment.length+ssattach+'</span>';
          jstext += '<a style="cursor:pointer" target="_blank" href="'+url+'">'+ssattachall+'</a>';
          jstext += '</div>';
       } 
      for(i = 0; i < htmldata.PartnerMessageAttachment.length; ++i) { 
        var spid = $('#partner_id').val();
        var path = crouter_url+'app/webroot/view_file.php?url='+htmldata.PartnerMessageAttachment[i].urlencode+'&size='+htmldata.PartnerMessageAttachment[i].size+'&partner_id='+btoa(spid);

        var extension =  htmldata.PartnerMessageAttachment[i].extension;
        var ext = extension.toUpperCase();
        var orig_name = htmldata.PartnerMessageAttachment[i].orig_name_wt_ext;
        var thurl  = htmldata.PartnerMessageAttachment[i].thumbnail_url;
        if(thurl==undefined || thurl==null || thurl==''){
          var thurl  = htmldata.PartnerMessageAttachment[i].file_path;
        }
        var file_path  = htmldata.PartnerMessageAttachment[i].file_path;
        var size = formatFileSize(htmldata.PartnerMessageAttachment[i].size);
         if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
          jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
            jstext += '<div class="files">';
              jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
              //  jstext += '<table><tbody>';
                  //jstext += '<tr class="template-download fade in">';
                    //jstext += '<td>';
                      jstext += '<a id="aSH_'+i+'" data-fancybox title="'+htmldata.PartnerMessageAttachment[i].orig_name+'" href="'+file_path+'" data-rel="" class=" kY">';
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
                        jstext += '<img src="'+crouter_url+'>app/webroot/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
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
    //console.log(jstext); 
    var htmlformcount ='';
    //var len = htmldata.previouse_message_id.length;
    var len = parseInt($('#msg_bd_'+id).find('div.mgs_sub_list:not(.c_count)').length);
    //console.log(len);
    if(id==0){
      id=msg_id;
    }
   // if(frompopup!='popup'){
      //$('#mgs_sub_list_row'+id+msg_id+msg_id).after(jstext);
      if($('#msg_bd_'+id).find('div.c_count').css('display')!='none'){
       $('#msg_bd_'+id).append(jstext);
      }
      else{
        $('#msg_bd_'+id+' div:last').hide();
        $('#msg_bd_'+id).append(jstext);
      }

    //}
   // else{
          var otherids = htmldata.otherids;

            for(var j in otherids){
              if(otherids[j]!=null && otherids[j]!=undefined && otherids[j]!=null){
                if($('#messageclick'+otherids[j]).length!=0){
                  $('#messageclick'+otherids[j]+' div.reply-msg').before(jstext);
                  $('#messageclick '+otherids[j]+' .imgm'+id).hide(); 
                  $('#messageclick'+otherids[j]+'  .rpl'+id).hide(); 
                  $('#messageclick'+otherids[j]+'  .reply-body #TemplateContent'+id).show();
                  $('#messageclick'+otherids[j]+'  .reply-body #TemplateContent'+id).css('visibility','visible'); 
                  $('#messageclick'+otherids[j]+'  .reply-body #TemplateContent'+id).val(''); 
                  $('.ssreply'+otherids[j]).addClass('sspopuphide');
                  $('.ssdiscard'+otherids[j]).addClass('sspopuphide');
                   $('.replymsgclick'+otherids[j]).removeClass('sspopuphide');
                  $('.ssdiscard'+otherids[j]).parent().parent().find('.dock-fileinput-btn').addClass('sspopuphide');
                  $('.ssdiscard'+otherids[j]).parent().parent().find('#dockeditor').addClass('sspopuphide');

                  var editor = CKEDITOR.instances['TemplateContent'+otherids[j]]; 
                  if(editor){ 
                    editor.destroy(true);
                  } 
                  $('#messageclick'+otherids[j]+' .reply-msg').hide();
                  $('#messageclick'+otherids[j]+'  .reply-body-btn-'+id).hide(); 
                  $('#messageclick'+otherids[j]+'  #cke_TemplateContent'+id).hide(); 
                  break;
                }
              }
            }
       
        //$('#msg_bd_'+id).append(jstext);
        
   // }
   fancyAdjust1();
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
    if(new_length>2){
      new_length =new_length - 2;
    }
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
      res = StripTags(decodeEntities(res));

      $('.ms_line'+id+' .msg_body:first').html(res);
      $('.dockmodal #messageclick'+id).parent('div.dockmodal-body').animate({
        scrollTop: 2000},'slow',function(){
        
        }); 
      // if($('#messageclick').parent()[0].scrollHeight!=undefined){
      //   var scrollofmsg =   $('#messageclick').parent()[0].scrollHeight;
      //   if(scrollofmsg>$('#messageclick').parent().height()){
      //     $('#messageclick').parent().animate({
      //       scrollTop: scrollofmsg
      //     }, 400);
      //   }
      // }
      fancyAdjust1();
      setTimeout(function(){
        fancyAdjust1();
      },500);
    //console.log('newhtml');
    //console.log(newhtml);
}

// function UpdatePartnerMessageHtmlHeader(){
//   //console.log('UpdatePartnerMessageHtmlHeader');
//   var APISERVER = $('#APISERVER').val();
//   var token = $('#token').val();
//   var language = $('#language').val();
//   var language = $('#language').val();
//   var partner_id = $('#partner_id').val();
//   var staffer_id = $('#staffer_id').val();
//   var total_params = 'token='+token+'&partner_id='+partner_id+'&direction=DESC&limit=10&read=1&staffer_id='+staffer_id;


//   var data = passProdRequest(APISERVER+'/api/PartnerMessages/getPartnerNotificationMails.json',total_params);
//   if(data == undefined){
//     var json_data = $('#json_data').val();
//     var data = JSON.parse(json_data);
//     data.response.status = is_undefined(data.response.status);
//     if(data.response.status == 'success'){
//       var htmldata = data.response.response.list;
//       var html ='';
//       var count = htmldata.length;
//       $(".badge_inbox").remove();
//       if(count!=0){
//         $("#mass_inbox span.title").after("<span class=\'badge badge_inbox badge-custom\' style=\'float:none; margin-left:10px;\'>"+count+"</span>");
//       }
//       var base_url = $('#BASE_URL').val();
//         var view_all = '<a class="view_all" style="border: none !important;border: none !important;float: right;padding: 0 !important;color:#5b9bd1;line-height: 1;" href="'+base_url+'/communication/inbox">'+vie+'</a>';

//       var partnername = PartnerName;
//       textone  = $('#textone').val();
//       textmany =  $('#textmany').val();
//       if(count==1){
//         text = textone.replace("%count%",'<span class="bold">'+count+'</span>');
//       }else{
//         text = textmany.replace("%count%",'<span class="bold">'+count+'</span>');
//       }
//       text = text+view_all;
              
//       html += '<li class="dropdown" id="header_message_bar"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="icon-envelope-open" style="margin:0"></i>';
//       html += '<span class="badge">'+count+'</span>';
//       html +='</a><ul style="width:280px !important" class="as dropdown-menu extended notification"><li style="padding: 7px 0;background-color:#eee">';
//       html += '<p class="msg_notifi">'+text+'</p></li>';
//       html += '<li><ul id="header_message_bar_dd" class="dropdown-menu-list">';
      
//       var htmlinn ='';
//       for(var key in htmldata){     
//         if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
//           var n = htmldata[key].PartnerMessage.source_from.trim();
//           if(n.indexOf('<')==0){
//             n = n.replace('<','');
//             n = n.replace('>','');
//             n = n.split('@');
//             var s = n;
//             var n = new Array(); 
//             n[0] = s[0].trim(); 
//             n[1] ='';
           
//           }
//           else{
//             n = n.split(" ");
//           }
//           var a = n[0];
//           var b = checkEmpty(n[1]);
//           if(a=='<'){
//             a='';
//           }
//           if(b=='<'){
//             b='';
//           }
//           var namestr = a+' '+b;
//         }
//         else if(htmldata[key].Customer.name!=undefined && htmldata[key].Customer.name!=null && htmldata[key].Customer.name!=''){
//           var n = htmldata[key].Customer.name.trim().split(" ");
//           var a = n[0];
//           var b = checkEmpty(n[1]);
//           if(a=='<'){
//             a='';
//           }
//           if(b=='<'){
//             b='';
//           }
//           var namestr = partnername+','+a+' '+b;
//         }
//         else{
//           var namestr = partnername.substring(0,13);
//         }
//         var initial1 = ''; var initial2 = '';
//         if(htmldata[key].PartnerMessage.source_from!=undefined && htmldata[key].PartnerMessage.source_from!=null && htmldata[key].PartnerMessage.source_from!=''){
//           var n = htmldata[key].PartnerMessage.source_from.trim().split(" ");
//           initial1 = n[0].substring(0,1).toUpperCase();
//           initial2 = n[1].substring(0,1).toUpperCase();
        
//         }
//         else{
//           var n = partnername.trim().split(" ");

//           initial1 = n[0].substring(0,1).toUpperCase();
//           initial2 = n[1].substring(0,1).toUpperCase();
         
//         }
//         if(initial1=='<' || initial1=='>'){
//           initial1='';
//         }
//         if(initial2=='>' || initial2=='<'){
//           initial2='';
//         }
//         var id = htmldata[key].PartnerMessage.id;
//         var parent_message_id = htmldata[key].PartnerMessage.parent_message_id;
//         htmlinn += '<li><a href="javascript:;" onclick="ss_message_click('+parent_message_id+','+id+')">';
//           htmlinn += '<span class="photo"><span class="border_radius_message">'+initial1+initial2+'</span></span>';
//           htmlinn += '<span class="subject">';
//             htmlinn += '<span class="from">'+namestr+'</span>';
//             htmlinn += '<span class="time">'+htmldata[key].PartnerMessageText.time_text+'</span>';
//           htmlinn += '</span>';
//           htmlinn += '<span class="message">'+htmldata[key].PartnerMessageText.subject.trim().substr(0,70)+'</span>';
//         htmlinn += '</a></li>';
        
        
//       }
//       html += htmlinn+'</ul></li></ul></li>';
//         //console.log('htmlhtmlhtmlhtml');
//       //console.log(html);
//       //console.log('htmlhtmlhtmlhtml');
//       $("#header_message_bar").remove();  
//       //console.log(count);
//       if(count!=0){
//           //$("#header_notification_bar").after(html);
//           //console.log('sss');
//           $('div.header ul.pull-right li.user').before(html);
//           setTimeout(function(){
//           $("#header_notification_bar").off();
//           $("#header_message_bar.dropdown").off();
//           $("#header_message_bar .dropdown-toggle").off();
//           $("#header_message_bar_dd").slimScroll();
//         },100);
//       } 
//     }
//     else if(data.response.status == 'error'){
//       return;
//     }
//   }
// }

function UpdatePartnerMessageHtmlHeader(frm=''){
  //console.log('UpdatePartnerMessageHtmlHeader');
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var language = $('#language').val();
  var partner_id = $('#partner_id').val();
  var staffer_id = $('#staffer_id').val();
 // var total_params = 'token='+token+'&partner_id='+partner_id+'&direction=DESC&limit=10&read=1&staffer_id='+staffer_id;



  var total_params = {
      token:token,
      partner_id:partner_id,
      direction:'DESC',
      limit:10,
      read:1,
      staffer_id:staffer_id,
    }

    var params = $.extend({}, doAjax_params_default);
    params['url'] = APISERVER+'/api/PartnerMessages/getPartnerNotificationMails.json';
    params['data'] = total_params;
    params['completeCallbackFunction'] = function (){
      
    }

    params['successCallbackFunction'] = function (data){
      if(data.response.status == 'success'){
        //localStorage.setItem('getPartnerNotificationMails',JSON.stringify(data));
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
        $("#header_message_bar").remove();  
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
    // if(frm == 'storage'){
    //   var d = localStorage.getItem('getPartnerNotificationMails');
    //   if(checkNull(d) == ''){
    //     doAjax(params);
    //   }
    //   else if (typeof params['successCallbackFunction'] === "function") {
    //     d = JSON.parse(d);
    //     params['successCallbackFunction'](d);
    //   }
    // }
    // else{
      doAjax(params);
    // }
    return;

}

function ss_message_click(parent_id,message_id,modalstate=''){
 parent_id = parseInt(parent_id);
 message_id = parseInt(message_id);

  if(localStorage.getItem('ss_message_click_a')!=null && localStorage.getItem('ss_message_click_a')!=undefined && localStorage.getItem('ss_message_click_a')!=''){
     var ss_message_click_a = JSON.parse(localStorage.getItem('ss_message_click_a'));
     var newa = [];
      var flag = 0;
     for(var j in ss_message_click_a){
        if(parseInt(ss_message_click_a[j].parent_id)==parent_id && parseInt(ss_message_click_a[j].message_id)==message_id){
          flag = 1;
          break;
        }
     }
    if(flag==0){
      var jsons = {parent_id:parent_id,message_id:message_id,'modalstate':'docked'};
      newa.push(jsons);
    }
    var newaa = ss_message_click_a.concat(newa);
    newaa = JSON.stringify(newaa);
    localStorage.setItem('ss_message_click_a',newaa);
    
  }
  else{
    var arr = [];
    var json = {parent_id:parent_id,message_id:message_id,'modalstate':'docked'};
    arr.push(json);
    arr = JSON.stringify(arr);
    localStorage.setItem('ss_message_click_a',arr);
  }
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
   var staffer_id = $('#staffer_id').val();
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
 // var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&message_id='+msg_id+'&folder=i&from=inbox';
  //var data = passProdRequest(APISERVER+'/api/PartnerMessages/getMsgThread.json',total_params,'undefined','undefined');
  var total_params = {
    token:token,
    language:language,
    lang:lang,
    partner_id:partner_id,
    message_id:msg_id,
    folder:'i,c',
    from:'inbox',
    staffer_id:staffer_id
  };
  var dftdetails = '';
  $.ajax({
    type: 'POST',
    url: APISERVER+'/api/PartnerMessages/getMsgThread.json',
    data: total_params,
    async: false,
    dataType : "json",
    success: function(data,status,xhr){
      data.response.status = is_undefined(data.response.status);
      if(data.response.status == 'success'){
        var stafer_id = $('#staffer_id').val();
        // getInboxCountApi2(stafer_id);
        // UpdatePartnerMessageHtmlHeader();
     
        var tflag = 0;
        for (index = 0; index < data.response.response.threaddetails.length; ++index){
          
          var msgids =  data.response.response.threaddetails[index].PartnerMessage.id;
         
          if($('.dockmodal #messageclick'+msgids).length!=0){
            if($('.dockmodal #messageclick'+msgids).parent().css('display')=="none"){
              $('.dockmodal #messageclick'+msgids).parent().prev('div.dockmodal-header').find('a.action-minimize').click();
            }
            tflag = 1; 

              break;
           }
        }
         getInboxCountApi2(stafer_id);
        UpdatePartnerMessageHtmlHeader();
        if(tflag==1){
          return;
        }
  
        if(data.response.response){

          if(data.response.response.draftdetails!=undefined && data.response.response.draftdetails!=null && data.response.response.draftdetails!=''){
            dftdetails = data.response.response.draftdetails;
          }

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
                var spid = $('#partner_id').val();
                var viewpath = path = crouter_url+'app/webroot/view_file.php?url='+data.response.response[index].PartnerMessageAttachment[i].urlencode+'&size='+data.response.response[index].PartnerMessageAttachment[i].size+'&partner_id='+btoa(spid);

                var extension =  data.response.response[index].PartnerMessageAttachment[i].extension;
                var ext = extension.toUpperCase();
                var orig_name = data.response.response[index].PartnerMessageAttachment[i].orig_name_wt_ext;
                var thurl  = data.response.response[index].PartnerMessageAttachment[i].thumbnail_url;
                if(thurl==undefined || thurl==null || thurl==''){
                  var thurl  = data.response.response[index].PartnerMessageAttachment[i].file_path;
                }
                  var file_path  = htmldata.PartnerMessageAttachment[i].file_path;
                  var size = formatFileSize(data.response.response[index].PartnerMessageAttachment[i].size);

                 if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
                    jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
                      jstext += '<div class="files">';
                        jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
                        //  jstext += '<table><tbody>';
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
                                  jstext += '<img src="'+crouter_url+'>app/webroot/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
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
              
                jstext += '<div style="display:none" class="c_count mgs_sub_list" onclick="show_sub_list_thread_head('+id+','+msg_id+','+msg_id+');" style="border:none;"><div class="" style="border-top:none;"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr><td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="c_count_main">'+clen+'</div></td><td class="border_box_last" style="border:none;"></td></tr></tbody></table></div></div></div>';
              }
            }
          }
          //Reply field for message popup
          var PartnerMessageid = htmldata.PartnerMessage.id;
          jstext += '<div style="display:none" class="reply-msg"><table style="width:100%;"><tbody><tr>';
            jstext += '<td class="border_box_first" style="border:none; vertical-align: top !important;">';
              if(htmldata.PartnerMessage.sender !='customer'){
                if(htmldata.PartnerMessage.source_from!=''){
                 var email = htmldata.PartnerMessage.source_from.trim();
                }
              }
              else{
                if(htmldata.PartnerMessage.email!=''){
                 var email = htmldata.PartnerMessage.email.trim();
                }
              }
              if(email !=''){
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
                  email = email[0].trim().split(' ');
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
                  if(htmldata.PartnerMessage.sender !='customer'){
                    jstext += '<div><b class="writer_name">'+htmldata.PartnerMessage.source_from+'</b></div>';
                  }
                  else{
                    jstext += '<div><b class="writer_name">'+htmldata.PartnerMessage.email+'</b></div>';
                  }
                  jstext += '<div class="btn-group">';
                   var custname ='';
                    if(htmldata.Customer.name!= undefined && htmldata.Customer.name!=null){
                      var custname = htmldata.Customer.name;
                    }
                    var sourceFromEmail = htmldata.Customer.name+'</b> < '+custname+' >';
                    if(htmldata.PartnerMessage.sender!= 'customer' ){
                      var sourceFrom = htmldata.PartnerMessage.email.trim();
                    }
                    else{
                      var sourceFrom = htmldata.PartnerMessage.source_from.trim();
                    }
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
                   
                   
                    jstext += '<div class="btn mini" onmouseover="event.stopPropagation();" style="background-color: #fff !important; padding-left: 0px;" data-toggle="dropdown">To&nbsp;<b class="writer_name">'+sourceFromEmail+'</b>&nbsp;&nbsp;<i class="icon-caret-down"></i></div>';
                    jstext += '<ul class="dropdown-menu pull-right" style="width:200px;">';
                      jstext += '<li><a onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-reply reply-btn"></i>&nbsp;'+rep+'</a></li>';

                    jstext += '<li><a onclick="ss_show_dkmodal_for_forward_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-arrow-right reply-btn"></i>&nbsp;'+fwd+'</a></li>';
                    jstext += '<li><a onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+er+'</a></li>';
                    jstext += '<li><a onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+es+'</a></li>';
                   
                      jstext += '</ul><div style="clear:both;"></div>';
                    jstext += '</div>'
                  jstext += '</div>';
                  
                  jstext += '<form action="/bookingengine/bkengine/frm_msg'+PartnerMessageid+'s/inbox2" class="form-vertical login-form frm'+PartnerMessageid+'" id="frm_popup'+PartnerMessageid+'" rowno="'+PartnerMessageid+'" name="frm_activity_list'+PartnerMessageid+'" style="margin: 0px;" onsubmit="event.returnValue = false; return false;" method="post" accept-charset="utf-8"><div style="display:none;"><input name="_method" value="POST" type="hidden"></div>';
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
                                  jstext += '<a class="" data-rel="" href="{%=file.url%}" title="{%=file.name%}">';
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
                         jstext += '<span style="font-size: 20px; background-color: white; height: 34px; width: 15px;"  class="btn  fileinput-button"><span style="transform: rotate(45deg); display: none;margin-top: -5px;margin-left: -5px;"><i class="icon-paper-clip"></i></span><input type="file" name="files[]" id="files" class="files'+PartnerMessageid+' filespopup'+PartnerMessageid+'" multiple data-url="'+crouter_form_url+'" ></span>';
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
                          if(htmldata.PartnerMessage.sender!= 'customer' ){
                            var sourceFrom = htmldata.PartnerMessage.email.trim();
                          }
                          else{
                            var sourceFrom = htmldata.PartnerMessage.source_from.trim();
                          }

                          if(sourceFrom.indexOf('<')==0){
                            sourceFrom = sourceFrom.replace("<","");
                            sourceFrom = sourceFrom.replace(">","");
                            sourceEmail = sourceFrom;
                            sourceFrom = sourceFrom.split('@');
                            sourceName = sourceFrom[0];
                            cust_name = sourceName;
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
                              cust_name = sourceName;
                              sourceEmail = sourceFrom2;
                            }
                          jstext += '<input type="hidden" id="cust_name_popup'+PartnerMessageid+'" name="cust_name_popup'+PartnerMessageid+'" value="'+cust_name+'" >';
                          jstext += '<input type="hidden" id="cust_id_popup'+PartnerMessageid+'" name="cust_id_popup'+PartnerMessageid+'"  value="0" >';
                          jstext += '<input type="hidden" id="cust_con_id_popup'+PartnerMessageid+'" name="cust_con_id_popup'+PartnerMessageid+'" value="0" >';
                          jstext += '<input type="hidden" id="last_msg_text_id_popup'+PartnerMessageid+'_'+PartnerMessageid+'" >';
                          jstext += '<input id="final_attachments_popup'+PartnerMessageid+'" type="hidden" value="" name="final_attachments_popup'+PartnerMessageid+'">';
                          jstext += '<input id="from_inbox_popup'+PartnerMessageid+'" type="hidden" value="inbox" name="from_inbox_popup'+PartnerMessageid+'">';
                         
                          if(htmldata.PartnerMessage.sender!='customer'){
                            jstext += '<input id="reply_from_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.source_from+'" name="reply_from_'+PartnerMessageid+'">';
                             jstext += '<input id="to_email_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.email+'" name="to_email_popup_'+PartnerMessageid+'">';
                          }
                          else{
                            jstext += '<input id="reply_from_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.email+'" name="reply_from_'+PartnerMessageid+'">';
                             jstext += '<input id="to_email_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.source_from+'" name="to_email_popup_'+PartnerMessageid+'">';
                          }
                         
                        
                        jstext += '</div>';
                      jstext += '</div>';
                    jstext += '</div>';
                  jstext += '</form>';
                jstext += '</div>';
            jstext += '</td>';
          jstext += '</tr></tbody></table></div>';
          //Reply field end

          var upload_pin = '<span id="upload_pin" style="font-size: 20px; background-color: white; height: 34px; width: 15px;"  class="btn fileinput-button"><span style="transform: rotate(45deg); display: block;margin-top: -5px;margin-left: -5px;"><i class="icon-paper-clip"></i></span></span>';

         // $("#messageclick").dockmodal('destroy');
          //$('#messageclick'+id).html('');
         
          var a='';
          if(parent_id!=0){
            a = parent_id;
          }
          else{
            a = message_id;
          }
          localStorage.removeItem('draftidspopup'+a);
           $('body').append('<div id="messageclick'+a+'" class="msgclick"></div>');
          $("#messageclick"+a).dockmodal({
            initialState: "docked",
            title: subject_msg,
            initialState: modalstate,
            width: 610,
            minimize:function(){
              if(localStorage.getItem('ss_message_click_a')!=null && localStorage.getItem('ss_message_click_a')!=undefined && localStorage.getItem('ss_message_click_a')!=''){
                  var ss_message_click_a = JSON.parse(localStorage.getItem('ss_message_click_a'));
                  var newas = [];
                  for(var j in ss_message_click_a){
                    if(ss_message_click_a[j].parent_id==parent_id && ss_message_click_a[j].message_id==message_id){
                      ss_message_click_a[j]['modalstate'] = 'minimized';
                    }
                  }
                
                  if(ss_message_click_a!='' && ss_message_click_a!=undefined && ss_message_click_a!=null){
                    ss_message_click_a = JSON.stringify(ss_message_click_a);
                    localStorage.setItem('ss_message_click_a',ss_message_click_a);
                  }
              }
            },
            restore:function(){
              if(localStorage.getItem('ss_message_click_a')!=null && localStorage.getItem('ss_message_click_a')!=undefined && localStorage.getItem('ss_message_click_a')!=''){
                  var ss_message_click_a = JSON.parse(localStorage.getItem('ss_message_click_a'));
                  var newas = [];
                  for(var j in ss_message_click_a){
                    if(ss_message_click_a[j].parent_id==parent_id && ss_message_click_a[j].message_id==message_id){
                      ss_message_click_a[j]['modalstate'] = 'docked';
                    }
                  }
                
                  if(ss_message_click_a!='' && ss_message_click_a!=undefined && ss_message_click_a!=null){
                    ss_message_click_a = JSON.stringify(ss_message_click_a);
                    localStorage.setItem('ss_message_click_a',ss_message_click_a);
                  }
              }
            },
            beforeClose: function( event, dialog ) { 
              if(localStorage.getItem('ss_message_click_a')!=null && localStorage.getItem('ss_message_click_a')!=undefined && localStorage.getItem('ss_message_click_a')!=''){
                  var ss_message_click_a = JSON.parse(localStorage.getItem('ss_message_click_a'));
                  var newas = [];
                  for(var j in ss_message_click_a){
                    if(ss_message_click_a[j].parent_id==parent_id && ss_message_click_a[j].message_id==message_id){
                    }
                    else{
                      var jsons = {parent_id:ss_message_click_a[j].parent_id,message_id:ss_message_click_a[j].message_id};
                        newas.push(jsons);
                    }
                  }
                
                  if(newas!='' && newas!=undefined && newas!=null && newas!=[]){
                    newas = JSON.stringify(newas);
                    localStorage.setItem('ss_message_click_a',newas);
                  }
                  else{
                    localStorage.removeItem('ss_message_click_a');
                  }
              }
              $('#messageclick'+a).html(''); 
            },
            create: function( event, dialog ) { 
                  
              //draft changes
              if(dftdetails!=undefined && dftdetails!=null && dftdetails!=''){
                var draft_message_id = dftdetails.draft_message_id;
                var draft_message_text_id = dftdetails.draft_message_text_id;
                var messages =  dftdetails.draft_message;
                var pmsgid = dftdetails.parent_message_id;
                var obj= {partner_message_id:draft_message_id,partner_message_text_id:draft_message_text_id};
                var attachments_draft = dftdetails.attachments;
                localStorage.setItem('draftidspopup'+a,JSON.stringify(obj));
               setTimeout(function(){
                  reply_body_msg_show_tpl_head(message_id,parent_id,'no',messages,attachments_draft,a);

                },1000);   
              }
             //draft changes    
            },
            buttons: [
              {
                html: rep,
                buttonClass: "btn btn-primary replymsgclick"+a,
                click: function (e, dialog) {
                    // do something when the button is clicked
                  
                  }
              },
              {
                html: "<i class='icon-check'></i>&nbsp;"+sen,
                buttonClass: "btn blue sssend ssreply ssreply"+a+" sspopuphide ",
                click: function (e, dialog) {
                    // do something when the button is clicked
                    //set_reply_msg_head(PartnerMessageid);
                    reply_body_msg_hide_tpl_head(PartnerMessageid,a);
                    ss_send_reply_mail_head(a,'draft','','yes',a);
                    
                },
              },
              {
                html: dis,
                buttonClass: "btn btn-primary ssdiscard ssdiscard"+a+" sspopuphide",
                click: function (e, dialog) {
                    // do something when the button is clicked
                    
                    if(localStorage.getItem('draftidspopup'+a)!=null && localStorage.getItem('draftidspopup'+a)!=undefined && localStorage.getItem('draftidspopup'+a)!=''){
                        var draftidspopup = JSON.parse(localStorage.getItem('draftidspopup'+a));
                        ss_delete_trash_head_popup(parent_id,draftidspopup.partner_message_id);
                        setTimeout(function(){
                          localStorage.removeItem('draftidspopup'+a);
                        },500);
                        
                       reply_body_msg_hide_tpl_head(PartnerMessageid,a,message_id,parent_id);
                    }else{

                     reply_body_msg_hide_tpl_head(PartnerMessageid,a,message_id,parent_id);
                    }
                },
              },
            ]
          });
           $('.replymsgclick'+a).off('click');
          $('.replymsgclick'+a).click(function(){ 
            $('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
          
            if(parent_id!=0){
              a = parent_id;
            } 
            else{
              a = message_id;
            }   
            var b = a;
            reply_body_msg_show_tpl_head(message_id,parent_id,'','','','ss_message_click',b);          
          });
          $('#messageclick'+a).parent().next('div').find('.dock-fileinput-btn').click(function(){
            if(id==0){
              $('.filespopup'+msg_id).click();
            }
            else{
              $('.filespopup'+id).click();
            }
          });
         
           
          $('.dockmodal #messageclick'+a+' .replymsgclick'+a).parent().next('span').hide();
        
          $('.dockmodal #messageclick'+a).html(jstext);
          $('.dockmodal #messageclick'+a+' #msg_sub_popup'+message_id).val(subject_msg);
          $('.dockmodal #messageclick'+a+' #msg_sub_popup'+parent_id).val(subject_msg);

            

          if(parent_id!=message_id){
           
            if($('.dockmodal #messageclick #mgs_sub_list_row'+parent_id+message_id+message_id).position()!=undefined && $('.dockmodal #messageclick #mgs_sub_list_row'+parent_id+message_id+message_id).position()!=null && $('.dockmodal #messageclick #mgs_sub_list_row'+parent_id+message_id+message_id).position()!=''){
              var toop = $('.dockmodal #messageclick #mgs_sub_list_row'+parent_id+message_id+message_id).position().top;
            }

            if(toop==undefined || toop==null){
              toop = 0;
            }
            
            $('.dockmodal #messageclick'+a).parent('div').animate({
              scrollTop:toop },
              'slow',function(){
                $('.dockmodal #messageclick'+a+' .slr_rcv_'+id+'_'+message_id).show();
                $('.dockmodal #messageclick'+a+' .slr_txt_'+id+'_'+message_id).hide();
                $('.dockmodal #messageclick'+a+' .bd_resp_'+id+'_'+message_id).show();
            });
          }


          $('#last_msg_text_id_'+a+'_'+msg_id).val(text_id);
    
          $('tr.ms'+a).removeClass('unread');
            fancyAdjust1();
            setTimeout(function(){
              fancyAdjust1();
            },500);
        }
         fancyAdjust1();
         setTimeout(function(){
          fancyAdjust1();
        },500);
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
    },
    error: function(xhr, status, error){
      // showAlertMessage('Something went wrong','error',am);
    }
  });

}

function ss_message_click_2(parent_id,message_id,modalstate=''){
 parent_id = parseInt(parent_id);
 message_id = parseInt(message_id);

  if(localStorage.getItem('ss_message_click_a')!=null && localStorage.getItem('ss_message_click_a')!=undefined && localStorage.getItem('ss_message_click_a')!=''){
     var ss_message_click_a = JSON.parse(localStorage.getItem('ss_message_click_a'));
     var newa = [];
      var flag = 0;
     for(var j in ss_message_click_a){
        if(parseInt(ss_message_click_a[j].parent_id)==parent_id && parseInt(ss_message_click_a[j].message_id)==message_id){
          flag = 1;
          break;
        }
     }
    if(flag==0){
      var jsons = {parent_id:parent_id,message_id:message_id,'modalstate':'docked'};
      newa.push(jsons);
    }
    var newaa = ss_message_click_a.concat(newa);
    newaa = JSON.stringify(newaa);
    localStorage.setItem('ss_message_click_a',newaa);

  }
  else{
    var arr = [];
    var json = {parent_id:parent_id,message_id:message_id,'modalstate':'docked'};
    arr.push(json);
    arr = JSON.stringify(arr);
    localStorage.setItem('ss_message_click_a',arr);
  }
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
  var staffer_id = $('#staffer_id').val();
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
 // var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&message_id='+msg_id+'&folder=i&from=inbox';
  //var data = passProdRequest(APISERVER+'/api/PartnerMessages/getMsgThread.json',total_params,'undefined','undefined');
  var total_params = {
    token:token,
    language:language,
    lang:lang,
    partner_id:partner_id,
    message_id:msg_id,
    folder:'i,c',
    from:'inbox',
    staffer_id:staffer_id

  };
  var dftdetails = '';
  $.ajax({
    type: 'POST',
    url: APISERVER+'/api/PartnerMessages/getMsgThread.json',
    data: total_params,
    async: false,
    dataType : "json",
    success: function(data,status,xhr){
      data.response.status = is_undefined(data.response.status);
      if(data.response.status == 'success'){
        var stafer_id = $('#staffer_id').val();
        getInboxCountApi2(stafer_id);
        UpdatePartnerMessageHtmlHeader();
      
        if(data.response.response){

          if(data.response.response.draftdetails!=undefined && data.response.response.draftdetails!=null && data.response.response.draftdetails!=''){
            dftdetails = data.response.response.draftdetails;
          }

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
                var spid = $('#partner_id').val();
                var viewpath = path = crouter_url+'app/webroot/view_file.php?url='+data.response.response[index].PartnerMessageAttachment[i].urlencode+'&size='+data.response.response[index].PartnerMessageAttachment[i].size+'&partner_id='+btoa(spid);

                var extension =  data.response.response[index].PartnerMessageAttachment[i].extension;
                var ext = extension.toUpperCase();
                var orig_name = data.response.response[index].PartnerMessageAttachment[i].orig_name_wt_ext;
                var thurl  = data.response.response[index].PartnerMessageAttachment[i].thumbnail_url;
                if(thurl==undefined || thurl==null || thurl==''){
                  var thurl  = data.response.response[index].PartnerMessageAttachment[i].file_path;
                }
                  var file_path  = htmldata.PartnerMessageAttachment[i].file_path;
                var size = formatFileSize(data.response.response[index].PartnerMessageAttachment[i].size);
                 if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
                    jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
                      jstext += '<div class="files">';
                        jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
                        //  jstext += '<table><tbody>';
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
                                  jstext += '<img src="'+crouter_url+'>app/webroot/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
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
              
                jstext += '<div style="display:none" class="c_count mgs_sub_list" onclick="show_sub_list_thread_head('+id+','+msg_id+','+msg_id+');" style="border:none;"><div class="" style="border-top:none;"><div style="padding:10px 0px;"><table style="width:100%;"><tbody><tr><td class="border_box_first" style="border:none; vertical-align: top !important;"><div class="c_count_main">'+clen+'</div></td><td class="border_box_last" style="border:none;"></td></tr></tbody></table></div></div></div>';
              }
            }
          }
          //Reply field for message popup
          var PartnerMessageid = htmldata.PartnerMessage.id;
          
          jstext += '<div style="display:none" class="reply-msg"><table style="width:100%;"><tbody><tr>';
            jstext += '<td class="border_box_first" style="border:none; vertical-align: top !important;">';
              if(htmldata.PartnerMessage.sender !='customer'){
                if(htmldata.PartnerMessage.source_from!=''){
                 var email = htmldata.PartnerMessage.source_from.trim();
                }
              }
              else{
                if(htmldata.PartnerMessage.email!=''){
                 var email = htmldata.PartnerMessage.email.trim();
                }
              }
              if(email !=''){
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
                  email = email[0].trim().split(' ');
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
                  if(htmldata.PartnerMessage.sender !='customer'){
                    jstext += '<div><b class="writer_name">'+htmldata.PartnerMessage.source_from+'</b></div>';
                  }
                  else{
                    jstext += '<div><b class="writer_name">'+htmldata.PartnerMessage.email+'</b></div>';
                  }
                  jstext += '<div class="btn-group">';
                    var custname ='';
                    if(htmldata.Customer.name!= undefined && htmldata.Customer.name!=null){
                      var custname = htmldata.Customer.name;
                    }
                    var sourceFromEmail = htmldata.Customer.name+'</b> < '+custname+' >';
                    if(htmldata.PartnerMessage.sender!= 'customer' ){
                      var sourceFrom = htmldata.PartnerMessage.email.trim();
                    }
                    else{
                      var sourceFrom = htmldata.PartnerMessage.source_from.trim();
                    }
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
                   
                    jstext += '<div class="btn mini" onmouseover="event.stopPropagation();" style="background-color: #fff !important; padding-left: 0px;" data-toggle="dropdown">To&nbsp;<b class="writer_name">'+sourceFromEmail+'</b>&nbsp;&nbsp;<i class="icon-caret-down"></i></div>';
                    jstext += '<ul class="dropdown-menu pull-right" style="width:200px;">';
                      jstext += '<li><a onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-reply reply-btn"></i>&nbsp;'+rep+'</a></li>';

                    jstext += '<li><a onclick="ss_show_dkmodal_for_forward_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-arrow-right reply-btn"></i>&nbsp;'+fwd+'</a></li>';
                    jstext += '<li><a onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+er+'</a></li>';
                    jstext += '<li><a onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+es+'</a></li>';
                   
                      jstext += '</ul><div style="clear:both;"></div>';
                    jstext += '</div>'
                  jstext += '</div>';
                  
                  jstext += '<form action="/bookingengine/bkengine/frm_msg'+PartnerMessageid+'s/inbox2" class="form-vertical login-form frm'+PartnerMessageid+'" id="frm_popup'+PartnerMessageid+'" rowno="'+PartnerMessageid+'" name="frm_activity_list'+PartnerMessageid+'" style="margin: 0px;" onsubmit="event.returnValue = false; return false;" method="post" accept-charset="utf-8"><div style="display:none;"><input name="_method" value="POST" type="hidden"></div>';
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
                                  jstext += '<a class="" data-rel="" href="{%=file.url%}" title="{%=file.name%}">';
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
                         jstext += '<span style="font-size: 20px; background-color: white; height: 34px; width: 15px;"  class="btn  fileinput-button"><span style="transform: rotate(45deg); display: none;margin-top: -5px;margin-left: -5px;"><i class="icon-paper-clip"></i></span><input type="file" name="files[]" id="files" class="files'+PartnerMessageid+' filespopup'+PartnerMessageid+'" multiple data-url="'+crouter_form_url+'" ></span>';
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
                          if(htmldata.PartnerMessage.sender!= 'customer' ){
                            var sourceFrom = htmldata.PartnerMessage.email.trim();
                          }
                          else{
                            var sourceFrom = htmldata.PartnerMessage.source_from.trim();
                          }
                          if(sourceFrom.indexOf('<')==0){
                            sourceFrom = sourceFrom.replace("<","");
                            sourceFrom = sourceFrom.replace(">","");
                            sourceEmail = sourceFrom;
                            sourceFrom = sourceFrom.split('@');
                            sourceName = sourceFrom[0];
                            var cust_name = sourceName;
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
                              var cust_name = sourceName;
                              sourceEmail = sourceFrom2;
                            }
                          jstext += '<input type="hidden" id="cust_name_popup'+PartnerMessageid+'" name="cust_name_popup'+PartnerMessageid+'" value="'+cust_name+'" >';
                          jstext += '<input type="hidden" id="cust_id_popup'+PartnerMessageid+'" name="cust_id_popup'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
                          jstext += '<input type="hidden" id="cust_con_id_popup'+PartnerMessageid+'" name="cust_con_id_popup'+PartnerMessageid+'" value="'+PartnerMessageid+'" >';
                          jstext += '<input type="hidden" id="last_msg_text_id_popup'+PartnerMessageid+'_'+PartnerMessageid+'" >';
                          jstext += '<input id="final_attachments_popup'+PartnerMessageid+'" type="hidden" value="" name="final_attachments_popup'+PartnerMessageid+'">';
                          jstext += '<input id="from_inbox_popup'+PartnerMessageid+'" type="hidden" value="inbox" name="from_inbox_popup'+PartnerMessageid+'">';
                         
                          if(htmldata.PartnerMessage.sender!='customer'){
                            jstext += '<input id="reply_from_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.source_from+'" name="reply_from_'+PartnerMessageid+'">';
                             jstext += '<input id="to_email_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.email+'" name="to_email_popup_'+PartnerMessageid+'">';
                          }
                          else{
                            jstext += '<input id="reply_from_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.email+'" name="reply_from_'+PartnerMessageid+'">';
                             jstext += '<input id="to_email_popup'+PartnerMessageid+'" type="hidden" value="'+htmldata.PartnerMessage.source_from+'" name="to_email_popup_'+PartnerMessageid+'">';
                          }
                         
                        
                        jstext += '</div>';
                      jstext += '</div>';
                    jstext += '</div>';
                  jstext += '</form>';
                jstext += '</div>';
            jstext += '</td>';
          jstext += '</tr></tbody></table></div>';
          //Reply field end

          var upload_pin = '<span id="upload_pin" style="font-size: 20px; background-color: white; height: 34px; width: 15px;"  class="btn fileinput-button"><span style="transform: rotate(45deg); display: block;margin-top: -5px;margin-left: -5px;"><i class="icon-paper-clip"></i></span></span>';

         // $("#messageclick").dockmodal('destroy');
          //$('#messageclick'+id).html('');
         
          var a='';
          if(parent_id!=0){
            a = parent_id;
          }
          else{
            a = message_id;
          }
           $('body').append('<div id="messageclick'+a+'" class="msgclick"></div>');
          $("#messageclick"+a).dockmodal({
            initialState: "docked",
            title: subject_msg,
            initialState: modalstate,
            width: 610,
            minimize:function(){
              if(localStorage.getItem('ss_message_click_a')!=null && localStorage.getItem('ss_message_click_a')!=undefined && localStorage.getItem('ss_message_click_a')!=''){
                  var ss_message_click_a = JSON.parse(localStorage.getItem('ss_message_click_a'));
                  var newas = [];
                  for(var j in ss_message_click_a){
                    if(ss_message_click_a[j].parent_id==parent_id && ss_message_click_a[j].message_id==message_id){
                      ss_message_click_a[j]['modalstate'] = 'minimized';
                    }
                  }
                
                  if(ss_message_click_a!='' && ss_message_click_a!=undefined && ss_message_click_a!=null){
                    ss_message_click_a = JSON.stringify(ss_message_click_a);
                    localStorage.setItem('ss_message_click_a',ss_message_click_a);
                  }
              }
            },
            restore:function(){
              if(localStorage.getItem('ss_message_click_a')!=null && localStorage.getItem('ss_message_click_a')!=undefined && localStorage.getItem('ss_message_click_a')!=''){
                  var ss_message_click_a = JSON.parse(localStorage.getItem('ss_message_click_a'));
                  var newas = [];
                  for(var j in ss_message_click_a){
                    if(ss_message_click_a[j].parent_id==parent_id && ss_message_click_a[j].message_id==message_id){
                      ss_message_click_a[j]['modalstate'] = 'docked';
                    }
                  }
                
                  if(ss_message_click_a!='' && ss_message_click_a!=undefined && ss_message_click_a!=null){
                    ss_message_click_a = JSON.stringify(ss_message_click_a);
                    localStorage.setItem('ss_message_click_a',ss_message_click_a);
                  }
              }
            },
            beforeClose: function( event, dialog ) { 
              if(localStorage.getItem('ss_message_click_a')!=null && localStorage.getItem('ss_message_click_a')!=undefined && localStorage.getItem('ss_message_click_a')!=''){
                  var ss_message_click_a = JSON.parse(localStorage.getItem('ss_message_click_a'));
                  var newas = [];
                  for(var j in ss_message_click_a){
                    if(ss_message_click_a[j].parent_id==parent_id && ss_message_click_a[j].message_id==message_id){
                    }
                    else{
                      var jsons = {parent_id:ss_message_click_a[j].parent_id,message_id:ss_message_click_a[j].message_id};
                        newas.push(jsons);
                    }
                  }
                
                  if(newas!='' && newas!=undefined && newas!=null && newas!=[]){
                    newas = JSON.stringify(newas);
                    localStorage.setItem('ss_message_click_a',newas);
                  }
                  else{
                    localStorage.removeItem('ss_message_click_a');
                  }
              }
              $('#messageclick'+a).html(''); 
            },
            create: function( event, dialog ) { 
                  
              //draft changes
              if(dftdetails!=undefined && dftdetails!=null && dftdetails!=''){
                var draft_message_id = dftdetails.draft_message_id;
                var draft_message_text_id = dftdetails.draft_message_text_id;
                var messages =  dftdetails.draft_message;
                var pmsgid = dftdetails.parent_message_id;
                var obj= {partner_message_id:draft_message_id,partner_message_text_id:draft_message_text_id};
                var attachments_draft = dftdetails.attachments;
                localStorage.setItem('draftidspopup'+a,JSON.stringify(obj));
               setTimeout(function(){
                  console.log('message_id--'+message_id+'--parent_id--'+parent_id+'--messages'+messages+'--attachments_draft--'+attachments_draft+'--a--'+a);
                  reply_body_msg_show_tpl_head(message_id,parent_id,'no',messages,attachments_draft,a);

                },1000);   
              }
             //draft changes    
            },
            buttons: [
              {
                html: rep,
                buttonClass: "btn btn-primary replymsgclick"+a,
                click: function (e, dialog) {
                    // do something when the button is clicked
                  
                  }
              },
              {
                html: "<i class='icon-check'></i>&nbsp;"+sen,
                buttonClass: "btn blue sssend ssreply ssreply"+a+" sspopuphide ",
                click: function (e, dialog) {
                    // do something when the button is clicked
                    //set_reply_msg_head(PartnerMessageid);
                    reply_body_msg_hide_tpl_head(PartnerMessageid,a);
                    ss_send_reply_mail_head(a,'draft','','yes',a);
                    
                },
              },
              {
                html: dis,
                buttonClass: "btn btn-primary ssdiscard ssdiscard"+a+" sspopuphide",
                click: function (e, dialog) {
                    // do something when the button is clicked
                   
                    if(localStorage.getItem('draftidspopup'+a)!=null && localStorage.getItem('draftidspopup'+a)!=undefined && localStorage.getItem('draftidspopup'+a)!=''){
                        var draftidspopup = JSON.parse(localStorage.getItem('draftidspopup'+a));
                        ss_delete_trash_head_popup(parent_id,draftidspopup.partner_message_id);
                         setTimeout(function(){
                          localStorage.removeItem('draftidspopup'+a);
                        },500);
                        reply_body_msg_hide_tpl_head(PartnerMessageid,a,message_id,parent_id);
                    }else{

                     reply_body_msg_hide_tpl_head(PartnerMessageid,a,message_id,parent_id);
                    }
                },
              },
            ]
          });
           $('.replymsgclick'+a).off('click');
          $('.replymsgclick'+a).click(function(){  
            $('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
            
            if(parent_id!=0){
              a = parent_id;
            } 
            else{
              a = message_id;
            }   
            var b = a;
            reply_body_msg_show_tpl_head(message_id,parent_id,'','','','ss_message_click',b);          
          });
          $('#messageclick'+a).parent().next('div').find('.dock-fileinput-btn').click(function(){
            if(id==0){
              $('.filespopup'+msg_id).click();
            }
            else{
              $('.filespopup'+id).click();
            }
          });
         
           
          $('#messageclick'+a+' .replymsgclick'+a).parent().next('span').hide();
        
          $('.dockmodal #messageclick'+a).html(jstext);
          $('#messageclick'+a+' #msg_sub_popup'+message_id).val(subject_msg);
          $('#messageclick'+a+' #msg_sub_popup'+parent_id).val(subject_msg);

            

          if(parent_id!=message_id){
           
            if($('#messageclick #mgs_sub_list_row'+parent_id+message_id+message_id).position()!=undefined && $('#messageclick #mgs_sub_list_row'+parent_id+message_id+message_id).position()!=null && $('#messageclick #mgs_sub_list_row'+parent_id+message_id+message_id).position()!=''){
              var toop = $('#messageclick #mgs_sub_list_row'+parent_id+message_id+message_id).position().top;
            }

            if(toop==undefined || toop==null){
              toop = 0;
            }
            
            $('#messageclick'+a).parent('div').animate({
              scrollTop:toop },
              'slow',function(){
                $('#messageclick'+a+' .slr_rcv_'+id+'_'+message_id).show();
                $('#messageclick'+a+' .slr_txt_'+id+'_'+message_id).hide();
                $('#messageclick'+a+' .bd_resp_'+id+'_'+message_id).show();
            });
          }


          $('#last_msg_text_id_'+a+'_'+msg_id).val(text_id);
    
          $('tr.ms'+a).removeClass('unread');
            fancyAdjust1();
            setTimeout(function(){
              fancyAdjust1();
            },500);
        }
         fancyAdjust1();
         setTimeout(function(){
          fancyAdjust1();
        },500);
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
    },
    error: function(xhr, status, error){
      // showAlertMessage('Something went wrong','error',am);
    }
  });

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
      msg_body = StripTags(decodeEntities(msg_body));
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
        msg_body = StripTags(decodeEntities(msg_body));
        $('.ms_line'+pmid+ ' div.msg_body').html(msg_body);
      }
      // if(parent_message_id!=0){
      //   if(localStorage.getItem('draftidspopup'+parent_message_id)!=undefined && localStorage.getItem('draftidspopup'+parent_message_id)!=null && localStorage.getItem('draftidspopup'+parent_message_id)!=''){
      //     localStorage.removeItem('draftidspopup'+parent_message_id);
      //   }
      // }
      // if(message_id!=0){
      //   if(localStorage.getItem('draftidspopup'+message_id)!=undefined && localStorage.getItem('draftidspopup'+message_id)!=null && localStorage.getItem('draftidspopup'+message_id)!=''){
      //    localStorage.removeItem('draftidspopup'+message_id);
      //   }
      // }

        
      

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
   var partner_id = $('#partner_id').val();
  var attached_array = [];
    $("form[id^='frm_msg']").fileupload({
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
   var timeouts123 = [];
function reply_body_msg_show_tpl_head(id,parent_message_id,removelocal='yes',message='',attachments='',from,a){
  if(a!=undefined && a!='' && a!=null){

  }
  else{
    var a = id;
    if(parent_message_id!=0){
      var a = parent_message_id;
    }
  }
  if(removelocal=='yes'){
    localStorage.removeItem('draftidspopup'+a);
  }
  var data_len = $('#attachments').val();
  if(data_len!=undefined){
    if(data_len.length == 2){
      $('#table-striped_'+a+' .files').html('');
    }
  }
  var editor = CKEDITOR.instances['TemplateContent_popup'+a]; 
  if(editor){ 
    editor.destroy(true);
  }
  if(1==1){ 
     CKEDITOR.replace('TemplateContent_popup'+a,{
        uiColor: 'FFFFFF', 
        height:['100px'],
        language:ss_ck_lang_js,
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
    if(message!=''){
        //CKEDITOR.instances['TemplateContent'+id].setData('');
       // if(CKEDITOR.instances['TemplateContent_popup'+a]!=undefined){
          CKEDITOR.instances['TemplateContent_popup'+a].setData(message);
        //}
      }
      else{
       // if(CKEDITOR.instances['TemplateContent_popup'+a]!=undefined){
        if(staff_signature!=''){
          CKEDITOR.instances['TemplateContent_popup'+a].setData('<div><br><br></div>'+staff_signature);
          }
        //}
      }
     set_reply_msg_head(id,'draft',parent_message_id,'no',a);
    CKEDITOR.on('instanceReady', function(){ 
      var ckeditor = CKEDITOR.instances['TemplateContent_popup'+a];
      ckeditor.dataProcessor.writer.lineBreakChars = '\r\n';
      CKEDITOR.config.autoGrow_onStartup = true;  
      CKEDITOR.config.coreStyles_bold = { element: 'b', overrides: 'strong' };
      CKEDITOR.config.coreStyles_italic = { element : 'i', overrides : 'em' };
     
      $('#table-striped_'+a+'>tbody').html('');
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
          addHtml += '<button data-url="'+delete_url+'" onClick="set_reply_msg('+id+',\"draft\",'+parent_message_id+');"  data-type="DELETE" class="btn  mini"><i class="icon-remove"></i></button></td></tr>';                 
        }        
        $('#table-striped_'+a+'>tbody').html(addHtml);
      }
      
   
      if(CKEDITOR.instances['TemplateContent_popup'+a]!=undefined){
        CKEDITOR.instances['TemplateContent_popup'+a].on('key', function(evt) {
   
      var charCode  = '';
      if(evt.data!=undefined && evt.data!=null){
        if(evt.data.keyCode!=undefined && evt.data.keyCode!=null){
          charCode = evt.data.keyCode;
        }
      }
          if(charCode==27){
            reply_body_msg_hide_tpl_head(id,a);
          }

        });
      CKEDITOR.instances['TemplateContent_popup'+a].on('change', function(ev) {
         ev.removeListener();
      });
      CKEDITOR.instances['TemplateContent_popup'+a].on('change', function(e) {
        $('.draft_progress').show();
        $('.draft_complete').hide();
        $('.draft_progress_popup').show();
        $('.draft_complete_popup').hide();
         $('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
   
        for (var i = 0; i < timeouts123.length; i++) {
     
          clearTimeout(timeouts123[i]);
        }
        timeouts123 = [];
        if(localStorage.getItem('draftidspopup'+a)!=null){
          timeouts123.push(
            setTimeout(function(){
              set_reply_msg_head(id,'draft',parent_message_id,'no',a); 
            }, 1000)
          );
        
        }
        else{
         
        }
      });
    }

      CKEditor_loaded = true; 
      if($('.cke_editor_TemplateContent_popup'+a+' div.cke_inner span.cke_top').length!=0){
        var tlbrtbtm = $('.cke_editor_TemplateContent_popup'+a+' div.cke_inner span.cke_top').clone();
        $('.dockmodal #messageclick'+a).parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').html('');
          $('.dockmodal  #messageclick'+a).parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').append(tlbrtbtm);
          $('.dockmodal  #messageclick'+a+' .cke_editor_TemplateContent_popup'+a+' div.cke_inner span.cke_top').remove();
          $('.ssdiscard'+a).removeClass('sspopuphide');
          $('.ssreply'+a).removeClass('sspopuphide');
          var html ='<i class="icon-circle draft_progress_popup" style="float:right;color:#d23f31;margin-top: 12px;"></i><i class="icon-ok draft_complete_popup" style="display:none;float:right;color:green;margin-top: 12px;"></i>';
         // if(from=='ss_message_click'){

            $('.replymsgclick'+a).addClass('sspopuphide');
            $('.dockmodal  #messageclick'+a+' .reply-body-btn-'+a).show();
            $('.dockmodal  #messageclick'+a+' .rpl'+a).show();
            $('.dockmodal  #messageclick'+a+' .imgm'+a).show();
            $('.ssreply'+a).removeClass('sspopuphide');
            $('.ssdiscard'+a).removeClass('sspopuphide');
            $('.dockmodal  #messageclick'+a+' .reply-msg').show();
            $('.dockmodal  #messageclick'+a+' .reply-main').show();
   
            $('.dockmodal  #messageclick'+a).parent().next('div').find('.dock-fileinput-btn').removeClass('sspopuphide');
            $('.dockmodal  #messageclick'+a).parent().next('div').find('.dock-fileinput-btn').show();
          //}
          
          $('.dockmodal #messageclick'+a).parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').prepend(html);
      }
       var heg = 0;
    
      if($('.dockmodal  #messageclick'+a).parent('.dockmodal-body').scrollHeight!=undefined && $('#messageclick').parent('.dockmodal-body').scrollHeight!=null && $('#messageclick').parent('.dockmodal-body').scrollHeight!=''){
        var heg = $('#messageclick'+a).parent('.dockmodal-body').scrollHeight;
      }
      $('.dockmodal  #messageclick'+a).parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').removeClass('sspopuphide');
       if(CKEDITOR.instances['TemplateContent_popup'+a]!=undefined){
            $('#messageclick'+a).parent('div.dockmodal-body').animate({
        scrollTop: 2000},'slow',function(){
        if(CKEDITOR.instances['TemplateContent_popup'+a]!=undefined){ 
         CKEDITOR.instances['TemplateContent_popup'+a].focus();
        }
        }); 
      
     }

    }); 
  $('.dockmodal #messageclick'+a+' .reply-body-btn-'+a).show();
  $('.dockmodal #messageclick'+a+' .rpl'+a).show();
  $('.dockmodal #messageclick'+a+' .imgm'+a).show();
}
  
function reply_body_msg_hide_tpl_head(id,a,message_id='',parent_id=''){

 $('.dockmodal #messageclick'+a+' .reply-msg').hide();

 $('.dockmodal #messageclick'+a+' .reply-body-btn-'+id).hide();
  $('.dockmodal #messageclick'+a+' .rpl'+id).hide();
  $('.dockmodal #messageclick'+a+' .imgm'+id).hide();
  $('.dockmodal #messageclick'+a+' .reply-main').hide();
  $('#TemplateContent_popup'+id).hide();
  $('.ssdiscard'+a).addClass('sspopuphide');
  $('.ssreply'+a).addClass('sspopuphide');
  $('.dockmodal #messageclick'+a).parent().next('div.dockmodal-footer').find('span.dock-fileinput-btn').addClass('sspopuphide');
  $('.replymsgclick'+a).removeClass('sspopuphide');
  $('.dockmodal #messageclick'+a).parent().next('div.dockmodal-footer').children('.dkf-container').children('#dockeditor').addClass('sspopuphide');
  $('.dockmodal #messageclick'+a+' #frm_msg'+id+' #table-striped_'+id+' .files').children().children('.delete').children('.btn').click();

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
  $('.dockmodal #messageclick'+a+' #TemplateContent_popup'+id).val(''); 
 
  $('.replymsgclick'+a).off('click');
  $('.replymsgclick'+a).click(function(){  
     $('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
    reply_body_msg_show_tpl_head(message_id,parent_id,'','','','ss_message_click',a);          
  });

  
  }

  function bind_upoad_head(id,from='',sid='',pmid='',a){
    var APISERVER = $('#APISERVER').val();
     var admin_id = $('#admin_id').val();
      var partner_id = $('#partner_id').val();
     var attached_array = [];
     if(from!='popup'){
      var frmname  = "#frm_msg"+id;
     }
     else{
         var frmname  = "#frm_popup"+id;
     }
    $(frmname).fileupload({
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
      addHtml += '<button  data-url="'+file.delete_url+'" onclick="delete_file(this,'+id+')" data-type="DELETE" class="btn  mini"><i class="icon-remove"></i></button></td></tr>';                
      });
      //$('.table-striped#table-striped_'+row_id+' .files').append(addHtml);
       $('.table-striped#table-striped_'+a+' .files').append(addHtml);
  
      
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
        $('.draft_progress').hide();
        $('.draft_complete').show();
        $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
      if(from=='popup'){
        $('.draft_progress_popup').show();
        $('.draft_complete_popup').hide();
     
       set_reply_msg_head(sid,'draft',pmid,'no',a);

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

    $(frmname).bind('fileuploaddestroy', function (e, data) {

      if(from=='newmail'){
        json_arr = $('#final_attachments'+id).val();
      }
      else{
         json_arr = $('#final_attachments_popup'+sid).val();
      }
      delete_url = data.url;
      var arr = {};
      if(json_arr!='' && json_arr!=undefined && json_arr!=''){
        arr = JSON.parse(json_arr);
      }
      
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
  if(obj.length > 0 && obj.length!=undefined) {
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


function set_reply_msg_head(lineID,draft='',parent_message_id='',sendmail='no',a){

  var body ='';
  if(CKEDITOR.instances['TemplateContent_popup'+lineID]!=undefined){
     var body = CKEDITOR.instances['TemplateContent_popup'+lineID].getData();
  }
  else if(CKEDITOR.instances['TemplateContent_popup'+a]!=undefined){
    var body = CKEDITOR.instances['TemplateContent_popup'+a].getData();
  }
  $('#reply_msg_body_popup'+lineID).val(body);
  $('#reply_msg_body_popup'+a).val(body)
  $('.field_id').val(lineID);

  if(draft==''){
  ss_send_reply_mail_head(lineID,'',parent_message_id,sendmail,a);
  }
  else if(draft=='draft'){
  ss_send_reply_mail_head(lineID,'draft',parent_message_id,sendmail,a);
  }
}

function ss_send_reply_mail_head(lineID,draft='',parent_message_id='',sendmail='no',a){
  
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  if(parent_message_id!=''){
  parent_message_id = parseInt(parent_message_id);
  }
  var partner_id = $('#partner_id').val();
  var mailbody = $('#reply_msg_body_popup'+lineID).val();
  if(mailbody==undefined || mailbody==null){
    var mailbody = $('#reply_msg_body_popup'+a).val();
  }
  if(mailbody==undefined || mailbody==null){
    mailbody ='';
  }
  var mailbody1 ='';

  if(mailbody!=''){
  //mailbody1 = StripTags(mailbody);
  }

  //$('.ms_line'+lineID+' .msg_body').html(mailbody1);

  var mail_subject = $('#msg_sub_popup'+lineID).val(); 
  if(mail_subject==undefined || mail_subject==null || mail_subject==''){
    var mail_subject = $('#msg_sub_popup'+a).val(); 
  }

  var msg_id = $('#msg_id_popup'+lineID).val();
  if(msg_id=='' || msg_id==null || msg_id==undefined){
     var msg_id = $('#msg_id_popup'+a).val();
  }

  if($('#cust_email_popup'+lineID).val()!=undefined){
    var cemail= $('#cust_email_popup'+lineID).val().trim();
  }
  else if($('#cust_email_popup'+a).val()!=undefined){
    var cemail = $('#cust_email_popup'+a).val();
  }
  var cust_email1 = new Array(); 
  var newname = new Array();
  cust_email1.push(cemail);
  var obj = {};
  if($('#cust_name_popup'+lineID).val()!=undefined){
    obj[cemail] = $('#cust_name_popup'+lineID).val().trim();
  }
  else if($('#cust_name_popup'+a).val()!=undefined){
    obj[cemail] =$('#cust_name_popup'+a).val();
  }
  var cust_name = new Array();
  cust_name.push(obj);
  cust_name = JSON.stringify(cust_name);


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
    if(localStorage.getItem('draftidspopup'+a)!=undefined && localStorage.getItem('draftidspopup'+a)!=null){
      var getdraftids = JSON.parse(localStorage.getItem('draftidspopup'+a));
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
      async: true,
      dataType : "json",
      success: function(data,status,xhr){
         
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
          $('.ms_line'+pmid+ ' p.writer_name:first').html(string);
          
        }
        if(draft!='draft'){
          call_toastr('success', suc,data.response.response.success);
          ssAppendNewThreadinbox(data.response.response.getThreadDetails,'','','');
        }
        else if(draft=='draft' && sendmail=='no' && whereto=='saveToDraftonChange'){
          var check = localStorage.getItem('draftidspopup'+a);
          if(data.response.response.partner_message_text_id && data.response.response.partner_message_id && check==null){
            var pmid = data.response.response.partner_message_text_id;
            var pmi = data.response.response.partner_message_id;
            var draftids = {partner_message_text_id:pmid,partner_message_id:pmi};
            draftids = JSON.stringify(draftids);
            localStorage.setItem('draftidspopup'+a,draftids);
          }             
        }
        else if(draft=='draft' && sendmail=='yes' && whereto=='updateDraftOnChange'){
          $('.draft_progress').hide();
          $('.draft_complete').show();
          $('.draft_progress_popup').hide();
          $('.draft_complete_popup').show();
           $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
          if(data.response.response.message!=undefined && data.response.response.message!=null ){
          var msg  = data.response.response.message;
          }
          else{
          var msg  = data.response.response.success;
          }
          localStorage.removeItem('draftidspopup'+a);
          call_toastr('success', suc,msg);
          ssAppendNewThreadinbox(data.response.response.getThreadDetails,'','','');
        }
      }
      },
      error: function(xhr, status, error){
         //showAlertMessage('Something went wrong','error',am);
      },
      complete:function(){
          $('.draft_progress_popup').hide();
          $('.draft_complete_popup').show();
          $('.draft_progrsess').hide();
          $('.draft_complete').show();
          $('.sssend,.ssdiscard,.ssdraft').removeAttr('disabled');
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
      title = ss_new_msg;
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
      html = html.replace(/controls-recipients-select-/g, 'controls-recipients-select-'+count);

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
            buttonClass: "btn blue sssend",
            click: function () {
              var no = count;
              $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
              OnChangeReply(count,'yes');
              set_reply_msg_reply(no,'draft','','yes',msg_id);
            }
          },
          {
            html: draf,
            buttonClass: "btn ssdraft",
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
            buttonClass: "btn ssdiscard",
            click: function () {
              var no = count;
               $('#dkmod'+no).dockmodal('destroy');
              if(localStorage.getItem('dkmod'+no)!=null && localStorage.getItem('dkmod'+no)!=undefined && localStorage.getItem('dkmod'+no)!=""){
              
                var num = JSON.parse(localStorage.getItem('dkmod'+no));
                var obj = JSON.parse(localStorage.getItem('editdraftids'+num));
                if(obj!=null && obj!=undefined){
                  var ss_msg_id = obj.partner_message_id;
                  localStorage.removeItem('dkmod'+no);                          
                  localStorage.removeItem('editdraftids'+num);
                  OnChangeReply(count,'yes');
                  ss_delete_trash_head(0,ss_msg_id);
                }
              }
             
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
          language:ss_ck_lang_js,
          enterMode: CKEDITOR.ENTER_BR,
          extraPlugins: 'autogrow',
          removePlugins: 'elementspath,resize,magicline',
          startupFocus : false,
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
          var ckeditor = CKEDITOR.instances['cst_textarea'+count];
        ckeditor.dataProcessor.writer.lineBreakChars = '\r\n';
          set_reply_msg_reply(count,'draft','');
          setTimeout(function(){
             console.log('selectcontrolsrecipients');
            console.log(count);
             console.log('selectcontrolsrecipients');
             $('select.controls-recipients-select-'+count).select2();   
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
        title = ss_new_msg;
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
      html = html.replace(/controls-recipients-select-/g, 'controls-recipients-select-'+count);

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
            buttonClass: "btn blue sssend",
            click: function () {
            var no = count;
            $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
              ss_letters_custom_mail(no,'draft','','yes',msg_id);
            }
          },
          {
            html: draf,
            buttonClass: "btn ssdraft",
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
            buttonClass: "btn ssdiscard",
            click: function () {
              var no = count;
               $('#dkmod'+no).dockmodal('destroy');
              var obj = JSON.parse(getdkmodalStorage('dkmod'+no));
              var ss_msg_id = obj.message_id;
              var ss_parent_msg_id =  obj.parent_message_id;
              localStorage.removeItem('dkmod'+no);
              ss_delete_trash_head(parent_message_id,msg_id);
             
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
          language:ss_ck_lang_js,
          enterMode: CKEDITOR.ENTER_BR,
          extraPlugins: 'autogrow',
          removePlugins: 'elementspath,resize,magicline',
          startupFocus : false,
          toolbar:
                [
                  { name: 'colors', items : [ 'TextColor','BGColor' ] },
                  { name: 'basicstyles', items : [ 'Bold','Italic','Underline' ] },
                  { name: 'paragraph', items : [ 'NumberedList','BulletedList','Blockquote'] },
                  { name: 'insert', items : [ 'Image' ] },
                ],
          removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar,About' 
        });
         var ckeditor = CKEDITOR.instances['cst_textarea'+count];
        ckeditor.dataProcessor.writer.lineBreakChars = '\r\n';
        
        CKEDITOR.config.autoGrow_onStartup = true;  
        CKEDITOR.config.coreStyles_bold = { element: 'b', overrides: 'strong' };
        CKEDITOR.config.coreStyles_italic = { element : 'i', overrides : 'em' };
        CKEDITOR.config.sharedSpaces = { top: 'dockeditordkmod'+count };
        $('select.controls-recipients-select-'+count).select2();
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
       html = html.replace(/controls-recipients-select-/g, 'controls-recipients-select-'+count);
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
        title:ss_new_msg,
        open: function(){ add_dkmod_ids('dkmod'+count,count);},
        close: function(){ 
           //ss_letters_custom_mail_new(count,'no','yes');
          $('#parent_main_div > #dkmod'+count).remove(); 
          remove_dkmod_ids('dkmod'+count,count);   
        }, 
        buttons: [
          {
            html: "<i class='icon-check'></i>&nbsp;"+sen,
            buttonClass: "btn blue sssend",
            click: function () {
              var no = count;
              $('.cst_message_body'+no).val(CKEDITOR.instances['cst_textarea'+no].getData());
               OnChangeNew(count,'yes');
              ss_letters_custom_mail_new(no,'yes','yes','');
            }
          },
          {
            html: draf,
            buttonClass: "btn ssdraft",
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
            buttonClass: "btn ssdiscard",
            click: function () {
              var no = count;
              $('#dkmod'+no).dockmodal('destroy');
              var obj = getdkmodalStorage('dkmod'+count);
              ss_delete_trash_head(0,obj);
              localStorage.removeItem('dkmod'+count);
              localStorage.removeItem('editdraftids'+obj);
              OnChangeNew(count,'yes');
              
            }
          }
        ], 
      }); 
        
      //editor start  count  
       $('#dkmod'+count+' #token-input-').focus();

       //$('#cst_textarea'+count).val('<br/><br/>'+staff_signature);
        $('select.controls-recipients-select-'+count).select2();
      var ckeditor = CKEDITOR.instances['cst_textarea'+count];
      if(!ckeditor){  
        CKEDITOR.replace('cst_textarea'+count,{
          uiColor: 'transparent', 
          height:['250px'],
          language:ss_ck_lang_js,
          enterMode: CKEDITOR.ENTER_BR,
          extraPlugins: 'autogrow',
          removePlugins: 'elementspath,resize,magicline',
          startupFocus : false,
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
           ss_letters_custom_mail_new(count,'no','no');
           $('#dkmod'+count+' #token-input-').focus();
          $('#dkmod'+count).parent().prev('div').children('.action-close').click(function(){
            var obj = getdkmodalStorage('dkmod'+count);
            localStorage.removeItem('dkmod'+count);
            localStorage.removeItem('editdraftids'+obj);
          });
           var ckeditor = CKEDITOR.instances['cst_textarea'+count];
        ckeditor.dataProcessor.writer.lineBreakChars = '\r\n';
          setTimeout(function(){
           
            $('#dockeditordkmod'+count).after('<i class="icon-circle draft_progress_new" style="float:right;color:#d23f31;margin-top: 12px;display:none"></i><i class="icon-ok draft_complete_new" style="display:block;float:right;color:green;margin-top: 12px;"></i>');
          },1500);
          if(from!='draft'){
            ss_letters_custom_mail_new(count,'no','no');
          }
           $('#dkmod'+count+' #token-input-').focus();
          CKEDITOR.instances['cst_textarea'+count].on('change', function(e) {
              OnChangeNew(count);      
              setFormdataStorage(count);
          });
           $('.subject_input'+count).on('keyup',function(){
             OnChangeNew(count);
          });
           $('select.controls-recipients-select-'+count).on('change',function(){
             OnChangeNew(count);
          });
        });
       
        //hide toolbar in mobile screen
        if($(window).width() < 480){
          $('#dockeditordkmod'+count).hide();
        } 
      }
      if(staff_signature!=''){
       CKEDITOR.instances['cst_textarea'+count].setData('<div><br><br></div>'+staff_signature);
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
               var total_params = {
                token:token,
                partner_id:partner_id,
                login_id:login_id
              };
              $.ajax({
                type: 'POST',
                url: APISERVER+'/api/partners/getPartnerContactDetailsByLoginId.json',
                data: total_params,
                async: false,
                dataType : "json",
                success: function(data,status,xhr){
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
             
                },
                error: function(xhr, status, error){
                   //showAlertMessage('Something went wrong','error',am);
                },
              });


              
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
          
        }
        if(callagain=='callagain'){
           setTimeout(function(){getInboxCountApi();},1000);
        }
      },
      error: function(xhr, status, error){
        //return '';                  
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


  var total_params = {
    token:token,
    partner_id:partner_id,
    direction:'DESC',
    limit:10,
    read:1,
    staffer_id:staffer_id
  };

  var params = $.extend({}, doAjax_params_default);
  params['url'] = APISERVER+'/api/Customers/getAllCustomers.json';
  params['data'] = total_params;
  params['completeCallbackFunction'] = function (){
  }

  params['successCallbackFunction'] = function (complet_data){
    if(complet_data.response.status == 'success'){
      var ccaction = $('#caction').val();
      UpdatePartnerMessageHtml(data.response.response.list);
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
    else if(complet_data.response.status == 'error'){
      return;
    }
  }
  doAjax(params);
  return;
  
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
  var view_all = '<a class="view_all" style="border: none !important;border: none !important;float: right;padding: 0 !important;color:#5b9bd1;line-height: 1" href="'+base_url+'communication/inbox">'+vie+'</a>';
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
      if(initial1=='<' || initial1=='>'){
        initial1='';
      }
      if(initial2=='>' || initial2=='<'){
        initial2='';
      }
      var PartnerMessageid = htmldata[key].PartnerMessage.id;
      var PartnerMessageparentid = htmldata[key].PartnerMessage.parent_message_id;
      console.log(htmldata);
      if(PartnerMessageparentid!=0){
        PartnerMessageid = PartnerMessageparentid;
      }
      if(PartnerMessageparentid==0){
        PartnerMessageparentid = PartnerMessageid;
      }
      var first = '';
      var second = '';
      var onearr = '';

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
      var pname = ppname;
      pname = pname.split(" ");
      pname = pname[0];
      var issadmin = $('#IsAdmin').val();
      if(first==pname){
        if(issadmin!='Y'){
          first = mee;
        } 
      
      }
      if(second==pname){
        if(issadmin!='Y'){
          second = mee;
        } 
      
      }
      if(htmldata[key].thread > 1){
       sName =first+", "+second;
      }
      else{
        sName = first;
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

        html += '<td class="border_box_top span10 ms_line'+PartnerMessageid+'" onclick="show_msg_body('+PartnerMessageid+','+PartnerMessageid+');">'; 
          html += '<table><tr class="" style=""><td class="border_box_last" style="border:none;padding:0" ><div class="span12">'; 
            var isdrafttext ='';
            if(htmldata[key].hasdraft!=0){
              isdrafttext = '<span style="color:#d23f31">,'+draf+'</span>';
            }
            html += '<div class="span3" style="">';
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
            html += '<div class="span9 msg_main">';
              html += '<span class="msg_sub">';
                html += StripTags(htmldata[key].PartnerMessageText.subject);
              html += '</span>';
            
              html += '&nbsp;-&nbsp;';

              html += '<span class="msg_body">';
                html += StripTags(decodeEntities(htmldata[key].PartnerMessageText.message));
              html += '</span>';
            html += '</div>';
          html += '</div></td></tr></table>';
        html += '</td>';

        html += '<td class="border_box span2" style="cursor: default;">';
          html += '<div class="msg_menu_right msg_menu_right'+PartnerMessageid+'" style="text-align: right; margin-right: 20px; display: none; ">';
            
            html += '<a class="round_btn_icon btn icn-only" href="javascript:;"  onclick="set_custom_reply('+PartnerMessageid+','+PartnerMessageid+',this);" data-title="Compose mail" data-toggle="tooltip" data-placement="top" title="'+rep+'"><i class="icon-reply" style=""></i></a>';
            html += '<a class="round_btn_icon btn icn-only" onclick="delete_letter_email('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="Delete" ><i class="icon-trash" style=""></i></a>';

            html += '<a class="round_btn_icon btn icn-only" onclick="mark_as_compincomp('+PartnerMessageid+',\'\',\'complete\','+PartnerMessageparentid+')" data-toggle="tooltip" data-placement="top" title="'+mrkcmp+'" ><i class="check-new" style=""></i></a>';


            html += '<div class="btn-group btn-ell pull-right" id="right-btn-ellipsis-'+PartnerMessageid+'" style="">';
              html += '<span data-close-others="true" data-delay="100" data-toggle="dropdown"><a style="margin: 0px 2px;" class="round_btn_icon btn icn-only" onclick="set_dropdown(event,'+PartnerMessageid+');"><i class="icon-ellipsis-vertical right-btn-icon-'+PartnerMessageid+'"></i></a></span>';
              html += '<ul role="menu" class="dropdown-menu pull-right" style="text-align: left;">';
              
                html += '<li><a class="" href="javascript:;" style="text-decoration:none;" onclick="set_custom_reply('+PartnerMessageid+','+PartnerMessageid+',this);"><i class="icon-reply" style="color:#000000"></i>&nbsp;'+rep+'</a></li>';
                html += '<li><a class="round_btn_icon btn icn-only" onclick="ss_show_dkmodal_for_forward_last('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="'+fwd+'" ><i class="icon-arrow-right" style=""></i>&nbsp;'+fwd+'</i></a></li>';
                html += '<li><a class="" onclick="delete_letter_email('+PartnerMessageid+');"><i class="icon-trash" style="color:#000000"></i>&nbsp;'+del+'</a></li>';
                if(htmldata[key].PartnerMessage.read==0){
                 html += '<li id="toggle_read_'+PartnerMessageid+'"><a class="" onclick="mark_as_unread('+PartnerMessageid+',\'makeread\');"><i class="icon-envelope-open-o" style="color:#000000"></i>&nbsp;'+mrksrd+'</a></li>';
                }
                else{
                  html += '<li id="toggle_read_'+PartnerMessageid+'"><a class="" onclick="mark_as_unread('+PartnerMessageid+',\'makeunread\');"><i class="icon-envelope-o" style="color:#000000"></i>&nbsp;'+mrksurd+'</a></li>';
                }
                // html += '<li class="divider"></li>';

                // html += '<li><a><strong>'+mtf+'</strong></a></li>';

                // html += '<li><a ><i class="icon-folder-close" style="color:#000000"></i>'+fol+'1</a></li>';

                // html += '<li><a ><i class="icon-folder-close" style="color:#000000"></i>'+fol+'2</a></li>';

                // html += '<li><a ><i class="icon-folder-close" style="color:#000000"></i>'+fol+'3</a></li>';

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
            html += '<a class="round_btn_icon btn icn-only" onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+stext_id+','+smsg_id+',\'all\');" data-toggle="tooltip" data-placement="top" title="'+rep+'" ><i class="icon-reply" style=""></i></a>';

             html += '<a class="round_btn_icon btn icn-only" onclick="ss_show_dkmodal_for_forward_last('+PartnerMessageid+','+stext_id+','+smsg_id+',\'all\');" data-toggle="tooltip" data-placement="top" title="'+fwd+'" ><i class="icon-arrow-right" style=""></i></a>';

              html += '<a class="round_btn_icon btn icn-only" onclick="delete_letter_email('+PartnerMessageid+');" data-toggle="tooltip" data-placement="top" title="'+del+'"><i class="icon-trash" style=""></i></a>';

               html += '<a class="round_btn_icon btn icn-only" onclick="mark_as_compincomp('+PartnerMessageid+',\'\',\'complete\','+PartnerMessageparentid+')" data-toggle="tooltip" data-placement="top" title="'+mrkcmp+'"><i class="check-new" style=""></i></a>';

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
                        html += '<li><a onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-reply reply-btn"></i>&nbsp;'+rep+'</a></li>';
                        html += '<li><a onclick="ss_show_dkmodal_for_forward_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-arrow-right reply-btn"></i>&nbsp;'+fwd+'</a></li>';
                        html += '<li><a onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+er+'</a></li>';
                        html += '<li><a onclick="ss_show_dkmodal_for_reply_last('+PartnerMessageid+','+PartnerMessageid+');"><i class="icon-pencil"></i>&nbsp;'+es+'</a></li>';
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
                          html += '<button class="btn blue sssend" style="float:left; margin-right:5px;" onclick=\'set_reply_msg('+PartnerMessageid+',\"draft\",\"\",\"yes\");\'><i class="icon-check"></i>&nbsp;'+sen+'</button>';

                          html += '<button class="btn red ssdiscard" style="float:left; margin-right:5px;" onclick="reply_body_msg_hide_tpl('+PartnerMessageid+');">'+dis+'</button>';
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
                            if(htmldata[0].PartnerMessage.sender!='customer'){
                              html += '<input id="reply_from_'+PartnerMessageid+'" type="hidden" value="'+htmldata[0].PartnerMessage.source_from+'" name="reply_from_'+PartnerMessageid+'">';
                            }
                            else{
                               html += '<input id="reply_from_'+PartnerMessageid+'" type="hidden" value="'+htmldata[0].PartnerMessage.email+'" name="reply_from_'+PartnerMessageid+'">';
                            }
                            html += '<input id="group_'+PartnerMessageid+'" type="hidden" value="'+htmldata[0].PartnerMessage.group_id+'" name="group_'+PartnerMessageid+'">';
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
   console.log('AppendNewThread');
  console.log(htmldata);
   console.log('AppendNewThread');
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
  var initial1 = ''; var initial2 = '';
  if(source_from!=undefined && source_from!=null && source_from!=''){
    var n = source_from.trim().split(" ");
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
      var arr = '';
        for(i = 0; i < htmldata.PartnerMessageAttachment.length; ++i) {
            if(i==0){
              arr += decodeURIComponent(htmldata.PartnerMessageAttachment[i].file_name);
            }else{
              arr += ','+decodeURIComponent(htmldata.PartnerMessageAttachment[i].file_name);
            }

          }
          arr  = encodeURIComponent(arr);
          var cr = $('#crouter_url').val();
          var pid = parseInt($('#partner_id').val().trim());
          pid =  btoa(pid);
          var urll = cr+'app/webroot/view_file.php?partner_id='+pid+'&from=zip&all='+arr;
          jstext += '<div class="margin-bottom-15">';
          jstext += '<span>'+htmldata.PartnerMessageAttachment.length+ssattach+'</span>';
          jstext += '<a style="cursor:pointer" target="_blank" href="'+urll+'">'+ssattachall+'</a>';
          jstext += '</div>';
     } 
    for(i = 0; i < htmldata.PartnerMessageAttachment.length; ++i) { 
        var spid = $('#partner_id').val();
        var path = crouter_url+'app/webroot/view_file.php?url='+htmldata.PartnerMessageAttachment[i].urlencode+'&size='+htmldata.PartnerMessageAttachment[i].size+'&partner_id='+btoa(spid);

        var extension =  htmldata.PartnerMessageAttachment[i].extension;
        var ext = extension.toUpperCase();
        var orig_name = htmldata.PartnerMessageAttachment[i].orig_name_wt_ext;
        var thurl  = htmldata.PartnerMessageAttachment[i].thumbnail_url;
        if(thurl==undefined || thurl==null || thurl==''){
          var thurl  = htmldata.PartnerMessageAttachment[i].file_path;
        }
        var file_path = htmldata.PartnerMessageAttachment[i].file_path;
        var size = formatFileSize(htmldata.PartnerMessageAttachment[i].size);
       if((extension == 'jpg') || (extension == 'png') || (extension == 'gif') || (extension == 'jpeg')){
        jstext += '<div class="aZo" id="cst_files_'+extension+'_'+i+'" role="presentation" style="padding: 10px 0px;">';
          jstext += '<div class="files">';
            jstext += '<div class="at_block onthishover" onmouseover="showlinks(this)" onmouseout="hidelinks(this)">';
            //  jstext += '<table><tbody>';
                //jstext += '<tr class="template-download fade in">';
                  //jstext += '<td>';
                    jstext += '<a id="aSH_'+i+'" data-fancybox title="'+htmldata.PartnerMessageAttachment[i].orig_name+'" href="'+file_path+'" data-rel="" class=" kY">';
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
                      jstext += '<img src="'+crouter_url+'>app/webroot/img/file-icon/icon_doc.png" alt="icon"><span style="padding-left: 10px;">'+ext+'</span></div>';
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
  var parent_id_thread = htmldata.PartnerMessage.parent_message_id;
   var otherids = htmldata.otherids;

  for(var j in otherids){
    if(otherids[j]!=null && otherids[j]!=undefined && otherids[j]!=null){
      if($('.dockmodal #messageclick'+otherids[j]).length!=0){
        $('.dockmodal #messageclick'+otherids[j]).find('div.reply-msg').before(jstext); 
        break;
      }
    }
  }
    // if(isinbox=='noinbox'){
    //   if($('#mgs_sub_list_row0'+parent_id_thread+parent_id_thread).length!=0){
    //    // if(parent_id_thread!=0){
    //        $('#messageclick'+parent_id_thread+' .reply-msg').before(jstext);
    //     // }
    //     // else{
    //     //    $('#messageclick'++' .reply-msg').before(jstext);
    //     // }
       
    //      fancyAdjust1();
    //      setTimeout(function(){
    //       fancyAdjust1();
    //     },500);
    //     return;
    //   }
    //   else{
      //   return;
     // }
    // }
  fancyAdjust1();

  if($('#messageclick #mgs_sub_list_row0'+parent_id_thread+parent_id_thread).length!=0){
    $('#messageclick .reply-msg').before(jstext);
    
  }
 
  
  

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
  var ndname = htmldata.PartnerMessage.email;
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
  $('#last_msg_text_id_'+id+'_'+msg_id).val(text_id);
  c_count_main = parseInt($('.ms_m'+id+' .c_count_main').text());
  c_count_main = c_count_main + 1;
  $('.ms_m'+id+' .c_count_main').text(c_count_main);

  var new_length = parseInt($('#msg_bd_'+id).find('div.mgs_sub_list:not(.c_count)').length);

  var source_from_last = htmldata.first.split(" ");
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
      fancyAdjust1();
      setTimeout(function(){
        fancyAdjust1();
      },500);
}
var timeouts2 = [];
function OnChangeNew(count,remove=''){
  $('.draft_progress_new').show();
  $('.draft_complete_new').hide();
  $('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
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
  $('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
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
  $('.sssend,.ssdiscard,.ssdraft').attr('disabled','disabled');
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

    }, 500)
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
        navigator.serviceWorker.ready
      .then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
      }))
        .then(subscription => {
      var key = subscription.getKey('p256dh');
      var token = subscription.getKey('auth');
      key =  btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
      token =  btoa(String.fromCharCode.apply(null, new Uint8Array(token)));
      var ptoken = token;
      var staffer_id = $('#staffer_id').val();
      if(staffer_id==undefined || staffer_id==''){
        staffer_id = 0;
      }
     
      var token = $('#token').val();
    
      var partner_id = $('#partner_id').val();
      var APISERVER  = $('#APISERVER').val();
      var ep = subscription.endpoint;
      var params = { token:token, partner_id:partner_id,key:key,endpoint:ep,staffer_id:staffer_id,ptoken:ptoken };
      $.ajax({
        type: 'POST',
        url: APISERVER+'/api/PartnerMessages/addpush.json',
        dataType: 'json',
        data:params ,
        async: false,       
        success: function( data, textStatus, jQxhr ){;
        },
        error: function( jqXhr, textStatus, errorThrown ){
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
      var key = subscription.getKey('p256dh');
      var token = subscription.getKey('auth');
      key =  btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
      token =  btoa(String.fromCharCode.apply(null, new Uint8Array(token)));
      var ptoken = token;
      var staffer_id = $('#staffer_id').val();
      if(staffer_id==undefined || staffer_id==''){
        staffer_id = 0;
      }
      var APISERVER = $('#APISERVER').val();
      var token = $('#token').val();
    
      var partner_id = $('#partner_id').val();
      var ep = subscription.endpoint;
      var params = { token:token, partner_id:partner_id,key:key,endpoint:ep,staffer_id:staffer_id,ptoken:ptoken };
      $.ajax({
        type: 'POST',
        url: APISERVER+'/api/PartnerMessages/addpush.json',
        dataType: 'json',
        data:params ,
        async: true,       
        success: function( data, textStatus, jQxhr ){
        },
        error: function( jqXhr, textStatus, errorThrown ){
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


function fancyAdjust1(){
  $("[data-fancybox]").fancybox({
    buttons : [
            'fullScreen',
            'close'
        ],
    lang : 'en',
      i18n : {
          'en' : {
              ERROR       : 'No preview available',
              DOWNLOAD    : 'Download',
              SHARE       : 'Share'
        },
      }
  });
}
function showlinks(a){
  $(a).find('div.showthiss').css('opacity',1);
  $(a).find('.hoverimage').css('opacity',0.3);
  $(a).attr('style',' transition: .5s ease;background:rgba(0,0,0,.5);');

}
function hidelinks(a){
  $(a).find('div.showthiss').css('opacity',0);
  $(a).find('.hoverimage').css('opacity',1);
  $(a).removeAttr('style');
}

function delete_file(a,id){
    $(a).parent().parent().remove();
    server_script = $(a).attr('data-url')+'&admin_id=1';
    $.ajax({
      type: 'DELETE',
      url: server_script,
      async: false,
      dataType : "json",
      success: function(data,status,xhr){
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
      },
      error: function(xhr, status, error){
        //hideProcessingImage();
        return '';
      }
  });



   


}
$(document).ready(function(){
  if(localStorage.getItem('ss_message_click_a')!=null && localStorage.getItem('ss_message_click_a')!=undefined && localStorage.getItem('ss_message_click_a')!=''){
    var ss_message_click_a = JSON.parse(localStorage.getItem('ss_message_click_a'));
    for(var j in ss_message_click_a){
      if(ss_message_click_a[j].modalstate=='minimized'){
        var modalstate = 'minimized';
      }
      else{
         var modalstate = '';
      }
      ss_message_click_2(ss_message_click_a[j].parent_id,ss_message_click_a[j].message_id,modalstate);
    }
  }
});

 
function formatFileSize(bytes) {
    if (typeof bytes !== 'number') {
      return '';
    }
    if (bytes >= 1000000000) {
      return (bytes / 1000000000).toFixed(2) + ' GB';
    }
    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(2) + ' MB';
    }
    return (bytes / 1000).toFixed(2) + ' KB';
  }

  
  function setCustomerListStorage(cname, cvalue){
    localStorage.setItem(""+cname+"",""+cvalue+"");
  }
  
  function getCustomerListStorage(cname){
    return localStorage.getItem(cname);
  } 

  function add_dkmod_ids(id,count){
    setdkmodalStorage('counter',parseInt(count) + 1);
    var val_ar =  getdkmodalStorage('dkmod_ids');
    if(!val_ar){
      setdkmodalStorage('dkmod_ids',id);
    }
    else{
      //for adding
      var id_array = val_ar.split(',');
      id_array.push(id);
      setdkmodalStorage('dkmod_ids',id_array);
    }
    
  }
  function remove_dkmod_ids(id,count){
    var val_ar = getdkmodalStorage('dkmod_ids');
    var id_array = val_ar.split(',');
    //array remove element code
    var new_data = [];
    $.each(id_array, function( index, value ) {
      if(id != value){
      new_data.push(value);
      }
    });
    //
    setdkmodalStorage('dkmod_ids',new_data);
    if(new_data.length == 0){
      setdkmodalStorage('counter',0);
    }
    //clear formdata stoarage 
    localStorage.removeItem('formdata'+count);
    
    //clear modalstate
    localStorage.removeItem('modalstate'+count);
    
    //Destroy CKeditor
    if (CKEDITOR.instances['cst_textarea'+count]){
      CKEDITOR.instances['cst_textarea'+count].destroy();
    }
  }
  
  function show_dkmodal_for_forward_all(frmid,msg_id){
    //generateDockmodal and get modal no
    var modal = generateDockmodal();

    //get sub thread details  
      var APISERVER = $('#APISERVER').val();
      var token = $('#token').val();
      var language = $('#language').val();
      var lang = $('#lang').val();
      var partner_id = $('#partner_id').val();
      var from_partner = $('#from_partner').val();
      var alert_message = $('#alert_message_id').val();
      var crouter_url = $('#crouter_url').val();
      var c_fwd = $('#c_fwd').val();
      
      var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&msg_id='+msg_id+'&for_all=for_all';
      
      var data = passProdRequest(APISERVER+'/api/PartnerMessages/subMsgThreadDetails.json',total_params);
      if(data == undefined){
        var json_data = $('#json_data').val();
        var data = JSON.parse(json_data);
        data.response.status = is_undefined(data.response.status);
  
        if(data.response.status == 'success'){
          var tp = '';              
          var at = '';  
          var msl = ''; 
          var msg_sub = $('#msg_sub_'+frmid).val();
          var cust_name = $('#cust_name_'+frmid).val();
          var cust_email = $('#cust_email_'+frmid).val();   
          $.each(data.response['response'], function( index, value ) {
            tp = '';              
            at = '';
            tp += '<div>'+value.pmt['message']+'</div>';
            if(value.pma){
              $('.attachments_cst'+modal).val(JSON.stringify(value.pma));
              $.each(value.pma, function( i, va ) {
                var show_name='';
                var file_type_name = getFileDetailsParam(va.file_name);
                  file_type_name = file_type_name ? file_type_name : 'text';
                if(va.file_name.length > 30){
                  show_name = va.file_name.substr(0,25)+'...';
                }
                else{
                  show_name = va.file_name;
                }
                at += '<div class="at_block" id="pre_msg_attachment_row'+modal+''+i+'"><table><tr class="template-download fade in">';
                var apath = crouter_url+'view_file.php?url='+va.urlencode+'&size='+va.size;
                if(typeof va.thumbnail_url !== 'undefined' && va.thumbnail_url !== null ){ 
                    at += "<td><a class='kY' data-rel='fancybox-button' href='"+va.file_path+"'  title='"+va.file_name+"' >";
                    at +='<img src="'+va.thumbnail_url+'" style="width:100%; height:100%;"></a>';
                    at += "<input type='hidden' name='old_msg_attachment[]' class='old_msg_attachment"+i+"'  id='old_msg_attachment"+modal+""+i+"' value='"+JSON.stringify(va)+"'>";
                    at += '<button class="btn mini remv-at" data-type="" data-url="" onclick="event.preventDefault(); delete_modal_msg_pre_attachment('+modal+','+i+');"><i class="icon-remove"></i></button></td>';
                  }
                  else{
                    at += "<td><a class='kY' data-rel='fancybox-button' title='"+va.file_name+"' href='"+va.file_path+"' >";
                    
                    at += '<div style="padding: 5px; word-wrap: break-word; height:75%;"><span>'+show_name+'</span></div>';
                    at += '<div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_'+file_type_name.toLowerCase()+'.png" alt="icon"><span style="padding-left: 10px;">'+file_type_name+'</span></div></a>';
                    
                    at += "<input type='hidden' name='old_msg_attachment[]' class='old_msg_attachment"+modal+"' id='old_msg_attachment"+modal+""+i+"'  value='"+JSON.stringify(va)+"'>";
                    at += '<button class="btn mini remv-at" data-type="" data-url="" onclick="event.preventDefault(); delete_modal_msg_pre_attachment('+modal+','+i+');"><i class="icon-remove"></i></button></td>';
                  }
                at += '</tr></table></div>';
              }); 
            }
            //forward msg header text start
            var txt = "---------- Forwarded message ----------</br>";
              txt += from_partner;
              txt += "On: "+value.pmt.time_text+"<br>";
              txt += "Subject: "+c_fwd+' '+msg_sub+"<br>";
              txt += "To: "+cust_name+" < "+cust_email+" ><br>";
            //forward msg header text end
            msl += txt+'<br>'+tp+'<br><hr>';
          }); 
          var textheader  ='<br><b>Forwarded conversation</b><br> Subject: <b>'+data.response['response'][0].pmt['subject']+'</b><br><br>';
          CKEDITOR.instances['cst_textarea'+modal].setData(textheader+''+msl);
          $('.cst_files'+modal+' > .files').html(at); 
          
          
        }else if(data.response.status == 'error'){
          if(data.response.response.error == 'validationErrors'){
            var mt_arr = data.response.response.list;
            var array = $.map(mt_arr, function(value, index) {
              return value+'<br />';
            });
            showAlertMessage(array,'error',''+alert_message+'');
            return;
          }else{
            showAlertMessage(data.response.response.msg,'error',''+alert_message+'');
            return;
          } 
        }
      } 
    //sub thread details ends here

    $(".subject_input"+modal).val(msg_sub);
    
  }
  
  function delete_modal_msg_pre_attachment(modal,row){
    data = JSON.parse($('#old_msg_attachment'+modal+''+row).val());
    json_arr = $('.attachments_cst'+modal).val();
    file_path = data.file_path;
    arr = JSON.parse(json_arr);
    var j_arr = removeItem(arr, 'file_path', file_path);
    $('.attachments_cst'+modal).val(JSON.stringify(j_arr));
    $('#pre_msg_attachment_row'+modal+''+row).remove();
    //set form data after delete
    setFormdataStorage(modal);
  }
  
  function show_dkmodal_for_forward_last(id,msg_id){
    var ftextID = $('#last_msg_text_id_'+id+'_'+msg_id).val();
    show_dkmodal_for_forward(id,ftextID,msg_id);
  }

  function show_dkmodal_for_reply_last(id,msg_id){
    var ftextID = $('#last_msg_text_id_'+id+'_'+msg_id).val();
    show_dkmodal_for_reply(id,ftextID,msg_id);
  }

  function ss_show_dkmodal_for_reply_last(partner_message_id){
    var partner_id = $('#partner_id').val();
    var APISERVER = $('#APISERVER').val();
    var admin_id = $('#admin_id').val();
    var token = $('#token').val();
    var lang = $('#lang').val();
    var language = $('#language').val();
    var params  = {
      partner_message_id:partner_message_id,
      partner_id:partner_id,
      admin_id:admin_id,
      token:token,
      lang:lang,
      language:language
    }
    $.ajax({
          type: 'POST',
          url: APISERVER+'/api/PartnerMessages/getLastCommId.json',
          dataType: 'json',
          data:params ,
          async: false,       
          success: function( data, textStatus, jQxhr ){
              if(data.response.status == 'success'){
                var res = data.response.response;
                show_dkmodal_for_reply(partner_message_id,res.partner_message_text_id,res.partner_message_id);
              }
          },
          error: function( jqXhr, textStatus, errorThrown ){
              
          }
      });
    
  }

  
  function ss_show_dkmodal_for_forward_last(partner_message_id){
    var partner_id = $('#partner_id').val();
     var APISERVER = $('#APISERVER').val();
     var admin_id = $('#admin_id').val();
    var params  = {
      partner_message_id:partner_message_id,
      partner_id:partner_id,
      admin_id:admin_id,

    }
    $.ajax({
          type: 'POST',
          url: APISERVER+'/api/PartnerMessages/getLastCommId.json',
          dataType: 'json',
          data:params ,
          async: false,       
          success: function( data, textStatus, jQxhr ){
              if(data.response.status == 'success'){
                var res = data.response.response;
                show_dkmodal_for_forward(partner_message_id,res.partner_message_text_id,res.partner_message_id);
              }
          },
          error: function( jqXhr, textStatus, errorThrown ){
              
          }
      });
    
  }


  function show_dkmodal_for_forward(frmid,text_id,msg_id,from=''){
    var modal = generateDockmodalNew();
    //var text_id = $('#last_msg_text_id_'+frmid+'_'+msg_id).val();
      
    //get sub thread details  
      var APISERVER = $('#APISERVER').val();
      var token = $('#token').val();
      var language = $('#language').val();
      var lang = $('#lang').val();
      var partner_id = $('#partner_id').val();
      var replied_from = $('#reply_from_'+frmid).val();
      if(replied_from != '')
        var from_partner = replied_from;
      else
        var from_partner = $('#from_partner').val();
      
      var alert_message = $('#alert_message_id').val();
      var crouter_url = $('#crouter_url').val();
      var c_fwd = $('#c_fwd').val();
      
      var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&msg_id='+msg_id+'&text_id='+text_id;
      
      var data = passProdRequest(APISERVER+'/api/PartnerMessages/subMsgThreadDetails.json',total_params);
      if(data == undefined){
        var json_data = $('#json_data').val();
        var data = JSON.parse(json_data);
        data.response.status = is_undefined(data.response.status);
        if(data.response.status == 'success'){
          var tp = '';        
          var bt = '';        
          var at = '';    
            var cust_id ='';
          var cust_con_id='';
          var cust_name ='';
          var cid = '';
          var msg_sub  = '';
          var reply_from  = '';
          
          var cust_email =  '';
                      
          $.each(data.response['response'], function( index, value ) {;
            var message = value.pmt['message'];
            //message = decodeEntities(message);
              message = message.split('sarthak@123+_*&^%~');
              text_message = message[0];
              if(value.pm['sender']!='customer'){
                from_partner = value.pm['source_from'];
              }
              else{
                from_partner = value.pm['email'];
              }
            
            tp += '<div>'+text_message+'</div>';
            if(value.pma){
              $('.attachments_cst'+modal).val(JSON.stringify(value.pma));
              $.each(value.pma, function( i, va ) {
                var show_name='';
                var file_type_name = getFileDetailsParam(va.file_name);
                  file_type_name = file_type_name ? file_type_name : 'text';
                if(va.file_name.length > 30){
                  show_name = va.file_name.substr(0,25)+'...';
                }
                else{
                  show_name = va.file_name;
                }
              at += '<div class="at_block" id="pre_msg_attachment_row'+modal+''+i+'"><table><tr class="template-download fade in">';
              var apath = crouter_url+'view_file.php?url='+va.urlencode+'&size='+va.size;
              if(typeof va.thumbnail_url !== 'undefined' && va.thumbnail_url !== null ){ 
                  at += "<td><a class='kY' data-fancybox href='"+va.file_path+"' title='"+va.file_name+"' >";
                  at +='<img src="'+va.thumbnail_url+'" style="width:100%; height:100%;"></a>';
                  at += "<input type='hidden' name='old_msg_attachment[]' class='old_msg_attachment"+i+"'  id='old_msg_attachment"+modal+""+i+"' value='"+JSON.stringify(va)+"'>";
                  at += '<button class="btn mini remv-at" data-type="" data-url="" onclick="event.preventDefault(); delete_modal_msg_pre_attachment('+modal+','+i+');"><i class="icon-remove"></i></button></td>';
                }
                else{
                  at += "<td><a class='kY' data-fancybox title='"+va.file_name+"' href='"+va.file_path+"' >";
                  
                  at += '<div style="padding: 5px; word-wrap: break-word; height:75%;"><span>'+show_name+'</span></div>';
                  at += '<div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_'+file_type_name.toLowerCase()+'.png" alt="icon"><span style="padding-left: 10px;">'+file_type_name+'</span></div></a>';
                              
                  at += "<input type='hidden' name='old_msg_attachment[]' class='old_msg_attachment"+modal+"' id='old_msg_attachment"+modal+""+i+"'  value='"+JSON.stringify(va)+"'>";
                  at += '<button class="btn mini remv-at" data-type="" data-url="" onclick="event.preventDefault(); delete_modal_msg_pre_attachment('+modal+','+i+');"><i class="icon-remove"></i></button></td>';
                }
              at += '</tr></table></div>';
              
              }); 
            }
             parent_msg_id = value.pm['parent_message_id'];
          if(parent_msg_id == 0)
            parent_msg_id = value.pm['id'];
            cust_con_id = value.pm['contact_id'];
            cust_id = value.pm['customer_id'];
            cust_email = value.pm['source_from'];
            cust_name =  value.pm['source_from'];
            if(cust_email.indexOf("<")==0){
              cust_name = cust_name.replace("<","");
              cust_name = cust_name.replace(">","");
              cust_email = cust_name;
              cust_name = cust_name.trim().split("@");
              cust_name = cust_name[0].trim();
            }
            else{
              cust_name = cust_name.trim().replace("<","&nbsp;");
              cust_name = cust_name.replace(">","&nbsp;").trim();
              cust_name = cust_name.split("&nbsp;");
              cust_email = cust_name[1].trim();
              cust_name = cust_name[0].trim();
            }
          
            if(value.Customer['name'].trim()!=''){
              cust_name = value.Customer['name'].trim();
            } 
            if(value.Customer['email'].trim()!=''){
              cust_email = value.Customer['email'].trim();
            }
            cust_name = ''; 
            if(value.Customer!=undefined && value.Customer!=null){
              if(value.Customer['customer_number']!=undefined && value.Customer['customer_number']!=null){
                  cust_id = value.Customer['customer_number'].trim();
              }
            }
          
            msg_sub = value.pmt['subject'];
          }); 
          
          var txt = '';
          if(staff_signature!=''){
             txt += '<div><br><br></div>'+staff_signature;
          }

          
        //forward msg header text start
        if(from!=''){
          txt += "---------- Forwarded message ----------</br>";
          txt += from_partner;
          txt += "On: "+data.response['response'][0].pmt.time_text+"</br>";
          var c_fwd =$('#c_fwd').val();
          txt += "Subject: "+c_fwd+' '+msg_sub+"<br>";
          txt += "To: "+cust_name+" < "+cust_email+" ></br>";
        }else{
          //txt +='<br><b>Forwarded conversation</b><br> Subject: <b>'+msg_sub+'</b><br><br>';
          txt += "---------- Forwarded message ----------</br>";
          txt += from_partner;
          txt += "On: "+data.response['response'][0].pmt.time_text+"</br>";
          txt += "Subject: "+msg_sub+"</br>";
          txt += "To: "+cust_name+" < "+cust_email+" ></br>";
          
        //forward msg header text end
        }
          if(from!=''){
            
          }
          if(staff_signature!=''){
            CKEDITOR.instances['cst_textarea'+modal].setData(txt+'<br>'+tp);
          }
          else{
            CKEDITOR.instances['cst_textarea'+modal].setData('<br>'+txt+'<br>'+tp);
          }
          
          $('.cst_files'+modal+' > .files').html(at); 
          
          
        }else if(data.response.status == 'error'){
          if(data.response.response.error == 'validationErrors'){
            var mt_arr = data.response.response.list;
            var array = $.map(mt_arr, function(value, index) {
              return value+'<br />';
            });
            showAlertMessage(array,'error',''+alert_message+'');
            return;
          }else{
            showAlertMessage(data.response.response.msg,'error',''+alert_message+'');
            return;
          } 
        }
      } 
    //sub thread details ends here
    //set data start
    $(".subject_input"+modal).val(c_fwd+' '+msg_sub);
     fancyAdjust1();
    //set data end
  }
  
  function show_dkmodal_for_reply(frmid,text_id,msg_id){
    var modal = generateDockmodalNew();
    
    var APISERVER = $('#APISERVER').val();
    var token = $('#token').val();
    var language = $('#language').val();
    var lang = $('#lang').val();
    var partner_id = $('#partner_id').val();
    var replied_from = $('#reply_from_'+frmid).val();
    if(replied_from != '')
      var from_partner = replied_from;
    else
      var from_partner = $('#from_partner').val();
      
    var alert_message = $('#alert_message_id').val();
    var crouter_url = $('#crouter_url').val();
    //var c_wrote = $('#c_wrote').val();
      
    //get sub thread details  
      var parent_msg_id = '';
      var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&msg_id='+msg_id+'&text_id='+text_id;
      
      var data = passProdRequest(APISERVER+'/api/PartnerMessages/subMsgThreadDetails.json',total_params);
      if(data == undefined){
        var json_data = $('#json_data').val();
        var data = JSON.parse(json_data);
        data.response.status = is_undefined(data.response.status);
        if(data.response.status == 'success'){
          var tp = '';        
          var bt = '';

          
          var cust_id ='';
          var cust_con_id='';
          var cust_name ='';
          var cid = '';
          var msg_sub  = '';
          var reply_from  = '';
          var emm = '';
          var cust_email =  '';
                  
          $.each(data.response['response'], function( index, value ) {
            var c_wrote = $('#c_wrote').val();
            from_partner =  value.pm['source_from'];
            var message = value.pmt['message'];
            // if(isHTML(message) == false)
            //  var text_message = message.replace(/\n/g,'<br/>');
            // else
            var text_message = message;
              
            tp += '<div>on '+value.pmt.time_text+' '+from_partner+' '+c_wrote+'</div><div>'+text_message+'</div>';
            //tp += '<blockquote><div><div>on '+value.pmt.time_text+' '+from_partner+' '+c_wrote+'</div><div>'+text_message+'</div></div></blockquote><br>';
            bt += '';
            parent_msg_id = value.pm['parent_message_id'];
            if(parent_msg_id == 0)
              parent_msg_id = value.pm['id'];

            cust_con_id = value.pm['contact_id'];
            cust_id = value.pm['customer_id'];
            
            cust_email = value.pm['source_from'];
            cust_name =  value.pm['source_from'];
            if(cust_email.indexOf("<")==0){
              cust_name = cust_name.replace("<","");
              cust_name = cust_name.replace(">","");
              cust_email = cust_name;
              cust_name = cust_name.trim().split("@");
              cust_name = cust_name[0].trim();
            }
            else{
              cust_name = cust_name.trim().replace("<","&nbsp;");
              cust_name = cust_name.replace(">","&nbsp;").trim();
              cust_name = cust_name.split("&nbsp;");
              cust_email = cust_name[1].trim();
              cust_name = cust_name[0].trim();
            }
            
            if(value.Customer['name'].trim()!=''){
              cust_name = value.Customer['name'].trim();
            } 
            if(value.Customer['email'].trim()!=''){
              cust_email = value.Customer['email'].trim();
            }
            //cust_name = ''; 
            if(value.Customer!=undefined && value.Customer!=null){
              if(value.Customer['customer_number']!=undefined && value.Customer['customer_number']!=null){
                  cust_id = value.Customer['customer_number'].trim();
              }
            }
       
            if(cust_id!='' && cust_con_id!=''){
              emm = cust_id+'##'+cust_con_id+'##'+cust_email;
            }
            else if(cust_id!=''){
              emm = cust_id+'##'+cust_email;
            }
            else{
              emm = '0##'+cust_email;
            }

            msg_sub = value.pmt['subject'];
          }); 
          CKEDITOR.instances['cst_textarea'+modal].setData(tp);
          CKEDITOR.instances['cst_textarea'+modal].on('instanceReady', function(){
            CKEDITOR.instances['cst_textarea'+modal].execCommand('selectAll');
            CKEDITOR.instances['cst_textarea'+modal].execCommand('blockquote'); 
            
            // var editor = CKEDITOR.instances['cst_textarea'+modal];
            // editor.focus();
            // var selection = editor.getSelection();
            // var range = selection.getRanges()[0];
            // var pCon = range.startContainer.getAscendant({p:2},true); //getAscendant('p',true);
            // var newRange = new CKEDITOR.dom.range(range.document);
            // newRange.moveToPosition(pCon, CKEDITOR.POSITION_BEFORE_START);
            // newRange.select();
           $('#frm_modal_msg'+modal+' [name=customer_email]').val(emm);
             CKEDITOR.instances['cst_textarea'+modal].setData('<br/><br/>'+ CKEDITOR.instances['cst_textarea0'].getData());
            
            

          });
        }else if(data.response.status == 'error'){
          if(data.response.response.error == 'validationErrors'){
            var mt_arr = data.response.response.list;
            var array = $.map(mt_arr, function(value, index) {
              return value+'<br />';
            });
            showAlertMessage(array,'error',''+alert_message+'');
            return;
          }else{
            showAlertMessage(data.response.response.msg,'error',''+alert_message+'');
            return;
          } 
        }
      } 
    //sub thread details ends here
      
    //modal text area code start
      
      //set data start
  
      var reply_from = $('#reply_from_'+frmid).val();
      if(reply_from == undefined)
        reply_from = '';
      var from_inbox = $('#from_inbox'+frmid).val();
      if(from_inbox == undefined)
        from_inbox = '';
      var cid = '';
      
        if(cust_name==''){
          $(".customer_email_input"+modal).customtokenInput("add", {id:cid, name: cust_email,email : cust_email});
          $('.token-input-list li:first-child').find('.token-input-delete-token').css('display','none');
        }
        else if(cust_con_id!=undefined && cust_con_id!=null && cust_con_id!='' && cust_id!=undefined && cust_id!=null && cust_id!=''){
          cid = cust_id+'##'+cust_con_id+'##'+cust_email;
          $(".customer_email_input"+modal).customtokenInput("add", {id:cid, name: cust_name,email : cust_email,msg_id:parent_msg_id, reply_from:reply_from, from_inbox : from_inbox});
          $('.token-input-list li:first-child').find('.token-input-delete-token').css('display','none');
        }
        else if(cust_id!=undefined && cust_email!=undefined && cust_id!=''){
            cid = cust_id+'##'+cust_email;
            $(".customer_email_input"+modal).customtokenInput("add", {id:cid, name: cust_name,cemail : cust_email,msg_id:parent_msg_id, reply_from:reply_from, from_inbox : from_inbox});
            $('.token-input-list li:first-child').find('.token-input-delete-token').css('display','none');
            
        }
         else if(cust_email!=undefined){
            cid = '0##'+cust_email;
            $(".customer_email_input"+modal).customtokenInput("add", {id:cid, name: cust_name,cemail : cust_email,msg_id:parent_msg_id, reply_from:reply_from, from_inbox : from_inbox});
            $('.token-input-list li:first-child').find('.token-input-delete-token').css('display','none');
            
        }
      
      $('#frm_modal_msg'+frmid+' [name=customer_email]').val(cust_email);
      $(".subject_input"+modal).val(msg_sub);
    //set data end
    return modal;
  }

  function ss_show_dkmodal_for_editdraft(frmid,text_id,msg_id){
  
    var modal = generateDockmodalNew('draft');
    $('#frm_modal_msg'+modal).find('select.controls-recipients-select-').addClass('controls-recipients-select-'+modal).removeClass('controls-recipients-select-');
     $('#frm_modal_msg'+modal).find('div.controls-recipients-select-').addClass('controls-recipients-select-'+modal).removeClass('controls-recipients-select-');

    var APISERVER = $('#APISERVER').val();
    var token = $('#token').val();
    var language = $('#language').val();
    var lang = $('#lang').val();
    var partner_id = $('#partner_id').val();
    var replied_from = $('#reply_from_'+frmid).val();
    if(replied_from != '')
      var from_partner = replied_from;
    else
      var from_partner = $('#from_partner').val();
      
    var alert_message = $('#alert_message_id').val();
    var crouter_url = $('#crouter_url').val();
    var c_wrote = $('#c_wrote').val();
      
    //get sub thread details  
    var parent_msg_id = '';
    var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&msg_id='+msg_id+'&text_id='+text_id;
    
    var data = passProdRequest(APISERVER+'/api/PartnerMessages/subMsgThreadDetails.json',total_params);
    if(data == undefined){
      var json_data = $('#json_data').val();
      var data = JSON.parse(json_data);
      data.response.status = is_undefined(data.response.status);
      if(data.response.status == 'success'){
        var editdraftids = {};
        var pmid = data.response.response[0].pmt.id;
        var pmi = data.response.response[0].pm.id;
        var editdraftids = {partner_message_text_id:pmid,partner_message_id:pmi,issent:'y'};
        editdraftids = JSON.stringify(editdraftids);
        localStorage.setItem('editdraftids'+pmi,editdraftids);
        localStorage.setItem('dkmod'+modal,pmi);
        var tp = '';        
        var bt = '';
        var at ='';
        var subject ='';  
        var addHtml = ''; 
        var cust_id ='';
        var cust_con_id='';
        var cust_name ='';
        var cid = '';
        var msg_sub  = '';
        var reply_from  = '';
        var from_inbox= '';
        var cust_email =  '';
          var emm = '';
        var draft_to;
        var draft_cc;
        var draft_bcc;
        var to_all_all = [];
        $.each(data.response['response'], function( index, value ) {
     
          cust_con_id = value.pm['contact_id'];
          cust_id = value.pm['customer_id'];
          draft_to = value.pm['draft_to'];
          draft_cc = value.pm['draft_cc'];
          draft_bcc = value.pm['draft_bcc'];
          cust_email = value.pm['email'];
          cust_name =  value.pm['email'];
          if(cust_email.indexOf("<")==0){
            cust_name = cust_name.replace("<","");
            cust_name = cust_name.replace(">","");
            cust_email = cust_name;
            cust_name = cust_name.trim().split("@");
            cust_name = cust_name[0].trim();
          }
          else{
            cust_name = cust_name.trim().replace("<","&nbsp;");
            cust_name = cust_name.replace(">","&nbsp;").trim();
            cust_name = cust_name.split("&nbsp;");
            cust_email = cust_name[1].trim();
            cust_name = cust_name[0].trim();
          } 
          cust_name = '';   
          if(value.Customer['customer_number']!=undefined && value.Customer['customer_number']!='' && value.Customer['customer_number']!=null){
            cust_id = value.Customer['customer_number'].trim();
          }   
          
          
          if(value.Customer['name'].trim()!=''){
            cust_name = value.Customer['name'].trim();
          } 
          if(value.Customer['email'].trim()!=''){
            cust_email = value.Customer['email'].trim();
          }
          cust_name = ''; 
          cust_id = value.Customer['customer_number'].trim();
              
   
          msg_sub = $('#msg_sub_'+frmid).val();
          reply_from = value.pm['source_from'];
          if(reply_from == undefined)
            reply_from = '';
          from_inbox = $('#from_inbox'+frmid).val();
          if(from_inbox == undefined)
            from_inbox = '';
        
          var message = value.pmt['message'];
          subject = value.pmt['subject'];
          if(isHTML(message) == false)
            var text_message = message.replace(/\n/g,'<br/>');
          else
            var text_message = message;
            
          tp += message;
          parent_msg_id = value.pm.parent_message_id;
          if(parent_msg_id == 0)
            parent_msg_id = value.pm.id;
          
          if(value.pma){
            $('.attachments_cst'+modal).val(JSON.stringify(value.pma));
            $.each(value.pma, function( i, va ) {
              var show_name='';
              var file_type_name = getFileDetailsParam(va.file_name);
                file_type_name = file_type_name ? file_type_name : 'text';
              if(va.file_name.length > 30){
                show_name = va.file_name.substr(0,25)+'...';
              }
              else{
                show_name = va.file_name;
              }
              at += '<div class="at_block" id="pre_msg_attachment_row'+modal+''+i+'"><table><tr class="template-download fade in">';
              var apath = crouter_url+'view_file.php?url='+va.urlencode+'&size='+va.size;
              if(typeof va.thumbnail_url !== 'undefined' && va.thumbnail_url !== null ){ 
                  at += "<td><a class='kY' data-rel='fancybox-button' href='"+va.file_path+"' title='"+va.file_name+"' >";
                  at +='<img src="'+va.thumbnail_url+'" style="width:100%; height:100%;"></a>';
                  at += "<input type='hidden' name='old_msg_attachment[]' class='old_msg_attachment"+i+"'  id='old_msg_attachment"+modal+""+i+"' value='"+JSON.stringify(va)+"'>";
                  at += '<button class="btn mini remv-at" data-type="" data-url="" onclick="event.preventDefault(); delete_modal_msg_pre_attachment('+modal+','+i+');"><i class="icon-remove"></i></button></td>';
                }
                else{
                  at += "<td><a class='kY ' data-rel='fancybox-button' title='"+va.file_name+" 'href='"+va.file_path+"' >";
                  
                  at += '<div style="padding: 5px; word-wrap: break-word; height:75%;"><span>'+show_name+'</span></div>';
                  at += '<div style="padding-left: 10px; color: #B18575;"><img src="'+crouter_url+'/img/file-icon/icon_'+file_type_name.toLowerCase()+'.png" alt="icon"><span style="padding-left: 10px;">'+file_type_name+'</span></div></a>';
                  
                  at += "<input type='hidden' name='old_msg_attachment[]' class='old_msg_attachment"+modal+"' id='old_msg_attachment"+modal+""+i+"'  value='"+JSON.stringify(va)+"'>";
                  at += '<button class="btn mini remv-at" data-type="" data-url="" onclick="event.preventDefault(); delete_modal_msg_pre_attachment('+modal+','+i+');"><i class="icon-remove"></i></button></td>';
                }
              at += '</tr></table></div>';
            }); 
          }           
        }); 
     
        $('.cst_files'+modal+' div.files').html(at);
        $(".subject_input"+modal).val(subject);
        CKEDITOR.instances['cst_textarea'+modal].setData(tp);
        if(draft_bcc!=null && draft_bcc!=undefined && draft_bcc!=''){
          var draft_bcc = JSON.parse(draft_bcc);

          for(var b in draft_bcc['email']){
            var bcc_all =   draft_bcc['email'][b].split('##');
            var bcc_cust_id = bcc_all[0];
            var bcc_cust_email = bcc_all[1];
            var obj = {};
            if(bcc_cust_id==0){
              $(".input_bcc"+modal).customtokenInput("add", {id:draft_bcc['email'][b],name:bcc_cust_email,email : bcc_cust_email});
            }
            else{
              for(var j in draft_bcc['name']){
                $.each(draft_bcc['name'][j], function (index, file) { 
                    if(index==bcc_cust_email){
                      obj = {id:draft_bcc['email'][b],customer_id:bcc_cust_id,name:file,email : bcc_cust_email};
                       //$(".input_bcc"+modal).customtokenInput("add", {id:draft_bcc['email'][b],customer_id:bcc_cust_id,name:file,email : bcc_cust_email});
                    }
                });
                if(draft_bcc['num']!=undefined && draft_bcc['num']!=null && draft_bcc['num']!=''){
                  if(draft_bcc['num'][j]!=undefined && draft_bcc['num'][j]!=null && draft_bcc['num'][j]!=''){
                    $.each(draft_bcc['num'][j], function (index, file) { 
                      if(index==bcc_cust_email){
                        if(file!=0 && file!=undefined && file!=null && file!=''){
                          obj.number = file;
                        }
                      }
                    });
                  }
                }
              }
              $(".input_bcc"+modal).customtokenInput("add", obj);
            }
          }
        }

        if(draft_cc!=null && draft_cc!=undefined && draft_cc!=''){
          var draft_cc = JSON.parse(draft_cc);
      
          for(var b in draft_cc['email']){
            var cc_all =   draft_cc['email'][b].split('##');
            var cc_cust_id = cc_all[0];
            var cc_cust_email = cc_all[1];
             var obj = {};
            if(cc_cust_id==0){
              $(".cc_input"+modal).customtokenInput("add", {id:draft_cc['email'][b],name:cc_cust_email,email : cc_cust_email});
            }
            else{
              for(var j in draft_cc['name']){
                $.each(draft_cc['name'][j], function (index, file) { 
                    if(index==cc_cust_email){
                       obj = {id:draft_cc['email'][b],name:file,customer_id:cc_cust_id,email : cc_cust_email};
                    }
                });
                if(draft_cc['num']!=undefined && draft_cc['num']!=null && draft_cc['num']!=''){
                  if(draft_cc['num'][j]!=undefined && draft_cc['num'][j]!=null && draft_cc['num'][j]!=''){
                    $.each(draft_cc['num'][j], function (index, file) { 
                       if(index==cc_cust_email){
                          if(file!=0 && file!=undefined && file!=null && file!=''){
                            obj.number = file;
                          }
                       }
                    });
                  }
                }
              }
              $(".cc_input"+modal).customtokenInput("add",obj );
            }
          }
        }
      
        if(draft_to!=null && draft_to!=undefined && draft_to!=''){
          var draft_to = JSON.parse(draft_to);
          console.log(draft_to);
          if(draft_to['email_distribution']!=undefined && draft_to['email_distribution']!=null && draft_to['email_distribution']!=''){
            $('select.controls-recipients-select-'+modal).val(draft_to['email_distribution']).trigger('change');
          }
          for(var b in draft_to['email']){
            if(draft_to['email'][b].indexOf('##')!=-1){
              var to_all =   draft_to['email'][b].split('##');
              to_all_all.push(draft_to['email'][b]);
            }
            else{
              var to_all = [];
              to_all.push('rem');
              to_all.push(draft_to['email'][b]);
            }           
            var to_cust_id = to_all[0];
            var to_cust_email = to_all[1];
            var obj = {};

            if(to_cust_id==0){
              $(".customer_email_input"+modal).customtokenInput("add", {id:draft_to['email'][b],name:to_cust_email,email : to_cust_email});
            }
            else{

              for(var j in draft_to['name']){
                console.log(draft_to['name'][j]);
                $.each(draft_to['name'][j], function (index, file) { 
                    if(index==to_cust_email){
                      if(to_all[0]=='rem'){
                        obj = {type:'customergroup',id:draft_to['email'][b],customer_id:to_cust_id,name:file,email : '',cname:'Customer Group',};
                      }else{
                      obj = {id:draft_to['email'][b],customer_id:to_cust_id,name:file,email : to_cust_email};
                     }
                    }
                });
                if(draft_to['num']!=undefined && draft_to['num']!=null && draft_to['num']!=''){
                  if(draft_to['num'][j]!=undefined && draft_to['num'][j]!=null && draft_to['num'][j]!=''){
                    $.each(draft_to['num'][j], function (index, file) { 
                       if(index==to_cust_email){
                        if(file!=0 && file!=undefined && file!=null && file!=''){
                          obj.number = file;
                        }
                       }
                    });
                  }
                }
              }

              console.log(obj);
              $(".customer_email_input"+modal).customtokenInput("add",obj );
            }
          }
        }


        // if(cust_name==''){
        //   $(".customer_email_input"+modal).customtokenInput("add", {id:cid, name: cust_email,email : cust_email});
        //   $('.token-input-list li:first-child').find('.token-input-delete-token').css('display','none');
        // }
        // else if(cust_con_id!=undefined && cust_con_id!=null && cust_con_id!=''){
        //   cid = cust_id+'##'+cust_con_id+'##'+cust_email;
        //   $(".customer_email_input"+modal).customtokenInput("add", {id:cid, name: cust_name,email : cust_email,msg_id:parent_msg_id, reply_from:reply_from, from_inbox : from_inbox});
        //   $('.token-input-list li:first-child').find('.token-input-delete-token').css('display','none');
        // }
        // else if(cust_id!=undefined && cust_email!=undefined){
        //     cid = cust_id+'##'+cust_email;
        //     $(".customer_email_input"+modal).customtokenInput("add", {id:cid, name: cust_name,cemail : cust_email,msg_id:parent_msg_id, reply_from:reply_from, from_inbox : from_inbox});
        //     $('.token-input-list li:first-child').find('.token-input-delete-token').css('display','none');
        // }
        if(cust_id!=''){
         // emm = cust_id+'##'+cust_email;
        }
        else{
          //emm = cust_email;
        }
        if(to_all_all!=undefined && to_all_all!=null && to_all_all!=''){
          var len = to_all_all.length
          for(var j in to_all_all){
            if(j!=len){
              emm += to_all_all+',';
            }
            else{
              emm += to_all_all;
            }
          }
        }
        
        //$('#frm_modal_msg'+modal+' [name=customer_email]').val(emm);
         fancyAdjust1();
      }else if(data.response.status == 'error'){
        if(data.response.response.error == 'validationErrors'){
          var mt_arr = data.response.response.list;
          var array = $.map(mt_arr, function(value, index) {
            return value+'<br />';
          });
          showAlertMessage(array,'error',''+alert_message+'');
          return;
        }else{
          showAlertMessage(data.response.response.msg,'error',''+alert_message+'');
          return;
        } 
      }
    } 
    return modal;
  }
  
  function getFileDetailsParam(file) {
    var extension = file.substr( (file.lastIndexOf('.') +1) );
    switch(extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'bmp':
      case 'gif':
        return 'Image'; 
      case 'zip':
        return 'Zip'; 
      break;
      case 'pdf':
        return 'PDF'; 
      break;
      case 'xlsx':
      case 'xls':
        return 'Spreadsheet'; 
      break;
      case 'txt':
        return 'Text'; 
      case 'doc':
      case 'docx':
        return 'Doc'; 
      break;
      default:
          return 'Text'; 
    }
  };

function getPartnerMessageHtml(){
  //sendRequest(BASE_URL+"communication/getPartnerMessageHtml");
  //var base_url = $('#BASE_URL').val();
  $.ajax({
      type: "POST",
      url: BASE_URL+"communication/getPartnerMessageHtml",
      data: '',
      beforeSend: function (xhr) 
        {
        //showProcessingImage(loading_params);
        // xhr.setRequestHeader("X-Requested-With", "AJAX");
          // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
      success: function(data,status,xhr){
        //hideProcessingImage();
        //responseHandler(data);
        $(document).ready(function(){
          setTimeout(function(){$("#header_notification_bar").off();$("#header_notification_bar.dropdown").off();$("#header_notification_bar .dropdown-toggle").off();},100);
        });

        if(data!=''){
          $("#header_message_bar").remove();  
          $("#header_notification_bar").after(data);
          var msgcount = $("#header_message_bar span.badge").text();
          $(".badge_inbox").remove();
          if(!isNaN(parseInt(msgcount))){
          $("#mass_inbox span.title").after("<span class=\'badge badge_inbox badge-custom\' style=\'float:none; margin-left:10px;\'>"+msgcount+"</span>");
          }
        }     
      },
      error: function(xhr, status, error){
        
        // if(xhr.status && xhr.status == 400)
        // {
        //  var obj = jQuery.parseJSON(xhr.responseText);
        //  showAlertMessage(obj.message,'error');
      //      }
       //   else
       //   {
        //    showAlertMessage("There was a problem accessing the server: " +xhr.statusText+"\n"+"*Please refresh the page and try again",'error');
        //    return;
       //   }
      }
  });
}

function isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;
    for (var c = a.childNodes, i = c.length; i--; ) {
        if (c[i].nodeType == 1) return true; 
    }
    return false;
}
function StripTags(str='') {
  if(str==null || str==undefined || str==''){
    return '';
  }
  var element = document.createElement('div');
  str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
     str = str.replace(/<style[^>]*>([\S\s]*?)<\/style>/gmi, '');
    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
    element.innerHTML = str;
    str = element.textContent;
  str = str.replace(/\s\s+/g, ' ');
  str = str.replace('<br>','');
  str = str.replace('<br/>','');
  str = str.replace(/<img[^>]*>/g,"");
  str = str.toString();
 str = str.replace(/<style[^>]*>([\S\s]*?)<\/style>/gmi, '');

  str = str.replace('<br>', '');
  str = str.replace('< br >', '');
  str = str.replace('<br >', '');
   str = str.replace('< br>', '');
  str = str.replace('<br/>', '');
   str = str.replace('< br />', '');
  str = str.replace(/(<([^>]+)>)/ig,"");

  return str;
}

function setCustomerListStorage(cname, cvalue){
  localStorage.setItem(""+cname+"",""+cvalue+"");
}
  
function getCustomerListStorage(cname){
  return localStorage.getItem(cname);
} 



function print_mail_pdf(text_id,msg_id){
  var crr = $('#crouter_url').val();
  var urrl = crr+'partner/communication/export_pdf?text_id='+text_id+'&msg_id='+msg_id;
  if(navigator.userAgent.indexOf('Safari')!=-1){
    window.open(urrl);
  }else{
    show_modal('','popups','',urrl);
  }
}

function show_mail_source(text_id,msg_id){
  var crr = $('#crouter_url').val();
  var urrl = crr+'partner/communication/email_source?text_id='+text_id+'&msg_id='+msg_id;
  
  show_modal('','popups','',urrl,750);
}
//024 29-11-2017 #992: Sales -> followup (Change email and SMS popup)  
function show_dkmodal_for_customer_email(cust_id = null, cust_name = null, cust_email = null, cust_number = null, cust_con_id = null, contact_name = null, contact_email = null,all_arr='') {
    closeModal('popups');
    
    var modal = generateDockmodalNew();
    $('#frm_modal_msg' + modal + ' [name=customer_email]').val(cust_email);
    var parent_msg_id = 0;
    var reply_from = '';
    var from_inbox = '';
    if(all_arr !='' && all_arr.length!=0){
    	for(var j in all_arr){
    		 var cid = all_arr[j].id + '##' + all_arr[j].customer_email;
         var obj = {
          id: cid,
          name: all_arr[j].customer_name,
          email: all_arr[j].customer_email,
          number: all_arr[j].customer_number,
          contact_name : '',
          contact_email : '',
          msg_id: '',
          reply_from: '',
          from_inbox: ''
      };
      console.log(obj)
			$(".customer_email_input" + modal).customtokenInput("add",obj );


	        //$('.token-input-list li:first-child').find('.token-input-delete-token').css('display', 'none');
	  	}
    }
    if (cust_name == '') {
        $(".customer_email_input" + modal).customtokenInput("add", {
            id: cust_id,
            name: cust_email,
            email: cust_email
        });
        $('.token-input-list li:first-child').find('.token-input-delete-token').css('display', 'none');
    } else if (cust_con_id != undefined && cust_con_id != null && cust_con_id != '') {
        cid = cust_id + '##' + cust_con_id + '##' + cust_email;
        $(".customer_email_input" + modal).customtokenInput("add", {
            id: cid,
            name: cust_name,
            email: cust_email,
            number: cust_number,
            contact_name : contact_name,
            contact_email : contact_email,
            msg_id: parent_msg_id,
            reply_from: reply_from,
            from_inbox: from_inbox
        });
        $('.token-input-list li:first-child').find('.token-input-delete-token').css('display', 'none');
    } else if (cust_id != undefined && cust_email != undefined) {
        cid = cust_id + '##' + cust_email;
        $(".customer_email_input" + modal).customtokenInput("add", {
            id: cid,
            name: cust_name,
            email: cust_email,
            number: cust_number,
            msg_id: parent_msg_id,
            reply_from: reply_from,
            from_inbox: from_inbox
        });
        $('.token-input-list li:first-child').find('.token-input-delete-token').css('display', 'none');
    }
}

// var counter = getdkmodalStorage('sms_counter');
// if(counter != ''){
//   var sms_counter = counter;
//   var token_counter = counter;
// }else{
//   var sms_counter = 0;
//   var token_counter = 0;  
// }
var sms_counter = 0;
 var token_counter = 0;
function show_dkmodal_for_customer_sms(cust_id = null,cust_name = null,cust_cellphone = null, cust_country = null, cell_code = null, to_number = null,customer_number = null, cust_con_id = null, contact_name = null,contact_cellphone = null,all_arr=''){
  closeModal('popups');
  var ttParams =  {
     cust_id : cust_id,
  }
  setdkmodalStorage('smsTokenData'+token_counter++, JSON.stringify(ttParams));   
  var modal = generateSMSDockmodal(sms_counter++);
  var customerData = cust_name+' <'+cust_cellphone+'>';
  $('#frm_modal_msg'+modal+' [name=customer_sms]').val(customerData);
  var parent_msg_id = 0;
  var reply_from ='';
  var from_inbox = '';
  if(all_arr!='' && all_arr.length!=0){
  	for(var j in all_arr){
		$(".customer_sms_input" + modal).customtokenInput("add", {
			id: all_arr[j].customer_id,
			name: all_arr[j].customer_name,
			cellphone: all_arr[j].customer_cellphone,
			number: all_arr[j].customer_number,
			contact_name: '',
			contact_cellphone:  '',
			msg_id: '',
			reply_from: '',
			from_inbox: ''
		});
  	}
  
  }
  if(cust_con_id!=undefined && cust_con_id!=null && cust_con_id!=''){
    cid = cust_id;
    var customerData = cust_name+' <'+cust_cellphone+'>';
    //$(".customer_sms_input"+modal).val(customerData);
    $(".customer_sms_input" + modal).customtokenInput("add", {id: cid,name: cust_name,cellphone: contact_cellphone,number: customer_number,contact_name: contact_name,contact_cellphone: cust_cellphone,msg_id: parent_msg_id,reply_from: reply_from,from_inbox: from_inbox});

    $('.popovers').popover();
    $(".cst_sms_contact_id"+modal).val(cust_con_id);
  }
  else if(cust_id!=undefined && cust_cellphone!=undefined){
    cid = cust_id;
    var customerData = cust_name+' <'+cust_cellphone+'>';
    //$(".customer_sms_input"+modal).val(customerData);
    $(".customer_sms_input" + modal).customtokenInput("add", {id: cid,name: cust_name,cellphone: cust_cellphone,number: customer_number,msg_id: parent_msg_id,reply_from: reply_from,from_inbox: from_inbox});

  $('.popovers').popover();
  }
  if(cust_id == null){
   setTimeout(function() { $('.token-input-input-token input').focus(); }, 500);
  }

  $(".dock-fileinput-btnsmsdkmod"+modal).addClass('sspopuphide');
  $('.cst_sms_textarea'+modal).css('border','none');
  $('.dockmodal-footer-buttonset').css('padding-top','7px');
  var html = '';
  html += '<span style="font-size: 20px; background-color: rgba(0, 0, 0, 0) none repeat scroll 0 0; padding: 0px; margin: 0px; float: right;margin-top: 6px;" class="pull-left sms_dock_charcters dock-charcters-btnsmsdkmod0 " data-toggle="tooltip" title="Count">';
  html += '<input name="data[Customers][no_of_chracters]" class="m-wrap span2 no_of_char" style="background-color: #f5f5f5 !important; height: 25px; width: 50%; border:none;color:#000;" readonly="readonly" id="CustomersNoOfChracters'+modal+'" type="text"></span>';
  $(html).insertAfter($('.dock-fileinput-btnsmsdkmod'+modal+'.sspopuphide'));
  $("#CustomersNoOfChracters"+modal).val('160 / 1');
  var value = 160;
  var counter = 1;
  $("#cst_sms_textarea"+modal).keyup(function(){
    console.log('heres');
    var count_elem  = get_multipart_count($("#cst_sms_textarea"+modal).val());
    var counter   = multipart_count($("#cst_sms_textarea"+modal).val());
    if(counter == '1'){
    value     = 160 - count_elem;
    }else {
    value     = (counter*153) - count_elem;
    }

    $("#CustomersNoOfChracters"+modal).val(value + ' / '+ counter);
    $(".cst_sms_counter"+modal).val(counter);
    var pages = {};
    pages.sms_textarea = $("#cst_sms_textarea"+modal).val();
    pages.value = value;
    pages.counter_text = counter;
     //localStorage.setItem('smsformMessage'+modal, JSON.stringify(pages));
  });
  
  if($('#from_address.customer_sms_from_address'+modal).children('option').length > 1){
    $('.customer_sms_from_address'+modal).select2();
  }
  
  var total_params = {
    cust_id : cust_id,
    cust_name : cust_name, 
    cust_cellphone : cust_cellphone,
    cust_country : cust_country,
    cell_code : cell_code,
    to_number : to_number,
    customer_number : customer_number,
    cust_con_id : cust_con_id,
    contact_name : contact_name,
    contact_cellphone : contact_cellphone,
    msg_id: parent_msg_id,
    reply_from: reply_from,
    from_inbox: from_inbox,
    value : value,
    counter_text : counter,
    sender : $('#from_address.customer_sms_from_address'+modal).val(),
    sms_textarea : '',
  };
}
    
function generateSMSDockmodal(count){
    
    if(!count){
    var count = 0;
    setdkmodalStorage('sms_counter', count);
    }
    var html = $('#parent_sms_div').html();
    //$('#parent_sms_div').parent().hide();
        html = html.replace(/frm_sms_modal_msg/g, 'frm_sms_modal_msg'+count);
        html = html.replace(/customer_sms_input/g, 'customer_sms_input'+count);
        html = html.replace(/customer_sms_from_address/g, 'customer_sms_from_address'+count);
        html = html.replace(/cst_sms_textarea/g, 'cst_sms_textarea'+count);
        html = html.replace(/cstkn_sms_to/g, 'cstkn_sms_to'+count);
        html = html.replace(/cst_sms_customer_id/g, 'cst_sms_customer_id'+count);
        html = html.replace(/cst_sms_customer_country/g, 'cst_sms_customer_country'+count);
        html = html.replace(/cst_sms_counter/g, 'cst_sms_counter'+count);
        html = html.replace(/cst_sms_cell_code/g, 'cst_sms_cell_code'+count);
        html = html.replace(/cst_sms_to_number/g, 'cst_sms_to_number'+count);
        html = html.replace(/cst_sms_contact_id/g, 'cst_sms_contact_id'+count); 
        html = html.replace(/controls-recipients-select-sms/g, 'controls-recipients-select-sms-'+count); 



      var appendData = '<div id=smsdkmod'+count+' class="dkmodalsms">'+html+'</div>';
      
    $('#parent_sms_main_div').append(appendData).each(function () { 
      //update form data onmuseleave
      $("#smsdkmod"+count).parent().parent().mouseleave(function(){
      });
      // Bind token Input for SMS Start
      var ttParams = getdkmodalStorage('smsTokenData'+count);
      var ttParams = JSON.parse(ttParams);
      var cust_cont_id = ttParams.cust_id;
      if(cust_cont_id == null){
        var APISERVER = $('#APISERVER').val();
        var token = $('#token').val();
        var language = $('#language').val();
        var lang = $('#lang').val();
        var partner_id = $('#partner_id').val();
        var admin_id = $('#admin_id').val();
        var total_params = 'admin_id='+admin_id+'&token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&status=1';
        var data = APISERVER+'/api/customers/getCustomerAndContactListForSMS.json?'+total_params;
        var customerList = data;
      
        $(".customer_sms_input"+count).customtokenInput(customerList,
        {
          minChars:3,
          hintText: "",
          noResultsText: '',
          searchingText: "",
       
          propertyToSearch: 'text',
          preventDuplicates: true,
          resultsFormatter: function(item){
          if(item){
            var cust_contact_id = item.cust_contact_id;
            if(cust_contact_id!=undefined && cust_contact_id!=null && cust_contact_id!=''){
              var name = item.cname ? item.cname : item.contact_name;
              var show_name = item.cname ? item.cname : item.contact_name;
              if(name.length > 31){
                name = name.substr(0,31)+'..';
              }
              if(show_name.length > 20){
                show_name = show_name.substr(0,20)+'..';
              }
              var cword = name+ ' - '+item.contact_cellphone;
              
            }else{
              var name = item.cname ? item.cname : item.name;
              var show_name = item.cname ? item.cname : item.name;
              if(name.length > 31){
                name = name.substr(0,31)+'..';
              }
              if(show_name.length > 20){
                show_name = show_name.substr(0,20)+'..';
              }
              var cword = name+ ' - '+item.cellphone;
            }
            if((cword + item.name).length > '60' ){
               if(item.type=='customergroupsms' || item.type=='custom_groups'){
                 return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.name  + "</span>&nbsp;<span class='btn mini green' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
               } 
              return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+cword+"</span>&nbsp;<span class='btn mini blue' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>";  
            }
            else{
               if(item.type=='customergroupsms' || item.type=='custom_groups'){
                 return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.name  + "</span>&nbsp;<span class='btn mini green' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
               } 
              if(cust_contact_id!=undefined && cust_contact_id!=null && cust_contact_id!=''){   
              return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.contact_name + " - "+ item.contact_cellphone  + "</span>&nbsp;<span class='btn mini blue' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
              }else{
                 if(item.type=='customergroupsms' || item.type=='custom_groups'){
                 return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.name  + "</span>&nbsp;<span class='btn mini green' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
               } 
                return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.name + " - "+ item.cellphone  + "</span>&nbsp;<span class='btn mini blue' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
              } 
            }
          } 
          else{
            return;
          } 
          },
          tokenFormatter: function(item) { 
          if(item){
            //return  "<li>"+ item.name+"</span></li><script> $('.cstkn_sms_to"+count+" .token-input-list li:first-child').find('.token-input-delete-token').css('display','none'); $('.popovers').popover();</script>" ; 
            var cust_contact_id = item.cust_contact_id;
            if(cust_contact_id!=undefined && cust_contact_id!=null && cust_contact_id!=''){
            return  "<li><span style='color:#000;'>"+ item.contact_name+"</span></span></li>" ;
            }else{
            return  "<li><span style='color:#000;'>"+ item.name+"</span></span></li>" ;
            }
          }
          else{
            return;
          }
          },
          resizeInput: false,
          onAdd : function(item){
           update_sms_storage(count);
            
           
            $('.popovers').popover();
           
          },
          onDelete : function(item){
            update_sms_storage(count);
           //setTimeout(function() { $('.token-input-input-token input').focus(); }, 500);
         },
        });
      }else{
        var APISERVER = $('#APISERVER').val();
        var token = $('#token').val();
        var language = $('#language').val();
        var lang = $('#lang').val();
        var partner_id = $('#partner_id').val();
        var admin_id = $('#admin_id').val();
        var total_params = 'admin_id='+admin_id+'&token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&status=1';
        var data = APISERVER+'/api/customers/getCustomerAndContactListForSMS.json?'+total_params;
        var customerList = data;
      
        $(".customer_sms_input"+count).customtokenInput(customerList,
        {
          minChars:3,
          hintText: "",
          noResultsText: '',
          searchingText: "",
        
          propertyToSearch: 'text',
          preventDuplicates: true,
          resultsFormatter: function(item){
          if(item){
            var cust_contact_id = item.cust_contact_id;
            if(cust_contact_id!=undefined && cust_contact_id!=null && cust_contact_id!=''){
              var name = item.cname ? item.cname : item.contact_name;
              var show_name = item.cname ? item.cname : item.contact_name;
              if(name.length > 31){
                name = name.substr(0,31)+'..';
              }
              if(show_name.length > 20){
                show_name = show_name.substr(0,20)+'..';
              }
              var cword = name+ ' - '+item.contact_cellphone;
              
            }else{
              var name = item.cname ? item.cname : item.name;
              var show_name = item.cname ? item.cname : item.name;
              if(name.length > 31){
                name = name.substr(0,31)+'..';
              }
              if(show_name.length > 20){
                show_name = show_name.substr(0,20)+'..';
              }
              var cword = name+ ' - '+item.cellphone;
            }
            if((cword + item.name).length > '60' ){
               if(item.type=='customergroupsms'  || item.type=='custom_groups'){
                 return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.name  + "</span>&nbsp;<span class='btn mini green' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
               } 
              return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+cword+"</span>&nbsp;<span class='btn mini blue' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>";  
            }
            else{
               if(item.type=='customergroupsms'  || item.type=='custom_groups'){
                 return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.name  + "</span>&nbsp;<span class='btn mini green' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
               } 
              if(cust_contact_id!=undefined && cust_contact_id!=null && cust_contact_id!=''){   
              return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.contact_name + " - "+ item.contact_cellphone  + "</span>&nbsp;<span class='btn mini blue' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
              }else{
                return  "<li style='display: block;width:100%;'><span style='float: left; width: 66%;'>"+ item.name + " - "+ item.cellphone  + "</span>&nbsp;<span class='btn mini blue' style='text-align: left; margin: 0px 0px 0px 1%; width: 26%;' >" +show_name+ "</span></li><hr style='margin: 0px;'>"; 
              } 
            }
          } 
          else{
            return;
          } 
          },
          tokenFormatter: function(item) { 
          if(item){
            //return  "<li>"+ item.name+"</span></li><script> $('.cstkn_sms_to"+count+" .token-input-list li:first-child').find('.token-input-delete-token').css('display','none'); $('.popovers').popover();</script>" ; 
            var cust_contact_id = item.cust_contact_id;
            if(cust_contact_id!=undefined && cust_contact_id!=null && cust_contact_id!=''){
            return  "<li><span style='color:#000;'>"+ item.contact_name+"</span></span></li>" ;
            }else{
            return  "<li><span style='color:#000;'>"+ item.name+"</span></span></li>" ;
            }
          }
          else{
            return;
          }
          },
          resizeInput: false,
          onAdd : function(item){ 
           update_sms_storage(count);
          },
          onDelete : function(item){
            update_sms_storage(count);
          // setTimeout(function() { $('.token-input-input-token input').focus(); }, 500);
         },
        });
        
      }
    // Bind token Input for SMS End
       
    });
    
    $('#smsdkmod'+count).dockmodal({   
    dockID : 'smsdkmod'+count,
    height: "413px",
    title: title_sms,
    open: function(){ 
      $('select.controls-recipients-select-sms-'+count).select2();
       add_sms_dkmod_ids('smsdkmod'+count,count);
       $('#from_address.customer_sms_from_address'+count).on('change',function(){
       var value = $(this).val();
      
        localStorage.setItem('smsformSender'+count,JSON.stringify(value));
       });
        $('select.controls-recipients-select-sms-'+count).on('change',function(){
         var value = $(this).val();
      
          localStorage.setItem('smsformcontact'+count,JSON.stringify(value));
       });
       $('.cst_sms_textarea'+count).on('keyup',function(){
        console.log('here');
       var value = $(this).val();
       var pages ={};
       pages.sms_textarea = value;
       
       var count_elem  = get_multipart_count(value);
       var counter_text = multipart_count(value);
       if(counter_text == '1'){
       var values     = 160 - count_elem;
       }else {
       var values     = (counter_text*153) - count_elem;
       }
       pages.value = values;
       pages.counter_text = counter_text;
        console.log('pages');
       console.log(pages);
           setdkmodalStorage('smsformMessage'+count, JSON.stringify(pages));
       });
    },
    close: function(){ 
       $('#parent_sms_main_div > #smsdkmod'+count).remove();
       remove_sms_dkmod_ids('smsdkmod'+count,count); 
    },
    minimize:function(){
    setdkmodalStorage('modalstatemod'+count, 'minimized'); 
  },
  restore:function(){
    setdkmodalStorage('modalstatemod'+count, 'docked');
  }, 
    buttons: [
      {
      html: "<i class='icon-check'></i>&nbsp;"+sen,
      buttonClass: "btn blue sssend",
      click: function () {
      var no = count;
      send_sms_to_customer(no);
      }
      },
      {
      html: dis,
      buttonClass: "btn ssdiscard",
      click: function () {
        var no = count;
         $('#smsdkmod'+no).dockmodal('destroy');
        localStorage.removeItem('smsdkmod'+no);
        localStorage.removeItem('smsformdata'+no);
        localStorage.removeItem('smsformMessage'+no);
        localStorage.removeItem('smsTokenData'+no);
        localStorage.removeItem('smsformSender'+no);
        localStorage.removeItem('smsformcontact'+no);
        localStorage.removeItem('modalstatemod'+no);

         
       
      }
      }
    ], 
    }); 
    return count;
}
function send_sms_to_customer(count){
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var lang = $('#lang').val();
  var partner_id = $('#partner_id').val();
  var admin_id = $('#admin_id').val();
   
  var message = $('.cst_sms_textarea'+count).val();
  var sender = $('#from_address.customer_sms_from_address'+count).val();
  var default_contact_person = $('select.controls-recipients-select-sms-'+count).val();
  var counter =  $('.cst_sms_counter'+count).val();
  console.log(count);

  var to = localStorage.getItem('smsformdata'+count);
  var to_details = '';
  if(to!=undefined && to!=null){
    to_details = to;
  }
  var cellphone_country_code = '';


  var sender_name = '';
  // if(sender != '' && sender == 'use_staff_phone_number'){
  //   var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id;
  //   var complete_data = passProdRequest(APISERVER+'/api/partners/loginUserDetails.json',total_params,'undefined');
  //   if(complete_data == undefined){
  //     var json_data = $('#json_data').val();
  //     var complete_data = JSON.parse(json_data);
  //     complete_data.response.status = is_undefined(complete_data.response.status);
  //     if(complete_data.response.status == 'success'){
  //       sender_name = complete_data.response.response.Login.code+''+complete_data.response.response.Login.cellphone_number;
  //     }else if(complete_data.response.status == 'error'){
  //       if(complete_data.response.response.error == 'validationErrors'){
  //         var mt_arr = complete_data.response.response.list;
  //         var array = $.map(mt_arr, function(value, index) {
  //           return value+'<br />';
  //         });
  //         showAlertMessage(array,'error',alert_msg);
  //         return;
  //       }else{
  //         showAlertMessage(complete_data.response.response.msg,'error',alert_msg);
  //         return;
  //       } 
  //     }
  //   } 
  // }else{
  //   var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id;
  //   var complete_data = passProdRequest(APISERVER+'/api/partners/getPartnerCustomSettings.json',total_params,'undefined');
  //   if(complete_data == undefined){
  //     var json_data = $('#json_data').val();
  //     var complete_data = JSON.parse(json_data);
  //     complete_data.response.status = is_undefined(complete_data.response.status);
  //     if(complete_data.response.status == 'success'){
  //       sender_name = complete_data.response.response.PartnerSetting.from_number;
  //     }else if(complete_data.response.status == 'error'){
  //       if(complete_data.response.response.error == 'validationErrors'){
  //         var mt_arr = complete_data.response.response.list;
  //         var array = $.map(mt_arr, function(value, index) {
  //           return value+'<br />';
  //         });
  //         showAlertMessage(array,'error',alert_msg);
  //         return;
  //       }else{
  //         showAlertMessage(complete_data.response.response.msg,'error',alert_msg);
  //         return;
  //       } 
  //     }
  //   } 
  // }
  
  var total_params = {
    token:token,
    admin_id:admin_id,
    language:language,
    lang:lang,
    partner_id:partner_id,
    message:message,
    counter:counter,
    to_details:to_details,
    sender:sender,
    default_contact_person:default_contact_person
  };
  
  $.ajax({
    type: 'POST',
    url: APISERVER+'/api/commons/send_mass_sms.json',
    data: total_params,
    async: true,
    dataType : "json",
    beforeSend: function(){
   
    },
    success: function(complet_data,status,xhr){
      if(complet_data.response.status == 'success'){
        call_toastr('success', success_msg, sms_success);
        localStorage.removeItem('smsdkmod'+counter);
    localStorage.removeItem('modalstatemod'+counter);
    localStorage.removeItem('smsformdata'+counter);
        $('#smsdkmod'+count).dockmodal('destroy');    
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

function add_sms_dkmod_ids(id,count){
    setdkmodalStorage('sms_counter',parseInt(count) + 1);
    var val_ar =  getdkmodalStorage('dkmod_sms_ids');
    if(!val_ar){
      setdkmodalStorage('dkmod_sms_ids',id);
    }
    else{
      //for adding
      var id_array = val_ar.split(',');
      id_array.push(id);
      setdkmodalStorage('dkmod_sms_ids',id_array);
    }
    
  }
  function remove_sms_dkmod_ids(id,count){
    var val_ar = getdkmodalStorage('dkmod_sms_ids');
    var id_array = val_ar.split(',');
    //array remove element code
    var new_data = [];
    $.each(id_array, function( index, value ) {
      if(id != value){
      new_data.push(value);
      }
    });
    //
    setdkmodalStorage('dkmod_sms_ids',new_data);
    if(new_data.length == 0){
      setdkmodalStorage('sms_counter',0);
    }
    //clear formdata stoarage 
    localStorage.removeItem('smsformdata'+count);
    
    //clear modalstate
    console.log(count+'remove_sms_dkmod_ids');
    localStorage.removeItem('smsmodalstate'+count);
    localStorage.removeItem('smsdkmod'+count);
    localStorage.removeItem('smsformMessage'+count);
    localStorage.removeItem('smsTokenData'+count);
    localStorage.removeItem('smsformSender'+count);
    localStorage.removeItem('smsformcontact'+count);
    localStorage.removeItem('modalstatemod'+count);
    
    
    //Destroy CKeditor
    if ($('.cst_sms_textarea'+count).html()){
       $('.cst_sms_textarea'+count).destroy();
    }
  }
  
  function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }
  //set formdata storage function  
//024 29-11-2017 #992: Sales -> followup (Change email and SMS popup) 

!function(factory){"function"==typeof define&&define.amd?define(["jquery"],factory):"object"==typeof exports?module.exports=factory(require("jquery")):factory(jQuery)}(function($){var dispatch=$.event.dispatch||$.event.handle,special=$.event.special,uid1="D"+ +new Date,uid2="D"+(+new Date+1);special.scrollstart={setup:function(data){var timer,_data=$.extend({latency:special.scrollstop.latency},data),handler=function(evt){var _self=this,_args=arguments;timer?clearTimeout(timer):(evt.type="scrollstart",dispatch.apply(_self,_args)),timer=setTimeout(function(){timer=null},_data.latency)};$(this).bind("scroll",handler).data(uid1,handler)},teardown:function(){$(this).unbind("scroll",$(this).data(uid1))}},special.scrollstop={latency:250,setup:function(data){var timer,_data=$.extend({latency:special.scrollstop.latency},data),handler=function(evt){var _self=this,_args=arguments;timer&&clearTimeout(timer),timer=setTimeout(function(){timer=null,evt.type="scrollstop",dispatch.apply(_self,_args)},_data.latency)};$(this).bind("scroll",handler).data(uid2,handler)},teardown:function(){$(this).unbind("scroll",$(this).data(uid2))}}});
$(document).ready(function(){
  $(window)
  .on('scrollstart', function() {
    $('.token-input-dropdown').hide();

  })
    $(document).bind('DOMSubtreeModified', function(e) {
      // $("div.dockmodal-header a,div.dockmodal-footer-buttonset a").click(function(){
      //    $('.token-input-dropdown').hide();
      // });
    });
  // $('.dockmodal-body')
  // .on('scrollstart', function() {
  //   $('.token-input-dropdown').hide();
  
  // })
});
function sub_thread_dropdown(event,row,id,msg_id){
  $('#thread-btn-ellipsis-'+row+''+id+''+msg_id+' > .dropdown-toggle').dropdown('toggle');
  event.stopPropagation();
}
function update_sms_storage(count){
  console.log(count);
  var all_items = [];
  var show = 'no';
  $('.cstkn_sms_to'+count+' input[type=hidden]').each(function(){
    var a = JSON.parse($(this).val());
    if(a.type=='customergroupsms'){
      show = 'yes';
    }
    all_items.push(a);
  });
  localStorage.setItem('smsformdata'+count,JSON.stringify(all_items));

  if(show=='yes'){
    $('div.controls-recipients-select-sms-'+count).show();
  }
  else{
      $('div.controls-recipients-select-sms-'+count).hide();
  }

  $('.popovers').popover();
}

// var doAjax_params_default = {
//   'url': null,
//   'requestType': "POST",
//   'dataType': 'json',
//   'data': {},
//   'beforeSendCallbackFunction': null,
//   'successCallbackFunction': null,
//   'completeCallbackFunction': null,
//   'errorCallBackFunction': null,
// };

// function doAjax(doAjax_params) {
//       var url = doAjax_params['url'];
//       var data = doAjax_params['data'];
//       var requestType =  doAjax_params['requestType'];
//       var beforeSendCallbackFunction = doAjax_params['beforeSendCallbackFunction'];
//       var successCallbackFunction = doAjax_params['successCallbackFunction'];
//       var completeCallbackFunction = doAjax_params['completeCallbackFunction'];
//       var errorCallBackFunction = doAjax_params['errorCallBackFunction'];
     
//       $.ajax({
//           url: url,
//           type: requestType,
//           async:true,
//           dataType : "json",
//           data: data,
//           beforeSend: function(jqXHR, settings) {
//               if (typeof beforeSendCallbackFunction === "function") {
//                   beforeSendCallbackFunction();
//               }
//           },
//           success: function(data, textStatus, jqXHR) {    

//               if (typeof successCallbackFunction === "function") {
//                   successCallbackFunction(data);
//               }
//           },
//           error: function(jqXHR, textStatus, errorThrown) {
//               if (typeof errorCallBackFunction === "function") {
//                   errorCallBackFunction(errorThrown);
//               }

//           },
//           complete: function(jqXHR, textStatus) {
//               setTimeout(function(){
//                 var content = $('.page-content');
//                 var sidebar = $('.page-sidebar');
//                 var body = $('body');
//                 var height;

//                 if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
//                     var available_height = $(window).height() - $('.footer').height();
//                     if (content.height() <  available_height) {
//                         content.attr('style', 'min-height:' + available_height + 'px !important');
//                     }
//                 } else {
//                     if (body.hasClass('page-sidebar-fixed')) {
//                         height = _calculateFixedSidebarViewportHeight();
//                     } else {
//                         height = sidebar.height() + 20;
//                     }
//                     if (height >= content.height()) {
//                         content.attr('style', 'min-height:' + height + 'px !important');
//                     } 
//                 }        
//               },10);
//               if (typeof completeCallbackFunction === "function") {
//                   completeCallbackFunction();
//               }
//           }
//       });
// }


function mark_as_unread(msg_id,frm){
  if(frm=='makeread'){
    $('.ms'+msg_id).removeClass('unread');
    var htmls = '<li id="toggle_read_'+msg_id+'"><a class="" onclick="mark_as_unread('+msg_id+',\'makeunread\');"><i class="icon-envelope-o" style="color:#000000"></i>&nbsp;'+mrksurd+'</a></li>';
     $('#toggle_read_'+msg_id).html(htmls);
  }
  else{
    $('.ms'+msg_id).addClass('unread');
    var htmls = '<li id="toggle_read_'+msg_id+'"><a class="" onclick="mark_as_unread('+msg_id+',\'makeread\');"><i class="icon-envelope-open-o" style="color:#000000"></i>&nbsp;'+mrksrd+'</a></li>';
    $('#toggle_read_'+msg_id).html(htmls);
  }
 
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var lang = $('#lang').val();
  var partner_id =$('#partner_id').val();
  var admin_id = $('#admin_id').val();
  var read = 0;
  if(frm=='makeread'){
    var read = 1;
  }
  var total_params = {
    APISERVER:APISERVER,
    token:token,
    language:language,
    lang:lang,
    partner_id:partner_id,
    admin_id:admin_id,
    getTranslationsData:'yes',
    msg_id:msg_id,
    read:read
  };
  var params = $.extend({}, doAjax_params_default);
  params['url'] = APISERVER+'/api/PartnerMessages/mark_as_unread.json';
  params['data'] = total_params;
  params['successCallbackFunction'] = function (complet_data){

  }
  doAjax(params);
  return;
}

function mark_as_compincomp(msg_id,folder_id,frm,parent_message_id){
  if(frm=='complete'){
    
     call_toastr('success', suc,emac);
  }
  else{
     call_toastr('success', suc,emti);

  }

  $('.ms'+msg_id).remove();
  $('.ms_u'+msg_id).remove();
  $('.ms_m'+msg_id).remove();
  $('.ms_l'+msg_id).remove();

  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var lang = $('#lang').val();
  var partner_id =$('#partner_id').val();
  var admin_id = $('#admin_id').val();
  var mark = 'i';
  if(frm=='complete'){
    var mark = 'c';
  }
  var total_params = {
    APISERVER:APISERVER,
    token:token,
    language:language,
    lang:lang,
    partner_id:partner_id,
    admin_id:admin_id,
    getTranslationsData:'yes',
    folder_id:folder_id,
    mark:mark,
    msg_id:msg_id,
    parent_message_id:parent_message_id

  };
  var params = $.extend({}, doAjax_params_default);
  params['url'] = APISERVER+'/api/PartnerMessages/mark_as_compincomp.json';
  params['data'] = total_params;
  params['successCallbackFunction'] = function (complet_data){

  }
  doAjax(params);
  return;
}

var gnm_td;
var getNewsMessage = {
    start:function(){
        var APISERVER = $('#APISERVER').val();
        var token = $('#token').val();
        var language = $('#language').val();
        var lang = $('#lang').val();
        var partner_id =$('#partner_id').val();
        var admin_id = $('#admin_id').val();

        var total_params = {
            token:token,
            language:language,
            lang:lang,
            partner_id:partner_id,
            admin_id:admin_id,
            getTranslationsData:'yes',
            getTranslationsDataArray:['$new_msg','$new_msgs','See all messages','Read more','Content','Close','Read less','No unread messages'],
        };

        var params = $.extend({}, doAjax_params_default);
        params['url'] = APISERVER+'/api/Commons/getPartnerNewsMessage.json';
        params['data'] = total_params;
        params['successCallbackFunction'] = function (complet_data){
    
            if(complet_data.response.status == 'success'){
                gnm_td = complet_data.response.response.translationsData;
                getNewsMessage.createHtml(complet_data.response.response.partnerMessageNews1,complet_data.response.response.unread_count);
                getNewsMessage.createDash(complet_data.response.response.partnerMessageNews);
            }
            else if(complet_data.response.status == 'error'){

            }
        }
        doAjax(params);
        return;
    },  
    createHtml:function(data,count=0){
        var c = count;
        var cnt = data.length;
        if(cnt == 0){
            $('#header_msg_bar').remove();
            return;
        }
        var msg = '';
        if(c > 1){
            msg = gnm_td.$new_msgs;
        }
        else{
            msg = gnm_td.$new_msg;
        }
        
        if(c == 0){
          msg = gnm_td.Nounreadmessages;
        }
        else{
          msg = msg.replace('%count%',c);
        }

 
        var html = '<li class="dropdown" id="header_msg_bar">';
            html += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" style="margin-top: 0px;">';
                html += '<i class="icon-info-o" style="font-size:1.5em"></i>';
                if(checkNull(c,0) != 0 ){
                  html += '<span class="badge">'+c+'</span>';
                }
                
            html += '</a>';
            html += '<ul class="dropdown-menu extended notification">';
                html += '<li>';
                   html += '<p>'+msg+'</p>';
                html += '</li>';

                html += '<ul id="header_msg_bar_dd" class="dropdown-menu-list" style="margin:0;float:left;width:100%">';
                    for(var j in data){
                        var d = data[j].PartnerMessageNews;
                        var dd = JSON.stringify(data[j]);
                        dd = dd.replace(/\"/g,"'");
                        html += '<li onclick="getNewsMessage.goToPage(2,'+dd+')" style="list-style-type:none;width:100%;float:left;box-sizing:border-box">';
                            html += '<a style="width:100%;float:left;box-sizing:border-box">';
                                html += '<table style="width:100%">';
                                    html += '<tr>';
                                        html += '<td style="text-align:left;color: #5b9bd1;font-weight: 600;font-size;14px">';
                                        html +=  checkNull(d.title);
                                        html += '</td>';
                                        html += '<td style="text-align:right;color: #888888;font-style: normal;opacity: 0.5;font-weight: 40;">';
                                            html += checkNull(d.time_text);
                                        html += '</td>'
                                    html += '</tr>';
                                html += '</table>'
                                //white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
                                html += '<span class="content" style="width:100%;float:left;clear:both; ">';
                                    html += checkNull(d.contentwbr);
                                html += '</span>';
                            html += '</a>';
                        html += '</li>';
                    }
                html += '</ul>';

                html += '<li class="external">';
                    html += '<a href="javascript:;" onclick="getNewsMessage.goToPage(1)">'+gnm_td.Seeallmessages+'<i class="m-icon-swapright"></i></a>';
                html += '</li>';
            html += '</ul>';
        html += '</li>';
        
        $('#header_msg_bar').remove();
        $('div.header ul.pull-right li.user').parent().prepend(html);     
        $('#header_msg_bar').addClass('open');
        var h = ($('#header_msg_bar_dd').height());

        $('#content').append('<span class="char_w_h" style="display:none">a</span>');

        var char_width = $('.char_w_h').width();
        var w = $('#header_msg_bar_dd').find('.content').width();
        var no_char = parseInt(w/char_width) * 2;
        

        $('#header_msg_bar_dd .content').each(function(){
            var html = $(this).html();
            if(html.length > no_char){
                html = html.slice(0,no_char);
                $(this).html(html+'...');
            }
        });
        $('#header_msg_bar').removeClass('open');
        if(h > 250 ){
            $('#header_msg_bar_dd').slimScroll();
        }
    },
    createDash:function(data){
        var ccontroller = $('#ccontroller').val();
        var caction = $('#caction').val();
        var dash_html  = '';
        for(var j in data){
            var d = data[j].PartnerMessageNews;
            var m = data[j][0];
            if(ccontroller == 'dashboard' && caction == 'index'){

                if(d.sticky != 1){
                   if(m.read == 1){
                      continue;
                   }
                }
                if(d.show_on_dashboard == 1){
                   if(d.category == 'news'){

                        if(d.sticky == 1){
                             dash_html += '<div class="alert alert-info dash_html" style="padding: 8px 14px 8px 14px;width:100%;float:left;box-sizing:border-box;margin-bottom:5px">';
                        }
                        else{
                             dash_html += '<div class="alert alert-info dash_html" style="width:100%;float:left;box-sizing:border-box;margin-bottom:5px">';
                        }  
                   }
                   else{
                        if(d.sticky == 1){
                            dash_html += '<div class="alert dash_html"  style="padding: 8px 14px 8px 14px;width:100%;float:left;box-sizing:border-box;margin-bottom:5px">';
                        }
                        else{
                            dash_html += '<div class="alert dash_html"  style="width:100%;float:left;box-sizing:border-box;margin-bottom:5px">';
                        }
                   }
                     
                var dd = JSON.stringify(data[j]);
                dd = dd.replace(/\"/g, "'");
                dash_html += '<div class="dash_title" style="float:left;font-weight:bold"><span>'+checkNull(d.title)+'&nbsp;</span></div>';
                dash_html += '<div data_d="'+dd+'" class="dash_content" style="float:left"><span class="content">'+checkNull(d.contentwbr)+ '</span><span style="display:none">'+checkNull(d.content)+'</span></div>';
                if(d.sticky != 1){
                 dash_html += '<button class="close" style="right:-30px:top:5px" onclick="getNewsMessage.markRead('+d.id+');" data-dismiss="alert"></button>';
                }
                   dash_html += '</div>';
                }
            }
        }
        $('.dash_html').remove();
        
        if(dash_html != ''){
            dash_html = '<div class="row-fluid dash_html"><div class="span12">'+dash_html+'</div></div>';
            $('#show_partner_dashboard_data').before(dash_html);
            $('#content').append('<span class="char_w_h" style="display:none">a</span>');
      
            var char_width = $('.char_w_h').width();
            var i = 0;

            $('.dash_title').each(function(){
                var  w = $(this).find('span').outerWidth() + 10;
              
                $(this).css({
                   width:w+'px'
                });
                 $(this).find('span').css({
                   width:w+'px'
                });

                var parent_width = $(this).parent().width();
                if($('body').css('overflow') == 'hidden'){
                    parent_width = parent_width - 10;
                }
                var btn_w = $(this).parent().find('button.close').width();
                var dash_content_width = parent_width - w - btn_w;

                $(this).parent().find('.dash_content').css('width',dash_content_width + 'px');

                var no_char = parseInt(parent_width/char_width);

                var without_br = $(this).parent().find('span.content').html();
                var with_br =  $(this).parent().find('span.content').next('span').html();
                
                var orig_m = without_br;
                var m = without_br;

                if(m.length > no_char){
                    console.log('here');
                    i++;
                    no_char = no_char - 20;
                    m = m.slice(0,no_char)
                    m = m + '...&nbsp;<button class="btn mini blue-stripe show_more_'+i+'" ><i class="icon-plus"></i>&nbsp;'+gnm_td.Readmore+'</button>';
                    $(this).parent().find('span.content').html(m);

                    $('.dash_content').on('click','.show_more_'+i,function(){
                        var msg = with_br + '&nbsp;<button class="btn mini blue-stripe show_less_'+i+'" ><i class="icon-minus"></i>&nbsp;'+gnm_td.Readless+'</button>';
                        $(this).parent().html(msg);
                        $('.dash_content').on('click','.show_less_'+i,function(){
                            $(this).parent().html(m);
                        });
                    });
                }
            });
        }
    },
    readMore:function(d,frm='mrknrd'){
      var modalhtml = '';
         modalhtml += '<div class="modal hide fade" id="news_message_modal" style="display:none;">';
         modalhtml += '<div class="modal-header">';
            modalhtml += '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>';
            modalhtml += '<h3>'+d.PartnerMessageNews.title+'</h3>';
            modalhtml += '<p style="font-style:Italic;margin:0;color:gray;">'+checkNull(convertDateIntoSiteFormat(d.PartnerMessageNews.from_date))+'</p>';
         modalhtml += '</div>';

         modalhtml += '<div class="modal-body">';
            modalhtml += '<div class="row-fluid">';
              
                                    modalhtml += checkNull(d.PartnerMessageNews.content);
                                
            modalhtml += '</div>';
         modalhtml += '</div>';

         modalhtml += '<div class="modal-footer">';
            modalhtml += '<div class="btn-group">';
            modalhtml += '<button data-dismiss="modal" class="btn btn_clear" type="button"><i class="icon-remove"></i>';
               modalhtml += gnm_td.Close;
            modalhtml += '</button>';
            modalhtml += '</div>';
         modalhtml += '</div>';
      modalhtml += '</div>';

      //show_partner_dashboard_data

      $('#news_message_modal').remove();
      $('body').append(modalhtml)
      $('#news_message_modal').modal('show');

      if(checkNull(d[0].read,0) != 1 && frm == 'mrkrd'){
         getNewsMessage.markRead(d.PartnerMessageNews.id);
      }
    },
    goToPage:function(frm=1,dd={}){
        if(frm == 1){
            var url = '/'+$('#type').val()+'/dashboard/news_message';
            new_custom_main_page2(url,'dashboard','dashboard','news_message');
        }
        else{
            getNewsMessage.readMore(dd,'mrkrd');
        }
    },
    markRead:function(id){
        var APISERVER = $('#APISERVER').val();
        var token = $('#token').val();
        var language = $('#language').val();
        var lang = $('#lang').val();
        var partner_id =$('#partner_id').val();
        var admin_id = $('#admin_id').val();

        var total_params = {
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
                getNewsMessage.createDash(complet_data.response.response.partnerMessageNews);
                getNewsMessage.createHtml(complet_data.response.response.partnerMessageNews1,complet_data.response.response.unread_count);
            }
            else if(complet_data.response.status == 'error'){
            }
        }
        doAjax(params);
        return;
    }
}