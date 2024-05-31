// import React, { useState, useRef, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useNavigate } from 'react-router';
// import styles from '../../css/approval/ApprovalInsert.module.css';
// import SelectFormComponent from '../../components/approvals/SelectFormComponent';
// import TinyEditor from '../../components/approvals/TinyEditor';
// import UserInfoComponent from '../../components/approvals/UserInfoComponent';
// import { decodeJwt } from '../../utils/tokenUtils';
// import ApproverModal from '../../components/approvals/ApproverModal';
// import InsertConfirmModal from '../../components/approvals/InsertConfirmModal';
// import InsertSuccessModal from '../../components/approvals/InsertSuccessModal';
// import InsertFailModal from '../../components/approvals/InsertFailModal';
// import WarningModal from '../../components/approvals/WarningModal';
// import TempSaveModal from '../../components/approvals/TempSaveModal';
// import CancelInsertModal from '../../components/approvals/CancelInsertModal';
// import { getApprovalDetailAPI, submitApprovalAPI, updateApprovalAPI } from '../../apis/ApprovalAPI';
// import { textFieldClasses } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// const ApprovalTempRewrite = () => {

//     const { approvalNo } = useParams();
//     const [formContent, setFormContent] = useState('');
//     const [initialFormContent, setInitialFormContent] = useState('');
//     const [selectedForm, setSelectedForm] = useState(null);
//     const [yearFormNo, setYearFormNo] = useState('');
//     const [isRemovingBogusBr, setIsRemovingBogusBr] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [approverLine, setApproverLine] = useState([]);
//     const [referencerLine, setReferencerLine] = useState([]);
//     const [title, setTitle] = useState('');
//     const [titleError, setTitleError] = useState('');
//     const [files, setFiles] = useState([]);
//     const [isInsertConfirmModalOpen, setIsInsertConfirmModalOpen] = useState(false);
//     const [isInsertSuccessModalOpen, setIsInsertSuccessModalOpen] = useState(false);
//     const [isInsertFaiilModalOpen, setIsInsertFailModalOpen] = useState(false);
//     const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
//     const [isTempSaveModalOpen, setIsTempSaveModalOpen] = useState(false);
//     const [isCancelInsertModalOpen, setisCancelInsertModalOpen] = useState(false);
//     const [warningMessage, setWarnngMessage] = useState('');
//     const editorRef = useRef(null);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
//     const memberId = decodeJwt.memberId;

//     useEffect(() => {
//         if (approvalNo) {
//             dispatch(getApprovalDetailAPI(approvalNo)).tent((response) => {
//                 const approvalDetail = response.payload;
//                 setTitle(approvalDetail.approvalTitle);
//                 setFormContent(approvalDetail.approvalContent);
//                 setInitialFormContent(approvalDetail.approvalContent);
//                 setSelectedForm({ formNo: approvalDetail.formNo, formShape: approvalDetail.formShape });
//                 setApproverLine(approvalDetail.approver);
//                 setReferencerLine(approvalDetail.referencer);
//                 setFiles(approvalDetail.attachment || []);

//                 const currentYear = new Date().getFullYear();
//                 const approvalNumber = `${currentYear}-${approvalDetail.formNo}`;

//                 setYearFormNo(approvalNumber);

//                 if (editorRef.current) {
//                     editorRef.current.setContent(approvalDetail.approvalContent);
//                     editorRef.current.undoManager.clear();
//                     setEditableElements(editorRef.current.getDoc());
//                     insertCurrentDate(editorRef.current.getDoc());
//                     removeBogusBrTags();
//                 }
//             });
//         }
//     }, [dispatch, approvalNo]);

//     const handleSelectForm = (selectedForm) => {
//         setSelectedForm(selectedForm);

//         if (selectedForm && selectedForm.formShape) {
//             const htmlContent = selectedForm.formShape;
//             setFormContent(htmlContent);
//             setInitialFormContent(htmlContent);

//             const currentYear = new Date().getFullYear();
//             const approvalNumber = `${currentYear}-${selectedForm.formNo}`;
//             setYearFormNo(approvalNumber);

