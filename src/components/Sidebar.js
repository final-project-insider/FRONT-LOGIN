import { Link, useLocation } from 'react-router-dom';
import '../style.css';
import '../common/common.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.css';
import 'remixicon/fonts/remixicon.css';


function Sidebar() {

    const location = useLocation();

    const underLineStyle = {
        textDecoration: 'none'
    }

    const isActiveMenu = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/' ? '' : 'nav-link-main-cal collapsed'}`} to="/">
                        <i className="bi bi-grid"></i>
                        <span>Main</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#forms-nav" data-bs-toggle="collapse">
                        <i className="bi bi-clock"></i><span>출퇴근</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="forms-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/recordCommute" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>출퇴근 내역</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/recordCorrectionOfCommute" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>출퇴근 정정 내역</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/commuteManage" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>출퇴근 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/commuteCorrectionManage" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>출퇴근 정정 관리</span>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#tables-nav" data-bs-toggle="collapse">
                        <i className="bi bi-sunglasses"></i><span>휴가</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="tables-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/myLeave" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>나의 휴가 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/leaveAccrual" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>휴가 발생 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/leaveProcessing" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>휴가 신청 처리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/leaves" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>휴가 보유 내역 조회</span>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}>
                    <Link className={`nav-link ${location.pathname === '/calendar' ? '' : 'nav-link-main-cal collapsed'}`} to="/calendar">
                        <i className="bi bi-calendar-check"></i><span>캘린더</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#charts-nav" data-bs-toggle="collapse">
                        <i className="bi bi-journal-check"></i><span>전자결재</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="charts-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/approvals" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>결재 작성하기</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/approvals?fg=given&page=0&title=&direction=DESC" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>결재 상신함</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/approvals?fg=received&page=0&title=&direction=DESC" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>결재 수신함</span>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#icons-nav" data-bs-toggle="collapse">
                        <i className="ri-organization-chart"></i><span>조직</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="icons-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/hierarchyTree" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>조직도 조회</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/ManageMember" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>구성원 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/departmentAndPosition" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>부서 및 직급 관리</span>
                            </Link>
                        </li>
                        { <li>
                            <Link to="/ProposalPage" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>건의함</span>
                            </Link>
                        </li> }
                    </ul>
                </li>
                <li className={`nav-item ${location.pathname === '/insite' ? 'active' : ''}`}>
                    <Link className={`nav-link ${location.pathname === '/insite' ? '' : 'nav-link-main-cal collapsed'}`} to="/insite">
                        <i className="bi bi-bar-chart"></i><span>인사이트</span>
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/Announces' ? 'active' : ''}`}>
                    <Link className={`nav-link ${location.pathname === '/Announces' ? '' : 'nav-link-main-cal collapsed'}`} to="/Announces">
                        <i className="bi bi-megaphone"></i><span>공지사항</span>
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/surveyList' ? 'active' : ''}`}>
                    <Link className={`nav-link ${location.pathname === '/surveyList' ? '' : 'nav-link-main-cal collapsed'}`} to="/surveyList">
                        <i className="bi bi-clipboard-check"></i><span>수요조사</span>
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/ProposalPage' ? 'active' : ''}`}>
                    <Link className={`nav-link ${location.pathname === '/ProposalPage' ? '' : 'nav-link-main-cal collapsed'}`} to="/ProposalPage">
                        <i className="bi bi-exclamation-square"></i><span>건의함</span>
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/receiveNoteList' ? 'active' : ''}`}>
                    <Link className={`nav-link ${location.pathname === '/receiveNoteList' ? '' : 'nav-link-main-cal collapsed'}`} to="/receiveNoteList">
                        <i className="bi bi-envelope"></i><span>쪽지</span>
                    </Link>
                </li>
                
            </ul>
        </aside>
    );
}

export default Sidebar;