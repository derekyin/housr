const express = require('express')
    , passport = require('passport')
    , session = require('express-session')
    , docusign = require('docusign-esign')
    , moment = require('moment')
    , fs = require('fs-extra')
    , path = require('path')
    , {promisify} = require('util') // http://2ality.com/2017/05/util-promisify.html
    ;

const app = express()
    , port = process.env.PORT || 3000
    , host = process.env.HOST || 'localhost'
    , hostUrl = 'http://' + host + ':' + port
    , clientID = process.env.DS_CLIENT_ID || '29439835-8e77-40d7-ac67-bbfb647c5590'
    , clientSecret = process.env.DS_CLIENT_SECRET || '1c71e5a1-2508-4b16-994e-3c757130bc96'
    , signerEmail = process.env.DS_SIGNER_EMAIL || 'kliylekli25@gmail.com'
    , signerName = process.env.DS_SIGNER_NAME || 'Kyle Li'
    , templateId = process.env.DS_TEMPLATE_ID || '91c25aa0-b15c-4994-acee-cf09deddddac'
    , baseUriSuffix = '/restapi'
    , testDocumentPath = '../demo_documents/test.pdf'
    , test2DocumentPath = '../demo_documents/battle_plan.docx'
    ;

let apiClient // The DocuSign API object
  , accountId // The DocuSign account that will be used
  , baseUri // the DocuSign platform base uri for the account.
  , eg // The example that's been requested
  ;

// Configure Passport
passport.use(new docusign.OAuthClient({
    sandbox: true,
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: hostUrl + '/auth/callback',
    state: true // automatic CSRF protection.
    // See https://github.com/jaredhanson/passport-oauth2/blob/master/lib/state/session.js
  },
  function (accessToken, refreshToken, params, user, done) {
    // The params arg will be passed additional parameters of the grant.
    // See https://github.com/jaredhanson/passport-oauth2/pull/84
    //
    // Here we're just assigning the tokens to the user profile object but we
    // could be using session storage or any other form of transient-ish storage
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.expiresIn = params.expires_in;
    // Calculate the time that the token will expire
    user.expires = moment().add(user.expiresIn, 's');
    return done(null, user);
  }
));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {done(null, user)});
passport.deserializeUser(function(obj, done) {done(null, obj)});

// Configure the webserver
app.use(session({
  secret: 'secret token',
  resave: true,
  saveUninitialized: true
}))
.use(passport.initialize())
.use(passport.session())
/* Home page */
.get('/', function (req, res) {
  res.send(`<h2>Home page</h2>
<h3><a href="/go?eg=3">Send Lease Aggrement to Your Email</a></h3>
`)})
/* Page for starting OAuth Authorization Code Grant */
.get('/auth', function (req, res, next) {
  passport.authenticate('docusign')(req, res, next);
})
/* Page for handling OAuth Authorization Code Grant callback */
.get('/auth/callback', [dsLoginCB1, dsLoginCB2])
/* Page to receive pings from the DocuSign embedded Signing Ceremony */
.get('/dsping', dsPingController)
/* Middleware: ensure that we have a DocuSign token. Obtain one if not. */
/*             checkToken will apply to all subsequent routes. */
.use(checkToken)
/* Page to execute an example */
.get('/go', goPageController)

/* Start the web server */
if (clientID === '{CLIENT_ID}') {
  console.log(`PROBLEM: You need to set the Client_ID (Integrator Key), and perhaps other settings as well. You can set them in the source or set environment variables.`);
} else {
  app.listen(port, host, function (err) {
    if (err) {
      throw err;
    }
    console.log(`Ready! Open ${hostUrl}`);
  });
}

/**
 * Middleware: check that a token is available to be used.
 * If not, start the authorization process
 */
function checkToken(req, res, next){
  if (req.query.eg){
    req.session.eg = req.query.eg; // Save the requested example number
  }
  // Do we have a token that can be used?
  // Use a 30 minute buffer time to enable the user to fill out
  // a request form and send it.
  let tokenBufferMin = 30
    , now = moment();
  if (tokenBufferMin && req.user && req.user.accessToken &&
       now.add(tokenBufferMin, 'm').isBefore(req.user.expires)) {
    console.log ('\nUsing existing access token.')
    next()
  } else {
    console.log ('\nGet a new access token.');
    res.redirect('/auth');
  }
}

/**
 * Page controller for processing the OAuth callback
 */
function dsLoginCB1 (req, res, next) {
  passport.authenticate('docusign', { failureRedirect: '/auth' })(req, res, next)
}
function dsLoginCB2 (req, res, next) {
  console.log(`Received access_token: ${req.user.accessToken.substring(0,15)}...`);
  console.log(`Expires at ${req.user.expires.format("dddd, MMMM Do YYYY, h:mm:ss a")}`);
  // If an example was not requested, redirect to home
  if (req.session.eg) {res.redirect('/go')
  } else {res.redirect('/')}
}

