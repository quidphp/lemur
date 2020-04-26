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
    public static array $config = [
        'path'=>[
            'en'=>'table/[table]/[primary]/[col]',
            'fr'=>'table/[table]/[primary]/[col]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary',
            'col'=>'structureSegmentCol'],
        'group'=>'general',
        'match'=>[
            'ajax'=>true,
            'session'=>'canAccess'],
        'parent'=>General::class,
        'sitemap'=>false,
        'history'=>false
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();
        $row = $this->row();
        $col = $this->segment('col');

        if(parent::canTrigger() && $table instanceof Core\Table && $table->hasPermission('view','general','lemurUpdate','quickEdit'))
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
        return GeneralEditSubmit::make($this->segments());
    }


    // output
    // génère le output html de la route
    final protected function output():string
    {
        $r = '';
        $route = $this->submitRoute();
        $col = $this->segment('col');
        $attr = $col->getFormElementAttr();

        $r .= $route->formOpen();
        $r .= $this->makeFormPrimary();
        $r .= $this->tableHiddenInput();
        $r .= Html::divCond($this->makeTools(),'tools');

        $r .= Html::div($this->makeFormComponent(),$attr);
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


    // makeFormComponent
    // génère le specific component pour la form
    final protected function makeFormComponent():string
    {
        return $this->cell()->specificComponent();
    }


    // makeTools
    // génère les outils, soit les boutons submit et revert
    final protected function makeTools():string
    {
        $r = '';
        $r .= Html::button(null,['icon-solo','close','revert','tool']);
        $r .= Html::submit(null,['icon-solo','check','tool']);

        return $r;
    }
}

// init
GeneralEdit::__init();
?>