Template.mainPage.events({
    'click .navigation-down': function(){
        $('#main-page-wrapper')
            .animate(
                {scrollTop: $(window).height() + $('#main-page-wrapper').scrollTop()},
                '500',
                'swing',
                function(){console.log('finish');}
            );
    },
    'click #tutorials': function(){
        window.open(Router.url('tutorials'));
    },
    'click .feature-description button': function(e){
        var id = $(e.currentTarget)[0].id;
        if (id !== 'tutorials'){
            window.open(Router.url('features',{},{query: 'section=' + id}));
        }
    },
    'click .social-icon': function(e){
        switch($(e.currentTarget)[0].id){
            case 'facebook':
                window.open('https://www.facebook.com/duckflight.duckflight');
                break;
            case 'google':
                window.open('https://plus.google.com/u/0/108177390557947103217/posts');
                break;
            case 'twitter':
                window.open('https://twitter.com/duckfligth');
                break;
            case 'github':
                window.open('https://github.com/duckflight');
                break;
        }
    }
});


