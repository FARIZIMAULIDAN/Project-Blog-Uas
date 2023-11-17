import React, {useState, useEffect} from  "react";
import axios from "axios";

function Login(){
    return(
        <div className="w-full h-screen flex font-sans">
            <div className="mt-36 w-9/12 md:w-3/4 lg:w-1/4 h-max p-5 mx-auto shadow shadow-slate-500 rounded-lg">
                <div className="mb-2">
                    <a className="text-xl font-semibold">Login</a>
                </div>
                <span className="w-full h-[1.75px] bg-black block" />
                <div className="w-full mt-10">
                    <div className="mb-5">
                        <input className="w-full h-8 p-4 rounded-xl border border-black" placeholder="Email address" type="text"/>
                    </div>
                    <div className="mb-10">
                        <input className="w-full h-8 p-4 rounded-xl border border-black" placeholder="Password" type="password"/>
                    </div>
                    <div className="mb-10 flex">
                        <button className="mx-auto w-24 h-10 bg-blue-400 font-sans text-white text-xl font-bold rounded-2xl border border-black hover:bg-blue-600 duration-100 ease-out">Login</button>
                    </div>
                    <span className="w-full h-[1.75px] bg-black block" />
                    <div>
                        <h1>Doesn't have account? <a className="text-blue-300 hover:text-blue-500 duration-100 ease-out" href="/Register">Click here</a> to register</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login