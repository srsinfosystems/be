$( document ).ready(function(){
  var partner_id = $('#partner_id').val();
  var window_height = $(document).height();
  var window_width = $('#content').width();
  window_height = window_height;
  window_width = window_width;
  window.show_helper = '0';
  window.slipaddcount = '0';
	// window.window_width =$('#can_width').val();
	// window.window_height = $('#can_height').val();
  // $('#svg3').css({'width':window.window_width+'px'});
  // $('#svg3').css({'height':window.window_height+'px'});
  // $('body').css('width',parseInt(parseInt(window.window_width)+60)+'px');
  window.canvas1 = new fabric.Canvas('c1');

  var src = '/img/graphpaper1.gif';
  window.canvas1.setBackgroundColor({
  source: src,
  repeat: 'repeat',
}, window.canvas1.renderAll.bind(window.canvas1));

var pathname = window.location.host;
 window.meterImg = '//'+pathname+'/img/metericon-b.png';
 window.userImg = '//'+pathname+'/img/user-icon.png';

//Move selected boject using keyboard
const STEP = 1;
var Direction = {
  LEFT: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3
};

// fabric.util.addListener(document.body, 'keydown', function(options) {
//   if (options.repeat) {
//     return;
//   }

//   var msg = $('.msg').val();
//   var msg_head = $('.msg_head').val();
//   var key = options.which || options.keyCode; // key detection
//   if (key === 37) { // handle Left key
//     options.preventDefault();
//     moveSelected(Direction.LEFT);
//   } else if (key === 38) { // handle Up key
//     options.preventDefault();
//     moveSelected(Direction.UP);
//   } else if (key === 39) { // handle Right key
//     options.preventDefault();
//     moveSelected(Direction.RIGHT);
//   } else if (key === 40) { // handle Down key
//     options.preventDefault();
//     moveSelected(Direction.DOWN);
//   }  else if (key === 46) { // handle Down key
//     	if(window.canvas1.getActiveObject().name == 'slip' || window.canvas1.getActiveObject().name == 'meter_slip' || window.canvas1.getActiveObject().name == 'cust_slip' || window.canvas1.getActiveObject().name == 'cust_meter_slip')
// 	{
// 		 var id = window.canvas1.getActiveObject().id;
// 		var index = window.slip_id_arr.indexOf(id);
// 	if (index > -1) {
// 	    window.slip_id_arr.splice(index, 1);
// 	}
// 	var dock_id = jQuery("#dock_name option:selected").val();
// if(dock_id == ''){var dock_id = jQuery("#dock_name option:first").val();}
// 	get_slipdata(dock_id);
// 	} 

//       if(window.canvas1.getActiveObject().name == 'p0' || window.canvas1.getActiveObject().name == 'p1' || window.canvas1.getActiveObject().name == 'p2')
//       {
//         var id = window.canvas1.getActiveObject().id;
//         window.canvas1.forEachObject(function(obj){
//              if((obj.name == 'Curve' && obj.id == id) || (obj.name == 'p1' && obj.id == id) || (obj.name == 'p0' && obj.id == id) || (obj.name == 'p2' && obj.id == id)){
//                window.canvas1.fxRemove(obj);
//                jQuery('.tool-tip').hide();
//               }
//           });
//       }
//       window.canvas1.remove(window.canvas1.getActiveObject());
//       jQuery('.tool-tip').hide();
    
// }
// else if (options.ctrlKey && options.keyCode == 67) { // handle cltr+c key
//   if(!window.canvas1.getActiveObject()){
//       showAlertMessage(msg,'error',msg_head);
//       return;
//     }
//   }
//   else if (options.ctrlKey && options.keyCode == 86) { // handle cltr+v key
//     clickcount++;
//     if(window.canvas1.getActiveGroup()){
      
//     } else if(window.canvas1.getActiveObject()) {
//       if(window.canvas1.getActiveObject().name !== 'slip' || window.canvas1.getActiveObject().name !== 'meter_slip' || window.canvas1.getActiveObject().name !== 'cust_slip' || window.canvas1.getActiveObject().name !== 'cust_meter_slip')
//         {
//           if(window.canvas1.getActiveObject().name == 'p0' || window.canvas1.getActiveObject().name == 'p1' || window.canvas1.getActiveObject().name == 'p2')
//             {

//             }
//           var id = window.canvas1.getActiveObject().id;
//           var name = window.canvas1.getActiveObject().name;
//           var clone = fabric.util.object.clone(window.canvas1.getActiveObject());
//                           clone.set({left: window.canvas1.getActiveObject().left+Math.random()*10,top: window.canvas1.getActiveObject().top+Math.random()*10,id:id+"_"+Math.random()+1});
//                             clone.setCoords();
//                             window.canvas1.add(clone); 
//                             window.canvas1.renderAll();
//         } 
      
//     }
//     else if(!window.canvas1.getActiveObject()){
//       showAlertMessage(msg,'error',msg_head);
//     }
//   }
// });

function moveSelected(direction) {

  var activeObject = window.canvas1.getActiveObject();
  //var activeGroup = window.canvas1.getActiveGroup();

  if (activeObject) {
	get_helper_line(activeObject);
    switch (direction) {
      case Direction.LEFT:
        activeObject.set('left',activeObject.left - STEP);
        break;
      case Direction.UP:
        activeObject.set('top',activeObject.top - STEP);
        break;
      case Direction.RIGHT:
        activeObject.set('left',activeObject.left + STEP);
        break;
      case Direction.DOWN:
        activeObject.set('top',activeObject.top + STEP);
        break;
    }
    activeObject.setCoords();
    window.canvas1.renderAll();
    //console.log('selected objects was moved');
  } 
  // else if (activeGroup) {
  //   switch (direction) {
  //     case Direction.LEFT:
  //       activeGroup.setLeft(activeGroup.getLeft() - STEP);
  //       break;
  //     case Direction.UP:
  //       activeGroup.setTop(activeGroup.getTop() - STEP);
  //       break;
  //     case Direction.RIGHT:
  //       activeGroup.setLeft(activeGroup.getLeft() + STEP);
  //       break;
  //     case Direction.DOWN:
  //       activeGroup.setTop(activeGroup.getTop() + STEP);
  //       break;
  //   }
  //   activeGroup.setCoords();
  //   window.canvas1.renderAll();
  //   //console.log('selected group was moved');
  // }
  else {
    //console.log('no object selected');
  }

}

var line, isDown,mode,origX, origY;
mode = 'select';
window.canvas1.off('mouse:down');
    window.canvas1.off('mouse:move');
    window.canvas1.off('mouse:up');
    window.canvas1.renderAll();
//select mode
jQuery(".select").click(function(){
    mode="select";   
    isDown = false;
    window.canvas1.forEachObject(function(obj){
              obj.set({selectable:true});
              console.log(obj);
              
           });
    console.log(window.slip_id_arr);
    window.canvas1.off('mouse:down');
    window.canvas1.off('mouse:move');
    window.canvas1.off('mouse:up');
    window.canvas1.renderAll();
    window.canvas1.selection = true;
});

//on mouseover
window.canvas1.on('mouse:over', function(options) {
  if (options.target) {
    //console.log('an object was clicked! ', options.target.type);    
    if(options.target.name == 'slip' || options.target.name == 'cust_slip' || options.target.name == 'meter_slip' || options.target.name == 'cust_meter_slip'){
      //showImageTools(options);
    }
  }
});

//on mouseout
window.canvas1.on('mouse:out', function(options) {
  jQuery('.tool-tip').hide(); 
});

//on mouse dblclick
// window.canvas1.on('mouse:dblclick', function(options) {
//   jQuery('.tool-tip').hide(); 
//   if(options.target.name == 'slip' || options.target.name == 'meter_slip' || options.target.name == 'cust_meter_slip')
//   {
//     slip_id = options.target.id;
//     dockarr = slip_id.split("@");
//     flag = dockarr[2];
//     slipdbid = dockarr[1];
//     variable_arr = dockarr[0].split("_");
//     dockdbid = variable_arr[2];
//     if(flag != 'new'){
//     $('#show_modal').attr('data-url','/partner/maps/edit_slip/'+slipdbid+'');
//     $( "#show_modal" ).trigger( "click" );
//     }
//     else
//     {
//       showAlertMessage('Cannot edit new slip, delete the item and add it again','error','Alert message');
//     }
//   }
// });

//resize canvas
$('#update_canvas').on('click',function(){
	// window.window_width =$('#can_width').val();
	// window.window_height = $('#can_height').val();
	// $('#svg3').css({'width':window.window_width+'px'});
	// $('#svg3').css({'height':window.window_height+'px'});
	//$('body').css('width',parseInt(parseInt(window.window_width)+60)+'px');
	// window.canvas1.setHeight(window.window_height);
	// window.canvas1.setWidth(window.window_width);
	/*var partner_id = $('#partner_id').val();
	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var lang = $('#lang').val();
	var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&canvas_width='+window.window_width+'&canvas_height='+window.window_height;		      
	var data = passProdRequest(APISERVER+'/api/recent_activities/resizeCanvas.json',total_params);
	if(data == undefined){
		var json_data = $('#json_data').val();
		var data = JSON.parse(json_data);
		var slip_html = '';
		data.response.status = is_undefined(data.response.status);
		if(data.response.status == 'success'){
			console.log(data.response.response);	
		}
	}*/
});


function showImageTools (e) {
    toolhtml = '';
    slip_id = e.target.id;
    slip_type = e.target.name;
    if(slip_type == "slip")
    {
          dockarr = slip_id.split("@");
          variable_arr = dockarr[0].split("_");
	  slipid = dockarr[1]; 
	  dockid = variable_arr[1];  
    }
    else if(slip_type == "cust_slip")
    {
          dockarr = slip_id.split("@");
          variable_arr = dockarr[0].split("_");
    slipid = dockarr[1]; 
    dockid = variable_arr[1]; 
    customerid = variable_arr[2];
    }
    else if(slip_type == "meter_slip")
    {
          dockarr = slip_id.split("@");
          variable_arr = dockarr[0].split("_");
	  slipid = dockarr[1]; 
	  dockid = variable_arr[1]; 
	  meterid = variable_arr[2];
    }
    else if(slip_type == "cust_meter_slip")
    {
          dockarr = slip_id.split("@");
          variable_arr = dockarr[0].split("_");
	  slipid = dockarr[1]; 
	  dockid = variable_arr[1]; 
	  meterid = variable_arr[2];
	  customerid = variable_arr[3];
          
    }
	var partner_id = $('#partner_id').val();
	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var lang = $('#lang').val();
	var total_params = 'token='+token+'&language='+language+'&lang='+lang+'&partner_id='+partner_id+'&slip_id='+slipid;		      
	var data = passProdRequest(APISERVER+'api/recent_activities/getAllSlipRelatedData.json',total_params);
	if(data == undefined){
		var json_data = $('#json_data').val();
		var data = JSON.parse(json_data);
		var slip_html = '';
		data.response.status = is_undefined(data.response.status);
		if(data.response.status == 'success'){
			//console.log(data.response.response.slip_data);
			if(data.response.response.slip_data[0].Customer && data.response.response.slip_data[0].PartnerMeter){
				customer_name = data.response.response.slip_data[0].Customer.customer_name;
				meter_name = data.response.response.slip_data[0].PartnerMeter.meter_name;
				slip_name = data.response.response.slip_data[0].PartnerSlip.slip_name;
				dock_name = data.response.response.slip_data[0].PartnerDock.dock_name;
				  toolhtml += '<p>Dock Name : '+dock_name+'</p>';
				  toolhtml += '<p>Slip Name : '+slip_name+'</p>';
				  toolhtml += '<p>Meter Name : '+meter_name+'</p>';
				  toolhtml += '<p>Customer Name : '+customer_name+'</p>';
			}
      else if(data.response.response.slip_data[0].Customer){
        customer_name = data.response.response.slip_data[0].Customer.customer_name;
        //meter_name = data.response.response.slip_data[0].PartnerMeter.meter_name;
        slip_name = data.response.response.slip_data[0].PartnerSlip.slip_name;
        dock_name = data.response.response.slip_data[0].PartnerDock.dock_name;
          toolhtml += '<p>Dock Name : '+dock_name+'</p>';
          toolhtml += '<p>Slip Name : '+slip_name+'</p>';
          //toolhtml += '<p>Meter Name : '+meter_name+'</p>';
          toolhtml += '<p>Customer Name : '+customer_name+'</p>';
      }
			else if(data.response.response.slip_data[0].PartnerMeter){
				meter_name = data.response.response.slip_data[0].PartnerMeter.meter_name;
				slip_name = data.response.response.slip_data[0].PartnerSlip.slip_name;
				dock_name = data.response.response.slip_data[0].PartnerDock.dock_name;
				  toolhtml += '<p>Dock Name : '+dock_name+'</p>';
				  toolhtml += '<p>Slip Name : '+slip_name+'</p>';
				  toolhtml += '<p>Meter Name : '+meter_name+'</p>';
			}
			else
			{
				slip_name = data.response.response.slip_data[0].PartnerSlip.slip_name;
				dock_name = data.response.response.slip_data[0].PartnerDock.dock_name;
				  toolhtml += '<p>Dock Name : '+dock_name+'</p>';
				  toolhtml += '<p>Slip Name : '+slip_name+'</p>';
			}
		}
	}
    jQuery('.tool-tip').html(toolhtml);
    moveImageTools(e);
};

function moveImageTools (e) {
    var w = $('.tool-tip').width();
    var h = $('.tool-tip').height();
    //var e = window.canvas1.getActiveObject();
    var coords = getObjPosition(e);
    // -1 because we want to be inside the selection body
    var top = coords.top - 1;
    var left = coords.left - 1;
    if(e.target.name == 'slip' ){
      var scalaeval = e.target._objects[0].group.scaleX;
      var font_size = e.target._objects[1].fontSize;
      var tooltip_fs = (font_size * scalaeval)+'px';
    }
    else if(e.target.name == 'meter_slip' || e.target.name == 'cust_slip'){
      var scalaeval = e.target._objects[0].group.scaleX;
      var font_size = e.target._objects[2].fontSize;
      var tooltip_fs = (font_size * scalaeval)+'px';
    }
    else if(e.target.name == 'cust_meter_slip'){
      var scalaeval = e.target._objects[0].group.scaleX;
      var font_size = e.target._objects[3].fontSize;
      var tooltip_fs = (font_size * scalaeval)+'px';

    }else{
    var tooltip_width = (e.target.width * e.target.scaleX);
    var tooltip_fs = '12px';
    }
    $('.tool-tip').show();
    $('.tool-tip').css({top: top, left: left, width: tooltip_width, fontSize: tooltip_fs });
}
function getObjPosition (e) {
    // Get dimensions of object
    var rect = e.target.getBoundingRect();
    // We have the bounding box for rect... Now to get the window.canvas1 position
    var offset = window.canvas1.calcOffset();
    // Do the math - offset is from $(body)
    var bottom = offset._offset.top + rect.top + rect.height;
    var right = offset._offset.left + rect.left ;
    var left = offset._offset.left + rect.left+ rect.width  + 20;
    var top = offset._offset.top + rect.top + 19;
    return {left: left, top: top, right: right, bottom: bottom};
}

//on select
window.canvas1.on('object:selected', function(options) {
  jQuery('.helperline1').hide();
  if (options.target) {
    $(Def.init);
    jQuery('#obj_border').val(options.target.strokeWidth);
    if(window.show_helper == '0')
    {
    	get_helper_line(options.target);
    }
    //get_helper_line(options.target);
    //console.log('an object was clicked! ', options.target.type);
    if(options.target.name == 'slip' || options.target.name == 'meter_slip' || options.target.name == 'cust_slip' || options.target.name == 'cust_meter_slip' ){
        jQuery('.shape_detail').hide();
      }
      else if(options.target.type != 'group')
      {
        jQuery('.shape_detail').show();
        jQuery('#obj_height,.hlabel,#obj_width,.wlabel').hide();
      }
  }
});

//Show border property box on obj select and change border
jQuery('#obj_border').on('change',function(options){
  var activeObject = window.canvas1.getActiveObject();
  var border_width = jQuery('#obj_border').val();
  //console.log(activeObject);
  if(activeObject.name == 'p0' || activeObject.name == 'p1' || activeObject.name == 'p2')
  {
    window.canvas1.forEachObject(function(obj){
             if((obj.name == 'Curve')){
               obj.set({strokeWidth:parseFloat(border_width)});
              }
          });
  }
  else if(activeObject.name != 'slip' || activeObject.name != 'meter_slip' ||activeObject.name != 'cust_slip' || activeObject.name != "cust_meter_slip" || activeObject.name != 'text')
  {
    activeObject.set({strokeWidth:parseFloat(border_width)});
  }
  window.canvas1.renderAll();
});

//on drop
/*window.canvas1.on('object:modified', function(options) {
  if (options.target) {
    //console.log('an object was moved! ', options.target.type);
      if(options.target.name == 'slip'){
        options.target.set({strokeWidth:1,stroke:'#0053a7',fill:'#0053a7'});
        showImageTools(options);      
      }
      else if(options.target.name == 'meter_slip'){
        options.target.set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
        showImageTools(options);
      }
      else if(options.target.name == 'cust_meter_slip' && options.target.type === 'rect'){
        options.target.set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
        showImageTools(options);
      }
      else if(options.target.name == 'cust_meter_slip' && (options.target.type === 'triangle' || options.target.type === 'polygon')){
        options.target.set({strokeWidth:1,stroke:'black',fill:'black'});
        showImageTools(options);
      }
      else
      {
        options.target.set({stroke:'black',fill:'transparent'});        
      }
  }
});*/
window.canvas1.on('object:modified', function(options) {
  jQuery('.helperline1').hide();
  jQuery('.helperline').hide();
  if (options.target) {
    //console.log('an object was moved! ', options.target.type);
      if(options.target.name == 'slip' || options.target.name == 'cust_slip'){
                  options.target._objects[0].set({strokeWidth:1,stroke:'black',fill:'transparent'});  
                  options.target._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
                  //showImageTools(options);     
                  }
                  else if(options.target.name == 'meter_slip'){
                    options.target._objects[0].set({strokeWidth:1,stroke:'black',fill:'transparent'});
                    options.target._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
                   // showImageTools(options);
                  }
                  else if(options.target.name == 'cust_meter_slip' ){
                    options.target._objects[0].set({strokeWidth:1,stroke:'black',fill:'transparent'});
                    options.target._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
                    //showImageTools(options);
                    //obj._objects[0].set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
                    //obj._objects[1].set({strokeWidth:1,stroke:'black'});
                  }
      else if( options.target.name == 'text')
      {
       //jQuery('.shape_detail').hide();
        options.target.set({fill:'#000',stroke: '#000',strokeWidth: 1});
      }
      else
      {
        options.target.set({stroke:'black',fill:'transparent'});        
      }
  }
});
//on moving
$(function(){

 window.canvas1.on('object:moving', function(options) {
  jQuery('.tool-tip').hide();
  var obj =  options.target;
 
  if (options.target) {

get_helper_line(options.target);
    //console.log('an object was moving! ', options.target.type);
  if(options.target.name == 'cust_meter_slip' || options.target.name == 'meter_slip' || options.target.name == 'slip' || options.target.name == 'cust_slip'){
        //options.target._objects[0].set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
        //options.target._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
  options.target._objects[0].set({stroke:'red',fill:'transparent'});
}
else if( options.target.name == 'text')
      {
       //jQuery('.shape_detail').hide();
        options.target.set({fill:'red',stroke: 'red',strokeWidth: 1});
      }
else
{
    options.target.set({stroke:'red',fill:'transparent'});
}
  }


// //snap to position code
// obj.setCoords();
// activeObject = window.canvas1.getActiveObject();
// window.objleft_arr = [];
// window.canvas1.forEachObject(function (targ) {  
//     var objects = window.canvas1.getObjects(),
//         i = objects.length;  
//         for(var t=0; t<i; t++){
//           window.objleft_arr.push(objects[t].left);
//         }
        
//     if(activeObject.left == targ.left){
//       jQuery('.helperline.vert-left').css({border:'1px solid green'});
//     }
//     else
//     {
//       jQuery('.helperline.vert-left').css({border:'1px solid yellow'}); 
//     }


// });
 });

Def = {
    canvas: null,    
    rect: null,
    lines: {
        top: null, 
        left: null,
        right: null,
        bottom: null
    },
    init: function () {
        //canvas = new fabric.Canvas('c');

        window.canvas1.on('object:moving', Def.events.objectMoving);
        window.canvas1.on('object:added', Def.events.objectMoving);

        
    },
    events: {
        objectMoving: function (e) {
            //Get the object being manipulated
            var obj = e.target;
            if(obj.get('type') === 'group'){
            //Set up an object representing its current position
            var curPos = {
                top: parseInt(obj.get('top')),
                left: parseInt(obj.get('left')),
                right: parseInt(obj.get('left') + obj.get('width')),
                bottom: parseInt(obj.get('top') + obj.get('height'))
            };

            //Set up an object that will let us be able to keep track of newly created lines
            var matches = {
                top: false,
                left: false,
                right: false,
                bottom: false
            }

            //Get the objects from the canvas
            var objects = window.canvas1.getObjects();

            //For each object
            for (var i in objects) {
              //console.log(objects[i].type);
                //If the object we are looing at is a line or the object being manipulated, skip it
                if (objects[i] === obj || objects[i].get('type') === 'line' || objects[i].get('type') === 'rect' || objects[i].get('type') === 'triangle' || objects[i].get('type') === 'circle' || objects[i].get('type') === 'path' || objects[i].get('type') === 'text'  ) { continue; }

                //Set up an object representing the position of the canvas object
                var objPos = {
                    top: parseInt(objects[i].get('top')),
                    left: parseInt(objects[i].get('left')),
                    right: parseInt(objects[i].get('left') + obj.get('width')),
                    bottom: parseInt(objects[i].get('top') + obj.get('height'))
                }

                //Look at all 4 sides of the object and see if the object being manipulated aligns with that side.

                //Top////////////////////////////////////
                if (Def.inRange(objPos.top, curPos.top)) {
                    //We match. If we don't already have aline on that side, add one.
                    if (!Def.lines.top) {
                        Def.drawLine('top', objPos.top);
                        //Keep track of the fact we found a match so we don't remove the line prematurely.
                        matches.top = true;
                        //Snap the object to the line
                        obj.set('top', objPos.top).setCoords();
                        obj._objects[0].set('stroke','green');
                    }
                }               
                //Left////////////////////////////////////
                if (Def.inRange(objPos.left, curPos.left)) {
                    if (!Def.lines.left) {
                        Def.drawLine('left', objPos.left);                        
                        matches.left = true;
                        obj.set('left', objPos.left).setCoords();
                        obj._objects[0].set('stroke','green');
                    }
                }                
                //Right////////////////////////////////////
                if (Def.inRange(objPos.right, curPos.right)) {
                    if (!Def.lines.right) {
                        Def.drawLine('right', objPos.right);                        
                        matches.right = true;                        
                        obj.set('left', objPos.right - objects[i].get('width')).setCoords();
                        obj._objects[0].set('stroke','green');
                    }
                }                
                //Bottom////////////////////////////////////
                if (Def.inRange(objPos.bottom, curPos.bottom)) {
                    if (!Def.lines.bottom) {
                        Def.drawLine('bottom', objPos.bottom);                        
                        matches.bottom = true;
                        obj.set('top', objPos.bottom - objects[i].get('height')).setCoords();
                        obj._objects[0].set('stroke','green');
                    }
                }

                //Look at the side we matched on. If we did not match, and we have a line, remove the line.
                for (var i in matches) {
                    var m = matches[i];
                    var line = Def.lines[i]; 
                    if (!m && line) {
                        window.canvas1.remove(line);
                        Def.lines[i] = null;
                    }

                }

            }
            window.canvas1.renderAll();
        }
      }
    },
    drawLine: function (side, pos) {
        var ln = null
        // switch (side) {
        //     case 'top':
        //         ln = new fabric.Line([window.canvas1.get('width'), 0, 0, 0], {
        //             left: 0,
        //             top: pos,
        //             stroke: 'green'
        //         });
        //         Def.lines.top = ln;
        //         jQuery('.helperline.vert-left').css({border:'1px solid yellow'});
        //         jQuery('.helperline.vert-right').css({border:'1px solid yellow'});
        //         jQuery('.helperline.horz-top').css({border:'1px solid green'});
        //         jQuery('.helperline.horz-bottom').css({border:'1px solid yellow'});
        //         break;
        //     case 'left':
        //         ln = new fabric.Line([0, window.canvas1.get('height'), 0, 0], {
        //             left: pos,
        //             top: 0,
        //             stroke: 'green'
        //         });
        //         Def.lines.left = ln;
        //         jQuery('.helperline.vert-left').css({border:'1px solid green'});
        //         jQuery('.helperline.vert-right').css({border:'1px solid yellow'});
        //         jQuery('.helperline.horz-top').css({border:'1px solid yellow'});
        //         jQuery('.helperline.horz-bottom').css({border:'1px solid yellow'});
        //         break;
        //     case 'right':
        //         ln = new fabric.Line([0, window.canvas1.get('height'), 0, 0], {
        //             left: pos,
        //             top: 0,
        //             stroke: 'green'
        //         });
        //         Def.lines.right = ln;
        //         jQuery('.helperline.vert-left').css({border:'1px solid yellow'});
        //         jQuery('.helperline.vert-right').css({border:'1px solid green'});
        //         jQuery('.helperline.horz-top').css({border:'1px solid yellow'});
        //         jQuery('.helperline.horz-bottom').css({border:'1px solid yellow'});
        //         break;
        //     case 'bottom':
        //         ln = new fabric.Line([window.canvas1.get('width'), 0, 0, 0], {
        //             left: 0,
        //             top: pos,
        //             stroke: 'green'
        //         });
        //         Def.lines.bottom = ln;
        //         jQuery('.helperline.vert-left').css({border:'1px solid yellow'});
        //         jQuery('.helperline.vert-right').css({border:'1px solid yellow'});
        //         jQuery('.helperline.horz-top').css({border:'1px solid yellow'});
        //         jQuery('.helperline.horz-bottom').css({border:'1px solid green'});
        //         break;


        //     default:
        //       jQuery('.helperline.vert-left').css({border:'1px solid yellow'});
        //         jQuery('.helperline.vert-right').css({border:'1px solid yellow'});
        //         jQuery('.helperline.horz-top').css({border:'1px solid yellow'});
        //         jQuery('.helperline.horz-bottom').css({border:'1px solid yellow'});
        // }
        //window.canvas1.add(ln).renderAll();
    },
    alignTolerance : 10,
    inRange: function (val1, val2) {
        if ((Math.max(val1, val2) - Math.min(val1, val2)) <= Def.alignTolerance) { 
          return true; }        
        else { return false; }
    }
};


//$(Def.init);


});
//on skewing
window.canvas1.on('object:skewing', function(options) {
  if (options.target) {
get_helper_line(options.target);
    //console.log('an object was skewd! ', options.target.type);
    var o = options.target;
  if (!o.strokeWidthUnscaled && o.strokeWidth) {
    o.strokeWidthUnscaled = o.strokeWidth;
  }
if(options.target.name == 'cust_meter_slip' || options.target.name == 'meter_slip' || options.target.name == 'cust_slip' || options.target.name == 'slip'){
        //options.target._objects[0].set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
        //options.target._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
  options.target._objects[0].set({stroke:'red',fill:'transparent'});
}
else if( options.target.name == 'text')
      {
       //jQuery('.shape_detail').hide();
        options.target.set({fill:'red',stroke: 'red',strokeWidth: 1});
      }
else{
    options.target.set({stroke:'red',fill:'transparent'});
}
    
  }
});
//on scaling
window.canvas1.on('object:scaling', function(options) {
  if (options.target) {    
get_helper_line(options.target);
    var o = options.target;
  if (!o.strokeWidthUnscaled && o.strokeWidth) {
    o.strokeWidthUnscaled = o.strokeWidth;
  }
if(options.target.name == 'cust_meter_slip' || options.target.name == 'meter_slip' || options.target.name == 'cust_slip' || options.target.name == 'slip'){
        //options.target._objects[0].set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
        //options.target._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
  options.target._objects[0].set({stroke:'red',fill:'transparent'});
}
else if( options.target.name == 'text')
      {
       //jQuery('.shape_detail').hide();
        options.target.set({fill:'red',stroke: 'red',strokeWidth: 1});
      }
else{
    options.target.set({stroke:'red',fill:'transparent'});
}
    }
});

//on slection cleared
window.canvas1.on('before:selection:cleared', function(options) { 
jQuery('.helperline').hide(); 
jQuery('.helperline1').hide();
window.show_helper = '0';
  //  var o = options.target;
  // if (!o.strokeWidthUnscaled && o.strokeWidth) {
  //   o.strokeWidthUnscaled = o.strokeWidth;
  // }
  //   if(options.target.name == 'slip'){
  //     options.target.set({strokeWidth:1,stroke:'#0053a7',fill:'#0053a7'});       
  //     }
  //     else if(options.target.name == 'meter_slip'){
  //       options.target.set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
  //     }
  //     else
  //     {
  //       options.target.set({stroke:'black',fill:'transparent'});        
  //     }
      window.canvas1.forEachObject(function(obj){
              if (!obj.strokeWidthUnscaled && obj.strokeWidth) {
                obj.strokeWidthUnscaled = obj.strokeWidth;
              }
                if(obj.name == 'slip' || obj.name == 'cust_slip'){
                  obj._objects[0].set({strokeWidth:1,stroke:'black',fill:'transparent'});  
                  obj._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});     
                  }
                  else if(obj.name == 'meter_slip'){
                    obj._objects[0].set({strokeWidth:1,stroke:'black',fill:'transparent'});
                    obj._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
                  }
                  else if(obj.name == 'cust_meter_slip' ){
                    //console.log(obj);
                    obj._objects[0].set({strokeWidth:1,stroke:'black',fill:'transparent'});
                    obj._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
                    //obj._objects[0].set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
                    //obj._objects[1].set({strokeWidth:1,stroke:'black'});
                  }
                  else if( obj.name == 'text')
                  {
                   //jQuery('.shape_detail').hide();
                    obj.set({fill:'#000',stroke: '#000',strokeWidth: 1});
                  }
                  else
                  {
                    obj.set({stroke:'black',fill:'transparent'});        
                  }
           });
jQuery('.shape_detail').hide(); 
   jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
});



