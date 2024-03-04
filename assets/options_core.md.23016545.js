import{_ as a,c as n,o as s,a as e}from"./app.a041353f.js";const g='{"title":"Overview","description":"","frontmatter":{},"headers":[{"level":2,"title":"initSync","slug":"initsync"},{"level":2,"title":"rolesKey","slug":"roleskey"},{"level":2,"title":"rememberKey","slug":"rememberkey"},{"level":2,"title":"staySignedInKey","slug":"staysignedinkey"},{"level":2,"title":"tokenDefaultKey","slug":"tokendefaultkey"},{"level":2,"title":"tokenImpersonateKey","slug":"tokenimpersonatekey"},{"level":2,"title":"stores","slug":"stores"},{"level":2,"title":"cookie","slug":"cookie"},{"level":2,"title":"authRedirect","slug":"authredirect"},{"level":2,"title":"forbiddenRedirect","slug":"forbiddenredirect"},{"level":2,"title":"notFoundRedirect","slug":"notfoundredirect"},{"level":2,"title":"registerData","slug":"registerdata"},{"level":3,"title":"autoLogin","slug":"autologin"},{"level":3,"title":"staySignedIn","slug":"staysignedin"},{"level":2,"title":"loginData","slug":"logindata"},{"level":2,"title":"logoutData","slug":"logoutdata"},{"level":2,"title":"oauth2Data","slug":"oauth2data"},{"level":2,"title":"refreshToken","slug":"refreshtoken"},{"level":3,"title":"interval","slug":"interval"},{"level":2,"title":"impersonateData","slug":"impersonatedata"},{"level":2,"title":"unimpersonateData","slug":"unimpersonatedata"}],"relativePath":"options/core.md","lastUpdated":1709560317000}',t={},o=e(`<h1 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-hidden="true">#</a></h1><div class="language-ts"><pre><code><span class="token keyword">type</span> <span class="token class-name">Options</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  initSync<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>

  <span class="token comment">//var</span>
  rolesKey<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
  rememberKey<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
  userKey<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
  staySignedInKey<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
  tokenDefaultKey<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
  tokenImpersonateKey<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
  stores<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>
    <span class="token operator">|</span> <span class="token string">&quot;cookie&quot;</span>
    <span class="token operator">|</span> <span class="token string">&quot;storage&quot;</span>
    <span class="token operator">|</span> <span class="token punctuation">{</span>
        set<span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">,</span> expires<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span> auth<span class="token operator">:</span> Auth<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
        get<span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token constant">T</span>
        <span class="token function-variable function">remove</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span>
      <span class="token punctuation">}</span>
  <span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">]</span>
  cookie<span class="token operator">?</span><span class="token operator">:</span> CookieOptions

  <span class="token comment">// Redirects</span>

  authRedirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw
  forbiddenRedirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw
  notFoundRedirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw

  <span class="token comment">// Http</span>

  registerData<span class="token operator">?</span><span class="token operator">:</span> HttpData <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    keyUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
    autoLogin<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    staySignedIn<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    remember<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
  loginData<span class="token operator">?</span><span class="token operator">:</span> HttpData <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    keyUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    staySignedIn<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    remember<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    cacheUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>

  logoutData<span class="token operator">?</span><span class="token operator">:</span> HttpData <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    makeRequest<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
  fetchData<span class="token operator">?</span><span class="token operator">:</span> HttpData <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    keyUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span>
    enabled<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    cache<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    enabledInBackground<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    waitRefresh<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
  refreshToken<span class="token operator">?</span><span class="token operator">:</span> Omit<span class="token operator">&lt;</span>HttpData<span class="token punctuation">,</span> <span class="token string">&quot;redirect&quot;</span><span class="token operator">&gt;</span> <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    enabled<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    enabledInBackground<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    interval<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span>
  impersonateData<span class="token operator">?</span><span class="token operator">:</span> HttpData <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    cacheUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
  unimpersonateData<span class="token operator">?</span><span class="token operator">:</span> HttpData <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    makeRequest<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    cacheUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
  oauth2Data<span class="token operator">?</span><span class="token operator">:</span> HttpData <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// Plugin</span>

  plugins<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    router<span class="token operator">?</span><span class="token operator">:</span> Router
  <span class="token punctuation">}</span>

  <span class="token comment">// Driver</span>

  drivers<span class="token operator">:</span> <span class="token punctuation">{</span>
    auth<span class="token operator">:</span> AuthDriver
    http<span class="token operator">:</span> <span class="token punctuation">{</span>
      request<span class="token operator">:</span> AxiosInstance
      invalidToken<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>auth<span class="token operator">:</span> Auth<span class="token punctuation">,</span> response<span class="token operator">:</span> AxiosResponse<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">boolean</span>
    <span class="token punctuation">}</span>
    oauth2<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      facebook<span class="token operator">?</span><span class="token operator">:</span> OAuth2Driver
      google<span class="token operator">?</span><span class="token operator">:</span> OAuth2Driver
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><p>The set of core options.</p><h2 id="initsync" tabindex="-1">initSync <a class="header-anchor" href="#initsync" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> <span class="token builtin">boolean</span>
 @<span class="token keyword">default</span> <span class="token string">&#39;false&#39;</span>
</code></pre></div><p>The default <code>vue-auth3</code> will not perform <code>auth</code> authentication until a router is processed which leads to inside dependencies receiving results that are not ready. this option allows <code>vue-auth3</code> to authenticate on initialization</p><h2 id="roleskey" tabindex="-1">rolesKey <a class="header-anchor" href="#roleskey" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> <span class="token builtin">string</span>
 @<span class="token keyword">default</span> <span class="token string">&#39;roles&#39;</span>
</code></pre></div><p>The default field to check against on the user object when using &quot;auth meta&quot; or <code>$auth.check()</code>.</p><blockquote><p>The key also supports dot notation as in &quot;my.role.key&quot;.</p></blockquote><h4 id="references" tabindex="-1">References <a class="header-anchor" href="#references" aria-hidden="true">#</a></h4><ul><li><a href="/guide/auth-meta.html">Auth Meta Guide</a></li><li><a href="/methods/init.html#check">check() Method</a></li></ul><h2 id="rememberkey" tabindex="-1">rememberKey <a class="header-anchor" href="#rememberkey" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> <span class="token builtin">string</span>
 @<span class="token keyword">default</span> <span class="token string">&#39;auth_remember&#39;</span>
</code></pre></div><p>The name under which the remember <code>string</code> is stored under.</p><h4 id="references-1" tabindex="-1">References <a class="header-anchor" href="#references-1" aria-hidden="true">#</a></h4><ul><li><a href="/methods/utils.html#remember">remember() Method</a></li></ul><h2 id="staysignedinkey" tabindex="-1">staySignedInKey <a class="header-anchor" href="#staysignedinkey" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> <span class="token builtin">string</span>
 @<span class="token keyword">default</span> <span class="token string">&#39;auth_stay_signed_in&#39;</span>
</code></pre></div><p>The name under which the staySignedIn option from login is stored.</p><h4 id="references-2" tabindex="-1">References <a class="header-anchor" href="#references-2" aria-hidden="true">#</a></h4><ul><li><a href="/methods/register-and-login.html#login">login() Method</a></li></ul><h2 id="tokendefaultkey" tabindex="-1">tokenDefaultKey <a class="header-anchor" href="#tokendefaultkey" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> <span class="token builtin">string</span>
 @<span class="token keyword">default</span> <span class="token string">&#39;auth_token_default&#39;</span>
</code></pre></div><p>The name under which the default token <code>String</code> is stored under.</p><h4 id="references-3" tabindex="-1">References <a class="header-anchor" href="#references-3" aria-hidden="true">#</a></h4><ul><li><a href="/guide/token.html">Token Guide</a></li></ul><h2 id="tokenimpersonatekey" tabindex="-1">tokenImpersonateKey <a class="header-anchor" href="#tokenimpersonatekey" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> <span class="token builtin">string</span>
 @<span class="token keyword">default</span> <span class="token string">&#39;auth_token_impersonate&#39;</span>
</code></pre></div><p>The name under which the impersonate token <code>String</code> is stored under.</p><h4 id="references-4" tabindex="-1">References <a class="header-anchor" href="#references-4" aria-hidden="true">#</a></h4><ul><li><a href="/guide/token.html">Token Guide</a></li></ul><h2 id="stores" tabindex="-1">stores <a class="header-anchor" href="#stores" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> <span class="token punctuation">(</span><span class="token string">&quot;storage&quot;</span> <span class="token operator">|</span> <span class="token string">&quot;cookie&quot;</span> <span class="token operator">|</span> <span class="token punctuation">{</span>
    <span class="token function-variable function">get</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">any</span><span class="token punctuation">;</span>
    <span class="token function-variable function">set</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> val<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> expires<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function-variable function">remove</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">]</span>
 @<span class="token keyword">default</span> <span class="token punctuation">[</span><span class="token string">&#39;storage&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;cookie&#39;</span><span class="token punctuation">]</span>
</code></pre></div><p>The order in which to attempt storage of &quot;token&quot; and &quot;remember&quot; <code>String</code> data.</p><h4 id="references-5" tabindex="-1">References <a class="header-anchor" href="#references-5" aria-hidden="true">#</a></h4><ul><li><a href="/guide/token.html">Token Guide</a></li></ul><h2 id="cookie" tabindex="-1">cookie <a class="header-anchor" href="#cookie" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> <span class="token punctuation">{</span>
    path<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
    domain<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
    secure<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
    expires<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
    sameSite<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 @<span class="token keyword">default</span>  <span class="token punctuation">{</span>
    path<span class="token operator">:</span> <span class="token string">&quot;/&quot;</span><span class="token punctuation">,</span>
    domain<span class="token operator">:</span> <span class="token keyword">void</span> <span class="token number">0</span><span class="token punctuation">,</span>
    secure<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    expires<span class="token operator">:</span> <span class="token number">12096e5</span><span class="token punctuation">,</span>
    sameSite<span class="token operator">:</span> <span class="token string">&quot;None&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
</code></pre></div><p>The default params that will be set on cookies when cookie storage is enabled.</p><h4 id="references-6" tabindex="-1">References <a class="header-anchor" href="#references-6" aria-hidden="true">#</a></h4><ul><li><a href="/guide/cookie.html">Cookie Guide</a></li></ul><h2 id="authredirect" tabindex="-1">authRedirect <a class="header-anchor" href="#authredirect" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> RouteLocationRaw<span class="token punctuation">;</span>
 @<span class="token keyword">default</span> <span class="token punctuation">{</span>
    path<span class="token operator">:</span> <span class="token string">&quot;/login&quot;</span>
 <span class="token punctuation">}</span>
</code></pre></div><p>The router redirect to use if any authentication is required on a route.</p><p>This will trigger if <code>meta.auth</code> is set to anything other than <code>undefined</code> or <code>false</code>.</p><blockquote><p>This also accepts a callback function which passes the transition for dynamic handling.</p></blockquote><h4 id="references-7" tabindex="-1">References <a class="header-anchor" href="#references-7" aria-hidden="true">#</a></h4><ul><li><a href="/guide/auth-meta.html">Auth Meta Guide</a></li><li><a href="/methods/init.html#check">check() Method</a></li></ul><h2 id="forbiddenredirect" tabindex="-1">forbiddenRedirect <a class="header-anchor" href="#forbiddenredirect" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> RouteLocationRaw<span class="token punctuation">;</span>
 @<span class="token keyword">default</span> <span class="token punctuation">{</span>
    path<span class="token operator">:</span> <span class="token string">&quot;/403&quot;</span>
 <span class="token punctuation">}</span>
</code></pre></div><p>The router redirect to use if a route is forbidden.</p><p>This will trigger if the user object&#39;s role property does not match up with the auth value.</p><blockquote><p>This also accepts a callback function which passes the transition for dynamic handling.</p></blockquote><h4 id="references-8" tabindex="-1">References <a class="header-anchor" href="#references-8" aria-hidden="true">#</a></h4><ul><li><a href="/guide/auth-meta.html">Auth Meta Guide</a></li></ul><h2 id="notfoundredirect" tabindex="-1">notFoundRedirect <a class="header-anchor" href="#notfoundredirect" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> RouteLocationRaw<span class="token punctuation">;</span>
 @<span class="token keyword">default</span> <span class="token punctuation">{</span>
    path<span class="token operator">:</span> <span class="token string">&quot;/404&quot;</span>
 <span class="token punctuation">}</span>
</code></pre></div><p>The router redirect to use if route is &quot;not found&quot;.</p><p>Typically used to hide pages while logged in. For instance we don&#39;t want the user to access a login or register page while they are authenticated. Hence a &quot;404 Not Found&quot;.</p><p>This will trigger if <code>auth.meta</code> is set to false and the user is already authenticated.</p><blockquote><p>This also accepts a callback function which passes the transition for dynamic handling.</p></blockquote><h4 id="references-9" tabindex="-1">References <a class="header-anchor" href="#references-9" aria-hidden="true">#</a></h4><ul><li><a href="/guide/auth-meta.html">Auth Meta Guide</a></li></ul><h2 id="registerdata" tabindex="-1">registerData <a class="header-anchor" href="#registerdata" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span>  AxiosRequestConfig <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
  redirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw
    autoLogin<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    staySignedIn<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    remember<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
 @<span class="token keyword">default</span> <span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">&quot;auth/register&quot;</span><span class="token punctuation">,</span>
    method<span class="token operator">:</span> <span class="token string">&quot;POST&quot;</span><span class="token punctuation">,</span>
    redirect<span class="token operator">:</span> <span class="token string">&quot;/login&quot;</span><span class="token punctuation">,</span>
    autoLogin<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
</code></pre></div><p>Default register request data.</p><blockquote><p>If the <code>autoLogin</code> is enabled it will subsequently trigger a login call. All options available to the login method will also be available here.</p></blockquote><h4 id="references-10" tabindex="-1">References <a class="header-anchor" href="#references-10" aria-hidden="true">#</a></h4><ul><li><a href="/guide/requests.html">Requests Guide</a></li><li><a href="/methods/register-and-login.html#register">register() Method</a></li><li><a href="/options/options-generate.html#redirect">redirect Option</a></li></ul><h3 id="autologin" tabindex="-1">autoLogin <a class="header-anchor" href="#autologin" aria-hidden="true">#</a></h3><div class="language-ts"><pre><code>@<span class="token keyword">typeof</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
</code></pre></div><p>Specify when the user should be auto logged in.</p><p>Used in register method.</p><h3 id="staysignedin" tabindex="-1">staySignedIn <a class="header-anchor" href="#staysignedin" aria-hidden="true">#</a></h3><div class="language-ts"><pre><code>@<span class="token keyword">typeof</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
</code></pre></div><p>Specify whether the token data stored will be long lived or not.</p><p>Meaning does it expire after the browser is closed or not.</p><h2 id="logindata" tabindex="-1">loginData <a class="header-anchor" href="#logindata" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span>  AxiosRequestConfig <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
  redirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    staySignedIn<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    remember<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    cacheUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
 @<span class="token keyword">default</span><span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">&quot;auth/login&quot;</span><span class="token punctuation">,</span>
    method<span class="token operator">:</span> <span class="token string">&quot;POST&quot;</span><span class="token punctuation">,</span>
    redirect<span class="token operator">:</span> <span class="token string">&quot;/&quot;</span><span class="token punctuation">,</span>
    fetchUser<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    staySignedIn<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
</code></pre></div><p>Default login request data.</p><h4 id="references-11" tabindex="-1">References <a class="header-anchor" href="#references-11" aria-hidden="true">#</a></h4><ul><li><a href="/guide/requests.html">Requests Guide</a></li><li><a href="/methods/register-and-login.html#login">login() Method</a></li><li><a href="/options/options-generate.html#redirect">redirect Option</a></li><li><a href="/options/options-generate.html#fetchuser">fetchUser Option</a></li><li><a href="/options/options-generate.html#staysignedin">staySignedIn Option</a></li></ul><h2 id="logoutdata" tabindex="-1">logoutData <a class="header-anchor" href="#logoutdata" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span>  AxiosRequestConfig <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
  redirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw
    makeRequest<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
 @<span class="token keyword">default</span> <span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">&quot;auth/logout&quot;</span><span class="token punctuation">,</span>
    method<span class="token operator">:</span> <span class="token string">&quot;POST&quot;</span><span class="token punctuation">,</span>
    redirect<span class="token operator">:</span> <span class="token string">&quot;/&quot;</span><span class="token punctuation">,</span>
    makeRequest<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre></div><p>Default logout request data.</p><h4 id="references-12" tabindex="-1">References <a class="header-anchor" href="#references-12" aria-hidden="true">#</a></h4><ul><li><a href="/guide/requests.html">Requests Guide</a></li><li><a href="/methods/register-and-login.html#logout">logout() Method</a></li><li><a href="/options/options-generate.html#redirect">redirect Option</a></li><li><a href="/options/options-generate.html#makerequest">makeRequest Option</a></li></ul><h2 id="oauth2data" tabindex="-1">oauth2Data <a class="header-anchor" href="#oauth2data" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span>  AxiosRequestConfig <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
  redirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span>
 @<span class="token keyword">default</span> <span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">&quot;auth/social&quot;</span><span class="token punctuation">,</span>
    method<span class="token operator">:</span> <span class="token string">&quot;POST&quot;</span><span class="token punctuation">,</span>
    redirect<span class="token operator">:</span> <span class="token string">&quot;/&quot;</span><span class="token punctuation">,</span>
    fetchUser<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre></div><p>Default oauth2 request data.</p><blockquote><p>After a token is received and the API request is made this will execute via the login method. All options available to the login method will also be available here.</p></blockquote><h4 id="references-13" tabindex="-1">References <a class="header-anchor" href="#references-13" aria-hidden="true">#</a></h4><ul><li><a href="/guide/oauth2.html">OAuth2 Guide</a></li><li><a href="/guide/requests.html">Requests Guide</a></li><li><a href="/methods/register-and-login.html#oauth2">oauth2() Method</a></li><li><a href="/options/options-generate.html#redirect">redirect Option</a></li><li><a href="/options/options-generate.html#fetchuser">fetchUser Option</a></li></ul><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span>  AxiosRequestConfig <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
  redirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw
    enabled<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    cache<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    enabledInBackground<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
 @<span class="token keyword">default</span><span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">&quot;auth/user&quot;</span><span class="token punctuation">,</span>
    method<span class="token operator">:</span> <span class="token string">&quot;GET&quot;</span><span class="token punctuation">,</span>
    enabled<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre></div><p>Default fetch request data.</p><h4 id="references-14" tabindex="-1">References <a class="header-anchor" href="#references-14" aria-hidden="true">#</a></h4><ul><li><a href="/guide/requests.html">Requests Guide</a></li><li><a href="/methods/user-data.html#fetch">fetch() Method</a></li><li><a href="/options/options-generate.html#enabled">enabled Option</a></li><li><a href="/options/options-generate.html#enabledInBackground">enabledInBackground Option</a></li></ul><h2 id="refreshtoken" tabindex="-1">refreshToken <a class="header-anchor" href="#refreshtoken" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span> AxiosRequestConfig <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
    enabled<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    enabledInBackground<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    interval<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">|</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span>
 @<span class="token keyword">default</span><span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">&quot;auth/refresh&quot;</span><span class="token punctuation">,</span>
    method<span class="token operator">:</span> <span class="token string">&quot;GET&quot;</span><span class="token punctuation">,</span>
    enabled<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    interval<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre></div><p>Default refresh request data.</p><h4 id="references-15" tabindex="-1">References <a class="header-anchor" href="#references-15" aria-hidden="true">#</a></h4><ul><li><a href="/guide/requests.html">Requests Guide</a></li><li><a href="/methods/utils.html#refresh">refresh() Method</a></li><li><a href="/options/options-generate.html#enabledInBackground">enabledInBackground Option</a></li></ul><h3 id="interval" tabindex="-1">interval <a class="header-anchor" href="#interval" aria-hidden="true">#</a></h3><div class="language-ts"><pre><code>@<span class="token keyword">typeof</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
</code></pre></div><p>Specity interval length for a feature.</p><p>This is used primarily to keep token alive while a user is active on the app.</p><h2 id="impersonatedata" tabindex="-1">impersonateData <a class="header-anchor" href="#impersonatedata" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span>  AxiosRequestConfig <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
  redirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    cacheUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
 @<span class="token keyword">default</span> <span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">&quot;auth/impersonate&quot;</span><span class="token punctuation">,</span>
    method<span class="token operator">:</span> <span class="token string">&quot;POST&quot;</span><span class="token punctuation">,</span>
    redirect<span class="token operator">:</span> <span class="token string">&quot;/&quot;</span><span class="token punctuation">,</span>
    fetchUser<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre></div><p>Default impersonate request data.</p><h4 id="references-16" tabindex="-1">References <a class="header-anchor" href="#references-16" aria-hidden="true">#</a></h4><ul><li><a href="/guide/requests.html">Requests Guide</a></li><li><a href="/methods/impersonating.html#impersonate">impersonate() Method</a></li><li><a href="/options/options-generate.html#fetchuser">fetchUser Option</a></li></ul><h2 id="unimpersonatedata" tabindex="-1">unimpersonateData <a class="header-anchor" href="#unimpersonatedata" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code> @<span class="token keyword">typeof</span>  AxiosRequestConfig <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
  redirect<span class="token operator">?</span><span class="token operator">:</span> RouteLocationRaw
    fetchUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    makeRequest<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
    cacheUser<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span>
  <span class="token punctuation">}</span>
 @<span class="token keyword">default</span> <span class="token punctuation">{</span>
    url<span class="token operator">:</span> <span class="token string">&quot;auth/unimpersonate&quot;</span><span class="token punctuation">,</span>
    method<span class="token operator">:</span> <span class="token string">&quot;POST&quot;</span><span class="token punctuation">,</span>
    redirect<span class="token operator">:</span> <span class="token string">&quot;/admin&quot;</span><span class="token punctuation">,</span>
    fetchUser<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    makeRequest<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre></div><p>Default unimpersonate request data.</p><h4 id="references-17" tabindex="-1">References <a class="header-anchor" href="#references-17" aria-hidden="true">#</a></h4><ul><li><a href="/guide/requests.html">Requests Guide</a></li><li><a href="/methods/impersonating.html#unimpersonate">unimpersonate() Method</a></li><li><a href="/options/options-generate.html#redirect">redirect Option</a></li><li><a href="/options/options-generate.html#fetchuser">fetchUser Option</a></li><li><a href="/options/options-generate.html#makerequest">makeRequest Option</a></li></ul>`,117),p=[o];function r(l,c,i,u,k,d){return s(),n("div",null,p)}var f=a(t,[["render",r]]);export{g as __pageData,f as default};
