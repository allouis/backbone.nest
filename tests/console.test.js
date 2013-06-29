
var TestCollection = new Backbone.Collection([
      {
        name:"test1",
        type:"model"
      },
      {
        name:"test2",
        type:"model"
      }
    ]),
    TestModel = new Backbone.Model({
      name:"master 1",
      type:"master model",
      test:TestCollection
    });

TestModel.on("change", function (change) {
  console.log("TestModel::change:");
});
TestCollection.on("change", function (change) {
  console.log("TestCollection::change")
});

var mod = TestModel,
    col = TestCollection;
