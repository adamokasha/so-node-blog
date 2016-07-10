$(document).ready(function(){
	// Nav burger and nav ul animations
	$('.nav-burger').on('click', function(){
			$(this).toggleClass('active');
			$('.nav-ul').toggleClass('show');
	});
	
	$('.accordion li').on('click', function(){
		// Show paragraph or list
		$(this).children('.submenu').toggleClass("selected");
		// Animate arrow
		$(this).find('.bio-header i').toggleClass('rotated');
	});
	
})