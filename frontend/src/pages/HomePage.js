import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const token = localStorage.getItem('token');

function HomePage(){
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(1);
    const [body, setBody] = useState('');
    const [photos, setPhotos] = useState(null);
    const [userid, setUserid] = useState('');
    const [validation, setValidation] = useState({});
    const isLoggedIn = !!token;
    const url = "http://localhost:3000/static/";
    const handleLogout = () => {
        localStorage.removeItem('token');
        console.log('berhasl logout');
        navigate('/');
        window.location.reload();
        alert('Logout successful');
    };

    useEffect(() => {
        fectData();
      }, []);

    const fectData = async () => {
        try {
            const headers = {
            Authorization: `Bearer ${token}`
          };
            const response1 = await axios.get("http://localhost:3000/api/post", {headers});
            const data1 = await response1.data.data;
            setPosts(data1);
        
            const response2 = await axios.get(`http://localhost:3000/api/user/${token}`, {headers});
            const data2 = await response2.data.data;
            setUser(data2);
        } catch (error) {
            console.error("Kesalahan: ", error);
        }
    };

    const handleUserIdChange = (e) => {
        setUserid(e.target.value);
    };

    const handleBodyChange = (e) => {
        setBody(e.target.value);
    };
    
    const handlePhotosChange = (e) => {
        const file = e.target.files[0];
        setPhotos(file);
    };

    // const handlePost = async () => {
    //     try {
    //       const response = await axios.post('http://localhost:3000/api/post/store', {
    //         user_id: userid,
    //         body: post,
    //         photos: photos,
    //       }, {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //             Authorization: `Bearer ${token}`,
    //         },
    //       });
    //       console.log('Posting Berhasil', response.data);
    //       navigate('/home');
    //       window.location.reload();
    //     } catch (error) {
    //       console.error('Gagal Post:', error);
    //       console.log(error);
    //     }
    // };

    const handlePost = async (e) => {
        e.preventDefault();
        const formData = new FormData();
    
        formData.append("user_id", userid);
        formData.append("body", body);
        formData.append("photos", photos);
    
        try {
          await axios.post("http://localhost:3000/api/post/store", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          navigate("/homme");
          fectData();
        } catch (error) {
          console.error("Kesalahan: ", error);
          setValidation(error.response.data);
        }
      };

    return(
        <div className="bg-gray-100">
            {/* navbar */}
            <div className="w-full h-20 shadow bg-white">
                <div className="absolute left-10 top-0">
                    <img src="images/b7.png" height={20} width={90}/>
                    
                </div>
                <div className="flex absolute right-12 top-6 gap-10">
                    <a className="font-semibold text-2xl font-sans" href="/home">Home</a>
                    <button className="font-semibold text-2xl font-sans" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            {/* navbar */}
            {/* create post */}
            <div className="mt-4 w-3/4 md:w-4/5 lg:w-1/3 h-max p-3 mx-auto shadow shadow-gray-300 mb-3 rounded-md bg-white">
            <div className="flex mt-2">
                <div className="ml-3 w-10 h-10 rounded-full shadow">
                    <img src="images/myfoto.jpg" className="rounded-full w-40 aspect-square"/>
                </div>
                    <a className="text-lg font-semibold ml-4 mt-1">{user.nama}</a>
                </div>
                    <input className="mt-5 w-[100%] h-8 border rounded-full p-4" placeholder="Apa yang anda pikirkan hari ini?" value={body} onChange={handleBodyChange}/>
                    <input className="w-[100%] mt-5 font-sans text-white text-md font-bold rounded-2xl border border-black ease-out mx-auto" type="file" accept="image/*"  onChange={handlePhotosChange} />
                <div className="flex">
                    <input className="mt-5 w-[90%] h-8 border rounded-full p-4 " hidden value={user.id} onChange={handleUserIdChange} />
                    <button className="w-20 h-8 px-2 mt-5 bg-blue-400 font-sans text-white text-md font-bold rounded-2xl border border-black hover:bg-blue-600 duration-100 ease-out mx-auto" onClick={handlePost}>Posting</button>
                </div>
            </div>
            {/* create post */}
            {/* get all post */}
            {posts.map((post) => (
            <div className="w-3/4 md:w-4/5 lg:w-1/3 h-max shadow shadow-gray-300 bg-white p-3 rounded-md mx-auto mb-3">
                <div className="flex mt-2">
                    <div className="ml-2 w-10 h-10 rounded-full shadow">
                    <img src="images/myfoto.jpg" className="rounded-full w-40 aspect-square"/>
                    </div>
                    <h1 className="text-lg font-semibold ml-4 mt-1">{post.nama}</h1>
                </div>
                <h5 className="mt-1 mb-5">{post.body}</h5>
                <img src={url + post.photos} width={250} className="mx-auto shadow"/>
                <div className="mt-8 ml-auto flex gap-6 w-max h-max">
                    <img src="images/unlove.png" className="w-[35px] h-[35px]" />
                    <img src="images/comment.png" className="w-[35px] h-[35px]"/>
                </div>
            </div>
            ))}
            {/* get all post */}
        </div>
    );
}

export default HomePage;