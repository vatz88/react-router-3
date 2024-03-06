'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIs = require('react-is');

var _propTypes = require('prop-types');

var _getRouteParams = require('./getRouteParams');

var _getRouteParams2 = _interopRequireDefault(_getRouteParams);

var _ContextUtils = require('./ContextUtils');

var _RouteUtils = require('./RouteUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A <RouterComponent> renders the component tree for a given router state
 * and sets the history object and the current location in context.
 */
var RouterComponent = function (_Component) {
  _inherits(RouterComponent, _Component);

  function RouterComponent() {
    _classCallCheck(this, RouterComponent);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  RouterComponent.prototype.getChildContext = function getChildContext() {
    return {
      router: this.props.router
    };
  };

  RouterComponent.prototype.createElement = function createElement(component, props) {
    return component == null ? null : this.props.createElement(component, props);
  };

  RouterComponent.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        location = _props.location,
        routes = _props.routes,
        params = _props.params,
        components = _props.components,
        router = _props.router;

    var element = null;

    if (components) {
      element = components.reduceRight(function (element, components, index) {
        if (components == null) return element; // Don't create new children; use the grandchildren.

        var route = routes[index];
        var routeParams = (0, _getRouteParams2.default)(route, params);
        var props = {
          location: location,
          params: params,
          route: route,
          router: router,
          routeParams: routeParams,
          routes: routes
        };

        if ((0, _RouteUtils.isReactChildren)(element)) {
          props.children = element;
        } else if (element) {
          for (var prop in element) {
            if (Object.prototype.hasOwnProperty.call(element, prop)) props[prop] = element[prop];
          }
        }

        // Handle components is object for { [name]: component } but not valid element
        // type of react, such as React.memo, React.lazy and so on.
        if ((typeof components === 'undefined' ? 'undefined' : _typeof(components)) === 'object' && !(0, _reactIs.isValidElementType)(components)) {
          var elements = {};

          for (var key in components) {
            if (Object.prototype.hasOwnProperty.call(components, key)) {
              // Pass through the key as a prop to createElement to allow
              // custom createElement functions to know which named component
              // they're rendering, for e.g. matching up to fetched data.
              elements[key] = _this2.createElement(components[key], _extends({
                key: key }, props));
            }
          }

          return elements;
        }

        return _this2.createElement(components, props);
      }, element);
    }

    !(element === null || element === false || _react2.default.isValidElement(element)) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'The root route must render a single element') : (0, _invariant2.default)(false) : void 0;

    return element;
  };

  return RouterComponent;
}(_react.Component);

RouterComponent.propTypes = {
  router: _propTypes.object.isRequired,
  location: _propTypes.object.isRequired,
  routes: _propTypes.array.isRequired,
  params: _propTypes.object.isRequired,
  components: _propTypes.array.isRequired,
  createElement: _propTypes.func.isRequired
};
RouterComponent.childContextTypes = {
  router: _propTypes.object.isRequired
};
RouterComponent.defaultProps = {
  createElement: _react2.default.createElement
};


var RouterContext = (0, _ContextUtils.CreateContextProvider)(RouterComponent, 'router');
RouterContext.displayName = 'RouterContext';

exports.default = RouterContext;
module.exports = exports['default'];