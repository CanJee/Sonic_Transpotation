import { Meteor } from 'meteor/meteor';
import { Destinations} from '../imports/api/destinations.js';
import { Schedules} from '../imports/api/schedules.js';
import { Reservations} from '../imports/api/reservations.js';

Meteor.startup(() => {
  // code to run on server at startup
  Destinations._ensureIndex({iso: 1}, {unique: 1});
  Destinations._ensureIndex({location: 1}, {unique: 1});
});

Meteor.publish("directory", function () {
	return Meteor.users.find({}, {fields: {emails: 1, profile: 1, createdAt: 1}});
});

Meteor.users.allow({
    update: function () {
     // add custom authentication code here
    return true;
    },
    insert: function () {
     // add custom authentication code here
    return true;
    },
    remove: function () {
    	return true;
    },
});

Meteor.users.after.insert(function (userId, user) {
    if (user.profile.type === "admin") {
        Roles.addUsersToRoles(user._id, 'admin')
    } else if (user.profile.type === "user") {
        Roles.addUsersToRoles(user._id, 'user')
    }
});