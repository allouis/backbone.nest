(function(Backbone){
    //Model
    //-----
    //Extending the prototype with our helpers
    Backbone.Nest = Backbone.Model.extend({
      //constructor
      //setup constructor so parse is default for nests
      constructor: function(attributes, options){
        options || (options = {})
        if(options.parse == undefined) options.parse = true             
        Backbone.Model.apply(this, arguments);
      },
      //toJSON
      //------
      //Here we check if an attribute is a Collection,
      //then recursively call toJSON on models within.
      toJSON: function(filter) {
        var attr = this.attributes,
            resp = _.clone(attr),
            nests = this.nests.split(" "),
            i, j;
        //Optimize if we know there is only one nested 
        //collection and we know the name of it. 
        if(nests.length === 1) {
          if(!!filter && !!resp[this.nests][filter]) resp[this.nests] = resp[this.nests][filter]()
          if(resp[this.nests]) resp[this.nests] = resp[this.nests].toJSON();
          return resp;
        } else
        //Optimize if there are multiple and we know the names.
        if(this.nests) {
          for(i = 0, j = nests.length; i < j; i++) {
            if(!!filter && !!resp[nests[i]][filter]) resp[nests[i]] = resp[nests[i]][filter]()
            if(resp[nests[i]]) resp[nests[i]] = resp[nests[i]].toJSON();
          }
          return resp;
        }
        //If not loop through all.
        for(prop in attr) {
          if(attr[prop] instanceof Backbone.Collection) { 
            if(!!filter && !!resp[prop][filter]) resp[prop] = resp[prop][filter]()
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

      //listenToNest
      //------------------
      //This bubbles change events from nested collections
      //up to the container model, not auto to optimize for
      //standard models. 
      listenToNest: function(nest, ev, func) {
        var i, j, nests = this.nests.split(" ");
        var attr = this.attributes;
        if(nest) {
           if(!attr[nest]) return;
           return this.listenTo(attr[nest], (ev || "change"), function(data) {
              this.trigger("change change:"+nest, data);
              if(func) func(data);
           }, this)
        }
        //Optimize if nested collection is explictly known.
        if(nests.length === 1) {
            if(!attr[this.nests]) return;
            return this.listenTo(attr[this.nests], "change", function(data) {
              this.trigger("change change:"+this.nests, data);
            }, this);
        } else
        //Optimize for multiple and known.
        if(this.nests) {
          for(i = 0, j = nests.length; i < j; i++) {
            if(!attr[nests[i]]) continue;
            this.listenTo(attr[nests[i]], "change", function(data) {
              this.trigger("change change:"+nests[i], data);
            }, this);
          } 
          return;
        }
        //If not loop through all.
        for(prop in attr) {
          if(attr[prop] instanceof Backbone.Collection) { 
            return this.listenTo(attr[prop], "change", function(data) {
              this.trigger("change change:"+prop, data);
            }, this);
          };
        };
      },

      //stopListeningToNest
      //-------------------
      stopListeningToNest: function(nest, ev) {
        var i, j, nests = this.nests.split(" "), attr = this.attributes;
        if(nest) {
          return this.stopListening(nest, ev);
        }
        for(i = 0, j = nests.length; i < j; i++) {
          this.stopListening(attr[nest[i]]);
        };
      }

    });

  //Proxy collection methods on nest via the model.
  //-----------------------------------------------
  //List all methods we want to proxy
  var methods = ['push', 'pop', 'unshift', 'shift', 'at', 'where', 'findWhere'];

  //Go through each one, have it invoke upon the nest
  _.each(methods, function(method) {
    Backbone.Nest.prototype[method] = function() {
      var args = Array.prototype.slice.call(arguments),
          nests = this.nests.split(" "), i, j;
      //if scond param is blank, or only one nest, 
      //call it on just first nest in nests.
      if(nests.length === 1 || !!!args[1]) {
        return Backbone.Collection.prototype[method].apply(this.attributes[nests[0]], args);
      }
      //if second param of method is true, go through all nests.
      return function(){
        for(i = 0, j = nests.length; i < j; i++){
          Backbone.Collection.prototype[method].apply(this.attributes[nests[i]], args);
        };
      };
    };
  });

}(Backbone))
