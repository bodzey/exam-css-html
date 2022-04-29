// jQuerry

$(function () {

	// Nav Toogle

	let navToggle = $('#navToggle')
	let nav = $('#nav')
	let body = $('#body')

	navToggle.on('click', function (event) {
		event.preventDefault()

		$('body').toggleClass('show-nav')
		nav.toggleClass('show')
		body.toggleClass('no-scroll')
	})

	$(window).on("resize", function () {
		$('body').removeClass('show-nav')
		navToggle.removeClass('active')
		nav.removeClass('show')
	})

	// Header BG

	let header = $(".header");
	let scrollChange = 5;
	$(window).scroll(function () {
		let scroll = $(window).scrollTop();

		if (scroll >= scrollChange) {
			header.addClass('header--dark');
		} else {
			header.removeClass("header--dark");
		}
	});
})