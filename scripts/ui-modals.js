/*var UIModals = function () {

    
    var initModals = function () {
       
		var BASE_URL=document.getElementById("BASE_URL").value;

        //$.fn.modalmanager.defaults.resize = true;
		//$.fn.modalmanager.defaults.spinner = '<div class="loading-spinner fade" style="width: 200px; margin-left: -100px;"><img src="/img/ajax-modal-loading.gif" align="middle">&nbsp;<span style="font-weight:300; color: #eee; font-size: 18px; font-family:Open Sans;">&nbsp;Loading...</span></div>';


       	var $modal = $('#ajax-modal');
 
		$('#modal_ajax_demo_btn').on('click', function(){
			
		  // create the backdrop and wait for next modal to be triggered
		  $('body').modalmanager('loading');
		 
		  setTimeout(function(){
			 //alert(BASE_URL+'dashboard/events');
		     $modal.load(BASE_URL+'dashboard/events', '', function(){
		      $modal.modal().on("hidden", function() {
              	$modal.empty();
              });
		    });
		  }, 1000);
		});

		$('#event_add_modal').on('click', function(){
			
		  // create the backdrop and wait for next modal to be triggered
		  $('body').modalmanager('loading');
		 
		  setTimeout(function(){
			 //alert(BASE_URL+'dashboard/events');
		     $modal.load(BASE_URL+'calendars/calendar/event_modal_popup', '', function(){
		      $modal.modal().on("hidden", function() {
              	$modal.empty();
              });
		    });
		  }, 1000);
		});

		$('#add_customer').on('click', function(){
			
		  // create the backdrop and wait for next modal to be triggered
		  $('body').modalmanager('loading');
		 
		  setTimeout(function(){
			 //alert(BASE_URL+'dashboard/events');
		     $modal.load(BASE_URL+'customers/modal_add_customer', '', function(){
		      $modal.modal().on("hidden", function() {
              	$modal.empty();
              });
		    });
		  }, 1000);
		});

		$('#modal_ajax').on('click', function(){
			
		  // create the backdrop and wait for next modal to be triggered
		  $('body').modalmanager('loading');
		 
		  setTimeout(function(){
			 //alert(BASE_URL+'dashboard/events');
		     $modal.load(BASE_URL+'/calendars/calendar/modal_popup', '', function(){
		      $modal.modal().on("hidden", function() {
              	$modal.empty();
              });
		    });
		  }, 1000);
		});
		$('#neworderitem').on('click', function(){
			
		  // create the backdrop and wait for next modal to be triggered
		  $('body').modalmanager('loading');
		 
		  setTimeout(function(){
			//alert(BASE_URL+'orders/modalpopup');
		     $modal.load(BASE_URL+'order/orders/modal_popup', '', function(){
		      $modal.modal().on("hidden", function() {
              	$modal.empty();
              });
		    });
		  }, 1000);
		});
		$('#newquoteitem').on('click', function(){
			
		  // create the backdrop and wait for next modal to be triggered
		  $('body').modalmanager('loading');
		 
		  setTimeout(function(){
			//alert(BASE_URL+'orders/modalpopup');
		     $modal.load(BASE_URL+'quote/quotes/modal_popup', '', function(){
		      $modal.modal().on("hidden", function() {
              	$modal.empty();
              });
		    });
		  }, 1000);
		});

		$('#modal_popup_mobile').on('click', function(){
			
		  // create the backdrop and wait for next modal to be triggered
		  $('body').modalmanager('loading');
		 
		  setTimeout(function(){
			//alert(BASE_URL+'orders/modalpopup');
		     $modal.load(BASE_URL+'customers/modal_popup_mobile', '', function(){
		      $modal.modal().on("hidden", function() {
              	$modal.empty();
              });
		    });
		  }, 1000);
		});

		$('#modal_popup_mail').on('click', function(){
			
		  // create the backdrop and wait for next modal to be triggered
		  $('body').modalmanager('loading');
		 
		  setTimeout(function(){
			//alert(BASE_URL+'orders/modalpopup');
		     $modal.load(BASE_URL+'customers/modal_popup_mail', '', function(){
		      $modal.modal().on("hidden", function() {
              	$modal.empty();
              });
		    });
		  }, 1000);
		});
		
		// 018 -- Generalised popup
		//$('#a_popups').on('click', function(){
			  // create the backdrop and wait for next modal to be triggered
			 // $('body').modalmanager('loading');
			  //var url = $('#a_popups').attr('data-url');
				  
			  /*if(url == '' || url == null || url == 'undefined')
			  {
				  alert('Error! Something went wrong. Please refresh your page and try again.');
				  $('body').modalmanager('removeLoading'); 
				  return false;
			  }*/
			  
			  //$('#popups').load(url, '', function(){
				  /*$('#popups').modal().on("hidden", function() {
					  $('#popups').empty();
				  });*/
			  //});
		//});
		///////*/

		/*$modal.on('click', '.update', function(){
		  $modal.modal('loading');
		  setTimeout(function(){
		    $modal
		      .modal('loading')
		      .find('.modal-body')
		        .prepend('<div class="alert alert-info fade in">' +
		          'Updated!<button type="button" class="close" data-dismiss="alert"></button>' +
		        '</div>');
		  }, 1000);
		}); 
       
    }

    return {
        //main function to initiate the module
        init: function () {
            initModals();
        }

    };

}();*/