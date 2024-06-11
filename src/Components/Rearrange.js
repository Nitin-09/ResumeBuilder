import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ResumeContext from '../context/Resume/ResumeContext';

// ... (imports)

const Section = ({ id, text, index, moveSection }) => {
    const [{ isDragging }, ref] = useDrag({
        type: 'SECTION',
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'SECTION',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveSection(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div ref={(node) => ref(drop(node))} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}>
            <ul className="w-full flex flex-col">
                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium odd:bg-gray-100 bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg hover:bg-gray-300 ">
                    {text}
                </li>
            </ul>
        </div>
    );
};

const Rearrange = () => {
    const { fetchResume, submitDetails } = useContext(ResumeContext); // Assuming submitDetails is available in your context.
    const { resumeId } = useParams();
    const [sectionOrder, setSectionOrder] = useState([]);

    useEffect(() => {
        fetchResume(resumeId)
            .then((resumeData) => {
                setSectionOrder(
                    (resumeData?.data?.sectionKeys || ["PERSONAL DETAIL", "OBJECTIVE", "EDUCATION", "WORK EXPERIENCE", "SKILLS", "PROJECTS", "ADD MORE SECTIONS", "REARRANGE SECTIONS"]).filter(section =>
                        section !== "ADD MORE SECTIONS" && section !== "REARRANGE SECTIONS"
                    )
                );
            })
            .catch((error) => {
                console.error('Error fetching resume:', error);
                // Handle error, perhaps set some default values or display an error message.
            });
    }, [fetchResume, resumeId]);

    const moveSection = (fromIndex, toIndex) => {
        setSectionOrder((prevOrder) => {
            const newOrder = [...prevOrder];
            const [removed] = newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, removed);
            // You can update the order in the context or send it to the server here
            return newOrder;
        });
    };

    const handleSubmit = async () => {
        const data = { sectionOrder: sectionOrder }; // Assuming sectionOrder is the correct key
        await submitDetails(data, resumeId);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                {sectionOrder.map((section, index) => (
                    <Section
                        key={section}
                        id={section}
                        text={section}
                        index={index}
                        moveSection={moveSection}
                    />
                ))}

                <div className="mt-4">
                    <button
                        onClick={handleSubmit}
                        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </DndProvider>
    );
};

export default Rearrange;
