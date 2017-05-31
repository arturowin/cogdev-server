const environment = require('../environment/environment');
const google = require('googleapis');

class GoogleService {



    constructor(accessToken,refreshToken){
     this.auth = this.authorize(accessToken,refreshToken);
    }

    getGUser(callback){
        const auth = google.oauth2('v2');
        auth.userinfo.get({
            userId: 'me',
            auth: this.auth
        },callback);
    }

    authorize(accessToken,refreshToken) {
        let OAuth2 = google.auth.OAuth2;
        let oauth2Client = new OAuth2(
            environment.googleCredentials.client_secret,
            environment.googleCredentials.client_id
        );
        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken
            // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
            // expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
        });
        return oauth2Client;
    }

    gDrive() {
        let service = google.drive('v3');
        service.files.list({
            auth: this.auth,
            pageSize: 10,
            fields: "nextPageToken, files(id, name)"
        }, (err, response) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            let files = response.files;
            if (files.length === 0) {
                console.log('No files found.');
            } else {
                console.log('Files:');
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    console.log('%s (%s)', file.name, file.id);
                }
            }
        });
    }

}

module.exports = GoogleService;