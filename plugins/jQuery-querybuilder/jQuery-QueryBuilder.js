
/* interact.js v1.3.4 | https://raw.github.com/taye/interact.js/master/LICENSE */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.interact=t()}}(function(){return function t(e,n,r){function i(s,a){if(!n[s]){if(!e[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(o)return o(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var p=n[s]={exports:{}};e[s][0].call(p.exports,function(t){var n=e[s][1][t];return i(n||t)},p,p.exports,t,e,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(t,e,n){"use strict";"undefined"==typeof window?e.exports=function(e){return t("./src/utils/window").init(e),t("./src/index")}:e.exports=t("./src/index")},{"./src/index":19,"./src/utils/window":52}],2:[function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var r;r=e[n];var i=r;if(t.immediatePropagationStopped)break;i(t)}}var o=t("./utils/extend.js"),s=function(){function t(e){r(this,t),this.options=o({},e||{})}return t.prototype.fire=function(t){var e=void 0,n="on"+t.type,r=this.global;(e=this[t.type])&&i(t,e),this[n]&&this[n](t),!t.propagationStopped&&r&&(e=r[t.type])&&i(t,e)},t.prototype.on=function(t,e){this[t]?this[t].push(e):this[t]=[e]},t.prototype.off=function(t,e){var n=this[t],r=n?n.indexOf(e):-1;-1!==r&&n.splice(r,1),(n&&0===n.length||!e)&&(this[t]=void 0)},t}();e.exports=s},{"./utils/extend.js":41}],3:[function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=t("./utils/extend"),o=t("./utils/getOriginXY"),s=t("./defaultOptions"),a=t("./utils/Signals").new(),c=function(){function t(e,n,c,l,p,u){var d=arguments.length>6&&void 0!==arguments[6]&&arguments[6];r(this,t);var f=e.target,v=(f&&f.options||s).deltaSource,g=o(f,p,c),h="start"===l,m="end"===l,y=h?e.startCoords:e.curCoords,x=e.prevEvent;p=p||e.element;var b=i({},y.page),w=i({},y.client);b.x-=g.x,b.y-=g.y,w.x-=g.x,w.y-=g.y,this.ctrlKey=n.ctrlKey,this.altKey=n.altKey,this.shiftKey=n.shiftKey,this.metaKey=n.metaKey,this.button=n.button,this.buttons=n.buttons,this.target=p,this.currentTarget=p,this.relatedTarget=u||null,this.preEnd=d,this.type=c+(l||""),this.interaction=e,this.interactable=f,this.t0=h?e.downTimes[e.downTimes.length-1]:x.t0;var E={interaction:e,event:n,action:c,phase:l,element:p,related:u,page:b,client:w,coords:y,starting:h,ending:m,deltaSource:v,iEvent:this};a.fire("set-xy",E),m?(this.pageX=x.pageX,this.pageY=x.pageY,this.clientX=x.clientX,this.clientY=x.clientY):(this.pageX=b.x,this.pageY=b.y,this.clientX=w.x,this.clientY=w.y),this.x0=e.startCoords.page.x-g.x,this.y0=e.startCoords.page.y-g.y,this.clientX0=e.startCoords.client.x-g.x,this.clientY0=e.startCoords.client.y-g.y,a.fire("set-delta",E),this.timeStamp=y.timeStamp,this.dt=e.pointerDelta.timeStamp,this.duration=this.timeStamp-this.t0,this.speed=e.pointerDelta[v].speed,this.velocityX=e.pointerDelta[v].vx,this.velocityY=e.pointerDelta[v].vy,this.swipe=m||"inertiastart"===l?this.getSwipe():null,a.fire("new",E)}return t.prototype.getSwipe=function(){var t=this.interaction;if(t.prevEvent.speed<600||this.timeStamp-t.prevEvent.timeStamp>150)return null;var e=180*Math.atan2(t.prevEvent.velocityY,t.prevEvent.velocityX)/Math.PI;e<0&&(e+=360);var n=112.5<=e&&e<247.5,r=202.5<=e&&e<337.5,i=!n&&(292.5<=e||e<67.5);return{up:r,down:!r&&22.5<=e&&e<157.5,left:n,right:i,angle:e,speed:t.prevEvent.speed,velocity:{x:t.prevEvent.velocityX,y:t.prevEvent.velocityY}}},t.prototype.preventDefault=function(){},t.prototype.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},t.prototype.stopPropagation=function(){this.propagationStopped=!0},t}();a.on("set-delta",function(t){var e=t.iEvent,n=t.interaction,r=t.starting,i=t.deltaSource,o=r?e:n.prevEvent;"client"===i?(e.dx=e.clientX-o.clientX,e.dy=e.clientY-o.clientY):(e.dx=e.pageX-o.pageX,e.dy=e.pageY-o.pageY)}),c.signals=a,e.exports=c},{"./defaultOptions":18,"./utils/Signals":34,"./utils/extend":41,"./utils/getOriginXY":42}],4:[function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=t("./utils/clone"),o=t("./utils/is"),s=t("./utils/events"),a=t("./utils/extend"),c=t("./actions/base"),l=t("./scope"),p=t("./Eventable"),u=t("./defaultOptions"),d=t("./utils/Signals").new(),f=t("./utils/domUtils"),v=f.getElementRect,g=f.nodeContains,h=f.trySelector,m=f.matchesSelector,y=t("./utils/window"),x=y.getWindow,b=t("./utils/arr"),w=b.contains,E=t("./utils/browser"),T=E.wheelEvent;l.interactables=[];var S=function(){function t(e,n){r(this,t),n=n||{},this.target=e,this.events=new p,this._context=n.context||l.document,this._win=x(h(e)?this._context:e),this._doc=this._win.document,d.fire("new",{target:e,options:n,interactable:this,win:this._win}),l.addDocument(this._doc,this._win),l.interactables.push(this),this.set(n)}return t.prototype.setOnEvents=function(t,e){var n="on"+t;return o.function(e.onstart)&&(this.events[n+"start"]=e.onstart),o.function(e.onmove)&&(this.events[n+"move"]=e.onmove),o.function(e.onend)&&(this.events[n+"end"]=e.onend),o.function(e.oninertiastart)&&(this.events[n+"inertiastart"]=e.oninertiastart),this},t.prototype.setPerAction=function(t,e){for(var n in e)n in u[t]&&(o.object(e[n])?(this.options[t][n]=i(this.options[t][n]||{}),a(this.options[t][n],e[n]),o.object(u.perAction[n])&&"enabled"in u.perAction[n]&&(this.options[t][n].enabled=!1!==e[n].enabled)):o.bool(e[n])&&o.object(u.perAction[n])?this.options[t][n].enabled=e[n]:void 0!==e[n]&&(this.options[t][n]=e[n]))},t.prototype.getRect=function(t){return t=t||this.target,o.string(this.target)&&!o.element(t)&&(t=this._context.querySelector(this.target)),v(t)},t.prototype.rectChecker=function(t){return o.function(t)?(this.getRect=t,this):null===t?(delete this.options.getRect,this):this.getRect},t.prototype._backCompatOption=function(t,e){if(h(e)||o.object(e)){this.options[t]=e;for(var n=0;n<c.names.length;n++){var r;r=c.names[n];var i=r;this.options[i][t]=e}return this}return this.options[t]},t.prototype.origin=function(t){return this._backCompatOption("origin",t)},t.prototype.deltaSource=function(t){return"page"===t||"client"===t?(this.options.deltaSource=t,this):this.options.deltaSource},t.prototype.context=function(){return this._context},t.prototype.inContext=function(t){return this._context===t.ownerDocument||g(this._context,t)},t.prototype.fire=function(t){return this.events.fire(t),this},t.prototype._onOffMultiple=function(t,e,n,r){if(o.string(e)&&-1!==e.search(" ")&&(e=e.trim().split(/ +/)),o.array(e)){for(var i=0;i<e.length;i++){var s;s=e[i];var a=s;this[t](a,n,r)}return!0}if(o.object(e)){for(var c in e)this[t](c,e[c],n);return!0}},t.prototype.on=function(e,n,r){return this._onOffMultiple("on",e,n,r)?this:("wheel"===e&&(e=T),w(t.eventTypes,e)?this.events.on(e,n):o.string(this.target)?s.addDelegate(this.target,this._context,e,n,r):s.add(this.target,e,n,r),this)},t.prototype.off=function(e,n,r){return this._onOffMultiple("off",e,n,r)?this:("wheel"===e&&(e=T),w(t.eventTypes,e)?this.events.off(e,n):o.string(this.target)?s.removeDelegate(this.target,this._context,e,n,r):s.remove(this.target,e,n,r),this)},t.prototype.set=function(e){o.object(e)||(e={}),this.options=i(u.base);var n=i(u.perAction);for(var r in c.methodDict){var s=c.methodDict[r];this.options[r]=i(u[r]),this.setPerAction(r,n),this[s](e[r])}for(var a=0;a<t.settingsMethods.length;a++){var l;l=t.settingsMethods[a];var p=l;this.options[p]=u.base[p],p in e&&this[p](e[p])}return d.fire("set",{options:e,interactable:this}),this},t.prototype.unset=function(){if(s.remove(this.target,"all"),o.string(this.target))for(var t in s.delegatedEvents){var e=s.delegatedEvents[t];e.selectors[0]===this.target&&e.contexts[0]===this._context&&(e.selectors.splice(0,1),e.contexts.splice(0,1),e.listeners.splice(0,1),e.selectors.length||(e[t]=null)),s.remove(this._context,t,s.delegateListener),s.remove(this._context,t,s.delegateUseCapture,!0)}else s.remove(this,"all");d.fire("unset",{interactable:this}),l.interactables.splice(l.interactables.indexOf(this),1);for(var n=0;n<(l.interactions||[]).length;n++){var r;r=(l.interactions||[])[n];var i=r;i.target===this&&i.interacting()&&!i._ending&&i.stop()}return l.interact},t}();l.interactables.indexOfElement=function(t,e){e=e||l.document;for(var n=0;n<this.length;n++){var r=this[n];if(r.target===t&&r._context===e)return n}return-1},l.interactables.get=function(t,e,n){var r=this[this.indexOfElement(t,e&&e.context)];return r&&(o.string(t)||n||r.inContext(t))?r:null},l.interactables.forEachMatch=function(t,e){for(var n=0;n<this.length;n++){var r;r=this[n];var i=r,s=void 0;if((o.string(i.target)?o.element(t)&&m(t,i.target):t===i.target)&&i.inContext(t)&&(s=e(i)),void 0!==s)return s}},S.eventTypes=l.eventTypes=[],S.signals=d,S.settingsMethods=["deltaSource","origin","preventDefault","rectChecker"],e.exports=S},{"./Eventable":2,"./actions/base":6,"./defaultOptions":18,"./scope":33,"./utils/Signals":34,"./utils/arr":35,"./utils/browser":36,"./utils/clone":37,"./utils/domUtils":39,"./utils/events":40,"./utils/extend":41,"./utils/is":46,"./utils/window":52}],5:[function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t){return function(e){var n=c.getPointerType(e),r=c.getEventTargets(e),i=r[0],o=r[1],s=[];if(p.supportsTouch&&/touch/.test(e.type)){h=(new Date).getTime();for(var l=0;l<e.changedTouches.length;l++){var u;u=e.changedTouches[l];var f=u,v=f,g=d.search(v,e.type,i);s.push([v,g||new m({pointerType:n})])}}else{var y=!1;if(!p.supportsPointerEvent&&/mouse/.test(e.type)){for(var x=0;x<a.interactions.length&&!y;x++)y="mouse"!==a.interactions[x].pointerType&&a.interactions[x].pointerIsDown;y=y||(new Date).getTime()-h<500||0===e.timeStamp}if(!y){var b=d.search(e,e.type,i);b||(b=new m({pointerType:n})),s.push([e,b])}}for(var w=0;w<s.length;w++){var E=s[w],T=E[0],S=E[1];S._updateEventTargets(i,o),S[t](T,e,i,o)}}}function o(t){for(var e=0;e<a.interactions.length;e++){var n;n=a.interactions[e];var r=n;r.end(t),f.fire("endall",{event:t,interaction:r})}}function s(t,e){var n=t.doc,r=0===e.indexOf("add")?l.add:l.remove;for(var i in a.delegatedEvents)r(n,i,l.delegateListener),r(n,i,l.delegateUseCapture,!0);for(var o in b)r(n,o,b[o],p.isIOS?{passive:!1}:void 0)}var a=t("./scope"),c=t("./utils"),l=t("./utils/events"),p=t("./utils/browser"),u=t("./utils/domObjects"),d=t("./utils/interactionFinder"),f=t("./utils/Signals").new(),v={},g=["pointerDown","pointerMove","pointerUp","updatePointer","removePointer"],h=0;a.interactions=[];for(var m=function(){function t(e){var n=e.pointerType;r(this,t),this.target=null,this.element=null,this.prepared={name:null,axis:null,edges:null},this.pointers=[],this.pointerIds=[],this.downTargets=[],this.downTimes=[],this.prevCoords={page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},this.curCoords={page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},this.startCoords={page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},this.pointerDelta={page:{x:0,y:0,vx:0,vy:0,speed:0},client:{x:0,y:0,vx:0,vy:0,speed:0},timeStamp:0},this.downEvent=null,this.downPointer={},this._eventTarget=null,this._curEventTarget=null,this.prevEvent=null,this.pointerIsDown=!1,this.pointerWasMoved=!1,this._interacting=!1,this._ending=!1,this.pointerType=n,f.fire("new",this),a.interactions.push(this)}return t.prototype.pointerDown=function(t,e,n){var r=this.updatePointer(t,e,!0);f.fire("down",{pointer:t,event:e,eventTarget:n,pointerIndex:r,interaction:this})},t.prototype.start=function(t,e,n){this.interacting()||!this.pointerIsDown||this.pointerIds.length<("gesture"===t.name?2:1)||(-1===a.interactions.indexOf(this)&&a.interactions.push(this),c.copyAction(this.prepared,t),this.target=e,this.element=n,f.fire("action-start",{interaction:this,event:this.downEvent}))},t.prototype.pointerMove=function(e,n,r){this.simulation||(this.updatePointer(e),c.setCoords(this.curCoords,this.pointers));var i=this.curCoords.page.x===this.prevCoords.page.x&&this.curCoords.page.y===this.prevCoords.page.y&&this.curCoords.client.x===this.prevCoords.client.x&&this.curCoords.client.y===this.prevCoords.client.y,o=void 0,s=void 0;this.pointerIsDown&&!this.pointerWasMoved&&(o=this.curCoords.client.x-this.startCoords.client.x,s=this.curCoords.client.y-this.startCoords.client.y,this.pointerWasMoved=c.hypot(o,s)>t.pointerMoveTolerance);var a={pointer:e,pointerIndex:this.getPointerIndex(e),event:n,eventTarget:r,dx:o,dy:s,duplicate:i,interaction:this,interactingBeforeMove:this.interacting()};i||c.setCoordDeltas(this.pointerDelta,this.prevCoords,this.curCoords),f.fire("move",a),i||(this.interacting()&&this.doMove(a),this.pointerWasMoved&&c.copyCoords(this.prevCoords,this.curCoords))},t.prototype.doMove=function(t){t=c.extend({pointer:this.pointers[0],event:this.prevEvent,eventTarget:this._eventTarget,interaction:this},t||{}),f.fire("before-action-move",t),this._dontFireMove||f.fire("action-move",t),this._dontFireMove=!1},t.prototype.pointerUp=function(t,e,n,r){var i=this.getPointerIndex(t);f.fire(/cancel$/i.test(e.type)?"cancel":"up",{pointer:t,pointerIndex:i,event:e,eventTarget:n,curEventTarget:r,interaction:this}),this.simulation||this.end(e),this.pointerIsDown=!1,this.removePointer(t,e)},t.prototype.end=function(t){this._ending=!0,t=t||this.prevEvent,this.interacting()&&f.fire("action-end",{event:t,interaction:this}),this.stop(),this._ending=!1},t.prototype.currentAction=function(){return this._interacting?this.prepared.name:null},t.prototype.interacting=function(){return this._interacting},t.prototype.stop=function(){f.fire("stop",{interaction:this}),this._interacting&&(f.fire("stop-active",{interaction:this}),f.fire("stop-"+this.prepared.name,{interaction:this})),this.target=this.element=null,this._interacting=!1,this.prepared.name=this.prevEvent=null},t.prototype.getPointerIndex=function(t){return"mouse"===this.pointerType||"pen"===this.pointerType?0:this.pointerIds.indexOf(c.getPointerId(t))},t.prototype.updatePointer=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e&&/(down|start)$/i.test(e.type),r=c.getPointerId(t),i=this.getPointerIndex(t);return-1===i&&(i=this.pointerIds.length,this.pointerIds[i]=r),n&&f.fire("update-pointer-down",{pointer:t,event:e,down:n,pointerId:r,pointerIndex:i,interaction:this}),this.pointers[i]=t,i},t.prototype.removePointer=function(t,e){var n=this.getPointerIndex(t);-1!==n&&(f.fire("remove-pointer",{pointer:t,event:e,pointerIndex:n,interaction:this}),this.pointers.splice(n,1),this.pointerIds.splice(n,1),this.downTargets.splice(n,1),this.downTimes.splice(n,1))},t.prototype._updateEventTargets=function(t,e){this._eventTarget=t,this._curEventTarget=e},t}(),y=0;y<g.length;y++){var x=g[y];v[x]=i(x)}var b={},w=p.pEventTypes;u.PointerEvent?(b[w.down]=v.pointerDown,b[w.move]=v.pointerMove,b[w.up]=v.pointerUp,b[w.cancel]=v.pointerUp):(b.mousedown=v.pointerDown,b.mousemove=v.pointerMove,b.mouseup=v.pointerUp,b.touchstart=v.pointerDown,b.touchmove=v.pointerMove,b.touchend=v.pointerUp,b.touchcancel=v.pointerUp),b.blur=o,f.on("update-pointer-down",function(t){var e=t.interaction,n=t.pointer,r=t.pointerId,i=t.pointerIndex,o=t.event,s=t.eventTarget,a=t.down;e.pointerIds[i]=r,e.pointers[i]=n,a&&(e.pointerIsDown=!0),e.interacting()||(c.setCoords(e.startCoords,e.pointers),c.copyCoords(e.curCoords,e.startCoords),c.copyCoords(e.prevCoords,e.startCoords),e.downEvent=o,e.downTimes[i]=e.curCoords.timeStamp,e.downTargets[i]=s||o&&c.getEventTargets(o)[0],e.pointerWasMoved=!1,c.pointerExtend(e.downPointer,n))}),a.signals.on("add-document",s),a.signals.on("remove-document",s),m.pointerMoveTolerance=1,m.doOnInteractions=i,m.endAll=o,m.signals=f,m.docEvents=b,a.endAllInteractions=o,e.exports=m},{"./scope":33,"./utils":44,"./utils/Signals":34,"./utils/browser":36,"./utils/domObjects":38,"./utils/events":40,"./utils/interactionFinder":45}],6:[function(t,e,n){"use strict";function r(t,e,n,r){var i=t.prepared.name,s=new o(t,e,i,n,t.element,null,r);t.target.fire(s),t.prevEvent=s}var i=t("../Interaction"),o=t("../InteractEvent"),s={firePrepared:r,names:[],methodDict:{}};i.signals.on("action-start",function(t){var e=t.interaction,n=t.event;e._interacting=!0,r(e,n,"start")}),i.signals.on("action-move",function(t){var e=t.interaction;if(r(e,t.event,"move",t.preEnd),!e.interacting())return!1}),i.signals.on("action-end",function(t){r(t.interaction,t.event,"end")}),e.exports=s},{"../InteractEvent":3,"../Interaction":5}],7:[function(t,e,n){"use strict";var r=t("./base"),i=t("../utils"),o=t("../InteractEvent"),s=t("../Interactable"),a=t("../Interaction"),c=t("../defaultOptions"),l={defaults:{enabled:!1,mouseButtons:null,origin:null,snap:null,restrict:null,inertia:null,autoScroll:null,startAxis:"xy",lockAxis:"xy"},checker:function(t,e,n){var r=n.options.drag;return r.enabled?{name:"drag",axis:"start"===r.lockAxis?r.startAxis:r.lockAxis}:null},getCursor:function(){return"move"}};a.signals.on("before-action-move",function(t){var e=t.interaction;if("drag"===e.prepared.name){var n=e.prepared.axis;"x"===n?(e.curCoords.page.y=e.startCoords.page.y,e.curCoords.client.y=e.startCoords.client.y,e.pointerDelta.page.speed=Math.abs(e.pointerDelta.page.vx),e.pointerDelta.client.speed=Math.abs(e.pointerDelta.client.vx),e.pointerDelta.client.vy=0,e.pointerDelta.page.vy=0):"y"===n&&(e.curCoords.page.x=e.startCoords.page.x,e.curCoords.client.x=e.startCoords.client.x,e.pointerDelta.page.speed=Math.abs(e.pointerDelta.page.vy),e.pointerDelta.client.speed=Math.abs(e.pointerDelta.client.vy),e.pointerDelta.client.vx=0,e.pointerDelta.page.vx=0)}}),o.signals.on("new",function(t){var e=t.iEvent,n=t.interaction;if("dragmove"===e.type){var r=n.prepared.axis;"x"===r?(e.pageY=n.startCoords.page.y,e.clientY=n.startCoords.client.y,e.dy=0):"y"===r&&(e.pageX=n.startCoords.page.x,e.clientX=n.startCoords.client.x,e.dx=0)}}),s.prototype.draggable=function(t){return i.is.object(t)?(this.options.drag.enabled=!1!==t.enabled,this.setPerAction("drag",t),this.setOnEvents("drag",t),/^(xy|x|y|start)$/.test(t.lockAxis)&&(this.options.drag.lockAxis=t.lockAxis),/^(xy|x|y)$/.test(t.startAxis)&&(this.options.drag.startAxis=t.startAxis),this):i.is.bool(t)?(this.options.drag.enabled=t,t||(this.ondragstart=this.ondragstart=this.ondragend=null),this):this.options.drag},r.drag=l,r.names.push("drag"),i.merge(s.eventTypes,["dragstart","dragmove","draginertiastart","draginertiaresume","dragend"]),r.methodDict.drag="draggable",c.drag=l.defaults,e.exports=l},{"../InteractEvent":3,"../Interactable":4,"../Interaction":5,"../defaultOptions":18,"../utils":44,"./base":6}],8:[function(t,e,n){"use strict";function r(t,e){for(var n=[],r=[],i=0;i<u.interactables.length;i++){var o;o=u.interactables[i];var s=o;if(s.options.drop.enabled){var a=s.options.drop.accept;if(!(p.is.element(a)&&a!==e||p.is.string(a)&&!p.matchesSelector(e,a)))for(var c=p.is.string(s.target)?s._context.querySelectorAll(s.target):[s.target],l=0;l<c.length;l++){var d;d=c[l];var f=d;f!==e&&(n.push(s),r.push(f))}}}return{elements:r,dropzones:n}}function i(t,e){for(var n=void 0,r=0;r<t.dropzones.length;r++){var i=t.dropzones[r],o=t.elements[r];o!==n&&(e.target=o,i.fire(e)),n=o}}function o(t,e){var n=r(t,e);t.dropzones=n.dropzones,t.elements=n.elements,t.rects=[];for(var i=0;i<t.dropzones.length;i++)t.rects[i]=t.dropzones[i].getRect(t.elements[i])}function s(t,e,n){var r=t.interaction,i=[];y&&o(r.activeDrops,n);for(var s=0;s<r.activeDrops.dropzones.length;s++){var a=r.activeDrops.dropzones[s],c=r.activeDrops.elements[s],l=r.activeDrops.rects[s];i.push(a.dropCheck(t,e,r.target,n,c,l)?c:null)}var u=p.indexOfDeepestElement(i);return{dropzone:r.activeDrops.dropzones[u]||null,element:r.activeDrops.elements[u]||null}}function a(t,e,n){var r={enter:null,leave:null,activate:null,deactivate:null,move:null,drop:null},i={dragEvent:n,interaction:t,target:t.dropElement,dropzone:t.dropTarget,relatedTarget:n.target,draggable:n.interactable,timeStamp:n.timeStamp};return t.dropElement!==t.prevDropElement&&(t.prevDropTarget&&(r.leave=p.extend({type:"dragleave"},i),n.dragLeave=r.leave.target=t.prevDropElement,n.prevDropzone=r.leave.dropzone=t.prevDropTarget),t.dropTarget&&(r.enter={dragEvent:n,interaction:t,target:t.dropElement,dropzone:t.dropTarget,relatedTarget:n.target,draggable:n.interactable,timeStamp:n.timeStamp,type:"dragenter"},n.dragEnter=t.dropElement,n.dropzone=t.dropTarget)),"dragend"===n.type&&t.dropTarget&&(r.drop=p.extend({type:"drop"},i),n.dropzone=t.dropTarget,n.relatedTarget=t.dropElement),"dragstart"===n.type&&(r.activate=p.extend({type:"dropactivate"},i),r.activate.target=null,r.activate.dropzone=null),"dragend"===n.type&&(r.deactivate=p.extend({type:"dropdeactivate"},i),r.deactivate.target=null,r.deactivate.dropzone=null),"dragmove"===n.type&&t.dropTarget&&(r.move=p.extend({dragmove:n,type:"dropmove"},i),n.dropzone=t.dropTarget),r}function c(t,e){var n=t.activeDrops,r=t.prevDropTarget,o=t.dropTarget,s=t.dropElement;e.leave&&r.fire(e.leave),e.move&&o.fire(e.move),e.enter&&o.fire(e.enter),e.drop&&o.fire(e.drop),e.deactivate&&i(n,e.deactivate),t.prevDropTarget=o,t.prevDropElement=s}var l=t("./base"),p=t("../utils"),u=t("../scope"),d=t("../interact"),f=t("../InteractEvent"),v=t("../Interactable"),g=t("../Interaction"),h=t("../defaultOptions"),m={defaults:{enabled:!1,accept:null,overlap:"pointer"}},y=!1;g.signals.on("action-start",function(t){var e=t.interaction,n=t.event;if("drag"===e.prepared.name){e.activeDrops.dropzones=[],e.activeDrops.elements=[],e.activeDrops.rects=[],e.dropEvents=null,e.dynamicDrop||o(e.activeDrops,e.element);var r=e.prevEvent,s=a(e,n,r);s.activate&&i(e.activeDrops,s.activate)}}),f.signals.on("new",function(t){var e=t.interaction,n=t.iEvent,r=t.event;if("dragmove"===n.type||"dragend"===n.type){var i=e.element,o=n,c=s(o,r,i);e.dropTarget=c.dropzone,e.dropElement=c.element,e.dropEvents=a(e,r,o)}}),g.signals.on("action-move",function(t){var e=t.interaction;"drag"===e.prepared.name&&c(e,e.dropEvents)}),g.signals.on("action-end",function(t){var e=t.interaction;"drag"===e.prepared.name&&c(e,e.dropEvents)}),g.signals.on("stop-drag",function(t){var e=t.interaction;e.activeDrops={dropzones:null,elements:null,rects:null},e.dropEvents=null}),v.prototype.dropzone=function(t){return p.is.object(t)?(this.options.drop.enabled=!1!==t.enabled,p.is.function(t.ondrop)&&(this.events.ondrop=t.ondrop),p.is.function(t.ondropactivate)&&(this.events.ondropactivate=t.ondropactivate),p.is.function(t.ondropdeactivate)&&(this.events.ondropdeactivate=t.ondropdeactivate),p.is.function(t.ondragenter)&&(this.events.ondragenter=t.ondragenter),p.is.function(t.ondragleave)&&(this.events.ondragleave=t.ondragleave),p.is.function(t.ondropmove)&&(this.events.ondropmove=t.ondropmove),/^(pointer|center)$/.test(t.overlap)?this.options.drop.overlap=t.overlap:p.is.number(t.overlap)&&(this.options.drop.overlap=Math.max(Math.min(1,t.overlap),0)),"accept"in t&&(this.options.drop.accept=t.accept),"checker"in t&&(this.options.drop.checker=t.checker),this):p.is.bool(t)?(this.options.drop.enabled=t,t||(this.ondragenter=this.ondragleave=this.ondrop=this.ondropactivate=this.ondropdeactivate=null),this):this.options.drop},v.prototype.dropCheck=function(t,e,n,r,i,o){var s=!1;if(!(o=o||this.getRect(i)))return!!this.options.drop.checker&&this.options.drop.checker(t,e,s,this,i,n,r);var a=this.options.drop.overlap;if("pointer"===a){var c=p.getOriginXY(n,r,"drag"),l=p.getPageXY(t);l.x+=c.x,l.y+=c.y;var u=l.x>o.left&&l.x<o.right,d=l.y>o.top&&l.y<o.bottom;s=u&&d}var f=n.getRect(r);if(f&&"center"===a){var v=f.left+f.width/2,g=f.top+f.height/2;s=v>=o.left&&v<=o.right&&g>=o.top&&g<=o.bottom}if(f&&p.is.number(a)){s=Math.max(0,Math.min(o.right,f.right)-Math.max(o.left,f.left))*Math.max(0,Math.min(o.bottom,f.bottom)-Math.max(o.top,f.top))/(f.width*f.height)>=a}return this.options.drop.checker&&(s=this.options.drop.checker(t,e,s,this,i,n,r)),s},v.signals.on("unset",function(t){t.interactable.dropzone(!1)}),v.settingsMethods.push("dropChecker"),g.signals.on("new",function(t){t.dropTarget=null,t.dropElement=null,t.prevDropTarget=null,t.prevDropElement=null,t.dropEvents=null,t.activeDrops={dropzones:[],elements:[],rects:[]}}),g.signals.on("stop",function(t){var e=t.interaction;e.dropTarget=e.dropElement=e.prevDropTarget=e.prevDropElement=null}),d.dynamicDrop=function(t){return p.is.bool(t)?(y=t,d):y},p.merge(v.eventTypes,["dragenter","dragleave","dropactivate","dropdeactivate","dropmove","drop"]),l.methodDict.drop="dropzone",h.drop=m.defaults,e.exports=m},{"../InteractEvent":3,"../Interactable":4,"../Interaction":5,"../defaultOptions":18,"../interact":21,"../scope":33,"../utils":44,"./base":6}],9:[function(t,e,n){"use strict";var r=t("./base"),i=t("../utils"),o=t("../InteractEvent"),s=t("../Interactable"),a=t("../Interaction"),c=t("../defaultOptions"),l={defaults:{enabled:!1,origin:null,restrict:null},checker:function(t,e,n,r,i){return i.pointerIds.length>=2?{name:"gesture"}:null},getCursor:function(){return""}};o.signals.on("new",function(t){var e=t.iEvent,n=t.interaction;"gesturestart"===e.type&&(e.ds=0,n.gesture.startDistance=n.gesture.prevDistance=e.distance,n.gesture.startAngle=n.gesture.prevAngle=e.angle,n.gesture.scale=1)}),o.signals.on("new",function(t){var e=t.iEvent,n=t.interaction;"gesturemove"===e.type&&(e.ds=e.scale-n.gesture.scale,n.target.fire(e),n.gesture.prevAngle=e.angle,n.gesture.prevDistance=e.distance,e.scale===1/0||null===e.scale||void 0===e.scale||isNaN(e.scale)||(n.gesture.scale=e.scale))}),s.prototype.gesturable=function(t){return i.is.object(t)?(this.options.gesture.enabled=!1!==t.enabled,this.setPerAction("gesture",t),this.setOnEvents("gesture",t),this):i.is.bool(t)?(this.options.gesture.enabled=t,t||(this.ongesturestart=this.ongesturestart=this.ongestureend=null),this):this.options.gesture},o.signals.on("set-delta",function(t){var e=t.interaction,n=t.iEvent,r=t.action,s=t.event,a=t.starting,c=t.ending,l=t.deltaSource;if("gesture"===r){var p=e.pointers;n.touches=[p[0],p[1]],a?(n.distance=i.touchDistance(p,l),n.box=i.touchBBox(p),n.scale=1,n.ds=0,n.angle=i.touchAngle(p,void 0,l),n.da=0):c||s instanceof o?(n.distance=e.prevEvent.distance,n.box=e.prevEvent.box,n.scale=e.prevEvent.scale,n.ds=n.scale-1,n.angle=e.prevEvent.angle,n.da=n.angle-e.gesture.startAngle):(n.distance=i.touchDistance(p,l),n.box=i.touchBBox(p),n.scale=n.distance/e.gesture.startDistance,n.angle=i.touchAngle(p,e.gesture.prevAngle,l),n.ds=n.scale-e.gesture.prevScale,n.da=n.angle-e.gesture.prevAngle)}}),a.signals.on("new",function(t){t.gesture={start:{x:0,y:0},startDistance:0,prevDistance:0,distance:0,scale:1,startAngle:0,prevAngle:0}}),r.gesture=l,r.names.push("gesture"),i.merge(s.eventTypes,["gesturestart","gesturemove","gestureend"]),r.methodDict.gesture="gesturable",c.gesture=l.defaults,e.exports=l},{"../InteractEvent":3,"../Interactable":4,"../Interaction":5,"../defaultOptions":18,"../utils":44,"./base":6}],10:[function(t,e,n){"use strict";function r(t,e,n,r,i,s,a){if(!e)return!1;if(!0===e){var c=o.is.number(s.width)?s.width:s.right-s.left,l=o.is.number(s.height)?s.height:s.bottom-s.top;if(c<0&&("left"===t?t="right":"right"===t&&(t="left")),l<0&&("top"===t?t="bottom":"bottom"===t&&(t="top")),"left"===t)return n.x<(c>=0?s.left:s.right)+a;if("top"===t)return n.y<(l>=0?s.top:s.bottom)+a;if("right"===t)return n.x>(c>=0?s.right:s.left)-a;if("bottom"===t)return n.y>(l>=0?s.bottom:s.top)-a}return!!o.is.element(r)&&(o.is.element(e)?e===r:o.matchesUpTo(r,e,i))}var i=t("./base"),o=t("../utils"),s=t("../utils/browser"),a=t("../InteractEvent"),c=t("../Interactable"),l=t("../Interaction"),p=t("../defaultOptions"),u=s.supportsTouch||s.supportsPointerEvent?20:10,d={defaults:{enabled:!1,mouseButtons:null,origin:null,snap:null,restrict:null,inertia:null,autoScroll:null,square:!1,preserveAspectRatio:!1,axis:"xy",margin:NaN,edges:null,invert:"none"},checker:function(t,e,n,i,s,a){if(!a)return null;var c=o.extend({},s.curCoords.page),l=n.options;if(l.resize.enabled){var p=l.resize,d={left:!1,right:!1,top:!1,bottom:!1};if(o.is.object(p.edges)){for(var f in d)d[f]=r(f,p.edges[f],c,s._eventTarget,i,a,p.margin||u);if(d.left=d.left&&!d.right,d.top=d.top&&!d.bottom,d.left||d.right||d.top||d.bottom)return{name:"resize",edges:d}}else{var v="y"!==l.resize.axis&&c.x>a.right-u,g="x"!==l.resize.axis&&c.y>a.bottom-u;if(v||g)return{name:"resize",axes:(v?"x":"")+(g?"y":"")}}}return null},cursors:s.isIe9?{x:"e-resize",y:"s-resize",xy:"se-resize",top:"n-resize",left:"w-resize",bottom:"s-resize",right:"e-resize",topleft:"se-resize",bottomright:"se-resize",topright:"ne-resize",bottomleft:"ne-resize"}:{x:"ew-resize",y:"ns-resize",xy:"nwse-resize",top:"ns-resize",left:"ew-resize",bottom:"ns-resize",right:"ew-resize",topleft:"nwse-resize",bottomright:"nwse-resize",topright:"nesw-resize",bottomleft:"nesw-resize"},getCursor:function(t){if(t.axis)return d.cursors[t.name+t.axis];if(t.edges){for(var e="",n=["top","bottom","left","right"],r=0;r<4;r++)t.edges[n[r]]&&(e+=n[r]);return d.cursors[e]}}};a.signals.on("new",function(t){var e=t.iEvent,n=t.interaction;if("resizestart"===e.type&&n.prepared.edges){var r=n.target.getRect(n.element),i=n.target.options.resize;if(i.square||i.preserveAspectRatio){var s=o.extend({},n.prepared.edges);s.top=s.top||s.left&&!s.bottom,s.left=s.left||s.top&&!s.right,s.bottom=s.bottom||s.right&&!s.top,s.right=s.right||s.bottom&&!s.left,n.prepared._linkedEdges=s}else n.prepared._linkedEdges=null;i.preserveAspectRatio&&(n.resizeStartAspectRatio=r.width/r.height),n.resizeRects={start:r,current:o.extend({},r),inverted:o.extend({},r),previous:o.extend({},r),delta:{left:0,right:0,width:0,top:0,bottom:0,height:0}},e.rect=n.resizeRects.inverted,e.deltaRect=n.resizeRects.delta}}),a.signals.on("new",function(t){var e=t.iEvent,n=t.phase,r=t.interaction;if("move"===n&&r.prepared.edges){var i=r.target.options.resize,s=i.invert,a="reposition"===s||"negate"===s,c=r.prepared.edges,l=r.resizeRects.start,p=r.resizeRects.current,u=r.resizeRects.inverted,d=r.resizeRects.delta,f=o.extend(r.resizeRects.previous,u),v=c,g=e.dx,h=e.dy;if(i.preserveAspectRatio||i.square){var m=i.preserveAspectRatio?r.resizeStartAspectRatio:1;c=r.prepared._linkedEdges,v.left&&v.bottom||v.right&&v.top?h=-g/m:v.left||v.right?h=g/m:(v.top||v.bottom)&&(g=h*m)}if(c.top&&(p.top+=h),c.bottom&&(p.bottom+=h),c.left&&(p.left+=g),c.right&&(p.right+=g),a){if(o.extend(u,p),"reposition"===s){var y=void 0;u.top>u.bottom&&(y=u.top,u.top=u.bottom,u.bottom=y),u.left>u.right&&(y=u.left,u.left=u.right,u.right=y)}}else u.top=Math.min(p.top,l.bottom),u.bottom=Math.max(p.bottom,l.top),u.left=Math.min(p.left,l.right),u.right=Math.max(p.right,l.left);u.width=u.right-u.left,u.height=u.bottom-u.top;for(var x in u)d[x]=u[x]-f[x];e.edges=r.prepared.edges,e.rect=u,e.deltaRect=d}}),c.prototype.resizable=function(t){return o.is.object(t)?(this.options.resize.enabled=!1!==t.enabled,this.setPerAction("resize",t),this.setOnEvents("resize",t),/^x$|^y$|^xy$/.test(t.axis)?this.options.resize.axis=t.axis:null===t.axis&&(this.options.resize.axis=p.resize.axis),o.is.bool(t.preserveAspectRatio)?this.options.resize.preserveAspectRatio=t.preserveAspectRatio:o.is.bool(t.square)&&(this.options.resize.square=t.square),this):o.is.bool(t)?(this.options.resize.enabled=t,t||(this.onresizestart=this.onresizestart=this.onresizeend=null),this):this.options.resize},l.signals.on("new",function(t){t.resizeAxes="xy"}),a.signals.on("set-delta",function(t){var e=t.interaction,n=t.iEvent;"resize"===t.action&&e.resizeAxes&&(e.target.options.resize.square?("y"===e.resizeAxes?n.dx=n.dy:n.dy=n.dx,n.axes="xy"):(n.axes=e.resizeAxes,"x"===e.resizeAxes?n.dy=0:"y"===e.resizeAxes&&(n.dx=0)))}),i.resize=d,i.names.push("resize"),
o.merge(c.eventTypes,["resizestart","resizemove","resizeinertiastart","resizeinertiaresume","resizeend"]),i.methodDict.resize="resizable",p.resize=d.defaults,e.exports=d},{"../InteractEvent":3,"../Interactable":4,"../Interaction":5,"../defaultOptions":18,"../utils":44,"../utils/browser":36,"./base":6}],11:[function(t,e,n){"use strict";var r=t("./utils/raf"),i=t("./utils/window").getWindow,o=t("./utils/is"),s=t("./utils/domUtils"),a=t("./Interaction"),c=t("./defaultOptions"),l={defaults:{enabled:!1,container:null,margin:60,speed:300},interaction:null,i:null,x:0,y:0,isScrolling:!1,prevTime:0,start:function(t){l.isScrolling=!0,r.cancel(l.i),l.interaction=t,l.prevTime=(new Date).getTime(),l.i=r.request(l.scroll)},stop:function(){l.isScrolling=!1,r.cancel(l.i)},scroll:function(){var t=l.interaction.target.options[l.interaction.prepared.name].autoScroll,e=t.container||i(l.interaction.element),n=(new Date).getTime(),s=(n-l.prevTime)/1e3,a=t.speed*s;a>=1&&(o.window(e)?e.scrollBy(l.x*a,l.y*a):e&&(e.scrollLeft+=l.x*a,e.scrollTop+=l.y*a),l.prevTime=n),l.isScrolling&&(r.cancel(l.i),l.i=r.request(l.scroll))},check:function(t,e){var n=t.options;return n[e].autoScroll&&n[e].autoScroll.enabled},onInteractionMove:function(t){var e=t.interaction,n=t.pointer;if(e.interacting()&&l.check(e.target,e.prepared.name)){if(e.simulation)return void(l.x=l.y=0);var r=void 0,a=void 0,c=void 0,p=void 0,u=e.target.options[e.prepared.name].autoScroll,d=u.container||i(e.element);if(o.window(d))p=n.clientX<l.margin,r=n.clientY<l.margin,a=n.clientX>d.innerWidth-l.margin,c=n.clientY>d.innerHeight-l.margin;else{var f=s.getElementClientRect(d);p=n.clientX<f.left+l.margin,r=n.clientY<f.top+l.margin,a=n.clientX>f.right-l.margin,c=n.clientY>f.bottom-l.margin}l.x=a?1:p?-1:0,l.y=c?1:r?-1:0,l.isScrolling||(l.margin=u.margin,l.speed=u.speed,l.start(e))}}};a.signals.on("stop-active",function(){l.stop()}),a.signals.on("action-move",l.onInteractionMove),c.perAction.autoScroll=l.defaults,e.exports=l},{"./Interaction":5,"./defaultOptions":18,"./utils/domUtils":39,"./utils/is":46,"./utils/raf":50,"./utils/window":52}],12:[function(t,e,n){"use strict";var r=t("../Interactable"),i=t("../actions/base"),o=t("../utils/is"),s=t("../utils/domUtils"),a=t("../utils"),c=a.warnOnce;r.prototype.getAction=function(t,e,n,r){var i=this.defaultActionChecker(t,e,n,r);return this.options.actionChecker?this.options.actionChecker(t,e,i,this,r,n):i},r.prototype.ignoreFrom=c(function(t){return this._backCompatOption("ignoreFrom",t)},"Interactable.ignoreForm() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."),r.prototype.allowFrom=c(function(t){return this._backCompatOption("allowFrom",t)},"Interactable.allowForm() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."),r.prototype.testIgnore=function(t,e,n){return!(!t||!o.element(n))&&(o.string(t)?s.matchesUpTo(n,t,e):!!o.element(t)&&s.nodeContains(t,n))},r.prototype.testAllow=function(t,e,n){return!t||!!o.element(n)&&(o.string(t)?s.matchesUpTo(n,t,e):!!o.element(t)&&s.nodeContains(t,n))},r.prototype.testIgnoreAllow=function(t,e,n){return!this.testIgnore(t.ignoreFrom,e,n)&&this.testAllow(t.allowFrom,e,n)},r.prototype.actionChecker=function(t){return o.function(t)?(this.options.actionChecker=t,this):null===t?(delete this.options.actionChecker,this):this.options.actionChecker},r.prototype.styleCursor=function(t){return o.bool(t)?(this.options.styleCursor=t,this):null===t?(delete this.options.styleCursor,this):this.options.styleCursor},r.prototype.defaultActionChecker=function(t,e,n,r){for(var o=this.getRect(r),s=e.buttons||{0:1,1:4,3:8,4:16}[e.button],a=null,c=0;c<i.names.length;c++){var l;l=i.names[c];var p=l;if((!n.pointerIsDown||!/mouse|pointer/.test(n.pointerType)||0!=(s&this.options[p].mouseButtons))&&(a=i[p].checker(t,e,this,r,n,o)))return a}}},{"../Interactable":4,"../actions/base":6,"../utils":44,"../utils/domUtils":39,"../utils/is":46}],13:[function(t,e,n){"use strict";function r(t,e,n,r){return v.is.object(t)&&e.testIgnoreAllow(e.options[t.name],n,r)&&e.options[t.name].enabled&&a(e,n,t)?t:null}function i(t,e,n,i,o,s){for(var a=0,c=i.length;a<c;a++){var l=i[a],p=o[a],u=r(l.getAction(e,n,t,p),l,p,s);if(u)return{action:u,target:l,element:p}}return{}}function o(t,e,n,r){function o(t){s.push(t),a.push(c)}for(var s=[],a=[],c=r;v.is.element(c);){s=[],a=[],f.interactables.forEachMatch(c,o);var l=i(t,e,n,s,a,r);if(l.action&&!l.target.options[l.action.name].manualStart)return l;c=v.parentNode(c)}return{}}function s(t,e){var n=e.action,r=e.target,i=e.element;if(n=n||{},t.target&&t.target.options.styleCursor&&(t.target._doc.documentElement.style.cursor=""),t.target=r,t.element=i,v.copyAction(t.prepared,n),r&&r.options.styleCursor){var o=n?u[n.name].getCursor(n):"";t.target._doc.documentElement.style.cursor=o}g.fire("prepared",{interaction:t})}function a(t,e,n){var r=t.options,i=r[n.name].max,o=r[n.name].maxPerElement,s=0,a=0,c=0;if(i&&o&&h.maxInteractions){for(var l=0;l<f.interactions.length;l++){var p;p=f.interactions[l];var u=p,d=u.prepared.name;if(u.interacting()){if(++s>=h.maxInteractions)return!1;if(u.target===t){if((a+=d===n.name|0)>=i)return!1;if(u.element===e&&(c++,d!==n.name||c>=o))return!1}}}return h.maxInteractions>0}}var c=t("../interact"),l=t("../Interactable"),p=t("../Interaction"),u=t("../actions/base"),d=t("../defaultOptions"),f=t("../scope"),v=t("../utils"),g=t("../utils/Signals").new();t("./InteractableMethods");var h={signals:g,withinInteractionLimit:a,maxInteractions:1/0,defaults:{perAction:{manualStart:!1,max:1/0,maxPerElement:1,allowFrom:null,ignoreFrom:null,mouseButtons:1}},setActionDefaults:function(t){v.extend(t.defaults,h.defaults.perAction)},validateAction:r};p.signals.on("down",function(t){var e=t.interaction,n=t.pointer,r=t.event,i=t.eventTarget;if(!e.interacting()){s(e,o(e,n,r,i))}}),p.signals.on("move",function(t){var e=t.interaction,n=t.pointer,r=t.event,i=t.eventTarget;if("mouse"===e.pointerType&&!e.pointerIsDown&&!e.interacting()){s(e,o(e,n,r,i))}}),p.signals.on("move",function(t){var e=t.interaction,n=t.event;if(e.pointerIsDown&&!e.interacting()&&e.pointerWasMoved&&e.prepared.name){g.fire("before-start",t);var r=e.target;e.prepared.name&&r&&(r.options[e.prepared.name].manualStart||!a(r,e.element,e.prepared)?e.stop(n):e.start(e.prepared,r,e.element))}}),p.signals.on("stop",function(t){var e=t.interaction,n=e.target;n&&n.options.styleCursor&&(n._doc.documentElement.style.cursor="")}),c.maxInteractions=function(t){return v.is.number(t)?(h.maxInteractions=t,c):h.maxInteractions},l.settingsMethods.push("styleCursor"),l.settingsMethods.push("actionChecker"),l.settingsMethods.push("ignoreFrom"),l.settingsMethods.push("allowFrom"),d.base.actionChecker=null,d.base.styleCursor=!0,v.extend(d.perAction,h.defaults.perAction),e.exports=h},{"../Interactable":4,"../Interaction":5,"../actions/base":6,"../defaultOptions":18,"../interact":21,"../scope":33,"../utils":44,"../utils/Signals":34,"./InteractableMethods":12}],14:[function(t,e,n){"use strict";function r(t,e){if(!e)return!1;var n=e.options.drag.startAxis;return"xy"===t||"xy"===n||n===t}var i=t("./base"),o=t("../scope"),s=t("../utils/is"),a=t("../utils/domUtils"),c=a.parentNode;i.setActionDefaults(t("../actions/drag")),i.signals.on("before-start",function(t){var e=t.interaction,n=t.eventTarget,a=t.dx,l=t.dy;if("drag"===e.prepared.name){var p=Math.abs(a),u=Math.abs(l),d=e.target.options.drag,f=d.startAxis,v=p>u?"x":p<u?"y":"xy";if(e.prepared.axis="start"===d.lockAxis?v[0]:d.lockAxis,"xy"!==v&&"xy"!==f&&f!==v){e.prepared.name=null;for(var g=n,h=function(t){if(t!==e.target){var o=e.target.options.drag;if(!o.manualStart&&t.testIgnoreAllow(o,g,n)){var s=t.getAction(e.downPointer,e.downEvent,e,g);if(s&&"drag"===s.name&&r(v,t)&&i.validateAction(s,t,g,n))return t}}};s.element(g);){var m=o.interactables.forEachMatch(g,h);if(m){e.prepared.name="drag",e.target=m,e.element=g;break}g=c(g)}}}})},{"../actions/drag":7,"../scope":33,"../utils/domUtils":39,"../utils/is":46,"./base":13}],15:[function(t,e,n){"use strict";t("./base").setActionDefaults(t("../actions/gesture"))},{"../actions/gesture":9,"./base":13}],16:[function(t,e,n){"use strict";function r(t){var e=t.prepared&&t.prepared.name;if(!e)return null;var n=t.target.options;return n[e].hold||n[e].delay}var i=t("./base"),o=t("../Interaction");i.defaults.perAction.hold=0,i.defaults.perAction.delay=0,o.signals.on("new",function(t){t.autoStartHoldTimer=null}),i.signals.on("prepared",function(t){var e=t.interaction,n=r(e);n>0&&(e.autoStartHoldTimer=setTimeout(function(){e.start(e.prepared,e.target,e.element)},n))}),o.signals.on("move",function(t){var e=t.interaction,n=t.duplicate;e.pointerWasMoved&&!n&&clearTimeout(e.autoStartHoldTimer)}),i.signals.on("before-start",function(t){var e=t.interaction;r(e)>0&&(e.prepared.name=null)}),e.exports={getHoldDuration:r}},{"../Interaction":5,"./base":13}],17:[function(t,e,n){"use strict";t("./base").setActionDefaults(t("../actions/resize"))},{"../actions/resize":10,"./base":13}],18:[function(t,e,n){"use strict";e.exports={base:{accept:null,preventDefault:"auto",deltaSource:"page"},perAction:{origin:{x:0,y:0},inertia:{enabled:!1,resistance:10,minSpeed:100,endSpeed:10,allowResume:!0,smoothEndDuration:300}}}},{}],19:[function(t,e,n){"use strict";t("./inertia"),t("./modifiers/snap"),t("./modifiers/restrict"),t("./pointerEvents/base"),t("./pointerEvents/holdRepeat"),t("./pointerEvents/interactableTargets"),t("./autoStart/hold"),t("./actions/gesture"),t("./actions/resize"),t("./actions/drag"),t("./actions/drop"),t("./modifiers/snapSize"),t("./modifiers/restrictEdges"),t("./modifiers/restrictSize"),t("./autoStart/gesture"),t("./autoStart/resize"),t("./autoStart/drag"),t("./interactablePreventDefault.js"),t("./autoScroll"),e.exports=t("./interact")},{"./actions/drag":7,"./actions/drop":8,"./actions/gesture":9,"./actions/resize":10,"./autoScroll":11,"./autoStart/drag":14,"./autoStart/gesture":15,"./autoStart/hold":16,"./autoStart/resize":17,"./inertia":20,"./interact":21,"./interactablePreventDefault.js":22,"./modifiers/restrict":24,"./modifiers/restrictEdges":25,"./modifiers/restrictSize":26,"./modifiers/snap":27,"./modifiers/snapSize":28,"./pointerEvents/base":30,"./pointerEvents/holdRepeat":31,"./pointerEvents/interactableTargets":32}],20:[function(t,e,n){"use strict";function r(t,e){var n=t.target.options[t.prepared.name].inertia,r=n.resistance,i=-Math.log(n.endSpeed/e.v0)/r;e.x0=t.prevEvent.pageX,e.y0=t.prevEvent.pageY,e.t0=e.startEvent.timeStamp/1e3,e.sx=e.sy=0,e.modifiedXe=e.xe=(e.vx0-i)/r,e.modifiedYe=e.ye=(e.vy0-i)/r,e.te=i,e.lambda_v0=r/e.v0,e.one_ve_v0=1-n.endSpeed/e.v0}function i(){s(this),p.setCoordDeltas(this.pointerDelta,this.prevCoords,this.curCoords);var t=this.inertiaStatus,e=this.target.options[this.prepared.name].inertia,n=e.resistance,r=(new Date).getTime()/1e3-t.t0;if(r<t.te){var i=1-(Math.exp(-n*r)-t.lambda_v0)/t.one_ve_v0;if(t.modifiedXe===t.xe&&t.modifiedYe===t.ye)t.sx=t.xe*i,t.sy=t.ye*i;else{var o=p.getQuadraticCurvePoint(0,0,t.xe,t.ye,t.modifiedXe,t.modifiedYe,i);t.sx=o.x,t.sy=o.y}this.doMove(),t.i=u.request(this.boundInertiaFrame)}else t.sx=t.modifiedXe,t.sy=t.modifiedYe,this.doMove(),this.end(t.startEvent),t.active=!1,this.simulation=null;p.copyCoords(this.prevCoords,this.curCoords)}function o(){s(this);var t=this.inertiaStatus,e=(new Date).getTime()-t.t0,n=this.target.options[this.prepared.name].inertia.smoothEndDuration;e<n?(t.sx=p.easeOutQuad(e,0,t.xe,n),t.sy=p.easeOutQuad(e,0,t.ye,n),this.pointerMove(t.startEvent,t.startEvent),t.i=u.request(this.boundSmoothEndFrame)):(t.sx=t.xe,t.sy=t.ye,this.pointerMove(t.startEvent,t.startEvent),this.end(t.startEvent),t.smoothEnd=t.active=!1,this.simulation=null)}function s(t){var e=t.inertiaStatus;if(e.active){var n=e.upCoords.page,r=e.upCoords.client;p.setCoords(t.curCoords,[{pageX:n.x+e.sx,pageY:n.y+e.sy,clientX:r.x+e.sx,clientY:r.y+e.sy}])}}var a=t("./InteractEvent"),c=t("./Interaction"),l=t("./modifiers/base"),p=t("./utils"),u=t("./utils/raf");c.signals.on("new",function(t){t.inertiaStatus={active:!1,smoothEnd:!1,allowResume:!1,startEvent:null,upCoords:{},xe:0,ye:0,sx:0,sy:0,t0:0,vx0:0,vys:0,duration:0,lambda_v0:0,one_ve_v0:0,i:null},t.boundInertiaFrame=function(){return i.apply(t)},t.boundSmoothEndFrame=function(){return o.apply(t)}}),c.signals.on("down",function(t){var e=t.interaction,n=t.event,r=t.pointer,i=t.eventTarget,o=e.inertiaStatus;if(o.active)for(var s=i;p.is.element(s);){if(s===e.element){u.cancel(o.i),o.active=!1,e.simulation=null,e.updatePointer(r),p.setCoords(e.curCoords,e.pointers);var d={interaction:e};c.signals.fire("before-action-move",d),c.signals.fire("action-resume",d);var f=new a(e,n,e.prepared.name,"inertiaresume",e.element);e.target.fire(f),e.prevEvent=f,l.resetStatuses(e.modifierStatuses),p.copyCoords(e.prevCoords,e.curCoords);break}s=p.parentNode(s)}}),c.signals.on("up",function(t){var e=t.interaction,n=t.event,i=e.inertiaStatus;if(e.interacting()&&!i.active){var o=e.target,s=o&&o.options,c=s&&e.prepared.name&&s[e.prepared.name].inertia,d=(new Date).getTime(),f={},v=p.extend({},e.curCoords.page),g=e.pointerDelta.client.speed,h=!1,m=void 0,y=c&&c.enabled&&"gesture"!==e.prepared.name&&n!==i.startEvent,x=y&&d-e.curCoords.timeStamp<50&&g>c.minSpeed&&g>c.endSpeed,b={interaction:e,pageCoords:v,statuses:f,preEnd:!0,requireEndOnly:!0};y&&!x&&(l.resetStatuses(f),m=l.setAll(b),m.shouldMove&&m.locked&&(h=!0)),(x||h)&&(p.copyCoords(i.upCoords,e.curCoords),e.pointers[0]=i.startEvent=new a(e,n,e.prepared.name,"inertiastart",e.element),i.t0=d,i.active=!0,i.allowResume=c.allowResume,e.simulation=i,o.fire(i.startEvent),x?(i.vx0=e.pointerDelta.client.vx,i.vy0=e.pointerDelta.client.vy,i.v0=g,r(e,i),p.extend(v,e.curCoords.page),v.x+=i.xe,v.y+=i.ye,l.resetStatuses(f),m=l.setAll(b),i.modifiedXe+=m.dx,i.modifiedYe+=m.dy,i.i=u.request(e.boundInertiaFrame)):(i.smoothEnd=!0,i.xe=m.dx,i.ye=m.dy,i.sx=i.sy=0,i.i=u.request(e.boundSmoothEndFrame)))}}),c.signals.on("stop-active",function(t){var e=t.interaction,n=e.inertiaStatus;n.active&&(u.cancel(n.i),n.active=!1,e.simulation=null)})},{"./InteractEvent":3,"./Interaction":5,"./modifiers/base":23,"./utils":44,"./utils/raf":50}],21:[function(t,e,n){"use strict";function r(t,e){var n=a.interactables.get(t,e);return n||(n=new c(t,e),n.events.global=p),n}var i=t("./utils/browser"),o=t("./utils/events"),s=t("./utils"),a=t("./scope"),c=t("./Interactable"),l=t("./Interaction"),p={};r.isSet=function(t,e){return-1!==a.interactables.indexOfElement(t,e&&e.context)},r.on=function(t,e,n){if(s.is.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),s.is.array(t)){for(var i=0;i<t.length;i++){var l;l=t[i];var u=l;r.on(u,e,n)}return r}if(s.is.object(t)){for(var d in t)r.on(d,t[d],e);return r}return s.contains(c.eventTypes,t)?p[t]?p[t].push(e):p[t]=[e]:o.add(a.document,t,e,{options:n}),r},r.off=function(t,e,n){if(s.is.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),s.is.array(t)){for(var i=0;i<t.length;i++){var l;l=t[i];var u=l;r.off(u,e,n)}return r}if(s.is.object(t)){for(var d in t)r.off(d,t[d],e);return r}if(s.contains(c.eventTypes,t)){var f=void 0;t in p&&-1!==(f=p[t].indexOf(e))&&p[t].splice(f,1)}else o.remove(a.document,t,e,n);return r},r.debug=function(){return a},r.getPointerAverage=s.pointerAverage,r.getTouchBBox=s.touchBBox,r.getTouchDistance=s.touchDistance,r.getTouchAngle=s.touchAngle,r.getElementRect=s.getElementRect,r.getElementClientRect=s.getElementClientRect,r.matchesSelector=s.matchesSelector,r.closest=s.closest,r.supportsTouch=function(){return i.supportsTouch},r.supportsPointerEvent=function(){return i.supportsPointerEvent},r.stop=function(t){for(var e=a.interactions.length-1;e>=0;e--)a.interactions[e].stop(t);return r},r.pointerMoveTolerance=function(t){return s.is.number(t)?(l.pointerMoveTolerance=t,r):l.pointerMoveTolerance},r.addDocument=a.addDocument,r.removeDocument=a.removeDocument,a.interact=r,e.exports=r},{"./Interactable":4,"./Interaction":5,"./scope":33,"./utils":44,"./utils/browser":36,"./utils/events":40}],22:[function(t,e,n){"use strict";function r(t){var e=t.interaction,n=t.event;e.target&&e.target.checkAndPreventDefault(n)}var i=t("./Interactable"),o=t("./Interaction"),s=t("./scope"),a=t("./utils/is"),c=t("./utils/events"),l=t("./utils/browser"),p=t("./utils/domUtils"),u=p.nodeContains,d=p.matchesSelector;i.prototype.preventDefault=function(t){return/^(always|never|auto)$/.test(t)?(this.options.preventDefault=t,this):a.bool(t)?(this.options.preventDefault=t?"always":"never",this):this.options.preventDefault},i.prototype.checkAndPreventDefault=function(t){var e=this.options.preventDefault;if("never"!==e)return"always"===e?void t.preventDefault():void(c.supportsPassive&&/^touch(start|move)$/.test(t.type)&&!l.isIOS||/^(mouse|pointer|touch)*(down|start)/i.test(t.type)||a.element(t.target)&&d(t.target,"input,select,textarea,[contenteditable=true],[contenteditable=true] *")||t.preventDefault())};for(var f=["down","move","up","cancel"],v=0;v<f.length;v++){var g=f[v];o.signals.on(g,r)}o.docEvents.dragstart=function(t){for(var e=0;e<s.interactions.length;e++){var n;n=s.interactions[e];var r=n;if(r.element&&(r.element===t.target||u(r.element,t.target)))return void r.target.checkAndPreventDefault(t)}}},{"./Interactable":4,"./Interaction":5,"./scope":33,"./utils/browser":36,"./utils/domUtils":39,"./utils/events":40,"./utils/is":46}],23:[function(t,e,n){"use strict";function r(t,e,n){return t&&t.enabled&&(e||!t.endOnly)&&(!n||t.endOnly)}var i=t("../InteractEvent"),o=t("../Interaction"),s=t("../utils/extend"),a={names:[],setOffsets:function(t){var e=t.interaction,n=t.pageCoords,r=e.target,i=e.element,o=e.startOffset,s=r.getRect(i);s?(o.left=n.x-s.left,o.top=n.y-s.top,o.right=s.right-n.x,o.bottom=s.bottom-n.y,"width"in s||(s.width=s.right-s.left),"height"in s||(s.height=s.bottom-s.top)):o.left=o.top=o.right=o.bottom=0,t.rect=s,t.interactable=r,t.element=i;for(var c=0;c<a.names.length;c++){var l;l=a.names[c];var p=l;t.options=r.options[e.prepared.name][p],t.options&&(e.modifierOffsets[p]=a[p].setOffset(t))}},setAll:function(t){var e=t.interaction,n=t.statuses,i=t.preEnd,o=t.requireEndOnly,c={dx:0,dy:0,changed:!1,locked:!1,shouldMove:!0};t.modifiedCoords=s({},t.pageCoords);for(var l=0;l<a.names.length;l++){var p;p=a.names[l];var u=p,d=a[u],f=e.target.options[e.prepared.name][u];r(f,i,o)&&(t.status=t.status=n[u],t.options=f,t.offset=t.interaction.modifierOffsets[u],d.set(t),t.status.locked&&(t.modifiedCoords.x+=t.status.dx,t.modifiedCoords.y+=t.status.dy,c.dx+=t.status.dx,c.dy+=t.status.dy,c.locked=!0))}return c.shouldMove=!t.status||!c.locked||t.status.changed,c},resetStatuses:function(t){for(var e=0;e<a.names.length;e++){var n;n=a.names[e];var r=n,i=t[r]||{};i.dx=i.dy=0,i.modifiedX=i.modifiedY=NaN,i.locked=!1,i.changed=!0,t[r]=i}return t},start:function(t,e){var n=t.interaction,r={interaction:n,pageCoords:("action-resume"===e?n.curCoords:n.startCoords).page,startOffset:n.startOffset,statuses:n.modifierStatuses,preEnd:!1,requireEndOnly:!1};a.setOffsets(r),a.resetStatuses(r.statuses),r.pageCoords=s({},n.startCoords.page),n.modifierResult=a.setAll(r)},beforeMove:function(t){var e=t.interaction,n=t.preEnd,r=t.interactingBeforeMove,i=a.setAll({interaction:e,preEnd:n,pageCoords:e.curCoords.page,statuses:e.modifierStatuses,requireEndOnly:!1});!i.shouldMove&&r&&(e._dontFireMove=!0),e.modifierResult=i},end:function(t){for(var e=t.interaction,n=t.event,i=0;i<a.names.length;i++){var o;o=a.names[i];var s=o;if(r(e.target.options[e.prepared.name][s],!0,!0)){e.doMove({event:n,preEnd:!0});break}}},setXY:function(t){for(var e=t.iEvent,n=t.interaction,r=s({},t),i=0;i<a.names.length;i++){var o=a.names[i];if(r.options=n.target.options[n.prepared.name][o],r.options){var c=a[o];r.status=n.modifierStatuses[o],e[o]=c.modifyCoords(r)}}}};o.signals.on("new",function(t){t.startOffset={left:0,right:0,top:0,bottom:0},t.modifierOffsets={},t.modifierStatuses=a.resetStatuses({}),t.modifierResult=null}),o.signals.on("action-start",a.start),o.signals.on("action-resume",a.start),o.signals.on("before-action-move",a.beforeMove),o.signals.on("action-end",a.end),i.signals.on("set-xy",a.setXY),e.exports=a},{"../InteractEvent":3,"../Interaction":5,"../utils/extend":41}],24:[function(t,e,n){"use strict";function r(t,e,n){return o.is.function(t)?o.resolveRectLike(t,e.target,e.element,[n.x,n.y,e]):o.resolveRectLike(t,e.target,e.element)}var i=t("./base"),o=t("../utils"),s=t("../defaultOptions"),a={defaults:{enabled:!1,endOnly:!1,restriction:null,elementRect:null},setOffset:function(t){var e=t.rect,n=t.startOffset,r=t.options,i=r&&r.elementRect,o={};return e&&i?(o.left=n.left-e.width*i.left,o.top=n.top-e.height*i.top,o.right=n.right-e.width*(1-i.right),o.bottom=n.bottom-e.height*(1-i.bottom)):o.left=o.top=o.right=o.bottom=0,o},set:function(t){var e=t.modifiedCoords,n=t.interaction,i=t.status,s=t.options;if(!s)return i;var a=i.useStatusXY?{x:i.x,y:i.y}:o.extend({},e),c=r(s.restriction,n,a);if(!c)return i;i.dx=0,i.dy=0,i.locked=!1;var l=c,p=a.x,u=a.y,d=n.modifierOffsets.restrict;"x"in c&&"y"in c?(p=Math.max(Math.min(l.x+l.width-d.right,a.x),l.x+d.left),u=Math.max(Math.min(l.y+l.height-d.bottom,a.y),l.y+d.top)):(p=Math.max(Math.min(l.right-d.right,a.x),l.left+d.left),u=Math.max(Math.min(l.bottom-d.bottom,a.y),l.top+d.top)),i.dx=p-a.x,i.dy=u-a.y,i.changed=i.modifiedX!==p||i.modifiedY!==u,i.locked=!(!i.dx&&!i.dy),i.modifiedX=p,i.modifiedY=u},modifyCoords:function(t){var e=t.page,n=t.client,r=t.status,i=t.phase,o=t.options,s=o&&o.elementRect;if(o&&o.enabled&&("start"!==i||!s||!r.locked)&&r.locked)return e.x+=r.dx,e.y+=r.dy,n.x+=r.dx,n.y+=r.dy,{dx:r.dx,dy:r.dy}},getRestrictionRect:r};i.restrict=a,i.names.push("restrict"),s.perAction.restrict=a.defaults,e.exports=a},{"../defaultOptions":18,"../utils":44,"./base":23}],25:[function(t,e,n){"use strict";var r=t("./base"),i=t("../utils"),o=t("../utils/rect"),s=t("../defaultOptions"),a=t("../actions/resize"),c=t("./restrict"),l=c.getRestrictionRect,p={top:1/0,left:1/0,bottom:-1/0,right:-1/0},u={top:-1/0,left:-1/0,bottom:1/0,right:1/0},d={defaults:{enabled:!1,endOnly:!1,min:null,max:null,offset:null},setOffset:function(t){var e=t.interaction,n=t.startOffset,r=t.options;if(!r)return i.extend({},n);var o=l(r.offset,e,e.startCoords.page);return o?{top:n.top+o.y,left:n.left+o.x,bottom:n.bottom+o.y,right:n.right+o.x}:n},set:function(t){var e=t.modifiedCoords,n=t.interaction,r=t.status,s=t.offset,a=t.options,c=n.prepared.linkedEdges||n.prepared.edges;if(n.interacting()&&c){var d=r.useStatusXY?{x:r.x,y:r.y}:i.extend({},e),f=o.xywhToTlbr(l(a.inner,n,d))||p,v=o.xywhToTlbr(l(a.outer,n,d))||u,g=d.x,h=d.y;r.dx=0,r.dy=0,r.locked=!1,c.top?h=Math.min(Math.max(v.top+s.top,d.y),f.top+s.top):c.bottom&&(h=Math.max(Math.min(v.bottom-s.bottom,d.y),f.bottom-s.bottom)),c.left?g=Math.min(Math.max(v.left+s.left,d.x),f.left+s.left):c.right&&(g=Math.max(Math.min(v.right-s.right,d.x),f.right-s.right)),r.dx=g-d.x,r.dy=h-d.y,r.changed=r.modifiedX!==g||r.modifiedY!==h,r.locked=!(!r.dx&&!r.dy),r.modifiedX=g,r.modifiedY=h}},modifyCoords:function(t){var e=t.page,n=t.client,r=t.status,i=t.phase,o=t.options;if(o&&o.enabled&&("start"!==i||!r.locked)&&r.locked)return e.x+=r.dx,e.y+=r.dy,n.x+=r.dx,n.y+=r.dy,{dx:r.dx,dy:r.dy}},noInner:p,noOuter:u,getRestrictionRect:l};r.restrictEdges=d,r.names.push("restrictEdges"),s.perAction.restrictEdges=d.defaults,a.defaults.restrictEdges=d.defaults,e.exports=d},{"../actions/resize":10,"../defaultOptions":18,"../utils":44,"../utils/rect":51,"./base":23,"./restrict":24}],26:[function(t,e,n){"use strict";var r=t("./base"),i=t("./restrictEdges"),o=t("../utils"),s=t("../utils/rect"),a=t("../defaultOptions"),c=t("../actions/resize"),l={width:-1/0,height:-1/0},p={width:1/0,height:1/0},u={defaults:{enabled:!1,endOnly:!1,min:null,max:null},setOffset:function(t){return t.interaction.startOffset},set:function(t){var e=t.interaction,n=t.options,r=e.prepared.linkedEdges||e.prepared.edges;if(e.interacting()&&r){var a=s.xywhToTlbr(e.resizeRects.inverted),c=s.tlbrToXywh(i.getRestrictionRect(n.min,e))||l,u=s.tlbrToXywh(i.getRestrictionRect(n.max,e))||p;t.options={enabled:n.enabled,endOnly:n.endOnly,inner:o.extend({},i.noInner),outer:o.extend({},i.noOuter)},r.top?(t.options.inner.top=a.bottom-c.height,t.options.outer.top=a.bottom-u.height):r.bottom&&(t.options.inner.bottom=a.top+c.height,t.options.outer.bottom=a.top+u.height),r.left?(t.options.inner.left=a.right-c.width,t.options.outer.left=a.right-u.width):r.right&&(t.options.inner.right=a.left+c.width,t.options.outer.right=a.left+u.width),i.set(t)}},modifyCoords:i.modifyCoords};r.restrictSize=u,r.names.push("restrictSize"),a.perAction.restrictSize=u.defaults,c.defaults.restrictSize=u.defaults,e.exports=u},{"../actions/resize":10,"../defaultOptions":18,"../utils":44,"../utils/rect":51,"./base":23,"./restrictEdges":25}],27:[function(t,e,n){"use strict";var r=t("./base"),i=t("../interact"),o=t("../utils"),s=t("../defaultOptions"),a={defaults:{enabled:!1,endOnly:!1,range:1/0,targets:null,offsets:null,relativePoints:null},setOffset:function(t){var e=t.interaction,n=t.interactable,r=t.element,i=t.rect,s=t.startOffset,a=t.options,c=[],l=o.rectToXY(o.resolveRectLike(a.origin)),p=l||o.getOriginXY(n,r,e.prepared.name);a=a||n.options[e.prepared.name].snap||{};var u=void 0;if("startCoords"===a.offset)u={x:e.startCoords.page.x-p.x,y:e.startCoords.page.y-p.y};else{var d=o.resolveRectLike(a.offset,n,r,[e]);u=o.rectToXY(d)||{x:0,y:0}}if(i&&a.relativePoints&&a.relativePoints.length)for(var f=0;f<a.relativePoints.length;f++){var v;v=a.relativePoints[f];var g=v,h=g.x,m=g.y;c.push({x:s.left-i.width*h+u.x,y:s.top-i.height*m+u.y})}else c.push(u);return c},set:function(t){var e=t.interaction,n=t.modifiedCoords,r=t.status,i=t.options,s=t.offset,a=[],c=void 0,l=void 0,p=void 0;if(r.useStatusXY)l={x:r.x,y:r.y};else{var u=o.getOriginXY(e.target,e.element,e.prepared.name);l=o.extend({},n),l.x-=u.x,l.y-=u.y}r.realX=l.x,r.realY=l.y;for(var d=i.targets?i.targets.length:0,f=0;f<s.length;f++){var v;v=s[f];for(var g=v,h=g.x,m=g.y,y=l.x-h,x=l.y-m,b=0;b<(i.targets||[]).length;b++){var w;w=(i.targets||[])[b];var E=w;c=o.is.function(E)?E(y,x,e):E,c&&a.push({x:o.is.number(c.x)?c.x+h:y,y:o.is.number(c.y)?c.y+m:x,range:o.is.number(c.range)?c.range:i.range})}}var T={target:null,inRange:!1,distance:0,range:0,dx:0,dy:0};for(p=0,d=a.length;p<d;p++){c=a[p];var S=c.range,C=c.x-l.x,I=c.y-l.y,D=o.hypot(C,I),O=D<=S;S===1/0&&T.inRange&&T.range!==1/0&&(O=!1),T.target&&!(O?T.inRange&&S!==1/0?D/S<T.distance/T.range:S===1/0&&T.range!==1/0||D<T.distance:!T.inRange&&D<T.distance)||(T.target=c,T.distance=D,T.range=S,T.inRange=O,T.dx=C,T.dy=I,r.range=S)}var M=void 0;T.target?(M=r.modifiedX!==T.target.x||r.modifiedY!==T.target.y,r.modifiedX=T.target.x,r.modifiedY=T.target.y):(M=!0,r.modifiedX=NaN,r.modifiedY=NaN),r.dx=T.dx,r.dy=T.dy,r.changed=M||T.inRange&&!r.locked,r.locked=T.inRange},modifyCoords:function(t){var e=t.page,n=t.client,r=t.status,i=t.phase,o=t.options,s=o&&o.relativePoints;if(o&&o.enabled&&("start"!==i||!s||!s.length))return r.locked&&(e.x+=r.dx,e.y+=r.dy,n.x+=r.dx,n.y+=r.dy),{range:r.range,locked:r.locked,x:r.modifiedX,y:r.modifiedY,realX:r.realX,realY:r.realY,dx:r.dx,dy:r.dy}}};i.createSnapGrid=function(t){return function(e,n){var r=t.limits||{left:-1/0,right:1/0,top:-1/0,bottom:1/0},i=0,s=0;o.is.object(t.offset)&&(i=t.offset.x,s=t.offset.y);var a=Math.round((e-i)/t.x),c=Math.round((n-s)/t.y);return{x:Math.max(r.left,Math.min(r.right,a*t.x+i)),y:Math.max(r.top,Math.min(r.bottom,c*t.y+s)),range:t.range}}},r.snap=a,r.names.push("snap"),s.perAction.snap=a.defaults,e.exports=a},{"../defaultOptions":18,"../interact":21,"../utils":44,"./base":23}],28:[function(t,e,n){"use strict";var r=t("./base"),i=t("./snap"),o=t("../defaultOptions"),s=t("../actions/resize"),a=t("../utils/"),c={defaults:{enabled:!1,endOnly:!1,range:1/0,targets:null,offsets:null},setOffset:function(t){var e=t.interaction,n=t.options,r=e.prepared.edges;if(r){t.options={relativePoints:[{x:r.left?0:1,y:r.top?0:1}],origin:{x:0,y:0},offset:"self",range:n.range};var o=i.setOffset(t);return t.options=n,o}},set:function(t){var e=t.interaction,n=t.options,r=t.offset,o=t.modifiedCoords,s=a.extend({},o),c=s.x-r[0].x,l=s.y-r[0].y;t.options=a.extend({},n),t.options.targets=[];for(var p=0;p<(n.targets||[]).length;p++){var u;u=(n.targets||[])[p];var d=u,f=void 0;f=a.is.function(d)?d(c,l,e):d,f&&("width"in f&&"height"in f&&(f.x=f.width,f.y=f.height),t.options.targets.push(f))}i.set(t)},modifyCoords:function(t){var e=t.options;t.options=a.extend({},e),t.options.enabled=e.enabled,t.options.relativePoints=[null],i.modifyCoords(t)}};r.snapSize=c,r.names.push("snapSize"),o.perAction.snapSize=c.defaults,s.defaults.snapSize=c.defaults,e.exports=c},{"../actions/resize":10,"../defaultOptions":18,"../utils/":44,"./base":23,"./snap":27}],29:[function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=t("../utils/pointerUtils");e.exports=function(){function t(e,n,o,s,a){if(r(this,t),i.pointerExtend(this,o),o!==n&&i.pointerExtend(this,n),this.interaction=a,this.timeStamp=(new Date).getTime(),this.originalEvent=o,this.type=e,this.pointerId=i.getPointerId(n),this.pointerType=i.getPointerType(n),this.target=s,this.currentTarget=null,"tap"===e){var c=a.getPointerIndex(n);this.dt=this.timeStamp-a.downTimes[c];var l=this.timeStamp-a.tapTime;this.double=!!(a.prevTap&&"doubletap"!==a.prevTap.type&&a.prevTap.target===this.target&&l<500)}else"doubletap"===e&&(this.dt=n.timeStamp-a.tapTime)}return t.prototype.subtractOrigin=function(t){var e=t.x,n=t.y;return this.pageX-=e,this.pageY-=n,this.clientX-=e,this.clientY-=n,this},t.prototype.addOrigin=function(t){var e=t.x,n=t.y;return this.pageX+=e,this.pageY+=n,this.clientX+=e,this.clientY+=n,this},t.prototype.preventDefault=function(){this.originalEvent.preventDefault()},t.prototype.stopPropagation=function(){this.propagationStopped=!0},t.prototype.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},t}()},{"../utils/pointerUtils":49}],30:[function(t,e,n){"use strict";function r(t){for(var e=t.interaction,n=t.pointer,s=t.event,c=t.eventTarget,p=t.type,u=void 0===p?t.pointerEvent.type:p,d=t.targets,f=void 0===d?i(t):d,v=t.pointerEvent,g=void 0===v?new o(u,n,s,c,e):v,h={interaction:e,pointer:n,event:s,eventTarget:c,targets:f,type:u,pointerEvent:g},m=0;m<f.length;m++){var y=f[m];for(var x in y.props||{})g[x]=y.props[x];var b=a.getOriginXY(y.eventable,y.element);if(g.subtractOrigin(b),g.eventable=y.eventable,g.currentTarget=y.element,y.eventable.fire(g),g.addOrigin(b),g.immediatePropagationStopped||g.propagationStopped&&m+1<f.length&&f[m+1].element!==g.currentTarget)break}if(l.fire("fired",h),"tap"===u){var w=g.double?r({interaction:e,pointer:n,event:s,eventTarget:c,type:"doubletap"}):g;e.prevTap=w,e.tapTime=w.timeStamp}return g}function i(t){var e=t.interaction,n=t.pointer,r=t.event,i=t.eventTarget,o=t.type,s=e.getPointerIndex(n);if("tap"===o&&(e.pointerWasMoved||!e.downTargets[s]||e.downTargets[s]!==i))return[];for(var c=a.getPath(i),p={interaction:e,pointer:n,event:r,eventTarget:i,type:o,path:c,targets:[],element:null},u=0;u<c.length;u++){var d;d=c[u];var f=d;p.element=f,l.fire("collect-targets",p)}return"hold"===o&&(p.targets=p.targets.filter(function(t){return t.eventable.options.holdDuration===e.holdTimers[s].duration})),p.targets}var o=t("./PointerEvent"),s=t("../Interaction"),a=t("../utils"),c=t("../defaultOptions"),l=t("../utils/Signals").new(),p=["down","up","cancel"],u=["down","up","cancel"],d={PointerEvent:o,fire:r,collectEventTargets:i,signals:l,defaults:{holdDuration:600,ignoreFrom:null,allowFrom:null,origin:{x:0,y:0}},types:["down","move","up","cancel","tap","doubletap","hold"]};s.signals.on("update-pointer-down",function(t){var e=t.interaction,n=t.pointerIndex;e.holdTimers[n]={duration:1/0,timeout:null}}),s.signals.on("remove-pointer",function(t){var e=t.interaction,n=t.pointerIndex;e.holdTimers.splice(n,1)}),
s.signals.on("move",function(t){var e=t.interaction,n=t.pointer,i=t.event,o=t.eventTarget,s=t.duplicateMove,a=e.getPointerIndex(n);s||e.pointerIsDown&&!e.pointerWasMoved||(e.pointerIsDown&&clearTimeout(e.holdTimers[a].timeout),r({interaction:e,pointer:n,event:i,eventTarget:o,type:"move"}))}),s.signals.on("down",function(t){for(var e=t.interaction,n=t.pointer,i=t.event,o=t.eventTarget,s=t.pointerIndex,c=e.holdTimers[s],p=a.getPath(o),u={interaction:e,pointer:n,event:i,eventTarget:o,type:"hold",targets:[],path:p,element:null},d=0;d<p.length;d++){var f;f=p[d];var v=f;u.element=v,l.fire("collect-targets",u)}if(u.targets.length){for(var g=1/0,h=0;h<u.targets.length;h++){var m;m=u.targets[h];var y=m,x=y.eventable.options.holdDuration;x<g&&(g=x)}c.duration=g,c.timeout=setTimeout(function(){r({interaction:e,eventTarget:o,pointer:n,event:i,type:"hold"})},g)}}),s.signals.on("up",function(t){var e=t.interaction,n=t.pointer,i=t.event,o=t.eventTarget;e.pointerWasMoved||r({interaction:e,eventTarget:o,pointer:n,event:i,type:"tap"})});for(var f=["up","cancel"],v=0;v<f.length;v++){var g=f[v];s.signals.on(g,function(t){var e=t.interaction,n=t.pointerIndex;e.holdTimers[n]&&clearTimeout(e.holdTimers[n].timeout)})}for(var h=0;h<p.length;h++)s.signals.on(p[h],function(t){return function(e){var n=e.interaction,i=e.pointer,o=e.event;r({interaction:n,eventTarget:e.eventTarget,pointer:i,event:o,type:t})}}(u[h]));s.signals.on("new",function(t){t.prevTap=null,t.tapTime=0,t.holdTimers=[]}),c.pointerEvents=d.defaults,e.exports=d},{"../Interaction":5,"../defaultOptions":18,"../utils":44,"../utils/Signals":34,"./PointerEvent":29}],31:[function(t,e,n){"use strict";function r(t){var e=t.pointerEvent;"hold"===e.type&&(e.count=(e.count||0)+1)}function i(t){var e=t.interaction,n=t.pointerEvent,r=t.eventTarget,i=t.targets;if("hold"===n.type&&i.length){var o=i[0].eventable.options.holdRepeatInterval;o<=0||(e.holdIntervalHandle=setTimeout(function(){s.fire({interaction:e,eventTarget:r,type:"hold",pointer:n,event:n})},o))}}function o(t){var e=t.interaction;e.holdIntervalHandle&&(clearInterval(e.holdIntervalHandle),e.holdIntervalHandle=null)}var s=t("./base"),a=t("../Interaction");s.signals.on("new",r),s.signals.on("fired",i);for(var c=["move","up","cancel","endall"],l=0;l<c.length;l++){var p=c[l];a.signals.on(p,o)}s.defaults.holdRepeatInterval=0,s.types.push("holdrepeat"),e.exports={onNew:r,onFired:i,endHoldRepeat:o}},{"../Interaction":5,"./base":30}],32:[function(t,e,n){"use strict";var r=t("./base"),i=t("../Interactable"),o=t("../utils/is"),s=t("../scope"),a=t("../utils/extend"),c=t("../utils/arr"),l=c.merge;r.signals.on("collect-targets",function(t){var e=t.targets,n=t.element,r=t.type,i=t.eventTarget;s.interactables.forEachMatch(n,function(t){var s=t.events,a=s.options;s[r]&&o.element(n)&&t.testIgnoreAllow(a,n,i)&&e.push({element:n,eventable:s,props:{interactable:t}})})}),i.signals.on("new",function(t){var e=t.interactable;e.events.getRect=function(t){return e.getRect(t)}}),i.signals.on("set",function(t){var e=t.interactable,n=t.options;a(e.events.options,r.defaults),a(e.events.options,n)}),l(i.eventTypes,r.types),i.prototype.pointerEvents=function(t){return a(this.events.options,t),this};var p=i.prototype._backCompatOption;i.prototype._backCompatOption=function(t,e){var n=p.call(this,t,e);return n===this&&(this.events.options[t]=e),n},i.settingsMethods.push("pointerEvents")},{"../Interactable":4,"../scope":33,"../utils/arr":35,"../utils/extend":41,"../utils/is":46,"./base":30}],33:[function(t,e,n){"use strict";var r=t("./utils"),i=t("./utils/events"),o=t("./utils/Signals").new(),s=t("./utils/window"),a=s.getWindow,c={signals:o,events:i,utils:r,document:t("./utils/domObjects").document,documents:[],addDocument:function(t,e){if(r.contains(c.documents,t))return!1;e=e||a(t),c.documents.push(t),i.documents.push(t),t!==c.document&&i.add(e,"unload",c.onWindowUnload),o.fire("add-document",{doc:t,win:e})},removeDocument:function(t,e){var n=c.documents.indexOf(t);e=e||a(t),i.remove(e,"unload",c.onWindowUnload),c.documents.splice(n,1),i.documents.splice(n,1),o.fire("remove-document",{win:e,doc:t})},onWindowUnload:function(){c.removeDocument(this.document,this)}};e.exports=c},{"./utils":44,"./utils/Signals":34,"./utils/domObjects":38,"./utils/events":40,"./utils/window":52}],34:[function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=function(){function t(){r(this,t),this.listeners={}}return t.prototype.on=function(t,e){if(!this.listeners[t])return void(this.listeners[t]=[e]);this.listeners[t].push(e)},t.prototype.off=function(t,e){if(this.listeners[t]){var n=this.listeners[t].indexOf(e);-1!==n&&this.listeners[t].splice(n,1)}},t.prototype.fire=function(t,e){var n=this.listeners[t];if(n)for(var r=0;r<n.length;r++){var i;i=n[r];var o=i;if(!1===o(e,t))return}},t}();i.new=function(){return new i},e.exports=i},{}],35:[function(t,e,n){"use strict";function r(t,e){return-1!==t.indexOf(e)}function i(t,e){for(var n=0;n<e.length;n++){var r;r=e[n];var i=r;t.push(i)}return t}e.exports={contains:r,merge:i}},{}],36:[function(t,e,n){"use strict";var r=t("./window"),i=r.window,o=t("./is"),s=t("./domObjects"),a=s.Element,c=i.navigator,l={supportsTouch:!!("ontouchstart"in i||o.function(i.DocumentTouch)&&s.document instanceof i.DocumentTouch),supportsPointerEvent:!!s.PointerEvent,isIOS:/iP(hone|od|ad)/.test(c.platform),isIOS7:/iP(hone|od|ad)/.test(c.platform)&&/OS 7[^\d]/.test(c.appVersion),isIe9:/MSIE 9/.test(c.userAgent),prefixedMatchesSelector:"matches"in a.prototype?"matches":"webkitMatchesSelector"in a.prototype?"webkitMatchesSelector":"mozMatchesSelector"in a.prototype?"mozMatchesSelector":"oMatchesSelector"in a.prototype?"oMatchesSelector":"msMatchesSelector",pEventTypes:s.PointerEvent?s.PointerEvent===i.MSPointerEvent?{up:"MSPointerUp",down:"MSPointerDown",over:"mouseover",out:"mouseout",move:"MSPointerMove",cancel:"MSPointerCancel"}:{up:"pointerup",down:"pointerdown",over:"pointerover",out:"pointerout",move:"pointermove",cancel:"pointercancel"}:null,wheelEvent:"onmousewheel"in s.document?"mousewheel":"wheel"};l.isOperaMobile="Opera"===c.appName&&l.supportsTouch&&c.userAgent.match("Presto"),e.exports=l},{"./domObjects":38,"./is":46,"./window":52}],37:[function(t,e,n){"use strict";var r=t("./is");e.exports=function t(e){var n={};for(var i in e)r.plainObject(e[i])?n[i]=t(e[i]):n[i]=e[i];return n}},{"./is":46}],38:[function(t,e,n){"use strict";function r(){}var i={},o=t("./window").window;i.document=o.document,i.DocumentFragment=o.DocumentFragment||r,i.SVGElement=o.SVGElement||r,i.SVGSVGElement=o.SVGSVGElement||r,i.SVGElementInstance=o.SVGElementInstance||r,i.Element=o.Element||r,i.HTMLElement=o.HTMLElement||i.Element,i.Event=o.Event,i.Touch=o.Touch||r,i.PointerEvent=o.PointerEvent||o.MSPointerEvent,e.exports=i},{"./window":52}],39:[function(t,e,n){"use strict";var r=t("./window"),i=t("./browser"),o=t("./is"),s=t("./domObjects"),a={nodeContains:function(t,e){for(;e;){if(e===t)return!0;e=e.parentNode}return!1},closest:function(t,e){for(;o.element(t);){if(a.matchesSelector(t,e))return t;t=a.parentNode(t)}return null},parentNode:function(t){var e=t.parentNode;if(o.docFrag(e)){for(;(e=e.host)&&o.docFrag(e););return e}return e},matchesSelector:function(t,e){return r.window!==r.realWindow&&(e=e.replace(/\/deep\//g," ")),t[i.prefixedMatchesSelector](e)},indexOfDeepestElement:function(t){var e=[],n=[],r=void 0,i=t[0],o=i?0:-1,a=void 0,c=void 0,l=void 0,p=void 0;for(l=1;l<t.length;l++)if((r=t[l])&&r!==i)if(i){if(r.parentNode!==r.ownerDocument)if(i.parentNode!==r.ownerDocument){if(!e.length)for(a=i;a.parentNode&&a.parentNode!==a.ownerDocument;)e.unshift(a),a=a.parentNode;if(i instanceof s.HTMLElement&&r instanceof s.SVGElement&&!(r instanceof s.SVGSVGElement)){if(r===i.parentNode)continue;a=r.ownerSVGElement}else a=r;for(n=[];a.parentNode!==a.ownerDocument;)n.unshift(a),a=a.parentNode;for(p=0;n[p]&&n[p]===e[p];)p++;var u=[n[p-1],n[p],e[p]];for(c=u[0].lastChild;c;){if(c===u[1]){i=r,o=l,e=[];break}if(c===u[2])break;c=c.previousSibling}}else i=r,o=l}else i=r,o=l;return o},matchesUpTo:function(t,e,n){for(;o.element(t);){if(a.matchesSelector(t,e))return!0;if((t=a.parentNode(t))===n)return a.matchesSelector(t,e)}return!1},getActualElement:function(t){return t instanceof s.SVGElementInstance?t.correspondingUseElement:t},getScrollXY:function(t){return t=t||r.window,{x:t.scrollX||t.document.documentElement.scrollLeft,y:t.scrollY||t.document.documentElement.scrollTop}},getElementClientRect:function(t){var e=t instanceof s.SVGElement?t.getBoundingClientRect():t.getClientRects()[0];return e&&{left:e.left,right:e.right,top:e.top,bottom:e.bottom,width:e.width||e.right-e.left,height:e.height||e.bottom-e.top}},getElementRect:function(t){var e=a.getElementClientRect(t);if(!i.isIOS7&&e){var n=a.getScrollXY(r.getWindow(t));e.left+=n.x,e.right+=n.x,e.top+=n.y,e.bottom+=n.y}return e},getPath:function(t){for(var e=[];t;)e.push(t),t=a.parentNode(t);return e},trySelector:function(t){return!!o.string(t)&&(s.document.querySelector(t),!0)}};e.exports=a},{"./browser":36,"./domObjects":38,"./is":46,"./window":52}],40:[function(t,e,n){"use strict";function r(t,e,n,r){var i=p(r),o=x.indexOf(t),s=b[o];s||(s={events:{},typeCount:0},o=x.push(t)-1,b.push(s)),s.events[e]||(s.events[e]=[],s.typeCount++),y(s.events[e],n)||(t.addEventListener(e,n,T?i:!!i.capture),s.events[e].push(n))}function i(t,e,n,r){var o=p(r),s=x.indexOf(t),a=b[s];if(a&&a.events)if("all"!==e){if(a.events[e]){var c=a.events[e].length;if("all"===n){for(var l=0;l<c;l++)i(t,e,a.events[e][l],o);return}for(var u=0;u<c;u++)if(a.events[e][u]===n){t.removeEventListener("on"+e,n,T?o:!!o.capture),a.events[e].splice(u,1);break}a.events[e]&&0===a.events[e].length&&(a.events[e]=null,a.typeCount--)}a.typeCount||(b.splice(s,1),x.splice(s,1))}else for(e in a.events)a.events.hasOwnProperty(e)&&i(t,e,"all")}function o(t,e,n,i,o){var s=p(o);if(!w[n]){w[n]={selectors:[],contexts:[],listeners:[]};for(var l=0;l<E.length;l++){var u=E[l];r(u,n,a),r(u,n,c,!0)}}var d=w[n],f=void 0;for(f=d.selectors.length-1;f>=0&&(d.selectors[f]!==t||d.contexts[f]!==e);f--);-1===f&&(f=d.selectors.length,d.selectors.push(t),d.contexts.push(e),d.listeners.push([])),d.listeners[f].push([i,!!s.capture,s.passive])}function s(t,e,n,r,o){var s=p(o),l=w[n],u=!1,d=void 0;if(l)for(d=l.selectors.length-1;d>=0;d--)if(l.selectors[d]===t&&l.contexts[d]===e){for(var f=l.listeners[d],v=f.length-1;v>=0;v--){var g=f[v],h=g[0],m=g[1],y=g[2];if(h===r&&m===!!s.capture&&y===s.passive){f.splice(v,1),f.length||(l.selectors.splice(d,1),l.contexts.splice(d,1),l.listeners.splice(d,1),i(e,n,a),i(e,n,c,!0),l.selectors.length||(w[n]=null)),u=!0;break}}if(u)break}}function a(t,e){var n=p(e),r={},i=w[t.type],o=f.getEventTargets(t),s=o[0],a=s;for(v(r,t),r.originalEvent=t,r.preventDefault=l;u.element(a);){for(var c=0;c<i.selectors.length;c++){var g=i.selectors[c],h=i.contexts[c];if(d.matchesSelector(a,g)&&d.nodeContains(h,s)&&d.nodeContains(h,a)){var m=i.listeners[c];r.currentTarget=a;for(var y=0;y<m.length;y++){var x=m[y],b=x[0],E=x[1],T=x[2];E===!!n.capture&&T===n.passive&&b(r)}}}a=d.parentNode(a)}}function c(t){return a.call(this,t,!0)}function l(){this.originalEvent.preventDefault()}function p(t){return u.object(t)?t:{capture:t}}var u=t("./is"),d=t("./domUtils"),f=t("./pointerUtils"),v=t("./pointerExtend"),g=t("./window"),h=g.window,m=t("./arr"),y=m.contains,x=[],b=[],w={},E=[],T=function(){var t=!1;return h.document.createElement("div").addEventListener("test",null,{get capture(){t=!0}}),t}();e.exports={add:r,remove:i,addDelegate:o,removeDelegate:s,delegateListener:a,delegateUseCapture:c,delegatedEvents:w,documents:E,supportsOptions:T,_elements:x,_targets:b}},{"./arr":35,"./domUtils":39,"./is":46,"./pointerExtend":48,"./pointerUtils":49,"./window":52}],41:[function(t,e,n){"use strict";e.exports=function(t,e){for(var n in e)t[n]=e[n];return t}},{}],42:[function(t,e,n){"use strict";var r=t("./rect"),i=r.resolveRectLike,o=r.rectToXY;e.exports=function(t,e,n){var r=t.options[n],s=r&&r.origin,a=s||t.options.origin,c=i(a,t,e,[t&&e]);return o(c)||{x:0,y:0}}},{"./rect":51}],43:[function(t,e,n){"use strict";e.exports=function(t,e){return Math.sqrt(t*t+e*e)}},{}],44:[function(t,e,n){"use strict";var r=t("./extend"),i=t("./window"),o={warnOnce:function(t,e){var n=!1;return function(){return n||(i.window.console.warn(e),n=!0),t.apply(this,arguments)}},_getQBezierValue:function(t,e,n,r){var i=1-t;return i*i*e+2*i*t*n+t*t*r},getQuadraticCurvePoint:function(t,e,n,r,i,s,a){return{x:o._getQBezierValue(a,t,n,i),y:o._getQBezierValue(a,e,r,s)}},easeOutQuad:function(t,e,n,r){return t/=r,-n*t*(t-2)+e},copyAction:function(t,e){return t.name=e.name,t.axis=e.axis,t.edges=e.edges,t},is:t("./is"),extend:r,hypot:t("./hypot"),getOriginXY:t("./getOriginXY")};r(o,t("./arr")),r(o,t("./domUtils")),r(o,t("./pointerUtils")),r(o,t("./rect")),e.exports=o},{"./arr":35,"./domUtils":39,"./extend":41,"./getOriginXY":42,"./hypot":43,"./is":46,"./pointerUtils":49,"./rect":51,"./window":52}],45:[function(t,e,n){"use strict";var r=t("../scope"),i=t("./index"),o={methodOrder:["simulationResume","mouseOrPen","hasPointer","idle"],search:function(t,e,n){for(var r=i.getPointerType(t),s=i.getPointerId(t),a={pointer:t,pointerId:s,pointerType:r,eventType:e,eventTarget:n},c=0;c<o.methodOrder.length;c++){var l;l=o.methodOrder[c];var p=l,u=o[p](a);if(u)return u}},simulationResume:function(t){var e=t.pointerType,n=t.eventType,o=t.eventTarget;if(!/down|start/i.test(n))return null;for(var s=0;s<r.interactions.length;s++){var a;a=r.interactions[s];var c=a,l=o;if(c.simulation&&c.simulation.allowResume&&c.pointerType===e)for(;l;){if(l===c.element)return c;l=i.parentNode(l)}}return null},mouseOrPen:function(t){var e=t.pointerId,n=t.pointerType,o=t.eventType;if("mouse"!==n&&"pen"!==n)return null;for(var s=void 0,a=0;a<r.interactions.length;a++){var c;c=r.interactions[a];var l=c;if(l.pointerType===n){if(l.simulation&&!i.contains(l.pointerIds,e))continue;if(l.interacting())return l;s||(s=l)}}if(s)return s;for(var p=0;p<r.interactions.length;p++){var u;u=r.interactions[p];var d=u;if(!(d.pointerType!==n||/down/i.test(o)&&d.simulation))return d}return null},hasPointer:function(t){for(var e=t.pointerId,n=0;n<r.interactions.length;n++){var o;o=r.interactions[n];var s=o;if(i.contains(s.pointerIds,e))return s}},idle:function(t){for(var e=t.pointerType,n=0;n<r.interactions.length;n++){var i;i=r.interactions[n];var o=i;if(1===o.pointerIds.length){var s=o.target;if(s&&!s.options.gesture.enabled)continue}else if(o.pointerIds.length>=2)continue;if(!o.interacting()&&e===o.pointerType)return o}return null}};e.exports=o},{"../scope":33,"./index":44}],46:[function(t,e,n){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=t("./window"),o=t("./isWindow"),s={array:function(){},window:function(t){return t===i.window||o(t)},docFrag:function(t){return s.object(t)&&11===t.nodeType},object:function(t){return!!t&&"object"===(void 0===t?"undefined":r(t))},function:function(t){return"function"==typeof t},number:function(t){return"number"==typeof t},bool:function(t){return"boolean"==typeof t},string:function(t){return"string"==typeof t},element:function(t){if(!t||"object"!==(void 0===t?"undefined":r(t)))return!1;var e=i.getWindow(t)||i.window;return/object|function/.test(r(e.Element))?t instanceof e.Element:1===t.nodeType&&"string"==typeof t.nodeName},plainObject:function(t){return s.object(t)&&"Object"===t.constructor.name}};s.array=function(t){return s.object(t)&&void 0!==t.length&&s.function(t.splice)},e.exports=s},{"./isWindow":47,"./window":52}],47:[function(t,e,n){"use strict";e.exports=function(t){return!(!t||!t.Window)&&t instanceof t.Window}},{}],48:[function(t,e,n){"use strict";function r(t,n){for(var r in n){var i=e.exports.prefixedPropREs,o=!1;for(var s in i)if(0===r.indexOf(s)&&i[s].test(r)){o=!0;break}o||"function"==typeof n[r]||(t[r]=n[r])}return t}r.prefixedPropREs={webkit:/(Movement[XY]|Radius[XY]|RotationAngle|Force)$/},e.exports=r},{}],49:[function(t,e,n){"use strict";var r=t("./hypot"),i=t("./browser"),o=t("./domObjects"),s=t("./domUtils"),a=t("./domObjects"),c=t("./is"),l=t("./pointerExtend"),p={copyCoords:function(t,e){t.page=t.page||{},t.page.x=e.page.x,t.page.y=e.page.y,t.client=t.client||{},t.client.x=e.client.x,t.client.y=e.client.y,t.timeStamp=e.timeStamp},setCoordDeltas:function(t,e,n){t.page.x=n.page.x-e.page.x,t.page.y=n.page.y-e.page.y,t.client.x=n.client.x-e.client.x,t.client.y=n.client.y-e.client.y,t.timeStamp=n.timeStamp-e.timeStamp;var i=Math.max(t.timeStamp/1e3,.001);t.page.speed=r(t.page.x,t.page.y)/i,t.page.vx=t.page.x/i,t.page.vy=t.page.y/i,t.client.speed=r(t.client.x,t.page.y)/i,t.client.vx=t.client.x/i,t.client.vy=t.client.y/i},isNativePointer:function(t){return t instanceof o.Event||t instanceof o.Touch},getXY:function(t,e,n){return n=n||{},t=t||"page",n.x=e[t+"X"],n.y=e[t+"Y"],n},getPageXY:function(t,e){return e=e||{},i.isOperaMobile&&p.isNativePointer(t)?(p.getXY("screen",t,e),e.x+=window.scrollX,e.y+=window.scrollY):p.getXY("page",t,e),e},getClientXY:function(t,e){return e=e||{},i.isOperaMobile&&p.isNativePointer(t)?p.getXY("screen",t,e):p.getXY("client",t,e),e},getPointerId:function(t){return c.number(t.pointerId)?t.pointerId:t.identifier},setCoords:function(t,e,n){var r=e.length>1?p.pointerAverage(e):e[0],i={};p.getPageXY(r,i),t.page.x=i.x,t.page.y=i.y,p.getClientXY(r,i),t.client.x=i.x,t.client.y=i.y,t.timeStamp=c.number(n)?n:(new Date).getTime()},pointerExtend:l,getTouchPair:function(t){var e=[];return c.array(t)?(e[0]=t[0],e[1]=t[1]):"touchend"===t.type?1===t.touches.length?(e[0]=t.touches[0],e[1]=t.changedTouches[0]):0===t.touches.length&&(e[0]=t.changedTouches[0],e[1]=t.changedTouches[1]):(e[0]=t.touches[0],e[1]=t.touches[1]),e},pointerAverage:function(t){for(var e={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0},n=0;n<t.length;n++){var r;r=t[n];var i=r;for(var o in e)e[o]+=i[o]}for(var s in e)e[s]/=t.length;return e},touchBBox:function(t){if(t.length||t.touches&&t.touches.length>1){var e=p.getTouchPair(t),n=Math.min(e[0].pageX,e[1].pageX),r=Math.min(e[0].pageY,e[1].pageY);return{x:n,y:r,left:n,top:r,width:Math.max(e[0].pageX,e[1].pageX)-n,height:Math.max(e[0].pageY,e[1].pageY)-r}}},touchDistance:function(t,e){var n=e+"X",i=e+"Y",o=p.getTouchPair(t),s=o[0][n]-o[1][n],a=o[0][i]-o[1][i];return r(s,a)},touchAngle:function(t,e,n){var r=n+"X",i=n+"Y",o=p.getTouchPair(t),s=o[1][r]-o[0][r],a=o[1][i]-o[0][i];return 180*Math.atan2(a,s)/Math.PI},getPointerType:function(t){return c.string(t.pointerType)?t.pointerType:c.number(t.pointerType)?[void 0,void 0,"touch","pen","mouse"][t.pointerType]:/touch/.test(t.type)||t instanceof a.Touch?"touch":"mouse"},getEventTargets:function(t){var e=c.function(t.composedPath)?t.composedPath():t.path;return[s.getActualElement(e?e[0]:t.target),s.getActualElement(t.currentTarget)]}};e.exports=p},{"./browser":36,"./domObjects":38,"./domUtils":39,"./hypot":43,"./is":46,"./pointerExtend":48}],50:[function(t,e,n){"use strict";for(var r=t("./window"),i=r.window,o=["ms","moz","webkit","o"],s=0,a=void 0,c=void 0,l=0;l<o.length&&!i.requestAnimationFrame;l++)a=i[o[l]+"RequestAnimationFrame"],c=i[o[l]+"CancelAnimationFrame"]||i[o[l]+"CancelRequestAnimationFrame"];a||(a=function(t){var e=(new Date).getTime(),n=Math.max(0,16-(e-s)),r=setTimeout(function(){t(e+n)},n);return s=e+n,r}),c||(c=function(t){clearTimeout(t)}),e.exports={request:a,cancel:c}},{"./window":52}],51:[function(t,e,n){"use strict";var r=t("./extend"),i=t("./is"),o=t("./domUtils"),s=o.closest,a=o.parentNode,c=o.getElementRect,l={getStringOptionResult:function(t,e,n){return i.string(t)?t="parent"===t?a(n):"self"===t?e.getRect(n):s(n,t):null},resolveRectLike:function(t,e,n,r){return t=l.getStringOptionResult(t,e,n)||t,i.function(t)&&(t=t.apply(null,r)),i.element(t)&&(t=c(t)),t},rectToXY:function(t){return t&&{x:"x"in t?t.x:t.left,y:"y"in t?t.y:t.top}},xywhToTlbr:function(t){return!t||"left"in t&&"top"in t||(t=r({},t),t.left=t.x||0,t.top=t.y||0,t.right=t.right||t.left+t.width,t.bottom=t.bottom||t.top+t.height),t},tlbrToXywh:function(t){return!t||"x"in t&&"y"in t||(t=r({},t),t.x=t.left||0,t.top=t.top||0,t.width=t.width||t.right-t.x,t.height=t.height||t.bottom-t.y),t}};e.exports=l},{"./domUtils":39,"./extend":41,"./is":46}],52:[function(t,e,n){"use strict";function r(t){i.realWindow=t;var e=t.document.createTextNode("");e.ownerDocument!==t.document&&"function"==typeof t.wrap&&t.wrap(e)===e&&(t=t.wrap(t)),i.window=t}var i=e.exports,o=t("./isWindow");"undefined"==typeof window?(i.window=void 0,i.realWindow=void 0):r(window),i.getWindow=function(t){if(o(t))return t;var e=t.ownerDocument||t;return e.defaultView||e.parentWindow||i.window},i.init=r},{"./isWindow":47}]},{},[1])(1)});

//# sourceMappingURL=interact.min.js.map


/*!
 * jQuery.extendext 0.1.2
 *
 * Copyright 2014-2016 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 * 
 * Based on jQuery.extend by jQuery Foundation, Inc. and other contributors
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jQuery.extendext', ['jquery'], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(root.jQuery);
    }
}(this, function ($) {
    "use strict";

    $.extendext = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            arrayMode = 'default';

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // Skip the boolean and the target
            target = arguments[i++] || {};
        }

        // Handle array mode parameter
        if (typeof target === "string") {
            arrayMode = target.toLowerCase();
            if (arrayMode !== 'concat' && arrayMode !== 'replace' && arrayMode !== 'extend') {
                arrayMode = 'default';
            }

            // Skip the string param
            target = arguments[i++] || {};
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !$.isFunction(target)) {
            target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) !== null) {
                // Special operations for arrays
                if ($.isArray(options) && arrayMode !== 'default') {
                    clone = target && $.isArray(target) ? target : [];

                    switch (arrayMode) {
                    case 'concat':
                        target = clone.concat($.extend(deep, [], options));
                        break;

                    case 'replace':
                        target = $.extend(deep, [], options);
                        break;

                    case 'extend':
                        options.forEach(function (e, i) {
                            if (typeof e === 'object') {
                                var type = $.isArray(e) ? [] : {};
                                clone[i] = $.extendext(deep, arrayMode, clone[i] || type, e);

                            } else if (clone.indexOf(e) === -1) {
                                clone.push(e);
                            }
                        });

                        target = clone;
                        break;
                    }

                } else {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && ( $.isPlainObject(copy) ||
                            (copyIsArray = $.isArray(copy)) )) {

                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && $.isArray(src) ? src : [];

                            } else {
                                clone = src && $.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = $.extendext(deep, arrayMode, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };
}));

// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function () {
	"use strict";

	var doT = {
		name: "doT",
		version: "1.1.1",
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g,
			encode:      /\{\{!([\s\S]+?)\}\}/g,
			use:         /\{\{#([\s\S]+?)\}\}/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
			iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
			varname:	"it",
			strip:		true,
			append:		true,
			selfcontained: false,
			doNotSkipEncoded: false
		},
		template: undefined, //fn, compile template
		compile:  undefined, //fn, for express
		log: true
	}, _globals;

	doT.encodeHTMLSource = function(doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	};

	_globals = (function(){ return this || (0,eval)("this"); }());

	/* istanbul ignore else */
	if (typeof module !== "undefined" && module.exports) {
		module.exports = doT;
	} else if (typeof define === "function" && define.amd) {
		define('doT', function(){return doT;});
	} else {
		_globals.doT = doT;
	}

	var startend = {
		append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
		split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
	}, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === "string") ? block : block.toString())
		.replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf("def.") === 0) {
				code = code.substring(4);
			}
			if (!(code in def)) {
				if (assign === ":") {
					if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v};
					});
					if (!(code in def)) def[code]= value;
				} else {
					new Function("def", "def['"+code+"']=" + value)(def);
				}
			}
			return "";
		})
		.replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param).replace(/'|\\/g, "_");
					def.__exp = def.__exp || {};
					def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				}
			});
			var v = new Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		});
	}

	function unescape(code) {
		return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
	}

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

		str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ")
					.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""): str)
			.replace(/'|\\/g, "\\$&")
			.replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			})
			.replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.startencode + unescape(code) + cse.end;
			})
			.replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
			})
			.replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			})
			.replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			})
			+ "';return out;")
			.replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
			.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
			//.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode) {
			if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
			str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
				+ doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
				+ str;
		}
		try {
			return new Function(c.varname, str);
		} catch (e) {
			/* istanbul ignore else */
			if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
			throw e;
		}
	};

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	};
}());


