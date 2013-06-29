
(function(Backbone){
    //Model
    //-----
    //Extending the prototype with our helpers
    _.extend(Backbone.Model.prototype, {
      //toJSON
      //------
      //Here we check if an attribute is a Collection,
      //then recursively call toJSON on models within.
      toJSON: function() {
        var attr = this.attributes,
            resp = _.clone(attr);
        //Optimize if we know there is only one nested 
        //collection and we know the name of it. 
        if(this.nest) {
          resp[this.nest] = resp[this.nest].toJSON();
          return resp;
        }
        //If not loop through all.
        for(prop in attr) {
          if(attr[prop] instanceof Backbone.Collection) { 
            resp[prop] = resp[prop].toJSON();
          };
        };
        return resp;
      },
      //listenToCollection
      //------------------
      //This bubbles change events from nested collections
      //up to the container model, not auto to optimize for
      //standard models. 
      listenToCollection: function(prop) {
        var attr = this.attributes;
        //Optimize if nested collection is explictly named.
        if(prop) {
            return this.listenTo(attr[prop], "change", function() {
              this.trigger("change change:"+prop);
            }, this);
        };
        //If not loop through all.
        for(prop in attr) {
          if(attr[prop] instanceof Backbone.Collection) { 
            return this.listenTo(attr[prop], "change", function() {
              this.trigger("change change:"+prop);
            }, this);
          };
        };
      }
    });
}(Backbone))
