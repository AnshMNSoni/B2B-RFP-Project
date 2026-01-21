# RFP Agent AI

## Overview

RFP Agent AI is an AI-powered B2B enterprise application for automated Request for Proposal (RFP) processing and quote generation, specifically designed for the wires and cables manufacturing industry. The system uses a multi-agent architecture powered by **Google Gemini AI** to intelligently extract requirements from RFP documents, match specifications to a product catalog, and generate pricing estimates.

The application follows a three-agent workflow with AI-enhanced intelligence:
1. **Sales Agent** - Uses natural language understanding to extract and summarize RFP requirements (voltage, material, insulation, compliance standards)
2. **Technical Agent** - Intelligently matches RFP specifications to the SKU catalog with match percentages and provides reasoning for each match
3. **Pricing Agent** - Generates detailed cost estimates with smart quantity recommendations, including material, service, and testing costs, plus strategic pricing analysis

## Key Features

- 🤖 **AI-Powered Processing** - Leverages Google Gemini Pro for intelligent document understanding
- 📊 **Smart SKU Matching** - AI evaluates technical compatibility beyond simple keyword matching
- 💰 **Intelligent Pricing** - Context-aware quantity recommendations and pricing strategies
- 🔄 **Fallback Logic** - Graceful degradation to rule-based processing if AI is unavailable
- ⚡ **Fast Processing** - Typical RFP processing in 10-15 seconds
- 🎯 **High Accuracy** - AI reasoning provides transparency in matching and pricing decisions

## AI Integration

### LLM Provider
- **Model**: Google Gemini Pro (`gemini-pro`)
- **API**: Google Generative AI API (v1beta)
- **Cost**: Free tier (60 requests/min, 1,500 requests/day)
- **Capacity**: Process ~500 RFPs per day within free limits

### AI Agent Architecture

Each agent uses Gemini AI to process information intelligently:

#### Sales Agent (AI-Powered)
- Extracts structured data from unstructured RFP text
- Understands various date formats and terminology
- Identifies technical specifications even with non-standard phrasing
- Robust compliance standard detection
- Falls back to regex-based parsing if AI fails

#### Technical Agent (AI-Powered)
- Evaluates SKU compatibility using intelligent reasoning
- Considers voltage range compatibility and technical equivalence
- Provides detailed reasoning for each SKU match
- Calculates weighted match percentages (Voltage: 40%, Material: 30%, Insulation: 30%)
- Falls back to rule-based matching if AI fails

#### Pricing Agent (AI-Powered)
- Recommends optimal quantities based on project scope
- Analyzes voltage ratings to determine appropriate quantities
- Provides reasoning for quantity recommendations
- Generates strategic pricing analysis and recommendations
- Falls back to standard pricing formulas if AI fails

### Environment Configuration

Required environment variable:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your free API key at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Error Handling

The system implements comprehensive error handling:
- API timeout handling (30 seconds per agent)
- Automatic fallback to rule-based logic
- Graceful degradation without service disruption
- Detailed error logging for debugging

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Design System**: Carbon Design System (IBM) approach - optimized for enterprise data-heavy applications
- **Typography**: IBM Plex Sans and IBM Plex Mono fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Agent System**: Three AI-powered specialized agents (Sales, Technical, Pricing) with fallback logic
- **LLM Integration**: Google Gemini Pro API via fetch
- **Data Storage**: In-memory storage with SKU catalog defined in shared schema

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/   # UI components and examples
│       ├── pages/        # Route pages (home, not-found)
│       ├── hooks/        # Custom React hooks
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── agents/       # AI-powered Sales, Technical, and Pricing agents
│   │   ├── salesAgent.ts      # Gemini-powered RFP extraction
│   │   ├── technicalAgent.ts  # Gemini-powered SKU matching
│   │   └── pricingAgent.ts    # Gemini-powered pricing analysis
│   ├── routes.ts     # API route definitions
│   └── storage.ts    # Data storage interface
├── shared/           # Shared types and schemas (Zod validation)
└── migrations/       # Database migrations (Drizzle)
```

### Data Flow
1. User inputs RFP text via the frontend
2. Frontend calls `/api/process-rfp` endpoint
3. Backend orchestrates the three AI agents sequentially:
   - Sales Agent → Gemini API → RFP Summary
   - Technical Agent → Gemini API → SKU Matches with reasoning
   - Pricing Agent → Gemini API → Cost estimates with analysis
4. Results (summary, SKU matches, pricing, AI reasoning) returned to frontend
5. Frontend displays results in cards, tables, and status indicators

### Validation
- Zod schemas for request/response validation
- Shared schema definitions between frontend and backend
- Type-safe API contracts
- AI response validation with fallback handling

## External Dependencies

### AI & LLM
- **Google Gemini Pro**: Natural language understanding and intelligent processing
- **Generative AI API**: v1beta endpoint for content generation
- **Rate Limits**: 60 requests/min, 1,500 requests/day (free tier)

### Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Stored in `migrations/` directory
- **Note**: Currently uses in-memory storage for SKU catalog; database integration available via Drizzle

### UI Libraries
- **Radix UI**: Full suite of accessible primitive components
- **shadcn/ui**: Pre-styled component library
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel functionality
- **cmdk**: Command palette component

### Build & Development
- **Vite**: Frontend bundling with React plugin
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **drizzle-zod**: Zod integration with Drizzle schemas

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and paste into your `.env` file

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
npm start
```