/*!
 * jQuery QueryBuilder 2.5.2
 * Copyright 2014-2018 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 */
(function(root, factory) {
    if (typeof define == 'function' && define.amd) {
        define('query-builder', ['jquery', 'dot/doT', 'jquery-extendext'], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'), require('dot/doT'), require('jquery-extendext'));
    }
    else {
        factory(root.jQuery, root.doT);
    }
}(this, function($, doT) {
"use strict";

/**
 * @typedef {object} Filter
 * @memberof QueryBuilder
 * @description See {@link http://querybuilder.js.org/index.html#filters}
 */

/**
 * @typedef {object} Operator
 * @memberof QueryBuilder
 * @description See {@link http://querybuilder.js.org/index.html#operators}
 */

/**
 * @param {jQuery} $el
 * @param {object} options - see {@link http://querybuilder.js.org/#options}
 * @constructor
 */
var QueryBuilder = function($el, options) {
    $el[0].queryBuilder = this;

    /**
     * Element container
     * @member {jQuery}
     * @readonly
     */
    this.$el = $el;

    /**
     * Configuration object
     * @member {object}
     * @readonly
     */
    this.settings = $.extendext(true, 'replace', {}, QueryBuilder.DEFAULTS, options);

    /**
     * Internal model
     * @member {Model}
     * @readonly
     */
    this.model = new Model();

    /**
     * Internal status
     * @member {object}
     * @property {string} id - id of the container
     * @property {boolean} generated_id - if the container id has been generated
     * @property {int} group_id - current group id
     * @property {int} rule_id - current rule id
     * @property {boolean} has_optgroup - if filters have optgroups
     * @property {boolean} has_operator_optgroup - if operators have optgroups
     * @readonly
     * @private
     */
    this.status = {
        id: null,
        generated_id: false,
        group_id: 0,
        rule_id: 0,
        has_optgroup: false,
        has_operator_optgroup: false
    };

    /**
     * List of filters
     * @member {QueryBuilder.Filter[]}
     * @readonly
     */
    this.filters = this.settings.filters;

    /**
     * List of icons
     * @member {object.<string, string>}
     * @readonly
     */
    this.icons = this.settings.icons;

    /**
     * List of operators
     * @member {QueryBuilder.Operator[]}
     * @readonly
     */
    this.operators = this.settings.operators;

    /**
     * List of templates
     * @member {object.<string, function>}
     * @readonly
     */
    this.templates = this.settings.templates;

    /**
     * Plugins configuration
     * @member {object.<string, object>}
     * @readonly
     */
    this.plugins = this.settings.plugins;

    /**
     * Translations object
     * @member {object}
     * @readonly
     */
    this.lang = null;

    // translations : english << 'lang_code' << custom
    if (QueryBuilder.regional['en'] === undefined) {
        Utils.error('Config', '"i18n/en.js" not loaded.');
    }
    this.lang = $.extendext(true, 'replace', {}, QueryBuilder.regional['en'], QueryBuilder.regional[this.settings.lang_code], this.settings.lang);

    // "allow_groups" can be boolean or int
    if (this.settings.allow_groups === false) {
        this.settings.allow_groups = 0;
    }
    else if (this.settings.allow_groups === true) {
        this.settings.allow_groups = -1;
    }

    // init templates
    Object.keys(this.templates).forEach(function(tpl) {
        if (!this.templates[tpl]) {
            this.templates[tpl] = QueryBuilder.templates[tpl];
        }
        if (typeof this.templates[tpl] == 'string') {
            this.templates[tpl] = doT.template(this.templates[tpl]);
        }
    }, this);

    // ensure we have a container id
    if (!this.$el.attr('id')) {
        this.$el.attr('id', 'qb_' + Math.floor(Math.random() * 99999));
        this.status.generated_id = true;
    }
    this.status.id = this.$el.attr('id');

    // INIT
    this.$el.addClass('query-builder form-inline');

    this.filters = this.checkFilters(this.filters);
    this.operators = this.checkOperators(this.operators);
    this.bindEvents();
    this.initPlugins();
};

$.extend(QueryBuilder.prototype, /** @lends QueryBuilder.prototype */ {
    /**
     * Triggers an event on the builder container
     * @param {string} type
     * @returns {$.Event}
     */
    trigger: function(type) {
  
        var event = new $.Event(this._tojQueryEvent(type), {
            builder: this
        });

        this.$el.triggerHandler(event, Array.prototype.slice.call(arguments, 1));

        return event;
    },

    /**
     * Triggers an event on the builder container and returns the modified value
     * @param {string} type
     * @param {*} value
     * @returns {*}
     */
    change: function(type, value) {
    
        var event = new $.Event(this._tojQueryEvent(type, true), {
            builder: this,
            value: value
        });

        this.$el.triggerHandler(event, Array.prototype.slice.call(arguments, 2));

        return event.value;
    },

    /**
     * Attaches an event listener on the builder container
     * @param {string} type
     * @param {function} cb
     * @returns {QueryBuilder}
     */
    on: function(type, cb) {
   
        this.$el.on(this._tojQueryEvent(type), cb);
        return this;
    },

    /**
     * Removes an event listener from the builder container
     * @param {string} type
     * @param {function} [cb]
     * @returns {QueryBuilder}
     */
    off: function(type, cb) {
        this.$el.off(this._tojQueryEvent(type), cb);
        return this;
    },

    /**
     * Attaches an event listener called once on the builder container
     * @param {string} type
     * @param {function} cb
     * @returns {QueryBuilder}
     */
    once: function(type, cb) {
        this.$el.one(this._tojQueryEvent(type), cb);
        return this;
    },

    /**
     * Appends `.queryBuilder` and optionally `.filter` to the events names
     * @param {string} name
     * @param {boolean} [filter=false]
     * @returns {string}
     * @private
     */
    _tojQueryEvent: function(name, filter) {
        return name.split(' ').map(function(type) {
            return type + '.queryBuilder' + (filter ? '.filter' : '');
        }).join(' ');
    }
});


/**
 * Allowed types and their internal representation
 * @type {object.<string, string>}
 * @readonly
 * @private
 */
QueryBuilder.types = {
    'string':   'string',
    'integer':  'number',
    'double':   'number',
    'date':     'datetime',
    'time':     'datetime',
    'datetime': 'datetime',
    'boolean':  'boolean'
};

/**
 * Allowed inputs
 * @type {string[]}
 * @readonly
 * @private
 */
QueryBuilder.inputs = [
    'text',
    'number',
    'textarea',
    'radio',
    'checkbox',
    'select'
];

/**
 * Runtime modifiable options with `setOptions` method
 * @type {string[]}
 * @readonly
 * @private
 */
QueryBuilder.modifiable_options = [
    'display_errors',
    'allow_groups',
    'allow_empty',
    'default_condition',
    'default_filter'
];

/**
 * CSS selectors for common components
 * @type {object.<string, string>}
 * @readonly
 */
QueryBuilder.selectors = {
    group_container:      '.rules-group-container',
    rule_container:       '.rule-container',
    filter_container:     '.rule-filter-container',
    operator_container:   '.rule-operator-container',
    value_container:      '.rule-value-container',
    error_container:      '.error-container',
    condition_container:  '.rules-group-header .group-conditions',

    rule_header:          '.rule-header',
    group_header:         '.rules-group-header',
    group_actions:        '.group-actions',
    rule_actions:         '.rule-actions',

    rules_list:           '.rules-group-body>.rules-list',

    group_condition:      '.rules-group-header [name$=_cond]',
    rule_filter:          '.rule-filter-container [name$=_filter]',
    rule_operator:        '.rule-operator-container [name$=_operator]',
    rule_value:           '.rule-value-container [name*=_value_]',

    add_rule:             '[data-add=rule]',
    delete_rule:          '[data-delete=rule]',
    add_group:            '[data-add=group]',
    delete_group:         '[data-delete=group]'
};

/**
 * Template strings (see template.js)
 * @type {object.<string, string>}
 * @readonly
 */
QueryBuilder.templates = {};

/**
 * Localized strings (see i18n/)
 * @type {object.<string, object>}
 * @readonly
 */
QueryBuilder.regional = {};

/**
 * Default operators
 * @type {object.<string, object>}
 * @readonly
 */
QueryBuilder.OPERATORS = {
    equal:            { type: 'equal',            nb_inputs: 1, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'] },
    not_equal:        { type: 'not_equal',        nb_inputs: 1, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'] },
    in:               { type: 'in',               nb_inputs: 1, multiple: true,  apply_to: ['string', 'number', 'datetime'] },
    not_in:           { type: 'not_in',           nb_inputs: 1, multiple: true,  apply_to: ['string', 'number', 'datetime'] },
    less:             { type: 'less',             nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'] },
    less_or_equal:    { type: 'less_or_equal',    nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'] },
    greater:          { type: 'greater',          nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'] },
    greater_or_equal: { type: 'greater_or_equal', nb_inputs: 1, multiple: false, apply_to: ['number', 'datetime'] },
    between:          { type: 'between',          nb_inputs: 2, multiple: false, apply_to: ['number', 'datetime'] },
    not_between:      { type: 'not_between',      nb_inputs: 2, multiple: false, apply_to: ['number', 'datetime'] },
    begins_with:      { type: 'begins_with',      nb_inputs: 1, multiple: false, apply_to: ['string'] },
    not_begins_with:  { type: 'not_begins_with',  nb_inputs: 1, multiple: false, apply_to: ['string'] },
    contains:         { type: 'contains',         nb_inputs: 1, multiple: false, apply_to: ['string'] },
    not_contains:     { type: 'not_contains',     nb_inputs: 1, multiple: false, apply_to: ['string'] },
    ends_with:        { type: 'ends_with',        nb_inputs: 1, multiple: false, apply_to: ['string'] },
    not_ends_with:    { type: 'not_ends_with',    nb_inputs: 1, multiple: false, apply_to: ['string'] },
    is_empty:         { type: 'is_empty',         nb_inputs: 0, multiple: false, apply_to: ['string'] },
    is_not_empty:     { type: 'is_not_empty',     nb_inputs: 0, multiple: false, apply_to: ['string'] },
    is_null:          { type: 'is_null',          nb_inputs: 0, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'] },
    is_not_null:      { type: 'is_not_null',      nb_inputs: 0, multiple: false, apply_to: ['string', 'number', 'datetime', 'boolean'] }
};

/**
 * Default configuration
 * @type {object}
 * @readonly
 */
QueryBuilder.DEFAULTS = {
    filters: [],
    plugins: [],

    sort_filters: false,
    display_errors: true,
    allow_groups: -1,
    allow_empty: false,
    conditions: ['AND', 'OR'],
    default_condition: 'AND',
    inputs_separator: ' , ',
    select_placeholder: '------',
    display_empty_filter: true,
    default_filter: null,
    optgroups: {},

    default_rule_flags: {
        filter_readonly: false,
        operator_readonly: false,
        value_readonly: false,
        no_delete: false
    },

    default_group_flags: {
        condition_readonly: false,
        no_add_rule: false,
        no_add_group: false,
        no_delete: false
    },

    templates: {
        group: null,
        rule: null,
        filterSelect: null,
        operatorSelect: null,
        ruleValueSelect: null
    },

    lang_code: 'en',
    lang: {},

    operators: [
        'equal',
        'not_equal',
        'in',
        'not_in',
        'less',
        'less_or_equal',
        'greater',
        'greater_or_equal',
        'between',
        'not_between',
        'begins_with',
        'not_begins_with',
        'contains',
        'not_contains',
        'ends_with',
        'not_ends_with',
        'is_empty',
        'is_not_empty',
        'is_null',
        'is_not_null'
    ],

    icons: {
        add_group:    'icon-plus',
        add_rule:     'icon-plus',
        remove_group: 'icon-remove',
        remove_rule:  'icon-remove append_here',
        error:        'glyphicon glyphicon-warning-sign'
    }
};


/**
 * @module plugins
 */

/**
 * Definition of available plugins
 * @type {object.<String, object>}
 */
QueryBuilder.plugins = {};

/**
 * Gets or extends the default configuration
 * @param {object} [options] - new configuration
 * @returns {undefined|object} nothing or configuration object (copy)
 */
QueryBuilder.defaults = function(options) {
    if (typeof options == 'object') {
        $.extendext(true, 'replace', QueryBuilder.DEFAULTS, options);
    }
    else if (typeof options == 'string') {
        if (typeof QueryBuilder.DEFAULTS[options] == 'object') {
            return $.extend(true, {}, QueryBuilder.DEFAULTS[options]);
        }
        else {
            return QueryBuilder.DEFAULTS[options];
        }
    }
    else {
        return $.extend(true, {}, QueryBuilder.DEFAULTS);
    }
};

/**
 * Registers a new plugin
 * @param {string} name
 * @param {function} fct - init function
 * @param {object} [def] - default options
 */
QueryBuilder.define = function(name, fct, def) {
    QueryBuilder.plugins[name] = {
        fct: fct,
        def: def || {}
    };
};

/**
 * Adds new methods to QueryBuilder prototype
 * @param {object.<string, function>} methods
 */
QueryBuilder.extend = function(methods) {
    $.extend(QueryBuilder.prototype, methods);
};

/**
 * Initializes plugins for an instance
 * @throws ConfigError
 * @private
 */
QueryBuilder.prototype.initPlugins = function() {
    if (!this.plugins) {
        return;
    }

    if ($.isArray(this.plugins)) {
        var tmp = {};
        this.plugins.forEach(function(plugin) {
            tmp[plugin] = null;
        });
        this.plugins = tmp;
    }

    Object.keys(this.plugins).forEach(function(plugin) {
        if (plugin in QueryBuilder.plugins) {
            this.plugins[plugin] = $.extend(true, {},
                QueryBuilder.plugins[plugin].def,
                this.plugins[plugin] || {}
            );

            QueryBuilder.plugins[plugin].fct.call(this, this.plugins[plugin]);
        }
        else {
            Utils.error('Config', 'Unable to find plugin "{0}"', plugin);
        }
    }, this);
};

/**
 * Returns the config of a plugin, if the plugin is not loaded, returns the default config.
 * @param {string} name
 * @param {string} [property]
 * @throws ConfigError
 * @returns {*}
 */
QueryBuilder.prototype.getPluginOptions = function(name, property) {
    var plugin;
    if (this.plugins && this.plugins[name]) {
        plugin = this.plugins[name];
    }
    else if (QueryBuilder.plugins[name]) {
        plugin = QueryBuilder.plugins[name].def;
    }

    if (plugin) {
        if (property) {
            return plugin[property];
        }
        else {
            return plugin;
        }
    }
    else {
        Utils.error('Config', 'Unable to find plugin "{0}"', name);
    }
};


/**
 * Final initialisation of the builder
 * @param {object} [rules]
 * @fires QueryBuilder.afterInit
 * @private
 */
QueryBuilder.prototype.init = function(rules) {
    /**
     * When the initilization is done, just before creating the root group
     * @event afterInit
     * @memberof QueryBuilder
     */
    this.trigger('afterInit');

    if (rules) {
        this.setRules(rules);
        delete this.settings.rules;
    }
    else {
        this.setRoot(true);
    }
};

/**
 * Checks the configuration of each filter
 * @param {QueryBuilder.Filter[]} filters
 * @returns {QueryBuilder.Filter[]}
 * @throws ConfigError
 */
QueryBuilder.prototype.checkFilters = function(filters) {
    var definedFilters = [];

    if (!filters || filters.length === 0) {
        Utils.error('Config', 'Missing filters list');
    }

    filters.forEach(function(filter, i) {
        if (!filter.id) {
            Utils.error('Config', 'Missing filter {0} id', i);
        }
        if (definedFilters.indexOf(filter.id) != -1) {
            Utils.error('Config', 'Filter "{0}" already defined', filter.id);
        }
        definedFilters.push(filter.id);

        if (!filter.type) {
            filter.type = 'string';
        }
        else if (!QueryBuilder.types[filter.type]) {
            Utils.error('Config', 'Invalid type "{0}"', filter.type);
        }

        if (!filter.input) {
            filter.input = QueryBuilder.types[filter.type] === 'number' ? 'number' : 'text';
        }
        else if (typeof filter.input != 'function' && QueryBuilder.inputs.indexOf(filter.input) == -1) {
            Utils.error('Config', 'Invalid input "{0}"', filter.input);
        }

        if (filter.operators) {
            filter.operators.forEach(function(operator) {
                if (typeof operator != 'string') {
                    Utils.error('Config', 'Filter operators must be global operators types (string)');
                }
            });
        }

        if (!filter.field) {
            filter.field = filter.id;
        }
        if (!filter.label) {
            filter.label = filter.field;
        }

        if (!filter.optgroup) {
            filter.optgroup = null;
        }
        else {
            this.status.has_optgroup = true;

            // register optgroup if needed
            if (!this.settings.optgroups[filter.optgroup]) {
                this.settings.optgroups[filter.optgroup] = filter.optgroup;
            }
        }

        switch (filter.input) {
            case 'radio':
            case 'checkbox':
                if (!filter.values || filter.values.length < 1) {
                    Utils.error('Config', 'Missing filter "{0}" values', filter.id);
                }
                break;

            case 'select':
                var cleanValues = [];
                filter.has_optgroup = false;

                Utils.iterateOptions(filter.values, function(value, label, optgroup) {
                    cleanValues.push({
                        value: value,
                        label: label,
                        optgroup: optgroup || null
                    });

                    if (optgroup) {
                        filter.has_optgroup = true;

                        // register optgroup if needed
                        if (!this.settings.optgroups[optgroup]) {
                            this.settings.optgroups[optgroup] = optgroup;
                        }
                    }
                }.bind(this));

                if (filter.has_optgroup) {
                    filter.values = Utils.groupSort(cleanValues, 'optgroup');
                }
                else {
                    filter.values = cleanValues;
                }

                if (filter.placeholder) {
                    if (filter.placeholder_value === undefined) {
                        filter.placeholder_value = -1;
                    }

                    filter.values.forEach(function(entry) {
                        if (entry.value == filter.placeholder_value) {
                            Utils.error('Config', 'Placeholder of filter "{0}" overlaps with one of its values', filter.id);
                        }
                    });
                }
                break;
        }
    }, this);

    if (this.settings.sort_filters) {
        if (typeof this.settings.sort_filters == 'function') {
            filters.sort(this.settings.sort_filters);
        }
        else {
            var self = this;
            filters.sort(function(a, b) {
                return self.translate(a.label).localeCompare(self.translate(b.label));
            });
        }
    }

    if (this.status.has_optgroup) {
        filters = Utils.groupSort(filters, 'optgroup');
    }

    return filters;
};

/**
 * Checks the configuration of each operator
 * @param {QueryBuilder.Operator[]} operators
 * @returns {QueryBuilder.Operator[]}
 * @throws ConfigError
 */
QueryBuilder.prototype.checkOperators = function(operators) {
    var definedOperators = [];

    operators.forEach(function(operator, i) {
        if (typeof operator == 'string') {
            if (!QueryBuilder.OPERATORS[operator]) {
                Utils.error('Config', 'Unknown operator "{0}"', operator);
            }

            operators[i] = operator = $.extendext(true, 'replace', {}, QueryBuilder.OPERATORS[operator]);
        }
        else {
            if (!operator.type) {
                Utils.error('Config', 'Missing "type" for operator {0}', i);
            }

            if (QueryBuilder.OPERATORS[operator.type]) {
                operators[i] = operator = $.extendext(true, 'replace', {}, QueryBuilder.OPERATORS[operator.type], operator);
            }

            if (operator.nb_inputs === undefined || operator.apply_to === undefined) {
                Utils.error('Config', 'Missing "nb_inputs" and/or "apply_to" for operator "{0}"', operator.type);
            }
        }

        if (definedOperators.indexOf(operator.type) != -1) {
            Utils.error('Config', 'Operator "{0}" already defined', operator.type);
        }
        definedOperators.push(operator.type);

        if (!operator.optgroup) {
            operator.optgroup = null;
        }
        else {
            this.status.has_operator_optgroup = true;

            // register optgroup if needed
            if (!this.settings.optgroups[operator.optgroup]) {
                this.settings.optgroups[operator.optgroup] = operator.optgroup;
            }
        }
    }, this);

    if (this.status.has_operator_optgroup) {
        operators = Utils.groupSort(operators, 'optgroup');
    }

    return operators;
};

/**
 * Adds all events listeners to the builder
 * @private
 */
QueryBuilder.prototype.bindEvents = function() {
    var self = this;
    var Selectors = QueryBuilder.selectors;

    // group condition change
    this.$el.on('change.queryBuilder', Selectors.group_condition, function() {
        if ($(this).is(':checked')) {
            var $group = $(this).closest(Selectors.group_container);
            self.getModel($group).condition = $(this).val();
        }
    });

    // rule filter change
    this.$el.on('change.queryBuilder', Selectors.rule_filter, function() {
        var $rule = $(this).closest(Selectors.rule_container);
        self.getModel($rule).filter = self.getFilterById($(this).val());
    });

    // rule operator change
    this.$el.on('change.queryBuilder', Selectors.rule_operator, function() {
        var $rule = $(this).closest(Selectors.rule_container);
        self.getModel($rule).operator = self.getOperatorByType($(this).val());
    });

    // add rule button
    this.$el.on('click.queryBuilder', Selectors.add_rule, function() {
        var $group = $(this).closest(Selectors.group_container);
        self.addRule(self.getModel($group));
    });

    // delete rule button
    this.$el.on('click.queryBuilder', Selectors.delete_rule, function() {
        var $rule = $(this).closest(Selectors.rule_container);
        self.deleteRule(self.getModel($rule));
    });

    if (this.settings.allow_groups !== 0) {
        // add group button
        this.$el.on('click.queryBuilder', Selectors.add_group, function() {
            var $group = $(this).closest(Selectors.group_container);
            self.addGroup(self.getModel($group));
        });

        // delete group button
        this.$el.on('click.queryBuilder', Selectors.delete_group, function() {
            var $group = $(this).closest(Selectors.group_container);
            self.deleteGroup(self.getModel($group));
        });
    }

    // model events
    this.model.on({
        'drop': function(e, node) {
            node.$el.remove();
            self.refreshGroupsConditions();
        },
        'add': function(e, parent, node, index) {
            if (index === 0) {
                node.$el.prependTo(parent.$el.find('>' + QueryBuilder.selectors.rules_list));
            }
            else {
                node.$el.insertAfter(parent.rules[index - 1].$el);
            }
            self.refreshGroupsConditions();
        },
        'move': function(e, node, group, index) {
            node.$el.detach();

            if (index === 0) {
                node.$el.prependTo(group.$el.find('>' + QueryBuilder.selectors.rules_list));
            }
            else {
                node.$el.insertAfter(group.rules[index - 1].$el);
            }
            self.refreshGroupsConditions();
        },
        'update': function(e, node, field, value, oldValue) {
            if (node instanceof Rule) {
                switch (field) {
                    case 'error':
                        self.updateError(node);
                        break;

                    case 'flags':
                        self.applyRuleFlags(node);
                        break;

                    case 'filter':
                        self.updateRuleFilter(node, oldValue);
                        break;

                    case 'operator':
                        self.updateRuleOperator(node, oldValue);
                        break;

                    case 'value':
                        self.updateRuleValue(node, oldValue);
                        break;
                }
            }
            else {
                switch (field) {
                    case 'error':
                        self.updateError(node);
                        break;

                    case 'flags':
                        self.applyGroupFlags(node);
                        break;

                    case 'condition':
                        self.updateGroupCondition(node, oldValue);
                        break;
                }
            }
        }
    });
};

/**
 * Creates the root group
 * @param {boolean} [addRule=true] - adds a default empty rule
 * @param {object} [data] - group custom data
 * @param {object} [flags] - flags to apply to the group
 * @returns {Group} root group
 * @fires QueryBuilder.afterAddGroup
 */
QueryBuilder.prototype.setRoot = function(addRule, data, flags) {
    addRule = (addRule === undefined || addRule === true);

    var group_id = this.nextGroupId();
    var $group = $(this.getGroupTemplate(group_id, 1));

    this.$el.append($group);
    this.model.root = new Group(null, $group);
    this.model.root.model = this.model;

    this.model.root.data = data;
    this.model.root.flags = $.extend({}, this.settings.default_group_flags, flags);
    this.model.root.condition = this.settings.default_condition;

    this.trigger('afterAddGroup', this.model.root);

    if (addRule) {
        this.addRule(this.model.root);
    }

    return this.model.root;
};

/**
 * Adds a new group
 * @param {Group} parent
 * @param {boolean} [addRule=true] - adds a default empty rule
 * @param {object} [data] - group custom data
 * @param {object} [flags] - flags to apply to the group
 * @returns {Group}
 * @fires QueryBuilder.beforeAddGroup
 * @fires QueryBuilder.afterAddGroup
 */
QueryBuilder.prototype.addGroup = function(parent, addRule, data, flags) {
    addRule = (addRule === undefined || addRule === true);

    var level = parent.level + 1;

    /**
     * Just before adding a group, can be prevented.
     * @event beforeAddGroup
     * @memberof QueryBuilder
     * @param {Group} parent
     * @param {boolean} addRule - if an empty rule will be added in the group
     * @param {int} level - nesting level of the group, 1 is the root group
     */
    var e = this.trigger('beforeAddGroup', parent, addRule, level);
    if (e.isDefaultPrevented()) {
        return null;
    }

    var group_id = this.nextGroupId();
    var $group = $(this.getGroupTemplate(group_id, level));
    var model = parent.addGroup($group);

    model.data = data;
    model.flags = $.extend({}, this.settings.default_group_flags, flags);
    model.condition = this.settings.default_condition;

    /**
     * Just after adding a group
     * @event afterAddGroup
     * @memberof QueryBuilder
     * @param {Group} group
     */
    this.trigger('afterAddGroup', model);

    /**
     * After any change in the rules
     * @event rulesChanged
     * @memberof QueryBuilder
     */
    this.trigger('rulesChanged');

    if (addRule) {
        this.addRule(model);
    }

    return model;
};

/**
 * Tries to delete a group. The group is not deleted if at least one rule is flagged `no_delete`.
 * @param {Group} group
 * @returns {boolean} if the group has been deleted
 * @fires QueryBuilder.beforeDeleteGroup
 * @fires QueryBuilder.afterDeleteGroup
 */
QueryBuilder.prototype.deleteGroup = function(group) {
    if (group.isRoot()) {
        return false;
    }

    /**
     * Just before deleting a group, can be prevented
     * @event beforeDeleteGroup
     * @memberof QueryBuilder
     * @param {Group} parent
     */
    var e = this.trigger('beforeDeleteGroup', group);
    if (e.isDefaultPrevented()) {
        return false;
    }

    var del = true;

    group.each('reverse', function(rule) {
        del &= this.deleteRule(rule);
    }, function(group) {
        del &= this.deleteGroup(group);
    }, this);

    if (del) {
        group.drop();

        /**
         * Just after deleting a group
         * @event afterDeleteGroup
         * @memberof QueryBuilder
         */
        this.trigger('afterDeleteGroup');

        this.trigger('rulesChanged');
    }

    return del;
};

/**
 * Performs actions when a group's condition changes
 * @param {Group} group
 * @param {object} previousCondition
 * @fires QueryBuilder.afterUpdateGroupCondition
 * @private
 */
QueryBuilder.prototype.updateGroupCondition = function(group, previousCondition) {
    group.$el.find('>' + QueryBuilder.selectors.group_condition).each(function() {
        var $this = $(this);
        $this.prop('checked', $this.val() === group.condition);
        $this.parent().toggleClass('active', $this.val() === group.condition);
    });

    /**
     * After the group condition has been modified
     * @event afterUpdateGroupCondition
     * @memberof QueryBuilder
     * @param {Group} group
     * @param {object} previousCondition
     */
    this.trigger('afterUpdateGroupCondition', group, previousCondition);

    this.trigger('rulesChanged');
};

/**
 * Updates the visibility of conditions based on number of rules inside each group
 * @private
 */
QueryBuilder.prototype.refreshGroupsConditions = function() {
    (function walk(group) {
        if (!group.flags || (group.flags && !group.flags.condition_readonly)) {
            group.$el.find('>' + QueryBuilder.selectors.group_condition).prop('disabled', group.rules.length <= 1)
                .parent().toggleClass('disabled', group.rules.length <= 1);
        }

        group.each(null, function(group) {
            walk(group);
        }, this);
    }(this.model.root));
};

/**
 * Adds a new rule
 * @param {Group} parent
 * @param {object} [data] - rule custom data
 * @param {object} [flags] - flags to apply to the rule
 * @returns {Rule}
 * @fires QueryBuilder.beforeAddRule
 * @fires QueryBuilder.afterAddRule
 * @fires QueryBuilder.changer:getDefaultFilter
 */
QueryBuilder.prototype.addRule = function(parent, data, flags) {
    /**
     * Just before adding a rule, can be prevented
     * @event beforeAddRule
     * @memberof QueryBuilder
     * @param {Group} parent
     */
    var e = this.trigger('beforeAddRule', parent);
    if (e.isDefaultPrevented()) {
        return null;
    }

    var rule_id = this.nextRuleId();
    var $rule = $(this.getRuleTemplate(rule_id));
    var model = parent.addRule($rule);

    model.data = data;
    model.flags = $.extend({}, this.settings.default_rule_flags, flags);

    /**
     * Just after adding a rule
     * @event afterAddRule
     * @memberof QueryBuilder
     * @param {Rule} rule
     */
    this.trigger('afterAddRule', model);

    this.trigger('rulesChanged');

    this.createRuleFilters(model);

    if (this.settings.default_filter || !this.settings.display_empty_filter) {
        /**
         * Modifies the default filter for a rule
         * @event changer:getDefaultFilter
         * @memberof QueryBuilder
         * @param {QueryBuilder.Filter} filter
         * @param {Rule} rule
         * @returns {QueryBuilder.Filter}
         */
        model.filter = this.change('getDefaultFilter',
            this.getFilterById(this.settings.default_filter || this.filters[0].id),
            model
        );
    }

    return model;
};

/**
 * Tries to delete a rule
 * @param {Rule} rule
 * @returns {boolean} if the rule has been deleted
 * @fires QueryBuilder.beforeDeleteRule
 * @fires QueryBuilder.afterDeleteRule
 */
QueryBuilder.prototype.deleteRule = function(rule) {
    if (rule.flags.no_delete) {
        return false;
    }

    /**
     * Just before deleting a rule, can be prevented
     * @event beforeDeleteRule
     * @memberof QueryBuilder
     * @param {Rule} rule
     */
    var e = this.trigger('beforeDeleteRule', rule);
    if (e.isDefaultPrevented()) {
        return false;
    }

    rule.drop();

    /**
     * Just after deleting a rule
     * @event afterDeleteRule
     * @memberof QueryBuilder
     */
    this.trigger('afterDeleteRule');

    this.trigger('rulesChanged');

    return true;
};

/**
 * Creates the filters for a rule
 * @param {Rule} rule
 * @fires QueryBuilder.changer:getRuleFilters
 * @fires QueryBuilder.afterCreateRuleFilters
 * @private
 */
QueryBuilder.prototype.createRuleFilters = function(rule) {
    /**
     * Modifies the list a filters available for a rule
     * @event changer:getRuleFilters
     * @memberof QueryBuilder
     * @param {QueryBuilder.Filter[]} filters
     * @param {Rule} rule
     * @returns {QueryBuilder.Filter[]}
     */
    var filters = this.change('getRuleFilters', this.filters, rule);
    var $filterSelect = $(this.getRuleFilterSelect(rule, filters));

    rule.$el.find(QueryBuilder.selectors.filter_container).html($filterSelect);

    /**
     * After creating the dropdown for filters
     * @event afterCreateRuleFilters
     * @memberof QueryBuilder
     * @param {Rule} rule
     */
    this.trigger('afterCreateRuleFilters', rule);

    this.applyRuleFlags(rule);
};

/**
 * Creates the operators for a rule and init the rule operator
 * @param {Rule} rule
 * @fires QueryBuilder.afterCreateRuleOperators
 * @private
 */
QueryBuilder.prototype.createRuleOperators = function(rule) {
    var $operatorContainer = rule.$el.find(QueryBuilder.selectors.operator_container).empty();

    if (!rule.filter) {
        return;
    }

    var operators = this.getOperators(rule.filter);
    var $operatorSelect = $(this.getRuleOperatorSelect(rule, operators));

    $operatorContainer.html($operatorSelect);

    // set the operator without triggering update event
    if (rule.filter.default_operator) {
        rule.__.operator = this.getOperatorByType(rule.filter.default_operator);
    }
    else {
        rule.__.operator = operators[0];
    }

    rule.$el.find(QueryBuilder.selectors.rule_operator).val(rule.operator.type);

    /**
     * After creating the dropdown for operators
     * @event afterCreateRuleOperators
     * @memberof QueryBuilder
     * @param {Rule} rule
     * @param {QueryBuilder.Operator[]} operators - allowed operators for this rule
     */
    this.trigger('afterCreateRuleOperators', rule, operators);

    this.applyRuleFlags(rule);
};

/**
 * Creates the main input for a rule
 * @param {Rule} rule
 * @fires QueryBuilder.afterCreateRuleInput
 * @private
 */
QueryBuilder.prototype.createRuleInput = function(rule) {
    var $valueContainer = rule.$el.find(QueryBuilder.selectors.value_container).empty();

    rule.__.value = undefined;

    if (!rule.filter || !rule.operator || rule.operator.nb_inputs === 0) {
        return;
    }

    var self = this;
    var $inputs = $();
    var filter = rule.filter;

    for (var i = 0; i < rule.operator.nb_inputs; i++) {
        var $ruleInput = $(this.getRuleInput(rule, i));
        if (i > 0) $valueContainer.append(this.settings.inputs_separator);
        $valueContainer.append($ruleInput);
        $inputs = $inputs.add($ruleInput);
    }

    $valueContainer.css('display', '');

    $inputs.on('change ' + (filter.input_event || ''), function() {
        if (!rule._updating_input) {
            rule._updating_value = true;
            rule.value = self.getRuleInputValue(rule);
            rule._updating_value = false;
        }
    });

    if (filter.plugin) {
        $inputs[filter.plugin](filter.plugin_config || {});
    }

    /**
     * After creating the input for a rule and initializing optional plugin
     * @event afterCreateRuleInput
     * @memberof QueryBuilder
     * @param {Rule} rule
     */
    this.trigger('afterCreateRuleInput', rule);

    if (filter.default_value !== undefined) {
        rule.value = filter.default_value;
    }
    else {
        rule._updating_value = true;
        rule.value = self.getRuleInputValue(rule);
        rule._updating_value = false;
    }

    this.applyRuleFlags(rule);
};

/**
 * Performs action when a rule's filter changes
 * @param {Rule} rule
 * @param {object} previousFilter
 * @fires QueryBuilder.afterUpdateRuleFilter
 * @private
 */
QueryBuilder.prototype.updateRuleFilter = function(rule, previousFilter) {
    this.createRuleOperators(rule);
    this.createRuleInput(rule);

    rule.$el.find(QueryBuilder.selectors.rule_filter).val(rule.filter ? rule.filter.id : '-1');

    // clear rule data if the filter changed
    if (previousFilter && rule.filter && previousFilter.id !== rule.filter.id) {
        rule.data = undefined;
    }

    /**
     * After the filter has been updated and the operators and input re-created
     * @event afterUpdateRuleFilter
     * @memberof QueryBuilder
     * @param {Rule} rule
     * @param {object} previousFilter
     */
    this.trigger('afterUpdateRuleFilter', rule, previousFilter);

    this.trigger('rulesChanged');
};

/**
 * Performs actions when a rule's operator changes
 * @param {Rule} rule
 * @param {object} previousOperator
 * @fires QueryBuilder.afterUpdateRuleOperator
 * @private
 */
QueryBuilder.prototype.updateRuleOperator = function(rule, previousOperator) {
    var $valueContainer = rule.$el.find(QueryBuilder.selectors.value_container);

    if (!rule.operator || rule.operator.nb_inputs === 0) {
        $valueContainer.hide();

        rule.__.value = undefined;
    }
    else {
        $valueContainer.css('display', '');

        if ($valueContainer.is(':empty') || !previousOperator ||
            rule.operator.nb_inputs !== previousOperator.nb_inputs ||
            rule.operator.optgroup !== previousOperator.optgroup
        ) {
            this.createRuleInput(rule);
        }
    }

    if (rule.operator) {
        rule.$el.find(QueryBuilder.selectors.rule_operator).val(rule.operator.type);

        // refresh value if the format changed for this operator
        rule.__.value = this.getRuleInputValue(rule);
    }

    /**
     *  After the operator has been updated and the input optionally re-created
     * @event afterUpdateRuleOperator
     * @memberof QueryBuilder
     * @param {Rule} rule
     * @param {object} previousOperator
     */
    this.trigger('afterUpdateRuleOperator', rule, previousOperator);

    this.trigger('rulesChanged');
};

/**
 * Performs actions when rule's value changes
 * @param {Rule} rule
 * @param {object} previousValue
 * @fires QueryBuilder.afterUpdateRuleValue
 * @private
 */
QueryBuilder.prototype.updateRuleValue = function(rule, previousValue) {
    if (!rule._updating_value) {
        this.setRuleInputValue(rule, rule.value);
    }

    /**
     * After the rule value has been modified
     * @event afterUpdateRuleValue
     * @memberof QueryBuilder
     * @param {Rule} rule
     * @param {*} previousValue
     */
    this.trigger('afterUpdateRuleValue', rule, previousValue);

    this.trigger('rulesChanged');
};

/**
 * Changes a rule's properties depending on its flags
 * @param {Rule} rule
 * @fires QueryBuilder.afterApplyRuleFlags
 * @private
 */
QueryBuilder.prototype.applyRuleFlags = function(rule) {
    var flags = rule.flags;
    var Selectors = QueryBuilder.selectors;

    rule.$el.find(Selectors.rule_filter).prop('disabled', flags.filter_readonly);
    rule.$el.find(Selectors.rule_operator).prop('disabled', flags.operator_readonly);
    rule.$el.find(Selectors.rule_value).prop('disabled', flags.value_readonly);

    if (flags.no_delete) {
        rule.$el.find(Selectors.delete_rule).remove();
    }

    /**
     * After rule's flags has been applied
     * @event afterApplyRuleFlags
     * @memberof QueryBuilder
     * @param {Rule} rule
     */
    this.trigger('afterApplyRuleFlags', rule);
};

/**
 * Changes group's properties depending on its flags
 * @param {Group} group
 * @fires QueryBuilder.afterApplyGroupFlags
 * @private
 */
QueryBuilder.prototype.applyGroupFlags = function(group) {
    var flags = group.flags;
    var Selectors = QueryBuilder.selectors;

    group.$el.find('>' + Selectors.group_condition).prop('disabled', flags.condition_readonly)
        .parent().toggleClass('readonly', flags.condition_readonly);

    if (flags.no_add_rule) {
        group.$el.find(Selectors.add_rule).remove();
    }
    if (flags.no_add_group) {
        group.$el.find(Selectors.add_group).remove();
    }
    if (flags.no_delete) {
        group.$el.find(Selectors.delete_group).remove();
    }

    /**
     * After group's flags has been applied
     * @event afterApplyGroupFlags
     * @memberof QueryBuilder
     * @param {Group} group
     */
    this.trigger('afterApplyGroupFlags', group);
};

/**
 * Clears all errors markers
 * @param {Node} [node] default is root Group
 */
QueryBuilder.prototype.clearErrors = function(node) {
    node = node || this.model.root;

    if (!node) {
        return;
    }

    node.error = null;

    if (node instanceof Group) {
        node.each(function(rule) {
            rule.error = null;
        }, function(group) {
            this.clearErrors(group);
        }, this);
    }
};

/**
 * Adds/Removes error on a Rule or Group
 * @param {Node} node
 * @fires QueryBuilder.changer:displayError
 * @private
 */
QueryBuilder.prototype.updateError = function(node) {
    if (this.settings.display_errors) {
        if (node.error === null) {
            node.$el.removeClass('has-error');
        }
        else {
            var errorMessage = this.translate('errors', node.error[0]);
            errorMessage = Utils.fmt(errorMessage, node.error.slice(1));

            /**
             * Modifies an error message before display
             * @event changer:displayError
             * @memberof QueryBuilder
             * @param {string} errorMessage - the error message (translated and formatted)
             * @param {array} error - the raw error array (error code and optional arguments)
             * @param {Node} node
             * @returns {string}
             */
            errorMessage = this.change('displayError', errorMessage, node.error, node);

            node.$el.addClass('has-error')
                .find(QueryBuilder.selectors.error_container).eq(0)
                .attr('title', errorMessage);
        }
    }
};

/**
 * Triggers a validation error event
 * @param {Node} node
 * @param {string|array} error
 * @param {*} value
 * @fires QueryBuilder.validationError
 * @private
 */
QueryBuilder.prototype.triggerValidationError = function(node, error, value) {
    if (!$.isArray(error)) {
        error = [error];
    }

    /**
     * Fired when a validation error occurred, can be prevented
     * @event validationError
     * @memberof QueryBuilder
     * @param {Node} node
     * @param {string} error
     * @param {*} value
     */
    var e = this.trigger('validationError', node, error, value);
    if (!e.isDefaultPrevented()) {
        node.error = error;
    }
};


/**
 * Destroys the builder
 * @fires QueryBuilder.beforeDestroy
 */
QueryBuilder.prototype.destroy = function() {
    /**
     * Before the {@link QueryBuilder#destroy} method
     * @event beforeDestroy
     * @memberof QueryBuilder
     */
    this.trigger('beforeDestroy');

    if (this.status.generated_id) {
        this.$el.removeAttr('id');
    }

    this.clear();
    this.model = null;

    this.$el
        .off('.queryBuilder')
        .removeClass('query-builder')
        .removeData('queryBuilder');

    delete this.$el[0].queryBuilder;
};

/**
 * Clear all rules and resets the root group
 * @fires QueryBuilder.beforeReset
 * @fires QueryBuilder.afterReset
 */
QueryBuilder.prototype.reset = function() {
    /**
     * Before the {@link QueryBuilder#reset} method, can be prevented
     * @event beforeReset
     * @memberof QueryBuilder
     */
    var e = this.trigger('beforeReset');
    if (e.isDefaultPrevented()) {
        return;
    }

    this.status.group_id = 1;
    this.status.rule_id = 0;

    this.model.root.empty();

    this.model.root.data = undefined;
    this.model.root.flags = $.extend({}, this.settings.default_group_flags);
    this.model.root.condition = this.settings.default_condition;

    this.addRule(this.model.root);

    /**
     * After the {@link QueryBuilder#reset} method
     * @event afterReset
     * @memberof QueryBuilder
     */
    this.trigger('afterReset');

    this.trigger('rulesChanged');
};

/**
 * Clears all rules and removes the root group
 * @fires QueryBuilder.beforeClear
 * @fires QueryBuilder.afterClear
 */
QueryBuilder.prototype.clear = function() {
    /**
     * Before the {@link QueryBuilder#clear} method, can be prevented
     * @event beforeClear
     * @memberof QueryBuilder
     */
    var e = this.trigger('beforeClear');
    if (e.isDefaultPrevented()) {
        return;
    }

    this.status.group_id = 0;
    this.status.rule_id = 0;

    if (this.model.root) {
        this.model.root.drop();
        this.model.root = null;
    }

    /**
     * After the {@link QueryBuilder#clear} method
     * @event afterClear
     * @memberof QueryBuilder
     */
    this.trigger('afterClear');

    this.trigger('rulesChanged');
};

/**
 * Modifies the builder configuration.<br>
 * Only options defined in QueryBuilder.modifiable_options are modifiable
 * @param {object} options
 */
QueryBuilder.prototype.setOptions = function(options) {
    $.each(options, function(opt, value) {
        if (QueryBuilder.modifiable_options.indexOf(opt) !== -1) {
            this.settings[opt] = value;
        }
    }.bind(this));
};

/**
 * Returns the model associated to a DOM object, or the root model
 * @param {jQuery} [target]
 * @returns {Node}
 */
QueryBuilder.prototype.getModel = function(target) {
    if (!target) {
        return this.model.root;
    }
    else if (target instanceof Node) {
        return target;
    }
    else {
        return $(target).data('queryBuilderModel');
    }
};

/**
 * Validates the whole builder
 * @param {object} [options]
 * @param {boolean} [options.skip_empty=false] - skips validating rules that have no filter selected
 * @returns {boolean}
 * @fires QueryBuilder.changer:validate
 */
QueryBuilder.prototype.validate = function(options) {
    options = $.extend({
        skip_empty: false
    }, options);

    this.clearErrors();

    var self = this;

    var valid = (function parse(group) {
        var done = 0;
        var errors = 0;

        group.each(function(rule) {
            if (!rule.filter && options.skip_empty) {
                return;
            }

            if (!rule.filter) {
                self.triggerValidationError(rule, 'no_filter', null);
                errors++;
                return;
            }

            if (!rule.operator) {
                self.triggerValidationError(rule, 'no_operator', null);
                errors++;
                return;
            }

            if (rule.operator.nb_inputs !== 0) {
                var valid = self.validateValue(rule, rule.value);

                if (valid !== true) {
                    self.triggerValidationError(rule, valid, rule.value);
                    errors++;
                    return;
                }
            }

            done++;

        }, function(group) {
            var res = parse(group);
            if (res === true) {
                done++;
            }
            else if (res === false) {
                errors++;
            }
        });

        if (errors > 0) {
            return false;
        }
        else if (done === 0 && !group.isRoot() && options.skip_empty) {
            return null;
        }
        else if (done === 0 && (!self.settings.allow_empty || !group.isRoot())) {
            self.triggerValidationError(group, 'empty_group', null);
            return false;
        }

        return true;

    }(this.model.root));

    /**
     * Modifies the result of the {@link QueryBuilder#validate} method
     * @event changer:validate
     * @memberof QueryBuilder
     * @param {boolean} valid
     * @returns {boolean}
     */
    return this.change('validate', valid);
};

/**
 * Gets an object representing current rules
 * @param {object} [options]
 * @param {boolean|string} [options.get_flags=false] - export flags, true: only changes from default flags or 'all'
 * @param {boolean} [options.allow_invalid=false] - returns rules even if they are invalid
 * @param {boolean} [options.skip_empty=false] - remove rules that have no filter selected
 * @returns {object}
 * @fires QueryBuilder.changer:ruleToJson
 * @fires QueryBuilder.changer:groupToJson
 * @fires QueryBuilder.changer:getRules
 */
QueryBuilder.prototype.getRules = function(options) {
    options = $.extend({
        get_flags: false,
        allow_invalid: false,
        skip_empty: false
    }, options);

    var valid = this.validate(options);
    if (!valid && !options.allow_invalid) {
        return null;
    }

    var self = this;

    var out = (function parse(group) {

        var groupData = {
            condition: group.condition,
            rules: []
        };

        if (group.data) {
            groupData.data = $.extendext(true, 'replace', {}, group.data);
        }

        if (options.get_flags) {
            var flags = self.getGroupFlags(group.flags, options.get_flags === 'all');
            if (!$.isEmptyObject(flags)) {
                groupData.flags = flags;
            }
        }

        group.each(function(rule) {

            if (!rule.filter && options.skip_empty) {
                return;
            }

            var value = null;
            if (!rule.operator || rule.operator.nb_inputs !== 0) {
                value = rule.value;
            }

            var ruleData = {
                id: rule.filter ? rule.filter.id : null,
                field: rule.filter ? rule.filter.field : null,
                type: rule.filter ? rule.filter.type : null,
                input: rule.filter ? rule.filter.input : null,
                operator: rule.operator ? rule.operator.type : null,
                value: value,
                my_type:rule.filter ? rule.filter.my_type : null,//modified
                table_name:rule.filter ? rule.filter.table_name : null,//modified
            };

            if (rule.filter && rule.filter.data || rule.data) {
                ruleData.data = $.extendext(true, 'replace', {}, rule.filter.data, rule.data);
            }

            if (options.get_flags) {
                var flags = self.getRuleFlags(rule.flags, options.get_flags === 'all');
                if (!$.isEmptyObject(flags)) {
                    ruleData.flags = flags;
                }
            }

            /**
             * Modifies the JSON generated from a Rule object
             * @event changer:ruleToJson
             * @memberof QueryBuilder
             * @param {object} json
             * @param {Rule} rule
             * @returns {object}
             */
            groupData.rules.push(self.change('ruleToJson', ruleData, rule));

        }, function(model) {
            var data = parse(model);
            if (data.rules.length !== 0 || !options.skip_empty) {
                groupData.rules.push(data);
            }
        }, this);

        /**
         * Modifies the JSON generated from a Group object
         * @event changer:groupToJson
         * @memberof QueryBuilder
         * @param {object} json
         * @param {Group} group
         * @returns {object}
         */
        return self.change('groupToJson', groupData, group);

    }(this.model.root));

    out.valid = valid;

    /**
     * Modifies the result of the {@link QueryBuilder#getRules} method
     * @event changer:getRules
     * @memberof QueryBuilder
     * @param {object} json
     * @returns {object}
     */
    return this.change('getRules', out);
};

/**
 * Sets rules from object
 * @param {object} data
 * @param {object} [options]
 * @param {boolean} [options.allow_invalid=false] - silent-fail if the data are invalid
 * @throws RulesError, UndefinedConditionError
 * @fires QueryBuilder.changer:setRules
 * @fires QueryBuilder.changer:jsonToRule
 * @fires QueryBuilder.changer:jsonToGroup
 * @fires QueryBuilder.afterSetRules
 */
QueryBuilder.prototype.setRules = function(data, options) {
    options = $.extend({
        allow_invalid: false
    }, options);

    if ($.isArray(data)) {
        data = {
            condition: this.settings.default_condition,
            rules: data
        };
    }

    if (!data || !data.rules || (data.rules.length === 0 && !this.settings.allow_empty)) {
        Utils.error('RulesParse', 'Incorrect data object passed');
    }

    this.clear();
    this.setRoot(false, data.data, this.parseGroupFlags(data));

    /**
     * Modifies data before the {@link QueryBuilder#setRules} method
     * @event changer:setRules
     * @memberof QueryBuilder
     * @param {object} json
     * @param {object} options
     * @returns {object}
     */
    data = this.change('setRules', data, options);

    var self = this;

    (function add(data, group) {
        if (group === null) {
            return;
        }

        if (data.condition === undefined) {
            data.condition = self.settings.default_condition;
        }
        else if (self.settings.conditions.indexOf(data.condition) == -1) {
            Utils.error(!options.allow_invalid, 'UndefinedCondition', 'Invalid condition "{0}"', data.condition);
            data.condition = self.settings.default_condition;
        }

        group.condition = data.condition;

        data.rules.forEach(function(item) {
            var model;

            if (item.rules !== undefined) {
                if (self.settings.allow_groups !== -1 && self.settings.allow_groups < group.level) {
                    Utils.error(!options.allow_invalid, 'RulesParse', 'No more than {0} groups are allowed', self.settings.allow_groups);
                    self.reset();
                }
                else {
                    model = self.addGroup(group, false, item.data, self.parseGroupFlags(item));
                    if (model === null) {
                        return;
                    }

                    add(item, model);
                }
            }
            else {
                if (!item.empty) {
                    if (item.id === undefined) {
                        Utils.error(!options.allow_invalid, 'RulesParse', 'Missing rule field id');
                        item.empty = true;
                    }
                    if (item.operator === undefined) {
                        item.operator = 'equal';
                    }
                }

                model = self.addRule(group, item.data, self.parseRuleFlags(item));
                if (model === null) {
                    return;
                }

                if (!item.empty) {
                    model.filter = self.getFilterById(item.id, !options.allow_invalid);
                }

                if (model.filter) {
                    model.operator = self.getOperatorByType(item.operator, !options.allow_invalid);

                    if (!model.operator) {
                        model.operator = self.getOperators(model.filter)[0];
                    }
                }

                if (model.operator && model.operator.nb_inputs !== 0) {
                    if (item.value !== undefined) {
                        model.value = item.value;
                    }
                    else if (model.filter.default_value !== undefined) {
                        model.value = model.filter.default_value;
                    }
                }


                /**
                 * Modifies the Rule object generated from the JSON
                 * @event changer:jsonToRule
                 * @memberof QueryBuilder
                 * @param {Rule} rule
                 * @param {object} json
                 * @returns {Rule} the same rule
                 */
                if (self.change('jsonToRule', model, item) != model) {
                    Utils.error('RulesParse', 'Plugin tried to change rule reference');
                }
            }
        });

        /**
         * Modifies the Group object generated from the JSON
         * @event changer:jsonToGroup
         * @memberof QueryBuilder
         * @param {Group} group
         * @param {object} json
         * @returns {Group} the same group
         */
        if (self.change('jsonToGroup', group, data) != group) {
            Utils.error('RulesParse', 'Plugin tried to change group reference');
        }

    }(data, this.model.root));

    /**
     * After the {@link QueryBuilder#setRules} method
     * @event afterSetRules
     * @memberof QueryBuilder
     */
    this.trigger('afterSetRules');
};


/**
 * Performs value validation
 * @param {Rule} rule
 * @param {string|string[]} value
 * @returns {array|boolean} true or error array
 * @fires QueryBuilder.changer:validateValue
 */
QueryBuilder.prototype.validateValue = function(rule, value) {
    var validation = rule.filter.validation || {};
    var result = true;

    if (validation.callback) {
        result = validation.callback.call(this, value, rule);
    }
    else {
        result = this._validateValue(rule, value);
    }

    /**
     * Modifies the result of the rule validation method
     * @event changer:validateValue
     * @memberof QueryBuilder
     * @param {array|boolean} result - true or an error array
     * @param {*} value
     * @param {Rule} rule
     * @returns {array|boolean}
     */
    return this.change('validateValue', result, value, rule);
};

/**
 * Default validation function
 * @param {Rule} rule
 * @param {string|string[]} value
 * @returns {array|boolean} true or error array
 * @throws ConfigError
 * @private
 */
QueryBuilder.prototype._validateValue = function(rule, value) {
    var filter = rule.filter;
    var operator = rule.operator;
    var validation = filter.validation || {};
    var result = true;
    var tmp, tempValue;

    if (rule.operator.nb_inputs === 1) {
        value = [value];
    }

    for (var i = 0; i < operator.nb_inputs; i++) {
        if (!operator.multiple && $.isArray(value[i]) && value[i].length > 1) {
            result = ['operator_not_multiple', operator.type, this.translate('operators', operator.type)];
            break;
        }

        switch (filter.input) {
            case 'radio':
                if (value[i] === undefined || value[i].length === 0) {
                    if (!validation.allow_empty_value) {
                        result = ['radio_empty'];
                    }
                    break;
                }
                break;

            case 'checkbox':
                if (value[i] === undefined || value[i].length === 0) {
                    if (!validation.allow_empty_value) {
                        result = ['checkbox_empty'];
                    }
                    break;
                }
                break;

            case 'select':
                if (value[i] === undefined || value[i].length === 0 || (filter.placeholder && value[i] == filter.placeholder_value)) {
                    if (!validation.allow_empty_value) {
                        result = ['select_empty'];
                    }
                    break;
                }
                break;

            default:
                tempValue = $.isArray(value[i]) ? value[i] : [value[i]];

                for (var j = 0; j < tempValue.length; j++) {
                    switch (QueryBuilder.types[filter.type]) {
                        case 'string':
                            if (tempValue[j] === undefined || tempValue[j].length === 0) {
                                if (!validation.allow_empty_value) {
                                    result = ['string_empty'];
                                }
                                break;
                            }
                            if (validation.min !== undefined) {
                                if (tempValue[j].length < parseInt(validation.min)) {
                                    result = [this.getValidationMessage(validation, 'min', 'string_exceed_min_length'), validation.min];
                                    break;
                                }
                            }
                            if (validation.max !== undefined) {
                                if (tempValue[j].length > parseInt(validation.max)) {
                                    result = [this.getValidationMessage(validation, 'max', 'string_exceed_max_length'), validation.max];
                                    break;
                                }
                            }
                            if (validation.format) {
                                if (typeof validation.format == 'string') {
                                    validation.format = new RegExp(validation.format);
                                }
                                if (!validation.format.test(tempValue[j])) {
                                    result = [this.getValidationMessage(validation, 'format', 'string_invalid_format'), validation.format];
                                    break;
                                }
                            }
                            break;

                        case 'number':
                            if (tempValue[j] === undefined || tempValue[j].length === 0) {
                                if (!validation.allow_empty_value) {
                                    result = ['number_nan'];
                                }
                                break;
                            }
                            if (isNaN(tempValue[j])) {
                                result = ['number_nan'];
                                break;
                            }
                            if (filter.type == 'integer') {
                                if (parseInt(tempValue[j]) != tempValue[j]) {
                                    result = ['number_not_integer'];
                                    break;
                                }
                            }
                            else {
                                if (parseFloat(tempValue[j]) != tempValue[j]) {
                                    result = ['number_not_double'];
                                    break;
                                }
                            }
                            if (validation.min !== undefined) {
                                if (tempValue[j] < parseFloat(validation.min)) {
                                    result = [this.getValidationMessage(validation, 'min', 'number_exceed_min'), validation.min];
                                    break;
                                }
                            }
                            if (validation.max !== undefined) {
                                if (tempValue[j] > parseFloat(validation.max)) {
                                    result = [this.getValidationMessage(validation, 'max', 'number_exceed_max'), validation.max];
                                    break;
                                }
                            }
                            if (validation.step !== undefined && validation.step !== 'any') {
                                var v = (tempValue[j] / validation.step).toPrecision(14);
                                if (parseInt(v) != v) {
                                    result = [this.getValidationMessage(validation, 'step', 'number_wrong_step'), validation.step];
                                    break;
                                }
                            }
                            break;

                        case 'datetime':
                            if (tempValue[j] === undefined || tempValue[j].length === 0) {
                                if (!validation.allow_empty_value) {
                                    result = ['datetime_empty'];
                                }
                                break;
                            }

                            // we need MomentJS
                            if (validation.format) {
                                if (!('moment' in window)) {
                                    Utils.error('MissingLibrary', 'MomentJS is required for Date/Time validation. Get it here http://momentjs.com');
                                }

                                var datetime = moment(tempValue[j], validation.format);
                                if (!datetime.isValid()) {
                                    result = [this.getValidationMessage(validation, 'format', 'datetime_invalid'), validation.format];
                                    break;
                                }
                                else {
                                    if (validation.min) {
                                        if (datetime < moment(validation.min, validation.format)) {
                                            result = [this.getValidationMessage(validation, 'min', 'datetime_exceed_min'), validation.min];
                                            break;
                                        }
                                    }
                                    if (validation.max) {
                                        if (datetime > moment(validation.max, validation.format)) {
                                            result = [this.getValidationMessage(validation, 'max', 'datetime_exceed_max'), validation.max];
                                            break;
                                        }
                                    }
                                }
                            }
                            break;

                        case 'boolean':
                            if (tempValue[j] === undefined || tempValue[j].length === 0) {
                                if (!validation.allow_empty_value) {
                                    result = ['boolean_not_valid'];
                                }
                                break;
                            }
                            tmp = ('' + tempValue[j]).trim().toLowerCase();
                            if (tmp !== 'true' && tmp !== 'false' && tmp !== '1' && tmp !== '0' && tempValue[j] !== 1 && tempValue[j] !== 0) {
                                result = ['boolean_not_valid'];
                                break;
                            }
                    }

                    if (result !== true) {
                        break;
                    }
                }
        }

        if (result !== true) {
            break;
        }
    }

    if ((rule.operator.type === 'between' || rule.operator.type === 'not_between') && value.length === 2) {
        switch (QueryBuilder.types[filter.type]) {
            case 'number':
                if (value[0] > value[1]) {
                    result = ['number_between_invalid', value[0], value[1]];
                }
                break;

            case 'datetime':
                // we need MomentJS
                if (validation.format) {
                    if (!('moment' in window)) {
                        Utils.error('MissingLibrary', 'MomentJS is required for Date/Time validation. Get it here http://momentjs.com');
                    }

                    if (moment(value[0], validation.format).isAfter(moment(value[1], validation.format))) {
                        result = ['datetime_between_invalid', value[0], value[1]];
                    }
                }
                break;
        }
    }

    return result;
};

/**
 * Returns an incremented group ID
 * @returns {string}
 * @private
 */
QueryBuilder.prototype.nextGroupId = function() {
    return this.status.id + '_group_' + (this.status.group_id++);
};

/**
 * Returns an incremented rule ID
 * @returns {string}
 * @private
 */
QueryBuilder.prototype.nextRuleId = function() {
    return this.status.id + '_rule_' + (this.status.rule_id++);
};

/**
 * Returns the operators for a filter
 * @param {string|object} filter - filter id or filter object
 * @returns {object[]}
 * @fires QueryBuilder.changer:getOperators
 * @private
 */
QueryBuilder.prototype.getOperators = function(filter) {
    if (typeof filter == 'string') {
        filter = this.getFilterById(filter);
    }

    var result = [];

    for (var i = 0, l = this.operators.length; i < l; i++) {
        // filter operators check
        if (filter.operators) {
            if (filter.operators.indexOf(this.operators[i].type) == -1) {
                continue;
            }
        }
        // type check
        else if (this.operators[i].apply_to.indexOf(QueryBuilder.types[filter.type]) == -1) {
            continue;
        }

        result.push(this.operators[i]);
    }

    // keep sort order defined for the filter
    if (filter.operators) {
        result.sort(function(a, b) {
            return filter.operators.indexOf(a.type) - filter.operators.indexOf(b.type);
        });
    }

    /**
     * Modifies the operators available for a filter
     * @event changer:getOperators
     * @memberof QueryBuilder
     * @param {QueryBuilder.Operator[]} operators
     * @param {QueryBuilder.Filter} filter
     * @returns {QueryBuilder.Operator[]}
     */
    return this.change('getOperators', result, filter);
};

/**
 * Returns a particular filter by its id
 * @param {string} id
 * @param {boolean} [doThrow=true]
 * @returns {object|null}
 * @throws UndefinedFilterError
 * @private
 */
QueryBuilder.prototype.getFilterById = function(id, doThrow) {
    if (id == '-1') {
        return null;
    }

    for (var i = 0, l = this.filters.length; i < l; i++) {
        if (this.filters[i].id == id) {
            return this.filters[i];
        }
    }

    Utils.error(doThrow !== false, 'UndefinedFilter', 'Undefined filter "{0}"', id);

    return null;
};

/**
 * Returns a particular operator by its type
 * @param {string} type
 * @param {boolean} [doThrow=true]
 * @returns {object|null}
 * @throws UndefinedOperatorError
 * @private
 */
QueryBuilder.prototype.getOperatorByType = function(type, doThrow) {
    if (type == '-1') {
        return null;
    }

    for (var i = 0, l = this.operators.length; i < l; i++) {
        if (this.operators[i].type == type) {
            return this.operators[i];
        }
    }

    Utils.error(doThrow !== false, 'UndefinedOperator', 'Undefined operator "{0}"', type);

    return null;
};

/**
 * Returns rule's current input value
 * @param {Rule} rule
 * @returns {*}
 * @fires QueryBuilder.changer:getRuleValue
 * @private
 */
QueryBuilder.prototype.getRuleInputValue = function(rule) {
    var filter = rule.filter;
    var operator = rule.operator;
    var value = [];

    if (filter.valueGetter) {
        value = filter.valueGetter.call(this, rule);
    }
    else {
        var $value = rule.$el.find(QueryBuilder.selectors.value_container);

        for (var i = 0; i < operator.nb_inputs; i++) {
            var name = Utils.escapeElementId(rule.id + '_value_' + i);
            var tmp;

            switch (filter.input) {
                case 'radio':
                    value.push($value.find('[name=' + name + ']:checked').val());
                    break;

                case 'checkbox':
                    tmp = [];
                    // jshint loopfunc:true
                    $value.find('[name=' + name + ']:checked').each(function() {
                        tmp.push($(this).val());
                    });
                    // jshint loopfunc:false
                    value.push(tmp);
                    break;

                case 'select':
                    if (filter.multiple) {
                        tmp = [];
                        // jshint loopfunc:true
                        $value.find('[name=' + name + '] option:selected').each(function() {
                            tmp.push($(this).val());
                        });
                        // jshint loopfunc:false
                        value.push(tmp);
                    }
                    else {
                        value.push($value.find('[name=' + name + '] option:selected').val());
                    }
                    break;

                default:
                    value.push($value.find('[name=' + name + ']').val());
            }
        }

        value = value.map(function(val) {
            if (operator.multiple && filter.value_separator && typeof val == 'string') {
                val = val.split(filter.value_separator);
            }

            if ($.isArray(val)) {
                return val.map(function(subval) {
                    return Utils.changeType(subval, filter.type);
                });
            }
            else {
                return Utils.changeType(val, filter.type);
            }
        });

        if (operator.nb_inputs === 1) {
            value = value[0];
        }

        // @deprecated
        if (filter.valueParser) {
            value = filter.valueParser.call(this, rule, value);
        }
    }

    /**
     * Modifies the rule's value grabbed from the DOM
     * @event changer:getRuleValue
     * @memberof QueryBuilder
     * @param {*} value
     * @param {Rule} rule
     * @returns {*}
     */
    return this.change('getRuleValue', value, rule);
};

/**
 * Sets the value of a rule's input
 * @param {Rule} rule
 * @param {*} value
 * @private
 */
QueryBuilder.prototype.setRuleInputValue = function(rule, value) {
    var filter = rule.filter;
    var operator = rule.operator;

    if (!filter || !operator) {
        return;
    }

    rule._updating_input = true;

    if (filter.valueSetter) {
        filter.valueSetter.call(this, rule, value);
    }
    else {
        var $value = rule.$el.find(QueryBuilder.selectors.value_container);

        if (operator.nb_inputs == 1) {
            value = [value];
        }

        for (var i = 0; i < operator.nb_inputs; i++) {
            var name = Utils.escapeElementId(rule.id + '_value_' + i);

            switch (filter.input) {
                case 'radio':
                    $value.find('[name=' + name + '][value="' + value[i] + '"]').prop('checked', true).trigger('change');
                    break;

                case 'checkbox':
                    if (!$.isArray(value[i])) {
                        value[i] = [value[i]];
                    }
                    // jshint loopfunc:true
                    value[i].forEach(function(value) {
                        $value.find('[name=' + name + '][value="' + value + '"]').prop('checked', true).trigger('change');
                    });
                    // jshint loopfunc:false
                    break;

                default:
                    if (operator.multiple && filter.value_separator && $.isArray(value[i])) {
                        value[i] = value[i].join(filter.value_separator);
                    }
                    $value.find('[name=' + name + ']').val(value[i]).trigger('change');
                    break;
            }
        }
    }

    rule._updating_input = false;
};

/**
 * Parses rule flags
 * @param {object} rule
 * @returns {object}
 * @fires QueryBuilder.changer:parseRuleFlags
 * @private
 */
QueryBuilder.prototype.parseRuleFlags = function(rule) {
    var flags = $.extend({}, this.settings.default_rule_flags);

    if (rule.readonly) {
        $.extend(flags, {
            filter_readonly: true,
            operator_readonly: true,
            value_readonly: true,
            no_delete: true
        });
    }

    if (rule.flags) {
        $.extend(flags, rule.flags);
    }

    /**
     * Modifies the consolidated rule's flags
     * @event changer:parseRuleFlags
     * @memberof QueryBuilder
     * @param {object} flags
     * @param {object} rule - <b>not</b> a Rule object
     * @returns {object}
     */
    return this.change('parseRuleFlags', flags, rule);
};

/**
 * Gets a copy of flags of a rule
 * @param {object} flags
 * @param {boolean} [all=false] - return all flags or only changes from default flags
 * @returns {object}
 * @private
 */
QueryBuilder.prototype.getRuleFlags = function(flags, all) {
    if (all) {
        return $.extend({}, flags);
    }
    else {
        var ret = {};
        $.each(this.settings.default_rule_flags, function(key, value) {
            if (flags[key] !== value) {
                ret[key] = flags[key];
            }
        });
        return ret;
    }
};

/**
 * Parses group flags
 * @param {object} group
 * @returns {object}
 * @fires QueryBuilder.changer:parseGroupFlags
 * @private
 */
QueryBuilder.prototype.parseGroupFlags = function(group) {
    var flags = $.extend({}, this.settings.default_group_flags);

    if (group.readonly) {
        $.extend(flags, {
            condition_readonly: true,
            no_add_rule: true,
            no_add_group: true,
            no_delete: true
        });
    }

    if (group.flags) {
        $.extend(flags, group.flags);
    }

    /**
     * Modifies the consolidated group's flags
     * @event changer:parseGroupFlags
     * @memberof QueryBuilder
     * @param {object} flags
     * @param {object} group - <b>not</b> a Group object
     * @returns {object}
     */
    return this.change('parseGroupFlags', flags, group);
};

/**
 * Gets a copy of flags of a group
 * @param {object} flags
 * @param {boolean} [all=false] - return all flags or only changes from default flags
 * @returns {object}
 * @private
 */
QueryBuilder.prototype.getGroupFlags = function(flags, all) {
    if (all) {
        return $.extend({}, flags);
    }
    else {
        var ret = {};
        $.each(this.settings.default_group_flags, function(key, value) {
            if (flags[key] !== value) {
                ret[key] = flags[key];
            }
        });
        return ret;
    }
};

/**
 * Translate a label either by looking in the `lang` object or in itself if it's an object where keys are language codes
 * @param {string} [category]
 * @param {string|object} key
 * @returns {string}
 * @fires QueryBuilder.changer:translate
 */
QueryBuilder.prototype.translate = function(category, key) {
    if (!key) {
        key = category;
        category = undefined;
    }

    var translation;
    if (typeof key === 'object') {
        translation = key[this.settings.lang_code] || key['en'];
    }
    else {
        translation = (category ? this.lang[category] : this.lang)[key] || key;
    }

    /**
     * Modifies the translated label
     * @event changer:translate
     * @memberof QueryBuilder
     * @param {string} translation
     * @param {string|object} key
     * @param {string} [category]
     * @returns {string}
     */
    return this.change('translate', translation, key, category);
};

/**
 * Returns a validation message
 * @param {object} validation
 * @param {string} type
 * @param {string} def
 * @returns {string}
 * @private
 */
QueryBuilder.prototype.getValidationMessage = function(validation, type, def) {
    return validation.messages && validation.messages[type] || def;
};


QueryBuilder.templates.group = '\
<div id="{{= it.group_id }}" class="rules-group-container"> \
  <div class="rules-group-header"> \
    <div class="btn-group pull-right group-actions"> \
      <button type="button" class="btn btn-xs btn-success" data-add="rule"> \
        <i class="{{= it.icons.add_rule }}"></i> {{= it.translate("add_rule") }} \
      </button> \
      {{? it.settings.allow_groups===-1 || it.settings.allow_groups>=it.level }} \
        <button type="button" class="btn btn-xs btn-success" data-add="group"> \
          <i class="{{= it.icons.add_group }}"></i> {{= it.translate("add_group") }} \
        </button> \
      {{?}} \
      {{? it.level>1 }} \
        <button type="button" class="btn btn-xs btn-danger" data-delete="group"> \
          <i class="{{= it.icons.remove_group }}"></i> {{= it.translate("delete_group") }} \
        </button> \
      {{?}} \
    </div> \
    <div class="btn-group group-conditions"> \
      {{~ it.conditions: condition }} \
        <label class="btn btn-xs btn-primary"> \
          <input type="radio" name="{{= it.group_id }}_cond" value="{{= condition }}"> {{= it.translate("conditions", condition) }} \
        </label> \
      {{~}} \
    </div> \
    {{? it.settings.display_errors }} \
      <div class="error-container"><i class="{{= it.icons.error }}"></i></div> \
    {{?}} \
  </div> \
  <div class=rules-group-body> \
    <div class=rules-list></div> \
  </div> \
</div>';

QueryBuilder.templates.rule = '\
<div id="{{= it.rule_id }}" class="rule-container"> \
  <div class="rule-header"> \
    <div class="btn-group pull-right rule-actions"> \
      <button type="button" class="btn btn-xs btn-danger" data-delete="rule"> \
        <i class="{{= it.icons.remove_rule }}"></i> {{= it.translate("delete_rule") }} \
      </button> \
    </div> \
  </div> \
  {{? it.settings.display_errors }} \
    <div class="error-container"><i class="{{= it.icons.error }}"></i></div> \
  {{?}} \
  <div class="rule-filter-container"></div> \
  <div class="rule-operator-container"></div> \
  <div class="rule-value-container"></div> \
</div>';

QueryBuilder.templates.filterSelect = '\
{{ var optgroup = null; }} \
<select class="form-control" name="{{= it.rule.id }}_filter"> \
  {{? it.settings.display_empty_filter }} \
    <option value="-1">{{= it.settings.select_placeholder }}</option> \
  {{?}} \
  {{~ it.filters: filter }} \
    {{? optgroup !== filter.optgroup }} \
      {{? optgroup !== null }}</optgroup>{{?}} \
      {{? (optgroup = filter.optgroup) !== null }} \
        <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}"> \
      {{?}} \
    {{?}} \
    <option value="{{= filter.id }}" {{? filter.icon}}data-icon="{{= filter.icon}}"{{?}}>{{= it.translate(filter.label) }}</option> \
  {{~}} \
  {{? optgroup !== null }}</optgroup>{{?}} \
</select>';

QueryBuilder.templates.operatorSelect = '\
{{? it.operators.length === 1 }} \
<span> \
{{= it.translate("operators", it.operators[0].type) }} \
</span> \
{{?}} \
{{ var optgroup = null; }} \
<select class="form-control {{? it.operators.length === 1 }}hide{{?}}" name="{{= it.rule.id }}_operator"> \
  {{~ it.operators: operator }} \
    {{? optgroup !== operator.optgroup }} \
      {{? optgroup !== null }}</optgroup>{{?}} \
      {{? (optgroup = operator.optgroup) !== null }} \
        <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}"> \
      {{?}} \
    {{?}} \
    <option value="{{= operator.type }}" {{? operator.icon}}data-icon="{{= operator.icon}}"{{?}}>{{= it.translate("operators", operator.type) }}</option> \
  {{~}} \
  {{? optgroup !== null }}</optgroup>{{?}} \
</select>';

QueryBuilder.templates.ruleValueSelect = '\
{{ var optgroup = null; }} \
<select class="form-control" name="{{= it.name }}" {{? it.rule.filter.multiple }}multiple{{?}}> \
  {{? it.rule.filter.placeholder }} \
    <option value="{{= it.rule.filter.placeholder_value }}" disabled selected>{{= it.rule.filter.placeholder }}</option> \
  {{?}} \
  {{~ it.rule.filter.values: entry }} \
    {{? optgroup !== entry.optgroup }} \
      {{? optgroup !== null }}</optgroup>{{?}} \
      {{? (optgroup = entry.optgroup) !== null }} \
        <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}"> \
      {{?}} \
    {{?}} \
    <option value="{{= entry.value }}">{{= entry.label }}</option> \
  {{~}} \
  {{? optgroup !== null }}</optgroup>{{?}} \
</select>';

/**
 * Returns group's HTML
 * @param {string} group_id
 * @param {int} level
 * @returns {string}
 * @fires QueryBuilder.changer:getGroupTemplate
 * @private
 */
QueryBuilder.prototype.getGroupTemplate = function(group_id, level) {
    var h = this.templates.group({
        builder: this,
        group_id: group_id,
        level: level,
        conditions: this.settings.conditions,
        icons: this.icons,
        settings: this.settings,
        translate: this.translate.bind(this)
    });

    /**
     * Modifies the raw HTML of a group
     * @event changer:getGroupTemplate
     * @memberof QueryBuilder
     * @param {string} html
     * @param {int} level
     * @returns {string}
     */
    return this.change('getGroupTemplate', h, level);
};

/**
 * Returns rule's HTML
 * @param {string} rule_id
 * @returns {string}
 * @fires QueryBuilder.changer:getRuleTemplate
 * @private
 */
QueryBuilder.prototype.getRuleTemplate = function(rule_id) {
    var h = this.templates.rule({
        builder: this,
        rule_id: rule_id,
        icons: this.icons,
        settings: this.settings,
        translate: this.translate.bind(this)
    });

    /**
     * Modifies the raw HTML of a rule
     * @event changer:getRuleTemplate
     * @memberof QueryBuilder
     * @param {string} html
     * @returns {string}
     */
    return this.change('getRuleTemplate', h);
};

/**
 * Returns rule's filter HTML
 * @param {Rule} rule
 * @param {object[]} filters
 * @returns {string}
 * @fires QueryBuilder.changer:getRuleFilterTemplate
 * @private
 */
QueryBuilder.prototype.getRuleFilterSelect = function(rule, filters) {
    var h = this.templates.filterSelect({
        builder: this,
        rule: rule,
        filters: filters,
        icons: this.icons,
        settings: this.settings,
        translate: this.translate.bind(this)
    });

    /**
     * Modifies the raw HTML of the rule's filter dropdown
     * @event changer:getRuleFilterSelect
     * @memberof QueryBuilder
     * @param {string} html
     * @param {Rule} rule
     * @param {QueryBuilder.Filter[]} filters
     * @returns {string}
     */
    return this.change('getRuleFilterSelect', h, rule, filters);
};

/**
 * Returns rule's operator HTML
 * @param {Rule} rule
 * @param {object[]} operators
 * @returns {string}
 * @fires QueryBuilder.changer:getRuleOperatorTemplate
 * @private
 */
QueryBuilder.prototype.getRuleOperatorSelect = function(rule, operators) {
    var h = this.templates.operatorSelect({
        builder: this,
        rule: rule,
        operators: operators,
        icons: this.icons,
        settings: this.settings,
        translate: this.translate.bind(this)
    });

    /**
     * Modifies the raw HTML of the rule's operator dropdown
     * @event changer:getRuleOperatorSelect
     * @memberof QueryBuilder
     * @param {string} html
     * @param {Rule} rule
     * @param {QueryBuilder.Operator[]} operators
     * @returns {string}
     */
    return this.change('getRuleOperatorSelect', h, rule, operators);
};

/**
 * Returns the rule's value select HTML
 * @param {string} name
 * @param {Rule} rule
 * @returns {string}
 * @fires QueryBuilder.changer:getRuleValueSelect
 * @private
 */
QueryBuilder.prototype.getRuleValueSelect = function(name, rule) {
    var h = this.templates.ruleValueSelect({
        builder: this,
        name: name,
        rule: rule,
        icons: this.icons,
        settings: this.settings,
        translate: this.translate.bind(this)
    });

    /**
     * Modifies the raw HTML of the rule's value dropdown (in case of a "select filter)
     * @event changer:getRuleValueSelect
     * @memberof QueryBuilder
     * @param {string} html
     * @param [string} name
     * @param {Rule} rule
     * @returns {string}
     */
    return this.change('getRuleValueSelect', h, name, rule);
};

/**
 * Returns the rule's value HTML
 * @param {Rule} rule
 * @param {int} value_id
 * @returns {string}
 * @fires QueryBuilder.changer:getRuleInput
 * @private
 */
QueryBuilder.prototype.getRuleInput = function(rule, value_id) {
    var filter = rule.filter;
    var validation = rule.filter.validation || {};
    var name = rule.id + '_value_' + value_id;
    var c = filter.vertical ? ' class=block' : '';
    var h = '';

    if (typeof filter.input == 'function') {
        h = filter.input.call(this, rule, name);
    }
    else {
        switch (filter.input) {
            case 'radio':
            case 'checkbox':
                Utils.iterateOptions(filter.values, function(key, val) {
                    h += '<label' + c + '><input type="' + filter.input + '" name="' + name + '" value="' + key + '"> ' + val + '</label> ';
                });
                break;

            case 'select':
                h = this.getRuleValueSelect(name, rule);
                break;

            case 'textarea':
                h += '<textarea class="form-control" name="' + name + '"';
                if (filter.size) h += ' cols="' + filter.size + '"';
                if (filter.rows) h += ' rows="' + filter.rows + '"';
                if (validation.min !== undefined) h += ' minlength="' + validation.min + '"';
                if (validation.max !== undefined) h += ' maxlength="' + validation.max + '"';
                if (filter.placeholder) h += ' placeholder="' + filter.placeholder + '"';
                h += '></textarea>';
                break;

            case 'number':
                h += '<input class="form-control" type="number" name="' + name + '"';
                if (validation.step !== undefined) h += ' step="' + validation.step + '"';
                if (validation.min !== undefined) h += ' min="' + validation.min + '"';
                if (validation.max !== undefined) h += ' max="' + validation.max + '"';
                if (filter.placeholder) h += ' placeholder="' + filter.placeholder + '"';
                if (filter.size) h += ' size="' + filter.size + '"';
                h += '>';
                break;

            default:
                h += '<input class="form-control" type="text" name="' + name + '"';
                if (filter.placeholder) h += ' placeholder="' + filter.placeholder + '"';
                if (filter.type === 'string' && validation.min !== undefined) h += ' minlength="' + validation.min + '"';
                if (filter.type === 'string' && validation.max !== undefined) h += ' maxlength="' + validation.max + '"';
                if (filter.size) h += ' size="' + filter.size + '"';
                h += '>';
        }
    }

    /**
     * Modifies the raw HTML of the rule's input
     * @event changer:getRuleInput
     * @memberof QueryBuilder
     * @param {string} html
     * @param {Rule} rule
     * @param {string} name - the name that the input must have
     * @returns {string}
     */
    return this.change('getRuleInput', h, rule, name);
};


/**
 * @namespace
 */
var Utils = {};

/**
 * @member {object}
 * @memberof QueryBuilder
 * @see Utils
 */
QueryBuilder.utils = Utils;

/**
 * @callback Utils#OptionsIteratee
 * @param {string} key
 * @param {string} value
 * @param {string} [optgroup]
 */

/**
 * Iterates over radio/checkbox/selection options, it accept four formats
 *
 * @example
 * // array of values
 * options = ['one', 'two', 'three']
 * @example
 * // simple key-value map
 * options = {1: 'one', 2: 'two', 3: 'three'}
 * @example
 * // array of 1-element maps
 * options = [{1: 'one'}, {2: 'two'}, {3: 'three'}]
 * @example
 * // array of elements
 * options = [{value: 1, label: 'one', optgroup: 'group'}, {value: 2, label: 'two'}]
 *
 * @param {object|array} options
 * @param {Utils#OptionsIteratee} tpl
 */
Utils.iterateOptions = function(options, tpl) {
    if (options) {
        if ($.isArray(options)) {
            options.forEach(function(entry) {
                if ($.isPlainObject(entry)) {
                    // array of elements
                    if ('value' in entry) {
                        tpl(entry.value, entry.label || entry.value, entry.optgroup);
                    }
                    // array of one-element maps
                    else {
                        $.each(entry, function(key, val) {
                            tpl(key, val);
                            return false; // break after first entry
                        });
                    }
                }
                // array of values
                else {
                    tpl(entry, entry);
                }
            });
        }
        // unordered map
        else {
            $.each(options, function(key, val) {
                tpl(key, val);
            });
        }
    }
};

/**
 * Replaces {0}, {1}, ... in a string
 * @param {string} str
 * @param {...*} args
 * @returns {string}
 */
Utils.fmt = function(str, args) {
    if (!Array.isArray(args)) {
        args = Array.prototype.slice.call(arguments, 1);
    }

    return str.replace(/{([0-9]+)}/g, function(m, i) {
        return args[parseInt(i)];
    });
};

/**
 * Throws an Error object with custom name or logs an error
 * @param {boolean} [doThrow=true]
 * @param {string} type
 * @param {string} message
 * @param {...*} args
 */
Utils.error = function() {
    var i = 0;
    var doThrow = typeof arguments[i] === 'boolean' ? arguments[i++] : true;
    var type = arguments[i++];
    var message = arguments[i++];
    var args = Array.isArray(arguments[i]) ? arguments[i] : Array.prototype.slice.call(arguments, i);

    if (doThrow) {
        var err = new Error(Utils.fmt(message, args));
        err.name = type + 'Error';
        err.args = args;
        throw err;
    }
    else {
        console.error(type + 'Error: ' + Utils.fmt(message, args));
    }
};

/**
 * Changes the type of a value to int, float or bool
 * @param {*} value
 * @param {string} type - 'integer', 'double', 'boolean' or anything else (passthrough)
 * @returns {*}
 */
Utils.changeType = function(value, type) {
    if (value === '' || value === undefined) {
        return undefined;
    }

    switch (type) {
        // @formatter:off
        case 'integer':
            if (typeof value === 'string' && !/^-?\d+$/.test(value)) {
                return value;
            }
            return parseInt(value);
        case 'double':
            if (typeof value === 'string' && !/^-?\d+\.?\d*$/.test(value)) {
                return value;
            }
            return parseFloat(value);
        case 'boolean':
            if (typeof value === 'string' && !/^(0|1|true|false){1}$/i.test(value)) {
                return value;
            }
            return value === true || value === 1 || value.toLowerCase() === 'true' || value === '1';
        default: return value;
        // @formatter:on
    }
};

/**
 * Escapes a string like PHP's mysql_real_escape_string does
 * @param {string} value
 * @returns {string}
 */
Utils.escapeString = function(value) {
    if (typeof value != 'string') {
        return value;
    }

    return value
        .replace(/[\0\n\r\b\\\'\"]/g, function(s) {
            switch (s) {
                // @formatter:off
                case '\0': return '\\0';
                case '\n': return '\\n';
                case '\r': return '\\r';
                case '\b': return '\\b';
                default:   return '\\' + s;
                // @formatter:off
            }
        })
        // uglify compliant
        .replace(/\t/g, '\\t')
        .replace(/\x1a/g, '\\Z');
};

/**
 * Escapes a string for use in regex
 * @param {string} str
 * @returns {string}
 */
Utils.escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

/**
 * Escapes a string for use in HTML element id
 * @param {string} str
 * @returns {string}
 */
Utils.escapeElementId = function(str) {
    // Regex based on that suggested by:
    // https://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
    // - escapes : . [ ] ,
    // - avoids escaping already escaped values
    return (str) ? str.replace(/(\\)?([:.\[\],])/g,
            function( $0, $1, $2 ) { return $1 ? $0 : '\\' + $2; }) : str;
};

/**
 * Sorts objects by grouping them by `key`, preserving initial order when possible
 * @param {object[]} items
 * @param {string} key
 * @returns {object[]}
 */
Utils.groupSort = function(items, key) {
    var optgroups = [];
    var newItems = [];

    items.forEach(function(item) {
        var idx;

        if (item[key]) {
            idx = optgroups.lastIndexOf(item[key]);

            if (idx == -1) {
                idx = optgroups.length;
            }
            else {
                idx++;
            }
        }
        else {
            idx = optgroups.length;
        }

        optgroups.splice(idx, 0, item[key]);
        newItems.splice(idx, 0, item);
    });

    return newItems;
};

/**
 * Defines properties on an Node prototype with getter and setter.<br>
 *     Update events are emitted in the setter through root Model (if any).<br>
 *     The object must have a `__` object, non enumerable property to store values.
 * @param {function} obj
 * @param {string[]} fields
 */
Utils.defineModelProperties = function(obj, fields) {
    fields.forEach(function(field) {
        Object.defineProperty(obj.prototype, field, {
            enumerable: true,
            get: function() {
                return this.__[field];
            },
            set: function(value) {
                var previousValue = (this.__[field] !== null && typeof this.__[field] == 'object') ?
                    $.extend({}, this.__[field]) :
                    this.__[field];

                this.__[field] = value;

                if (this.model !== null) {
                    /**
                     * After a value of the model changed
                     * @event model:update
                     * @memberof Model
                     * @param {Node} node
                     * @param {string} field
                     * @param {*} value
                     * @param {*} previousValue
                     */
                    this.model.trigger('update', this, field, value, previousValue);
                }
            }
        });
    });
};


/**
 * Main object storing data model and emitting model events
 * @constructor
 */
function Model() {
    /**
     * @member {Group}
     * @readonly
     */
    this.root = null;

    /**
     * Base for event emitting
     * @member {jQuery}
     * @readonly
     * @private
     */
    this.$ = $(this);
}

$.extend(Model.prototype, /** @lends Model.prototype */ {
    /**
     * Triggers an event on the model
     * @param {string} type
     * @returns {$.Event}
     */
    trigger: function(type) {
        var event = new $.Event(type);
        this.$.triggerHandler(event, Array.prototype.slice.call(arguments, 1));
        return event;
    },

    /**
     * Attaches an event listener on the model
     * @param {string} type
     * @param {function} cb
     * @returns {Model}
     */
    on: function() {
        this.$.on.apply(this.$, Array.prototype.slice.call(arguments));
        return this;
    },

    /**
     * Removes an event listener from the model
     * @param {string} type
     * @param {function} [cb]
     * @returns {Model}
     */
    off: function() {
        this.$.off.apply(this.$, Array.prototype.slice.call(arguments));
        return this;
    },

    /**
     * Attaches an event listener called once on the model
     * @param {string} type
     * @param {function} cb
     * @returns {Model}
     */
    once: function() {
        this.$.one.apply(this.$, Array.prototype.slice.call(arguments));
        return this;
    }
});


/**
 * Root abstract object
 * @constructor
 * @param {Node} [parent]
 * @param {jQuery} $el
 */
var Node = function(parent, $el) {
    if (!(this instanceof Node)) {
        return new Node(parent, $el);
    }

    Object.defineProperty(this, '__', { value: {} });

    $el.data('queryBuilderModel', this);

    /**
     * @name level
     * @member {int}
     * @memberof Node
     * @instance
     * @readonly
     */
    this.__.level = 1;

    /**
     * @name error
     * @member {string}
     * @memberof Node
     * @instance
     */
    this.__.error = null;

    /**
     * @name flags
     * @member {object}
     * @memberof Node
     * @instance
     * @readonly
     */
    this.__.flags = {};

    /**
     * @name data
     * @member {object}
     * @memberof Node
     * @instance
     */
    this.__.data = undefined;

    /**
     * @member {jQuery}
     * @readonly
     */
    this.$el = $el;

    /**
     * @member {string}
     * @readonly
     */
    this.id = $el[0].id;

    /**
     * @member {Model}
     * @readonly
     */
    this.model = null;

    /**
     * @member {Group}
     * @readonly
     */
    this.parent = parent;
};

Utils.defineModelProperties(Node, ['level', 'error', 'data', 'flags']);

Object.defineProperty(Node.prototype, 'parent', {
    enumerable: true,
    get: function() {
        return this.__.parent;
    },
    set: function(value) {
        this.__.parent = value;
        this.level = value === null ? 1 : value.level + 1;
        this.model = value === null ? null : value.model;
    }
});

/**
 * Checks if this Node is the root
 * @returns {boolean}
 */
Node.prototype.isRoot = function() {
    return (this.level === 1);
};

/**
 * Returns the node position inside its parent
 * @returns {int}
 */
Node.prototype.getPos = function() {
    if (this.isRoot()) {
        return -1;
    }
    else {
        return this.parent.getNodePos(this);
    }
};

/**
 * Deletes self
 * @fires Model.model:drop
 */
Node.prototype.drop = function() {
    var model = this.model;

    if (!!this.parent) {
        this.parent.removeNode(this);
    }

    this.$el.removeData('queryBuilderModel');

    if (model !== null) {
        /**
         * After a node of the model has been removed
         * @event model:drop
         * @memberof Model
         * @param {Node} node
         */
        model.trigger('drop', this);
    }
};

/**
 * Moves itself after another Node
 * @param {Node} target
 * @fires Model.model:move
 */
Node.prototype.moveAfter = function(target) {
    if (!this.isRoot()) {
        this.move(target.parent, target.getPos() + 1);
    }
};

/**
 * Moves itself at the beginning of parent or another Group
 * @param {Group} [target]
 * @fires Model.model:move
 */
Node.prototype.moveAtBegin = function(target) {
    if (!this.isRoot()) {
        if (target === undefined) {
            target = this.parent;
        }

        this.move(target, 0);
    }
};

/**
 * Moves itself at the end of parent or another Group
 * @param {Group} [target]
 * @fires Model.model:move
 */
Node.prototype.moveAtEnd = function(target) {
    if (!this.isRoot()) {
        if (target === undefined) {
            target = this.parent;
        }

        this.move(target, target.length() === 0 ? 0 : target.length() - 1);
    }
};

/**
 * Moves itself at specific position of Group
 * @param {Group} target
 * @param {int} index
 * @fires Model.model:move
 */
Node.prototype.move = function(target, index) {
    if (!this.isRoot()) {
        if (typeof target === 'number') {
            index = target;
            target = this.parent;
        }

        this.parent.removeNode(this);
        target.insertNode(this, index, false);

        if (this.model !== null) {
            /**
             * After a node of the model has been moved
             * @event model:move
             * @memberof Model
             * @param {Node} node
             * @param {Node} target
             * @param {int} index
             */
            this.model.trigger('move', this, target, index);
        }
    }
};


/**
 * Group object
 * @constructor
 * @extends Node
 * @param {Group} [parent]
 * @param {jQuery} $el
 */
var Group = function(parent, $el) {
    if (!(this instanceof Group)) {
        return new Group(parent, $el);
    }

    Node.call(this, parent, $el);

    /**
     * @member {object[]}
     * @readonly
     */
    this.rules = [];

    /**
     * @name condition
     * @member {string}
     * @memberof Group
     * @instance
     */
    this.__.condition = null;
};

Group.prototype = Object.create(Node.prototype);
Group.prototype.constructor = Group;

Utils.defineModelProperties(Group, ['condition']);

/**
 * Removes group's content
 */
Group.prototype.empty = function() {
    this.each('reverse', function(rule) {
        rule.drop();
    }, function(group) {
        group.drop();
    });
};

/**
 * Deletes self
 */
Group.prototype.drop = function() {
    this.empty();
    Node.prototype.drop.call(this);
};

/**
 * Returns the number of children
 * @returns {int}
 */
Group.prototype.length = function() {
    return this.rules.length;
};

/**
 * Adds a Node at specified index
 * @param {Node} node
 * @param {int} [index=end]
 * @param {boolean} [trigger=false] - fire 'add' event
 * @returns {Node} the inserted node
 * @fires Model.model:add
 */
Group.prototype.insertNode = function(node, index, trigger) {
    if (index === undefined) {
        index = this.length();
    }

    this.rules.splice(index, 0, node);
    node.parent = this;

    if (trigger && this.model !== null) {
        /**
         * After a node of the model has been added
         * @event model:add
         * @memberof Model
         * @param {Node} parent
         * @param {Node} node
         * @param {int} index
         */
        this.model.trigger('add', this, node, index);
    }

    return node;
};

/**
 * Adds a new Group at specified index
 * @param {jQuery} $el
 * @param {int} [index=end]
 * @returns {Group}
 * @fires Model.model:add
 */
Group.prototype.addGroup = function($el, index) {
    return this.insertNode(new Group(this, $el), index, true);
};

/**
 * Adds a new Rule at specified index
 * @param {jQuery} $el
 * @param {int} [index=end]
 * @returns {Rule}
 * @fires Model.model:add
 */
Group.prototype.addRule = function($el, index) {
    return this.insertNode(new Rule(this, $el), index, true);
};

/**
 * Deletes a specific Node
 * @param {Node} node
 */
Group.prototype.removeNode = function(node) {
    var index = this.getNodePos(node);
    if (index !== -1) {
        node.parent = null;
        this.rules.splice(index, 1);
    }
};

/**
 * Returns the position of a child Node
 * @param {Node} node
 * @returns {int}
 */
Group.prototype.getNodePos = function(node) {
    return this.rules.indexOf(node);
};

/**
 * @callback Model#GroupIteratee
 * @param {Node} node
 * @returns {boolean} stop the iteration
 */

/**
 * Iterate over all Nodes
 * @param {boolean} [reverse=false] - iterate in reverse order, required if you delete nodes
 * @param {Model#GroupIteratee} cbRule - callback for Rules (can be `null` but not omitted)
 * @param {Model#GroupIteratee} [cbGroup] - callback for Groups
 * @param {object} [context] - context for callbacks
 * @returns {boolean} if the iteration has been stopped by a callback
 */
Group.prototype.each = function(reverse, cbRule, cbGroup, context) {
    if (typeof reverse !== 'boolean' && typeof reverse !== 'string') {
        context = cbGroup;
        cbGroup = cbRule;
        cbRule = reverse;
        reverse = false;
    }
    context = context === undefined ? null : context;

    var i = reverse ? this.rules.length - 1 : 0;
    var l = reverse ? 0 : this.rules.length - 1;
    var c = reverse ? -1 : 1;
    var next = function() {
        return reverse ? i >= l : i <= l;
    };
    var stop = false;

    for (; next(); i += c) {
        if (this.rules[i] instanceof Group) {
            if (!!cbGroup) {
                stop = cbGroup.call(context, this.rules[i]) === false;
            }
        }
        else if (!!cbRule) {
            stop = cbRule.call(context, this.rules[i]) === false;
        }

        if (stop) {
            break;
        }
    }

    return !stop;
};

/**
 * Checks if the group contains a particular Node
 * @param {Node} node
 * @param {boolean} [recursive=false]
 * @returns {boolean}
 */
Group.prototype.contains = function(node, recursive) {
    if (this.getNodePos(node) !== -1) {
        return true;
    }
    else if (!recursive) {
        return false;
    }
    else {
        // the loop will return with false as soon as the Node is found
        return !this.each(function() {
            return true;
        }, function(group) {
            return !group.contains(node, true);
        });
    }
};


/**
 * Rule object
 * @constructor
 * @extends Node
 * @param {Group} parent
 * @param {jQuery} $el
 */
var Rule = function(parent, $el) {
    if (!(this instanceof Rule)) {
        return new Rule(parent, $el);
    }

    Node.call(this, parent, $el);

    this._updating_value = false;
    this._updating_input = false;

    /**
     * @name filter
     * @member {QueryBuilder.Filter}
     * @memberof Rule
     * @instance
     */
    this.__.filter = null;

    /**
     * @name operator
     * @member {QueryBuilder.Operator}
     * @memberof Rule
     * @instance
     */
    this.__.operator = null;

    /**
     * @name value
     * @member {*}
     * @memberof Rule
     * @instance
     */
    this.__.value = undefined;
};

Rule.prototype = Object.create(Node.prototype);
Rule.prototype.constructor = Rule;

Utils.defineModelProperties(Rule, ['filter', 'operator', 'value']);

/**
 * Checks if this Node is the root
 * @returns {boolean} always false
 */
Rule.prototype.isRoot = function() {
    return false;
};


/**
 * @member {function}
 * @memberof QueryBuilder
 * @see Group
 */
QueryBuilder.Group = Group;

/**
 * @member {function}
 * @memberof QueryBuilder
 * @see Rule
 */
QueryBuilder.Rule = Rule;


/**
 * The {@link http://learn.jquery.com/plugins/|jQuery Plugins} namespace
 * @external "jQuery.fn"
 */

/**
 * Instanciates or accesses the {@link QueryBuilder} on an element
 * @function
 * @memberof external:"jQuery.fn"
 * @param {*} option - initial configuration or method name
 * @param {...*} args - method arguments
 *
 * @example
 * $('#builder').queryBuilder({ /** configuration object *\/ });
 * @example
 * $('#builder').queryBuilder('methodName', methodParam1, methodParam2);
 */
$.fn.queryBuilder = function(option) {
    if (this.length === 0) {
        Utils.error('Config', 'No target defined');
    }
    if (this.length > 1) {
        Utils.error('Config', 'Unable to initialize on multiple target');
    }

    var data = this.data('queryBuilder');
    var options = (typeof option == 'object' && option) || {};

    if (!data && option == 'destroy') {
        return this;
    }
    if (!data) {
        var builder = new QueryBuilder(this, options);
        this.data('queryBuilder', builder);
        builder.init(options.rules);
    }
    if (typeof option == 'string') {
        return data[option].apply(data, Array.prototype.slice.call(arguments, 1));
    }

    return this;
};

/**
 * @function
 * @memberof external:"jQuery.fn"
 * @see QueryBuilder
 */
$.fn.queryBuilder.constructor = QueryBuilder;

/**
 * @function
 * @memberof external:"jQuery.fn"
 * @see QueryBuilder.defaults
 */
$.fn.queryBuilder.defaults = QueryBuilder.defaults;

/**
 * @function
 * @memberof external:"jQuery.fn"
 * @see QueryBuilder.defaults
 */
$.fn.queryBuilder.extend = QueryBuilder.extend;

/**
 * @function
 * @memberof external:"jQuery.fn"
 * @see QueryBuilder.define
 */
$.fn.queryBuilder.define = QueryBuilder.define;

/**
 * @function
 * @memberof external:"jQuery.fn"
 * @see QueryBuilder.regional
 */
$.fn.queryBuilder.regional = QueryBuilder.regional;


/**
 * @class BtCheckbox
 * @memberof module:plugins
 * @description Applies Awesome Bootstrap Checkbox for checkbox and radio inputs.
 * @param {object} [options]
 * @param {string} [options.font='glyphicons']
 * @param {string} [options.color='default']
 */
QueryBuilder.define('bt-checkbox', function(options) {
    if (options.font == 'glyphicons') {
        this.$el.addClass('bt-checkbox-glyphicons');
    }

    this.on('getRuleInput.filter', function(h, rule, name) {
        var filter = rule.filter;

        if ((filter.input === 'radio' || filter.input === 'checkbox') && !filter.plugin) {
            h.value = '';

            if (!filter.colors) {
                filter.colors = {};
            }
            if (filter.color) {
                filter.colors._def_ = filter.color;
            }

            var style = filter.vertical ? ' style="display:block"' : '';
            var i = 0;

            Utils.iterateOptions(filter.values, function(key, val) {
                var color = filter.colors[key] || filter.colors._def_ || options.color;
                var id = name + '_' + (i++);

                h.value+= '\
<div' + style + ' class="' + filter.input + ' ' + filter.input + '-' + color + '"> \
  <input type="' + filter.input + '" name="' + name + '" id="' + id + '" value="' + key + '"> \
  <label for="' + id + '">' + val + '</label> \
</div>';
            });
        }
    });
}, {
    font: 'glyphicons',
    color: 'default'
});


/**
 * @class BtSelectpicker
 * @memberof module:plugins
 * @descriptioon Applies Bootstrap Select on filters and operators combo-boxes.
 * @param {object} [options]
 * @param {string} [options.container='body']
 * @param {string} [options.style='btn-inverse btn-xs']
 * @param {int|string} [options.width='auto']
 * @param {boolean} [options.showIcon=false]
 * @throws MissingLibraryError
 */
QueryBuilder.define('bt-selectpicker', function(options) {
    if (!$.fn.selectpicker || !$.fn.selectpicker.Constructor) {
        Utils.error('MissingLibrary', 'Bootstrap Select is required to use "bt-selectpicker" plugin. Get it here: http://silviomoreto.github.io/bootstrap-select');
    }

    var Selectors = QueryBuilder.selectors;

    // init selectpicker
    this.on('afterCreateRuleFilters', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).removeClass('form-control').selectpicker(options);
    });

    this.on('afterCreateRuleOperators', function(e, rule) {
        rule.$el.find(Selectors.rule_operator).removeClass('form-control').selectpicker(options);
    });

    // update selectpicker on change
    this.on('afterUpdateRuleFilter', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).selectpicker('render');
    });

    this.on('afterUpdateRuleOperator', function(e, rule) {
        rule.$el.find(Selectors.rule_operator).selectpicker('render');
    });

    this.on('beforeDeleteRule', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).selectpicker('destroy');
        rule.$el.find(Selectors.rule_operator).selectpicker('destroy');
    });
}, {
    container: 'body',
    style: 'btn-inverse btn-xs',
    width: 'auto',
    showIcon: false
});


/**
 * @class BtTooltipErrors
 * @memberof module:plugins
 * @description Applies Bootstrap Tooltips on validation error messages.
 * @param {object} [options]
 * @param {string} [options.placement='right']
 * @throws MissingLibraryError
 */
QueryBuilder.define('bt-tooltip-errors', function(options) {
    if (!$.fn.tooltip || !$.fn.tooltip.Constructor || !$.fn.tooltip.Constructor.prototype.fixTitle) {
        Utils.error('MissingLibrary', 'Bootstrap Tooltip is required to use "bt-tooltip-errors" plugin. Get it here: http://getbootstrap.com');
    }

    var self = this;

    // add BT Tooltip data
    this.on('getRuleTemplate.filter getGroupTemplate.filter', function(h) {
        var $h = $(h.value);
        $h.find(QueryBuilder.selectors.error_container).attr('data-toggle', 'tooltip');
        h.value = $h.prop('outerHTML');
    });

    // init/refresh tooltip when title changes
    this.model.on('update', function(e, node, field) {
        if (field == 'error' && self.settings.display_errors) {
            node.$el.find(QueryBuilder.selectors.error_container).eq(0)
                .tooltip(options)
                .tooltip('hide')
                .tooltip('fixTitle');
        }
    });
}, {
    placement: 'right'
});


/**
 * @class ChangeFilters
 * @memberof module:plugins
 * @description Allows to change available filters after plugin initialization.
 */

QueryBuilder.extend(/** @lends module:plugins.ChangeFilters.prototype */ {
    /**
     * Change the filters of the builder
     * @param {boolean} [deleteOrphans=false] - delete rules using old filters
     * @param {QueryBuilder[]} filters
     * @fires module:plugins.ChangeFilters.changer:setFilters
     * @fires module:plugins.ChangeFilters.afterSetFilters
     * @throws ChangeFilterError
     */
    setFilters: function(deleteOrphans, filters) {
        var self = this;

        if (filters === undefined) {
            filters = deleteOrphans;
            deleteOrphans = false;
        }

        filters = this.checkFilters(filters);

        /**
         * Modifies the filters before {@link module:plugins.ChangeFilters.setFilters} method
         * @event changer:setFilters
         * @memberof module:plugins.ChangeFilters
         * @param {QueryBuilder.Filter[]} filters
         * @returns {QueryBuilder.Filter[]}
         */
        filters = this.change('setFilters', filters);

        var filtersIds = filters.map(function(filter) {
            return filter.id;
        });

        // check for orphans
        if (!deleteOrphans) {
            (function checkOrphans(node) {
                node.each(
                    function(rule) {
                        if (rule.filter && filtersIds.indexOf(rule.filter.id) === -1) {
                            Utils.error('ChangeFilter', 'A rule is using filter "{0}"', rule.filter.id);
                        }
                    },
                    checkOrphans
                );
            }(this.model.root));
        }

        // replace filters
        this.filters = filters;

        // apply on existing DOM
        (function updateBuilder(node) {
            node.each(true,
                function(rule) {
                    if (rule.filter && filtersIds.indexOf(rule.filter.id) === -1) {
                        rule.drop();

                        self.trigger('rulesChanged');
                    }
                    else {
                        self.createRuleFilters(rule);

                        rule.$el.find(QueryBuilder.selectors.rule_filter).val(rule.filter ? rule.filter.id : '-1');
                        self.trigger('afterUpdateRuleFilter', rule);
                    }
                },
                updateBuilder
            );
        }(this.model.root));

        // update plugins
        if (this.settings.plugins) {
            if (this.settings.plugins['unique-filter']) {
                this.updateDisabledFilters();
            }
            if (this.settings.plugins['bt-selectpicker']) {
                this.$el.find(QueryBuilder.selectors.rule_filter).selectpicker('render');
            }
        }

        // reset the default_filter if does not exist anymore
        if (this.settings.default_filter) {
            try {
                this.getFilterById(this.settings.default_filter);
            }
            catch (e) {
                this.settings.default_filter = null;
            }
        }

        /**
         * After {@link module:plugins.ChangeFilters.setFilters} method
         * @event afterSetFilters
         * @memberof module:plugins.ChangeFilters
         * @param {QueryBuilder.Filter[]} filters
         */
        this.trigger('afterSetFilters', filters);
    },

    /**
     * Adds a new filter to the builder
     * @param {QueryBuilder.Filter|Filter[]} newFilters
     * @param {int|string} [position=#end] - index or '#start' or '#end'
     * @fires module:plugins.ChangeFilters.changer:setFilters
     * @fires module:plugins.ChangeFilters.afterSetFilters
     * @throws ChangeFilterError
     */
    addFilter: function(newFilters, position) {
        if (position === undefined || position == '#end') {
            position = this.filters.length;
        }
        else if (position == '#start') {
            position = 0;
        }

        if (!$.isArray(newFilters)) {
            newFilters = [newFilters];
        }

        var filters = $.extend(true, [], this.filters);

        // numeric position
        if (parseInt(position) == position) {
            Array.prototype.splice.apply(filters, [position, 0].concat(newFilters));
        }
        else {
            // after filter by its id
            if (this.filters.some(function(filter, index) {
                    if (filter.id == position) {
                        position = index + 1;
                        return true;
                    }
                })
            ) {
                Array.prototype.splice.apply(filters, [position, 0].concat(newFilters));
            }
            // defaults to end of list
            else {
                Array.prototype.push.apply(filters, newFilters);
            }
        }

        this.setFilters(filters);
    },

    /**
     * Removes a filter from the builder
     * @param {string|string[]} filterIds
     * @param {boolean} [deleteOrphans=false] delete rules using old filters
     * @fires module:plugins.ChangeFilters.changer:setFilters
     * @fires module:plugins.ChangeFilters.afterSetFilters
     * @throws ChangeFilterError
     */
    removeFilter: function(filterIds, deleteOrphans) {
        var filters = $.extend(true, [], this.filters);
        if (typeof filterIds === 'string') {
            filterIds = [filterIds];
        }

        filters = filters.filter(function(filter) {
            return filterIds.indexOf(filter.id) === -1;
        });

        this.setFilters(deleteOrphans, filters);
    }
});


/**
 * @class ChosenSelectpicker
 * @memberof module:plugins
 * @descriptioon Applies chosen-js Select on filters and operators combo-boxes.
 * @param {object} [options] Supports all the options for chosen
 * @throws MissingLibraryError
 */
QueryBuilder.define('chosen-selectpicker', function(options) {

    if (!$.fn.chosen) {
        Utils.error('MissingLibrary', 'chosen is required to use "chosen-selectpicker" plugin. Get it here: https://github.com/harvesthq/chosen');
    }

    if (this.settings.plugins['bt-selectpicker']) {
        Utils.error('Conflict', 'bt-selectpicker is already selected as the dropdown plugin. Please remove chosen-selectpicker from the plugin list');
    }

    var Selectors = QueryBuilder.selectors;

    // init selectpicker
    this.on('afterCreateRuleFilters', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).removeClass('form-control').chosen(options);
    });

    this.on('afterCreateRuleOperators', function(e, rule) {
        rule.$el.find(Selectors.rule_operator).removeClass('form-control').chosen(options);
    });

    // update selectpicker on change
    this.on('afterUpdateRuleFilter', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).trigger('chosen:updated');
    });

    this.on('afterUpdateRuleOperator', function(e, rule) {
        rule.$el.find(Selectors.rule_operator).trigger('chosen:updated');
    });

    this.on('beforeDeleteRule', function(e, rule) {
        rule.$el.find(Selectors.rule_filter).chosen('destroy');
        rule.$el.find(Selectors.rule_operator).chosen('destroy');
    });
});


