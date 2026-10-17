# PackComply v0.5 — AI Packaging Inspector

## Run locally
1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Add an OpenAI API key to `.env`.
4. Run `npm install`.
5. Run `npm start`.
6. Open http://localhost:3000

Without an API key the app uses a clearly labelled demo response, so the UI can be tested safely.

## Architecture
Browser photo upload -> Express backend -> OpenAI Responses API image input -> structured inspection -> future regulatory engine.

The API key is server-side only; never put it in browser JavaScript.

## Important
The model is instructed not to determine exact polymer composition, migration compliance, certification validity, recyclability classification, or legal responsibility from a photograph. Those require evidence and/or official regulatory logic.


## v0.6 regulatory engine
`POST /api/check` accepts:
`country`, `product`, `material`, `food_contact`.

It returns matched rule records, consolidated evidence requirements, and explicit limitations. Rule records are separate from the UI and include source URL, effective status, verification date and review frequency.

## Verified Germany seed
The Germany records are based on current ZSVR guidance covering registration, system participation, data reporting, small-volume reporting and declaration of completeness. The product must still be reviewed by a qualified compliance/legal professional before commercial reliance.
