import React from 'react';

function DeniedAccess() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
            <p>You do not have permission to view this page.</p>
        </div>
    );
}

export default DeniedAccess;
