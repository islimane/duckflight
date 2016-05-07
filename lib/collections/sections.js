Sections = new Mongo.Collection('sections');


Meteor.methods({
    insertSection: function(section){
        Lessons.update({_id: section.lesson_id},{$inc: {sections_count: 1}});
        return Sections.insert(section);
    },
    updateSectionPlayOption: function(section_id,option,value){
        switch(option){
            case 'auto-play':
                return Sections.update({_id: section_id},{$set: {auto_play: value}});
                break;
            case 'auto-repeat':
                return Sections.update({_id: section_id},{$set: {auto_repeat: value}});
                break;
        }
    },
    incrementSectionRecord: function(section_id){
        Sections.update({_id: section_id},{$inc: {records_count: 1}});
    },
    removeSection: function(section_id){
        var section = Sections.findOne(section_id);
        var nextSections = Sections.find({lesson_id: section.lesson_id, order: {$gt: section.order}}).fetch();
        _(nextSections).each(function(s){
            Sections.update(s._id,{$inc: {order: -1}});
        });
        Lessons.update({_id: section.lesson_id},{$inc: {sections_count: -1}});
        return Sections.remove(section_id);
    }
});
