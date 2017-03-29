'use strict'
angular.module('converterApp', [
  'ui.router',
  'appControllers'
])
angular.module('appControllers', [])
angular.module('converterApp').run(function ($rootScope) {
  $rootScope.safeApply = function (callback) {
    let phase = this.$root.$$phase
    if (phase === '$apply' || phase === '$digest') {
      if (callback && (typeof(callback) === 'function')) {
        callback()
      }
    } else {
      this.$apply(callback)
    }
  }
})
