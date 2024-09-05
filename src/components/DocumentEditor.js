import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import '../styles/styles.css';

function DocumentEditor({ document, onUpdate, userId }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    const [newCollaboratorUsername, setNewCollaboratorUsername] = useState('');
    const [newCollaboratorRole, setNewCollaboratorRole] = useState('viewer');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

        if (document) {
            setTitle(document.title);
            setContent(document.content);
            setCollaborators(document.collaborators);
        } else {
            setTitle('');
            setContent('');
            setCollaborators([]);
        }
    }, [document]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
    
        try {
            if (document) {
                const response = await axios.put(`http://localhost:5000/document/${document._id}`, {
                    title,
                    content,
                    collaborators,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Document updated successfully:', response.data);
            } else {
                const response = await axios.post('http://localhost:5000/document', {
                    title,
                    content,
                    owner: userId,
                    collaborators: [...collaborators, { user: userId, role: 'owner' }]
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Document created successfully:', response.data);
            }
            onUpdate();
        } catch (error) {
            console.error('Error saving document:', error.response?.data || error.message);
        }
    };
    
    const handleAddCollaborator = () => {
        if (!newCollaboratorUsername) return;

        const user = users.find(user => user.username === newCollaboratorUsername);

        if (user) {
            const isCollaborator = collaborators.some(collab => collab.user.toString() === user._id.toString());
            if (!isCollaborator) {
                const newCollaborator = { user: user._id, username: user.username, role: newCollaboratorRole };
                setCollaborators([...collaborators, newCollaborator]);
            } else {
                console.error('User is already a collaborator');
            }
            setNewCollaboratorUsername('');
            setNewCollaboratorRole('viewer');
        } else {
            console.error('User not found');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded shadow-sm bg-light">
            <h3 className="mb-3">{document ? 'Edit Document' : 'Create Document'}</h3>
            <div className="mb-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document Title"
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <ReactQuill 
                    value={content}
                    onChange={setContent}
                    placeholder="Document Content"
                    className="form-control"
                    modules={{
                        toolbar: [
                            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                            [{size: []}],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, 
                             {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image', 'video'],
                            ['clean']                                         
                        ],
                    }}
                />
            </div>

            <h4 className="mt-4">Add Collaborator</h4>
            <div className="input-group mb-3">
                <select value={newCollaboratorUsername} onChange={(e) => setNewCollaboratorUsername(e.target.value)} className="form-select">
                    <option value="">Select Collaborator</option>
                    {users.length > 0 ? (
                        users.map(user => (
                            <option key={user._id} value={user.username}>{user.username}</option>
                        ))
                    ) : (
                        <option value="">No users available</option>
                    )}
                </select>
                <select value={newCollaboratorRole} onChange={(e) => setNewCollaboratorRole(e.target.value)} className="form-select">
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="owner">Owner</option>
                </select>
                <button type="button" className="btn btn-secondary" onClick={handleAddCollaborator}>Add</button>
            </div>

            <h4>Collaborators:</h4>
            <ul className="list-group mb-3">
                {collaborators.map((collab) => (
                    <li key={collab.user} className="list-group-item d-flex justify-content-between align-items-center">
                        {collab.username} ({collab.role})
                    </li>
                ))}
            </ul>

            <button type="submit" className="btn btn-primary mt-4 w-100">
                {document ? 'Update Document' : 'Create Document'}
            </button>
        </form>
    );
}

export default DocumentEditor;
