# Factify

AI-powered bias, fallacy, and misinformation detector.

Paste any text and get an instant breakdown of logical fallacies, cognitive biases, and manipulation tactics with color-coded highlights and confidence scores.

## Stack

- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend**: Express + OpenAI GPT-4o-mini
- **Hosting**: GitHub Pages (liamhellman.com) + Render (API)

## Local Development

```bash
# Frontend
npm install
npm run dev

# Server (separate terminal)
cd server
npm install
cp ../.env.example ../.env  # add your OpenAI key
npm run dev
```

## Deployment

- Frontend auto-deploys to GitHub Pages on push to `main`
- CNAME configured for `liamhellman.com`
- API deployed on Render at `factify-api.onrender.com`
