import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  if (!userInfo) {
    return null; // Render nothing if userInfo is null
  }
  const fullName = userInfo?.fullName || "User";
  return (
    <div className="flex items-center gap-3 justify-end">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-black font-medium bg-slate-200 uppercase">
        {getInitials(fullName)}
      </div>
      <div>
        <p className="text-sm font-medium">{fullName}</p>
        <button className="text-sm text-danger underline" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
