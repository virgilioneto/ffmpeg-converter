'use strict';
angular.module('appControllers').controller('Convert', ['$scope',
  function ($scope) {
    let fs = require('fs')
    let path = require('path')
    let readRecursive = require('fs-readdir-recursive')

    $scope.fromDir = Setting.getProperty('fromDir') || ''
    $scope.toDir = Setting.getProperty('toDir') || ''
    $scope.recursive = Setting.getProperty('recursive') || false
    $scope.saveToSource = Setting.getProperty('saveToSource') || false
    $scope.keepStructure = Setting.getProperty('keepStructure') || false
    $scope.inputFormat = Setting.getProperty('inputFormat') || []
    $scope.fromFiles = []
    $scope.checkedFiles = []
    $scope.query = ''
    $scope.inProgress = false;

    $scope.getFilesFromDisk = function () {
      $scope.checkedFiles = []
      if ($scope.fromDir && $scope.toDir) {
        let files
        if ($scope.recursive) files = readRecursive($scope.fromDir)
        else files = fs.readdirSync($scope.fromDir)
        $scope.fromFiles = []
        files.forEach((file) => {
          if ($scope.inputFormat.includes(path.extname(file))) {
            $scope.fromFiles.push({
              name: file,
              checked: false,
              status: 'pending'
            })
          }
        })
      }
    }

    $scope.setRecursion = function (state) {
      $scope.recursive = state
      Setting.setProperty('recursive', state)
      $scope.getFilesFromDisk()
    }

    $scope.setDestAsSource = function (state) {
      $scope.saveToSource = state
      Setting.setProperty('saveToSource', state)
    }

    $scope.setKeepStructure = function (state) {
      $scope.keepStructure = state
      Setting.setProperty('keepStructure', state)
    }

    $scope.hasInput = function (format) {
      return $scope.inputFormat.includes(format)
    }

    $scope.checkInput = function (format) {
      if ($scope.inputFormat.includes(format)) {
        let index = $scope.inputFormat.indexOf(format)
        $scope.inputFormat.splice(index, 1)
      } else {
        $scope.inputFormat.push(format)
      }
      Setting.setProperty('inputFormat', $scope.inputFormat)
      $scope.getFilesFromDisk()
    }

    $scope.selectFileDir = (target) => {
      let selected = dialog.showOpenDialog({properties: ['openDirectory']});
      if (Array.isArray(selected)) {
        switch (target) {
          case 'from':
            $scope.fromDir = selected[0];
            Setting.setProperty('fromDir', $scope.fromDir)
            $scope.getFilesFromDisk()
            break
          default:
            $scope.toDir = selected[0];
            Setting.setProperty('toDir', $scope.toDir)
            break
        }
      }
    };

    $scope.markFile = function (index, force) {
      if ($scope.fromFiles[index].checked && force !== 'select') {
        let localIndex = $scope.checkedFiles.indexOf($scope.fromFiles[index].name)
        $scope.fromFiles[index].checked = false
        $scope.checkedFiles.splice(localIndex, 1)
      } else if (!force || force === 'select') {
        $scope.fromFiles[index].checked = true
        $scope.checkedFiles.push({
          name: $scope.fromFiles[index].name,
          index: index
        })
      }
    }

    $scope.markAllFiles = function (select) {
      let len = $scope.fromFiles.length
      for (let i = 0; i < len; i++) {
        $scope.markFile(i, select? 'select' : 'deselect')
      }
    }

    $scope.convertSelected = function () {
      if (!$scope.canStartConversion()) return false;
      iziToast.info({
        title: 'Start',
        message: 'File(s) conversion started!',
      })

      let ffmpeg = FFMPEG.convert($scope.checkedFiles)
      ffmpeg.on('error', (error) => {
        iziToast.error({
          title: 'Error',
          message: error.message
        })
        // let index = $scope.fromFiles.indexOf(error.file)
        $scope.fromFiles[error.file.index].status = 'error'
        $scope.safeApply()
      })
      ffmpeg.on('success', (data) => {
        iziToast.success({
          title: 'Success',
          message: data.message
        })
        // let index = $scope.fromFiles.indexOf(data.file)
        $scope.fromFiles[data.file.index].status = 'success'
        $scope.safeApply()
      })
      ffmpeg.on('finish', (data) => {
        iziToast.info({
          title: 'Finish',
          message: `Conversion finished with ${data.error} Errors`,
        })
      })
    }

    $scope.canStartConversion = function () {
      return $scope.checkedFiles.length > 0 && !$scope.inProgress
    }

    fs.stat($scope.fromDir, (error) => {
      if (error && error.code !== 'ENOENT') {
        return iziToast.error({
          title: 'Error',
          message: error.message
        })
      } else if (!error) {
        $scope.getFilesFromDisk()
        $scope.safeApply()
      }
    })
  }
]);


/*
function old ($scope) {
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
}*/
