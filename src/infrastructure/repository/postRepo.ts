import mongoose, { mongo, Types } from "mongoose";
import Like from "../../domain/entities/like";
import Posts from "../../domain/entities/post";
import IPostRepo from "../../domain/interfaces/user/IPostRepo";
import likeModel from "../database/likeModel";
import postModel from "../database/postModel";
import PostModel from "../database/postModel";
import Comment, { UpdatedCommetn } from "../../domain/entities/comment";
import commentModel from "../database/commentModal";

class PostReposotory implements IPostRepo {
  async createPost(
    userId: string,
    content: { url: string; type: string }[],
    text: string,
    schedule: Date | undefined
  ): Promise<Posts | null | undefined> {
    try {
      const newPost = new PostModel({
        userId: userId,
        image: content,
        description: text,
        status: schedule ? "Draft" : "Published",
        date: schedule && schedule,
      });

      await newPost.save();

      return newPost.toObject();
    } catch (error) {
      console.log(error);
    }
  }

  async getAllposts(
    page: number,
    isAdminRequest: boolean
  ): Promise<Posts[] | null | undefined> {
    try {
      const perPage = 5;
      const pipeline: any[] = [];

      /////////////// IS THE REQUEST IS MADE NOT MADE BY ADMIN RETUEN POSTS THAT IS NOT HIDDEN
      if (!isAdminRequest) {
        pipeline.push(
          {
            $match: { isHidden: false },
          },

          { $match: { status: "Published" } }
        );
      }

      pipeline.push(
        {
          $sort: { createdAt: -1 },
        },
        // Skip stage to skip a certain number of documents
        {
          $skip: page * perPage,
        },
        // Limit stage to limit the number of documents returned
        {
          $limit: perPage,
        },

        // populate comments from commetns collection
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "comments",
          },
        },

        // populate likes from commetns collection

        {
          $lookup: {
            from: "likes",
            localField: "likes",
            foreignField: "_id",
            as: "likes",
          },
        },
        {
          $unwind: {
            path: "$likes",
            preserveNullAndEmptyArrays: true, // Preserve posts without likes
          },
        },
        // populate postCreator from users collection

        {
          $lookup: {
            from: "users",
            let: { userId: "$userId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
              { $project: { username: 1, "profile.image": 1 } },
            ],
            as: "postUserDetails",
          },
        },

        /// add new feildName for postCreator
        {
          $addFields: {
            postUserName: { $arrayElemAt: ["$postUserDetails", 0] },
          },
        },

        // undwind likes array obectIds

        {
          $unwind: {
            path: "$comments",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$comments.comment",
            preserveNullAndEmptyArrays: true,
          },
        },

        // lookup user details for each comment's nested comment
        {
          $lookup: {
            from: "users",
            localField: "comments.comment.userId",
            foreignField: "_id",
            as: "comments.comment.userDetails",
          },
        },

        {
          $addFields: {
            "comments.comment.userDetails": {
              $arrayElemAt: ["$comments.comment.userDetails", 0],
            },
          },
        },
        // group comments back into an array for each post
        {
          $group: {
            _id: "$_id",
            comments: {
              $push: {
                _id: "$comments._id",
                comment: {
                  comment: "$comments.comment.comment",
                  _id: "$comments.comment._id",
                  commenter: "$comments.comment.userDetails.username",
                  commentedUserId: "$comments.comment.userDetails._id",
                  isPremium: "$comments.comment.userDetails.profile.isPremium",
                  commenterImage: "$comments.comment.userDetails.profile.image",
                  createdAt: "$comments.comment.createdAt",
                },
              },
            },
            likes: { $first: "$likes" },
            postedUser: { $first: "$postUserName" },
            image: { $first: "$image" },
            description: { $first: "$description" },
            isHidden: { $first: "$isHidden" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },

        {
          $project: {
            _id: 1,
            comments: {
              $cond: {
                if: "$comments.comment",
                then: "$comments.comment",
                else: {}, // If comments is not an array (should not happen), return empty array
              },
            },
            likes: {
              $cond: {
                if: "$likes",
                then: "$likes",
                else: {}, // If likes is not an array (should not happen), return empty array
              },
            },

            postedUser: 1,
            image: 1,
            description: 1,
            isHidden: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        }
      );

      const posts = await postModel.aggregate(pipeline).exec();

      return posts;
    } catch (error) {
      console.log(error);
    }
  }

  async likePost(
    postId: string,
    userId: string
  ): Promise<Like | null | undefined> {
    try {
      const existingPostLikes = await likeModel.findOne({ postId: postId });

      if (existingPostLikes) {
        const likePost = await likeModel.findOneAndUpdate(
          { postId: postId },
          { $addToSet: { userId: userId } },
          { new: true }
        );
        return likePost?.toObject();
      }

      const likePost = new likeModel({
        userId: new mongoose.Types.ObjectId(userId),
        postId: new mongoose.Types.ObjectId(postId),
      });
      await postModel.findByIdAndUpdate(postId, {
        $set: { likes: likePost?._id },
      });
      await likePost.save();
      return likePost;
    } catch (error) {
      console.log(error);
    }
  }

  async unLikePost(
    postId: string,
    userId: string
  ): Promise<Like | null | undefined> {
    try {
      const updatedPostLikes = await likeModel
        .findOneAndUpdate(
          { postId: postId },
          { $pull: { userId: userId } },
          { new: true }
        )
        .lean();

      return updatedPostLikes;
    } catch (error) {
      console.log(error);
    }
  }

  async commentPost(
    postId: string,
    userId: string,
    comment: string
  ): Promise<Comment | null | undefined> {
    try {
      const existingCommentsOnPost = await commentModel.findOne({
        postId: postId,
      });

      if (existingCommentsOnPost) {
        let newComment;
        await commentModel
          .findByIdAndUpdate(
            existingCommentsOnPost._id,
            {
              $push: { comment: { userId, comment } },
            },
            { new: true }
          )
          .then(async (data) => {
            await data
              ?.populate("comment.userId", "username profile.image")
              .then(async (data) => {
                const updatedComent: any =
                  data.comment[data.comment.length - 1];

                newComment = {
                  _id: updatedComent._id,
                  commenter: updatedComent.userId.username,
                  comment: updatedComent.comment,
                  commenterImage: updatedComent.userId.profile.image,
                  createdAt: updatedComent.createdAt,
                };
              });
          });

        return newComment;
      }

      const newComment = new commentModel({
        postId: postId,
        comment: { userId, comment },
      });

      let createdComment;
      await newComment.save().then(async (data) => {
        await data
          ?.populate("comment.userId", "name profile.image")
          .then(async (data) => {
            const updatedComent: any = data.comment[data.comment.length - 1];

            createdComment = {
              _id: updatedComent._id,
              comment: updatedComent.comment,
              commenterImage: updatedComent.userId.profile.image,
              createdAt: updatedComent.createdAt,
            };
          });
      });
      await postModel.findByIdAndUpdate(postId, {
        $set: { comments: newComment?._id },
      });

      return createdComment;
    } catch (error) {
      console.log(error);
    }
  }

  async findPostLikes(id: string): Promise<Like | null | undefined> {
    try {
      const post = await likeModel.findOne({ postId: id }).lean();
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  async hideUnhidePost(postId: string): Promise<Posts | null | undefined> {
    try {
      const post = await postModel.findById(postId);

      const postUpdated = await postModel
        .findByIdAndUpdate(
          post?._id,
          {
            $set: { isHidden: !post?.isHidden },
          },
          { new: true }
        )
        .lean();

      return postUpdated;
    } catch (error) {
      console.log(error);
    }
  }

  async getLikes(postId: string): Promise<Like | null | undefined> {
    try {
      const likes = await likeModel.findOne({ postId: postId }).lean();

      return likes;
    } catch (error) {
      console.log(error);
    }
  }

  async getComments(postId: string): Promise<Comment | null | undefined> {
    try {
      const comments = await commentModel.findOne({ postId: postId }).lean();

      return comments;
    } catch (error) {
      console.log(error);
    }
  }

  async getTotalPostsAnalytics(): Promise<number | null | undefined> {
    try {
      const allPostsCount = await postModel.find({}).countDocuments();

      return allPostsCount;
    } catch (error) {
      console.log(error);
    }
  }
  async findPostsByUser(userId: string): Promise<any | null | undefined> {
    try {
      const pipeline: any[] = [
        {
          $match: { userId: userId },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "likes",
            foreignField: "_id",
            as: "likes",
          },
        },
        {
          $unwind: {
            path: "$likes",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "users",
            let: { userId: "$userId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
              { $project: { username: 1, "profile.image": 1 } },
            ],
            as: "postUserDetails",
          },
        },
        {
          $addFields: {
            postUserName: { $arrayElemAt: ["$postUserDetails", 0] },
          },
        },
        {
          $unwind: {
            path: "$comments",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$comments.comment",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "comments.comment.userId",
            foreignField: "_id",
            as: "comments.comment.userDetails",
          },
        },
        {
          $addFields: {
            "comments.comment.userDetails": {
              $arrayElemAt: ["$comments.comment.userDetails", 0],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            comments: {
              $push: {
                _id: "$comments._id",
                comment: {
                  comment: "$comments.comment.comment",
                  _id: "$comments.comment._id",
                  commenter: "$comments.comment.userDetails.username",
                  commentedUserId: "$comments.comment.userDetails._id",
                  isPremium: "$comments.comment.userDetails.profile.isPremium",
                  commenterImage: "$comments.comment.userDetails.profile.image",
                  createdAt: "$comments.comment.createdAt",
                },
              },
            },
            likes: { $first: "$likes" },
            postedUser: { $first: "$postUserName" },
            image: { $first: "$image" },
            description: { $first: "$description" },
            isHidden: { $first: "$isHidden" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
        {
          $project: {
            _id: 1,
            comments: {
              $cond: {
                if: { $isArray: "$comments.comment" },
                then: "$comments.comment",
                else: [],
              },
            },
            likes: {
              $cond: {
                if: "$likes",
                then: "$likes",
                else: {}, // If likes is not an array (should not happen), return empty array
              },
            },
            postedUser: 1,
            image: 1,
            description: 1,
            isHidden: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ];

      const posts = await postModel.aggregate(pipeline);
      return posts;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deletePost(postId: string): Promise<any> {
    try {
      const deltePost = await postModel.findByIdAndDelete(postId);

      return deltePost;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteComment(postId: string, commentId: string): Promise<any> {
    try {
      console.log("------------", commentId, postId);

      const deletedComment = await commentModel.findOneAndUpdate(
        { postId: postId },
        { $pull: { comment: { _id: commentId } } },
        { new: true }
      );

      return deletedComment;
    } catch (error) {
      console.log(error);
    }
  }

  async editComment(
    commentId: string,
    postId: string,
    newComment: string
  ): Promise<any> {
    try {
      let editedComment;
      await commentModel
        .findOneAndUpdate(
          { postId: postId, "comment._id": commentId },
          { $set: { "comment.$.comment": newComment } },
          { new: true }
        )
        .then(async (data) => {
          await data
            ?.populate("comment.userId", "username profile.image")
            .then(async (data) => {
              const updatedComent: any = data.comment[data.comment.length - 1];

              editedComment = {
                _id: updatedComent._id,
                commenter: updatedComent.userId.username,
                comment: updatedComent.comment,
                commenterImage: updatedComent.userId.profile.image,
                createdAt: updatedComent.createdAt,
              };
            });
        });

      return editedComment;
    } catch (error) {
      console.log(error);
    }
  }

  async editPost(postId: string, text: string): Promise<any> {
    try {
      const editedPost = await postModel.findByIdAndUpdate(postId, {
        $set: { description: text },
      });

      return editedPost;
    } catch (error) {
      console.log(error);
    }
  }
  async getSinglePost(postId: string): Promise<any | null | undefined> {
    try {
      const pipeline: any = [
        {
          $match: { _id: new Types.ObjectId(postId) },
        },

        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "likes",
            foreignField: "_id",
            as: "likes",
          },
        },
        {
          $unwind: {
            path: "$likes",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "users",
            let: { userId: "$userId" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
              { $project: { username: 1, "profile.image": 1 } },
            ],
            as: "postUserDetails",
          },
        },
        {
          $addFields: {
            postUserName: { $arrayElemAt: ["$postUserDetails", 0] },
          },
        },
        {
          $unwind: {
            path: "$comments",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$comments.comment",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "comments.comment.userId",
            foreignField: "_id",
            as: "comments.comment.userDetails",
          },
        },
        {
          $addFields: {
            "comments.comment.userDetails": {
              $arrayElemAt: ["$comments.comment.userDetails", 0],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            comments: {
              $push: {
                _id: "$comments._id",
                comment: {
                  comment: "$comments.comment.comment",
                  _id: "$comments.comment._id",
                  commenter: "$comments.comment.userDetails.username",
                  commentedUserId: "$comments.comment.userDetails._id",
                  isPremium: "$comments.comment.userDetails.profile.isPremium",
                  commenterImage: "$comments.comment.userDetails.profile.image",
                  createdAt: "$comments.comment.createdAt",
                },
              },
            },
            likes: { $first: "$likes" },
            postedUser: { $first: "$postUserName" },
            image: { $first: "$image" },
            description: { $first: "$description" },
            isHidden: { $first: "$isHidden" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
        {
          $project: {
            _id: 1,
            comments: {
              $cond: {
                if: { $isArray: "$comments.comment" },
                then: "$comments.comment",
                else: [],
              },
            },
            likes: {
              $cond: {
                if: "$likes",
                then: "$likes",
                else: {}, // If likes is not an array (should not happen), return empty array
              },
            },
            postedUser: 1,
            image: 1,
            description: 1,
            isHidden: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ];

      const posts = await postModel.aggregate(pipeline);
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  async fetchSchedules(): Promise<Posts[] | null | undefined> {
    try {
      const posts = await postModel.find({ status: "Draft" }).lean();

      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  async updateSchedule(currentDate: Date, postId: string): Promise<void> {
    try {
      const post = await postModel.findOne({_id:postId,
        date: { $lte: currentDate },
        status: "Draft",
      });
      if (post) {
        post.status = "Published";
        await post.save();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default PostReposotory;
