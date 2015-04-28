  $( document ).ready(function() {
  
    console.log("This is working?");

    $( ".furniture" ).draggable();
    $(".furniture").hide();
    
    $(".menu_item").on( "click", function() {
      //On click of cactusButton run the code in this block
      
      var button = $(this);
      var kind = button.data('kind');
      console.log(kind + " button was clicked");
      
      var furniture = $('#' + kind);
      
       // If it's already visible, just hide it
      if(furniture.is(':visible') && !furniture.find(".broken").is(":visible")) {
        furniture.hide();
      }
        
      
      // Otherwise, tell the server to add it to the database
      
      else { 
        $.get('/create?kind=' + kind, function(data) {
            
            // This code runs once the server request is complete.
            console.log(data.total_count, data.kind);
            
            // If there are now 10 or more if this furniture kind, hide this furniture's good image and show its broken image instead
            if (data.total_count >= 10) {
                furniture.find('.good').hide();
                furniture.find('.broken').show();
            }
            
            furniture.show();
            
        }, 'json');
        
      }
      
      
    });

});