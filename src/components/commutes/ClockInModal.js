import React from 'react';
import '../../css/commute/commute.css';
import { useDispatch, useSelector } from 'react-redux';
import { callInsertCommuteAPI, callSelectCommuteListAPI, callUpdateCommuteAPI } from '../../apis/CommuteAPICalls';
import Modal from 'react-modal';
import styled from 'styled-components';

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-width: 80%;
  width: 100%;
  max-height: 80%;
  overflow-y: auto;
`;

const ClockInModal = ({ isOpen, onClose, parsingDateOffset, isClocked, memberId, commuteList, handleClockIn }) => {

    console.log('parsingDateOffset : ',parsingDateOffset);

    const dispatch = useDispatch();

     /* 현재 시간 포맷 */
     let today = new Date();
     let hours = ('0' + today.getHours()).slice(-2);
     let minutes = ('0' + today.getMinutes()).slice(-2);
 
     let timeString = hours + ':' + minutes;

    const handleInsertCommute = () => {
        try {
          let newCommute = {
            memberId: memberId,
            workingDate: new Date().toISOString().slice(0, 10),
            startWork: timeString,
            workingStatus: "근무중",
            totalWorkingHours: 0,
          };
          console.log('출근 api 호출 : ', newCommute);
    
          dispatch(callInsertCommuteAPI(newCommute));
          onClose();

        } catch (error) {
          console.error('Error inserting commute:', error);
        }
      };

    return (
        isOpen && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" style={{ color: '#112D4E' }}>출근하기</h5>
                  <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                  <div style={{ color: '#112D4E' }}><h6><span style={{ fontWeight: 'bold', marginRight: '80px' }} >대상 일자</span> {parsingDateOffset}</h6></div>
                  <br />
                  <h6 style={{ color: '#112D4E' }}>오늘 출근하시겠습니까?</h6>
                </div>
                <div className="modal-footer">
                  <button onClick={onClose} style={{
                    width: '50px',
                    backgroundColor: '#ffffff',
                    color: '#112D4E',
                    border: '#112D4E 1px solid',
                    borderRadius: '5px',
                    padding: '1% 1.5%',
                    cursor: 'pointer',
                    height: '45px',
                    textDecoration: 'none'
                  }}>
                    취소
                  </button>
                  <button onClick={handleInsertCommute} style={{
                    width: '50px',
                    backgroundColor: '#112D4E',
                    color: 'white',
                    borderRadius: '5px',
                    padding: '1% 1.5%',
                    cursor: 'pointer',
                    height: '45px',
                    textDecoration: 'none'
                  }}>
                    출근
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      );
};

export default ClockInModal;