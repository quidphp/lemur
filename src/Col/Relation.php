<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// relation
// extended abstract class extended for relation
abstract class Relation extends Core\Col\Relation
{
    // config
    public static $config = [
        'specificLink'=>false,
        '@cms'=>[
            'sortable'=>null,
            'specificLink'=>true, // fait un lien vers spécifique dans cms
            'route'=>[
                'specific'=>Lemur\Cms\Specific::class,
                'specificRelation'=>Lemur\Cms\SpecificRelation::class]]
    ];

    
    // isSortable
    // retourne vrai si la relation est sortable
    public function isSortable():bool
    {
        return false;
    }
    
    
    // prepareRelationRadioCheckbox
    // méthode utilisé lors de la préparation d'une valeur relation radio ou checkbox, incluant search
    protected function prepareRelationRadioCheckbox(array $return):array
    {
        $rel = $this->relation();

        if($this->getAttr('specificLink') && $rel->isRelationTable())
        {
            $relationTable = $rel->relationTable();

            if($relationTable->hasPermission('view'))
            {
                foreach ($return as $key => $value)
                {
                    $action = ($relationTable->hasPermission('lemurUpdate'))? 'modify':'view';
                    $segments = ['table'=>$relationTable,'primary'=>$key];
                    $specific = $this->route('specific',$segments);
                    $uri = $specific->uri();

                    if(!empty($uri))
                    {
                        $link = Html::a($uri,null,['icon','solo',$action]);
                        $return[$key] = [$value,$link];
                    }
                }
            }
        }

        return $return;
    }


    // prepareRelationPlainGeneral
    // méthode utilisé pour préparer l'affichage des relations plains (sans formulaire)
    // crée les routes spécifiques
    public function prepareRelationPlainGeneral(array $array):array
    {
        $return = [];
        $array = parent::prepareRelationPlainGeneral($array);
        $route = $this->routeClassSafe('specific');
        $relation = $this->relation();
        $table = null;

        if($relation->isRelationTable())
        $table = $relation->relationTable();

        foreach ($array as $key => $value)
        {
            if(is_int($key) && !empty($table) && !empty($route) && $table->hasPermission('view'))
            {
                $route = $route::make(['table'=>$table,'primary'=>$key]);
                $return[$key] = $route->a($value);
            }

            else
            $return[$key] = $value;
        }

        return $return;
    }


    // onGet
    // logique onGet pour un champ files
    // affichage spéciale si le contexte est cms:general
    public function onGet($return,array $option)
    {
        if($return instanceof Core\Cell\Relation && !$return->isNull() && !empty($option['context']) && is_string($option['context']) && strpos($option['context'],':general') !== false)
        {
            $output = $return->generalOutput($option);
            $return = Html::divCond($output,'relation');
        }

        else
        $return = parent::onGet($return,$option);

        return $return;
    }
}

// init
Relation::__init();