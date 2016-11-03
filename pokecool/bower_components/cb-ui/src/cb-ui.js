// ReSharper disable VariableCanBeMadeConst
;
angular.module('cbUI', [])
  .directive('cbDraggable', [
    '$document', function($document) {
      return function(scope, element) {
        var startX = 0, startY = 0, x = 0, y = 0;
        
        element.on('mousedown', function(evnt) {
          startX = evnt.pageX - x;
          startY = evnt.pageY - y;
          $document.on('mousemove', onMouseMove);
          $document.on('mouseup', onMouseUp);
        });

        function onMouseMove(evnt) {
          evnt.preventDefault();
          y = evnt.pageY - startY;
          x = evnt.pageX - startX;
          element.css({
            'top': y + 'px',
            'left': x + 'px'
          });
        }

        function onMouseUp() {
          $document.off('mousemove', onMouseMove);
          $document.off('mouseup', onMouseUp);
        }
      };
    }
  ]);