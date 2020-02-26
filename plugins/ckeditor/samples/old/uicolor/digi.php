<?php
$url = "https://api.digipost.no/messages";
$user_id = "5964842";
$password = "arunpass123";
$xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<message xmlns="http://api.digipost.no/schema/v5">
<message-id>1309511960762</message-id>
<subject>Bestillingsbekreftelse</subject>
<recipient>
<digipost-address>ola.nordmann#1234</digipost-address>
</recipient>
<sms-notification/>
<authentication-level>PASSWORD</authentication-level>
<sensitivity-level>NORMAL</sensitivity-level>
<file-type>pdf</file-type>
</message>';
echo $date = date("D, d M Y H:i:s e", strtotime(date("Y-m-d H:i:s")));
echo "<br><br>";
echo $hashed_content = base64_encode(hash("sha256", $xml, True));
echo "<br><br>";
$virksomhetsId = "5964842";
$requestparametre = "";
$stringToSign = strtoupper('POST') . "<br>" .
                      strtolower('/messages') . "<br>" .
                      "date: " . 'Fri, 29 Jul 2016 11:42:21 GMT' . "<br>" .
                      "x-content-sha256: " . $hashed_content . "<br>" .
                      "x-digipost-userid: " . $virksomhetsId . "<br>" .
                      strtolower(urlencode($requestparametre)) . "<br>";

/* $private_key = file_get_contents("/hsphere/local/home/egoriaos0/erp.televakt.no/bookingengine/app/webroot/digipost/certificate-2.p12");
openssl_public_encrypt($stringToSign, $encrypted, $private_key);
echo $encrypted;
echo $signature = base64_encode($encrypted); */

/* $fp = fopen("/hsphere/local/home/egoriaos0/erp.televakt.no/bookingengine/app/webroot/digipost/certificate-2.p12","r");
$private_key = fread($fp,8192);
fclose($fp); 
openssl_get_publickey($private_key);*/
/* echo $server_public_key = openssl_pkey_get_public(file_get_contents("/hsphere/local/home/egoriaos0/erp.televakt.no/bookingengine/app/webroot/digipost/certificate-2.pem"));

// rsa encrypt
openssl_public_encrypt("123", $encrypted, $server_public_key);

openssl_public_encrypt($stringToSign, $encrypted, $private_key);

echo $signature = base64_encode($encrypted); */
$private_key_pem = "/hsphere/local/home/egoriaos0/erp.televakt.no/bookingengine/app/webroot/digipost/certificate-2.p12";

/*********** First Method start ***********/
	// Get Signature from public key with "sha256WithRSAEncryption" parameter
	$new_key_pair = openssl_pkey_new(array(
		"private_key_bits" => 2048,
		"private_key_type" => OPENSSL_KEYTYPE_RSA,
	));
	openssl_pkey_export($new_key_pair, $private_key_pem);

	$private_key = openssl_pkey_get_private($private_key_pem);
	
	$details = openssl_pkey_get_details($new_key_pair);
	$public_key = $details['key'];
	
	//openssl_sign($stringToSign, $signature, $private_key, "sha256WithRSAEncryption");

	//verify signature
	 $r = openssl_verify($stringToSign, $signature, $public_key, "sha256WithRSAEncryption");

	echo base64_encode($signature);

/*********** First Method end ***********/

/*********** Second Method start ***********/
	// Get Signature from private key with "sha256WithRSAEncryption" parameter
	/* $new_key_pair = openssl_pkey_new(array(
		"private_key_bits" => 2048,
		"private_key_type" => OPENSSL_KEYTYPE_RSA,
	));
	openssl_pkey_export($new_key_pair, $private_key_pem);

	$private_key = openssl_pkey_get_private($private_key_pem);
	$keyData = openssl_pkey_get_details($private_key);

	openssl_sign($stringToSign, $signature, $private_key, "sha256WithRSAEncryption");

	//verify signature
	$r = openssl_verify($stringToSign, $signature, $keyData['key'], "sha256WithRSAEncryption");

	echo base64_encode($signature); */

/*********** Second Method end ***********/

/*********** Third Method start ***********/
	// Get Signature using openssl_public_encrypt()
	/* $new_key_pair = openssl_pkey_new(array(
		"private_key_bits" => 2048,
		"private_key_type" => OPENSSL_KEYTYPE_RSA,
	));

	openssl_pkey_export($new_key_pair, $private_key_pem);

	$pub_key = openssl_pkey_get_private($private_key_pem);
	$keyData = openssl_pkey_get_details($pub_key);

	//Use $myResource var in third param
	openssl_public_encrypt($stringToSign, $encryptedData, $keyData['key']);

	//Get response
	echo base64_encode($encryptedData); */
/*********** Third Method end ***********/

/*********** Fourth Method start ***********/
	// Get Signature from private key
	/* $new_key_pair = openssl_pkey_new(array(
		"private_key_bits" => 2048,
		"private_key_type" => OPENSSL_KEYTYPE_RSA,
	));
	openssl_pkey_export($new_key_pair, $private_key_pem);

	$digests             = openssl_get_md_methods();
	$digests_and_aliases = openssl_get_md_methods(true);
	$digest_aliases      = array_diff($digests_and_aliases, $digests);

	$private_key = openssl_pkey_get_private($private_key_pem);

	$keyData = openssl_pkey_get_details($private_key);

	openssl_sign($stringToSign, $signature, $private_key, $digest_aliases[43]);

	//verify signature
	$r = openssl_verify($stringToSign, $signature, $keyData['key'], $digest_aliases[43]);

	echo base64_encode($signature); */

/*********** Fourth Method end ***********/

/*********** Fifth Method end ***********/
	// Get Signature without passing Encryption parameter
	/* $private_key_res = openssl_pkey_new(array(
		"private_key_bits" => 2048,
		"private_key_type" => OPENSSL_KEYTYPE_RSA,
	));

	openssl_pkey_export($private_key_res, $private_key_pem);

	$details = openssl_pkey_get_details($private_key_res);
	$public_key_res = openssl_pkey_get_public($details['key']);

	// state whether signature is okay or not
	openssl_sign($stringToSign, $signature, $private_key_pem);

	//verify signature
	$ok = openssl_verify($stringToSign, $signature, $public_key_res);
	//var_dump($ok);
	
	echo base64_encode($signature); */
/*********** Fifth Method end ***********/

/*********** Sixth Method start ***********/
	// Get Signature using openssl_private_encrypt()
	/* $new_key_pair = openssl_pkey_new(array(
		"private_key_bits" => 2048,
		"private_key_type" => OPENSSL_KEYTYPE_RSA,
	));

	openssl_pkey_export($new_key_pair, $private_key_pem);

	$pub_key = openssl_pkey_get_private($private_key_pem);

	//Use $myResource var in third param
	openssl_private_encrypt($stringToSign, $encryptedData, $pub_key);

	//Get response
	echo base64_encode($encryptedData); */
/*********** Sixth Method end ***********/

$headers = array('Date: $date', 'X-Digipost-UserId: 5964842', 'X-Content-SHA256: $x_content');
// Initialize session and set URL.
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt( $ch, CURLOPT_POSTFIELDS, $xml );
// Set so curl_exec returns the result instead of outputting it.
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Get the response and close the channel.
$response = curl_exec($ch);
curl_close($ch);
echo $response;

/*
 include('/hsphere/local/home/egoriaos0/erp.televakt.no/bookingengine/app/webroot/digipost//RSA/Crypt/Hash.php');

  $hash = new Crypt_Hash('sha1');

  $hash->setKey("certificate-2.p12");

 echo base64_encode($hash->hash($xml));
*/
