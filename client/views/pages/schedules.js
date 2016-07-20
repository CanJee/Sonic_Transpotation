import { Meteor } from 'meteor/meteor';
import { Schedules } from '../../../imports/api/schedules.js';
import { Destinations } from '../../../imports/api/destinations.js';

Template.schedules.rendered = function(){

    // Initialize fooTable
    $('.schedules-list').footable();

};

Template.schedules.helpers({
  schedules() {
  	schedulesList = Schedules.find({});
  	var objArray = [];
	schedulesList.forEach(function(obj){
		departureLocation = Destinations.find({_id: obj.departureId}).fetch()[0].location;
		arrivalLocation = Destinations.find({_id: obj.arrivalId}).fetch()[0].location;
		obj['departureLocation'] = departureLocation;
		obj['arrivalLocation'] = arrivalLocation;
		if (obj.remainingSeats == 0) {
			obj['statusRed'] = true;
		}
		else if (obj.remainingSeats <= 5) {
			obj['statusYellow'] = true;
		}
		else {
			obj['statusGreen'] = true;
		}
		if (obj.status == 'open') {
			obj['statusOpen'] = true;
		}
		else {
			obj['statusOpen'] = false;
		}
		objArray.push(obj);
	})
	return objArray;
  },
});

Template.schedules.events({
	'click .create-schedule'(event) {
		$('#createScheduleModal').modal('show');
	},
	'click .delete-schedule'(event) {
		swal({
            title: "Error",
            text: "Cannot delete a schedule at this time.",
            type: "error"
        });
	},
	'click .edit-schedule'(event) {
		event.preventDefault();
    	const scheduleId = $(event.target).attr('schedule-id')
    	const departureLocation = $(event.target).attr('departure-location')
    	const arrivalLocation = $(event.target).attr('arrival-location')
		$('#editScheduleModal').modal('show', $(this));
	}
});

Template.schedule.rendered = function(){
	$("[data-toggle=tooltip]").tooltip({
    	container: 'body',
	});
};