//             if (editorRef.current) {
//                 editorRef.current.setContent(htmlContent);
//                 editorRef.current.undoManager.clear();
//                 setEditableElements(editorRef.current.getDoc());
//                 insertCurrentDate(editorRef.current.getDoc());
//                 removeBogusBrTags();
//             }
//         }
//     };

//     const handleEditorChange = (content) => {
//         setFormContent(content);
//     };


//     const handleFileChange = (e) => {
//         const selectedFiles = e.target.files;
//         const maxSize = 10 * 1024 * 1024; 

//         for (let i = 0; i < selectedFiles.length; i++){
//             if(selectedFiles[i].size > maxSize){
//                 setWarnngMessage('파일의 크기가 너무 큽니다. 파일은 최대 10MB까지 첨부 가능합니다.');
//                 setIsWarningModalOpen(true);
//                 return;
//             }
//         }

//         setFiles([...files, ...e.target.files]);
//     };

//     const handleFileRemove = (index) => {
//         const newFiles = [...files];
//         newFiles.splice(index, 1);
//         setFiles(newFiles);
//     };

//     const handleTitleChange = (e) => {
//         const newTitle = e.target.value;

//         if(newTitle.length <= 50){
//             setTitle(newTitle);
//             setWarnngMessage('');
//         }else{
//             setWarnngMessage('제목은 50자를 초과할 수 없습니다.');
//             setIsWarningModalOpen(true);
//         }
//     };

//     const stripHtmlExceptDate = (html) => {
//         const tempDiv = document.createElement('div');
//         tempDiv.innerHTML = html;
//         const dateElement = tempDiv.querySelector('#date');
//         if(dateElement){
//             dateElement.remove();
//         }

//         return tempDiv.textContent || tempDiv.innerHTML || '';
//     };

//     const validateForm = (status) => {
//         if (status === '처리 중' && textFieldClasses.trim() === ''){
//             setWarnngMessage('제목이 입력되지 않았습니다.');
//             setIsWarningModalOpen(true);
//             return false;
//         }

//         const strippedFormContent = stripHtmlExceptDate(formContent).trim(/\s+/g, '');
//         const strippedInitialFormContent = stripHtmlExceptDate(initialFormContent).replace(/\s+/g, '');

//         if(title.length > 50){
//             setWarnngMessage('제목은 50자를 초과할 수 없습니다.');
//             setIsWarningModalOpen(true);
//             return false;
//         }

//         if(status === '처리 중' && !approverLine.length > 0){
//             setWarnngMessage('결재선이 선택되지 않았습니다.');
//             setIsWarningModalOpen(true);
//             return false;
//         }

//         if(status === '처리 중' && strippedFormContent === '' || strippedFormContent === strippedInitialFormContent){
//             setWarnngMessage('결재 내용이 입력되지 않았습니다');
//             setIsWarningModalOpen(true);
//             return false;
//         }

//         return true;

//     };

//     const handleSubmit = async (status) => {
//         if (!validateForm(status)){
//             return;
//         }

//         const formData = new FormData();
//         const editorContent = editorRef.current.getContent();

//         const approvalDTO = {
//             approvalNo : approvalNo ? approvalNo : null,
//             approvalTitle : title,
//             approvalContent: editorContent,
//             formNo: selectedForm.formNo,
//             approvalStatus : status,
//             approver : approverLine.map(approver => ({ memberId: approver.memberId})),
//             referencer : referencerLine.map(referencer => ({ memberId : referencer.memberId}))
//         };

//         formData.append('approvalDTO', new Blob([JSON.stringify(approvalDTO)], { type : 'application/json'}));

//         if(files && files.length > 0 ){
//             files.forEach(file => formData.append('multipartFile', file));
//         }

//         formData.forEach((value, key) => {
//             console.log(key, value);
//         });

//         try{
//             let response;

//             if(status === '처리 중'){
//                 response = await submitApprovalAPI(formData);
//                 if(response && response.data && response.data.approvalNo){
//                     setApprovalNo(response.data.approvalNo);
//                 } 
                
