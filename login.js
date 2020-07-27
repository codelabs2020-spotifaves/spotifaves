(function() {

    function login(callback) {
        var CLIENT_ID = '73892e8f2c464227acc8a6fa82c2fd17';
        var REDIRECT_URI = 'http://jmperezperez.com/spotify-oauth-jsfiddle-proxy/proxy.html';
        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
        }

        var url = getLoginURL([
            'user-read-email','user-top-read'
        ]);

        var width = 450,
            height = 730,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);

        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);

        var w = window.open(url,
                            'Spotify',
                            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                           );

    }


    function beautifyData(response) {
    	for (var i = 0; i < 10; i++) {
        var minutes = "" + (response.items[i].duration_ms /  60000) | 0;
        var seconds = "" + (response.items[i].duration_ms  % 60000 / 1000) | 0;
        if (seconds == 0) {
        		seconds = "00";
				}


        response.items[i].time = minutes + ":" + seconds;

      }
      return response;
		}

    function getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=long_term',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            }
        });
    }

    var templateSource = document.getElementById('result-template').innerHTML,
        template = Handlebars.compile(templateSource),
        resultsPlaceholder = document.getElementById('result'),
        loginButton = document.getElementById('btn-login');

    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                		console.log(response);
                    loginButton.style.display = 'none';
                   	resultsPlaceholder.innerHTML = template(beautifyData(response));


                });
            });
    });

})();
