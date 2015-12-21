//Application controller
function application(previousButton, nextButton, container) {

    var self = this;
    var searchText;
    var pageClickedId;
    var callTimeOut = 50;
    var jsonCallHelper;
    var initiateCallTimeOut = null;

    self.callbackFunction = function(data){};

    self.onPreviousClick = function () {
        if(initiateCallTimeOut !== null)
        {
            clearTimeout(initiateCallTimeOut);
        }

        initiateCallTimeOut = setTimeout(function(){
            self.initiateCall(document.getElementById(previousButton).getAttribute('URL'));
        }, callTimeOut);
    };

    self.onNextClick = function () {
        if(initiateCallTimeOut !== null)
        {
            clearTimeout(initiateCallTimeOut);
        }

        initiateCallTimeOut = setTimeout(function(){
            self.initiateCall(document.getElementById(nextButton).getAttribute('URL'));
        }, callTimeOut);
    };

    self.callback = function (apiData) {

        function ShowHideButton(btnName, btnParameter) {
            if (btnParameter !== null && btnParameter !== undefined) {

                document.getElementById(btnName).setAttribute('URL', btnParameter);
                document.getElementById(btnName).setAttribute('style', 'display:block;');
            } else {
                document.getElementById(btnName).setAttribute('style', 'display:none;');
            }
        };

        if(apiData === null || apiData === undefined)
            return;

        if(apiData.paging !== undefined) {
            ShowHideButton(nextButton, apiData.paging.next);
            ShowHideButton(previousButton, apiData.paging.previous);
        }

        var contentInnerHTML;
        for (var count = 0; apiData.data.length > count; count++) {
            var itemHtml = "<li>" +
                            "<a href='https://facebook.com/{0}'>" +
                                "<span><img src='https://graph.facebook.com/{0}/picture?type=square' width='100' height='100'></span>" +
                                "<span>{1}</span>" +
                            "</a>" +
                            "<div>" +
                                "<a id='link{0}' href='javascript:void(0);' pageId='{0}' onclick='onItemMoreClick(this)' style='text-align:right; '>more...</a>" +
                            "</div>" +
                            "<ul id='{0}'></ul>" +
                        "</li>";

            itemHtml = itemHtml.format(apiData.data[count].id, apiData.data[count].name);

            if (contentInnerHTML != undefined) {
                contentInnerHTML = contentInnerHTML + itemHtml;
            } else {
                contentInnerHTML = itemHtml;
            }
        }

        apiData = null;

        if(contentInnerHTML !== undefined) {
            document.getElementById(container).innerHTML = contentInnerHTML;
        }else{
            document.getElementById(container).innerHTML = "<li>No search result found!</li>";
        }
    };

    self.onMoreClick = function (pageId){

        pageClickedId = pageId;
        var pageURL = "https://graph.facebook.com/{0}/posts?access_token=447666115425084|fO_ZAUGlVVpx3L8dhglwkI5DZcY".format(pageId);
        self.callbackFunction = self.callbackMore;
        jsonCallHelper.open(pageURL, 'callback');
    };

    self.callbackMore = function(apiData){

        var contentInnerHTML;
        for (var count = 0; apiData.data.length > count; count++) {

            if(apiData.data[count].message !== null && apiData.data[count].message !== undefined) {

                console.log("Message", apiData.data[count].message);
                var itemHtml = "<li>{0}</li>".format(apiData.data[count].message);

                itemHtml = itemHtml.format(apiData.data[count].message);

                if (contentInnerHTML != undefined) {
                    contentInnerHTML = contentInnerHTML + itemHtml;
                } else {
                    contentInnerHTML = itemHtml;
                }
            }
        }

        if(apiData.data.length > 0) {

            console.log('Element Id', apiData.data[0].id.substr(0,apiData.data[0].id.indexOf('_')));
            document.getElementById(apiData.data[0].id.substr(0,apiData.data[0].id.indexOf('_'))).innerHTML = contentInnerHTML;
        }else{

            document.getElementById(pageClickedId).innerHTML = "<li>No post found!</li>";
        }

        document.getElementById('link{0}'.format(pageClickedId)).setAttribute('style', 'display:none;');

        apiData = null;
    };

    self.initiateCall = function (url, searchFor) {

        self.callbackFunction = self.callback;
        if(searchFor !== null && searchFor !== undefined) {
            searchText = searchFor;
            url = url.format(searchFor);
        }

        jsonCallHelper.open(url, 'callback');
    };

    function init(){

        jsonCallHelper = new jsonCall();
        self.callbackFunction = self.callback;
    };

    init();
}