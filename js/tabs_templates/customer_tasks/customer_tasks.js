var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();
var ct_dt;
var ct_tab_id;
var ct_meta;
var ct_data;
var ct_td;
var task_status = {};

var customer_tasks = {
	start:function(tab_id,meta_data={}){
		ct_tab_id = tab_id;
		ct_meta = meta_data;
		if($.isEmptyObject(meta_data)){
			return;
		}

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_id:ct_meta.customer_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['General','Dashboard','alert message','$srno','Task type','Title','Scheduled date','End time','Staff','Status','Action','Not started','Ongoing','Completed','Open','View','Delete','$del_or_move','Delete permanently','Move to unassigned task','Confirmation','View','records','of','Found total','No record found'],			
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/getCustomerTasks.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				ct_data = complet_data.response.response;
				ct_td = complet_data.response.response.translationsData;
				customer_tasks.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ct_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ct_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;

	},
	createHtml:function(){
		ct_data.translationsData.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('customer_tasks_template').innerHTML;
		var compiledRendered = Template7(template, ct_data);
		document.getElementById(ct_tab_id).innerHTML = compiledRendered;
		customer_tasks.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		task_status = {
			yet:ct_td.Notstarted,
			run:ct_td.Ongoing,
			comp:ct_td.Completed,
			open:ct_td.Open,
		};
		customer_tasks.generateTaskList(ct_data.getTasksList);	
	},
	getTaskName(internal_name){
		var task_name = internal_name;
		for(var j in ct_data.getTaskTypes){
			if(ct_data.getTaskTypes[j].PartnerTaskType.internal_name == internal_name){
				task_name = ct_data.getTaskTypes[j].PartnerTaskType.name;
				break
			}
		}
		return task_name;
	},
	generateTaskList:function(data){
		var start = 0;
		$('#task_table').dataTable().fnDestroy();
		for(var j in data){
			var pt = data[j].PartnerTask;
			var u = data[j].User;
			var cust = data[j].Customer;
		
			if(pt.task_status == 'comp'){
				var tr = '<tr class="taskcomp">';
			}
			else{
				var tr = '<tr data-id="'+pt.id+'">';
			}
			
				tr += '<td>';
					//tr += ++start;
				tr += '</td>';

				tr += '<td>';
					tr += customer_tasks.getTaskName(pt.task_type);
				tr += '</td>';

				tr += '<td>';
					tr += pt.task_name;
				tr += '</td>';

				var t = [];
				var dt = [];
				var d = '';
				var time = '';
				if(checkNull(pt.schedule_date)!=''){
					dt = pt.schedule_date.split(' ');
					d = convertDateIntoSiteFormat(checkNull(dt[0]));
					t = checkNull(dt[1]);
					t = t.toString().match(/.{1,5}/g);
					
				}
				
				if(checkNull(t[0])!=''){
					time = ' - '+t[0];
				}
				tr += '<td>';
					tr += d+time;
				tr += '</td>';

				var t = [];
				var dt = [];
				var d = '';
				var time = '';
				if(checkNull(pt.due_date)!=''){
					dt = pt.due_date.split(' ');
					d = convertDateIntoSiteFormat(checkNull(dt[0]));
					t = checkNull(dt[1]);
					t = t.toString().match(/.{1,5}/g);
				}
				
				if(checkNull(t[0])!=''){
					time = ' - '+t[0];
				}
				tr += '<td>';
					tr += d+time;
				tr += '</td>';

				tr += '<td>';
					tr += checkNull(u.first_name)+' '+checkNull(u.last_name);
				tr += '</td>';

				var status = pt.task_status;

				tr += '<td>';
					tr += checkNull(task_status[status],status);
				tr += '</td>';

				tr += '<td>';
					var url = base_url + 'task/new_task/'+pt.id+'?request_from=customer_task_details&f_request_from=card&request_to=customer_details';

					tr += '<button class="btn mini blue-stripe" data-url="'+url+'" onclick="event.stopPropagation(); show_modal(this,\'popups1\');" data-width="800px"><i class="icon-eye-open"></i>&nbsp;'+ct_td.View+'</button>';

					if(pt.task_status != 'comp'){

						tr += '<button class="btn mini red-stripe" onclick="customer_tasks.disable_task('+pt.id+',this,'+cust.id+',\''+pt.task_type+'\',\''+pt.contact_id+'\')"><i class="icon-remove"></i>&nbsp;'+ct_td.Delete+'</button>';
					}
				tr += '</td>';	


				

				 

			tr += '</tr>';
			$('#task_table').append(tr);
			
		}
		if(data.length!=0){
			var len = 10;
			ct_dt = $('#task_table').dataTable({ 
				"iDisplayLength": len,
				sColumns:[],
				"aoColumns": [
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": true },
					{ "bSortable": false },
				],
				"aLengthMenu": [ 10, 25, 50, 100 ],
				//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
				"sDom": "<'row-fluid't><'row-fluid'<'span12'pli>>",
				"sPaginationType": "input",
				"fnDrawCallback": function ( oSettings ) {
		            /* Need to redo the counters if filtered or sorted */
		            if ( oSettings.bSorted || oSettings.bFiltered )
		            {
		                $('#task_table').dataTable().$('td:first-child', {"filter":"applied"}).each( function (i) {
		                     $('#task_table').dataTable().fnUpdate( i+1, this.parentNode, 0, false, false );
		                } );
		            }
		        },

				"oLanguage": {
					"sLengthMenu": 
			           ct_td.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ ct_td.records
			         ,
					"oPaginate": {
						"sPrevious": '<i class="icon-angle-left"></i>',
						"sNext": '<i class="icon-angle-right"></i>',
						'of':ct_td.of,
					},
					
					"sInfo": ct_td.Foundtotal+" _TOTAL_ "+ct_td.records
				}
			});
		}
		else{
			var html = '<br/><div class="alert alert-error" style="text-align:center;">'+ct_td.Norecordfound+'</div>';
			$('.customer_task_wrapper').html(html);
		}
		

	},
	disable_task:function(task_id,that,cust_id,task_type,contact_id){

		var url = 'contact_id='+contact_id+'&from=customer_task_list';

		var title = ct_td.Confirmation;
		var opt1_text = ct_td.Deletepermanently;
		var opt2_text = ct_td.Movetounassignedtask;
		var msg  = ct_td.$del_or_move;

		var opt1_action_url = base_url + 'task/delete_task/'+task_id+'/'+cust_id;
		var opt2_action_url = base_url + 'calendars/mark_unaasigned/'+task_id+'/'+cust_id;

		var opt1_action = "passRequest('"+opt1_action_url+"','from=customer_task_list');";
		var opt2_action = "passRequest('"+opt2_action_url+"','"+url+"');";

		if(contact_id != '') {
			confirmationDialog(title,msg,opt1_text,opt2_text,opt1_action,opt2_action);
		}else {
			delete_task(opt1_action_url,type);
		}
	},
	removeRow:function(id){
		ct_dt.fnDeleteRow($('tr[data-id="'+id+'"]')[0])
		ct_dt.$('tr').each( function (i) {
			$(this).find('td:first').html(i+1); 
		});		
	},
	updateRow:function(data){
		

		for(var j in data){
			var pt = data[j].PartnerTask;
			var u = data[j].User;
			var cust = data[j].Customer;

			var bb = pt.task_type;
			var cc = pt.task_name;
				
			var t = [];
			var dt = [];
			var d = '';
			var time = '';
			if(checkNull(pt.schedule_date)!=''){
				dt = pt.schedule_date.split(' ');
				d = convertDateIntoSiteFormat(checkNull(dt[0]));
				t = checkNull(dt[1]);
				t = t.toString().match(/.{1,5}/g);
			}
				
			if(checkNull(t[0])!=''){
				time = ' - '+t[0];
			}
			
			var dd = d+time;
				

			var t = [];
			var dt = [];
			var d = '';
			var time = '';
			if(checkNull(pt.due_date)!=''){
				dt = pt.due_date.split(' ');
				d = convertDateIntoSiteFormat(checkNull(dt[0]));
				t = checkNull(dt[1]);
				t = t.toString().match(/.{1,5}/g);
			}
				
			if(checkNull(t[0])!=''){
				time = ' - '+t[0];
			}
			
			var ee = d+time;
	
			var ff = checkNull(u.first_name)+' '+checkNull(u.last_name);
			
			var status = pt.task_status;

			var gg = checkNull(task_status[status],status);		
			var url = base_url + 'task/new_task/'+pt.id+'?request_from=customer_task_details&f_request_from=card&request_to=customer_details';

			var hh = '<button class="btn mini blue-stripe" data-url="'+url+'" onclick="event.stopPropagation(); show_modal(this,\'popups1\');" data-width="800px"><i class="icon-eye-open"></i>&nbsp;'+ct_td.View+'</button>';

			if(pt.task_status != 'comp'){

				hh += '<button class="btn mini red-stripe" onclick="customer_tasks.disable_task('+pt.id+',this,'+cust.id+',\''+pt.task_type+'\',\''+pt.contact_id+'\')"><i class="icon-remove"></i>&nbsp;'+ct_td.Delete+'</button>';
			}
			var aa = '';
			var where = ''
			ct_dt.$('tr').each( function (i) {
				var data_id  = $(this).attr('data-id');
				if(data_id==pt.id){
					where = i;
					aa = i+1;
					return false;
				}
				
			});	
			var all = [aa,bb,cc,dd,ee,ff,gg,hh];
			ct_dt.fnUpdate( all, where, undefined, false );
		
		}
		return;
		
		
	},

}

