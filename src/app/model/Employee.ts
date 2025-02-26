export class EmployeeModel{
   
    name:string;
    city:string;
    state:string;
    emailId:string;
    contactNum:string;
    address:string;
    pincode:string;
    usermail?:string;
    id?: string;
    // userId?:string;

    constructor(){
     
        this.name = '';
        this.city = '';
        this.state ='';
        this.emailId ='';
        this.contactNum ='';
        this.address = '';
        this.pincode ='';
        this.id=undefined;
    }
}