(function () {
  angular
    .module('ng-scroll-bar')
    .directive('ngScrollBar', ngScrollBarDirective);

  /* @ngInject */
  function ngScrollBarDirective($window, $timeout) {

    function link(scope, element, attrs, controllers) {

      const minThumbHieght = 32;
      let isUpdating = false, w = angular.element($window), isMouseDown = false, mouseDownX, mouseDownY, mouseDownScrollTop;

      const thumb = angular.element('<div class="ng-scroll-bar-thumb"></div>');

      element.append(thumb);

      // define a new observer
      // shim with MutationObserver
      const observer = new MutationObserver(function (mutations, observer) {
        let canUpdate = false;
        mutations.forEach((item) => {
          canUpdate = canUpdate || item.target !== thumb[0];
        })
        if(canUpdate) update();
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
        const clientHeight = element[0].clientHeight;
        const scrollHeight = element[0].scrollHeight;
        const displacementY = e.screenY - mouseDownY;
        const spaceHeight = clientHeight - (clientHeight / scrollHeight);
        const thumbPosition = (mouseDownScrollTop / scrollHeight * spaceHeight) + displacementY;
        const scrollTop = thumbPosition / spaceHeight * scrollHeight;
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
          const clientHeight = element[0].clientHeight;
          const scrollHeight = element[0].scrollHeight;

          if (clientHeight == scrollHeight) {
            element[0].scrollTop = 0;
            thumb[0].style.opacity = 0;
            thumb[0].style.pointerEvents = 'none';
          } else {
            const scrollTop = element[0].scrollTop;
            const thumbHeight = clientHeight / scrollHeight;
            const spaceHeight = clientHeight - (clientHeight / scrollHeight);
            const thumbPosition = scrollTop / scrollHeight * spaceHeight;
            //Updating
            thumb[0].style.pointerEvents = 'all';
            thumb[0].style.opacity = '';
            thumb[0].style.height = `${thumbHeight * 100}%`;
            thumb[0].style.top = `${(scrollTop + thumbPosition)}px`;
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

} ())