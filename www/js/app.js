var app = angular.module('iBook', ['ionic']);


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
  });

  $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerCtrl'
  });

  $stateProvider.state('bookShelf', {
      url: '/bookShelf',
      templateUrl: 'templates/bookShelf.html',
      controller: 'bookShelfCtrl'
  });

  $stateProvider.state('listView',{
      url: '/listView',
      templateUrl: 'templates/listView.html',
      controller: 'listViewCtrl'
  });

  $stateProvider.state('createApp', {
      url: '/createApp',
      templateUrl: 'templates/createApp.html',
      controller: 'createAppCtrl'
  });

  $stateProvider.state('editApp', {
      url: '/editApp',
      templateUrl: 'templates/editApp.html',
      controller: 'editAppCtrl'
  });

  $stateProvider.state('buttonPage', {
      url: '/buttonPage',
      templateUrl: 'templates/buttonPage.html',
      controller: 'buttonPageCtrl'
  });

  $stateProvider.state('buttonCreate', {
      url: '/buttonCreate',
      templateUrl: 'templates/buttonCreate.html',
      controller: 'buttonCreateCtrl'
  });
  
  $stateProvider.state('buttonEdit', {
      url: '/buttonEdit',
      templateUrl: 'templates/buttonEdit.html',
      controller: 'buttonEditCtrl'
  });

  $stateProvider.state('elementPage', {
      url: '/elementPage/:buttonId',
      templateUrl: 'templates/elementPage.html',
      controller: 'elementPageCtrl'
  });

  $stateProvider.state('elementCreate', {
      url: '/elementCreate',
      templateUrl: 'templates/elementCreate.html',
      controller: 'elementCreateCtrl'
  });

  $stateProvider.state('elementEdit', {
      url: '/elementEdit',
      templateUrl: 'templates/elementEdit.html',
      controller: 'elementEditCtrl'
  });

  $stateProvider.state('contentView', {
      url: '/contentView',
      templateUrl: 'templates/contentView.html',
      controller: 'contentViewCtrl'
  });
    $urlRouterProvider.otherwise('/login');

});


function onConnectionCheck(){
  var networkState = navigator.network.connection.type;
    var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
        if (states[networkState] == 'No network connection') {
          offline();
        }else{
          goOnline();
        }
}
    
function goOnline(){
  //window.wizSpinner.show(options);
  //navigator.notification.alert("Successfully Connected");
}

function offline(){
  navigator.notification.alert("Please Connect Your 3G or Wifi Connection");
}

openFB.init('1436547346579776');







var appkeyResult = '';
var appList = '';
var twitterKey = '';
var buttonArray = '';
var elementArray = '';
var buttonId = '';
var elementId = '';
var contentData = '';
var appKey = '';
var appTitle = '';
var options = {
  customSpinner : false,
  position : "middle",
  label : "Please Wait..",
  bgColor: "#000",
  opacity:0.5,
  color: "#fff"
};
var listGrid = '';

var googleapi = {
      setToken: function(data) {
          localStorage.access_token = data.access_token;
          localStorage.refresh_token = data.refresh_token || localStorage.refresh_token;
          var expiresAt = new Date().getTime() + parseInt(data.expires_in, 10) * 1000 - 60000;
          localStorage.expires_at = expiresAt;
      },
      authorize: function(options) {
          var deferred = $.Deferred();
          var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                                                                               client_id: options.client_id,
                                                                               redirect_uri: options.redirect_uri,
                                                                               response_type: 'code',
                                                                               scope: options.scope
                                                                               });
          var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=yes');
          $(authWindow).on('loadstart', function(e) {
                          
                           var url = e.originalEvent.url;
                           var code = /\?code=(.+)$/.exec(url);
                           var error = /\?error=(.+)$/.exec(url);
                           
                           if (code || error) {
                            authWindow.close();
                           }
                           
                           if (code) {
                            $.post('https://accounts.google.com/o/oauth2/token', {
                                  code: code[1],
                                  client_id: options.client_id,
                                  client_secret: options.client_secret,
                                  redirect_uri: options.redirect_uri,
                                  grant_type: 'authorization_code'
                                  }).done(function(data) {
                                          googleapi.setToken(data);
                                          deferred.resolve(data);
                                          }).fail(function(response) {
                                                  deferred.reject(response.responseJSON);
                                                  });
                           } else if (error) {
                           deferred.reject({
                                           error: error[1]
                                           });
                           }
                           });
            return deferred.promise();
      },
      getToken: function(options) {
          var deferred = $.Deferred();
          if (new Date().getTime() < localStorage.expires_at) {
              deferred.resolve({
                               access_token: localStorage.access_token
                               });
          } else if (localStorage.refresh_token) {
              $.post('https://accounts.google.com/o/oauth2/token', {
                     refresh_token: localStorage.refresh_token,
                     client_id: options.client_id,
                     client_secret: options.client_secret,
                     grant_type: 'refresh_token'
                     }).done(function(data) {
                             googleapi.setToken(data);
                             deferred.resolve(data);
                             }).fail(function(response) {
                                     deferred.reject(response.responseJSON);
                                     });
          } else {
              deferred.reject();
          }
          
          return deferred.promise();
      },
      userInfo: function(options) {
          return $.getJSON('https://www.googleapis.com/oauth2/v1/userinfo', options);
      }
    };



    

