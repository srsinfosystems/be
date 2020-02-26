/* Author 	: 018
 * Date 	: 03 FEB 2014
 * DESC 	: Main custom javascript file for logged-in user, 
 * CAUTION  : Should load only when user is logged-in
 *  
 * */
//#024 14-01-2017 Fwd: Feedback, inventory module 
	function calculateProductLineTotal(line_key){
		var enable_inventory = $("#enable_inventory").val();
		//#024 14-12-2016 #222: Fwd: Feedback, inventory > Sales changes 
			if(enable_inventory == 'y'){
				var obj_location = document.getElementById('location_'+line_key);
				var inventory_product = document.getElementById("inventory_product_"+line_key).value;
				if(inventory_product == 'n'){
					var actualInventroy = is_undefined('0_0##0');
					if(actualInventroy != ''){
						location = actualInventroy.split("##");
						location1 = is_undefined(location[0]); 
						location2 = is_undefined(location[1]);
						if(location1 != ''){
							selctLocation = location1.split("_");	
						}
					}
					$("#actual_inventory_"+line_key).val(convertIntoLocalFormat(is_undefined(selctLocation[1])));
					$('#location_'+line_key).prop('selectedIndex', location2);
					if(obj_location.length > 1){
						$('#location_'+line_key).prop('selectedIndex', location2).select2();
					}
					$("#all_location_id_"+line_key).val(location1);
				}else{
					if(obj_location.length > 1){
						var actualInv = check_stock(line_key);
						var selctLocation = '';
						var actualInventroy = '';
						var location = '';
						var location1 = '';
						var location2 = '';
						if(actualInv != '' || actualInv != undefined){
							actualInventroy = is_undefined(actualInv);
							if(actualInventroy != ''){
								location = actualInventroy.split("##");
								location1 = is_undefined(location[0]);
								location2 = is_undefined(location[1]);
								if(location1 != ''){
									selctLocation = location1.split("_");	
								}	
							}
							$("#actual_inventory_"+line_key).val(convertIntoLocalFormat(is_undefined(selctLocation[1])));	
							$('#location_'+line_key).prop('selectedIndex', location2);
							$('#location_'+line_key).prop('selectedIndex', location2).select2();
							$("#all_location_id_"+line_key).val(location1);
						}else{
							var actualInventroy = is_undefined('0_0##0');
							if(actualInventroy != ''){
								location = actualInventroy.split("##");
								location1 = is_undefined(location[0]); 
								location2 = is_undefined(location[1]);
								if(location1 != ''){
									selctLocation = location1.split("_");	
								}
							}
							$("#actual_inventory_"+line_key).val(convertIntoLocalFormat(is_undefined(selctLocation[1])));
							$('#location_'+line_key).prop('selectedIndex', location2)
							if(obj_location.length > 1){
								$('#location_'+line_key).prop('selectedIndex', location2).select2();
							}
							$("#all_location_id_"+line_key).val(location1);
						}
					}else{
						var obj_location = document.getElementById('location_'+line_key).value;
						if(obj_location != ''){
							location = obj_location.split("_");
							$("#actual_inventory_"+line_key).val(convertIntoLocalFormat(is_undefined(location[1])));	
						}
						$("#all_location_id_"+line_key).val(obj_location);
					}
				}
			}		
		//#024 14-12-2016 #222: Fwd: Feedback, inventory > Sales changes
		calculateLineTotal('', line_key);
	}
//#024 14-01-2017 Fwd: Feedback, inventory module	 

function calculateLineTotal(val, id, calculation)
{
	var enable_inventory = $("#enable_inventory").val();
	if(enable_inventory == 'y'){
		var myArray = new Array('qty_', 'vat_level_', 'discount_','discount_amount_', 'unit_price_','gross_amount_','text_line_','actual_inventory_','inventory_product_');
	}else{
		var myArray = new Array('qty_', 'vat_level_', 'discount_','discount_amount_', 'unit_price_','gross_amount_','text_line_');
	}
	var flag='0';
	for(var i=0;i<myArray.length;i++)
	{
		if(!document.getElementById(myArray[i]+id)){
			flag = '1';
			break;
		}
	}

	if(flag == '1'){
		return false;
	}

	if($('#text_line_'+id).val() == 'y'){
		return;
	}
	
	//calculateDiscount('percentage',id,'y');
	/*********** 024 25-05-2015 #29584, Bug, minbefaring.no > Less serious bugs >7 *******/
		$("#qty_"+id).keydown(function (e) {
			if(e.keyCode == 9) {
				var quantity = convertIntoStandardFormat($("#qty_"+id).val().trim());
				$("#qty_"+id).val(convertIntoLocalFormat(quantity));
			}	
		});
	/*********** 024 25-05-2015 #29584, Bug, minbefaring.no > Less serious bugs >7 *******/		
	var qty = document.getElementById("qty_"+id).value;
	
	/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
		qty = convertIntoStandardFormat(qty.trim());
		if(!IsNumeric(qty)){
			qty = '0';
		}
		qty = parseFloat(qty);
	/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
	
	/**** #024 23-07-2016 #35455, BE > Fwd: Inventory refill and calculations > REGISTERING SALES *******/
		if(enable_inventory == 'y'){
			var actual_inventory = document.getElementById("actual_inventory_"+id).value;
			actual_inventory = convertIntoStandardFormat(actual_inventory.trim());
			if(!IsNumeric(actual_inventory)){
				actual_inventory = '0';
			}
			actual_inventory = parseFloat(actual_inventory);
			
			var inventory_product = document.getElementById("inventory_product_"+id).value;
			if(inventory_product == 'y'){
				if(qty > actual_inventory){
					$('#qty_'+id).css({"border-color": "#e02222", 
					 "border-width":"2px", 
					 "border-style":"solid"});	
				}else{
					$('#qty_'+id).css({"border-color": "#e5e5e5", 
					 "border-width":"1px", 
					 "border-style":"solid"});
				}
			}else{
				$('#qty_'+id).css({"border-color": "#e5e5e5", 
					 "border-width":"1px", 
					 "border-style":"solid"});
			}
		}		
	/**** #024 23-07-2016 #35455, BE > Fwd: Inventory refill and calculations > REGISTERING SALES *******/		
	
	/***** #024 28-03-2015 #28322, Minor bugs ****/
		var net_amount_value = $('#net_amount_value').val();
		var unit_price_val = convertIntoStandardFormat(document.getElementById("unit_price_"+id).value);
		var discount_amount_val = convertIntoStandardFormat(document.getElementById("discount_amount_"+id).value);
		if (Number(discount_amount_val) > Number(Math.abs(qty*unit_price_val))) {
			showAlertMessage(net_amount_value,'error');
			if($("#discount_value_"+id).val() != undefined){
				$("#discount_amount_"+id).val($("#discount_value_"+id).val());
			}else{
				$("#discount_amount_"+id).val('0,00');
			}
		}else{
			var unit_price = document.getElementById("unit_price_"+id).value;
			unit_price = convertIntoStandardFormat(unit_price.trim());
			if(!IsNumeric(unit_price)){
				unit_price = '0';
			}
			unit_price = parseFloat(unit_price);
			
			//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!
				/* var discount = document.getElementById("discount_"+id).value;
				discount = convertIntoStandardFormat(discount.trim());
				if(!IsNumeric(discount)){
					discount = '0';
				}
				discount = parseFloat(discount); */
			
				var discount_amount = document.getElementById("discount_amount_"+id).value;
				discount_amount = convertIntoStandardFormat(discount_amount.trim());
				if(!IsNumeric(discount_amount)){
					discount_amount = '0';
				}
				discount_amount = parseFloat(discount_amount);
			//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
			
			var percentage = $("#vat_level_"+id+" option:selected").text();
			percentage = percentage.trim();
			if(!IsNumeric(percentage) || percentage == '-'){
				percentage = '0';
			}
			percentage = parseFloat(percentage);
			/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
				total_amount = roundNumber((parseFloat(unit_price) * parseFloat(qty)));
			/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/	 
			
			apply_tax = $('#apply_tax').val();
			var show_location = '';
			if(apply_tax == 'N'){
				tax = 0;
				colspan = 6;
				$('.product_description_column').attr('colspan',colspan);
			}else{
				if(enable_inventory == 'y'){
					if(document.getElementById('show_location'))
						show_location = document.getElementById('show_location').style.display;
					if(show_location != 'none' || show_location != null){
						tax = roundNumber((parseFloat(total_amount) * parseInt(percentage))/ 100);
						colspan = 8;
						$('.product_description_column').attr('colspan',colspan);
					}else{
						tax = roundNumber((parseFloat(total_amount) * parseInt(percentage))/ 100);
						colspan = 7;
						$('.product_description_column').attr('colspan',colspan);
					}
				}else{
					tax = roundNumber((parseFloat(total_amount) * parseInt(percentage))/ 100);
					colspan = 7;
					$('.product_description_column').attr('colspan',colspan);
				}
			}
			//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!	
				discount_tax = roundNumber((parseFloat(discount_amount) * parseInt(percentage))/ 100);
				discount_amount = (parseFloat(discount_amount)+parseFloat(discount_tax));
			//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
			
			if(total_amount < 0){
				gross_amount = roundNumber(parseFloat(total_amount) + parseFloat(discount_amount) + parseFloat(tax));
			}else{
				gross_amount = roundNumber(parseFloat(total_amount) - parseFloat(discount_amount) + parseFloat(tax));	
			}
			
			$("#gross_amount_"+id).val(convertIntoLocalFormat(roundNumber(gross_amount)));
			
			// BUG: 0022671  BY:054  04 Oct 2014 
			$("#edit_gross_amount_"+id).html(convertIntoLocalFormat(roundNumber(gross_amount)));
			
			if($('#customer_product_line').length>0){
				$("#label_gross_amount_"+id).html(convertIntoLocalFormat(roundNumber(gross_amount)));
				
				$("#label_vat_level_"+id).html(convertIntoLocalFormat(roundNumber(percentage)));
			}
			
			getSummaryLineCalculation(calculation);
		}
	/***** #024 28-03-2015 #28322, Minor bugs ****/
}

