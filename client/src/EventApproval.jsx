import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminHeader from './AdminHeader';

export default function EventApproval() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Mock data for demonstration
  const eventsData = {
    pending: [
      {
        id: 1,
        title: 'Tech Summit 2024',
        organizer: 'Computer Science Society',
        category: 'Technical',
        faculty: 'Computing',
        date: '2024-04-15',
        time: '09:00 AM',
        venue: 'Main Auditorium',
        capacity: 200,
        registered: 189,
        budget: 50000,
        description: 'Annual technical summit featuring industry experts and workshops',
        sponsorshipEnabled: true,
        sponsorshipTiers: [
          { tier: 'Gold', price: 25000, benefits: 'Logo placement, speaking slot' },
          { tier: 'Silver', price: 15000, benefits: 'Logo placement, exhibition booth' }
        ],
        submittedDate: '2024-03-28',
        priority: 'high',
        status: 'pending'
      },
      {
        id: 2,
        title: 'Cultural Fusion Night',
        organizer: 'Cultural Club',
        category: 'Cultural',
        faculty: 'Business',
        date: '2024-04-20',
        time: '06:00 PM',
        venue: 'Open Ground',
        capacity: 500,
        registered: 234,
        budget: 75000,
        description: 'Multi-cultural performance night showcasing diverse traditions',
        sponsorshipEnabled: true,
        sponsorshipTiers: [
          { tier: 'Gold', price: 35000, benefits: 'Main stage branding' },
          { tier: 'Silver', price: 20000, benefits: 'Program advertisement' }
        ],
        submittedDate: '2024-03-29',
        priority: 'medium',
        status: 'pending'
      },
      {
        id: 3,
        title: 'AI Workshop Series',
        organizer: 'AI Research Club',
        category: 'Workshop',
        faculty: 'Computing',
        date: '2024-04-25',
        time: '02:00 PM',
        venue: 'Lab 301',
        capacity: 50,
        registered: 47,
        budget: 15000,
        description: 'Hands-on workshop covering machine learning fundamentals',
        sponsorshipEnabled: false,
        sponsorshipTiers: [],
        submittedDate: '2024-03-30',
        priority: 'low',
        status: 'pending'
      }
    ],
    approved: [
      {
        id: 4,
        title: 'Sports Championship',
        organizer: 'Sports Club',
        category: 'Sports',
        faculty: 'Engineering',
        date: '2024-04-10',
        time: '08:00 AM',
        venue: 'Sports Complex',
        capacity: 300,
        registered: 267,
        budget: 40000,
        description: 'Inter-faculty sports competition',
        sponsorshipEnabled: true,
        sponsorshipTiers: [
          { tier: 'Gold', price: 20000, benefits: 'Team sponsorship' }
        ],
        submittedDate: '2024-03-20',
        approvedDate: '2024-03-22',
        priority: 'high',
        status: 'approved'
      }
    ],
    rejected: [
      {
        id: 5,
        title: 'Gaming Tournament',
        organizer: 'Gaming Club',
        category: 'Entertainment',
        faculty: 'Computing',
        date: '2024-04-05',
        time: '03:00 PM',
        venue: 'Lab 201',
        capacity: 40,
        registered: 12,
        budget: 8000,
        description: 'Gaming competition with prizes',
        sponsorshipEnabled: false,
        sponsorshipTiers: [],
        submittedDate: '2024-03-15',
        rejectedDate: '2024-03-18',
        rejectionReason: 'Low registration interest and venue conflict',
        priority: 'low',
        status: 'rejected'
      }
    ]
  };

  const handleEventSelection = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for events:`, selectedEvents);
    setSelectedEvents([]);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const currentEvents = eventsData[activeTab] || [];

  return (
    <>
      <Helmet>
        <title>Event Approval - EventSync Admin</title>
      </Helmet>

      <AdminHeader />

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #16213e 100%)',
        color: '#ffffff',
        padding: '40px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }}></div>
        
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="row">
            <div className="col-lg-12">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                <div>
                  <h1 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      fontSize: '24px'
                    }}>✅</span>
                    Event Approval Management
                  </h1>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                    margin: 0
                  }}>
                    Review and manage event submissions with creative approval workflow
                  </p>
                </div>
                
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    Total Events: {Object.values(eventsData).flat().length}
                  </div>
                  
                  {selectedEvents.length > 0 && (
                    <div style={{display: 'flex', gap: '10px'}}>
                      <button 
                        onClick={() => handleBulkAction('approve')}
                        style={{
                          background: 'linear-gradient(45deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        ✅ Approve Selected ({selectedEvents.length})
                      </button>
                      <button 
                        onClick={() => handleBulkAction('reject')}
                        style={{
                          background: 'linear-gradient(45deg, #ef4444 0%, #dc2626 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        ❌ Reject Selected ({selectedEvents.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: '0',
        zIndex: 100
      }}>
        <div className="container">
          <div style={{display: 'flex', gap: '0', overflowX: 'auto'}}>
            {[
              { key: 'pending', label: 'Pending Review', count: eventsData.pending.length, icon: '⏳' },
              { key: 'approved', label: 'Approved', count: eventsData.approved.length, icon: '✅' },
              { key: 'rejected', label: 'Rejected', count: eventsData.rejected.length, icon: '❌' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: activeTab === tab.key ? '#4f46e5' : 'transparent',
                  color: activeTab === tab.key ? '#ffffff' : '#6b7280',
                  border: 'none',
                  padding: '15px 25px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.key ? '3px solid #4f46e5' : '3px solid transparent',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span style={{
                  background: activeTab === tab.key ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb',
                  color: activeTab === tab.key ? '#ffffff' : '#6b7280',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{background: '#f8fafc', minHeight: 'calc(100vh - 200px)', padding: '30px 0'}}>
        <div className="container">
          
          {currentEvents.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '60px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{fontSize: '48px', marginBottom: '20px'}}>
                {activeTab === 'pending' ? '⏳' : activeTab === 'approved' ? '✅' : '❌'}
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '10px'}}>
                No {activeTab} events
              </h3>
              <p style={{color: '#6b7280', fontSize: '16px'}}>
                {activeTab === 'pending' 
                  ? 'All events have been reviewed. Great job!' 
                  : `No events in ${activeTab} status.`
                }
              </p>
            </div>
          ) : (
            <div className="row">
              {currentEvents.map((event) => (
                <div key={event.id} className="col-lg-6 mb-4">
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '25px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}>
                    
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <span style={{
                        background: `${getStatusColor(event.status)}15`,
                        color: getStatusColor(event.status),
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {event.status}
                      </span>
                      <span style={{
                        background: `${getPriorityColor(event.priority)}15`,
                        color: getPriorityColor(event.priority),
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {event.priority} priority
                      </span>
                    </div>

                    {/* Selection Checkbox */}
                    {activeTab === 'pending' && (
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => handleEventSelection(event.id)}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    )}

                    {/* Event Content */}
                    <div style={{paddingLeft: activeTab === 'pending' ? '40px' : '0'}}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '15px',
                        paddingRight: '150px'
                      }}>
                        {event.title}
                      </h3>
                      
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px'}}>
                        <span style={{
                          background: '#e5e7eb',
                          color: '#374151',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          📚 {event.category}
                        </span>
                        <span style={{
                          background: '#e5e7eb',
                          color: '#374151',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          🏢 {event.faculty}
                        </span>
                        <span style={{
                          background: '#e5e7eb',
                          color: '#374151',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          👥 {event.organizer}
                        </span>
                      </div>

                      <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                      }}>
                        {event.description}
                      </p>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '15px',
                        marginBottom: '20px'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{marginRight: '8px'}}>📅</span>
                          <div>
                            <div style={{fontSize: '12px', color: '#6b7280'}}>Date & Time</div>
                            <div style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>
                              {event.date} at {event.time}
                            </div>
                          </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{marginRight: '8px'}}>📍</span>
                          <div>
                            <div style={{fontSize: '12px', color: '#6b7280'}}>Venue</div>
                            <div style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>{event.venue}</div>
                          </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{marginRight: '8px'}}>👥</span>
                          <div>
                            <div style={{fontSize: '12px', color: '#6b7280'}}>Attendance</div>
                            <div style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>
                              {event.registered}/{event.capacity}
                            </div>
                          </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{marginRight: '8px'}}>💰</span>
                          <div>
                            <div style={{fontSize: '12px', color: '#6b7280'}}>Budget</div>
                            <div style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>
                              Rs. {event.budget.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sponsorship Info */}
                      {event.sponsorshipEnabled && (
                        <div style={{
                          background: '#f8fafc',
                          padding: '15px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '10px'}}>
                            🤝 Sponsorship Tiers
                          </div>
                          <div style={{display: 'flex', gap: '10px'}}>
                            {event.sponsorshipTiers.map((tier, index) => (
                              <div key={index} style={{
                                background: '#ffffff',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e5e7eb',
                                fontSize: '12px'
                              }}>
                                <div style={{fontWeight: '600', color: '#111827'}}>{tier.tier}</div>
                                <div style={{color: '#6b7280'}}>Rs. {tier.price.toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {event.status === 'rejected' && event.rejectionReason && (
                        <div style={{
                          background: '#fef2f2',
                          padding: '15px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          border: '1px solid #fecaca'
                        }}>
                          <div style={{fontSize: '12px', fontWeight: '600', color: '#dc2626', marginBottom: '5px'}}>
                            Rejection Reason
                          </div>
                          <div style={{fontSize: '14px', color: '#7f1d1d'}}>{event.rejectionReason}</div>
                        </div>
                      )}

                      {/* Timeline */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '15px',
                        borderTop: '1px solid #e5e7eb',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        <div>
                          Submitted: {event.submittedDate}
                          {event.approvedDate && ` | Approved: ${event.approvedDate}`}
                          {event.rejectedDate && ` | Rejected: ${event.rejectedDate}`}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {activeTab === 'pending' && (
                        <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                          <button style={{
                            background: 'linear-gradient(45deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            flex: 1
                          }}>
                            ✅ Approve Event
                          </button>
                          <button style={{
                            background: 'linear-gradient(45deg, #ef4444 0%, #dc2626 100%)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            flex: 1
                          }}>
                            ❌ Reject Event
                          </button>
                          <button style={{
                            background: 'linear-gradient(45deg, #6b7280 0%, #4b5563 100%)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}>
                            📝 Request Changes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #16213e 100%)',
        color: '#ffffff',
        padding: '60px 0 30px',
        marginTop: '0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }}></div>
        
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="row">
            <div className="col-lg-12">
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                margin: 0,
                lineHeight: '1.6',
                textAlign: 'center'
              }}>
                © 2026 EventSync – Event Approval Management. All Rights Reserved.
                <br />
                <span style={{color: 'rgba(255, 255, 255, 0.4)'}}>
                  Professional Campus Event Management Platform | Built with ❤️ for SLIIT
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
