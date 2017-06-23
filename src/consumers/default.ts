import * as amqp from 'amqplib/callback_api';

class defaultConsumer {

    amqp: any;

    constructor() {
        this.amqp = amqp;

        this.amqp.connect();
    }


}