# 🍕 FoodHub - Premium Meal Ordering Platform

<div align="center">
  <img src="public/shop.jpeg" alt="FoodHub Banner" width="800" />
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

## 📋 Overview

FoodHub is a comprehensive meal ordering platform connecting customers with local restaurants and food providers.

## 🌟 Key Features

### 🛍️ Customer Experience
- Browse meals with advanced filtering
- Interactive shopping cart
- Secure checkout with Stripe
- Order tracking and history
- Mobile responsive design

### 👨‍🍳 Provider Management
- Dashboard with analytics
- Menu management system
- Order fulfillment workflow
- Revenue tracking

### 🛠️ Administrative Tools
- Multi-role user management
- Category management
- Order oversight
- System analytics

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Shadcn/ui components
- **State**: React Context API
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Zod schemas
- **API**: RESTful design

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Quick Start
```bash
# Clone repository
git clone https://github.com/arabyhossainabid/foodhub.git
cd foodhub

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your config

# Run migrations
npx prisma migrate dev

# Start development
npm run dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/foodhub"
NEXTAUTH_SECRET="your-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```

## 🏗️ Project Structure

```
foodhub/
├── src/
│   ├── app/                 # Next.js pages
│   ├── components/          # UI components
│   ├── context/             # React providers
│   ├── lib/                # Utilities
│   ├── services/           # API services
│   └── types/             # TypeScript types
├── public/                # Static assets
└── prisma/               # Database schema
```

## 🎯 Core Features

### 🔐 Authentication
- Multi-role system (Customer, Provider, Admin, Manager, Organizer)
- JWT token-based auth
- Protected routes
- Session management

### 🛒 Shopping Cart
- Real-time updates
- Persistent sessions
- Quantity management
- Price calculations

### 💳 Payments
- Stripe integration
- Multiple payment methods
- Secure webhooks
- Order tracking

### 📊 Dashboard
- Real-time analytics
- Sales metrics
- Customer insights
- Revenue tracking

## 🎨 Design System

### Colors
- **Primary**: Orange (#FB923C)
- **Secondary**: Gray (#1F2937)
- **Accent**: White (#FFFFFF)
- **Success**: Green (#10B981)

### Components
- Tailwind CSS based
- Mobile-first responsive
- Accessibility compliant
- Smooth animations

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large**: > 1280px

## 🚀 Deployment

### Production
```bash
npm run build
npm start
```

### Environment
- **Node**: 18+
- **Database**: PostgreSQL 14+
- **Hosting**: Vercel compatible

## 📈 Performance

- **Page Load**: < 2 seconds
- **Lighthouse**: 95+ score
- **Mobile**: 100% responsive
- **SEO**: 90+ optimized

## 🎯 Future Plans

- [ ] Real-time order tracking
- [ ] AI recommendations
- [ ] Mobile apps
- [ ] Multi-language support
- [ ] Subscription plans

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

<div align="center">
  <strong>🍕 Built with passion for food lovers 🍕</strong>
  
  Made with ❤️ by [Araby Hossain Abid](https://github.com/arabyhossainabid)
  
  [⭐ Star this repo](https://github.com/arabyhossainabid/foodhub) if it helped you!
</div>