// #024 14-12-2016 #222: Fwd: Feedback, inventory > Sales changes
	function isEmpty(str) {
	    return (!str || 0 === str.length);
	}

	function check_stock(line_key) {
		var obj_location = document.getElementById('location_'+line_key);
		var qty = document.getElementById("qty_"+line_key).value; 
		var qty = convertIntoStandardFormat(qty.trim());
		var default_location_id = $('#default_location_id').val();
		if(default_location_id == 0){
			default_location_id = '';	
		}
		var default_location = isEmpty(default_location_id);
		var val = '';
		var stocks = '';
		for (i = 0; i < obj_location.length; i++) {
			val =  obj_location.options[i].value;
			stocks = val.split("_");
			if(default_location == false) {
				var stock = stocks[1];
				var stock = convertIntoStandardFormat(stock.trim());
				if(default_location_id == stocks[0] && parseFloat(qty) <= parseFloat(stock)) {
					return val+"##"+i;		
				}		
			}else{
				var stock = stocks[1];
				var stock = convertIntoStandardFormat(stock.trim());
				if(parseFloat(qty) <= parseFloat(stock)) {
					return val+"##"+i;				
				}			
			}
		}
	}
// #024 14-12-2016 #222: Fwd: Feedback, inventory > Sales changes	

/***** #024 22-07-2016 #35451, BE > Fwd: Inventory refill and calculations > REFILL INVENTORY ****/
	function calculateRefillLineTotal(val, id)
	{
		var myArray = new Array('qty_', 'vat_level_', 'discount_','discount_amount_', 'unit_price_','gross_amount_','text_line_','batch_sum_','pricing_','actual_inventory_','new_inventory_','location_');
		
		var flag='0';
		for(var i=0;i<myArray.length;i++)
		{
			if(!document.getElementById(myArray[i]+id)){
				flag = '1';
				break;
			}
		}
		
		if(flag == '1'){
			return false;
		}
		
		if($('#text_line_'+id).val() == 'y'){
			return;
		}
		
		//calculateDiscount('percentage',id,'y');
		/*********** 024 25-05-2015 #29584, Bug, minbefaring.no > Less serious bugs >7 *******/
			$("#qty_"+id).keydown(function (e) {
				if(e.keyCode == 9) {
					var quantity = convertIntoStandardFormat($("#qty_"+id).val().trim());
					$("#qty_"+id).val(convertIntoLocalFormat(quantity));
				}	
			});
		/*********** 024 25-05-2015 #29584, Bug, minbefaring.no > Less serious bugs >7 *******/		
		var qty = document.getElementById("qty_"+id).value;
		var actual_inventory = document.getElementById("actual_inventory_"+id).value;
		
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
			qty = convertIntoStandardFormat(qty.trim());
			actual_inventory = convertIntoStandardFormat(actual_inventory.trim());
			if(!IsNumeric(qty)){
				qty = '0';
			}
			if(!IsNumeric(actual_inventory)){
				actual_inventory = '0';
			}
			qty = parseFloat(qty);
			var actual_inventory_val = parseFloat(qty) + parseFloat(actual_inventory);
			/* Update New inventory */
				$("#new_inventory_"+id).val(convertIntoLocalFormat(roundNumber(actual_inventory_val)));
			/* Update New inventory */
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/	
		
		/***** #024 28-03-2015 #28322, Minor bugs ****/
			var net_amount_value = $('#net_amount_value').val();
			var unit_price_val = convertIntoStandardFormat(document.getElementById("unit_price_"+id).value);
			var discount_amount_val = convertIntoStandardFormat(document.getElementById("discount_amount_"+id).value);
			var new_inventory_val = convertIntoStandardFormat(document.getElementById("new_inventory_"+id).value);
			
			var pricing_val = $("#pricing_"+id+" option:selected").val();
			if (Number(discount_amount_val) > Number(Math.abs(qty*unit_price_val))) {
				showAlertMessage(net_amount_value,'error');
				if($("#discount_value_"+id).val() != undefined){
					$("#discount_amount_"+id).val($("#discount_value_"+id).val());
				}else{
					$("#discount_amount_"+id).val('0,00');
				}
			}else{
				var unit_price = document.getElementById("unit_price_"+id).value;
				unit_price = convertIntoStandardFormat(unit_price.trim());
				if(!IsNumeric(unit_price)){
					unit_price = '0';
				}
				unit_price = parseFloat(unit_price);
				
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!
					/* var discount = document.getElementById("discount_"+id).value;
					discount = convertIntoStandardFormat(discount.trim());
					if(!IsNumeric(discount)){
						discount = '0';
					}
					discount = parseFloat(discount); */
				
					var discount_amount = document.getElementById("discount_amount_"+id).value;
					discount_amount = convertIntoStandardFormat(discount_amount.trim());
					if(!IsNumeric(discount_amount)){
						discount_amount = '0';
					}
					discount_amount = parseFloat(discount_amount);
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
				
				var percentage = $("#vat_level_"+id+" option:selected").text();
				percentage = percentage.trim();
				if(!IsNumeric(percentage) || percentage == '-'){
					percentage = '0';
				}
				percentage = parseFloat(percentage);
				/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
					if(pricing_val == 'batch'){
						total_amount = roundNumber((parseFloat(unit_price)));
						batch_sum = roundNumber((parseFloat(unit_price) / parseFloat(qty)));
						$("#batch_sum_"+id).val(convertIntoLocalFormat(roundNumber(batch_sum)));	
					}else{
						total_amount = roundNumber((parseFloat(unit_price) * parseFloat(qty)));
						$("#batch_sum_"+id).val(convertIntoLocalFormat(roundNumber(unit_price)));		
					}	
				/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/	 
				
				apply_tax = $('#apply_tax').val();
				if(apply_tax == 'N'){
					tax = 0;
				}else{
					tax = roundNumber((parseFloat(total_amount) * parseInt(percentage))/ 100);
				}
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!	
					discount_tax = roundNumber((parseFloat(discount_amount) * parseInt(percentage))/ 100);
					discount_amount = (parseFloat(discount_amount)+parseFloat(discount_tax));
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
				
				if(total_amount < 0){
					gross_amount = roundNumber(parseFloat(total_amount) + parseFloat(discount_amount) + parseFloat(tax));
				}else{
					gross_amount = roundNumber(parseFloat(total_amount) - parseFloat(discount_amount) + parseFloat(tax));	
				}
				
				$("#gross_amount_"+id).val(convertIntoLocalFormat(roundNumber(gross_amount)));
				
				// BUG: 0022671  BY:054  04 Oct 2014 
				$("#edit_gross_amount_"+id).html(convertIntoLocalFormat(roundNumber(gross_amount)));
				
				if($('#customer_product_line').length>0){
					$("#label_gross_amount_"+id).html(convertIntoLocalFormat(roundNumber(gross_amount)));
					
					$("#label_vat_level_"+id).html(convertIntoLocalFormat(roundNumber(percentage)));
				}
				
				getSummaryLineCalculation('no_calculation');
			}
		/***** #024 28-03-2015 #28322, Minor bugs ****/
	}
/***** #024 22-07-2016 #35451, BE > Fwd: Inventory refill and calculations > REFILL INVENTORY ****/	

