import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from '@fullcalendar/core/locales/ko';
import { callDeleteCalendarAPI, callInsertCalendarAPI, callSelectCalendarAPI, callUpdateCalendarAPI } from '../../apis/CalendarAPICalls';
import CalendarModal from './CalendarModal';
import CalendarUpdateModal from './CalendarUpdateModal';
import { calendarPopover, updateEvents } from '../../utils/CalendarUtil';
import { decodeJwt } from '../../utils/tokenUtils';
import { convertToUtc } from '../../utils/CommonUtil';
import '../../css/common.css'
import '../../css/calendar/Calendar.css';
import "bootstrap/dist/css/bootstrap.min.css";


function Calendar() {
    const { calendarList, insertMessage, updateMessage, deleteMessage } = useSelector(state => state.calendarReducer)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState();
    const dispatch = useDispatch();
    const token = decodeJwt(window.localStorage.getItem("accessToken"));


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent();
    };

    const handleEventClick = info => {
        setSelectedEvent(info.event);
        handleOpenModal();
    };

    const handleInsert = ({ title, start, end, color, detail }) => {
        const requestData = {
            calendarStart: convertToUtc(start),
            calendarEnd: convertToUtc(end),
            calendarName: title,
            color,
            department: "개발팀", // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
            detail,
            registrantId: token.memberId
        };
        dispatch(callInsertCalendarAPI(requestData));
    };

    const handleUpdate = ({ id, title, start, end, color, detail }) => {
        const requestData = {
            calendarNo: id,
            calendarStart: convertToUtc(start),
            calendarEnd: convertToUtc(end),
            calendarName: title,
            color,
            detail
        };
        dispatch(callUpdateCalendarAPI(requestData));
    };

    const handleDelete = id => dispatch(callDeleteCalendarAPI(id));

    // TODO: 나중에 부서 선택해서 추가하는 기능넣어야 함
    useEffect(() => {dispatch(callSelectCalendarAPI("개발팀"))} , [insertMessage, updateMessage, deleteMessage]);
    
    useEffect(() => updateEvents(calendarList, setEvents), [calendarList]);


    return <>
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>캘린더</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item">캘린더</li>
                    </ol>
                </nav>
            </div>
            <Fullcalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={'dayGridMonth'}
                customButtons={{
                    AddButton: {
                        text: "일정 등록",
                        click: handleOpenModal
                    }
                }}
                headerToolbar={{
                    start: 'prev,today,next AddButton',             // 툴바 좌측
                    center: 'title',                                // 툴바 중앙
                    end: 'dayGridMonth,timeGridWeek,timeGridDay'    // 툴바 우측
                }}

                events={events}
                eventDidMount={info => calendarPopover(info)}
                eventClick={handleEventClick}
                locale={koLocale}
            />
        </main>
        <CalendarModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleInsert} />
        {selectedEvent && <CalendarUpdateModal isOpen={isModalOpen} onClose={handleCloseModal} onUpdate={handleUpdate} onDelete={handleDelete} event={selectedEvent} />}
    </>

}

export default Calendar