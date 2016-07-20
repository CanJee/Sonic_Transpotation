import { Meteor } from 'meteor/meteor';
import { Members } from '../../../imports/api/members.js';

Template.members.rendered = function(){

};

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
	},
});

Template.member.rendered = function(){
	$("[data-toggle=tooltip]").tooltip({
    	container: 'body',
	});
};