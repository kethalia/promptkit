# Bootstrap Project Documentation

Create comprehensive pre-development project documentation through an interactive question-based workflow, generating README, architecture docs, and component-specific documentation.

---

## Context

This prompt should be used at project inception, before significant code is written. The goal is to document the project vision, architecture, and specifications to guide development.

## Instructions

### Phase 1: Discovery Through Questions

Ask questions progressively from general to specific. Continue asking until you have enough information to create complete documentation. Provide multiple-choice options when possible to guide the user.

#### Round 1: Project Foundation (Required)

1. **Project Type & Purpose**
   - What type of project is this?
     - [ ] Web Application (Full-stack)
     - [ ] API/Backend Service
     - [ ] Frontend Application Only
     - [ ] Mobile Application
     - [ ] CLI Tool
     - [ ] Library/Package
     - [ ] Blockchain/Web3 Application
     - [ ] Desktop Application
     - [ ] Other: ___
   - What problem does this project solve? (1-2 sentences)

2. **Technology Stack**
   - Which components will this project have?
     - [ ] Backend API
     - [ ] Frontend Web UI
     - [ ] Smart Contracts
     - [ ] CLI Tool
     - [ ] Mobile App
     - [ ] Other: ___

3. **Primary Language/Framework**
   - Backend:
     - [ ] Node.js (Express/Fastify/NestJS)
     - [ ] Python (Django/FastAPI/Flask)
     - [ ] Go
     - [ ] Rust
     - [ ] Java/Kotlin (Spring)
     - [ ] Ruby (Rails)
     - [ ] Other: ___
   - Frontend:
     - [ ] React
     - [ ] Next.js
     - [ ] Vue.js
     - [ ] Svelte
     - [ ] Angular
     - [ ] Vanilla JS
     - [ ] Other: ___

4. **Target Audience**
   - Who will use this project?
     - [ ] Developers (B2D)
     - [ ] End Users (B2C)
     - [ ] Businesses (B2B)
     - [ ] Internal Team
     - [ ] Open Source Community
     - [ ] Other: ___

5. **Project Scale**
   - Expected scale:
     - [ ] Personal/Learning Project
     - [ ] Small Team (2-5 developers)
     - [ ] Medium Team (5-20 developers)
     - [ ] Large Team (20+ developers)
     - [ ] Open Source (public contributors)

#### Round 2: Architecture & Infrastructure (If Applicable)

6. **Database & Storage**
   - What data storage will you use?
     - [ ] PostgreSQL
     - [ ] MySQL
     - [ ] MongoDB
     - [ ] Redis
     - [ ] SQLite
     - [ ] Supabase
     - [ ] Firebase
     - [ ] None
     - [ ] Other: ___

7. **Authentication & Authorization**
   - How will users authenticate?
     - [ ] JWT tokens
     - [ ] OAuth 2.0 (Google, GitHub, etc.)
     - [ ] Session-based
     - [ ] API keys
     - [ ] Wallet signatures (Web3)
     - [ ] No authentication needed
     - [ ] Other: ___

8. **Hosting & Deployment**
   - Where will this be deployed?
     - [ ] Vercel
     - [ ] AWS (EC2, ECS, Lambda)
     - [ ] Google Cloud
     - [ ] Azure
     - [ ] Heroku
     - [ ] DigitalOcean
     - [ ] Docker/Kubernetes (self-hosted)
     - [ ] Not decided yet
     - [ ] Other: ___

9. **External Services/APIs**
   - Will you integrate with external services?
     - [ ] Payment processing (Stripe, PayPal)
     - [ ] Email service (SendGrid, Mailgun)
     - [ ] Cloud storage (S3, Cloudinary)
     - [ ] Analytics (Google Analytics, Mixpanel)
     - [ ] Monitoring (Sentry, DataDog)
     - [ ] None
     - [ ] Other: ___

#### Round 3: Backend Specifics (If Backend Component)

10. **API Design**
    - What API style?
      - [ ] REST
      - [ ] GraphQL
      - [ ] gRPC
      - [ ] WebSocket
      - [ ] tRPC
      - [ ] Other: ___

11. **Backend Features**
    - What key features will the backend provide? (Select all that apply)
      - [ ] User authentication & management
      - [ ] CRUD operations for resources
      - [ ] File upload/download
      - [ ] Real-time updates (WebSocket)
      - [ ] Background job processing
      - [ ] Email notifications
      - [ ] Search functionality
      - [ ] Admin dashboard
      - [ ] Analytics/reporting
      - [ ] Other: ___

