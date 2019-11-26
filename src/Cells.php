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
use Quid\Core;

// cells
// extended class for a collection of many cells within a same row
class Cells extends Core\Cells
{
    // config
    public static $config = [];


    // formComplex
    // génère les éléments formulaires complexes pour toutes les cellules
    final public function formComplex(bool $str=false)
    {
        $return = $this->pair('formComplex');
        return ($str === true)? implode($return):$return;
    }


    // formComplexWrap
    // génère les éléments formComplexWrap pour toutes les cellules
    final public function formComplexWrap(?string $wrap=null,$pattern=null,bool $str=false)
    {
        $return = $this->pair('formComplexWrap',$wrap,$pattern);
        return ($str === true)? implode($return):$return;
    }
    
    
    // specificComponentWrap
    // génère les éléments specificComponentWrap pour toutes les cellules
    final public function specificComponentWrap(?string $wrap=null,$pattern=null,bool $str=false)
    {
        $return = $this->pair('specificComponentWrap',$wrap,$pattern);
        return ($str === true)? implode($return):$return;
    }
}

// init
Cells::__init();
?>