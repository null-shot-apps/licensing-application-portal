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
    { number: 1, name: 'Property Details', icon: '🏠' },
    { number: 2, name: 'Document Upload', icon: '📄' },
    { number: 3, name: 'Review & Submit', icon: '✓' },
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold transition-colors ${
                    currentStep >= step.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-4 rounded transition-colors ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
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