## Deployment

### Render Configuration
1. Set environment variable `GEMINI_API_KEY` in Render dashboard
2. Configure timeout settings:
   - Health Check Timeout: 300 seconds
   - Health Check Interval: 60 seconds
3. Deploy and verify via logs

### Other Platforms
- **Vercel**: Add `GEMINI_API_KEY` to environment variables
- **Railway**: Configure environment variables in project settings
- **AWS/GCP**: Set environment variables in deployment configuration

## API Endpoints

### Process RFP
```
POST /api/process-rfp
Content-Type: application/json

{
  "rfpText": "RFP Title: Supply of Industrial Power Cables..."
}

Response:
{
  "success": true,
  "summary": {
    "title": "Supply of Industrial Power Cables",
    "voltage": "11kV",
    "material": "Copper",
    "insulation": "XLPE",
    ...
  },
  "matches": [
    {
      "sku": "CAB-11KV-CU-XLPE",
      "matchPercentage": 100,
      "reasoning": "Perfect match for voltage, material, and insulation requirements",
      ...
    }
  ],
  "pricing": {
    "items": [...],
    "grandTotal": 213220,
    "analysis": "Recommended quantity optimized for 11kV industrial project scope..."
  }
}
```

### Test Gemini Connection
```
GET /api/test-gemini

Response:
{
  "success": true,
  "apiKeyExists": true,
  "response": {...}
}
```

### Health Check
```
GET /api/health

Response:
{
  "status": "healthy"
}
```

## Performance

- **Average Processing Time**: 10-15 seconds per RFP
- **Agent Breakdown**:
  - Sales Agent: ~3-5 seconds
  - Technical Agent: ~3-5 seconds
  - Pricing Agent: ~3-5 seconds
- **Free Tier Capacity**: ~500 RFPs per day
- **Fallback Performance**: <1 second (rule-based processing)

## Future Enhancements

- [ ] Multi-document processing (PDFs, Word docs)
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Custom SKU catalog management
- [ ] Email integration for automatic RFP ingestion
- [ ] Multi-language support
- [ ] Historical RFP analysis and insights
- [ ] Integration with ERP systems

## Troubleshooting

### Common Issues

**502 Gateway Error**
- Check timeout configuration on hosting platform
- Verify `GEMINI_API_KEY` is set correctly
- Check Render/platform logs for specific errors

**"No response from Gemini API"**
- Verify API key is valid at [Google AI Studio](https://makersuite.google.com/)
- Check if free tier quota is exceeded
- System will fall back to rule-based processing

**Agents returning fallback results**
- Check deployment logs for Gemini API errors
- Verify internet connectivity from server
- Confirm API key has proper permissions

## Connect with Me

If you found this project helpful or have any suggestions, feel free to connect:

- [![LinkedIn](https://img.shields.io/badge/LinkedIn-anshmnsoni-0077B5.svg?logo=linkedin)](https://www.linkedin.com/in/anshmnsoni)  
- [![GitHub](https://img.shields.io/badge/GitHub-AnshMNSoni-181717.svg?logo=github)](https://github.com/AnshMNSoni)
- [![Reddit](https://img.shields.io/badge/Reddit-u/AnshMNSoni-FF4500.svg?logo=reddit)](https://www.reddit.com/user/AnshMNSoni)

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- **Google Gemini Pro** for AI-powered intelligent processing
- **shadcn/ui** for beautiful, accessible UI components
- **Radix UI** for primitives and accessibility
- **IBM Carbon Design System** for enterprise design patterns

---

## Thank You
