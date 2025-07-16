export interface IPost {
  _id: string;
  user: IUser;
  text: string;
  image?: string;
  video?: string;
  likes: string[];
  comments: IComment[];
  createdAt: string;
  updatedAt: string;   
  deletedAt?: string | null; 
}
