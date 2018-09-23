var 		password = require('password-hash-and-salt');
var 		database = require('./entity.js');

var 		session;
var 		Users	= database.usermdl;
var			Devices = database.devicemdl;

module.exports = {

	index : function(req, res ) {

		//Recuperation variable globale session, si session il y a, redirection
		//De meme pour les routes ci-dessous
		session = req.session;
		if (!session.user)
			res.render('index', { title: 'Maestro : Une application qui les gouverne tous!' });
		else 
			res.redirect('/dashboard');
	},

	connexion : function(req, res) {
		session = req.session;
		if (!session.user)
			res.render('connexion', { title: 'Connexion à Maestro' });
		else
			res.redirect('/dashboard');
	},
	
	inscription : function(req, res) {
		session = req.session;
		if (!session.user)
			res.render('inscription', { title: 'Inscription à Maestro' });
		else
			res.redirect('/dashboard');
	},
	
	dashboard : function(req, res) {
		session = req.session;
		if (session.user)
			res.render('dashboard', { title: 'Bienvenue dans votre espace' });
		else
			res.redirect('/');
	},
	

	registration	: function (req, res) {

		session = req.session;
		if (session.user)
		{
			res.redirect('/');
			return;
		}

		if (req.body.email != '' && req.body.password != '' && req.body.first_name != '' && req.body.last_name != '')
		{
			//L'on regarde si un email est déjà utilisé
			var		query = Users.findOne({ 'email' : req.body.email });

			query.exec(function (err, person){
			
				if (err)
				{
					res.render('erro.ejs', { msg_err: 'Error.' });
					return ;
				}
				
				if (!err && person && person.email)
				{
					res.render('erro.ejs', { msg_err: 'Erreur : Utilisateur déjà enregistré!' } );
					return ;
				}
				
				//Si tout est ok, on redirige vers le dashboard et l'on crée la session
				Users({ password: req.body.password, email: req.body.email, firstname: req.body.first_name, lastname: req.body.last_name }).save(function (err) {

				session.user = req.body.email;
				res.redirect('/dashboard');
				
				});
			});
		}
	},
	authentication	: function (req, res) {

		if (session.user)
		{
			res.redirect('/');
			return ;
		}

		if (req.body.email != '' && req.body.password != '')
		{
			//L'on recupere l'user grâce à son email dans la database
			var		query = Users.findOne({ 'email' : req.body.email });

				query.exec(function (err, person){
					if (err)
					{
					 	res.render('erro.ejs', { msg_err: 'error.' });
					 	return ;
					}
				
					if (!person.password)
						res.render('erro.ejs', { msg_err: 'user not found!' });
					else
					{
						password(req.body.password).verifyAgainst(person.password, function(error, verified) {
							if(error)
								throw new Error('Something went wrong!');
							var session = req.session;
							//Si le mot de passe correspond, on lui donne une session et on le redirige
							if(verified) {
								session.user = req.body.email;
								res.redirect('/dashboard');
							} else {
								//Sinon on affiche une erreur
								res.render('erro.ejs', { msg_err: 'wrong password!' });
							}
						});
					}

				});
		}
	},
	404		: function (req, res) {
		res.send('404');
	} 

};
