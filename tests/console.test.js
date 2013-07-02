
var testcollection = new Backbone.Collection([
      {
        name:"test1",
        type:"model"
      },
      {
        name:"test2",
        type:"model"
      }
    ]),
    TestModel = Backbone.Model.extend({
      nest: "Coll"
    }),
    testmodel = new TestModel({
      Coll: testcollection,
      name:"base"
    })

TestModel.on("change", function (change) {
  console.log("TestModel::change:");
});
TestCollection.on("change", function (change) {
  console.log("TestCollection::change")
});

var mod = testmodel,
    col = testcollection;


