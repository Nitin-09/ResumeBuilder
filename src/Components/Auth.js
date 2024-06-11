import React from 'react'
import Svg from "../assets/login.svg"
import Login from './Login'
import Signup from './Signup'
import { useParams } from 'react-router-dom'

function Auth(props) {
    const { user } = useParams();
    return (
        <>
            <div className='flex lg:flex-row flex-col justify-center overflow-hidden w-full px-10'>
                <div className='lg:w-[60vw] flex flex-col'>
                    <p className=' text-black text-xl lg:text-3xl font-oleo'>Unlock Your Career Potential: Log in to your Resume Forge account and take the next step towards your dream job.</p>
                    <img className="h-[30vh] lg:h-[70vh]" src={Svg} alt="" />
                </div>
                <div className='flex flex-col lg:w-[40vw]'>
                    <div className=''>
                        {user === 'existing' && <Login showAlert={props.showAlert}></Login>}
                        {user === 'new' && <Signup showAlert={props.showAlert}></Signup>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth
