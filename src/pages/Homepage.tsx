import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div>
            <h1>Welcome to Grouply!</h1>
            <nav>
                <ul>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                </ul>
            </nav>
        </div>
    );
}

export default Homepage;