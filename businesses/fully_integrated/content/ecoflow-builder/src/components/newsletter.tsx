import React, { FC } from 'react';

interface Props {
  businessName: string; // Use a more descriptive variable name for the business name
}

const Newsletter: FC<Props> = ({ businessName }) => {
  return (
    <div>
      <h1>Dear Subscriber,</h1>
      <h2>Welcome to the EcoFlow Builder Newsletter!</h2>
      <h3>This week at {businessName}:</h3>
      <p>[Insert personalized content about the business's sustainability efforts]</p>
      <h3>Did You Know?</h3>
      <p>[Insert educational content about sustainability]</p>
      <h3>Compliance Report</h3>
      <p>[Insert carbon tracking data and report]</p>
      <h3>Stay Green, Stay Ahead!</h3>
      <p>[Insert call-to-action or encouragement for subscribers to support sustainability]</p>
    </div>
  );
};

export default Newsletter;

import React, { FC } from 'react';

interface Props {
  businessName: string; // Use a more descriptive variable name for the business name
}

const Newsletter: FC<Props> = ({ businessName }) => {
  return (
    <div>
      <h1>Dear Subscriber,</h1>
      <h2>Welcome to the EcoFlow Builder Newsletter!</h2>
      <h3>This week at {businessName}:</h3>
      <p>[Insert personalized content about the business's sustainability efforts]</p>
      <h3>Did You Know?</h3>
      <p>[Insert educational content about sustainability]</p>
      <h3>Compliance Report</h3>
      <p>[Insert carbon tracking data and report]</p>
      <h3>Stay Green, Stay Ahead!</h3>
      <p>[Insert call-to-action or encouragement for subscribers to support sustainability]</p>
    </div>
  );
};

export default Newsletter;