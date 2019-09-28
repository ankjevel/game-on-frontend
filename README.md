# game-on-frontend (working title)

## how to run

```sh
nvm use # to run the correct node version
# else check .nvmrc to see required node version
npm i # or `npm ci` to install required `node modules`
npm run dev # to run the dev-server
npm test # to run tests
```

If you need to update the configuration (check `lib/Config.js` for defaults)
add then to a `config.json` in the root.

For example; to change the default api-host to `https://some.server.com`, add this to a `config.json`-file:

```json
{
  "api": "https://some.server.com"
}
```

... or use `env`:

```sh
api=https://some.server.com npm run dev
```
