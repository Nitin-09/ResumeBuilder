import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResumeContext from '../context/Resume/ResumeContext';
const SectionForm = ({ setSectionKeys, sectionKeys, setSectionForms, sectionForms }) => {
    const { submitDetails, fetchResume, deleteDetails } = useContext(ResumeContext);
    const { resumeId } = useParams();

    const config = [
        { "name": "SectionTitle", "label": "Title", "type": "text" },
        {
            "name": "SectionType",
            "label": "Section Type",
            "type": "radio",
            "options": [
                { "name": "SimpleList", "label": "Simple List", "value": "Simple List" },
                { "name": "Advanced", "label": "Advanced (Title & Description)", "value": "Advanced (Title & Description)" },
                { "name": "Complex", "label": "Complex (Description and URL)", "value": "Complex (Description and URL)" }
            ]
        }
    ];

    const initialState = Object.fromEntries(config.map(field => [field.name, ""]));


    const handleAddSection = () => {
        // setSections([...sections, initialState]);
        setSectionForms([...sectionForms, initialState]);
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedSections = [...sectionForms];
        const oldTitle = updatedSections[index]["SectionTitle"].toUpperCase();
        
        // Update section key if SectionTitle is being changed
        if (name === "SectionTitle" && oldTitle !== value.toUpperCase()) {
            const updatedKeys = [...sectionKeys];
            const keyIndex = updatedKeys.indexOf(oldTitle);
            if (keyIndex !== -1) {
                updatedKeys[keyIndex] = value.toUpperCase();
                setSectionKeys(updatedKeys);
            }
        }
    
        updatedSections[index][name] = value;
        setSectionForms(updatedSections);
    };
    

    const handleDeleteSection = async (index) => {
        const updatedSections = [...sectionForms];
        const deletedSectionTitle = updatedSections[index]["SectionTitle"].toUpperCase();

        try {
            // Call the deleteDetails function
            await deleteDetails("sectionForms",deletedSectionTitle , resumeId);

            // Update the UI by removing the deleted section from sectionForms
            setSectionForms((prevForms) =>
                prevForms.filter((form) => form["SectionTitle"].toUpperCase() !== deletedSectionTitle)
            );

            // Update the UI by removing the deleted section key from sectionKeys
            setSectionKeys((prevKeys) =>
                prevKeys.filter((key) => key !== deletedSectionTitle)
            );
        } catch (error) {
            console.error("Error submitting details after deletion:", error);
            // Handle error, perhaps set some default values or display an error message.
        }
    };

    const handleSubmit = async (e, index) => {
        e.preventDefault();
        const submittedTitle = sectionForms[index]["SectionTitle"].toUpperCase();
    
        if (sectionKeys.includes(submittedTitle)) {
            console.error("Error: Title already present");
        } else {
            try {
                // Update sectionKeys state and wait for it to complete
                const updatedKeys = await new Promise((resolve) => {
                    setSectionKeys((prevKeys) => {
                        resolve(prevKeys.concat(submittedTitle));
                        return prevKeys.concat(submittedTitle);
                    });
                });
    
                // Update sectionForms state and wait for it to complete
                const updatedForms = await new Promise((resolve) => {
                    setSectionForms((prevForms) => {
                        const newForms = [...prevForms];
                        resolve(newForms);
                        return newForms;
                    });
                });
    
                // Optionally, fetch resume again to ensure you have the latest data
                // await fetchResume(resumeId).then(resumeData => setSectionForms(resumeData?.data?.sectionForms));
    
                // Now that both sectionKeys and sectionForms are updated, you can proceed with submitDetails
                const sectionData = { sectionKeys: updatedKeys, sectionForms: updatedForms };
                console.log(sectionData);
                await submitDetails(sectionData, resumeId);
            } catch (error) {
                console.error("Error submitting details:", error);
                // Handle error, perhaps set some default values or display an error message.
            }
        }
    };
    


    useEffect(() => {
        fetchResume(resumeId)
            .then(resumeData => {
                setSectionForms(resumeData?.data?.sectionForms || []);
            })
            .catch(error => {
                console.error("Error fetching resume:", error);
                // Handle error, perhaps set some default values or display an error message.
            });
    }, [resumeId]);


    return (
        <div className="container mx-4 mt-10">
            {sectionForms?.map((section, index) => (
                <form key={index} onSubmit={(e) => handleSubmit(e, index)} className="w-full mx-auto mb-8">
                    {config.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-600">
                                {field.label}
                            </label>
                            {field.type === 'text' ? (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    onChange={(e) => handleChange(e, index)}
                                    value={section[field.name]}
                                    className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                />
                            ) : (
                                <div>
                                    {field.options.map((option) => (
                                        <div key={option.value} className="flex items-center">
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                id={option.value}
                                                value={option.value}
                                                checked={section[field.name] === option.value}
                                                onChange={(e) => handleChange(e, index)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={option.value} className="text-sm font-medium text-gray-600">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-between items-center gap-2">
                        <button
                            type="submit"
                            className="w-2/3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                        >
                            Submit Section
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDeleteSection(index)}
                            className="w-1/3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                        >
                            Delete Section
                        </button>
                    </div>
                </form>
            ))}

            <div className="mt-4">
                <button
                    type="button"
                    onClick={handleAddSection}
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                    Add Section
                </button>
            </div>
        </div>
    );
};

export default SectionForm;
