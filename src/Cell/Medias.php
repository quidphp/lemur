<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cell;
use Quid\Base\Html;
use Quid\Core;

// medias
// class to manage a cell containing a value which is a link to many files
class Medias extends Core\Cell\Medias
{
    // config
    public static array $config = [];


    // generalOutput
    // génère le output pour général, retourne seulement la première image de la cellule
    final public function generalOutput(?array $option=null):string
    {
        $return = '';
        $slider = [];
        $col = $this->col();

        foreach ($col->indexRange() as $index)
        {
            $value = $this->commonGeneralOutput($index,$option);

            if(!empty($value))
            $slider[$index] = $value;
        }

        if(!empty($slider))
        {
            if(count($slider) > 1)
            $return = Html::divCond($this->makeGeneralSlider($slider),['slider','tabindex'=>0]);

            else
            $return = current($slider);
        }

        return $return;
    }


    // makeGeneralSlider
    // génère le slider pour les images
    final protected function makeGeneralSlider(array $slider):string
    {
        $r = '';

        $r .= Html::button(null,['triangle','prev']);
        $r .= Html::button(null,['triangle','next']);

        foreach ($slider as $value)
        {
            $r .= Html::divCond($value,'slider-element');
        }

        return $r;
    }
}

// init
Medias::__init();
?>