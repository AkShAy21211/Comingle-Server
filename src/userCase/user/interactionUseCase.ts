import IFollowRepo from "../../domain/interfaces/user/IFollowRepo";
import IInteractionUseCase from "../../domain/interfaces/user/IInteractionUseCase";

class InteractionUseCase implements IInteractionUseCase {
  constructor(private _reposotory: IFollowRepo) {}

  async followUser(requester: string, recipient: string): Promise<any> {
    try {
      const followRequest = await this._reposotory.createFollowRequest(
        requester,
        recipient
      );

      return followRequest;
    } catch (error) {
      console.log(error);
    }
  }
}

export default InteractionUseCase;
