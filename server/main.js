import { Meteor } from 'meteor/meteor';
import { Destinations} from '../imports/api/destinations.js';
import { Schedules} from '../imports/api/schedules.js';
import { Reservations} from '../imports/api/reservations.js';

Meteor.startup(() => {
  // code to run on server at startup
  Destinations._ensureIndex({iso: 1}, {unique: 1});
  Destinations._ensureIndex({location: 1}, {unique: 1});
});
