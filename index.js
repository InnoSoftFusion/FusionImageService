/*
This is a sample image service that is compatible with Fusion. The API is written in Node.js and make use of 3rd party libraries.

NOTE: While OAuth endpoints are present, this is NOT a example of how to implement OAuth and should not be used for production level code.
The purpose of the example is to show how to return the images when Fusion requests them

NOTE: There is an issue with the OAuth package used that causes issues when using password grant type. It requires the client_Id and client_Secret
to be sent with the username and password during athenication. The package provides a setting to override this but it is being ignored. This means that
connecting this image service to Fusion with the "OAuth - Password" auth type will not work as Fusion does not send those addtional 2 params. "OAuth - Client Credentials"
auth type does work with Fusion. External tools such as PostMan and SoapUI are able to use the grant type providing the 2 extra fields are sent.

Ussage:
- To start the node server, enter node index.js into the terminal window or command prompt. The server is configured to run on port 8000. You can change
the port by changing the value in serverPort variable at the top of the code.
- If using OAuth endpoints, you can configure the credentials by changing the values at the top the code, clientCreds for client_credentials and userCreds for password
grant type. Simple replace the feilds inside of the {} brackets. The credentials are stored in a JSON array so you can add multiple credentials if you choose to. 
- You can change/add/remove images by adding them to the base folder of this workspace. 2 samples have been included.
    - default.jpg: you can replace this image with another but the new image needs to have the same name. This is the image that will be returned if we do not
    find a match to the externalId passed in.
    - sampleUser.jpg: This image can be used or replace with other images. The file names can be changed, but must match the externalId set in Fusion for the user whos
    image you are requesting. This server is currently expecting .jpg images but Fusion can handle other types like .png.
- getImage(res, externalId) is the method that reads the image of the file system and writes it to the response of the request. This method is the main 
reason for this example
*/

//////////////////////////////////////////////// CONFIG SECTION - CHANGE THESE VALUES////////////////////////////////////////////////
var clientCreds = [{ clientId : '{clientId}', clientSecret : '{clientSecret}}', redirectUris : [''], grants: ['client_credentials'] }];
var userCreds = [{ id : '123', username: '{username}', password: '{password}', grants: ['password'] }];
const serverPort = 8000;
//////////////////////////////////////////////// END OFCONFIG SECTION///////////////////////////////////////////////////////////////


var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');
var app = express();
let fs = require('fs');
const MemoryStore = require('./model.js');

const memoryStore = new MemoryStore(clientCreds, userCreds)

app.oauth = new OAuthServer({    
    model: memoryStore,
    requireClientAuthentication: {password: false}
  });

app.oauth.token.requireClientAuthentication = {password: false}
  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authorization Endpoint
app.post('/token', app.oauth.token());

// OAuth Endpoint
app.get('/api/person/getPersonImage/:externalId', app.oauth.authenticate(), async function (req, res, next) { 
    getImage(res, req.params.externalId);
 });

 // No Auth endpoint
 app.get('/api/person/getPersonImageNoAuth/:externalId', async function (req, res, next) { 
    getImage(res, req.params.externalId);
 });

 // Main image fetch method
 function getImage(res, externalId){
    var fileName = externalId + '.jpg';
    var stream
    if (fs.existsSync(fileName)) {
        stream = fs.createReadStream(fileName);        
    } else {
        stream = fs.createReadStream("default.jpg");        
    }
    stream.on('open', function () {
        res.set('Content-Type', 'image/jpeg');
        stream.pipe(res);
    });
 }


app.listen(serverPort, () => console.log(`listening on port ${serverPort}`));