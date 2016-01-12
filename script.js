//OPTIMIZATIONS: Using setTimeout to wait for the JSON to load is both buggy and inefficient.
//I Placed those method calls inside the AJAX callback functions, so that they would be
//called as soon as the JSON was loaded (faster and not buggy).
//The template is now only loaded once to minimize AJAX requests.
//I also did some renaming and syntax edits to make this script more readable and maintainable
//Lastly, If I were to continue working on this page I would make the responsiveness a little better
//by changing the @media break points so one could see two columns (for tablets) of products before it
//transitions into the single column, full mobile friendly version.


// preserving namespace
(function(){

  function ProductPage(){
    var self = this;
    self.products = [];

    self.loadProducts = function(productsUrl, templateUrl){
      $(".loading").show();

      $.getJSON(productsUrl, function(response){

        //each loop is more readable than for loop
        $.each(response.sales, function(i, sale) {
          self.products.push( new Product(sale, i) );
        });

        self.updateProductsHTML(templateUrl);
      });
    };

    // private

    self.updateProductsHTML = function(templateUrl){
      //load template before loop
      $.get(templateUrl, function(template){
        $.each(self.products, function(i, product){
          product.updateHTML(template);
        });

        self.updateDOM();
      });
    };

    self.updateDOM = function(){
      var thishtml="<div class='row'>";

      $.each(self.products, function(i, product){
        thishtml += product.htmlview;
      });

      thishtml += "</div>";

      $(".content").append(thishtml);
      self.initRemoveListeners();

      //wait for all images to load before displaying content
      $("img").load(function() {
        $(".loading").hide();
        $(".content").show();
      });

    };

    self.initRemoveListeners = function(){
      $('.remove').on('click', function(e) {
        e.preventDefault();

        //smoothing product removal
        $(e.currentTarget).parents('.product-container').fadeOut("fast", function(){
          this.remove();
        });
      });
    };
  }

  function Product(product, i){
    var self          = this;
    self.photo        = product.photos.medium_half;
    self.title        = product.name;
    self.description  = product.description;
    self.tagline      = product.tagline;
    self.url          = product.url;
    self.htmlview     = "";
    self.index        = i;
    self.custom_class = "col-md-4";

    self.updateHTML = function(template){
      self.htmlview = template.replace('{image}', self.photo)
                              .replace('{title}', self.title)
                              .replace('{tagline}', self.tagline)
                              .replace('{url}', self.url)
                              .replace('{custom_class}', self.custom_class)
                              .replace('{description}', self.description);
    };
  }

  function init(){
    var page = new ProductPage();

    //input urls as params
    page.loadProducts('data.json', 'product-template.html');
  }

  init();

})();
