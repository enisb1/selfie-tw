import Agenda from "agenda";
import Notification from "../models/Notification.js";
import {mailer, wsConnectionHandler} from "../server-deploy.js";
import {Message} from "./wsHandler.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";

export class AgendaHandler {
    constructor(mongo_uri) {
        this.agenda = new Agenda({
            db: {address: mongo_uri, collection: 'jobs'},
            processEvery: '20 seconds'
        });
    }

    async start() {
        try {
            await this.agenda.start();
            console.log('Agenda started');
        } catch (error) {
            console.error('Failed to start agenda:', error);
        }
    }

    async stop() {
        await this.agenda.stop();
    }

    async defineJobs() {
        this.agenda.define('event notification', async (job) => {
            const event = job.attrs.data.event;
            for (const userid of event.users) {
                const user = await User.findById(userid);

                await this.sendPushNotification(user.username, `Event starting ${job.attrs.data.startingIn}`, `Event ${event.title} is starting ${job.attrs.data.startingIn}`, 'calendar');

            }
        });

        this.agenda.define('activity notification', async (job) => {
            const activityId = job.attrs.data.activityId;
            //check if activity is still active
            const activity = await Activity.findOne({_id: activityId});
            if (activity) {
                if (activity.isDone) {
                    return;
                } else {

                    let alert_message = '';
                    switch (job.attrs.data.alert) {
                        case 0: alert_message = 'is now!'; break;
                        case 1: alert_message = 'was yesterday!'; break;
                        case 2: alert_message = 'was two days ago!'; break;
                        case 3: alert_message = 'was three days ago!'; break;
                    }
                    for (const userid of activity.users) {
                        const user = await User.findById(userid);
                        this.sendPushNotification(user.username, 'Activity deadline', `Activity ${activity.title} deadline ${alert_message}`, 'reminder');
                        if (job.attrs.data.alert < 3) {
                            await this.agenda.schedule(new Date(job.attrs.nextRunAt.getTime() + 86400000), 'activity notification', {activityId: activityId, alert: job.attrs.data.alert + 1});
                        }
                    }
                }
            }else{
                console.log('Activity to send notification not found');
            }

        });

    }

    //TODO: Funzione da usare all'esterno per schedulare le notifiche degli eventi
    async scheduleEventNotifications(event) {

        if (event.repetitionNumber) {
            await this.scheduleEventNotificationRepetitionNumber(event, event.startDate);
        } else if (event.repetitionDate) {
            await this.scheduleEventNotificationRepetitionDate(event, event.startDate);
        } else {
            await this.scheduleEventNotification(event, event.startDate);
        }


    }

    async scheduleEventNotificationRepetitionNumber(event, notificationStart) {
        let notificationTime = notificationStart;
        for (let i = 0; i < event.repetitionNumber; i++) {
            notificationTime = await this.scheduleAndIncrement(event, notificationTime);
        }
    }

    async scheduleEventNotificationRepetitionDate(event, notificationStart) {
        let notificationTime = notificationStart;
        while (notificationTime < event.repetitionDate) {
            notificationTime = await this.scheduleAndIncrement(event, notificationTime);
        }
    }

    async scheduleAndIncrement(event, notificationTime) {
        await this.scheduleEventNotification(event, notificationTime);
        let time = notificationTime;
        switch (event.frequency) {
            case 'daily':
                time = new Date(notificationTime.getTime() + 86400000);
                break;
            case 'weekly':
                time = new Date(notificationTime.getTime() + 604800000);
                break;
            case 'monthly':
                time = new Date(notificationTime.getTime() + 2592000000);
                break;
            case 'yearly':
                time = new Date(notificationTime.getTime() + 31536000000);
                break;
        }
        return time;
    }

    async scheduleEventNotification(event, notificationStart) {
        if (event.notify15Before){
            await this.agenda.schedule(new Date(notificationStart.getTime() - 900000), 'event notification', {event: event, startingIn: "in 15 minutes"});
        }
        if (event.notify30Before){
            await this.agenda.schedule(new Date(notificationStart.getTime() - 1800000), 'event notification', {event: event, startingIn: "in 30 minutes"});
        }
        if (event.notify1HourBefore){
            await this.agenda.schedule(new Date(notificationStart.getTime() - 3600000), 'event notification', {event: event, startingIn: "in 1 hour"});
        }
        if (event.notify1DayBefore){
            await this.agenda.schedule(new Date(notificationStart.getTime() - 86400000), 'event notification', {event: event, startingIn: "tomorrow"});
        }
        await this.agenda.schedule(notificationStart, 'event notification', {event: event, startingIn: "now"});

    }

    //TODO: funziona da chiamare qunado si crea una activity
    async scheduleActivityNotifications(activity) {
        await this.agenda.schedule(activity.deadline, 'activity notification', {activityId: activity._id, alert: 0});
    }

    async sendPushNotification(receiver, title, text, type) {
        try {
            const message = new Notification({
                sender: "server",
                receiver: receiver,
                time: new Date(),
                read: false,
                title: title,
                text: text,
                type: type
            });
            await message.save();
            await wsConnectionHandler.sendPushNotification(new Message('server', receiver, 'notification', message));
            await mailer.sendMail(text, await mailer.getEmailFromUsername(receiver), title);
        } catch (error) {
            console.error('Error saving notification:', error);
        }
    }

    async dropScheduledActivityNotifications(activityId){
        await this.agenda.cancel({name: 'activity notification', 'data.activityId': activityId});
    }

    async dropScheduledEventNotifications(eventId){
        await this.agenda.cancel({name: 'event notification', 'data.event._id': eventId});
    }

    async disablePastScheduledNotifications(date){
        const jobs = await this.agenda.jobs({ nextRunAt: { $lt: new Date(date) } });
        for (let job of jobs) {
            job.attrs.disabled = true;
            await job.save();
        }
    }

    async enableFutureScheduledNotifications(date){
        const jobs = await this.agenda.jobs({ nextRunAt: { $gt: new Date(date) } });
        for (let job of jobs) {
            job.attrs.disabled = false;
            await job.save();
        }

        const alreadyRunJobs = await this.agenda.jobs({ lastRunAt: { $exists: true , $gt: new Date(date)} });

        for (let job of alreadyRunJobs) {
            if (job.attrs.lastRunAt) {
                job.attrs.nextRunAt = job.attrs.lastRunAt;
                job.attrs.disabled = false;
                await job.save();
            }
        }
    }

}