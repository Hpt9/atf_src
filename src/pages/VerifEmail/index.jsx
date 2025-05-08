import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!redirectUrl) {
        toast.error("Yönləndirmə linki tapılmadı.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(redirectUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        toast.success("Email uğurla təsdiqləndi.");
        // məsələn, 3 saniyə sonra əsas səhifəyə yönləndir
        setTimeout(() => navigate("/profile"), 3000);
      } catch (err) {
        console.error(err);
        toast.error("Təsdiqləmə zamanı xəta baş verdi.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [redirectUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? <p>Email təsdiqlənir...</p> : <p>Təsdiqləmə prosesi tamamlandı.</p>}
    </div>
  );
};
