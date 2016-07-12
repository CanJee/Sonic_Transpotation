import { Meteor } from 'meteor/meteor';

Template.editDestinationModalTemplate.rendered = function(){
	$("#edit-destination-form").validate({
        rules: {
            location2: {
                required: true,
                minlength: 3,
                lettersonly: true
            },
            iso2: {
                required: true,
                minlength: 3,
                maxlength: 3,
                lettersonly: true
            }
        },
    });
};

Template.editDestinationModalTemplate.events({
  'show.bs.modal #editDestinationModal': function(e){
    id = $(e.relatedTarget)[0]._id
    Meteor.call('destinations.find', id, function(error, result) {
	    if (!error) {
	    	$("#modal-loc-id").val(result._id);
	    	$("#modal-created-by").val(result.createdBy);
	    	$("#modal-location").val(result.location);
	    	$("#modal-iso").val(result.iso);
	    }
	});
  },
  'submit #edit-destination-form'(event) {
  	event.preventDefault();
  	id = $("#modal-loc-id").val();
	desLocation = $("#modal-location").val();
	iso = $("#modal-iso").val();
  	Meteor.call('destinations.update', id, desLocation, iso, function(error, result) {
  		if (!error) {

  			$('#editDestinationModal').modal('hide');

			toastr.success('Destination updated successfully.');
  		}
  	});
  },
});