//on object added
window.canvas1.on('object:added',function(options){
  $('.helperline1').hide();
var slipid=options.target.id;
dockarr = slipid.split("_");
variable_arr = dockarr[0];
  if(variable_arr == 'slip' || variable_arr == 'slipmeter' || variable_arr == 'slipcust' || variable_arr == 'custmeterslip' ){
  //window.canvas1.setActiveObject(options.target);
  if(window.show_helper != '1'){
        get_helper_line(options.target);
      }
	if(options.target._objects){
        options.target._objects[0].set({strokeWidth:1,stroke:'black',fill:'transparent'});
                    options.target._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
	}
      }


jQuery('.shape_detail').hide(); 
   jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show(); 
});

//on rotating
window.canvas1.on('object:rotating', function(options) {
  if (options.target) {
  //get_helper_line(options.target);
  var rect = options.target.getBoundingRect();
    // We have the bounding box for rect... Now to get the window.canvas position
    var offset = window.canvas1.calcOffset();
    // Do the math - offset is from $(body)
    var bottom = offset._offset.top + rect.top + rect.height;
    var right = offset._offset.left + rect.left ;
    var left = offset._offset.left + rect.left+ rect.width;
    var top = offset._offset.top + rect.top;
    //console.log('an object was rotated! ', options.target.type);
    var win_height = $(window).height();
  jQuery('.helperline').show();
  jQuery('.helperline.vert-left').css({left:left,height:window.window_height});
  jQuery('.helperline.vert-right').css({left:right,height:window.window_height});
  jQuery('.helperline.vert-left').css('margin-top', '10px');
  jQuery('.helperline.vert-right').css('margin-top','10px');
  jQuery('.helperline.horz-top').css({top:top,width:window.window_width});
  jQuery('.helperline.horz-bottom').css({top:bottom,width:window.window_width});
    var o = options.target;
  if (!o.strokeWidthUnscaled && o.strokeWidth) {
    o.strokeWidthUnscaled = o.strokeWidth;
  }
if(options.target.name == 'cust_meter_slip' || options.target.name == 'meter_slip' || options.target.name == 'cust_slip' || options.target.name == 'slip'){
        //options.target._objects[0].set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
        //options.target._objects[1].set({strokeWidth:1,stroke:'black',fill:'black'});
  options.target._objects[0].set({stroke:'red',fill:'transparent'});
}
else if( options.target.name == 'text')
  {
   //jQuery('.shape_detail').hide();
    options.target.set({fill:'#000',stroke: '#000',strokeWidth: 1});
  }
else{
    options.target.set({stroke:'red',fill:'transparent'});
}
  }
});


