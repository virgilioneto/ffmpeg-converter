'use strict';
angular.module('appControllers').controller('Setting', ['$scope', '$state',
  function ($scope, $state) {
    $scope.fromDir = Setting.getProperty('fromDir')
    $scope.toDir = Setting.getProperty('toDir')
    $scope.uploadDir = Setting.getProperty('uploadDir')

    $scope.selectFileDir = (from) => {
      let selected = dialog.showOpenDialog({properties: ['openDirectory']});
      if (Array.isArray(selected)) {
        if (from === 'from') $scope.fromDir = selected[0];
        else if (from === 'to') $scope.toDir = selected[0];
        else if (from === 'upload') $scope.uploadDir = selected[0];
      }
    };

    $scope.save = () => {
      Setting.setProperty('fromDir', $scope.fromDir, false)
      Setting.setProperty('toDir', $scope.toDir, false)
      Setting.setProperty('uploadDir', $scope.uploadDir, false)
      Setting.save()
      $state.go('dashboard')
    }
  }
]);
