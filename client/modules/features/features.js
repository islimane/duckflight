Template.features.helpers({
    sectionData: function(){
        Session.set('currentImage',Session.get('section').images[0]);
        return Session.get('section');
    }
});

Template.featureDetail.helpers({
    class: function(){
        return this.id.split('-')[0];
    }
});

Template.gallery.events({
    'click img': function(){
        Session.set('currentImage',this);
        $('.image-full-screen').addClass('active');
    }
});

Template.galleryFullScreen.helpers({
    imageFeature: function(){
        return Session.get('currentImage');
    },
    isPossibleNext: function(){
        var images = Session.get('section').images;
        var currentIdx = Session.get('currentImage').order;
        return images.length -1 > currentIdx;
    },
    isPossiblePrev: function(){
        var currentIdx = Session.get('currentImage').order;
        return currentIdx;
    },
});

Template.galleryFullScreen.events({
    'click #close-gallery': function(){
        $('.image-full-screen').removeClass('active');
    },
    'click #prev': function(){
        var newIdx = Session.get('currentImage').order - 1;
        Session.set('currentImage',Session.get('section').images[newIdx]);
    },
    'click #next': function(){
        var newIdx = Session.get('currentImage').order + 1;
        Session.set('currentImage',Session.get('section').images[newIdx]);
    }
});