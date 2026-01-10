# PPDU - Personal Protect & Defense Unit

**Developed for the PDPU Hackathon 2026**

## 🛡️ Project Overview

PPDU is an advanced AI-driven personal safety agent designed to monitor user context, assess risks in real-time, and take autonomous ethical actions to ensure user safety.

## 🚀 Key Features

- **Context Awareness**: Real-time monitoring of location, activity (walking, running, in vehicle), and battery status.
- **Intelligent Risk Engine**: dynamic risk scoring based on environmental factors and user anomalies.
- **Autonomous Decision Making**: Determines the best course of action (e.g., Ping User, Share Location, Alert Authorities).
- **Ethics Guard**: Ensures all autonomous actions are ethical, consensual, and proportional to the threat.

## 🏗️ Architecture

The system is built with a modular architecture:

- **ContextObserver**: Gathers raw sensor data.
- **RiskEngine**: Processes data into a safety score.
- **DecisionEngine**: Maps safety scores to concrete actions.
- **EthicsGuard**: Validates actions against safety protocols.
- **ActionExecutor**: Performs the validated actions.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- TypeScript

### Installation

```bash
cd backend
npm install
```

### Running the Agent

To see the agent in action with a simulated scenario:

```bash
npx ts-node src/verification.ts
```

## 👥 Team

- **Dhruvil**
