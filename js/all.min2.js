/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
(function(){var n,t=200,r="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",e="Expected a function",u="__lodash_hash_undefined__",i=500,o="__lodash_placeholder__",f=1,a=2,c=4,l=1,s=2,h=1,p=2,v=4,_=8,g=16,y=32,d=64,b=128,w=256,m=512,x=30,j="...",A=800,k=16,O=1,I=2,R=1/0,z=9007199254740991,E=1.7976931348623157e308,S=NaN,W=4294967295,L=W-1,C=W>>>1,U=[["ary",b],["bind",h],["bindKey",p],["curry",_],["curryRight",g],["flip",m],["partial",y],["partialRight",d],["rearg",w]],B="[object Arguments]",T="[object Array]",$="[object AsyncFunction]",D="[object Boolean]",M="[object Date]",F="[object DOMException]",N="[object Error]",P="[object Function]",q="[object GeneratorFunction]",Z="[object Map]",K="[object Number]",V="[object Null]",G="[object Object]",H="[object Promise]",J="[object Proxy]",Y="[object RegExp]",Q="[object Set]",X="[object String]",nn="[object Symbol]",tn="[object Undefined]",rn="[object WeakMap]",en="[object WeakSet]",un="[object ArrayBuffer]",on="[object DataView]",fn="[object Float32Array]",an="[object Float64Array]",cn="[object Int8Array]",ln="[object Int16Array]",sn="[object Int32Array]",hn="[object Uint8Array]",pn="[object Uint8ClampedArray]",vn="[object Uint16Array]",_n="[object Uint32Array]",gn=/\b__p \+= '';/g,yn=/\b(__p \+=) '' \+/g,dn=/(__e\(.*?\)|\b__t\)) \+\n'';/g,bn=/&(?:amp|lt|gt|quot|#39);/g,wn=/[&<>"']/g,mn=RegExp(bn.source),xn=RegExp(wn.source),jn=/<%-([\s\S]+?)%>/g,An=/<%([\s\S]+?)%>/g,kn=/<%=([\s\S]+?)%>/g,On=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,In=/^\w*$/,Rn=/^\./,zn=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,En=/[\\^$.*+?()[\]{}|]/g,Sn=RegExp(En.source),Wn=/^\s+|\s+$/g,Ln=/^\s+/,Cn=/\s+$/,Un=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,Bn=/\{\n\/\* \[wrapped with (.+)\] \*/,Tn=/,? & /,$n=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Dn=/\\(\\)?/g,Mn=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Fn=/\w*$/,Nn=/^[-+]0x[0-9a-f]+$/i,Pn=/^0b[01]+$/i,qn=/^\[object .+?Constructor\]$/,Zn=/^0o[0-7]+$/i,Kn=/^(?:0|[1-9]\d*)$/,Vn=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Gn=/($^)/,Hn=/['\n\r\u2028\u2029\\]/g,Jn="\\ud800-\\udfff",Yn="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",Qn="\\u2700-\\u27bf",Xn="a-z\\xdf-\\xf6\\xf8-\\xff",nt="A-Z\\xc0-\\xd6\\xd8-\\xde",tt="\\ufe0e\\ufe0f",rt="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",et="['’]",ut="["+Jn+"]",it="["+rt+"]",ot="["+Yn+"]",ft="\\d+",at="["+Qn+"]",ct="["+Xn+"]",lt="[^"+Jn+rt+ft+Qn+Xn+nt+"]",st="\\ud83c[\\udffb-\\udfff]",ht="[^"+Jn+"]",pt="(?:\\ud83c[\\udde6-\\uddff]){2}",vt="[\\ud800-\\udbff][\\udc00-\\udfff]",_t="["+nt+"]",gt="\\u200d",yt="(?:"+ct+"|"+lt+")",dt="(?:"+_t+"|"+lt+")",bt="(?:['’](?:d|ll|m|re|s|t|ve))?",wt="(?:['’](?:D|LL|M|RE|S|T|VE))?",mt="(?:"+ot+"|"+st+")"+"?",xt="["+tt+"]?",jt=xt+mt+("(?:"+gt+"(?:"+[ht,pt,vt].join("|")+")"+xt+mt+")*"),At="(?:"+[at,pt,vt].join("|")+")"+jt,kt="(?:"+[ht+ot+"?",ot,pt,vt,ut].join("|")+")",Ot=RegExp(et,"g"),It=RegExp(ot,"g"),Rt=RegExp(st+"(?="+st+")|"+kt+jt,"g"),zt=RegExp([_t+"?"+ct+"+"+bt+"(?="+[it,_t,"$"].join("|")+")",dt+"+"+wt+"(?="+[it,_t+yt,"$"].join("|")+")",_t+"?"+yt+"+"+bt,_t+"+"+wt,"\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)","\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)",ft,At].join("|"),"g"),Et=RegExp("["+gt+Jn+Yn+tt+"]"),St=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Wt=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Lt=-1,Ct={};Ct[fn]=Ct[an]=Ct[cn]=Ct[ln]=Ct[sn]=Ct[hn]=Ct[pn]=Ct[vn]=Ct[_n]=!0,Ct[B]=Ct[T]=Ct[un]=Ct[D]=Ct[on]=Ct[M]=Ct[N]=Ct[P]=Ct[Z]=Ct[K]=Ct[G]=Ct[Y]=Ct[Q]=Ct[X]=Ct[rn]=!1;var Ut={};Ut[B]=Ut[T]=Ut[un]=Ut[on]=Ut[D]=Ut[M]=Ut[fn]=Ut[an]=Ut[cn]=Ut[ln]=Ut[sn]=Ut[Z]=Ut[K]=Ut[G]=Ut[Y]=Ut[Q]=Ut[X]=Ut[nn]=Ut[hn]=Ut[pn]=Ut[vn]=Ut[_n]=!0,Ut[N]=Ut[P]=Ut[rn]=!1;var Bt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Tt=parseFloat,$t=parseInt,Dt="object"==typeof global&&global&&global.Object===Object&&global,Mt="object"==typeof self&&self&&self.Object===Object&&self,Ft=Dt||Mt||Function("return this")(),Nt="object"==typeof exports&&exports&&!exports.nodeType&&exports,Pt=Nt&&"object"==typeof module&&module&&!module.nodeType&&module,qt=Pt&&Pt.exports===Nt,Zt=qt&&Dt.process,Kt=function(){try{return Zt&&Zt.binding&&Zt.binding("util")}catch(n){}}(),Vt=Kt&&Kt.isArrayBuffer,Gt=Kt&&Kt.isDate,Ht=Kt&&Kt.isMap,Jt=Kt&&Kt.isRegExp,Yt=Kt&&Kt.isSet,Qt=Kt&&Kt.isTypedArray;function Xt(n,t){return n.set(t[0],t[1]),n}function nr(n,t){return n.add(t),n}function tr(n,t,r){switch(r.length){case 0:return n.call(t);case 1:return n.call(t,r[0]);case 2:return n.call(t,r[0],r[1]);case 3:return n.call(t,r[0],r[1],r[2])}return n.apply(t,r)}function rr(n,t,r,e){for(var u=-1,i=null==n?0:n.length;++u<i;){var o=n[u];t(e,o,r(o),n)}return e}function er(n,t){for(var r=-1,e=null==n?0:n.length;++r<e&&!1!==t(n[r],r,n););return n}function ur(n,t){for(var r=null==n?0:n.length;r--&&!1!==t(n[r],r,n););return n}function ir(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(!t(n[r],r,n))return!1;return!0}function or(n,t){for(var r=-1,e=null==n?0:n.length,u=0,i=[];++r<e;){var o=n[r];t(o,r,n)&&(i[u++]=o)}return i}function fr(n,t){return!!(null==n?0:n.length)&&yr(n,t,0)>-1}function ar(n,t,r){for(var e=-1,u=null==n?0:n.length;++e<u;)if(r(t,n[e]))return!0;return!1}function cr(n,t){for(var r=-1,e=null==n?0:n.length,u=Array(e);++r<e;)u[r]=t(n[r],r,n);return u}function lr(n,t){for(var r=-1,e=t.length,u=n.length;++r<e;)n[u+r]=t[r];return n}function sr(n,t,r,e){var u=-1,i=null==n?0:n.length;for(e&&i&&(r=n[++u]);++u<i;)r=t(r,n[u],u,n);return r}function hr(n,t,r,e){var u=null==n?0:n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);return r}function pr(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(t(n[r],r,n))return!0;return!1}var vr=mr("length");function _r(n,t,r){var e;return r(n,function(n,r,u){if(t(n,r,u))return e=r,!1}),e}function gr(n,t,r,e){for(var u=n.length,i=r+(e?1:-1);e?i--:++i<u;)if(t(n[i],i,n))return i;return-1}function yr(n,t,r){return t==t?function(n,t,r){var e=r-1,u=n.length;for(;++e<u;)if(n[e]===t)return e;return-1}(n,t,r):gr(n,br,r)}function dr(n,t,r,e){for(var u=r-1,i=n.length;++u<i;)if(e(n[u],t))return u;return-1}function br(n){return n!=n}function wr(n,t){var r=null==n?0:n.length;return r?Ar(n,t)/r:S}function mr(t){return function(r){return null==r?n:r[t]}}function xr(t){return function(r){return null==t?n:t[r]}}function jr(n,t,r,e,u){return u(n,function(n,u,i){r=e?(e=!1,n):t(r,n,u,i)}),r}function Ar(t,r){for(var e,u=-1,i=t.length;++u<i;){var o=r(t[u]);o!==n&&(e=e===n?o:e+o)}return e}function kr(n,t){for(var r=-1,e=Array(n);++r<n;)e[r]=t(r);return e}function Or(n){return function(t){return n(t)}}function Ir(n,t){return cr(t,function(t){return n[t]})}function Rr(n,t){return n.has(t)}function zr(n,t){for(var r=-1,e=n.length;++r<e&&yr(t,n[r],0)>-1;);return r}function Er(n,t){for(var r=n.length;r--&&yr(t,n[r],0)>-1;);return r}var Sr=xr({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),Wr=xr({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function Lr(n){return"\\"+Bt[n]}function Cr(n){return Et.test(n)}function Ur(n){var t=-1,r=Array(n.size);return n.forEach(function(n,e){r[++t]=[e,n]}),r}function Br(n,t){return function(r){return n(t(r))}}function Tr(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){var f=n[r];f!==t&&f!==o||(n[r]=o,i[u++]=r)}return i}function $r(n){var t=-1,r=Array(n.size);return n.forEach(function(n){r[++t]=n}),r}function Dr(n){return Cr(n)?function(n){var t=Rt.lastIndex=0;for(;Rt.test(n);)++t;return t}(n):vr(n)}function Mr(n){return Cr(n)?n.match(Rt)||[]:n.split("")}var Fr=xr({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"});var Nr=function Jn(Yn){var Qn,Xn=(Yn=null==Yn?Ft:Nr.defaults(Ft.Object(),Yn,Nr.pick(Ft,Wt))).Array,nt=Yn.Date,tt=Yn.Error,rt=Yn.Function,et=Yn.Math,ut=Yn.Object,it=Yn.RegExp,ot=Yn.String,ft=Yn.TypeError,at=Xn.prototype,ct=rt.prototype,lt=ut.prototype,st=Yn["__core-js_shared__"],ht=ct.toString,pt=lt.hasOwnProperty,vt=0,_t=(Qn=/[^.]+$/.exec(st&&st.keys&&st.keys.IE_PROTO||""))?"Symbol(src)_1."+Qn:"",gt=lt.toString,yt=ht.call(ut),dt=Ft._,bt=it("^"+ht.call(pt).replace(En,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),wt=qt?Yn.Buffer:n,mt=Yn.Symbol,xt=Yn.Uint8Array,jt=wt?wt.allocUnsafe:n,At=Br(ut.getPrototypeOf,ut),kt=ut.create,Rt=lt.propertyIsEnumerable,Et=at.splice,Bt=mt?mt.isConcatSpreadable:n,Dt=mt?mt.iterator:n,Mt=mt?mt.toStringTag:n,Nt=function(){try{var n=Di(ut,"defineProperty");return n({},"",{}),n}catch(n){}}(),Pt=Yn.clearTimeout!==Ft.clearTimeout&&Yn.clearTimeout,Zt=nt&&nt.now!==Ft.Date.now&&nt.now,Kt=Yn.setTimeout!==Ft.setTimeout&&Yn.setTimeout,vr=et.ceil,xr=et.floor,Pr=ut.getOwnPropertySymbols,qr=wt?wt.isBuffer:n,Zr=Yn.isFinite,Kr=at.join,Vr=Br(ut.keys,ut),Gr=et.max,Hr=et.min,Jr=nt.now,Yr=Yn.parseInt,Qr=et.random,Xr=at.reverse,ne=Di(Yn,"DataView"),te=Di(Yn,"Map"),re=Di(Yn,"Promise"),ee=Di(Yn,"Set"),ue=Di(Yn,"WeakMap"),ie=Di(ut,"create"),oe=ue&&new ue,fe={},ae=po(ne),ce=po(te),le=po(re),se=po(ee),he=po(ue),pe=mt?mt.prototype:n,ve=pe?pe.valueOf:n,_e=pe?pe.toString:n;function ge(n){if(Wf(n)&&!mf(n)&&!(n instanceof we)){if(n instanceof be)return n;if(pt.call(n,"__wrapped__"))return vo(n)}return new be(n)}var ye=function(){function t(){}return function(r){if(!Sf(r))return{};if(kt)return kt(r);t.prototype=r;var e=new t;return t.prototype=n,e}}();function de(){}function be(t,r){this.__wrapped__=t,this.__actions__=[],this.__chain__=!!r,this.__index__=0,this.__values__=n}function we(n){this.__wrapped__=n,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=W,this.__views__=[]}function me(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function xe(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function je(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function Ae(n){var t=-1,r=null==n?0:n.length;for(this.__data__=new je;++t<r;)this.add(n[t])}function ke(n){var t=this.__data__=new xe(n);this.size=t.size}function Oe(n,t){var r=mf(n),e=!r&&wf(n),u=!r&&!e&&kf(n),i=!r&&!e&&!u&&Mf(n),o=r||e||u||i,f=o?kr(n.length,ot):[],a=f.length;for(var c in n)!t&&!pt.call(n,c)||o&&("length"==c||u&&("offset"==c||"parent"==c)||i&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||Ki(c,a))||f.push(c);return f}function Ie(t){var r=t.length;return r?t[ku(0,r-1)]:n}function Re(n,t){return ao(oi(n),$e(t,0,n.length))}function ze(n){return ao(oi(n))}function Ee(t,r,e,u){return t===n||yf(t,lt[e])&&!pt.call(u,e)?r:t}function Se(t,r,e){(e===n||yf(t[r],e))&&(e!==n||r in t)||Be(t,r,e)}function We(t,r,e){var u=t[r];pt.call(t,r)&&yf(u,e)&&(e!==n||r in t)||Be(t,r,e)}function Le(n,t){for(var r=n.length;r--;)if(yf(n[r][0],t))return r;return-1}function Ce(n,t,r,e){return Pe(n,function(n,u,i){t(e,n,r(n),i)}),e}function Ue(n,t){return n&&fi(t,aa(t),n)}function Be(n,t,r){"__proto__"==t&&Nt?Nt(n,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):n[t]=r}function Te(t,r){for(var e=-1,u=r.length,i=Xn(u),o=null==t;++e<u;)i[e]=o?n:ea(t,r[e]);return i}function $e(t,r,e){return t==t&&(e!==n&&(t=t<=e?t:e),r!==n&&(t=t>=r?t:r)),t}function De(t,r,e,u,i,o){var l,s=r&f,h=r&a,p=r&c;if(e&&(l=i?e(t,u,i,o):e(t)),l!==n)return l;if(!Sf(t))return t;var v,_,g,y,d,b,w,m,x,j=mf(t);if(j){if(w=t,m=w.length,x=w.constructor(m),m&&"string"==typeof w[0]&&pt.call(w,"index")&&(x.index=w.index,x.input=w.input),l=x,!s)return oi(t,l)}else{var A=Ni(t),k=A==P||A==q;if(kf(t))return ni(t,s);if(A==G||A==B||k&&!i){if(l=h||k?{}:qi(t),!s)return h?(g=t,b=t,y=(d=l)&&fi(b,ca(b),d),fi(g,Fi(g),y)):(v=t,_=Ue(l,t),fi(v,Mi(v),_))}else{if(!Ut[A])return i?t:{};l=function(n,t,r,e){var u,i,o,a,c,l,s,h=n.constructor;switch(t){case un:return ti(n);case D:case M:return new h(+n);case on:return l=n,s=e?ti(l.buffer):l.buffer,new l.constructor(s,l.byteOffset,l.byteLength);case fn:case an:case cn:case ln:case sn:case hn:case pn:case vn:case _n:return ri(n,e);case Z:return c=n,sr(e?r(Ur(c),f):Ur(c),Xt,new c.constructor);case K:case X:return new h(n);case Y:return(a=new(o=n).constructor(o.source,Fn.exec(o))).lastIndex=o.lastIndex,a;case Q:return i=n,sr(e?r($r(i),f):$r(i),nr,new i.constructor);case nn:return u=n,ve?ut(ve.call(u)):{}}}(t,A,De,s)}}o||(o=new ke);var O=o.get(t);if(O)return O;o.set(t,l);var I=j?n:(p?h?Wi:Si:h?ca:aa)(t);return er(I||t,function(n,u){I&&(n=t[u=n]),We(l,u,De(n,r,e,u,t,o))}),l}function Me(t,r,e){var u=e.length;if(null==t)return!u;for(t=ut(t);u--;){var i=e[u],o=r[i],f=t[i];if(f===n&&!(i in t)||!o(f))return!1}return!0}function Fe(t,r,u){if("function"!=typeof t)throw new ft(e);return uo(function(){t.apply(n,u)},r)}function Ne(n,r,e,u){var i=-1,o=fr,f=!0,a=n.length,c=[],l=r.length;if(!a)return c;e&&(r=cr(r,Or(e))),u?(o=ar,f=!1):r.length>=t&&(o=Rr,f=!1,r=new Ae(r));n:for(;++i<a;){var s=n[i],h=null==e?s:e(s);if(s=u||0!==s?s:0,f&&h==h){for(var p=l;p--;)if(r[p]===h)continue n;c.push(s)}else o(r,h,u)||c.push(s)}return c}ge.templateSettings={escape:jn,evaluate:An,interpolate:kn,variable:"",imports:{_:ge}},ge.prototype=de.prototype,ge.prototype.constructor=ge,be.prototype=ye(de.prototype),be.prototype.constructor=be,we.prototype=ye(de.prototype),we.prototype.constructor=we,me.prototype.clear=function(){this.__data__=ie?ie(null):{},this.size=0},me.prototype.delete=function(n){var t=this.has(n)&&delete this.__data__[n];return this.size-=t?1:0,t},me.prototype.get=function(t){var r=this.__data__;if(ie){var e=r[t];return e===u?n:e}return pt.call(r,t)?r[t]:n},me.prototype.has=function(t){var r=this.__data__;return ie?r[t]!==n:pt.call(r,t)},me.prototype.set=function(t,r){var e=this.__data__;return this.size+=this.has(t)?0:1,e[t]=ie&&r===n?u:r,this},xe.prototype.clear=function(){this.__data__=[],this.size=0},xe.prototype.delete=function(n){var t=this.__data__,r=Le(t,n);return!(r<0||(r==t.length-1?t.pop():Et.call(t,r,1),--this.size,0))},xe.prototype.get=function(t){var r=this.__data__,e=Le(r,t);return e<0?n:r[e][1]},xe.prototype.has=function(n){return Le(this.__data__,n)>-1},xe.prototype.set=function(n,t){var r=this.__data__,e=Le(r,n);return e<0?(++this.size,r.push([n,t])):r[e][1]=t,this},je.prototype.clear=function(){this.size=0,this.__data__={hash:new me,map:new(te||xe),string:new me}},je.prototype.delete=function(n){var t=Ti(this,n).delete(n);return this.size-=t?1:0,t},je.prototype.get=function(n){return Ti(this,n).get(n)},je.prototype.has=function(n){return Ti(this,n).has(n)},je.prototype.set=function(n,t){var r=Ti(this,n),e=r.size;return r.set(n,t),this.size+=r.size==e?0:1,this},Ae.prototype.add=Ae.prototype.push=function(n){return this.__data__.set(n,u),this},Ae.prototype.has=function(n){return this.__data__.has(n)},ke.prototype.clear=function(){this.__data__=new xe,this.size=0},ke.prototype.delete=function(n){var t=this.__data__,r=t.delete(n);return this.size=t.size,r},ke.prototype.get=function(n){return this.__data__.get(n)},ke.prototype.has=function(n){return this.__data__.has(n)},ke.prototype.set=function(n,r){var e=this.__data__;if(e instanceof xe){var u=e.__data__;if(!te||u.length<t-1)return u.push([n,r]),this.size=++e.size,this;e=this.__data__=new je(u)}return e.set(n,r),this.size=e.size,this};var Pe=li(Ye),qe=li(Qe,!0);function Ze(n,t){var r=!0;return Pe(n,function(n,e,u){return r=!!t(n,e,u)}),r}function Ke(t,r,e){for(var u=-1,i=t.length;++u<i;){var o=t[u],f=r(o);if(null!=f&&(a===n?f==f&&!Df(f):e(f,a)))var a=f,c=o}return c}function Ve(n,t){var r=[];return Pe(n,function(n,e,u){t(n,e,u)&&r.push(n)}),r}function Ge(n,t,r,e,u){var i=-1,o=n.length;for(r||(r=Zi),u||(u=[]);++i<o;){var f=n[i];t>0&&r(f)?t>1?Ge(f,t-1,r,e,u):lr(u,f):e||(u[u.length]=f)}return u}var He=si(),Je=si(!0);function Ye(n,t){return n&&He(n,t,aa)}function Qe(n,t){return n&&Je(n,t,aa)}function Xe(n,t){return or(t,function(t){return Rf(n[t])})}function nu(t,r){for(var e=0,u=(r=Ju(r,t)).length;null!=t&&e<u;)t=t[ho(r[e++])];return e&&e==u?t:n}function tu(n,t,r){var e=t(n);return mf(n)?e:lr(e,r(n))}function ru(t){return null==t?t===n?tn:V:(t=ut(t),Mt&&Mt in t?function(t){var r=pt.call(t,Mt),e=t[Mt];try{t[Mt]=n;var u=!0}catch(n){}var i=gt.call(t);return u&&(r?t[Mt]=e:delete t[Mt]),i}(t):(r=t,gt.call(r)));var r}function eu(n,t){return n>t}function uu(n,t){return null!=n&&pt.call(n,t)}function iu(n,t){return null!=n&&t in ut(n)}function ou(t,r,e){for(var u=e?ar:fr,i=t[0].length,o=t.length,f=o,a=Xn(o),c=1/0,l=[];f--;){var s=t[f];f&&r&&(s=cr(s,Or(r))),c=Hr(s.length,c),a[f]=!e&&(r||i>=120&&s.length>=120)?new Ae(f&&s):n}s=t[0];var h=-1,p=a[0];n:for(;++h<i&&l.length<c;){var v=s[h],_=r?r(v):v;if(v=e||0!==v?v:0,!(p?Rr(p,_):u(l,_,e))){for(f=o;--f;){var g=a[f];if(!(g?Rr(g,_):u(t[f],_,e)))continue n}p&&p.push(_),l.push(v)}}return l}function fu(t,r,e){var u=null==(t=ro(t,r=Ju(r,t)))?t:t[ho(Oo(r))];return null==u?n:tr(u,t,e)}function au(n){return Wf(n)&&ru(n)==B}function cu(t,r,e,u,i){return t===r||(null==t||null==r||!Sf(t)&&!Wf(r)?t!=t&&r!=r:function(t,r,e,u,i,o){var f=mf(t),a=mf(r),c=T,h=T;f||(c=(c=Ni(t))==B?G:c),a||(h=(h=Ni(r))==B?G:h);var p=c==G,v=h==G,_=c==h;if(_&&kf(t)){if(!kf(r))return!1;f=!0,p=!1}if(_&&!p)return o||(o=new ke),f||Mf(t)?zi(t,r,e,u,i,o):function(n,t,r,e,u,i,o){switch(r){case on:if(n.byteLength!=t.byteLength||n.byteOffset!=t.byteOffset)return!1;n=n.buffer,t=t.buffer;case un:return!(n.byteLength!=t.byteLength||!i(new xt(n),new xt(t)));case D:case M:case K:return yf(+n,+t);case N:return n.name==t.name&&n.message==t.message;case Y:case X:return n==t+"";case Z:var f=Ur;case Q:var a=e&l;if(f||(f=$r),n.size!=t.size&&!a)return!1;var c=o.get(n);if(c)return c==t;e|=s,o.set(n,t);var h=zi(f(n),f(t),e,u,i,o);return o.delete(n),h;case nn:if(ve)return ve.call(n)==ve.call(t)}return!1}(t,r,c,e,u,i,o);if(!(e&l)){var g=p&&pt.call(t,"__wrapped__"),y=v&&pt.call(r,"__wrapped__");if(g||y){var d=g?t.value():t,b=y?r.value():r;return o||(o=new ke),i(d,b,e,u,o)}}return!!_&&(o||(o=new ke),function(t,r,e,u,i,o){var f=e&l,a=aa(t),c=a.length,s=aa(r).length;if(c!=s&&!f)return!1;for(var h=c;h--;){var p=a[h];if(!(f?p in r:pt.call(r,p)))return!1}var v=o.get(t);if(v&&o.get(r))return v==r;var _=!0;o.set(t,r),o.set(r,t);for(var g=f;++h<c;){p=a[h];var y=t[p],d=r[p];if(u)var b=f?u(d,y,p,r,t,o):u(y,d,p,t,r,o);if(!(b===n?y===d||i(y,d,e,u,o):b)){_=!1;break}g||(g="constructor"==p)}if(_&&!g){var w=t.constructor,m=r.constructor;w!=m&&"constructor"in t&&"constructor"in r&&!("function"==typeof w&&w instanceof w&&"function"==typeof m&&m instanceof m)&&(_=!1)}return o.delete(t),o.delete(r),_}(t,r,e,u,i,o))}(t,r,e,u,cu,i))}function lu(t,r,e,u){var i=e.length,o=i,f=!u;if(null==t)return!o;for(t=ut(t);i--;){var a=e[i];if(f&&a[2]?a[1]!==t[a[0]]:!(a[0]in t))return!1}for(;++i<o;){var c=(a=e[i])[0],h=t[c],p=a[1];if(f&&a[2]){if(h===n&&!(c in t))return!1}else{var v=new ke;if(u)var _=u(h,p,c,t,r,v);if(!(_===n?cu(p,h,l|s,u,v):_))return!1}}return!0}function su(n){return!(!Sf(n)||_t&&_t in n)&&(Rf(n)?bt:qn).test(po(n))}function hu(n){return"function"==typeof n?n:null==n?Ca:"object"==typeof n?mf(n)?du(n[0],n[1]):yu(n):Pa(n)}function pu(n){if(!Yi(n))return Vr(n);var t=[];for(var r in ut(n))pt.call(n,r)&&"constructor"!=r&&t.push(r);return t}function vu(n){if(!Sf(n))return function(n){var t=[];if(null!=n)for(var r in ut(n))t.push(r);return t}(n);var t=Yi(n),r=[];for(var e in n)("constructor"!=e||!t&&pt.call(n,e))&&r.push(e);return r}function _u(n,t){return n<t}function gu(n,t){var r=-1,e=jf(n)?Xn(n.length):[];return Pe(n,function(n,u,i){e[++r]=t(n,u,i)}),e}function yu(n){var t=$i(n);return 1==t.length&&t[0][2]?Xi(t[0][0],t[0][1]):function(r){return r===n||lu(r,n,t)}}function du(t,r){return Gi(t)&&Qi(r)?Xi(ho(t),r):function(e){var u=ea(e,t);return u===n&&u===r?ua(e,t):cu(r,u,l|s)}}function bu(t,r,e,u,i){t!==r&&He(r,function(o,f){if(Sf(o))i||(i=new ke),function(t,r,e,u,i,o,f){var a=t[e],c=r[e],l=f.get(c);if(l)Se(t,e,l);else{var s=o?o(a,c,e+"",t,r,f):n,h=s===n;if(h){var p=mf(c),v=!p&&kf(c),_=!p&&!v&&Mf(c);s=c,p||v||_?mf(a)?s=a:Af(a)?s=oi(a):v?(h=!1,s=ni(c,!0)):_?(h=!1,s=ri(c,!0)):s=[]:Uf(c)||wf(c)?(s=a,wf(a)?s=Gf(a):(!Sf(a)||u&&Rf(a))&&(s=qi(c))):h=!1}h&&(f.set(c,s),i(s,c,u,o,f),f.delete(c)),Se(t,e,s)}}(t,r,f,e,bu,u,i);else{var a=u?u(t[f],o,f+"",t,r,i):n;a===n&&(a=o),Se(t,f,a)}},ca)}function wu(t,r){var e=t.length;if(e)return Ki(r+=r<0?e:0,e)?t[r]:n}function mu(n,t,r){var e=-1;return t=cr(t.length?t:[Ca],Or(Bi())),function(n,t){var r=n.length;for(n.sort(t);r--;)n[r]=n[r].value;return n}(gu(n,function(n,r,u){return{criteria:cr(t,function(t){return t(n)}),index:++e,value:n}}),function(n,t){return function(n,t,r){for(var e=-1,u=n.criteria,i=t.criteria,o=u.length,f=r.length;++e<o;){var a=ei(u[e],i[e]);if(a){if(e>=f)return a;var c=r[e];return a*("desc"==c?-1:1)}}return n.index-t.index}(n,t,r)})}function xu(n,t,r){for(var e=-1,u=t.length,i={};++e<u;){var o=t[e],f=nu(n,o);r(f,o)&&Eu(i,Ju(o,n),f)}return i}function ju(n,t,r,e){var u=e?dr:yr,i=-1,o=t.length,f=n;for(n===t&&(t=oi(t)),r&&(f=cr(n,Or(r)));++i<o;)for(var a=0,c=t[i],l=r?r(c):c;(a=u(f,l,a,e))>-1;)f!==n&&Et.call(f,a,1),Et.call(n,a,1);return n}function Au(n,t){for(var r=n?t.length:0,e=r-1;r--;){var u=t[r];if(r==e||u!==i){var i=u;Ki(u)?Et.call(n,u,1):Nu(n,u)}}return n}function ku(n,t){return n+xr(Qr()*(t-n+1))}function Ou(n,t){var r="";if(!n||t<1||t>z)return r;do{t%2&&(r+=n),(t=xr(t/2))&&(n+=n)}while(t);return r}function Iu(n,t){return io(to(n,t,Ca),n+"")}function Ru(n){return Ie(ya(n))}function zu(n,t){var r=ya(n);return ao(r,$e(t,0,r.length))}function Eu(t,r,e,u){if(!Sf(t))return t;for(var i=-1,o=(r=Ju(r,t)).length,f=o-1,a=t;null!=a&&++i<o;){var c=ho(r[i]),l=e;if(i!=f){var s=a[c];(l=u?u(s,c,a):n)===n&&(l=Sf(s)?s:Ki(r[i+1])?[]:{})}We(a,c,l),a=a[c]}return t}var Su=oe?function(n,t){return oe.set(n,t),n}:Ca,Wu=Nt?function(n,t){return Nt(n,"toString",{configurable:!0,enumerable:!1,value:Sa(t),writable:!0})}:Ca;function Lu(n){return ao(ya(n))}function Cu(n,t,r){var e=-1,u=n.length;t<0&&(t=-t>u?0:u+t),(r=r>u?u:r)<0&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0;for(var i=Xn(u);++e<u;)i[e]=n[e+t];return i}function Uu(n,t){var r;return Pe(n,function(n,e,u){return!(r=t(n,e,u))}),!!r}function Bu(n,t,r){var e=0,u=null==n?e:n.length;if("number"==typeof t&&t==t&&u<=C){for(;e<u;){var i=e+u>>>1,o=n[i];null!==o&&!Df(o)&&(r?o<=t:o<t)?e=i+1:u=i}return u}return Tu(n,t,Ca,r)}function Tu(t,r,e,u){r=e(r);for(var i=0,o=null==t?0:t.length,f=r!=r,a=null===r,c=Df(r),l=r===n;i<o;){var s=xr((i+o)/2),h=e(t[s]),p=h!==n,v=null===h,_=h==h,g=Df(h);if(f)var y=u||_;else y=l?_&&(u||p):a?_&&p&&(u||!v):c?_&&p&&!v&&(u||!g):!v&&!g&&(u?h<=r:h<r);y?i=s+1:o=s}return Hr(o,L)}function $u(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){var o=n[r],f=t?t(o):o;if(!r||!yf(f,a)){var a=f;i[u++]=0===o?0:o}}return i}function Du(n){return"number"==typeof n?n:Df(n)?S:+n}function Mu(n){if("string"==typeof n)return n;if(mf(n))return cr(n,Mu)+"";if(Df(n))return _e?_e.call(n):"";var t=n+"";return"0"==t&&1/n==-R?"-0":t}function Fu(n,r,e){var u=-1,i=fr,o=n.length,f=!0,a=[],c=a;if(e)f=!1,i=ar;else if(o>=t){var l=r?null:Oi(n);if(l)return $r(l);f=!1,i=Rr,c=new Ae}else c=r?[]:a;n:for(;++u<o;){var s=n[u],h=r?r(s):s;if(s=e||0!==s?s:0,f&&h==h){for(var p=c.length;p--;)if(c[p]===h)continue n;r&&c.push(h),a.push(s)}else i(c,h,e)||(c!==a&&c.push(h),a.push(s))}return a}function Nu(n,t){return null==(n=ro(n,t=Ju(t,n)))||delete n[ho(Oo(t))]}function Pu(n,t,r,e){return Eu(n,t,r(nu(n,t)),e)}function qu(n,t,r,e){for(var u=n.length,i=e?u:-1;(e?i--:++i<u)&&t(n[i],i,n););return r?Cu(n,e?0:i,e?i+1:u):Cu(n,e?i+1:0,e?u:i)}function Zu(n,t){var r=n;return r instanceof we&&(r=r.value()),sr(t,function(n,t){return t.func.apply(t.thisArg,lr([n],t.args))},r)}function Ku(n,t,r){var e=n.length;if(e<2)return e?Fu(n[0]):[];for(var u=-1,i=Xn(e);++u<e;)for(var o=n[u],f=-1;++f<e;)f!=u&&(i[u]=Ne(i[u]||o,n[f],t,r));return Fu(Ge(i,1),t,r)}function Vu(t,r,e){for(var u=-1,i=t.length,o=r.length,f={};++u<i;){var a=u<o?r[u]:n;e(f,t[u],a)}return f}function Gu(n){return Af(n)?n:[]}function Hu(n){return"function"==typeof n?n:Ca}function Ju(n,t){return mf(n)?n:Gi(n,t)?[n]:so(Hf(n))}var Yu=Iu;function Qu(t,r,e){var u=t.length;return e=e===n?u:e,!r&&e>=u?t:Cu(t,r,e)}var Xu=Pt||function(n){return Ft.clearTimeout(n)};function ni(n,t){if(t)return n.slice();var r=n.length,e=jt?jt(r):new n.constructor(r);return n.copy(e),e}function ti(n){var t=new n.constructor(n.byteLength);return new xt(t).set(new xt(n)),t}function ri(n,t){var r=t?ti(n.buffer):n.buffer;return new n.constructor(r,n.byteOffset,n.length)}function ei(t,r){if(t!==r){var e=t!==n,u=null===t,i=t==t,o=Df(t),f=r!==n,a=null===r,c=r==r,l=Df(r);if(!a&&!l&&!o&&t>r||o&&f&&c&&!a&&!l||u&&f&&c||!e&&c||!i)return 1;if(!u&&!o&&!l&&t<r||l&&e&&i&&!u&&!o||a&&e&&i||!f&&i||!c)return-1}return 0}function ui(n,t,r,e){for(var u=-1,i=n.length,o=r.length,f=-1,a=t.length,c=Gr(i-o,0),l=Xn(a+c),s=!e;++f<a;)l[f]=t[f];for(;++u<o;)(s||u<i)&&(l[r[u]]=n[u]);for(;c--;)l[f++]=n[u++];return l}function ii(n,t,r,e){for(var u=-1,i=n.length,o=-1,f=r.length,a=-1,c=t.length,l=Gr(i-f,0),s=Xn(l+c),h=!e;++u<l;)s[u]=n[u];for(var p=u;++a<c;)s[p+a]=t[a];for(;++o<f;)(h||u<i)&&(s[p+r[o]]=n[u++]);return s}function oi(n,t){var r=-1,e=n.length;for(t||(t=Xn(e));++r<e;)t[r]=n[r];return t}function fi(t,r,e,u){var i=!e;e||(e={});for(var o=-1,f=r.length;++o<f;){var a=r[o],c=u?u(e[a],t[a],a,e,t):n;c===n&&(c=t[a]),i?Be(e,a,c):We(e,a,c)}return e}function ai(n,t){return function(r,e){var u=mf(r)?rr:Ce,i=t?t():{};return u(r,n,Bi(e,2),i)}}function ci(t){return Iu(function(r,e){var u=-1,i=e.length,o=i>1?e[i-1]:n,f=i>2?e[2]:n;for(o=t.length>3&&"function"==typeof o?(i--,o):n,f&&Vi(e[0],e[1],f)&&(o=i<3?n:o,i=1),r=ut(r);++u<i;){var a=e[u];a&&t(r,a,u,o)}return r})}function li(n,t){return function(r,e){if(null==r)return r;if(!jf(r))return n(r,e);for(var u=r.length,i=t?u:-1,o=ut(r);(t?i--:++i<u)&&!1!==e(o[i],i,o););return r}}function si(n){return function(t,r,e){for(var u=-1,i=ut(t),o=e(t),f=o.length;f--;){var a=o[n?f:++u];if(!1===r(i[a],a,i))break}return t}}function hi(t){return function(r){var e=Cr(r=Hf(r))?Mr(r):n,u=e?e[0]:r.charAt(0),i=e?Qu(e,1).join(""):r.slice(1);return u[t]()+i}}function pi(n){return function(t){return sr(Ra(wa(t).replace(Ot,"")),n,"")}}function vi(n){return function(){var t=arguments;switch(t.length){case 0:return new n;case 1:return new n(t[0]);case 2:return new n(t[0],t[1]);case 3:return new n(t[0],t[1],t[2]);case 4:return new n(t[0],t[1],t[2],t[3]);case 5:return new n(t[0],t[1],t[2],t[3],t[4]);case 6:return new n(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new n(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var r=ye(n.prototype),e=n.apply(r,t);return Sf(e)?e:r}}function _i(t){return function(r,e,u){var i=ut(r);if(!jf(r)){var o=Bi(e,3);r=aa(r),e=function(n){return o(i[n],n,i)}}var f=t(r,e,u);return f>-1?i[o?r[f]:f]:n}}function gi(r){return Ei(function(u){var i=u.length,o=i,f=be.prototype.thru;for(r&&u.reverse();o--;){var a=u[o];if("function"!=typeof a)throw new ft(e);if(f&&!c&&"wrapper"==Ci(a))var c=new be([],!0)}for(o=c?o:i;++o<i;){var l=Ci(a=u[o]),s="wrapper"==l?Li(a):n;c=s&&Hi(s[0])&&s[1]==(b|_|y|w)&&!s[4].length&&1==s[9]?c[Ci(s[0])].apply(c,s[3]):1==a.length&&Hi(a)?c[l]():c.thru(a)}return function(){var n=arguments,r=n[0];if(c&&1==n.length&&mf(r)&&r.length>=t)return c.plant(r).value();for(var e=0,o=i?u[e].apply(this,n):r;++e<i;)o=u[e].call(this,o);return o}})}function yi(t,r,e,u,i,o,f,a,c,l){var s=r&b,v=r&h,y=r&p,d=r&(_|g),w=r&m,x=y?n:vi(t);return function h(){for(var p=arguments.length,_=Xn(p),g=p;g--;)_[g]=arguments[g];if(d)var b=Ui(h),m=function(n,t){for(var r=n.length,e=0;r--;)n[r]===t&&++e;return e}(_,b);if(u&&(_=ui(_,u,i,d)),o&&(_=ii(_,o,f,d)),p-=m,d&&p<l){var j=Tr(_,b);return Ai(t,r,yi,h.placeholder,e,_,j,a,c,l-p)}var A=v?e:this,k=y?A[t]:t;return p=_.length,a?_=function(t,r){for(var e=t.length,u=Hr(r.length,e),i=oi(t);u--;){var o=r[u];t[u]=Ki(o,e)?i[o]:n}return t}(_,a):w&&p>1&&_.reverse(),s&&c<p&&(_.length=c),this&&this!==Ft&&this instanceof h&&(k=x||vi(k)),k.apply(A,_)}}function di(n,t){return function(r,e){return u=r,i=n,o=t(e),f={},Ye(u,function(n,t,r){i(f,o(n),t,r)}),f;var u,i,o,f}}function bi(t,r){return function(e,u){var i;if(e===n&&u===n)return r;if(e!==n&&(i=e),u!==n){if(i===n)return u;"string"==typeof e||"string"==typeof u?(e=Mu(e),u=Mu(u)):(e=Du(e),u=Du(u)),i=t(e,u)}return i}}function wi(n){return Ei(function(t){return t=cr(t,Or(Bi())),Iu(function(r){var e=this;return n(t,function(n){return tr(n,e,r)})})})}function mi(t,r){var e=(r=r===n?" ":Mu(r)).length;if(e<2)return e?Ou(r,t):r;var u=Ou(r,vr(t/Dr(r)));return Cr(r)?Qu(Mr(u),0,t).join(""):u.slice(0,t)}function xi(t){return function(r,e,u){return u&&"number"!=typeof u&&Vi(r,e,u)&&(e=u=n),r=qf(r),e===n?(e=r,r=0):e=qf(e),function(n,t,r,e){for(var u=-1,i=Gr(vr((t-n)/(r||1)),0),o=Xn(i);i--;)o[e?i:++u]=n,n+=r;return o}(r,e,u=u===n?r<e?1:-1:qf(u),t)}}function ji(n){return function(t,r){return"string"==typeof t&&"string"==typeof r||(t=Vf(t),r=Vf(r)),n(t,r)}}function Ai(t,r,e,u,i,o,f,a,c,l){var s=r&_;r|=s?y:d,(r&=~(s?d:y))&v||(r&=~(h|p));var g=[t,r,i,s?o:n,s?f:n,s?n:o,s?n:f,a,c,l],b=e.apply(n,g);return Hi(t)&&eo(b,g),b.placeholder=u,oo(b,t,r)}function ki(n){var t=et[n];return function(n,r){if(n=Vf(n),r=Hr(Zf(r),292)){var e=(Hf(n)+"e").split("e");return+((e=(Hf(t(e[0]+"e"+(+e[1]+r)))+"e").split("e"))[0]+"e"+(+e[1]-r))}return t(n)}}var Oi=ee&&1/$r(new ee([,-0]))[1]==R?function(n){return new ee(n)}:Da;function Ii(n){return function(t){var r,e,u,i,o=Ni(t);return o==Z?Ur(t):o==Q?(r=t,e=-1,u=Array(r.size),r.forEach(function(n){u[++e]=[n,n]}),u):(i=t,cr(n(t),function(n){return[n,i[n]]}))}}function Ri(t,r,u,i,f,a,c,l){var s=r&p;if(!s&&"function"!=typeof t)throw new ft(e);var m=i?i.length:0;if(m||(r&=~(y|d),i=f=n),c=c===n?c:Gr(Zf(c),0),l=l===n?l:Zf(l),m-=f?f.length:0,r&d){var x=i,j=f;i=f=n}var A,k,O,I,R,z,E,S,W,L,C,U,B,T=s?n:Li(t),$=[t,r,u,i,f,x,j,a,c,l];if(T&&function(n,t){var r=n[1],e=t[1],u=r|e,i=u<(h|p|b),f=e==b&&r==_||e==b&&r==w&&n[7].length<=t[8]||e==(b|w)&&t[7].length<=t[8]&&r==_;if(!i&&!f)return n;e&h&&(n[2]=t[2],u|=r&h?0:v);var a=t[3];if(a){var c=n[3];n[3]=c?ui(c,a,t[4]):a,n[4]=c?Tr(n[3],o):t[4]}(a=t[5])&&(c=n[5],n[5]=c?ii(c,a,t[6]):a,n[6]=c?Tr(n[5],o):t[6]),(a=t[7])&&(n[7]=a),e&b&&(n[8]=null==n[8]?t[8]:Hr(n[8],t[8])),null==n[9]&&(n[9]=t[9]),n[0]=t[0],n[1]=u}($,T),t=$[0],r=$[1],u=$[2],i=$[3],f=$[4],!(l=$[9]=null==$[9]?s?0:t.length:Gr($[9]-m,0))&&r&(_|g)&&(r&=~(_|g)),r&&r!=h)r==_||r==g?(E=r,S=l,W=vi(z=t),D=function t(){for(var r=arguments.length,e=Xn(r),u=r,i=Ui(t);u--;)e[u]=arguments[u];var o=r<3&&e[0]!==i&&e[r-1]!==i?[]:Tr(e,i);return(r-=o.length)<S?Ai(z,E,yi,t.placeholder,n,e,o,n,n,S-r):tr(this&&this!==Ft&&this instanceof t?W:z,this,e)}):r!=y&&r!=(h|y)||f.length?D=yi.apply(n,$):(k=u,O=i,I=r&h,R=vi(A=t),D=function n(){for(var t=-1,r=arguments.length,e=-1,u=O.length,i=Xn(u+r),o=this&&this!==Ft&&this instanceof n?R:A;++e<u;)i[e]=O[e];for(;r--;)i[e++]=arguments[++t];return tr(o,I?k:this,i)});else var D=(C=u,U=r&h,B=vi(L=t),function n(){return(this&&this!==Ft&&this instanceof n?B:L).apply(U?C:this,arguments)});return oo((T?Su:eo)(D,$),t,r)}function zi(t,r,e,u,i,o){var f=e&l,a=t.length,c=r.length;if(a!=c&&!(f&&c>a))return!1;var h=o.get(t);if(h&&o.get(r))return h==r;var p=-1,v=!0,_=e&s?new Ae:n;for(o.set(t,r),o.set(r,t);++p<a;){var g=t[p],y=r[p];if(u)var d=f?u(y,g,p,r,t,o):u(g,y,p,t,r,o);if(d!==n){if(d)continue;v=!1;break}if(_){if(!pr(r,function(n,t){if(!Rr(_,t)&&(g===n||i(g,n,e,u,o)))return _.push(t)})){v=!1;break}}else if(g!==y&&!i(g,y,e,u,o)){v=!1;break}}return o.delete(t),o.delete(r),v}function Ei(t){return io(to(t,n,mo),t+"")}function Si(n){return tu(n,aa,Mi)}function Wi(n){return tu(n,ca,Fi)}var Li=oe?function(n){return oe.get(n)}:Da;function Ci(n){for(var t=n.name+"",r=fe[t],e=pt.call(fe,t)?r.length:0;e--;){var u=r[e],i=u.func;if(null==i||i==n)return u.name}return t}function Ui(n){return(pt.call(ge,"placeholder")?ge:n).placeholder}function Bi(){var n=ge.iteratee||Ua;return n=n===Ua?hu:n,arguments.length?n(arguments[0],arguments[1]):n}function Ti(n,t){var r,e,u=n.__data__;return("string"==(e=typeof(r=t))||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==r:null===r)?u["string"==typeof t?"string":"hash"]:u.map}function $i(n){for(var t=aa(n),r=t.length;r--;){var e=t[r],u=n[e];t[r]=[e,u,Qi(u)]}return t}function Di(t,r){var e,u=null==(e=t)?n:e[r];return su(u)?u:n}var Mi=Pr?Br(Pr,ut):Ka,Fi=Pr?function(n){for(var t=[];n;)lr(t,Mi(n)),n=At(n);return t}:Ka,Ni=ru;function Pi(n,t,r){for(var e=-1,u=(t=Ju(t,n)).length,i=!1;++e<u;){var o=ho(t[e]);if(!(i=null!=n&&r(n,o)))break;n=n[o]}return i||++e!=u?i:!!(u=null==n?0:n.length)&&Ef(u)&&Ki(o,u)&&(mf(n)||wf(n))}function qi(n){return"function"!=typeof n.constructor||Yi(n)?{}:ye(At(n))}function Zi(n){return mf(n)||wf(n)||!!(Bt&&n&&n[Bt])}function Ki(n,t){return!!(t=null==t?z:t)&&("number"==typeof n||Kn.test(n))&&n>-1&&n%1==0&&n<t}function Vi(n,t,r){if(!Sf(r))return!1;var e=typeof t;return!!("number"==e?jf(r)&&Ki(t,r.length):"string"==e&&t in r)&&yf(r[t],n)}function Gi(n,t){if(mf(n))return!1;var r=typeof n;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=n&&!Df(n))||In.test(n)||!On.test(n)||null!=t&&n in ut(t)}function Hi(n){var t=Ci(n),r=ge[t];if("function"!=typeof r||!(t in we.prototype))return!1;if(n===r)return!0;var e=Li(r);return!!e&&n===e[0]}(ne&&Ni(new ne(new ArrayBuffer(1)))!=on||te&&Ni(new te)!=Z||re&&Ni(re.resolve())!=H||ee&&Ni(new ee)!=Q||ue&&Ni(new ue)!=rn)&&(Ni=function(t){var r=ru(t),e=r==G?t.constructor:n,u=e?po(e):"";if(u)switch(u){case ae:return on;case ce:return Z;case le:return H;case se:return Q;case he:return rn}return r});var Ji=st?Rf:Va;function Yi(n){var t=n&&n.constructor;return n===("function"==typeof t&&t.prototype||lt)}function Qi(n){return n==n&&!Sf(n)}function Xi(t,r){return function(e){return null!=e&&e[t]===r&&(r!==n||t in ut(e))}}function no(t,r,e,u,i,o){return Sf(t)&&Sf(r)&&(o.set(r,t),bu(t,r,n,no,o),o.delete(r)),t}function to(t,r,e){return r=Gr(r===n?t.length-1:r,0),function(){for(var n=arguments,u=-1,i=Gr(n.length-r,0),o=Xn(i);++u<i;)o[u]=n[r+u];u=-1;for(var f=Xn(r+1);++u<r;)f[u]=n[u];return f[r]=e(o),tr(t,this,f)}}function ro(n,t){return t.length<2?n:nu(n,Cu(t,0,-1))}var eo=fo(Su),uo=Kt||function(n,t){return Ft.setTimeout(n,t)},io=fo(Wu);function oo(n,t,r){var e,u,i,o=t+"";return io(n,function(n,t){var r=t.length;if(!r)return n;var e=r-1;return t[e]=(r>1?"& ":"")+t[e],t=t.join(r>2?", ":" "),n.replace(Un,"{\n/* [wrapped with "+t+"] */\n")}(o,(i=o.match(Bn),e=i?i[1].split(Tn):[],u=r,er(U,function(n){var t="_."+n[0];u&n[1]&&!fr(e,t)&&e.push(t)}),e.sort())))}function fo(t){var r=0,e=0;return function(){var u=Jr(),i=k-(u-e);if(e=u,i>0){if(++r>=A)return arguments[0]}else r=0;return t.apply(n,arguments)}}function ao(t,r){var e=-1,u=t.length,i=u-1;for(r=r===n?u:r;++e<r;){var o=ku(e,i),f=t[o];t[o]=t[e],t[e]=f}return t.length=r,t}var co,lo,so=(co=sf(function(n){var t=[];return Rn.test(n)&&t.push(""),n.replace(zn,function(n,r,e,u){t.push(e?u.replace(Dn,"$1"):r||n)}),t},function(n){return lo.size===i&&lo.clear(),n}),lo=co.cache,co);function ho(n){if("string"==typeof n||Df(n))return n;var t=n+"";return"0"==t&&1/n==-R?"-0":t}function po(n){if(null!=n){try{return ht.call(n)}catch(n){}try{return n+""}catch(n){}}return""}function vo(n){if(n instanceof we)return n.clone();var t=new be(n.__wrapped__,n.__chain__);return t.__actions__=oi(n.__actions__),t.__index__=n.__index__,t.__values__=n.__values__,t}var _o=Iu(function(n,t){return Af(n)?Ne(n,Ge(t,1,Af,!0)):[]}),go=Iu(function(t,r){var e=Oo(r);return Af(e)&&(e=n),Af(t)?Ne(t,Ge(r,1,Af,!0),Bi(e,2)):[]}),yo=Iu(function(t,r){var e=Oo(r);return Af(e)&&(e=n),Af(t)?Ne(t,Ge(r,1,Af,!0),n,e):[]});function bo(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=null==r?0:Zf(r);return u<0&&(u=Gr(e+u,0)),gr(n,Bi(t,3),u)}function wo(t,r,e){var u=null==t?0:t.length;if(!u)return-1;var i=u-1;return e!==n&&(i=Zf(e),i=e<0?Gr(u+i,0):Hr(i,u-1)),gr(t,Bi(r,3),i,!0)}function mo(n){return null!=n&&n.length?Ge(n,1):[]}function xo(t){return t&&t.length?t[0]:n}var jo=Iu(function(n){var t=cr(n,Gu);return t.length&&t[0]===n[0]?ou(t):[]}),Ao=Iu(function(t){var r=Oo(t),e=cr(t,Gu);return r===Oo(e)?r=n:e.pop(),e.length&&e[0]===t[0]?ou(e,Bi(r,2)):[]}),ko=Iu(function(t){var r=Oo(t),e=cr(t,Gu);return(r="function"==typeof r?r:n)&&e.pop(),e.length&&e[0]===t[0]?ou(e,n,r):[]});function Oo(t){var r=null==t?0:t.length;return r?t[r-1]:n}var Io=Iu(Ro);function Ro(n,t){return n&&n.length&&t&&t.length?ju(n,t):n}var zo=Ei(function(n,t){var r=null==n?0:n.length,e=Te(n,t);return Au(n,cr(t,function(n){return Ki(n,r)?+n:n}).sort(ei)),e});function Eo(n){return null==n?n:Xr.call(n)}var So=Iu(function(n){return Fu(Ge(n,1,Af,!0))}),Wo=Iu(function(t){var r=Oo(t);return Af(r)&&(r=n),Fu(Ge(t,1,Af,!0),Bi(r,2))}),Lo=Iu(function(t){var r=Oo(t);return r="function"==typeof r?r:n,Fu(Ge(t,1,Af,!0),n,r)});function Co(n){if(!n||!n.length)return[];var t=0;return n=or(n,function(n){if(Af(n))return t=Gr(n.length,t),!0}),kr(t,function(t){return cr(n,mr(t))})}function Uo(t,r){if(!t||!t.length)return[];var e=Co(t);return null==r?e:cr(e,function(t){return tr(r,n,t)})}var Bo=Iu(function(n,t){return Af(n)?Ne(n,t):[]}),To=Iu(function(n){return Ku(or(n,Af))}),$o=Iu(function(t){var r=Oo(t);return Af(r)&&(r=n),Ku(or(t,Af),Bi(r,2))}),Do=Iu(function(t){var r=Oo(t);return r="function"==typeof r?r:n,Ku(or(t,Af),n,r)}),Mo=Iu(Co);var Fo=Iu(function(t){var r=t.length,e=r>1?t[r-1]:n;return Uo(t,e="function"==typeof e?(t.pop(),e):n)});function No(n){var t=ge(n);return t.__chain__=!0,t}function Po(n,t){return t(n)}var qo=Ei(function(t){var r=t.length,e=r?t[0]:0,u=this.__wrapped__,i=function(n){return Te(n,t)};return!(r>1||this.__actions__.length)&&u instanceof we&&Ki(e)?((u=u.slice(e,+e+(r?1:0))).__actions__.push({func:Po,args:[i],thisArg:n}),new be(u,this.__chain__).thru(function(t){return r&&!t.length&&t.push(n),t})):this.thru(i)});var Zo=ai(function(n,t,r){pt.call(n,r)?++n[r]:Be(n,r,1)});var Ko=_i(bo),Vo=_i(wo);function Go(n,t){return(mf(n)?er:Pe)(n,Bi(t,3))}function Ho(n,t){return(mf(n)?ur:qe)(n,Bi(t,3))}var Jo=ai(function(n,t,r){pt.call(n,r)?n[r].push(t):Be(n,r,[t])});var Yo=Iu(function(n,t,r){var e=-1,u="function"==typeof t,i=jf(n)?Xn(n.length):[];return Pe(n,function(n){i[++e]=u?tr(t,n,r):fu(n,t,r)}),i}),Qo=ai(function(n,t,r){Be(n,r,t)});function Xo(n,t){return(mf(n)?cr:gu)(n,Bi(t,3))}var nf=ai(function(n,t,r){n[r?0:1].push(t)},function(){return[[],[]]});var tf=Iu(function(n,t){if(null==n)return[];var r=t.length;return r>1&&Vi(n,t[0],t[1])?t=[]:r>2&&Vi(t[0],t[1],t[2])&&(t=[t[0]]),mu(n,Ge(t,1),[])}),rf=Zt||function(){return Ft.Date.now()};function ef(t,r,e){return r=e?n:r,r=t&&null==r?t.length:r,Ri(t,b,n,n,n,n,r)}function uf(t,r){var u;if("function"!=typeof r)throw new ft(e);return t=Zf(t),function(){return--t>0&&(u=r.apply(this,arguments)),t<=1&&(r=n),u}}var of=Iu(function(n,t,r){var e=h;if(r.length){var u=Tr(r,Ui(of));e|=y}return Ri(n,e,t,r,u)}),ff=Iu(function(n,t,r){var e=h|p;if(r.length){var u=Tr(r,Ui(ff));e|=y}return Ri(t,e,n,r,u)});function af(t,r,u){var i,o,f,a,c,l,s=0,h=!1,p=!1,v=!0;if("function"!=typeof t)throw new ft(e);function _(r){var e=i,u=o;return i=o=n,s=r,a=t.apply(u,e)}function g(t){var e=t-l;return l===n||e>=r||e<0||p&&t-s>=f}function y(){var n,t,e=rf();if(g(e))return d(e);c=uo(y,(t=r-((n=e)-l),p?Hr(t,f-(n-s)):t))}function d(t){return c=n,v&&i?_(t):(i=o=n,a)}function b(){var t,e=rf(),u=g(e);if(i=arguments,o=this,l=e,u){if(c===n)return s=t=l,c=uo(y,r),h?_(t):a;if(p)return c=uo(y,r),_(l)}return c===n&&(c=uo(y,r)),a}return r=Vf(r)||0,Sf(u)&&(h=!!u.leading,f=(p="maxWait"in u)?Gr(Vf(u.maxWait)||0,r):f,v="trailing"in u?!!u.trailing:v),b.cancel=function(){c!==n&&Xu(c),s=0,i=l=o=c=n},b.flush=function(){return c===n?a:d(rf())},b}var cf=Iu(function(n,t){return Fe(n,1,t)}),lf=Iu(function(n,t,r){return Fe(n,Vf(t)||0,r)});function sf(n,t){if("function"!=typeof n||null!=t&&"function"!=typeof t)throw new ft(e);var r=function(){var e=arguments,u=t?t.apply(this,e):e[0],i=r.cache;if(i.has(u))return i.get(u);var o=n.apply(this,e);return r.cache=i.set(u,o)||i,o};return r.cache=new(sf.Cache||je),r}function hf(n){if("function"!=typeof n)throw new ft(e);return function(){var t=arguments;switch(t.length){case 0:return!n.call(this);case 1:return!n.call(this,t[0]);case 2:return!n.call(this,t[0],t[1]);case 3:return!n.call(this,t[0],t[1],t[2])}return!n.apply(this,t)}}sf.Cache=je;var pf=Yu(function(n,t){var r=(t=1==t.length&&mf(t[0])?cr(t[0],Or(Bi())):cr(Ge(t,1),Or(Bi()))).length;return Iu(function(e){for(var u=-1,i=Hr(e.length,r);++u<i;)e[u]=t[u].call(this,e[u]);return tr(n,this,e)})}),vf=Iu(function(t,r){var e=Tr(r,Ui(vf));return Ri(t,y,n,r,e)}),_f=Iu(function(t,r){var e=Tr(r,Ui(_f));return Ri(t,d,n,r,e)}),gf=Ei(function(t,r){return Ri(t,w,n,n,n,r)});function yf(n,t){return n===t||n!=n&&t!=t}var df=ji(eu),bf=ji(function(n,t){return n>=t}),wf=au(function(){return arguments}())?au:function(n){return Wf(n)&&pt.call(n,"callee")&&!Rt.call(n,"callee")},mf=Xn.isArray,xf=Vt?Or(Vt):function(n){return Wf(n)&&ru(n)==un};function jf(n){return null!=n&&Ef(n.length)&&!Rf(n)}function Af(n){return Wf(n)&&jf(n)}var kf=qr||Va,Of=Gt?Or(Gt):function(n){return Wf(n)&&ru(n)==M};function If(n){if(!Wf(n))return!1;var t=ru(n);return t==N||t==F||"string"==typeof n.message&&"string"==typeof n.name&&!Uf(n)}function Rf(n){if(!Sf(n))return!1;var t=ru(n);return t==P||t==q||t==$||t==J}function zf(n){return"number"==typeof n&&n==Zf(n)}function Ef(n){return"number"==typeof n&&n>-1&&n%1==0&&n<=z}function Sf(n){var t=typeof n;return null!=n&&("object"==t||"function"==t)}function Wf(n){return null!=n&&"object"==typeof n}var Lf=Ht?Or(Ht):function(n){return Wf(n)&&Ni(n)==Z};function Cf(n){return"number"==typeof n||Wf(n)&&ru(n)==K}function Uf(n){if(!Wf(n)||ru(n)!=G)return!1;var t=At(n);if(null===t)return!0;var r=pt.call(t,"constructor")&&t.constructor;return"function"==typeof r&&r instanceof r&&ht.call(r)==yt}var Bf=Jt?Or(Jt):function(n){return Wf(n)&&ru(n)==Y};var Tf=Yt?Or(Yt):function(n){return Wf(n)&&Ni(n)==Q};function $f(n){return"string"==typeof n||!mf(n)&&Wf(n)&&ru(n)==X}function Df(n){return"symbol"==typeof n||Wf(n)&&ru(n)==nn}var Mf=Qt?Or(Qt):function(n){return Wf(n)&&Ef(n.length)&&!!Ct[ru(n)]};var Ff=ji(_u),Nf=ji(function(n,t){return n<=t});function Pf(n){if(!n)return[];if(jf(n))return $f(n)?Mr(n):oi(n);if(Dt&&n[Dt])return function(n){for(var t,r=[];!(t=n.next()).done;)r.push(t.value);return r}(n[Dt]());var t=Ni(n);return(t==Z?Ur:t==Q?$r:ya)(n)}function qf(n){return n?(n=Vf(n))===R||n===-R?(n<0?-1:1)*E:n==n?n:0:0===n?n:0}function Zf(n){var t=qf(n),r=t%1;return t==t?r?t-r:t:0}function Kf(n){return n?$e(Zf(n),0,W):0}function Vf(n){if("number"==typeof n)return n;if(Df(n))return S;if(Sf(n)){var t="function"==typeof n.valueOf?n.valueOf():n;n=Sf(t)?t+"":t}if("string"!=typeof n)return 0===n?n:+n;n=n.replace(Wn,"");var r=Pn.test(n);return r||Zn.test(n)?$t(n.slice(2),r?2:8):Nn.test(n)?S:+n}function Gf(n){return fi(n,ca(n))}function Hf(n){return null==n?"":Mu(n)}var Jf=ci(function(n,t){if(Yi(t)||jf(t))fi(t,aa(t),n);else for(var r in t)pt.call(t,r)&&We(n,r,t[r])}),Yf=ci(function(n,t){fi(t,ca(t),n)}),Qf=ci(function(n,t,r,e){fi(t,ca(t),n,e)}),Xf=ci(function(n,t,r,e){fi(t,aa(t),n,e)}),na=Ei(Te);var ta=Iu(function(t){return t.push(n,Ee),tr(Qf,n,t)}),ra=Iu(function(t){return t.push(n,no),tr(sa,n,t)});function ea(t,r,e){var u=null==t?n:nu(t,r);return u===n?e:u}function ua(n,t){return null!=n&&Pi(n,t,iu)}var ia=di(function(n,t,r){n[t]=r},Sa(Ca)),oa=di(function(n,t,r){pt.call(n,t)?n[t].push(r):n[t]=[r]},Bi),fa=Iu(fu);function aa(n){return jf(n)?Oe(n):pu(n)}function ca(n){return jf(n)?Oe(n,!0):vu(n)}var la=ci(function(n,t,r){bu(n,t,r)}),sa=ci(function(n,t,r,e){bu(n,t,r,e)}),ha=Ei(function(n,t){var r={};if(null==n)return r;var e=!1;t=cr(t,function(t){return t=Ju(t,n),e||(e=t.length>1),t}),fi(n,Wi(n),r),e&&(r=De(r,f|a|c));for(var u=t.length;u--;)Nu(r,t[u]);return r});var pa=Ei(function(n,t){return null==n?{}:(e=t,xu(r=ut(r=n),e,function(n,t){return ua(r,t)}));var r,e});function va(n,t){if(null==n)return{};var r=cr(Wi(n),function(n){return[n]});return t=Bi(t),xu(n,r,function(n,r){return t(n,r[0])})}var _a=Ii(aa),ga=Ii(ca);function ya(n){return null==n?[]:Ir(n,aa(n))}var da=pi(function(n,t,r){return t=t.toLowerCase(),n+(r?ba(t):t)});function ba(n){return Ia(Hf(n).toLowerCase())}function wa(n){return(n=Hf(n))&&n.replace(Vn,Sr).replace(It,"")}var ma=pi(function(n,t,r){return n+(r?"-":"")+t.toLowerCase()}),xa=pi(function(n,t,r){return n+(r?" ":"")+t.toLowerCase()}),ja=hi("toLowerCase");var Aa=pi(function(n,t,r){return n+(r?"_":"")+t.toLowerCase()});var ka=pi(function(n,t,r){return n+(r?" ":"")+Ia(t)});var Oa=pi(function(n,t,r){return n+(r?" ":"")+t.toUpperCase()}),Ia=hi("toUpperCase");function Ra(t,r,e){return t=Hf(t),(r=e?n:r)===n?(u=t,St.test(u)?t.match(zt)||[]:t.match($n)||[]):t.match(r)||[];var u}var za=Iu(function(t,r){try{return tr(t,n,r)}catch(n){return If(n)?n:new tt(n)}}),Ea=Ei(function(n,t){return er(t,function(t){t=ho(t),Be(n,t,of(n[t],n))}),n});function Sa(n){return function(){return n}}var Wa=gi(),La=gi(!0);function Ca(n){return n}function Ua(n){return hu("function"==typeof n?n:De(n,f))}var Ba=Iu(function(n,t){return function(r){return fu(r,n,t)}}),Ta=Iu(function(n,t){return function(r){return fu(n,r,t)}});function $a(n,t,r){var e=aa(t),u=Xe(t,e);null!=r||Sf(t)&&(u.length||!e.length)||(r=t,t=n,n=this,u=Xe(t,aa(t)));var i=!(Sf(r)&&"chain"in r&&!r.chain),o=Rf(n);return er(u,function(r){var e=t[r];n[r]=e,o&&(n.prototype[r]=function(){var t=this.__chain__;if(i||t){var r=n(this.__wrapped__);return(r.__actions__=oi(this.__actions__)).push({func:e,args:arguments,thisArg:n}),r.__chain__=t,r}return e.apply(n,lr([this.value()],arguments))})}),n}function Da(){}var Ma=wi(cr),Fa=wi(ir),Na=wi(pr);function Pa(n){return Gi(n)?mr(ho(n)):(t=n,function(n){return nu(n,t)});var t}var qa=xi(),Za=xi(!0);function Ka(){return[]}function Va(){return!1}var Ga=bi(function(n,t){return n+t},0),Ha=ki("ceil"),Ja=bi(function(n,t){return n/t},1),Ya=ki("floor");var Qa,Xa=bi(function(n,t){return n*t},1),nc=ki("round"),tc=bi(function(n,t){return n-t},0);return ge.after=function(n,t){if("function"!=typeof t)throw new ft(e);return n=Zf(n),function(){if(--n<1)return t.apply(this,arguments)}},ge.ary=ef,ge.assign=Jf,ge.assignIn=Yf,ge.assignInWith=Qf,ge.assignWith=Xf,ge.at=na,ge.before=uf,ge.bind=of,ge.bindAll=Ea,ge.bindKey=ff,ge.castArray=function(){if(!arguments.length)return[];var n=arguments[0];return mf(n)?n:[n]},ge.chain=No,ge.chunk=function(t,r,e){r=(e?Vi(t,r,e):r===n)?1:Gr(Zf(r),0);var u=null==t?0:t.length;if(!u||r<1)return[];for(var i=0,o=0,f=Xn(vr(u/r));i<u;)f[o++]=Cu(t,i,i+=r);return f},ge.compact=function(n){for(var t=-1,r=null==n?0:n.length,e=0,u=[];++t<r;){var i=n[t];i&&(u[e++]=i)}return u},ge.concat=function(){var n=arguments.length;if(!n)return[];for(var t=Xn(n-1),r=arguments[0],e=n;e--;)t[e-1]=arguments[e];return lr(mf(r)?oi(r):[r],Ge(t,1))},ge.cond=function(n){var t=null==n?0:n.length,r=Bi();return n=t?cr(n,function(n){if("function"!=typeof n[1])throw new ft(e);return[r(n[0]),n[1]]}):[],Iu(function(r){for(var e=-1;++e<t;){var u=n[e];if(tr(u[0],this,r))return tr(u[1],this,r)}})},ge.conforms=function(n){return t=De(n,f),r=aa(t),function(n){return Me(n,t,r)};var t,r},ge.constant=Sa,ge.countBy=Zo,ge.create=function(n,t){var r=ye(n);return null==t?r:Ue(r,t)},ge.curry=function t(r,e,u){var i=Ri(r,_,n,n,n,n,n,e=u?n:e);return i.placeholder=t.placeholder,i},ge.curryRight=function t(r,e,u){var i=Ri(r,g,n,n,n,n,n,e=u?n:e);return i.placeholder=t.placeholder,i},ge.debounce=af,ge.defaults=ta,ge.defaultsDeep=ra,ge.defer=cf,ge.delay=lf,ge.difference=_o,ge.differenceBy=go,ge.differenceWith=yo,ge.drop=function(t,r,e){var u=null==t?0:t.length;return u?Cu(t,(r=e||r===n?1:Zf(r))<0?0:r,u):[]},ge.dropRight=function(t,r,e){var u=null==t?0:t.length;return u?Cu(t,0,(r=u-(r=e||r===n?1:Zf(r)))<0?0:r):[]},ge.dropRightWhile=function(n,t){return n&&n.length?qu(n,Bi(t,3),!0,!0):[]},ge.dropWhile=function(n,t){return n&&n.length?qu(n,Bi(t,3),!0):[]},ge.fill=function(t,r,e,u){var i=null==t?0:t.length;return i?(e&&"number"!=typeof e&&Vi(t,r,e)&&(e=0,u=i),function(t,r,e,u){var i=t.length;for((e=Zf(e))<0&&(e=-e>i?0:i+e),(u=u===n||u>i?i:Zf(u))<0&&(u+=i),u=e>u?0:Kf(u);e<u;)t[e++]=r;return t}(t,r,e,u)):[]},ge.filter=function(n,t){return(mf(n)?or:Ve)(n,Bi(t,3))},ge.flatMap=function(n,t){return Ge(Xo(n,t),1)},ge.flatMapDeep=function(n,t){return Ge(Xo(n,t),R)},ge.flatMapDepth=function(t,r,e){return e=e===n?1:Zf(e),Ge(Xo(t,r),e)},ge.flatten=mo,ge.flattenDeep=function(n){return null!=n&&n.length?Ge(n,R):[]},ge.flattenDepth=function(t,r){return null!=t&&t.length?Ge(t,r=r===n?1:Zf(r)):[]},ge.flip=function(n){return Ri(n,m)},ge.flow=Wa,ge.flowRight=La,ge.fromPairs=function(n){for(var t=-1,r=null==n?0:n.length,e={};++t<r;){var u=n[t];e[u[0]]=u[1]}return e},ge.functions=function(n){return null==n?[]:Xe(n,aa(n))},ge.functionsIn=function(n){return null==n?[]:Xe(n,ca(n))},ge.groupBy=Jo,ge.initial=function(n){return null!=n&&n.length?Cu(n,0,-1):[]},ge.intersection=jo,ge.intersectionBy=Ao,ge.intersectionWith=ko,ge.invert=ia,ge.invertBy=oa,ge.invokeMap=Yo,ge.iteratee=Ua,ge.keyBy=Qo,ge.keys=aa,ge.keysIn=ca,ge.map=Xo,ge.mapKeys=function(n,t){var r={};return t=Bi(t,3),Ye(n,function(n,e,u){Be(r,t(n,e,u),n)}),r},ge.mapValues=function(n,t){var r={};return t=Bi(t,3),Ye(n,function(n,e,u){Be(r,e,t(n,e,u))}),r},ge.matches=function(n){return yu(De(n,f))},ge.matchesProperty=function(n,t){return du(n,De(t,f))},ge.memoize=sf,ge.merge=la,ge.mergeWith=sa,ge.method=Ba,ge.methodOf=Ta,ge.mixin=$a,ge.negate=hf,ge.nthArg=function(n){return n=Zf(n),Iu(function(t){return wu(t,n)})},ge.omit=ha,ge.omitBy=function(n,t){return va(n,hf(Bi(t)))},ge.once=function(n){return uf(2,n)},ge.orderBy=function(t,r,e,u){return null==t?[]:(mf(r)||(r=null==r?[]:[r]),mf(e=u?n:e)||(e=null==e?[]:[e]),mu(t,r,e))},ge.over=Ma,ge.overArgs=pf,ge.overEvery=Fa,ge.overSome=Na,ge.partial=vf,ge.partialRight=_f,ge.partition=nf,ge.pick=pa,ge.pickBy=va,ge.property=Pa,ge.propertyOf=function(t){return function(r){return null==t?n:nu(t,r)}},ge.pull=Io,ge.pullAll=Ro,ge.pullAllBy=function(n,t,r){return n&&n.length&&t&&t.length?ju(n,t,Bi(r,2)):n},ge.pullAllWith=function(t,r,e){return t&&t.length&&r&&r.length?ju(t,r,n,e):t},ge.pullAt=zo,ge.range=qa,ge.rangeRight=Za,ge.rearg=gf,ge.reject=function(n,t){return(mf(n)?or:Ve)(n,hf(Bi(t,3)))},ge.remove=function(n,t){var r=[];if(!n||!n.length)return r;var e=-1,u=[],i=n.length;for(t=Bi(t,3);++e<i;){var o=n[e];t(o,e,n)&&(r.push(o),u.push(e))}return Au(n,u),r},ge.rest=function(t,r){if("function"!=typeof t)throw new ft(e);return Iu(t,r=r===n?r:Zf(r))},ge.reverse=Eo,ge.sampleSize=function(t,r,e){return r=(e?Vi(t,r,e):r===n)?1:Zf(r),(mf(t)?Re:zu)(t,r)},ge.set=function(n,t,r){return null==n?n:Eu(n,t,r)},ge.setWith=function(t,r,e,u){return u="function"==typeof u?u:n,null==t?t:Eu(t,r,e,u)},ge.shuffle=function(n){return(mf(n)?ze:Lu)(n)},ge.slice=function(t,r,e){var u=null==t?0:t.length;return u?(e&&"number"!=typeof e&&Vi(t,r,e)?(r=0,e=u):(r=null==r?0:Zf(r),e=e===n?u:Zf(e)),Cu(t,r,e)):[]},ge.sortBy=tf,ge.sortedUniq=function(n){return n&&n.length?$u(n):[]},ge.sortedUniqBy=function(n,t){return n&&n.length?$u(n,Bi(t,2)):[]},ge.split=function(t,r,e){return e&&"number"!=typeof e&&Vi(t,r,e)&&(r=e=n),(e=e===n?W:e>>>0)?(t=Hf(t))&&("string"==typeof r||null!=r&&!Bf(r))&&!(r=Mu(r))&&Cr(t)?Qu(Mr(t),0,e):t.split(r,e):[]},ge.spread=function(t,r){if("function"!=typeof t)throw new ft(e);return r=r===n?0:Gr(Zf(r),0),Iu(function(n){var e=n[r],u=Qu(n,0,r);return e&&lr(u,e),tr(t,this,u)})},ge.tail=function(n){var t=null==n?0:n.length;return t?Cu(n,1,t):[]},ge.take=function(t,r,e){return t&&t.length?Cu(t,0,(r=e||r===n?1:Zf(r))<0?0:r):[]},ge.takeRight=function(t,r,e){var u=null==t?0:t.length;return u?Cu(t,(r=u-(r=e||r===n?1:Zf(r)))<0?0:r,u):[]},ge.takeRightWhile=function(n,t){return n&&n.length?qu(n,Bi(t,3),!1,!0):[]},ge.takeWhile=function(n,t){return n&&n.length?qu(n,Bi(t,3)):[]},ge.tap=function(n,t){return t(n),n},ge.throttle=function(n,t,r){var u=!0,i=!0;if("function"!=typeof n)throw new ft(e);return Sf(r)&&(u="leading"in r?!!r.leading:u,i="trailing"in r?!!r.trailing:i),af(n,t,{leading:u,maxWait:t,trailing:i})},ge.thru=Po,ge.toArray=Pf,ge.toPairs=_a,ge.toPairsIn=ga,ge.toPath=function(n){return mf(n)?cr(n,ho):Df(n)?[n]:oi(so(Hf(n)))},ge.toPlainObject=Gf,ge.transform=function(n,t,r){var e=mf(n),u=e||kf(n)||Mf(n);if(t=Bi(t,4),null==r){var i=n&&n.constructor;r=u?e?new i:[]:Sf(n)&&Rf(i)?ye(At(n)):{}}return(u?er:Ye)(n,function(n,e,u){return t(r,n,e,u)}),r},ge.unary=function(n){return ef(n,1)},ge.union=So,ge.unionBy=Wo,ge.unionWith=Lo,ge.uniq=function(n){return n&&n.length?Fu(n):[]},ge.uniqBy=function(n,t){return n&&n.length?Fu(n,Bi(t,2)):[]},ge.uniqWith=function(t,r){return r="function"==typeof r?r:n,t&&t.length?Fu(t,n,r):[]},ge.unset=function(n,t){return null==n||Nu(n,t)},ge.unzip=Co,ge.unzipWith=Uo,ge.update=function(n,t,r){return null==n?n:Pu(n,t,Hu(r))},ge.updateWith=function(t,r,e,u){return u="function"==typeof u?u:n,null==t?t:Pu(t,r,Hu(e),u)},ge.values=ya,ge.valuesIn=function(n){return null==n?[]:Ir(n,ca(n))},ge.without=Bo,ge.words=Ra,ge.wrap=function(n,t){return vf(Hu(t),n)},ge.xor=To,ge.xorBy=$o,ge.xorWith=Do,ge.zip=Mo,ge.zipObject=function(n,t){return Vu(n||[],t||[],We)},ge.zipObjectDeep=function(n,t){return Vu(n||[],t||[],Eu)},ge.zipWith=Fo,ge.entries=_a,ge.entriesIn=ga,ge.extend=Yf,ge.extendWith=Qf,$a(ge,ge),ge.add=Ga,ge.attempt=za,ge.camelCase=da,ge.capitalize=ba,ge.ceil=Ha,ge.clamp=function(t,r,e){return e===n&&(e=r,r=n),e!==n&&(e=(e=Vf(e))==e?e:0),r!==n&&(r=(r=Vf(r))==r?r:0),$e(Vf(t),r,e)},ge.clone=function(n){return De(n,c)},ge.cloneDeep=function(n){return De(n,f|c)},ge.cloneDeepWith=function(t,r){return De(t,f|c,r="function"==typeof r?r:n)},ge.cloneWith=function(t,r){return De(t,c,r="function"==typeof r?r:n)},ge.conformsTo=function(n,t){return null==t||Me(n,t,aa(t))},ge.deburr=wa,ge.defaultTo=function(n,t){return null==n||n!=n?t:n},ge.divide=Ja,ge.endsWith=function(t,r,e){t=Hf(t),r=Mu(r);var u=t.length,i=e=e===n?u:$e(Zf(e),0,u);return(e-=r.length)>=0&&t.slice(e,i)==r},ge.eq=yf,ge.escape=function(n){return(n=Hf(n))&&xn.test(n)?n.replace(wn,Wr):n},ge.escapeRegExp=function(n){return(n=Hf(n))&&Sn.test(n)?n.replace(En,"\\$&"):n},ge.every=function(t,r,e){var u=mf(t)?ir:Ze;return e&&Vi(t,r,e)&&(r=n),u(t,Bi(r,3))},ge.find=Ko,ge.findIndex=bo,ge.findKey=function(n,t){return _r(n,Bi(t,3),Ye)},ge.findLast=Vo,ge.findLastIndex=wo,ge.findLastKey=function(n,t){return _r(n,Bi(t,3),Qe)},ge.floor=Ya,ge.forEach=Go,ge.forEachRight=Ho,ge.forIn=function(n,t){return null==n?n:He(n,Bi(t,3),ca)},ge.forInRight=function(n,t){return null==n?n:Je(n,Bi(t,3),ca)},ge.forOwn=function(n,t){return n&&Ye(n,Bi(t,3))},ge.forOwnRight=function(n,t){return n&&Qe(n,Bi(t,3))},ge.get=ea,ge.gt=df,ge.gte=bf,ge.has=function(n,t){return null!=n&&Pi(n,t,uu)},ge.hasIn=ua,ge.head=xo,ge.identity=Ca,ge.includes=function(n,t,r,e){n=jf(n)?n:ya(n),r=r&&!e?Zf(r):0;var u=n.length;return r<0&&(r=Gr(u+r,0)),$f(n)?r<=u&&n.indexOf(t,r)>-1:!!u&&yr(n,t,r)>-1},ge.indexOf=function(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=null==r?0:Zf(r);return u<0&&(u=Gr(e+u,0)),yr(n,t,u)},ge.inRange=function(t,r,e){return r=qf(r),e===n?(e=r,r=0):e=qf(e),t=Vf(t),(u=t)>=Hr(i=r,o=e)&&u<Gr(i,o);var u,i,o},ge.invoke=fa,ge.isArguments=wf,ge.isArray=mf,ge.isArrayBuffer=xf,ge.isArrayLike=jf,ge.isArrayLikeObject=Af,ge.isBoolean=function(n){return!0===n||!1===n||Wf(n)&&ru(n)==D},ge.isBuffer=kf,ge.isDate=Of,ge.isElement=function(n){return Wf(n)&&1===n.nodeType&&!Uf(n)},ge.isEmpty=function(n){if(null==n)return!0;if(jf(n)&&(mf(n)||"string"==typeof n||"function"==typeof n.splice||kf(n)||Mf(n)||wf(n)))return!n.length;var t=Ni(n);if(t==Z||t==Q)return!n.size;if(Yi(n))return!pu(n).length;for(var r in n)if(pt.call(n,r))return!1;return!0},ge.isEqual=function(n,t){return cu(n,t)},ge.isEqualWith=function(t,r,e){var u=(e="function"==typeof e?e:n)?e(t,r):n;return u===n?cu(t,r,n,e):!!u},ge.isError=If,ge.isFinite=function(n){return"number"==typeof n&&Zr(n)},ge.isFunction=Rf,ge.isInteger=zf,ge.isLength=Ef,ge.isMap=Lf,ge.isMatch=function(n,t){return n===t||lu(n,t,$i(t))},ge.isMatchWith=function(t,r,e){return e="function"==typeof e?e:n,lu(t,r,$i(r),e)},ge.isNaN=function(n){return Cf(n)&&n!=+n},ge.isNative=function(n){if(Ji(n))throw new tt(r);return su(n)},ge.isNil=function(n){return null==n},ge.isNull=function(n){return null===n},ge.isNumber=Cf,ge.isObject=Sf,ge.isObjectLike=Wf,ge.isPlainObject=Uf,ge.isRegExp=Bf,ge.isSafeInteger=function(n){return zf(n)&&n>=-z&&n<=z},ge.isSet=Tf,ge.isString=$f,ge.isSymbol=Df,ge.isTypedArray=Mf,ge.isUndefined=function(t){return t===n},ge.isWeakMap=function(n){return Wf(n)&&Ni(n)==rn},ge.isWeakSet=function(n){return Wf(n)&&ru(n)==en},ge.join=function(n,t){return null==n?"":Kr.call(n,t)},ge.kebabCase=ma,ge.last=Oo,ge.lastIndexOf=function(t,r,e){var u=null==t?0:t.length;if(!u)return-1;var i=u;return e!==n&&(i=(i=Zf(e))<0?Gr(u+i,0):Hr(i,u-1)),r==r?function(n,t,r){for(var e=r+1;e--;)if(n[e]===t)return e;return e}(t,r,i):gr(t,br,i,!0)},ge.lowerCase=xa,ge.lowerFirst=ja,ge.lt=Ff,ge.lte=Nf,ge.max=function(t){return t&&t.length?Ke(t,Ca,eu):n},ge.maxBy=function(t,r){return t&&t.length?Ke(t,Bi(r,2),eu):n},ge.mean=function(n){return wr(n,Ca)},ge.meanBy=function(n,t){return wr(n,Bi(t,2))},ge.min=function(t){return t&&t.length?Ke(t,Ca,_u):n},ge.minBy=function(t,r){return t&&t.length?Ke(t,Bi(r,2),_u):n},ge.stubArray=Ka,ge.stubFalse=Va,ge.stubObject=function(){return{}},ge.stubString=function(){return""},ge.stubTrue=function(){return!0},ge.multiply=Xa,ge.nth=function(t,r){return t&&t.length?wu(t,Zf(r)):n},ge.noConflict=function(){return Ft._===this&&(Ft._=dt),this},ge.noop=Da,ge.now=rf,ge.pad=function(n,t,r){n=Hf(n);var e=(t=Zf(t))?Dr(n):0;if(!t||e>=t)return n;var u=(t-e)/2;return mi(xr(u),r)+n+mi(vr(u),r)},ge.padEnd=function(n,t,r){n=Hf(n);var e=(t=Zf(t))?Dr(n):0;return t&&e<t?n+mi(t-e,r):n},ge.padStart=function(n,t,r){n=Hf(n);var e=(t=Zf(t))?Dr(n):0;return t&&e<t?mi(t-e,r)+n:n},ge.parseInt=function(n,t,r){return r||null==t?t=0:t&&(t=+t),Yr(Hf(n).replace(Ln,""),t||0)},ge.random=function(t,r,e){if(e&&"boolean"!=typeof e&&Vi(t,r,e)&&(r=e=n),e===n&&("boolean"==typeof r?(e=r,r=n):"boolean"==typeof t&&(e=t,t=n)),t===n&&r===n?(t=0,r=1):(t=qf(t),r===n?(r=t,t=0):r=qf(r)),t>r){var u=t;t=r,r=u}if(e||t%1||r%1){var i=Qr();return Hr(t+i*(r-t+Tt("1e-"+((i+"").length-1))),r)}return ku(t,r)},ge.reduce=function(n,t,r){var e=mf(n)?sr:jr,u=arguments.length<3;return e(n,Bi(t,4),r,u,Pe)},ge.reduceRight=function(n,t,r){var e=mf(n)?hr:jr,u=arguments.length<3;return e(n,Bi(t,4),r,u,qe)},ge.repeat=function(t,r,e){return r=(e?Vi(t,r,e):r===n)?1:Zf(r),Ou(Hf(t),r)},ge.replace=function(){var n=arguments,t=Hf(n[0]);return n.length<3?t:t.replace(n[1],n[2])},ge.result=function(t,r,e){var u=-1,i=(r=Ju(r,t)).length;for(i||(i=1,t=n);++u<i;){var o=null==t?n:t[ho(r[u])];o===n&&(u=i,o=e),t=Rf(o)?o.call(t):o}return t},ge.round=nc,ge.runInContext=Jn,ge.sample=function(n){return(mf(n)?Ie:Ru)(n)},ge.size=function(n){if(null==n)return 0;if(jf(n))return $f(n)?Dr(n):n.length;var t=Ni(n);return t==Z||t==Q?n.size:pu(n).length},ge.snakeCase=Aa,ge.some=function(t,r,e){var u=mf(t)?pr:Uu;return e&&Vi(t,r,e)&&(r=n),u(t,Bi(r,3))},ge.sortedIndex=function(n,t){return Bu(n,t)},ge.sortedIndexBy=function(n,t,r){return Tu(n,t,Bi(r,2))},ge.sortedIndexOf=function(n,t){var r=null==n?0:n.length;if(r){var e=Bu(n,t);if(e<r&&yf(n[e],t))return e}return-1},ge.sortedLastIndex=function(n,t){return Bu(n,t,!0)},ge.sortedLastIndexBy=function(n,t,r){return Tu(n,t,Bi(r,2),!0)},ge.sortedLastIndexOf=function(n,t){if(null!=n&&n.length){var r=Bu(n,t,!0)-1;if(yf(n[r],t))return r}return-1},ge.startCase=ka,ge.startsWith=function(n,t,r){return n=Hf(n),r=$e(Zf(r),0,n.length),t=Mu(t),n.slice(r,r+t.length)==t},ge.subtract=tc,ge.sum=function(n){return n&&n.length?Ar(n,Ca):0},ge.sumBy=function(n,t){return n&&n.length?Ar(n,Bi(t,2)):0},ge.template=function(t,r,e){var u=ge.templateSettings;e&&Vi(t,r,e)&&(r=n),t=Hf(t),r=Qf({},r,u,Ee);var i,o,f=Qf({},r.imports,u.imports,Ee),a=aa(f),c=Ir(f,a),l=0,s=r.interpolate||Gn,h="__p += '",p=it((r.escape||Gn).source+"|"+s.source+"|"+(s===kn?Mn:Gn).source+"|"+(r.evaluate||Gn).source+"|$","g"),v="//# sourceURL="+("sourceURL"in r?r.sourceURL:"lodash.templateSources["+ ++Lt+"]")+"\n";t.replace(p,function(n,r,e,u,f,a){return e||(e=u),h+=t.slice(l,a).replace(Hn,Lr),r&&(i=!0,h+="' +\n__e("+r+") +\n'"),f&&(o=!0,h+="';\n"+f+";\n__p += '"),e&&(h+="' +\n((__t = ("+e+")) == null ? '' : __t) +\n'"),l=a+n.length,n}),h+="';\n";var _=r.variable;_||(h="with (obj) {\n"+h+"\n}\n"),h=(o?h.replace(gn,""):h).replace(yn,"$1").replace(dn,"$1;"),h="function("+(_||"obj")+") {\n"+(_?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(i?", __e = _.escape":"")+(o?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+h+"return __p\n}";var g=za(function(){return rt(a,v+"return "+h).apply(n,c)});if(g.source=h,If(g))throw g;return g},ge.times=function(n,t){if((n=Zf(n))<1||n>z)return[];var r=W,e=Hr(n,W);t=Bi(t),n-=W;for(var u=kr(e,t);++r<n;)t(r);return u},ge.toFinite=qf,ge.toInteger=Zf,ge.toLength=Kf,ge.toLower=function(n){return Hf(n).toLowerCase()},ge.toNumber=Vf,ge.toSafeInteger=function(n){return $e(Zf(n),-z,z)},ge.toString=Hf,ge.toUpper=function(n){return Hf(n).toUpperCase()},ge.trim=function(t,r,e){if((t=Hf(t))&&(e||r===n))return t.replace(Wn,"");if(!t||!(r=Mu(r)))return t;var u=Mr(t),i=Mr(r);return Qu(u,zr(u,i),Er(u,i)+1).join("")},ge.trimEnd=function(t,r,e){if((t=Hf(t))&&(e||r===n))return t.replace(Cn,"");if(!t||!(r=Mu(r)))return t;var u=Mr(t);return Qu(u,0,Er(u,Mr(r))+1).join("")},ge.trimStart=function(t,r,e){if((t=Hf(t))&&(e||r===n))return t.replace(Ln,"");if(!t||!(r=Mu(r)))return t;var u=Mr(t);return Qu(u,zr(u,Mr(r))).join("")},ge.truncate=function(t,r){var e=x,u=j;if(Sf(r)){var i="separator"in r?r.separator:i;e="length"in r?Zf(r.length):e,u="omission"in r?Mu(r.omission):u}var o=(t=Hf(t)).length;if(Cr(t)){var f=Mr(t);o=f.length}if(e>=o)return t;var a=e-Dr(u);if(a<1)return u;var c=f?Qu(f,0,a).join(""):t.slice(0,a);if(i===n)return c+u;if(f&&(a+=c.length-a),Bf(i)){if(t.slice(a).search(i)){var l,s=c;for(i.global||(i=it(i.source,Hf(Fn.exec(i))+"g")),i.lastIndex=0;l=i.exec(s);)var h=l.index;c=c.slice(0,h===n?a:h)}}else if(t.indexOf(Mu(i),a)!=a){var p=c.lastIndexOf(i);p>-1&&(c=c.slice(0,p))}return c+u},ge.unescape=function(n){return(n=Hf(n))&&mn.test(n)?n.replace(bn,Fr):n},ge.uniqueId=function(n){var t=++vt;return Hf(n)+t},ge.upperCase=Oa,ge.upperFirst=Ia,ge.each=Go,ge.eachRight=Ho,ge.first=xo,$a(ge,(Qa={},Ye(ge,function(n,t){pt.call(ge.prototype,t)||(Qa[t]=n)}),Qa),{chain:!1}),ge.VERSION="4.17.2",er(["bind","bindKey","curry","curryRight","partial","partialRight"],function(n){ge[n].placeholder=ge}),er(["drop","take"],function(t,r){we.prototype[t]=function(e){var u=this.__filtered__;if(u&&!r)return new we(this);e=e===n?1:Gr(Zf(e),0);var i=this.clone();return u?i.__takeCount__=Hr(e,i.__takeCount__):i.__views__.push({size:Hr(e,W),type:t+(i.__dir__<0?"Right":"")}),i},we.prototype[t+"Right"]=function(n){return this.reverse()[t](n).reverse()}}),er(["filter","map","takeWhile"],function(n,t){var r=t+1,e=r==O||3==r;we.prototype[n]=function(n){var t=this.clone();return t.__iteratees__.push({iteratee:Bi(n,3),type:r}),t.__filtered__=t.__filtered__||e,t}}),er(["head","last"],function(n,t){var r="take"+(t?"Right":"");we.prototype[n]=function(){return this[r](1).value()[0]}}),er(["initial","tail"],function(n,t){var r="drop"+(t?"":"Right");we.prototype[n]=function(){return this.__filtered__?new we(this):this[r](1)}}),we.prototype.compact=function(){return this.filter(Ca)},we.prototype.find=function(n){return this.filter(n).head()},we.prototype.findLast=function(n){return this.reverse().find(n)},we.prototype.invokeMap=Iu(function(n,t){return"function"==typeof n?new we(this):this.map(function(r){return fu(r,n,t)})}),we.prototype.reject=function(n){return this.filter(hf(Bi(n)))},we.prototype.slice=function(t,r){t=Zf(t);var e=this;return e.__filtered__&&(t>0||r<0)?new we(e):(t<0?e=e.takeRight(-t):t&&(e=e.drop(t)),r!==n&&(e=(r=Zf(r))<0?e.dropRight(-r):e.take(r-t)),e)},we.prototype.takeRightWhile=function(n){return this.reverse().takeWhile(n).reverse()},we.prototype.toArray=function(){return this.take(W)},Ye(we.prototype,function(t,r){var e=/^(?:filter|find|map|reject)|While$/.test(r),u=/^(?:head|last)$/.test(r),i=ge[u?"take"+("last"==r?"Right":""):r],o=u||/^find/.test(r);i&&(ge.prototype[r]=function(){var r=this.__wrapped__,f=u?[1]:arguments,a=r instanceof we,c=f[0],l=a||mf(r),s=function(n){var t=i.apply(ge,lr([n],f));return u&&h?t[0]:t};l&&e&&"function"==typeof c&&1!=c.length&&(a=l=!1);var h=this.__chain__,p=!!this.__actions__.length,v=o&&!h,_=a&&!p;if(!o&&l){r=_?r:new we(this);var g=t.apply(r,f);return g.__actions__.push({func:Po,args:[s],thisArg:n}),new be(g,h)}return v&&_?t.apply(this,f):(g=this.thru(s),v?u?g.value()[0]:g.value():g)})}),er(["pop","push","shift","sort","splice","unshift"],function(n){var t=at[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:pop|shift)$/.test(n);ge.prototype[n]=function(){var n=arguments;if(e&&!this.__chain__){var u=this.value();return t.apply(mf(u)?u:[],n)}return this[r](function(r){return t.apply(mf(r)?r:[],n)})}}),Ye(we.prototype,function(n,t){var r=ge[t];if(r){var e=r.name+"";(fe[e]||(fe[e]=[])).push({name:t,func:r})}}),fe[yi(n,p).name]=[{name:"wrapper",func:n}],we.prototype.clone=function(){var n=new we(this.__wrapped__);return n.__actions__=oi(this.__actions__),n.__dir__=this.__dir__,n.__filtered__=this.__filtered__,n.__iteratees__=oi(this.__iteratees__),n.__takeCount__=this.__takeCount__,n.__views__=oi(this.__views__),n},we.prototype.reverse=function(){if(this.__filtered__){var n=new we(this);n.__dir__=-1,n.__filtered__=!0}else(n=this.clone()).__dir__*=-1;return n},we.prototype.value=function(){var n=this.__wrapped__.value(),r=this.__dir__,e=mf(n),u=r<0,i=e?n.length:0,o=function(n,t,r){for(var e=-1,u=r.length;++e<u;){var i=r[e],o=i.size;switch(i.type){case"drop":n+=o;break;case"dropRight":t-=o;break;case"take":t=Hr(t,n+o);break;case"takeRight":n=Gr(n,t-o)}}return{start:n,end:t}}(0,i,this.__views__),f=o.start,a=o.end,c=a-f,l=u?a:f-1,s=this.__iteratees__,h=s.length,p=0,v=Hr(c,this.__takeCount__);if(!e||i<t||i==c&&v==c)return Zu(n,this.__actions__);var _=[];n:for(;c--&&p<v;){for(var g=-1,y=n[l+=r];++g<h;){var d=s[g],b=d.iteratee,w=d.type,m=b(y);if(w==I)y=m;else if(!m){if(w==O)continue n;break n}}_[p++]=y}return _},ge.prototype.at=qo,ge.prototype.chain=function(){return No(this)},ge.prototype.commit=function(){return new be(this.value(),this.__chain__)},ge.prototype.next=function(){this.__values__===n&&(this.__values__=Pf(this.value()));var t=this.__index__>=this.__values__.length;return{done:t,value:t?n:this.__values__[this.__index__++]}},ge.prototype.plant=function(t){for(var r,e=this;e instanceof de;){var u=vo(e);u.__index__=0,u.__values__=n,r?i.__wrapped__=u:r=u;var i=u;e=e.__wrapped__}return i.__wrapped__=t,r},ge.prototype.reverse=function(){var t=this.__wrapped__;if(t instanceof we){var r=t;return this.__actions__.length&&(r=new we(this)),(r=r.reverse()).__actions__.push({func:Po,args:[Eo],thisArg:n}),new be(r,this.__chain__)}return this.thru(Eo)},ge.prototype.toJSON=ge.prototype.valueOf=ge.prototype.value=function(){return Zu(this.__wrapped__,this.__actions__)},ge.prototype.first=ge.prototype.head,Dt&&(ge.prototype[Dt]=function(){return this}),ge}();"function"==typeof define&&"object"==typeof define.amd&&define.amd?(Ft._=Nr,define(function(){return Nr})):Pt?((Pt.exports=Nr)._=Nr,Nt._=Nr):Ft._=Nr}).call(this);



/*!
 * Knockout JavaScript library v3.2.0
 * (c) Steven Sanderson - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function() {(function(p){var s=this||(0,eval)("this"),v=s.document,L=s.navigator,w=s.jQuery,D=s.JSON;(function(p){"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?p(module.exports||exports,require):"function"===typeof define&&define.amd?define(["exports","require"],p):p(s.ko={})})(function(M,N){function H(a,d){return null===a||typeof a in R?a===d:!1}function S(a,d){var c;return function(){c||(c=setTimeout(function(){c=p;a()},d))}}function T(a,d){var c;return function(){clearTimeout(c);
c=setTimeout(a,d)}}function I(b,d,c,e){a.d[b]={init:function(b,h,k,f,m){var l,q;a.s(function(){var f=a.a.c(h()),k=!c!==!f,z=!q;if(z||d||k!==l)z&&a.Y.la()&&(q=a.a.ia(a.f.childNodes(b),!0)),k?(z||a.f.T(b,a.a.ia(q)),a.Ca(e?e(m,f):m,b)):a.f.ja(b),l=k},null,{o:b});return{controlsDescendantBindings:!0}}};a.h.ha[b]=!1;a.f.Q[b]=!0}var a="undefined"!==typeof M?M:{};a.b=function(b,d){for(var c=b.split("."),e=a,g=0;g<c.length-1;g++)e=e[c[g]];e[c[c.length-1]]=d};a.A=function(a,d,c){a[d]=c};a.version="3.2.0";
a.b("version",a.version);a.a=function(){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])}function d(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function c(a,b){a.__proto__=b;return a}var e={__proto__:[]}instanceof Array,g={},h={};g[L&&/Firefox\/2/i.test(L.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];g.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(g,function(a,b){if(b.length)for(var c=
0,d=b.length;c<d;c++)h[b[c]]=a});var k={propertychange:!0},f=v&&function(){for(var a=3,b=v.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:p}();return{vb:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],u:function(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)},m:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var c=0,d=a.length;c<d;c++)if(a[c]===
b)return c;return-1},qb:function(a,b,c){for(var d=0,f=a.length;d<f;d++)if(b.call(c,a[d],d))return a[d];return null},ua:function(m,b){var c=a.a.m(m,b);0<c?m.splice(c,1):0===c&&m.shift()},rb:function(m){m=m||[];for(var b=[],c=0,d=m.length;c<d;c++)0>a.a.m(b,m[c])&&b.push(m[c]);return b},Da:function(a,b){a=a||[];for(var c=[],d=0,f=a.length;d<f;d++)c.push(b(a[d],d));return c},ta:function(a,b){a=a||[];for(var c=[],d=0,f=a.length;d<f;d++)b(a[d],d)&&c.push(a[d]);return c},ga:function(a,b){if(b instanceof
Array)a.push.apply(a,b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},ea:function(b,c,d){var f=a.a.m(a.a.Xa(b),c);0>f?d&&b.push(c):d||b.splice(f,1)},xa:e,extend:d,za:c,Aa:e?c:d,G:b,na:function(a,b){if(!a)return a;var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d],d,a));return c},Ka:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},oc:function(b){b=a.a.S(b);for(var c=v.createElement("div"),d=0,f=b.length;d<f;d++)c.appendChild(a.R(b[d]));return c},ia:function(b,c){for(var d=
0,f=b.length,e=[];d<f;d++){var k=b[d].cloneNode(!0);e.push(c?a.R(k):k)}return e},T:function(b,c){a.a.Ka(b);if(c)for(var d=0,f=c.length;d<f;d++)b.appendChild(c[d])},Lb:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var f=d[0],e=f.parentNode,k=0,g=c.length;k<g;k++)e.insertBefore(c[k],f);k=0;for(g=d.length;k<g;k++)a.removeNode(d[k])}},ka:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.shift();if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=
0;c!==d;)if(a.push(c),c=c.nextSibling,!c)return;a.push(d)}}return a},Nb:function(a,b){7>f?a.setAttribute("selected",b):a.selected=b},cb:function(a){return null===a||a===p?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},vc:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},cc:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&
16);for(;a&&a!=b;)a=a.parentNode;return!!a},Ja:function(b){return a.a.cc(b,b.ownerDocument.documentElement)},ob:function(b){return!!a.a.qb(b,a.a.Ja)},t:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},n:function(b,c,d){var e=f&&k[c];if(!e&&w)w(b).bind(c,d);else if(e||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var g=function(a){d.call(b,a)},h="on"+c;b.attachEvent(h,g);a.a.w.da(b,function(){b.detachEvent(h,g)})}else throw Error("Browser doesn't support addEventListener or attachEvent");
else b.addEventListener(c,d,!1)},oa:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.t(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==d||"radio"==d):d=!1;if(w&&!d)w(b).trigger(c);else if("function"==typeof v.createEvent)if("function"==typeof b.dispatchEvent)d=v.createEvent(h[c]||"HTMLEvents"),d.initEvent(c,!0,!0,s,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");
else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");},c:function(b){return a.C(b)?b():b},Xa:function(b){return a.C(b)?b.v():b},Ba:function(b,c,d){if(c){var f=/\S+/g,e=b.className.match(f)||[];a.a.u(c.match(f),function(b){a.a.ea(e,b,d)});b.className=e.join(" ")}},bb:function(b,c){var d=a.a.c(c);if(null===d||d===p)d="";var f=a.f.firstChild(b);!f||3!=f.nodeType||a.f.nextSibling(f)?a.f.T(b,[b.ownerDocument.createTextNode(d)]):
f.data=d;a.a.fc(b)},Mb:function(a,b){a.name=b;if(7>=f)try{a.mergeAttributes(v.createElement("<input name='"+a.name+"'/>"),!1)}catch(c){}},fc:function(a){9<=f&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},dc:function(a){if(f){var b=a.style.width;a.style.width=0;a.style.width=b}},sc:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var d=[],f=b;f<=c;f++)d.push(f);return d},S:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},yc:6===f,zc:7===f,L:f,xb:function(b,c){for(var d=
a.a.S(b.getElementsByTagName("input")).concat(a.a.S(b.getElementsByTagName("textarea"))),f="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},e=[],k=d.length-1;0<=k;k--)f(d[k])&&e.push(d[k]);return e},pc:function(b){return"string"==typeof b&&(b=a.a.cb(b))?D&&D.parse?D.parse(b):(new Function("return "+b))():null},eb:function(b,c,d){if(!D||!D.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
return D.stringify(a.a.c(b),c,d)},qc:function(c,d,f){f=f||{};var e=f.params||{},k=f.includeFields||this.vb,g=c;if("object"==typeof c&&"form"===a.a.t(c))for(var g=c.action,h=k.length-1;0<=h;h--)for(var r=a.a.xb(c,k[h]),E=r.length-1;0<=E;E--)e[r[E].name]=r[E].value;d=a.a.c(d);var y=v.createElement("form");y.style.display="none";y.action=g;y.method="post";for(var p in d)c=v.createElement("input"),c.type="hidden",c.name=p,c.value=a.a.eb(a.a.c(d[p])),y.appendChild(c);b(e,function(a,b){var c=v.createElement("input");
c.type="hidden";c.name=a;c.value=b;y.appendChild(c)});v.body.appendChild(y);f.submitter?f.submitter(y):y.submit();setTimeout(function(){y.parentNode.removeChild(y)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.u);a.b("utils.arrayFirst",a.a.qb);a.b("utils.arrayFilter",a.a.ta);a.b("utils.arrayGetDistinctValues",a.a.rb);a.b("utils.arrayIndexOf",a.a.m);a.b("utils.arrayMap",a.a.Da);a.b("utils.arrayPushAll",a.a.ga);a.b("utils.arrayRemoveItem",a.a.ua);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",
a.a.vb);a.b("utils.getFormFields",a.a.xb);a.b("utils.peekObservable",a.a.Xa);a.b("utils.postJson",a.a.qc);a.b("utils.parseJson",a.a.pc);a.b("utils.registerEventHandler",a.a.n);a.b("utils.stringifyJson",a.a.eb);a.b("utils.range",a.a.sc);a.b("utils.toggleDomNodeCssClass",a.a.Ba);a.b("utils.triggerEvent",a.a.oa);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.G);a.b("utils.addOrRemoveItem",a.a.ea);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=function(a){var d=
this,c=Array.prototype.slice.call(arguments);a=c.shift();return function(){return d.apply(a,c.concat(Array.prototype.slice.call(arguments)))}});a.a.e=new function(){function a(b,h){var k=b[c];if(!k||"null"===k||!e[k]){if(!h)return p;k=b[c]="ko"+d++;e[k]={}}return e[k]}var d=0,c="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===p?p:e[d]},set:function(c,d,e){if(e!==p||a(c,!1)!==p)a(c,!0)[d]=e},clear:function(a){var b=a[c];return b?(delete e[b],a[c]=null,!0):!1},F:function(){return d++ +
c}}};a.b("utils.domData",a.a.e);a.b("utils.domData.clear",a.a.e.clear);a.a.w=new function(){function b(b,d){var f=a.a.e.get(b,c);f===p&&d&&(f=[],a.a.e.set(b,c,f));return f}function d(c){var e=b(c,!1);if(e)for(var e=e.slice(0),f=0;f<e.length;f++)e[f](c);a.a.e.clear(c);a.a.w.cleanExternalData(c);if(g[c.nodeType])for(e=c.firstChild;c=e;)e=c.nextSibling,8===c.nodeType&&d(c)}var c=a.a.e.F(),e={1:!0,8:!0,9:!0},g={1:!0,9:!0};return{da:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");
b(a,!0).push(c)},Kb:function(d,e){var f=b(d,!1);f&&(a.a.ua(f,e),0==f.length&&a.a.e.set(d,c,p))},R:function(b){if(e[b.nodeType]&&(d(b),g[b.nodeType])){var c=[];a.a.ga(c,b.getElementsByTagName("*"));for(var f=0,m=c.length;f<m;f++)d(c[f])}return b},removeNode:function(b){a.R(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){w&&"function"==typeof w.cleanData&&w.cleanData([a])}}};a.R=a.a.w.R;a.removeNode=a.a.w.removeNode;a.b("cleanNode",a.R);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",
a.a.w);a.b("utils.domNodeDisposal.addDisposeCallback",a.a.w.da);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.w.Kb);(function(){a.a.ba=function(b){var d;if(w)if(w.parseHTML)d=w.parseHTML(b)||[];else{if((d=w.clean([b]))&&d[0]){for(b=d[0];b.parentNode&&11!==b.parentNode.nodeType;)b=b.parentNode;b.parentNode&&b.parentNode.removeChild(b)}}else{var c=a.a.cb(b).toLowerCase();d=v.createElement("div");c=c.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!c.indexOf("<tr")&&[2,"<table><tbody>",
"</tbody></table>"]||(!c.indexOf("<td")||!c.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];b="ignored<div>"+c[1]+b+c[2]+"</div>";for("function"==typeof s.innerShiv?d.appendChild(s.innerShiv(b)):d.innerHTML=b;c[0]--;)d=d.lastChild;d=a.a.S(d.lastChild.childNodes)}return d};a.a.$a=function(b,d){a.a.Ka(b);d=a.a.c(d);if(null!==d&&d!==p)if("string"!=typeof d&&(d=d.toString()),w)w(b).html(d);else for(var c=a.a.ba(d),e=0;e<c.length;e++)b.appendChild(c[e])}})();a.b("utils.parseHtmlFragment",
a.a.ba);a.b("utils.setHtml",a.a.$a);a.D=function(){function b(c,d){if(c)if(8==c.nodeType){var g=a.D.Gb(c.nodeValue);null!=g&&d.push({bc:c,mc:g})}else if(1==c.nodeType)for(var g=0,h=c.childNodes,k=h.length;g<k;g++)b(h[g],d)}var d={};return{Ua:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);d[b]=a;return"\x3c!--[ko_memo:"+
b+"]--\x3e"},Rb:function(a,b){var g=d[a];if(g===p)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return g.apply(null,b||[]),!0}finally{delete d[a]}},Sb:function(c,d){var g=[];b(c,g);for(var h=0,k=g.length;h<k;h++){var f=g[h].bc,m=[f];d&&a.a.ga(m,d);a.D.Rb(g[h].mc,m);f.nodeValue="";f.parentNode&&f.parentNode.removeChild(f)}},Gb:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.D);a.b("memoization.memoize",a.D.Ua);
a.b("memoization.unmemoize",a.D.Rb);a.b("memoization.parseMemoText",a.D.Gb);a.b("memoization.unmemoizeDomNodeAndDescendants",a.D.Sb);a.La={throttle:function(b,d){b.throttleEvaluation=d;var c=null;return a.j({read:b,write:function(a){clearTimeout(c);c=setTimeout(function(){b(a)},d)}})},rateLimit:function(a,d){var c,e,g;"number"==typeof d?c=d:(c=d.timeout,e=d.method);g="notifyWhenChangesStop"==e?T:S;a.Ta(function(a){return g(a,c)})},notify:function(a,d){a.equalityComparer="always"==d?null:H}};var R=
{undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.La);a.Pb=function(b,d,c){this.target=b;this.wa=d;this.ac=c;this.Cb=!1;a.A(this,"dispose",this.K)};a.Pb.prototype.K=function(){this.Cb=!0;this.ac()};a.P=function(){a.a.Aa(this,a.P.fn);this.M={}};var G="change",A={U:function(b,d,c){var e=this;c=c||G;var g=new a.Pb(e,d?b.bind(d):b,function(){a.a.ua(e.M[c],g);e.nb&&e.nb()});e.va&&e.va(c);e.M[c]||(e.M[c]=[]);e.M[c].push(g);return g},notifySubscribers:function(b,d){d=d||G;if(this.Ab(d))try{a.k.Ea();
for(var c=this.M[d].slice(0),e=0,g;g=c[e];++e)g.Cb||g.wa(b)}finally{a.k.end()}},Ta:function(b){var d=this,c=a.C(d),e,g,h;d.qa||(d.qa=d.notifySubscribers,d.notifySubscribers=function(a,b){b&&b!==G?"beforeChange"===b?d.kb(a):d.qa(a,b):d.lb(a)});var k=b(function(){c&&h===d&&(h=d());e=!1;d.Pa(g,h)&&d.qa(g=h)});d.lb=function(a){e=!0;h=a;k()};d.kb=function(a){e||(g=a,d.qa(a,"beforeChange"))}},Ab:function(a){return this.M[a]&&this.M[a].length},yb:function(){var b=0;a.a.G(this.M,function(a,c){b+=c.length});
return b},Pa:function(a,d){return!this.equalityComparer||!this.equalityComparer(a,d)},extend:function(b){var d=this;b&&a.a.G(b,function(b,e){var g=a.La[b];"function"==typeof g&&(d=g(d,e)||d)});return d}};a.A(A,"subscribe",A.U);a.A(A,"extend",A.extend);a.A(A,"getSubscriptionsCount",A.yb);a.a.xa&&a.a.za(A,Function.prototype);a.P.fn=A;a.Db=function(a){return null!=a&&"function"==typeof a.U&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.P);a.b("isSubscribable",a.Db);a.Y=a.k=function(){function b(a){c.push(e);
e=a}function d(){e=c.pop()}var c=[],e,g=0;return{Ea:b,end:d,Jb:function(b){if(e){if(!a.Db(b))throw Error("Only subscribable things can act as dependencies");e.wa(b,b.Vb||(b.Vb=++g))}},B:function(a,c,f){try{return b(),a.apply(c,f||[])}finally{d()}},la:function(){if(e)return e.s.la()},ma:function(){if(e)return e.ma}}}();a.b("computedContext",a.Y);a.b("computedContext.getDependenciesCount",a.Y.la);a.b("computedContext.isInitial",a.Y.ma);a.b("computedContext.isSleeping",a.Y.Ac);a.p=function(b){function d(){if(0<
arguments.length)return d.Pa(c,arguments[0])&&(d.X(),c=arguments[0],d.W()),this;a.k.Jb(d);return c}var c=b;a.P.call(d);a.a.Aa(d,a.p.fn);d.v=function(){return c};d.W=function(){d.notifySubscribers(c)};d.X=function(){d.notifySubscribers(c,"beforeChange")};a.A(d,"peek",d.v);a.A(d,"valueHasMutated",d.W);a.A(d,"valueWillMutate",d.X);return d};a.p.fn={equalityComparer:H};var F=a.p.rc="__ko_proto__";a.p.fn[F]=a.p;a.a.xa&&a.a.za(a.p.fn,a.P.fn);a.Ma=function(b,d){return null===b||b===p||b[F]===p?!1:b[F]===
d?!0:a.Ma(b[F],d)};a.C=function(b){return a.Ma(b,a.p)};a.Ra=function(b){return"function"==typeof b&&b[F]===a.p||"function"==typeof b&&b[F]===a.j&&b.hc?!0:!1};a.b("observable",a.p);a.b("isObservable",a.C);a.b("isWriteableObservable",a.Ra);a.b("isWritableObservable",a.Ra);a.aa=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");b=a.p(b);a.a.Aa(b,a.aa.fn);return b.extend({trackArrayChanges:!0})};
a.aa.fn={remove:function(b){for(var d=this.v(),c=[],e="function"!=typeof b||a.C(b)?function(a){return a===b}:b,g=0;g<d.length;g++){var h=d[g];e(h)&&(0===c.length&&this.X(),c.push(h),d.splice(g,1),g--)}c.length&&this.W();return c},removeAll:function(b){if(b===p){var d=this.v(),c=d.slice(0);this.X();d.splice(0,d.length);this.W();return c}return b?this.remove(function(c){return 0<=a.a.m(b,c)}):[]},destroy:function(b){var d=this.v(),c="function"!=typeof b||a.C(b)?function(a){return a===b}:b;this.X();
for(var e=d.length-1;0<=e;e--)c(d[e])&&(d[e]._destroy=!0);this.W()},destroyAll:function(b){return b===p?this.destroy(function(){return!0}):b?this.destroy(function(d){return 0<=a.a.m(b,d)}):[]},indexOf:function(b){var d=this();return a.a.m(d,b)},replace:function(a,d){var c=this.indexOf(a);0<=c&&(this.X(),this.v()[c]=d,this.W())}};a.a.u("pop push reverse shift sort splice unshift".split(" "),function(b){a.aa.fn[b]=function(){var a=this.v();this.X();this.sb(a,b,arguments);a=a[b].apply(a,arguments);this.W();
return a}});a.a.u(["slice"],function(b){a.aa.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.a.xa&&a.a.za(a.aa.fn,a.p.fn);a.b("observableArray",a.aa);var J="arrayChange";a.La.trackArrayChanges=function(b){function d(){if(!c){c=!0;var d=b.notifySubscribers;b.notifySubscribers=function(a,b){b&&b!==G||++g;return d.apply(this,arguments)};var f=[].concat(b.v()||[]);e=null;b.U(function(c){c=[].concat(c||[]);if(b.Ab(J)){var d;if(!e||1<g)e=a.a.Fa(f,c,{sparse:!0});d=e;d.length&&b.notifySubscribers(d,
J)}f=c;e=null;g=0})}}if(!b.sb){var c=!1,e=null,g=0,h=b.U;b.U=b.subscribe=function(a,b,c){c===J&&d();return h.apply(this,arguments)};b.sb=function(b,d,m){function l(a,b,c){return q[q.length]={status:a,value:b,index:c}}if(c&&!g){var q=[],h=b.length,t=m.length,z=0;switch(d){case "push":z=h;case "unshift":for(d=0;d<t;d++)l("added",m[d],z+d);break;case "pop":z=h-1;case "shift":h&&l("deleted",b[z],z);break;case "splice":d=Math.min(Math.max(0,0>m[0]?h+m[0]:m[0]),h);for(var h=1===t?h:Math.min(d+(m[1]||0),
h),t=d+t-2,z=Math.max(h,t),u=[],r=[],E=2;d<z;++d,++E)d<h&&r.push(l("deleted",b[d],d)),d<t&&u.push(l("added",m[E],d));a.a.wb(r,u);break;default:return}e=q}}}};a.s=a.j=function(b,d,c){function e(){a.a.G(v,function(a,b){b.K()});v={}}function g(){e();C=0;u=!0;n=!1}function h(){var a=f.throttleEvaluation;a&&0<=a?(clearTimeout(P),P=setTimeout(k,a)):f.ib?f.ib():k()}function k(b){if(t){if(E)throw Error("A 'pure' computed must not be called recursively");}else if(!u){if(w&&w()){if(!z){s();return}}else z=!1;
t=!0;if(y)try{var c={};a.k.Ea({wa:function(a,b){c[b]||(c[b]=1,++C)},s:f,ma:p});C=0;q=r.call(d)}finally{a.k.end(),t=!1}else try{var e=v,m=C;a.k.Ea({wa:function(a,b){u||(m&&e[b]?(v[b]=e[b],++C,delete e[b],--m):v[b]||(v[b]=a.U(h),++C))},s:f,ma:E?p:!C});v={};C=0;try{var l=d?r.call(d):r()}finally{a.k.end(),m&&a.a.G(e,function(a,b){b.K()}),n=!1}f.Pa(q,l)&&(f.notifySubscribers(q,"beforeChange"),q=l,!0!==b&&f.notifySubscribers(q))}finally{t=!1}C||s()}}function f(){if(0<arguments.length){if("function"===typeof O)O.apply(d,
arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");return this}a.k.Jb(f);n&&k(!0);return q}function m(){n&&!C&&k(!0);return q}function l(){return n||0<C}var q,n=!0,t=!1,z=!1,u=!1,r=b,E=!1,y=!1;r&&"object"==typeof r?(c=r,r=c.read):(c=c||{},r||(r=c.read));if("function"!=typeof r)throw Error("Pass a function that returns the value of the ko.computed");var O=c.write,x=c.disposeWhenNodeIsRemoved||
c.o||null,B=c.disposeWhen||c.Ia,w=B,s=g,v={},C=0,P=null;d||(d=c.owner);a.P.call(f);a.a.Aa(f,a.j.fn);f.v=m;f.la=function(){return C};f.hc="function"===typeof c.write;f.K=function(){s()};f.Z=l;var A=f.Ta;f.Ta=function(a){A.call(f,a);f.ib=function(){f.kb(q);n=!0;f.lb(f)}};c.pure?(y=E=!0,f.va=function(){y&&(y=!1,k(!0))},f.nb=function(){f.yb()||(e(),y=n=!0)}):c.deferEvaluation&&(f.va=function(){m();delete f.va});a.A(f,"peek",f.v);a.A(f,"dispose",f.K);a.A(f,"isActive",f.Z);a.A(f,"getDependenciesCount",
f.la);x&&(z=!0,x.nodeType&&(w=function(){return!a.a.Ja(x)||B&&B()}));y||c.deferEvaluation||k();x&&l()&&x.nodeType&&(s=function(){a.a.w.Kb(x,s);g()},a.a.w.da(x,s));return f};a.jc=function(b){return a.Ma(b,a.j)};A=a.p.rc;a.j[A]=a.p;a.j.fn={equalityComparer:H};a.j.fn[A]=a.j;a.a.xa&&a.a.za(a.j.fn,a.P.fn);a.b("dependentObservable",a.j);a.b("computed",a.j);a.b("isComputed",a.jc);a.Ib=function(b,d){if("function"===typeof b)return a.s(b,d,{pure:!0});b=a.a.extend({},b);b.pure=!0;return a.s(b,d)};a.b("pureComputed",
a.Ib);(function(){function b(a,g,h){h=h||new c;a=g(a);if("object"!=typeof a||null===a||a===p||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var k=a instanceof Array?[]:{};h.save(a,k);d(a,function(c){var d=g(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":k[c]=d;break;case "object":case "undefined":var l=h.get(d);k[c]=l!==p?l:b(d,g,h)}});return k}function d(a,b){if(a instanceof Array){for(var c=0;c<a.length;c++)b(c);"function"==
typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function c(){this.keys=[];this.hb=[]}a.Qb=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.C(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.Qb(b);return a.a.eb(b,c,d)};c.prototype={save:function(b,c){var d=a.a.m(this.keys,b);0<=d?this.hb[d]=c:(this.keys.push(b),this.hb.push(c))},get:function(b){b=a.a.m(this.keys,b);return 0<=b?this.hb[b]:p}}})();
a.b("toJS",a.Qb);a.b("toJSON",a.toJSON);(function(){a.i={q:function(b){switch(a.a.t(b)){case "option":return!0===b.__ko__hasDomDataOptionValue__?a.a.e.get(b,a.d.options.Va):7>=a.a.L?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.i.q(b.options[b.selectedIndex]):p;default:return b.value}},ca:function(b,d,c){switch(a.a.t(b)){case "option":switch(typeof d){case "string":a.a.e.set(b,a.d.options.Va,p);"__ko__hasDomDataOptionValue__"in
b&&delete b.__ko__hasDomDataOptionValue__;b.value=d;break;default:a.a.e.set(b,a.d.options.Va,d),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===typeof d?d:""}break;case "select":if(""===d||null===d)d=p;for(var e=-1,g=0,h=b.options.length,k;g<h;++g)if(k=a.i.q(b.options[g]),k==d||""==k&&d===p){e=g;break}if(c||0<=e||d===p&&1<b.size)b.selectedIndex=e;break;default:if(null===d||d===p)d="";b.value=d}}}})();a.b("selectExtensions",a.i);a.b("selectExtensions.readValue",a.i.q);a.b("selectExtensions.writeValue",
a.i.ca);a.h=function(){function b(b){b=a.a.cb(b);123===b.charCodeAt(0)&&(b=b.slice(1,-1));var c=[],d=b.match(e),k,n,t=0;if(d){d.push(",");for(var z=0,u;u=d[z];++z){var r=u.charCodeAt(0);if(44===r){if(0>=t){k&&c.push(n?{key:k,value:n.join("")}:{unknown:k});k=n=t=0;continue}}else if(58===r){if(!n)continue}else if(47===r&&z&&1<u.length)(r=d[z-1].match(g))&&!h[r[0]]&&(b=b.substr(b.indexOf(u)+1),d=b.match(e),d.push(","),z=-1,u="/");else if(40===r||123===r||91===r)++t;else if(41===r||125===r||93===r)--t;
else if(!k&&!n){k=34===r||39===r?u.slice(1,-1):u;continue}n?n.push(u):n=[u]}}return c}var d=["true","false","null","undefined"],c=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),g=/[\])"'A-Za-z0-9_$]+$/,h={"in":1,"return":1,"typeof":1},k={};return{ha:[],V:k,Wa:b,ya:function(f,m){function e(b,m){var f;if(!z){var u=a.getBindingHandler(b);if(u&&u.preprocess&&
!(m=u.preprocess(m,b,e)))return;if(u=k[b])f=m,0<=a.a.m(d,f)?f=!1:(u=f.match(c),f=null===u?!1:u[1]?"Object("+u[1]+")"+u[2]:f),u=f;u&&h.push("'"+b+"':function(_z){"+f+"=_z}")}t&&(m="function(){return "+m+" }");g.push("'"+b+"':"+m)}m=m||{};var g=[],h=[],t=m.valueAccessors,z=m.bindingParams,u="string"===typeof f?b(f):f;a.a.u(u,function(a){e(a.key||a.unknown,a.value)});h.length&&e("_ko_property_writers","{"+h.join(",")+" }");return g.join(",")},lc:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==
b)return!0;return!1},pa:function(b,c,d,e,k){if(b&&a.C(b))!a.Ra(b)||k&&b.v()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.h);a.b("expressionRewriting.bindingRewriteValidators",a.h.ha);a.b("expressionRewriting.parseObjectLiteral",a.h.Wa);a.b("expressionRewriting.preProcessBindings",a.h.ya);a.b("expressionRewriting._twoWayBindings",a.h.V);a.b("jsonExpressionRewriting",a.h);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.h.ya);(function(){function b(a){return 8==
a.nodeType&&h.test(g?a.text:a.nodeValue)}function d(a){return 8==a.nodeType&&k.test(g?a.text:a.nodeValue)}function c(a,c){for(var f=a,e=1,k=[];f=f.nextSibling;){if(d(f)&&(e--,0===e))return k;k.push(f);b(f)&&e++}if(!c)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var d=c(a,b);return d?0<d.length?d[d.length-1].nextSibling:a.nextSibling:null}var g=v&&"\x3c!--test--\x3e"===v.createComment("test").text,h=g?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,
k=g?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,f={ul:!0,ol:!0};a.f={Q:{},childNodes:function(a){return b(a)?c(a):a.childNodes},ja:function(c){if(b(c)){c=a.f.childNodes(c);for(var d=0,f=c.length;d<f;d++)a.removeNode(c[d])}else a.a.Ka(c)},T:function(c,d){if(b(c)){a.f.ja(c);for(var f=c.nextSibling,e=0,k=d.length;e<k;e++)f.parentNode.insertBefore(d[e],f)}else a.a.T(c,d)},Hb:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},Bb:function(c,
d,f){f?b(c)?c.parentNode.insertBefore(d,f.nextSibling):f.nextSibling?c.insertBefore(d,f.nextSibling):c.appendChild(d):a.f.Hb(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||d(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&d(a.nextSibling)?null:a.nextSibling},gc:b,xc:function(a){return(a=(g?a.text:a.nodeValue).match(h))?a[1]:null},Fb:function(c){if(f[a.a.t(c)]){var k=c.firstChild;if(k){do if(1===k.nodeType){var g;g=k.firstChild;
var h=null;if(g){do if(h)h.push(g);else if(b(g)){var t=e(g,!0);t?g=t:h=[g]}else d(g)&&(h=[g]);while(g=g.nextSibling)}if(g=h)for(h=k.nextSibling,t=0;t<g.length;t++)h?c.insertBefore(g[t],h):c.appendChild(g[t])}while(k=k.nextSibling)}}}}})();a.b("virtualElements",a.f);a.b("virtualElements.allowedBindings",a.f.Q);a.b("virtualElements.emptyNode",a.f.ja);a.b("virtualElements.insertAfter",a.f.Bb);a.b("virtualElements.prepend",a.f.Hb);a.b("virtualElements.setDomNodeChildren",a.f.T);(function(){a.J=function(){this.Yb=
{}};a.a.extend(a.J.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=b.getAttribute("data-bind")||a.g.getComponentNameForNode(b);case 8:return a.f.gc(b);default:return!1}},getBindings:function(b,d){var c=this.getBindingsString(b,d),c=c?this.parseBindingsString(c,d,b):null;return a.g.mb(c,b,d,!1)},getBindingAccessors:function(b,d){var c=this.getBindingsString(b,d),c=c?this.parseBindingsString(c,d,b,{valueAccessors:!0}):null;return a.g.mb(c,b,d,!0)},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");
case 8:return a.f.xc(b);default:return null}},parseBindingsString:function(b,d,c,e){try{var g=this.Yb,h=b+(e&&e.valueAccessors||""),k;if(!(k=g[h])){var f,m="with($context){with($data||{}){return{"+a.h.ya(b,e)+"}}}";f=new Function("$context","$element",m);k=g[h]=f}return k(d,c)}catch(l){throw l.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+l.message,l;}}});a.J.instance=new a.J})();a.b("bindingProvider",a.J);(function(){function b(a){return function(){return a}}function d(a){return a()}
function c(b){return a.a.na(a.k.B(b),function(a,c){return function(){return b()[c]}})}function e(a,b){return c(this.getBindings.bind(this,a,b))}function g(b,c,d){var f,e=a.f.firstChild(c),k=a.J.instance,g=k.preprocessNode;if(g){for(;f=e;)e=a.f.nextSibling(f),g.call(k,f);e=a.f.firstChild(c)}for(;f=e;)e=a.f.nextSibling(f),h(b,f,d)}function h(b,c,d){var e=!0,k=1===c.nodeType;k&&a.f.Fb(c);if(k&&d||a.J.instance.nodeHasBindings(c))e=f(c,null,b,d).shouldBindDescendants;e&&!l[a.a.t(c)]&&g(b,c,!k)}function k(b){var c=
[],d={},f=[];a.a.G(b,function y(e){if(!d[e]){var k=a.getBindingHandler(e);k&&(k.after&&(f.push(e),a.a.u(k.after,function(c){if(b[c]){if(-1!==a.a.m(f,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+f.join(", "));y(c)}}),f.length--),c.push({key:e,zb:k}));d[e]=!0}});return c}function f(b,c,f,g){var m=a.a.e.get(b,q);if(!c){if(m)throw Error("You cannot apply bindings multiple times to the same element.");a.a.e.set(b,q,!0)}!m&&g&&a.Ob(b,f);var l;if(c&&"function"!==
typeof c)l=c;else{var h=a.J.instance,n=h.getBindingAccessors||e,s=a.j(function(){(l=c?c(f,b):n.call(h,b,f))&&f.I&&f.I();return l},null,{o:b});l&&s.Z()||(s=null)}var v;if(l){var w=s?function(a){return function(){return d(s()[a])}}:function(a){return l[a]},A=function(){return a.a.na(s?s():l,d)};A.get=function(a){return l[a]&&d(w(a))};A.has=function(a){return a in l};g=k(l);a.a.u(g,function(c){var d=c.zb.init,e=c.zb.update,k=c.key;if(8===b.nodeType&&!a.f.Q[k])throw Error("The binding '"+k+"' cannot be used with virtual elements");
try{"function"==typeof d&&a.k.B(function(){var a=d(b,w(k),A,f.$data,f);if(a&&a.controlsDescendantBindings){if(v!==p)throw Error("Multiple bindings ("+v+" and "+k+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");v=k}}),"function"==typeof e&&a.j(function(){e(b,w(k),A,f.$data,f)},null,{o:b})}catch(g){throw g.message='Unable to process binding "'+k+": "+l[k]+'"\nMessage: '+g.message,g;}})}return{shouldBindDescendants:v===p}}
function m(b){return b&&b instanceof a.N?b:new a.N(b)}a.d={};var l={script:!0};a.getBindingHandler=function(b){return a.d[b]};a.N=function(b,c,d,f){var e=this,k="function"==typeof b&&!a.C(b),g,m=a.j(function(){var g=k?b():b,l=a.a.c(g);c?(c.I&&c.I(),a.a.extend(e,c),m&&(e.I=m)):(e.$parents=[],e.$root=l,e.ko=a);e.$rawData=g;e.$data=l;d&&(e[d]=l);f&&f(e,c,l);return e.$data},null,{Ia:function(){return g&&!a.a.ob(g)},o:!0});m.Z()&&(e.I=m,m.equalityComparer=null,g=[],m.Tb=function(b){g.push(b);a.a.w.da(b,
function(b){a.a.ua(g,b);g.length||(m.K(),e.I=m=p)})})};a.N.prototype.createChildContext=function(b,c,d){return new a.N(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)})};a.N.prototype.extend=function(b){return new a.N(this.I||this.$data,this,null,function(c,d){c.$rawData=d.$rawData;a.a.extend(c,"function"==typeof b?b():b)})};var q=a.a.e.F(),n=a.a.e.F();a.Ob=function(b,c){if(2==arguments.length)a.a.e.set(b,n,c),
c.I&&c.I.Tb(b);else return a.a.e.get(b,n)};a.ra=function(b,c,d){1===b.nodeType&&a.f.Fb(b);return f(b,c,m(d),!0)};a.Wb=function(d,f,e){e=m(e);return a.ra(d,"function"===typeof f?c(f.bind(null,e,d)):a.a.na(f,b),e)};a.Ca=function(a,b){1!==b.nodeType&&8!==b.nodeType||g(m(a),b,!0)};a.pb=function(a,b){!w&&s.jQuery&&(w=s.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||s.document.body;h(m(a),
b,!0)};a.Ha=function(b){switch(b.nodeType){case 1:case 8:var c=a.Ob(b);if(c)return c;if(b.parentNode)return a.Ha(b.parentNode)}return p};a.$b=function(b){return(b=a.Ha(b))?b.$data:p};a.b("bindingHandlers",a.d);a.b("applyBindings",a.pb);a.b("applyBindingsToDescendants",a.Ca);a.b("applyBindingAccessorsToNode",a.ra);a.b("applyBindingsToNode",a.Wb);a.b("contextFor",a.Ha);a.b("dataFor",a.$b)})();(function(b){function d(d,f){var e=g.hasOwnProperty(d)?g[d]:b,l;e||(e=g[d]=new a.P,c(d,function(a){h[d]=a;delete g[d];
l?e.notifySubscribers(a):setTimeout(function(){e.notifySubscribers(a)},0)}),l=!0);e.U(f)}function c(a,b){e("getConfig",[a],function(c){c?e("loadComponent",[a,c],function(a){b(a)}):b(null)})}function e(c,d,g,l){l||(l=a.g.loaders.slice(0));var h=l.shift();if(h){var n=h[c];if(n){var t=!1;if(n.apply(h,d.concat(function(a){t?g(null):null!==a?g(a):e(c,d,g,l)}))!==b&&(t=!0,!h.suppressLoaderExceptions))throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.");
}else e(c,d,g,l)}else g(null)}var g={},h={};a.g={get:function(a,c){var e=h.hasOwnProperty(a)?h[a]:b;e?setTimeout(function(){c(e)},0):d(a,c)},tb:function(a){delete h[a]},jb:e};a.g.loaders=[];a.b("components",a.g);a.b("components.get",a.g.get);a.b("components.clearCachedDefinition",a.g.tb)})();(function(){function b(b,c,d,e){function k(){0===--u&&e(h)}var h={},u=2,r=d.template;d=d.viewModel;r?g(c,r,function(c){a.g.jb("loadTemplate",[b,c],function(a){h.template=a;k()})}):k();d?g(c,d,function(c){a.g.jb("loadViewModel",
[b,c],function(a){h[f]=a;k()})}):k()}function d(a,b,c){if("function"===typeof b)c(function(a){return new b(a)});else if("function"===typeof b[f])c(b[f]);else if("instance"in b){var e=b.instance;c(function(){return e})}else"viewModel"in b?d(a,b.viewModel,c):a("Unknown viewModel value: "+b)}function c(b){switch(a.a.t(b)){case "script":return a.a.ba(b.text);case "textarea":return a.a.ba(b.value);case "template":if(e(b.content))return a.a.ia(b.content.childNodes)}return a.a.ia(b.childNodes)}function e(a){return s.DocumentFragment?
a instanceof DocumentFragment:a&&11===a.nodeType}function g(a,b,c){"string"===typeof b.require?N||s.require?(N||s.require)([b.require],c):a("Uses require, but no AMD loader is present"):c(b)}function h(a){return function(b){throw Error("Component '"+a+"': "+b);}}var k={};a.g.tc=function(b,c){if(!c)throw Error("Invalid configuration for "+b);if(a.g.Qa(b))throw Error("Component "+b+" is already registered");k[b]=c};a.g.Qa=function(a){return a in k};a.g.wc=function(b){delete k[b];a.g.tb(b)};a.g.ub={getConfig:function(a,
b){b(k.hasOwnProperty(a)?k[a]:null)},loadComponent:function(a,c,d){var e=h(a);g(e,c,function(c){b(a,e,c,d)})},loadTemplate:function(b,d,f){b=h(b);if("string"===typeof d)f(a.a.ba(d));else if(d instanceof Array)f(d);else if(e(d))f(a.a.S(d.childNodes));else if(d.element)if(d=d.element,s.HTMLElement?d instanceof HTMLElement:d&&d.tagName&&1===d.nodeType)f(c(d));else if("string"===typeof d){var k=v.getElementById(d);k?f(c(k)):b("Cannot find element with ID "+d)}else b("Unknown element type: "+d);else b("Unknown template value: "+
d)},loadViewModel:function(a,b,c){d(h(a),b,c)}};var f="createViewModel";a.b("components.register",a.g.tc);a.b("components.isRegistered",a.g.Qa);a.b("components.unregister",a.g.wc);a.b("components.defaultLoader",a.g.ub);a.g.loaders.push(a.g.ub);a.g.Ub=k})();(function(){function b(b,e){var g=b.getAttribute("params");if(g){var g=d.parseBindingsString(g,e,b,{valueAccessors:!0,bindingParams:!0}),g=a.a.na(g,function(d){return a.s(d,null,{o:b})}),h=a.a.na(g,function(d){return d.Z()?a.s(function(){return a.a.c(d())},
null,{o:b}):d.v()});h.hasOwnProperty("$raw")||(h.$raw=g);return h}return{$raw:{}}}a.g.getComponentNameForNode=function(b){b=a.a.t(b);return a.g.Qa(b)&&b};a.g.mb=function(c,d,g,h){if(1===d.nodeType){var k=a.g.getComponentNameForNode(d);if(k){c=c||{};if(c.component)throw Error('Cannot use the "component" binding on a custom element matching a component');var f={name:k,params:b(d,g)};c.component=h?function(){return f}:f}}return c};var d=new a.J;9>a.a.L&&(a.g.register=function(a){return function(b){v.createElement(b);
return a.apply(this,arguments)}}(a.g.register),v.createDocumentFragment=function(b){return function(){var d=b(),g=a.g.Ub,h;for(h in g)g.hasOwnProperty(h)&&d.createElement(h);return d}}(v.createDocumentFragment))})();(function(){var b=0;a.d.component={init:function(d,c,e,g,h){function k(){var a=f&&f.dispose;"function"===typeof a&&a.call(f);m=null}var f,m;a.a.w.da(d,k);a.s(function(){var e=a.a.c(c()),g,n;"string"===typeof e?g=e:(g=a.a.c(e.name),n=a.a.c(e.params));if(!g)throw Error("No component name specified");
var t=m=++b;a.g.get(g,function(b){if(m===t){k();if(!b)throw Error("Unknown component '"+g+"'");var c=b.template;if(!c)throw Error("Component '"+g+"' has no template");c=a.a.ia(c);a.f.T(d,c);var c=n,e=b.createViewModel;b=e?e.call(b,c,{element:d}):c;c=h.createChildContext(b);f=b;a.Ca(c,d)}})},null,{o:d});return{controlsDescendantBindings:!0}}};a.f.Q.component=!0})();var Q={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,d){var c=a.a.c(d())||{};a.a.G(c,function(c,d){d=a.a.c(d);var h=
!1===d||null===d||d===p;h&&b.removeAttribute(c);8>=a.a.L&&c in Q?(c=Q[c],h?b.removeAttribute(c):b[c]=d):h||b.setAttribute(c,d.toString());"name"===c&&a.a.Mb(b,h?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,d,c){function e(){var e=b.checked,k=q?h():e;if(!a.Y.ma()&&(!f||e)){var g=a.k.B(d);m?l!==k?(e&&(a.a.ea(g,k,!0),a.a.ea(g,l,!1)),l=k):a.a.ea(g,k,e):a.h.pa(g,c,"checked",k,!0)}}function g(){var c=a.a.c(d());b.checked=m?0<=a.a.m(c,h()):k?c:h()===c}var h=a.Ib(function(){return c.has("checkedValue")?
a.a.c(c.get("checkedValue")):c.has("value")?a.a.c(c.get("value")):b.value}),k="checkbox"==b.type,f="radio"==b.type;if(k||f){var m=k&&a.a.c(d())instanceof Array,l=m?h():p,q=f||m;f&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.s(e,null,{o:b});a.a.n(b,"click",e);a.s(g,null,{o:b})}}};a.h.V.checked=!0;a.d.checkedValue={update:function(b,d){b.value=a.a.c(d())}}})();a.d.css={update:function(b,d){var c=a.a.c(d());"object"==typeof c?a.a.G(c,function(c,d){d=a.a.c(d);a.a.Ba(b,c,d)}):(c=String(c||""),
a.a.Ba(b,b.__ko__cssValue,!1),b.__ko__cssValue=c,a.a.Ba(b,c,!0))}};a.d.enable={update:function(b,d){var c=a.a.c(d());c&&b.disabled?b.removeAttribute("disabled"):c||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,d){a.d.enable.update(b,function(){return!a.a.c(d())})}};a.d.event={init:function(b,d,c,e,g){var h=d()||{};a.a.G(h,function(k){"string"==typeof k&&a.a.n(b,k,function(b){var h,l=d()[k];if(l){try{var q=a.a.S(arguments);e=g.$data;q.unshift(e);h=l.apply(e,q)}finally{!0!==h&&(b.preventDefault?
b.preventDefault():b.returnValue=!1)}!1===c.get(k+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.d.foreach={Eb:function(b){return function(){var d=b(),c=a.a.Xa(d);if(!c||"number"==typeof c.length)return{foreach:d,templateEngine:a.O.Oa};a.a.c(d);return{foreach:c.data,as:c.as,includeDestroyed:c.includeDestroyed,afterAdd:c.afterAdd,beforeRemove:c.beforeRemove,afterRender:c.afterRender,beforeMove:c.beforeMove,afterMove:c.afterMove,templateEngine:a.O.Oa}}},init:function(b,
d){return a.d.template.init(b,a.d.foreach.Eb(d))},update:function(b,d,c,e,g){return a.d.template.update(b,a.d.foreach.Eb(d),c,e,g)}};a.h.ha.foreach=!1;a.f.Q.foreach=!0;a.d.hasfocus={init:function(b,d,c){function e(e){b.__ko_hasfocusUpdating=!0;var f=b.ownerDocument;if("activeElement"in f){var g;try{g=f.activeElement}catch(h){g=f.body}e=g===b}f=d();a.h.pa(f,c,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var g=e.bind(null,!0),h=e.bind(null,!1);a.a.n(b,"focus",g);a.a.n(b,"focusin",
g);a.a.n(b,"blur",h);a.a.n(b,"focusout",h)},update:function(b,d){var c=!!a.a.c(d());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===c||(c?b.focus():b.blur(),a.k.B(a.a.oa,null,[b,c?"focusin":"focusout"]))}};a.h.V.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.h.V.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,d){a.a.$a(b,d())}};I("if");I("ifnot",!1,!0);I("with",!0,!1,function(a,d){return a.createChildContext(d)});var K={};a.d.options={init:function(b){if("select"!==
a.a.t(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,d,c){function e(){return a.a.ta(b.options,function(a){return a.selected})}function g(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function h(c,d){if(q.length){var e=0<=a.a.m(q,a.i.q(d[0]));a.a.Nb(d[0],e);n&&!e&&a.k.B(a.a.oa,null,[b,"change"])}}var k=0!=b.length&&b.multiple?b.scrollTop:null,f=a.a.c(d()),m=c.get("optionsIncludeDestroyed");
d={};var l,q;q=b.multiple?a.a.Da(e(),a.i.q):0<=b.selectedIndex?[a.i.q(b.options[b.selectedIndex])]:[];f&&("undefined"==typeof f.length&&(f=[f]),l=a.a.ta(f,function(b){return m||b===p||null===b||!a.a.c(b._destroy)}),c.has("optionsCaption")&&(f=a.a.c(c.get("optionsCaption")),null!==f&&f!==p&&l.unshift(K)));var n=!1;d.beforeRemove=function(a){b.removeChild(a)};f=h;c.has("optionsAfterRender")&&(f=function(b,d){h(0,d);a.k.B(c.get("optionsAfterRender"),null,[d[0],b!==K?b:p])});a.a.Za(b,l,function(d,e,f){f.length&&
(q=f[0].selected?[a.i.q(f[0])]:[],n=!0);e=b.ownerDocument.createElement("option");d===K?(a.a.bb(e,c.get("optionsCaption")),a.i.ca(e,p)):(f=g(d,c.get("optionsValue"),d),a.i.ca(e,a.a.c(f)),d=g(d,c.get("optionsText"),f),a.a.bb(e,d));return[e]},d,f);a.k.B(function(){c.get("valueAllowUnset")&&c.has("value")?a.i.ca(b,a.a.c(c.get("value")),!0):(b.multiple?q.length&&e().length<q.length:q.length&&0<=b.selectedIndex?a.i.q(b.options[b.selectedIndex])!==q[0]:q.length||0<=b.selectedIndex)&&a.a.oa(b,"change")});
a.a.dc(b);k&&20<Math.abs(k-b.scrollTop)&&(b.scrollTop=k)}};a.d.options.Va=a.a.e.F();a.d.selectedOptions={after:["options","foreach"],init:function(b,d,c){a.a.n(b,"change",function(){var e=d(),g=[];a.a.u(b.getElementsByTagName("option"),function(b){b.selected&&g.push(a.i.q(b))});a.h.pa(e,c,"selectedOptions",g)})},update:function(b,d){if("select"!=a.a.t(b))throw Error("values binding applies only to SELECT elements");var c=a.a.c(d());c&&"number"==typeof c.length&&a.a.u(b.getElementsByTagName("option"),
function(b){var d=0<=a.a.m(c,a.i.q(b));a.a.Nb(b,d)})}};a.h.V.selectedOptions=!0;a.d.style={update:function(b,d){var c=a.a.c(d()||{});a.a.G(c,function(c,d){d=a.a.c(d);if(null===d||d===p||!1===d)d="";b.style[c]=d})}};a.d.submit={init:function(b,d,c,e,g){if("function"!=typeof d())throw Error("The value for a submit binding must be a function");a.a.n(b,"submit",function(a){var c,e=d();try{c=e.call(g.$data,b)}finally{!0!==c&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},
update:function(b,d){a.a.bb(b,d())}};a.f.Q.text=!0;(function(){if(s&&s.navigator)var b=function(a){if(a)return parseFloat(a[1])},d=s.opera&&s.opera.version&&parseInt(s.opera.version()),c=s.navigator.userAgent,e=b(c.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),g=b(c.match(/Firefox\/([^ ]*)/));if(10>a.a.L)var h=a.a.e.F(),k=a.a.e.F(),f=function(b){var c=this.activeElement;(c=c&&a.a.e.get(c,k))&&c(b)},m=function(b,c){var d=b.ownerDocument;a.a.e.get(d,h)||(a.a.e.set(d,h,!0),a.a.n(d,"selectionchange",
f));a.a.e.set(b,k,c)};a.d.textInput={init:function(b,c,f){function k(c,d){a.a.n(b,c,d)}function h(){var d=a.a.c(c());if(null===d||d===p)d="";v!==p&&d===v?setTimeout(h,4):b.value!==d&&(s=d,b.value=d)}function u(){y||(v=b.value,y=setTimeout(r,4))}function r(){clearTimeout(y);v=y=p;var d=b.value;s!==d&&(s=d,a.h.pa(c(),f,"textInput",d))}var s=b.value,y,v;10>a.a.L?(k("propertychange",function(a){"value"===a.propertyName&&r()}),8==a.a.L&&(k("keyup",r),k("keydown",r)),8<=a.a.L&&(m(b,r),k("dragend",u))):
(k("input",r),5>e&&"textarea"===a.a.t(b)?(k("keydown",u),k("paste",u),k("cut",u)):11>d?k("keydown",u):4>g&&(k("DOMAutoComplete",r),k("dragdrop",r),k("drop",r)));k("change",r);a.s(h,null,{o:b})}};a.h.V.textInput=!0;a.d.textinput={preprocess:function(a,b,c){c("textInput",a)}}})();a.d.uniqueName={init:function(b,d){if(d()){var c="ko_unique_"+ ++a.d.uniqueName.Zb;a.a.Mb(b,c)}}};a.d.uniqueName.Zb=0;a.d.value={after:["options","foreach"],init:function(b,d,c){if("input"!=b.tagName.toLowerCase()||"checkbox"!=
b.type&&"radio"!=b.type){var e=["change"],g=c.get("valueUpdate"),h=!1,k=null;g&&("string"==typeof g&&(g=[g]),a.a.ga(e,g),e=a.a.rb(e));var f=function(){k=null;h=!1;var e=d(),f=a.i.q(b);a.h.pa(e,c,"value",f)};!a.a.L||"input"!=b.tagName.toLowerCase()||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||-1!=a.a.m(e,"propertychange")||(a.a.n(b,"propertychange",function(){h=!0}),a.a.n(b,"focus",function(){h=!1}),a.a.n(b,"blur",function(){h&&f()}));a.a.u(e,function(c){var d=f;a.a.vc(c,
"after")&&(d=function(){k=a.i.q(b);setTimeout(f,0)},c=c.substring(5));a.a.n(b,c,d)});var m=function(){var e=a.a.c(d()),f=a.i.q(b);if(null!==k&&e===k)setTimeout(m,0);else if(e!==f)if("select"===a.a.t(b)){var g=c.get("valueAllowUnset"),f=function(){a.i.ca(b,e,g)};f();g||e===a.i.q(b)?setTimeout(f,0):a.k.B(a.a.oa,null,[b,"change"])}else a.i.ca(b,e)};a.s(m,null,{o:b})}else a.ra(b,{checkedValue:d})},update:function(){}};a.h.V.value=!0;a.d.visible={update:function(b,d){var c=a.a.c(d()),e="none"!=b.style.display;
c&&!e?b.style.display="":!c&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(d,c,e,g,h){return a.d.event.init.call(this,d,function(){var a={};a[b]=c();return a},e,g,h)}}})("click");a.H=function(){};a.H.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};a.H.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.H.prototype.makeTemplateSource=function(b,d){if("string"==typeof b){d=d||v;var c=
d.getElementById(b);if(!c)throw Error("Cannot find template with ID "+b);return new a.r.l(c)}if(1==b.nodeType||8==b.nodeType)return new a.r.fa(b);throw Error("Unknown template type: "+b);};a.H.prototype.renderTemplate=function(a,d,c,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,d,c)};a.H.prototype.isTemplateRewritten=function(a,d){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,d).data("isRewritten")};a.H.prototype.rewriteTemplate=function(a,d,c){a=this.makeTemplateSource(a,
c);d=d(a.text());a.text(d);a.data("isRewritten",!0)};a.b("templateEngine",a.H);a.fb=function(){function b(b,c,d,k){b=a.h.Wa(b);for(var f=a.h.ha,m=0;m<b.length;m++){var l=b[m].key;if(f.hasOwnProperty(l)){var q=f[l];if("function"===typeof q){if(l=q(b[m].value))throw Error(l);}else if(!q)throw Error("This template engine does not support the '"+l+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.h.ya(b,{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+
"')";return k.createJavaScriptEvaluatorBlock(d)+c}var d=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,c=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{ec:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.fb.nc(b,c)},d)},nc:function(a,g){return a.replace(d,function(a,c,d,e,l){return b(l,c,d,g)}).replace(c,function(a,c){return b(c,"\x3c!-- ko --\x3e","#comment",g)})},Xb:function(b,c){return a.D.Ua(function(d,
k){var f=d.nextSibling;f&&f.nodeName.toLowerCase()===c&&a.ra(f,b,k)})}}}();a.b("__tr_ambtns",a.fb.Xb);(function(){a.r={};a.r.l=function(a){this.l=a};a.r.l.prototype.text=function(){var b=a.a.t(this.l),b="script"===b?"text":"textarea"===b?"value":"innerHTML";if(0==arguments.length)return this.l[b];var d=arguments[0];"innerHTML"===b?a.a.$a(this.l,d):this.l[b]=d};var b=a.a.e.F()+"_";a.r.l.prototype.data=function(c){if(1===arguments.length)return a.a.e.get(this.l,b+c);a.a.e.set(this.l,b+c,arguments[1])};
var d=a.a.e.F();a.r.fa=function(a){this.l=a};a.r.fa.prototype=new a.r.l;a.r.fa.prototype.text=function(){if(0==arguments.length){var b=a.a.e.get(this.l,d)||{};b.gb===p&&b.Ga&&(b.gb=b.Ga.innerHTML);return b.gb}a.a.e.set(this.l,d,{gb:arguments[0]})};a.r.l.prototype.nodes=function(){if(0==arguments.length)return(a.a.e.get(this.l,d)||{}).Ga;a.a.e.set(this.l,d,{Ga:arguments[0]})};a.b("templateSources",a.r);a.b("templateSources.domElement",a.r.l);a.b("templateSources.anonymousTemplate",a.r.fa)})();(function(){function b(b,
c,d){var e;for(c=a.f.nextSibling(c);b&&(e=b)!==c;)b=a.f.nextSibling(e),d(e,b)}function d(c,d){if(c.length){var e=c[0],g=c[c.length-1],h=e.parentNode,n=a.J.instance,t=n.preprocessNode;if(t){b(e,g,function(a,b){var c=a.previousSibling,d=t.call(n,a);d&&(a===e&&(e=d[0]||b),a===g&&(g=d[d.length-1]||c))});c.length=0;if(!e)return;e===g?c.push(e):(c.push(e,g),a.a.ka(c,h))}b(e,g,function(b){1!==b.nodeType&&8!==b.nodeType||a.pb(d,b)});b(e,g,function(b){1!==b.nodeType&&8!==b.nodeType||a.D.Sb(b,[d])});a.a.ka(c,
h)}}function c(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,h,l,q){q=q||{};var n=b&&c(b),n=n&&n.ownerDocument,t=q.templateEngine||g;a.fb.ec(h,t,n);h=t.renderTemplate(h,l,q,n);if("number"!=typeof h.length||0<h.length&&"number"!=typeof h[0].nodeType)throw Error("Template engine must return an array of DOM nodes");n=!1;switch(e){case "replaceChildren":a.f.T(b,h);n=!0;break;case "replaceNode":a.a.Lb(b,h);n=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+
e);}n&&(d(h,l),q.afterRender&&a.k.B(q.afterRender,null,[h,l.$data]));return h}var g;a.ab=function(b){if(b!=p&&!(b instanceof a.H))throw Error("templateEngine must inherit from ko.templateEngine");g=b};a.Ya=function(b,d,h,l,q){h=h||{};if((h.templateEngine||g)==p)throw Error("Set a template engine before calling renderTemplate");q=q||"replaceChildren";if(l){var n=c(l);return a.j(function(){var g=d&&d instanceof a.N?d:new a.N(a.a.c(d)),p=a.C(b)?b():"function"===typeof b?b(g.$data,g):b,g=e(l,q,p,g,h);
"replaceNode"==q&&(l=g,n=c(l))},null,{Ia:function(){return!n||!a.a.Ja(n)},o:n&&"replaceNode"==q?n.parentNode:n})}return a.D.Ua(function(c){a.Ya(b,d,h,c,"replaceNode")})};a.uc=function(b,c,g,h,q){function n(a,b){d(b,s);g.afterRender&&g.afterRender(b,a)}function t(c,d){s=q.createChildContext(c,g.as,function(a){a.$index=d});var f=a.C(b)?b():"function"===typeof b?b(c,s):b;return e(null,"ignoreTargetNode",f,s,g)}var s;return a.j(function(){var b=a.a.c(c)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.ta(b,
function(b){return g.includeDestroyed||b===p||null===b||!a.a.c(b._destroy)});a.k.B(a.a.Za,null,[h,b,t,g,n])},null,{o:h})};var h=a.a.e.F();a.d.template={init:function(b,c){var d=a.a.c(c());"string"==typeof d||d.name?a.f.ja(b):(d=a.f.childNodes(b),d=a.a.oc(d),(new a.r.fa(b)).nodes(d));return{controlsDescendantBindings:!0}},update:function(b,c,d,e,g){var n=c(),t;c=a.a.c(n);d=!0;e=null;"string"==typeof c?c={}:(n=c.name,"if"in c&&(d=a.a.c(c["if"])),d&&"ifnot"in c&&(d=!a.a.c(c.ifnot)),t=a.a.c(c.data));
"foreach"in c?e=a.uc(n||b,d&&c.foreach||[],c,b,g):d?(g="data"in c?g.createChildContext(t,c.as):g,e=a.Ya(n||b,g,c,b)):a.f.ja(b);g=e;(t=a.a.e.get(b,h))&&"function"==typeof t.K&&t.K();a.a.e.set(b,h,g&&g.Z()?g:p)}};a.h.ha.template=function(b){b=a.h.Wa(b);return 1==b.length&&b[0].unknown||a.h.lc(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.f.Q.template=!0})();a.b("setTemplateEngine",a.ab);a.b("renderTemplate",a.Ya);a.a.wb=function(a,d,c){if(a.length&&
d.length){var e,g,h,k,f;for(e=g=0;(!c||e<c)&&(k=a[g]);++g){for(h=0;f=d[h];++h)if(k.value===f.value){k.moved=f.index;f.moved=k.index;d.splice(h,1);e=h=0;break}e+=h}}};a.a.Fa=function(){function b(b,c,e,g,h){var k=Math.min,f=Math.max,m=[],l,q=b.length,n,p=c.length,s=p-q||1,u=q+p+1,r,v,w;for(l=0;l<=q;l++)for(v=r,m.push(r=[]),w=k(p,l+s),n=f(0,l-1);n<=w;n++)r[n]=n?l?b[l-1]===c[n-1]?v[n-1]:k(v[n]||u,r[n-1]||u)+1:n+1:l+1;k=[];f=[];s=[];l=q;for(n=p;l||n;)p=m[l][n]-1,n&&p===m[l][n-1]?f.push(k[k.length]={status:e,
value:c[--n],index:n}):l&&p===m[l-1][n]?s.push(k[k.length]={status:g,value:b[--l],index:l}):(--n,--l,h.sparse||k.push({status:"retained",value:c[n]}));a.a.wb(f,s,10*q);return k.reverse()}return function(a,c,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];c=c||[];return a.length<=c.length?b(a,c,"added","deleted",e):b(c,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.Fa);(function(){function b(b,d,g,h,k){var f=[],m=a.j(function(){var l=d(g,k,a.a.ka(f,b))||[];0<f.length&&(a.a.Lb(f,
l),h&&a.k.B(h,null,[g,l,k]));f.length=0;a.a.ga(f,l)},null,{o:b,Ia:function(){return!a.a.ob(f)}});return{$:f,j:m.Z()?m:p}}var d=a.a.e.F();a.a.Za=function(c,e,g,h,k){function f(b,d){x=q[d];r!==d&&(A[b]=x);x.Na(r++);a.a.ka(x.$,c);s.push(x);w.push(x)}function m(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.u(c[d].$,function(a){b(a,d,c[d].sa)})}e=e||[];h=h||{};var l=a.a.e.get(c,d)===p,q=a.a.e.get(c,d)||[],n=a.a.Da(q,function(a){return a.sa}),t=a.a.Fa(n,e,h.dontLimitMoves),s=[],u=0,r=0,v=[],w=[];e=
[];for(var A=[],n=[],x,B=0,D,F;D=t[B];B++)switch(F=D.moved,D.status){case "deleted":F===p&&(x=q[u],x.j&&x.j.K(),v.push.apply(v,a.a.ka(x.$,c)),h.beforeRemove&&(e[B]=x,w.push(x)));u++;break;case "retained":f(B,u++);break;case "added":F!==p?f(B,F):(x={sa:D.value,Na:a.p(r++)},s.push(x),w.push(x),l||(n[B]=x))}m(h.beforeMove,A);a.a.u(v,h.beforeRemove?a.R:a.removeNode);for(var B=0,l=a.f.firstChild(c),G;x=w[B];B++){x.$||a.a.extend(x,b(c,g,x.sa,k,x.Na));for(u=0;t=x.$[u];l=t.nextSibling,G=t,u++)t!==l&&a.f.Bb(c,
t,G);!x.ic&&k&&(k(x.sa,x.$,x.Na),x.ic=!0)}m(h.beforeRemove,e);m(h.afterMove,A);m(h.afterAdd,n);a.a.e.set(c,d,s)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Za);a.O=function(){this.allowTemplateRewriting=!1};a.O.prototype=new a.H;a.O.prototype.renderTemplateSource=function(b){var d=(9>a.a.L?0:b.nodes)?b.nodes():null;if(d)return a.a.S(d.cloneNode(!0).childNodes);b=b.text();return a.a.ba(b)};a.O.Oa=new a.O;a.ab(a.O.Oa);a.b("nativeTemplateEngine",a.O);(function(){a.Sa=function(){var a=this.kc=
function(){if(!w||!w.tmpl)return 0;try{if(0<=w.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,g){g=g||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=w.template(null,"{{ko_with $item.koBindingContext}}"+h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=w.extend({koBindingContext:e},g.templateOptions);e=w.tmpl(h,
b,e);e.appendTo(v.createElement("div"));w.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){v.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(w.tmpl.tag.ko_code={open:"__.push($1 || '');"},w.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.Sa.prototype=new a.H;var b=new a.Sa;0<b.kc&&a.ab(b);a.b("jqueryTmplTemplateEngine",a.Sa)})()})})();})();


/**
 * gridstack.js 0.2.6
 * http://troolee.github.io/gridstack.js/
 * (c) 2014-2016 Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
 * @preserve
*/
!function(a){if("function"==typeof define&&define.amd)define(["jquery","lodash","jquery-ui/data","jquery-ui/disable-selection","jquery-ui/focusable","jquery-ui/form","jquery-ui/ie","jquery-ui/keycode","jquery-ui/labels","jquery-ui/jquery-1-7","jquery-ui/plugin","jquery-ui/safe-active-element","jquery-ui/safe-blur","jquery-ui/scroll-parent","jquery-ui/tabbable","jquery-ui/unique-id","jquery-ui/version","jquery-ui/widget","jquery-ui/widgets/mouse","jquery-ui/widgets/draggable","jquery-ui/widgets/droppable","jquery-ui/widgets/resizable"],a);else if("undefined"!=typeof exports){try{jQuery=require("jquery")}catch(b){}try{_=require("lodash")}catch(b){}a(jQuery,_)}else a(jQuery,_)}(function(a,b){var c=window,d=function(a,b,c){var d=function(){return console.warn("gridstack.js: Function `"+b+"` is deprecated as of v0.2.5 and has been replaced with `"+c+"`. It will be **completely** removed in v1.0."),a.apply(this,arguments)};return d.prototype=a.prototype,d},e=function(a,b){console.warn("gridstack.js: Option `"+a+"` is deprecated as of v0.2.5 and has been replaced with `"+b+"`. It will be **completely** removed in v1.0.")},f={isIntercepted:function(a,b){return!(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y)},sort:function(a,c,d){return d=d||b.chain(a).map(function(a){return a.x+a.width}).max().value(),c=c!=-1?1:-1,b.sortBy(a,function(a){return c*(a.x+a.y*d)})},createStylesheet:function(a){var b=document.createElement("style");return b.setAttribute("type","text/css"),b.setAttribute("data-gs-style-id",a),b.styleSheet?b.styleSheet.cssText="":b.appendChild(document.createTextNode("")),document.getElementsByTagName("head")[0].appendChild(b),b.sheet},removeStylesheet:function(b){a("STYLE[data-gs-style-id="+b+"]").remove()},insertCSSRule:function(a,b,c,d){"function"==typeof a.insertRule?a.insertRule(b+"{"+c+"}",d):"function"==typeof a.addRule&&a.addRule(b,c,d)},toBool:function(a){return"boolean"==typeof a?a:"string"==typeof a?(a=a.toLowerCase(),!(""===a||"no"==a||"false"==a||"0"==a)):Boolean(a)},_collisionNodeCheck:function(a){return a!=this.node&&f.isIntercepted(a,this.nn)},_didCollide:function(a){return f.isIntercepted({x:this.n.x,y:this.newY,width:this.n.width,height:this.n.height},a)},_isAddNodeIntercepted:function(a){return f.isIntercepted({x:this.x,y:this.y,width:this.node.width,height:this.node.height},a)},parseHeight:function(a){var c=a,d="px";if(c&&b.isString(c)){var e=c.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw)?$/);if(!e)throw new Error("Invalid height");d=e[2]||"px",c=parseFloat(e[1])}return{height:c,unit:d}}};
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
f.is_intercepted=d(f.isIntercepted,"is_intercepted","isIntercepted"),f.create_stylesheet=d(f.createStylesheet,"create_stylesheet","createStylesheet"),f.remove_stylesheet=d(f.removeStylesheet,"remove_stylesheet","removeStylesheet"),f.insert_css_rule=d(f.insertCSSRule,"insert_css_rule","insertCSSRule");
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
var g=0,h=function(a,b,c,d,e){this.width=a,this["float"]=c||!1,this.height=d||0,this.nodes=e||[],this.onchange=b||function(){},this._updateCounter=0,this._float=this["float"],this._addedNodes=[],this._removedNodes=[]};h.prototype.batchUpdate=function(){this._updateCounter=1,this["float"]=!0},h.prototype.commit=function(){0!==this._updateCounter&&(this._updateCounter=0,this["float"]=this._float,this._packNodes(),this._notify())},
// For Meteor support: https://github.com/troolee/gridstack.js/pull/272
h.prototype.getNodeDataByDOMEl=function(a){return b.find(this.nodes,function(b){return a.get(0)===b.el.get(0)})},h.prototype._fixCollisions=function(a){this._sortNodes(-1);var c=a,d=Boolean(b.find(this.nodes,function(a){return a.locked}));for(this["float"]||d||(c={x:0,y:a.y,width:this.width,height:a.height});;){var e=b.find(this.nodes,b.bind(f._collisionNodeCheck,{node:a,nn:c}));if("undefined"==typeof e)return;this.moveNode(e,e.x,a.y+a.height,e.width,e.height,!0)}},h.prototype.isAreaEmpty=function(a,c,d,e){var g={x:a||0,y:c||0,width:d||1,height:e||1},h=b.find(this.nodes,b.bind(function(a){return f.isIntercepted(a,g)},this));return null===h||"undefined"==typeof h},h.prototype._sortNodes=function(a){this.nodes=f.sort(this.nodes,a,this.width)},h.prototype._packNodes=function(){this._sortNodes(),this["float"]?b.each(this.nodes,b.bind(function(a,c){if(!a._updating&&"undefined"!=typeof a._origY&&a.y!=a._origY)for(var d=a.y;d>=a._origY;){var e=b.chain(this.nodes).find(b.bind(f._didCollide,{n:a,newY:d})).value();e||(a._dirty=!0,a.y=d),--d}},this)):b.each(this.nodes,b.bind(function(a,c){if(!a.locked)for(;a.y>0;){var d=a.y-1,e=0===c;if(c>0){var g=b.chain(this.nodes).take(c).find(b.bind(f._didCollide,{n:a,newY:d})).value();e="undefined"==typeof g}if(!e)break;a._dirty=a.y!=d,a.y=d}},this))},h.prototype._prepareNode=function(a,c){return a=b.defaults(a||{},{width:1,height:1,x:0,y:0}),a.x=parseInt(""+a.x),a.y=parseInt(""+a.y),a.width=parseInt(""+a.width),a.height=parseInt(""+a.height),a.autoPosition=a.autoPosition||!1,a.noResize=a.noResize||!1,a.noMove=a.noMove||!1,a.width>this.width?a.width=this.width:a.width<1&&(a.width=1),a.height<1&&(a.height=1),a.x<0&&(a.x=0),a.x+a.width>this.width&&(c?a.width=this.width-a.x:a.x=this.width-a.width),a.y<0&&(a.y=0),a},h.prototype._notify=function(){var a=Array.prototype.slice.call(arguments,0);if(a[0]="undefined"==typeof a[0]?[]:[a[0]],a[1]="undefined"==typeof a[1]||a[1],!this._updateCounter){var b=a[0].concat(this.getDirtyNodes());this.onchange(b,a[1])}},h.prototype.cleanNodes=function(){this._updateCounter||b.each(this.nodes,function(a){a._dirty=!1})},h.prototype.getDirtyNodes=function(){return b.filter(this.nodes,function(a){return a._dirty})},h.prototype.addNode=function(a,c){if(a=this._prepareNode(a),"undefined"!=typeof a.maxWidth&&(a.width=Math.min(a.width,a.maxWidth)),"undefined"!=typeof a.maxHeight&&(a.height=Math.min(a.height,a.maxHeight)),"undefined"!=typeof a.minWidth&&(a.width=Math.max(a.width,a.minWidth)),"undefined"!=typeof a.minHeight&&(a.height=Math.max(a.height,a.minHeight)),a._id=++g,a._dirty=!0,a.autoPosition){this._sortNodes();for(var d=0;;++d){var e=d%this.width,h=Math.floor(d/this.width);if(!(e+a.width>this.width||b.find(this.nodes,b.bind(f._isAddNodeIntercepted,{x:e,y:h,node:a})))){a.x=e,a.y=h;break}}}return this.nodes.push(a),"undefined"!=typeof c&&c&&this._addedNodes.push(b.clone(a)),this._fixCollisions(a),this._packNodes(),this._notify(),a},h.prototype.removeNode=function(a,c){c="undefined"==typeof c||c,this._removedNodes.push(b.clone(a)),a._id=null,this.nodes=b.without(this.nodes,a),this._packNodes(),this._notify(a,c)},h.prototype.canMoveNode=function(c,d,e,f,g){var i=Boolean(b.find(this.nodes,function(a){return a.locked}));if(!this.height&&!i)return!0;var j,k=new h(this.width,null,this["float"],0,b.map(this.nodes,function(b){return b==c?j=a.extend({},b):a.extend({},b)}));if("undefined"==typeof j)return!0;k.moveNode(j,d,e,f,g);var l=!0;return i&&(l&=!Boolean(b.find(k.nodes,function(a){return a!=j&&Boolean(a.locked)&&Boolean(a._dirty)}))),this.height&&(l&=k.getGridHeight()<=this.height),l},h.prototype.canBePlacedWithRespectToHeight=function(c){if(!this.height)return!0;var d=new h(this.width,null,this["float"],0,b.map(this.nodes,function(b){return a.extend({},b)}));return d.addNode(c),d.getGridHeight()<=this.height},h.prototype.moveNode=function(a,b,c,d,e,f){if("number"!=typeof b&&(b=a.x),"number"!=typeof c&&(c=a.y),"number"!=typeof d&&(d=a.width),"number"!=typeof e&&(e=a.height),"undefined"!=typeof a.maxWidth&&(d=Math.min(d,a.maxWidth)),"undefined"!=typeof a.maxHeight&&(e=Math.min(e,a.maxHeight)),"undefined"!=typeof a.minWidth&&(d=Math.max(d,a.minWidth)),"undefined"!=typeof a.minHeight&&(e=Math.max(e,a.minHeight)),a.x==b&&a.y==c&&a.width==d&&a.height==e)return a;var g=a.width!=d;return a._dirty=!0,a.x=b,a.y=c,a.width=d,a.height=e,a=this._prepareNode(a,g),this._fixCollisions(a),f||(this._packNodes(),this._notify()),a},h.prototype.getGridHeight=function(){return b.reduce(this.nodes,function(a,b){return Math.max(a,b.y+b.height)},0)},h.prototype.beginUpdate=function(a){b.each(this.nodes,function(a){a._origY=a.y}),a._updating=!0},h.prototype.endUpdate=function(){b.each(this.nodes,function(a){a._origY=a.y});var a=b.find(this.nodes,function(a){return a._updating});a&&(a._updating=!1)};var i=function(c,d){var f,g,i=this;d=d||{},this.container=a(c),
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
"undefined"!=typeof d.handle_class&&(d.handleClass=d.handle_class,e("handle_class","handleClass")),"undefined"!=typeof d.item_class&&(d.itemClass=d.item_class,e("item_class","itemClass")),"undefined"!=typeof d.placeholder_class&&(d.placeholderClass=d.placeholder_class,e("placeholder_class","placeholderClass")),"undefined"!=typeof d.placeholder_text&&(d.placeholderText=d.placeholder_text,e("placeholder_text","placeholderText")),"undefined"!=typeof d.cell_height&&(d.cellHeight=d.cell_height,e("cell_height","cellHeight")),"undefined"!=typeof d.vertical_margin&&(d.verticalMargin=d.vertical_margin,e("vertical_margin","verticalMargin")),"undefined"!=typeof d.min_width&&(d.minWidth=d.min_width,e("min_width","minWidth")),"undefined"!=typeof d.static_grid&&(d.staticGrid=d.static_grid,e("static_grid","staticGrid")),"undefined"!=typeof d.is_nested&&(d.isNested=d.is_nested,e("is_nested","isNested")),"undefined"!=typeof d.always_show_resize_handle&&(d.alwaysShowResizeHandle=d.always_show_resize_handle,e("always_show_resize_handle","alwaysShowResizeHandle")),
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
d.itemClass=d.itemClass||"grid-stack-item";var j=this.container.closest("."+d.itemClass).length>0;if(this.opts=b.defaults(d||{},{width:parseInt(this.container.attr("data-gs-width"))||12,height:parseInt(this.container.attr("data-gs-height"))||0,itemClass:"grid-stack-item",placeholderClass:"grid-stack-placeholder",placeholderText:"",handle:".grid-stack-item-content",handleClass:null,cellHeight:60,verticalMargin:20,auto:!0,minWidth:768,"float":!1,staticGrid:!1,_class:"grid-stack-instance-"+(1e4*Math.random()).toFixed(0),animate:Boolean(this.container.attr("data-gs-animate"))||!1,alwaysShowResizeHandle:d.alwaysShowResizeHandle||!1,resizable:b.defaults(d.resizable||{},{autoHide:!d.alwaysShowResizeHandle,handles:"se"}),draggable:b.defaults(d.draggable||{},{handle:(d.handleClass?"."+d.handleClass:d.handle?d.handle:"")||".grid-stack-item-content",scroll:!1,appendTo:"body"}),disableDrag:d.disableDrag||!1,disableResize:d.disableResize||!1,rtl:"auto",removable:!1,removeTimeout:2e3,verticalMarginUnit:"px",cellHeightUnit:"px"}),"auto"===this.opts.rtl&&(this.opts.rtl="rtl"===this.container.css("direction")),this.opts.rtl&&this.container.addClass("grid-stack-rtl"),this.opts.isNested=j,g="auto"===this.opts.cellHeight,g?i.cellHeight(i.cellWidth(),!0):this.cellHeight(this.opts.cellHeight,!0),this.verticalMargin(this.opts.verticalMargin,!0),this.container.addClass(this.opts._class),this._setStaticClass(),j&&this.container.addClass("grid-stack-nested"),this._initStyles(),this.grid=new h(this.opts.width,function(a,c){c="undefined"==typeof c||c;var d=0;b.each(a,function(a){c&&null===a._id?a.el&&a.el.remove():(a.el.attr("data-gs-x",a.x).attr("data-gs-y",a.y).attr("data-gs-width",a.width).attr("data-gs-height",a.height),d=Math.max(d,a.y+a.height))}),i._updateStyles(d+10)},this.opts["float"],this.opts.height),this.opts.auto){var k=[],l=this;this.container.children("."+this.opts.itemClass+":not(."+this.opts.placeholderClass+")").each(function(b,c){c=a(c),k.push({el:c,i:parseInt(c.attr("data-gs-x"))+parseInt(c.attr("data-gs-y"))*l.opts.width})}),b.chain(k).sortBy(function(a){return a.i}).each(function(a){i._prepareElement(a.el)}).value()}if(this.setAnimation(this.opts.animate),this.placeholder=a('<div class="'+this.opts.placeholderClass+" "+this.opts.itemClass+'"><div class="placeholder-content">'+this.opts.placeholderText+"</div></div>").hide(),this._updateContainerHeight(),this._updateHeightsOnResize=b.throttle(function(){i.cellHeight(i.cellWidth(),!1)},100),this.onResizeHandler=function(){if(g&&i._updateHeightsOnResize(),i._isOneColumnMode()){if(f)return;f=!0,i.grid._sortNodes(),b.each(i.grid.nodes,function(a){i.container.append(a.el),i.opts.staticGrid||((a.noMove||i.opts.disableDrag)&&a.el.draggable("disable"),(a.noResize||i.opts.disableResize)&&a.el.resizable("disable"),a.el.trigger("resize"))})}else{if(!f)return;if(f=!1,i.opts.staticGrid)return;b.each(i.grid.nodes,function(a){a.noMove||i.opts.disableDrag||a.el.draggable("enable"),a.noResize||i.opts.disableResize||a.el.resizable("enable"),a.el.trigger("resize")})}},a(window).resize(this.onResizeHandler),this.onResizeHandler(),!i.opts.staticGrid&&"string"==typeof i.opts.removable){var m=a(i.opts.removable);m.data("droppable")||m.droppable({accept:"."+i.opts.itemClass}),m.on("dropover",function(b,c){var d=a(c.draggable),e=d.data("_gridstack_node");e._grid===i&&i._setupRemovingTimeout(d)}).on("dropout",function(b,c){var d=a(c.draggable),e=d.data("_gridstack_node");e._grid===i&&i._clearRemovingTimeout(d)})}if(!i.opts.staticGrid&&i.opts.acceptWidgets){var n=null,o=function(a,b){var c=n,d=c.data("_gridstack_node"),e=i.getCellFromPixel(b.offset,!0),f=Math.max(0,e.x),g=Math.max(0,e.y);if(d._added){if(!i.grid.canMoveNode(d,f,g))return;i.grid.moveNode(d,f,g),i._updateContainerHeight()}else d._added=!0,d.el=c,d.x=f,d.y=g,i.grid.cleanNodes(),i.grid.beginUpdate(d),i.grid.addNode(d),i.container.append(i.placeholder),i.placeholder.attr("data-gs-x",d.x).attr("data-gs-y",d.y).attr("data-gs-width",d.width).attr("data-gs-height",d.height).show(),d.el=i.placeholder,d._beforeDragX=d.x,d._beforeDragY=d.y,i._updateContainerHeight()};a(i.container).droppable({accept:function(b){b=a(b);var c=b.data("_gridstack_node");return(!c||c._grid!==i)&&b.is(i.opts.acceptWidgets===!0?".grid-stack-item":i.opts.acceptWidgets)},over:function(b,c){var d=(i.container.offset(),a(c.draggable)),e=i.cellWidth(),f=i.cellHeight(),g=d.data("_gridstack_node"),h=g?g.width:Math.ceil(d.outerWidth()/e),j=g?g.height:Math.ceil(d.outerHeight()/f);n=d;var k=i.grid._prepareNode({width:h,height:j,_added:!1,_temporary:!0});d.data("_gridstack_node",k),d.data("_gridstack_node_orig",g),d.on("drag",o)},out:function(b,c){var d=a(c.draggable);d.unbind("drag",o);var e=d.data("_gridstack_node");e.el=null,i.grid.removeNode(e),i.placeholder.detach(),i._updateContainerHeight(),d.data("_gridstack_node",d.data("_gridstack_node_orig"))},drop:function(b,c){i.placeholder.detach();var d=a(c.draggable).data("_gridstack_node");d._grid=i;var e=a(c.draggable).clone(!1);e.data("_gridstack_node",d),a(c.draggable).remove(),d.el=e,i.placeholder.hide(),e.attr("data-gs-x",d.x).attr("data-gs-y",d.y).attr("data-gs-width",d.width).attr("data-gs-height",d.height).addClass(i.opts.itemClass).removeAttr("style").enableSelection().removeData("draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled").unbind("drag",o),i.container.append(e),i._prepareElementsByNode(e,d),i._updateContainerHeight(),i._triggerChangeEvent(),i.grid.endUpdate()}})}};
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
return i.prototype._triggerChangeEvent=function(a){var b=this.grid.getDirtyNodes(),c=!1,d=[];b&&b.length&&(d.push(b),c=!0),(c||a===!0)&&this.container.trigger("change",d)},i.prototype._triggerAddEvent=function(){this.grid._addedNodes&&this.grid._addedNodes.length>0&&(this.container.trigger("added",[b.map(this.grid._addedNodes,b.clone)]),this.grid._addedNodes=[])},i.prototype._triggerRemoveEvent=function(){this.grid._removedNodes&&this.grid._removedNodes.length>0&&(this.container.trigger("removed",[b.map(this.grid._removedNodes,b.clone)]),this.grid._removedNodes=[])},i.prototype._initStyles=function(){this._stylesId&&f.removeStylesheet(this._stylesId),this._stylesId="gridstack-style-"+(1e5*Math.random()).toFixed(),this._styles=f.createStylesheet(this._stylesId),null!==this._styles&&(this._styles._max=0)},i.prototype._updateStyles=function(a){if(null!==this._styles&&"undefined"!=typeof this._styles){var b,c="."+this.opts._class+" ."+this.opts.itemClass,d=this;if("undefined"==typeof a&&(a=this._styles._max,this._initStyles(),this._updateContainerHeight()),this.opts.cellHeight&&!(0!==this._styles._max&&a<=this._styles._max)&&(b=this.opts.verticalMargin&&this.opts.cellHeightUnit!==this.opts.verticalMarginUnit?function(a,b){return a&&b?"calc("+(d.opts.cellHeight*a+d.opts.cellHeightUnit)+" + "+(d.opts.verticalMargin*b+d.opts.verticalMarginUnit)+")":d.opts.cellHeight*a+d.opts.verticalMargin*b+d.opts.cellHeightUnit}:function(a,b){return d.opts.cellHeight*a+d.opts.verticalMargin*b+d.opts.cellHeightUnit},0===this._styles._max&&f.insertCSSRule(this._styles,c,"min-height: "+b(1,0)+";",0),a>this._styles._max)){for(var e=this._styles._max;e<a;++e)f.insertCSSRule(this._styles,c+'[data-gs-height="'+(e+1)+'"]',"height: "+b(e+1,e)+";",e),f.insertCSSRule(this._styles,c+'[data-gs-min-height="'+(e+1)+'"]',"min-height: "+b(e+1,e)+";",e),f.insertCSSRule(this._styles,c+'[data-gs-max-height="'+(e+1)+'"]',"max-height: "+b(e+1,e)+";",e),f.insertCSSRule(this._styles,c+'[data-gs-y="'+e+'"]',"top: "+b(e,e)+";",e);this._styles._max=a}}},i.prototype._updateContainerHeight=function(){if(!this.grid._updateCounter){var a=this.grid.getGridHeight();this.container.attr("data-gs-current-height",a),this.opts.cellHeight&&(this.opts.verticalMargin?this.opts.cellHeightUnit===this.opts.verticalMarginUnit?this.container.css("height",a*(this.opts.cellHeight+this.opts.verticalMargin)-this.opts.verticalMargin+this.opts.cellHeightUnit):this.container.css("height","calc("+(a*this.opts.cellHeight+this.opts.cellHeightUnit)+" + "+(a*(this.opts.verticalMargin-1)+this.opts.verticalMarginUnit)+")"):this.container.css("height",a*this.opts.cellHeight+this.opts.cellHeightUnit))}},i.prototype._isOneColumnMode=function(){return(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)<=this.opts.minWidth},i.prototype._setupRemovingTimeout=function(b){var c=this,d=a(b).data("_gridstack_node");!d._removeTimeout&&c.opts.removable&&(d._removeTimeout=setTimeout(function(){b.addClass("grid-stack-item-removing"),d._isAboutToRemove=!0},c.opts.removeTimeout))},i.prototype._clearRemovingTimeout=function(b){var c=a(b).data("_gridstack_node");c._removeTimeout&&(clearTimeout(c._removeTimeout),c._removeTimeout=null,b.removeClass("grid-stack-item-removing"),c._isAboutToRemove=!1)},i.prototype._prepareElementsByNode=function(c,d){if("undefined"!=typeof a.ui){var e,f,g=this,h=function(a,b){var h,i,j=Math.round(b.position.left/e),k=Math.floor((b.position.top+f/2)/f);if("drag"!=a.type&&(h=Math.round(b.size.width/e),i=Math.round(b.size.height/f)),"drag"==a.type)j<0||j>=g.grid.width||k<0?(g.opts.removable===!0&&g._setupRemovingTimeout(c),j=d._beforeDragX,k=d._beforeDragY,g.placeholder.detach(),g.placeholder.hide(),g.grid.removeNode(d),g._updateContainerHeight(),d._temporaryRemoved=!0):(g._clearRemovingTimeout(c),d._temporaryRemoved&&(g.grid.addNode(d),g.placeholder.attr("data-gs-x",j).attr("data-gs-y",k).attr("data-gs-width",h).attr("data-gs-height",i).show(),g.container.append(g.placeholder),d.el=g.placeholder,d._temporaryRemoved=!1));else if("resize"==a.type&&j<0)return;g.grid.canMoveNode(d,j,k,h,i)&&(g.grid.moveNode(d,j,k,h,i),g._updateContainerHeight())},i=function(b,h){g.container.append(g.placeholder);var i=a(this);g.grid.cleanNodes(),g.grid.beginUpdate(d),e=g.cellWidth();var j=Math.ceil(i.outerHeight()/i.attr("data-gs-height"));f=g.container.height()/parseInt(g.container.attr("data-gs-current-height")),g.placeholder.attr("data-gs-x",i.attr("data-gs-x")).attr("data-gs-y",i.attr("data-gs-y")).attr("data-gs-width",i.attr("data-gs-width")).attr("data-gs-height",i.attr("data-gs-height")).show(),d.el=g.placeholder,d._beforeDragX=d.x,d._beforeDragY=d.y,c.resizable("option","minWidth",e*(d.minWidth||1)),c.resizable("option","minHeight",j*(d.minHeight||1)),"resizestart"==b.type&&i.find(".grid-stack-item").trigger("resizestart")},j=function(b,e){var f=a(this);if(f.data("_gridstack_node")){var h=!1;g.placeholder.detach(),d.el=f,g.placeholder.hide(),d._isAboutToRemove?(h=!0,c.removeData("_gridstack_node"),c.remove()):(g._clearRemovingTimeout(c),d._temporaryRemoved?(f.attr("data-gs-x",d._beforeDragX).attr("data-gs-y",d._beforeDragY).attr("data-gs-width",d.width).attr("data-gs-height",d.height).removeAttr("style"),d.x=d._beforeDragX,d.y=d._beforeDragY,g.grid.addNode(d)):f.attr("data-gs-x",d.x).attr("data-gs-y",d.y).attr("data-gs-width",d.width).attr("data-gs-height",d.height).removeAttr("style")),g._updateContainerHeight(),g._triggerChangeEvent(h),g.grid.endUpdate();var i=f.find(".grid-stack");i.length&&"resizestop"==b.type&&(i.each(function(b,c){a(c).data("gridstack").onResizeHandler()}),f.find(".grid-stack-item").trigger("resizestop"))}};c.draggable(b.extend({},this.opts.draggable,{containment:this.opts.isNested?this.container.parent():null,start:i,stop:j,drag:h})).resizable(b.extend({},this.opts.resizable,{start:i,stop:j,resize:h})),(d.noMove||this._isOneColumnMode()||this.opts.disableDrag)&&c.draggable("disable"),(d.noResize||this._isOneColumnMode()||this.opts.disableResize)&&c.resizable("disable"),c.attr("data-gs-locked",d.locked?"yes":null)}},i.prototype._prepareElement=function(b,c){c="undefined"!=typeof c&&c;var d=this;b=a(b),b.addClass(this.opts.itemClass);var e=d.grid.addNode({x:b.attr("data-gs-x"),y:b.attr("data-gs-y"),width:b.attr("data-gs-width"),height:b.attr("data-gs-height"),maxWidth:b.attr("data-gs-max-width"),minWidth:b.attr("data-gs-min-width"),maxHeight:b.attr("data-gs-max-height"),minHeight:b.attr("data-gs-min-height"),autoPosition:f.toBool(b.attr("data-gs-auto-position")),noResize:f.toBool(b.attr("data-gs-no-resize")),noMove:f.toBool(b.attr("data-gs-no-move")),locked:f.toBool(b.attr("data-gs-locked")),el:b,id:b.attr("data-gs-id"),_grid:d},c);b.data("_gridstack_node",e),this._prepareElementsByNode(b,e)},i.prototype.setAnimation=function(a){a?this.container.addClass("grid-stack-animate"):this.container.removeClass("grid-stack-animate")},i.prototype.addWidget=function(b,c,d,e,f,g,h,i,j,k,l){return b=a(b),"undefined"!=typeof c&&b.attr("data-gs-x",c),"undefined"!=typeof d&&b.attr("data-gs-y",d),"undefined"!=typeof e&&b.attr("data-gs-width",e),"undefined"!=typeof f&&b.attr("data-gs-height",f),"undefined"!=typeof g&&b.attr("data-gs-auto-position",g?"yes":null),"undefined"!=typeof h&&b.attr("data-gs-min-width",h),"undefined"!=typeof i&&b.attr("data-gs-max-width",i),"undefined"!=typeof j&&b.attr("data-gs-min-height",j),"undefined"!=typeof k&&b.attr("data-gs-max-height",k),"undefined"!=typeof l&&b.attr("data-gs-id",l),this.container.append(b),this._prepareElement(b,!0),this._triggerAddEvent(),this._updateContainerHeight(),this._triggerChangeEvent(!0),b},i.prototype.makeWidget=function(b){return b=a(b),this._prepareElement(b,!0),this._triggerAddEvent(),this._updateContainerHeight(),this._triggerChangeEvent(!0),b},i.prototype.willItFit=function(a,b,c,d,e){var f={x:a,y:b,width:c,height:d,autoPosition:e};return this.grid.canBePlacedWithRespectToHeight(f)},i.prototype.removeWidget=function(b,c){c="undefined"==typeof c||c,b=a(b);var d=b.data("_gridstack_node");
// For Meteor support: https://github.com/troolee/gridstack.js/pull/272
d||(d=this.grid.getNodeDataByDOMEl(b)),this.grid.removeNode(d,c),b.removeData("_gridstack_node"),this._updateContainerHeight(),c&&b.remove(),this._triggerChangeEvent(!0),this._triggerRemoveEvent()},i.prototype.removeAll=function(a){b.each(this.grid.nodes,b.bind(function(b){this.removeWidget(b.el,a)},this)),this.grid.nodes=[],this._updateContainerHeight()},i.prototype.destroy=function(b){a(window).off("resize",this.onResizeHandler),this.disable(),"undefined"==typeof b||b?this.container.remove():(this.removeAll(!1),this.container.removeData("gridstack")),f.removeStylesheet(this._stylesId),this.grid&&(this.grid=null)},i.prototype.resizable=function(b,c){var d=this;return b=a(b),b.each(function(b,e){e=a(e);var f=e.data("_gridstack_node");"undefined"!=typeof f&&null!==f&&"undefined"!=typeof a.ui&&(f.noResize=!c,f.noResize||d._isOneColumnMode()?e.resizable("disable"):e.resizable("enable"))}),this},i.prototype.movable=function(b,c){var d=this;return b=a(b),b.each(function(b,e){e=a(e);var f=e.data("_gridstack_node");"undefined"!=typeof f&&null!==f&&"undefined"!=typeof a.ui&&(f.noMove=!c,f.noMove||d._isOneColumnMode()?(e.draggable("disable"),e.removeClass("ui-draggable-handle")):(e.draggable("enable"),e.addClass("ui-draggable-handle")))}),this},i.prototype.enableMove=function(a,b){this.movable(this.container.children("."+this.opts.itemClass),a),b&&(this.opts.disableDrag=!a)},i.prototype.enableResize=function(a,b){this.resizable(this.container.children("."+this.opts.itemClass),a),b&&(this.opts.disableResize=!a)},i.prototype.disable=function(){this.movable(this.container.children("."+this.opts.itemClass),!1),this.resizable(this.container.children("."+this.opts.itemClass),!1),this.container.trigger("disable")},i.prototype.enable=function(){this.movable(this.container.children("."+this.opts.itemClass),!0),this.resizable(this.container.children("."+this.opts.itemClass),!0),this.container.trigger("enable")},i.prototype.locked=function(b,c){return b=a(b),b.each(function(b,d){d=a(d);var e=d.data("_gridstack_node");"undefined"!=typeof e&&null!==e&&(e.locked=c||!1,d.attr("data-gs-locked",e.locked?"yes":null))}),this},i.prototype.maxHeight=function(b,c){return b=a(b),b.each(function(b,d){d=a(d);var e=d.data("_gridstack_node");"undefined"!=typeof e&&null!==e&&(isNaN(c)||(e.maxHeight=c||!1,d.attr("data-gs-max-height",c)))}),this},i.prototype.minHeight=function(b,c){return b=a(b),b.each(function(b,d){d=a(d);var e=d.data("_gridstack_node");"undefined"!=typeof e&&null!==e&&(isNaN(c)||(e.minHeight=c||!1,d.attr("data-gs-min-height",c)))}),this},i.prototype.maxWidth=function(b,c){return b=a(b),b.each(function(b,d){d=a(d);var e=d.data("_gridstack_node");"undefined"!=typeof e&&null!==e&&(isNaN(c)||(e.maxWidth=c||!1,d.attr("data-gs-max-width",c)))}),this},i.prototype.minWidth=function(b,c){return b=a(b),b.each(function(b,d){d=a(d);var e=d.data("_gridstack_node");"undefined"!=typeof e&&null!==e&&(isNaN(c)||(e.minWidth=c||!1,d.attr("data-gs-min-width",c)))}),this},i.prototype._updateElement=function(b,c){b=a(b).first();var d=b.data("_gridstack_node");if("undefined"!=typeof d&&null!==d){var e=this;e.grid.cleanNodes(),e.grid.beginUpdate(d),c.call(this,b,d),e._updateContainerHeight(),e._triggerChangeEvent(),e.grid.endUpdate()}},i.prototype.resize=function(a,b,c){this._updateElement(a,function(a,d){b=null!==b&&"undefined"!=typeof b?b:d.width,c=null!==c&&"undefined"!=typeof c?c:d.height,this.grid.moveNode(d,d.x,d.y,b,c)})},i.prototype.move=function(a,b,c){this._updateElement(a,function(a,d){b=null!==b&&"undefined"!=typeof b?b:d.x,c=null!==c&&"undefined"!=typeof c?c:d.y,this.grid.moveNode(d,b,c,d.width,d.height)})},i.prototype.update=function(a,b,c,d,e){this._updateElement(a,function(a,f){b=null!==b&&"undefined"!=typeof b?b:f.x,c=null!==c&&"undefined"!=typeof c?c:f.y,d=null!==d&&"undefined"!=typeof d?d:f.width,e=null!==e&&"undefined"!=typeof e?e:f.height,this.grid.moveNode(f,b,c,d,e)})},i.prototype.verticalMargin=function(a,b){if("undefined"==typeof a)return this.opts.verticalMargin;var c=f.parseHeight(a);this.opts.verticalMarginUnit===c.unit&&this.opts.height===c.height||(this.opts.verticalMarginUnit=c.unit,this.opts.verticalMargin=c.height,b||this._updateStyles())},i.prototype.cellHeight=function(a,b){if("undefined"==typeof a){if(this.opts.cellHeight)return this.opts.cellHeight;var c=this.container.children("."+this.opts.itemClass).first();return Math.ceil(c.outerHeight()/c.attr("data-gs-height"))}var d=f.parseHeight(a);this.opts.cellHeightUnit===d.heightUnit&&this.opts.height===d.height||(this.opts.cellHeightUnit=d.unit,this.opts.cellHeight=d.height,b||this._updateStyles())},i.prototype.cellWidth=function(){return Math.round(this.container.outerWidth()/this.opts.width)},i.prototype.getCellFromPixel=function(a,b){var c="undefined"!=typeof b&&b?this.container.offset():this.container.position(),d=a.left-c.left,e=a.top-c.top,f=Math.floor(this.container.width()/this.opts.width),g=Math.floor(this.container.height()/parseInt(this.container.attr("data-gs-current-height")));return{x:Math.floor(d/f),y:Math.floor(e/g)}},i.prototype.batchUpdate=function(){this.grid.batchUpdate()},i.prototype.commit=function(){this.grid.commit(),this._updateContainerHeight()},i.prototype.isAreaEmpty=function(a,b,c,d){return this.grid.isAreaEmpty(a,b,c,d)},i.prototype.setStatic=function(a){this.opts.staticGrid=a===!0,this.enableMove(!a),this.enableResize(!a),this._setStaticClass()},i.prototype._setStaticClass=function(){var a="grid-stack-static";this.opts.staticGrid===!0?this.container.addClass(a):this.container.removeClass(a)},i.prototype._updateNodeWidths=function(a,b){this.grid._sortNodes(),this.grid.batchUpdate();for(var c={},d=0;d<this.grid.nodes.length;d++)c=this.grid.nodes[d],this.update(c.el,Math.round(c.x*b/a),void 0,Math.round(c.width*b/a),void 0);this.grid.commit()},i.prototype.setGridWidth=function(a,b){this.container.removeClass("grid-stack-"+this.opts.width),b!==!0&&this._updateNodeWidths(this.opts.width,a),this.opts.width=a,this.grid.width=a,this.container.addClass("grid-stack-"+a)},h.prototype.batch_update=d(h.prototype.batchUpdate),h.prototype._fix_collisions=d(h.prototype._fixCollisions,"_fix_collisions","_fixCollisions"),h.prototype.is_area_empty=d(h.prototype.isAreaEmpty,"is_area_empty","isAreaEmpty"),h.prototype._sort_nodes=d(h.prototype._sortNodes,"_sort_nodes","_sortNodes"),h.prototype._pack_nodes=d(h.prototype._packNodes,"_pack_nodes","_packNodes"),h.prototype._prepare_node=d(h.prototype._prepareNode,"_prepare_node","_prepareNode"),h.prototype.clean_nodes=d(h.prototype.cleanNodes,"clean_nodes","cleanNodes"),h.prototype.get_dirty_nodes=d(h.prototype.getDirtyNodes,"get_dirty_nodes","getDirtyNodes"),h.prototype.add_node=d(h.prototype.addNode,"add_node","addNode, "),h.prototype.remove_node=d(h.prototype.removeNode,"remove_node","removeNode"),h.prototype.can_move_node=d(h.prototype.canMoveNode,"can_move_node","canMoveNode"),h.prototype.move_node=d(h.prototype.moveNode,"move_node","moveNode"),h.prototype.get_grid_height=d(h.prototype.getGridHeight,"get_grid_height","getGridHeight"),h.prototype.begin_update=d(h.prototype.beginUpdate,"begin_update","beginUpdate"),h.prototype.end_update=d(h.prototype.endUpdate,"end_update","endUpdate"),h.prototype.can_be_placed_with_respect_to_height=d(h.prototype.canBePlacedWithRespectToHeight,"can_be_placed_with_respect_to_height","canBePlacedWithRespectToHeight"),i.prototype._trigger_change_event=d(i.prototype._triggerChangeEvent,"_trigger_change_event","_triggerChangeEvent"),i.prototype._init_styles=d(i.prototype._initStyles,"_init_styles","_initStyles"),i.prototype._update_styles=d(i.prototype._updateStyles,"_update_styles","_updateStyles"),i.prototype._update_container_height=d(i.prototype._updateContainerHeight,"_update_container_height","_updateContainerHeight"),i.prototype._is_one_column_mode=d(i.prototype._isOneColumnMode,"_is_one_column_mode","_isOneColumnMode"),i.prototype._prepare_element=d(i.prototype._prepareElement,"_prepare_element","_prepareElement"),i.prototype.set_animation=d(i.prototype.setAnimation,"set_animation","setAnimation"),i.prototype.add_widget=d(i.prototype.addWidget,"add_widget","addWidget"),i.prototype.make_widget=d(i.prototype.makeWidget,"make_widget","makeWidget"),i.prototype.will_it_fit=d(i.prototype.willItFit,"will_it_fit","willItFit"),i.prototype.remove_widget=d(i.prototype.removeWidget,"remove_widget","removeWidget"),i.prototype.remove_all=d(i.prototype.removeAll,"remove_all","removeAll"),i.prototype.min_height=d(i.prototype.minHeight,"min_height","minHeight"),i.prototype.min_width=d(i.prototype.minWidth,"min_width","minWidth"),i.prototype._update_element=d(i.prototype._updateElement,"_update_element","_updateElement"),i.prototype.cell_height=d(i.prototype.cellHeight,"cell_height","cellHeight"),i.prototype.cell_width=d(i.prototype.cellWidth,"cell_width","cellWidth"),i.prototype.get_cell_from_pixel=d(i.prototype.getCellFromPixel,"get_cell_from_pixel","getCellFromPixel"),i.prototype.batch_update=d(i.prototype.batchUpdate,"batch_update","batchUpdate"),i.prototype.is_area_empty=d(i.prototype.isAreaEmpty,"is_area_empty","isAreaEmpty"),i.prototype.set_static=d(i.prototype.setStatic,"set_static","setStatic"),i.prototype._set_static_class=d(i.prototype._setStaticClass,"_set_static_class","_setStaticClass"),c.GridStackUI=i,c.GridStackUI.Utils=f,c.GridStackUI.Engine=h,a.fn.gridstack=function(b){return this.each(function(){var c=a(this);c.data("gridstack")||c.data("gridstack",new i(this,b))})},c.GridStackUI});




