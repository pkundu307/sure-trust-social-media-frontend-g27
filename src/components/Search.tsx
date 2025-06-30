import { useState } from "react"
import { api } from "../api/axios"
import { Link } from "react-router-dom";


const Search = () => {
const [query,setQuery] = useState("");
const[email,setEmail] = useState("");
const[friends,setFriends] = useState([]);
interface Profile {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

const[profile,setProfile] = useState<Profile | null>(null);

const handleFriendSearch = async () => {
    try {
        const res = await api.get(`/friends/search-friends?name=${query}`);
        setFriends(res.data);
    } catch (error) {
        alert( error);
    }
}
    return (
    <div className="flex flex-col items-center bg-cyan-900 p-2">
      <input type="text" placeholder="Search" value={query} onChange={(e)=>setQuery(e.target.value)}/>
      <button onClick={handleFriendSearch}>🔍</button>

      {friends.length > 0 && (
        <>
        {friends.map((friend:Profile) => (
          <div key={friend.id} className="bg-green-900 p-4 rounded shadow-md m-2 flex flex-col items-center">
            <h3>{friend.name}</h3>
            <p>{friend.email} <Link to={`/profile/${friend.email}`}><span className="bg-amber-500 p-2 rounded">➡️➡️</span></Link></p>
            </div>))}
        </>)}
    </div>
  )
}

export default Search;
