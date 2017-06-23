export abstract class BaseEvent {

    private readonly _registeredMethodEnding = 'Event';
    protected io: any;
    protected socket: any;

    constructor(io: any, socket: any) {
        this.io = io;
        this.socket = socket;
        this.onInit();
        this.initEvents();
    }

    private getEventMethodNames(obj): Set<string> {
        let methods = new Set();
        while (obj = Reflect.getPrototypeOf(obj)) {
            let keys = Reflect.ownKeys(obj);
            keys.forEach((k) => {
                if(k.toString().indexOf(this._registeredMethodEnding,
                            (k.toString().length - this._registeredMethodEnding.length)) !== -1) {
                    methods.add(k);
                }
            });
        }
        return methods;
    }

    protected onInit(): void {}

    protected initEvents(): void {
        const methods = this.getEventMethodNames(this);
        [...methods].map((method) => {
            this[method]();
        });
    }

}