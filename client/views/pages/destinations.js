import { Meteor } from 'meteor/meteor';
import { Destinations } from '../../../imports/api/destinations.js';

Template.destinations.rendered = function(){

    // Set validation rules

    $("#destination-form").validate({
        rules: {
            location: {
                required: true,
                minlength: 3,
                lettersonly: true
            },
            min: {
                required: true,
                minlength: 3,
                maxlength: 3,
                lettersonly: true
            }
        },
    });
};

Template.destinations.helpers({
  destinations() {
    return Destinations.find({});
  },
});

Template.destinations.events({
  'submit #destination-form'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const location = $('input#location').val();
    const iso = $('input#iso').val();
 
    // Insert a task into the collection
    Meteor.call('destinations.insert', location, iso);
  },
  'click .delete-destination'(event) {
  	event.preventDefault();
  	const locationId = $(event.target).attr('loc-id')

  	Meteor.call('destinations.remove', locationId);
  },
});