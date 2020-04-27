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

// tableRelation
// class for the route which manages table relation, used by some inputs in the CMS
class TableRelation extends Core\RouteAlias
{
    // trait
    use _common;
    use _tableRelation;
    use Lemur\Segment\_table;
    use Lemur\Segment\_orderTableRelation;
    use Lemur\Segment\_page;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'table/relation/[table]/[order]/[page]',
            'fr'=>'table/relation/[table]/[order]/[page]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'order'=>'structureSegmentOrderTableRelation',
            'page'=>'structureSegmentPage'],
        'method'=>'tableRelationOutput'
    ];


    // canTrigger
    // validation pour le lancement de la route
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();

        if(parent::canTrigger() && $table->hasPermission('view','relation','tableRelation'))
        $return = true;

        return $return;
    }


    // table
    // retourne la table pour la route
    final public function table():Lemur\Table
    {
        return $this->segment('table');
    }


    // makeResults
    // génère les résultats d'affichage de la relation
    final protected function makeResults(array $array,$attr=null,?int $loadMore=nul):string
    {
        $r = '';

        if(!empty($array))
        {
            foreach ($array as $key => $value)
            {
                $r .= Html::li($value);
            }

            if(!empty($r) && is_int($loadMore))
            $r .= $this->loadMore($loadMore);

            $r = Html::ulCond($r,$attr);
        }

        return $r;
    }
}

// init
TableRelation::__init();
?>