//             } else if(status === '임시저장' && !approvalNo){
//                 response = await submitApprovalAPI(formData);
//                 if(response && response.data && response.data.approvalNo){
//                     setApprovalNo(response.data.approvalNo);
//                 }
//             } else if (status === '임시저장' && approvalNo){
//                 response = await updateApprovalAPI(approvalNo, formData);
//                 if(response && response.data && response.data.approvalNo){
//                     setApprovalNo(response.data.approvalNo);
//                 }
//             } else {
//                 response = await updateApprovalAPI(approvalNo, formData);
//             }

//             if(status === '임시저장'){
//                 setIsTempSaveModalOpen(true);
//             }
//             else{
//                 setIsInsertSuccessModalOpen(true);
//             }
//         } catch (error){
//             openFailModal('');
//             console.error(error);
//         }
//     };

//     const setEditableElements = (doc) => {
//         const formElements = doc.querySelectorAll('input, td, div[contenteditable="true"]');
//         formElements.forEach(element => {
//             element.setAttribute('contenteditable', 'true');
//         });
//         doc.body.querySelectorAll('*:not(input):not(td):not(div[contenteditable="true"])').forEach(element => {
//             element.setAttribute('contenteditable', 'false');
//         });
//     };

//     const insertCurrentDate = (doc) => {
//         const dateDiv = doc.querySelector('#date div');
//         if (dateDiv) {
//             const currentDate = new Date().toLocaleDateString();
//             dateDiv.textContent = currentDate;
//         }
//     };

//     const removeBogusBrTags = () => {
//         if (editorRef.current && !isRemovingBogusBr) {
//             setIsRemovingBogusBr(true);
//             const doc = editorRef.current.getDoc();
//             const bogusBrs = doc.querySelectorAll('br[data-mce-bogus="1"]');
//             bogusBrs.forEach(br => br.remove());
//             setIsRemovingBogusBr(false);
//         }
//     };

//     const moveToNextEditableElement = (doc, currentElement) => {
//         const allEditableElements = doc.querySelectorAll('input,  td[contenteditable="true"], div[contenteditable="true"]');
//         const currentIndex = Array.prototype.indexOf.call(allEditableElements, currentElement);

//         if (currentIndex < allEditableElements.length - 1) {

//             const nextElement = allEditableElements[currentIndex + 1];

//             if (nextElement) {
//                 if (nextElement.tagName === 'INPUT') {
//                     nextElement.focus();
//                 } else {
//                     const range = doc.createRange();
//                     const sel = window.getSelection();
//                     range.setStart(nextElement, 0);
//                     range.collapse(true);
//                     sel.removeAllRanges();
//                     sel.addRange(range);
//                 }
//             }
//         }
//     };

//     const openModal = () => {
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//     };

//     const handleSaveApprovers = (approverLine, referencerLine) => {
//         setApproverLine(approverLine);
//         setReferencerLine(referencerLine);
//     }

//     const openConfirmModal = () => {
//         if (validateForm('처리 중')) {
//             setIsInsertConfirmModalOpen(true);
//         }
//     };

//     const closeConfirmModal = () => {
//         setIsInsertConfirmModalOpen(false);
//     };

//     const openFailModal = (message) => {
//         setIsInsertFailModalOpen(true);
//     }

//     const closeFailModal = () => {
//         setIsInsertFailModalOpen(false);

//     }

//     const confirmSubmit = () => {

//         closeConfirmModal();
//         handleSubmit('처리 중');
        
//     };

//     const closeSuccessModal = () => {
//         setIsInsertSuccessModalOpen(false);
//         navigate('/approvals?fg=given&page=0title&direction=DESC');
//     };

//     const closeWarningModal = () => {
//         setIsWarrningModalOpen(false);
//     };

//     const closeTempSaveModal = () => {
//         setIsTempSaveModalOpen(false);
//     }

//     const openCancelInsertModal = () => {
//         setIsCancelInsertModalOpen(true);
//     }

//     const closeCancelInserstModal = () => {
//         setIsCancelInsertModalOpen(false);
//     }

//     const insertCancel = () => {
//         setIsCancelInsertModalOpen(false);
//         navigate('/approvals?fg=given&page=0title=&direction=DESC');
//     }


