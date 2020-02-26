/*
A simple jQuery function that can add listeners on attribute change.
http://meetselva.github.io/attrchange/

About License:
Copyright (C) 2013-2014 Selvakumar Arumugam
You may use attrchange plugin under the terms of the MIT Licese.
https://github.com/meetselva/attrchange/blob/master/MIT-License.txt
 */
(function($) {
	function isDOMAttrModifiedSupported() {
		var p = document.createElement('p');
		var flag = false;

		if (p.addEventListener) {
			p.addEventListener('DOMAttrModified', function() {
				flag = true
			}, false);
		} else if (p.attachEvent) {
			p.attachEvent('onDOMAttrModified', function() {
				flag = true
			});
		} else { return false; }
		p.setAttribute('id', 'target');
		return flag;
	}

	function checkAttributes(chkAttr, e) {
		if (chkAttr) {
			var attributes = this.data('attr-old-value');

			if (e.attributeName.indexOf('style') >= 0) {
				if (!attributes['style'])
					attributes['style'] = {}; //initialize
				var keys = e.attributeName.split('.');
				e.attributeName = keys[0];
				e.oldValue = attributes['style'][keys[1]]; //old value
				e.newValue = keys[1] + ':'
						+ this.prop("style")[$.camelCase(keys[1])]; //new value
				attributes['style'][keys[1]] = e.newValue;
			} else {
				e.oldValue = attributes[e.attributeName];
				e.newValue = this.attr(e.attributeName);
				attributes[e.attributeName] = e.newValue;
			}

			this.data('attr-old-value', attributes); //update the old value object
		}
	}

	//initialize Mutation Observer
	var MutationObserver = window.MutationObserver
			|| window.WebKitMutationObserver;

	$.fn.attrchange = function(a, b) {
		if (typeof a == 'object') {//core
			var cfg = {
				trackValues : false,
				callback : $.noop
			};
			//backward compatibility
			if (typeof a === "function") { cfg.callback = a; } else { $.extend(cfg, a); }

			if (cfg.trackValues) { //get attributes old value
				this.each(function(i, el) {
					var attributes = {};
					for ( var attr, i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
						attr = attrs.item(i);
						attributes[attr.nodeName] = attr.value;
					}
					$(this).data('attr-old-value', attributes);
				});
			}

			if (MutationObserver) { //Modern Browsers supporting MutationObserver
				var mOptions = {
					subtree : false,
					attributes : true,
					attributeOldValue : cfg.trackValues
				};
				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(e) {
						var _this = e.target;
						//get new value if trackValues is true
						if (cfg.trackValues) {							
							e.newValue = $(_this).attr(e.attributeName);
						}						
						if ($(_this).data('attrchange-status') === 'connected') { //execute if connected
							cfg.callback.call(_this, e);
						}
					});
				});

				return this.data('attrchange-method', 'Mutation Observer').data('attrchange-status', 'connected')
						.data('attrchange-obs', observer).each(function() {
							observer.observe(this, mOptions);
						});
			} else if (isDOMAttrModifiedSupported()) { //Opera
				//Good old Mutation Events
				return this.data('attrchange-method', 'DOMAttrModified').data('attrchange-status', 'connected').on('DOMAttrModified', function(event) {
					if (event.originalEvent) { event = event.originalEvent; }//jQuery normalization is not required 
					event.attributeName = event.attrName; //property names to be consistent with MutationObserver
					event.oldValue = event.prevValue; //property names to be consistent with MutationObserver
					if ($(this).data('attrchange-status') === 'connected') { //disconnected logically
						cfg.callback.call(this, event);
					}
				});
			} else if ('onpropertychange' in document.body) { //works only in IE		
				return this.data('attrchange-method', 'propertychange').data('attrchange-status', 'connected').on('propertychange', function(e) {
					e.attributeName = window.event.propertyName;
					//to set the attr old value
					checkAttributes.call($(this), cfg.trackValues, e);
					if ($(this).data('attrchange-status') === 'connected') { //disconnected logically
						cfg.callback.call(this, e);
					}
				});
			}
			return this;
		} else if (typeof a == 'string' && $.fn.attrchange.hasOwnProperty('extensions') &&
				$.fn.attrchange['extensions'].hasOwnProperty(a)) { //extensions/options
			return $.fn.attrchange['extensions'][a].call(this, b);
		}
	}
})(jQuery);
function RegisterKo(uniq_id,temp){

	ko.components.register(uniq_id, {
	viewModel: {
		createViewModel: function (controller, componentInfo) {
			var ViewModel = function (controller, componentInfo) {
				var grid = null;

				this.widgets = controller.widgets;

				this.afterAddWidget = function (items) {
					if (grid == null) {
						grid = $(componentInfo.element).find('.grid-stack').gridstack({
							auto: false,
							float: true
						}).data('gridstack');
					}

					var item = _.find(items, function (i) { return i.nodeType == 1 });
					grid.addWidget(item);
					ko.utils.domNodeDisposal.addDisposeCallback(item, function () {
						grid.removeWidget(item);
					});
				};
			};
			return new ViewModel(controller, componentInfo);
		}
	},
	template: { element: temp }
	});
}

function dataShowWidget(widgets){
	
	var Controller = function (widgets) {
		var self = this;
		
		this.widgets = ko.observableArray(widgets);
	};
	
	var koNode = document.getElementById("grid_stack_data1");
	ko.cleanNode(koNode);
	var controller = new Controller(widgets);
	ko.applyBindings(controller,koNode);
}
var min_size = $('#min_size').val();
var cur_size = $('#cur_size').val();
var pls_sel_blk = $('#pls_sel_blk').val();
var alr_msg = $('#alr_msg').val();
var dshbrd_suc = $('#dshbrd_suc').val();
var dshbrd_succ = $('#dshbrd_succ').val();
var lose_msg = $('#lose_msg').val();

var dash_war = $('#dash_war').val();
var dash_del = $('#dash_del').val();
var dash_staff_id = $('#dash_staff_id').val();
var dash_plan_id = $('#dash_plan_id').val();
var cust_dhbrd_setting= $('#cust_dhbrd_setting').val();

var base_url = $('#BASE_URL').val();
var dash_cancel = $('#dash_cancel').val();
var dash_showPlanData = $('#dash_showPlanData').val();

var dash_type = $("#dash_type").val();
var dash_start = $('#dash_start').val();
var dash_end = $('#dash_end').val();
var dash_week = $('#dash_week').val();
var dash_today = $('#dash_today').val();
var dash_month = $('#dash_month').val();
var dash_day = $('#dash_day').val();





var dash_default_task_inspection_min = $('#dash_default_task_inspection_min').val();
if(dash_default_task_inspection_min!='' && dash_default_task_inspection_min!=undefined && dash_default_task_inspection_min!=null && dash_default_task_inspection_min!=0){
	var default_task_inspection_min = dash_default_task_inspection_min;
}
else{
	var default_task_inspection_min = 60;
}
		

function loadGrid(gridId){
	if(gridId != '' && gridId != undefined){

		var grid_id = $('#ui_draggable_'+gridId).attr('data-gs-id');
		var grid_x = $('#ui_draggable_'+gridId).attr('data-gs-x');
		var grid_y = $('#ui_draggable_'+gridId).attr('data-gs-y');

		if($('#ui_draggable_'+gridId).length > 0){
			$('#ui_draggable_'+gridId).attr('data-gs-unique-id',grid_id+grid_x+grid_y);
			$('#ui_draggable_'+gridId).attr('id','ui_draggable_'+grid_id+grid_x+grid_y);
		}
		var width = $('#ui_draggable_'+grid_id+grid_x+grid_y).attr('data-gs-width');
		var height = $('#ui_draggable_'+grid_id+grid_x+grid_y).attr('data-gs-height');
		$('#ui_draggable_'+grid_id+grid_x+grid_y+' #width_'+grid_id).html(width);
		$('#ui_draggable_'+grid_id+grid_x+grid_y+' #height_'+grid_id).html(height);
		$('.popovers').popover('destroy');
		var html = '';
		var text = $('#ui_draggable_'+grid_id+grid_x+grid_y);
		html += cur_size+' : '+text.attr('data-gs-width')+' * '+text.attr('data-gs-height')+'<br />';
		
		html += min_size+' : '+text.attr('data-gs-min-width')+' * '+text.attr('data-gs-min-height');
		$('#ui_draggable_'+grid_id+grid_x+grid_y+' .grid-stack-item-content').attr('data-content',html);
		$('#ui_draggable_'+grid_id+grid_x+grid_y+' .popovers').popover('show');
	}else{
		var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
			el = $(el);
			var node = el.data('_gridstack_node');
			var grid_x = $('#ui_draggable_'+el.attr('data-gs-id')+'10').attr('data-gs-x');
			var grid_y = $('#ui_draggable_'+el.attr('data-gs-id')+'10').attr('data-gs-y');
			if($('#ui_draggable_'+el.attr('data-gs-id')+'10').length > 0){
				$('#ui_draggable_'+el.attr('data-gs-id')+'10').attr('data-gs-unique-id',el.attr('data-gs-id')+grid_x+grid_y);
				$('#ui_draggable_'+el.attr('data-gs-id')+'10').attr('id','ui_draggable_'+el.attr('data-gs-id')+grid_x+grid_y);
			}
			$('#ui_draggable_'+el.attr('data-gs-id')+node.x+node.y+' #width_'+el.attr('data-gs-id')).html(node.width);
			$('#ui_draggable_'+el.attr('data-gs-id')+node.x+node.y+' #height_'+el.attr('data-gs-id')).html(node.height);
			
			$('.popovers').popover('destroy');
			var html = '';
			html += cur_size+' : '+el.attr('data-gs-width')+' * '+el.attr('data-gs-height')+'<br />';
			html += min_size+' : '+el.attr('data-gs-min-width')+' * '+el.attr('data-gs-min-height');
			$('#ui_draggable_'+el.attr('data-gs-id')+grid_x+grid_y+' .grid-stack-item-content').attr('data-content',html);
			$('.popovers').popover('show');
		});
	}
}

function loadmouseData(gridId){
	if(gridId != '' && gridId != undefined){
		$('#ui_draggable_'+gridId+' .grid-stack-item-content')
		.mouseover(function() {
			$(this).popover('destroy');
			var html = '';
			html += cur_size+' : '+$('#ui_draggable_'+gridId).attr('data-gs-width')+' * '+$('#ui_draggable_'+gridId).attr('data-gs-height')+'<br />';
			html += min_size+' : '+$('#ui_draggable_'+gridId).attr('data-gs-min-width')+' * '+$('#ui_draggable_'+gridId).attr('data-gs-min-height');
			$(this).attr('data-content',html);
			$(this).addClass("mouseover");
		})
		.mouseout(function() {
			$(this).popover('destroy');
			$(this).removeClass("mouseover");
		});
	}else{
		var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
			el = $(el);
			var node = el.data('_gridstack_node');
			$('#ui_draggable_'+el.attr('data-gs-id')+node.x+node.y+' .grid-stack-item-content')
			.mouseover(function() {
				$(this).popover('destroy');
				var html = '';
				html += cur_size+' : '+el.attr('data-gs-width')+' * '+el.attr('data-gs-height')+'<br />';
				html += min_size+' : '+el.attr('data-gs-min-width')+' * '+el.attr('data-gs-min-height');
				$(this).attr('data-content',html);
				$(this).addClass("mouseover");
			})
			.mouseout(function() {
				$(this).popover('destroy');
				$(this).removeClass("mouseover");
			});
		});
	}
}

