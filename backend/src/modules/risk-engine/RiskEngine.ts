
import { AgentModule } from '../../core/AgentModule';
import { UserContext, RiskEvaluation, SafetyStatus, UserActivity } from '../../core/types';

export class RiskEngine extends AgentModule {
    constructor() {
        super('RiskEngine');
    }

    async init(): Promise<void> {
        this.log('Initializing...');
    }

    async start(): Promise<void> {
        this.log('Ready to assess risks.');
    }

    async stop(): Promise<void> {
        this.log('Stopped.');
    }

    public evaluateRisk(context: UserContext): RiskEvaluation {
        let score = 0;
        const factors: string[] = [];

        // 1. Time based risk (Mock: Late night 10PM - 5AM is riskier)
        const hour = new Date(context.location.timestamp).getHours();
        if (hour >= 22 || hour <= 5) {
            score += 30;
            factors.push('Late Night');
        }

        // 2. Activity based risk
        if (context.activity === UserActivity.RUNNING) {
            // Running at night might be fleeing?
            if (hour >= 22 || hour <= 5) {
                score += 20;
                factors.push('Running at Night');
            }
        } else if (context.activity === UserActivity.STATIONARY) {
            // TODO: check how long stationary. For now, simplistic.
        }

        // 3. Audio Anomaly
        if (context.audioAnomalyDetected) {
            score += 50;
            factors.push('Audio Anomaly Detected (Scream/Crash)');
        }

        // 4. Route Deviation
        if (context.routeDeviationDetected) {
            score += 40;
            factors.push('Significant Route Deviation');
        }

        // Normalize Score
        score = Math.min(100, Math.max(0, score));

        // Determine Level
        let level = SafetyStatus.SAFE;
        if (score > 80) level = SafetyStatus.EMERGENCY;
        else if (score > 50) level = SafetyStatus.HIGH_RISK;
        else if (score > 20) level = SafetyStatus.CAUTION;

        this.log(`Risk evaluated: ${score} (${level}) - [${factors.join(', ')}]`);

        return {
            score,
            factors,
            timestamp: Date.now(),
            level
        };
    }
}
