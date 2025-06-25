import React, { FunctionComponent } from 'react';

import $ from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ message }) => {
    return (
          <p role="alert" className={$.error}>{message}</p>
      );
  };
  
  export default ErrorMessage;