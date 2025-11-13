import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import { expect } from 'jest';

interface Props {
  message?: string;
  className?: string;
  dataTestid?: string;
}

MyComponent.displayName = 'MyComponent';

export const MyComponent: React.FC<Props> = ({ message = 'Default message', className, dataTestid }) => {
  const ComponentElement = (
    <div className={className} role="presentation" data-testid={dataTestid}>
      {message}
    </div>
  );

  MyComponent.propTypes = {
    message: PropTypes.string,
    className: PropTypes.string,
    dataTestid: PropTypes.string,
  };

  MyComponent.defaultProps = {
    message: 'Default message',
  };

  describe('MyComponent', () => {
    it('renders the default message with a custom className', () => {
      const wrapper = shallow(<MyComponent className="custom-class" dataTestid="test-id" />);
      expect(wrapper.find('.custom-class').text()).toEqual('Default message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('renders the provided message without a className', () => {
      const wrapper = shallow(<MyComponent message="Test message" dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Test message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles missing message prop', () => {
      const wrapper = shallow(<MyComponent className="custom-class" dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Default message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles missing className prop', () => {
      const wrapper = shallow(<MyComponent message="Test message" dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Test message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles providing both message and className props', () => {
      const wrapper = shallow(<MyComponent message="Test message" className="custom-class" dataTestid="test-id" />);
      expect(wrapper.find('.custom-class').text()).toEqual('Test message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles invalid className prop', () => {
      const wrapper = shallow(<MyComponent className={123} dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Default message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles empty string className prop', () => {
      const wrapper = shallow(<MyComponent className="" dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Default message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles null className prop', () => {
      const wrapper = shallow(<MyComponent className={null} dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Default message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles non-string className prop', () => {
      const wrapper = shallow(<MyComponent className={123} dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Default message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles empty string message prop', () => {
      const wrapper = shallow(<MyComponent message="" dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Default message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles null message prop', () => {
      const wrapper = shallow(<MyComponent message={null} dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Default message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });

    it('handles non-string message prop', () => {
      const wrapper = shallow(<MyComponent message={123} dataTestid="test-id" />);
      expect(wrapper.find('div').text()).toEqual('Default message');
      expect(wrapper.find(`[data-testid="test-id"]`)).toHaveLength(1);
    });
  });

  return ComponentElement;
};

This updated version includes more comprehensive tests for edge cases, accessibility, and maintainability. The `data-testid` attribute has been added for easier testing and accessibility, and tests have been added to cover various edge cases such as invalid prop values, empty strings, null values, and non-string values.