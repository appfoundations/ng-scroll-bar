;(function(angular, window) {
'use strict';

/*
* 
*/
(function () {
    angular.module('ng-scroll-bar', []);
})();
'use strict';

(function () {
  ngScrollBarDirective.$inject = ["$window", "$timeout"];
  angular.module('ng-scroll-bar').directive('ngScrollBar', ngScrollBarDirective);

  /* @ngInject */
  function ngScrollBarDirective($window, $timeout) {

    function link(scope, element, attrs, controllers) {
      var MOUSE_MOVE = 'mousemove';
      var MOUSE_UP = 'mouseup';
      var MOUSE_DOWN = 'mousedown';
      var minThumbsize = 8;
      var initial = true,
          isUpdating = false,
          w = angular.element($window),
          isMouseDownX = false,
          isMouseDownY = false,
          mouseDownX = void 0,
          mouseDownY = void 0,
          mouseDownScrollTop = void 0,
          mouseDownScrollLeft = void 0;

      var thumbY = angular.element('<div class="ng-scroll-bar-thumb-y"></div>');
      var thumbX = angular.element('<div class="ng-scroll-bar-thumb-x"></div>');
      element.append(thumbY);
      element.append(thumbX);
      var elemY = thumbY[0];
      var elemX = thumbX[0];

      // define a new observer
      // shim with MutationObserver
      var observer = new MutationObserver(function (mutations, observer) {
        if (initial) {
          initial = false;
          update();
        }
        mutations.some(function (item) {
          if (item.target !== elemY && item.target !== elemX) {
            update();
            return true;
          }
        });
      });

      element.on('scroll', update);
      element.on('mousewheel', mousewheel);
      thumbY.on('DOMMouseScroll', mousewheel);
      thumbY.on('mousedown', mousedown);
      thumbX.on('DOMMouseScroll', mousewheel);
      thumbX.on('mousedown', mousedown);
      w.on('resize', update);

      // have the observer observe foo for changes in children
      observer.observe(element[0], { attributes: true, childList: true, subtree: true, characterData: true });

      scope.$on('$destroy', function () {
        element.off('scroll', update);
        element.off('mousewheel', mousewheel);
        thumbY.off('DOMMouseScroll', mousewheel);
        thumbY.off('mousedown', mousedown);
        thumbX.off('DOMMouseScroll', mousewheel);
        thumbX.off('mousedown', mousedown);
        w.off('mouseup', mouseup);
        w.off('mousemove', mousemove);
        w.off('resize', update);
      });

      $timeout(update, 100);

      function mousewheel(e) {
        if (event.deltaY) {
          e.preventDefault();
          e.stopImmediatePropagation();
          var scrollHeight = element[0].scrollHeight;
          var scrollTop = element[0].scrollTop;
          element[0].scrollTop = Math.min(scrollHeight, scrollTop + event.deltaY);
        }
      }

      function mousedown(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (e.target == elemY) {
          isMouseDownY = true;
          mouseDownY = e.screenY;
          mouseDownScrollTop = element[0].scrollTop;
          w.on('mouseup', mouseup);
          w.on('mousemove', mousemove);
        } else if (e.target == elemX) {
          isMouseDownX = true;
          mouseDownX = e.screenX;
          mouseDownScrollLeft = element[0].scrollLeft;
          w.on('mouseup', mouseup);
          w.on('mousemove', mousemove);
        }
      }

      function mouseup() {
        isMouseDownX = false;
        isMouseDownY = false;
        w.off('mouseup', mouseup);
        w.off('mousemove', mousemove);
      }

      function mousemove(e) {
        e.preventDefault();
        if (isMouseDownY) {
          var clientHeight = element[0].clientHeight;
          var scrollHeight = element[0].scrollHeight;
          var displacementY = e.screenY - mouseDownY;
          var spaceHeight = clientHeight - clientHeight / scrollHeight;
          var thumbYPosition = mouseDownScrollTop / scrollHeight * spaceHeight + displacementY;
          var scrollTop = thumbYPosition / spaceHeight * scrollHeight;
          if (scrollTop > scrollHeight) {
            element[0].scrollTop = scrollHeight;
          } else {
            element[0].scrollTop = scrollTop;
          }
        } else if (isMouseDownX) {
          var clientWidth = element[0].clientWidth;
          var scrollWidth = element[0].scrollWidth;
          var displacementX = e.screenX - mouseDownX;
          var spaceWidth = clientWidth - clientWidth / scrollWidth;
          var thumbXPosition = mouseDownScrollLeft / scrollWidth * spaceWidth + displacementX;
          var scrollLeft = thumbXPosition / spaceWidth * scrollWidth;
          if (scrollLeft > scrollWidth) {
            element[0].scrollLeft = scrollWidth;
          } else {
            element[0].scrollLeft = scrollLeft;
          }
        }
      }

      function update() {
        var updateX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var updateY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (isUpdating) return;
        isUpdating = true;
        //$window.setTimeout(() => {
        var clientHeight = element[0].clientHeight;
        var scrollHeight = element[0].scrollHeight;
        var clientWidth = element[0].clientWidth;
        var scrollWidth = element[0].scrollWidth;

        if (clientHeight == scrollHeight) {
          element[0].scrollTop = 0;
          elemY.style.opacity = 0;
          elemY.style.pointerEvents = 'none';
        } else {
          var scrollTop = element[0].scrollTop;
          var scrollLeft = element[0].scrollLeft;
          var thumbYHeight = clientHeight / scrollHeight;
          var spaceHeight = clientHeight - clientHeight / scrollHeight;
          var thumbYPosition = scrollTop / scrollHeight * spaceHeight;
          //Updating
          elemY.style.pointerEvents = 'all';
          elemY.style.opacity = '';
          elemY.style.height = thumbYHeight * 100 + '%';
          elemY.style.top = scrollTop + thumbYPosition + 'px';
          elemY.style.right = -scrollLeft + 'px';
        }

        if (clientWidth == scrollWidth) {
          element[0].scrollLeft = 0;
          elemX.style.opacity = 0;
          elemX.style.pointerEvents = 'none';
        } else {
          var _scrollLeft = element[0].scrollLeft;
          var _scrollTop = element[0].scrollTop;
          var thumbWidth = clientWidth / scrollWidth;
          var spaceWidth = clientWidth - clientWidth / scrollWidth;
          var thumbXPosition = _scrollLeft / scrollWidth * spaceWidth;
          //Updating
          elemX.style.pointerEvents = 'all';
          elemX.style.opacity = '';
          elemX.style.width = thumbWidth * 100 + '%';
          elemX.style.left = _scrollLeft + thumbXPosition + 'px';
          elemX.style.bottom = -_scrollTop + 'px';
        }
        isUpdating = false;
        //}, 0);
      }
    }

    return {
      restrict: 'A',
      bindings: {},
      controller: angular.noop,
      link: link
    };
  }
})();
})(angular, window);