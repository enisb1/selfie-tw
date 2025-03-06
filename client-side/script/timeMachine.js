import { install } from '@sinonjs/fake-timers';

let clock = null;

export function setClientGlobalTime(date) {
    if (clock) {
        clock.uninstall();
    }

    clock = install({now: date, shouldAdvanceTime: true, shouldClearNativeTimers: true});
}

export function rollBackClientTime() {
    if (clock) {
        clock.uninstall();
    }
    clock = null;
}