function dataWidget(widgets){
							
	var Controller = function (widgets) {
		var self = this;
		
		this.widgets = ko.observableArray(widgets);
	   
		this.addNewWidget = function () {
		   var item = '';	
		   var indexVal = $('#save_sales_data').val();
		   if(indexVal == ''){
				var indexVal = $("#indexText").val();
				if(indexVal == 0){
					showAlertMessage(pls_sel_blk,'error',alr_msg);
					return;
				}
				if(indexVal != ''){
				  indexText = indexVal.split('###');	
				}
				var original_data = $('#delete_original_data').val();		
		   }else{
				indexText = indexVal.split('###');
				var other_data = $('#other_sales_data').val();
				var original_data = $('#delete_original_data').val();
				var title = $('#show_dashboard_title').val();
				var fonts_data = $('#show_dashboard_font').val();
				if(fonts_data != undefined){
					var fonts = fonts_data.split('###');				
				}
		   }	
		   var new_data_url = '';
		   if(indexText[1] == 'Sales document' || indexText[1] == 'Payments' || indexText[1] == 'Tasks' || indexText[1] == 'Account' || indexText[1] == 'Slips' || indexText[1] == 'Customers' || indexText[1] == 'Date and time' || indexText[1] == 'Todo' || indexText[1] == 'Personal note'){
				var data_url = $('#add_dashboard_block_content').attr('data-url');
				var task_data = data_url.indexOf("Tasks");
				var sales_data = data_url.indexOf("Sales document");
				var payment_data = data_url.indexOf("Payments");
				var account_data = data_url.indexOf("Account");
				var slips_data = data_url.indexOf("Slips");
				var customers_data = data_url.indexOf("Customers");
				var date_time_block = data_url.indexOf("Date and time");
				var todo_block = data_url.indexOf("Todo");
				var personal_note_block = data_url.indexOf("Personal note");

				if(sales_data != -1){
					data_url = data_url.slice(0,-17);
				}
				if(task_data != -1){
					data_url = data_url.slice(0,-9);
				}
				if(payment_data != -1){
					data_url = data_url.slice(0,-12);
				}
				if(account_data != -1){
					data_url = data_url.slice(0,-11);
				}
				if(slips_data != -1){
					data_url = data_url.slice(0,-9);
				}
				if(customers_data != -1){
					data_url = data_url.slice(0,-13);
				}
				if(date_time_block != -1){
					data_url = data_url.slice(0,-17);
				}
				if(todo_block != -1){
					data_url = data_url.slice(0,-8);
				}
				if(personal_note_block != -1){
					data_url = data_url.slice(0,-17);
				}
				console.log('data_url',data_url);

				var block_id = data_url.indexOf(indexText[0]);
				var block = data_url.indexOf(indexText[1]);
				if(block_id == -1 && block == -1){
					new_data_url = data_url+'/'+indexText[0]+'/'+indexText[1];
				}else{
					new_data_url = data_url;
				}
				$('#add_dashboard_block_content').attr('data-url',new_data_url);
				$('#add_dashboard_block_content').click();
		   }else{
				if(indexText[1] == 'Task'){
					indexText[1] = 'Tasks';	
				}else if(indexText[1] == 'Payment'){
					indexText[1] = 'Payments';	
				}else if(indexText[1] == 'Acc'){
					indexText[1] = 'Account';	
				}else if(indexText[1] == 'Slip'){
					indexText[1] = 'Slips';	
				}else if(indexText[1] == 'Customer'){
					indexText[1] = 'Customers';	
				}else if(indexText[1] == 'DT'){
					indexText[1] = 'Date and time';
				}else if(indexText[1] == 'Todos'){
					indexText[1] = 'Todo';
				}else if(indexText[1] == 'Personal notes'){
					indexText[1] = 'Personal note';
				}
				if(original_data != ''){
					var item = JSON.parse(original_data);
					
					var resData = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
						el = $(el);
						var node = el.data('_gridstack_node');
						return {
							id: el.attr('data-gs-id'),
							x: node.x,
							y: node.y,
							width: node.width,
							height: node.height,
							value: el.attr('data-gs-value'),
							min_width: el.attr('data-gs-min-width'),
							min_height: el.attr('data-gs-min-height'),
							content: el.attr('data-gs-content'),
							show_content: el.attr('data-gs-show-content'),
							title : el.attr('data-gs-title'),
							line1_font : el.attr('data-gs-font1'),
							line2_font : el.attr('data-gs-font2'),
						};
					});
					
					var unique_id = item.id+''+item.x+''+item.y;
					var uni_id = '';
					for (var i =0; i < resData.length; i++){
						if (resData[i].id+''+resData[i].x+''+resData[i].y+''+resData[i].value === item.id+''+item.x+''+item.y+''+item.value) {
							var $box = $('.grid-stack-item[data-gs-unique-id="' + unique_id + '"]');
							uni_id = indexText[0]+''+item.x+''+item.y;
							$box.attr('data-gs-id',indexText[0]);
							$box.attr('data-gs-value',indexText[1]);
							$box.attr('data-gs-content',indexText[4]);
							$box.attr('data-gs-show-content',other_data);
							$box.attr('data-gs-min-width',indexText[2]);
							$box.attr('data-gs-min-height',indexText[3]);
							$box.attr('data-gs-x',item.x);
							$box.attr('data-gs-y',item.y);
							$box.attr('data-gs-x',item.width);
							$box.attr('data-gs-width',item.width);
							$box.attr('data-gs-height',item.height);
							$box.attr('id','ui_draggable_'+uni_id);
							$box.find('.grid_width').attr('id','width_'+indexText[0]);
							$box.find('.grid_height').attr('id','height_'+indexText[0]);
							$box.find('.grid_width').html(item.width);
							$box.find('.grid_height').html(item.height);
							$box.find('.grid_min_width').html(indexText[2]);
							$box.find('.grid_min_height').html(indexText[3]);
							$box.find('.grid_content').html(indexText[4]);
							$box.attr('data-gs-unique-id',uni_id);
							$box.attr('data-gs-title',title);
							if(fonts == undefined){
								var line1_font =  'medium';
								var line2_font =  'medium';
							}else{
								var line1_font =  fonts[0];
								var line2_font =  fonts[1];
							}
							$box.attr('data-gs-font1',line1_font);
							$box.attr('data-gs-font2',line2_font);
						}
					}
					
					$('#save_sales_data').val('');
					$('#other_sales_data').val('');
					$('#delete_original_data').val('');
					$('#show_dashboard_title').val('');
					$('#show_dashboard_font').val('');
					 
					var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
						el = $(el);
						var node = el.data('_gridstack_node');
						return {
							id: el.attr('data-gs-id'),
							x: node.x,
							y: node.y,
							width: node.width,
							height: node.height,
							value: el.attr('data-gs-value'),
							min_width: el.attr('data-gs-min-width'),
							min_height: el.attr('data-gs-min-height'),
							content: el.attr('data-gs-content'),
							show_content: el.attr('data-gs-show-content'),
							title : el.attr('data-gs-title'),
							line1_font : el.attr('data-gs-font1'),
							line2_font : el.attr('data-gs-font2'),
						};
				  });
				  var resStr = JSON.stringify(res);
				 
				  var APISERVER = $('#APISERVER').val();
				  var token = $('#token').val();
				  var language = $('#language').val();
				  var lang = $('#lang').val();
				  var partner_id = $('#partner_id').val();
				  
				   var plan_id = dash_plan_id
				   var staff_id = dash_staff_id;
				   var partner_type = dash_type;
				   var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&plan_id='+plan_id+'&block_data='+resStr+'&staff_id='+staff_id+'&partner_type='+partner_type;	
				   //console.log(JSON.parse(resStr)); return;
				   var complet_data = passProdRequest(APISERVER+'/api/dashboards/saveBlockData.json',total_params);
					if(complet_data == undefined){
						var json_data = $('#json_data').val();
						var complet_data = JSON.parse(json_data);
						complet_data.response.status = is_undefined(complet_data.response.status);
						if(complet_data.response.status == 'success'){
							var block_id = is_undefined(complet_data.response.response.block_id);
							var successMessage = is_undefined(complet_data.response.response.message.msg);
							if(block_id != ''){
								call_toastr('success',dshbrd_suc, dshbrd_succ);
								dataWidget(res);
								loadGrid();	
							}
						}else if(complet_data.response.status == 'error'){
							if(complet_data.response.response.error == 'validationErrors'){
								var mt_arr = complet_data.response.response.list;
								var array = $.map(mt_arr, function(value, index) {
									return value+'<br />';
								});
								showAlertMessage(array,'error',alr_msg);
								return;
							}else{
								showAlertMessage(complet_data.response.response.msg,'error',alr_msg);
								return;
							}	
						}
					}
					return false;		
				}else{
					if(title == undefined)
						title = '';
					if(fonts == undefined){
						var line1_font =  'medium';
						var line2_font =  'medium';
					}else{
						var line1_font =  fonts[0];
						var line2_font =  fonts[1];
					}	
					this.widgets.push({
						id: indexText[0],
						x: 1,
						y: 0,
						width: Math.floor(1 + 3 * Math.random()),
						height: Math.floor(1 + 3 * Math.random()),
						value: indexText[1],
						min_width: indexText[2],
						min_height: indexText[3],
						content: indexText[4],
						auto_position: true,
						show_content : other_data,
						title : title,
						line1_font : line1_font,
						line2_font : line2_font, 
					});
					$('#save_sales_data').val('');
					$('#other_sales_data').val('');
					$('#delete_original_data').val('');
					$('#show_dashboard_title').val('');
					$('#show_dashboard_font').val('');
					return false;	
				}
		   }
		};
		
		this.editWidget = function (item) {
			var plan_id = dash_plan_id;
			var data_url = $('#edit_dashboard_block_content').attr('data-url');
			if(data_url.indexOf(plan_id) != -1){
				data_url = $('#edit_only_dashboard_block_content').attr('data-url');
			}
			
			var unique_id = item.id+''+item.x+''+item.y;
			var block_id = data_url.indexOf('/'+plan_id+'/'+item.id+'/'+' '+'/'+unique_id);
			if(block_id == -1){
				new_data_url = data_url+'/'+plan_id+'/'+item.id+'/'+' '+'/'+unique_id;
			}
		   
		   $('#delete_original_data').val(JSON.stringify(item));	
		   $('#edit_dashboard_block_content').attr('data-url',new_data_url);
		   $('#edit_dashboard_block_content').click();
		   
		};

		this.deleteWidget = function (item) {
			var confirm_msg = $('#confirm_msg').val();	
			var title = $('#confirm_title').val();
			$("#bkengine_alert_box" ).html(confirm_msg);
			$("#bkengine_alert_box" ).dialog({
			  dialogClass: 'ui-dialog-blue',
			  modal: true,
			  title:title,
			  resizable: false,
			  height: 200,
			  //width: 380,
			  modal: true,
			  buttons: [
				{
					'class' : 'btn green',
					'id' : 'acceptbtntext',	
					"text" : $('#ok_value').val(),
					click: function() {
						$(this).dialog( "close" );
						self.widgets.remove(item);
						var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
						el = $(el);
						var node = el.data('_gridstack_node');
						return {
							id: el.attr('data-gs-id'),
							x: node.x,
							y: node.y,
							width: node.width,
							height: node.height,
							value: el.attr('data-gs-value'),
							min_width: el.attr('data-gs-min-width'),
							min_height: el.attr('data-gs-min-height'),
							content: el.attr('data-gs-content'),
							show_content: el.attr('data-gs-show-content'),
							title: el.attr('data-gs-title'),
							line1_font : el.attr('data-gs-font1'),
							line2_font : el.attr('data-gs-font2'),
						};
					  });
					  var resStr = JSON.stringify(res);
					  //alert(resStr);
					  var APISERVER = $('#APISERVER').val();
					  var token = $('#token').val();
					  var language = $('#language').val();
					  var lang = $('#lang').val();
					  var partner_id = $('#partner_id').val();
					  
					   var plan_id = dash_plan_id;
					   var staff_id = dash_staff_id;
					   var partner_type = dash_type;
					   var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&plan_id='+plan_id+'&block_data='+resStr+'&staff_id='+staff_id+'&partner_type='+partner_type;
				
						var complet_data = passProdRequest(APISERVER+'/api/dashboards/saveBlockData.json',total_params);
						if(complet_data == undefined){
							var json_data = $('#json_data').val();
							var complet_data = JSON.parse(json_data);
							complet_data.response.status = is_undefined(complet_data.response.status);
							if(complet_data.response.status == 'success'){
								var block_id = is_undefined(complet_data.response.response.block_id);
								var successMessage = is_undefined(complet_data.response.response.message.msg);
								if(block_id != ''){
									call_toastr('success', dshbrd_suc, successMessage);
								}
							}else if(complet_data.response.status == 'error'){
								if(complet_data.response.response.error == 'validationErrors'){
									var mt_arr = complet_data.response.response.list;
									var array = $.map(mt_arr, function(value, index) {
										return value+'<br />';
									});
									showAlertMessage(array,'error',alr_msg);
									return;
								}else{
									showAlertMessage(complet_data.response.response.msg,'error',alr_msg);
									return;
								}	
							}
						}
						return false;
					}
				},
				{
					'class' : 'btn',
					'id' : 'cancelbtntext',
					"text" : $('#cancel_value').val(),
					click: function() {
						$(this).dialog( "close" );
					}
				}
			  ]
			});	
		};
	};

	var koNode = document.getElementById("grid_stack_data");
	ko.cleanNode(koNode);
	var controller = new Controller(widgets);
	ko.applyBindings(controller,koNode);
}

