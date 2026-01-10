
import { AgentModule } from '../../core/AgentModule';
import { RiskEvaluation, AgentDecision, SafetyStatus } from '../../core/types';
import { v4 as uuidv4 } from 'uuid';

export class DecisionEngine extends AgentModule {
    constructor() {
        super('DecisionEngine');
    }

    async init(): Promise<void> {
        this.log('Initializing...');
    }

    async start(): Promise<void> {
        this.log('Ready to make decisions.');
    }

    async stop(): Promise<void> {
        this.log('Stopped.');
    }

    public makeDecision(risk: RiskEvaluation): AgentDecision {
        const decision: AgentDecision = {
            actionId: uuidv4(),
            actionType: 'NONE',
            reason: 'Risk is within safety limits.',
            priority: 0,
            requiresConsent: false
        };

        switch (risk.level) {
            case SafetyStatus.EMERGENCY:
                decision.actionType = 'CONTACT_AUTHORITIES';
                decision.reason = `Critical risk detected: ${risk.factors.join(', ')}`;
                decision.priority = 10;
                decision.requiresConsent = true; // Ideally false for extreme cases, but let's say true for now or have override.
                break;
            
            case SafetyStatus.HIGH_RISK:
                decision.actionType = 'ALERT_CONTACTS';
                decision.reason = `High risk detected: ${risk.factors.join(', ')}`;
                decision.priority = 8;
                decision.requiresConsent = true;
                break;

            case SafetyStatus.CAUTION:
                decision.actionType = 'PING_USER';
                decision.reason = `Unusual activity or context detected.`;
                decision.priority = 5;
                decision.requiresConsent = false;
                break;
            
            case SafetyStatus.SAFE:
            default:
                // No action
                break;
        }

        this.log(`Decision made: ${decision.actionType} (Priority: ${decision.priority})`);
        return decision;
    }
}
