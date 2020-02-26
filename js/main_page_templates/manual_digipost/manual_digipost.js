var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();
var host_url = $('#HOST_URL').val();
var base_url = $('#BASE_URL').val();

var global_manual_digipost_data;
var global_manual_digipost_translations_data;
var w;
var global_wb;
var X = XLSX;
var output = "";
var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
// var XW = {

// 	msg: 'xlsx',

// 	worker: './xlsxworker.js'
// };

var manual_digipost = {
	start:function(){
		manual_digipost.listenForData();
		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Dashboard','alert message','Manual digipost','Step','of','Upload','Excel','CSV','letter','Set return address','Summary','Back','Next','Select','Customer details','Customer fullname','Address','Zip','City','Please select file','alert message','Please check the following fields','Letter','Return address','Ignore rows','Found total','records','Approve','Discard','success','Success','Manual digipost deleted successfully','Manual digipost processed successfully','Create new','Select','Custom return address','Yes','No','Address1','Address2','Name','Select sheet','First row contains column headers','Please select sheet','row','rows','Please select valid PDF file','View','records','next','prev','Please select valid file'],
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getManualDigipost.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				global_manual_digipost_data = complet_data.response.response;
				global_manual_digipost_translations_data = complet_data.response.response.translationsData;
				manual_digipost.createHtml(complet_data.response.response);
		
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_manual_digipost_translations_data.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_manual_digipost_translations_data.alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		global_manual_digipost_translations_data.dashboardurl = base_url+'dashboard/index';
		global_manual_digipost_translations_data.loaderurl = host_url+'app/webroot/img/loading.gif';
		var template = document.getElementById('manual_digipost_template').innerHTML;
		var compiledRendered = Template7(template, global_manual_digipost_data);
		document.getElementById('content').innerHTML = compiledRendered;
		$(window).scrollTop(0);
		hideProcessingImage();
		manual_digipost.bindEvents();
		if(global_manual_digipost_data.digipostmanual!=undefined && global_manual_digipost_data.digipostmanual!=null && global_manual_digipost_data.digipostmanual!='' && global_manual_digipost_data.digipostmanual.length!=0){
			manual_digipost.generateSummary2(global_manual_digipost_data.digipostmanual);

		}
		//if(global_manual_digipost_data.)

	},
	bindEvents:function(){
		w = $('#manual_digipost_template_from').bootstrapWizard({
                'nextSelector': '.button-next',
             	'previousSelector': '.button-previous',
				onTabClick: function (tab, navigation, index) {
					return false;
				},
             	beforeNext: function (tab, navigation, index) {
             		$('.btn_dis,.btn_app').addClass('hide');
					var current = index + 1;
					if(current==2){
						return manual_digipost.validateOne();
					}
					if(current==3){
						return manual_digipost.validateTwo();
					}
					if(current==4){
						return manual_digipost.validateThree();
					}

                	return true;
                },
                onNext: function (tab, navigation, index) {
                 	var total = navigation.find('li').length;
                    var current = index + 1;
                    $("#wizard_steps").val(current);
                    $('.step-title', $('#manual_digipost_template_from')).text(global_manual_digipost_translations_data.Step+' ' + (index + 1) + ' '+global_manual_digipost_translations_data.of+' ' + total);
                    jQuery('li', $('#manual_digipost_template_from')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }
                    $('.btn_dis,.btn_app').addClass('hide');
                    if(current>1){
                    	$('.button-previous').removeClass('hide');
                    	$('#btn_count').addClass('hide');
                    }
                    else{
                    	$('.button-previous').addClass('hide');
                    	$('#btn_count').removeClass('hide');
                    }

                    if(current < 4){
                    	$('.button-next').removeClass('hide');
                    }
                    else{
                    	$('.button-next').addClass('hide');
                    }
                },
                onPrevious: function (tab, navigation, index) {
                 	var total = navigation.find('li').length;
                    var current = index + 1;
                    $('.step-title', $('#manual_digipost_template_from')).text(global_manual_digipost_translations_data.Step+' ' + (index + 1) + ' '+global_manual_digipost_translations_data.of+' ' + total);
                    jQuery('li', $('#manual_digipost_template_from')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }
                    if(current>1){
                    	$('.button-previous').removeClass('hide');
                    	$('#btn_count').addClass('hide');
                    }
                    else{
                    	$('.button-previous').addClass('hide');
                    	$('#btn_count').removeClass('hide');
                    }

                    if(current<4){
                    	$('.button-next').removeClass('hide');
                    }
                    else{
                    	$('.button-next').addClass('hide');
                    }
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#manual_digipost_template_from').find('.bar_wizard').css({
                        width: $percent + '%'
                    });
                }
        	});
		$('#xlsx_file').change(function(e){
			//showProcessingImage('undefined');
			var name = '';
			if(e.target.files[0]!=undefined && e.target.files[0]!=null && e.target.files[0]!=''){
				name = e.target.files[0].name;
			}
			if(name==undefined || name==null){
				name = '';
			}
			var pattern="^.+\.(xlsx|xls|csv)$";
			var validate = name.match(pattern);

			if(!validate){
				$('#xlsx_file').val('');
				$('.excel_file_name').html('');
				var msg = global_manual_digipost_translations_data.Pleaseselectvalidfile;
				showAlertMessage(msg,'error',global_manual_digipost_translations_data.alertmessage);
				return;
			}

			$('.excel_file_name').html(name);

			manual_digipost.do_file(e.target.files);
		});

		$('#pdf_letter').change(function(e){
			var name = '';
			if(e.target.files[0]!=undefined && e.target.files[0]!=null && e.target.files[0]!=''){
				name = e.target.files[0].name;
			}
			if(name==undefined || name==null){
				name = '';
			}
			$('.pdf_file_name').html(name);
			var control = document.getElementById("pdf_letter");
		    var files = control.files;
		    for (var i = 0; i < files.length; i++) {
		        if(files[i].type!='application/pdf'){
		        	$('#pdf_letter').val('');
		        	$('.pdf_file_name').html('');
		        	var msg = global_manual_digipost_translations_data.PleaseselectvalidPDFfile;
					showAlertMessage(msg,'error',global_manual_digipost_translations_data.alertmessage);
					return false;
		        }
		    }
		});
		$('.btn_app').click(function(){
			manual_digipost.updateManualDigipostStatus(1);
		});
	
		$('.btn_dis').click(function(){
			manual_digipost.updateManualDigipostStatus(0);
		});

		$('#return_address').select2({
			placeholder:global_manual_digipost_translations_data.Select,
			allowClear:true,
		}).change(function(){
			if($('#return_address').val()=='create_new'){
				setTimeout(function(){
					$('#return_address').val('').trigger('change');
				},10);
				setTimeout(function(){
					new_custom_popup2(600,'popups','add_return_address',{from:'man_digi'});
				},20);
				
			}
		});

		$('#customerReturnAddress').bootstrapSwitch();
		$('#customerReturnAddress').on('switch-change', function (e, data) {
		    var value = data.value;
			if(value){
				$('#return_address').val('').trigger('change');
				$('.return_address_wrap').addClass('hide');
				$('.return_address_wrap1').removeClass('hide');				
			}
			else{
				$('.return_address_wrap').removeClass('hide');
				$('.return_address_wrap1').addClass('hide');
			}
		});

		$('#zip').change(function(){
			manual_digipost.getCityFromZip('#zip','#city');
		});
	},
	getCityFromZip:function(target,target1){
		var zip = $(target).val();
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			ccode:"NO",
			zip:zip

		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/logins/getCityFromZip.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				if(complet_data.response.response.city!=undefined || complet_data.response.response.city!=null){
					$(target1).val(complet_data.response.response.city);
				}				
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					//showAlertMessage(array,'error',global_ret_translations.Alertmessage);
					return;
				}else{
					//showAlertMessage(complet_data.response.response.msg,'error',global_ret_translations.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;

	},
	do_file:function(files){
		var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
		
		var domrabs = {checked:true};
		if(!rABS) domrabs.disabled = !(domrabs.checked = false);

		var use_worker = typeof Worker !== 'undefined';
		
		var domwork = {checked:false};
		if(!use_worker) domwork.disabled = !(domwork.checked = false);

		var xw = function xw(data, cb) {
			var worker = new Worker(XW.worker);
			worker.onmessage = function(e) {
				switch(e.data.t) {
					case 'ready': break;
					case 'e': break;
					case XW.msg: cb(JSON.parse(e.data.d)); break;
				}
			};
			worker.postMessage({d:data,b:rABS?'binary':'array'});
		};

		//return function do_file(files) {
		
			rABS = domrabs.checked;
			use_worker = domwork.checked;
			var f = files[0];
			var reader = new FileReader();
			reader.onload = function(e) {
				if(typeof console !== 'undefined'){}
				var data = e.target.result;

				if(!rABS) data = new Uint8Array(data);
				if(use_worker) xw(data, manual_digipost.process_wb);
				else manual_digipost.process_wb(X.read(data, {type: rABS ? 'binary' : 'array'}));
			};
			if(rABS) reader.readAsBinaryString(f);
			else reader.readAsArrayBuffer(f);
		//};
	
	},
	process_wb:function(wb){
		global_wb = wb;
		
		output = manual_digipost.to_json(wb);

		$('#sheets').html('');
		var count_sheet = 0;
		var sheeopt_html = '';
		sheeopt_html += '<div class="control-group">';
			sheeopt_html += '<label class="control-label">';
				sheeopt_html += global_manual_digipost_translations_data.Selectsheet
			sheeopt_html += '</label>';
			sheeopt_html += '<div class="controls">';
				sheeopt_html += '<select name="which_sheet" id="which_sheet" class="m-wrap span6 which_sheet">';
					sheeopt_html += '<option value=""></option>';
					$.each(output, function (key, val) {
						var keyid = key.replace(/ /g, '');
						sheeopt_html += '<option value="'+keyid+'">';
							sheeopt_html += key;
						sheeopt_html += '</option>';
					
						count_sheet++;
					});
				sheeopt_html += '</select>';
			sheeopt_html += '</div>';
		sheeopt_html += '</div>';
		//alert(count_sheet);return;
		var sheets_headers = '<div class="row-fluid">';
			sheets_headers += '<div class="control-group">';
				sheets_headers += '<label class="control-label">';
					sheets_headers += global_manual_digipost_translations_data.Firstrowcontainscolumnheaders
				sheets_headers += '</label>';
				sheets_headers += '<div class="controls">';
					sheets_headers += '<div class="switch switch-small" id="customer_ignore" data-on-label="'+global_manual_digipost_translations_data.Yes+'" data-off-label="'+global_manual_digipost_translations_data.No+'">';
						sheets_headers += '<input type="checkbox" class="toggle" checked="checked" id="" name="customer_ignore"/>';
					sheets_headers += '</div>';
				sheets_headers += '</div>';
			sheets_headers += '</div>';
		sheets_headers += '</div>';
		$('#btn_count').addClass('hide');
		if(count_sheet>1){
			$('#sheets_select').html(sheeopt_html);
			$('#sheets_headers').html(sheets_headers);
			$('#which_sheet').select2({
				placeholder:global_manual_digipost_translations_data.Select,
				allowClear:true,
			}).change(function(){
				var htmlopt  = '';
				var which_sheet = $('#which_sheet').val();
				var c = 0;
				if(which_sheet!=''){
					$.each(output, function (key, val) {
						var keyid = key.replace(/ /g, '');
						if(keyid==which_sheet){
							htmlopt += manual_digipost.generateSheet(key,val);
							c = val.length;
						}
					});
				}

				$('#customer_ignore').bootstrapSwitch('setState',true,true);
				$('#sheets').html(htmlopt);
				
				if(c==0){
					$('#btn_count').addClass('hide');
				}
				else if(c==1){
					$('#btn_count').removeClass('hide').html(c+' '+global_manual_digipost_translations_data.row)
				}
				else{
					$('#btn_count').removeClass('hide').html(c+' '+global_manual_digipost_translations_data.rows)
				}
				manual_digipost.bindSelect();
			});

		}
		else{
			var html = '';
			var c = 0;
			$.each(output, function (key, val) {
				html += manual_digipost.generateSheet(key,val);
				c = val.length;
			});
				if(c==0){
					$('#btn_count').addClass('hide');
				}
				else if(c==1){
					$('#btn_count').removeClass('hide').html(c+' '+global_manual_digipost_translations_data.row)
				}
				else{
					$('#btn_count').removeClass('hide').html(c+' '+global_manual_digipost_translations_data.rows)
				}

			$('#sheets_select').html('');
			$('#sheets_headers').html(sheets_headers);
			$('#sheets').html(html);
			manual_digipost.bindSelect();
			
		}
		$('#customer_ignore').bootstrapSwitch().on('switch-change', function (e, data) {
		    var value = data.value;
		    var htmlopt = '';
			if(value){
				if($('#which_sheet').length!=0){
					var which_sheet = $('#which_sheet').val();
					$.each(output, function (key, val) {
						var keyid = key.replace(/ /g, '');
						if(keyid==which_sheet){
							htmlopt += manual_digipost.generateSheet(key,val,'yes');
						}
					})
				}	
				else{
					$.each(output, function (key, val) {
						htmlopt += manual_digipost.generateSheet(key,val,'yes');
					});
				}
			}
			else{
				if($('#which_sheet').length!=0){
					var which_sheet = $('#which_sheet').val();
					$.each(output, function (key, val) {
						var keyid = key.replace(/ /g, '');
						if(keyid==which_sheet){
							htmlopt += manual_digipost.generateSheet(key,val,'no');
						}
					})
				}	
				else{
					$.each(output, function (key, val) {
						htmlopt += manual_digipost.generateSheet(key,val,'no');
					});
				}
			}
			$('#sheets').html(htmlopt);
			$('.customer_fullname,.customer_address,.customer_zip,.customer_city').select2();
			manual_digipost.bindSelect();
		});
			
		hideProcessingImage();

		
	},
	bindSelect:function(){
		$('select.customer_fullname').change(function(){
			var customer_fullname  = $(this).val();
		
			var str = '';
			var v = '';
			if($('#which_sheet').length==0){
				var whichvalname = [];
				for(var k in alphabet){
					for(var l in customer_fullname){
						if(alphabet[k]==customer_fullname[l]){
							whichvalname.push(k);
						}
					}
				}
				$.each(output, function (key, val) {
					v = key;
					
					for(var j in val){
						var st = $('#customer_ignore').bootstrapSwitch('status');
						if(st && j==0){
							continue;
							
						}
						
						for(var m in whichvalname){
							var ind = whichvalname[m];
							console.log(val[j][ind]);
							if(val[j][ind]!=undefined && val[j][ind]!=null){
								str += val[j][ind]+' ';
							}
							
						}
						if(str!=''){
							str = str.trim();
							break;
						}
					}					
				});
				
				$('.customer_fullname_eg_'+v).html(str);
			}
			else{
				var v = $('#which_sheet').val();
				var whichvalname = [];
				for(var k in alphabet){
					for(var l in customer_fullname){
						if(alphabet[k]==customer_fullname[l]){
							whichvalname.push(k);
						}
					}
				}
				$.each(output, function (key, val) {
					var keyid = key.replace(/ /g, '');
					if(v==keyid){
						for(var j in val){
							var st = $('#customer_ignore').bootstrapSwitch('status');
							if(st && j==0){
								continue;
							}
							
							for(var m in whichvalname){
								var ind = whichvalname[m];
								if(val[j][ind]!=undefined && val[j][ind]!=null){
									str += val[j][ind]+' ';
								}
								
							}
							if(str!=''){
								str = str.trim();
								break;
							}
						}	
					}				
				});
				$('.customer_fullname_eg_'+v).html(str);
			}
			
		});

		$('select.customer_address').change(function(){
			var customer_address  = $(this).val();
		
			var str = '';
			var v = '';
			var whichvalname = [];
			for(var k in alphabet){
				for(var l in customer_address){
					if(alphabet[k]==customer_address[l]){
						whichvalname.push(k);
					}
				}
			}
			if($('#which_sheet').length==0){
				$.each(output, function (key, val) {
					v = key;
					for(var j in val){
						var st = $('#customer_ignore').bootstrapSwitch('status');
						if(st && j==0){
							continue;
						}

						for(var m in whichvalname){
							var ind = whichvalname[m];
							if(val[j][ind]!=undefined && val[j][ind]!=null){
								str += val[j][ind]+' ';
							}
							
						}
						if(str!=''){
							str = str.trim();
							break;
						}						
					}					
				});
				$('.customer_address_eg_'+v).html(str);
			}
			else{
				var v = $('#which_sheet').val();
				var whichvalname = [];
				for(var k in alphabet){
					for(var l in customer_address){
						if(alphabet[k]==customer_address[l]){
							whichvalname.push(k);
						}
					}
				}
				$.each(output, function (key, val) {
					var keyid = key.replace(/ /g, '');
					if(v==keyid){
						for(var j in val){
							var st = $('#customer_ignore').bootstrapSwitch('status');
							if(st && j==0){
								continue;
							}
							
							for(var m in whichvalname){
								var ind = whichvalname[m];
								if(val[j][ind]!=undefined && val[j][ind]!=null){
									str += val[j][ind]+' ';
								}
								
							}
							if(str!=''){
								str = str.trim();

								break;
							}
						}	
					}				
				});
				$('.customer_address_eg_'+v).html(str);
			}
			
		});
		
		$('select.customer_zip').change(function(){
			var customer_zip  = $(this).val();
	
			var str = '';
			var v = '';
			var whichvalname = [];
			for(var k in alphabet){
				for(var l in customer_zip){
					if(alphabet[k]==customer_zip[l]){
						whichvalname.push(k);
					}
				}
			}
			if($('#which_sheet').length==0){
				$.each(output, function (key, val) {
					v = key;
					for(var j in val){
						var st = $('#customer_ignore').bootstrapSwitch('status');
						
						if(st && j==0){
							continue;
						}
						
						for(var m in whichvalname){
							var ind = whichvalname[m];
							if(val[j][ind]!=undefined && val[j][ind]!=null){
								str += val[j][ind]+' ';
							}
							
						}
						if(str!=''){
							str = str.trim();

							break;
						}
					}					
				});
				$('.customer_zip_eg_'+v).html(str);
			}
			else{
				var v = $('#which_sheet').val();
				var whichvalname = [];
				for(var k in alphabet){
					for(var l in customer_zip){
						if(alphabet[k]==customer_zip[l]){
							whichvalname.push(k);
						}
					}
				}
				$.each(output, function (key, val) {
					var keyid = key.replace(/ /g, '');
					if(v==keyid){
						for(var j in val){
							var st = $('#customer_ignore').bootstrapSwitch('status');
							if(st && j==0){
								continue;
							}
							
							for(var m in whichvalname){
								var ind = whichvalname[m];
								if(val[j][ind]!=undefined && val[j][ind]!=null){
									str += val[j][ind]+' ';
								}
							}
							if(str!=''){
								str = str.trim();
								break;
							}
						}	
					}				
				});
				$('.customer_zip_eg_'+v).html(str);
			}
			
		});

		$('select.customer_city').change(function(){
			var customer_city = $(this).val();

			var str = '';
			var v = '';
			var whichvalname = [];
			for(var k in alphabet){
				for(var l in customer_city){
					if(alphabet[k]==customer_city[l]){
						whichvalname.push(k);
					}
				}
			}
			if($('#which_sheet').length==0){
				$.each(output, function (key, val) {
					v = key;
					for(var j in val){
						var st = $('#customer_ignore').bootstrapSwitch('status');
						
						if(st && j==0){
							continue;
						}	
						for(var m in whichvalname){
							var ind = whichvalname[m];
							if(val[j][ind]!=undefined && val[j][ind]!=null){
								str += val[j][ind]+' ';
							}
						}
						if(str!=''){
							str = str.trim();

							break;
						}
					}					
				});
				$('.customer_city_eg_'+v).html(str);
			}
			else{
				var v = $('#which_sheet').val();
				
				$.each(output, function (key, val) {
					var keyid = key.replace(/ /g, '');
					if(v==keyid){
						for(var j in val){
							var st = $('#customer_ignore').bootstrapSwitch('status');
							
							if(st && j==0){
								continue;
							}
							
							
							for(var m in whichvalname){
								var ind = whichvalname[m];
								if(val[j][ind]!=undefined && val[j][ind]!=null){
									str += val[j][ind]+' ';
								}
								
							}
							if(str!=''){
								str = str.trim();
								break;
							}
						}	
					}				
				});
				$('.customer_city_eg_'+v).html(str);
			}
			
		});

		
		$('.customer_fullname,.customer_address,.customer_zip,.customer_city').select2();
	},
	generateSheet:function(key,val,headers='yes'){
		var ret = '';
		
		var keyid = key.replace(/ /g, '');
		var c = val[0].length;
		var headername = val[0];			

				ret += '<div class="row-fluid">';
					ret += '<div class="control-group">';
						ret += '<label class="control-label"><span class="required">*</span>';
							ret += global_manual_digipost_translations_data.Customerfullname
						ret += '</label>';
						ret += '<div class="controls">';
							ret += '<select name="'+keyid+'" class="m-wrap span6 customer_fullname" id="'+keyid+'"  multiple="multiple">';
								if(headers=='yes'){
									for(j=0;j<headername.length;j++){
										ret += '<option value="'+alphabet[j]+'">';
											ret += headername[j];
										ret += '</option>';
									}
								}
								else{
									for(j=0;j<c;j++){
										ret += '<option value="'+alphabet[j]+'">';
											ret += alphabet[j];
										ret += '</option>';
									}
								}
								
							ret += '</select>';

							ret += '<p class="eg customer_fullname_eg customer_fullname_eg_'+keyid+'"></p>'
						ret += '</div>';
					ret += '</div>';
				ret += '</div>';


				ret += '<div class="row-fluid">';
					ret += '<div class="control-group">';
						ret += '<label class="control-label"><span class="required">*</span>';
							ret += global_manual_digipost_translations_data.Address
						ret += '</label>';
						ret += '<div class="controls">';
							ret += '<select name="'+keyid+'" class="m-wrap span6 customer_address" id="'+keyid+'"  multiple="multiple">';
								if(headers=='yes'){
									for(j=0;j<headername.length;j++){
										ret += '<option value="'+alphabet[j]+'">';
											ret += headername[j];
										ret += '</option>';
									}
								}
								else{
									for(j=0;j<c;j++){
										ret += '<option value="'+alphabet[j]+'">';
											ret += alphabet[j];
										ret += '</option>';
									}
								}
							ret += '</select>';
							ret += '<p class="eg customer_address_eg customer_address_eg_'+keyid+'"></p>'
						ret += '</div>';
					ret += '</div>';
				ret += '</div>';
		
			
				ret += '<div class="row-fluid">';
					ret += '<div class="control-group">';
						ret += '<label class="control-label"><span class="required">*</span>';
							ret += global_manual_digipost_translations_data.Zip
						ret += '</label>';
						ret += '<div class="controls">';
							ret += '<select name="'+keyid+'" class="m-wrap span6 customer_zip" id="'+keyid+'"  multiple="multiple">';
								if(headers=='yes'){
									for(j=0;j<headername.length;j++){
										ret += '<option value="'+alphabet[j]+'">';
											ret += headername[j];
										ret += '</option>';
									}
								}
								else{
									for(j=0;j<c;j++){
										ret += '<option value="'+alphabet[j]+'">';
											ret += alphabet[j];
										ret += '</option>';
									}
								}
							ret += '</select>';
							ret += '<p class="eg customer_zip_eg customer_zip_eg_'+keyid+'"></p>'
						ret += '</div>';
					ret += '</div>';
				ret += '</div>';

			
				ret += '<div class="row-fluid">';
					ret += '<div class="control-group">';
						ret += '<label class="control-label"><span class="required">*</span>';
							ret += global_manual_digipost_translations_data.City
						ret += '</label>';
						ret += '<div class="controls">';
							ret += '<select name="'+keyid+'" class="m-wrap span6 customer_city" id="'+keyid+'"  multiple="multiple">';
								if(headers=='yes'){
									for(j=0;j<headername.length;j++){
										ret += '<option value="'+alphabet[j]+'">';
											ret += headername[j];
										ret += '</option>';
									}
								}
								else{
									for(j=0;j<c;j++){
										ret += '<option value="'+alphabet[j]+'">';
											ret += alphabet[j];
										ret += '</option>';
									}
								}
							ret += '</select>';
							ret += '<p class="eg customer_city_eg customer_city_eg_'+keyid+'"></p>'
						ret += '</div>';
					ret += '</div>';
				ret += '</div>';
		

		return ret;
	},
	validateOne:function(){ 
		if($('#xlsx_file').val()==''){
			var msg = global_manual_digipost_translations_data.Pleaseselectfile;
			showAlertMessage(msg,'error',global_manual_digipost_translations_data.alertmessage);
			return false;
		}
		else{
			if($('#which_sheet').length!=0){
				var which_sheet = $('#which_sheet').val();
				if(which_sheet==''){
					var msg = global_manual_digipost_translations_data.Pleaseselectsheet;
					showAlertMessage(msg,'error',global_manual_digipost_translations_data.alertmessage);
					return false;
				}
			}
			var cust_fname = 0;
			var cust_address = 0;
			var cust_zip = 0;
			var cust_city = 0;

			var error_msg = '';

			$('select.customer_fullname').each(function(){
				var v = $(this).val();
				if(v=='' || v==undefined || v==null){
					cust_fname = 1;
					return false;
				}
			});

			
			$('select.customer_address').each(function(){
				var v = $(this).val();
				if(v=='' || v==undefined || v==null){
					cust_address = 1;
					return false;
				}
			});
			
			$('select.customer_zip').each(function(){
				var v = $(this).val();
				if(v=='' || v==undefined || v==null){
					cust_zip = 1;
					return false;
				}
			});
			
			$('select.customer_city').each(function(){
				var v = $(this).val();
				if(v=='' || v==undefined || v==null){
					cust_city = 1;
					return false;
				}
			});
			

			if(cust_fname!=0){
				error_msg += global_manual_digipost_translations_data.Customerfullname + '<br/>';
			}
			if(cust_address!=0){
				error_msg += global_manual_digipost_translations_data.Address + '<br/>';
			}
			if(cust_zip!=0){
				error_msg += global_manual_digipost_translations_data.Zip + '<br/>';
			}
			if(cust_city!=0){
				error_msg += global_manual_digipost_translations_data.City + '<br/>';
			}
			
			if(error_msg!=''){
				var msg = global_manual_digipost_translations_data.Pleasecheckthefollowingfields;
				msg = msg+':<br/>' + error_msg;
				showAlertMessage(msg,'error',global_manual_digipost_translations_data.alertmessage);
				return false;
			}
		}
	},
	validateTwo:function(){ 
		if($('#pdf_letter').val()==''){
			var msg = global_manual_digipost_translations_data.Pleaseselectfile;
			showAlertMessage(msg,'error',global_manual_digipost_translations_data.alertmessage);
			$('.pdf_file_name').html('');
			return false;
		}
		else{
			var control = document.getElementById("pdf_letter");
		    var files = control.files;
		    for (var i = 0; i < files.length; i++) {
		        if(files[i].type!='application/pdf'){
		        	$('#pdf_letter').val('');
		        	$('.pdf_file_name').html('');
		        	var msg = global_manual_digipost_translations_data.PleaseselectvalidPDFfile;
					showAlertMessage(msg,'error',global_manual_digipost_translations_data.alertmessage);
					return false;
		        }
		    }

		}
	},
	validateThree:function(){
		var d = $('#customerReturnAddress').bootstrapSwitch('status');

		if(d){
			var errmsg = '';
			var name = $('#manual_digipost_template_from #name').val();
			var zip = $('#manual_digipost_template_from #zip').val();
			var city = $('#manual_digipost_template_from #city').val();
			if(name=='' || name==undefined || name==null){
				errmsg += global_manual_digipost_translations_data.Name+'<br/>';
			}
			if(zip=='' || zip==undefined || zip==null){
				errmsg += global_manual_digipost_translations_data.Zip+'<br/>';
			}

			if(city=='' || city==undefined || city==null){
				errmsg += global_manual_digipost_translations_data.City+'<br/>';
			}

			if(errmsg!=''){
				var finalerrmsg = global_manual_digipost_translations_data.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
				showAlertMessage(finalerrmsg,'error',global_manual_digipost_translations_data.AlertMessage);
				return false;
			}
		}
		else{
			if($('#return_address').val()==''){
				var msg = global_manual_digipost_translations_data.Pleasecheckthefollowingfields;
				msg = msg+':<br/>' + global_manual_digipost_translations_data.Returnaddress;
				showAlertMessage(msg,'error',global_manual_digipost_translations_data.alertmessage);
				return false;
			}
		}
		
		
		manual_digipost.saveTodb();
		
		
	},
	to_json:function(workbook){
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
			if(roa.length) result[sheetName] = roa;
		});
		return result;
		return JSON.stringify(result, 2, 2);
	},
	saveTodb:function(){
		showProcessingImage('undefined');
		var finalobj = [];
		var finalhtml = '';
		var return_address = $('#return_address').val();
		$.each(output, function (key, val) {
			var keyid =  key.replace(/ /g, '');
			if( $('#which_sheet').length!=0){
				var which_sheet = $('#which_sheet').val();
				if(keyid!=which_sheet){
					return false;
				}
			}
			var customer_fullname = $('#'+keyid+'.customer_fullname').val();
			var customer_address = $('#'+keyid+'.customer_address').val();
			var customer_zip = $('#'+keyid+'.customer_zip').val();
			var customer_city = $('#'+keyid+'.customer_city').val();
			var ignore_rows = $('#customer_ignore').bootstrapSwitch('status');
			

			var d = $('#customerReturnAddress').bootstrapSwitch('status');
			var ret_addr = {};


			for(var j in val){
				
				if(ignore_rows){
					if(j==0){
						continue;
					}
				}
				//CUSTOMER NAME
				var whichvalname = [];
				for(var k in alphabet){
					for(var l in customer_fullname){
						if(alphabet[k]==customer_fullname[l]){
							whichvalname.push(k);
						}
					}
					
				}
			
				var name = '';
				for(var m in whichvalname){
					var ind = whichvalname[m];
					if(val[j][ind]!=undefined && val[j][ind]!=null){
						name += val[j][ind]+' ';
					}
					
				}
				//CUSTOMER NAME

				//CUSTOMER ADDR
				var whichaddr = [];
				for(var k in alphabet){
					for(var l in customer_address){
						if(alphabet[k]==customer_address[l]){
							whichaddr.push(k);
						}
					}
					
				}
				var addr = '';
				for(var m in whichaddr){
					var ind = whichaddr[m];
					if(val[j][ind]!=undefined && val[j][ind]!=null){
						addr += val[j][ind]+' ';
					}
					
				}
				addr = addr.trim();
				//CUSTOMER ADDR

				//CUSTOMER ZIP
				var whichzip = [];
				for(var k in alphabet){
					for(var l in customer_zip){
						if(alphabet[k]==customer_zip[l]){
							whichzip.push(k);
						}
					}
					
				}
				var zip = '';
				for(var m in whichzip){
					var ind = whichzip[m];
					if(val[j][ind]!=undefined && val[j][ind]!=null){
						zip += val[j][ind]+' ';
					}
				}
				zip = zip.trim();
				//CUSTOMER ZIP

				//CUSTOMER CITY
				var whichcity = [];
				for(var k in alphabet){
					for(var l in customer_city){
						if(alphabet[k]==customer_city[l]){
							whichcity.push(k);
						}
					}
					
				}
				var city = '';
				for(var m in whichcity){
					var ind = whichcity[m];
					if(val[j][ind]!=undefined && val[j][ind]!=null){
						city += val[j][ind]+' ';
					}
					
				}
				city = city.trim();
				//CUSTOMER CITY
				var obj = {};
				if(d){
					var name = $('#manual_digipost_template_from #name').val();
					var zip = $('#manual_digipost_template_from #zip').val();
					var city = $('#manual_digipost_template_from #city').val();
					var address1 = $('#manual_digipost_template_from #address1').val();
					var address2 = $('#manual_digipost_template_from #address2').val();
					
					obj = {
					 	customer_fullname:name,
					 	customer_address:addr,
					 	customer_zip:zip,
					 	customer_city:city,
					 	return_name:name,
						return_zip:zip,
						return_city:city,
						return_address1:address1,
						return_address2:address2,
					};
				}
				else{
					obj = {
					 	customer_fullname:name,
					 	customer_address:addr,
					 	customer_zip:zip,
					 	customer_city:city,
					 	partner_return_address_id:return_address
					};

				}
				
				if(name=='' ||  zip=='' || city==''){
					// || addr=='' ##country based validation here
					console.log('here');
					// console.log(name);
					// console.log(addr);
					// console.log(zip);
					// console.log(city);
				}
				else{
				
					finalobj.push(obj);
				}
				
			}
		});
	console.log(finalobj);
	
		if(output!='' && output!=undefined && output!=null && output.length!=0 ){
			var file = document.querySelector('input[id="pdf_letter"]').files[0];
		   	var reader = new FileReader();
			reader.readAsDataURL(file);
			//reader.readAsArrayBuffer(file);
			reader.onload = function (e) {
				var f = JSON.stringify(finalobj);
			    var total_params = {
					token:token,
					language:language,
					lang:lang,
					partner_id:partner_id,
					admin_id:admin_id,
					finalobj:f,
					pdf:reader.result
				};
				var params = $.extend({}, doAjax_params_default);
				params['url'] = APISERVER+'/api/Commons/saveManualDigipost.json';
				params['data'] = total_params;
				params['completeCallbackFunction'] = function (){
					hideProcessingImage();
				}
				
				params['successCallbackFunction'] = function (complet_data){
					if(complet_data.response.status == 'success'){
						manual_digipost.generateSummary2(complet_data.response.response);
					}
					else if(complet_data.response.status == 'error'){
						if(complet_data.response.response.error == 'validationErrors'){
							var mt_arr = complet_data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error',global_manual_digipost_translations_data.alertmessage);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',global_manual_digipost_translations_data.alertmessage);
							return;
						}	
					}
					
				};

				doAjax(params);
				return false;
		   };
		   reader.onerror = function (error) {
		     console.log('Error: ', error);
		   };
		}
		else{
			hideProcessingImage();
			alert('NO record parsed');
			return false;
		}
	},
	generateSummary2:function(data){

		var finalhtml = '';
		for(var j in data){
			var r = data[j].DigipostManual;
			var s = data[j].PartnerReturnAddress;
			finalhtml += '<tr>';
				finalhtml += '<td>';
					finalhtml += r.customer_fullname;
				finalhtml += '</td>';

				finalhtml += '<td>';
					finalhtml += r.customer_address;
				finalhtml += '</td>';

				finalhtml += '<td>';
					finalhtml += r.customer_zip;
				finalhtml += '</td>';

				finalhtml += '<td>';
					finalhtml +=  r.customer_city;
				finalhtml += '</td>';

				finalhtml += '<td>';
					if(r.partner_return_address_id!=undefined && r.partner_return_address_id!=null && r.partner_return_address_id!=''){
						finalhtml +=  s.name;
						if(s.address1!=null && s.address1!=undefined && s.address1!=''){
							finalhtml +=  '<br/>'+s.address1;
						}
						if(s.address2!=null && s.address2!=undefined && s.address2!=''){
							finalhtml +=  '<br/>'+s.address2;
						}
						if(s.zip!=null && s.zip!=undefined && s.zip!=''){
							finalhtml +=  '<br/>'+s.zip;
						}
						if(s.city!=null && s.city!=undefined && s.city!=''){
							finalhtml +=  ' '+s.city;
						}
						
					}
					else{
						finalhtml +=  r.return_name;
						if(r.return_address1!=null && r.return_address1!=undefined && r.return_address1!=''){
							finalhtml +=  '<br/>'+r.return_address1;
						}
						if(r.return_address2!=null && r.return_address2!=undefined && r.return_address2!=''){
							finalhtml +=  '<br/>'+r.return_address2;
						}
						if(r.return_zip!=null && r.return_zip!=undefined && r.return_zip!=''){
							finalhtml +=  '<br/>'+r.return_zip;
						}
						if(r.return_city!=null && r.return_city!=undefined && r.return_city!=''){
							finalhtml +=  ' '+r.return_city;
						}
						
					}
				finalhtml += '</td>';
			finalhtml += '</tr>';

		}
		var tablehtml = '<table class="table table-striped table-hover table-bordered" id="summaryTable">';
			tablehtml += '<thead>';
				tablehtml += '<tr>';
					tablehtml += '<th>';
						tablehtml += global_manual_digipost_translations_data.Customerfullname;
					tablehtml += '</th>';
					tablehtml += '<th>';
						tablehtml += global_manual_digipost_translations_data.Address;
					tablehtml += '</th>';

					tablehtml += '<th>';
						tablehtml += global_manual_digipost_translations_data.Zip;
					tablehtml += '</th>';

					tablehtml += '<th>';
						tablehtml += global_manual_digipost_translations_data.City;
					tablehtml += '</th>';

					tablehtml += '<th>';
						tablehtml += global_manual_digipost_translations_data.Returnaddress;
					tablehtml += '</th>';

				tablehtml += '</tr>';
			tablehtml += '</thead>';
			tablehtml += '<tbody>';
				tablehtml += finalhtml;
			tablehtml += '</tbody>';
		tablehtml += '</table>';
		if(finalhtml!=''){
			$('#summary_table').html(tablehtml);
			//$('#summaryTable').dataTable();
			$('#summaryTable').dataTable({ 
				
				"aoColumns": [
				  { "bSortable": false },
				  { "bSortable": false },
				  { "bSortable": false },
				  { "bSortable": false },
				  { "bSortable": false },
				],
				"aLengthMenu": [ 10, 25, 50, 100 ],
				//"sDom": "<'row-fluid'<'span6'l><'span6'>r>t<'row-fluid'<'span6'i><'span6'p>>",
				"sDom": "<'row-fluid't><'row-fluid'<'span6'li><'span6'p>>",
				"sPaginationType": "bootstrap",
				"oLanguage": {
					"sLengthMenu": 
			           global_manual_digipost_translations_data.View+ ' <select>'+
			             '<option value="10">10</option>'+
			             '<option value="20">20</option>'+
			            '<option value="30">30</option>'+
			             '<option value="40">40</option>'+
			             '<option value="50">50</option>'+
			             '<option value="-1">All</option>'+
			             '</select> '+ global_manual_digipost_translations_data.records
			         ,
					"oPaginate": {
						"sPrevious": global_manual_digipost_translations_data.prev,
						"sNext": global_manual_digipost_translations_data.next
					},
					"sInfo": global_manual_digipost_translations_data.Foundtotal+" _TOTAL_ "+global_manual_digipost_translations_data.records
				}
			});
			w.bootstrapWizard('last');
			var total = $('#manual_digipost_form_wizard .steps ul li').length;
			$('.step-title', $('#manual_digipost_template_from')).text(global_manual_digipost_translations_data.Step+' ' +'1 '+global_manual_digipost_translations_data.of+' ' + total);
			$('.button-next,.button-previous').addClass('hide');
			$('.btn_dis,.btn_app').removeClass('hide');
			return true;
		}
	},
	updateManualDigipostStatus:function(status=1){
		showProcessingImage('undefined');

		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			status:status
		};
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/updateManualDigipostStatus.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		}
		
		params['successCallbackFunction'] = function (complet_data){
			if(complet_data.response.status == 'success'){
				if(status==1){
					call_toastr(global_manual_digipost_translations_data.success, global_manual_digipost_translations_data.Success,global_manual_digipost_translations_data.Manualdigipostprocessedsuccessfully);
				}
				else{
					call_toastr(global_manual_digipost_translations_data.success, global_manual_digipost_translations_data.Success,global_manual_digipost_translations_data.Manualdigipostdeletedsuccessfully);
				}
				$('#xlsx_file,#return_address,#pdf_letter,#name,#zip,#city,#address1,#address2').val('');
				$('#sheets').html('');
				output = "";
				w.bootstrapWizard('first');
				$('#summary_table').html('');
				$('.button-next').removeClass('hide');
				$('.btn_dis,.btn_app,#btn_count').addClass('hide');
				$('#sheets_select,#sheets_headers,.excel_file_name,.pdf_file_name').html('');
				$('#return_address').val('').trigger('change');
				$('#name,#address1,#address2,#zip,#city').val('');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',global_manual_digipost_translations_data.alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',global_manual_digipost_translations_data.alertmessage);
					return;
				}	
			}
		};
		doAjax(params);
		return false;

	},
	listenForData:function(){
		(function($) {
			var bootstrapWizardCreate = function(element, options) {
				var element = $(element);
				var obj = this;

				// Merge options with defaults
				//var $settings = $.extend($.fn.bootstrapWizard.defaults, options || {});
				var $settings = $.extend({}, $.fn.bootstrapWizard.defaults, options);
				var $activeTab = null;
				var $navigation = null;

				this.fixNavigationButtons = function() {
					// Get the current active tab
					if(!$activeTab.length) {
						// Select first one
						$navigation.find('a:first').tab('show');
						$activeTab = $navigation.find('li:first');
					}

					// See if we're currently in the first/last then disable the previous and last buttons
					if(obj.firstIndex() >= obj.currentIndex()) {
						$('li.previous', element).addClass('disabled');
					} else{
						$('li.previous', element).removeClass('disabled');
					}

					if(obj.currentIndex() >= obj.navigationLength()) {
						$('li.next', element).addClass('disabled');
					} else {
						$('li.next', element).removeClass('disabled');
					}

					if($settings.onTabShow && typeof $settings.onTabShow === 'function' && $settings.onTabShow($activeTab, $navigation, obj.currentIndex())===false){
						return false;
					}
				};

				this.next = function(e) {

					// If we clicked the last then dont activate this
					if(element.hasClass('last')) {
						return false;
					}


					if($settings.beforeNext && typeof $settings.beforeNext === 'function' && $settings.beforeNext($activeTab, $navigation, obj.nextIndex())===false){
						return false;
					}
					if($settings.onNext && typeof $settings.onNext === 'function' && $settings.onNext($activeTab, $navigation, obj.nextIndex())===false){
						return false;
					}
					

					// Did we click the last button
					$index = obj.nextIndex();
					if($index > obj.navigationLength()) {
					} else {
						$navigation.find('li:eq('+$index+') a').tab('show');
					}
				};

				this.previous = function(e) {

					// If we clicked the first then dont activate this
					if(element.hasClass('first')) {
						return false;
					}

					if($settings.beforePrevious && typeof $settings.beforePrevious === 'function' && $settings.beforePrevious($activeTab, $navigation, obj.previousIndex())===false){
						return false;
					}

					if($settings.onPrevious && typeof $settings.onPrevious === 'function' && $settings.onPrevious($activeTab, $navigation, obj.previousIndex())===false){
						return false;
					}

					$index = obj.previousIndex();
					if($index < 0) {
					} else {
						$navigation.find('li:eq('+$index+') a').tab('show');
					}
				};

				this.first = function(e) {
					if($settings.onFirst && typeof $settings.onFirst === 'function' && $settings.onFirst($activeTab, $navigation, obj.firstIndex())===false){
						return false;
					}

					// If the element is disabled then we won't do anything
					if(element.hasClass('disabled')) {
						return false;
					}
					$navigation.find('li:eq(0) a').tab('show');

				};
				this.last = function(e) {
					if($settings.onLast && typeof $settings.onLast === 'function' && $settings.onLast($activeTab, $navigation, obj.lastIndex())===false){
						return false;
					}

					// If the element is disabled then we won't do anything
					if(element.hasClass('disabled')) {
						return false;
					}
					$navigation.find('li:eq('+obj.navigationLength()+') a').tab('show');
				};
				this.currentIndex = function() {
					return $navigation.find('li').index($activeTab);
				};
				this.firstIndex = function() {
					return 0;
				};
				this.lastIndex = function() {
					return obj.navigationLength();
				};
				this.getIndex = function(e) {
					return $navigation.find('li').index(e);
				};
				this.nextIndex = function() {
					return $navigation.find('li').index($activeTab) + 1;
				};
				this.previousIndex = function() {
					return $navigation.find('li').index($activeTab) - 1;
				};
				this.navigationLength = function() {
					return $navigation.find('li').length - 1;
				};
				this.activeTab = function() {
					return $activeTab;
				};
				this.nextTab = function() {
					return $navigation.find('li:eq('+(obj.currentIndex()+1)+')').length ? $navigation.find('li:eq('+(obj.currentIndex()+1)+')') : null;
				};
				this.previousTab = function() {
					if(obj.currentIndex() <= 0) {
						return null;
					}
					return $navigation.find('li:eq('+parseInt(obj.currentIndex()-1)+')');
				};
				this.show = function(index) {
					return element.find('li:eq(' + index + ') a').tab('show');
				};

				$navigation = element.find('ul:first', element);
				$activeTab = $navigation.find('li.active', element);

				if(!$navigation.hasClass($settings.tabClass)) {
					$navigation.addClass($settings.tabClass);
				}

				// Load onInit
				if($settings.onInit && typeof $settings.onInit === 'function'){
					$settings.onInit($activeTab, $navigation, 0);
				}

				// Next/Previous events
				$($settings.nextSelector, element).bind('click', obj.next);
				$($settings.previousSelector, element).bind('click', obj.previous);
				$($settings.lastSelector, element).bind('click', obj.last);
				$($settings.firstSelector, element).bind('click', obj.first);

				// Load onShow
				if($settings.onShow && typeof $settings.onShow === 'function'){
					$settings.onShow($activeTab, $navigation, obj.nextIndex());
				}

				// Work the next/previous buttons
				obj.fixNavigationButtons();

				$('a[data-toggle="tab"]', element).on('click', function (e) {
					if($settings.onTabClick && typeof $settings.onTabClick === 'function' && $settings.onTabClick($activeTab, $navigation, obj.currentIndex())===false){
						return false;
					}
				});

				$('a[data-toggle="tab"]', element).on('show', function (e) {
					$element = $(e.target).parent();
					// If it's disabled then do not change
					if($element.hasClass('disabled')) {
						return false;
					}

					$activeTab = $element; // activated tab
					obj.fixNavigationButtons();

				});
			};
			$.fn.bootstrapWizard = function(options) {
				//expose methods
				if (typeof options == 'string') {
					var args = Array.prototype.slice.call(arguments, 1).toString();
					return this.data('bootstrapWizard')[options](args);
				}
				return this.each(function(index){
					var element = $(this);
					// Return early if this element already has a plugin instance
					if (element.data('bootstrapWizard')) return;
					// pass options to plugin constructor
					var wizard = new bootstrapWizardCreate(element, options);
					// Store plugin object in this element's data
					element.data('bootstrapWizard', wizard);
				});
			};

			// expose options
			$.fn.bootstrapWizard.defaults = {
				'tabClass':         'nav nav-pills',
				'nextSelector':     '.wizard li.next',
				'previousSelector': '.wizard li.previous',
				'firstSelector':    '.wizard li.first',
				'lastSelector':     '.wizard li.last',
				'onShow':           null,
				'onInit':           null,
				'onNext':           null,
				'onPrevious':       null,
				'onLast':           null,
				'onFirst':          null,
				'onTabClick':       null,
				'onTabShow':        null
			};
		})(jQuery);
	},
	generateRetAddrList:function(data,from=''){

		var ret = '';
		ret += '<option value="'+data.id+'">';
			ret += data.name;
		ret += '</option>';
		if(from=='append'){
			
			global_manual_digipost_data.partnerReturnAddress.push(data);
			var newOption = new Option(data.name, data.id, true, true);
			
			$('#return_address').append(newOption).trigger('change');
			setTimeout(function(){
				//$('#return_address').val(data.id).trigger('change');
			},100);
			//trigger('change');
			//val(data.id).trigger('change');
		}
		return  ret;
	}
}


Template7.registerHelper('partnerRetAddrListHelper', function (data){
	return manual_digipost.generateRetAddrList(data);
});

