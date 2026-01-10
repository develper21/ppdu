
import { ContextObserver } from './modules/context-observer/ContextObserver';
import { RiskEngine } from './modules/risk-engine/RiskEngine';
import { DecisionEngine } from './modules/decision-engine/DecisionEngine';
import { ActionExecutor } from './modules/action-executor/ActionExecutor';
import { EthicsGuard } from './modules/ethics-guard/EthicsGuard';
import { UserContext } from './core/types';

export class SafetyAgent {
    private contextObserver: ContextObserver;
    private riskEngine: RiskEngine;
    private decisionEngine: DecisionEngine;
    private ethicsGuard: EthicsGuard;
    private actionExecutor: ActionExecutor;

    constructor() {
        this.contextObserver = new ContextObserver();
        this.riskEngine = new RiskEngine();
        this.decisionEngine = new DecisionEngine();
        this.ethicsGuard = new EthicsGuard();
        this.actionExecutor = new ActionExecutor();

        this.setupPipeline();
    }

    private setupPipeline() {
        // Core Event Loop
        // 1. Context Updated -> Calculate Risk
        this.contextObserver.on('context-updated', (context: UserContext) => {
            console.log('\n-----------------------------------');
            this.handleContextUpdate(context);
        });
    }

    private async handleContextUpdate(context: UserContext) {
        try {
            // 2. Risk Engine
            const riskEvaluation = this.riskEngine.evaluateRisk(context);

            // 3. Decision Engine
            const decision = this.decisionEngine.makeDecision(riskEvaluation);

            // 4. Ethics/Safety Guard
            const ethicsCheck = this.ethicsGuard.validateAction(context.userId, decision);

            if (ethicsCheck.allowed) {
                // 5. Action Executor
                await this.actionExecutor.execute(decision);
            } else {
                console.warn(`[Blocked] Action prevented by Ethics Guard: ${ethicsCheck.reason}`);
            }
        } catch (error) {
            console.error('Error in agent loop:', error);
        }
    }

    public async start() {
        console.log('Starting Women\'s Safety Agent System...');
        await this.contextObserver.start();
        await this.riskEngine.start();
        await this.decisionEngine.start();
        await this.ethicsGuard.start();
        await this.actionExecutor.start();
        console.log('System is live.\n');
    }

    public async stop() {
        await this.contextObserver.stop();
        // ... stop others
    }

    // Public API to ingest data (simulating sensor input)
    public ingestData(data: Partial<UserContext>) {
        this.contextObserver.updateContext(data);
    }
}
