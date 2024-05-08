import { Link, useNavigate } from 'react-router-dom'; // react-router-dom에서 Link 가져오기
import 'bootstrap-icons/font/bootstrap-icons.css';
import { decodeJwt } from'../utils/tokenUtils';
import { useDispatch } from 'react-redux';
import { callLogoutAPI } from '../apis/MemberAPICalls';

function Header() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLogin = window.localStorage.getItem("accessToken");
    let decoded = null;

    if (isLogin !== undefined && isLogin !== null) {
        const decodedTokenInfo = decodeJwt(window.localStorage.getItem("accessToken"));
        console.log('decoded token info', decodedTokenInfo);
        decoded = decodedTokenInfo.role;
        console.log('구성원의 정보:',decoded);
    }

    const onClickLogoutHandler = () => {

        dispatch(callLogoutAPI()).then(() => {
            window.localStorage.removeItem("accessToken");
            console.log('구성원 로그아웃');
            alert('로그아웃합니다');
            navigate("/login", { replace: true });
        }).catch((error => {
            console.log("Error during logout:", error);
        }));
    };

    return (
        <header id="header" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
                {/* 홈으로 이동하는 링크 */}
                <Link to="/" className="logo d-flex align-items-center">
                    <img src="img/logo.png" alt="" />
                </Link>
            </div>
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item dropdown">
                        {/* 메시지 메뉴를 토글하는 링크 */}
                        <Link to="#" className="nav-link nav-icon">
                            <i className="bi bi-chat-right-dots"></i>
                            <span className="badge bg-primary badge-number"></span>
                        </Link>
                        {/* 알림 메뉴 */}
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                            <li className="dropdown-header">
                                You have 4 new notifications
                                <Link to="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                            </li>
                            {/* 알림 목록 */}
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        {/* 알림 메뉴를 토글하는 링크 */}
                        <Link to="#" className="nav-link nav-icon" data-bs-toggle="dropdown">
                            <i className="bi bi-bell"></i>
                            <span className="badge bg-primary badge-number">4</span>
                        </Link>
                        {/* 알림 메뉴 */}
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                            <li className="dropdown-header">
                                You have 4 new notifications
                                <Link to="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                            </li>
                            {/* 알림 목록 */}
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        {/* 쪽지 메뉴를 토글하는 링크 */}
                        <Link to="#" className="nav-link nav-icon" data-bs-toggle="dropdown">
                            <i className="bi bi-envelope"></i>
                            <span className="badge bg-success badge-number"></span>
                        </Link>
                        {/* 쪽지 메뉴 */}
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                            <li className="dropdown-header">
                                You have 3 new messages
                                <Link to="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                            </li>
                            {/* 쪽지 목록 */}
                        </ul>
                    </li>
                    <li className="nav-item dropdown pe-3">
                        {/* 프로필 메뉴를 토글하는 링크 */}
                        <Link to="#" className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                            <img src="img/profile-img.png" alt="Profile" className="rounded-circle" />
                            <span className="d-none d-md-block dropdown-toggle ps-2">user01</span>
                        </Link>
                        {/* 프로필 메뉴 */}
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>Kevin Anderson</h6>
                                <span>Web Designer</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {/* 프로필 메뉴 항목 */}
                            <li>
                                <Link to="users-profile.html" className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-person"></i>
                                    <span>My Profile</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {/* 프로필 메뉴 항목 */}
                            <li>
                                <Link to="users-profile.html" className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-gear"></i>
                                    <span>Account Settings</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {/* 프로필 메뉴 항목 */}
                            <li>
                                <Link to="#" className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-question-circle"></i>
                                    <span>Need Help?</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {/* 프로필 메뉴 항목 */}
                            <li>
                                <Link to="#" className="dropdown-item d-flex align-items-center" onClick={onClickLogoutHandler}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Sign Out</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;