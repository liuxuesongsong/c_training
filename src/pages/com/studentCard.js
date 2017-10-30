// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardActions, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import {
  CARD_TYPE_COMMON,
  CARD_TYPE_INFO,
  CARD_TYPE_ENROLL,
  CARD_TYPE_ARRANGE,
  CARD_TYPE_EXAM,
  CARD_TYPE_UNARRANGE,
  STATUS_AGREED_AGREE,
} from '../../enum';
import { getCity } from '../../utils/helpers';
import Lang from '../../language';

class ComCard extends Component {
  static propTypes = {
    action: PropTypes.array.isRequired,
    city: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    mobile: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    action: [],
    status: '',
  };

  state = {
    type: '',
    status: 0
  };

  buttonActions() {
    switch (this.state.type) {
      case CARD_TYPE_COMMON:
        return this.getStatusDescribe();
      case CARD_TYPE_INFO:
        return (
          <CardActions>
            <Button dense onClick={this.props.action[0]}>
              {Lang[window.Lang].pages.com.card.modify}
            </Button>
            <Button className="glyphicon glyphicon-trash" dense onClick={this.props.action[1]} />
          </CardActions>
        );
      case CARD_TYPE_ENROLL:
        return (
          <CardActions style={{ height: '1.5rem' }}>
            <br />
            <button className="nyx-card-enrroll-button" onClick={this.props.action[1]}>
              {Lang[window.Lang].pages.com.card.enroll}
            </button>
            <br />
            <i onClick={this.props.action[0]} className="glyphicon glyphicon-pencil" />
            <br />
            <i onClick={this.props.action[2]} className="glyphicon glyphicon-trash" />
          </CardActions>
        );
      case CARD_TYPE_ARRANGE:
        return (
          <CardActions>
            {this.state.status === '' ? (
              <div>
                <button className="nyx-card-button" onClick={this.props.action[0]}>
                  {Lang[window.Lang].pages.com.card.agree}
                </button>
                <br />
                <button className="nyx-card-button" onClick={this.props.action[1]}>
                  {Lang[window.Lang].pages.com.card.refuse}
                </button>
              </div>
            ) : (
                Lang[window.Lang].pages.com.card.status[1]
              )}
          </CardActions>
        );
      case CARD_TYPE_EXAM:
        return (
          <CardActions>
              <div>
            <button className="nyx-card-button"   onClick={this.props.action[0]}>
              {Lang[window.Lang].pages.com.card.retry}
            </button>
            <button  className="nyx-card-button"   onClick={this.props.action[1]}>
              {Lang[window.Lang].pages.com.card.giveup}
            </button>
              </div>
          </CardActions>
        );
      case CARD_TYPE_UNARRANGE:
        return (
          <button className="nyx-card-unarrange-button" onClick={this.props.action[0]}>
            取消
          </button>
        );
      default:
        return this.getStatusDescribe();
    }
  }

  getStatusDescribe() {
    if (this.state.type === STATUS_ENROLLED) {
      if (this.state.status === STATUS_ENROLLED_REDO) {
        return <Typography type="body1">{'重新排队中'}</Typography>;
      }
    }
    if (this.state.type === STATUS_AGREED) {
      if (this.state.status === STATUS_AGREED_AGREE) {
        return <Typography type="body1">{'已通过'}</Typography>;
      }
    }
  }

  render() {
    const { type, name, mobile, email, level, city, action, status } = this.props;

    this.state.type = type;
    this.state.status = status;
    this.state.action = action;

    return (
      <div>
        <div className="nyx-card-list" style={{ display: 'flex' }}>
          <CardMedia
            style={{
              width: 0,
              height: 0,
            }}
            // image="/images/live-from-space.jpg"
            title="Live from space album cover"
          />
          <div className="nyx-card">
            <div className="nyx-card-body">
              <div className="nyx-card-round-ing" />
              <div className="nyx-card-first-info">
                <div className={'nyx-card-name'}>{name}</div>
                <div className={'nyx-card-name'}>{`${level === 1 ? '中' : '高'}级`}</div>
                <div className={'nyx-card-name'}>{getCity(city)}</div>
              </div>
              <div className="nyx-card-second-info">
                <span className={'nyx-card-key'}>{'电话:'}</span>
                <div className={'nyx-card-value'}>{mobile}</div>
                <div className={'nyx-card-key'}>{'邮件:'}</div>
                <div className={'nyx-card-value'}>{email}</div>
              </div>
            </div>
            <div className="nyx-card-action">{this.buttonActions()}</div>
          </div>
        </div>
        {/* <Card className="nyx-card-list" style={{ display: 'flex', }}>
          <CardMedia
            style={{
              width: 0,
              height: 0
            }}
            //image="/images/live-from-space.jpg"
            title="Live from space album cover"
          />
          <div className="nyx-card">
            <CardContent className={"nyx-card-body"}>
              <Typography className={"nyx-card-name"}>
                {name}
              </Typography>
              <Typography className={"nyx-card-key"}>
                {"电话"}
              </Typography>
              <Typography className={"nyx-card-value"}>
                {mobile}
              </Typography>
              <Typography className={"nyx-card-key"}>
                {"邮件"}
              </Typography>
              <Typography className={"nyx-card-value"}>
                {email}
              </Typography>
              <Typography className={"nyx-card-key"}>
                {""}<br />
              </Typography>
              <Typography className={"nyx-card-value nyx-card-value-sm"}>
                {(level === 1 ? "中" : "高") + "级"}
              </Typography>
              <Typography className={"nyx-card-key nyx-card-value-sm"}>
                {"城市"}
              </Typography>
              <Typography className={"nyx-card-value"}>
                {getCity(city)}
              </Typography>
            </CardContent>
            <div className="nyx-card-action">
              {this.buttonActions()}
            </div>
          </div>
        </Card> */}
      </div>
    );
  }
}

export default ComCard;
