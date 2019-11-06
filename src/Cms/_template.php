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


    // trigger
    // trigger pour toutes les pages html du cms
    public function trigger()
    {
        return $this->template();
    }


    // template
    protected function template():string
    {
        $r = '';

        $flush = $this->docOpen();

        $flush .= Html::divOp('loading-fixed');
        $flush .= Html::div(null,'loading-icon');
        $flush .= Html::div(null,'loading-progress');
        $flush .= Html::divCl();
        
        $flush .= Html::div(null,'background');
        
        $flush .= Html::divOp('#wrapper');
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
        $close .= Html::divCl();
        $close .= Html::divCond($this->makeModal(),'modal');
        $close .= $this->docClose();

        $com = $this->makeCom();
        $r .= $com.$main.$close;

        return $r;
    }


    // header
    // génère le header pour toutes les pages du cms
    protected function header():string
    {
        $r = '';

        $r .= Html::divOp('top');
        $r .= Html::div(null,['burger-menu','icon','burger','solo']);
        $r .= Html::divCond($this->headerLeft(),'left');
        $r .= Html::divCond($this->headerRight(),'right');
        $r .= Html::divCl();
        $r .= Html::navCond($this->nav());

        return $r;
    }


    // headerLeft
    // génère le header gauche pour toutes les pages du cms
    protected function headerLeft():string
    {
        $r = '';
        $boot = static::boot();
        $route = Home::makeOverload();

        $r .= Html::divOp('boot-label');
        $r .= $route->a($boot->label());
        $r .= Html::divCl();

        return $r;
    }


    // headerRight
    // génère le header droite pour toutes les pages du cms
    protected function headerRight():string
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
                $route = PopupSession::makeOverload();
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
            $r .= Account::makeOverload()->aTitle(null,['submit','icon','padLeft','account']);

            if($this->hasPermission('accountChangePassword'))
            $r .= AccountChangePassword::makeOverload()->aDialog(['submit','icon','padLeft','password']);
            
            $route = SessionRole::makeOverload();
            if($route->canTrigger())
            {
                $active = ($session->hasFakeRoles())? 'active':null;
                $r .= SessionRole::makeOverload()->aDialog(['submit','icon','padLeft','mask',$active]);
            }
            
            if($this->hasPermission('logout'))
            $r .= Logout::makeOverload()->aTitle(null,['submit','icon','padLeft','logout']);
        }

        return $r;
    }


    // nav
    // génère la navigation principale pour toutes les pages du cms
    protected function nav():string
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
    protected function navMenu(array $array,int $i=0):string
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
                            $route = $specificAdd::makeOverload($table);
                            $routeHtml .= $route->makeNavLink();
                        }
                    }
                    
                    if(is_array($value))
                    {
                        $class[] = 'with-submenu';
                        $class[] = 'anchor-corner';
                        $keys = array_keys($value);

                        if($this->isTableTop($keys))
                        $class[] = 'top';
                        
                        $label = $lang->tableLabel($key);
                        $subNav = $this->navMenu($value,$ii);
                        
                        if(!empty($subNav))
                        {
                            $html .= Html::divOp('trigger');
                            $html .= Html::div(null,['triangle']);
                            $html .= Html::span($label);
                            $html .= Html::divCl();
                            $html .= Html::divOp('popup');
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
    protected function flushBeforeMain():bool
    {
        return false;
    }


    // main
    // méthode main à étendre dans chaque route du template
    abstract protected function main();


    // makeH1
    // génère le tag h1 de la page, il y a dans le h1 un lien qui renvoie vers la même page
    protected function makeH1(string $title):string
    {
        return Html::h1($this->a($title));
    }


    // footer
    // génère le footer pour toutes les pages du cms
    protected function footer():string
    {
        $r = '';

        $r .= Html::div($this->footerLeft(),'left');
        $r .= Html::divCond($this->footerRight(),'right');

        return $r;
    }


    // footerLeft
    // génère la partie gauche du footer pour toutes les pages du cms
    protected function footerLeft():string
    {
        $r = '';
        
        if($this->hasPermission('footerLink'))
        $r .= $this->footerLeftElement('link',$this->footerLink());
        
        if($this->hasPermission('footerLang'))
        $r .= $this->footerLeftElement('lang',$this->footerLang());
        
        if($this->hasPermission('footerModule'))
        $r .= $this->footerLeftElement('module',$this->footerModule());
        
        if($this->hasPermission('footerCli'))
        $r .= $this->footerLeftElement('cli',$this->footerCli());
        
        return $r;
    }

    
    // footerLeftElement
    // génère un clickOpen pour la partie gauche du footer
    protected function footerLeftElement(string $type,array $array):string 
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
        $label = static::langText(array('footer',$type));
        
        if(!empty($popup))
        {
            $attr = array($top,'anchor-corner','with-submenu');
            $r .= Html::divOp($attr);
            $r .= Html::span($label,array('submit','icon','padLeft','trigger',$type));
            $r .= Html::div($popup,'popup');
            $r .= Html::divCl();
        }
        
        return $r;
    }
    
    
    // footerLink
    // retourne un tableau avec les routes liens
    protected function footerLink():array
    {
        $return = array();
        
        if($this->hasPermission('footerLinkType'))
        $return = $this->footerLinkType();
        
        $return = Base\Arr::append($return,$this->footerRouteGroup('link'));
        
        return $return;
    }
    
    
    // footerLinkType
    // retourne un tableau avec les liens vers les différents types
    // n'inclut pas un lien vers le type courant
    protected function footerLinkType():array
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
    protected function footerLang():array 
    {
        $return = array();
        $lang = static::lang();
        
        foreach ($lang->allLang() as $value) 
        {
            $label = $lang->langLabel($value);
            $route = ($this::isRedirectable())? $this:Home::makeOverload();

            $return[] = $route->a($label,null,$value);
        }
        
        return $return;
    }
    
    
    // footerModule
    // retourne un tableau avec les routes modules
    protected function footerModule():array
    {
        return $this->footerRouteGroup('module');
    }
    
    
    // footerCli
    // retourne un tableau avec les routes cli
    protected function footerCli():array
    {
        return $this->footerRouteGroup('cli');
    }

    
    // footerRouteGroup
    // méthode utilisé par link, module et cli pour obtenir un tableau avec les liens de route
    protected function footerRouteGroup(string $group):array
    {
        $return = [];
        $routes = static::boot()->routesActive();
        $routes = $routes->filter(['group'=>$group]);

        if($routes->isNotEmpty())
        {
            foreach ($routes as $route)
            {
                $return[] = $route::makeOverload();
            }
        }

        return $return;
    }
    
    
    // footerRight
    // génère la partie droite du footer pour toutes les pages du cms
    protected function footerRight():string
    {
        $r = '';
        $boot = static::boot();
        $showQuid = $boot->getOption('versionQuid') ?? true;
        $version = $boot->version(true,$showQuid,true);

        $author = $this->authorLink();
        $copyright = static::langText('footer/copyright',['version'=>$version]);

        $r .= Html::span($author,'author');
        $r .= Html::span('|','separator');

        $route = PopupBoot::makeOverload($this);
        $popup = ($route->canTrigger() && $route->isValidSegment())? true:false;
        $attr = ['popup-trigger',(!empty($popup))? ['with-ajax','with-popup','with-icon','anchor-corner']:null];
        $r .= Html::divOp($attr);

        if($popup === true)
        $r .= $route->a($copyright,'popup-title');
        else
        $r .= Html::span($copyright,'popup-title');

        $r .= Html::div($popup,'popup');
        $r .= Html::divCl();

        return $r;
    }


    // makeModal
    // génère le html pour le modal
    protected function makeModal():string
    {
        $r = Html::divOp('outer');
        $r .= Html::divOp('box');
        $r .= Html::div(null,['icon','solo','close']);
        $r .= Html::divOp('inner');
        $r .= Html::divCl();
        $r .= Html::divCl();
        $r .= Html::divCl();

        return $r;
    }


    // makeCom
    // génère le block pour la communication
    protected function makeCom():string
    {
        $r = '';
        $com = static::sessionCom();
        $comText = $com->flush();

        if(!empty($comText))
        {
            $route = Specific::makeOverload(true);
            $data = ['href'=>$route,'char'=>$route::getReplaceSegment()];

            $r .= Html::divOp(['com','data'=>$data]);
            $r .= Html::div(null,['icon','solo','close']);
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