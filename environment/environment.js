const environment = module.exports = {
    AppName: 'coglite',
    apiVersion: 'v1',
    authPath: 'user/auth/',
    ApplicationSecret: 'UE9tCxtgBKXNSagEds9GcqGYaqv9DEsWXKvCtmvnFxdxPj1S3iQeDNKp99e5',
    PORT : process.env.COGLITE_PORT || 3500,
    DB : {
       name: 'coglite',
       user: 'admin',
       password: 'cogliteIsAwesome'
    },
    googleCredentials: {
        client_id: '1508652115-djorgjfpojk15koh7k8u8dbt6rqfk2gv.apps.googleusercontent.com',
        project_id: 'zeta-instrument-136408',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://accounts.google.com/o/oauth2/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: 'fp3cT_-_0iOjTatNdv0X4u-r',
        redirect_uris: []
    }
};
