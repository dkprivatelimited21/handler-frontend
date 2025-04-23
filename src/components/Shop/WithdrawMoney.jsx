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
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [upiId, setUpiId] = useState("");

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
        <div>
          <h3 className="text-[22px] font-Poppins text-center font-[600]">
            Add new Withdraw Method:
          </h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter UPI ID (e.g., user@upi)"
              value={upiId || ""}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full border p-2 mt-4 rounded"
            />
            <div className="w-full flex items-center">
              <button
                type="submit"
                className={`${styles.button} text-[#fff] text-[18px] mt-4`}
              >
                Add UPI Method
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <h3 className="text-[22px] font-Poppins">Available Withdraw Methods:</h3>

          {seller && seller?.withdrawMethod ? (
            <div>
              <div className="800px:flex w-full justify-between items-center">
                <div className="800px:w-[50%]">
                  <h5>UPI ID: {seller?.withdrawMethod.upiId}</h5>
                </div>
                <div className="800px:w-[50%]">
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
              <div className="800px:flex w-full items-center">
                <input
                  type="number"
                  min="50"
                  placeholder="Amount..."
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="800px:w-[100px] w-[full] border 800px:mr-3 p-1 rounded"
                />
                <div
                  className={`${styles.button} !h-[42px] text-white`}
                  onClick={withdrawHandler}
                >
                  Withdraw
                </div>
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
              <div className="w-full flex items-center">
                <div
                  className={`${styles.button} text-[#fff] text-[18px] mt-4`}
                  onClick={() => setPaymentMethod(true)}
                >
                  Add UPI Method
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WithdrawMoney;
