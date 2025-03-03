import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="bg-slate-600 flex items-start justify-center py-44">
        <div className="bg-slate-500 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h1 className="text-5xl font-bold mb-4 text-white">Welcome to Lobby Lync</h1>
            <p className="text-lg text-gray-300 mb-6">
                Lobby Lync is the ultimate platform for gamers to connect! Create and join groups for your favorite games, find new teammates, and build your gaming community.
            </p>
            <div className="flex space-x-4 justify-center">
                <Link to="/login" className="px-6 py-3 bg-blue-500 text-white rounded-xl text-lg font-semibold hover:bg-blue-600 transition">
                    Get Started
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Homepage
