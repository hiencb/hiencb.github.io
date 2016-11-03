angular.module('cb.strap.tpl', [])
  .run([
    '$templateCache', function(cache) {
      cache.put('./tpl/cb-alert.html',
        '<div class="{{$ctrl.getClass()}}" role="alert"> <button ng-show="$ctrl.isDismissible()" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <ng-transclude /> </div>');

      cache.put('./tpl/cb-button(button).html', '<button />');
      cache.put('./tpl/cb-button(a).html', '<a role="button" />');
      cache.put('./tpl/cb-button(input).html', '<input>');
    }
  ]);