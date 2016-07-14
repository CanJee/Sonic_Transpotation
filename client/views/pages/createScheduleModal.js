import { Meteor } from 'meteor/meteor';
import { Destinations } from '../../../imports/api/destinations.js';

Template.createScheduleModalTemplate.rendered = function(){
	var departureLocationSelect = document.getElementById('departure-location');
	var arrivalLocationSelect = document.getElementById('arrival-location');
	Meteor.call('destinations.findAll', 'test', function(error, result) {
  		for (i = 0; i < result.length; i++) {
  			departureLocationSelect.options[departureLocationSelect.options.length] = new Option(result[i].location, result[i]._id);
  			arrivalLocationSelect.options[arrivalLocationSelect.options.length] = new Option(result[i].location, result[i]._id);
  		}
  	});
};

Template.createScheduleModalTemplate.events({
	'show.bs.modal #createScheduleModal': function(e){
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
  	},
});