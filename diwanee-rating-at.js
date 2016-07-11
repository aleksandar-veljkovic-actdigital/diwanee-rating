$(function () {


  var svg = "  \n\
    <svg style='position: absolute; width: 0; height: 0;' width='0' height='0' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> \n\
      <defs> \n\
        <symbol id='voting-star-polygon' viewBox='0 0 21 21'> \n\
          <polygon class='path1' points=' \n\
                   10.000,15.000 \n\
                   15.878,18.090 \n\
                   14.755,11.545 \n\
                   19.511,6.910 \n\
                   12.939,5.955 \n\
                   10.000,0.000 \n\
                   7.061,5.955 \n\
                   0.489,6.910 \n\
                   5.245,11.545 \n\
                   4.122,18.090 \n\
                   10.000,15.000 \n\
                   '  /> \n\
        </symbol> \n\
        <linearGradient id='voting-star-gradient' x1='0%' y1='0%' x2='100%' y2='0%'> \n\
          <stop offset='20%' style='stop-color:silver;stop-opacity:1' /> \n\
          <stop offset='100%' style='stop-color:gold;stop-opacity:1' /> \n\
        </linearGradient> \n\
      </defs> \n\
    </svg> ";
  $('body').append($(svg));
  
  
  // fixing svg firefox
  var cssFirefoxFix = "<style> .half:not(.full) > .voting-star {  fill: url('#voting-star-gradient');} </style>";
  $('head').append($(cssFirefoxFix));  
  // eof 

  var fp = Math.floor((Math.random() * 10000) + 1);
  var apiKey = window.appApiKey;
  var $ratings = $('.b-rating');  // all ratings on page
  
  // template
  var stars = "";
  for (i = 0; i < 5; i++) { 
      stars += '<li class="b-rating__item"><svg class="voting-star"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#voting-star-polygon"></use></svg></li>';
  }
  $ratings.append(stars);  

  // Print Rating
  printRating = function ($rateList, mark) {
    var $items = $rateList.children('li');
    var grade = (mark / 2) + 0.4999;
    $items.removeClass('half');
    $items.removeClass('full');
    $items.each(function (i, item) {
      if (i < Math.round(grade)) {
        $(item).addClass('half');
      }
      if (i < Math.floor(grade)) {
        $(item).addClass('full');
      }
    });
  };


  // Single Item Data Fetch
  var singleFetch = function ($rateList) {
    var uuid = (!!$rateList.data('uuid')) ? "&itemUuid=" + $rateList.data('uuid') : "";
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      //url: "https://st-api.diwanee.net/v1/ratings/item.js/" + $rateList.data('id') + "/rate/avg?api_key=n3D2K5DcSnJ4ntpMmRQ2qL9G81nHpij4",
      url: "https://st-api.diwanee.net/v1/ratings/item.js/" + $rateList.data('id') + "/rate/avg?api_key=n3D2K5DcSnJ4ntpMmRQ2qL9G81nHpij4" + uuid,
      cache: false,
      async: true,
      crossDomain: true,
      success: function (response) {
        printRating($rateList, response.data.average);
        $rateList.addClass('fetched');
      },
      error: function (e) {
      }
    });
  };


  $ratings.children().on('click', function (e) {
    var $clicked = $(this);
    var $rating = $clicked.parent();
    var id = $rating.data('id');
    var uuid = $rating.data('uuid');
    var mark = ($clicked.parent().children('li').index($clicked) + 1) * 2;
    if ($rating.hasClass('unvotable')) {
      return;
    }
    $rating.addClass('unvotable');
    $.ajax({
      type: 'POST',
      url: "https://st-api.diwanee.net/v1/ratings/" + id + "/" + mark + "?browserFingerprint=" + fp + "&api_key=" + apiKey,
      cache: false,
      async: true,
      crossDomain: true,
      dataType: 'json',
      data: {
        property: "",
        itemUuid: uuid
      },
      success: function (data) {
        printRating($rating, data.average)
        //singleFetch($rating, data.average);
      },
      error: function (e) {
      }
    });
  });


  // STARTER
  $ratings.addClass('unvotable');
  $ratings.parents('.article__author').find($ratings).removeClass('unvotable');
  $ratings.each(function (i, rating) {
    singleFetch($(rating));
  });
  

});