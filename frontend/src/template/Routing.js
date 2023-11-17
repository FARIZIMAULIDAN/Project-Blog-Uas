import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
function Routing(){
    return (
        <div className="w-full h-20 p-4 pl-12 shadow absolute">
            <div className="absolute left-10 top-0">
                <img src="images/b7.png" height={20} width={90}/>
            </div>
            <div className="flex absolute right-12 top-6 gap-10">
                <Link className="font-semibold text-2xl font-sans" to="/">Home</Link>
                <Link className="font-semibold text-2xl font-sans" to="/Login">Login</Link>
            </div>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
            </Routes>
        </div>
    );
}
export default Routing;