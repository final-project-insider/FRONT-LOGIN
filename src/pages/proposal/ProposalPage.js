import React, { useEffect, useState } from 'react';
import ProposalApi from '../../apis/ProposalApi';
import ProposalForm from '../../components/proposal/ProposalForm';
import AdminProposalPage from './AdminProposalPage';
import '../../css/proposal/ProposalPage.css';

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

  //   return (
  //     <div className='main'>
  //       {isAdmin ? (
  //         <AdminProposalPage proposals={proposals} />
  //       ) : (
  //         <ProposalForm proposals={proposals} />
  //       )}
  //     </div>
  //   );
  // };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1></h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item">건의함</li>
            <li className="breadcrumb-item active">건의조회</li>
          </ol>
        </nav>
        </div>
        /</main>);


  }

      export default ProposalPage;
