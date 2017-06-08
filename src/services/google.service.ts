import * as google from 'googleapis';
import * as fs from 'fs';

export class GoogleService {
    auth: any;

    constructor(accessToken: string, refreshToken: string) {
        this.auth = this.authorize(accessToken, refreshToken);
    }

    getGUser(callback: any) {
        const auth = google.oauth2('v2');
        auth.userinfo.get({
            userId: 'me',
            auth: this.auth
        }, callback);
    }

    authorize(accessToken: string, refreshToken: string) {
        let OAuth2 = google.auth.OAuth2;
        let oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CLIENT_ID
        );
        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken
        });
        return oauth2Client;
    }

    listFiles(callback: any, pageSize: number, fields?: string) {
        if(typeof fields === 'undefined') {
            fields = 'nextPageToken, files(id, name)';
        }
        let service = google.drive('v3');
        service.files.list({
            auth: this.auth,
            pageSize: pageSize,
            fields: fields
        }, callback);
    }

    filePermissions(fileId: string, userPermission: any, domainPermission: any, callback: any) {
        let service = google.drive('v3');
        service.permissions.create({
                auth: this.auth,
                resource: userPermission,
                fileId: fileId,
                fields: 'id',
            }, callback);
    }

    getFile(fileId: string, destination: any, alt: string, mime_type: string) {

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

    createFileFolder(fileMetadata: any, callback: any) {
        let service = google.drive('v3');
        service.files.create({
            auth: this.auth,
            resource: fileMetadata,
            fields: 'id'
        }, callback);
    }

    uploadFile(fileMetadata: any, destination: string, callback: any) {

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