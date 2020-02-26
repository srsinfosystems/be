<?php $actionButtons = $this->element('Bkengine.customer_list_breadcrum_button', array('cache' => false));?>
<?php echo $this->element('Bkengine.page_header', array('cache' => false,'actionButtons' => $actionButtons,));?>

<!-- BEGIN PAGE CONTENT-->
<?php /* echo $this->Form->create('search',array('url' => array('plugin' => 'bkengine','controller' => 'customers','action' => 'all_customers'),'class' => 'form-horizontal','onsubmit' => 'return false'));?>
<div class="row-fluid">
	<div class="span12">
		<div class="portlet box green" style="margin-bottom:10px;">
			<div class="portlet-title">
				<div class="caption"><i class="icon-search"></i> <?php echo __('Search/Filter');?></div>
				<div class="tools">
					<a href="javascript:;" class="<?php if($show_filter) echo "collapse"; else echo"expand";?>"></a>
				</div>
			</div>
			<div class="portlet-body flip-scroll" style="display: <?php if($show_filter) echo ""; else echo"none";?>">
				<form class="form-horizontal form-view" style="margin-bottom:0px;">
					<!-- Filter -->
					<div class="row-fluid">

						<div class="span6">
							<div class="control-group">
								<label class="control-label"><?php echo __("Customer Name");?></label>
								<div class="controls">
									<?php echo $this->Form->input('customer_name', array(
																  'empty' => false,
																  'div' => false,
																  'type' => 'text',
																  'value' => $customer_name,
																  'class' => 'm-wrap span10',
																  'name' => 'customer_name',
																  'label' => false,
																  'placeholder' => __("Customer Name"),
																  'onkeypress' => 'submitControl("btn_filter_customer", event)'
																	)); ?>
								</div>
							</div>
						</div>
						<div class="span6">
							<div class="control-group">
								<label class="control-label"><?php echo __("Customer Number");?></label>
								<div class="controls">
									<?php echo $this->Form->input('customer_number', array(
																  'empty' => false,
																  'div' => false,
																  'type' => 'text',
																  'value' => $customer_number,
																  'class' => 'm-wrap span10',
																  'name' => 'customer_number',
																  'label' => false,
																  'placeholder' => __("Customer Number"),
																  'onkeypress' => 'submitControl("btn_filter_customer", event)'
																	)); ?>
								</div>
							</div>
						</div>
					</div>

					<div class="row-fluid">
						<div class="span6">
							<div class="control-group">
								<label class="control-label"><?php echo __('Customer type');?></label>
								<div class="controls">
									<?php echo $this->Form->input('customer_type', array(
																  'empty' =>"-- ".__("Select")." --",
																  'div' => false,
																  'type' => 'select',
																  'options' => $ugData,
																  'value' => $user_group,
																  'class' => 'm-wrap span10',
																  'name' => 'user_group',
																  'label' => false,
																  'onkeypress' => 'submitControl("btn_filter_customer", event)')); ?>
								</div>
							</div>
						</div>

					</div>
					<br>
					<div style="text-align:center">
						<?php echo $this->Form->hidden('show_filter',array('value' => 'Y','name' => 'show_filter'));?>
						<?php  echo $this->Form->button(__('Filter')." <i class=\"m-icon-swapright m-icon-white\"></i>",array('class'=>"btn green", 'type' => 'button', 'id' => 'btn_filter_customer',
								'onclick' => "fetchFormData('searchAllCustomersForm','".Router::url(array('plugin' => 'bkengine','controller' => 'customers','action' => 'all_customers'),true)."','');"))?>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<!--END SEARCH FILTER-->
<?php echo $this->Form->end();*/?>

