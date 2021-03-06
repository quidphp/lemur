<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Base\Html;
use Quid\Core;

// medias
// class to manage a cell containing a value which is a link to many files
class Medias extends Core\Cell\Medias
{
    // config
    protected static array $config = [];


    // downloadRoute
    // retourne la route pour le téléchargement
    final public function downloadRoute(int $index):Core\Route
    {
        return $this->commonDownloadRoute($index);
    }


    // generalOutput
    // génère le output pour général, retourne seulement la première image de la cellule
    final public function generalOutput(array $option):string
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


    // outputTableRelation
    // génère le output tableRelation pour medias
    final public function outputTableRelation():array
    {
        $return = [];
        $col = $this->col();

        foreach ($col->indexRange() as $index)
        {
            $output = $this->commonTableRelationOutput($index);

            if(!empty($output))
            $return[] = $output;
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