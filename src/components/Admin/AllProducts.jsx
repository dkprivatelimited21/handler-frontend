import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [data, setData] = useState([]);
  const { user } = useSelector((state) => state.user);

  // 🔁 Fetch products on mount
  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
      });
  }, []);

  // 🗑️ Admin-only product delete handler
  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this product?");
      if (!confirmed) return;

      await axios.delete(`${server}/product/admin-delete-product/${id}`, {
        withCredentials: true,
      });

      toast.success("Product deleted successfully!");
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // 📊 Table column config
  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    { field: "Stock", headerName: "Stock", type: "number", minWidth: 80, flex: 0.5 },
    { field: "sold", headerName: "Sold out", type: "number", minWidth: 130, flex: 0.6 },
    {
      field: "Preview",
      headerName: "",
      minWidth: 100,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${params.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) =>
        user?.role === "Admin" ? (
          <Button onClick={() => handleDelete(params.id)}>
            <AiOutlineDelete size={20} color="red" />
          </Button>
        ) : null,
    },
  ];

  // 🧮 Convert product data into table rows
  const row = data.map((item) => ({
    id: item._id,
    name: item.name,
    price: "₹ " + item.discountPrice,
    Stock: item.stock,
    sold: item.sold_out,
  }));

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AllProducts;
