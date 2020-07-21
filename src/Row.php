<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// row
// extended class to represent a row within a table, adds cms config
class Row extends Core\Row implements Main\Contract\Meta
{
    // trait
    use Row\_meta;


    // config
    protected static array $config = [
        '@cms'=>[
            'cacheEmpty'=>true
        ]
    ];


    // getDataAttr
    // retourne les attr pour la ligne
    public function getDataAttr(array $return):array
    {
        return $return;
    }


    // getViewRouteType
    // retourne le type à utiliser pour voir la route via la page spécifique du cms
    public function getViewRouteType():?string
    {
        return null;
    }


    // lemurHomeFeedOutput
    // génère le rendu html de la page d'accueil du cms pour la row
    final public function lemurHomeFeedOutput(string $dateCol):string
    {
        $r = '';
        $table = $this->table();
        $route = $this->route();

        if($route->canTrigger())
        {
            $isUpdateable = ($table->hasPermission('lemurUpdate') && $this->isUpdateable());
            $icon = ($isUpdateable === true)? 'modify':'view';
            $tooltip = ($isUpdateable === true)? 'tooltip/rowModify':'tooltip/rowView';
            $commit = $this->cellsDateCommit()[$dateCol] ?? null;
            $image = $this->cellsImageFile(null,'lemurHome');
            $label = $this->label(null,100);
            $lang = static::lang();

            $attr = ['media'];
            if(!empty($image))
            $attr['style']['background-image'] = $image;
            else
            $attr[] = 'media-placeholder';

            $r .= Html::div(null,$attr);

            $middle = Html::h3($label);
            if(!empty($commit))
            $middle .= Html::divCond($this->lemurCommitOutput($commit),'commit');
            $r .= Html::div($middle,'title-commit');

            $attr = ['icon-solo',$icon,'data-tooltip'=>$lang->text($tooltip)];
            $icon = Html::div(null,$attr);
            $r .= Html::div($icon,'tools');

            $r = $route->a($r);
        }

        return $r;
    }


    // lemurCommitOutput
    // génère le rendu pour la ligne du dernier commit
    final protected function lemurCommitOutput(array $commit):string
    {
        $r = '';
        ['user'=>$user,'date'=>$date] = $commit;

        if(!empty($user))
        {
            $userRow = $user->relationRow();

            if(!empty($userRow))
            {
                $r = Html::span($user->label(),'label').':';
                $r .= Html::span($userRow->cellName(),'user');
                $r .= Html::span('-','separator');
                $r .= Html::span($date->get(),'date');
            }
        }

        return $r;
    }


    // isMediaSource
    // retourne vrai si la row est source de médias
    public static function isMediaSource():bool
    {
        return false;
    }
}
?>