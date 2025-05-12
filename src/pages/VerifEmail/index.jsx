import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      if (!redirectUrl) {
        toast.error("Yönləndirmə linki tapılmadı.");
        setStatus("error");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        await axios.get(redirectUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        toast.success("Email uğurla təsdiqləndi.");
        setStatus("success");
        // Redirect after showing success animation
        setTimeout(() => navigate("/profile"), 2000);
      } catch (err) {
        console.error(err);
        toast.error("Təsdiqləmə zamanı xəta baş verdi.");
        setStatus("error");
      }
    };

    verify();
  }, [redirectUrl, navigate]);

  const renderStatus = () => {
    switch (status) {
      case "verifying":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ImSpinner8 className="w-12 h-12 text-blue-500" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-medium text-gray-700"
            >
              Email təsdiqlənir...
            </motion.p>
          </motion.div>
        );
      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <FaCheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-medium text-gray-700"
            >
              Email uğurla təsdiqləndi!
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500"
            >
              Siz avtomatik olaraq profil səhifəsinə yönləndiriləcəksiniz...
            </motion.p>
          </motion.div>
        );
      case "error":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <FaTimesCircle className="w-16 h-16 text-red-500" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-medium text-gray-700"
            >
              Təsdiqləmə zamanı xəta baş verdi
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              Yenidən cəhd edin
            </motion.button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-303px)] flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white rounded-lg shadow-lg"
      >
        {renderStatus()}
      </motion.div>
    </div>
  );
};
