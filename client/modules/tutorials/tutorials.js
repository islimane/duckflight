Template.tutorials.helpers({
    sectionTemplate: function(){
        return Session.get('section') + 'Tutorials';
    }
});

Template.subsectionTutorial.helpers({
    currentSubsection: function(){
        return Session.get('subsection');
    }
});