12. **Background Jobs/Queues**
    - Will you need background processing?
      - [ ] Yes - Bull/BullMQ (Redis)
      - [ ] Yes - Celery (Python)
      - [ ] Yes - Sidekiq (Ruby)
      - [ ] Yes - AWS SQS
      - [ ] No
      - [ ] Other: ___

#### Round 4: Frontend Specifics (If Frontend Component)

13. **UI Framework/Library**
    - UI component library:
      - [ ] Material-UI
      - [ ] Ant Design
      - [ ] Chakra UI
      - [ ] Tailwind CSS
      - [ ] Bootstrap
      - [ ] shadcn/ui
      - [ ] Custom CSS
      - [ ] None
      - [ ] Other: ___

14. **State Management**
    - How will you manage state?
      - [ ] React Context
      - [ ] Redux
      - [ ] Zustand
      - [ ] Jotai
      - [ ] Recoil
      - [ ] MobX
      - [ ] None (component state only)
      - [ ] Other: ___

15. **Frontend Features**
    - What key UI features? (Select all that apply)
      - [ ] User dashboard
      - [ ] Forms & validation
      - [ ] Data tables/lists
      - [ ] Charts & visualizations
      - [ ] File upload with preview
      - [ ] Real-time updates
      - [ ] Dark mode
      - [ ] Responsive design
      - [ ] Internationalization (i18n)
      - [ ] Other: ___

#### Round 5: Smart Contracts (If Web3 Component)

16. **Blockchain Platform**
    - Which blockchain?
      - [ ] Ethereum
      - [ ] Polygon
      - [ ] Binance Smart Chain
      - [ ] Avalanche
      - [ ] Solana
      - [ ] Arbitrum
      - [ ] Optimism
      - [ ] Base
      - [ ] Other: ___

17. **Smart Contract Framework**
    - Development framework:
      - [ ] Hardhat
      - [ ] Foundry
      - [ ] Truffle
      - [ ] Anchor (Solana)
      - [ ] Other: ___

18. **Contract Features**
    - What will contracts handle? (Select all that apply)
      - [ ] Token (ERC-20/SPL)
      - [ ] NFT (ERC-721/ERC-1155)
      - [ ] DeFi protocols (staking, lending)
      - [ ] DAO governance
      - [ ] Marketplace
      - [ ] Multi-sig wallet
      - [ ] Other: ___

#### Round 6: CLI Tool (If CLI Component)

19. **CLI Purpose**
    - What will the CLI do?
      - [ ] Project scaffolding
      - [ ] Build/deployment tool
      - [ ] Data migration
      - [ ] Code generation
      - [ ] System administration
      - [ ] Testing/debugging tool
      - [ ] Other: ___

20. **CLI Framework**
    - What framework will you use?
      - [ ] Commander.js (Node.js)
      - [ ] Click (Python)
      - [ ] Cobra (Go)
      - [ ] Clap (Rust)
      - [ ] Native (no framework)
      - [ ] Other: ___

#### Round 7: Development Workflow

21. **Testing Strategy**
    - What testing will you implement?
      - [ ] Unit tests
      - [ ] Integration tests
      - [ ] End-to-end tests
      - [ ] Smart contract tests
      - [ ] No tests initially
      - [ ] Other: ___

22. **CI/CD**
    - Continuous integration/deployment?
      - [ ] GitHub Actions
      - [ ] GitLab CI
      - [ ] CircleCI
      - [ ] Jenkins
      - [ ] Not needed yet
      - [ ] Other: ___

23. **Code Quality Tools**
    - What tools will enforce quality? (Select all that apply)
      - [ ] ESLint/TSLint
      - [ ] Prettier
      - [ ] Husky (git hooks)
      - [ ] SonarQube
      - [ ] TypeScript strict mode
      - [ ] None
      - [ ] Other: ___

#### Round 8: Environment & Configuration

24. **Environment Variables**
    - What configuration will you need? (Will generate .env.example)
      - Database credentials?
      - API keys (which services)?
      - JWT secret?
      - AWS/Cloud credentials?
      - Blockchain RPC URLs?
      - Other environment variables?

