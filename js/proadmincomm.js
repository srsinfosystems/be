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
        	$.fn.modalmanager.defaults.resize = true;
			$.fn.modalmanager.defaults.spinner = '<div class="loading-spinner fade" style="width: 200px; margin-left: -100px;"><img src="'+img_url+'img/ajax-modal-loading.gif" align="middle">&nbsp;<span style="font-weight:300; color: #eee; font-size: 18px; font-family:Open Sans;">&nbsp;'+trans_loading+'...</span></div>';

	    	showProcessingImage('undefined'); 
		   // xhr.setRequestHeader("X-Requested-With", "AJAX");
	       // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
	    success: function(data,status,xhr){
	    	//hideProcessingImage();
	    	//responseHandler(data);
	    	$.fn.modalmanager.defaults.resize = true;
			$.fn.modalmanager.defaults.spinner = '<div class="loading-spinner fade" style="width: 200px; margin-left: -100px;"><img src="'+img_url+'img/ajax-modal-loading.gif" align="middle">&nbsp;<span style="font-weight:300; color: #eee; font-size: 18px; font-family:Open Sans;">&nbsp;'+trans_loading+'...</span></div>';

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
	    	$('#'+popup).css('width',w+'px');
	    	$('#'+popup).attr('data-width',w);
	    	
	       	$('#'+popup).html(data);
	    	resizemodal();
		
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
		
		//$('#'+popup).width(w);

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
	App.fixContentHeight();
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
        	$.fn.modalmanager.defaults.resize = true;
			$.fn.modalmanager.defaults.spinner = '<div class="loading-spinner fade" style="width: 200px; margin-left: -100px;"><img src="'+img_url+'img/ajax-modal-loading.gif" align="middle">&nbsp;<span style="font-weight:300; color: #eee; font-size: 18px; font-family:Open Sans;">&nbsp;'+trans_loading+'...</span></div>';

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
		var site_num_format = $('#site_num_format').val();
		
		if(site_num_format == '' || site_num_format == undefined || site_num_format == null){
			var site_num_format_arr = ['.',','];
		}
		else{
			var site_num_format_arr = site_num_format.split('==');
		}
		var number = input_number.format(2, 3,site_num_format_arr[1] , site_num_format_arr[0]);
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
		var d1 = sessionStorage.getItem(url1);
		var d2 = sessionStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			$('#s'+jsname).remove();
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.setAttribute("id", "s"+jsname);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			enable(popups);
		}
		else{
			$.getScript(url2, function( data ) {
				try{
					sessionStorage.setItem(url2,data);
				}
				catch(e){
					sessionStorage.clear();
					new_popup(w,popups,jsname);
					return;
				}
				enable(popups);
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			try{
				sessionStorage.setItem(url1,data);
			}
			catch(e){
				sessionStorage.clear();
				new_popup(w,popups,jsname);
				return;
			}
			if(d2 != null ){
				$('#d'+jsname).remove();
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.setAttribute("id", "d"+jsname);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				enable(popups);
			}
			else{
				$.getScript(url2, function( data ) {
					try{
						sessionStorage.setItem(url2,data);
					}
					catch(e){
						sessionStorage.clear();
						new_popup(w,popups,jsname);
						return;
					}
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
		var d1 = sessionStorage.getItem(url1);
		var d2 = sessionStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			$('#s'+jsname).remove();
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.setAttribute("id", "s"+jsname);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[jsname].start(popups,metadata);
		}
		else{
			$.getScript(url2, function( data ) {
				try{
					sessionStorage.setItem(url2,data);
				}
				catch(e){
					sessionStorage.clear();
					new_custom_popup(w,popups,jsname,metadata);
					return;
				}
				window[jsname].start(popups,metadata);
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			try{
				sessionStorage.setItem(url1,data);
			}
			catch(e){
				sessionStorage.clear();
				new_custom_popup(w,popups,jsname,metadata);
				return;
			}
			if(d2 != null ){
				$('#d'+jsname).remove();
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.setAttribute("id", "d"+jsname);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[jsname].start(popups,metadata);
			}
			else{
				$.getScript(url2, function( data ) {
					try{
						sessionStorage.setItem(url2,data);
					}
					catch(e){
						sessionStorage.clear();
						new_custom_popup(w,popups,jsname,metadata);
						return;
					}
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
		var d1 = sessionStorage.getItem(url1);
		var d2 = sessionStorage.getItem(url2);
	}


	if(d1!= null ){
		$('body').append(d1);
		if(d2 != null ){
			$('#s'+jsname).remove();
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);

			oScript.setAttribute("id", "s"+jsname);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[jsname].start(popups,metadata);
				$(window).trigger('resize.modal');
		}
		else{
			$.getScript(url2, function( data ) {
				try{
					sessionStorage.setItem(url2,data);
				}
				catch(e){
					sessionStorage.clear();
					new_custom_popup2(w,popups,jsname,metadata);
					return;
				}
				window[jsname].start(popups,metadata);
					$(window).trigger('resize.modal');
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			try{
				sessionStorage.setItem(url1,data);
			}
			catch(e){
				sessionStorage.clear();
				new_custom_popup2(w,popups,jsname,metadata);
				return;
			}
			if(d2 != null ){
				$('#d'+jsname).remove();
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);

				oScript.setAttribute("id", "d"+jsname);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[jsname].start(popups,metadata);
					$(window).trigger('resize.modal');
			}
			else{
				$.getScript(url2, function( data ) {
					try{
						sessionStorage.setItem(url2,data);
					}
					catch(e){
						sessionStorage.clear();
						new_custom_popup2(w,popups,jsname,metadata);
						return;
					}
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
		var d1 = sessionStorage.getItem(url1);
		var d2 = sessionStorage.getItem(url2);
	}


	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			$('#s'+jsname).remove();
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.setAttribute("id", "s"+jsname);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			tabfunc.start();
		}
		else{
			$.getScript(url2, function( data ) {
				try{
					sessionStorage.setItem(url2,data);
				}
				catch(e){
					sessionStorage.clear();
					new_tabs(jsname,tab_id);
					return;
				}
				tabfunc.start();
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			try{
				sessionStorage.setItem(url1,data);
			}
			catch(e){
				sessionStorage.clear();
				new_tabs(jsname,tab_id);
				return;
			}
			if(d2 != null ){
				$('#d'+jsname).remove();
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.setAttribute("id", "d"+jsname);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				tabfunc.start();
			}
			else{
				$.getScript(url2, function( data ) {
					try{
						sessionStorage.setItem(url2,data);
					}
					catch(e){
						sessionStorage.clear();
						new_tabs(jsname,tab_id);
						return;
					}
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
		var d1 = sessionStorage.getItem(url1);
		var d2 = sessionStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			$('#s'+jsname).remove();
			var script = d2
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.setAttribute("id", "s"+jsname);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[jsname].start(tab_id,metadata)
		}
		else{
			$.getScript(url2, function( data ) {
				try{
					sessionStorage.setItem(url2,data);
				}
				catch(e){
					sessionStorage.clear();
					new_custom_tabs(jsname,tab_id,metadata);
					return;
				}
				window[jsname].start(tab_id,metadata)
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			try{
				sessionStorage.setItem(url1,data);
			}
			catch(e){
				sessionStorage.clear();
				new_custom_tabs(jsname,tab_id,metadata);
				return;
			}
			if(d2 != null ){
				$('#d'+jsname).remove();
				var script = d2
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.setAttribute("id", "d"+jsname);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[jsname].start(tab_id,metadata);
			}
			else{
				$.getScript(url2, function( data ) {
					try{
						sessionStorage.setItem(url2,data);
					}
					catch(e){
						sessionStorage.clear();
						new_custom_tabs(jsname,tab_id,metadata);
						return;
					}
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
		var d1 = sessionStorage.getItem(url1);
		var d2 = sessionStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			$('#s'+jsname).remove();
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.setAttribute("id", "s"+jsname);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[jsname].start(tab_id,metadata)
		}
		else{
			$.getScript(url2, function( data ) {
				try{
					sessionStorage.setItem(url2,data);
				}
				catch(e){
					sessionStorage.clear();
					new_custom_tabs2(jsname,tab_id,metadata);
					return;
				}
				window[jsname].start(tab_id,metadata)
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			try{
				sessionStorage.setItem(url1,data);
			}
			catch(e){
				sessionStorage.clear();
				new_custom_tabs2(jsname,tab_id,metadata);
				return;
			}
			if(d2 != null ){
				$('#d'+jsname).remove();
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.setAttribute("id", "d"+jsname);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[jsname].start(tab_id,metadata);
			}
			else{
				$.getScript(url2, function( data ) {
					try{
						sessionStorage.setItem(url2,data);
					}
					catch(e){
						sessionStorage.clear();
						new_custom_tabs2(jsname,tab_id,metadata);
						return;
					}
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
		var d1 = sessionStorage.getItem(url1);
		var d2 = sessionStorage.getItem(url2);
	}

	if(d1 != null ){
		$('body').append(d1);
		if(d2 != null ){
			$('#s'+jsname).remove();
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.setAttribute("id", "s"+jsname);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			tabfunc.start();
		}
		else{
			$.getScript(url2, function( data ) {
				try{
					sessionStorage.setItem(url2,data);
				}
				catch(e){
					sessionStorage.clear();
					new_main_page(urrl,menu_id,sub_menu_id,main_page_template_id);
					return;
				}

				tabfunc.start();
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			try{
				sessionStorage.setItem(url1,data);
			}
			catch(e){
				sessionStorage.clear();
				new_main_page(urrl,menu_id,sub_menu_id,main_page_template_id);
				return;
			}
			if(d2 != null ){
				$('#d'+jsname).remove();
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.setAttribute("id", "d"+jsname);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				tabfunc.start();
			}
			else{
				$.getScript(url2, function( data ) {
					try{
						sessionStorage.setItem(url2,data);
					}
					catch(e){
						sessionStorage.clear();
						new_main_page(urrl,menu_id,sub_menu_id,main_page_template_id);
						return;
					}
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
		var d1 = sessionStorage.getItem(url1);
		var d2 = sessionStorage.getItem(url2);
	}


	if(d1 != null ){
		
		$('body').append(d1);
		if(d2 != null ){
			//$('#s'+jsname).remove();
			var script = d2;
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			//oScript.setAttribute("id", "s"+jsname);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[main_page_template_id].start(custom_data);
		}
		else{
			$.getScript(url2, function( data ) {
				
				try{
					sessionStorage.setItem(url2,data);
				}
				catch(e){
					sessionStorage.clear();
					new_custom_main_page(urrl,menu_id,sub_menu_id,main_page_template_id,custom_data);
					return;
				}
				window[main_page_template_id].start(custom_data);
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			try{
				sessionStorage.setItem(url1,data);
			}
			catch(e){
				sessionStorage.clear();
				new_custom_main_page(urrl,menu_id,sub_menu_id,main_page_template_id,custom_data);
				return;
			}
			if(d2 != null ){
				//$('#d'+jsname).remove();
				var script = d2;
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				//oScript.setAttribute("id", "d"+jsname);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[main_page_template_id].start(custom_data);
			}
			else{
				$.getScript(url2, function( data ) {
					try{
						sessionStorage.setItem(url2,data);
					}
					catch(e){
						sessionStorage.clear();
						new_custom_main_page2(urrl,menu_id,sub_menu_id,main_page_template_id,custom_data,process);
						return;
					}
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
		var d1 = sessionStorage.getItem(url1);
		var d2 = sessionStorage.getItem(url2);
	}
	
	if(d1 != null ){
		
		$('body').append(d1);
		if(d2 != null ){
			var script = sessionStorage.getItem(url2);
			var oScript = document.createElement("script");
			var oScriptText = document.createTextNode(script);
			oScript.appendChild(oScriptText);
			document.body.appendChild(oScript);			
			window[main_page_template_id].start(custom_data);
		}
		else{
			$.getScript(url2, function( data ) {
				try{
					sessionStorage.setItem(url2,data);
				}
				catch(e){
					sessionStorage.clear();
					new_custom_main_page2(urrl,menu_id,sub_menu_id,main_page_template_id,custom_data,process);
					return;
				}
				
				window[main_page_template_id].start(custom_data);
			});
		}
	}
	else{
		$.get(url1, function( data ) {
			$('body').append(data);
			try{
				sessionStorage.setItem(url1,data);
			}
			catch(e){
				sessionStorage.clear();
				new_custom_main_page2(urrl,menu_id,sub_menu_id,main_page_template_id,custom_data,process);
				return;
			}
			if(d2 != null ){
				var d2 = sessionStorage.getItem(url2);
				var oScript = document.createElement("script");
				var oScriptText = document.createTextNode(script);
				oScript.appendChild(oScriptText);
				document.body.appendChild(oScript);			
				window[main_page_template_id].start(custom_data);
			}
			else{
				$.getScript(url2, function( data ) {
					
					try{
						sessionStorage.setItem(url2,data);
					}
					catch(e){
						sessionStorage.clear();
						new_custom_main_page2(urrl,menu_id,sub_menu_id,main_page_template_id,custom_data,process);
						return;
					}

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

/* Author 	: 018
 * Date 	: 03 FEB 2014
 * DESC 	: Main custom javascript file for logged-in user, 
 * CAUTION  : Should load only when user is logged-in
 *  
 * */
//#024 14-01-2017 Fwd: Feedback, inventory module 
	function calculateProductLineTotal(line_key){
		var enable_inventory = $("#enable_inventory").val();
		//#024 14-12-2016 #222: Fwd: Feedback, inventory > Sales changes 
			if(enable_inventory == 'y'){
				var obj_location = document.getElementById('location_'+line_key);
				var inventory_product = document.getElementById("inventory_product_"+line_key).value;
				if(inventory_product == 'n'){
					var actualInventroy = is_undefined('0_0##0');
					if(actualInventroy != ''){
						location = actualInventroy.split("##");
						location1 = is_undefined(location[0]); 
						location2 = is_undefined(location[1]);
						if(location1 != ''){
							selctLocation = location1.split("_");	
						}
					}
					$("#actual_inventory_"+line_key).val(convertIntoLocalFormat(is_undefined(selctLocation[1])));
					$('#location_'+line_key).prop('selectedIndex', location2);
					if(obj_location.length > 1){
						$('#location_'+line_key).prop('selectedIndex', location2).select2();
					}
					$("#all_location_id_"+line_key).val(location1);
				}else{
					if(obj_location.length > 1){
						var actualInv = check_stock(line_key);
						var selctLocation = '';
						var actualInventroy = '';
						var location = '';
						var location1 = '';
						var location2 = '';
						if(actualInv != '' || actualInv != undefined){
							actualInventroy = is_undefined(actualInv);
							if(actualInventroy != ''){
								location = actualInventroy.split("##");
								location1 = is_undefined(location[0]);
								location2 = is_undefined(location[1]);
								if(location1 != ''){
									selctLocation = location1.split("_");	
								}	
							}
							$("#actual_inventory_"+line_key).val(convertIntoLocalFormat(is_undefined(selctLocation[1])));	
							$('#location_'+line_key).prop('selectedIndex', location2);
							$('#location_'+line_key).prop('selectedIndex', location2).select2();
							$("#all_location_id_"+line_key).val(location1);
						}else{
							var actualInventroy = is_undefined('0_0##0');
							if(actualInventroy != ''){
								location = actualInventroy.split("##");
								location1 = is_undefined(location[0]); 
								location2 = is_undefined(location[1]);
								if(location1 != ''){
									selctLocation = location1.split("_");	
								}
							}
							$("#actual_inventory_"+line_key).val(convertIntoLocalFormat(is_undefined(selctLocation[1])));
							$('#location_'+line_key).prop('selectedIndex', location2)
							if(obj_location.length > 1){
								$('#location_'+line_key).prop('selectedIndex', location2).select2();
							}
							$("#all_location_id_"+line_key).val(location1);
						}
					}else{
						var obj_location = document.getElementById('location_'+line_key).value;
						if(obj_location != ''){
							location = obj_location.split("_");
							$("#actual_inventory_"+line_key).val(convertIntoLocalFormat(is_undefined(location[1])));	
						}
						$("#all_location_id_"+line_key).val(obj_location);
					}
				}
			}		
		//#024 14-12-2016 #222: Fwd: Feedback, inventory > Sales changes
		calculateLineTotal('', line_key);
	}
//#024 14-01-2017 Fwd: Feedback, inventory module	 

function calculateLineTotal(val, id, calculation)
{
	var enable_inventory = $("#enable_inventory").val();
	if(enable_inventory == 'y'){
		var myArray = new Array('qty_', 'vat_level_', 'discount_','discount_amount_', 'unit_price_','gross_amount_','text_line_','actual_inventory_','inventory_product_','totpri_');
	}else{
		var myArray = new Array('qty_', 'vat_level_', 'discount_','discount_amount_', 'unit_price_','gross_amount_','text_line_','totpri_');
	}
	var flag='0';
	for(var i=0;i<myArray.length;i++)
	{
		if(!document.getElementById(myArray[i]+id)){
			flag = '1';
			break;
		}
	}

	if(flag == '1'){
		return false;
	}

	if($('#text_line_'+id).val() == 'y'){
		return;
	}
	
	//calculateDiscount('percentage',id,'y');
	/*********** 024 25-05-2015 #29584, Bug, minbefaring.no > Less serious bugs >7 *******/
		$("#qty_"+id).keydown(function (e) {
			if(e.keyCode == 9) {
				var quantity = convertIntoStandardFormat($("#qty_"+id).val().trim());
				$("#qty_"+id).val(convertIntoLocalFormat(quantity));
			}	
		});
	/*********** 024 25-05-2015 #29584, Bug, minbefaring.no > Less serious bugs >7 *******/		
	var qty = document.getElementById("qty_"+id).value;
	
	/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
		qty = convertIntoStandardFormat(qty.trim());
		if(!IsNumeric(qty)){
			qty = '0';
		}
		qty = parseFloat(qty);
	/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
	
	/**** #024 23-07-2016 #35455, BE > Fwd: Inventory refill and calculations > REGISTERING SALES *******/
		if(enable_inventory == 'y'){
			var actual_inventory = document.getElementById("actual_inventory_"+id).value;
			actual_inventory = convertIntoStandardFormat(actual_inventory.trim());
			if(!IsNumeric(actual_inventory)){
				actual_inventory = '0';
			}
			actual_inventory = parseFloat(actual_inventory);
			
			var inventory_product = document.getElementById("inventory_product_"+id).value;
			if(inventory_product == 'y'){
				if(qty > actual_inventory){
					$('#qty_'+id).css({"border-color": "#e02222", 
					 "border-width":"2px", 
					 "border-style":"solid"});	
				}else{
					$('#qty_'+id).css({"border-color": "#e5e5e5", 
					 "border-width":"1px", 
					 "border-style":"solid"});
				}
			}else{
				$('#qty_'+id).css({"border-color": "#e5e5e5", 
					 "border-width":"1px", 
					 "border-style":"solid"});
			}
		}		
	/**** #024 23-07-2016 #35455, BE > Fwd: Inventory refill and calculations > REGISTERING SALES *******/		
	
	/***** #024 28-03-2015 #28322, Minor bugs ****/
		var net_amount_value = $('#net_amount_value').val();
		var unit_price_val = convertIntoStandardFormat(document.getElementById("unit_price_"+id).value);
		var discount_amount_val = convertIntoStandardFormat(document.getElementById("discount_amount_"+id).value);
		if (Number(discount_amount_val) > Number(Math.abs(qty*unit_price_val))) {
			showAlertMessage(net_amount_value,'error');
			if($("#discount_value_"+id).val() != undefined){
				$("#discount_amount_"+id).val($("#discount_value_"+id).val());
			}else{
				$("#discount_amount_"+id).val('0,00');
			}
		}else{
			var unit_price = document.getElementById("unit_price_"+id).value;
			unit_price = convertIntoStandardFormat(unit_price.trim());
			if(!IsNumeric(unit_price)){
				unit_price = '0';
			}
			unit_price = parseFloat(unit_price);

			var total_price = unit_price * qty;
			$("#totpri_"+id).val(convertIntoLocalFormat(roundNumber(total_price)));
			
			//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!
				/* var discount = document.getElementById("discount_"+id).value;
				discount = convertIntoStandardFormat(discount.trim());
				if(!IsNumeric(discount)){
					discount = '0';
				}
				discount = parseFloat(discount); */
			
				var discount_amount = document.getElementById("discount_amount_"+id).value;
				discount_amount = convertIntoStandardFormat(discount_amount.trim());
				if(!IsNumeric(discount_amount)){
					discount_amount = '0';
				}
				discount_amount = parseFloat(discount_amount);
			//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
			
			var percentage = $("#vat_level_"+id+" option:selected").text();
			percentage = percentage.trim();
			if(!IsNumeric(percentage) || percentage == '-'){
				percentage = '0';
			}
			percentage = parseFloat(percentage);
			/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
				total_amount = roundNumber((parseFloat(unit_price) * parseFloat(qty)));
			/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/	 
			
			apply_tax = $('#apply_tax').val();
			var show_location = '';
			if(apply_tax == 'N'){
				tax = 0;
				colspan = 6;
				$('.product_description_column').attr('colspan',colspan);
			}else{
				if(enable_inventory == 'y'){
					if(document.getElementById('show_location'))
						show_location = document.getElementById('show_location').style.display;
					if(show_location != 'none' || show_location != null){
						tax = roundNumber((parseFloat(total_amount) * parseInt(percentage))/ 100);
						colspan = 8;
						$('.product_description_column').attr('colspan',colspan);
					}else{
						tax = roundNumber((parseFloat(total_amount) * parseInt(percentage))/ 100);
						colspan = 7;
						$('.product_description_column').attr('colspan',colspan);
					}
				}else{
					tax = roundNumber((parseFloat(total_amount) * parseInt(percentage))/ 100);

					colspan = 7;
					$('.product_description_column').attr('colspan',colspan);
				}
				$('#taxamt_'+id).val(convertIntoLocalFormat(roundNumber(tax)));
			}
			//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!	
				discount_tax = roundNumber((parseFloat(discount_amount) * parseInt(percentage))/ 100);
				discount_amount = (parseFloat(discount_amount)+parseFloat(discount_tax));
			//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
			
			if(total_amount < 0){
				gross_amount = roundNumber(parseFloat(total_amount) + parseFloat(discount_amount) + parseFloat(tax));
			}else{
				gross_amount = roundNumber(parseFloat(total_amount) - parseFloat(discount_amount) + parseFloat(tax));	
			}
			
			$("#gross_amount_"+id).val(convertIntoLocalFormat(roundNumber(gross_amount)));
			
			// BUG: 0022671  BY:054  04 Oct 2014 
			$("#edit_gross_amount_"+id).html(convertIntoLocalFormat(roundNumber(gross_amount)));
			
			if($('#customer_product_line').length>0){
				$("#label_gross_amount_"+id).html(convertIntoLocalFormat(roundNumber(gross_amount)));
				
				$("#label_vat_level_"+id).html(convertIntoLocalFormat(roundNumber(percentage)));
			}
			
			getSummaryLineCalculation(calculation);
		}
	/***** #024 28-03-2015 #28322, Minor bugs ****/
}

// #024 14-12-2016 #222: Fwd: Feedback, inventory > Sales changes
	function isEmpty(str) {
	    return (!str || 0 === str.length);
	}

	function check_stock(line_key) {
		var obj_location = document.getElementById('location_'+line_key);
		var qty = document.getElementById("qty_"+line_key).value; 
		var qty = convertIntoStandardFormat(qty.trim());
		var default_location_id = $('#default_location_id').val();
		if(default_location_id == 0){
			default_location_id = '';	
		}
		var default_location = isEmpty(default_location_id);
		var val = '';
		var stocks = '';
		for (i = 0; i < obj_location.length; i++) {
			val =  obj_location.options[i].value;
			stocks = val.split("_");
			if(default_location == false) {
				var stock = stocks[1];
				var stock = convertIntoStandardFormat(stock.trim());
				if(default_location_id == stocks[0] && parseFloat(qty) <= parseFloat(stock)) {
					return val+"##"+i;		
				}		
			}else{
				var stock = stocks[1];
				var stock = convertIntoStandardFormat(stock.trim());
				if(parseFloat(qty) <= parseFloat(stock)) {
					return val+"##"+i;				
				}			
			}
		}
	}
// #024 14-12-2016 #222: Fwd: Feedback, inventory > Sales changes	

/***** #024 22-07-2016 #35451, BE > Fwd: Inventory refill and calculations > REFILL INVENTORY ****/
	function calculateRefillLineTotal(val, id)
	{
		var myArray = new Array('qty_', 'vat_level_', 'discount_','discount_amount_', 'unit_price_','gross_amount_','text_line_','batch_sum_','pricing_','actual_inventory_','new_inventory_','location_');
		
		var flag='0';
		for(var i=0;i<myArray.length;i++)
		{
			if(!document.getElementById(myArray[i]+id)){
				flag = '1';
				break;
			}
		}
		
		if(flag == '1'){
			return false;
		}
		
		if($('#text_line_'+id).val() == 'y'){
			return;
		}
		
		//calculateDiscount('percentage',id,'y');
		/*********** 024 25-05-2015 #29584, Bug, minbefaring.no > Less serious bugs >7 *******/
			$("#qty_"+id).keydown(function (e) {
				if(e.keyCode == 9) {
					var quantity = convertIntoStandardFormat($("#qty_"+id).val().trim());
					$("#qty_"+id).val(convertIntoLocalFormat(quantity));
				}	
			});
		/*********** 024 25-05-2015 #29584, Bug, minbefaring.no > Less serious bugs >7 *******/		
		var qty = document.getElementById("qty_"+id).value;
		var actual_inventory = document.getElementById("actual_inventory_"+id).value;
		
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
			qty = convertIntoStandardFormat(qty.trim());
			actual_inventory = convertIntoStandardFormat(actual_inventory.trim());
			if(!IsNumeric(qty)){
				qty = '0';
			}
			if(!IsNumeric(actual_inventory)){
				actual_inventory = '0';
			}
			qty = parseFloat(qty);
			var actual_inventory_val = parseFloat(qty) + parseFloat(actual_inventory);
			/* Update New inventory */
				$("#new_inventory_"+id).val(convertIntoLocalFormat(roundNumber(actual_inventory_val)));
			/* Update New inventory */
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/	
		
		/***** #024 28-03-2015 #28322, Minor bugs ****/
			var net_amount_value = $('#net_amount_value').val();
			var unit_price_val = convertIntoStandardFormat(document.getElementById("unit_price_"+id).value);
			var discount_amount_val = convertIntoStandardFormat(document.getElementById("discount_amount_"+id).value);
			var new_inventory_val = convertIntoStandardFormat(document.getElementById("new_inventory_"+id).value);
			
			var pricing_val = $("#pricing_"+id+" option:selected").val();
			if (Number(discount_amount_val) > Number(Math.abs(qty*unit_price_val))) {
				showAlertMessage(net_amount_value,'error');
				if($("#discount_value_"+id).val() != undefined){
					$("#discount_amount_"+id).val($("#discount_value_"+id).val());
				}else{
					$("#discount_amount_"+id).val('0,00');
				}
			}else{
				var unit_price = document.getElementById("unit_price_"+id).value;
				unit_price = convertIntoStandardFormat(unit_price.trim());
				if(!IsNumeric(unit_price)){
					unit_price = '0';
				}
				unit_price = parseFloat(unit_price);
				
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!
					/* var discount = document.getElementById("discount_"+id).value;
					discount = convertIntoStandardFormat(discount.trim());
					if(!IsNumeric(discount)){
						discount = '0';
					}
					discount = parseFloat(discount); */
				
					var discount_amount = document.getElementById("discount_amount_"+id).value;
					discount_amount = convertIntoStandardFormat(discount_amount.trim());
					if(!IsNumeric(discount_amount)){
						discount_amount = '0';
					}
					discount_amount = parseFloat(discount_amount);
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
				
				var percentage = $("#vat_level_"+id+" option:selected").text();
				percentage = percentage.trim();
				if(!IsNumeric(percentage) || percentage == '-'){
					percentage = '0';
				}
				percentage = parseFloat(percentage);
				/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
					if(pricing_val == 'batch'){
						total_amount = roundNumber((parseFloat(unit_price)));
						batch_sum = roundNumber((parseFloat(unit_price) / parseFloat(qty)));
						$("#batch_sum_"+id).val(convertIntoLocalFormat(roundNumber(batch_sum)));	
					}else{
						total_amount = roundNumber((parseFloat(unit_price) * parseFloat(qty)));
						$("#batch_sum_"+id).val(convertIntoLocalFormat(roundNumber(unit_price)));		
					}	
				/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/	 
				
				apply_tax = $('#apply_tax').val();
				if(apply_tax == 'N'){
					tax = 0;
				}else{
					tax = roundNumber((parseFloat(total_amount) * parseInt(percentage))/ 100);
				}
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!	
					discount_tax = roundNumber((parseFloat(discount_amount) * parseInt(percentage))/ 100);
					discount_amount = (parseFloat(discount_amount)+parseFloat(discount_tax));
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
				
				if(total_amount < 0){
					gross_amount = roundNumber(parseFloat(total_amount) + parseFloat(discount_amount) + parseFloat(tax));
				}else{
					gross_amount = roundNumber(parseFloat(total_amount) - parseFloat(discount_amount) + parseFloat(tax));	
				}
				
				$("#gross_amount_"+id).val(convertIntoLocalFormat(roundNumber(gross_amount)));
				
				// BUG: 0022671  BY:054  04 Oct 2014 
				$("#edit_gross_amount_"+id).html(convertIntoLocalFormat(roundNumber(gross_amount)));
				
				if($('#customer_product_line').length>0){
					$("#label_gross_amount_"+id).html(convertIntoLocalFormat(roundNumber(gross_amount)));
					
					$("#label_vat_level_"+id).html(convertIntoLocalFormat(roundNumber(percentage)));
				}
				
				getSummaryLineCalculation('no_calculation');
			}
		/***** #024 28-03-2015 #28322, Minor bugs ****/
	}
/***** #024 22-07-2016 #35451, BE > Fwd: Inventory refill and calculations > REFILL INVENTORY ****/	

function getSummaryLineCalculation(calculation)
{
	var obj_qty = new Array();
	var obj_vat = new Array();
	var obj_discount = new Array();
	//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
		var obj_discount_amount = new Array();
	//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			
	var obj_unit_price = new Array();
	/*var obj_percentage = new Array();*/
	var obj_gross_amount = new Array(); /* Gross amount of line*/
	
	var final_gross_amount = 0;
	var final_vat_amount = 0;
	var final_discount = 0;
	var final_net_amount = 0; 
	var final_tax = 0; 
	var final_taxable_amount = 0;
	var invoice_fee = 0;
	var invoice_vat = 0; 
	var sub_total = 0;
	
	var fobj = document.getElementById('frmNewInvoice');
	if(fobj != null){
		for(var i = 0;i < fobj.elements.length;i++) 
		{
			els = fobj.elements[i];  
			fv = els.value;			
			fn = els.name;
			fd = els.disabled;
			
			if(fd){
				continue;
			}
			
			switch(fn)
			{
				case 'invoiceProduct.product_quantity[]':
				case 'salesProduct.product_quantity[]':
					fv = fv.trim();
					obj_qty.push(fv) ;
					break;
				case 'invoiceProduct.discount[]':
				case 'salesProduct.discount[]':
					fv = convertIntoStandardFormat(fv.trim());
					obj_discount.push(fv);
					break;
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
					case 'invoiceProduct.discount_amount[]':
					case 'salesProduct.discount_amount[]':
						fv = convertIntoStandardFormat(fv.trim());
						obj_discount_amount.push(fv);
						break;
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!				
				case 'invoiceProduct.product_unitPrice[]':
				case 'salesProduct.product_unitPrice[]':
					fv = convertIntoStandardFormat(fv.trim());
					obj_unit_price.push(fv);
					break;
				case 'invoiceProduct.product_unitPrice[]':
				case 'salesProduct.vat_level[]':
				case 'invoiceProduct.vat_level[]':	
					
					fv = (els.selectedIndex > -1 )?els.options[els.selectedIndex].text:'';
					
					fv = fv.trim();
					obj_vat.push(fv);
					break;
				case 'invoiceProduct.product_unitPrice[]':
				case 'salesProduct.total[]':
					fv = convertIntoStandardFormat(fv.trim());
					obj_gross_amount.push(fv);
					break;
			}
		}
	}

	var vat_show = new Array();
	var vat_level_arr = new Array();
	var apply_tax = $('#apply_tax').val();
	
	if(apply_tax == 'Y'){
		
		if($('.class_sale_product_tax').length > 0){
			$(".class_sale_product_tax").show();  
		}
		if($('.class_invoice_product_tax').length > 0){
			$(".class_invoice_product_tax").show();  
		}
		
	}else{
		if($('.class_sale_product_tax').length > 0){
			$(".class_sale_product_tax").hide();  
		}
		if($('.class_invoice_product_tax').length > 0){
			$(".class_invoice_product_tax").hide();  
		}
	}
	
	for(var i = 0;i < obj_qty.length;i++) 
	{
		if(!obj_qty[i])
			continue;
	
		// Quantity
		var qty = obj_qty[i];
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
			qty = convertIntoStandardFormat(qty.trim());
			if(!IsNumeric(qty) )
				qty = 0;
			qty = parseFloat(qty);
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
		
		//Unit price
		var unit_price = obj_unit_price[i];
		if(!IsNumeric(unit_price) )
			unit_price = 0;
		unit_price = parseFloat(unit_price);
		
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
			// Discount
			/* var discount = obj_discount[i];
			if(!IsNumeric(discount))
				discount = 0;
			discount = parseFloat(discount); */
			
			// Discount amount
			var discount_amount = obj_discount_amount[i];
			if(!IsNumeric(discount_amount))
				discount_amount = 0;
			discount_amount = parseFloat(discount_amount);
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			
		
		// percentage
		var percentage = obj_vat[i];
		if(!IsNumeric(percentage) || percentage == '-')
			percentage = 0;
		percentage = parseFloat(percentage);
		
		taxable_amount = 0;
		//Line calculation
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
			line_net_amount = roundNumber((parseFloat(unit_price) * parseFloat(qty))); 
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			
			//discount = ((parseFloat(discount_amount)*100)/(parseFloat(line_net_amount))); 
			if(parseFloat(line_net_amount) < 0){
				taxable_amount = parseFloat(line_net_amount) - (Math.abs(discount_amount) * -1);
			}else{
				taxable_amount = parseFloat(line_net_amount) - parseFloat(discount_amount);
			}
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			

		if(apply_tax == 'N'){
			tax = 0;
			var t = 0;
		}else{
			var t = (parseFloat(taxable_amount)  * parseInt(percentage))/ 100;
			tax = roundNumber((parseFloat(taxable_amount)  * parseInt(percentage))/ 100);
		}
		
		if(tax != '0' && tax != '' && checkNull(t) != '')
		{
			vat_show.push(percentage);
			vat_level_arr.push(taxable_amount);
			$('#vat_'+i).val(tax);
		}
		
		//line_net_amount = parseFloat(line_net_amount) + parseFloat(tax);
	
		//Summary	
		final_taxable_amount = parseFloat(final_taxable_amount) + parseFloat(taxable_amount);
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
			final_discount = parseFloat(final_discount) + parseFloat(discount_amount);
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			
		final_net_amount = parseFloat(final_net_amount) + parseFloat(line_net_amount);
		final_tax = parseFloat(final_tax) + parseFloat(tax);
	}
	var f_discount = final_discount;
	final_discount = roundNumber(final_discount);
	final_net_amount = roundNumber(final_net_amount);
	final_tax = roundNumber(final_tax);
	final_gross_amount = parseFloat(final_taxable_amount) + parseFloat(final_tax);
		
	var invoice_total = parseFloat(final_net_amount) + parseFloat(final_discount);
	
	// Show summary
	$('#invoice_total').html(convertIntoLocalFormat(roundNumber(invoice_total)));
	$("#invoice_net_amount").html(convertIntoLocalFormat(roundNumber(final_net_amount)));
	$("#invoice_total_mva").html(convertIntoLocalFormat(roundNumber(final_tax)));

	if(checkNull(f_discount) != '' && checkNull(f_discount) != 0){
		$("#invoice_total_discount").html(convertIntoLocalFormat(roundNumber(final_discount))).parent().parent().show();
	}
	else{
		$("#invoice_total_discount").parent().parent().hide();
	}
	
	if($("#calculate_round_off").length && $("#round_off").length && $("#round_off_value").length && $("#round_off_value").val())
	{
		var round_off_value = $("#round_off_value").val().trim();
		if(round_off_value && round_off_value != null){
			final_gross_amount = getRoundOff(final_gross_amount, round_off_value);
		}
		else{
			$('#calculate_round_off').parent().parent().hide();
		}
	}else if($("#calculate_round_off").length && $("#round_off").length){
		$("#calculate_round_off").html(convertIntoLocalFormat(parseFloat(0)));
		$("#round_off").val(parseFloat(0));
		//final_gross_amount = final_net_amount;
		$('#calculate_round_off').parent().parent().hide();
	}
	
	$("#invoice_gross_amount").html(convertIntoLocalFormat(roundNumber(final_gross_amount)));
	
	$("#net_amount").val((roundNumber(final_net_amount)));
	$("#total_tax").val((roundNumber(final_tax)));
	$("#total_discount").val((roundNumber(final_discount)));
	$("#gross_amount").val((roundNumber(final_gross_amount)));
	
	performTaxCalculation(vat_level_arr, vat_show, calculation);	
}

function performTaxCalculation(vat_level_arr, vat_show, calculation)
{
	  var distinct_total = new Array();
	  var distinct_vat = new Array();
	  var base_amount = '0';
	  
	 
	  for(var i=0;i<vat_show.length;i++)
	  {
		  if(vat_show[i] == 'undefined' || vat_show[i] == null )
		  {
			  continue;
		  }
		
		  var a = vat_show[i];
		  var	flag = '0';
		  for(j=0;j<distinct_vat.length;j++)
		  {
			if(distinct_vat[j] == a)
			{
				flag = '1';
				break;
			}
		  }
		  if(flag == '1')
		  {
			distinct_total[a] = parseFloat(distinct_total[a]) + parseFloat(vat_level_arr[i]);
		  }
		  else
		  { 		
			  
			distinct_total[a] = parseFloat(vat_level_arr[i]);
			distinct_vat.push(vat_show[i]);
		  }
	  }
	  
	  
	  var tab = '';
	  var tr = "";
	  var outgoing_vat =  $('#trans_outgoing_vat').length > 0 ? $('#trans_outgoing_vat').val():'Outgoing vat';
	  for(var i=0;i<distinct_total.length;i++)
	  {
		  if(distinct_total[i] == 'undefined' || distinct_total[i] == null || distinct_total[i] == '0')
		  {
			  continue;
		  }
		  tr += "<tr><td class='zz'>"+outgoing_vat+"</td>";
		  tr += "<td class='' >"+i+"&nbsp;%</td>";
		  tr += "<td class='' style='text-align:right' >"+CUR_SYM+" "+convertIntoLocalFormat(roundNumber(distinct_total[i]))+"</td>";
		  base_amount = parseFloat(base_amount) + parseFloat(distinct_total[i]);
		  var cal_vat = (parseFloat(i)/100)*parseFloat(distinct_total[i]);
		  cal_vat = roundNumber(cal_vat); 

		  tr += "<td class='' style='text-align:right' >"+CUR_SYM+" "+convertIntoLocalFormat(cal_vat)+"</td></tr>";
	  }
	 
	  base_amount =  roundNumber(base_amount);
	  /*if(document.getElementById("cal_taxable_amount"))
		  document.getElementById("cal_taxable_amount").innerHTML = convertIntoLocalFormat(base_amount);
	  document.getElementById("taxable_amount").value = base_amount; */
	  if(tr == ''){
		//$('#perform_vat_calculation').parent().parent().hide();
		$('.pvc_wrap').parent().css('display','block');
		$('.pvc_wrap').hide();
		
		$('.summary_block').removeClass('well');
		$('.summary_block div.row-fluid div:last').addClass('well')
	  }else{
		  if(calculation == '' || calculation == undefined){
			document.getElementById("perform_vat_calculation").innerHTML = tab+tr;
			$('.pvc_wrap').parent().css('display','flex');
			$('.pvc_wrap').show();

			$('.summary_block').addClass('well');
			$('.summary_block div.row-fluid div:last').removeClass('well')
		  }	
	  }
}

function getRoundOff(gross_amount, round_off_value)
{
	var from_page = 'inv';
	 if(gross_amount < 0)
		 from_page = 'cr';
	
	 if(from_page == 'cr')
	 {
		var act_amt = gross_amount;
		gross_amount = Math.abs(gross_amount);
	 }
	
	 round_off_value = 1 / round_off_value;
	 var round_gross_value = Math.round(gross_amount*round_off_value)/round_off_value;

	 var round_off = round_gross_value - gross_amount;
	 round_gross_value = round_gross_value.toFixed(2);
	 round_off = round_off.toFixed(2);
	
	 // for credit memo only
	 if(from_page == 'cr')
	 {
	 	round_off = -parseFloat(round_off);
		round_off = round_off.toFixed(2);
		if(act_amt < 0)
		{
			round_gross_value = -parseFloat(round_gross_value);
		}
	 }

	$("#calculate_round_off").html(convertIntoLocalFormat(round_off));
	$("#round_off").val(round_off);
	if(round_off*1 != 0){
		$("#calculate_round_off").parent().parent().show();
	}else{
		$("#calculate_round_off").parent().parent().hide();
	}
	
	 return round_gross_value;
}

function convertIntoLocalFormat(inst_val)
{
	var num_format = ',== ';
	if(document.getElementById('site_num_format'))
		num_format = document.getElementById('site_num_format').value;

	var t = ' ';
	var d = ',';
	var res_fom = num_format.split('==');
	if(res_fom[0] != '' && res_fom[0] != undefined )
		d = res_fom[0];
	
	if(res_fom[1] != '' && res_fom[0] != undefined)
		t = res_fom[1];		
	
	var con_num = numberFormat(inst_val, 2, d, t);
	 
	return con_num;
}

function formatDate(date,format) {
	format=format+"";
	var result="";
	var i_format=0;
	var c="";
	var token="";
	var y=date.getYear()+"";
	var M=date.getMonth()+1;
	var d=date.getDate();
	var E=date.getDay();
	var H=date.getHours();
	var m=date.getMinutes();
	var s=date.getSeconds();
	var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
	// Convert real date parts into formatted versions
	var value=new Object();
	if (y.length < 4) {y=""+(y-0+1900);}
	value["y"]=""+y;
	value["yyyy"]=y;
	value["yy"]=y.substring(2,4);
	value["M"]=M;
	value["MM"]=LZ(M);
	value["MMM"]=MONTH_NAMES[M-1];
	value["NNN"]=MONTH_NAMES[M+11];
	value["d"]=d;
	value["dd"]=LZ(d);
	value["E"]=DAY_NAMES[E+7];
	value["EE"]=DAY_NAMES[E];
	value["H"]=H;
	value["HH"]=LZ(H);
	if (H==0){value["h"]=12;}
	else if (H>12){value["h"]=H-12;}
	else {value["h"]=H;}
	value["hh"]=LZ(value["h"]);
	if (H>11){value["K"]=H-12;} else {value["K"]=H;}
	value["k"]=H+1;
	value["KK"]=LZ(value["K"]);
	value["kk"]=LZ(value["k"]);
	if (H > 11) { value["a"]="PM"; }
	else { value["a"]="AM"; }
	value["m"]=m;
	value["mm"]=LZ(m);
	value["s"]=s;
	value["ss"]=LZ(s);
	while (i_format < format.length) {
		c=format.charAt(i_format);
		token="";
		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
			}
		if (value[token] != null) { result=result + value[token]; }
		else { result=result + token; }
		}
	return result;
}
	
// ------------------------------------------------------------------
// Utility functions for parsing in getDateFromFormat()
// ------------------------------------------------------------------
function _isInteger(val) {
	var digits="1234567890";
	for (var i=0; i < val.length; i++) {
		if (digits.indexOf(val.charAt(i))==-1) { return false; }
		}
	return true;
	}
	function _getInt(str,i,minlength,maxlength) {
	for (var x=maxlength; x>=minlength; x--) {
		var token=str.substring(i,i+x);
		if (token.length < minlength) { return null; }
		if (_isInteger(token)) { return token; }
		}
	return null;
	}


function numberFormat(number, decimals, dec_point, thousands_sep) 
{
	var n = !isFinite(+number) ? 0 : +number, 
	prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	s = '',
	
	toFixedFix = function (n, prec) {
		 var k = Math.pow(10, prec);
		 return '' + Math.round(n * k) / k;        
	};
	
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);    
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}    
	return s.join(dec);
}

function convertIntoStandardFormat(inst_val)
{
	var num_format = ',==.';
	if(document.getElementById('site_num_format'))
		num_format = document.getElementById('site_num_format').value;

	var t = ' ';
	var d = ',';
	var res_fom = num_format.split('==');
	if(res_fom[0] != '' && res_fom[0] != undefined )
		d = res_fom[0];
	
	if(res_fom[1] != '' && res_fom[0] != undefined)
		t = res_fom[1];		
	
	var number = is_undefined(inst_val);
	number = number.split(t).join("");
	number = number.split(" ").join("");
	
	var dot = number.indexOf(d); // locate decmal 
	if(dot >0)
		number = number.split(d).join(".");
	
	if(isNaN(number))
		return 0;
	return roundNumber(number);
}

function roundNumber(num)
{
	if(num > 0)
	{
		var result = Math.round(num*100)/100;
		result = result.toFixed(2);
		return result;
	}
	else
	{
		num = Math.abs(num);
		var result = Math.round(num*100)/100;
		result = -parseFloat(result);
		return result.toFixed(2);
		}
}
	
function IsNumeric(strString)
{
	var strValidChars = "0123456789.-";
	var strChar;
	var blnResult = true;


	if (strString == '' || strString == null || strString == 'undefined' || strString.length == 0) return false;

	//  test strString consists of valid characters listed above
	for (i = 0; i < strString.length && blnResult == true; i++)
	{
		strChar = strString.charAt(i);
		if (strValidChars.indexOf(strChar) == -1)
		{
			blnResult = false;
		}
	}
	return blnResult;
}
	
function roundNumber(num)
{
	if(num > 0)
	{
		var result = Math.round(num*100)/100;
		result = result.toFixed(2);
		return result;
	}
	else
	{
		num = Math.abs(num);
		var result = Math.round(num*100)/100;
		result = -parseFloat(result);
		return result.toFixed(2);
	}
}
	
function isNumericKeyStroke(e)
{
	var returnValue = false;
	var keyCode= '';
	if(window.event)
		  keyCode = window.event.keyCode;     //IE
	else
		  keyCode = e.which;     //firefox

	if ( ((keyCode >= 48) && (keyCode <= 57)) || ((keyCode >= 96) && (keyCode <= 105)) || // All numerics
		   (keyCode ==  8) ||     // Backspace
		    (keyCode ==  37) || 
			(keyCode ==  46) || 
			 (keyCode ==  39) || 
		   (keyCode == 13) )
		   {// Carriage Return
		 returnValue = true;
		 }
	 return returnValue;
 }


function assign_email_address()
{
	 var objsend_copy = document.getElementById('send_invoice_copy_to');
	 var email = document.getElementById('hidden_email').value;
	 var obj_email = document.getElementById('email_address');
	 var invoice = document.getElementById('invoices_method').value;

	 if(objsend_copy.checked == true)
	 {
		 obj_email.readOnly = false;
		 obj_email.value = email;
	 } 
	 else
	 {
		obj_email.readOnly = true;
		obj_email.value = '';
	 }
}

function show_hide_due_date(flag, id)
{
	var obj_date = document.getElementById(id);
	if(flag == 'Y')
		obj_date.style.display = '';
	else
		obj_date.style.display = 'none';
}

function show_hide_address(val)
{
	 var obj_customer = document.getElementById('customer_address');
	 var obj_invoice = document.getElementById('invoice_address');
	 var obj_custom = document.getElementById('custom_address');
	 iMethod =  $('#invoices_method').val();
	 iMethod = iMethod.split("##"); 
	 method = iMethod[1];
	 
	 if(val == 'CA')
	 {
		obj_customer.style.display = '';
		obj_invoice.style.display = 'none';
		obj_custom.style.display = 'none';
	 }
	 else if(val == 'IA')
	 {
		obj_customer.style.display = 'none';
		obj_invoice.style.display = '';
		obj_custom.style.display = 'none';
	 }else{
		 obj_customer.style.display = 'none';
		 obj_invoice.style.display = 'none';
		 obj_custom.style.display = '';
	 }
	 
	 if(method == 'email'){
		 $('.invoice_email').show();
		 $('.invoice_address').hide();
	 }else if(method == 'postal'){
		 $('.invoice_email').hide();
		 $('.invoice_address').show();
	 }else{
		 $('.invoice_email').show();
		 $('.invoice_address').show();
	 }
}

function distribution_by_customer(obj_field)
{
	if(obj_field.checked)
	{
		//document.getElementById('invoices_method').disabled = false;
		$('#invoices_method option:not(:selected)').attr('disabled', false);
		
		document.getElementById('address_selected').disabled = false;
		document.getElementById('address_selected').value = 'CA';
		//document.getElementById('cal_drop_down').style.display="";
		//document.getElementById('cal_total_amount').style.display="";
		//document.getElementById('cal_copy_price').style.display="";
		//document.getElementById('heading_total_amount').style.display="";
	}
	else
	{
		//document.getElementById('invoices_method').disabled = true;
		$('#invoices_method option:not(:selected)').attr('disabled', true);
		document.getElementById('address_selected').value = 'IA';
		document.getElementById('address_selected').disabled = true;
		//document.getElementById('cal_drop_down').style.display="none";
		//document.getElementById('cal_total_amount').style.display="none";
		//document.getElementById('cal_copy_price').style.display="none";
		//document.getElementById('heading_total_amount').style.display="none";
	}
}

function validateMass(obj_field, fun)
{

	var val = obj_field.value;
	var field_id = obj_field.id;
	switch(fun)
	{
		case 'validQty': //alert(val);
			//if(!isInteger(val))
			if(!val.toString().match(/(^\d+$)|(^\d+\.\d+$)|(^\d+\,\d+$)/))
			{
				obj_field.value = '1';
				setTimeout("document.getElementById('"+field_id+"').focus()", 0.5);
 				return false;
			}
		break;
		case 'validPrice':
		case 'validDisc':
			
		if(!is_valid_number_format(obj_field))
		{
			obj_field.value = '0';
			setTimeout("document.getElementById('"+field_id+"').focus()", 0.5);
			return false;
		}
		break;
		default :
			return false;
	}
 }

function is_valid_number_format(obj_fileds)
{
	var num_format = ',==.';
	if(document.getElementById('site_num_format')){
		num_format = document.getElementById('site_num_format').value;
	}


	var t = ' ';
	var d = ',';
	var res_fom = num_format.split('==');
	if(res_fom[0] != '' && res_fom[0] != undefined ){
		d = res_fom[0];
	}
	
	if(res_fom[1] != '' && res_fom[0] != undefined){
		t = res_fom[1];		
	}
	
	var number = obj_fileds.value;
	number = number.split(t).join("");
	number = number.split(" ").join("");

	var dot = number.indexOf(d); // locate decmal
	if(dot >0){
		number = number.split(d).join(".");
	}
	
	if(isNaN(number)){
		return false;
	}
	
	return true;
}


function calculate_mark_paid(index)
{
	
	if(document.getElementById('check_'+index))
	{
		if(document.getElementById('check_'+index).checked == false)
			return;
	}
	
	var obj_interest_fee = new Array();
	var obj_late_fee = new Array();
	var obj_invoice_balance = new Array();
	var total_interest_fee = 0;
	var total_late_fee = 0;
	var total_invoice_balance = 0;
	var fobj = document.getElementById('frmPayment');

	// for paid amount in paiment register
	if(document.getElementById("paidamount_"+index))
	{
		var paid_amount = 0;
		var balance = 0;
		var interest = 0;
		var fee = 0;
		paid_amount = convertIntoStandardFormat(document.getElementById("balance_"+index).value);
		if(paid_amount == '')
			paid_amount = 0;

		interest = convertIntoStandardFormat(document.getElementById('interest_'+index).value);
		fee = convertIntoStandardFormat(document.getElementById('fee_'+index).value);
		paid_amount = parseFloat(paid_amount)+parseFloat(interest)+parseFloat(fee);
		document.getElementById("paidamount_"+index).innerHTML = convertIntoLocalFormat(paid_amount);
	}

	for(var i = 0;i < fobj.elements.length;i++) 
	{
		els = fobj.elements[i];  
		fv = els.value;  
		fn = els.name;
		id = els.id;
		var index = "";
		if(id)
		{
			var array_index = id.split("_");
			index = array_index[1];
		}
		var a = '';
		switch(fn)
		{
			
			case 'interest_fee[]':
				fv = convertIntoStandardFormat(fv.trim());
				if(document.getElementById("check_"+index).checked == true)
					obj_interest_fee.push(fv) ;
				break;		 
			case 'late_fee[]':
				fv = convertIntoStandardFormat(fv.trim());
				if(document.getElementById("check_"+index).checked == true)
				obj_late_fee.push(fv);
				break;
			case 'invoice_balance[]':
				fv = convertIntoStandardFormat(fv.trim());
				if(document.getElementById("check_"+index).checked == true)
					obj_invoice_balance.push(fv);
					break;
		}
	}
	for(var i = 0;i < obj_interest_fee.length;i++) 
	{
		if(!obj_interest_fee[i])
		{
			continue;
		}
		var interest_fee = parseFloat(obj_interest_fee[i]);
		if(!IsNumeric(interest_fee))
		{
			interest_fee = 0;
		}
		total_interest_fee = parseFloat(total_interest_fee)+parseFloat(interest_fee);
		
		var late_fee = parseFloat(obj_late_fee[i]);
		if(!IsNumeric(late_fee))
		{
			late_fee = 0;
		}


		total_late_fee = parseFloat(total_late_fee)+parseFloat(late_fee);

		var invoice_balance = parseFloat(obj_invoice_balance[i]);
		if(!IsNumeric(invoice_balance))
		{
			invoice_balance = 0;
		}
		
			total_invoice_balance = parseFloat(total_invoice_balance)+parseFloat(invoice_balance);
		}
	document.getElementById("amount_late_fee").innerHTML = convertIntoLocalFormat(roundNumber(total_late_fee));
	document.getElementById("amount_interest_fee").innerHTML = convertIntoLocalFormat(roundNumber(total_interest_fee));
	document.getElementById("amount_out_standing_balance").innerHTML = convertIntoLocalFormat(roundNumber(total_invoice_balance));
	document.getElementById("total_paid_amount").innerHTML = convertIntoLocalFormat(roundNumber(total_invoice_balance+total_late_fee+total_interest_fee));
}

function recalculate_summary(obj, index)
{
	var sum_balance = document.getElementById('amount_out_standing_balance');
	var sum_late_fee = document.getElementById('amount_late_fee');
	var sum_interest = document.getElementById('amount_interest_fee');

	var balance = convertIntoStandardFormat(document.getElementById('balance_'+index).value); 
	var fee = convertIntoStandardFormat(document.getElementById('fee_'+index).value); 
	var interest = convertIntoStandardFormat(document.getElementById('interest_'+index).value);
	var total_paid_amount = convertIntoStandardFormat(document.getElementById("total_paid_amount").innerHTML);
	
	if(obj.checked == true)
	{
		if(document.getElementById('balance_'+index))
		{
			sum_late_fee.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_late_fee.innerHTML)) + parseFloat(fee))); 
			sum_interest.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_interest.innerHTML)) + parseFloat(interest))); 
			sum_balance.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_balance.innerHTML)) + parseFloat(balance)));
			document.getElementById("paidamount_"+index).innerHTML = convertIntoLocalFormat(parseFloat(balance)+parseFloat(fee)+parseFloat(interest));

			var cal_paid_amount = parseFloat(total_paid_amount)+parseFloat(fee)+parseFloat(interest)+parseFloat(balance);
			document.getElementById("total_paid_amount").innerHTML = convertIntoLocalFormat(roundNumber(cal_paid_amount));
		}
	}
	else 
	{
		if(document.getElementById('balance_'+index))
		{
			sum_late_fee.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_late_fee.innerHTML)) - parseFloat(fee))); 
			sum_interest.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_interest.innerHTML)) - parseFloat(interest))); 
			sum_balance.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_balance.innerHTML)) - parseFloat(balance)));
			document.getElementById("paidamount_"+index).innerHTML = convertIntoLocalFormat('0.00');
			
			var cal_paid_amount = parseFloat(total_paid_amount)-parseFloat(fee)-parseFloat(interest)-parseFloat(balance);
			document.getElementById("total_paid_amount").innerHTML = convertIntoLocalFormat(roundNumber(cal_paid_amount));
		}
	}
}

function calculate_out_total_amount(amount) 
{
	var obj_out_standing_balance = new Array();
	var total_out_standing_balance = amount;
	var fobj = document.getElementById('frm_link_journals');

	for(var i = 0;i < fobj.elements.length;i++) 
	{
		els = fobj.elements[i];  
		fv = els.value;  
		fn = els.name;
		if(els.type== 'checkbox' && els.checked == true && fn == 'link_invoice[]')
		{
			 var check_val = fv.split('::');
			 obj_out_standing_balance.push(check_val[0]);
		}
	}

 	for(var i = 0;i < obj_out_standing_balance.length;i++) 
    {
		if(!obj_out_standing_balance[i]){
			continue;
		}
		
		
		var out_standing_balance = obj_out_standing_balance[i];
		
		if(!IsNumeric(out_standing_balance))
		{	
			out_standing_balance = 0;
		}

		total_out_standing_balance = parseFloat(total_out_standing_balance)+parseFloat(out_standing_balance);
		
	}
	 	
	document.getElementById("total_linked_hidden").value = total_out_standing_balance;

	total_out_standing_balance =  Math.round(total_out_standing_balance*100)/100;
	
	// put total in hidden element
	document.getElementById("total_linked_hidden").value = total_out_standing_balance;
	if(total_out_standing_balance < 0){
		document.getElementById("refund_btn").style.display = '';
		total_out_standing_balance = total_out_standing_balance;
	}else{
		document.getElementById("refund_btn").style.display = 'none';
	}
	document.getElementById("total_linked_amount").innerHTML = convertIntoLocalFormat(roundNumber(total_out_standing_balance));
}

function calculate_total_refund()//change_balance_id, constant_balance, balance)
{
	var obj_out_standing_balance = new Array();
	var obj_late_fee_arr = new Array();
	var obj_intrest_fee_arr = new Array();
	var obj_current_balance_arr = new Array();
	var obj_invoice_id_arr = new Array();
	
	var total_out_standing_balance = 0;
	var row_amount = 0;
	var fobj = document.getElementById('frm_refund_details');
	//balance = convertIntoStandardFormat(balance);
	
	for(var i = 0;i < fobj.elements.length;i++) 
	{
		els = fobj.elements[i];  
		fv = els.value;  
		fn = els.name; 
		
		dk = 'x';
		if($('#'+els.id).length){
			dk = $('#'+els.id).attr('data-key'); 
		}
		
		switch(fn)
		{ 
			case "out_standing_balance_arr["+dk+"]":
				obj_out_standing_balance.push(fv) ;
			break;
			case "late_fee_arr["+dk+"]":
				obj_late_fee_arr.push(fv) ;
			break;
			case "intrest_fee_arr["+dk+"]":
				obj_intrest_fee_arr.push(fv) ;
			break;
			case "current_balance_arr["+dk+"]":
				obj_current_balance_arr.push(fv) ;
			break;
			
			case "invoice_id_arr["+dk+"]":
				obj_invoice_id_arr.push(els.checked) ;
			break;	
		}
	}
	
	actual_amt = 0;
	for(var i = 0;i < obj_out_standing_balance.length;i++) 
	{
		if(!obj_invoice_id_arr[i]){
			continue;
		}
		
		if(!obj_out_standing_balance[i])
		{
			continue;
		}
		
		// Refund amount
		var out_standing_balance = convertIntoStandardFormat(obj_out_standing_balance[i]);
		if(!IsNumeric(out_standing_balance))
		{
			out_standing_balance = 0;
		}
		
		//Late fee
		var late_fee = convertIntoStandardFormat(obj_late_fee_arr[i]);
		if(!IsNumeric(late_fee))
		{
			late_fee = 0;
		}
		
		// Intrest fee
		var intrest_fee = convertIntoStandardFormat(obj_intrest_fee_arr[i]);
		if(!IsNumeric(intrest_fee))
		{
			intrest_fee = 0;
		}
		
		// Current balance
		var current_balance = convertIntoStandardFormat(obj_current_balance_arr[i]);
		if(!IsNumeric(current_balance))
		{
			current_balance = 0;
		}
		actual_amt = parseFloat(actual_amt) + parseFloat(current_balance);
		
		total_refund = (parseFloat(out_standing_balance) + parseFloat(intrest_fee) + parseFloat(late_fee));
		row_amount = parseFloat(current_balance) + parseFloat(total_refund);
		total_out_standing_balance = parseFloat(total_out_standing_balance) + parseFloat(total_refund);
		
		if(row_amount < 0)
		{
			row_amount = "<font color='red'>"+convertIntoLocalFormat(row_amount)+"</font>";
		}else{
			row_amount = convertIntoLocalFormat(row_amount);
		}
		
		document.getElementById('change_balance_'+i).innerHTML = row_amount;
		
	}
	
	actual_amt = roundNumber(actual_amt);
	$('#actual_amt').val(actual_amt); 
	$('#total_actual_amount').html(convertIntoLocalFormat(actual_amt));
	
	//actual_amt = $('#actual_amt').val();
	if(parseFloat(total_out_standing_balance) + parseFloat(actual_amt) != 0 || parseFloat(actual_amt) == 0){
		$('#submit_refund').hide();
		$('#div_from_account').hide();
		$('#div_to_account').hide();
		$('#div_payment_method').hide();
	}else{
		$('#submit_refund').show();
		$('#div_from_account').show();
		$('#div_to_account').show();
		$('#div_payment_method').show();
	}
	
	total_out_standing_balance = roundNumber(total_out_standing_balance);
	if(total_out_standing_balance < 0)
	{
		total_out_standing_balance = "<font color='red'>"+convertIntoLocalFormat(total_out_standing_balance)+"</font>";
	}
	else
	{
		total_out_standing_balance = convertIntoLocalFormat(total_out_standing_balance);
	}	 
	
	
	
	//document.getElementById(change_balance_id).innerHTML = row_amount;
	document.getElementById("total_refund_amount").innerHTML = total_out_standing_balance;
}

function makeDropDownEditable(target,data,default_value){
	
	if($('#'+target).length > 0){
		$('#'+target).editable({
	    	showbuttons: true,
		    unsavedclass: null,
		    type: 'select',
	        value: default_value,
	        source: data,
            inputclass: 'm-wrap invoice_your_reference',
          
	    }); 
	}
}


function verify_refund_amount(amount,refund_amount) 
{
	var total_out_standing_balance = amount;
	refund_amount = parseFloat(convertIntoStandardFormat(refund_amount));
	
	total_out_standing_balance = parseFloat(total_out_standing_balance);
	total_out_standing_balance =  Math.round(total_out_standing_balance*100)/100;
	refund_amount =  Math.round(refund_amount*100)/100;
	
	if((total_out_standing_balance + refund_amount) == 0){
		document.getElementById("refund_btn").style.display = '';
		total_out_standing_balance = total_out_standing_balance;
	}else{
		document.getElementById("refund_btn").style.display = 'none';
	}
}

/* #BUGID: 19832,19831, By: 054, ON: 19 JUNE 2014 */
function manageTab() {
	$('.tabDisable').keyup(function(e){ 	
		  if (e.keyCode == 9) {
			$('.tabDisable').attr('tabindex','-1');	
		  }
		 
	});

	/*$('.tabEnable').keyup(function(e){ 	
		  if (e.keyCode == 9) {			 
			$('.tabEnable').attr('tabindex','0');	
		  }
		 
	});*/
}


function calculateDiscount(type,line_key,from_line_total){
	
	// Unit price
	var unit_price = document.getElementById("unit_price_"+line_key).value;  
	unit_price = convertIntoStandardFormat(unit_price.trim());
	if(!IsNumeric(unit_price)){
		unit_price = '0';
	}
	unit_price = parseFloat(unit_price);
	
	// Quantity
	var qty = document.getElementById("qty_"+line_key).value;
	qty = convertIntoStandardFormat(qty.trim());
	if(!IsNumeric(qty)){
		qty = '0';
	}
	qty = parseFloat(qty);
	qty = Math.abs(qty);
	total_amount = parseInt(qty)*parseFloat(unit_price);
	
	if(type == 'amount'){
		
		// Discount amount
		var discount_amount = document.getElementById("discount_amount_"+line_key).value;
		discount_amount = convertIntoStandardFormat(discount_amount.trim());
		if(!IsNumeric(discount_amount)){
			discount_amount = '0';
		}
		discount_amount = parseFloat(discount_amount); 
		
		discount_percentage =  (parseFloat(discount_amount)/parseFloat(total_amount))*parseFloat(100);
		$('#discount_'+line_key).val(convertIntoLocalFormat(roundNumber(discount_percentage)));
	}else{
		// Discount percentage
		var discount = document.getElementById("discount_"+line_key).value;
		discount = convertIntoStandardFormat(discount.trim());
		if(!IsNumeric(discount)){
			discount = '0';
		}
		discount = parseFloat(discount);
		
		discount_amount =  (parseFloat(discount)*parseFloat(total_amount))/parseFloat(100); 
		$('#discount_amount_'+line_key).val(convertIntoLocalFormat(roundNumber(discount_amount)));
	}
	
	if(from_line_total != 'y'){
		calculateLineTotal('',line_key);
	}
	
}


function isTabbedEvent(e){
	if(window.event){
		  key = window.event.keyCode;     // IE
	}else{
		  key = e.which;     // firefox
	}
	if(key != 9){return false;}
	return true;
}

function reArrangeCalendarWidth()
{
	/*var CAL_WIDTH = 350;			// Default calendar width
	var CAL_MARGIN = 20;			//default margin
	
	wWindow = $(window).width();	// Window width
	wSidebar = $('#be_sidebar').width(); // sidebar width
	wWidget = $('#widget').width();		// Calendar widget width
	wWidget = parseFloat(wWidget) + parseFloat(30);

	
	
	$('#widget').css('float','');
	$('#calendars').css('float','');
	
	posSidebar = $('.page-sidebar').css('position');  // Position of side bar top/left
	mar_topWidget = $('#widget').css('margin-top');

	
	if(posSidebar == 'relative'){ // if sidebar is at top
		wSidebar = 0;
		
		if(wWindow > 600)
		{
			$('#calendars').css('width','65%');
			$('#widget').css('width','');
			$('#widget').css('float','left');
			//$('#calendars').css('float','right');
		}else{
			$('#widget').css('width',(parseFloat(wWindow) - parseFloat(20)));
			//$('.show_staff_calendar').css('width','');
		}
		
		$('.show_staff_calendar').css('width','');
		$('#calendars').css('width','');
		return;
	}
	$('#widget').css('width','400');
	if(mar_topWidget != '0px'){  // If widget is at bottom
		wWidget = 0;
		$('#calendar-box').css('width','100%');
	}
	
	
	
	wContent = parseFloat(wWindow) - parseFloat(wSidebar); // get display content width
	wCalendar = parseFloat(wContent) - parseFloat(wWidget);//
	wCalendar = parseFloat(wCalendar) - (parseFloat(33));
	
	calendarToshow = 1;
	extraSpace = 0;
	if(wWindow < CAL_WIDTH || wWindow < wCalendar){
		return;
	}
	
	var  TOTAL_CAL_SPACE = parseFloat(CAL_WIDTH) + parseFloat(CAL_MARGIN);
	total_cal_visible = $('.show_staff_calendar').length;
	nCalendars = parseFloat(wCalendar)/(parseFloat(TOTAL_CAL_SPACE));
	
	if(total_cal_visible > nCalendars){
		
		calendarToshow = parseInt(Math.floor(nCalendars));
	}else{
		calendarToshow = total_cal_visible;
	}
	
	extraSpace = parseFloat(wCalendar) - (parseFloat(TOTAL_CAL_SPACE) * parseFloat(calendarToshow));
	if(extraSpace < 0){
		extraSpace = 0;
	}else{
		extraSpace =  parseFloat(extraSpace) - parseFloat(20);
	}
	extraSpace = parseFloat(extraSpace)/parseFloat(calendarToshow);
	newCalendars = parseFloat(CAL_WIDTH) + parseFloat(extraSpace);
		
	// new width
	mul = ((parseFloat(newCalendars) + parseFloat(CAL_MARGIN)) * parseFloat(calendarToshow));
	
	//console.log(mul +' -- '+ wCalendar);
	if(mul > wCalendar){
		if(calendarToshow > 1){
			calendarToshow = parseFloat(calendarToshow) - parseFloat(1);
			
			newCalendars = parseFloat(newCalendars) + (parseFloat(newCalendars)/parseFloat(calendarToshow));

			//newCalendars = parseFloat(newCalendars) - (parseFloat(10));
		}
	}
	
	//newCalendars = parseFloat(newCalendars) - (parseFloat(20)/parseFloat(calendarToshow));
	
	//console.log(wCalendar+' -- '+newCalendars+' -- '+calendarToshow+' -- '+extraSpace);
	
	$('#calendars').width(wCalendar); 
	//$('#calendars').css('float','right');
	
	$('.show_staff_calendar').width(newCalendars);*/
}

//018
function limitAmount(target,e){
	
	if(e.keyCode == 190 || e.keyCode == 188  || e.keyCode == 46){ //e.keyCode == 8
		return;
	}
	
	var limit = 8; //default limit
	var target_value = $(target).val(); 
	
	pos = target_value.indexOf(',');
	target_value = convertIntoStandardFormat(target_value.trim());
	if(!IsNumeric(target_value)){
		target_value = '0.0';
	}
	
	target_value = roundNumber(target_value);
	target_value_arr = target_value.split('.');
	if(target_value_arr[0].length > limit){
		
		target_value = target_value.substr(0,limit);
		if(pos != -1){
			target_value = Number(target_value+'.'+target_value_arr[1]);
			target_value = roundNumber(target_value);
			target_value = convertIntoLocalFormat(target_value);
		}
		$(target).val(target_value);
	}
}

//054
function limitPrice(target,max){
	
	 $(target).keypress(function (e) {
			if((max == 'undefined') || (max ==null) ) {
				var max = 9;
			}
			
			var len = $(this).val().replace(/[^0-9]/g,"").length;
			
			if((e.which == 44) || (e.which == 46)  || (e.which == 8)  || (e.which >= 48 && e.which <= 57) || (e.keyCode == 9)){ //e.keyCode == 8
			
				if (e.which < 0x20) {
				  // e.which < 0x20, then it's not a printable character
				  // e.which === 0 - Not a character
				  return; // Do nothing
				}

				if (len >= max) {
				  e.preventDefault();
				}
			}else {
				e.preventDefault();
			}

		  });
}

/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
	function limitBundlePrice(target,max){
		$(target).keypress(function (e) {
			if((max == 'undefined') || (max ==null) ) {
				var max = 6;
			}
			var len = $(this).val().replace(/[^0-9]/g,"").length;
			if((e.which == 44) || (e.which == 46)  || (e.which == 8)  || (e.which >= 48 && e.which <= 57) || (e.keyCode == 9)){ //e.keyCode == 8
				if (e.which < 0x20) {
				  return;
				}
				if (len >= max) {
				  e.preventDefault();
				}
			}else {
				e.preventDefault();
			}

		});
	}
/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/

//By 054
function limitNumbers(id,limit) {
	
	$(id).inputmask({ "mask": "9", "repeat": limit,"greedy": false});

}

//BUG:20833   By :054   24 JULY 2014 
 function deleteProductLines() {
		var i = 0, line_key = 0;var arrkey = new Array();
		 $('.product_rows').reverse().each (function(){
			
			if( $(this).children('td:first').find("input[name='salesProduct.product_id[]']").val() != '' || $(this).children('td:first').find("input[name='salesProduct.text_line[]']").val() != '') 
			{	
				return false;
			}
			else {
				var target = $(this).children('td:first').find("input[name='salesProduct.text_line[]']");
				var id = target.attr('id');
				var arr = id.split('_');
				var key = arr[arr.length-1];
				arrkey.push(key);
				//alert("key" + key);	
				$('#sales_product_line_'+key).remove();
				i++;
			}	
		 });
		 return i;
}
//054
function addProductLines(linecount,i) {
		 
		 if( i > linecount ) {
			var add_line_count = Math.abs(parseInt(i) - parseInt(linecount));
				if(add_line_count > 0) {
				for(count=0 ; count < add_line_count ; count++){
					add_new_product_line();
					
				}
			 }
		 }
 }
// reverse traversing 
jQuery.fn.reverse = function() {
		return this.pushStack(this.get().reverse());
};

/*BUG #21160  BY: 054   30 JULY 2014*/
function changeUnits(el,key,maxunits,includedunits) {
	if(el.checked ) {
		
		$('#included_units_'+ key).val('0');
		$('#max_units_'+ key).val('0');
		$('#included_units_'+ key).prop("readonly",true);
		$('#max_units_'+ key).prop("readonly",true);
	}
	else {
		$('#included_units_'+ key).val(includedunits);
		$('#max_units_'+ key).val(maxunits);
		$('#included_units_'+ key).removeAttr('readonly');
		$('#max_units_'+ key).removeAttr('readonly');
	}
}



// Save current focus node from nicEdit
var nicEditEndNode;

/*BUG #23653  BY: 024   19 NOV 2014*/
function add_place_holder()
{
	var place_holder = document.getElementById('PartnerMailPlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	//place_holder = '%'+place_holder+'%';
	
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/* #024, 19-11-14 */ 				
			var distribution = document.getElementById('PartnerMailDistribution').value;
			if(distribution=="sms"){
				focus_id = "#nb_body_text";
			}
			if(focus_id == 'nb_body') {
				focus_id = "#nb_body";			   
			}else if(focus_id == '#nb_body_text'){
				focus_id = "#nb_body_text";
			}
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
				/* #024 29-12-2015 #33264: BookingEngine > A few minor bugs here: */ 
					if(focus_id == '#nb_body'){
						var editor = $(focus_id).data("wysihtml5").editor;
						editor.composer.commands.exec("insertHTML", $.trim(place_holder));
					}else{
						$(focus_id).insertAtCaret($.trim(place_holder)); 
					}
				/* #024 29-12-2015 #33264: BookingEngine > A few minor bugs here: */	
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END

/*BUG #024 25-11-2014 #24082: Add place holders in all relevant popus */
function add_trigger_sms_placeholder()
{
	var place_holder = document.getElementById('PartnerMailPlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/**** #024 29-12-2104 #25213, Corrections ***/	
			$('#partnersLegalIntrestTextNb').click(function(){
				focus_id = "#partnersLegalIntrestTextNb";			
			})
			$('#partnersLegalIntrestTextEn').click(function(){
				focus_id = "#partnersLegalIntrestTextEn";			
			}) 
			$('#partnersInvoiceMessageNb').click(function(){
				focus_id = "#partnersInvoiceMessageNb";			
			}) 
			$('#partnersInvoiceMessageEn').click(function(){
				focus_id = "#partnersInvoiceMessageEn";			
			})  
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
			 	$(focus_id).insertAtCaret($.trim(place_holder)); 
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END


/*BUG #024 25-11-2014 #24082: Add place holders in all relevant popus */
function add_trigger_email_placeholder()
{
	var place_holder = document.getElementById('PartnerEmailPlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/* #024, 19-11-14 */ 				
			if(focus_id == '#TriggerCustomTextSms'){
				focus_id = "#TriggerCustomTextSms";
			}else if(focus_id == 'nicEdit-main') {
				focus_id = ".nicEdit-main";			   
			}
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
			 	$(focus_id).insertAtCaret($.trim(place_holder)); 
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END


/*BUG #024 25-11-2014 #24082: Add place holders in all relevant popus */
function add_trigger_template_placeholder()
{
	var place_holder = document.getElementById('PartnerTemplatePlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	
	
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/* #024, 19-11-14 */ 				
			var distribution = document.getElementById('PartnerMailDistribution').value;
			if(distribution=="sms"){
				focus_id = "#nb_body_text";
			}
			if(focus_id == 'nicEdit-main') {
				focus_id = ".nicEdit-main";			   
			}else if(focus_id == '#nb_body_text'){
				focus_id = "#nb_body_text";
			}
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
			 	$(focus_id).insertAtCaret($.trim(place_holder)); 
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END

/*BUG #024 13-01-2015 #25811: Placeholders missing from SMS template composition */
function add_simple_trigger_template_placeholder()
{
	var place_holder = document.getElementById('PartnerMailPlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	
	
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/* #024, 19-11-14 */ 				
			if(focus_id == '#TriggerCustomTextSms'){
				focus_id = "#TriggerCustomTextSms";
			}
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
			 	$(focus_id).insertAtCaret($.trim(place_holder)); 
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END

//Funtion: to restrict the amount.
//Cannot exceed the amount in the text field.
function enterMaxAmount(src,e)
{
	var unidentifed_paid_amount = convertIntoStandardFormat($('#assign_paymentUnidentifedPaidAmount').val());
	var amount = convertIntoStandardFormat($(src).val());
	
	if(parseInt(amount) > parseInt(unidentifed_paid_amount))
	{
		showAlertMessage('Paid Amount cannot exceed Unidentified Amount','error');
		$(src).val(convertIntoLocalFormat(unidentifed_paid_amount));
		return false;
	} 
	
}

/*BUG:23202, BY:054  18 OCT 2014 */
function addOption(extDiv,selectbox,data,placeholder)
{ 
	var arr = [];
	for (var prop in data) {
		arr.push({'id' : prop,'text' : data[prop]});
	}
	if(arr.length > 0) 
	{
		extDiv.show();
		selectbox.empty();
		selectbox.append(
				$('<option></option>').val("").html("")
			);
		$.each(data, function(val, text) {
			selectbox.append(
				$('<option></option>').val(val).html(text)
			);
		});

		selectbox.select2().trigger('change');
		$input = selectbox;
		if((placeholder != 'undefined') || (placeholder !=null) ) {
			$input.attr("data-placeholder", placeholder);
		}else{
			$input.attr("data-placeholder", " ");
		}
		var select2 = $input.data("select2");
		select2.setPlaceholder();
	}else {
		extDiv.hide();
		selectbox.empty();
		selectbox.select2().trigger('change');
	}
}
function showConfirmMessageBox(el,message,dilogTitle,yesTitle,noTitle)
{
	if(message == '' || message == null || message == 'undefined'){
		message = 'Error';
	}
	
	if(dilogTitle == '' || dilogTitle == null || dilogTitle == 'undefined'){
		dilogTitle = 'Message';
	}
	if(yesTitle == '' || yesTitle == null || yesTitle == 'undefined'){
		yesTitle = 'Yes';
	}
	if(noTitle == '' || noTitle == null || noTitle == 'undefined'){
		noTitle = 'No';
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
	      height: 200,
	      modal: true,
	      title : dilogTitle,
	      buttons: [
	      	{
	      		'class' : 'btn green',	
	      		"text" : yesTitle,
	      		click: function() {
	      			$(this).dialog( "close" );
	      			if($(el) != '' && $(el) != null){
	      				show_modal(el,'popups1');
	    			}
    			} 
	      	},
	      	{
	      		'class' : 'btn',
	      		"text" : noTitle,
	      		click: function() {
	      			$(this).dialog( "close" );
    			}
	      	}
	      ]
	    });
	return;
}

function isTouchDevice()
{
	var ua = navigator.userAgent;
	var isTouchDevice = (
		ua.match(/iPad/i) ||
		ua.match(/iPhone/i) ||
		ua.match(/iPod/i) ||
		ua.match(/Android/i)
	);

	return isTouchDevice;
}

jQuery.fn.extend({
	insertAtCaret: function(myValue){
	  return this.each(function(i) {
	    if (document.selection) {
	      //For browsers like Internet Explorer
	      this.focus();
	      sel = document.selection.createRange();
	      sel.text = myValue;
	      this.focus();
	    }
	    else if (this.selectionStart || this.selectionStart == '0') {
	      //For browsers like Firefox and Webkit based
	      var startPos = this.selectionStart;
	      var endPos = this.selectionEnd;
	      var scrollTop = this.scrollTop;
	      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
	      this.focus();
	      this.selectionStart = startPos + myValue.length;
	      this.selectionEnd = startPos + myValue.length;
	      this.scrollTop = scrollTop;
	    } else {
	       this.value += myValue;
	       this.focus();
	    }
	  })
	}
});



/*#044 22-dec-2015 0033179: be > Utility meter functionality > Meter reading procedure*/
function calculateMeterLineTotal(val, id)
{	
	var myArray = new Array('new_meter_value_','text_line_');
	
	var flag='0';
	for(var i=0;i<myArray.length;i++)
	{
		if(!document.getElementById(myArray[i]+id)){			
			flag = '1';
			break;
		}
	}

	if(flag == '1'){
		return false;
	}

	if($('#text_line_'+id).val() == 'y'){
		return;
	}	
	
	var new_meter_value = parseInt($("#new_meter_value_"+id).val());
	var old_meter_value = parseInt($("#old_meter_value_"+id).html());	
	if(!IsNumeric(new_meter_value)){
		new_meter_value = '0';
	}			
	
	if(new_meter_value < old_meter_value){		
		$("#new_meter_value_"+id).val(0);
		$("#usage_"+id).html(0);
		$("#usage_val_"+id).val(0);		
		getSummaryMeterLineCalculation();
		showAlertMessage("Entered value is lower than the previously registered value",'error');
		return false;
	}	
	
	var usage = new_meter_value - old_meter_value;	
	$("#usage_"+id).html(usage);
	$("#usage_val_"+id).val(usage);	
			
	getSummaryMeterLineCalculation();	
}

/*#044 22-dec-2015 0033179: be > Utility meter functionality > Meter reading procedure*/
function getSummaryMeterLineCalculation()
{
	var obj_usage_val = new Array();	
	var final_gross_amount = 0;
	
	var fobj = document.getElementById('frmNewInvoice');
	if(fobj != null){
		for(var i = 0;i < fobj.elements.length;i++) 
		{
			els = fobj.elements[i];  
			fv = els.value;			
			fn = els.name;
			fd = els.disabled;
			
			if(fd){
				continue;
			}			
			switch(fn)
			{	
				case 'salesProduct.usage_val[]':	
					obj_usage_val.push(fv);
					break;	
			}
		}
	}	
	
	var vat_show = new Array();
	var vat_level_arr = new Array();	
	
	for(var i = 0;i < obj_usage_val.length;i++) 
	{
		if(!obj_usage_val[i])
			continue;

		var usage_val = obj_usage_val[i];
		
		usage_val = convertIntoStandardFormat(usage_val.trim());
		if(!IsNumeric(usage_val) )
			qty = 0;
		usage_val = parseFloat(usage_val);	
					
		final_gross_amount = final_gross_amount + usage_val;		
	}		
	$("#invoice_gross_amount").html(final_gross_amount);
	$("#invoice_total_meter").html(obj_usage_val.length);	
}

function showButton(){
	var invoice_gross_amount = $('#invoice_gross_amount').html();
	if(convertIntoStandardFormat(invoice_gross_amount) <= 0){
		$('#btn_send_credit').show();
		$('#btn_save_send_credit').show();
		$('#btn_send_invoice').hide();
		$('#btn_save_send_invoice').hide();
	}else{
		$('#btn_send_credit').hide();
		$('#btn_save_send_credit').hide();
		$('#btn_send_invoice').show();
		$('#btn_save_send_invoice').show();
	}
}
function convertDateIntoSiteFormat(d=''){
	if(d == '' || d == undefined || d==null){
		return '';
	}
	var date_format =  $('#date_format').val();
	var date_format_partner =  $('#date_format_partner').val();
	if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
		return moment(d).format(date_format_partner);
	}
	else{
		return moment(d).format(date_format.toUpperCase());
	}
}

(function( $ ){
   	$.fn.acceptOnlyFloat = function() {
	    $(this).keypress(function (event) {
	    	var charCode = (event.which) ? event.which : event.keyCode;
			if (charCode != 44 && charCode > 31 && (charCode < 48 || charCode > 57)) {
			    return false;
			}
			else {
			    //if dot sign entered more than once then don't allow to enter dot sign again. 46 is the code for dot sign
			    var parts = $(this).val().split(',');
			    if (parts.length > 1 && charCode == 44)
			      {
			        return false;
			      }
			    return true;

			}
	    });
   }; 
})( jQuery );

(function( $ ){
   	$.fn.limitAmountPrice = function(limit=8) {
	    $(this).keypress(function (event) {
	    	var e = event;
	    	if((max == 'undefined') || (max ==null) ) {
				var max = 9;
			}
			
			var len = $(this).val().replace(/[^0-9]/g,"").length;
			
			if((e.which == 44) || (e.which == 46)  || (e.which == 8)  || (e.which >= 48 && e.which <= 57) || (e.keyCode == 9)){ //e.keyCode == 8
			
				if (e.which < 0x20) {
				  // e.which < 0x20, then it's not a printable character
				  // e.which === 0 - Not a character
				 
					var target_value = $(this).val(); 
					
					pos = target_value.indexOf(',');
					target_value = convertIntoStandardFormat(target_value.trim());
					if(!IsNumeric(target_value)){
						target_value = '0.0';
					}
					
					target_value = roundNumber(target_value);
					target_value_arr = target_value.split('.');
					if(target_value_arr[0].length > limit){
						
						target_value = target_value.substr(0,limit);
						if(pos != -1){
							target_value = Number(target_value+'.'+target_value_arr[1]);
							target_value = roundNumber(target_value);
							target_value = convertIntoLocalFormat(target_value);
						}
						$(this).val(target_value);
					}
				  return; // Do nothing
				}

				if (len >= max) {
				  e.preventDefault();
				}
			}else {
				e.preventDefault();
			}
	    });
   }; 
})( jQuery );

function convertIntoSystemDate(d,split='.'){
	if(d==''){
		return false;
	}
	d = d.split(split);
	var date = checkNull(parseInt(d[0]));
	var month = checkNull(parseInt(d[1]));
	if(d[2] != '00'){
		var year = checkNull(parseInt(d[2]));
	}
	else{
		var year = d[2];
	}


	if(date=='' || date==undefined || date=='null' || isNaN(date)){
		return false;
	}
	if(month=='' || month==undefined || month=='null' || isNaN(month)){
		return false;
	}
	if(year=='' || year==undefined || year=='null' || isNaN(year)){
		return false;
	}
	console.log(date+'date');
	console.log(month+'month');
	console.log(year+'year');

	var current_year = moment().format('YY');
	var current_year1 =  moment().format('YYYY');
	current_year1 = current_year1[0] + current_year1[1];
	console.log(current_year1+'current_year1');
	if(year > current_year){
		year = '19' + year;
	}
	else{
		year = current_year1 + year;
	}
	

	var date = month+'/'+date+'/'+year;
	var a = moment(date);
	if(a._d=='Invalid Date'){
		return false;
	}

	var a = moment(date).format('YYYY-MM-DD');

	return a;

}

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
  var lang = $('#lang').val();
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
      lang:lang,
      language:language
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

  function setdkmodalStorage(cname, cvalue) {
    localStorage.setItem(""+cname+"",""+cvalue+"");
  }
  
  function getdkmodalStorage(cname) {
    return localStorage.getItem(cname);
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
			from_inbox: '',
		});
  	}
  
  }
  if(cust_con_id!=undefined && cust_con_id!=null && cust_con_id!=''){
    cid = cust_id;
    var customerData = cust_name+' <'+cust_cellphone+'>';
    //$(".customer_sms_input"+modal).val(customerData);
    $(".customer_sms_input" + modal).customtokenInput("add", {id: cid,name: cust_name,cellphone: contact_cellphone,number: customer_number,contact_name: contact_name,contact_cellphone: cust_cellphone,msg_id: parent_msg_id,reply_from: reply_from,from_inbox: from_inbox,
			cp_code:cell_code,});

    $('.popovers').popover();
    $(".cst_sms_contact_id"+modal).val(cust_con_id);
  }
  else if(cust_id!=undefined && cust_cellphone!=undefined){
    cid = cust_id;
    var customerData = cust_name+' <'+cust_cellphone+'>';
    //$(".customer_sms_input"+modal).val(customerData);
    $(".customer_sms_input" + modal).customtokenInput("add", {id: cid,name: cust_name,cellphone: cust_cellphone,number: customer_number,msg_id: parent_msg_id,reply_from: reply_from,from_inbox: from_inbox,cp_code:cell_code,});

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


/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 */
;(function($, window, document, undefined)
{
    var hasTouch = 'ontouchstart' in window;

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = (function()
    {
        var el    = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();

    var eStart  = hasTouch ? 'touchstart'  : 'mousedown',
        eMove   = hasTouch ? 'touchmove'   : 'mousemove',
        eEnd    = hasTouch ? 'touchend'    : 'mouseup';
        eCancel = hasTouch ? 'touchcancel' : 'mouseup';

    var defaults = {
            listNodeName    : 'ol',
            itemNodeName    : 'li',
            rootClass       : 'dd',
            listClass       : 'dd-list',
            itemClass       : 'dd-item',
            dragClass       : 'dd-dragel',
            handleClass     : 'dd-handle',
            collapsedClass  : 'dd-collapsed',
            placeClass      : 'dd-placeholder',
            noDragClass     : 'dd-nodrag',
            emptyClass      : 'dd-empty',
            expandBtnHTML   : '<button data-action="expand" type="button">Expand</button>',
            collapseBtnHTML : '<button data-action="collapse" type="button">Collapse</button>',
            group           : 0,
            maxDepth        : 5,
            threshold       : 20
        };

    function Plugin(element, options)
    {
        this.w  = $(window);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        init: function()
        {
            var list = this;

            list.reset();

            list.el.data('nestable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            $.each(this.el.find(list.options.itemNodeName), function(k, el) {
                list.setParent($(el));
            });

            list.el.on('click', 'button', function(e) {
                if (list.dragEl || (!hasTouch && e.button !== 0)) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item   = target.parent(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }
            });

            var onStartEvent = function(e)
            {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }
                if (!handle.length || list.dragEl || (!hasTouch && e.button !== 0) || (hasTouch && e.touches.length !== 1)) {
                    return;
                }
                e.preventDefault();
                list.dragStart(hasTouch ? e.touches[0] : e);
            };

            var onMoveEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(hasTouch ? e.touches[0] : e);
                }
            };

            var onEndEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(hasTouch ? e.touches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener(eStart, onStartEvent, false);
                window.addEventListener(eMove, onMoveEvent, false);
                window.addEventListener(eEnd, onEndEvent, false);
                window.addEventListener(eCancel, onEndEvent, false);
            } else {
                list.el.on(eStart, onStartEvent);
                list.w.on(eMove, onMoveEvent);
                list.w.on(eEnd, onEndEvent);
            }

        },

        serialize: function()
        {
            var data,
                depth = 0,
                list  = this;
                step  = function(level, depth)
                {
                    var array = [ ],
                        items = level.children(list.options.itemNodeName);
                    items.each(function()
                    {
                        var li   = $(this),
                            item = $.extend({}, li.data()),
                            sub  = li.children(list.options.listNodeName);
                        if (sub.length) {
                            item.children = step(sub, depth + 1);
                        }
                        array.push(item);
                    });
                    return array;
                };
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },

        serialise: function()
        {
            return this.serialize();
        },

        reset: function()
        {
            this.mouse = {
                offsetX   : 0,
                offsetY   : 0,
                startX    : 0,
                startY    : 0,
                lastX     : 0,
                lastY     : 0,
                nowX      : 0,
                nowY      : 0,
                distX     : 0,
                distY     : 0,
                dirAx     : 0,
                dirX      : 0,
                dirY      : 0,
                lastDirX  : 0,
                lastDirY  : 0,
                distAxX   : 0,
                distAxY   : 0
            };
            this.moving     = false;
            this.dragEl     = null;
            this.dragRootEl = null;
            this.dragDepth  = 0;
            this.hasNewRoot = false;
            this.pointEl    = null;
        },

        expandItem: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action="expand"]').hide();
            li.children('[data-action="collapse"]').show();
            li.children(this.options.listNodeName).show();
        },

        collapseItem: function(li)
        {
            var lists = li.children(this.options.listNodeName);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
                li.children('[data-action="collapse"]').hide();
                li.children('[data-action="expand"]').show();
                li.children(this.options.listNodeName).hide();
            }
        },

        expandAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.expandItem($(this));
            });
        },

        collapseAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.collapseItem($(this));
            });
        },

        setParent: function(li)
        {
            if (li.children(this.options.listNodeName).length) {
                li.prepend($(this.options.expandBtnHTML));
                li.prepend($(this.options.collapseBtnHTML));
            }
            li.children('[data-action="expand"]').hide();
        },

        unsetParent: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
        },

        dragStart: function(e)
        {
            var mouse    = this.mouse,
                target   = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;

            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());

            // fix for zepto.js
            //dragItem.after(this.placeEl).detach().appendTo(this.dragEl);
            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });
            // total depth of dragging item
            var i, depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function(e)
        {
            // fix for zepto.js
            //this.placeEl.replaceWith(this.dragEl.children(this.options.itemNodeName + ':first').detach());
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);

            this.dragEl.remove();
            this.el.trigger('change');
            if (this.hasNewRoot) {
                this.dragRootEl.trigger('change');
            }
            this.reset();
        },

        dragMove: function(e)
        {
            var list, parent, prev, next, depth,
                opt   = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX  = e.pageX;
            mouse.nowY  = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx   = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx  = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
            }
            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            }
            else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot   = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                    return;
                }
                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                    parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                }
                else if (before) {
                    this.pointEl.before(this.placeEl);
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                }
                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = pointElRoot;
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.nestable = function(params)
    {
        var lists  = this,
            retval = this;

        lists.each(function()
        {
            var plugin = $(this).data("nestable");

            if (!plugin) {
                $(this).data("nestable", new Plugin(this, params));
                $(this).data("nestable-id", new Date().getTime());
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

})(window.jQuery || window.Zepto, window, document);


/*
  SortTable
  version 2
  7th April 2007
  Stuart Langridge, http://www.kryogenix.org/code/browser/sorttable/

  Instructions:
  Download this file
  Add <script src="sorttable.js"></script> to your HTML
  Add class="sortable" to any table you'd like to make sortable
  Click on the headers to sort

  Thanks to many, many people for contributions and suggestions.
  Licenced as X11: http://www.kryogenix.org/code/browser/licence.html
  This basically means: do what you want with it.
*/


var stIsIE = /*@cc_on!@*/false;

sorttable = {
  init: function() {
    // quit if this function has already been called
    if (arguments.callee.done) return;
    // flag this function so we don't do the same thing twice
    arguments.callee.done = true;
    // kill the timer
    if (_timer) clearInterval(_timer);

    if (!document.createElement || !document.getElementsByTagName) return;

    sorttable.DATE_RE = /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/;

    forEach(document.getElementsByTagName('table'), function(table) {
      if (table.className.search(/\bsortable\b/) != -1) {
        sorttable.makeSortable(table);
      }
    });

  },

  makeSortable: function(table) {
    if (table.getElementsByTagName('thead').length == 0) {
      // table doesn't have a tHead. Since it should have, create one and
      // put the first table row in it.
      the = document.createElement('thead');
      the.appendChild(table.rows[0]);
      table.insertBefore(the,table.firstChild);
    }
    // Safari doesn't support table.tHead, sigh
    if (table.tHead == null) table.tHead = table.getElementsByTagName('thead')[0];

    if (table.tHead.rows.length != 1) return; // can't cope with two header rows

    // Sorttable v1 put rows with a class of "sortbottom" at the bottom (as
    // "total" rows, for example). This is B&R, since what you're supposed
    // to do is put them in a tfoot. So, if there are sortbottom rows,
    // for backwards compatibility, move them to tfoot (creating it if needed).
    sortbottomrows = [];
    for (var i=0; i<table.rows.length; i++) {
      if (table.rows[i].className.search(/\bsortbottom\b/) != -1) {
        sortbottomrows[sortbottomrows.length] = table.rows[i];
      }
    }
    if (sortbottomrows) {
      if (table.tFoot == null) {
        // table doesn't have a tfoot. Create one.
        tfo = document.createElement('tfoot');
        table.appendChild(tfo);
      }
      for (var i=0; i<sortbottomrows.length; i++) {
        tfo.appendChild(sortbottomrows[i]);
      }
      delete sortbottomrows;
    }

    // work through each column and calculate its type
    headrow = table.tHead.rows[0].cells;
    for (var i=0; i<headrow.length; i++) {
      // manually override the type with a sorttable_type attribute
      if (!headrow[i].className.match(/\bsorttable_nosort\b/)) { // skip this col
        mtch = headrow[i].className.match(/\bsorttable_([a-z0-9]+)\b/);
        if (mtch) { override = mtch[1]; }
          if (mtch && typeof sorttable["sort_"+override] == 'function') {
            headrow[i].sorttable_sortfunction = sorttable["sort_"+override];
          } else {
            headrow[i].sorttable_sortfunction = sorttable.guessType(table,i);
          }
          // make it clickable to sort
          headrow[i].sorttable_columnindex = i;
          headrow[i].sorttable_tbody = table.tBodies[0];
          dean_addEvent(headrow[i],"click", sorttable.innerSortFunction = function(e) {

          if (this.className.search(/\bsorttable_sorted\b/) != -1) {
            // if we're already sorted by this column, just
            // reverse the table, which is quicker
            sorttable.reverse(this.sorttable_tbody);
            this.className = this.className.replace('sorttable_sorted',
                                                    'sorttable_sorted_reverse');
            this.removeChild(document.getElementById('sorttable_sortfwdind'));
            sortrevind = document.createElement('span');
            sortrevind.id = "sorttable_sortrevind";
            sortrevind.innerHTML = stIsIE ? '&nbsp<font face="webdings">5</font>' : '&nbsp;&#x25B4;';
            this.appendChild(sortrevind);
            return;
          }
          if (this.className.search(/\bsorttable_sorted_reverse\b/) != -1) {
            // if we're already sorted by this column in reverse, just
            // re-reverse the table, which is quicker
            sorttable.reverse(this.sorttable_tbody);
            this.className = this.className.replace('sorttable_sorted_reverse',
                                                    'sorttable_sorted');
            this.removeChild(document.getElementById('sorttable_sortrevind'));
            sortfwdind = document.createElement('span');
            sortfwdind.id = "sorttable_sortfwdind";
            sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
            this.appendChild(sortfwdind);
            return;
          }

          // remove sorttable_sorted classes
          theadrow = this.parentNode;
          forEach(theadrow.childNodes, function(cell) {
            if (cell.nodeType == 1) { // an element
              cell.className = cell.className.replace('sorttable_sorted_reverse','');
              cell.className = cell.className.replace('sorttable_sorted','');
            }
          });
          sortfwdind = document.getElementById('sorttable_sortfwdind');
          if (sortfwdind) { sortfwdind.parentNode.removeChild(sortfwdind); }
          sortrevind = document.getElementById('sorttable_sortrevind');
          if (sortrevind) { sortrevind.parentNode.removeChild(sortrevind); }

          this.className += ' sorttable_sorted';
          sortfwdind = document.createElement('span');
          sortfwdind.id = "sorttable_sortfwdind";
          sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
          this.appendChild(sortfwdind);

            // build an array to sort. This is a Schwartzian transform thing,
            // i.e., we "decorate" each row with the actual sort key,
            // sort based on the sort keys, and then put the rows back in order
            // which is a lot faster because you only do getInnerText once per row
            row_array = [];
            col = this.sorttable_columnindex;
            rows = this.sorttable_tbody.rows;
            for (var j=0; j<rows.length; j++) {
              row_array[row_array.length] = [sorttable.getInnerText(rows[j].cells[col]), rows[j]];
            }
            /* If you want a stable sort, uncomment the following line */
            //sorttable.shaker_sort(row_array, this.sorttable_sortfunction);
            /* and comment out this one */
            row_array.sort(this.sorttable_sortfunction);

            tb = this.sorttable_tbody;
            for (var j=0; j<row_array.length; j++) {
              tb.appendChild(row_array[j][1]);
            }

            delete row_array;
          });
        }
    }
  },

  guessType: function(table, column) {
    // guess the type of a column based on its first non-blank row
    sortfn = sorttable.sort_alpha;
    for (var i=0; i<table.tBodies[0].rows.length; i++) {
      text = sorttable.getInnerText(table.tBodies[0].rows[i].cells[column]);
      if (text != '') {
        if (text.match(/^-?[£$¤]?[\d,.]+%?$/)) {
          return sorttable.sort_numeric;
        }
        // check for a date: dd/mm/yyyy or dd/mm/yy
        // can have / or . or - as separator
        // can be mm/dd as well
        possdate = text.match(sorttable.DATE_RE)
        if (possdate) {
          // looks like a date
          first = parseInt(possdate[1]);
          second = parseInt(possdate[2]);
          if (first > 12) {
            // definitely dd/mm
            return sorttable.sort_ddmm;
          } else if (second > 12) {
            return sorttable.sort_mmdd;
          } else {
            // looks like a date, but we can't tell which, so assume
            // that it's dd/mm (English imperialism!) and keep looking
            sortfn = sorttable.sort_ddmm;
          }
        }
      }
    }
    return sortfn;
  },

  getInnerText: function(node) {
    // gets the text we want to use for sorting for a cell.
    // strips leading and trailing whitespace.
    // this is *not* a generic getInnerText function; it's special to sorttable.
    // for example, you can override the cell text with a customkey attribute.
    // it also gets .value for <input> fields.

    if (!node) return "";

    hasInputs = (typeof node.getElementsByTagName == 'function') &&
                 node.getElementsByTagName('input').length;

    if (node.getAttribute("sorttable_customkey") != null) {
      return node.getAttribute("sorttable_customkey");
    }
    else if (typeof node.textContent != 'undefined' && !hasInputs) {
      return node.textContent.replace(/^\s+|\s+$/g, '');
    }
    else if (typeof node.innerText != 'undefined' && !hasInputs) {
      return node.innerText.replace(/^\s+|\s+$/g, '');
    }
    else if (typeof node.text != 'undefined' && !hasInputs) {
      return node.text.replace(/^\s+|\s+$/g, '');
    }
    else {
      switch (node.nodeType) {
        case 3:
          if (node.nodeName.toLowerCase() == 'input') {
            return node.value.replace(/^\s+|\s+$/g, '');
          }
        case 4:
          return node.nodeValue.replace(/^\s+|\s+$/g, '');
          break;
        case 1:
        case 11:
          var innerText = '';
          for (var i = 0; i < node.childNodes.length; i++) {
            innerText += sorttable.getInnerText(node.childNodes[i]);
          }
          return innerText.replace(/^\s+|\s+$/g, '');
          break;
        default:
          return '';
      }
    }
  },

  reverse: function(tbody) {
    // reverse the rows in a tbody
    newrows = [];
    for (var i=0; i<tbody.rows.length; i++) {
      newrows[newrows.length] = tbody.rows[i];
    }
    for (var i=newrows.length-1; i>=0; i--) {
       tbody.appendChild(newrows[i]);
    }
    delete newrows;
  },

  /* sort functions
     each sort function takes two parameters, a and b
     you are comparing a[0] and b[0] */
  sort_numeric: function(a,b) {
    aa = parseFloat(a[0].replace(/[^0-9.-]/g,''));
    if (isNaN(aa)) aa = 0;
    bb = parseFloat(b[0].replace(/[^0-9.-]/g,''));
    if (isNaN(bb)) bb = 0;
    return aa-bb;
  },
  sort_alpha: function(a,b) {
    if (a[0]==b[0]) return 0;
    if (a[0]<b[0]) return -1;
    return 1;
  },
  sort_ddmm: function(a,b) {
    mtch = a[0].match(sorttable.DATE_RE);
    y = mtch[3]; m = mtch[2]; d = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt1 = y+m+d;
    mtch = b[0].match(sorttable.DATE_RE);
    y = mtch[3]; m = mtch[2]; d = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt2 = y+m+d;
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
  },
  sort_mmdd: function(a,b) {
    mtch = a[0].match(sorttable.DATE_RE);
    y = mtch[3]; d = mtch[2]; m = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt1 = y+m+d;
    mtch = b[0].match(sorttable.DATE_RE);
    y = mtch[3]; d = mtch[2]; m = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt2 = y+m+d;
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
  },

  shaker_sort: function(list, comp_func) {
    // A stable sort function to allow multi-level sorting of data
    // see: http://en.wikipedia.org/wiki/Cocktail_sort
    // thanks to Joseph Nahmias
    var b = 0;
    var t = list.length - 1;
    var swap = true;

    while(swap) {
        swap = false;
        for(var i = b; i < t; ++i) {
            if ( comp_func(list[i], list[i+1]) > 0 ) {
                var q = list[i]; list[i] = list[i+1]; list[i+1] = q;
                swap = true;
            }
        } // for
        t--;

        if (!swap) break;

        for(var i = t; i > b; --i) {
            if ( comp_func(list[i], list[i-1]) < 0 ) {
                var q = list[i]; list[i] = list[i-1]; list[i-1] = q;
                swap = true;
            }
        } // for
        b++;

    } // while(swap)
  }
}

/* ******************************************************************
   Supporting functions: bundled here to avoid depending on a library
   ****************************************************************** */

// Dean Edwards/Matthias Miller/John Resig

/* for Mozilla/Opera9 */
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", sorttable.init, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
    document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
    var script = document.getElementById("__ie_onload");
    script.onreadystatechange = function() {
        if (this.readyState == "complete") {
            sorttable.init(); // call the onload handler
        }
    };
/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
    var _timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
            sorttable.init(); // call the onload handler
        }
    }, 10);
}

/* for other browsers */
window.onload = sorttable.init;

// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini

// http://dean.edwards.name/weblog/2005/10/add-event/

function dean_addEvent(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else {
        // assign each event handler a unique ID
        if (!handler.$$guid) handler.$$guid = dean_addEvent.guid++;
        // create a hash table of event types for the element
        if (!element.events) element.events = {};
        // create a hash table of event handlers for each element/event pair
        var handlers = element.events[type];
        if (!handlers) {
            handlers = element.events[type] = {};
            // store the existing event handler (if there is one)
            if (element["on" + type]) {
                handlers[0] = element["on" + type];
            }
        }
        // store the event handler in the hash table
        handlers[handler.$$guid] = handler;
        // assign a global event handler to do all the work
        element["on" + type] = handleEvent;
    }
};
// a counter used to create unique IDs
dean_addEvent.guid = 1;

function removeEvent(element, type, handler) {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else {
        // delete the event handler from the hash table
        if (element.events && element.events[type]) {
            delete element.events[type][handler.$$guid];
        }
    }
};

function handleEvent(event) {
    var returnValue = true;
    // grab the event object (IE uses a global event object)
    event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type];
    // execute each event handler
    for (var i in handlers) {
        this.$$handleEvent = handlers[i];
        if (this.$$handleEvent(event) === false) {
            returnValue = false;
        }
    }
    return returnValue;
};

function fixEvent(event) {
    // add W3C standard event methods
    event.preventDefault = fixEvent.preventDefault;
    event.stopPropagation = fixEvent.stopPropagation;
    return event;
};
fixEvent.preventDefault = function() {
    this.returnValue = false;
};
fixEvent.stopPropagation = function() {
  this.cancelBubble = true;
}

// Dean's forEach: http://dean.edwards.name/base/forEach.js
/*
    forEach, version 1.0
    Copyright 2006, Dean Edwards
    License: http://www.opensource.org/licenses/mit-license.php
*/

// array-like enumeration
if (!Array.forEach) { // mozilla already supports this
    Array.forEach = function(array, block, context) {
        for (var i = 0; i < array.length; i++) {
            block.call(context, array[i], i, array);
        }
    };
}

// generic enumeration
Function.prototype.forEach = function(object, block, context) {
    for (var key in object) {
        if (typeof this.prototype[key] == "undefined") {
            block.call(context, object[key], key, object);
        }
    }
};

// character enumeration
String.forEach = function(string, block, context) {
    Array.forEach(string.split(""), function(chr, index) {
        block.call(context, chr, index, string);
    });
};

// globally resolve forEach enumeration
var forEach = function(object, block, context) {
    if (object) {
        var resolve = Object; // default
        if (object instanceof Function) {
            // functions have a "length" property
            resolve = Function;
        } else if (object.forEach instanceof Function) {
            // the object implements a custom forEach method so use that
            object.forEach(block, context);
            return;
        } else if (typeof object == "string") {
            // the object is a string
            resolve = String;
        } else if (typeof object.length == "number") {
            // the object is array-like
            resolve = Array;
        }
        resolve.forEach(object, block, context);
    }
};



(function($){var defaults={width:610,height:500,minimizedWidth:200,gutter:10,poppedOutDistance:"10%",title:"New Message",dialogClass:"",buttons:[],animationSpeed:10,opacity:1,dockID:'',initialState:'docked',showClose:!0,showPopout:!0,showMinimize:!0,create:undefined,open:undefined,beforeClose:undefined,close:undefined,beforeMinimize:undefined,minimize:undefined,beforeRestore:undefined,restore:undefined,beforePopout:undefined,popout:undefined};var dClass="dockmodal";var windowWidth=$(window).width();function setAnimationCSS($this,$el){var aniSpeed=$this.options.animationSpeed/1000;$el.css({"transition":aniSpeed+"s right, "+aniSpeed+"s left, "+aniSpeed+"s top, "+aniSpeed+"s bottom, "+aniSpeed+"s height, "+aniSpeed+"s width"});return!0}
function removeAnimationCSS($el){$el.css({"transition":"none"});return!0}
var methods={init:function(options){return this.each(function(){var $this=$(this);var data=$this.data('dockmodal');if(windowWidth<590){defaults.height=250;defaults.width=275}
$this.options=$.extend({},defaults,options);if(!data){$this.data('dockmodal',$this)}else{$("body").append($this.closest("."+dClass).show());methods.refreshLayout();setTimeout(function(){methods.restore.apply($this)},$this.options.animationSpeed);return}
var $body=$("body");var $window=$(window);var $dockModal=$('<div/>').addClass(dClass).addClass($this.options.dialogClass);if($this.options.initialState=="modal"){$dockModal.addClass("popped-out")}else if($this.options.initialState=="minimized"){$dockModal.addClass("minimized")}
$dockModal.height(0);setAnimationCSS($this,$dockModal);var $dockHeader=$('<div></div>').addClass(dClass+"-header");if($this.options.showClose){$('<a href="#" style="text-decoration:none;" class="header-action action-close" title="Close"><i class="icon-remove" style="color:#fff;"></i></a>').appendTo($dockHeader).click(function(e){methods.destroy.apply($this);return!1})}
if($this.options.showPopout){$('<a href="#" style="text-decoration:none;" class="header-action action-popout" title="Pop out"><i class="icon-resize-full" style="color:#fff;"></i></a>').appendTo($dockHeader).click(function(e){if($dockModal.hasClass("popped-out")){methods.restore.apply($this)}else{methods.popout.apply($this)}
return!1})}
if($this.options.showMinimize){$('<a href="#" style="text-decoration:none;" class="header-action action-minimize" title="Minimize"><i class="icon-minus" style="color:#fff;"></i></a>').appendTo($dockHeader).click(function(e){if($dockModal.hasClass("minimized")){if($dockModal.hasClass("popped-out")){methods.popout.apply($this)}else{methods.restore.apply($this)}}else{methods.minimize.apply($this)}
return!1})}
if($this.options.showMinimize&&$this.options.showPopout){$dockHeader.click(function(){if($dockModal.hasClass("minimized")){if($dockModal.hasClass("popped-out")){methods.popout.apply($this)}else{methods.restore.apply($this)}}else{methods.minimize.apply($this)}
return!1})}
$dockHeader.append('<div class="title-text">'+($this.options.title||$this.attr("title"))+'</div>');$dockModal.append($dockHeader);var $placeholder=$('<div class="modal-placeholder"></div>').insertAfter($this);$this.placeholder=$placeholder;var $dockBody=$('<div></div>').addClass(dClass+"-body").append($this);$dockModal.append($dockBody);if($this.options.buttons.length){var $dockFooter=$('<div></div>').addClass(dClass+"-footer");var $Fcontainer=$('<div></div>').addClass('dkf-container');var $dockFooterButtonset=$('<div style="padding-top: 5px;"></div>').addClass(dClass+"-footer-buttonset pull-left");var $Feditor=$('<div></div>').addClass('dkf-editor pull-left');$Feditor.attr("id","dockeditor"+$this.options.dockID);$Fcontainer.append($dockFooterButtonset);$.each($this.options.buttons,function(indx,el){var $btn=$('<button href="#" class="btn"></button>');$btn.attr({"id":el.id,"class":el.buttonClass});$btn.html(el.html);$btn.click(function(e){el.click(e,$this);return!1});$dockFooterButtonset.append($btn)});var $Fattachment='<span style="font-size: 20px; background-color: inherit; padding: 3px 3px; margin: 5px;"  class="btn pull-left dock-fileinput-btn'+$this.options.dockID+'" data-toggle="tooltip" title="Attachment" ><span style="transform: rotate(45deg); display: block;"><i class="icon-paper-clip"></i></span></span>';$Fcontainer.append($Fattachment);$Fcontainer.append($Feditor);$Fcontainer.append('<div style="clear:both;"></div>');$dockFooter.append($Fcontainer);$dockModal.append($dockFooter)}else{$dockModal.addClass("no-footer")}
var $overlay=$("."+dClass+"-overlay");if(!$overlay.length){$overlay=$('<div/>').addClass(dClass+"-overlay")}
if($.isFunction($this.options.create)){$this.options.create($this)}
$body.append($dockModal);$dockModal.after($overlay);$dockBody.focus();if($.isFunction($this.options.open)){setTimeout(function(){$this.options.open($this)},$this.options.animationSpeed)}
if($dockModal.hasClass("minimized")){$dockModal.find(".dockmodal-body, .dockmodal-footer").hide();methods.minimize.apply($this)}else{if($dockModal.hasClass("popped-out")){methods.popout.apply($this)}else{methods.restore.apply($this)}}
$body.data("windowWidth",$window.width());$window.unbind("resize.dockmodal").bind("resize.dockmodal",function(){if($window.width()==$body.data("windowWidth")){return}
$body.data("windowWidth",$window.width());methods.refreshLayout()})})},destroy:function(){return this.each(function(){var $this=$(this).data('dockmodal');if(!$this)
return;if($.isFunction($this.options.beforeClose)){if($this.options.beforeClose($this)===!1){return}}
try{var $dockModal=$this.closest("."+dClass);if($dockModal.hasClass("popped-out")&&!$dockModal.hasClass("minimized")){$dockModal.css({"left":"50%","right":"50%","top":"50%","bottom":"50%"})}else{$dockModal.css({"width":"0","height":"0"})}
setTimeout(function(){$this.removeData('dockmodal');$this.placeholder.replaceWith($this);$dockModal.remove();$("."+dClass+"-overlay").hide();methods.refreshLayout();if($.isFunction($this.options.close)){$this.options.close($this)}},$this.options.animationSpeed)}
catch(err){alert(err.message)}})},close:function(){methods.destroy.apply(this)},minimize:function(){return this.each(function(){var $this=$(this).data('dockmodal');if(!$this)
return;if($.isFunction($this.options.beforeMinimize)){if($this.options.beforeMinimize($this)===!1){return}}
var $dockModal=$this.closest("."+dClass);var headerHeight=$dockModal.find(".dockmodal-header").outerHeight();$dockModal.addClass("minimized").css({"width":$this.options.minimizedWidth+"px","height":headerHeight+"px","left":"auto","right":"auto","top":"auto","bottom":"0"});setTimeout(function(){$dockModal.find(".dockmodal-body, .dockmodal-footer").hide();if($.isFunction($this.options.minimize)){$this.options.minimize($this)}},$this.options.animationSpeed);$("."+dClass+"-overlay").hide();$dockModal.find(".action-minimize").attr("title","Restore");methods.refreshLayout()})},restore:function(){return this.each(function(){var $this=$(this).data('dockmodal');if(!$this)
return;if($.isFunction($this.options.beforeRestore)){if($this.options.beforeRestore($this)===!1){return}}
var $dockModal=$this.closest("."+dClass);$dockModal.removeClass("minimized popped-out");$dockModal.find(".dockmodal-body, .dockmodal-footer").show();$dockModal.css({"width":$this.options.width+"px","height":$this.options.height,"left":"auto","right":"auto","top":"auto","bottom":"0"});$("."+dClass+"-overlay").hide();$dockModal.find(".action-minimize").attr("title","Minimize");$dockModal.find(".action-popout").attr("title","Pop-out");setTimeout(function(){if($.isFunction($this.options.restore)){$this.options.restore($this)}},$this.options.animationSpeed);methods.refreshLayout()})},popout:function(){return this.each(function(){var $this=$(this).data('dockmodal');if(!$this)
return;if($.isFunction($this.options.beforePopout)){if($this.options.beforePopout($this)===!1){return}}
var $dockModal=$this.closest("."+dClass);$dockModal.find(".dockmodal-body, .dockmodal-footer").show();removeAnimationCSS($dockModal);var offset=$dockModal.position();var windowWidth=$(window).width();$dockModal.css({"width":"auto","height":"auto","max-height":"620px","left":offset.left+"px","right":(windowWidth-offset.left-$dockModal.outerWidth(!0))+"px","top":offset.top+"px","bottom":0});setAnimationCSS($this,$dockModal);setTimeout(function(){$dockModal.removeClass("minimized").addClass("popped-out").css({"width":"auto","height":"auto","max-height":"620px","left":$this.options.poppedOutDistance,"right":$this.options.poppedOutDistance,"top":$this.options.poppedOutDistance,"bottom":$this.options.poppedOutDistance});$("."+dClass+"-overlay").show();$dockModal.find(".action-popout").attr("title","Pop-in");methods.refreshLayout()},10);setTimeout(function(){if($.isFunction($this.options.popout)){$this.options.popout($this)}},$this.options.animationSpeed)})},refreshLayout:function(){var right=0;var windowWidth=$(window).width();$.each($("."+dClass).toArray().reverse(),function(i,val){var $dockModal=$(this);var $this=$dockModal.find("."+dClass+"-body > div").data("dockmodal");var index=$this.options.dockID.substr(5);if($dockModal.hasClass("minimized")){setdkmodalStorage('modalstate'+index,'minimized')}
else{setdkmodalStorage('modalstate'+index,'docked')}
if($dockModal.hasClass("popped-out")&&!$dockModal.hasClass("minimized")){return}
if(windowWidth>380){right+=$this.options.gutter;$dockModal.css({"right":right+"px",'margin-right':'55px'});if($dockModal.hasClass("minimized")){right+=$this.options.minimizedWidth}else{right+=$this.options.width}
if(right>windowWidth){$dockModal.hide()}else{setTimeout(function(){$dockModal.show()},$this.options.animationSpeed)}}
else{right+=$this.options.gutter;$dockModal.css({"right":right+"px",'margin-right':'55px'});if(right>windowWidth){$dockModal.hide()}else{setTimeout(function(){$dockModal.show()},$this.options.animationSpeed)}}})},};$.fn.dockmodal=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof method==='object'||!method){return methods.init.apply(this,arguments)}else{$.error('Method '+method+' does not exist on jQuery.dockmodal')}}})(jQuery)

//Datepicker defaults

var ln = $('#lang').val();if(ln == 'nb'){$.fn.datepicker.defaults.weekStart = 1;ln = 'no';}else{ln = 'en';}
$.fn.datepicker.defaults.language = ln;
//Datepicker defaults


function resizemodal(){
	$('.modal.in').each(function(){
		var popups = $(this).attr('id');
		//var popups = 'popups';
		var w = $(this).attr('data-width');

		if(w == undefined || w == '' || w == null){
			var w = $(this).css('width');
			if(w != undefined && w != '' && w != null){
				w = w.replace('px','');
			}
			if(w == undefined || w == '' || w == null){
				w = 600;
			}

		}
		
		$('#'+popups).css('width', w+'px');
		$('#'+popups).data('width',w+'px');
		$('#'+popups).data('modal').options.width = w+'px';
		
		$('#'+popups).css('margin-left', function () {
			if (/%/ig.test(w)){
				return -(parseInt(w) / 2) + '%';
			} else {
				return -(w / 2) + 'px';
			}
		});

		var modalOverflow = $(window).height() - 10 < $('#'+popups).height();
          console.log('modalOverflow',modalOverflow);
		if (modalOverflow ) {
			$('#'+popups)
				.css('margin-top', 0)
				.addClass('modal-overflow');
		} else {
			$('#'+popups)
				.css('margin-top', 0 - $('#'+popups).height() / 2)
				.removeClass('modal-overflow');
		}
	});

	$(window).trigger('resize');

	App.fixContentHeight();

	$('.dropdown-toggle').dropdown();
}

function after_main_page(){
	$('.dropdown-toggle').dropdown();
	App.fixContentHeight();
	App.scrollTop();
}

/*Boat store settings*/
boat_store_sett = {
	start:function(){
		new_custom_popup2('750','popups1','boatstore_settings',{});
	},
};
/*Boat store settings*/
