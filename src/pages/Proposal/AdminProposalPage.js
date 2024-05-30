import React, { useEffect, useState } from 'react';
import ProposalApi from '../../apis/ProposalApi';
import '../../css/proposal/ProposalPage.css';

const AdminProposalPage = () => {
  const [adminProposals, setAdminProposals] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const proposalsPerPage = 8;

  useEffect(() => {
    const fetchAdminProposals = async () => {
      try {
        const data = await ProposalApi.getAllProposals();
        setAdminProposals(data);
      } catch (error) {
        console.error('Error fetching admin proposals:', error);
      }
    };

    fetchAdminProposals();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedProposals = adminProposals.slice(
      currentPage * proposalsPerPage,
      (currentPage + 1) * proposalsPerPage
  );

  const totalPages = Math.ceil(adminProposals.length / proposalsPerPage);

  return (
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>관리자 건의 조회</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">건의함</li>
              <li className="breadcrumb-item active">관리자 건의 조회</li>
            </ol>
          </nav>
        </div>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">관리자 건의 목록</h5>
              <table className="table table-striped">
                <thead>
                <tr>
                  <th scope="col">순번</th>
                  <th scope="col">내용</th>
                  <th scope="col">작성일</th>
                </tr>
                </thead>
                <tbody>
                {paginatedProposals.length > 0 ? (
                    paginatedProposals.map((proposal, index) => (
                        <tr key={index}>
                          <td>{currentPage * proposalsPerPage + index + 1}</td>
                          <td>{proposal.content}</td>
                          <td>{proposal.date}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center' }}>건의가 없습니다.</td>
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

export default AdminProposalPage;
