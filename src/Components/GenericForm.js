import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResumeContext from '../context/Resume/ResumeContext';

const GenericForm = ({ formTitle, itemListProp, formFields, canAddItem = true }) => {
  const { submitDetails, fetchResume, deleteDetails } = useContext(ResumeContext);
  const { resumeId } = useParams();
  const [itemList, setItemList] = useState(formFields[formTitle]);

  const getDefaultFormValues = (fields) => {
    const defaultValues = {};
    Object.keys(fields).forEach((fieldName) => {
      if (fieldName !== formTitle) {
        defaultValues[fieldName] = '';
      }
    });
    return defaultValues;
  };
  


  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItemList = [...itemList];
    updatedItemList[index][name] = value;
    setItemList(updatedItemList);
  };

  const handleDeleteItem = async (index) => {
    try {
      await deleteDetails(formTitle, index, resumeId);

      // Update the UI by removing the deleted item from itemList
      const updatedItemList = [...itemList];
      updatedItemList.splice(index, 1);
      setItemList(updatedItemList);

      // Additional UI updates or logic if needed
    } catch (error) {
      console.error("Error deleting item:", error);
      // Handle error, perhaps show an error message to the user
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { [formTitle.replace(" ", "").toUpperCase()]: itemList }
    await submitDetails(data, resumeId);
    // Save form data to localStorage
    // localStorage.setItem(formTitle, JSON.stringify(data));
    // Additional logic after submitting details, if needed
  };

  useEffect(() => {
    fetchResume(resumeId)
      .then(resumeData => {
        const savedFormData = resumeData?.data[formTitle.replace(" ","").toUpperCase()] || formFields[formTitle];
        setItemList(savedFormData);
      })
      .catch(error => {
        console.error(error);
      });
  }, [resumeId, formTitle]);



  return (
    <div className="container mx-4 mt-10">
      <form onSubmit={handleSubmit} className="w-full mx-auto">
        {itemList?.map((item, index) => (
          <div key={index} className="mb-4">
            {canAddItem && (
              <div className="flex items-center mb-2">
                <span className="mr-2 text-sm font-medium text-gray-600 capitalize">
                  {formTitle} {index + 1}:
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(index)}
                  className="text-red-500 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            )}
            {itemListProp.map((field) => (
              <div key={field.name} className="mb-2">
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-600">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={item[field.name]}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                ) : (
                  <input
                    type={field.type || 'text'} // Use specified type or default to 'text'
                    name={field.name}
                    value={item[field.name]}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        {canAddItem && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setItemList([...itemList, { ...getDefaultFormValues(formFields) }])}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Add {formTitle}
            </button>

          </div>
        )}

        <div className="mt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenericForm;
