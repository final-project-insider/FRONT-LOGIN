import React, { useEffect, useState } from 'react';
import ProposalApi from '../../apis/ProposalApi';
import ProposalForm from '../../components/proposal/ProposalForm';
import AdminProposalPage from './AdminProposalPage';

const ProposalPage = ({ memberId = 192192 }) => {
  const [proposals, setProposals] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await ProposalApi.getProposals(memberId);
        setProposals(data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    fetchProposals();
  }, [memberId]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await ProposalApi.checkIsAdmin(memberId);
        setIsAdmin(response.isAdmin); 
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [memberId]);

  return (
    <div>
      {isAdmin ? (
        <AdminProposalPage proposals={proposals} />
      ) : (
        <ProposalForm proposals={proposals} />
      )}
    </div>
  );
};

export default ProposalPage;
