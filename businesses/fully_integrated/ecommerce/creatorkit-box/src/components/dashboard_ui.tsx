import React, { FormEvent, useState } from 'react';

interface CreatorHighlight {
  name: string;
  image?: string; // Adding optional image field
  description: string;
}

interface FeaturedProduct {
  name: string;
  image?: string; // Adding optional image field
  description: string;
  price: number;
}

interface UpcomingLaunch {
  name: string;
  image?: string; // Adding optional image field
  description: string;
  launchDate: string;
}

interface UserPreference {
  // Update this type based on actual user preference data structure
}

type PreferenceChangeEvent = React.FormEvent<HTMLTextAreaElement>;

interface Props {
  title: string;
  subtitle: string;
  creatorHighlights: Array<CreatorHighlight>;
  featuredProducts: Array<FeaturedProduct>;
  upcomingLaunches: Array<UpcomingLaunch>;
  userPreferences: UserPreference;
  onUserPreferenceUpdate: (preferences: UserPreference) => void;
}

const CreatorKitBoxDashboard: React.FC<Props> = ({
  title,
  subtitle,
  creatorHighlights,
  featuredProducts,
  upcomingLaunches,
  userPreferences,
  onUserPreferenceUpdate
}) => {
  const [preferences, setPreferences] = useState(JSON.stringify(userPreferences));

  const handlePreferenceUpdate = (event: PreferenceChangeEvent) => {
    const updatedPreferences = JSON.parse(event.currentTarget.value);
    onUserPreferenceUpdate(updatedPreferences);
    setPreferences(JSON.stringify(updatedPreferences));
  };

  // Check if image URL is valid before rendering
  const isValidImageUrl = (url: string) => {
    const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
    return regex.test(url);
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>

      {/* Render creator highlights */}
      <div>
        {creatorHighlights.map((creator, index) => (
          <div key={index}>
            {creator.image && isValidImageUrl(creator.image) && (
              <img src={creator.image} alt={creator.name} />
            )}
            <h2>{creator.name}</h2>
            <p>{creator.description}</p>
          </div>
        ))}
      </div>

      {/* Render featured products */}
      <div>
        {featuredProducts.map((product, index) => (
          <div key={index}>
            {product.image && isValidImageUrl(product.image) && (
              <img src={product.image} alt={product.name} />
            )}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>

      {/* Render upcoming launches */}
      <div>
        {upcomingLaunches.map((launch, index) => (
          <div key={index}>
            {launch.image && isValidImageUrl(launch.image) && (
              <img src={launch.image} alt={launch.name} />
            )}
            <h3>{launch.name}</h3>
            <p>{launch.description}</p>
            <p>Launch Date: {launch.launchDate}</p>
          </div>
        ))}
      </div>

      {/* Render user preference form */}
      <form onSubmit={handlePreferenceUpdate}>
        <label htmlFor="preferences">Update Your Preferences:</label>
        <textarea id="preferences" name="preferences" value={preferences} />
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default CreatorKitBoxDashboard;

In this version, I've added an optional `image` field to the `CreatorHighlight`, `FeaturedProduct`, and `UpcomingLaunch` interfaces. I've also added a function `isValidImageUrl` to check if the image URL is valid before rendering. This helps prevent potential errors caused by invalid image URLs. Additionally, I've added a check to ensure that the image URL is valid before rendering the image. This ensures that the component remains functional even if an invalid image URL is provided.