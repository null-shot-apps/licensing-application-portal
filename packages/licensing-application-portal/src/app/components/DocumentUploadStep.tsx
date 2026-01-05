'use client';

import { useState } from 'react';

interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  acceptedFormats: string[];
  maxSize: number; // in MB
  validationRules: {
    mustContainText?: string[];
    fileNamePattern?: RegExp;
    minPages?: number;
    maxPages?: number;
  };
  exampleCharacteristics: {
    expectedKeywords: string[];
    documentStructure: string[];
  };
}

interface UploadedDocument {
  file: File;
  status: 'uploading' | 'validating' | 'valid' | 'invalid';
  validationMessage?: string;
  validationScore?: number;
}

const REQUIRED_DOCUMENTS: DocumentRequirement[] = [
  {
    id: 'proof-of-ownership',
    name: 'Proof of ownership',
    description: 'Land Registry document, title deeds, or mortgage statement showing you own the property',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxSize: 10,
    validationRules: {
      mustContainText: ['land registry', 'title', 'proprietor', 'property'],
      minPages: 1,
      maxPages: 20
    },
    exampleCharacteristics: {
      expectedKeywords: ['land registry', 'title number', 'proprietor', 'registered', 'freehold', 'leasehold'],
      documentStructure: ['Property address', 'Owner name', 'Title number', 'Registration date']
    }
  },
  {
    id: 'gas-safety-certificate',
    name: 'Gas Safety Certificate',
    description: 'Valid Gas Safety Certificate (CP12) issued within the last 12 months by a Gas Safe registered engineer',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxSize: 5,
    validationRules: {
      mustContainText: ['gas safe', 'cp12', 'certificate', 'inspection'],
      minPages: 1,
      maxPages: 10
    },
    exampleCharacteristics: {
      expectedKeywords: ['gas safe', 'cp12', 'landlord', 'gas safety record', 'engineer', 'inspection date', 'appliances'],
      documentStructure: ['Gas Safe Register number', 'Engineer name', 'Inspection date', 'Property address', 'Appliances checked']
    }
  },
  {
    id: 'epc-certificate',
    name: 'Energy Performance Certificate (EPC)',
    description: 'Valid EPC with a rating of E or above',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxSize: 5,
    validationRules: {
      mustContainText: ['energy performance', 'epc', 'rating', 'certificate'],
      minPages: 1,
      maxPages: 5
    },
    exampleCharacteristics: {
      expectedKeywords: ['energy performance certificate', 'epc', 'energy rating', 'current rating', 'potential rating', 'valid until'],
      documentStructure: ['Property address', 'Energy rating (A-G)', 'Valid until date', 'Certificate number', 'Assessor details']
    }
  },
  {
    id: 'electrical-safety-certificate',
    name: 'Electrical Installation Condition Report (EICR)',
    description: 'Valid EICR issued within the last 5 years showing satisfactory condition',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxSize: 10,
    validationRules: {
      mustContainText: ['electrical', 'eicr', 'inspection', 'condition report'],
      minPages: 1,
      maxPages: 30
    },
    exampleCharacteristics: {
      expectedKeywords: ['eicr', 'electrical installation', 'condition report', 'inspection', 'satisfactory', 'test date', 'next inspection'],
      documentStructure: ['Property address', 'Inspection date', 'Next inspection due', 'Overall assessment', 'Electrician details']
    }
  },
  {
    id: 'floor-plan',
    name: 'Floor plan',
    description: 'Detailed floor plan showing room layouts, dimensions, and fire escape routes',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxSize: 10,
    validationRules: {
      fileNamePattern: /floor.*plan|plan|layout/i,
      minPages: 1,
      maxPages: 10
    },
    exampleCharacteristics: {
      expectedKeywords: ['floor plan', 'layout', 'dimensions', 'room', 'scale', 'exit', 'escape route'],
      documentStructure: ['Room labels', 'Dimensions', 'Doors and windows', 'Escape routes', 'Scale indicator']
    }
  },
  {
    id: 'proof-of-address',
    name: 'Proof of address',
    description: 'Recent utility bill, council tax statement, or bank statement (within last 3 months)',
    acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxSize: 5,
    validationRules: {
      mustContainText: ['address', 'date'],
      minPages: 1,
      maxPages: 5
    },
    exampleCharacteristics: {
      expectedKeywords: ['address', 'date', 'account', 'statement', 'bill', 'council tax', 'utility'],
      documentStructure: ['Your name', 'Property address', 'Issue date', 'Account details']
    }
  }
];