function getSummaryLineCalculation(calculation)
{
	var obj_qty = new Array();
	var obj_vat = new Array();
	var obj_discount = new Array();
	//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
		var obj_discount_amount = new Array();
	//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			
	var obj_unit_price = new Array();
	/*var obj_percentage = new Array();*/
	var obj_gross_amount = new Array(); /* Gross amount of line*/
	
	var final_gross_amount = 0;
	var final_vat_amount = 0;
	var final_discount = 0;
	var final_net_amount = 0; 
	var final_tax = 0; 
	var final_taxable_amount = 0;
	var invoice_fee = 0;
	var invoice_vat = 0; 
	var sub_total = 0;
	
	var fobj = document.getElementById('frmNewInvoice');
	if(fobj != null){
		for(var i = 0;i < fobj.elements.length;i++) 
		{
			els = fobj.elements[i];  
			fv = els.value;			
			fn = els.name;
			fd = els.disabled;
			
			if(fd){
				continue;
			}
			
			switch(fn)
			{
				case 'invoiceProduct.product_quantity[]':
				case 'salesProduct.product_quantity[]':
					fv = fv.trim();
					obj_qty.push(fv) ;
					break;
				case 'invoiceProduct.discount[]':
				case 'salesProduct.discount[]':
					fv = convertIntoStandardFormat(fv.trim());
					obj_discount.push(fv);
					break;
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
					case 'invoiceProduct.discount_amount[]':
					case 'salesProduct.discount_amount[]':
						fv = convertIntoStandardFormat(fv.trim());
						obj_discount_amount.push(fv);
						break;
				//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!				
				case 'invoiceProduct.product_unitPrice[]':
				case 'salesProduct.product_unitPrice[]':
					fv = convertIntoStandardFormat(fv.trim());
					obj_unit_price.push(fv);
					break;
				case 'invoiceProduct.product_unitPrice[]':
				case 'salesProduct.vat_level[]':
				case 'invoiceProduct.vat_level[]':	
					
					fv = (els.selectedIndex > -1 )?els.options[els.selectedIndex].text:'';
					
					fv = fv.trim();
					obj_vat.push(fv);
					break;
				case 'invoiceProduct.product_unitPrice[]':
				case 'salesProduct.total[]':
					fv = convertIntoStandardFormat(fv.trim());
					obj_gross_amount.push(fv);
					break;
			}
		}
	}

	var vat_show = new Array();
	var vat_level_arr = new Array();
	var apply_tax = $('#apply_tax').val();
	
	if(apply_tax == 'Y'){
		
		if($('.class_sale_product_tax').length > 0){
			$(".class_sale_product_tax").show();  
		}
		if($('.class_invoice_product_tax').length > 0){
			$(".class_invoice_product_tax").show();  
		}
		
	}else{
		if($('.class_sale_product_tax').length > 0){
			$(".class_sale_product_tax").hide();  
		}
		if($('.class_invoice_product_tax').length > 0){
			$(".class_invoice_product_tax").hide();  
		}
	}
	
	for(var i = 0;i < obj_qty.length;i++) 
	{
		if(!obj_qty[i])
			continue;
	
		// Quantity
		var qty = obj_qty[i];
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
			qty = convertIntoStandardFormat(qty.trim());
			if(!IsNumeric(qty) )
				qty = 0;
			qty = parseFloat(qty);
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
		
		//Unit price
		var unit_price = obj_unit_price[i];
		if(!IsNumeric(unit_price) )
			unit_price = 0;
		unit_price = parseFloat(unit_price);
		
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
			// Discount
			/* var discount = obj_discount[i];
			if(!IsNumeric(discount))
				discount = 0;
			discount = parseFloat(discount); */
			
			// Discount amount
			var discount_amount = obj_discount_amount[i];
			if(!IsNumeric(discount_amount))
				discount_amount = 0;
			discount_amount = parseFloat(discount_amount);
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			
		
		// percentage
		var percentage = obj_vat[i];
		if(!IsNumeric(percentage) || percentage == '-')
			percentage = 0;
		percentage = parseFloat(percentage);
		
		taxable_amount = 0;
		//Line calculation
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
			line_net_amount = roundNumber((parseFloat(unit_price) * parseFloat(qty))); 
		/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			
			//discount = ((parseFloat(discount_amount)*100)/(parseFloat(line_net_amount))); 
			if(parseFloat(line_net_amount) < 0){
				taxable_amount = parseFloat(line_net_amount) - (Math.abs(discount_amount) * -1);
			}else{
				taxable_amount = parseFloat(line_net_amount) - parseFloat(discount_amount);
			}
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			

		if(apply_tax == 'N'){
			tax = 0;
		}else{
			tax = roundNumber((parseFloat(taxable_amount)  * parseInt(percentage))/ 100);
		}

		if(tax != '0' && tax != '')
		{
			vat_show.push(percentage);
			vat_level_arr.push(taxable_amount);
			$('#vat_'+i).val(tax);
		}
		
		//line_net_amount = parseFloat(line_net_amount) + parseFloat(tax);
	
		//Summary	
		final_taxable_amount = parseFloat(final_taxable_amount) + parseFloat(taxable_amount);
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!		
			final_discount = parseFloat(final_discount) + parseFloat(discount_amount);
		//024 20-04-2015 #29047, bengine(ERP) > URGENT: Severe error when accepting quote!			
		final_net_amount = parseFloat(final_net_amount) + parseFloat(line_net_amount);
		final_tax = parseFloat(final_tax) + parseFloat(tax);
	}
	
	final_discount = roundNumber(final_discount);
	final_net_amount = roundNumber(final_net_amount);
	final_tax = roundNumber(final_tax);
	final_gross_amount = parseFloat(final_taxable_amount) + parseFloat(final_tax);
	
	// Show summary
	$("#invoice_net_amount").html(convertIntoLocalFormat(roundNumber(final_net_amount)));
	$("#invoice_total_mva").html(convertIntoLocalFormat(roundNumber(final_tax)));
	$("#invoice_total_discount").html(convertIntoLocalFormat(roundNumber(final_discount)));
	
	
	if($("#calculate_round_off").length && $("#round_off").length && $("#round_off_value").length && $("#round_off_value").val())
	{
		var round_off_value = $("#round_off_value").val().trim();
		if(round_off_value && round_off_value != null){
			final_gross_amount = getRoundOff(final_gross_amount, round_off_value);
		}
	}else if($("#calculate_round_off").length && $("#round_off").length){
		$("#calculate_round_off").html(convertIntoLocalFormat(parseFloat(0)));
		$("#round_off").val(parseFloat(0));
		//final_gross_amount = final_net_amount;
	}
	
	$("#invoice_gross_amount").html(convertIntoLocalFormat(roundNumber(final_gross_amount)));
	
	$("#net_amount").val((roundNumber(final_net_amount)));
	$("#total_tax").val((roundNumber(final_tax)));
	$("#total_discount").val((roundNumber(final_discount)));
	$("#gross_amount").val((roundNumber(final_gross_amount)));
	
	performTaxCalculation(vat_level_arr, vat_show, calculation);	
}

function performTaxCalculation(vat_level_arr, vat_show, calculation)
{
	  var distinct_total = new Array();
	  var distinct_vat = new Array();
	  var base_amount = '0';
	  
	 
	  for(var i=0;i<vat_show.length;i++)
	  {
		  if(vat_show[i] == 'undefined' || vat_show[i] == null )
		  {
			  continue;
		  }
		
		  var a = vat_show[i];
		  var	flag = '0';
		  for(j=0;j<distinct_vat.length;j++)
		  {
			if(distinct_vat[j] == a)
			{
				flag = '1';
				break;
			}
		  }
		  if(flag == '1')
		  {
			distinct_total[a] = parseFloat(distinct_total[a]) + parseFloat(vat_level_arr[i]);
		  }
		  else
		  { 		
			  
			distinct_total[a] = parseFloat(vat_level_arr[i]);
			distinct_vat.push(vat_show[i]);
		  }
	  }
	  
	  
	  var tab = '';
	  var tr = "";
	  var outgoing_vat =  $('#trans_outgoing_vat').length > 0 ? $('#trans_outgoing_vat').val():'Outgoing vat';
	  for(var i=0;i<distinct_total.length;i++)
	  {
		  if(distinct_total[i] == 'undefined' || distinct_total[i] == null || distinct_total[i] == '0')
		  {
			  continue;
		  }
		  tr += "<tr><td class=''>"+outgoing_vat+"</td>";
		  tr += "<td class='' >"+i+"&nbsp;%</td>";
		  tr += "<td class='' style='text-align:right' >kr "+convertIntoLocalFormat(roundNumber(distinct_total[i]))+"</td>";
		  base_amount = parseFloat(base_amount) + parseFloat(distinct_total[i]);
		  var cal_vat = (parseFloat(i)/100)*parseFloat(distinct_total[i]);
		  cal_vat = roundNumber(cal_vat); 

		  tr += "<td class='' style='text-align:right' >kr "+convertIntoLocalFormat(cal_vat)+"</td></tr>";
	  }
	 
	  base_amount =  roundNumber(base_amount);
	  /*if(document.getElementById("cal_taxable_amount"))
		  document.getElementById("cal_taxable_amount").innerHTML = convertIntoLocalFormat(base_amount);
	  document.getElementById("taxable_amount").value = base_amount; */
	  if(tr == ''){
		  $('#perform_vat_calculation').parent().parent().parent().hide();
	  }else{
		  if(calculation == '' || calculation == undefined){
			document.getElementById("perform_vat_calculation").innerHTML = tab+tr;
			$('#perform_vat_calculation').parent().parent().parent().show();
		  }	
	  }
}

function getRoundOff(gross_amount, round_off_value)
{
	var from_page = 'inv';
	 if(gross_amount < 0)
		 from_page = 'cr';
	
	 if(from_page == 'cr')
	 {
		var act_amt = gross_amount;
		gross_amount = Math.abs(gross_amount);
	 }
	
	 round_off_value = 1 / round_off_value;
	 var round_gross_value = Math.round(gross_amount*round_off_value)/round_off_value;

	 var round_off = round_gross_value - gross_amount;
	 round_gross_value = round_gross_value.toFixed(2);
	 round_off = round_off.toFixed(2);
	
	 // for credit memo only
	 if(from_page == 'cr')
	 {
	 	round_off = -parseFloat(round_off);
		round_off = round_off.toFixed(2);
		if(act_amt < 0)
		{
			round_gross_value = -parseFloat(round_gross_value);
		}
	 }

	$("#calculate_round_off").html(convertIntoLocalFormat(round_off));
	$("#round_off").val(round_off);
	
	 return round_gross_value;
}

function convertIntoLocalFormat(inst_val)
{
	var num_format = ',== ';
	if(document.getElementById('site_num_format'))
		num_format = document.getElementById('site_num_format').value;

	var t = ' ';
	var d = ',';
	var res_fom = num_format.split('==');
	if(res_fom[0] != '' && res_fom[0] != undefined )
		d = res_fom[0];
	
	if(res_fom[1] != '' && res_fom[0] != undefined)
		t = res_fom[1];		
	
	var con_num = numberFormat(inst_val, 2, d, t);
	 
	return con_num;
}