window.canvas1.on({
  'touch:drag': function(options) {
  get_helper_line(options.target);
  },
'touch:longpress': function(options) {
   get_helper_line(options.target);
  }
});
//fabric.Object.prototype.objectCaching = false;

//get helper line
function get_helper_line(target){
  window.canvas1.forEachObject(function(obj) {
      var setCoords = obj.setCoords.bind(obj);
      obj.on({
        moving: setCoords,
        scaling: setCoords,
        rotating: setCoords
      });
    });

var rect = target.getBoundingRect();
    // We have the bounding box for rect... Now to get the window.canvas position
    var offset = window.canvas1.calcOffset();
    // Do the math - offset is from $(body)
    var bottom = offset._offset.top + rect.top + rect.height;
    var right = offset._offset.left + rect.left ;
    var left = offset._offset.left + rect.left+ rect.width;
    var top = offset._offset.top + rect.top;
    //console.log('an object was rotated! ', options.target.type);
    var win_height = $(window).height();
  jQuery('.helperline').show();
  jQuery('.helperline.vert-left').css({left:left,height:window.window_height});
  jQuery('.helperline.vert-right').css({left:right,height:window.window_height});
  jQuery('.helperline.vert-left').css('margin-top', '10px');
  jQuery('.helperline.vert-right').css('margin-top','10px');
  jQuery('.helperline.horz-top').css({top:top,width:window.window_width});
  jQuery('.helperline.horz-bottom').css({top:bottom,width:window.window_width});
};


