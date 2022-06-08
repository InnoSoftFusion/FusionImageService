
/**
 * Constructor.
 */

function InMemoryCache(clientCreds, passwordCreds) {
  this.clients = clientCreds;
  this.tokens = [];
  this.users = passwordCreds;
  //this.dump()
}

/**
 * Dump the cache.
 */

InMemoryCache.prototype.dump = function() {
  console.log('clients', this.clients);
  console.log('tokens', this.tokens);
  console.log('users', this.users);
};

/*
 * Get access token.
 */

InMemoryCache.prototype.getAccessToken = function(bearerToken) {
  var tokens = this.tokens.filter(function(token) {
    return token.accessToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
};

/**
 * Get refresh token.
 */

InMemoryCache.prototype.getRefreshToken = function(bearerToken) {


  var tokens = this.tokens.filter(function(token) {
    return token.refreshToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
};

/**
 * Get client.
 */

InMemoryCache.prototype.getClient = function(clientId, clientSecret) {  
  console.log('here42')
  var clients = this.clients.filter(function(client) {
    return client.clientId === clientId && client.clientSecret === clientSecret;
  });

  return clients.length ? clients[0] : false;
};

/**
 * Save token.
 */

InMemoryCache.prototype.saveToken = function(token, client, user) {
  console.log('here22')
  var newToken = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    userId: user.id,

    //these are required in /node_modules/express-oauth-server/node_modules/oauth2-server/lib/models/token-model.js
    client: client,
    user:user,
    scope: null, //where are we taking scope from? maybe client?
  };

  this.tokens.push(newToken);
  return newToken;
};

/*
 * Get user.
 */

InMemoryCache.prototype.getUser = function(username, password) {

  console.log('here2')
  var users = this.users.filter(function(user) {
    return user.username === username && user.password === password;
  });

  return users.length ? users[0] : false;
};

InMemoryCache.prototype.getUserFromClient = function(){
  //console.log('called prototype.getUserFromClient', arguments);
  //todo: find correct user.
  console.log('here1')
  return this.users[0];
}

InMemoryCache.prototype.saveAuthorizationCode = function(){
  console.log('how is this implemented!?', arguments);
}
/**
 * Export constructor.
 */

module.exports = InMemoryCache;
