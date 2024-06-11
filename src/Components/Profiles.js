import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ResumeContext from "../context/Resume/ResumeContext.js";
import { useState } from 'react';

function Profiles() {
    let navigate = useNavigate()
    const context = useContext(ResumeContext)
    const [resumeData, setresumeData] = useState([])
    const { fetchAllResume,deleteResume } = context
    useEffect(() => {
        fetchAllResume()
            .then((data) => {
                console.log(data)
                setresumeData(data);
            })
            .catch((error) => {
                console.error('Error fetching resume:', error);
            });
    }, []);
    const handleDelete = (resumeId) => {
        deleteResume(resumeId)
            .then(() => {
                setresumeData((prevData) => prevData.filter((resume) => resume._id !== resumeId));
            })
            .catch((error) => {
                console.error('Error deleting resume:', error);
            });
    };
    useEffect(() => {
    }, [resumeData])
    

    return (
        <div className='flex flex-wrap justify-center gap-5 h-full bg-gradient-to-r from-[#5134df] to-[#c056e7] p-5 lg:p-10 overflow-hidden'>
            {
                resumeData?.map((element, index) => {
                    {console.log("hello")}
                    return (
                        <section className="w-[25%] mx-auto bg-[#0b2d54] rounded-2xl px-8 py-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <span class="text-gray-400 text-sm">{element?.date.substring(0,10)}</span>
                                <span class="text-emerald-400 flex gap-2">
                                    <button className='hover:underline' onClick={() => { navigate(`/form/${element?._id}`)}}>Edit Resume</button>
                                    <button className='hover:underline ml-2 text-red-500' onClick={() => handleDelete(element?._id)}>Delete</button>
                                </span>
                            </div>
                            <div className="mt-6 w-fit mx-auto">
                                <img src={element?.data?.PERSONALDETAIL?.photo?element?.data?.PERSONALDETAIL?.photo:"../profile.jpg"} class="rounded-full w-40 h-40 " alt="" />
                            </div>

                            <div className="mt-8 ">
                                <h2 class="text-white font-bold text-lg tracking-wide">{element?.data?.PERSONALDETAIL?.name}</h2>
                                <h2 class="text-white font-bold text-sm tracking-wide">{element?.data?.PERSONALDETAIL?.email}</h2>

                            </div>
                            <div className='w-full flex justify-center mt-4'>
                            <button onClick={() => { navigate(`/resume/${element?._id}`)}} className='bg-green-400 p-2 rounded-lg'>View Resume</button>
                            </div>

                        </section>
                    )
                })
            }
        </div>
    )
}

export default Profiles