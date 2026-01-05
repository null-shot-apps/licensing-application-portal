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
      <h2 className="govuk-heading-l">Check your answers before submitting your application</h2>

      {/* License Information */}
      <h3 className="govuk-heading-m">Licence details</h3>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Licence type</dt>
          <dd className="govuk-summary-list__value">{formData.licenseType}</dd>
          <dd className="govuk-summary-list__actions">
            <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> licence type</span></a>
          </dd>
        </div>
      </dl>

      {/* Property Details */}
      <h3 className="govuk-heading-m">Property details</h3>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Property address</dt>
          <dd className="govuk-summary-list__value" style={{ whiteSpace: 'pre-line' }}>
            {formData.propertyAddress}
          </dd>
          <dd className="govuk-summary-list__actions">
            <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> property address</span></a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Postcode</dt>
          <dd className="govuk-summary-list__value">{formData.postcode}</dd>
          <dd className="govuk-summary-list__actions">
            <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> postcode</span></a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Property type</dt>
          <dd className="govuk-summary-list__value">{formData.propertyType}</dd>
          <dd className="govuk-summary-list__actions">
            <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> property type</span></a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Number of bedrooms</dt>
          <dd className="govuk-summary-list__value">{formData.numberOfBedrooms}</dd>
          <dd className="govuk-summary-list__actions">
            <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> number of bedrooms</span></a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Number of occupants</dt>
          <dd className="govuk-summary-list__value">{formData.numberOfOccupants}</dd>
          <dd className="govuk-summary-list__actions">
            <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> number of occupants</span></a>
          </dd>
        </div>
      </dl>

      {/* Landlord Details */}
      <h3 className="govuk-heading-m">Your details</h3>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Full name</dt>
          <dd className="govuk-summary-list__value">{formData.landlordName}</dd>
          <dd className="govuk-summary-list__actions">
            <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> full name</span></a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Email address</dt>
          <dd className="govuk-summary-list__value">{formData.landlordEmail}</dd>
          <dd className="govuk-summary-list__actions">
            <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> email address</span></a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Phone number</dt>
          <dd className="govuk-summary-list__value">{formData.landlordPhone}</dd>
          <dd className="govuk-summary-list__actions">
            <a className="govuk-link" href="#">Change<span className="govuk-visually-hidden"> phone number</span></a>
          </dd>
        </div>
      </dl>

      {/* Uploaded Documents */}
      <h3 className="govuk-heading-m">Supporting documents</h3>
      {formData.documents && formData.documents.length > 0 ? (
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">File name</th>
              <th scope="col" className="govuk-table__header">Size</th>
              <th scope="col" className="govuk-table__header">Status</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {formData.documents.map((doc: any) => (
              <tr key={doc.id} className="govuk-table__row">
                <td className="govuk-table__cell">{doc.name}</td>
                <td className="govuk-table__cell">{formatFileSize(doc.size)}</td>
                <td className="govuk-table__cell">
                  <strong className="govuk-tag govuk-tag--green">Validated</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="govuk-body">No documents uploaded</p>
      )}

      {/* Declaration */}
      <div className="govuk-warning-text" style={{ marginTop: '40px' }}>
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong className="govuk-warning-text__text">
          <span className="govuk-warning-text__assistive">Warning</span>
          By submitting this application, you confirm that the information you have provided is correct to the best of your knowledge.
        </strong>
      </div>

      <div className="govuk-inset-text">
        <p className="govuk-body">You are declaring that:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>all information provided is true and accurate</li>
          <li>all uploaded documents are genuine and valid</li>
          <li>you understand that providing false information may result in prosecution</li>
          <li>you agree to comply with all licensing requirements and regulations</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <button
        type="button"
        onClick={onSubmit}
        className="govuk-button"
      >
        Accept and submit application
      </button>

      <p className="govuk-body">
        <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="govuk-link">
          Back
        </a>
      </p>
    </div>
  );
}

