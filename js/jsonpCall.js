//Method : Helper to call the facebook api.
function jsonCall(){

    var self = this;

    self.open = function(url, callbackMethod){

        var script = document.createElement('script');
        script.src = '{0}&callback={1}'.format(url, callbackMethod);

        document.getElementsByTagName('head')[0].appendChild(script);
    };
}