# Beny.one - Personal Terminal Website

A modern terminal-inspired personal website built with Next.js 15 and TailwindCSS. Features an interactive terminal interface, assets management system, and comprehensive authentication.

## 📸 Preview

![Preview 1](./public/preview-1.png)
![Preview 2](./public/preview-2.png)
![Preview 3](./public/preview-3.png)
![Preview 4](./public/preview-4.png)
![Preview 5](./public/preview-5.png)

## ✨ Features

- **Interactive Terminal Interface** - Command-line experience with multiple commands and games
- **Assets Management System** - Upload, manage, and share files with secure authentication
- **Traditional Authentication** - Username/password login using environment variables
- **Modern Tech Stack** - Next.js 15, TypeScript, TailwindCSS, and Supabase
- **Responsive Design** - Optimized for all devices and screen sizes
- **SEO Optimized** - Meta tags, sitemap, and OpenGraph support
- **Analytics Integration** - Umami analytics for privacy-focused tracking
- **Code Quality** - ESLint, Prettier, and TypeScript for maintainable code

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org) - React framework with App Router
- [TypeScript](https://typescriptlang.org) - Type-safe JavaScript
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [Supabase](https://supabase.com) - File storage and database
- [JWT](https://jwt.io) - JSON Web Tokens for secure authentication
- [ESLint](https://eslint.org) - Code linting and quality assurance
- [Prettier](https://prettier.io) - Code formatting
- [Umami Analytics](https://umami.is) - Privacy-focused analytics
- [MDX](https://mdxjs.com) - Markdown for the component era

## 📝 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes (auth, files, etc.)
│   ├── assets/            # Protected assets management
│   ├── login/             # Authentication page
│   └── terminal/          # Main terminal interface
├── components/            # Reusable UI components
│   ├── terminal/          # Terminal-specific components
│   └── magicui/           # UI component library
├── lib/                   # Utility functions and constants
│   ├── auth.ts           # Authentication logic
│   ├── terminal-commands.tsx # Terminal command definitions
│   └── types.ts          # TypeScript type definitions
└── contents/             # MDX content files
```

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/BenyD/beny-terminal.git
   cd beny-terminal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run migrations: `npm run migrate`
   - Configure storage bucket for file uploads

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔐 Authentication

The application uses a simple username/password authentication system:

- **Username**: Set via `ADMIN_USERNAME` environment variable
- **Password**: Set via `ADMIN_PASSWORD` environment variable
- **JWT Secret**: Set via `JWT_SECRET` environment variable (minimum 32 characters)

### Environment Variables

```bash
# Authentication
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional Services
UMAMI_SHARE_TOKEN=your_umami_token
SPOTIFY_CLIENT_ID=your_spotify_client_id
OPENWEATHER_API_KEY=your_openweather_api_key
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
npm run check-all    # Run all checks (lint, format, type-check)
```

### Code Quality

- **ESLint**: Modern flat config format with Next.js and TypeScript rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Full type safety
- **Husky**: Pre-commit hooks for quality assurance

## 🚀 Deployment

### Vercel Deployment

1. **Set environment variables** in Vercel Dashboard
2. **Deploy** from GitHub repository
3. **Configure domain** (optional)

### Required Environment Variables for Production

Make sure to set these in your Vercel project settings:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` 
- `JWT_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📄 License

MIT

## 🙏 Credits

Built by [Beny Dishon](https://github.com/BenyD)
