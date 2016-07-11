Template.mainLayout.rendered = function(){

    // Minimalize menu when screen is less than 768px
    $(window).bind("resize load", function () {
        if ($(this).width() < 769) {
            $('body').addClass('body-small')
        } else {
            $('body').removeClass('body-small')
        }
    });

    // Fix height of layout when resize, scroll and load
    $(window).bind("load resize scroll", function() {
        if(!$("body").hasClass('body-small')) {

            var navbarHeigh = $('nav.navbar-default').height();
            var wrapperHeigh = $('#page-wrapper').height();

            if(navbarHeigh > wrapperHeigh){
                $('#page-wrapper').css("min-height", navbarHeigh + "px");
            }

            if(navbarHeigh < wrapperHeigh){
                $('#page-wrapper').css("min-height", $(window).height()  + "px");
            }

            if ($('body').hasClass('fixed-nav')) {
                if (navbarHeigh > wrapperHeigh) {
                    $('#page-wrapper').css("min-height", navbarHeigh - 60 + "px");
                } else {
                    $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
                }
            }
        }
    });


    // SKIN OPTIONS
    // Uncomment this if you want to have different skin option:
    // Available skin: (skin-1 or skin-3, skin-2 deprecated)
    // $('body').addClass('skin-1');

    // FIXED-SIDEBAR
    // Uncomment this if you want to have fixed left navigation
    // $('body').addClass('fixed-sidebar');
    // $('.sidebar-collapse').slimScroll({
    //     height: '100%',
    //     railOpacity: 0.9
    // });

    // BOXED LAYOUT
    // Uncomment this if you want to have boxed layout
    // $('body').addClass('boxed-layout');


};

Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var name = $('input#name').val();
        var email = $('input#email').val();
        var password = $('input#password').val();
        var options = {
            email: email,
            password: password,
            profile: {
                name: name
            },
        }
        Accounts.createUser( options , function(error){
            if(error){
                console.log(error.reason); // Output error if registration fails
            } else {
                Router.go("pageOne"); // Redirect user if registration succeeds
                debugger;
                Meteor.users.update({_id:Meteor.user()._id}, { $set: { profile: { name: name } } });
            }  
        });
    }

});

Template.loginTwo.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[type=email]').val();
        var password = $('[type=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
            if(error){
                console.log(error.reason);
            } else {
                Router.go("pageOne");
            }
        });
    }
});