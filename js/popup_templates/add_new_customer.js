var  i = 0;
var cust_popid= 'popups';
function getEinPhone(){

	$('#show_ein_details_duplicate').html('');
	$('#show_ein_details_data').html('');
	document.getElementById('hiddenNewCustomerImg').style.visibility = 'unset';
	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var lang = $('#lang').val();
	var partner_id = $('#partner_id').val();
	var alert_message = $('#alert_message').val();
	var ein_error = $('#ein_error').val();
	var no_record_found = $('#no_record_found').val();
	
	var ein = $('#EINEin').val();
	if(ein == '' || ein == undefined){
		document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
		showAlertMessage(ein_error,'error',alert_message);
		return;
	}
	var check_ein = !isNaN(ein);
	if(check_ein === false){
		document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
		showAlertMessage(ein_error,'error',alert_message);
		return;
	}
	var ein_len = ein.length;
	if(ein_len < 8){
		document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
		showAlertMessage(ein_error,'error',alert_message);
		return;
	}
	var total_params = {
		token:token,
		language:language,
		lang:lang,
		partner_id:partner_id,
		phone_no:$('#EINEin').val(),
	};
	if(i==0){
		total_params.getfields = 'yes';
	}
	var j = 0;
	$.ajax({
			type: 'POST',
			url: APISERVER+'/api/search/getEinInformation',
			data: total_params,
			async: true,
			dataType : "json",
			success: function(complet_data,status,xhr){
				if(complet_data!=undefined && complet_data!=null && complet_data!=''){
					if(complet_data.response.status == 'success'){
						document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
						var from_data = complet_data.response.response.from;
						var html = '';

						if(from_data == 'getPhoneNumber'){
							var all_company_name = [];
							var all_address= [];
							var all_name = [];
							var all_phone_number = [];
							var all_alternate_number = [];
							var all_landline_number = [];
							var gotoh = '';
							var data = complet_data.response.response.data;
							var html = '';
							if(data!='' && data!=undefined && data!=null){
								var res = data;
								var j = 0;
								var k = 0;
								$.each(res, function(i,v){
									var decodedata = JSON.parse(v.LookupsCache.data);
									$.each(decodedata, function(index,val){
										j++;
										k++;
										html += '<div class="span12 box">';
											//html += '<ul class="unstyled span2"><li>'+j+'</li></ul>';
											html += '<ul class="unstyled span9">';
												var fname = '';
												if(val.first_name!=undefined && val.first_name!=null && val.first_name!=''){
													fname = val.first_name;
													
												}
												var lname = '';
												if(val.last_name!=undefined && val.last_name!=null && val.last_name!=''){
													lname = val.last_name;
													
												}
												
												if(fname!='' || lname!=''){
														all_name.push(fname+'_'+lname);
														html += '<li><b>'+fname+' '+lname+'</b></li>';
												}
												if(val.company_name!=undefined && val.company_name!=null && val.company_name!=''){
													html += '<li><b>'+val.company_name+'</b></li>';
													
													all_company_name.push(val.company_name);

												}
												var address = '';
												if(val.address1!=undefined && val.address1!=null && val.address1!=''){
													html += '<li class="add_z">'+val.address1;
													address += val.address1;
												}
												if(val.address2!=undefined && val.address2!=null && val.address2!=''){
													//html += '<li>'+val.address2+'</li>';
													html += ', '+val.address2;
													address +=' '+val.address2;
												}

												var zip = '';
												var city = '';
												if(val.zip!=undefined && val.zip!=null && val.zip!=''){
													zip = val.zip;
												}
												if(val.city!=undefined && val.city!=null && val.city!=''){
													city = val.city ;
												}
												if(zip!='' || city!=''){
													html += ', '+zip+' '+city+'</li>';
												}
												console.log('htmlhtmlhtml',html);
												if(address!='' || zip!='' || city!=''){
													all_address.push(address+'_'+zip+'_'+city);

													//all_address +='<p>'+address+', '+zip+' '+city+'</p><input type="checkbox" name="company_name[]" value="'+address+'_'+zip+'_'+city+'">';
												}

												var phone_nos = [];
												if(val.phone_number!=undefined && val.phone_number!=null && val.phone_number!=''){
													phone_nos.push(v.LookupsCache.cust_cellphone+': '+val.phone_number);
													all_phone_number.push(val.phone_number.replace(/ /g, ""));

												}
												if(val.alternate_number!=undefined && val.alternate_number!=null && val.alternate_number!=''){
													phone_nos.push(v.LookupsCache.cust_cellphone+': '+val.alternate_number);
													all_alternate_number.push(val.alternate_number.replace(/ /g, ""));

												}
												if(val.landline_number!=undefined && val.landline_number!=null && val.landline_number!=''){
													phone_nos.push(v.LookupsCache.customer_land_line+': '+val.landline_number);
													all_landline_number.push(val.landline_number.replace(/ /g, ""));

												}
												if(phone_nos.length != 0){
													var str = phone_nos.join(',&nbsp;');
													//phone_nos = phone_nos.slice(1, -1);
													html += '<li>'+str+'</li>';
												}
											html+= '</ul>';
											var value = JSON.stringify(val);
											var find = '"';
											var re = new RegExp(find, 'g');
											console.log('vvvvvv',v);
											value = value.replace(re, "&quot;");
											html+= '<ul class="unstyled span3">'; 
												html+='<li><a onclick="event.preventDefault(); showrows('+value+')" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;"><i class="fa fa-check"></i> '+v.LookupsCache.select_button+'</a></li>';
													
												if(val.is_duplicate!=undefined && val.is_duplicate!=null && val.is_duplicate!=''){
													
													var res = val;
													for(var j in res.is_duplicate){
														if(res.is_duplicate[j]!='' && res.is_duplicate[j]!=null && res.is_duplicate[j]!=undefined){
															var curl = $('#BASE_URL').val()+'customers/details/'+res.is_duplicate[j];
															//gotoh +='<li style="float:right"><a target="_blank" href="'+curl+'" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;">'+val.go_to_customer+'&nbsp;<i class="m-icon-swapright" style="margin-top:0;color:#000"></i></a></li>';
															gotoh += '<div class="span12 box">';
															gotoh += '<ul class="unstyled span9" style="margin: 0;">';
																if(res.is_duplicate[j].customer_name!=undefined && res.is_duplicate[j].customer_name!=null && res.is_duplicate[j].customer_name!=''){
																	gotoh += '<li><b>'+res.is_duplicate[j].customer_name+'</b></li>';
																}
																if(res.is_duplicate[j].customer_address1!=undefined && res.is_duplicate[j].customer_address1!=null && res.is_duplicate[j].customer_address1!=''){
																	gotoh += '<li>'+res.is_duplicate[j].customer_address1;
																}
																var zip = '';
																var city = '';
																if(res.is_duplicate[j].customer_zip!=undefined && res.is_duplicate[j].customer_zip!=null && res.is_duplicate[j].customer_zip!=''){
																	zip = res.is_duplicate[j].customer_zip;
																}
																if(res.is_duplicate[j].customer_city!=undefined && res.is_duplicate[j].customer_city!=null && res.is_duplicate[j].customer_city!=''){
																	city = res.is_duplicate[j].customer_city ;
																}
																if(zip!='' && city!=''){
																	gotoh += ', '+zip+' '+city+'</li>';
																}
																var phone_nos = '';

																if(res.is_duplicate[j].customer_cellphone!=undefined && res.is_duplicate[j].customer_cellphone!=null && res.is_duplicate[j].customer_cellphone!=''){
																	phone_nos += v.LookupsCache.cust_cellphone+': '+res.is_duplicate[j].customer_cellphone+'. ';
																}
																
																if(res.is_duplicate[j].customer_phone!=undefined && res.is_duplicate[j].customer_phone!=null && res.is_duplicate[j].customer_phone!=''){
																	phone_nos += v.LookupsCache.customer_land_line+': '+res.is_duplicate[j].customer_phone;
																}
																if(phone_nos!=''){
																	//phone_nos = phone_nos.slice(1, -1);
																	gotoh += '<li>'+phone_nos+'</li>';
																}
																var eins = '';

																if(res.is_duplicate[j].customer_ein!=undefined && res.is_duplicate[j].customer_ein!=null && res.is_duplicate[j].customer_ein!=''){
																	eins += v.LookupsCache.ein_label+': '+res.is_duplicate[j].customer_ein;
																}
																if(eins!=''){
																	gotoh += '<li>'+eins+'</li>';
																}
															gotoh+= '</ul>';
														
															gotoh+= '<ul class="unstyled span3">';


																	gotoh +='<li style="float:right"><a target="_blank" onclick="goToCustomer('+res.is_duplicate[j].id+');" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;"><i class="m-icon-swapright" style="margin-top:0;color:#000"></i>&nbsp;'+res.go_to_customer+'</a></li>';
															
																
															gotoh +='</ul>';
															gotoh +='</div>';
														}
														
													}
												}
												

											html+='</ul>';

										
										html += '</div>';
										
									});
								});

							}
						}
						else{
							var gotoh = '';
							var all_name = [];
							var all_postal_address = [];
							var all_postal_cellphone = [];
							var all_postal_phone = [];
							var all_ein = [];
							var data = complet_data.response.response.einData;

							if(data!='' && data!=undefined && data!=null){
								var res = data;
								var j = 1;
									
								if(res.name!=undefined && res.name!=null && res.name!=''){
									html += '<div class="span12 box">';
										//html += '<ul class="unstyled span2"><li>'+j+'</li></ul>';
										html += '<ul class="unstyled span9">';

											if(res.name!=undefined && res.name!=null && res.name!=''){
												html += '<li><b>'+res.name+'</b></li>';
												all_name.push(res.name);
											}
												var address = '';
											if(res.postal_address!=undefined && res.postal_address!=null && res.postal_address!=''){
												html += '<li>'+res.postal_address;
												address = res.postal_address
												
											}

											var zip = '';
											var city = '';
											if(res.postal_zip!=undefined && res.postal_zip!=null && res.postal_zip!=''){
												zip = res.postal_zip;
											}
											if(res.postal_city!=undefined && res.postal_city!=null && res.postal_city!=''){
												city = res.postal_city ;
											}
											if(zip!='' && city!=''){
												html += ', '+zip+' '+city+'</li>';
											}
											all_postal_address.push(address+'_'+zip+'_'+city);
											var phone_nos = '';
											if(res.postal_cellphone!=undefined && res.postal_cellphone!=null && res.postal_cellphone!=''){
												phone_nos += complet_data.response.response.cust_cellphone+': '+res.postal_cellphone+'. ';
												all_postal_cellphone.push(res.postal_cellphone.replace(/ /g, ""));
											}
											
											if(res.postal_phone!=undefined && res.postal_phone!=null && res.postal_phone!=''){
												phone_nos += complet_data.response.response.customer_land_line+': '+res.postal_phone;
												all_postal_phone.push(res.postal_phone.replace(/ /g, ""));
											}
											if(phone_nos!=''){
												//phone_nos = phone_nos.slice(1, -1);
												html += '<li>'+phone_nos+'</li>';
											}
											var eins = '';
											if(res.ein!=undefined && res.ein!=null && res.ein!=''){
												eins +=  res.ein_label+': '+res.ein;
												all_ein.push(res.ein);
											}
											if(eins!=''){
												html += '<li>'+eins+'</li>';
											}
										html+= '</ul>';
										var value = JSON.stringify(res);
										var find = '"';
										var re = new RegExp(find, 'g');

										value = value.replace(re, "&quot;");
										html+= '<ul class="unstyled span3">';
											html +='<li><a onclick="showrows('+value+')" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;"><i class="fa fa-check"></i> '+complet_data.response.response.select_button+'</a></li>';
											
										html+='</ul>';
									html += '</div>';
										//Duplicate record
										
										if(res.is_duplicate!=undefined && res.is_duplicate!=null && res.is_duplicate!=''){
											for(var j in res.is_duplicate){
												gotoh += '<div class="span12 box">';
												gotoh += '<ul class="unstyled span9" style="margin: 0;">';
													if(res.is_duplicate[j].customer_name!=undefined && res.is_duplicate[j].customer_name!=null && res.is_duplicate[j].customer_name!=''){
														gotoh += '<li><b>'+res.is_duplicate[j].customer_name+'</b></li>';
													}
													if(res.is_duplicate[j].customer_address1!=undefined && res.is_duplicate[j].customer_address1!=null && res.is_duplicate[j].customer_address1!=''){
														gotoh += '<li>'+res.is_duplicate[j].customer_address1;
													}
													var zip = '';
													var city = '';
													if(res.is_duplicate[j].customer_zip!=undefined && res.is_duplicate[j].customer_zip!=null && res.is_duplicate[j].customer_zip!=''){
														zip = res.is_duplicate[j].customer_zip;
													}
													if(res.is_duplicate[j].customer_city!=undefined && res.is_duplicate[j].customer_city!=null && res.is_duplicate[j].customer_city!=''){
														city = res.is_duplicate[j].customer_city ;
													}
													if(zip!='' && city!=''){
														gotoh += ', '+zip+' '+city+'</li>';
													}
													var phone_nos = '';

													if(res.is_duplicate[j].customer_cellphone!=undefined && res.is_duplicate[j].customer_cellphone!=null && res.is_duplicate[j].customer_cellphone!=''){
														phone_nos += res.cust_cellphone+': '+res.is_duplicate[j].customer_cellphone+'. ';
													}
													
													if(res.is_duplicate[j].customer_phone!=undefined && res.is_duplicate[j].customer_phone!=null && res.is_duplicate[j].customer_phone!=''){
														phone_nos += res.customer_land_line+': '+res.is_duplicate[j].customer_phone;
													}
													if(phone_nos!=''){
														//phone_nos = phone_nos.slice(1, -1);
														gotoh += '<li>'+phone_nos+'</li>';
													}
													var eins = '';

													if(res.is_duplicate[j].customer_ein!=undefined && res.is_duplicate[j].customer_ein!=null && res.is_duplicate[j].customer_ein!=''){
														eins +=  res.ein_label+': '+res.is_duplicate[j].customer_ein;
													}
													if(eins!=''){
														gotoh += '<li>'+eins+'</li>';
													}
												gotoh+= '</ul>';
											
												gotoh+= '<ul class="unstyled span3">';

													var curl = $('#BASE_URL').val()+'customers/details/'+res.is_duplicate[j];
														gotoh +='<li style="float:right"><a target="_blank" href="'+curl+'" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;"><i class="m-icon-swapright" style="margin-top:0;color:#000"></i>&nbsp;'+res.go_to_customer+'</a></li>';
												
													
												gotoh +='</ul>';
												gotoh +='</div>';
											}
										}
										//Duplicate record
									
								}else{
									document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
									$('#show_ein_details_data').html('');
									$('#show_ein_details_data_duplicate').html('');
									showAlertMessage(no_record_found,'error',alert_message);
									return;
								}
							}else{
								document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
								$('#show_ein_details_data').html('');
								$('#show_ein_details_data_duplicate').html('');
								showAlertMessage(no_record_found,'error',alert_message);
								return;
							}
						}
						if(i == 0){
							generateHTML(complet_data.response.response.customerData);
						}
						
						if(from_data == 'getPhoneNumber'){
						
							var all_name_html = '';
							if (typeof all_name[0] !== 'undefined') {
								var all_name = all_name.filter( onlyUnique );
								
								for(var j in all_name){
									var all_name_arr = all_name[j].split('_');
									console.log('all_name_arr',all_name_arr);
									if(j==0 && all_name.length==1){
										all_name_html += '<li><div><b>'+complet_data.response.response.ame+'</b></div><div>'+all_name_arr[0]+' '+all_name_arr[1]+'</div><div><input class="radio_name" onclick="adjust_radio(this,\'radio_name\');" checked="checked" type="checkbox" value="'+all_name[j]+'"></div></li>';
									}
									else if(j==0){
										all_name_html += '<li><div><b>'+complet_data.response.response.ame+'</b></div><div>'+all_name_arr[0]+' '+all_name_arr[1]+'</div><div><input class="radio_name" onclick="adjust_radio(this,\'radio_name\');" type="checkbox" value="'+all_name[j]+'"></div></li>';
									}
									else{
										all_name_html += '<li><div>&nbsp;</div><div>'+all_name_arr[0]+' '+all_name_arr[1]+'</div><div><input type="checkbox" value="'+all_name[j]+'" class="radio_name"  onclick="adjust_radio(this,\'radio_name\');" ></div></li>';
									}
								}
							}
							var all_company_name_html = '';
							if (typeof all_company_name[0] !== 'undefined') {
								var all_company_name = all_company_name.filter( onlyUnique );
								
								for(var j in all_company_name){
									if(j==0 && all_company_name.length==1){
										all_company_name_html += '<li><div><b>'+complet_data.response.response.rgnstnnm+'</b></div><div>'+all_company_name[j]+'</div><div><input class="radio_company_name" onclick="adjust_radio(this,\'radio_company_name\');" checked="checked" type="checkbox" value="'+all_company_name[j]+'"></div></li>';
									}
									else if(j==0){
										all_company_name_html += '<li><div><b>'+complet_data.response.response.rgnstnnm+'</b></div><div>'+all_company_name[j]+'</div><div><input class="radio_company_name" onclick="adjust_radio(this,\'radio_company_name\');" type="checkbox" value="'+all_company_name[j]+'"></div></li>';
									}
									else{
										all_company_name_html += '<li><div>&nbsp;</div><div>'+all_company_name[j]+'</div><div><input type="checkbox" value="'+all_company_name[j]+'" class="radio_company_name"  onclick="adjust_radio(this,\'radio_company_name\');" ></div></li>';
									}
								}
							}

							var all_address_html = '';
							if (typeof all_address[0] !== 'undefined') {
								var all_address = all_address.filter( onlyUnique );

								for(var j in all_address){
									var all_address_array = all_address[j].split('_');
									console.log('all_address_array',all_address_array);
									var all_address_string = '';
									if(all_address_array[0]!=undefined && all_address_array[0]!=null && all_address_array[0]!=''){
										all_address_string += all_address_array[0];
									}
									if(all_address_array[1]!=undefined && all_address_array[1]!=null && all_address_array[1]!=''){
										all_address_string += ', '+all_address_array[1];
									}
									if(all_address_array[2]!=undefined && all_address_array[2]!=null && all_address_array[2]!=''){
										all_address_string += ' '+all_address_array[2];
									}
									if(j==0 && all_address.length==1){
										
										all_address_html += '<li><div><b>'+complet_data.response.response.addrs+'</b></div><div>'+all_address_string+'</div><div><input type="checkbox" value="'+all_address[j]+'" class="radio_all_address" checked="checked" onclick="adjust_radio(this,\'radio_all_address\');" ></div></li>';
									}
									else if(j==0){
										all_address_html += '<li><div><b>'+complet_data.response.response.addrs+'</b></div><div>'+all_address_string+'</div><div><input type="checkbox" value="'+all_address[j]+'" class="radio_all_address"  onclick="adjust_radio(this,\'radio_all_address\');" ></div></li>';
									}
									else{
										all_address_html += '<li><div>&nbsp;</div><div>'+all_address_string+'</div><div><input type="checkbox" value="'+all_address[j]+'" class="radio_all_address"  onclick="adjust_radio(this,\'radio_all_address\');" ></div></li>';
									}
								}
							}

					
							var all_phone_alternate_number = all_phone_number.concat(all_alternate_number);
							var all_phone_alternate_number = all_phone_alternate_number.filter( onlyUnique );
							var all_phone_alternate_number_html = '';
							if (typeof all_phone_alternate_number[0] !== 'undefined') {
								for(var j in all_phone_alternate_number){
									if(j==0 && all_phone_alternate_number.length==1){
										all_phone_alternate_number_html +=  '<li><div><b>'+complet_data.response.response.cust_cellphone+'</b></div><div>'+all_phone_alternate_number[j]+'</div><div><input type="checkbox" checked="checked" value="'+all_phone_alternate_number[j]+'" class="radio_cust_cellphone"  onclick="adjust_radio(this,\'radio_cust_cellphone\');"></div></li>';
									}
									else if(j==0){
										all_phone_alternate_number_html +=  '<li><div><b>'+complet_data.response.response.cust_cellphone+'</b></div><div>'+all_phone_alternate_number[j]+'</div><div><input type="checkbox" value="'+all_phone_alternate_number[j]+'" class="radio_cust_cellphone"  onclick="adjust_radio(this,\'radio_cust_cellphone\');"></div></li>';
									}
									else{
										all_phone_alternate_number_html +=  '<li><div>&nbsp;</div><div>'+all_phone_alternate_number[j]+'</div><div><input type="checkbox" value="'+all_phone_alternate_number[j]+'" class="radio_cust_cellphone"  onclick="adjust_radio(this,\'radio_cust_cellphone\');"></div></li>';
									}
									
								}
							}
							var all_landline_number_html = '';
							var all_landline_number = all_landline_number.filter( onlyUnique );
							if (typeof all_landline_number[0] !== 'undefined') {
								for(var j in all_landline_number){
									if(j==0 && all_landline_number.length==1){
										all_landline_number_html += '<li><div><b>'+complet_data.response.response.customer_land_line+'</b></div><div>'+all_landline_number[j]+'</div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_cust_phone" checked="checked" onclick="adjust_radio(this,\'radio_cust_phone\');"></div></li>';
									}
									else if(j==0){
										all_landline_number_html += '<li><div><b>'+complet_data.response.response.customer_land_line+'</b></div><div>'+all_landline_number[j]+'</div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_cust_phone"  onclick="adjust_radio(this,\'radio_cust_phone\');"></div></li>';
									}
									else{
										all_landline_number_html += '<li><div>&nbsp;</div><div>'+all_landline_number[j]+'</div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_cust_phone"  onclick="adjust_radio(this,\'radio_cust_phone\');"></div></li>';
									}
									
								}
							}
							
							if(html==undefined || html==null || html==''){
								showAlertMessage(complet_data.response.response.ntfnd,'error',alert_message);
								html = '';
							}
							else{
								var htmls = '<li style="list-style-type:none"><button class="btn mini edit blue-stripe" onclick="switch_mode(1)">'+complet_data.response.response.vwgrpddt+'</button></li>';
								htmls += '<div class="span12 box">';
									htmls += '<ul class="unstyled span9 ungrouped">';
								htmls += all_name_html+all_company_name_html + all_address_html + all_landline_number_html + all_phone_alternate_number_html;

								htmls += '</ul>';
								htmls += '<ul class="span3 unstyled">';
									
									
									var datas = 'ungrouped_data';
									htmls += '<li><a onclick="event.preventDefault();showrows(0,12)" class="btn mini edit blue-stripe" style="float:right;margin-right:5%;"><i class="fa fa-check"></i> '+complet_data.response.response.select_button+'</a></li>';
								htmls += '</ul>';
								htmls += '</div>';

								$('#ungrouped_data').html(htmls);
								
								var html_html = '<li style="list-style-type:none"><button class="btn mini edit blue-stripe" onclick="switch_mode(2)">'+complet_data.response.response.vwngrpddt+'</button></li>'+html;
								$('#grouped_data').html(html_html);
								if(gotoh!=''){
									var duplicate_html = '<ul class="span12" style="margin:0;font-size:20px;text-align:center;list-style-type:none"><li >'+complet_data.response.response.pmainos+'</li></ul>'+gotoh;
									
									$('#show_ein_details_duplicate').html(duplicate_html);
								}
								$('#show_ein_details_data').html(htmls);
							}
						}
						else{
							if(html==undefined || html==null || html==''){
								showAlertMessage(complet_data.response.response.ntfnd,'error',alert_message);
								html = '';
							}
							else{

								var htmls = '';
							
								var all_name_html = '';
								if (typeof all_name[0] !== 'undefined') {
									var all_name = all_name.filter( onlyUnique );
									
									for(var j in all_name){
										if(j==0 && all_name.length==1){
											all_name_html += '<li><div>'+complet_data.response.response.cstmrnme+'</div><div><b>'+all_name[j]+'</b></div><div><input class="radio_all_name" onclick="adjust_radio(this,\'radio_all_name\');" checked="checked" type="checkbox" value="'+all_name[j]+'"></div></li>';
										}
										else if(j==0){
											all_name_html += '<li><div>'+complet_data.response.response.cstmrnme+'</div><div><b>'+all_name[j]+'</b></div><div><input class="radio_all_name" onclick="adjust_radio(this,\'radio_all_name\');" type="checkbox" value="'+all_name[j]+'"></div></li>';
										}
										else{
											all_name_html += '<li><div>&nbsp;</div><div><b>'+all_name[j]+'</b></div><div><input type="checkbox" value="'+all_name[j]+'" class="radio_all_name"  onclick="adjust_radio(this,\'radio_all_name\');" ></div></li>';
										}
									}
								}
								console.log(all_name_html);

								var all_postal_address_html = '';
								if (typeof all_postal_address[0] !== 'undefined') {
									var all_postal_address = all_postal_address.filter( onlyUnique );
									console.log('all_postal_address',all_postal_address);
									for(var j in all_postal_address){
										var all_postal_address_array = all_postal_address[j].split('_');
										var all_postal_address_string = '';
										if(all_postal_address_array[0]!=undefined && all_postal_address_array[0]!=null && all_postal_address_array[0]!=''){
											all_postal_address_string += all_postal_address_array[0];
										}
										if(all_postal_address_array[1]!=undefined && all_postal_address_array[1]!=null && all_postal_address_array[1]!=''){
											all_postal_address_string += ', '+all_postal_address_array[1];
										}
										if(all_postal_address_array[2]!=undefined && all_postal_address_array[2]!=null && all_postal_address[2]!=''){
											all_postal_address_string += ' '+all_postal_address_array[2];
										}
										if(j==0 && all_postal_address.length==1){
											all_postal_address_html += '<li><div>'+complet_data.response.response.addrs+'</div><div><b>'+all_postal_address_string+'</b></div><div><input type="checkbox" value="'+all_postal_address[j]+'" checked="checked" class="radio_all_postal_address"  onclick="adjust_radio(this,\'radio_all_postal_address\');" ></div></li>';
										}
										else if(j==0 ){
											all_postal_address_html += '<li><div>'+complet_data.response.response.addrs+'</div><div><b>'+all_postal_address_string+'</b></div><div><input type="checkbox" value="'+all_postal_address[j]+'" class="radio_all_postal_address"  onclick="adjust_radio(this,\'radio_all_postal_address\');" ></div></li>';
										}
										else{
											all_postal_address_html += '<li><div>&nbsp;</div><div><b>'+all_postal_address_string+'</b></div><div><input type="checkbox" value="'+all_postal_address[j]+'" class="radio_all_postal_address"  onclick="adjust_radio(this,\'radio_all_postal_address\');" ></div></li>';
										}
									}
								}

								var all_postal_phone_html = '';
								var all_postal_phone = all_postal_phone.filter( onlyUnique );
								if (typeof all_postal_phone[0] !== 'undefined') {
									for(var j in all_postal_phone){

										if(j==0 && all_postal_phone.length==1){
											all_postal_phone_html += '<li><div>'+complet_data.response.response.customer_land_line+'</div><div><b>'+all_postal_phone[j]+'</b></div><div><input type="checkbox" value="'+all_postal_phone[j]+'" checked="checked" class="radio_postal_phone"  onclick="adjust_radio(this,\'radio_postal_phone\');"></div></li>';
										}
										else if(j==0){
											all_postal_phone_html += '<li><div>'+complet_data.response.response.customer_land_line+'</div><div><b>'+all_postal_phone[j]+'</b></div><div><input type="checkbox" value="'+all_postal_phone[j]+'" class="radio_postal_phone"  onclick="adjust_radio(this,\'radio_postal_phone\');"></div></li>';
										}
										else{
											all_postal_phone_html += '<li><div>&nbsp;</div><div><b>'+complet_data.response.response.cust_cellphone+'</b></div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_postal_phone"  onclick="adjust_radio(this,\'radio_postal_phone\');"></div></li>';
										}
										
									}
								}

								var all_postal_cellphone_html = '';
								var all_postal_cellphone = all_postal_cellphone.filter( onlyUnique );
								if (typeof all_postal_cellphone[0] !== 'undefined') {
									for(var j in all_postal_cellphone){

										if(j==0 && all_postal_cellphone.length==1){
											all_postal_cellphone_html += '<li><div>'+complet_data.response.response.cust_cellphone+'</div><div><b>'+all_postal_cellphone[j]+'</b></div><div><input type="checkbox" checked="checked" value="'+all_postal_cellphone[j]+'" class="radio_postal_cellphone"  onclick="adjust_radio(this,\'radio_postal_cellphone\');"></div></li>';
										}
										else if(j==0){
											all_postal_cellphone_html += '<li><div>'+complet_data.response.response.cust_cellphone+'</div><div><b>'+all_postal_cellphone[j]+'</b></div><div><input type="checkbox" value="'+all_postal_cellphone[j]+'" class="radio_postal_cellphone"  onclick="adjust_radio(this,\'radio_postal_cellphone\');"></div></li>';
										}
										else{
											all_postal_cellphone_html += '<li><div>&nbsp;</div><div><b>'+complet_data.response.response.cust_cellphone+'</b></div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_postal_cellphone"  onclick="adjust_radio(this,\'radio_postal_cellphone\');"></div></li>';
										}
										
									}
								}

								var all_ein_html = '';
								var all_ein = all_ein.filter( onlyUnique );
								if (typeof all_ein[0] !== 'undefined') {
									for(var j in all_ein){
										if(j==0 && all_ein.length==1){
											all_ein_html += '<li><div>'+complet_data.response.response.eins_labels+'</div><div><b>'+all_ein[j]+'</b></div><div><input type="checkbox" value="'+all_ein[j]+'" class="radio_ein" checked="checked"  onclick="adjust_radio(this,\'adjust_radio\');"></div></li>';
										}
										else if(j==0){
											all_ein_html += '<li><div>'+complet_data.response.response.eins_labels+'</div><div><b>'+all_ein[j]+'</b></div><div><input type="checkbox" value="'+all_ein[j]+'" class="radio_ein"  onclick="adjust_radio(this,\'adjust_radio\');"></div></li>';
										}
										else{
											all_ein_html += '<li><div>&nbsp;</div><div><b>'+all_postal_cellphone[j]+'</b></div><div><input type="checkbox" value="'+all_landline_number[j]+'" class="radio_ein"  onclick="adjust_radio(this,\'radio_ein\');"></div></li>';
										}
										
									}
								}
							

							var htmls = '<li style="list-style-type:none"><button class="btn mini edit blue-stripe" onclick="switch_mode(1)">'+complet_data.response.response.vwgrpddt+'</button></li>';
								htmls += '<div class="span12 box">';
									htmls += '<ul class="unstyled span9 ungrouped">';
								htmls += all_name_html + all_postal_address_html + all_postal_phone_html + all_postal_cellphone_html+all_ein_html;

								htmls += '</ul>';
								htmls += '<ul class="span3 unstyled">';
									
									console.log('complet_datac',complet_data);
									var datas = 'ungrouped_data';
									htmls += '<li><a onclick="event.preventDefault();showrows(0,11)" class="btn mini edit xx blue-stripe" style="float:right;margin-right:5%;"><i class="fa fa-check"></i> '+complet_data.response.response.select_button+'</a></li>';
								htmls += '</ul>';
								htmls += '</div>';


								$('#ungrouped_data').html(htmls);
								var html_html = '<li style="list-style-type:none"><button class="btn mini edit blue-stripe" onclick="switch_mode(2)">'+complet_data.response.response.vwngrpddt+'</button></li>'+html;
								$('#grouped_data').html(html_html);
								if(gotoh!=''){
									var duplicate_html = '<ul class="span12" style="margin:0;font-size:20px;text-align:center;list-style-type:none"><li >'+complet_data.response.response.pmainos+'</li></ul>'+gotoh;
									
									$('#show_ein_details_duplicate').html(duplicate_html);
								}
								$('#show_ein_details_data').html(htmls);
							}
						}
						


						$('input[type=checkbox]').uniform();
						if(k==1){

							$('#customer_company_name0').attr('checked','checked').trigger('change');
							$('#customer_address1_address2_zip_city0').attr('checked','checked').trigger('change');
							$('#customer_phone_number0').attr('checked','checked').trigger('change');
							$('#customer_alternate_number0').attr('checked','checked').trigger('change');
							$('#customer_landline_number0').attr('checked','checked').trigger('change');
							
						}
						
						$('#EINEin').val(total_params.phone_no).focus();
						//$('#popups').resize();
						i++;
					}
					else if(complet_data.response.status == 'error'){
						document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
						if(complet_data.response.response.error == 'validationErrors'){
							var mt_arr = complet_data.response.response.list;
							var array = $.map(mt_arr, function(value, index) {
								return value+'<br />';
							});
							showAlertMessage(array,'error',alert_message);
							return;
						}else{
							showAlertMessage(complet_data.response.response.msg,'error',alert_message);
							return;
						}	
					}
				}else{
					document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
					showAlertMessage(no_record_found,'error',alert_message);
					return;
				}
			},
			error: function(xhr, status, error){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
		    	if(xhr.status && xhr.status == 400){
		    		var obj = jQuery.parseJSON(xhr.responseText);
		    		showAlertMessage(obj.message,'error');
	         }
		     	else{
		    	   showAlertMessage("There was a problem accessing the server: " +xhr.statusText+"\n"+"*Please refresh the page and try again",'error');
		    	   return;
		      }
		   }
	});
}

