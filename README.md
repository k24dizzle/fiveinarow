# fiveinarow
a place where you can play five in a row

`git clone`
`npm install`
`npm run dev`



```

Lifecycle scripts included in fiveinarow:
  start
    npm install && node ./server/server.js

available via `npm run-script`:
  client
    cd client && npm start
  server
    nodemon ./server/server.js
  dev
    concurrently --kill-others-on-fail "npm run server" "npm run client"
  heroku-postbuild
    cd client && npm install && npm run build



```