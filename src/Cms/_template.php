<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;
use Quid\Lemur;

// _template
// trait that grants the methods to generate the CMS HTML template
trait _template
{
    // trait
    use _common;


    // config
    public static $configTemplate = [
        'mainNav'=>true
    ];


    // trigger
    // trigger pour toutes les pages html du cms
    final public function trigger()
    {
        return $this->template();
    }


    // template
    final protected function template():string
    {
        $r = '';
        $flush = $this->docOpen();
        $hasNav = $this->hasNav();

        $flush .= Html::div($this->loader(),'loading-fixed');
        $flush .= Html::div(null,'background');
        $flush .= Html::divCond($this->makeModal(),'modal');

        $flush .= Html::divOp('#wrapper');

        if($hasNav === true)
        {
            $flush .= Html::div($this->navWrap(),'nav-wrap');
            $flush .= Html::divOp('main-wrap');
        }

        $flush .= Html::headerCond($this->header());
        $flush .= Html::mainOp();
        $flush .= Html::divOp('inner');

        if($this->flushBeforeMain())
        Base\Buffer::flushEcho($flush);
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


    // loader
    // génère le html pour le loader
    final protected function loader():string
    {
        $r = Html::div(null,'loading-icon');
        $r .= Html::div(null,'loading-progress');

        return $r;
    }


    // header
    // génère le header pour toutes les pages du cms
    final protected function header():string
    {
        $r = '';

        $r .= Html::divOp('top');
        $r .= Html::div(null,['burger-menu','icon-solo','burger']);
        $r .= Html::div($this->headerLeft(),'left');
        $r .= Html::div($this->headerRight(),'right');
        $r .= Html::divCl();

        return $r;
    }


    // headerLeft
    // génère le header gauche pour toutes les pages du cms
    final protected function headerLeft():string
    {
        $r = '';

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

            if($this->hasPermission('sessionInfo'))
            {
                $route = PopupSession::make();
                $popup = ($route->canTrigger())? true:false;

                $attr = ['popup-trigger',(!empty($popup))? ['with-ajax','with-popup','with-icon','anchor-corner']:null];
                $r .= Html::divOp($attr);

                if($popup === true)
                $r .= $route->a($username,'popup-title');
                else
                $r .= Html::span($username,'popup-title');

                $r .= Html::div(null,'popup');
                $r .= Html::divCl();
            }

            if($this->hasPermission('account'))
            $r .= Account::make()->aTitle(null,['with-icon','no-border','account']);

            if($this->hasPermission('accountChangePassword'))
            $r .= AccountChangePassword::make()->aDialog(['with-icon','no-border','password']);

            $route = SessionRole::make();
            if($route->canTrigger())
            {
                $active = ($session->hasFakeRoles())? 'active':null;
                $r .= SessionRole::make()->aDialog(['with-icon','no-border','mask',$active]);
            }

            if($this->hasPermission('logout'))
            $r .= Logout::make()->aTitle(null,['with-icon','no-border','logout']);
        }

        return $r;
    }


    // hasNav
    // retourne vrai si la route doit afficher la navigation
    final public function hasNav():bool
    {
        return ($this->getAttr('mainNav') === true)? true:false;
    }


    // navWrap
    // génère le html pour la navigation à gauche
    final protected function navWrap():string
    {
        $r = null;
        $boot = static::boot();
        $img = Html::ImgCond($boot->getOption('logo'),$boot->label());

        $r .= Html::divOp('nav-fixed');

        $r .= Html::divOp('nav-top');
        $r .= Html::div(null,['nav-close','icon-solo','close']);

        if(!empty($img))
        $r .= Html::a($boot->schemeHost(),$img,'logo');

        $r .= Html::divCl();

        $r .= Html::navCond($this->nav());
        $r .= Html::divCl();

        return $r;
    }


    // nav
    // génère la navigation principale pour toutes les pages du cms
    final protected function nav():string
    {
        $r = '';
        $tables = $this->db()->tables();
        $tables = $tables->hasPermission('view');
        $hierarchy = $tables->hierarchy(false);

        $r .= Html::ulCond($this->navMenu($hierarchy));

        return $r;
    }


