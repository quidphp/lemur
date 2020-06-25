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
use Quid\Core;
use Quid\Lemur;

// _specificSubmit
// trait that provides commonly used methods for the specific submit routes of the CMS
trait _specificSubmit
{
    // trait
    use Lemur\Route\_formSubmit;


    // onAfterSuccessOrFailure
    final protected function onAfterSuccessOrFailure():void
    {
        $panel = $this->currentPanel();
        static::session()->flash()->set('currentPanel',$panel);
    }


    // routeSuccess
    // retourne la route en cas de succès ou échec de l'ajout
    final public function routeSuccess():Lemur\Route
    {
        return $this->specific();
    }


    // currentPanel
    // retourne le panel courant à partir de la requête
    final public function currentPanel():?string
    {
        return $this->request()->get(static::panelInputName());
    }


    // specific
    // retourne la route parent, peut retourner specific ou specificAdd
    final public function specific():Core\Route
    {
        return static::makeParent($this->segments());
    }
}
?>