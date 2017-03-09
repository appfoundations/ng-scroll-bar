(function () {
  angular
    .module('ng-scroll-bar')
    .directive('ngScrollBar', ngScrollBarDirective);

  /* @ngInject */
  function ngScrollBarDirective($window, $timeout) {

    function link(scope, element, attrs, controllers) {
      const MOUSE_MOVE = 'mousemove';
      const MOUSE_UP = 'mouseup';
      const MOUSE_DOWN = 'mousedown';
      const minThumbsize = 8;
      let initial = true, isUpdating = false, w = angular.element($window),
        isMouseDownX = false, isMouseDownY = false, mouseDownX, mouseDownY, mouseDownScrollTop, mouseDownScrollLeft;

      const thumbY = angular.element('<div class="ng-scroll-bar-thumb-y"></div>');
      const thumbX = angular.element('<div class="ng-scroll-bar-thumb-x"></div>');
      element.append(thumbY);
      element.append(thumbX);
      const elemY = thumbY[0];
      const elemX = thumbX[0];

      // define a new observer
      // shim with MutationObserver
      const observer = new MutationObserver(function (mutations, observer) {
        if (initial) {
          initial = false;
          update();
        }
        mutations.some((item) => {
          if (item.target !== elemY && item.target !== elemX) {
            update();
            return true;
          }
        });
      });

      const mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

      element.on('scroll', update);
      element.on(mousewheelevt, mousewheel);
      thumbY.on('mousedown', mousedown);
      thumbX.on('mousedown', mousedown);
      w.on('resize', update);

      // have the observer observe foo for changes in children
      observer.observe(element[0], { attributes: true, childList: true, subtree: true, characterData: true });

      scope.$on('$destroy', function () {
        element.off('scroll', update);
        element.off(mousewheelevt, mousewheel);
        thumbY.off('mousedown', mousedown);
        thumbX.off('mousedown', mousedown);
        w.off('mouseup', mouseup);
        w.off('mousemove', mousemove);
        w.off('resize', update);
      });

      $timeout(update, 100);

      function mousewheel(e) {
        const evt = window.event || e; //equalize event object
        const delta = (evt.detail ? evt.detail * -240 : evt.wheelDelta) < 1  ? 120 : -120; //delta returns +120 when wheel is scrolled up, -120 when scrolled down
        if (delta) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const scrollHeight = element[0].scrollHeight;
          const scrollTop = element[0].scrollTop;
          element[0].scrollTop = Math.min(scrollHeight, scrollTop + delta);
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
          const clientHeight = element[0].clientHeight;
          const scrollHeight = element[0].scrollHeight;
          const displacementY = e.screenY - mouseDownY;
          const spaceHeight = clientHeight - (clientHeight / scrollHeight);
          const thumbYPosition = (mouseDownScrollTop / scrollHeight * spaceHeight) + displacementY;
          const scrollTop = thumbYPosition / spaceHeight * scrollHeight;
          if (scrollTop > scrollHeight) {
            element[0].scrollTop = scrollHeight;
          } else {
            element[0].scrollTop = scrollTop;
          }
        } else if (isMouseDownX) {
          const clientWidth = element[0].clientWidth;
          const scrollWidth = element[0].scrollWidth;
          const displacementX = e.screenX - mouseDownX;
          const spaceWidth = clientWidth - (clientWidth / scrollWidth);
          const thumbXPosition = (mouseDownScrollLeft / scrollWidth * spaceWidth) + displacementX;
          const scrollLeft = thumbXPosition / spaceWidth * scrollWidth;
          if (scrollLeft > scrollWidth) {
            element[0].scrollLeft = scrollWidth;
          } else {
            element[0].scrollLeft = scrollLeft;
          }
        }
      }

      function update(updateX = true, updateY = true) {
        if (isUpdating) return;
        isUpdating = true;
        //$window.setTimeout(() => {
        const clientHeight = element[0].clientHeight;
        const scrollHeight = element[0].scrollHeight;
        const clientWidth = element[0].clientWidth;
        const scrollWidth = element[0].scrollWidth;

        if (clientHeight == scrollHeight) {
          element[0].scrollTop = 0;
          elemY.style.opacity = 0;
          elemY.style.pointerEvents = 'none';
        } else {
          const scrollTop = element[0].scrollTop;
          const scrollLeft = element[0].scrollLeft;
          const thumbYHeight = clientHeight / scrollHeight;
          const spaceHeight = clientHeight - (clientHeight / scrollHeight);
          const thumbYPosition = scrollTop / scrollHeight * spaceHeight;
          //Updating
          elemY.style.pointerEvents = 'all';
          elemY.style.opacity = '';
          elemY.style.height = `${thumbYHeight * 100}%`;
          elemY.style.top = `${(scrollTop + thumbYPosition)}px`;
          elemY.style.right = `${-scrollLeft}px`;
        }

        if (clientWidth == scrollWidth) {
          element[0].scrollLeft = 0;
          elemX.style.opacity = 0;
          elemX.style.pointerEvents = 'none';
        } else {
          const scrollLeft = element[0].scrollLeft;
          const scrollTop = element[0].scrollTop;
          const thumbWidth = clientWidth / scrollWidth;
          const spaceWidth = clientWidth - (clientWidth / scrollWidth);
          const thumbXPosition = scrollLeft / scrollWidth * spaceWidth;
          //Updating
          elemX.style.pointerEvents = 'all';
          elemX.style.opacity = '';
          elemX.style.width = `${thumbWidth * 100}%`;
          elemX.style.left = `${(scrollLeft + thumbXPosition)}px`;
          elemX.style.bottom = `${-scrollTop}px`;
        }
        isUpdating = false;
        //}, 0);
      }
    }

    return {
      restrict: 'A',
      bindings: {},
      controller: angular.noop,
      link,
    };

  }

}())