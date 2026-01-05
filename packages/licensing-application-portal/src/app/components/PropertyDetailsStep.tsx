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
      newErrors.propertyAddress = 'Enter the property address';
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Enter a postcode';
    } else if (!validatePostcode(formData.postcode)) {
      newErrors.postcode = 'Enter a postcode in the correct format';
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
      newErrors.licenseType = 'Select a licence type';
    }
    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress = 'Enter the property address';
    }
    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Enter a postcode';
    } else if (!validatePostcode(formData.postcode)) {
      newErrors.postcode = 'Enter a postcode in the correct format';
    }
    if (!addressValidated) {
      newErrors.addressValidation = 'Validate the address before continuing';
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Select a property type';
    }
    if (!formData.numberOfBedrooms) {
      newErrors.numberOfBedrooms = 'Enter the number of bedrooms';
    }
    if (!formData.numberOfOccupants) {
      newErrors.numberOfOccupants = 'Enter the number of occupants';
    }
    if (!formData.landlordName.trim()) {
      newErrors.landlordName = 'Enter your full name';
    }
    if (!formData.landlordEmail.trim()) {
      newErrors.landlordEmail = 'Enter an email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.landlordEmail)) {
      newErrors.landlordEmail = 'Enter an email address in the correct format, like name@example.com';
    }
    if (!formData.landlordPhone.trim()) {
      newErrors.landlordPhone = 'Enter a phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div>
      <h2 className="govuk-heading-l">Property details</h2>

      {/* License Type */}
      <div className={`govuk-form-group ${errors.licenseType ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="licenseType">
          Licence type
        </label>
        <span className="govuk-hint">
          Select the type of licence you need for this property
        </span>
        {errors.licenseType && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.licenseType}
          </p>
        )}
        <select
          id="licenseType"
          className={`govuk-select ${errors.licenseType ? 'govuk-select--error' : ''}`}
          value={formData.licenseType}
          onChange={(e) => updateFormData({ licenseType: e.target.value })}
        >
          <option value="">Select licence type</option>
          <option value="Mandatory HMO License">Mandatory HMO licence</option>
          <option value="Selective License">Selective licence</option>
          <option value="Additional HMO License">Additional HMO licence</option>
        </select>
      </div>

      {/* Property Address */}
      <div className={`govuk-form-group ${errors.propertyAddress ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="propertyAddress">
          Property address
        </label>
        <span className="govuk-hint">
          Enter the full address of the property
        </span>
        {errors.propertyAddress && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.propertyAddress}
          </p>
        )}
        <textarea
          id="propertyAddress"
          className={`govuk-input ${errors.propertyAddress ? 'govuk-input--error' : ''}`}
          rows={3}
          value={formData.propertyAddress}
          onChange={(e) => {
            updateFormData({ propertyAddress: e.target.value });
            setAddressValidated(false);
          }}
        />
      </div>

      {/* Postcode */}
      <div className={`govuk-form-group ${errors.postcode || errors.addressValidation ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="postcode">
          Postcode
        </label>
        <span className="govuk-hint">
          For example, SW1A 1AA
        </span>
        {errors.postcode && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.postcode}
          </p>
        )}
        {errors.addressValidation && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.addressValidation}
          </p>
        )}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
          <input
            id="postcode"
            type="text"
            className={`govuk-input ${errors.postcode ? 'govuk-input--error' : ''}`}
            style={{ width: '10em' }}
            value={formData.postcode}
            onChange={(e) => {
              updateFormData({ postcode: e.target.value.toUpperCase() });
              setAddressValidated(false);
            }}
          />
          <button
            type="button"
            onClick={handleValidateAddress}
            disabled={isValidatingAddress}
            className="govuk-button govuk-button--secondary"
            style={{ marginBottom: 0 }}
          >
            {isValidatingAddress ? 'Validating...' : addressValidated ? '✓ Validated' : 'Validate address'}
          </button>
        </div>
        {addressValidated && (
          <p style={{ color: '#00703c', fontWeight: 700, marginTop: '10px' }}>
            ✓ Address validated successfully
          </p>
        )}
      </div>

      {/* Property Type */}
      <div className={`govuk-form-group ${errors.propertyType ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="propertyType">
          Property type
        </label>
        {errors.propertyType && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.propertyType}
          </p>
        )}
        <select
          id="propertyType"
          className={`govuk-select ${errors.propertyType ? 'govuk-select--error' : ''}`}
          value={formData.propertyType}
          onChange={(e) => updateFormData({ propertyType: e.target.value })}
        >
          <option value="">Select property type</option>
          <option value="House">House</option>
          <option value="Flat">Flat</option>
          <option value="Maisonette">Maisonette</option>
          <option value="Bungalow">Bungalow</option>
          <option value="HMO">HMO (House in Multiple Occupation)</option>
        </select>
      </div>

      {/* Number of Bedrooms */}
      <div className={`govuk-form-group ${errors.numberOfBedrooms ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="numberOfBedrooms">
          Number of bedrooms
        </label>
        {errors.numberOfBedrooms && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.numberOfBedrooms}
          </p>
        )}
        <input
          id="numberOfBedrooms"
          type="number"
          min="1"
          className={`govuk-input ${errors.numberOfBedrooms ? 'govuk-input--error' : ''}`}
          style={{ width: '5em' }}
          value={formData.numberOfBedrooms}
          onChange={(e) => updateFormData({ numberOfBedrooms: e.target.value })}
        />
      </div>

      {/* Number of Occupants */}
      <div className={`govuk-form-group ${errors.numberOfOccupants ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="numberOfOccupants">
          Number of occupants
        </label>
        <span className="govuk-hint">
          Maximum number of people who will live in the property
        </span>
        {errors.numberOfOccupants && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.numberOfOccupants}
          </p>
        )}
        <input
          id="numberOfOccupants"
          type="number"
          min="1"
          className={`govuk-input ${errors.numberOfOccupants ? 'govuk-input--error' : ''}`}
          style={{ width: '5em' }}
          value={formData.numberOfOccupants}
          onChange={(e) => updateFormData({ numberOfOccupants: e.target.value })}
        />
      </div>

      {/* Landlord Details Section */}
      <h2 className="govuk-heading-m" style={{ marginTop: '40px' }}>Your details</h2>

      {/* Landlord Name */}
      <div className={`govuk-form-group ${errors.landlordName ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="landlordName">
          Full name
        </label>
        {errors.landlordName && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.landlordName}
          </p>
        )}
        <input
          id="landlordName"
          type="text"
          className={`govuk-input ${errors.landlordName ? 'govuk-input--error' : ''}`}
          value={formData.landlordName}
          onChange={(e) => updateFormData({ landlordName: e.target.value })}
        />
      </div>

      {/* Email */}
      <div className={`govuk-form-group ${errors.landlordEmail ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="landlordEmail">
          Email address
        </label>
        <span className="govuk-hint">
          We will use this to send you updates about your application
        </span>
        {errors.landlordEmail && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.landlordEmail}
          </p>
        )}
        <input
          id="landlordEmail"
          type="email"
          className={`govuk-input ${errors.landlordEmail ? 'govuk-input--error' : ''}`}
          value={formData.landlordEmail}
          onChange={(e) => updateFormData({ landlordEmail: e.target.value })}
          autoComplete="email"
          spellCheck={false}
        />
      </div>

      {/* Phone */}
      <div className={`govuk-form-group ${errors.landlordPhone ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="landlordPhone">
          Phone number
        </label>
        <span className="govuk-hint">
          For UK numbers, for example 07700 900 982 or 01632 960 001
        </span>
        {errors.landlordPhone && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.landlordPhone}
          </p>
        )}
        <input
          id="landlordPhone"
          type="tel"
          className={`govuk-input ${errors.landlordPhone ? 'govuk-input--error' : ''}`}
          style={{ width: '20em' }}
          value={formData.landlordPhone}
          onChange={(e) => updateFormData({ landlordPhone: e.target.value })}
          autoComplete="tel"
        />
      </div>

      {/* Action Buttons */}
      <button
        type="button"
        onClick={handleNext}
        className="govuk-button"
      >
        Continue
      </button>
    </div>
  );
}

