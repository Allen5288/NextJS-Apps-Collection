import React from "react";

interface FormFields {
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
}

interface UseFormFieldsReturn {
  fields: FormFields;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFields: () => void;
}

const useFormFields = (): UseFormFieldsReturn => {
  const [fields, setFields] = React.useState<FormFields>({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const clearFields = React.useCallback(() => {
    setFields({
      postCode: "",
      houseNumber: "",
      firstName: "",
      lastName: "",
      selectedAddress: "",
    });
  }, []);

  return {
    fields,
    onChange,
    clearFields,
  };
};

export default useFormFields;
