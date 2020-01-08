<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Test\Lemur;
use Quid\Base;
use Quid\Core;
use Quid\Lemur;
use Quid\Main;
use Quid\Routing;
use Quid\Test\Suite;

// route
// class for testing Quid\Lemur\Route
class Route extends Base\Test
{
    // trigger
    final public static function trigger(array $data):bool
    {
        // prepare
        $boot = $data['boot'];
        $type = $boot->type();
        $priority = Suite\Assert\Priority::class;
        $route = Lemur\Cms\Error::class;
        $login = Lemur\Cms\Login::class;
        $sitemap = Lemur\Cms\Sitemap::class;
        $loginSubmit = Lemur\Cms\LoginSubmit::class;
        $general = Lemur\Cms\General::class;
        $specific = Lemur\Cms\Specific::class;
        $session = $boot->session();
        $session->timeoutEmpty();
        $schemeHost = $boot->schemeHost(true,$type);
        $db = Core\Boot::inst()->db();
        $lang = $session->lang();
        $obj = new $route(Core\Request::live());
        $obj2 = new $loginSubmit();
        $g = new $general(new Core\Request('/fr/table/ormTable/1/20/-/-/-/-/-/-/-'));
        $g2 = new $general(['table'=>$db['ormSql'],'page'=>3,'limit'=>10]);
        $query = new $general(new Core\Request('/fr/table/ormTable/1/20/-/-/-/-/-/-/-?s=éric'));
        assert(count(Base\Classe::parents($login,true)) === 9);

        // session

        // onPrepareDoc

        // type
        assert($obj2->type() === $type);

        // getBaseReplace
        assert(count($obj->getBaseReplace()) === 17);

        // prepareTitle

        // prepareDocServices

        // prepareDocJsInit

        // rowExists
        assert($obj->rowExists() === false);

        // row
        assert($obj->row() === null);

        // getOtherMeta
        assert($obj->getOtherMeta() === null);

        // host
        assert($loginSubmit::host() === $boot->host(true,$type));
        assert($route::host() === $boot->host(true,$type));

        // schemeHost
        assert($route::schemeHost() === $boot->schemeHost(true,$type));

        // routes
        assert($route::routes() instanceof Routing\Routes);

        // tableSegment

        // rowClass
        assert($route::rowClass() === null);
        assert($priority::rowClass() === Suite\Row\OrmCol::class);

        // tableFromRowClass
        assert($priority::tableFromRowClass() instanceof Core\Table);

        // routeBaseClasses
        assert(count($route::routeBaseClasses()) === 2);

        // getOverloadKeyPrepend
        assert($route::getOverloadKeyPrepend() === 'Route');

        // routing
        assert($obj2->_cast() === '/en/login/submit');
        assert($route::allowed());
        assert(!$login::allowed());
        assert($sitemap::allowed());
        assert(!$route::hasPath());
        assert($login::hasPath());
        assert($sitemap::hasPath());
        assert($obj::getTimeoutObject() instanceof Main\Timeout);
        assert($obj->routeRequest() instanceof Routing\RouteRequest);
        assert($obj->request() instanceof Core\Request);
        assert($obj->init() === $obj);
        assert($obj->isValid());
        assert($obj->checkValid() === $obj);
        assert($obj->getMetaTitle() === null);
        assert($obj->getMetaKeywords() === null);
        assert($obj->getMetaDescription() === null);
        assert($obj->getMetaImage() === null);
        assert($obj->getHtmlAttr() === null);
        assert($obj->getBodyAttr() === null);
        assert($route::label() === 'Error');
        assert($route::label('%:') === 'Error:');
        assert($route::description() === null);
        assert($obj2->title() === 'Login - Submit');
        assert($obj2->title(3) === 'Log');
        assert(!empty($obj->docOpen()));
        assert(count($obj->getReplace()) === 17);
        assert(!$obj2->isSelected());
        assert($obj2->hasUri());
        assert(!$route::make()->hasUri());
        assert($obj2->uri() === '/en/login/submit');
        assert($login::make()->uri() === '/en/login');
        assert($sitemap::make()->uri() === '/sitemap.xml');
        assert($obj2->uriOutput() === '/en/login/submit');
        assert($obj2->uriRelative() === '/en/login/submit');
        assert($obj2->uriAbsolute() === Base\Request::schemeHost().'/en/login/submit');
        assert($obj2->a() === "<a href='/en/login/submit' hreflang='en'></a>");
        assert($obj2->a('okk','#id class2','fr',['attr'=>['href'=>['lang'=>false]]]) === "<a href='/fr/connexion/soumettre' id='id' class='class2'>okk</a>");
        assert($obj2->aOpen() === "<a href='/en/login/submit' hreflang='en'>");
        assert($obj2->aOpen('okkk','#id class2','fr') === "<a href='/fr/connexion/soumettre' id='id' class='class2' hreflang='fr'>okkk");
        assert($obj2->aLabel() === "<a href='/en/login/submit' hreflang='en'>Login - Submit</a>");
        assert($obj2->aOpenLabel() === "<a href='/en/login/submit' hreflang='en'>Login - Submit");
        assert($obj2->aTitle() === "<a href='/en/login/submit' hreflang='en'>Login - Submit</a>");
        assert($obj2->aOpenTitle() === "<a href='/en/login/submit' hreflang='en'>Login - Submit");
        assert($obj2->aOpenTitle(3) === "<a href='/en/login/submit' hreflang='en'>Log");
        assert($obj2->aOpenTitle('%:','#id class2') === "<a href='/en/login/submit' id='id' class='class2' hreflang='en'>Login - Submit:");
        $loginMake = $login::make();
        assert(strlen($obj2->formOpen()) === 245);
        assert(strlen($loginMake->formOpen(['method'=>'post'])) === 238);
        assert($loginMake->formSubmit(null,'nameOK') === "<form action='/en/login' method='get'><button name='nameOK' type='submit'></button></form>");
        assert($loginMake::submitLabel('% ok') === "<button type='submit'>Login ok</button>");
        assert($loginMake->submitTitle('% ok') === "<button type='submit'>Login ok</button>");
        assert($loginSubmit::make() instanceof $loginSubmit);
        assert(Lemur\Route\ActivatePassword::make() instanceof Suite\Assert\ActivatePassword);
        assert($loginSubmit::getOverloadClass() === Lemur\Cms\LoginSubmit::class);
        assert($loginSubmit::makeParent() instanceof Lemur\Cms\Login);
        assert(count($loginMake->tagAttr('a',['class','#id'])) === 2);
        assert($loginMake->tagOption('form') === null);

        // _static
        assert(!$route::isIgnored());
        assert(!$route::inMenu('test'));
        assert($route::isGroup('error') === true);
        assert($sitemap::isGroup('seo'));
        assert(!$route::isGroup('default'));
        assert(!$route::inSitemap());
        assert(!$login::inSitemap());
        assert($priority::inSitemap());
        assert(!$loginSubmit::inSitemap());
        assert($route::allowNavigation());
        assert($loginSubmit::allowNavigation());
        assert($route::group() === 'error');
        assert($login::group() === 'nobody');
        assert($login::group(true) === 'nobody');
        assert($route::name(true) === 'error');
        assert($route::name(false) === 'Error');
        assert($route::name() === 'Error');
        assert($route::priority() === 999);
        assert($route::parent() === null);
        assert($loginSubmit::parent() === Lemur\Cms\Login::class);
        assert($loginSubmit::paths() === ['en'=>'login/submit','fr'=>'connexion/soumettre']);
        assert($loginSubmit::isAjax() === null);
        assert($route::isAjax() === null);
        assert($loginSubmit::isMethod('post'));
        assert(!$route::isMethod('post'));
        assert(!$loginSubmit::isRedirectable());
        assert(!$route::isRedirectable());
        assert($priority::isRedirectable());
        assert(!$sitemap::isRedirectable());
        assert($priority::shouldKeepInHistory());
        assert($loginSubmit::shouldKeepInHistory());
        assert(!$route::hasMatch('captcha'));
        assert($route::timeout() === []);
        assert(is_array($loginSubmit::timeout()['trigger']));
        $max = $loginSubmit::timeout()['trigger']['max'];
        assert($loginSubmit::prepareTimeout()->isCount(1));
        $key = [$loginSubmit::classFqcn(),'trigger'];
        assert($loginSubmit::isTimedOut('trigger') === false);
        assert($loginSubmit::timeoutGet('trigger') === 0);
        assert($loginSubmit::timeoutGet('triggerz') === null);
        assert($loginSubmit::timeoutIncrement('trigger')->getCount($key) === 1);
        assert($loginSubmit::timeoutBlock('trigger')->getCount($key) === $max);
        assert($loginSubmit::timeoutGet('trigger') === $max);
        assert($loginSubmit::isTimedOut('trigger'));
        assert($loginSubmit::timeoutReset('trigger')->getCount($key) === 0);
        assert($loginSubmit::isTimedOut('trigger') === false);
        assert($loginSubmit::timeoutStamp('trigger') instanceof Main\Timeout);

        // _segment
        assert($general::make()->routeRequest() instanceof Routing\RouteSegmentRequest);
        assert($g->checkValidSegment() === $g);
        assert($g->routeRequest()->makeRequestSegment() === ['table'=>'ormTable','page'=>'1','limit'=>'20','order'=>'-','direction'=>'-','cols'=>'-','filter'=>'-','in'=>'-','notIn'=>'-','highlight'=>'-']);
        assert($g->routeRequest()->makeRequestSegment()['table'] === 'ormTable');
        assert($g2->segments()['table'] instanceof Core\Table);
        assert($g->segments() === ['table'=>$db['ormTable'],'page'=>1,'limit'=>20,'order'=>$db['ormTable']['id'],'direction'=>'desc','cols'=>$g->segment('cols'),'filter'=>[],'in'=>[],'notIn'=>[],'highlight'=>[]]);
        assert($g->segment('table') === $db['ormTable']);
        assert($g->segment(0) === $db['ormTable']);
        assert($g['page'] === 1);
        assert(count($g->segment(['page','limit'])) === 2);
        assert(count($g) === 10);
        assert($g->hasSegment('table','page'));
        assert(!$g->hasSegment('table','pagez'));
        assert($g->checkSegment('table','page'));
        assert(($g3 = $g->changeSegment('page',4)) instanceof Core\Route);
        assert($g3 !== $g);
        assert($g3->routeRequest() !== $g->routeRequest());
        assert($g3->request() === $g->request());
        assert($g3->uri() === '/en/table/ormTable/4/20/-/-/-/-/-/-/-');
        assert($g->uri() === '/en/table/ormTable/1/20/-/-/-/-/-/-/-');
        assert(count($g3->segments()) === 10);
        assert($g3->isValidSegment());
        assert($g->isValidSegment());
        assert($g3->checkValidSegment());
        assert($g3->isValid());
        assert($g3->checkValid());
        assert(($g4 = $g3->changeSegments(['table'=>123,'page'=>4,'filter'=>['user'=>2]])) instanceof Core\Route);
        assert(!$g4->isValidSegment());
        assert(($g5 = $g3->keepSegments('page')) instanceof Core\Route);
        assert($g5->segments()['page'] === 4);
        assert($g5->segments()['table'] === false);
        assert(!$route::isSegmentClass());
        assert($general::isSegmentClass());
        assert(is_string($loginSubmit::routeRequestClass()));
        assert($general::getDefaultSegment() === '-');
        assert($general::getReplaceSegment() === '%%%');
        assert($g->title() === 'Super Orm En');
        assert($g->aTitle() === "<a href='/en/table/ormTable/1/20/-/-/-/-/-/-/-' hreflang='en'>Super Orm En</a>");
        assert($query->isValid());
        assert($query->checkValid() === $query);
        assert($query->aTitle() === "<a href='/en/table/ormTable/1/20/-/-/-/-/-/-/-?s=%C3%A9ric' hreflang='en'>Super Orm En</a>");
        assert($g->aOpenTitle() === "<a href='/en/table/ormTable/1/20/-/-/-/-/-/-/-' hreflang='en'>Super Orm En");
        assert($query->uri() === '/en/table/ormTable/1/20/-/-/-/-/-/-/-?s=éric');
        $g2 = $g->clone();
        assert($g2->uri() === '/en/table/ormTable/1/20/-/-/-/-/-/-/-');
        assert(count($g2->segments()) === 10);

        // request
        assert(count(Routing\Request::fromRoute($obj2)) === 4);
        assert(count(Routing\Request::fromRoute($obj2)['post']) === 5);
        assert(Routing\Request::fromRoute($obj2)['post']['-genuine-'] === '');
        assert(Routing\Request::fromRoute($obj2)['post']['-genuine-2-'] === 1);

        // root
        assert(count($obj->help()) === 9);
        assert(count($obj->help(true)) === 11);

        // access
        assert($obj::session() instanceof Core\Session);
        assert($obj::sessionCom() instanceof Core\Com);
        assert($obj::sessionUser() instanceof Core\Row\User);
        assert($obj::lang() instanceof Core\Lang);
        assert($obj::langText('label') === 'Assert');
        assert($obj::langPlural(2,'label') === 'Asserts');
        assert($obj::service('mailer') instanceof Main\Service);
        assert($obj::serviceMailer() instanceof Main\ServiceMailer);

        // bootAccess
        assert($obj::boot() instanceof Core\Boot);
        assert($obj::bootSafe() instanceof Core\Boot);
        assert($obj::bootReady() instanceof Core\Boot);

        // bootDbAccess
        assert($obj::db() instanceof Core\Db);

        /* ROUTE REQUEST */
        // prepare
        $userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7';
        $param = ['ssl'=>true,'ajax'=>true,'path'=>'/fr/test/de/la/vie','host'=>'google.com','method'=>'post','ip'=>'127.0.0.1','userAgent'=>$userAgent];
        $request = new Core\Request($param);
        $param2 = ['ssl'=>true,'ajax'=>false,'path'=>'/table/routeMatch','host'=>'google.com','method'=>'get','ip'=>'127.0.0.1','userAgent'=>$userAgent];
        $request2 = new Core\Request($param2);
        $param3 = ['ssl'=>true,'ajax'=>false,'path'=>'/','query'=>'abc=123&ok=true&james=lavié','post'=>['-captcha-'=>$session->captcha(true),'-csrf-'=>$session->csrf(),'-genuine-'=>'','-genuine-2-'=>1,'abc'=>'111','ok'=>'true','james'=>'lavié'],'host'=>'google.com','method'=>'get','ip'=>'127.0.0.1','userAgent'=>$userAgent];
        $request3 = new Core\Request($param3);
        assert($request3['abc'] === 111);
        assert($request3['ok'] === 'true');
        $session['test'] = 2;
        $session['test2'] = 'BLA';

        // construct
        $loginMake = Lemur\Cms\Login::make();
        $homeMake = Lemur\Cms\Home::make();
        $loginSubmitMake = Lemur\Cms\LoginSubmit::make();
        $errorMake = Lemur\Cms\Error::make();
        $rr = new Routing\RouteRequest($loginMake);
        $match = new Routing\RouteRequest($loginMake,$request);
        $match2 = new Routing\RouteRequest($loginMake,$request2);
        $match3 = new Routing\RouteRequest($homeMake,$request3);
        $match4 = new Routing\RouteRequest($loginSubmitMake,$request2);
        $match5 = new Routing\RouteRequest($loginSubmitMake,'https://google.com/asdsa?ok=2');
        $match6 = new Routing\RouteRequest($loginSubmitMake,['host'=>'james.com']);
        $matchError = new Routing\RouteRequest($errorMake);
        assert($match5->request()->absolute() === 'https://google.com/asdsa?ok=2');
        assert($match6->request()->absolute() === Base\Request::scheme().'://james.com');

        // toString

        // reset

        // isValid

        // checkValid

        // isValidMatch
        assert($match3->isValidMatch($session));

        // checkValidMatch
        assert($match3->checkValidMatch());

         // isRequestInst
        assert(!$match->isRequestInst());
        assert($rr->isRequestInst());

        // valid
        assert($match3->valid() === ['match'=>true]);
        assert($match3->valid('match') === true);
        assert($match3->valid('matchz') === false);

        // fallback
        assert($match3->fallback() === null);

        // setFallback

        // route
        assert($rr->route() === Lemur\Cms\Login::class);

        // setRoute

        // routePath
        assert($matchError->routePath() === false);
        assert($matchError->routePath(null,true) === null);
        assert($match->routePath('fr') === 'connexion');
        assert($match->routePath('fr',true) === 'connexion');
        assert($match4->routePath() === false);
        assert($match4->routePath('ge',true) === false);
        assert($match4->routePath('fr') === 'connexion/soumettre');

        // request
        assert($rr->request() instanceof Core\Request);

        // setRequest

        // validateMatch
        assert($match3->validateMatch($session) === true);

        // validateArray

        // path
        assert($match2->path('/table/routeMatch'));

        // ssl
        assert($match->ssl(null));
        assert($match->ssl(true));
        assert(!$match->ssl(false));

        // ajax
        assert($match->ajax(null));
        assert($match->ajax(true));
        assert(!$match->ajax(false));

        // host
        assert($match->host(null));
        assert($match->host('google.com'));
        assert($match->host(['google.com','ok.com']));
        assert(!$match->host(['google2.com','ok.com']));

        // method
        assert($match->method(null));
        assert($match->method('post'));
        assert(!$match->method('get'));
        assert($match->method(['POST','get']));
        assert(!$match->method(['get']));

        // header
        assert($match->header(true));
        assert($match->header(['X-Requested-With'=>true]));
        assert($match->header(['X-Requested-With'=>['='=>'XMLHttpRequest']]));
        assert(!$match->header(['X-Requested-With'=>'XMLHttpRequestz']));

        // lang
        assert($match->lang(null));
        assert($match->lang('fr'));
        assert(!$match->lang('en'));
        assert($match->lang(['fr','en']));
        assert(!$match->lang(['Fr','en']));

        // ip
        assert($match->ip(null));
        assert($match->ip(['127.0.0.*']));
        assert($match->ip(['127.0.*.*']));
        assert(!$match->ip(['128.0.*.*']));
        assert($match->ip(['128.0.*.*','127.0.0.1']));

        // browser
        assert($match->browser(null));
        assert($match->browser('Safari'));
        assert(!$match->browser('Google'));
        assert($match->browser(['Google','Safari']));

        // query
        assert(!$match->query(true));
        assert($match->query(false));
        assert($match3->query(true));
        assert($match3->query(true));
        assert($match3->query(['abc'=>123,'ok'=>'string','james'=>['='=>'lavié']]));
        assert(!$match3->query(['abc'=>123,'ok'=>'string','james'=>['='=>'lavié2']]));

        // post
        assert(!$match->post(true));
        assert($match->post(false));
        assert($match3->post(true));
        assert($match3->post(true));
        assert($match3->post(['abc'=>111,'ok'=>'string','james'=>['='=>'lavié']]));
        assert(!$match3->post(['bla'=>'array','abc'=>111,'ok'=>'string','james'=>['='=>'lavié']]));
        assert(!$match3->post(['abc'=>111,'ok'=>'array','james'=>['='=>'lavié']]));

        // genuine
        assert($match3->genuine(true));
        assert(!$match4->genuine(true));
        assert($match3->genuine(null));
        assert($match4->genuine(false));

        // role
        assert($match->role(null,$session));
        assert(!$match3->role(1,$session));
        assert($match3->role(['>'=>1],$session));
        assert($match3->role([80,90],$session));
        assert($match3->role(80,$session));
        assert(!$match3->role([90],$session));

        // session
        assert($match->session(null,$session));
        assert(!$match3->session(true,$session));
        assert(!$match3->session(false,$session));
        assert(!$match3->session('isNobody',$session));
        assert($match3->session('isSomebody',$session));
        assert($match3->session(['isSomebody','isAdmin'],$session));
        assert(!$match3->session(['isSomebody','isNobody'],$session));

        // csrf
        assert($match->csrf(null,$session));
        assert($match->csrf(false,$session));
        assert($match3->csrf(true,$session));

        // captcha
        assert($match->captcha(null,$session));
        assert($match->captcha(false,$session));
        assert($match3->captcha(true,$session));

        // timeout
        assert($match->timeout(null,$session));
        assert($match->timeout(false,$session));
        assert($match->timeout(true,$session));
        assert($match->timeout('testa',$session));

        // timedOut

        // schemeHost
        assert($match4->schemeHost() === $schemeHost);
        assert($match4->schemeHost(true) === $schemeHost);

        // uri
        assert($match4->uri('fr') === $schemeHost.'/fr/connexion/soumettre');
        assert($match->uri('fr') === $schemeHost.'/fr/connexion');
        assert($match4->uri('fr',['query'=>['test'=>2,'james'=>'lolé']]) === $schemeHost.'/fr/connexion/soumettre?test=2&james=lolé');
        assert($match4->uri('fr',['query'=>true]) === $schemeHost.'/fr/connexion/soumettre');

        // uriPrepare

        // uriOutput
        assert($match4->uriOutput('fr',['absolute'=>true]) === $schemeHost.'/fr/connexion/soumettre');
        assert($match4->uriOutput('fr',['absolute'=>false]) === '/fr/connexion/soumettre');
        assert($match4->uriOutput('fr') === '/fr/connexion/soumettre');

        // uriRelative
        assert($match4->uriRelative('fr') === '/fr/connexion/soumettre');

        // uriAbsolute
        assert($match4->uriAbsolute('fr') === $schemeHost.'/fr/connexion/soumettre');
        assert($match5->uriAbsolute('de') === null);
        assert($match6->uriAbsolute('en') === $schemeHost.'/en/login/submit');
        assert($match5->uriAbsolute('fr') === $schemeHost.'/fr/connexion/soumettre');

        // allowed
        assert($match3::allowed(80,$session->role()));

        // pathFromRoute
        assert($match::pathFromRoute($match4->route(),'fr') === 'connexion/soumettre');

        /* ROUTE SEGMENT REQUEST */

        // construct
        $generalMake = new $general();
        $specificMake = new $specific();
        $rr = new Routing\RouteSegmentRequest($generalMake,new Core\Request('/fr/table/ormTable/1/20/-/-/-/-/-/-/-'),$lang);
        $rr2 = new Routing\RouteSegmentRequest($generalMake,new Core\Request('/fr/table/ormTablezz/1/20/-/-/-/-/-/-/-'),$lang);
        $rr3 = new Routing\RouteSegmentRequest($specificMake,new Core\Request('/fr/table/user/1'),$lang);
        $rr4 = new Routing\RouteSegmentRequest($specificMake,new Core\Request('/fr/table/user/20'),$lang);
        $rr5 = new Routing\RouteSegmentRequest($generalMake,'ormTable',$lang);
        $rr6 = new Routing\RouteSegmentRequest($specificMake,$db['user'][1],$lang);
        $rr7 = new Routing\RouteSegmentRequest($generalMake,$db['user'],$lang);
        $rr8 = new Routing\RouteSegmentRequest($generalMake,['table'=>$db['user']],$lang);
        $rr9 = new Routing\RouteSegmentRequest($generalMake,['table'=>'user','limit'=>20,'page'=>1],$lang);
        $rr10 = new Routing\RouteSegmentRequest($specificMake,['user',2],$lang);
        $rr11 = new Routing\RouteSegmentRequest($generalMake,['table'=>'user'],$lang);

        // reset

        // isValid
        assert(!$rr2->isValid($session));
        assert($rr->isValid($session));

        // checkValid
        assert($rr->checkValid($session));

        // setLangCode

        // langCode
        assert($rr->langCode() === 'en');

        // setRoute

        // routeSegment
        assert($rr->routeSegment() === ['table','page','limit','order','direction','cols','filter','in','notIn','highlight']);
        assert($rr5->routeSegment() === ['table','page','limit','order','direction','cols','filter','in','notIn','highlight']);

        // setRequest

        // parseRequestSegmentFromRequest

        // parseRequestSegmentFromRequestCatchAll

        // parseRequestSegmentFromValue

        // isRouteCatchAll
        assert(!$rr->isRouteCatchAll());

        // isSegmentParsedFromValue
        assert(!$rr->isSegmentParsedFromValue());
        assert($rr8->isSegmentParsedFromValue());

        // isRouteRequestCompatible
        assert($rr->isRouteRequestCompatible());

        // requestSegment
        assert($rr->requestSegment() === ['table'=>'ormTable','page'=>1,'limit'=>20,'order'=>'-','direction'=>'-','cols'=>'-','filter'=>'-','in'=>'-','notIn'=>'-','highlight'=>'-']);
        assert($rr3->requestSegment() === ['table'=>'user','primary'=>1]);
        assert($rr5->requestSegment() === ['table'=>'ormTable','page'=>'ormTable','limit'=>'ormTable','order'=>'ormTable','direction'=>'ormTable','cols'=>'ormTable','filter'=>'ormTable','in'=>'ormTable','notIn'=>'ormTable','highlight'=>'ormTable']);
        assert($rr7->requestSegment() === ['table'=>$db['user'],'page'=>$db['user'],'limit'=>$db['user'],'order'=>$db['user'],'direction'=>$db['user'],'cols'=>$db['user'],'filter'=>$db['user'],'in'=>$db['user'],'notIn'=>$db['user'],'highlight'=>$db['user']]);

        // hasRequestSegment
        assert($rr7->hasRequestSegment('page','limit'));
        assert(!$rr7->hasRequestSegment('page','limitz'));

        // checkRequestSegment
        assert($rr7->checkRequestSegment('page','limit'));

        // changeRequestSegment
        assert($rr7->uri('fr') === '/fr/table/user/1/-/-/-/-/-/-/-/-');
        assert($rr7->changeRequestSegment('page',2) === $rr7);
        assert(count($rr7->requestSegment()) === 10);
        assert($rr7->requestSegment()['page'] === 2);
        assert($rr7->changeRequestSegment('page','BLA') === $rr7);
        assert($rr7->uri('fr') === '/fr/table/user/1/-/-/-/-/-/-/-/-');

        // changeRequestSegments
        assert($rr9->changeRequestSegments(['table'=>'ormSql','page'=>3]) === $rr9);

        // keepRequestSegments
        assert($rr9->keepRequestSegments('table','limit') === $rr9);
        assert($rr9->requestSegment()['page'] === null);
        assert($rr9->uri('en') === '/en/table/ormSql/1/20/-/-/-/-/-/-/-');
        assert($rr9->makeRequestSegment()['page'] === '1');
        assert($rr9->changeRequestSegments(['table'=>'ormSql','page'=>3]) === $rr9);

        // makeRequestSegment
        assert($rr7->requestSegment()['table'] instanceof Core\Table);
        assert($rr7->makeRequestSegment() === ['table'=>'user','page'=>'1','limit'=>'-','order'=>'-','direction'=>'-','cols'=>'-','filter'=>'-','in'=>'-','notIn'=>'-','highlight'=>'-']);

        // isValidSegment
        assert($rr->isValidSegment($session));
        assert($rr6->isValidSegment($session));

        // checkValidSegment
        assert($rr->checkValidSegment($session) === $rr);

        // validateSegment
        assert($rr->validateSegment($session));
        assert($rr2->validateSegment($session,false) === false);
        assert($rr3->validateSegment($session));
        assert(!$rr4->validateSegment($session));
        assert(!$rr5->validateSegment($session));
        assert(!$rr9->validateMatch($session));
        assert($rr9->validateSegment($session,true));
        assert(!$rr6->validateMatch($session));
        assert($rr6->validateSegment($session,true));

        // validateArray

        // segment
        assert($rr->segment() === ['table'=>$db['ormTable'],'page'=>1,'limit'=>20,'order'=>$db['ormTable']['id'],'direction'=>'desc','cols'=>$rr->segment()['cols'],'filter'=>[],'in'=>[],'notIn'=>[],'highlight'=>[]]);
        assert($rr6->segment() === ['table'=>$db['user'],'primary'=>$db['user'][1]]);

        // path

        // pathCatchAll

        // uri
        assert($rr->uri('en') === '/en/table/ormTable/1/20/-/-/-/-/-/-/-');
        assert($rr5->uri('fr') === '/fr/table/ormTable/1/-/ormTable/ormtable/ormTable/ormTable/ormTable/ormTable/ormTable');
        assert($rr6->uri('fr') === '/fr/table/user/1');
        assert($rr7->uri('fr') === '/fr/table/user/1/-/-/-/-/-/-/-/-');
        assert($rr8->uri('fr') === '/fr/table/user/1/-/-/-/-/-/-/-/-');
        assert($rr9->uri('fr') === '/fr/table/ormSql/3/20/-/-/-/-/-/-/-');
        assert($rr10->uri('en') === '/en/table/user/2');
        assert($rr11->uri('en') === '/en/table/user/1/-/-/-/-/-/-/-/-');

        // routeRequest
        assert($rr5->uriAbsolute('en') === Base\Request::schemeHost().'/en/table/ormTable/1/-/ormTable/ormtable/ormTable/ormTable/ormTable/ormTable/ormTable');
        assert($rr->uriAbsolute('fr') === Base\Request::schemeHost().'/fr/table/ormTable/1/20/-/-/-/-/-/-/-');
        assert($rr->uriRelative('fr') === '/fr/table/ormTable/1/20/-/-/-/-/-/-/-');
        assert($rr6->uriAbsolute('en') === Base\Request::schemeHost().'/en/table/user/1');

        /* ROUTES */
        $boot = $data['boot'];
        $type = $boot->type();
        $app = $boot->routes($type);
        $request = Core\Request::live();
        $login = Lemur\Cms\Login::class;
        $loginSubmit = Lemur\Cms\LoginSubmit::class;
        $routes = new Routing\Routes([Lemur\Cms::class,Suite\Cms::class]);
        $routes->init('cms');

        // routing
        assert($app->count() === 54);
        assert($routes->type() === 'cms');
        assert($routes->keyParent()[Lemur\Cms\LoginSubmit::class] === Lemur\Cms\Login::class);
        assert(count($routes->hierarchy()) === 27);
        assert(count($routes->childsRecursive($login)) === 5);
        assert($routes->tops()->isCount(27));
        assert($routes->tops() !== $routes);
        assert($routes->top($loginSubmit) === $login);
        assert($routes->parents($loginSubmit)->isCount(1));
        assert($routes->breadcrumb($loginSubmit)->isCount(2));
        assert($routes->breadcrumb($loginSubmit)->last() === $loginSubmit);
        assert($routes->siblings($loginSubmit)->isCount(4));
        assert($routes->childs($login)->isCount(5));
        assert($routes->withSegment()->count() > 5);
        assert($routes->withoutSegment()->count() > 5);
        assert($routes->allowed()->count() !== $routes->count());
        assert($routes::makeBreadcrumbs('/',null,$login::make(),$loginSubmit::make()) === "<a href='/en/login' hreflang='en'>Login</a>/<a href='/en/login/submit' hreflang='en'>Login - Submit</a>");
        assert($routes::makeBreadcrumbs('/',5,$login::make(),$loginSubmit::make()) === "<a href='/en/login' hreflang='en'>Login</a>/<a href='/en/login/submit' hreflang='en'>Lo...</a>");

        // classe
        assert($routes->not($routes)->add($routes)->count() > 20);
        assert($routes->not('Home') !== $routes);
        assert($routes->not('Home')->count() === ($routes->count() - 1));
        assert($routes->not($routes)->isEmpty());
        assert($routes->not($routes->not('Home'))->count() === 1);
        assert($routes->pair('priority')['Home'] === 1);
        assert(is_numeric($routes->pairStr('priority')));
        assert($routes->pair('label','%:',null,['error'=>false])['Home'] === 'Home:');
        assert($routes->filter(['group'=>'home'])->isCount(2));
        assert($routes->first(['group'=>'home']) === Lemur\Cms\Home::class);
        assert($routes->filter(['group'=>'error','priority'=>992])->isEmpty());
        assert($routes->filter(['group'=>'error','priority'=>999])->isCount(1));
        assert(count($routes->group('group')) === 14);
        assert($routes->sortBy('name',false)->index(1) === Lemur\Cms\TableRelation::class);
        assert($routes->sortBy('name',false) !== $routes);
        assert($routes->sortDefault()->index(0) === Lemur\Cms\Home::class);
        assert($routes->sortDefault() === $routes);

        // map
        assert($routes->isCount(54));
        assert($routes->get('Sitemap') === Lemur\Cms\Sitemap::class);
        assert($routes->get(Lemur\Cms\Sitemap::class) === Lemur\Cms\Sitemap::class);
        assert(!$routes->in('Sitemap'));
        assert($routes->in(Lemur\Cms\Sitemap::class));
        assert($routes->exists('Sitemap'));
        assert($routes->exists(Lemur\Cms\Sitemap::class));
        assert($routes->unset('Sitemap')->isCount(53));
        assert($routes->add(Lemur\Cms\Sitemap::class)->isCount(54));

        return true;
    }
}
?>