$(document).ready(function() {  
 	if($("#options").val()=='y'){
		$('#btn_options').click();
  	}
   	else if($("#options").val()=='n'){
		$('#btn_other_options').click();
   	}
   
   	$('#edit_dashboard_data').click(function(){
		$('#show_dashboard_data').hide();
		$('#show_partner_dashboard_data').hide();
		$('#hide_dashboard_data').show();
		$('#show_only_dashboard_data').show();
	});

	$('#btn_cancel').click(function(){
		$('#partner_calendar .fc-view.fc-month-view.fc-basic-view').css('margin-top','auto')
		$('#show_dashboard_data').show();
		$('#show_partner_dashboard_data').show();
		$('#hide_dashboard_data').hide();
		$('#show_only_dashboard_data').hide();

		$('#partner_calendar .fc-view.fc-month-view.fc-basic-view').css('margin-top','-10px')
		
	});

	$('#reset_dashboard_data').click(function(){
	    var confiem_msg;
		confiem_msg = lose_msg;	
		title = dash_war;
		$("#bkengine_alert_box" ).html(confiem_msg);
		$("#bkengine_alert_box" ).dialog({
		  dialogClass: 'ui-dialog-blue',
		  modal: true,
		  title:title,
		  resizable: false,
		  height: 200,
		  //width: 380,
		  modal: true,
		  buttons: [
			{
				'class' : 'btn red',
				'id' : 'acceptbtntext',	
				"text" : dash_del,
				click: function() {
					$(this).dialog( "close" );
					document.getElementById('hiddenCustomerImg').style.visibility = 'unset';
					var APISERVER = $('#APISERVER').val();
					var token = $('#token').val();
					var language = $('#language').val();
					var lang = $('#lang').val();
					var partner_id = $('#partner_id').val();
					
					var total_params = {
						token:token,
						language:language,
						lang:lang,
						partner_id:partner_id,
						staff_id : dash_staff_id,
						plan_id  : dash_plan_id,
					};

					$.ajax({
						type: 'POST',
						url: APISERVER+'/api/dashboards/deleteCustomSetting.json',
						data: total_params,
						async: true,
						dataType : "json",
						beforeSend: function(){
					 
						},
						success: function(complet_data,status,xhr){
							document.getElementById('hiddenCustomerImg').style.visibility = 'hidden';
							if(complet_data.response.status == 'success'){
								var successMessage = cust_dhbrd_setting;
								call_toastr('success', dshbrd_suc, successMessage);
								passRequest(base_url+'dashboard/index');
							}else if(complet_data.response.status == 'error'){
								if(complet_data.response.response.error == 'validationErrors'){
									var mt_arr = complet_data.response.response.list;
									var array = $.map(mt_arr, function(value, index) {
										return value+'<br />';
									});
									showAlertMessage(array,'error',alr_msg);
									return;
								}else{
									showAlertMessage(complet_data.response.response.msg,'error',alr_msg);
									return;
								}	
							}
						},
						error: function(xhr, status, error){
							document.getElementById('hiddenCustomerImg').style.visibility = 'hidden';
							if(xhr.status && xhr.status == 400){
								var obj = jQuery.parseJSON(xhr.responseText);
								showAlertMessage(obj.message,'error');
							}
							else{
								showAlertMessage("There was a problem accessing the server: " + xhr.statusText +"<br>"+"*Please refresh the page and try again",'error');
							}	 
						},
					});
				}
			},
			{
				'class' : 'btn',
				'id' : 'cancelbtntext',
				"text" : dash_cancel,
				click: function() {
					$(this).dialog( "close" );
				}
			}
		  ]
		});
	});

 	$('input[type=checkbox]').uniform();	

 	$("#div_recent_activities input[type=checkbox]").click(function(){
		var valuesArray = $('input:checkbox:checked').map( function() {
		    return this.value;
		}).get().join(",");
		
		var url = base_url + 'dashboard/filter_recent_activities';
		if(dash_partner_dir!='' && dash_partner_dir!=undefined && dash_partner_dir!=null){
			url = url +':cp='+dash_partner_dir;
		}

		
		fetchFormData('filterRecentActivities',url,'&module='+valuesArray);	
	});

	$('.datepicker').datepicker({
		weekStart: 1,
		dateFormat: "dd.mm.yy",
		language: 'no',
	}).on('changeDate', function(en) {
		$('.datepicker').datepicker('hide');
		// console.log(en);return;
		//seldate = $.fullCalendar.formatDate( en.date, 'yyyy-MM-dd' );	
		seldate = en.date.toString('dd-MM-yyyy');
		change_date(seldate);
	});

	$('#prev_day').click(function(){
		var date = new Date($('#prev_date').val());
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
	
		prevdate = 	new Date(y, m, d);
		//prevdate = $.fullCalendar.formatDate( prevdate, 'yyyy-MM-dd' );
		prevdate = prevdate.toString('dd-MM-yyyy');
		change_date(prevdate);
	});

	$('#next_day').click(function(){
		var date = new Date($('#next_date').val());
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		//console.log(date);	return;	
		nextdate = 	new Date(y, m, d);
		//nextdate = $.fullCalendar.formatDate( nextdate, 'yyyy-MM-dd' );
		nextdate = nextdate.toString('dd-MM-yyyy');
		change_date(nextdate);
		
	});

	/* #BUG 21499   BY 054  16 AUG 2014 */
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};
	if(isMobile.any()) {
	   $('#dashboard_summary').hide();
	   
	}else {
		$('#dashboard_summary').show();
	}

	/*** 024 02-01-2014 #25300, UI issue after calendar translation ***/
		$('#calendar_dashboard .fc-toolbar .fc-left').addClass('fc-header-left');
		$('#calendar_dashboard .fc-toolbar .fc-center').addClass('fc-header-center');
		$('#calendar_dashboard .fc-toolbar .fc-right').addClass('fc-header-right');
		$('#calendar_dashboard .fc-view-container').addClass('fc-content');
	/*** 024 02-01-2014 #25300, UI issue after calendar translation ***/	
		
});
var CalendarDashboard = function () {


		return {
			//main function to initiate the module
			init: function () {
				CalendarDashboard.initCalendar();
			},

			initCalendar: function () {

				//$("#calendar_dashboard").fullCalendar("refetchEvents");

				if (!jQuery().fullCalendar) {
					return;
				}

				 var country_view = $('#PartnerCountry').val();
	
				if(country_view == 'NO')
				{
					country_view = 1;
				}else{
					country_view = 0;
				}

				var date = new Date();
				var d = date.getDate();
				var m = date.getMonth();
				var y = date.getFullYear();

				var n = date.getHours(); 

				var h = {};


				//018 25 OCT 2013 
				var max_cal_width = 400;
					if($('#max_cal_width').length)
					max_cal_width = $('#max_cal_width').val();

				
				// 15/03/2014  # 024//////////////////////
				var meta_key = $('#default_calendar_view').val();
				meta_value = 'month';
				if(meta_key == 'day'){
					meta_value = 'agendaDay';
				}
				if(meta_key == 'week'){
					meta_value = 'agendaWeek';
				}
				if(meta_key == 'month'){
					meta_value = 'month';
				}
				// #################
				
				$(window).resize(function() {
					if (App.isRTL()) {
						 if ($('#calendar_dashboard').parents(".portlet").width() <= max_cal_width) {
							//$('#calendar_dashboard').addClass("mobile");
							h = {
								right: 'title, prev, next',
								center: '',
								right: 'agendaDay, agendaWeek, month, today'
							};
						} else {
							$('#calendar_dashboard').removeClass("mobile");
							h = {
								right: 'title',
								center: '',
								left: 'agendaDay, agendaWeek, month, today, prev,next'
							};
						}                
					} else {
						 if ($('#calendar_dashboard').parents(".portlet").width() <= max_cal_width) {
							//$('#calendar_dashboard').addClass("mobile");
							h = {
								left: 'title, prev, next',
								center: '',
								right: 'today,month,agendaWeek,agendaDay'
							};
						} else {
							//$('#calendar_dashboard').removeClass("mobile");
							h = {
								left: 'title',
								center: '',
								right: 'prev,next,today,month,agendaWeek,agendaDay'
							};
						}
					}
				});
				$('#calendar_dashboard').resize();
				
	
			
			   /////

				var initDrag = function (el,task_id) {
					
					// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
					// it doesn't need to have a start or end
					var eventObject = {
						title: $.trim(el.text()), // use the element's text as the event title
						task_id: $.trim(task_id) 
					};
					// store the Event Object in the DOM element so we can get to it later
					el.data('eventObject', eventObject);
					// make the event draggable using jQuery UI
					el.draggable({
						zIndex: 999,
						revert: true, // will cause the event to go back to its
						revertDuration: 0, //  original position after the drag
						///containment: $('#all_calendars'),
						//helper: 'clone'
					});
				}

				var addEvent = function (task_id,title,type) {
					task_id = task_id == 0?'':task_id;	
					type = type;
					title = title.length == 0 ? "Untitled Event" : title;
				
					var html = $('<div style="width:100%" class="external-event label">' + title + '</div>');
					if(type == '1')
					jQuery('#event_box').append(html);
					if(type == '0')
					jQuery('#event_box_unass').append(html);
					initDrag(html,task_id);
				}

				$('#external-events div.external-event').each(function () {
					initDrag($(this))
				});

				$('#event_add').unbind('click').click(function () {
					var title = $('#event_title').val();
					addEvent(title);
				});


				$('#modal_ajax').click(function () {
			
						var data = [];
						
						var taskFlag = '0';
						var count = 0;
						$.each( dropped_events, function( i, val ) {

								var task_id = val.task_id;
								var contact_id = val.contact_id;
								var taskType = val.task_type;
								var reschedule = val.reschedule;
								//var start_date = $.fullCalendar.formatDate( val.start, 'dd-MM-yyyy HH:mm:ss' );
								if(reschedule == 'y') {
									var start_date = $.fullCalendar.moment(val.start.format()); 
									start_date = new Date(start_date);
									start_date = start_date.toString('dd-MM-yyyy HH:mm:ss');
								}else {
									var start_date = val.start.toString('dd-MM-yyyy HH:mm:ss');
								}
								if(val.end == null || val.end == 'undefined' || val.end == '')
								{
									var dateTimeParts = start_date.split(" ");

									dateTimeParts[0].trim();
									dateTimeParts[1].trim();

									var dateParts = dateTimeParts[0].split("-");
									var timeParts = dateTimeParts[1].split(":");

									//$('#task_type').change();
									var date = new Date(dateParts[2], dateParts[1], dateParts[0], timeParts[0], timeParts[1]);
									//var end_time  = new Date(date.getTime() + 7200000);
									if(taskType == 'inspection'){
										var task_inspection_duration = $('#task_inspection_duration').val();
									}
									if(taskType == 'meeting'){
										var task_inspection_duration = $('#task_meeting_duration').val();
									}
									if(taskType == 'other'){
										var task_inspection_duration = $('#task_other_duration').val();	
									}
									var end_time  = new Date(date);
									end_time.setMinutes(task_inspection_duration);
									
									var year = end_time.getFullYear();

									var month = end_time.getMonth();
									if(month <= 9)
										month = '0'+month;

									var day= end_time.getDate();
									if(day <= 9)
										day = '0'+day;

									var hour = end_time.getHours();
									if(hour <= 9)
										hour = '0'+hour;

									var minute	= end_time.getMinutes();
									if(minute <= 9)
										minute = '0'+minute;

									var seconds = end_time.getSeconds();
									if(seconds <= 9)
										seconds = '0'+seconds;

									var end_time = day + '-' + month + '-' + year + ' ' + hour + ':' + minute + ':'+ seconds;

									var end_date =  end_time;


								}else{
									//var end_date = $.fullCalendar.formatDate(  val.end, 'dd-MM-yyyy HH:mm:ss' );
									//BUG:26065
									if(reschedule == 'y') {
										var end_date = $.fullCalendar.moment(val.end.format()); 
										end_date = new Date(end_date);
										end_date = end_date.toString('dd-MM-yyyy HH:mm:ss');
									}else {
										var end_date = val.end.toString('dd-MM-yyyy HH:mm:ss');
									}
								}		

			
								if(taskType === 'inspection'){
									taskFlag = '1';
									count++;
								}

								obj = {};
								obj['task_id'] = task_id;
								obj['contact_id'] = contact_id;
								obj['start_date'] = start_date;
								obj['end_date'] = end_date;
								obj['reschedule'] = reschedule;
								data.push(obj);

						});

						var per_row = $('#change_row option:selected').val();
						
						finaldata = {
									'final':data,
									'calendar':'dashboard',
									'per_row':per_row,
									'count': count 
						};
						
						if(count > 0){
							
							sendpostData(base_url+'calendars/confirm_calendar_changes',finaldata,'popups1');
						}else{

							sendpostData(base_url+'calendars/submit_calendar',finaldata,'');
						}
				});


				function create_events(event)
				{
					$('#savemsg').show('slow', function() {
					});

					var newEventObject = $.extend({}, event);
					
					//assign it the date that was reported
					//copiedEventObject.start  = newEventObject;
					newEventObject.allDay = event.allDay;
					newEventObject.className = $(this).attr("data-class");

					dropped_events.push(newEventObject);
					// render the event on the calendar
					// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
					$('#calendar_dashboard').fullCalendar('renderEvent', newEventObject, true);
				}
				

				$('#closeme').on('click', function(){
					 dropped_events = [];
					 //predefined events
					$('#event_box').html("");
					$('#event_box_unass').html("");
					
					// $('#savemsg').css('display', 'none');
					 $('#savemsg').hide('slow', function() {});
					 $('#calendar_dashboard').fullCalendar('destroy');
					 $('#calendar_dashboard').fullCalendar({ //re-initialize the calendar
						header: h,
						lang: currentLangCode,
						defaultView: meta_value,
						//slotMinutes: 30,
						defaultEventMinutes: default_task_inspection_min,
						slotEventOverlap: true,
						slotDuration: '00:15:00',
						editable: true,
						allDaySlot :true,
						eventLimit: true, // allow "more" link when too many events
						firstHour: n, 
						firstDay:country_view,
						axisFormat: { agenda: 'HH' },
						columnFormat:{
							month: 'ddd',    // Mon
							week: 'ddd', // Mon 9/7
							day: 'dddd'  // Monday 9/7
						},
						eventMouseover: function( event, jsEvent, view ) {
								var date = event.start;
								$('#has_focus_on_event').val('y');
								if(view.name == 'month'){
									
									var start_date = '';
									var end_date = '';
									if(!$.isEmptyObject(event.start)){ 
										start_date = $.fullCalendar.moment(event.start.format());	
										start_date = new Date(start_date);
										start_time = start_date.toString('dd.MM.yy HH:mm');   
										//var end_date = $.fullCalendar.moment(event.end.format());	
										
									}
									
									if(!$.isEmptyObject(event.end)){ 
										end_date = $.fullCalendar.moment(event.end.format());	
										end_date = new Date(end_date);
										end_time = end_date.toString('dd.MM.yy HH:mm');   
										//var end_date = $.fullCalendar.moment(event.end.format());	
										
									}
									tooltitle = event.title;
							
									tooltitle += '<b>'+dash_start+'</b> : '+start_time;
									
									//tooltitle = start_time;
									if(end_date != '')
									tooltitle += '<br><b>'+dash_end+'</b> : '+end_time;
										
									tooltip = '<div class="popover fade right in" style="top: 2486.5px; left: 544px; display: block;"><h3 class="popover-title"></h3><div class="popover-content">'+tooltitle+'</div></div>';
									
									$("body").append(tooltip);
									$(this).mouseover(function (e) {
										$(this).css('z-index', 10000);
										$('.popover').fadeIn('500');
										$('.popover').fadeTo('10', 1.9);
									}).mousemove(function (e) {
										var listWidth=$('.popover').width();
										var link= $(this).closest('#calendar_dashboard');
										
										var linkWidth=link.width();
										var linkPosition=link.offset().left ;//cache the position
										var right = linkPosition + linkWidth;
										//alert(linkPosition + ' --- ' + contact_id);
										topMargin=e.pageY;
										
										 if((right - listWidth)  > e.pageX) {	
											
											leftMargin=e.pageX;
										} else {
											 if(((right+10) - (listWidth/2))  > e.pageX) {	
												leftMargin=e.pageX - (listWidth/2);
											 }
											 else {
												leftMargin=e.pageX - listWidth ;
											 }
										}
										$('.popover').css('top', topMargin + 10);
										$('.popover').css('left', leftMargin);
									});
								}

						},
						eventMouseout : function( event, jsEvent, view ) {
							$('#has_task_popup_open').val('n');
							
							$(this).css('z-index', 8);
							$('.popover').remove();	
						},
						eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {
							
							$('#savemsg').show('slow', function() {
							});

							var newEventObject = $.extend({}, event);
							
							
							newEventObject.allDay = allDay;
							newEventObject.className = $(this).attr("data-class");
							
							
							if(newEventObject.schedule == 'y'){
								newEventObject.reschedule = 'n';	
							}else{
								newEventObject.reschedule = 'y';		
							}
							
							if(!contains_task_in_dropped_events(newEventObject)) {
								dropped_events.push(newEventObject);
							}

							//dropped_events.push(newEventObject);
							// render the event on the calendar
							// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
							$('#calendar_dashboard').fullCalendar('renderEvent', newEventObject, true);
							
						},
						eventRender: function(event, element,view) {
							
								
								var event_start_date = new Date();
								if(typeof(event.start.length) != "undefined" && event.start.length !== null) {
									event_start_date = event.start._i;
								}
								var event_end_date = new Date();
								if(typeof(event.start.length) != "undefined" && event.end.length !== null) {
									event_end_date = event.end._i;
								}

								var json_string = '{"title":"'+event.title+'","start":"'+event_start_date+'","end":"'+event_end_date+'","backgroundColor":"'+event.backgroundColor+'","allDay":"'+event.allDay+'","task_id":"'+event.task_id+'","_id":"'+event._id+'","className":[],"_allDay":"'+event.allDay+'","_start":"'+event_start_date+'","_end":"'+event_end_date+'","task_type":"'+event.task_type+'","contact_id":"'+event.contact_id+'"}';

								$(element).attr('data-event', json_string);
								
								var allevents = $('#calendar_dashboard').fullCalendar('clientEvents');
								var savedevents = []; 
								/****** 024 17-01-2014 #26008, Calendar > issues ************/
								
								if(isTouchDevice()){
										
									var hammertime = new Hammer(element.get(0));
									
									hammertime.on('tap doubletap', function(ev) {
										
												display_msg = $('#savemsg').css('display');
												if(display_msg == 'none'){

													var task_id = event.task_id;
													var BASE_URL = $('#BASE_URL').val();
													var url = BASE_URL+'calendars/calendar_new_task/'+task_id+'/?calendar=dashboard&event_id='+event._id+'&request_from=task_list';
													//if($('#task_edit_modal').attr('data-url'))
													$('#task_edit_modal').attr('data-url',url);
													//show_modal(url,'popups');
													$('#task_edit_modal').trigger("click");;
													//return;
												}
										  
										
									});	
										
								}else{
									element.bind('dblclick', function() {
										display_msg = $('#savemsg').css('display');
										if(display_msg == 'none'){

											var task_id = event.task_id;
											var BASE_URL = $('#BASE_URL').val();
											var url = BASE_URL+'calendars/calendar_new_task/'+task_id+'/?calendar=dashboard&event_id='+event._id+'&request_from=task_list';
											//if($('#task_edit_modal').attr('data-url'))
											$('#task_edit_modal').attr('data-url',url);
											//show_modal(url,'popups');
											$('#task_edit_modal').trigger("click");;
											//return;
										}
								  });
								}
								
								/****** 024 17-01-2014 #26008, Calendar > issues ************/	 
										
						},
						eventAfterRender: function(event, element, view) {
								
								var decode = $('<div/>').html(event.title).text();
					 
								 element.find('div.fc-title').html(event.title);
								 if(view.name == 'month'){
									
									element.find('span.fc-title').html(event.task_type);
								}
							  
						},
						eventAfterAllRender: function(view) {
							$('span.fc-button.fc-button-agendaWeek').html(dash_week);
							$('span.fc-button.fc-button-today').html(dash_today);
							$('span.fc-button.fc-button-month').html(dash_month);
							$('span.fc-button.fc-button-agendaDay').html(dash_day);
							//makeEventsDraggable();
						},
						droppable: true, // this allows things to be dropped onto the calendar !!!
						dropAccept:".ui-draggable",
						drop: function (date,allDay) { // this function is called when something is dropped
								

							 $('#savemsg').show('slow', function() {
								
								// Animation complete.
								//$("#savemsg").hide(1000);
							});
		
							// retrieve the dropped element's stored Event Object
							var originalEventObject = $(this).data('eventObject');
							// we need to copy it, so that multiple events don't have a reference to the same object
							var copiedEventObject = $.extend({}, originalEventObject);

							//var startdate = $.fullCalendar.formatDate( date, 'dd-MM-yyyy HH:mm:ss' );

							// assign it the date that was reported
							copiedEventObject.start = date;
							copiedEventObject.allDay = true;
							copiedEventObject.className = $(this).attr("data-class");

							dropped_events.push(copiedEventObject);

							// render the event on the calendar
							// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
							$('#calendar_dashboard').fullCalendar('renderEvent', copiedEventObject, true);

							// is the "remove after drop" checkbox checked?
							//if ($('#drop-remove').is(':checked')) {
								// if so, remove the element from the "Draggable Events" list
								$(this).remove();
							//}
						},
						//events: "<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'calendars','action' =>'get_dashboard_events'),true);?>",
						
						events: {

							url: base_url+'calendars/get_dashboard_events',
							type: 'POST',
							error: function() {
								alert('there was an error while fetching events!');
							},
							cache: true
						},
						timeFormat: { 
							month: 'H:mm', 
							agenda: '',
						},
						views: {
							basic: {
								// options apply to basicWeek and basicDay views
							},
							agenda: {
								// options apply to agendaWeek and agendaDay views
							},
							week: {
								// options apply to basicWeek and agendaWeek views
							},
							day: {
								// options apply to basicDay and agendaDay views
							}
						},
						displayEventEnd: {
							month: true,
						},	
						/*eventClick: function(event, jsEvent, view) {

							//alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
							//alert('View: ' + view.name);
							//$("#modal_ajax_demo_btn").trigger("click");
							// change the border color just for fun
							//$(this).css('border-color', 'red');
							var task_id = event.task_id;
							var BASE_URL = $('#BASE_URL').val();
							var url = BASE_URL+'dashboard/calendar_new_task/'+task_id;

							//if($('#task_edit_modal').attr('data-url'))
							$('#task_edit_modal').attr('data-url',url);

							//show_modal(url,'popups');
							$('#task_edit_modal').trigger("click");;
							//return;

						},*/
						eventResize:function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) { 
					
							//create_events(event);
							$('#savemsg').show('slow', function() {
							});

							var newEventObject = $.extend({}, event);

							newEventObject.allDay = event.allDay;
							newEventObject.className = $(this).attr("data-class");

							if(newEventObject.schedule == 'y'){
								newEventObject.reschedule = 'n';	
							}else{
								newEventObject.reschedule = 'y';		
							}
							
							// Do not push events that are already present in array
							if(!contains_task_in_dropped_events(newEventObject)) {
								dropped_events.push(newEventObject);
							}
							$('#calendar_dashboard').fullCalendar('renderEvent', newEventObject, true);
						}
					});
				});
				
				$('#calendar_dashboard').fullCalendar('destroy'); // destroy the calendar
	
				$('#calendar_dashboard').fullCalendar({ //re-initialize the calendar
					header: h,
					lang: currentLangCode,
					defaultView: meta_value,
					//slotMinutes: 30,
					defaultEventMinutes: default_task_inspection_min,
					slotEventOverlap: true,
					slotDuration: '00:15:00',
					editable: true,
					allDaySlot :true,
					eventLimit: true, // allow "more" link when too many events
					firstHour: n, 
					firstDay:country_view,
					axisFormat: { agenda: 'HH' },
					columnFormat:{
						month: 'ddd',    // Mon
						week: 'ddd', // Mon 9/7
						day: 'dddd'  // Monday 9/7
					},
					eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
						
						$('#savemsg').show('slow', function() {
						});

						var newEventObject = $.extend({}, event);
						
						
						newEventObject.allDay = allDay;
						newEventObject.className = $(this).attr("data-class");
						
						
						if(newEventObject.schedule == 'y'){
							newEventObject.reschedule = 'n';	
						}else{
							newEventObject.reschedule = 'y';		
						}
						
						if(!contains_task_in_dropped_events(newEventObject)) {
							dropped_events.push(newEventObject);
						}

						//dropped_events.push(newEventObject);
						// render the event on the calendar
						// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
						$('#calendar_dashboard').fullCalendar('renderEvent', newEventObject, true);
													
						
						//create_events(event);
						
					},
					/*eventClick: function(event, element) {
						$('#calendar_dashboard').fullCalendar('updateEvent', event);
					},*/
					eventRender: function(event, element,view) {
						
						    
							var event_start_date = new Date();
							if(typeof(event.start.length) != "undefined" && event.start.length !== null) {
								event_start_date = event.start._i;
							}
							var event_end_date = new Date();
							if(typeof(event.start.length) != "undefined" && event.end.length !== null) {
								event_end_date = event.end._i;
							}

							var json_string = '{"title":"'+event.title+'","start":"'+event_start_date+'","end":"'+event_end_date+'","backgroundColor":"'+event.backgroundColor+'","allDay":"'+event.allDay+'","task_id":"'+event.task_id+'","_id":"'+event._id+'","className":[],"_allDay":"'+event.allDay+'","_start":"'+event_start_date+'","_end":"'+event_end_date+'","task_type":"'+event.task_type+'","contact_id":"'+event.contact_id+'","customer_name":"'+event.customer_name+'","location":"'+event.location+'","zip":"'+event.zip+'","city":"'+event.city+'","customer_phone":"'+event.customer_phone+'","customer_cellphone":"'+event.customer_cellphone+'","task_status":"'+event.task_status+'"}';

							$(element).attr('data-event', json_string);
							
							var allevents = $('#calendar_dashboard').fullCalendar('clientEvents');
							var savedevents = []; 
							/****** 024 17-01-2014 #26008, Calendar > issues ************/
									
									if(isTouchDevice()){
										
										var hammertime = new Hammer(element.get(0));
										
										hammertime.on('tap doubletap', function(ev) {
											
													display_msg = $('#savemsg').css('display');
													if(display_msg == 'none'){

														var task_id = event.task_id;
														var BASE_URL = $('#BASE_URL').val();
														var url = BASE_URL+'calendars/calendar_new_task/'+task_id+'/?calendar=dashboard&event_id='+event._id+'&request_from=task_list';
														//if($('#task_edit_modal').attr('data-url'))
														$('#task_edit_modal').attr('data-url',url);
														//show_modal(url,'popups');
														$('#task_edit_modal').trigger("click");;
														//return;
													}
											  
											
										});	
											
									}else{
										element.bind('dblclick', function() {
											display_msg = $('#savemsg').css('display');
											if(display_msg == 'none'){

												var task_id = event.task_id;
												var BASE_URL = $('#BASE_URL').val();
												var url = BASE_URL+'calendars/calendar_new_task/'+task_id+'/?calendar=dashboard&event_id='+event._id+'&request_from=task_list';
												//if($('#task_edit_modal').attr('data-url'))
												$('#task_edit_modal').attr('data-url',url);
												//show_modal(url,'popups');
												$('#task_edit_modal').trigger("click");;
												//return;
											}
									  });
									}
									
									
									
							/****** 024 17-01-2014 #26008, Calendar > issues ************/	 
							
					},
					eventAfterRender: function(event, element, view) {
						
							  
							  var decode = $('<div/>').html(event.title).text();
					 
							 element.find('div.fc-title').html(event.title);
							 if(view.name == 'month'){
								
								element.find('span.fc-title').html(event.task_type);
							}	
					},
					eventAfterAllRender: function(view) {
						$('span.fc-button.fc-button-agendaWeek').html(dash_week);
						$('span.fc-button.fc-button-today').html(dash_today);
						$('span.fc-button.fc-button-month').html(dash_month);
						$('span.fc-button.fc-button-agendaDay').html(dash_day);
						//makeEventsDraggable();
					},
					droppable: true, // this allows things to be dropped onto the calendar !!!
					dropAccept:".ui-draggable",
					drop: function (date, allDay) { // this function is called when something is dropped
						
						 $('#savemsg').show('slow', function() {
							
							// Animation complete.
							//$("#savemsg").hide(1000);
						});
						
						//$("#savemsg").css("display", "block");
						// retrieve the dropped element's stored Event Object
						var originalEventObject = $(this).data('eventObject');				

						// we need to copy it, so that multiple events don't have a reference to the same object
						var copiedEventObject = $.extend({}, originalEventObject);
						
						
						//var startdate = $.fullCalendar.formatDate( date, 'dd-MM-yyyy HH:mm:ss' );
													
						// assign it the date that was reported
						copiedEventObject.start = date;
						copiedEventObject.allDay = true;
						copiedEventObject.className = $(this).attr("data-class");

						dropped_events.push(copiedEventObject);
						// render the event on the calendar
						// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
						$('#calendar_dashboard').fullCalendar('renderEvent', copiedEventObject, true);

						// is the "remove after drop" checkbox checked?
						//if ($('#drop-remove').is(':checked')) {
							// if so, remove the element from the "Draggable Events" list
							$(this).remove();
						//}
					},
					eventMouseover: function( event, jsEvent, view ) {
						var date = event.start;
						$('#has_focus_on_event').val('y');
						if(view.name == 'month'){
							
						
							var start_date = '';
							var end_date = '';
							if(!$.isEmptyObject(event.start)){ 
								start_date = $.fullCalendar.moment(event.start.format());	
								start_date = new Date(start_date);
								start_time = start_date.toString('dd.MM.yy HH:mm');  
								//var end_date = $.fullCalendar.moment(event.end.format());	
								
							}
							
							if(!$.isEmptyObject(event.end)){ 
								end_date = $.fullCalendar.moment(event.end.format());	
								end_date = new Date(end_date);
								end_time = end_date.toString('dd.MM.yy HH:mm');   
								//var end_date = $.fullCalendar.moment(event.end.format());	
								
							}
							tooltitle = event.title;
							
							tooltitle += '<b>'+dash_start+'</b> : '+start_time;
							
							//tooltitle = start_time;
							if(end_date != '')
							tooltitle += '<br><b>'+dash_end+'</b> : '+end_time;
								
							tooltip = '<div class="popover fade right in" style="top: 2486.5px; left: 544px; display: block;"><h3 class="popover-title"></h3><div class="popover-content">'+tooltitle+'</div></div>';
							
							$("body").append(tooltip);
							$(this).mouseover(function (e) {
								$(this).css('z-index', 10000);
								$('.popover').fadeIn('500');
								$('.popover').fadeTo('10', 1.9);
							}).mousemove(function (e) {
								var listWidth=$('.popover').width();
								var link= $(this).closest('#calendar_dashboard');
								
								var linkWidth=link.width();
								var linkPosition=link.offset().left ;//cache the position
								var right = linkPosition + linkWidth;
								//alert(linkPosition + ' --- ' + contact_id);
								topMargin=e.pageY;
								
								 if((right - listWidth)  > e.pageX) {	
									
									leftMargin=e.pageX;
								} else {
									 if(((right+10) - (listWidth/2))  > e.pageX) {	
										leftMargin=e.pageX - (listWidth/2);
									 }
									 else {
										leftMargin=e.pageX - listWidth ;
									 }
								}
								$('.popover').css('top', topMargin + 10);
								$('.popover').css('left', leftMargin);
							});
						}

					},
					eventMouseout : function( event, jsEvent, view ) {
						$('#has_task_popup_open').val('n');
						
						$(this).css('z-index', 8);
						$('.popover').remove();	
					},
					loading: function(isLoading, view ) {
						if(isLoading)
						{
							showProcessingImage();
						}else{
							hideProcessingImage();
						}
						
					},
					//events: "<?php //echo Router::url(array('plugin' => 'bkengine','controller' => 'calendars','action' =>'get_dashboard_events'),true);?>",
					/*events: [<?php //echo $tasks; ?>],*/
					events: {
							url: base_url+'calendars/get_dashboard_events',
							type: 'POST',
							error: function() {
								//alert('there was an error while fetching events!');
							},
							cache: true
					},
					timeFormat: { 
						month: 'H:mm', 
						agenda: '',
					},
					views: {
						basic: {
							// options apply to basicWeek and basicDay views
						},
						agenda: {
							// options apply to agendaWeek and agendaDay views
						},
						week: {
							// options apply to basicWeek and agendaWeek views
						},
						day: {
							// options apply to basicDay and agendaDay views
						}
					},
					displayEventEnd: {
						month: true,
					},
					/*eventClick: function(event, jsEvent, view ) {

						//alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
						//alert('View: ' + view.name);
						//$("#modal_ajax_demo_btn").trigger("click");
						// change the border color just for fun
						//$(this).css('border-color', 'red');
						display_msg = $('#savemsg').css('display');
						if(display_msg == 'none'){
							var task_id = event.task_id;
							var BASE_URL = $('#BASE_URL').val();
							var url = BASE_URL+'calendars/calendar_new_task/'+task_id+'/?calendar=multiple&event_id='+event._id;

							//if($('#task_edit_modal').attr('data-url'))
							$('#task_edit_modal').attr('data-url',url);

							//show_modal(url,'popups');
							$('#task_edit_modal').trigger("click");;
							//return;
						}
					
					},*/
					dayClick: function(date, allDay, jsEvent, view) {
						
						//$("#event_add_modal").trigger("click");
						/*if (allDay) {
							alert('Clicked on the entire day: ' + date);
						}else{
							alert('Clicked on the slot: ' + date);
						}*/

					},
					eventResize:function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) { 
					
						//create_events(event);
						$('#savemsg').show('slow', function() {
						});

						var newEventObject = $.extend({}, event);

						newEventObject.allDay = event.allDay;
						newEventObject.className = $(this).attr("data-class");

						if(newEventObject.schedule == 'y'){
							newEventObject.reschedule = 'n';	
						}else{
							newEventObject.reschedule = 'y';		
						}
						
						// Do not push events that are already present in array
						if(!contains_task_in_dropped_events(newEventObject)) {
							dropped_events.push(newEventObject);
						}
						$('#calendar_dashboard').fullCalendar('renderEvent', newEventObject, true);
					}
				});

				
			}

		};
}();

