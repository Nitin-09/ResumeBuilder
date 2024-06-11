import React, { useRef, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResumeContext from '../context/Resume/ResumeContext';
import { useReactToPrint } from 'react-to-print';

const Resume = () => {
    const { fetchResume } = useContext(ResumeContext);
    const { resumeId } = useParams();
    const [data, setData] = useState([]);
    const resumeRef = useRef();

    const options = {
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    };

    const handlePrint = useReactToPrint({
        content: () => resumeRef.current,
        pageStyle: `
            @page {
                margin: 15mm 15mm 15mm 15mm;
            }
        `,
    });

    const downloadResume = async () => {
        await fetchResume(resumeId)
            .then((resumeData) => {
                setData(resumeData?.data);
            })
            .catch((error) => {
                console.error('Error fetching resume:', error);
            });

        handlePrint();
    };

    useEffect(() => {
        fetchResume(resumeId)
            .then((resumeData) => {
                console.log(resumeData?.data);
                setData(resumeData?.data);
            })
            .catch((error) => {
                console.error('Error fetching resume:', error);
            });
    }, [resumeId]);
    useEffect(() => {
    }, [data])

    const componentMap = {
        'PERSONAL DETAIL': (sectionTitle) => {
            const sectionKey = sectionTitle.replace(" ", "");
            const sectionData = data?.[sectionKey];

            if (sectionData) {
                return (
                    <div id='personal-details'>
                        <h1 className='font-bold text-[18px] leading-8 uppercase'>{sectionTitle}</h1>
                        <hr className='border' />
                        <div className='flex flex-col text-[16px] p-2'>
                            {sectionData.dateOfBirth && (
                                <div className='grid grid-cols-2 w-full px-2'>
                                    <li><span>Date of Birth:</span></li>
                                    <span className=''>{sectionData.dateOfBirth}</span>
                                </div>
                            )}
                            {sectionData.maritalStatus && (
                                <div className='grid grid-cols-2 w-full px-2'>
                                    <li><span>Marital Status:</span></li>
                                    <span>{sectionData.maritalStatus}</span>
                                </div>
                            )}
                            {sectionData.nationality && (
                                <div className='grid grid-cols-2 w-full px-2'>
                                    <li><span>Nationality:</span></li>
                                    <span>{sectionData.nationality}</span>
                                </div>
                            )
                            }
                            {
                                sectionData.gender && (
                                    <div className='grid grid-cols-2 w-full px-2'>
                                        <li> <span>Gender:</span></li >
                                        <span>{sectionData.gender}</span>
                                    </div >
                                )}
                            {
                                sectionData.permanentAddress && (
                                    <div className='grid grid-cols-2 w-full px-2'>
                                        <li><span>Permanent Address:</span></li>
                                        <span>{sectionData.permanentAddress}</span>
                                    </div>
                                )
                            }
                            {
                                sectionData.languages && sectionData.languages.length > 0 && (
                                    <div className='grid grid-cols-2 w-full px-2'>
                                        <li><span>Languages Known:</span></li>
                                        <span>{sectionData.languages.join(', ')}</span>
                                    </div>
                                )
                            }
                            {/* Add more fields as needed */}
                        </div >
                    </div >
                );
            } else {
                return null;
            }
        },

        'OBJECTIVE': (sectionTitle) => {
            const sectionKey = sectionTitle.replace(" ", "");
            const sectionData = data?.[sectionKey];

            if (Array.isArray(sectionData) && sectionData.length > 0) {
                return (
                    <div id='objective'>
                        <h1 className='font-bold text-[18px] leading-8 uppercase'>{sectionTitle}</h1>
                        <hr className='border' />
                        <div className='p-2'>
                        {sectionData.map((objective, index) => (
                            <div className='flex text-[16px] px-2' key={index}>
                                <li className='list-disc'></li>
                                <h3 className=''>{objective.objective}</h3>
                            </div>
                        ))}
                        </div>
                    </div>
                );
            } else {
                // Don't render anything if there is no data for this section
                return null;
            }
        },

        'EDUCATION': (sectionTitle) => {
            const sectionKey = sectionTitle.replace(" ", "");
            const sectionData = data?.[sectionKey];

            if (Array.isArray(sectionData) && sectionData.length > 0) {
                return (
                    <div id='education' className=''>
                        <h1 className='font-bold text-[18px] leading-8 uppercase'>{sectionTitle}</h1>
                        <hr className='border' />
                        <div className='p-2'>
                            {sectionData.map((education, index) => (
                                <div className='flex w-full justify-between px-2' key={index}>
                                    <div className='flex'>
                                        <li className='text-[16px] list-disc'></li>
                                        <div className='text-[16px] '>
                                            <h3 className='font-bold'>{education.degree}</h3>
                                            <h3>{education.university}</h3>
                                            <h3>{education.score}</h3>
                                        </div>
                                    </div>
                                    <h3 className='text-[16px]'>{education.year}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } else {
                // Don't render anything if there is no data for this section
                return null;
            }
        },

        'PROJECTS': (sectionTitle) => {
            const sectionKey = sectionTitle.replace(" ", "");
            const sectionData = data?.[sectionKey];

            if (Array.isArray(sectionData) && sectionData.length > 0) {
                return (
                    <div id='projects'>
                        <h1 className='font-bold text-[18px] leading-8 uppercase'>{sectionTitle}</h1>
                        <hr className='border' />
                        <div className='p-2'>
                            {sectionData.map((project, index) => (
                                <div className='flex w-full justify-between px-2' key={index}>
                                    <div className='flex'>
                                        <li className='text-[16px] list-disc'></li>
                                        <div className='text-[16px] '>
                                            <h3 className='font-bold'>{project.title}</h3>
                                            <h3>{project.keySkills}</h3>
                                            <div className='flex gap-1'>
                                                <h3>Link to Project -</h3>
                                                <a className='underline text-blue-600 ' href={project.url}>
                                                    Click Here
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className='text-[16px]'>{project.date}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } else {
                // Don't render anything if there is no data for this section
                return null;
            }
        },
        'WORK EXPERIENCE': (sectionTitle) => {
            const sectionKey = sectionTitle.replace(" ", "");
            const sectionData = data?.[sectionKey];

            if (Array.isArray(sectionData) && sectionData.length > 0) {
                return (
                    <div id='experience'>
                        <h1 className='font-bold text-[18px] leading-8 uppercase'>{sectionTitle}</h1>
                        <hr className='border' />
                        <div className='p-2'>
                            {sectionData.map((experience, index) => (
                                <div className='flex w-full justify-between px-2' key={index}>
                                    <div className='flex'>
                                        <li className='text-[16px] list-disc'></li>
                                        <div className='text-[16px] '>
                                            <h3 className='font-bold'>{experience.companyName}</h3>
                                            <h3>{experience.jobTitle}</h3>
                                            <h3>{experience.detail}</h3>
                                        </div>
                                    </div>
                                    <h3 className='text-[16px]'>{experience.date}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } else {
                // Don't render anything if there is no data for this section
                return null;
            }
        },
        'SKILLS': (sectionTitle) => {
            const sectionKey = sectionTitle.replace(" ", "");
            const sectionData = data?.[sectionKey];

            if (Array.isArray(sectionData) && sectionData.length > 0) {
                return (
                    <div id='skills'>
                        <h1 className='font-bold text-[18px] leading-8 uppercase'>{sectionTitle}</h1>
                        <hr className='border' />
                        <div className='p-2'>
                            {sectionData.map((skill, index) => (
                                <div className='flex text-[16px] px-2' key={index}>
                                    <li className='list-disc'></li>
                                    <h3 className=''>{skill.skill}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } else {
                // Don't render anything if there is no data for this section
                return null;
            }
        },

    }

    return (
        <div className="bg-gray-200 flex flex-col items-center justify-center m-[20mmm]">

            <div ref={resumeRef} className="bg-white p-2">
                {/* <style>{getPageMargins()}</style> */}
                <div id="basic" className='flex flex-col justify-center items-center w-full gap-2'>
                    <h1 className='font-bold text-[18px] leading-8 uppercase'>{data?.PERSONALDETAIL?.name}</h1>
                    <h3 className='text-[16px] line'>{data?.PERSONALDETAIL?.address}</h3>
                    <h3 className='text-[16px]'>
                        {data?.PERSONALDETAIL?.phone}
                        {data?.PERSONALDETAIL?.email && data?.PERSONALDETAIL.phone && " | "}
                        <a className='underline text-blue-600 ' href={data?.PERSONALDETAIL?.email}>
                            {data?.PERSONALDETAIL?.email}
                        </a>
                    </h3>

                    <h3 className='text-[16px]'>
                        <a className='underline text-blue-600 ' href={data?.PERSONALDETAIL?.linkedin}>
                            LinkedIn
                        </a>
                        {data?.PERSONALDETAIL?.linkedin && data.PERSONALDETAIL.github && " | "}
                        <a className='underline text-blue-600' href={data?.PERSONALDETAIL?.github}>
                            GitHub
                        </a>
                        {data?.PERSONALDETAIL?.github && data.PERSONALDETAIL.website && " | "}
                        <a className='underline text-blue-600' href={data?.PERSONALDETAIL?.website}>
                            Portfolio
                        </a>
                    </h3>
                </div>
                {data?.sectionOrder?.map((sectionTitle) => {
                    if (sectionTitle === 'PERSONAL DETAIL' || sectionTitle === 'OBJECTIVE' || sectionTitle === 'EDUCATION' || sectionTitle === 'WORK EXPERIENCE' || sectionTitle === 'PROJECTS' || sectionTitle === 'SKILLS') {
                        const renderComponent = componentMap[sectionTitle];
                        return renderComponent && renderComponent(sectionTitle);
                    }
                    else {
                        const sectionKey = sectionTitle.replace(" ", "");

                        const sectionData = data?.[sectionKey];

                        if (Array.isArray(sectionData) && sectionData.length > 0) {
                            return (
                                <div id={sectionTitle} key={sectionTitle}>
                                    <h1 className='font-bold text-[18px] leading-8 uppercase'>{sectionTitle}</h1>
                                    <hr className='border' />
                                    <div className='p-2'>
                                        {sectionData.map((title, index) => (
                                            <div className='flex text-[16px] px-2' key={index}>
                                                <li className='list-disc'></li>
                                                <h3 className=''>{title.description}</h3>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    }



                })}


            </div >

            <div className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer download-button" onClick={downloadResume}>
                Download as PDF
            </div>

        </div >
    );
};

export default Resume;
