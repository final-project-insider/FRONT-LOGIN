import styled from "styled-components";
import { decodeJwt } from "../../utils/tokenUtils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callSelectCommuteListAPI, callSelectCorrectionListAPI } from "../../apis/CommuteAPICalls";

function CommuteCorrectionManage() {

    const pageTitleStyle = {
        marginBottom: '20px',
        marginTop: '20px'
    };

    const Select = styled.select`
        margin-left: 20px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 100px;
        height: 45px;
        text-align: center;
        font-size: 20px;
        border-radius: 5px;
        border-color: #D5D5D5;
        padding: '1% 1.5%',
        cursor: 'pointer',
        margin-left: '750px',
    `;

    const contentStyle = {
        marginLeft: '25px'
    };

    const tableStyle = {
        width: '97%',
        borderCollapse: 'collapse',
        textAlign: 'center',
    };

    const tableStyles = {
        tableHeaderCell: {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '15px'
        },
        tableCell1: {
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell2: {
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell3: {
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell4: {
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell5: {
            width: '20%',
            textAlign: 'center',
            padding: '10px',
        },
        evenRow: {
            backgroundColor: '#f9f9f9'
        }
    };

    const OPTIONS = [
        { value: "2024-03", name: "2024-03" },
        { value: "2024-04", name: "2024-04" },
        { value: "2024-05", name: "2024-05" }
    ];

    const SelectBox = (props) => {
        return (
            <Select>
                {props.options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        defaultValue={props.defaultValue === option.value}
                    >
                        {option.name}
                    </option>
                ))}
            </Select>
        );
    };

    /* 로그인한 유저의 토큰 복호화 */
    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    // console.log('[RecordCommute] decodedToken : ', decodedToken);
    const memberId = decodedToken.memberId;
    // console.log('[RecordCommute] memberId : ', memberId);

    /* 액션 */
    const result = useSelector(state => state.commuteReducer);
    const { commutelist, correctionlist } = result || {};
    const { currentPage, totalItems, totalPages } = correctionlist || {};

    const commuteList = result.commutelist;
    const correctionList = correctionlist?.correctionlist.result || [];
    console.log('[RecordCorrectionOfCommute] commuteList : ', commuteList);
    console.log('[RecordCorrectionOfCommute] correctionList : ', correctionList);

    console.log('result', result);

    const dispatch = useDispatch();
    const target = 'depart';
    const targetValue = null;
    const [date, setDate] = useState(new Date());

    const page = correctionlist?.correctionlist.currentPage || [];
    const size = 10;
    const sort = 'corrNo';
    const direction = 'DESC';

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    /* 출퇴근 내역, 출퇴근 정정 내역 API 호출 */
    // useEffect(() => {
    //     dispatch(callSelectCommuteListAPI(target, 1, parsingDateOffset));
    // }, [parsingDateOffset]);

    useEffect(() => {
        dispatch(callSelectCorrectionListAPI(memberId, parsingDateOffset, page, size, sort, direction));
    }, [parsingDateOffset]);

    /* 근무 일자 형식 변경 */
    const formatWorkingDate = (workingDate) => {
        const date = new Date(workingDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    /* 정정 대상 일자 가져오기 */
    const findWorkingDate = (commuteNo) => {
        // const commute = commutelist.find(item => item.commuteNo === commuteNo);
        // return commute ? commute.workingDate : '';
    };

    /* 페이징 핸들러 */
    // const handlePageChange = (page) => {
    //     dispatch({ type: SET_PAGENUMBER, payload: { page: page } });
    // };

    // const handlePrevPage = () => {
    //     if (currentPage > 0) {
    //         dispatch({ type: SET_PAGENUMBER, payload: { page: currentPage - 1 } });
    //     }
    // };

    // const handleNextPage = () => {
    //     if (currentPage < totalPages - 1) {
    //         dispatch({ type: SET_PAGENUMBER, payload: { page: currentPage + 1 } });
    //     }
    // };



    return (
        <main id="main" className="main">
            <div className="pagetitle" style={pageTitleStyle}>
                <h1>출퇴근</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">출퇴근</li>
                        <li className="breadcrumb-item active">출퇴근 정정 관리</li>
                        <SelectBox options={OPTIONS} defaultValue="2024-05"></SelectBox>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <div className="content2" style={contentStyle}>
                        <table className="table table-hover" style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 대상 일자</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">요청자</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">소속 부서</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 사유</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 상태</th>
                                </tr>
                            </thead>
                            {/* <tbody>
                                {correctionList.length > 0 ? (
                                    correctionList.map((item, index) => (
                                        <CorrectionManageItem key={item.corrNo} findWorkingDate={findWorkingDate} correction={item} tableStyles={tableStyles} evenRow={index % 2 === 0} date={formatWorkingDate(date)} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>출퇴근 정정 관리 내역이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody> */}
                        </table>
                        {/* <nav >
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={handlePrevPage}>◀</button>
                                </li>
                                {[...Array(totalPages).keys()].map((page, index) => (
                                    <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => {
                                            console.log('[page]', page);
                                            handlePageChange(page)
                                        }}>
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages - 1 && 'disabled'}`}>
                                    <button className="page-link" onClick={handleNextPage}>▶</button>
                                </li>
                            </ul>
                        </nav> */}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default CommuteCorrectionManage;