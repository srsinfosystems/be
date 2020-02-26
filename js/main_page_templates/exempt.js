var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var base_url = $('#BASE_URL').val();
var popupid = 'popups';
var type = $('#type').val();

var e_dt;
var e_td;
var exempt = {
	start:function(){

		exempt.listenForData();

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
		
			getTranslationsData:'yes',
			getTranslationsDataArray:['General','Dashboard','Reasons for exempt','Add reason','Edit','Delete','Exempt reason deleted successfully','Are you sure you would like to delete','success','Success','No reason found','Exempts','Customer 1','Status','Note','Actions','Specialty work','Participant','Exempt','Go to customer','Customer name','Add customer','Confirmation','Success','No customer found'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Voluntries/getexemptData.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				e_dt = complet_data.response.response;
				e_td = e_dt.translationsData;
				exempt.createHtml(complet_data.response.response);
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
	listenForData:function(){
		
	},
	createHtml:function(){
		e_td.dshbrdurl = $('#BASE_URL').val()+'dashboard/index';
		var template = document.getElementById('exempt_template').innerHTML;

		var compiledRendered = Template7(template, e_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		exempt.bindEvents();
		hideProcessingImage();
	},
	bindEvents:function(){
		
		
	},
	generate_customer:function(res){
		var ret = '';
	

		var data = e_dt.customers[res].Customer;
		ret += '<tr id="customer_tr_'+data.id+'">';
			ret += '<td>';
				ret += data.customer_number;
			ret +='</td>';

			ret += '<td>';
				ret += data.customer_name;
			ret +='</td>';

			ret += '<td>';
				if(data.volunteer_type=='specialty_work'){
						ret += e_td.Specialtywork;
				}
				else if(data.volunteer_type=='exempt'){
					ret += e_td.Exempt;
				}
				
			ret +='</td>';

			ret += '<td>';
				if(data.volunteer_type=='specialty_work'){
						ret += data.voluntary_note;
				}
				else if(data.volunteer_type=='exempt'){
					var a = 0;
					for(var j in e_dt.PartnerExemptReasons){
						var d = e_dt.PartnerExemptReasons[j].PartnerExemptReason;
						if(data.voluntary_note==d.id){
							ret += d.name;
							var a = 1;
							break;
						}
					}
					if(a==0){
						ret += '-';
					}
				}
			ret +='</td>';

			ret += '<td>';
			
				ret+= '<a class="btn mini blue-stripe" onclick="return exempt.edit('+data.id+');" ><i class="icon-edit" ></i>&nbsp;'+e_td.Edit+'</a>&nbsp;';

				ret+= '<a class="btn mini red-stripe" onclick="return exempt.delete('+data.id+');"  ><i class="icon-edit" ></i>&nbsp;'+e_td.Delete+'</a>&nbsp;';

				var urrl = base_url + 'customers/details/'+data.id;
				ret+= '<a class="btn mini blue-stripe" onclick="return exempt.goToCustomer('+data.id+');" href="'+urrl+'" ><i class="icon-user" ></i>&nbsp;'+e_td.Gotocustomer+'</a>&nbsp;';
			
			ret +='</td>';
		ret += '</tr>';
		return ret;
	},
	goToCustomer:function(cust_id){
		new_custom_main_page2('/'+type+'/customers/details/'+cust_id,'all_customers','all_customers','customer_details',{customer_id:cust_id});
		return false;
	},
	edit:function(id){
		new_custom_popup2(600,'popups','edit_exempt',{customer_id:id});
	},
	delete:function(cust_id){
		var yes = function(){
			

			var total_params = {
				token:token,
				language:language,
				lang:lang,
				customer_id:cust_id,
				partner_id:partner_id,
				admin_id:admin_id,
				voluntary_note:'',
				volunteer_type:'participant',
				from:'voluntary'
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Customers/updateSalesProperties.json';
			params['data'] = total_params;
			params['successCallbackFunction'] = function (complet_data){
				if(complet_data.response.status == 'success'){
					exempt.start();
					$('#'+ee_popid).modal('hide');
					call_toastr('success',e_td.Success,checkNull(complet_data.response.response.message.msg));
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',e_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',e_td.alertmessage);
						return;
					}	
				}
			}

			doAjax(params);
			return;
		};

		var no = function(){
		};

		showDeleteMessage(e_td.Areyousureyouwouldliketodelete+'?',e_td.Confirmation,yes,no,'ui-dialog-blue',e_td.Delete,e_td.Cancel);
	},
}


Template7.registerHelper('exemptCustomerTableHelper', function (data){
	return exempt.generate_customer(data);
});
