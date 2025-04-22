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
  const [paymentMethod, setPaymentMethod] = useState(false);  // <-- Define paymentMethod state
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [upiId, setUpiId] = useState(""); // Only UPI ID for withdraw method

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller?._id));
  }, [dispatch]);

  const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  if (!upiId) {
    toast.error("Please enter a valid UPI ID.");
    return;
  }
    const withdrawMethod = {
    upiId: upiId, // Store only UPI ID
  };

  setPaymentMethod(false); // Close the payment method section after submitting

  try {
    const response = await axios.put(
      `${server}/shop/update-payment-methods`,
      { withdrawMethod },
      { withCredentials: true }
    );
    toast.success("Withdraw method added successfully!");
    dispatch(loadSeller());
    setUpiId(""); // Reset the UPI ID field after successful submission
  } catch (error) {
    console.log(error.response?.data?.message || error.message);
    toast.error("Failed to add UPI method. Please try again.");
  }
};
  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully!");
        dispatch(loadSeller());
      });
  };

  const error = () => {
    toast.error("You do not have enough balance to withdraw!");
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error("You can't withdraw this amount!");
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("Withdraw money request is successful!");
          setOpen(false);
          setWithdrawAmount(50);
          dispatch(loadSeller());
        });
    }
  };

  const availableBalance = Number(seller?.availableBalance?.toFixed(2));
  const taxRate = 0.18;
  const serviceCharge = Number((withdrawAmount * taxRate).toFixed(2));
  const finalAmount = Number((withdrawAmount - serviceCharge).toFixed(2));

 
return (
  <div>
    {paymentMethod ? (
      <div>
        <h3 className="text-[22px] font-Poppins text-center font-[600]">
          Add new Withdraw Method:
        </h3>
        <form onSubmit={handleSubmit}> {/* Ensure form submission triggers handleSubmit */}
          {/* UPI ID form input */}
          <input
            type="text"
            placeholder="Enter UPI ID (e.g., user@upi)"
            value={upiId || ""}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full border p-2 mt-4 rounded"
          />
          <div className="w-full flex items-center">
            <button
              type="submit"  // Ensure this button triggers the form submission
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
        {/* Your existing UI for displaying current withdraw methods */}
      </>
    )}
  </div>
);

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
                          onClick={() => deleteHandler()}
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
                        <p className="text-sm">
                          Service Tax (18%): ₹{serviceCharge}
                        </p>
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
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
