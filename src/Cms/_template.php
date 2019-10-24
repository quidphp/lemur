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
        $flush .= Html::divOp('#wrapper');
        $flush .= Html::div(null,'loading-icon');
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

        $com = Html::divCond($this->makeCom(),'com');

        $r .= $main.$com.$close;

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

        $r .= Html::div($boot->typeLabel(),'context-type');

        return $r;
    }


    // headerRight
    // génère le header droite pour toutes les pages du cms
    protected function headerRight():string
    {
        $r = '';
        $session = static::session();

        if($session->isSomebody())
        {
            $user = $session->user();
            $username = $user->username();
            $dateLogin = $user->dateLogin();

            $r .= Html::divOp('top');

            if($this->hasPermission('account'))
            $r .= Account::makeOverload()->aTitle(null,['submit','icon','padLeft','account']);

            if($this->hasPermission('accountChangePassword'))
            $r .= AccountChangePassword::makeOverload()->aDialog(['submit','icon','padLeft','password']);

            if($this->hasPermission('logout'))
            $r .= Logout::makeOverload()->aTitle(null,['submit','icon','padLeft','logout']);

            $r .= Html::divCl();

            $route = PopupSession::makeOverload();
            $popup = ($route::allowed())? true:false;
            $attr = ['popup-trigger',(!empty($popup))? ['with-ajax','with-popup','with-icon','anchor-corner']:null];
            $r .= Html::divOp($attr);

            if($popup === true)
            $r .= $route->a($username,'popup-title');
            else
            $r .= Html::span($username,'popup-title');

            $r .= Html::div(null,'popup');
            $r .= Html::divCl();
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

        $r .= Html::ulCond($this->navMenu($hierarchy,0));

        return $r;
    }


    // navMenu
    // génère un niveau de menu pour la navigation principale
    protected function navMenu(array $array,int $i):string
    {
        $r = '';
        $session = $this->session();
        $tables = $this->db()->tables();
        $lang = $this->lang();
        $specificAdd = SpecificAdd::getOverloadClass();

        if(!empty($array))
        {
            $ii = $i + 1;

            foreach ($array as $key => $value)
            {
                if(is_string($key) && !empty($key))
                {
                    $table = $tables->get($key);

                    if(is_array($value))
                    {
                        $class = ['sub','anchor-corner'];
                        $keys = array_keys($value);

                        if($this->isTableTop($keys))
                        $class[] = 'top';
                    }

                    else
                    $class = [];

                    $r .= Html::liOp($class);

                    if(!empty($table))
                    {
                        $route = static::session()->routeTableGeneral($table,true);

                        $option = ($route->routeRequest()->isSegmentParsedFromValue())? ['query'=>false]:null;
                        $r .= $route->aTitle(null,null,null,$option);

                        if($i > 0 && !empty($specificAdd) && $table->hasPermission('insert','lemurInsert','mainNavAdd'))
                        {
                            $route = $specificAdd::makeOverload($table);
                            $r .= $route->makeNavLink();
                        }
                    }

                    else
                    {
                        $label = $lang->tableLabel($key);
                        $r .= Html::span($label);
                    }

                    if(is_array($value))
                    {
                        $r .= Html::div(null,['arrow','white']);
                        $r .= Html::ulCond($this->navMenu($value,$ii));
                    }

                    $r .= Html::liClose();
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
        $links = $this->footerLinks();

        if(!empty($links))
        {
            foreach ($links as $link)
            {
                if(is_string($link))
                $r .= Html::liCond($link);
            }

            $r = Html::ulCond($r);
            $r = Html::navCond($r);
        }

        return $r;
    }


    // footerLinks
    // retourne un tableau avec tous les liens à mettre dans la partie gauche du footer
    protected function footerLinks():array
    {
        $return = [];
        $session = static::session();

        if($this->hasPermission('footerTypes'))
        $return = Base\Arr::append($return,$this->footerTypes());

        if($this->hasPermission('footerModules'))
        $return = Base\Arr::append($return,$this->footerModules());

        return $return;
    }


    // footerTypes
    // retourne un tableau avec les liens vers les différents types
    // n'inclut pas un lien vers le type courant ou le type du cms
    protected function footerTypes():array
    {
        $return = [];
        $session = static::session();
        $boot = static::boot();
        $type = $boot->type();
        $schemeHosts = $boot->schemeHostTypes();
        $lang = $this->lang();

        foreach ($schemeHosts as $key => $uri)
        {
            if($key === 'cms' && !$this->hasPermission('footerTypesCms'))
            continue;

            if($key !== $type)
            {
                $label = $lang->typeLabel($key);
                $return[] = Html::a($uri,$label);
            }
        }

        return $return;
    }


    // footerModules
    // retourne un tableau avec les liens pour les modules
    protected function footerModules():array
    {
        $return = [];
        $routes = static::boot()->routesActive();
        $modules = $routes->filter(['group'=>'module']);

        if($modules->isNotEmpty())
        {
            foreach ($modules as $module)
            {
                $return[] = $module::makeOverload()->aTitle();
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
        $popup = ($route::allowed() && $route->isValidSegment())? true:false;
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
        $r = Html::divOp('background');
        $r .= Html::divOp('outer');
        $r .= Html::divOp('box');
        $r .= Html::div(null,['icon','solo','close']);
        $r .= Html::divOp('inner');
        $r .= Html::divCl();
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

            $r .= Html::divOp(['box','data'=>$data]);
            $r .= Html::div(null,['icon','solo','close']);
            $r .= Html::divOp('top');
            $r .= Html::div(null,['arrow','black']);
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