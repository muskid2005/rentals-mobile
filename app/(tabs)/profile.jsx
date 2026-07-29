import { useState } from "react";
import OwnerProfile from "../pages/ownerProfile";
import RenterProfile from "../pages/renterProfile";

export default function Profile() {
  const [user, setUser] = useState("renter");
  return user === "owner" ? (
    <OwnerProfile />
  ) : user === "renter" ? (
    <RenterProfile />
  ) : null;
}
