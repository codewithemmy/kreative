import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FormControlLabel, IconButton } from "@material-ui/core";
import { DataGrid, GridColumns } from "@material-ui/data-grid";
import PhoneOutlinedIcon from "@material-ui/icons/PhoneOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import AdminForm from "./AdminForm";
import avatar from "../../../../assets/avartar.jpeg";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Context } from "../../../../context/Context";
import ApiAuth from "../../../../api/ApiAuth";
import { errorNotifier, successNotifier } from "../../../../utilities/Toast";
import Spinner from "../../../../utilities/Spinner";
import EditAdminForm from "./EditAdminForm";
import CustomModal from "../../../../utilities/CustomModal";

interface ContactIconsProps {
  index?: number;
  phone: string;
  email: string;
  label?: string;
}

const ContactIcons: React.FC<ContactIconsProps> = ({ phone, email, index }) => {
  const handlePhoneClick = () => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`;
  };
  return (
    <FormControlLabel
      label=""
      control={
        <>
          <IconButton
            onClick={handlePhoneClick}
            color="secondary"
            aria-label="add an alarm"
          >
            <PhoneOutlinedIcon
              style={{
                color: "#3351C2",
                background: "#CCD4F0",
                borderRadius: "100%",
                padding: "5px",
                margin: "0px 10px",
              }}
            />
          </IconButton>
          <IconButton
            onClick={handleEmailClick}
            color="secondary"
            aria-label="add an alarm"
          >
            <MailOutlineOutlinedIcon
              style={{
                color: "#3351C2",
                background: "#CCD4F0",
                borderRadius: "100%",
                padding: "5px",
                margin: "0px 10px",
              }}
            />
          </IconButton>
        </>
      }
    />
  );
};

function AdminList() {
  const [adminList, setAdminList] = useState<any[]>([]);
  const [branchList, setBranchList] = useState<any[]>([]);
  const [nem, setNem] = useState<string | null>(null);
  const { adminAccess, sent, setSent } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState<string | "">("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const navigateToDetails = (id: string) => {
    const branchName = getBranchNameById(id);
    navigate(`/admin/admin-profile/${id}`, {
      state: { adminList: adminList, branchName: branchName },
    });
  };

  const getBranchNameById = (id: string) => {
    const row = adminList.find(admin => admin._id === id);
    if (row) {
      const myBranch = branchList.find(branch => branch._id === row.branchId);
      return myBranch?.branchName || null;
    }
    return null;
  };

  const handleGetBranch = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(`/branch `, {
        headers: {
          Authorization: "Bearer " + adminAccess?.userToken,
        },
      });
      setIsLoading(false);
      setBranchList(response?.data.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleGetAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.get(`/admin?accountType=admin`, {
        headers: {
          Authorization: "Bearer " + adminAccess?.userToken,
        },
      });
      setIsLoading(false);
      setAdminList(response?.data.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await ApiAuth.delete(`/admin/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminAccess?.userToken}`,
        },
      });
      setSent(!sent)
      setIsLoading(false);
      successNotifier("Account deleted successfully!");
    } catch (err) {
      setIsLoading(false);
      errorNotifier(
        "Account could not delete, please contact the administrator"
      );
    }
    handleCloseDelete();
  };

  useEffect(() => {
    handleGetAdmins();
    handleGetBranch();
  }, []);

  useEffect(() => {
    handleGetAdmins();
    handleGetBranch();
  }, [sent]);

  const handleOpenEdit = (id: string) => {
    setId(id);
    setEditModal(true);
  };

  const handleCloseEdit = () => {
    setEditModal(false);
  };

  const handleOpenDelete = (id: string) => {
    setId(id);
    setDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setDeleteModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const columns: GridColumns = [
    {
      field: "IMG",
      headerName: "IMG",
      width: 80,
      renderCell: (params) => {
        return (
          <button onClick={() => navigateToDetails(params.row?.id)}>
            <div className="flex items-center space-x-3">
              <img
                className="rounded-full w-[40px] h-[40px] "
                src={params.row?.img || avatar}
                alt={params.row?.fullName}
              />
            </div>
          </button>
        );
      },
    },
    {
      field: "name",
      headerName: "NAME",
      width: 220,
      renderCell: (params) => {
        return (
          <p className="font-bold text-gray-700 pr-4">{params.row?.fullName}</p>
        );
      },
    },
    {
      field: "branchId",
      headerName: "BRANCH",
      width: 160,
      renderCell: (params) => {
        const branch = branchList?.find(
          (branch) => branch._id === params.row.branchId
        );
        const branchName = branch?.branchName;
        return (
          <p className="font-bold text-gray-700">
            {params.row.accountType === "superAdmin"
              ? "Super Admin"
              : branchName}
          </p>
        );
      },
    },

    {
      field: "email",
      headerName: "EMAIL",
      width: 200,
      renderCell: (params) => {
        return <p className="font-bold text-gray-700">{params.row?.email}</p>;
      },
    },
    {
      field: "contact",
      headerName: "CONTACT",
      width: 140,
      renderCell: (params) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <ContactIcons
              index={params.row?.id}
              phone={params.row?.phone}
              email={params.row?.email}
            />
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 140,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() => handleOpenEdit(params.row.id)}
            color="primary"
          >
            <FaEdit className="text-hover w-3 h-3 mr-4" />
          </IconButton>
          <IconButton
            onClick={() => handleOpenDelete(params.row.id)}
            className="text-red-500"
          >
            <FaTrash className="text-red-500 w-3 h-3" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Wrapper>
      <section className="students__section md:px-3 pb-12 mt-[50px]">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg md:text-xl">Admin lists</h1>

          <button
            onClick={handleOpenModal}
            className="bg-primary hover:bg-hover text-white text-[10px] md:text-[12px] py-2 px-3 rounded-[30px] md:w-[150px]"
          >
            Create New Admin
          </button>
        </div>
        {isLoading ? (
          <Spinner />
        ) : !adminList || adminList?.length === 0 ? (
          <div className="mx-auto text-center my-5 w-full font-serif font-thin text-lg md:text-xl">
            No admin added yet
          </div>
        ) : (
          <div className="grid grid-cols-1 bg-white rounded-xl shadow-xl mt-6 box-border">
            <div
              className="data__table__students"
              style={{ height: 500, width: "100%" }}
            >
              <DataGrid
                rows={adminList?.map(
                  ({
                    _id,
                    fullName,
                    image,
                    accountType,
                    branchId,
                    phone,
                    email,
                  }) => {
                    return {
                      id: _id,
                      fullName: fullName,
                      img: image,
                      branchId,
                      accountType,
                      phone: phone,
                      email: email,
                    };
                  }
                )}
                columns={columns}
                rowsPerPageOptions={[5, 7, 10]}
                pageSize={7}
                checkboxSelection
                disableSelectionOnClick
              />
            </div>
          </div>
        )}
        {editModal && id && <EditAdminForm onClose={handleCloseEdit} id={id} />}
        {deleteModal && (
          <CustomModal
            id={id}
            action={"delete"}
            type={"Account"}
            onConfirm={handleDelete}
            onCancel={handleCloseDelete}
          />
        )}
        {showModal && <AdminForm onClose={handleCloseModal} />}
      </section>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  .students__section {
    background: #f1f3f9;

    .students__heading {
      color: #3944bc;
    }

    .new__students__button {
      background: #6c1eeb;
      color: white;
      text-transform: capitalize !important;
      border-radius: 50px !important;
      padding: 12px 24px;
      font-weight: bold;
      font-size: 15px;
    }
    .data__table__students::-webkit-scrollbar {
      display: none;
    }
  }
`;

export default AdminList;
