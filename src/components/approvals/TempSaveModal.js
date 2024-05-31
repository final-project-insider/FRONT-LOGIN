import styles from '../../css/approval/TempSaveModal.module.css';

const TempSaveModal = ({ isOpen, onClose }) => {

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
                            <h5 className="modal-title">임시저장하기</h5>
                        </div>
                        <div className="modal-body">
                            <span>임시저장되었습니다.</span>
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
                <p>임시저장되었습니다.</p>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </div> */}
        </>

    );
}

export default TempSaveModal;