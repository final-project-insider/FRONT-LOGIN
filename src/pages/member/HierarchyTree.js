import '../../css/member/hierarchyTree.css';
import { callShowAllMemberListAPI } from '../../apis/MemberAPICalls';
import { callPositionDetailListAPI } from '../../apis/PositionAPICalls';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/common.css';
import Tree from 'react-d3-tree';
import { width } from '@mui/system';

function HierarchyTree() {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [organizationalChart, setOrganizationalChart] = useState(null);
    const [position, setPosition] = useState([]);
    const [memberLists, setMemberLists] = useState([]);
    const treeContainerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const navigate = useNavigate();

    const handleZoomIn = () => {
        setZoomLevel(prevZoomLevel => Math.min(prevZoomLevel + 0.2, 1.6));
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoomLevel => Math.max(prevZoomLevel - 0.1, 0.6));
    };

    const handleZoomReturn = () => {
        setZoomLevel(1);
    };

    const handleNameClick = (member) => {
        navigate(`/ManageMember/${member.memberId}`);
    };

    const fetchPositionDetails = async () => {
        try {
            const positionDetailList = await callPositionDetailListAPI();
            setPosition(positionDetailList);
        } catch (error) {
            console.error('Error fetching position details:', error);
        }
    };

    const fetchMemberLists = async () => {
        try {
            const memberLists = await callShowAllMemberListAPI();
            const formattedMembers = memberLists.map(member => ({
                ...member,
                employedDate: formatDate(member.employedDate)
            }));
            setMemberLists(formattedMembers);
        } catch (error) {
            console.error('Error fetching member list:', error);
        }
    };

    useEffect(() => {
        fetchPositionDetails();
        fetchMemberLists();
    }, []);

    useEffect(() => {
        if (position.length > 0 && memberLists.length > 0) {
            const chartData = createOrganizationalChart();
            setOrganizationalChart(chartData);
        }
    }, [position, memberLists]);

    useEffect(() => {
        const updateDimensions = () => {
            if (treeContainerRef.current) {
                setDimensions({
                    width: treeContainerRef.current.offsetWidth,
                    height: treeContainerRef.current.offsetHeight,
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const formatDate = (dateArray) => {
        if (Array.isArray(dateArray) && dateArray.length === 3) {
            const [year, month, day] = dateArray;
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
        return dateArray;
    };

    const createOrganizationalChart = () => {
        const positionLevel1 = position[0]?.positionLevel;
        const memberWithPositionLevel1 = memberLists.find(member => member.positionDTO.positionLevel === positionLevel1);
    
        if (!memberWithPositionLevel1) {
            console.error('No member found with positionLevel1:', positionLevel1);
            return null;
        }
    
        const chart = {
            name: memberWithPositionLevel1.positionDTO.positionName,
            attributes: [memberWithPositionLevel1.name],
            memberId: memberWithPositionLevel1.memberId, // Add memberId
            children: []
        };
    
        const departments = {};
    
        memberLists.forEach(member => {
            const { positionDTO, name, departmentDTO, memberId, employedDate } = member;
            const { positionLevel, positionName } = positionDTO;
            const { departName } = departmentDTO;
    
            if (positionLevel !== positionLevel1 && positionName !== position[0].positionName) {
                if (!departments[departName]) {
                    departments[departName] = {
                        name: departName,
                        attributes: [],
                        children: []
                    };
                }
    
                departments[departName].children.push({
                    name: name,
                    attributes: [positionName],
                    positionLevel: parseInt(positionLevel),
                    memberId, // Add memberId
                    employedDate: new Date(employedDate), // Parse employedDate to Date object
                    children: []
                });
            }
        });
    
        // Ensure the children under departments are sorted vertically by positionLevel, then by employedDate
        chart.children = Object.values(departments).map(department => {
            department.children.sort((a, b) => {
                if (a.positionLevel === b.positionLevel) {
                    return a.employedDate - b.employedDate;
                }
                return a.positionLevel - b.positionLevel;
            });
            return department;
        });
    
        console.log('Generated organizational chart:', chart);
        return chart;
    };

    const svgSquare = (width, height) => ({
        shape: "rect",
        shapeProps: {
            width: "200%",
            height: height,
            x: -width / 2,
            y: -height / 2,
            color: "#ffffff"
        }
    });

    const renderRectSvgNode = ({ nodeDatum, toggleNode, handleNameClick }) => {
        const isMember = nodeDatum.attributes && nodeDatum.attributes.length > 0;
        const isCEO = nodeDatum.name === "대표이사";
    
        const handleClick = () => {
            if (nodeDatum.memberId) {
                handleNameClick({ memberId: nodeDatum.memberId });
            }
        };
    
        return (
            <g>
                <rect width="180" height={isMember && !isCEO ? 60 : 40} x="-90" y={isMember && !isCEO ? "-30" : "-20"} onClick={toggleNode} fill='white' stroke="#3f72af" strokeWidth="2" rx="5" ry="5" />
                {isMember && !isCEO ? (
                    <>
                        <text
                            x="0"
                            y="-10"
                            textAnchor="middle"
                            fill="black" 
                            ontStyle="normal"
                            fontSize="16"
                            stroke='none'
                            fontWeight="500"
                            onClick={handleClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {nodeDatum.attributes[0]}
                        </text>
                        <text
                            x="0"
                            y="15"
                            textAnchor="middle"
                            fill="black"
                            fontSize="14"
                            fontWeight="500"
                            stroke='none'
                            fontStyle="normal"
                            onClick={handleClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {nodeDatum.name}
                        </text>
                    </>
                ) : (
                    <text
                        x="0"
                        y="5"
                        textAnchor="middle"
                        fill="black"
                        fontSize="16"
                        fontWeight="500"
                        stroke='none'
                        fontStyle="normal"
                        onClick={handleClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {isCEO ? nodeDatum.attributes[0] : nodeDatum.name}
                    </text>
                )}
            </g>
        );
    };

    const renderTree = () => {
        if (!organizationalChart) {
            return null;
        }
    
        return (
            <div ref={treeContainerRef} className='treeWrapper card' >
                <Tree
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.3s' }}
                    data={organizationalChart}
                    orientation="vertical"
                    rootNodeClassName="node__root"
                    branchNodeClassName="node__branch"
                    leafNodeClassName="node__leaf"
                    pathFunc="step"
                    collapsible={true}
                    translate={{ x: 900, y: 200 }}
                    nodeSvgShape={svgSquare}
                    zoomable={true}
                    allowForeignObjects={true}
                    scaleExtent={{ min: 0.1, max: 2 }}
                    renderCustomNodeElement={(rd3tProps) =>
                        renderRectSvgNode({ ...rd3tProps, handleNameClick })
                    }
                    initialDepth={1}
                    separation={{ siblings: 1.5, nonSiblings: 2 }}
                    styles={{
                        links: { stroke: '#ccc' },
                        nodes: {
                            node: { fill: 'red' },
                            leafNode: { fill: 'green' }
                        }
                    }}
                    zoom={zoomLevel}
                />
            </div>
        );
    };

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>조직도</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">조직</li>
                        <li className="breadcrumb-item active">조직도</li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <i style={{ cursor: 'pointer' }} className="ri ri-zoom-in-line ri-2x p-2" onClick={handleZoomIn}></i>
                    <i style={{ cursor: 'pointer' }} className="ri ri-zoom-out-line ri-2x p-2" onClick={handleZoomOut}></i>
                    {zoomLevel !== 1 && <i style={{ cursor: 'pointer' }} className="ri ri-refresh-line ri-2x p-2" onClick={handleZoomReturn}></i>}
                    {renderTree()}
                </div>
            </div>
        </main>
    );
}

export default HierarchyTree;
