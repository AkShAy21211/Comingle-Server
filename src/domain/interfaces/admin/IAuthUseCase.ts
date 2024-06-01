import Admin from "../../entities/admin";


interface IAdminUseCase{

    signInAdmin(adminData:Admin):Promise<any>;

}


export default IAdminUseCase;