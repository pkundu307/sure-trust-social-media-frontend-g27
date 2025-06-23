//here d stands for dto

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
  profilePicture?: string;
}