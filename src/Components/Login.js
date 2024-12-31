import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login(props) {
    const [showPassword, setshowPassword] = useState(false);
    let navigate = useNavigate();
    const host = 'https://resumebuilderbackend.netlify.app/.netlify/functions';
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'all' });

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const response = await axios.post(
                `${host}/api/auth/login`,
                { email: data.username, password: data.password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.data.Status) {
                localStorage.setItem('token', response.data.authtoken);
                navigate('/');
                props.showAlert('Login Successful', 'success');
            } else {
                props.showAlert('Invalid credentials', 'danger');
            }
        } catch (error) {
            console.error('Axios Error:', error);
            if (error.response) {
                console.error('Response Data:', error.response.data);
                console.error('Response Status:', error.response.status);
            }
            // Handle other errors or display a more specific error message
            props.showAlert('An error occurred', 'danger');
        }
    };

    return (
        <form className='bg-white shadow rounded w-full p-10' onSubmit={handleSubmit(onSubmit)}>
            <p tabindex="0" className="focus:outline-none text-2xl font-extrabold leading-6 text-gray-800">Login to your account</p>
            <p tabindex="0" className="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500">Dont have account?
                <Link to='/auth/new' className="hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:underline hover:underline text-sm font-medium leading-none  text-gray-800 cursor-pointer"> Sign up here</Link></p>

            <span className='mt-3'>
                <label htmlFor="username" className="text-sm font-medium leading-none text-gray-800" >Email</label>
                <input
                    id="username"
                    type="email"
                    className="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    {...register("username",
                        {
                            required: "Please enter a valid username",
                        },)} />

                {errors["username"] && <span className="inline-block w-full text-red-600 text-xs ml-1">{errors["username"].message}</span>}
            </span>
            <span className='mt-6  w-full'>
                <label htmlFor="password" className="text-sm font-medium leading-none text-gray-800" >Password</label>
                <div className='relative flex items-center justify-center'>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                        {...register("password",
                            {
                                required: "Please enter a valid passowrd",
                            },)} />
                    <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                        <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg5.svg" alt="viewport" onClick={() => { showPassword ? setshowPassword(false) : setshowPassword(true) }} />
                    </div>
                </div>

                {errors["password"] && <span className="inline-block w-full text-red-600 text-xs ml-1">{errors["password"].message}</span>}
            </span>
            <a className='ml-1 col-span-2 text-base mb-3 text-blue-700 hover:underline hover:text-blue-900' href="/">Forget password?</a>
            <div className="mt-8">
                <input className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full" type="submit" value="Login" />
            </div>
        <div>
                <span>Test User detail || </span>
                <span>username : Test@gmail.com ||  </span>
                <span>password : test@</span>
            </div>
            {/* <div className="w-full flex items-center justify-between py-5">
                <hr className="w-full bg-gray-400" />
                <p className="text-base font-medium leading-4 px-2.5 text-gray-400">OR</p>
                <hr className="w-full bg-gray-400  " />
            </div> */}
            {/* <button className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full">
                <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" alt="google"/>
                    <p className="text-base font-medium ml-4 text-gray-700">Continue with Google</p>
            </button> */}
        </form>

    )
}

export default Login