function formatDate(date,format) {
	format=format+"";
	var result="";
	var i_format=0;
	var c="";
	var token="";
	var y=date.getYear()+"";
	var M=date.getMonth()+1;
	var d=date.getDate();
	var E=date.getDay();
	var H=date.getHours();
	var m=date.getMinutes();
	var s=date.getSeconds();
	var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
	// Convert real date parts into formatted versions
	var value=new Object();
	if (y.length < 4) {y=""+(y-0+1900);}
	value["y"]=""+y;
	value["yyyy"]=y;
	value["yy"]=y.substring(2,4);
	value["M"]=M;
	value["MM"]=LZ(M);
	value["MMM"]=MONTH_NAMES[M-1];
	value["NNN"]=MONTH_NAMES[M+11];
	value["d"]=d;
	value["dd"]=LZ(d);
	value["E"]=DAY_NAMES[E+7];
	value["EE"]=DAY_NAMES[E];
	value["H"]=H;
	value["HH"]=LZ(H);
	if (H==0){value["h"]=12;}
	else if (H>12){value["h"]=H-12;}
	else {value["h"]=H;}
	value["hh"]=LZ(value["h"]);
	if (H>11){value["K"]=H-12;} else {value["K"]=H;}
	value["k"]=H+1;
	value["KK"]=LZ(value["K"]);
	value["kk"]=LZ(value["k"]);
	if (H > 11) { value["a"]="PM"; }
	else { value["a"]="AM"; }
	value["m"]=m;
	value["mm"]=LZ(m);
	value["s"]=s;
	value["ss"]=LZ(s);
	while (i_format < format.length) {
		c=format.charAt(i_format);
		token="";
		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
			}
		if (value[token] != null) { result=result + value[token]; }
		else { result=result + token; }
		}
	return result;
}
	
// ------------------------------------------------------------------
// Utility functions for parsing in getDateFromFormat()
// ------------------------------------------------------------------
function _isInteger(val) {
	var digits="1234567890";
	for (var i=0; i < val.length; i++) {
		if (digits.indexOf(val.charAt(i))==-1) { return false; }
		}
	return true;
	}
	function _getInt(str,i,minlength,maxlength) {
	for (var x=maxlength; x>=minlength; x--) {
		var token=str.substring(i,i+x);
		if (token.length < minlength) { return null; }
		if (_isInteger(token)) { return token; }
		}
	return null;
	}


function numberFormat(number, decimals, dec_point, thousands_sep) 
{
	var n = !isFinite(+number) ? 0 : +number, 
	prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	s = '',
	
	toFixedFix = function (n, prec) {
		 var k = Math.pow(10, prec);
		 return '' + Math.round(n * k) / k;        
	};
	
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);    
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}    
	return s.join(dec);
}

function convertIntoStandardFormat(inst_val)
{
	var num_format = ',==.';
	if(document.getElementById('site_num_format'))
		num_format = document.getElementById('site_num_format').value;

	var t = ' ';
	var d = ',';
	var res_fom = num_format.split('==');
	if(res_fom[0] != '' && res_fom[0] != undefined )
		d = res_fom[0];
	
	if(res_fom[1] != '' && res_fom[0] != undefined)
		t = res_fom[1];		
	
	var number = is_undefined(inst_val);
	number = number.split(t).join("");
	number = number.split(" ").join("");
	
	var dot = number.indexOf(d); // locate decmal 
	if(dot >0)
		number = number.split(d).join(".");
	
	if(isNaN(number))
		return 0;
	return roundNumber(number);
}

function roundNumber(num)
{
	if(num > 0)
	{
		var result = Math.round(num*100)/100;
		result = result.toFixed(2);
		return result;
	}
	else
	{
		num = Math.abs(num);
		var result = Math.round(num*100)/100;
		result = -parseFloat(result);
		return result.toFixed(2);
		}
}
	
function IsNumeric(strString)
{
	var strValidChars = "0123456789.-";
	var strChar;
	var blnResult = true;


	if (strString == '' || strString == null || strString == 'undefined' || strString.length == 0) return false;

	//  test strString consists of valid characters listed above
	for (i = 0; i < strString.length && blnResult == true; i++)
	{
		strChar = strString.charAt(i);
		if (strValidChars.indexOf(strChar) == -1)
		{
			blnResult = false;
		}
	}
	return blnResult;
}
	
function roundNumber(num)
{
	if(num > 0)
	{
		var result = Math.round(num*100)/100;
		result = result.toFixed(2);
		return result;
	}
	else
	{
		num = Math.abs(num);
		var result = Math.round(num*100)/100;
		result = -parseFloat(result);
		return result.toFixed(2);
	}
}
	
function isNumericKeyStroke(e)
{
	var returnValue = false;
	var keyCode= '';
	if(window.event)
		  keyCode = window.event.keyCode;     //IE
	else
		  keyCode = e.which;     //firefox

	if ( ((keyCode >= 48) && (keyCode <= 57)) || ((keyCode >= 96) && (keyCode <= 105)) || // All numerics
		   (keyCode ==  8) ||     // Backspace
		    (keyCode ==  37) || 
			(keyCode ==  46) || 
			 (keyCode ==  39) || 
		   (keyCode == 13) )
		   {// Carriage Return
		 returnValue = true;
		 }
	 return returnValue;
 }


function assign_email_address()
{
	 var objsend_copy = document.getElementById('send_invoice_copy_to');
	 var email = document.getElementById('hidden_email').value;
	 var obj_email = document.getElementById('email_address');
	 var invoice = document.getElementById('invoices_method').value;

	 if(objsend_copy.checked == true)
	 {
		 obj_email.readOnly = false;
		 obj_email.value = email;
	 } 
	 else
	 {
		obj_email.readOnly = true;
		obj_email.value = '';
	 }
}

function show_hide_due_date(flag, id)
{
	var obj_date = document.getElementById(id);
	if(flag == 'Y')
		obj_date.style.display = '';
	else
		obj_date.style.display = 'none';
}

function show_hide_address(val)
{
	 var obj_customer = document.getElementById('customer_address');
	 var obj_invoice = document.getElementById('invoice_address');
	 var obj_custom = document.getElementById('custom_address');
	 iMethod =  $('#invoices_method').val();
	 iMethod = iMethod.split("##"); 
	 method = iMethod[1];
	 
	 if(val == 'CA')
	 {
		obj_customer.style.display = '';
		obj_invoice.style.display = 'none';
		obj_custom.style.display = 'none';
	 }
	 else if(val == 'IA')
	 {
		obj_customer.style.display = 'none';
		obj_invoice.style.display = '';
		obj_custom.style.display = 'none';
	 }else{
		 obj_customer.style.display = 'none';
		 obj_invoice.style.display = 'none';
		 obj_custom.style.display = '';
	 }
	 
	 if(method == 'email'){
		 $('.invoice_email').show();
		 $('.invoice_address').hide();
	 }else if(method == 'postal'){
		 $('.invoice_email').hide();
		 $('.invoice_address').show();
	 }else{
		 $('.invoice_email').show();
		 $('.invoice_address').show();
	 }
}

function distribution_by_customer(obj_field)
{
	if(obj_field.checked)
	{
		//document.getElementById('invoices_method').disabled = false;
		$('#invoices_method option:not(:selected)').attr('disabled', false);
		
		document.getElementById('address_selected').disabled = false;
		document.getElementById('address_selected').value = 'CA';
		//document.getElementById('cal_drop_down').style.display="";
		//document.getElementById('cal_total_amount').style.display="";
		//document.getElementById('cal_copy_price').style.display="";
		//document.getElementById('heading_total_amount').style.display="";
	}
	else
	{
		//document.getElementById('invoices_method').disabled = true;
		$('#invoices_method option:not(:selected)').attr('disabled', true);
		document.getElementById('address_selected').value = 'IA';
		document.getElementById('address_selected').disabled = true;
		//document.getElementById('cal_drop_down').style.display="none";
		//document.getElementById('cal_total_amount').style.display="none";
		//document.getElementById('cal_copy_price').style.display="none";
		//document.getElementById('heading_total_amount').style.display="none";
	}
}

function validateMass(obj_field, fun)
{

	var val = obj_field.value;
	var field_id = obj_field.id;
	switch(fun)
	{
		case 'validQty': //alert(val);
			//if(!isInteger(val))
			if(!val.toString().match(/(^\d+$)|(^\d+\.\d+$)|(^\d+\,\d+$)/))
			{
				obj_field.value = '1';
				setTimeout("document.getElementById('"+field_id+"').focus()", 0.5);
 				return false;
			}
		break;
		case 'validPrice':
		case 'validDisc':
			
		if(!is_valid_number_format(obj_field))
		{
			obj_field.value = '0';
			setTimeout("document.getElementById('"+field_id+"').focus()", 0.5);
			return false;
		}
		break;
		default :
			return false;
	}
 }

function is_valid_number_format(obj_fileds)
{
	var num_format = ',==.';
	if(document.getElementById('site_num_format')){
		num_format = document.getElementById('site_num_format').value;
	}


	var t = ' ';
	var d = ',';
	var res_fom = num_format.split('==');
	if(res_fom[0] != '' && res_fom[0] != undefined ){
		d = res_fom[0];
	}
	
	if(res_fom[1] != '' && res_fom[0] != undefined){
		t = res_fom[1];		
	}
	
	var number = obj_fileds.value;
	number = number.split(t).join("");
	number = number.split(" ").join("");

	var dot = number.indexOf(d); // locate decmal
	if(dot >0){
		number = number.split(d).join(".");
	}
	
	if(isNaN(number)){
		return false;
	}
	
	return true;
}


