import React, { useState } from 'react';
import ProposalApi from '../../apis/ProposalApi';

const ProposalForm = ({ isAdmin = false, memberId = 240503532, onProposalSubmitted }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (content.trim()) {
            try {
                // ProposalApi에서 제공하는 sendProposal 함수 호출
                await ProposalApi.sendProposal(content, memberId);
                setContent('');
                if (onProposalSubmitted) {
                    onProposalSubmitted();
                }
            } catch (error) {
                console.error('Error creating proposal:', error);
            }
        }
    };

    return (
        <form name="WriteFrm" method="post" onSubmit={handleSubmit}>
            <input type="hidden" name="memoPost.menuId" value="121" />
            <textarea
                id="contents"
                name="memoPost.content"
                className="tf_write"
                placeholder="글을 입력해 주세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">등록</button>
        </form>
    );
};

export default ProposalForm;