app.controller('loginCtrl', function($scope, $state, $ionicModal,$ionicLoading) {
  document.addEventListener("deviceready", onConnectionCheck, false);

  if(localStorage["login"]){      
    
    appkeyResult = JSON.parse(localStorage["login"]);
   
   	

            //alert(appkeyResult.api_key+" : "+appkeyResult.id);
            $.ajax({

                  type: "GET",
                  url: "http://build.myappbuilder.com/api/users.json",
                  data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                  cache: false,
                  success:function(response){

                  
                  //  window.wizSpinner.hide();

                    appList = response;
                    if(listGrid == ''){
                      $state.go('bookShelf');
                    }else if(listGrid == 'list'){
                      $state.go('listView');
                    }else{
                      $state.go('bookShelf');
                    }

                  },
                  error:function(error,status){
                    //window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText)
                  }
            });
  }

  $scope.loginFtn = function(){
  	 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });
  //  window.wizSpinner.show(options);

    var userId = $('#userId').val();
    var password = $('#password').val();
    
    $.ajax({
          type: "POST",
          url: "http://build.myappbuilder.com/api/login.json",
          data:{'login':userId,'password':password},
          success:function(response){
            
            appkeyResult = response;

            //alert(appkeyResult.api_key);
           
            $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/users.json",
                  data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                  cache: false,
                  success:function(response){
                  	$ionicLoading.hide();
                  //  window.wizSpinner.hide();
                    appList = response;
				
                    localStorage["login"] = JSON.stringify(appkeyResult);
                    if(listGrid == ''){
                      $state.go('bookShelf');
                    }else if(listGrid == 'list'){
                      $state.go('listView');
                    }else{
                      $state.go('bookShelf');
                    }
                  },
                  error:function(error,status){
                  	$ionicLoading.hide();
                 //   window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText)
                  }
            });
            
          },
          error:function(error,status){
          	$ionicLoading.hide();
            //window.wizSpinner.hide();
            var error = JSON.parse(error.responseText);
            if(error.error == "Unauthorized"){
              navigator.notification.alert("Please Check Your UserId or Password!")
            }else {
              navigator.notification.alert("Login Error!");
            }
          }
    });
  };

  $scope.registerPageCallFtn =function(){
    $state.go('register');
  };

  $scope.fbLogin = function(){
    openFB.login('email',
        function() {
            openFB.api({
              path: '/me',
              success: function(responcedata) {
                  console.log(JSON.stringify(responcedata));
                  $.ajax({
                        type: "POST",
                        url: "http://build.myappbuilder.com/api/login.json",
                        data:{'uid':responcedata.id,'provider':"facebook"},
                        success:function(response){
                          appkeyResult = response;
                          //alert(appkeyResult.api_key);
                          $.ajax({
                                type: "GET",
                                url: "http://build.myappbuilder.com/api/users.json",
                                data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                                cache: false,
                                success:function(response){
                                //  window.wizSpinner.hide();
                                  appList = response;
                                  localStorage["login"] = JSON.stringify(appkeyResult);
                                  if(listGrid == ''){
                                    $state.go('bookShelf');
                                  }else if(listGrid == 'list'){
                                    $state.go('listView');
                                  }else{
                                    $state.go('bookShelf');
                                  }
                                },
                                error:function(error,status){
                                 // window.wizSpinner.hide();
                                  navigator.notification.alert(error.responseText)
                                }
                          });
                          
                        },
                        error:function(error,status){
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                            //navigator.notification.alert("Please Check Your UserId or Password!")
                            $.ajax({
                              type: "POST",
                              url: "http://build.myappbuilder.com/api/users.json",
                              data:{'name':responcedata.name,'username':responcedata.username,'identity[uid]':responcedata.id,'identity[provider]':'facebook'},
                              cache:false,
                              success:function(response){
                                appkeyResult = response;
                                //alert(appkeyResult.api_key);
                                $.ajax({
                                      type: "GET",
                                      url: "http://build.myappbuilder.com/api/users.json",
                                      data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                                      cache: false,
                                      success:function(response){
                                      //  window.wizSpinner.hide();
                                        appList = response;
                                        localStorage["login"] = JSON.stringify(appkeyResult);
                                        if(listGrid == ''){
                                          $state.go('bookShelf');
                                        }else if(listGrid == 'list'){
                                          $state.go('listView');
                                        }else{
                                          $state.go('bookShelf');
                                        }
                                      },
                                      error:function(error,status){
                                       // window.wizSpinner.hide();
                                        navigator.notification.alert(error.responseText)
                                      }
                                });
                              },
                              error:function(error){
                              //  window.wizSpinner.hide();
                                navigator.notification.alert(error.responseText)
                              }
                            });
                          }else {
                            navigator.notification.alert("Login Error!");
                          }
                        }
                  });
                  
              },
              error: function(error) {
                  console.log(error.message);
              }
            });
        },
        function(error) {
          console.log('Facebook login failed: ' + error.error_description);
        });
  }

  $scope.twitterLogin = function(){
            var oauth; // It Holds the oAuth data request
            var requestParams; // Specific param related to request
            var options = {
                consumerKey: 'UBjIy8qbq3JRrpBuZdhRhQ', // YOUR Twitter CONSUMER_KEY
                consumerSecret: '4SOJDZvvnLA1iybfK884YUGier1XEUKEYHTb1OUF4', // YOUR Twitter CONSUMER_SECRET
                callbackUrl: "http://nuatransmedia.com/" }; // YOU have to replace it on one more Place                   
            twitterKey = "tTWnGny5Oydp0Zo3BVYg03BDl"; // This key is used for storing Information related
            var ref;         
                     
            var Twitter = {
                init:function(){
                      var storedAccessData, rawData = localStorage.getItem(twitterKey);
                      if(localStorage.getItem(twitterKey) !== null){
                      storedAccessData = JSON.parse(rawData); //JSON parsing
                      options.accessTokenKey = storedAccessData.accessTokenKey; // data will be saved when user first time signin
                      options.accessTokenSecret = storedAccessData.accessTokenSecret; // data will be saved when user first first signin
                          oauth = OAuth(options);
                          oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
                              function(data) {
                                  var entry = JSON.parse(data.text);
                                  //console.log("USERNAME: " + JSON.stringify(entry));
                                  
                                //  window.wizSpinner.show(options);
                                  $.ajax({
                                    type: "POST",
                                    url: "http://build.myappbuilder.com/api/login.json",
                                    data:{'uid':entry.id,'provider':"twitter"},
                                    success:function(response){
                                      appkeyResult = response;
                                      $.ajax({
                                            type: "GET",
                                            url: "http://build.myappbuilder.com/api/users.json",
                                            data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                                            cache: false,
                                            success:function(response){
                                           //   window.wizSpinner.hide();
                                              appList = response;
                                              localStorage["login"] = JSON.stringify(appkeyResult);
                                              if(listGrid == ''){
                                                $state.go('bookShelf');
                                              }else if(listGrid == 'list'){
                                                $state.go('listView');
                                              }else{
                                                $state.go('bookShelf');
                                              }
                                            },
                                            error:function(error,status){
                                            //  window.wizSpinner.hide();
                                              navigator.notification.alert(error.responseText)
                                            }
                                      });
                                    },
                                    error:function(error){
                                        var error = JSON.parse(error.responseText);
                                        if(error.error == "Unauthorized"){
                                          //navigator.notification.alert("Please Check Your UserId or Password!")
                                          $.ajax({
                                            type: "POST",
                                            url: "http://build.myappbuilder.com/api/users.json",
                                            data:{'name':entry.name,'username':entry.screen_name,'identity[uid]':entry.id,'identity[provider]':'twitter'},
                                            cache:false,
                                            success:function(response){
                                              appkeyResult = response;
                                              //alert(appkeyResult.api_key);
                                              $.ajax({
                                                    type: "GET",
                                                    url: "http://build.myappbuilder.com/api/users.json",
                                                    data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                                                    cache: false,
                                                    success:function(response){
                                                   //   window.wizSpinner.hide();
                                                      appList = response;
                                                      localStorage["login"] = JSON.stringify(appkeyResult);
                                                      if(listGrid == ''){
                                                        $state.go('bookShelf');
                                                      }else if(listGrid == 'list'){
                                                        $state.go('listView');
                                                      }else{
                                                        $state.go('bookShelf');
                                                      }
                                                    },
                                                    error:function(error,status){
                                                   //   window.wizSpinner.hide();
                                                      navigator.notification.alert(error.responseText)
                                                    }
                                              });
                                            },
                                            error:function(error){
                                            //  window.wizSpinner.hide();
                                              navigator.notification.alert(error.responseText)
                                            }
                                          });
                                        }else {
                                         // window.wizSpinner.hide();
                                          navigator.notification.alert("Login Error!");
                                        }
                                    }
                                  });
                                 
                              },function(data){
                                //  window.wizSpinner.hide();
                                  console.log("ERROR: "+JSON.stringify(data));
                              }

                          );
                      }
                      else {
                          oauth = OAuth(options);
                          oauth.get('https://api.twitter.com/oauth/request_token',
                              function(data) {
                                  requestParams = data.text;
                                  ref = window.open('https://api.twitter.com/oauth/authorize?'+data.text, '_blank', 'location=no,toolbar=no');
                                  ref.addEventListener('loadstop', function(event) { Twitter.success(event.url);});
                              },
                              function(data) {
                                  console.log("ERROR: "+data);
                              }
                         
                          );
                      }
                },
                success:function(loc){
                            if (loc.indexOf("http://nuatransmedia.com/?") >= 0) {
                                var index, verifier = '';
                                var params = loc.substr(loc.indexOf('?') + 1);
                                 
                                params = params.split('&');
                                for (var i = 0; i < params.length; i++) {
                                    var y = params[i].split('=');
                                    if(y[0] === 'oauth_verifier') {
                                        verifier = y[1];
                                    }
                                }
                                oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+verifier+'&'+requestParams,
                                          function(data) {
                                          var accessParams = {};
                                          var qvars_tmp = data.text.split('&');
                                          for (var i = 0; i < qvars_tmp.length; i++) {
                                          var y = qvars_tmp[i].split('=');
                                          accessParams[y[0]] = decodeURIComponent(y[1]);
                                          }
                                           
                                          
                                          oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
                                          var accessData = {};
                                          accessData.accessTokenKey = accessParams.oauth_token;
                                          accessData.accessTokenSecret = accessParams.oauth_token_secret;
                                          console.log("TWITTER: Storing token key/secret in localStorage");
                                          localStorage.setItem(twitterKey, JSON.stringify(accessData));
                                           
                                          oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
                                                  function(data) {
                                                    var entry = JSON.parse(data.text);
                                                    //console.log("TWITTER USER: "+JSON.stringify(entry));
                                                //    window.wizSpinner.show(options);
                                                    $.ajax({
                                                        type: "POST",
                                                        url: "http://build.myappbuilder.com/api/login.json",
                                                        data:{'uid':entry.id,'provider':"twitter"},
                                                        success:function(response){
                                                          appkeyResult = response;
                                                          $.ajax({
                                                                type: "GET",
                                                                url: "http://build.myappbuilder.com/api/users.json",
                                                                data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                                                                cache: false,
                                                                success:function(response){
                                                               //   window.wizSpinner.hide();
                                                                  appList = response;
                                                                  localStorage["login"] = JSON.stringify(appkeyResult);
                                                                  if(listGrid == ''){
                                                                    $state.go('bookShelf');
                                                                  }else if(listGrid == 'list'){
                                                                    $state.go('listView');
                                                                  }else{
                                                                    $state.go('bookShelf');
                                                                  }
                                                                },
                                                                error:function(error,status){
                                                               //   window.wizSpinner.hide();
                                                                  navigator.notification.alert(error.responseText)
                                                                }
                                                          });
                                                        },
                                                        error:function(error){
                                                            var error = JSON.parse(error.responseText);
                                                            if(error.error == "Unauthorized"){
                                                              //navigator.notification.alert("Please Check Your UserId or Password!")
                                                              $.ajax({
                                                                type: "POST",
                                                                url: "http://build.myappbuilder.com/api/users.json",
                                                                data:{'name':entry.name,'username':entry.screen_name,'identity[uid]':entry.id,'identity[provider]':'twitter'},
                                                                cache:false,
                                                                success:function(response){
                                                                  appkeyResult = response;
                                                                  //alert(appkeyResult.api_key);
                                                                  $.ajax({
                                                                        type: "GET",
                                                                        url: "http://build.myappbuilder.com/api/users.json",
                                                                        data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                                                                        cache: false,
                                                                        success:function(response){
                                                                       //   window.wizSpinner.hide();
                                                                          appList = response;
                                                                          localStorage["login"] = JSON.stringify(appkeyResult);
                                                                          if(listGrid == ''){
                                                                            $state.go('bookShelf');
                                                                          }else if(listGrid == 'list'){
                                                                            $state.go('listView');
                                                                          }else{
                                                                            $state.go('bookShelf');
                                                                          }
                                                                        },
                                                                        error:function(error,status){
                                                                      //    window.wizSpinner.hide();
                                                                          navigator.notification.alert(error.responseText)
                                                                        }
                                                                  });
                                                                },
                                                                error:function(error){
                                                                //  window.wizSpinner.hide();
                                                                  navigator.notification.alert(error.responseText)
                                                                }
                                                              });
                                                            }else {
                                                          //    window.wizSpinner.hide();
                                                              navigator.notification.alert("Login Error!");
                                                            }
                                                        }
                                                      });
                                                  
                                                  },
                                                  function(data) {
                                                   // window.wizSpinner.hide();
                                                    console.log("ERROR: " + data);
                                                  }
                                          );
                                          ref.close();
                                          },
                                          function(data) {
                                            console.log("Hello: :-"+data);
                                            ref.close();
                                          }
                                );
                            }
                            else {
                                //ref.close();
                            }
                        }
 
                    }

                    Twitter.init();
  }

  $scope.googleLogin = function(){
    var googleapp = {
      client_id: "912532492266-10ivhj0e821bs1g3vm7egqv4unubt364.apps.googleusercontent.com",
      client_secret: "dljPcfIJVxpU1Tnb4GhaWBYp",
      redirect_uri: "http://localhost",
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
      init: function() {
         
          googleapi.getToken({
                             client_id: this.client_id,
                             client_secret: this.client_secret
                             }).done(function() {
                                     googleapp.showGreetView();
                  
                                     }).fail(function() {
                                             googleapp.showLoginView();
                                             });
      },
      showLoginView: function() {
    
      },
      showGreetView: function() {
            googleapi.getToken({
                             client_id: this.client_id,
                             client_secret: this.client_secret
                             }).then(function(data) {
                                     return googleapi.userInfo({ access_token: data.access_token });
                                     }).done(function(user) {
                                            var res = JSON.stringify(user);
                                            console.log(res);
                                           //  window.wizSpinner.show(options);
                                                    $.ajax({
                                                        type: "POST",
                                                        url: "http://build.myappbuilder.com/api/login.json",
                                                        data:{'uid':user.id,'provider':"google_oauth2"},
                                                        success:function(response){
                                                          appkeyResult = response;
                                                          $.ajax({
                                                                type: "GET",
                                                                url: "http://build.myappbuilder.com/api/users.json",
                                                                data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                                                                cache: false,
                                                                success:function(response){
                                                               //   window.wizSpinner.hide();
                                                                  appList = response;
                                                                  localStorage["login"] = JSON.stringify(appkeyResult);
                                                                  if(listGrid == ''){
                                                                    $state.go('bookShelf');
                                                                  }else if(listGrid == 'list'){
                                                                    $state.go('listView');
                                                                  }else{
                                                                    $state.go('bookShelf');
                                                                  }
                                                                },
                                                                error:function(error,status){
                                                               //   window.wizSpinner.hide();
                                                                  navigator.notification.alert(error.responseText)
                                                                }
                                                          });
                                                        },
                                                        error:function(error){
                                                            var error = JSON.parse(error.responseText);
                                                            if(error.error == "Unauthorized"){
                                                              $.ajax({
                                                                type: "POST",
                                                                url: "http://build.myappbuilder.com/api/users.json",
                                                                data:{'name':user.name,'username':user.name,'identity[uid]':user.id,'identity[provider]':'google_oauth2'},
                                                                cache:false,
                                                                success:function(response){
                                                                  appkeyResult = response;
                                                                  //alert(appkeyResult.api_key);
                                                                  $.ajax({
                                                                        type: "GET",
                                                                        url: "http://build.myappbuilder.com/api/users.json",
                                                                        data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                                        cache: false,
                                                                        success:function(response){
                                                                      //    window.wizSpinner.hide();
                                                                          appList = response;
                                                                          localStorage["login"] = JSON.stringify(appkeyResult);
                                                                          if(listGrid == ''){
                                                                            $state.go('bookShelf');
                                                                          }else if(listGrid == 'list'){
                                                                            $state.go('listView');
                                                                          }else{
                                                                            $state.go('bookShelf');
                                                                          }
                                                                        },
                                                                        error:function(error,status){
                                                                       //   window.wizSpinner.hide();
                                                                          navigator.notification.alert(error.responseText)
                                                                        }
                                                                  });
                                                                },
                                                                error:function(error){
                                                               //   window.wizSpinner.hide();
                                                                  navigator.notification.alert(error.responseText)
                                                                }
                                                              });
                                                            }else {
                                                           //   window.wizSpinner.hide();
                                                              navigator.notification.alert("Login Error!");
                                                            }
                                                        }
                                                      });
                                             
                                             }).fail(function() {
                                                     googleapp.showLoginView();
                                                     });
      },

    };
    googleapp.init();
    googleapi.authorize({
                        client_id: "912532492266-10ivhj0e821bs1g3vm7egqv4unubt364.apps.googleusercontent.com",
                        client_secret: "dljPcfIJVxpU1Tnb4GhaWBYp",
                        redirect_uri: "http://localhost",
                        scope: 'https://www.googleapis.com/auth/userinfo.profile'
                        }).done(function() {
                                //Show the greet view if access is granted
                                googleapp.showGreetView();
                               
                                }).fail(function(data) {
                                        //Show an error message if access was denied
                                        console.log(data.error);
                                        });
  }





});