function makeEventsDraggable () { 
	$('.fc-draggable').each(function() {
		// store data so the calendar knows to render an event upon drop
		$(this).data('event', {
			title: $.trim($(this).text()), // use the element's text as the event title
			stick: true // maintain when user navigates (see docs on the renderEvent method)
		});
		// make the event draggable using jQuery UI
		$(this).draggable({
			zIndex: 999,
			revert: true,      // will cause the event to go back to its
			revertDuration: 0  //  original position after the drag
		});
		// Dirty fix to remove highlighted blue background
		$("td").removeClass("fc-highlight");
	});
}

function contains_task_in_dropped_events(eventobj) {
    var i;
    var task_id = eventobj.task_id;
    for (i = 0; i < dropped_events.length; i++) {
        if (dropped_events[i].task_id == task_id) {
            dropped_events[i] = eventobj;
            return true;
        }
    }

    return false;
}
function change_date(date)
{
	var url = base_url + 'dashboard/index&date'+date;
	sendRequest(base_url);
}
function choose_action(sel,id)
{

	var value = $(sel).attr('rel');

	if(value == '1')
	{
		$('#view_task_'+id).trigger('click');
	}

	if(value == '2')
	{
		window.location.href = $('#call_client_'+id).attr('href');
		//$('#call_client_'+id).trigger('click');
	}

	if(value == '3')
	{
		window.location.href = $('#show_map_'+id).attr('href'); 	
	
	}

	if(value == '4')
	{
		$('#update_status_'+id).trigger('click');
	
	}
	
	if(value == '5')
	{
		$('#update_status_'+id).trigger('click');
	
	}
}
function checkBoxClicked1(value){
	var id = $(value).attr('id');
	if($('#'+id).is(':checked')){
		$('#'+id).parent().attr('class','checked');
		var valuesArray = $('input:checkbox:checked').map( function() {
		    return this.value;
		}).get().join(",");
	}else{
		$('#'+id).parent().attr('class','');
		var valuesArray = $('input:checkbox:checked').map( function() {
		    return this.value;
		}).get().join(",");
	}


	var url = base_url + 'dashboard/filter_recent_activities';
	if(dash_partner_dir!='' && dash_partner_dir!=undefined && dash_partner_dir!=null){
		url = url +'?cp:'+dash_partner_dir;
	}


	fetchFormData('filter_recent_activities',url,'module='+valuesArray);	
}

