//https://github.com/ArtskydJ/reverse-md5/blob/master/index.js modified
var xtend = require('xtend')
var chars = []

var defaultOpts = {
	lettersUpper: true,
	lettersLower: true,
	numbers: true,
	special: false,
	whitespace: false,
	maxLen: 4,
    hashF:null,
}
var strs = {
	lettersUpper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	lettersLower: 'abcdefghijklmnopqrstuvwxyz',
	numbers: '0123456789',
	special: '`~!@#$%^&*()-_=+|\\;:\'",.<>[]{}/?',
	whitespace: ' \t\n'
}

function optsToArray(opts) {
	var result = ''
	if (opts.lettersUpper)	result += strs.lettersUpper
	if (opts.lettersLower)	result += strs.lettersLower
	if (opts.numbers)		result += strs.numbers
	if (opts.special)		result += strs.special
	if (opts.whitespace)	result += strs.whitespace
	return result.split('')
}

function generate(length) {
	var res = chars[0]
	for(var i=1; i<length; i++)
		res += chars[0]
	return res
}

function Rnc(str, charEnd, veryEnd) {
	return (typeof str === 'object') ? {
		str:		(typeof str.str !== 'undefined')? str.str : '',
		charEnd:	(typeof str.charEnd !== 'undefined')? str.charEnd : false,
		veryEnd:	(typeof str.veryEnd !== 'undefined')? str.veryEnd : false
	} : {
		str:		(typeof str !== 'undefined')? str : '',
		charEnd:	(typeof charEnd !== 'undefined')? charEnd : false,
		veryEnd:	(typeof veryEnd !== 'undefined')? veryEnd : false
	}
}

function nextChar(str, ind) {
	var charIndex = chars.indexOf(str.charAt(ind))
	return {
		chr: chars[(charIndex+1)%chars.length],
		end: (charIndex >= chars.length-1)
	}
}

function replaceChar(str, ind, newChar) {
	var t1 = str.slice(0, ind)
	var t2 = str.slice(ind+1)
	return t1 + newChar + t2
}

function replaceNextChar(str, ind) {
	var nc = nextChar(str, ind)
	var str = replaceChar(str, ind, nc.chr)
	if (nc.end)
		if (ind===0)	str = generate(str.length+1)
		else			str = replaceNextChar(str, ind-1, nc.chr).str
	return {
		str: str,
		charEnd: nc.end,
		veryEnd: nc.end && ind===0
	}
}

function iterate(hash, maxLen, hashF) {
	var start = new Date().getTime()
	var rnc = new Rnc(chars[0])
	var status = {running: true, foundHash: false}
	var ind = 0

	for(var x=0; status.running; x++) {
		rnc = replaceNextChar(rnc.str, ind)
		ind = rnc.str.length-1
		if (String(hashF(rnc.str)).toUpperCase()===String(hash).toUpperCase()) {
			status.running = false
			status.foundHash = true
		} else if (rnc.veryEnd) {
			if (rnc.str.length>=maxLen)
				status.running = false
		}
	}
	if (status.foundHash) {
		var end = new Date().getTime()
		return {
			str: rnc.str,
			elapsed: (end - start) / 1000
		}
	} else {
		return new Error("No string found for hash %s", hash)
	}
}

module.exports = function Brute(constructorOpts) {
	return function brute(hash, opts) {
		opts = xtend(defaultOpts, constructorOpts, opts)
		chars = optsToArray( opts )
		return iterate(hash, opts.maxLen, opts.hashF)
	}
}