import { useUserStore } from "../../store/useStore";
import OwnerListItemScreen from "../pages/ownerList";
import RenterListItemScreen from "../pages/renterList";

export default function Profile() {
  const { user } = useUserStore();
  const isOwner = user?.lastName?.toLowerCase() === "verified";

  return isOwner ? <OwnerListItemScreen /> : <RenterListItemScreen />;
}
