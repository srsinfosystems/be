var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();

var ot_tab_id;
var ot_dt;
var ot_td;
var ot_meta;
var table;
var task_status = {};
var task_types = {};
var inspections_trigger_settings = {};
var task_trigger_settings = {};
var order_tasks = {
	start:function(tab_id,meta){
		ot_tab_id = tab_id;
		ot_meta = meta;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			order_id:ot_meta.order_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['alert message','Success','$email','$srno','Task type','Title','Scheduled date','End time','Staff','Status','Action','View','records','of','Found total','Not started','Ongoing','Completed','Open','Delete','$del_o_task','$del_per_task','Warning','Cancel','Confirmation','Close','Delete permanently','Move to unassigned task','Success','No record found','Create task'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Tasks/getOrderTasks.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				ot_dt = complet_data.response.response;
				ot_td = complet_data.response.response.translationsData;
				order_tasks.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		ot_dt.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		ot_dt.base_url = base_url;
		task_status = {
			yet:ot_td.Notstarted,
			run:ot_td.Ongoing,
			comp:ot_td.Completed,
			open:ot_td.Open,
		};

		ot_dt.task_status = task_status;

		for(var j in ot_dt.getTaskTypes){
			var ptt = ot_dt.getTaskTypes[j].PartnerTaskType;
			var internal_name = ptt.internal_name;
			var name = ptt.name;
			task_types[internal_name] = name;
		}

		if(checkNull(ot_dt.getTriggers.inspections) != ''){
			inspections_trigger_settings = ot_dt.getTriggers.inspections;
		}

		if(checkNull(ot_dt.getTriggers.task) != ''){
			task_trigger_settings = ot_dt.getTriggers.task;
		}

		ot_dt.hidebutton = '';
		if(checkNull(od_dt.orderStatusInvMsg) != ''){
			ot_dt.hidebutton = 'y';
		}
		else{
			ot_dt.hidebutton = 'n';
		}
		var template = document.getElementById('order_tasks_template').innerHTML;
		var compiledRendered = Template7(template, ot_dt);
		document.getElementById(ot_tab_id).innerHTML = compiledRendered;
		order_tasks.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		order_tasks.generateRows(ot_dt.getTaskListFromOrderId);
	},
	generateRows:function(data){
		var tableData = [];
		var i = 0;
		var j = 1;
		var first_id = '';
		for(var k in data){

			var pt = data[k].PartnerTask;

			if(i == 0){
				first_id = pt.id;
			}

			var u = data[k].User;
			tableData[i] = [];
			tableData[i].push(j);
			tableData[i].push(checkNull(task_types[pt.task_type]));
			tableData[i].push(pt.task_name);

			if(checkNull(pt.schedule_date,'') != ''){
				var sched_date = convertDateIntoSiteFormat(pt.schedule_date);
				sched_date += ' - '+moment(pt.schedule_date).format('H:m');
				tableData[i].push(sched_date);
			}
			else{
				tableData[i].push(checkNull(pt.schedule_date,'-'));
			}
			
			if(checkNull(pt.due_date,'') != ''){
				var due_date = convertDateIntoSiteFormat(pt.due_date);
				due_date += ' - '+moment(pt.due_date).format('H:m');
				tableData[i].push(due_date);
			}
			else{
				tableData[i].push(checkNull(pt.due_date,'-'));
			}
			
			var name = '';
			if(checkNull(u.first_name) != '' || checkNull(u.last_name) != ''){
				if(checkNull(u.first_name) != ''){
					name = u.first_name;
				}
				if(checkNull(u.last_name) != ''){
					if(name != ''){
						name += ' '+u.last_name;
					}
					else{
						name += u.last_name;
					}
				}
			}
			tableData[i].push(checkNull(name,'-'));
			tableData[i].push(checkNull(task_status[pt.task_status],'-'));

			var act = '<p style="display:none" class="del_row" data-id="'+pt.id+'"></p>';

			act += '<button style="cursor:pointer;" onclick="order_tasks.view('+pt.id+')" class="btn mini blue-stripe"><i class="icon-eye-open"></i>&nbsp;'+ot_td.View+'</button>';
			
			if(pt.task_status != 'comp'){
				var ds = {
					id:checkNull(pt.id),
					order_id:checkNull(pt.order_id),
					contact_id:checkNull(pt.contact_id),
					task_type:checkNull(pt.task_type)
				};
				ds = JSON.stringify(ds);
				ds = ds.replace(/\"/g,"'");
				act += '&nbsp;<button class="btn mini red-stripe" onclick="order_tasks.delete('+ds+')"><i class="icon-remove"></i>&nbsp;'+ot_td.Delete+'</button>';
			}
			

			tableData[i].push(act);
			i++;
			j++;
		}

		order_tasks.bindTable(tableData);

		if("order_details" in window && "od_dt" in window){
			od_dt.task_id = first_id;
			od_dt.task_count = i;
			order_details.handleActionLink(1);
		}
	},
	bindTable:function(tableData){

		$('#order_task_list').show();
		$('#order_task_list').DataTable().destroy();
		table = $('#order_task_list').DataTable({
 			"pagingType": "input",
			"data":tableData,
 		 	"dom": "<'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
 		 	"language": {
			"lengthMenu": 
	           	ot_td.View+ ' <select>'+
					'<option value="10">10</option>'+
					'<option value="20">20</option>'+
					'<option value="30">30</option>'+
					'<option value="40">40</option>'+
					'<option value="50">50</option>'+
					'<option value="-1">All</option>'+
					'</select> '+ ot_td.records + ' |  '
		         ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':ot_td.of,
					'Page':ot_td.Page,
				},
				"info": ot_td.Foundtotal+" _TOTAL_ "+ot_td.records
			},
 		});

 		order_tasks.checkEmpty();
	},
	checkEmpty:function(){
		if($('#order_task_list .dataTables_empty').length != 0){
			$('#order_task_list').hide();
			$('#order_task_list_wrapper .dataTables_info').hide();
			$('#order_task_empty').show();
		}
		else{
			$('#order_task_list').show();
			$('#order_task_list_wrapper .dataTables_info').show();
			$('#order_task_empty').hide();
		}
	},
	delete:function(data){
		var yes = function(){
			if(data.task_type == 'inspection'){
				$('#send_trigger_session_cancel_inspections').val(1);
			}else{
				$('#send_trigger_session_cancel').val(1);
			}
			var ask_every_time_session_cancel = $('#ask_every_time_session_cancel').val();
			var ask_every_time_session_cancel_inspections = $('#send_trigger_session_cancel_inspections').val();

			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				task_id:data.id,
				ask_every_time_session_cancel:ask_every_time_session_cancel,
				ask_every_time_session_cancel_inspections:ask_every_time_session_cancel_inspections
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Tasks/delete_task.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			};
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					table.$('tr').each(function(i){
			   			if($(this).find('.del_row').attr('data-id') == data.id){
			   				table.row(this).remove().draw();
			   				return false;
			   			}
					});
					if("order_details" in window && "od_dt" in window){
						var first_id = '';
						for(var j in ot_dt.getTaskListFromOrderId){
							var pt = ot_dt.getTaskListFromOrderId[j].PartnerTask;
							if(pt.id != data.id){
								first_id = pt.id;
								break;
							}
						}
						var c = 0;
						for(var j in ot_dt.getTaskListFromOrderId){
							var pt = ot_dt.getTaskListFromOrderId[j].PartnerTask;
							if(pt.id != data.id){
								c++;
							}
						}
						od_dt.task_id = first_id;
						od_dt.task_count = c;
						order_details.handleActionLink('task');
					}
					order_tasks.checkEmpty();
					call_toastr('success',ot_td.Success,complet_data.response.response.message.msg);
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',ot_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',ot_td.alertmessage);
						return;
					}	
				}
			}
			showProcessingImage('undefined');
			doAjax(params);
			return;
		};
		var no = function(){
			if(task_type == 'inspection'){
				$('#send_trigger_session_cancel_inspections').val(0);
			}else{
				$('#send_trigger_session_cancel').val(0);
			}
		};
		if(checkNull(data.contact_id) != ''){
			var one = function(){
				yes();
			};
			var two = function(){
				getUserIP(function(ip){
					var total_params = {
						token:token,
						language:language,
						lang:lang,
						partner_id:partner_id,
						admin_id:admin_id,
						task_id:data.id,
						ip_address:ip,
						order_id:ot_meta.order_id,
						from:'new_task'
					};

					var params = $.extend({}, doAjax_params_default);
					params['url'] = APISERVER+'/api/Tasks/moveToUnassigned.json';
					params['data'] = total_params;
					params['completeCallbackFunction'] = function (){
						hideProcessingImage();
					};
					params['successCallbackFunction'] = function (complet_data){
						if(complet_data.response.status == 'success'){
							order_tasks.generateRows(complet_data.response.response.getTaskListFromOrderId);
							call_toastr('success',ot_td.Success,complet_data.response.response.message.msg);
						}
						else if(complet_data.response.status == 'error'){
							if(complet_data.response.response.error == 'validationErrors'){
								var mt_arr = complet_data.response.response.list;
								var array = $.map(mt_arr, function(value, index) {
									return value+'<br />';
								});
								showAlertMessage(array,'error',ot_td.alertmessage);
								return;
							}else{
								showAlertMessage(complet_data.response.response.msg,'error',ot_td.alertmessage);
								return;
							}	
						}
					}
					showProcessingImage('undefined');
					doAjax(params);
					return;

				});
			};
			var three = function(){};
			order_tasks.showConfMessage(ot_td.$del_per_task,ot_td.Confirmation,one,two,three,'ui-dialog-blue',ot_td.Deletepermanently,ot_td.Movetounassignedtask,ot_td.Close);
		}
		else{
			

			if(data.task_type == 'inspection'){
				var ask_cancel_task = checkNull(inspections_trigger_settings.ask_inspections_cancel_task);
				var send_trigger_session_cancel = $('#send_trigger_session_cancel_inspections').val();
			}
			else{
				var ask_cancel_task = checkNull(task_trigger_settings.ask_task_cancel_task);
				var send_trigger_session_cancel = $('#send_trigger_session_cancel').val();
			}

			if(send_trigger_session_cancel == '2'){
				if(ask_cancel_task == '1'){
					yes();
				}
				else{
					showDeleteMessage(ot_td.$del_o_task,ot_td.Warning,yes,no,'ui-dialog-blue',ot_td.Delete,ot_td.Cancel);
				}
			}
			else{
				yes();
			}
		}
	},
	showConfMessage:function(message,dilogTitle,one_event,two_event,three_event,color='',one_btn='',two_btn='',three_btn=''){
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
		      		'class' : 'btn green',	
		      		"text" : one_btn,
		      		click: function() {
		      			$(this).dialog( "close" );
		      			if (typeof one_event === "function") {
		               		 one_event();
		            	}
		       			
	    			}
		      	}, 
		      	{
		      		'class' : 'btn purple',
		      		"text" : two_btn,
		      		click: function() {
		      			$(this).dialog( "close" );
		      			if (typeof two_event === "function") {
		               		 two_event();
		            	}
		      			
	    			}
		      	},
		      	{
		      		'class' : 'btn',	
		      		"text" : three_btn,
		      		click: function() {
		      			$(this).dialog( "close" );
		      			if (typeof three_event === "function") {
		               		 three_event();
		            	}
		       			
	    			}
		      	},
		      ]
		    });
		return;
	},
	view:function(id){
		var url = base_url + 'task/new_task/'+id+'?request_from=order_details&from=new_order';
		var a = document.createElement('div');
		$(a).attr('data-url',url);
		$(a).attr('data-width','700px');
		show_modal(a,'popups1');
	},
	showPopup:function(which){
		if(which == 'task'){
			var url = base_url + 'task/new_task/'+ot_meta.order_id+'/'+ot_meta.order_number+'?request_from=order_details';
			var a = document.createElement('div');
			$(a).attr('data-url',url);
			$(a).attr('data-width','700px');
			show_modal(a,'popups1');
		}
	},
}
