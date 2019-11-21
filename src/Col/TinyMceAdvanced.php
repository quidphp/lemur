<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Col;

// tinyMceAdvanced
// class for a column which transforms the textarea in a complex tinymce WYSIWYG editor
class TinyMceAdvanced extends TinyMceAlias
{
    // config
    public static $config = [
        'tinymce'=>[ // custom, ce merge à la classe parent
            'plugins'=>'autolink code charmap fullscreen hr link lists paste print searchreplace visualblocks wordcount image media table',
            'toolbar'=>'styleselect removeformat visualblocks | bold italic underline | bullist numlist | link image media charmap hr table | searchreplace print code fullscreen',
            'media_alt_source'=>false,
            'media_poster'=>false,
            'table_appearance_options'=>false,
            'table_default_attributes'=>['border'=>0],
            'table_default_styles'=>['width'=>'100%','border-collapsed'=>'collapse'],
            'table_responsive_width'=>true,
            'table_advtab'=>true,
            'table_row_advtab'=>true,
            'table_cell_advtab'=>true,
            'table_style_by_css'=>true,
            'style_formats'=>[
                20=>['title'=>'alignLeft','wrapper'=>true,'selector'=>'*','attributes'=>['class'=>'align-left']],
                21=>['title'=>'alignCenter','wrapper'=>true,'selector'=>'*','attributes'=>['class'=>'align-center']],
                22=>['title'=>'alignRight','wrapper'=>true,'selector'=>'*','attributes'=>['class'=>'align-right']],
                23=>['title'=>'floatLeft','wrapper'=>true,'selector'=>'*','attributes'=>['class'=>'float-left']],
                24=>['title'=>'floatRight','wrapper'=>true,'selector'=>'*','attributes'=>['class'=>'float-right']]]]
    ];
}

// init
TinyMceAdvanced::__init();
?>