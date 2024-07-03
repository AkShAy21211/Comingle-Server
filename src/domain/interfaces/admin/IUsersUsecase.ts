import User from "../../entities/user"
interface IUsersUseCase{


    getAllUsers():Promise<User[]|null|undefined>
    blockAndUnblockUser(id:string):Promise<any>;
    fetchAlluserAdmin(page:number,limit:number): Promise<any>;

}


export default IUsersUseCase;