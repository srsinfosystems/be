var Calendar = function () {


    return {
        //main function to initiate the module
        init: function () {
            Calendar.initCalendar();
        },

        initCalendar: function () {

            if (!jQuery().fullCalendar) {
                return;
            }

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {};

            //018 25 OCT 2013 
            var max_cal_width = 720;
            if($('#max_cal_width').length)
            	max_cal_width = $('#max_cal_width').val();
            
            $('#calendarpage').resize(function(){
            if (App.isRTL()) {
                 if ($('#calendarpage').parents(".portlet").width() <= max_cal_width) {
                    $('#calendarpage').addClass("mobile");
                    h = {
                        right: 'title, prev, next',
                        center: '',
                        right: 'agendaDay, agendaWeek, month, today'
                    };
                } else {
                    $('#calendarpage').removeClass("mobile");
                    h = {
                        right: 'title',
                        center: '',
                        left: 'agendaDay, agendaWeek, month, today, prev,next'
                    };
                }                
            } else {
                 if ($('#calendarpage').parents(".portlet").width() <= max_cal_width) {
                    $('#calendarpage').addClass("mobile");
                    h = {
                        left: 'title, prev, next',
                        center: '',
                        right: 'today,month,agendaWeek,agendaDay'
                    };
                } else {
                    $('#calendarpage').removeClass("mobile");
                    h = {
                        left: 'title',
                        center: '',
                        right: 'prev,next,today,month,agendaWeek,agendaDay'
                    };
                }
            }
            });
            $('#calendarpage').resize();
           /////

            var initDrag = function (el) {
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim(el.text()) // use the element's text as the event title
                };
                // store the Event Object in the DOM element so we can get to it later
                el.data('eventObject', eventObject);
                // make the event draggable using jQuery UI
                el.draggable({
                    zIndex: 999,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0, //  original position after the drag
                    ///containment: $('#all_calendars'),
                	//helper: 'clone'
                });
            }

            var addEvent = function (title) {
                title = title.length == 0 ? "Untitled Event" : title;
                var html = $('<div class="external-event label">' + title + '</div>');
                jQuery('#event_box').append(html);
                initDrag(html);
            }

            $('#external-events div.external-event').each(function () {
                initDrag($(this))
            });

            $('#event_add').unbind('click').click(function () {
                var title = $('#event_title').val();
                addEvent(title);
            });
			$('#closeme').on('click', function(){
				//alert('Ok');
				// $('#savemsg').css('display', 'none');
				 $('#savemsg').hide('slow', function() {});
				 $('#calendarpage').fullCalendar('destroy');
				 $('#calendarpage').fullCalendar({ //re-initialize the calendar
					header: h,
					defaultView: 'month',
					slotMinutes: 15,
					editable: true,
					eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {
						$('#savemsg').show('slow', function() {
							// Animation complete.
						});

						/*var htmlMsg = $.trim($("#alert_msg").html());
						if(htmlMsg == ''){
							$("#alert_msg").html('<div class="alert alert-success" id="savemsg">Please <strong>Save</strong> the changes<button class="btn green" id="modal_ajax" data-toggle="modal" style="margin-left:40px;"><i class="icon-ok"></i> Save</button>&nbsp;&nbsp;&nbsp;&nbsp;<button data-dismiss="alert" class="btn green" type="button" id="closeme"><i class="icon-remove"></i> Cancel</button></div>');
						}*/
						/*if (!confirm("Are you sure about this change?")) {
							revertFunc();
						}*/
						
					},
					droppable: true, // this allows things to be dropped onto the calendar !!!
					dropAccept:".ui-draggable",
					drop: function (date, allDay) { // this function is called when something is dropped
					
						 $('#savemsg').show('slow', function() {
							// Animation complete.
							//$("#savemsg").hide(1000);
						});
						/*var htmlMsg = $.trim($("#alert_msg").html());
						if(htmlMsg == ''){
							$("#alert_msg").html('<div class="alert alert-success" id="savemsg">Please <strong>Save</strong> the changes<button class="btn green" id="modal_ajax" data-toggle="modal" style="margin-left:40px;"><i class="icon-ok"></i> Save</button>&nbsp;&nbsp;&nbsp;&nbsp;<button data-dismiss="alert" class="btn green" type="button" id="closeme"><i class="icon-remove"></i> Cancel</button></div>');
						}*/
						//$("#savemsg").css("display", "block");
						// retrieve the dropped element's stored Event Object
						var originalEventObject = $(this).data('eventObject');
						// we need to copy it, so that multiple events don't have a reference to the same object
						var copiedEventObject = $.extend({}, originalEventObject);

						// assign it the date that was reported
						copiedEventObject.start = date;
						copiedEventObject.allDay = allDay;
						copiedEventObject.className = $(this).attr("data-class");

						// render the event on the calendar
						// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
						$('#calendarpage').fullCalendar('renderEvent', copiedEventObject, true);

						// is the "remove after drop" checkbox checked?
						if ($('#drop-remove').is(':checked')) {
							// if so, remove the element from the "Draggable Events" list
							$(this).remove();
						}
					},
					events: [{
							title: 'All Day Event',                        
							start: new Date(y, m, 1),
							backgroundColor: App.getLayoutColorCode('yellow')
						}, {
							title: 'Long Event',
							start: new Date(y, m, d - 5),
							end: new Date(y, m, d - 2),
							backgroundColor: App.getLayoutColorCode('green')
						}, {
							title: 'Repeating Event',
							start: new Date(y, m, d - 3, 16, 0),
							allDay: false,
							backgroundColor: App.getLayoutColorCode('red')
						}, {
							title: 'Repeating Event',
							start: new Date(y, m, d + 4, 16, 0),
							allDay: false,
							backgroundColor: App.getLayoutColorCode('green')
						},{
							title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 1',
							start: new Date(y, m, d, 8, 0),
							end: new Date(y, m, d, 9, 0),
							backgroundColor: App.getLayoutColorCode('grey'),
							allDay: false,
						},{
							title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 2',
							start: new Date(y, m, d, 10, 0),
							end: new Date(y, m, d, 11, 0),
							backgroundColor: App.getLayoutColorCode('purple'),
							allDay: false,
						},{
							title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 3',
							 start: new Date(y, m, d, 12, 0),
							end: new Date(y, m, d, 13, 0),
							backgroundColor: App.getLayoutColorCode('green'),
							allDay: false,
						},{
							title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 4',
							 start: new Date(y, m, d, 14, 0),
							end: new Date(y, m, d, 15, 0),
							backgroundColor: App.getLayoutColorCode('red'),
							allDay: false,
						},{
							title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 5',
							 start: new Date(y, m, d, 16, 0),
							end: new Date(y, m, d, 17, 0),
							backgroundColor: App.getLayoutColorCode('yellow'),
							allDay: false,
						}, {
							title: 'Birthday Party',
							start: new Date(y, m, d + 1, 19, 0),
							end: new Date(y, m, d + 1, 22, 30),
							backgroundColor: App.getLayoutColorCode('purple'),
							allDay: false,
						}, {
							title: 'Click for Google',
							start: new Date(y, m, 28),
							end: new Date(y, m, 29),
							backgroundColor: App.getLayoutColorCode('yellow'),
							url: 'http://google.com/',
						}
					],
					eventClick: function(calEvent, jsEvent, view) {

						//alert('Event: ' + calEvent.title);
						//alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
						//alert('View: ' + view.name);
						$("#modal_ajax_demo_btn").trigger("click");
						// change the border color just for fun
						//$(this).css('border-color', 'red');

					}
				});
            });

            //predefined events
            $('#event_box').html("");
            addEvent("Inspection <br/>Johansen Jan 99999999<br/> 0202 OSLO Storgata 1");
            addEvent("Inspection <br/>Johansen Jan 99999999<br/> 0202 OSLO Storgata 1");
            addEvent("Inspection <br/>Johansen Jan 99999999<br/> 0202 OSLO Storgata 1");
            addEvent("Inspection <br/>Johansen Jan 99999999<br/> 0202 OSLO Storgata 1");
            addEvent("Inspection <br/>Johansen Jan 99999999<br/> 0202 OSLO Storgata 1");
            addEvent("Inspection <br/>Johansen Jan 99999999<br/> 0202 OSLO Storgata 1");

            $('#calendarpage').fullCalendar('destroy'); // destroy the calendar
            $('#calendarpage').fullCalendar({ //re-initialize the calendar
                header: h,
				defaultView: 'month',
                slotMinutes: 15,
                editable: true,
				eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {
					$('#savemsg').show('slow', function() {
						// Animation complete.
					});

					/*var htmlMsg = $.trim($("#alert_msg").html());
					if(htmlMsg == ''){
						$("#alert_msg").html('<div class="alert alert-success" id="savemsg">Please <strong>Save</strong> the changes<button class="btn green" id="modal_ajax" data-toggle="modal" style="margin-left:40px;"><i class="icon-ok"></i> Save</button>&nbsp;&nbsp;&nbsp;&nbsp;<button data-dismiss="alert" class="btn green" type="button" id="closeme"><i class="icon-remove"></i> Cancel</button></div>');
					}*/
					/*if (!confirm("Are you sure about this change?")) {
						revertFunc();
					}*/
					
				},
                droppable: true, // this allows things to be dropped onto the calendar !!!
                dropAccept:".ui-draggable",
                drop: function (date, allDay) { // this function is called when something is dropped
				
					 $('#savemsg').show('slow', function() {
						// Animation complete.
						//$("#savemsg").hide(1000);
					});
					/*var htmlMsg = $.trim($("#alert_msg").html());
					if(htmlMsg == ''){
						$("#alert_msg").html('<div class="alert alert-success" id="savemsg">Please <strong>Save</strong> the changes<button class="btn green" id="modal_ajax" data-toggle="modal" style="margin-left:40px;"><i class="icon-ok"></i> Save</button>&nbsp;&nbsp;&nbsp;&nbsp;<button data-dismiss="alert" class="btn green" type="button" id="closeme"><i class="icon-remove"></i> Cancel</button></div>');
					}*/
					//$("#savemsg").css("display", "block");
                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');
                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;
                    copiedEventObject.className = $(this).attr("data-class");

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendarpage').fullCalendar('renderEvent', copiedEventObject, true);

                    // is the "remove after drop" checkbox checked?
                    if ($('#drop-remove').is(':checked')) {
                        // if so, remove the element from the "Draggable Events" list
                        $(this).remove();
                    }
                },
                events: [{
                        title: 'All Day Event',                        
                        start: new Date(y, m, 1),
                        backgroundColor: App.getLayoutColorCode('yellow')
                    }, {
                        title: 'Long Event',
                        start: new Date(y, m, d - 5),
                        end: new Date(y, m, d - 2),
                        backgroundColor: App.getLayoutColorCode('green')
                    }, {
                        title: 'Repeating Event',
                        start: new Date(y, m, d - 3, 16, 0),
                        allDay: false,
                        backgroundColor: App.getLayoutColorCode('red')
                    }, {
                        title: 'Repeating Event',
                        start: new Date(y, m, d + 4, 16, 0),
                        allDay: false,
                        backgroundColor: App.getLayoutColorCode('green')
                    },{
                        title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 1',
                        start: new Date(y, m, d, 8, 0),
                        end: new Date(y, m, d, 9, 0),
                        backgroundColor: App.getLayoutColorCode('grey'),
                        allDay: false,
                    },{
                        title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 2',
                        start: new Date(y, m, d, 10, 0),
                        end: new Date(y, m, d, 11, 0),
                        backgroundColor: App.getLayoutColorCode('purple'),
                        allDay: false,
                    },{
                        title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 3',
                         start: new Date(y, m, d, 12, 0),
                        end: new Date(y, m, d, 13, 0),
                        backgroundColor: App.getLayoutColorCode('green'),
                        allDay: false,
                    },{
                        title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 4',
                         start: new Date(y, m, d, 14, 0),
                        end: new Date(y, m, d, 15, 0),
                        backgroundColor: App.getLayoutColorCode('red'),
                        allDay: false,
                    },{
                        title: 'Inspection Johansen Jan, 99999999 0202 OSLO Storgata 5',
                         start: new Date(y, m, d, 16, 0),
                        end: new Date(y, m, d, 17, 0),
                        backgroundColor: App.getLayoutColorCode('yellow'),
                        allDay: false,
                    }, {
                        title: 'Birthday Party',
                        start: new Date(y, m, d + 1, 19, 0),
                        end: new Date(y, m, d + 1, 22, 30),
                        backgroundColor: App.getLayoutColorCode('purple'),
                        allDay: false,
                    }, {
                        title: 'Click for Google',
                        start: new Date(y, m, 28),
                        end: new Date(y, m, 29),
                        backgroundColor: App.getLayoutColorCode('yellow'),
                        url: 'http://google.com/',
                    }
                ],
				eventClick: function(calEvent, jsEvent, view) {

					//alert('Event: ' + calEvent.title);
					//alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
					//alert('View: ' + view.name);
					$("#modal_ajax_demo_btn").trigger("click");
					// change the border color just for fun
					//$(this).css('border-color', 'red');

				},
				dayClick: function(date, allDay, jsEvent, view) {
					
					$("#event_add_modal").trigger("click");
					/*if (allDay) {
						alert('Clicked on the entire day: ' + date);
					}else{
						alert('Clicked on the slot: ' + date);
					}*/

				}
            });
        }

    };

}();