25. **Required Services**
    - What must be running locally for development?
      - [ ] Database (specify which)
      - [ ] Redis
      - [ ] Message queue
      - [ ] Local blockchain node
      - [ ] Mock APIs
      - [ ] None
      - [ ] Other: ___

### Phase 2: Generate Documentation

After gathering information, generate the following documentation files:

#### 1. README.md
- Project name and tagline
- Overview and key features
- Technology stack summary
- Quick start guide
- Project structure overview
- Links to detailed docs
- Contributing guidelines
- License

#### 2. docs/ARCHITECTURE.md
- System architecture diagram (ASCII/Mermaid)
- Component overview
- Data flow diagrams
- Design decisions and rationale
- Scalability considerations
- Security architecture
- Technology choices explanation

#### 3. docs/BACKEND.md (if applicable)
- Backend architecture
- API endpoints overview
- Database schema
- Authentication flow
- Middleware and services
- Error handling strategy
- Environment variables
- Local development setup
- Testing strategy

#### 4. docs/FRONTEND.md (if applicable)
- Frontend architecture
- Component structure
- State management approach
- Routing structure
- API integration
- Styling approach
- Build and deployment
- Local development setup

#### 5. docs/SMART_CONTRACTS.md (if applicable)
- Contract architecture
- Contract interactions
- Deployment process
- Testing strategy
- Security considerations
- Upgrade strategy
- Network configurations
- Gas optimization notes

#### 6. docs/CLI.md (if applicable)
- CLI architecture
- Available commands
- Configuration files
- Plugin system (if any)
- Development workflow
- Distribution strategy

#### 7. docs/DATABASE.md (if database used)
- Schema design
- Relationships
- Indexing strategy
- Migration approach
- Backup strategy
- Seed data

#### 8. docs/API.md (if API component)
- API design principles
- Endpoint structure
- Authentication/authorization
- Request/response formats
- Error codes
- Rate limiting
- Versioning strategy

#### 9. docs/DEPLOYMENT.md
- Deployment environments (dev/staging/prod)
- Infrastructure requirements
- Environment variables per environment
- Deployment steps
- Rollback procedure
- Monitoring and logging

#### 10. docs/DEVELOPMENT.md
- Development workflow
- Branch strategy
- Commit conventions
- Code review process
- Testing requirements
- Release process

#### 11. .env.example
- All required environment variables
- Example values (non-sensitive)
- Comments explaining each variable
- Sections by service/component

#### 12. Additional docs based on project type
- docs/SECURITY.md (security practices)
- docs/PERFORMANCE.md (optimization strategies)
- docs/TESTING.md (testing approach)
- docs/CONTRIBUTING.md (contribution guidelines)

### Phase 3: Validation

After generating documentation:
1. Present a summary of all files created
2. Ask if user wants to modify any section
3. Offer to add missing documentation
4. Confirm ready to proceed with development

## Output Format

```
# Documentation Generation Summary

## Questions Completed: X/~15-25

## Files to be Created:

### Core Documentation
- [x] README.md
- [x] docs/ARCHITECTURE.md
- [x] .env.example

### Component Documentation
- [x] docs/BACKEND.md
- [x] docs/FRONTEND.md
- [ ] docs/SMART_CONTRACTS.md (not applicable)
- [ ] docs/CLI.md (not applicable)

### Additional Documentation
- [x] docs/DATABASE.md
- [x] docs/API.md
- [x] docs/DEPLOYMENT.md
- [x] docs/DEVELOPMENT.md

---

## Project Summary

**Name**: [Project Name]
**Type**: [Full-stack Web3 Application]
**Stack**: 
- Backend: Node.js + Express + TypeScript
- Frontend: Next.js + React + Tailwind CSS
- Smart Contracts: Solidity + Hardhat
- Database: PostgreSQL
- Deployment: Vercel (frontend), AWS (backend)

**Key Features**:
- User authentication with wallet connect
- NFT minting and marketplace
- Real-time notifications
- Admin dashboard

---

Ready to generate documentation? (yes/no)
If yes, I will create all files in the project directory.
```

## Interactive Flow Example

```
Assistant: Let's bootstrap your project documentation! I'll ask you a series of questions to understand your project.

**Question 1/~15: Project Type & Purpose**

What type of project is this?
a) Web Application (Full-stack)
b) API/Backend Service
c) Frontend Application Only
d) Mobile Application
e) CLI Tool
f) Library/Package
g) Blockchain/Web3 Application
h) Other

User: g