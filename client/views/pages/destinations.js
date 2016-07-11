import { Destinations } from '../../../imports/api/destinations.js';

Template.destinations.helpers({
  destinations() {
    return Destinations.find({});
  },
});