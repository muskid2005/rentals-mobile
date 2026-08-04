import { useUserStore } from "../../store/useStore";
import OwnerProfile from "../pages/ownerProfile";
import RenterProfile from "../pages/renterProfile";

export default function Profile() {
  const { user } = useUserStore();
  const isOwner = user?.lastName?.toLowerCase() === "verified";

  return isOwner ? <OwnerProfile /> : <RenterProfile />;
}
