var express = require("express");
var router = express.Router();
var path = require("path");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");

router.get("/", function(req,res){
    //res.redirect("/home");
    db.Article.find({},function(err,doc){
        if(err){
            console.log(err);
        }
        console.log("This is the return of find from article table" + doc);
        var art = doc
        res.render("index", {art})
    })
});

// scrape the website

router.get("/scrape", function(req,res){
    axios.get("http://www.echojs.com/").then(function(response){
        // Load into cheerio and save it to $
        var $ = cheerio.load(response.data);

        // Grab all articles and loop through each of them
        $("article h2").each(function(i, value){
            var result = {};

            // create a result object that we can store in db later
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        });

    })
})

// this is to get the one article and show comments on that same page
router.get("/articles/:id",function(req,res){
    var id = req.params.id
    db.Article.findOne({_id:id}).populate("comment").then(function(dbLibrary){
        console.log("This is the result of the find one with populate:" + dbLibrary)
        console.log("This populates on page load" + dbLibrary);
        let id = dbLibrary._id;
        let comment = dbLibrary.comment
        console.log("This is from the db. All comments for this article0" +  comment)
        res.render("comments", {id, comment})
    }).catch(function(err){
        console.log(err);
    })
})

// this is to post comments
router.post("/articles/:id",function(req,res){
    console.log("HERE IS THE REQUEST" + req.body.title)
    var id = req.params.id
    console.log(id)
    db.Comment.create({title:req.body.title, body:req.body.body}).then(function(dbNote){
        console.log(dbNote._id)
        return db.Article.findOneAndUpdate({_id:id},{$push: {comment: dbNote._id}}, {new: true})
    }).then(function(dbresult){

        console.log("after the find one and update" + dbresult)
        res.json(dbresult)
    }).
    catch(function(err){
        console.log(err);
    })
})


module.exports = router;