//     useEffect(() => {
//         if (editorRef.current) {
//             const doc = editorRef.current.getDoc();
//             setEditableElements(doc);
//             insertCurrentDate(doc);
//             removeBogusBrTags();
//         }
//     }, []);

//     return (
//         <>
//             <main id="main" className="main">
//                 <div className={styles.pageTop}>
//                     <div className="pagetitle">
//                         <h1>임시 저장된 결재 수정</h1>
//                         <nav>
//                             <ol className="breadcrumb">
//                                 <li className="breadcrumb-item"><a href="/">Home</a></li>
//                                 <li className="breadcrumb-item">전자결재</li>
//                                 <li className="breadcrumb-item active">임시 저장된 결재 수정</li>
//                             </ol>
//                         </nav>
//                     </div>
//                     <div className={styles.tempSave}>
//                         <button type="button" onClick={() => handleSubmit('임시저장')}>임시저장</button>
//                     </div>
//                 </div>
//                 <div className={styles.bigContent}>
//                     <form onSubmit={(e) => { e.preventDefault(); openConfirmModal(); }}>
//                         <div className={styles.middleContent}>
//                             <div className={styles.insertAppSideLeft}>
//                                 <SelectFormComponent onSelectForm={handleSelectForm} />
//                                 <div className={styles.LineBox}>
//                                     <div className={styles.approvers}>
//                                         <div className={styles.LineTitle}>결재선
//                                             <div className={styles.chooseApprover}>
//                                                 <button type="button" className={styles.ApproversBtn} onClick={openModal}>
//                                                     <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <div className={styles.SelectBoxApproverLine} style={{ paddingLeft: '10px' }}>
//                                             <table className={styles.SelectBoxApproverTable} style={{ textAlign: 'center' }}>
//                                                 <thead>
//                                                     <tr>
//                                                         <th>순번</th>
//                                                         <th>부서</th>
//                                                         <th>직급명</th>
//                                                         <th>이름</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {approverLine.map((approver, index) => (
//                                                         <tr key={approver.memberId} className={styles.approvalItem}>
//                                                             <td style={{ width: '70px', marginLeft: '10px' }}>{index + 1}</td>
//                                                             <td>{approver.departName}</td>
//                                                             <td>{approver.positionName}</td>
//                                                             <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{approver.name}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                     <div className={styles.referencers}>
//                                         <div className={styles.LineTitle}>참조선
//                                             <div className={styles.chooseApprover}>
//                                                 <button type="button" className={styles.ApproversBtn} onClick={openModal}>
//                                                     <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <div className={styles.SelectBoxReferencerLine} style={{ paddingLeft: '10px' }}>
//                                             <table className={styles.SelectBoxApproverTable} style={{ textAlign: 'center' }}>
//                                                 <thead>
//                                                     <tr>
//                                                         <th>순번</th>
//                                                         <th>부서</th>
//                                                         <th>직급명</th>
//                                                         <th>이름</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {referencerLine.map((referencer, index) => (
//                                                         <tr key={referencer.memberId} className={styles.approvalItem}>
//                                                             <td style={{ width: '70px', marginLeft: '10px' }}>{index + 1}</td>
//                                                             <td>{referencer.departName}</td>
//                                                             <td>{referencer.positionName}</td>
//                                                             <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{referencer.name}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className={styles.insertAppSideRight}>
//                                 <UserInfoComponent memberId={memberId} yearFormNo={yearFormNo} />
//                                 <div className={styles.approvalTitle}>
//                                     <input type="text" name="approvalTitle" placeholder="제목" value={title} onChange={handleTitleChange} maxLength={51} />
//                                     {titleError && <div className={styles.titleError}>{titleError}</div>}
//                                 </div>
//                                 <TinyEditor
//                                     onInit={(evt, editor) => {
//                                         editorRef.current = editor;
//                                         const doc = editor.getDoc();
//                                         setEditableElements(doc);
//                                         insertCurrentDate(doc);
//                                         removeBogusBrTags();
//                                     }}
//                                     value={formContent}
//                                     onEditorChange={handleEditorChange}
//                                     init={{
//                                         menubar: false,
//                                         plugins: [
//                                             'advlist autolink lists link image charmap print preview anchor',
//                                             'searchreplace visualblocks code fullscreen',
//                                             'insertdatetime media table paste code help wordcount'
//                                         ],
//                                         toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
//                                             'alignleft aligncenter alignright alignjustify | ' +
//                                             'bullist numlist outdent indent | removeformat | help',
//                                         content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
//                                         setup: (editor) => {
//                                             editor.on('init', () => {
//                                                 const doc = editor.getDoc();
//                                                 setEditableElements(doc);
//                                                 insertCurrentDate(doc);
//                                                 removeBogusBrTags();
//                                             });
//                                             editor.on('NodeChange', (e) => {
//                                                 if (e && e.element && e.element.nodeName === 'TD') {
//                                                     console.log("setup NodeChange 실행");
//                                                     const paras = e.element.getElementsByTagName('p');
//                                                     for (let i = 0; i < paras.length; i++) {
//                                                         while (paras[i].firstChild) {
//                                                             paras[i].parentNode.insertBefore(paras[i].firstChild, paras[i]);
//                                                         }
//                                                         paras[i].parentNode.removeChild(paras[i]);
//                                                     }
//                                                 }
//                                             });

