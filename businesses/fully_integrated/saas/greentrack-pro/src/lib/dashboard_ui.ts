interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  dataTestId?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, dataTestId }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      data-testid={dataTestId}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// Usage
<Button label="Calculate Sum" onClick={() => calculateSum(5, 3)} />

<Button label="Calculate Sum" onClick={() => {
  try {
    const result = calculateSum(5, 3);
    // Handle the result or update the UI
  } catch (error) {
    // Display an error message or prevent the button from being clicked
    alert(error.message);
  }
}} />

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  dataTestId?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, dataTestId }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      data-testid={dataTestId}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// Usage
<Button label="Calculate Sum" onClick={() => calculateSum(5, 3)} />

<Button label="Calculate Sum" onClick={() => {
  try {
    const result = calculateSum(5, 3);
    // Handle the result or update the UI
  } catch (error) {
    // Display an error message or prevent the button from being clicked
    alert(error.message);
  }
}} />

In this example, the Button component accepts props like label, onClick, disabled, and dataTestId. The `dataTestId` prop is useful for testing purposes, making the component more accessible.

To handle edge cases, you can use the `calculateSum` function within the `onClick` event of the Button component. If the function throws an error, you can catch it and handle it appropriately, such as displaying an error message or preventing the button from being clicked.