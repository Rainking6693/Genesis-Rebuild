import React, { FC, ReactNode, Key } from 'react';

interface Props {
  title: string;
  subtitle: string;
  carbonFootprint: number;
  teamStanding: number;
  offsetOptions: Array<{ label: string, value: string }>;
  onOffsetSelect: (offset: string) => void;
}

const DashboardUI_CLASSNAME = 'dashboard-ui';
const TITLE_CLASSNAME = `${DashboardUI_CLASSNAME}__title`;
const SUBTITLE_CLASSNAME = `${DashboardUI_CLASSNAME}__subtitle`;
const CARBON_FOOTPRINT_CLASSNAME = `${DashboardUI_CLASSNAME}__carbon-footprint`;
const TEAM_STANDING_CLASSNAME = `${DashboardUI_CLASSNAME}__team-standing`;
const OFFSET_SELECT_CLASSNAME = `${DashboardUI_CLASSNAME}__offset-select`;

const DashboardUI: FC<Props> = ({ title, subtitle, carbonFootprint, teamStanding, offsetOptions, onOffsetSelect }) => {
  if (!offsetOptions.length) {
    return (
      <div className={DashboardUI_CLASSNAME}>
        <h1 className={TITLE_CLASSNAME}>{title}</h1>
        <p className={SUBTITLE_CLASSNAME}>{subtitle}</p>
        <div className={CARBON_FOOTPRINT_CLASSNAME}>Your Carbon Footprint: {carbonFootprint} kg CO2e</div>
        <div className={TEAM_STANDING_CLASSNAME}>Team Standing: {teamStanding}</div>
        <select className={OFFSET_SELECT_CLASSNAME} disabled>
          <option value="">No offset options available</option>
        </select>
      </div>
    );
  }

  return (
    <div className={DashboardUI_CLASSNAME}>
      <h1 className={TITLE_CLASSNAME}>{title}</h1>
      <p className={SUBTITLE_CLASSNAME}>{subtitle}</p>
      <div className={CARBON_FOOTPRINT_CLASSNAME}>Your Carbon Footprint: {carbonFootprint} kg CO2e</div>
      <div className={TEAM_STANDING_CLASSNAME}>Team Standing: {teamStanding}</div>
      <select className={OFFSET_SELECT_CLASSNAME} onChange={(e) => onOffsetSelect(e.target.value)}>
        {offsetOptions.map((option, index) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default DashboardUI;

In this updated code, I've:

1. Created class names for better maintainability and styling.
2. Handled the edge case where the `offsetOptions` array is empty by displaying a message and disabling the select element.
3. Added accessibility by providing unique `key` attributes to the `option` elements.
4. Improved maintainability by using a consistent naming convention for the class names.