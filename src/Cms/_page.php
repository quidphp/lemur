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

// _page
// trait that provides some practical methods to work with page route within the CMS
trait _page
{
    // config
    public static $configCmsPage = [
        'match'=>[
            'session'=>'canAccess']
    ];


    // trait
    use _templateAlias;


    // mainBottom
    // méthode abstraite, génère la partie principale de la page du cms
    abstract protected function mainBottom():string;


    // main
    // génère la division main pour la page du cms
    final protected function main():string
    {
        $r = '';

        $r .= Html::divOp('top');
        $r .= Html::divCond($this->mainTopLeft(),'left');
        $r .= Html::divCond($this->mainTopRight(),'right');
        $r .= Html::divCl();

        $r .= Html::div($this->mainBottom(),'bottom');

        return $r;
    }


    // mainTopLeft
    // génère la division en haut à gauche pour la page du cms
    final protected function mainTopLeft():string
    {
        $r = '';
        $r .= Html::divOp('title');
        $r .= $this->makeH1($this->title());
        $r .= Html::divCl();
        $r .= Html::divCond($this->getSubTitle(),'sub-title');

        return $r;
    }


    // mainTopRight
    // génère la division en haut à droite pour la page du cms
    final protected function mainTopRight():string
    {
        return '';
    }


    // getSubTitle
    // retourne le sous=titre à afficher pour la page, par défaut passe par lang text
    final public function getSubTitle():?string
    {
        $return = null;
        $className = static::className(true);
        $return = static::langText([$className,'subTitle']);

        return $return;
    }
}
?>