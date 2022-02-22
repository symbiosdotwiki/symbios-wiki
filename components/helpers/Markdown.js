import React from 'react';
import ReactMarkdown from 'react-markdown';

const Markdown = ({ children, ...props }) => (
  <ReactMarkdown {...props}>
    {typeof children === 'string' ? children.replace(/\n/g, '  \n') : children}
  </ReactMarkdown>
)

export default Markdown