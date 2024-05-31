import styles from '../../css/approval/InsertSuccessModal.module.css';

const InsertSuccessModal = ({ isOpen, onClose }) => {
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
                            <span>결재가 상신되었습니다</span>
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
                <p>결재가 상신되었습니다.</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>확인</button>
                </div>
            </div>
        </div> */}
        </>

    );
}

export default InsertSuccessModal;