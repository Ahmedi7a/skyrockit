const { application } = require('express');
const User = require('../models/user')

// page of add app
function newApplication(req, res) {
    res.render('applications/new.ejs', { title: 'Add New Application' })
}

//post the add new
async function createApplication(req, res) {
    try {
        console.log(req.body);
        const currentUser = await User.findById(req.params.userId)
        currentUser.applications.push(req.body)//pushing the form data into user model
        await currentUser.save()// it will save the push
        res.redirect(`/users/${currentUser._id}/applications`)
    } catch (err) {
        console.log(err)
        res.redirect('/');
    }

}
//index page and show all apps
 async function index(req, res) {
    try {
        const currentUser= await User.findById(req.params.userId);
        res.render('applications/index.ejs', { title: 'Your Applications', applications: currentUser.applications, })
    } catch (err) {
        console.log(err)
        res.redirect('/');
    }

}

//show details
async function show(req,res){
    try{
        const currentUser= await User.findById(req.params.userId);
        const application= currentUser.applications.id(req.params.applicationId);
        res.render('applications/show.ejs',{title:application.title, application})

    }catch(err){
        console.log(err)
        res.redirect('/'); 
    }
}

//delete app
async function deleteApplication(req,res){
    try{
        const currentUser= await User.findById(req.params.userId);
        currentUser.applications.id(req.params.applicationId).deleteOne();
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/applications`)
        

    }catch(err){
        console.log(err)
        res.redirect('/'); 
    }

}


//=================
module.exports = {
    newApplication,
    createApplication,
    index,
    show,
    deleteApplication,
}