function hide_completed(sel){
	if($(sel).is(':checked')){	
		status = '1';
	}else{
		status = '0';
	}
	var url = base_url + 'dashboard/filter_dashboard_tasks/Dashboard';
	sendRequest(base_url,'hidecompleted='+status);
	
}
function filter_tasks(filterby){
	if($('#hide_completed').is(':checked')){	
		status = '1';
	}else{
		status = '0';
	}
	var url = base_url + 'dashboard/filter_dashboard_tasks/Dashboard';
	sendRequest(url,'hidecompleted='+status+'&filterby='+filterby);
}

function getElementHtml(event){
	$customer_name = event.customer_name;
	$location = event.location;
	$zip = event.zip;
	$city = event.city;
	$customer_phone = event.customer_phone;
	$customer_cellphone = event.customer_cellphone;
	$task_status = event.task_status;
	
	$html = '';
	if(($task_status != '' && $task_status != null && $task_status != 'undefined') && $task_status == 'comp'){
		$html = '<div>Completed</div>';
	}
	
	if($customer_name != '' && $customer_name != null && $customer_name != 'undefined'){
		
		$html = $html + '<div class="wordLimit">'+$customer_name+'</div>';
	}
	
	if($location != '' && $location != null && $location != 'undefined'){
		
		$html = $html + '<div class="wordLimit">'+$location+'</div>';
	}
	$htmlzipcity = '';
	if($zip != '' && $zip != null && $zip != 'undefined'){
		$htmlzipcity = $zip+' ';
	}
	
	if($city != '' && $city != null && $city != 'undefined'){
		$htmlzipcity = $htmlzipcity + $city;
	}
	
	if($htmlzipcity != '')
	{
		$html = $html +'<div>'+ $htmlzipcity+'</div>';
	}
	$htmlphone = '';
	if($customer_phone != '' && $customer_phone != null && $customer_phone != 'undefined'){
		$htmlphone = $customer_phone+', ';
	}
	
	if($customer_cellphone != '' && $customer_cellphone != null && $customer_cellphone != 'undefined'){
		$htmlphone = $htmlphone + $customer_cellphone;
	}
	
	if($htmlphone != '')
	{
		$html = $html +'<div>'+ $htmlphone+'</div>';
	}
	
	return $html;
}
function renderAllEvents(){
	$('#calendar_dashboard').fullCalendar("removeEvents"); 
	$('#calendar_dashboard').fullCalendar('refetchEvents'); 
	 
	$.ajax({
		type: "POST",

		url: base_url+'calendars/get_dashboard_events',
		datatype: "json",
		success: function(events)
	    {
			  eventslist = jQuery.parseJSON(events);	
			  //console.log(eventslist);return;
			  //var allevents = $('#calendar_dashboard').fullCalendar('clientEvents');
			  $('#calendar_dashboard').fullCalendar("removeEvents"); 
			  $('#calendar_dashboard').fullCalendar( 'addEventSource', eventslist );
			 // $('#calendar_dashboard').fullCalendar('rerenderEvents');
	    }
	 });
}

function saveData(){
	var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
    el = $(el);
    var node = el.data('_gridstack_node');
    return {
        id: el.attr('data-gs-id'),
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        value: el.attr('data-gs-value'),
        min_width: el.attr('data-gs-min-width'),
        min_height: el.attr('data-gs-min-height'),
        content: el.attr('data-gs-content'),
        show_content: el.attr('data-gs-show-content'),
        title : el.attr('data-gs-title'),
        line1_font : el.attr('data-gs-font1'),
		line2_font : el.attr('data-gs-font2'),
    };
  });
  var resStr = JSON.stringify(res);
  //alert(resStr);
  var APISERVER = $('#APISERVER').val();
  var token = $('#token').val();
  var language = $('#language').val();
  var lang = $('#lang').val();
  var partner_id = $('#partner_id').val();
  
  var plan_id = dash_plan_id;
  var staff_id = dash_staff_id;
  var partner_type = dash_type;
  var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&plan_id='+plan_id+'&block_data='+resStr+'&staff_id='+staff_id+'&partner_type='+partner_type;		

	var complet_data = passProdRequest(APISERVER+'/api/dashboards/saveBlockData.json',total_params);
	if(complet_data == undefined){
		var json_data = $('#json_data').val();
		var complet_data = JSON.parse(json_data);
		complet_data.response.status = is_undefined(complet_data.response.status);
		if(complet_data.response.status == 'success'){
			var block_id = is_undefined(complet_data.response.response.block_id);
			var successMessage = is_undefined(complet_data.response.response.message.msg);
			if(block_id != ''){
				call_toastr('success', dshbrd_suc, successMessage);

				window.location.href= base_url + 'dashboard/index';
				
			}
		}else if(complet_data.response.status == 'error'){
			if(complet_data.response.response.error == 'validationErrors'){
				var mt_arr = complet_data.response.response.list;
				var array = $.map(mt_arr, function(value, index) {
					return value+'<br />';
				});
				showAlertMessage(array,'error',alr_msg);
				return;
			}else{
				showAlertMessage(complet_data.response.response.msg,'error',alr_msg);
				return;
			}	
		}
	}
}

// Create a closure
(function(){
    // Your base, I'm in it!
    var originalAddClassMethod = jQuery.fn.addClass;

    jQuery.fn.addClass = function(){
        // Execute the original method.
        var result = originalAddClassMethod.apply( this, arguments );

        // trigger a custom event
        jQuery(this).trigger('cssClassChanged');

        // return the original result
        return result;
    }
})();


