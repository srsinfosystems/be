var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();
var type =  $('#type').val();
var date_format =  $('#date_format').val();
var date_format_partner =  $('#date_format_partner').val();
var table;
var trl_dt;
var trl_td;
var ds;
var sel_comment_row;
var col_inde = {
	'name':1,
	'suggested_translations':2,
	
	'new_translation_customer':3,
	
	'new_translation_member':4,
	
	'au':5,
	'le':6,
	'comment':7,
	'action':8,
	'customer_trans':9,
	'standard_trans':10
};
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
var filters = '';
var machine_trans = {};
var trans_data = {
	trans_language:'',
	trans_location:'',
};
var alternate_trans = {};
$('.menu-toggler').click();
var translations = {
	start:function(){
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Success','Settings','Translations','Alert message','Alert Message','Language','Type','Location','Get translations','Name','Current translation','Suggested translation','New translation','Edited by','Edit date','$sr_no','View','records','of','Page','Found total','Get translations','Get suggestion','Search','Save','Alternate translation','Select language','Enable alternate translation','Yes','No','Alternate tranlsation type','Alternate tranlsation language','Alternate tranlsation location','Hide already translated entries','Columns','Comment','Action','Excluded','Hidden','Flag','Standard translation','Member translation','Get','Hide if translated in standard','Hide if translated in member','Hide if translated in both','Show all','$show_hide_rows','Add entry','Actions','Choose','Reset translation value','Add comment','Cancel','Add','Reset comment','Alternate language','Alternate type'],
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getTranslationsFiles.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				trl_dt = complet_data.response.response;
				trl_td = complet_data.response.response.translationsData;
				x.a++;	
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',trl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',trl_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		x.registerListener(function(val) {
		  if(x.a == 2){
		  	x.a = 0;
		  	App.scrollTop();
		  	translations.createHtml(trl_dt);	
		  }	
		});
		$.ajaxSetup({ cache: true });

		var scripts = [
			host_url+'app/webroot/plugins/suwala.doublescroll/suwala.doublescroll.js?v='+css_js_version,
		];
		var queue = scripts.map(function(script) {
		    return $.getScript(script);
		});

		$.when.apply(null, queue).done(function() {
			x.a++;
		});
		
	
		doAjax(params);
		return;
	},
	createHtml:function(){
		trl_td.dashboardurl = base_url+'dashboard/index';
		trl_td.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('translations_template').innerHTML;
		var compiledRendered = Template7(template, trl_dt);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		if(checkNull(date_format_partner) != ''){
			var date_format_f = date_format_partner.toLowerCase();
		}
		else{
			var date_format_f = date_format.toLowerCase();
		}
		trl_dt['date_format_f'] = date_format_f;
		translations.bindEvents();
	},
	bindEvents:function(){
		$('.translations_template #trans_location').select2();
		$('.translations_template #trans_language').select2();
		$('.translations_template #alt_trans_language').select2(); 
		$('.translations_template #alt_trans_type').select2(); 

		$('.enable_alt_trans').toggleButtons({
			onChange: function ($element, active, e) {
				if(active){
					$('.alt_wrap').show();
				}
				else{
					$('.alt_wrap').hide();
				}
			},
            height: 31,
            label: {
	            enabled: trl_td.Yes,
	           	disabled: trl_td.No,
          	},
        });
		
	},
	get:function(){
		var alternate_trans = {};
		var trans_location = $('.translations_template #trans_location').val();
		var trans_language = $('.translations_template #trans_language').val();

		var alt_trans_language = $('.translations_template #alt_trans_language').val(); 
		var alt_trans_type = $('.translations_template #alt_trans_type').val(); 

		var enable_alt_trans = ($('.enable_alt_trans').toggleButtons('status'))?'y':'n';
		
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			trans_language:trans_language,
			trans_location:trans_location,

			enable_alt_trans:enable_alt_trans,

			alt_trans_language:alt_trans_language,
			alt_trans_type:alt_trans_type,		
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/readTranslationsFile.json';

		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				trans_data = {
					trans_language:complet_data.response.response.trans_language,
					trans_location:complet_data.response.response.trans_location,

					enable_alt_trans:complet_data.response.response.enable_alt_trans,
					alt_trans_language:complet_data.response.response.alt_trans_language,
					alt_trans_type:complet_data.response.response.alt_trans_type,
				};

				if(trans_data.enable_alt_trans == 'y'){
					col_inde = {
						'name':1,
						'suggested_translations':2,

						'alternate_translations':3,
						
						'new_translation_customer':4,
						
						'new_translation_member':5,
						
						'au':6,
						'le':7,
						'comment':8,
						'action':9,
						'customer_trans':10,
						'standard_trans':11
					};
				}
				else{
					col_inde = {
						'name':1,
						'suggested_translations':2,
						
						'new_translation_customer':3,
						
						'new_translation_member':4,
						
						'au':5,
						'le':6,
						'comment':7,
						'action':8,
						'customer_trans':9,
						'standard_trans':10
					};
				}

				translations.generateRows(complet_data.response.response.list);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',trl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',trl_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	generateRows:function(data){
		
	var tbl_html = `<table id="translations_tbl" class="table table-striped table-bordered table-hover" >
				<thead>	
				  	<tr>						
						<th class="fifteen ten">`+trl_td.Name+`</th>
						<th class="fifteen ten">`+trl_td.Suggestedtranslation+`</th>`;
						
	if(trans_data.enable_alt_trans == 'y'){
		tbl_html += `<th class="fifteen ten">`+trl_td.Alternatetranslation+`</th>`;
	}					
	tbl_html += `<th class="fifteen no-sort ten">`+trl_td.Standardtranslation+`</th>
						

						<th class="fifteen no-sort ten">`+trl_td.Membertranslation+`</th>
						
						<th class="twelve" style="width:70px">`+trl_td.Editedby+`</th>
						<th class="twelve" style="width:74px">`+trl_td.Editdate+`</th>
						<th class="twelve">`+trl_td.Comment+`</th>
						<th class="twelve no-sort">`+trl_td.Action+`</th>
						<th>standard</th>
						<th>member</th>
					</tr>
				</thead><tbody></tbody>
			</table>`;
		
		
		$('#translations_tbl_wrap').html(tbl_html);


		
		table = $('#translations_tbl').DataTable({
			autoWidth: false,
		 	pagingType: "input",
		 	columnDefs: [
			  { targets: 'no-sort', orderable: false },
			  { targets:'ten', width: '14%'}
			],
		 //	order: [[col_inde['current_translation'] - 1,'asc']],
			data:data,
			rowCallback: function( nRow, adata ) {

 				var text = $(nRow).find('td:nth-child('+col_inde['name']+')').text(); 
				if($(nRow).attr('gettr') == 'gettr'){
					translations.getMachineTranslation(text,nRow);
				}
				else{
					var button_text = `<button class="btn mini blue-stripe" onclick="translations.getMachineTranslationManual('`+text+`',this)">`+trl_td.Get+` <i class="icon-download-alt"></i></button>`;
					
					if(checkNull($(nRow).find('td:nth-child('+col_inde['new_translation_customer']+')').find('textarea').val()) == '' && checkNull($(nRow).find('td:nth-child('+col_inde['new_translation_member']+')').find('textarea').val()) == ''){
						translations.getMachineTranslation(text,nRow);
					}
					else{
						$(nRow).find('td:nth-child('+col_inde['suggested_translations']+')').html(button_text);
					}
				}

				var text = $(nRow).find('td:nth-child('+col_inde['action']+')').text();
				
				var actions_arr = text.split('##');

				var html1 = `<div class="btn-group" style="float: right;margin-left: 2px;"><button class="btn mini blue-stripe" type="button" data-toggle="dropdown">
									`+trl_td.Choose+`
									<i class="icon-angle-down"></i>
									</button>`;

				html1 += `<div id="sample_4_column_toggler" class="dropdown-menu hold-on-click dropdown-checkboxes pull-right">`;
				if(actions_arr[0] == 1){
					html1 += '<label><input class="uni flag_hidden" checked="checked" type="checkbox" value="'+actions_arr[0]+'" data-orig-val="'+actions_arr[0]+'">'+trl_td.Hidden+'</label>';
				}
				else{
					html1 += '<label><input class="uni flag_hidden" type="checkbox" value="'+actions_arr[0]+'" data-orig-val="'+actions_arr[0]+'">'+trl_td.Hidden+'</label>';
				}
				
				if(actions_arr[1] == 1){
					html1 += '<label><input class="uni flag_excluded" checked="checked" type="checkbox" value="'+actions_arr[1]+'" data-orig-val="'+actions_arr[1]+'">'+trl_td.Excluded+'</label>';
				}
				else{
					html1 += '<label><input class="uni flag_excluded" type="checkbox" value="'+actions_arr[1]+'" data-orig-val="'+actions_arr[1]+'">'+trl_td.Excluded+'</label>';
				}
				html1 += '<label onclick="translations.addComment(this);" class="add_comment" >'+trl_td.Addcomment+'</label>';

				html1 += '<label onclick="translations.resetCommentVal(this);" class="reset_comment" style="display:none !important;">'+trl_td.Resetcomment+'</label>';

				html1 += '<label onclick="translations.resetTransVal(this);" class="reset_trans_val" style="display:none !important;">'+trl_td.Resettranslationvalue+'</label>';
				
				html1 += `</div></div>`;
				if($(nRow).attr('datechecked') != '1'){
					$(nRow).find('td:nth-child('+col_inde['action']+')').html(html1);

					var text = $(nRow).find('td:nth-child('+col_inde['le']+')').text();
					try{
						var dt = moment(text).format('YYYY-MM-DD');
						if(dt == "Invalid date"){
							$(nRow).find('td:nth-child('+col_inde['le']+')').html('');
						}
						else{
							var a = convertDateIntoSiteFormat(text)+' '+moment(text).format('hh:mm');
							$(nRow).find('td:nth-child('+col_inde['le']+')').html(a);
						}
						$(nRow).attr('datechecked','1');
					}catch(e){
						$(nRow).find('td:nth-child('+col_inde['le']+')').html('');
						$(nRow).attr('datechecked','1');
					}
				}
			
   			},
			dom: "<'row-fluid'<'span6'fr><'span6 sv_btn_wrp1'>><'row-fluid't><'row-fluid'<'span8 dataTables_extended_wrapper'pli><'span4 sv_btn_wrp'>>",
			buttons: [
	        ],
			language: {
				"decimal": ",",
           	 	"thousands": ".",
				lengthMenu: 
		          	trl_td.View+ ' <select>'+
		            '<option value="10">10</option>'+
		            '<option value="20">20</option>'+
		            '<option value="30">30</option>'+
		            '<option value="40">40</option>'+
		            '<option value="50">50</option>'+
		            '<option value="-1">All</option>'+
		            '</select> '+ trl_td.records + ' |  '
		        ,
				"paginate": {
					"previous": '<i class="icon-angle-left"></i>',
					"next": '<i class="icon-angle-right"></i>',
					'of':trl_td.of,
					'Page':trl_td.Page,
				},
				"info": trl_td.Foundtotal+" _TOTAL_ "+trl_td.records,
				"search": "",
				"searchPlaceholder":trl_td.Search,
			}
		});

		var arr = {
			name:trl_td.Name,
			current_translation_customer:trl_td.Suggestedtranslation,

	
			//new_translation_customer:trl_td.Standardtranslation,

			//new_translation_member:trl_td.Membertranslation,

			au:trl_td.Editedby,
			le:trl_td.Editdate,
			//comment:trl_td.Comment,
			action:trl_td.Action,
		};
		filters = '';
		for(var j in arr){
			filters += '<label><input class="uni fil_list_uni" checked="checked" type="checkbox" value="'+col_inde[j]+'">'+arr[j]+'</label>';
		}
		


		var html1 = `<div class="btn-group" style="float: right;margin-left: 2px;"><a class="btn" href="#" data-toggle="dropdown">
									`+trl_td.Columns+`
									<i class="icon-angle-down"></i>
									</a>`;
		html1 += `<div id="sample_2_column_toggler" class="dropdown-menu hold-on-click dropdown-checkboxes pull-right">`;
		html1 += filters;
		html1 += `</div></div>`;

		var options = {
			0:trl_td.Hideiftranslatedinstandard,
			1:trl_td.Hideiftranslatedinmember,
			2:trl_td.Hideiftranslatedinboth,
			3:trl_td.Showall,
		};
		var list = '';
		for(var j in options){
			if(j == 0){
				list += '<label><input class="uni" name="hide_entries" checked="checked" type="radio" value="'+j+'">'+options[j]+'</label>';
			}
			else{
				list += '<label><input class="uni" name="hide_entries"  type="radio" value="'+j+'">'+options[j]+'</label>';
			}
		}

		var html = `<div style="float: right;margin-left: 5px;"><button onclick="translations.save();" class="btn blue" type="button" ><i class="icon-ok"></i> `+trl_td.Save+`</button></div>
			<div class="btn-group" style="float: right;margin-left: 2px;"><a class="btn" href="#" data-toggle="dropdown">
									`+trl_td.$show_hide_rows+`
									<i class="icon-angle-down"></i>
									</a>`;
		html += `<div id="sample_2_column_toggler" class="dropdown-menu hold-on-click dropdown-checkboxes pull-right">`;
		html += list;
		html += `</div></div>`;

		

		$('.sv_btn_wrp').html(html);
		$('.sv_btn_wrp1').html(html+html1);
		$('.uni').uniform();
		$('.fil_list_uni').change(function(){
			var v = $(this).val();
			if($(this).is(':checked')){
				table.columns( [v-1] ).visible( true );
			}
			else{
				table.columns( [v-1] ).visible( false );
			}
			setTimeout(function(){
				ds.doubleScroll('refresh');
			});
		});
		table.columns( [col_inde['customer_trans']-1] ).visible( false );
		table.columns( [col_inde['standard_trans']-1] ).visible( false );
		$('input[name="hide_entries"]').change(function(){
			var v = $('input[name="hide_entries"]:checked').val();
			console.log('v',v);
			if(v == 0){
				table
				.column(parseInt(col_inde['customer_trans'] - 1))
		        .search('')
		        .column(parseInt(col_inde['standard_trans'] - 1))
		        .search('')
		       	.column([parseInt(col_inde['customer_trans'] - 1),parseInt(col_inde['standard_trans'] - 1)])
		        .search('')
		        .column(parseInt(col_inde['customer_trans'] - 1))
		        .search('^$',true,false)
		        .draw();
			}
			else if(v == 1){
				table
				.column(parseInt(col_inde['customer_trans'] - 1))
		        .search('')
		        .column(parseInt(col_inde['standard_trans'] - 1))
		        .search('')
		       	.column([parseInt(col_inde['customer_trans'] - 1),parseInt(col_inde['standard_trans'] - 1)])
		        .search('')
		        .column(parseInt(col_inde['standard_trans'] - 1))
		        .search('^$',true,false)
		        .draw();
			}
			else if(v == 2){
				table
				.column(parseInt(col_inde['customer_trans'] - 1))
		        .search('')
		        .column(parseInt(col_inde['standard_trans'] - 1))
		        .search('')
		       	.column([parseInt(col_inde['customer_trans'] - 1),parseInt(col_inde['standard_trans'] - 1)])
		        .search('')
		        .draw();

		       $.fn.DataTable.ext.search.push(
			    function( settings, data, dataIndex ) {
				       if(checkNull(data[col_inde['customer_trans']]).trim() != '' && checkNull(data[col_inde['standard_trans']-1]).trim()  != ''){
				       	return false;
				       }
				       return true;
				    }
				);
				
			
				table
				.columns([col_inde['customer_trans'] - 1,col_inde['standard_trans'] - 1])
			    .search('',true,false)
		        .draw();
		        $.fn.dataTable.ext.search = [];
		       
			}
			else{
				table
		        .column(parseInt(col_inde['customer_trans'] - 1))
		        .search('')
		        .column(parseInt(col_inde['standard_trans'] - 1))
		        .search('')
		       	.column([parseInt(col_inde['customer_trans'] - 1),parseInt(col_inde['standard_trans'] - 1)])
		        .search('')
		        .draw();
			}

		});


		

      
        table.on( 'draw.dt', function () {
		   	setTimeout(function(){
				ds.doubleScroll('refresh');
				$('#translations_tbl tbody tr').each(function(){
					var td_height = $(this).find('td').outerHeight();
					$(this).find('textarea').css('height',(td_height - 21)+'px')
				});
			});
		});


  		ds = $('#translations_tbl_wrapper div.row-fluid:nth-child(2)').doubleScroll();
		// table
  //       .column(col_inde['current_translation_customer'] - 1)
  //       .search('^$',true,false)
  //       .draw();
        setTimeout(function(){
			ds.doubleScroll('refresh');
			$('#translations_tbl tbody tr').each(function(){
				var td_height = $(this).find('td').outerHeight();
				$(this).find('textarea').css('height',(td_height - 21)+'px')
			});
			$('input[name="hide_entries"]:checked').trigger('change');

		});
		$('#translations_tbl tbody').on('change','textarea',function(){
			
			var attr = $(this).attr('data-orig-val');
			var v = $(this).val();
			if(attr == v){
				$(this).css('background-color','');
				$(this).parent().parent().find('label.reset_trans_val').attr('style','display: none !important');
			}
			else{
				$(this).css('background-color','#FFFBD6');
				$(this).parent().parent().find('label.reset_trans_val').removeAttr('style');
			}
		});
	},
	resetTransVal:function(that){
		var nRow = $(that).parent().parent().parent().parent();
		var textarea1 = $(nRow).find('textarea')[0];
		$(textarea1).val($(textarea1).attr('data-orig-val')).css('background-color','');

		var textarea2 = $(nRow).find('textarea')[1];
		$(textarea2).val($(textarea2).attr('data-orig-val')).css('background-color','');
		$(that).attr('style','display: none !important');
		$('body').click();
	},
	resetCommentVal:function(that){
		var sel_comment_row = $(that).parent().parent().parent().parent();
		var orig_comment = sel_comment_row.find('td:nth-child('+col_inde['comment']+') .orig_com').val();

		sel_comment_row.find('td:nth-child('+col_inde['comment']+') .new_com').val('');
		sel_comment_row.find('td:nth-child('+col_inde['comment']+')').css('background-color','');
		sel_comment_row.find('.reset_comment').attr('style','display:none !important');
		sel_comment_row.find('td:nth-child('+col_inde['comment']+') .com_text').html(orig_comment);

		$('body').click();
	},
	addComment:function(that){
		var comment = $(that).parent().parent().parent().parent().find('td:nth-child('+col_inde['comment']+')').text();
		sel_comment_row = $(that).parent().parent().parent().parent();
		$('#add_comment_modal').modal();
		$('#comment').val(comment);
		$('body').click();
	},
	saveComment:function(){
		var comment = $('#comment').val();
		var orig_comment = sel_comment_row.find('td:nth-child('+col_inde['comment']+') .orig_com').val();

		sel_comment_row.find('td:nth-child('+col_inde['comment']+') .com_text').html(comment);

		if(orig_comment == comment){
			sel_comment_row.find('td:nth-child('+col_inde['comment']+') .new_com').val('');
			sel_comment_row.find('td:nth-child('+col_inde['comment']+')').css('background-color','');
			sel_comment_row.find('.reset_comment').attr('style','display:none !important');
		}
		else{
			sel_comment_row.find('td:nth-child('+col_inde['comment']+') .new_com').val(comment);
			sel_comment_row.find('td:nth-child('+col_inde['comment']+')').css('background-color','#FFFBD6');
			sel_comment_row.find('.reset_comment').attr('style','');
		}

		
		$('#add_comment_modal').modal('hide');
	},
	addText:function(text,that){
		$(that).parent().parent().find('td:nth-child('+col_inde['new_translation_customer']+')').find('textarea').val(text);
	
	},
	addMachineText:function(ind,nRow,text){
		var html = text+`<i onclick="translations.addText('`+text+`',this)" style="float:right;" class="add_trans fal fa-arrow-circle-right"></i>`;
		$(nRow).attr('gettr','gettr').find('td:nth-child('+ind+')').html(html);
	},
	getMachineTranslationManual:function(text,that){
		
		var nRow = $(that).parent().parent();
		translations.getMachineTranslation(text,nRow);		
	},
	getMachineTranslation:function(text,nRow,){

		if(trans_data['trans_language'] == 'nor'){
			var from = 'en';
			var to = 'no';
		}
		else if(trans_data['trans_language'] == 'eng'){
			var from = 'en';
			var to = 'en';
		}
		var html = `<img src="`+host_url+`img/loading.gif">`;
		
		$(nRow).find('td:nth-child('+col_inde['suggested_translations']+')').html(html);	

		var found = 0;
		try{
			if(checkNull(machine_trans[from][to][text]) != ''){
				found = 1;
			}
		}
		catch(e){
			found = 0;
		}
		
		if(found == 1){
			translations.addMachineText(col_inde['suggested_translations'],nRow,machine_trans[from][to][text][0]);
		}
		else{
			var total_params = {
				token:token,
				language:language,
				lang:lang,
				partner_id:partner_id,
				admin_id:admin_id,
				from:from,
				to:to,
				text:text,
			};

			var params = $.extend({}, doAjax_params_default);
			params['url'] = APISERVER+'/api/Commons/getMachineTranslation.json';
			params['data'] = total_params;
			params['completeCallbackFunction'] = function (){
				hideProcessingImage();
			}
			
			params['successCallbackFunction'] = function (complet_data){
			
				if(complet_data.response.status == 'success'){
					var res = complet_data.response.response;
					if(!(res['from'] in machine_trans)){
						machine_trans[res['from']] = {};
					}

					if(!(res['to'] in machine_trans[res['from']])){
						machine_trans[res['from']][res['to']] = {};
					}
					machine_trans[res['from']][res['to']][res['text']] = res['translated_val'];
					translations.addMachineText(col_inde['suggested_translations'],nRow,res['translated_val']);
					
				}
				else if(complet_data.response.status == 'error'){
					if(complet_data.response.response.error == 'validationErrors'){
						var mt_arr = complet_data.response.response.list;
						var array = $.map(mt_arr, function(value, index) {
							return value+'<br />';
						});
						showAlertMessage(array,'error',trl_td.alertmessage);
						return;
					}else{
						showAlertMessage(complet_data.response.response.msg,'error',trl_td.alertmessage);
						return;
					}	
				}
			}
			
			doAjax(params);
			return;
		}
	},
	save:function(){
		var changed_vars = [];
		showProcessingImage('undefined');
		try{
			table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
	    		var rowNode = this.node();
	    		
	    		var new_translation_customer = $(rowNode).find('td:nth-child('+col_inde['new_translation_customer']+') textarea').val();
	    		var new_translation_customer_orig_val =  $(rowNode).find('td:nth-child('+col_inde['new_translation_customer']+') textarea').attr('data-orig-val');

	    		var new_translation_member = $(rowNode).find('td:nth-child('+col_inde['new_translation_member']+') textarea').val();
	    		var new_translation_member_orig_val =  $(rowNode).find('td:nth-child('+col_inde['new_translation_member']+') textarea').attr('data-orig-val');

				var name = $(rowNode).find('td:nth-child('+col_inde['name']+')').text();
	   				
	   			var fields = {};
	   			
	   			if(checkNull(new_translation_customer).trim() !=  checkNull(new_translation_customer_orig_val).trim()){
	   				fields['customer_msgstr'] = new_translation_customer.trim();
	   			}

	   			if(checkNull(new_translation_member).trim() != checkNull(new_translation_member_orig_val).trim()){
	   				fields['member_msgstr'] = new_translation_member.trim();
	   			}

	   			var flag_hidden = ($(rowNode).find('td:nth-child('+col_inde['action']+') .flag_hidden').is(':checked'))?'1':'0';
	   			var orig_flag_hidden = $(rowNode).find('td:nth-child('+col_inde['action']+') .flag_hidden').attr('data-orig-val'); 			
	   			if(checkNull(orig_flag_hidden) != '' && (flag_hidden != orig_flag_hidden)){
	   				fields['hidden'] = flag_hidden;
	   			}

	   			var flag_excluded = ($(rowNode).find('td:nth-child('+col_inde['action']+') .flag_excluded').is(':checked'))?'1':'0';
	   			var orig_flag_excluded = $(rowNode).find('td:nth-child('+col_inde['action']+') .flag_excluded').attr('data-orig-val');
	   			if(checkNull(orig_flag_excluded) != '' && (flag_excluded != orig_flag_excluded)){
	   				fields['excluded'] = flag_excluded;
	   			}

	   			var comment = $(rowNode).find('td:nth-child('+col_inde['comment']+') .new_com').val();
	   			if(checkNull(comment).trim() != ''){
	   				fields['comments'] = comment;
	   			}

	   			if(!$.isEmptyObject(fields)){
	   				changed_vars.push({
	   					name:name,
	   					fields:fields
	   				});
	   			}
			});
		}
		catch(e){
			hideProcessingImage('undefined');
		}

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
	
			trans_language:trans_data['trans_language'],
			trans_location:trans_data['trans_location'],

			enable_alt_trans:trans_data['enable_alt_trans'],

			changed_vars:changed_vars,
		};

		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/saveTranslationsFile.json';

		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				if(trans_data['trans_location'] == 'web'){
					translations.writeFileToWeb(complet_data.response.response);
				}
				else{
					$('#trans_language').val(trans_data['trans_language']).trigger('change');
					$('#trans_location').val(trans_data['trans_location']).trigger('change');
					translations.get();
					call_toastr('success', trl_td.Success,complet_data.response.response.message.msg);
				}				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',trl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',trl_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},
	writeFileToWeb:function(data){
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
	
			standard_savefile:data['standard_savefile'],
			member_savefile:data['member_savefile'],

			standard_path:data['standard_path'],
			member_path:data['member_path'],

			trans_language:trans_data['trans_language'],
			trans_location:trans_data['trans_location'],
		};
		
		var params = $.extend({}, doAjax_params_default);
		params['url'] = base_url+'settings/saveTranslationsFile'; 

		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
			
				$('#trans_language').val(trans_data['trans_language']).trigger('change');
				$('#trans_location').val(trans_data['trans_location']).trigger('change');
				translations.get();
				call_toastr('success', trl_td.Success,complet_data.response.response.message.msg);
							
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',trl_td.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',trl_td.alertmessage);
					return;
				}	
			}
		}
		showProcessingImage('undefined');
		doAjax(params);
		return;
	},

}
