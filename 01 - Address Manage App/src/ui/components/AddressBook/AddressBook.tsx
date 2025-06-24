import React from "react";
import { useAppSelector } from "../../../core/store/hooks";

import useAddressBook from "../../hooks/useAddressBook";
import Address from "../Address/Address";
import Button from "../Button/Button";
import Card from "../Card/Card";
import $ from "./AddressBook.module.css";
import { selectAddress } from "../../../core/reducers/addressBookSlice";

const AddressBook = () => {
  const addresses = useAppSelector(selectAddress);
  const { removeAddress, loadSavedAddresses, loading } = useAddressBook();
  const addressBookTitle = `📓 Address book (${addresses.length})`;

  React.useEffect(() => {
    loadSavedAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={$.addressBook}>
      <h2>{addressBookTitle}</h2>
      {!loading && (
        <>
          {addresses.length === 0 && <p>No addresses found, try add one 😉</p>}
          {addresses.map((address, index) => {
            return (
              <Card key={address.id}>
                <div data-testid={`address-${index}`} className={$.item}>
                  <div>
                    <h3>
                      {address.firstName} {address.lastName}
                    </h3>
                    <Address {...address} />
                  </div>
                  <div className={$.remove}>
                    <Button
                      variant="secondary"
                      onClick={() => removeAddress(address.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </section>
  );
};

export default AddressBook;
