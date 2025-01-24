import { useState } from 'react'
import { editPlatforms } from '../services/authServices';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/authContextProvider';

const EditPlatforms = () => {
    const { user, checkAuthUser } = useUserContext();
    const [usernames, setUsernames] = useState({
        Xbox: user.platforms["Xbox"] || "",
        Playstation: user.platforms["Playstation"] || "",
        Steam: user.platforms["Steam"] || "",
        Switch: user.platforms["Switch"] || "",
    });
    const navigate = useNavigate();

    
    const handleChange = (platform: string, value: string) => {
        setUsernames((prev) => ({
            ...prev,
            [platform]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            await editPlatforms(usernames);
            await checkAuthUser();
            navigate('/profile');
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="flex flex-col items-center">
            <div className="bg-slate-500 rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-slate-50 mb-6 text-center">Enter Your Platform Usernames</h2>
                {Object.keys(usernames).map((platform) => (
                    <div key={platform} className="mb-4">
                        <label
                            htmlFor={platform}
                            className="block text-slate-100 text-sm font-medium mb-1"
                        >
                            {platform} Username
                        </label>
                        <input
                            id={platform}
                            type="text"
                            value={usernames[platform as keyof typeof usernames]}
                            onChange={(e) => handleChange(platform, e.target.value)}
                            placeholder={`Enter your ${platform} username`}
                            className="w-full px-4 py-2 rounded-lg bg-slate-400 border border-slate-300 text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                ))}
                <button
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default EditPlatforms