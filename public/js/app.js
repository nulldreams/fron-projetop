var app = angular.module('app', [
  'ngRoute',
  'angular.filter',
  'ui.bootstrap',
  'infinite-scroll',
  'ngSanitize',
  'com.2fdevs.videogular',
  'com.2fdevs.videogular.plugins.controls',
  'com.2fdevs.videogular.plugins.overlayplay',
  'com.2fdevs.videogular.plugins.poster',
  'com.2fdevs.videogular.plugins.buffering',
  'ngLodash'
])

const API = { filmes: 'https://netfreex.herokuapp.com', animes: 'https://api-animes.herokuapp.com', series: 'https://netfreex-series.herokuapp.com' }
// const API = 'http://localhost:5000'

app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true)

  $routeProvider

    .when('/', {
      templateUrl: 'views/principal.html',
      controller: 'PrincipalCtrl'
    })

    .when('/series', {
      templateUrl: 'views/series/series.html',
      controller: 'SeriesCtrl'
    })

    .when('/serie/:serie/:episodio/:temporada/:audio', {
      templateUrl: 'views/series/serie.html',
      controller: 'SerieCtrl'
    })

    .when('/series/episodios/:serie', {
      templateUrl: 'views/series/episodios-serie.html',
      controller: 'SerieEpCtrl'
    })

    .when('/animes/episodios/:anime', {
      templateUrl: 'views/animes/episodios-anime.html',
      controller: 'AnimeEpCtrl'
    })
    .when('/anime/:anime/:episodio', {
      templateUrl: 'views/animes/anime.html',
      controller: 'AnimeCtrl'
    })
    .when('/animes', {
      templateUrl: 'views/animes/animes.html',
      controller: 'AnimesCtrl'
    })
    .when('/:filme', {
      templateUrl: 'views/filmes/filme.html',
      controller: 'FilmeCtrl'
    })
    .when('/filmes/:tema', {
      templateUrl: 'views/filmes/filmes.html',
      controller: 'FilmesCtrl'
    })

    .otherwise({
      redirectTo: '/'
    })
})

app.controller('PrincipalCtrl', function ($rootScope, $location, $http, $scope, $window) {
  $scope.colors = ['cyan', 'red', 'yellow']
  $http.get(`${API.filmes}/api/v1/temas`)
    .then((response) => {
      console.log(response)
      $scope.temas = response.data
    })
    .catch((err) => console.log(err))
})

app.controller('FilmeCtrl', function ($rootScope, $location, $http, $scope, $window, $routeParams) {
  const temas = {
    'lancamentos': 'Lançamentos',
    'filmes_hd': 'Filmes em HD',
    'acao': 'Ação',
    'antigos': 'Antigos',
    'animacao': 'Animação',
    'aventura': 'Aventura',
    'comedia': 'Comédia',
    'c_romantica': 'Comédia Romântica',
    'corrida': 'Corrida',
    'crime': 'Crime',
    'documentario': 'Documentário',
    'drama': 'Drama',
    'faroeste': 'Faroeste',
    'ficcao': 'Ficção',
    'guerra': 'Guerra',
    'musical': 'Musical',
    'nacional': 'Nacional',
    'policial': 'Policial',
    'religioso': 'Religioso',
    'romance': 'Romance',
    'suspense': 'Suspense',
    'terror': 'Terror',
    'thriller': 'Thriller'
  }

  $http.get(`${API.filmes}/api/v1/filme/${$routeParams.filme}`).then((response) => {
    console.log(response)
    $scope.movie = response.data
    $scope.nomeTema = temas[$scope.movie.tema]
  })

  $scope.teste = () => {
    let video = document.getElementsByClassName('vjs-tech')
    // alert(video.length)
  }
})

app.controller('FilmesCtrl', function ($rootScope, $location, $http, $scope, $window, $routeParams, filterFilter) {
  $http.get(`${API.filmes}/api/v1/filmes/${$routeParams.tema}`).then((response) => {
    $scope.filmes = response.data
    $scope.data = $scope.filmes.slice(0, 9)
    $scope.loadMore = function () {
      $scope.data = $scope.filmes.slice(0, $scope.data.length + 9)
    }
  })
})

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

/* Series */
app.controller('SeriesCtrl', function ($rootScope, $location, $http, $scope, $window, $routeParams, filterFilter) {
  $http.get(`${API.series}/api/v1/series`).then((response) => {
    $scope.series = response.data.series

    $scope.data = $scope.series.slice(0, 9)
    $scope.loadMore = function () {
      $scope.data = $scope.series.slice(0, $scope.data.length + 9)
    }
  })
})

