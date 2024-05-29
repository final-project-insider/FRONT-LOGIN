const BASE_URL = 'http://localhost:8080';

export const getProposals = async (memberId) => {
  const response = await fetch(`${BASE_URL}/members/${memberId}/proposal?sort=noteNo&sendDeleteYn=N&receiveDeleteYn=N`, {
    method: 'GET',
    headers: {
      'Authorization': 'BEARER YOUR_TOKEN_HERE',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getProposalDetail = async (id) => {
  const response = await fetch(`${BASE_URL}/proposal/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': 'BEARER YOUR_TOKEN_HERE',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const sendProposal = async (content, senderId, proposalNo) => {
  const response = await fetch(`${BASE_URL}/proposal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'BEARER YOUR_TOKEN_HERE',
    },
    body: JSON.stringify({
      Content: content,
      senderId: senderId,
      proposalNo: proposalNo,
    }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deleteProposal = async (id) => {
  const response = await fetch(`${BASE_URL}/proposal/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'BEARER YOUR_TOKEN_HERE',
    },
    body: JSON.stringify({
      sendDeleteYn: 'Y',
    }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const checkIsAdmin = async (memberId) => {
  const response = await fetch(`${BASE_URL}/members/${memberId}/isAdmin`, {
    method: 'GET',
    headers: {
      'Authorization': 'BEARER YOUR_TOKEN_HERE',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default {
  getProposals,
  getProposalDetail,
  sendProposal,
  deleteProposal,
  checkIsAdmin, 
};
