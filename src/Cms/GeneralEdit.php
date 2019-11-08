<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// generalEdit
// class for the route that allows quick editing a cell from the general page
class GeneralEdit extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use Lemur\Route\_specificPrimary;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;
    use Lemur\Segment\_col;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/[primary]/[col]',
            'fr'=>'table/[table]/[primary]/[col]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary',
            'col'=>'structureSegmentCol'],
        'group'=>'general',
        'match'=>[
            'role'=>['>'=>'user']],
        'sitemap'=>false
    ];


    // onBefore
    // validation avant le lancement de la route
    final protected function onBefore()
    {
        return $this->canTrigger();
    }


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();
        $row = $this->row();
        $col = $this->segment('col');

        if($table instanceof Core\Table && $table->hasPermission('view','update','lemurUpdate','quickEdit'))
        {
            if($row->isUpdateable() && $col->isQuickEditable())
            $return = true;
        }

        return $return;
    }


    // cell
    // retourne la cellule
    final protected function cell():Lemur\Cell
    {
        return $this->row()->cell($this->segment('col'));
    }


    // trigger
    // lance la route
    final public function trigger()
    {
        return $this->output();
    }


    // submitRoute
    // retourne la route pour soumettre le formulaire
    final protected function submitRoute():GeneralEditSubmit
    {
        return GeneralEditSubmit::makeOverload($this->segments());
    }


    // output
    // génère le output html de la route
    final protected function output():string
    {
        $r = '';
        $route = $this->submitRoute();
        $col = $this->segment('col');
        $data = $col->getComplexDataAttr();
        $attr = ['anchor-corner','form-element','data'=>$data];

        $r .= $route->formOpen();
        $r .= $this->makeFormPrimary();
        $r .= $this->tableHiddenInput();
        $r .= Html::divCond($this->makeTools(),'tools');

        $r .= Html::div($this->makeComponent(),$attr);
        $r .= Html::formCl();

        return $r;
    }


    // makeFormPrimary
    // génère le input hidden pour la colonne primaire
    final protected function makeFormPrimary():string
    {
        $r = '';
        $primary = $this->table()->primary();
        $cell = $this->row()->cell($primary);
        $r = $cell->formHidden(['name'=>'-primary-']);

        return $r;
    }


    // makeComponent
    // génère le champ pour la cellule
    final protected function makeComponent():string
    {
        $r = '';
        $cell = $this->cell();
        $form = $cell->formComplex();
        $r = Html::divCond($form,['specific-component','general-page']);

        return $r;
    }


    // makeTools
    // génère les outils, soit les boutons submit et revert
    final protected function makeTools():string
    {
        $r = '';
        $r .= Html::button(null,['icon','solo','close','revert','tool']);
        $r .= Html::submit(null,['icon','solo','check','tool']);

        return $r;
    }
}

// init
GeneralEdit::__init();
?>