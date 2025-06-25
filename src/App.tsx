import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import Form from "@/components/Form/Form";
import useForm from "@/hooks/useForm";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function transformAddress (address: any, houseNumber: string): AddressType {
  return {
    ...address,
    houseNumber,
    id: address.id || `${address.lat}-${address.long}` // Dynamically generate id
  };
};

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  // const [postCode, setPostCode] = React.useState("");
  // const [houseNumber, setHouseNumber] = React.useState("");
  // const [firstName, setFirstName] = React.useState("");
  // const [lastName, setLastName] = React.useState("");
  const [selectedAddress, setSelectedAddress] = React.useState("");

  const initialFindAddressFormValues = {
    postCode: "",
    houseNumber: "",
  };

  const initialAddInfoFormValues = {
    firstName: "",
    lastName: "",
  }; 

  const { formValues: findAddressFormValues, handleChange: handleFindChange, resetForm: resetAddressForm } = useForm(initialFindAddressFormValues);
  const { postCode, houseNumber} = findAddressFormValues;

  const { formValues: addInfoFormValues, handleChange: handleAddChange, resetForm: resetPersonForm } = useForm(initialAddInfoFormValues);
  const { firstName, lastName } = addInfoFormValues;

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
   * Text fields onChange handlers
   */
  // const handlePostCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setPostCode(e.target.value);

  // const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setHouseNumber(e.target.value);

  // const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setFirstName(e.target.value);

  // const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setLastName(e.target.value);

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);

  const handleClear = () => {
    setError(undefined);
    setAddresses([]);
    setSelectedAddress("");
    setLoading(false);
    resetAddressForm()
    resetPersonForm()
  }

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  
  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postCode || !houseNumber) {
      setError("Post code and house number fields mandatory!");
      return;
    }
    setError('');
    setLoading(true);
    setAddresses([]);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );
      
      const data = await response.json();
      if (!response.ok) {
        setError(data.errormessage || "Failed to fetch addresses");
        setLoading(false);
        return;
      }
      const transformedAddresses = data.details.map((address: AddressType) =>
        transformAddress(address, houseNumber)
      );
      setAddresses(transformedAddresses);
    } catch (error) {
      console.error("Error fetching addresses:", (error as any)?.errormessage!);
      setError("Failed to fetch addresses, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    if (!firstName || !lastName) {
      setError("First name and last name fields mandatory!");
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
  };

  const findAddressFormEntries = [
    {
      name: "postCode",
      placeholder: "Post Code",
      extraProps: { value: postCode, onChange: handleFindChange},
    },
    {
      name: "houseNumber",
      placeholder: "House number",
      extraProps: { value: houseNumber, onChange: handleFindChange },
    },
  ];

  const addInfoFormEntries = [
    {
      name: "firstName",
      placeholder: "First name",
      extraProps: { value: firstName, onChange: handleAddChange },
    },
    {
      name: "lastName",
      placeholder: "Last name",
      extraProps: { value: lastName, onChange: handleAddChange },
    }
  ];

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          label="🏠 Find an address"
          loading={loading}
          formEntries={findAddressFormEntries}
          onFormSubmit={handleAddressSubmit}
          submitText='Find'
        />

        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleSelectedAddressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={loading}
            formEntries={addInfoFormEntries}
            onFormSubmit={handlePersonSubmit}
            submitText='Add to addressbook'
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage message={error} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
        <Button variant='secondary' onClick={handleClear}>Clear all fields</Button>

      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
