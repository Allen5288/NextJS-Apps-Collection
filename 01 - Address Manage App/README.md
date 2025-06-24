# React Dev Test Assignment ⚛️

https://drive.google.com/file/d/1qwPJQL04jhTgPuf3hfyUPfqZK2F6T604/view?usp=sharing

## Description

Try to finish as much TODO's as possible. These are found within the React app codebase. When you view the `/src` folder you will find an application for users that want to create their own addressbook (also shown in the video above). But as mentioned before there are some TODO's to be completed in order to make the application work as expected.

In order to start this assignment you need to:

- ⬇️ Clone this repository
- 👨‍💻 Open up your preferred editor (mine is VS Code)
- 🏃🏻‍♂️ Run `npm install` and then `npm start`
- 🔎 Search for all `TODO:` strings within the `/src` folder and start building!

> Note: You will find some Bonus TODO's. These are not mandatory for completing this assignment. Feel free to flex your programming skills 💪

## TODO's

Here is a list of all the TODO's to make life a bit easier:

### Styling

- [ ] Add the 'Roboto' font from Google fonts and add it as a global CSS var called `--font-primary`.
- [ ] Make application responsive. It is already for the most part, but it is not optimal for smaller screens.
- [ ] Create separate styles for .primary and .secondary variants of the button component. Use the brand color #413ef7 for both of these buttons.

### React

- [ ] Write a custom hook to set form fields in a more generic way.
- [ ] Fetch addresses based on houseNumber and postCode. Do not introduce any additional 3rd party libraries to do this.
- [ ] Create generic `<Form />` component to display form rows, legend and a submit button.
- [ ] Create an `<ErrorMessage />` component for displaying an error message.
- [ ] Add a button to clear all form fields. Button must look different from the default primary button, see design.
- [ ] Add conditional classNames for `primary` and `secondary` variant in `<Button />` component\
- [ ] Ensure form validations are applied in both "Find an Address" and "Add Personal Info to address" based on comments in TODO

## Typescript

- [ ] Refactor the `extraProps` in `<Form />` component. Use a proper type to cover all the different form property types.
- [ ] Defined a typescript type for the button type inside `src/types/button`. This type should only include all the possible types for a button.

### Redux

- [ ] Prevent duplicate addresses.
- [ ] Write a state update which removes an address from the addresses array.

### Bonus

- [ ] Refactor the code in pages/api/getAddresses so that there is no duplication of logic for street number and postcode digit checking
