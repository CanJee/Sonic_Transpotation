import { Reservations } from '../../../imports/api/reservations.js';

Template.passengerList.rendered = function(){
	$('.tooltip').not(this).hide();
};

Template.passengerList.helpers({
  passengers() {
  	scheduleId = Session.get('passengerListScheduleId');
  	reservationsList = Reservations.find({ scheduleId });
  	var objArray = [];
	reservationsList.forEach(function(obj){
		if (obj.status === 'confirmed'){
			objArray.push(obj);
		}
	})
	return objArray;
  },
});