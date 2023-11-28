import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import b7Image from "../images/b7.png";
import image2 from "../images/unlove.png";
import image3 from "../images/love.png";
import image4 from "../images/comment.png";

const token = localStorage.getItem('token');

function Profiles() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [pos, setPos] = useState(1);
    const [user, setUser] = useState(1);
    const [users, setUsers] = useState([]);
    const [like, setLike] = useState([]);
    const url = "http://localhost:3000/static/";
    const urlUser = "http://localhost:3000/userPhotos/";
    const [currentImage, setCurrentImage] = useState("image2");

    const handleLogout = () => {
        localStorage.removeItem('token');
        console.log('berhasil logout');
        navigate('/');
        window.location.reload();
    };

    const handleProfileAll = (userId) => {
        navigate(`/profiles/${userId}`);
        window.location.reload();
    };

    const handleToggleImage = async (postId, ids) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const a = like.some((likeItem) => likeItem.post_id === postId && likeItem.user_id === ids);
            console.log("status is ",a);
            if (like.some((likeItem) => likeItem.post_id === postId && likeItem.user_id === ids)) {
                await axios.delete(`http://localhost:3000/api/like/delete/${postId}`, { headers });
                setLike((prevLikes) => prevLikes.filter((likeItem) => !(likeItem.post_id === postId && likeItem.user_id === ids)));
            } else {
                const response = await axios.post(`http://localhost:3000/api/like/store`, {
                    user_id: ids,
                    post_id: postId
                }, { headers });
                setLike((prevLikes) => [...prevLikes, { post_id: postId, user_id: ids }]);
            }
            // setCurrentImage((prevImage) => (prevImage === "image3" ? "image2" : "image3"));
            fetchData();
        } catch (error) {
            console.error("Kesalahan: ", error);
        }
    };

    const fetchData = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response1 = await axios.get(`http://localhost:3000/api/post/${id}`, { headers });
            const data1 = await response1.data.data;
            setPosts(data1);
            
            const response4 = await axios.get(`http://localhost:3000/api/auth/user/id/${id}`, { headers });
            const data4 = await response4.data.data;
            setPos(data4);

            const response2 = await axios.get(`http://localhost:3000/api/auth/user/${token}`, { headers });
            const data2 = await response2.data.data;
            setUser(data2);

            const response3 = await axios.get(`http://localhost:3000/api/like/`, {headers});
            const data3 = await response3.data.data;
            console.log(data3);
            setLike(data3);

        } catch (error) {
            console.error("Kesalahan: ", error);
        }
    };

    

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="bg-gray-100">
            {/* navbar */}
            <div className="w-full h-20 border border-slate-200 bg-white">
                <div className="absolute left-10 top-0">
                    <img src={b7Image} height={20} width={90} />
                </div>
                <div className="flex absolute right-12 top-6 gap-10">
                    <a className="font-semibold text-2xl font-sans" href="/home">Home</a>
                    <button className="font-semibold text-2xl font-sans" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            {/* navbar */}
            {/* profile */}
            <div className="flex">
                <div className="mx-auto w-3/4 md:w-4/5 lg:w-1/3 h-40 bg-white shadow p-6">
                    <div className="flex">
                        <div className="flex mx-auto">
                            <div className="w-20 h-20 rounded-full">
                                <img src={ urlUser + pos.photo } className="rounded-full aspect-square"/>
                            </div>
                            <a className="ml-4 text-2xl font-bold font-sans">{pos.nama}</a>
                        </div>
                    </div>
                    <span className="mx-auto mt-4 block w-full h-[1.2px] bg-gray-300" />
                </div>
            </div>
            {/* profile */} 
            {/* get all post by user_id */}
            {posts.map(post => (
                <div key={post.id} className="mt-2 w-3/4 md:w-4/5 lg:w-1/3 h-max shadow shadow-gray-300 bg-white p-3 rounded-md mx-auto mb-3">
                <button className="flex mt-2" onClick={() => handleProfileAll(post.user_id)}>
                    <div className="ml-2 w-12 h-12 rounded-full shadow">
                        <img src={ urlUser + post.photo } className="rounded-full w-40 aspect-square shadow hover:shadow-blue-500"/>
                    </div>
                    <h1 className="text-lg font-semibold ml-4 mt-1 hover:underline">{ post.nama }</h1>
                </button>
                <h5 className="mt-2 ml-3 mb-5">{ post.body }</h5>
                { post.photos ? (
                    <img src={url + post.photos} width={250} className="mx-auto shadow"/>
                ) : null }
                <div className="mt-8 ml-auto flex gap-6 w-max h-max">
                <button onClick={() => handleToggleImage(post.id, user.id)}>
                {like.some((likeItem) => likeItem.post_id === post.id && likeItem.user_id === user.id) ? (
                    <img src={image3} className="w-[40px] h-[40px]" />
                ) : (
                    <img src={image2} className="w-[40px] h-[40px]" />
                )}
                </button>
                <button>
                    <img src={image4} className="w-[35px] h-[35px]"/>
                </button>
                </div>
                {/* get all post by user_id */}
            </div>
            ))}
        </div>
    );
}

export default Profiles;
