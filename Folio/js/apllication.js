

$(window).load(function() {
  // The slider being synced must be initialized first
 $('#carousel').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 160,
        itemMargin: -19,
        direction: "vertical",
        directionNav: false,
        move:1,
        easing: 'easeInElastic', 
        asNavFor: '#slider',
                   
      });
 
  $('#slider').flexslider({
    animation: "fade",
    controlNav: false,
    animationLoop: true,
    slideshow: true,
    pausePlay: true,
    pauseText: "Vasya",             
    playText: "petya",   
    sync: "#carousel",
    directionNav: false
  
  });
});


$('.menu__link').on('click', function (e) {
	
	e.preventDefault();
	$('.content-container').toggle();
	$('.active-link').removeClass();
	$(this).addClass('active-link');
});

$('.slideshow-bar__item').on('click', function (e) {
	  var n=$(this).index();
	  $('.mask').removeAttr('style');
	  $(this).children('.mask').css('opacity', '0');
	  console.log(n);  
	   var url = 'url(img/bg' + n + '.jpg)';
	   e.preventDefault();
	$('.wrapper').css('background-image', url);
})

$('.close-button').on('click', function (e) {
	$(this).parent().hide();
	$('.active-link').removeClass();
	$('.menu__link:first').addClass('active-link');

})