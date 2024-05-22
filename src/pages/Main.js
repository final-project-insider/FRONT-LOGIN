// Main.js

import React, { useEffect, useState } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from '@fullcalendar/core/locales/ko';
import { useSelector, useDispatch } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/common.css'
import { calendarPopover, updateEvents } from '../utils/CalendarUtil';
import { callSelectCalendarAPI } from '../apis/CalendarAPICalls';
import AnnounceList from './announce/AnnouceList';
import { callGetProfilePictureAPI } from '../apis/MemberAPICalls';


function Main() {
    const { calendarList } = useSelector(state => state.calendarReducer)
    const [events, setEvents] = useState([]);
    const dispatch = useDispatch();

    // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
    useEffect(() => { dispatch(callSelectCalendarAPI("개발팀")) }, []);

    useEffect(() => updateEvents(calendarList, setEvents), [calendarList]);

    const maxVisibleAnnouncements = 5; // 최대 공지사항 수


    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>Main</h1>
            </div>
            <Fullcalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView={'dayGridWeek'} // dayGridWeek로 변경
                headerToolbar={{
                    start: 'prev,today,next',
                    center: 'title',
                    end: ''
                }}
                events={events}
                eventDidMount={info => calendarPopover(info)}
                locale={koLocale} 
                height="300px"
            />
            <div className='annouce' style={{marginTop: '50px'}}>
                <AnnounceList maxVisibleAnnouncements={5} hidePagination={true} hidePlus={true} /> {/* hidePagination을 true로 설정하여 페이징 숨김 */}
            </div>
        </main>
    );
}

export default Main;
