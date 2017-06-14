import * as google from 'googleapis';
import * as fs from 'fs';

export class GoogleService {
    oauth2Client: any;
    scopes: Array<string> = [
        'https://www.googleapis.com/auth/drive.metadata.readonly'
    ];

    constructor() {
        const OAuth2 = google.auth.OAuth2;
        this.oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_AUTH_REDIRECT_URI
        );
    }

    getGUser(callback: any) {
        const auth = google.oauth2('v2');
        auth.userinfo.get({
            userId: 'me',
            auth: this.oauth2Client
        }, callback);
    }

    getToken(code: string, callback: Function) {
        this.oauth2Client.getToken(code, callback);
    }

    authorize(accessToken: string, refreshToken?: string) {
        this.oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken || null
        });
    }

    listFiles(callback: any, pageSize: number, fields?: string) {
        if(typeof fields === 'undefined') {
            fields = 'nextPageToken, files(id, name)';
        }
        let service = google.drive('v3');
        service.files.list({
            auth: this.oauth2Client,
            pageSize: pageSize,
            fields: fields
        }, callback);
    }

    filePermissions(fileId: string, userPermission: any, domainPermission: any, callback: any) {
        let service = google.drive('v3');
        service.permissions.create({
                auth: this.oauth2Client,
                resource: userPermission,
                fileId: fileId,
                fields: 'id',
            }, callback);
    }

    getFile(fileId: string, destination: any, alt: string, mime_type: string) {

        let service = google.drive('v3');

        destination = fs.createWriteStream(destination);
        service.files.get({
                auth: this.oauth2Client,
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
            auth: this.oauth2Client,
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
            auth: this.oauth2Client,
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, callback);
    }
}