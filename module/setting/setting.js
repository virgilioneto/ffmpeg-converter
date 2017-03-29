'use strict';
angular.module('appControllers').controller('Setting', ['$scope', '$state',
  function ($scope, $state) {
    $scope.fromDir = Setting.getProperty('fromDir')
    $scope.toDir = Setting.getProperty('toDir')
    $scope.uploadDir = Setting.getProperty('uploadDir')
    $scope.ffmpegDir = Setting.getProperty('ffmpegDir')

    $scope.selectFileDir = (target) => {
      let selected = dialog.showOpenDialog({properties: ['openDirectory']});
      if (Array.isArray(selected)) {
        switch (target) {
          case 'from':
            $scope.fromDir = selected[0];
            break
          case 'to':
            $scope.toDir = selected[0];
            break
          case 'upload':
            $scope.uploadDir = selected[0];
            break
          default:
            $scope.ffmpegDir = selected[0];
            break
        }
      }
    };

    $scope.save = () => {
      Setting.setProperty('fromDir', $scope.fromDir, false)
      Setting.setProperty('toDir', $scope.toDir, false)
      Setting.setProperty('uploadDir', $scope.uploadDir, false)
      Setting.setProperty('ffmpegDir', $scope.ffmpegDir, false)
      Setting.save()
      $state.go('dashboard')
    }
  }
]);