app.controller('registerCtrl', function($scope, $state,$ionicLoading) {
  $scope.registerPageSubmitFtn = function(){
  	 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });

  //  window.wizSpinner.show(options);
    var Name = $('#regName').val();
    var regUserId = $('#regUserId').val();
    var regEmail = $('#regEmail').val();
    var regPassword = $('#regPassword').val();
    var regConfirmPassword = $('#regConfirmPassword').val();
    
    $.ajax({
      type: "POST",
      url: "http://build.myappbuilder.com/api/users.json",
      data:{'name':Name,'username':regUserId,'email':regEmail,'password':regPassword,'password_confirmation':regConfirmPassword},
      cache:false,
      success:function(response){
        //alert("sucee: "+JSON.stringify(response));
          appkeyResult = response;

          $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/users.json",
                  data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                  cache: false,
                  success:function(response){
                  	$ionicLoading.hide();
                   // window.wizSpinner.hide();
                    appList = response;
                    localStorage["login"] = JSON.stringify(appkeyResult);
                    if(listGrid == ''){
                      $state.go('bookShelf');
                    }else if(listGrid == 'list'){
                      $state.go('listView');
                    }else{
                      $state.go('bookShelf');
                    }
                  },
                  error:function(error,status){
                  	$ionicLoading.hide();
                 //   window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText)
                  }
          });
      },
      error:function(error,status){
      	$ionicLoading.hide();
        //  window.wizSpinner.hide();
          navigator.notification.alert(error.responseText);
      }
    });
  }

  $scope.registerBack = function(){
    $state.go('login');
  }

});

