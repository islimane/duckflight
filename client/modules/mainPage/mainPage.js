Template.mainPage.events({
    'click .navigation-down': function(){
        $('#main-page-wrapper')
            .animate(
                {scrollTop: $(window).height()},
                '500',
                'swing',
                function(){console.log('finish');}
            );
    }
});


