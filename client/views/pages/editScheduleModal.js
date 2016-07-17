import { Meteor } from 'meteor/meteor';
import { Destinations } from '../../../imports/api/destinations.js';

Template.editScheduleModalTemplate.rendered = function(){


};

Template.editScheduleModalTemplate.events({
	'show.bs.modal #editScheduleModal': function(e){
		id = $(e.relatedTarget)[0]._id
		departureLocation = $(e.relatedTarget)[0].departureLocation
		arrivalLocation = $(e.relatedTarget)[0].arrivalLocation
   		Meteor.call('schedules.find', id, function(error, result) {
		    if (!error) {
		    	$("#edit-schedule-id").val(id);
		    	$("#edit-departure-location").val(departureLocation);
		    	$("#edit-arrival-location").val(arrivalLocation);
		    	$("#edit-price").val(result.price);
		    	$("#edit-seats-remaining").val(result.remainingSeats);
		    	$("#edit-schedule-date").val(result.departureDate);
		    	$("#edit-schedule-time").val(result.departureTime);
		    }
	  	});
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
    	$($('.status').closest('div')).find('.chosen-search').attr("style", "display: none;");
  	},
  	'submit #edit-schedule-form'(event) {
  		event.preventDefault();
  		scheduleId = $("#edit-schedule-id").val();
	  	status = $('#edit-status').find(":selected").val();
	  	Meteor.call('schedules.updateStatus', scheduleId, status, function(error, result) {
  		if (!error) {

  			$('#editScheduleModal').modal('hide');

			toastr.success('Schedule status updated successfully.');
  		}
  	});
  	},
});