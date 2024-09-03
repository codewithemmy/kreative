import React, { useState } from 'react';
import ViewModal from './ViewModal';
import question from '../assets/question.png';
import { MdArrowForward } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';
import CreateReport from '../users/admin/components/reports/CreateReport';
// import GuidesPage from './GuidesPage';

interface HelpCenterModalProps {
    onCloseModal: () => void;
}

export default function HelpCenterModal({ onCloseModal }: HelpCenterModalProps) {
    const [showModal, setShowModal] = useState(false);
    const [showFaqz, setShowFaqz] = useState(false);
    const [showGuides, setShowGuides] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenFaqzModal = () => {
        setShowFaqz(true);
    };

    const handleCloseFaqzModal = () => {
        setShowFaqz(false);
    };

    const handleCloseGuidesModal = () => {
        setShowGuides(false);
    };

    const handleOpenGuidesModal = () => {
        setShowGuides(true);
    };

    return (
        <div>
            <ViewModal isVisible={true} onClose={onCloseModal} text="Help Center">
                <div className="p-8">
                    <h4 className="font-bold text-[20px] my-4">How can we help you?</h4>
                    <input
                        type="text"
                        placeholder="Search for tips and resources"
                        className="border border-[#70707021] w-full rounded-[20px] text-[#606060] my-6"
                    />
                    <div className="flex justify-between my-8">
                        <div className="bg-[#F7F7F7] w-[100px] lg:w-[150px] h-[130px] flex flex-col justify-center items-center cursor-pointer" onClick={handleOpenFaqzModal}>
                            <img src={question} alt="" className="w-10 h-10 mb-2" />
                            <h4>FAQs</h4>
                        </div>
                        <div className="bg-[#F7F7F7] w-[100px] lg:w-[150px] h-[130px] flex flex-col justify-center items-center cursor-pointer" onClick={handleOpenGuidesModal}>
                            <img src={question} alt="" className="w-10 h-10 mb-2" />
                            <h4>Guides</h4>
                        </div>
                        <div className="bg-[#F7F7F7] w-[100px] lg:w-[150px] h-[130px] flex flex-col justify-center items-center cursor-pointer">
                            <img src={question} alt="" className="w-10 h-10 mb-2" />
                            <h4>Community</h4>
                        </div>
                    </div>
                    <div className="border border-[#70707021] p-2 flex justify-between items-center cursor-pointer" onClick={handleOpenModal}>
                        <h5>Report</h5>
                        <IoIosArrowForward />
                    </div>
                </div>
            </ViewModal>
            {showModal && <CreateReport onClose={handleCloseModal} />}
            {/* {showGuides && <GuidesPage onCloseModal={handleCloseGuidesModal} />} */}
        </div>
    );
}
