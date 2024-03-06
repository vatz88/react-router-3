var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { CreateContextSubscriber } from './ContextUtils';
import { routerShape } from './PropTypes';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withRouter(WrappedComponent, options) {
  var WithRouter = function (_Component) {
    _inherits(WithRouter, _Component);

    function WithRouter() {
      _classCallCheck(this, WithRouter);

      return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    WithRouter.prototype.render = function render() {
      var router = this.props.router || this.context.router;
      if (!router) {
        return React.createElement(WrappedComponent, this.props);
      }

      var params = router.params,
          location = router.location,
          routes = router.routes;

      var props = _extends({}, this.props, { router: router, params: params, location: location, routes: routes });

      if (props.withRef) {
        props.ref = function (c) {
          return props.withRef(c);
        };
      }

      return React.createElement(WrappedComponent, props);
    };

    return WithRouter;
  }(Component);

  WithRouter.contextTypes = {
    router: routerShape
  };
  WithRouter.propTypes = {
    router: routerShape
  };


  var withRef = options && options.withRef;
  var ContextWithRouter = CreateContextSubscriber(WithRouter, 'router', { withRef: withRef });

  ContextWithRouter.displayName = 'withRouter(' + getDisplayName(WrappedComponent) + ')';
  ContextWithRouter.WrappedComponent = WrappedComponent;

  return hoistStatics(ContextWithRouter, WrappedComponent);
}