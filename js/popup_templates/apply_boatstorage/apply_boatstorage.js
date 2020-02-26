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
var ab_td;
var ab_dt;
var ab_meta;

var apply_boatstorage = {
	start: function(popups,meta = {}){
		ab_meta = meta;
		popupid = popups;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_slip_id:ab_meta.customer_slip_id,
			getTranslationsData:'yes',
			from:checkNull(ab_meta.from),
			getTranslationsDataArray:['Name','Start time','Add boat event','Save','Cancel','Please check the following fields','Alert Message','Name','General','Notifications','End time','Yes','No','Type','Success','Boat events','Boat event','Start date and time','End date and time','Apply','Preferred','$dateoclock','$apply_event_success','No record found','Event status','Boat status','Cancelled','Completed','Included','Excluded','Scheduled','Not applied','Applied'],
		};
		if(meta.from == 'edit'){
			total_params['id'] = meta.data.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getCustomerBoatEvents.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ab_dt = complet_data.response.response;
				ab_td = complet_data.response.response.translationsData;
				apply_boatstorage.createHtml(complet_data.response.response);
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
		var template = document.getElementById('apply_boatstorage_template').innerHTML;
		ab_dt['ab_meta'] = ab_meta;
		var compiledRendered = Template7(template, ab_dt);
		document.getElementById(popupid).innerHTML = compiledRendered;
		resizemodal(popupid);
		apply_boatstorage.bindEvents();
	},
	bindEvents:function(){
		apply_boatstorage.generateEventTable(ab_dt.schedule_events);
		$('#apply_boatstorage_btn_save').click(function(){
			apply_boatstorage.saveData();
		});
	},
	generateEventTable:function(data){

		var datas = [];
		var checkcount = 0;
		console.log(data);
		for(var j in data){

			var pbe = data[j].pbe;
			var cba	= data[j].cba;
			var pba	= data[j].pba;
			var trs = [];

			trs.push({v:pbe.name});

			var start_date = convertDateIntoSiteFormat(pbe.start_datetime);
			var start_time = moment(pbe.start_datetime).format('hh:mm');
			var startstr = ab_td.$dateoclock;
			startstr = startstr.replace('%date%',start_date).replace('%time%',start_time);
			trs.push({v:startstr});

			// var end_date = convertDateIntoSiteFormat(pbe.end_datetime);
			// var end_time = moment(pbe.end_datetime).format('hh:mm');
			// var endstr = ab_td.$dateoclock;
			// endstr = endstr.replace('%date%',end_date).replace('%time%',end_time);						
			// trs.push({v:endstr});

			if(ab_meta.from == 'partnerdetails'){
				var pb_status = '-';
				if(pbe.status == 'can'){
					pb_status = ab_td.Cancelled;
				}
				else if(pbe.status == 'comp'){
					pb_status = ab_td.Completed;
				}
				trs.push({v:pb_status});

				var pba_status = ab_td.Applied;
				if(pba.status == 'i'){
					pba_status = ab_td.Included;
				}
				else if(pbe.status == 'e'){
					pba_status = ab_td.Excluded;
				}
				else if("id" in pba && checkNull(pba.id) != ''){
					pba_status = ab_td.Scheduled;
				}
				trs.push({v:pba_status});

			}
			else{
				if(checkNull(cba.id) != ''){
					var event_checked = `<input checked="checked" class="uni event_checked" type="checkbox"  value="`+pbe.id+`"  data-primary-key="`+cba.id+`">`;
					checkcount++;
				}
				else{
					var event_checked = `<input type="checkbox" class="uni event_checked" value="`+pbe.id+`" data-primary-key="0">`;
				}
				
				trs.push({v:event_checked});
				if(checkNull(cba.preferred) != 0 && checkNull(cba.preferred) != ''){
					var event_radio = `<input name="preferred" class="event_preferred" type="radio" checked="checked" class="" value="`+pbe.id+`" >`;
				}
				else{
					var event_radio = `<input name="preferred" class="event_preferred" type="radio" class="" value="`+pbe.id+`" >`;
				}
				
				trs.push({v:event_radio,class:'preferred_td'});
			}
			datas.push(trs);
		}

		
		var html = apply_boatstorage.generateTr(datas);
		if(checkNull(html) == ''){
			html = '<tr><td colspan="5"><div style="text-align:center;" class="alert alert-error">'+ab_td.Norecordfound+'</div></td></tr>';
			$('.hid-btn').hide();
		}
		$('#ab_event_table tbody').append(html);
		if(checkcount > 1){
			$('.preferred_td').show();
		}
		$('.uni').uniform();
		$('.event_checked').change(function(){
			if($('.event_checked:checked').length > 1){
				$('.preferred_td').show();
			}
			else{
				$('.preferred_td').hide();
				$('.event_preferred').removeAttr('checked')
			}
		});
	},
	generateTr:function(data){
		var  html = '';
		for(var j in data){
			html += '<tr>';
			for(var k in data[j]){
				html += `<td class="`+checkNull(data[j][k]['class'])+`">`+data[j][k]['v']+`</td>`;
			}
			html += '</tr>';
			
		}
		return html;
	},
	saveData:function(){
	
		var event_checked = [];
		var ids = [];
		$('.event_checked:checked').each(function(){
			var v = $(this).val();
			var id = $(this).attr('data-primary-key');
			var preferred = 0;

			if(v == $('.event_preferred:checked').val()){
				preferred = 1;
			}

			ids.push(id);

			var obj = {
				id:id,
				admin_id:admin_id,
				partner_id:partner_id,
				partner_boatstore_event_id:v,
				customer_slip_id:ab_meta.customer_slip_id,
				preferred:preferred
			};
			event_checked.push(obj);
		});



		console.log(event_checked);

		var errormsg = '';

		if(errormsg != ''){
			var msg  = ab_td.Pleasecheckthefollowingfields +'<br/>' + errormsg;
			showAlertMessage(msg,'error',ab_td.AlertMessage);
			return;
		}

		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			event_checked:event_checked,
			customer_slip_id:ab_meta.customer_slip_id,
			ids:ids
		};		

		// if(ab_meta.from == 'edit'){
		// 	params['id'] = ab_meta.data.id;
		// }

		var total_params = {
			data:params,
			model:'CustomerBoatstoreApplications',
			action:'saveapplication',
			emitevent:'CustomerBoatstoreApplicationschange'
		};
		showProcessingImage('undefined');
		
		function CustomerBoatstoreApplicationschange(data){
			console.log('data',data);
			hideProcessingImage();
			if(data.error==null || data.error==undefined || data.error==''){
				if(ab_meta.from == 'partner' || ab_meta.from == 'partnerdetails'){
					boat_applicants.start(ba_meta);
				}
				else{
					customer_boats.start(cb_meta);
				}
				
				call_toastr('success',ab_td.Success, ab_td[data.success.msg]);
				$('#'+popupid).modal('hide');
			}
			else{
				showAlertMessage(ab_td[data.error.msg],'error',ab_td.AlertMessage);
				return;
			}
		}
		socket.once('CustomerBoatstoreApplicationschange',CustomerBoatstoreApplicationschange);
		socket.emit('crud', total_params);
	},
	

};
