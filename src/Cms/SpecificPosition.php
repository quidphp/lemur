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
use Quid\Core;
use Quid\Lemur;

// specificPosition
// class for a route that redirects to the proper specific route according to a position
class SpecificPosition extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use Lemur\Segment\_table;
    use Lemur\Segment\_int;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'table/[table]/position/[position]',
            'fr'=>'table/[table]/position/[position]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'position'=>'structureSegmentInt'],
        'group'=>'specific',
        'match'=>[
            'session'=>'canAccess']
    ];


    // canTrigger
    // validation avant le lancement de la route
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();
        $specific = $this->specific();

        if(parent::canTrigger() && $table->hasPermission('view','specific') && !empty($specific))
        $return = true;

        return $return;
    }


    // onAfter
    // redirige vers la bonne page spécifique si existante
    final protected function onAfter()
    {
        $panel = $this->currentPanel();
        static::session()->flash()->set('currentPanel',$panel);

        return $this->specific();
    }


    // currentPanel
    // retourne le panel courant à partir de la requête, est storé dans la query
    final public function currentPanel():?string
    {
        return $this->request()->getQuery(static::panelInputName(false));
    }


    // index
    // retourne l'index la row
    final protected function index():int
    {
        return $this->segment('position') - 1;
    }


    // row
    // retourne la row à éditer si existante
    final public function row():?Core\Row
    {
        $return = null;
        $index = $this->index();
        $sql = $this->general()->sql();
        $sql->limit(1,$index);
        $return = $sql->triggerRow();

        return $return;
    }


    // specific
    // retourne la route specifique si existante
    final protected function specific():?Specific
    {
        $return = null;
        $row = $this->row();

        if(!empty($row))
        $return = Specific::make($row);

        return $return;
    }


    // trigger
    // trigger ne fait rien
    final public function trigger()
    {
        return;
    }


    // structureSegmentIntMinimum
    // retourne la valeur minimum pour la position
    final public static function structureSegmentIntMinimum():int
    {
        return 1;
    }
}

// init
SpecificPosition::__init();
?>