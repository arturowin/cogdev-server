export interface ISeeder {
    /**
     * seed database and return Promise
     */
    seed(): Promise<any>;
}