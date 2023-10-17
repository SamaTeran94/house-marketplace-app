import { useState } from "react"
import { Link } from "react-router-dom"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { toast } from "react-toastify"

import { BiSolidUser } from 'react-icons/bi'
import { RiLockPasswordFill } from 'react-icons/ri'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { BsFillArrowRightCircleFill } from 'react-icons/bs'

const ForgotPassword = () => {

    const [email, setEmail] = useState('')

    const onChange = (e) => {
        setEmail(e.target.value)

    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success('Email was sent')
        } catch (error) {
            toast.error('Could not send reset email')
        }
    }

    return (
        <div className="w-full flex justify-center">
            <div className=" w-10/12 mt-10">
                <h className="font-black text-2xl">Forgot Password</h>

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
                    <div className="flex justify-end text-accent font-bold">
                        <Link to='/sign-in'>
                            Sign In
                        </Link>
                    </div>
                    <div className="flex justify-between sm:justify-normal text-center items-center gap-5">
                        <p className="font-black">Send Reset Link</p>
                        <button>
                            <BsFillArrowRightCircleFill className=" text-accent font-bold text-3xl cursor-pointer" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
