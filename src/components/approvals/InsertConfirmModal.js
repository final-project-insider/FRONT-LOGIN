import React from 'react';
import styles from '../../css/approval/InsertConfirmModal.module.css'

const InsertConfirmModal = ({ isOpen, onClose, onConfirm }) => {

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
                            <h5 className="modal-title">결재 기안하기</h5>
                        </div>
                        <div className="modal-body">
                            <span>결재를 상신하시겠습니까?</span>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-negative" onClick={onClose}>취소</button>
                            <button type="button" className="btn btn-positive" onClick={onConfirm}>등록</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                    <p>결재를 상신하시겠습니까?</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>취소</button>
                    <button onClick={onConfirm}>등록</button>
                </div>
            </div>
        </div> */}
        </>


    );
}

export default InsertConfirmModal;