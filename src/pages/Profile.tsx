import AccountInfo from '../components/AccountInfo'

const Profile = () => {
  return (
    <div className="min-h-screen bg-slate-600 text-white flex flex-col items-center py-8">
        <div className="w-full max-w-wxl mt-8 bg-slate-500 p-6 rounded-lg shadow-lg">
            <AccountInfo />
        </div>
    </div>
  )
}

export default Profile