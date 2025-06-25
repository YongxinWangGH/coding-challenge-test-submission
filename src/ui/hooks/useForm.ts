import { useState } from "react";

interface FormValues {
  [key: string]: string;
}

export default function useForm(initialValues: FormValues) {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormValues(initialValues);
  };

  return {
    formValues,
    handleChange,
    resetForm
  };
}
