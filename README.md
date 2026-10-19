# Fintech Dashboard React

A modern fintech dashboard built with React that brings stock market data, market trends, and portfolio information into one interface. This project demonstrates component-based development, API integration, asynchronous JavaScript, and responsive dashboard design.

## Overview

The Fintech Dashboard provides a centralized view of market information through a dark-themed interface with gold accents. It combines market index data, stock information, cryptocurrency search results, and portfolio summaries into an interactive dashboard.

The application uses React for the frontend and an Express backend to retrieve market data from API services.

## Features

### Market Overview
- Displays the S&P 500, NASDAQ Composite, Dow Jones Industrial Average, and VIX.
- Retrieves market information through backend API endpoints.
- Displays current index values and percentage changes.

### Market Snapshot
- Displays stock market information in organized cards.
- Supports displaying search results for stocks.
- Provides visual indicators for positive and negative price movements.

### Interactive Watchlist
- Retrieves watchlist stocks from the backend.
- Displays ticker symbols, company names, prices, and percentage changes.
- Fetches company logos and displays them alongside stock information.

### S&P 500 Chart
- Displays historical S&P 500 market data.
- Supports multiple time ranges, including 1 day, 1 week, 1 month, 3 months, and 1 year.
- Includes formatted chart tooltips for easier data interpretation.

### Market Movers
- Retrieves market mover information from the backend.
- Allows switching between top gainers and top losers.
- Displays stock prices and percentage changes with color-coded indicators.

### Cryptocurrency Overview
- Displays cryptocurrency search results.
- Organizes cryptocurrency information within the dashboard.

### Portfolio Summary
- Presents sample portfolio information.
- Uses clearly labeled demonstration data rather than representing a connected brokerage account.

### User Interface
- Dark-themed interface with gold accents.
- Sidebar navigation.
- Interactive hero buttons with smooth scrolling.
- Hover effects and organized dashboard cards.
- Responsive grid layouts for dashboard components.

## Technologies Used

- React
- JavaScript (ES6+)
- Vite
- CSS3
- Node.js
- Express
- REST APIs
- Fetch API
- Async/await
- Recharts

## Getting Started

### Prerequisites

- Node.js and npm
- Git
- A terminal or code editor such as Visual Studio Code

### 1. Clone the repository

```bash
git clone https://github.com/heintzmason2-sys/fintech-dashboard-react.git
