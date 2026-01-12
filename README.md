# Guardian Angel - Women's Safety Shield

**Women's Safety Mobile Application (Phase 1)**

A comprehensive women's safety mobile application built with React Native and NestJS, focused on providing emergency assistance, location tracking, and safety awareness features.

## 📱 Features

### 🔐 Authentication & Onboarding
- **Phone/Email OTP Login**: Secure authentication with one-time passwords
- **Emergency Contacts Setup**: Mandatory setup of 1-5 emergency contacts
- **Consent-Based Permissions**: Clear explanations and one-by-one permission requests
- **Secure Data Storage**: Encrypted local storage for sensitive information

### 🆘 Emergency SOS System
- **One-Tap Activation**: Instant emergency alert with single tap
- **Offline-First Design**: Works with low or intermittent connectivity
- **Multi-Channel Alerts**: Auto-call, SMS location sharing, push notifications
- **Background Services**: Continuous monitoring even when app is closed
- **Location Tracking**: Real-time GPS updates during active SOS

### 🧠 Risk Awareness (Non-AI)
- **Rule-Based Assessment**: Static analysis of time, location, and movement
- **Calm Messaging**: Supportive alerts without fear-based language
- **Contextual Warnings**: Time-of-day and location-based safety tips
- **No Predictions**: Informational only, no AI-based risk scoring

### 🎙️ Voice Trigger
- **Custom Wake Phrase**: "Help me now" activation (configurable)
- **Background Listening**: Works when screen is locked or app in background
- **Privacy-First**: No continuous recording, local processing only
- **Toggle Control**: User can enable/disable the feature

### 📱 Fake Call & Escape Tools
- **Simulated Incoming Calls**: Custom caller name and delay timer
- **Emergency Timer**: Countdown that triggers SOS if not cancelled
- **Social Escape**: Discreet ways to exit uncomfortable situations

### 📜 Incident Logging
- **Optional Recording**: Text notes, voice memos, location tags
- **User Control**: Full control over data retention and deletion
- **Timestamp & Location**: Automatic context for each incident
- **Privacy Respected**: Never mandatory, always user-controlled

## 🛠️ Tech Stack

### Frontend (React Native)
- **React Native 0.73+** with TypeScript
- **Navigation**: React Navigation 6 (Stack + Tab)
- **State Management**: Context API with useReducer
- **Storage**: AsyncStorage + Encrypted Storage
- **Maps**: Google Maps SDK
- **Permissions**: React Native Permissions
- **Notifications**: Firebase Cloud Messaging
- **Voice**: React Native Voice
- **Location**: React Native Geolocation Service

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with refresh tokens
- **Rate Limiting**: Built-in throttling
- **Security**: Helmet, CORS, validation pipes
- **SMS**: Twilio integration
- **Email**: Nodemailer support

## 🎨 Design Principles

### Women-Centric UI/UX
- **Soft Color Palette**: Lavender, soft pink, coral, teal accents
- **One-Hand Usability**: Large touch targets (44x44px minimum)
- **Calm Aesthetics**: No aggressive reds or fear-inducing themes
- **Clear Visual Hierarchy**: Intuitive navigation and information architecture
- **Supportive Tone**: Empowering language, never judgmental

### Accessibility
- **Large Touch Targets**: Minimum 44x44px for all interactive elements
- **High Contrast**: Clear text visibility in all lighting conditions
- **Simple Navigation**: Consistent tab and stack navigation
- **Emergency Priority**: SOS button always accessible within 1 tap

## 🔒 Security & Privacy

### Data Protection
- **End-to-End Encryption**: Sensitive data encrypted at rest and in transit
- **Minimal Data Collection**: Only essential information collected
- **User Consent**: Clear explanations for all permissions and data use
- **Local Processing**: Voice triggers processed locally, not stored
- **Secure Storage**: Encrypted storage for tokens and personal data

### Privacy Controls
- **Granular Permissions**: Users control each feature independently
- **Data Deletion**: Complete data removal on request
- **No Background Tracking**: Location only tracked during SOS or with consent
- **Transparent Policies**: Clear privacy policy and terms of service

## 📁 Project Structure

```
Guardian Angel/
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, SOS, Permissions)
│   │   ├── screens/       # App screens
│   │   │   ├── auth/      # Login, register, OTP
│   │   │   ├── main/      # Home, SOS, Contacts, etc.
│   │   │   ├── onboarding/ # Permission setup
│   │   │   └── utility/   # Fake call, timer
│   │   ├── services/      # API and native services
│   │   ├── navigation/    # Navigation configuration
│   │   ├── utils/         # Helper functions
│   │   ├── types/         # TypeScript definitions
│   │   └── constants/     # App constants and themes
│   └── package.json
├── backend/               # NestJS API
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   │   ├── auth/      # Authentication
│   │   │   ├── users/      # User management
│   │   │   ├── sos/        # SOS sessions
│   │   │   └── incidents/  # Incident logs
│   │   ├── config/        # Database and app config
│   │   ├── schema/        # Database schema
│   │   └── common/        # Shared utilities
│   ├── package.json
│   └── drizzle.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- React Native development environment
- PostgreSQL database
- Twilio account (for SMS)
- Firebase project (for notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Guardian Angel
   ```

2. **Install mobile dependencies**
   ```bash
   cd mobile
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit .env with your configuration
   ```

5. **Set up database**
   ```bash
   cd backend
   npm run db:migrate
   ```

### Running the Application

1. **Start the backend**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start the mobile app**
   ```bash
   cd mobile
   npm start
   # Then run on simulator/device:
   npm run android  # or npm run ios
   ```

## 🔧 Configuration

### Environment Variables (Backend)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT tokens
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_PHONE_NUMBER`: Twilio phone number

### Mobile Configuration
- Update `API_ENDPOINTS` in `mobile/src/constants/index.ts`
- Configure Google Maps API key
- Set up Firebase for push notifications

## 📋 Development Status

### ✅ Completed
- [x] Project structure setup
- [x] Database schema design
- [x] Authentication system foundation
- [x] Basic UI components
- [x] SOS system architecture
- [x] Permission management
- [x] Navigation structure

### 🚧 In Progress
- [ ] Complete authentication flow
- [ ] Implement SOS functionality
- [ ] Add voice trigger
- [ ] Build emergency contacts management
- [ ] Create onboarding flow

### 📋 Planned
- [ ] Risk awareness system
- [ ] Fake call feature
- [ ] Emergency timer
- [ ] Incident logging
- [ ] Advanced security features
- [ ] Performance optimization
- [ ] Testing and QA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Emergency Disclaimer

This application is designed to assist in emergency situations but should not be relied upon as the sole means of protection. Always prioritize personal safety, stay aware of your surroundings, and contact local emergency services when in immediate danger.

---

**Built with ❤️ for women's safety and empowerment**
