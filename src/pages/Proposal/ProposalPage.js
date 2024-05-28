import React, { useEffect, useState } from 'react';
import { getProposals } from '../apis/proposalApi';
import ProposalForm from '../components/proposal/ProposalForm';
import AdminProposalPage from './Proposal/AdminProposalPage';

const ProposalPage = ({ isAdmin = false, memberId = 192192 }) => {
    const [proposals, setProposals] = useState([]);
    const [error, setError] = useState(null);

    const fetchProposals = async () => {
        try {
            const data = await getProposals();
            setProposals(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    return (
        <div className="proposal-page">
            <h1>Proposals</h1>
            {error && <div className="error">Error: {error}</div>}
            <ProposalForm isAdmin={isAdmin} memberId={memberId} onProposalSubmitted={fetchProposals} />
            <ul>
                {proposals.map((proposal) => (
                    <li key={proposal.id}>{proposal.content}</li>
                ))}
            </ul>
            {isAdmin && <AdminProposalPage />}
        </div>
    );
};

export default ProposalPage;
