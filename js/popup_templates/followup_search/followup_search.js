var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var date_format_mask = $('#date_format_mask').val();
var fs_meta;
var fs_dt;
var fs_popupid = 'popups';
var fs_td;
var order_statuss = {};

var fu_srch_data = '';

fu_srch_data = localStorage.getItem('followup_search_data');
if(checkNull(fu_srch_data) != ''){
	fu_srch_data = JSON.parse(fu_srch_data);
}
else{
	var fields = {
		customer_id:'',
		customer_email:'',
		customer_name:'',
		followup_status:'',
		quote_number:'',
		contact_id:'',
		followup_date:'',
	};

	fu_srch_data = JSON.stringify({fields:fields,sort:[ 0, "desc" ]});
	localStorage.setItem('followup_search_data',fu_srch_data);
	fu_srch_data  = JSON.parse(fu_srch_data);
}


var followup_search = {
	start:function(popupid,metadata={}){
		fs_popupid = popupid;
		fs_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			from:'searchget',
			getTranslationsDataArray:['Filter','Cancel','Order number','$ser_fil','$cust_name_no','$our_ref','Sales date','Created date','Customer','Select','Quote number','Customer email','Staff','$fllu_date','$fllu_stts','New','Open','Completed','Cancelled','Deleted'],
		};
		if(fs_meta.id!=null && fs_meta.id!=undefined && fs_meta!=''){
			total_params.id = fs_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Quotes/getFollowupSearch.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				fs_dt = complet_data.response.response;
				fs_td = complet_data.response.response.translationsData;
				followup_search.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',fs_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',fs_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}

		fs_dt.date_format_f = date_format_f;

		fs_dt.followupStatuses = {
			'new' : fs_td.New,
			'open' : fs_td.Open,
			'completed' : fs_td.Completed,
			'cancelled' : fs_td.Cancelled,
			'deleted' : fs_td.Deleted
		};

		var template = document.getElementById('followup_search_template').innerHTML;
		var compiledRendered = Template7(template, fs_dt);
		document.getElementById(fs_popupid).innerHTML = compiledRendered;
		resizemodal(fs_popupid);
		followup_search.bindEvents();
	},
	bindEvents:function(){

   		var customerList = fs_dt.customer_list;
   		var cache = {};
   		$('#searchCustomerNumber').change(function(){
   			if($(this).val() == ''){
   				fu_srch_data.fields.customer_id = '';
   				followup_search.updateStorage();
   			}
   		}).autocomplete({
			autoFocus: true,	
			source: function( request, response ) {
        		var term = request.term;
        		if( term in cache ) {
          			response( cache[ term ] );
          			return;
        		}
        		var results = $.ui.autocomplete.filter(customerList, request.term);
        		cache[ term ] = results;
                response(results.slice(0, 100));
  			},
			minLength: 1,
			select: function( event, data ) {
				fu_srch_data.fields.customer_id = data.item.id;
				fu_srch_data.fields.customer_name = data.item.value;
				followup_search.updateStorage();
			},	
		});
		$('ul.ui-autocomplete').css('z-index','100000');

		if(checkNull(fu_srch_data.fields.customer_id) != ''){
			for(var j in customerList){
				if(customerList[j].id == fu_srch_data.fields.customer_id){
					$('#searchCustomerNumber').val(customerList[j].value);
				}
			}
		}

		$('#searchStaff').select2({
			placeholder:fs_td.Select,
			allowClear:true,
		}).change(function(){
			var d = '';
			if(checkNull($('#searchStaff').val()) != ''){
				d = $('#searchStaff').val();
			}
			fu_srch_data.fields.contact_id = d;
			followup_search.updateStorage();
		});

		if(checkNull(fu_srch_data.fields.contact_id) != ''){
			$('#searchStaff').val(fu_srch_data.fields.contact_id).trigger('change');
		}


		$('#searchFollowupStatus').select2({
			placeholder:fs_td.Select,
			allowClear:true,
		}).change(function(){
			var d = '';
			if(checkNull($('#searchFollowupStatus').val()) != ''){
				d = $('#searchFollowupStatus').val();
			}
			fu_srch_data.fields.followup_status = d;
			followup_search.updateStorage();
		});
		if(checkNull(fu_srch_data.fields.followup_status) != ''){
			$('#searchFollowupStatus').val(fu_srch_data.fields.followup_status).trigger('change');
		}

		$('#searchOrderNumber').change(function(){
			fu_srch_data.fields.order_number = $('#searchOrderNumber').val();
			followup_search.updateStorage();
		});
		if(checkNull(fu_srch_data.fields.order_number) != ''){
			$('#searchOrderNumber').val(fu_srch_data.fields.order_number).trigger('change');
		}

		$('#followup_search_save').click(function(){
			$('#'+fs_popupid).modal('hide');
			if("followup_lists" in window){
				followup_lists.start(fs_meta);
			}
			else{

			}
		});

		$('#searchQuoteNumber').change(function(){
			fu_srch_data.fields.quote_number = $('#searchQuoteNumber').val();
			followup_search.updateStorage();
		});
		if(checkNull(fu_srch_data.fields.quote_number) != ''){
			$('#searchQuoteNumber').val(fu_srch_data.fields.quote_number).trigger('change');
		}

		$('#searchCustomerEmail').change(function(){
			fu_srch_data.fields.customer_email = $('#searchCustomerEmail').val();
			followup_search.updateStorage();
		});
		if(checkNull(fu_srch_data.fields.customer_email) != ''){
			$('#searchCustomerEmail').val(fu_srch_data.fields.customer_email).trigger('change');
		}


		$('#searchFollowupDate').datepicker({
			format:fs_dt.date_format_f
		}).change(function(){
			$('.datepicker').remove();
			var d = '';
			if(checkNull($('#searchFollowupDate').val()) != ''){
				d = $('#searchFollowupDate').val();
			}
			fu_srch_data.fields.followup_date = moment($('#searchFollowupDate').datepicker('getDate')).format('YYYY-MM-DD');
			followup_search.updateStorage();
		});

		if(checkNull(fu_srch_data.fields.followup_date) != ''){
			var d = moment(fu_srch_data.fields.followup_date)._d;
			$('#searchFollowupDate').datepicker('setDate',d).datepicker('update')
		}

		$('.followup_search').keypress(function(e){
			if(e.keyCode == 13){
				$('input,select').trigger('change');
				$('#followup_search_save').trigger('click');
			}
		});
	},
	updateStorage:function(){
		localStorage.setItem('followup_search_data',JSON.stringify(fu_srch_data));
	},
	generateStaff:function(id,data){
		var ret = '';		
		ret += '<option value="'+id+'">';
			ret += checkNull(data.name) +'&lt;'+checkNull(data.email)+'&gt;';
		ret += '</option>';
		return ret;
	}
}
Template7.registerHelper('StaffHelper', function (id,data){
	return followup_search.generateStaff(id,data);
});