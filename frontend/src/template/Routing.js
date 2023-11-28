import { BrowserRouter as Router, Routes, Link, Route, useParams } from 'react-router-dom';
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
// import Profile from "../pages/Profile";
// import Profiles from "../pages/Profiles";
function Routing(){
    return (
        <div className="">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                {/* <Route path="/profile/:id" element={<Profile />} />
                <Route path="/profiles/:id" element={<Profiles />} /> */}
            </Routes>
        </div>
    );
}
export default Routing;