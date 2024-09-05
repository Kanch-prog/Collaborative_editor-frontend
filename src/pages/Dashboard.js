import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DocumentEditor from '../components/DocumentEditor';
import '../styles/styles.css';

function Dashboard() {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const userId = localStorage.getItem('userId');

    const fetchDocuments = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/document', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDocumentEdit = (document) => {
        setSelectedDocument(document);
    };

    const handleDocumentUpdate = async () => {
        setSelectedDocument(null);
        await fetchDocuments();
    };

    return (
        <div className="container mt-5">
            <h2 className="text-left mb-3">Your Documents</h2>
            <div className="row">
                <div className="col-md-4">
                    <ul className="list-group mt-0 sidebar">
                        {documents.map(doc => (
                            <li key={doc._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-1">{doc.title}</h5>
                                    <h6 className="mb-0">Collaborators:</h6>
                                    <ul className="list-group list-group-flush">
                                        {doc.collaborators.map(collab => (
                                            <li key={collab.user._id} className="list-group-item">
                                                {collab.user.username} ({collab.role})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => handleDocumentEdit(doc)}
                                >
                                    Edit
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-8">
                    <DocumentEditor 
                        document={selectedDocument} 
                        onUpdate={handleDocumentUpdate} 
                        userId={userId} 
                    />
                </div>
            </div>
        </div>

    );
}

export default Dashboard;
