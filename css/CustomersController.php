<?php
App::uses('ApiAppController', 'Api.Controller');
/**
 * Customers Controller
 *
 * @property Customer $Customer
 * @property PaginatorComponent $Paginator
 */
class CustomersController extends ApiAppController {

/**
 * Components
 *
 * @var array
 */
	public $components = array('RequestHandler', 'Paginator', 'Session', 'Api.Customers','Api.Mailings', 'Api.Partners','Api.Quotes');
	public $uses = array('Api.LoginGroup', 'Api.Customer', 'Api.User', 'Api.Login');

	public function beforeFilter() {
		parent::beforeFilter();
	}

/**
 * index method
 * @return void
 */
	public function index() 
	{
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			
			// Get the Admin ID
			$admin_id = getAdminId();
						
			// Populate the input params
			$recursive = 0;
			$partner_id = $this->getPostData('partner_id');
			$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
			$sort = $this->getPostData('sort', 'customer_number');
			$direction = $this->getPostData('direction', 'desc');
			$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
			$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
			
			// Search/filter options
			$user_group_id = $this->getPostData('user_group_id');
			$customer_name = $this->getPostData('customer_name');
			$customer_number = $this->getPostData('customer_number');
			$status = $this->getPostData('status');
			$customer_phone_number = $this->getPostData('customer_phone_number');
			
			#29607, Fwd: Issue >>Set the ability to active and inactive Customer
			$include_inactive = $this->getPostData('include_inactive');
			#29607, Fwd: Issue >>Set the ability to active and inactive Customer
			
			$input_params = array(
				'page' => $page, 
				'sort' => $sort, 
				'direction' => $direction, 
				'recursive' => $recursive, 
				'limit' => $limit, 
				'maxLimit' => $maxLimit,
					
				'user_group_id' => $user_group_id,
				'customer_name' => $customer_name,
				'customer_number' => $customer_number,
				'status' => $status,
				'customer_phone_number' => $customer_phone_number,	
				
				'include_inactive' => $include_inactive,
				);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$data = $this->Customers->getCustomersList($input_params);

			AppController::triggerSuccess($data);

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
/**
 * list method
 *
 * @return void
 */
	public function getCustomerListFromContact()
	{
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			
			// Get the Admin ID
			$admin_id = getAdminId();
			
			$recursive = 0;
			$partner_id = $this->getPostData('partner_id');
			$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
			$sort = $this->getPostData('sort', 'modified_date');
			$direction = $this->getPostData('direction', 'desc');
			$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
			$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
			
			$partner_id = $this->getPostData('partner_id');
			$customer_name = $this->getPostData('customer_name');
			$customer_number = $this->getPostData('customer_number');
			$status = $this->getPostData('status');
			
			$contact_name = $this->getPostData('contact_name');

			$params = array(
				'page' => $page,
				'sort' => $sort,
				'direction' => $direction,
				'recursive' => $recursive,
				'limit' => $limit,
				'maxLimit' => $maxLimit,
					
				'customer_name' => $customer_name,
				'customer_number' => $customer_number,
				'status' => $status,
				'contact_name' => $contact_name,
				);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$customers = $this->Customers->getCustomerListFromContact($params);
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function getList()
	{
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
	
			// Get the Admin ID
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			$customer_name = $this->getPostData('customer_name');
			$customer_number = $this->getPostData('customer_number');
			$status = $this->getPostData('status');
	
			$params = array(
					'customer_name' => $customer_name,
					'customer_number' => $customer_number,
					'status' => $status,
			);
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$customers = $this->Customers->getPartnerCustomersList($params);
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	
	public function getCustomersListWithDetails()
	{
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
	
			// Get the Admin ID
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			$customer_name = $this->getPostData('customer_name');
			$status = $this->getPostData('status');
			$params = array(
					'customer_name' => $customer_name,
					'status' => $status,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$customers = $this->Customers->getCustomersListWithDetails($params);
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
/**
 * view method
 *
 * @throws NotFoundException
 * @param string $id
 * @return void
 */
	public function view() {
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getCustomerDetail();

			if($data)
			{
				#024 17-06-2016 #35091, More addressing issues, customer card
					######### For Getting Phone code #######
					if(!empty($data['Customer']['phone_country_code'])){
						$phone_country_code = $data['Customer']['phone_country_code'];	
					}else{
						$phone_country_code = $data['Customer']['customer_country'];
					}
					
					######### For Getting Phone code #######
					if(!empty($data['Customer']['cellphone_country_code'])){
						$cellphone_country_code = $data['Customer']['cellphone_country_code'];	
					}else{
						$cellphone_country_code = $data['Customer']['customer_country'];
					}
				
					$splitPhoneArr = $this->Partners->splitPhoneNumbers($phone_country_code,$data['Customer']['customer_phone']);
					$splitCellPhoneArr = $this->Partners->splitPhoneNumbers($cellphone_country_code,$data['Customer']['customer_cellphone']);
				#024 17-06-2016 #35091, More addressing issues, customer card
				# Phone
				$data['Customer']['ph_code'] = $splitPhoneArr['code'];
				$data['Customer']['customer_phone'] = $splitPhoneArr['number'];
			
				# Cellphone
				$data['Customer']['cp_code'] = $splitCellPhoneArr['code'];
				$data['Customer']['customer_cellphone'] = $splitCellPhoneArr['number'];
			}
			
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function getCustomerDetailOnly() {
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getCustomerDetailOnly();

			if($data)
			{
				#024 21-06-2016 #35130, Booking Engine Updates - 17 june 2016 > More addressing issues, customer card regression testing
					if(!empty($data['Customer']['phone_country_code'])){
						$phone_country_code = $data['Customer']['phone_country_code'];
					}else{
						$phone_country_code = $data['Customer']['customer_country'];
					}
					if(!empty($data['Customer']['cellphone_country_code'])){
						$cellphone_country_code = $data['Customer']['cellphone_country_code'];
					}else{
						$cellphone_country_code = $data['Customer']['customer_country'];
					}
					$splitPhoneArr = $this->Partners->splitPhoneNumbers($phone_country_code,$data['Customer']['customer_phone']);
					$splitCellPhoneArr = $this->Partners->splitPhoneNumbers($cellphone_country_code,$data['Customer']['customer_cellphone']);
				#024 21-06-2016 #35130, Booking Engine Updates - 17 june 2016 > More addressing issues, customer card regression testing
				
				# Phone
				$data['Customer']['ph_code'] = $splitPhoneArr['code'];
				$data['Customer']['customer_phone'] = $splitPhoneArr['number'];
			
				# Cellphone
				$data['Customer']['cp_code'] = $splitCellPhoneArr['code'];
				$data['Customer']['customer_cellphone'] = $splitCellPhoneArr['number'];
			}
			
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	public function getDetailsFromCustomerNumber() {
		try
		{
			$admin_id = getAdminId();
			$customer_number = $this->getPostData('customer_number');
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$iParams = array(
					'customer_number' => $customer_number);
			$data = $this->Customers->getDetailsFromCustomerNumber($iParams);
			
			if($data)
			{
				#024 21-06-2016 #35130, Booking Engine Updates - 17 june 2016 > More addressing issues, customer card regression testing
					if(!empty($data['Customer']['phone_country_code'])){
						$phone_country_code = $data['Customer']['phone_country_code'];
					}else{
						$phone_country_code = $data['Customer']['customer_country'];
					}
					if(!empty($data['Customer']['cellphone_country_code'])){
						$cellphone_country_code = $data['Customer']['cellphone_country_code'];
					}else{
						$cellphone_country_code = $data['Customer']['customer_country'];
					}
					$splitPhoneArr = $this->Partners->splitPhoneNumbers($phone_country_code,$data['Customer']['customer_phone']);
					$splitCellPhoneArr = $this->Partners->splitPhoneNumbers($cellphone_country_code,$data['Customer']['customer_cellphone']);
				#024 21-06-2016 #35130, Booking Engine Updates - 17 june 2016 > More addressing issues, customer card regression testing	
			
				# Phone
				$data['Customer']['ph_code'] = $splitPhoneArr['code'];
				$data['Customer']['customer_phone'] = $splitPhoneArr['number'];
			
				# Cellphone
				$data['Customer']['cp_code'] = $splitCellPhoneArr['code'];
				$data['Customer']['customer_cellphone'] = $splitCellPhoneArr['number'];
			}
			
			
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

/**
 * add method
 *
 * @return void
 */
	public function add() {
		try {
			$this->request->onlyAllow('post', 'put');
			throw new ApplicationException('Function not available');
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	
/**
 * addConsumer method
 *
 * @throws NotFoundException
 * @param 
 * @return void
 */	
	public function addConsumer()
	{
		try {

			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
			
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			$isLoggedIn = isset($tokenData['MEMBER']['LoginGroupId'])?true:false;
			
			# Get the Admin ID
			$admin_id = $this->getPostData('admin_id');
			if(empty($admin_id)){
				$admin_id = getAdminId();
			}

			// Populate the input parameters
			$user_group_id = 1;		// Consumer = 1
			$partner_id = $this->getPostData('partner_id');
			$accept_tnc = $this->getPostData('tnc');

			if(!$accept_tnc && !$isLoggedIn) {
				throw new ApplicationException($this->Customers->getMessageString('tnc_not_selected'));
			}
			
			// Customer information
			$first_name = $this->getPostData('first_name');
			$last_name = $this->getPostData('last_name');
			$dob = $this->getPostData('dob');		// provide DOB if consumer
			$address1 = $this->getPostData('address1');
			$address2 = $this->getPostData('address2');
			$city = $this->getPostData('city');
			$zip = $this->getPostData('zip');
			$country = $this->getPostData('country', DEFAULT_COUNTRY);

			$cell_code = $this->getPostData('cell_code');
			$cellphone = $this->getPostData('cellphone');
			$phone_code = $this->getPostData('phone_code');
			$phone = $this->getPostData('phone');
			$directory = $this->getPostData('directory');
			$email = $this->getPostData('email');
			$password = $this->getPostData('password');
			$conf_password = $this->getPostData('conf_password');
			$login_link = $this->getPostData('login_link');
			$email_verification_link = $this->getPostData('email_verification_link');
			$login_verification_link = $this->getPostData('login_verification_link');
			$from_name = $this->getPostData('from_name');
			$ip_address = $this->getPostData('ip_address');
			$lang = $this->getPostData('lang','nb');
			$type = $this->getPostData('type');
			$send_contact_details = $this->getPostData('send_contact_details');
			$forgot_password_link = $this->getPostData('forgot_password_link'); /*Not required during registration*/
			
			/*************** #024 10-03-2015 #27534 Code to add delivery address for agent panel ***********************/
				$delivery_name = $this->getPostData('delivery_name');
				$delivery_address1 = $this->getPostData('delivery_address1');
				$delivery_address2 = $this->getPostData('delivery_address2');
				$delivery_zip = $this->getPostData('delivery_zip');
				$delivery_city = $this->getPostData('delivery_city');
				$delivery_country = $this->getPostData('delivery_country');
			/*************** #024 10-03-2015 #27534 Code to add delivery address for agent panel ***********************/
			
			$ask_every_time_session_new_customer = $this->getPostData('ask_every_time_session_new_customer');
			
			/*BUG #21162  BY: 054   31 JULY 2014*/
			$price_group = $this->getPostData('price_group');
			$customer_group_id = $this->getPostData('customer_group_id'); #044 03-11-2015 #0032715: Booking engine > Customer groups

			$receive_mass_emails = $this->getPostData('receive_mass_emails'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
			$receive_mass_sms = $this->getPostData('receive_mass_sms'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
			
			#024 05-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
				$default_distribution = $this->getPostData('default_distribution');
				$consumer_default_contact = $this->getPostData('consumer_default_contact');
				$default_distribution_address = $this->getPostData('default_distribution_address');	
			#024 05-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
			
			# BUG ID: 21394; BY: 018, On: 27 AUG 2014
			if($isLoggedIn){
				$password = randomPassword();
				$conf_password = $password;
			}
			#BUG:29488: Fwd: Issue >> duplicate entry of customers
			$chk_dup_customers = $this->getPostData('chk_dup_customers');
			#BUG:29488: Fwd: Issue >> duplicate entry of customers
			#024 07-03-2016 #34100, Feedback, new customer form
				$same_postal_address = $this->getPostData('same_postal_address');
				$delivery_address1 = $this->getPostData('delivery_address1');
				$delivery_address2 = $this->getPostData('delivery_address2');
				$delivery_zip = $this->getPostData('delivery_zip');
				$delivery_city = $this->getPostData('delivery_city');
				$delivery_country = $this->getPostData('delivery_country');
			#024 07-03-2016 #34100, Feedback, new customer form
			#024 17-06-2016 #35102, BE > Modifications, Neptun Motorbåtforening
				$customer_name = $this->getPostData('customer_name');
			#024 17-06-2016 #35102, BE > Modifications, Neptun Motorbåtforening
			
			$input_params = array(
				'user_group_id'	=> $user_group_id,
				'admin_id'	=> $admin_id,
				'partner_id'=> $partner_id,

				'first_name'=> $first_name,
				'last_name' => $last_name,
				'dob'		=> $dob,
				'address1'	=> $address1,
				'address2'	=> $address2,
				'zip'		=> $zip,
				'city'		=> $city,
				'country'	=> $country,
				
				'cell_code'	=> $cell_code,
				'cellphone'	=> $cellphone,
				'phone_code'=> $phone_code,
				'phone'		=> $phone,
				'directory' => $directory,
				'email'		=> $email,
				'password' => $password,
				'conf_password' => $conf_password,
				
				'ip_address' => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '',

				'price_group' => $price_group,/*BUG #21162  BY: 054  31 JULY 2014*/
				'customer_group_id' => $customer_group_id, #044 03-11-2015 #0032715: Booking engine > Customer groups
				# 024 10-03-2015 #27534 Code to add delivery address for agent panel
					'delivery_name'=> $delivery_name,
					'delivery_address1' => $delivery_address1,	
					'delivery_address2'	=> $delivery_address2,
					'delivery_zip'	=> $delivery_zip,
					'delivery_city'		=> $delivery_city,
					'delivery_country' => $delivery_country,
				# 024 10-03-2015 #27534 Code to add delivery address for agent panel
				#024 05-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
					'default_distribution' => $default_distribution,
					'consumer_default_contact' => $consumer_default_contact,
					'default_distribution_address' => $default_distribution_address,
				#024 05-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
				
				'chk_dup_customers' => $chk_dup_customers,
				'receive_mass_emails' => $receive_mass_emails, #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				'receive_mass_sms' => $receive_mass_sms, #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				#024 07-03-2016 #34100, Feedback, new customer form
					'same_postal_address'	=> $same_postal_address,
					'delivery_address1'		=> $delivery_address1,
					'delivery_address2'		=> $delivery_address2,
					'delivery_zip'			=> $delivery_zip,
					'delivery_city'			=> $delivery_city,
					'delivery_country'		=> $delivery_country,
				#024 07-03-2016 #34100, Feedback, new customer form
				#024 17-06-2016 #35102, BE > Modifications, Neptun Motorbåtforening
					'customerName'			=> $customer_name,
				#024 17-06-2016 #35102, BE > Modifications, Neptun Motorbåtforening
				);
			
			$data = $this->Customers->addConsumer($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {

				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {

				//Commit transaction
				$db->commit($this);
				
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('consumer_add_success'));
				
				try{
					
					if(isset($send_contact_details) && $send_contact_details == '1' && !empty($email)){
						
						if($ask_every_time_session_new_customer == '1'){
							
							$params1 = array(
									'admin_id'	=> $admin_id,
									'partner_id'=> $partner_id,
									'user_id' => $data['user_id'],
									'login_id' => $data['login_id'],
									'customer_id' => $data['customer_id'],
									'contact_id' => $data['contact_id'],
									'login_link' => $login_link,
									'emailto' => $email,
									'password' => $password,
									'customer_name' => $first_name . " ".$last_name
							);
							
							$this->Customers->admin_id = $admin_id;
							$this->Customers->partner_id = $partner_id;
							//$return = $this->Customers->addTrigger($params1);
							$return = $this->Customers->sendCustomerLoginDetails($params1);//BUG:23203
							//AppController::triggerSuccess($return);return;
						}
					}
					
					# Registration Confirmation email
					/*$params = array( 'user_id' => isset($data['user_id'])?$data['user_id']:'',
							'admin_id'	=> $admin_id,
							'type'	=> $type,
							'login_id' => isset($data['login_id'])?$data['login_id']:'',
							'partner_id' => $partner_id,
							'link' => $login_link,
							'lang' => $lang,
							'to_address' => $email,
							'from_name' => $from_name,
							'password' => $password,
							'to_name' => $last_name.' '.$first_name);
								
					$this->Mailings->admin_id = $admin_id;
					$this->Mailings->partner_id = $partner_id;
					$status = $this->Mailings->sendRegistrationConfirmationEmail($params); 
					
					if($status){
						$data['confirmationEmail'] = 'send';
					}*/
					
					# Since, password field will not required when partner add new customer, thus we need to send forgot password link instead
					/* BUG ID: 21394; BY: 018, On: 27 AUG 2014 -  Now we would send password directly into registration email
					if($isLoggedIn && isset($send_contact_details) && $send_contact_details){
						$loginParams = array('email' => $email,
								'type' => 'customer',
								'admin_id' => $admin_id,
								'lang' => $lang,
								'link' => @$forgot_password_link,
								'partner_id' => $partner_id,
								'from_name' => partner_name(),
						);
					
						
						try{
							$loginResponse = $this->Logins->forgotPassword($loginParams);
							$data['forgotPasswordEmail'] = 'send';
						}catch(Exception $e){
							//return $e->getMessage();
						}
					}else*/ if(!$isLoggedIn && !empty($email)){
						#024 27-11-2014 #24227, bengine(ERP) > Introduce Placeholder changes for customer module.
							#024 17-02-2015 #27038, Partner reg. > email content issue
								$params = array('admin_id' => @$admin_id,
												'partner_id' => @$partner_id,
												'customer_id' => @$data['customer_id'],
												'first_name' => @$first_name,
												'last_name' => @$last_name,
												'cellphone' => @$cellphone,
												'email' => @$email,
												'user_id' => @$data['user_id'],
												'login_id' => @$data['login_id'],
												'type' => @$type,
												'to_address' => @$email,
												'from_name' => @$from_name,
												'to_name' => @$last_name.' '.@$first_name,
												'email_verification_link' => @$email_verification_link,
												'login_verification_link' => @$login_verification_link,);
							#024 17-02-2015 #27038, Partner reg. > email content issue				 
						#024 27-11-2014 #24227, bengine(ERP) > Introduce Placeholder changes for customer module.
						//$params['password'] = $this->Logins->makePassword($password);
						# Send Verification Email
						$status = $this->Mailings->sendVerificationEmail($params);
						#AppController::triggerSuccess($status); return;
						if($status){
							$data['verificationEmail'] = 'send';
						}
					}
				}
				catch(Exception $e)
				{
					AppController::triggerCustomError(array('emailError' => 'Email sending failed','data' => $data));
					return;
				}
				
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {

			// Rollback transaction
			$db->rollback($this);

			AppController::triggerError($e);
		}
	}

/**
 * addBusiness method
 *
 * @throws NotFoundException
 * @param 
 * @return void
 */
	public function addBusiness()
	{
		try {

			# Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
			
			# Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			$isLoggedIn = isset($tokenData['MEMBER']['LoginGroupId'])?true:false;
			
			# Get the Admin ID
			$admin_id = $this->getPostData('admin_id');
			if(empty($admin_id)){
				$admin_id = getAdminId();
			}			
			
			# Populate the input parameters
			$user_group_id = $this->getPostData('user_group_id');
			$partner_id = $this->getPostData('partner_id');
			$accept_tnc = $this->getPostData('tnc');

			if(!$accept_tnc && !$isLoggedIn) {
				throw new ApplicationException($this->Customers->getMessageString('tnc_not_selected'));
			}
			
			// Business information
			$ein = $this->getPostData('ein');
			$customer_name = $this->getPostData('customer_name');
			$address1 = $this->getPostData('address1');
			$address2 = $this->getPostData('address2');
			$city = $this->getPostData('city');
			$zip = $this->getPostData('zip');
			$country = $this->getPostData('country', DEFAULT_COUNTRY);
			$phone_code = $this->getPostData('phone_code');
			$phone = $this->getPostData('phone');
			$directory = $this->getPostData('directory');

			$first_name = $this->getPostData('first_name');
			$last_name = $this->getPostData('last_name');
			$cell_code = $this->getPostData('cell_code');
			$cellphone = $this->getPostData('cellphone');
			$email = $this->getPostData('email');
			$password = $this->getPostData('password');
			$conf_password = $this->getPostData('conf_password');
			$login_link = $this->getPostData('login_link');
			$email_verification_link = $this->getPostData('email_verification_link');
			$login_verification_link = $this->getPostData('login_verification_link');
			$forgot_password_link = $this->getPostData('forgot_password_link'); /*Not required during registration*/
			$from_name = $this->getPostData('from_name');
			$ip_address = $this->getPostData('ip_address');
			$lang = $this->getPostData('lang','nb');
			$type = $this->getPostData('type');
			$send_contact_details = $this->getPostData('send_contact_details');
			
			/*************** #024 10-03-2015 #27534 Code to add delivery address for agent panel ***********************/
				$delivery_name = $this->getPostData('delivery_name');
				$delivery_address1 = $this->getPostData('delivery_address1');
				$delivery_address2 = $this->getPostData('delivery_address2');
				$delivery_zip = $this->getPostData('delivery_zip');
				$delivery_city = $this->getPostData('delivery_city');
				$delivery_country = $this->getPostData('delivery_country');
			/*************** #024 10-03-2015 #27534 Code to add delivery address for agent panel ***********************/
			#024 05-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
				$default_distribution = $this->getPostData('default_distribution');
				$business_default_contact = $this->getPostData('business_default_contact');
				$default_distribution_address = $this->getPostData('default_distribution_address');	
			#024 05-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
			
			$ask_every_time_session_new_customer = $this->getPostData('ask_every_time_session_new_customer');
			
			/*BUG #21162  BY: 054   31 JULY 2014*/
			$price_group = $this->getPostData('price_group');
			$customer_group_id = $this->getPostData('customer_group_id'); #044 03-11-2015 #0032715: Booking engine > Customer groups
			
			$receive_mass_emails = $this->getPostData('receive_mass_emails'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
			$receive_mass_sms = $this->getPostData('receive_mass_sms'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
			
			#024 07-03-2016 #34100, Feedback, new customer form
				$same_postal_address = $this->getPostData('same_postal_address');
				$delivery_address1 = $this->getPostData('delivery_address1');
				$delivery_address2 = $this->getPostData('delivery_address2');
				$delivery_zip = $this->getPostData('delivery_zip');
				$delivery_city = $this->getPostData('delivery_city');
				$delivery_country = $this->getPostData('delivery_country');
			#024 07-03-2016 #34100, Feedback, new customer form
			
			# BUG ID: 21394; BY: 018, On: 27 AUG 2014
			if($isLoggedIn){
				$password = randomPassword();
				$conf_password = $password;
			}
			
			$chk_dup_customers = $this->getPostData('chk_dup_customers');
			
			$input_params = array(
				'user_group_id'	=> $user_group_id,
				'admin_id'	=> $admin_id,
				'partner_id'=> $partner_id,
				
				'ein'		=> $ein,
				'customer_name' => $customer_name,
				'address1'	=> $address1,
				'address2'	=> $address2,
				'zip'		=> $zip,
				'city'		=> $city,
				'country'	=> $country,
				'phone_code'=> $phone_code,
				'phone'		=> $phone,
				'directory' => $directory,

				'first_name'=> $first_name,
				'last_name' => $last_name,	
				'cell_code'	=> $cell_code,
				'cellphone'	=> $cellphone,
				'email'		=> $email,
				'password' => $password,
				'conf_password' => $conf_password,
				
				'ip_address' => $ip_address,

				'price_group' => $price_group,/*BUG #21162  BY: 054  31 JULY 2014*/
				'customer_group_id' => $customer_group_id, #044 03-11-2015 #0032715: Booking engine > Customer groups
				# 024 10-03-2015 #27534 Code to add delivery address for agent panel
					'delivery_name'=> $delivery_name,
					'delivery_address1' => $delivery_address1,	
					'delivery_address2'	=> $delivery_address2,
					'delivery_zip'	=> $delivery_zip,
					'delivery_city'		=> $delivery_city,
					'delivery_country' => $delivery_country,
				# 024 10-03-2015 #27534 Code to add delivery address for agent panel
				#024 05-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
					'default_distribution' => $default_distribution,
					'business_default_contact'	=> $business_default_contact,
					'default_distribution_address' => $default_distribution_address,
				#024 05-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
				'chk_dup_customers' => $chk_dup_customers,
				'receive_mass_emails' => $receive_mass_emails, #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				'receive_mass_sms' => $receive_mass_sms, #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				#024 07-03-2016 #34100, Feedback, new customer form
					'same_postal_address'	=> $same_postal_address,
					'delivery_address1'		=> $delivery_address1,
					'delivery_address2'		=> $delivery_address2,
					'delivery_zip'			=> $delivery_zip,
					'delivery_city'			=> $delivery_city,
					'delivery_country'		=> $delivery_country,
				#024 07-03-2016 #34100, Feedback, new customer form
				);
			
			$data = $this->Customers->addBusiness($input_params);
					
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {

				// Rollback transaction
				$db->rollback($this);

				AppController::triggerCustomError($data);
			} else {

				//Commit transaction
				$db->commit($this);
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('business_add_success'));
				
				try{
					# Registration Confirmation email
					
					if(isset($send_contact_details) && $send_contact_details == '1'){
						
						if($ask_every_time_session_new_customer == '1'){
						
							$params = array(
									'admin_id'	=> $admin_id,
									'partner_id'=> $partner_id,
									'user_id' => @$data['user_id'],
									'login_id' => @$data['login_id'],
									'customer_id' => @$data['customer_id'],
									'contact_id' => @$data['contact_id'],
									'login_link' => $login_link,
									'emailto' => $email,
									'password' => $password,
									'customer_name' => $first_name . " ".$last_name
							);
							
							$this->Customers->admin_id = $admin_id;
							$this->Customers->partner_id = $partner_id;
							//$return = $this->Customers->addTrigger($params);
							$return = $this->Customers->sendCustomerLoginDetails($params);//BUG:23203
							//AppController::triggerSuccess($return);return;
						}
						
						
						/*$params = array( 'user_id' => isset($data['user_id'])?$data['user_id']:'',
								'admin_id'	=> $admin_id,
								'type'	=> $type,
								'login_id' => isset($data['login_id'])?$data['login_id']:'',
								'partner_id' => $partner_id,
								'link' => $login_link,
								'lang' => $lang,
								'to_address' => $email,
								'from_name' => $from_name,
								'password' => $password,
								'to_name' => $last_name.' '.$first_name);
						
						$this->Mailings->admin_id = $admin_id;
						$this->Mailings->partner_id = $partner_id;
						$status = $this->Mailings->sendRegistrationConfirmationEmail($params); 
						*/
						/*if($status){
							$data['confirmationEmail'] = 'send';
						}*/
					}
										
					# Since, password field will not required when partner add new customer, thus we need to send forgot password link instead
					/* BUG ID: 21394; BY: 018, On: 27 AUG 2014 -  Now we would send password directly into registration email
					if($isLoggedIn && isset($send_contact_details) && $send_contact_details){
						$loginParams = array('email' => $email,
								'type' => 'customer',
								'admin_id' => $admin_id,
								'lang' => $lang,
								'link' => @$forgot_password_link,
								'partner_id' => $partner_id,
								'from_name' => partner_name(),
						);
						try{
							$loginResponse = $this->Logins->forgotPassword($loginParams);
							$data['forgotPasswordEmail'] = 'send';
						}catch(Exception $e){
							//No need to show error
						}
					}else*/if(!$isLoggedIn){
						#024 27-11-2014 #24227, bengine(ERP) > Introduce Placeholder changes for customer module.
							#024 17-02-2015 #27038, Partner reg. > email content issue
								$params = array('admin_id' => @$admin_id,
												'partner_id' => @$partner_id,
												'customer_id' => @$data['customer_id'],
												'first_name' => @$first_name,
												'last_name' => @$last_name,
												'cellphone' => @$cellphone,
												'email' => @$email,
												'user_id' => @$data['user_id'],
												'login_id' => @$data['login_id'],
												'type' => @$type,
												'to_address' => @$email,
												'from_name' => @$from_name,
												'to_name' => @$last_name.' '.@$first_name,
												'email_verification_link' => @$email_verification_link,
												'login_verification_link' => @$login_verification_link,);
							#024 17-02-2015 #27038, Partner reg. > email content issue				
						#024 27-11-2014 #24227, bengine(ERP) > Introduce Placeholder changes for customer module.
						//$params['password'] = $this->Logins->makePassword($password);
						
						# Send Verification Email
						$status = $this->Mailings->sendVerificationEmail($params);
						if($status){
							$data['verificationEmail'] = 'send';
						}
					}
				}
				catch(Exception $e)
				{
					AppController::triggerCustomError(array('emailError' => 'Email sending failed','data' => $data));
					return;
				}
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {

			// Rollback transaction
			$db->rollback($this);

			AppController::triggerError($e);
		}
	}


 /**
 * addOrganisation method
 *
 * @throws NotFoundException
 * @param 
 * @return void
 */
	public function addOrganisation()
	{
		try {

			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
			
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			
			// Get the Admin ID
			$admin_id = getAdminId();
			
			
			// Populate the input parameters
			$user_group_id = 3;		// Organisation = 3
			$partner_id = $this->getPostData('partner_id');
			$accept_tnc = $this->getPostData('tnc');

			if($accept_tnc != 'y') {
				throw new ApplicationException($this->Customers->getMessageString('tnc_not_selected'));
			}
			
			// Business information
			$ein = $this->getPostData('ein');
			$customer_name = $this->getPostData('customer_name');
			$address1 = $this->getPostData('address1');
			$address2 = $this->getPostData('address2');
			$city = $this->getPostData('city');
			$zip = $this->getPostData('zip');
			$country = $this->getPostData('country', DEFAULT_COUNTRY);
			$phone_code = $this->getPostData('phone_code');
			$phone = $this->getPostData('phone');
			$directory = $this->getPostData('directory');

			$first_name = $this->getPostData('first_name');
			$last_name = $this->getPostData('last_name');
			$cell_code = $this->getPostData('cell_code');
			$cellphone = $this->getPostData('cellphone');
			$email = $this->getPostData('email');
			$password = $this->getPostData('password');
			$conf_password = $this->getPostData('conf_password');
			$ip_address = $this->getPostData('ip_address');
			
			$input_params = array(
				'user_group_id'	=> $user_group_id,
				'admin_id'	=> $admin_id,
				'partner_id'=> $partner_id,
				
				'ein'		=> $ein,
				'customer_name' => $customer_name,
				'address1'	=> $address1,
				'address2'	=> $address2,
				'zip'		=> $zip,
				'city'		=> $city,
				'country'	=> $country,
				'phone_code'=> $phone_code,
				'phone'		=> $phone,
				'directory' => $directory,

				'first_name'=> $first_name,
				'last_name' => $last_name,	
				'cell_code'	=> $cell_code,
				'cellphone'	=> $cellphone,
				'email'		=> $email,
				'password' => $password,
				'conf_password' => $conf_password,
				
				'ip_address' => $ip_address,
				);

			$data = $this->Customers->addOrganisation($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {

				// Rollback transaction
				$db->rollback($this);

				AppController::triggerCustomError($data);
			} else {

				//Commit transaction
				$db->commit($this);
				
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('organisation_add_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {

			// Rollback transaction
			$db->rollback($this);

			AppController::triggerError($e);
		}
	}
	
/**
 * editCustomerGroupAndName method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function editCustomerGroupAndName($customer_id = null)
	{
		try {
			$user_group_id = $this->getPostData('user_group_id');
			$customer_name = $this->getPostData('customer_name');
			
			$input_params = array(
				'user_group_id' => $user_group_id,
				'customer_name' => $customer_name,
				);

			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editCustomerGroupAndName($input_params);

			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

/**
 * editCustomerAddress method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function editCustomerAddress()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$address1 = $this->getPostData('address1');
			$address2 = $this->getPostData('address2');
			$zip = $this->getPostData('zip');
			$city = $this->getPostData('city');
			$customer_email = $this->getPostData('customer_email');
			$customer_name = $this->getPostData('customer_name');
			
			$delivery_address1 = $this->getPostData('delivery_address1');
			$delivery_address2 = $this->getPostData('delivery_address2');
			$delivery_zip = $this->getPostData('delivery_zip');
			$delivery_city = $this->getPostData('delivery_city');
			$delivery_country = $this->getPostData('delivery_country');			

			if(!empty($address1))
				$input_params['address1'] = $address1;
			if(isset($address2))
				$input_params['address2'] = $address2;
					
			if(!empty($customer_name))
				$input_params['customer_name'] = $customer_name;
			if(!empty($zip))
				$input_params['zip'] = $zip;
			if(!empty($city))
				$input_params['city'] = $city;	
			if(!empty($customer_email))
				$input_params['customer_email'] = $customer_email;	
			if(!empty($delivery_address1))
				$input_params['delivery_address1'] = $delivery_address1;	
			if(!empty($delivery_address2))
				$input_params['delivery_address2'] = $delivery_address2;	
			if(!empty($delivery_zip))
				$input_params['delivery_zip'] = $delivery_zip;	
			if(!empty($delivery_city))
				$input_params['delivery_city'] = $delivery_city;	
			if(!empty($delivery_country))
				$input_params['delivery_country'] = $delivery_country;	
									
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editCustomerAddress($input_params);

			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	public function editCustomerUserGroup()
	{
		try
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$user_group_id = $this->getPostData('user_group_id');
			$customer_ein = $this->getPostData('customer_ein');
			$customer_country = $this->getPostData('customer_country');
			$dob = $this->getPostData('customer_dob');
						
			$this->Partners->admin_id = $admin_id;
			$userGroupDetails = $this->Partners->getUserGroupDetails($user_group_id);
			if(empty($userGroupDetails)){
				throw new ApplicationException($this->Partners->getMessageString('user_group_invalid'));
			}
			
			$input_params = array(
					'user_group_id' => $user_group_id,
			);
			
			if(isset($userGroupDetails['UserGroup']['ein_required'])){
				if(($userGroupDetails['UserGroup']['ein_required'])){
					$input_params['ein'] = $customer_ein;
					$input_params['customer_country'] = $customer_country;
				}else{
					$input_params['dob'] = $dob;
				}
			}else{
				throw new ApplicationException($this->Customers->getMessageString('customer_edit_failed'));
			}
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editCustomerUserGroup($input_params);
	
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}
	
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	public function editCustomerLocation()
	{
		try
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$zip = $this->getPostData('zip');
			$city = $this->getPostData('city');
			$country = $this->getPostData('country');
			
			$phone_code = $this->getPostData('phone_code');
			$phone = $this->getPostData('phone');
			$cell_code = $this->getPostData('cell_code');
			$cellphone = $this->getPostData('cellphone');
	
			$input_params = array(
					'zip' => $zip,
					'city' => $city,
					'country' => $country,
					'phone_code' => $phone_code,
					'phone' => $phone,
					'cell_code' => $cell_code,
					'cellphone' => $cellphone,
			);
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editCustomerLocation($input_params);
	
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}
	
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function editCustomerPhone()
	{
		try
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$phone_code = $this->getPostData('phone_code');
			$phone = $this->getPostData('phone');
			$country = $this->getPostData('country');
	
			$input_params = array(
					'phone_code' => $phone_code,
					'phone' => $phone,
					'country' => $country,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editCustomerPhone($input_params);
	
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}
	
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	public function editCustomerCellPhone()
	{
		try
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$cell_code = $this->getPostData('cell_code');
			$cellphone = $this->getPostData('cellphone');
			$country = $this->getPostData('country');
	
			$input_params = array(
					'cell_code' => $cell_code,
					'cellphone' => $cellphone,
					'country' => $country,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editCustomerCellPhone($input_params);
	
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}
	
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
/**
 * editUserEmail method
 *
 * @throws NotFoundException
 * @param string $user_id
 * @return void
 */
	public function editUserEmail($user_id = null)
	{
		try {
			$email = $this->getPostData('email');
			
			$input_params = array(
				'user_id' => $user_id,
				'email' => $email,
				);
			$data = $this->Customers->editUserEmail($input_params);

			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
/**
 * editUserContactName method
 *
 * @throws NotFoundException
 * @param string $user_id
 * @return void
 */
	public function editUserContactName($user_id = null)
	{
		try {
			$first_name = $this->getPostData('first_name');
			$last_name = $this->getPostData('last_name');
			
			$input_params = array(
				'user_id' => $user_id,
				'first_name' => $first_name,
				'last_name' => $last_name,
				);
			$data = $this->Customers->editUserContactName($input_params);

			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	

/**
 * editUserContactNumbers method
 *
 * @throws NotFoundException
 * @param string $login_id
 * @return void
 */
	public function editUserContactNumbers($login_id = null)
	{
		try {
			$phone_code = $this->getPostData('phone_code');
			$phone = $this->getPostData('phone');
			$cell_code = $this->getPostData('cell_code');
			$cellphone = $this->getPostData('cellphone');
			
			$input_params = array(
				'login_id' => $login_id,
				'phone_code' => $phone_code,
				'phone' => $phone,
				'cell_code' => $cell_code,
				'cellphone' => $cellphone,
				);
			$data = $this->Customers->editUserContactNumbers($input_params);

			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}


 /**
 * addContact method
 *
 * @throws NotFoundException
 * @param 
 * @return void
 */
	public function addContact()
	{		
		try {
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
			
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			
			// Get the Admin ID
			$admin_id = getAdminId();
			
			$customer_id = $this->getPostData('customer_id');
				
			if(empty($customer_id)){
				throw new ApplicationException('Customer is unknown for the contact');
			}

			$email = $this->getPostData('email');
			$first_name = $this->getPostData('first_name');
			$last_name = $this->getPostData('last_name');
			
			# BUG ID : 17644 , 024	 
			/*$address1 = $this->getPostData('address1');
			$address2 = $this->getPostData('address2');
			$zip = $this->getPostData('zip');
			$city = $this->getPostData('city'); */
			$country = $this->getPostData('country', $default_value = DEFAULT_COUNTRY);

			/* $password = $this->getPostData('password');
			$conf_password = $this->getPostData('conf_password');  */
			$login_group_id = $this->getPostData('group_id');
			$cell_code = $this->getPostData('cell_code');
			$cellphone = $this->getPostData('cellphone');
			$phone_code = $this->getPostData('phone_code');
			$phone = $this->getPostData('phone');
			$ip_address = $this->getPostData('ip_address');
			$send_contact_details = $this->getPostData('send_contact_details');
			$forgot_password_link = $this->getPostData('forgot_password_link');
			$contact_receive_mass_emails = $this->getPostData('contact_receive_mass_emails'); #044 06-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01 start
			$contact_receive_mass_sms = $this->getPostData('contact_receive_mass_sms'); #044 06-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01 start
			$default_contact = $this->getPostData('default_contact'); #044 18-jan-2016 0033600: BE > Booking Engine Updates - 16 January 2016 > mass communication > 02
			
			#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card
				$phone_country_code = $this->getPostData('phone_country_code');
				$cellphone_country_code = $this->getPostData('cellphone_country_code');
			#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card
			
			$input_params = array(
				'admin_id'	=> $admin_id,
				'email'		=> $email,
				'first_name'=> $first_name,
				'last_name' => $last_name,

				# BUG ID : 17644 , 024
				/*'address1'	=> $address1,
				'address2'	=> $address2,
				'zip'		=> $zip,
				'city'		=> $city,
				'password' => $password,
				'conf_password' => $conf_password,  */
				#####
				
				'country'	=> $country,
				'login_group_id' => $login_group_id,
				'cell_code'	=> $cell_code,
				'cellphone'	=> $cellphone,
				'phone_code'=> $phone_code,
				'phone'		=> $phone,
				'ip_address' => $ip_address,
				'send_contact_details' => $send_contact_details,
				'contact_receive_mass_emails' => $contact_receive_mass_emails, #044 06-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01 start
				'contact_receive_mass_sms' => $contact_receive_mass_sms, #044 06-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01 start
				'default_contact' => $default_contact, #044 18-jan-2016 0033600: BE > Booking Engine Updates - 16 January 2016 > mass communication > 02
				#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card
					'phone_country_code' => $phone_country_code,
					'cellphone_country_code' => $cellphone_country_code,
				#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card	
				);
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->addContact($input_params);
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {

				// Rollback transaction
				$db->rollback($this);

				AppController::triggerCustomError($data);
			} else {

				//Commit transaction
				$db->commit($this);
				
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_contact_add_success'));
				
				# Since, password field will not required when partner add new customer, thus we need to send forgot password link instead
				#BUG ID : 17629 , 024
				/*if(!empty($tokenData) && isset($send_contact_details) && $send_contact_details){
					$loginParams = array('email' => $email,
							'type' => 'customer',
							'admin_id' => $admin_id,
							'lang' => Configure::read('tokenData.Config.lang'),
							'link' => @$forgot_password_link,
							'partner_id' => partner_preference(),
							'from_name' => partner_name(),
					);
					try{
						$loginResponse = $this->Logins->forgotPassword($loginParams);
						$data['forgotPasswordEmail'] = 'send';
					}catch(Exception $e){
						//No need to show error
					}
				} */
				AppController::triggerSuccess($data);
			}
			
		} catch (Exception $e) {

			// Rollback transaction
			$db->rollback($this);

			AppController::triggerError($e);
		}
	}


 /**
 * editContact method
 *
 * @throws NotFoundException
 * @param 
 * @return void
 */
	public function editContact()
	{		
		try {
			
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
			
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$contact_id = $this->getPostData('contact_id');
			
			$email = $this->getPostData('email');
			$first_name = $this->getPostData('first_name');
			$last_name = $this->getPostData('last_name');
			/* $address1 = $this->getPostData('address1');
			$address2 = $this->getPostData('address2');
			$zip = $this->getPostData('zip');
			$city = $this->getPostData('city');*/
			$password = $this->getPostData('password'); #044 21-june-2016 0035097: BE > Improvements, customer portal + adding ability for customers
			$conf_password = $this->getPostData('conf_password');  #044 21-june-2016 0035097: BE > Improvements, customer portal + adding ability for customers
			$country = $this->getPostData('country', $default_value = DEFAULT_COUNTRY);
			$ip_address = $this->getPostData('ip_address');
			$status = $this->getPostData('status');
			$cell_code = $this->getPostData('cell_code');
			$cellphone = $this->getPostData('cellphone');
			$phone_code = $this->getPostData('phone_code');
			$phone = $this->getPostData('phone');
			$send_contact_details = $this->getPostData('send_contact_details');
			$link = $this->getPostData('link');
			$contact_receive_mass_emails = $this->getPostData('contact_receive_mass_emails');
			$contact_receive_mass_sms = $this->getPostData('contact_receive_mass_sms');
			$default_contact = $this->getPostData('default_contact'); #044 18-jan-2016 0033600: BE > Booking Engine Updates - 16 January 2016 > mass communication > 02
			#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card
				$phone_country_code = $this->getPostData('phone_country_code');
				$cellphone_country_code = $this->getPostData('cellphone_country_code');
			#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card
			#024 11-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact
				$linked_email_customer = $this->getPostData('linked_email_customer');
				$select_customer = $this->getPostData('select_customer');
			#024 11-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact
			//#024 07-04-2017 #457: Fwd: Bengine(ERP) Updates 24-03-2017
				$is_customer_default_contact = $this->getPostData('is_customer_default_contact');
				$update_phone = $this->getPostData('update_phone');
				$update_cellphone = $this->getPostData('update_cellphone');
				$update_email = $this->getPostData('update_email');
			//#024 07-04-2017 #457: Fwd: Bengine(ERP) Updates 24-03-2017
			
			$input_params = array(
				'contact_id'	=> $contact_id,
				'email'		=> $email,
				'first_name'=> $first_name,
				'last_name' => $last_name,
					
				# BUG ID : 17644 , 024
				/* 'address1'	=> $address1,
				'address2'	=> $address2,
				'zip'		=> $zip,
				'city'		=> $city,*/
				'password'  => $password, #044 21-june-2016 0035097: BE > Improvements, customer portal + adding ability for customers
				'conf_password' => $conf_password,  #044 21-june-2016 0035097: BE > Improvements, customer portal + adding ability for customers
				####
				
				'country'	=> $country,
				'ip_address'	=> $ip_address,
				'status' => $status,
				'cell_code' => $cell_code,
				'cellphone' => $cellphone,
				'phone_code' => $phone_code,
				'phone' => $phone,
				'send_contact_details' => $send_contact_details,
				'link' => $link,
				'contact_receive_mass_emails' => $contact_receive_mass_emails,
				'contact_receive_mass_sms' => $contact_receive_mass_sms,
				'default_contact' => $default_contact, #044 18-jan-2016 0033600: BE > Booking Engine Updates - 16 January 2016 > mass communication > 02
				#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card
					'phone_country_code'=> $phone_country_code,
					'cellphone_country_code' => $cellphone_country_code,
				#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card
				#024 11-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact
					'linked_email_customer'	=> $linked_email_customer,
					'select_customer' 		=> $select_customer,
					'is_customer_default_contact' => @$is_customer_default_contact,
				#024 11-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact
				//#024 12-04-2017 #457: Fwd: Bengine(ERP) Updates 24-03-2017
					'update_phone' => @$update_phone,
					'update_cellphone' => @$update_cellphone,
					'update_email' => @$update_email,
				//#024 12-04-2017 #457: Fwd: Bengine(ERP) Updates 24-03-2017	
			);
			
			
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editContact($input_params);
			#AppController::triggerSuccess($data); return;
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {

				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {

				//Commit transaction
				$db->commit($this);
				
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_contact_edit_success'));
				AppController::triggerSuccess($data);
			}
			
		} catch (Exception $e) {

			// Rollback transaction
			$db->rollback($this);

			AppController::triggerError($e);
		}
	}
	
	/**
	 * deleteContact method
	 *
	 * @throws NotFoundException
	 * @param
	 * @return void
	 */
	public function deleteContact()
	{
		try {
	
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			// Authenticate the loggedin user & get the admin id
			$tokenData = Configure::read('tokenData');
			$admin_id = getAdminId();
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
			$contact_id = $this->getPostData('contact_id');
	
			$input_params = array(
					'contact_id'	=> $contact_id,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->deleteContact($input_params);
			#AppController::triggerSuccess($data); return;
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				//Commit transaction
				$db->commit($this);
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_contact_delete_success'));
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			// Rollback transaction
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}
	
	

/**
 * delete method
 *
 * @throws NotFoundException
 * @param string $id
 * @return void
 */
	public function delete($id = null) {
		try {
			$this->request->onlyAllow('post', 'delete');
			$this->Customers->customer_id = $id;
			if(!$this->Customers->deleteCustomer()) {
				throw new ApplicationException($this->Customers->getMessageString('delete_failed'));
			}
			$data = AppController::getAlertNotificationMessage($this->Customers->getMessageString('delete_success'));
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}


/**
 * getBillingAddress method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function getBillingAddress($customer_id = null)
	{
		try {
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getBillingAddress();
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

/**
 * viewBillingAddress method
 *
 * @throws NotFoundException
 * @param string $id
 * @return void
 */
	public function viewBillingAddress($id = null)
	{
		try {
			$data = $this->Customers->viewBillingAddress($id);
			if(empty($data)) {
				throw new ApplicationException($this->Customers->getMessageString('billing_address_invalid'));
			}
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}


/**
 * addBillingAddress method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function addBillingAddress($customer_id = null)
	{
		try {
			$this->request->onlyAllow('post', 'put');
			
			$address1 = isset($this->request->query['address1']) ? $this->request->query['address1'] : '';
			$address2 = isset($this->request->query['address2']) ? $this->request->query['address2'] : '';
			$city = isset($this->request->query['city']) ? $this->request->query['city'] : '';
			$state = isset($this->request->query['state']) ? $this->request->query['state'] : '';
			$zip = isset($this->request->query['zip']) ? $this->request->query['zip'] : '';
			$country_code = isset($this->request->query['country_code']) ? $this->request->query['country_code'] : '';
			$valid_from = isset($this->request->query['valid_from']) ? $this->request->query['valid_from'] : '';
			
			$input_params = array(
				'customer_id' => $customer_id,
				'address1'	=> $address1,
				'address2'	=> $address2,
				'city'		=> $city,
				'state'		=> $state,
				'zip'		=> $zip,
				'country_code' => $country_code,
				'valid_from'	=> $valid_from,
				);
			
			$this->Customers->customer_id = $customer_id;
			$response = $this->Customers->addBillingAddress($input_params);
			if($response == true) {
				$data = AppController::getAlertNotificationMessage($this->Customers->getMessageString('billing_address_add_success'));
				AppController::triggerSuccess($data);
			}
			AppController::triggerCustomError($response);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

/**
 * addBillingAddress method
 *
 * @throws NotFoundException
 * @param string $billing_id
 * @return void
 */
	public function editBillingAddress($billing_id = null)
	{
		try {
			$this->request->onlyAllow('post', 'put');
			
			$customer_id = isset($this->request->query['customer_id']) ? $this->request->query['customer_id'] : '';
			$address1 = isset($this->request->query['address1']) ? $this->request->query['address1'] : '';
			$address2 = isset($this->request->query['address2']) ? $this->request->query['address2'] : '';
			$city = isset($this->request->query['city']) ? $this->request->query['city'] : '';
			$state = isset($this->request->query['state']) ? $this->request->query['state'] : '';
			$zip = isset($this->request->query['zip']) ? $this->request->query['zip'] : '';
			$country_code = isset($this->request->query['country_code']) ? $this->request->query['country_code'] : '';
			$valid_from = isset($this->request->query['valid_from']) ? $this->request->query['valid_from'] : '';
			
			$input_params = array(
				'customer_id' => $customer_id,
				'address1'	=> $address1,
				'address2'	=> $address2,
				'city'		=> $city,
				'state'		=> $state,
				'zip'		=> $zip,
				'country_code' => $country_code,
				'valid_from'	=> $valid_from,
				);
			
			$this->Customers->customer_id = $customer_id;
			$response = $this->Customers->editBillingAddress($billing_id, $input_params);
			if($response == true) {
				$data = AppController::getAlertNotificationMessage($this->Customers->getMessageString('billing_address_edit_success'));
				AppController::triggerSuccess($data);
			}
			AppController::triggerCustomError($response);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

/**
 * deleteBillingAddress method
 *
 * @throws NotFoundException
 * @param string $billing_id
 * @return void
 */
	public function deleteBillingAddress($billing_id = null)
	{
		try {
			$this->request->onlyAllow('post', 'delete');
			
			if(!$this->Customers->deleteBillingAddress($billing_id)) {
				throw new ApplicationException($this->Customers->getMessageString('billing_address_delete_failed'));
			}
			$data = AppController::getAlertNotificationMessage($this->Customers->getMessageString('billing_address_delete_success'));
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

/**
 * currentBillingAddress method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function currentBillingAddress($customer_id = null)
	{
		try {
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->currentBillingAddress();
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

/**
 * contactList method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function contactList()
	{
		try {
			// Authenticate the loggedin user & get the partner_id
			$tokenData = Configure::read('tokenData');
			$admin_id = getAdminId();
			
			// Populate the input parameters
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
			$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
			$sort = $this->getPostData('sort', 'modified_date');
			$direction = $this->getPostData('direction', 'desc');
			$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
			$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
			
			$first_name = $this->getPostData('first_name');
			$last_name = $this->getPostData('last_name');
			$status = $this->getPostData('status');
			$email = $this->getPostData('email');
			
			$input_params = array(
					'page' => $page,
					'sort' => $sort,
					'direction' => $direction,
					'limit' => $limit,
					'maxLimit' => $maxLimit,
					
					'first_name' => $first_name,
					'last_name' => $last_name,
					'status' => $status,
					'email' => $email,
			);
			
			$this->Customers->customer_id = $customer_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->admin_id = $admin_id;
			$data = $this->Customers->getContactList($input_params);
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

/**
 * viewContact method
 *
 * @throws NotFoundException
 * @param string $contact_id
 * @return void
 */
	public function viewContact()
	{
		try 
		{
			$tokenData = Configure::read('tokenData');
			$admin_id = getAdminId();
			
			// Populate the input parameters
			$customer_id = $this->getPostData('customer_id');
			$contact_id = $this->getPostData('contact_id');
			$default = $this->getPostData('default');
			
			$iParams = array(
					'contact_id' => $contact_id,
					'default' => $default,
			);
			$this->Customers->admin_id = $admin_id;
			$this->Customers->customer_id = $customer_id;
			
			$data = $this->Customers->viewContact($iParams); //AppController::triggerSuccess($data); return;
			if($data)
			{
				#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card
					######### For Getting Phone code #######
					if(!empty($data['Login']['phone_country_code'])){
						$phone_country_code = $data['Login']['phone_country_code'];	
					}else{
						$phone_country_code = $data['User']['country'];
					}
					
					######### For Getting Phone code #######
					if(!empty($data['Login']['cellphone_country_code'])){
						$cellphone_country_code = $data['Login']['cellphone_country_code'];	
					}else{
						$cellphone_country_code = $data['User']['country'];
					}
				
					$splitPhoneArr = $this->Partners->splitPhoneNumbers($phone_country_code,$data['Login']['phone']);
					$splitCellPhoneArr = $this->Partners->splitPhoneNumbers($cellphone_country_code,$data['Login']['cellphone']);
				#024 20-06-2016 #35115, BE > Booking Engine Updates - 17 june 2016 > More addressing issues, customer card
				
				# Phone
				$data['Login']['ph_code'] = @$splitPhoneArr['code'];
				$data['Login']['phone'] = @$splitPhoneArr['number'];
			
				# Cellphone
				$data['Login']['cp_code'] = @$splitCellPhoneArr['code'];
				$data['Login']['cellphone'] = @$splitCellPhoneArr['number'];
			}
			AppController::triggerSuccess($data);
		} 
		catch (Exception $e) 
		{
			AppController::triggerError($e);
		}
	}



/**
 * activites method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function activities($customer_id = null)
	{
		try {
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getActivities();
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}


/**
 * getCountries method
 *
 * @throws NotFoundException
 * @param string 
 * @return void
 */
	public function getCountries($partner_id = null)
	{
		try {
			$this->Customers->partner_id = $partner_id;
			$data = $this->Customers->getCountryList();
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}


	public function getCustomerContactList()
	{
		try {
			// Authenticate the loggedin user
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$customers = $this->Customers->getCustomerContactList();
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function updateCustomerDefaultContact()
	{
		try {
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
			
			$admin_id = getAdminId();		
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
			$contact_id = $this->getPostData('contact_id');
			
			$input_params = array(
				'contact_id' => $contact_id,
			);
		
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->updateCustomerDefaultContact($input_params);
			//AppController::triggerSuccess($data);
			//return;
			
			if(isset($data['error'])) {

				// Rollback transaction
				$db->rollback($this);

				AppController::triggerCustomError($data);
			} else {

				//Commit transaction
				$db->commit($this);
				
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_contact_edit_success'));
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function isTaxApplicableToCustomer()
	{
		try
		{
			$admin_id = getAdminId();
		
			// Populate the input parameters
			$customer_id = $this->getPostData('customer_id');

			$this->Customers->admin_id = $admin_id;
			$this->Customers->customer_id = $customer_id;
		
			$data = $this->Customers->isTaxApplicableToCustomer();

			AppController::triggerSuccess($data);
		}
		catch (Exception $e)
		{
			AppController::triggerError($e);
		}
	}

		#Edit Delivery Name
	/**
 * editDeliveryName method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function editDeliveryName()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$delivery_name = $this->getPostData('delivery_name');
						
			$input_params = array(
				'delivery_name' => $delivery_name,
				);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editDeliveryName($input_params);

			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	#Edit Delivery Address
	/**
 * editDeliveryAddress method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function editDeliveryAddress()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$delivery_address1 = $this->getPostData('delivery_address1');
			$delivery_address2 = $this->getPostData('delivery_address2');
						
			$input_params = array(
				'delivery_address1' => $delivery_address1,
				'delivery_address2' => $delivery_address2,
				);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editDeliveryAddress($input_params);

			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	#Edit Delivery Location
	/**
 * editDeliveryLocation method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function editDeliveryLocation()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$delivery_zip = $this->getPostData('delivery_zip');
			$delivery_city = $this->getPostData('delivery_city');
			$delivery_country = $this->getPostData('delivery_country');
						
			$input_params = array(
				'delivery_zip' => $delivery_zip,
				'delivery_city' => $delivery_city,
				'delivery_country' => $delivery_country,
				);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editDeliveryLocation($input_params);

			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function getLocation()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getLocation();
			AppController::triggerSuccess($data);
		

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	public function validateCustomerInformation()
	{
		try
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
		
			$this->Customers->admin_id = $admin_id;
			
			$ein = $this->getPostData('customer_ein');
			$customer_name = $this->getPostData('customer_name');
			$address1 = $this->getPostData('customer_address1');
			$address2 = $this->getPostData('customer_address2');
			$city = $this->getPostData('customer_city');
			$zip = $this->getPostData('customer_zip');
			$country = $this->getPostData('customer_country');
			$email = $this->getPostData('customer_email');
			$ein_required = $this->getPostData('ein_required');
			
			$input_params = array(
				'customer_ein'			=> $ein,
				'customer_name' => $customer_name,
				'customer_address1'		=> $address1,
				'customer_address2'		=> $address2,
				'customer_zip'			=> $zip,
				'customer_city'			=> $city,
				'customer_country'		=> $country,
				'customer_email'			=> $email,
				'ein_required' => $ein_required,
			);
			
			
			$data = $this->Customers->validateCustomerInformation($input_params);
			
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {			
				AppController::triggerCustomError($data);
			} else {
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function getCustomerBalance()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$owner_type = $this->getPostData('owner_type');

			$input_params = array(
				'owner_type' => $owner_type
			);
		
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getCustomerBalance($input_params);
			AppController::triggerSuccess($data);
		

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function getOverdueBalance()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$owner_type = $this->getPostData('owner_type');

			$input_params = array(
				'owner_type' => $owner_type
			);

			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getOverdueBalance($input_params);
			AppController::triggerSuccess($data);
		

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function getOpenInvoices()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');

			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getOpenInvoices();
			AppController::triggerSuccess($data);
		

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function editCustomerDetails()
	{
		try
		{
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
			
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$user_group_id = $this->getPostData('user_group_id');
			$customer_name = $this->getPostData('customer_name');
			$customer_ein = $this->getPostData('customer_ein');
			$address1 = $this->getPostData('address1');
			$address2 = $this->getPostData('address2');
			$city = $this->getPostData('city');
			$zip = $this->getPostData('zip');
			$country = $this->getPostData('country', DEFAULT_COUNTRY);
			$phone_code = $this->getPostData('phone_code');
			$phone = $this->getPostData('phone');
			$cell_code = $this->getPostData('cell_code');
			$cellphone = $this->getPostData('cellphone');
			$email = $this->getPostData('email');
			$dob = $this->getPostData('dob');
			$status = $this->getPostData('status');
						
			$delivery_address1 = $this->getPostData('delivery_address1');
			$delivery_address2 = $this->getPostData('delivery_address2');
			$delivery_country = $this->getPostData('delivery_country');
			$delivery_city = $this->getPostData('delivery_city');
			$delivery_zip = $this->getPostData('delivery_zip');
			
			$receive_mass_emails = $this->getPostData('receive_mass_emails'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
			$receive_mass_sms = $this->getPostData('receive_mass_sms'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
			$apply_to_all_contacts = $this->getPostData('apply_to_all_contacts'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
			
			/*BUG #21162  BY: 054   31 JULY 2014 */
			$price_group = $this->getPostData('price_group');
			$customer_group_id = $this->getPostData('customer_group_id'); #044 03-11-2015 #0032715: Booking engine > Customer groups
			
			#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
				$business_default_distribution = $this->getPostData('business_default_distribution');
				$business_default_contact = $this->getPostData('business_default_contact');
				$business_custom_email = $this->getPostData('business_custom_email');
			#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
			#024 25-06-2015 #30391, A few improvement suggestions, BE
				$payment_terms = $this->getPostData('payment_terms');
			#024 25-06-2015 #30391, A few improvement suggestions, BE
			#024 10-02-2016 #33899, BE > Grouping of customer information
				$do_not_send_reminders = $this->getPostData('do_not_send_reminders');
			#024 10-02-2016 #33899, BE > Grouping of customer information
						
			
			$infoParams = array(
					'customer_name'	=> $customer_name,
					'address1'	=> $address1,
					'address2'	=> $address2,
					'zip'		=> $zip,
					'city'		=> $city,
					'country'	=> $country,
					'email'		=> $email,
					'phone_code'=> $phone_code,
					'phone'		=> $phone,
					'cell_code'	=> $cell_code,
					'cellphone'	=> $cellphone,
					'status' 	=> $status,
					'user_group_id' => $user_group_id,
					
					'delivery_address1' => $delivery_address1,
					'delivery_address2' => $delivery_address2,
					'delivery_country' => $delivery_country,
					'delivery_city' => $delivery_city,
					'delivery_zip' => $delivery_zip,
					
					'price_group' => $price_group,
					'customer_group_id' => $customer_group_id, #044 03-11-2015 #0032715: Booking engine > Customer groups
					#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
						'business_default_distribution' => $business_default_distribution,
						'business_default_contact' => $business_default_contact,
						'business_custom_email' => $business_custom_email,
					#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
					#024 25-06-2015 #30391, A few improvement suggestions, BE
						'payment_terms' => $payment_terms,
					#024 25-06-2015 #30391, A few improvement suggestions, BE
					'receive_mass_emails' => $receive_mass_emails,  #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
					'receive_mass_sms' => $receive_mass_sms,  #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
					'apply_to_all_contacts' => $apply_to_all_contacts,  #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
					#024 10-02-2016 #33899, BE > Grouping of customer information
						'do_not_send_reminders' => $do_not_send_reminders	
					#024 10-02-2016 #33899, BE > Grouping of customer information
			); //
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			
			# Check customer user group
			$this->Partners->admin_id = $admin_id;
			$userGroupDetails = $this->Partners->getUserGroupDetails($user_group_id); 
			
			if(empty($userGroupDetails)){
				throw new ApplicationException($this->Partners->getMessageString('user_group_invalid'));
			}
			
			if(isset($userGroupDetails['UserGroup']['ein_required'])){
				if(($userGroupDetails['UserGroup']['ein_required'])){
					$infoParams['customer_ein'] = $customer_ein;
				}else{
					$infoParams['dob'] = $dob;
				}			
				
				$data = $this->Customers->editCustomerDetails($infoParams);
				
			}else{
				throw new ApplicationException($this->Customers->getMessageString('consumer_edit_failed'));
			}
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
				return;
			} else {
				$db->commit($this);
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			// Rollback transaction
			$db->rollback($this);
			AppController::triggerError($e);
		}
		
			
			/*$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$user_group_id = $this->getPostData('user_group_id');
			$customer_name = $this->getPostData('customer_name');
			$ein = $this->getPostData('ein');
			$zip = $this->getPostData('zip');
			$city = $this->getPostData('city');
			$country = $this->getPostData('country');			
			$phone_code = $this->getPostData('ph_code');
			$phone = $this->getPostData('phone');
			$cell_code = $this->getPostData('cc_code');
			$cellphone = $this->getPostData('cellphone');
			$address1 = $this->getPostData('address1');
			$address2 = $this->getPostData('address2');
			$email = $this->getPostData('email');

			$delivery_address1 = $this->getPostData('delivery_address1');
			$delivery_address2 = $this->getPostData('delivery_address2');
			$delivery_country = $this->getPostData('delivery_country');
			$delivery_city = $this->getPostData('delivery_city');
			$delivery_zip = $this->getPostData('delivery_zip');
	
			$input_params = array(
					'user_group_id' => $user_group_id,
					'customer_name' => $customer_name,
					'ein' =>$ein,
					'address1' => $address1,
					'address2' => $address2,
					'zip' =>$zip,
					'city' => $city,
					'country' => $country,
					'phone_code' => $phone_code,
					'phone' => $phone,
					'cell_code' => $cell_code,
					'cellphone' => $cellphone,
					'email' => $email,
					'delivery_address1' => $delivery_address1,
					'delivery_address2' => $delivery_address2,
					'delivery_country' => $delivery_country,
					'delivery_city' => $delivery_city,
					'delivery_zip' => $delivery_zip,
			);

			//AppController::triggerSuccess($customer_id);return;
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editCustomerDetails($input_params);
	
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}
	
		} catch (Exception $e) {
			AppController::triggerError($e);
		}*/
	}

	/**
	 * sendLoginDetails method
	 *
	 * @throws NotFoundException
	 * @param
	 * @return void
	 */
	public function sendLoginDetails()
	{
		try {
	
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			$admin_id = getAdminId();
			
			$customer_id = $this->getPostData('customer_id');
			$contact_id = $this->getPostData('contact_id');
			
			$email = $this->getPostData('email');
			$send_contact_details = $this->getPostData('send_contact_details');
			$link = $this->getPostData('link');
	
			$input_params = array('send_contact_details' => $send_contact_details,
								  'link' => $link,
								  'contact_id'	=> $contact_id,
								  'email' => $email);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->sendLoginDetails($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				//Commit transaction
				$db->commit($this);
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('login_details_send_success'));
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			// Rollback transaction
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}
	
	public function getContactDetailByEmail(){
		try
		{
			$admin_id = getAdminId();
			$partner_id = $this->getPostData('partner_id');
			$email = $this->getPostData('email');
			$customer_id = $this->getPostData('customer_id');
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getContactDetailByEmail($email);
			
			/*if($data)
			{
				$splitPhoneArr = $this->Partners->splitPhoneNumbers($data['country'],$data['phone']);
				$splitCellPhoneArr = $this->Partners->splitPhoneNumbers($data['country'],$data['cellphone']);
			
				# Phone
				$data['ph_code'] = @$splitPhoneArr['code'];
				$data['phone'] = @$splitPhoneArr['number'];
			
				# Cellphone
				$data['cp_code'] = @$splitCellPhoneArr['code'];
				$data['cellphone'] = @$splitCellPhoneArr['number'];
			}*/
			
			AppController::triggerSuccess($data);
	
	
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	
	}
	
	public function getCustomerName()
	{
		try
		{
			$admin_id = getAdminId();
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
		
			$params = array('customer_id' => $customer_id);	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$data = $this->Customers->getCustomerName($params);
		
			AppController::triggerSuccess($data);
		
		
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	public function getDeliveryMethodName()
	{
		try
		{
			$admin_id = getAdminId();
			$delivery_method = $this->getPostData('delivery_method');
	
			$params = array('delivery_method' => $delivery_method);
			$this->Customers->admin_id = $admin_id;
			$data = $this->Customers->getCustomerName($params);
	
			AppController::triggerSuccess($data);
	
	
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	#BUG : 20209  By 054  16 JULY 14
	public function getCustomerSuggestionsWithEmail()
	{
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
	
			// Get the Admin ID
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			$customer_name = $this->getPostData('customer_name');
			$status = $this->getPostData('status');
			$params = array(
					'customer_name' => $customer_name,
					'status' => $status,
			);
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$customers = $this->Customers->getCustomerSuggestionsWithEmail($params);
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	#BUG : 21942,  By 054  02 SEP 14
	public function getCustomersContactList()
	{
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
	
			// Get the Admin ID
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
			$search_text = $this->getPostData('search_text');
			$status = $this->getPostData('status');
			$params = array(
					'status' => $status,
					'customer_id' => $customer_id,
					'search_text' => $search_text
			);
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$customers = $this->Customers->getCustomersContactList($params);
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	#BUG : 20209  By 054  09 SEP 2014
	public function getCustomerListWithEmail()
	{
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
	
			// Get the Admin ID
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			$customer_name = $this->getPostData('customer_name');
			$status = $this->getPostData('status');
			$params = array(
					'customer_name' => $customer_name,
					'status' => $status,
			);
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$customers = $this->Customers->getCustomerListWithEmail($params);
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	#BUG:23808 ID: 61  13 NOV 14
	public function deleteCustomer()
	{
	try {
			// Authenticate the loggedin user
			$admin_id = getAdminId();
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
			
			$input_params = array(
			                         'partner_id' => $partner_id,
		                            'customer_id' => $customer_id,
								  );
		  
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			//return $input_params; exit;
			 
			$data = $this->Customers->deleteCustomerLine($input_params);
			AppController::triggerSuccess($data);
			  
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	/**
	 *	Issue No. 23943
	 *	Write API method to take input EIN(optional), email(optional), phone number, customer name. partner_id and lookup for customers. The result 
	 *  of this method should be array of matching customers addresses.
	 */
	public function searchCustomerAddresses() {
		try{
			$admin_id 		= getAdminId(); 
			$partner_id 	= $this->getPostData('partner_id');
			$ein 			= $this->getPostData('ein');
			$email 			= $this->getPostData('email');
			$customer_name 	= $this->getPostData('customer_name');
			$phone_number 	= $this->getPostData('phone_number');
			$cellphone_number = $this->getPostData('cellphone_number');
			
			$customer_type = $this->getPostData('customer_type');
			
			#29488, Fwd: Issue >> duplicate entry of customers
			$zip 	= $this->getPostData('zip');
			#29488, Fwd: Issue >> duplicate entry of customers
			
			$input_params 	= array(
			                    'partner_id' 	=> $partner_id,
		                        'ein' 			=> $ein,
		                        'email' 		=> $email,
		                        'customer_name' => $customer_name,
		                        'phone_number' 	=> $phone_number,
		                        'cellphone_number' => $cellphone_number,
		                        'zip' 	=> $zip,
							);

			$this->Customers->admin_id 	 = $admin_id;
			$this->Customers->partner_id = $partner_id;
			if($customer_type == 'business'){
				$data = $this->Customers->searchBusinessCustomerAddresses($input_params);	
			}else{
				$data = $this->Customers->searchCustomerAddresses($input_params);
			}
			AppController::triggerSuccess($data);

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	/**
 * editCustomerEmail method
 *
 * @throws NotFoundException
 * @param string $customer_id
 * @return void
 */
	public function editCustomerEmail()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$customer_email = $this->getPostData('customer_email');
			$input_params = array('customer_email' => $customer_email);	
								
			$this->Customers->admin_id = $admin_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->editCustomerEmail($input_params);
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				AppController::triggerCustomError($data);
			} else {
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
				AppController::triggerSuccess($data);
			}

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	
	public function updateReferrer()
	{
		try 
		{
			$admin_id = getAdminId();
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
			$is_referrer = $this->getPostData('is_referrer');
			
			$referrer_id = $this->getPostData('referrer_id');
			$referrer_number = $this->getPostData('referrer_number');
			
			$input_params = array('is_referrer' => $is_referrer,'customer_id' => $customer_id,'referrer_number' => $referrer_number,'referrer_id' => $referrer_id);	
								
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			
			$data = $this->Customers->updateReferrer($input_params);
			$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
			AppController::triggerSuccess($data);

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
			
	}
	
	public function getReferrerlist()
	{
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
	
			// Get the Admin ID
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$referrers = $this->Customers->getReferrerlist();
			AppController::triggerSuccess($referrers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	#024 12-03-2015 #27542, Feedback, Booking engine and integration BE > Customer
		public function getCompanyInformationByCompanyName(){
			try {
				// Authenticate the loggedin user
				$tokenData = Configure::read('tokenData');
				
				// Get the Admin ID
				$admin_id = getAdminId();
							
				// Populate the input params
				$recursive = 0;
				$partner_id = $this->getPostData('partner_id');
				$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
				$sort = $this->getPostData('sort', 'id');
				$direction = $this->getPostData('direction', 'desc');
				$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
				$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
				
				// Search/filter options
				$company_name = $this->getPostData('company_name');
				
				$input_params = array(
					'page' => $page, 
					'sort' => $sort, 
					'direction' => $direction, 
					'recursive' => $recursive, 
					'limit' => $limit, 
					'maxLimit' => $maxLimit,
						
					'company_name' => $company_name,
					);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getCompanyInformationByCompanyName($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}		
		}
	#024 12-03-2015 #27542, Feedback, Booking engine and integration BE > Customer
	
	#024 25-03-2015 #28170, Feature request: Notes on customer card	
		public function getCustomerNote(){
			try
			{	
				// Get the Admin ID
				$admin_id = getAdminId();
							
				// Populate the input params
				$recursive = 0;
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
				$sort = $this->getPostData('sort', 'id');
				$direction = $this->getPostData('direction', 'desc');
				$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
				$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
			
				$input_params = array(
						'page' => $page, 
						'sort' => $sort, 
						'direction' => $direction, 
						'recursive' => $recursive, 
						'limit' => $limit, 
						'maxLimit' => $maxLimit,
						);
					
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->getCustomerNote($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function addCustomerNote()
		{
			try {

				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
			
				# Get the Admin ID
				$admin_id = getAdminId();

				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');

				// Customer information
				$title = $this->getPostData('title');
				$description = $this->getPostData('description');
				
				$input_params = array(
					'title'	=> $title,
					'description'	=> $description,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->addCustomerNote($input_params);
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_note_add_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function editCustomerNote()
		{
			try {

				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
			
				# Get the Admin ID
				$admin_id = getAdminId();

				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');

				// Customer information
				$note_id  = $this->getPostData('note_id');
				$title = $this->getPostData('title');
				$description = $this->getPostData('description');
				
				$input_params = array(
					'note_id' => $note_id,
					'title'	=> $title,
					'description'	=> $description,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->editCustomerNote($input_params);
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_note_edit_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function deleteCustomerNote()
		{
			try {
	
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user & get the admin id
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				
				$note_id = $this->getPostData('note_id');
		
				$input_params = array(
						'note_id'	=> $note_id,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->deleteCustomerNote($input_params);
		
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_note_delete_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function getCustomerNoteDetails(){
			try{
				# Get the Admin ID
				$admin_id = getAdminId();

				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');

				// Customer information
				$note_id  = $this->getPostData('note_id');
				
				$input_params = array(
					'note_id' => $note_id,
				);
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->getCustomerNoteDetails($input_params);
				AppController::triggerSuccess($data);
			}catch (Exception $e) {
				AppController::triggerError($e);
			}	
		}
	#024 25-03-2015 #28170, Feature request: Notes on customer card	
	
	#BUG:29367, Fwd: Bug, address update, 054, 05/05/15
	public function saveCustomerInformation()
	{
		try
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
		
			$ein = $this->getPostData('customer_ein');
			$customer_name = $this->getPostData('customer_name');
			$address1 = $this->getPostData('customer_address1');
			$address2 = $this->getPostData('customer_address2');
			$city = $this->getPostData('customer_city');
			$zip = $this->getPostData('customer_zip');
			$country = $this->getPostData('customer_country');
			$email = $this->getPostData('customer_email');
			$ein_required = $this->getPostData('ein_required');
			
			$input_params = array(
				'customer_ein'			=> $ein,
				'customer_name' 		=> $customer_name,
				'customer_address1'		=> $address1,
				'customer_address2'		=> $address2,
				'customer_zip'			=> $zip,
				'customer_city'			=> $city,
				'customer_country'		=> $country,
				'customer_email'		=> $email,
				'ein_required' 			=> $ein_required,
			);
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->saveCustomerInformation($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {			
				AppController::triggerCustomError($data);
			} else {
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	#BUG:29367, Fwd: Bug, address update, 054, 05/05/15
	
	#BUG:29364, Fwd: Bug, total sales, 054, 06/05/15
	public function getCustomerTotalSales()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getCustomerTotalSales();
			AppController::triggerSuccess($data);
		

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	#BUG:29364, Fwd: Bug, total sales, 054, 06/05/15
	
	public function updateTodo()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->updateTodo();
			AppController::triggerSuccess($data);

		} catch (Exception $e) {
			AppController::triggerError($e);
		}	
	}
	
	public function searchCustomerRsDocs()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->searchCustomerRsDocs();
			AppController::triggerSuccess($data);

		} catch (Exception $e) {
			AppController::triggerError($e);
		}	
	}
	
	public function proceedCustomerdocsPrintQueue()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			
			$doc_id = $this->getPostData('doc_id');
			$doctype = $this->getPostData('doctype');
			$method = $this->getPostData('method');
			
			$input_params = array(
								'doc_id' => $doc_id,
								'doctype' => $doctype,
								'method' => $method
							);
						
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->proceedCustomerdocsPrintQueue($input_params);
			
			if(!empty($data)){
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_docs_resend_success'));
			}
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
			
	}
	
	public function donotSendReminders()
	{
		try 
		{
			// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
			
				$admin_id = getAdminId();
				$customer_id = $this->getPostData('customer_id');
				$partner_id = $this->getPostData('partner_id');
				
				$do_not_send_reminders = $this->getPostData('do_not_send_reminders');
				
				$input_params = array(
									'do_not_send_reminders' => $do_not_send_reminders,
								);
							
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->donotSendReminders($input_params);
			// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
					AppController::triggerSuccess($data);
				}
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	#044 09-dec-2015 0033106: bookingengine > ASSIGNING SLIPS TO A CUSTOMER
	public function getAllCustomerSlips()
	{
		try {
			$admin_id = getAdminId();
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
			
			// Populate the input params
			$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
			$sort = $this->getPostData('sort', '');
			$direction = $this->getPostData('direction', 'asc');
			$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
			$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
						
			$input_params = array(
					'page' => $page,
					'sort' => $sort,
					'direction' => $direction,
					'limit' => $limit,
					'maxLimit' => $maxLimit,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			
			$data = $this->Customers->getAllCustomerSlips($input_params);
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	#044 08-dec-2015 0033106: bookingengine > ASSIGNING SLIPS TO A CUSTOMER
	public function assignSlip()
	{		
		try {
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
			
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			
			// Get the Admin ID
			$admin_id = getAdminId();
			
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$partner_slip_id = $this->getPostData('partner_slip_id');
			#024 09-02-2016 #33881, Marina Module Changes	
				$boat_type = $this->getPostData('boat_type');	
				$registration_number = $this->getPostData('registration_number');		
			#024 09-02-2016 #33881, Marina Module Changes
				
			if(empty($customer_id)){
				throw new ApplicationException('Customer is unknown for the contact');
			}
			
			$input_params = array(				
				'partner_slip_id'		=> $partner_slip_id,
				#024 09-02-2016 #33881, Marina Module Changes
					'boat_type'			=> $boat_type,
					'registration_number'	=> $registration_number,				
				#024 09-02-2016 #33881, Marina Module Changes	
				);
				
			$this->Customers->customer_id = $customer_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->admin_id = $admin_id;
			
			$data = $this->Customers->assignSlip($input_params);
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				//Commit transaction
				$db->commit($this);				
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_slip_add_success'));
				AppController::triggerSuccess($data);
			}			
		} catch (Exception $e) {
			// Rollback transaction
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}
	
	#044 09-dec-2015 0033106: bookingengine > ASSIGNING SLIPS TO A CUSTOMER
	public function getAllCustomerMeters()
	{
		try {
			$admin_id = getAdminId();
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
			
			// Populate the input params
			$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
			$sort = $this->getPostData('sort', '');
			$direction = $this->getPostData('direction', 'asc');
			$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
			$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
						
			$input_params = array(
					'page' => $page,
					'sort' => $sort,
					'direction' => $direction,
					'limit' => $limit,
					'maxLimit' => $maxLimit,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			
			$data = $this->Customers->getAllCustomerMeters($input_params);
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	#044 08-dec-2015 0033106: bookingengine > ASSIGNING SLIPS TO A CUSTOMER
	public function assignMeter()
	{		
		try {
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
			
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			
			// Get the Admin ID
			$admin_id = getAdminId();
			
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$partner_meter_id = $this->getPostData('partner_meter_id');	
				
			if(empty($customer_id)){
				throw new ApplicationException('Customer is unknown for the contact');
			}
			
			$input_params = array(				
				'partner_meter_id'		=> $partner_meter_id,				
				);
				
			$this->Customers->customer_id = $customer_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->admin_id = $admin_id;
			
			$data = $this->Customers->assignMeter($input_params);
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				//Commit transaction
				$db->commit($this);				
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_meter_add_success'));
				AppController::triggerSuccess($data);
			}			
		} catch (Exception $e) {
			// Rollback transaction
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}


	#044 08-dec-2015 0033106: bookingengine > ASSIGNING SLIPS TO A CUSTOMER 
	public function deleteSlipFromCustomer()
	{
		try {
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			// Authenticate the loggedin user & get the admin id
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$customer_slip_id = $this->getPostData('customer_slip_id');	
			$current_meter_value = $this->getPostData('current_meter_value');	
			$staffer_id = $this->getPostData('staffer_id');	
			$type = $this->getPostData('type');	
			$meter_action = $this->getPostData('meter_action');
			$invoice_sent = $this->getPostData('invoice_sent');
			
			$input_params = array(
					'customer_slip_id'=> $customer_slip_id,	
					'current_meter_value' => $current_meter_value,
					'staffer_id' => $staffer_id,
					'type' => $type,
					'meter_action' => $meter_action,
					'invoice_sent' => $invoice_sent,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;					
			$this->Customers->customer_id = $customer_id;
			
			$data = $this->Customers->deleteSlipFromCustomer($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				$db->commit($this);
				if($type == 'slip_data'){
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('slips_from_customer_delete_success'));
				}else{
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_slip_delete_success'));
				}
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}

	#044 11-dec-2015 0033106: bookingengine > ASSIGNING SLIPS TO A CUSTOMER 
	public function deleteMeterFromCustomer()
	{
		try {
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			// Authenticate the loggedin user & get the admin id
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$customer_slipmeter_id = $this->getPostData('customer_slipmeter_id');	
			$current_meter_value = $this->getPostData('current_meter_value');	
			$staffer_id = $this->getPostData('staffer_id');	
			$type = $this->getPostData('type');	
			$delete_meter = $this->getPostData('delete_meter');
			$meter_action = $this->getPostData('meter_action');
			$invoice_sent = $this->getPostData('invoice_sent');
			
			$input_params = array(
					'customer_slipmeter_id'=> $customer_slipmeter_id,	
					'current_meter_value' => $current_meter_value,
					'staffer_id' => $staffer_id,
					'type' => $type,
					'delete_meter' => $delete_meter,
					'meter_action' => $meter_action,
					'invoice_sent' => $invoice_sent,
			);
			
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;					
			$this->Customers->customer_id = $customer_id;
			
			$data = $this->Customers->deleteMeterFromCustomer($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				$db->commit($this);
				if($delete_meter == 'yes'){
					if($type ==  'slip'){
						$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('meter_from_customer_delete_success'));
					}else{
						$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_meter_delete_success'));
					}
				}else{
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('meter_transaction_done_success'));
				}
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}

	#044 11-dec-2015 0033106: bookingengine > ASSIGNING SLIPS TO A CUSTOMER 
	public function getMeterChange()
	{
		try {
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			// Authenticate the loggedin user & get the admin id
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$customer_slipmeter_id = $this->getPostData('customer_slipmeter_id');	
			$current_meter_value = $this->getPostData('current_meter_value');	
			$staffer_id = $this->getPostData('staffer_id');	
			$type = $this->getPostData('type');	
			
			$input_params = array(
					'customer_slipmeter_id'=> $customer_slipmeter_id,	
					'current_meter_value' => $current_meter_value,
					'staffer_id' => $staffer_id,
					'type' => $type,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;					
			$this->Customers->customer_id = $customer_id;
			
			$data = $this->Customers->getMeterChange($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				$db->commit($this);				
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}


	#044 14-dec-2015 0033106: bookingengine > ASSIGNING SLIPS TO A CUSTOMER 
	public function editMeterFromCustomer()
	{
		try {
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			// Authenticate the loggedin user & get the admin id
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$customer_slipmeter_id = $this->getPostData('customer_slipmeter_id');	
			$current_meter_value = $this->getPostData('current_meter_value');	
			$staffer_id = $this->getPostData('staffer_id');	
			$type = $this->getPostData('type');	
			$meter_action = $this->getPostData('meter_action');
			$invoice_sent = $this->getPostData('invoice_sent');
			
			$input_params = array(
					'customer_slipmeter_id'=> $customer_slipmeter_id,	
					'current_meter_value' => $current_meter_value,
					'staffer_id' => $staffer_id,
					'type' => $type,
					'meter_action' => $meter_action,
					#024 05-01-2015 #33448, BookingEngine > Fwd: Feedback, marina module
						'invoice_sent'	=> $invoice_sent,
					#024 05-01-2015 #33448, BookingEngine > Fwd: Feedback, marina module	
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;					
			$this->Customers->customer_id = $customer_id;
			
			$data = $this->Customers->editMeterFromCustomer($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				$db->commit($this);				
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_meter_edit_success'));
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}

	#044 22-dec-2015 0033179: be > Utility meter functionality > Meter reading procedure 
	public function getMeterLastReadValue()
	{
		try {
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			// Authenticate the loggedin user & get the admin id
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			$customer_slipmeter_id = $this->getPostData('customer_slipmeter_id');	
			$type = $this->getPostData('type');	
			
			$input_params = array(
					'customer_slipmeter_id'=> $customer_slipmeter_id,	
					'type' => $type,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;					
			$this->Customers->customer_id = $customer_id;
			
			$data = $this->Customers->getMeterLastReadValue($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				$db->commit($this);
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_meter_delete_success'));
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}
	
	#044 22-dec-2015 0033179: be > Utility meter functionality > Meter reading procedure
	public function getMeterLines() {
		try {
			// Authenticate the loggedin user and get the admin id
			$admin_id = getAdminId();
	
			// Populate the input parameters
			$partner_id = $this->getPostData('partner_id');
			$meter_id = $this->getPostData('meter_id');
			
			$product_number = $this->getPostData('product_number');
			$customer_id = $this->getPostData('customer_id');
			$line_key = $this->getPostData('line_key');
			$session_id = $this->getPostData('session_id');
			$registration_and_invoice = $this->getPostData('registration_and_invoice');
			#$productLines = array();
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->meter_id = $meter_id;
			$iParams = array(
					'product_number' => $product_number,
					'customer_id' => $customer_id,
					'line_key'	  => $line_key,
					'session_id'  => $session_id,
					'registration_and_invoice'	=> $registration_and_invoice,						
					);
			$data = $this->Customers->getMeterLines($iParams);
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	#044 22-dec-2015 0033179: be > Utility meter functionality > Meter reading procedure
	public function saveMeterDocument()
	{
		try {
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			// Authenticate the loggedin user
			$admin_id = getAdminId();   
	
			// Populate the input params
			$partner_id = $this->getPostData('partner_id'); 
			$created_by = $this->getPostData('created_by'); 			
			$meter_lines_transaction = isset($this->request->data['meter_lines_transaction']) ? $this->request->data['meter_lines_transaction'] : array();
			#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading
				
				if($created_by == 'customer'){
					$meter_name_orignal = $this->getPostData('meter_name_orignal');
					$meter_id = $this->getPostData('meter_id');
					$product_number = $this->getPostData('product_number'); 
					$slip_name = $this->getPostData('slip_name');
					$product_name = $this->getPostData('product_name');
					$last_read = $this->getPostData('last_read'); 
					$staffer_id = $this->getPostData('staffer_id');
					$old_val = $this->getPostData('old_val');
					$customer_id = $this->getPostData('customer_id'); 
					$billable_val = $this->getPostData('billable_val');
					$register_usage = $this->getPostData('register_usage');
					
					$change = $register_usage - $old_val;
					$meter_lines_transaction[0] = array('meter_id'	=> $meter_id,
													 'date' => !empty($last_read)?$last_read:date('Y-m-d H:i:s'),
													 'customer_id' => $customer_id,
													 'staffer_id' => $staffer_id,
													 'action' => ($billable_val == 'y')?'Usage':'Adjustment',
													 'old_value' => $old_val,
													 'new_value' => $register_usage,
													 'change' => $change,
													 'meter_name_orignal' => $meter_name_orignal,
													 'last_read' => !empty($last_read)?$last_read:date('Y-m-d H:i:s'),
													 'is_billable' => ($billable_val)?$billable_val:'n',
												); 	 				
				}
				
				$session_id = $this->getPostData('session_id');
				$bulk_entry = $this->getPostData('bulk_entry');
				$count = $this->getPostData('count');
				$email_address = isset($this->request->data['email_address']) ? $this->request->data['email_address'] : array();
				$send_notification = $this->getPostData('send_notification'); 
				$billable_value = $this->getPostData('billable_value');   
			#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading
			$input_params = array(
					'meter_lines_transaction' => $meter_lines_transaction,
					#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading
						'session_id'		=> $session_id,
						'bulk_entry'		=> $bulk_entry,
						'count'				=> $count,
						'email_address'		=> $email_address,
						'send_notification'	=> $send_notification,
						'created_by'		=> $created_by,
						'billable_value'	=> $billable_value,
					#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading										
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			
			$data = $this->Customers->saveMeterDocument($input_params);
			#AppController::triggerSuccess($data); return;
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				//Commit transaction
				$db->commit($this);
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('meter_reading_saved_success'));
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			// Rollback transaction
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}
	
	public function addMeterToDraft()
	{
		try {
			// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			// Authenticate the loggedin user
			$admin_id = getAdminId();   
	
			// Populate the input params
			$partner_id = $this->getPostData('partner_id'); 			
			$product_lines = isset($this->request->data['product_lines']) ? $this->request->data['product_lines'] : array();
			
			$sales_id = $this->getPostData('sales_id'); 
			$customer_id = $this->getPostData('customer_id'); 
			$your_ref = $this->getPostData('your_ref'); 
			$bp_referrer_id = $this->getPostData('bp_referrer_id'); 
			$our_ref = $this->getPostData('our_ref'); 
			$reference_contact_id = $this->getPostData('reference_contact_id'); 			
			$description = $this->getPostData('description'); 
			$sales_date = $this->getPostData('sales_date'); 
			$customer_name = $this->getPostData('customer_name'); 
			$customer_number = $this->getPostData('customer_number'); 
			$address1 = $this->getPostData('address1'); 
			$address2 = $this->getPostData('address2'); 
			$zip = $this->getPostData('zip'); 			
			$city = $this->getPostData('city'); 
			$company_country = $this->getPostData('company_country'); 
			$company_email = $this->getPostData('company_email'); 
			$customer_ein = $this->getPostData('customer_ein'); 
			$due_date = $this->getPostData('due_date'); 
			//$product_lines = $this->getPostData('product_lines'); 
			$currency_id = $this->getPostData('currency_id'); 			
			$apply_tax = $this->getPostData('apply_tax'); 
			$from_button = $this->getPostData('from_button'); 
			$delivery_method = $this->getPostData('delivery_method'); 
			$delivery_name = $this->getPostData('delivery_name'); 
			$delivery_address1 = $this->getPostData('delivery_address1'); 
			$delivery_address2 = $this->getPostData('delivery_address2'); 
			$delivery_zip = $this->getPostData('delivery_zip'); 
			$delivery_city = $this->getPostData('delivery_city'); 
			$delivery_country = $this->getPostData('delivery_country'); 
			$delivery_phone_code = $this->getPostData('delivery_phone_code'); 
			$delivery_phone = $this->getPostData('delivery_phone'); 
			$delivery_note = $this->getPostData('delivery_note'); 
			$task_id = $this->getPostData('task_id'); 
			$sales_payment_terms = $this->getPostData('sales_payment_terms'); 
			$tracking_num = $this->getPostData('tracking_num');
			
			#024 11-01-2016 #33517, Booking Engine Updates - 08 January 2016
				$meter_id 			= $this->getPostData('meter_id'); 
				$transaction_number = $this->getPostData('transaction_number');
			#024 11-01-2016 #33517, Booking Engine Updates - 08 January 2016 
											
			$input_params = array(
					'sales_id' => $sales_id,
					'customer_id' => $customer_id,
					'your_ref' => $your_ref,						
					'bp_referrer_id' => $bp_referrer_id,						
					'our_ref' => $our_ref,
					'reference_contact_id' => $reference_contact_id,						
					'description' => $description,	
					'sales_date' => $sales_date,
					'customer_name' => $customer_name,
					'customer_number' => $customer_number,
					'address1' => $address1,
					'address2' =>$address2,
					'zip' => $zip,
					'city' => $city,
					'company_country' => $company_country,
					'company_email' => $company_email,
					'customer_ein' => $customer_ein,
					'due_date' => $due_date,
					'product_lines' => $product_lines,
					'currency_id' => $currency_id,
					'apply_tax' => $apply_tax,
					'from_button' => $from_button,
					'delivery_method' => $delivery_method,
					'delivery_name' => $delivery_name,
					'delivery_address1' => $delivery_address1,
					'delivery_address2' => $delivery_address2,
					'delivery_zip' => $delivery_zip,
					'delivery_city' => $delivery_city,
					'delivery_country' => $delivery_country,
					'delivery_phone_code' => $delivery_phone_code,
					'delivery_phone'   => $delivery_phone,
					'delivery_note'   => $delivery_note,
					'task_id'         => $task_id,
					'sales_payment_terms'	=> $sales_payment_terms,
					'tracking_num' => $tracking_num,
					#024 11-01-2016 #33517, Booking Engine Updates - 08 January 2016
						'meter_id'	=> $meter_id,
						'transaction_number' => $transaction_number,
					#024 11-01-2016 #33517, Booking Engine Updates - 08 January 2016																
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->addMeterToDraft($input_params);
			#AppController::triggerSuccess($data); return;
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) { 
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {  
				//Commit transaction
				$db->commit($this);
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('meter_draft_saved_success'));
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			// Rollback transaction
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}
	
	#24 30-12-2015 #33394: BookingEngine > Utility meter Additional functionality - minbefaring
		public function getDistributionMethodName() {
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$default_distribution = $this->getPostData('default_distribution');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$iParams = array(
						'default_distribution' => $default_distribution,
						);
				$product_data = $this->Customers->getDistributionMethodName($iParams);
				AppController::triggerSuccess($product_data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function deleteTransactionData() {
			try {
					// Initialize DB configuration - used for transactions, and begin transaction
					$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
					$db->begin($this);
				
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$transaction_data = isset($this->request->data['transaction_data']) ? $this->request->data['transaction_data'] : array();
		
				$this->Customers->admin_id = $admin_id; 
				$this->Customers->partner_id = $partner_id; 
				$iParams = array(
						'transaction_data' => $transaction_data,
						); 
				$data = $this->Customers->deleteTransactionData($iParams); 
				
				if(isset($data['error'])) { 
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {  
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('meter_transaction_delete_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function deleteSaleswithMeterTransaction() {
			try {
					// Initialize DB configuration - used for transactions, and begin transaction
					$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
					$db->begin($this);
				
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$salesData = isset($this->request->data['salesData']) ? $this->request->data['salesData'] : array();
				$transaction_number = $this->getPostData('transaction_number');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id; 
				$iParams = array(
						'salesData' => $salesData,
						'transaction_number'	=> $transaction_number,
						); 
				$data = $this->Customers->deleteSaleswithMeterTransaction($iParams);
				if(isset($data['error'])) { 
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {  
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('meter_transaction_delete_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function deleteSales(){
			try{
				// Authenticate the loggedin user
				$admin_id = getAdminId(); 
				$partner_id = $this->getPostData('partner_id');
				$sales_id = $this->getPostData('sales_id');
				$customer_id = $this->getPostData('customer_id');
				
				$params = array( 
						'sales_id' => $sales_id,
						'customer_id' => $customer_id	
				 );
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->deleteSales($params);
				AppController::triggerSuccess($data);
				  
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
	#24 30-12-2015 #33394: BookingEngine > Utility meter Additional functionality - minbefaring

	#024 21-01-2016 #33643, BE > ASAP: Feature request, Marina module
		public function getUnsetSlipstoCustomer() {
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$dock_id = $this->getPostData('dock_id');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$iParams = array(
						'dock_id' => $dock_id,
						);
				$dock_data = $this->Customers->getUnsetSlipstoCustomer($iParams);
				AppController::triggerSuccess($dock_data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function assignSlipToCustomer()
		{
			try {
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user
				$admin_id = getAdminId();   
		
				// Populate the input params
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id'); 
				$slip_id = $this->getPostData('slip_id');
				$type = $this->getPostData('type');
				#024 09-02-2016 #33881, Marina Module Changes
					$boat_type = $this->getPostData('boat_type');
					$registration_number = $this->getPostData('registration_number');
					$send_slip_assignment = $this->getPostData('send_slip_assignment');
				#024 09-02-2016 #33881, Marina Module Changes
				
				$input_params = array(
						'slip_id' => $slip_id,
						'type'	  => $type,
						#024 09-02-2016 #33881, Marina Module Changes
							'boat_type'	=> $boat_type,
							'registration_number'	=> $registration_number,
							'send_slip_assignment'	=> $send_slip_assignment,
						#024 09-02-2016 #33881, Marina Module Changes														
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->assignSlipToCustomer($input_params);
				
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) { 
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {  
					//Commit transaction
					$db->commit($this);
					if($type == 'meter'){
						$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('asssign_meter_to_customer_success'));
					}else{
						$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('asssign_slip_to_customer_success'));
					}
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function deleteSlipsFromCustomer(){
			try{
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
				
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$dock_id = $this->getPostData('dock_id');
				$slip_id = $this->getPostData('slip_id');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id; 
				 
				$iParams = array(
					'slip_id' => $slip_id,
					'dock_id' => $dock_id,
				); 
				$data = $this->Customers->deleteSlipsFromCustomer($iParams);
				if(isset($data['error'])) { 
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {  
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('slips_from_customer_delete_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}	
		}
		
		public function getSetSlipstoCustomer() {
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$slip_id = $this->getPostData('slip_id');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$iParams = array(
						'slip_id' => $slip_id,
						);
				$dock_data = $this->Customers->getSetSlipstoCustomer($iParams);
				AppController::triggerSuccess($dock_data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function getSlipDetails() {
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$slip_id = $this->getPostData('slip_id');
				$type = $this->getPostData('type');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$iParams = array(
						'slip_id' => $slip_id,
						'type'	  => $type,	
				);
				$slip_data = $this->Customers->getSlipDetails($iParams);
				AppController::triggerSuccess($slip_data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function getSlipTotalDetails() {
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$slip_id = $this->getPostData('slip_id');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$iParams = array(
						'slip_id' => $slip_id,
				);
				$slip_data = $this->Customers->getSlipTotalDetails($iParams);
				AppController::triggerSuccess($slip_data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function saveSlipDetails()
		{
			try {
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user
				$admin_id = getAdminId();   
		
				// Populate the input params
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id'); 
				$slip_id = $this->getPostData('slip_id');
				#024 09-02-2016 #33881, Marina Module Changes
					$boat_type = $this->getPostData('boat_type');
					$registration_number = $this->getPostData('registration_number');
					$customer_slip_id = $this->getPostData('customer_slip_id');
				#024 09-02-2016 #33881, Marina Module Changes
				
				$input_params = array(
						'slip_id' => $slip_id,
						#024 09-02-2016 #33881, Marina Module Changes
							'boat_type'	=> $boat_type,
							'registration_number'	=> $registration_number,
							'customer_slip_id'	=> $customer_slip_id,			
						#024 09-02-2016 #33881, Marina Module Changes														
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->saveSlipDetails($input_params);
				
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) { 
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {  
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('edit_slip_details_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
	#024 21-01-2016 #33643, BE > ASAP: Feature request, Marina module
	
	#044 15-feb-2016 0033954: BE > customer card > price group 
	public function getPriceGroupValueFromCustomerGroup()
	{
		try {
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);
	
			// Authenticate the loggedin user & get the admin id
			$admin_id = getAdminId();
			$customer_group_id = $this->getPostData('customer_group_id');
			$partner_id = $this->getPostData('partner_id');			
			
			$input_params = array(
					'customer_group_id'=> $customer_group_id,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;					
			
			$data = $this->Customers->getPriceGroupValueFromCustomerGroup($input_params);
			
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				$db->commit($this);				
				AppController::triggerSuccess($data);
			}
		} catch (Exception $e) {
			$db->rollback($this);
			AppController::triggerError($e);
		}
	}

	#024 13-02-2016 #33927, BE > marina module > Issues, assigning slips to customers
		public function getCustomersListsForMarinaModule() 
		{
			try {
				// Authenticate the loggedin user
				$tokenData = Configure::read('tokenData');
				
				// Get the Admin ID
				$admin_id = getAdminId();
							
				// Populate the input params
				$recursive = 0;
				$partner_id = $this->getPostData('partner_id');
				$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
				$sort = $this->getPostData('sort', 'customer_number');
				$direction = $this->getPostData('direction', 'desc');
				$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
				$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
				
				// Search/filter options
				$user_group_id = $this->getPostData('user_group_id');
				$customer_name = $this->getPostData('customer_name');
				$customer_number = $this->getPostData('customer_number');
				$status = $this->getPostData('status');
				$customer_phone_number = $this->getPostData('customer_phone_number');
				
				#29607, Fwd: Issue >>Set the ability to active and inactive Customer
				$include_inactive = $this->getPostData('include_inactive');
				#29607, Fwd: Issue >>Set the ability to active and inactive Customer
				
				$input_params = array(
					'page' => $page, 
					'sort' => $sort, 
					'direction' => $direction, 
					'recursive' => $recursive, 
					'limit' => $limit, 
					'maxLimit' => $maxLimit,
						
					'customer_name' => $customer_name,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getCustomersListsForMarinaModule($input_params);

				AppController::triggerSuccess($data);

			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function getDockList() {
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$slip_data = $this->Customers->getDockList();
				AppController::triggerSuccess($slip_data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function getSlipDetailsWithDock() {
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$dock_id = $this->getPostData('dock_id');
				
				$params = array('dock_id' => $dock_id);
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$slip_data = $this->Customers->getSlipDetailsWithDock($params);
				AppController::triggerSuccess($slip_data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
	#024 17-02-2016 #33927, BE > marina module > Issues, assigning slips to customers
	
	#024 11-02-2016 #33909, BE > Rearranging the settings area > Sales and accounting > General
		public function saveGeneralSalesSetting(){
			try{
				
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				$partner_id = $this->getPostData('partner_id');
						
				$vat_required = $this->getPostData('vat_required');
				$business_enterprises = $this->getPostData('business_enterprises');
				$postal_address1 = $this->getPostData('postal_address1');
				$postal_address2 = $this->getPostData('postal_address2');
				$postal_zip = $this->getPostData('postal_zip');
				$postal_city = $this->getPostData('postal_city');
				$postal_country = $this->getPostData('postal_country');
				$postal_ph_code = $this->getPostData('postal_ph_code');
				$postal_phone = $this->getPostData('postal_phone');
				$postal_cellcode = $this->getPostData('postal_cellcode');
				$postal_cellphone = $this->getPostData('postal_cellphone');
				$postal_email = $this->getPostData('postal_email');
				$postal_website = $this->getPostData('postal_website');
				$round_off = $this->getPostData('round_off');
				$replace_our_ref = $this->getPostData('replace_our_ref');
				$print_logo_invoice = $this->getPostData('print_logo_invoice');
				$next_quote = $this->getPostData('next_quote');
				$next_order = $this->getPostData('next_order');
				$next_invoice = $this->getPostData('next_invoice');
				$next_credit_note = $this->getPostData('next_credit_note');
				$attachments = $this->getPostData('attachments');
				#024 17-10-2016  #126: Fwd: More on addresses on sales documents
					$preserve_postal_address = $this->getPostData('preserve_postal_address');
				#024 17-10-2016  #126: Fwd: More on addresses on sales documents
				#024 27-02-2017 #349: Minor things - maintenance points
					$next_reminder = $this->getPostData('next_reminder');
					$next_customer = $this->getPostData('next_customer');
				#024 27-02-2017 #349: Minor things - maintenance points
				
				$iParams = array('vat_required' => $vat_required,
								'business_enterprises' => $business_enterprises,
								'postal_address1' => $postal_address1,
								'postal_address2' => $postal_address2,
								'postal_zip' => $postal_zip,
								'postal_city' => $postal_city,
								'postal_country' => $postal_country,
								'postal_ph_code' => $postal_ph_code,
								'postal_phone' => $postal_phone,
								'postal_cellcode' => $postal_cellcode,
								'postal_cellphone' => $postal_cellphone,
								'postal_email' => $postal_email,
								'postal_website' => $postal_website,
								'round_off' => $round_off,
								'replace_our_ref' => $replace_our_ref,
								'print_logo_invoice' => $print_logo_invoice,
								'next_quote' => $next_quote,
								'next_order' => $next_order,
								'next_invoice' => $next_invoice,
								'next_credit_note' => $next_credit_note,
								'company_logo' => $attachments,
								#024 17-10-2016  #126: Fwd: More on addresses on sales documents
									'preserve_postal_address' => $preserve_postal_address,
								#024 17-10-2016  #126: Fwd: More on addresses on sales documents
								#024 27-02-2017 #349: Minor things - maintenance points
									'next_reminder' => $next_reminder,
									'next_customer' => $next_customer,
								#024 27-02-2017 #349: Minor things - maintenance points
							);
				$this->Customers->admin_id	= $admin_id;
				$this->Customers->partner_id	= $partner_id;			
				$data =	$this->Customers->saveGeneralSalesSetting($iParams);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					$db->commit($this);				
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('partner_sales_general_setting_edit_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				$db->rollback($this);
				AppController::triggerError($e);
			}			
			
		}
	#024 11-02-2016 #33909, BE > Rearranging the settings area > Sales and accounting > General
	
	#024 19-02-2016 #33910, BE > Rearranging the settings area > Sales and accounting > Accounting
		public function otherReminderSetting(){
			try{
				
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				$partner_id = $this->getPostData('partner_id');
						
				$merge_reminder = $this->getPostData('merge_reminder');
				$journal_preference = $this->getPostData('journal_preference');
				
				$iParams = array('merge_reminder' => $merge_reminder,
								'journal_preference' => $journal_preference,
							);
				$this->Customers->admin_id	= $admin_id;
				$this->Customers->partner_id	= $partner_id;			
				$data =	$this->Customers->otherReminderSetting($iParams);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					$db->commit($this);				
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('partner_accounting_setting_edit_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				$db->rollback($this);
				AppController::triggerError($e);
			}			
			
		}
	#024 19-02-2016 #33910, BE > Rearranging the settings area > Sales and accounting > Accounting
	
	#024 22-02-2016 #33911, BE > Rearranging the settings area > Sales and accounting > Quotes and orders
		public function customQuoteSetting(){
			try{
				
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				$partner_id = $this->getPostData('partner_id');
						
				$quote_expiration_days = $this->getPostData('quote_expiration_days');
				$quote_sms_notification = $this->getPostData('quote_sms_notification');
				$quote_message_nb = $this->getPostData('quote_message_nb');
				$quote_message_en = $this->getPostData('quote_message_en');
				
				$iParams = array('quote_expiration_days' => $quote_expiration_days,
								 'quote_sms_notification' => $quote_sms_notification,
								 'quote_message_nb' => $quote_message_nb,
								 'quote_message_en' => $quote_message_en,
							);
				$this->Customers->admin_id	= $admin_id;
				$this->Customers->partner_id	= $partner_id;			
				$data =	$this->Customers->customQuoteSetting($iParams);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					$db->commit($this);				
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('partner_quote_setting_edit_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				$db->rollback($this);
				AppController::triggerError($e);
			}			
			
		}
		
		public function customOrderSetting(){
			try{
				
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				$partner_id = $this->getPostData('partner_id');
						
				$create_order_from_quote = $this->getPostData('create_order_from_quote');
				$cancel_order_tasks = $this->getPostData('cancel_order_tasks');
				$order_message_nb = $this->getPostData('order_message_nb');
				$order_message_en = $this->getPostData('order_message_en');
				
				$iParams = array('create_order_from_quote' => $create_order_from_quote,
								 'cancel_order_tasks' => $cancel_order_tasks,
								 'order_message_nb' => $order_message_nb,
								 'order_message_en' => $order_message_en,
							);
				$this->Customers->admin_id	= $admin_id;
				$this->Customers->partner_id	= $partner_id;			
				$data =	$this->Customers->customOrderSetting($iParams);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					$db->commit($this);				
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('partner_order_setting_edit_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				$db->rollback($this);
				AppController::triggerError($e);
			}			
			
		}
	#024 22-02-2016 #33911, BE > Rearranging the settings area > Sales and accounting > Quotes and orders
	
	#024 22-02-2016 #33912, BE > Rearranging the settings area > Sales and accounting > Invoices
		public function customInvoiceSetting(){
			try{
				
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				$partner_id = $this->getPostData('partner_id');
						
				$billing_threshold = $this->getPostData('billing_threshold');
				$bank_account_number = $this->getPostData('bank_account_number');
				$print_kid = $this->getPostData('print_kid');
				$print_iban = $this->getPostData('print_iban');
				$bank_name = $this->getPostData('bank_name');
				$iban_number = $this->getPostData('iban_number');
				$bic = $this->getPostData('bic');
				$invoice_message_nb = $this->getPostData('invoice_message_nb');
				$invoice_message_en = $this->getPostData('invoice_message_en');
				$invoice_method = $this->getPostData('invoice_method');
				$send_invoice_copy = $this->getPostData('send_invoice_copy');
				$custom_email_address = $this->getPostData('custom_email_address');
				$send_sms_notification = $this->getPostData('send_sms_notification'); #044 06-june-2016 0034967: BE > add checkbox for send sms notification upon email invoicing
				
				$iParams = array('billing_threshold' => $billing_threshold,
								 'bank_account_number' => $bank_account_number,
								 'print_kid' => $print_kid,
								 'bank_name' => $bank_name,
								 'iban_number' => $iban_number,
								 'bic' => $bic,
								 'print_iban' => $print_iban,
								 'invoice_message_nb' => $invoice_message_nb,
								 'invoice_message_en' => $invoice_message_en,
								 'invoice_method' => $invoice_method,
								 'send_invoice_copy' => $send_invoice_copy,
								 'custom_email_address' => $custom_email_address,
								 'send_sms_notification' => $send_sms_notification, #044 06-june-2016 0034967: BE > add checkbox for send sms notification upon email invoicing
							);
				$this->Customers->admin_id	= $admin_id;
				$this->Customers->partner_id	= $partner_id;			
				$data =	$this->Customers->customInvoiceSetting($iParams);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					$db->commit($this);				
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('partner_invoice_setting_edit_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				$db->rollback($this);
				AppController::triggerError($e);
			}			
			
		}
		
		public function getInvoicePaymentTerms(){
			try{	
				// Get the Admin ID
				$admin_id = getAdminId();
						
				// Populate the input params
				$recursive = 0;
				$partner_id = $this->getPostData('partner_id');
				$credit_days = $this->getPostData('credit_days');
				$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
				$sort = $this->getPostData('sort', 'id');
				$direction = $this->getPostData('direction', 'desc');
				$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
				$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
			
				$input_params = array(
						'page' => $page, 
						'sort' => $sort, 
						'direction' => $direction, 
						'recursive' => $recursive, 
						'limit' => $limit, 
						'maxLimit' => $maxLimit,
						);
					
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getInvoicePaymentTerms($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}

		public function addInvoicePaymentTerms()
		{
			try {

				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				$partner_id = $this->getPostData('partner_id');
				$credit_days = $this->getPostData('credit_days');
				$is_default = $this->getPostData('is_default');
				$term_id = $this->getPostData('term_id');
				
				$iParams = array(
					'credit_days'	=> $credit_days,
					'is_default'	=> $is_default,
					'credit_id'		=> $term_id,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data =	$this->Customers->addInvoicePaymentTerms($iParams);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					$db->commit($this);
					if(!empty($term_id)){				
						$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('payment_terms_update_success'));
					}else{
						$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('payment_terms_add_success'));
					}
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function deleteInvoicePaymentTerms()
		{
			try {

				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user & get the admin id
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				
				$term_id = $this->getPostData('term_id');
		
				$input_params = array(
						'term_id'	=> $term_id,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->deleteInvoicePaymentTerms($input_params);
				#AppController::triggerSuccess($data); return;
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('payment_terms_delete_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function getInvoicePaymentTerm(){
			try{	
				// Get the Admin ID
				$admin_id = getAdminId();
						
				// Populate the input params
				$recursive = 0;
				$partner_id = $this->getPostData('partner_id');
				$term_id = $this->getPostData('term_id');
				
			
				$input_params = array(
						'term_id' => $term_id, 
					);
					
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getInvoicePaymentTerm($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
	#024 22-02-2016 #33912, BE > Rearranging the settings area > Sales and accounting > Invoices
	
	#024 24-02-2016 #33908, BE > Rearranging the settings area > Custom fields
		public function getCustomFieldsList(){
			try{	
				// Get the Admin ID
				$admin_id = getAdminId();
						
				// Populate the input params
				$recursive = 0;
				$partner_id = $this->getPostData('partner_id');
				$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
				$sort = $this->getPostData('sort', 'id');
				$direction = $this->getPostData('direction', 'desc');
				$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
				$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
				
				$input_params = array(
						'page' => $page, 
						'sort' => $sort, 
						'direction' => $direction, 
						'recursive' => $recursive, 
						'limit' => $limit, 
						'maxLimit' => $maxLimit,
						);
	
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getCustomFieldsList($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function deleteCustomField()
		{
			try {

				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user & get the admin id
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');				
				$field_id = $this->getPostData('field_id');
		
				$input_params = array(
						'field_id'	=> $field_id,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->deleteCustomField($input_params);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('custom_fields_delete_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function addCustomFields()
		{
			try {

				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				$partner_id = $this->getPostData('partner_id');
				$custom_field = $this->getPostData('custom_field');
				$field_type = $this->getPostData('field_type');
				$custom_value = isset($this->request->data['custom_value']) ? $this->request->data['custom_value'] : array();
				$is_default = isset($this->request->data['is_default']) ? $this->request->data['is_default'] : array();
				$customer_registration_form = $this->getPostData('customer_registration_form');
				$mandatory = $this->getPostData('mandatory');
				
				$iParams = array(
					'custom_field'	=> $custom_field,
					'field_type'	=> $field_type,
					'custom_value'	=> $custom_value,
					'is_default'	=> $is_default,
					'customer_registration_form'	=> $customer_registration_form,
					'mandatory'	=> $mandatory,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data =	$this->Customers->addCustomFields($iParams);
				#AppController::triggerSuccess($data); return;
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('custom_fields_add_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function getCustomFieldDetails(){
			try{	
				// Get the Admin ID
				$admin_id = getAdminId();
						
				// Populate the input params
				$partner_id = $this->getPostData('partner_id');
				$field_id 	= $this->getPostData('field_id');
				
				
				$input_params = array(
						'field_id' => $field_id, 
						);
	
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getCustomFieldDetails($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function editCustomFields()
		{
			try {

				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				$partner_id = $this->getPostData('partner_id');
				$field_id = $this->getPostData('field_id');
				$custom_field = $this->getPostData('custom_field');
				$field_type = $this->getPostData('field_type');
				$custom_value = isset($this->request->data['custom_value']) ? $this->request->data['custom_value'] : array();
				$is_default = isset($this->request->data['is_default']) ? $this->request->data['is_default'] : array();
				$customer_registration_form = $this->getPostData('customer_registration_form');
				$mandatory = $this->getPostData('mandatory');
				
				$iParams = array(
					'field_id'	=> $field_id,
					'custom_field'	=> $custom_field,
					'field_type'	=> $field_type,
					'custom_value'	=> $custom_value,
					'is_default'	=> $is_default,
					'customer_registration_form'	=> $customer_registration_form,
					'mandatory'	=> $mandatory,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data =	$this->Customers->editCustomFields($iParams);
				#AppController::triggerSuccess($data); return;
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('custom_fields_update_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
	#024 24-02-2016 #33908, BE > Rearranging the settings area > Custom fields
	
	#24 07-03-2016 #34100, Feedback, new customer form
		public function editCustomerDetailsOnly()
		{
			try
			{
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
				
				$admin_id = getAdminId();
				$customer_id = $this->getPostData('customer_id');
				$partner_id = $this->getPostData('partner_id');
				$user_group_id = $this->getPostData('user_group_id');
				$customer_name = $this->getPostData('customer_name');
				$customer_ein = $this->getPostData('customer_ein');
				$phone_code = $this->getPostData('phone_code');
				$phone = $this->getPostData('phone');
				$cell_code = $this->getPostData('cell_code');
				$cellphone = $this->getPostData('cellphone');
				$email = $this->getPostData('email');
				$dob = $this->getPostData('dob');
				$status = $this->getPostData('status');
				
				$referral = $this->getPostData('referral'); #044 09-may-2016 0034600: BE > More feedback, customer card and edit customer form
				$referrer_id = $this->getPostData('referrer_id'); #044 09-may-2016 0034600: BE > More feedback, customer card and edit customer form
				$referrer_number = $this->getPostData('referrer_number'); #044 09-may-2016 0034600: BE > More feedback, customer card and edit customer form
				
				/*BUG #21162  BY: 054   31 JULY 2014 */
				$price_group = $this->getPostData('price_group');
				$customer_group_id = $this->getPostData('customer_group_id'); #044 03-11-2015 #0032715: Booking engine > Customer groups
				
				
				$address1 = $this->getPostData('address1');
				$address2 = $this->getPostData('address2');
				$city = $this->getPostData('city');
				$zip = $this->getPostData('zip');
				$country = $this->getPostData('country', DEFAULT_COUNTRY);				
				$same_postal_address = $this->getPostData('same_postal_address');			
				$delivery_address1 = $this->getPostData('delivery_address1');
				$delivery_address2 = $this->getPostData('delivery_address2');
				$delivery_country = $this->getPostData('delivery_country');
				$delivery_city = $this->getPostData('delivery_city');
				$delivery_zip = $this->getPostData('delivery_zip');
				
				
				$receive_mass_emails = $this->getPostData('receive_mass_emails'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				$receive_mass_sms = $this->getPostData('receive_mass_sms'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				$apply_to_all_contacts = $this->getPostData('apply_to_all_contacts'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
					$business_default_distribution = $this->getPostData('business_default_distribution');
					$business_default_contact = $this->getPostData('business_default_contact');
					$business_custom_email = $this->getPostData('business_custom_email');
				#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
				#024 25-06-2015 #30391, A few improvement suggestions, BE
					$payment_terms = $this->getPostData('payment_terms');
				#024 25-06-2015 #30391, A few improvement suggestions, BE
				#024 10-02-2016 #33899, BE > Grouping of customer information
					$do_not_send_reminders = $this->getPostData('do_not_send_reminders');
				#024 10-02-2016 #33899, BE > Grouping of customer information
				#024 17-06-2016 #35091, More addressing issues, customer card
					$phone_country_code = $this->getPostData('phone_country_code');
					$cellphone_country_code = $this->getPostData('cellphone_country_code');
				#024 17-06-2016 #35091, More addressing issues, customer card
				#024 24-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact 
					$linked_contact = $this->getPostData('linked_contact');
				#024 24-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact
				#024 30-03-2017 #432: Fwd: Address update
					$reference_id = $this->getPostData('reference_id');
					$attribute = $this->getPostData('attribute');
				#024 30-03-2017 #432: Fwd: Address update 

				
				$infoParams = array(
						'customer_name'	=> $customer_name,
						'email'		=> $email,
						'phone_code'=> $phone_code,
						'phone'		=> $phone,
						'cell_code'	=> $cell_code,
						'cellphone'	=> $cellphone,
						'status' 	=> $status,
						'user_group_id' => $user_group_id,
						
						'price_group' => $price_group,
						'customer_group_id' => $customer_group_id, #044 03-11-2015 #0032715: Booking engine > Customer groups
						'referral' => $referral, #044 09-may-2016 0034600: BE > More feedback, customer card and edit customer form
						'referrer_id' => $referrer_id, #044 09-may-2016 0034600: BE > More feedback, customer card and edit customer form
						'referrer_number' => $referrer_number, #044 09-may-2016 0034600: BE > More feedback, customer card and edit customer form
						

						'address1'	=> $address1,
						'address2'	=> $address2,
						'zip'		=> $zip,
						'city'		=> $city,
						'country'	=> $country,						
						'same_postal_address'	=> $same_postal_address,
						'delivery_address1' => $delivery_address1,
						'delivery_address2' => $delivery_address2,
						'delivery_country' => $delivery_country,
						'delivery_city' => $delivery_city,
						'delivery_zip' => $delivery_zip,
						
						
						#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
							'business_default_distribution' => $business_default_distribution,
							'business_default_contact' => $business_default_contact,
							'business_custom_email' => $business_custom_email,
						#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
						#024 25-06-2015 #30391, A few improvement suggestions, BE
							'payment_terms' => $payment_terms,
						#024 25-06-2015 #30391, A few improvement suggestions, BE
						'receive_mass_emails' => $receive_mass_emails,  #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
						'receive_mass_sms' => $receive_mass_sms,  #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
						'apply_to_all_contacts' => $apply_to_all_contacts,  #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
						#024 10-02-2016 #33899, BE > Grouping of customer information
							'do_not_send_reminders' => $do_not_send_reminders,	
						#024 10-02-2016 #33899, BE > Grouping of customer information
						#024 17-06-2016 #35091, More addressing issues, customer card
							'phone_country_code'	=> $phone_country_code,
							'cellphone_country_code'	=> $cellphone_country_code,
						#024 17-06-2016 #35091, More addressing issues, customer card
						#024 24-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact 
							'linked_contact'	=> $linked_contact,
						#024 24-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact 
						#024 30-03-2017 #432: Fwd: Address update
							'reference_id'	=> $reference_id,
							'attribute'	=> $attribute,
						#024 30-03-2017 #432: Fwd: Address update
						
						
				); 
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				
				# Check customer user group
				$this->Partners->admin_id = $admin_id;
				$userGroupDetails = $this->Partners->getUserGroupDetails($user_group_id); 
				
				if(empty($userGroupDetails)){
					throw new ApplicationException($this->Partners->getMessageString('user_group_invalid'));
				}
				
				if(isset($userGroupDetails['UserGroup']['ein_required'])){
					if(($userGroupDetails['UserGroup']['ein_required'])){
						$infoParams['customer_ein'] = $customer_ein;
					}else{
						$infoParams['dob'] = $dob;
					}			
					
					$data = $this->Customers->editCustomerDetailsOnly($infoParams);
				}else{
					throw new ApplicationException($this->Customers->getMessageString('consumer_edit_failed'));
				}
				
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
					return;
				} else {
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function editCustomerAddressOnly()
		{
			try
			{
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
				
				$admin_id = getAdminId();
				$customer_id = $this->getPostData('customer_id');
				$partner_id = $this->getPostData('partner_id');
				$address1 = $this->getPostData('address1');
				$address2 = $this->getPostData('address2');
				$city = $this->getPostData('city');
				$zip = $this->getPostData('zip');
				$country = $this->getPostData('country', DEFAULT_COUNTRY);
				
				$same_postal_address = $this->getPostData('same_postal_address');			
				$delivery_address1 = $this->getPostData('delivery_address1');
				$delivery_address2 = $this->getPostData('delivery_address2');
				$delivery_country = $this->getPostData('delivery_country');
				$delivery_city = $this->getPostData('delivery_city');
				$delivery_zip = $this->getPostData('delivery_zip');
				
				$infoParams = array(
						'address1'	=> $address1,
						'address2'	=> $address2,
						'zip'		=> $zip,
						'city'		=> $city,
						'country'	=> $country,
						
						'same_postal_address'	=> $same_postal_address,
						'delivery_address1' => $delivery_address1,
						'delivery_address2' => $delivery_address2,
						'delivery_country' => $delivery_country,
						'delivery_city' => $delivery_city,
						'delivery_zip' => $delivery_zip,
				); //
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->editCustomerAddressOnly($infoParams);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
					return;
				} else {
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function editCustomerOtherDetails()
		{
			try
			{
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
				
				$admin_id = getAdminId();
				$customer_id = $this->getPostData('customer_id');
				$partner_id = $this->getPostData('partner_id');
				
				$receive_mass_emails = $this->getPostData('receive_mass_emails'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				$receive_mass_sms = $this->getPostData('receive_mass_sms'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				$apply_to_all_contacts = $this->getPostData('apply_to_all_contacts'); #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
				
				/*BUG #21162  BY: 054   31 JULY 2014 */
				$price_group = $this->getPostData('price_group');
				$customer_group_id = $this->getPostData('customer_group_id'); #044 03-11-2015 #0032715: Booking engine > Customer groups
				
				#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
					$business_default_distribution = $this->getPostData('business_default_distribution');
					$business_default_contact = $this->getPostData('business_default_contact');
					$business_custom_email = $this->getPostData('business_custom_email');
				#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
				#024 25-06-2015 #30391, A few improvement suggestions, BE
					$payment_terms = $this->getPostData('payment_terms');
				#024 25-06-2015 #30391, A few improvement suggestions, BE
				#024 10-02-2016 #33899, BE > Grouping of customer information
					$do_not_send_reminders = $this->getPostData('do_not_send_reminders');
				#024 10-02-2016 #33899, BE > Grouping of customer information
							
				
				$infoParams = array(
						#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
							'business_default_distribution' => $business_default_distribution,
							'business_default_contact' => $business_default_contact,
							'business_custom_email' => $business_custom_email,
						#024 08-06-2015 #29995, Feature requests, minbefaring.no > related to invoicing in the system
						#024 25-06-2015 #30391, A few improvement suggestions, BE
							'payment_terms' => $payment_terms,
						#024 25-06-2015 #30391, A few improvement suggestions, BE
						'receive_mass_emails' => $receive_mass_emails,  #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
						'receive_mass_sms' => $receive_mass_sms,  #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
						'apply_to_all_contacts' => $apply_to_all_contacts,  #044 04-Jan-2016 0033438: BE > Two feature requests, minbefaring.no > 01
						#024 10-02-2016 #33899, BE > Grouping of customer information
							'do_not_send_reminders' => $do_not_send_reminders	
						#024 10-02-2016 #33899, BE > Grouping of customer information
				); //
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->editCustomerOtherDetails($infoParams);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
					return;
				} else {
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_edit_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
	#24 07-03-2016 #34100, Feedback, new customer form

	#024 11-03-2016 #34101, Customer group / price group feedback
		public function getActiveCustomerGroups(){
			try
			{	
				// Get the Admin ID
				$admin_id = getAdminId();
						
				// Populate the input params
				$recursive = 0;
				$partner_id = $this->getPostData('partner_id');
				$customer_group_id = $this->getPostData('customer_group_id');
				
				$input_params = array('customer_group_id' => $customer_group_id);
			
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getActiveCustomerGroups($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
	#024 11-03-2016 #34101, Customer group / price group feedback
	
	#024 18-03-2016 #34189, Issue: Cannot reactivate customers set to inactive
		public function activateUser(){
			try
			{
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
				
				$admin_id = getAdminId();
				$customer_id = $this->getPostData('customer_id');
				$partner_id = $this->getPostData('partner_id');
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->activateUser();
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
					return;
				} else {
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_activate_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
	#024 18-03-2016 #34189, Issue: Cannot reactivate customers set to inactive
	
	#024 17-03-2016 #34183, Request from Sørlandsstigen: More flexibility in determining who should receive order confirmations
		public function getCustomersContactListWithoutDefaultContact()
		{
			try {
				// Authenticate the loggedin user
				$tokenData = Configure::read('tokenData');
		
				// Get the Admin ID
				$admin_id = getAdminId();
		
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$search_text = $this->getPostData('search_text');
				$status = $this->getPostData('status');
				
				$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
				$sort = $this->getPostData('sort', 'modified_date');
				$direction = $this->getPostData('direction', 'desc');
				$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
				$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
				
				
				$params = array(
						'page' => $page,
						'sort' => $sort,
						'direction' => $direction,
						'limit' => $limit,
						'maxLimit' => $maxLimit,
				
						'status' => $status,
						'customer_id' => $customer_id,
						'search_text' => $search_text,
				);
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$customers = $this->Customers->getCustomersContactListWithoutDefaultContact($params);
				AppController::triggerSuccess($customers);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function getCustomerContactListSuggestions()
		{
			try {
				// Authenticate the loggedin user
				$tokenData = Configure::read('tokenData');
		
				// Get the Admin ID
				$admin_id = getAdminId();
		
				$partner_id = $this->getPostData('partner_id');
				$customer_name = $this->getPostData('customer_name');
				$customer_id = $this->getPostData('customer_id');
				$status = $this->getPostData('status');
				$params = array(
						'customer_name' => $customer_name,
						'status' => $status,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$customers = $this->Customers->getCustomerContactListSuggestions($params);
				AppController::triggerSuccess($customers);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function addSalesRecipient(){
			try
			{
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
				
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$contact_id = $this->getPostData('contact_id');
				$recipient = $this->getPostData('recipient');
				$quote_check = $this->getPostData('quote_check');
				$order_check = $this->getPostData('order_check');
				$invoice_check = $this->getPostData('invoice_check');
				
				$input_params = array('contact_id'		=> $contact_id,
									  'recipient'		=> $recipient,
									  'quote_check'		=> $quote_check,
									  'order_check'		=> $order_check,
									  'invoice_check'	=> $invoice_check,);
			
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->addSalesRecipient($input_params);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
					return;
				} else {
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('sales_documents_setting_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function getPartnerSalesDocuments(){
			try{
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				
				$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
				$sort = $this->getPostData('sort', 'id');
				$direction = $this->getPostData('direction', 'ASC');
				$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
				$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
				
				$params = array('limit' => '5',
								'sort' => $sort,
								'direction' => $direction,
								'page' => $page,
								'maxLimit' => $maxLimit,);
				
				$this->Customers->admin_id = $admin_id; 
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->getPartnerSalesDocuments($params);
				AppController::triggerSuccess($data); return;
			}catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function getPartnerSalesDocumentsData(){
			try{
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$partner_sales_id = $this->getPostData('partner_sales_id');
				
				$iParams = array('partner_sales_id' => $partner_sales_id);
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->getPartnerSalesDocumentsData($iParams);
				AppController::triggerSuccess($data);
			}catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function editPartnerSalesDocuments(){
			try
			{
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
				
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$contact_id = $this->getPostData('contact_id');
				$recipient = $this->getPostData('recipient');
				$quote_check = $this->getPostData('quote_check');
				$order_check = $this->getPostData('order_check');
				$invoice_check = $this->getPostData('invoice_check');
				$partner_sales_id = $this->getPostData('partner_sales_id');
				
				$input_params = array('contact_id'		=> $contact_id,
									  'partner_sales_id'	=> $partner_sales_id,	
									  'recipient'		=> $recipient,
									  'quote_check'		=> $quote_check,
									  'order_check'		=> $order_check,
									  'invoice_check'	=> $invoice_check,);
			
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->editPartnerSalesDocuments($input_params);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
					return;
				} else {
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('edit_sales_documents_setting_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function deletePartnerSalesDocument(){
			try {
	
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user & get the admin id
				$tokenData = Configure::read('tokenData');
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$partner_sales_id = $this->getPostData('partner_sales_id');
				
				$params = array('partner_sales_id' => $partner_sales_id);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->deletePartnerSalesDocument($params);
		
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('delete_sales_documents_setting_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}	
		}
		
		public function getPartnerSalesDocumentSetting()
		{
			try{
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				
				$document_check = $this->getPostData('document_check');
				$contact_id = $this->getPostData('contact_id');
				$params = array('document_check' => $document_check,
								'contact_id' => $contact_id,);
					
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->getPartnerSalesDocumentSetting($params);
				AppController::triggerSuccess($data);
			}catch(exception $ex){
				AppController::triggerError($ex);
			}
 		}

 		public function getPartnerDocumentSetting()
		{
			try{
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				
				$document_check = $this->getPostData('document_check');
				$contact_id = $this->getPostData('contact_id');
				$params = array('document_check' => $document_check,
								'contact_id' => $contact_id,);
					
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->getPartnerDocumentSetting($params);
				AppController::triggerSuccess($data); 
			}catch(exception $ex){
				AppController::triggerError($ex);
			}
 		}	
	#024 17-03-2016 #34183, Request from Sørlandsstigen: More flexibility in determining who should receive order confirmations
	
	/**
	 * #024 29-03-2016
	 * editStandardInvoiceSettings
	 * #34249, Mass Invoice > add provision to Upload Logo
	 */
		public function editAdvancedInvoiceSettingsForMassInvoiceLogo()
		{
			try {
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$tokenData = Configure::read('tokenData'); 
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				//$setting_id = $this->getPostData('setting_id');
				$partner_id = $this->getPostData('partner_id'); 
				
				$mass_invoice_logo = $this->getPostData('mass_invoice_logo');
				$input_params = array(
						'mass_invoice_logo'     	=> $mass_invoice_logo,
				); 
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->editAdvancedInvoiceSettingsForMassInvoiceLogo($input_params);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('mass_invoice_logo_upload_success'));
					AppController::triggerSuccess($data);
				}
		
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function deleteMassInvoiceLogo(){
			try {
	
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user & get the admin id
				$tokenData = Configure::read('tokenData');
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->deleteMassInvoiceLogo();
				
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('mass_invoice_logo_delete_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}	
		}
	#024 29-03-2016 #34249, Mass Invoice > add provision to Upload Logo

	#024 17-03-2016 #34183, Request from Sørlandsstigen: More flexibility in determining who should receive order confirmations
		public function getSalesDocumentDefaultContact()
		{
			try{
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				
				$document_check = $this->getPostData('document_check');
				$contact_id = $this->getPostData('contact_id');
				$params = array('document_check' => $document_check,
								'contact_id' => $contact_id,);
					
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->getSalesDocumentDefaultContact($params);
				AppController::triggerSuccess($data);
			}catch(exception $ex){
				AppController::triggerError($ex);
			}
 		}
 	#024 17-03-2016 #34183, Request from Sørlandsstigen: More flexibility in determining who should receive order confirmations
 	
 	#024 10-06-2016 #34966, Reports > Fwd: Customer list report > Generate Customer Reports XLS
		public function getCustomFieldAndSlipMetersCount()
		{
			try{
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
			
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				
				$data = $this->Customers->getCustomFieldAndSlipMetersCount();
				AppController::triggerSuccess($data);
			}catch(exception $ex){
				AppController::triggerError($ex);
			}
 		}
 	#024 10-06-2016 #34966, Reports > Fwd: Customer list report > Generate Customer Reports XLS
 	
 	#024 24-06-2016 #35179, BE > Improvements, customer portal + adding ability for customers to do meter readings themselves > 07
		public function getAllMeterandSlipsRelatedCustomers()
		{
			try {
				$admin_id = getAdminId(); 
				$partner_id = $this->getPostData('partner_id');	
				
				// Populate the input params
				$page = $this->getPostData('page', DEFAULT_PAGE_NUM);
				$sort = $this->getPostData('sort', '');
				$direction = $this->getPostData('direction', 'asc');
				$limit = $this->getPostData('limit', DEFAULT_PER_PAGE);
				$maxLimit = $this->getPostData('maxLimit', DEFAULT_MAX_PER_PAGE);
				$customer_id = $this->getPostData('customer_id');
				
							
				$input_params = array(
						'page' => $page,
						'sort' => $sort,
						'direction' => $direction,
						'limit' => $limit,
						'maxLimit' => $maxLimit,
						'meter_id' => $meter_id,
						'meter_transaction_id' => @$meter_transaction_id,
						'meter_date' => @$meter_date,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;    
				$data = $this->Customers->getAllMeterandSlipsRelatedCustomers($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function getMeterDetails()
		{
			try {
				$admin_id = getAdminId(); 
				
				$partner_id = $this->getPostData('partner_id');	
				
				$customer_id = $this->getPostData('customer_id');
				$meter_id = $this->getPostData('meter_id'); 
							
				$input_params = array(
						'meter_id' => $meter_id,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;    
				$data = $this->Customers->getMeterDetails($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function getCustomerPendingInvoices()
		{
			try {
				$admin_id = getAdminId(); 
				
				$partner_id = $this->getPostData('partner_id');	
					
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getCustomerPendingInvoices($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function rejectPendingInvoices(){
			try{
			// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);

				// Authenticate the loggedin user and get the admin id for the same
				$tokenData = Configure::read('tokenData'); 
				$admin_id = getAdminId(); 
		
				// Populate input parameters
				$partner_id = $this->getPostData('partner_id'); 
				$all_selected = !empty($this->request->data['all_selected'])?$this->request->data['all_selected']:array();
				
				$input_params = array(
						'all_selected'     	=> $all_selected,
				); 
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->rejectPendingInvoices($input_params);
				#AppController::triggerSuccess($data); return;
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_pending_invoices_reject_success'));
					AppController::triggerSuccess($data);
				}
		
			} catch (Exception $e) {
				AppController::triggerError($e);
			}	
		}
		
		public function getPendingInvoicesData()
		{
			try {
				$admin_id = getAdminId(); 
				
				$partner_id = $this->getPostData('partner_id');	
				$session_id = $this->getPostData('session_id');	
				$all_selected = !empty($this->request->data['all_selected'])?$this->request->data['all_selected']:array();
				$invoice_selected = !empty($this->request->data['invoice_selected'])?$this->request->data['invoice_selected']:array();
							
				$input_params = array(
						'all_selected' => $all_selected,
						'invoice_selected' => $invoice_selected,
						'session_id' => $session_id,
				);
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getPendingInvoicesData($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
	#024 24-06-2016 #35179, BE > Improvements, customer portal + adding ability for customers to do meter readings themselves > 07
	
	#024 28-06-2016 #35198, Booking Engine Updates - 25 june 2016
		public function getAllPartnerMetersAndSlipsAssociatedWithCustomer()
		{
			try { 
				$admin_id = getAdminId(); 
				$partner_id = $this->getPostData('partner_id');			
				#024 24-06-2016 #35179, BE > Improvements, customer portal + adding ability for customers to do meter readings themselves > 07
					$customer_id = $this->getPostData('customer_id');
				#024 24-06-2016 #35179, BE > Improvements, customer portal + adding ability for customers to do meter readings themselves > 07
				#024 30-06-2016 #35225, BE > Booking Engine Updates - 28 june 2016
					$meter_id = $this->getPostData('meter_id');
					$slip_id = $this->getPostData('slip_id');
					$input_params = array(
						'meter_id' => $meter_id,
						'slip_id'	=> $slip_id,
					);
 				#024 30-06-2016 #35225, BE > Booking Engine Updates - 28 june 2016	
					
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->customer_id = $customer_id;
				$data = $this->Customers->getAllPartnerMetersAndSlipsAssociatedWithCustomer($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
	#024 28-06-2016 #35198, Booking Engine Updates - 25 june 2016			
	
	#044 13-july-2016 0035360: BE >/view.php?id=35156: BE > Improvements, customer portal + adding ability for customers to do meter readings themselves > 02 > feedback
	public function totalSalesSummary()
	{
		try 
		{
			$admin_id = getAdminId();
			$customer_id = $this->getPostData('customer_id');
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->totalSalesSummary();
			AppController::triggerSuccess($data);
		

		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}

	public function getCustomerContactListByUserId()
	{
		try {
			// Authenticate the loggedin user
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			$customer_id = $this->getPostData('customer_id');
			$staffer_id = $this->getPostData('staffer_id');
			
			$params = array('user_id' => $staffer_id);
	
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$customers = $this->Customers->getCustomerContactListByUserId($params);
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	public function getPartnerMetersAndSlipsAssociatedWithCustomer()
	{
		try { 
			$admin_id = getAdminId(); 
			$partner_id = $this->getPostData('partner_id');			
			#024 24-06-2016 #35179, BE > Improvements, customer portal + adding ability for customers to do meter readings themselves > 07
				$customer_id = $this->getPostData('customer_id');
			#024 24-06-2016 #35179, BE > Improvements, customer portal + adding ability for customers to do meter readings themselves > 07
			#024 30-06-2016 #35225, BE > Booking Engine Updates - 28 june 2016
				$meter_id = $this->getPostData('meter_id');
				$input_params = array(
					'meter_id' => $meter_id,
				);
			#024 30-06-2016 #35225, BE > Booking Engine Updates - 28 june 2016	
				
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->getPartnerMetersAndSlipsAssociatedWithCustomer($input_params);
			AppController::triggerSuccess($data);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
	
	public function removeSlipFromCustomer(){
		try{
		// Initialize DB configuration - used for transactions, and begin transaction
			$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
			$db->begin($this);

			// Authenticate the loggedin user and get the admin id for the same
			$tokenData = Configure::read('tokenData'); 
			$admin_id = getAdminId(); 
	
			// Populate input parameters
			$partner_id = $this->getPostData('partner_id'); 
			$slip_id = $this->getPostData('slip_id'); 
			$customer_id = $this->getPostData('customer_id'); 
			
			$input_params = array(
				'slip_id'     	=> $slip_id,
			); 
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$this->Customers->customer_id = $customer_id;
			$data = $this->Customers->removeSlipFromCustomer($input_params);
			#AppController::triggerSuccess($data); return;
			// Handle the validation errors and other types of errors (if any)
			if(isset($data['error'])) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerCustomError($data);
			} else {
				//Commit transaction
				$db->commit($this);
				$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('remove_slip_success'));
				AppController::triggerSuccess($data);
			}
	
		} catch (Exception $e) {
			AppController::triggerError($e);
		}	
	}
	##080 07-11-2016 #104: Fwd: Minor issues and requests, MinBefaring > feature requests 
	public function get_customer_transactions()
	{
		try {
			$admin_id = getAdminId();
			
			// Populate the input params
			$partner_id = $this->getPostData('partner_id');
			$journal_status = $this->getPostData('journal_status');
			$customer = $this->getPostData('customer');
			$customer_name = $this->getPostData('customer_name');
			$from_date = $this->getPostData('from_date');
			$upto_date = $this->getPostData('upto_date');
			$direction = $this->getPostData('direction', 'desc');
			$customer_value = $this->getPostData('customer_value'); #044 19-apr-2016 0034426: BE > HIGH PRIORITY TASK - SHOULD BE STARTED ON RIGHT AWAY
			$request_from = $this->getPostData('request_from');
			
			$input_params = array(
				'from_date' => $from_date,
				'upto_date' => $upto_date,
				'journal_status' => $journal_status,
				'customer' => $customer,
				'customer_name' => $customer_name,
				'direction' => $direction,
				'customer_value' => $customer_value, #044 19-apr-2016 0034426: BE > HIGH PRIORITY TASK - SHOULD BE STARTED ON RIGHT AWAY
				'request_from' => $request_from,
			);
			
			$this->Partners->admin_id = $admin_id;
			$this->Partners->partner_id = $partner_id;
			$data = $this->Partners->getCustomerList($input_params);
			
			AppController::triggerSuccess($data);

		}
		catch (Exception $e) {
				AppController::triggerError($e);
		}
	}
	
	##080 08-11-2016 #104: Fwd: Minor issues and requests, MinBefaring > feature requests 
	public function get_customer_journal_line()
	{
		try {
			$admin_id = getAdminId();
			
			// Populate the input params
			$journal_id = $this->getPostData('journal_id');
			$customer_num = $this->getPostData('customer_num');
			$partner_id = $this->getPostData('partner_id');

			$input_params = array(
				'journal_id' => $journal_id,
				'customer_num' => $customer_num,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$data = $this->Customers->get_customer_journal_line($input_params);
			
			AppController::triggerSuccess($data);

		}
		catch (Exception $e) {
				AppController::triggerError($e);
		}
	}
	
	##080 08-11-2016 #104: Fwd: Minor issues and requests, MinBefaring > feature requests 
	public function export_pdf()
	{
		try {
			$admin_id = getAdminId();
			
			// Populate the input params
			$partner_id = $this->getPostData('partner_id');
			$type_of_entries = $this->getPostData('type_of_entries');
			$customer = $this->getPostData('customer');
			$customer_name = $this->getPostData('customer_name');
			$from_date = $this->getPostData('from_date');
			$upto_date = $this->getPostData('upto_date');
			$direction = $this->getPostData('direction', 'desc');
			$customer_value = $this->getPostData('customer_value');
			$request_from = $this->getPostData('request_from');
			$request_for = $this->getPostData('request_for');
			
			$input_params = array(
				'from_date' => $from_date,
				'upto_date' => $upto_date,
				'type_of_entries' => $type_of_entries,
				'customer' => $customer,
				'customer_name' => $customer_name,
				'direction' => $direction,
				'customer_value' => $customer_value,
				'request_from' => $request_from,
				'request_for' => $request_for,
			);
			
			$this->Partners->admin_id = $admin_id;
			$this->Partners->partner_id = $partner_id;
			$data = $this->Partners->generateCustomerLedgerReport($input_params);
			
			AppController::triggerSuccess($data);

		}
		catch (Exception $e) {
				AppController::triggerError($e);
		}
	}
	
	##080 08-11-2016 #104: Fwd: Minor issues and requests, MinBefaring > feature requests 
	public function export_email()
	{
		try {
			$admin_id = getAdminId();
			
			// Populate the input params
			$partner_id = $this->getPostData('partner_id');
			$transaction_input =  !empty($this->request->data['transaction_input'])?$this->request->data['transaction_input']:array();
			$export_email_input =  !empty($this->request->data['export_email_input'])?$this->request->data['export_email_input']:array();
			
			$input_params = array(
				'from_date' => $transaction_input['from_date'],
				'upto_date' => $transaction_input['upto_date'],
				'type_of_entries' => $transaction_input['type_of_entries'],
				'customer' => $transaction_input['customer'],
				'customer_name' => $transaction_input['customer_name'],
				'direction' => $transaction_input['direction'],
				'customer_value' => $transaction_input['customer_value'],
				'request_from' => $transaction_input['request_from'],
				'request_for' => $transaction_input['request_for'],
				'export_email_input' => $export_email_input,
			);
			
			$this->Partners->admin_id = $admin_id;
			$this->Partners->partner_id = $partner_id;
			$data = $this->Partners->generateCustomerLedgerReport($input_params);
			
			AppController::triggerSuccess($data);

		}
		catch (Exception $e) {
				AppController::triggerError($e);
		}
	}
	
	#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading 
		public function saveMeterLines()
		{
			try {
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user and get the admin id
					$admin_id = getAdminId();
			
					// Populate the input parameters
					$partner_id = $this->getPostData('partner_id');
					$meter_id = $this->getPostData('meter_id');
					
					$new_meter_value = $this->getPostData('new_meter_value');
					$usage = $this->getPostData('usage');
					$line_key = $this->getPostData('line_key');
					$session_id = $this->getPostData('session_id');
					$is_billable = $this->getPostData('is_billable');
					#$productLines = array();
			
					$iParams = array(
							'new_meter_value' => $new_meter_value,
							'usage' => $usage,
							'line_key'	  => $line_key,
							'session_id'  => $session_id,
							'is_billable'  => $is_billable,									
					);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$this->Customers->meter_id = $meter_id;
				$data = $this->Customers->saveMeterLines($iParams);
				#AppController::triggerSuccess($data); return;
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('meter_reading_saved_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function getBulkMeterLines(){
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$session_id = $this->getPostData('session_id');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				
				$iParams = array(
						'session_id'  => $session_id,		
				);
				$product_data = $this->Customers->getBulkMeterLines($iParams);
				$data = array('productData' => $product_data);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}	
		}
		
		public function deleteMeterLines(){
			try {
	
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user & get the admin id
				$admin_id = getAdminId();
				$partner_id = $this->getPostData('partner_id');
				$session_id = $this->getPostData('session_id');
				$line_key = $this->getPostData('line_key');
				
				$iParams  = array('session_id'	=> $session_id,
								  'line_key'	=> $line_key,);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->deleteMeterLines($iParams);
		
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('delete_meter_line_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function getBillableCustomers(){
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$session_id = $this->getPostData('session_id');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				
				$iParams = array(
						'session_id'  => $session_id,		
				);
				$data = $this->Customers->getBillableCustomers($iParams);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}	
		}
		
		public function updateMeterDocument()
		{
			try {
				// Initialize DB configuration - used for transactions, and begin transaction
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user
				$admin_id = getAdminId();   
		
				// Populate the input params
				$partner_id = $this->getPostData('partner_id'); 
				$created_by = $this->getPostData('created_by'); 			
				$all_selected = isset($this->request->data['all_selected']) ? $this->request->data['all_selected'] : array();
				#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading
					$session_id = $this->getPostData('session_id');
					$email_address = isset($this->request->data['email_address']) ? $this->request->data['email_address'] : array();
					$send_notification = $this->getPostData('send_notification');  
				#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading
				$input_params = array(
						'all_selected' => $all_selected,
						#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading
							'session_id'		=> $session_id,
							'email_address'		=> $email_address,
							'send_notification'	=> $send_notification,
						#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading										
				);
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->updateMeterDocument($input_params);
				#AppController::triggerSuccess($data); return;
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					// Rollback transaction
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					//Commit transaction
					$db->commit($this);
					$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('meter_reading_saved_success'));
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				// Rollback transaction
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
	#024 09-01-2017 #248: Fwd: Feedback, booking engine > Bulk meter reading
	
	#024 11-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact
		public function getAllCustomerLists(){
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$email = $this->getPostData('email');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				
				$iParams = array(
						'email'  => $email,		
				);
				$data = $this->Customers->getAllCustomerLists($iParams);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}	
		}
	#024 11-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact 

	#024 16-03-2017 #393: Fwd: Marina module changes (priority) > Move customer
		public function getDockListwithSlips() {
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$slip_data = $this->Customers->getDockListwithSlips();
				AppController::triggerSuccess($slip_data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}

		public function getSlipsAssociatedWithCustomer()
		{
			try { 
				$admin_id = getAdminId(); 
				$partner_id = $this->getPostData('partner_id');			
				
				$customer_name = $this->getPostData('customer_name');
				$customer_number = $this->getPostData('customer_number');
				$meter_id = $this->getPostData('meter_id');
				$slip_id = $this->getPostData('slip_id');
				#024 30-06-2016 #35225, BE > Booking Engine Updates - 28 june 2016
					$input_params = array(
						'customer_name' => $customer_name,
						'customer_number'	=> $customer_number,
						'slip_id'	=> $slip_id,
					);
 				#024 30-06-2016 #35225, BE > Booking Engine Updates - 28 june 2016	
					
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$data = $this->Customers->getSlipsAssociatedWithCustomer($input_params);
				AppController::triggerSuccess($data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function getCustomersListWithSlipDetails()
		{
			try {
				// Authenticate the loggedin user
				$tokenData = Configure::read('tokenData');
		
				// Get the Admin ID
				$admin_id = getAdminId();
		
				$partner_id = $this->getPostData('partner_id');
				$customer_id = $this->getPostData('customer_id');
				$customer_name = $this->getPostData('customer_name');
				$status = $this->getPostData('status');
				$params = array(
						'customer_name' => $customer_name,
						'status' => $status,
						'customer_id' => $customer_id,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$customers = $this->Customers->getCustomersListWithSlipDetails($params);
				AppController::triggerSuccess($customers);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
		
		public function MoveSlipFromCustomer()
		{
			try {
				$db =& ConnectionManager::getDataSource($this->Customer->useDbConfig);
				$db->begin($this);
		
				// Authenticate the loggedin user & get the admin id
				$admin_id = getAdminId();
				$customer_id = $this->getPostData('customer_id');
				$partner_id = $this->getPostData('partner_id');
				$meter_id = $this->getPostData('meter_id');	
				$current_meter_value = $this->getPostData('current_meter_value');	
				$slip_id = $this->getPostData('slip_id');
				if(empty($slip_id)){
					$slip_id = $this->getPostData('customer_slipmeter_id');	
				}	
				$staffer_id = $this->getPostData('staffer_id');	
				$move_slip = $this->getPostData('move_slip');
				$move_slip_id = $this->getPostData('move_slip_id');
				$move_customer_id = $this->getPostData('move_customer_id');
				$move_meter_value = $this->getPostData('move_meter_value');
				$meter_action = $this->getPostData('meter_action');
				$invoice_sent = $this->getPostData('invoice_sent');
				$invoice_count = $this->getPostData('invoice_count');
				$send_slip_assignment = $this->getPostData('send_slip_assignment');
				#024 18-04-2017 #472: Fwd: FYI > Marina module changes (priority):
					$edit_meter_value = $this->getPostData('edit_meter_value');
					$current_new_slip_value = $this->getPostData('current_new_slip_value');
				#024 18-04-2017 #472: Fwd: FYI > Marina module changes (priority):
				
				$input_params = array(
						'meter_id'=> $meter_id,	
						'current_meter_value' => $current_meter_value,
						'slip_id'=> $slip_id,	
						'staffer_id' => $staffer_id,
						'move_slip' => $move_slip,
						'move_slip_id' => $move_slip_id,
						'move_customer_id' => $move_customer_id,
						'move_meter_value' => $move_meter_value,
						'meter_action' => $meter_action,
						'invoice_sent' => $invoice_sent,
						'invoice_count'	=> $invoice_count,
						'send_slip_assignment'	=> $send_slip_assignment,
						#024 18-04-2017 #472: Fwd: FYI > Marina module changes (priority):
							'edit_meter_value'	=> $edit_meter_value,
							'current_new_slip_value'	=> $current_new_slip_value,
						#024 18-04-2017 #472: Fwd: FYI > Marina module changes (priority):
				);
				
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;					
				$this->Customers->customer_id = $customer_id;
				
				$data = $this->Customers->MoveSlipFromCustomer($input_params);
				// Handle the validation errors and other types of errors (if any)
				if(isset($data['error'])) {
					$db->rollback($this);
					AppController::triggerCustomError($data);
				} else {
					$db->commit($this);
					if($move_slip == 'yes'){
						$data['message'] = AppController::getAlertNotificationMessage($this->Customers->getMessageString('customer_move_success'));
					}
					AppController::triggerSuccess($data);
				}
			} catch (Exception $e) {
				$db->rollback($this);
				AppController::triggerError($e);
			}
		}
		
		public function getPartnerSlipsAssociatedWithCustomer()
		{
			try {
				// Authenticate the loggedin user
				$tokenData = Configure::read('tokenData');
		
				// Get the Admin ID
				$admin_id = getAdminId();
		
				$partner_id = $this->getPostData('partner_id');
				$slip_id = $this->getPostData('slip_id');
				
				$params = array(
						'slip_id' => $slip_id,
				);
				
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$customers = $this->Customers->getPartnerSlipsAssociatedWithCustomer($params);
				AppController::triggerSuccess($customers);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
	#024 16-03-2017 #393: Fwd: Marina module changes (priority) > Move customer
		
	public function getCustomerContactDetailsByLoginId()
	{
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
	
			// Get the Admin ID
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			$login_id = $this->getPostData('login_id');
			$customer_id = $this->getPostData('customer_id');
			
			$params = array(
					'login_id' => $login_id,
					'customer_id' => $customer_id,
			);
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$customers = $this->Customers->getCustomerContactDetailsByLoginId($params);
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}	

	public function getPartnerFirstContact(){
		try {
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
	
			// Get the Admin ID
			$admin_id = getAdminId();
	
			$partner_id = $this->getPostData('partner_id');
			
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$customers = $this->Customers->getPartnerFirstContact($params);
			AppController::triggerSuccess($customers);
		} catch (Exception $e) {
			AppController::triggerError($e);
		}	
	}

	#024 18-04-2017 #472: Fwd: FYI > Marina module changes (priority):
		public function getSlipDetailsWithoutDock() {
			try {
				// Authenticate the loggedin user and get the admin id
				$admin_id = getAdminId();
		
				// Populate the input parameters
				$partner_id = $this->getPostData('partner_id');
				$slip_id = $this->getPostData('slip_id');
				
				$params = array('slip_id' => $slip_id);
		
				$this->Customers->admin_id = $admin_id;
				$this->Customers->partner_id = $partner_id;
				$slip_data = $this->Customers->getSlipDetailsWithoutDock($params);
				AppController::triggerSuccess($slip_data);
			} catch (Exception $e) {
				AppController::triggerError($e);
			}
		}
	#024 18-04-2017 #472: Fwd: FYI > Marina module changes (priority):	
	
	#024 11-03-2017 #299: Fwd: Suggestion: Link between consumer customer and its contact 
	
	public function getCustomerAndContactListForCommunication()
	{ 
		try {
			//$admin_id = getAdminId();
			// Authenticate the loggedin user
			$tokenData = Configure::read('tokenData');
			
			// Get the Admin ID
			
			// $admin_id = $this->getQueryData('admin_id');
			// $partner_id = $this->getQueryData('partner_id');
			// $customer_name = $this->getQueryData('customer_name');
			// $status = $this->getQueryData('status');
			
			
			$admin_id = $this->getPostData('admin_id');
			$partner_id = $this->getPostData('partner_id');
			$customer_name = $this->getPostData('customer_name');
			$status = $this->getPostData('status');
				
			$params = array(
					'customer_name' => $customer_name,
					'status' => $status,
			);
			$this->Customers->admin_id = $admin_id;
			$this->Customers->partner_id = $partner_id;
			$customers = $this->Customers->getCustomerAndContactListForCommunication($params);
			
			AppController::triggerSuccess($customers); 
		
		} catch (Exception $e) {
			AppController::triggerError($e);
		}
	}
}