interface DocumentUploadStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DocumentUploadStep({ formData, updateFormData, onNext, onBack }: DocumentUploadStepProps) {
  const [documents, setDocuments] = useState<Record<string, UploadedDocument>>(formData.documents || {});
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const validateDocument = async (docId: string, file: File): Promise<{ valid: boolean; message: string; score: number }> => {
    const requirement = REQUIRED_DOCUMENTS.find(d => d.id === docId);
    if (!requirement) return { valid: false, message: 'Unknown document type', score: 0 };

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let score = 0;
    const issues: string[] = [];

    // Check file format
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!requirement.acceptedFormats.includes(fileExt)) {
      issues.push(`Invalid format. Accepted: ${requirement.acceptedFormats.join(', ')}`);
    } else {
      score += 20;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > requirement.maxSize) {
      issues.push(`File too large. Maximum: ${requirement.maxSize}MB`);
    } else {
      score += 20;
    }

    // Check file name patterns
    if (requirement.validationRules.fileNamePattern) {
      if (requirement.validationRules.fileNamePattern.test(file.name)) {
        score += 20;
      } else {
        issues.push('File name does not match expected pattern');
      }
    } else {
      score += 20;
    }

    // Simulate content validation (in real app, would use OCR/PDF parsing)
    // For demo, we'll do basic checks based on file name and type
    const fileName = file.name.toLowerCase();
    const keywords = requirement.exampleCharacteristics.expectedKeywords;
    
    let keywordMatches = 0;
    keywords.forEach(keyword => {
      if (fileName.includes(keyword.toLowerCase().replace(/\s+/g, ''))) {
        keywordMatches++;
      }
    });

    if (keywordMatches > 0) {
      score += 20;
    } else {
      issues.push('Document may not contain expected information');
    }

    // Additional validation based on document type
    if (docId === 'gas-safety-certificate' && !fileName.includes('gas') && !fileName.includes('cp12')) {
      issues.push('This does not appear to be a Gas Safety Certificate');
      score -= 20;
    }

    if (docId === 'epc-certificate' && !fileName.includes('epc') && !fileName.includes('energy')) {
      issues.push('This does not appear to be an EPC');
      score -= 20;
    }

    if (docId === 'electrical-safety-certificate' && !fileName.includes('eicr') && !fileName.includes('electrical')) {
      issues.push('This does not appear to be an EICR');
      score -= 20;
    }

    // Final scoring
    score = Math.max(0, Math.min(100, score + 20)); // Base score + checks

    const valid = score >= 60 && issues.length === 0;

