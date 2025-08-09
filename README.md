# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/26c23208-de2d-4481-ba7e-b92f077e868a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/26c23208-de2d-4481-ba7e-b92f077e868a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Frontend-Only Setup**

This project now works entirely in the browser with mock authentication and localStorage data storage. No backend setup required!

```sh
# Step 1: Navigate to the frontend directory
cd frontend

# Step 2: Install dependencies
npm install

# Step 3: Start the development server
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Data Storage
- localStorage for user sessions and data persistence
- Mock authentication system
- User-specific data isolation

## How can I deploy this project?

### Option 1: Lovable Deployment
Simply open [Lovable](https://lovable.dev/projects/26c23208-de2d-4481-ba7e-b92f077e868a) and click on Share -> Publish.

### Option 2: Static Site Deployment
Since this is now a frontend-only application, you can deploy it to any static hosting service:

1. **Vercel**: Connect your GitHub repository and deploy
2. **Netlify**: Drag and drop the `frontend/dist` folder
3. **GitHub Pages**: Enable GitHub Pages in your repository settings
4. **Firebase Hosting**: Use Firebase CLI to deploy

### Local Development
```bash
cd frontend
npm install
npm run dev
```

The application now works entirely in the browser with localStorage for data persistence.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
