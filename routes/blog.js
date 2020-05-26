const express=require("express");
const router=express();
const post = require('../models/posts')
const bodyParser=require("body-parser");
const path = require('path')
const multer = require('multer');
var _ = require('lodash');
const MarioChar = require('../models/mariochar');




const storage=multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});
const upload= multer({
    storage: storage
}).single('postphoto');


 router.use(bodyParser.urlencoded({extended: true}));


router.use('/:id',express.static("./public")); 
router.use('/',express.static("./public")); 

router.get("/:id/blog",function(request,response){
    post.find({},function(err,foundtpost){
        
            if(err)
            console.log(err);
            else
            response.render("blog",{post: foundtpost});
        });
    
});


router.get("/:id/compose",function(request,response){
    response.render("compose");
});

router.post("/:id/compose",async(req,res) => {
    var author_id=req.params.id;
    
    await MarioChar.findOne({_id:author_id}).then(user=>{
        var author_name =  user.username
        // console.log(author_name)
    
    console.log(author_id)
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = date + "/" + month + "/" + year;

    upload(req,res, async(err) => {
        if(err){
            res.render("dashboard",{
                msg: err
            });
        }
        else{
             const newpost=await new post({
                // _id:getNextSequence("userid"),
                title: req.body.posttitle,
                postBody: req.body.postbody,
                update:  dateStr,
                picname: req.file.filename,
                 authorid: author_id,
                 authorname:author_name,
                 
                
               
                
            });
            newpost.save(function(err){
                if(!err)
                {
                   

                res.redirect(`./account`);
                }   else{
                    console.log(err)
                    };
                
             });  
        }
    });
});
   
    
}); 


 router.get("/:id/post/:postid",function(request,response){
     const search=request.params.postid;
     
     post.findOne({_id: search},function(err,finditem){
        response.render("posts",{title: finditem.title,postBody: finditem.postBody,picname: finditem.picname,author:finditem.authorname});
     });
 });
router.post("/:id/delpost",function(request,response){
    const t=request.body.delpost;
    var accountid=request.params.id;
    console.log(t);
    post.deleteOne({title: t},function(err){
        if(err)
        console.log(err);
        else
        {
        console.log("deleted");
        response.redirect(`./account`);
        } 
    });
});

router.post("/:id/updatepost",function(request,response){
    const t=request.body.updatepost;
   console.log(t)
   post.findOne({title: t},function(err,foundpost){
        if(err)
        console.log(err);
        else
        response.render("update",{post:foundpost});
    });

});

router.post("/:id/updatedpost",function(req,res){
    
   var changepicture;

    upload(req,res, (err) => {
        if(err){
            res.render("doc",{
                msg: err
            });
        }
        else{
            const search=req.body.updatepost;
            const changetitle=req.body.posttitle;
            const changebody= req.body.postbody;
            console.log(search);
            console.log(changetitle);
            console.log(changebody);
            if(req.file!==undefined)
            {
                 const changepicture=req.file.filename;
                 
                 post.updateOne({title: search},{title: changetitle,postBody: changebody,picname: changepicture},function(err){
                if(err)
                console.log(err);
                else
                {
                    console.log("updated");
                    res.redirect("./account");
                }
        });

            }
            else
            {
                post.updateOne({title: search},{title: changetitle,postBody: changebody},function(err){
                    if(err)
                    console.log(err);
                    else
                    {
                        console.log("updated");
                        res.redirect("./account");
                    }
            });
            }
           
        }
    });
  
});



router.get("/:id/account",async function(request,response){
    var search=request.params.id;
    await MarioChar.findOne({_id:search}).then(user=>{
        var author_name =  user.username
        

    
    post.find({authorname:author_name},function(err,foundtpost){
        
            if(err)
            console.log(err);
            else
            response.render("doc",{post: foundtpost});
    });   

   
})   

});

//subscribe

router.post("/:id/subscribe",async(req,res) => {
    var author_id=req.params.id;
    
    await MarioChar.findOne({_id:author_id}).then(user=>{
        var author_name =  user.username
        // console.log(author_name)
    
    console.log(author_id)
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = date + "/" + month + "/" + year;

    upload(req,res, async(err) => {
        if(err){
            res.render("dashboard",{
                msg: err
            });
        }
        else{
             const newpost=await new post({
                // _id:getNextSequence("userid"),
                title: req.body.posttitle,
                postBody: req.body.postbody,
                update:  dateStr,
                picname: req.file.filename,
                 authorid: author_id,
                 authorname:author_name,
                 
                
               
                
            });
            newpost.save(function(err){
                if(!err)
                {
                   

                res.redirect(`./account`);
                }   else{
                    console.log(err)
                    };
                
             });  
        }
    });
});
   
    
}); 


module.exports = router;