var todo_block_id='';
function bindTodoEvents(id=''){
	$('.popover').remove();

	if(id==''){
		var id = todo_block_id;
	}
	
	if(id!=''){
		$(id).css({
			overflow:'hidden',
			border: 'none',
			'background-color':'#ffffff'
		});
		$(id).find('.portlet').css({
			'float':'left',
			'width':'100%',
			'height':'100%',
			'box-sizing':'border-box'

		});
		//$('.todo_options').outerHeight()
		var a  = $(id).outerHeight() - $(id +' .portlet-title').outerHeight() - 20   - $('.content_todos_add').outerHeight() - $('.completed_todos_span').outerHeight();
	
		//$('.todo_options').css('float','left');
	
		if(( $('.content_comp_todos li').length > 0 && !$('.content_comp_todos').hasClass('hide')) && ( $('.content_todos li').length> 0 && !$('.content_todos').hasClass('hide'))){
			var h = (a/2 ) - 2;
		}
		else{
			var h = a -2;
		}

		var anyone = 0;
		if($('.content_todos li').length!=0 && !$('.content_todos').hasClass('hide')){
			if(!$('.content_todos').hasClass('hide')){
				$(id+' .content_todos').slimScroll({destroy:true});
				$(id+' .content_todos').slimScroll({height:h});
				$(id+' .content_todos').css('height',h+'px');
				anyone = 1;
			}
		}
		else{
			if($(id+' .content_todos').parent().hasClass('slimScrollDiv')){
				$(id+' .content_todos').slimScroll({destroy:true});
			}
			$(id+' .content_todos').css('height','auto');
			
		}

		if($('.content_comp_todos li').length!=0 && !$('.content_comp_todos').hasClass('hide')){
			if(!$('.content_comp_todos').hasClass('hide')){
				$(id+' .content_comp_todos').slimScroll({destroy:true});
				$(id+' .content_comp_todos').slimScroll({height:h});
				$(id+' .content_comp_todos').css('height',h+'px');
				
				anyone = 1;
			}
		}
		else{
			if($(id+' .content_comp_todos').parent().hasClass('slimScrollDiv')){
				$(id+' .content_comp_todos').slimScroll({destroy:true});
			}
			$(id+' .content_comp_todos').css('height','auto');
		}

		if(anyone==0){
			$(id+' .portlet-body').css({'height':a+'px'});
		}
		
		if(anyone==0){
			//$(id+' .slimScrollDiv').remove();
		}
		else{
			$(id+' .slimScrollDiv').css({
				'float':'left',
				'width':'100%',
				'height':h+'px',
				'box-sizing':'border-box'
			});
		}

		$(id+' .portlet-body').css({
			'float':'left',
			'width':'100%',
			'box-sizing':'border-box'
		});
		

		$(window).resize(function(){
			if($('.input_add').length!=0){
				var w = $('.content_todos_add li').outerWidth()- $('.icon_add').outerWidth();
				$('.input_add').css('width',w+'px');
			}
		});

		$("body").bind('cssClassChanged', function(){
			if($('.input_add').length!=0){
				var w = $('.content_todos_add li').outerWidth()- $('.icon_add').outerWidth();
				$('.input_add').css('width',w+'px');
			}
	    });

		if($('.input_add').length!=0){
			var w = $('.content_todos_add li').outerWidth()- $('.icon_add').outerWidth();
			$('.input_add').css('width',w+'px');
		}
	}
	else{
		var id = todo_block_id;
		if($('.input_add').length!=0){
			var w = $('.content_todos_add li').outerWidth()- $('.icon_add').outerWidth();
			$('.input_add').css('width',w+'px');
		}
	}
	$('.select_all_todo,.deselect_all_todo,.todo_check,.comp_task,.nt_comp_task').off();
	$('.todo_check,.comp_task,.nt_comp_task').uniform.restore();
	$('.todo_check,.comp_task,.nt_comp_task').uniform();

	var save_string = '758545454521'+$('#partner_id').val()+1245457878;
	$('.comp_task,.nt_comp_task').change(function(){
		var comp_task  = $('.comp_task:checked').length
		var nt_comp_task  = $('.nt_comp_task:checked').length;

		if(comp_task > 0){
			$('.completed_todos_h').removeClass('hide');
		}
		else{
			$('.completed_todos_h').addClass('hide');
		}
		if(nt_comp_task > 0){
			$('.not_completed_todos_h').removeClass('hide');
		}
		else{
			$('.not_completed_todos_h').addClass('hide');
		}
		var obj = {comp_task:comp_task,nt_comp_task:nt_comp_task};
		obj = JSON.stringify(obj);
		
		localStorage.setItem(save_string,obj);
		bindTodoEvents();
	});

	if(checkNull(localStorage.getItem(save_string)) == ''){
	
		var obj = {comp_task:1,nt_comp_task:0};
		obj = JSON.stringify(obj);

		localStorage.setItem(save_string,obj);
		$('.comp_task').prop('checked','checked');
		$.uniform.update();
		$('.comp_task').trigger('change');
	}
	else{
		var d = localStorage.getItem(save_string);
		d = JSON.parse(d);
		if(d.comp_task==1){
			$('.comp_task').prop('checked','checked');
		}
		else{
			$('.comp_task').removeAttr('checked');
		}
		if(d.nt_comp_task==1){
			$('.nt_comp_task').prop('checked','checked');
		}
		else{
			$('.nt_comp_task').removeAttr('checked');
		}
		$.uniform.update();
	}



	$('.todo_check').click(function(e){
		var a = $('.todo_check').length;
		var b = $('.todo_check:checked').length;
		console.log('comple');
		var id =$(this).attr('data-primary-key');
		var status = $(this).attr('data-status');
		if(status==1){
			unMarkTodo(id);
		}
		else{
			completeTodo(id);
		}
		e.stopPropagation();


	});

	$(".todo_star_info").off();
	$(".todo_star_info").hover(function () {
		$(this).popover({
			title: '',        
			content: 'proirity msg',
			html: true,
			container: 'body'
		}).popover('show');
	}, function () {
		$(this).popover('hide');
	});	

	$('.todo-projects-item').off('click');
	$('.todo-projects-item').click(function(){
		var id = $(this).attr('data-primary-key');
		editTodo(id);
		
	});
	
	$('.star').off();
	$('.star').click(function(){
		
	});
	$('.dropdown-submenu a.test').next('ul').hide();
	$('.dropdown-submenu a.test').off('click');
	$('.dropdown-submenu a.test').on("click", function(e){
	    $(this).next('ul').toggle();
	    e.stopPropagation();
	    e.preventDefault();
	});

	$('.input_add').off('keypress');
	$('.input_add').keypress(function (e) {
		var key = e.which;
		if(key == 13){

			var v = $(this).val();
			if(v!=''){
				
				var partner_id =$('#partner_id').val();
				var admin_id = $('#admin_id').val();
				var staffer_id =$('#staffer_id').val();

				var params = {
					admin_id:admin_id,
					partner_id:partner_id,
					staffer_id:staffer_id,
					name:v,
					due_date:null,
					
				};
				//due_date: moment().format('YYYY-MM-DD hh:mm:ss'),
				var total_params = {
					data:params,
					model:'partnerTodos',
					action:'customAdd',
					emitevent:'partnerTodosOnscreenAdd'
				};
				socket.once('partnerTodosOnscreenAdd',function(data){
					console.log(data);
					if(data.error==null){
						hideProcessingImage();
						call_toastr('success',dshbrd_suc, todo_trn.tadd_succ);
		
					}
				});
				showProcessingImage('undefined');
				socket.emit('crud',total_params);
			}
		}
	});
}
socket.on('partnerTodosOnscreenAdd',function(data){
	renderAllTodo(data);
});


var todo_trn = {};
var blockData = '';
var glb_todo_data = [];
function getAndRenderTodoData(id, blckData){
	blockData = blckData;
	todo_trn.tadd_todo = $('#tadd_todo').val();
	todo_trn.tsel_all = $('#tsel_all').val();
	todo_trn.tdesel_all = $('#tdesel_all').val();
	todo_trn.tmrk_as_comp = $('#tmrk_as_comp').val();
	todo_trn.tmrk_as_nt_comp = $('#tmrk_as_nt_comp').val();
	todo_trn.tcomplete = $('#tcomplete').val();
	todo_trn.tnot_complete = $('#tnot_complete').val();
	todo_trn.tdelete = $('#tdelete').val();
	todo_trn.tdelete_success = $('#tdelete_success').val();
	todo_trn.tcomp_success = $('#tcomp_success').val();
	todo_trn.tncomp_success = $('#tncomp_success').val();
	todo_trn.tDelete = $('#tDelete').val();
	todo_trn.t_delete = $('#t_delete').val();
	todo_trn.tActions = $('#tActions').val();
	todo_trn.tadd_succ = $('#tadd_succ').val();
	todo_trn.tcomp_todo = $('#tcomp_todo').val();
	todo_trn.tsort = $('#tsort').val();
	todo_trn.tsort_alpha = $('#tsort_alpha').val();
	todo_trn.tsort_duedate = $('#tsort_duedate').val();
	todo_trn.tsort_priority = $('#tsort_priority').val();
	todo_trn.treset = $('#treset').val();
	todo_trn.tfltr_by = $('#tfltr_by').val();
	todo_trn.tcmp_tsk = $('#tcmp_tsk').val();
	todo_trn.tnt_cmp_tsk = $('#tnt_cmp_tsk').val();
	
	var staffer_id = $('#staffer_id').val();
	var partner_id = $('#partner_id').val();
	var admin_id = $('#admin_id').val();
	
	todo_block_id = id;
	if(blockData.show_content!=undefined && blockData.show_content!=null && blockData.show_content!=''){
		var show_content = JSON.parse(blockData.show_content);
	}
	else{
		var show_content = {};
	}
	var params = {
		where:{
			partner_id:partner_id,
			staffer_id:staffer_id,
			admin_id:admin_id,
		},
		order:'order DESC'
	};
	var total_params = {
		data:params,
		model:'partnerTodos',
		action:'find',
		emitevent:'partnerTodosGet'
	};

	socket.emit('crud', total_params);
	socket.once('partnerTodosGet',function(data){
		renderAllTodo(data);
	})
}

function renderAllTodo(data,frm='yes'){
	var html = '';
	if(data.error==null){
		var data = data.success;
		if(frm=='yes'){
			glb_todo_data = data;	
		}
				
		html += '<div class="portlet box green">';
			html += '<div class="portlet-title">';

				html += '<div class="caption"><i class="icon-list-alt"></i>';
					html += ''+checkNull($('input[name="title_'+blockData.id+'"]').val())+'';			
				html += '</div>';
				html += '<div class="actions">';
					html += '<div class="btn-group">';
						html += '<a class="btn" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">';
							html += todo_trn.tActions;
						html += '<i class="icon-angle-down"></i></a>';
						html +='<ul class="dropdown-menu pull-right">';
							//html +='<li><a style="text-align:left" onclick="addTodo()">';
									//html +='<i class="icon-plus"></i> '+todo_trn.tadd_todo;
							//html +='</a></li>';

							html +='<li class="dropdown-submenu">';
								html +='<a class="test" style="text-align:left"  tabindex="-1" href="javascript:;"><i class="icon-sort"></i> '+todo_trn.tsort+'</a>';
								html += '<ul class="dropdown-menu actions_d" style="left:-160px;margin-top: 0px; margin-left: 0px; display: block;">';

									html +='<li onclick="sort_todos(1)"><i class="icon-sort-by-alphabet"></i>'+todo_trn.tsort_alpha+'</li>';
									html +='<li onclick="sort_todos(2)"><i class="icon-sort-by-alphabet-alt"></i>'+todo_trn.tsort_alpha+'</li>';
								
									html +='<li onclick="sort_todos(3)"><i class="icon-sort-by-attributes"></i>'+todo_trn.tsort_duedate+'</li>';
									html +='<li onclick="sort_todos(4)"><i class="icon-sort-by-attributes-alt"></i>'+todo_trn.tsort_duedate+'</li>';
									
									html +='<li onclick="sort_todos(5)"><i class="icon-sort-by-attributes"></i>'+todo_trn.tsort_priority+'</li>';
									html +='<li onclick="sort_todos(6)"><i class="icon-sort-by-attributes-alt"></i>'+todo_trn.tsort_priority+'</li>';

									html +='<li onclick="sort_todos()"><i class="icon-remove"></i>'+todo_trn.treset+'</li>';

								html +='</ul>';
							html +='</li>';

							html += '<li class="dropdown-submenu"><a style="text-align:left">';
								html +='<input type="checkbox" class="comp_task">'+todo_trn.tcmp_tsk;
							html += '</a></li>';

							html += '<li class="dropdown-submenu"><a style="text-align:left">';
								html +='<input type="checkbox" class="nt_comp_task">'+todo_trn.tnt_cmp_tsk;
							html += '</a></li>';
					

						html +='</ul>';


					html +='</div>';
				html += '</div>';
			html += '</div>';

			html += '<div class="portlet-body">';
				html += '<ul class="content_todos_add">';
					html += '<li>';
						//html += '<span style="width:2%"><i class="icon-plus" style="color:#35aa47"></i></span>';
						//html += '<input type="text" style="width:98%;box-sizing:border-box">';

						html += '<div class="controls" style="margin-left:0">';
							html += '<div class="input-prepend" style="width:100%">';
								html += '<span class="add-on icon_add" style=""><i class="icon-plus" style="color:#fff"></i></span>';
								html += '<input class="m-wrap input_add" style="height:auto;box-sizing: border-box;" placeholder="'+todo_trn.tadd_todo+'" type="text">';
							html += '</div>';
						html += '</div>';

					html += '</li>';
				html += '</ul>';

				
					var completed_todos = '';
					var not_completed_todos = '';
					if(data.length!=0){
						for(var j in data){
							var pt = data[j];
							
							if(pt.status!=1){
								

								if(checkNull(pt.due_date)==''){
									not_completed_todos += '<li class="todo-projects-item no-due-date  todo_item_'+pt.id+'" data-primary-key="'+pt.id+'" data-status="not_completed">';
								}
								else if(new Date(moment(moment(pt.due_date).format('DD/MM/YYYY'))).getTime() == new Date(moment().format('DD/MM/YYYY')).getTime()){
									not_completed_todos += '<li class="todo-projects-item due_today  todo_item_'+pt.id+'" data-primary-key="'+pt.id+'" data-status="not_completed">';
								}
								else if(new Date(moment(moment(pt.due_date).format('DD/MM/YYYY'))).getTime() < new Date(moment().format('DD/MM/YYYY')).getTime()){
									not_completed_todos += '<li class="todo-projects-item over_due  todo_item_'+pt.id+'" data-primary-key="'+pt.id+'" data-status="not_completed">';
								}
								else{
									not_completed_todos += '<li class="todo-projects-item todo_item_'+pt.id+'" data-primary-key="'+pt.id+'" data-status="not_completed">';
								}
								
                        			not_completed_todos += '<ul class="content_ul">';
		                                not_completed_todos += '<li class="check">';
		                                	not_completed_todos += '<input data-primary-key="'+pt.id+'" type="checkbox" class="uni todo_check" data-status="'+pt.status+'">';
		                                not_completed_todos += '</li>';
		                                not_completed_todos += '<li class="content">';
		                                	not_completed_todos += pt.name;
		                                not_completed_todos += '</li>';

		                                not_completed_todos += '<li class="action" >';	                           
		                                	if(pt.is_starred==1){
		                                		not_completed_todos += '<span class="todo_star_info rating" style="font-size: 1.3em;" data-placement="top" data-original-title=""><span onclick="event.stopPropagation();starTodo('+pt.id+',0,this)" class="star star_yes"></span></span>';
		                                	}
		                                	else{
		                                		not_completed_todos += '<span class="todo_star_info rating" style="font-size: 1.3em;" data-placement="top" data-original-title=""><span onclick="event.stopPropagation();starTodo('+pt.id+',1,this)" class="star"></span></span>';
		                                	}
		                                not_completed_todos += '</li>';

		                              
		                                	if(checkNull(pt.due_date)!=''){
		                                		  not_completed_todos += '<li class="date">';
		                                		not_completed_todos += convertDateIntoSiteFormat(pt.due_date);
		                                	}
		                                	else{
		                                		  not_completed_todos += '<li class="date date_empty">';
		                                	}
		                                not_completed_todos += '</li>';
	                               not_completed_todos += '</ul>';
	                            not_completed_todos += '</li>';
	                            
							}
							else{
								if(checkNull(pt.due_date)==''){
									completed_todos += '<li class="todo-projects-item no-due-date no_drag todo_completed todo_item_'+pt.id+'" data-primary-key="'+pt.id+'" data-status="completed">';
								}
								else{
									completed_todos += '<li class="todo-projects-item  no_drag todo_completed todo_item_'+pt.id+'" data-primary-key="'+pt.id+'" data-status="completed">';
								}
								
                        			completed_todos += '<ul class="content_ul">';
	                                	completed_todos += '<li class="check">';
	                                		completed_todos += '<input data-primary-key="'+pt.id+'" type="checkbox" class="uni todo_check" data-status="'+pt.status+'">';
	                               		completed_todos += '</li>';
	                           
	                                	completed_todos += '<li class="content"  style="text-decoration: line-through;">';
	                                		completed_todos += pt.name;
	                                	completed_todos += '</li>';

	                                	completed_todos += '<li class="action" >';
	                                	completed_todos += '</li>';

	                                 	
		                                	if(checkNull(pt.due_date)!=''){
		                                		completed_todos += '<li class="date">';
		                                		completed_todos += convertDateIntoSiteFormat(pt.due_date);
		                                	}
		                                	else{
		                                		completed_todos += '<li class="date date_empty">';
		                                	}
		                                completed_todos += '</li>';
                               		completed_todos += '</ul>';
                            	completed_todos += '</li>';
							}
							
                        }
                        
                        
                    }

					var save_string = '758545454521'+$('#partner_id').val()+1245457878;
                    if(checkNull(localStorage.getItem(save_string)) == ''){
						html += '<ul class="todo-projects-container content_todos not_completed_todos_h">';
							html += not_completed_todos;
						html += '</ul>';

						html += '<p class="completed_todos_p completed_todos_h hide">';
							html += '<span class="completed_todos_span">'+todo_trn.tcomp_todo+'</span>';
						html += '</p>';
	                	html += '<ul class="todo-projects-container content_comp_todos completed_todos_h hide">';
	                		html += completed_todos;
	                	html += '</ul>';
					}
					else{
						var d = localStorage.getItem(save_string);
						d = JSON.parse(d);
							if(d.nt_comp_task==1){
								html += '<ul class="todo-projects-container content_todos not_completed_todos_h">';
							}
							else{
								html += '<ul class="todo-projects-container content_todos not_completed_todos_h hide">';
							}
							html += not_completed_todos;
						html += '</ul>';
					
							if(d.comp_task==1){ 
								html += '<p class="completed_todos_p completed_todos_h">';
									html += '<span class="completed_todos_span">'+todo_trn.tcomp_todo+'</span>';
								html += '<p>';
			                	html += '<ul class="todo-projects-container content_comp_todos completed_todos_h">';
			                		html += completed_todos;
			                	html += '</ul>';
							}
							else{
								html += '<p class="completed_todos_p completed_todos_h hide">';
									html += '<span class="completed_todos_span">'+todo_trn.tcomp_todo+'</span>';
								html += '<p>';
			                	html += '<ul class="todo-projects-container content_comp_todos completed_todos_h hide">';
			                		html += completed_todos;
			                	html += '</ul>';
							}
		            }
			html += '</div>';
		html += '</div>';

		$(todo_block_id).html(html);
		bindTodoEvents(todo_block_id);

		
	}
}