/**
 * @class FilterDescription
 * @memberof module:plugins
 * @description Provides three ways to display a description about a filter: inline, Bootsrap Popover or Bootbox.
 * @param {object} [options]
 * @param {string} [options.icon='glyphicon glyphicon-info-sign']
 * @param {string} [options.mode='popover'] - inline, popover or bootbox
 * @throws ConfigError
 */
QueryBuilder.define('filter-description', function(options) {
    // INLINE
    if (options.mode === 'inline') {
        this.on('afterUpdateRuleFilter afterUpdateRuleOperator', function(e, rule) {
            var $p = rule.$el.find('p.filter-description');
            var description = e.builder.getFilterDescription(rule.filter, rule);

            if (!description) {
                $p.hide();
            }
            else {
                if ($p.length === 0) {
                    $p = $('<p class="filter-description"></p>');
                    $p.appendTo(rule.$el);
                }
                else {
                    $p.css('display', '');
                }

                $p.html('<i class="' + options.icon + '"></i> ' + description);
            }
        });
    }
    // POPOVER
    else if (options.mode === 'popover') {
        if (!$.fn.popover || !$.fn.popover.Constructor || !$.fn.popover.Constructor.prototype.fixTitle) {
            Utils.error('MissingLibrary', 'Bootstrap Popover is required to use "filter-description" plugin. Get it here: http://getbootstrap.com');
        }

        this.on('afterUpdateRuleFilter afterUpdateRuleOperator', function(e, rule) {
            var $b = rule.$el.find('button.filter-description');
            var description = e.builder.getFilterDescription(rule.filter, rule);

            if (!description) {
                $b.hide();

                if ($b.data('bs.popover')) {
                    $b.popover('hide');
                }
            }
            else {
                if ($b.length === 0) {
                    $b = $('<button type="button" class="btn btn-xs btn-info filter-description" data-toggle="popover"><i class="' + options.icon + '"></i></button>');
                    $b.prependTo(rule.$el.find(QueryBuilder.selectors.rule_actions));

                    $b.popover({
                        placement: 'left',
                        container: 'body',
                        html: true
                    });

                    $b.on('mouseout', function() {
                        $b.popover('hide');
                    });
                }
                else {
                    $b.css('display', '');
                }

                $b.data('bs.popover').options.content = description;

                if ($b.attr('aria-describedby')) {
                    $b.popover('show');
                }
            }
        });
    }
    // BOOTBOX
    else if (options.mode === 'bootbox') {
        if (!('bootbox' in window)) {
            Utils.error('MissingLibrary', 'Bootbox is required to use "filter-description" plugin. Get it here: http://bootboxjs.com');
        }

        this.on('afterUpdateRuleFilter afterUpdateRuleOperator', function(e, rule) {
            var $b = rule.$el.find('button.filter-description');
            var description = e.builder.getFilterDescription(rule.filter, rule);

            if (!description) {
                $b.hide();
            }
            else {
                if ($b.length === 0) {
                    $b = $('<button type="button" class="btn btn-xs btn-info filter-description" data-toggle="bootbox"><i class="' + options.icon + '"></i></button>');
                    $b.prependTo(rule.$el.find(QueryBuilder.selectors.rule_actions));

                    $b.on('click', function() {
                        bootbox.alert($b.data('description'));
                    });
                }
                else {
                    $b.css('display', '');
                }

                $b.data('description', description);
            }
        });
    }
}, {
    icon: 'icon-info',
    mode: 'popover'
});

