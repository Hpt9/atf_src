import { useState } from 'react';

const ElaqePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
        <div className="grid md:grid-cols-2 gap-8 bg-[transparent] md:bg-[#FAFAFA] p-0 md:p-[64px] rounded-[24px]">
          {/* Left Side - Contact Info */}
          <div className="space-y-6">
            <h1 className="text-[20px] md:text-[32px] font-semibold text-[#2E92A0]">
              Bizimlə əlaqə saxlayın
            </h1>
            <p className="text-[#3F3F3F] text-[16px] md:text-[24px]">
              Bütün sual, problem, bildirişlərinizi göndərə bilərsiniz
            </p>

            {/* Contact Details */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center space-x-4 p-4 border border-[#E7E7E7] rounded-lg cursor-pointer hover:border-[#2E92A0] transition-colors group">
                <div className="text-[#2E92A0]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#3F3F3F]">E-poçt ünvanı</p>
                  <p className="text-[#2E92A0]">info@kobklaster</p>
                </div>
                <div className="ml-auto rotate-[-45deg] group-hover:rotate-0 transition-transform duration-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#2E92A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4 p-4 border border-[#E7E7E7] rounded-lg cursor-pointer hover:border-[#2E92A0] transition-colors group">
                <div className="text-[#2E92A0]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6408 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5342 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18001C2.09501 3.90347 2.12788 3.62477 2.21649 3.36163C2.30511 3.09849 2.44756 2.85669 2.63476 2.65163C2.82196 2.44656 3.0498 2.28271 3.30379 2.17053C3.55777 2.05834 3.83233 2.00027 4.11 2.00001H7.11C7.59531 1.99523 8.06579 2.16708 8.43376 2.48354C8.80173 2.79999 9.04208 3.23945 9.11 3.72001C9.23662 4.68007 9.47144 5.62273 9.81 6.53001C9.94455 6.88793 9.97366 7.27692 9.89391 7.65089C9.81415 8.02485 9.62886 8.36812 9.36 8.64001L8.09 9.91001C9.51356 12.4136 11.5864 14.4865 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1859 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#3F3F3F]">Telefon</p>
                  <p className="text-[#2E92A0]">(+994) 50 123 45 67</p>
                </div>
                <div className="ml-auto rotate-[-45deg] group-hover:rotate-0 transition-transform duration-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#2E92A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-4 p-4 border border-[#E7E7E7] rounded-lg cursor-pointer hover:border-[#2E92A0] transition-colors group">
                <div className="text-[#2E92A0]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#3F3F3F]">Ünvan</p>
                  <p className="text-[#2E92A0]">Azər Azərov küçəsi</p>
                </div>
                <div className="ml-auto rotate-[-45deg] group-hover:rotate-0 transition-transform duration-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#2E92A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-lg p-6 border border-[#E7E7E7]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Ad, Soyad"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="E-Poçt ünvanı"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon nömrəniz"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F]"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Mesajınız"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0] text-[#3F3F3F] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2E92A0] text-white py-2 px-4 rounded-lg hover:bg-[#267A85] transition-colors cursor-pointer"
              >
                Göndər
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElaqePage; 