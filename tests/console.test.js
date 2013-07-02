var Model = Backbone.Model.extend({
  nest: Collection,
  nests: "myColl"
});

var Collection = Backbone.Collection.extend({
  model: Model
});

var TestModel = new Model({
  name: "test",
  age: 20,
  myColl: [
    {name:"test1"},
    {name:"test2"},
    {name:"test3"},
    {name:"test4"}
  ]
})
