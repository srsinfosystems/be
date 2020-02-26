function update_fields(value) 
{
	var url = document.getElementById("ASSET_URL").value;
	var base_url = document.getElementById("BASE_URL").value;
	//var lType = document.getElementById("LOGIN_TYPE").value;
	//var img_url = url.replace(lType+"/",'');
	document.getElementById("updateDiv"+value).innerHTML="<img src='"+url+"img/input-spinner.gif' />";
	
	controller=document.getElementById("controller"+value).value;
	action=document.getElementById("action"+value).value;
	groups=document.getElementById("groups").value;
	groupsArr=groups.split(',');
	qstr = 'controller='+controller+'&action='+action;
	var j=3;
	for (var i=0; i<groupsArr.length; i++) {
		if (document.getElementById(groupsArr[i]+value).checked) {
			qstr +='&'+groupsArr[i]+'=1';
		} else {
			qstr +='&'+groupsArr[i]+'=0';
		}
		j++;
	}
	var xmlHttpReq = false;
	var self = this;
	// Mozilla/Safari
	if (window.XMLHttpRequest) {
		self.xmlHttpReq = new XMLHttpRequest();
	}
	// IE
	else if (window.ActiveXObject) {
		self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	self.xmlHttpReq.open('POST', base_url+'update_permission', true);
	self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	self.xmlHttpReq.onreadystatechange = function() {
		if (self.xmlHttpReq.readyState == 4) {
			if (self.xmlHttpReq.responseText==1) {
				document.getElementById("updateDiv"+value).innerHTML="</span><span class=\"text-success\">Saved</span>";
				$('#updateDiv'+value).addClass('success');
				$('#updateDiv'+value).removeClass('error');
			} else {
				document.getElementById("updateDiv"+value).innerHTML="<span class=\"text-error\">Failed</span>";
				$('#updateDiv'+value).addClass('error');
				$('#updateDiv'+value).removeClass('success');
			}
		}
	}
	self.xmlHttpReq.send(qstr);
}


