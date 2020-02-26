$( document ).ready(function(){
  var partner_id = $('#partner_id').val();
   
  var window_height = $(document).height();
  var window_width = $('#content').width();
  window_height = window_height;
  window_width = window_width;

  $('canvas').attr({'width':window_width});
  $('canvas').attr({'height':window_height});
  
  window.canvas1 = new fabric.Canvas('c1');

  var src = '/bookingengine/img/graphpaper1.gif';
  window.canvas1.setBackgroundColor({
  source: src,
  repeat: 'repeat',
}, window.canvas1.renderAll.bind(window.canvas1));


//Move selected boject using keyboard
const STEP = 1;
var Direction = {
  LEFT: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3
};

fabric.util.addListener(document.body, 'keydown', function(options) {
  if (options.repeat) {
    return;
  }
  var key = options.which || options.keyCode; // key detection
  if (key === 37) { // handle Left key
    moveSelected(Direction.LEFT);
  } else if (key === 38) { // handle Up key
    moveSelected(Direction.UP);
  } else if (key === 39) { // handle Right key
    moveSelected(Direction.RIGHT);
  } else if (key === 40) { // handle Down key
    moveSelected(Direction.DOWN);
  }  else if (key === 46) { // handle Down key
    
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
    
  }
});

function moveSelected(direction) {

  var activeObject = window.canvas1.getActiveObject();
  //var activeGroup = window.canvas1.getActiveGroup();

  if (activeObject) {
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
    if(options.target.name == 'slip' || options.target.name == 'meter_slip'){
      showImageTools(options);
    }
  }
});

//on mouseout
window.canvas1.on('mouse:out', function(options) {
  jQuery('.tool-tip').hide(); 
});

// //on mouse dblclick
// window.canvas1.on('mouse:dblclick', function(options) {
//   jQuery('.tool-tip').hide(); 
//   if(options.target.name == 'slip' || options.target.name == 'meter_slip' )
//   {
//     slip_id = options.target.id;
//     dockarr = slip_id.split("@");
//     variable_arr = dockarr[0].split("_");
//     $('#show_modal').attr('data-url','/partner/maps/edit_slip/45/6');
//     $( "#show_modal" ).trigger( "click" );
//   }
// });

function showImageTools (e) {
    toolhtml = '';
    slip_id = e.target.id;
    slip_type = e.target.name;
    if(slip_type == "slip")
    {
          dockarr = slip_id.split("@");
          variable_arr = dockarr[0].split("_");
          toolhtml += '<p>Dock Name : '+variable_arr[3]+'</p>';
          toolhtml += '<p>Slip Name : '+variable_arr[1]+'</p>';
    }
    else if(slip_type == "meter_slip")
    {
          dockarr = slip_id.split("@");
          variable_arr = dockarr[0].split("_");
          toolhtml += '<p>Dock Name : '+variable_arr[3]+'</p>';
          toolhtml += '<p>Slip Name : '+variable_arr[1]+'</p>';
          toolhtml += '<p>Meter Name : '+variable_arr[4]+'</p>';
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
    $('.tool-tip').show();
    $('.tool-tip').css({top: top, left: left});
}
function getObjPosition (e) {
    // Get dimensions of object
    var rect = e.target.getBoundingRect();
    // We have the bounding box for rect... Now to get the window.canvas1 position
    var offset = window.canvas1.calcOffset();
    // Do the math - offset is from $(body)
    var bottom = offset._offset.top + rect.top + rect.height;
    var right = offset._offset.left + rect.left ;
    var left = offset._offset.left + rect.left+ rect.width + 20;
    var top = offset._offset.top + rect.top + 19;
    return {left: left, top: top, right: right, bottom: bottom};
}

//on select
window.canvas1.on('object:selected', function(options) {
  if (options.target) {
    jQuery('#obj_border').val(options.target.strokeWidth);
    //console.log('an object was clicked! ', options.target.type);
    if(options.target.name == 'slip' || options.target.name == 'meter_slip'){
        jQuery('.shape_detail').hide();
      }
      else
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
  else if(activeObject.name != 'slip' || activeObject.name != 'meter_slip')
  {
    activeObject.set({strokeWidth:parseFloat(border_width)});
  }
  window.canvas1.renderAll();
});

//on drop
window.canvas1.on('object:modified', function(options) {
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
      else
      {
        options.target.set({stroke:'black',fill:'transparent'});        
      }
  }
});

//on moving
window.canvas1.on('object:moving', function(options) {
  jQuery('.tool-tip').hide(); 
  if (options.target) {
    //console.log('an object was moving! ', options.target.type);
    options.target.set({stroke:'red',fill:'transparent'});
  }
});


//on skewing
window.canvas1.on('object:skewing', function(options) {
  if (options.target) {
    //console.log('an object was skewd! ', options.target.type);
    var o = options.target;
  if (!o.strokeWidthUnscaled && o.strokeWidth) {
    o.strokeWidthUnscaled = o.strokeWidth;
  }
    options.target.set({stroke:'red',fill:'transparent'});
    
  }
});

//on scaling
window.canvas1.on('object:scaling', function(options) {
  if (options.target) {    
    var o = options.target;
  if (!o.strokeWidthUnscaled && o.strokeWidth) {
    o.strokeWidthUnscaled = o.strokeWidth;
  }
    options.target.set({stroke:'red',fill:'transparent'});
    }
});

//on slection cleared
window.canvas1.on('before:selection:cleared', function(options) {  
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
                if(obj.name == 'slip'){
                  obj.set({strokeWidth:1,stroke:'#0053a7',fill:'#0053a7'});       
                  }
                  else if(obj.name == 'meter_slip'){
                    obj.set({strokeWidth:1,stroke:'#fa9632',fill:'#fa9632'});
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
jQuery('.shape_detail').hide(); 
   jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show(); 
});

//on rotating
window.canvas1.on('object:rotating', function(options) {
  if (options.target) {
    //console.log('an object was rotated! ', options.target.type);
    var o = options.target;
  if (!o.strokeWidthUnscaled && o.strokeWidth) {
    o.strokeWidthUnscaled = o.strokeWidth;
  }
    options.target.set({stroke:'red',fill:'transparent'});
  }
});

//fabric.Object.prototype.objectCaching = false;

//Draw Rectangle
jQuery('#rect').on('click', function() {
  mode="rect_draw";
  window.rectcount += 1;
  var dock_id = jQuery('#dock_name option:selected').val();
  var dock_name = jQuery('#dock_name option:selected').text();
  dock_name = dock_name.replace(/\s/g, '');
  var rect_id = 'rect_'+dock_id+"_"+dock_name+"_"+window.rectcount;
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


//Draw Circle
jQuery('#cir').on('click', function() {
var circle;
window.circount += 1;
mode = 'cir_draw';
var dock_id = jQuery('#dock_name option:selected').val();
  var dock_name = jQuery('#dock_name option:selected').text();
  dock_name = dock_name.replace(/\s/g, '');
  var cir_id = 'cir_'+dock_id+"_"+dock_name+"_"+window.circount;
  jQuery('#obj_height,.hlabel,#obj_border,.blabel,#obj_width,.wlabel').show();
  jQuery('.shape_detail').show();
jQuery('#obj_height,.hlabel,#obj_width,.wlabel').hide();
jQuery('#obj_border').val(1);


window.canvas1.on('mouse:down', function(o){
  isDown = true;
  if(mode == 'cir_draw'){
    var cir_border = parseInt(jQuery('#obj_border').val());
  var pointer = window.canvas1.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  window.circ_id_arr.push(cir_id);
  circle = new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 1,
    id:cir_id,
    strokeWidth: cir_border,
    stroke: 'black',
    fill:'transparent',
    originX: 'center', originY: 'center'
  });
  circle.name='circle';
  window.canvas1.add(circle);
  }
});

window.canvas1.on('mouse:move', function(o){
  if (!isDown) return;
  if(mode == 'cir_draw'){
  var pointer = window.canvas1.getPointer(o.e);
  circle.set({ radius: Math.abs(origX - pointer.x) });
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
  circle.setCoords();
});
});

//Draw Ellipse
jQuery('#ellip').on('click', function() {
var ellip;
mode = 'ellip_draw';
window.ellipcount+=1;
var dock_id = jQuery('#dock_name option:selected').val();
  var dock_name = jQuery('#dock_name option:selected').text();
  dock_name = dock_name.replace(/\s/g, '');
  var ellip_id = 'ellip_'+dock_id+"_"+dock_name+"_"+window.ellipcount;
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
  window.tricount += 1;
var tri = '';
  var dock_id = jQuery('#dock_name option:selected').val();
  var dock_name = jQuery('#dock_name option:selected').text();
  dock_name = dock_name.replace(/\s/g, '');
  var tri_id = 'tri_'+dock_id+"_"+dock_name+"_"+window.tricount;
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
        window.hcircount += 1;
        var dock_id = jQuery('#dock_name option:selected').val();
        var dock_name = jQuery('#dock_name option:selected').text();
        dock_name = dock_name.replace(/\s/g, '');
        var arc_id = 'arc_'+dock_id+"_"+dock_name+"_"+window.hcircount;
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

        hcirc_id_arr.push(arc_id);
        window.canvas1.on('mouse:down', function(o){
        var arc_border = parseInt(jQuery('#obj_border').val());
        isDown = true;
        var pointer = window.canvas1.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        var pointer = window.canvas1.getPointer(o.e);
        if(mode == 'arc_draw'){
            window.hcirc_id_arr.push(arc_id);
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
  window.linecount+=1;
  mode="draw";
  var dock_id = jQuery('#dock_name option:selected').val();
        var dock_name = jQuery('#dock_name option:selected').text();
        dock_name = dock_name.replace(/\s/g, '');
        var line_id = 'line_'+dock_id+"_"+dock_name+"_"+window.linecount;
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
  var dock_id = jQuery('#dock_name option:selected').val();
        var dock_name = jQuery('#dock_name option:selected').text();
        dock_name = dock_name.replace(/\s/g, '');
        var branch_id = 'branch_'+dock_id+"_"+dock_name+"_"+window.branchcount;
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
  var id = window.canvas1.getActiveObject().id;
  type = id.substring(0, 3);
      if(type == 'arc')
      {        
        window.canvas1.forEachObject(function(obj){
             if(obj.id == id) {
               window.canvas1.fxRemove(obj);
               jQuery('.tool-tip').hide();
              }
          });
      }
      // window.canvas1.remove(window.canvas1.getActiveObject());
      // jQuery('.tool-tip').hide();
    
});

var loadSVGWithoutGrouping = function(id) {
            var elem = document.getElementById(id),
                svgStr = elem.innerHTML;
            fabric.loadSVGFromString(svgStr, function(objects) {
              for(var i=0; i<objects.length; i++)
            {

              //objects[i].set('selectable', false);
              window.typeobj = objects[i].id;
              dockarr = typeobj.split("_");
              variable_arr = dockarr[0];
              if(variable_arr == 'slip'){
                objects[i].name = 'slip'; 
              }
              else if(variable_arr == 'slipmeter')
              {
                objects[i].name = 'meter_slip'; 
              }
              else if(variable_arr == 'arc')            
              {
               //console.log('arc'+i); 
                if(objects[i].type == 'path'){
                window.arc_border = objects[i].strokeWidth;
                objects.slice(i,1);
                window.linepath = objects[i].path;
                window.m1 = objects[i].path[0][1];
                window.m2 = objects[i].path[0][1];
                window.q1 = objects[i].path[1][1];
                window.q2 = objects[i].path[1][2];
                window.q3 = objects[i].path[1][3];
                window.q4 = objects[i].path[1][4];
                draw_2_arc();
                } 
                if(objects[i].type == 'circle')
                {
                  objects.slice(i,1);
                }  
                window.canvas1.fxRemove(objects[i]);                              
              }
            }
            window.canvas1.add.apply(window.canvas1, objects);            
            window.canvas1.renderAll();
            //window.canvas1.renderAll.bind(window.canvas1);

          });
         
        };
      loadSVGWithoutGrouping("svg3");
      function draw_2_arc(){
      setTimeout( function(){ 
                        window.canvas1.on({
                        'object:selected': onObjectSelected,
                        'object:moving': onObjectMoving,
                        'before:selection:cleared': onBeforeSelectionCleared
                      });
                         drawQuadraticnew(window.typeobj,window.arc_border);
                      }  , 2000 );
    }


    //arc code
function drawQuadraticnew(id,arc_border) {
    var line1 = new fabric.Path(window.linepath, { fill: '', stroke: 'black',strokeWidth:arc_border, objectCaching: false });

     // line1.path[0][1] = window.m1;
     // line1.path[0][2] = window.m2;

     // line1.path[1][1] = window.q1;
     // line1.path[1][2] = parseInt(window.q2);

     // line1.path[1][3] = window.q3;
     // line1.path[1][4] = window.m2;

    line1.selectable = false;
    line1.name = 'Curve'; 
    line1.id = id;   
    window.canvas1.add(line1);

    var p1 = makeCurvePoint(window.q1, parseInt(window.q2), null, line1, null)
    p1.name = "p1";
    p1.id = id;
    window.canvas1.add(p1);

    var p0 = makeCurveCircle(window.m1, window.q4, line1, p1, null);
    p0.name = "p0";
    p0.id = id;
    window.canvas1.add(p0);

    var p2 = makeCurveCircle(window.q3, window.q4, null, p1, line1);
    p2.name = "p2";
    p2.id = id;
    window.canvas1.add(p2);

  };
     

});
