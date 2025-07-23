
export interface FriendRequest{
    _id: string;
    from:{
      _id: string;
      name: string;
      profilePicture: string;
    }
  }

export interface Friend{
    _id: string;
    name: string;
    profilePicture: string;
  }