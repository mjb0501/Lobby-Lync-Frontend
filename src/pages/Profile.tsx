import AccountInfo from '../components/AccountInfo'
import { useUserContext } from '../context/authContextProvider';

const Profile = () => {
  const { logout }  = useUserContext();

  return (
    <div className="bg-slate-600 text-white flex flex-col items-center mb-28">
        <div className="w-full max-w-wxl mt-8 bg-slate-500 p-6 rounded-lg shadow-lg">
            <AccountInfo />
            <button onClick={logout} className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300">Logout</button>
        </div>
        
    </div>
  )
}

export default Profile