Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound'

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

//
// Example pages routes
//

Router.route('/register', function () {
	if (!Meteor.userId()) {
	    this.render('register');
	    this.layout('blankLayout')
	}
	else {
		Router.go('pageOne', {replaceState: true});
	}

});

Router.route('/login', function () {
	if (!Meteor.userId()) {
	    this.render('loginTwo');
	    this.layout('blankLayout')
	}
	else {
		Router.go('pageOne', {replaceState: true});
	}
});

Router.route('/', function () {
    Router.go('pageOne', {replaceState: true});
});

Router.route('/errorTwo', function () {
    Router.go('errorTwo');
});

Router.route('/pageOne', function () {
    this.render('pageOne');
});

Router.route('/pageTwo', function () {
    this.render('pageTwo');
});

Router.route('/*', function () {
    this.render('errorTwo');
    this.layout('blankLayout')
});