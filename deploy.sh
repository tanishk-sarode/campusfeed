#!/bin/bash

# NIT Rourkela Campus Feed - Deployment Script
echo "🚀 Deploying NIT Rourkela Campus Feed..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if Vercel CLI is installed
    if command -v vercel &> /dev/null; then
        echo "🚀 Deploying to Vercel..."
        vercel --prod
    else
        echo "📋 Deployment options:"
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Deploy to Vercel: vercel --prod"
        echo "3. Deploy to Netlify: netlify deploy --prod"
        echo "4. Deploy to Railway: railway up"
        echo ""
        echo "🌐 Or run locally: npm start"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
