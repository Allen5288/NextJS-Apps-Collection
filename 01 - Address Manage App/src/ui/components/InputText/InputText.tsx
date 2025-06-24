import React, { FunctionComponent } from "react";

import $ from "./InputText.module.css";

interface InputTextProps {
  name: string;
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputText: FunctionComponent<InputTextProps> = ({
  name,
  onChange,
  placeholder,
  value,
}) => {
  return (
    <input
      aria-label={name}
      className={$.inputText}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
};

export default InputText;
