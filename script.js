(function(){

  function ProductPage(params){
    var self = this;
    self.products = [];

    self.loadProducts = function(productsUrl, templateUrl){
      $.getJSON(productsUrl, function(response){
        $.each(response.sales, function(i, sale) {
          self.products.push( new Product(sale, i) );
        });

        self.updateProductsHtml(templateUrl);
      });
    };

    self.updateProductsHtml = function(templateUrl){
      $.get(templateUrl, function(template){
        $.each(self.products, function(i, product){
          product.updatehtml(template);
        });

        self.updatedom();
      });
    };

    self.updatedom = function(){
      var thishtml="<div class='row'>";

      $.each(self.products, function(i, product){
        thishtml += self.products[i].htmlview;
      });

      thishtml += "</div>";

      $("#content").append(thishtml);
    };

  }

  function Product(product, i){
    var self          = this;
    self.photo        = product.photos.medium_half;
    self.title        = product.name;
    self.tagline      = product.tagline;
    self.url          = product.url;
    self.htmlview     = "";
    self.index        = i;
    self.custom_class = "col-md-4";

    self.updatehtml = function(template){
      self.htmlview = template.replace('{image}', self.photo).replace('{title}', self.title).replace('{tagline}', self.tagline).replace('{url}', self.url).replace('{custom_class}', self.custom_class);
    };
  }

  function init(){
    var page = new ProductPage();
    page.loadProducts('data.json', 'product-template.html');
  }

  init();

})();
