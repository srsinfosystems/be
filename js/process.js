/* Author 	: 018
 * Date 	: 28 OCT 2013
 * DESC 	: Main custom javascript file
 *  
 * */

var xmlHttp	= '';
var BASE_URL = document.getElementById("BASE_URL").value;
var isBlocked = '';
// Modal spinner
var img_url = document.getElementById("ASSET_URL").value;
var trans_loading = $('#trans_loading').val();
if(trans_loading == '' || trans_loading == null){
	trans_loading = 'Loading';
}

$.fn.modalmanager.defaults.resize = true;
$.fn.modalmanager.defaults.spinner = '<div class="loading-spinner fade" style="width: 200px; margin-left: -100px;"><img src="'+img_url+'img/ajax-modal-loading.gif" align="middle">&nbsp;<span style="font-weight:300; color: #eee; font-size: 18px; font-family:Open Sans;">&nbsp;'+trans_loading+'...</span></div>';
/////

function setdkmodalStorage(cname, cvalue) {
localStorage.setItem(""+cname+"",""+cvalue+"");
}

function getdkmodalStorage(cname) {
return localStorage.getItem(cname);
}
function sendRequest(server_script, query_string, loading_params)
{
	if(loading_params != ''){
		loading_params = 'undefined';
	}
	
	if(server_script == '' || server_script == null || server_script == 'undefined')
	{
		showAlertMessage('Script is missing','error');
		return false;
	}

	$.ajax({
	    type: "POST",
	    url: server_script,
	    data: query_string,
	    beforeSend: function (xhr) 
        {
	    	showProcessingImage(loading_params);
		   // xhr.setRequestHeader("X-Requested-With", "AJAX");
	       // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
	    success: function(data,status,xhr){
			
	    	hideProcessingImage();
	    	responseHandler(data);
	    },
	    error: function(xhr, status, error){
	    	hideProcessingImage();
	    	if(xhr.status && xhr.status == 400)
	    	{
	    		var obj = jQuery.parseJSON(xhr.responseText);
	    		showAlertMessage(obj.message,'error');
           }
	       else
	       {
	    	   showAlertMessage("There was a problem accessing the server: " +xhr.statusText+"\n"+"*Please refresh the page and try again",'error');
	    	   return;
	       }
	    }
	});
}


function sendpostData(server_script, query_string,popup)
{
	if(server_script == '' || server_script == null || server_script == 'undefined')
	{
		showAlertMessage('Script is missing','error');
		return false;
	}
	
	if($(popup).attr('data-width')){
		w = $(popup).attr('data-width');
		w = w.replace('px','');
		w = w.trim();
		
		$('#'+popup).width(w);
	}
		
	$('#'+popup).modal().on("hidden", function() {
		$('#'+popup).empty();
	});
	
	$.ajax({
	    type: "POST",
	    url: server_script,
	    data: query_string,
	    beforeSend: function (xhr) 
        {
	    	showProcessingImage('undefined'); 
		   // xhr.setRequestHeader("X-Requested-With", "AJAX");
	       // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
	    success: function(data,status,xhr){
	    	//hideProcessingImage();
	    	//responseHandler(data);
			hideProcessingImage(); 
	    	var body_text1 = data.split('load_content&#135;_&#135;');
	    	/*//var body_text = data.split('&#135;_&#135;');
	    	
	       	$('#'+popup).resize();
	    	$('#'+popup).html(body_text);
			//$('#a_'+popup).trigger('click');*/


			if(body_text1.length == 1){
				var body_text = data.split('&#135;_&#135;');
				if(body_text.length >1)
				{
					data = body_text[1];
					
					if(body_text[0] == 'page_load'){
						window.location.href = body_text[1];
						return;
					}else if(body_text[0] == 'exe_eval'){
						eval(body_text[1]);
						return;
					}
					return;
				}
			}

			$('#'+popup).resize();
			$('#'+popup).html(body_text1);

	    },
	    error: function(xhr, status, error){
	    	hideProcessingImage();
	    	$('#'+popup).modal('hide'); // remove backdrop
	    	if(xhr.status && xhr.status == 400)
	    	{
	    		var obj = jQuery.parseJSON(xhr.responseText);
	    		showAlertMessage(obj.message,'error');
           }
	       else
	       {
	    	   showAlertMessage("There was a problem accessing the server: " + xhr.statusText +"<br>"+"*Please refresh the page and try again",'error');
           }	      
	    }
	});
}

function update_country_tax(countryid) {
	
	alert(countryid);
}

function passRequest(server_script, query_string, loading_params)
{
	if(loading_params != ''){
		loading_params = 'undefined';
	}
	
	if(server_script == '' || server_script == null || server_script == 'undefined')
	{
		showAlertMessage('Script is missing','error');
		return false;
	}
	
	$.ajax({
	    type: "GET",
	    url: server_script,
	    data: query_string,
	    beforeSend: function (xhr) 
        {
	    	showProcessingImage(loading_params);
		    // xhr.setRequestHeader("X-Requested-With", "AJAX");
			//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
	    success: function(data,status,xhr){
	    	hideProcessingImage();
	    	responseHandler(data); 
	    },
	    error: function(xhr, status, error){
	    	hideProcessingImage();
	        //alert("There was a problem accessing the server: " +
	        //xhr.statusText+"\n"+"*Please refresh the page and try again");
	    }
	});
}

function passProdRequest(server_script, query_string, loading_params)
{
	if(server_script == '' || server_script == null || server_script == 'undefined')
	{
		showAlertMessage('Script is missing','error');
		return false;
	}
	
	if(query_string == 'image_delete'){
		var type = 'DELETE';	
	}else{
		var type = 'POST';		
	}
	$.ajax({
	    type: type,
	    url: server_script,
	    data: query_string,
	    async: false,
	    dataType : "json",
	    beforeSend: function (xhr) 
        {
	    	showProcessingImage(loading_params);
		    // xhr.setRequestHeader("X-Requested-With", "AJAX");
			//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
	    success: function(data,status,xhr){
	    	hideProcessingImage();
	    	var data = JSON.stringify(data);
	    	$('#json_data').val(data);
	    	//responseHandler(data); 
	    },
	    error: function(xhr, status, error){
	    	hideProcessingImage();
	    	return '';
	        //alert("There was a problem accessing the server: " +
	        //xhr.statusText+"\n"+"*Please refresh the page and try again");
	    }
	});
	
}

function is_undefined(fd) {
	if (typeof fd === "undefined")
		return '';

	return jQuery.trim(fd);
}

function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

// Fetch form data
function fetchFormData(form,script_name,other_params,loading_params)
{
	
	if(other_params == 'undefined'){
		other_params = '';
	}
	
	if(loading_params != ''){
		loading_params = 'undefined';
	}
	
	if($('#'+form).length <= 0)
	{
		showAlertMessage('Form is missing','error');
		return false;
	}
	
	if(script_name == '' || script_name == null || script_name == 'undefined')
	{
		showAlertMessage('Script is missing','error');
		return false;
	}
	
	query_string = $('#'+form).serialize();
	query_string = query_string.replace("_method=PUT&","");
	if(other_params != '' && other_params != null && other_params != 'undefined')
		query_string += '&'+other_params;
	
	
	sendRequest(script_name, query_string, loading_params);
}

function fetchOtherFormData(form,script_name,other_params,source,popup)
{
	if($('#'+form).length <= 0)
	{
		showAlertMessage('Form is missing','error');
		return false;
	}
	
	if(script_name == '' || script_name == null || script_name == 'undefined')
	{
		showAlertMessage('Script is missing','error');
		return false;
	}
	
	query_string = $('#'+form).serialize();
	query_string = query_string.replace("_method=PUT&","");
	
	if(other_params != '' && other_params != null && other_params != 'undefined')
		query_string += '&'+other_params;
	
	if($('#'+source).length >0 && $('#'+source).attr('data-width')){
		$('#'+popup).attr('data-width',$('#'+source).attr('data-width'));
	}
	sendpostData(script_name, query_string,popup);
}

// SEND POPUP REQUEST
function showAjaxPopup(server_script,popup,send_type,w)
{
	default_type = 'GET';
	if(send_type == '' || send_type == null || send_type == 'undefined'){
		send_type = default_type;
	}
	
   $.ajax({
	    type: send_type,
	    url: server_script,
	    data: "tab="+popup,
	    beforeSend: function (xhr)
        {
	    	showProcessingImage('undefined'); 
		    //xhr.setRequestHeader("X-Requested-With", "AJAX");
			//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
	    success: function(data,status,xhr){
	    	hideProcessingImage(); 
	    	//stop background scrolling

	    	var body_text = data.split('&#135;_&#135;');
	    	if(body_text.length >1)
	    	{
	    		data = body_text[1];
	    		
    			if(body_text[0] == 'page_load'){
    				window.location.href = body_text[1];
    				return;
    			}else if(body_text[0] == 'exe_eval'){
    				eval(body_text[1]);
    				return;
    	    	}
    			
	    	}
	    	$('#'+popup).width(w);
	    	$('#'+popup).attr('data-width',w);
	    	$('#'+popup).data('modal').options.width = w + 'px';
	    	$('#'+popup).data().modal.options.width = w+"px";
	       	$('#'+popup).html(data);
	    	setTimeout(function(){
		    	$(window).trigger('resize.modal');

				$('#'+popup).css('margin-left', function () {
					return -($(this).width() / 2) + 'px';
				});
				var modalOverflow = $(window).height() - 10 < $('#'+popup).height();
	            
				if (modalOverflow ) {
					$('#'+popup)
						.css('margin-top', 0)
						.addClass('modal-overflow');
				} else {
					$('#'+popup)
						.css('margin-top', 0 - $('#'+popup).height() / 2)
						.removeClass('modal-overflow');
				}
			
			});
	    },
	    error: function(xhr, status, error){
	    	hideProcessingImage();
	    	$('#'+popup).modal('hide'); // remove backdrop
	    	if(xhr.status && xhr.status == 400)
	    	{
	    		var obj = jQuery.parseJSON(xhr.responseText);
	    		showAlertMessage(obj.message,'error');
           }
	       else
	       {
	    	   showAlertMessage("There was a problem accessing the server: " + xhr.statusText +"<br>"+"*Please refresh the page and try again",'error');
           }	       
	    }
	});
}


function responseHandler(xmlResponse)
{
	var status = errorHandler(xmlResponse);
	
	if(!status) 
		return false;
	
	var body_text = xmlResponse.split('&#135;_&#135;');
	params = body_text[0].split('^');
	
	if(params.length <= 0) 
	{
		showAlertMessage('Server error','error');
		return;
	}
	
	switch (params[0])
	{
		case 'load_content':
		{
			content = 'content';
			if(typeof params[1] != 'undefined'){
				content = params[1]
			}
			
			$('#'+content).html(body_text[1]);
		}
		break;
		case 'exe_eval':
		{
			
			eval(body_text[1]);
		}
		break;
		case 'exe_reload':
		{
			
			eval(body_text[1]);
			window.location.href = body_text[2];
		}
		break;
		case 'alert_eval':
		{
			mType = 'error';
			dilogTitle = $('#alert_message_btn_text').val();
			if(typeof params[1] != 'undefined'){
				mType = params[1]
			}
			if(typeof params[2] != 'undefined'){
				dilogTitle = params[2]
			}
						
			events = '';
			if(body_text[2] != '' && body_text[2] != null){
				events = body_text[2];	
			}
			showAlertMessage(body_text[1],mType,dilogTitle,events);
			
			
		}
		break;
		case 'page_load':
			window.location.href = body_text[1];
		break;
		case 'open_pdf':
		{
			openPdf(body_text[1]);
			if(body_text[2] != '' && body_text[2] != null){
				eval(body_text[2]);
			}
		}
		break;
		case 'confirm':
			confiem_msg = '';
			if(body_text[1] != '' && body_text[1] != null){
				confiem_msg = body_text[1];
			}
			
			if($('#confirm_message').length){
				confiem_msg = $('#confirm_message').value;
			}
			
			 $("#bkengine_alert_box" ).html(confiem_msg);
			 
			btn1_text = $('#yes_btn_text').length > 0?$('#yes_btn_text').val():'Yes';
			btn2_text = $('#no_btn_text').length > 0 ? $('#no_btn_text').val():'No';
			title = $('#confirmation_btn_text').length >0 ?$('#confirmation_btn_text').val():'Alert message';
			
			 $("#bkengine_alert_box" ).dialog({
			      dialogClass: 'ui-dialog-purple',
			      modal: true,
			      resizable: false,
			      height: 200,
			      width: 310,
			      modal: true,
			      title : title,
			      buttons: [
			      	{
			      		'class' : 'btn green',	
			      		"text" : btn1_text,
			      		click: function() {
			      			$(this).dialog( "close" );
			      			if(body_text[2] != '' && body_text[2] != null){
			      				eval(body_text[2])
			    			}else{
			    				window.location.href = BASE_URL;
			    			}
			       			
		     			}
			      	},
			      	{
			      		'class' : 'btn',
			      		"text" : btn2_text,
			      		click: function() {
			      			$(this).dialog( "close" );
			      			if(body_text[3] != '' && body_text[3] != null){
			      				eval(body_text[3])
			    			}else{
			    				window.location.href = BASE_URL;
			    			}
			      			
		     			}
			      	}
			      ]
			    });
		break;
		default:
		{
			if(params == "<script type='text/javascript'>showlogin.show();</script>"){
				$('body').append(params);
				return;
			}
			
			msg = 'Oops! something went wrong<br>Please refresh the page.';
			 //events =  "window.location.href = '"+BASE_URL+"dashboard'";
			 showAlertMessage(msg,'error','Server Error !'); //#044 01-Feb-2016 0033438: BE > Two feature requests, minbefaring.no > 01
			 break;
		}
	}
}

function showAlertMessage(message,mtype,dilogTitle,events)
{
	if(message == '' || message == null || message == 'undefined'){
		message = 'Error';
	}
	
	if(dilogTitle == '' || dilogTitle == null || dilogTitle == 'undefined'){
		if($('#trans_message').length > 0){
			dilogTitle = $('#trans_message').val(); 
		}
		if(dilogTitle == '' || dilogTitle == null){
			dilogTitle = 'Message';
		}
		
	}
	
	if($('#bkengine_alert_box').length <= 0){
		alert(message);
		return;
	}
	
	if(mtype == 'error'){
		cssBtnClass = "btn grey";
		cssDialogClass = "ui-dialog-red";
		dilogTitle = $('#error_message_btn_text').val();
	}else if(mtype == 'success'){
		cssBtnClass = "btn blue";
		cssDialogClass = "ui-dialog-green";
		dilogTitle = $('#success_message_btn_text').val();
	}else if(mtype == 'warning'){
		cssBtnClass = "btn blue";
		cssDialogClass = "ui-dialog-yellow";
		dilogTitle = $('#warning_message_btn_text').val();
	}else{
		cssBtnClass = "btn blue";
		cssDialogClass = "ui-dialog-green";
	}
	
	$('#bkengine_alert_box').html(message);
	$('#bkengine_alert_box').attr('title',dilogTitle);
	trans_ok = $('#trans_ok').length > 0?$('#trans_ok').val():'Ok';
	try{
		$('#bkengine_alert_box').dialog('destroy')
	}
	catch(e){}
	$('#bkengine_alert_box').dialog({
		  modal: true,
		  title: dilogTitle,
	      resizable: false,
	      dialogClass: cssDialogClass,
	      hide: {
		        effect: "fade",
		        duration: 500
		      },
	      show: {
		        effect: "fade",
		        //duration: 500
		      },
		 buttons: [{
		    	  "text" : trans_ok,
		      	  "class" : cssBtnClass,
		      	  click: function() {
		      		if(events == '' || events == null || events == 'undefined'){
		      		  $(this).dialog("close");
		      		}
		      		else{
		      			eval(events);
		      			$(this).dialog("close");
		      		}
		      	  }
		      }],
	    });

	return;
}


function showConfirmMessage(message,dilogTitle,yes_event,no_event)
{
	if(message == '' || message == null || message == 'undefined'){
		message = 'Error';
	}
	
	if(dilogTitle == '' || dilogTitle == null || dilogTitle == 'undefined'){
		dilogTitle = 'Message';
	}
	
	if($('#bkengine_alert_box').length <= 0){
		alert(message);
		return;
	}
	
	$('#bkengine_alert_box').html(message);
	//$('#bkengine_alert_box').attr('title',dilogTitle);
		
	$("#bkengine_alert_box" ).dialog({
	      dialogClass: 'ui-dialog-purple',
	      modal: true,
	      resizable: false,
	      height: 180,
	      modal: true,
	      title : dilogTitle,
	      buttons: [
	      	{
	      		'class' : 'btn green',	
	      		"text" : "Yes",
	      		click: function() {
	      			$(this).dialog( "close" );
	      			if(yes_event != '' && yes_event != null){
	      				eval(yes_event)
	    			}else{
	    				window.location.href = BASE_URL;
	    			}
	       			
    			}
	      	},
	      	{
	      		'class' : 'btn',
	      		"text" : "No",
	      		click: function() {
	      			$(this).dialog( "close" );
	      			if(no_event != '' && no_event != null){
	      				eval(no_event)
	    			}else{
	    				window.location.href = BASE_URL;
	    			}
	      			
    			}
	      	}
	      ]
	    });
	return;
}

// Use to show ajax based modals
function show_modal(source,popup,type,source2)
{
	if(popup == '' || popup == null || popup == 'undefined')
		popup = 'popups';


	url = '';
	if($(source).attr('data-url') !='' && $(source).attr('data-url') !=undefined && $(source).attr('data-url') !=null){
		if($(source).attr('data-url'))
			url = $(source).attr('data-url');
	}
	else{
		url = source2;
	}
	 
	if(url == '' || url == null || url == 'undefined')
	{
		alert('Error! Something went wrong. Please refresh your page and try again.');
		hideProcessingImage(); 
		return false;
	}
	
	// SET POPUP WIDTH
	var w = 600;
	if($(source).attr('data-width')){
		$('#'+popup).attr('data-width',$(source).attr('data-width'));
		
		w = $(source).attr('data-width');
		w = w.replace('px','');
		w = w.trim();

	}
	
	$('#'+popup).modal().on("hidden", function() {
		$('#'+popup).empty();
	});
		
	// Send request for popup
	showAjaxPopup(url,popup,type,w);
}


function show_as_active_tab(element,tab,class_name)
{
	if(class_name == '' || class_name == null || class_name == 'undefined')
		class_name = 'active';
			
	if($(element).length > 0 && $('#'+tab).length > 0)
	{
		$('#'+tab+' li, #'+tab+' a').removeClass(class_name); // Remove all active tabs
		$(element).addClass(class_name);		  // Show current active tab
	}
}

function showMenu(menu,child_menu)
{
	
	if(menu == '')
		menu = 'dashboard';
	$('#be_sidebar li').removeClass('active');
	$('.small_triangle').remove();
	// This show parent menu side-bar as selected
	$('#'+menu).prev().children('span:nth-last-child(-2)').addClass('selected'); // Show red downword-redarrow
	$('#'+menu).prev().children('span:last-child').addClass('open');
	$('#'+menu).parent().addClass('active'); //Show top parent menu as selected
	setTimeout(function(){
		$('li.active>a:first').append('<span class="small_triangle"></span>');
	},1);
	// FOR N LEVEL SUBMENUES
	if(child_menu != '' && child_menu !=null && child_menu !='undefined' && $('li#'+child_menu).length >0 ) // If main menu has item
	{
		$('li#'+child_menu).addClass('active'); // For Level 1 menus
		mcount = 1;
		
		// Show downword arrow to parent menu(appearing on left side)
		if($('li#'+child_menu).parent().prev().children('.arrow').length > 0)
			$('li#'+child_menu).parent().prev().children('.arrow').addClass('open');
		
		// for Level n-1 menus
		m_ele =$('li#'+child_menu).parent();
		do{
			if($(m_ele).attr('id') == menu)
				break; // top level reached
	
			m_ele =$(m_ele).parent();
			$(m_ele).addClass('active');
			
			if($(m_ele).prev().children('.arrow').length > 0)
				$(m_ele).prev().children('.arrow').addClass('open');
			
			if(mcount >= 10) // Max 10 level of submenu possible, (* Reason: to avoid infinite looping*) 
				break;
			mcount++;
			
		}while(1);

	}
}

function showProcessingImage(loading_params) 
{	
	if(typeof isBlocked == 'undefined' || typeof isBlocked == false || loading_params == 'undefined') {	
		var pageContent = $('body');
		App.blockUI(pageContent, true);
		isBlocked = true;
		return;
	
	}
}

function hideProcessingImage() 
{
	if(isBlocked){
		var pageContent = $('body');
		App.unblockUI(pageContent);
		isBlocked = false;
		return;		
	}	
}

function errorHandler(xmlResponse)
{
	hideProcessingImage();
	var array_error = new Array();
	var flag = 0;
	array_error[0] = '<b>fatal error</b>:';
	array_error[1] = '<b>warning</b>:';
	array_error[2] = '<b>notice</b>:';

	xmlResponse = xmlResponse.toLowerCase();
	for(i=0;i<array_error.length;i++)
	{
		var matchPos1 = xmlResponse.search(array_error[i]);
		
		if(matchPos1 != -1)
		{
			showAlertMessage(xmlResponse,'error');
			flag = 1;
			break;
		}
	}
	if(flag == 1)
	{
		return false; 
	}
	else
	{
		return true;
	}
}

function closeModal(popup ,query, other_oper)
{	
	if(other_oper !='undefined' && other_oper !=null && other_oper != '' && document.getElementById(other_oper).onclick)
	{
			$("#"+other_oper).click();
	}
		
	if(popup == '')
		popup = 'popups';

	if($('#'+popup).length > 0)
	{
		$('#'+popup).modal('hide'); // Close popup
		$('#'+popup).removeAttr('style');
		$('#'+popup).removeAttr('data-width');
	}
	
}

function fetchCityFromZip(zip,countryCode,elemCity)
{
	url = $('#BASE_URL').val();
	if(url != '' || url != null)
	{
		url = url +"cityfromzip"
		query_string = "ccode="+countryCode+"&zip="+zip+"&target="+elemCity;
		passRequest(url,query_string);
	}
}

function fetchPhoneInitials(countryCode,elemPhone,elemCell)
{
	url = $('#BASE_URL').val();
	
	if(url != '' || url != null)
	{
		url = url +"phoneinitials"
		query_string = "ccode="+countryCode+"&target1="+elemPhone+"&target2="+elemCell;
		passRequest(url,query_string);
	}
}

function deleteRecord(script_name, query_string,confiem_msg_string)
{
	var confiem_msg;
	
	if(confiem_msg_string != 'undefined' && confiem_msg_string != null && confiem_msg_string != ''){
		confiem_msg = confiem_msg_string;
	}
	else{
		confiem_msg = document.getElementById('confiem_msg').value;
	}
	
	
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
		      		sendRequest(script_name, query_string);
	       			$(this).dialog( "close" );
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

function deleteRecords(script_name, query_string,confiem_msg_string)
{
	var confiem_msg;
	
	if(confiem_msg_string != 'undefined' && confiem_msg_string != null && confiem_msg_string != ''){
		confiem_msg = confiem_msg_string;
	}
	else{
		confiem_msg = document.getElementById('confirms_msg').value;
	}
	
	
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
		      		sendRequest(script_name, query_string);
	       			$(this).dialog( "close" );
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

function deletePartnerRecord(script_name, query_string,confirm_msg_string)
{
	var confirm_msg;
	
	if(confirm_msg_string != 'undefined' && confirm_msg_string != null && confirm_msg_string != ''){
		confirm_msg = confirm_msg_string;
	}
	else{
		confirm_msg = document.getElementById('confirm_msg').value;
	}
	
	
	title = $('#confirmation_btn_text').length >0 ?$('#confirmation_btn_text').val():'Alert message';
	
	 $("#bkengine_alert_box" ).html(confirm_msg);
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
		      		sendRequest(script_name, query_string);
	       			$(this).dialog( "close" );
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

function disableRecord(script_name, query_string,confiem_msg_string)
{
	var confiem_msg;
	
	if(confiem_msg_string != 'undefined' && confiem_msg_string != null && confiem_msg_string != ''){
		confiem_msg = confiem_msg_string;
	}
	else{
		confiem_msg = document.getElementById('confiem_msg').value;
	}
	
	title = $('#confirmation_btn_text').length >0 ?$('#confirmation_btn_text').val():'Alert message';
	
	 $("#bkengine_alert_box" ).html(confiem_msg);
	 $("#bkengine_alert_box" ).dialog({
	      dialogClass: 'ui-dialog-blue',
	      modal: true,
	      title:title,
	      resizable: false,
	      height: 180,
	      width: 380,
	      modal: true,
	      buttons: [
	      	{
	      		'class' : 'btn red',	
	      		"text" : 'Disable',
	      		click: function() {
		      		sendRequest(script_name, query_string);
	       			$(this).dialog( "close" );
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

function submitControl(control, e)
{
	
	var con = document.getElementById(control);
	
	if(window.event)
	{
		  key = window.event.keyCode;     // IE
	}
	else
	{
		  key = e.which;     // firefox
	}
	
	if(key == 13)
	{
		if(con){
			con.onclick();
		}
			
		return false;
	}
}

function openPdf(pdf_path){
	if(pdf_path == '' || pdf_path == null || pdf_path == 'undefined'){
		return;
	}
	window.open(pdf_path,'open_window','menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0');
} 


/**
** The controller check box when checked it will automaticaly mark all the 
**  forms check box as "selected"
** @Param - form name(string), name(string)[optional]
** @Return type - void.
**/
function select_all_check_box(form_name, name , check_all,multicheck)
{
	var control_name = "";
	if(name !='undefined' && name !=null)
	{
		control_name = name;
	}
	var select_name = "checkall";
	if(check_all !='undefined' && check_all !=null)
	{
		select_name = check_all;
	}
	 
	var frm = eval("document."+form_name);
	
	var chk_length = frm.length;

	var counter = 0; 
	var select_all = document.getElementById(select_name);
	
	
	if(select_all.checked == true)
	{
		for(var i=0; i<chk_length; i++)
		{
			var element = frm.elements[i];
			if(multicheck == 'multicheck')
			{
				var element_name = element.alt;
			}
			else
			{
				var element_name = element.name;
			}
			if(element.type == 'checkbox' && element.disabled == false )
			{
				if(control_name != "" && element_name == control_name)
				{
					element.checked = true;
					if($(element).parent().parent().hasClass('checker'))
						$(element).parent().addClass('checked');
				}
				else if(control_name == "")
				{
					element.checked = true;
					if($(element).parent().parent().hasClass('checker'))
						$(element).parent().addClass('checked');
				}
			}
		}
	}
	else
	{
		for(var i=0; i<chk_length; i++)
		{
			var element = frm.elements[i];
			if(multicheck == 'multicheck')
			{
				var element_name = element.alt;
			}
			else
			var element_name = element.name;
			if(element.type == 'checkbox')
			{
				if(control_name !="" && element_name == control_name)
				{
					element.checked =false;
					//018 02 OCT 2013 - ID:9994
					if($(element).parent().parent().hasClass('checker'))
						$(element).parent().removeClass('checked');
				}
				else if(control_name =="")
				{
					element.checked =false;
					//018 02 OCT 2013 - ID:9994
					if($(element).parent().parent().hasClass('checker'))
						$(element).parent().removeClass('checked');
				}
				
				
			}
		}
	}
}

function limitCharacters(target,limit){	
	if( $("#"+target).length > 0 && !isNaN(limit)){
		$("#"+target).inputmask({ "mask": "a", "repeat": limit,"greedy": false});
	}
}

function limitDigits(target,limit){
	if( $("#"+target).length > 0 && !isNaN(limit)){
		$("#"+target).inputmask({ "mask": "9", "repeat": limit,"greedy": false,'placeholder':''});
	}
}

function limitAlphanumeric(target,limit){
	if( $("#"+target).length > 0){
		$("#"+target).inputmask({ "mask": "*", "repeat": limit,"greedy": false});
	}
}

function limitEIN(target,limit){
	if( $("#"+target).length > 0){
		$("#"+target).keypress(function(event){
			if((limit == 'undefined') || (limit ==null) ) {
				var limit = 30;
			}
			var len = $(this).val().length;
			charCode = (event.which) ? event.which : event.keyCode;
			 if ((charCode == 65 || charCode == 67 || charCode == 86 || charCode == 88 || charCode ==90  || charCode == 97 || charCode == 99 || charCode == 118 || charCode == 120 || charCode == 122) && event.ctrlKey) {
				return; 
			 }else if((charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 32) || (charCode == 8) || (charCode == 9) || (charCode == 37) || (charCode == 38) || (charCode == 39) || (charCode == 40) || (charCode == 45)){
				 if (charCode < 0x20) {
					return; 
				 }
				 
				 if (len > limit) { 
					 event.preventDefault();
				 }
				 
			}else{
				event.preventDefault();	
			}	
		});
	}	
}

function validateMobile(target,limit){
	if( $("#"+target).length > 0){
		if((limit == 'undefined') || (limit ==null) ) {
			var limit = 19;
		}
		$("#"+target).inputmask({ "mask": "9", "repeat": limit,"greedy": false,'placeholder':''});
	}
}

function limitAlphadigitValue(target,limit){
	if( $("#"+target).length > 0){
		 $("#"+target).keypress(function(event){
			if((limit == 'undefined') || (limit ==null) ) {
				var limit = 15;
			}
			var len = $(this).val().length;
			charCode = (event.which) ? event.which : event.keyCode;
			 if ((charCode == 65 || charCode == 67 || charCode == 86 || charCode == 88 || charCode ==90  || charCode == 97 || charCode == 99 || charCode == 118 || charCode == 120 || charCode == 122) && event.ctrlKey) {
				return; 
			 }else if((charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 32) || (charCode == 8) || (charCode == 9) || (charCode == 37) || (charCode == 38) || (charCode == 39) || (charCode == 40) || (charCode == 45)){
				 if (charCode < 0x20) {
					return; 
				 }
				 
				 if (len > limit) { 
					 event.preventDefault();
				 }
				 
			}else{
				event.preventDefault();	
			}
		});
	}	
}

function limitAlphanumericValue(target,limit){
	if( $("#"+target).length > 0){
		 $("#"+target).keypress(function(event){
			if((limit == 'undefined') || (limit ==null) ) {
				var limit = 29;
			}
			var len = $(this).val().replace(/[^0-9]/g,"").length;
			charCode = (event.which) ? event.which : event.keyCode;
			 if ((charCode == 65 || charCode == 67 || charCode == 86 || charCode == 88 || charCode ==90  || charCode == 97 || charCode == 99 || charCode == 118 || charCode == 120 || charCode == 122) && event.ctrlKey) {
				return; 
			 }else if((charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 32) || (charCode == 8) || (charCode == 9) || (charCode == 37) || (charCode == 38) || (charCode == 39) || (charCode == 40) || (charCode == 45)){
				 if (charCode < 0x20) {
					return; 
				 }
				 
				 if (len > limit) { 
					 event.preventDefault();
				 }
				 
			}else{
				event.preventDefault();	
			}
		});
	}	
}

//#024 05-05-2016 #34581, Question, bank account number
	function limitBankAccount(target,limit){
		if( $("#"+target).length > 0){
			if((limit == 'undefined') || (limit ==null) ) {
				var limit = 19;
			}
			$("#"+target).inputmask({ "mask": "9", "repeat": limit,"greedy": false,'placeholder':''});
		}	
	}
//#024 05-05-2016 #34581, Question, bank account number

function load_calendar(source)
{
	
	var script = $('#'+source).attr('data-url');

	var limit  = $('#limit').val();
	var offset  = $('#offset').val();
	var total_records  = $('#total_records').val();

	var per_row = $('#per_row').val();
	
	var data = 'limit='+per_row+'&offset='+offset+'&per_row='+per_row;
	
	$.ajax({
	    type: "POST",
	    url: script,
	    data: data,
	    beforeSend: function (xhr) 
        {
	    	showProcessingImage();
		   // xhr.setRequestHeader("X-Requested-With", "AJAX");
	       // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
	    success: function(data,status,xhr){
	    	hideProcessingImage();
			var new_offset = parseInt(offset) + 2;
			$('#offset').val(new_offset);
			var body_text1 = data.split('load_content&#135;_&#135;');
			$('#all_calendars #inner_row').append(body_text1);
			if(offset == (parseInt(total_records) - 1))
			{
				$('#load_more_calendar').hide();
			}
			$('html, body').animate({scrollTop:$(document).height()}, 'slow');
			return false;

			
	    	
	    },
	    error: function(xhr, status, error){
	    	hideProcessingImage();
	    	if(xhr.status && xhr.status == 400)
	    	{
	    		var obj = jQuery.parseJSON(xhr.responseText);
	    		showAlertMessage(obj.message,'error');
            }
	        else
	        {
	    	   showAlertMessage("There was a problem accessing the server: " +xhr.statusText+"\n"+"*Please refresh the page and try again",'error');
	    	   return;
	        }
	    }
	});
}


function add_calendar(source,data)
{	

	$.ajax({
	    type: "POST",
	    url: source,
	    data: data,
	    beforeSend: function (xhr) 
        {
	    	showProcessingImage();
		   // xhr.setRequestHeader("X-Requested-With", "AJAX");
	       // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
	    success: function(data,status,xhr){
	    	hideProcessingImage();
			var new_offset = parseInt(offset) + 2;
			$('#offset').val(new_offset);
			
			$('#total').val($('#staffs').val().length);

			
			var body_text1 = data.split('load_content&#135;_&#135;');
			$('#all_calendars #inner_row').append(body_text1);
			if(offset == (parseInt(total_records) - 1))
			{
				$('#load_more_calendar').hide();
			}

			var per_row = $('#change_row option:selected').val();

			check_change($('#staffs').val().length,per_row);

			
	    },
	    error: function(xhr, status, error){
	    	hideProcessingImage();
	    	if(xhr.status && xhr.status == 400)
	    	{
	    		var obj = jQuery.parseJSON(xhr.responseText);
	    		showAlertMessage(obj.message,'error');
            }
	        else
	        {
	    	   showAlertMessage("There was a problem accessing the server: " +xhr.statusText+"\n"+"*Please refresh the page and try again",'error');
	    	   return;
	        }
	    }
	});
}


// Fetch form data
function SaveCalendarDefaultView(form,script_name,other_params)
{
	if($('#'+form).length <= 0)
	{
		showAlertMessage('Form is missing','error');
		return false;
	}
	
	if(script_name == '' || script_name == null || script_name == 'undefined')
	{
		showAlertMessage('Script is missing','error');
		return false;
	}

	
	
	query_string = '';
	var ids = $("#select_staffs").chosen().val();
	//var per_row = $('#change_row').val();
	
	var tie_allcalendars = '0';
	if($('#default_tie_allcalendars_prop').is(':checked')){
		tie_allcalendars = '1';
	}else{
		tie_allcalendars = '0';
	}
	
	var data = [];
	$.each(ids, function( index, value ) {
			
		var view = $('#calendar'+value).fullCalendar('getView');
		
		data.push({
			contact_id:value,
			view:view.name
		});


	});
	
	//contact_ids = ItemArray.serialize();	

	
	//var str = jQuery.param( ItemArray );

	//if(other_params != '' && other_params != null && other_params != 'undefined')
		//query_string = 'ItemArray='+ItemArray;
	query_string += 'contacts='+JSON.stringify(data)+'&tie_allcalendars='+tie_allcalendars;
	
	sendRequest(script_name, query_string);
}

function check_change(total,view)
{

	if(view == 2 && total < 2)
	{
		change_per_row(total,total);
		return;
	}

	if(view == 3 && total < 3)
	{
		change_per_row(total,total);
		return;
	}
	
	if(view == 4 && total < 4)
	{
		change_per_row(total,total);
		return;
	}
	
	if(total >= view)
	{
		change_per_row(view,total);
		return;
	}
}


function change_view(display_view)
{
		view = 'month';
		if(display_view == 'day'){
			view = 'agendaDay';
		}
		if(display_view == 'week'){
			view = 'agendaWeek';
		}
		if(display_view == 'month'){
			view = 'month';
		}

		var ids = $("#staffs").chosen().val();
		
		$.each(ids, function( index, value ) {
			
			$('#calendar'+value).fullCalendar( 'changeView', view );
			
		});
	
}

function tie_all(source)
{
	if($('#default_tie_allcalendars').is(':checked')){

		var closest = $( source ).closest( ".fc-ltr" );
		
		var existing_id = $(closest).attr('rel');
		
		var ids = $("#staffs").chosen().val();
		
		var view = $('#calendar'+existing_id).fullCalendar('getView');
		var d = $('#calendar'+existing_id).fullCalendar('getDate');
		d = d.format();
		//date = new Date(sdate);
		//alert("The current date of the calendar is " + moment.format());
		//d = new Date(d);
		//var month_int = d.getMonth();
		//var year_int = d.getFullYear();
		//var date_int = d.getDate();
		//console.log('date-'+d.format());	return;	
		$.each(ids, function( index, value ) {
			if(existing_id != value){
				
				//$('#calendar'+value).fullCalendar( 'gotoDate', year_int, month_int,date_int)
				$('#calendar'+value).fullCalendar( 'gotoDate', d);
				$('#calendar'+value).fullCalendar( 'changeView', view.name );
				//var next = $('#calendar'+value).fullCalendar(nav);
			}
		});
		return;

	}
}

function confirmationDialog(title,confiem_msg,btn1_text,btn2_text,btn1_action,btn2_action)
{
	if(title == '' || title == null){
		title = $('#confirmation_btn_text').val();
	}
	
	if(confiem_msg == '' || confiem_msg == null){
		confiem_msg = $('#confirm_any_one_btn_text').val();
	}
		
	if(btn1_text == '' || btn1_text == null){
		btn1_text = $('#yes_btn_text').val();
	}
	
	if(btn2_text == '' || btn2_text == null){
		btn2_text = $('#no_btn_text').val();;
	}
	
		
	$("#bkengine_alert_box" ).html(confiem_msg);
	$("#bkengine_alert_box" ).dialog({
	      dialogClass: 'ui-dialog-blue',
	      title:title,
	      modal: true,
	      resizable: false,
	      height: 180,
	      width: 500,
	      modal: true,
	      buttons: [
	      	{
	      		'class' : 'btn green',	
	      		"text" : btn1_text,
	      		click: function() {
	      			$(this).dialog( "close" );
	      			if(btn1_action != '' && btn1_action != null){
	      				eval(btn1_action);
	    			}else{
	    				window.location.href = BASE_URL;
	    			}
	       			
     			}
	      	},
	      	{
	      		'class' : 'btn purple',	
	      		"text" : btn2_text,
	      		click: function() {
	      			$(this).dialog( "close" );
	      			if(btn2_action != '' && btn2_action != null){
	      				eval(btn2_action);
	    			}else{
	    				window.location.href = BASE_URL;
	    			}
	       			
     			}
	      	},
	      	{
	      		'class' : 'btn',
	      		"text" : $('#closee_btn_text').val(),
	      		 click: function() {
	      			$(this).dialog( "close" );	      			
     			}
	      	}
	      ]
	    });	
}

// SEND POPUP REQUEST WITH QUERY STRING
function showPopup(server_script,query_string,popup,popup_width,send_type)
{
	// SET POPUP WIDTH
	if(popup_width == 'undefined' || popup_width == null || popup_width =="") {
	}else{
		if((popup_width.search('px')) != -1){
				w = popup_width.replace('px','');
				w = w.trim();
		}else{
			w = popup_width;
		}
		$('#'+popup).attr('data-width',popup_width);
		$('#'+popup).width(w);
		}
	
	$('#'+popup).modal().on("hidden", function() {
		$('#'+popup).empty();
	});
	
	default_type = 'GET';
	if(send_type == '' || send_type == null || send_type == 'undefined'){
		send_type = default_type;
	}
	
	if(query_string != 'undefined' ||  query_string == null || query_string !="") {
		
		query_str = "&"+query_string;
		
	}
	
   $.ajax({
	    type: send_type,
	    url: server_script,
	    data: "tab="+popup+query_str,
	    beforeSend: function (xhr)
        {
	    	showProcessingImage('undefined'); 
		    //xhr.setRequestHeader("X-Requested-With", "AJAX");
			//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
	    success: function(data,status,xhr){
	    	hideProcessingImage(); 
	    	//stop background scrolling

	    	var body_text = data.split('&#135;_&#135;');
	    	if(body_text.length >1)
	    	{
	    		data = body_text[1];
	    		
    			if(body_text[0] == 'page_load'){
    				window.location.href = body_text[1];
    				return;
    			}else if(body_text[0] == 'exe_eval'){
    				eval(body_text[1]);
    				return;
    	    	}
    			
	    	}
	    	
	       	$('#'+popup).resize();
	    	$('#'+popup).html(data);
	    },
	    error: function(xhr, status, error){
	    	hideProcessingImage();
	    	$('#'+popup).modal('hide'); // remove backdrop
	    	if(xhr.status && xhr.status == 400)
	    	{
	    		var obj = jQuery.parseJSON(xhr.responseText);
	    		showAlertMessage(obj.message,'error');
           }
	       else
	       {
	    	   showAlertMessage("There was a problem accessing the server: " + xhr.statusText +"<br>"+"*Please refresh the page and try again",'error');
           }	       
	    }
	});
}

function fetchPhoneNumberInitialsOnly(countryCode,elemPhone)
{
	url = $('#BASE_URL').val();
	
	if(url != '' || url != null)
	{
		url = url +"phoneinitials"
		query_string = "ccode="+countryCode+"&target1="+elemPhone;
		passRequest(url,query_string);
	}
}

(function($) {
	$.fn.extend( {
		limiter: function(limit, elem) {
			$(this).on("keyup focus", function() {
				setCount(this, elem);
			});
			function setCount(src, elem) {
				var chars = src.value.length,
					messages = Math.ceil(chars / 160),
					remaining = messages * 160 - (chars % (messages * 160) || messages * 160);

				elem.val(remaining + ' / '+ messages);
			}
			setCount($(this)[0], elem);
		}
	});

})(jQuery);


//024 12-04-2016 #34083, Fwd: SMS billing and parts counting > Ui changes
	function count_ucs2_string(string)
	{
		var utf16str = unescape( encodeURIComponent( string ) );
		// C* option gives an unsigned 16-bit integer representation of each byte
		// which option you choose doesn't actually matter as long as you get one value per byte
		var counter = utf16str.length;
		return counter / 2;
	}

	function count_gsm_string(str)
	{
		// Basic GSM character set (one 7-bit encoded char each)
		var gsm_7bit_basic = "@£$¥èéùìòÇØøÅå_ÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
		
		//var excluded_characters = "ΔΦΓΛΩΠΨΣΘΞ";
			
		// Extended set (requires escape code before character thus 2x7-bit encodings per)
		var gsm_7bit_extended = "^{}\[~]|€\n";
		var len = 0;
		var count = 0;
		for(i = 0; i < str.length; i++) {
			if(gsm_7bit_basic.indexOf(str[i]) != -1) {
				len++;
			} else  if(gsm_7bit_extended.indexOf(str[i]) != -1) {
				len += 2;
				count ++;
			}
		}
		
		if(len < 0){
			return -1;	
		}else{
			return len;	
		}
	}

	function multipart_count(str)
	{
		var one_part_limit = 160; // use a constant i.e. GSM::SMS_SINGLE_7BIT
		var multi_limit = 153; // again, use a constant
		
		var str_length = count_gsm_string(str);
		if(str_length === -1) {
			one_part_limit = 70; // ... constant
			multi_limit = 67; // ... constant
			str_length = count_ucs2_string(str);
		}
			
	   if(str_length <= one_part_limit) {
			// fits in one part
			return 1;
		} else {
		   var length_count = str_length/multi_limit;
		   return Math.ceil(length_count);
		}
	}
	
	function get_multipart_count(str)
	{
		var one_part_limit = 160; // use a constant i.e. GSM::SMS_SINGLE_7BIT
		var multi_limit = 153; // again, use a constant
		
		var str_length = count_gsm_string(str);
		if(str_length < 0) {
			one_part_limit = 70; // ... constant
			multi_limit = 67; // ... constant
			str_length = count_ucs2_string(str);
		}
		
		return str_length;
	}
//024 12-04-2016 #34083, Fwd: SMS billing and parts counting > Ui changes
// #024 13-07-2016 #35358, BE > Inventory module > Step 5
	Number.prototype.format = function(n, x, s, c) {
		var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
			num = this.toFixed(Math.max(0, ~~n));

		return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
	};
	
	function convertIntoRealStandardFormat(input_number)
	{
		var number = input_number.format(2, 3, ',', '.');
		return number;
	}
	
	function changeSiteNumberFormat(input_number)
	{
		var number = input_number.format(2, 3, '.', ',');
		return number;
	}
$(document).ready(function(){
	$('.quick-nav,.quick-nav-overlay').click(function(n){
		$('.quick-nav').toggleClass("nav-is-visible");
		n.preventDefault();
	});
	$(document).click(function(event) {
		var flag = 0;
		try{
			if(event.target.id.indexOf('_toggle_btn_')!=-1){
				var flag = 1;
			} 
			if(event.target.id=='div_quotes' || event.target.id=='div_customers' || $(event.target).hasClass('customers') || $(event.target).hasClass('cust') || $(event.target).hasClass('icon-angle-down') || $(event.target).hasClass('hidden-phone') || $(event.target).hasClass('table-new-advance')){
				var flag= 1;
			}
		    if(flag==0 && !$(event.target).closest('#searchSearchText').length && !$(event.target).closest('#ss_search_button').length) {
		       	if(!$('#searchSearchText').hasClass('ss_hidden')){
		       		if(screen.width<768){
				    	setTimeout(function(){
				    		$('.search_bar').attr('style','');
							$('.ss-page-logo').show();
							$('.ss_sidebar_toggler').show();
							$("#searchSearchText").hide();
							$('#searchSearchText').addClass('ss_hidden');
							$(".navbar .nav.pull-right").removeAttr('style');
							 $('.ss_search_btn').css('background-color','');
							 $('#sidebar_search_list').html('');
							  $('#searchSearchText').val('');
							  $('#sidebarSearch').removeClass('open');
				      	},1);
				    }
				    else{
				    
				      	$("#searchSearchText").animate(
				        	{width: '0'},
				        	function(){
				          		$("#searchSearchText").hide();
				          		$('#searchSearchText').addClass('ss_hidden');
				          		$('.ss_search_btn').css('background-color','');
				          		$(".navbar .nav.pull-right").removeAttr('style');
				          		$('#sidebar_search_list').html('');
								$('#searchSearchText').val('');
								$('#sidebarSearch').removeClass('open');
				      	}); 
				    }
		       }
		    }        
	    }
	    catch(e){
	    	console.log('eee',e);
	    }
	});

});


// #024 13-07-2016 #35358, BE > Inventory module > Step 5	

var doAjax_params_default = {
  'url': null,
  'requestType': "POST",
  'dataType': 'json',
  'data': {},
  'beforeSendCallbackFunction': null,
  'successCallbackFunction': null,
  'completeCallbackFunction': null,
  'errorCallBackFunction': null,
};

function doAjax(doAjax_params) {
		var url = doAjax_params['url'];
		var data = doAjax_params['data'];
		var requestType =  doAjax_params['requestType'];
		var beforeSendCallbackFunction = doAjax_params['beforeSendCallbackFunction'];
		var successCallbackFunction = doAjax_params['successCallbackFunction'];
		var completeCallbackFunction = doAjax_params['completeCallbackFunction'];
		var errorCallBackFunction = doAjax_params['errorCallBackFunction'];
		var dataType = doAjax_params['dataType'];
      $.ajax({
          url: url,
          type: requestType,
          async:true,
          dataType : dataType,
          data: data,
          beforeSend: function(jqXHR, settings) {
              if (typeof beforeSendCallbackFunction === "function") {
                  beforeSendCallbackFunction();
              }
          },
          success: function(data, textStatus, jqXHR) {
          		//alert(JSON.stringify(data));
      			if(data.status == 'error' && "action" in data.response && data.response.action == 'logout'){
      				localStorage.setItem('loggedout','y');
							localStorage.removeItem('loggedout');
							showlogin.show();
      			}

              if (typeof successCallbackFunction === "function") {
                  successCallbackFunction(data);
              }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              if (typeof errorCallBackFunction === "function") {
                  errorCallBackFunction(errorThrown);
              }

          },
          complete: function(jqXHR, textStatus) {
              if (typeof completeCallbackFunction === "function") {
                  completeCallbackFunction();
              }
          }
      });
}



function getViewFile(type,controller,action,menu_id,sub_menu_id){
  window.history.pushState('', '','/'+type+'/'+controller+'/'+action);
   showMenu(menu_id,sub_menu_id);
  var params = $.extend({}, doAjax_params_default);
  var total_params = {tst:'tst'};
  params['url'] = $('#BASE_URL').val()+controller+'/'+action;
  params['data'] = total_params;
  params['dataType'] = "text";
  
  params['requestType'] = "GET";
  params['successCallbackFunction'] = function (complet_data){
    var body_text1 = complet_data.split('load_content&#135;_&#135;');
    $('#content').html(body_text1);
  }
  doAjax(params);
  return; 
}
var d = new Date();
d = d.getTime();
var css_js_version  = $('#css_js_version').val();


function new_popup(w=750,popups='popups',jsname){
	$('#'+jsname+'_template').remove();
	
	$('#'+popups).modal('show');
	$('#'+popups).css('width',w+'px');
	$('#'+popups).data().modal.options.width = w;
	$('#'+popups).addClass(jsname+'_popup');

	$('#'+popups).attr('data-width',w);
	$('#'+popups).modal().on("hidden", function() {
		$('#'+popups).empty();
	});

	$.ajaxSetup({ cache: false });

	var url1 = $('#HOST_URL').val()+"app/webroot/js/popup_templates/"+jsname+".html?v="+css_js_version;
	var url2 = $('#HOST_URL').val()+"app/webroot/js/popup_templates/"+jsname+".js?v="+css_js_version;
	var storagecache = localStorage.getItem('storagecache');
	if(storagecache!=null){
		var d1 = null;
		var d2 = null;
	}
	else{
		var d1 = localStorage.getItem(url1);
		var d2 = localStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			enable(popups);
		}
		else{
			$.getScript(url2, function( data ) {
				localStorage.setItem(url2,data);
				enable(popups);
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			localStorage.setItem(url1,data);
			if(d2 != null ){
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				enable(popups);
			}
			else{
				$.getScript(url2, function( data ) {
					localStorage.setItem(url2,data);
					enable(popups);
				});
			}

		});
	}
}

function new_custom_popup(w=750,popups='popups',jsname,metadata){
	$('#'+jsname+'_template').remove();
	
	if(checkNull(metadata) != '' && "backdrop" in metadata && metadata.backdrop == 'static'){
		$('#'+popups).modal({
			backdrop: 'static',
			keyboard: false,
			resize:true
		});
		
	}
	$('#'+popups).modal('show');
	$('#'+popups).css('width',w+'px');
	$('#'+popups).data().modal.options.width = w;
	$('#'+popups).addClass(jsname+'_popup');

	$('#'+popups).attr('data-width',w);
	$('#'+popups).modal().on("hidden", function() {
		$('#'+popups).empty();
	});

	$.ajaxSetup({ cache: false });

	var url1 = $('#HOST_URL').val()+"app/webroot/js/popup_templates/"+jsname+".html?v="+css_js_version;
	var url2 = $('#HOST_URL').val()+"app/webroot/js/popup_templates/"+jsname+".js?v="+css_js_version;
	var storagecache = localStorage.getItem('storagecache');
	if(storagecache!=null){
		var d1 = null;
		var d2 = null;
	}
	else{
		var d1 = localStorage.getItem(url1);
		var d2 = localStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[jsname].start(popups,metadata);
		}
		else{
			$.getScript(url2, function( data ) {
				localStorage.setItem(url2,data);
				window[jsname].start(popups,metadata);
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			localStorage.setItem(url1,data);
			if(d2 != null ){
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[jsname].start(popups,metadata);
			}
			else{
				$.getScript(url2, function( data ) {
					localStorage.setItem(url2,data);
					window[jsname].start(popups,metadata);
				});
			}

		});
	}

}
function new_custom_popup2(w=750,popups='popups',jsname,metadata){
	$('#'+jsname+'_template').remove();
	
	if(checkNull(metadata) != '' && "backdrop" in metadata && metadata.backdrop == 'static'){
		$('#'+popups).modal({
			backdrop: 'static',
			keyboard: false,
			resize:true
		});
		
	}
	$('#'+popups).modal('show');
	$('#'+popups).css('width',w+'px');
	$('#'+popups).data().modal.options.width = w;
	$('#'+popups).addClass(jsname+'_popup');

	$('#'+popups).attr('data-width',w);



	$('#'+popups).modal().on("hidden", function() {
		if(jsname in window && "onModalClose" in window[jsname]){
			window[jsname].onModalClose();
		}

		$('#'+popups).empty();
		$('.navbar').css('filter','blur(0px)');
		$('.page-container').css('filter','blur(0px)');

		var w = $('.content_todos_add').outerWidth() - (52+22+22+5+5+5);
		if($('.todo-projects-item p.content').length!=0){
			$('.todo-projects-item p.content').css('width',w+'px');
		}
		setTimeout(function(){
			var w = $('.content_todos_add').outerWidth() - (52+22+22+5+5+5);
			if($('.todo-projects-item p.content').length!=0){
				$('.todo-projects-item p.content').css('width',w+'px');
			}
		
		},220);
		
	});
	$.ajaxSetup({ cache: false });
	var url1 = $('#HOST_URL').val()+"app/webroot/js/popup_templates/"+jsname+"/"+jsname+".html?v="+css_js_version;
	var url2 = $('#HOST_URL').val()+"app/webroot/js/popup_templates/"+jsname+"/"+jsname+".js?v="+css_js_version;
	var storagecache = localStorage.getItem('storagecache');
	if(storagecache!=null){
		var d1 = null;
		var d2 = null;
	}
	else{
		var d1 = localStorage.getItem(url1);
		var d2 = localStorage.getItem(url2);
	}

	if(d1!= null ){
		$('body').append(d1);
		if(d2 != null ){
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[jsname].start(popups,metadata);
				$(window).trigger('resize.modal');
		}
		else{
			$.getScript(url2, function( data ) {
				localStorage.setItem(url2,data);
				window[jsname].start(popups,metadata);
					$(window).trigger('resize.modal');
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			localStorage.setItem(url1,data);
			if(d2 != null ){
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[jsname].start(popups,metadata);
					$(window).trigger('resize.modal');
			}
			else{
				$.getScript(url2, function( data ) {
					localStorage.setItem(url2,data);
					window[jsname].start(popups,metadata);
					$(window).trigger('resize.modal');
				});
			}
		});
	}
}

function new_tabs(jsname,tab_id){
	$('#'+jsname+'_template').remove();
	var img_url = $('#HOST_URL').val()+'app/webroot/img/loading.gif';
	$('#'+tab_id).html("<img src='"+img_url+"'/>");
	$('#general_price li').removeClass('active');
	$('#'+tab_id).addClass('active');
	$.ajaxSetup({ cache: false });

	var url1 = $('#HOST_URL').val()+"app/webroot/js/tabs_templates/"+jsname+".html?v="+css_js_version;
	var url2 = $('#HOST_URL').val()+"app/webroot/js/tabs_templates/"+jsname+".js?v="+css_js_version;
	var storagecache = localStorage.getItem('storagecache');
	if(storagecache!=null){
		var d1 = null;
		var d2 = null;
	}
	else{
		var d1 = localStorage.getItem(url1);
		var d2 = localStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			tabfunc.start();
		}
		else{
			$.getScript(url2, function( data ) {
				localStorage.setItem(url2,data);
				tabfunc.start();
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			localStorage.setItem(url1,data);
			if(d2 != null ){
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				tabfunc.start();
			}
			else{
				$.getScript(url2, function( data ) {
					localStorage.setItem(url2,data);
					tabfunc.start();
				});
			}

		});
	}	
}

function new_custom_tabs(jsname,tab_id,metadata={}){
	$('#'+jsname+'_template').remove();
	var img_url = $('#HOST_URL').val()+'app/webroot/img/loading.gif';
	$('#'+tab_id).html("<img src='"+img_url+"'/>");
	$('#general_price li').removeClass('active');
	$('#'+tab_id).addClass('active');
	$.ajaxSetup({ cache: false });

	var url1 = $('#HOST_URL').val()+"app/webroot/js/tabs_templates/"+jsname+".html?v="+css_js_version;
	var url2 = $('#HOST_URL').val()+"app/webroot/js/tabs_templates/"+jsname+".js?v="+css_js_version;
	var storagecache = localStorage.getItem('storagecache');
	if(storagecache!=null){
		var d1 = null;
		var d2 = null;
	}
	else{
		var d1 = localStorage.getItem(url1);
		var d2 = localStorage.getItem(url2);
	}


	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			var script = d2
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[jsname].start(tab_id,metadata)
		}
		else{
			$.getScript(url2, function( data ) {
				localStorage.setItem(url2,data);
				window[jsname].start(tab_id,metadata)
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			localStorage.setItem(url1,data);
			if(d2 != null ){
				var script = d2
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[jsname].start(tab_id,metadata);
			}
			else{
				$.getScript(url2, function( data ) {
					localStorage.setItem(url2,data);
					window[jsname].start(tab_id,metadata)
				});
			}

		});
	}	
}

function new_custom_tabs2(jsname,tab_id,metadata={}){
	$('#'+jsname+'_template').remove();
	var img_url = $('#HOST_URL').val()+'app/webroot/img/loading.gif';
	$('#'+tab_id).html("<img src='"+img_url+"'/>");
	$('#general_price li').removeClass('active');
	$('#'+tab_id).addClass('active');
	$.ajaxSetup({ cache: true });

	var url1 = $('#HOST_URL').val()+"app/webroot/js/tabs_templates/"+jsname+"/"+jsname+".html?v="+css_js_version;
	var url2 = $('#HOST_URL').val()+"app/webroot/js/tabs_templates/"+jsname+"/"+jsname+".js?v="+css_js_version;
	var storagecache = localStorage.getItem('storagecache');
	if(storagecache!=null){
		var d1 = null;
		var d2 = null;
	}
	else{
		var d1 = localStorage.getItem(url1);
		var d2 = localStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[jsname].start(tab_id,metadata)
		}
		else{
			$.getScript(url2, function( data ) {
				localStorage.setItem(url2,data);
				window[jsname].start(tab_id,metadata)
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			localStorage.setItem(url1,data);
			if(d2 != null ){
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[jsname].start(tab_id,metadata);
			}
			else{
				$.getScript(url2, function( data ) {
					localStorage.setItem(url2,data);
					window[jsname].start(tab_id,metadata)
				});
			}

		});
	}	
}

function checkCustomFieldData(value, mandatory){
  var rv = true; // <=== Default return value
  if(mandatory == 'y'){
	  if(value == '')
		  return rv = false; // <=== Assigns false to `rv` and returns it
  }
  return rv; // <=== Use rv here
}

(function( $ ){
   	$.fn.acceptOnlyNumber = function() {
	    $(this).keydown(function (e) {
	    	  // Allow: backspace, delete, tab, escape, enter and .
		    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
	            // Allow: Ctrl+A, Command+A
	            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
	            // Allow: home, end, left, right, down, up
	            (e.keyCode >= 35 && e.keyCode <= 40)) {
	                // let it happen, don't do anything
	                return;
	        }
	        // Ensure that it is a number and stop the keypress
	        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	            e.preventDefault();
	        }
	    });
   }; 
})( jQuery );


function new_main_page(urrl,menu_id,sub_menu_id,main_page_template_id){
	if(window.location.pathname != urrl){
		window.history.pushState('', '', urrl);
	}
	$(window).unbind();
	$(window).unbind('scroll');
	$('#'+main_page_template_id+'_template').remove();
	if ($('div.nav-collapse').hasClass('in')) {
	    $('div.nav-collapse').removeClass('in');
	    $('div.nav-collapse').css('height', '0');
	    $('div.nav-collapse ul').css('height', '0');
	    $('div.nav-collapse ul.sub-menu').css('display', 'none');
  	}
	showProcessingImage('undefined');

	$.ajaxSetup({ cache: false });
	var url1 = $('#HOST_URL').val()+"app/webroot/js/main_page_templates/"+main_page_template_id+".html?v="+css_js_version;
	var url2 = $('#HOST_URL').val()+"app/webroot/js/main_page_templates/"+main_page_template_id+".js?v="+css_js_version;
	var storagecache = localStorage.getItem('storagecache');
	if(storagecache!=null){
		var d1 = null;
		var d2 = null;
	}
	else{
		var d1 = localStorage.getItem(url1);
		var d2 = localStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			tabfunc.start();
		}
		else{
			$.getScript(url2, function( data ) {
				localStorage.setItem(url2,data);
				tabfunc.start();
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			localStorage.setItem(url1,data);
			if(d2 != null ){
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				tabfunc.start();
			}
			else{
				$.getScript(url2, function( data ) {
					localStorage.setItem(url2,data);
					tabfunc.start();
				});
			}

		});
	}
	showMenu(menu_id,sub_menu_id);
}

function new_custom_main_page(urrl,menu_id,sub_menu_id,main_page_template_id,custom_data=''){
	if(window.location.pathname+window.location.search != urrl){
		window.history.pushState('', '', urrl);
	}
	
	$(window).unbind();
	$(window).unbind('scroll');
	$('#'+main_page_template_id+'_template').remove();
	if ($('div.nav-collapse').hasClass('in')) {
	    $('div.nav-collapse').removeClass('in');
	    $('div.nav-collapse').css('height', '0');
	    $('div.nav-collapse ul').css('height', '0');
	    $('div.nav-collapse ul.sub-menu').css('display', 'none');
  	}

	showProcessingImage('undefined');

	$.ajaxSetup({ cache: false });
	var url1 = $('#HOST_URL').val()+"app/webroot/js/main_page_templates/"+main_page_template_id+".html?v="+css_js_version;
	var url2 = $('#HOST_URL').val()+"app/webroot/js/main_page_templates/"+main_page_template_id+".js?v="+css_js_version;
	var storagecache = localStorage.getItem('storagecache');
	if(storagecache!=null){
		var d1 = null;
		var d2 = null;
	}
	else{
		var d1 = localStorage.getItem(url1);
		var d2 = localStorage.getItem(url2);
	}


	if(d1 != null ){
		
		$('body').append(d1);
		if(d2 != null ){
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[main_page_template_id].start(custom_data);
		}
		else{
			$.getScript(url2, function( data ) {
				localStorage.setItem(url2,data);
				window[main_page_template_id].start(custom_data);
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			localStorage.setItem(url1,data);
			if(d2 != null ){
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[main_page_template_id].start(custom_data);
			}
			else{
				$.getScript(url2, function( data ) {
					localStorage.setItem(url2,data);
					window[main_page_template_id].start(custom_data);
				});
			}

		});
	}
	showMenu(menu_id,sub_menu_id);
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

window.addEventListener('popstate', function(event) {
	var d = window.history.state;

	if(isEmpty(d)){
	//	window.location.href = '';
		window.location.reload();
		//window.location.assign(window.location)
	}
	else{
		var st = d;
		var fname = st.fname;
		if(fname == 'new_custom_main_page2'){
			window[fname](checkNull(st.urrl),checkNull(st.menu_id),checkNull(st.sub_menu_id),checkNull(st.main_page_template_id),checkNull(st.custom_data),checkNull(st.process));
		}
		else{
			window.location.reload();
			//window.location.assign(window.location)
			//window.location.href = '';
		}
		
	}
});
function new_custom_main_page2(urrl,menu_id,sub_menu_id,main_page_template_id,custom_data='',process='y'){
	var obj = {
		fname:'new_custom_main_page2',
		urrl:urrl,
		menu_id:menu_id,
		sub_menu_id:sub_menu_id,
		main_page_template_id:main_page_template_id,
		custom_data:custom_data,
		process:process,

	};

	if(window.location.pathname+window.location.search != urrl){
		window.history.pushState(obj, 'as', urrl);
	}
	else{
		window.history.replaceState(obj, 'as', urrl);
	}
	$(window).unbind();
	$(window).unbind('scroll');
	$('#'+main_page_template_id+'_template').remove();
	if ($('div.nav-collapse').hasClass('in')) {
	    $('div.nav-collapse').removeClass('in');
	    $('div.nav-collapse').css('height', '0');
	    $('div.nav-collapse ul').css('height', '0');
	    $('div.nav-collapse ul.sub-menu').css('display', 'none');
  	}
	if(process=='y'){
		showProcessingImage('undefined');
	}

	var url1 = $('#HOST_URL').val()+"app/webroot/js/main_page_templates/"+main_page_template_id+"/"+main_page_template_id+".html?v="+css_js_version;
	var url2 = $('#HOST_URL').val()+"app/webroot/js/main_page_templates/"+main_page_template_id+"/"+main_page_template_id+".js?v="+css_js_version;

	$.ajaxSetup({ cache: false });
	var storagecache = localStorage.getItem('storagecache');
	if(storagecache!=null){
		var d1 = null;
		var d2 = null;
	}
	else{
		var d1 = localStorage.getItem(url1);
		var d2 = localStorage.getItem(url2);
	}
	if(d1 != null ){
		
		$('body').append(d1);
		if(d2 != null ){
			var script = localStorage.getItem(url2);
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[main_page_template_id].start(custom_data);
		}
		else{
			$.getScript(url2, function( data ) {
				localStorage.setItem(url2,data);
				window[main_page_template_id].start(custom_data);
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			localStorage.setItem(url1,data);
			if(d2 != null ){
				var d2 = localStorage.getItem(url2);
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[main_page_template_id].start(custom_data);
			}
			else{
				$.getScript(url2, function( data ) {
					localStorage.setItem(url2,data);
					window[main_page_template_id].start(custom_data);
				});
			}

		});
	}	
	showMenu(menu_id,sub_menu_id);

}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
function showDeleteMessage(message,dilogTitle,yes_event,no_event,color='',delete_btn_text='Delete',cancel_btn_text='Cancel',delete_btn_color='red')
{
	if(message == '' || message == null || message == 'undefined'){
		message = 'Error';
	}
	
	if(dilogTitle == '' || dilogTitle == null || dilogTitle == 'undefined'){
		dilogTitle = 'Message';
	}
	
	if($('#bkengine_alert_box').length <= 0){
		alert(message);
		return;
	}
	$('#bkengine_alert_box').html(message);
	//$('#bkengine_alert_box').attr('title',dilogTitle);
	if(color==''){
		color = 'ui-dialog-purple';
	}
	$("#bkengine_alert_box" ).dialog({
	      dialogClass: color,
	      modal: true,
	      resizable: false,
	      modal: true,
	      title : dilogTitle,
	      buttons: [
	      	{
	      		'class' : 'btn '+delete_btn_color,	
	      		"text" : delete_btn_text,
	      		click: function() {
	      			$(this).dialog( "close" );
	      			if (typeof yes_event === "function") {
	               		 yes_event();
	            	}
	       			
    			}
	      	}, 
	      	{
	      		'class' : 'btn',
	      		"text" : cancel_btn_text,
	      		click: function() {
	      			$(this).dialog( "close" );
	      			if (typeof no_event === "function") {
	               		 no_event();
	            	}
	      			
    			}
	      	}
	      ]
	    });
	return;
}
function checkNull(val,ret=''){
	if(val==undefined || val==null || val == ''){
		return ret;
	}
	return val;
}
function showDeleteMessageDrop(message,dilogTitle,color='',delete_btn_text='Delete',cancel_btn_text='Cancel',options='',all)
{
	if(message == '' || message == null || message == 'undefined'){
		message = 'Error';
	}
	
	if(dilogTitle == '' || dilogTitle == null || dilogTitle == 'undefined'){
		dilogTitle = 'Message';
	}
	
	if($('#bkengine_alert_box').length <= 0){
		alert(message);
		return;
	}

	$('#bkengine_alert_box').html(message);
	

	//$('#bkengine_alert_box').attr('title',dilogTitle);
	if(color==''){
		color = 'ui-dialog-purple';
	}
	if(options!='' && options.length!=0){
		var btns = [];
		for(var j in options){
			var option = options[j];

			var obj = {
				'class':'btn '+option.cssc,
				'text':option.text,
				click:function(a){
					if (typeof(all) === "function") {
	               		 all(this,a);
	            	}
				}
			};
			btns.push(obj);
		}	
	}
	
	$("#bkengine_alert_box" ).dialog({
	      dialogClass: color,
	      modal: true,
	      resizable: false,
	      draggable:false,
	   
	      title : dilogTitle,
	      buttons: btns
	    });
	return;
}
function goToCustomer(cust_id){
	var type = $('#type').val();
	new_custom_main_page2('/'+type+'/customers/details/'+cust_id,'all_customers','all_customers','customer_details',{customer_id:cust_id});
	return false;
}

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
 
function getUserIP(onNewIP) {
	if(checkNull($('#ip_address').val()) != ''){
		onNewIP($('#ip_address').val());
		return;
	}
    $.get('https://ipinfo.io', function() {}, "json").always(function(resp) {
 		if("ip" in resp && checkNull(resp.ip) != ''){
 			onNewIP(resp.ip);
 		}
 		else{
 			onNewIP('');
 		}
	});
}

function formatBankAccount(acc,partner_country=''){
	if(isNaN(acc) || acc == '' || acc == undefined || acc == null){
		return '';
	}
	if(partner_country == undefined || partner_country == null){
		partner_country = '';
	}
	if(partner_country == 'NO'){
		if(acc.length != 11){
			return acc;
		}
		var a = acc.substr(0,4);
		var b = acc.substr(4,2);
		var c = acc.substr(6,5);
		return a+' '+b+' '+c;
	}
	else{
		return acc;
	}
}

window.addEventListener('storage', onStorageEvent);
function onStorageEvent(e) {
	if(e.key=='loggedout' && e.newValue == 'y'){
    	showlogin.show();
    }
    else if(e.key=='token' && checkNull(e.newValue) != ''){
    	var d = JSON.parse(e.newValue);
    	if("token" in window){
    		token = d.MEMBER.token;
    	}
    	socket.disconnect();
		var socket_params = {
			token:d.MEMBER.token,
			partner_id:d.MEMBER.PartnerId,
			admin_id:d.SYSTEM.admin_id,
			staffer_id:d.MEMBER.PartnerContactId,
		};
		connect_socket(socket_params);
		$('#SESSION_DATA').val(JSON.stringify(d));
		$('#'+al_popid).modal('hide');
    }
    else if(e.key == 'logout' && e.newValue == 'logout'){
    	logout();
    }
}

var showlogin = {
	show:function(){
		closeModal('popups');
		closeModal('popups1');
		closeModal('popups2');
		closeModal('popups3');
		closeModal('popups4');
		new_custom_popup2('500','popupslogin','all_login',{backdrop:'static'});
		return;
	},
};

var mod11Validator = function (input) {
    var controlNum = 2,
        sumMod = 0,
        i;

    for (i = input.length - 2; i >= 0; --i) {
        sumMod += input.charAt(i) * controlNum;
        if (++controlNum > 7)
            controlNum = 2;
    }
    var result = (11 - sumMod % 11);

    return result === 11 ? 0 : result;
};

var validateAccount = function (account) {
    if (! account) {
        return false;
    }
    account = account.toString().replace(/\./g, '');
    if (account.length !== 11) {
        return false;
    }
    return parseInt(account.charAt(account.length - 1), 10) 
            === mod11Validator(account);
};

//Datepicker defaults

var ln = $('#lang').val();if(ln == 'nb'){$.fn.datepicker.defaults.weekStart = 1;ln = 'no';}else{ln = 'en';}
$.fn.datepicker.defaults.language = ln;
//Datepicker defaults


