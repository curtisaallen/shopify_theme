// UPDATE QUANTITY OF ITEMS IN CART
var update_quantity = function(id, number) {
    var params = {
    type: 'POST',
    url: '/cart/change.js',
    data:  'quantity='+number+'&id='+id,
    dataType: 'json',
    success: function() {
      $("div.cart").load("/cart #cartform");
        $(".cart-container").load("/ .login-box, section.inline-cart");
    },
    error: function(XMLHttpRequest, textStatus) {}
  };
  $.ajax(params);
};

// BUY ITEMS FROM LOOKS PAGE
$(".js-looks-add-product").on("click", function(){
  var v = $(this).closest("form.variants").find('select').val();
  var $button = $(this);
  var params = {
    type: 'POST',
    url: '/cart/add.js',
    data: "quantity=1&id="+v,
    dataType: 'json',
    success: function() {
      $button.val("Added!");
      $(".cart-container").load("/ .login-box, section.inline-cart", function(){
        $("section.inline-cart").slideDown().delay(2000).slideUp();
      });
    },
    error: function(XMLHttpRequest, textStatus) {}
  };
  $.ajax(params);
});

// SHOWS UL OF ITEMS IF IT IS NOT VISIBLE, OTHERWISE SLIDES UP
$(".js-looks-div").on("click", function(){
  var $looks = $(".js-looks-page");
  var $ul = $(this).next(".js-looks-page");
  var $this = $(this);
  var $button = $this.find(".js-looks-button");
  var speed = 500;
  
  $looks.slideUp(speed);
  $(".js-looks-button").val("Buy This Outfit");
  if (!$ul.is(":visible")) {
    $button.val("Close");
    $ul.slideDown(speed, function(){
      var opts = {
        scrollTop: $this.offset().top 
      };
      $('html,body').animate(opts ,'slow');
    });
  }
  
});

// FUNCTION TO BUY ON PRODUCT PAGES
var purchaseItem = function(form_id) {
  var params = {
    type: 'POST',
    url: '/cart/add.js',
    data: $("#"+form_id).serialize(),
    dataType: 'json',
    success: function() {
      $("#add-to-cart").val("Added!");
      $(".cart-container").load("/ .login-box, section.inline-cart", function(){
                  // added by Lemonade NY
      			var itemID = $("#"+form_id).serialize();
                      itemID = itemID.substr(3);
                      console.log(itemID);
      			var inStock = false;
      			var urlhandle = location.href.substr(location.href.lastIndexOf('/')+1);
      			var data = jQuery.parseJSON(
                        jQuery.ajax({
      						        url: "/products/"+urlhandle+".js",  // Change this to be the page handle
      						        async: false,
      						        dataType: 'json'
      					          }).responseText
      			            );
      			var vars = data.variants;

      			var ssfield1 ='<div id="second-size"><input id="ssval" type="hidden" name="attributes[ss-'+itemID+']" value="" /><input id="ssname" type="hidden" name="attributes[ss-d-'+itemID+']" value="" /><input type="hidden" value="'+itemID+'" id="ss-prodid"><p id="header">Try a second size on us!</p><p id="no-thanks"><a class="ss-nothanks-lnk">No, Thanks.</a></p><div id="wrap">';
      			var ssfield2 ='<button class="ss-add-lnk float-r">Add</button><div class="clearfix item1"><div class="selector-wrapper fleft"><label for="product-select-option-0" class="sslabel">'+vars[0]['option1']+'</label></div><div class="pselect-box fleft"> <a class="field"> <span class="info">'+vars[0]['option1']+'</span><img src="http://static.shopify.com/s/files/1/0172/5556/t/3/assets/down-triangle.gif?493"></a><ul class="selector_0 selector">';
      			var ssfield3 ='<div class="clearfix item2"><div class="selector-wrapper fleft"><label for="product-select-option-1" class="sslabel ">'+vars[0]['option2']+'</label></div><div class="pselect-box fleft"> <a class="field"> <span class="info">'+vars[0]['option2']+'</span> <img src="http://static.shopify.com/s/files/1/0172/5556/t/3/assets/down-triangle.gif?493"></a><ul class="selector_1 selector">';
      			var ssfield4 ='<div class="clearfix" style="text-align: right;"><select id="ss" style="display:none;"><option value="select">select</option>';

            var container1 = [];
            var container2 = [];
      			var fq_top_rec = $.cookie('fq_top_rec'); // check to see if we have this available.

            if(fq_top_rec){
          		var top = fq_top_rec.substr(0,2);
      				var bust = fq_top_rec.substr(2,1)+" / "+fq_top_rec.substr(2,2);
      				var length = fq_top_rec.substr(4);
      			}

            vars.sort(); // sort asc
            
            var i;
            
      			for(i=0;i<vars.length;i++){
      				if(vars[i]['inventory_quantity'] > 0 && i !== 0){ // Check to see if we have more than two just to ensure we don't oversell
      					if(ssfield2.indexOf(vars[i]['option1']) < 0){ 
                  ssfield2 += '<li>'+vars[i]['option1']+'</li>';
          			}
      					if(ssfield3.indexOf(vars[i]['option2']) < 0){ 
                  ssfield3 += '<li>'+vars[i]['option2']+'</li>';
          			}
      					ssfield4 += '<option value="'+vars[i]['id']+'">'+vars[i]['option1']+' / '+vars[i]['option2']+'</option>';
      					inStock = true;
      				}
      			}
      			ssfield2 +='</ul></div></div>';
      			ssfield3 +='</ul></div></div>';
      			ssfield4 +='</select></div>';
      			ssfield1 += ssfield2+ssfield3+ssfield4+'</div>';

      			// inject the second size code after the Added Item
      			$(ssfield1).insertAfter('#cartform #'+itemID);

      			// load second size inline cart jquery DOM triggers
            $.getScript("{{'ss-cart.js'| asset_url}}",function(){
              console.log('Loaded ss-cart.js');
            });

      			// end ammendment by Lemonade NY
      			var $inlinecart = $("section.inline-cart");
      			if(inStock){
              $inlinecart.slideDown();
      			} 
      			else {
              $inlinecart.slideDown().delay(2000).slideUp();
      			}
      });
    },
    error: function(XMLHttpRequest, textStatus) {}
  };
  $.ajax(params);	
};

