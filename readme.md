# SO-Node-Blog

So-Node-Blog is an open source blog built with Node.js.

## Features

* Clean, simple, responsive and easily customizable theme.
* Local login and social media login with Facebook and Google Accounts(using Passport).
* Share/Like posts with jsSocials.
* Ability to manage blog users and comments section.
* Customizable server-side pagination.


## Quick Config

###Login:
-In login.js route: Get Facebook and Google credentials by visiting developers website for each.
-Callbacks need to be modified to reflect domain name of your blog or site.

###MongoDB:
-Change models and routes db connection to your mongoDB address(Do this for all routes and model files).
-Create 'users' and 'posts' collection in the database.

###Author:
-In view -> addpost.jade replace HTML select tag author option with your name.

###Admin:
-Simply register as admin to get admin privileges.

###Contact page:
-Add your email provider, email address and password to index.js route.

###About:
-Swap profilepic.jpg(400x400px) for your own.
-Modify jade 'about.jade' with your own biographical information.

## Built With

* Passport
* Mongoose
* bcryptjs
* CKEditor
* jsSocials
* & others

## Author

Sam Okasha

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

