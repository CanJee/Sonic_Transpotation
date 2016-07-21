import { Meteor } from 'meteor/meteor';
import { Destinations} from '../imports/api/destinations.js';
import { Schedules} from '../imports/api/schedules.js';
import { Reservations} from '../imports/api/reservations.js';

Meteor.startup(() => {
  // code to run on server at startup
  Destinations._ensureIndex({iso: 1}, {unique: 1});
  Destinations._ensureIndex({location: 1}, {unique: 1});
});

Meteor.publish("members", function () {
	return Meteor.users.find({}, {fields: {emails: 1, profile: 1, createdAt: 1, roles: 1}});
});

Meteor.publish("roles", function (){
    if (this.userId) {
      Meteor._sleepForMs(700);
    }
    return Meteor.roles.find({});
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

if(Meteor.isServer){
  Meteor.users.after.insert(function (userId, user) {
    if (user.profile.type === "admin") {
        Roles.addUsersToRoles(user._id, 'admin')
    } else if (user.profile.type === "user") {
        Roles.addUsersToRoles(user._id, 'user')
    }
  });
}

Meteor.methods({
    'members.remove'(memberId) {
      check(memberId, String);
      // Make sure the user is logged in before inserting a task
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      return Meteor.users.remove({ _id: memberId });
    },
    'members.create'(email, password, name, role) {
      check(email, String);
      check(password, String);
      check(name, String);
      check(role, String);

      var options = {
          email,
          password,
          profile: {
              name,
              type: role,
          },
      }
      // Make sure the user is logged in before inserting a task
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      createdUserId = Accounts.createUser( options );
      if (createdUserId != null) {
        return true;
      }
      else {
        return false;
      }

    },
    'members.update'(memberId, email, password, name, role) {
      check(memberId, String);
      check(email, String);
      check(name, String);
      check(role, String);

      // Make sure the user is logged in before inserting a task
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      if (password != ""){
        updatedUser = Meteor.users.update(memberId, {$set: {'emails.0.address': email, profile: {name, type: role}}});
        Accounts.setPassword(memberId, password)
      }
      else {
        updatedUser = Meteor.users.update(memberId, {$set: {'emails.0.address': email, profile: {name, type: role}}});
      }

      if (updatedUser != null) {
        if (role === 'admin') {
          Roles.setUserRoles( memberId, 'admin' );
        }
        else if (role === 'user') {
          Roles.setUserRoles( memberId, 'user' );
        }
        return true;
      }
      else {
        return false;
      }

    },
});