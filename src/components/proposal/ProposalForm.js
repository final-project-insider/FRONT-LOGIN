import React, { useState } from 'react';
import { createProposal } from '/apis/ProposalApi';

const ProposalForm = ({ isAdmin = false, memberId = 240503532, onProposalSubmitted }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (content.trim()) {
            try {
                await createProposal({
                    menuId: 240528292,
                    emotion: 11,
                    content: content,
                });
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
