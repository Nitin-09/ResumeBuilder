import React, { useState, useEffect, useContext } from 'react';
import Section from './Section';
import Form from './Form';
import { useParams, Link } from 'react-router-dom';
import ResumeContext from '../context/Resume/ResumeContext';

function Body() {
    const { fetchResume } = useContext(ResumeContext);
    const { resumeId } = useParams();

    const [activeKey, setActiveKey] = useState("PERSONAL DETAIL");
    const [sectionKeys, setSectionKeys] = useState(["PERSONAL DETAIL", "OBJECTIVE", "EDUCATION", "EXPERIENCE", "SKILLS", "PROJECTS","ADD MORE SECTIONS","REARRANGE SECTIONS"]);

    useEffect(() => {
        fetchResume(resumeId)
            .then(resumeData => {
                console.log(resumeData?.data?.sectionKeys)
                setSectionKeys(resumeData?.data?.sectionKeys || ["PERSONAL DETAIL", "OBJECTIVE", "EDUCATION", "EXPERIENCE", "SKILLS", "PROJECTS", "ADD MORE SECTIONS","REARRANGE SECTIONS"]);
            })
            .catch(error => {
                console.error("Error fetching resume:", error);
                // Handle error, perhaps set some default values or display an error message.
                setSectionKeys(["PERSONAL DETAIL", "OBJECTIVE", "EDUCATION", "EXPERIENCE", "SKILLS", "PROJECTS", "ADD MORE SECTIONS"]);
            });
    }, [resumeId]);

    return (
        <div className='bg-white m-2 rounded-lg flex relative'>
            <div className='w-[20%] bg-black'>
                <Section activeKey={activeKey} setActiveKey={setActiveKey} sectionKeys={sectionKeys}></Section>
            </div>
            <div className='w-[80%]'>
                <Form activeKey={activeKey} sectionKeys={sectionKeys} setSectionKeys={setSectionKeys}></Form>
            </div>
            <div className="fixed z-40 bottom-4 right-4">
                <Link to={`/resume/${resumeId}`}
                    className=" w-20 h-20 rounded-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                    View Resume
                </Link>
            </div>
        </div>
    );
}

export default Body;
