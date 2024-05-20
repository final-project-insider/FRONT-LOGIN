import { useDispatch } from 'react-redux';
import '../../css/department/department.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { callRegisterDepartmentAPI } from '../../apis/DepartmentAPICalls';
function DepartRegistModal(props) {

    const [newDepartName, setNewDepartName] = useState('');
    const { visible, onClose, departmentInformation } = props;
    const [confirmDepartName, setConfirmDepartName] = useState('');
    const navigate = useNavigate();

    if (!props.visible) return null;

    const registerDepartment = async () => {
        try {
            if (confirmDepartName === newDepartName) {
                const response = await callRegisterDepartmentAPI({
                    newDepartName: newDepartName
                });
                if (response) {
                    alert('부서를 성공적으로 등록했습니다.');
                    // props.onClose();
                    onClose();
                    navigate('/departmentAndPosition');
                    window.location.reload();
                }
            } else if (confirmDepartName !== newDepartName) {
                alert('부서명이 일치하지 않습니다. 다시 입력해주세요');
                setNewDepartName('');
                setConfirmDepartName('');
            } else {
                alert('오류가 발생했습니다. 잠시만 기달려주세요..');
                setNewDepartName('');
                setConfirmDepartName('');
            }
        } catch (error) {
            if (error.response.data === "Department name already exists") {
                alert("부서명이 이미 존재합니다")
            }
            console.error('부서명 수정하는데 오류가 발생했습니다:', error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await registerDepartment();
    }

    const handleClose = () => {
        onClose();
        navigate('/departmentAndPosition');
        // window.location.reload();
    }

    return (
        <div className="modalStyle">
            <div className="modalContentStyle">
                <h2 className='changePasswordStyle'>부서 등록</h2>
                <form onSubmit={handleSubmit}> {/* Form format */}
                    <div className='content'>
                        <div className='contentBox1'>
                            <label className='pStyle'>부서명</label>
                            <input type="text" name="newPassword1" value={newDepartName} placeholder="부서명 입력" className='inputStyle1' onChange={(e) => setNewDepartName(e.target.value)}/>
                        </div>
                        <div className='contentBox2'>
                            <label className='pStyle'>새부서명</label>
                            <input type="text" name="newPassword2" value={confirmDepartName} placeholder="새부서명 입력" className='inputStyle2' onChange={(e) => setConfirmDepartName(e.target.value)}/>
                        </div>
                    </div>
                    <br/>
                    <div className='buttonContainerStyle'>
                        <button type="button" className='closeButtonStyle' onClick={handleClose}>취소</button>
                        <button type="submit" className='confirmationButtonStyle'>등록</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DepartRegistModal;