interface Props {
  message?: string;
  children?: ReactNode;
}

const defaultProps: Partial<Props> = {
  message: '',
};

const isValidElement = (child: any): child is React.ReactElement => {
  return typeof child === 'object' && child !== null && child.$$typeof === React.ElementType;
};

const sanitizedContent = React.Children.map(content, (child) => {
  if (child && typeof child === 'string') {
    return React.cloneElement(child, { dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(child) } });
  }
  if (isValidElement(child)) {
    return child;
  }
  return null;
});

const content = React.Children.only(React.Children.toArray([message, children]));

const sanitizedContent = React.Children.map(content, (child) => {
  if (child) {
    return React.cloneElement(child, { dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(child.props.children) } });
  }
  return null;
});

if (sanitizedContent.length === 0) {
  return null;
}

return <React.Fragment>{sanitizedContent}</React.Fragment>;

interface Props {
  message?: string;
  children?: ReactNode;
}

const defaultProps: Partial<Props> = {
  message: '',
};

const isValidElement = (child: any): child is React.ReactElement => {
  return typeof child === 'object' && child !== null && child.$$typeof === React.ElementType;
};

const sanitizedContent = React.Children.map(content, (child) => {
  if (child && typeof child === 'string') {
    return React.cloneElement(child, { dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(child) } });
  }
  if (isValidElement(child)) {
    return child;
  }
  return null;
});

const content = React.Children.only(React.Children.toArray([message, children]));

const sanitizedContent = React.Children.map(content, (child) => {
  if (child) {
    return React.cloneElement(child, { dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(child.props.children) } });
  }
  return null;
});

if (sanitizedContent.length === 0) {
  return null;
}

return <React.Fragment>{sanitizedContent}</React.Fragment>;

2. Use `React.isValidElement` to ensure that `children` is a valid React element:

3. Use `React.cloneElement` to handle cases where `children` is a single React element:

4. Use `React.Children.only` to ensure that `content` contains only one child:

5. Use `React.Fragment` to wrap multiple children: