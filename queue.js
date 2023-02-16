import KJUR from "./jsrsasign";
const fs = require('fs');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === '/' || pathName === '/gate') {
        res.end('A landing page for development');
    } else if (pathName === '/test1'){
        res.end('If you are here, it worked go back: http://localhost:6969/gate');
    } else if (pathName === '/signature') {
        res.end("we code here");

        function generateSessionToken(sdkKey,sdkSecret, topic, password, sessionKey, userIdentity, role=1){
            const iat = Math.round(new Date().getTime() / 1000);
            const exp = iat + 60 * 60 * 2;

            const oHeader = {alg: 'HS256', typ: ' JWT'};
            const oPayload = {
                app_key: sdkKey,
                iat: iat,
                exp: exp,
                version: 1,
                tpc: topic,
                pwd: password,
                user_identity: userIdentity,
                session_key: sessionKey,
                role_type: role
            };

            const sHeader = JSON .stringify(oHeader);
            const sPayload = JSON.stringify(oPayload);
            const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);
            
            return signature;
        }
        const sessionToken = generateSessionToken(sdkKey, sdkSecret, topic, password, sessionKey);
        console.log(sessionToken);
    } else {
        res.writeHead(404, {
            "Content-type" : 'text/html'
        });
        res.end("Page Not Found!");
    }
});
server.listen(6969, '127.0.0.1', () => {
    console.log('Listening to request on port 6969, go to http://localhost:6969')
});
