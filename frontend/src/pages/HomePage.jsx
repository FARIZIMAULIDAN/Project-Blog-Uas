import image1 from "../images/b7.png";
import image2 from "../images/unlove.png";
import image3 from "../images/love.png";
import image4 from "../images/comment.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function HomePage(){
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [posts, setPosts] = useState([]);
    const [like, setLike] = useState([]);
    const [users, setUsers] = useState([]);
    const [post, setPost] = useState('');
    const [user, setUser] = useState(1);
    const [idPost, setIdPost] = useState(1);
    const [body, setBody] = useState('');
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const token = localStorage.getItem('token');
    const [photos, setPhotos] = useState(null);
    const [validation, setValidation] = useState({});
    const url = "http://localhost:3000/static/";
    const urlUser = "http://localhost:3000/userPhotos/";
    const [currentImage, setCurrentImage] = useState("image2");
    const [selectedPost, setSelectedPost] = useState(null);

    

    const handleToggleImage = async (postId, id) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const a = like.some((likeItem) => likeItem.post_id === postId && likeItem.user_id === id);
            if (like.some((likeItem) => likeItem.post_id === postId && likeItem.user_id === id)) {
                await axios.delete(`http://localhost:3000/api/like/delete/${postId}`, { headers });
                setLike((prevLikes) => prevLikes.filter((likeItem) => !(likeItem.post_id === postId && likeItem.user_id === id)));
            } else {
                const response = await axios.post(`http://localhost:3000/api/like/store`, {
                    user_id: id,
                    post_id: postId
                }, { headers });
                setLike((prevLikes) => [...prevLikes, { post_id: postId, user_id: id }]);
            }
            fectData();
        } catch (error) {
            console.error("Kesalahan: ", error);
        }
    };    

    const handleLogout = () => {
        localStorage.removeItem('token');
        console.log('berhasil logout');
        navigate('/');
        window.location.reload();
    };

    // const handleProfile = () => {
    //     navigate(`/profile/${user.id}`);
    //     window.location.reload();
    // };

    // const handleProfileAll = (userId) => {
    //     navigate(`/profiles/${userId}`);
    //     window.location.reload();
    // };
    
    const fectData = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response1 = await axios.get(`http://localhost:3000/api/post/`, {headers});
            const data1 = await response1.data.data;
            setPosts(data1);
            
            const response2 = await axios.get(`http://localhost:3000/api/auth/user/${token}`, {headers});
            const data2 = await response2.data.data;
            setUser(data2);
            
            const response3 = await axios.get(`http://localhost:3000/api/like/`, {headers});
            const data3 = await response3.data.data;
            setLike(data3);

            const response4 = await axios.get(`http://localhost:3000/api/auth/user/${token}`, {headers});
            const data4 = await response4.data.data;
            setUsers(data4);

            // const response3 = await axios.get(`http://localhost:3000/api/post/`, {headers});
            // const data3 = await response3.data.data;
            // setPost(data3);
        } catch (error) {
            console.error("Kesalahan: ", error);
        }
    };

    
    const handlePhotosChange = (e) => {
        const file = e.target.files[0];
        setPhotos(file);
    };
        
    const handlePost = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append("user_id", user.id);
        formData.append("body", body);
        formData.append("photos", photos);
        try {
            await axios.post("http://localhost:3000/api/post/store", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate("/home");
            fectData();
            window.location.reload();
        } catch (error) {
            console.error("Kesalahan: ", error);
            setValidation(error.response.data);
        }
    };
    
    const handleToggleCommentModal = async (postId) => {
        setSelectedPost(postId);
        setShow(true);

        if (postId) {
            const response5 = await axios.get(`http://localhost:3000/api/comment/${postId}`);
            const data5 = await response5.data.data;
            setComments(data5);
        }
    };
    
    const handleToggleCloseCommentModal = async () => {
        setShow(false);
    };
    
    const handleCommentChange = (e) => {
        setComment(e.target.value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = await axios.post("http://localhost:3000/api/comment/store", {
                user_id : user.id,
                comments : comment,
                post_id : selectedPost,
              }, { headers });
            navigate("/home");
            fectData();
            setShow(false);
        } catch (error) {
            console.error("Kesalahan: ", error);
            setValidation(error.response.data);
        }
    };

    useEffect(() => {
        fectData();
    }, []);
    
    return(
        <div className="bg-gray-100">
            {/* navbar */}
            <div className="w-full h-20 shadow bg-white">
                <div className="absolute left-10 top-0">
                    <img src={image1} height={20} width={90} />
                </div>
                <div className="flex absolute right-12 top-6 gap-10">
                    <a className="font-semibold text-2xl font-sans" href="/home">Home</a>
                    <button className="font-semibold text-2xl font-sans" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            {/* navbar */}
            {/* create post */}
            <div className="mt-4 w-5/6 md:w-4/5 lg:w-1/3 h-max p-2 mx-auto shadow shadow-gray-300 mb-3 rounded-md bg-white">
                <button className="flex">
                    <div className="ml-3 w-12 h-12 rounded-full hover:shadow-blue-500 shadow">
                        <img src={urlUser + user.photo} className="rounded-full w-40 aspect-square"/>
                    </div>
                    <a className="text-lg font-semibold ml-4 mt-1 hover:underline">{ user.nama }</a>
                </button>
                <input className="mt-5 w-[100%] h-8 border border-black rounded-full p-4" placeholder="Apa yang anda pikirkan hari ini?" value={body} onChange={(e) => setBody(e.target.value)}/>
                <input className="w-[100%] mt-5 font-sans text-white text-md font-bold rounded-2xl border border-black ease-out mx-auto" type="file" accept="image/*"  onChange={handlePhotosChange} />
                <div className="flex">
                    <button className="w-20 h-8 px-2 mt-5 bg-blue-400 font-sans text-white text-md font-bold rounded-2xl border border-black hover:bg-blue-600 duration-100 ease-out mx-auto" onClick={handlePost}>Posting</button>
                </div>
            </div>
            {/* create post */}
            {/* get all post */}
            {posts.map((pos) => (
            <div key={pos.id} className="w-3/4 md:w-4/5 lg:w-1/3 h-max shadow shadow-gray-300 bg-white p-3 rounded-md mx-auto mb-3">
                <button className="flex mt-2" >
                    <div className="ml-2 w-12 h-12 rounded-full shadow">
                        <img src={ urlUser + pos.photo } className="rounded-full w-40 aspect-square shadow hover:shadow-blue-500"/>
                    </div>
                    <h1 className="text-lg font-semibold ml-4 mt-1 hover:underline">{ pos.nama }</h1>
                </button>
                <h5 className="mt-2 ml-3 mb-5">{ pos.body }</h5>
                { pos.photos ? (
                    <img src={url + pos.photos} width={250} className="mx-auto shadow"/>
                ) : null }
                <div className="mt-8 ml-auto flex gap-6 w-max h-max">
                <button onClick={() => handleToggleImage(pos.id, user.id)}>
                {like.some((likeItem) => likeItem.post_id === pos.id && likeItem.user_id === user.id) ? (
                    <img src={image3} className="w-[42px] h-[42px]" />
                ) : (
                    <img src={image2} className="w-[40px] h-[40px]" />
                )}
                </button>
                <button onClick={() => handleToggleCommentModal(pos.id)}>
                    <img src={image4} className="w-[35px] h-[35px]"/>
                </button>
                </div>
            </div>
            ))}
            {/* get all post */}
            {/* show and create comments */}
            { show ? (
                <>
                    <div className="fixed top-0 bg-black bg-opacity-40 w-full h-screen ">
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md w-5/6 md:w-4/5 lg:w-1/3">
                            <h2 className="text-xl font-semibold mb-4">Comments</h2>
                            {/* Display comments for the selected post */}
                            {comments.map((commen) => (
                                <>
                                <div className="w-max h-max px-4 py-1 bg-gray-100 mb-2 rounded-md">
                                    <div className="flex gap-3">
                                        <img src={ urlUser + commen.photo } className="rounded-full w-10 aspect-square shadow hover:shadow-blue-500"/>
                                        <a className="font-semibold">{commen.nama}</a>
                                    </div>
                                    <div key={commen.id} className="ml-14">
                                        <p>{commen.comments}</p>
                                    </div>
                                </div>
                                </>
                            ))}
                        {/* Create comment form */}
                        <form onSubmit={handleSubmit}>
                            <input
                                className="w-full h-10 p-2 border border-gray-300 rounded-md mb-4"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={handleCommentChange}
                            />
                            <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded-md">
                                Add Comment
                            </button>
                        </form>
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={handleToggleCloseCommentModal} >
                            Close
                        </button>
                        </div>
                    </div>
                </>
            ) : null }
            {/* show and create comments */}
        </div>
    );
}

export default HomePage;