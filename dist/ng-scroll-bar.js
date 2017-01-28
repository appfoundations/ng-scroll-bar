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

      var minThumbHieght = 32;
      var isUpdating = false,
          w = angular.element($window),
          isMouseDown = false,
          mouseDownX = void 0,
          mouseDownY = void 0,
          mouseDownScrollTop = void 0;

      var thumb = angular.element('<div class="ng-scroll-bar-thumb"></div>');

      element.append(thumb);

      // define a new observer
      // shim with MutationObserver
      var observer = new MutationObserver(function (mutations, observer) {
        var canUpdate = false;
        mutations.forEach(function (item) {
          canUpdate = canUpdate || item.target !== thumb[0];
        });
        if (canUpdate) update();
      });

      element.on('scroll', update);
      w.on('mousedown', mousedown);
      w.on('resize', update);

      // have the observer observe foo for changes in children
      observer.observe(element[0], { attributes: true, childList: true, subtree: true, characterData: true });

      scope.$on('$destroy', function () {
        listener.disconect();
        element.off('scroll', update);
        w.off('mouseup', mouseup);
        w.off('mousemove', mousemove);
        w.off('mousedown', mousedown);
        w.off('resize', update);
      });

      $timeout(update, 100);

      function mousedown(e) {
        if (e.target == thumb[0]) {
          isMouseDown = true;
          mouseDownX = e.screenX;
          mouseDownY = e.screenY;
          mouseDownScrollTop = element[0].scrollTop;
          w.on('mouseup', mouseup);
          w.on('mousemove', mousemove);
        }
      }

      function mouseup() {
        isMouseDown = false;
        w.off('mouseup', mouseup);
        w.off('mousemove', mousemove);
      }

      function mousemove(e) {
        e.preventDefault();
        var clientHeight = element[0].clientHeight;
        var scrollHeight = element[0].scrollHeight;
        var displacementY = e.screenY - mouseDownY;
        var spaceHeight = clientHeight - clientHeight / scrollHeight;
        var thumbPosition = mouseDownScrollTop / scrollHeight * spaceHeight + displacementY;
        var scrollTop = thumbPosition / spaceHeight * scrollHeight;
        if (scrollTop > scrollHeight) {
          element[0].scrollTop = scrollHeight;
        } else {
          element[0].scrollTop = scrollTop;
        }
      }

      function update() {
        if (isUpdating) return;
        isUpdating = true;
        //$window.setTimeout(() => {
        var clientHeight = element[0].clientHeight;
        var scrollHeight = element[0].scrollHeight;

        if (clientHeight == scrollHeight) {
          thumb[0].style.opacity = 0;
          thumb[0].style.pointerEvents = 'none';
        } else {
          var scrollTop = element[0].scrollTop;
          var thumbHeight = clientHeight / scrollHeight;
          var spaceHeight = clientHeight - clientHeight / scrollHeight;
          var thumbPosition = scrollTop / scrollHeight * spaceHeight;
          //Updating
          thumb[0].style.pointerEvents = 'all';
          thumb[0].style.opacity = '';
          thumb[0].style.height = thumbHeight * 100 + '%';
          thumb[0].style.top = scrollTop + thumbPosition + 'px';
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