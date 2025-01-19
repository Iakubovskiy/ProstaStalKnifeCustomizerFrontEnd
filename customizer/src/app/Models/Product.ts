export default class Product {
    public id:string;
    public isActive:boolean;

    public constructor (id:string, isActive:boolean) {
        this.id = id;
        this.isActive = isActive;
    }
}