import { Meteor } from 'meteor/meteor';
import { Schedules } from '../../../imports/api/schedules.js';
import { Destinations } from '../../../imports/api/destinations.js';

Template.searchSchedules.rendered = function(){
	var createdFooTable = false;
    $("#form").steps({
        bodyTag: "fieldset",
        transitionEffect: "slide",
    	autoFocus: true,
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
            	debugger;
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
            // Suppress (skip) "Warning" step if the user is old enough.
            if (currentIndex === 2 && Number($("#age").val()) >= 18)
            {
                $(this).steps("next");
            }

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

            // Suppress (skip) "Warning" step if the user is old enough and wants to the previous step.
            if (currentIndex === 2 && priorIndex === 3)
            {
                $(this).steps("previous");
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
            var form = $(this);

            // Submit form input
            form.submit();
        }
    }).validate({
        errorPlacement: function (error, element)
        {
            error.insertAfter($(element).closest('.input-group'));
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

// Template.searchSchedules.helpers({
				  
//   	searchedSchedules() {
//   		debugger;
//   		departureId = $('#search-departure-location').val();
//   		arrivalId = $('#search-arrival-location').val();
//   		scheduleDate = ('#schedule-date').val();
//   		Meteor.call('schedules.findByDepartureArrivalDate', departureId, arrivalId, scheduleDate, function(error, result) {
//   			debugger;
//   		});
// 	},
// });