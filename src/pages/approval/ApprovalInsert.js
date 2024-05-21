import React, { useState, useRef, useEffect } from 'react';
import insertStyles from '../../css/approval/insertApproval.css';
import { Editor } from '@tinymce/tinymce-react';
import 'react-quill/dist/quill.snow.css';
import SelectFormComponent from '../../components/approvals/SelectFormComponent';
import TinyEditor from '../../components/approvals/TinyEditor';
import UserInfoComponent from '../../components/approvals/UserInfoComponent';
import { decodeJwt } from '../../utils/tokenUtils';


const ApprovalInsert = () => {

    const [formContent, setFormContent] = useState('');
    const [selectedForm, setSelectedForm] = useState(null);
    const [isRemovingBogusBr, setIsRemovingBogusBr] = useState(false);
    const editorRef = useRef(null);

    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    const memberId = decodedToken.memberId;

    const handleSelectForm = (selectedForm) => {

        setSelectedForm(selectedForm);          //선택된 폼을 상태로 저장 
        console.log('Selected Form : ', selectedForm);
        if (selectedForm && selectedForm.formShape) {
            const htmlContent = selectedForm.formShape;
            setFormContent(htmlContent); // 선택된 폼의 내용을 설정

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

    const handleSubmit = () => {
        const formData = {
            content: formContent,
            selectedForm: selectedForm
        };
        console.log('기안 완료 : ', formData);
    };

    const setEditableElements = (doc) => {
        const formElements = doc.querySelectorAll('input, td, div[contenteditable="true"]');
        formElements.forEach(element => {
            element.setAttribute('contenteditable', 'true');
        });
        doc.body.querySelectorAll('*:not(input):not(td):not(div[contenteditable="true"])').forEach(element => {
            element.setAttribute('contenteditable', 'false');
        });

        const titleInput = doc.querySelector('#titleform input');
        if (titleInput) {
            titleInput.addEventListener('click', () => {
                titleInput.focus();
            });

            titleInput.setAttribute('contenteditable', 'true');

            titleInput.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    moveToNextEditableElement(doc, titleInput);
                }
            });
        }
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

    useEffect(() => {
        if (editorRef.current) {
            const doc = editorRef.current.getDoc();
            setEditableElements(doc);
            insertCurrentDate(doc);
            removeBogusBrTags();
        }
    }, []);

    // const handleTabKey = (editor, e) => {
    //     if (e.key === 'Tab') {
    //         e.preventDefault();
    //         const dom = editor.dom;
    //         const currentNode = editor.selection.getNode();

    //         let nextTd = dom.getNext(currentNode, 'td');
    //         if (!nextTd) {
    //             nextTd = dom.getNext(currentNode, 'input');
    //         }

    //         if (nextTd) {
    //             editor.selection.setCursorLocation(nextTd, 0);
    //             editor.focus();
    //         }
    //     }
    // };


    return (
        <>
            <main id="main" className="main">
                <div className="pageTop">
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
                    <div className="tempSave">
                        <button>임시저장</button>
                    </div>
                </div>
                <div className="bigContent">
                    <div className="middleContent">
                        <div className="insertAppSide left" >
                            <SelectFormComponent onSelectForm={handleSelectForm} />
                            <div className="chooseApprover">

                            </div>
                            <div className="approvers">

                            </div>
                            <div className="referencers">

                            </div>
                        </div>
                        <div className="insertAppSide right">
                            <UserInfoComponent memberId={memberId}/>
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
                                        editor.on('keydown', (e) => {
                                            if(e.key === 'Tab'){
                                                e.preventDefault();
                                                moveToNextEditableElement(editor.getDoc(), editor.selection.getNode());
                                            }
                                        });
                                    },
                                    height: 1100,
                                    forced_root_block: 'div',
                                    invalid_elements: 'p',
                                }}
                            />
                        </div>
                    </div>
                    <div className="insertAppButtons">
                        <button>취소</button>
                        <button onClick={handleSubmit}>등록</button>
                    </div>
                </div>
            </main>

        </>
    )

}
export default ApprovalInsert;