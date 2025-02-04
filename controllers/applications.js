const User = require('../models/user')

// page of add app
function newApplication(req,res){
 res.render('applications/new.ejs',{title:'Add New Application'})
}

//post the add new
async function createApplication (req,res){
    console.log(req.body);
    const currentUser= await User.findById(req.params.userId)
    currentUser.applications.push(req.body)//pushing the form data into user model
    await currentUser.save()// it will save the push

    res.redirect(`/users/${currentUser._id}/applications`)
}   

function index(req,res){
    res.render('applications/index.ejs',{title:'Your Applications'})
}


//=================
module.exports={
    newApplication,
    createApplication,
    index,
}