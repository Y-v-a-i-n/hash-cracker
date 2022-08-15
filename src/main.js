var type = 5,
    wordlist = null;
const fs = require("fs"),
    md2 = require("js-md2"),
    md4 = require("js-md4"),
    md5 = require("js-md5"),
    sha1 = require("js-sha1"),
    SHA224 = require("sha224"),
    sha224 = (hash) => {return SHA224(hash).toString("hex")},
    sha256 = require("js-sha256"),
    {SHA384} = require("sha2"),
    sha384 = (hash) => {return SHA384(hash).toString("hex")},
    sha512 = require("js-sha512"),
    {Whirlpool,encoders} = require("whirlpool-hash"),
    whirlpool = (hash) => {return encoders.toHex(new Whirlpool().getHash(hash))},
    lmhash = require('smbhash').lmhash,
    nthash = require('smbhash').nthash,
    RIPEMD160 = require('ripemd160'),
    ripeMD160 = (hash) => {return new RIPEMD160().update('42').digest('hex')},
    hashI = require("../hash.json"),
    db = require("../db.json"),
    Brute = require('./bruteforce.js'),
    Start = () => {
        const hash = String(document.getElementById('hash').value),
            jsonType = ["NT","LM","md2","md4","md5","sha1","sha224","sha256","sha385","sha512","ripeMD160","whirlpool"],
            jsonFunction = {"NT":nthash,"LM":lmhash,"md2":md2,"md4":md4,"md5":md5,"sha1":sha1,"sha224":sha224,"sha256":sha256,"sha384":sha384,"sha512":sha512,"ripeMD160":ripeMD160,"whirlpool":whirlpool};
        if(String(hashI[""+jsonType[type-1]]).length === hash.length){
            var skip = true
            db.hash.forEach(h => {
                if(h[""+jsonType[type-1]]==hash){
                    document.getElementById('result').placeholder = h["result"]
                    skip = false;
                }
            })
            if(skip){
                var skip1 = true
                if(wordlist !== null){
                    fs.readFile(wordlist, "utf8", (err, data) => {
                        if(!err){
                            data.replace(/\r|\"/gi,"").split("\n").forEach(txt => {
                                if(jsonFunction[""+jsonType[type-1]](txt)==hash){
                                    db.hash.push({"result":txt,"NT":nthash(txt),"LM":lmhash(txt),"md2":md2(txt),"md4":md4(txt),"md5":md5(txt),"sha1":sha1(txt),"sha224":sha224(txt),"sha256":sha256(txt),"sha384":sha384(txt),"sha512":sha512(txt),"ripeMD160":ripeMD160(txt),"whirlpool":whirlpool(txt)})
                                    fs.writeFile("./db.json",JSON.stringify(db),(err)=>{})
                                    document.getElementById('result').placeholder = txt;
                                    skip1 = false;
                                }
                            })
                        }else{
                            document.getElementById('result').placeholder = "An error has been occurred";
                        }
                    })
                }
                if(skip1){
                    var result = Brute({
                        lettersUpper:document.getElementById("lettersUpper").value,
                        lettersLower:document.getElementById("lettersLower").value,
                        numbers:document.getElementById("numbers").value,
                        special:document.getElementById("special").value,
                        whitespace:document.getElementById("whitespace").value,
                        maxLen:document.getElementById("maxLen").value,
                        hashF:jsonFunction[""+jsonType[type-1]]
                    })(hash).str
                    if(result){
                        db.hash.push({"result":result,"NT":nthash(result),"LM":lmhash(result),"md2":md2(result),"md4":md4(result),"md5":md5(result),"sha1":sha1(result),"sha224":sha224(result),"sha256":sha256(result),"sha384":sha384(result),"sha512":sha512(result),"ripeMD160":ripeMD160(result),"whirlpool":whirlpool(result)})
                        fs.writeFile("./db.json",JSON.stringify(db),(err)=>{})
                        document.getElementById('result').placeholder = result
                    }else{
                        document.getElementById('result').placeholder = "I didn't manage to crack this hash"
                    }
                }
            }
        }else{
            document.getElementById('result').placeholder = "Err :Invalid Hash"
        }
    },
    Update = () => {
        type = document.getElementById('type').value;
    },
    ChangeWL = () => {
        wordlist = document.getElementById('myFile').files["0"].path
    };