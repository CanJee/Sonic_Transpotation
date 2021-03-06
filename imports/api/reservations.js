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
  	var createdReservationId = Reservations.insert({
  	    scheduleId,
  	    departureId,
  	    arrivalId,
  	    reservedByUserId: this.userId,
  	    reservedByUserName: Meteor.users.findOne(this.userId).profile.name,
  	    reservedByUserEmail: Meteor.users.findOne(this.userId).emails[0].address,
  	    passengerFirstName,
  	    passengerLastName,
  	    status: 'confirmed',
  	    reservationDate: moment().format('ddd MMMM Do YYYY'),
  	});
  	updateSchedule = Schedules.find({ _id: scheduleId }).fetch()[0];
  	remainingSeats = parseInt(updateSchedule.remainingSeats);
  	remainingSeats--;
  	remainingSeats = remainingSeats.toString();
  	Schedules.update({_id : scheduleId},{$set:{remainingSeats}});
    return createdReservationId;
  },
  'reservations.find'(reservationId) {
    check(reservationId, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Reservations.find( { _id: reservationId } ).fetch()[0];
  },
  'reservations.cancel'(reservationId) {
    check(reservationId, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    scheduleId = Reservations.find( { _id: reservationId } ).fetch()[0].scheduleId;
    updateSchedule = Schedules.find({ _id: scheduleId }).fetch()[0];
	remainingSeats = parseInt(updateSchedule.remainingSeats);
	remainingSeats++;
	remainingSeats = remainingSeats.toString();
	Schedules.update({_id : scheduleId},{$set:{remainingSeats}});
    return Reservations.update({_id : reservationId},{$set:{status : 'cancelled'}});
  },
});