//FUNCTION TO REMOVE ITEMS ON /CART PAGE
var remove_item = function(id) {
    $('#ss-'+id+'-v').val('');
    $('#ss-d-'+id).val('');
    
    $("body").addClass("ajax"); // change cursor to "progress"
    
    var params = {
      type: 'POST',
      url: '/cart/change.js',
      data:  'quantity=0&id='+id+'&ss-'+id+'-v=&ss-d'+id+'=',
      dataType: 'json',
      success: function() {
        ssRefreshCart();
      },
      error: function(XMLHttpRequest, textStatus) {}
    };
    $.ajax(params);
};

// DELEGATED HANDLER FOR UPDATE QUANTITY BUTTON ON /CART PAGE
$(document).on("click", ".update", function(){
  var id = $(this).attr("id");
  var number = $(this).prev().val();
  update_quantity(id, number);
});

// DELEGATED HANDLER FOR HOVERING OVER INLINE CART
$(document).on('mouseenter mouseleave', '.cart-container', function(e) {
  var $inlinecart = $("section.inline-cart");
  
  if (e.type === 'mouseenter') {
    $inlinecart.slideDown();
  }
  else if (e.type === 'mouseleave') {
    $inlinecart.slideUp();
  }
});

// DELEGATED HANDLER FOR CLICKING ON CART LINK TO SHOW CART
$(document).on("click", "a.inline-cart", function(){
  $("section.inline-cart").slideToggle();
});

//==================
// BEGIN DOC READY CODE
//==================

