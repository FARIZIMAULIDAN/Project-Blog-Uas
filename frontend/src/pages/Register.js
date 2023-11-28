import React, {useState, useEffect} from  "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Register(){
    const navigate = useNavigate();
    const [nama, setNama] = useState('');
    const [jenis_kelamin, setJeniskelamin] = useState('');
    const [alamat, setAlamat] = useState('');
    const [tanggal_lahir, setTanggallahir] = useState('');
    const [photos, setPhotos] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlePhotosChange = (e) => {
        const file = e.target.files[0];
        setPhotos(file);
    };

    const handleNamaChange = (e) => {
        setNama(e.target.value)
    };

    const handleJeniskelaminChange = (e) => {
        setJeniskelamin(e.target.value)
    };

    const handleAlamatChange = (e) => {
        setAlamat(e.target.value)
    };

    const handleTanggallahirChange = (e) => {
        setTanggallahir(e.target.value)
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    };

    const handleRegister = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData();
        
            formData.append("nama", nama);
            formData.append("jenis_kelamin", jenis_kelamin);
            formData.append("alamat", alamat);
            formData.append("tanggal_lahir", tanggal_lahir);
            formData.append("photo", photos);
            formData.append("email", email);
            formData.append("password", password);

            const response = await axios.post('http://localhost:3000/api/auth/user/register', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log('Pendaftaran berhasil:', response.data);
            navigate('/');
            window.location.reload();
            alert('Register Successful');
            } catch (error) {
            console.error('Gagal mendaftar:', error);
            console.log(error);
            alert('User or email is already registered or incomplete data');
            }
    };

    return(
        <div className="w-full h-screen flex font-sans bg-gray-200">
            <div className="mt-20 w-9/12 md:w-3/4 lg:w-1/4 h-max p-5 mx-auto shadow shadow-slate-600 rounded-lg bg-white">
                <div className="mb-2">
                    <a className="text-xl font-semibold">Register</a>
                </div>
                <span className="w-full h-[1.75px] bg-black block" />
                <div className="w-full mt-10">
                    <div className="mb-5">
                        <input className="w-full h-8 p-4 rounded-xl border border-black" placeholder="Name" type="text" value={nama} onChange={handleNamaChange} />
                    </div>
                    <div className="mb-5">
                        <select value={jenis_kelamin} onChange={handleJeniskelaminChange} className="w-full h-9 px-4 rounded-xl border border-black text-black">
                            <option value="">Jenis kelamin anda</option>
                            <option  value={"male"}>Male</option>
                            <option  value={"female"}>Female</option>
                        </select>
                    </div>
                    <div className="mb-5">
                        <input className="w-full h-8 p-4 rounded-xl border border-black" placeholder="Address" type="text" value={alamat} onChange={handleAlamatChange} />
                    </div>
                    <div className="mb-5">
                        <input className="w-full h-8 p-4 rounded-xl border border-black" type="date" value={tanggal_lahir} onChange={handleTanggallahirChange} />
                    </div>
                    <div className="mb-5">
                        <input className="w-full h-8 rounded-xl border border-black" placeholder="photo" type="file" accept="image/*" onChange={handlePhotosChange} />
                    </div>
                    <div className="mb-5">
                        <input className="w-full h-8 p-4 rounded-xl border border-black" placeholder="Email address" type="email" value={email} onChange={handleEmailChange} />
                    </div>
                    <div className="mb-10">
                        <input className="w-full h-8 p-4 rounded-xl border border-black" placeholder="Password" type="password" value={password} onChange={handlePasswordChange} />
                    </div>
                    <div className="mb-10 flex">
                        <button className="mx-auto w-24 h-10 bg-blue-400 font-sans text-white text-xl font-bold rounded-2xl border border-black hover:bg-blue-600 duration-100 ease-out" onClick={handleRegister}>Register</button>
                    </div>
                    <span className="w-full h-[1.75px] bg-black block" />
                    <div>
                        <h1>Have account? <a className="text-blue-300 hover:text-blue-500 duration-100 ease-out" href="/">Click here</a> to login</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Register