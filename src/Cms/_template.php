<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;
use Quid\Routing;

// _template
// trait that grants the methods to generate the CMS HTML template
trait _template
{
    // trait
    use _common;


    // config
    protected static array $configTemplate = [
        'mainNav'=>true
    ];


    // trigger
    // trigger pour toutes les pages html du cms
    public function trigger()
    {
        return $this->template();
    }


    // getHtmlAttr
    // retourne les attributs html généraux
    final public function getHtmlAttr($value=null)
    {
        return $this->getRouteHtmlAttr() ?: null;
    }


    // getPageHtmlAttr
    // retourne les attributs html spécifique à la route
    protected function getRouteHtmlAttr():array
    {
        return [];
    }


    // getCacheReplace
    // retourne les éléments de cache
    final protected function getCacheReplace():array
    {
        return $this->getRouteCacheReplace();
    }


    // getRouteCacheReplace
    // retourne les éléments de cache spécifique à la route
    protected function getRouteCacheReplace():array
    {
        return [];
    }


    // template
    // génère le template pour le cms
    final protected function template():string
    {
        $r = '';
        $flush = $this->docOpen();
        $hasNav = $this->hasNav();

        $flush .= Html::div(null,'loading-progress');
        $flush .= Html::div(null,'loading-icon');
        $flush .= Html::div(null,'background');
        $route = Email::make();
        $data = ['mailto'=>$route->uri()];
        $flush .= Html::divCond($this->makeModal(),['modal','data'=>$data]);
        $flush .= Html::div($this->makeTooltip(),'tooltip');

        $flush .= Html::divOp('route-wrap');

        if($hasNav === true)
        {
            $flush .= Html::div($this->navWrap(),'nav-wrap');
            $flush .= Html::divOp('main-wrap');
        }

        $flush .= Html::headerCond($this->header());
        $flush .= Html::mainOp();
        $flush .= Html::divOp('inner');

        if($this->flushBeforeMain())
        static::response()->flushEchoBody($flush);
        else
        $r .= $flush;

        $main = $this->main();
        $main .= Html::divCl();
        $main .= Html::mainCl();

        $close = Html::footerCond($this->footer());

        if($hasNav === true)
        $close .= Html::divCl();

        $close .= Html::divCl();

        $close .= $this->docClose();

        $com = $this->makeCom();
        $r .= $com.$main.$close;

        return $r;
    }


    // header
    // génère le header pour toutes les pages du cms
    final protected function header():string
    {
        $r = '';
        $boot = static::boot();
        $home = Home::make();

        $r .= $home->a($boot->label(),'boot-label');
        $r .= Html::button(null,['burger-menu','icon-solo','burger']);

        $html = Html::div($this->headerLeft(),'left');
        $html .= Html::div($this->headerRight(),'right');
        $r .= Html::div($html,'top');

        return $r;
    }


    // headerLeft
    // génère le header gauche pour toutes les pages du cms
    // contient le formulaire de recherche globale
    final protected function headerLeft():string
    {
        $r = '';

        $route = Search::make();
        if($route->canTrigger())
        $r .= $route->makeForm();

        return $r;
    }


