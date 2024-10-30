import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi'; 
import { formatEther, parseEther } from 'viem';
import CustomModal from './customModal';
import { GeotrustContract } from '../Constant';
import { toast } from 'react-toastify';
import { usePropertyRefresh } from './PropertyRefresh';

const PropertyListing = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const {refreshTrigger} = usePropertyRefresh();
  
  const { address } = useAccount();
  const { writeAsync: buyLand } = useWriteContract();

  const { data: registeredData, propertiesData, refetch, error, isLoading } = useReadContract({
    address: GeotrustContract.address,
    abi: GeotrustContract.abi,
    functionName: 'getAllRegisteredLands', // Function to get all registered lands
    watch: true,
    args: [],
  });
  
  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  useEffect(() => {
    if (propertiesData) {
      setProperties(propertiesData);
    }
  }, [propertiesData]);

  useEffect(() => {
    if (registeredData) {
      setProperties(registeredData);
    }
    if (error) {
      toast.error('Error fetching properties: ' + error.message);
    }
  }, [registeredData, error]);

  const handleBuyProperty = async (property) => {
    try {
      await buyLand({
        address: GeotrustContract.address,
        abi: GeotrustContract.abi,
        functionName: 'buyLand', 
        args: [property.owner], // Update to appropriate args if needed
        overrides: {
          value: parseEther(property.price.toString()), // Ensure price is in string format
        },
      });
      toast.success('Transaction submitted! Please wait for confirmation.');
    } catch (error) {
      console.error('Error buying property:', error);
      toast.error('Error buying property: ' + error.message);
    }
  };

  const getIPFSImageUrl = (hash) => `https://ipfs.io/ipfs/${hash}`;

  const renderDocumentSection = (property) => {
    if (property.owner?.toLowerCase() === address?.toLowerCase()) {
      return (
        <a 
          href={getIPFSImageUrl(property.documentHash)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 inline-block"
        >
          View Property Documents
        </a>
      );
    }
    return (
      <p className="text-gray-600 mt-4">
        * Property documents will be available after purchase
      </p>
    );
  };

  const openModal = (property) => {
    setSelectedProperty(property);
    setShowImageModal(true);
  };

  return (
    <div className="property-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {properties.map((property, index) => (
        <div 
          key={index} 
          className="property-card bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img 
            src={getIPFSImageUrl(property.imageHash)} 
            alt={property.description}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => openModal(property)}
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{property.location}</h3>
            <p className="text-gray-600 mb-2">{property.description}</p>
            <p className="text-lg font-bold mb-2">Price: {formatEther(property.price)} ETH</p>
            <p className="mb-2">Rooms: {property.numberOfRooms}</p>
            <p className="mb-2 text-sm">Owner: {property.owner?.slice(0, 6)}...{property.owner?.slice(-4)}</p>
            <p className="mb-4">Status: {property.isVerified ? "Verified" : "Unverified"}</p>
            
            {/* Show Buy Property button if user does not own the property */}
            {address?.toLowerCase() !== property.owner?.toLowerCase() && (
              <button
                onClick={() => handleBuyProperty(property)}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Buy Property
              </button>
            )}
          </div>
        </div>
      ))}

      <CustomModal isVisible={showImageModal} onClose={() => setShowImageModal(false)}>
        {selectedProperty && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProperty.location}</h2>
            <img 
              src={getIPFSImageUrl(selectedProperty.imageHash)} 
              alt={selectedProperty.description}
              className="w-full h-auto mb-4 rounded"
            />
            <p className="mb-2">{selectedProperty.description}</p>
            <p className="text-lg font-bold mb-2">Price: {formatEther(selectedProperty.price)} ETH</p>
            <p className="mb-2">Number of Rooms: {selectedProperty.numberOfRooms}</p>
            <p className="mb-2">Owner: {selectedProperty.owner}</p>
            <p className="mb-4">Verified: {selectedProperty.isVerified ? "Yes" : "No"}</p>
            
            {renderDocumentSection(selectedProperty)}
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default PropertyListing;