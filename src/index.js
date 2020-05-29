// this file runs on npm start, as defined in package.json scripts
import server from './server'

server.start({
  // Let heroku choose port or fallback on our local 4000 if dev 
  port: process.env.PORT || 4000
}, () => {
  console.log('The server is up!')
})
