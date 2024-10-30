import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWriteContract, useTransaction } from 'wagmi';
import { GeotrustContract } from '../Constant';
import { pinata } from '../utils/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePropertyRefresh } from './PropertyRefresh';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
    const navigate = useNavigate();
  // Get the refresh function from context
  const { refreshProperties } = usePropertyRefresh();

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ipfsHashes, setIpfsHashes] = useState({
    documentHash: '',
    imageHash: '',
  });
  const [propertyDetails, setPropertyDetails] = useState({
    location: '',
    description: '',
    price: '',
    numberOfRooms: '',
  });

  const handleFileChange = (event, type) => {
    const file = event.target.files[0] || null;
    if (type === 'document') setSelectedDocument(file);
    if (type === 'image') setSelectedImage(file);
  };

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const { location, description, price, numberOfRooms } = propertyDetails;
    if (!location || !description || !price || !numberOfRooms) {
      toast.error('All fields are required.');
      return false;
    }
    if (parseFloat(price) <= 0) {
      toast.error('Price must be a positive value.');
      return false;
    }
    if (!selectedDocument) {
      toast.error('Please upload the property document.');
      return false;
    }
    if (!selectedImage) {
      toast.error('Please upload a property image.');
      return false;
    }
    return true;
  };

  const handleUpload = async (file, type) => {
    try {
      const upload = await pinata.upload.file(file);
      setIpfsHashes((prev) => ({
        ...prev,
        [`${type}Hash`]: upload.IpfsHash,
      }));
      toast.success(`${type === 'document' ? 'Document' : 'Image'} uploaded to ipfs successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${type}. Please try again.`);
      console.error(error);
    }
  };

  const {
    data: registerData,
    isSuccess,
    writeContract: registerLand,
    isLoading: registering,
    error: registerError,
  } = useWriteContract();

  const handleRegisterProperty = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      registerLand({
        address: GeotrustContract.address,
    abi: GeotrustContract.abi,
    functionName: 'registerLand',
        args: [
          propertyDetails.location,
          propertyDetails.description,
          ipfsHashes.documentHash,
          propertyDetails.price,
          ipfsHashes.imageHash,
          propertyDetails.numberOfRooms,
        ],
      });
      toast.success('Transaction initiated! Waiting for confirmation...');
    } catch (error) {
      toast.error('Failed to register the property. Please try again.');
      console.error(error);
    }
  };

  const { status } = useTransaction({
    hash: registerData?.hash,
    onSuccess() {
      toast.success('Property registered successfully!');
      refreshProperties();

      setTimeout(() => {
        navigate('/properties');
      }, 2000);
    },
    onError(error) {
      toast.error('Transaction failed. Please try again.');
      console.error(error);
    },
  });

  useEffect(() => {
    if (registerError) console.log(registerError);
  }, [registerError]);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 className="text-4xl font-bold text-center mb-8">Add New Property</motion.h1>

        <motion.form className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleRegisterProperty}>
          <div className="mb-4">
            <label className="block text-gray-700">Property Location</label>
            <input type="text" name="location" value={propertyDetails.location} onChange={handlePropertyChange} className="w-full p-3 border rounded-lg" required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea name="description" value={propertyDetails.description} onChange={handlePropertyChange} className="w-full p-3 border rounded-lg" required />
          </div>

          {/* Document Upload */}
          <div className="mb-4">
            <label className="block text-gray-700">Property Document</label>
            <input type="file" onChange={(e) => handleFileChange(e, 'document')} className="w-full p-3 border rounded-lg" required />
            <motion.button
              type="button"
              onClick={() => handleUpload(selectedDocument, 'document')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 mt-2"
              disabled={!selectedDocument}
            >
              Upload Document
            </motion.button>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700">Property Image</label>
            <input type="file" onChange={(e) => handleFileChange(e, 'image')} className="w-full p-3 border rounded-lg" required />
            <motion.button
              type="button"
              onClick={() => handleUpload(selectedImage, 'image')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 mt-2"
              disabled={!selectedImage}
            >
              Upload Image
            </motion.button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input type="text" name="price" value={propertyDetails.price} onChange={handlePropertyChange} className="w-full p-3 border rounded-lg" required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Number of Rooms</label>
            <input type="number" name="numberOfRooms" value={propertyDetails.numberOfRooms} onChange={handlePropertyChange} className="w-full p-3 border rounded-lg" required />
          </div>

          
          <motion.button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={!ipfsHashes.documentHash || !ipfsHashes.imageHash || registering || status === 'pending'}
          >
            Register Property
          </motion.button>
        </motion.form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddProperty;
