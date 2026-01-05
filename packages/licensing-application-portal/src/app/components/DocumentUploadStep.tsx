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
    'Gas Safety Certificate',
    'Electrical Installation Condition Report (EICR)',
    'Energy Performance Certificate (EPC)',
    'Proof of ownership or right to grant a tenancy',
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
            message: 'The selected file must be a PDF, JPG or PNG',
          });
          return;
        }

        if (file.size > maxSize) {
          resolve({
            valid: false,
            message: 'The selected file must be smaller than 10MB',
          });
          return;
        }

        // Simulate successful validation
        resolve({
          valid: true,
          message: 'File uploaded successfully',
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
      newErrors.documents = 'Select a file';
    }

    const invalidDocs = documents.filter((doc) => !doc.validated);
    if (invalidDocs.length > 0) {
      newErrors.validation = 'Remove invalid files before continuing';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div>
      <h2 className="govuk-heading-l">Upload supporting documents</h2>

      {/* Required Documents Info */}
      <div style={{ 
        backgroundColor: '#1d70b8',
        color: 'white',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 className="govuk-heading-s" style={{ color: 'white', marginTop: 0 }}>
          You must provide:
        </h3>
        <ul className="govuk-list govuk-list--bullet" style={{ marginBottom: 0 }}>
          {requiredDocuments.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </div>

      <div className="govuk-inset-text">
        Files must be PDF, JPG or PNG format and smaller than 10MB
      </div>

      {/* Upload Area */}
      <div className={`govuk-form-group ${errors.documents ? 'govuk-form-group--error' : ''}`}>
        <label className="govuk-label govuk-label--s" htmlFor="file-upload">
          Upload a file
        </label>
        {errors.documents && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.documents}
          </p>
        )}
        {errors.validation && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.validation}
          </p>
        )}
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="govuk-file-upload"
        />
      </div>

      {/* Validating Indicator */}
      {isValidating && (
        <div style={{ 
          backgroundColor: '#1d70b8',
          color: 'white',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <p className="govuk-body" style={{ color: 'white', marginBottom: 0 }}>
            Validating files...
          </p>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 className="govuk-heading-s">Uploaded files</h3>
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header">File name</th>
                <th scope="col" className="govuk-table__header">Size</th>
                <th scope="col" className="govuk-table__header">Status</th>
                <th scope="col" className="govuk-table__header">Action</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {documents.map((doc) => (
                <tr key={doc.id} className="govuk-table__row">
                  <td className="govuk-table__cell">{doc.name}</td>
                  <td className="govuk-table__cell">{formatFileSize(doc.size)}</td>
                  <td className="govuk-table__cell">
                    {doc.validated ? (
                      <strong className="govuk-tag govuk-tag--green">Valid</strong>
                    ) : (
                      <>
                        <strong className="govuk-tag govuk-tag--red">Invalid</strong>
                        {doc.validationMessage && (
                          <p className="govuk-error-message" style={{ marginTop: '5px', marginBottom: 0 }}>
                            {doc.validationMessage}
                          </p>
                        )}
                      </>
                    )}
                  </td>
                  <td className="govuk-table__cell">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveDocument(doc.id);
                      }}
                      className="govuk-link"
                    >
                      Remove
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Buttons */}
      <button
        type="button"
        onClick={handleNext}
        disabled={isValidating}
        className="govuk-button"
      >
        Continue
      </button>

      <p className="govuk-body">
        <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="govuk-link">
          Back
        </a>
      </p>
    </div>
  );
}

