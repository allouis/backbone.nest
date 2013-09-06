backbone.nest
=============

Backbone plugin that enables infinitely nested Collections within Models, and advanced data structure.


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