QueryBuilder.extend(/** @lends module:plugins.FilterDescription.prototype */ {
    /**
     * Returns the description of a filter for a particular rule (if present)
     * @param {object} filter
     * @param {Rule} [rule]
     * @returns {string}
     * @private
     */
    getFilterDescription: function(filter, rule) {
        if (!filter) {
            return undefined;
        }
        else if (typeof filter.description == 'function') {
            return filter.description.call(this, rule);
        }
        else {
            return filter.description;
        }
    }
});


/**
 * @class Invert
 * @memberof module:plugins
 * @description Allows to invert a rule operator, a group condition or the entire builder.
 * @param {object} [options]
 * @param {string} [options.icon='glyphicon glyphicon-random']
 * @param {boolean} [options.recursive=true]
 * @param {boolean} [options.invert_rules=true]
 * @param {boolean} [options.display_rules_button=false]
 * @param {boolean} [options.silent_fail=false]
 */
QueryBuilder.define('invert', function(options) {
    var self = this;
    var Selectors = QueryBuilder.selectors;

    // Bind events
    this.on('afterInit', function() {
        self.$el.on('click.queryBuilder', '[data-invert=group]', function() {
            var $group = $(this).closest(Selectors.group_container);
            self.invert(self.getModel($group), options);
        });

        if (options.display_rules_button && options.invert_rules) {
            self.$el.on('click.queryBuilder', '[data-invert=rule]', function() {
                var $rule = $(this).closest(Selectors.rule_container);
                self.invert(self.getModel($rule), options);
            });
        }
    });

    // Modify templates
    if (!options.disable_template) {
        this.on('getGroupTemplate.filter', function(h) {
            var $h = $(h.value);
            $h.find(Selectors.condition_container).after(
                '<button type="button" class="btn btn-xs btn-default" data-invert="group">' +
                '<i class="' + options.icon + '"></i> ' + self.translate('invert') +
                '</button>'
            );
            h.value = $h.prop('outerHTML');
        });

        if (options.display_rules_button && options.invert_rules) {
            this.on('getRuleTemplate.filter', function(h) {
                var $h = $(h.value);
                $h.find(Selectors.rule_actions).prepend(
                    '<button type="button" class="btn btn-xs btn-default" data-invert="rule">' +
                    '<i class="' + options.icon + '"></i> ' + self.translate('invert') +
                    '</button>'
                );
                h.value = $h.prop('outerHTML');
            });
        }
    }
}, {
    icon: 'glyphicon glyphicon-random',
    recursive: true,
    invert_rules: true,
    display_rules_button: false,
    silent_fail: false,
    disable_template: false
});

