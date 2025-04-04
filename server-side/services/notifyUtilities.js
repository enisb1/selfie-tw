import User from "../models/User.js";
import {mailer, wsConnectionHandler} from "../server-deploy.js";
import Notification from "../models/Notification.js";
import {Message} from "./wsHandler.js";

export async function sendEventNotificationToUsers(event, users, creator) {
    for (const userId of users) {
        const user = await User.findOne({_id: userId});
        const notification = new Notification({
            sender: creator,
            receiver: user.username,
            time: new Date(),
            read: false,
            title: event.title,
            text: `You have been invited to the event: ${event.title}`,
            type: "invite",
            data: {
                type: "event",
                id: event._id,
                status: "pending"
            }
        });
        await notification.save();
        await wsConnectionHandler.sendPushNotification(new Message('server', user.username, 'notification', notification));
    }
}

export async function sendActivityNotificationToUsers(activity, users,creator) {
    for (const userId of users) {
        const user = await User.findOne({_id: userId});
        const notification = new Notification({
            sender: creator,
            receiver: user.username,
            time: new Date(),
            read: false,
            title: activity.title,
            text: `You have been invited to the activity: ${activity.title}`,
            type: "invite",
            data: {
                type: "activity",
                id: activity._id,
                status: "pending"
            }
        });
        await notification.save();
        await wsConnectionHandler.sendPushNotification(new Message('server', user.username, 'notification', notification));
        await mailer.sendMail(`You have been invited to the activity: ${activity.title}`, user.email,activity.title);
    }
}

export async function sendProjectInviteNotifications(project, memberIDs, creatorID) {
    const creator = await User.findOne({_id: creatorID});

    for (const memberID of memberIDs) {
        const member = await User.findOne({_id: memberID});
        const notification = new Notification({
            sender: creator.username,
            receiver: member.username,
            time: new Date(),
            read: false,
            title: 'Project invitation',
            text: `You have been invited to join project ${project.name}, created by ${creator.username}.`,
            type: 'invite',
            data: {
                type: "project",
                id: project._id,
                status: "pending"
            }
        });
        await notification.save();
        await wsConnectionHandler.sendPushNotification(new Message('server', member.username, 'notification', notification));
    }
}

export async function sendProjectNotificationToMembers(users, projectTitle,message) {
    for (const userId of users) {
        const user = await User.findOne({_id: userId});
        const notification = new Notification({
            sender: "server",
            receiver: user.username,
            time: new Date(),
            read: false,
            title: projectTitle,
            text: message,
            type: "project"
        });
        await notification.save();
        await wsConnectionHandler.sendPushNotification(new Message('server', user.username, 'notification', notification));
    }
}