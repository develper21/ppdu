
import { SafetyAgent } from './agent';
import { UserActivity } from './core/types';

async function runScenario() {
    const agent = new SafetyAgent();
    await agent.start();

    // SCENARIO: User walking home late at night

    // Step 1: 9:00 PM - Safe walk in park
    console.log('[SIM] Update 1: 9:00 PM - Walking normally');
    agent.ingestData({
        userId: 'user1',
        location: {
            latitude: 40.7128,
            longitude: -74.0060,
            timestamp: new Date('2023-10-27T21:00:00').getTime()
        },
        activity: UserActivity.WALKING
    });

    await new Promise(r => setTimeout(r, 1000));

    // Step 2: 11:30 PM - Late night, still walking
    console.log('[SIM] Update 2: 11:30 PM - Late night walk');
    agent.ingestData({
        userId: 'user1',
        location: {
            latitude: 40.7138,
            longitude: -74.0070,
            timestamp: new Date('2023-10-27T23:30:00').getTime()
        },
        activity: UserActivity.WALKING
    });

    await new Promise(r => setTimeout(r, 1000));

    // Step 3: 11:45 PM - Audio Anomaly Detected (Scream)
    console.log('[SIM] Update 3: 11:45 PM - Audio Anomaly Detected!');
    agent.ingestData({
        userId: 'user1',
        location: {
            latitude: 40.7148,
            longitude: -74.0080,
            timestamp: new Date('2023-10-27T23:45:00').getTime()
        },
        activity: UserActivity.RUNNING, // Started running
        audioAnomalyDetected: true
    });

     await new Promise(r => setTimeout(r, 1000));

    // Step 4: No consent user
    console.log('[SIM] Update 4: Another user (no consent) in danger');
    agent.ingestData({
        userId: 'user_paramanoid', // This user is not in the consent map
        location: {
            latitude: 40.7148,
            longitude: -74.0080,
            timestamp: new Date('2023-10-27T23:45:00').getTime()
        },
        activity: UserActivity.RUNNING,
        audioAnomalyDetected: true
    });
}

runScenario();
