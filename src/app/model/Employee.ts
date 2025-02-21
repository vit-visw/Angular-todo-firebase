export class EmployeeModel{
    empId:number;
    name:string;
    city:string;
    state:string;
    emailId:string;
    contactNum:string;
    address:string;
    pincode:string;
    id?: string;

    constructor(){
        this.empId =0;
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