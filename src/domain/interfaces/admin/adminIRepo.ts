import Admin from '../../entities/admin';

interface IAdminReposotory{


    findAdminByEmail(email:string):Promise<Admin|null|undefined>;
}


export default IAdminReposotory;