/**
 * Template7 1.3.1
 * Mobile-first HTML template engine
 * 
 * http://www.idangero.us/template7/
 * 
 * Copyright 2017, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: October 25, 2017
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Template7=t()}(this,function(){"use strict";function e(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];var n=e[0],r=e[1];if(2===e.length){var i=new s(n),a=i.compile()(r);return i=null,a}return new s(n)}var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:void 0;var n=t,r={quoteSingleRexExp:new RegExp("'","g"),quoteDoubleRexExp:new RegExp('"',"g"),isFunction:function(e){return"function"==typeof e},escape:function(e){return void 0!==n&&n.escape?n.escape(e):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},helperToSlices:function(e){var t,n,i,a=r.quoteDoubleRexExp,l=r.quoteSingleRexExp,o=e.replace(/[{}#}]/g,"").trim().split(" "),s=[];for(n=0;n<o.length;n+=1){var f=o[n],p=void 0,c=void 0;if(0===n)s.push(f);else if(0===f.indexOf('"')||0===f.indexOf("'"))if(p=0===f.indexOf('"')?a:l,c=0===f.indexOf('"')?'"':"'",2===f.match(p).length)s.push(f);else{for(t=0,i=n+1;i<o.length;i+=1)if(f+=" "+o[i],o[i].indexOf(c)>=0){t=i,s.push(f);break}t&&(n=t)}else if(f.indexOf("=")>0){var u=f.split("="),h=u[0],d=u[1];if(p||(p=0===d.indexOf('"')?a:l,c=0===d.indexOf('"')?'"':"'"),2!==d.match(p).length){for(t=0,i=n+1;i<o.length;i+=1)if(d+=" "+o[i],o[i].indexOf(c)>=0){t=i;break}t&&(n=t)}var g=[h,d.replace(p,"")];s.push(g)}else s.push(f)}return s},stringToBlocks:function(e){var t,n,i=[];if(!e)return[];var a=e.split(/({{[^{^}]*}})/);for(t=0;t<a.length;t+=1){var l=a[t];if(""!==l)if(l.indexOf("{{")<0)i.push({type:"plain",content:l});else{if(l.indexOf("{/")>=0)continue;if(l=l.replace(/{{([#\/])*([ ])*/,"{{$1").replace(/([ ])*}}/,"}}"),l.indexOf("{#")<0&&l.indexOf(" ")<0&&l.indexOf("else")<0){i.push({type:"variable",contextName:l.replace(/[{}]/g,"")});continue}var o=r.helperToSlices(l),s=o[0],f=">"===s,p=[],c={};for(n=1;n<o.length;n+=1){var u=o[n];Array.isArray(u)?c[u[0]]="false"!==u[1]&&u[1]:p.push(u)}if(l.indexOf("{#")>=0){var h="",d="",g=0,v=void 0,x=!1,m=!1,O=0;for(n=t+1;n<a.length;n+=1)if(a[n].indexOf("{{#")>=0&&(O+=1),a[n].indexOf("{{/")>=0&&(O-=1),a[n].indexOf("{{#"+s)>=0)h+=a[n],m&&(d+=a[n]),g+=1;else if(a[n].indexOf("{{/"+s)>=0){if(!(g>0)){v=n,x=!0;break}g-=1,h+=a[n],m&&(d+=a[n])}else a[n].indexOf("else")>=0&&0===O?m=!0:(m||(h+=a[n]),m&&(d+=a[n]));x&&(v&&(t=v),"raw"===s?i.push({type:"plain",content:h}):i.push({type:"helper",helperName:s,contextName:p,content:h,inverseContent:d,hash:c}))}else l.indexOf(" ")>0&&(f&&(s="_partial",p[0]&&(p[0]='"'+p[0].replace(/"|'/g,"")+'"')),i.push({type:"helper",helperName:s,contextName:p,hash:c}))}}return i},parseJsVariable:function(e,t,n){return e.split(/([+ -*\/^])/g).map(function(e){if(e.indexOf(t)<0)return e;if(!n)return JSON.stringify("");var r=n;return e.indexOf(t+".")>=0&&e.split(t+".")[1].split(".").forEach(function(e){r=r[e]?r[e]:"undefined"}),JSON.stringify(r)}).join("")},parseJsParents:function(e,t){return e.split(/([+ -*^])/g).map(function(e){if(e.indexOf("../")<0)return e;if(!t||0===t.length)return JSON.stringify("");var n=e.split("../").length-1,r=n>t.length?t[t.length-1]:t[n-1],i=r;return e.replace(/..\//g,"").split(".").forEach(function(e){i=i[e]?i[e]:"undefined"}),JSON.stringify(i)}).join("")},getCompileVar:function(e,t,n){void 0===n&&(n="data_1");var r,i,a=t,l=0;0===e.indexOf("../")?(l=e.split("../").length-1,i=a.split("_")[1]-l,a="ctx_"+(i>=1?i:1),r=e.split("../")[l].split(".")):0===e.indexOf("@global")?(a="Template7.global",r=e.split("@global.")[1].split(".")):0===e.indexOf("@root")?(a="root",r=e.split("@root.")[1].split(".")):r=e.split(".");for(var o=0;o<r.length;o+=1){var s=r[o];if(0===s.indexOf("@")){var f=n.split("_")[1];l>0&&(f=i),o>0?a+="[(data_"+f+" && data_"+f+"."+s.replace("@","")+")]":a="(data_"+f+" && data_"+f+"."+s.replace("@","")+")"}else isFinite(s)?a+="["+s+"]":"this"===s||s.indexOf("this.")>=0||s.indexOf("this[")>=0||s.indexOf("this(")>=0?a=s.replace("this",t):a+="."+s}return a},getCompiledArguments:function(e,t,n){for(var i=[],a=0;a<e.length;a+=1)/^['"]/.test(e[a])?i.push(e[a]):/^(true|false|\d+)$/.test(e[a])?i.push(e[a]):i.push(r.getCompileVar(e[a],t,n));return i.join(", ")}},i={_partial:function(e,t){var n=s.partials[e];if(!n||n&&!n.template)return"";n.compiled||(n.compiled=new s(n.template).compile());var r=this;for(var i in t.hash)r[i]=t.hash[i];return n.compiled(r,t.data,t.root)},escape:function(e){if("string"!=typeof e)throw new Error('Template7: Passed context to "escape" helper should be a string');return r.escape(e)},if:function(e,t){var n=e;return r.isFunction(n)&&(n=n.call(this)),n?t.fn(this,t.data):t.inverse(this,t.data)},unless:function(e,t){var n=e;return r.isFunction(n)&&(n=n.call(this)),n?t.inverse(this,t.data):t.fn(this,t.data)},each:function(e,t){var n=e,i="",a=0;if(r.isFunction(n)&&(n=n.call(this)),Array.isArray(n)){for(t.hash.reverse&&(n=n.reverse()),a=0;a<n.length;a+=1)i+=t.fn(n[a],{first:0===a,last:a===n.length-1,index:a});t.hash.reverse&&(n=n.reverse())}else for(var l in n)a+=1,i+=t.fn(n[l],{key:l});return a>0?i:t.inverse(this)},with:function(e,t){var n=e;return r.isFunction(n)&&(n=e.call(this)),t.fn(n)},join:function(e,t){var n=e;return r.isFunction(n)&&(n=n.call(this)),n.join(t.hash.delimiter||t.hash.delimeter)},js:function(e,t){var i,a=t.data,l=e;return"index first last key".split(" ").forEach(function(e){if(void 0!==a[e]){var t=new RegExp("this.@"+e,"g"),n=new RegExp("@"+e,"g");l=l.replace(t,JSON.stringify(a[e])).replace(n,JSON.stringify(a[e]))}}),t.root&&l.indexOf("@root")>=0&&(l=r.parseJsVariable(l,"@root",t.root)),l.indexOf("@global")>=0&&(l=r.parseJsVariable(l,"@global",n.Template7.global)),l.indexOf("../")>=0&&(l=r.parseJsParents(l,t.parents)),i=l.indexOf("return")>=0?"(function(){"+l+"})":"(function(){return ("+l+")})",eval.call(this,i).call(this)},js_if:function(e,t){var n,i=t.data,a=e;return"index first last key".split(" ").forEach(function(e){if(void 0!==i[e]){var t=new RegExp("this.@"+e,"g"),n=new RegExp("@"+e,"g");a=a.replace(t,JSON.stringify(i[e])).replace(n,JSON.stringify(i[e]))}}),t.root&&a.indexOf("@root")>=0&&(a=r.parseJsVariable(a,"@root",t.root)),a.indexOf("@global")>=0&&(a=r.parseJsVariable(a,"@global",s.global)),a.indexOf("../")>=0&&(a=r.parseJsParents(a,t.parents)),n=a.indexOf("return")>=0?"(function(){"+a+"})":"(function(){return ("+a+")})",eval.call(this,n).call(this)?t.fn(this,t.data):t.inverse(this,t.data)}};i.js_compare=i.js_if;var a={},l={},o=n.document.createElement("script");n.document.head.appendChild(o);var s=function(e){this.template=e},f={options:{},partials:{},helpers:{}};return s.prototype.compile=function(e,t){function a(e,t){return e.content?o.compile(e.content,t):function(){return""}}function l(e,t){return e.inverseContent?o.compile(e.inverseContent,t):function(){return""}}void 0===e&&(e=this.template),void 0===t&&(t=1);var o=this;if(o.compiled)return o.compiled;if("string"!=typeof e)throw new Error("Template7: Template must be a string");var s=r.stringToBlocks,f=r.getCompileVar,p=r.getCompiledArguments,c=s(e),u="ctx_"+t,h="data_"+t;if(0===c.length)return function(){return""};var d="";d+=1===t?"(function ("+u+", "+h+", root) {\n":"(function ("+u+", "+h+") {\n",1===t&&(d+="function isArray(arr){return Array.isArray(arr);}\n",d+="function isFunction(func){return (typeof func === 'function');}\n",d+='function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n',d+="root = root || ctx_1 || {};\n"),d+="var r = '';\n";var g;for(g=0;g<c.length;g+=1){var v=c[g];if("plain"!==v.type){var x=void 0,m=void 0;if("variable"===v.type&&(x=f(v.contextName,u,h),d+="r += c("+x+", "+u+");"),"helper"===v.type){var O=void 0;if("ctx_1"!==u){for(var y=u.split("_")[1],b="ctx_"+(y-1),w=y-2;w>=1;w-=1)b+=", ctx_"+w;O="["+b+"]"}else O="["+u+"]";if(v.helperName in i)m=p(v.contextName,u,h),d+="r += (Template7.helpers."+v.helperName+").call("+u+", "+(m&&m+", ")+"{hash:"+JSON.stringify(v.hash)+", data: "+h+" || {}, fn: "+a(v,t+1)+", inverse: "+l(v,t+1)+", root: root, parents: "+O+"});";else{if(v.contextName.length>0)throw new Error('Template7: Missing helper: "'+v.helperName+'"');x=f(v.helperName,u,h),d+="if ("+x+") {",d+="if (isArray("+x+")) {",d+="r += (Template7.helpers.each).call("+u+", "+x+", {hash:"+JSON.stringify(v.hash)+", data: "+h+" || {}, fn: "+a(v,t+1)+", inverse: "+l(v,t+1)+", root: root, parents: "+O+"});",d+="}else {",d+="r += (Template7.helpers.with).call("+u+", "+x+", {hash:"+JSON.stringify(v.hash)+", data: "+h+" || {}, fn: "+a(v,t+1)+", inverse: "+l(v,t+1)+", root: root, parents: "+O+"});",d+="}}"}}}else d+="r +='"+v.content.replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/'/g,"\\'")+"';"}return d+="\nreturn r;})",1===t?(o.compiled=eval.call(n,d),o.compiled):d},f.options.get=function(){return a},f.partials.get=function(){return l},f.helpers.get=function(){return i},Object.defineProperties(s,f),e.registerHelper=function(e,t){s.helpers[e]=t},e.unregisterHelper=function(e){s.helpers[e]=void 0,delete s.helpers[e]},e.registerPartial=function(e,t){s.partials[e]={template:t}},e.unregisterPartial=function(e){s.partials[e]&&(s.partials[e]=void 0,delete s.partials[e])},e.compile=function(e,t){return new s(e,t).compile()},e.options=s.options,e.helpers=s.helpers,e.partials=s.partials,e});
//# sourceMappingURL=template7.min.js.map


(function ($) {
// Default settings
var DEFAULT_SETTINGS = {
	// Search settings
    method: "POST",
    contentType: "json",
    queryParam: "customer_name",
    searchDelay: 200,
    minChars: 1,
    propertyToSearch: "text",
    jsonContainer: null,

	// Display settings
    hintText: "Type in a search term",
    noResultsText: "No results",
    searchingText: "Searching...",
    //deleteText: "&times;",
    deleteText: "<i style='margin: 3px 0px 0px 5px; color: grey;' class='icon-remove'></i>",
    animateDropdown: true,

	// Tokenization settings
    tokenLimit: null,
    tokenDelimiter: ",",
    preventDuplicates: false,

	// Output settings
    tokenValue: "id",

	// Prepopulation settings
    prePopulate: null,
    processPrePopulate: false,

	// Manipulation settings
    idPrefix: "token-input-",

	// Formatters
    resultsFormatter: function(item){ return "<li>" + item[this.propertyToSearch]+ "</li>" },
    tokenFormatter: function(item) { return "<li><p>" + item[this.propertyToSearch] + "</p></li>" },

	// Callbacks
    onResult: null,
    onAdd: null,
    onDelete: null,
    onReady: null
};

// Default classes to use when theming
var DEFAULT_CLASSES = {
    customTokenList: "token-input-list",
    token: "token-input-token",
    tokenDelete: "token-input-delete-token",
    selectedToken: "token-input-selected-token-custom",
    highlightedToken: "token-input-highlighted-token",
    dropdown: "token-input-dropdown",
    dropdownItem: "token-input-dropdown-item",
    dropdownItem2: "token-input-dropdown-item2",
    selectedDropdownItem: "token-input-selected-dropdown-item",
    inputToken: "token-input-input-token"
};

// Input box position "enum"
var POSITION = {
    BEFORE: 0,
    AFTER: 1,
    END: 2
};

// Keys "enum"
var KEY = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    NUMPAD_ENTER: 108,
    COMMA: 188
};

// Additional public (exposed) methods
var methods = {
    init: function(url_or_data_or_function, options) {
        var settings = $.extend({}, DEFAULT_SETTINGS, options || {});

        return this.each(function () {
            $(this).data("customtokenInputObject", new $.customTokenList(this, url_or_data_or_function, settings));
        });
    },
    clear: function() {
        this.data("customtokenInputObject").clear();
        return this;
    },
    add: function(item) {
        this.data("customtokenInputObject").add(item);
        return this;
    },
    remove: function(item) {
        this.data("customtokenInputObject").remove(item);
        return this;
    },
    get: function() {
    	return this.data("customtokenInputObject").getTokens();
   	}
}

// Expose the .customtokenInput function to jQuery as a plugin
$.fn.customtokenInput = function (method) {
    // Method calling and initialization logic
    if(methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
        return methods.init.apply(this, arguments);
    }
};

// customTokenList class for each input
$.customTokenList = function (input, url_or_data, settings) {

    // Configure the data source
    if($.type(url_or_data) === "string" || $.type(url_or_data) === "function") {
        // Set the url to query against
        settings.url = url_or_data;

        // If the URL is a function, evaluate it here to do our initalization work
        var url = computeURL();

        // Make a smart guess about cross-domain if it wasn't explicitly specified
        if(settings.crossDomain === undefined) {
            if(url.indexOf("://") === -1) {
                settings.crossDomain = false;
            } else {
                settings.crossDomain = (location.href.split(/\/+/g)[1] !== url.split(/\/+/g)[1]);
            }
        }
    } else if(typeof(url_or_data) === "object") {
        // Set the local data to search through
        settings.local_data = url_or_data;
    }

    // Build class names
    if(settings.classes) {
        // Use custom class names
        settings.classes = $.extend({}, DEFAULT_CLASSES, settings.classes);
    } else if(settings.theme) {
        // Use theme-suffixed default class names
        settings.classes = {};
        $.each(DEFAULT_CLASSES, function(key, value) {
            settings.classes[key] = value + "-" + settings.theme;
        });
    } else {
        settings.classes = DEFAULT_CLASSES;
    }


    // Save the tokens
    var saved_tokens = [];

    // Keep track of the number of tokens in the list
    var token_count = 0;

    // Basic cache to save on db hits
    var cache = new $.customTokenList.Cache();

    // Keep track of the timeout, old vals
    var timeout;
    var input_val;

    // Create a new text input an attach keyup events
    var input_box = $("<input type=\"text\"  autocomplete=\"off\" style=\"height: auto; margin-top: 3px; margin-bottom: 0px;\">")
        .css({
            outline: "none"
        })
        .attr("id", settings.idPrefix + input.id)
        .focus(function () {
            if (settings.tokenLimit === null || settings.tokenLimit !== token_count) {
                show_dropdown_hint();
                selected_dropdown_item = null;
            }
        })
        .blur(function () {
				hide_dropdown();
				//$(this).val("");

        })
        .bind("keyup keydown blur update", resize_input)
        .keydown(function (event) {
			//selected_dropdown_item = null; //080
            var previous_token;
            var next_token;

            switch(event.keyCode) {
                case KEY.LEFT:
                case KEY.RIGHT:
                case KEY.UP:
                case KEY.DOWN:
                    if(!$(this).val()) {
                        previous_token = input_token.prev('li');
                        next_token = input_token.next('li');
                        if((previous_token.length && previous_token.get(0) === selected_token) || (next_token.length && next_token.get(0) === selected_token)) {
                            // Check if there is a previous/next token and it is selected
                            if(event.keyCode === KEY.LEFT || event.keyCode === KEY.UP) {
                                deselect_token($(selected_token), POSITION.BEFORE);
                            } else {
                                deselect_token($(selected_token), POSITION.AFTER);
                            }
                        } else if((event.keyCode === KEY.LEFT || event.keyCode === KEY.UP) && previous_token.length) {
                            // We are moving left, select the previous token if it exists
                            select_token($(previous_token.get(0)));
                        } else if((event.keyCode === KEY.RIGHT || event.keyCode === KEY.DOWN) && next_token.length) {
                            // We are moving right, select the next token if it exists
                            select_token($(next_token.get(0)));
                        }
                    } else {
                        var dropdown_item = null;

                        if(event.keyCode === KEY.DOWN || event.keyCode === KEY.RIGHT) {
                            dropdown_item = $(selected_dropdown_item).nextAll('li:visible').first();
                            if(dropdown_item.length) {
								select_dropdown_item(dropdown_item);
								if(selected_dropdown_item.tagName === 'HR'){
									dropdown_item = $(selected_dropdown_item).nextAll('li:visible').first();
									if(dropdown_item.length){
										select_dropdown_item(dropdown_item);
									}
									else{
										dropdown_item = $(dropdown_item).prevAll('li:visible').first();
										select_dropdown_item(dropdown_item);
									}
								}
							}
								
                        } 
                        
                        else {
                           dropdown_item = $(selected_dropdown_item).prevAll('li:visible').first();
                            if(dropdown_item.length) {
								select_dropdown_item(dropdown_item);
								if(selected_dropdown_item.tagName === 'HR'){
									dropdown_item = $(selected_dropdown_item).prevAll('li:visible').first();
									if(dropdown_item.length){
										select_dropdown_item(dropdown_item);
									}
									else{
										dropdown_item = $(dropdown_item).nextAll('li:visible').first();
										select_dropdown_item(dropdown_item);
									}
								}
							}
						}
						
						if(!selected_dropdown_item){
							if(f_li.first() && !selected_dropdown_item){
								select_dropdown_item(f_li.first());
							}
						}
                       
                        return false;
                    }
                    break;

                case KEY.BACKSPACE:
                    previous_token = input_token.prev();

                    if(!$(this).val().length) {
                        if(selected_token) {
                            delete_token($(selected_token));
                            hidden_input.change();
                        } else if(previous_token.length) {
                            select_token($(previous_token.get(0)));
                        }
						//hide_dropdown();
                        return false;
                    } else if($(this).val().length === 1) {
                        //hide_dropdown();
                    } else {
                        // set a timeout just long enough to let this function finish.
                        setTimeout(function(){do_search();}, 5);
                    }
                    break;

                case KEY.TAB:
                case KEY.ENTER:
                case KEY.NUMPAD_ENTER:
                case KEY.COMMA:
                  if(selected_dropdown_item) {
					  if($(selected_dropdown_item).data("customtokenInput")){
							add_token($(selected_dropdown_item).data("customtokenInput"));
							hidden_input.change();
							return false;
						}
						else{
							return;
						}	
                  }
                  else{
						var email = input_val;
						if(validateEmail(email)) {
							//alert('valid email address');
							add_token({id: '0##'+input_val, name: input_val, text: input_val, email: input_val, othr: 'othr'});
							return;
						}
						else if(input_val.length > 0){
							//hide_dropdown();
							showAlertMessage('Invalid email address','error','Alert message');
							return;
						}
				  }
                  break;

                case KEY.ESCAPE:
                 	hide_dropdown();
                  return true;

                default:
                    if(String.fromCharCode(event.which)) {
                        // set a timeout just long enough to let this function finish.
                        setTimeout(function(){do_search();}, 5);
                    }
                    break;
            }
            
            if($(this).val().length === '0'){
				//hide_dropdown();
			}
        });

    // Keep a reference to the original input box
    var hidden_input = $(input)
                           .hide()
                           .val("")
                           .focus(function () {
                               input_box.focus();
                           })
                           .blur(function () {
                               input_box.blur();
                           });

    // Keep a reference to the selected token and dropdown item
    var selected_token = null;
    var selected_token_index = 0;
    var selected_dropdown_item = null;

    // The list to store the token items in
    var token_list = $("<ul />")
        .addClass(settings.classes.customTokenList)
        .click(function (event) {
            var li = $(event.target).closest("li");
            if(li && li.get(0) && $.data(li.get(0), "customtokenInput")) {
                toggle_select_token(li);
            } else {
                // Deselect selected token
                if(selected_token) {
                    deselect_token($(selected_token), POSITION.END);
                }
                // Focus input box
                input_box.focus();
            }
        })
        .mouseover(function (event) {
            var li = $(event.target).closest("li");
            if(li && selected_token !== this) {
                li.addClass(settings.classes.highlightedToken);
            }
        })
        .mouseout(function (event) {
            var li = $(event.target).closest("li");
            if(li && selected_token !== this) {
                li.removeClass(settings.classes.highlightedToken);
            }
        })
        .insertBefore(hidden_input);

    // The token holding the input box
    var input_token = $("<li />")
        .addClass(settings.classes.inputToken)
        .appendTo(token_list)
        .append(input_box);

    // The list to store the dropdown items in
    var dropdown = $("<div>")
        .addClass(settings.classes.dropdown)
        .appendTo("body")
        .hide();

    // Magic element to help us resize the text input
    var input_resizer = $("<tester/>")
        .insertAfter(input_box)
        .css({
            position: "fixed",
            top: -9999,
            left: -9999,
            width: "auto",
            fontSize: input_box.css("fontSize"),
            fontFamily: input_box.css("fontFamily"),
            fontWeight: input_box.css("fontWeight"),
            letterSpacing: input_box.css("letterSpacing"),
            whiteSpace: "nowrap"
        });

    // Pre-populate list if items exist
    hidden_input.val("");
    var li_data = settings.prePopulate || hidden_input.data("pre");
    if(settings.processPrePopulate && $.isFunction(settings.onResult)) {
        li_data = settings.onResult.call(hidden_input, li_data);
    }
    if(li_data && li_data.length) {
        $.each(li_data, function (index, value) {
            insert_token(value);
            checkTokenLimit();
        });
    }

    // Initialization is done
    if($.isFunction(settings.onReady)) {
        settings.onReady.call();
    }
	
	//#080 To Store first li element from dropdown list
	var f_li;
    //
    // Public functions
    //

    this.clear = function() {
        token_list.children("li").each(function() {
            if ($(this).children("input").length === 0) {
                delete_token($(this));
            }
        });
    }

    this.add = function(item) {
        add_token(item);
    }

    this.remove = function(item) {
        token_list.children("li").each(function() {
            if ($(this).children("input").length === 0) {
                var currToken = $(this).data("customtokenInput");
                var match = true;
                for (var prop in item) {
                    if (item[prop] !== currToken[prop]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    delete_token($(this));
                }
            }
        });
    }
    
    this.getTokens = function() {
   		return saved_tokens;
   	}

    //
    // Private functions
    //

    function checkTokenLimit() {
        if(settings.tokenLimit !== null && token_count >= settings.tokenLimit) {
            input_box.hide();
            //hide_dropdown();
            return;
        }
    }

    function resize_input() {
        if(input_val === (input_val = input_box.val())) {return;}

        // Enter new content into resizer and resize input accordingly
        var escaped = input_val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        input_resizer.html(escaped);
        input_box.width(input_resizer.width() + 30);
    }

    function is_printable_character(keycode) {
        return ((keycode >= 48 && keycode <= 90) ||     // 0-1a-z
                (keycode >= 96 && keycode <= 111) ||    // numpad 0-9 + - / * .
                (keycode >= 186 && keycode <= 192) ||   // ; = , - . / ^
                (keycode >= 219 && keycode <= 222));    // ( \ ) '
    }

    // Inner function to a token to the list
    function insert_token(item) {
        var this_token = settings.tokenFormatter(item);
        if(item.type=='customergroup'){
            this_token = $(this_token)
                .addClass(settings.classes.token)
                .addClass('token_customer')
                .insertBefore(input_token);
        }
        else{
            this_token = $(this_token)
                .addClass(settings.classes.token)
                .insertBefore(input_token);
        }
        
		
		//show info popover
		var ctext ='';
		var tktext ='';
		var c_no = $('#c_no').val() ? $('#c_no').val() : 'Customer #';
		var co_name	= $('#co_name').val() ? $('#co_name').val() : 'Contact name';
		var co_email = $('#co_email').val() ? $('#co_email').val() : 'Contact email';
		var c_name = $('#c_name').val() ? $('#c_name').val() : 'Customer name';
		var c_email	= $('#c_email').val() ? $('#c_email').val() : 'Customer email';
		var show_sms_cellphone	= $('#show_sms_cellphone').val() ? $('#show_sms_cellphone').val() : 'Customer cellphone';
		var show_contact_name	= $('#show_contact_name').val() ? $('#show_contact_name').val() : 'Contact person name';
		var show_contact_sms_cellphone	= $('#show_contact_sms_cellphone').val() ? $('#show_contact_sms_cellphone').val() : 'Contact person cellphone';
		var show_contact_email = $('#show_contact_email').val() ? $('#show_contact_email').val() : 'Contact email';
		
		if(item.number){
			ctext += c_no+' : '+item.number+'</br>';
			tktext += 'c_no : '+item.number+'</br>';
		}
		if(item.name){
			if(item.cname){
				ctext += co_name+' : '+item.name+'</br>';
				tktext += 'co_name : '+item.name+'</br>';
			}else{
				ctext += c_name+' : '+item.name+'</br>';
				tktext += 'c_name : '+item.name+'</br>';
			}	
		}
		if(item.email){
			if(item.cname && item.cemail){
				ctext += co_email+' : '+item.email+'</br>';
				tktext += 'co_email : '+item.email+'</br>';
				ctext += c_name+' : '+item.cname+'</br>';
				tktext += 'c_name : '+item.cname+'</br>';
				ctext += c_email+' : '+item.cemail+'</br>';
				tktext += 'c_email : '+item.cemail+'</br>';
			}else{
				ctext += c_email+' : '+item.email+'</br>';
				tktext += 'c_email : '+item.email+'</br>';
			}
		}
		if(item.cellphone){
			ctext += show_sms_cellphone+' : '+item.cellphone+'</br>';
			tktext += 'show_sms_cellphone : '+item.cellphone+'</br>';
		}
		if(item.contact_name){
			ctext += show_contact_name+' : '+item.contact_name+'</br>';
			tktext += 'show_contact_name : '+item.contact_name+'</br>';
		}
		if(item.contact_cellphone){
			ctext += show_contact_sms_cellphone+' : '+item.contact_cellphone+'</br>';
			tktext += 'show_contact_sms_cellphone : '+item.contact_cellphone+'</br>';
		}
		if(item.contact_email){
			ctext += show_contact_email+' : '+item.contact_email+'</br>';
			tktext += 'show_contact_email : '+item.contact_email+'</br>';
		}
		if(!item.othr && item.othr != 'othr'){
			$("<span class='popovers' rel='popover' data-trigger='hover' data-html='true' data-placement='bottom' data-content='"+ctext+"' ><i style='margin: 3px 0px 0px 5px;' class='icon-chevron-down'></i></span>").appendTo(this_token);
			//$("<button class='popovers btn mini' rel='popover' data-trigger='hover' data-placement='bottom' data-content='"+ctext+"'>Bottom</button>").appendTo(this_token);
				var popOverSettings = {
				placement: 'left',
				trigger: 'hover',
				container: '.dkmodal',
				html: true,
				selector: '[rel="popover"]',
				content: ctext,
			}
			$('.dkmodal').popover(popOverSettings);
			//saving token text to input field
			$("<input type='hidden' name='"+item.id+"' class='token_text' value='"+JSON.stringify(item)+"'>").appendTo(this_token);
			
		}
		else{
			$("<input type='hidden' name='"+item.id+"' class='token_text' value='"+JSON.stringify(item)+"'>").appendTo(this_token);
		}
        // The 'delete token' button
        $("<span>" + settings.deleteText + "</span>")
            .addClass(settings.classes.tokenDelete)
            .appendTo(this_token)
            .click(function () {
                delete_token($(this).parent());
                hidden_input.change();
                return false;
            });

        // Store data on the token
        if(!item.othr && item.othr != 'othr'){
			var token_data = {"id": item.id,"ctext":ctext};
		}
		else{
			var token_data = {"id": item.id};
		}
        token_data[settings.propertyToSearch] = item[settings.propertyToSearch];
        $.data(this_token.get(0), "customtokenInput", item);

        // Save this token for duplicate checking
        saved_tokens = saved_tokens.slice(0,selected_token_index).concat([token_data]).concat(saved_tokens.slice(selected_token_index));
        selected_token_index++;

        // Update the hidden input
        update_hidden_input(saved_tokens, hidden_input);

        token_count += 1;

        // Check the token limit
        if(settings.tokenLimit !== null && token_count >= settings.tokenLimit) {
            input_box.hide();
            //hide_dropdown();
        }
        hide_dropdown();
        return this_token;
    }

    // Add a token to the token list based on user input
    function add_token (item) {
        var callback = settings.onAdd;
        // See if the token already exists and select it if we don't want duplicates
        if(token_count > 0 && settings.preventDuplicates) {
            var found_existing_token = null;
            token_list.children().each(function () {
                var existing_token = $(this);
                var existing_data = $.data(existing_token.get(0), "customtokenInput");
				if(item){
					if(existing_data && existing_data.id === item.id) {
						found_existing_token = existing_token;

						return false;
					}
				}	
            });

            if(found_existing_token) {
                select_token(found_existing_token);
                input_token.insertAfter(found_existing_token);
                input_box.focus();
                return;
            }
        }

        // Insert the new tokens
        if(settings.tokenLimit == null || token_count < settings.tokenLimit) {
            insert_token(item);
            checkTokenLimit();
        }

        // Clear input box
        input_box.val("");

        // Don't show the help dropdown, they've got the idea
        //hide_dropdown();

        // Execute the onAdd callback if defined
        if($.isFunction(callback)) {
            callback.call(hidden_input,item);
        }
    }

    // Select a token in the token list
    function select_token (token) {
        token.addClass(settings.classes.selectedToken);
        selected_token = token.get(0);

        // Hide input box
        input_box.val("");

        // Hide dropdown if it is visible (eg if we clicked to select token)
        //hide_dropdown();
    }

    // Deselect a token in the token list
    function deselect_token (token, position) {
        token.removeClass(settings.classes.selectedToken);
        selected_token = null;

        if(position === POSITION.BEFORE) {
            input_token.insertBefore(token);
            selected_token_index--;
        } else if(position === POSITION.AFTER) {
            input_token.insertAfter(token);
            selected_token_index++;
        } else {
            input_token.appendTo(token_list);
            selected_token_index = token_count;
        }

        // Show the input box and give it focus again
        input_box.focus();
    }

    // Toggle selection of a token in the token list
    function toggle_select_token(token) {
        var previous_selected_token = selected_token;

        if(selected_token) {
            deselect_token($(selected_token), POSITION.END);
        }

        if(previous_selected_token === token.get(0)) {
            deselect_token(token, POSITION.END);
        } else {
            select_token(token);
        }
    }

    // Delete a token from the token list
    function delete_token (token) {
        // Remove the id from the saved list
        var token_data = $.data(token.get(0), "customtokenInput");
        var callback = settings.onDelete;

        var index = token.prevAll().length;
        if(index > selected_token_index) index--;

        // Delete the token
        token.remove();
        selected_token = null;

        // Show the input box and give it focus again
        input_box.focus();

        // Remove this token from the saved list
        saved_tokens = saved_tokens.slice(0,index).concat(saved_tokens.slice(index+1));
        if(index < selected_token_index) selected_token_index--;

        // Update the hidden input
        update_hidden_input(saved_tokens, hidden_input);

        token_count -= 1;

        if(settings.tokenLimit !== null) {
            input_box
                .show()
                .val("")
                .focus();
        }

        // Execute the onDelete callback if defined
        if($.isFunction(callback)) {
            callback.call(hidden_input,token_data);
        }
    }

    // Update the hidden input box value
    function update_hidden_input(saved_tokens, hidden_input) {
        var token_values = $.map(saved_tokens, function (el) {
            return el[settings.tokenValue];
        });
        hidden_input.val(token_values.join(settings.tokenDelimiter));

    }

    // Hide and clear the results dropdown
    function hide_dropdown () {
        dropdown.hide().empty();
        selected_dropdown_item = null;
    }

    function show_dropdown() {
		
      
            dropdown
            .css({
                position: "absolute",
                top: $(token_list).offset().top + $(token_list).outerHeight(),
                left: $(token_list).offset().left,
                height: "250px",
                width:"517px",
               "overflow-y": "scroll",
                zindex: 999,

            })
            .show();
     
           
        selected_dropdown_item = null;    
    }

    function show_dropdown_searching () {
        if(settings.searchingText) {
            dropdown.html("<p>"+settings.searchingText+"</p>");
            show_dropdown();
        }
    }

    function show_dropdown_hint () {
        if(settings.hintText) {
            dropdown.html("<p>"+settings.hintText+"</p>");
            show_dropdown();
        }
    }

    // Highlight the query part of the search term
    function highlight_term(value, term) {
        return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<b>$1</b>");
    }
    
    function find_value_and_highlight_term(template, value, term) {
        return template.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + value + ")(?![^<>]*>)(?![^&;]+;)", "g"), highlight_term(value, term));
    }

    // Populate the results dropdown with some results
    function populate_dropdown(query, results) {
        if($(input_box).parent().parent().parent().hasClass('controls-cc') || $(input_box).parent().parent().parent().hasClass('controls-bcc')){
            console.log(results);
            if(results.length!=0){
                var spl = [];
                for(var j in results){
                    if(results[j].type=='customergroup'){
                        spl.push(j);
                    }
                }
                for(var k in spl){
                    results.splice(spl[k]);
                }
            }
            if(results.length==0){
                if(settings.noResultsText) {
                    dropdown.html("<p>"+settings.noResultsText+"</p>");
                }
            }
        }
        if(results && results.length) {
            dropdown.empty();

            var dropdown_ul = $("<ul>")
                .appendTo(dropdown)
                .mouseover(function (event) {
                    select_dropdown_item($(event.target).closest("li"));
                })
                .mousedown(function (event) {
					//check if clicked on show more button 080
					//console.log(event.target.nodeName); 
					if($(event.target).closest("li").data("customtokenInput")){
						add_token($(event.target).closest("li").data("customtokenInput"));
						hidden_input.change();
						return;
					}
					else{
						
						return;
					}
				   //

                })
                .hide();

            $.each(results, function(index, value) {
                var this_li = settings.resultsFormatter(value);
                
                this_li = find_value_and_highlight_term(this_li ,value[settings.propertyToSearch], query);            

                this_li = $(this_li).appendTo(dropdown_ul);
                
                if(index % 2) {
                    this_li.addClass(settings.classes.dropdownItem);
                } else {
                    this_li.addClass(settings.classes.dropdownItem2);
                }

                if(index === 0) {
                  //  select_dropdown_item(this_li);
                  //#080 save first li element to select on keydown event
                  f_li = this_li;
                }
			
                $.data(this_li.get(0), "customtokenInput", value);
            });

            show_dropdown();

            if(settings.animateDropdown) {
                dropdown_ul.slideDown("fast");
            } else {
                dropdown_ul.show();
            }
        } else {
            if(settings.noResultsText) {
                dropdown.html("<p>"+settings.noResultsText+"</p>");
                //hide_dropdown();//080 for hiding no result text
            }
        }
    }

    // Highlight an item in the results dropdown
    function select_dropdown_item (item) {
        if(item) {
            if(selected_dropdown_item) {
                deselect_dropdown_item($(selected_dropdown_item));
            }
            item.addClass(settings.classes.selectedDropdownItem);
            selected_dropdown_item = item.get(0);
        }
    }

    // Remove highlighting from an item in the results dropdown
    function deselect_dropdown_item (item) {
        item.removeClass(settings.classes.selectedDropdownItem);
        selected_dropdown_item = null;
    }

    // Do a search and show the "searching" dropdown if the input is longer
    // than settings.minChars
    function do_search() {
        var query = input_box.val().toLowerCase();

        if(query && query.length) {
            if(selected_token) {
                deselect_token($(selected_token), POSITION.AFTER);
            }

            if(query.length >= settings.minChars) {
                show_dropdown_searching();
                clearTimeout(timeout);

                timeout = setTimeout(function(){
                    run_search(query);
                }, settings.searchDelay);
            } else {
                //hide_dropdown();
            }
        }
    }

    // Do the actual search
    function run_search(query) {

        var cache_key = query + computeURL();
        var cached_results = cache.get(cache_key);
        if(cached_results) {
            populate_dropdown(query, cached_results);
        } else {
            // Are we doing an ajax search or local data search?
            if(settings.url) {
                var url = computeURL();
                // Extract exisiting get params
                var ajax_params = {};
                ajax_params.data = {};
                if(url.indexOf("?") > -1) {
                    var parts = url.split("?");
                    ajax_params.url = parts[0];

                    var param_array = parts[1].split("&");
                    $.each(param_array, function (index, value) {
                        var kv = value.split("=");
                        ajax_params.data[kv[0]] = kv[1];
                    });
                } else {
                    ajax_params.url = url;
                }

                // Prepare the request
                ajax_params.data[settings.queryParam] = query;
                ajax_params.type = settings.method;
                ajax_params.dataType = settings.contentType;
                if(settings.crossDomain) {
                    ajax_params.dataType = "jsonp";
                }

                // Attach the success callback
                ajax_params.success = function(results) {
                  if($.isFunction(settings.onResult)) {
                      results = settings.onResult.call(hidden_input, results.response.response);
                  }
                  cache.add(cache_key, settings.jsonContainer ? results[settings.jsonContainer] : results);

                  // only populate the dropdown if the results are associated with the active search query
                  if(input_box.val().toLowerCase() === query) {
					  alert('ajax');
                      populate_dropdown(query, settings.jsonContainer ? results[settings.jsonContainer] : results.response.response);
                  }
                };

                // Make the request
                //$.ajax(ajax_params);
            
                 $.ajax({
					type: 'POST',
					url:  ajax_params.url,
					data:  ajax_params.data,
					async: true,
					dataType : "json",
					success: function(data,status,xhr){
						 populate_dropdown(query, settings.jsonContainer ? results[settings.jsonContainer] : data.response.response);
                         cache.add(cache_key, settings.jsonContainer ? results[settings.jsonContainer] : data.response.response);


					}
				});

                
            } else if(settings.local_data) {
                // Do the search through local data
                var results = $.grep(settings.local_data, function (row) {
                    return row[settings.propertyToSearch].toLowerCase().indexOf(query.toLowerCase()) > -1;
                });

                if($.isFunction(settings.onResult)) {
                    results = settings.onResult.call(hidden_input, results);
                }
                
                cache.add(cache_key, results);
                 $.ajax({
					type: 'POST',
					url:  ajax_params.url,
					data:  ajax_params.data,
					async: false,
					dataType : "json",
					success: function(data,status,xhr){
						       populate_dropdown(query, settings.jsonContainer ? results[settings.jsonContainer] : data.response.response);
					}
				});
                //populate_dropdown(query, results);
            }
        }
    }

    // compute the dynamic URL
    function computeURL() {
        var url = settings.url;
        if(typeof settings.url == 'function') {
            url = settings.url.call();
        }
        return url;
    }
};

// Really basic cache for the results
$.customTokenList.Cache = function (options) {
    var settings = $.extend({
        max_size: 500
    }, options);

    var data = {};
    var size = 0;

    var flush = function () {
        data = {};
        size = 0;
    };

    this.add = function (query, results) {
        if(size > settings.max_size) {
            flush();
        }

        if(!data[query]) {
            size += 1;
        }

        data[query] = results;
    };

    this.get = function (query) {
        return data[query];
    };
};
}(jQuery));

/*no more required now
function show_more_sub_list(num){
	
	if($('.mor_l'+num).is(':hidden')){
		$('.mrl').hide();
		$('.mor_l'+num).show(); //show current
	}
	else{
		$('.mrl').hide(); //hide others
	}
}
*/ 
	
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function jump_to_next_li(li) {
	return li.next('li');
}