app.filter('inSlicesOf', 
    ['$rootScope',  
    function($rootScope) {
      makeSlices = function(items, count) { 
        if (!count)            
          count = 3;
        
        if (!angular.isArray(items) && !angular.isString(items)) return items;
        
        var array = [];
        for (var i = 0; i < items.length; i++) {
          var chunkIndex = parseInt(i / count, 10);
          var isFirst = (i % count === 0);
          if (isFirst)
            array[chunkIndex] = [];
          array[chunkIndex].push(items[i]);
        }

        if (angular.equals($rootScope.arrayinSliceOf, array))
          return $rootScope.arrayinSliceOf;
        else
          $rootScope.arrayinSliceOf = array;
          
        return array;
      };
      
      return makeSlices; 
    }]
  )

app.controller('bookShelfCtrl',function($scope, $state, $ionicModal,$ionicLoading){
  //var keyArray = [{appKey : appKey}];
 // window.wizSpinner.show(options);
 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });
	
		var listarr=[];
	for(var j=0;j<appList.length;j++)
	{
	
        for(var s=0;s<(appList[j].apps).length;s++)
        {       

        	 if((appList[j].apps[s].app_image) == null){
     			 appList[j].apps[s].app_image = "img/book.png";

     			// alert(JSON.stringify(appList[j].apps));
     			
   			 }
		listarr.push(appList[j].apps);
        }
	}

	
		$ionicLoading.hide();
  $scope.appKey = appList[0].apps;


