'use client';

import { useState } from 'react';

interface PropertyDetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function PropertyDetailsStep({
  formData,
  updateFormData,
  onNext,
  onCancel,
}: PropertyDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [addressValidated, setAddressValidated] = useState(false);

  const validatePostcode = (postcode: string): boolean => {
    // UK postcode regex pattern
    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    return postcodeRegex.test(postcode.trim());
  };

  const handleValidateAddress = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress = 'Property address is required';
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postcode is required';
    } else if (!validatePostcode(formData.postcode)) {
      newErrors.postcode = 'Please enter a valid UK postcode';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsValidatingAddress(true);
    setErrors({});

    // Simulate address validation API call
    setTimeout(() => {
      setIsValidatingAddress(false);
      setAddressValidated(true);
    }, 1000);
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.licenseType) {
      newErrors.licenseType = 'Please select a license type';
    }
    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress = 'Property address is required';
    }
    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postcode is required';
    } else if (!validatePostcode(formData.postcode)) {
      newErrors.postcode = 'Please enter a valid UK postcode';
    }
    if (!addressValidated) {
      newErrors.addressValidation = 'Please validate the address before continuing';
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Please select a property type';
    }
    if (!formData.numberOfBedrooms) {
      newErrors.numberOfBedrooms = 'Number of bedrooms is required';
    }
    if (!formData.numberOfOccupants) {
      newErrors.numberOfOccupants = 'Number of occupants is required';
    }
    if (!formData.landlordName.trim()) {
      newErrors.landlordName = 'Landlord name is required';
    }
    if (!formData.landlordEmail.trim()) {
      newErrors.landlordEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.landlordEmail)) {
      newErrors.landlordEmail = 'Please enter a valid email address';
    }
    if (!formData.landlordPhone.trim()) {
      newErrors.landlordPhone = 'Phone number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Property Details</h2>

      <div className="space-y-6">
        {/* License Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            License Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.licenseType}
            onChange={(e) => updateFormData({ licenseType: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.licenseType ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select license type</option>
            <option value="Mandatory HMO License">Mandatory HMO License</option>
            <option value="Selective License">Selective License</option>
            <option value="Additional HMO License">Additional HMO License</option>
          </select>
          {errors.licenseType && (
            <p className="mt-1 text-sm text-red-500">{errors.licenseType}</p>
          )}
        </div>

        {/* Property Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Property Address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.propertyAddress}
            onChange={(e) => {
              updateFormData({ propertyAddress: e.target.value });
              setAddressValidated(false);
            }}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.propertyAddress ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter full property address"
          />
          {errors.propertyAddress && (
            <p className="mt-1 text-sm text-red-500">{errors.propertyAddress}</p>
          )}
        </div>

        {/* Postcode */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Postcode <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => {
                updateFormData({ postcode: e.target.value.toUpperCase() });
                setAddressValidated(false);
              }}
              className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.postcode ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="e.g., SW1A 1AA"
            />
            <button
              type="button"
              onClick={handleValidateAddress}
              disabled={isValidatingAddress}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isValidatingAddress ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Validating...
                </>
              ) : addressValidated ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Validated
                </>
              ) : (
                'Validate Address'
              )}
            </button>
          </div>
          {errors.postcode && (
            <p className="mt-1 text-sm text-red-500">{errors.postcode}</p>
          )}
          {errors.addressValidation && (
            <p className="mt-1 text-sm text-red-500">{errors.addressValidation}</p>
          )}
          {addressValidated && (
            <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Address validated successfully
            </p>
          )}
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => updateFormData({ propertyType: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.propertyType ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select property type</option>
            <option value="House">House</option>
            <option value="Flat">Flat</option>
            <option value="Maisonette">Maisonette</option>
            <option value="Bungalow">Bungalow</option>
            <option value="HMO">HMO (House in Multiple Occupation)</option>
          </select>
          {errors.propertyType && (
            <p className="mt-1 text-sm text-red-500">{errors.propertyType}</p>
          )}
        </div>

        {/* Number of Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Number of Bedrooms <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.numberOfBedrooms}
            onChange={(e) => updateFormData({ numberOfBedrooms: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.numberOfBedrooms ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="e.g., 3"
          />
          {errors.numberOfBedrooms && (
            <p className="mt-1 text-sm text-red-500">{errors.numberOfBedrooms}</p>
          )}
        </div>

        {/* Number of Occupants */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Number of Occupants <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.numberOfOccupants}
            onChange={(e) => updateFormData({ numberOfOccupants: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.numberOfOccupants ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="e.g., 4"
          />
          {errors.numberOfOccupants && (
            <p className="mt-1 text-sm text-red-500">{errors.numberOfOccupants}</p>
          )}
        </div>

        {/* Landlord Details Section */}
        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Landlord Details</h3>

          <div className="space-y-6">
            {/* Landlord Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.landlordName}
                onChange={(e) => updateFormData({ landlordName: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.landlordName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.landlordName && (
                <p className="mt-1 text-sm text-red-500">{errors.landlordName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.landlordEmail}
                onChange={(e) => updateFormData({ landlordEmail: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.landlordEmail ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.landlordEmail && (
                <p className="mt-1 text-sm text-red-500">{errors.landlordEmail}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.landlordPhone}
                onChange={(e) => updateFormData({ landlordPhone: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.landlordPhone ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="e.g., 07123 456789"
              />
              {errors.landlordPhone && (
                <p className="mt-1 text-sm text-red-500">{errors.landlordPhone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Next: Upload Documents
        </button>
      </div>
    </div>
  );
}

