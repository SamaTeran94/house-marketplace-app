import { Link } from 'react-router-dom'
import rentImg from '../assets/rentCategoryImage.jpg'
import sellImg from '../assets/sellCategoryImage.jpg'
import Slider from '../components/Slider'

const Explore = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-11/12 mt-5" >
                <header className="text-3xl font-black mb-10">
                    <p>Explore</p>
                </header>

                <Slider />

                <p className='font-bold text-xl mb-5 mt-10  '>Categories</p>
                <div className="flex gap-5 mb-12">
                    <div>
                        <Link to='/category/rent'>
                            <img
                                className='rounded-3xl w-96 h-full'
                                src={rentImg}
                                alt='rent' />
                        </Link>
                        <p className='font-semibold'>Places for rent</p>
                    </div>
                    <div>
                        <Link to='/category/sale'>
                            <img
                                className='rounded-3xl w-96 h-full'
                                src={sellImg}
                                alt='sale' />
                        </Link>
                        <p className='font-semibold'>Places for sale </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Explore
