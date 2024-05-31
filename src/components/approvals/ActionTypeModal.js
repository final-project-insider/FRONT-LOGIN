import React from 'react';
import styles from '../../css/approval/ActionTypeModal.module.css';


const ActionTypeModal = ({ isOpen, onClose }) => {

    if (!isOpen) {
        return;
    }

    return (
        <>
            <div className="leaveModal-backdrop show"></div>
            <div className="modal fade show leaveCheckModal" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">결재 처리하기</h5>
                        </div>
                        <div className="modal-body">
                            <span>결재 처리 방식을 선택해 주세요</span>
                        </div>
                        <div className="modal-footer">
                            {/* <button type="button" className="btn btn-negative" onClick={() => onClose(false)}>취소</button> */}
                            <button type="button" className="btn btn-positive" onClick={onClose}>확인</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                <p>결재 처리 방식을 선택해 주세요.</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>확인</button>
                </div>
            </div>
        </div> */}
        </>

    );
}

export default ActionTypeModal;