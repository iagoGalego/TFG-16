import joint from 'jointjs'

joint.shapes.hmb = {}

joint.shapes.hmb.AutomaticChoice = joint.shapes.basic.Generic.extend({
    markup: `<g class='rotatable'>
                <g class='scalable'>
                    <g id='container'>
                        <path id='1' d='M125 4.2L245.6 125 125 245.7 4.2 125 125 4z'/>
                        <path id='2' d='M80.6 77.4l92 92m-95 0l92-92'/>
                    </g>
                </g>
                <text />
             </g>`,

    defaults: joint.util.deepSupplement({

        type: 'hmb.AutomaticChoice',
        attrs: {
            '.scalable':{
                transform: 'scale(.85)'
            },
            '#container': {
                stroke: '#000',
                'vector-effect': 'non-scaling-stroke'
            },
            '#1':{
                fill: '#fff',
                'stroke-width': 2,
                'stroke-linejoin': 'round',
                'transform': 'matrix(.2241 0 0 .22382 .0116 .0562)'
            },
            '#2': {
                fill: 'none',
                'stroke-width': 1.5,
                'stroke-linecap': 'round',
                transform: 'matrix(.2241 0 0 .22382 .0116 .0562)'
            },
            'text': {
                fill: '#000000',
                text: 'Automatic Choice',
                'font-size':16,
                'ref': '#container',
                'ref-x': .5,
                'x-alignment': 'middle',
                'ref-dy': 10,
                'font-family': 'Roboto, Arial, helvetica, sans-serif',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),
});
joint.shapes.hmb.UserChoice = joint.shapes.basic.Generic.extend({

    markup: `<g class='rotatable'>
                <g class='scalable'>
                    <g id='container'>
                        <path id='1' d='M27.9974.9545l27.0439 27.0439-27.0439 27.0438L.9536 27.9984z'/>
                        <path id='2' d='M27.5731 24.5804c3.727 0 6.7457-3.0187 6.7457-6.7456 0-3.727-3.0187-6.7457-6.7457-6.7457-3.727 0-6.7456 3.0187-6.7456 6.7457 0 3.727 3.0187 6.7456 6.7456 6.7456zm0 3.3728c-4.5027 0-13.4913 2.2598-13.4913 6.7457v3.3728h26.9826V34.699c0-4.4859-8.9886-6.7457-13.4913-6.7457z'/>
                    </g>
                </g>
                <text />
             </g>`,

    defaults: joint.util.deepSupplement({

        type: 'hmb.UserChoice',
        attrs: {
            '.scalable':{
                transform: 'scale(.85)'
            },
            '#container': {
                stroke: '#000',
                'vector-effect': 'non-scaling-stroke'
            },
            '#1':{
                fill: '#fff' ,
                stroke: '#000' ,
                'stroke-width': 2 ,
                'stroke-linejoin': 'round',
            },
            '#2': {
                fill: '#000000'
            },
            'text': {
                fill: '#000000',
                text: 'User Choice',
                'font-size':16,
                'ref': '#container',
                'ref-x': .5,
                'x-alignment': 'middle',
                'ref-dy': 10,
                'font-family': 'Roboto, Arial, helvetica, sans-serif',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),
});
joint.shapes.hmb.AndSplit = joint.shapes.basic.Generic.extend({

    markup: `<g class='rotatable'>
                <g class='scalable'>
                    <g id='container'>
                        <path id='1' d='M125 4.3L245.7 125 125 245.7 4.3 125z'/>
                        <path id='2' d='M61 122.3h130m-67 67.3v-130'/>
                    </g>
                </g>
                <text />
             </g>`,

    defaults: joint.util.deepSupplement({

        type: 'hmb.AndSplit',
        attrs: {
            '.scalable':{
                transform: 'scale(.85)'
            },
            '#container': {
                stroke: '#000',
                'vector-effect': 'non-scaling-stroke'
            },
            '#1': {
                fill: '#fff',
                'stroke-width': 2,
                'stroke-linejoin': 'round',
                transform: 'matrix(.22409 0 0 .2241 -.0094 -.0076)'
            },
            '#2': {
                fill: 'none',
                'stroke-width': 1.5,
                'stroke-linecap': 'round',
                transform: 'matrix(.22409 0 0 .2241 -.0094 -.0076)'
            },
            'text': {
                fill: '#000000',
                text: 'And split',
                'font-size':16,
                'ref': '#container',
                'ref-x': .5,
                'x-alignment': 'middle',
                'ref-dy': 10,
                'font-family': 'Roboto, Arial, helvetica, sans-serif',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),
});
joint.shapes.hmb.AutomaticTask = joint.shapes.basic.Generic.extend({

    markup: `<g class='rotatable'>
                <g class='scalable'>
                    <g id='container'>
                        <path id='1' d='M1.1374 1.1374h64.9252v45.7252H1.1374z'/>
                        <path class='gear' d='M63.1872 8.1504c.0192-.1536.0346-.3072.0346-.4704s-.0154-.3168-.0346-.4704l1.0406-.791c.096-.073.119-.2016.0576-.3072l-.985-1.6608c-.0767-.1056-.192-.144-.3071-.1056l-1.2288.48c-.2688-.192-.5376-.3514-.8448-.4704l-.192-1.273c-.0192-.1152-.1152-.2016-.2458-.2016h-1.9603c-.1248 0-.2304.0864-.242.2016l-.1842 1.273c-.2976.119-.576.2822-.8295.4704l-1.2288-.48c-.1152-.0442-.2438 0-.3033.1056l-.9888 1.6608c-.0653.1056-.0346.2342.0576.3072l1.0425.791a3.82 3.82 0 0 0-.0307.4704c0 .1594.0154.3168.0346.4704l-1.0368.793c-.096.071-.121.2016-.0615.3072l.9888 1.6608c.0576.1056.192.144.3072.1056l1.2288-.48c.263.192.5376.3494.841.4704l.1881 1.271c.0192.1152.121.2016.2458.2016h1.9776c.1152 0 .2208-.0864.2362-.2016l.1862-1.271c.3072-.121.576-.2842.8371-.4704l1.2288.48c.1152.0422.2362 0 .2957-.1056l.9792-1.6608c.0576-.1056.0384-.2362-.0576-.3072l-1.0368-.793zM59.52 9.36c-.9504 0-1.728-.7526-1.728-1.68 0-.9254.7776-1.68 1.728-1.68.9542 0 1.728.7546 1.728 1.68 0 .9274-.7738 1.68-1.728 1.68z'/>
                        <path class='gear' d='M57.1584 14.5037c.0192-.1536.0346-.3072.0346-.4704a3.444 3.444 0 0 0-.0346-.48l1.0426-.7872c.0921-.0768.1152-.2112.0576-.3072l-.987-1.6704c-.0575-.1152-.192-.1536-.3071-.1152l-1.2288.48c-.2688-.192-.5376-.3456-.8448-.4685l-.192-1.273c-.0192-.1152-.1152-.2016-.2458-.2016h-1.9603c-.1248 0-.2304.0768-.242.192l-.1842 1.275c-.2976.1228-.576.288-.8295.4742l-1.2288-.48c-.1152-.0384-.2438 0-.3033.1075l-.9888 1.6646a.234.234 0 0 0 .0576.3072l1.0425.793a3.8512 3.8512 0 0 0-.0307.4723c0 .1536.0154.313.0346.4666l-1.0368.7872a.2361.2361 0 0 0-.0615.3072l.9888 1.6627c.0576.1037.192.142.3072.1037l1.2288-.48c.263.192.5376.3494.841.4704l.1881 1.2672c.0192.1152.121.2016.2458.2016h1.9776c.1152 0 .2208-.0845.2362-.1997l.1862-1.271c.3072-.1249.576-.288.8371-.4743l1.2288.48c.1152.0442.2381 0 .2957-.1037l.9792-1.6627c.0576-.1037.0384-.2342-.0576-.3072l-1.0368-.791zm-3.6672 1.2096c-.9504 0-1.728-.7527-1.728-1.68 0-.9274.7776-1.6896 1.728-1.6896.9542 0 1.728.7488 1.728 1.6704 0 .9216-.7738 1.6704-1.728 1.6704z'/>    
                    </g>
                </g>
                <text />
             </g>`,

    defaults: joint.util.deepSupplement({

        type: 'hmb.AutomaticTask',
        attrs: {
            '.scalable':{
                transform: 'scale(1)'
            },
            '#container': {
                stroke: '#000',
                'vector-effect': 'non-scaling-stroke'
            },
            '#1':{
                fill: '#fff' ,
                stroke: '#000' ,
                'stroke-width': 2 ,
                'stroke-linecap': 'round' ,
                'stroke-linejoin': 'round',
            },
            '.gear': {
                fill: '#000'
            },
            'text': {
                fill: '#000000',
                text: 'Automatic Task',
                'font-size':16,
                'ref': '#container',
                'ref-x': .5,
                'x-alignment': 'middle',
                'ref-dy': 10,
                'font-family': 'Roboto, Arial, helvetica, sans-serif',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),
});
joint.shapes.hmb.UserTask = joint.shapes.basic.Generic.extend({

    markup: `<g class='rotatable'>
                <g class='scalable'>
                    <g id='container'>
                        <path id='1' d='M1.0801 1.0801H66.12V46.92H1.0801z'/>
                        <path id='2' d='M57.12 10.08c1.989 0 3.6-1.611 3.6-3.6s-1.611-3.6-3.6-3.6-3.6 1.611-3.6 3.6 1.611 3.6 3.6 3.6zm0 1.8c-2.403 0-7.2 1.206-7.2 3.6v1.8h14.4v-1.8c0-2.394-4.797-3.6-7.2-3.6z'/>
                    </g>
                </g>
                <text />
             </g>`,

    defaults: joint.util.deepSupplement({

        type: 'hmb.UserTask',
        attrs: {
            '.scalable':{
                transform: 'scale(1)'
            },
            '#container': {
                stroke: '#000',
                'vector-effect': 'non-scaling-stroke'
            },
            '#1': {
                fill: '#fff',
                stroke: '#000',
                'stroke-width': 2,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            },
            '#2': {
                fill: '#000'
            },
            'text': {
                fill: '#000000',
                text: 'User Task',
                'font-size':16,
                'ref': '#container',
                'ref-x': .5,
                'x-alignment': 'middle',
                'ref-dy': 10,
                'font-family': 'Roboto, Arial, helvetica, sans-serif',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),
});
joint.shapes.hmb.InitialTask = joint.shapes.basic.Generic.extend({

    markup: `<g class='rotatable'>
                <g class='scalable'>
                    <g id='container'>
                        <path id='1' d='M248.9407 124.4703a125.5297 123.411 0 1 1-251.0593 0 125.5297 123.411 0 1 1 251.0593 0z'/>
                    </g>
                </g>
                <text />
             </g>`,

    defaults: joint.util.deepSupplement({

        type: 'hmb.InitialTask',
        attrs: {
            '.scalable':{
                transform: 'scale(.85)'
            },
            '#container': {
                stroke: '#000',
                'vector-effect': 'non-scaling-stroke'
            },
            '#1': {
                transform: 'matrix(.21444 0 0 .21812 1.5279 .8589)',
                fill: '#fff',
                stroke: '#000',
                'stroke-width': 2,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            },
            'text': {
                fill: '#000000',
                text: 'Initial Task',
                'font-size':16,
                'ref': '#container',
                'ref-x': .5,
                'x-alignment': 'middle',
                'ref-dy': 10,
                'font-family': 'Roboto, Arial, helvetica, sans-serif',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),
});
joint.shapes.hmb.LastTask = joint.shapes.basic.Generic.extend({

    markup: `<g class='rotatable'>
                <g class='scalable'>
                    <g id='container'>
                        <path id='1' d='M248.9407 124.4703a125.5297 123.411 0 1 1-251.0593 0 125.5297 123.411 0 1 1 251.0593 0z'/>
                    </g>
                </g>
                <text />
             </g>`,

    defaults: joint.util.deepSupplement({

        type: 'hmb.LastTask',
        attrs: {
            '.scalable':{
                transform: 'scale(.85)'
            },
            '#container': {
                stroke: '#000',
                'vector-effect': 'non-scaling-stroke'
            },
            '#1': {
                transform: 'matrix(.21444 0 0 .21812 1.5279 .8589)',
                fill: '#000',
                stroke: '#000',
                'stroke-width': 4,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            },
            'text': {
                fill: '#000000',
                text: 'Last Task',
                'font-size':16,
                'ref': '#container',
                'ref-x': .5,
                'x-alignment': 'middle',
                'ref-dy': 10,
                'font-family': 'Roboto, Arial, helvetica, sans-serif',
            },
        },

    }, joint.shapes.basic.Generic.prototype.defaults),
});

export default joint.shapes.hmb