QueryBuilder.defaults({
    operatorOpposites: {
        'equal':            'not_equal',
        'not_equal':        'equal',
        'in':               'not_in',
        'not_in':           'in',
        'less':             'greater_or_equal',
        'less_or_equal':    'greater',
        'greater':          'less_or_equal',
        'greater_or_equal': 'less',
        'between':          'not_between',
        'not_between':      'between',
        'begins_with':      'not_begins_with',
        'not_begins_with':  'begins_with',
        'contains':         'not_contains',
        'not_contains':     'contains',
        'ends_with':        'not_ends_with',
        'not_ends_with':    'ends_with',
        'is_empty':         'is_not_empty',
        'is_not_empty':     'is_empty',
        'is_null':          'is_not_null',
        'is_not_null':      'is_null'
    },

    conditionOpposites: {
        'AND': 'OR',
        'OR': 'AND'
    }
});

QueryBuilder.extend(/** @lends module:plugins.Invert.prototype */ {
    /**
     * Invert a Group, a Rule or the whole builder
     * @param {Node} [node]
     * @param {object} [options] {@link module:plugins.Invert}
     * @fires module:plugins.Invert.afterInvert
     * @throws InvertConditionError, InvertOperatorError
     */
    invert: function(node, options) {
        if (!(node instanceof Node)) {
            if (!this.model.root) return;
            options = node;
            node = this.model.root;
        }

        if (typeof options != 'object') options = {};
        if (options.recursive === undefined) options.recursive = true;
        if (options.invert_rules === undefined) options.invert_rules = true;
        if (options.silent_fail === undefined) options.silent_fail = false;
        if (options.trigger === undefined) options.trigger = true;

        if (node instanceof Group) {
            // invert group condition
            if (this.settings.conditionOpposites[node.condition]) {
                node.condition = this.settings.conditionOpposites[node.condition];
            }
            else if (!options.silent_fail) {
                Utils.error('InvertCondition', 'Unknown inverse of condition "{0}"', node.condition);
            }

            // recursive call
            if (options.recursive) {
                var tempOpts = $.extend({}, options, { trigger: false });
                node.each(function(rule) {
                    if (options.invert_rules) {
                        this.invert(rule, tempOpts);
                    }
                }, function(group) {
                    this.invert(group, tempOpts);
                }, this);
            }
        }
        else if (node instanceof Rule) {
            if (node.operator && !node.filter.no_invert) {
                // invert rule operator
                if (this.settings.operatorOpposites[node.operator.type]) {
                    var invert = this.settings.operatorOpposites[node.operator.type];
                    // check if the invert is "authorized"
                    if (!node.filter.operators || node.filter.operators.indexOf(invert) != -1) {
                        node.operator = this.getOperatorByType(invert);
                    }
                }
                else if (!options.silent_fail) {
                    Utils.error('InvertOperator', 'Unknown inverse of operator "{0}"', node.operator.type);
                }
            }
        }

        if (options.trigger) {
            /**
             * After {@link module:plugins.Invert.invert} method
             * @event afterInvert
             * @memberof module:plugins.Invert
             * @param {Node} node - the main group or rule that has been modified
             * @param {object} options
             */
            this.trigger('afterInvert', node, options);

            this.trigger('rulesChanged');
        }
    }
});


