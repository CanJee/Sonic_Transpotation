import { Meteor } from 'meteor/meteor';
import { Destinations } from '../../../imports/api/destinations.js';

Template.createScheduleModalTemplate.rendered = function(){
	var departureLocationSelect = document.getElementById('departure-location');
	var arrivalLocationSelect = document.getElementById('arrival-location');
	Meteor.call('destinations.findAll', 'test', function(error, result) {
  		for (i = 0; i < result.length; i++) {
  			departureLocationSelect.options[departureLocationSelect.options.length] = new Option(result[i].location, result[i]._id);
  			arrivalLocationSelect.options[arrivalLocationSelect.options.length] = new Option(result[i].location, result[i]._id);
  		}
  	});

  	$("#number-seats").TouchSpin({
        min: 1,
        max: 100,
        verticalbuttons: true,
	    verticalupclass: 'glyphicon glyphicon-plus',
	    verticaldownclass: 'glyphicon glyphicon-minus',
	    initval: 24
    });
    $('#schedule-date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });
    $('.schedule-time').clockpicker();

    $("#create-schedule-form").validate({
        rules: {
        	departure: {
        		required: true,
        		departurearrivalnotsame: true,
        	},
        	arrival: {
        		required: true,
        		departurearrivalnotsame: true,
        	},
            price: {
                required: true,
            },
            seats: {
                required: true,
            },
            date: {
                required: true,
                optdate: true,
            },
            time: {
                required: true,
                time24: true,
            },
        },
        errorPlacement: function(error, element) {
	        error.insertAfter($(element).closest('.input-group'));
    	},
    });
};

Template.createScheduleModalTemplate.events({
	'show.bs.modal #createScheduleModal': function(e){
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
    	$($('.status').closest('div')).find('.chosen-search').attr("style", "display: none;");
  	},
  	'submit #create-schedule-form'(event) {
  		event.preventDefault();
  		departureId = $('#departure-location').find(":selected").val();
	  	arrivalId = $('#arrival-location').find(":selected").val();
	  	status = $('#status').find(":selected").val();
	  	price = $("#price").val();
	  	seats = $("#number-seats").val();
	  	scheduleDate = $("#schedule-date").val();
	  	scheduleTime = $("#schedule-time").val();

	  	Meteor.call('schedules.insert', departureId, arrivalId, price, seats, scheduleDate, scheduleTime, status, function(error, result) {
  		if (!error) {

  			$('#createScheduleModal').modal('hide');

			toastr.success('Schedule created successfully.');
  		}
  	});
  	},
});