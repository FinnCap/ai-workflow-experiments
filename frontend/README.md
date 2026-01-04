# Frontend

React-based web interface for managing AI agents and building visual workflows.

## Project Structure

```
app/
├── components/        # Reusable UI components (buttons, inputs, dropdowns)
├── layouts/           # Layout components (app layout with sidebar)
├── pages/
│   ├── Agent/         # Agent definition management
│   ├── Api/           # API tool definition and configuration
│   ├── Chat/          # Chat interface with message components
│   ├── Flow/          # Flow editor, testing, and node components
│   └── Log/           # Execution logs and monitoring
├── utils/             # Utility functions
└── routes.ts          # Application routing configuration
```

## Setup

### Prerequisites
- Backend running at http://localhost:7777

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

To override the default backend URL, create a `.env` file:
```env
VITE_API_URL=http://localhost:7777
```

## Development

The application follows a page-based architecture. Each feature area (Agent, Api, Chat, Flow, Log) has its own directory with:
- `common/` - Service classes, types, and utilities
- `components/` - UI components specific to the feature
- `hooks/` - Custom React hooks
- `index.tsx` - Main page component

### Adding New AI Model Providers
Update `MODEL_PROVIDERS` in `app/Agent/Edit/hooks/useAgentEdit.ts` to match the backend configuration.

### Adding New Flow Node Types
1. Implement the UI in `app/Flow/components/nodes`
2. Add to `app/Flow/common/nodeTypes`
3. Update `NodePropertiesPanel` in `app/Flow/components` for node properties
4. Add to sidebar in `app/Flow/Edit/components` `nodeTypes`