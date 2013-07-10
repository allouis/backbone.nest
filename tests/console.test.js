var Model = Backbone.Model.extend({
  nest: Collection,
  nests: "myColl myOtherColl"
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
  ],
  myOtherColl: [
    {name:"test1.1"},
    {name:"test1.2"},
    {name:"test1.3"}
  ],
  myArray: [
    {name:"test2.1"},
    {name:"test2.2"},
    {name:"test2.3"}
  ]
})
