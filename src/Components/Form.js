import React, { useState, useEffect, useContext } from 'react';
import PersonalDetail from './PersonalDetail';
import GenericForm from './GenericForm';
import AddMoreSection from './AddMoreSection';
import { useParams } from 'react-router-dom';
import ResumeContext from '../context/Resume/ResumeContext';
import Rearrange from './Rearrange';

function Form(props) {
  const { fetchResume } = useContext(ResumeContext);
  const { resumeId } = useParams();
  const [sectionForms, setSectionForms] = useState([])
  useEffect(() => {
    fetchResume(resumeId)
      .then(resumeData => {
        console.log(resumeData?.data?.sectionForms)
        setSectionForms(resumeData?.data?.sectionForms);
      })
      .catch(error => {
        console.error("Error fetching resume:", error);
        // Handle error, perhaps set some default values or display an error message.
      });
  }, [resumeId]);

  const educationFields = {
    'Course / Degree': { label: 'Course / Degree', name: 'degree', type: 'text' },
    'School / University': { label: 'School / University', name: 'university', type: 'text' },
    'Grade / Score': { label: 'Grade / Score', name: 'score', type: 'text' },
    'Year': { label: 'Year', name: 'year', type: 'text' },
  };

  const experienceFields = {
    'Company Name': { label: 'Company Name', name: 'companyName', type: 'text' },
    'Job Title': { label: 'Job Title', name: 'jobTitle', type: 'text' },
    'Date': { label: 'Date', name: 'date', type: 'text' },
    'Detail': { label: 'Detail', name: 'detail', type: 'textarea' },
  };

  const skillsFields = {
    'Skill': { label: 'Skill', name: 'skill', type: 'text' }
  };

  const projectsFields = {
    'Title': { label: 'Title', name: 'title', type: 'text' },
    'Key Skills': { label: 'Key Skills', name: 'keySkills', type: 'textarea' },
    'Date': { label: 'Date', name: 'date', type: 'text' },
    'URL': { label: 'URL', name: 'url', type: 'text' },
  };

  const componentMap = {
    'PERSONAL DETAIL': <PersonalDetail />,
    'OBJECTIVE': <GenericForm
      formTitle="objective"
      itemListProp={[{ name: 'objective', label: 'Objective', type: 'textarea' }]}
      formFields={{ "objective": [{ 'objective': '' }] }}
      activeKey={props.activeKey}
      canAddItem={false}
    />,
    'EDUCATION': (
      <GenericForm
        formTitle="Education"
        itemListProp={Object.values(educationFields)}
        formFields={{ 'Education': [{ 'degree': '', 'university': '', 'score': '', 'year': '' }] }}
        activeKey={props.activeKey}
      />
    ),
    'EXPERIENCE': (
      <GenericForm
        formTitle="Work Experience"
        itemListProp={Object.values(experienceFields)}
        formFields={{ "Work Experience": [{ 'companyName': '', 'jobTitle': '', 'date': '', 'detail': '' }] }}
        activeKey={props.activeKey}
      />
    ),
    'SKILLS': (
      <GenericForm
        formTitle="Skills"
        itemListProp={Object.values(skillsFields)}
        formFields={{ "Skills": [{ "skill": "" }] }}
        activeKey={props.activeKey}
      />
    ),
    'PROJECTS': (
      <GenericForm
        formTitle="Project"
        itemListProp={Object.values(projectsFields)}
        formFields={{ 'Project': [{ 'title': '', 'keySkills': '', 'date': '', 'url': '' }] }}
        activeKey={props.activeKey}

      />
    ),
    'ADD MORE SECTIONS': <AddMoreSection setSectionForms={setSectionForms} sectionForms={sectionForms} setSectionKeys={props.setSectionKeys} sectionKeys={props.sectionKeys} />,
    'REARRANGE SECTIONS': <Rearrange />,
  };


  return (
    <div className='bg-white m-2 rounded-lg mr-4'>
      {componentMap[props.activeKey]}

      {sectionForms?.map((form, index) => (
        <div key={index} className=''>
          {console.log(form.SectionTitle.toUpperCase(), form.SectionType)}
          {form.SectionType === 'Simple List' && props.activeKey === form.SectionTitle.toUpperCase() && <GenericForm
            formTitle={form.SectionTitle}
            itemListProp={Object.values({
              ['Description']: { label: 'Description', name: 'description', type: 'textarea' }
            })}
            formFields={{ [form.SectionTitle]: [{ 'description': '' }] }}
            canAddItem={true}
          />}
          {form.SectionType === 'Advanced (Title & Description)' && props.activeKey === form.SectionTitle.toUpperCase() && <GenericForm
            formTitle={form.SectionTitle}
            itemListProp={Object.values({
              ['Title']: { label: 'Title', name: 'title', type: 'text' },
              ['Description']: { label: 'Description', name: 'description', type: 'textarea' }
            })}
            formFields={{
              [form.SectionTitle]: [{
                'title': '',
                'description': '',
              }]
            }}
          />}
          {form.SectionType === 'Complex (Description and URL)' && props.activeKey === form.SectionTitle.toUpperCase() && <GenericForm
            formTitle={form.SectionTitle}
            itemListProp={Object.values({
              'Description': { label: 'Description', name: 'description', type: 'textarea' },
              'URL': { label: 'URL', name: 'url', type: 'text' },
            })}
            formFields={{
              [form.SectionTitle]: [{
                'description': '',
                'url': '',
              }]
            }}
          />}
        </div>
      ))}
    </div>
  );
}

export default Form;