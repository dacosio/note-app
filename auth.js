const validateAuth = function (username, password) {  //user authentication is stored here
    const USERS = [
        {
            "username": "john",
            "password": "123"
        },
        {
            "username": "tim",
            "password": "abc"
        }
        
    ];

    return USERS.some((user)=> {
        return user.username == username && user.password == password;
    });
};

module.exports = validateAuth;