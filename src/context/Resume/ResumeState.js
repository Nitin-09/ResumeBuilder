import ResumeContext from "./ResumeContext.js";
import { useState } from "react";
import axios from "axios";

const ResumeState = (props) => {
  const host = "https://resumebuilderbackend.netlify.app/.netlify/functions";

  const submitDetails = async (details, resumeId) => {
    try {
      const response = await axios.post(
        `${host}/api/resume/submitdetails/${resumeId}`,
        details,
        {
          headers: {
            'content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDetails = async (formType, formData, resumeId) => {
    try {
      const response = await axios.delete(
        `${host}/api/resume/deleteform/${resumeId}`,
        {
          data: { formType, formData },
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  const getTemplates = async (setTemplateData) => {
    try {
      const response = await axios.get(
        `${host}/api/templates/getTemplates`,
        {
          headers: {
            // Add headers if needed
          },
        }
      );

      setTemplateData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllResume = async () => {
    try {
      const response = await axios.post(
        `${host}/api/resume/fetchAllResume`,
        {},
        {
          headers: {
            'content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResume = async (resumeId) => {
    try {
      const response = await axios.post(
        `${host}/api/resume/fetchResume`,
        { rid: resumeId },
        {
          headers: {
            'content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        }
      );

      return response.data[0];
    } catch (error) {
      console.log(error);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const response = await axios.delete(
        `${host}/api/resume/deleteresume/${resumeId}`,
        {
          headers: {
            'content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const createEmptyResume = async () => {
    try {
      const response = await axios.post(
        `${host}/api/resume/createresume`,
        {},
        {
          headers: {
            'content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        }
      );
      return response.data._id
      // console.log(response.data);
      // If needed, you can perform additional actions with the created resume data
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        createEmptyResume,
        submitDetails,
        getTemplates,
        fetchResume,
        fetchAllResume,
        deleteDetails,
        deleteResume

      }}
    >
      {props.children}
    </ResumeContext.Provider>
  );
};

export default ResumeState;
