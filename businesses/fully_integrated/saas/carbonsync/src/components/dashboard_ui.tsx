interface DashboardUIComponentProps {
  value: number;
  onValueChange?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  label?: string;
  id?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  isDisabled?: boolean;
}

type DashboardUIComponent = React.FC<DashboardUIComponentProps>;

import React, { useState, useRef, useCallback } from 'react';
import { useId } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';
import { Box, FormControl, FormLabel, Input, Flex } from '@chakra-ui/react';

const DashboardUIComponent: DashboardUIComponent = ({
  value,
  onValueChange,
  minValue = 0,
  maxValue = 100,
  step = 1,
  label,
  id,
  ariaLabel,
  ariaDescribedBy,
  isDisabled = false,
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { focusProps } = useFocusRing({ ref: inputRef });

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value);
      if (!isNaN(newValue) && newValue >= minValue && newValue <= maxValue) {
        onValueChange?.(newValue);
      }
    },
    [isNaN, minValue, maxValue, onValueChange]
  );

  return (
    <Box>
      {label && <FormControl id={id}> <FormLabel htmlFor={inputId}>{label}</FormLabel> </FormControl>}
      <Flex alignItems="center">
        <Input
          id={inputId}
          ref={inputRef}
          type="number"
          value={value}
          step={step}
          min={minValue}
          max={maxValue}
          disabled={isDisabled}
          onChange={handleChange}
          {...focusProps}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        />
      </Flex>
    </Box>
  );
};

export default DashboardUIComponent;

interface DashboardUIComponentProps {
  value: number;
  onValueChange?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  label?: string;
  id?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  isDisabled?: boolean;
}

type DashboardUIComponent = React.FC<DashboardUIComponentProps>;

import React, { useState, useRef, useCallback } from 'react';
import { useId } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';
import { Box, FormControl, FormLabel, Input, Flex } from '@chakra-ui/react';

const DashboardUIComponent: DashboardUIComponent = ({
  value,
  onValueChange,
  minValue = 0,
  maxValue = 100,
  step = 1,
  label,
  id,
  ariaLabel,
  ariaDescribedBy,
  isDisabled = false,
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { focusProps } = useFocusRing({ ref: inputRef });

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value);
      if (!isNaN(newValue) && newValue >= minValue && newValue <= maxValue) {
        onValueChange?.(newValue);
      }
    },
    [isNaN, minValue, maxValue, onValueChange]
  );

  return (
    <Box>
      {label && <FormControl id={id}> <FormLabel htmlFor={inputId}>{label}</FormLabel> </FormControl>}
      <Flex alignItems="center">
        <Input
          id={inputId}
          ref={inputRef}
          type="number"
          value={value}
          step={step}
          min={minValue}
          max={maxValue}
          disabled={isDisabled}
          onChange={handleChange}
          {...focusProps}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        />
      </Flex>
    </Box>
  );
};

export default DashboardUIComponent;

Next, let's create the component itself: