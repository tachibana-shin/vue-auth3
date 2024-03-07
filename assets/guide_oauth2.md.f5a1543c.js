import{_ as a,c as s,o as n,a as t}from"./app.6a9cb9d5.js";const w='{"title":"Resources","description":"","frontmatter":{},"headers":[{"level":2,"title":"Resources","slug":"resources"},{"level":3,"title":"Step 1: Social Redirect","slug":"step-1-social-redirect"},{"level":3,"title":"Step 2: API call","slug":"step-2-api-call"},{"level":2,"title":"State","slug":"state"},{"level":2,"title":"Window","slug":"window"}],"relativePath":"guide/oauth2.md","lastUpdated":1709817554000}',e={},o=t(`<p>The main thing to keep in mind with making OAuth requests is that the process takes two steps.</p><h2 id="resources" tabindex="-1">Resources <a class="header-anchor" href="#resources" aria-hidden="true">#</a></h2><p>It may be good to review the following guides for this section.</p><ul><li><a href="/guide/requests.html">Requests Guide</a></li><li><a href="/guide/drivers.html#oauth2-drivers">OAuth2 Drivers</a></li></ul><h3 id="step-1-social-redirect" tabindex="-1">Step 1: Social Redirect <a class="header-anchor" href="#step-1-social-redirect" aria-hidden="true">#</a></h3><p>When we call the <code>auth.oauth2()</code> without the <code>code</code> set to <code>true</code> it will attempt to first redirect to the social site to fetch a token.</p><p>For instance with Facebook it will redirect you to the app permissions screen where you can either accept or reject the applications access and permissions.</p><p>In this case the driver options are the ones that are passed in and can be overridden.</p><div class="language-ts"><pre><code>auth<span class="token punctuation">.</span><span class="token function">oauth2</span><span class="token punctuation">(</span><span class="token string">&quot;facebook&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  params<span class="token operator">:</span> <span class="token punctuation">{</span>
    client_id<span class="token operator">:</span> <span class="token string">&quot;facebook-client-id&quot;</span><span class="token punctuation">,</span>
    state<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><h3 id="step-2-api-call" tabindex="-1">Step 2: API call <a class="header-anchor" href="#step-2-api-call" aria-hidden="true">#</a></h3><p>If all went well in step 1 above the social app/site should redirect back to our app with a very short lived token. We then need to pass that token to our API and use that to make a request for user data from the third party auth service. Typically this should at least give us a unique id, email and name.</p><p>To trigger this off we will need to pass in <code>code</code> set to <code>true</code>. It will then use the <code>options.oauth2Data</code> data to make the request to our API.</p><p>This then follows our normal requests flow.</p><div class="language-ts"><pre><code>auth<span class="token punctuation">.</span><span class="token function">oauth2</span><span class="token punctuation">(</span><span class="token string">&quot;facebook&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  url<span class="token operator">:</span> <span class="token string">&quot;auth/facebook&quot;</span><span class="token punctuation">,</span>
  code<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  body<span class="token operator">:</span> <span class="token punctuation">{</span>
    code<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$route<span class="token punctuation">.</span>query<span class="token punctuation">.</span>code<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  state<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$route<span class="token punctuation">.</span>query<span class="token punctuation">.</span>state<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><h2 id="state" tabindex="-1">State <a class="header-anchor" href="#state" aria-hidden="true">#</a></h2><p>So what happens if we need to pass some state back to our app. For instance whether &quot;stay signed in&quot; was selected by the user or not. This is already supported by the OAuth2 spec with a special request parameter called <code>state</code>.</p><p>So as you will see in Step 1 above we can pass in any <code>params.state</code> data into the OAuth2 request.</p><p>Then on the flip side we just pass the data right back in. The plugin should handle the rest for us and pass any login options directly in.</p><h2 id="window" tabindex="-1">Window <a class="header-anchor" href="#window" aria-hidden="true">#</a></h2><p>The <code>oauth2</code> call also accepts a <code>window</code> parameter to customize how to trigger the window. It follows the <code>window.open</code> format allowing any parameters to be passed in directly.</p><div class="language-ts"><pre><code>    form<span class="token operator">:</span> <span class="token punctuation">{</span>
        body<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
        params<span class="token operator">:</span> <span class="token punctuation">{</span>
            state<span class="token operator">:</span> <span class="token punctuation">{</span>
                remember<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
                staySignedIn<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
                fetchUser<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        window<span class="token operator">:</span> <span class="token punctuation">{</span>
            name<span class="token operator">:</span> <span class="token string">&#39;_blank&#39;</span><span class="token punctuation">,</span>
            specs<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
            replace<span class="token operator">:</span> <span class="token boolean">false</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

</code></pre></div>`,21),p=[o];function c(i,l,r,u,d,h){return n(),s("div",null,p)}var f=a(e,[["render",c]]);export{w as __pageData,f as default};