/*	
alert(JSON.stringify(appList));
  for(var i =0;i<(appList).length;i++){
    if((appList[i]).app_image == null){
    	console.log("null part work");

      (appList[i]).app_image = "img/book.png";

      	console.log("sample img= "+JSON.stringify(appList[i].app_image));

    }

   
  }  
 alert("apps list arr=== "+JSON.stringify(appList[i].apps));
  $scope.appKey = appList[i].apps;
  */


  $scope.bookShelfBack = function(){
    //localStorage["login"] = [];
    localStorage.clear();
    openFB.revokePermissions(function() {console.log('Permissions revoked');},function(error){console.log(error.message);});
    //window.localStorage.removeItem(twitterKey);
    $state.go('login');
    //window.history.back();
  }

  $scope.bookShelfCreate = function(){
    $state.go('createApp');
  }
  
  $scope.listCallFtn = function(){

    listGrid = 'list';
    $state.go('listView');
  }

  $scope.bookShelfClickFtn = function(appId,tit){

    appKey = appId;
   $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });
   // window.wizSpinner.show(options);
    $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/buttons.json",
                  data:{'api_key':appId},
                  cache: false,
                  success:function(response){
                  
                  
         $ionicLoading.hide();
                 //   window.wizSpinner.hide();
                    //alert(JSON.stringify(response))
                    buttonArray = response;
                   $state.go('buttonPage');
                  },
                  error:function(error,status){
                  	        $ionicLoading.hide();
                  //  window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText)
                  }
    });
  }

});

