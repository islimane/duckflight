Notifications = new Mongo.Collection('notifications');

Meteor.methods({
    insertNotification: function(notification){
        Notifications.insert(notification);
    },
    notificationRemove: function(notification_id,user_id){
        var notification = Notifications.findOne(notification_id);
        if (notification.to.length > 1){
            var usersTo = _(notification.to).filter(function(u_id){
                return u_id != user_id;
            });
            Notifications.update({_id: notification_id},{$set: {to: usersTo}});
        }else{
            Notifications.remove({_id: notification_id});
        }
    }
});