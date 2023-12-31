import { useState } from "react"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { BiSolidUser } from 'react-icons/bi'
import { RiLockPasswordFill } from 'react-icons/ri'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { BsFillArrowRightCircleFill } from 'react-icons/bs'
import OAuth from '../components/OAuth.jsx'

const SignIn = () => {

    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData

    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredential = await signInWithEmailAndPassword(auth, email, password)

            if (userCredential.user)
                console.log(userCredential.user)
            navigate('/')

        } catch (error) {
            toast.error('Bad User Credentials')
        }
    }


    return (
        <>
            <div className="w-full flex justify-center">
                <div className=" w-10/12 mt-10">
                    <h className="font-black text-2xl">Welcome Back!</h>

                    <form onSubmit={onSubmit} className="flex flex-col gap-5 mt-5">
                        <div className="relative">
                            <BiSolidUser className="absolute h-5 w-5 left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                id="email"
                                onChange={onChange}
                                className="pl-8 border border-black rounded-lg w-full"
                            />
                        </div>
                        <div className="relative">
                            <RiLockPasswordFill className="absolute h-5 w-5 left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                id="password"
                                onChange={onChange}
                                className="pl-8 pr-8 w-full border border-black rounded-lg"
                            />
                            {showPassword ? (
                                <AiFillEye
                                    className="absolute h-5 w-5 right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                    onClick={() => setShowPassword((prevState) => !prevState)}
                                />
                            ) : (
                                <AiFillEyeInvisible
                                    className="absolute h-5 w-5 right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                    onClick={() => setShowPassword((prevState) => !prevState)}
                                />
                            )}
                        </div>
                        <div className="flex justify-end text-accent font-bold">
                            <Link to='/forgot-password'>
                                Forgot Password
                            </Link>
                        </div>
                        <div>
                            <div className="flex justify-between sm:justify-normal text-center items-center gap-5">
                                <p className="font-black">Sign in</p>
                                <button>
                                    <BsFillArrowRightCircleFill className=" text-accent font-bold text-3xl cursor-pointer" />
                                </button>
                            </div>
                            <OAuth />
                        </div>
                        <div className="flex justify-center">
                            <Link to='/sign-up' className="text-accent font-bold">Sign Up Instead</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignIn
