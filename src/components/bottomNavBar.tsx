import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '../context/authContextProvider';

const bottomBarLinks = [
    {
        imgURL: "/assets/icons/home.svg",
        route: "/posts",
        label: "Home",
    },
    {
        imgURL: "/assets/icons/create_post.svg",
        route: "/createPost",
        label: "Create Post",
    },
    {
        imgURL: "/assets/icons/your_post.svg",
        route: "/yourPost",
        label: "Your Post",
    },
    {
        imgURL: "/assets/icons/accepted_posts.svg",
        route: "/acceptedPosts",
        label: "Accepted Posts",
    },
    {
        imgURL: "/assets/icons/profile.svg",
        route: "/profile",
        label: "Profile"
    }
]

const BottomNavBar = () => {
    const { pathname } = useLocation();
    const { isAuthenticated, logout }  = useUserContext();
    console.log("Bottom bar: ", isAuthenticated, pathname);

    return (
        isAuthenticated && (
            <section className="mt-4 bg-slate-800 text-white py-4 shadow-md rounded-md mb-5 hidden max-[549px]:flex justify-between items-center sticky">
                {bottomBarLinks.map((link) => {
                    const isActive = pathname === link.route;
                    return (
                        <Link
                            to={link.route}
                            key={link.label}
                            className={`${isActive && 'bg-slate-900 rounded-[10px] pointer-events-none'} flex-center items-center flex-col gap-1 p-2 transition`}
                        >
                            <img 
                                src={link.imgURL}
                                alt={link.label}
                                className="invert"
                            />
                            <p className="text-xs text-white">{link.label}</p>
                        </Link>
                    )
                })}
            </section>
        )
        
    )
}

export default BottomNavBar