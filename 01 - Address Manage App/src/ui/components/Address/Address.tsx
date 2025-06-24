import React, { FunctionComponent } from "react";

import $ from "./Address.module.css";

export interface AddressProps {
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
}

const Address: FunctionComponent<AddressProps> = (address) => {
  const displayedAddress = `${address.street} ${address.houseNumber}, ${address.postcode}, ${address.city}`;
  return <address className={$.address}>{displayedAddress}</address>;
};

export default Address;
