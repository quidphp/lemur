<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
            '[vendorLemur]/js/vendor'=>'[publicJs]/vendor'],
        'concatenatePhp'=>[ // ajoute le namespace pour le concatenator php
            'quid'=>[
                'option'=>[
                    'namespace'=>[
                        __NAMESPACE__=>['closure'=>true],
                        Test\Lemur::class=>['closure'=>false]]]]],
        'concatenateJs'=>[
            '[publicJs]/include.js'=>[
                0=>'[vendorLemur]/js/base',
                1=>'[vendorLemur]/js/main',
                2=>'[vendorLemur]/js/core',
                10=>'[js]/include']],
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
            'compileScss'=>[
                '[publicCss]/cms.css'=>[
                    0=>'[vendorLemur]/scss/_include.scss',
                    1=>'[vendorLemur]/scss/cms/_include.scss',
                    2=>'[scss]/cms/_include.scss',
                    10=>'[vendorLemur]/scss/cms/cms.scss',
                    30=>'[scss]/cms/cms.scss'],
                '[publicCss]/tinymce.css'=>[
                    0=>'[vendorLemur]/scss/_include.scss',
                    1=>'[scss]/cms/_include.scss',
                    5=>'[vendorLemur]/scss/cms/tinymce.scss',
                    10=>'[scss]/cms/tinymce.scss']],
            'concatenateJs'=>[
                '[publicJs]/cms.js'=>[
                    0=>'[vendorLemur]/js/cms',
                    10=>'[js]/cms']]]
    ];


    // isCms
    // retourne vrai si la clé de l'application roulant présentement est cms
    public function isCms():bool
    {
        return ($this->type() === 'cms')? true:false;
    }
}

// init
Boot::__init();
?>