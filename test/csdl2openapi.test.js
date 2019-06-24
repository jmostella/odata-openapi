const assert = require('assert');
const fs = require('fs');

//TODO:
// key-as-segment
// key-aliases
// navigation to entity type with key inherited from base type
// navigation properties inherited from base type A.n1 -> B.n2 -> C.n3 
// collection-navigation to entity type without key or unknown entity type: suppress path item
// document without entity container, similar to csdl-16.2.xml, but with types
// remaining Edm types, especially Geo* - see odata-definitions.json
// (external) annotations on actions, functions, parameters, returntype
// control mapping of reference URLs 

const csdl = require('odata-csdl');
const lib = require('../lib/csdl2openapi');

const example1 = csdl.xml2json(fs.readFileSync('examples/csdl-16.1.xml'));
const result1 = require('../examples/csdl-16.1.openapi3.json');

const example2 = csdl.xml2json(fs.readFileSync('examples/TripPin.xml'));
const result2 = require('../examples/TripPin.openapi3.json');

const example3 = csdl.xml2json(fs.readFileSync('examples/miscellaneous.xml'));
const result3 = require('../examples/miscellaneous.openapi3.json');

const example4 = csdl.xml2json(fs.readFileSync('examples/example.xml'));
const result4 = require('../examples/example.openapi3.json');

const example5 = csdl.xml2json(fs.readFileSync('examples/annotations.xml'));
const result5 = require('../examples/annotations.openapi3.json');

const example6 = csdl.xml2json(fs.readFileSync('examples/containment.xml'));
const result6 = require('../examples/containment.openapi3.json');

const example7 = csdl.xml2json(fs.readFileSync('examples/authorization.xml'));
const result7 = require('../examples/authorization.openapi3.json');


describe('Examples', function () {

    it('csdl-16.1', function () {
        const openapi = lib.csdl2openapi(example1, { diagram: true });
        check(openapi, result1);
    })

    it('TripPin', function () {
        const openapi = lib.csdl2openapi(example2, {
            host: 'services.odata.org',
            basePath: '/V4/(S(cnbm44wtbc1v5bgrlek5lpcc))/TripPinServiceRW',
            diagram: true
        });
        check(openapi, result2);
    })

    it('miscellaneous', function () {
        const openapi = lib.csdl2openapi(example3, { scheme: 'http', diagram: true });
        check(openapi, result3);
    })

    it('example', function () {
        const openapi = lib.csdl2openapi(example4, {
            host: 'services.odata.org',
            basePath: '/V4/OData/(S(nsga2k1tyctb0cn0ofcgcn4o))/OData.svc',
            diagram: true
        });
        check(openapi, result4);
    })

    it('annotations', function () {
        const openapi = lib.csdl2openapi(example5, { diagram: true });
        check(openapi, result5);
    })

    it('containment', function () {
        const openapi = lib.csdl2openapi(example6, { diagram: true });
        check(openapi, result6);
    })

    it('next', function () {
        const openapi = lib.csdl2openapi(example7, { diagram: true });
        check(openapi, result7);
    })

})

function check(actual, expected) {
    assert.deepStrictEqual(Object.keys(actual.paths).sort(), Object.keys(expected.paths).sort(), 'Paths');
    assert.deepStrictEqual(operations(actual.paths), operations(expected.paths), 'Operations');
    assert.deepStrictEqual(actual, expected, 'OpenAPI document');
}

function operations(paths) {
    const p = {};
    Object.keys(paths).forEach(template => {
        p[template] = Object.keys(paths[template])
    });
    return p;
}