/**
 * @class MongoDbSupport
 * @memberof module:plugins
 * @description Allows to export rules as a MongoDB find object as well as populating the builder from a MongoDB object.
 */

QueryBuilder.defaults({
    mongoOperators: {
        // @formatter:off
        equal:            function(v) { return v[0]; },
        not_equal:        function(v) { return { '$ne': v[0] }; },
        in:               function(v) { return { '$in': v }; },
        not_in:           function(v) { return { '$nin': v }; },
        less:             function(v) { return { '$lt': v[0] }; },
        less_or_equal:    function(v) { return { '$lte': v[0] }; },
        greater:          function(v) { return { '$gt': v[0] }; },
        greater_or_equal: function(v) { return { '$gte': v[0] }; },
        between:          function(v) { return { '$gte': v[0], '$lte': v[1] }; },
        not_between:      function(v) { return { '$lt': v[0], '$gt': v[1] }; },
        begins_with:      function(v) { return { '$regex': '^' + Utils.escapeRegExp(v[0]) }; },
        not_begins_with:  function(v) { return { '$regex': '^(?!' + Utils.escapeRegExp(v[0]) + ')' }; },
        contains:         function(v) { return { '$regex': Utils.escapeRegExp(v[0]) }; },
        not_contains:     function(v) { return { '$regex': '^((?!' + Utils.escapeRegExp(v[0]) + ').)*$', '$options': 's' }; },
        ends_with:        function(v) { return { '$regex': Utils.escapeRegExp(v[0]) + '$' }; },
        not_ends_with:    function(v) { return { '$regex': '(?<!' + Utils.escapeRegExp(v[0]) + ')$' }; },
        is_empty:         function(v) { return ''; },
        is_not_empty:     function(v) { return { '$ne': '' }; },
        is_null:          function(v) { return null; },
        is_not_null:      function(v) { return { '$ne': null }; }
        // @formatter:on
    },

    mongoRuleOperators: {
        $eq: function(v) {
            return {
                'val': v,
                'op': v === null ? 'is_null' : (v === '' ? 'is_empty' : 'equal')
            };
        },
        $ne: function(v) {
            v = v.$ne;
            return {
                'val': v,
                'op': v === null ? 'is_not_null' : (v === '' ? 'is_not_empty' : 'not_equal')
            };
        },
        $regex: function(v) {
            v = v.$regex;
            if (v.slice(0, 4) == '^(?!' && v.slice(-1) == ')') {
                return { 'val': v.slice(4, -1), 'op': 'not_begins_with' };
            }
            else if (v.slice(0, 5) == '^((?!' && v.slice(-5) == ').)*$') {
                return { 'val': v.slice(5, -5), 'op': 'not_contains' };
            }
            else if (v.slice(0, 4) == '(?<!' && v.slice(-2) == ')$') {
                return { 'val': v.slice(4, -2), 'op': 'not_ends_with' };
            }
            else if (v.slice(-1) == '$') {
                return { 'val': v.slice(0, -1), 'op': 'ends_with' };
            }
            else if (v.slice(0, 1) == '^') {
                return { 'val': v.slice(1), 'op': 'begins_with' };
            }
            else {
                return { 'val': v, 'op': 'contains' };
            }
        },
        between: function(v) {
            return { 'val': [v.$gte, v.$lte], 'op': 'between' };
        },
        not_between: function(v) {
            return { 'val': [v.$lt, v.$gt], 'op': 'not_between' };
        },
        $in: function(v) {
            return { 'val': v.$in, 'op': 'in' };
        },
        $nin: function(v) {
            return { 'val': v.$nin, 'op': 'not_in' };
        },
        $lt: function(v) {
            return { 'val': v.$lt, 'op': 'less' };
        },
        $lte: function(v) {
            return { 'val': v.$lte, 'op': 'less_or_equal' };
        },
        $gt: function(v) {
            return { 'val': v.$gt, 'op': 'greater' };
        },
        $gte: function(v) {
            return { 'val': v.$gte, 'op': 'greater_or_equal' };
        }
    }
});

