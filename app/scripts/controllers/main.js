'use strict';

/**
 * @ngdoc function
 * @name sqlexplorerFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sqlexplorerFrontendApp
 */

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
angular.module('sqlexplorerFrontendApp')
  .filter('startFrom', function() {
    return function(input, start) {
      if (input && input.length) {
        start = +start; //parse to int
        return input.slice(start);
      } else {
        return input;
      }
    };
  });

function removeNL(s) {
  /*
  ** Remove NewLine, CarriageReturn and Tab characters from a String
  **   s  string to be processed
  ** returns new string
  */
  var r = '';
  for (var i = 0; i < s.length; i++) {
    if (s.charAt(i) !== '\n' &&
      s.charAt(i) !== '\r' &&
      s.charAt(i) !== '\t') {
      r += s.charAt(i);
    }
  }
  return r;
}

angular.module('sqlexplorerFrontendApp')
  .controller('MainCtrl', function($scope, $http, $routeParams, $location, $window, $q,
    $timeout, localStorageService, admin, user, BASE_URL, assignment) {

    var historyId;

    $scope.isLti = Boolean(user) && Boolean(assignment);
    console.log(BASE_URL);
    $scope.history = [];
    $scope.historyLimit = true;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.baseUrl = BASE_URL;
    if ($scope.isLti) {
      $scope.user = user.data;
      $scope.user.score = 0;
      var assignmentData = assignment.data;
      assignmentData.questions.map(function(question) {
        question.active = false;
        question.state = question.is_correct === null ? 'pending' : String(question.is_correct);
        question.passed = question.is_correct;
        if (question.passed) $scope.user.score++;
        return question
      });
      $scope.assignment = assignmentData;
      $scope.setCurrentQuestion = setCurrentQuestion;
    }

    $scope.numberOfPages = function() {
      return $scope.results && $scope.results.content && Math.ceil($scope.results.content.length / $scope.pageSize) || 0;
    };

    $scope.editorOptions = {
      lineNumbers: true,
      mode: 'text/x-oracle',
      theme: 'neat',
      matchBrackets: true,
      extraKeys: {
        'Ctrl-Enter': function() {
          $scope.evaluate();
        },
        'Shift-Alt-F': function() {
          $scope.format();
        }
      }
    };

    $scope.admin = admin;
    if ($routeParams.db) {
      $scope.db = $routeParams.db.toUpperCase();
      historyId = $scope.db;
      //todo as watch?
      $scope.history = localStorageService.get(historyId) || [];
    }
    var search = $window.location.search.split('=');
    // //from scorm frame
    // if (search.length > 1) {
    //   if (isNaN(search[1])) {
    //     $scope.db = search[1].toUpperCase();
    //     //todo as watch?
    //     $scope.history = localStorageService.get($scope.db) || [];
    //   } else {
    //     $routeParams.id = search[1];
    //   }
    //   var start = new Date().getTime();
    //   var checkScormAPI = function() {
    //     if (scorm_api) {
    //       if (scorm_score > 0) {
    //         //question passed
    //         $scope.passed = true;
    //       }
    //     } else if (new Date().getTime() - start < 3000) {
    //       $timeout(checkScormAPI, 200);
    //     } else {
    //       alert('no scorm api connection!');
    //     }
    //   };
    //   checkScormAPI();
    // }

    if ($routeParams.id) {
      historyId = $scope.questionId = $routeParams.id;
      $scope.history = localStorageService.get(historyId) || [];
      //IF admin get answer
      var url = '/api/questiontext/';
      var options = {};
      if ($scope.admin) {
        url = '/api/question/';
        options['withCredentials'] = true;
      }
      $http.get(BASE_URL + url + $scope.questionId, options)
        .then(function(result) {
          $scope.db = result.data.db_schema.toUpperCase();
          //todo as watch?
          $scope.history = localStorageService.get(historyId) || [];
          $scope.question = result.data;
        })
        .catch(function(err) {
          //TODO: handle failure
          console.log(err);
        });
    }

    assignment ? $scope.setCurrentQuestion(0) : $scope.question = {
      sql: ''
    };

    $scope.format = function() {
      if (!$scope.question.sql) {
        $scope.error = "Format : Pas de requête à formater."
        return;
      }
      $http.post('https://sqlformat.org/api/v1/format', {
        sql: $scope.question.sql || "",
        reindent: 1,
        keyword_case: 'upper'
      }, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          withCredentials: false,
          transformRequest: function(obj) {
            var str = [];
            for (var p in obj) {
              str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
            return str.join('&');
          }
        })
        .then(function(res) {
          if (res.data.result !== 'undefined') $scope.question.sql = res.data.result;
        })
        .catch(function(err) {
          console.error(err);
        });
    };

    $scope.evaluate = function() {
      if (!Boolean($scope.question.sql)) {
        $scope.error = "Execute : Pas de requête à exécuter."
        return;
      }
      var timeout = $q.defer(),
        timedOut = false;

      $scope.results = [];
      $scope.error = '';
      $scope.evaluating = true;

      $timeout(function() {
        timedOut = true;
        timeout.resolve();
      }, 10000);

      var data = { sql: $scope.question.sql, db: $scope.db };
      if ($scope.questionId || $scope.question.id) {
        data.id = $scope.questionId || $scope.question.id;
      }
      if (scorm_api) {
        data.user_id = doLMSGetValue('cmi.core.student_id');
        data.user_name = doLMSGetValue('cmi.core.student_name');
      }

      $http.post(BASE_URL + '/api/evaluate', data, { cache: false, timeout: timeout.promise })
        .then(function(result) {
          console.log('/api/evaluate result', result);
          var history = { sql: $scope.question.sql };
          $scope.results = result.data;
          $scope.currentPage = 0;
          if (result.data.error) {
            $scope.error = result.data.error;
            history.error = result.data.error;
          }
          if (result.data.hasOwnProperty('numrows')) {
            history.result = result.data.numrows;
          }
          if (scorm_api) {
            //save interaction only has a range from 0-255
            // cmi suff is broken in moodle >2.8
            //doLMSSetValue('cmi.interactions.'+ 0 +'.student_response', removeNL(history.sql).substring(0,255));
            //doLMSSetValue('cmi.interactions.'+ 0 +'.result', data.correct ? 'correct' : 'wrong');
            if (result.data.correct) {
              doLMSSetValue('cmi.core.score.raw', 1);
              doLMSSetValue('cmi.core.lesson_status', 'passed');
              //questionPassed
              $scope.passed = { sql: history.sql, answer: result.data.answer };
            } else {
              doLMSSetValue('cmi.core.score.raw', 0);
              doLMSSetValue('cmi.core.lesson_status', 'failed');
            }
          } else {
            if ($scope.isLti) {
              $scope.question.is_correct = result.data.correct;
              if (result.data.correct) {
                $scope.passed = $scope.question.passed = { sql: history.sql, answer: result.data.answer };
                $scope.question.state = String($scope.question.is_correct);
                $scope.user && $scope.user.score++;
              } else {
                $scope.question.state = String($scope.question.is_correct);
              }
              saveResponse($scope.question, result);
            } else {
              $scope.passed = result.data.correct;
            }
          }

          $scope.evaluating = false;

          if (!$scope.isLti) {
            $scope.history.unshift(history);

            //could be moved to watch
            localStorageService.set(historyId, $scope.history);
          }
        })
        .catch(function(data) {
          if (timedOut) {
            $scope.evaluating = false;
            $scope.error = 'unable to contact server';
          } else {
            $scope.evaluating = false;
            $scope.error = data.status + ' : ' + data.data;
          }
        });
    };

    $scope.upsert = function() {
      var question = { sql: $scope.question.sql, text: $scope.question.text, db_schema: $scope.db };
      if ($scope.question.id) {
        question.id = $scope.question.id;
      }
      $http.post(BASE_URL + '/api/question', question, { cache: false, withCredentials: true })
        .then(function(data) {
          $scope.evaluating = false;
          $location.search('id', data.id);
        })
        .catch(function(data) {
          $scope.evaluating = false;
        });

    };

    $scope.navToNewQuestion = function() {
      $location.search('id', undefined);
    };

    $scope.isNum = function(a) {
      return !isNaN(a);
    };

    $scope.isNull = function(a) {
      return a === '(NULL)';
    };

    $scope.clearHistory = function() {
      localStorageService.remove(historyId);
      $scope.history = [];
    };

    console.log($scope);

    function saveResponse(question, result) {
      var responseData = {
        sql: question.sql,
        isCorrect: result.data.correct
      };
      if (responseData.isCorrect) responseData.userScore = $scope.user.score / $scope.assignment.questions.length;

      $http.post(BASE_URL + '/lti/assignment/' + $scope.assignment.id + '/question/' + question.id + '/response', responseData)
        .then(function(result) {
          question.history.unshift(result.data.history);
        })
        .catch(console.log);
    }

    function loadHistory(question) {
      if (question.history === undefined) {
        $http.get(BASE_URL + '/lti/assignment/' + $scope.assignment.id + '/question/' + question.id + '/history')
          .then(function(result) {
            $scope.history = question.history = result.data;
          })
          .catch(console.log);
      } else {
        $scope.history = question.history;
      }
    }

    function setCurrentQuestion(index) {
      $scope.question && ($scope.question.active = false);
      $scope.question = $scope.assignment.questions[index];
      console.log('setting question to index', index);
      $scope.question.active = true;
      $scope.db = $scope.question.db_schema.toLowerCase();
      $scope.passed = $scope.question.passed ? $scope.question : undefined;
      loadHistory($scope.question);
      $scope.error = null;
    }
  });
