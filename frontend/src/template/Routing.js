import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
function Routing(){
    return (
        <div className="">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}
export default Routing;