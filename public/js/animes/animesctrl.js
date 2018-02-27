/* global app */

app.controller('AnimeCtrl', function ($rootScope, $location, $http, $scope, $window, $routeParams, $sce) {
  $scope.API = null
  $http.get(`${API.animes}/api/v1/anime/${$routeParams.anime}`).then((response) => {
    $scope.anime = response.data.anime
    $scope.pularAbertura = false
    $scope.pularEnding = false

    $scope.numEp = $routeParams.episodio > 1 ? $routeParams.episodio - 1 : 0
    $scope.episodio = $scope.anime.episodios[$scope.numEp]
    $scope.config = {
      preload: 'none',
      sources: [
                    {src: $sce.trustAsResourceUrl($scope.episodio.video), type: 'video/mp4'}
      ],
      theme: {
        url: 'https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css'
      },
      plugins: {
        poster: $scope.anime.capa,
        controls: {
          autoHide: true,
          autoHideTime: 5000
        }
      }
    }
  })
  $scope.ProxEp = () => {
    if ($scope.numEp < $scope.anime.episodios.length) {
      return $scope.$evalAsync(function () {
        $scope.numEp++
        $scope.episodio = $scope.anime.episodios[$scope.numEp]
        $scope.tempoInicial = 150
        $scope.config = {
          preload: 'none',
          sources: [
                    {src: $sce.trustAsResourceUrl($scope.episodio.video), type: 'video/mp4'}
          ],
          theme: {
            url: 'https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css'
          },
          plugins: {
            poster: $scope.anime.capa,
            controls: {
              autoHide: true,
              autoHideTime: 5000
            }
          }
        }
      })
    }
  }

  $scope.EpAnterior = () => {
    if ($scope.numEp > 0) {
      return $scope.$evalAsync(function () {
        $scope.numEp--
        $scope.episodio = $scope.anime.episodios[$scope.numEp]
        $scope.config = {
          preload: 'none',
          sources: [
                    {src: $sce.trustAsResourceUrl($scope.episodio.video), type: 'video/mp4'}
          ],
          theme: {
            url: 'https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css'
          },
          plugins: {
            poster: $scope.anime.capa,
            controls: {
              autoHide: true,
              autoHideTime: 5000
            }
          }
        }
      })
    }
  }
  $scope.onPlayerReady = (API) => {
    console.log(API)
    $scope.API = API
    // $scope.API.seekTime(150)
  }

  // $scope.verificarAbertura = () => {
  //   if ($scope.API.currentTime < 150 && $scope.pularAbertura) $scope.API.seekTime(150)
  // }

  $scope.onUpdateTime = ($currentTime, $duration) => {
    console.log($scope.API.currentTime, $scope.pularAbertura)
    if ($scope.API.currentTime < $scope.anime.abertura && $scope.pularAbertura) { return $scope.API.seekTime(150) }
    if ($scope.API.currentTime >= $scope.anime.ending && $scope.pularEnding) { return $scope.ProxEp() }

    if ($currentTime === $duration) {
      $scope.ProxEp()
    }
  }
  $scope.teste = () => {
    if ($scope.API.currentTime < 150 && $scope.pularAbertura) {
      $scope.API.seekTime(150)
    }
  }
  $scope.IniciarVideo = () => {
    // API.vgStartTime = 150
  }
})

app.controller('AnimeEpCtrl', function ($rootScope, $location, $http, $scope, $window, $routeParams) {
  $http.get(`${API.animes}/api/v1/anime/${$routeParams.anime}`).then((response) => {
    $scope.anime = response.data.anime

    $scope.data = $scope.anime.episodios.slice(0, 20)
    $scope.loadMore = function () {
      $scope.data = $scope.anime.episodios.slice(0, $scope.data.length + 20)
    }
  })
})

app.controller('AnimesCtrl', function ($rootScope, $location, $http, $scope, $window, $routeParams, filterFilter) {
  $http.get(`${API.animes}/api/v1/animes`).then((response) => {
    $scope.animes = response.data.animes

    $scope.data = $scope.animes.slice(0, 9)
    $scope.loadMore = function () {
      $scope.data = $scope.animes.slice(0, $scope.data.length + 9)
    }
  })
})
