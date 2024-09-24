import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setIsShowPassword(() => !isShowPassword);
  };
  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
      <input
        placeholder={placeholder || "Password"}
        value={value}
        onChange={onChange}
        autoComplete="off"
        type={isShowPassword ? "text" : "password"}
        className="w-full py-3 bg-transparent outline-none"
      />
      {isShowPassword ? (
        <FaRegEye
          className="text-primary cursor-pointer"
          onClick={() => togglePasswordVisibility()}
        />
      ) : (
        <FaRegEyeSlash
          className="cursor-pointer text-slate-400"
          onClick={() => togglePasswordVisibility()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
