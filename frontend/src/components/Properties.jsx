import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import 'animate.css'; 
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { GeotrustContract } from '../Constant';
import { toast } from 'react-toastify';

const ExploreProperties = () => {
  const [properties, setProperties] = useState([]);
  const { address } = useAccount();
  
  
  const { data: registeredData, error } = useReadContract({
    address: GeotrustContract.address,
    abi: GeotrustContract.abi,
    functionName: 'getAllRegisteredLands',
    args: [],
  });

  useEffect(() => {
    if (registeredData) {
      const formattedProperties = registeredData.map((land) => ({
        location: land.location,
        documentHash: land.documentHash,
        price: land.price,
        isVerified: land.isVerified,
        owner: land.owner,
        description: land.description,
        imageHash: land.imageHash,
        numberOfRooms: land.numberOfRooms,
        tokenId: land.tokenId, 
      }));
      setProperties(formattedProperties);
    }
    if (error) {
      toast.error('Error fetching properties: ' + error.message);
    }
  }, [registeredData, error]);

  const { 
    data: purchaseLand,
     isSuccess,
     writeContract: buyLand,
     isLoading: buying,
     isError,
     } = useWriteContract();


  const handleBuyProperty = async (property) => {
    try {
      
      const tokenId = property.tokenId;
      const priceInEth = property.price; 

       buyLand({
        address: GeotrustContract.address,
        abi: GeotrustContract.abi,
        functionName: 'buyLand',
        args: [tokenId, priceInEth],
        overrides: {
          value: priceInEth, 
        },
      });
      
      toast.success('Transaction submitted! Please wait for confirmation.');
    } catch (error) {
      console.error('Error buying property:', error);
      toast.error('Error buying property: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 animate__animated animate__fadeIn">Explore Available Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden animate__animated animate__fadeInUp"
          >
            {/* <Carousel showThumbs={false} infiniteLoop autoPlay> */}
              <div>
                <img src={`https://ipfs.io/ipfs/${property.imageHash}`} alt={property.location} className="w-full h-64 object-cover" />
              </div>
            {/* </Carousel> */}
            {/* Property Info */}
            <div className="p-4">
              <h2 className="text-2xl font-semibold">{property.location}</h2>
              <p className="mt-2 text-gray-800 font-bold">{formatEther(property.price)} ETH</p>
              <p className="mt-4 text-gray-600">{property.description}</p>
              <button 
                onClick={() => handleBuyProperty(property)}
                className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Buy Property
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreProperties;
