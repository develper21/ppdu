
import { AgentModule } from '../../core/AgentModule';
import { UserContext, GeoLocation, UserActivity } from '../../core/types';

export class ContextObserver extends AgentModule {
    private currentContext: UserContext | null = null;

    constructor() {
        super('ContextObserver');
    }

    async init(): Promise<void> {
        this.log('Initializing...');
    }

    async start(): Promise<void> {
        this.log('Started monitoring.');
    }

    async stop(): Promise<void> {
        this.log('Stopped monitoring.');
    }

    public updateContext(partialContext: Partial<UserContext>) {
        if (!this.currentContext) {
            // Default initialization if null
            this.currentContext = {
                userId: partialContext.userId || 'unknown',
                location: partialContext.location || { latitude: 0, longitude: 0, timestamp: Date.now() },
                activity: partialContext.activity || UserActivity.UNKNOWN,
                lastActive: Date.now()
            };
        }

        // Merge updates
        this.currentContext = { ...this.currentContext, ...partialContext, lastActive: Date.now() };
        
        this.emit('context-updated', this.currentContext);
        this.log(`Context updated for user ${this.currentContext.userId}. Activity: ${this.currentContext.activity}`);
    }

    public getContext(): UserContext | null {
        return this.currentContext;
    }
}
