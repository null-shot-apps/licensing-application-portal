'use client';

import { useState } from 'react';
import PropertyDetailsStep from './PropertyDetailsStep';
import DocumentUploadStep from './DocumentUploadStep';
import ReviewStep from './ReviewStep';

interface ApplicationFormProps {
  onSubmit: (application: any) => void;
  onCancel: () => void;
}

export default function ApplicationForm({ onSubmit, onCancel }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    licenseType: '',
    propertyAddress: '',
    postcode: '',
    propertyType: '',
    numberOfBedrooms: '',
    numberOfOccupants: '',
    landlordName: '',
    landlordEmail: '',
    landlordPhone: '',
    documents: [] as any[],
  });

  const steps = [
    { number: 1, name: 'Property details' },
    { number: 2, name: 'Upload documents' },
    { number: 3, name: 'Check your answers' },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
  };

  return (
    <div>
      <a href="#" onClick={(e) => { e.preventDefault(); onCancel(); }} className="govuk-back-link">
        Back
      </a>

      <h1 className="govuk-heading-xl">Apply for a property licence</h1>

      {/* Progress indicator */}
      <p className="govuk-body" style={{ color: '#505a5f', marginBottom: '30px' }}>
        Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
      </p>

      {/* Form Content */}
      <div>
        {currentStep === 1 && (
          <PropertyDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onCancel={onCancel}
          />
        )}
        {currentStep === 2 && (
          <DocumentUploadStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <ReviewStep
            formData={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}


