'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _createTransitionManager2 = require('./createTransitionManager');

var _createTransitionManager3 = _interopRequireDefault(_createTransitionManager2);

var _InternalPropTypes = require('./InternalPropTypes');

var _RouterContext = require('./RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _RouteUtils = require('./RouteUtils');

var _RouterUtils = require('./RouterUtils');

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  history: _propTypes.object,
  children: _InternalPropTypes.routes,
  routes: _InternalPropTypes.routes, // alias for children
  render: _propTypes.func,
  createElement: _propTypes.func,
  onError: _propTypes.func,
  onUpdate: _propTypes.func,

  // PRIVATE: For client-side rehydration of server match.
  matchContext: _propTypes.object

  /**
   * A <Router> is a high-level API for automatically setting up
   * a router that renders a <RouterContext> with all the props
   * it needs each time the URL changes.
   */
};
var Router = function (_Component) {
  _inherits(Router, _Component);

  function Router(props) {
    _classCallCheck(this, Router);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      location: null,
      routes: null,
      params: null,
      components: null
    };

    _this.handleError = _this.handleError.bind(_this);
    _this.createRouterObject = _this.createRouterObject.bind(_this);
    _this.createTransitionManager = _this.createTransitionManager.bind(_this);

    _this.transitionManager = _this.createTransitionManager();
    _this.router = _this.createRouterObject(_this.state);
    return _this;
  }

  Router.prototype.handleError = function handleError(error) {
    if (this.props.onError) {
      this.props.onError.call(this, error);
    } else {
      // Throw errors by default so we don't silently swallow them!
      throw error; // This error probably occurred in getChildRoutes or getComponents.
    }
  };

  Router.prototype.createRouterObject = function createRouterObject(state) {
    var matchContext = this.props.matchContext;

    if (matchContext) {
      return matchContext.router;
    }

    var history = this.props.history;

    return (0, _RouterUtils.createRouterObject)(history, this.transitionManager, state);
  };

  Router.prototype.createTransitionManager = function createTransitionManager() {
    var matchContext = this.props.matchContext;

    if (matchContext) {
      return matchContext.transitionManager;
    }

    var history = this.props.history;
    var _props = this.props,
        routes = _props.routes,
        children = _props.children;


    !history.getCurrentLocation ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'You have provided a history object created with history v4.x or v2.x ' + 'and earlier. This version of React Router is only compatible with v3 ' + 'history objects. Please change to history v3.x.') : (0, _invariant2.default)(false) : void 0;

    return (0, _createTransitionManager3.default)(history, (0, _RouteUtils.createRoutes)(routes || children));
  };

  // this method will be updated to UNSAFE_componentWillMount below for React versions >= 16.3


  Router.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    if (!this._unlisten) {
      this._unlisten = this.transitionManager.listen(function (error, state) {
        if (error) {
          _this2.handleError(error);
        } else {
          // Keep the identity of this.router because of a caveat in ContextUtils:
          // they only work if the object identity is preserved.
          (0, _RouterUtils.assignRouterState)(_this2.router, state);
          _this2.setState(state, _this2.props.onUpdate);
        }
      });
    }
  };

  // this method will be updated to UNSAFE_componentWillReceiveProps below for React versions >= 16.3
  /* istanbul ignore next: sanity check */


  Router.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(prevProps.history === this.props.history, 'You cannot change <Router history>; it will be ignored') : void 0;

    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)((prevProps.routes || prevProps.children) === (this.props.routes || this.props.children), 'You cannot change <Router routes>; it will be ignored') : void 0;
  };

  Router.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this._unlisten) {
      this._unlisten();
      this._unlisten = null;
    }
  };

  Router.prototype.render = function render() {
    var _state = this.state,
        location = _state.location,
        routes = _state.routes,
        params = _state.params,
        components = _state.components;

    var _props2 = this.props,
        createElement = _props2.createElement,
        render = _props2.render,
        props = _objectWithoutProperties(_props2, ['createElement', 'render']);

    if (location == null) return null; // Async match

    // Only forward non-Router-specific props to routing context, as those are
    // the only ones that might be custom routing context props.
    Object.keys(propTypes).forEach(function (propType) {
      return delete props[propType];
    });

    return render(_extends({}, props, {
      router: this.router,
      location: location,
      routes: routes,
      params: params,
      components: components,
      createElement: createElement
    }));
  };

  return Router;
}(_react.Component);

Router.displayName = 'Router';
Router.propTypes = propTypes;
Router.defaultProps = {
  render: function render(props) {
    return _react2.default.createElement(_RouterContext2.default, props);
  }
};
exports.default = Router;
module.exports = exports['default'];