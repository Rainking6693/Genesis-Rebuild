import React from 'react';

// Use BEM naming convention for component names
// Added a unique identifier for each component
// Added a prop for the component's type
// Added a prop for the error message (if any)
// Added a prop for the loading state
// Added a prop for the success state
// Added a prop for the helper text
// Added a prop for the icon name (if any)
// Added a prop for the icon color (if any)
// Added ARIA labels for accessibility

type ComponentType = 'productReviewResponse' | 'customerFollowUpCampaign';

interface Props {
  type: ComponentType;
  message?: string;
  error?: string;
  loading?: boolean;
  success?: boolean;
  helperText?: string;
  iconName?: string;
  iconColor?: string;
  ariaLabel?: string; // Added ARIA label for accessibility
}

const ReviewCraftAIComponentBase: React.FC<Props> = ({
  type,
  message,
  error,
  loading,
  success,
  helperText,
  iconName,
  iconColor,
  ariaLabel, // Added ARIA label for accessibility
}) => {
  const getComponent = () => {
    switch (type) {
      case 'productReviewResponse':
        return <ProductReviewResponse message={message || ''} error={error || ''} loading={loading || false} success={success || false} helperText={helperText || ''} iconName={iconName || ''} iconColor={iconColor || ''} ariaLabel={ariaLabel || ''} />;
      case 'customerFollowUpCampaign':
        return <CustomerFollowUpCampaign message={message || ''} error={error || ''} loading={loading || false} success={success || false} helperText={helperText || ''} iconName={iconName || ''} iconColor={iconColor || ''} ariaLabel={ariaLabel || ''} />;
      default:
        throw new Error(`Unsupported component type: ${type}`);
    }
  };

  return (
    <div className={`review-craft-ai-component review-craft-ai-component--${type}`}>
      <div aria-label={ariaLabel}>{getComponent()}</div>
    </div>
  );
};

// ProductReviewResponse component
const ProductReviewResponse: React.FC<Props> = ({
  message,
  error,
  loading,
  success,
  helperText,
  iconName,
  iconColor,
  ariaLabel, // Added ARIA label for accessibility
}) => {
  // Added a conditional rendering for each state
  if (loading) return <div className="loading">Loading...</div>;
  if (success) return <div className="success">{message}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      {iconName && (
        <span className={`icon icon--${iconName} ${iconColor ? `icon--${iconColor}` : ''}`} aria-hidden />
      )}
      <div className="message" aria-label={`${message || ''} ${iconName ? ` with ${iconName}` : ''}`}>{message}</div>
      {helperText && <div className="helper-text">{helperText}</div>}
    </>
  );
};

// CustomerFollowUpCampaign component
const CustomerFollowUpCampaign: React.FC<Props> = ({
  message,
  error,
  loading,
  success,
  helperText,
  iconName,
  iconColor,
  ariaLabel, // Added ARIA label for accessibility
}) => {
  // Added a conditional rendering for each state
  if (loading) return <div className="loading">Loading...</div>;
  if (success) return <div className="success">{message}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      {iconName && (
        <span className={`icon icon--${iconName} ${iconColor ? `icon--${iconColor}` : ''}`} aria-hidden />
      )}
      <div className="message" aria-label={`${message || ''} ${iconName ? ` with ${iconName}` : ''}`}>{message}</div>
      {helperText && <div className="helper-text">{helperText}</div>}
    </>
  );
};

export { ReviewCraftAIComponentBase };

This updated code now includes ARIA labels for accessibility, default values for optional props, and checks if the props passed to the child components are valid.