QueryBuilder.extend(/** @lends module:plugins.MongoDbSupport.prototype */ {
    /**
     * Returns rules as a MongoDB query
     * @param {object} [data] - current rules by default
     * @returns {object}
     * @fires module:plugins.MongoDbSupport.changer:getMongoDBField
     * @fires module:plugins.MongoDbSupport.changer:ruleToMongo
     * @fires module:plugins.MongoDbSupport.changer:groupToMongo
     * @throws UndefinedMongoConditionError, UndefinedMongoOperatorError
     */
    getMongo: function(data) {
        data = (data === undefined) ? this.getRules() : data;

        if (!data) {
            return null;
        }

        var self = this;

        return (function parse(group) {
            if (!group.condition) {
                group.condition = self.settings.default_condition;
            }
            if (['AND', 'OR'].indexOf(group.condition.toUpperCase()) === -1) {
                Utils.error('UndefinedMongoCondition', 'Unable to build MongoDB query with condition "{0}"', group.condition);
            }

            if (!group.rules) {
                return {};
            }

            var parts = [];

            group.rules.forEach(function(rule) {
                if (rule.rules && rule.rules.length > 0) {
                    parts.push(parse(rule));
                }
                else {
                    var mdb = self.settings.mongoOperators[rule.operator];
                    var ope = self.getOperatorByType(rule.operator);

                    if (mdb === undefined) {
                        Utils.error('UndefinedMongoOperator', 'Unknown MongoDB operation for operator "{0}"', rule.operator);
                    }

                    if (ope.nb_inputs !== 0) {
                        if (!(rule.value instanceof Array)) {
                            rule.value = [rule.value];
                        }
                    }

                    /**
                     * Modifies the MongoDB field used by a rule
                     * @event changer:getMongoDBField
                     * @memberof module:plugins.MongoDbSupport
                     * @param {string} field
                     * @param {Rule} rule
                     * @returns {string}
                     */
                    var field = self.change('getMongoDBField', rule.field, rule);

                    var ruleExpression = {};
                    ruleExpression[field] = mdb.call(self, rule.value);

                    /**
                     * Modifies the MongoDB expression generated for a rul
                     * @event changer:ruleToMongo
                     * @memberof module:plugins.MongoDbSupport
                     * @param {object} expression
                     * @param {Rule} rule
                     * @param {*} value
                     * @param {function} valueWrapper - function that takes the value and adds the operator
                     * @returns {object}
                     */
                    parts.push(self.change('ruleToMongo', ruleExpression, rule, rule.value, mdb));
                }
            });

            var groupExpression = {};
            groupExpression['$' + group.condition.toLowerCase()] = parts;

            /**
             * Modifies the MongoDB expression generated for a group
             * @event changer:groupToMongo
             * @memberof module:plugins.MongoDbSupport
             * @param {object} expression
             * @param {Group} group
             * @returns {object}
             */
            return self.change('groupToMongo', groupExpression, group);
        }(data));
    },

    /**
     * Converts a MongoDB query to rules
     * @param {object} query
     * @returns {object}
     * @fires module:plugins.MongoDbSupport.changer:parseMongoNode
     * @fires module:plugins.MongoDbSupport.changer:getMongoDBFieldID
     * @fires module:plugins.MongoDbSupport.changer:mongoToRule
     * @fires module:plugins.MongoDbSupport.changer:mongoToGroup
     * @throws MongoParseError, UndefinedMongoConditionError, UndefinedMongoOperatorError
     */
    getRulesFromMongo: function(query) {
        if (query === undefined || query === null) {
            return null;
        }

        var self = this;

        /**
         * Custom parsing of a MongoDB expression, you can return a sub-part of the expression, or a well formed group or rule JSON
         * @event changer:parseMongoNode
         * @memberof module:plugins.MongoDbSupport
         * @param {object} expression
         * @returns {object} expression, rule or group
         */
        query = self.change('parseMongoNode', query);

        // a plugin returned a group
        if ('rules' in query && 'condition' in query) {
            return query;
        }

        // a plugin returned a rule
        if ('id' in query && 'operator' in query && 'value' in query) {
            return {
                condition: this.settings.default_condition,
                rules: [query]
            };
        }

        var key = self.getMongoCondition(query);
        if (!key) {
            Utils.error('MongoParse', 'Invalid MongoDB query format');
        }

        return (function parse(data, topKey) {
            var rules = data[topKey];
            var parts = [];

            rules.forEach(function(data) {
                // allow plugins to manually parse or handle special cases
                data = self.change('parseMongoNode', data);

                // a plugin returned a group
                if ('rules' in data && 'condition' in data) {
                    parts.push(data);
                    return;
                }

                // a plugin returned a rule
                if ('id' in data && 'operator' in data && 'value' in data) {
                    parts.push(data);
                    return;
                }

                var key = self.getMongoCondition(data);
                if (key) {
                    parts.push(parse(data, key));
                }
                else {
                    var field = Object.keys(data)[0];
                    var value = data[field];

                    var operator = self.getMongoOperator(value);
                    if (operator === undefined) {
                        Utils.error('MongoParse', 'Invalid MongoDB query format');
                    }

                    var mdbrl = self.settings.mongoRuleOperators[operator];
                    if (mdbrl === undefined) {
                        Utils.error('UndefinedMongoOperator', 'JSON Rule operation unknown for operator "{0}"', operator);
                    }

                    var opVal = mdbrl.call(self, value);

                    var id = self.getMongoDBFieldID(field, value);

                    /**
                     * Modifies the rule generated from the MongoDB expression
                     * @event changer:mongoToRule
                     * @memberof module:plugins.MongoDbSupport
                     * @param {object} rule
                     * @param {object} expression
                     * @returns {object}
                     */
                    var rule = self.change('mongoToRule', {
                        id: id,
                        field: field,
                        operator: opVal.op,
                        value: opVal.val
                    }, data);

                    parts.push(rule);
                }
            });

            /**
             * Modifies the group generated from the MongoDB expression
             * @event changer:mongoToGroup
             * @memberof module:plugins.MongoDbSupport
             * @param {object} group
             * @param {object} expression
             * @returns {object}
             */
            return self.change('mongoToGroup', {
                condition: topKey.replace('$', '').toUpperCase(),
                rules: parts
            }, data);
        }(query, key));
    },

    /**
     * Sets rules a from MongoDB query
     * @see module:plugins.MongoDbSupport.getRulesFromMongo
     */
    setRulesFromMongo: function(query) {
        this.setRules(this.getRulesFromMongo(query));
    },

    /**
     * Returns a filter identifier from the MongoDB field.
     * Automatically use the only one filter with a matching field, fires a changer otherwise.
     * @param {string} field
     * @param {*} value
     * @fires module:plugins.MongoDbSupport:changer:getMongoDBFieldID
     * @returns {string}
     * @private
     */
    getMongoDBFieldID: function(field, value) {
        var matchingFilters = this.filters.filter(function(filter) {
            return filter.field === field;
        });

        var id;
        if (matchingFilters.length === 1) {
            id = matchingFilters[0].id;
        }
        else {
            /**
             * Returns a filter identifier from the MongoDB field
             * @event changer:getMongoDBFieldID
             * @memberof module:plugins.MongoDbSupport
             * @param {string} field
             * @param {*} value
             * @returns {string}
             */
            id = this.change('getMongoDBFieldID', field, value);
        }

        return id;
    },

    /**
     * Finds which operator is used in a MongoDB sub-object
     * @param {*} data
     * @returns {string|undefined}
     * @private
     */
    getMongoOperator: function(data) {
        if (data !== null && typeof data === 'object') {
            if (data.$gte !== undefined && data.$lte !== undefined) {
                return 'between';
            }
            if (data.$lt !== undefined && data.$gt !== undefined) {
                return 'not_between';
            }

            var knownKeys = Object.keys(data).filter(function(key) {
                return !!this.settings.mongoRuleOperators[key];
            }.bind(this));

            if (knownKeys.length === 1) {
                return knownKeys[0];
            }
        }
        else {
            return '$eq';
        }
    },


    /**
     * Returns the key corresponding to "$or" or "$and"
     * @param {object} data
     * @returns {string|undefined}
     * @private
     */
    getMongoCondition: function(data) {
        var keys = Object.keys(data);

        for (var i = 0, l = keys.length; i < l; i++) {
            if (keys[i].toLowerCase() === '$or' || keys[i].toLowerCase() === '$and') {
                return keys[i];
            }
        }
    }
});


/**
 * @class NotGroup
 * @memberof module:plugins
 * @description Adds a "Not" checkbox in front of group conditions.
 * @param {object} [options]
 * @param {string} [options.icon_checked='glyphicon glyphicon-checked']
 * @param {string} [options.icon_unchecked='glyphicon glyphicon-unchecked']
 */
