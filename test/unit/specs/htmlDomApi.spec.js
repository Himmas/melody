import { addClass, removeClass, hasClass, createElement} from '/src/modules/htmlDomApi'

describe('dom Api',()=>{

	var elemEmpty = document.createElement('div')

	// test addClass
	it('adds the specified class to the current element',()=>{

		var elem = document.createElement('div')

		addClass(elem,'classA')

		expect(elem.className).toBe('classA')

		addClass(elem,'classB classC')
		//多个
		expect(elem.className).toBe('classA classB classC')

		addClass(elem,'classB')
		// 重复
		expect(elem.className).toBe('classA classB classC')
	})

	// test hasClass
	it('determines whether the current element has the specified class',()=>{

		var elem = document.createElement('div')

		addClass(elem,'classA classB classC')

		expect(hasClass(elem,'classA')).toBe(true)

		// 空class处理
		expect(hasClass(elem,'')).toBe(false)

		expect(hasClass(elemEmpty,'classA')).toBe(false)

		expect(hasClass(elem,'classA classB')).toBe(true)

	})

	// test removeClass
	it('removes the specified class from the current element',()=>{

		var elem = document.createElement('div')

		addClass(elem,'classA classB classC')

		removeClass(elem,'classA')

		expect(elem.className).toBe('classB classC')

		removeClass(elem,'classC classB')
		//多个
		expect(elem.className).toBe('classB classC')

		removeClass(elem,'classA')

		expect(elem.className).toBe('classB classC')

	})

	//test createElement
	it('creates a new element with specified tagName',()=>{

		var element = createElement('div')

		expect(element.outerHTML).toBe('<div></div>')
 })

})
