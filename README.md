
### `Jwt authentication and authorization:`

=> access token stored in session storage

=> refresh token stored in httpOnly cookie


### `lifespan`
refresh token is set to 1 minutes,

this setting can be change there:

controller/auth.controller L.7 `maxAge` variable

### `lifespan` 
acces token is set to 10s,

this setting can be changed there:

controller/auth.controller L.17 `expiresIn` value



### `Misc` 
Please check the .env.sample file before test.

Front-end in "jwt-test-front" repository.

### `npm start`

Runs the app in the development mode.\


