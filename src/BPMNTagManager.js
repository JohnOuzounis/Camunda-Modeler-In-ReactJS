export class BPMNTagManager {
    constructor() {
        this.actionTags = {};
        this.eventTags = {};
    }

    addAction(tag, functor) {
        this.actionTags[tag] = functor;
    }

    addEvent(tag, description) {
        this.eventTags[tag] = description;
    }

    invokeAction(tag, eventData) {
        const functor = this.actionTags[tag];
        if (functor && typeof functor === 'function') {
            functor(eventData);
        } else {
            console.error(`Action tag "${tag}" does not have a corresponding functor.`);
        }
    }

    postEvent(tag, eventData) {
        const description = this.eventTags[tag];
        if (description) {
            console.log(`Posted event "${tag}": ${description}`);
        } else {
            console.warn(`No description found for event tag "${tag}".`);
        }
    }
}