//Draw Rectangle
jQuery('#rect').on('click', function() {
  mode="rect_draw";
  window.show_helper = '0';
  window.rect_count += 1;
  var dock_id = jQuery('#dock_name option:selected').val();
  var dock_name = jQuery('#dock_name option:selected').text();
  dock_name = dock_name.replace(/\s/g, '');
  var rect_id = 'rect_'+dock_id+"_"+window.rect_count;
  mode="rect_draw";
  jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
  jQuery('.shape_detail').show();
jQuery('#obj_height,.hlabel,#obj_width,.wlabel').hide();
jQuery('#obj_border').val(1);
  //window.canvas1.selection = false;
  var rect;
window.canvas1.on('mouse:down', function(o){
    var rect_border = parseInt(jQuery('#obj_border').val());
    isDown = true;
    var pointer = window.canvas1.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;
    var pointer = window.canvas1.getPointer(o.e);
    if(mode=="rect_draw"){
      window.rect_id_arr.push(rect_id);
    rect = new fabric.Rect({
        left: origX,
        top: origY,
        id:rect_id,
        originX: 'left',
        originY: 'top',
        width: pointer.x-origX,
        height: pointer.y-origY,
        fill:'transparent',
        stroke:'black',
        strokeWidth:rect_border,
        name:'rect',
    });
    rect.name='rect';
    window.canvas1.add(rect);
  }
});

window.canvas1.on('mouse:move', function(o){

    if (!isDown) return;
    if(mode=="rect_draw"){
    var pointer = window.canvas1.getPointer(o.e);    
  
      if(origX>pointer.x){
        rect.set({ left: Math.abs(pointer.x) });
    }
    if(origY>pointer.y){
        rect.set({ top: Math.abs(pointer.y) });
    }
    rect.set({ width: Math.abs(origX - pointer.x)});
    rect.set({ height: Math.abs(origY - pointer.y)});
    window.canvas1.calcOffset();
    window.canvas1.renderAll();
    }
        
});

window.canvas1.on('mouse:up', function(o){
  rect.setCoords();
  isDown = false;
  mode = 'select';
  window.canvas1.off('mouse:down');
  window.canvas1.off('mouse:move');
  window.canvas1.renderAll();
  window.canvas1.selection = true; 
  
});
      
});


