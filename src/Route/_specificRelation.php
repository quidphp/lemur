<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base\Html;
use Quid\Core;

// _specificRelation
// trait that provides methods to make an enumSet input
trait _specificRelation
{
    // trait
    use _colRelation;


    // config
    public static $configSpecificRelation = [
        'showCount'=>false // affiche le total pour chaque élément
    ];


    // trigger
    // lance la route specificRelation
    final public function trigger():string
    {
        $r = '';
        $grab = $this->relationGrab();

        if(!empty($grab))
        {
            ['result'=>$results,'count'=>$count] = $grab;

            if(is_array($results) && !empty($results))
            $r .= $this->makeResults($results,$count);
        }

        if(empty($r))
        $r = Html::h3(static::langText('common/nothing'));

        return $r;
    }


    // col
    // retourne l'objet colonne
    final protected function col():Core\Col
    {
        return $this->segment('col');
    }


    // makeResults
    // génère les résultats d'affichage pour les relations
    final protected function makeResults(array $array,?int $loadMore=null):string
    {
        $r = '';
        $col = $this->col();
        $selected = $this->segment('selected');

        if(!empty($array))
        {
            foreach ($array as $key => $value)
            {
                $html = $col->formComplexSearchChoices($key);
                $class = (in_array($key,$selected,true))? 'selected':null;
                $data = ['value'=>$key,'html'=>$html];
                $value = $col->valueExcerpt($value);
                $value = Html::span($value,'label-content');

                if($this->showCount())
                {
                    $count = $this->getCount($key);
                    $value .= Html::spanCond($count,'label-count');
                }

                $value = Html::button($value,[$class,'data'=>$data]);
                $r .= Html::li($value);
            }

            if(!empty($r) && is_int($loadMore))
            $r .= $this->loadMore($loadMore);

            $r = Html::ulCond($r);
        }

        return $r;
    }


    // getCount
    // retounrne le nombre de lignes dans la table qui ont la valeur donnée en argument pour cette colonne
    final protected function getCount(int $value):?int
    {
        return $this->col()->countPrimaries($value);
    }


    // showCount
    // retourne vrai s'il faut afficher le count
    final protected function showCount():bool
    {
        return $this->getAttr('showCount') ?? false;
    }
}
?>