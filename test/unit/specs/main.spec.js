import { plus } from '/src/module/test'

describe("This is a plus test!", function() {

    it("Is plus", function() {

        expect(20).toEqual(plus(15,5));

    })

});
