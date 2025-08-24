import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../utils/api';
import '../styles/results.css';

export default function ExamReport() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await api.getExamReport(examId);
                setResults(res.data || []);
            } catch (e) {
                setError(e.message || 'Failed to load report');
            } finally {
                setLoading(false);
            }
        };
        if (examId) fetchReport();
    }, [examId]);

    if (loading) return <div className="loading">Loading report...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <div className="container">
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1 className="welcome-title" style={{ color: '#4F46E5', marginBottom: '0.5rem' }}>Exam Report</h1>
                        <h2 className="welcome-subtitle" style={{ color: '#64748B', fontWeight: 400 }}>Exam ID: {examId}</h2>
                        <p style={{ color: '#64748B', marginTop: '0.5rem' }}>View all student scores and completion times for this exam.</p>
                    </div>
                </div>
                <div className="list-container" style={{ marginTop: '2rem' }}>
                    <div className="list-header">
                        <h2 className="list-title" style={{ color: '#4F46E5' }}>Student Results</h2>
                        <span className="list-count">{results.length} students</span>
                    </div>
                    <div className="list-body">
                        {results.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon" style={{ fontSize: '2rem' }}>📊</div>
                                <h3 className="empty-title" style={{ color: '#64748B' }}>No Results Yet</h3>
                                <p className="empty-description">No students have completed this exam yet.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="results-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px #e0e7ef' }}>
                                    <thead style={{ background: '#F3F4F6' }}>
                                        <tr>
                                            <th style={{ padding: '12px', textAlign: 'left', color: '#4F46E5' }}>Student Username</th>
                                            <th style={{ padding: '12px', textAlign: 'left', color: '#4F46E5' }}>Score</th>
                                            <th style={{ padding: '12px', textAlign: 'left', color: '#4F46E5' }}>Completed At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((r, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                                <td style={{ padding: '10px', color: '#334155', fontWeight: 500 }}>{r.studentUsername}</td>
                                                <td style={{ padding: '10px', color: '#059669', fontWeight: 600 }}>{r.score}</td>
                                                <td style={{ padding: '10px', color: '#64748B' }}>{r.completedAt ? new Date(r.completedAt).toLocaleString() : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => navigate(-1)}>
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