function calculate_mark_paid(index)
{
	
	if(document.getElementById('check_'+index))
	{
		if(document.getElementById('check_'+index).checked == false)
			return;
	}
	
	var obj_interest_fee = new Array();
	var obj_late_fee = new Array();
	var obj_invoice_balance = new Array();
	var total_interest_fee = 0;
	var total_late_fee = 0;
	var total_invoice_balance = 0;
	var fobj = document.getElementById('frmPayment');

	// for paid amount in paiment register
	if(document.getElementById("paidamount_"+index))
	{
		var paid_amount = 0;
		var balance = 0;
		var interest = 0;
		var fee = 0;
		paid_amount = convertIntoStandardFormat(document.getElementById("balance_"+index).value);
		if(paid_amount == '')
			paid_amount = 0;

		interest = convertIntoStandardFormat(document.getElementById('interest_'+index).value);
		fee = convertIntoStandardFormat(document.getElementById('fee_'+index).value);
		paid_amount = parseFloat(paid_amount)+parseFloat(interest)+parseFloat(fee);
		document.getElementById("paidamount_"+index).innerHTML = convertIntoLocalFormat(paid_amount);
	}

	for(var i = 0;i < fobj.elements.length;i++) 
	{
		els = fobj.elements[i];  
		fv = els.value;  
		fn = els.name;
		id = els.id;
		var index = "";
		if(id)
		{
			var array_index = id.split("_");
			index = array_index[1];
		}
		var a = '';
		switch(fn)
		{
			
			case 'interest_fee[]':
				fv = convertIntoStandardFormat(fv.trim());
				if(document.getElementById("check_"+index).checked == true)
					obj_interest_fee.push(fv) ;
				break;		 
			case 'late_fee[]':
				fv = convertIntoStandardFormat(fv.trim());
				if(document.getElementById("check_"+index).checked == true)
				obj_late_fee.push(fv);
				break;
			case 'invoice_balance[]':
				fv = convertIntoStandardFormat(fv.trim());
				if(document.getElementById("check_"+index).checked == true)
					obj_invoice_balance.push(fv);
					break;
		}
	}
	for(var i = 0;i < obj_interest_fee.length;i++) 
	{
		if(!obj_interest_fee[i])
		{
			continue;
		}
		var interest_fee = parseFloat(obj_interest_fee[i]);
		if(!IsNumeric(interest_fee))
		{
			interest_fee = 0;
		}
		total_interest_fee = parseFloat(total_interest_fee)+parseFloat(interest_fee);
		
		var late_fee = parseFloat(obj_late_fee[i]);
		if(!IsNumeric(late_fee))
		{
			late_fee = 0;
		}


		total_late_fee = parseFloat(total_late_fee)+parseFloat(late_fee);

		var invoice_balance = parseFloat(obj_invoice_balance[i]);
		if(!IsNumeric(invoice_balance))
		{
			invoice_balance = 0;
		}
		
			total_invoice_balance = parseFloat(total_invoice_balance)+parseFloat(invoice_balance);
		}
	document.getElementById("amount_late_fee").innerHTML = convertIntoLocalFormat(roundNumber(total_late_fee));
	document.getElementById("amount_interest_fee").innerHTML = convertIntoLocalFormat(roundNumber(total_interest_fee));
	document.getElementById("amount_out_standing_balance").innerHTML = convertIntoLocalFormat(roundNumber(total_invoice_balance));
	document.getElementById("total_paid_amount").innerHTML = convertIntoLocalFormat(roundNumber(total_invoice_balance+total_late_fee+total_interest_fee));
}

function recalculate_summary(obj, index)
{
	var sum_balance = document.getElementById('amount_out_standing_balance');
	var sum_late_fee = document.getElementById('amount_late_fee');
	var sum_interest = document.getElementById('amount_interest_fee');

	var balance = convertIntoStandardFormat(document.getElementById('balance_'+index).value); 
	var fee = convertIntoStandardFormat(document.getElementById('fee_'+index).value); 
	var interest = convertIntoStandardFormat(document.getElementById('interest_'+index).value);
	var total_paid_amount = convertIntoStandardFormat(document.getElementById("total_paid_amount").innerHTML);
	
	if(obj.checked == true)
	{
		if(document.getElementById('balance_'+index))
		{
			sum_late_fee.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_late_fee.innerHTML)) + parseFloat(fee))); 
			sum_interest.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_interest.innerHTML)) + parseFloat(interest))); 
			sum_balance.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_balance.innerHTML)) + parseFloat(balance)));
			document.getElementById("paidamount_"+index).innerHTML = convertIntoLocalFormat(parseFloat(balance)+parseFloat(fee)+parseFloat(interest));

			var cal_paid_amount = parseFloat(total_paid_amount)+parseFloat(fee)+parseFloat(interest)+parseFloat(balance);
			document.getElementById("total_paid_amount").innerHTML = convertIntoLocalFormat(roundNumber(cal_paid_amount));
		}
	}
	else 
	{
		if(document.getElementById('balance_'+index))
		{
			sum_late_fee.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_late_fee.innerHTML)) - parseFloat(fee))); 
			sum_interest.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_interest.innerHTML)) - parseFloat(interest))); 
			sum_balance.innerHTML = convertIntoLocalFormat(roundNumber(parseFloat(convertIntoStandardFormat(sum_balance.innerHTML)) - parseFloat(balance)));
			document.getElementById("paidamount_"+index).innerHTML = convertIntoLocalFormat('0.00');
			
			var cal_paid_amount = parseFloat(total_paid_amount)-parseFloat(fee)-parseFloat(interest)-parseFloat(balance);
			document.getElementById("total_paid_amount").innerHTML = convertIntoLocalFormat(roundNumber(cal_paid_amount));
		}
	}
}

function calculate_out_total_amount(amount) 
{
	var obj_out_standing_balance = new Array();
	var total_out_standing_balance = amount;
	var fobj = document.getElementById('frm_link_journals');

	for(var i = 0;i < fobj.elements.length;i++) 
	{
		els = fobj.elements[i];  
		fv = els.value;  
		fn = els.name;
		if(els.type== 'checkbox' && els.checked == true && fn == 'link_invoice[]')
		{
			 var check_val = fv.split('::');
			 obj_out_standing_balance.push(check_val[0]);
		}
	}

 	for(var i = 0;i < obj_out_standing_balance.length;i++) 
    {
		if(!obj_out_standing_balance[i]){
			continue;
		}
		
		
		var out_standing_balance = obj_out_standing_balance[i];
		
		if(!IsNumeric(out_standing_balance))
		{	
			out_standing_balance = 0;
		}

		total_out_standing_balance = parseFloat(total_out_standing_balance)+parseFloat(out_standing_balance);
		
	}
	 	
	document.getElementById("total_linked_hidden").value = total_out_standing_balance;

	total_out_standing_balance =  Math.round(total_out_standing_balance*100)/100;
	
	// put total in hidden element
	document.getElementById("total_linked_hidden").value = total_out_standing_balance;
	if(total_out_standing_balance < 0){
		document.getElementById("refund_btn").style.display = '';
		total_out_standing_balance = total_out_standing_balance;
	}else{
		document.getElementById("refund_btn").style.display = 'none';
	}
	document.getElementById("total_linked_amount").innerHTML = convertIntoLocalFormat(roundNumber(total_out_standing_balance));
}

function calculate_total_refund()//change_balance_id, constant_balance, balance)
{
	var obj_out_standing_balance = new Array();
	var obj_late_fee_arr = new Array();
	var obj_intrest_fee_arr = new Array();
	var obj_current_balance_arr = new Array();
	var obj_invoice_id_arr = new Array();
	
	var total_out_standing_balance = 0;
	var row_amount = 0;
	var fobj = document.getElementById('frm_refund_details');
	//balance = convertIntoStandardFormat(balance);
	
	for(var i = 0;i < fobj.elements.length;i++) 
	{
		els = fobj.elements[i];  
		fv = els.value;  
		fn = els.name; 
		
		dk = 'x';
		if($('#'+els.id).length){
			dk = $('#'+els.id).attr('data-key'); 
		}
		
		switch(fn)
		{ 
			case "out_standing_balance_arr["+dk+"]":
				obj_out_standing_balance.push(fv) ;
			break;
			case "late_fee_arr["+dk+"]":
				obj_late_fee_arr.push(fv) ;
			break;
			case "intrest_fee_arr["+dk+"]":
				obj_intrest_fee_arr.push(fv) ;
			break;
			case "current_balance_arr["+dk+"]":
				obj_current_balance_arr.push(fv) ;
			break;
			
			case "invoice_id_arr["+dk+"]":
				obj_invoice_id_arr.push(els.checked) ;
			break;	
		}
	}
	
	actual_amt = 0;
	for(var i = 0;i < obj_out_standing_balance.length;i++) 
	{
		if(!obj_invoice_id_arr[i]){
			continue;
		}
		
		if(!obj_out_standing_balance[i])
		{
			continue;
		}
		
		// Refund amount
		var out_standing_balance = convertIntoStandardFormat(obj_out_standing_balance[i]);
		if(!IsNumeric(out_standing_balance))
		{
			out_standing_balance = 0;
		}
		
		//Late fee
		var late_fee = convertIntoStandardFormat(obj_late_fee_arr[i]);
		if(!IsNumeric(late_fee))
		{
			late_fee = 0;
		}
		
		// Intrest fee
		var intrest_fee = convertIntoStandardFormat(obj_intrest_fee_arr[i]);
		if(!IsNumeric(intrest_fee))
		{
			intrest_fee = 0;
		}
		
		// Current balance
		var current_balance = convertIntoStandardFormat(obj_current_balance_arr[i]);
		if(!IsNumeric(current_balance))
		{
			current_balance = 0;
		}
		actual_amt = parseFloat(actual_amt) + parseFloat(current_balance);
		
		total_refund = (parseFloat(out_standing_balance) + parseFloat(intrest_fee) + parseFloat(late_fee));
		row_amount = parseFloat(current_balance) + parseFloat(total_refund);
		total_out_standing_balance = parseFloat(total_out_standing_balance) + parseFloat(total_refund);
		
		if(row_amount < 0)
		{
			row_amount = "<font color='red'>"+convertIntoLocalFormat(row_amount)+"</font>";
		}else{
			row_amount = convertIntoLocalFormat(row_amount);
		}
		
		document.getElementById('change_balance_'+i).innerHTML = row_amount;
		
	}
	
	actual_amt = roundNumber(actual_amt);
	$('#actual_amt').val(actual_amt); 
	$('#total_actual_amount').html(convertIntoLocalFormat(actual_amt));
	
	//actual_amt = $('#actual_amt').val();
	if(parseFloat(total_out_standing_balance) + parseFloat(actual_amt) != 0 || parseFloat(actual_amt) == 0){
		$('#submit_refund').hide();
		$('#div_from_account').hide();
		$('#div_to_account').hide();
		$('#div_payment_method').hide();
	}else{
		$('#submit_refund').show();
		$('#div_from_account').show();
		$('#div_to_account').show();
		$('#div_payment_method').show();
	}
	
	total_out_standing_balance = roundNumber(total_out_standing_balance);
	if(total_out_standing_balance < 0)
	{
		total_out_standing_balance = "<font color='red'>"+convertIntoLocalFormat(total_out_standing_balance)+"</font>";
	}
	else
	{
		total_out_standing_balance = convertIntoLocalFormat(total_out_standing_balance);
	}	 
	
	
	
	//document.getElementById(change_balance_id).innerHTML = row_amount;
	document.getElementById("total_refund_amount").innerHTML = total_out_standing_balance;
}

