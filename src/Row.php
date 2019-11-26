<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
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
    public static $config = [];


    // homeFeedOutput
    // génère le rendu html pour la route homeFeed du CMS
    final public function homeFeedOutput(string $dateCol):string
    {
        $r = '';
        $route = $this->route();
        $table = $this->table();
        $isUpdateable = ($table->hasPermission('view','lemurUpdate') && $this->isUpdateable())? true:false;
        $icon = ($isUpdateable === true)? 'modify':'view';
        $commit = $this->cellsDateCommit()[$dateCol] ?? null;
        $label = $this->label(null,100);

        $r .= Html::h3($label);

        if(!empty($commit))
        {
            $html = '';
            ['user'=>$user,'date'=>$date] = $commit;

            if(!empty($user))
            {
                $userRow = $user->relationRow();

                if(!empty($userRow))
                {
                    $html = Html::span($user->label(),'label').':';
                    $html .= Html::span($userRow->cellName(),'user');
                    $html .= Html::span('-','separator');
                    $html .= Html::span($date->get(),'date');
                }
            }

            $r .= Html::divCond($html,'commit');
        }

        $icon = Html::div(null,['icon-solo',$icon]);
        $r .= Html::div($icon,'tools');

        $r = $route->a($r);

        return $r;
    }
}
?>