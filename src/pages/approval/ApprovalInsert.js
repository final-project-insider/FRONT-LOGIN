import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/approval/ApprovalInsert.module.css';
import SelectFormComponent from '../../components/approvals/SelectFormComponent';
import TinyEditor from '../../components/approvals/TinyEditor';
import UserInfoComponent from '../../components/approvals/UserInfoComponent';
import { decodeJwt } from '../../utils/tokenUtils';
import ApproverModal from '../../components/approvals/ApproverModal';
import InsertConfirmModal from '../../components/approvals/InsertConfirmModal';
import InsertSuccessModal from '../../components/approvals/InsertSuccessModal';
import InsertFailModal from '../../components/approvals/InsertFailModal';
import WarningModal from '../../components/approvals/WarningModal';
import TempSaveModal from '../../components/approvals/TempSaveModal';
import CancelInsertModal from '../../components/approvals/CancelInsertModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { submitApprovalAPI, updateApprovalAPI } from '../../apis/ApprovalAPI';


const ApprovalInsert = () => {

    const [formContent, setFormContent] = useState('');
    const [initialFormContent, setInitialFormContent] = useState('');
    const [selectedForm, setSelectedForm] = useState(null);
    const [yearFormNo, setYearFormNo] = useState('');
    const [isRemovingBogusBr, setIsRemovingBogusBr] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [approverLine, setApproverLine] = useState([]);
    const [referencerLine, setReferencerLine] = useState([]);
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [files, setFiles] = useState([]);
    const [approvalNo, setApprovalNo] = useState(null);
    const [isInsertConfirmModalOpen, setIsInsertConfirmModalOpen] = useState(false);
    const [isInsertSuccessModalOpen, setIsInsertSuccessModalOpen] = useState(false);
    const [isInsertFailModalOpen, setIsInsertFailModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarrningModalOpen] = useState(false);
    const [isTempSaveModalOpen, setIsTempSaveModalOpen] = useState(false);
    const [isCancelInsertModalOpen, setIsCancelInsertModalOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const editorRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    const memberId = decodedToken.memberId;

    const handleSelectForm = (selectedForm) => {

        setSelectedForm(selectedForm);          //선택된 폼을 상태로 저장 
        console.log('Selected Form : ', selectedForm);
        if (selectedForm && selectedForm.formShape) {
            const htmlContent = selectedForm.formShape;
            setFormContent(htmlContent); // 선택된 폼의 내용을 설정
            setInitialFormContent(htmlContent);

            //결재 번호 생성
            const currentYear = new Date().getFullYear();
            const approvalNumber = `${currentYear}-${selectedForm.formNo}`;
            setYearFormNo(approvalNumber);

            if (editorRef.current) {
                editorRef.current.setContent(htmlContent);
                editorRef.current.undoManager.clear();  //히스토리 초기화
                setEditableElements(editorRef.current.getDoc());
                insertCurrentDate(editorRef.current.getDoc());
                removeBogusBrTags();
            }
        }
    };

    const handleEditorChange = (content) => {
        setFormContent(content);                    //에디터 내용이 변경될 떄 상태 업데이트
    };

    const handleFileChange = (e) => {

        const selectedFiles = e.target.files;
        const maxSize = 10 * 1024 * 1024; // 10 MB
        // setAttachedFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);

        for (let i = 0; i < selectedFiles.length; i++) {
            if (selectedFiles[i].size > maxSize) {
                setWarningMessage('파일의 크기가 너무 큽니다. 파일은 최대 10MB까지 첨부 가능합니다.');
                setIsWarrningModalOpen(true);
                return;
            }
        }

        setFiles([...files, ...e.target.files]);
    };

    const handleFileRemove = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    }

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;

        if (newTitle.length <= 50) {
            setTitle(newTitle);
            setWarningMessage('');
        }
        else {
            setWarningMessage('제목은 50자를 초과할 수 없습니다.');
            setIsWarrningModalOpen(true);
        }
    };

    const stripHtmlExceptDate = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const dateElement = tempDiv.querySelector('#date');
        if (dateElement) {
            dateElement.remove();
        }

        return tempDiv.textContent || tempDiv.innerHTML || '';
    }

    const validateForm = (status) => {
        if (status === '처리 중' && title.trim() === '') {
            console.log('status === 처리 중, title.trim() === "" ');
            setWarningMessage('제목이 입력되지 않았습니다');
            setIsWarrningModalOpen(true);
            return false;
        }

        const strippedFormContent = stripHtmlExceptDate(formContent).trim(/\s+/g, '');
        const strippedInitialFormContent = stripHtmlExceptDate(initialFormContent).replace(/\s+/g, '');

        if (title.length > 50) {
            setWarningMessage('제목은 50자를 초과할 수 없습니다.');
            setIsWarrningModalOpen(true);
            return false;
        }

        if (status === '처리 중' && !approverLine.length > 0) {
            setWarningMessage('결재선이 선택되지 않았습니다.');
            setIsWarrningModalOpen(true);
            return false;
        }

        if (status === '처리 중' && (strippedFormContent === '' || strippedFormContent === strippedInitialFormContent)) {
            setWarningMessage('결재 내용이 입력되지 않았습니다');
            setIsWarrningModalOpen(true);
            return false;
        }

        return true;
    };



    const handleSubmit = async (status) => {

        console.log('status: ' + status);

        if (!validateForm(status)) {
            return;
        }


        const formData = new FormData();

        //에디터 내용을 포함한 폼 데이터를 가져오기
        const editorContent = editorRef.current.getContent();

        const approvalDTO = {
            approvalNo : approvalNo ? approvalNo : null,
            approvalTitle: title,
            approvalContent: editorContent,
            formNo: selectedForm.formNo,
            approvalStatus: status,
            approver: approverLine.map(approver => ({ memberId: approver.memberId })),
            referencer: referencerLine.map(referencer => ({ memberId: referencer.memberId }))
        };

        formData.append('approvalDTO', new Blob([JSON.stringify(approvalDTO)], { type: 'application/json' }));

        //파일 추가
        if (files && files.length > 0) {
            files.forEach(file => formData.append('multipartFile', file));
        }

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        try {
            let response;

            if (status === '처리 중') {
                //상태가 '처리 중' 이면 등록 API 호출
                response = await submitApprovalAPI(formData);
                if (response && response.data && response.data.approvalNo) {
                    setApprovalNo(response.data.approvalNo);
                }
            } else if (status === '임시저장' && !approvalNo) {
                //임시저장 상태이면 등록 API에 '임시저장'으로 등록
                response = await submitApprovalAPI(formData);

                console.log('등록된 전자결재 번호 : ' + response.data?.approvalNo);

                if (response && response.data && response.data.approvalNo) {
                    setApprovalNo(response.data.approvalNo);
                }
            } else if (status === '임시저장' && approvalNo) {
                response = await updateApprovalAPI(approvalNo, formData);

                console.log('등록된 전자결재 번호 : ' + response.data?.approvalNo);
                if (response && response.data && response.data.approvalNo) {
                    setApprovalNo(response.data.approvalNo);
                }
            } 
            //기타 상태이면 수정 API 호출
            else {
                response = await updateApprovalAPI(approvalNo, formData);
            }

            // if (approvalNo) {
            //     //저장된 approvalNo가 있다면 수정 API호출
            //     response = await updateApprovalAPI( approvalNo, formData );

            // }
            // else {
            //     //저장된 approvalNo가 없다면 등록 API호출
            //     response = await submitApprovalAPI(formData);
            //     const responseData = response.data;

            //     if (response.data?.approvalNo) {    //전자결재가 저장되었다면 
            //         setApprovalNo(response.data.approvalNo);
            //     } else {
            //         console.error('응답에서 approvalNo를 찾을 수 없습니다.');
            //     }
            // }

            if (status === '임시저장') {
                setIsTempSaveModalOpen(true);
            }
            else {
                setIsInsertSuccessModalOpen(true);
            }
        } catch (error) {
            openFailModal('');
            console.error(error);
        }

    }

    const setEditableElements = (doc) => {
        const formElements = doc.querySelectorAll('input, td, div[contenteditable="true"]');
        formElements.forEach(element => {
            element.setAttribute('contenteditable', 'true');
        });
        doc.body.querySelectorAll('*:not(input):not(td):not(div[contenteditable="true"])').forEach(element => {
            element.setAttribute('contenteditable', 'false');
        });
    };

    const insertCurrentDate = (doc) => {
        const dateDiv = doc.querySelector('#date div');
        if (dateDiv) {
            const currentDate = new Date().toLocaleDateString();
            dateDiv.textContent = currentDate;
        }
    };

    const removeBogusBrTags = () => {
        if (editorRef.current && !isRemovingBogusBr) {
            setIsRemovingBogusBr(true);
            const doc = editorRef.current.getDoc();
            const bogusBrs = doc.querySelectorAll('br[data-mce-bogus="1"]');
            bogusBrs.forEach(br => br.remove());
            setIsRemovingBogusBr(false);
        }
    };

    const moveToNextEditableElement = (doc, currentElement) => {
        const allEditableElements = doc.querySelectorAll('input,  td[contenteditable="true"], div[contenteditable="true"]');
        const currentIndex = Array.prototype.indexOf.call(allEditableElements, currentElement);

        if (currentIndex < allEditableElements.length - 1) {

            const nextElement = allEditableElements[currentIndex + 1];

            if (nextElement) {
                if (nextElement.tagName === 'INPUT') {
                    nextElement.focus();
                } else {
                    const range = doc.createRange();
                    const sel = window.getSelection();
                    range.setStart(nextElement, 0);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveApprovers = (approverLine, referencerLine) => {
        setApproverLine(approverLine);
        setReferencerLine(referencerLine);
    }

    const openConfirmModal = () => {
        if (validateForm('처리 중')) {
            setIsInsertConfirmModalOpen(true);
        }
    };

    const closeConfirmModal = () => {
        setIsInsertConfirmModalOpen(false);
    };

    const openFailModal = (message) => {
        setIsInsertFailModalOpen(true);
    }

    const closeFailModal = () => {
        setIsInsertFailModalOpen(false);

    }

    const confirmSubmit = () => {

        closeConfirmModal();
        handleSubmit('처리 중');
        
    };

    const closeSuccessModal = () => {
        setIsInsertSuccessModalOpen(false);
        navigate('/approvals?fg=given&page=0title&direction=DESC');
    };

    const closeWarningModal = () => {
        setIsWarrningModalOpen(false);
    };

    const closeTempSaveModal = () => {
        setIsTempSaveModalOpen(false);
    }

    const openCancelInsertModal = () => {
        setIsCancelInsertModalOpen(true);
    }

    const closeCancelInserstModal = () => {
        setIsCancelInsertModalOpen(false);
    }

    const insertCancel = () => {
        setIsCancelInsertModalOpen(false);
        navigate('/approvals?fg=given&page=0title=&direction=DESC');
    }


    useEffect(() => {
        if (editorRef.current) {
            const doc = editorRef.current.getDoc();
            setEditableElements(doc);
            insertCurrentDate(doc);
            removeBogusBrTags();
        }
    }, []);



    return (
        <>
            <main id="main" className="main">
                <div className={styles.pageTop}>
                    <div className="pagetitle">
                        <h1>결재 기안하기</h1>
                        <nav>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/">Home</a></li>
                                <li className="breadcrumb-item">전자결재</li>
                                <li className="breadcrumb-item active">결재 기안하기</li>
                            </ol>

                        </nav>
                    </div>
                    <div className={styles.tempSave}>
                        <button type="button" onClick={() => handleSubmit('임시저장')}>임시저장</button>
                    </div>
                </div>
                <div className={styles.bigContent}>
                    <form onSubmit={(e) => { e.preventDefault(); openConfirmModal(); }}>
                        <div className={styles.middleContent}>
                            <div className={styles.insertAppSideLeft} >
                                <SelectFormComponent onSelectForm={handleSelectForm} />

                                <div className={styles.LineBox}>
                                    <div className={styles.approvers}>
                                        <div className={styles.LineTitle}>결재선
                                            <div className={styles.chooseApprover}>
                                                <button type="button" className={styles.ApproversBtn} onClick={openModal}>
                                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                                                </button>
                                            </div></div>
                                        <div className={styles.SelectBoxApproverLine} style={{ paddingLeft: '10px' }}>
                                            <table className={styles.SelectBoxApproverTable} style={{ textAlign: 'center' }}>
                                                <thead>
                                                    <tr>
                                                        <th>순번</th>
                                                        <th>부서</th>
                                                        <th>직급명</th>
                                                        <th>이름</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {approverLine.map((approver, index) => (
                                                        <tr key={approver.memberId} className={styles.approvalItem}>
                                                            <td style={{ width: '70px', marginLeft: '10px' }}>{index + 1}</td>
                                                            <td>{approver.departName}</td>
                                                            <td>{approver.positionName}</td>
                                                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{approver.name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                    <div className={styles.referencers}>
                                        <div className={styles.LineTitle}>참조선
                                            <div className={styles.chooseApprover}>
                                                <button type="button" className={styles.ApproversBtn} onClick={openModal}>
                                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.SelectBoxReferencerLine} style={{ paddingLeft: '10px' }}>
                                            <table className={styles.SelectBoxApproverTable} style={{ textAlign: 'center' }}>
                                                <thead>
                                                    <tr>
                                                        <th>순번</th>
                                                        <th>부서</th>
                                                        <th>직급명</th>
                                                        <th>이름</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {referencerLine.map((referencer, index) => (
                                                        <tr key={referencer.memberId} className={styles.approvalItem}>
                                                            <td style={{ width: '70px', marginLeft: '10px' }}>{index + 1}</td>
                                                            <td>{referencer.departName}</td>
                                                            <td>{referencer.positionName}</td>
                                                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{referencer.name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.insertAppSideRight}>
                                <UserInfoComponent memberId={memberId} yearFormNo={yearFormNo} />
                                <div className={styles.approvalTitle}>
                                    <input type="text" name="approvalTitle" placeholder="제목" value={title} onChange={handleTitleChange} maxLength={51} />
                                    {titleError && <div className={styles.titleError}>{titleError}</div>}
                                </div>
                                <TinyEditor
                                    onInit={(evt, editor) => {
                                        editorRef.current = editor;
                                        const doc = editor.getDoc();
                                        setEditableElements(doc);
                                        insertCurrentDate(doc);
                                        removeBogusBrTags();
                                    }}
                                    value={formContent}
                                    onEditorChange={handleEditorChange}
                                    init={{
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
                                            'alignleft aligncenter alignright alignjustify | ' +
                                            'bullist numlist outdent indent | removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                        setup: (editor) => {
                                            editor.on('init', () => {
                                                const doc = editor.getDoc();
                                                setEditableElements(doc);
                                                insertCurrentDate(doc);
                                                removeBogusBrTags();
                                            });
                                            editor.on('NodeChange', (e) => {
                                                if (e && e.element && e.element.nodeName === 'TD') {
                                                    console.log("setup NodeChange 실행");
                                                    const paras = e.element.getElementsByTagName('p');
                                                    for (let i = 0; i < paras.length; i++) {
                                                        while (paras[i].firstChild) {
                                                            paras[i].parentNode.insertBefore(paras[i].firstChild, paras[i]);
                                                        }
                                                        paras[i].parentNode.removeChild(paras[i]);
                                                    }
                                                }
                                            });

                                            editor.on('Change', () => {
                                                console.log("setup Change 실행 ")
                                                setTimeout(() => {
                                                    removeBogusBrTags();
                                                }, 100);
                                            });

                                            editor.on('BeforeExecCommand', (e) => {
                                                console.log('setup BeforeExecCommand 실행');
                                                if (e.command === 'InsertLineBreak' || e.command === 'mceInsertNewLine') {
                                                    setTimeout(() => {
                                                        removeBogusBrTags();
                                                    }, 100);
                                                }
                                            });
                                        },

                                        forced_root_block: 'div',
                                        invalid_elements: 'p',
                                    }}
                                />
                                <div className={styles.fileUpload}>
                                    <label htmlFor='fileUploadInput' className={styles.fileUploadLabel}>첨부파일</label>
                                    <input
                                        id="fileUploadInput"
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className={styles.fileUploadInput}
                                    />
                                    <div className={styles.fileList}>
                                        {files.map((file, index) => (
                                            <div key={index} className={styles.fileItem}>
                                                {file.name}
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                    className={styles.removeFileIcon}
                                                    onClick={() => handleFileRemove(index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.insertAppButtons}>
                            <button type='button' onClick={openCancelInsertModal}>취소</button>
                            <button type="submit" /* onClick={() => handleSubmit('처리 중')} */>등록</button>
                        </div>
                    </form>
                    <ApproverModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        onSave={handleSaveApprovers}
                        selectedApproverLine={approverLine}
                        selectedReferencerLine={referencerLine}
                    />
                    <InsertConfirmModal
                        isOpen={isInsertConfirmModalOpen}
                        onClose={closeConfirmModal}
                        onConfirm={confirmSubmit}
                    />
                    <InsertSuccessModal
                        isOpen={isInsertSuccessModalOpen}
                        onClose={closeSuccessModal}
                    />
                    <InsertFailModal
                        isOpen={isInsertFailModalOpen}

                        onClose={closeFailModal}
                    />
                    <WarningModal
                        isOpen={isWarningModalOpen}
                        onClose={closeWarningModal}
                        message={warningMessage}
                    />
                    <TempSaveModal
                        isOpen={isTempSaveModalOpen}
                        onClose={closeTempSaveModal}
                    />
                    <CancelInsertModal
                        isOpen={isCancelInsertModalOpen}
                        onClose={closeCancelInserstModal}
                        onConfirm={insertCancel}
                    />
                </div>
            </main>

        </>
    )

}
export default ApprovalInsert;