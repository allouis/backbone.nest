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
            resp = _.clone(attr),
            nests = this.nests.split(" "),
            i, j;
        //Optimize if we know there is only one nested 
        //collection and we know the name of it. 
        if(nests.length === 1) {
          if(resp[this.nests]) resp[this.nests] = resp[this.nests].toJSON();
          return resp;
        } else
        //Optimize if there are multiple and we know the names.
        if(this.nests) {
          for(i = 0, j = nests.length; i < j; i++) {
            if(resp[nests[i]]) resp[nests[i]] = resp[nests[i]].toJSON();
          }
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

      //parse
      //-----
      //This creates a collection if model is passed an array
      //under the nest attributes name
      parse: function(data, options) {
        var i, j, nests = this.nests.split(" ");
        if(nests.length === 1) {
          data[this.nests] = new this.nest(data[this.nests]);    
        } else
        if(this.nests) {
          for(i = 0, j = nests.length; i < j; i++) {
            data[nests[i]] = new this.nest(data[nests[i]]);
          } 
        }
        return data;
      },

      //listenToCollection
      //------------------
      //This bubbles change events from nested collections
      //up to the container model, not auto to optimize for
      //standard models. 
      listenToCollection: function() {
        var i, j, nests = this.nests.split(" ");
        var attr = this.attributes;
        //Optimize if nested collection is explictly known.
        if(nests.length === 1) {
            if(!attr[this.nests]) return;
            return this.listenTo(attr[this.nests], "change", function() {
              this.trigger("change change:"+this.nests);
            }, this);
        } else
        //Optimize for multiple and known.
        if(this.nests) {
          for(i = 0, j = nests.length; i < j; i++) {
            if(!attr[nests[i]]) continue;
            this.listenTo(attr[nests[i]], "change", function() {
              this.trigger("change change:"+nests[i]);
            }, this);
          } 
          return;
        }
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

  //Proxy collection methods on nest via the model.
  //-----------------------------------------------
  //List all methods we want to proxy
  var methods = ['push', 'pop', 'unshift', 'shift', 'at', 'where', 'findWhere'];

  //Go through each one, have it invoke upon the nest
  _.each(methods, function(method) {
    Backbone.Model.prototype[method] = function() {
      var args = Array.prototype.slice.call(arguments),
          nests = this.nests.split(" "), i, j;
      if(nests.length === 1) {
        return Backbone.Collection.prototype[method].apply(this.attributes[this.nests], args);
      }
      return function(){
        for(i = 0, j = nests.length; i < j; i++){
          Backbone.Collection.prototype[method].apply(this.attributes[nests[i]], args);
        };
      };
    };
  });

}(Backbone))
