'use client';

interface Application {
  id: string;
  licenseType: string;
  propertyAddress: string;
  status: string;
  submittedDate: string;
}

interface DashboardProps {
  applications: Application[];
  onNewApplication: () => void;
}

export default function Dashboard({ applications, onNewApplication }: DashboardProps) {
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'govuk-tag--blue';
      case 'Under Review':
        return 'govuk-tag--yellow';
      case 'Approved':
        return 'govuk-tag--green';
      case 'Rejected':
        return 'govuk-tag--red';
      default:
        return 'govuk-tag--grey';
    }
  };

  return (
    <div>
      <h1 className="govuk-heading-xl">Your property licence applications</h1>

      {applications.length === 0 ? (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px',
          border: '1px solid #b1b4b6',
          textAlign: 'center'
        }}>
          <h2 className="govuk-heading-m">You have not started any applications</h2>
          <p className="govuk-body">Apply for a property licence if you rent out residential property in England or Wales.</p>
          <button
            onClick={onNewApplication}
            className="govuk-button govuk-button--start"
            style={{ marginTop: '20px' }}
          >
            Start now
            <svg
              className="govuk-button__start-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="17.5"
              height="19"
              viewBox="0 0 33 40"
              aria-hidden="true"
              focusable="false"
              style={{ marginLeft: '8px', verticalAlign: 'middle' }}
            >
              <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px',
              border: '1px solid #b1b4b6'
            }}>
              <p className="govuk-body-s" style={{ marginBottom: '10px', color: '#505a5f' }}>Total applications</p>
              <p style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1, margin: 0 }}>
                {applications.length}
              </p>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px',
              border: '1px solid #b1b4b6'
            }}>
              <p className="govuk-body-s" style={{ marginBottom: '10px', color: '#505a5f' }}>Submitted</p>
              <p style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1, margin: 0, color: '#1d70b8' }}>
                {applications.filter(app => app.status === 'Submitted').length}
              </p>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px',
              border: '1px solid #b1b4b6'
            }}>
              <p className="govuk-body-s" style={{ marginBottom: '10px', color: '#505a5f' }}>Under review</p>
              <p style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1, margin: 0, color: '#f47738' }}>
                {applications.filter(app => app.status === 'Under Review').length}
              </p>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px',
              border: '1px solid #b1b4b6'
            }}>
              <p className="govuk-body-s" style={{ marginBottom: '10px', color: '#505a5f' }}>Approved</p>
              <p style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1, margin: 0, color: '#00703c' }}>
                {applications.filter(app => app.status === 'Approved').length}
              </p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #b1b4b6',
            marginBottom: '30px'
          }}>
            <div style={{ 
              padding: '20px',
              borderBottom: '1px solid #b1b4b6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 className="govuk-heading-m" style={{ marginBottom: 0 }}>Applications</h2>
              <button
                onClick={onNewApplication}
                className="govuk-button"
                style={{ marginBottom: 0 }}
              >
                New application
              </button>
            </div>

            <div>
              {applications.map((app, index) => (
                <div 
                  key={app.id} 
                  style={{ 
                    padding: '20px',
                    borderBottom: index < applications.length - 1 ? '1px solid #b1b4b6' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 className="govuk-heading-s" style={{ marginBottom: '10px' }}>
                        {app.propertyAddress}
                      </h3>
                      <dl style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: '5px 15px',
                        margin: 0,
                        fontSize: '16px'
                      }}>
                        <dt style={{ fontWeight: 700 }}>Licence type:</dt>
                        <dd style={{ margin: 0 }}>{app.licenseType}</dd>
                        <dt style={{ fontWeight: 700 }}>Submitted:</dt>
                        <dd style={{ margin: 0 }}>{new Date(app.submittedDate).toLocaleDateString('en-GB', { 
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</dd>
                        <dt style={{ fontWeight: 700 }}>Status:</dt>
                        <dd style={{ margin: 0 }}>
                          <strong className={`govuk-tag ${getStatusTag(app.status)}`}>
                            {app.status}
                          </strong>
                        </dd>
                      </dl>
                    </div>
                    <a href="#" className="govuk-link" style={{ whiteSpace: 'nowrap', marginLeft: '20px' }}>
                      View application
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNewApplication}
            className="govuk-button govuk-button--start"
          >
            Start new application
            <svg
              className="govuk-button__start-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="17.5"
              height="19"
              viewBox="0 0 33 40"
              aria-hidden="true"
              focusable="false"
              style={{ marginLeft: '8px', verticalAlign: 'middle' }}
            >
              <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}


