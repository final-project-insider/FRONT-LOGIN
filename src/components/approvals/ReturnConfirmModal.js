import React from 'react';
import styles from '../../css/approval/ReturnConfirmModal.module.css'

const ReturnConfirmModal = ({ isOpen, onConfirm, onCancel }) => {

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
                            <h5 className="modal-title">결재 회수하기</h5>
                        </div>
                        <div className="modal-body">
                            <span>기안을 회수하시겠습니까</span>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-negative" onClick={onCancel}>취소</button>
                            <button type="button" className="btn btn-positive" onClick={onConfirm}>확인</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                    <p>기안을 회수하시겠습니까?</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onCancel}>취소</button>
                    <button onClick={onConfirm}>회수</button>
                </div>
            </div>
        </div> */}
        </>

    );

}
export default ReturnConfirmModal;