function addTodo(){
	new_custom_popup2(600,'popups','add_todo',{from:'add'});
}
function editTodo(id){
	new_custom_popup2(600,'popups','add_todo',{from:'edit',id:id});
}

function deleteAllTodo(id){
	var yes = function(){
		var ids = [];
		$('.todo_check:checked').each(function(){
			var id = $(this).attr('data-primary-key');
			ids.push(id);
		});


		var partner_id = $('#partner_id').val();
		var staffer_id = $('#staffer_id').val();
		var admin_id = $('#admin_id').val();

		var where = {id:{inq:ids},partner_id:partner_id,staffer_id:staffer_id,admin_id:admin_id};

		var total_params = {
			data:where,
			model:'partnerTodos',
			action:'deleteAllTodo',
			emitevent:'partnerTodosDeleteAll'
		};

		showProcessingImage('undefined');
		
		socket.once('partnerTodosDeleteAll',function(data){
			hideProcessingImage();
			if(data.error==null){
				call_toastr('success',dshbrd_suc,todo_trn.tdelete_success);
			}
		});
		socket.emit('crud',total_params);
	};

	var no = function(){

	};
	var del = 'Yes';
	var can = 'No'
	var msg = todo_trn.tdelete;
	showDeleteMessage(msg,cnf,yes,no,'ui-dialog-blue',del,can);
}

socket.on('partnerTodosDeleteAll',function(data){
	if(data.error==null){
		renderAllTodo(data);		
	}
});

function completeAllTodo(id){
	var ids = [];
	$('.todo_check:checked').each(function(){
		var id = $(this).attr('data-primary-key');
		ids.push(id);
	});

	var partner_id = $('#partner_id').val();
	var staffer_id = $('#staffer_id').val();
	var admin_id = $('#admin_id').val();
	var params ={status:1,partner_id:partner_id};
	var where = {id:{inq:ids},partner_id:partner_id,staffer_id:staffer_id,admin_id:admin_id};
	var obj = {
		data:params,
		where:where
	}
	var total_params = {
		data:obj,
		model:'partnerTodos',
		action:'updateStatus',
		emitevent:'partnerTodosCompleteAll'
	};

	showProcessingImage('undefined');
	socket.once('partnerTodosCompleteAll',function(data){
		hideProcessingImage();
		if(data.error==null){
			call_toastr('success',dshbrd_suc,todo_trn.tcomp_success);
		}
	});
	socket.emit('crud',total_params);
}

function unMarkAllTodo(){
	var ids = [];
	$('.todo_check:checked').each(function(){
		var id = $(this).attr('data-primary-key');
		ids.push(id);
	});

	var partner_id = $('#partner_id').val();
	var staffer_id = $('#staffer_id').val();
	var admin_id = $('#admin_id').val();
	var params ={status:0,partner_id:partner_id};
	var where = {id:{inq:ids},partner_id:partner_id,staffer_id:staffer_id,admin_id:admin_id};
	var obj = {
		data:params,
		where:where
	}
	var total_params = {
		data:obj,
		model:'partnerTodos',
		action:'updateStatus',
		emitevent:'partnerTodosNotCompleteAll'
	};
	socket.once('partnerTodosNotCompleteAll',function(data){
		hideProcessingImage();
		if(data.error==null){
			call_toastr('success',dshbrd_suc,todo_trn.tncomp_success);
		}
	});
	showProcessingImage('undefined');
	socket.emit('crud',total_params);
}

socket.on('partnerTodosAdd',function(data){
	renderAllTodo(data);
});

var cnf = 'Confirmation';
var del = 'Delete';
var can = 'Cancel';

function completeTodo(id){
	var yes = function(){
		var partner_id = $('#partner_id').val();
		var admin_id = $('#admin_id').val();
		var staffer_id = $('#staffer_id').val();

		var data ={status:1}
		var where = {
			id:id,
			partner_id:partner_id,
			admin_id:admin_id,
			staffer_id:staffer_id
		};

		var params = {
			where:where,
			data:data
		};
		var total_params = {
			data:params,
			model:'partnerTodos',
			action:'updateStatus',
			emitevent:'partnerTodosUpdateStatus'
		};
		showProcessingImage('undefined');
		
		socket.once('partnerTodosUpdateStatus',function(data){
			hideProcessingImage();
			if(data.error==null){
				call_toastr('success',dshbrd_suc,todo_trn.tcomp_success);
			}
		});
		socket.emit('crud',total_params);
	};

	var no = function(){

	};
	yes();
	// var del = 'Yes';
	// var can = 'No'
	// var msg = todo_trn.tcomplete;
	// showDeleteMessage(msg,cnf,yes,no,'ui-dialog-blue',del,can);
}

function unMarkTodo(id){
	var yes = function(){
		var partner_id = $('#partner_id').val();
		var admin_id = $('#admin_id').val();
		var staffer_id = $('#staffer_id').val();

		var data ={status:0};

		var where = {
			id:id,
			partner_id:partner_id,
			admin_id:admin_id,
			staffer_id:staffer_id
		};

		var params = {
			where:where,
			data:data
		};
		var total_params = {
			data:params,
			model:'partnerTodos',
			action:'updateStatus',
			emitevent:'partnerTodosUnmarkTodo'
		};
		showProcessingImage('undefined');
		
		socket.once('partnerTodosUnmarkTodo',function(data){
			hideProcessingImage();
			if(data.error==null){
				call_toastr('success',dshbrd_suc,todo_trn.tncomp_success);
			}
		});
		socket.emit('crud',total_params);
	};

	var no = function(){

	};
	yes();
	// var del = 'Yes';
	// var can = 'No'
	// var msg = todo_trn.tnot_complete;
	// showDeleteMessage(msg,cnf,yes,no,'ui-dialog-blue',del,can);
}

socket.on('partnerTodosUpdateStatus',function(data){
	if(data.error==null){
		renderAllTodo(data);
	}
});

socket.on('partnerTodosCompleteAll',function(data){
	renderAllTodo(data);
});

socket.on('partnerTodosNotCompleteAll',function(data){
	renderAllTodo(data);
});

socket.on('partnerTodosUnmarkAllStatus',function(data){
	hideProcessingImage();
	renderAllTodo(data);
});

socket.on('partnerTodosUnmarkTodo',function(data){
	if(data.error==null){
		renderAllTodo(data);
	}
});

function deleteTodo(id){
	var yes = function(){
		var partner_id = $('#partner_id').val();
		var staffer_id = $('#staffer_id').val();
		var admin_id = $('#admin_id').val();

		var params = {id:id,partner_id:partner_id,admin_id:admin_id,staffer_id:staffer_id};
		var total_params = {
			data:params,
			model:'partnerTodos',
			action:'delete',
			emitevent:'partnerTodosDelete'
		};
		socket.emit('crud',total_params);
	};

	var no = function(){

	};
	var msg = todo_trn.tdelete;
	showDeleteMessage(msg,cnf,yes,no,'ui-dialog-blue',del,can);
}

socket.on('partnerTodosDelete',function(data){
	if(data.error==null){
		var data = data.success;
		$('.todo_item_'+data.id).remove();
		bindTodoEvents();
	}
});

function starTodo(id,is_starred=0,that){
	var partner_id = $('#partner_id').val();
	var staffer_id = $('#staffer_id').val();
	var admin_id = $('#admin_id').val();

	var where = {
		id:id,
		partner_id:partner_id,
		admin_id:admin_id,
		staffer_id:staffer_id
	};
	var data =  {
		id:id,
		is_starred:is_starred,
	};

	var params = {
		where:where,
		data:data
	}

	var total_params = {
		data:params,
		model:'partnerTodos',
		action:'updateStar',
		emitevent:'partnerTodosupdateStar'
	};
	socket.emit('crud',total_params);
}

socket.on('partnerTodosupdateStar',function(data){
	renderAllTodo(data);
});

function sort_todos(how=''){

	var d = glb_todo_data;
	if(how==1){
		d.sort(function(a, b){
		    if(a.name < b.name) return -1;
		    if(a.name > b.name) return 1;
		    return 0;
		});
	}
	else if(how==2){
		d.sort(function(a, b){
		    if(a.name < b.name) return 1;
		    if(a.name > b.name) return -1;
		    return 0;
		});
	}
	else if(how==3){
		d.sort(function(a, b){
			var c = moment(a.due_date)
			var d = moment(b.due_date)
		    if(c < d) return -1;
		    if(c > d) return 1;
		    return 0;
		});
	}
	else if(how==4){
		d.sort(function(a, b){
			var c = moment(a.due_date)
			var d = moment(b.due_date)
		    if(c < d) return 1;
		    if(c > d) return -1;
		    return 0;
		});
	}
	else if(how==5){
		d.sort(function(a, b){
		    if(a.is_starred < b.is_starred) return -1;
		    if(a.is_starred > b.is_starred) return 1;
		    return 0;
		});
	}
	else if(how==6){
		d.sort(function(a, b){
		    if(a.is_starred < b.is_starred) return 1;
		    if(a.is_starred > b.is_starred) return -1;
		    return 0;
		});
	}
	else{
		d.sort(function(a, b){
		    if(a.order > b.order) return 1;
		    if(a.order < b.order) return -1;
		    return 0;
		});
	}

	var data = {success:d};
	renderAllTodo(data,'no');
}