app.controller('SerieEpCtrl', function ($rootScope, $location, $http, $scope, $window, $routeParams, lodash) {
  $scope.ultimoBotao = undefined
  $http.get(`${API.series}/api/v1/serie/${$routeParams.serie}`).then((response) => {
    $scope.serie = response.data.serie
    $scope.tempIndex = 0
    $scope.temporadas = []

    for (let i = 0; i < $scope.serie.episodios.legendado.temporadas.length; i++) {
      $scope.temporadas.push(`${i + 1}ª Temporada`)
    }

    $scope.trocarTemporada = function (temp, event) {
      if ($scope.ultimoBotao !== undefined) {
        $($scope.ultimoBotao).removeClass('btn-warning')
      }
      $scope.ultimoBotao = event.target
      $(event.target).addClass('btn-warning')
      $scope.tempIndex = temp
      $scope.$apply()
    }

    // $scope.data = $scope.serie.episodios.slice(0, 20)
    // $scope.loadMore = function () {
    //   $scope.data = $scope.serie.episodios.slice(0, $scope.data.length + 20)
    // }
  })
})

app.controller('SerieCtrl', function ($rootScope, $location, $http, $scope, $window, $routeParams, $sce) {
  $scope.API = null
  $http.get(`${API.series}/api/v1/serie/${$routeParams.serie}`).then((response) => {
    $scope.serie = response.data.serie
    $scope.pularAbertura = false
    $scope.pularEnding = false

    $scope.audio = $routeParams.audio

    $scope.numEp = $routeParams.episodio // > 1 ? $routeParams.episodio - 1 : 0
    $scope.epInfo = $scope.serie.episodios[$scope.audio].temporadas[$routeParams.temporada][$scope.numEp]
    $scope.episodio = $scope.serie.episodios[$scope.audio].temporadas[$routeParams.temporada][$scope.numEp].opcoes[0]
    $scope.config = {
      preload: 'none',
      sources: [
                    {src: $sce.trustAsResourceUrl($scope.episodio.source), type: 'video/mp4'}
      ],
      theme: {
        url: 'https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css'
      },
      plugins: {
        poster: $scope.serie.capa,
        controls: {
          autoHide: true,
          autoHideTime: 5000
        }
      }
    }
  })
  $scope.ProxEp = () => {
    if ($scope.numEp < $scope.serie.episodios[$scope.audio].temporadas[$routeParams.temporada].length) {
      return $scope.$evalAsync(function () {
        $scope.numEp++
        $scope.epInfo = $scope.serie.episodios[$scope.audio].temporadas[$routeParams.temporada][$scope.numEp]
        $scope.episodio = $scope.serie.episodios[$scope.audio].temporadas[$routeParams.temporada][$scope.numEp].opcoes[0]
        $scope.tempoInicial = 150
        $scope.config = {
          preload: 'none',
          sources: [
                    {src: $sce.trustAsResourceUrl($scope.episodio.source), type: 'video/mp4'}
          ],
          theme: {
            url: 'https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css'
          },
          plugins: {
            poster: $scope.serie.capa,
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
        $scope.epInfo = $scope.serie.episodios[$scope.audio].temporadas[$routeParams.temporada][$scope.numEp]
        $scope.episodio = $scope.serie.episodios[$scope.audio].temporadas[$routeParams.temporada][$scope.numEp].opcoes[0]
        $scope.config = {
          preload: 'none',
          sources: [
                    {src: $sce.trustAsResourceUrl($scope.episodio.source), type: 'video/mp4'}
          ],
          theme: {
            url: 'https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css'
          },
          plugins: {
            poster: $scope.serie.capa,
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

  // $scope.onUpdateTime = ($currentTime, $duration) => {
  //   console.log($scope.API.currentTime, $scope.pularAbertura)
  //   if ($scope.API.currentTime < $scope.anime.abertura && $scope.pularAbertura) { return $scope.API.seekTime(150) }
  //   if ($scope.API.currentTime >= $scope.anime.ending && $scope.pularEnding) { return $scope.ProxEp() }

  //   if ($currentTime === $duration) {
  //     $scope.ProxEp()
  //   }
  // }
  // $scope.teste = () => {
  //   if ($scope.API.currentTime < 150 && $scope.pularAbertura) {
  //     $scope.API.seekTime(150)
  //   }
  // }
  // $scope.IniciarVideo = () => {
  //   // API.vgStartTime = 150
  // }
})
/* End Séries */

app.config(function ($sceProvider) {
  $sceProvider.enabled(false)
})

app.filter('startFrom', function () {
  return function (input, start) {
    if (input) {
      start = +start
      return input.slice(start)
    }
    return []
  }
})

app.filter('trustUrl', function ($sce) {
  return function (url) {
    return $sce.trustAsResourceUrl(url)
  }
})

app.directive('html5vfix', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      attr.$set('src', attr.vsrc)
    }
  }
})