app.controller('listViewCtrl', function($scope, $state, $ionicModal,$ionicLoading){
  

  /* for(var i =0;i<(appList.apps).length;i++){
    if((appList.apps[i]).app_image == null){
      (appList.apps[i]).app_image = "img/book.png";
    }
  }  */


	
        for(var s=0;s<(appList[0].apps).length;s++)
        {       

        	 if((appList[0].apps[s].app_image) == null){
     			 appList[0].apps[s].app_image = "img/book.png";

     			// alert(JSON.stringify(appList[j].apps));
     			
   			 }
		
		}
  $scope.appKey = appList[0].apps;


  $scope.listViewBack = function(){
    localStorage["login"] = [];
    
    openFB.revokePermissions(function() {console.log('Permissions revoked');},function(error){console.log(error.message);});
    window.localStorage.removeItem(twitterKey);
    $state.go('login');
    //window.history.back();
  }

  $scope.listViewCreate = function(){
    $state.go('createApp');
  }
  
  $scope.gridCallFtn = function(){
    listGrid = 'grid';
    $state.go('bookShelf');
  }

  $scope.deleteApp = function(appId,item){
 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });

   // window.wizSpinner.show(options);
    $.ajax({
                  type: "DELETE",
                  url: "http://build.myappbuilder.com/api/apps.json",
                  data:{'api_key':appkeyResult.api_key,'book_api_key':appId},
                  cache: false,
                  success:function(response){

                    $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/users.json",
                          data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                          cache: false,
                          success:function(response){
                          	$ionicLoading.hide();
                        //    window.wizSpinner.hide();
                            appList = response;
                            $scope.appKey.splice($scope.appKey.indexOf(item), 1);
                            $state.reload();
                          },
                          error:function(error,status){
                          	$ionicLoading.hide();
                         //   window.wizSpinner.hide();
                            navigator.notification.alert(error.responseText);
                          }
                    });
                  },
                  error:function(error,status){
                   // window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText)
                  }
    });
  }

  $scope.editApp = function(appId){
    appKey = appId;
    $state.go('editApp');
  }

  $scope.listViewClickFtn = function(appId,appTit){

    appKey = appId;
    appTitle = appTit;
    $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });
   // window.wizSpinner.show(options);
    $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/buttons.json",
                  data:{'api_key':appId},
                  cache: false,
                  success:function(response){
                  	$ionicLoading.hide();
                  //  window.wizSpinner.hide();
                    //alert(JSON.stringify(response))
                    buttonArray = response;
                    $state.go('buttonPage');
                  },
                  error:function(error,status){
                  	$ionicLoading.hide();
                  //  window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText)
                  }
    });
  }
});

app.controller('createAppCtrl', function($scope, $state, $ionicModal,$ionicLoading){
    $scope.createAppBack = function(){
      if(listGrid == ''){
        $state.go('bookShelf');
        
      }else if(listGrid == 'list'){
        $state.go('listView');
        
      }else{
        $state.go('bookShelf');
        
      }
    }

    $scope.createAppFtn = function(){
      var bookTitle = $('#bookTitle').val();
      var bookDesc = $('#bookDesc').val();
      //alert(JSON.stringify(appkeyResult));
    //  window.wizSpinner.show(options);
    $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });
      $.ajax({
          type: "POST",
          url: "http://build.myappbuilder.com/api/apps.json",
          data:{'api_key':appkeyResult.api_key,'title':bookTitle,'description':bookDesc},
          success:function(response){
            $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/users.json",
                  data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                  cache: false,
                  success:function(response){
                  	$ionicLoading.hide();
               //     window.wizSpinner.hide();
                    appList = response;
                    //localStorage["login"] = JSON.stringify(appkeyResult);
                    if(listGrid == ''){
                      $state.go('bookShelf');
                    }else if(listGrid == 'list'){
                      $state.go('listView');
                    }else{
                      $state.go('bookShelf');
                    }
                  },
                  error:function(error,status){
                  	$ionicLoading.hide();
                  //  window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText)
                  }
            });
          },
          error:function(error){
            navigator.notification.alert(error.responseText)
          }
      });
    }
});


app.controller('editAppCtrl', function($scope,$state,$ionicLoading){
  $scope.bookEditSubmitFtn = function(){

  	 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });
    var bookTitleEdit = $('#bookTitleEdit').val();
    var bookDesEdit = $('#bookDesEdit').val();
    
    var formData = new FormData();
    formData.append('api_key',appKey);
    formData.append('title',bookTitleEdit);
    formData.append('description',bookTitleEdit);
    //formData.append('application_image', $('#bookImageEdit').get(0).files[0]);
   // alert($('#bookImageEdit').get(0).files[0]);
   // window.wizSpinner.show(options);

    $.ajax({
          type: "PUT",
          url: "http://build.myappbuilder.com/api/apps/settings/general.json",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success:function(response){
$ionicLoading.hide();
            //window.wizSpinner.hide();
            $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/users.json",
                  data:{'api_key':appkeyResult.api_key,'username':appkeyResult.username},
                  cache: false,
                  success:function(response){
                  	$ionicLoading.hide();
                   // window.wizSpinner.hide();
                    appList = response;
                    $state.go('listView');
                  },
                  error:function(error,status){
                  	$ionicLoading.hide();
                  //  window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText);
                  }
            });
          },
          error:function(error,status){
          	$ionicLoading.hide();
         //   window.wizSpinner.hide();
            navigator.notification.alert(error.responseText);
          }
    });
  }

  $scope.bookEditBack = function(){
      $state.go('listView');
  }

});

