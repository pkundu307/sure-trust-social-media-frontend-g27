//here d stands for dto
interface profilePicture{
  url:string;
  public_id:string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IUser{
  _id: string;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: profilePicture;
}