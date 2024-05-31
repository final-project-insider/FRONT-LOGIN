import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/Main';
import Announces from './pages/announce/Announces';
import InsertAnnounce from './pages/announce/InsertAnnounce';
import Insite from './pages/insite/Insite';
import Layout from './layouts/layout';
import Calendar from './pages/calendar/Calendar';
import RecordCommute from './pages/commute/RecordCommute';
import RecordCorrectionOfCommute from './pages/commute/RecordCorrectionOfCommute';
import CommuteManage from './pages/commute/CommuteManage';
import CommuteCorrectionManage from './pages/commute/CommuteCorrectionManage';
import AnnounceDetail from './pages/announce/AnnounceDetail';
import Login from './pages/member/Login';
import Error from './pages/Error';
import MyProfile from './pages/profile/MyProfile';
import ManageMember from './pages/member/ManageMember';
import RegisterMember from './pages/member/RegisterMember';
import UpdateAnnounce from './pages/announce/UpdateAnnounce';
import ReceiveNoteList from './pages/note/ReceiveNoteList';
import SendNoteList from './pages/note/SendNoteList';
import MyLeave from './pages/leave/MyLeave';
import RoomList from './pages/chatting/RoomList';
import Room from './pages/chatting/Room';
import DepartmentAndPosition from './pages/departmentAndposition/departmentAndPosition';
import ApprovalPage from './pages/approval/ApprovalPage';
import LeaveAccrual from './pages/leave/LeaveAccrual';
import LeaveProcessing from './pages/leave/LeaveProcessing';
import Leaves from './pages/leave/Leaves';
import SurveyList from './pages/survey/SurveyList';
import MemberPage from './pages/member/MemberPage';
import HierarchyTree from './pages/member/HierarchyTree';
import { useDispatch } from 'react-redux';
import { decodeJwt } from './utils/tokenUtils';
import ApprovalDetail from './pages/approval/ApprovalDetail';

import ApprovalTempRewrite from './pages/approval/ApprovalTempRewrite';

import ChangeMemberPage from './pages/member/ChangeMemberPage';
import ProposalPage from './pages/proposal/ProposalPage';
import AdminProposalPage from './pages/proposal/AdminProposalPage';
import MemberProposalPage from './pages/proposal/MemberProposalPage';


function App() {
  const isLoggedIn = !!window.localStorage.getItem("accessToken");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Private routes */}
        {isLoggedIn ? (
          <Route element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="/" element={<Main />} />
            <Route path="/main" element={<Main />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="myProfile" element={<MyProfile />} />
            <Route path="recordCommute" element={<RecordCommute />} />
            <Route path="recordCorrectionOfCommute" element={<RecordCorrectionOfCommute />} />
            <Route path="commuteManage" element={<CommuteManage />} />
            <Route path="commuteCorrectionManage" element={<CommuteCorrectionManage />} />
            <Route path="myLeave" element={<MyLeave />} />
            <Route path="leaveAccrual" element={<LeaveAccrual />} />
            <Route path="leaveProcessing" element={<LeaveProcessing />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="announces" element={<Announces />} />
            <Route path="announces/:ancNo" element={<AnnounceDetail />} />
            <Route path="updateAnnounces/:ancNo" element={<UpdateAnnounce />} />
            <Route path="insite" element={<Insite />} />
            <Route path="insertAnnounce" element={<InsertAnnounce />} />
            <Route path="manageMember" element={<ManageMember />} />
            <Route path="registerMember" element={<RegisterMember />} />
            <Route path="surveyList" element={<SurveyList />} />
            <Route path="receiveNoteList" element={<ReceiveNoteList />} />
            <Route path="sendNoteList" element={<SendNoteList />} />
            <Route path="chatRoomList" element={<RoomList />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="departmentAndPosition" element={<DepartmentAndPosition />} />
            <Route path="approvals" element={<ApprovalPage />} />
            <Route path="/manageMember/:memberId" element={<MemberPage />} />
            <Route path='/hierarchyTree' element={<HierarchyTree />} />
            <Route path='/approvals/:approvalNo' element={<ApprovalDetail />} />

            <Route path='/approvals/tempRewrite:approvalNo' element={<ApprovalTempRewrite />} />

            <Route path='/manageMember/:memberId/edit' element={<ChangeMemberPage />} />
            <Route path="/proposal" element={<ProposalPage />} />
            <Route path="/admin/proposal" element={<AdminProposalPage />} />

          </Route>
        ) : (
          <Route path="/" element={<Navigate to="/login" replace />} />
        )}
        {/* <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} /> */}
        <Route path="*" element={isLoggedIn ? <Error /> : <Navigate to="/login" replace />} />
        {/* <Route path='*' element={<Error />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
