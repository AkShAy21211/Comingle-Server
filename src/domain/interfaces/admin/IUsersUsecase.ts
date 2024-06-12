import { User } from '../../../../../frontend/src/Interface/interface';
interface IUsersUseCase{


    getAllUsers():Promise<User[]|null|undefined>
    blockAndUnblockUser(id:string):Promise<any>;

}


export default IUsersUseCase;