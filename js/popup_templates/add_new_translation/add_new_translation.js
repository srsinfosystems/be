var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var base_url = $('#BASE_URL').val();
if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
	var date_format_f = date_format_partner.toLowerCase();
}
else{
	var date_format_f = date_format.toLowerCase();
}

var popupid = 'popups';
var ant_td;
var ant_dt;
var ant_meta;
var start_datetime;
var end_datetime;
var notif_list = {};

var add_new_translation = {
	start: function(popups,meta = {}){
		ant_meta = meta;
		popupid = popups;
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Label','Value','Add new translation','Save','Cancel','Please check the following fields','Alert Message','Location','Language','Success','Name',],
		};
		if(meta.from == 'edit'){
			total_params['id'] = meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getTranslationsFiles.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ant_dt = complet_data.response.response;
				ant_td = complet_data.response.response.translationsData;
				add_new_translation.createHtml(complet_data.response.response);
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
		jsondata['ant_meta'] = ant_meta;

		var template = document.getElementById('add_new_translation_template').innerHTML;
		var compiledRendered = Template7(template, jsondata);
		document.getElementById(popupid).innerHTML = compiledRendered;
		resizemodal(popupid);
		add_new_translation.bindEvents(jsondata);
	},
	bindEvents:function(jsondata){
		$('#add_new_translation_btn_save').click(function(){
			add_new_translation.saveData();
		});

		$('#add_new_translation_form #trans_location').select2();
		$('#add_new_translation_form #trans_language').select2();
		$('#add_new_translation_form #msgid').tagsInput({
         
        });
        $('#add_new_translation_form .tagsinput').attr("style","height:auto !important;width:''").addClass('m-wrap span10');
		
	},
	saveData:function(jsondata){
		var trans_location = $('#add_new_translation_form #trans_location').val();
		var trans_language = $('#add_new_translation_form #trans_language').val();
		
		var $tagWord = $(".msgid").siblings(".tagsinput").children(".tag");
        var tags = [];
        for(var i = $tagWord.length; i--; ) {
            tags.push($($tagWord[i]).text().substring(0, $($tagWord[i]).text().length - 1).trim());
        }
        var uqTags = $.unique(tags);

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,

			trans_location:trans_location,
			trans_language:trans_language,
			msgid:uqTags,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/addTranslationEntry.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				if(checkNull(trans_data['trans_language']) != '' && trans_data['trans_location'] != ''){
					$('#trans_language').val(trans_data['trans_language']).trigger('change');
					$('#trans_location').val(trans_data['trans_location']).trigger('change');
					translations.get();
				}
				call_toastr('success', ant_td.Success,complet_data.response.response.message.msg);
				$('#'+popupid).modal('hide');
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
		doAjax(params);
		return;
		
	},
};