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
   npm install --legacy-peer-deps
   # or
   yarn install --ignore-peer-deps
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

## 🚢 Deployment on Vercel

This project uses React 19 and modern dependencies that may have peer dependency conflicts. To deploy successfully on Vercel:

1. **Use the included vercel.json configuration**:
   The project includes a `vercel.json` file that tells Vercel to use the `--legacy-peer-deps` flag during installation.

2. **Enable legacy peer deps in Vercel dashboard**:
   If you're still encountering issues, go to your project settings in the Vercel dashboard:

   - Navigate to Settings > General
   - Under Build & Development Settings, add an environment variable:
     - Key: `NPM_FLAGS`
     - Value: `--legacy-peer-deps`

3. **Check the build logs**:
   If the build fails, review the logs for specific dependency conflicts. The project includes:
   - An `.npmrc` file with `legacy-peer-deps=true`
   - Package overrides in `package.json` to manage React type conflicts

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
