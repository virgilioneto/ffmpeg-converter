'use strict';
angular.module('converterApp').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state({
        name: 'dashboard',
        url: '/',
        templateUrl: 'module/dashboard/dashboard.html',
        controller: 'Dashboard'
      })
      .state({
        name: 'setting',
        url: '/setting',
        templateUrl: 'module/setting/setting.html',
        controller: 'Setting'
      })
      .state({
        name: 'youtubeSetting',
        url: '/setting/youtube',
        templateUrl: 'module/setting/youtube.html',
        controller: 'YouTubeSetting'
      })
      .state({
        name: 'convert',
        url: '/convert',
        templateUrl: 'module/convert/convert.html',
        controller: 'Convert'
      })
  }
])
