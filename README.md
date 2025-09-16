# Beny.one - Personal Terminal Website

A modern terminal-inspired personal website built with Next.js 15 and TailwindCSS.

## 📸 Preview

![Preview 1](./public/preview-1.png)
![Preview 2](./public/preview-2.png)
![Preview 3](./public/preview-3.png)
![Preview 4](./public/preview-4.png)
![Preview 5](./public/preview-5.png)

## ✨ Features

- Modern, clean design with light/dark mode support
- Interactive terminal interface with multiple commands
- Personal information and skills showcase
- **Assets Management System** - Upload and manage files with shareable links
- **Simple Authentication** - Environment-based username/password login
- Responsive layout for all devices
- Fast page loads with Next.js App Router
- SEO optimized with metadata

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org) - React framework for building full-stack web applications
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [Supabase](https://supabase.com) - File storage and database
- [JWT](https://jwt.io) - JSON Web Tokens for authentication
- [Umami Analytics](https://umami.is) - Privacy-focused analytics
- [TypeScript](https://typescriptlang.org) - Type-safe JavaScript
- [MDX](https://mdxjs.com) - Markdown for the component era

## 📝 Project Structure

- `src/components` - Reusable UI components
- `src/app` - Next.js 15 app router pages and layout
- `src/lib` - Utility functions and constants
- `supabase/migrations` - Database migration files
- `public` - Static assets

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/beny-terminal.git
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
   - Follow the instructions in `SUPABASE_SETUP.md`
   - Run migrations: `npm run migrate`

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Database and storage configuration
- [Simple Auth Setup](./SIMPLE_AUTH_SETUP.md) - Authentication configuration
- [Assets Management](./ASSETS_README.md) - File upload and management system

## 📄 License

MIT

## 🙏 Credits

Built by [Beny Dishon](https://github.com/BenyD)
