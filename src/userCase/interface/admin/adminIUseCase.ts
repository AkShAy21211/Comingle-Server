import Admin from "../../../domain/admin";


interface IAdminUseCase{

    signInAdmin(adminData:Admin):Promise<any>;

}


export default IAdminUseCase;