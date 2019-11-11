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
use Quid\Core;
use Quid\Lemur;

// specificAdd
// class for the specific add route of the CMS, generates the insert form for a row
class SpecificAdd extends Core\RouteAlias
{
    // trait
    use _templateAlias;
    use _general;
    use _specific;
    use Lemur\Segment\_table;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/add/0',
            'fr'=>'table/[table]/ajouter/0'],
        'segment'=>[
            'table'=>'structureSegmentTable'],
        'match'=>[
            'role'=>['>'=>'user']],
        'parent'=>Specific::class,
        'group'=>'specific',
        'sitemap'=>true
    ];


    // dynamique
    protected $flash = null; // garde une copie des données flash


    // onBefore
    // validation avant le lancement de la route
    final protected function onBefore()
    {
        $return = false;
        $table = $this->segment('table');

        if($table instanceof Core\Table && $table->hasPermission('view','insert','lemurInsert'))
        {
            $flash = $this->session()->flash();
            $route = SpecificAddSubmit::make($this->table());
            $this->flash = $flash->get($route);
            $return = $this;
        }

        return $return;
    }


    // selectedUri
    // retourne les uri sélectionnés pour la route
    final public function selectedUri():array
    {
        $return = [];

        if(!$this->hasSpecificAddNavLink())
        {
            $table = $this->table();
            $root = static::session()->routeTableGeneral($table);
            $uri = $root->uri();
            $return[$uri] = true;
        }

        return $return;
    }


    // hasSpecificAddNavLink
    // retourne vrai si la route doit apparaître sur sa propre ligne dans le menu
    final public function hasSpecificAddNavLink():bool
    {
        return ($this->table()->getAttr('specificAddNavLink') === true)? true:false;
    }


    // isPanelVisible
    // retourne vrai si le panneau est visible
    final protected function isPanelVisible(Core\Cols $cols):bool
    {
        return ($cols->isHidden(static::session()))? false:true;
    }


    // flash
    // retourne la valeur flash à partir d'une colonne
    final protected function flash(?Core\Col $key=null)
    {
        return Base\Arr::getSafe((!empty($key))? $key->name():$key,$this->flash);
    }


    // makeTitleBox
    // génère le titre pour la page specificAdd
    final protected function makeTitleBox():string
    {
        return $this->makeH1($this->makeTitle());
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


    // main
    // fait main pour specificAdd
    final public function main():string
    {
        $r = $this->makeTop();
        $r .= $this->makeForm();

        return $r;
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

            $r .= Html::divOp('nav');
            $r .= $general->a(static::langText('specific/back'));
            $r .= Html::divCl();
        }

        return $r;
    }


    // makeForm
    // génère le formulaire pour la page
    final protected function makeForm():string
    {
        $r = '';

        $r .= Html::divOp('container');
        $r .= Html::divOp('form');
        $r .= SpecificAddSubmit::make($this->segments())->formOpen();
        $r .= $this->makeFormTop();
        $r .= $this->makeFormInner();
        $r .= $this->makeFormBottom();
        $r .= Html::formCl();
        $r .= Html::divCl();
        $r .= Html::divCl();

        return $r;
    }


    // makeFormBottom
    // génère la partie inférieure du formulaire
    final protected function makeFormBottom():string
    {
        $r = '';

        $r .= Html::divOp('bottom');
        $r .= $this->makeFormSubmit('bottom');
        $r .= Html::divCl();

        return $r;
    }


    // colCell
    // retourne la colonne
    final protected function colCell(Core\Col $col):Core\Col
    {
        return $col;
    }


    // colCellVisible
    // retourne la colonne si elle est visible
    final protected function colCellVisible(Core\Col $col):?Core\Col
    {
        $return = null;

        $col = $this->colCell($col);
        $session = static::session();
        if($col->isVisible(true,null,$session))
        $return = $col;

        return $return;
    }


    // makeOperation
    // fait le bloc opération en haut à doite
    // pour add seulement le bouton submit
    final protected function makeOperation():string
    {
        return $this->makeFormSubmit('top');
    }


    // makeFormWrap
    // génère un wrap label -> field pour le formulaire
    final protected function makeFormWrap(Core\Col $col,array $replace):string
    {
        $return = '';
        $value = true;

        if(!empty($this->flash))
        $value = $this->flash($col);

        $return .= $col->specificComponent($this->getFormWrap(),'%:',$value,null,$replace);

        return $return;
    }


    // formWrapAttr
    // retourne les attributs par défaut pour le formWrap
    final protected function formWrapAttr(Core\Col $col):?array
    {
        return null;
    }


    // makeFormSubmit
    // génère le submit pour le formulaire d'ajout
    final protected function makeFormSubmit(string $type):string
    {
        return Html::submit(static::langText('specific/add'),['with-icon','add']);
    }
}

// init
SpecificAdd::__init();
?>