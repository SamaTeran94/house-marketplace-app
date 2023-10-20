import { useNavigate, useLocation } from "react-router-dom"
import { MdOutlineExplore, MdOutlineLocalOffer } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'

const Navbar = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
            return true
        }
    }

    return (
        <div className="w-full bg-base-200 p-3 flex justify-around items-center">
            <div className="text-center flex flex-col items-center">
                <MdOutlineExplore
                    className={pathMatchRoute('/') ? `text-dark text-3xl cursor-pointer` : `text-secondary text-3xl cursor-pointer`} onClick={() => navigate('/')} />
                <h1 className={pathMatchRoute('/') ? `text-dark` : `te text-secondary`}>Explore</h1>
            </div>
            <div className="text-center flex flex-col items-center">
                <MdOutlineLocalOffer
                    className={pathMatchRoute('/offers') ? `text-dark text-3xl cursor-pointer` : `text-secondary text-3xl cursor-pointer`}
                    onClick={() => navigate('/offers')} />
                <h1 className={pathMatchRoute('/offers') ? `text-dark` : `te text-secondary`}>Offers</h1>
            </div>
            <div className="text-center flex flex-col items-center">
                <CgProfile
                    className={pathMatchRoute('/profile') ? `text-dark text-3xl cursor-pointer` : `text-secondary text-3xl cursor-pointer`}
                    onClick={() => navigate('/profile')} />
                <h1 className={pathMatchRoute('/profile') ? `text-dark` : `te text-secondary`}>Profile</h1>
            </div>
        </div>

    )
}

export default Navbar