    return {
      valid,
      score,
      message: valid 
        ? `Document validated successfully (${score}% match)` 
        : `Validation issues: ${issues.join('; ')}`
    };
  };

  const handleFileUpload = async (docId: string, file: File) => {
    // Set uploading status
    setDocuments(prev => ({
      ...prev,
      [docId]: {
        file,
        status: 'uploading',
      }
    }));

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Set validating status
    setDocuments(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        status: 'validating',
      }
    }));

    // Validate document
    const validation = await validateDocument(docId, file);

    // Update with validation results
    setDocuments(prev => {
      const updated = {
        ...prev,
        [docId]: {
          file,
          status: (validation.valid ? 'valid' : 'invalid') as 'valid' | 'invalid',
          validationMessage: validation.message,
          validationScore: validation.score,
        }
      };
      updateFormData({ documents: updated });
      return updated;
    });
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments(prev => {
      const updated = { ...prev };
      delete updated[docId];
      updateFormData({ documents: updated });
      return updated;
    });
  };

  const allRequiredDocsValid = REQUIRED_DOCUMENTS.every(req => 
    documents[req.id]?.status === 'valid'
  );

  return (
    <div>
      <h1 className="govuk-heading-l">Upload required documents</h1>
      
      <div className="govuk-inset-text">
        You must upload all required documents. Each document will be automatically validated to ensure it is the correct type and contains the necessary information.
      </div>

      <div style={{ marginBottom: '30px' }}>
        {REQUIRED_DOCUMENTS.map((req, index) => {
          const doc = documents[req.id];
          const isExpanded = expandedDoc === req.id;

          return (
            <div 
              key={req.id}
              style={{
                border: '1px solid #b1b4b6',
                marginBottom: '20px',
                backgroundColor: doc?.status === 'valid' ? '#f3f9f3' : doc?.status === 'invalid' ? '#fef7f7' : 'white'
              }}
            >
              <div 
                style={{
                  padding: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => setExpandedDoc(isExpanded ? null : req.id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="govuk-heading-s" style={{ marginBottom: 0 }}>
                      {index + 1}. {req.name}
                    </span>
                    {doc?.status === 'valid' && (
                      <strong className="govuk-tag govuk-tag--green">Validated</strong>
                    )}
                    {doc?.status === 'invalid' && (
                      <strong className="govuk-tag govuk-tag--red">Invalid</strong>
                    )}
                    {doc?.status === 'uploading' && (
                      <strong className="govuk-tag govuk-tag--blue">Uploading...</strong>
                    )}
                    {doc?.status === 'validating' && (
                      <strong className="govuk-tag govuk-tag--yellow">Validating...</strong>
                    )}
                  </div>
                  <p className="govuk-body-s" style={{ marginBottom: 0, color: '#505a5f' }}>
                    {req.description}
                  </p>
                </div>
                <span style={{ fontSize: '24px', color: '#1d70b8' }}>
                  {isExpanded ? '−' : '+'}
                </span>
              </div>

              {isExpanded && (
                <div style={{ padding: '0 15px 15px 15px', borderTop: '1px solid #b1b4b6' }}>
                  <div style={{ marginTop: '15px' }}>
                    <h3 className="govuk-heading-s">What we are looking for:</h3>
                    <ul className="govuk-list govuk-list--bullet">
                      {req.exampleCharacteristics.documentStructure.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f3f2f1', border: '1px solid #b1b4b6' }}>
                      <p className="govuk-body-s" style={{ marginBottom: '5px' }}>
                        <strong>Accepted formats:</strong> {req.acceptedFormats.join(', ')}
                      </p>
                      <p className="govuk-body-s" style={{ marginBottom: '5px' }}>
                        <strong>Maximum file size:</strong> {req.maxSize}MB
                      </p>
                      <p className="govuk-body-s" style={{ marginBottom: 0 }}>
                        <strong>Expected keywords:</strong> {req.exampleCharacteristics.expectedKeywords.join(', ')}
                      </p>
                    </div>

                    {!doc && (
                      <div className="govuk-form-group" style={{ marginTop: '20px' }}>
                        <label className="govuk-label govuk-label--s" htmlFor={`file-${req.id}`}>
                          Upload {req.name}
                        </label>
                        <div id={`file-${req.id}-hint`} className="govuk-hint">
                          Maximum file size: {req.maxSize}MB. Accepted formats: {req.acceptedFormats.join(', ')}
                        </div>
                        <input
                          className="govuk-file-upload"
                          id={`file-${req.id}`}
                          name={`file-${req.id}`}
                          type="file"
                          accept={req.acceptedFormats.join(',')}
                          aria-describedby={`file-${req.id}-hint`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(req.id, file);
                              e.target.value = ''; // Reset input
                            }
                          }}
                        />
                      </div>
                    )}

                    {doc && (
                      <div style={{ marginTop: '15px' }}>
                        <div style={{ 
                          padding: '15px', 
                          backgroundColor: '#f3f2f1',
                          border: '1px solid #b1b4b6'
                        }}>
                          <p className="govuk-body-s" style={{ marginBottom: '5px' }}>
                            <strong>File:</strong> {doc.file.name}
                          </p>
                          <p className="govuk-body-s" style={{ marginBottom: '5px' }}>
                            <strong>Size:</strong> {(doc.file.size / 1024).toFixed(2)} KB
                          </p>
                          {doc.validationScore !== undefined && (
                            <p className="govuk-body-s" style={{ marginBottom: '5px' }}>
                              <strong>Validation score:</strong> {doc.validationScore}%
                            </p>
                          )}
                          {doc.validationMessage && (
                            <p className="govuk-body-s" style={{ 
                              marginBottom: '10px',
                              color: doc.status === 'valid' ? '#00703c' : '#d4351c',
                              fontWeight: 600
                            }}>
                              {doc.validationMessage}
                            </p>
                          )}
                          <button
                            type="button"
                            className="govuk-button govuk-button--secondary govuk-button--small"
                            onClick={() => handleRemoveDocument(req.id)}
                          >
                            Remove and upload different file
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!allRequiredDocsValid && (
        <div className="govuk-warning-text">
          <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong className="govuk-warning-text__text">
            <span className="govuk-warning-text__assistive">Warning</span>
            You must upload and validate all required documents before continuing
          </strong>
        </div>
      )}

      <div className="govuk-button-group">
        <button
          type="button"
          className="govuk-button"
          disabled={!allRequiredDocsValid}
          onClick={onNext}
        >
          Continue
        </button>
        <button
          type="button"
          className="govuk-button govuk-button--secondary"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
}




