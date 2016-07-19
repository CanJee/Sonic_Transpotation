import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Schedules = new Mongo.Collection('schedules');

Meteor.methods({
	'schedules.insert'(departureId, arrivalId, price, availableSeats, departureDate, departureTime, status) {
	    check(departureId, String);
	    check(arrivalId, String);
	    check(price, String);
	    check(availableSeats, String);
	    check(departureDate, String);
	    check(departureTime, String);
	    check(status, String);

	    // Make sure the user is logged in before inserting a task
	    if (! this.userId) {
	      throw new Meteor.Error('not-authorized');
	    }

      Schedules.insert({
      	departureId,
      	arrivalId,
      	price,
      	availableSeats,
      	remainingSeats: availableSeats,
        departureDate,
        departureTime,
        status,
        createdOn: new Date(),
        createdBy: Meteor.users.findOne(this.userId).profile.name,
      });
  	},
  	'schedules.find'(scheduleId) {
	    check(scheduleId, String);

	    // Make sure the user is logged in before inserting a task
	    if (! this.userId) {
	      throw new Meteor.Error('not-authorized');
	    }

	    return Schedules.find( { _id: scheduleId } ).fetch()[0];
	 },
  	'schedules.findAll'(test) {
	    // Make sure the user is logged in before inserting a task
	    if (! this.userId) {
	      throw new Meteor.Error('not-authorized');
	    }

	    return Schedules.find().fetch();
  	},
  	'schedules.findByDepartureArrivalDate'(departureId, arrivalId, departureDate) {
	    // Make sure the user is logged in before inserting a task
	    if (! this.userId) {
	      throw new Meteor.Error('not-authorized');
	    }

	    return Schedules.find( { departureId, arrivalId, departureDate } ).fetch()
  	},
  	'schedules.updateStatus'(scheduleId, status) {
	    // Make sure the user is logged in before inserting a task
	    if (! this.userId) {
	      throw new Meteor.Error('not-authorized');
	    }

	    Schedules.update({_id : scheduleId},{$set:{status}});
  	},
});