function makeDropDownEditable(target,data,default_value){
	
	if($('#'+target).length > 0){
		$('#'+target).editable({
	    	showbuttons: true,
		    unsavedclass: null,
		    type: 'select',
	        value: default_value,
	        source: data,
            inputclass: 'm-wrap invoice_your_reference',
          
	    }); 
	}
}


function verify_refund_amount(amount,refund_amount) 
{
	var total_out_standing_balance = amount;
	refund_amount = parseFloat(convertIntoStandardFormat(refund_amount));
	
	total_out_standing_balance = parseFloat(total_out_standing_balance);
	total_out_standing_balance =  Math.round(total_out_standing_balance*100)/100;
	refund_amount =  Math.round(refund_amount*100)/100;
	
	if((total_out_standing_balance + refund_amount) == 0){
		document.getElementById("refund_btn").style.display = '';
		total_out_standing_balance = total_out_standing_balance;
	}else{
		document.getElementById("refund_btn").style.display = 'none';
	}
}

/* #BUGID: 19832,19831, By: 054, ON: 19 JUNE 2014 */
function manageTab() {
	$('.tabDisable').keyup(function(e){ 	
		  if (e.keyCode == 9) {
			$('.tabDisable').attr('tabindex','-1');	
		  }
		 
	});

	/*$('.tabEnable').keyup(function(e){ 	
		  if (e.keyCode == 9) {			 
			$('.tabEnable').attr('tabindex','0');	
		  }
		 
	});*/
}


function calculateDiscount(type,line_key,from_line_total){
	
	// Unit price
	var unit_price = document.getElementById("unit_price_"+line_key).value;  
	unit_price = convertIntoStandardFormat(unit_price.trim());
	if(!IsNumeric(unit_price)){
		unit_price = '0';
	}
	unit_price = parseFloat(unit_price);
	
	// Quantity
	var qty = document.getElementById("qty_"+line_key).value;
	qty = convertIntoStandardFormat(qty.trim());
	if(!IsNumeric(qty)){
		qty = '0';
	}
	qty = parseFloat(qty);
	qty = Math.abs(qty);
	total_amount = parseInt(qty)*parseFloat(unit_price);
	
	if(type == 'amount'){
		
		// Discount amount
		var discount_amount = document.getElementById("discount_amount_"+line_key).value;
		discount_amount = convertIntoStandardFormat(discount_amount.trim());
		if(!IsNumeric(discount_amount)){
			discount_amount = '0';
		}
		discount_amount = parseFloat(discount_amount); 
		
		discount_percentage =  (parseFloat(discount_amount)/parseFloat(total_amount))*parseFloat(100);
		$('#discount_'+line_key).val(convertIntoLocalFormat(roundNumber(discount_percentage)));
	}else{
		// Discount percentage
		var discount = document.getElementById("discount_"+line_key).value;
		discount = convertIntoStandardFormat(discount.trim());
		if(!IsNumeric(discount)){
			discount = '0';
		}
		discount = parseFloat(discount);
		
		discount_amount =  (parseFloat(discount)*parseFloat(total_amount))/parseFloat(100); 
		$('#discount_amount_'+line_key).val(convertIntoLocalFormat(roundNumber(discount_amount)));
	}
	
	if(from_line_total != 'y'){
		calculateLineTotal('',line_key);
	}
	
}


function isTabbedEvent(e){
	if(window.event){
		  key = window.event.keyCode;     // IE
	}else{
		  key = e.which;     // firefox
	}
	if(key != 9){return false;}
	return true;
}

function reArrangeCalendarWidth()
{
	/*var CAL_WIDTH = 350;			// Default calendar width
	var CAL_MARGIN = 20;			//default margin
	
	wWindow = $(window).width();	// Window width
	wSidebar = $('#be_sidebar').width(); // sidebar width
	wWidget = $('#widget').width();		// Calendar widget width
	wWidget = parseFloat(wWidget) + parseFloat(30);

	
	
	$('#widget').css('float','');
	$('#calendars').css('float','');
	
	posSidebar = $('.page-sidebar').css('position');  // Position of side bar top/left
	mar_topWidget = $('#widget').css('margin-top');

	
	if(posSidebar == 'relative'){ // if sidebar is at top
		wSidebar = 0;
		
		if(wWindow > 600)
		{
			$('#calendars').css('width','65%');
			$('#widget').css('width','');
			$('#widget').css('float','left');
			//$('#calendars').css('float','right');
		}else{
			$('#widget').css('width',(parseFloat(wWindow) - parseFloat(20)));
			//$('.show_staff_calendar').css('width','');
		}
		
		$('.show_staff_calendar').css('width','');
		$('#calendars').css('width','');
		return;
	}
	$('#widget').css('width','400');
	if(mar_topWidget != '0px'){  // If widget is at bottom
		wWidget = 0;
		$('#calendar-box').css('width','100%');
	}
	
	
	
	wContent = parseFloat(wWindow) - parseFloat(wSidebar); // get display content width
	wCalendar = parseFloat(wContent) - parseFloat(wWidget);//
	wCalendar = parseFloat(wCalendar) - (parseFloat(33));
	
	calendarToshow = 1;
	extraSpace = 0;
	if(wWindow < CAL_WIDTH || wWindow < wCalendar){
		return;
	}
	
	var  TOTAL_CAL_SPACE = parseFloat(CAL_WIDTH) + parseFloat(CAL_MARGIN);
	total_cal_visible = $('.show_staff_calendar').length;
	nCalendars = parseFloat(wCalendar)/(parseFloat(TOTAL_CAL_SPACE));
	
	if(total_cal_visible > nCalendars){
		
		calendarToshow = parseInt(Math.floor(nCalendars));
	}else{
		calendarToshow = total_cal_visible;
	}
	
	extraSpace = parseFloat(wCalendar) - (parseFloat(TOTAL_CAL_SPACE) * parseFloat(calendarToshow));
	if(extraSpace < 0){
		extraSpace = 0;
	}else{
		extraSpace =  parseFloat(extraSpace) - parseFloat(20);
	}
	extraSpace = parseFloat(extraSpace)/parseFloat(calendarToshow);
	newCalendars = parseFloat(CAL_WIDTH) + parseFloat(extraSpace);
		
	// new width
	mul = ((parseFloat(newCalendars) + parseFloat(CAL_MARGIN)) * parseFloat(calendarToshow));
	
	//console.log(mul +' -- '+ wCalendar);
	if(mul > wCalendar){
		if(calendarToshow > 1){
			calendarToshow = parseFloat(calendarToshow) - parseFloat(1);
			
			newCalendars = parseFloat(newCalendars) + (parseFloat(newCalendars)/parseFloat(calendarToshow));

			//newCalendars = parseFloat(newCalendars) - (parseFloat(10));
		}
	}
	
	//newCalendars = parseFloat(newCalendars) - (parseFloat(20)/parseFloat(calendarToshow));
	
	//console.log(wCalendar+' -- '+newCalendars+' -- '+calendarToshow+' -- '+extraSpace);
	
	$('#calendars').width(wCalendar); 
	//$('#calendars').css('float','right');
	
	$('.show_staff_calendar').width(newCalendars);*/
}

//018
function limitAmount(target,e){
	
	if(e.keyCode == 190 || e.keyCode == 188  || e.keyCode == 46){ //e.keyCode == 8
		return;
	}
	
	var limit = 8; //default limit
	var target_value = $(target).val(); 
	
	pos = target_value.indexOf(',');
	target_value = convertIntoStandardFormat(target_value.trim());
	if(!IsNumeric(target_value)){
		target_value = '0.0';
	}
	
	target_value = roundNumber(target_value);
	target_value_arr = target_value.split('.');
	if(target_value_arr[0].length > limit){
		
		target_value = target_value.substr(0,limit);
		if(pos != -1){
			target_value = Number(target_value+'.'+target_value_arr[1]);
			target_value = roundNumber(target_value);
			target_value = convertIntoLocalFormat(target_value);
		}
		$(target).val(target_value);
	}
}

