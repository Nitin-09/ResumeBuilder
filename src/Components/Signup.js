import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function SignUp(props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [Otp, setOtp] = useState(0);
    let navigate = useNavigate();
    const host = 'https://resumeforgebkend.netlify.app/.netlify/functions';

    const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'all' });

    const onSubmit = async (data) => {
        const response = await fetch(`${host}/api/auth/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: data.name, email: data.username, password: data.password }),
        });
        const json = await response.json();
        if (json.Status) {
            localStorage.setItem('token', json.authtoken);
            navigate('/tempelates');
            props.showAlert('SignUp Sucessfull', 'Succes');
        } else {
            props.showAlert('Invalid credentials', 'danger');
        }
    };
    const sendOtp = async () => {
        const username = watch('username');

        if (username && !errors.username) {
            setLoading(true);

            try {
                const response = await fetch(`${host}/api/auth/getOtp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: username }),
                });

                const json = await response.json();

                setLoading(false);

                if (json.Status) {
                    setOtp(json.OTP);
                    props.showAlert('OTP sent successfully', 'Success');
                } else {
                    response.status === 400
                        ? props.showAlert('Email address already exists', 'danger')
                        : props.showAlert('Some error occurred.', 'danger');
                }
            } catch (error) {
                setLoading(false);
                console.error('Error sending OTP:', error);
                props.showAlert('Error sending OTP', 'danger');
            }
        } else {
            props.showAlert('Please enter a valid email address', 'danger');
        }
    };

    return (
        <form className='bg-white shadow rounded w-full p-7' onSubmit={handleSubmit(onSubmit)}>
            <p tabindex="0" className="focus:outline-none text-2xl font-extrabold leading-6 text-gray-800">Signup to your account</p>
            <span className=''>
                < label htmlFor="name" className="text-sm font-medium leading-none text-gray-800" >Name</label>
                <input
                    id="name"
                    type="text"
                    className="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    {...register("name",
                        {
                            required: "Name is a required field",
                            pattern:
                            {
                                value: new RegExp("[A-Za-z/s]{3,}"),
                                message: "Name must be at least 3 characters long"
                            },
                        },)} />

                {errors["name"] && <span className="inline-block w-full text-red-600 text-xs ml-1">{errors["name"].message}</span>}
            </span>
            <span className=''>
                < label htmlFor="username" className="text-sm font-medium leading-none text-gray-800" >Email</label>
                <input
                    id="username"
                    type="email"
                    className="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    {...register("username",
                        {
                            required: "Please enter a valid username",
                            pattern:
                            {
                                value: new RegExp("[\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$"),
                                message: "Please enter a valid email address"
                            },
                        },)} />

                {errors["username"] && <span className="inline-block w-full text-red-600 text-xs ml-1">{errors["username"].message}</span>}
            </span>
            <span className=''>
                <label htmlFor="otp" className="text-sm font-medium leading-none text-gray-800">OTP</label>
                <div className='relative flex items-center justify-center'>
                    <input
                        id="otp"
                        type="number"
                        className='bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
                        {...register("otp", {
                            required: "OTP cannot be blank",
                            pattern: {
                                value: new RegExp("(^\\d{6}$)"),
                                message: "Please enter a valid six-digit OTP",
                            },
                            validate: (val) => {
                                if (parseInt(val) !== Otp) {
                                    return "OTP invalid!";
                                }
                            },
                        })}
                    />
                    <div className="absolute right-0 mt-2 cursor-pointer">
                        <input
                            disabled={loading}
                            className={`${loading ? 'bg-gray-500 cursor-not-allowed' : 'hover:bg-blue-600 font-bold'
                                } cursor-pointer text-white border-2 border-black bg-black py-2 px-4 focus:outline-none focus:ring-0 rounded-tr-xl rounded-br-lg w-full`}
                            type="button"
                            onClick={sendOtp}
                            value={loading ? 'Sending...' : 'Get OTP'}
                        />
                    </div>
                </div>
                {errors["otp"] && <span className="inline-block w-full text-red-600 text-xs ml-1">{errors["otp"].message}</span>}
            </span>
            <span className='w-full'>
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
                        <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg5.svg" alt="viewport" onClick={() => { showPassword ? setShowPassword(false) : setShowPassword(true) }} />
                    </div>
                </div>

                {errors["password"] && <span className="inline-block w-full text-red-600 text-xs ml-1">{errors["password"].message}</span>}
            </span>
            <span className='w-full'>
                < label htmlFor="confirmPassword" className="text-sm font-medium leading-none text-gray-800" >Confirm Password</label>
                <div className='relative flex items-center justify-center'>
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                        {...register("confirmPassword",
                            {
                                required: "Password cannot be blank",
                                validate: (val) => {
                                    if (watch('password') !== val) {
                                        return "Your passwords do no match";
                                    }
                                },
                            },)} />
                    <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                        <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg5.svg" alt="viewport" onClick={() => { showConfirmPassword ? setShowConfirmPassword(false) : setShowConfirmPassword(true) }} />
                    </div>
                </div>

                {errors["confirmPassword"] && <span className="inline-block w-full text-red-600 text-xs ml-1">{errors["confirmPassword"].message}</span>}
            </span>
            <div className="mt-8">
                <input className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full" type="submit" value="Create my account" />
            </div>
            {/* <div className="w-full flex items-center justify-between py-5">
                <hr className="w-full bg-gray-400" />
                <p className="text-base font-medium leading-4 px-2.5 text-gray-400">OR</p>
                <hr className="w-full bg-gray-400  " />
            </div>
            <button className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full">
                <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" alt="google" />
                <p className="text-base font-medium ml-4 text-gray-700">Continue with Google</p>
            </button> */}
        </form>
    )
}
export default SignUp