$(document).ready(function(){
  
  // DATEPICKER FOR GIFTCARD
  var options = {
    	maxDate: "+3m",
  	  minDate: "+0d"
    };
  $("#datepicker").datepicker( options );
  
  // SETS ACTIVE TO FIRST SLIDE, CORRESPONDING LI, AND SWATCH ON PRODUCT PAGE
  $('ul.slides li:first-child').addClass("slideActive");
	$("ul.indices li:first-child").addClass("indexActive");
	$("div.swatch-popup div").eq(0).fadeIn();
	$("ul.swatch li").eq(0).addClass("active");
	
	//HIDES COLOR SELECTOR ON PRODUCT PAGES
	$("div.selector-wrapper").eq(2).hide();
	
	//SETS COLOR CHOICE ON HIDDEN DROPDOWN TO FIRST NON-SELECT OPTION
	var $option2 = $("#product-select-option-2");
	$option2.val($option2.find("option:eq(1)").val()).change();
	
	//ADDS THE NAME OF THE COLOR NEXT TO THE SWATCH ICONS ON THE PRODUCT PAGE
	$("p.color").append($option2.val());
	
  // POPULATES STYLED DROPDOWNS ON PRODUCT AND CONTACT PAGES WITH OPTIONS FROM THEIR SELECT BOXES
  var fancyDropdown = function(index) {
      var i,
          div = $("div.selector-wrapper").eq(index).find("select option"),
          ul = $("form#product-actions").find("ul").eq(index);
      for (i = 1; i < div.length; i++) {
          ul.append('<li>'+ div.eq(i).html()+'</li>');
      }
  };
  var fancyContact = function(index) {
      var i,
          div = $("div.contact_form li").eq(index).find("select option"),
          ul = $("div.contact_form ul.selector");
      for (i = 0; i < div.length; i++) {
          ul.append('<li>'+ div.eq(i).html()+'</li>');
      }
  };
  fancyDropdown(0);
  fancyDropdown(1);
  fancyContact(2);
  
  // CREATES FUNCTIONALITY FOR STYLED DROPDOWNS  
  (function($) {
      $.fn.styleddropdown = function() {
          return this.each(function() {
              var $obj = $(this);
              var speed = 10;
              $obj.find('.field').click(function() { //onclick event, 'list' fadein
                  if ($obj.find('ul').is(":visible")) {
                    $obj.find('ul').fadeOut(speed);
                  }
                  else{
                    $('.selector').fadeOut(speed);
                    $obj.find('ul').fadeIn(speed);
                  }
            
                  $(document).keyup(function(event) { //keypress event, fadeout on 'escape'
                      if (event.keyCode == 27) {
                          $obj.find('.selector').fadeOut(speed);
                      }
                  });

                  $obj.find('.selector').hover(function() {}, function() {
                      $(this).fadeOut(speed);
                  });
              });

              $obj.find('.selector li').click(function() { //onclick event, change field value with selected 'list' item and fadeout 'list'
                  var $div_index = $(this).closest(".pselect-box"),
                      index,
                      $target;
                  if ($div_index.hasClass("top")) {
                    index = 0;
                    $target = $(".selector-wrapper");
                    $target.eq(index).find("select").val($(this).text()).change();
                  }
                  else if ($div_index.hasClass("bottom")) {
                    index = 1;
                    $target = $(".selector-wrapper");
                    $target.eq(index).find("select").val($(this).text()).change();
                  }
                  else{
                    $target = $("#subject");
                    $target.val($(this).text()).change();
                  }
                  $obj.find('.info').empty().append($(this).text());
                  $obj.find('.selector').fadeOut(speed);
              });
            
          });
      };
  })(jQuery);
  $('.pselect-box').styleddropdown();
  
  // HIDES MODAL POPUPS
  $(".js-modal-close").click(function(){
    $(this).closest(".js-modal-container").fadeOut("medium");
  });
  
  // SIZE CHART
	// REVEALS SIZE CHART MODAL ON PRODUCT PAGE
	var $sizechart = $("section.size-chart");
  $(".js-size-chart").click(function(){
    $sizechart.fadeIn("medium");
  });
  
  // SWATCH
  // REVEAL
  // HIDDEN SWATCH WINDOW BECOMES VISIBLE ON CLICK
  var $swatchwindow = $(".swatch-popup");
  $("a.swatch").click(function(){
    $swatchwindow.toggleClass("box-shadow-bump");
    return false;
  });
  $("a.swatch_close").click(function(){
    $swatchwindow.removeClass("box-shadow-bump");
    return false;
  });
	
  // PRODUCT DESCRIPTION ACCORDION
  // SHOWS CORRESPONDING DROPDOWN ON CLICK FOR PRODUCT DESCRIPTION SECTION
	$(".js-details-accordion").click(function() {
		var $div = $($(this).data("name")),
		    $h3  = $(this),
		    $details = $(".details"),
		    speed = 700;
		    
		if ($div.is(":visible")) {
		  $details.slideUp(speed,"swing");
		  $h3.find(".js-plus").show();
		  $h3.removeClass("pink");
		} 
		else{
		  $(".js-plus").show();
		  $details.slideUp(speed,"swing");
		  $div.slideToggle(speed,"swing");
		  $(".js-details-accordion").removeClass("pink");
		  $h3.addClass("pink").find(".js-plus").hide();
		}
	});
  
  // SLIDESHOW FOR PRODUCT PAGE
	var $slides = $('#slideshow ul.slides li'),
	    slides2 = $("#slideshow2 ul.slides li"),
		  current = 0,
		  current2 = 0,
		  slideshow = {width:0,height:0},
		  nextIndex = 0,
		  $indices = $("#slideshow ul.indices li");
    // I-SWIPE
    $("#slideshow").swipe({
      swipeLeft:function(event, direction, distance, duration, fingerCount) {
          nextIndex = current < $slides.length - 1 ? nextIndex + 1 : 0;
          $slides.eq(nextIndex).addClass("slideActive").show("slide", { direction: "right" }, 500);
          $slides.eq(current).removeClass('slideActive').hide("slide", { direction: "left"}, 500);
          current = nextIndex;
          $indices.removeClass("indexActive").eq(nextIndex).addClass("indexActive"); 
        },
      swipeRight:function(event, direction, distance, duration, fingerCount) {
        nextIndex = current === 0 ? $slides.length - 1 : nextIndex - 1;
        $slides.eq(nextIndex).addClass("slideActive").show("slide", { direction: "left" }, 500);
        $slides.eq(current).removeClass('slideActive').hide("slide", { direction: "right"}, 500);
        current = nextIndex;
        $indices.removeClass("indexActive").eq(nextIndex).addClass("indexActive");
      }
    });
    
    // USING ARROWS 
		$('#slideshow .arrow').click(function(){
			var li = $slides.eq(current);

			// Depending on whether this is the next or previous
			// arrow, calculate the index of the next slide accordingly.
			
			if($(this).hasClass('next')){
				nextIndex = current >= $slides.length-1 ? 0 : current+1;
			}
			else {
				nextIndex = current <= 0 ? $slides.length-1 : current-1;
			}

			var next = $slides.eq(nextIndex);
				
				current = nextIndex;
				if ($(this).hasClass('next')) {
				  next.addClass('slideActive').show("slide", { direction: "right"});
				  li.removeClass('slideActive').hide("slide");
				}
				else {
				  next.addClass('slideActive').show("slide", { direction: "left"});
				  li.removeClass('slideActive').hide("slide", { direction: "right"});
				}
				$indices.removeClass("indexActive")
			          .eq(nextIndex).addClass("indexActive");
			
		});
    // USING INDICES
		$indices.click(function(){
			var index = $(this).index(),
			    li = $('#slideshow .slideActive'),
			    popup = $("div.swatch-popup div"),
			    ul = $("ul.swatch li");
			
			$("#slideshow ul.indices li").removeClass("indexActive");
			$(this).addClass("indexActive");
      
			if ($(this).index() === li.index()) {} //DO NOTHING
			else if ($(this).index() > li.index()) {
			  $slides.eq(index).addClass('slideActive').show("slide", { direction: "right"});
			  li.removeClass('slideActive').hide("slide");
			}
			else {
			  $slides.eq(index).addClass('slideActive').show("slide", { direction: "left"});
			  li.removeClass('slideActive').hide("slide", { direction: "right"});
			}
			current = index;
			
		});
		
    // SWATCH CLICK AND POPUP WINDOW UPDATE
    $("ul.swatch li").click(function(){
		  var li = $('#slideshow ul.slides li.slideActive');
		  
		  $("ul.swatch li").removeClass("active");
		  $(this).addClass("active");
		  $("select#product-select-option-2").val($(this).html()).change();
		  $("p.color").empty().append($("#product-select-option-2").val());
		  if ($(this).is(":first-of-type")) {
    	    if ($("div.swatch-popup div:first-of-type").is(":visible")){}
		    else {$("div.swatch-popup div").fadeOut().eq(0).fadeIn();}
		    if ($indices.eq(0).hasClass("indexActive")) {} 
		    else{
		      $indices.removeClass("indexActive")
		              .eq(0)
		              .addClass("indexActive");
		      $("#slideshow ul.slides li").removeClass("slideActive")
		                                  .eq(0)
		                                  .addClass("slideActive")
		                                  .show("slide", { direction: "right"});
		      li.removeClass('slideActive').hide("slide");
		      current = 0;
	      }
		  }
		  else if ($(this).is(":last-of-type")) {
		    if ($("div.swatch-popup div:last-of-type").is(":visible")){}
		    else {$("div.swatch-popup div").fadeOut().eq(1).fadeIn();}
		    if ($indices.eq(1).hasClass("indexActive")) {} 
		    else{
		      $indices.removeClass("indexActive")
		              .eq(1)
		              .addClass("indexActive");
		      $("#slideshow ul.slides li").removeClass("slideActive")
		                                  .eq(1)
		                                  .addClass("slideActive")
		                                  .show("slide", { direction: "right"});
		      li.removeClass('slideActive').hide("slide");
		      current = 1;
	      }
		  } 
		});
});