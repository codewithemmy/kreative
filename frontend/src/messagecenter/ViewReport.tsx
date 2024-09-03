import React from 'react';
import Avartar from "../assets/avartar.jpeg";
import dayjs from "dayjs";
import ViewModal from '../header/ViewModal';
import CustomButton from '../customBtn';


interface ReportItem {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface ReportDatum {
  reportId: string;
  reporter: ReportItem[];
  reportedUser: ReportItem[];
  subject: string;
  createdAt: string;
  topic: string;
}

interface Props {
  onCloseModal: () => void;
  datum: ReportDatum | null;
}

function ViewReport({ onCloseModal, datum }: Props) {

  const handleCloseModal = () => {
    onCloseModal();
  };

  const handleImageDownload = () => {
    const link = document.createElement('a');
    link.href = datum?.reporter[0].image || '';
    link.download = 'report_image.png';
    link.click();
  };

  return (
    <div>
      <ViewModal isVisible={true} onClose={handleCloseModal} text="Report Details">
        <div className='p-6'>
          <h4>Reported User</h4>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <img src={datum?.reportedUser[0]?.image || Avartar} alt="" className='mr-4 h-[80px] w-[80px] rounded-[50%]' />
              <div>
                <h4>{datum?.reporter[0].name}</h4>
                <p className='font-bold text-[18px]'>ReportId-  <span className='font-normal'>{datum?.reportId}</span> </p>
              </div>
            </div>
            <div>
              <div className='flex justify-between'>
                <p>{dayjs(datum?.createdAt).format("DD MMM YYYY")}</p>
              </div>
            </div>
          </div>
          <div className='bg-[#F7F7F7] p-6 my-4'>
            <div>
              <p className='text-[#454545]'>Subject:</p>
              <h4 className='my-2 font-bold'>{datum?.subject}</h4>
            </div>
            <div className='my-4'>
              <p className='text-[#454545]'>Message:</p>
              <h4 className='font-bold text-[14px] my-4 leading-6'>{datum?.subject}</h4>
            </div>
          </div>
          <div className='w-full flex items-center justify-around'>
            <img src={datum?.reporter[0].image} alt="" className='h-12 w-12 shadow-sm rounded-sm' />
            <p className='text-hover cursor-pointer' onClick={handleImageDownload}>Download Image</p>
          </div>
          <div className='flex justify-end my-4'>
            <CustomButton type='button' text="Respond to Report" width='150px' bgColor="#6C1EEB"
            hover= "#3944BC" />
          </div>
        </div>
      </ViewModal>
    </div>
  );
}

export default ViewReport;
