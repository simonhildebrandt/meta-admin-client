import React, { useState } from 'react';
import { Layout, useLogin, useNotify } from 'react-admin';
import { TextField, Button, Stack } from '@mui/material';
export default function LoginPage() {
  const [tokenValue, setTokenValue] = useState("averysecureauthkey");
  function handleChange(event) {
    setTokenValue(event.target.value);
  }
  const login = useLogin();
  const notify = useNotify();
  function handleSubmit(event) {
    event.preventDefault();
    const token = event.target.token.value;
    login(token).catch(error => {
      notify(error);
    });
  }
  return /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "400px"
    }
  }, /*#__PURE__*/React.createElement("h1", null, "Admin login"), /*#__PURE__*/React.createElement(Stack, {
    direction: "column",
    spacing: 2
  }, /*#__PURE__*/React.createElement(TextField, {
    name: "token",
    type: "text",
    placeholder: "token",
    value: tokenValue,
    label: "Authentication Token",
    variant: "filled",
    onChange: handleChange
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "contained"
  }, "Login")))));
}