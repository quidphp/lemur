<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// specificAdd
// class for the specific add route of the CMS, generates the insert form for a row
class SpecificAdd extends Core\RouteAlias
{
    // trait
    use _templateAlias;
    use _general;
    use _specificAddMulti;
    use Lemur\Segment\_table;


    // config
    public static array $config = [
        'path'=>[
            'en'=>'table/[table]/add/0',
            'fr'=>'table/[table]/ajouter/0'],
        'segment'=>[
            'table'=>'structureSegmentTable'],
        'match'=>[
            'session'=>'canAccess'],
        'parent'=>Specific::class,
        'group'=>'specific',
        'sitemap'=>true
    ];


    // dynamique
    protected ?array $flash = null; // garde une copie des données flash


    // onBefore
    // validation avant le lancement de la route
    final protected function onBefore()
    {
        $return = false;

        if(parent::onBefore())
        {
            $table = $this->table();
            $flash = $this->session()->flash();
            $route = SpecificAddSubmit::make($table);
            $this->flash = $flash->get($route);
            $return = true;
        }

        return $return;
    }


    // canTrigger
    // validation avant le lancement de la route
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->segment('table');

        if(parent::canTrigger() && $table instanceof Core\Table && $table->hasPermission('view','specific','insert','lemurInsert'))
        $return = true;

        return $return;
    }


    // onPrepared
    // génère les uri sélectionnés pour la route
    final protected function onPrepared()
    {
        if(!$this->hasSpecificAddNavLink())
        {
            $table = $this->table();
            $session = static::session();
            $session->routeTableGeneral($table)->addSelectedUri();
        }

        return;
    }


    // routeSubmit
    // retourne la route pour submit
    final protected function routeSubmit():SpecificAddSubmit
    {
        return SpecificAddSubmit::make($this->segments());
    }


    // hasSpecificAddNavLink
    // retourne vrai si la route doit apparaître sur sa propre ligne dans le menu
    final public function hasSpecificAddNavLink():bool
    {
        return $this->table()->getAttr('specificAddNavLink') === true;
    }


    // flash
    // retourne la valeur flash à partir d'une colonne
    final protected function flash(?Core\Col $key=null)
    {
        return Base\Arr::getSafe((!empty($key))? $key->name():$key,$this->flash);
    }


    // makeNavLink
    // fait le lien ajout pour le menu
    final public function makeNavLink():string
    {
        $r = '';
        $table = $this->table();

        if($this->hasSpecificAddNavLink())
        {
            $r .= Html::liCl();
            $r .= Html::liOpen($this->aTitle(null,'text'));
        }

        else
        $r .= $this->a(null,['add','icon-solo','specific-add']);

        return $r;
    }


    // makeAddTitle
    // génère le titre spécifique d'ajout pour la table, si existant
    final protected function makeAddTitle(?string $lang=null):?string
    {
        $r = null;
        $table = $this->table();
        $r = $this->lang()->safe(['table','add',$table],null,$lang);

        return $r;
    }


    // makeTitle
    // génère le titre pour la route
    final protected function makeTitle(?string $lang=null):string
    {
        $r = $this->makeAddTitle($lang);

        if(empty($r))
        {
            $r .= $this->table()->label(null,$lang);
            $r .= ' | ';
            $r .= static::langText('specific/add');
        }

        return $r;
    }


    // allSegment
    // tous les segments pour la route, un par table
    final public static function allSegment():array
    {
        $return = [];
        $db = static::db();

        foreach ($db->tables() as $table)
        {
            if($table->hasPermission('view'))
            $return[] = $table;
        }

        return $return;
    }


    // makeNav
    // génère la nav pour la page, en haut à droite
    final protected function makeNav():string
    {
        $r = '';
        $table = $this->table();

        if($table->hasPermission('nav','navBack'))
        {
            $general = $this->general();
            $r .= Html::div($general->a(static::langText('specific/back')),'nav');
        }

        return $r;
    }


    // makeFormSubmit
    // génère le submit pour le formulaire d'ajout
    final protected function makeFormSubmit(string $type):string
    {
        return Html::submit(static::langText('specific/add'),['with-icon','add']);
    }


    // makeFormWrap
    // génère un wrap label -> field pour le formulaire
    final protected function makeFormWrap(Core\Col $col,array $replace):string
    {
       $return = '';
       $value = true;

       if(!empty($this->flash))
       $value = $this->flash($col);

       $return .= $col->specificComponentWrap($this->getFormWrap(),'%:',$value,null,$replace);

       return $return;
    }
}

// init
SpecificAdd::__init();
?>