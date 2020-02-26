var FormEditable = function () {

    $.mockjaxSettings.responseTime = 500;

    var log = function (settings, response) {
        var s = [],
            str;
        s.push(settings.type.toUpperCase() + ' url = "' + settings.url + '"');
        for (var a in settings.data) {
            if (settings.data[a] && typeof settings.data[a] === 'object') {
                str = [];
                for (var j in settings.data[a]) {
                    str.push(j + ': "' + settings.data[a][j] + '"');
                }
                str = '{ ' + str.join(', ') + ' }';
            } else {
                str = '"' + settings.data[a] + '"';
            }
            s.push(a + ' = ' + str);
        }
        s.push('RESPONSE: status = ' + response.status);

        if (response.responseText) {
            if ($.isArray(response.responseText)) {
                s.push('[');
                $.each(response.responseText, function (i, v) {
                    s.push('{value: ' + v.value + ', text: "' + v.text + '"}');
                });
                s.push(']');
            } else {
                s.push($.trim(response.responseText));
            }
        }
        s.push('--------------------------------------\n');
        $('#console').val(s.join('\n') + $('#console').val());
    }

    var initAjaxMock = function () {
        //ajax mocks

        $.mockjax({
            url: '/post',
            response: function (settings) {
                log(settings, this);
            }
        });

        $.mockjax({
            url: '/error',
            status: 400,
            statusText: 'Bad Request',
            response: function (settings) {
                this.responseText = 'Please input correct value';
                log(settings, this);
            }
        });

        $.mockjax({
            url: '/status',
            status: 500,
            response: function (settings) {
                this.responseText = 'Internal Server Error';
                log(settings, this);
            }
        });

        $.mockjax({
            url: '/groups',
            response: function (settings) {
                this.responseText = [{
                        value: 0,
                        text: 'Guest'
                    }, {
                        value: 1,
                        text: 'Service'
                    }, {
                        value: 2,
                        text: 'Customer'
                    }, {
                        value: 3,
                        text: 'Operator'
                    }, {
                        value: 4,
                        text: 'Support'
                    }, {
                        value: 5,
                        text: 'Admin'
                    }
                ];
                log(settings, this);
            }
        });
		

    }

    var initEditables = function () {

        //set editable mode based on URL parameter
        if (App.getURLParameter('mode') == 'inline') {
            $.fn.editable.defaults.mode = 'inline';
            $('#inline').attr("checked", true);
            jQuery.uniform.update('#inline');
        } else {
            $('#inline').attr("checked", false);
            jQuery.uniform.update('#inline');
        }

        //global settings 
        $.fn.editable.defaults.inputclass = 'm-wrap';
        $.fn.editable.defaults.url = '/post';
        $.fn.editableform.buttons = '<button type="submit" class="btn blue editable-submit"><i class="icon-ok"></i></button>';
        $.fn.editableform.buttons += '<button type="button" class="btn red editable-cancel"><i class="icon-remove"></i></button>';

        //editables element samples 
        $('#username').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username'
        });

		 $('#our_ref').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'our_ref',
            title: 'Enter username'
        });

		//editables element samples 
        $('#product_category').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'product_category',
            title: 'Enter Product Category'
        });

		//editables element samples 
        $('#product_type').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'product_type',
            title: 'Enter Product Type'
        });

		//editables element samples 
        $('#product_name').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'product_name',
            title: 'Enter Product Name'
        });

		//editables element samples 
        $('#username').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username'
        });

		$('#customer_address1').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'customer_address1',
            title: 'Enter Address1'
        });

		$('#customer_address2').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'customer_address2',
            title: 'Enter Address2'
        });

		$('#business').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username'
        });
		$('#ein').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username'
        });
		$('#contact').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username'
        });
		$('#telephone').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username'
        });
		$('#email').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username'
        });
		$('#vaddress').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username'
        });
		$('#billing_address').editable({
            url: '/post',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username'
        });


        $('#duedate').editable({
            validate: function (value) {
                if ($.trim(value) == '') return 'This field is required';
            }
        });
		 $('#firstname').editable({
            validate: function (value) {
                if ($.trim(value) == '') return 'This field is required';
            }
        });
		$('#custname').editable({
            validate: function (value) {
                if ($.trim(value) == '') return 'This field is required';
            }
        });
		 $('#aboutEdit').editable({
            validate: function (value) {
                if ($.trim(value) == '') return 'This field is required';
            }
        });

        $('#sex').editable({
            prepend: "not selected",
            inputclass: 'm-wrap',
            source: [{
                    value: 1,
                    text: 'Male'
                }, {
                    value: 2,
                    text: 'Female'
                }
            ],
            display: function (value, sourceData) {
                var colors = {
                    "": "gray",
                    1: "green",
                    2: "blue"
                },
                    elem = $.grep(sourceData, function (o) {
                        return o.value == value;
                    });

                if (elem.length) {
                    $(this).text(elem[0].text).css("color", colors[value]);
                } else {
                    $(this).empty();
                }
            }
        });
		
		$('#business_type').editable({
			showbuttons: true,
			prepend: "Select customer type",
			inputclass: 'm-wrap settest',
			source: [{
				value: 1,
				text: 'Business'
			}, {
				value: 2,
				text: 'Consumer'
			}
			],
			display: function (value, sourceData) {
			if(value == '1')
			{
				//$("#ein_num").css('display', '');
				$("#ein_num").val('NO 984 225 245');
				$( "#ein" ).trigger( "click" );
			}else{
				$("#ein_num").css('display', 'none');
			}
			var colors = {
				"": "gray",
				1: "#005580",
				2: "#005580"
			},
				elem = $.grep(sourceData, function (o) {
				return o.value == value;
				});

			if (elem.length) {
				$(this).text(elem[0].text).css("color", colors[value]);
				if(value == '1')
				{
					$(this).text(elem[0].text).append(', NO 984 225 245');
				}
			} else {
				$(this).empty();
			}
			}
		});

        $('#status').editable();
		
        $('#group').editable({
            showbuttons: false
        });

        $('#vacation').editable({
            rtl : App.isRTL() 
        });

        $('#dob').editable({
            inputclass: 'm-wrap',
        });

        $('#event').editable({
            placement: (App.isRTL() ? 'left' : 'right'),
            combodate: {
                firstItem: 'name'
            }
        });

        $('#meeting_start').editable({
            format: 'yyyy-mm-dd hh:ii',
            viewformat: 'dd/mm/yyyy hh:ii',
            validate: function (v) {
                if (v && v.getDate() == 10) return 'Day cant be 10!';
            },
            datetimepicker: {
                rtl : App.isRTL(),
                todayBtn: 'linked',
                weekStart: 1
            }
        });

        $('#comments').editable({
            showbuttons: 'bottom'
        });
		 $('#aboutus').editable({
            showbuttons: 'bottom'
        });
		$('#clientname').editable({
            showbuttons: 'bottom'
        });

        $('#note').editable({
            showbuttons : (App.isRTL() ? 'left' : 'right')
        });

        $('#pencil').click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            $('#note').editable('toggle');
        });

		$('#note1').editable({
            showbuttons : (App.isRTL() ? 'left' : 'right')
        });

		
		
        $('#pencil1').click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            $('#note1').editable('toggle');
        });
		$('#note2').editable({
            showbuttons : (App.isRTL() ? 'left' : 'right')
        });

        $('#pencil2').click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            $('#note2').editable('toggle');
        });

        $('#state').editable({
            source: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
        });

        $('#fruits').editable({
            pk: 1,
            limit: 3,
            source: [{
                    value: 1,
                    text: 'banana'
                }, {
                    value: 2,
                    text: 'peach'
                }, {
                    value: 3,
                    text: 'apple'
                }, {
                    value: 4,
                    text: 'watermelon'
                }, {
                    value: 5,
                    text: 'orange'
                }
            ]
        });

        $('#fruits').on('shown', function(e, reason) {
            App.initUniform();
        });

        $('#tags').editable({
            inputclass: 'input-large m-wrap',
            select2: {
                tags: ['html', 'javascript', 'css', 'ajax'],
                tokenSeparators: [",", " "]
            }
        });

        var countries = [];
        $.each({
            "BD": "Bangladesh",
            "BE": "Belgium",
            "BF": "Burkina Faso",
            "BG": "Bulgaria",
            "BA": "Bosnia and Herzegovina",
            "BB": "Barbados",
            "WF": "Wallis and Futuna",
            "BL": "Saint Bartelemey",
            "BM": "Bermuda",
            "BN": "Brunei Darussalam",
            "BO": "Bolivia",
            "BH": "Bahrain",
            "BI": "Burundi",
            "BJ": "Benin",
            "BT": "Bhutan",
            "JM": "Jamaica",
            "BV": "Bouvet Island",
            "BW": "Botswana",
            "WS": "Samoa",
            "BR": "Brazil",
            "BS": "Bahamas",
            "JE": "Jersey",
            "BY": "Belarus",
            "O1": "Other Country",
            "LV": "Latvia",
            "RW": "Rwanda",
            "RS": "Serbia",
            "TL": "Timor-Leste",
            "RE": "Reunion",
            "LU": "Luxembourg",
            "TJ": "Tajikistan",
            "RO": "Romania",
            "PG": "Papua New Guinea",
            "GW": "Guinea-Bissau",
            "GU": "Guam",
            "GT": "Guatemala",
            "GS": "South Georgia and the South Sandwich Islands",
            "GR": "Greece",
            "GQ": "Equatorial Guinea",
            "GP": "Guadeloupe",
            "JP": "Japan",
            "GY": "Guyana",
            "GG": "Guernsey",
            "GF": "French Guiana",
            "GE": "Georgia",
            "GD": "Grenada",
            "GB": "United Kingdom",
            "GA": "Gabon",
            "SV": "El Salvador",
            "GN": "Guinea",
            "GM": "Gambia",
            "GL": "Greenland",
            "GI": "Gibraltar",
            "GH": "Ghana",
            "OM": "Oman",
            "TN": "Tunisia",
            "JO": "Jordan",
            "HR": "Croatia",
            "HT": "Haiti",
            "HU": "Hungary",
            "HK": "Hong Kong",
            "HN": "Honduras",
            "HM": "Heard Island and McDonald Islands",
            "VE": "Venezuela",
            "PR": "Puerto Rico",
            "PS": "Palestinian Territory",
            "PW": "Palau",
            "PT": "Portugal",
            "SJ": "Svalbard and Jan Mayen",
            "PY": "Paraguay",
            "IQ": "Iraq",
            "PA": "Panama",
            "PF": "French Polynesia",
            "BZ": "Belize",
            "PE": "Peru",
            "PK": "Pakistan",
            "PH": "Philippines",
            "PN": "Pitcairn",
            "TM": "Turkmenistan",
            "PL": "Poland",
            "PM": "Saint Pierre and Miquelon",
            "ZM": "Zambia",
            "EH": "Western Sahara",
            "RU": "Russian Federation",
            "EE": "Estonia",
            "EG": "Egypt",
            "TK": "Tokelau",
            "ZA": "South Africa",
            "EC": "Ecuador",
            "IT": "Italy",
            "VN": "Vietnam",
            "SB": "Solomon Islands",
            "EU": "Europe",
            "ET": "Ethiopia",
            "SO": "Somalia",
            "ZW": "Zimbabwe",
            "SA": "Saudi Arabia",
            "ES": "Spain",
            "ER": "Eritrea",
            "ME": "Montenegro",
            "MD": "Moldova, Republic of",
            "MG": "Madagascar",
            "MF": "Saint Martin",
            "MA": "Morocco",
            "MC": "Monaco",
            "UZ": "Uzbekistan",
            "MM": "Myanmar",
            "ML": "Mali",
            "MO": "Macao",
            "MN": "Mongolia",
            "MH": "Marshall Islands",
            "MK": "Macedonia",
            "MU": "Mauritius",
            "MT": "Malta",
            "MW": "Malawi",
            "MV": "Maldives",
            "MQ": "Martinique",
            "MP": "Northern Mariana Islands",
            "MS": "Montserrat",
            "MR": "Mauritania",
            "IM": "Isle of Man",
            "UG": "Uganda",
            "TZ": "Tanzania, United Republic of",
            "MY": "Malaysia",
            "MX": "Mexico",
            "IL": "Israel",
            "FR": "France",
            "IO": "British Indian Ocean Territory",
            "FX": "France, Metropolitan",
            "SH": "Saint Helena",
            "FI": "Finland",
            "FJ": "Fiji",
            "FK": "Falkland Islands (Malvinas)",
            "FM": "Micronesia, Federated States of",
            "FO": "Faroe Islands",
            "NI": "Nicaragua",
            "NL": "Netherlands",
            "NO": "Norway",
            "NA": "Namibia",
            "VU": "Vanuatu",
            "NC": "New Caledonia",
            "NE": "Niger",
            "NF": "Norfolk Island",
            "NG": "Nigeria",
            "NZ": "New Zealand",
            "NP": "Nepal",
            "NR": "Nauru",
            "NU": "Niue",
            "CK": "Cook Islands",
            "CI": "Cote d'Ivoire",
            "CH": "Switzerland",
            "CO": "Colombia",
            "CN": "China",
            "CM": "Cameroon",
            "CL": "Chile",
            "CC": "Cocos (Keeling) Islands",
            "CA": "Canada",
            "CG": "Congo",
            "CF": "Central African Republic",
            "CD": "Congo, The Democratic Republic of the",
            "CZ": "Czech Republic",
            "CY": "Cyprus",
            "CX": "Christmas Island",
            "CR": "Costa Rica",
            "CV": "Cape Verde",
            "CU": "Cuba",
            "SZ": "Swaziland",
            "SY": "Syrian Arab Republic",
            "KG": "Kyrgyzstan",
            "KE": "Kenya",
            "SR": "Suriname",
            "KI": "Kiribati",
            "KH": "Cambodia",
            "KN": "Saint Kitts and Nevis",
            "KM": "Comoros",
            "ST": "Sao Tome and Principe",
            "SK": "Slovakia",
            "KR": "Korea, Republic of",
            "SI": "Slovenia",
            "KP": "Korea, Democratic People's Republic of",
            "KW": "Kuwait",
            "SN": "Senegal",
            "SM": "San Marino",
            "SL": "Sierra Leone",
            "SC": "Seychelles",
            "KZ": "Kazakhstan",
            "KY": "Cayman Islands",
            "SG": "Singapore",
            "SE": "Sweden",
            "SD": "Sudan",
            "DO": "Dominican Republic",
            "DM": "Dominica",
            "DJ": "Djibouti",
            "DK": "Denmark",
            "VG": "Virgin Islands, British",
            "DE": "Germany",
            "YE": "Yemen",
            "DZ": "Algeria",
            "US": "United States",
            "UY": "Uruguay",
            "YT": "Mayotte",
            "UM": "United States Minor Outlying Islands",
            "LB": "Lebanon",
            "LC": "Saint Lucia",
            "LA": "Lao People's Democratic Republic",
            "TV": "Tuvalu",
            "TW": "Taiwan",
            "TT": "Trinidad and Tobago",
            "TR": "Turkey",
            "LK": "Sri Lanka",
            "LI": "Liechtenstein",
            "A1": "Anonymous Proxy",
            "TO": "Tonga",
            "LT": "Lithuania",
            "A2": "Satellite Provider",
            "LR": "Liberia",
            "LS": "Lesotho",
            "TH": "Thailand",
            "TF": "French Southern Territories",
            "TG": "Togo",
            "TD": "Chad",
            "TC": "Turks and Caicos Islands",
            "LY": "Libyan Arab Jamahiriya",
            "VA": "Holy See (Vatican City State)",
            "VC": "Saint Vincent and the Grenadines",
            "AE": "United Arab Emirates",
            "AD": "Andorra",
            "AG": "Antigua and Barbuda",
            "AF": "Afghanistan",
            "AI": "Anguilla",
            "VI": "Virgin Islands, U.S.",
            "IS": "Iceland",
            "IR": "Iran, Islamic Republic of",
            "AM": "Armenia",
            "AL": "Albania",
            "AO": "Angola",
            "AN": "Netherlands Antilles",
            "AQ": "Antarctica",
            "AP": "Asia/Pacific Region",
            "AS": "American Samoa",
            "AR": "Argentina",
            "AU": "Australia",
            "AT": "Austria",
            "AW": "Aruba",
            "IN": "India",
            "AX": "Aland Islands",
            "AZ": "Azerbaijan",
            "IE": "Ireland",
            "ID": "Indonesia",
            "UA": "Ukraine",
            "QA": "Qatar",
            "MZ": "Mozambique"
        }, function (k, v) {
            countries.push({
                id: k,
                text: v
            });
        });


        $('#country').editable({
            inputclass: 'input-large',
            source: countries
        });
		
		var prod_status = [];
        $.each({
            "1": "Active",
            "0": "Inactive"

		}, function (k, v) {
            prod_status.push({
                id: k,
                text: v
            });
        });

		$('#prod_status').editable({
			inputclass: 'input-large',
            source: prod_status	
		});

        $('#address1').editable({
            url: '/post',
            value: {
                street: "Storgata 2",
                zip: "0202",
                city: "OSLO"
            },
            validate: function (value) {
                if (value.city == '') return 'city is required!';
            },
            display: function (value) {
                if (!value) {
                    $(this).empty();
                    return;
                }
                var html = '<b>' + $('<div>').text(value.street).html() + '</b>, ' + $('<div>').text(value.zip).html() + ' '+$('<div>').text(value.city).html();
                $(this).html(html);
            }
        });
		$('#address2').editable({
            url: '/post',
            value: {
                street: "Postboks 234",
                zip: "0203",
                city: "OSLO"
            },
            validate: function (value) {
                if (value.city == '') return 'city is required!';
            },
            display: function (value) {
                if (!value) {
                    $(this).empty();
                    return;
                }
                var html = '<b>' + $('<div>').text(value.street).html() + '</b>, ' + $('<div>').text(value.zip).html() + ' '+$('<div>').text(value.city).html();
                $(this).html(html);
            }
        });
		
		$('#customer_zip').editable({
            url: '/post',
            value: {
                zip: "0203",
                city: "OSLO"
            },
            validate: function (value) {
                if (value.city == '') return 'city is required!';
            },
            display: function (value) {
                if (!value) {
                    $(this).empty();
                    return;
                }
                var html = '</b>' + $('<div>').text(value.zip).html() + ' </b> ,'+$('<div>').text(value.city).html();
                $(this).html(html);
            }
        });
    }

    return {
        //main function to initiate the module
        init: function () {

            // inii ajax simulation
            initAjaxMock();

            // init editable elements
            initEditables();


            // init editable toggler
            $('#enable').click(function () {
                $('#user .editable').editable('toggleDisabled');
            });

            // init 
            $('#inline').on('change', function (e) {
                if ($(this).is(':checked')) {
                    window.location.href = 'form_editable.html?mode=inline';
                } else {
                    window.location.href = 'form_editable.html';
                }
            });

            // handle editable elements on hidden event fired
            $('#user .editable').on('hidden', function (e, reason) {
                if (reason === 'save' || reason === 'nochange') {
                    var $next = $(this).closest('tr').next().find('.editable');
                    if ($('#autoopen').is(':checked')) {
                        setTimeout(function () {
                            $next.editable('show');
                        }, 300);
                    } else {
                        $next.focus();
                    }
                }
            });


        }

    };

}();