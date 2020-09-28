<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;

// _page
// trait that provides some practical methods to work with page route within the CMS
trait _page
{
    // config
    protected static array $configCmsPage = [
        'match'=>[
            'session'=>'canAccess'],
        'group'=>'page'
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
        $html = Html::divCond($this->mainTopLeft(),'left');
        $html .= Html::divCond($this->mainTopRight(),'right');
        $r .= Html::div($html,'top');
        $r .= Html::div($this->mainBottom(),'bottom');

        return $r;
    }


    // mainTopLeft
    // génère la division en haut à gauche pour la page du cms
    final protected function mainTopLeft():string
    {
        $r = '';
        $h1Html = $this->makeH1($this->title());
        $r .= Html::div($h1Html,'title');
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
        $className = static::className(true);
        $lang = static::lang();

        return $lang->text([$className,'subTitle']);
    }
}
?>