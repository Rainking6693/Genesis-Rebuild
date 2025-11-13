import React, { forwardRef, Ref } from 'react';
import { EcoSpendAI } from '../../../constants';

interface Props {
  title: string;
  description: string;
  id?: string; // Added id for accessibility and potential future use
}

const DocsComponent = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  const { title, description, id } = props;

  return (
    <div
      id={id}
      ref={ref}
      role="article"
      aria-labelledby={`${id}-title`}
      tabIndex={0}
      data-testid="docs-component"
    >
      <h1 id={`${id}-title`}>{title}</h1>
      <p>{description}</p>
      <h2>About EcoSpend AI</h2>
      <p>EcoSpend AI is a SaaS solution that combines personal finance automation with climate action insights.</p>
      <p>Our AI-powered expense tracking automatically categorizes business purchases by their carbon footprint and suggests eco-friendly alternatives to reduce costs and environmental impact.</p>
      <p>By using EcoSpend AI, small businesses can save money while meeting their sustainability goals.</p>
      <a href={`https://www.ecospendai.com`} target="_blank" rel="noopener noreferrer">
        Learn more about EcoSpend AI
      </a>
    </div>
  );
});

DocsComponent.defaultProps = {
  id: 'docs-component', // Set default id for accessibility
};

export default DocsComponent;

This updated code addresses resiliency, edge cases, accessibility, and maintainability concerns for the DocsComponent.