/**
 * Page controller for executing an example.
 * Uses the session.eg saved parameter
 */
function goPageController (req, res, next) {
  // getting the API client ready
  apiClient = new docusign.ApiClient();
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + req.user.accessToken);

  // The DocuSign Passport strategy looks up the user's account information via OAuth::userInfo.
  // See https://developers.docusign.com/esign-rest-api/guides/authentication/user-info-endpoints
  // We want the user's account_id, account_name, and base_uri
  // A user can (and often) belongs to multiple accounts.
  // You can search for a specific account the user has, or
  // give the user the choice of account to use, or use
  // the user's default account. This example used the default account.
  //
  // The baseUri changes rarely so it can (and should) be cached.
  //
  // req.user holds the result of DocuSign OAuth::userInfo and tokens.
  getDefaultAccountInfo(req.user.accounts)
  apiClient.setBasePath(baseUri); // baseUri is specific to the account
  docusign.Configuration.default.setDefaultApiClient(apiClient);
  createEnvelopeFromTemplate(accountId)
}

function createEnvelopeFromTemplate (accountId) {
  if (templateId === '{TEMPLATE_ID}') {
    let msg = `
PROBLEM: The templateId must be set before this example can be used.
<br>Set the templateId by modifying the source or using environment
variable <tt>DS_TEMPLATE_ID</tt>.
<p style="margin-top:1em">Creating the template:
<ol>
<li>See <a href="https://support.docusign.com/guides/ndse-user-guide-create-templates">Template instructions</a></li>
<li>For this example, the template must have a role named <tt>signer1</tt></li>
<li><a href="https://support.docusign.com/en/guides/ndse-user-guide-locate-template-id">Look up the template id</a>
and then either add it to this example's source or use the <tt>DS_TEMPLATE_ID</tt>
environment variable.</li>
<li>Restart the example's server and repeat the Envelope from a template example.</li>
</ol>
`
    return {msg: msg}
  }

  // create a new envelope object
  let envDef = new docusign.EnvelopeDefinition();
  envDef.emailSubject = 'Please sign this document sent from Node SDK';
  envDef.templateId = templateId;

  // create a template role object. It is used to assign data to a template's role.
  let tRole = docusign.TemplateRole.constructFromObject(
    {roleName: 'signer1', name: signerName, email: signerEmail});
  // create an array of template roles. In this case, there's just one
  envDef.templateRoles = [tRole];

  // send the envelope by setting |status| to 'sent'. To save as a draft set to 'created'
  envDef.status = 'sent';

  // instantiate a new EnvelopesApi object
  let envelopesApi = new docusign.EnvelopesApi();
  // The createEnvelope() API is async and uses a callback
  // Promises are more convenient, so we promisfy it.
  let createEnvelope_promise = make_promise(envelopesApi, 'createEnvelope');
  return (
    createEnvelope_promise(accountId, {'envelopeDefinition': envDef})
    .then ((result) => {
      let msg = `\nCreated the envelope! Result: ${JSON.stringify(result)}`
      console.log(msg);
      return {msg: msg};
    })
    .catch ((err) => {
      // If the error is from DocuSign, the actual error body is available in err.response.body
      let errMsg = err.response && err.response.body && JSON.stringify(err.response.body)
        , msg = `\nException while creating the envelope! Result: ${err}`;
      if (errMsg) {
        msg += `. API error message: ${errMsg}`;
      }
      console.log(msg);
      return {msg: msg};
    })
  )
}

function dsPingController (req, res) {
  // This function is called periodically via AJAX from the
  // DocuSign Signing Ceremony. The AJAX calls include cookiers and
  // will keep our session fresh.
  // Any return values are ignored.
  console.log ('\nDocuSign PING received.');
  res.send()
}

/**
 * Set the variables accountId and baseUri from the default
 * account information.
 * @param {array} accounts Array of account information returned by
 *        OAuth::userInfo
 */
function getDefaultAccountInfo(accounts){
  let defaultAccount = accounts.find ((item) => item.is_default);
  console.log (`Default account "${defaultAccount.account_name}" (${defaultAccount.account_id})`);
  accountId = defaultAccount.account_id;
  console.log(accountId)
  baseUri =  `${defaultAccount.base_uri}${baseUriSuffix}`
}

/**
 * Return a promise version of an SDK method.
 * @param {object} obj a DocSign SDK object. Eg obj = new docusign.EnvelopesApi()
 * @param {string} method_name The string name of a method. Eg createEnvelope
 */
function make_promise(obj, method_name){
  let promise_name = method_name + '_promise';
  if (!(promise_name in obj)) {
    obj[promise_name] = promisify(obj[method_name]).bind(obj)
  }
  return obj[promise_name]
}