<div class="row-fluid">
	<div class="span12">
		<?php echo $this->Session->flash(); ?>
		<!--<div class="btn-group" style="float:right;margin-bottom:5px;">
			 <button class="btn purple" onclick="show_modal(this,'popups');" data-url="<?php echo Router::url(array('plugin'=>'bkengine','controller' => 'customers','action' => 'add_new_customer'),true);?>" data-width="750px">
			<i class="icon-plus"></i> <?php echo __("Add New");?>
			</button>
			<button class="btn red">
			<i class="icon-trash"></i> <?php //echo _("Delete");?>
			</button> 
		</div>-->

		<!-- BEGIN EXAMPLE TABLE PORTLET-->
		
		<div class="portlet">
			<div class="portlet-title">
				<div class="caption"><i class="icon-user"></i> <?php echo __("Managed Customers");?></div>
				<!-- <div class="tools">
					<a href="javascript:;" class="collapse"></a>
					<a href="#portlet-config" data-toggle="modal" class="config"></a>
					<a href="javascript:;" class="reload"></a>
					<a href="javascript:;" class="remove"></a>
				</div> -->
			</div>
			
			<div class="portlet-body  profile">
				
				<?php 
				#desktop 
				if($switch == false){ ?>
				<?php /* <div class="row-fluid">
					<div class="span12"><?php echo $paging;?></div>
				</div> */ ?>
				<div class="table-toolbar">

					<!-- <div class="btn-group pull-right">
						<button class="btn dropdown-toggle" data-toggle="dropdown">Tools <i class="icon-angle-down"></i>
						</button>
						<ul class="dropdown-menu pull-right">
							<li><a href="#">Print</a></li>
							<li><a href="#">Save as PDF</a></li>
							<li><a href="#">Export to Excel</a></li>
						</ul>
					</div> -->
				</div>
				<div class="table-responsive">
				<?php if(!empty($customerData)) {	?>
				<table class="table table-striped table-bordered table-hover" id="sorting_customer_list">
					<thead class="">
						<tr>
							<th class="sorting_customer_width"><i class="icon-list"></i> <?php echo __('Customer');?>#</th>
							<th ><i class="icon-user"></i> <?php echo __('Customer name');?></th>
							<th style="width:125px !important;min-width:70px"><i class="icon-user-md"></i> <?php echo __('Customer type');?></th>
							<th><i class="icon-mobile-phone"></i> <?php echo __('Cellphone');?></th>
							<th><i class="icon-globe"></i> <?php echo __('Country');?></th>
							<!-- <th><i class="icon-cog"></i> <?php echo __('Status');?></th> -->
							<th style="width:264px !important;min-width:264px"><i class="icon-ok"></i> <?php echo __('Action');?></th>
						</tr>
					</thead>
					<tbody>
							<?php
								$rcount = 1;
								$limit = @$limit;
								if(!empty($start)){
									$limit = $start;
								}
								$count = $rcount + $limit;
								$cell_count = 5;
								foreach ($customerData as $customer_key => $customer_value) { ?>
									<?php if($customer_value['Customer']['status'] == true && $show_filter != 'Y'){ ?>
										<tr class="gradeX" style="cursor:pointer;" onclick="window.location.href='<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'customers', 'action' => 'details',$customer_value['Customer']['id'],'?' => array('customer_number' => @$customer_number,'customer_name'=> @$customer_name,'user_group' => @$user_group,'status' => @$status,'show_filter' => @$show_filter,'start'=> @$start,'end' => @$end,'page' => @$page,'slab_start' => @$slab_start,'limit'=> @$limit)),true); ?>'">
											<td data-title="<?php echo __('Customer');?>&#35;"><?php echo $customer_value['Customer']['customer_number'];?></td>
											<?php
												$customerName = strip_tags($customer_value['Customer']['customer_name']);
												if (strlen($customerName) > 60)
													$customerName = substr($customerName, 0, 60) . ' ...';
												else
													$customerName = $customerName;
											?>
											<td data-title="<?php echo __('Customer name');?>"><?php echo $customerName; ?></td>
											<td data-title="<?php echo __('Customer type');?>"><?php echo __($customer_value['UserGroup']['group_name_en']); ?></td>
											<?php if(strlen($customer_value['Customer']['customer_cellphone']) > $cell_count) { ?>
													<td class="" data-title="<?php echo __('Cellphone');?>"><?php echo format_contact_number($customer_value['Customer']['customer_cellphone']);?></td>
											<?php } else{ ?>
													<td class="" data-title="<?php echo __('Cellphone');?>"> - </td>
											<?php } ?>
											<td class="" data-title="<?php echo __('Country');?>"><?php echo $customer_value['Country']['country']; ?></td>
											<?php /*<?php if($customer_value['Customer']['status'] == false){ ?>
		                                          <td data-title="<?php echo __("Status");?>" style="text-align:left;"><?php echo __('Inactive'); ?></td>
		                                    <?php }else{ ?>
		
		                                          <td data-title="<?php echo __("Status");?>" style="text-align:left;"><?php echo __('Active'); ?></td>
											<?php } ?> */ ?>
											<td  data-title="<?php echo __('Action');?>">
												<a class="btn mini blue-stripe" href="<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'customers', 'action' => 'details',$customer_value['Customer']['id'],'?' => array('customer_number' => @$customer_number,'customer_name'=> @$customer_name,'user_group' => @$user_group,'status' => @$status,'show_filter' => @$show_filter,'start'=> @$start,'end' => @$end,'page' => @$page,'slab_start' => @$slab_start,'limit'=>@$limit)),true); ?>"><i class="icon-eye-open"></i> <?php echo __("View");?></a>
												<a onclick="event.stopPropagation(); show_modal(this,'popups');" style="" data-width="700px" data-url="<?php echo Router::url(array('plugin'=>'bkengine','controller' => 'customers','action' => 'send_custom_mail', $customer_value['Customer']['id'],),true);?>" 
												data-width="" class="btn mini green-stripe"><i class="icon-envelope-alt" style="margin-left:0px;"></i> <?php echo __("Send email");?></a>
												<a  class="btn mini yellow-stripe" style="" onclick="event.stopPropagation(); show_modal(this,'popups');" data-url="<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'customers', 'action' => 'send_sms',$customer_value['Customer']['id']));?>"><i class="icon-comment"></i> <?php echo __("Send SMS");?></a>
												<div tabindex="-1" class="modal hide fade" id="ajax-modal"></div>
											</td>
										</tr>
									<?php }else{ ?>
										<tr class="gradeX" style="cursor:pointer;" onclick="window.location.href='<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'customers', 'action' => 'details',$customer_value['Customer']['id'],'?' => array('customer_number' => @$customer_number,'customer_name'=> @$customer_name,'user_group' => @$user_group,'status' => @$status,'show_filter' => @$show_filter,'start'=> @$start,'end' => @$end,'page' => @$page,'slab_start' => @$slab_start,'limit'=> @$limit)),true); ?>'">
											<td data-title="<?php echo __('Customer#');?>"><?php echo $customer_value['Customer']['customer_number'];?></td>
											<?php
												$customerName = strip_tags($customer_value['Customer']['customer_name']);
												if (strlen($customerName) > 60)
													$customerName = substr($customerName, 0, 60) . ' ...';
												else
													$customerName = $customerName;
											?>
											<td data-title="<?php echo __('Customer name');?>"><?php echo $customerName; ?></td>
											<td data-title="<?php echo __('Customer type');?>"><?php echo __($customer_value['UserGroup']['group_name_en']); ?></td>
											<?php if(strlen($customer_value['Customer']['customer_cellphone']) > $cell_count) { ?>
													<td class="" data-title="<?php echo __('Cellphone');?>"><?php echo $customer_value['Customer']['customer_cellphone'];?></td>
											<?php } else{ ?>
													<td class="" data-title="<?php echo __('Cellphone');?>"> - </td>
											<?php } ?>
											<td class="" data-title="<?php echo __('Country');?>"><?php echo $customer_value['Country']['country']; ?></td>
											<?php /*<?php if($customer_value['Customer']['status'] == false){ ?>
		                                          <td data-title="<?php echo __("Status");?>" style="text-align:left;"><?php echo __('Inactive'); ?></td>
		                                    <?php }else{ ?>
		
		                                          <td data-title="<?php echo __("Status");?>" style="text-align:left;"><?php echo __('Active'); ?></td>
											<?php } ?> */ ?>
											<td  data-title="<?php echo __('Action');?>">
												<a class="btn mini blue-stripe" href="<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'customers', 'action' => 'details',$customer_value['Customer']['id'],'?' => array('customer_number' => @$customer_number,'customer_name'=> @$customer_name,'user_group' => @$user_group,'status' => @$status,'show_filter' => @$show_filter,'start'=> @$start,'end' => @$end,'page' => @$page,'slab_start' => @$slab_start,'limit'=>@$limit)),true); ?>"><i class="icon-eye-open"></i> <?php echo __("View");?></a>
												<a onclick="event.stopPropagation(); show_modal(this,'popups');" style="" data-width="700px" data-url="<?php echo Router::url(array('plugin'=>'bkengine','controller' => 'customers','action' => 'send_custom_mail', $customer_value['Customer']['id'],),true);?>" 
												data-width="" class="btn mini green-stripe"><i class="icon-envelope-alt" style="margin-left:0px;"></i> <?php echo __("Send email");?></a>
												<a  class="btn mini yellow-stripe" style="" onclick="event.stopPropagation(); show_modal(this,'popups');" data-url="<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'customers', 'action' => 'send_sms',$customer_value['Customer']['id']));?>"><i class="icon-comment"></i> <?php echo __("Send SMS");?></a>
												<div tabindex="-1" class="modal hide fade" id="ajax-modal"></div>
											</td>
										</tr>
									<?php } ?>
						<?php }?>
					</tbody>
				</table>
				</div>
				<div class="row-fluid">
					<div class="span12"><?php echo $paging;?></div>
				</div>
				<div style="clear:both"></div>
				<?php
					} else {
						echo "<br><div class=\"alert alert-error\" style=\"text-align:center;\">".__("No record found")."</div>";
					} ?>
				<?php 
				 }else { ?>
					 <?php #BUG: 22373  BY:054  18 SEP 2014
					 if(!empty($customerData)) {	?>
							<ul class="customer-list unstyled">
								<?php  $rcount = 1;
								$limit = @$limit;
								if(!empty($start)){
									$limit = $start;
								}
								$count = $rcount + $limit;
								$cell_count = 5;
								foreach ($customerData as $customer_key => $customer_value) { 
								
												$customerName = strip_tags($customer_value['Customer']['customer_name']);
												if (strlen($customerName) > 60)
													$customerName = substr($customerName, 0, 60) . ' ...';
												else
													$customerName = $customerName;
													
												$data = '';	
												$lat = ''; 
												$long = '';
												$output = '';
												$geocode = '';
												
												if(!empty($customer_value['Customer']['customer_address1']) && !empty($customer_value['Customer']['customer_zip']) && !empty($customer_value['Customer']['customer_city']) && !empty($customer_value['Customer']['delivery_country']))
												{	
													if(!empty($customer_value['Customer']['customer_address2']))
													$data = $customer_value['Customer']['customer_address1'].'+, '.$customer_value['Customer']['customer_address2'].', +'.$customer_value['Customer']['customer_zip'].', +'.$customer_value['Customer']['customer_city'].', +'.$customer_value['Customer']['customer_country'];
													else
													$data = $customer_value['Customer']['customer_address1'].', +'.$customer_value['Customer']['customer_zip'].', +'.$customer_value['Customer']['customer_city'].', +'.$customer_value['Customer']['customer_country'];
												}
												if($device == true){
													$url = 'http://maps.apple.com/?q='.$data;
												}else{
													if(!empty($data) && $data != ''){
														$address = $data; // Google HQ
														$prepAddr = str_replace(' ','+',$address);
														 
														$geocode=file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.$prepAddr.'&sensor=false');

														$output= json_decode($geocode);
														$lat = '';
														$long = '';
														if(isset($output->results[0])){ 
															$lat = $output->results[0]->geometry->location->lat;
															
															$long = $output->results[0]->geometry->location->lng;
														}
													}
												}
												
											?>
								<li style="cursor:pointer;" >
								
									<div class="customer-title">
										<span class="title-line1"><?php echo "#".$customer_value['Customer']['customer_number'];?></span> 
										<label class="title-line2"><?php echo $customerName;?></label>
									</div>
									<div class="action-block pull-right">
										<div class="customer-config-btn btn-group">
												<a class="btn small action-dropdown" href="#" data-toggle="dropdown"  data-hover="dropdown" data-close-others="true"><i class="icon-cog"></i><i class="icon-angle-down"></i></a>
												<ul class="dropdown-menu pull-right">

													<?php if(!empty($data) && $data != ''){ ?>	
													<li><a onclick="event.stopPropagation();choose_action(this,'<?php echo $customer_value['Customer']['id']; ?>')" rel="3" href="#"><?php echo __("Navigate to");?></a></li>
													<?php }  ?>
													<?php if(strlen($customer_value['Customer']['customer_cellphone']) > $cell_count) { ?>
													<li><a onclick="event.stopPropagation();choose_action(this,'<?php echo $customer_value['Customer']['id']; ?>')" rel="2" href="#"><?php echo __("Call");?></a></li>
													<?php } ?>
													<li><a  href="<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'customers', 'action' => 'details',$customer_value['Customer']['id'],'?' => array('customer_number' => @$customer_number,'customer_name'=> @$customer_name,'user_group' => @$user_group,'status' => @$status,'show_filter' => @$show_filter,'start'=> @$start,'end' => @$end,'page' => @$page,'slab_start' => @$slab_start,'limit'=>@$limit)),true); ?>"><?php echo __("View");?></a></li>
													
													<li><a onclick="event.stopPropagation(); show_modal(this,'popups');" style="" data-width="700px" data-url="<?php echo Router::url(array('plugin'=>'bkengine','controller' => 'customers','action' => 'send_custom_mail', $customer_value['Customer']['id'],),true);?>" 
													data-width="" ><?php echo __("Send email");?></a>
													
													<li><a   onclick="event.stopPropagation(); show_modal(this,'popups');" data-url="<?php echo Router::url(array('plugin' => 'bkengine','controller' => 'customers', 'action' => 'send_sms',$customer_value['Customer']['id']));?>"><?php echo __("Send SMS");?></a></li>
													
													<?php if(isset($customer_value['Customer']['customer_cellphone']) && !empty($customer_value['Customer']['customer_cellphone'])){ ?>
														<a id="call_client_<?php echo $customer_value['Customer']['id']; ?>" href="tel:<?php echo $customer_value['Customer']['customer_cellphone']; ?>"></a>
													<?php } ?>
													
													<?php if($device == true){ ?>				
														<?php if(!empty($data) && $data != ''){ ?>
															<a id="show_map_<?php echo $customer_value['Customer']['id']; ?>" href="<?php echo $url; ?>"></a>
														<?php }  ?>
													<?php }else{ ?>
															<?php if(!empty($data) && $data != ''){ ?>
															<a id="show_map_<?php echo $customer_value['Customer']['id']; ?>" href="geo:<?php echo $lat; ?>,<?php echo $long; ?>&z=15"></a>
														<?php }  ?>
													<?php } ?>
												</ul>
											</div>
									</div>
								
								</li>
								<?php } ?>
							</ul>
							
							<div class="row-fluid">
								<div class="span12"><?php echo $paging;?></div>
							</div>
					<?php  } 
				 } ?>
			</div>
		</div>
		<!-- END EXAMPLE TABLE PORTLET-->
	</div>
