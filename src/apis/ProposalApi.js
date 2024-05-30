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

export const getAllProposals = async () => {
  const response = await fetch(`${BASE_URL}/proposals`, {
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
  getAllProposals,
  checkIsAdmin, 
};
