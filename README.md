# PackComply Free Beta v0.7

Public-facing free packaging export checker.

## Free flow
Product → destination → packaging → food-contact/end-user questions → optional photo → preliminary regulatory areas → potential issues → evidence checklist → official sources.

## Run
1. Install Node.js 20+
2. `npm install`
3. `npm start`
4. Open `http://localhost:3000`

The free beta does not require an account or payment. The AI photo endpoint remains available when an OpenAI API key is configured.

## Product principle
Do not claim “100% compliant”. Results are preliminary and explicitly separate AI/image observations from regulatory applicability.


## Vercel deployment
This version separates the Express application (`app.js`) from the local listener (`server.js`) and exposes `api/index.js` for Vercel's serverless Node runtime. `vercel.json` routes requests to the Express app.
