import { useContext } from 'react';
import AuthContext from "../context/authContext";

const Homepage = () => {
    const { auth, loading } = useContext(AuthContext);

    //will display this if the authentication data is still propagating
    if (loading) {
      return <div>Loading...</div>;
    }

  return (
    <div>
      {auth ? (
        <h1>Welcome to Your Dashboard!</h1>
      ) : (
        <h1>Welcome, please log in to continue.</h1>
      )}
    </div>
  );
};

export default Homepage;