import { Meteor } from 'meteor/meteor';

Template.editReservationsModalTemplate.rendered = function(){
	$("#edit-reservations-form").validate({
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

Template.editReservationsModalTemplate.events({
  'show.bs.modal #editReservationsModal': function(e){
    id = $(e.relatedTarget)[0]._id
    Meteor.call('reservations.find', id, function(error, result) {
	    if (!error) {
	    	$("#modal-loc-id").val(result._id);
	    	$("#modal-created-by").val(result.createdBy);
	    	$("#modal-location").val(result.location);
	    	$("#modal-iso").val(result.iso);
	    }
	  });
  },
  'submit #edit-reservations-form'(event) {
  	event.preventDefault();
  	id = $("#modal-loc-id").val();
	  desLocation = $("#modal-location").val();
	  iso = $("#modal-iso").val();
  	Meteor.call('reservations.update', id, desLocation, iso, function(error, result) {
  		if (!error) {

  			$('#editReservationsModal').modal('hide');

			toastr.success('Reservations updated successfully.');
  		}
  	});
  },
});