import React, { FC, ReactNode, useContext, DefaultProps } from 'react';
import { AnalyticsContext, IAnalyticsContext } from './AnalyticsContext';

interface Props extends DefaultProps {
  referralMessage: string;
  source?: string;
  id?: string;
}

const ReferralMessageComponent: FC<Props> = ({ referralMessage, source, id, ...rest }) => {
  const { track } = useContext<IAnalyticsContext>(AnalyticsContext);

  const handleReferralClick = () => {
    if (track) {
      track('Referral Clicked', {
        referral_source: source,
        referral_id: id
      });
    }
  };

  return (
    <div onClick={handleReferralClick} {...rest}>
      {referralMessage}
    </div>
  );
};

ReferralMessageComponent.defaultProps = {
  referralMessage: 'Refer a friend and earn rewards!',
  source: undefined,
  id: undefined
};

const useUpdateComponent = <T extends React.FC<any>>(OriginalComponent: T) => {
  const UpdatedComponent = (props: Props) => {
    return <OriginalComponent {...props} />;
  };

  return UpdatedComponent;
};

const EnhancedReferralMessageComponent = useUpdateComponent(ReferralMessageComponent);

export default EnhancedReferralMessageComponent;

In this updated code, I've added a type annotation for the `AnalyticsContext` to ensure that it's used correctly. I've also added a check to ensure that the `track` function exists before calling it, to handle cases where the `AnalyticsContext` might not be initialized. Additionally, I've used the `DefaultProps` type from React to make the default props more explicit. Lastly, I've kept the functional update pattern for better maintainability.