function switch_mode(from){
	if(from==1){
		$('#show_ein_details_data').html($('#grouped_data').html());
	}
	else if(from==2){
		$('#show_ein_details_data').html($('#ungrouped_data').html());
	}
	$('input[type=checkbox]').uniform();

}
function adjust_radio(that,id){
	$('input[class='+id+']').each(function(){
		if(this!=that){
			$(this).prop('checked',false);
			$.uniform.update();
		}	
	});
}


function getCustomFieldsListForSignUp(val){
	document.getElementById('hiddenNewCustomerImg').style.visibility = 'unset';
	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var lang = $('#lang').val();
	var partner_id = $('#partner_id').val();
	var alert_message = $('#alert_message').val();

	var total_params = {
		token:token,
		language:language,
		lang:lang,
		partner_id:partner_id,
		from:'newaddcustomer',
	};

	$.ajax({
		type: 'POST',
		url: APISERVER+'/api/customers/getCustomFieldsListForSignUp',
		data: total_params,
		async: true,
		dataType : "json",
		success: function(complet_data,status,xhr){
			if(complet_data.response.status == 'success'){
				generateHTML(complet_data.response.response, val);
			}
			else if(complet_data.response.status == 'error'){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',alert_message);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',alert_message);
					return;
				}	
			}
		},
		error: function(xhr, status, error){
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
var all_data;
function generateHTML(complete_data, val){
	all_data = complete_data;
	document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
	var getAllPriceGroups 					 = complete_data.getAllPriceGroups;
	var getActiveCustomerGroups 			 = complete_data.getActiveCustomerGroups;
	var getDefaultPriceGroup 				 = complete_data.getDefaultPriceGroup;
	var getPartnerSubscribedPlanModules 	 = complete_data.getPartnerSubscribedPlanModules;
	var getPartnerCustomSettings 			 = complete_data.getPartnerCustomSettings;
	var getAllCountryList 					 = complete_data.getAllCountryList;
	var getCountryWithPhoneCodeList	 		 = complete_data.getCountryWithPhoneCodeList;
	var getUserGroupListForRegistration	 	 = complete_data.getUserGroupListForRegistration;
	var getDocumentMethodsWithDefault		 = complete_data.getDocumentMethodsWithDefault	;
	var getTranlationData		 			 = complete_data.getTranlationData;
	var invoiceContactDetails		 		 = complete_data.invoiceContactDetails;
	var newsletterUpdates		 			 = complete_data.newsletterUpdates;
	var show_mass_communication		 	 	 = complete_data.show_mass_communication;
	var allCustomFields					 	 = complete_data.allCustomFields;
	var customer_task_name					 = complete_data.customer_task_name;
	var default_fields						 = complete_data.getPartnerCustomSettings.PartnerSetting.mandatory_fields;
	default_fields = JSON.parse(default_fields);


	var customerTypes = [];
	var getCountryListData = [];
	var getCountryPhoneCodeList = [];
	var getDefaultMethods = [];
	var allPriceGroups = [];
	var allCustomerGroups = [];
	var invContactDetails = [];
	var newsLetterUpdates = [];
	
	var customer_email_required = '';
	var ein_required = '';
	var enable_mass_communication_emails = '';
	var enable_mass_communication_sms = '';
	var fetch_customer_information = '';
	var default_mass_value = 0;
	var showCustomFields = [];
	
	$.each( getUserGroupListForRegistration, function( key, value ) {
		customerTypes.push({id:key,name:value});
	});
	$.each( getAllCountryList, function( key, value ) {
		if(key == 'NO'){
			var is_default = '1';
		}else{
			var is_default = '0';
		}
		getCountryListData.push({id:key,name:value,default_country:is_default});
	});
	$.each( getCountryWithPhoneCodeList, function( key, value ) {
		var explode_v = value.split('###');
		var phone_val = explode_v[0].split('(');
		var phone_orig_val = phone_val[1].split(')');
		if(key == 'NO'){
			var is_default = '1';
		}else{
			var is_default = '0';
		}
		getCountryPhoneCodeList.push({id:key,name:explode_v[0],default_country:is_default});
	});

	
	$.each( getDocumentMethodsWithDefault, function( key, value ) {
		if(value.status == 1){
			getDefaultMethods.push({
				id:value.value,
				name:value.internal_name,
				is_default:value.default
			});
		}
	});

	$.each( getAllPriceGroups, function( key, value ) {
		allPriceGroups.push({id:key,name:value});
	});

	$.each( getActiveCustomerGroups, function( key, value ) {
		$.each( value, function( k, v ) {
			allCustomerGroups.push({id:v.PartnerCustomerGroup.id,name:v.PartnerCustomerGroup.group_name,default_price_group:v.PartnerCustomerGroup.price_group_id});
		});
	});

	$.each( invoiceContactDetails, function( key, value ) {
		invContactDetails.push({id:key,name:value});
	});

	$.each( newsletterUpdates, function( key, value ) {
		newsLetterUpdates.push({id:key,name:value});
	});
	
	$.each( getPartnerCustomSettings, function( key, value ) {
		customer_email_required = value.customer_email_required;
		ein_required = value.ein_required;
		enable_mass_communication_emails = value.enable_mass_communication_emails;
		enable_mass_communication_sms = value.enable_mass_communication_sms;
		fetch_customer_information = value.fetch_customer_information;
		if(enable_mass_communication_emails == 1 && enable_mass_communication_sms == 1){
			default_mass_value = 3;
		}
		else if(enable_mass_communication_sms == 1){
			default_mass_value = 2;
		} 
		else if(enable_mass_communication_emails == 1){
			default_mass_value = 1;
		}
	});
	
	$.each( allCustomFields, function( key, value ) {
		if(value.CustomerCustomField.customer_registration_form == 'n'){
			customer_registration_form = '';
		}else{
			customer_registration_form = 'y';
		}
		showCustomFields.push({custom_field_name : value.CustomerCustomField.custom_field, custom_field_value : value.CustomerCustomField.custom_value, show_on_registration : customer_registration_form, custom_field_type : value.CustomerCustomField.type, mandatory : value.CustomerCustomField.mandatory});
	});
	var tvShow = {"show_html_data" : "1", "customer_types":customerTypes,"countryLists":getCountryListData,"countryListWithPhone": getCountryPhoneCodeList,'defaultMethods' : getDefaultMethods,'allPriceGroups' : allPriceGroups, 'allCustomerGroups' : allCustomerGroups,'getTranlationData' : getTranlationData, 'show_mass_communication' : show_mass_communication, 'invContactDetails': invContactDetails, 'newsLetterUpdates' : newsLetterUpdates, "default_mass_value" : default_mass_value, "customer_email_required" : customer_email_required, "fetch_customer_information" : fetch_customer_information, "ein_required" : ein_required,'host_url' : $('#HOST_URL').val(),'showCustomFields' : showCustomFields, 'customer_task_name' : customer_task_name,'default_fields':default_fields};
	enable('',tvShow, val);
}


function bind_manual(){
	if($('#add_new_task_submit').length!=0){
		$('#add_new_task_submit').click(function(){
			$('input[type=text]').removeAttr('readonly');
				$('input[type=text]').val('');
			if(i == 0){
				var show = 'show';

				getCustomFieldsListForSignUp(show);
				i++;
			}	
		});
	}
	else{
		setTimeout(function(){ bind_manual(); },1);
	}
}
function enable(popupid='',tvShows, val = null){
	if(popupid != ''){
		cust_popid = popupid;
	}
	Template7.registerHelper('formatDate', function (date) {
        var months = ('January February March April May June July August September October November December').split(' ');
        var _date = new Date(date);
        var month = months[_date.getMonth()];
        var day = _date.getDate();
        var year = _date.getFullYear();
        var h = _date.getHours();
        h = h < 10 ? '0' + h : h;
        var m = _date.getMinutes();
        m = m < 10 ? '0' + m : m;
        return month + ' ' + day + ', ' + year + ' ' + h + ':' + m;
    });
    
    Template7.registerHelper('businessCustomFields', function (custom_name ,custom_value ,type, mandatory){
		  var ret = '';
		  if(type == 'text'){
			  if(mandatory == 'y'){
			     ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			   }else{
				 ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			   }
			  ret += '<div class="controls controls-customer">';
			  ret += '<input name="data[Customer]['+type+']['+custom_name+']" class="m-wrap span12" value="'+custom_value+'" data-attr="text" data-name="'+custom_name+'" id="CustomerTextarea" type="'+type+'">';
			  ret += '<input name="data[Customer][is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="text_mandatory" id="CustomerMandatory" type="hidden">';
			  ret += '</div></div>';	
		  }else if(type == 'textarea'){
			   if(mandatory == 'y'){
			     ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			   }else{
				 ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			   }
			   ret += '<div class="controls controls-customer">';
			   ret += '<textarea name="data[Customer]['+type+']['+custom_name+']" class="m-wrap span12" rows="2" data-attr="textarea" data-name="'+custom_name+'" cols="30" id="CustomerTextarea">'+custom_value+'</textarea>';
			   ret += '<input name="data[Customer][is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="textarea_mandatory" id="CustomerMandatory" type="hidden">';
			   ret += '</div></div>';
		  }else if(type == 'dropdown'){
				if(mandatory == 'y'){
			     ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			   }else{
				 ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			   }
				ret += '<div class="controls controls-customer">';
				ret += '<select name="data[Customer]['+type+']['+custom_name+']" class="m-wrap span12 selectnosearch" data-attr="dropdown" data-name="'+custom_name+'" id="'+type+'_'+custom_name+'" tabindex="-1">';
				ret += '<option value=""></option>';
				var customValue = JSON.parse(custom_value);
				$.each( customValue, function( key, value ) {
					if(value.is_default == '1'){
						ret += '<option value="'+value.value+'" selected="selected">'+value.value+'</option>';
					}else{
						ret += '<option value="'+value.value+'">'+value.value+'</option>';
					}
				});
				ret += '</select><input name="data[Customer][is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="dropdown_mandatory" id="CustomerMandatory" type="hidden">';
				ret += '</div></div>';
		  }else if(type == 'checkbox'){
				if(mandatory == 'y'){
			     ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			   }else{
				 ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			   }
				ret += '<div class="controls controls-customer checkadjust">';
				ret += '<input name="data[Customer]['+type+']['+custom_name+']" class="m-wrap span10" value="" data-attr="checkbox" data-name="'+custom_name+'" id="CustomerCheckbox" type="'+type+'">';
				ret += '<input name="data[Customer][is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="checkbox_mandatory" id="CustomerMandatory" type="hidden">';		
				ret += '</div></div>';
		  }else if(type == 'radio'){
				if(mandatory == 'y'){
			     ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			   }else{
				 ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			   }
				ret += '<div class="controls controls-customer '+type+'adj">';
				var customValue = JSON.parse(custom_value);
				$.each( customValue, function( key, value ) {
					if(value.is_default == '1'){
						ret += '<input name="data[Customer]['+type+']['+custom_name+']" id="CustomerRadio'+value.value+'" data-attr="radio" data-name="'+custom_name+'" class="m-wrap span1" value="'+value.value+'" type="'+type+'" checked="checked">';
					}else{
						ret += '<input name="data[Customer]['+type+']['+custom_name+']" id="CustomerRadio'+value.value+'" data-attr="radio" data-name="'+custom_name+'" class="m-wrap span1" value="'+value.value+'" type="'+type+'">';
					}
					ret += '<label for="CustomerRadio'+value.value+'">'+value.value+'</label>';
				});
				ret += '<input name="data[Customer][is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="radio_mandatory" id="CustomerMandatory" type="hidden">';		
				ret += '</div></div>';
		  }	
		  return ret;
	});
	
	Template7.registerHelper('consumerCustomFields', function (custom_name ,custom_value ,type, mandatory){
		  var ret = '';
		  if(type == 'text'){
			  
			  if(mandatory == 'y'){
			    ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			  }else{
				ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			  }
			  ret += '<div class="controls controls-customer">';
			  ret += '<input name="data[Customer][consumer_'+type+']['+custom_name+']" class="m-wrap span12" value="'+custom_value+'" data-attr="consumer_text" data-name="'+custom_name+'" id="CustomerTextarea" type="'+type+'">';
			  ret += '<input name="data[Customer][consumer_is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="consumer_text_mandatory" id="CustomerMandatory" type="hidden">';
			  ret += '</div></div>';	
		  }else if(type == 'textarea'){
			   if(mandatory == 'y'){
			     ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			   }else{
				 ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			   }
			   ret += '<div class="controls controls-customer">';
			   ret += '<textarea name="data[Customer][consumer_'+type+']['+custom_name+']" class="m-wrap span12" rows="2"  cols="30" data-attr="consumer_textarea" data-name="'+custom_name+'" id="CustomerTextarea">'+custom_value+'</textarea>';
			   ret += '<input name="data[Customer][consumer_is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="consumer_textarea_mandatory" id="CustomerMandatory" type="hidden">';
			   ret += '</div></div>';
		  }else if(type == 'dropdown'){
			   if(mandatory == 'y'){
			     ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			   }else{
				 ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			   }
				ret += '<div class="controls controls-customer">';
				ret += '<select name="data[Customer][consumer_'+type+']['+custom_name+']" class="m-wrap span12 selectnosearch" data-attr="consumer_dropdown" data-name="'+custom_name+'" id="'+type+'_'+custom_name+'" tabindex="-1">';
				ret += '<option value=""></option>';
				var customValue = JSON.parse(custom_value);
				$.each( customValue, function( key, value ) {
					if(value.is_default == '1'){
						ret += '<option value="'+value.value+'" selected="selected">'+value.value+'</option>';
					}else{
						ret += '<option value="'+value.value+'">'+value.value+'</option>';
					}
				});
				ret += '</select><input name="data[Customer][consumer_is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="consumer_dropdown_mandatory" id="CustomerMandatory" type="hidden">';
				ret += '</div></div>';
		  }else if(type == 'checkbox'){
				if(mandatory == 'y'){
			     ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			   }else{
				 ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			   }
				ret += '<div class="controls controls-customer checkadjust">';
				ret += '<input name="data[Customer][consumer_'+type+']['+custom_name+']" class="m-wrap span10" data-attr="consumer_checkbox" data-name="'+custom_name+'" value="" id="CustomerCheckbox" type="'+type+'">';
				ret += '<input name="data[Customer][consumer_is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="consumer_checkbox_mandatory" id="CustomerMandatory" type="hidden">';		
				ret += '</div></div>';
		  }else if(type == 'radio'){
				if(mandatory == 'y'){
			     ret += '<div class="control-group"><label class="control-label label-customer"><span class="required">*</span>'+custom_name+'</label>'; 
			   }else{
				 ret += '<div class="control-group"><label class="control-label label-customer">'+custom_name+'</label>';
			   }
				ret += '<div class="controls controls-customer '+type+'adj">';
				var customValue = JSON.parse(custom_value);
				$.each( customValue, function( key, value ) {
					if(value.is_default == '1'){
						ret += '<input name="data[Customer][consumer_'+type+']['+custom_name+']" id="CustomerRadio'+value.value+'" data-attr="consumer_radio" data-name="'+custom_name+'" class="m-wrap span1" value="'+value.value+'" type="'+type+'" checked="checked">';
					}else{
						ret += '<input name="data[Customer][consumer_'+type+']['+custom_name+']" id="CustomerRadio'+value.value+'" data-attr="consumer_radio" data-name="'+custom_name+'" class="m-wrap span1" value="'+value.value+'" type="'+type+'">';
					}
					ret += '<label for="CustomerRadio'+value.value+'">'+value.value+'</label>';
				});
				ret += '<input name="data[Customer][consumer_is_mandatory]['+type+']['+custom_name+']" value="'+mandatory+'" data-attr="consumer_radio_mandatory" id="CustomerMandatory" type="hidden">';		
				ret += '</div></div>';
		  }	
		  return ret;
	});
 
	if(tvShows == undefined){
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
		};
		
		$.ajax({
			type: 'POST',
			url: APISERVER+'/api/search/getFormFields',
			data: total_params,
			async: true,
			dataType : "json",
			success: function(complet_data,status,xhr){
				if(complet_data.response.status == 'success'){
					var ein_or_phone_number = complet_data.response.response.ein_or_phone_number; 
					var manual_registration = complet_data.response.response.manual_registration; 
					var	add_new_customer = complet_data.response.response.add_new_customer; 
					var	close_button  = complet_data.response.response.close_button; 
					var	proceed_button = complet_data.response.response.proceed_button; 	 
					var	select_button  = complet_data.response.response.select_button; 	  
					var	back_button    = complet_data.response.response.back_button;
					var alert_message  = complet_data.response.response.alert_message;
					var ein_error  = complet_data.response.response.ein_error;
					var save_and_create_new_task  = complet_data.response.response.save_and_create_new_task;
					var save_and_create_new_sales_document  = complet_data.response.response.save_and_create_new_sales_document;
					var customer_task_name  = complet_data.response.response.customer_task_name;
					var no_record_found  = complet_data.response.response.no_record_found;
					var save_button  = complet_data.response.response.save_button;
					var tvShow = {"ein_or_phone_number" : ein_or_phone_number, "manual_registration" : manual_registration, "add_new_customer" : add_new_customer, "close_button" : close_button, "proceed_button" : proceed_button, "select_button" : select_button, "back_button" : back_button, "host_url" : $('#HOST_URL').val(), alert_message : alert_message, ein_error : ein_error, save_and_create_new_task : save_and_create_new_task, save_and_create_new_sales_document : save_and_create_new_sales_document, customer_task_name : customer_task_name, no_record_found : no_record_found,save_button : save_button};
					document.getElementById(cust_popid).innerHTML = ''; 	
					var template = document.getElementById('add_new_customer_template').innerHTML;


					// Compile and render
					var compileStartTime = new Date().getTime();
					//var compiled = Template7(template).compile();
					var compileEndTime = new Date().getTime();
					//var compiledRendered = compiled(tvShow);
					var compiledRendered = Template7(template, tvShow);
					var compiledRenderedTime = new Date().getTime();

					// Insert rendered template
					document.getElementById(cust_popid).innerHTML = compiledRendered;
					
					$('#EINEin').keypress(function( event ) {
						if (event.which == 13 ) {
							getEinPhone();
						}
					});
					//$('#popups').resize();
					$('#popups').data().modal.options.width = "1000px";
					$('#popups').resize();
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
						showAlertMessage(complet_data.response.response.msg,'error','Alert message');
						return;
					}	
				}
			},
			error: function(xhr, status, error){
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
	if(tvShows!=undefined && tvShows!=null && tvShows!=''){
		tvShow = tvShows;

		 document.getElementById(cust_popid).innerHTML = ''; 	
	     var template = document.getElementById('add_new_customer_template').innerHTML;


	    // Compile and render
	    var compileStartTime = new Date().getTime();
	    //var compiled = Template7(template).compile();
	    var compileEndTime = new Date().getTime();
	    //var compiledRendered = compiled(tvShow);
	    var compiledRendered = Template7(template, tvShow);
	    var compiledRenderedTime = new Date().getTime();

	    // Insert rendered template
	    document.getElementById(cust_popid).innerHTML = compiledRendered;

		$('#add_new_customer_template').remove();
		//$('#popups').resize();
	}
    
    if(tvShows!=undefined && tvShows!=null && tvShows!='' && tvShows != {}){
		showAllData(tvShows.default_mass_value, tvShows.show_mass_communication);
		//$('#popups').resize();
		if(val!=undefined && val!=null && val!=''){
			$('#add_new_task_submit').click();
		}
		//localStorage.setItem('tvShows',tvShows);
	}
	

	bind_manual();

	
	$('#EINEin').keypress(function( event ) {
		if (event.which == 13 ) {
			getEinPhone();
		}
	});
}

function showAllData(default_mass_value =null, show_mass_communication = null){
	$("#CustomerConsumerDateOfBirth").inputmask("99.99.99", {autoUnmask: false});
	$('#add_new_task_submit').click(function(){
		$('#show_ein_information').hide();
		$('#back_submit').show();
		$('#proceed_to_customer').show();
		$('#proceed_to_sales_documnet').show();
		$('#proceed_to_save_task').show();
		//$('#show_ein_details_data').html('');
		//$('#show_ein_details_duplicate').html('');
		$('#show_customer_details').show();
		$('#add_new_task_submit').hide();
		//$('#popups').addClass('large_customer');
		//$('#popups').resize();
		try{
			var prop =  w = 1000;
			$('#popups').css('width', w);
			$('#popups').css('margin-left', function () {
				return -($(this).width() / 2) + 'px';
			});	
			$('#popups').find('.modal-body').css('overflow', '').css(prop, '');
			var modalOverflow = $(window).height() - 10 < $('#popups').height();
		    $('#popups').css('margin-top', 0 - $('#popups').height() / 2).removeClass('modal-overflow');
		     $('#popups').data().modal.options.width = "700px";
			$('#popups').resize();

		}catch(e){}
	});
	
	$('#back_submit').click(function(){
		$('#show_ein_information').show();
		$('#show_customer_details').hide();
		$('#back_submit').hide();
		$('#proceed_to_customer').hide();
		$('#proceed_to_sales_documnet').hide();
		$('#proceed_to_save_task').hide();
		$('#add_new_task_submit').show();
		//$('#popups').removeClass('large_customer');
		//$('#popups').resize();
		try{
			var prop =  w = 700;
			$('#popups').css('width', w);
			$('#popups').css('margin-left', function () {
				return -($(this).width() / 2) + 'px';
			});	
			$('#popups').find('.modal-body').css('overflow', '').css(prop, '');
			var modalOverflow = $(window).height() - 10 < $('#popups').height();
		    $('#popups').css('margin-top', 0 - $('#popups').height() / 2).removeClass('modal-overflow');
		     $('#popups').data().modal.options.width = "700px";
			$('#popups').resize();
		}
		catch(e){}
	});
	$('#CustomerUserGroupId').select2();
    $('input[type=checkbox]').uniform();
	$('input[type=radio]').uniform();
	
	validateMobile('CustomerPhone',20);
	validateMobile('CustomerCellphone',20);
	
	$('.selectnosearch').select2();
	
	$('#CustomerSamePostalAddress').click(function(){
		if($(this).is(':checked')){
			$(this).val('y');
			$('.same_postal_address').show();	
		}else{
			$(this).val('n');
			$('.same_postal_address').hide();	
		}	
	});
	
	$('#CustomerConsumerSamePostalAddress').click(function(){
		if($(this).is(':checked')){
			$(this).val('y');
			$('.consumer_same_postal_address').show();	
		}else{
			$(this).val('n');
			$('.consumer_same_postal_address').hide();	
		}	
	});
	
	$('#CustomerUserGroupId').change(function(){
		group_id = $(this).val();
		group_arr = group_id.split("##");
		
		$("#CustomerHomeCountry").change(); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
		if(group_arr[1] == '1')
		{
			//$("#CustomerCountry").change(); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
			$('#CustomerBusinessDefaultDistribution').change();
			$('#CustomerCustomerGroupId').change();
			$("#business_title").css('display', '');
			$("#consumer_title").css('display', 'none');
			$("#show_business").css('display', '');
			$("#show_consumer").css('display', 'none');
			$("#business_type").css('display', '');
			$("#business_type_one").css('display', ''); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
			$("#consumer_type").css('display', 'none');
			$("#consumer_type_one").css('display', 'none'); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
			$("#consumer_type_two").css('display', 'none'); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
			
			$("#CstomerRegisterForm").addClass("register-form");
			$("#CustomerRegisterForm").removeClass("consumer-form");
			$('#div_CustomerConsumerReceiveMassEmails').hide();	
			$('#div_CustomerConsumerReceiveMassSms').hide();
			
			//#024 16-06-2016 #35091, More addressing issues, customer card
				$('#CustomerPhCode').select2();
				$('#CustomerCcCode').select2();
			//#024 16-06-2016 #35091, More addressing issues, customer card
			$('#CustomerHomeCountry').select2();
			$('#CustomerCustomerGroupId').select2();
			$('#CustomerPriceGroup').select2();
			$('#CustomerCountry').select2();
			$('#CustomerDeliveryCountry').select2();
			$('#CustomerBusinessDefaultDistribution').select2({
				allowClear:true,
				placeholder:'select'
			});
			$('#CustomerBusinessDefaultContact').select2();
			$('#CustomerReceiveMassSmsEmails').select2();
			if(show_mass_communication == '1'){
				$('#CustomerReceiveMassSmsEmails').val(default_mass_value);
				$('#CustomerReceiveMassSmsEmails').select2('val',default_mass_value);
			}

			$('#CustomerFirstName').focus();	

		}
		else
		{
			$("#CustomerConsumerCountry").change();
			$('#CustomerConsumerDefaultDistribution').change();	
			$('#CustomerConsumerCustomerGroupId').change();	
			$("#consumer_title").css('display', '');
			$("#business_title").css('display', 'none');
			$("#show_consumer").css('display', '');
			$("#show_business").css('display', 'none');
			$("#consumer_type").css('display', '');
			$("#consumer_type_one").css('display', ''); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
			$("#consumer_type_two").css('display', ''); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
			$("#business_type").css('display', 'none');
			$("#business_type_one").css('display', 'none'); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
			$("#CustomerRegisterForm").addClass("consumer-form");
			$("#CustomerRegisterForm").removeClass("register-form");	
			$('#div_CustomerConsumerReceiveMassEmails').show();	
			$('#div_CustomerConsumerReceiveMassSms').show();
			
			//#024 16-06-2016 #35091, More addressing issues, customer card
				$('#CustomerConsumerPhCode').select2();
				$('#CustomerConsumerCcCode').select2();
			//#024 16-06-2016 #35091, More addressing issues, customer card
			$('#CustomerHomeCountry').select2();
			$('#CustomerConsumerCustomerGroupId').select2();
			$('#CustomerConsumerPriceGroup').select2();
			$('#CustomerCountry').select2();
			$('#CustomerDeliveryCountry').select2();
			$('#CustomerConsumerDefaultDistribution').select2({
				allowClear:true,
				placeholder:'select'
			});
			$('#CustomerDefaultContact').select2();
			$('#CustomerConsumerReceiveMassSmsEmails').select2();
			if(show_mass_communication == '1'){
				$('#CustomerConsumerReceiveMassSmsEmails').val(default_mass_value);
				$('#CustomerConsumerReceiveMassSmsEmails').select2('val',default_mass_value);
			}
			$('#CustomerConsumerFirstName').focus();		
		}
	
	});
	$('#CustomerUserGroupId').change();
	
	$('#CustomerBusinessDefaultDistribution').change(function(){
		var value =$(this).val();
		// var distribution = value.split('##');
		// if(distribution[1] == 'email' || distribution[1] == 'both'){
		// 	$('#business_distribution_contact').show();
		// 	$('#CustomerBusinessDefaultContact').change(function(){
		// 		var contact = $(this).val();
		// 		if(contact == 'custom_invoice_contact'){
		// 			$('#business_distribution_email').show();
		// 			$('.emailReq').hide();		
		// 		}else{
		// 			$('#business_distribution_email').hide();
		// 			$('.emailReq').show();
								
		// 		}	
		// 	});
		// 	$('#CustomerBusinessDefaultContact').change();	
		// }else{
		// 	$('#business_distribution_contact').hide();
		// 	$('#business_distribution_email').hide();
		// 	$('.emailReq').hide();				
		// }
	});
	$('#CustomerBusinessDefaultDistribution').change();	
	
	$('#CustomerConsumerDefaultDistribution').change(function(){
		var value = $(this).val();
		// var distribution = value.split('##');
		// if(distribution[1] == 'email' || distribution[1] == 'both'){
		// 	$('#consumer_distribution_contact').show();
		// 	$('#CustomerDefaultContact').change(function(){
		// 		var contact = $(this).val();
		// 		if(contact == 'custom_invoice_contact'){
		// 			$('#consumer_distribution_email').show();
		// 			$('.emailReq').hide();		
		// 		}else{
		// 			$('#consumer_distribution_email').hide();
		// 			$('.emailReq').show();
								
		// 		}	
		// 	});
		// 	$('#CustomerDefaultContact').change();	
		// }else{
		// 	$('#consumer_distribution_contact').hide();
		// 	$('#consumer_distribution_email').hide();
		// 	$('.emailReq').hide();				
		// }
	});
	
	$('#CustomerConsumerDefaultDistribution').change();
	
	$('#CustomerCustomerGroupId').change();
	$('#CustomerConsumerCustomerGroupId').change();
	
	$('#CustomerHomeCountry').change(function(){ //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
		var country = $(this).val();
		group_id = $('#CustomerUserGroupId').val(); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
		group_arr = group_id.split("##"); //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
		if(country == 'NO'){
	
			$('#CustomerEin').val('');
			$('#CustomerNormalEIN').val('');
			if(group_arr[1] == '1'){ //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
					
			}
			else{
				$('.show_consumer_zip').show();
				$('.hide_consumer_zip').hide();
				limitDigits('CustomerConsumerZip',6);
			}
			$('.ein').show();
			// #024 12-03-2015 #27542, Feedback, Booking engine and integration BE > Customer
				//$('#btn_search_breg_customer').show();
				$('#CustomerEin').removeClass('span12');
				$('#CustomerEin').addClass('span12');
				$('#CustomerEin').prop('readonly',false);
			// #024 12-03-2015 #27542, Feedback, Booking engine and integration BE > Customer
			// #024 07-04-2016 #34318, Fwd: IMPORTANT: Current limitations for partners in other countries
				$('.show_ein').show();
				$('.hide_ein').hide();
				$('.show_zip').show();
				$('.hide_zip').hide();
				limitDigits('CustomerEin',9);
				limitDigits('CustomerZip',6);
			// #024 07-04-2016 #34318, Fwd: IMPORTANT: Current limitations for partners in other countries	
		}else{
			$('#CustomerEin').val('');
			$('#CustomerNormalEIN').val('');
			$('.ein').hide();
			// #024 12-03-2015 #27542, Feedback, Booking engine and integration BE > Customer
				$('#btn_search_breg_customer').hide();
			// #024 12-03-2015 #27542, Feedback, Booking engine and integration BE > Customer
			// #024 07-04-2016 #34318, Fwd: IMPORTANT: Current limitations for partners in other countries
				$('.show_ein').hide();
				$('.hide_ein').show();
				$('.show_zip').hide();
				$('.hide_zip').show();
				limitEIN('CustomerNormalEIN',30);
				limitAlphadigitValue('CustomerNormalZip',15);
			// #024 07-04-2016 #34318, Fwd: IMPORTANT: Current limitations for partners in other countries
			
			if(group_arr[1] != '1'){ //#044 03-may-2016 0034538: BE > Feedback, 30.04.16 > part 2
				$('.show_consumer_zip').hide();
				$('.hide_consumer_zip').show();
				limitAlphadigitValue('CustomerConsumerNormalZip',15);
			}
		}
		getAvailDistTypesByCoun();
		
	});

	$('#CustomerConsumerCountry').change(function(){
		getAvailDistTypesByCoun();
	});

	
	
	$('#CustomerHomeCountry').change();
}
function getAvailDistTypesByCoun(from='') {
	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var lang = $('#lang').val();
	var partner_id =$('#partner_id').val();
	var admin_id = $('#admin_id').val();

	var group_id = $("#CustomerUserGroupId").val();
	var group_arr = group_id.split("##");

	var total_params = {
		token:token,
		language:language,
		lang:lang,
		partner_id:partner_id,
		admin_id:admin_id,
		country_code:$('#CustomerHomeCountry').val(),
		user_type_id:group_arr[0],
	};

	var params = $.extend({}, doAjax_params_default);
		params['url'] = APISERVER+'/api/Commons/getAvailDistTypesByCoun.json';
		params['data'] = total_params;
		params['successCallbackFunction'] = function (complet_data){
		
			if(complet_data.response.status == 'success'){
				var opts = [];
				
				if(checkNull(complet_data.response.response.methods) != '' ){
					opts = complet_data.response.response.methods;
					$('#CustomerBusinessDefaultDistribution,#CustomerConsumerDefaultDistribution').empty().append('<option></option>');
					
					for(var j in opts){
						var dt = opts[j];
						var newOption = new Option(dt.name, dt.id, false, false);
						$('#CustomerBusinessDefaultDistribution,#CustomerConsumerDefaultDistribution').append(newOption);
					}
					$('#CustomerBusinessDefaultDistribution,#CustomerConsumerDefaultDistribution').val(null).trigger('change');

					if(from == 'check'){
						if(checkNull(opts[0])){
							var dt = opts[0];
							console.log('dt',dt);
							var typear = $('#CustomerUserGroupId').val();
							typear = typear.split('##');
							var type = typear[0];

							if(dt.internal_name == 'ehf' && $('#CustomerEin').val() != ''){
								$('#CustomerBusinessDefaultDistribution').val(dt.id).trigger('change')
							}
							else if(dt.internal_name == 'email'){
								if(type == 1){
									if($('#CustomerConsumerEmail').val() != ''){
										$('#CustomerConsumerDefaultDistribution').val(dt.id).trigger('change');
									}
								}
								else if(type == 2){
									if($('#CustomerEmail').val() != ''){
										$('#CustomerBusinessDefaultDistribution').val(dt.id).trigger('change');
									}
								}
								
							}
							else if(dt.internal_name == 'both'){
								if(type == 1){
									if($('#CustomerConsumerZip').val() != '' && $('#CustomerConsumerCity').val() != '' && $('#CustomerConsumerCountry').val() != ''){
										$('#CustomerConsumerDefaultDistribution').val(dt.id).trigger('change');
									}
								}
								else if(type == 2){
									if($('#CustomerZip').val() != '' && $('#CustomerCity').val() != '' && $('#CustomerCountry').val() != ''){
										$('#CustomerBusinessDefaultDistribution').val(dt.id).trigger('change');
									}
								}
							}
						}
						
					}
					
				}

			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error','error');
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error','error');
					return;
				}	
			}
		}
		doAjax(params);
		return;
}

function fill_from_home_country(home_country_val){	
	var group_id = $("#CustomerUserGroupId").val();
	var group_arr = group_id.split("##");
	
	if(group_arr[1] == '1'){
		var CustomerZip = $("#CustomerZip").val();
		if(CustomerZip == ''){
			$('#CustomerCountry').val(home_country_val);
			// $('#CustomerCountry').select2();
		}
			
		var CustomerDeliveryZip = $("#CustomerDeliveryZip").val();		
		if(CustomerDeliveryZip == ''){
			$('#CustomerDeliveryCountry').val(home_country_val); 
			// $('#CustomerDeliveryCountry').select2();
		}		
		
		
		var CustomerPhone = $("#CustomerPhone").val();
		if(CustomerPhone == ''){
			$('#CustomerPhCode').val(home_country_val);
			$('#CustomerPhCode').select2();  
			
			var getValue = document.getElementById("CustomerPhCode");
			var getText = getValue.options[getValue.selectedIndex].text;
			var getSplit = getText.split("(");	
			var getAgainSplit = getSplit[1].split(")");					
			$('#CustomerPhCodeVal').val(getAgainSplit[0]); 
		}
		
		var CustomerCellphone = $("#CustomerCellphone").val();
		if(CustomerCellphone == ''){
			$('#CustomerCcCode').val(home_country_val);
			$('#CustomerCcCode').select2();   

			var getValue = document.getElementById("CustomerCcCode");
			var getText = getValue.options[getValue.selectedIndex].text;
			var getSplit = getText.split("(");	
			var getAgainSplit = getSplit[1].split(")");					
			$('#CustomerCcCodeVal').val(getAgainSplit[0]); 
		}			
	}
	else{
		var CustomerConsumerZip = $("#CustomerConsumerZip").val();
		if(CustomerConsumerZip == ''){
			$('#CustomerConsumerCountry').val(home_country_val);
			$('#CustomerConsumerCountry').select2();
		}
			
		var CustomerConsumerDeliveryZip = $("#CustomerConsumerDeliveryZip").val();		
		if(CustomerConsumerDeliveryZip == ''){
			$('#CustomerConsumerDeliveryCountry').val(home_country_val); 
			$('#CustomerConsumerDeliveryCountry').select2();
		}	
				
		
		var CustomerConsumerPhone = $("#CustomerConsumerPhone").val();
		if(CustomerConsumerPhone == ''){
			$('#CustomerConsumerPhCode').val(home_country_val);
			$('#CustomerConsumerPhCode').select2();  

			var getValue = document.getElementById("CustomerConsumerPhCode");
			var getText = getValue.options[getValue.selectedIndex].text;
			var getSplit = getText.split("(");	
			var getAgainSplit = getSplit[1].split(")");					
			$('#CustomerConsumerPhCodeVal').val(getAgainSplit[0]); 
		}
		
		var CustomerConsumerCellphone = $("#CustomerConsumerCellphone").val();
		if(CustomerConsumerCellphone == ''){
			$('#CustomerConsumerCcCode').val(home_country_val);
			$('#CustomerConsumerCcCode').select2();    

			var getValue = document.getElementById("CustomerConsumerCcCode");
			var getText = getValue.options[getValue.selectedIndex].text;
			var getSplit = getText.split("(");	
			var getAgainSplit = getSplit[1].split(")");					
			$('#CustomerConsumerCcCodeVal').val(getAgainSplit[0]); 
		}
	}	

}

function changegroup_val(customer_group = null){
	var price_group = $('#customer_group_'+customer_group).attr('price_group');
	if(price_group!=undefined && price_group!=null && price_group!='' && price_group != 0){
		$('#CustomerPriceGroup').val(price_group);
		$('#CustomerPriceGroup').select2('val',price_group);
		$('#price_group_val').val(price_group);
		$('#CustomerPriceGroup').select2('enable',false);
		$('#CustomerPriceGroup').prop('disabled', true); 
	}else{
		$('#price_group_val').val('');
		$('#CustomerPriceGroup').select2('enable',true);
		$('#CustomerPriceGroup').prop('disabled', false); 
	}
}

function change_consumer_group_val(customer_group = null){
	var price_group = $('#consumer_customer_group_'+customer_group).attr('price_group');
	if(price_group!=undefined && price_group!=null && price_group!='' && price_group != 0){
		$('#CustomerConsumerPriceGroup').val(price_group);
		$('#CustomerConsumerPriceGroup').select2('val',price_group);
		$('#consumer_price_group_val').val(price_group);
		$('#CustomerConsumerPriceGroup').select2('enable',false);
		$('#CustomerConsumerPriceGroup').prop('disabled', true); 
	}else{
		$('#consumer_price_group_val').val('');
		$('#CustomerConsumerPriceGroup').select2('enable',true);
		$('#CustomerConsumerPriceGroup').prop('disabled', false); 
	}
}

function getCityFromZip(val,type,ccode, target = null)
{
	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var lang = $('#lang').val();
	var partner_id = $('#partner_id').val();
	var alert_message = $('#alert_message').val();

	var total_params = {
		token:token,
		language:language,
		lang:lang,
		partner_id:partner_id,
		zip:val,
		ccode:ccode,
	};

	$.ajax({
		type: 'POST',
		url: APISERVER+'/api/logins/getCityFromZip',
		data: total_params,
		async: true,
		dataType : "json",
		success: function(complet_data,status,xhr){
			if(complet_data.response.status == 'success'){
				if(type == 'consumer'){
					if(target == null){
						$('#CustomerConsumerCity').val(complet_data.response.response.city);
					}else{
						$('#'+target).val(complet_data.response.response.city);
					}
				}else{
					if(target == null){
						$('#CustomerCity').val(complet_data.response.response.city);
					}else{
						$('#'+target).val(complet_data.response.response.city);
					}
				}
			}
			else if(complet_data.response.status == 'error'){
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',alert_message);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',alert_message);
					return;
				}	
			}
		},
		error: function(xhr, status, error){
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

function showrows(rows,fromd){
	$('#popups').data().modal.options.width = "700px";
	$('#popups').resize();
	//console.log(that); return;
	if(fromd==12){
		var from = 	'getPhoneNumber';
	}
	else if(fromd==11){
		var from = 	'ein';
	}
	else{
		var from = 	rows.from;
	}

	alert(from+'00'+fromd);
	if(from == 'ein'){
		if(fromd==11){
			if($('input[class=radio_all_name]:checked').val()!='' && $('input[class=radio_all_name]:checked').val()!=undefined && $('input[class=radio_all_name]:checked').val()!=null){
				$('#CustomerCustomerName').val($('input[class=radio_all_name]:checked').val());
				$("#CustomerCustomerName").attr("readonly","readonly");
			}
			else{
				$('#CustomerCustomerName').val('');
			}

			if($('input[class=radio_ein]:checked').val()!='' && $('input[class=radio_ein]:checked').val()!=undefined && $('input[class=radio_ein]:checked').val()!=null){
				setTimeout(function(){ 
					$('#CustomerEin').val(parseInt($('input[class=radio_ein]:checked').val()));
					$('#CustomerEin').attr("readonly","readonly"); 
				}, 1);
			}
			else{
				$('#CustomerEin').val('');
			}

			if($('input[class=radio_postal_phone]:checked').val()!='' && $('input[class=radio_postal_phone]:checked').val()!=undefined && $('input[class=radio_postal_phone]:checked').val()!=null){
				$('#CustomerPhone').val(parseInt($('input[class=radio_postal_phone]:checked').val()));
			}
			else{
				$('#CustomerPhone').val('');
			}

			if($('input[class=radio_postal_cellphone]:checked').val()!='' && $('input[class=radio_postal_cellphone]:checked').val()!=undefined && $('input[class=radio_postal_cellphone]:checked').val()!=null){
				$('#CustomerCellphone').val(parseInt($('input[class=radio_postal_cellphone]:checked').val()));
			}
			else{
				$('#CustomerCellphone').val('');
			}

			if($('input[class=radio_all_postal_address]:checked').val()!='' && $('input[class=radio_all_postal_address]:checked').val()!=undefined && $('input[class=radio_all_postal_address]:checked').val()!=null){
				var radio_all_postal_address = $('input[class=radio_all_postal_address]:checked').val();
				var radio_all_postal_address_arr  = radio_all_postal_address.split('_');
				if(radio_all_postal_address_arr[0]!=undefined && radio_all_postal_address_arr[0]!=null && radio_all_postal_address_arr[0]!=''){
						$('#CustomerAddress1').val(radio_all_postal_address_arr[0]);
				}
				else{
					$('#CustomerAddress1').val('');
				}
				if(radio_all_postal_address_arr[1]!=undefined && radio_all_postal_address_arr[1]!=null && radio_all_postal_address_arr[1]!=''){
						$('#CustomerZip').val(radio_all_postal_address_arr[1]);
				}
				else{
					$('#CustomerZip').val('');
				}
				if(radio_all_postal_address_arr[2]!=undefined && radio_all_postal_address_arr[2]!=null && radio_all_postal_address_arr[2]!=''){
						$('#CustomerCity').val(radio_all_postal_address_arr[2]);
				}
				else{
					$('#CustomerCity').val('');
				}
			}
			else{
				$('#CustomerAddress1').val('');
				$('#CustomerZip').val('');
				$('#CustomerCity').val('');
			}


		}	
		else{
			$('#CustomerCustomerName').val(rows.name);
			$("#CustomerCustomerName").attr("readonly","readonly");
			setTimeout(function(){ 
				$('#CustomerEin').val(rows.ein);
				$('#CustomerEin').attr("readonly","readonly"); 
			}, 1);
			var postal_phone = rows.show_postal_phone;
			postal_phone = postal_phone.replace(' ','');
			if(postal_phone == undefined || postal_phone ==''){	
				postal_phone = '';
			}
			$('#CustomerPhone').val(postal_phone);
			var postal_cellphone = rows.show_postal_cellphone;
			postal_cellphone = postal_cellphone.replace(' ','');
			if(postal_cellphone == undefined || postal_cellphone ==''){	
				postal_cellphone = '';
			}
			$('#CustomerCellphone').val(postal_cellphone);
			$('#CustomerAddress1').val(rows.postal_address);
			$('#CustomerZip').val(rows.postal_zip);
			$('#CustomerCity').val(rows.postal_city);
			$('#CustomerCountry').val(rows.postal_country);
			$('#CustomerCountry').select2('val',rows.postal_country);
			$('#CustomerHomeCountry').val(rows.postal_country);
			$('#CustomerHomeCountry').select2('val',rows.postal_country);
			
			if(postal_phone!=undefined && postal_phone!=null && postal_phone!=''){
				$('#CustomerPhCode').val(rows.postal_country);
				$('#CustomerPhCode').select2('val',rows.postal_country);
				var getValue = document.getElementById("CustomerPhCode");
				var getText = getValue.options[getValue.selectedIndex].text;
				var getSplit = getText.split("(");	
				var getAgainSplit = getSplit[1].split(")");					
				$('#CustomerPhCodeVal').val(getAgainSplit[0]);
			} 
			if(postal_cellphone!=undefined && postal_cellphone!=null && postal_cellphone!=''){
				$('#CustomerCcCode').val(rows.postal_country);
				$('#CustomerCcCode').select2('val',rows.postal_country);
				var getValue = document.getElementById("CustomerCcCode");
				var getText = getValue.options[getValue.selectedIndex].text;
				var getSplit = getText.split("(");	
				var getAgainSplit = getSplit[1].split(")");					
				$('#CustomerCcCodeVal').val(getAgainSplit[0]);
			}
		}
		
		$('#CustomerFirstName').focus();
		$('#CustomerUserGroupId').val('2##1##1');
		$('#CustomerUserGroupId').select2('val','2##1##1');
		$('#CustomerUserGroupId').change();
		//$('#popups').resize();
		
	}else{
		if(fromd!=12){
			
			if(rows.company_name!=undefined && rows.company_name!=null && rows.company_name!=''){
				$('#CustomerConsumerFirstName').val(rows.company_name);
				$('#CustomerConsumerLastName').val('');
			}
			else{
				if(rows.first_name!=undefined && rows.first_name!=null && rows.first_name!=''){
						$('#CustomerConsumerFirstName').val(rows.first_name);
				}
				if(rows.last_name!=undefined && rows.last_name!=null && rows.last_name!=''){
						$('#CustomerConsumerLastName').val(rows.last_name);
				}
			}

			
			$('#CustomerConsumerAddress1').val(rows.address1);
			$('#CustomerConsumerAddress2').val(rows.address2);
			$('#CustomerConsumerZip').val(rows.zip);
			$('#CustomerConsumerCity').val(rows.city);
			

		
			if(rows.show_phone_number!=undefined && rows.show_phone_number!=null && rows.show_phone_number!=''){
				var phone_number = rows.show_phone_number;
				if(phone_number == undefined || phone_number ==''){	
					phone_number = rows.show_alternate_number;
				}
				phone_number = phone_number.replace(' ','');
				$('#CustomerConsumerCellphone').val(phone_number);
			}
			
			if(rows.show_alertnate_number!=undefined && rows.show_alertnate_number!=null && rows.show_alertnate_number!=''){
				var phone_number = rows.show_alertnate_number;
				phone_number = phone_number.replace(' ','');
				$('#CustomerConsumerCellphone').val(phone_number);
			}


			if(rows.show_landline_number!=undefined && rows.show_landline_number!=null && rows.show_landline_number!=''){
				var phone_number = rows.show_landline_number;
				$('#CustomerConsumerPhone').val(phone_number);
			}
			//var first_name = rows.first_name;
			//$('#CustomerConsumerFirstName').val(rows.first_name);
			//$('#CustomerConsumerLastName').val(rows.last_name);
			
			// $('#CustomerEin').prop('readonly',false);
			// if(rows.ein!=undefined && rows.ein!=null && rows.ein!=''){
			// 	$('#CustomerEin').val(rows.ein);
			// 	$('#CustomerEin').prop('readonly',true);
			// }

			$('#CustomerConsumerEmail').val(rows.email);	
		}
		else{
			if($('input[class=radio_company_name]:checked').val()!=undefined && $('input[class=radio_company_name]:checked').val()!=null && $('input[class=radio_company_name]:checked').val()!=''){
			
				$('#CustomerConsumerFirstName').val($('input[class=radio_company_name]:checked').val());

			}
			else{
				if($('input[class=radio_name]:checked').val()!=undefined && $('input[class=radio_name]:checked').val()!=null && $('input[class=radio_name]:checked').val()!=''){
			
				var name = $('input[class=radio_name]:checked').val().split('_');
				$('#CustomerConsumerFirstName').val(name[0]);
				$('#CustomerConsumerLastName').val(name[1]);
				}
				else{
					
					$('#CustomerConsumerFirstName').val('');
					$('#CustomerConsumerLastName').val('');
				}

			}

			var radio_cust_phone = $('input[class=radio_cust_phone]:checked').val();
			if(radio_cust_phone!='' && radio_cust_phone!=undefined && radio_cust_phone!=null){
				$('#CustomerConsumerCellphone').val(phone_number);
			}
			else{
				$('#CustomerConsumerCellphone').val('');
			}
			var radio_cust_cellphone = $('input[class=radio_cust_cellphone]:checked').val();
			if(radio_cust_cellphone!='' && radio_cust_cellphone!=undefined && radio_cust_cellphone!=null){
				$('#CustomerConsumerCellphone').val(radio_cust_cellphone);
			}
			else{
				$('#CustomerConsumerCellphone').val('');
			}
			var radio_all_address = $('input[class=radio_all_address]:checked').val();

				var addrs  = {
					CCustAddress1: '',
		            CCustAddress2: '',
		            CCustZip: '',
		            CCustCity: '',
		           	CCustCountry:checkNull(anc_dt.partner_country,'NO'),
				};
			if(radio_all_address!=undefined && radio_all_address!=null){
				var radio_all_address_split = radio_all_address.split('_');
				if(radio_all_address_split[0]!=undefined && radio_all_address_split[0]!=null){
					addrs.CCustAddress1 = radio_all_address_split[0];
				}
				else{
					addrs.CCustAddress1 = '';
				}

				if(radio_all_address_split[1]!=undefined && radio_all_address_split[1]!=null){
					addrs.CCustZip
					$('#CustomerConsumerZip').val(radio_all_address_split[1]);
				}
				else{
					$('#CustomerConsumerZip').val('');
				}

				if(radio_all_address_split[2]!=undefined && radio_all_address_split[2]!=null){
					$('#CustomerConsumerCity').val(radio_all_address_split[2]);
				}
				else{
					$('#CustomerConsumerCity').val('');
				}
			}
			else{
				$('#CustomerConsumerAddress1').val('');
				$('#CustomerConsumerZip').val('');
				$('#CustomerConsumerCity').val('');
			}
		}	
		$('#CustomerConsumerFirstName').focus();
		$('#CustomerUserGroupId').val('1####');
		$('#CustomerUserGroupId').select2('val','1####');
		$('#CustomerUserGroupId').change();
		//$('#popups').resize();
	}
	
	

	//$('#popups').addClass('large_customer');
	//$('#popups').resize();
	$('#show_ein_information').hide();
	$('#back_submit').show();
	//$('#show_ein_details_data').html('');
	//$('#show_ein_details_duplicate').html('');
	$('#add_new_task_submit').hide();
	$('#show_customer_details').show();
	$('#proceed_to_customer').show();
	$('#proceed_to_sales_documnet').show();
	$('#proceed_to_save_task').show();

	try{
		var prop =  w = 1000;
		$('#popups').css('width', w);
		$('#popups').css('margin-left', function () {
			return -($(this).width() / 2) + 'px';
		});	
		$('#popups').find('.modal-body').css('overflow', '').css(prop, '');
		var modalOverflow = $(window).height() - 10 < $('#popups').height();
	    $('#popups').css('margin-top', 0 - $('#popups').height() / 2).removeClass('modal-overflow');
    }
    catch(e){}
    getAvailDistTypesByCoun('check');

}

function proceedCustomer(fromDoc = null){
	document.getElementById('hiddenNewCustomerImg').style.visibility = 'unset';
	
	var APISERVER = $('#APISERVER').val();
	var token = $('#token').val();
	var language = $('#language').val();
	var lang = $('#lang').val();
	var partner_id = $('#partner_id').val();
	var alert_message = $('#alert_message').val();
	
	var user_group_id = $('#CustomerUserGroupId').val();
	var customerTypeArr = user_group_id.split("##");
	var userGroupId = customerTypeArr[0];
	if(customerTypeArr[1] == '1'){
		var customer_name = $('#CustomerCustomerName').val();
		var first_name = $('#CustomerFirstName').val();
		var last_name = $('#CustomerLastName').val();
		var ein = $('#CustomerEin').val();
		var phone_code = $('#CustomerPhCodeVal').val();
		var phone = $('#CustomerPhone').val();
		var cell_code = $('#CustomerCcCodeVal').val();
		var cellphone = $('#CustomerCellphone').val();
		var customer_group_id = $('#CustomerCustomerGroupId').val();
		var email = $('#CustomerEmail').val();
		var price_group = $('#price_group_val').val();
		var send_contact_details = '0';
		if($('#UserSendContactDetails').parent().attr("class"))
			send_contact_details = '1';
		var address1 = $('#CustomerAddress1').val();
		var address2 = $('#CustomerAddress2').val();
		var country = $('#CustomerCountry').val();
		if(country == 'NO')	
			var zip = $('#CustomerZip').val();	
		else
			var zip = $('#CustomerNormalZIp').val();	
		var city = $('#CustomerCity').val();	
		var same_postal_address = 'n';
		var delivery_address1 = address1;
		var delivery_address2 = address2;
		var delivery_zip = zip;
		var delivery_city = city;
		var delivery_country = country;
		if($('#CustomerSamePostalAddress').parent().attr("class")){
			same_postal_address = 'y';
			delivery_address1 = $('#CustomerDeliveryAddress1').val();
			delivery_address2 = $('#CustomerDeliveryAddress2').val();
			delivery_zip = $('#CustomerDeliveryZip').val();
			delivery_city = $('#CustomerDeliveryCity').val();
			delivery_country = $('#CustomerDeliveryCountry').val();
		}
		var business_default_distribution = $('#CustomerBusinessDefaultDistribution').val();
		var businessDefaultDistribution = business_default_distribution.split("##");
		var business_default_contact = '';
		var business_custom_email = '';
		if(businessDefaultDistribution[1] != 'postal'){
			business_default_contact = $('#CustomerBusinessDefaultContact').val();
			business_custom_email    = $('#CustomerBusinessCustomEmail').val(); 
		}
		var receive_mass_sms_emails = $('#CustomerReceiveMassSmsEmails').val();
		var receive_mass_emails = 0;
		var receive_mass_sms = 0;
		if(receive_mass_sms_emails!=undefined && receive_mass_sms_emails!=null && receive_mass_sms_emails!=''){
			if(receive_mass_sms_emails == 1){
				receive_mass_emails = 1;
			}else if(receive_mass_sms_emails == 2){
				receive_mass_sms = 1;
			}else if(receive_mass_sms_emails == 3){
				receive_mass_emails = 1;
				receive_mass_sms = 1;
			}
		}
		
		var chk_dup_customers = $('#chk_dup_customers').val();
		var partner_type = $('#LOGIN_TYPE').val();
		var ip_address = $('#remote_address').val();
		var directory = $('#partner_directory').val();
		var host_url = $('#HOST_URL').val();
		var partner_name = $('#PartnerName').val();
		
		var text_arr = $("input[data-attr='text']");
		var textarea_arr = $("textarea[data-attr='textarea']");
		var dropdown_arr = $("select[data-attr='dropdown']");
		var checkbox_arr = $("input[data-attr='checkbox']");
		var radio_arr = $("input[data-attr='radio']");
		var text_mandatory_arr = $("input[data-attr='text_mandatory']");
		var textarea_mandatory_arr = $("textarea[data-attr='textarea_mandatory']");
		var dropdown_mandatory_arr = $("select[data-attr='dropdown_mandatory']");
		var checkbox_mandatory_arr = $("input[data-attr='checkbox_mandatory']");
		var radio_mandatory_arr = $("input[data-attr='radio_mandatory']");
		
		var text_data_arr = {};
		var textarea_data_arr = {};
		var dropdown_data_arr = {};
		var checkbox_data_arr = {};
		var radio_data_arr = {};
		var customFieldsAns = [];
		for(var i=0;i<text_arr.length;i++) {
			//text_data_arr[i] = $(text_arr[i]).val();
			var text_data_arr_error = checkCustomFieldData($(text_arr[i]).val(), $(text_mandatory_arr[i]).val());
			if(!text_data_arr_error){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden'; 
				showAlertMessage($(text_arr[i]).attr('data-name'),'error','Alert message');
				return;
			}else{
				text_data_arr[$(text_arr[i]).attr('data-name')] = $(text_arr[i]).val();
			}
		}
		for(var i=0;i<textarea_arr.length;i++) {
			textarea_data_arr_error = checkCustomFieldData($(textarea_arr[i]).val(), $(textarea_mandatory_arr[i]).val());
			if(!textarea_data_arr_error){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden'; 
				showAlertMessage($(textarea_arr[i]).attr('data-name'),'error','Alert message');
				return;
			}else{
				textarea_data_arr[$(textarea_arr[i]).attr('data-name')] = $(text_arr[i]).val();
			}
		}
		for(var i=0;i<dropdown_arr.length;i++) {
			dropdown_data_arr_error = checkCustomFieldData($(dropdown_arr[i]).val(), $(dropdown_mandatory_arr[i]).val());
			if(!dropdown_data_arr_error){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden'; 
				showAlertMessage($(dropdown_arr[i]).attr('data-name'),'error','Alert message');
				return;
			}else{
				dropdown_data_arr[$(dropdown_arr[i]).attr('data-name')] = $(dropdown_arr[i]).val();
			}
		}
		for(var i=0;i<checkbox_arr.length;i++) {
			if($(checkbox_arr[i]).is(':checked'))
				checkbox_data_arr[$(checkbox_arr[i]).attr('data-name')] = 1;
			else
				checkbox_data_arr[$(checkbox_arr[i]).attr('data-name')] = 0;
		}
		for(var i=0;i<radio_arr.length;i++) {
			if($(radio_arr[i]).is(':checked'))
				radio_data_arr[$(radio_arr[i]).attr('data-name')] = $(radio_arr[i]).val();
		}
		
		customFieldsAns.push({text : text_data_arr,textarea : textarea_data_arr, radio : radio_data_arr, checkbox : checkbox_data_arr, dropdown : dropdown_data_arr});
		var total_params = {
			token:token,
			language:language,
			user_group_id	: userGroupId,
			login_group_id	: 3,
			partner_id : partner_id,
			ein : ein,
			customer_name : customer_name,
			address1 : address1,
			address2 : address2,
			city : city,
			zip : zip,
			country : country,
			phone_code : phone_code,
			phone : phone,
			first_name : first_name,
			last_name : last_name,
			cell_code : cell_code,
			cellphone : cellphone,
			email : email,
			ip_address : ip_address,
			tnc : '',
			type			: partner_type,
			login_link 	: host_url+directory+'/customer/login',
			email_verification_link : host_url+directory+'/customer/userVerification',
			login_verification_link : host_url+directory+'/customer/loginVerification',
			forgot_password_link : host_url+directory+'/customer/activatePassword',
			from_name : partner_name,
			lang : lang,
			send_contact_details : send_contact_details,
			price_group : price_group,
			customer_group_id : customer_group_id,			
			chk_dup_customers : chk_dup_customers,
			default_distribution : business_default_distribution,
			business_default_contact	: business_default_contact,
			default_distribution_address : business_custom_email,
			receive_mass_emails : receive_mass_emails,
			receive_mass_sms : receive_mass_sms,
			same_postal_address	: same_postal_address,
			delivery_address1		: delivery_address1,
			delivery_address2		: delivery_address2,
			delivery_zip			: delivery_zip,
			delivery_city			: delivery_city,
			delivery_country		: delivery_country,
			customFieldsAns : JSON.stringify(customFieldsAns), 
		};
		var url = APISERVER+'api/customers/addBusiness';
		
	}else{
		var first_name = $('#CustomerConsumerFirstName').val();
		var last_name = $('#CustomerConsumerLastName').val();
		var date_of_birth = $('#CustomerConsumerDateOfBirth').val();
		var phone_code = $('#CustomerConsumerPhCodeVal').val();
		var phone = $('#CustomerConsumerPhone').val();
		var cell_code = $('#CustomerConsumerCcCodeVal').val();
		var cellphone = $('#CustomerConsumerCellphone').val();
		var customer_group_id = $('#CustomerConsumerCustomerGroupId').val();
		var email = $('#CustomerConsumerEmail').val();
		var price_group = $('#consumer_price_group_val').val();
		var send_contact_details = '0';
		if($('#UserSendContactDetails').parent().attr("class"))
			send_contact_details = '1';
		var address1 = $('#CustomerConsumerAddress1').val();
		var address2 = $('#CustomerConsumerAddress2').val();
		var country = $('#CustomerConsumerCountry').val();
		if(country == 'NO')	
			var zip = $('#CustomerConsumerZip').val();	
		else
			var zip = $('#CustomerConsumerNormalZip').val();	
		var city = $('#CustomerConsumerCity').val();	
		var same_postal_address = 'n';
		var delivery_address1 = address1;
		var delivery_address2 = address2;
		var delivery_zip = zip;
		var delivery_city = city;
		var delivery_country = country;
		if($('#CustomerConsumerSamePostalAddress').parent().attr("class")){
			same_postal_address = 'y';
			delivery_address1 = $('#CustomerConsumerDeliveryAddress1').val();
			delivery_address2 = $('#CustomerConsumerDeliveryAddress2').val();
			delivery_zip = $('#CustomerConsumerDeliveryZip').val();
			delivery_city = $('#CustomerConsumerDeliveryCity').val();
			delivery_country = $('#CustomerConsumerDeliveryCountry').val();
		}
		var business_default_distribution = $('#CustomerConsumerDefaultDistribution').val();
		var businessDefaultDistribution = business_default_distribution.split("##");
		var business_default_contact = '';
		var business_custom_email = '';
		if(businessDefaultDistribution[1] != 'postal'){
			business_default_contact = $('#CustomerDefaultContact').val();
			business_custom_email    = $('#CustomerConsumerCustomEmail').val(); 
		}
		var receive_mass_sms_emails = $('#CustomerConsumerReceiveMassSmsEmails').val();
		var receive_mass_emails = 0;
		var receive_mass_sms = 0;
		if(receive_mass_sms_emails!=undefined && receive_mass_sms_emails!=null && receive_mass_sms_emails!=''){
			if(receive_mass_sms_emails == 1){
				receive_mass_emails = 1;
			}else if(receive_mass_sms_emails == 2){
				receive_mass_sms = 1;
			}else if(receive_mass_sms_emails == 3){
				receive_mass_emails = 1;
				receive_mass_sms = 1;
			}
		}
		
		var chk_dup_customers = $('#chk_dup_customers').val();
		var partner_type = $('#LOGIN_TYPE').val();
		var ip_address = $('#remote_address').val();
		var directory = $('#partner_directory').val();
		var host_url = $('#HOST_URL').val();
		var partner_name = $('#PartnerName').val();
		
		var text_arr = $("input[data-attr='consumer_text']");
		var textarea_arr = $("textarea[data-attr='consumer_textarea']");
		var dropdown_arr = $("select[data-attr='consumer_dropdown']");
		var checkbox_arr = $("input[data-attr='consumer_checkbox']");
		var radio_arr = $("input[data-attr='consumer_radio']");
		var text_mandatory_arr = $("input[data-attr='consumer_text_mandatory']");
		var textarea_mandatory_arr = $("textarea[data-attr='consumer_textarea_mandatory']");
		var dropdown_mandatory_arr = $("select[data-attr='consumer_dropdown_mandatory']");
		var checkbox_mandatory_arr = $("input[data-attr='consumer_checkbox_mandatory']");
		var radio_mandatory_arr = $("input[data-attr='consumer_radio_mandatory']");
		
		var text_data_arr = {};
		var textarea_data_arr = {};
		var dropdown_data_arr = {};
		var checkbox_data_arr = {};
		var radio_data_arr = {};
		var customFieldsAns = [];
		for(var i=0;i<text_arr.length;i++) {
			//text_data_arr[i] = $(text_arr[i]).val();
			var text_data_arr_error = checkCustomFieldData($(text_arr[i]).val(), $(text_mandatory_arr[i]).val());
			if(!text_data_arr_error){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden'; 
				showAlertMessage($(text_arr[i]).attr('data-name'),'error','Alert message');
				return;
			}else{
				text_data_arr[$(text_arr[i]).attr('data-name')] = $(text_arr[i]).val();
			}
		}
		for(var i=0;i<textarea_arr.length;i++) {
			textarea_data_arr_error = checkCustomFieldData($(textarea_arr[i]).val(), $(textarea_mandatory_arr[i]).val());
			if(!textarea_data_arr_error){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden'; 
				showAlertMessage($(textarea_arr[i]).attr('data-name'),'error','Alert message');
				return;
			}else{
				textarea_data_arr[$(textarea_arr[i]).attr('data-name')] = $(text_arr[i]).val();
			}
		}
		for(var i=0;i<dropdown_arr.length;i++) {
			dropdown_data_arr_error = checkCustomFieldData($(dropdown_arr[i]).val(), $(dropdown_mandatory_arr[i]).val());
			if(!dropdown_data_arr_error){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden'; 
				showAlertMessage($(dropdown_arr[i]).attr('data-name'),'error','Alert message');
				return;
			}else{
				dropdown_data_arr[$(dropdown_arr[i]).attr('data-name')] = $(dropdown_arr[i]).val();
			}
		}
		for(var i=0;i<checkbox_arr.length;i++) {
			if($(checkbox_arr[i]).is(':checked'))
				checkbox_data_arr[$(checkbox_arr[i]).attr('data-name')] = 1;
			else
				checkbox_data_arr[$(checkbox_arr[i]).attr('data-name')] = 0;
		}
		for(var i=0;i<radio_arr.length;i++) {
			if($(radio_arr[i]).is(':checked'))
				radio_data_arr[$(radio_arr[i]).attr('data-name')] = $(radio_arr[i]).val();
		}
		
		customFieldsAns.push({text : text_data_arr,textarea : textarea_data_arr, radio : radio_data_arr, checkbox : checkbox_data_arr, dropdown : dropdown_data_arr});
	
		var total_params = {
			token:token,
			language:language,
			user_group_id	: userGroupId,
			login_group_id	: 3,
			partner_id : partner_id,
			dob : date_of_birth,
			address1 : address1,
			address2 : address2,
			city : city,
			zip : zip,
			country : country,
			phone_code : phone_code,
			phone : phone,
			first_name : first_name,
			last_name : last_name,
			cell_code : cell_code,
			cellphone : cellphone,
			email : email,
			ip_address : ip_address,
			tnc : '',
			type			: partner_type,
			login_link 	: host_url+directory+'/customer/login',
			email_verification_link : host_url+directory+'/customer/userVerification',
			login_verification_link : host_url+directory+'/customer/loginVerification',
			forgot_password_link : host_url+directory+'/customer/activatePassword',
			from_name : partner_name,
			lang : lang,
			send_contact_details : send_contact_details,
			price_group : price_group,
			customer_group_id : customer_group_id,
			chk_dup_customers : chk_dup_customers,
			default_distribution : business_default_distribution,
			consumer_default_contact	: business_default_contact,
			default_distribution_address : business_custom_email,
			receive_mass_emails : receive_mass_emails,
			receive_mass_sms : receive_mass_sms,
			same_postal_address	: same_postal_address,
			delivery_address1		: delivery_address1,
			delivery_address2		: delivery_address2,
			delivery_zip			: delivery_zip,
			delivery_city			: delivery_city,
			delivery_country		: delivery_country,
			customFieldsAns : JSON.stringify(customFieldsAns), 
		};
		
		var url = APISERVER+'/api/customers/addConsumer';
	}
	
	$.ajax({
		type: 'POST',
		url: url,
		data: total_params,
		async: true,
		dataType : "json",
		success: function(complet_data,status,xhr){
			if(complet_data.response.status == 'success'){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
				var success_msg = is_undefined(complet_data.response.response.message.msg);
				var customerId = is_undefined(complet_data.response.response.customer_id);
				var duplicate_exist = is_undefined(complet_data.response.response.duplicate_exist);
				call_toastr('success', 'Success', success_msg);
				if(chk_dup_customers == 'y' && duplicate_exist == 'y'){	
					var customer_name = first_name +' ' +last_name;	
					var phone_number = phone_code+phone;
					var cellphone_number = cell_code+cellphone;
					if(userGroupId == '1'){
						var customer_type= 'business';
					}else{
						var customer_type= 'consumer';
						var ein = '';
					}
					var query_str = host_url+partner_type+'/customers/searchDuplicateCustomers?customer_name='+customer_name+'&email='+email+'&ein='+ein+'&phone_number='+phone_number+'&cellphone_number='+cellphone_number+'&zip='+zip+'&customer_type='+customer_type+'&request_from='+fromDoc;		
					$('#open_dup_customer_list').attr('data-url',query_str), 
					$('#open_dup_customer_list').click();
					return;
				}
				if(fromDoc == 'salesDocument'){
					closeModal('popups'); 
					closeModal('popups2'); 
					passRequest(host_url+partner_type+'/sales/search_customers?request_from=customer_select&customerID='+customerId,'','undefined');
					return;
				}else if(fromDoc == 'openTasks'){
					var query_string = host_url+partner_type+'/task/new_task?request_to=customer';
					var customer_task_name = $('#customer_task_name').val();	
					closeModal('popups'); 
					closeModal('popups2'); 
					$('#open_new_task').attr('data-url',query_string); 
					$('#open_new_task').click(); 
					setTimeout(function(){ passRequest(host_url+partner_type+'/inspections/edit_inspection?request_to=customer&customerID='+customerId+'&customer_task_name='+customer_task_name,'','undefined'); }, 3000);
					return;
				}else{
					closeModal('popups');
					closeModal('popups2');
					new_custom_main_page2('/'+type+'/customers/details/'+customerId,'all_customers','all_customers','customer_details',{customer_id:customerId});

				}
			}
			else if(complet_data.response.status == 'error'){
				document.getElementById('hiddenNewCustomerImg').style.visibility = 'hidden';
				if(complet_data.response.response.error == 'validationErrors'){
					var mt_arr = complet_data.response.response.list;
					var array = $.map(mt_arr, function(value, index) {
						return value+'<br />';
					});
					showAlertMessage(array,'error',alert_message);
					return;
				}else{
					showAlertMessage(complet_data.response.response.msg,'error',alert_message);
					return;
				}	
			}
		},
		error: function(xhr, status, error){
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

function goToCustomer(cust_id){
	var type = $('#type').val();
	$('#popups').modal('hide');
	new_custom_main_page2('/'+type+'/sales/save','sales_sel','sales_sel','sales_save',{customer_id:cust_id});
}