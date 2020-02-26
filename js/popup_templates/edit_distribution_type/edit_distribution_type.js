var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();

var edt_meta;
var edt_dt;
var edt_popid = 'popups';
var edt_td;
var glkey=0;

var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var edit_distribution_type = {
	start:function(popupid,metadata={}){
		edt_popid = popupid;
		edt_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Add levels','Code','Description','Percentage','Valid from','Please correct the form','Alert message','Add','Actions','Remove','Name','Common name','Edit distribution type','Property','Value','This field is required','Empty','alert message','Success','Select','Status','Active','Inactive','Edit Document Method'],
		};
		if(edt_meta.id!=null && edt_meta.id!=undefined && edt_meta!=''){
			total_params.id = edt_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/search/getDistributionTypeDetails.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				edt_dt = complet_data.response.response;
				edt_td = complet_data.response.response.translationsData;
				edit_distribution_type.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',edt_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',edt_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('edit_distribution_type_template').innerHTML;
		edt_dt['meta'] = {lang:lang};
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		edt_dt.date_format_f = date_format_f;

		var compiledRendered = Template7(template, edt_dt);
		document.getElementById(edt_popid).innerHTML = compiledRendered;
		edit_distribution_type.bindEvents();
		resizemodal(edt_popid);
	},
	bindEvents:function(){
		edit_distribution_type.generateCustomFields();
		$('#edit_distribution_type_save').click(function(){
			edit_distribution_type.saveData();
		});

		if(checkNull(edt_dt.distribution_type.DocumentMethod.status) == 1){
			$('input[name="statusy"]').attr('checked','checked');
		}
		else{
			$('input[name="statusy"]').removeAttr('checked');
		}
		(function () {
		  	jQuery('#status')['bootstrapSwitch']();
		})();

		$('#status').on('switch-change', function (e, data) {
		    var value = data.value;
		    if(value){
		    	edit_distribution_type.saveStatus(1);
		    }
		    else{
		    	edit_distribution_type.saveStatus(0);
		    }
		});
	},
	generateRow:function(){
		glkey++;
		var html = '<tr data-id="'+glkey+'" data-primary-key="0">';
			html += '<td>';
				html += '<input name="percentage" class="m-wrap span12 percentage" value="" placeholder="'+edt_td.Percentage+'" id="percentage" type="text">';
			html += '</td>';
			html += '<td>';
				html += '<input name="valid_from" class="m-wrap span12 valid_from" value="" placeholder="'+edt_td.Validfrom+'" id="valid_from" type="text">';
			html += '</td>';
			html += '<td><a class="btn mini red-stripe del_row"  href="javascript:;" onclick="$(this).parent().parent().remove();"><i class="icon-remove"></i> '+edt_td.Remove+'</a></td>';

		html += '</tr>';

		$('#perc_tbody').append(html);
		$('tr[data-id="'+glkey+'"] .valid_from').datepicker({
   			format:edt_dt.date_format_f,
   			//startDate:moment().format()
   		}).change(function(){
   			$('.datepicker').remove();
   		});
		return html;
	},
	generateCustomFields:function(){
		var data = edt_dt.distribution_type.DistributionField;
		var ans = edt_dt.distribution_type.DistributionFieldAnswer;
		var html = '';

		for(var j in data){
			var d = data[j];
			//Getting answer

			var nomod_field_id = j;
			var field_id = d.id;
			//field_id = field_id.replace(/\s/g,'');
			var th_ans = '';
			if(checkNull(ans)!=''){
				for(var k in ans){
					var ansd = ans[k];
					if(ansd.distribution_field_id == field_id){
						th_ans = ansd.answer;
						break;
					}
				}
			}
			//Getting answer

			var tr = '<tr>';
				tr += '<td>';
					tr += checkNull(d.custom_field);
					if(checkNull(d.popover) != ''){

						tr += '&nbsp;&nbsp;<span class="popover_custom" data-content="'+d.popover+'"><i class="icon-question-sign" id="popover"></i></span>';
					}
				tr += '</td>';
				tr += '<td>';
					tr += '<a id="'+field_id+'" name="'+field_id+'" data-name="'+field_id+'"></a>';
				tr += '</td>';
			tr += '</tr>';
			$('#custom_field_tbody').append(tr);

			if(d.type=='text'){
				if(d.mandatory=='y'){
						
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						showbuttons:'bottom',
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'text','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return edt_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						showbuttons:'bottom',
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'text','n');
						},
					});
				}	
			}
			else if(d.type=='textarea'){
				if(d.mandatory=='y'){
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						showbuttons:'bottom',
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'textarea','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return edt_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						type: d.type,
						showbuttons:'bottom',
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'textarea','n');
						},
					});
				}
			} 
			else if(d.type=='dropdown'){
				var opts = checkNull(d.custom_value);
				if(opts!=''){
					opts = JSON.parse(opts);
				}
				else{
					opts = [];
				}
			
				var options = [];
				var sel_plce = '';
				for(var l in opts){
					var ds = opts[l];
					
					if("key" in ds && checkNull(ds.key) != ''){
						options.push({
							text:ds.value,
							value:ds.key
						});
					}
					else{
						options.push({
							text:ds.value,
							value:ds.value
						});
					}
					
					if(checkNull(ds.is_default)!=''){
						if(ds.is_default==1){
							sel_plce = ds.value;
						}
					}
				}

				if(checkNull(sel_plce) == ''){
					sel_plce = edt_td.Select;
				}

				if(d.mandatory=='y'){
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						showbuttons:'bottom',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:edt_td.Empty,
		       			},
						source:options,
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'dropdown','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return edt_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						showbuttons:'bottom',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:edt_td.Empty,
		       			},
						source:options,
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'dropdown','n');
						}
					});
				}
			}
			else if(d.type=='radio'){
				var opts = checkNull(d.custom_value);
				if(opts!=''){
					opts = JSON.parse(opts);
				}
				else{
					opts = [];
				}
			
				var options = [];
				var sel_plce = '';
				for(var l in opts){
					var ds = opts[l];
					options.push({
						text:ds.value,
						value:ds.value
					});
					if(checkNull(ds.is_default)!=''){
						if(ds.is_default==1){
							sel_plce = ds.value;
						}
					}
				}
				if(d.mandatory=='y'){
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						showbuttons:'bottom',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:edt_td.Empty,
		       			},
						source:options,
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'radio','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return edt_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,
						mode:'inline',
						type: 'select2',
						showbuttons:'bottom',
						select2: {
				        	placeholder: sel_plce,
		           		 	allowClear: true,
							minimumResultsForSearch: -1,
							emptytext:edt_td.Empty,
		       			},
						source:options,
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'radio','n');
						}
					});
				}
			}
			else if(d.type=='checkbox'){
				var opts = checkNull(d.custom_value);
				var options = {};
				options[opts] = opts;
		
				if(d.mandatory=='y'){
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						source:options,
						type: 'checklist',
						showbuttons:'bottom',
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'checkbox','y');
						},
						validate:function(value){
							if(checkNull(value)==''){ 
								return edt_td.Thisfieldisrequired;
							}
						}
					});
				}
				else{
					$('#custom_field_tbody #'+$.escapeSelector(field_id)).editable({
						value: th_ans,  
						placeholder:checkNull(d.custom_value),
						mode:'inline',
						source:options,
						type: 'checklist',
						showbuttons:'bottom',
						success: function(data, config) {
							edit_distribution_type.saveData(config,this,'checkbox','n');
						}
					});
				}
			}
		}

		edit_distribution_type.bindPopover();
	},
	bindPopover:function(that){
		$('.popover_custom').mouseover(function(){
			$('.popovermy').remove();
			var a = $(this).position();
			var l = a.left - 92;
			var t = a.top ;
			var c = $(this).attr('data-content');

			var html = '<div class="popovermy popover fade top in" style="width:200px;top: '+t+'px; left: '+l+'px; display: block;position:absolute"><div class="arrow"></div><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content">'+c+'</div></div>';
			$(this).append(html);
			var a= $('.popovermy').height();
			$('.popovermy').css('top',(parseInt(t)-parseInt(a))+'px');
		});
		$('.popover_custom').mouseout(function(){
			$('.popovermy').remove();
		});
	},
	saveData:function(newvalue,that,type,validate){
		
		if(validate!='n' && (newvalue=='' || newvalue==null)){
			return;
		}
		var fieldid = $(that).attr('data-name');

		if(Array.isArray(newvalue)){
			newvalue = newvalue[0];
		}
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			newvalue:newvalue,
			fieldid:fieldid,
			type:type,
			document_method_id:edt_dt.distribution_type.DocumentMethod.id,
		};


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/search/saveDistributionCustomFields.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				$('#custom_field_tbody a[data-name="'+checkNull(complet_data.response.response.res.DistributionFieldAnswer.id)+'"]').editable('setValue',checkNull(complet_data.response.response.res.DistributionFieldAnswer.answer));
				call_toastr('success', edt_td.Success, complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',edt_td.alertmessage);
					return;
				}	
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
	},
	saveStatus:function(status){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			status:status,
			distribution_type_id:edt_dt.distribution_type.DocumentMethod.id,
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/search/saveDistributionData.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (complet_data){
			hideProcessingImage();
		};

		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){

				if(complet_data.response.response.status == 1){
					$('#tax_table_tr_'+complet_data.response.response.distribution_type_id).find('td.status').html(edt_td.Active);
				}
				else{
					$('#tax_table_tr_'+complet_data.response.response.distribution_type_id).find('td.status').html(edt_td.Inactive);
				}
				
				call_toastr('success', edt_td.Success, complet_data.response.response.message.msg);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',gbl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',edt_td.alertmessage);
					return;
				}	
			}
		};
		showProcessingImage('undefined');
		doAjax(params);
	},

}