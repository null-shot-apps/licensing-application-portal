'use client';

interface ReviewStepProps {
  formData: any;
  onSubmit: () => void;
  onBack: () => void;
}

export default function ReviewStep({ formData, onSubmit, onBack }: ReviewStepProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Review & Submit</h2>

      <div className="space-y-6">
        {/* License Information */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            License Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">License Type</p>
              <p className="text-base text-slate-900 mt-1">{formData.licenseType}</p>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Property Details
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Property Address</p>
              <p className="text-base text-slate-900 mt-1 whitespace-pre-line">{formData.propertyAddress}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Postcode</p>
                <p className="text-base text-slate-900 mt-1">{formData.postcode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Property Type</p>
                <p className="text-base text-slate-900 mt-1">{formData.propertyType}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Number of Bedrooms</p>
                <p className="text-base text-slate-900 mt-1">{formData.numberOfBedrooms}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Number of Occupants</p>
                <p className="text-base text-slate-900 mt-1">{formData.numberOfOccupants}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Landlord Details */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Landlord Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Full Name</p>
              <p className="text-base text-slate-900 mt-1">{formData.landlordName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Email Address</p>
              <p className="text-base text-slate-900 mt-1">{formData.landlordEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Phone Number</p>
              <p className="text-base text-slate-900 mt-1">{formData.landlordPhone}</p>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Uploaded Documents ({formData.documents?.length || 0})
          </h3>
          {formData.documents && formData.documents.length > 0 ? (
            <div className="space-y-2">
              {formData.documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-600">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-600">Validated</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No documents uploaded</p>
          )}
        </div>

        {/* Declaration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-base font-semibold text-blue-900 mb-3">Declaration</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>By submitting this application, I declare that:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>All information provided is true and accurate to the best of my knowledge</li>
              <li>All uploaded documents are genuine and valid</li>
              <li>I understand that providing false information may result in application rejection</li>
              <li>I agree to comply with all licensing requirements and regulations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Submit Application
        </button>
      </div>
    </div>
  );
}