//054
function limitPrice(target,max){
	
	 $(target).keypress(function (e) {
			if((max == 'undefined') || (max ==null) ) {
				var max = 9;
			}
			
			var len = $(this).val().replace(/[^0-9]/g,"").length;
			
			if((e.which == 44) || (e.which == 46)  || (e.which == 8)  || (e.which >= 48 && e.which <= 57) || (e.keyCode == 9)){ //e.keyCode == 8
			
				if (e.which < 0x20) {
				  // e.which < 0x20, then it's not a printable character
				  // e.which === 0 - Not a character
				  return; // Do nothing
				}

				if (len >= max) {
				  e.preventDefault();
				}
			}else {
				e.preventDefault();
			}

		  });
}

/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/
	function limitBundlePrice(target,max){
		$(target).keypress(function (e) {
			if((max == 'undefined') || (max ==null) ) {
				var max = 6;
			}
			var len = $(this).val().replace(/[^0-9]/g,"").length;
			if((e.which == 44) || (e.which == 46)  || (e.which == 8)  || (e.which >= 48 && e.which <= 57) || (e.keyCode == 9)){ //e.keyCode == 8
				if (e.which < 0x20) {
				  return;
				}
				if (len >= max) {
				  e.preventDefault();
				}
			}else {
				e.preventDefault();
			}

		});
	}
/***** #24 29-01-2015 #26403, Quantity on sales documents/product bundles > More feedback from the client ****/

//By 054
function limitNumbers(id,limit) {
	
	$(id).inputmask({ "mask": "9", "repeat": limit,"greedy": false});

}

//BUG:20833   By :054   24 JULY 2014 
 function deleteProductLines() {
		var i = 0, line_key = 0;var arrkey = new Array();
		 $('.product_rows').reverse().each (function(){
			
			if( $(this).children('td:first').find("input[name='salesProduct.product_id[]']").val() != '' || $(this).children('td:first').find("input[name='salesProduct.text_line[]']").val() != '') 
			{	
				return false;
			}
			else {
				var target = $(this).children('td:first').find("input[name='salesProduct.text_line[]']");
				var id = target.attr('id');
				var arr = id.split('_');
				var key = arr[arr.length-1];
				arrkey.push(key);
				//alert("key" + key);	
				$('#sales_product_line_'+key).remove();
				i++;
			}	
		 });
		 return i;
}
//054
function addProductLines(linecount,i) {
		 
		 if( i > linecount ) {
			var add_line_count = Math.abs(parseInt(i) - parseInt(linecount));
				if(add_line_count > 0) {
				for(count=0 ; count < add_line_count ; count++){
					add_new_product_line();
					
				}
			 }
		 }
 }
// reverse traversing 
jQuery.fn.reverse = function() {
		return this.pushStack(this.get().reverse());
};

/*BUG #21160  BY: 054   30 JULY 2014*/
function changeUnits(el,key,maxunits,includedunits) {
	if(el.checked ) {
		
		$('#included_units_'+ key).val('0');
		$('#max_units_'+ key).val('0');
		$('#included_units_'+ key).prop("readonly",true);
		$('#max_units_'+ key).prop("readonly",true);
	}
	else {
		$('#included_units_'+ key).val(includedunits);
		$('#max_units_'+ key).val(maxunits);
		$('#included_units_'+ key).removeAttr('readonly');
		$('#max_units_'+ key).removeAttr('readonly');
	}
}



// Save current focus node from nicEdit
var nicEditEndNode;

