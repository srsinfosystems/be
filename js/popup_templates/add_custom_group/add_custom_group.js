
var APISERVER = $('#APISERVER').val();
var token = $('#token').val();
var language = $('#language').val();
var lang = $('#lang').val();
var partner_id =$('#partner_id').val();
var admin_id = $('#admin_id').val();


var add_cstm_grp_meta;
var add_cstm_grp_dt;
var global_ret_addr_popupid = 'popups';
var add_cstm_grp_tr;
var all_cust = [];
var add_custom_group = {
	start:function(popupid,metadata={}){
		global_ret_addr_popupid = popupid;
		add_cstm_grp_meta = metadata;

		var total_params = {
			APISERVER:APISERVER,
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			getTranslationsData:'yes',
			getTranslationsDataArray:['Save','Cancel','Add custom group','Edit custom group','Name','Please check the following fields','Alert message','Success','success','Address1','Address2','Zip','City','success','Success','Return address added successfully','Success','Return address edited successfully','Customers','Customers in group','Nothing to move','Search','Customer group added successfully','Customer group edited successfully'],
		};
		if(add_cstm_grp_meta.id!=null && add_cstm_grp_meta.id!=undefined && add_cstm_grp_meta!=''){
			total_params.id = add_cstm_grp_meta.id;
		}
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getCustomGroups.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				add_cstm_grp_dt = complet_data.response.response;
				all_cust = add_cstm_grp_dt.customer;
				add_cstm_grp_tr = complet_data.response.response.translationsData;
				add_custom_group.createHtml(complet_data.response.response);
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',add_cstm_grp_tr.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',add_cstm_grp_tr.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	},
	createHtml:function(){
		var template = document.getElementById('add_custom_group_template').innerHTML;
		add_cstm_grp_dt.meta_data = add_cstm_grp_meta;
		var compiledRendered = Template7(template, add_cstm_grp_dt);
		document.getElementById(global_ret_addr_popupid).innerHTML = compiledRendered;
		resizemodal(global_ret_addr_popupid);
		add_custom_group.bindEvents();
	},
	bindEvents:function(){

		$('#add_custom_group_save').click(function(){
			$('#search_cust_in_group').val('').trigger('keyup');
			$('#search_all_cust').val('').trigger('keyup');
			add_custom_group.saveData();
		});

		$('#btnRight').click(function (e) {
			$('#search_cust_in_group').val('').trigger('keyup');
			$('#search_all_cust').val('').trigger('keyup');
            $('select').moveToListAndDelete('#lstBox1', '#lstBox2');
            e.preventDefault();
        });

        $('#btnAllRight').click(function (e) {
        	$('#search_cust_in_group').val('').trigger('keyup');
			$('#search_all_cust').val('').trigger('keyup');
            $('select').moveAllToListAndDelete('#lstBox1', '#lstBox2');
            e.preventDefault();
        });

        $('#btnLeft').click(function (e) {
        	$('#search_cust_in_group').val('').trigger('keyup');
			$('#search_all_cust').val('').trigger('keyup');
            $('select').moveToListAndDelete('#lstBox2', '#lstBox1');
            e.preventDefault();
        });

        $('#btnAllLeft').click(function (e) {
        	$('#search_cust_in_group').val('').trigger('keyup');
			$('#search_all_cust').val('').trigger('keyup');
            $('select').moveAllToListAndDelete('#lstBox2', '#lstBox1');
            e.preventDefault();
        });

        var a = all_cust;
        all_cust = [];
        for(var j in a){
        	all_cust.push(a[j].Customer);
        }
       
        var options = {
			shouldSort: true,
			threshold: 0.2,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			tokenize:true,
			minMatchCharLength: 1,
			keys: [
				"customer_name",
				"customer_number"
			]
		};
		
		var fuse = new Fuse(all_cust, options);
		$('#search_all_cust').keyup(function(){
			$('#lstBox2 option').removeAttr('disabled');
			$('#lstBox2 option').removeClass('disabled');
				
			var search = $(this).val();
			if(search==''){
				$('#lstBox1 option').removeAttr('disabled');
				$('#lstBox1 option').removeClass('disabled');
			}
			else{
				var result = fuse.search(search);
				$('#lstBox1 option').attr('disabled','disabled');
				$('#lstBox1 option').addClass('disabled');
				for(var j in result){
					$('#lstBox1 option[data-primary-key="'+result[j].id+'"]').removeClass('disabled');
					$('#lstBox1 option[data-primary-key="'+result[j].id+'"]').removeAttr('disabled');
				}
				var a = $('#lstBox1 option[disabled]').clone();
				var b = $("#lstBox1 option[disabled!='disabled']")

				$('#lstBox1').html('');
				$('#lstBox1').append(b);
				$('#lstBox1').append(a);

			}
		});

		$('#search_cust_in_group').keyup(function(){
			$('#lstBox1 option').removeAttr('disabled');
			$('#lstBox1 option').removeClass('disabled');
			
			var search = $(this).val();
			if(search==''){
				$('#lstBox2 option').removeAttr('disabled');
				$('#lstBox2 option').removeClass('disabled');
			}
			else{
				var result = fuse.search(search);
				$('#lstBox2 option').addClass('hide');
				for(var j in result){
					$('#lstBox2 option[data-primary-key="'+result[j].id+'"]').removeClass('hide');
				}

				var result = fuse.search(search);
				$('#lstBox2 option').attr('disabled','disabled');
				$('#lstBox2 option').addClass('disabled');
				for(var j in result){
					$('#lstBox2 option[data-primary-key="'+result[j].id+'"]').removeClass('disabled');
					$('#lstBox2 option[data-primary-key="'+result[j].id+'"]').removeAttr('disabled');
				}
				var a = $('#lstBox2 option[disabled]').clone();
				var b = $("#lstBox2 option[disabled!='disabled']")

				$('#lstBox2').html('');
				$('#lstBox2').append(b);
				$('#lstBox2').append(a);
			}
		});

		add_custom_group.generateCustomerList();
		
	},
	saveData:function(){
		var errmsg = '';

		var name = $('#add_custom_group_form #name').val();
		if(name=='' || name==undefined || name==null){
			errmsg += add_cstm_grp_dt.translationsData.Name+'<br/>';
		}

		var l = $('#lstBox2 option').length
		if(l < 1){
			errmsg += add_cstm_grp_dt.translationsData.Customers+'<br/>';
		}
		if(errmsg!=''){
			var finalerrmsg = add_cstm_grp_tr.Pleasecheckthefollowingfields+ ':<br/>' + errmsg;
			showAlertMessage(finalerrmsg,'error',add_cstm_grp_tr.AlertMessage);
			return;
		}

		var customer_ids = [];
		if(add_cstm_grp_meta.from == 'add'){
			$('#lstBox2 option').each(function(){
				var id = $(this).attr('data-primary-key');
				customer_ids.push(id);
			});
			customer_ids = JSON.stringify(customer_ids);
		}
		else{
			$('#lstBox2 option').each(function(){
				var customer_id = $(this).attr('data-primary-key');
				var id = $(this).attr('data-prm-key');
				var ids = '';
				if(id!=undefined && id!=null){
					ids = id;
				}
				customer_ids.push({
					customer_id:customer_id,
					id:ids
				});
			});
			customer_ids = JSON.stringify(customer_ids);
		}
		var total_params = {
			token:token,
			language:language,
			lang:lang,
			partner_id:partner_id,
			admin_id:admin_id,
			name:name,
			customer_ids:customer_ids,
			from:add_cstm_grp_meta.from
		};
		if(add_cstm_grp_meta.from == 'edit'){
			total_params.id = add_cstm_grp_dt.partnerCommunicationGroup[0].PartnerCommunicationGroup.id;
		}
		
		showProcessingImage('undefined');
		var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/savePartnerCustomGroups.json';
		params['data'] = total_params;
		params['completeCallbackFunction'] = function (){
			hideProcessingImage();
		};
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
					if(add_cstm_grp_meta.from=='add'){
						call_toastr(add_cstm_grp_tr.success, add_cstm_grp_tr.Success,add_cstm_grp_tr.Customergroupaddedsuccessfully);
						
					}
					else{
						call_toastr(add_cstm_grp_tr.success, add_cstm_grp_tr.Success,add_cstm_grp_tr.Customergroupeditedsuccessfully);						
					}
					$('.data-row').remove();
						$("#mss_comm_lst_cust_custom_empty_tr").hide();
						for(var j in complet_data.response.response.partnerCommunicationGroup){
							var d = complet_data.response.response.partnerCommunicationGroup[j];
							if(checkNull(add_cstm_grp_meta.cfrom) == 'bulk_actions'){
								var h = bulk_actions.generateCustomerCustomGroupRows(d);
							}
							else{
								var h = mass_communication_list.generateCustomerCustomGroupRows(d);
							}
							$("#custom_groups_table tbody").append(h);
							if(j == ( complet_data.response.response.partnerCommunicationGroup.length - 1)){
								customer_custom_groups.push({group_id:d.PartnerCommunicationGroup.id});
							}
						}
						
						if(checkNull(add_cstm_grp_meta.cfrom) == 'bulk_actions'){
							bulk_actions.bindCustomGroups();
						}
						else{
							mass_communication_list.bindCustomGroups();
						}
						
					$('#'+global_ret_addr_popupid).modal('hide');
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					var finalerrmsg = add_cstm_grp_tr.Pleasecheckthefollowingfields+ ':<br/>' + array;
					showAlertMessage(finalerrmsg,'error',add_cstm_grp_tr.Alertmessage);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',add_cstm_grp_tr.Alertmessage);
					return;
				}	
			}
		}
		doAjax(params);
		return;
	
	},
	generateCustomerList:function(){
		var cust = add_cstm_grp_dt.customer;
		
		var cust_ids = [];
		var prmry_kys = [];
		var pcg = [];

		if(add_cstm_grp_meta.from=='edit'){
			pcg = add_cstm_grp_dt.partnerCommunicationGroup;
			if(pcg[0][0].nocust!=null && pcg[0][0].nocust!=undefined && pcg[0][0].nocust!=''){
				var both_data = pcg[0][0].nocust.split('$');
				cust_ids =  both_data[0].split(',');
				prmry_kys =  both_data[1].split(',');
			}
		}
		var lstBox2 = '';

		for(var j in cust_ids){
			var d = cust_ids[j];
			var cust_data = '';
			for(var k in cust){
				if(cust[k].Customer.id == d){
					cust_data = cust[k].Customer;
					cust.splice(k,1);
					break;
				}
			}
			lstBox2 += '<option data-prm-key = "'+prmry_kys[j]+'" value="'+cust_data.id+'" data-primary-key="'+cust_data.id+'" data-cust-no="'+cust_data.customer_number+'" data-cust-name="'+cust_data.customer_name+'">';
				lstBox2 += cust_data.customer_name;
			lstBox2 += '</option>';
		}

		var lstBox1 = '';
		for(var j in cust){
			var cust_data = cust[j].Customer;
			lstBox1 += '<option value="'+cust_data.id+'" data-primary-key="'+cust_data.id+'" data-cust-no="'+cust_data.customer_number+'" data-cust-name="'+cust_data.customer_name+'">';
				lstBox1 += cust_data.customer_name;
			lstBox1 += '</option>';
		}

		$("#lstBox2").append(lstBox2);
		$("#lstBox1").append(lstBox1);		
	},
	showMsg:function(){
		showAlertMessage(add_cstm_grp_tr.Nothingtomove,'error',add_cstm_grp_tr.Alertmessage);
		return;
	}
}

