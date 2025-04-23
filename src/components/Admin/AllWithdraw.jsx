import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState(null);
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Withdraw Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "shopId",
      headerName: "Shop Id",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "serviceCharge",
      headerName: "Service Charge",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "finalAmount",
      headerName: "Final Amount",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "upiId",
      headerName: "UPI ID",
      minWidth: 150,
      flex: 1.4,
    },
    {
      field: "status",
      headerName: "Status",
      type: "text",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Request Given At",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        return (
          <BsPencil
            size={20}
            className={`$${
              params.row.status !== "Processing" ? "hidden" : ""
            } mr-5 cursor-pointer`}
            onClick={() => {
              setWithdrawData(params.row);
              setWithdrawStatus(params.row.status);
              setOpen(true);
            }}
          />
        );
      },
    },
  ];

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
          status: withdrawStatus,
          amount: withdrawData.amount,
        },
        { withCredentials: true }
      );

      toast.success("Withdraw request updated successfully!");

      setData((prevData) =>
        prevData.map((item) =>
          item._id === withdrawData.id
            ? { ...item, status: withdrawStatus }
            : item
        )
      );

      if (withdrawStatus === "Succeed" && withdrawData?.withdrawMethod?.upiId) {
        const upiLink = `upi://pay?pa=${withdrawData.withdrawMethod.upiId}&pn=${withdrawData.seller.name}&cu=INR&am=${withdrawData.amount}`;
        window.open(upiLink, "_blank");
        toast.success("UPI Payment Link generated successfully!");
      }

      setOpen(false);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error("Failed to update withdraw request");
    }
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: "US$ " + item.amount,
        serviceCharge: "US$ " + item.serviceCharge,
        finalAmount: "US$ " + (item.amount - item.serviceCharge),
        upiId: item.withdrawMethod?.upiId || "Not Provided",
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
        withdrawMethod: item.withdrawMethod,
        seller: item.seller,
      });
    });

  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>

      {open && withdrawData && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Update Withdraw Status
            </h1>
            <br />
            <p className="text-center text-gray-700 mb-2">
              UPI ID: <span className="font-semibold">{withdrawData.withdrawMethod?.upiId || "Not Provided"}</span>
            </p>
            <select
              name=""
              id=""
              value={withdrawStatus}
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded"
            >
              <option value="Processing">Processing</option>
              <option value="Succeed">Succeed</option>
            </select>
            <button
              type="submit"
              className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
