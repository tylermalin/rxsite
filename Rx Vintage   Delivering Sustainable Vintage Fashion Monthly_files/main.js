var carousel, $slideList;

$(document).ready(function(){

	$slideList = $( ".rcWrapper > ul li" );
	
	preloadAssets(function(){
		initCarousel();
	}, false);
	
    registerClickHandlers();
});

function preloadAssets(completion, verbose){
	if(typeof verbose === 'undefined'){
		verbose = false;
	}

	/* Preload all images */
	var loader = new PxLoader(),
		baseBGUrl = 'img/Slide',
		bgCount = 28;
		baseOutfitUrl = 'img/Outift_',
		outfitCount = 16,
		outfitSlides = [6, 12, 18, 22],
		baseGridUrl = 'img/Outfit_Grid_',
		gridCount = 28,
		gridSlides = [24, 25, 26];
	
	/* BG images */
	var excludeIndexes = [];
	for(var i=0; i<bgCount; i++){
		if (outfitSlides.indexOf(i) > -1 || gridSlides.indexOf(i) > -1 ){
			continue;
		}
		var pxImage = new PxLoaderImage(baseBGUrl + (i + 1) + ".png", "image");
	    pxImage.imageNumber = i;
	    loader.add(pxImage); 
	}
	
	/* Outfits */
	for(var i=0; i<outfitCount; i++){
		var pxImage = new PxLoaderImage(baseOutfitUrl + (i + 1) + ".png", "outfit");
	    pxImage.imageNumber = i;
	    loader.add(pxImage); 
	}
	
	/* Grid */
	var gridPage = [".png", " 2.png", " 3.png"];
	for(var j=0; j < gridPage.length; j++){
		var suffix = gridPage[j];
		for(var i=0; i<gridCount; i++){
			var pxImage = new PxLoaderImage(baseGridUrl + (i + 1) + suffix, "grid");
		    pxImage.imageNumber = i;
		    pxImage.gridNumber = j;
		    loader.add(pxImage); 
		}
	}
	
	/* Video Support */
	if (Modernizr.video) {
		if(verbose){
			console.log("H264 Support: " + Modernizr.video.h264);
			console.log("WebM Support: " + Modernizr.video.webm);
		}
		var videoSrc = Modernizr.video.webm ? "video/palm_trees.webm" :
						Modernizr.video.h264 ? "video/palm_trees.mp4" : "";
		loader.add(new PxLoaderVideo(videoSrc, "video"));
	}
	
    /* Progress Callbacks */
    loader.addProgressListener(function(e) {
	    $slideList.eq(e.resource.imageNumber + 1).css('background-image', "url(" + e.resource.img.src + ")");
	    if(verbose){
			console.log("Loaded Image: " + (e.resource.imageNumber + 1));
		}
	}, "image");
	
	loader.addProgressListener(function(e) {
		var video = e.resource.vid;
		video.autoplay = "autoplay";
		video.loop = "loop";
		video.play();
	    $( "video" ).replaceWith(video);
   		video.removeAttribute("controls");
   		if(verbose){
			console.log("Loaded Video");
		}
	}, "video");
	
	loader.addProgressListener(function(e) {
		var slide;
		if(e.resource.imageNumber <4){
			slide = outfitSlides[0];
		} else if(e.resource.imageNumber <8){
			slide = outfitSlides[1];
		} else if(e.resource.imageNumber <12){
			slide = outfitSlides[2];
		} else {
			slide = outfitSlides[3];
		}
		
	    $slideList.eq(slide + 1).find("a").eq(e.resource.imageNumber % 4).append(e.resource.img);
	    if(verbose){
			console.log("Loaded Outfit: " + (e.resource.imageNumber + 1));
		}
	}, "outfit");
	
	loader.addProgressListener(function(e) {
		var slide = gridSlides[e.resource.gridNumber] + 1;
	    $slideList.eq(slide).find("a").eq(e.resource.imageNumber).append(e.resource.img);
	    if(verbose){
			console.log("Loaded Grid Outfit: " + (e.resource.imageNumber + 1) + " for grid " + (e.resource.gridNumber + 1));
		}
	}, "grid");
	
	loader.addCompletionListener(function(e){
		completion();
	});
    	
    loader.start();
}

function initCarousel(){
		    
    // fade out loader tag into landing page
    $('#loading').fadeOut(1500);
    $('.rcWrapper').fadeTo(1500, 1);

    /* Initialize Carousel */
	carousel = $('#wrapper').responsiveCarousel({
		direction: 'horizontal',
		transitionSpeed: 500,
		keyControl: true,
		arrows: true,
		pagination: true,
		paginationEl: 'paginationList',
		tapToReturn: true,
		callback: carouselStateChanged
	});
}

function registerClickHandlers() {
	$('#menu').click(openMenu);
    
    $('#close').click(closeMenu);
    
    $('#toc > ul li').click(function(elt){
	    closeMenu();
	    navigateToPage($( this ).attr('data-page'));
    })
}

function openMenu() {
	$('#contents').css('display', 'block').animate({
	   	opacity : 1
	 	}, 300);
}

function closeMenu() {
	$('#contents').animate({
	   	opacity : 0
	   	}, 300, function(){
	    	$( this ).css('display', 'none')
	   	});
}

function carouselStateChanged(){
	var animationDuration = 500;
	var $hotCopy = $slideList.eq(this.state.curPage - 1).find(".copy");
	$hotCopy.children().each(function( index ){
		var $child = $( this );
		setTimeout(function(){
			$child.animate({opacity : 1}, animationDuration);
		}, animationDuration * (index + 1));
	});
	
}

function navigateToPage(page){
	if(carousel){
		carousel.showPage(page);
	}
}