//                                             editor.on('Change', () => {
//                                                 console.log("setup Change 실행 ")
//                                                 setTimeout(() => {
//                                                     removeBogusBrTags();
//                                                 }, 100);
//                                             });

//                                             editor.on('BeforeExecCommand', (e) => {
//                                                 console.log('setup BeforeExecCommand 실행');
//                                                 if (e.command === 'InsertLineBreak' || e.command === 'mceInsertNewLine') {
//                                                     setTimeout(() => {
//                                                         removeBogusBrTags();
//                                                     }, 100);
//                                                 }
//                                             });
//                                         },

//                                         forced_root_block: 'div',
//                                         invalid_elements: 'p',
//                                     }}
//                                 />
//                                 <div className={styles.fileUpload}>
//                                     <label htmlFor='fileUploadInput' className={styles.fileUploadLabel}>첨부파일</label>
//                                     <input
//                                         id="fileUploadInput"
//                                         type="file"
//                                         multiple
//                                         onChange={handleFileChange}
//                                         className={styles.fileUploadInput}
//                                     />
//                                     <div className={styles.fileList}>
//                                         {files.map((file, index) => (
//                                             <div key={index} className={styles.fileItem}>
//                                                 {file.name}
//                                                 <FontAwesomeIcon
//                                                     icon={faTimes}
//                                                     className={styles.removeFileIcon}
//                                                     onClick={() => handleFileRemove(index)}
//                                                 />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className={styles.insertAppButtons}>
//                             <button type='button' onClick={openCancelInsertModal}>취소</button>
//                             <button type="submit">등록</button>
//                         </div>
//                     </form>
//                     <ApproverModal
//                         isOpen={isModalOpen}
//                         onRequestClose={closeModal}
//                         onSave={handleSaveApprovers}
//                         selectedApproverLine={approverLine}
//                         selectedReferencerLine={referencerLine}
//                     />
//                     <InsertConfirmModal
//                         isOpen={isInsertConfirmModalOpen}
//                         onClose={closeConfirmModal}
//                         onConfirm={confirmSubmit}
//                     />
//                     <InsertSuccessModal
//                         isOpen={isInsertSuccessModalOpen}
//                         onClose={closeSuccessModal}
//                     />
//                     <InsertFailModal
//                         isOpen={isInsertFailModalOpen}
//                         onClose={closeFailModal}
//                     />
//                     <WarningModal
//                         isOpen={isWarningModalOpen}
//                         onClose={closeWarningModal}
//                         message={warningMessage}
//                     />
//                     <TempSaveModal
//                         isOpen={isTempSaveModalOpen}
//                         onClose={closeTempSaveModal}
//                     />
//                     <CancelInsertModal
//                         isOpen={isCancelInsertModalOpen}
//                         onClose={closeCancelInserstModal}
//                         onConfirm={insertCancel}
//                     />
//                 </div>
//             </main>
//         </>
//     )
// }


// export default ApprovalTempRewrite;