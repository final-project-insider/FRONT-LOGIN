import React from 'react';
import ProposalApi from '../../apis/ProposalApi';

const AdminProposalPage = () => {
    const [proposals, setProposals] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const data = await getProposals();
                setProposals(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProposals();
    }, []);

    const handleDeleteProposal = async (proposalId) => {
        try {
            await deleteProposal(proposalId);
            setProposals(proposals.filter(proposal => proposal.id !== proposalId));
        } catch (error) {
            console.error('Error deleting proposal:', error);
        }
    };

    return (
        <div className="admin-proposal-page">
            <h1>All Proposals</h1>
            {error && <div className="error">Error: {error}</div>}
            <ul>
                {proposals.map((proposal) => (
                    <li key={proposal.id}>
                        {proposal.content}
                        <button onClick={() => handleDeleteProposal(proposal.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminProposalPage;