    // headerRight
    // génère le header droite pour toutes les pages du cms
    final protected function headerRight():string
    {
        $r = '';
        $session = static::session();
        $roles = $session->roles(false);

        if($roles->isSomebody())
        {
            $user = $session->user();
            $username = $user->username()->pair(15);
            $dateLogin = $user->dateLogin();
            $lang = static::lang();

            if($this->hasPermission('sessionInfo'))
            {
                $route = PopupSession::make();
                $popup = $route->canTrigger();
                $attr = ['popup-trigger'];
                $html = '';

                if($popup === true)
                {
                    $attr = Base\Arr::merge($attr,['with-ajax','with-popup','with-icon','data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);
                    $html .= $route->a($username,'popup-title');
                    $html .= static::makeDivPopup();
                }

                else
                $html .= Html::div($username,'popup-title');

                $r .= Html::div($html,$attr);
            }

            $route = Account::make();
            if($route->canTrigger())
            $r .= $route->aTitle(null,['with-icon','no-border','account']);

            $route = AccountChangePassword::make();
            if($route->canTrigger())
            $r .= $route->aDialog($lang->text('accountChangePassword/link'),['with-icon','no-border','password']);

            $route = SessionRole::make();
            if($route->canTrigger())
            {
                $active = ($session->hasFakeRoles())? 'active':null;
                $r .= $route->aDialog(null,['with-icon','no-border','mask',$active]);
            }

            $route = Logout::make();
            if($route->canTrigger())
            $r .= $route->aTitle(null,['with-icon','no-border','logout']);
        }

        return $r;
    }


    // hasNav
    // retourne vrai si la route doit afficher la navigation
    final public function hasNav():bool
    {
        return $this->getAttr('mainNav') === true;
    }


    // navWrap
    // génère le html pour la navigation à gauche
    final protected function navWrap():string
    {
        $r = null;
        $boot = static::boot();
        $logo = $boot->getOption('logo');
        $label = $boot->label();
        $home = Home::make();

        $html = Html::button(null,['nav-close','icon-solo','close']);

        if(!empty($logo))
        {
            $img = Html::imgCond($logo,$label);
            $html .= $home->a($img,'logo');
        }

        else
        {
            $label = Html::span($label);
            $html .= $home->a($label,'boot-label');
        }

        $r .= Html::div($html,'nav-top');

        if(static::session()->user()->isSomebody())
        $r .= Html::navCond($this->nav());

        return Html::div($r,'nav-fixed');
    }


    // nav
    // génère la navigation principale pour toutes les pages du cms
    // vérifier la présence de mainBefore et mainAfter dans les routes
    final protected function nav():string
    {
        $r = '';

        foreach ($this->navRoutes('mainBefore') as $routeClass)
        {
            $r .= Html::liCond($routeClass::make()->aTitle());
        }

        $tables = $this->db()->tables();
        $tables = $tables->hasPermission('view','mainNav','general');
        $hierarchy = $tables->hierarchy(false);
        $r .= $this->navMenu($hierarchy);

        foreach ($this->navRoutes('mainAfter') as $routeClass)
        {
            $r .= Html::liCond($routeClass::make()->aTitle());
        }

        $r = Html::ulCond($r);

        return $r;
    }


    // navRoutes
    // retourne les routes pour un type (en lien avec nav)
    final protected function navRoutes(string $type):Routing\Routes
    {
        $return = [];
        $boot = static::boot();
        $routes = $boot->routes();
        $return = $routes->filter(fn($route) => $route::inMenu($type));

        return $return;
    }


    // navMenu
    // génère un niveau de menu pour la navigation principale
    // une exception est envoyé si le niveau est plus grand que 2
    // si un menu n'a qu'un élément, que ce n'est pas une table et que l'enfant n'a pas les permissions navAdd, alors n'affiche pas le menu
    final protected function navMenu(array $array,int $i=0):string
    {
        $r = '';
        $session = static::session();
        $tables = $this->db()->tables();
        $lang = $this->lang();
        $navAdd = ['insert','lemurInsert','mainNavAdd'];

        if($i >= 2)
        static::throw('tooDeep',$array);

        if(!empty($array))
        {
            $ii = $i + 1;

            foreach ($array as $key => $value)
            {
                if(is_string($key) && !empty($key))
                {
                    $table = $tables->get($key);
                    $html = '';
                    $routeHtml = '';
                    $attr = [];

                    if(!empty($table))
                    {
                        $route = $session->routeTableGeneral($table,true);

                        if($route->routeRequest()->isSegmentParsedFromValue())
                        $routeHtml .= $route->aWithoutQuery($route->title());

                        else
                        $routeHtml .= $route->aTitle();

                        ['html'=>$routeHtml,'attr'=>$attr] = $this->navMenuSpecificAdd($routeHtml,$attr,$navAdd,$table);
                    }

                    if(is_array($value))
                    {
                        $attr[] = 'with-carousel';
                        $keys = array_keys($value);

                        $label = $lang->tableLabel($key);
                        $subNav = $this->navMenu($value,$ii);

                        if(!empty($subNav))
                        {
                            $buttonHtml = Html::span(null,['triangle']);
                            $buttonHtml .= Html::span($label);
                            $html .= Html::button($buttonHtml,'trigger');

                            if(!empty($table))
                            {
                                $keys[] = $table->name();
                                ['html'=>$routeHtml,'attr'=>$liAttr] = $this->navMenuSpecificAdd($routeHtml,[],$navAdd,$table);
                                $routeHtml = Html::liCond($routeHtml,$liAttr);
                            }

                            $targetHtml = Html::ul($routeHtml.$subNav);
                            $html .= static::makeDivPopup($targetHtml,'target');
                        }

                        if($this->isTableTop($keys))
                        $attr = Base\Arr::merge($attr,['data-carousel'=>1,'top']);
                    }

                    else
                    $html = $routeHtml;

                    $r .= Html::liCond($html,$attr);
                }
            }
        }

        return $r;
    }


    // navMenuSpecificAdd
    // utiliser pour générer le lien d'ajout en lien avec un menu
    final protected function navMenuSpecificAdd(string $html,array $attr,array $navAdd,Core\Table $table):array
    {
        if($table->hasPermission(...$navAdd))
        {
            $specificAdd = SpecificAdd::classOverload();
            $attr[] = 'with-specific-add';
            $route = $specificAdd::make($table);
            $html .= $route->makeNavLink();
        }

        return ['html'=>$html,'attr'=>$attr];
    }


    // flushBeforeMain
    // active ou désactive le flush du contenu avant main
    final protected function flushBeforeMain():bool
    {
        return false;
    }


    // main
    // méthode main à étendre dans chaque route du template
    abstract protected function main();


    // makeH1
    // génère le tag h1 de la page, il y a dans le h1 un lien qui renvoie vers la même page
    final protected function makeH1(string $title):string
    {
        return Html::h1($this->a($title));
    }


    // footer
    // génère le footer pour toutes les pages du cms
    final protected function footer():string
    {
        $r = '';
        $boot = static::boot();
        $showQuid = $boot->getOption('versionQuid') ?? true;
        $version = $boot->version(true,$showQuid,true);
        $lang = static::lang();

        if($this->hasPermission('backToTop'))
        $r .= $this->footerBackToTop();

        if($this->hasPermission('print'))
        $r .= $this->footerPrint();

        if($this->hasPermission('link'))
        $r .= $this->footerElement('link',$this->footerLink());

        if($this->hasPermission('lang'))
        $r .= $this->footerElement('lang',$this->footerLang());

        if($this->hasPermission('module'))
        $r .= $this->footerElement('module',$this->footerModule());

        if($this->hasPermission('cli'))
        $r .= $this->footerElement('cli',$this->footerCli());

        $route = About::make();
        if($route->canTrigger())
        $r .= $route->aDialog(null,['with-icon','help','no-border']);

        $route = Contact::make();
        if($route->canTrigger())
        $r .= $route->aDialog(null,['with-icon','email','no-border']);

        $copyright = $lang->text('footer/version',['version'=>$version]);
        $segment = ['route'=>$this,'speed'=>Base\Debug::speed()];
        $route = PopupBoot::make($segment);
        $popup = ($route->canTrigger() && $route->isValidSegment());

        $attr = ['popup-trigger'];
        $html = '';

        if($popup === true)
        {
            $html .= $route->a($copyright,'popup-title');
            $html .= static::makeDivPopup();
            $attr = Base\Arr::merge($attr,['with-ajax','with-popup','with-icon','data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);
        }

        else
        $html .= Html::div($copyright,'popup-title');

        $r .= Html::div($html,$attr);

        return $r;
    }


    // footerBackToTop
    // génère le bouton pour retourner vers le haut de la page
    final protected function footerBackToTop():string
    {
        $lang = static::lang();
        $buttonHtml = Html::button($lang->text('footer/backToTop'),['with-icon','top','no-border']);
        return  Html::div($buttonHtml,'back-to-top');
    }


    // footerPrint
    // génère le bouton pour imprimer la page
    final protected function footerPrint():string
    {
        $lang = static::lang();
        $buttonHtml = Html::button($lang->text('footer/print'),['with-icon','print','no-border']);
        return  Html::div($buttonHtml,'print');
    }


    // footerElement
    // génère un clickOpen pour la partie gauche du footer
    final protected function footerElement(string $type,array $array):string
    {
        $r = '';
        $popup = '';
        $top = null;
        $lang = static::lang();

        foreach ($array as $value)
        {
            if($value instanceof Lemur\Route)
            {
                $top = ($value::classFqcn() === static::class)? 'top':$top;
                $value = $value->aTitle();
            }

            $popup .= Html::li($value);
        }
        $popup = Html::ulCond($popup);
        $label = $lang->text(['footer',$type]);

        if(!empty($popup))
        {
            $attr = [$top,'with-submenu','data'=>['anchor-corner'=>true]];
            $html = Html::button($label,['with-icon','no-border','trigger',$type]);
            $html .= static::makeDivPopup($popup);
            $r .= Html::div($html,$attr);
        }

        return $r;
    }


    // footerLink
    // retourne un tableau avec les routes liens
    final protected function footerLink():array
    {
        $return = [];

        if($this->hasPermission('linkType'))
        $return = $this->footerLinkType();

        $return = Base\Arr::merge($return,$this->footerRouteGroup('link'));

        return $return;
    }


    // footerPrint


    // footerLinkType
    // retourne un tableau avec les liens vers les différents types
    // n'inclut pas un lien vers le type courant
    final protected function footerLinkType():array
    {
        $return = [];
        $session = static::session();
        $boot = static::boot();
        $type = $boot->type();
        $schemeHosts = $boot->schemeHostTypes();
        $lang = $this->lang();

        foreach ($schemeHosts as $key => $uri)
        {
            if($key === 'cms' && !$this->hasPermission('linkTypeCms'))
            continue;

            if($key !== $type)
            {
                $label = $lang->typeLabel($key);
                $return[] = Html::a($uri,$label);
            }
        }

        return $return;
    }


    // footerLang
    // retourne un tableau avec les routes lang
    final protected function footerLang():array
    {
        $return = [];
        $lang = static::lang();

        foreach ($lang->allLang() as $value)
        {
            $label = $lang->langLabel($value);
            $route = ($this::isRedirectable())? $this:Home::make();

            $return[] = $route->a($label,null,$value);
        }

        return $return;
    }


    // footerModule
    // retourne un tableau avec les routes modules
    final protected function footerModule():array
    {
        return $this->footerRouteGroup('module');
    }


    // footerCli
    // retourne un tableau avec les routes cli
    final protected function footerCli():array
    {
        return $this->footerRouteGroup('cli');
    }


    // footerRouteGroup
    // méthode utilisé par link, module et cli pour obtenir un tableau avec les liens de route
    final protected function footerRouteGroup(string $group):array
    {
        $return = [];
        $routes = static::boot()->routes();
        $routes = $routes->filter(fn($route) => $route::group() === $group);

        if($routes->isNotEmpty())
        {
            foreach ($routes as $route)
            {
                $route = $route::make();

                if($route->canTrigger())
                $return[] = $route;
            }
        }

        return $return;
    }


    // makeModal
    // génère le html pour le modal
    final protected function makeModal():string
    {
        $r = Html::button(null,['icon-solo','close']);
        $r .= Html::div(null,'inner');
        $r = static::makeDivPopup($r,'box');

        return $r;
    }


    // makeTooltip
    // génère le html pour le tooltip
    final protected function makeTooltip():string
    {
        $r = Html::div(null,'tooltip-content');
        $r .= Html::div(null,'tooltip-arrow');

        return $r;
    }


    // makeCom
    // génère le block pour la communication
    final protected function makeCom():string
    {
        $r = '';
        $com = static::sessionCom();
        $html = $com->flush();

        $data = ['html'=>$html];
        $route = Specific::make(true);
        if($this->hasPermission('comSpecific'))
        {
            $data['href'] = $route;
            $data['char'] = $route::getReplaceSegment();
        }
        $attr = ['com','data'=>$data];

        $r = Html::div($r,'scroller');
        $r .= Html::button(null,['icon-solo','close']);

        $r = static::makeDivPopup($r,$attr);

        return $r;
    }
}
?>