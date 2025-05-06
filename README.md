# Stock Index Visualization

A Next.js application for visualizing and analyzing stock market indices.

## Local Setup

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/stock-index-visualization.git
cd stock-index-visualization
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add any required environment variables. (This project may not require any if data is fetched from local sources.)

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

- `/components` - React components
  - `/ui` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions
- `/public` - Static assets
- `/types` - TypeScript type definitions
