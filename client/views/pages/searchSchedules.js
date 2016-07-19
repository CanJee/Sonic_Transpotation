import { Meteor } from 'meteor/meteor';
import { Schedules } from '../../../imports/api/schedules.js';
import { Destinations } from '../../../imports/api/destinations.js';
import { Reservations } from '../../../imports/api/reservations.js';

Template.searchSchedules.rendered = function(){
	var createdFooTable = false;
    $("#form").steps({
        bodyTag: "fieldset",
        transitionEffect: "slide",
    	autoFocus: true,
    	labels: {
	        finish: "Complete Reservation",
	        loading: "Loading ..."
    	},
        onStepChanging: function (event, currentIndex, newIndex)
        {
            // Always allow going backward even if the current step contains invalid fields!
            if (currentIndex > newIndex)
            {
                return true;
            }

            // Forbid suppressing "Warning" step if the user is to young
            if (currentIndex == 1 && newIndex === 2)
            {
                var selected = $('input[name=bookThisSchedule]:checked');
                if (selected.length == 0) {
                	swal({
			            title: "Error",
			            text: "Select a schedule before continuing.",
			            type: "error"
			        });
                	return false;

                }
            }

            var form = $(this);

            // Clean up if user went backward before
            if (currentIndex < newIndex)
            {
                // To remove error styles
                $(".body:eq(" + newIndex + ") label.error", form).remove();
                $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
            }

            // Disable validation on fields that are disabled or hidden.
            // form.validate().settings.ignore = ":disabled,:hidden";

            // Start validation; Prevent going forward if false
            return form.valid();
        },
        onStepChanged: function (event, currentIndex, priorIndex)
        {
        	var form = $(this);
            if (currentIndex == 1 && priorIndex === 0) 
            {
            	var resultSchedulesList;
            	if (createdFooTable === false) {
            		$('.searched-schedules-list').footable();
            		createdFooTable = true;
            	}
            	var footable = $('table').data('footable');
            	$(".searched-schedules-list>tbody>tr").each(function(index, elem){
			        footable.removeRow(elem);
			     });
            	departureId = $('#search-departure-location').val();
  				arrivalId = $('#search-arrival-location').val();
  				scheduleDate = $('#schedule-date').val();
  				resultSchedulesList = Schedules.find( { departureId, arrivalId, departureDate: scheduleDate } ).fetch();
		  		if (resultSchedulesList != null && resultSchedulesList.length > 0) {
	            	for (i = 0; i < resultSchedulesList.length; i++) {
	            		departureLocationName = Destinations.find( { _id: resultSchedulesList[i].departureId } ).fetch()[0].location;
	            		arrivalLocationName = Destinations.find( { _id: resultSchedulesList[i].arrivalId } ).fetch()[0].location;
	            		var statusHTML;
	            		var radioButtonHTML;
	            		if (resultSchedulesList[i].remainingSeats == 0) {
	            			statusHTML = '<td><span class="label label-danger">booked</span></td>';
	            			radioButtonHTML = 	'<div class="radio radio-success" style="margin-top: 0px;">'+
			                                        '<input type="radio" id="singleRadio2" value="option2" name="radioSingle1" aria-label="Single radio Two" disabled>'+
			                                        '<label></label>'+
			                                    '</div>';
	            		}
	            		else if (resultSchedulesList[i].status === 'closed') {
	            			statusHTML = '<td><span class="label label-danger">not available</span></td>';
	            			radioButtonHTML = 	'<div class="radio radio-success" style="margin-top: 0px;">'+
			                                        '<input type="radio" id="singleRadio2" value="option2" name="radioSingle1" aria-label="Single radio Two" disabled>'+
			                                        '<label></label>'+
			                                    '</div>';
	            		}
	            		else {
	            			statusHTML = '<td><span class="label label-primary">available</span></td>';
	            			radioButtonHTML = 	'<div class="radio radio-success" style="margin-top: 0px;">'+
			                                        `<input type="radio" schedule-id=${resultSchedulesList[i]._id} id="singleRadio2" value="option2" name="bookThisSchedule" aria-label="Single radio Two">`+
			                                        '<label></label>'+
			                                    '</div>';
	            		}
	            		newRow =  `<tr>`+
							      `<td>${radioButtonHTML}</td>`+
							      `<td>${departureLocationName}</td>`+
							      `<td>${arrivalLocationName}</td>`+
							      `<td>${resultSchedulesList[i].price}</td>`+
							      `<td>${resultSchedulesList[i].departureDate}</td>`+
							      `<td>${resultSchedulesList[i].departureTime}</td>`+
							      `${statusHTML}`+
							    '</tr>';
						footable.appendRow(newRow);
	            	}
            	}

            }

            if (currentIndex == 2)
            {
            	// $('.passenger-info-next').click(function() {
            	// 	$(form).validate().settings.ignore = false;
            	// });
            	$('#form').card({
				    // a selector or DOM element for the container
				    // where you want the card to appear
				    container: '.card-wrapper', // *required*
				    width: 250,

				    placeholders: {
				        number: '•••• •••• •••• ••••',
				        name: 'Full Name',
				        expiry: '••/••',
				        cvc: '•••'
				    },

				    // all of the other options from above
				});
            }


            if (currentIndex === 2) {
            	form.validate().settings.ignore = false;
            }
            else {
            	form.validate().settings.ignore = ":disabled,:hidden";
            }

            if (currentIndex === 3) {
            	selectedScheduleId = $('input[name=bookThisSchedule]:checked').attr('schedule-id');
            	resultingSchedule = Schedules.find({ _id: selectedScheduleId }).fetch()[0];
            	departureLocation = Destinations.find({ _id: resultingSchedule.departureId }).fetch()[0].location;
            	arrivalLocation = Destinations.find({ _id: resultingSchedule.arrivalId }).fetch()[0].location;
            	ccNumber = $('#card-number').val();
            	$('.summary-departure-location').text(departureLocation);
            	$('.summary-arrival-location').text(arrivalLocation);
            	$('.summary-departure-date').text(resultingSchedule.departureDate);
            	$('.summary-departure-time').text(resultingSchedule.departureTime);
            	$('.summary-first-name').text($('#passenger-first-name').val());
            	$('.summary-last-name').text($('#passenger-last-name').val());
            	$('.summary-price').text(resultingSchedule.price);
            	$('.summary-cc-name').text($('#card-name').val());
            	$('.summary-cc-expiry').text($('#card-expiry').val());
            	maskedCCNumber = Array(ccNumber.length - 3).join("*") + ccNumber.substr(ccNumber.length - 4);
            	$('.summary-cc-number').text(maskedCCNumber);
            	if (ccNumber.substring(0, 1) == "3"){
            		$('.summary-cc-card').html("<i class='fa fa-cc-amex payment-icon-big text-success'></i>");
            	}
            	else if (ccNumber.substring(0, 1) == "4"){
            		$('.summary-cc-card').html("<i class='fa fa-cc-visa payment-icon-big text-success'></i>");
            	}
            	else if (ccNumber.substring(0, 1) == "5"){
            		$('.summary-cc-card').html("<i class='fa fa-cc-mastercard payment-icon-big text-success'></i>");
            	}
            	else if (ccNumber.substring(0, 1) == "6"){
            		$('.summary-cc-card').html("<i class='fa fa-cc-discover payment-icon-big text-success'></i>");
            	}
            }
        },
        onFinishing: function (event, currentIndex)
        {
            var form = $(this);

            // Disable validation on fields that are disabled.
            // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
            form.validate().settings.ignore = ":disabled";

            // Start validation; Prevent form submission if false
            return form.valid();
        },
        onFinished: function (event, currentIndex)
        {
        	setTimeout(function() {
			  	swal({
		            title: "Reservation Complete",
		            text: "Your Reservation is complete.",
		            type: "success"
	        	},
	        	function(){
				    window.location.href = 'searchSchedules';
				});
			}, 5000);
            
	        $('.summary-view').hide();
			$('.loading-view').show();

			scheduleId = $('input[name=bookThisSchedule]:checked').attr('schedule-id');
			departureId = $('#search-departure-location').val();
			arrivalId = $('#search-arrival-location').val();
			passengerFirstName = $('#passenger-first-name').val();
			passengerLastName = $('#passenger-last-name').val();
			Meteor.call('reservations.insert', scheduleId, departureId, arrivalId, passengerFirstName, passengerLastName,  function(error, result) {
				debugger;
			});
        }
    }).validate({
        errorPlacement: function (error, element)
        {
            error.insertAfter($(element).closest('.input-group'));
        },
        invalidHandler: function(e,validator) {
		    // loop through the errors:
		    for (var i=0;i<validator.errorList.length;i++){
		        // "uncollapse" section containing invalid input/s:
		        $(validator.errorList[i].element).closest('.panel-collapse.collapse').collapse('show');
		    }
		},
        rules: {
            departure: {
        		required: true,
        		searchdeparturearrivalnotsame: true,
        	},
        	arrival: {
        		required: true,
        		searchdeparturearrivalnotsame: true,
        	},
        	date: {
                required: true,
                optdate: true,
            },
            firstName: {
                required: true,
                minlength: 3,
            },
            lastName: {
                required: true,
                minlength: 3,
            },
        }
    });

	$('#schedule-date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        orientation: "top",
    });

    var searchDepartureLocationSelect = document.getElementById('search-departure-location');
	var searchArrivalLocationSelect = document.getElementById('search-arrival-location');
	Meteor.call('destinations.findAll', 'test', function(error, result) {
  		for (i = 0; i < result.length; i++) {
  			searchDepartureLocationSelect.options[searchDepartureLocationSelect.options.length] = new Option(result[i].location, result[i]._id);
  			searchArrivalLocationSelect.options[searchArrivalLocationSelect.options.length] = new Option(result[i].location, result[i]._id);
  		}
  	});

	setTimeout(function() {
	  	var config = {
	        '.chosen-select'           : {},
	        '.chosen-select-deselect'  : {allow_single_deselect:true},
	        '.chosen-select-no-single' : {disable_search_threshold:10},
	        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
	        '.chosen-select-width'     : {width:"95%"},
		}
	    for (var selector in config) {
	        $(selector).chosen(config[selector]);
	    }
		$('.chosen-container.chosen-container-single').attr("style", "width: 545px !important;");
		$('.chosen-container.chosen-container-single .chosen-drop').attr("style", "width: 545px !important;");
	}, 500);
};