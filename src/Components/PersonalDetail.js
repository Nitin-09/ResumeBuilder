import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ResumeContext from '../context/Resume/ResumeContext';

const PersonalDetailsForm = () => {
    const { submitDetails, fetchResume } = useContext(ResumeContext);
    const { resumeId } = useParams();

    const checkboxOptions = [
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
        { name: 'nationality', label: 'Nationality', type: 'text' },
        { name: 'maritalStatus', label: 'Marital Status', type: 'text' },
        { name: 'website', label: 'Website', type: 'text' },
        { name: 'linkedin', label: 'Linkedin', type: 'text' },
        { name: 'github', label: 'Github', type: 'text' },
        { name: 'gender', label: 'Gender', type: 'text' },
        { name: 'permanentAddress', label: 'Permanent Address', type: 'text' },
        { name: 'photo', label: 'Photo', type: 'file' },
    ]

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        nationality: '',
        maritalStatus: '',
        website: '',
        linkedin: '',
        github: '',
        gender: '',
        permanentAddress: '',
        photo: '',
    });

    const [showDrawer, setShowDrawer] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (option) => {
        if (selectedOptions.includes(option.name)) {
            setSelectedOptions(selectedOptions.filter((opt) => opt !== option.name));
        } else {
            setSelectedOptions([...selectedOptions, option.name]);
        }
    };
    const getLabelFromName = (name) => {
        const option = checkboxOptions.find((opt) => opt.name === name);
        return option ? option.label : name;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitDetails({ "PERSONALDETAIL": formData,"selectedOptions":selectedOptions }, resumeId);
    };

    const handleAddMore = () => {
        setShowDrawer(true);
    };

    const handleDrawerClose = () => {
        setShowDrawer(false);
    };

    useEffect(() => {
        fetchResume(resumeId)
            .then(resumeData => {
                // Access your data here
                setFormData(prevFormData => {
                    const savedFormData = resumeData?.data?.PERSONALDETAIL;
                    return savedFormData ? { ...prevFormData, ...savedFormData } : prevFormData;
                });

                // Update selectedOptions based on the fetched data
                const savedOptions = resumeData?.data?.selectedOptions || []
                setSelectedOptions(savedOptions);
            })
            .catch(error => {
                // Handle errors
                console.error(error);
            });
    }, [resumeId]);
    // Include selectedOptions in the dependency array




    return (
        <div className="container mx-4 mt-10">
            <form onSubmit={handleSubmit} className="w-full mx-auto">
                {[
                    { name: 'name', label: 'Name', type: 'text' },
                    { name: 'address', label: 'Address', type: 'textarea' },
                    { name: 'email', label: 'Email', type: 'email' },
                    { name: 'phone', label: 'Phone', type: 'number' },
                ].map((field) => (
                    <div key={field.name} className="mb-4">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-600">
                            {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                            <textarea
                                name={field.name}
                                id={field.name}
                                rows="3"
                                onChange={handleChange}
                                value={formData[field.name]}
                                className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                id={field.name}
                                onChange={handleChange}
                                value={formData[field.name]}
                                className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                        )}
                    </div>
                ))}

                {/* Drawer */}
                {showDrawer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white p-4 max-w-md w-full">
                            <h2 className="text-xl font-semibold mb-4">Additional Options</h2>
                            {/* Checkbox options */}
                            {checkboxOptions.map((field) => (
                                <div key={field.name} className="mb-4">
                                    {console.log(field.label)}
                                    <input
                                        type="checkbox"
                                        id={field.name}
                                        name={field.name}
                                        onChange={() => handleCheckboxChange(field)}
                                        checked={selectedOptions.includes(field.name)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={field.name} className="text-sm font-medium text-gray-600">
                                        {field.label}
                                    </label>
                                </div>
                            ))}
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={handleDrawerClose}
                                className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {selectedOptions.map((optionName) => (
                    <div key={optionName} className="mb-4">
                        <label htmlFor={optionName} className="block text-sm font-medium text-gray-600">
                            {getLabelFromName(optionName)}
                        </label>
                        <input
                            type={formData[optionName] === 'date' ? 'date' : 'text'} 
                            name={optionName}
                            id={optionName}
                            onChange={handleChange}
                            value={formData[optionName]}
                            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                ))}

                {/* Submit button */}

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleAddMore}
                        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Add More
                    </button>
                </div>
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

export default PersonalDetailsForm;