app.controller('buttonPageCtrl', function($scope, $state, $ionicModal,$ionicLoading) {
    
 
    $scope.items = buttonArray;
    $scope.appTitle = appTitle;


    $scope.buttonPageBack = function(){
      if(listGrid == ''){
          $state.go('bookShelf');
      }else if(listGrid == 'list'){
          $state.go('listView');
      }else{
          $state.go('bookShelf');
      }
    }

    $scope.buttonCreate = function(){
      $state.go('buttonCreate');
    }

    $scope.imageClickFtn = function(btnId){
      document.location.href="#/elementPage/"+btnId;
    }
    $scope.buttonEditCall = function(btnId){
      buttonId = btnId;
      $state.go('buttonEdit');
    }
    $scope.buttonDeleteCall = function(btnId){
    	 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });
     // window.wizSpinner.show(options);
      $.ajax({
                  type: "DELETE",
                  url: "http://build.myappbuilder.com/api/buttons.json",
                  data: {"api_key":appKey,"id":btnId},
                  cache: false,
                  success:function(response){
                    $.ajax({
                        type: "GET",
                        url: "http://build.myappbuilder.com/api/buttons.json",
                        data:{'api_key':appKey},
                        cache: false,
                        success:function(response){
                          buttonArray= response;
                          $scope.items = buttonArray;
                          $ionicLoading.hide();
                          $state.reload();
                          setTimeout(function(){ }, 1000);
                        },
                        error:function(error,status){
                        	 $ionicLoading.hide();
                         // window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText);
                        }
                    });
                  },
                  error:function(error,status){
                  	 $ionicLoading.hide();
                    //  window.wizSpinner.hide();
                      navigator.notification.alert(error.responseText)
                  }
      });
    }


    /*$ionicModal.fromTemplateUrl('modal.html', function(modal) {
        $scope.modal = modal;
      }, {
        animation: 'slide-in-up',
        focusFirstInput: true
      });*/
});







//var filesToUpload = input.files;
//var file = filesToUpload[0];









app.controller('buttonCreateCtrl',function($scope, $state, $ionicModal,$ionicLoading){
  $scope.buttonCreateBack = function(){
    $state.go('buttonPage');
  }
  
  
  $scope.buttonSubmitFtn = function(){
    
 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });


    var buttonTitle = $('#buttonTitle').val();
    var formData = new FormData();
    formData.append('api_key',appKey);
    formData.append('title',buttonTitle);

    /*var img = document.createElement("img");
    var reader = new FileReader();  
    reader.onload = function(e) {img.src = e.target.result}
    reader.readAsDataURL($('#buttonImage').get(0).files[0]);
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    canvas.width = 57;
    canvas.height = 57;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 57, 57);

    var dataurl = canvas.toDataURL("image/png");
    alert(dataurl);
    formData.append('image', dataurl);*/
    
    formData.append('image', $('#buttonImage').get(0).files[0]);
   // window.wizSpinner.show(options);


    if((buttonTitle != null)&&(buttonTitle != '')){
      
      $.ajax({
          type: "POST",
          url: "http://build.myappbuilder.com/api/buttons.json",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success:function(response){
           $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/buttons.json",
                  data:{'api_key':appKey},
                  cache: false,
                  success:function(response){
                  	$ionicLoading.hide();
                   // window.wizSpinner.hide();
                    buttonArray= response;

                    $state.go('buttonPage');
                    
                  },
                  error:function(error,status){
                  	$ionicLoading.hide();
                 //   window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText);
                  }
            });
          },
          error:function(error,status){
          	$ionicLoading.hide();
           // window.wizSpinner.hide();
            navigator.notification.alert("error: "+error.responseText);
          }
      });
    }else{
    	$ionicLoading.hide();
     // window.wizSpinner.hide();
      navigator.notification.alert("Please Enter Title");
    }
  }
});



app.controller('buttonEditCtrl',function($scope,$state,$ionicLoading){
  $scope.buttonEditBack = function(btnId){
    $state.go("buttonPage");
  }

  $scope.buttonEditSubmitFtn = function(){
   // window.wizSpinner.show(options);
    $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });

    var editTitle = $('#buttonTitleEdit').val();
    var formData = new FormData();
    formData.append('api_key',appKey);
    formData.append('id',buttonId);
    formData.append('title',editTitle);
    formData.append('image', $("#buttonImageEdit").get(0).files[0]);
    $.ajax({
          type: "PUT",
          url: "http://build.myappbuilder.com/api/buttons.json",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success:function(response){
            $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/buttons.json",
                  data:{'api_key':appKey},
                  cache: false,
                  success:function(response){
                  	$ionicLoading.hide();
                //    window.wizSpinner.hide();
                    buttonArray= response;
                    $state.go('buttonPage');
                  },
                  error:function(error,status){
                  	$ionicLoading.hide();
                  //  window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText);
                  }
            });
          },
          error:function(error,status){
          	$ionicLoading.hide();
          //  window.wizSpinner.hide();
            navigator.notification.alert("error: "+error.responseText);
          }
    });
  }

  
});