//Draw Ellipse
jQuery('#ellip').on('click', function() {
var ellip;
mode = 'ellip_draw';
window.show_helper = '0';
window.ellip_count+=1;
var dock_id = jQuery('#dock_name option:selected').val();
  var dock_name = jQuery('#dock_name option:selected').text();
  dock_name = dock_name.replace(/\s/g, '');
  var ellip_id = 'ellip_'+dock_id+"_"+window.ellip_count;
  jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
  jQuery('.shape_detail').show();
  jQuery('#obj_height,.hlabel,#obj_width,.wlabel').hide();
jQuery('#obj_border').val(1);

window.canvas1.on('mouse:down', function(o){
  isDown = true;
  if(mode == 'ellip_draw'){
    var ellp_border = parseInt(jQuery('#obj_border').val());
  var pointer = window.canvas1.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  window.ellip_id_arr.push(ellip_id);
  ellip = new fabric.Ellipse({
    left: pointer.x,
    top: pointer.y,
    id:ellip_id,
    strokeWidth: ellp_border,
    stroke: 'black',
    fill: 'transparent',
    originX: 'center', originY: 'center',
     rx: 5,
    ry: 1
  });
  ellip.name='eliipse';
  window.canvas1.add(ellip);
  }
});

window.canvas1.on('mouse:move', function(o){
  if (!isDown) return;
  if(mode == 'ellip_draw'){
  var pointer = window.canvas1.getPointer(o.e);
  ellip.set({ rx: Math.abs(origX - pointer.x),ry:Math.abs(origY - pointer.y) });
  window.canvas1.renderAll();
  }
});

window.canvas1.on('mouse:up', function(o){
isDown = false;
  mode = 'select';
  window.canvas1.off('mouse:down');
  window.canvas1.off('mouse:move');
  window.canvas1.renderAll();
  window.canvas1.selection = true; 
  ellip.setCoords(); 
});

});


