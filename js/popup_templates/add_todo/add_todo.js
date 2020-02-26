
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var staffer_id =$('#staffer_id').val();

var global_add_todo_meta_data;
var global_add_todo_data;
var global_add_todo_popupid = 'popups';
var global_ret_translations;

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

var add_todo = {
	start:function(popupid,metadata={}){
		global_add_todo_popupid = popupid;
		global_add_todo_meta_data = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			staffer_id:staffer_id,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Add todo','Edit todo','Edit return address','Name','Please check the following fields','Alert message','Success','success','Address1','Address2','Zip','City','success','Success','Todo added successfully','Todo edited successfully','Success','Return address edited successfully','Title','Due date','Delete','$del_todo','Todo deleted successfully'],
		};
		if(global_add_todo_meta_data.from=='edit'){
			total_params.id = global_add_todo_meta_data.id;
		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getPartnerStaffTodo.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_add_todo_data = complet_data.response.response;
				if(checkNull(global_add_todo_data.partnerTodo)!=''){
					if(checkNull(global_add_todo_data.partnerTodo.due_date)!=''){
						global_add_todo_data.partnerTodo.due_date = convertDateIntoSiteFormat(global_add_todo_data.partnerTodo.due_date);
					}
				}
				else{
					global_add_todo_data.partnerTodo = '';
				}
				global_add_todo_data.metadata = metadata;
				global_ret_translations = complet_data.response.response.translationsData;
				add_todo.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_ret_translations.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_ret_translations.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		var template = document.getElementById('add_todo_template').innerHTML;
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		global_add_todo_data.date_format_f = date_format_f;


		var compiledRendered = Template7(template, global_add_todo_data);
		document.getElementById(global_add_todo_popupid).innerHTML = compiledRendered;
		resizemodal(global_add_todo_popupid);
		add_todo.bindEvents();
	},
	bindEvents:function(){

		$('#add_todo_form #due_date').datepicker({
   			format:global_add_todo_data.date_format_f,
   			startDate:moment().format()
   		}).change(function(){
   			$('.datepicker').remove();
   		});



		$('#add_todo_save').click(function(){
			add_todo.saveData();
		});

		$('#delete_todo').click(function(){
			add_todo.deleteTodo(checkNull(global_add_todo_meta_data.id));
		});

		$(document).keyup(function(e) { 
		    if(e.which==46){
		    	if($('#popups #delete_todo').length!=0){
		    		$('#delete_todo').trigger('click');
		    	}
		    }   
		})
	},
	deleteTodo:function(id){
		var yes = function(){
			var partner_id = $('#partner_id').val();
			var staffer_id = $('#staffer_id').val();
			var admin_id = $('#admin_id').val();

			var params = {id:id,partner_id:partner_id,admin_id:admin_id,staffer_id:staffer_id};
			var total_params = {
				data:params,
				model:'partnerTodos',
				action:'delete',
				emitevent:'partnerTodosDelete'
			};
			socket.once('partnerTodosDelete',function(data){
				if(data.error==null){
					var data = data.success;
					$('#'+global_add_todo_popupid).modal('hide');
					call_toastr('success',global_ret_translations.Success,global_ret_translations.Tododeletedsuccessfully);
				}
			});
			
			socket.emit('crud',total_params);
		};

		var no = function(){

		};
		var msg = todo_trn.tdelete;
		showDeleteMessage(msg,cnf,yes,no,'ui-dialog-blue',del,can);
	},

	saveData:function(){
		var errmsg = '';

		var name = $('#add_todo_form #name').val();
		if(name=='' || name==undefined || name==null){
			errmsg += global_ret_translations.Title+'<br/>';
		}

		var due_date = $('#add_todo_form #due_date').val();
		// if(due_date=='' || due_date==undefined || due_date==null){
		// 	errmsg += global_ret_translations.Duedate+'<br/>';
		// }
	
		var due_date_v  = moment($('#add_todo_form #due_date').datepicker('getDate')).format('YYYY-MM-DD hh:mm:ss');
		if(errmsg!=''){
			var finalerrmsg = global_ret_translations.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',global_ret_translations.AlertMessage);
			return;
		}

		socket.once('partnerTodosAdd',function(data){
			hideProcessingImage();
			$('#'+global_add_todo_popupid).modal('hide');

			
			if(global_add_todo_meta_data.from=='edit'){
				call_toastr(global_ret_translations.success,global_ret_translations.Success, global_ret_translations.Todoaddedsuccessfully);
			}
			else{
				call_toastr(global_ret_translations.success,global_ret_translations.Success, global_ret_translations.Todoeditedsuccessfully);
			}		
		});
		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			staffer_id:staffer_id,
			name:name,
			due_date:null,
		};
		if(due_date!=''){
			params.due_date = due_date_v;
		}
		if(global_add_todo_meta_data.from=='edit'){
			params.id = global_add_todo_meta_data.id;
		}
		var total_params = {
			data:params,
			model:'partnerTodos',
			action:'customAdd',
			emitevent:'partnerTodosAdd'
		};
		socket.emit('crud',total_params);
	
		showProcessingImage('undefined');


	}
}