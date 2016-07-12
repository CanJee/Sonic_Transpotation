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
    location = capitalizeFirstLetter(location);
    iso = iso.toUpperCase();
    Destinations.insert({
      location,
      iso,
      createdBy: Meteor.users.findOne(this.userId).profile.name,
    });
  },
  'destinations.remove'(destinationId) {
    check(destinationId, String);
 
    Destinations.remove(destinationId);
  },
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}