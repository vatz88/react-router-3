var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import invariant from 'invariant';
import PropTypes from 'prop-types';

// Works around issues with context updates failing to propagate.
// Caveat: the context value is expected to never change its identity.
// https://github.com/facebook/react/issues/2517
// https://github.com/reactjs/react-router/issues/470

var contextProviderShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  eventIndex: PropTypes.number.isRequired
});

function makeContextName(name) {
  return '@@contextSubscriber/' + name;
}

export function CreateContextProvider(ComposedComponent, name, options) {
  var _class, _temp, _class$childContextTy;

  var contextName = makeContextName(name);
  var listenersKey = contextName + '/listeners';
  var eventIndexKey = contextName + '/eventIndex';
  var subscribeKey = contextName + '/subscribe';
  var withRef = options && options.withRef;

  return _temp = _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.getWrappedInstance = function () {
        !withRef ? process.env.NODE_ENV !== 'production' ? invariant(false, 'To access the wrapped instance, you need to specify ' + '`{ withRef: true }` as the second argument of the withRouter() call.') : invariant(false) : void 0;
      };

      _this[subscribeKey] = function (listener) {
        // No need to immediately call listener here.
        _this[listenersKey].push(listener);

        return function () {
          _this[listenersKey] = _this[listenersKey].filter(function (item) {
            return item !== listener;
          });
        };
      };

      _this[listenersKey] = [];
      _this[eventIndexKey] = 0;
      return _this;
    }

    _class.prototype.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[contextName] = {
        eventIndex: this[eventIndexKey],
        subscribe: this[subscribeKey]
      }, _ref;
    };

    _class.prototype.componentDidUpdate = function componentDidUpdate() {
      var _this2 = this;

      this[eventIndexKey]++;

      this[listenersKey].forEach(function (listener) {
        return listener(_this2[eventIndexKey]);
      });
    };

    _class.prototype.render = function render() {
      var _this3 = this;

      var props = _extends({}, this.props);

      if (withRef) {
        props.withRef = function (c) {
          _this3.wrappedInstance = c;
        };
      }

      return React.createElement(ComposedComponent, props);
    };

    return _class;
  }(React.Component), _class.childContextTypes = (_class$childContextTy = {}, _class$childContextTy[contextName] = contextProviderShape.isRequired, _class$childContextTy), _temp;
}

export function CreateContextSubscriber(ComposedComponent, name, options) {
  var _class2, _temp2, _class2$contextTypes;

  var contextName = makeContextName(name);
  var lastRenderedEventIndexKey = contextName + '/lastRenderedEventIndex';
  var handleContextUpdateKey = contextName + '/handleContextUpdate';
  var unsubscribeKey = contextName + '/unsubscribe';
  var withRef = options && options.withRef;

  return _temp2 = _class2 = function (_React$Component2) {
    _inherits(_class2, _React$Component2);

    function _class2(props, context) {
      _classCallCheck(this, _class2);

      var _this4 = _possibleConstructorReturn(this, _React$Component2.call(this, props, context));

      _this4.getWrappedInstance = function () {
        !withRef ? process.env.NODE_ENV !== 'production' ? invariant(false, 'To access the wrapped instance, you need to specify ' + '`{ withRef: true }` as the second argument of the withRouter() call.') : invariant(false) : void 0;

        return _this4.wrappedInstance;
      };

      _this4[handleContextUpdateKey] = function (eventIndex) {
        if (eventIndex !== _this4.state[lastRenderedEventIndexKey]) {
          var _this4$setState;

          _this4.setState((_this4$setState = {}, _this4$setState[lastRenderedEventIndexKey] = eventIndex, _this4$setState));
        }
      };

      if (!context[contextName]) {
        _this4.state = {};
      } else {
        var _this4$state;

        _this4.state = (_this4$state = {}, _this4$state[lastRenderedEventIndexKey] = context[contextName].eventIndex, _this4$state);
      }
      return _this4;
    }

    _class2.prototype.componentDidMount = function componentDidMount() {
      if (!this.context[contextName]) {
        return;
      }

      this[unsubscribeKey] = this.context[contextName].subscribe(this[handleContextUpdateKey]);
    };

    // this method will be updated to UNSAFE_componentWillReceiveProps below for React versions >= 16.3


    _class2.prototype.componentDidUpdate = function componentDidUpdate() {
      if (!this.context[contextName]) {
        return;
      }

      if (this.context[contextName].eventIndex !== this.state[lastRenderedEventIndexKey]) {
        var _setState;

        this.setState((_setState = {}, _setState[lastRenderedEventIndexKey] = this.context[contextName].eventIndex, _setState));
      }
    };

    _class2.prototype.componentWillUnmount = function componentWillUnmount() {
      if (!this[unsubscribeKey]) {
        return;
      }

      this[unsubscribeKey]();
      this[unsubscribeKey] = null;
    };

    _class2.prototype.render = function render() {
      var _this5 = this;

      var props = _extends({}, this.props);
      if (withRef) {
        props.withRef = function (c) {
          _this5.wrappedInstance = c;
        };
      }

      return React.createElement(ComposedComponent, props);
    };

    return _class2;
  }(React.Component), _class2.displayName = 'ContextSubscriberEnhancer(' + ComposedComponent.displayName + ', ' + contextName + ')', _class2.contextTypes = (_class2$contextTypes = {}, _class2$contextTypes[contextName] = contextProviderShape, _class2$contextTypes), _temp2;
}

// We are exporting this just to backward compatibility
export { ContextProvider, ContextSubscriber } from './ContextUtilsMixins';