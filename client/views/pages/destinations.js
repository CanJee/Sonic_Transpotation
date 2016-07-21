import { Meteor } from 'meteor/meteor';
import { Destinations } from '../../../imports/api/destinations.js';

Template.destinations.rendered = function(){

    // Set validation rules

    $("#destination-form").validate({
        rules: {
            location: {
                required: true,
                minlength: 3
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

Template.destination.rendered = function(){
	$("[data-toggle=tooltip]").tooltip();
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
    Meteor.call('destinations.insert', location, iso, function(error, result) {
      if (!error) {
        toastr.success('Destination added successfully.');
      }
      else {
        toastr.error(error.error);
      }
    });
  },
  'click .delete-destination'(event) {
  	event.preventDefault();
  	const locationId = $(event.target).attr('loc-id')
  	const location = $(event.target).attr('location')
  	const iso = $(event.target).attr('iso')
  	swal({
        title: "Are you sure?",
        text: `Destination ${location} (${iso}) will be deleted permanently!`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel plx!",
        closeOnConfirm: false,
        closeOnCancel: false },
    	function (isConfirm) {
	        if (isConfirm) {
				Meteor.call('destinations.remove', locationId);
	            swal("Deleted!", `Destination ${location} (${iso}) has been deleted successfully.`, "success");
	        } else {
	            swal("Cancelled", `Destination ${location} (${iso}) has not been deleted :)`, "error");
	        }
    	});
  },
  'click .edit-destination'(event) {
  	event.preventDefault();
    const locationId = $(event.target).attr('loc-id')
    const location = $(event.target).attr('location')
    const iso = $(event.target).attr('iso')
  	$('#editDestinationModal').modal('show', $(this));
  },
});