import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Destinations = new Mongo.Collection('destinations');

Meteor.methods({
  'destinations.insert'(location, iso) {
    check(location, String);
    check(iso, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    var location = capitalizeFirstLetter(location);
    var iso = iso.toUpperCase();
    if (Destinations.findOne({location : location})) {
      throw new Meteor.Error(`Location ${location} already exists.`);
    }
    else if (Destinations.findOne({iso : iso})) {
      throw new Meteor.Error(`ISO code ${iso} already exists.`);
    }
    else {
      Destinations.insert({
        location,
        iso,
        createdBy: Meteor.users.findOne(this.userId).profile.name,
      });
    }
  },
  'destinations.remove'(destinationId) {
    check(destinationId, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Destinations.remove(destinationId);
  },
  'destinations.find'(destinationId) {
    check(destinationId, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Destinations.find( { _id: destinationId } ).fetch()[0];
  },
  'destinations.findAll'(test) {
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Destinations.find().fetch();
  },
  'destinations.update'(destinationId, location, iso) {
    check(destinationId, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Destinations.update({_id : destinationId},{$set:{location, iso}});
  },
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}