//Draw Triangle
jQuery('#tri').on('click', function() {
  window.tri_count += 1;
  window.show_helper = '0';
var tri = '';
  var dock_id = jQuery('#dock_name option:selected').val();
  var dock_name = jQuery('#dock_name option:selected').text();
  dock_name = dock_name.replace(/\s/g, '');
  var tri_id = 'tri_'+dock_id+"_"+window.tri_count;
  mode="tri_draw";
  jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
  jQuery('.shape_detail').show();
  jQuery('#obj_height,.hlabel,#obj_width,.wlabel').hide();
jQuery('#obj_border').val(1);
  //window.canvas1.isDrawingMode = true;
  //window.canvas1.selection = false;

window.canvas1.on('mouse:down', function(o){
  isDown = true;
  var tri_border = parseInt(jQuery('#obj_border').val());
  if(mode == 'tri_draw'){
  var pointer = window.canvas1.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  window.tri_id_arr.push(tri_id);
  tri = new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    strokeWidth: tri_border,
      width:2,height:2,
    stroke: 'black',
    fill:'transparent',
    id:tri_id,
    originX: 'center'
    
  });
  tri.name='triangle';
  window.canvas1.add(tri);
  }
});

window.canvas1.on('mouse:move', function(o){
  if (!isDown) return;
  if(mode == 'tri_draw'){
  var pointer = window.canvas1.getPointer(o.e);
    tri.set({ width: Math.abs(origX - pointer.x),height: Math.abs(origY - pointer.y)});
  window.canvas1.renderAll();
  }
});

window.canvas1.on('mouse:up', function(o){
  isDown = false;
   mode = 'select'; 
   window.canvas1.off('mouse:down');
   window.canvas1.off('mouse:move');
    window.canvas1.renderAll();
  tri.setCoords();
  window.canvas1.selection = true;
});
});


//draw curve
jQuery('#arc').on('click', function() {
        window.arc_count += 1;
        window.show_helper = '0';
        var dock_id = jQuery('#dock_name option:selected').val();
        var dock_name = jQuery('#dock_name option:selected').text();
        dock_name = dock_name.replace(/\s/g, '');
        var arc_id = 'arc_'+dock_id+"_"+window.arc_count;
        mode="arc_draw";
        jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
        jQuery('.shape_detail').show();
      jQuery('#obj_width,.wlabel').hide();
      jQuery('#obj_height,.hlabel').hide();
      jQuery('#obj_border').val(1);
        //fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
        window.canvas1.on({
          'object:selected': onObjectSelected,
          'object:moving': onObjectMoving,
          'before:selection:cleared': onBeforeSelectionCleared
        });

        //arc_id_arr.push(arc_id);
        window.canvas1.on('mouse:down', function(o){
        var arc_border = parseInt(jQuery('#obj_border').val());
        isDown = true;
        var pointer = window.canvas1.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        var pointer = window.canvas1.getPointer(o.e);
        if(mode == 'arc_draw'){
            window.arc_id_arr.push(arc_id);
            drawQuadratic(arc_id,origX,origY,arc_border);
          }      
          });
        window.canvas1.on('mouse:up', function(o){
           isDown = false;
           mode = 'select'; 
           //arc = '';
           window.canvas1.off('mouse:down');
           window.canvas1.off('mouse:move');
            window.canvas1.renderAll();
           // jQuery('.shape_detail').hide(); 
           // jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
          window.canvas1.selection = true; 
        }); 
});

