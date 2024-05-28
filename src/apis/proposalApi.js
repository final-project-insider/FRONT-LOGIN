const API_BASE_URL = 'http://localhost:8080';


class ProposalAPI {
    // 건의함 조회
    static async getProposals() {
        try {
            const response = await fetch(`${API_BASE_URL}/proposals`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching proposals:', error);
            throw error;
        }
    }

    // 건의 등록 메서드
    static async createProposal(proposalData) {
        try {
            const response = await fetch(`${API_BASE_URL}/proposals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proposalData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating proposal:', error);
            throw error;
        }
    }

    // 건의 수정 메서드
    static async updateProposal(proposalId, updatedData) {
        try {
            const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating proposal:', error);
            throw error;
        }
    }

    // 건의 삭제 메서드
    static async deleteProposal(proposalId) {
        try {
            const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting proposal:', error);
            throw error;
        }
    }
}

export default ProposalAPI;
