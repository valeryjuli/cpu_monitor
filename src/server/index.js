
const express = require('express');

/**
 * CORS configuration
 */
const configurationCORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials',true)
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE')
    res.header('Access-Control-Allow-Headers','Authorization, Content-Type, X-Request-With, X-Session-Id')
    res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id')
    if(req.method === 'OPTIONS') {
        res.status(200).send("OK")
    } else {
        next()
    }
}

const expressApp = express();
expressApp.use(configurationCORS);
require('./cpuLoad')(expressApp);

expressApp.listen(5000, () => {
      console.log('Server listening on port 5000');
});