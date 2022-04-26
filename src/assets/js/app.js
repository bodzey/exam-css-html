// jQuerry

$(function () {

	/* Nav Toogle
	 ==========================*/
	let navToggle = $('#navToggle')
	let nav = $('#nav')
	let body = $('#body')

	navToggle.on('click', function (event) {
		event.preventDefault()

		$('body').toggleClass('show-nav')
		$(this).toggleClass('active')
		nav.toggleClass('show')
		body.toggleClass('no-scroll')
	})

	$(window).on("resize", function () {
		$('body').removeClass('show-nav')
		navToggle.removeClass('active')
		nav.removeClass('show')
	})

	/* Header BG
	 ==========================*/
	let header = $(".header");
	let scrollChange = 100;
	$(window).scroll(function () {
		var scroll = $(window).scrollTop();

		if (scroll >= scrollChange) {
			header.addClass('header--dark');
		} else {
			header.removeClass("header--dark");
		}
	});
})