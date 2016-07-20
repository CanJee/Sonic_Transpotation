import { Meteor } from 'meteor/meteor';
import { Members } from '../../../imports/api/members.js';

Template.members.rendered = function(){

};

Template.members.events({
	'click .add-member'(event) {
		$('#createMembersModal').modal('show');
	},
});

Template.members.helpers({
  members() {
  	membersList = Meteor.users.find({});
  	var objArray = [];
  	var monthNames = 	[
						  "January", "February", "March",
						  "April", "May", "June", "July",
						  "August", "September", "October",
						  "November", "December"
						];
	membersList.forEach(function(obj){
		var date = new Date(obj.createdAt);
		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();
		obj['formattedDate'] = monthNames[monthIndex] + " " + day.toString() + ", " + year + " " + date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds();
		obj['email'] = obj.emails[0].address;
		obj['memberName'] = obj.profile.name;

		if (Roles.userIsInRole( obj._id, 'admin' )) {
			obj['statusYellow'] = false;
		}
		else {
			obj['statusYellow'] = true;
		}
		objArray.push(obj);
	})
	return objArray;
  },
});

Template.member.events({
	'click .delete-member'(event) {
		memberId = $(event.target).attr('member-id');
		if (Meteor.userId() === memberId) {
			swal({
					html:true,
		            title: "Error",
		            text: `You cannot delete yourself!`,
		            type: "error",
		        });
		}
		else {
			swal({
				html:true,
	        	title: "Are you sure?",
	        	text: `Member with ID <strong>${memberId}</strong> will be deleted permanently!`,
	        	type: "warning",
		        showCancelButton: true,
		        confirmButtonColor: "#DD6B55",
		        confirmButtonText: "Yes, delete it!",
		        cancelButtonText: "No, cancel plx!",
		        closeOnConfirm: false,
		        closeOnCancel: false 
		    },
	    	function (isConfirm) {
		        if (isConfirm) {
					Meteor.users.remove({ _id: memberId });
		            swal({
		            	html:true,
			            title: "Deleted!",
			            text: `Member with ID <strong>${memberId}</strong> has been deleted successfully.`,
			            type: "success",
			        },
		        	function(){
					    toastr.success('User removed successfully.');
					});
		        } else {
					swal({
						html:true,
			            title: "Cancelled",
			            text: `Member with ID <strong>${memberId}</strong> has not been deleted :)`,
			            type: "error",
			        });
		        }
	    	});
		}
	},
});

Template.member.rendered = function(){
	$("[data-toggle=tooltip]").tooltip({
    	container: 'body',
	});
};

Template.createMembersModalTemplate.rendered = function(){
	var config = {
        '.chosen-select'           : {},
        '.chosen-select-deselect'  : {allow_single_deselect:true},
        '.chosen-select-no-single' : {disable_search_threshold:10},
        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
        '.chosen-select-width'     : {width:"95%"},
	}
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }
	$('.chosen-container.chosen-container-single').attr("style", "width: 545px !important;");
	$('.chosen-container.chosen-container-single .chosen-drop').attr("style", "width: 545px !important;");
	$("#create-member-form").validate({
        rules: {

        },
        errorPlacement: function(error, element) {
	    	error.insertAfter($(element).closest('.input-group'));
    	},
    });
};

Template.createMembersModalTemplate.events({
	'submit #create-member-form'(event) {
		event.preventDefault();
		name = $('#member-name').val()
		email = $('#member-email').val();
		password = $('#member-password').val();
		role = $('#member-role').val();
		var options = {
            email,
            password,
            profile: {
                name,
                type: role,
            },
        }
        var createdUserId = Accounts.createUser( options , function(error){
        	if (!error) {
        		$('#createMembersModal').modal('hide');
        		toastr.success('Member created successfully.');
        	}
        });
	},
});