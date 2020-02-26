var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var type = $('#type').val();

var ss_meta;
var ss_gd;
var ss_pid = 'popups';
var ss_td;
var customerList;
var customer_id;
var sales_sel = {
	start:function(popupid,metadata={}){
		ss_pid = popupid;
		ss_meta = metadata;

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Cancel','Alert message','Success','Select customer','Customer name','Customer number','Select customer','New customer','Reset','Please select customer'],
		};


		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Customers/selectCustomer.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				ss_gd = complet_data.response.response;
				ss_td = complet_data.response.response.translationsData;
				customerList = ss_gd.customer_list;
				sales_sel.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',ss_td.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',ss_td.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	createHtml:function(){
		var template = document.getElementById('sales_sel_template').innerHTML;
		var compiledRendered = Template7(template, ss_gd);
		document.getElementById(ss_pid).innerHTML = compiledRendered;
		resizemodal(ss_pid);
		sales_sel.bindEvents();
	},
	bindEvents:function(){
		var cache = {};
		$('#select_customer').autocomplete({
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
				customer_id = data.item.id;
				$('#sales_sel_sel').focus();
			},

		    //position: { my : "right top", at: "right bottom", collision : "flip"  },
		});
		$('ul.ui-autocomplete').css('z-index','100000');
		$('#sales_reset').click(function(){
			$('#select_customer').val('');
			customer_id = '';
		});

		$('#sales_sel_sel').click(function(){
			if(checkNull(customer_id) == ''){
				showAlertMessage(ss_td.Pleaseselectcustomer,'error',ss_td.Alertmessage);
				return ;
			}
			$('#'+ss_pid).modal('hide');
			new_custom_main_page2('/'+type+'/sales/save','sales_sel','sales_sel','sales_save',{customer_id:customer_id,submenu:checkNull(ss_meta.from)});
		});

		$('#sales_new').click(function(){
			new_custom_popup2('700','popups1','add_new_customer',{fromdoc:'salesDocument'});
		});
	}
}