import React, { useEffect, useState } from 'react';
import ProposalApi from '../../apis/ProposalApi';
import '../../css/proposal/ProposalPage.css';

const ProposalPage = ({ memberId }) => {
  const [proposals, setProposals] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const proposalsPerPage = 8;

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedProposals = proposals.slice(
      currentPage * proposalsPerPage,
      (currentPage + 1) * proposalsPerPage
  );

  const totalPages = Math.ceil(proposals.length / proposalsPerPage);

  return (
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>{isAdmin ? '관리자 건의 조회' : '건의 조회'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">건의함</li>
              <li className="breadcrumb-item active">{isAdmin ? '관리자 건의 조회' : '건의 조회'}</li>
            </ol>
          </nav>
        </div>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{isAdmin ? '관리자 건의 목록' : '건의 목록'}</h5>
              <p>작성자와 관리자만 확인이 가능합니다.</p>
              <table className="table table-striped">
                <thead>
                <tr>
                  {isAdmin && <th scope="col">순번</th>}
                  <th scope="col">내용</th>
                  <th scope="col">작성일</th>
                </tr>
                </thead>
                <tbody>
                {paginatedProposals.length > 0 ? (
                    paginatedProposals.map((proposal, index) => (
                        <tr key={index}>
                          {isAdmin && <td>{currentPage * proposalsPerPage + index + 1}</td>}
                          <td>{proposal.content}</td>
                          <td>{proposal.date}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan={isAdmin ? "3" : "2"} style={{ textAlign: 'center' }}>
                        {isAdmin ? '건의가 없습니다.' : '작성한 건의가 없습니다.'}
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
              <nav style={{ display: 'flex', justifyContent: 'center' }}>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(i)}>
                          {i + 1}
                        </button>
                      </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </main>
  );
};

export default ProposalPage;
