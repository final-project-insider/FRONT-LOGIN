import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { callDepartmentDetailListAPI } from '../../apis/DepartmentAPICalls';
import { callPositionDetailListAPI } from '../../apis/PositionAPICalls';
import DepartNameModal from './DepartNameModal';
import DepartRegistModal from './DepartRegistModal';
import PositionRegisterModal from './PositionRegisterModal';
import PositionNameModal from './PositionNameModal';
import DepartDeleteModal from './DepartDeleteModal';
import PositionDeleteModal from './PositionDeleteModal';
import DepartPeopleModal from './DepartPeopleModal';
import PositionPeopleModal from './PositionPeopleModal';
import departmentAndPositionCSS from './departmentAndPosition.module.css';

function DepartmentAndPosition() {
    const [filteredDepartInfo, setFilteredDepartInfo] = useState([]);
    const [filteredPositionInfo, setFilteredPositionInfo] = useState([]);
    const [position, setPosition] = useState([]);
    const navigate = useNavigate();
    const [departmentSortConfig, setDepartmentSortConfig] = useState({ key: null, direction: 'ascending' });
    const [positionSortConfig, setPositionSortConfig] = useState({ key: null, direction: 'ascending' });
    const [department, setDepartment] = useState([]);
    const searchButtonRef1 = useRef(null);
    const searchButtonRef2 = useRef(null);
    const [changePositionNameModalVisible, setChangePositionNameModalVisible] = useState(false);
    const [registerDepartmentModalVisible, setRegisterDepartmentModalVisible] = useState(false);
    const [changeDepartmentNameModalVisible, setChangeDepartmentNameModalVisible] = useState(false);
    const [registerPositionModalVisible, setRegisterPositionModalVisible] = useState(false);
    const [deleteDepartmentModalVisible, setDeleteDepartmentModalVisible] = useState(false);
    const [deletePositionModalVisible, setDeletePositionModalVisible] = useState(false);
    const [departPeopleModalVisible, setDepartPeopleModalVisible] = useState(false);
    const [positionPeopleModalVisible, setPositionPeopleModalVisible] = useState(false);
    const [departmentInfos, setDepartmentInfos] = useState([]);
    const [positionInfos, setPositionInfos] = useState([]);
    const location = useLocation();
    const [positionSearch, setPositionSearch] = useState('');
    const [departSearch, setDepartSearch] = useState('');

    const fetchDepartmentDetails = async () => {
        try {
            const departmentDetailList = await callDepartmentDetailListAPI();
            if (Array.isArray(departmentDetailList)) {
                setDepartment(departmentDetailList);
                setFilteredDepartInfo(departmentDetailList);
            } else {
                console.error('department details is not an array:', departmentDetailList);
            }
        } catch (error) {
            console.error('부서 리스트를 불러 오는데 오류가 발생했습니다:', error);
        }
    }

    const fetchPositionDetails = async () => {
        try {
            const positionDetailList = await callPositionDetailListAPI();
            if (Array.isArray(positionDetailList)) {
                setPosition(positionDetailList);
                setFilteredPositionInfo(positionDetailList);
            } else {
                console.error('position details is not an array:', positionDetailList);
            }
        } catch (error) {
            console.error('직급 리스트를 불러 오는데 오류가 발생했습니다:', error);
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const departQuery = params.get('searchDepartName') || '';
        const positionQuery = params.get('searchPositionName') || '';

        setDepartSearch(departQuery);
        setPositionSearch(positionQuery);

        if (departQuery) {
            handleSearchForDepartment(departQuery);
        } else {
            setFilteredDepartInfo(department);
        }

        if (positionQuery) {
            handleSearchForPosition(positionQuery);
        } else {
            setFilteredPositionInfo(position);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchDepartmentDetails();
            await fetchPositionDetails();
            sortData2('positionLevel');
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                searchButtonRef1.current.click();
                searchButtonRef2.current.click();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const sortData1 = (key) => {
        let direction = 'ascending';
        if (departmentSortConfig.key === key && departmentSortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setDepartmentSortConfig({ key, direction });
    }

    const sortData2 = (key) => {
        let direction = 'ascending';
        if (positionSortConfig.key === key && positionSortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setPositionSortConfig({ key, direction });
    }

    const getValueForSorting = (value) => {
        if (positionSortConfig.key === 'positionLevel' || departmentSortConfig.key === 'noOfPeople') {
            return parseFloat(value) || 0;
        }
        return value;
    }

    const sortedDepartment = useMemo(() => {
        let sortableDepartment = [...filteredDepartInfo];

        if (departmentSortConfig.key !== null) {
            sortableDepartment.sort((a, b) => {
                const valueA = getValueForSorting(a[departmentSortConfig.key]);
                const valueB = getValueForSorting(b[departmentSortConfig.key]);

                if (valueA < valueB) {
                    return departmentSortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (valueA > valueB) {
                    return departmentSortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableDepartment;
    }, [filteredDepartInfo, departmentSortConfig]);

    const sortedPosition = useMemo(() => {
        let sortablePosition = [...filteredPositionInfo];

        if (positionSortConfig.key !== null) {
            sortablePosition.sort((a, b) => {
                const valueA = getValueForSorting(a[positionSortConfig.key]);
                const valueB = getValueForSorting(b[positionSortConfig.key]);

                if (valueA < valueB) {
                    return positionSortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (valueA > valueB) {
                    return positionSortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortablePosition;
    }, [filteredPositionInfo, positionSortConfig]);

    const handleSearchForDepartment = (searchQuery) => {
        let results;
        if (searchQuery.trim() === '') {
            setFilteredDepartInfo(department);
            navigate('/departmentAndPosition', { replace: true });
        } else {
            results = department.filter(dept => dept.departName.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredDepartInfo(results);
            navigate(`?searchDepartName=${searchQuery}`, { replace: true });
        }
    };

    const handleSearchForPosition = (searchQuery) => {
        let results;
        if (searchQuery.trim() === '') {
            setFilteredPositionInfo(position);
            navigate('/departmentAndPosition', { replace: true });
        } else {
            results = position.filter(pos => pos.positionName.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredPositionInfo(results);
            navigate(`?searchPositionName=${searchQuery}`, { replace: true });
        }
    };

    const handlePositionNameChange = (position) => {
        setPositionInfos(position);
        setChangePositionNameModalVisible(true);
        window.history.replaceState(null, '', `/departmentAndPosition/${position.positionName}`)
    }

    const handleDepartmentNameChange = (department) => {
        setDepartmentInfos(department);
        setChangeDepartmentNameModalVisible(true);
        window.history.replaceState(null, '', `/departmentAndPosition/${department.departNo}`)
    }

    const handleDeletePosition = () => {
        setDeletePositionModalVisible(true);
    }

    const handleDeleteDepartment = () => {
        setDeleteDepartmentModalVisible(true);
    }

    const handleRegisterDepartment = () => {
        setRegisterDepartmentModalVisible(true);
    }

    const handleRegisterPosition = () => {
        setRegisterPositionModalVisible(true);
    }

    const handleShowPosition = (position) => {
        setPositionInfos(position);
        setPositionPeopleModalVisible(true);
    }

    const handleShowDepartment = (department) => {
        setDepartmentInfos(department);
        setDepartPeopleModalVisible(true);
    }

    const handleCloseModal = () => {
        setDeletePositionModalVisible(false);
        setDeleteDepartmentModalVisible(false);
        setChangeDepartmentNameModalVisible(false);
        setChangePositionNameModalVisible(false);
        setRegisterDepartmentModalVisible(false);
        setRegisterPositionModalVisible(false);
        setDepartPeopleModalVisible(false);
        setPositionPeopleModalVisible(false);
    }

    return (
        <main id="main" className={`main ${departmentAndPositionCSS.mainPage}`}>
            <div className="pagetitle">
                <h1>구성원 관리</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">조직</li>
                        <li className="breadcrumb-item active">부서 및 직급 관리</li>
                    </ol>
                </nav>
            </div>
            <div className={`col-lg-12 ${departmentAndPositionCSS.bothPages}`}>
                <div className={`card ${departmentAndPositionCSS.firstPage}`}>
                    <div className={departmentAndPositionCSS.firstBox}>
                        <div className={departmentAndPositionCSS.innerBox}>
                            <div className={departmentAndPositionCSS.searchDepart}>부서명 검색</div>
                            <input 
                                className={`inputStyle ${departmentAndPositionCSS.inputBox}`}
                                placeholder=" 부서명"
                                type="text" 
                                value={departSearch} 
                                onChange={(e) => setDepartSearch(e.target.value)} 
                            />
                            <button className={departmentAndPositionCSS.searchButtonfordepartAndPos} onClick={() => handleSearchForDepartment(departSearch)} ref={searchButtonRef1}>검색</button>
                        </div>
                        <div className={departmentAndPositionCSS.buttonClass}>
                            <button className={departmentAndPositionCSS.registerButton} onClick={handleRegisterDepartment}>등록</button>
                            <button className={departmentAndPositionCSS.deleteButton} onClick={handleDeleteDepartment}>삭제</button>
                        </div>
                    </div>
                    {filteredDepartInfo.length === 0 ? (
                        <div className="noResult">
                            <i className="bi exclamation-circle"></i>
                            <div className="noResultBox">
                                <div className="noResultText1">검색결과 없음</div><br />
                                <div className="noResultText2">모든 단어의 맞춤법이 정확한지 확인하거나 다른 검색어로 검색해 보세요</div>
                            </div>
                        </div>
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th onClick={() => sortData1('departName')}>
                                        <span>부서명</span><i className="bx bxs-sort-alt" />
                                    </th>
                                    <th onClick={() => sortData1('noOfPeople')}>
                                        <span>인원수</span><i className="bx bxs-sort-alt" />
                                    </th>
                                    <th>
                                        <span>부서명 수정</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedDepartment.map((department, index) => (
                                    <tr key={index}>
                                        <td className={departmentAndPositionCSS.alignCenter}>
                                            <div className={departmentAndPositionCSS.memberProfile} style={{ cursor: 'pointer' }} onClick={() => handleShowDepartment(department)}>
                                                {department.departName}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={departmentAndPositionCSS.memberProfile}>
                                                {department.noOfPeople}
                                            </div>
                                        </td>
                                        <td>
                                            <button className={departmentAndPositionCSS.changeButton} onClick={() => handleDepartmentNameChange(department)}>수정</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className={`card ${departmentAndPositionCSS.secondPage}`}>
                    <div className={departmentAndPositionCSS.firstBox}>
                        <div className={departmentAndPositionCSS.innerBox}>
                            <div className={departmentAndPositionCSS.searchDepart}>직급명 검색</div>
                            <input 
                                className={`inputStyle ${departmentAndPositionCSS.inputBox}`}
                                placeholder=" 직급명"
                                type="text"
                                value={positionSearch} 
                                onChange={(e) => setPositionSearch(e.target.value)} 
                            />
                            <button className={departmentAndPositionCSS.searchButtonfordepartAndPos} onClick={() => handleSearchForPosition(positionSearch)} ref={searchButtonRef2}>검색</button>
                        </div>
                        <div className={departmentAndPositionCSS.buttonClass}>
                            <button className={departmentAndPositionCSS.registerButton} onClick={handleRegisterPosition}>등록</button>
                            <button className={departmentAndPositionCSS.deleteButton} onClick={handleDeletePosition}>삭제</button>
                        </div>
                    </div>
                    {filteredPositionInfo.length === 0 ? (
                        <div className="noResult">
                            <i className="bi exclamation-circle"></i>
                            <div className="noResultBox">
                                <div className="noResultText1">검색결과 없음</div><br />
                                <div className="noResultText2">모든 단어의 맞춤법이 정확한지 확인하거나 다른 검색어로 검색해 보세요</div>
                            </div>
                        </div>
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th onClick={() => sortData2('positionName')}>
                                        <span>직급명</span><i className="bx bxs-sort-alt" />
                                    </th>
                                    <th onClick={() => sortData2('positionLevel')}>
                                        <span>직급 레벨</span><i className="bx bxs-sort-alt" />
                                    </th>
                                    <th onClick={() => sortData2('noOfPeople')}>
                                        <span>인원수</span><i className="bx bxs-sort-alt" />
                                    </th>
                                    <th>
                                        <span>직급명 수정</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPosition.map((position, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className={departmentAndPositionCSS.memberProfile} style={{ cursor: 'pointer' }} onClick={() => handleShowPosition(position)}>
                                                {position.positionName}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={departmentAndPositionCSS.memberProfile}>
                                                {position.positionLevel}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={departmentAndPositionCSS.memberProfile}>
                                                {position.noOfPeople}
                                            </div>
                                        </td>
                                        <td>
                                            <button className={departmentAndPositionCSS.changeButton} onClick={() => handlePositionNameChange(position)}>수정</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <PositionDeleteModal visible={deletePositionModalVisible} onClose={handleCloseModal} positionInformation={positionInfos} />
            <DepartDeleteModal visible={deleteDepartmentModalVisible} onClose={handleCloseModal} departmentInformation={departmentInfos}/>
            <PositionRegisterModal visible={registerPositionModalVisible} onClose={handleCloseModal} positionInformation={positionInfos}/>
            <PositionNameModal visible={changePositionNameModalVisible} onClose={handleCloseModal} positionInformation={positionInfos} />
            <DepartRegistModal visible={registerDepartmentModalVisible} onClose={handleCloseModal} departmentInformation={departmentInfos} />
            <DepartNameModal visible={changeDepartmentNameModalVisible} onClose={handleCloseModal} departmentInformation={departmentInfos} />
            <DepartPeopleModal visible={departPeopleModalVisible} onClose={handleCloseModal} departmentInformation={departmentInfos} />
            <PositionPeopleModal visible={positionPeopleModalVisible} onClose={handleCloseModal} positionInformation={positionInfos} />
        </main>
    );
}

export default DepartmentAndPosition;
