(function(){

  function ProductPage(params){
    var self = this;
    self.products = [];

    self.loadProducts = function(productsUrl, templateUrl){
      $(".loading").show();

      $.getJSON(productsUrl, function(response){
        $.each(response.sales, function(i, sale) {
          self.products.push( new Product(sale, i) );
        });

        self.updateProductsHTML(templateUrl);
      });
    };

    // private

    self.updateProductsHTML = function(templateUrl){
      $.get(templateUrl, function(template){
        $.each(self.products, function(i, product){
          product.updatehtml(template);
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

      $("img").load(function() {
        $(".loading").hide();
        $(".content").show();
      });

    };

    self.initRemoveListeners = function(){
      $('.remove').on('click', function(e) {
        e.preventDefault();
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

    self.updatehtml = function(template){
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
    page.loadProducts('data.json', 'product-template.html');
  }

  init();

})();
