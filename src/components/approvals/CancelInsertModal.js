import React from 'react';
import styles from '../../css/approval/CancelInsertModal.module.css';

const CancelInsertModal = ({ isOpen, onClose, onConfirm }) => {
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
                            <h5 className="modal-title">결재 상신 취소하기</h5>
                        </div>
                        <div className="modal-body">
                            <span>결재 상신을 취소하시겠습니까?</span>
                            <div style={{marginTop:'10px'}}>
                                <p>임시저장되지 않은 내용은 완전히 삭제됩니다.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-negative" onClick={onConfirm}>작성 취소</button>
                            <button type="button" className="btn btn-positive" onClick={onClose}>계속 등록</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                    <p>결재 상신을 취소하시겠습니까?</p>
                    <div className={styles.CancelInsertContent}>
                        <p>임시저장되지 않은 내용은</p>
                        <p>완전히 삭제됩니다.</p>
                    </div>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onConfirm}>작성 취소</button>
                    <button onClick={onClose}>계속 등록</button>
                </div>
            </div>
        </div> */}
        </>


    );
}

export default CancelInsertModal;