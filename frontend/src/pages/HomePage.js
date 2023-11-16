import React, {useState, useEffect} from  "react";
import axios from "axios";

function HomePage(){
    return(
        <div className="w-full h-max bg-slate-100">
            <div className="mt-24 w-1/3 h-max p-3 mx-auto shadow shadow-gray-300 mb-3 rounded-md bg-white">
            <div className="flex mt-2">
                <div className="ml-3 w-10 h-10 rounded-full shadow">
                    <img src="images/user.png" className="rounded-full" width={40}/>
                    </div>
                    <h1 className="text-lg font-semibold ml-4">Mohammad Thoriq Bani Qintoro</h1>
                </div>
                <input className="mt-5 w-[100%] h-8 border rounded-full p-4" placeholder="Apa yang anda pikirkan hari ini?"/>
            </div>
            <div className="w-1/3 h-max shadow shadow-gray-300 bg-white p-3 rounded-md mx-auto mb-3">
                <div className="flex mt-2">
                    <div className="ml-2 w-10 h-10 rounded-full shadow">
                    <img src="images/user.png" className="rounded-full" width={40}/>
                    </div>
                    <h1 className="text-lg font-semibold ml-4">Mohammad Thoriq Bani Qintoro</h1>
                </div>
                <h5 className="mt-1 mb-5">Halo Guys kembali lagi bersama aku Thoriq orang paling ganteng sedunia gak ada lagi</h5>
                <img src="images/myfoto.jpg" width={250} className="mx-auto shadow"/>
                <div className="mt-8 ml-96 flex gap-4 w-max h-max">
                    <img src="images/unlove.png" width={25}/>
                    <img src="images/comment.png" width={25}/>
                </div>
            </div>
            <div className="w-1/3 h-max shadow shadow-gray-300 p-3 rounded-md mx-auto mb-3 bg-white">
                <div className="flex mt-2">
                    <div className="ml-3 w-10 h-10 rounded-full shadow">
                    <img src="images/user.png" className="rounded-full" width={40}/>
                    </div>
                    <h1 className="text-lg font-semibold ml-4">Akhmad Farizi Maulidan</h1>
                </div>
                <h5 className="mt-4 mb-3">Hari ini pernikahan antara Yoga dan Salwa. Semoga Sakinah, mawadah warahmah</h5>
                <img src="images/yoga.jpg" width={250} className="mx-auto shadow"/>
                <div className="mt-8 ml-96 flex gap-4 w-max h-max">
                    <img src="images/unlove.png" width={25}/>
                    <img src="images/comment.png" width={25}/>
                </div>
            </div>
        </div>
    );
}

export default HomePage;