import PropTypes from "prop-types";
import React, { Component } from "react";
import { Grid, Image, Menu, Sidebar } from "semantic-ui-react";

export default (props) => {
  return (
    <Sidebar
      as={Menu}
      animation={"overlay"}
      inverted
      vertical
      direction={"left"}
      visible={true}
    >
      <Menu.Item as="h2">FiftyOne</Menu.Item>
      <Menu.Item as="h3">
        {props.update.state
          ? `Dataset: ${props.update.state.dataset_name}`
          : "No dataset loaded"}
      </Menu.Item>
      <Menu.Item as="h4">
        Page Info:
        <Menu inverted vertical>
          {props.update.state && props.update.state.page
            ? Object.keys(props.update.state.page).map((k) => {
                const v = props.update.state.page[k];
                return (
                  <Menu.Item>
                    {k}: {v}
                  </Menu.Item>
                );
              })
            : null}
        </Menu>
      </Menu.Item>
      <Menu.Item as="h4">
        View Info:
        <Menu inverted vertical>
          <Menu.Item>
            {props.update.state && props.update.state.view_tag
              ? props.update.state.view_tag
              : "No view"}
          </Menu.Item>
        </Menu>
      </Menu.Item>
      <Menu.Item as="h4">
        Query Info:
        <Menu inverted vertical>
          {props.update.state && props.update.state.query ? (
            Object.keys(props.update.state.query).map((k) => {
              return (
                <Menu.Item as="span">
                  {String(Object.keys(props.update.state.query[k])[0])}
                </Menu.Item>
              );
            })
          ) : (
            <Menu.Item as="span">Empty query</Menu.Item>
          )}
        </Menu>
      </Menu.Item>
    </Sidebar>
  );
};
