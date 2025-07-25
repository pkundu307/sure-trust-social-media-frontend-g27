import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/axios';
interface Profile {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}
const FriendProfile = () => {
const[profile,setProfile] = React.useState<Profile | null>(null);

     const { id } = useParams();
     console.log(id);
       function fetchFriendProfile() {
    api
      .get(`/friends/profile-by-email?email=${id}`)
      .then((res) => {
        console.log(res.data);
        setProfile(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch friend profile");
      });
  }
  useEffect(() => {
    setTimeout(() => {
       
        }, 1000);
    fetchFriendProfile();
  }, );
  return (
    <div>
      {profile ? (
        <>
          {profile.name || 'No Name'}'s Profile
        </>
      ) : (
        <>No user found</>
      )}
    </div>
  )
}

export default FriendProfile
