'use client';
import React from 'react';
const ViewContact = ({ isOpen, onClose, contact }) => {
  if (!isOpen) return null;

  return (
    <div className="  z-50  absolute  flex items-center justify-center bg-amber-200 bg-opacity-50">
      <div className="bg-amber-200 rounded-2xl shadow-lg p-6 w-11/12 max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Contact Information</h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-base font-medium">{contact.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-base font-medium">{contact.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mobile</p>
            <p className="text-base font-medium">{contact.mobile}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContact;