/*BUG #23653  BY: 024   19 NOV 2014*/
function add_place_holder()
{
	var place_holder = document.getElementById('PartnerMailPlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	//place_holder = '%'+place_holder+'%';
	
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/* #024, 19-11-14 */ 				
			var distribution = document.getElementById('PartnerMailDistribution').value;
			if(distribution=="sms"){
				focus_id = "#nb_body_text";
			}
			if(focus_id == 'nb_body') {
				focus_id = "#nb_body";			   
			}else if(focus_id == '#nb_body_text'){
				focus_id = "#nb_body_text";
			}
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
				/* #024 29-12-2015 #33264: BookingEngine > A few minor bugs here: */ 
					if(focus_id == '#nb_body'){
						var editor = $(focus_id).data("wysihtml5").editor;
						editor.composer.commands.exec("insertHTML", $.trim(place_holder));
					}else{
						$(focus_id).insertAtCaret($.trim(place_holder)); 
					}
				/* #024 29-12-2015 #33264: BookingEngine > A few minor bugs here: */	
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END

/*BUG #024 25-11-2014 #24082: Add place holders in all relevant popus */
function add_trigger_sms_placeholder()
{
	var place_holder = document.getElementById('PartnerMailPlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/**** #024 29-12-2104 #25213, Corrections ***/	
			$('#partnersLegalIntrestTextNb').click(function(){
				focus_id = "#partnersLegalIntrestTextNb";			
			})
			$('#partnersLegalIntrestTextEn').click(function(){
				focus_id = "#partnersLegalIntrestTextEn";			
			}) 
			$('#partnersInvoiceMessageNb').click(function(){
				focus_id = "#partnersInvoiceMessageNb";			
			}) 
			$('#partnersInvoiceMessageEn').click(function(){
				focus_id = "#partnersInvoiceMessageEn";			
			})  
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
			 	$(focus_id).insertAtCaret($.trim(place_holder)); 
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END


/*BUG #024 25-11-2014 #24082: Add place holders in all relevant popus */
function add_trigger_email_placeholder()
{
	var place_holder = document.getElementById('PartnerEmailPlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/* #024, 19-11-14 */ 				
			if(focus_id == '#TriggerCustomTextSms'){
				focus_id = "#TriggerCustomTextSms";
			}else if(focus_id == 'nicEdit-main') {
				focus_id = ".nicEdit-main";			   
			}
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
			 	$(focus_id).insertAtCaret($.trim(place_holder)); 
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END


/*BUG #024 25-11-2014 #24082: Add place holders in all relevant popus */
function add_trigger_template_placeholder()
{
	var place_holder = document.getElementById('PartnerTemplatePlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	
	
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/* #024, 19-11-14 */ 				
			var distribution = document.getElementById('PartnerMailDistribution').value;
			if(distribution=="sms"){
				focus_id = "#nb_body_text";
			}
			if(focus_id == 'nicEdit-main') {
				focus_id = ".nicEdit-main";			   
			}else if(focus_id == '#nb_body_text'){
				focus_id = "#nb_body_text";
			}
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
			 	$(focus_id).insertAtCaret($.trim(place_holder)); 
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END

/*BUG #024 13-01-2015 #25811: Placeholders missing from SMS template composition */
function add_simple_trigger_template_placeholder()
{
	var place_holder = document.getElementById('PartnerMailPlaceholders').value;
	if(place_holder == '')
		return false;
	
	var focus_id = document.getElementById('fc_holder_div').value;
	
	
	
	if(focus_id != '' ) {
		if (document.getSelection) {
			/* #024, 19-11-14 */ 				
			if(focus_id == '#TriggerCustomTextSms'){
				focus_id = "#TriggerCustomTextSms";
			}
			/* - */
			
			$(focus_id).attr("tabindex",-1).focus();
			sel = document.getSelection(); 

			if (sel.rangeCount >= 0 && focus_id.search('#') == '-1') {
				range = sel.getRangeAt(0); 

				// endNode = document.getElementsByClassName("nicEdit-main").item(0);
				if(nicEditEndNode) {
					endOffset = $("#fc_nicedit_offset").val();
					range.setEnd(nicEditEndNode,endOffset);
					range.setStart(nicEditEndNode,endOffset);

					//$("#fc_nicedit_offset").val(parseFloat(endOffset) + parseFloat(place_holder.length - 1));
				}

				range.deleteContents(); 
				//range.insertNode(document.createTextNode(' '+place_holder+' '));
				var textNode = document.createTextNode(' '+place_holder+' ');

				range.insertNode(textNode);
				range.setStartAfter(textNode);
				sel.removeAllRanges();
				sel.addRange(range);

				if(nicEditEndNode) {
					$(".nicEdit-main").trigger('click');
				}

			 }
			 else if (sel.rangeCount >= 0 && focus_id.search('#') == '0') {
			 	$(focus_id).insertAtCaret($.trim(place_holder)); 
			 }
		} 
		else {
			$(focus_id).append(' '+place_holder);		
			$(focus_id).attr("tabindex",-1).focus();		
		}
	}
}//END

//Funtion: to restrict the amount.
//Cannot exceed the amount in the text field.
function enterMaxAmount(src,e)
{
	var unidentifed_paid_amount = convertIntoStandardFormat($('#assign_paymentUnidentifedPaidAmount').val());
	var amount = convertIntoStandardFormat($(src).val());
	
	if(parseInt(amount) > parseInt(unidentifed_paid_amount))
	{
		showAlertMessage('Paid Amount cannot exceed Unidentified Amount','error');
		$(src).val(convertIntoLocalFormat(unidentifed_paid_amount));
		return false;
	} 
	
}

/*BUG:23202, BY:054  18 OCT 2014 */
function addOption(extDiv,selectbox,data,placeholder)
{ 
	var arr = [];
	for (var prop in data) {
		arr.push({'id' : prop,'text' : data[prop]});
	}
	if(arr.length > 0) 
	{
		extDiv.show();
		selectbox.empty();
		selectbox.append(
				$('<option></option>').val("").html("")
			);
		$.each(data, function(val, text) {
			selectbox.append(
				$('<option></option>').val(val).html(text)
			);
		});

		selectbox.select2().trigger('change');
		$input = selectbox;
		if((placeholder != 'undefined') || (placeholder !=null) ) {
			$input.attr("data-placeholder", placeholder);
		}else{
			$input.attr("data-placeholder", " ");
		}
		var select2 = $input.data("select2");
		select2.setPlaceholder();
	}else {
		extDiv.hide();
		selectbox.empty();
		selectbox.select2().trigger('change');
	}
}
function showConfirmMessageBox(el,message,dilogTitle,yesTitle,noTitle)
{
	if(message == '' || message == null || message == 'undefined'){
		message = 'Error';
	}
	
	if(dilogTitle == '' || dilogTitle == null || dilogTitle == 'undefined'){
		dilogTitle = 'Message';
	}
	if(yesTitle == '' || yesTitle == null || yesTitle == 'undefined'){
		yesTitle = 'Yes';
	}
	if(noTitle == '' || noTitle == null || noTitle == 'undefined'){
		noTitle = 'No';
	}
	if($('#bkengine_alert_box').length <= 0){
		alert(message);
		return;
	}
	
	$('#bkengine_alert_box').html(message);
	//$('#bkengine_alert_box').attr('title',dilogTitle);
		
	$("#bkengine_alert_box" ).dialog({
	      dialogClass: 'ui-dialog-purple',
	      modal: true,
	      resizable: false,
	      height: 200,
	      modal: true,
	      title : dilogTitle,
	      buttons: [
	      	{
	      		'class' : 'btn green',	
	      		"text" : yesTitle,
	      		click: function() {
	      			$(this).dialog( "close" );
	      			if($(el) != '' && $(el) != null){
	      				show_modal(el,'popups1');
	    			}
    			} 
	      	},
	      	{
	      		'class' : 'btn',
	      		"text" : noTitle,
	      		click: function() {
	      			$(this).dialog( "close" );
    			}
	      	}
	      ]
	    });
	return;
}

function isTouchDevice()
{
	var ua = navigator.userAgent;
	var isTouchDevice = (
		ua.match(/iPad/i) ||
		ua.match(/iPhone/i) ||
		ua.match(/iPod/i) ||
		ua.match(/Android/i)
	);

	return isTouchDevice;
}

jQuery.fn.extend({
	insertAtCaret: function(myValue){
	  return this.each(function(i) {
	    if (document.selection) {
	      //For browsers like Internet Explorer
	      this.focus();
	      sel = document.selection.createRange();
	      sel.text = myValue;
	      this.focus();
	    }
	    else if (this.selectionStart || this.selectionStart == '0') {
	      //For browsers like Firefox and Webkit based
	      var startPos = this.selectionStart;
	      var endPos = this.selectionEnd;
	      var scrollTop = this.scrollTop;
	      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
	      this.focus();
	      this.selectionStart = startPos + myValue.length;
	      this.selectionEnd = startPos + myValue.length;
	      this.scrollTop = scrollTop;
	    } else {
	       this.value += myValue;
	       this.focus();
	    }
	  })
	}
});



/*#044 22-dec-2015 0033179: be > Utility meter functionality > Meter reading procedure*/
function calculateMeterLineTotal(val, id)
{	
	var myArray = new Array('new_meter_value_','text_line_');
	
	var flag='0';
	for(var i=0;i<myArray.length;i++)
	{
		if(!document.getElementById(myArray[i]+id)){			
			flag = '1';
			break;
		}
	}

	if(flag == '1'){
		return false;
	}

	if($('#text_line_'+id).val() == 'y'){
		return;
	}	
	
	var new_meter_value = parseInt($("#new_meter_value_"+id).val());
	var old_meter_value = parseInt($("#old_meter_value_"+id).html());	
	if(!IsNumeric(new_meter_value)){
		new_meter_value = '0';
	}			
	
	if(new_meter_value < old_meter_value){		
		$("#new_meter_value_"+id).val(0);
		$("#usage_"+id).html(0);
		$("#usage_val_"+id).val(0);		
		getSummaryMeterLineCalculation();
		showAlertMessage("Entered value is lower than the previously registered value",'error');
		return false;
	}	
	
	var usage = new_meter_value - old_meter_value;	
	$("#usage_"+id).html(usage);
	$("#usage_val_"+id).val(usage);	
			
	getSummaryMeterLineCalculation();	
}

/*#044 22-dec-2015 0033179: be > Utility meter functionality > Meter reading procedure*/
function getSummaryMeterLineCalculation()
{
	var obj_usage_val = new Array();	
	var final_gross_amount = 0;
	
	var fobj = document.getElementById('frmNewInvoice');
	if(fobj != null){
		for(var i = 0;i < fobj.elements.length;i++) 
		{
			els = fobj.elements[i];  
			fv = els.value;			
			fn = els.name;
			fd = els.disabled;
			
			if(fd){
				continue;
			}			
			switch(fn)
			{	
				case 'salesProduct.usage_val[]':	
					obj_usage_val.push(fv);
					break;	
			}
		}
	}	
	
	var vat_show = new Array();
	var vat_level_arr = new Array();	
	
	for(var i = 0;i < obj_usage_val.length;i++) 
	{
		if(!obj_usage_val[i])
			continue;

		var usage_val = obj_usage_val[i];
		
		usage_val = convertIntoStandardFormat(usage_val.trim());
		if(!IsNumeric(usage_val) )
			qty = 0;
		usage_val = parseFloat(usage_val);	
					
		final_gross_amount = final_gross_amount + usage_val;		
	}		
	$("#invoice_gross_amount").html(final_gross_amount);
	$("#invoice_total_meter").html(obj_usage_val.length);	
}

function showButton(){
	var invoice_gross_amount = $('#invoice_gross_amount').html();
	if(convertIntoStandardFormat(invoice_gross_amount) <= 0){
		$('#btn_send_credit').show();
		$('#btn_save_send_credit').show();
		$('#btn_send_invoice').hide();
		$('#btn_save_send_invoice').hide();
	}else{
		$('#btn_send_credit').hide();
		$('#btn_save_send_credit').hide();
		$('#btn_send_invoice').show();
		$('#btn_save_send_invoice').show();
	}
}
function convertDateIntoSiteFormat(d=''){
	if(d == '' || d == undefined || d==null){
		return '';
	}
	var date_format =  $('#date_format').val();
	var date_format_partner =  $('#date_format_partner').val();
	if(date_format_partner!='' && date_format_partner!=undefined && date_format_partner!=null){
		return moment(d).format(date_format_partner);
	}
	else{
		return moment(d).format(date_format.toUpperCase());
	}
}

(function( $ ){
   	$.fn.acceptOnlyFloat = function() {
	    $(this).keypress(function (event) {
	    	var charCode = (event.which) ? event.which : event.keyCode;
			if (charCode != 44 && charCode > 31 && (charCode < 48 || charCode > 57)) {
			    return false;
			}
			else {
			    //if dot sign entered more than once then don't allow to enter dot sign again. 46 is the code for dot sign
			    var parts = $(this).val().split(',');
			    if (parts.length > 1 && charCode == 44)
			      {
			        return false;
			      }
			    return true;

			}
	    });
   }; 
})( jQuery );

(function( $ ){
   	$.fn.limitAmountPrice = function(limit=8) {
	    $(this).keypress(function (event) {
	    	var e = event;
	    	if((max == 'undefined') || (max ==null) ) {
				var max = 9;
			}
			
			var len = $(this).val().replace(/[^0-9]/g,"").length;
			
			if((e.which == 44) || (e.which == 46)  || (e.which == 8)  || (e.which >= 48 && e.which <= 57) || (e.keyCode == 9)){ //e.keyCode == 8
			
				if (e.which < 0x20) {
				  // e.which < 0x20, then it's not a printable character
				  // e.which === 0 - Not a character
				 
					var target_value = $(this).val(); 
					
					pos = target_value.indexOf(',');
					target_value = convertIntoStandardFormat(target_value.trim());
					if(!IsNumeric(target_value)){
						target_value = '0.0';
					}
					
					target_value = roundNumber(target_value);
					target_value_arr = target_value.split('.');
					if(target_value_arr[0].length > limit){
						
						target_value = target_value.substr(0,limit);
						if(pos != -1){
							target_value = Number(target_value+'.'+target_value_arr[1]);
							target_value = roundNumber(target_value);
							target_value = convertIntoLocalFormat(target_value);
						}
						$(this).val(target_value);
					}
				  return; // Do nothing
				}

				if (len >= max) {
				  e.preventDefault();
				}
			}else {
				e.preventDefault();
			}
	    });
   }; 
})( jQuery );

function convertIntoSystemDate(d,split='.'){
	if(d==''){
		return false;
	}
	d = d.split(split);
	var date = checkNull(parseInt(d[0]));
	var month = checkNull(parseInt(d[1]));
	if(d[2] != '00'){
		var year = checkNull(parseInt(d[2]));
	}
	else{
		var year = d[2];
	}


	if(date=='' || date==undefined || date=='null' || isNaN(date)){
		return false;
	}
	if(month=='' || month==undefined || month=='null' || isNaN(month)){
		return false;
	}
	if(year=='' || year==undefined || year=='null' || isNaN(year)){
		return false;
	}
	console.log(date+'date');
	console.log(month+'month');
	console.log(year+'year');

	var current_year = moment().format('YY');
	var current_year1 =  moment().format('YYYY');
	current_year1 = current_year1[0] + current_year1[1];
	console.log(current_year1+'current_year1');
	if(year > current_year){
		year = '19' + year;
	}
	else{
		year = current_year1 + year;
	}
	

	var date = month+'/'+date+'/'+year;
	var a = moment(date);
	if(a._d=='Invalid Date'){
		return false;
	}

	var a = moment(date).format('YYYY-MM-DD');

	return a;

}