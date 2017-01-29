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

      // define a new observer
      // shim with MutationObserver
      var observer = new MutationObserver(function (mutations, observer) {
        if (initial) {
          initial = false;
          update();
        }
        mutations.some(function (item) {
          if (item.target !== thumbY[0] && item.target !== thumbX[0]) {
            update();
            return true;
          }
        });
      });

      element.on('scroll', update);
      element.on('mousewheel', mousewheel);
      element.on('DOMMouseScroll', mousewheel);
      element.on('mousedown', mousedown);
      w.on('resize', update);

      // have the observer observe foo for changes in children
      observer.observe(element[0], { attributes: true, childList: true, subtree: true, characterData: true });

      scope.$on('$destroy', function () {
        listener.disconect();
        element.off('scroll', update);
        element.off('mousewheel', mousewheel);
        element.off('DOMMouseScroll', mousewheel);
        element.off('mousedown', mousedown);
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
        if (e.target == thumbY[0]) {
          isMouseDownY = true;
          mouseDownY = e.screenY;
          mouseDownScrollTop = element[0].scrollTop;
          w.on('mouseup', mouseup);
          w.on('mousemove', mousemove);
        } else if (e.target == thumbX[0]) {
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
          thumbY[0].style.opacity = 0;
          thumbY[0].style.pointerEvents = 'none';
        } else {
          var scrollTop = element[0].scrollTop;
          var scrollLeft = element[0].scrollLeft;
          var thumbYHeight = clientHeight / scrollHeight;
          var spaceHeight = clientHeight - clientHeight / scrollHeight;
          var thumbYPosition = scrollTop / scrollHeight * spaceHeight;
          //Updating
          thumbY[0].style.pointerEvents = 'all';
          thumbY[0].style.opacity = '';
          thumbY[0].style.height = thumbYHeight * 100 + '%';
          thumbY[0].style.top = scrollTop + thumbYPosition + 'px';
          thumbY[0].style.right = -scrollLeft + 'px';
        }

        if (clientWidth == scrollWidth) {
          element[0].scrollLeft = 0;
          thumbX[0].style.opacity = 0;
          thumbX[0].style.pointerEvents = 'none';
        } else {
          var _scrollLeft = element[0].scrollLeft;
          var _scrollTop = element[0].scrollTop;
          var thumbWidth = clientWidth / scrollWidth;
          var spaceWidth = clientWidth - clientWidth / scrollWidth;
          var thumbXPosition = _scrollLeft / scrollWidth * spaceWidth;
          //Updating
          thumbX[0].style.pointerEvents = 'all';
          thumbX[0].style.opacity = '';
          thumbX[0].style.width = thumbWidth * 100 + '%';
          thumbX[0].style.left = _scrollLeft + thumbXPosition + 'px';
          thumbX[0].style.bottom = -_scrollTop + 'px';
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