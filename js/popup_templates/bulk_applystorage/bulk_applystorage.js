var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var global_available_slips = [];
var all_cust = [];
if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
	var date_format_f = date_format_partner.toLowerCase();
}
else{
	var date_format_f = date_format.toLowerCase();
}

var popupid = 'popups';
var bap_td;
var bap_dt;
var bap_meta;
var slips_table;
var x = {
  aInternal: 0,
  aListener: function(val) {},
  set a(val) {
    this.aInternal = val;
    this.aListener(val);
  },
  get a() {
    return this.aInternal;
  },
  registerListener: function(listener) {
    this.aListener = listener;
  }
}

var bulk_applystorage = {
	start: function(popups,meta = {}){
		bap_meta = meta;
		popupid = popups;
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			customer_slip_id:bap_meta.customer_slip_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Please check the following fields','Alert Message','Success','Apply for boat storage','Customer','alert message','Type','Out of water','Back on water',

				'Dock','Slip','Meter','Status','Run query','Boat status',
				'On water','On land','$customerh','Alert message',

				'Name','Start date and time','End date and time','Apply','Preferred','No record found','$dateoclock',
				'Please select slip','Please select at least one event','Search','$sliph','Customer name','Boat name','Boat dimensions','Current status','View','records','of','Page','Found total','Search',
				'Add as applicant','Add to'

			],
		};
		if(meta.from == 'edit'){
			total_params['id'] = meta.data.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/bulk_applystorage.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				bap_dt = complet_data.response.response;
				bap_td = complet_data.response.response.translationsData;
				x.a++;		
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

		showProcessingImage('undefined');
		x.registerListener(function(val) {
		  if(x.a == 2){
		  	x.a = 0;
		  	hideProcessingImage();
		  	bulk_applystorage.createHtml(bap_dt);
		  }	
		});
		doAjax(params);

		// var scripts = [
		// 	host_url+'app/webroot/plugins/jQuery-querybuilder/jQuery-QueryBuilder.js',
		// 	host_url+'app/webroot/plugins/fuse/fuse.js',
		// 	host_url+'app/webroot/plugins/jquery.selectlistactions/jquery.selectlistactions.js',
		// ];
		// var queue = scripts.map(function(script) {
		//     return $.getScript(script);
		// });

		// $.when.apply(null, queue).done(function() {
		// 	x.a++;
		// });
		x.a++;
		return;
	},
	createHtml:function(){
		var template = document.getElementById('bulk_applystorage_template').innerHTML;
		bap_dt['bap_meta'] = bap_meta;
		var compiledRendered = Template7(template, bap_dt);
		document.getElementById(popupid).innerHTML = compiledRendered;
		resizemodal(popupid);
		bulk_applystorage.bindEvents();
	},
	bindEvents:function(){
		$('#event_type').select2();
		$('#event_type').change(function(){
			bulk_applystorage.getEvents($('#event_type').val());
		}).trigger('change');

		$('.uni').uniform();

		$('#head_all_check').change(function(){
			var chckd = $('#head_all_check:checked').length;
   			if(chckd==1){
   				slips_table.$('input[type="checkbox"]').each(function(){
					$(this).prop('checked',true);
				});
   			}
   			else{
   				slips_table.$('input[type="checkbox"]').each(function(){
	   				$(this).prop('checked',false);
	   			});
   			}
   			$.uniform.update();
		});
	},
	getCustomersWithBoat:function(event_id,event_name){
		$('#boats_table').hide();

		$('#bulk_applystorage_btn_allot').show();
		$('span.event_name').html(event_name);
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			event_id:event_id
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getEligibleCustomers.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_available_slips = complet_data.response.response.available_slips;
				bulk_applystorage.generateSlipList(complet_data.response.response.available_slips);
				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',mcl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',mcl_td.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	generateSlipList:function(res){
		$('#slips_table tbody').html('');
		var tr = [];
		for(var j in res){
			var cs = res[j]['cs'];
			var ps = res[j]['ps'];
			var cust = res[j]['Customer'];
			var obj = [];
			obj.push(`<input type='checkbox' class='uni in_slip in_slip_`+cs.id+`' data-id="`+cs.id+`_`+cust.id+`" value="`+cs.id+`_`+cust.id+`">`);
			obj.push(checkNull(ps.slip_name));
			obj.push(cust.customer_number);
			obj.push(checkNull(cust.customer_name));
			obj.push(checkNull(cust.boat_type));
			
			if(checkNull(cs.boat_length) != '' && checkNull(cs.boat_width) != ''){
				obj.push(checkNull(cs.boat_length)+' x ' +checkNull(cs.boat_width));
			}else{
				obj.push('');
			}

			if(checkNull(cs.boat_status) == 'out'){
				obj.push(bap_td.Onland);
			}
			else if(checkNull(cs.boat_status) == 'up'){
				obj.push(bap_td.Onwater);
			}
			else{
				obj.push(``);
			}

			tr.push(obj);
		}
		$('#boats_table').show();
		
		try{
			$('#slips_table').DataTable().destroy();			
		}catch(e){
			$('#boats_table div.table-responsive').html($('#boats_table div.table-responsive').html());
		}
		
		

		if(tr.length != 0){
			slips_table = $('#slips_table').DataTable({

				//pageLength:2,
				pagingType: "input",
				data:tr,
				drawCallback: function( settings ) {
					$('#slips_table_filter input').addClass('m-wrap');
					resizemodal();
				},
				rowCallback: function( nRow, adata ) {
					$(nRow).find('.uni').uniform();
					return ;
				},
				dom: "<'row-fluid search_a'f><'row-fluid't><'row-fluid'<'span12 dataTables_extended_wrapper'pli>>",
				columns: [
				    null,
				    null,
				    null,
				    null,
				    null,
				    null,
				    null,
				],
			 	language: {
					lengthMenu: 
			           bap_td.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ bap_td.records + ' |  '
			         ,
					paginate: {
						"previous": '<i class="icon-angle-left"></i>',
						"next": '<i class="icon-angle-right"></i>',
						'of':bap_td.of,
						'Page':bap_td.Page,
					},				
					info: bap_td.Foundtotal+" _TOTAL_ "+bap_td.records,
					searchPlaceholder: bap_td.Search,
					search: ""
				},
			});


			$('#slips_table tbody').on('change','.in_slip', function () {
				
				if(slips_table.$('input[type="checkbox"]:checked').length == slips_table.$('input[type="checkbox"]').length){
					$('#head_all_check').prop('checked',true);
				}
				else{
					$('#head_all_check').prop('checked',false);
				}
				$.uniform.update();
			});
		}
		else{
			var h = `<tr class="no_record_found"><td colspan="7"><div style="text-align:center;" class="alert alert-error">`+bap_td.Norecordfound+`</div></td></tr>`;
			$('#slips_table tbody').html(h);
		}

		
	},
	getEvents:function(type){
		$('#boats_table').hide();
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			type:type
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/getboateventByStatus.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				bulk_applystorage.generateEventTable(complet_data.response.response.boatstore_event);
				try{
					$('#slips_table').DataTable().destroy();
				}catch(e){
					$('#boats_table div.table-responsive').html($('#boats_table div.table-responsive').html());
				}
				
				$('#slips_table tbody').html('')
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bap_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bap_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
	},
	showMsg:function(){
		showAlertMessage(bap_td.Nothingtomove,'error',bap_td.Alertmessage);
		return;
	},
	generateEventTable:function(data){
		$('#bulk_applystorage_btn_allot').hide();
		var datas = [];
		var checkcount = 0;
		var html = '';
		for(var j in data){

			var pbe = data[j].pbe;
	
			var start_date = convertDateIntoSiteFormat(pbe.start_datetime);
			var start_time = moment(pbe.start_datetime).format('HH:mm');
			var startstr = bap_td.$dateoclock;
			startstr = startstr.replace('%date%',start_date).replace('%time%',start_time);
			

			// var end_date = convertDateIntoSiteFormat(pbe.end_datetime);
			// var end_time = moment(pbe.end_datetime).format('HH:mm');
			// var endstr = bap_td.$dateoclock;
			// endstr = endstr.replace('%date%',end_date).replace('%time%',end_time);

			var event_checked = `<input type="radio" class="uni " name="event_checked" value="`+pbe.id+`" data-primary-key="0" style="margin-left:0" data-name="`+pbe.name+`" data-start-date="`+pbe.start_datetime+`">`;
						
		

			html += `<tr>
				<td>`+pbe.name+`</td>
				<td>`+startstr+`</td>
				<td>`+event_checked+`</td>
			</tr>`;
		}
		if(checkNull(html) == ''){
			html = '<tr class="no_record_found"><td colspan="4"><div style="text-align:center;" class="alert alert-error">'+bap_td.Norecordfound+'</div></td></tr>';
			
		}
		$('#bap_event_table tbody').html(html);
	
		$('.events_table').show();
		resizemodal();
		$('.uni').uniform();
		$('input[name="event_checked"]').change(function(){

			bulk_applystorage.getCustomersWithBoat($('input[name="event_checked"]:checked').val(),$('input[name="event_checked"]:checked').attr('data-name'));
		});
	},
	save:function(from){
		if($('input[name="event_checked"]:checked').length == 0){
			showAlertMessage(bap_td.Pleaseselectatleastoneevent,'error',bap_td.alertmessage);
			return;
		}

		var event_id = $('input[name="event_checked"]:checked').val();
		var event_start_date = $('input[name="event_checked"]:checked').attr('data-start-date');

		if(slips_table.$('input[type="checkbox"]:checked').length == 0){
			showAlertMessage(bap_td.Pleaseselectslip,'error',bap_td.alertmessage);
			return
		}
		var select_events = [event_id];
		var selected_slips = [];

		slips_table.$('input[type="checkbox"]:checked').each(function(){
			selected_slips.push($(this).val());
		});

	
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			selected_slips:selected_slips,
			select_events:select_events,
			allot:'n'
		};
		if(from == 'allot'){
			total_params['allot'] = 'y';
		}

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/MarinaBillingBatches/saveBoatApplicants.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				
				call_toastr('success',bap_td.Success,complet_data.response.response.message.msg);
				$('#'+popupid).modal('hide');
				
				if(bap_meta.from_page == 'allocation'){
					var date = moment(event_start_date);
					boat_assignments.getEventsByDate(moment(date).month() + 1,moment(date).year());				
				}
				else{
					boat_applicants.start();
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',bap_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',bap_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},

};
