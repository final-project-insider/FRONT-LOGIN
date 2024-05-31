import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMemberAPI } from "../../apis/ApprovalAPI";
import CancelModal from "./CancelModal";
import modalStyles from '../../css/approval/ApproverModal.module.css';
import { decodeJwt } from "../../utils/tokenUtils";

const ApproverModal = ({ isOpen, onRequestClose, onSave, selectedApproverLine, selectedReferencerLine }) => {

    const dispatch = useDispatch();
    const members = useSelector(state => state.approval.members) || [];
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedMembersForRemove, setSelectedMembersForRemove] = useState([]);
    const [approverLine, setApproverLine] = useState([]);
    const [referencerLine, setReferencerLine] = useState([]);
    const [expandedDepartments, setExpandedDepartments] = useState([]);
    const [isCancelMocalOpen, setIsCancelModalOpen] = useState(false);
    // const [initialApproverLine, setInitialApproverLine] = useState([]);
    // const [initialReferencerLine, setInitialReferencerLine] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            console.log("모달이 열려 있습니다. API 호출을 시작합니다.");
            dispatch(getAllMemberAPI());

            const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
            setCurrentUserId(decodedToken.memberId);

            setApproverLine([...selectedApproverLine]);
            setReferencerLine([...selectedReferencerLine]);

        }
    }, [isOpen, dispatch, selectedApproverLine, selectedReferencerLine]);

    useEffect(() => {
        console.log("members 상태가 업데이트되었습니다:", members);
    }, [members]);


    const handleSelectMember = (member) => {
        if (approverLine.some(appr => appr.memberId === member.memberId) || referencerLine.some(ref => ref.memberId === member.memberId) || member.memberId === currentUserId) {
            console.log("이미 선택된 사원입니다. :" + member.name);
            return; // 이미 선택된 사원은 선택할 수 없게 함
        }
        else {
            console.log('선택되지 않은 사원입니다. : ' + approverLine.some(appr => appr.memberId === member.memberId));
        }
        //사원목록에서 사원을 선택하거나 선택 해제
        // if (!approverLine.includes(member) && !referencerLine.includes(member) && member.memberId !== currentUserId) {
        setSelectedMembers(prev => {
            if (prev.some(m => m.memberId === member.memberId)) {
                return prev.filter(m => m.memberId !== member.memberId);
            } else {
                return [...prev, member];
            }
        });
        // }

    };

    useEffect(() => {
        console.log('현재 결재라인 : ' + JSON.stringify(approverLine));


    }, [approverLine]);

    useEffect(() => {
        const departmentsWithResults = new Set(filteredMembers.map(member => member.departName));
        setExpandedDepartments([...departmentsWithResults]);
    }, [searchTerm]);

    const addToApproverLine = () => {
        //선택한 사원들을 결재선에 추가. 현재 사용자 제외
        const newApproverLine = selectedMembers.filter(member => member.memberId != currentUserId && !approverLine.some(appr => appr.memberId === member.memberId) && !selectedApproverLine.some(appr => appr.memberId === member.memberId));
        setApproverLine([...approverLine, ...newApproverLine]);
        setSelectedMembers([]);
        setSelectedMembersForRemove([]);    //추가 후 선택된 멤버 초기화

        // setApproverLine(prev => {
        //     if (prev.includes(member)) {
        //         return prev.filter(m => m !== member);
        //     } else {
        //         return [...prev, member];
        //     }
        // });
    };

    const addToReferencerLine = () => {
        //선택한 사원들을 참조선에 추가. 현재 사용자 제외
        const newReferencerLine = selectedMembers.filter(member => member.memberId != currentUserId && !referencerLine.some(ref => ref.memberId === member.memberId) && !selectedReferencerLine.some(ref => ref.memberId === member.memberId));
        setReferencerLine([...referencerLine, ...newReferencerLine]);
        setSelectedMembers([]);
        setSelectedMembersForRemove([]);    //추가 후 선택된 멤버 초기화
        // setReferencerLine(prev => {
        //     if (prev.includes(member)) {
        //         return prev.filter(m => m !== member);
        //     } else {
        //         return [...prev, member];
        //     }
        // });
    };

    const toggleDepartment = (departmentName) => {
        setExpandedDepartments(prev => {
            if (prev.includes(departmentName)) {
                return prev.filter(dep => dep !== departmentName)
            } else {
                return [...prev, departmentName];
            }
        });
    };

    const handlerMemberSelect = (member) => {
        setSelectedMembers(member);
    };

    const handleMemberRemoveSelect = (member) => {
        if (selectedMembersForRemove.some(m => m.memberId === member.memberId)) {
            setSelectedMembersForRemove(selectedMembersForRemove.filter(m => m.memberId !== member.memberId));
        } else {
            setSelectedMembersForRemove([...selectedMembersForRemove, member]);
        }
    };

    const removeFromApproverLine = () => {
        const membersToRemove = selectedMembersForRemove.filter(member => approverLine.some(appr => appr.memberId === member.memberId));
        setApproverLine(approverLine.filter(member => !membersToRemove.some(m => m.memberId === member.memberId)));
        setSelectedMembers(prev => prev.filter(member => !membersToRemove.some(m => m.memberId === member.memberId)));
        setSelectedMembersForRemove([]);
    };

    const removeFromReferencerLine = () => {
        const membersToRemove = selectedMembersForRemove.filter(member => referencerLine.some(ref => ref.memberId === member.memberId));
        setReferencerLine(referencerLine.filter(member => !membersToRemove.some(m => m.memberId === member.memberId)));
        setSelectedMembers(prev => prev.filter(member => !membersToRemove.some(m => m.memberId === member.memberId)));
        setSelectedMembersForRemove([]);
    };

    const handleSave = () => {
        if (approverLine.length === 0) {
            alert('결재선이 선택되지 않았습니다. 결재선을 선택해주세요.');
        }
        else {
            // setInitialApproverLine([...approverLine]);
            // setInitialReferencerLine([...referencerLine]);
            onSave(approverLine, referencerLine);
            setSearchTerm('');
            onRequestClose();
        }
    };

    const handleClose = () => {
        const isApproverLineChanged = JSON.stringify(selectedApproverLine) !== JSON.stringify(approverLine);
        const isReferencerLineChanged = JSON.stringify(selectedReferencerLine) !== JSON.stringify(referencerLine);

        if (isApproverLineChanged || isReferencerLineChanged) {
            setIsCancelModalOpen(true);
        }
        else {
            onRequestClose();
        }

    }

    const handleConfirmClose = () => {
        setSelectedMembers([]);
        setApproverLine([...selectedApproverLine]);
        setReferencerLine([...selectedReferencerLine]);
        setExpandedDepartments([]);
        setSearchTerm('');
        setIsCancelModalOpen(false);
        onRequestClose();
    };

    const handleCancelClose = () => {
        setIsCancelModalOpen(false);

    };

    const handleSelectApproverLineMember = (member) => {
        setSelectedMembersForRemove(prev => {
            if (prev.some(m => m.memberId === member.memberId)) {
                return prev.filter(m => m.memberId !== member.memberId);
            } else {
                return [...prev, member];
            }
        });
    };

    const handleSelectReferencerLineMember = (member) => {
        setSelectedMembersForRemove(prev => {
            if (prev.some(m => m.memberId === member.memberId)) {
                return prev.filter(m => m.memberId !== member.memberId);
            } else {
                return [...prev, member];
            }
        });
    };

    const departments = [...new Set(members.map(member => member.departName))];

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.departName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const moveUp = (line, setLine, index) => {
        if (index === 0) {
            return;
        }

        const newLine = [...line];
        [newLine[index], newLine[index - 1]] = [newLine[index - 1], newLine[index]];
        setLine(newLine);
    };

    const moveDown = (line, setLine, index) => {
        if (index === line.length - 1) {
            return;
        }
        const newLine = [...line];
        [newLine[index], newLine[index + 1]] = [newLine[index + 1], newLine[index]];
        setLine(newLine);
    };

    return (
        <>
            <div className={`${modalStyles.modalOverlay} ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className={modalStyles.ApproverModalContent}>
                    <div style={{ fontWeight: 'bold', fontSize: '23px', marginBottom: '10px' }}>결재자 선택</div>
                    <div className={modalStyles.ApproverModalBody}>
                        <div className={modalStyles.ApproverMemberList}>
                            <div className={modalStyles.memberListTitle}>
                                <div style={{ fontSize: "20px", fontWeight: "bold" }}>사원 목록</div>
                                <div className={modalStyles.searchContainer}>
                                    <input
                                        type="text"
                                        placeholder="검색"
                                        value={searchTerm}
                                        onChange={((e) => setSearchTerm(e.target.value))}
                                        className={modalStyles.searchInput}
                                    />
                                    <button onClick={() => setSearchTerm('')} className={modalStyles.clearButton}>X</button>
                                </div>
                            </div>
                            <div className={modalStyles.ApproverDepartmentList}>
                                {departments.map(department => (
                                    <div key={department}>
                                        <div className={modalStyles.ApproverDepartmentHeader} onClick={() => toggleDepartment(department)}>
                                            <span style={{ color: "#5869F3" }}>{expandedDepartments.includes(department) ? '∧' : '∨'}</span>
                                            <span>{department}</span>
                                        </div>
                                        {expandedDepartments.includes(department) && (
                                            <div className={modalStyles.ApproverMembers}>
                                                {filteredMembers.filter(member => member.departName === department).map(member => (
                                                    <div key={member.memberId} className={modalStyles.ApproverMemberItem} onClick={() => handleSelectMember(member)}>
                                                        <input
                                                            type="checkbox"
                                                            checked={approverLine.some(appr => appr.memberId === member.memberId) || referencerLine.some(ref => ref.memberId === member.memberId) || member.memberId === currentUserId || selectedMembers.some(m => m.memberId === member.memberId)}
                                                            onChange={() => handleSelectMember(member)}
                                                            disabled={approverLine.some(appr => appr.memberId === member.memberId) || referencerLine.some(ref => ref.memberId === member.memberId) || member.memberId === currentUserId}
                                                            style={{
                                                                cursor: (approverLine.some(appr => appr.memberId === member.memberId) || referencerLine.some(ref => ref.memberId === member.memberId) || member.memberId === currentUserId) ? 'not-allowed' : 'pointer',
                                                                color: (approverLine.some(appr => appr.memberId === member.memberId) || referencerLine.some(ref => ref.memberId === member.memberId) || member.memberId === currentUserId) ? 'gray' : 'black'
                                                            }}
                                                        />
                                                        {member.positionName}  {member.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={modalStyles.ApproverButtons}>
                            <div className={modalStyles.ApproverButtonsApprover}>
                                <button className={modalStyles.AppPlusBtn} onClick={addToApproverLine}> +</button>
                                <button className={modalStyles.AppMinusBtn} onClick={removeFromApproverLine}> -</button>
                            </div>
                            <div className={modalStyles.ApproverButtonsReferencer}>
                                <button className={modalStyles.AppPlusBtn} onClick={addToReferencerLine}> +</button>
                                <button className={modalStyles.AppMinusBtn} onClick={removeFromReferencerLine}> -</button>
                            </div>
                        </div>
                        <div className={modalStyles.SeletBox}>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>결재선</div>
                                <div className={modalStyles.SelectBoxApproverLine}>
                                    <table className={modalStyles.SelectBoxApproverTable}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '70px', marginLeft: '10px' }}></th>
                                                <th>순번</th>
                                                <th>부서</th>
                                                <th>직급명</th>
                                                <th>이름</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {approverLine.map((approver, index) => (
                                                <tr key={approver.memberId} className={modalStyles.approvalItem} onClick={() => handleSelectApproverLineMember(approver)}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedMembersForRemove.includes(approver)}
                                                            onChange={() => handleMemberRemoveSelect(approver)}
                                                        />
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>{approver.departName}</td>
                                                    <td>{approver.positionName}</td>
                                                    <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{approver.name}</td>
                                                    <td style={{ width: '100px' }}>
                                                        <button className={modalStyles.moveButton} onClick={() => moveUp(approverLine, setApproverLine, index)}>↑</button>
                                                        <button className={modalStyles.moveButton} onClick={() => moveDown(approverLine, setApproverLine, index)}>↓</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>참조선</div>
                                <div className={modalStyles.SelectBoxReferencerLine}>
                                    <table className={modalStyles.SelectBoxApproverTable}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '70px', marginLeft: '10px' }}></th>
                                                <th>순번</th>
                                                <th>부서</th>
                                                <th>직급명</th>
                                                <th>이름</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {referencerLine.map((referencer, index) => (
                                                <tr key={referencer.memberId} className={modalStyles.approvalItem} onClick={() => handleSelectReferencerLineMember(referencer)}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedMembersForRemove.includes(referencer)}
                                                            onChange={() => handleMemberRemoveSelect(referencer)}
                                                        />
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>{referencer.departName}</td>
                                                    <td>{referencer.positionName}</td>
                                                    <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{referencer.name}</td>
                                                    <td style={{ width: '100px' }}>
                                                        <button className={modalStyles.moveButton} onClick={() => moveUp(referencerLine, setReferencerLine, index)}>↑</button>
                                                        <button className={modalStyles.moveButton} onClick={() => moveDown(referencerLine, setReferencerLine, index)}>↓</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className={modalStyles.modalActions} style={{ textAlign: 'right ' }}>
                        <button onClick={handleClose}>닫기</button>
                        <button onClick={handleSave}>저장</button>
                    </div>
                </div>

            </div>
            <CancelModal
                isOpen={isCancelMocalOpen}
                message={<><div>결재자 선택창을 닫으시겠습니까?</div>
                    <div>마지막 저장 후 수정된 내용은 저장되지 않습니다.</div></>}
                onConfirm={handleConfirmClose}
                onCancel={handleCancelClose}
            />
        </>
    );

};

export default ApproverModal;