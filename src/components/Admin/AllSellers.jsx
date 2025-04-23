import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [sellerOrders, setSellerOrders] = useState([]);

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  // Function to fetch orders associated with the seller's products
  const fetchSellerOrders = async (sellerId) => {
    try {
      const response = await axios.get(
        `${server}/orders/get-orders-for-seller/${sellerId}`,
        { withCredentials: true }
      );
      setSellerOrders(response.data.orders || []);
    } catch (error) {
      toast.error("Failed to fetch orders.");
    }
  };

  const handleDelete = async (id) => {
    // Fetch orders for the seller's products
    await fetchSellerOrders(id);
    if (sellerOrders.length > 0) {
      // If there are orders, show them to the admin before deletion
      setUserId(id);
      setOpen(true);
    } else {
      // If no orders exist, delete the seller directly
      try {
        const response = await axios.delete(`${server}/shop/delete-seller/${id}`, {
          withCredentials: true,
        });
        toast.success(response.data.message);
        dispatch(getAllSellers());
      } catch (error) {
        toast.error("Failed to delete seller.");
      }
    }
  };

  const confirmDeleteSeller = async () => {
    try {
      const response = await axios.delete(`${server}/shop/delete-seller/${userId}`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      dispatch(getAllSellers());
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete seller.");
    }
  };

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "address",
      headerName: "Seller Address",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "  ",
      flex: 1,
      minWidth: 150,
      headerName: "Preview Shop",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/shop/preview/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Delete Seller",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Sellers</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you want to delete this seller?
              </h3>
              <h4 className="text-center text-red-500">The seller has orders placed for their products!</h4>
              <div>
                <h4 className="text-center font-bold">Orders for Seller's Products:</h4>
                <ul>
                  {sellerOrders.length > 0 ? (
                    sellerOrders.map((order) => (
                      <li key={order._id}>
                        Order ID: {order._id}, Product: {order.product.name}, Customer: {order.user.name}
                      </li>
                    ))
                  ) : (
                    <p>No orders found for this seller's products.</p>
                  )}
                </ul>
              </div>
              <div className="w-full flex items-center justify-center mt-4">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={confirmDeleteSeller}
                >
                  Confirm Deletion
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
