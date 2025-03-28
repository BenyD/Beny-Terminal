# Beny.one - Personal Terminal Website

A modern terminal-inspired personal website built with Next.js 15 and TailwindCSS.

## 📸 Preview

![Preview 1](./public/preview-1.png)
![Preview 2](./public/preview-2.png)
![Preview 3](./public/preview-3.png)
![Preview 4](./public/preview-4.png)
![Preview 5](./public/preview-5.png)

## ✨ Features

- Terminal-inspired UI design
- Responsive layout with mobile menu
- Page view tracking with Umami analytics
- Projects showcase
- Personal information sections
- Articles section
- Statistics dashboard

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org) - React framework for building full-stack web applications
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [Umami Analytics](https://umami.is) - Privacy-focused analytics
- [TypeScript](https://typescriptlang.org) - Type-safe JavaScript
- [MDX](https://mdxjs.com) - Markdown for the component era

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BenyD/beny.one.git
   cd beny.one
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env.local` file with:

   ```
   UMAMI_API_KEY=your_api_key
   UMAMI_WEBSITE_ID=your_website_id
   UMAMI_SHARE_TOKEN=your_share_token
   UMAMI_URL=https://cloud.umami.is
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deployment

When deploying to Vercel or similar platforms, you might encounter dependency conflicts between React 19 and some packages. The project includes:

- Updated React types compatible with MDX
- An `.npmrc` file with `legacy-peer-deps=true` to help with dependency resolution

If you encounter build errors related to dependencies, try one of these approaches:

- Use the provided `.npmrc` configuration
- Run installation with `npm install --legacy-peer-deps`
- Update affected packages to versions compatible with React 19

## 📝 Project Structure

- `src/components` - Reusable UI components
- `src/app` - Next.js 15 app router pages and layout
- `src/lib` - Utility functions and constants
- `public` - Static assets

## 📊 Analytics Setup

This project uses Umami for privacy-focused analytics. To set up:

1. Create an account on [Umami](https://umami.is/)
2. Add your website to Umami dashboard
3. Copy your Website ID and Share Token to your environment variables

## 📄 License

MIT

## 🙏 Credits

Built by [Beny Dishon](https://github.com/BenyD)
