import React, { useState, useEffect } from 'react';
import { getProposals } from '../../apis/ProposalApi';
const MemberProposalPage = ({ memberId }) => {
    const [proposals, setProposals] = useState([]);
    const [error, setError] = useState(null);

    const fetchProposals = async () => {
        try {
            const data = await getProposals();
            const memberProposals = data.filter(proposal => proposal.memberId === memberId);
            setProposals(memberProposals);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, [memberId]);

    return (
        <div className="proposal-page">
            <h1>Your Proposals</h1>
            {error && <div className="error">Error: {error}</div>}
            <ul>
                {proposals.map((proposal) => (
                    <li key={proposal.id}>{proposal.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default MemberProposalPage;
