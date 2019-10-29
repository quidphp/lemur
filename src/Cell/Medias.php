<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Core;
use Quid\Base\Html;

// medias
// class to manage a cell containing a value which is a link to many files
class Medias extends Core\Cell\Medias
{
    // config
    public static $config = [];
    
    
    // generalOutput
    // génère le output pour général, retourne seulement la première image de la cellule
    public function generalOutput(?array $option=null):string
    {
        $return = '';
        $slider = array();
        $col = $this->col();

        foreach($col->indexRange() as $index)
        {
            $value = $this->commonGeneralOutput($index,$option);
            
            if(!empty($value))
            $slider[$index] = $value;
        }
        
        if(!empty($slider))
        {
            if(count($slider) > 1)
            $return = Html::divCond($this->makeGeneralSlider($slider),'slider');
            
            else
            $return = current($slider);
        }
        
        return $return;
    }
    
    
    // makeGeneralSlider
    // génère le slider pour les images
    protected function makeGeneralSlider(array $slider):string 
    {
        $r = '';
        
        $r .= Html::div(null,array('triangle','prev'));
        $r .= Html::div(null,array('triangle','next'));
        
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