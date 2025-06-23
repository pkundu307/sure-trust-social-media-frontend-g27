import { useEffect, useState } from 'react'
import { api } from '../api/axios'
import type {IUser} from '../types/user'
const Profile = () => {
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        api.get('/user/me').then((res) => {
            setUser(res.data)
        }
        ).catch((err) => {
            console.error(err)
            alert('Failed to fetch user data')
        }
        )
    }
    , [])
  return user?(
    <div className='p-6'>
        <h2 className="text-2xl font-bold">
            Welcome, {user.name}!
            
        </h2>
        <div className="mt-4">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Bio:</strong> {user.bio || 'No bio available'}</p>
</div>      
    </div>
  ):(<p>Loading profile</p>)
}

export default Profile
