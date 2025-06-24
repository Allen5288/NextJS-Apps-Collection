import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Form from "@/components/Form/Form";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "@/hooks/useFormFields";
import transformAddress, { RawAddressModel } from "./core/models/address";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Form fields states using custom hook
   */
  const { fields, onChange, clearFields } = useFormFields();
  const { postCode, houseNumber, firstName, lastName, selectedAddress } =
    fields;

  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);

  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();
  /**
   * Fetch addresses based on houseNumber and postCode using the local BE api
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous results and errors
    setError(undefined);
    setAddresses([]);
    setLoading(true);

    // Basic validation
    if (!postCode || !houseNumber) {
      setError("Post code and house number fields are mandatory!");
      setLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.errormessage || "Failed to fetch addresses");
        return;
      }

      if (data.status === "ok" && data.details) {
        // Transform addresses and add houseNumber
        const transformedAddresses = data.details.map(
          (address: RawAddressModel) => {
            const transformed = transformAddress(address);
            return {
              ...transformed,
              houseNumber: houseNumber, // Add the searched house number
            };
          }
        );
        setAddresses(transformedAddresses);
      } else {
        setError(data.errormessage || "No addresses found");
      }
    } catch (err) {
      setError("Failed to fetch addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  /**
   * Add basic validation to ensure first name and last name fields aren't empty
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setError(undefined);

    // Validate first name and last name
    if (!firstName || !lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });

    // Clear form after successful submission
    clearFields();
    setAddresses([]);
  };

  /**
   * Clear all form fields and reset state
   */
  const handleClearFields = () => {
    clearFields();
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>{" "}
        {/* Generic Form component for finding addresses */}
        <Form
          label="🏠 Find an address"
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: postCode,
                onChange: onChange,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                value: houseNumber,
                onChange: onChange,
              },
            },
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />{" "}
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={onChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}{" "}
        {/* Generic Form component for personal info */}
        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: firstName,
                  onChange: onChange,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: lastName,
                  onChange: onChange,
                },
              },
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}{" "}
        {/* ErrorMessage component for displaying error messages */}
        {error && <ErrorMessage message={error} />}{" "}
        {/* Clear all fields button with different styling */}
        <Button variant="clear" onClick={handleClearFields}>
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
