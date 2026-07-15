# Specimen Ledger — Deploy Instructions

This is your gem specimen ledger, packaged as a real standalone website.

## Easiest option: Netlify Drop (no account needed to try it)

1. Go to https://app.netlify.com/drop in a browser on your computer
2. You'll need to "build" it first (see Build step below), then drag the resulting `dist` folder onto that page
3. It'll give you a live URL immediately

## Build step (do this first, needs Node.js installed on a computer)

1. Open a terminal in this folder
2. Run: `npm install`
3. Run: `npm run build`
4. This creates a `dist` folder — that's what you drag onto Netlify Drop, or upload to any static host

## Notes

- Data is saved in the browser's local storage — it stays on whatever device/browser you use it on, doesn't sync across devices
- Once deployed, photo upload should work normally since it's no longer running inside a sandboxed preview
- To keep the site permanently (not just a temporary Netlify Drop link), sign up for a free Netlify or Vercel account and connect it properly — ask Claude for those steps when you're ready
