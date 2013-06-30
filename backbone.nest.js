
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
        //Optimize if there are multiple and we know the names.
        if(this.nests) {
          var i, j, nests = this.nests.split(" ");
          for(i = 0, j = nests.length; i < j; i++) {
            resp[nests[i]] = resp[nests[i]].toJSON();
          }
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
      listenToCollection: function() {
        var attr = this.attributes;
        //Optimize if nested collection is explictly known.
        if(this.nest) {
            return this.listenTo(attr[this.nest], "change", function() {
              this.trigger("change change:"+this.nest);
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
