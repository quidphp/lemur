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
use Quid\Base\Html;
use Quid\Core;

// _specificAddMulti
// trait that provides common methods between the specificAdd and specificMulti routes
trait _specificAddMulti
{
    // trait
    use _specific;


    // onReplace
    // tableau onReplace pour la route
    final protected function onReplace(array $return):array
    {
        $return['title'] = $this->title();
        $return['metaDescription'] = $this->table()->description();

        return $return;
    }


    // isPanelVisible
    // retourne vrai si le panneau est visible
    final protected function isPanelVisible(Core\Cols $cols):bool
    {
        return ($cols->isHidden(static::session()))? false:true;
    }


    // makeTitleBox
    // génère le titre pour la page
    final protected function makeTitleBox():string
    {
        return $this->makeH1($this->makeTitle());
    }


    // colCell
    // retourne la colonne
    final protected function colCell(Core\Col $col):Core\Col
    {
        return $col;
    }


    // colCellVisible
    // retourne la colonne si elle est visible
    final protected function colCellVisible(Core\Col $col):?Core\Col
    {
        $return = null;

        $col = $this->colCell($col);
        $session = static::session();
        if($col->isVisible(true,null,$session))
        $return = $col;

        return $return;
    }


    // makeForm
    // génère le formulaire pour la page
    final protected function makeForm():string
    {
        $r = '';
        $route = $this->routeSubmit();
        $hasPanel = $this->hasPanel();
        $attr = ['specific-form',($hasPanel === true)? 'with-panel':null];

        $r .= $route->formOpen($attr);
        $r .= $this->makeFormHidden();
        $r .= Html::div($this->makeFormTop(),'form-top');
        $r .= Html::div($this->makeFormInner(),'form-inner');
        $r .= Html::div($this->makeFormBottom(),'form-bottom');
        $r .= Html::formCl();

        return $r;
    }


    // makeOperation
    // fait le bloc opération en haut à doite
    final protected function makeOperation():string
    {
        return $this->makeFormSubmit('top');
    }


    // makeFormBottom
    // génère la partie inférieure du formulaire
    final protected function makeFormBottom():string
    {
        return $this->makeFormSubmit('bottom');
    }
}
?>