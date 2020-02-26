var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();

if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
	var date_format_f = date_format_partner.toLowerCase();
}
else{
	var date_format_f = date_format.toLowerCase();
}

var popupid = 'popups';
var abe_td;
var abe_dt;
var abe_meta;
var start_datetime;
var end_datetime;
var notif_list = {};

var add_boat_event = {
	start: function(popups,meta = {}){
		abe_meta = meta;
		popupid = popups;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Name','Date','Start time','Add boat storage event','Save','Cancel','Please check the following fields','Alert Message','Name','General','Notifications','End time','Yes','No','Type','Success','$boat_event_success','$boat_editevent_success','$boat_name_exists','Delete','$del_store_event','Confirmation','$del_store_success','Edit boat storage event','On event schedule','On event change','On event cancel','On boat moved','Before 24 hours','$end_date_more','Out of water','Back on water','When scheduling','When changes are made','When scheduled event is cancelled','When completed','$before_24_hrs'],
		};
		if(meta.from == 'edit'){
			total_params['id'] = meta.data.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getboatevent.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				abe_dt = complet_data.response.response;
				abe_td = complet_data.response.response.translationsData;
				add_boat_event.createHtml(complet_data.response.response);
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
	createHtml:function(jsondata){
		abe_dt['abe_meta'] = abe_meta;
		abe_dt['boat_event'] = {start_datetime:abe_meta.start};
		if(abe_meta.from == 'edit'){
			abe_dt['boat_event'] = abe_dt.boatstore_event.PartnerBoatstoreEvent;
			abe_dt['boat_event'].start_datetime = moment(abe_dt['boat_event'].start_datetime);
			//abe_dt['boat_event'].end_datetime = moment(abe_dt['boat_event'].end_datetime);
			abe_dt['pbn'] = abe_dt.boatstore_event.PartnerBoatstoreNotification;
		}

		notif_list = {
			on_schedule:abe_td.Whenscheduling,
			on_change:abe_td.Whenchangesaremade,
			on_cancel:abe_td.Whenscheduledeventiscancelled,
			on_complete:abe_td.Whencompleted,
			before_24_hrs:abe_td.$before_24_hrs,
		};

		var template = document.getElementById('add_boat_event_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById(popupid).innerHTML = compiledRendered;
		resizemodal(popupid);
		add_boat_event.bindEvents(jsondata);
	},
	bindEvents:function(jsondata){
		

		
		
		var today_date = moment(abe_dt.todaydate);
		var start_datetime = moment(abe_dt.boat_event.start_datetime);

		//today_date.unix() > start_datetime.unix()
		if(abe_meta.from == 'edit' && (abe_dt.boat_event.status == 'comp' || abe_dt.boat_event.status == 'can') ){
			$('#add_boat_event_form input:not("#date")').attr('disabled',true);
			$('#add_boat_event_form select').attr('disabled',true);
			//$('.hide_expire').hide();
		}
		else{
			$('#add_boat_event_form #name').prop('checked',true);
		}
		$("#add_boat_event_form #type").select2({
			minimumResultsForSearch:-1
		});
		$('#add_boat_event_btn_save').click(function(){
			add_boat_event.saveData();
		});
		$('#date').datepicker({
			//startDate:new Date(),
			format:date_format_f,
		}).change(function(){
   			$('.datepicker').remove();
   		});


		$("#start_time").inputmask("99:99", {autoUnmask: true});

		$("#start_time").focus(function() {
		   	setTimeout(function(){
		   		$('#start_time').select();
		   	});
		});

		// $("#end_time").focus(function() {
		//    	setTimeout(function(){
		//    		$('#end_time').select();
		//    	});
		// });

		if(checkNull(abe_dt['boat_event'].start_datetime) != ''){
			$('#date').val(moment(abe_dt['boat_event'].start_datetime).format(date_format_f.toUpperCase())).datepicker('update').trigger('change');

			var start_time  = moment(abe_dt['boat_event'].start_datetime).format('HH:mm');
			$("#start_time").val(start_time);

		}

		// if(checkNull(abe_dt['boat_event'].end_datetime) != ''){
		// 	var end_time  = moment(abe_dt['boat_event'].end_datetime).format('HH:mm');
		// 	$("#end_time").val(end_time);
		// }
		// else{
		// 	$("#end_time").val(start_time);
		// }

		
		$('#notific').toggleButtons({
			width:82,
            label: {
                enabled: abe_td.Yes,
                disabled: abe_td.No
            }
        });


		if(abe_meta.from == 'edit'){
			$('#notific').toggleButtons('setState',(abe_dt['boat_event'].notifications == 'y')?true:false); 
			
			if(abe_dt['boat_event'].notifications == 'y'){
				$('.notif_table').show();
			}
			else{
				$('.notif_table').hide();
			}
			$('#notific').on('switch-change', function (event, state) {
				if(state.value){
					$('.notif_table').show();
				}
				else{
					$('.notif_table').hide();
				}
			});
		}
		else{
			if(checkNull(abe_dt.partner_setting.boat_notification_types) != ''){
				$('#notific').toggleButtons('setState',true);
			}
		}
		
		$('.notific_p').toggleButtons({
            width: 82,
            label: {
                enabled: abe_td.Yes,
                disabled: abe_td.No
            }
        });
	},
	saveData:function(jsondata){
		var name = $('#add_boat_event_form #name').val();
		var type = $('#add_boat_event_form #type').val();
		var start_time = $('#start_time').val();
		//var end_time = $('#end_time').val();

		var start_datetime = '';
		var date = '';
		try{
		 	var date = moment($('#add_boat_event_form #date').datepicker('getDate')).format('YYYY-MM-DD');

		}
		catch(e){
			date = '';
		}
		//var end_datetime = '';

		var start_time_valid = false;

		if(checkNull(start_time) != ''){
			start_time_valid = moment(start_time, "HHmm", true).isValid();
		}

		// var end_time_valid = false;
		// if(checkNull(end_time) != ''){
		// 	end_time_valid = moment(end_time, "HHmm", true).isValid();
		// }
		
		var notific = ($('#add_boat_event_form #notific').toggleButtons('status'))?'y':'n';

		var errormsg = '';
		if(checkNull(name) == ''){
			errormsg += abe_td.Name + '<br/>';
		}
		
		if(checkNull(type) == ''){
			errormsg += abe_td.Type + '<br/>';
		}
		
		if(!start_time_valid && checkNull(start_datetime) == ''){
			errormsg += abe_td.Starttime + '<br/>';
		}
		
		// if(!end_time_valid && checkNull(end_datetime) == ''){
		// 	errormsg += abe_td.Endtime + '<br/>';
		// }



	
		var start_date = '';
		var end_date = '';
		try{
			var a = start_time.toString().match(/.{1,2}/g);
			var start_datetime = date + ' ' + a[0]+':'+a[1] + ':00';

			// var b = end_time.toString().match(/.{1,2}/g);
			// var end_datetime = date + ' ' + b[0]+':'+b[1] + ':00';


			var start_date = moment(start_datetime).unix();
			//var end_date = moment(end_datetime).unix();
		}
		catch(e){}
		// if(end_date < start_date){
		// 	errormsg += abe_td.$end_date_more + '<br/>';
		// }

		if(abe_meta.from == 'edit'){
			// if(moment(start_datetime).unix() < moment().unix()){
			// 	errormsg += abe_td.Starttime + '<br/>';
			// }
		}
		else{
			if(moment(start_datetime).unix() < moment().unix()){
				errormsg += abe_td.Starttime + '<br/>';
			}
		}

		if(errormsg != ''){
			var msg  = abe_td.Pleasecheckthefollowingfields +'<br/>' + errormsg;
			showAlertMessage(msg,'error',abe_td.AlertMessage);
			return;
		}
		
		
		var params = {
			id:0,
			admin_id:admin_id,
			partner_id:partner_id,
			name:name,
			type:type,
			start_datetime:start_datetime,
			//end_datetime:end_datetime,
			notifications:notific,
		};
		

		if(abe_meta.from == 'edit'){
			params['id'] = abe_meta.data.id;
			var pbn = [];
			$('.notific_p').each(function(){
				var v = $(this).toggleButtons('status');
				var data_key = $(this).attr('data-id');
				pbn.push({
					id:data_key,
					status:(v)?1:0
				});
			});
			params['pbn'] = pbn;
		}
				
		var total_params = {
			data:params,
			model:'PartnerBoatstoreEvents',
			action:'savesupdateschedule',
			emitevent:'PartnerBoatstoreEventsSave'
		};
		showProcessingImage('undefined');
		
		function PartnerBoatstoreEventsSave(data){
			hideProcessingImage();
			console.log('data',data);

			
			if(data.error==null || data.error==undefined || data.error==''){
				if(abe_meta['from_page'] == 'allocation'){
					try{
						var date = data['success']['data']['start_datetime'];
						date = moment(date);
						boat_assignments.getEventsByDate(moment(date).month() + 1,moment(date).year());
					}
					catch(e){}
				}
				

				call_toastr('success',abe_td.Success, abe_td[data.success.msg]);
				$('#'+popupid).modal('hide');
			}
			else{
				showAlertMessage(abe_td[data.error.message],'error',abe_td.AlertMessage);
				return;
			}
		}
		socket.once('PartnerBoatstoreEventsSave',PartnerBoatstoreEventsSave);
		socket.emit('crud', total_params);
	},
	delete:function(){
		var yes = function(){
			var params = {
				id:abe_meta.data.id,
				partner_id:partner_id,
				admin_id:admin_id
			};
			var total_params = {
				data:params,
				model:'PartnerBoatstoreEvents',
				action:'deletec',
				emitevent:'PartnerBoatstoreEventsDelete'
			};
			
			function PartnerBoatstoreEventsDelete(data){
				if(data.err==null){
					if(data.success!=null && data.success!='' && data.success!=undefined){
						var res = data.success;
						call_toastr('success',abe_td.Success, abe_td.$del_store_success);
						$('#'+popupid).modal('hide');
					}
				}
			}
			socket.once('PartnerBoatstoreEventsDelete',PartnerBoatstoreEventsDelete);
			socket.emit('crud', total_params);
		};
		var no = function(){

		}
		showDeleteMessage(abe_td.$del_store_event,abe_td.Confirmation,yes,no,'ui-dialog-blue',abe_td.Delete,abe_td.Cancel);
	},
	generateList:function(data){
		var str = '<tr><td>';

			str += notif_list[data.when_event];
		str += '</td>';
		str += '<td>';
		str += `<div class="switch switch-small notific_p" data-id= "`+data.id+`"  style="margin-top:5px" data-on-label="`+abe_td.Yes+`" data-off-label="`+abe_td.No+`">`;
			if(data.status == 1){
				str += `<input name="notifications" checked="checked" class="m-wrap span9 notific"   id="name" type="checkbox">`;
			}
			else{
				str += `<input name="notifications" class="m-wrap span9 notific" type="checkbox">`;
			}
		str += `</div>`;
		str += '</td></tr>';

		return str;
	},

};

Template7.registerHelper('ListHelper', function (data){
	return add_boat_event.generateList(data);
});