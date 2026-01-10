
import { EventEmitter } from 'events';

export abstract class AgentModule extends EventEmitter {
    constructor(public name: string) {
        super();
    }

    abstract init(): Promise<void>;
    abstract start(): Promise<void>;
    abstract stop(): Promise<void>;

    protected log(message: string) {
        console.log(`[${this.name}] ${message}`);
    }
}
