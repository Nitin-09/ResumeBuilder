import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ResumeContext from '../context/Resume/ResumeContext';
import Logo from '../assets/logo.png'
import React, { useState } from 'react';
function Navbar() {
    const navigate = useNavigate();
    const { createEmptyResume } = useContext(ResumeContext);

    const handleCreateNewResume = async () => {
        const resumeId = await createEmptyResume();
        console.log(resumeId)
        if (resumeId) {
            // Redirect to the form with the newly created resume ID
            navigate(`/form/${resumeId}`);
        }
    };
    const [drawerState, setdrawerState] = useState(false)
    const [active, setactive] = useState("login")
    return (
        <div className='bg-pattern bg-cover bg-no-repeat tall:bg-contain lg:bg-cover'>
            <div className='relative z-50'>
                <div className='flex justify-between w-full lg:px-10'>
                    <Link to='/'><img className='h-[13vh] lg:h-[22vh]' src={Logo} alt="" /></Link>
                    {localStorage.getItem('token') ?
                        <button type='button' className='text-4xl text-white' onClick={() => { setdrawerState(true) }}><i className="fa-solid fa-bars"></i></button> :
                        <div className='flex items-center justify-center my-auto'>
                            <div className="w-fit rounded-xl m-5 shadow-sm">
                                <Link className={`px-4 py-2 rounded-l-xl m-0 ${active === 'login' ? "bg-[#5535df] hover:bg-[#270f91]  text-white" : "bg-neutral-50 hover:bg-neutral-200 text-black"} transition`} to='/auth/existing' onClick={() => { setactive("login") }}>Login</Link>
                                <Link className={`px-4 py-2 rounded-r-xl ${active === 'register' ? "bg-[#5535df] hover:bg-[#270f91] text-white" : "bg-neutral-50 hover:bg-neutral-200 text-black"} transition`} to='/auth/new' onClick={() => { setactive("register") }}>Register</Link>
                            </div>
                        </div>}
                </div>
                <div className={`flex h-screen top-0 absolute transition-transform ${drawerState ? "translate-x-0" : "translate-x-full"} duration-500`}>
                    <div className='bg-black w-[50vw] lg:w-[80vw] opacity-40' onClick={() => { setdrawerState(false) }}></div>
                    <div className='bg-white w-[50vw] lg:w-[20vw]'>
                        <div className='mx-4 justify-end flex'>
                            <button className='p-5 text-right text-2xl hover:text-blue-500' onClick={() => { setdrawerState(false) }}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <hr className='mx-3 border-b-2 border-black' />
                        <div className='flex flex-col p-2 gap-2 text-lg select-none'>
                            <Link to='/' className='cursor-pointer hover:bg-[#5535df] border-black hover:text-white hover:underline p-1'>Home</Link>
                            <Link to='/profiles' className='cursor-pointer hover:bg-[#5535df] border-black hover:text-white hover:underline p-1'>Profile</Link>
                            <button className='text-start cursor-pointer hover:bg-[#5535df] border-black hover:text-white hover:underline p-1' onClick={handleCreateNewResume}>
                                Create New Resume
                            </button>
                            <Link className='cursor-pointer hover:bg-[#5535df] border-black hover:text-white hover:underline p-1' to='/auth/existing' onClick={() => { localStorage.removeItem('token') }}>Logout</Link>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
