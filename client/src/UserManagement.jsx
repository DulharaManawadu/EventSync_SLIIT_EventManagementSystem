import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminHeader from './AdminHeader';

export default function UserManagement() {
  return (
    <>
      <Helmet>
        <title>User Management - EventSync Admin</title>
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
                }}>👥</span>
                User Management
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '18px',
                margin: 0
              }}>
                Manage users, roles, permissions, and user analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{background: '#f8fafc', minHeight: 'calc(100vh - 200px)', padding: '30px 0'}}>
        <div className="container">
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{fontSize: '64px', marginBottom: '20px'}}>👥</div>
            <h3 style={{fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '15px'}}>
              User Management Module
            </h3>
            <p style={{color: '#6b7280', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6'}}>
              Comprehensive user administration system with role-based access control, user analytics, and permission management.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '30px'
            }}>
              <div style={{
                background: '#f8fafc',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{fontSize: '32px', marginBottom: '15px'}}>👤</div>
                <h4 style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '10px'}}>
                  User Directory
                </h4>
                <p style={{color: '#6b7280', fontSize: '14px'}}>
                  Complete user database with profiles and information
                </p>
              </div>
              <div style={{
                background: '#f8fafc',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{fontSize: '32px', marginBottom: '15px'}}>🔐</div>
                <h4 style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '10px'}}>
                  Role Management
                </h4>
                <p style={{color: '#6b7280', fontSize: '14px'}}>
                  Define user roles and permission levels
                </p>
              </div>
              <div style={{
                background: '#f8fafc',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{fontSize: '32px', marginBottom: '15px'}}>📊</div>
                <h4 style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '10px'}}>
                  User Analytics
                </h4>
                <p style={{color: '#6b7280', fontSize: '14px'}}>
                  Track user activity and engagement metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
