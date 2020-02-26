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
	    	$('body').modalmanager('removeLoading');
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
	    	$('body').modalmanager('removeLoading');
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
		var myArray = new Array('qty_', 'vat_level_', 'discount_','discount_amount_', 'unit_price_','gross_amount_','text_line_','actual_inventory_','inventory_product_');
	}else{
		var myArray = new Array('qty_', 'vat_level_', 'discount_','discount_amount_', 'unit_price_','gross_amount_','text_line_');
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
		}else{
			tax = roundNumber((parseFloat(taxable_amount)  * parseInt(percentage))/ 100);
		}

		if(tax != '0' && tax != '')
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
	
	final_discount = roundNumber(final_discount);
	final_net_amount = roundNumber(final_net_amount);
	final_tax = roundNumber(final_tax);
	final_gross_amount = parseFloat(final_taxable_amount) + parseFloat(final_tax);
	
	// Show summary
	$("#invoice_net_amount").html(convertIntoLocalFormat(roundNumber(final_net_amount)));
	$("#invoice_total_mva").html(convertIntoLocalFormat(roundNumber(final_tax)));
	$("#invoice_total_discount").html(convertIntoLocalFormat(roundNumber(final_discount)));
	
	
	if($("#calculate_round_off").length && $("#round_off").length && $("#round_off_value").length && $("#round_off_value").val())
	{
		var round_off_value = $("#round_off_value").val().trim();
		if(round_off_value && round_off_value != null){
			final_gross_amount = getRoundOff(final_gross_amount, round_off_value);
		}
	}else if($("#calculate_round_off").length && $("#round_off").length){
		$("#calculate_round_off").html(convertIntoLocalFormat(parseFloat(0)));
		$("#round_off").val(parseFloat(0));
		//final_gross_amount = final_net_amount;
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
		  tr += "<tr><td class=''>"+outgoing_vat+"</td>";
		  tr += "<td class='' >"+i+"&nbsp;%</td>";
		  tr += "<td class='' style='text-align:right' >kr "+convertIntoLocalFormat(roundNumber(distinct_total[i]))+"</td>";
		  base_amount = parseFloat(base_amount) + parseFloat(distinct_total[i]);
		  var cal_vat = (parseFloat(i)/100)*parseFloat(distinct_total[i]);
		  cal_vat = roundNumber(cal_vat); 

		  tr += "<td class='' style='text-align:right' >kr "+convertIntoLocalFormat(cal_vat)+"</td></tr>";
	  }
	 
	  base_amount =  roundNumber(base_amount);
	  /*if(document.getElementById("cal_taxable_amount"))
		  document.getElementById("cal_taxable_amount").innerHTML = convertIntoLocalFormat(base_amount);
	  document.getElementById("taxable_amount").value = base_amount; */
	  if(tr == ''){
		  $('#perform_vat_calculation').parent().parent().parent().hide();
	  }else{
		  if(calculation == '' || calculation == undefined){
			document.getElementById("perform_vat_calculation").innerHTML = tab+tr;
			$('#perform_vat_calculation').parent().parent().parent().show();
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

//App scripts

var App=function(){var e,a=!1,o=!1,s=!1,t=[],i={blue:"#4b8df8",red:"#e02222",green:"#35aa47",purple:"#852b99",grey:"#555555","light-grey":"#fafafa",yellow:"#ffb848"},n=function(){($(window).width()<=1280||$("body").hasClass("page-boxed"))&&$(".responsive").each(function(){var e=$(this).attr("data-tablet"),a=$(this).attr("data-desktop");e&&($(this).removeClass(a),$(this).addClass(e))}),$(window).width()>1280&&!1===$("body").hasClass("page-boxed")&&$(".responsive").each(function(){var e=$(this).attr("data-tablet"),a=$(this).attr("data-desktop");e&&($(this).removeClass(e),$(this).addClass(a))})},r=function(){$(window).width()<980&&$("body").removeClass("page-sidebar-closed")},l=function(){for(var e in t){t[e].call()}},d=function(){v(),r(),n(),c(),b(),p(),l()},c=function(){var e,a=$(".page-content"),o=$(".page-sidebar"),s=$("body");if(!0===s.hasClass("page-footer-fixed")&&!1===s.hasClass("page-sidebar-fixed")){var t=$(window).height()-$(".footer").height();a.height()<t&&a.attr("style","min-height:"+t+"px !important")}else(e=s.hasClass("page-sidebar-fixed")?h():o.height()+20)>=a.height()&&a.attr("style","min-height:"+e+"px !important")};$(".ss_sidebar_toggler").on("click",function(e){var a=$("body"),o=$(".page-sidebar");return setTimeout("reArrangeCalendarWidth();",10),"0px"==$("div.nav-collapse").css("height")?(console.log("insasas"),$("div.nav-collapse").addClass("in"),$("div.nav-collapse").css("height","auto"),$("div.nav-collapse ul").css("height","auto"),$("div.nav-collapse ul").css("display","block"),void setTimeout(function(){$("div.nav-collapse ul.sub-menu").css("display","none"),$("div.nav-collapse li.active").css("display","block"),$("div.nav-collapse li.active").addClass("open"),$("div.nav-collapse li.active ul").show(),$(".ss-page-logo").show()},10)):$("div.nav-collapse").hasClass("in")?($("div.nav-collapse").removeClass("in"),$("div.nav-collapse").css("height","0"),$("div.nav-collapse ul").css("height","0"),void $("div.nav-collapse ul.sub-menu").css("display","none")):a.hasClass("page-sidebar-hover-on")&&a.hasClass("page-sidebar-fixed")||o.hasClass("page-sidebar-hovering")?(a.removeClass("page-sidebar-hover-on"),o.css("width","").hide().show(),e.stopPropagation(),void l()):($(".sidebar-search",o).removeClass("open"),a.hasClass("page-sidebar-closed")?(a.removeClass("page-sidebar-closed"),a.hasClass("page-sidebar-fixed")&&o.css("width","")):a.addClass("page-sidebar-closed"),a.hasClass("page-sidebar-closed")?($(".ss-page-logo").hide(),$("div.ss_sidebar_toggler").css("margin","18px 0px 0px -7px"),$("div.ss_sidebar_toggler").css("padding-right","7px")):($(".ss-page-logo").show(),$("div.ss_sidebar_toggler").css("margin","18px 0 0 13px"),$("div.ss_sidebar_toggler").css("padding-right","14px")),void l())});var h=function(){var e=$(window).height()-$(".header").height()+1;return $("body").hasClass("page-footer-fixed")&&(e-=$(".footer").height()),e},p=function(){var e=$(".page-sidebar-menu");if(1===e.parent(".slimScrollDiv").size()&&(e.slimScroll({destroy:!0}),e.removeAttr("style"),$(".page-sidebar").removeAttr("style")),0!==$(".page-sidebar-fixed").size()){if($(window).width()>=980){var o=h();e.slimScroll({size:"7px",color:"#a1b2bd",opacity:.3,position:a?"left":1===$(".page-sidebar-on-right").size()?"left":"right",height:o,allowPageScroll:!1,disableFadeOut:!1}),c()}}else c()},u=function(){!1!==$("body").hasClass("page-sidebar-fixed")&&($(".page-sidebar").off("mouseenter").on("mouseenter",function(){var e=$("body");!1===e.hasClass("page-sidebar-closed")||!1===e.hasClass("page-sidebar-fixed")||$(this).hasClass("page-sidebar-hovering")||(e.removeClass("page-sidebar-closed").addClass("page-sidebar-hover-on"),$(this).addClass("page-sidebar-hovering"),$(this).animate({width:225},400,"",function(){$(this).removeClass("page-sidebar-hovering")}))}),$(".page-sidebar").off("mouseleave").on("mouseleave",function(){var e=$("body");!1===e.hasClass("page-sidebar-hover-on")||!1===e.hasClass("page-sidebar-fixed")||$(this).hasClass("page-sidebar-hovering")||($(this).addClass("page-sidebar-hovering"),$(this).animate({width:35},400,"",function(){$("body").addClass("page-sidebar-closed").removeClass("page-sidebar-hover-on"),$(this).removeClass("page-sidebar-hovering")}))}))},f=function(){if(jQuery().uniform){var e=$("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");e.size()>0&&e.each(function(){0==$(this).parents(".checker").size()&&($(this).show(),$(this).uniform())})}},v=function(){App.isTouchDevice()?jQuery(".tooltips:not(.no-tooltip-on-touch-device)").tooltip():jQuery(".tooltips").tooltip()},b=function(){jQuery().chosen&&$(".chosen").each(function(){$(this).chosen({allow_single_deselect:"1"==$(this).attr("data-with-deselect")})})},g=function(){var e=$(".color-panel");0==$("body").hasClass("page-boxed")&&$(".layout-option",e).val("fluid"),$(".sidebar-option",e).val("default"),$(".header-option",e).val("fixed"),$(".footer-option",e).val("default");var a="";$(".icon-color",e).click(function(){$(".color-mode").show(),$(".icon-color-close").show()}),$(".icon-color-close",e).click(function(){$(".color-mode").hide(),$(".icon-color-close").hide()}),$("li",e).click(function(){var a,o=$(this).attr("data-style");a=o,$("#style_color").attr("href","assets/css/themes/"+a+".css"),$.cookie("style_color",a),$(".inline li",e).removeClass("current"),$(this).addClass("current")}),$(".layout-option, .header-option, .sidebar-option, .footer-option",e).change(function(){var o=$(".layout-option",e).val(),s=$(".sidebar-option",e).val(),t=$(".header-option",e).val(),i=$(".footer-option",e).val();"fixed"==s&&"default"==t&&(alert("Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar."),$(".sidebar-option",e).val("default"),s="default"),$("body").removeClass("page-boxed").removeClass("page-footer-fixed").removeClass("page-sidebar-fixed").removeClass("page-header-fixed"),$(".header > .navbar-inner > .container").removeClass("container").addClass("container-fluid"),1===$(".page-container").parent(".container").size()&&$(".page-container").insertAfter(".header"),1===$(".footer > .container").size()?$(".footer").html($(".footer > .container").html()):1===$(".footer").parent(".container").size()&&$(".footer").insertAfter(".page-container"),$("body > .container").remove(),"boxed"===o&&($("body").addClass("page-boxed"),$(".header > .navbar-inner > .container-fluid").removeClass("container-fluid").addClass("container"),$(".header").after('<div class="container"></div>'),$(".page-container").appendTo("body > .container"),"fixed"===i||"default"===s?$(".footer").html('<div class="container">'+$(".footer").html()+"</div>"):$(".footer").appendTo("body > .container"));a!=o&&l(),a=o,"fixed"===t?($("body").addClass("page-header-fixed"),$(".header").removeClass("navbar-static-top").addClass("navbar-fixed-top")):($("body").removeClass("page-header-fixed"),$(".header").removeClass("navbar-fixed-top").addClass("navbar-static-top")),"fixed"===s?$("body").addClass("page-sidebar-fixed"):$("body").removeClass("page-sidebar-fixed"),"fixed"===i?$("body").addClass("page-footer-fixed"):$("body").removeClass("page-footer-fixed"),c(),p(),u()})},m=function(){$("#trigger_fullscreen").click(function(){document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement?document.cancelFullScreen?document.cancelFullScreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitCancelFullScreen&&document.webkitCancelFullScreen():document.documentElement.requestFullscreen?document.documentElement.requestFullscreen():document.documentElement.mozRequestFullScreen?document.documentElement.mozRequestFullScreen():document.documentElement.webkitRequestFullscreen&&document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)})};return{init:function(){var t,i,h;"rtl"===$("body").css("direction")&&(a=!0),o=!!navigator.userAgent.match(/MSIE 8.0/),s=!!navigator.userAgent.match(/MSIE 9.0/),!!navigator.userAgent.match(/MSIE 10.0/)&&jQuery("html").addClass("ie10"),o?$(window).resize(function(){i!=document.documentElement.clientHeight&&(t&&clearTimeout(t),t=setTimeout(function(){d()},50),i=document.documentElement.clientHeight)}):$(window).resize(function(){t&&clearTimeout(t),t=setTimeout(function(){d()},50)}),f(),$(".scroller").each(function(){var e;e=$(this).attr("data-height")?$(this).attr("data-height"):$(this).css("height"),$(this).slimScroll({size:"7px",color:"#a1b2bd",position:a?"left":"right",height:e,alwaysVisible:"1"==$(this).attr("data-always-visible"),railVisible:"1"==$(this).attr("data-rail-visible"),disableFadeOut:!0})}),r(),n(),c(),p(),u(),jQuery(".page-sidebar").on("click","li > a",function(e){if(0!=$(this).next().hasClass("sub-menu")){var a=$(this).parent().parent(),o=$(this);a.children("li.open").children("a").children(".arrow").removeClass("open"),a.children("li.open").children(".sub-menu").slideUp(200),a.children("li.open").removeClass("open");var s=jQuery(this).next();s.is(":visible")?(jQuery(".arrow",jQuery(this)).removeClass("open"),jQuery(this).parent().removeClass("open"),s.slideUp(200,function(){0==$("body").hasClass("page-sidebar-fixed")&&0==$("body").hasClass("page-sidebar-closed")&&App.scrollTo(o,-200),c()})):(jQuery(".arrow",jQuery(this)).addClass("open"),jQuery(this).parent().addClass("open"),s.slideDown(200,function(){0==$("body").hasClass("page-sidebar-fixed")&&0==$("body").hasClass("page-sidebar-closed")&&App.scrollTo(o,-200),c()})),e.preventDefault()}else $(".btn-navbar").hasClass("collapsed")}),jQuery(".page-sidebar").on("click"," li > a.ajaxify",function(e){e.preventDefault(),App.scrollTop();var a=$(this).attr("href"),o=jQuery(".page-sidebar ul"),s=$(".page-content"),t=$(".page-content .page-content-body");o.children("li.active").removeClass("active"),o.children("arrow.open").removeClass("open"),$(this).parents("li").each(function(){$(this).addClass("active"),$(this).children("a > span.arrow").addClass("open")}),$(this).parents("li").addClass("active"),App.blockUI(s,!1),$.ajax({type:"GET",cache:!1,url:a,dataType:"html",success:function(e){App.unblockUI(s),t.html(e),App.fixContentHeight(),App.initUniform()},error:function(e,a,o){t.html("<h4>Could not load the requested content.</h4>"),App.unblockUI(s)},async:!1})}),$(".header").on("click",".hor-menu .hor-menu-search-form-toggler",function(e){$(this).hasClass("hide")?($(this).removeClass("hide"),$(".header .hor-menu .search-form").hide()):($(this).addClass("hide"),$(".header .hor-menu .search-form").show()),e.preventDefault()}),$(".header").on("click",".hor-menu .search-form .btn",function(e){window.location.href="extra_search.html",e.preventDefault()}),$(".header").on("keypress",".hor-menu .search-form input",function(e){e.which}),$(".page-sidebar").on("click",".sidebar-toggler",function(e){var a=$("body"),o=$(".page-sidebar");if(setTimeout("reArrangeCalendarWidth();",10),a.hasClass("page-sidebar-hover-on")&&a.hasClass("page-sidebar-fixed")||o.hasClass("page-sidebar-hovering"))return a.removeClass("page-sidebar-hover-on"),o.css("width","").hide().show(),e.stopPropagation(),void l();$(".sidebar-search",o).removeClass("open"),a.hasClass("page-sidebar-closed")?(a.removeClass("page-sidebar-closed"),a.hasClass("page-sidebar-fixed")&&o.css("width","")):a.addClass("page-sidebar-closed"),l()}),$(".page-sidebar").on("click",".sidebar-search .remove",function(e){e.preventDefault(),$(".sidebar-search").removeClass("open")}),$(".page-sidebar").on("keypress",".sidebar-search input",function(e){e.which}),$(".sidebar-search .submit").on("click",function(e){e.preventDefault(),$("body").hasClass("page-sidebar-closed")&&0==$(".sidebar-search").hasClass("open")&&(1===$(".page-sidebar-fixed").size()&&$(".page-sidebar .sidebar-toggler").click(),$(".sidebar-search").addClass("open"))}),(o||s)&&jQuery("input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)").each(function(){var e=jQuery(this);""==e.val()&&""!=e.attr("placeholder")&&e.addClass("placeholder").val(e.attr("placeholder")),e.focus(function(){e.val()==e.attr("placeholder")&&e.val("")}),e.blur(function(){""!=e.val()&&e.val()!=e.attr("placeholder")||e.val(e.attr("placeholder"))})}),jQuery(".footer").on("click",".go-top",function(e){App.scrollTo(),e.preventDefault()}),g(),jQuery("body").on("click",".portlet > .portlet-title > .tools > a.remove",function(e){e.preventDefault(),jQuery(this).closest(".portlet").remove()}),jQuery("body").on("click",".portlet > .portlet-title > .tools > a.reload",function(e){e.preventDefault();var a=jQuery(this).closest(".portlet").children(".portlet-body");App.blockUI(a),window.setTimeout(function(){App.unblockUI(a)},1e3)}),jQuery("body").on("click",".portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand",function(e){e.preventDefault();var a=jQuery(this).closest(".portlet").children(".portlet-body");jQuery(this).hasClass("collapse")?(jQuery(this).removeClass("collapse").addClass("expand"),a.slideUp(200)):(jQuery(this).removeClass("expand").addClass("collapse"),a.slideDown(200))}),$("body").on("click",".dropdown-menu.hold-on-click",function(e){e.stopPropagation()}),function(){var e=function(e){$(e).each(function(){var e=$($($(this).attr("href"))),a=$(this).parent().parent();a.height()>e.height()&&e.css("min-height",a.height())})};if($("body").on("shown",'.nav.nav-tabs.tabs-left a[data-toggle="tab"], .nav.nav-tabs.tabs-right a[data-toggle="tab"]',function(){e($(this))}),$("body").on("shown",".nav.nav-tabs",function(){c()}),e('.nav.nav-tabs.tabs-left > li.active > a[data-toggle="tab"], .nav.nav-tabs.tabs-right > li.active > a[data-toggle="tab"]'),location.hash){var a=location.hash.substr(1);$('a[href="#'+a+'"]').click()}}(),v(),jQuery(".popovers").popover(),$(document).on("click.popover.data-api",function(a){e&&e.popover("hide")}),$(".accordion").collapse().height("auto"),jQuery("body").on("click",".accordion.scrollable .accordion-toggle",function(){h=jQuery(this)}),jQuery("body").on("shown",".accordion.scrollable",function(){jQuery("html,body").animate({scrollTop:h.offset().top-150},"slow")}),b(),jQuery().modalmanager||($("body").on("shown",".modal",function(e){$("body").addClass("modal-open")}),$("body").on("hidden",".modal",function(e){0===$(".modal").size()&&$("body").removeClass("modal-open")})),App.addResponsiveHandler(b),m()},fixContentHeight:function(){c()},setLastPopedPopover:function(a){e=a},addResponsiveHandler:function(e){t.push(e)},setEqualHeight:function(e){(e=jQuery(e)).each(function(){var e=$(this).height();e>0&&(tallestColumn=e)}),e.height(0)},scrollTo:function(e,a){pos=e?e.offset().top:0,jQuery("html,body").animate({scrollTop:pos+(a||0)},"slow")},scrollTop:function(){App.scrollTo()},blockUI:function(e,a){(e=jQuery(e)).block({message:'<img src="'+ASSET_URL+'img/ajax-loading.gif" align="">',centerY:void 0!=a||a,css:{top:"10%",border:"none",padding:"2px",backgroundColor:"none"},overlayCSS:{backgroundColor:"#000",opacity:0,cursor:"wait"},baseZ:99999})},unblockUI:function(e){jQuery(e).unblock({onUnblock:function(){jQuery(e).removeAttr("style")}})},initUniform:function(e){e?jQuery(e).each(function(){0==$(this).parents(".checker").size()&&($(this).show(),$(this).uniform())}):f()},updateUniform:function(e){$.uniform.update(e)},initChosenSelect:function(e){$(e).chosen({allow_single_deselect:!0})},initFancybox:function(){jQuery.fancybox&&jQuery(".fancybox-button").size()>0&&jQuery(".fancybox-button").fancybox({groupAttr:"data-rel",prevEffect:"none",nextEffect:"none",closeBtn:!0,helpers:{title:{type:"inside"}}})},getActualVal:function(e){return(e=jQuery(e)).val()===e.attr("placeholder")?"":e.val()},getURLParameter:function(e){var a,o,s=window.location.search.substring(1).split("&");for(a=0;a<s.length;a++)if((o=s[a].split("="))[0]==e)return unescape(o[1]);return null},isTouchDevice:function(){try{return document.createEvent("TouchEvent"),!0}catch(e){return!1}},isIE8:function(){return o},isRTL:function(){return a},getLayoutColorCode:function(e){return i[e]?i[e]:""}}}();