    // navMenu
    // génère un niveau de menu pour la navigation principale
    final protected function navMenu(array $array,int $i=0):string
    {
        $r = '';
        $session = $this->session();
        $tables = $this->db()->tables();
        $lang = $this->lang();
        $specificAdd = SpecificAdd::getOverloadClass();

        if($i >= 2)
        static::throw('tooDeep',$array);

        if(!empty($array))
        {
            $ii = $i + 1;

            foreach ($array as $key => $value)
            {
                if(is_string($key) && !empty($key))
                {
                    $html = '';
                    $routeHtml = '';
                    $table = $tables->get($key);
                    $class = [];

                    if(!empty($table))
                    {
                        $route = static::session()->routeTableGeneral($table,true);
                        $option = ($route->routeRequest()->isSegmentParsedFromValue())? ['query'=>false]:null;
                        $routeHtml .= $route->aTitle(null,null,null,$option);

                        if($i > 0 && $table->hasPermission('insert','lemurInsert','mainNavAdd'))
                        {
                            $class[] = 'with-specific-add';
                            $route = $specificAdd::make($table);
                            $routeHtml .= $route->makeNavLink();
                        }
                    }

                    if(is_array($value))
                    {
                        $class[] = 'with-carousel';
                        $keys = array_keys($value);

                        if($this->isTableTop($keys))
                        $class[] = ['active','top'];

                        $label = $lang->tableLabel($key);
                        $subNav = $this->navMenu($value,$ii);

                        if(!empty($subNav))
                        {
                            $html .= Html::divOp('trigger');
                            $html .= Html::div(null,['triangle']);
                            $html .= Html::span($label);
                            $html .= Html::divCl();
                            $html .= Html::divOp('target');
                            $html .= Html::ulOp();
                            $html .= $routeHtml;
                            $html .= $subNav;
                            $html .= Html::ulCl();
                            $html .= Html::divCl();
                        }
                    }

                    else
                    $html = $routeHtml;

                    $r .= Html::liCond($html,$class);
                }
            }
        }

        return $r;
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

        if($this->hasPermission('footerLink'))
        $r .= $this->footerElement('link',$this->footerLink());

        if($this->hasPermission('footerLang'))
        $r .= $this->footerElement('lang',$this->footerLang());

        if($this->hasPermission('footerModule'))
        $r .= $this->footerElement('module',$this->footerModule());

        if($this->hasPermission('footerCli'))
        $r .= $this->footerElement('cli',$this->footerCli());

        if($this->hasPermission('footerAuthor'))
        $r .= $this->authorLink(['with-icon','author','lemur','no-border']);

        $copyright = static::langText('footer/version',['version'=>$version]);
        $route = PopupBoot::make($this);
        $popup = ($route->canTrigger() && $route->isValidSegment())? true:false;
        $attr = ['popup-trigger',(!empty($popup))? ['with-ajax','with-popup','with-icon','anchor-corner']:null];
        $r .= Html::divOp($attr);

        if($popup === true)
        $r .= $route->a($copyright,'popup-title');
        else
        $r .= Html::span($copyright,'popup-title');

        $r .= Html::divCond($popup,'popup');
        $r .= Html::divCl();

        return $r;
    }


    // footerElement
    // génère un clickOpen pour la partie gauche du footer
    final protected function footerElement(string $type,array $array):string
    {
        $r = '';
        $popup = '';
        $top = null;
        foreach ($array as $value) {
            if($value instanceof Lemur\Route)
            {
                $top = ($value::classFqcn() === static::class)? 'top':$top;
                $value = $value->aTitle();
            }

            $popup .= Html::li($value);
        }
        $popup = Html::ulCond($popup);
        $label = static::langText(['footer',$type]);

        if(!empty($popup))
        {
            $attr = [$top,'anchor-corner','with-submenu'];
            $r .= Html::divOp($attr);
            $r .= Html::div($label,['with-icon','no-border','trigger',$type]);
            $r .= Html::divCond($popup,'popup');
            $r .= Html::divCl();
        }

        return $r;
    }


    // footerLink
    // retourne un tableau avec les routes liens
    final protected function footerLink():array
    {
        $return = [];

        if($this->hasPermission('footerLinkType'))
        $return = $this->footerLinkType();

        $return = Base\Arr::append($return,$this->footerRouteGroup('link'));

        return $return;
    }


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
            if($key === 'cms' && !$this->hasPermission('footerLinkTypeCms'))
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
        $routes = static::boot()->routesActive();
        $routes = $routes->filter(['group'=>$group]);

        if($routes->isNotEmpty())
        {
            foreach ($routes as $route)
            {
                $return[] = $route::make();
            }
        }

        return $return;
    }


    // makeModal
    // génère le html pour le modal
    final protected function makeModal():string
    {
        $r = Html::divOp('outer');
        $r .= Html::divOp('box');
        $r .= Html::div(null,['icon-solo','close']);
        $r .= Html::divOp('inner');
        $r .= Html::divCl();
        $r .= Html::divCl();
        $r .= Html::divCl();

        return $r;
    }


    // makeCom
    // génère le block pour la communication
    final protected function makeCom():string
    {
        $r = '';
        $com = static::sessionCom();
        $comText = $com->flush();

        if(!empty($comText))
        {
            $route = Specific::make(true);
            $data = ['href'=>$route,'char'=>$route::getReplaceSegment()];

            $r .= Html::divOp(['com','data'=>$data]);
            $r .= Html::div(null,['icon-solo','close']);
            $r .= Html::divOp('top');
            $r .= Html::div(null,'triangle');
            $r .= Html::div(Base\Date::format(4),'date');
            $r .= Html::divCl();
            $r .= Html::div(null,'spacer');
            $r .= Html::div($comText,'bottom');
            $r .= Html::divCl();
        }

        return $r;
    }
}
?>