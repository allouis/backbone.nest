backbone.nest
=============

Backbone plugin that enables infinitely nested Collections within Models, and advanced data structure.

Basic Concept
=============

Simply use `Backbone.Nest` instead of `Backbone.Model`, and use `{ parse: true }` when creating model. 
The rest is taken care of, set the nest attribute to be the collection you want created, and the nests 
attribute as a space seperated list of the attributes to be turned into collections.


How to use
==========

    var LevelOneModel = Backbone.Nest.extend({
        //stuff
    })

    var LevelOneModels = Backbone.Collection.extend({
        
        model: LevelOneModel

    })

    var LevelTwoModel = Backbone.Nest.extend({
        
        nest: LevelOneModels,
        nests: "levelOne"
        //stuff

    })

    var LevelTwoModels = Backbone.Collection.extend({
        
        model: LevelTwoModel

    })

    var LevelThreeModel = Backbone.Nest.extend({
    
        nest: LevelTwoModels,
        nests: "levelTwo"
        //stuff

    })

    var data = {
    
        id:0,
        levelTwo:[
            {
                id: 1,
                levelOne:[
                    {
                        id:1.1
                    },
                    {
                        id:1.2
                    }
                ]
            },
            {
                id: 2,
                levelOne:[
                    {
                        id:2.1
                    }
                ]
            },
            {
                id: 3,
                levelOne:[
                    {
                        id:3.1
                    },
                    {
                        id:3.2
                    },
                    {
                        id:3.3
                    }
                ]
            }
        ]

    }

    var myModel = new LevelThreeModel(data, {parse:true});

    myModel.get("levelTwo").get(3).get("levelOne").each(function(mod){
        console.log(mod.get("id")) // 3.1, 3.2, 3.3
    })


