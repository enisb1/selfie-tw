import { install } from '@sinonjs/fake-timers';
import Event from '../models/Event.js';
import Activity from '../models/Activity.js';
import {agendaHandler} from "../server-deploy.js";

export class TimeMachineController {
    constructor() {
        this.clock = null;
    }

    async setNewGlobalTime(date) {
        if (this.clock) {
            this.clock.uninstall();
        }

        this.clock = install({now: date, shouldAdvanceTime: true, shouldClearNativeTimers: true});
        //await this.rescheduleEvents();
        //await this.rescheduleActivities();

    }

    async rollBackTime() {
        if (this.clock) {
            this.clock.uninstall();
        }
        this.clock = null;
    }

    async rescheduleEvents() {
       let events = await Event.find();
         for (const event of events) {
              await agendaHandler.scheduleEventNotifications(event)
         }
    }

    async rescheduleActivities() {
        let activities = await Activity.find();
        for (const activity of activities) {
            await agendaHandler.scheduleActivityNotifications(activity);
        }
    }


}