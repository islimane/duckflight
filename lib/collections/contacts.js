Relations = new Mongo.Collection('relations');

Meteor.methods({
    insertRelation: function(relation){
        return Relations.insert(relation);
    },
    relationRemove: function(relation_id){
        return Relations.remove(relation_id);
    }
});