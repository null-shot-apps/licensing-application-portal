'use client';

import { useState, useRef } from 'react';

interface DocumentUploadStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  validated: boolean;
  validationMessage?: string;
}

export default function DocumentUploadStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: DocumentUploadStepProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>(formData.documents || []);
  const [isValidating, setIsValidating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredDocuments = [
    { type: 'Gas Safety Certificate', required: true },
    { type: 'Electrical Installation Condition Report (EICR)', required: true },
    { type: 'Energy Performance Certificate (EPC)', required: true },
    { type: 'Proof of Ownership', required: true },
    { type: 'Floor Plan', required: false },
  ];

  const validateDocument = async (file: File): Promise<{ valid: boolean; message?: string }> => {
    // Simulate document validation
    return new Promise((resolve) => {
      setTimeout(() => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
          resolve({
            valid: false,
            message: 'Invalid file type. Please upload PDF, JPG, or PNG files only.',
          });
          return;
        }

        if (file.size > maxSize) {
          resolve({
            valid: false,
            message: 'File size exceeds 10MB limit.',
          });
          return;
        }

        // Simulate successful validation
        resolve({
          valid: true,
          message: 'Document validated successfully',
        });
      }, 1500);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsValidating(true);
    const newDocuments: UploadedDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = await validateDocument(file);

      const doc: UploadedDocument = {
        id: Date.now().toString() + i,
        name: file.name,
        type: file.type,
        size: file.size,
        validated: validation.valid,
        validationMessage: validation.message,
      };

      newDocuments.push(doc);
    }

    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    updateFormData({ documents: updatedDocuments });
    setIsValidating(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveDocument = (id: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== id);
    setDocuments(updatedDocuments);
    updateFormData({ documents: updatedDocuments });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (documents.length === 0) {
      newErrors.documents = 'Please upload at least one document';
    }

    const invalidDocs = documents.filter((doc) => !doc.validated);
    if (invalidDocs.length > 0) {
      newErrors.validation = 'Please remove invalid documents before continuing';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Documents</h2>

      {/* Required Documents Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Required Documents:</h3>
        <ul className="space-y-1">
          {requiredDocuments.map((doc) => (
            <li key={doc.type} className="text-sm text-blue-800 flex items-center gap-2">
              <span className={doc.required ? 'text-red-500' : 'text-blue-400'}>
                {doc.required ? '•' : '○'}
              </span>
              {doc.type}
              {doc.required && <span className="text-xs text-red-600">(Required)</span>}
            </li>
          ))}
        </ul>
        <p className="text-xs text-blue-700 mt-3">
          Accepted formats: PDF, JPG, PNG (Max 10MB per file)
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-slate-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-base font-medium text-slate-900 mb-1">
              Click to upload documents
            </p>
            <p className="text-sm text-slate-600">or drag and drop files here</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />
        {errors.documents && (
          <p className="mt-2 text-sm text-red-500">{errors.documents}</p>
        )}
        {errors.validation && (
          <p className="mt-2 text-sm text-red-500">{errors.validation}</p>
        )}
      </div>

      {/* Validating Indicator */}
      {isValidating && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-medium text-blue-900">
            Validating documents...
          </span>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-slate-900">Uploaded Documents:</h3>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                doc.validated
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    doc.validated ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {doc.validated ? (
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                  <p className="text-xs text-slate-600">{formatFileSize(doc.size)}</p>
                  {doc.validationMessage && (
                    <p
                      className={`text-xs mt-1 ${
                        doc.validated ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {doc.validationMessage}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveDocument(doc.id)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

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
          onClick={handleNext}
          disabled={isValidating}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
}

