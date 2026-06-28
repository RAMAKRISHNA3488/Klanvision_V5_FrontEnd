import React from 'react';
global.React = React;
import { renderToString } from 'react-dom/server';
import APIIntegrationPage from './src/components/APIIntegrationPage.jsx';

try {
  const html = renderToString(React.createElement(APIIntegrationPage));
  console.log('RENDER SUCCESS, length:', html.length);
} catch (e) {
  console.error('RENDER ERROR:', e);
}
