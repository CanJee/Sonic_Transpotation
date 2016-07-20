import { Reservations } from '../../../imports/api/reservations.js';
import { Destinations } from '../../../imports/api/destinations.js';
import { Schedules } from '../../../imports/api/schedules.js';
import { Meteor } from 'meteor/meteor';

Template.reservations.rendered = function(){


};

Template.reservations.helpers({
  reservations() {
  	reservationsList = Reservations.find({});
  	var objArray = [];
	reservationsList.forEach(function(obj){
		departureLocation = Destinations.find({_id: obj.departureId}).fetch()[0].location;
		arrivalLocation = Destinations.find({_id: obj.arrivalId}).fetch()[0].location;
		scheduleObj = Schedules.find({_id: obj.scheduleId}).fetch()[0];
		obj['departureLocation'] = departureLocation;
		obj['arrivalLocation'] = arrivalLocation;
		obj['price'] = scheduleObj.price;
		obj['departureDate'] = scheduleObj.departureDate;
		obj['departureTime'] = scheduleObj.departureTime;
		if (obj.status == 'confirmed') {
			obj['cancelled'] = false;
		}
		else {
			obj['cancelled'] = true;
		}
		objArray.push(obj);
	})
	return objArray;
  },
});

Template.reservation.rendered = function() {
	Meteor.defer(function () {
    	$('.reservations-list').footable();
    });
};

Template.reservation.events({
	'click #cancel-reservation'(event) {
		scheduleId = $(event.target).attr('schedule-id');
		swal({
			html:true,
        	title: "Are you sure?",
        	text: `Reservation with ID <strong>${scheduleId}</strong> will be deleted permanently!`,
        	type: "warning",
	        showCancelButton: true,
	        confirmButtonColor: "#DD6B55",
	        confirmButtonText: "Yes, delete it!",
	        cancelButtonText: "No, cancel plx!",
	        closeOnConfirm: false,
	        closeOnCancel: false 
	    },
    	function (isConfirm) {
	        if (isConfirm) {
				Meteor.call('reservations.cancel', scheduleId, function(error, result) {
				});
	            swal({
	            	html:true,
		            title: "Deleted!",
		            text: `Reservation with ID <strong>${scheduleId}</strong> has been deleted successfully.`,
		            type: "success",
		        });
	        } else {
				swal({
					html:true,
		            title: "Cancelled",
		            text: `Reservation with ID <strong>${scheduleId}</strong> has not been deleted :)`,
		            type: "error",
		        });
	        }
    	});
	},
});