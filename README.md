Simple Ride Booking Using Node.js - Express, Mysql and Sequelize

We have used Sequelize with MySQL database

For create the tables use db.sql file or use migration of sequelize
Where Sequelize migrations path should be server/storage/migrations

After creating tables use seeds if you have import sql file then no need to use migrations and seeders file

Where Sequelize seeders path should be server/storage/seeders

APIs are below:

- Create User API
    URL: http://host:9191/api/v1/user
    METHOD: POST
    HEADERS: { Content-Type: application/json },
    PARAMETERS: 
    {
        "name": "driver fourth",
        "roleid": 3,
        "mobileno": "9876543213",
        "address": "pune",
        "emailaddress":"driver4@gmail.com",
        "password": "driver4@66"
    }

- Login
    URL: http://host:9191/api/v1/user/login
    METHOD: POST
    HEADERS: { Content-Type: application/json },
    PARAMETERS: 
    {
        "mobileno": "9876543210",
        "password": "driver1@66"
    }

- Add Car
    URL: http://host:9191/api/v1/car
    METHOD: POST
    HEADERS: { Content-Type: application/json, Authorization: TOKEN },
    PARAMETERS: 
    {
        "carno": "mh12 pq 7876",
        "longitude": "9.789548",
        "latitude": "9.789588",
        "usermasterid": 9,
        "createdby": "9876543212"
    }

- Get nearby Cabs
    URL: http://host:9191/api/v1/car/nearby?longitude=10.779578&latitude=10.779578
    METHOD: GET
    HEADERS: { Content-Type: application/json, Authorization: TOKEN },

- Book cab
    URL: http://host:9191/api/v1/book
    METHOD: POST
    HEADERS: { Content-Type: application/json, Authorization: TOKEN },
    PARAMETERS: 
    {
        "pickup_longitude": 10.779578,
        "pickup_latitude": 10.779578,
        "drop_longitude": 10.789578,
        "drop_latitude": 10.789568,
        "rideamount": 820,
        "usermasterid": 1,
        "createdby": "8329601132"
    }

- Update ride details
    URL: http://host:9191/api/v1/updateride
    METHOD: PUT
    HEADERS: { Content-Type: application/json, Authorization: TOKEN },
    PARAMETERS: 
    {
        "bookingotp": "611471",
        "carno": "mh14 hq 7895",
        "action": "dropped",
        "usermasterid": 1,
        "lastmodifiedby": "9876543210"
    }

- Get useriwse ride details with pagination
    URL: http://host:9191/api/v1/user/getridedetails?usermasterid=1&page=1&pagesize=100
    METHOD: GET
    HEADERS: { Content-Type: application/json, Authorization: TOKEN },

* POSTMAN DOCUMENTATION LINK: https://documenter.getpostman.com/view/5568418/Tzz7McT6