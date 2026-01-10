
import { AgentModule } from '../../core/AgentModule';
import { AgentDecision } from '../../core/types';

export class ActionExecutor extends AgentModule {
    constructor() {
        super('ActionExecutor');
    }

    async init(): Promise<void> {
        this.log('Initializing...');
    }

    async start(): Promise<void> {
        this.log('Ready to execute actions.');
    }

    async stop(): Promise<void> {
        this.log('Stopped.');
    }

    public async execute(decision: AgentDecision) {
        if (decision.actionType === 'NONE') return;

        this.log(`EXECUTING ACTION: [${decision.actionType}]`);
        this.log(`Reason: ${decision.reason}`);
        
        switch (decision.actionType) {
            case 'PING_USER':
                await this.mockSendNotification("Are you okay? We detected some unusual activity.");
                break;
            case 'ALERT_CONTACTS':
                await this.mockSendSMS("Emergency Contact Alert: User might be in danger.");
                break;
            case 'CONTACT_AUTHORITIES':
                await this.mockCallAuthorities();
                break;
        }
    }

    private async mockSendNotification(msg: string) {
        console.log(`    >>> [NOTIFICATION SENT]: ${msg}`);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 100));
    }

    private async mockSendSMS(msg: string) {
        console.log(`    >>> [SMS SENT]: ${msg}`);
        await new Promise(r => setTimeout(r, 100));
    }

    private async mockCallAuthorities() {
        console.log(`    >>> [911 API CALLED] Location shared with authorities.`);
        await new Promise(r => setTimeout(r, 100));
    }
}
