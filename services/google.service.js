const environment = require('../environment/environment');
const google = require('googleapis');
const fs = require('fs');

class GoogleService {


    constructor(accessToken, refreshToken) {
        this.auth = this.authorize(accessToken, refreshToken);
    }

    getGUser(callback) {
        const auth = google.oauth2('v2');
        auth.userinfo.get({
            userId: 'me',
            auth: this.auth
        }, callback);
    }

    authorize(accessToken, refreshToken) {
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

    /*
     TODO remove comment
     (err, response) => {
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
     }
     */
    listFiles(callback, pageSize, fields) {
        if(typeof fields === 'undefined') {
            fields = "nextPageToken, files(id, name)";
        }
        let service = google.drive('v3');
        service.files.list({
            auth: this.auth,
            pageSize: pageSize,
            fields: fields
        }, callback);
    }

    /*
     TODO remove comment
     function(err, res) {
         if (err) {
            // Handle error
            console.log(err);
         } else {
             console.log('Permission ID: ', res.id)
             var domainPermission = {
                 'type': 'domain',
                 'role': 'writer',
                 'domain': 'example.com'
             };
             drive.permissions.create({
                 resource: domainPermission,
                 fileId: fileId,
                 fields: 'id',
             }, function(err, res) {
                 if (err) {
                     // Handle error
                     console.log(err);
                 } else {
                    console.log('Permission ID: ',  res.id)
                 }
         });
     }
     */
    filePermissions(fileId, userPermission, domainPermission, callback) {
        let service = google.drive('v3');
        service.permissions.create({
                auth: this.auth,
                resource: userPermission,
                fileId: fileId,
                fields: 'id',
            }, callback);
    }

    getFile(fileId, destination, alt, mime_type) {

        let service = google.drive('v3');

        destination = fs.createWriteStream(destination);
        service.files.get({
                auth: this.auth,
                fileId: fileId,
                alt: alt,
                mime_type: mime_type,
            })
            .on('end', function() {
                console.log('Done');
            })
            .on('error', function(err) {
                console.log('Error during download', err);
            })
            .pipe(destination);
    }

    /*
    TODO remove comment
    metadata example
    var fileMetadata = {
        'name' : 'Invoices',
        'mimeType' : 'application/vnd.google-apps.folder'
    };

    callback example
    (err, response) => {
        if(err) {
            // Handle error
            console.log(err);
        } else {
            console.log('File or Folder Id: ', response.id);
        }
     }
     */
    createFileFolder(fileMetadata, callback) {
        let service = google.drive('v3');
        service.files.create({
            auth: this.auth,
            resource: fileMetadata,
            fields: 'id'
        }, callback);
    }

    /*
    TODO remove comment
    callback example
    (err, file) => {
        if(err) {
            // Handle error
            console.log(err);
        } else {
            console.log('File Id: ', file.id);
        }
    }
     */
    uploadFile(fileMetadata, destination, callback) {

        let media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(destination)
        };

        let service = google.drive('v3');
        service.files.create({
            auth: this.auth,
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, callback);
    }

}

module.exports = GoogleService;