</div>

<script>
$(document).ready(function(){

	$('#sorting_customer_list').dataTable( {
		 "aoColumns": [
		                  null,
		                  null,
		                  null,
		                  null,
		                  null,
		                  { "bSortable": false }
		                ],
		"aaSorting": [[ 0, "desc" ]],
        "bPaginate": false,
        "bFilter": false,
        "bInfo": false
    });

	if($('#sorting_customer_list').prev('div.row-fluid').length > 0)
		$('#sorting_customer_list').prev('div.row-fluid').remove();
	if($('#sorting_customer_list').next('div.row-fluid').length > 0)
		$('#sorting_customer_list').next('div.row-fluid').remove();

	$('table.dataTable thead tr th:first-child').removeClass('sorting_asc');
	$('table.dataTable thead tr th:first-child').addClass('sorting');
	
	$('table.dataTable thead tr th:first-child').removeClass('sorting-desc');
	$('table.dataTable thead tr th:first-child').addClass('sorting'); 

	$('table.dataTable thead tr th:first-child').removeClass('sorting_desc');
	$('table.dataTable thead tr th:first-child').addClass('sorting');
	
	$('.action-dropdown').dropdownHover().dropdown();
});


function choose_action(sel,id)
	{

		var value = $(sel).attr('rel');

		if(value == '2')
		{
			window.location.href = $('#call_client_'+id).attr('href');
		}

		if(value == '3')
		{
			window.location.href = $('#show_map_'+id).attr('href'); 	
		
		}
	}

</script>
