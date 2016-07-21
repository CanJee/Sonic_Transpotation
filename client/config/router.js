Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'errorOne',
    loadingTemplate: 'loading',
    waitOn: function () {
		return [ Meteor.subscribe("roles") ];
    }
});

Router.onBeforeAction(myAdminHookFunction, {
  except: ['register']
  // all properties available in the route function
  // are also available here such as this.params

});

function myAdminHookFunction() {
	if (!Meteor.userId()) {
		// if the user is not logged in, render the Login template
		this.render('loginTwo');
		this.layout('blankLayout')
	} else {
		// otherwise don't hold up the rest of hooks or our route/action function
		// from running
		this.next();
	}
}

function isAdmin() {
	if (Roles.userIsInRole( Meteor.userId(), 'admin' )) {
		return true;
	}
	else {
		return false;
	}
}

Router.route('/register', function () {
	if (!Meteor.userId()) {
	    this.render('register');
	    this.layout('blankLayout')
	}
	else {
		if (isAdmin()){
			Router.go('destinations', {replaceState: true});
		}
		else {
			Router.go('searchSchedules', {replaceState: true});
		}
	}

});

Router.route('/login', function () {
	if (!Meteor.userId()) {
	    this.render('loginTwo');
	    this.layout('blankLayout')
	}
	else {
		if (isAdmin()){
			Router.go('destinations', {replaceState: true});
		}
		else {
			Router.go('searchSchedules', {replaceState: true});
		}
	}
});

Router.route('/', function () {
	if (isAdmin()){
    	Router.go('destinations', {replaceState: true});
    }
    else {
    	Router.go('searchSchedules', {replaceState: true});
    }
});

Router.route('/errorTwo', function () {
    this.render('errorTwo');
});

Router.route('/errorOne', function () {
    this.render('errorOne');
});

Router.route('/destinations', function () {
    if (isAdmin()){
    	this.render('destinations');
    }
    else {
    	Router.go('errorOne', {replaceState: true});
    }
});

Router.route('/schedules', function () {
    if (isAdmin()){
    	this.render('schedules');
    	Session.set('showPassengerList', false);
    }
    else {
    	Router.go('errorOne', {replaceState: true});
    }
});

Router.route('/searchSchedules', function () {
    this.render('searchSchedules');
});

Router.route('/userReservations', function () {
    this.render('userReservations');
});

Router.route('/adminReservations', function () {
    if (isAdmin()){
    	this.render('adminReservations');
    }
    else {
    	Router.go('errorOne', {replaceState: true});
    }

});

Router.route('/settings', function () {
    if (isAdmin()){
    	this.render('settings');
    }
    else {
    	Router.go('errorOne', {replaceState: true});
    }
});

Router.route('/analytics', function () {
    if (isAdmin()){
    	this.render('analytics');
    }
    else {
    	Router.go('errorOne', {replaceState: true});
    }
});

Router.route('/members', function () {
    if (isAdmin()){
    	this.render('members');
    }
    else {
    	Router.go('errorOne', {replaceState: true});
    }
});

Router.route('/*', function () {
    Router.go('errorOne', {replaceState: true});
});