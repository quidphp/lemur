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
use Quid\Test;

// boot
// extended abstract class for the object that bootstraps the cms
abstract class Boot extends Core\Boot
{
    // config
    public static $config = [
        'types'=>['cms'], // ajout cms comme type
        'finderShortcut'=>[ // shortcut pour finder
            'vendorLemur'=>'[vendor]/quidphp/lemur'],
        'symlink'=>[
            '[vendorLemur]/vendor'=>'[publicJs]/vendor'],
        'compile'=>array(
            'php'=>[ // ajoute le namespace pour le concatenator php
                'quid'=>[
                    'option'=>[
                        'namespace'=>[
                            __NAMESPACE__=>['closure'=>true],
                            Test\Lemur::class=>['closure'=>false]]]]],
            'js'=>[
                '[publicJs]/include.js'=>[
                    0=>'[vendorLemur]/include']]),
        'roles'=>[
            'editor'=>[60]],
        '@cms'=>[
            'service'=>[
                'polyfill'=>Service\Polyfill::class,
                'jQuery'=>Service\JQuery::class,
                'jQueryUi'=>Service\JQueryUi::class,
                'react'=>Service\React::class,
                'tinymce'=>Service\TinyMce::class],
            'option'=>[
                'versionQuid'=>true,
                'background'=>null,
                'logo'=>null],
            'compile'=>array(
                'scss'=>[
                    '[publicCss]/cms.css'=>[
                        0=>'[vendorLemur]/include/css/_init.scss',
                        1=>'[vendorLemur]/cms/css/_include.scss',
                        5=>'[vendorLemur]/component',
                        10=>'[vendorLemur]/cms/css/index.scss'],
                    '[publicCss]/tinymce.css'=>[
                        0=>'[vendorLemur]/include/css/_init.scss',
                        5=>'[vendorLemur]/scss/tinymce.scss']],
                'js'=>[
                    '[publicJs]/cms.js'=>[
                        0=>'[vendorLemur]/cms',
                        1=>'[vendorLemur]/component']])]
    ];


    // isCms
    // retourne vrai si la clé de l'application roulant présentement est cms
    final public function isCms():bool
    {
        return ($this->type() === 'cms')? true:false;
    }
}

// init
Boot::__init();
?>