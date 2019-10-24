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
            '[vendorLemur]/js/vendor/jquery'=>'[publicJs]/jquery',
            '[vendorLemur]/js/vendor/tinymce'=>'[publicJs]/tinymce'],
        'concatenatePhp'=>[ // ajoute le namespace pour le concatenator php
            'quid'=>[
                'option'=>[
                    'namespace'=>[
                        __NAMESPACE__=>['closure'=>true],
                        Test\Lemur::class=>['closure'=>false]]]]],
        '@cms'=>[
            'service'=>[
                'jQuery'=>Service\JQuery::class,
                'jQueryUi'=>Service\JQueryUi::class,
                'tinymce'=>Service\TinyMce::class],
            'option'=>[
                'versionQuid'=>true,
                'background'=>null,
                'logo'=>null],
            'compileScss'=>[
                '[publicCss]/cms.css'=>[
                    0=>'[vendorLemur]/scss/utils/_include.scss',
                    1=>'[vendorLemur]/scss/cms/_include.scss',
                    2=>'[scss]/cms/_include.scss',
                    10=>'[vendorLemur]/scss/cms/cms.scss',
                    30=>'[scss]/cms/cms.scss'],
                '[publicCss]/tinymce.css'=>[
                    0=>'[vendorLemur]/scss/utils/_include.scss',
                    1=>'[scss]/cms/_include.scss',
                    5=>'[vendorLemur]/scss/cms/tinymce.scss',
                    10=>'[scss]/cms/tinymce.scss']],
            'concatenateJs'=>[
                '[publicJs]/utils.js'=>[
                    0=>'[vendorLemur]/js/utils'],
                '[publicJs]/component.js'=>[
                    0=>'[vendorLemur]/js/component'],
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