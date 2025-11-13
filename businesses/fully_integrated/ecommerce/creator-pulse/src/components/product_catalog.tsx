import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  creatorsData: CreatorData[];
}

interface CreatorData {
  id: string;
  username: string;
  platform: string;
  followersCount: number;
  engagementRate?: number;
  growthRate?: number;
  authenticityScore?: number;
  brandAlignmentScore?: number;
}

const ProductCatalog: FC<Props> = ({ title, subtitle, creatorsData }) => {
  return (
    <div className="product-catalog" role="list">
      <h1 className="product-catalog__title" id="product-catalog-title">{title}</h1>
      {subtitle && <h2 className="product-catalog__subtitle" id="product-catalog-subtitle">{subtitle}</h2>}
      <ul className="product-catalog__list" role="listitem">
        {creatorsData.map((creator) => (
          <li key={creator.id} className="product-catalog__item" role="listitem">
            <a href={`https://${creator.platform}.com/${creator.username}`} target="_blank" rel="noopener noreferrer">
              {creator.username} ({creator.platform})
            </a>
            <span className="product-catalog__info" role="presentation">
              {creator.followersCount} followers
              {creator.engagementRate && `, Engagement Rate: ${creator.engagementRate}`}
              {creator.growthRate && `, Growth Rate: ${creator.growthRate}`}
              {creator.authenticityScore && `, Authenticity Score: ${creator.authenticityScore}`}
              {creator.brandAlignmentScore && `, Brand Alignment Score: ${creator.brandAlignmentScore}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCatalog;

In this updated version, I've added ARIA roles to the component for better accessibility. I've also added `id` attributes to the title and subtitle elements to improve their accessibility and make them easier to target with CSS. Additionally, I've added `role="presentation"` to the `span` element containing the additional information to ensure it doesn't interfere with the component's accessibility tree.