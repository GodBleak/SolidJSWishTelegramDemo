# A template for GramJS entirely in the browser with SolidJS.

Uses the [SolidJS](https://github.com/solidjs/solid) [vite typescript starter template](https://github.com/solidjs/templates/tree/master/ts), with [Animate.css](https://github.com/animate-css/animate.css), [TailwindCSS](https://github.com/tailwindlabs/tailwindcss), and [DaisyUI](https://github.com/saadeghi/daisyui)

[**demo**](https://codesandbox.io/s/solidjs-ts-tailwindcss-animatecss-telegram-fuycpn)

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```
**Don't forget your environment variables**
You'll need to specify your API ID & API Hash from [Telegram](https://my.telegram.org) for the environment variables `VITE_API_ID` & `VITE_API_HASH`
- in the demo, configure this in Server Control Panel > Secret Keys
- in for local dev, do this in a `.env` file.
 
**You must also configure SSL**
For dev purposes, I recommend using [mkcert](https://github.com/FiloSottile/mkcert#example) and passing your key and cert files to vite's [`server.https`](https://vitejs.dev/config/#server-https). Detailed instructions [here](https://stackoverflow.com/a/69743888). mkcert does have an [npm package](https://www.npmjs.com/package/mkcert), but I had no luck with that route, albeit I didn't try very hard.


### Learn more on SolidJS at the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)
### Learn more about GramJS at [github/gram-js/gramjs](https://github.com/gram-js/gramjs) and come chat with us on [Telegram](https://t.me/gramjschat)

## Available Scripts

In the project directory, you can run:

### `npm dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
