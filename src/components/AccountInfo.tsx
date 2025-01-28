import { Link } from 'react-router-dom';
import { useUserContext } from '../context/authContextProvider';

const AccountInfo = () => {
    const { user } = useUserContext();
  return (
    <div className="flex flex-center flex-col items-center">
        <h2 className="text-3xl mb-8">Account Info</h2>

        <h3 className="text-lg">Username: {user.username}</h3>
        <h3 className="text-lg">Email: {user.email}</h3>

        <div className="w-full max-w-xl mt-8 bg-slate-600 flex flex-col items-center py-8 rounded-lg" >
            {!user.platforms && (
                <p className="text-sm text-red-400">*Adding your platforms allows other users to see your platform username when accepting their post.  This prevents you from having to enter your username each time you accept a post.</p>
            )}
            
            <h3 className="text-2xl">Platforms: </h3>
            {Object.entries(user.platforms).map(([platformName, platformUsername]) => (
                <h3 key={platformName} className="mb-2 text-xl">
                    {platformName}: {platformUsername}
                </h3>
            ))}
            <Link to="/editPlatforms" className="mt-8 py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md focus:outline-none">Edit Platforms</Link>
        </div>
        
    </div>
  )
}

export default AccountInfo