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

// crypt
// extended class for a cell with crypted data
class Crypt extends Core\CellAlias
{
    // config
    protected static array $config = [];


    // generalOutput
    // génère le output général pour une cellule contenant une valeur encrypté
    public function generalOutput(array $option):?string
    {
        return $this->makeCryptStatus();
    }


    // makeCryptStatus
    // génère la balise pour donner le statut sur le cryptage
    final public function makeCryptStatus():string
    {
        $return = '';

        if(!empty($this->value()))
        {
            $get = $this->get();
            $lang = $this->db()->lang();
            $status = (!empty($get))? 'valid':'invalid';
            $label = $lang->text(['crypt',$status]);
            $return .= Html::div($label,['crypt-status',"crypt-$status"]);
        }

        return $return;
    }
}

// init
Crypt::__init();
?>