var gbl_pernot_data;
var gbl_pernot_id;
var pernot_trn = {};
var staffer_id = $('#staffer_id').val();
var partner_id = $('#partner_id').val();
var admin_id = $('#admin_id').val();
var personal_note = {
	start:function(id, blckData){
		$('.p_note_trans').each(function(){
			var v = $(this).val();
			var id = $(this).attr('id');
			pernot_trn[id] = v;
		});
		gbl_pernot_id = id;
		gbl_pernot_data = blckData;
		var params = {
			where:{
				partner_id:partner_id,
				staffer_id:staffer_id,
				admin_id:admin_id,
			},
			order:'id DESC'
		};
		var total_params = {
			data:params,
			model:'partnerPersonalNotes',
			action:'find',
			emitevent:'partnerPersonalNotesGet'
		};

		socket.emit('crud', total_params);
		socket.once('partnerPersonalNotesGet',function(data){
			//console.log('datatat',data);
			if(data.error == null){

				personal_note.createHtml(data.success);
			}
			
		});
	},
	createHtml:function(data=[]){
		var  html = '';
		html += '<div class="portlet box green">';
			html += '<div class="portlet-title">';
			//console.log('gbl_pernot_datagbl_pernot_data',gbl_pernot_data);
				html += '<div class="caption"><i class="icon-list-alt"></i>';
					html += ''+checkNull($('input[name="title_'+gbl_pernot_data.id+'"]').val())+'';
				html += '</div>';
				html += '<div class="actions" style="margin-top: 2px;">';
					//html += '<a class="btn" onclick="personal_note.generatePopup(\'add\')">'+pernot_trn.p_add+'</a>';
					var config = {};
					try{
						config = JSON.parse(gbl_pernot_data.show_content);
					}
					catch(e){

					}
					//console.log('config',config);
					var color = '';
					if(checkNull(config.color) != ''){
						color = config.color;
					}		
					html += '<a href="javascript:;" style="color:#fff" onclick="personal_note.makeFull()"><i class="icon-fullscreen"></i></a>';
				html += '</div>';
			html += '</div>';
			html += '<div class="portlet-body">';
				html += '<a id="add_personal_note" data-id="0" style="border:none"></a>';
			html += '</div>';
		html += '</div>';

		$(gbl_pernot_id).html(html);
		personal_note.bindEvents(data);

		if(checkNull(color) != ''){
			var a = $('#add_personal_note').attr('style');
			$('#add_personal_note').removeAttr('style');
			if(checkNull(a) == ''){
				a = '';
			}
			//console.log('a',a);
			a += 'color:'+color+'!important;';
			$('#add_personal_note').attr('style',a);

			$('#add_personal_note').attrchange({
			    trackValues: true, /* Default to false, if set to true the event object is 
			                updated with old and new value.*/
			    callback: function (event) { 
			       //console.log('test');
			    }        
			});
		}
		
	},
	bindEvents:function(data=[]){
		socket.on('partnerPersonalNotesAdd',function(data){			
			if(data.error==null){
				if(data.success.partner_id == partner_id && data.success.staffer_id == staffer_id){
					var d = data.success;
					$('#add_personal_note').attr('data-id',d.id);
					$('#add_personal_note').editable('setValue',d.note);
				}
			}
		});
		var value = '';
		var id = '';
		
		if(data.length != 0 ){
			if(data[0].partner_id == partner_id && data[0].staffer_id == staffer_id){
				var value = data[0].note;
				var id = data[0].id;
			}
		}
		if(id != '' && id !=undefined && id !=null){
			$('#add_personal_note').attr('data-id',id);
		}
		
		$(gbl_pernot_id).css({
			overflow:'hidden',
			border: 'none',
			'background-color':'#ffffff'
		}).find('.portlet').css({
			'float':'left',
			'width':'100%',
			'height':'100%',
			'box-sizing':'border-box'
		});

		var a  = $(gbl_pernot_id).outerHeight() - $(gbl_pernot_id +' .portlet-title').outerHeight()-5;
		
		$(gbl_pernot_id).find('.portlet-body').slimScroll({destroy:true});
		
		$(gbl_pernot_id).find('.portlet-body').slimScroll({height:a+'px'});
		$(gbl_pernot_id).find('.portlet-body').css({
			height:a - 10 +'px',//10padding
			'text-align':'left',
			'padding' : '5px',
		});
		$(gbl_pernot_id).find('.portlet-body').parent().css({
			height:a+'px'
		});
		
		$(gbl_pernot_id+' a#add_personal_note').css({
			'word-break':' break-all',
			'word-wrap': 'break-word',
		});
		personal_note.makeEdit(value,id);
	},
	makeEdit:function(value,id){
		var d = $(gbl_pernot_id).outerHeight() - $(gbl_pernot_id +' .portlet-title').outerHeight() - 20;
		var w = $(gbl_pernot_id).width();
		$('#add_personal_note').editable('destroy')
		if(d > 220 && w > 220){
			$('#add_personal_note').editable({
				type:'wysihtml5',
				showbuttons:'bottom',
				mode:'inline',
				value:value,
				emptytext:pernot_trn.p_addpersonnote,
				placeholder:pernot_trn.p_note,
				validate:function(value){					
				},
				success: function(data, config) {
				 	var id = $(this).attr('data-id');
				 	personal_note.saveNote(config,id);
				 	//customer_custom_fields.saveNote(config,'edit',id);
				},
			});
			
		}else{
			$('#add_personal_note').editable({
				type:'wysihtml5',
				showbuttons:'bottom',
				value:value,
				container: 'div#show_partner_dashboard_data',
				emptytext:pernot_trn.p_addpersonnote,
				placeholder:pernot_trn.p_note,
				validate:function(value){					
				},
				success: function(data, config) {
				 	var id = $(this).attr('data-id');
				 	personal_note.saveNote(config,id);
				},
			});	
		}

		$('#add_personal_note').on('hidden', function(e, editable) {
			var a  = $(gbl_pernot_id).outerHeight() - $(gbl_pernot_id +' .portlet-title').outerHeight()-5;
			$(gbl_pernot_id).find('.portlet-body').slimScroll({destroy:true});
			 $(gbl_pernot_id).find('.portlet-body').slimScroll({height:a+'px'});
			 $(gbl_pernot_id).find('.portlet-body').css({
				height:a -10 +'px',//10padding
				'text-align':'left',
				'padding' : '5px',
			});
			$(gbl_pernot_id).find('.portlet-body').parent().css({
				height:a+'px'
			});
		});
		
		$('#add_personal_note').on('shown', function(e, editable) {			
			var a  = $(gbl_pernot_id).outerHeight() - $(gbl_pernot_id +' .portlet-title').outerHeight()-5;
			$(gbl_pernot_id).find('.portlet-body').css({
				height:a - 10 +'px',//10padding
				'text-align':'left',
				'padding' : '5px',
			});
			$(gbl_pernot_id).find('.portlet-body').parent().css({
				height:a+'px'
			});

			$(gbl_pernot_id).find('div.editable-buttons').css({
				position: 'absolute',
    			bottom: 0,
			});

			var a = $(gbl_pernot_id).outerHeight() - $(gbl_pernot_id +' .portlet-title').outerHeight() - 20;
			var b = $(gbl_pernot_id).find('.wysihtml5-toolbar').outerHeight();
			var c = $(gbl_pernot_id).find('div.editable-buttons').outerHeight();
			var d = a - (b + c);

			$('iframe.wysihtml5-sandbox').css({
				height:d+'px',
				width:'100%',
			});
			$(gbl_pernot_id+' .editable-container').css('width','100%');
			$(gbl_pernot_id+' .editable-input').css({
				'width':'100%',
				'padding-left':'10px',
				'padding-right':'10px'
			});

			$(gbl_pernot_id+' .editable-buttons').css({
				'padding-left':'10px',
				'padding-right':'10px'
			});
			$('a[data-wysihtml5-command="insertUnorderedList"],a[data-wysihtml5-command="insertOrderedList"],a[data-wysihtml5-command="Outdent"],a[data-wysihtml5-command="Indent"]').css({
				'padding':'9.6px 14px'
			});
			$('a[data-wysihtml5-command="createLink"],a[data-wysihtml5-command="insertImage"]').css({
				'padding':'9.6px 14px'
			});

			setTimeout(function(){
				var a = $(gbl_pernot_id).outerHeight() - $(gbl_pernot_id +' .portlet-title').outerHeight() - 20;
				var b = $(gbl_pernot_id).find('.wysihtml5-toolbar').outerHeight();
				var c = $(gbl_pernot_id).find('div.editable-buttons').outerHeight();
				var d = a - (b + c);

				$('iframe.wysihtml5-sandbox').css({
					height:d+'px',
					width:'100%',
				})
			},1);
		});
	},
	saveNote:function(data,id=0){
		var partner_id =$('#partner_id').val();
		var admin_id = $('#admin_id').val();
		var staffer_id =$('#staffer_id').val();

		var params = {
			admin_id:admin_id,
			partner_id:partner_id,
			staffer_id:staffer_id,
			note:data,
			id:id
		};
		//due_date: moment().format('YYYY-MM-DD hh:mm:ss'),
		var total_params = {
			data:params,
			model:'partnerPersonalNotes',
			action:'upsert',
			emitevent:'partnerPersonalNotesAdd'
		};
		socket.once('partnerPersonalNotesAdd',function(data){
			hideProcessingImage();
			if(data.error==null){
				if(data.success.partner_id == partner_id && data.success.staffer_id == staffer_id){
					call_toastr('success',dshbrd_suc, pernot_trn.p_note_suc);
				}
			}
		});
		showProcessingImage('undefined');
		socket.emit('crud',total_params);
	},
	generatePopup:function(frm='add'){
		var popup = 'popups';
		var html = '';
		html += '<div class="modal-header">';
			html += '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>';
			html += '<h3>';
				if(frm == 'add'){
					html += pernot_trn.p_note_add;
				}
				else if(frm == 'edit'){
					html += pernot_trn.p_note_edit;
				}
			html += '</h3>';
		html += '</div>';

		html += '<div class="modal-body">';
			html += '<div class="row-fluid">';
				html += '<div class="span12">';
					html += '<div class="portlet-body form">';
						html += '<form action="/" class="form-horizontal form-view" style="margin-bottom:0px;" id="pernote_add_form" method="post" accept-charset="utf-8">';

							html += '<div class="control-group">';
								html += '<label class="control-label">'+pernot_trn.p_note+'</label>';	
								html += '<div class="controls">';
									html += '<textarea name="p_note" rows="6" class="m-wrap span10" cols="30" id="p_note"></textarea>';
								html += '</div>';
							html += '</div>';

						html += '</form>';
					html += '</div>';
				html += '</div>';
			html += '</div>';
		html += '</div>';

		html += '<div class="modal-footer">';
			html += '<div class="btn-group">';
				html += '<button class="btn blue" type="button" id="order_addnote_save">';
					html += pernot_trn.p_save;
					html += '<i class="m-icon-swapright m-icon-white"></i>';
				html += '</button>';
				html += '<button data-dismiss="modal" class="btn btn_clear" type="button"><i class="icon-remove"></i>';
					html += pernot_trn.p_cancel;
				html += '</button>';
			html += '</div>';
		html += '</div>';
		html += '<style>';
			html += 'a[data-wysihtml5-command="insertImage"]{display:none;}';
			html += 'a[data-wysihtml5-command="insertUnorderedList"],a[data-wysihtml5-command="insertOrderedList"],a[data-wysihtml5-command="Outdent"],a[data-wysihtml5-command="Indent"],a[data-wysihtml5-command="createLink"]{padding:8.6px 14px}';			
		html += '</style>';

		

	    $('#'+popup).html(html);

		$('#'+popup).modal().on("hidden", function() {
			$('#'+popup).empty();
		});

		var modalOverflow = $(window).height() - 10 < $('#'+popup).height();
            
		if (modalOverflow) {
			$('#'+popup)
				.css('margin-top', 0)
				.addClass('modal-overflow');
		} else {
			$('#'+popup)
				.css('margin-top', 0 - $('#'+popup).height() / 2)
				.removeClass('modal-overflow');
		}

		$('#pernote_add_form #p_note').wysihtml5();
	},
	makeFull:function(){
		//console.log('gbl_pernot_id',gbl_pernot_id);
		if($(gbl_pernot_id).hasClass('make_fullscreen')){
			var a = $(gbl_pernot_id).attr('style');
			a = a.replace('z-index:10109 !important','');
			$(gbl_pernot_id).attr('style',a);

			$(gbl_pernot_id).removeClass('make_fullscreen');
			
			var a  = $(gbl_pernot_id).outerHeight() - $(gbl_pernot_id +' .portlet-title').outerHeight()-5;
			$(gbl_pernot_id).find('.portlet-body').slimScroll({destroy:true});
			 $(gbl_pernot_id).find('.portlet-body').slimScroll({height:a+'px'});
			 $(gbl_pernot_id).find('.portlet-body').css({
				height:a+'px',
				'text-align':'left',
				'padding' : '5px',
			});
			$(gbl_pernot_id).find('.portlet-body').parent().css({
				height:a+'px'
			});

		}
		else{
			var a = $(gbl_pernot_id).attr('style');
			a = a + 'z-index:10109 !important';
			$(gbl_pernot_id).attr('style',a);
			$(gbl_pernot_id).addClass('make_fullscreen');

			var a  = $(gbl_pernot_id).outerHeight() - $(gbl_pernot_id +' .portlet-title').outerHeight()-5;
			$(gbl_pernot_id).find('.portlet-body').slimScroll({destroy:true});
			 $(gbl_pernot_id).find('.portlet-body').slimScroll({height:a+'px'});
			 $(gbl_pernot_id).find('.portlet-body').css({
				height:a+'px',
				'text-align':'left',
				'padding' : '5px',
			});
			$(gbl_pernot_id).find('.portlet-body').parent().css({
				height:a+'px'
			});
		}
		personal_note.makeEdit();
	}
}