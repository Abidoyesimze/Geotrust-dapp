// src/components/CustomModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomModal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
        >
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 float-right"
          >
            &times;
          </button>
          <div className="mt-2">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomModal;
