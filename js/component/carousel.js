/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// carousel
// script for a carousel component based on the clickOpen logic
const Carousel = Component.Carousel = function(option)
{
    // option
    const $option = Object.assign({
        background: false,
        attr: 'data-carousel',
        multiple: true
    },option);
    

    // components
    Component.ClickOpenBase.call(this,$option);
    Component.ClickOpenTriggerBase.call(this,$option);
    
    return this;
}