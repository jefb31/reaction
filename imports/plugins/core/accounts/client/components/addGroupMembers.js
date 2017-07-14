import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Card, CardHeader, CardBody, List, ListItem } from "/imports/plugins/core/ui/client/components";
import { getGravatar } from "../helpers/accountsHelper";

class AddGroupMembers extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    group: PropTypes.object,
    groups: PropTypes.array
  }

  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      accounts: props.accounts
    };
  }

  handleMouseOver(acc) {
    return () => {
      this.setState({ selected: acc });
    };
  }

  isInGroup(acc) {
    const currentUserGroup = this.props.groups.find(grp => acc.groups[0] === grp._id);
    return currentUserGroup._id === this.props.group._id;
  }

  getCursorClass(acc) {
    return this.isInGroup(acc) ? "c-default" : "";
  }

  handleOnGroupChange(acc) {
    return () => {
      if (this.isInGroup(acc)) { return false; } // already in group; nothing to change
      Meteor.call("group/addUser", acc._id, this.props.group._id, (err) => {
        if (err) {
          return Alerts.toast("Error updating user" + err, "error"); // TODO: Swith to React + i18n
        }
        Alerts.toast("User changed successfully", "success"); // TODO: Swith to React + i18n
      });
    };
  }

  renderBadge(acc) {
    const currentUserGroup = this.props.groups.find(grp => acc.groups[0] === grp._id);
    const isNotInGroup = currentUserGroup._id !== this.props.group._id;
    const isSelected = acc === this.state.selected;
    if (isSelected && isNotInGroup) {
      return (<span>Make {this.props.group.name}</span>);
    }
    return (<span>{currentUserGroup.name}</span>);
  }

  handleMouseOut(acc) {
    return () => {
      if (this.state.selected === acc) {
        this.setState({ selected: null });
      }
    };
  }

  render() {
    return (
      <div className="add-group-members">
        <Card expanded={true}>
          <CardHeader actAsExpander={true} data-i18n="" title={this.props.group.name} />
          <CardBody expandable={true}>
            <List>
              {this.state.accounts.map((acc, index) => ( // TODO: Review "Guest" default
                <ListItem key={index}>
                  <div
                    className={this.getCursorClass(acc)}
                    onMouseOver={this.handleMouseOver(acc)}
                    onMouseOut={this.handleMouseOut(acc)}
                    onClick={this.handleOnGroupChange(acc)}
                  >
                    <div className="name-box">
                      <img className="accounts-img-tag" src={getGravatar(acc)} />
                      <span>
                        <span className="title"><b>{acc.name || "Guest"}</b></span>
                        <span>{_.get(acc, "emails[0].address")}</span>
                      </span>
                    </div>
                    <div className="badge">
                      {this.renderBadge(acc)}
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default AddGroupMembers;
