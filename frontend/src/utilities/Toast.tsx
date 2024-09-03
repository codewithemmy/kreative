import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const successNotifier = (info: string) => {
  const options: ToastOptions = {
    className: 'bg-green-500 text-white',
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  toast.success(info, options);
};

export const errorNotifier = (errorMessage: string) => {
  const options: ToastOptions = {
    className: 'bg-red-500 text-white',
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  toast.error(errorMessage, options);
};
