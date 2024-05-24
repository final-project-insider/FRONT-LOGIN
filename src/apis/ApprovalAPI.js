import axios from "axios";
import { 
    fetchApprovalsSuccess,
    fetchApprovalsFailure, 
    deleteApprovalSuccess, 
    deleteApprovalFailure,
    setPageInfo, 
    setLoading,
    fetchFormsSuccess,
    fetchFormsFailure,
    getAllMembers,
    submitApprovalSuccess,
    submitApprovalFailure,
} from "../modules/ApprovalReducer";
import { GET_MEMBER } from "../modules/MemberModule";

const API_BASE_URL = "http://localhost:8080";

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: '*/*',
    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
};


export const getFormsAPI = () => {
    
    return async (dispatch) => {
        try{
            const response = await axios.get(`${API_BASE_URL}/approvals/forms`, { headers });
            if(Array.isArray(response.data)){
                dispatch(fetchFormsSuccess(response.data));
            }else if(Array.isArray(response.data.data)){
                dispatch(fetchFormsSuccess(response.data.data));
            }
            else{
                throw new Error("Invalid API response structure");
            }
        } catch(error) {
            dispatch(fetchFormsFailure(error));
            console.error('Error fetching forms :' , error);
        }finally{
            dispatch(setLoading(false));
        }
    }

};

export const getApprovalsAPI = ( fg, page, title, direction )  => {
    
    return async (dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await axios.get(`${API_BASE_URL}/approvals?fg=${fg}&page=${page}&title=${title}&direction=${direction}`, { headers });
            if(!response.data || !response.data.data){
                throw new Error("Invalid API response structure");
            }
            const { content, pageable, totalPages } = response.data.data;
            dispatch(fetchApprovalsSuccess(content));
            dispatch(setPageInfo({
                currentPage: pageable.pageNumber,
                totalPages: totalPages,
            }));
        }catch(error){
            dispatch(fetchApprovalsFailure(error));
            console.log('전자결재 내역 조회 실패 ', error);
        }finally{
            dispatch(setLoading(false));
        }
    }
    
};

export const deleteApprovalAPI = approvalNo => {
    return async dispatch => {
        dispatch(setLoading(true));
        try{
            const response = await axios.delete(`${API_BASE_URL}/approvals/${approvalNo}`, { headers });
            
            dispatch(deleteApprovalSuccess(approvalNo));

        }catch(error){
            dispatch(deleteApprovalFailure(error));
            console.log('전자결재 삭제 실패 ', error);
        }finally{
            dispatch(setLoading(false));
        }
    }
};


export const getMemberAPI = async (memberId) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/approvals/members/${memberId}`, { headers });
        return response.data;
    }catch(error){
        console.error('사원 정보 조회 실패 : ', error);
    }
};

export const getAllMemberAPI = () => {
    return async (dispatch) => {
        try{
            const response = await axios.get(`${API_BASE_URL}/approvals/members`, { headers });
            console.log('API 응답 데이터: ', response.data);
            dispatch(getAllMembers(response.data.data));
        }catch(error){
            console.error('전 사원 정보 조회 실패 ', error);
        }
    };
};

export const submitApprovalAPI = (formData) => {
    return async (dispatch) => {

        dispatch(setLoading(true));
        // const formData = new FormData();

        // //결재 데이터 추가
        // formData.append('approvalData', new Blob([JSON.stringify(approvalData)], { type : 'application/json'}));

        try{
            const response = await axios.post(`${API_BASE_URL}/approvals`, formData, {
                headers : {
                    'Content-Type' : 'multipart/form-data',
                    Accept: '*/*',
                    Authorization: 'Bearer ' + window.localStorage.getItem('accessToken'),
                },
            });
            console.log('결재 제출 성공', response.data);

            dispatch(submitApprovalSuccess(response.data));

        }catch (error){

            dispatch(submitApprovalFailure(error));
            console.error('결재 제출 실패 : ', error);
        }finally{
            dispatch(setLoading(false));
        }
    };
};