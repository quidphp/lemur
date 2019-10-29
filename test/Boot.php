<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Test\Lemur;
use Quid\Base;
use Quid\Lemur;

// boot
// class for testing Quid\Lemur\Boot
class Boot extends Base\Test
{
    // trigger
    public static function trigger(array $data):bool
    {
        // prepare
        $boot = Lemur\Boot::inst();

        // isCms
        assert(!$boot->isCms());

        // lang
        $lang = $boot->lang();
        assert(count($lang->relation('contextType')) === 3);
        assert(!empty($lang->tableDescription('user')));
        assert(!empty($lang->colDescription('metaKeywords_en')));
        assert(!empty($lang->panelDescription('default')));
        
        // service
        assert(Lemur\Service\React::monami('what',array('test'=>2),array('id'=>false)) === "<div data-component='Monami' data-namespace='quid.react' data-content='what' data-props='{&quot;test&quot;:2}' class='react-component'></div>");
        assert(strlen(Lemur\Service\React::monami(false,array('test'=>false))) === 158);
        assert(strlen(Lemur\Service\React::monAmi(null,array('test'=>null),array('id'=>false))) === 124);
        
        return true;
    }
}
?>