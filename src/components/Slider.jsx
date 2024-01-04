import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config.jsx'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Spinner from './Spinner.jsx'

const Slider = () => {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {

        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q)

            let listings = []
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }

        fetchListings()
    }, [])

    if (loading) {
        return <Spinner />
    }

    return listings && (
        <>
            <p>Recommended</p>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                // pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
            >
                {listings.map(({ data, id }) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div className="w-full bg-red-200 h-96" style={{ background: `url(${data.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }}>

                            <p className="bg-black text-white p-1 text-xl absolute top-56 left-0 font-bold ">{data.name}</p>

                            <p className="bg-white text-black p-1 rounded-lg absolute top-72 text-base font-bold left-5">${data.discountedPrice ?? data.regularPrice}
                                {data.type === 'rent' && '/ month'}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}

export default Slider