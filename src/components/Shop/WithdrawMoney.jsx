import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner

  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller?._id));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure UPI ID is provided
    if (!upiId || !/^[a-zA-Z0-9._@-]+$/.test(upiId)) {
      toast.error("Please enter a valid UPI ID.");
      return;
    }

    const withdrawMethod = {
      upiId: upiId,
    };

    setPaymentMethod(false); // Close the payment method section
    setLoading(true); // Show spinner while waiting for backend response

    try {
      const response = await axios.put(
        `${server}/shop/update-payment-methods`,
        { withdrawMethod },
        { withCredentials: true }
      );
      toast.success("Withdraw method added successfully!");
      dispatch(loadSeller());
      setUpiId(""); // Reset UPI ID field after success
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
      toast.error("Failed to add UPI method. Please try again.");
    } finally {
      setLoading(false); // Hide spinner after response
    }
  };

  const deleteHandler = async () => {
    try {
      await axios.delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      });
      toast.success("Withdraw method deleted successfully!");
      dispatch(loadSeller());
    } catch (error) {
      toast.error("Failed to delete withdraw method. Please try again.");
    }
  };

  const error = () => {
    toast.error("You do not have enough balance to withdraw!");
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error("You can't withdraw this amount!");
    } else {
      const amount = withdrawAmount;
      setLoading(true); // Show spinner while waiting for backend response
      try {
        const response = await axios.post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        );
        toast.success("Withdraw money request is successful!");
        setOpen(false);
        setWithdrawAmount(50);
        dispatch(loadSeller());
      } catch (error) {
        toast.error("Failed to request withdraw. Please try again.");
      } finally {
        setLoading(false); // Hide spinner after response
      }
    }
  };

  const availableBalance = Number(seller?.availableBalance?.toFixed(2));
  const taxRate = 0.18;
  const serviceCharge = Number((withdrawAmount * taxRate).toFixed(2));
  const finalAmount = Number((withdrawAmount - serviceCharge).toFixed(2));

  return (
    <div className="w-full flex items-center">
      {paymentMethod ? (
        <div className="w-full flex flex-col items-center p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-[22px] font-Poppins text-center font-[600] mb-4">
            Add new Withdraw Method:
          </h3>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <input
              type="text"
              placeholder="Enter UPI ID (e.g., user@upi)"
              value={upiId || ""}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full border p-2 mt-4 rounded"
            />
            <div className="w-full flex justify-center mt-4">
              <button
                type="submit"
                className={`${styles.button} text-[#fff] text-[18px] w-full max-w-[300px] h-[40px] mt-4 ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                disabled={loading} // Disable button during loading
              >
                {loading ? (
                  <div className="loader"></div> // Add a spinner when loading
                ) : (
                  "Add UPI Method"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col items-center">
            <h3 className="text-[22px] font-Poppins mb-4">Available Withdraw Methods:</h3>

            {seller && seller?.withdrawMethod ? (
              <div className="w-full max-w-md bg-white shadow-lg p-4 rounded-lg">
                <div className="w-full flex justify-between items-center">
                  <div className="w-[80%]">
                    <h5>UPI ID: {seller?.withdrawMethod.upiId}</h5>
                  </div>
                  <div className="w-[20%] flex justify-end">
                    <AiOutlineDelete
                      size={25}
                      className="cursor-pointer"
                      onClick={deleteHandler}
                    />
                  </div>
                </div>
                <br />
                <h4>Available Balance: ₹{availableBalance}</h4>
                <br />
                <div className="w-full flex items-center justify-between mt-4">
                  <input
                    type="number"
                    min="50"
                    placeholder="Amount..."
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-[70%] border p-2 rounded"
                  />
                  <button
                    className={`${styles.button} !h-[42px] text-white w-[28%]`}
                    onClick={withdrawHandler}
                    disabled={loading} // Disable button during loading
                  >
                    {loading ? (
                      <div className="loader"></div> // Add a spinner when loading
                    ) : (
                      "Withdraw"
                    )}
                  </button>
                </div>
                {withdrawAmount >= 50 && withdrawAmount <= availableBalance && (
                  <div className="mt-2">
                    <p className="text-sm">Service Tax (18%): ₹{serviceCharge}</p>
                    <p className="text-sm font-semibold">
                      Final Amount You’ll Receive: ₹{finalAmount}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="w-full flex justify-center">
                  <button
                    className={`${styles.button} text-[#fff] text-[18px] mt-4`}
                    onClick={() => setPaymentMethod(true)}
                  >
                    Add UPI Method
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WithdrawMoney;
