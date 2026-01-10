
import { AgentModule } from '../../core/AgentModule';
import { AgentDecision } from '../../core/types';

export class EthicsGuard extends AgentModule {
    // Mock user consent database
    private userConsentMap: Map<string, boolean> = new Map();

    constructor() {
        super('EthicsGuard');
        // Mock: User 'user1' has given full consent
        this.userConsentMap.set('user1', true);
    }

    async init(): Promise<void> {
        this.log('Initializing...');
    }

    async start(): Promise<void> {
        this.log('Guard is active.');
    }

    async stop(): Promise<void> {
        this.log('Stopped.');
    }

    public validateAction(userId: string, decision: AgentDecision): { allowed: boolean; reason?: string } {
        if (!decision.requiresConsent) {
            return { allowed: true };
        }

        const hasConsent = this.userConsentMap.get(userId);
        if (hasConsent) {
            this.log(`Action ${decision.actionType} allowed for ${userId} (Consent verified).`);
            return { allowed: true };
        }

        this.log(`Action ${decision.actionType} BLOCKED for ${userId} (No explicit consent).`);
        return { allowed: false, reason: 'User has not provided consent for this high-impact action.' };
    }
}