Template7.registerHelper('CustomerListHelper', function (data){
	return add_custom_group.generateCustomerList(data);
});

/**
 *  jQuery.SelectListActions
 *  https://github.com/esausilva/jquery.selectlistactions.js
 *
 *  (c) http://esausilva.com
 */

(function ($) {
    //Moves selected item(s) from sourceList to destinationList
    $.fn.moveToList = function (sourceList, destinationList) {
        var opts = $(sourceList + ' option:selected');
        if (opts.length == 0) {
            add_custom_group.showMsg();
        }

        $(destinationList).append($(opts).clone());
    };

    //Moves all items from sourceList to destinationList
    $.fn.moveAllToList = function (sourceList, destinationList) {
        var opts = $(sourceList + ' option:not(.hide)');

        if (opts.length == 0) {
            add_custom_group.showMsg();
        }

        $(destinationList).append($(opts).clone());
    };

    //Moves selected item(s) from sourceList to destinationList and deleting the
    // selected item(s) from the source list
    $.fn.moveToListAndDelete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      = function (sourceList, destinationList) {
        var opts = $(sourceList + ' option:selected');

        if (opts.length == 0) {
            add_custom_group.showMsg();
        }

        $(opts).remove();
        $(destinationList).append($(opts).clone());
    };

    //Moves all items from sourceList to destinationList and deleting
    // all items from the source list
    $.fn.moveAllToListAndDelete = function (sourceList, destinationList) {
        var opts = $(sourceList + ' option:not(.hide)');
        if (opts.length == 0) {
            add_custom_group.showMsg();
        }
         console.log(sourceList);
        $(opts).remove();
        $(destinationList).append($(opts).clone());
    };

    //Removes selected item(s) from list
    $.fn.removeSelected = function (list) {
        var opts = $(list + ' option:selected');
        if (opts.length == 0) {
            alert("Nothing to remove");
        }

        $(opts).remove();
    };

    //Moves selected item(s) up or down in a list
    $.fn.moveUpDown = function (list, btnUp, btnDown) {
        var opts = $(list + ' option:selected');
        if (opts.length == 0) {
            add_custom_group.showMsg();
        }

        if (btnUp) {
            opts.first().prev().before(opts);
        } else if (btnDown) {
            opts.last().next().after(opts);
        }
    };
})(jQuery);

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Fuse",[],t):"object"==typeof exports?exports.Fuse=t():e.Fuse=t()}(this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=8)}([function(e,t,r){"use strict";e.exports=function(e){return"[object Array]"===Object.prototype.toString.call(e)}},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(5),a=r(7),s=r(4),c=function(){function e(t,r){var o=r.location,i=void 0===o?0:o,a=r.distance,c=void 0===a?100:a,h=r.threshold,l=void 0===h?.6:h,u=r.maxPatternLength,f=void 0===u?32:u,v=r.isCaseSensitive,d=void 0!==v&&v,p=r.tokenSeparator,g=void 0===p?/ +/g:p,y=r.findAllMatches,m=void 0!==y&&y,k=r.minMatchCharLength,x=void 0===k?1:k;n(this,e),this.options={location:i,distance:c,threshold:l,maxPatternLength:f,isCaseSensitive:d,tokenSeparator:g,findAllMatches:m,minMatchCharLength:x},this.pattern=this.options.isCaseSensitive?t:t.toLowerCase(),this.pattern.length<=f&&(this.patternAlphabet=s(this.pattern))}return o(e,[{key:"search",value:function(e){if(this.options.isCaseSensitive||(e=e.toLowerCase()),this.pattern===e)return{isMatch:!0,score:0,matchedIndices:[[0,e.length-1]]};var t=this.options,r=t.maxPatternLength,n=t.tokenSeparator;if(this.pattern.length>r)return i(e,this.pattern,n);var o=this.options,s=o.location,c=o.distance,h=o.threshold,l=o.findAllMatches,u=o.minMatchCharLength;return a(e,this.pattern,this.patternAlphabet,{location:s,distance:c,threshold:h,findAllMatches:l,minMatchCharLength:u})}}]),e}();e.exports=c},function(e,t,r){"use strict";var n=r(0),o=function e(t,r,o){if(r){var i=r.indexOf("."),a=r,s=null;-1!==i&&(a=r.slice(0,i),s=r.slice(i+1));var c=t[a];if(null!==c&&void 0!==c)if(s||"string"!=typeof c&&"number"!=typeof c)if(n(c))for(var h=0,l=c.length;h<l;h+=1)e(c[h],s,o);else s&&e(c,s,o);else o.push(c.toString())}else o.push(t);return o};e.exports=function(e,t){return o(e,t,[])}},function(e,t,r){"use strict";e.exports=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=[],n=-1,o=-1,i=0,a=e.length;i<a;i+=1){var s=e[i];s&&-1===n?n=i:s||-1===n||(o=i-1,o-n+1>=t&&r.push([n,o]),n=-1)}return e[i-1]&&i-n>=t&&r.push([n,i-1]),r}},function(e,t,r){"use strict";e.exports=function(e){for(var t={},r=e.length,n=0;n<r;n+=1)t[e.charAt(n)]=0;for(var o=0;o<r;o+=1)t[e.charAt(o)]|=1<<r-o-1;return t}},function(e,t,r){"use strict";var n=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;e.exports=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:/ +/g,o=new RegExp(t.replace(n,"\\$&").replace(r,"|")),i=e.match(o),a=!!i,s=[];if(a)for(var c=0,h=i.length;c<h;c+=1){var l=i[c];s.push([e.indexOf(l),l.length-1])}return{score:a?.5:1,isMatch:a,matchedIndices:s}}},function(e,t,r){"use strict";e.exports=function(e,t){var r=t.errors,n=void 0===r?0:r,o=t.currentLocation,i=void 0===o?0:o,a=t.expectedLocation,s=void 0===a?0:a,c=t.distance,h=void 0===c?100:c,l=n/e.length,u=Math.abs(s-i);return h?l+u/h:u?1:l}},function(e,t,r){"use strict";var n=r(6),o=r(3);e.exports=function(e,t,r,i){for(var a=i.location,s=void 0===a?0:a,c=i.distance,h=void 0===c?100:c,l=i.threshold,u=void 0===l?.6:l,f=i.findAllMatches,v=void 0!==f&&f,d=i.minMatchCharLength,p=void 0===d?1:d,g=s,y=e.length,m=u,k=e.indexOf(t,g),x=t.length,S=[],M=0;M<y;M+=1)S[M]=0;if(-1!==k){var b=n(t,{errors:0,currentLocation:k,expectedLocation:g,distance:h});if(m=Math.min(b,m),-1!==(k=e.lastIndexOf(t,g+x))){var _=n(t,{errors:0,currentLocation:k,expectedLocation:g,distance:h});m=Math.min(_,m)}}k=-1;for(var L=[],w=1,C=x+y,A=1<<x-1,I=0;I<x;I+=1){for(var O=0,F=C;O<F;){n(t,{errors:I,currentLocation:g+F,expectedLocation:g,distance:h})<=m?O=F:C=F,F=Math.floor((C-O)/2+O)}C=F;var P=Math.max(1,g-F+1),j=v?y:Math.min(g+F,y)+x,z=Array(j+2);z[j+1]=(1<<I)-1;for(var T=j;T>=P;T-=1){var E=T-1,K=r[e.charAt(E)];if(K&&(S[E]=1),z[T]=(z[T+1]<<1|1)&K,0!==I&&(z[T]|=(L[T+1]|L[T])<<1|1|L[T+1]),z[T]&A&&(w=n(t,{errors:I,currentLocation:E,expectedLocation:g,distance:h}))<=m){if(m=w,(k=E)<=g)break;P=Math.max(1,2*g-k)}}if(n(t,{errors:I+1,currentLocation:g,expectedLocation:g,distance:h})>m)break;L=z}return{isMatch:k>=0,score:0===w?.001:w,matchedIndices:o(S,p)}}},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(1),a=r(2),s=r(0),c=function(){function e(t,r){var o=r.location,i=void 0===o?0:o,s=r.distance,c=void 0===s?100:s,h=r.threshold,l=void 0===h?.6:h,u=r.maxPatternLength,f=void 0===u?32:u,v=r.caseSensitive,d=void 0!==v&&v,p=r.tokenSeparator,g=void 0===p?/ +/g:p,y=r.findAllMatches,m=void 0!==y&&y,k=r.minMatchCharLength,x=void 0===k?1:k,S=r.id,M=void 0===S?null:S,b=r.keys,_=void 0===b?[]:b,L=r.shouldSort,w=void 0===L||L,C=r.getFn,A=void 0===C?a:C,I=r.sortFn,O=void 0===I?function(e,t){return e.score-t.score}:I,F=r.tokenize,P=void 0!==F&&F,j=r.matchAllTokens,z=void 0!==j&&j,T=r.includeMatches,E=void 0!==T&&T,K=r.includeScore,$=void 0!==K&&K,J=r.verbose,N=void 0!==J&&J;n(this,e),this.options={location:i,distance:c,threshold:l,maxPatternLength:f,isCaseSensitive:d,tokenSeparator:g,findAllMatches:m,minMatchCharLength:x,id:M,keys:_,includeMatches:E,includeScore:$,shouldSort:w,getFn:A,sortFn:O,verbose:N,tokenize:P,matchAllTokens:z},this.setCollection(t)}return o(e,[{key:"setCollection",value:function(e){return this.list=e,e}},{key:"search",value:function(e){this._log('---------\nSearch pattern: "'+e+'"');var t=this._prepareSearchers(e),r=t.tokenSearchers,n=t.fullSearcher,o=this._search(r,n),i=o.weights,a=o.results;return this._computeScore(i,a),this.options.shouldSort&&this._sort(a),this._format(a)}},{key:"_prepareSearchers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];if(this.options.tokenize)for(var r=e.split(this.options.tokenSeparator),n=0,o=r.length;n<o;n+=1)t.push(new i(r[n],this.options));return{tokenSearchers:t,fullSearcher:new i(e,this.options)}}},{key:"_search",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1],r=this.list,n={},o=[];if("string"==typeof r[0]){for(var i=0,a=r.length;i<a;i+=1)this._analyze({key:"",value:r[i],record:i,index:i},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t});return{weights:null,results:o}}for(var s={},c=0,h=r.length;c<h;c+=1)for(var l=r[c],u=0,f=this.options.keys.length;u<f;u+=1){var v=this.options.keys[u];if("string"!=typeof v){if(s[v.name]={weight:1-v.weight||1},v.weight<=0||v.weight>1)throw new Error("Key weight has to be > 0 and <= 1");v=v.name}else s[v]={weight:1};this._analyze({key:v,value:this.options.getFn(l,v),record:l,index:c},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t})}return{weights:s,results:o}}},{key:"_analyze",value:function(e,t){var r=e.key,n=e.arrayIndex,o=void 0===n?-1:n,i=e.value,a=e.record,c=e.index,h=t.tokenSearchers,l=void 0===h?[]:h,u=t.fullSearcher,f=void 0===u?[]:u,v=t.resultMap,d=void 0===v?{}:v,p=t.results,g=void 0===p?[]:p;if(void 0!==i&&null!==i){var y=!1,m=-1,k=0;if("string"==typeof i){this._log("\nKey: "+(""===r?"-":r));var x=f.search(i);if(this._log('Full text: "'+i+'", score: '+x.score),this.options.tokenize){for(var S=i.split(this.options.tokenSeparator),M=[],b=0;b<l.length;b+=1){var _=l[b];this._log('\nPattern: "'+_.pattern+'"');for(var L=!1,w=0;w<S.length;w+=1){var C=S[w],A=_.search(C),I={};A.isMatch?(I[C]=A.score,y=!0,L=!0,M.push(A.score)):(I[C]=1,this.options.matchAllTokens||M.push(1)),this._log('Token: "'+C+'", score: '+I[C])}L&&(k+=1)}m=M[0];for(var O=M.length,F=1;F<O;F+=1)m+=M[F];m/=O,this._log("Token score average:",m)}var P=x.score;m>-1&&(P=(P+m)/2),this._log("Score average:",P);var j=!this.options.tokenize||!this.options.matchAllTokens||k>=l.length;if(this._log("\nCheck Matches: "+j),(y||x.isMatch)&&j){var z=d[c];z?z.output.push({key:r,arrayIndex:o,value:i,score:P,matchedIndices:x.matchedIndices}):(d[c]={item:a,output:[{key:r,arrayIndex:o,value:i,score:P,matchedIndices:x.matchedIndices}]},g.push(d[c]))}}else if(s(i))for(var T=0,E=i.length;T<E;T+=1)this._analyze({key:r,arrayIndex:T,value:i[T],record:a,index:c},{resultMap:d,results:g,tokenSearchers:l,fullSearcher:f})}}},{key:"_computeScore",value:function(e,t){this._log("\n\nComputing score:\n");for(var r=0,n=t.length;r<n;r+=1){for(var o=t[r].output,i=o.length,a=0,s=1,c=0;c<i;c+=1){var h=e?e[o[c].key].weight:1,l=1===h?o[c].score:o[c].score||.001,u=l*h;1!==h?s=Math.min(s,u):(o[c].nScore=u,a+=u)}t[r].score=1===s?a/i:s,this._log(t[r])}}},{key:"_sort",value:function(e){this._log("\n\nSorting...."),e.sort(this.options.sortFn)}},{key:"_format",value:function(e){var t=[];this.options.verbose&&this._log("\n\nOutput:\n\n",JSON.stringify(e));var r=[];this.options.includeMatches&&r.push(function(e,t){var r=e.output;t.matches=[];for(var n=0,o=r.length;n<o;n+=1){var i=r[n];if(0!==i.matchedIndices.length){var a={indices:i.matchedIndices,value:i.value};i.key&&(a.key=i.key),i.hasOwnProperty("arrayIndex")&&i.arrayIndex>-1&&(a.arrayIndex=i.arrayIndex),t.matches.push(a)}}}),this.options.includeScore&&r.push(function(e,t){t.score=e.score});for(var n=0,o=e.length;n<o;n+=1){var i=e[n];if(this.options.id&&(i.item=this.options.getFn(i.item,this.options.id)[0]),r.length){for(var a={item:i.item},s=0,c=r.length;s<c;s+=1)r[s](i,a);t.push(a)}else t.push(i.item)}return t}},{key:"_log",value:function(){if(this.options.verbose){var e;(e=console).log.apply(e,arguments)}}}]),e}();e.exports=c}])});
