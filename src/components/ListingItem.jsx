/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import { MdBedroomParent, MdBathtub, MdDeleteForever } from 'react-icons/md'


const ListingItem = ({ listing, id, onDelete }) => {
    return (

        <div>
            <div className="flex gap-5">
                <Link to={`/category/${listing.type}/${id}`}>
                    <img
                        className='rounded-3xl w-44 lg:w-60'
                        src={listing.imageUrls[0]}
                        alt={listing.name}>
                    </img>
                </Link>
                <div className="flex flex-col justify-center">
                    <div className="flex gap-2 items-center">
                        <p className="font-semibold text-sm sm:text-base md:text-lg lg:text-base xl:text-xl">{listing.location}</p>
                        {onDelete && (
                            <MdDeleteForever className="text-xl cursor-pointer" onClick={() => onDelete(listing.id, listing.name)} />
                        )}
                    </div>
                    <p className="font-black  text-sm sm:text-base md:text-lg lg:text-base xl:text-xl">{listing.name}</p>
                    <p className="text-accent font-bold  text-sm sm:text-base md:text-lg lg:text-base xl:text-xl">${listing.offer ? listing.discountedPrice?.toLocaleString() : listing.regularPrice?.toLocaleString()}{listing.type === 'rent' && ' / Month'}</p>
                    <div className="flex items-center gap-2 font-semibold  text-sm sm:text-base md:text-lg lg:text-base xl:text-xl">
                        <MdBedroomParent /> {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `${listing.bedrooms}bedroom`}
                        <MdBathtub /> {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` :
                            `${listing.bathrooms}Bathroom`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingItem
