# Twixer – Social Networking Application

# Getting Started/Demo Information

Welcome! If you'd like to see out our application hosted on Heroku, please visit [twixer.xyz](https://twixer-client-7fc12e0d4cd5.herokuapp.com/). This is a full stack web application that was inspired by Twitter/X where users can post and interact with content. 
You can login with the "demouser" credentials for both fields. This account has been set up to follow several users and has an example post to showcase the different feeds and options on the site.
We hope you enjoy our app! Feel free to reach out if you have any questions.

# Technologies
Our technology stack for making this app consisted of: Node.js, Express, Sequelize, MySQL, React, Bootstrap, tanstackreact-query, JWT, Axios, Yup, react-infinite-scroll-component, Rest APIs, AWS, Heroku

# Functionalities
•	Registration for users
•	Login/logout for users and admins
•	Create posts and comments for all users
•	Users can delete their own posts/comments
•	Users can like, comment, follow users, and repost posts
•	Users can edit their profile picture, account password/username/email, and biography
•	Users can view the general feed to see recent posts
•	Users can view follower feed to see recent posts by users they are following
•	Admins can ban other users accounts, delete posts, and comments
•	All deletion is “soft deletion”, which means deleted posts and comments become invisible to all users but remain in the database with a special flag for review

# How to Run
If you would like to run our application on your own device, you will need both the frontend and backend to be running simultaneously, as well as your own database/image host. Our backend repo: https://github.com/SDarbyson/twixer-server
# Client environment variables:
REACT_APP_API_URL=

# Server environment variables:
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_HOST=
DB_PORT=
PORT=
NODE_ENV=development

JWT_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=

