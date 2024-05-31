import React from 'react';
import styles from '../../css/approval/cancelModal.css';
import '../../css/approval/cancelModal.css';

const CancelModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className="leaveModal-backdrop show"></div>
            <div className="modal fade show leaveCheckModal" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">결재선 선택 취소하기</h5>
                        </div>
                        <div className="modal-body">
                            <span>{message}</span>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-negative" onClick={onCancel}>취소</button>
                            <button type="button" className="btn btn-positive" onClick={onConfirm}>확인</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="modalOverlay show">
            <div className="modalContent">
                <div className="modalConfirmMessage">
                    {message}
                </div>
                <div className="modalActions">
                    <button onClick={onCancel}>취소</button>
                    <button onClick={onConfirm}>확인</button>
                </div>
            </div>

        </div> */}
        </>

    );
};

export default CancelModal;