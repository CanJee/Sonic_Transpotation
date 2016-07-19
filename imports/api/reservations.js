import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Schedules } from '../../imports/api/schedules.js';

export const Reservations = new Mongo.Collection('reservations');

Meteor.methods({
  'reservations.insert'(scheduleId, departureId, arrivalId, passengerFirstName, passengerLastName ) {
    check(scheduleId, String);
    check(departureId, String);
    check(arrivalId, String);
    check(passengerFirstName, String);
    check(passengerLastName, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
	Reservations.insert({
	    scheduleId,
	    departureId,
	    arrivalId,
	    reservedByUserId: Meteor.users.findOne(this.userId).profile.name,
	    passengerFirstName,
	    passengerLastName,
	    status: 'confirmed',
	    reservationDate: new Date(),
	});
	updateSchedule = Schedules.find({ _id: scheduleId }).fetch()[0];
	remainingSeats = parseInt(updateSchedule.remainingSeats);
	remainingSeats--;
	remainingSeats = remainingSeats.toString();
	Schedules.update({_id : scheduleId},{$set:{remainingSeats}});
  },
  'reservations.find'(reservationId) {
    check(destinationId, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Reservations.find( { _id: reservationId } ).fetch()[0];
  },
});