//arc code
function drawQuadratic(id,leftval,rightval,arc_border) {
    hval = parseInt(leftval); // 100
    hvalplus1 = parseInt(leftval+100); //200
    hvalplus2 = parseInt(leftval+200); //300
    //alert(hval +','+ hvalplus1 + ',' +hvalplus2);

    var line = new fabric.Path('M 65 0 Q '+hval+', '+rightval+', '+hvalplus1+', 0', { fill: '', stroke: 'black',strokeWidth:arc_border, objectCaching: false });

    line.path[0][1] = hval;
    line.path[0][2] = rightval;

    line.path[1][1] = hvalplus1;
    line.path[1][2] = parseInt(rightval+100);

    line.path[1][3] = hvalplus2;
    line.path[1][4] = rightval;

    line.selectable = false;
    line.name = 'Curve'; 
    line.id = id;   
    window.canvas1.add(line);

    var p1 = makeCurvePoint(hvalplus1, parseInt(rightval+100), null, line, null)
    p1.name = "p1";
    p1.id = id;
    window.canvas1.add(p1);

    var p0 = makeCurveCircle(hval, rightval, line, p1, null);
    p0.name = "p0";
    p0.id = id;
    window.canvas1.add(p0);

    var p2 = makeCurveCircle(hvalplus2, rightval, null, p1, line);
    p2.name = "p2";
    p2.id = id;
    window.canvas1.add(p2);

  };

  function makeCurveCircle(left, top, line1, line2, line3) {
    var c = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 1,
      radius: 12,
      fill: 'transparent',
      stroke: 'black',originX: 'center', originY: 'center'

    });

    c.hasBorders = c.hasControls = false;

    c.line1 = line1;
    c.line2 = line2;
    c.line3 = line3;

    return c;
  }

  function makeCurvePoint(left, top, line1, line2, line3) {
    var c = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 1,
      radius: 14,
      fill: 'transparent',
      stroke: 'black',originX: 'center', originY: 'center'
    });

    c.hasBorders = c.hasControls = false;

    c.line1 = line1;
    c.line2 = line2;
    c.line3 = line3;

    return c;
  }

  function onObjectSelected(e) {
    var activeObject = e.target;

    if (activeObject.name == "p0" || activeObject.name == "p2") {
      activeObject.line2.animate('opacity', '1', {
        duration: 200,
        onChange: window.canvas1.renderAll.bind(window.canvas1),
      });
      activeObject.line2.selectable = true;
    }
  }

  function onBeforeSelectionCleared(e) {
    var activeObject = e.target;      
    if (activeObject.name == "p0" || activeObject.name == "p2") {
      activeObject.line2.animate('opacity', '0', {
        duration: 200,
        onChange: window.canvas1.renderAll.bind(window.canvas1),
      });
      activeObject.line2.selectable = false;
    }
    else if (activeObject.name == "p1") {
      activeObject.animate('opacity', '0', {
        duration: 200,
        onChange: window.canvas1.renderAll.bind(window.canvas1),
      });
      activeObject.selectable = false;
    }
  }

  function onObjectMoving(e) {
    if (e.target.name == "p0" || e.target.name == "p2") {
      var p = e.target;

      if (p.line1) {
        p.line1.path[0][1] = p.left;
        p.line1.path[0][2] = p.top;
        p.line1.path
      }
      else if (p.line3) {
        p.line3.path[1][3] = p.left;
        p.line3.path[1][4] = p.top;
      }
    }
    else if (e.target.name == "p1") {
      var p = e.target;

      if (p.line2) {
        p.line2.path[1][1] = p.left;
        p.line2.path[1][2] = p.top;
      }
    }
    else if (e.target.name == "p0" || e.target.name == "p2") {
      var p = e.target;

      p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
      p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
      p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
      p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });
    }
  }
//arc code end

//draw line
jQuery('#line').on('click', function() {
  window.line_count+=1;
  window.show_helper = '0';
  mode="draw";
  var dock_id = jQuery('#dock_name option:selected').val();
        var dock_name = jQuery('#dock_name option:selected').text();
        dock_name = dock_name.replace(/\s/g, '');
        var line_id = 'line_'+dock_id+"_"+window.line_count;
        jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
jQuery('.shape_detail').show();
      jQuery('#obj_width,.wlabel').hide();
      jQuery('#obj_height,.hlabel').hide();
      
      jQuery('#obj_border').val(1);
  window.canvas1.on('mouse:down', function(o){
    var line_border = parseInt(jQuery('#obj_border').val());
  isDown = true;
  var pointer = window.canvas1.getPointer(o.e);
  var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
   window.line_id_arr.push(line_id);
  if(mode=="draw"){
    line = new fabric.Line(points, {
    strokeWidth: line_border,
    id:line_id,
    fill: 'black',
    stroke: 'black',
    originX: 'center',
    originY: 'center',
    selectable: true,
  });
    line.name = 'line';
  window.canvas1.add(line);}
});
 
window.canvas1.on('mouse:move', function(o){
  if (!isDown) return;
  var pointer = window.canvas1.getPointer(o.e);
  
  if(mode=="draw"){
  line.set({ x2: pointer.x, y2: pointer.y });
  window.canvas1.renderAll(); }
});

window.canvas1.on('mouse:up', function(o){
  line.setCoords();
  isDown = false;
    window.canvas1.selection = true;
           mode = 'select'; 
           //arc = '';
           window.canvas1.off('mouse:down');
           window.canvas1.off('mouse:move');
            window.canvas1.renderAll();
           // jQuery('.shape_detail').hide(); 
           // jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
});
});


//draw Gangway
jQuery('#branch').on('click', function() {
  window.branchcount+=1;
  mode="branch_draw";
  window.show_helper = '0';
  var dock_id = jQuery('#dock_name option:selected').val();
        var dock_name = jQuery('#dock_name option:selected').text();
        dock_name = dock_name.replace(/\s/g, '');
        var branch_id = 'branch_'+dock_id+"_"+window.branchcount;
        jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
jQuery('.shape_detail').show();
    jQuery('#obj_width').val(70);
jQuery('#obj_height,.hlabel').hide();
      jQuery('#obj_border').val(5);

  window.canvas1.on('mouse:down', function(o){
    var linewidth = parseInt(jQuery('#obj_width').val());
    var line_border = parseInt(jQuery('#obj_border').val());
    jQuery('#obj_height,.hlabel').hide();
  isDown = true;
  var pointer = window.canvas1.getPointer(o.e);
  x2 = Math.abs(linewidth + pointer.x);
  var points = [ pointer.x, pointer.y, x2, pointer.y ];
   window.branch_id_arr.push(branch_id);
  if(mode=="branch_draw"){
    branch = new fabric.Line(points,
          {
            id : branch_id,
          fill: 'black',
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            strokeWidth: line_border,
              }); 
        window.canvas1.add(branch);
branch.name ="gangway";
}
});
 

window.canvas1.on('mouse:up', function(o){
  //branch.setCoords();
  isDown = false;
    window.canvas1.selection = true;
           mode = 'select'; 
           //arc = '';
           window.canvas1.off('mouse:down');
           window.canvas1.off('mouse:move');
            window.canvas1.renderAll();
           // jQuery('.shape_detail').hide(); 
           // jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
          
});
});


//Delete objects
jQuery('.delete-item').on('click', function(e) {
  mode="select";
    window.show_helper = '0';
	if(window.canvas1.getActiveObject().name == 'slip' || window.canvas1.getActiveObject().name == 'meter_slip' || window.canvas1.getActiveObject().name == 'cust_slip' || window.canvas1.getActiveObject().name == 'cust_meter_slip')
	{
		 var id = window.canvas1.getActiveObject().id;
     //console.log(id);
		var index = window.slip_id_arr.indexOf(id);
	if (index > -1) {
	    window.slip_id_arr.splice(index, 1);
	}
	var dock_id = jQuery("#dock_name option:selected").val();
if(dock_id == ''){var dock_id = jQuery("#dock_name option:first").val();}
	get_slipdata(dock_id);
	} 

      if(window.canvas1.getActiveObject().name == 'p0' || window.canvas1.getActiveObject().name == 'p1' || window.canvas1.getActiveObject().name == 'p2')
      {
        var id = window.canvas1.getActiveObject().id;
        window.canvas1.forEachObject(function(obj){
             if((obj.name == 'Curve' && obj.id == id) || (obj.name == 'p1' && obj.id == id) || (obj.name == 'p0' && obj.id == id) || (obj.name == 'p2' && obj.id == id)){
               window.canvas1.fxRemove(obj);
               jQuery('.tool-tip').hide();
              }
          });
      }
      window.canvas1.remove(window.canvas1.getActiveObject());
      jQuery('.tool-tip').hide();
    
});