app.controller('elementPageCtrl',function($scope,$state, $stateParams,$ionicLoading){
  if(($stateParams.buttonId != null )&&($stateParams.buttonId != '')){
    buttonId = $stateParams.buttonId;
  }
  
  for (var i = 0; i < buttonArray.length; i++) {
    if(buttonArray[i].id == buttonId){
        elementArray = buttonArray[i].elements;
        $scope.chapterTitle = buttonArray[i];
    }
  }
  $scope.elements = elementArray;
  $scope.contentViewCall = function(eleId){
    elementId = eleId;
    $state.go("contentView");
  }
  $scope.elementBack = function(){
    $state.go("buttonPage");
  }

  $scope.elementCreate = function(){
    $state.go("elementCreate");
  }

  $scope.elementEditCall= function(eleId){
    //navigator.notification.alert(elementId)
    elementId = eleId;
    $state.go("elementEdit");
  }

  $scope.elementDeleteCall = function(eleId){
  	 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });

  //  window.wizSpinner.show(options);
    $.ajax({
      type: "DELETE",
      url: "http://build.myappbuilder.com/api/elements.json",
      data: {"api_key":appKey,"id":eleId},
      cache: false,
      success:function(response){
        $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/buttons.json",
                  data:{'api_key':appKey},
                  cache: false,
                  success:function(response){
                    buttonArray = response;
                    for (var i = 0; i < buttonArray.length; i++) {
                      if(buttonArray[i].id == buttonId){
                          $scope.elements = buttonArray[i].elements;
                          $scope.chapterTitle = buttonArray[i];
                           $ionicLoading.hide();
                          $state.reload();
                          setTimeout(function(){}, 1000);
                      }
                    }
                    
                    //window.location.href="#/elementPage/"+buttonId;
                    
                  },
                  error:function(error,status){
                   
                    navigator.notification.alert(error.responseText);
                  }
        });              
      },
      error:function(error,status){
       
        navigator.notification.alert(error.responseText)
      }
    });
  }

});


app.controller('elementCreateCtrl',function($scope,$state,$ionicLoading,$http){

  $scope.elementCreateBack = function(){
    $state.go('elementPage');
  }
  

  $scope.elementCreateSubmitFtn = function(){
   

  	 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });

 //   window.wizSpinner.show(options);
    var elementTitle = $('#elementTitle').val();

    var elementText = $('#elementText').val();
    var elementPrice = $('#elementPrice').val();
  

/*
    var formData1 = new FormData();
    formData1.append('api_key',appKey);
    formData1.append('button_id',buttonId);
    formData1.append('title',elementTitle);
    formData1.append('text',elementText);

    for(var i=0;i<($("#elementImage").get(0).files).length;i++){

    //	alert($("#elementImage").get(0).files[i]);

      //formData1.append('images[]', $("#elementImage").get(0).files[i]);
    }

    formData1.append('price',elementPrice);
*/


 $http({method: "POST", url:"http://build.myappbuilder.com/api/elements/create_default.json", cache: false, params:{"api_key":appKey,"button_id":buttonId,"title":elementTitle,"text":elementText,"price":elementPrice}})
                   
                   .success(function(data, status, headers, config) {    

                             
                           $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/buttons.json",
                  data:{'api_key':appKey},
                  cache: false,
                  success:function(response){
                       $ionicLoading.hide();
                    //window.wizSpinner.hide();
                    buttonArray = response;
                    $state.go('elementPage');
                  },
                  error:function(error,status){
                       $ionicLoading.hide();
                 //   window.wizSpinner.hide();

                    navigator.notification.alert(error.responseText);
                  }
          });
                            })

                   .error(function(data, status, headers, config) {
                          alert(JSON.stringify(data));
                          $ionicLoading.hide();
                          
                          });

 /*   $.ajax({
        type: "POST",
        url: "http://build.myappbuilder.com/api/elements/create_default.json",
        data: {"api_key":appKey,"button_id":buttonId,"title":elementTitle,"text":elementText,"price":elementPrice},
        cache: false,
        contentType: false,
        processData: false,
        success:function(response){
          alert(JSON.stringify(response));
        	
          $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/buttons.json",
                  data:{'api_key':appKey},
                  cache: false,
                  success:function(response){
                  		 $ionicLoading.hide();
                    //window.wizSpinner.hide();
                    buttonArray = response;
                    $state.go('elementPage');
                  },
                  error:function(error,status){
                  		 $ionicLoading.hide();
                 //   window.wizSpinner.hide();

                    navigator.notification.alert(error.responseText);
                  }
          });
          
        },
        error:function(error,status){
        		 $ionicLoading.hide();
       //   window.wizSpinner.hide();
         alert("status"+status);
          navigator.notification.alert("error: "+error.responseText);
        }
    });

*/

  }
});

app.controller('elementEditCtrl',function($scope,$state,$ionicLoading){
  $scope.elementEditBack = function(){
    $state.go('elementPage');
  }
  $scope.elementEditSubmitFtn = function(){

  	 $ionicLoading.show({
       template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
     });

  //  window.wizSpinner.show(options);
    var editTitle = $('#editTitle').val();
    var editText = $('#editText').val();
    var editPrice = $('#editPrice').val();
    $.ajax({
          type: "PUT",
          url: "http://build.myappbuilder.com/api/elements/update_default.json",
          data: {"api_key":appKey,"id":elementId,"title":editTitle,"text":editText,"price":editPrice},
          cache: false,
          success:function(response){
            $.ajax({
                  type: "GET",
                  url: "http://build.myappbuilder.com/api/buttons.json",
                  data:{'api_key':appKey},
                  cache: false,
                  success:function(response){
                  	 $ionicLoading.hide();
                  //  window.wizSpinner.hide();
                    buttonArray = response;
                    $state.go('elementPage');
                  },
                  error:function(error,status){
                  		 $ionicLoading.hide();
                  //  window.wizSpinner.hide();
                    navigator.notification.alert(error.responseText);
                  }
            });
          },
          error:function(error,status){
          		 $ionicLoading.hide();
         //   window.wizSpinner.hide();
            navigator.notification.alert("error: "+error.responseText);
          }
    })
  }
});

app.controller('contentViewCtrl', function($scope,$state,$ionicLoading){
  for (var i = 0; i < elementArray.length; i++) {
    if(elementArray[i].id == elementId){
        contentData = elementArray[i].text;
        $scope.contentTitle = elementArray[i];
    }
  }
  
  $scope.description = contentData;

  $scope.contentViewBack = function(){
    $state.go('elementPage');
    document.location.href="#/elementPage/"+buttonId;
  }
});