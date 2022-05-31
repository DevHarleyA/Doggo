module.exports = function (app, passport, db) {
    // home page
    app.get('/', function (req, res) {
        res.render('index.ejs')
    })

    // profile section
    app.get('/profile', isLoggedIn, function (req, res) {
        petCollection.find().toArray((err, result) => {
            if (err) return console.log(err)
            console.log(result[0].concerns)
            res.render('profile.ejs', {
                user: req.user,
                pets: result,
                concerns: result[0].concerns
            })
            
        })
        
    })

    app.get('/logout', function (req, res) {
        req.logout()
        res.redirect('/')
    })

    // CRUD methods will go here.

    // Create a New Pet
    petCollection = db.collection('kibble')

    app.post('/new', (req, res) => {
        petCollection.save({ 
            petName: req.body.petName, 
            petBreed: req.body.petBreed, 
            petDOB: req.body.petDOB, 
            concerns: [], 
            vetVisit: 0 }, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.redirect('/profile')
        })
    })

    app.post('/newConcern', (req, res) => {
        petCollection.updateOne({ 
            petName: req.body.petName}, {
                $push: {
                    concerns: {date: req.body.date, concern: req.body.concern, desc: req.body.desc}
                }
            }, 
            (err, result) => {
            if (err) return console.log(err)
            console.log('concern saved to database')
            res.redirect('/profile')
        })
    })

    // update => plus one for vet visit, minus one for vet visit
   
    // delete => delete a pet
    app.delete('/deletePet', (req, res) => {
        petCollection.findOneAndDelete({ petName: req.body.name}, (err, result) => {
          if (err) return res.send(500, err)
          res.send('Message deleted!')
        })
      })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
