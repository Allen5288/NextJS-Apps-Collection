// DO NOT MODIFY

export interface AddressModel {
  city: string;
  firstName: string;
  houseNumber: string;
  id: string;
  lastName: string;
  postcode: string;
  street: string;
}

export interface RawAddressModel extends AddressModel {
  lat: string;
  lon: string;
}

export default function transformAddress(data: RawAddressModel): AddressModel {
  const { firstName, lastName, city, houseNumber, lat, lon, postcode, street } =
    data;
  return {
    city: city || "",
    firstName: firstName || "",
    houseNumber: houseNumber || "",
    id: `${lat || Date.now()}_${lon || Math.random()}`,
    lastName: lastName || "",
    postcode: postcode || "",
    street: street || "",
  };
}