var loadSVGWithoutGrouping = function(id) {
  window.show_helper = '1';
            var elem = document.getElementById(id),
                svgStr = elem.innerHTML;
                //window.slip_id_arr = [];
            fabric.loadSVGFromString(svgStr, function(objects) {
              for(var i=0; i<objects.length; i++)
            {

              objects[i].set('selectable', true);
              window.typeobj = objects[i].id;
              dockarr = typeobj.split("_");
              variable_arr = dockarr[0];
              if(variable_arr == 'slip'){
                objects[i].name = 'slip'; 
                if(objects[i].type == 'text')
                {
                  text = objects[i];
                  //objects.slice(i,1);
                  window.canvas1.fxRemove(objects[i]);
                  draw_slip(objects[i-1],text);
                } 
                window.canvas1.fxRemove(objects[i]);
              }
	            else if(variable_arr == 'slipcust')
              {
                //console.log(objects[i]);
              objects[i].name = 'cust_slip'; 
          		if(objects[i].type == 'text')
                {
                  text = objects[i];
                  //objects.slice(i,1);
                  window.canvas1.fxRemove(objects[i]);
                  draw_slip(objects[i-1],text);
                } 
          		window.canvas1.fxRemove(objects[i]);            
                
              }
              else if(variable_arr == 'custmeterslip'){
                objects[i].name = 'cust_meter_slip'; 
                if(objects[i].type == 'text')
                {
                  text = objects[i];
                  //objects.slice(i,1);
                  window.canvas1.fxRemove(objects[i]);
                  draw_slip(objects[i-1],text);
                } 
                window.canvas1.fxRemove(objects[i]);

              }
              else if(variable_arr == 'slipmeter')
              {
                objects[i].name = 'meter_slip';	
                if(objects[i].type == 'text')
                {
                  text = objects[i];
                  //objects.slice(i,1);
                  window.canvas1.fxRemove(objects[i]);
                  draw_slip(objects[i-1],text);
                } 
                window.canvas1.fxRemove(objects[i]);
              }
              else if(variable_arr == 'text')
              {
                window.text_id_arr.push(objects[i].id);
                objects[i].name = 'text'; 
                draw_text(objects[i]);
                window.canvas1.fxRemove(objects[i]);
              }              
              else if(variable_arr == 'arc')            
              {
               //console.log('arc'+i); 
                if(objects[i].type == 'path'){
                window.arc_border = objects[i].strokeWidth;
                objects.slice(i,1);
                window.linepath = objects[i].path;
                window.m1 = objects[i].path[0][1];
                window.m2 = objects[i].path[0][2];
                window.q1 = objects[i].path[1][1];
                window.q2 = objects[i].path[1][2];
                window.q3 = objects[i].path[1][3];
                window.q4 = objects[i].path[1][4];
                draw_2_arc();
                window.canvas1.fxRemove(objects[i]);
                } 
                if(objects[i].type == 'circle')
                {
                  objects.slice(i,1);
                  window.canvas1.fxRemove(objects[i]);
                }  
                                              
              }
            }
            window.canvas1.add.apply(window.canvas1, objects);            
            window.canvas1.renderAll();
            //window.canvas1.renderAll.bind(window.canvas1);
            //console.log(window.slip_id_arr);

          });

         
        };
      //loadSVGWithoutGrouping("svg3");

      function draw_2_arc(){
      window.canvas1.on({
                              'object:selected': onObjectSelected,
                              'object:moving': onObjectMoving,
                              'before:selection:cleared': onBeforeSelectionCleared
                            });
                               drawQuadraticnew(window.typeobj,window.arc_border);
          }


   //arc code
function drawQuadraticnew(id,arc_border) {
    var line1 = new fabric.Path(window.linepath, { fill: '', stroke: 'black',strokeWidth:arc_border, objectCaching: false });
    line1.selectable = false;
    line1.name = 'Curve'; 
    line1.id = id;   
    window.canvas1.add(line1);

    var p1 = makeCurvePoint(window.q1, parseInt(window.q2), null, line1, null)
    p1.name = "p1";
    p1.id = id;
    window.canvas1.add(p1);

    var p0 = makeCurveCircle(parseInt(window.m1),parseInt(window.m2), line1, p1, null);
    p0.name = "p0";
    p0.id = id;
    window.canvas1.add(p0);

    var p2 = makeCurveCircle(window.q3, window.q4, null, p1, line1);
    p2.name = "p2";
    p2.id = id;
    window.canvas1.add(p2);

  };
   
   function draw_slip(objects ,text)  {
    if(objects.type == 'rect'){
    
  var origX = '';
        var origY = '';
        var slip_id = '';
        var slipwidth = '';
        var slipheight = '';
          var rect = objects.getBoundingRect();
          origX = objects.left;
          origY = objects.top;
          obj_nameslip = 'slip';
          slip_id = objects.id.replace(/\@rect/g, "");
          var stroke_col = 'transparent';
          slipwidth = objects.width;
          slipheight = objects.height;

  //text object
    var text_left = text.left;
    var text_top = text.top;
    var text_angle = text.angle;
    var text_val = text.text;
    var text_size = text.fontSize;
          window.slip = new fabric.Rect({
                  left: origX,
                  top: origY,
                  width: slipwidth,
                  height: slipheight,
                  id: slip_id+"@rect",
                  fill:stroke_col,
                  dirty: true,
                  stroke:'black',
                  originX: "center",
                  originY: "center",
                  strokeWidth:1.5,scaleX:objects.scaleX,scaleY:objects.scaleY,
              });
              //window.canvas1.add(window.slip);
              window.slip.name = obj_nameslip;
              let centerPoint = window.slip.getCenterPoint();
                        top1 = centerPoint.y;
                        left1 = centerPoint.x;

                        let scaleX1 = window.slip.scaleX || 1;
                        let scaleY1 = window.slip.scaleY || 1;
                        let angle1 = window.slip.angle || 0;

                          var topval = parseFloat(origY);
                          var leftval = parseFloat(origX);
                        
              slip_text =  new fabric.Text(text_val, {
                  left: leftval,
                  top: topval,
                  id:slip_id+"@text",
                  fontWeight: 300,
                  stroke: '#000',
                  strokeWidth: 1,
                  fontSize: 14,
                  fill: "#000",
                  fontFamily: 'Open Sans',
                  textAlign: 'left',
                  originX: 'center',
                  originY: 'center',
                  scaleX:objects.scaleX,scaleY:objects.scaleY
                });
              slip_text.name='sliptext';
              group1 = new fabric.Group([ window.slip, slip_text], { left: origX, top: origY,id:slip_id,angle:objects.angle,strokeWidth:1.5});
              group1.name = obj_nameslip;
              //window.slip_id_arr.push(slip_id);
              window.slipaddcount = '1';
              window.canvas1.add(group1);

        }
   }

  


//draw text
function draw_text(objects)
  {
    //console.log(objects);
  if(objects.type == 'text'){
      var origX1 = '';
    var origY1 = '';
    var text_id1 ='';
    var textwidth1 ='';
    var textheight1 ='';
    var text_val = '';
    var font_size = '';
              origX1 = objects.left;
              origY1 = objects.top;
              text_id1 = objects.id;
              stroke_col1 = 'black';
              textwidth1 = objects.width;
              textheight1 = objects.height;
              text_val = objects.text; 
              font_size = objects.fontSize;
      textlabel = new fabric.Text(text_val, {
        left: origX1,
        top: parseFloat(origY1 + textheight1),
        id:text_id1,
        width:textwidth1,
        height:textheight1,
        fontWeight: 300,
        stroke: '#000',
        strokeWidth: 1,
        fontSize: font_size,
        fill: "#000",fontFamily: 'Open Sans',
        textAlign: 'center',name:'text',scaleX:objects.scaleX,scaleY:objects.scaleY,angle:objects.angle,
        originX: 'center', originY: 'center'
      });
     window.canvas1.add(textlabel); 
    }
  }
	

});
