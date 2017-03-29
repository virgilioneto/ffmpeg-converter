'use strict';
angular.module('appControllers').controller('Convert', ['$scope',
  function ($scope) {
    let fs = require('fs')
    let path = require('path')
    let inputExtensions = ['.mp4', '.mkv', '.flv', '.avi']
    $scope.fromDir = Setting.getProperty('fromDir')
    $scope.toDir = Setting.getProperty('toDir')
    $scope.fromFiles = []
    $scope.checkedFiles = []

    if ($scope.fromDir && $scope.toDir) {
      try {
        let isFromValid = fs.statSync($scope.fromDir)
        let isToValid = fs.statSync($scope.toDir)

        let files = fs.readdirSync($scope.fromDir)

        files.forEach((file) => {
          if (inputExtensions.includes(path.extname(file))) {
            $scope.fromFiles.push({
              name: file,
              checked: false,
              text: 'Select file'
            })
          }
        })

      } catch (error) {
        //TODO: Handle Error
        console.error(error)
      }
    }

    $scope.markFile = (index) => {
      if ($scope.fromFiles[index].checked) {
        let localIndex = $scope.checkedFiles.indexOf($scope.fromFiles[index].name)
        $scope.fromFiles[index].text = 'Select file'
        $scope.fromFiles[index].checked = false
        $scope.checkedFiles.splice(localIndex, 1)
      } else {
        $scope.fromFiles[index].text = 'Deselect file'
        $scope.fromFiles[index].checked = true
        $scope.checkedFiles.push($scope.fromFiles[index].name)
      }
    }

    $scope.convertSelected = () => {
      iziToast.info({
        title: 'Info',
        message: 'File(s) conversion started!',
      });

      FFMPEG.batchConvert((error) => {
        if (error) handleError(error)
        else {
          iziToast.success({
            title: 'Success',
            message: 'File(s) converted with success!'
          });
        }
      }, $scope.checkedFiles)
    }

    function handleError (error) {
      iziToast.error({
        title: 'Error',
        message: error.message
      });
    }
  }
]);
