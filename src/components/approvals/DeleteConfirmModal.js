import React from 'react';
import styles from '../../css/approval/DeleteConfirmModal.module.css'

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
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
                            <h5 className="modal-title">임시저장 삭제하기</h5>
                        </div>
                        <div className="modal-body">
                            <span>삭제하시겠습니까?</span>
                            <div style={{ marginTop: '20px'}}>
                                <p>작성한 내용은 완전히 삭제됩니다.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-negative" onClick={onCancel}>취소</button>
                            <button type="button" className="btn btn-positive" onClick={onConfirm}>확인</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*  <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalConfirmMessage}>
                    <p>삭제하시겠습니까?</p>
                    <p>작성한 내용은 완전히 삭제됩니다.</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onCancel}>취소</button>
                    <button onClick={onConfirm}>삭제</button>
                </div>
            </div>
        </div> */}
        </>


    );
};

export default DeleteConfirmModal;