QueryBuilder.define('not-group', function(options) {
    var self = this;

    // Bind events
    this.on('afterInit', function() {
        self.$el.on('click.queryBuilder', '[data-not=group]', function() {
            var $group = $(this).closest(QueryBuilder.selectors.group_container);
            var group = self.getModel($group);
            group.not = !group.not;
        });

        self.model.on('update', function(e, node, field) {
            if (node instanceof Group && field === 'not') {
                self.updateGroupNot(node);
            }
        });
    });

    // Init "not" property
    this.on('afterAddGroup', function(e, group) {
        group.__.not = false;
    });

    // Modify templates
    if (!options.disable_template) {
        this.on('getGroupTemplate.filter', function(h) {
            var $h = $(h.value);
            $h.find(QueryBuilder.selectors.condition_container).prepend(
                '<button type="button" class="btn btn-xs btn-default" data-not="group">' +
                '<i class="' + options.icon_unchecked + '"></i> ' + self.translate('NOT') +
                '</button>'
            );
            h.value = $h.prop('outerHTML');
        });
    }

    // Export "not" to JSON
    this.on('groupToJson.filter', function(e, group) {
        e.value.not = group.not;
    });

    // Read "not" from JSON
    this.on('jsonToGroup.filter', function(e, json) {
        e.value.not = !!json.not;
    });

    // Export "not" to SQL
    this.on('groupToSQL.filter', function(e, group) {
        if (group.not) {
            e.value = 'NOT ( ' + e.value + ' )';
        }
    });

    // Parse "NOT" function from sqlparser
    this.on('parseSQLNode.filter', function(e) {
        if (e.value.name && e.value.name.toUpperCase() == 'NOT') {
            e.value = e.value.arguments.value[0];

            // if the there is no sub-group, create one
            if (['AND', 'OR'].indexOf(e.value.operation.toUpperCase()) === -1) {
                e.value = new SQLParser.nodes.Op(
                    self.settings.default_condition,
                    e.value,
                    null
                );
            }

            e.value.not = true;
        }
    });

    // Request to create sub-group if the "not" flag is set
    this.on('sqlGroupsDistinct.filter', function(e, group, data, i) {
        if (data.not && i > 0) {
            e.value = true;
        }
    });

    // Read "not" from parsed SQL
    this.on('sqlToGroup.filter', function(e, data) {
        e.value.not = !!data.not;
    });

    // Export "not" to Mongo
    this.on('groupToMongo.filter', function(e, group) {
        var key = '$' + group.condition.toLowerCase();
        if (group.not && e.value[key]) {
            e.value = { '$nor': [e.value] };
        }
    });

    // Parse "$nor" operator from Mongo
    this.on('parseMongoNode.filter', function(e) {
        var keys = Object.keys(e.value);

        if (keys[0] == '$nor') {
            e.value = e.value[keys[0]][0];
            e.value.not = true;
        }
    });

    // Read "not" from parsed Mongo
    this.on('mongoToGroup.filter', function(e, data) {
        e.value.not = !!data.not;
    });
}, {
    icon_unchecked: 'glyphicon glyphicon-unchecked',
    icon_checked: 'glyphicon glyphicon-check',
    disable_template: false
});

/**
 * From {@link module:plugins.NotGroup}
 * @name not
 * @member {boolean}
 * @memberof Group
 * @instance
 */
Utils.defineModelProperties(Group, ['not']);

QueryBuilder.selectors.group_not = QueryBuilder.selectors.group_header + ' [data-not=group]';

QueryBuilder.extend(/** @lends module:plugins.NotGroup.prototype */ {
    /**
     * Performs actions when a group's not changes
     * @param {Group} group
     * @fires module:plugins.NotGroup.afterUpdateGroupNot
     * @private
     */
    updateGroupNot: function(group) {
        var options = this.plugins['not-group'];
        group.$el.find('>' + QueryBuilder.selectors.group_not)
            .toggleClass('active', group.not)
            .find('i').attr('class', group.not ? options.icon_checked : options.icon_unchecked);

        /**
         * After the group's not flag has been modified
         * @event afterUpdateGroupNot
         * @memberof module:plugins.NotGroup
         * @param {Group} group
         */
        this.trigger('afterUpdateGroupNot', group);

        this.trigger('rulesChanged');
    }
});


/**
 * @class Sortable
 * @memberof module:plugins
 * @description Enables drag & drop sort of rules.
 * @param {object} [options]
 * @param {boolean} [options.inherit_no_drop=true]
 * @param {boolean} [options.inherit_no_sortable=true]
 * @param {string} [options.icon='glyphicon glyphicon-sort']
 * @throws MissingLibraryError, ConfigError
 */
QueryBuilder.define('sortable', function(options) {
    if (!('interact' in window)) {
        Utils.error('MissingLibrary', 'interact.js is required to use "sortable" plugin. Get it here: http://interactjs.io');
    }

    if (options.default_no_sortable !== undefined) {
        Utils.error(false, 'Config', 'Sortable plugin : "default_no_sortable" options is deprecated, use standard "default_rule_flags" and "default_group_flags" instead');
        this.settings.default_rule_flags.no_sortable = this.settings.default_group_flags.no_sortable = options.default_no_sortable;
    }

    // recompute drop-zones during drag (when a rule is hidden)
    interact.dynamicDrop(true);

    // set move threshold to 10px
    interact.pointerMoveTolerance(10);

    var placeholder;
    var ghost;
    var src;
    var moved;

    // Init drag and drop
    this.on('afterAddRule afterAddGroup', function(e, node) {
        if (node == placeholder) {
            return;
        }

        var self = e.builder;

        // Inherit flags
        if (options.inherit_no_sortable && node.parent && node.parent.flags.no_sortable) {
            node.flags.no_sortable = true;
        }
        if (options.inherit_no_drop && node.parent && node.parent.flags.no_drop) {
            node.flags.no_drop = true;
        }

        // Configure drag
        if (!node.flags.no_sortable) {
            interact(node.$el[0])
                .draggable({
                    allowFrom: QueryBuilder.selectors.drag_handle,
                    onstart: function(event) {
                        moved = false;

                        // get model of dragged element
                        src = self.getModel(event.target);

                        // create ghost
                        ghost = src.$el.clone()
                            .appendTo(src.$el.parent())
                            .width(src.$el.outerWidth())
                            .addClass('dragging');

                        // create drop placeholder
                        var ph = $('<div class="rule-placeholder">&nbsp;</div>')
                            .height(src.$el.outerHeight());

                        placeholder = src.parent.addRule(ph, src.getPos());

                        // hide dragged element
                        src.$el.hide();
                    },
                    onmove: function(event) {
                        // make the ghost follow the cursor
                        ghost[0].style.top = event.clientY - 15 + 'px';
                        ghost[0].style.left = event.clientX - 15 + 'px';
                    },
                    onend: function(event) {
                        // starting from Interact 1.3.3, onend is called before ondrop
                        if (event.dropzone) {
                            moveSortableToTarget(src, $(event.relatedTarget), self);
                            moved = true;
                        }

                        // remove ghost
                        ghost.remove();
                        ghost = undefined;

                        // remove placeholder
                        placeholder.drop();
                        placeholder = undefined;

                        // show element
                        src.$el.css('display', '');

                        /**
                         * After a node has been moved with {@link module:plugins.Sortable}
                         * @event afterMove
                         * @memberof module:plugins.Sortable
                         * @param {Node} node
                         */
                        self.trigger('afterMove', src);

                        self.trigger('rulesChanged');
                    }
                });
        }

        if (!node.flags.no_drop) {
            //  Configure drop on groups and rules
            interact(node.$el[0])
                .dropzone({
                    accept: QueryBuilder.selectors.rule_and_group_containers,
                    ondragenter: function(event) {
                        moveSortableToTarget(placeholder, $(event.target), self);
                    },
                    ondrop: function(event) {
                        if (!moved) {
                            moveSortableToTarget(src, $(event.target), self);
                        }
                    }
                });

            // Configure drop on group headers
            if (node instanceof Group) {
                interact(node.$el.find(QueryBuilder.selectors.group_header)[0])
                    .dropzone({
                        accept: QueryBuilder.selectors.rule_and_group_containers,
                        ondragenter: function(event) {
                            moveSortableToTarget(placeholder, $(event.target), self);
                        },
                        ondrop: function(event) {
                            if (!moved) {
                                moveSortableToTarget(src, $(event.target), self);
                            }
                        }
                    });
            }
        }
    });

    // Detach interactables
    this.on('beforeDeleteRule beforeDeleteGroup', function(e, node) {
        if (!e.isDefaultPrevented()) {
            interact(node.$el[0]).unset();

            if (node instanceof Group) {
                interact(node.$el.find(QueryBuilder.selectors.group_header)[0]).unset();
            }
        }
    });

    // Remove drag handle from non-sortable items
    this.on('afterApplyRuleFlags afterApplyGroupFlags', function(e, node) {
        if (node.flags.no_sortable) {
            node.$el.find('.drag-handle').remove();
        }
    });

    // Modify templates
    if (!options.disable_template) {
        this.on('getGroupTemplate.filter', function(h, level) {
            if (level > 1) {
                var $h = $(h.value);
                $h.find(QueryBuilder.selectors.condition_container).after('<div class="drag-handle"><i class="' + options.icon + '"></i></div>');
                h.value = $h.prop('outerHTML');
            }
        });

        this.on('getRuleTemplate.filter', function(h) {
            var $h = $(h.value);
            $h.find(QueryBuilder.selectors.rule_header).after('<div class="drag-handle"><i class="' + options.icon + '"></i></div>');
            h.value = $h.prop('outerHTML');
        });
    }
}, {
    inherit_no_sortable: true,
    inherit_no_drop: true,
    icon: 'glyphicon glyphicon-sort',
    disable_template: false
});

QueryBuilder.selectors.rule_and_group_containers = QueryBuilder.selectors.rule_container + ', ' + QueryBuilder.selectors.group_container;
QueryBuilder.selectors.drag_handle = '.drag-handle';

QueryBuilder.defaults({
    default_rule_flags: {
        no_sortable: false,
        no_drop: false
    },
    default_group_flags: {
        no_sortable: false,
        no_drop: false
    }
});

/**
 * Moves an element (placeholder or actual object) depending on active target
 * @memberof module:plugins.Sortable
 * @param {Node} node
 * @param {jQuery} target
 * @param {QueryBuilder} [builder]
 * @private
 */
function moveSortableToTarget(node, target, builder) {
    var parent, method;
    var Selectors = QueryBuilder.selectors;

    // on rule
    parent = target.closest(Selectors.rule_container);
    if (parent.length) {
        method = 'moveAfter';
    }

    // on group header
    if (!method) {
        parent = target.closest(Selectors.group_header);
        if (parent.length) {
            parent = target.closest(Selectors.group_container);
            method = 'moveAtBegin';
        }
    }

    // on group
    if (!method) {
        parent = target.closest(Selectors.group_container);
        if (parent.length) {
            method = 'moveAtEnd';
        }
    }

    if (method) {
        node[method](builder.getModel(parent));

        // refresh radio value
        if (builder && node instanceof Rule) {
            builder.setRuleInputValue(node, node.value);
        }
    }
}


/**
 * @class SqlSupport
 * @memberof module:plugins
 * @description Allows to export rules as a SQL WHERE statement as well as populating the builder from an SQL query.
 * @param {object} [options]
 * @param {boolean} [options.boolean_as_integer=true] - `true` to convert boolean values to integer in the SQL output
 */
QueryBuilder.define('sql-support', function(options) {

}, {
    boolean_as_integer: true
});

QueryBuilder.defaults({
    // operators for internal -> SQL conversion
    sqlOperators: {
        equal: { op: '= ?' },
        not_equal: { op: '!= ?' },
        in: { op: 'IN(?)', sep: ', ' },
        not_in: { op: 'NOT IN(?)', sep: ', ' },
        less: { op: '< ?' },
        less_or_equal: { op: '<= ?' },
        greater: { op: '> ?' },
        greater_or_equal: { op: '>= ?' },
        between: { op: 'BETWEEN ?', sep: ' AND ' },
        not_between: { op: 'NOT BETWEEN ?', sep: ' AND ' },
        begins_with: { op: 'LIKE(?)', mod: '{0}%' },
        not_begins_with: { op: 'NOT LIKE(?)', mod: '{0}%' },
        contains: { op: 'LIKE(?)', mod: '%{0}%' },
        not_contains: { op: 'NOT LIKE(?)', mod: '%{0}%' },
        ends_with: { op: 'LIKE(?)', mod: '%{0}' },
        not_ends_with: { op: 'NOT LIKE(?)', mod: '%{0}' },
        is_empty: { op: '= \'\'' },
        is_not_empty: { op: '!= \'\'' },
        is_null: { op: 'IS NULL' },
        is_not_null: { op: 'IS NOT NULL' }
    },

    // operators for SQL -> internal conversion
    sqlRuleOperator: {
        '=': function(v) {
            return {
                val: v,
                op: v === '' ? 'is_empty' : 'equal'
            };
        },
        '!=': function(v) {
            return {
                val: v,
                op: v === '' ? 'is_not_empty' : 'not_equal'
            };
        },
        'LIKE': function(v) {
            if (v.slice(0, 1) == '%' && v.slice(-1) == '%') {
                return {
                    val: v.slice(1, -1),
                    op: 'contains'
                };
            }
            else if (v.slice(0, 1) == '%') {
                return {
                    val: v.slice(1),
                    op: 'ends_with'
                };
            }
            else if (v.slice(-1) == '%') {
                return {
                    val: v.slice(0, -1),
                    op: 'begins_with'
                };
            }
            else {
                Utils.error('SQLParse', 'Invalid value for LIKE operator "{0}"', v);
            }
        },
        'NOT LIKE': function(v) {
            if (v.slice(0, 1) == '%' && v.slice(-1) == '%') {
                return {
                    val: v.slice(1, -1),
                    op: 'not_contains'
                };
            }
            else if (v.slice(0, 1) == '%') {
                return {
                    val: v.slice(1),
                    op: 'not_ends_with'
                };
            }
            else if (v.slice(-1) == '%') {
                return {
                    val: v.slice(0, -1),
                    op: 'not_begins_with'
                };
            }
            else {
                Utils.error('SQLParse', 'Invalid value for NOT LIKE operator "{0}"', v);
            }
        },
        'IN': function(v) {
            return { val: v, op: 'in' };
        },
        'NOT IN': function(v) {
            return { val: v, op: 'not_in' };
        },
        '<': function(v) {
            return { val: v, op: 'less' };
        },
        '<=': function(v) {
            return { val: v, op: 'less_or_equal' };
        },
        '>': function(v) {
            return { val: v, op: 'greater' };
        },
        '>=': function(v) {
            return { val: v, op: 'greater_or_equal' };
        },
        'BETWEEN': function(v) {
            return { val: v, op: 'between' };
        },
        'NOT BETWEEN': function(v) {
            return { val: v, op: 'not_between' };
        },
        'IS': function(v) {
            if (v !== null) {
                Utils.error('SQLParse', 'Invalid value for IS operator');
            }
            return { val: null, op: 'is_null' };
        },
        'IS NOT': function(v) {
            if (v !== null) {
                Utils.error('SQLParse', 'Invalid value for IS operator');
            }
            return { val: null, op: 'is_not_null' };
        }
    },

    // statements for internal -> SQL conversion
    sqlStatements: {
        'question_mark': function() {
            var params = [];
            return {
                add: function(rule, value) {
                    params.push(value);
                    return '?';
                },
                run: function() {
                    return params;
                }
            };
        },

        'numbered': function(char) {
            if (!char || char.length > 1) char = '$';
            var index = 0;
            var params = [];
            return {
                add: function(rule, value) {
                    params.push(value);
                    index++;
                    return char + index;
                },
                run: function() {
                    return params;
                }
            };
        },

        'named': function(char) {
            if (!char || char.length > 1) char = ':';
            var indexes = {};
            var params = {};
            return {
                add: function(rule, value) {
                    if (!indexes[rule.field]) indexes[rule.field] = 1;
                    var key = rule.field + '_' + (indexes[rule.field]++);
                    params[key] = value;
                    return char + key;
                },
                run: function() {
                    return params;
                }
            };
        }
    },

    // statements for SQL -> internal conversion
    sqlRuleStatement: {
        'question_mark': function(values) {
            var index = 0;
            return {
                parse: function(v) {
                    return v == '?' ? values[index++] : v;
                },
                esc: function(sql) {
                    return sql.replace(/\?/g, '\'?\'');
                }
            };
        },

        'numbered': function(values, char) {
            if (!char || char.length > 1) char = '$';
            var regex1 = new RegExp('^\\' + char + '[0-9]+$');
            var regex2 = new RegExp('\\' + char + '([0-9]+)', 'g');
            return {
                parse: function(v) {
                    return regex1.test(v) ? values[v.slice(1) - 1] : v;
                },
                esc: function(sql) {
                    return sql.replace(regex2, '\'' + (char == '$' ? '$$' : char) + '$1\'');
                }
            };
        },

        'named': function(values, char) {
            if (!char || char.length > 1) char = ':';
            var regex1 = new RegExp('^\\' + char);
            var regex2 = new RegExp('\\' + char + '(' + Object.keys(values).join('|') + ')', 'g');
            return {
                parse: function(v) {
                    return regex1.test(v) ? values[v.slice(1)] : v;
                },
                esc: function(sql) {
                    return sql.replace(regex2, '\'' + (char == '$' ? '$$' : char) + '$1\'');
                }
            };
        }
    }
});

/**
 * @typedef {object} SqlQuery
 * @memberof module:plugins.SqlSupport
 * @property {string} sql
 * @property {object} params
 */

QueryBuilder.extend(/** @lends module:plugins.SqlSupport.prototype */ {
    /**
     * Returns rules as a SQL query
     * @param {boolean|string} [stmt] - use prepared statements: false, 'question_mark', 'numbered', 'numbered(@)', 'named', 'named(@)'
     * @param {boolean} [nl=false] output with new lines
     * @param {object} [data] - current rules by default
     * @returns {module:plugins.SqlSupport.SqlQuery}
     * @fires module:plugins.SqlSupport.changer:getSQLField
     * @fires module:plugins.SqlSupport.changer:ruleToSQL
     * @fires module:plugins.SqlSupport.changer:groupToSQL
     * @throws UndefinedSQLConditionError, UndefinedSQLOperatorError
     */
    getSQL: function(stmt, nl, data) {

        data = (data === undefined) ? this.getRules() : data;

        if (!data) {
            return null;
        }

        nl = !!nl ? '\n' : ' ';
        var boolean_as_integer = this.getPluginOptions('sql-support', 'boolean_as_integer');

        if (stmt === true) {
            stmt = 'question_mark';
        }
        if (typeof stmt == 'string') {
            var config = getStmtConfig(stmt);
            stmt = this.settings.sqlStatements[config[1]](config[2]);
        }

        var self = this;

        var sql = (function parse(group) {

            if (!group.condition) {
                group.condition = self.settings.default_condition;
            }
            if (['AND', 'OR'].indexOf(group.condition.toUpperCase()) === -1) {
                Utils.error('UndefinedSQLCondition', 'Unable to build SQL query with condition "{0}"', group.condition);
            }

            if (!group.rules) {
                return '';
            }

            var parts = [];
            var my_parts = {};
            group.rules.forEach(function(rule) {
                if (rule.rules && rule.rules.length > 0) {
                    parts.push('(' + nl + parse(rule) + nl + ')' + nl);
                }
                else {
                    var sql = self.settings.sqlOperators[rule.operator];
                    var ope = self.getOperatorByType(rule.operator);
                    var value = '';

                    if (sql === undefined) {
                        Utils.error('UndefinedSQLOperator', 'Unknown SQL operation for operator "{0}"', rule.operator);
                    }

                    if (ope.nb_inputs !== 0) {
                        if (!(rule.value instanceof Array)) {
                            rule.value = [rule.value];
                        }

                        rule.value.forEach(function(v, i) {
                        	
                        	

                            if (i > 0) {
                                value += sql.sep;
                            }

                            if (rule.type == 'boolean' && boolean_as_integer) {
                                v = v ? 1 : 0;
                            }
                            else if (!stmt && rule.type !== 'integer' && rule.type !== 'double' && rule.type !== 'boolean') {
                                v = Utils.escapeString(v);
                            }

                            if (sql.mod) {
                                v = Utils.fmt(sql.mod, v);
                            }


                            if (stmt) {
                                value += stmt.add(rule, v);

                            }
                            else {
                                
                                if(ope.type == 'in' || ope.type == 'not_in'){
                        			var vls = v.split('|');

                        			v = '';
                        			var newarr = [];

                        			for(var jkl in vls){
                        				if(vls[jkl] != undefined && vls[jkl] !=null && vls[jkl] != ''){
                        					var vlss = vls[jkl];
                        					newarr.push(vlss);
                        				}
                        			}
                        			v = newarr.join('\''+','+'\'');
                        		}
                    			if (typeof v == 'string') {
                               		v = '\'' + v + '\'';
                           		}
                                value += v;
                            }
                        });
                    }

                    var sqlFn = function(v) {
                        return sql.op.replace('?', function() {
                            return v;
                        });
                    };

                    /**
                     * Modifies the SQL field used by a rule
                     * @event changer:getSQLField
                     * @memberof module:plugins.SqlSupport
                     * @param {string} field
                     * @param {Rule} rule
                     * @returns {string}
                     */
                      //modified
                    var field = self.change('getSQLField', rule.field, rule);
                    
                    var keys = '\'' + rule.id + '\'';

                    if(rule.my_type == 'custom_fields'){
                    	var ruleExpression = '  ( `key` = '+keys+' AND `value` ' + sqlFn(value)+')';
                    }
                    else{
                    	var ruleExpression = field + ' ' + sqlFn(value);
                    }

                    my_parts[rule.table_name]
                   

                    
                    


                    // console.log('rule',rule);
                    // console.log('ruleExpression',ruleExpression);
                     //modified
                    /**
                     * Modifies the SQL generated for a rule
                     * @event changer:ruleToSQL
                     * @memberof module:plugins.SqlSupport
                     * @param {string} expression
                     * @param {Rule} rule
                     * @param {*} value
                     * @param {function} valueWrapper - function that takes the value and adds the operator
                     * @returns {string}
                     */
                  	if(rule.table_name in my_parts && my_parts[rule.table_name] != ''){
                    	my_parts[rule.table_name].push(self.change('ruleToSQL', ruleExpression, rule, value, sqlFn));
                    }
                    else{
                    	my_parts[rule.table_name] = [];
                    	my_parts[rule.table_name].push(self.change('ruleToSQL', ruleExpression, rule, value, sqlFn));
                    }
                    parts.push(self.change('ruleToSQL', ruleExpression, rule, value, sqlFn));
                }
            });

            var groupExpression = parts.join(' ' + group.condition + nl);

            /**
             * Modifies the SQL generated for a group
             * @event changer:groupToSQL
             * @memberof module:plugins.SqlSupport
             * @param {string} expression
             * @param {Group} group
             * @returns {string}
             */
             var qry =  self.change('groupToSQL', groupExpression, group);
             return {my_parts:my_parts,qry:qry,cond:group.condition};
            return self.change('groupToSQL', groupExpression, group);
        }(data));

        if (stmt) {
            return {
                sql: sql,
                params: stmt.run()
            };
        }
        else {
            return {
                sql: sql
            };
        }
    },

    /**
     * Convert a SQL query to rules
     * @param {string|module:plugins.SqlSupport.SqlQuery} query
     * @param {boolean|string} stmt
     * @returns {object}
     * @fires module:plugins.SqlSupport.changer:parseSQLNode
     * @fires module:plugins.SqlSupport.changer:getSQLFieldID
     * @fires module:plugins.SqlSupport.changer:sqlToRule
     * @fires module:plugins.SqlSupport.changer:sqlToGroup
     * @throws MissingLibraryError, SQLParseError, UndefinedSQLOperatorError
     */
    getRulesFromSQL: function(query, stmt) {
        if (!('SQLParser' in window)) {
            Utils.error('MissingLibrary', 'SQLParser is required to parse SQL queries. Get it here https://github.com/mistic100/sql-parser');
        }

        var self = this;

        if (typeof query == 'string') {
            query = { sql: query };
        }

        if (stmt === true) stmt = 'question_mark';
        if (typeof stmt == 'string') {
            var config = getStmtConfig(stmt);
            stmt = this.settings.sqlRuleStatement[config[1]](query.params, config[2]);
        }

        if (stmt) {
            query.sql = stmt.esc(query.sql);
        }

        if (query.sql.toUpperCase().indexOf('SELECT') !== 0) {
            query.sql = 'SELECT * FROM table WHERE ' + query.sql;
        }

        var parsed = SQLParser.parse(query.sql);

        if (!parsed.where) {
            Utils.error('SQLParse', 'No WHERE clause found');
        }

        /**
         * Custom parsing of an AST node generated by SQLParser, you can return a sub-part of the tree, or a well formed group or rule JSON
         * @event changer:parseSQLNode
         * @memberof module:plugins.SqlSupport
         * @param {object} AST node
         * @returns {object} tree, rule or group
         */
        var data = self.change('parseSQLNode', parsed.where.conditions);

        // a plugin returned a group
        if ('rules' in data && 'condition' in data) {
            return data;
        }

        // a plugin returned a rule
        if ('id' in data && 'operator' in data && 'value' in data) {
            return {
                condition: this.settings.default_condition,
                rules: [data]
            };
        }

        // create root group
        var out = self.change('sqlToGroup', {
            condition: this.settings.default_condition,
            rules: []
        }, data);

        // keep track of current group
        var curr = out;

        (function flatten(data, i) {
            if (data === null) {
                return;
            }

            // allow plugins to manually parse or handle special cases
            data = self.change('parseSQLNode', data);

            // a plugin returned a group
            if ('rules' in data && 'condition' in data) {
                curr.rules.push(data);
                return;
            }

            // a plugin returned a rule
            if ('id' in data && 'operator' in data && 'value' in data) {
                curr.rules.push(data);
                return;
            }

            // data must be a SQL parser node
            if (!('left' in data) || !('right' in data) || !('operation' in data)) {
                Utils.error('SQLParse', 'Unable to parse WHERE clause');
            }

            // it's a node
            if (['AND', 'OR'].indexOf(data.operation.toUpperCase()) !== -1) {
                // create a sub-group if the condition is not the same and it's not the first level

                /**
                 * Given an existing group and an AST node, determines if a sub-group must be created
                 * @event changer:sqlGroupsDistinct
                 * @memberof module:plugins.SqlSupport
                 * @param {boolean} create - true by default if the group condition is different
                 * @param {object} group
                 * @param {object} AST
                 * @param {int} current group level
                 * @returns {boolean}
                 */
                var createGroup = self.change('sqlGroupsDistinct', i > 0 && curr.condition != data.operation.toUpperCase(), curr, data, i);

                if (createGroup) {
                    /**
                     * Modifies the group generated from the SQL expression (this is called before the group is filled with rules)
                     * @event changer:sqlToGroup
                     * @memberof module:plugins.SqlSupport
                     * @param {object} group
                     * @param {object} AST
                     * @returns {object}
                     */
                    var group = self.change('sqlToGroup', {
                        condition: self.settings.default_condition,
                        rules: []
                    }, data);

                    curr.rules.push(group);
                    curr = group;
                }

                curr.condition = data.operation.toUpperCase();
                i++;

                // some magic !
                var next = curr;
                flatten(data.left, i);

                curr = next;
                flatten(data.right, i);
            }
            // it's a leaf
            else {
                if ($.isPlainObject(data.right.value)) {
                    Utils.error('SQLParse', 'Value format not supported for {0}.', data.left.value);
                }

                // convert array
                var value;
                if ($.isArray(data.right.value)) {
                    value = data.right.value.map(function(v) {
                        return v.value;
                    });
                }
                else {
                    value = data.right.value;
                }

                // get actual values
                if (stmt) {
                    if ($.isArray(value)) {
                        value = value.map(stmt.parse);
                    }
                    else {
                        value = stmt.parse(value);
                    }
                }

                // convert operator
                var operator = data.operation.toUpperCase();
                if (operator == '<>') {
                    operator = '!=';
                }

                var sqlrl = self.settings.sqlRuleOperator[operator];
                if (sqlrl === undefined) {
                    Utils.error('UndefinedSQLOperator', 'Invalid SQL operation "{0}".', data.operation);
                }

                var opVal = sqlrl.call(this, value, data.operation);

                // find field name
                var field;
                if ('values' in data.left) {
                    field = data.left.values.join('.');
                }
                else if ('value' in data.left) {
                    field = data.left.value;
                }
                else {
                    Utils.error('SQLParse', 'Cannot find field name in {0}', JSON.stringify(data.left));
                }

                var id = self.getSQLFieldID(field, value);

                /**
                 * Modifies the rule generated from the SQL expression
                 * @event changer:sqlToRule
                 * @memberof module:plugins.SqlSupport
                 * @param {object} rule
                 * @param {object} AST
                 * @returns {object}
                 */
                var rule = self.change('sqlToRule', {
                    id: id,
                    field: field,
                    operator: opVal.op,
                    value: opVal.val
                }, data);

                curr.rules.push(rule);
            }
        }(data, 0));

        return out;
    },

    /**
     * Sets the builder's rules from a SQL query
     * @see module:plugins.SqlSupport.getRulesFromSQL
     */
    setRulesFromSQL: function(query, stmt) {
        this.setRules(this.getRulesFromSQL(query, stmt));
    },

    /**
     * Returns a filter identifier from the SQL field.
     * Automatically use the only one filter with a matching field, fires a changer otherwise.
     * @param {string} field
     * @param {*} value
     * @fires module:plugins.SqlSupport:changer:getSQLFieldID
     * @returns {string}
     * @private
     */
    getSQLFieldID: function(field, value) {
        var matchingFilters = this.filters.filter(function(filter) {
            return filter.field.toLowerCase() === field.toLowerCase();
        });

        var id;
        if (matchingFilters.length === 1) {
            id = matchingFilters[0].id;
        }
        else {
            /**
             * Returns a filter identifier from the SQL field
             * @event changer:getSQLFieldID
             * @memberof module:plugins.SqlSupport
             * @param {string} field
             * @param {*} value
             * @returns {string}
             */
            id = this.change('getSQLFieldID', field, value);
        }

        return id;
    }
});

/**
 * Parses the statement configuration
 * @memberof module:plugins.SqlSupport
 * @param {string} stmt
 * @returns {Array} null, mode, option
 * @private
 */
function getStmtConfig(stmt) {
    var config = stmt.match(/(question_mark|numbered|named)(?:\((.)\))?/);
    if (!config) config = [null, 'question_mark', undefined];
    return config;
}


/**
 * @class UniqueFilter
 * @memberof module:plugins
 * @description Allows to define some filters as "unique": ie which can be used for only one rule, globally or in the same group.
 */
QueryBuilder.define('unique-filter', function() {
    this.status.used_filters = {};

    this.on('afterUpdateRuleFilter', this.updateDisabledFilters);
    this.on('afterDeleteRule', this.updateDisabledFilters);
    this.on('afterCreateRuleFilters', this.applyDisabledFilters);
    this.on('afterReset', this.clearDisabledFilters);
    this.on('afterClear', this.clearDisabledFilters);

    // Ensure that the default filter is not already used if unique
    this.on('getDefaultFilter.filter', function(e, model) {
        var self = e.builder;

        self.updateDisabledFilters();

        if (e.value.id in self.status.used_filters) {
            var found = self.filters.some(function(filter) {
                if (!(filter.id in self.status.used_filters) || self.status.used_filters[filter.id].length > 0 && self.status.used_filters[filter.id].indexOf(model.parent) === -1) {
                    e.value = filter;
                    return true;
                }
            });

            if (!found) {
                Utils.error(false, 'UniqueFilter', 'No more non-unique filters available');
                e.value = undefined;
            }
        }
    });
});

QueryBuilder.extend(/** @lends module:plugins.UniqueFilter.prototype */ {
    /**
     * Updates the list of used filters
     * @param {$.Event} [e]
     * @private
     */
    updateDisabledFilters: function(e) {
        var self = e ? e.builder : this;

        self.status.used_filters = {};

        if (!self.model) {
            return;
        }

        // get used filters
        (function walk(group) {
            group.each(function(rule) {
                if (rule.filter && rule.filter.unique) {
                    if (!self.status.used_filters[rule.filter.id]) {
                        self.status.used_filters[rule.filter.id] = [];
                    }
                    if (rule.filter.unique == 'group') {
                        self.status.used_filters[rule.filter.id].push(rule.parent);
                    }
                }
            }, function(group) {
                walk(group);
            });
        }(self.model.root));

        self.applyDisabledFilters(e);
    },

    /**
     * Clear the list of used filters
     * @param {$.Event} [e]
     * @private
     */
    clearDisabledFilters: function(e) {
        var self = e ? e.builder : this;

        self.status.used_filters = {};

        self.applyDisabledFilters(e);
    },

    /**
     * Disabled filters depending on the list of used ones
     * @param {$.Event} [e]
     * @private
     */
    applyDisabledFilters: function(e) {
        var self = e ? e.builder : this;

        // re-enable everything
        self.$el.find(QueryBuilder.selectors.filter_container + ' option').prop('disabled', false);

        // disable some
        $.each(self.status.used_filters, function(filterId, groups) {
            if (groups.length === 0) {
                self.$el.find(QueryBuilder.selectors.filter_container + ' option[value="' + filterId + '"]:not(:selected)').prop('disabled', true);
            }
            else {
                groups.forEach(function(group) {
                    group.each(function(rule) {
                        rule.$el.find(QueryBuilder.selectors.filter_container + ' option[value="' + filterId + '"]:not(:selected)').prop('disabled', true);
                    });
                });
            }
        });

        // update Selectpicker
        if (self.settings.plugins && self.settings.plugins['bt-selectpicker']) {
            self.$el.find(QueryBuilder.selectors.rule_filter).selectpicker('render');
        }
    }
});


/*!
 * jQuery QueryBuilder 2.5.2
 * Locale: English (en)
 * Author: Damien "Mistic" Sorel, http://www.strangeplanet.fr
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 */

QueryBuilder.regional['en'] = {
  "__locale": "English (en)",
  "__author": "Damien \"Mistic\" Sorel, http://www.strangeplanet.fr",
  "add_rule": "Add rule",
  "add_group": "Add group",
  "delete_rule": "Delete",
  "delete_group": "Delete",
  "conditions": {
    "AND": "AND",
    "OR": "OR"
  },
  "operators": {
    "equal": "equal",
    "not_equal": "not equal",
    "in": "in",
    "not_in": "not in",
    "less": "less",
    "less_or_equal": "less or equal",
    "greater": "greater",
    "greater_or_equal": "greater or equal",
    "between": "between",
    "not_between": "not between",
    "begins_with": "begins with",
    "not_begins_with": "doesn't begin with",
    "contains": "contains",
    "not_contains": "doesn't contain",
    "ends_with": "ends with",
    "not_ends_with": "doesn't end with",
    "is_empty": "is empty",
    "is_not_empty": "is not empty",
    "is_null": "is null",
    "is_not_null": "is not null"
  },
  "errors": {
    "no_filter": "No filter selected",
    "empty_group": "The group is empty",
    "radio_empty": "No value selected",
    "checkbox_empty": "No value selected",
    "select_empty": "No value selected",
    "string_empty": "Empty value",
    "string_exceed_min_length": "Must contain at least {0} characters",
    "string_exceed_max_length": "Must not contain more than {0} characters",
    "string_invalid_format": "Invalid format ({0})",
    "number_nan": "Not a number",
    "number_not_integer": "Not an integer",
    "number_not_double": "Not a real number",
    "number_exceed_min": "Must be greater than {0}",
    "number_exceed_max": "Must be lower than {0}",
    "number_wrong_step": "Must be a multiple of {0}",
    "number_between_invalid": "Invalid values, {0} is greater than {1}",
    "datetime_empty": "Empty value",
    "datetime_invalid": "Invalid date format ({0})",
    "datetime_exceed_min": "Must be after {0}",
    "datetime_exceed_max": "Must be before {0}",
    "datetime_between_invalid": "Invalid values, {0} is greater than {1}",
    "boolean_not_valid": "Not a boolean",
    "operator_not_multiple": "Operator \"{1}\" cannot accept multiple values"
  },
  "invert": "Invert",
  "NOT": "NOT"
};

QueryBuilder.defaults({ lang_code: 'en' });
return QueryBuilder;

}));

